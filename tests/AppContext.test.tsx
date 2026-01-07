
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { AppProvider, useApp } from '../context/AppContext';

// Componente auxiliar para testar o hook useApp
const TestComponent = ({ action }: { action: (api: any) => void }) => {
  const api = useApp();
  return <button onClick={() => action(api)}>Execute</button>;
};

describe('AppContext', () => {
  it('deve iniciar com grupos padrão no modo visitante', () => {
    let contextValue: any;
    render(
      <AppProvider>
        <TestComponent action={(api) => { contextValue = api; }} />
      </AppProvider>
    );

    // Simula clique para capturar o contexto
    const btn = document.querySelector('button');
    btn?.click();

    expect(contextValue.groups.length).toBeGreaterThan(0);
    expect(contextValue.user).toBeNull();
  });

  it('deve criar um novo grupo com sucesso', async () => {
    let createdId = '';
    render(
      <AppProvider>
        <TestComponent action={(api) => { 
          createdId = api.createGroup('Grupo de Teste', 'Nota inicial');
        }} />
      </AppProvider>
    );

    await act(async () => {
      document.querySelector('button')?.click();
    });

    expect(createdId).toBeDefined();
    expect(typeof createdId).toBe('string');
  });
});
