const API_URL = 'http://127.0.0.1:5000/api/traffic';

async function fetchTrafficData() {
    console.log('Buscando dados da API...');
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.statusText}`);
        }
        const data = await response.json();
        
        console.log('Dados recebidos:', data);

    } catch (error) {
        console.error('Falha ao buscar dados do tráfego:', error);
    }
}

setInterval(fetchTrafficData, 5000);
fetchTrafficData();