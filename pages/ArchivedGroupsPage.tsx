import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ChevronLeftIcon, FolderIcon } from "../components/Icons";

const ArchivedGroupsPage: React.FC = () => {
  const { groups } = useApp();
  const navigate = useNavigate();

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

  // Filter archived groups
  const archivedGroups = groups.filter((g) => g.isArchived);

  return (
    <div className="pt-6 pb-24 px-4 min-h-screen bg-gray-50">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate("/")} className="mr-3">
          <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Grupos Arquivados
        </h1>
      </div>

      {archivedGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FolderIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">
            Nenhum grupo arquivado
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Grupos arquivados aparecerão aqui
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {archivedGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => navigate(`/group/${group.id}`)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-98 transition-transform cursor-pointer hover:shadow-md"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FolderIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate text-[15px]">
                  {group.title}
                </h3>
                <p className="text-gray-500 text-xs truncate mt-0.5">
                  {group.snippet || "Sem mensagens"}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs text-gray-400 font-medium">
                  {formatTime(group.lastActive)}
                </span>
                <div className="text-xs text-orange-600 mt-1">Arquivado</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivedGroupsPage;
