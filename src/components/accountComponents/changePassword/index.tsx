'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import axios from 'axios'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

const changePasswordSchema = z.object({
    password: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/,
            'Password must contain at least 8 characters, one letter, and one number'
        ),
    reNewPassword: z.string().min(1, 'Confirming new password is required'),
}).refine((data) => data.newPassword !== data.password, {
    message: "New password must be different from current password",
    path: ["newPassword"],
}).refine((data) => data.newPassword === data.reNewPassword, {
    message: "Passwords must match",
    path: ["reNewPassword"],
})

type ChangePasswordValues = z.infer<typeof changePasswordSchema>

export default function ChangePasswordForm() {
    const form = useForm<ChangePasswordValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            password: '',
            newPassword: '',
            reNewPassword: '',
        },
    })

    const onSubmit = async (values: ChangePasswordValues) => {
        try {
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/user/changePassword`,
                values,
                {
                    headers: { token: localStorage.getItem('token') },
                }
            )

            if (response.data.success) {
                toast.success('Password changed successfully')
                form.reset()
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.err || 'Error changing password. Please try again.'
            toast.error(errorMessage)
            form.setError('root', { message: errorMessage })
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="reNewPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.formState.errors.root && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {form.formState.errors.root.message}
                                </AlertDescription>
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Changing Password...
                                </>
                            ) : (
                                'Change Password'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
