import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const data = new FormData();

        formData.forEach((value, key) => {
            data.append(key, value);
        });

        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/register`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error('Error occurred during registration:', error);

        const errorMessage = axiosError.response?.data || 'Failed to register';
        const statusCode = axiosError.response?.status || 500;

        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}
