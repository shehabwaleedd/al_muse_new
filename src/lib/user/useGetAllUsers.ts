import { useCallback, useState } from 'react'
import axios from 'axios'
import { User } from '@/types/common'
import Cookies from 'js-cookie'

export const useGetAllUsers = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getAllUsers = useCallback(async () => {
        const token = Cookies.get('token');
        if (!token) {
            setError('No authentication token found');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
                headers: { token },
            });
            const filteredUsers = response.data.data.result.filter((user: User) => user.role !== "superAdmin");
            setUsers(filteredUsers);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, []); 

    return { users, getAllUsers, loading, error }
}

export default useGetAllUsers