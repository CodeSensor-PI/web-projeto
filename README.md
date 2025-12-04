# Agendfy Web Projeto

Este é o repositório do **Agendfy Web Projeto**, uma aplicação desenvolvida para apresentar as soluções da empresa Agendfy, especializada em tecnologia para sistemas de agendamento.

## Sobre a Agendfy

A Agendfy é uma empresa do ramo da tecnologia focada no desenvolvimento de sistemas inteligentes para agendamento, trazendo inovação e praticidade para profissionais autônomos e empresas. Nossa missão é facilitar o dia a dia dos nossos clientes, oferecendo ferramentas modernas e seguras. Valorizamos transparência, eficiência e compromisso com o sucesso dos nossos parceiros.

## Funcionalidades

O projeto é dividido em duas principais áreas:

### 1. Landing Page
- **Apresentação da empresa**: Explicação sobre a Agendfy, missão e valores.
- **Soluções**: Descrição dos produtos e serviços oferecidos.
- **FAQ**: Perguntas frequentes para tirar dúvidas dos visitantes.
- **Formulário de contato**: Para visitantes entrarem em contato com a empresa.

### 2. Sistema de Login e Dashboard (Área do Psicólogo)
Após autenticação, o usuário tem acesso a diversas funcionalidades para facilitar seu trabalho:

- **Dashboard**: Exibe gráficos, KPIs e visões relevantes para o negócio.
- **Calendário**: Visualização semanal dos agendamentos (nome, status, dia, data e hora) e gestão de dias/horários disponíveis. Permite agendar novos atendimentos.
- **Pacientes**: Lista com todos os pacientes atendidos, incluindo dados cadastrais. Possibilidade de adicionar novos pacientes para agendamento.
- **Configurações**: Atualização de dados do psicólogo e definição de valores dos planos oferecidos.

## Tecnologias Utilizadas

- **Frontend**:
  - JavaScript
  - ReactJS
  - Tailwind CSS
  - CSS

- **Backend**:
  - Node.js (funções específicas)
  - Integração principal com backend Java usando o framework **Spring Boot**

## Como rodar o projeto

1. **Clone o repositório**
   ```sh
   git clone https://github.com/CodeSensor-PI/web-projeto.git
   cd web-projeto
   ```

2. **Instale as dependências do frontend**
   ```sh
   npm install
   ```

3. **Configure o backend**
   - Certifique-se de ter o backend Java (Spring Boot) rodando e configurado conforme instruções do projeto backend.

4. **Inicie a aplicação**
   ```sh
   npm start
   ```

## Deploy

### Preparação para Deploy

1. **Configure as variáveis de ambiente**
   - Certifique-se de que os arquivos em `environments/` estejam configurados corretamente
   - Defina a URL do backend de produção no arquivo `environment.prd.ts`

2. **Build do projeto**
   ```sh
   npm run build
   ```
   Isso gerará os arquivos otimizados na pasta `dist/`

### Deploy na AWS EC2

**Deploy em EC2 com Nginx:**

1. **Crie uma instância EC2**
   - Amazon Linux 2 ou Ubuntu
   - Tipo: t2.micro (free tier)
   - Configure Security Group: HTTP (80), HTTPS (443), SSH (22)

2. **Conecte via SSH e configure o servidor**
   ```sh
   # Atualize o sistema
   sudo yum update -y  # Amazon Linux
   # ou
   sudo apt update && sudo apt upgrade -y  # Ubuntu

   # Instale Nginx
   sudo yum install nginx -y  # Amazon Linux
   # ou
   sudo apt install nginx -y  # Ubuntu

   # Instale Node.js (para build)
   curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install nodejs -y
   ```

3. **Clone e build o projeto**
   ```sh
   cd /var/www
   sudo git clone https://github.com/CodeSensor-PI/web-projeto.git
   cd web-projeto
   sudo npm install
   sudo npm run build
   ```

4. **Configure Nginx**
   ```sh
   sudo nano /etc/nginx/conf.d/agendfy.conf
   ```
   
   Adicione:
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;  # ou IP público da EC2
       root /var/www/web-projeto/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

5. **Inicie o Nginx**
   ```sh
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

### Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis no serviço de deploy escolhido:

- `VITE_API_URL` - URL do backend em produção
- Outras variáveis específicas do ambiente de produção conforme necessário

### Pós-Deploy

Após o deploy, verifique:
- ✅ A aplicação está acessível pela URL fornecida
- ✅ A integração com o backend está funcionando corretamente
- ✅ As rotas estão funcionando (verifique configuração de SPA)
- ✅ Os assets estão carregando corretamente

## Licença

Este projeto está sob a licença MIT.

---

**Agendfy** - Soluções inteligentes para o seu agendamento.
