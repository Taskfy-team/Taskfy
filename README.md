📦 Taskfy - Sistema de Gerenciamento de Tarefas
Este projeto é um sistema web completo para gerenciamento de usuários, tarefas e grupos, com acesso diferenciado para administradores. Desenvolvido com Node.js, Express, EJS e MySQL, e pode ser facilmente instalado com XAMPP e o phpMyAdmin.

🔗 Como instalar e executar
✅ Pré-requisitos
1. XAMPP instalado e em execução (MySQL)
2. Node.js instalado
3. Editor de código (ex: VS Code)

1️⃣ Baixar e extrair o projeto
Acesse o repositório do projeto no GitHub:

📁 https://github.com/Taskfy-team/Taskfy

Clique em "Code" > "Download ZIP".

Extraia o arquivo .zip em uma pasta do seu computador, por exemplo:
C:\Users\SeuNome\Documentos\Taskfy

2️⃣ Importar o banco de dados com o XAMPP/phpMyAdmin
Inicie o XAMPP e ative o MySQL e o Apache clicando em “Start”.

Acesse o phpMyAdmin: http://localhost/phpmyadmin

Clique em "Novo" no menu lateral esquerdo e crie um banco com o nome: taskfy

Após criar, clique no banco taskfy e vá na aba "Importar".
Clique em "Escolher arquivo" e selecione o arquivo taskfy.sql que está na pasta extraída do projeto.
Clique em "Executar" (ou "Go") para importar as tabelas e dados.

3️⃣ Instalar as dependências do projeto
Abra o terminal (Prompt de Comando ou VS Code) na pasta do projeto.

Execute:
npm install
npm start

🔑 Acessar o sistema
Login do Administrador:
http://localhost:3000/admin/login
- Para fazer login como administrador, você pode utilizar as seguintes credenciais:
E-mail: otavio@email.com
Senha: 123

Login de Usuário:
http://localhost:3000
- Para fazer login como usuário, você pode criar o seu usuario ou utilizar as seguintes credenciais:
E-mail: gabriel@email.com
Senha: 123
