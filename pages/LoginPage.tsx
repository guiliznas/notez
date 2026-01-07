import React from 'react';
import { useApp } from '../context/AppContext';
import { GoogleIcon } from '../components/Icons';

const LoginPage: React.FC = () => {
    const { signIn } = useApp();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.862 4.487" />
                    </svg>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo ao NoteGroups</h1>
                <p className="text-gray-500 mb-8">Organize suas ideias, notas e eventos em um só lugar.</p>

                <button 
                    onClick={signIn}
                    className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                    <GoogleIcon className="w-5 h-5" />
                    <span>Entrar com Google</span>
                </button>
                
                <p className="mt-8 text-xs text-gray-400">
                    Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;