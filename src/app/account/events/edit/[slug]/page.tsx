import { type Metadata } from 'next';
import Client from './(components)/Client';

interface Props {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
    title: 'Edit Event',
    description: 'Edit your event details',
};

export default async function EditEventPage({ params }: Props) {
    const slug = params.slug;

    return <Client slug={slug} />;
}
