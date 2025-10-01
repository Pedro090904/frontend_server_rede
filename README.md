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

