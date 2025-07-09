import axios from './root.service';

export interface ClonePayload {
  name: string;
  url: string;
}

export const clonePage = async (payload: ClonePayload) => {
  try {
    const res = await axios.post('/clone/clone', payload);
    return res.data || 'Página clonada correctamente';
  } catch (error) {
    console.error('[clonePage] Error:', error);
    throw error;
  }
};
