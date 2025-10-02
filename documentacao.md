
# Documentação Frontend (`script.js`)

## 1\. Constantes Globais

```javascript
const API_URL = 'http://127.0.0.1:5000/api/traffic';

const overviewView = document.getElementById('overview-view');
const drilldownView = document.getElementById('drilldown-view');
const backButton = document.getElementById('backButton');
const clientListBody = document.getElementById('client-list-body');
```

1.  A constante `API_URL` define o endereço do endpoint do backend de onde os dados de tráfego serão buscados. Se o endereço ou a porta do backend mudar, esta é a única linha que precisa ser alterada.
2.  As constantes `overviewView`, `drilldownView`, `backButton` e `clientListBody` armazenam referências aos principais elementos do HTML. Isso melhora a performance, pois o script não precisa procurar por esses elementos na página toda vez que precisar manipulá-los.

## 2\. Variáveis de Estado

```javascript
let lastApiData = {};
let overviewChart, protocolChart;
```

1.  A variável `lastApiData` é um objeto que serve como um "cache" local, armazenando a última leva de dados completa recebida da API. Ela é a **fonte da verdade** para todas as funções que precisam desenhar ou exibir informações na tela.
2.  As variáveis `overviewChart` e `protocolChart` são inicializadas vazias e, após a execução da função `initialize()`, elas guardam as instâncias dos dois gráficos do Chart.js. Manter essas instâncias em variáveis globais permite que o script atualize os gráficos sem precisar recriá-los do zero a cada 5 segundos.

## 3\. Lógica Principal de Busca de Dados

```javascript
async function fetchTrafficData() {
    try {
        const response = await fetch(API_URL);
        lastApiData = await response.json();
        
        const clientIPs = Object.keys(lastApiData);
        overviewChart.data.labels = clientIPs;
        overviewChart.data.datasets[0].data = clientIPs.map(ip => lastApiData[ip].in);
        overviewChart.data.datasets[1].data = clientIPs.map(ip => lastApiData[ip].out);
        overviewChart.update();

        updateClientList(lastApiData);

    } catch (error) { console.error('Falha ao buscar dados:', error); }
}
```

1.  A função `fetchTrafficData` é o motor da aplicação, responsável por manter os dados do dashboard atualizados.
    1.1. Ela é `async`, o que permite o uso de `await` para esperar a resposta da rede de forma limpa, sem travar o navegador.
    1.2. A linha `lastApiData = await response.json()` atualiza a variável de estado com os novos dados.
    1.3. As linhas seguintes extraem as informações necessárias do `lastApiData` (IPs, dados de entrada/saída) e as inserem diretamente na instância do `overviewChart`.
    1.4. `overviewChart.update()` é o comando do Chart.js que efetivamente redesenha o gráfico com os novos dados.
    1.5. A chamada `updateClientList(lastApiData)` aciona a atualização da tabela de resumo, garantindo que ela esteja sempre em sincronia com o gráfico.
    1.6. O bloco `catch` captura erros de rede (ex: se o backend estiver offline) e os exibe no console, evitando que a aplicação quebre.

## 4\. Gerenciamento de Visualizações (Telas)

```javascript
function showView(viewName) {
    overviewView.classList.toggle('hidden', viewName === 'drilldown');
    drilldownView.classList.toggle('hidden', viewName !== 'drilldown');
}
```

1.  A função `showView` gerencia qual das duas "telas" (`overview-view` ou `drilldown-view`) está visível.
    1.1. Ela usa `classList.toggle` com um segundo argumento booleano, uma forma concisa de adicionar a classe `.hidden` se a condição for verdadeira e removê-la se for falsa. Isso torna o código mais limpo do que usar `if/else` com `add` e `remove`.

## 5\. Lógica da Tela de Drill Down

```javascript
function populateDrilldownView(clientIP, direction) {
    // ... corpo da função ...
}
```

1.  Esta função é chamada quando o usuário clica em uma barra do gráfico principal. Ela é responsável por preencher toda a tela de detalhes.
    1.1. Recebe como argumentos o `clientIP` e a `direction` ('in' ou 'out') do clique.
    1.2. Define o título da tela e as cores do gráfico de rosca com base na `direction` recebida, criando a experiência contextual.
    1.3. Acessa `lastApiData[clientIP]` para obter todos os dados daquele cliente.
    1.4. Preenche o painel de informações de texto (`#info-ip`, `#info-total`, etc.) com os dados numéricos.
    1.5. Constrói dinamicamente a lista de protocolos, separando os de entrada e os de saída, e a insere no elemento `<ul>` da página.
    1.6. Atualiza o gráfico de rosca (`protocolChart`) com os dados de protocolo apenas da `direction` clicada e chama `protocolChart.update()`.

## 6\. Lógica da Tabela de Resumo

```javascript
function updateClientList(apiData) {
    // ... corpo da função ...
}
```

1.  A função `updateClientList` é responsável por renderizar a tabela de resumo abaixo do gráfico de barras.
    1.1. A primeira linha, `clientListBody.innerHTML = ''`, é crucial para limpar a tabela antes de adicionar os novos dados, evitando que a lista cresça infinitamente.
    1.2. Ela itera sobre os dados da API. Para cada cliente, ela junta os protocolos de entrada e saída.
    1.3. `new Set([...protocolsIn, ...protocolsOut])` é uma técnica eficiente para criar uma lista de protocolos únicos, evitando repetições (ex: se TCP for usado tanto na entrada quanto na saída, ele aparecerá apenas uma vez).
    1.4. O restante do código cria dinamicamente os elementos `<tr>` (linha) e `<td>` (célula) e os injeta no HTML.

## 7\. Inicialização e Eventos

```javascript
function initialize() {
    // ... corpo da função ...
}

initialize();
```

1.  A função `initialize` é o ponto de entrada da aplicação. Ela é chamada uma única vez, quando a página carrega.
    1.1. Ela cria as duas instâncias de gráfico (`overviewChart` e `protocolChart`) e as armazena nas variáveis globais. É aqui que as configurações padrão de cada gráfico (tipo, cores, opções) são definidas.
    1.2. `options: { onClick: ... }`: Esta é a parte mais importante da interatividade. É aqui que definimos a função que será executada quando o usuário clicar no `overviewChart`. A função interna identifica o IP e a direção e chama `populateDrilldownView` e `showView`.
    1.3. `backButton.addEventListener('click', ...)`: Configura o evento que reseta a visualização para a tela principal quando o botão "Voltar" é clicado.
    1.4. `setInterval(fetchTrafficData, 5000)`: Inicia o "loop" principal da aplicação, garantindo que a função `fetchTrafficData` seja chamada a cada 5 segundos.
    1.5. `fetchTrafficData()`: Uma chamada imediata é feita para que o usuário não tenha que esperar 5 segundos para ver os primeiros dados na tela.
2.  A linha final `initialize()` efetivamente inicia toda a aplicação.