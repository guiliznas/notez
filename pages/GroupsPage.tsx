
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FolderIcon, PlusIcon, ArchiveBoxIcon } from '../components/Icons';
import SwipeableItem from '../components/SwipeableItem';

const GroupsPage: React.FC = () => {
    const { groups, createGroup, archiveGroup } = useApp();
    const navigate = useNavigate();

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - timestamp;
        const oneDay = 24 * 60 * 60 * 1000;

        if (diff < oneDay && date.getDate() === now.getDate()) {
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (diff < oneDay * 2) {
            return 'Ontem';
        } else if (diff < oneDay * 7) {
            const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            return dias[date.getDay()];
        } else {
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        }
    };

    const handleCreateGroup = () => {
        const id = createGroup('Novo Grupo');
        navigate(`/group/${id}`);
    };

    // Filter out archived groups
    const activeGroups = groups.filter(g => !g.isArchived);

    return (
        <div className="pt-6 pb-24 px-4 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Meus Grupos</h1>
                <button 
                    onClick={handleCreateGroup}
                    className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200 active:scale-90 transition-transform"
                >
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="space-y-3">
                {activeGroups.map(group => (
                    <SwipeableItem
                        key={group.id}
                        onSwipeLeft={() => archiveGroup(group.id)}
                        rightContent={
                            <span className="text-white font-bold flex items-center gap-2 ml-auto">
                                Arquivar <ArchiveBoxIcon className="w-5 h-5"/>
                            </span>
                        }
                        rightColor="bg-orange-500"
                    >
                        <div 
                            onClick={() => navigate(`/group/${group.id}`)}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 active:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600">
                                <FolderIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-gray-900 truncate pr-2 text-base leading-tight">{group.title}</h3>
                                    <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">
                                        {formatTime(group.lastActive)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 truncate mt-0.5 font-medium">
                                    {group.snippet || <span className="italic text-gray-300">Sem notas ainda</span>}
                                </p>
                            </div>
                        </div>
                    </SwipeableItem>
                ))}
                
                {activeGroups.length === 0 && (
                    <div className="text-center py-20 px-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FolderIcon className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-700">Tudo limpo por aqui!</h2>
                        <p className="text-sm text-gray-400 mt-1">Toque no "+" para criar seu primeiro grupo de anotações inteligentes.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupsPage;
