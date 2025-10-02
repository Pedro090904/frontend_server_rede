const API_URL = 'http://127.0.0.1:5000/api/traffic';

// --- Elementos do DOM ---
const overviewView = document.getElementById('overview-view');
const drilldownView = document.getElementById('drilldown-view');
const backButton = document.getElementById('backButton');
const clientListBody = document.getElementById('client-list-body'); // <-- NOVO ELEMENTO

// --- Variáveis de Estado ---
let lastApiData = {};
let overviewChart, protocolChart;

// --- NOVA FUNÇÃO PARA ATUALIZAR A LISTA/TABELA ---
function updateClientList(apiData) {
    // 1. Limpa o conteúdo anterior da tabela para a atualização
    clientListBody.innerHTML = '';

    // 2. Itera sobre cada cliente (IP) nos dados da API
    for (const [clientIP, data] of Object.entries(apiData)) {
        // 3. Coleta todos os protocolos de entrada e saída
        const protocolsIn = Object.keys(data.protocols.in);
        const protocolsOut = Object.keys(data.protocols.out);
        
        // 4. Usa um Set para criar uma lista única de todos os protocolos utilizados
        const allProtocols = new Set([...protocolsIn, ...protocolsOut]);

        // 5. Cria a nova linha da tabela (tr)
        const row = document.createElement('tr');
        
        // 6. Cria as células (td) com o IP e a lista de protocolos
        const ipCell = document.createElement('td');
        ipCell.textContent = clientIP;

        const protocolsCell = document.createElement('td');
        // Converte o Set de volta para um array e junta os itens com vírgula
        protocolsCell.textContent = Array.from(allProtocols).join(', '); 

        // 7. Adiciona as células na linha e a linha no corpo da tabela
        row.appendChild(ipCell);
        row.appendChild(protocolsCell);
        clientListBody.appendChild(row);
    }
}

// --- Funções de Visualização ---

// Função para alternar entre as "telas" do dashboard
function showView(viewName) {
    overviewView.classList.toggle('hidden', viewName === 'drilldown');
    drilldownView.classList.toggle('hidden', viewName !== 'drilldown');
}

// Função que preenche a tela de drill down com todos os detalhes
function populateDrilldownView(clientIP, direction) { 
    const data = lastApiData[clientIP];
    if (!data) return;

    const directionText = direction === 'in' ? 'Entrada' : 'Saída';
    const chartColors = direction === 'in' 
        ? ['#36A2EB', '#82c4f1', '#a9d6f5'] 
        : ['#FF6384', '#ff9ab2', '#ffc2d1'];

    document.getElementById('drilldown-title').innerText = `Análise de Tráfego de ${directionText} para: ${clientIP}`;
    document.getElementById('info-ip').innerText = clientIP;
    document.getElementById('info-total').innerText = `${data.in + data.out} bytes`;
    document.getElementById('info-in').innerText = `${data.in} bytes`;
    document.getElementById('info-out').innerText = `${data.out} bytes`;
    
    const protocolList = document.getElementById('protocol-list');
    protocolList.innerHTML = ''; 
    
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
        
        const clientIPs = Object.keys(lastApiData);
        overviewChart.data.labels = clientIPs;
        overviewChart.data.datasets[0].data = clientIPs.map(ip => lastApiData[ip].in);
        overviewChart.data.datasets[1].data = clientIPs.map(ip => lastApiData[ip].out);
        overviewChart.update();

        // --- ATUALIZA A NOVA LISTA/TABELA ---
        updateClientList(lastApiData);

    } catch (error) { console.error('Falha ao buscar dados:', error); }
}

// --- Inicialização ---

function initialize() {
    const overviewCtx = document.getElementById('overviewChart').getContext('2d');
    overviewChart = new Chart(overviewCtx, {
        type: 'bar',
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Tráfego (bytes)' }}
            },
            onClick: (event) => {
                const points = overviewChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
                if (points.length) {
                    const point = points[0];
                    const ip = overviewChart.data.labels[point.index];
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

    const protocolCtx = document.getElementById('protocolChart').getContext('2d');
    protocolChart = new Chart(protocolCtx, { type: 'doughnut', options: { responsive: true, plugins: { legend: { position: 'top' }}}, data: { labels: [], datasets: [{ data: [] }] }});

    backButton.addEventListener('click', () => showView('overview'));
    
    setInterval(fetchTrafficData, 10000);
    fetchTrafficData();
}

initialize();