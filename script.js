// URL da nossa API do backend
const API_URL = 'http://127.0.0.1:5000/api/traffic';

// Pega o elemento <canvas> do nosso HTML
const ctx = document.getElementById('trafficChart').getContext('2d');

// --- Inicialização do Gráfico ---
// Criamos o gráfico uma vez, com dados vazios. Depois, vamos apenas atualizá-lo.
const trafficChart = new Chart(ctx, {
    type: 'bar', // Tipo do gráfico
    data: {
        labels: [], // Os IPs dos clientes irão aqui
        datasets: [
            {
                label: 'Tráfego de Entrada (IN)',
                data: [], // Os volumes de dados de entrada irão aqui
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Azul
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Tráfego de Saída (OUT)',
                data: [], // Os volumes de dados de saída irão aqui
                backgroundColor: 'rgba(255, 99, 132, 0.6)', // Vermelho
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Volume de Tráfego (bytes)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Clientes (IPs)'
                }
            }
        }
    }
});

// --- Funções de Lógica ---

// NOVA FUNÇÃO: Pega os dados da API e atualiza o gráfico
function updateChart(apiData) {
    // Pega os IPs dos clientes (as chaves do objeto JSON)
    const clientIPs = Object.keys(apiData);
    
    // Pega os dados de entrada e saída para cada cliente
    const inboundData = clientIPs.map(ip => apiData[ip].in);
    const outboundData = clientIPs.map(ip => apiData[ip].out);

    // Atualiza os dados do gráfico
    trafficChart.data.labels = clientIPs;
    trafficChart.data.datasets[0].data = inboundData;  // Dataset de Entrada
    trafficChart.data.datasets[1].data = outboundData; // Dataset de Saída

    // Manda o Chart.js redesenhar o gráfico com os novos dados
    trafficChart.update();
}


// Função para buscar os dados da API (MODIFICADA)
async function fetchTrafficData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Em vez de console.log, agora chamamos a função que atualiza o gráfico
        updateChart(data);

    } catch (error) {
        console.error('Falha ao buscar dados do tráfego:', error);
    }
}

// --- Execução ---

// Roda a função a cada 5 segundos
setInterval(fetchTrafficData, 5000);

// Roda a função uma vez no início
fetchTrafficData();