export interface EventType {
    title?: string;
    description?: string;
    dateOfEvent?: string;
    time?: string;
    location?: string;
    link?: string;
    isDisplayed?: boolean;
    country?: string;
    city?: string;
    slug?: string;
    status?: string;
    image?: ImageUrl;
    _id?: string;
    images?: ImageUrl[];
    createdBy?: CreatedBy;
    category?: string;
    mainImg?: ImageFile;
    EventParticipants?: EventParticipants[];
    googleMapLink?: string;
    timeOfEvent?: TimeOfEvent;
    address?: string;
    locationDetails?: string;
    seoTitle?: string;
    createdAt: string;
    seoDescription?: string;
    seoKeywords?: string;
    seoImage?: ImageFile;
}

export interface FilterState {
    city: string;
    category: string;
    type: string;
    search: string;
    country: string;
    date: string;
    time: string;
}

interface TimeOfEvent {
    from: string;
    to: string;
}


export interface CustomFieldProps {
    name: string;
    label?: string;
    fieldType: 'input' | 'textarea' | 'select' | 'checkbox' | 'file' | 'date';
    setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
    options?: Array<{ label: string; value: string }>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // New prop
    value?: string | number;
}

export interface EventParticipants {
    _id: string;
    name: string;
    avatar: ImageFile;
}

interface CreatedBy {
    avatar: ImageFile;
    name: string;
    _id: string;
    role: string;
}

export interface ImageUrl {
    url: string;
    public_id: string;
    _id: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    region: string;
    company: string;
    gender: string;
    age: number;
    position: string;
    role: UserRole;
    avatar?: {
        url: string;
    };
    createdAt: string;
    updatedAt: string;
    confirmedEmail: boolean;

}


export interface EventResponseAPI {
    data: EventType[];
}

export interface EventResponseResults {
    result: EventType[]
}

export interface CardProps {
    i: number;
    title: string;
    description: string;
    mainImg: { url: string };
    city: string;
    category: string;
    slug: string;
    dateOfEvent: string;
    createdBy: { avatar: { url: string }, name: string };
}


export interface ImageFile {
    file: File | string;
    previewUrl?: string | null;
    url?: string;
}
export interface ImagesUploaderProps {
    uploadedImages: ImageFile[];
    setUploadedImages: (images: ImageFile[]) => void;
}

export interface CheckboxGroupFieldArrayProps {
    name: string;
    options: CheckboxOption[];
    setFieldValue: (field: string, value: any) => void;
    values: string[];
}


interface CheckboxOption {
    label: string;
    value: string;

}

export interface UploadedImage {
    file: File | string;
    url?: string;
}


export type UserRole = 'user' | 'admin' | 'superAdmin';




export interface ApiResponse<T> {
    data: {
        result: T[];
        totalPages: number;
        currentPage: number;
    };
    success: boolean;
    message: string;
}


export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export interface AnalyticsProps {
    users: User[];
    events: EventType[];
    currentUser: User;
    onRefresh?: () => void;
    isLoading?: boolean;
    error?: string | null;
}


export interface FormValues {
    title: string;
    description: string;
    dateOfEvent: Date | string;
    timeOfEvent: TimeOfEvent;
    location: LocationType;
    locationDetails: string;
    link: string;
    category: Category;
    googleMapLink: string;
    country: string;
    city: string;
    seoKeywords: string[];
}


export type LocationType = 'online' | 'offline';

export const categories = [
    'Music', 'Art', 'Food', 'Sports', 'Tech', 'Business', 'Health', 'Fashion',
    'Film', 'Science', 'Travel', 'Charity', 'Community', 'Family', 'Education',
    'Auto', 'Hobbies', 'Other'
] as const;

export type Category = typeof categories[number];