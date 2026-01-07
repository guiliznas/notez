import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  FolderIcon,
  PlusIcon,
  ArchiveBoxIcon,
  RefreshIcon,
  ChevronLeftIcon,
  DocumentTextIcon,
} from "../components/Icons";
import SwipeableItem from "../components/SwipeableItem";
import SummaryModal from "../components/SummaryModal";
import DatePickerModal from "../components/DatePickerModal";
import { summarizeNotesByDate } from "../services/geminiService";

const GroupsPage: React.FC = () => {
  const { groups, createGroup, archiveGroup, messages } = useApp();
  const navigate = useNavigate();

  // Modal states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryDate, setSummaryDate] = useState("");

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - timestamp;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < oneDay && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diff < oneDay * 2) {
      return "Ontem";
    } else if (diff < oneDay * 7) {
      const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      return dias[date.getDay()];
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  const handleCreateGroup = () => {
    const id = createGroup("Novo Grupo");
    navigate(`/group/${id}`);
  };

  const handleDateSummary = async (selectedDate: string) => {
    setSummaryDate(selectedDate);
    setShowSummaryModal(true);
    setIsGeneratingSummary(true);
    setSummaryContent("");

    try {
      // Parse the selected date (DD/MM/YYYY format)
      const [day, month, year] = selectedDate.split("/");
      const targetDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );

      // Get all messages from that date
      const targetMessages = messages.filter((msg) => {
        const messageDate = new Date(msg.timestamp);
        return messageDate.toDateString() === targetDate.toDateString();
      });

      if (targetMessages.length === 0) {
        setSummaryContent(`Nenhuma nota encontrada para ${selectedDate}.`);
      } else {
        const notesTexts = targetMessages.map((m) => m.text);
        const summary = await summarizeNotesByDate(notesTexts, selectedDate);
        setSummaryContent(summary);
      }
    } catch (error) {
      console.error("Erro ao gerar resumo por data:", error);
      setSummaryContent("Erro ao gerar resumo. Tente novamente.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Filter out archived groups
  const activeGroups = groups.filter((g) => !g.isArchived);

  return (
    <div className="pt-6 pb-24 px-4 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Meus Grupos
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDatePicker(true)}
            className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            title="Resumir notas por data"
          >
            <DocumentTextIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            title="Atualizar grupos"
          >
            <RefreshIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleCreateGroup}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200 active:scale-90 transition-transform"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      {/* Link para grupos arquivados */}
      {groups.some((g) => g.isArchived) && (
        <div className="mt-6 mb-4">
          <button
            onClick={() => navigate("/archived")}
            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <ArchiveBoxIcon className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  Grupos Arquivados
                </p>
                <p className="text-xs text-gray-500">
                  {groups.filter((g) => g.isArchived).length}{" "}
                  {groups.filter((g) => g.isArchived).length === 1
                    ? "grupo"
                    : "grupos"}
                </p>
              </div>
            </div>
            <ChevronLeftIcon className="w-5 h-5 text-gray-400 rotate-180" />
          </button>
        </div>
      )}
      <div className="space-y-3">
        {activeGroups.map((group) => (
          <SwipeableItem
            key={group.id}
            onSwipeLeft={() => archiveGroup(group.id)}
            rightContent={
              <span className="text-white font-bold flex items-center gap-2 ml-auto">
                Arquivar <ArchiveBoxIcon className="w-5 h-5" />
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
                  <h3 className="font-bold text-gray-900 truncate pr-2 text-base leading-tight">
                    {group.title}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">
                    {formatTime(group.lastActive)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-0.5 font-medium">
                  {group.snippet || (
                    <span className="italic text-gray-300">
                      Sem notas ainda
                    </span>
                  )}
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
            <h2 className="text-lg font-bold text-gray-700">
              Tudo limpo por aqui!
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Toque no "+" para criar seu primeiro grupo de anotações
              inteligentes.
            </p>
          </div>
        )}
      </div>

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateSelect={handleDateSummary}
        title="Resumo por Data"
      />

      {/* Summary Modal */}
      <SummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        title={`Resumo do dia ${summaryDate}`}
        content={summaryContent}
        isLoading={isGeneratingSummary}
      />
    </div>
  );
};

export default GroupsPage;
