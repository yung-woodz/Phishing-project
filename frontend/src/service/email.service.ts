import axios from './root.service';

export interface EmailPayload {
  fromName: string;
  email: string;
  subject: string;
  message: string;
  /* date?: string; */
}

export const sendPhishingEmail = async (payload: EmailPayload) => {
  try {
    const res = await axios.post('/email/send', payload);
    return res.data;
  } catch (err) {
    console.error('[sendPhishingEmail] Error:', err);
    throw err;
  }
};
