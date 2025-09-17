# Sistema de Gerenciamento de Empréstimos de Livros

## Como rodar o projeto

### 1. Suba o ambiente com Docker

```sh
docker-compose up --build
```

- O backend Symfony estará disponível em: http://localhost:8000
- O banco de dados PostgreSQL estará disponível na porta 5432
- O Adminer (gerenciador do banco) estará disponível em: http://localhost:8080

### 2. Estrutura do Projeto
- `frontend/` → Seu frontend React
- `backend/` → Backend Symfony (será criado)

### 3. Configuração do Backend
O backend será criado na pasta `backend` e já estará configurado para conectar ao banco PostgreSQL do Docker.

---

Se precisar de mais instruções, consulte este README após a criação do backend. 