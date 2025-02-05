const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.post('/scan', async (req, res) => {
const { url } = req.body;
try {
    const cookies = await scanCookies(url);
    res.json(cookies);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

async function scanCookies(url) {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920x1080',
            '--disable-web-security',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list'
        ],
        ignoreHTTPSErrors: true,
        headless: 'new'
    });
    
    const page = await browser.newPage();
    
    try {
        // Configurar timeouts
        await page.setDefaultNavigationTimeout(30000);
        await page.setDefaultTimeout(30000);
    
        // Configurar headers
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
    
        // Intentar navegar a la página
        const response = await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
    
        if (!response.ok()) {
            throw new Error(`Failed to load page: ${response.status()} ${response.statusText()}`);
        }
    
        // Esperar un poco más para asegurar que las cookies se carguen
        await page.waitForTimeout(2000);
    
        const cookies = await page.cookies();
        const categorizedCookies = cookies.map(cookie => ({
            ...cookie,
            category: categorizeCookie(cookie)
        }));
    
        await browser.close();
        return categorizedCookies;
    } catch (error) {
        await browser.close();
        throw new Error(`Failed to scan cookies: ${error.message}`);
    }
    }

function categorizeCookie(cookie) {
const name = cookie.name.toLowerCase();
if (name.includes('session') || name.includes('csrf')) return 'Necessary';
if (name.includes('prefs') || name.includes('theme')) return 'Preferences';
if (name.includes('analytics') || name.includes('_ga')) return 'Statistics';
if (name.includes('ad') || name.includes('track')) return 'Marketing';
return 'Unknown';
}

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});
