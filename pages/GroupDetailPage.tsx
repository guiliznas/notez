
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChevronLeftIcon, SendIcon, ImageIcon, TrashIcon, PencilIcon, CheckIcon, XMarkIcon, SparklesIcon } from '../components/Icons';
import { Message } from '../types';
import SwipeableItem from '../components/SwipeableItem';
import { enhanceNote } from '../services/geminiService';

// Edit Form Component
interface EditItemProps {
    initialText: string;
    onSave: (text: string) => void;
    onCancel: () => void;
}

const EditItem: React.FC<EditItemProps> = ({ initialText, onSave, onCancel }) => {
    const [text, setText] = useState(initialText);
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleEnhance = async () => {
        if (!text.trim()) return;
        setIsEnhancing(true);
        try {
            const enhanced = await enhanceNote(text);
            setText(enhanced);
        } finally {
            setIsEnhancing(false);
        }
    };

    return (
        <div className="bg-white p-3 rounded-xl shadow-md border border-blue-200 mb-3 animate-fade-in">
            <textarea 
                className="w-full min-h-[80px] p-2 border border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-blue-100 outline-none resize-none mb-2"
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
            />
            <div className="flex justify-between items-center">
                <button 
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
                >
                    <SparklesIcon className="w-3 h-3" />
                    {isEnhancing ? 'Melhorando...' : 'IA: Melhorar'}
                </button>
                <div className="flex gap-2">
                    <button onClick={onCancel} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => onSave(text)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full font-medium">
                        <CheckIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

const GroupDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getMessagesByGroupId, addMessage, updateMessage, deleteMessage, updateGroupTitle, groups } = useApp();
    const [inputText, setInputText] = useState('');
    const [isEnhancingInput, setIsEnhancingInput] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // Edit states
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleInput, setTitleInput] = useState('');

    const group = groups.find(g => g.id === id);
    const messages = id ? getMessagesByGroupId(id) : [];

    useEffect(() => {
        if (group) setTitleInput(group.title);
    }, [group]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!editingId) {
             scrollToBottom();
        }
    }, [messages, editingId]);

    const handleSend = () => {
        if (inputText.trim() && id) {
            addMessage(id, inputText);
            setInputText('');
        }
    };

    const handleEnhanceInput = async () => {
        if (!inputText.trim()) return;
        setIsEnhancingInput(true);
        try {
            const enhanced = await enhanceNote(inputText);
            setInputText(enhanced);
        } finally {
            setIsEnhancingInput(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleEdit = (msg: Message) => {
        setEditingId(msg.id);
    };

    const handleDelete = (msg: Message) => {
        if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
            deleteMessage(msg.id);
        }
    };

    const handleSaveEdit = (newText: string) => {
        if (editingId && newText.trim()) {
            updateMessage(editingId, newText);
            setEditingId(null);
        } else if (editingId) {
            if (!newText.trim()) setEditingId(null);
        }
    };

    const handleSaveTitle = () => {
        if (titleInput.trim() && id) {
            updateGroupTitle(id, titleInput.trim());
        }
        setIsEditingTitle(false);
    };

    if (!group) return <div className="p-4">Grupo não encontrado</div>;

    return (
        <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto relative">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center sticky top-0 z-30 shadow-sm h-16">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 -ml-2 rounded-full hover:bg-gray-100 flex-shrink-0">
                    <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
                
                <div className="flex-1 min-w-0">
                    {isEditingTitle ? (
                        <input
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            onBlur={handleSaveTitle}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                            autoFocus
                            className="w-full font-bold text-lg text-gray-900 border-b border-blue-500 outline-none bg-transparent"
                        />
                    ) : (
                        <h1 
                            onClick={() => setIsEditingTitle(true)}
                            className="font-bold text-lg text-gray-900 truncate cursor-text hover:bg-gray-50 rounded px-1 -ml-1 transition-colors"
                            title="Clique para editar"
                        >
                            {group.title}
                        </h1>
                    )}
                </div>
                
                {!isEditingTitle && (
                    <button onClick={() => setIsEditingTitle(true)} className="ml-2 text-gray-400 hover:text-blue-600">
                        <PencilIcon className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 pb-48">
                {messages.map((msg) => {
                    if (msg.isSystem) {
                         return (
                            <div key={msg.id} className="w-full text-center py-2 opacity-50 mb-3">
                                <span className="text-gray-500 text-xs">{msg.text}</span>
                            </div>
                        );
                    }

                    if (editingId === msg.id) {
                        return (
                            <EditItem 
                                key={msg.id}
                                initialText={msg.text}
                                onSave={handleSaveEdit}
                                onCancel={() => setEditingId(null)}
                            />
                        );
                    }

                    return (
                        <SwipeableItem 
                            key={msg.id} 
                            onSwipeRight={() => handleEdit(msg)}
                            onSwipeLeft={() => handleDelete(msg)}
                            leftContent={<span className="text-white font-bold flex items-center gap-2"><PencilIcon className="w-5 h-5"/> Editar</span>}
                            rightContent={<span className="text-white font-bold flex items-center gap-2 ml-auto">Excluir <TrashIcon className="w-5 h-5"/></span>}
                            leftColor="bg-blue-500"
                            rightColor="bg-red-500"
                        >
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-gray-800 text-base leading-relaxed whitespace-pre-wrap group relative">
                                {msg.text}
                                <div className="mt-2 flex justify-between items-end">
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <button 
                                            type="button"
                                            onClick={async (e) => { 
                                                e.stopPropagation(); 
                                                const enhanced = await enhanceNote(msg.text);
                                                if (enhanced !== msg.text) updateMessage(msg.id, enhanced);
                                            }} 
                                            className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                            title="Melhorar com IA"
                                        >
                                            <SparklesIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleEdit(msg); }} 
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                            title="Editar"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(msg); }} 
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            title="Excluir"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SwipeableItem>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed above BottomNav */}
            <div className="fixed bottom-16 left-0 right-0 bg-gray-50 p-4 max-w-md mx-auto z-20">
                <div className="bg-white border border-gray-200 rounded-2xl flex flex-col shadow-sm">
                    <div className="flex items-center px-4 py-2">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escreva uma nota..."
                            rows={1}
                            className="bg-transparent flex-1 outline-none text-sm text-gray-800 resize-none max-h-32 py-2"
                            style={{ minHeight: '24px' }}
                        />
                        <button className="text-gray-400 hover:text-gray-600 ml-2">
                            <ImageIcon className="w-5 h-5" />
                        </button>
                        {inputText.trim().length > 0 && (
                            <button onClick={handleSend} className="text-blue-600 hover:text-blue-700 ml-3">
                                <SendIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    {inputText.trim().length > 5 && (
                        <div className="px-4 pb-2 flex justify-start">
                            <button 
                                onClick={handleEnhanceInput}
                                disabled={isEnhancingInput}
                                className="text-[10px] flex items-center gap-1 text-blue-500 font-bold hover:bg-blue-50 px-2 py-0.5 rounded transition-colors disabled:opacity-50"
                            >
                                <SparklesIcon className="w-3 h-3" />
                                {isEnhancingInput ? 'Melhorando...' : 'IA: Melhorar Texto'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupDetailPage;
