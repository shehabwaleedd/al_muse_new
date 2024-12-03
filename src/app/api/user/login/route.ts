import axios, { AxiosError } from 'axios';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/login`, body);
        return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: unknown) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            return new Response(JSON.stringify(axiosError.response.data), {
                status: axiosError.response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }
}
