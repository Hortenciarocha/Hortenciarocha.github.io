# Guia de Contribuição

## Como Contribuir

Obrigado por considerar contribuir para esta plataforma SaaS! Existem várias formas de contribuir.

## Reportar Bugs

### Antes de Reportar
- Verificar se o bug já foi reportado
- Testar com a versão mais recente

### Como Reportar
1. Use o título descritivo
2. Descreva os passos exatos para reproduzir
3. Forneça exemplos específicos
4. Descreva o comportamento observado
5. Descreva o comportamento esperado

### Exemplo
```
Título: Login falha com email contendo +

Passos para reproduzir:
1. Tentar fazer login com email: user+test@example.com
2. Inserir senha correta
3. Clicar em "Login"

Esperado: Login bem-sucedido
Observado: Erro "Email inválido"

Ambiente:
- Node.js 18.0.0
- Next.js 16
- Browser: Chrome 120
```

## Sugerir Melhorias

- Use o título descritivo
- Descreva o comportamento atual
- Descreva o comportamento sugerido
- Explique por quê essa melhoria seria útil

## Pull Requests

### Processo

1. **Fork** o repositório
2. **Clone** seu fork: `git clone seu-fork-url`
3. **Criar branch**: `git checkout -b feature/sua-feature`
4. **Fazer alterações** seguindo o estilo de código
5. **Testes**: `npm run test`
6. **Lint**: `npm run lint`
7. **Commit** com mensagens claras: `git commit -m "feat: adicione nova feature"`
8. **Push** para seu fork: `git push origin feature/sua-feature`
9. **Abrir PR** descrevendo as alterações

### Convenção de Commits

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: mudanças de formatação
refactor: refatoração de código
test: adiciona testes
chore: atualiza dependências
```

### Estilo de Código

#### TypeScript
```typescript
// Bom
function getUserById(id: string): Promise<User | null> {
  return db.user.findUnique({ where: { id } })
}

// Evitar
function get_user(id) {
  return db.user.findUnique({where: {id}})
}
```

#### React
```typescript
// Bom
export function UserCard({ user, onDelete }: Props) {
  return (
    <div className="p-4 rounded-lg border">
      <h3>{user.name}</h3>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  )
}

// Evitar
export const UserCard = (props: any) => (
  <div style={{ padding: '16px' }}>
    <h3>{props.user.name}</h3>
    <button onClick={e => props.onDelete(props.user.id)}>Delete</button>
  </div>
)
```

#### Classes CSS
```typescript
// Bom - usar classes do Tailwind
<div className="p-4 rounded-lg border bg-card hover:bg-accent">

// Evitar - criar custom CSS
<div className="custom-card">
```

## Desenvolvimento Local

### Setup

```bash
# Clone o repositório
git clone seu-repo
cd seu-repo

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Setup do banco
npm run prisma:migrate

# Inicie o servidor dev
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev           # Inicia servidor dev
npm run build         # Build para produção
npm start             # Inicia servidor prod
npm run lint          # Lint do código
npm run type-check    # Verificar tipos
npm run test          # Executar testes
npm run test:watch    # Testes em modo watch
npm run prisma:migrate # Executar migrações
npm run prisma:studio  # Abrir Prisma Studio
```

## Testes

### Escrevendo Testes

```typescript
import { describe, it, expect } from '@jest/globals'
import { UserService } from '@/services/user-service'

describe('UserService', () => {
  it('deve retornar usuário por ID', async () => {
    const user = await UserService.getUserById('123')
    expect(user).toBeDefined()
    expect(user?.id).toBe('123')
  })
})
```

### Executar Testes
```bash
npm run test              # Uma vez
npm run test:watch       # Em desenvolvimento
npm run test:coverage    # Com coverage
```

### Cobertura Alvo
- Services: 80%+
- API routes: 70%+
- Componentes: 60%+

## Estrutura do Projeto

```
/
├── /app                    # Next.js App Router
│   ├── /(auth)            # Páginas de autenticação
│   ├── /(dashboard)       # Dashboard protegido
│   ├── /api               # API routes
│   └── layout.tsx         # Root layout
├── /components            # Componentes React
│   ├── /ui               # Componentes base (shadcn/ui)
│   ├── /auth             # Componentes de auth
│   ├── /workspace        # Componentes de workspace
│   ├── /billing          # Componentes de billing
│   └── /dashboard        # Componentes de dashboard
├── /lib                   # Utilitários
│   ├── auth.ts           # Configuração NextAuth
│   ├── db.ts             # Cliente Prisma
│   ├── validations.ts    # Schemas Zod
│   └── utils.ts          # Funções utilitárias
├── /services             # Lógica de negócio
│   ├── user-service.ts
│   ├── workspace-service.ts
│   └── subscription-service.ts
├── /types                # Tipos TypeScript
├── /prisma               # ORM Prisma
│   ├── schema.prisma
│   └── seed.ts
├── /docs                 # Documentação
└── /public               # Arquivos estáticos
```

## Relatório de Segurança

Se descobrir uma vulnerabilidade:

1. **NÃO** abra uma issue pública
2. Envie um email para: security@example.com
3. Inclua:
   - Descrição da vulnerabilidade
   - Como reproduzir
   - Impacto potencial
   - Sugestão de patch (se tiver)

## Licença

Ao contribuir, você concorda que seu código será licenciado sob MIT.

## Conduta

Este projeto adota um Código de Conduta. Participantes devem:

- Ser respeitosos
- Não discriminar
- Reportar comportamentos abusivos
- Focar em feedback construtivo

## Reconhecimento

Todos os contribuidores serão reconhecidos em:
- README.md
- Página de contribuidores
- Release notes

## Perguntas?

- Abra uma issue com label `question`
- Procure na documentação
- Verifique issues anteriores

Obrigado por contribuir!
