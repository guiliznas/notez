
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FolderIcon, PlusIcon, CalendarIcon, SettingsIcon } from './Icons';

const BottomNav = () => {
    const location = useLocation();
    const path = location.pathname;

    const isActive = (route: string) => {
        return path === route || (route === '/' && path === '/') || (route === '/' && path.startsWith('/group/'));
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50 max-w-md mx-auto pb-safe">
            <Link to="/" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/') ? 'text-blue-600' : 'text-gray-500'}`}>
                <FolderIcon className="w-6 h-6" />
                <span className="text-[10px] mt-1 font-medium">Grupos</span>
            </Link>
            <Link to="/quick-note" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/quick-note') ? 'text-blue-600' : 'text-gray-500'}`}>
                <div className={`p-1.5 rounded-full ${isActive('/quick-note') ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <PlusIcon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-1 font-medium">Novo</span>
            </Link>
            <Link to="/agenda" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/agenda') ? 'text-blue-600' : 'text-gray-500'}`}>
                <CalendarIcon className="w-6 h-6" />
                <span className="text-[10px] mt-1 font-medium">Agenda</span>
            </Link>
            <Link to="/settings" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/settings') ? 'text-blue-600' : 'text-gray-500'}`}>
                <SettingsIcon className="w-6 h-6" />
                <span className="text-[10px] mt-1 font-medium">Ajustes</span>
            </Link>
        </div>
    );
};

export default BottomNav;
