import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function PATCH(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const headersList = await headers();
        const token = headersList.get('token');
        const { role } = await request.json();

        const response = await fetch(`${process.env.API_URL}/user/convertUserRole/${context.params.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'token': token || '',
            },
            body: JSON.stringify({ role }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to update user role' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
