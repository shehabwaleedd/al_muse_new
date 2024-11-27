import Cookies from 'js-cookie';
export default async function getAllUsers() {

    const token = Cookies.get('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
        headers: {
            token
        } as HeadersInit
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();
    return users;

}
