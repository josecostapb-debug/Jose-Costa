
import React from 'react';
import { Student } from '../types';

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
  onViewSheet: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onBack, onViewSheet }) => {
  const handleOpenWhatsApp = () => {
    const cleanNumber = student.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanNumber}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <button onClick={onBack} className="flex items-center gap-3 text-slate-400 hover:text-cyan-600 font-bold transition-colors group">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-cyan-50">
            <i className="fas fa-arrow-left"></i>
          </div>
          Voltar
        </button>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleOpenWhatsApp}
            className="flex-1 md:flex-initial bg-[#25D366] text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <i className="fab fa-whatsapp text-lg"></i>
            WhatsApp
          </button>
          <button 
            onClick={onViewSheet}
            className="flex-1 md:flex-initial bg-cyan-600 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-700 transition-all shadow-lg"
          >
            Ver Ficha de Treino
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bio Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/50 flex flex-col items-center text-center">
          <img src={student.photo} className="w-40 h-40 rounded-[3rem] border-8 border-slate-50 shadow-2xl object-cover mb-6" alt={student.name} />
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{student.name}</h2>
          <p className="text-cyan-600 font-bold text-xs uppercase tracking-widest mb-6">{student.modality} • {student.level}</p>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Peso Atual</p>
              <p className="text-xl font-black text-slate-800">{student.weight || '--'} <span className="text-xs font-normal">kg</span></p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Altura</p>
              <p className="text-xl font-black text-slate-800">{student.height || '--'} <span className="text-xs font-normal">cm</span></p>
            </div>
          </div>
          
          <div className="w-full mt-6 pt-6 border-t border-slate-100 text-left space-y-4">
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">WhatsApp</p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                   <i className="fab fa-whatsapp text-green-500"></i>
                   {student.whatsapp}
                </div>
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gênero</p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                   <i className="fas fa-venus-mars text-indigo-500"></i>
                   {student.gender}
                </div>
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Aluno desde</p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                   <i className="fas fa-calendar-check text-cyan-600"></i>
                   {student.startDate}
                </div>
             </div>
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Goals */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <i className="fas fa-bullseye text-7xl text-indigo-600"></i>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
               <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
               Objetivos do Atleta
            </h3>
            <p className="text-slate-600 font-medium leading-relaxed italic">
              "{student.goal || 'Nenhum objetivo específico definido ainda.'}"
            </p>
          </div>

          {/* Medical & Restrictions */}
          <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 relative">
            <h3 className="text-xl font-black text-rose-900 mb-4 flex items-center gap-3">
               <i className="fas fa-briefcase-medical"></i>
               Restrições & Observações Médicas
            </h3>
            <div className="bg-white/60 p-5 rounded-2xl border border-rose-200/50">
               <p className="text-rose-800 text-sm font-bold leading-relaxed">
                 {student.medicalNotes || 'Sem restrições médicas registradas.'}
               </p>
            </div>
          </div>

          {/* Evolution Preview */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black">Evolução Técnica</h3>
               <span className="text-cyan-400 font-black text-[10px] uppercase tracking-widest">Upgrade em breve</span>
            </div>
            <div className="flex gap-4 items-end h-32">
               {[40, 65, 55, 80, 70, 95].map((h, i) => (
                 <div key={i} className="flex-1 bg-white/10 rounded-t-xl hover:bg-cyan-500 transition-all cursor-help relative group" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}%
                    </div>
                 </div>
               ))}
            </div>
            <p className="text-slate-400 text-xs mt-6 text-center italic">Gráfico representativo de volume e intensidade de nado (Metros/Mês).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
