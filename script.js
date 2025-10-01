const API_URL = 'http://192.168.1.201:5000/api/traffic';

// --- Elementos do DOM ---
const overviewView = document.getElementById('overview-view');
const drilldownView = document.getElementById('drilldown-view');
const backButton = document.getElementById('backButton');

// --- Variáveis de Estado ---
let lastApiData = {};
let overviewChart, protocolChart;

// --- Funções de Visualização ---

// Função para alternar entre as "telas" do dashboard
function showView(viewName) {
    overviewView.classList.toggle('hidden', viewName === 'drilldown');
    drilldownView.classList.toggle('hidden', viewName !== 'drilldown');
}

// Função que preenche a tela de drill down com todos os detalhes
function populateDrilldownView(clientIP, direction) { // direction será 'in' ou 'out'
    const data = lastApiData[clientIP];
    if (!data) return;

    // Define textos e cores com base na direção clicada
    const directionText = direction === 'in' ? 'Entrada' : 'Saída';
    const chartColors = direction === 'in' 
        ? ['#36A2EB', '#82c4f1', '#a9d6f5'] 
        : ['#FF6384', '#ff9ab2', '#ffc2d1'];

    // Preenche o painel de informações com os dados completos
    document.getElementById('drilldown-title').innerText = `Análise de Tráfego de ${directionText} para: ${clientIP}`;
    document.getElementById('info-ip').innerText = clientIP;
    document.getElementById('info-total').innerText = `${data.in + data.out} bytes`;
    document.getElementById('info-in').innerText = `${data.in} bytes`;
    document.getElementById('info-out').innerText = `${data.out} bytes`;
    
    // Preenche a lista de protocolos (agora com IN e OUT separados)
    const protocolList = document.getElementById('protocol-list');
    protocolList.innerHTML = ''; // Limpa a lista anterior
    
    protocolList.innerHTML += `<h4>Protocolos de Entrada:</h4>`;
    if (Object.keys(data.protocols.in).length > 0) {
        for (const [protocol, size] of Object.entries(data.protocols.in)) {
            protocolList.innerHTML += `<li>${protocol}: ${size} bytes</li>`;
        }
    } else {
        protocolList.innerHTML += `<li>Nenhum tráfego de entrada registrado.</li>`;
    }

    protocolList.innerHTML += `<h4 style="margin-top: 15px;">Protocolos de Saída:</h4>`;
    if (Object.keys(data.protocols.out).length > 0) {
        for (const [protocol, size] of Object.entries(data.protocols.out)) {
            protocolList.innerHTML += `<li>${protocol}: ${size} bytes</li>`;
        }
    } else {
        protocolList.innerHTML += `<li>Nenhum tráfego de saída registrado.</li>`;
    }

    // Atualiza o gráfico de doughnut com os dados e cores da direção clicada
    const protocolDataForDirection = data.protocols[direction];
    protocolChart.data.labels = Object.keys(protocolDataForDirection);
    protocolChart.data.datasets[0].data = Object.values(protocolDataForDirection);
    protocolChart.data.datasets[0].backgroundColor = chartColors;
    protocolChart.update();
}

// --- Lógica Principal ---

async function fetchTrafficData() {
    try {
        const response = await fetch(API_URL);
        lastApiData = await response.json();
        
        // Atualiza sempre a visão geral, mesmo que ela esteja escondida
        const clientIPs = Object.keys(lastApiData);
        overviewChart.data.labels = clientIPs;
        overviewChart.data.datasets[0].data = clientIPs.map(ip => lastApiData[ip].in);
        overviewChart.data.datasets[1].data = clientIPs.map(ip => lastApiData[ip].out);
        overviewChart.update();

    } catch (error) { console.error('Falha ao buscar dados:', error); }
}

// --- Inicialização ---

function initialize() {
    // Inicializa o gráfico de visão geral (Barras)
    const overviewCtx = document.getElementById('overviewChart').getContext('2d');
    overviewChart = new Chart(overviewCtx, {
        type: 'bar',
        options: {
            responsive: true,
            // Barras lado a lado (sem 'stacked')
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Tráfego (bytes)' }}
            },
            onClick: (event) => {
                const points = overviewChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
                if (points.length) {
                    const point = points[0];
                    const ip = overviewChart.data.labels[point.index];
                    // datasetIndex 0 é Entrada, 1 é Saída, conforme a ordem em 'datasets'
                    const direction = point.datasetIndex === 0 ? 'in' : 'out'; 
                    populateDrilldownView(ip, direction);
                    showView('drilldown');
                }
            }
        },
        data: { 
            labels: [], 
            datasets: [
                { label: 'Entrada (IN)', backgroundColor: 'rgba(54, 162, 235, 0.7)' }, 
                { label: 'Saída (OUT)', backgroundColor: 'rgba(255, 99, 132, 0.7)' }
            ] 
        }
    });

    // Inicializa o gráfico de drill down (Rosca/Doughnut)
    const protocolCtx = document.getElementById('protocolChart').getContext('2d');
    protocolChart = new Chart(protocolCtx, { type: 'doughnut', options: { responsive: true, plugins: { legend: { position: 'top' }}}, data: { labels: [], datasets: [{ data: [] }] }});

    backButton.addEventListener('click', () => showView('overview'));
    
    setInterval(fetchTrafficData, 5000);
    fetchTrafficData();
}

initialize();