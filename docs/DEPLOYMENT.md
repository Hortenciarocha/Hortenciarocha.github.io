# Guia de Deploy

## Opções de Hosting

### Vercel (Recomendado para Next.js)

**Vantagens:**
- Deploy automático via Git
- Ambiente staging e production
- Edge Functions
- Analytics built-in
- Suporte Next.js nativo

**Setup:**

1. Criar conta em vercel.com
2. Conectar repositório GitHub
3. Configurar variáveis de ambiente:
   - Settings > Environment Variables
   - Adicionar todas as variáveis do `.env.example`
4. Deploy automático em cada push para `main`

### AWS (EC2 + RDS)

**Vantagens:**
- Total controle
- Escalabilidade
- Mais barato em larga escala

**Setup:**

```bash
# 1. SSH na instância EC2
ssh -i key.pem ubuntu@your-instance-ip

# 2. Instalar Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clonar repositório
git clone seu-repo
cd seu-repo

# 4. Instalar dependências
npm install

# 5. Build
npm run build

# 6. Configurar PM2 para gerenciar processo
sudo npm install -g pm2
pm2 start "npm start"
pm2 startup
pm2 save

# 7. Nginx como reverse proxy
sudo apt-get install nginx
# Configurar /etc/nginx/sites-available/default para proxy_pass http://localhost:3000
```

### Railway ou Render

**Vantagens:**
- Deploy simples
- Banco de dados integrado
- Interface amigável

**Setup:**
- Conectar GitHub
- Configurar variáveis de ambiente
- Deploy automático

## Banco de Dados

### Supabase (PostgreSQL Gerenciado)

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

**Setup:**
1. Criar conta em supabase.com
2. Criar novo projeto
3. Copiar connection string
4. Executar migrações: `npm run prisma:migrate`

### Neon (PostgreSQL Serverless)

```env
DATABASE_URL="postgresql://user:password@host/database"
```

**Setup:**
1. Criar conta em neon.tech
2. Criar projeto
3. Copiar connection string
4. Executar migrações: `npm run prisma:migrate`

## Migrações

### Primeira vez:
```bash
npx prisma db push
# ou
npm run prisma:push
```

### Após alterações no schema:
```bash
npx prisma migrate dev --name your-migration-name
npm run prisma:migrate
```

### Em produção:
```bash
npx prisma migrate deploy
```

## Variáveis de Ambiente

### Todas as variáveis necessárias:

```env
# Banco de dados
DATABASE_URL="postgresql://user:password@host/db"

# NextAuth
NEXTAUTH_URL="https://seu-dominio.com"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_FREE_PRICE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."

# Opcional - Monitoramento
SENTRY_DSN="https://..."
```

## Deploy Checklist

- [ ] Variáveis de ambiente configuradas
- [ ] Database criado e migrações executadas
- [ ] Stripe testado em produção
- [ ] HTTPS/SSL habilitado
- [ ] Domain apontado para app
- [ ] Backups configurados
- [ ] Monitoring ativo
- [ ] Logs centralizados
- [ ] CDN configurado (opcional)
- [ ] Rate limiting ativo

## Monitoramento

### Sentry (Erro Tracking)

1. Criar conta em sentry.io
2. Criar projeto Next.js
3. Copiar DSN
4. Configurar variável: `SENTRY_DSN=...`
5. Erros automáticamente reportados

### Uptime Monitoring

Use pingdom.com, uptimerobot.com ou similar.

### Logs

Usar serviço como:
- Vercel Analytics (se usando Vercel)
- LogRocket
- Datadog
- CloudWatch (AWS)

## Scaling

### Banco de Dados
- Ativar connection pooling em produção
- Usar read replicas para queries pesadas
- Backup automático diário

### CDN
- Configurar Cloudflare ou similar
- Cache estático (imagens, CSS, JS)
- Edge caching

### Load Balancing
- Escalar horizontalmente com Docker
- Usar load balancer (AWS ALB, nginx)
- Session storage em Redis

## Rollback

### Se algo der errado:

**Vercel:**
```bash
# Revert to previous deployment
vercel rollback
```

**Manual:**
```bash
# Reverter para commit anterior
git revert HEAD
git push
# Re-deploy
```

## Performance

### Monitorar
- Vercel Analytics
- Lighthouse
- Web Vitals

### Otimizar
- Compression habilitada
- Image optimization
- Code splitting
- Lazy loading

## Backup

### Frequência
- Diário para databases
- Semanal para arquivos
- Mensal para compliance

### Armazenamento
- Mínimo 30 dias
- Armazenamento geográfico distribuído
- Testes de restore periódicos

## Disaster Recovery

### RTO (Recovery Time Objective)
- Alvo: < 4 horas

### RPO (Recovery Point Objective)
- Alvo: < 1 hora de dados perdidos

### Plano de Recuperação
1. Identificar problema
2. Restaurar de backup mais recente
3. Verificar integridade dos dados
4. Comunicar aos usuários
5. Monitorar sistema restaurado

## Suporte

Para dúvidas sobre deploy, consulte:
- Documentação do provedor
- Fórum da comunidade
- Suporte técnico (planos pagos)
