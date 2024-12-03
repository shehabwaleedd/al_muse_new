import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';
import type { User, EventType } from '@/types/common';

interface AnalyticsDataState {
    users: User[];
    events: EventType[];
    isLoading: boolean;
    error: string | null;
}

interface ApiResponse<T> {
    data: {
        result: T[];
    };
}

interface ApiErrorResponse {
    message: string;
}

export const useAnalyticsData = () => {
    const { user: currentUser, handleLogout } = useAuth();
    const [state, setState] = useState<AnalyticsDataState>({
        users: [],
        events: [],
        isLoading: true,
        error: null,
    });

    const handleError = useCallback((error: Error | AxiosError<ApiErrorResponse>) => {
        console.error('Analytics fetch error:', error);

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                handleLogout();
                setState(prev => ({
                    ...prev,
                    error: 'Session expired. Please login again.',
                    isLoading: false
                }));
                return;
            }

            setState(prev => ({
                ...prev,
                error: error.response?.data?.message || 'Failed to fetch analytics data',
                isLoading: false
            }));
        } else {
            setState(prev => ({
                ...prev,
                error: 'An unexpected error occurred',
                isLoading: false
            }));
        }
    }, [handleLogout]);

    const fetchAnalyticsData = useCallback(async () => {
        const token = Cookies.get('token');

        if (!token) {
            handleLogout();
            setState(prev => ({
                ...prev,
                error: 'Authentication token not found',
                isLoading: false
            }));
            return;
        }

        const headers = { token };

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const responses = {
                users: [] as User[],
                events: [] as EventType[]
            };

            const requests = [];

            if (currentUser?.role === 'superAdmin') {
                requests.push(
                    axios.get<ApiResponse<User>>(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/user`,
                        { headers }
                    ).then(res => {
                        responses.users = res.data.data.result;
                    })
                );
            }

            if (['superAdmin', 'admin'].includes(currentUser?.role || '')) {
                requests.push(
                    axios.get<ApiResponse<EventType>>(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/event`,
                        { headers }
                    ).then(res => {
                        responses.events = res.data.data.result;
                    })
                );
            } else if (currentUser?._id) {
                requests.push(
                    axios.get<ApiResponse<EventType>>(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/event/user/${currentUser._id}`,
                        { headers }
                    ).then(res => {
                        responses.events = res.data.data.result;
                    })
                );
            }

            await Promise.all(requests);

            setState({
                users: responses.users,
                events: responses.events,
                isLoading: false,
                error: null
            });

        } catch (error) {
            handleError(error as Error | AxiosError<ApiErrorResponse>);
        }
    }, [currentUser, handleError, handleLogout]);

    useEffect(() => {
        fetchAnalyticsData();
        const refreshInterval = setInterval(fetchAnalyticsData, 5 * 60 * 1000);
        return () => clearInterval(refreshInterval);
    }, [fetchAnalyticsData]);

    return {
        ...state,
        currentUser,
        refreshData: fetchAnalyticsData,
        clearError: () => setState(prev => ({ ...prev, error: null }))
    };
};