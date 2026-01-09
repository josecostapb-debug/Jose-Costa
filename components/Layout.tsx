
import React, { useState } from 'react';
import { AccountStatus } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'students' | 'exercises' | 'feedback' | 'subscription';
  setActiveTab: (tab: 'dashboard' | 'students' | 'exercises' | 'feedback' | 'subscription') => void;
  trainerName: string;
  onTrainerNameChange: (name: string) => void;
  trainerStatus: AccountStatus;
  onStatusChange: (status: AccountStatus) => void;
  onOpenShare?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  trainerName, 
  onTrainerNameChange,
  trainerStatus,
  onStatusChange,
  onOpenShare
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getStatusStyles = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.ACTIVE: return 'bg-emerald-500 text-white shadow-emerald-200';
      case AccountStatus.OVERDUE: return 'bg-amber-500 text-white shadow-amber-200';
      case AccountStatus.BLOCKED: return 'bg-rose-500 text-white shadow-rose-200';
      default: return 'bg-slate-400 text-white';
    }
  };

  const navItems = [
    { id: 'dashboard', icon: 'fa-house', label: 'Dashboard' },
    { id: 'students', icon: 'fa-user-group', label: 'Meus Alunos' },
    { id: 'exercises', icon: 'fa-person-swimming', label: 'Biblioteca' },
    { id: 'feedback', icon: 'fa-lightbulb', label: 'Sugestões' }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#009ACD]">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar - Desktop & Mobile Slide-over */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-[70] md:z-auto transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col w-72 aqua-gradient text-white p-8 shadow-2xl overflow-hidden
      `}>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <i className="fas fa-droplet text-cyan-300 text-2xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">AquaPro</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300 font-bold">Trainer Suite</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-white/50 hover:text-white"
            >
              <i className="fas fa-xmark text-2xl"></i>
            </button>
          </div>
          
          <nav className="space-y-3 flex-1">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-white text-slate-900 shadow-lg scale-105 font-bold' 
                    : 'hover:bg-white/10 text-slate-100'
                }`}
              >
                <i className={`fas ${item.icon} text-lg ${activeTab === item.id ? 'text-cyan-600' : 'text-cyan-300/60'}`}></i>
                {item.label}
              </button>
            ))}

            {/* Premium Button in Sidebar */}
            <button 
              onClick={() => {
                setActiveTab('subscription');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full mt-6 flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 border border-amber-400/30 group ${
                activeTab === 'subscription' 
                  ? 'bg-amber-400 text-slate-900 shadow-[0_0_20_rgba(251,191,36,0.4)]' 
                  : 'bg-white/5 hover:bg-amber-400/20 text-amber-400'
              }`}
            >
              <i className="fas fa-crown text-lg group-hover:animate-bounce"></i>
              <span className="font-black text-xs uppercase tracking-widest">Assinar Premium</span>
            </button>
          </nav>

          <div className="mt-auto relative z-10 pt-8 border-t border-white/10 opacity-50 text-center">
             <p className="text-[10px] uppercase tracking-widest italic">{trainerName}</p>
             <p className="text-[10px] mt-1">© 2025 AquaPro Premium</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 glass rounded-3xl shadow-2xl z-50 px-8 py-4 flex justify-between items-center border border-white/50">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as any)} 
            className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-cyan-600' : 'text-slate-400'}`}
          >
            <i className={`fas ${item.icon} text-xl`}></i>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 pb-32 md:pb-8 h-screen overflow-y-auto no-scrollbar">
        <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl px-8 py-4 flex justify-between items-center border-b border-cyan-100/50">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
             >
               <i className="fas fa-bars text-xl"></i>
             </button>
             
             <div className="flex items-center gap-2">
               <i className="fas fa-droplet text-cyan-600 text-2xl md:hidden"></i>
               <span className="text-xl font-black text-slate-800 tracking-tighter md:hidden">AquaPro</span>
             </div>
             <span className="hidden md:block text-xs font-bold text-slate-500 uppercase tracking-widest">Painel de Gestão</span>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={onOpenShare}
              className="w-10 h-10 bg-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-200 flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
              title="Publicar App / Gerar Link"
            >
              <i className="fas fa-share-nodes"></i>
            </button>

            <div className="flex items-center gap-4 md:gap-8 border-l border-slate-200 pl-4 md:pl-6">
              <div className="flex items-center">
                 <button 
                    onClick={() => {
                      if (trainerStatus === AccountStatus.ACTIVE) onStatusChange(AccountStatus.OVERDUE);
                      else if (trainerStatus === AccountStatus.OVERDUE) onStatusChange(AccountStatus.BLOCKED);
                      else onStatusChange(AccountStatus.ACTIVE);
                    }}
                    className={`${getStatusStyles(trainerStatus)} px-3 md:px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center gap-2`}
                  >
                    <i className={`fas ${trainerStatus === AccountStatus.ACTIVE ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                    <span className="hidden sm:inline">{trainerStatus}</span>
                  </button>
              </div>

              <div className="text-right hidden sm:block">
                {isEditingName ? (
                  <input 
                    autoFocus
                    className="text-sm font-black text-slate-900 bg-white border border-cyan-200 px-2 rounded outline-none w-32"
                    value={trainerName}
                    onChange={(e) => onTrainerNameChange(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  />
                ) : (
                  <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                    <p className="text-sm font-black text-slate-900 leading-none">{trainerName}</p>
                    <i className="fas fa-pen text-[10px] text-slate-300 group-hover:text-cyan-500"></i>
                  </div>
                )}
                <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-tighter">Personal Trainer</p>
              </div>
              <div className="relative group cursor-pointer">
                <img src="https://picsum.photos/seed/coach/100" className="w-10 h-10 rounded-xl border-2 border-white shadow-md object-cover" alt="User Profile" />
                <div className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white ${trainerStatus === AccountStatus.ACTIVE ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="px-6 md:px-8 max-w-7xl mx-auto py-6">
          {trainerStatus === AccountStatus.BLOCKED ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-24 h-24 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-4xl shadow-inner">
                <i className="fas fa-lock"></i>
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">Acesso Bloqueado</h2>
                <p className="text-slate-500 max-w-md mx-auto mt-2">Sua assinatura expirou. Regularize sua mensalidade para continuar utilizando as ferramentas do AquaPro.</p>
              </div>
              <button 
                onClick={() => setActiveTab('subscription')}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
              >
                Assinar Premium
              </button>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
