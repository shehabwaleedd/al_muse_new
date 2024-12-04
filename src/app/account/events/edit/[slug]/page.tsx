import { type Metadata } from 'next';
import Client from './(components)/Client';

interface PageProps {
    params: { slug: string };
}

export const metadata: Metadata = {
    title: 'Edit Event',
    description: 'Edit your event details',
};

export default async function EditEventPage({ params }: PageProps) {
    return <Client slug={params.slug} />;
}
