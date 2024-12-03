'use client'
import React, { useState } from 'react'
import { Formik, Form, FormikHelpers, ErrorMessage, Field } from 'formik';
import Cookies from 'js-cookie';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {  UploadedImage } from '@/types/common';
import {  toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import RichTextEditor from '../components/RichTextEditor';

const categories = ['Music', 'Art', 'Food', 'Sports', 'Tech', 'Business', 'Health', 'Fashion', 'Film', 'Science', 'Travel', 'Charity', 'Community', 'Family', 'Education', 'Auto', 'Hobbies', 'Other'] as const;
type Category = typeof categories[number];

const today = new Date();
today.setHours(0, 0, 0, 0);

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required').min(3, "Title is too short").max(50, "Title is too long"),
    description: Yup.string().required('Description is required').min(100, 'Description is too short, minimum 100 letters').max(4000, 'Description is too long, maximum 4000 letters'),
    dateOfEvent: Yup.date(),
    timeOfEvent: Yup.object().shape({
        from: Yup.string().required('Start time is required'),
        to: Yup.string().required('End time is required')
            .test('is-after-start', 'End time must be after start time', function(this: Yup.TestContext, value: string) {
                const { from } = this.parent;
                if (!from || !value) return true;
                return value > from;
            }),
    }),
    location: Yup.string().oneOf(['online', 'offline'] as const, 'Invalid location type'),
    category: Yup.string().oneOf(categories, 'Invalid category'),
    link: Yup.string().min(10, 'Link is too short').max(100, 'Link is too long'),
    locationDetails: Yup.string().min(10, 'Location details is too short').max(500, 'Location details is too long'),
    googleMapLink: Yup.string(),
    country: Yup.string().min(2, 'Country is too short').max(50, 'Country is too long'),
    city: Yup.string().min(2, 'City is too short').max(50, 'City is too long'),
});

const generateTimes = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
        const time = `${i < 10 ? `0${i}` : i}:00`;
        times.push(time);
    }
    return times;
}

interface ImageUploaderProps {
    mainImg: File | null;
    setMainImg: React.Dispatch<React.SetStateAction<File | null>>;
    label: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ mainImg, setMainImg, label }) => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                    src={URL.createObjectURL(mainImg)}
                    alt="Event Main Image"
                    width={500}
                    height={500}
                    className="mt-2 rounded-lg"
                />
            )}
        </div>
    );
};

interface FormValues {
    title: string;
    description: string;
    dateOfEvent: string;
    timeOfEvent: {
        from: string;
        to: string;
    };
    location: 'online' | 'offline';
    locationDetails: string;
    link: string;
    category: Category;
    googleMapLink: string;
    country: string;
    city: string;
    seoKeywords: string[];
}

const CreateEvent: React.FC = () => {
    const router = useRouter();
    const [mainImg, setMainImg] = useState<File | null>(null);
    const [submitError, setSubmitError] = useState<string>('');
    const [eventLocationType, setEventLocationType] = useState<'online' | 'offline'>('online');
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [seoImage, setSeoImage] = useState<File | null>(null);
    const [date, setDate] = useState<Date | null>(null);

    const initialValues: FormValues = {
        title: '',
        description: '',
        dateOfEvent: '',
        timeOfEvent: {
            from: '',
            to: '',
        },
        location: 'online',
        locationDetails: '',
        link: '',
        category: 'Other',
        googleMapLink: '',
        country: '',
        city: '',
        seoKeywords: [],
    }

    const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        const formData = new FormData();
    
    
        // Handle main image
        if (mainImg instanceof File) {
            formData.append('mainImg', mainImg);
        }
    
        // Handle SEO image
        if (seoImage instanceof File) {
            formData.append('seoImage', seoImage);
        }
    
        // Handle multiple images
        if (uploadedImages.length > 0) {
            uploadedImages.forEach((image) => {
                if (image.file instanceof File) {
                    formData.append(`images`, image.file); // Keep the same key for multiple files
                }
            });
        }
    
        // Explicitly append these fields
        if (values.country) formData.append('country', values.country);
        if (values.city) formData.append('city', values.city);
        if (values.link) formData.append('link', values.link);
        if (values.googleMapLink) formData.append('googleMapLink', values.googleMapLink);
    
        // Handle the rest of the form values
        Object.entries(values).forEach(([key, value]) => {
            if (key === 'timeOfEvent') {
                if (value.from) formData.append('timeOfEvent[from]', value.from);
                if (value.to) formData.append('timeOfEvent[to]', value.to);
            }
            else if (key === 'dateOfEvent' && value) {
                const formattedDate = format(new Date(value), "yyyy-MM-dd");
                formData.append('dateOfEvent', formattedDate);
            }
            else if (Array.isArray(value)) {
                value.forEach(item => {
                    if (item) formData.append(`${key}[]`, item);
                });
            }
            else if (
                value !== undefined && 
                value !== null && 
                value !== '' && 
                !['country', 'city', 'link', 'googleMapLink'].includes(key)
            ) {
                formData.append(key, value.toString());
            }
        });
    

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/event`, formData, {
                headers: {
                    token: Cookies.get("token") || '',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                toast.success('Event created successfully');
                router.push('/community');
            } else {
                toast.error('Failed to create event');
            }
        } catch (error) {
            console.error('Failed to create event:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                setSubmitError(errorMessage);
                toast.error(errorMessage);
            } else {
                setSubmitError('An unexpected error occurred');
                toast.error('An unexpected error occurred');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto mt-14">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Create Your Next Event</CardTitle>
            </CardHeader>
            <CardContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}>
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Event&apos;s Title</Label>
                                    <Input 
                                        id="title" 
                                        name="title" 
                                        onChange={(e) => setFieldValue('title', e.target.value)}
                                        placeholder="e.g., Web Development Workshop 2024" 
                                    />
                                    <div className="text-red-500 text-sm">
                                        <ErrorMessage name="title" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfEvent">Event&apos;s Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
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
                                                    setDate(newDate ?? null);
                                                    if (newDate) {
                                                        setFieldValue('dateOfEvent', format(newDate, "yyyy-MM-dd"));
                                                    }
                                                }}
                                                initialFocus
                                            />
                                            <div className="text-red-500 text-sm">
                                                <ErrorMessage name="dateOfEvent" />
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ImageUploader mainImg={mainImg} setMainImg={setMainImg} label="Event's Main" />
                                <div className="text-red-500 text-sm">
                                    <ErrorMessage name="mainImg" />
                                </div>
                                <ImageUploader mainImg={seoImage} setMainImg={setSeoImage} label="SEO Image" />
                                <div className="text-red-500 text-sm">
                                    <ErrorMessage name="seoImage" />
                                </div>
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
                                <div className="text-red-500 text-sm">
                                    <ErrorMessage name="images" />
                                </div>
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
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="timeOfEvent.from">Event&apos;s Start Time</Label>
                                    <Select 
                                        name="timeOfEvent.from" 
                                        onValueChange={(value) => {
                                            setFieldValue('timeOfEvent.from', value);
                                            if (values.timeOfEvent.to && value > values.timeOfEvent.to) {
                                                setFieldValue('timeOfEvent.to', '');
                                            }
                                        }}
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
                                    <div className="text-red-500 text-sm">
                                        <ErrorMessage name="timeOfEvent.from" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timeOfEvent.to">Event&apos;s End Time</Label>
                                    <Select 
                                        name="timeOfEvent.to" 
                                        onValueChange={(value) => setFieldValue('timeOfEvent.to', value)}
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
                                    <div className="text-red-500 text-sm">
                                        <ErrorMessage name="timeOfEvent.to" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Field
                                        as={Input}
                                        id="country"
                                        name="country"
                                        placeholder="e.g., United States"
                                    />
                                    <div className="text-red-500 text-sm">
                                        <ErrorMessage name="country" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Field
                                        as={Input}
                                        id="city"
                                        name="city"
                                        placeholder="e.g., San Francisco"
                                    />
                                    <div className="text-red-500 text-sm">
                                        <ErrorMessage name="city" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Event&apos;s Category</Label>
                                    <Select name="category" onValueChange={(value: Category) => setFieldValue('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>{category}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="text-red-500 text-sm">
                                        <ErrorMessage name="category" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Event&apos;s Location</Label>
                                <RadioGroup defaultValue="online" onValueChange={(value: 'online' | 'offline') => {
                                    setEventLocationType(value);
                                    setFieldValue('location', value);
                                }}>
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

                            {eventLocationType === 'online' && (
                                <div className="space-y-2">
                                    <Label htmlFor="link">Event Link</Label>
                                    <Field
                                        as={Input}
                                        id="link"
                                        name="link"
                                        placeholder="Add your meeting link (Zoom, Google Meet, etc.)"
                                    />
                                    <div className="text-red-500 text-sm">
                                        <ErrorMessage name="link" />
                                    </div>
                                </div>
                            )}

                            {eventLocationType === 'offline' && (
                                <div className="space-y-2">
                                    <Label htmlFor="locationDetails">Event&apos;s Location Details</Label>
                                    <Textarea
                                        id="locationDetails"
                                        name="locationDetails"
                                        placeholder="Provide detailed address and any helpful directions or landmarks"
                                    />
                                    <div className="text-red-500 text-sm">
                                        <ErrorMessage name="locationDetails" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="googleMapLink">Google Map Link</Label>
                                <Field
                                    as={Input}
                                    id="googleMapLink"
                                    name="googleMapLink"
                                    placeholder="Paste your Google Maps location link here"
                                />
                                <div className="text-red-500 text-sm">
                                    <ErrorMessage name="googleMapLink" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Tell us more about your event</Label>
                                <RichTextEditor
                                    value={values.description}
                                    onChange={(value) => setFieldValue('description', value)}
                                    placeholder="Describe your event in detail: What can attendees expect? What should they bring? What will they learn or experience? Include any special instructions or requirements."
                                />
                                <div className="text-red-500 text-sm">
                                    <ErrorMessage name="description" />
                                </div>
                            </div>

                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating Event...' : 'Create Event'}
                            </Button>

                            {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
                        </Form>
                    )}
                </Formik>
            </CardContent>
        </Card>
    );
};

export default CreateEvent;