'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import Cookies from 'js-cookie';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEventBySlug } from '@/lib/events/client/useEventBySlug';
import RichTextEditor from '../../components/RichTextEditor';
import { FormValues, LocationType, Category, categories } from '@/types/common';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import DOMPurify from 'dompurify';

interface TimeOfEvent {
    from: string;
    to: string;
}


interface Image {
    url: string;
    file: File | string;
}



interface ImageUploaderProps {
    mainImg: File | string | null;
    setMainImg: React.Dispatch<React.SetStateAction<File | string | null>>;
    label: string;
}

interface EditEventProps {
    params: { slug: string };
}

const validationSchema = Yup.object({
    title: Yup.string()
        .required('Title is required')
        .min(3, "Title must be at least 3 characters")
        .max(150, "Title cannot exceed 150 characters"),
    description: Yup.string()
        .required('Description is required')
        .min(100, 'Description must be at least 100 characters')
        .max(4000, 'Description cannot exceed 4000 characters'),
    dateOfEvent: Yup.date()
        .required('Date is required')
        .min(new Date(), 'Event date cannot be in the past'),
    timeOfEvent: Yup.object().shape({
        from: Yup.string().required('Start time is required'),
        to: Yup.string().required('End time is required')
            .test('is-after-start', 'End time must be after start time', function (this: Yup.TestContext, value: string) {
                const { from } = this.parent;
                if (!from || !value) return true;
                return value > from;
            })
    }),
    location: Yup.string()
        .oneOf(['online', 'offline'] as const, 'Invalid location type')
        .required('Location type is required'),
    category: Yup.string()
        .oneOf(categories, 'Invalid category')
        .required('Category is required'),
    link: Yup.string().when('location', {
        is: 'online',
        then: (schema: Yup.StringSchema) => schema
            .required('Link is required for online events')
            .min(10, 'Link must be at least 10 characters')
            .max(100, 'Link cannot exceed 100 characters')
            .url('Must be a valid URL'),
        otherwise: (schema: Yup.StringSchema) => schema.nullable()
    }),
    locationDetails: Yup.string().when('location', {
        is: 'offline',
        then: (schema: Yup.StringSchema) => schema
            .required('Location details are required for offline events')
            .min(10, 'Location details must be at least 10 characters')
            .max(500, 'Location details cannot exceed 500 characters'),
        otherwise: (schema: Yup.StringSchema) => schema.nullable()
    }),
    country: Yup.string()
        .min(2, 'Country name must be at least 2 characters')
        .max(50, 'Country name cannot exceed 50 characters'),
    city: Yup.string()
        .min(2, 'City name must be at least 2 characters')
        .max(50, 'City name cannot exceed 50 characters'),
    googleMapLink: Yup.string().nullable(),
    seoKeywords: Yup.array().of(Yup.string())
});

const generateTimes = (): string[] => {
    const times = [];
    for (let i = 0; i < 24; i++) {
        const time = `${i < 10 ? `0${i}` : i}:00`;
        times.push(time);
    }
    return times;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ mainImg, setMainImg, label }) => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const image = e.target.files?.[0];
        if (image) {
            setMainImg(image);
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="mainImg">{label} Image</Label>
            <Input
                id="mainImg"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
            />
            {mainImg && (
                <Image
                    src={typeof mainImg === 'string' ? mainImg : URL.createObjectURL(mainImg)}
                    alt="Event Main Image"
                    width={500}
                    height={500}
                    className="mt-2 rounded-lg"
                />
            )}
        </div>
    );
};

const EditEvent: React.FC<EditEventProps> = ({ params: { slug } }) => {
    const router = useRouter();
    const [mainImg, setMainImg] = useState<File | string | null>(null);
    const [seoImage, setSeoImage] = useState<File | string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<Image[]>([]);
    const [date, setDate] = useState<Date | null>(null);
    const { event, loading, error } = useEventBySlug(slug);

    useEffect(() => {
        if (event) {
            setMainImg(event.mainImg?.url || null);
            setSeoImage(event.seoImage?.url || null);
            setUploadedImages(event.images ? event.images.map((img: any) => ({
                file: img.url,
                url: img.url
            })) : []);

            if (event.dateOfEvent) {
                setDate(new Date(event.dateOfEvent));
            }
        }
    }, [event]);

    const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>): Promise<void> => {
        try {
            const formData = new FormData();
            
            // Create a new object with only the fields we want to send
            const sanitizedValues = {
                title: values.title,
                description: DOMPurify.sanitize(values.description),
                dateOfEvent: values.dateOfEvent,
                timeOfEvent: values.timeOfEvent,
                location: values.location,
                category: values.category,
                country: values.country,
                city: values.city,
                googleMapLink: values.googleMapLink,
                seoKeywords: values.seoKeywords,
                // Conditionally add link or locationDetails based on location type
                ...(values.location === 'online' 
                    ? { link: values.link } 
                    : { locationDetails: values.locationDetails }
                )
            };

            Object.entries(sanitizedValues).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (key === 'timeOfEvent') {
                        formData.append('timeOfEvent[from]', (value as TimeOfEvent).from);
                        formData.append('timeOfEvent[to]', (value as TimeOfEvent).to);
                    } else if (key === 'dateOfEvent') {
                        formData.append(key, format(new Date(value as string), "yyyy-MM-dd"));
                    } else if (Array.isArray(value)) {
                        value.forEach(item => formData.append(`${key}[]`, item));
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            });

            if (mainImg instanceof File) formData.append('mainImg', mainImg);
            if (seoImage instanceof File) formData.append('seoImage', seoImage);
            uploadedImages.forEach(image => {
                if (image.file instanceof File) {
                    formData.append('images', image.file);
                }
            });

            const response = await axios.patch<{ message: string }>(
                `${process.env.NEXT_PUBLIC_BASE_URL}/event/${event?._id}`,
                formData,
                {
                    headers: {
                        token: Cookies.get('token') || '',
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Event updated successfully');
                router.push('/account');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                toast.error(errorMessage);
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!event) {
        return null;
    }

    const initialValues: FormValues = {
        title: event.title || '',
        description: event.description || '',
        dateOfEvent: event.dateOfEvent ? new Date(event.dateOfEvent) : new Date(),
        timeOfEvent: {
            from: event.timeOfEvent?.from || '',
            to: event.timeOfEvent?.to || '',
        },
        location: event.location as LocationType || 'online',
        locationDetails: event.locationDetails || '',
        link: event.link || '',
        category: event.category as Category || 'Other',
        country: event.country || '',
        city: event.city || '',
        googleMapLink: event.googleMapLink || '',
        seoKeywords: Array.isArray(event.seoKeywords) ? event.seoKeywords : [],
    };

    return (
        <main className="py-6 w-full mt-24">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.push('/account')} className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Account
                        </Button>
                    </div>
                    <CardTitle className="text-2xl font-bold">Edit Your Event</CardTitle>
                </CardHeader>
                <CardContent>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ values, setFieldValue, isSubmitting, touched, errors }) => (
                            <Form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Event's Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            onChange={(e) => setFieldValue('title', e.target.value)}
                                            placeholder="e.g., Web Development Workshop 2024"
                                            value={values.title}
                                        />
                                        {touched.title && errors.title && (
                                            <div className="text-red-500 text-sm">{errors.title}</div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfEvent">Event's Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date || undefined}
                                                    onSelect={(newDate: Date | undefined) => {
                                                        setDate(newDate || null);
                                                        if (newDate) {
                                                            setFieldValue('dateOfEvent', format(newDate, "yyyy-MM-dd"));
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ImageUploader mainImg={mainImg} setMainImg={setMainImg} label="Event's Main" />
                                    <ImageUploader mainImg={seoImage} setMainImg={setSeoImage} label="SEO Image" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Event Images</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const files = Array.from(e.target.files || []);
                                            const newImages = files.map(file => ({
                                                file,
                                                url: URL.createObjectURL(file)
                                            }));
                                            setUploadedImages([...uploadedImages, ...newImages]);
                                        }}
                                    />
                                    <div className="grid grid-cols-3 gap-4 mt-2">
                                        {uploadedImages.map((image, index) => (
                                            <div key={index} className="relative">
                                                <Image
                                                    src={image.url || ''}
                                                    alt={`Event Gallery Image ${index + 1}`}
                                                    width={200}
                                                    height={200}
                                                    className="rounded-lg"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-1 right-1"
                                                    onClick={() => {
                                                        const newImages = uploadedImages.filter((_, i) => i !== index);
                                                        setUploadedImages(newImages);
                                                    }}
                                                >×
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="timeOfEvent.from">Event's Start Time</Label>
                                        <Select
                                            name="timeOfEvent.from"
                                            onValueChange={(value) => {
                                                setFieldValue('timeOfEvent.from', value);
                                                if (values.timeOfEvent.to && value > values.timeOfEvent.to) {
                                                    setFieldValue('timeOfEvent.to', '');
                                                }
                                            }}
                                            value={values.timeOfEvent.from}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select start time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {generateTimes().map((time) => (
                                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {touched.timeOfEvent?.from && errors.timeOfEvent?.from && (
                                            <div className="text-red-500 text-sm">{errors.timeOfEvent.from}</div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="timeOfEvent.to">Event's End Time</Label>
                                        <Select
                                            name="timeOfEvent.to"
                                            onValueChange={(value) => setFieldValue('timeOfEvent.to', value)}
                                            value={values.timeOfEvent.to}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select end time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {generateTimes()
                                                    .filter(time => !values.timeOfEvent.from || time > values.timeOfEvent.from)
                                                    .map((time) => (
                                                        <SelectItem key={time} value={time}>{time}</SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        {touched.timeOfEvent?.to && errors.timeOfEvent?.to && (
                                            <div className="text-red-500 text-sm">{errors.timeOfEvent.to}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <CountryDropdown
                                            classes="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={values.country}
                                            onChange={(val) => setFieldValue('country', val)}
                                        />
                                        {touched.country && errors.country && (
                                            <div className="text-red-500 text-sm">{errors.country}</div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City/Region</Label>
                                        <RegionDropdown
                                            classes="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            country={values.country}
                                            value={values.city}
                                            onChange={(val) => setFieldValue('city', val)}
                                        />
                                        {touched.city && errors.city && (
                                            <div className="text-red-500 text-sm">{errors.city}</div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Event's Category</Label>
                                        <Select
                                            name="category"
                                            onValueChange={(value: Category) => setFieldValue('category', value)}
                                            value={values.category}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {touched.category && errors.category && (
                                            <div className="text-red-500 text-sm">{errors.category}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Event's Location</Label>
                                    <RadioGroup
                                        value={values.location}
                                        onValueChange={(value: 'online' | 'offline') => {
                                            setFieldValue('location', value);
                                        }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="online" id="online" />
                                            <Label htmlFor="online">Online</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="offline" id="offline" />
                                            <Label htmlFor="offline">In-Person</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {values.location === 'online' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="link">Event Link</Label>
                                        <Input
                                            id="link"
                                            name="link"
                                            placeholder="Add your meeting link (Zoom, Google Meet, etc.)"
                                            value={values.link}
                                            onChange={(e) => setFieldValue('link', e.target.value)}
                                        />
                                        {touched.link && errors.link && (
                                            <div className="text-red-500 text-sm">{errors.link}</div>
                                        )}
                                    </div>
                                )}

                                {values.location === 'offline' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="locationDetails">Event's Location Details</Label>
                                        <Textarea
                                            id="locationDetails"
                                            name="locationDetails"
                                            placeholder="Provide detailed address and any helpful directions or landmarks"
                                            value={values.locationDetails}
                                            onChange={(e) => setFieldValue('locationDetails', e.target.value)}
                                        />
                                        {touched.locationDetails && errors.locationDetails && (
                                            <div className="text-red-500 text-sm">{errors.locationDetails}</div>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="googleMapLink">Google Map Link</Label>
                                    <Input
                                        id="googleMapLink"
                                        name="googleMapLink"
                                        placeholder="Paste your Google Maps location link here"
                                        value={values.googleMapLink}
                                        onChange={(e) => setFieldValue('googleMapLink', e.target.value)}
                                    />
                                    {touched.googleMapLink && errors.googleMapLink && (
                                        <div className="text-red-500 text-sm">{errors.googleMapLink}</div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Tell us more about your event</Label>
                                    <RichTextEditor
                                        value={values.description}
                                        onChange={(value) => setFieldValue('description', value)}
                                        placeholder="Describe your event in detail: What can attendees expect? What should they bring? What will they learn or experience? Include any special instructions or requirements."
                                    />
                                    {touched.description && errors.description && (
                                        <div className="text-red-500 text-sm">{errors.description}</div>
                                    )}
                                </div>

                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? 'Updating Event...' : 'Update Event'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
            <Toaster />
        </main>
    );
};

export default EditEvent;