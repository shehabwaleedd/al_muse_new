'use server'

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { UserRole } from '@/types/common';
export async function convertUserRole(userId: string, newRole: UserRole) {
    try {
        const token = cookies().get('token')?.value;

        const response = await fetch(`${process.env.API_URL}/user/convertUserRole/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'token': token || '',
            },
            body: JSON.stringify({ role: newRole }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user role');
        }

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update user role'
        };
    }
}

export async function deleteUser(userId: string) {
    try {
        const token = cookies().get('token')?.value;

        const response = await fetch(`${process.env.API_URL}/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': token || '',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete user');
        }

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete user'
        };
    }
}
