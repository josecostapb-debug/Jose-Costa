
import React, { useState } from 'react';
import { AccountStatus, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  trainerName: string;
  onTrainerNameChange: (name: string) => void;
  trainerStatus: AccountStatus;
  onStatusChange: (status: AccountStatus) => void;
  onOpenShare?: () => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  userRole,
  activeTab, 
  setActiveTab, 
  trainerName, 
  trainerStatus,
  onOpenShare,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getStatusStyles = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.ACTIVE: return 'bg-emerald-500 text-white shadow-emerald-200';
      case AccountStatus.OVERDUE: return 'bg-amber-500 text-white shadow-amber-200';
      case AccountStatus.BLOCKED: return 'bg-rose-500 text-white shadow-rose-200';
      default: return 'bg-slate-400 text-white';
    }
  };

  const trainerNav = [
    { id: 'dashboard', icon: 'fa-house', label: 'Dashboard' },
    { id: 'students', icon: 'fa-user-group', label: 'Meus Alunos' },
    { id: 'exercises', icon: 'fa-person-swimming', label: 'Biblioteca' },
    { id: 'feedback', icon: 'fa-lightbulb', label: 'Sugestões' }
  ];

  const independentNav = [
    { id: 'my-workout', icon: 'fa-house', label: 'Home' },
    { id: 'planner', icon: 'fa-calendar-plus', label: 'Planejador' },
    { id: 'my-stats', icon: 'fa-chart-line', label: 'Evolução' },
    { id: 'feedback', icon: 'fa-robot', label: 'Coach IA' }
  ];

  const studentNav = [
    { id: 'my-workout', icon: 'fa-person-swimming', label: 'Meu Treino' },
    { id: 'my-stats', icon: 'fa-chart-line', label: 'Evolução' },
    { id: 'feedback', icon: 'fa-message', label: 'Falar com Coach' }
  ];

  const navItems = userRole === 'trainer' ? trainerNav : (userRole === 'independent' ? independentNav : studentNav);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#009ACD]">
      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-[70] md:z-auto transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col w-72 aqua-gradient text-white p-8 shadow-2xl overflow-hidden
      `}>
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <i className={`fas ${userRole === 'trainer' ? 'fa-user-tie' : (userRole === 'independent' ? 'fa-bolt' : 'fa-user-graduate')} text-cyan-300 text-2xl`}></i>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">PersonalPro</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white font-black">
                  {userRole === 'trainer' ? 'Elite Trainer' : (userRole === 'independent' ? 'Praticante Livre' : 'Elite Student')}
                </p>
              </div>
            </div>
          </div>
          
          <nav className="space-y-3 flex-1">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-white text-slate-900 shadow-lg scale-105 font-bold' 
                    : 'hover:bg-white/10 text-slate-100 font-bold'
                }`}
              >
                <i className={`fas ${item.icon} text-lg ${activeTab === item.id ? 'text-cyan-600' : 'text-cyan-300'}`}></i>
                {item.label}
              </button>
            ))}

            <button 
              onClick={() => {
                setActiveTab('subscription');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full mt-6 flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 border border-amber-400 group ${
                activeTab === 'subscription' 
                  ? 'bg-amber-400 text-slate-900 font-black' 
                  : 'bg-white/10 text-amber-400 font-black'
              }`}
            >
              <i className="fas fa-crown text-lg"></i>
              <span className="text-xs uppercase tracking-widest">Assinar Premium</span>
            </button>
          </nav>

          <button 
            onClick={onLogout}
            className="mt-6 flex items-center gap-3 text-white hover:text-cyan-300 transition-colors p-4 rounded-2xl hover:bg-white/5 font-black"
          >
            <i className="fas fa-right-from-bracket"></i>
            <span className="text-xs uppercase tracking-widest">Sair do App</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-32 md:pb-8 h-screen overflow-y-auto no-scrollbar">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl px-8 py-4 flex justify-between items-center border-b border-cyan-200">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden w-10 h-10 flex items-center justify-center text-slate-600">
               <i className="fas fa-bars text-xl"></i>
             </button>
             <span className="hidden md:block text-xs font-black text-slate-800 uppercase tracking-widest">
               {userRole === 'trainer' ? 'Painel do Personal' : (userRole === 'independent' ? 'Espaço de Autogestão' : 'Espaço do Aluno')}
             </span>
          </div>

          <div className="flex items-center gap-4">
            {userRole === 'trainer' && (
              <button onClick={onOpenShare} className="w-10 h-10 bg-cyan-600 text-white rounded-xl shadow-lg flex items-center justify-center">
                <i className="fas fa-share-nodes"></i>
              </button>
            )}

            <div className="flex items-center gap-4 border-l border-slate-300 pl-4">
              <div className={`${getStatusStyles(trainerStatus)} px-3 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2`}>
                <i className={`fas ${trainerStatus === AccountStatus.ACTIVE ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                <span className="hidden sm:inline">{trainerStatus}</span>
              </div>
              <p className="text-sm font-black text-slate-900 leading-none hidden sm:block">{trainerName}</p>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${trainerName}`} className="w-10 h-10 rounded-xl border-2 border-white shadow-md object-cover bg-slate-100" />
            </div>
          </div>
        </header>
        
        <div className="px-6 md:px-8 max-w-7xl mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
