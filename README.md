# Documentação do frontend

## Referindo-se ao arquivo "script.js"

const API_URL = 'http://127.0.0.1:5000/api/traffic';

// --- Elementos do DOM ---
const overviewView = document.getElementById('overview-view');
const drilldownView = document.getElementById('drilldown-view');
const backButton = document.getElementById('backButton');

1. A variável API_URL guarda o endpoint da sua API Flask
2. A variável overviewView refere-se a tela principal, sendo ela uma função nativa do Javascript e atribuindo o elemento ao atributo "id = overview-view"
3. A variável  drilldownView refere-se a tela detalhada, sendo ela uma função nativa do Javascript e atribuindo o elemento ao atributo "id = drilldown-view "
4. A variável backButton refere-se ao botão de voltar

# Variáveis de estado 

// --- Variáveis de Estado ---
let lastApiData = {};
let overviewChart, protocolChart;

1. let lastApiData cria um objetio vazio para conter os dados recentes da API 
2. let overviewChart, procolChart instancia duas variáveis de uma vez sem valor inicial, mas guardando instâncias gráficas. No caso da overviewChart guardando o gráfico princial e a protocolChart guardando o gráfico do protocolo
   
# Funções de visualização 

function showView(viewName) {
    overviewView.classList.toggle('hidden', viewName === 'drilldown');
    drilldownView.classList.toggle('hidden', viewName !== 'drilldown');
}

1. A função showView recebe como parâmetro o viewName e tem como objetivo mostrar a tela podendo ser ela a tela principal "overView" ou a tela detalahda " drilldown"
   1.1 

