import { type Metadata } from 'next';
import Client from './(components)/Client';

type Props = {
    params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
    title: 'Edit Event',
    description: 'Edit your event details',
};

export default async function EditEventPage({ params }: Props) {
    // Resolve the params promise
    const resolvedParams = await params;

    return <Client slug={resolvedParams.slug} />;
}
