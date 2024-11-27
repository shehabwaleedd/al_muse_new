export async function getEventBySlug(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/event/${slug}`, { cache: "no-cache" });
        if (!res.ok) {
            const errorData = await res.text();
            throw new Error(
                `Failed to fetch event (Status: ${res.status}): ${errorData || res.statusText}`
            );
        }
        return res.json();
    } catch (error) {
        throw new Error(
            `Error fetching event ${slug}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}