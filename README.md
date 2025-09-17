# Sistema Biblioteca 📚

Sistema completo de gerenciamento de biblioteca desenvolvido com Symfony (backend) e React/TypeScript (frontend).

## 🚀 Tecnologias

### Backend
- **PHP 8.1+**
- **Symfony 6.4**
- **Doctrine ORM**
- **MySQL/MariaDB**
- **JWT Authentication** (Lexik JWT Bundle)
- **Nelmio CORS Bundle**

### Frontend
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **React Router DOM**
- **Axios**
- **Zustand** (Gerenciamento de estado)
- **React Hook Form**
- **Lucide React** (Ícones)

## 📁 Estrutura do Projeto

```
Sistema-Biblioteca/
├── backend/              # Estrutura básica Symfony
├── bibLioTec/           # Sistema completo de biblioteca
│   ├── backend/         # API REST em Symfony
│   │   ├── config/      # Configurações do Symfony
│   │   ├── migrations/  # Migrations do banco de dados
│   │   ├── public/      # Arquivos públicos
│   │   └── src/         # Código fonte
│   │       ├── Controller/  # Controllers da API
│   │       ├── Entity/      # Entidades do Doctrine
│   │       └── Repository/  # Repositórios
│   ├── frontend/        # Aplicação React
│   │   ├── src/
│   │   │   ├── components/  # Componentes React
│   │   │   ├── pages/       # Páginas da aplicação
│   │   │   ├── services/    # Serviços de API
│   │   │   ├── store/       # Gerenciamento de estado
│   │   │   └── types/       # TypeScript types
│   │   └── public/
│   └── docker-compose.yml   # Configuração Docker
└── README.md

```

## 🔧 Instalação e Configuração

### Pré-requisitos
- PHP 8.1 ou superior
- Composer
- Node.js 16+ e npm
- MySQL/MariaDB
- Docker (opcional)

### Backend (Symfony)

1. **Clone o repositório**
```bash
git clone https://github.com/thiagomms/Sistema-Biblioteca.git
cd Sistema-Biblioteca/bibLioTec/backend
```

2. **Instale as dependências**
```bash
composer install
```

3. **Configure o banco de dados**
```bash
# Copie o arquivo .env e configure suas credenciais
cp .env .env.local

# Edite .env.local e configure DATABASE_URL
# DATABASE_URL="mysql://usuario:senha@127.0.0.1:3306/biblioteca?serverVersion=8.0"
```

4. **Crie o banco de dados e execute as migrations**
```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

5. **Gere as chaves JWT**
```bash
php bin/console lexik:jwt:generate-keypair
```

6. **Inicie o servidor**
```bash
symfony server:start
# ou
php -S localhost:8000 -t public
```

### Frontend (React)

1. **Navegue até a pasta do frontend**
```bash
cd ../frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure a URL da API**
```typescript
// Em src/services/api.ts, verifique se a URL está correta:
const API_URL = 'http://localhost:8000/api';
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

### Docker (Opcional)

Para usar com Docker:

```bash
cd bibLioTec
docker-compose up -d
```

## 📋 Funcionalidades

### Gestão de Livros
- ✅ Cadastro, edição e exclusão de livros
- ✅ Listagem com busca e filtros
- ✅ Controle de disponibilidade
- ✅ Categorização de livros

### Gestão de Usuários/Leitores
- ✅ Cadastro de leitores
- ✅ Sistema de autenticação JWT
- ✅ Perfis de usuário (Admin/Leitor)
- ✅ Histórico de empréstimos

### Gestão de Empréstimos
- ✅ Registro de empréstimos
- ✅ Controle de devoluções
- ✅ Histórico completo
- ✅ Alertas de atraso

### Gestão de Autores
- ✅ Cadastro de autores
- ✅ Vinculação com livros
- ✅ Listagem e busca

### Gestão de Categorias
- ✅ Criação de categorias
- ✅ Organização de livros por categoria

## 🔌 API Endpoints

### Autenticação
- `POST /api/login` - Login de usuário
- `POST /api/register` - Registro de novo usuário

### Livros
- `GET /api/books` - Listar todos os livros
- `GET /api/books/{id}` - Detalhes de um livro
- `POST /api/books` - Criar novo livro
- `PUT /api/books/{id}` - Atualizar livro
- `DELETE /api/books/{id}` - Deletar livro

### Empréstimos
- `GET /api/loans` - Listar empréstimos
- `POST /api/loans` - Criar empréstimo
- `PUT /api/loans/{id}/return` - Registrar devolução

### Usuários
- `GET /api/users` - Listar usuários
- `GET /api/users/{id}` - Detalhes do usuário
- `POST /api/users` - Criar usuário
- `PUT /api/users/{id}` - Atualizar usuário

## 🛡️ Segurança

- Autenticação via JWT Token
- Senhas criptografadas com bcrypt
- CORS configurado
- Validação de dados no backend e frontend

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

- **Thiago MMS** - [GitHub](https://github.com/thiagomms)

## 🙏 Agradecimentos

- Symfony Documentation
- React Documentation
- Comunidade Open Source

---

⭐️ Se este projeto te ajudou, considere dar uma estrela!
