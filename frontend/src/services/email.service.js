import axios from './root.service.js';

export const sendEmail = async (data) => {
    try {
        const response = await axios.post("/email/send", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}