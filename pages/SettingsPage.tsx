import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ChevronLeftIcon } from "../components/Icons";

const SettingsPage: React.FC = () => {
  const { user, signOut } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="pt-6 pb-24 px-4 min-h-screen bg-gray-50">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate("/")} className="mr-3 md:hidden">
          <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
      </div>

      {/* Informações do Usuário */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "Usuário"}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </span>
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.displayName || "Usuário"}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Nome</span>
              <span className="text-sm font-medium text-gray-900">
                {user?.displayName || "Não informado"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">E-mail</span>
              <span className="text-sm font-medium text-gray-900">
                {user?.email}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ID do Usuário</span>
              <span className="text-sm font-mono text-gray-900 truncate max-w-[200px]">
                {user?.uid}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Logout */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          Sair da Conta
        </button>
      </div>

      {/* Informações do App */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">NoteGroups AI v1.0.0</p>
        <p className="text-xs text-gray-400 mt-1">
          Desenvolvido com React + Firebase + Gemini AI
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
