
import React from 'react';
import { Student, WeeklySheet, Exercise } from '../types';

interface StudentDashboardProps {
  student: Student;
  library: Exercise[];
  activeTab: string;
  onUpdateSheet: (sheet: WeeklySheet) => void;
  chatMessages: any[];
  onSendMessage: (e: React.FormEvent) => void;
  chatInput: string;
  setChatInput: (val: string) => void;
  isTyping: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  student, 
  library,
  activeTab, 
  onUpdateSheet,
  chatMessages,
  onSendMessage,
  chatInput,
  setChatInput,
  isTyping,
  chatEndRef
}) => {
  const todayRaw = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()).toLowerCase() as keyof WeeklySheet;
  const todayWorkout = student.weeklySheet[todayRaw] || [];

  const toggleExercise = (index: number) => {
    const updated = { ...student.weeklySheet };
    const daySets = [...updated[todayRaw]];
    daySets[index] = { ...daySets[index], completed: !daySets[index].completed };
    updated[todayRaw] = daySets;
    onUpdateSheet(updated);
  };

  const getExercise = (id: string) => library.find(e => e.id === id);

  if (activeTab === 'my-workout') {
    return (
      <div className="space-y-8">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Treino de Hoje</h1>
               <p className="text-slate-900 mt-2 font-black text-2xl capitalize">{new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-md border-4 border-slate-900 flex items-center gap-4">
               <div className="w-12 h-12 bg-cyan-600 text-white rounded-full flex items-center justify-center shadow-lg"><i className="fas fa-medal text-xl"></i></div>
               <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Status do Dia</p>
                  <p className="text-lg font-black text-slate-900">{todayWorkout.filter(w => w.completed).length}/{todayWorkout.length} Exercícios</p>
               </div>
            </div>
         </div>

         {todayWorkout.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              {todayWorkout.map((w, i) => {
                const ex = getExercise(w.exerciseId);
                return (
                  <div key={i} className={`aqua-card p-6 flex items-center gap-6 border-4 transition-all bg-white ${w.completed ? 'border-emerald-500 bg-emerald-50' : 'border-slate-900'}`}>
                     <img src={ex?.imageUrl} className="w-20 h-20 object-contain" alt={ex?.name} />
                     <div className="flex-1">
                        <h3 className={`font-black text-2xl ${w.completed ? 'text-emerald-700' : 'text-slate-900'}`}>{ex?.name || 'Exercício'}</h3>
                        <p className={`text-sm font-black uppercase tracking-widest mt-1 ${w.completed ? 'text-emerald-600' : 'text-slate-900'}`}>{w.series} séries • {w.reps}</p>
                     </div>
                     <button onClick={() => toggleExercise(i)} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${w.completed ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-900 border-2 border-slate-900 hover:bg-slate-200'}`} aria-label="Marcar como concluído"><i className={`fas ${w.completed ? 'fa-check-double text-xl' : 'fa-check text-xl'}`}></i></button>
                  </div>
                );
              })}
           </div>
         ) : (
           <div className="bg-white p-20 rounded-[4rem] text-center border-4 border-dashed border-slate-900">
              <i className="fas fa-couch text-6xl text-slate-900 mb-6"></i>
              <h2 className="text-4xl font-black text-slate-900">Recuperação Necessária</h2>
              <p className="text-slate-900 mt-2 font-black text-2xl">Aproveite para descansar e hidratar!</p>
           </div>
         )}
      </div>
    );
  }

  if (activeTab === 'my-stats') {
    return (
      <div className="space-y-8">
         <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Minha Evolução</h1>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-slate-900 flex flex-col items-center text-center">
               <i className="fas fa-weight-scale text-4xl text-cyan-600 mb-4"></i>
               <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Peso em Tempo Real</p>
               <h2 className="text-5xl font-black text-slate-900 mt-2">{student.weight || '--'}kg</h2>
            </div>
            <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white md:col-span-2">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black">Performance Técnica</h3>
                  <span className="bg-emerald-500 text-white px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest">Em Alta</span>
               </div>
               <div className="flex gap-4 items-end h-40">
                  {[40, 60, 50, 80, 70, 95, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-cyan-600 rounded-t-2xl border-x border-slate-800" style={{ height: `${h}%` }}></div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    );
  }

  if (activeTab === 'feedback') {
    return (
      <div className="h-full flex flex-col">
         <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-slate-900 overflow-hidden flex flex-col h-[650px]">
            <div className="bg-slate-900 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><i className="fas fa-robot text-xl"></i></div>
                  <div><h2 className="text-white font-black text-xl">Consultoria IA</h2><p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">Assistente Especializado</p></div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-slate-50 no-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-[2.5rem] text-sm font-black leading-relaxed ${msg.role === 'user' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-900 shadow-md border-2 border-slate-200'}`}>{msg.text}</div>
                  </div>
                ))}
            </div>
            <form onSubmit={onSendMessage} className="p-6 bg-white border-t-4 border-slate-900 flex gap-4">
                <input type="text" placeholder="Como posso otimizar seu treino hoje?" className="flex-1 bg-slate-100 border-2 border-slate-200 px-6 py-4 rounded-2xl outline-none text-lg font-black text-slate-900 focus:border-cyan-600" value={chatInput} onChange={e => setChatInput(e.target.value)} />
                <button type="submit" className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-cyan-600 transition-colors shadow-xl"><i className="fas fa-paper-plane text-xl"></i></button>
            </form>
         </div>
      </div>
    );
  }

  return null;
};

export default StudentDashboard;
