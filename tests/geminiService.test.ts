
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { suggestTitle, enhanceNote } from '../services/geminiService';

// Mock do SDK do Google GenAI
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: 'Título Sugerido pela IA'
        })
      }
    }))
  };
});

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve sugerir um título baseado no conteúdo', async () => {
    const title = await suggestTitle('Comprar pão e leite amanhã cedo');
    expect(title).toBe('Título Sugerido pela IA');
  });

  it('deve retornar "Nova Nota" se o conteúdo for vazio', async () => {
    const title = await suggestTitle('');
    expect(title).toBe('Nova Nota');
  });

  it('deve formatar e melhorar uma nota', async () => {
    const note = 'fazer compras lista pao leite';
    const enhanced = await enhanceNote(note);
    expect(enhanced).toBe('Título Sugerido pela IA');
  });
});
