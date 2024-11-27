'use client';
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User } from '@/types/common';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface SubComponentCotextType {
    isLoginOpen: boolean;
    setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isRegisterOpen: boolean;
    setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
    profileHeaderOpen: boolean;
    setProfileHeaderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleLoginSuccessForm: (token: string, userData: User) => void;
    handleLoginIsOpen: () => void;
    handleRegisterIsOpen: () => void;
    handleProfileHeaderOpen: () => void;
    handleLogOutForm: () => void;
    handleTellUsYourStory: () => void;
    tellUsYourStory: boolean;
    setTellUsYourStory: React.Dispatch<React.SetStateAction<boolean>>;
    teamOpened: boolean;
    setTeamOpened: React.Dispatch<React.SetStateAction<boolean>>;
    handleTeamOpened: () => void;
    isAnyModalOpen: boolean;
    isForgetPasswordOpen: boolean;
    setIsForgetPasswordOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleForgetPassword: () => void;
}

const SubComponentCotext = createContext<SubComponentCotextType | undefined>(undefined);

export const useSubComponents = (): SubComponentCotextType => {
    const context = useContext(SubComponentCotext);
    if (!context) {
        throw new Error('useSubComponent must be used within a SubComponentProvider');
    }
    return context;
};

interface SubComponentProviderProps {
    children: ReactNode;
}

export const SubComponentCotextProvider: React.FC<SubComponentProviderProps> = ({ children }) => {
    const { setIsLoggedIn, setUser } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
    const [profileHeaderOpen, setProfileHeaderOpen] = useState<boolean>(false);
    const [tellUsYourStory, setTellUsYourStory] = useState<boolean>(false)
    const [teamOpened, setTeamOpened] = useState<boolean>(false)
    const [isForgetPasswordOpen, setIsForgetPasswordOpen] = useState<boolean>(false)
    const router = useRouter();


    useEffect(() => {
        setProfileHeaderOpen(false);
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
        setTellUsYourStory(false);
        setTeamOpened(false)
        setIsForgetPasswordOpen(false)
    }, [router])

    const handleLoginIsOpen = () => {
        setIsLoginOpen(true);
        setIsRegisterOpen(false);
        setIsForgetPasswordOpen(false)
    }

    const handleTeamOpened = () => {
        setTeamOpened(prev => !prev)
    }

    const handleRegisterIsOpen = () => {
        setIsRegisterOpen(true);
        setIsLoginOpen(false);
        setIsForgetPasswordOpen(false)
    }

    const handleProfileHeaderOpen = () => {
        setProfileHeaderOpen(prev => !prev);
    }

    const handleTellUsYourStory = () => {
        setTellUsYourStory(!tellUsYourStory)
    }

    const handleForgetPassword = () => {
        setIsForgetPasswordOpen(true)
        setIsLoginOpen(false)
        setIsRegisterOpen(false)
    }


    const handleLoginSuccessForm = (token: string, userData: User) => {
        Cookies.set('token', token, { expires: 1 });
        localStorage.setItem('userId', userData._id);
        toast.success('Login successful');
        setUser(userData);
        setIsLoggedIn(true);
    };

    const handleLogOutForm = () => {
        Cookies.remove('token');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setProfileHeaderOpen(false);
        setUser(null);
        toast.success('Logout successful');
    }


    const contextValue = useMemo(
        () => ({
            isLoginOpen,
            setIsLoginOpen,
            handleLoginSuccessForm,
            isRegisterOpen,
            setIsRegisterOpen,
            handleRegisterIsOpen,
            handleLoginIsOpen,
            profileHeaderOpen,
            setProfileHeaderOpen,
            handleProfileHeaderOpen,
            handleLogOutForm,
            handleTellUsYourStory,
            tellUsYourStory,
            setTellUsYourStory,
            teamOpened,
            setTeamOpened,
            handleTeamOpened,
            isAnyModalOpen: isLoginOpen || isRegisterOpen || profileHeaderOpen || tellUsYourStory || teamOpened || isForgetPasswordOpen,
            isForgetPasswordOpen,
            setIsForgetPasswordOpen,
            handleForgetPassword,
        }),
        [isLoginOpen, isRegisterOpen, profileHeaderOpen, tellUsYourStory, teamOpened, isForgetPasswordOpen]
    );

    return <SubComponentCotext.Provider value={contextValue}>{children}</SubComponentCotext.Provider>;
};
