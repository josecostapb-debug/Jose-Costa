
import React, { useState } from 'react';
import { Student, Exercise, WeeklySheet, WorkoutSet, Modality } from '../types';
import { EXERCISES_LIBRARY } from '../constants';

interface StudentDetailsProps {
  student: Student;
  onBack: () => void;
  onViewProfile: () => void;
  onUpdateWorkout: (studentId: string, newSheet: WeeklySheet) => void;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ student, onBack, onViewProfile, onUpdateWorkout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDay, setSelectedDay] = useState<keyof WeeklySheet | null>(null);
  
  // State for new workout set
  const [newSet, setNewSet] = useState<WorkoutSet>({
    exerciseId: '',
    series: 3,
    reps: '10 reps',
    rest: '45s'
  });

  const days = [
    { key: 'monday', label: 'Segunda', sub: 'SEG' },
    { key: 'tuesday', label: 'Terça', sub: 'TER' },
    { key: 'wednesday', label: 'Quarta', sub: 'QUA' },
    { key: 'thursday', label: 'Quinta', sub: 'QUI' },
    { key: 'friday', label: 'Sexta', sub: 'SEX' },
    { key: 'saturday', label: 'Sábado', sub: 'SAB' },
    { key: 'sunday', label: 'Domingo', sub: 'DOM' }
  ];

  const getExerciseName = (id: string) => {
    return EXERCISES_LIBRARY.find(e => e.id === id)?.name || 'Exercício não encontrado';
  };

  const getModalityIcon = (modality: Modality) => {
    switch (modality) {
      case Modality.SWIMMING: return 'fa-person-swimming text-cyan-500';
      case Modality.WATER_AEROBICS: return 'fa-water text-teal-500';
      case Modality.WEIGHTLIFTING: return 'fa-dumbbell text-slate-700';
      case Modality.PILATES: return 'fa-spa text-emerald-500';
      default: return 'fa-swimmer text-cyan-500';
    }
  };

  const handleAddExercise = (day: keyof WeeklySheet) => {
    if (!newSet.exerciseId) return;
    
    const updatedSheet = { ...student.weeklySheet };
    updatedSheet[day] = [...updatedSheet[day], { ...newSet }];
    onUpdateWorkout(student.id, updatedSheet);
    
    // Reset form
    setNewSet({ exerciseId: '', series: 3, reps: '10 reps', rest: '45s' });
  };

  const handleRemoveExercise = (day: keyof WeeklySheet, index: number) => {
    const updatedSheet = { ...student.weeklySheet };
    updatedSheet[day] = updatedSheet[day].filter((_, i) => i !== index);
    onUpdateWorkout(student.id, updatedSheet);
  };

  const handleOpenWhatsApp = () => {
    const cleanNumber = student.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanNumber}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right duration-700 pb-20">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-3 text-slate-400 hover:text-cyan-600 font-bold transition-colors group">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-cyan-50">
              <i className="fas fa-arrow-left"></i>
            </div>
            Voltar
          </button>
          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${
              isEditing ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white hover:bg-cyan-600'
            }`}
          >
            <i className={`fas ${isEditing ? 'fa-check' : 'fa-pen-to-square'}`}></i>
            {isEditing ? 'Finalizar Prescrição' : 'Prescrever Treino'}
          </button>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleOpenWhatsApp}
            className="bg-[#25D366] text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
          >
            <i className="fab fa-whatsapp text-lg"></i>
            WhatsApp
          </button>
          <button 
            onClick={onViewProfile}
            className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-600 hover:text-white transition-all shadow-sm"
          >
            Ver Perfil Biométrico
          </button>
        </div>
      </div>

      {/* Student Summary Card */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/50 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
        <img src={student.photo} className="w-32 h-32 rounded-[2.5rem] border-8 border-slate-50 shadow-xl object-cover relative z-10" alt={student.name} />
        <div className="text-center md:text-left relative z-10 flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{student.name}</h2>
            <span className="px-4 py-1.5 bg-cyan-100 text-cyan-700 text-[10px] font-black rounded-full uppercase tracking-[0.2em]">Ficha Semanal</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <i className={`fas ${getModalityIcon(student.modality)}`}></i>
              <span className="text-xs font-bold text-slate-700">{student.modality}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <i className="fas fa-trophy text-amber-500"></i>
              <span className="text-xs font-bold text-slate-700">{student.level}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <i className="fas fa-calendar text-emerald-500"></i>
              <span className="text-xs font-bold text-slate-700">{student.age} anos</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <i className="fas fa-venus-mars text-indigo-500"></i>
              <span className="text-xs font-bold text-slate-700">{student.gender}</span>
            </div>
          </div>
          {student.goal && (
            <p className="text-slate-500 text-xs mt-4 font-medium italic">Objetivo: "{student.goal}"</p>
          )}
        </div>
      </div>

      {/* Prescriber Area (Only visible when editing) */}
      {isEditing && (
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center">
              <i className="fas fa-magic text-xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-black">Editor de Prescrição</h3>
              <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">Selecione o dia para montar o treino</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">1. Selecionar Dia</label>
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <button
                    key={day.key}
                    onClick={() => setSelectedDay(day.key as keyof WeeklySheet)}
                    className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                      selectedDay === day.key ? 'bg-cyan-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedDay && (
              <div className="space-y-6 animate-in fade-in zoom-in-95">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">2. Adicionar Exercício</label>
                  <select 
                    className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-cyan-500"
                    value={newSet.exerciseId}
                    onChange={e => setNewSet({...newSet, exerciseId: e.target.value})}
                  >
                    <option value="" className="text-slate-900">Escolha um exercício...</option>
                    {EXERCISES_LIBRARY.map(ex => (
                      <option key={ex.id} value={ex.id} className="text-slate-900">{ex.name} ({ex.modality})</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase">Séries</label>
                    <input 
                      type="number" className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl text-sm"
                      value={newSet.series} onChange={e => setNewSet({...newSet, series: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase">Reps/Dist</label>
                    <input 
                      className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl text-sm"
                      value={newSet.reps} onChange={e => setNewSet({...newSet, reps: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase">Intervalo</label>
                    <input 
                      className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl text-sm"
                      value={newSet.rest} onChange={e => setNewSet({...newSet, rest: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => handleAddExercise(selectedDay)}
                  className="w-full bg-cyan-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-cyan-500 transition-colors"
                >
                  Incluir no Treino
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Weekly Sheet View */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {days.map((day) => {
          const workouts = student.weeklySheet[day.key as keyof WeeklySheet] as WorkoutSet[];
          const isSelected = selectedDay === day.key && isEditing;
          
          return (
            <div key={day.key} className={`bg-white rounded-[2rem] shadow-sm border flex flex-col group transition-all ${
              isSelected ? 'ring-4 ring-cyan-500/20 border-cyan-500' : 'border-slate-200/50 hover:border-cyan-200'
            }`}>
              <div className={`p-4 border-b rounded-t-[2rem] flex justify-between items-center ${
                isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-50/50 border-slate-100'
              }`}>
                <h3 className={`font-black text-xs tracking-widest uppercase ${isSelected ? 'text-white' : 'text-slate-900'}`}>{day.sub}</h3>
                {isEditing && (
                  <button onClick={() => setSelectedDay(day.key as keyof WeeklySheet)}>
                    <i className={`fas fa-circle-plus text-lg ${isSelected ? 'text-white' : 'text-cyan-500 hover:scale-110 transition-transform'}`}></i>
                  </button>
                )}
              </div>
              <div className="p-4 flex-1">
                {workouts.length > 0 ? (
                  <div className="space-y-4">
                    {workouts.map((w, idx) => (
                      <div key={idx} className="relative p-3 bg-cyan-50/50 rounded-2xl border border-cyan-100/50 text-[11px] group/item">
                        <p className="font-black text-slate-800 leading-tight mb-2 truncate">{getExerciseName(w.exerciseId)}</p>
                        <div className="flex flex-col gap-1 text-cyan-700 font-bold opacity-80">
                          <span>{w.series} séries</span>
                          <span>{w.reps}</span>
                          <span className="text-[9px] text-slate-400">Rest: {w.rest}</span>
                        </div>
                        {isEditing && (
                          <button 
                            onClick={() => handleRemoveExercise(day.key as keyof WeeklySheet, idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity shadow-lg"
                          >
                            <i className="fas fa-times text-[10px]"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-24 flex flex-col items-center justify-center opacity-20 italic text-[10px] font-black uppercase">Off</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDetails;
