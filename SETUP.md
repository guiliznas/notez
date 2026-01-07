# Guia de Configuração - NoteGroups AI

Este documento descreve os passos necessários para configurar as credenciais e o ambiente para rodar o aplicativo de anotações inteligentes.

---

## 1. Configuração do Firebase (Banco de Dados e Auth)

O aplicativo utiliza o Firebase para armazenar as notas e autenticar usuários com o Google.

### Passo a Passo:
1. Acesse o [Console do Firebase](https://console.firebase.google.com/).
2. Clique em **"Adicionar projeto"** e siga as instruções.
3. No painel do projeto, clique no ícone de engrenagem (Configurações do Projeto) > **Geral**.
4. Em "Seus aplicativos", clique no ícone web `</>` para registrar um novo app.
5. Copie o objeto `firebaseConfig`. Você precisará desses valores para o arquivo `services/firebaseConfig.ts`.

---

## 2. Configuração da API do Gemini (IA)

1. Acesse o [Google AI Studio](https://aistudio.google.com/).
2. Clique em **"Get API key"** e crie uma chave.
3. Esta chave será usada na variável `API_KEY`.

---

## 3. Implantação na Vercel (Recomendado)

A Vercel é a plataforma ideal para hospedar este projeto.

### Passos para Deploy:
1. Conecte seu repositório GitHub à [Vercel](https://vercel.com/).
2. No painel de importação, vá em **Environment Variables**.
3. Adicione todas as chaves abaixo (exatamente com estes nomes):
   - `API_KEY` (Sua chave do Gemini)
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
4. Clique em **Deploy**.

**Nota sobre Roteamento:** O arquivo `vercel.json` já está incluído no projeto para garantir que as rotas do React (como `/agenda` ou `/quick-note`) funcionem após o refresh da página.

---

## 4. Variáveis de Ambiente Locais

Para rodar localmente, você pode criar um arquivo `.env` (se estiver usando um bundler como Vite) ou definir no seu terminal:

| Variável | Descrição |
| :--- | :--- |
| `API_KEY` | Chave da API do Google Gemini |
| `FIREBASE_API_KEY` | apiKey do Firebase |
| `FIREBASE_PROJECT_ID` | projectId do Firebase |

---

## 5. Como Executar o Projeto Localmente

Como o projeto utiliza ES Modules nativos e `index.tsx`, recomendamos o uso de um servidor que suporte JSX/TSX ou converter os arquivos para JS.

### Usando VS Code:
1. Instale a extensão **Live Server**.
2. Abra o `index.html`.

---

## 6. Regras de Segurança do Firestore

Configure estas regras no console do Firebase para que apenas os donos das notas possam lê-las:

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /groups/{groupId} {
      allow read, write, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    match /messages/{messageId} {
      allow read, write, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```
