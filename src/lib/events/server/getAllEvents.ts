export async function getAllEvents() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/event`);
    if (!res.ok) throw new Error('Failed to fetch event');
    return res.json();
}