# Supervisório Lab 2 - Sistema de Monitoramento Integrado 🏭

O **Supervisório Lab 2** é um dashboard de monitoramento de máquinas industriais desenvolvido como projeto prático para o curso de Front-end no **SENAI**. A aplicação consome dados em tempo real via **Node-RED** para visualizar o status de operação, produtividade e alertas de dispositivos do laboratório.

## 🚀 Funcionalidades

* **Dashboard em Tempo Real:** Visualização de métricas críticas (status de máquina, produção e monitoramento de destino).
* **Interface Responsiva:** Design otimizado para diferentes tamanhos de tela utilizando Tailwind CSS.
* **Integração de Dados:** Consumo de fluxos de dados provenientes do Node-RED.
* **Componentização:** UI construída com React para garantir reutilização e performance.

## 🛠️ Tecnologias Utilizadas

* **Framework:** [Next.js](https://nextjs.org/) (React)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Backend/Automação:** [Node-RED](https://nodered.org/)
* **Deploy/Versionamento:** Git & GitHub

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (v18 ou superior)
* [Git](https://git-scm.com/)
* Instância do **Node-RED** configurada para o envio dos dados.

## 🔧 Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/BiancaAntunes-dev/supervisorio-lab-2.git
    ```

2.  **Entre no diretório:**
    ```bash
    cd supervisorio-lab-2
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

5.  Acesse `http://localhost:5173/` no seu navegador.

## 🏗️ Estrutura do Projeto

* `/components`: Componentes reutilizáveis da interface (Cards, Gráficos, Sidebar).
* `/pages` ou `/app`: Roteamento e páginas principais.
* `/public`: Ativos estáticos como imagens e ícones.
* `/styles`: Configurações globais do Tailwind.

---

## 👩‍💻 Autora

Desenvolvido por **Bianca Antunes**.
* Estudante de Front-end no SENAI.
* Graduada em Biomedicina, transicionando para a área de tecnologia com foco em interfaces webs e UX.

---
*Projeto desenvolvido para fins educacionais.*
