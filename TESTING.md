
# Testes Unitários - NoteGroups AI

Utilizamos **Vitest** e **React Testing Library** para garantir a qualidade do código.

## 1. Instalação das dependências de teste

No seu ambiente local, instale os pacotes necessários:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

## 2. Configuração (vitest.config.ts)

Crie um arquivo na raiz do projeto chamado `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
  },
});
```

## 3. Como rodar os testes

Execute o comando abaixo no terminal:

```bash
# Rodar uma vez
npx vitest run

# Modo observação (watch mode)
npx vitest
```

## 4. O que está sendo testado?

- **Serviços de IA**: Mocks para garantir que a lógica de processamento de texto funciona sem depender de rede.
- **Gerenciamento de Estado**: Criação, edição e arquivamento de notas no Firestore/LocalState.
- **Componentes de UI**: Renderização correta de listas e estados vazios.
