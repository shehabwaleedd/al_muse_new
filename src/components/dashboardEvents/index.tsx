'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { EventType } from '@/types/common';
import Loading from '@/animation/loading/Loading';
import Cookies from 'js-cookie';

type UserRole = 'superAdmin' | 'admin' | 'user';
type ActionType = 'delete' | 'publish' | 'display';

interface DashboardEventsProps {
    events: EventType[];
    loading: boolean;
    title?: string;
    refreshEvents: () => void;
}

interface ActionConfig {
    message: string;
    url: (id: string) => string;
    method: 'PATCH' | 'DELETE';
    successMessage: string;
    errorMessage: string;
    confirmMessage?: string | ((currentStatus: string) => string) | ((isDisplayed: boolean) => string);
    getPayload?: (currentState: boolean | string) => FormData | { status: string };
}


const ACTION_CONFIG: Record<ActionType, ActionConfig> = {
    delete: {
        message: 'Deleting event...',
        url: (id) => `${process.env.NEXT_PUBLIC_BASE_URL}/event/changeState/${id}`,
        method: 'DELETE',
        successMessage: 'Event deleted successfully',
        errorMessage: 'Failed to delete event',
        confirmMessage: 'Are you sure you want to delete this event?'
    },
    publish: {
        message: 'Updating event status...',
        url: (id) => `${process.env.NEXT_PUBLIC_BASE_URL}/event/changeState/${id}`,
        method: 'PATCH',
        successMessage: 'Event status updated successfully',
        errorMessage: 'Failed to update event status',
        confirmMessage: (currentStatus: string) =>
            `Are you sure you want to ${currentStatus === 'published' ? 'unpublish' : 'publish'} this event?`,
        getPayload: (currentStatus) => ({
            status: currentStatus === 'published' ? 'pending' : 'published'
        })
    },
    display: {
        message: 'Updating display status...',
        url: (id) => `${process.env.NEXT_PUBLIC_BASE_URL}/event/${id}`,
        method: 'PATCH',
        successMessage: 'Display status updated successfully',
        errorMessage: 'Failed to update display status',
        confirmMessage: (isDisplayed: boolean) =>
            `Are you sure you want to ${isDisplayed ? 'hide' : 'display'} this event?`,
        getPayload: (isDisplayed) => {
            const formData = new FormData();
            formData.append('isDisplayed', (!isDisplayed).toString());
            return formData;
        }
    }
};

interface StatusBadgeProps {
    onClick?: () => void;
    isActive: boolean;
    activeText: string;
    inactiveText: string;
    loading?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
    onClick,
    isActive,
    activeText,
    inactiveText,
    loading = false
}) => (
    <button
        onClick={onClick}
        disabled={loading}
        className={`
            px-4 py-2 rounded-lg text-sm transition-all relative
            ${isActive ? 'bg-green-200 hover:bg-green-300' : 'bg-gray-100 hover:bg-gray-200'}
            ${loading ? 'cursor-wait' : onClick ? 'cursor-pointer' : 'cursor-default'}
            disabled:opacity-50
        `}
    >
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center"
                >
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                </motion.div>
            ) : (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {isActive ? activeText : inactiveText}
                </motion.span>
            )}
        </AnimatePresence>
    </button>
);

interface EventCardProps {
    event: EventType;
    onAction: (action: ActionType, data?: { status?: string; isDisplayed?: boolean }) => Promise<void>;
    loading: Record<ActionType, boolean>;
    userRole: UserRole;
}


const EventCard: React.FC<EventCardProps> = ({
    event,
    onAction,
    loading,
    userRole
}) => {
    const router = useRouter();

    const truncatedDescription = useMemo(() =>
        event?.description?.replace(/<[^>]*>/g, '').slice(0, 150) + '...' || '',
        [event?.description]
    );

    const truncatedTitle = useMemo(() =>
        (event?.title?.length || 0) > 20 ? event?.title?.slice(0, 20) + '...' : event?.title || '',
        [event?.title]
    );

    const handleAction = useCallback(async (action: ActionType) => {
        try {
            let data;

            if (action === 'publish') {
                data = { status: event.status === 'published' ? 'pending' : 'published' };
            } else if (action === 'display') {
                data = { isDisplayed: !event.isDisplayed };
            }

            await onAction(action, data);
        } catch (error) {
            console.error(`Error during ${action} action:`, error);
        }
    }, [onAction, event.status, event.isDisplayed]);

    const canManageEvent = userRole === 'superAdmin' || userRole === 'admin';

    return (
        <div className="flex flex-col w-full h-full border rounded-lg overflow-hidden bg-white/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative w-full h-[45%] min-h-[200px]">
                <Image
                    src={event.mainImg?.url ?? '/noimage.png'}
                    alt={event.title || 'Event image'}
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent">
                    <div className="absolute inset-0 flex flex-col justify-between p-4">
                        <div className="w-full">
                            <div className="flex justify-between w-full gap-2">
                                {canManageEvent && (
                                    <StatusBadge
                                        isActive={event.status === 'published'}
                                        activeText="Published"
                                        inactiveText="Pending"
                                        onClick={() => handleAction('publish')}
                                        loading={loading.publish}
                                    />
                                )}
                                {userRole === 'superAdmin' && (
                                    <StatusBadge
                                        isActive={event.isDisplayed ?? false}
                                        activeText="Displayed"
                                        inactiveText="Hidden"
                                        onClick={() => handleAction('display')}
                                        loading={loading.display}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end w-full gap-2">
                            {canManageEvent && (
                                <>
                                    <button
                                        onClick={() => router.push(`/account/events/edit/${event.slug}`)}
                                        className="px-4 py-2 rounded-lg text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleAction('delete')}
                                        disabled={loading.delete}
                                        className={`
                                            px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition-colors
                                            ${loading.delete ? 'opacity-70' : ''}
                                        `}
                                    >
                                        {loading.delete ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : 'Delete'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-grow p-4 gap-3">
                <div className="flex justify-between w-full text-red-500">
                    <h2 className="font-header text-md sm:text-lg leading-tight tracking-tight capitalize">
                        {truncatedTitle}
                    </h2>
                </div>
                <span className="font-light text-sm tracking-wide capitalize break-words flex-grow">
                    {truncatedDescription}
                </span>
                <div className="flex justify-between w-full text-sm">
                    <span className="font-medium text-blue-600">
                        {event.category || 'Uncategorized'}
                    </span>
                    <span className="font-medium text-blue-600">
                        {event.dateOfEvent || 'No date'}
                    </span>
                </div>
            </div>
        </div>
    );
};


const DashboardEvents: React.FC<DashboardEventsProps> = ({
    events,
    loading: pageLoading,
    title,
    refreshEvents,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
    const isAccountPage = /^\/account($|\/.*)/.test(pathname);

    const [actionLoading, setActionLoading] = useState<Record<string, Record<ActionType, boolean>>>({});

    const handleAction = useCallback(async (
        eventId: string, 
        action: ActionType, 
        data?: { status?: string; isDisplayed?: boolean }
    ) => {
        const config = ACTION_CONFIG[action];

        setActionLoading(prev => ({
            ...prev,
            [eventId]: { ...prev[eventId], [action]: true }
        }));

        try {
            const confirmMessage = typeof config.confirmMessage === 'function'
                ? (config.confirmMessage as (value: string | boolean | undefined) => string)(data?.status || data?.isDisplayed)
                : config.confirmMessage;

            if (confirmMessage && !window.confirm(confirmMessage)) {
                return;
            }

            const loadingToast = toast.loading(config.message);

            await axios({
                method: config.method,
                url: config.url(eventId),
                data,
                headers: {
                    token: Cookies.get('token')
                }
            });

            toast.dismiss(loadingToast);
            toast.success(config.successMessage);
            refreshEvents();

        } catch (error) {
            console.error(`Error during ${action} action:`, error);
            toast.error(config.errorMessage);

        } finally {
            setActionLoading(prev => ({
                ...prev,
                [eventId]: { ...prev[eventId], [action]: false }
            }));
        }
    }, [refreshEvents]);

    if (pageLoading) {
        return (
            <div className="w-full h-[50vh] flex items-center justify-center">
                <Loading height={100} />
            </div>
        );
    }

    return (
        <motion.section
            className="flex flex-col gap-4 p-4 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {title && (
                <div className="flex justify-between items-center w-full border-b">
                    <h1 className="font-header text-2xl capitalize">{title}</h1>
                    {!isAccountPage && (
                        <button
                            onClick={() => router.push('/account')}
                            className="text-sm">
                            Back to account
                        </button>
                    )}
                </div>
            )}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 w-full justify-center">
                <AnimatePresence mode="popLayout">
                    {events.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            userRole={user?.role as UserRole || 'user'}
                            onAction={(action, data) => handleAction(event._id!, action, data)}
                            loading={actionLoading[event._id!] || {
                                delete: false,
                                publish: false,
                                display: false
                            }}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </motion.section>
    );
};

export default DashboardEvents;