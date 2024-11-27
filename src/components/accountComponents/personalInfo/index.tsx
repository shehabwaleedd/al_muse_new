'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PenLine, CalendarIcon, MapPinIcon, BuildingIcon, BriefcaseIcon, PhoneIcon, MailIcon, UserIcon, Loader2, X } from 'lucide-react';
import { User } from '@/types/common';
import { PersonalInfoSkeleton } from '@/animation/skeleton/personalInfoSkeleton';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import DOMPurify from 'dompurify';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    age: z.string().min(1, 'Age is required'),
    phone: z.string().min(1, 'Phone is required'),
    country: z.string().min(1, 'Country is required'),
    region: z.string().min(1, 'Region is required'),
    company: z.string().min(1, 'Company is required'),
    position: z.string().min(1, 'Position is required'),
    gender: z.string().min(1, 'Gender is required'),
});

type FormValues = z.infer<typeof formSchema>;


interface PersonalInfoProps {
    user: User | null;
    onUpdate: (data: any) => void;
}

const InfoItem = ({
    label,
    value,
    icon: Icon
}: {
    label: string;
    value?: string | number;
    icon?: React.ElementType;
}) => (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {label}
            </span>
            <span className="text-sm font-medium">
                {value || '—'}
            </span>
        </div>
    </div>
);

const PersonalInfo: React.FC<PersonalInfoProps> = ({ user, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            country: user?.country || '',
            region: user?.region || '',
            company: user?.company || '',
            position: user?.position || '',
            age: user?.age?.toString() || '',
            gender: user?.gender || '',
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                email: user.email,
                phone: user.phone,
                country: user.country,
                region: user.region,
                company: user.company,
                position: user.position,
                age: user.age?.toString(),
                gender: user.gender,
            });
        }
    }, [user, form]);

    const ageOptions = Array.from({ length: 50 }, (_, i) => (i + 17).toString());

    const onSubmit = useCallback(async (values: FormValues) => {
        try {
            const sanitizedValues = {
                ...values,
                country: DOMPurify.sanitize(values.country),
                region: DOMPurify.sanitize(values.region)
            };

            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
                sanitizedValues,
                {
                    headers: {
                        token: Cookies.get('token') || '',
                    },
                }
            );

            if (response.status === 200 && response.data.message === 'success') {
                onUpdate(values);
                setIsEditing(false);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                form.setError('root', {
                    message: error.response?.data.message || 'An error occurred',
                });
            }
        }
    }, [form, onUpdate]);

    if (!user) {
        return (
            <PersonalInfoSkeleton />
        );
    }

    return (
        <motion.div
            className="w-full h-full flex flex-col justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-b from-white to-gray-50/50">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold">Personal Info</h2>
                            <span className="text-xs text-muted-foreground">Profile details</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                                if (isEditing) {
                                    form.reset({
                                        name: user.name,
                                        email: user.email,
                                        phone: user.phone,
                                        country: user.country,
                                        region: user.region,
                                        company: user.company,
                                        position: user.position,
                                        age: user.age?.toString(),
                                        gender: user.gender,
                                    });
                                }
                                setIsEditing(!isEditing);
                            }}
                        >
                            {isEditing ? (
                                <>
                                    <X className="h-3.5 w-3.5 mr-2" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <PenLine className="h-3.5 w-3.5 mr-2" />
                                    Edit
                                </>
                            )}
                        </Button>
                    </div>

                    {isEditing ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-screen-lg mx-auto">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <FormControl>
                                                    <CountryDropdown
                                                        classes="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={field.value}
                                                        onChange={(val) => field.onChange(val)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="region"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Region</FormLabel>
                                                <FormControl>
                                                    <RegionDropdown
                                                        country={form.getValues('country')}
                                                        classes="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={field.value}
                                                        onChange={(val) => field.onChange(val)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="age"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Age</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select age" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {ageOptions.map((age) => (
                                                            <SelectItem key={age} value={age}>
                                                                {age}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Gender</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {['Male', 'Female', 'Other'].map((gender) => (
                                                            <SelectItem key={gender} value={gender.toLowerCase()}>
                                                                {gender}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="company"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="position"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Position</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

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
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-screen-lg mx-auto">
                            <InfoItem label="Name" value={user.name} icon={UserIcon} />
                            <InfoItem label="Email" value={user.email} icon={MailIcon} />
                            <InfoItem label="Phone" value={user.phone} icon={PhoneIcon} />
                            <InfoItem label="Gender" value={user.gender} icon={UserIcon} />
                            <InfoItem label="Age" value={user.age} icon={CalendarIcon} />
                            <InfoItem label="Country" value={user.country} icon={MapPinIcon} />
                            <InfoItem label="Region" value={user.region} icon={MapPinIcon} />
                            <InfoItem label="Company" value={user.company} icon={BuildingIcon} />
                            <InfoItem label="Position" value={user.position} icon={BriefcaseIcon} />
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t">
                        <span className="text-[10px] text-muted-foreground">
                            Last updated: {new Date(user.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default PersonalInfo;