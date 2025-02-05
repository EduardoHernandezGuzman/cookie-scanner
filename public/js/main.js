document.getElementById('scanForm').addEventListener('submit', async (e) => {
e.preventDefault();

const urlInput = document.getElementById('urlInput');
const loadingDiv = document.getElementById('loading');
const resultsDiv = document.getElementById('results');
const cookieList = document.getElementById('cookieList');
const summaryDiv = document.getElementById('summary');

// Reset y mostrar loading
loadingDiv.classList.remove('d-none');
resultsDiv.classList.add('d-none');
cookieList.innerHTML = '';
summaryDiv.innerHTML = '';

try {
    const response = await fetch('/scan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput.value })
    });

    const cookies = await response.json();
    
    if (!response.ok) {
        throw new Error(cookies.error || 'Error scanning cookies');
    }

    // Generar resumen
    const summary = generateSummary(cookies);
    displaySummary(summary);

    // Mostrar cookies en la tabla
    cookies.forEach(cookie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(cookie.name)}</td>
            <td>${escapeHtml(cookie.domain)}</td>
            <td>${formatExpiration(cookie.expires)}</td>
            <td><span class="badge bg-${getCategoryColor(cookie.category)}">${escapeHtml(cookie.category)}</span></td>
        `;
        cookieList.appendChild(row);
    });

    resultsDiv.classList.remove('d-none');
} catch (error) {
    alert('Error: ' + error.message);
} finally {
    loadingDiv.classList.add('d-none');
}
});

// Funciones auxiliares
function escapeHtml(unsafe) {
return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatExpiration(expires) {
if (!expires) return 'Session';
return new Date(expires * 1000).toLocaleDateString();
}

function getCategoryColor(category) {
const colors = {
    'Necessary': 'success',
    'Preferences': 'info',
    'Statistics': 'warning',
    'Marketing': 'danger',
    'Unknown': 'secondary'
};
return colors[category] || 'secondary';
}

function generateSummary(cookies) {
const summary = {
    total: cookies.length,
    categories: {}
};

cookies.forEach(cookie => {
    summary.categories[cookie.category] = (summary.categories[cookie.category] || 0) + 1;
});

return summary;
}

function displaySummary(summary) {
const summaryHtml = `
    <h4>Summary</h4>
    <p>Total cookies found: <span class="cookie-count">${summary.total}</span></p>
    <div class="row g-2">
        ${Object.entries(summary.categories)
            .map(([category, count]) => `
                <div class="col-auto">
                    <span class="badge bg-${getCategoryColor(category)}">${category}: ${count}</span>
                </div>
            `).join('')}
    </div>
`;
document.getElementById('summary').innerHTML = summaryHtml;
}

// Exportación
document.getElementById('exportJson').addEventListener('click', () => {
const cookies = getCookieData();
downloadFile(JSON.stringify(cookies, null, 2), 'cookies.json', 'application/json');
});

document.getElementById('exportCsv').addEventListener('click', () => {
const cookies = getCookieData();
const csv = convertToCSV(cookies);
downloadFile(csv, 'cookies.csv', 'text/csv');
});

function getCookieData() {
const cookies = [];
document.querySelectorAll('#cookieList tr').forEach(row => {
    const cells = row.getElementsByTagName('td');
    cookies.push({
        name: cells[0].textContent,
        domain: cells[1].textContent,
        expiration: cells[2].textContent,
        category: cells[3].textContent.trim()
    });
});
return cookies;
}

function convertToCSV(cookies) {
const headers = ['Name', 'Domain', 'Expiration', 'Category'];
const rows = cookies.map(cookie => [
    cookie.name,
    cookie.domain,
    cookie.expiration,
    cookie.category
]);

return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
}

function downloadFile(content, fileName, contentType) {
const blob = new Blob([content], { type: contentType });
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = fileName;
a.click();
window.URL.revokeObjectURL(url);
}
