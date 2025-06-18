import { useState } from 'react';
import { useSendEmail } from '../hooks/email/useSendEmail.jsx';

function CreateEmail() {
  const [fromName, setFromName] = useState('');
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');

  const { send, mensaje, loading, error } = useSendEmail();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await send({
        email: to,
        subject,
        message: text,
        fromName
    });

    setFromName('');
    setTo('');
    setSubject('');
    setText('');
  };

  return (
    <div className="card">
      <h2>Enviar Correo Simulado</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del remitente"
          value={fromName}
          onChange={(e) => setFromName(e.target.value)}
          required
        /><br />
        <input
          type="email"
          placeholder="Correo destinatario"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        /><br />
        <input
          type="text"
          placeholder="Asunto"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        /><br />
        <textarea
          placeholder="Cuerpo del mensaje"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="5"
          required
        /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando ...' : 'Enviar'}
        </button>
      </form>

      {mensaje && <p>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CreateEmail;
