import { type Metadata } from 'next';
import Client from './(components)/Client';

type Props = {
    params: {
        slug: string;
    };
    searchParams?: Record<string, string | string[] | undefined>;
};

export const metadata: Metadata = {
    title: 'Edit Event',
    description: 'Edit your event details',
};


export default async function EditEventPage({ params }: Props) {

    return <Client slug={params.slug} />;
}
