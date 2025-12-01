import axios from 'axios';

const API_URL = 'http://localhost:8001/api';

export interface CaptionsResponse {
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
}

export const generateCaptions = async (topic: string, tone: string, image?: File): Promise<CaptionsResponse> => {
    const formData = new FormData();
    formData.append('tone', tone);
    if (topic) formData.append('topic', topic);
    if (image) formData.append('image', image);

    const response = await axios.post<CaptionsResponse>(`${API_URL}/generate`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
