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


---------------------------------------------------------------------------------------------------
# Frontend - Dashboard de Análise de Tráfego

Este diretório contém o código-fonte do frontend para o projeto "Dashboard de Análise de Tráfego de Servidor em Tempo Real".

O objetivo deste frontend é consumir os dados da API do backend e exibi-los em uma interface web interativa e de fácil compreensão. [cite\_start]A aplicação é uma Single-Page Application (SPA) desenvolvida com HTML, CSS e JavaScript puro, utilizando a biblioteca Chart.js para a visualização de dados. [cite: 23]

## 1\. Pré-requisitos

Antes de executar o frontend, garanta que os seguintes requisitos sejam atendidos:

  * **Backend em Execução:** O servidor backend (`captura.py`) **DEVE** estar rodando. O frontend depende da API em `http://127.0.0.1:5000/api/traffic` para obter os dados.
  * **Navegador Web Moderno:** Um navegador como Google Chrome, Mozilla Firefox ou Microsoft Edge é necessário para visualizar a página.
  * **(Opcional) Visual Studio Code:** Necessário para o "Método 2" de execução.

## 2\. Configuração

Por padrão, a configuração do frontend aponta para o servidor backend rodando na mesma máquina.

1.  **Verifique a URL da API:**
      * Abra o arquivo `script.js`.
      * Confirme se a constante `API_URL` está correta. O valor padrão é:
        ```javascript
        const API_URL = 'http://127.0.0.1:5000/api/traffic';
        ```
      * Se o seu backend estiver rodando em um endereço IP ou porta diferente, você deve atualizar esta linha. Para este projeto, o valor padrão está correto.

## 3\. Execução

Existem duas maneiras de executar o frontend. O Método 2 é recomendado para desenvolvimento, pois facilita o processo de teste e alteração do código.

### 3.1. Método 1: Abrindo o Arquivo Diretamente (O Mais Simples)

Este método não requer a instalação de nenhuma ferramenta adicional.

1.  **Garanta que o backend (`captura.py`) esteja rodando** em um terminal de administrador.
2.  Navegue até a pasta `frontend/` usando o explorador de arquivos do seu sistema operacional (Ex: Windows Explorer).
3.  Localize o arquivo `index.html`.
4.  Dê um **duplo-clique** no arquivo `index.html` ou clique com o botão direito e selecione "Abrir com" e escolha seu navegador.
5.  O dashboard será aberto no seu navegador com um endereço local do tipo `file:///C:/Users/.../frontend/index.html`.

### 3.2. Método 2: Usando o "Live Server" no VS Code (Recomendado)

Esta abordagem cria um pequeno servidor web local para hospedar seus arquivos, o que evita alguns problemas de CORS e recarrega a página automaticamente quando você salva uma alteração no código.

1.  **Garanta que o backend (`captura.py`) esteja rodando.**
2.  Abra a pasta **raiz** do seu projeto no Visual Studio Code.
3.  **Instale a Extensão:**
      * Vá para a aba de "Extensões" na barra lateral esquerda (ou pressione `Ctrl+Shift+X`).
      * Procure por `Live Server`.
      * Instale a extensão criada por *Ritwick Dey*.
4.  **Inicie o Servidor:**
      * Na árvore de arquivos do VS Code, encontre e clique com o botão direito no arquivo `frontend/index.html`.
      * No menu de contexto, selecione a opção **"Open with Live Server"**.
5.  Uma nova aba do seu navegador será aberta automaticamente com um endereço como `http://127.0.0.1:5500/frontend/index.html`.

## 4\. Verificação

Independentemente do método de execução, para confirmar que o frontend está funcionando:

1.  A página deve carregar, exibindo o título e a estrutura do dashboard (com o gráfico e a tabela inicialmente vazios).
2.  Dentro de 5 segundos, o gráfico de barras e a tabela de clientes devem ser preenchidos com os dados vindos da API.
3.  O gráfico e a tabela devem se atualizar automaticamente a cada 5 segundos.
4.  A interatividade de clique (drill down) e o botão "Voltar" devem funcionar como esperado.

> **Em caso de problemas:** Pressione a tecla **F12** no navegador para abrir as "Ferramentas de Desenvolvedor" e verifique a aba **"Console"** por mensagens de erro. O erro mais comum é uma falha de conexão com a API, indicando que o backend não está rodando.