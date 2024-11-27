export interface MainImg {
    url: string;
    public_id: string;
}

export interface Location {
    from: string;
    to: string;
}

export interface Img {
    url: string;
    public_id: string;
    image: string;
    _id: string;
    name: string;
}



export interface TourType {
    data: any;
    mainImg: MainImg;
    location: Location;
    mapDetails: string;
    itinerary: string;
    historyBrief: string;
    category: string;
    tags: string[];
    _id: string;
    id: string;
    title: string;
    description: string;
    images: Img[];
    options: {
        price: any; name: string; _id: string
    }[];
    isRepeated: boolean;
    repeatTime: string[];
    repeatDays: string[];
    dateDetails: string;
    inclusions: string[];
    exclusions: string[];
    adultPricing: { adults: number; price: number; _id: string; totalPrice: number }[];
    childrenPricing: { children: number; price: number; _id: string; totalPrice: number }[];
    duration: string;
    hasOffer: boolean;
    subtitle: string;
    __v: number;
    tour?: string;
    wishList?: string[];
    tourId?: string;
    base64?: string;

}


export interface TourData {
    message: string;
    data: {
        page: number;
        result: TourType[];
    };
}


export interface TourGroup {
    mainTitle: string;
    tours: TourType[];
}