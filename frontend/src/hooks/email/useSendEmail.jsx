import { useState } from 'react';
import { sendEmail } from '../../services/email.service.js';

export function useSendEmail() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(null);

  const send = async (data) => {
    setLoading(true);
    setMensaje('');
    setError(null);

    try {
      const result = await sendEmail(data);
      setMensaje('Correo enviado con exito!!');
      return result;
    } catch (err) {
      setError(err);
      setMensaje('Error al enviar el correo :(');
    } finally {
      setLoading(false);
    }
  };

  return {
    send,
    loading,
    mensaje,
    error,
  };
}
