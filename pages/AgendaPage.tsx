import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChevronLeftIcon, PlusIcon, CalendarIcon } from '../components/Icons';
import { CalendarEvent } from '../types';

const AgendaPage: React.FC = () => {
    const { events, createGroup } = useApp();
    const navigate = useNavigate();

    const handleCreateGroupFromEvent = (eventTitle: string) => {
        const id = createGroup(eventTitle, `Grupo criado a partir do evento: ${eventTitle}`);
        navigate(`/group/${id}`);
    };

    // Group events by dateLabel
    const groupedEvents = events.reduce((acc, event) => {
        if (!acc[event.dateLabel]) {
            acc[event.dateLabel] = [];
        }
        acc[event.dateLabel].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>);

    return (
        <div className="pt-6 pb-24 px-4 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate('/')} className="mr-3 md:hidden">
                        <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
                </div>
            </div>

            <div className="space-y-6">
                {Object.entries(groupedEvents).map(([label, dayEvents]) => (
                    <div key={label}>
                        <h2 className="text-lg font-bold text-gray-900 mb-3">{label}</h2>
                        <div className="space-y-3">
                            {(dayEvents as CalendarEvent[]).map(event => (
                                <div key={event.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-600 font-medium text-xs flex-col">
                                       <CalendarIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{event.startTime} - {event.endTime}</p>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCreateGroupFromEvent(event.title);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                        title="Criar grupo para este evento"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

             <div className="fixed bottom-20 right-4 md:hidden">
                 {/* Floating Action Button for mobile only as per screenshot */}
                <button 
                    onClick={() => navigate('/quick-note')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl shadow-lg flex items-center font-medium"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Novo grupo
                </button>
            </div>
        </div>
    );
};

export default AgendaPage;