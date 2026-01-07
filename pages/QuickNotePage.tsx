
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChevronLeftIcon, CheckIcon, SparklesIcon } from '../components/Icons';
import { suggestTitle } from '../services/geminiService';

const QuickNotePage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [isSuggesting, setIsSuggesting] = useState(false);
    const { createGroup } = useApp();
    const navigate = useNavigate();
    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        titleRef.current?.focus();
    }, []);

    const handleSave = () => {
        if (!title.trim() || !note.trim()) return;
        
        const newId = createGroup(title.trim(), note.trim());
        navigate(`/group/${newId}`, { replace: true });
    };

    const handleSuggestTitle = async () => {
        if (!note.trim()) return;
        setIsSuggesting(true);
        try {
            const suggested = await suggestTitle(note);
            setTitle(suggested);
        } finally {
            setIsSuggesting(false);
        }
    };

    const isReady = title.trim().length > 0 && note.trim().length > 0;

    return (
        <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto relative">
            {/* Header */}
            <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="font-bold text-lg text-gray-900">Novo Grupo</h1>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={!isReady}
                    className={`p-2 rounded-full transition-colors ${isReady ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300 cursor-not-allowed'}`}
                >
                    <CheckIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-32">
                <div className="space-y-2 relative">
                    <div className="flex justify-between items-end">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                            Título do Grupo
                        </label>
                        {note.trim().length > 10 && (
                            <button 
                                onClick={handleSuggestTitle}
                                disabled={isSuggesting}
                                className="text-[10px] flex items-center gap-1 text-blue-600 font-bold hover:underline disabled:opacity-50"
                            >
                                <SparklesIcon className="w-3 h-3" />
                                {isSuggesting ? 'Sugerindo...' : 'Sugerir com IA'}
                            </button>
                        )}
                    </div>
                    <input
                        ref={titleRef}
                        type="text"
                        placeholder="Ex: Viagem para Paris"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-gray-200 focus:border-blue-500 py-2 text-xl font-semibold text-gray-800 outline-none transition-colors placeholder:text-gray-300"
                    />
                </div>

                <div className="space-y-2 flex-1 flex flex-col">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                        Primeira Anotação
                    </label>
                    <textarea
                        className="w-full flex-1 min-h-[300px] bg-white rounded-2xl p-4 text-gray-800 text-base outline-none resize-none shadow-sm border border-gray-100 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                        placeholder="Escreva os detalhes aqui..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="absolute bottom-6 left-0 right-0 px-6 z-20">
                <button
                    onClick={handleSave}
                    disabled={!isReady}
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
                        isReady 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    }`}
                >
                    Criar Grupo e Salvar
                </button>
            </div>
        </div>
    );
};

export default QuickNotePage;
