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

### Habilitar Autenticação:

1. No menu lateral, vá em **Build > Authentication**.
2. Clique em **Get Started**.
3. Na aba **Sign-in method**, clique em **"Add new provider"** e selecione **Google**.
4. Ative o seletor, escolha um e-mail de suporte e salve.

### Habilitar Firestore:

1. No menu lateral, vá em **Build > Firestore Database**.
2. Clique em **Create database**.
3. Escolha o local do servidor e inicie em **Modo de Teste** (para desenvolvimento) ou configure as regras de segurança.

---

## 2. Configuração da API do Gemini (IA)

O Gemini é usado para sugerir títulos e melhorar o texto das notas.

1. Acesse o [Google AI Studio](https://aistudio.google.com/).
2. Clique em **"Get API key"**.
3. Clique em **"Create API key in new project"**.
4. Copie a chave gerada. Ela deve ser atribuída à variável de ambiente `API_KEY`.

---

## 3. Configuração do Google Cloud (OAuth)

Para que o login do Google funcione corretamente em domínios específicos:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Selecione o projeto criado pelo Firebase.
3. Vá em **APIs e Serviços > Tela de permissão OAuth**.
4. Configure como "Externo", preencha os dados básicos e adicione o escopo `.../auth/userinfo.email` e `.../auth/userinfo.profile`.
5. Em **Credenciais**, verifique se o "ID do cliente OAuth 2.0" foi criado automaticamente pelo Firebase. Adicione `http://localhost:3000` (ou sua porta local) aos **Origens JavaScript autorizadas**.

---

## 4. Variáveis de Ambiente

O projeto espera as seguintes variáveis de ambiente. Você pode configurá-las no seu ambiente de hospedagem ou preencher diretamente nos arquivos (não recomendado para produção pública):

| Variável               | Arquivo de Origem   | Descrição                         |
| :--------------------- | :------------------ | :-------------------------------- |
| `API_KEY`              | `geminiService.ts`  | Chave da API do Google Gemini     |
| `FIREBASE_API_KEY`     | `firebaseConfig.ts` | apiKey do Firebase                |
| `FIREBASE_PROJECT_ID`  | `firebaseConfig.ts` | projectId do Firebase             |
| `FIREBASE_AUTH_DOMAIN` | `firebaseConfig.ts` | authDomain do Firebase            |
| ...                    | ...                 | Demais campos do `firebaseConfig` |

---

## 5. Como Executar o Projeto

Como o projeto utiliza ES Modules nativos no navegador com `importmap`, você precisa de um servidor estático simples.

### Usando VS Code:

1. Instale a extensão **Live Server**.
2. Clique com o botão direito no `index.html` e selecione **"Open with Live Server"**.

### Usando Terminal (Node.js):

```bash
# Instale um servidor estático
npm install -g serve

# Rode o servidor na pasta raiz
serve .
```

### Usando Python:

```bash
python -m http.server 8000
```

Acesse no navegador: `http://localhost:8000` (ou a porta indicada).

---

## 6. Regras do Firestore (Segurança)

Para proteger os dados dos usuários, use estas regras no console do Firebase:

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /groups/{groupId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    match /messages/{messageId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```
