import { getPlaiceholder } from "plaiceholder";
import axios from "axios";

export default async function getBase64(imageUrl: string): Promise<string> {
    try {
        // Configuring Axios to return the image as a stream
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer'  // Ensures the response is an array buffer
        });

        // Check if the response is successful
        if (response.status !== 200) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }

        // Get the base64 representation using plaiceholder
        const { base64 } = await getPlaiceholder(Buffer.from(response.data, 'binary'));

        return base64;

    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
        }
        return ''; // Return an empty string on error
    }
}
