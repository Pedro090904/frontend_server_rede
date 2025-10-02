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

## Referindo-se ao arquivo "style.css"

body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    color: #333;
    text-align: center;
    margin: 0;
    padding: 20px;
}

1. A função body define o visual da página.
2. A fonte é padrão **Arial**
3. Cores: Cor do fundo (**background-color: #f4f4f9;**) e a cor do texto é escuro para facilitar a leitura (**color: #333;**).
4. As margin e o padding, estão ajustados para não escostar nas bordas.

h1, h2 { color: #444; }

.hidden { display: none; }

1. h1, h2 - os titulos principais e secundarios estão com uma cor escura para destaque.
2. A classe utilitária .hidden oculta elementos do layout para alternar a visualização principal e detalhada.

# Estilo de tela do Drill Down

#drilldown-view .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 20px auto;
}

#backButton {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
}
#backButton:hover { background-color: #5a6268; }

1. A função #drilldown-view .header é o cabeçalho que utiliza **Flexbox** para o titúlo da pagina e o botão de voltar(**#backButton**). Assim, garante um espaço adequado entre eles
