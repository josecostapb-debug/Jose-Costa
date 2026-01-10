
import React, { useState } from 'react';
import { Student, Exercise, WeeklySheet, WorkoutSet, Modality } from '../types';

interface StudentDetailsProps {
  student: Student;
  library: Exercise[];
  onBack: () => void;
  onViewProfile: () => void;
  onUpdateWorkout: (studentId: string, newSheet: WeeklySheet) => void;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ student, library, onBack, onViewProfile, onUpdateWorkout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDay, setSelectedDay] = useState<keyof WeeklySheet | null>(null);
  
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

  const getExerciseName = (id: string) => library.find(e => e.id === id)?.name || 'Atividade';

  const handleAddExercise = (day: keyof WeeklySheet) => {
    if (!newSet.exerciseId) return;
    const updatedSheet = { ...student.weeklySheet };
    updatedSheet[day] = [...updatedSheet[day], { ...newSet }];
    onUpdateWorkout(student.id, updatedSheet);
    setNewSet({ exerciseId: '', series: 3, reps: '10 reps', rest: '45s' });
    alert('Exercício prescrito com sucesso!');
  };

  const handleRemoveExercise = (day: keyof WeeklySheet, index: number) => {
    if (window.confirm('Remover exercício da ficha?')) {
      const updatedSheet = { ...student.weeklySheet };
      updatedSheet[day] = updatedSheet[day].filter((_, i) => i !== index);
      onUpdateWorkout(student.id, updatedSheet);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button onClick={onBack} className="flex items-center gap-3 text-slate-900 hover:text-cyan-600 font-black transition-colors group">
          <div className="w-12 h-12 rounded-full bg-white shadow-md border-2 border-slate-900 flex items-center justify-center group-hover:bg-slate-100 transition-all"><i className="fas fa-arrow-left text-lg"></i></div>
          <span className="text-xl uppercase tracking-tighter">Sair da Ficha</span>
        </button>
        <button onClick={() => setIsEditing(!isEditing)} className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 ${isEditing ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white hover:bg-cyan-600'}`}>
          <i className={`fas ${isEditing ? 'fa-check' : 'fa-pen-to-square'}`}></i>
          {isEditing ? 'Confirmar Prescrição' : 'Editar Cronograma'}
        </button>
      </div>

      <div className="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-slate-900 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <img src={student.photo} className="w-32 h-32 rounded-[2.5rem] border-4 border-slate-900 shadow-xl object-cover" />
        <div className="text-center md:text-left flex-1">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{student.name}</h2>
          <p className="text-slate-900 mt-3 font-black text-xl">Gestão de Prescrição Especializada</p>
        </div>
      </div>

      {isEditing && (
        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white border-4 border-cyan-600 animate-in slide-in-from-top-4">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-2"><i className="fas fa-plus-circle text-cyan-400"></i> Adicionar à Ficha</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block">Passo 1: Selecionar Dia</label>
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <button key={day.key} onClick={() => setSelectedDay(day.key as keyof WeeklySheet)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${selectedDay === day.key ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>{day.label}</button>
                ))}
              </div>
            </div>
            {selectedDay && (
              <div className="space-y-6">
                <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block">Passo 2: Escolher Atividade</label>
                <select className="w-full bg-white text-slate-900 border-4 border-cyan-600 p-4 rounded-2xl text-lg font-black outline-none" value={newSet.exerciseId} onChange={e => setNewSet({...newSet, exerciseId: e.target.value})}>
                  <option value="">Selecione na Biblioteca...</option>
                  {library.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                </select>
                <button onClick={() => handleAddExercise(selectedDay)} className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-cyan-500 transition-all">Prescrever Agora</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {days.map((day) => {
          const workouts = student.weeklySheet[day.key as keyof WeeklySheet] || [];
          return (
            <div key={day.key} className="bg-white rounded-[2rem] shadow-md border-4 border-slate-900 flex flex-col h-full">
              <div className="p-4 border-b-4 border-slate-900 bg-slate-50 rounded-t-[1.8rem] flex justify-between items-center"><h3 className="font-black text-sm tracking-widest uppercase text-slate-900">{day.sub}</h3></div>
              <div className="p-4 flex-1 space-y-3">
                {workouts.map((w, idx) => (
                  <div key={idx} className="relative p-4 bg-slate-900 text-white rounded-2xl border-2 border-slate-800 group transition-all hover:scale-95">
                    <p className="font-black text-white text-[12px] uppercase tracking-tighter pr-6 leading-tight mb-2">{getExerciseName(w.exerciseId)}</p>
                    <div className="flex flex-col gap-1 font-black">
                      <span className="text-cyan-400 text-[10px]">{w.series} séries • {w.reps}</span>
                    </div>
                    {isEditing && (
                      <button 
                        onClick={() => handleRemoveExercise(day.key as keyof WeeklySheet, idx)} 
                        className="absolute -top-3 -right-3 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white hover:scale-125 transition-all"
                      >
                        <i className="fas fa-trash-alt text-[11px]"></i>
                      </button>
                    )}
                  </div>
                ))}
                {workouts.length === 0 && (
                  <div className="h-full flex items-center justify-center opacity-30 py-10">
                    <i className="fas fa-calendar-day text-2xl text-slate-900"></i>
                  </div>
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
