# Guia de Segurança

## Visão Geral

Este documento descreve as práticas de segurança implementadas na plataforma SaaS.

## Autenticação

### NextAuth.js
- Implementação de sessões seguras com JWT
- Suporte para OAuth (Google, GitHub)
- Email verification (opcional)
- Password hashing com bcrypt

### Requisitos de Senha
- Mínimo 8 caracteres
- Deve conter letras maiúsculas e minúsculas
- Deve conter números

## Autorização

### RBAC (Role-Based Access Control)
Três papéis disponíveis:
- **Admin**: Acesso total ao workspace, pode gerenciar membros e billing
- **Member**: Acesso a recursos do workspace, sem permissão de admin
- **Viewer**: Acesso somente leitura

### Multi-Tenancy
- Cada workspace é isolado
- Dados de um workspace não são acessíveis a outro
- Middleware valida acesso antes de processar requests

## Middleware de Segurança

### Request Validation
- Validação de entrada com Zod
- Sanitização de dados
- Prevenção de SQL injection (Prisma)

### Rate Limiting
- Free: 100 requests/hora
- Pro: 1000 requests/hora
- Enterprise: Unlimited

### CORS
- Apenas domínios aprovados
- Credentials habilitadas

## Dados Sensíveis

### Stripe
- API Keys nunca expostas no client
- Webhooks assinados e validados
- Tokens de checkout seguros

### Senhas
- Hasheadas com bcrypt (10 rounds)
- Nunca armazenadas em plain text
- Nunca enviadas em emails

### Sessions
- HTTP-only cookies
- Secure flag em produção
- SameSite=Strict

## Proteção contra Vulnerabilidades

### XSS (Cross-Site Scripting)
- Content Security Policy (CSP)
- Sanitização de inputs
- React escapa output por padrão

### CSRF (Cross-Site Request Forgery)
- CSRF tokens via cookies
- SameSite cookies

### SQL Injection
- Prisma ORM com prepared statements
- Validação de inputs

### Insecure Dependencies
- Auditar regularmente: `npm audit`
- Manter pacotes atualizados
- Usar dependências confiáveis

## Variáveis de Ambiente

### Obrigatórias em Produção
```env
DATABASE_URL=              # PostgreSQL connection
NEXTAUTH_URL=             # URL da aplicação
NEXTAUTH_SECRET=          # Chave secreta (gerar com: openssl rand -base64 32)
STRIPE_SECRET_KEY=        # Chave secreta do Stripe
STRIPE_WEBHOOK_SECRET=    # Webhook secret do Stripe
```

### Opcional
```env
STRIPE_*_PRICE_ID=        # IDs dos planos no Stripe
```

Nunca commitar arquivos `.env.local` ou `.env`.

## Logging e Monitoring

### Logs
- Todos os eventos importantes são logados
- Senhas nunca aparecem nos logs
- Usar `lib/logger.ts` para consistent logging

### Monitoramento
- Integração com Sentry (recomendado)
- Alertas para erros críticos
- Rastreamento de performance

## Deploy em Produção

### Checklist
- [ ] Variáveis de ambiente configuradas
- [ ] Database backup configurado
- [ ] SSL/TLS habilitado
- [ ] CORS corretamente configurado
- [ ] Rate limiting ativo
- [ ] Logging centralizado
- [ ] Monitoramento configurado
- [ ] WAF habilitado (em provedores que suportam)
- [ ] Headers de segurança configurados

### Headers Recomendados
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## Incident Response

### Procedimento
1. Identificar a vulnerabilidade
2. Isolar o impacto
3. Notificar usuários afetados
4. Implementar patch
5. Deploy em produção
6. Monitorar por regressões
7. Post-mortem interno

## Compliance

### LGPD (Brasil)
- Consentimento para coleta de dados
- Direito ao acesso dos dados
- Direito ao esquecimento
- Exportação de dados

### GDPR (Europa)
- Data Privacy Agreement
- Direitos dos titulares de dados
- Data Retention Policy

## Testes de Segurança

### Executar Regularmente
```bash
# Auditar dependências
npm audit

# Verificar tipos
npm run type-check

# Lint
npm run lint

# Testes
npm run test
```

## Contato de Segurança

Para reportar vulnerabilidades, envie um email para: security@example.com

Não publique vulnerabilidades em issues públicas.
