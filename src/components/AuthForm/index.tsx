'use client'
import { useSubComponents } from '@/context/SubComponentsContext';
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'
const LoginComponent = dynamic(() => import('@/components/accountComponents/loginComponent'), { ssr: false });
const RegisterComponent = dynamic(() => import('@/components/accountComponents/registerComponent'), { ssr: false });
const Header = dynamic(() => import('@/components/accountComponents/header'), { ssr: false });
const TellUsYourStory = dynamic(() => import('@/components/tellStory'), { ssr: false });
const TeamOverlay = dynamic(() => import('@/components/team'), { ssr: false });
const ForgetPassword = dynamic(() => import('@/components/accountComponents/forgetPassword'), { ssr: false });
const AuthForms = () => {

    const { isLoginOpen, isRegisterOpen, isForgetPasswordOpen, profileHeaderOpen, tellUsYourStory, setTellUsYourStory, setIsLoginOpen, setIsRegisterOpen, setIsForgetPasswordOpen, teamOpened, setProfileHeaderOpen } = useSubComponents()
    
    return (
        <AnimatePresence mode='wait'>
            {isLoginOpen && <LoginComponent handleClose={() => setIsLoginOpen(false)} />}
            {isRegisterOpen && <RegisterComponent handleClose={() => setIsRegisterOpen(false)} />}
            {isForgetPasswordOpen && <ForgetPassword handleClose={() => setIsForgetPasswordOpen(false)} />}
            {profileHeaderOpen && <Header handleClose={() => setProfileHeaderOpen(false)} />}
            {tellUsYourStory && <TellUsYourStory handleClose={() => setTellUsYourStory(false)} />}
            {teamOpened && <TeamOverlay />}

        </AnimatePresence>
    )
}

export default AuthForms