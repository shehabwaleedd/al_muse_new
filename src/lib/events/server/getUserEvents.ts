export async function getUserEvents(userId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/event/getAllEventByOneUser/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch event');
    return res.json();
}