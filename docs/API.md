# API Documentation

## Base URL

```
https://api.example.com/api
```

## Authentication

Todos os endpoints requerem autenticação via JWT (enviado via cookie de sessão NextAuth).

## Endpoints

### Autenticação

#### Login
```
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123"
}

Response: 200 OK
{
  "user": { ... },
  "session": { ... }
}
```

#### Registro
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "senha123"
}

Response: 201 Created
{
  "user": { ... }
}
```

#### Logout
```
POST /auth/signout

Response: 200 OK
```

### Usuários

#### Get Profile (Autenticado)
```
GET /users/me

Response: 200 OK
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "image": "https://...",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Update Profile (Autenticado)
```
PUT /users/me
Content-Type: application/json

{
  "name": "John Updated",
  "image": "https://new-image.com/photo.jpg"
}

Response: 200 OK
{
  "id": "uuid",
  "name": "John Updated",
  ...
}
```

### Workspaces

#### List Workspaces (Autenticado)
```
GET /workspaces

Response: 200 OK
[
  {
    "id": "uuid",
    "name": "My Workspace",
    "slug": "my-workspace",
    "description": "Description",
    "createdAt": "2024-01-01T00:00:00Z",
    "memberCount": 5
  }
]
```

#### Create Workspace (Autenticado)
```
POST /workspaces
Content-Type: application/json

{
  "name": "New Workspace",
  "slug": "new-workspace",
  "description": "Optional description"
}

Response: 201 Created
{
  "id": "uuid",
  "name": "New Workspace",
  ...
}
```

#### Get Workspace (Autenticado)
```
GET /workspaces/{id}

Response: 200 OK
{
  "id": "uuid",
  "name": "Workspace Name",
  "slug": "workspace-slug",
  "description": "Description",
  "createdAt": "2024-01-01T00:00:00Z",
  "members": [
    {
      "id": "uuid",
      "name": "Member Name",
      "email": "member@example.com",
      "role": "admin"
    }
  ]
}
```

#### Update Workspace (Autenticado, Admin)
```
PUT /workspaces/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}

Response: 200 OK
{
  "id": "uuid",
  ...
}
```

#### Delete Workspace (Autenticado, Admin)
```
DELETE /workspaces/{id}

Response: 200 OK
{
  "success": true
}
```

### Workspace Members

#### List Members (Autenticado)
```
GET /workspaces/{id}/members

Response: 200 OK
[
  {
    "id": "uuid",
    "userId": "uuid",
    "workspaceId": "uuid",
    "role": "admin",
    "user": {
      "name": "Member Name",
      "email": "member@example.com"
    }
  }
]
```

#### Add Member (Autenticado, Admin)
```
POST /workspaces/{id}/members
Content-Type: application/json

{
  "email": "newmember@example.com",
  "role": "member"
}

Response: 201 Created
{
  "id": "uuid",
  "userId": "uuid",
  "role": "member"
}
```

#### Update Member Role (Autenticado, Admin)
```
PUT /workspaces/{id}/members/{memberId}
Content-Type: application/json

{
  "role": "admin"
}

Response: 200 OK
{
  "id": "uuid",
  "role": "admin"
}
```

#### Remove Member (Autenticado, Admin)
```
DELETE /workspaces/{id}/members/{memberId}

Response: 200 OK
{
  "success": true
}
```

### Billing

#### Get Plans
```
GET /billing/plans

Response: 200 OK
[
  {
    "id": "free",
    "name": "Free",
    "price": 0,
    "maxMembers": 3,
    "maxWorkspaces": 1,
    "features": [...]
  },
  {
    "id": "pro",
    "name": "Pro",
    "price": 29,
    "maxMembers": 50,
    "maxWorkspaces": 10,
    "features": [...]
  }
]
```

#### Get Subscription (Autenticado)
```
GET /workspaces/{id}/subscription

Response: 200 OK
{
  "id": "uuid",
  "workspaceId": "uuid",
  "planId": "pro",
  "status": "active",
  "stripeCustomerId": "cus_xxx",
  "currentPeriodStart": "2024-01-01T00:00:00Z",
  "currentPeriodEnd": "2024-02-01T00:00:00Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "INVALID_REQUEST",
  "message": "Descrição do erro",
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "error": "UNAUTHORIZED",
  "message": "Não autenticado",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "error": "FORBIDDEN",
  "message": "Sem permissão para acessar este recurso",
  "statusCode": 403
}
```

### 404 Not Found
```json
{
  "error": "NOT_FOUND",
  "message": "Recurso não encontrado",
  "statusCode": 404
}
```

### 500 Server Error
```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Erro interno do servidor",
  "statusCode": 500
}
```

## Rate Limiting

- Free: 100 requests/hour
- Pro: 1000 requests/hour
- Enterprise: Unlimited

## Versionamento

API versão: v1
A versão atual é suportada indefinidamente.

## Webhooks

Para integração com Stripe, implementamos webhooks em:
- POST /api/billing/webhook
