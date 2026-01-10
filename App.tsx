
import React, { useState, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import StudentDetails from './components/StudentDetails';
import StudentProfile from './components/StudentProfile';
import SubscriptionFlow from './components/SubscriptionFlow';
import StudentDashboard from './components/StudentDashboard';
import { MOCK_STUDENTS, EXERCISES_LIBRARY } from './constants';
import { Student, Modality, MuscleGroup, AccountStatus, Exercise, WeeklySheet, UserRole, WorkoutSet } from './types';
import { chatWithAI } from './services/geminiService';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const PT_BR_DAYS: Record<keyof WeeklySheet, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentViewMode, setStudentViewMode] = useState<'sheet' | 'profile'>('sheet');
  const [trainerName, setTrainerName] = useState('Coach Bruno');
  const [trainerStatus, setTrainerStatus] = useState<AccountStatus>(AccountStatus.ACTIVE);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [library, setLibrary] = useState<Exercise[]>(EXERCISES_LIBRARY);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddExerciseForm, setShowAddExerciseForm] = useState(false);
  
  // Modal de Novo Aluno (Treinador)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    birthDate: '',
    gender: 'Masculino' as 'Masculino' | 'Feminino' | 'Outro',
    modality: Modality.SWIMMING,
    level: 'Iniciante' as 'Iniciante' | 'Intermediário' | 'Avançado'
  });

  // Modal de Nova Atividade para Praticante Livre
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activeDayForModal, setActiveDayForModal] = useState<keyof WeeklySheet | null>(null);
  const [newActivityData, setNewActivityData] = useState({
    name: '',
    modality: Modality.WEIGHTLIFTING,
    series: 3,
    reps: '12 reps',
    rest: '60s'
  });

  const loggedStudent = students[0];

  const [independentData, setIndependentData] = useState<Student>({
    ...MOCK_STUDENTS[0],
    id: 'indep-1',
    name: 'Atleta Livre',
    modality: Modality.WEIGHTLIFTING,
    goal: 'Treino de Autogestão',
    weeklySheet: { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] }
  });

  const [newLibEx, setNewLibEx] = useState({
    name: '',
    modality: Modality.WEIGHTLIFTING,
    muscleGroup: MuscleGroup.FULL_BODY,
    description: ''
  });

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userRole) {
      setActiveTab(userRole === 'trainer' ? 'dashboard' : 'my-workout');
    }
  }, [userRole]);

  const handleAddLibraryExercise = (e: React.FormEvent) => {
    e.preventDefault();
    const newEx: Exercise = {
      id: `lib-${Date.now()}`,
      ...newLibEx,
      imageUrl: 'https://illustrations.popsy.co/sky/fitness.svg'
    };
    setLibrary([...library, newEx]);
    setShowAddExerciseForm(false);
    setNewLibEx({ name: '', modality: Modality.WEIGHTLIFTING, muscleGroup: MuscleGroup.FULL_BODY, description: '' });
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `s-${Date.now()}`,
      name: newStudentData.name,
      email: newStudentData.email,
      whatsapp: newStudentData.whatsapp,
      gender: newStudentData.gender,
      age: 25, // Simplificado: Ideal calcular via birthDate
      modality: newStudentData.modality,
      level: newStudentData.level,
      startDate: new Date().toLocaleDateString('pt-BR'),
      status: AccountStatus.ACTIVE,
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newStudentData.name}`,
      trainingLocation: 'A definir',
      address: { cep: '', logradouro: '', bairro: '', cidade: '', uf: '', numero: '' },
      weeklySheet: { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] }
    };

    setStudents([...students, newStudent]);
    setShowAddStudentModal(false);
    setNewStudentData({
      name: '',
      email: '',
      whatsapp: '',
      birthDate: '',
      gender: 'Masculino',
      modality: Modality.SWIMMING,
      level: 'Iniciante'
    });
    alert('Aluno cadastrado com sucesso!');
  };

  const handleDeleteLibraryExercise = (id: string) => {
    if (window.confirm('Excluir este exercício da biblioteca?')) {
      setLibrary(library.filter(ex => ex.id !== id));
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);
    const aiResponse = await chatWithAI(chatInput, userRole === 'trainer' ? students : [independentData]);
    setIsTyping(false);
    setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse || '...', timestamp: new Date() }]);
  };

  const openActivityForm = (day: keyof WeeklySheet) => {
    setActiveDayForModal(day);
    setShowActivityModal(true);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDayForModal || !newActivityData.name.trim()) return;

    const exerciseId = `custom-${Date.now()}`;
    const newEx: Exercise = {
      id: exerciseId,
      name: newActivityData.name,
      modality: newActivityData.modality,
      muscleGroup: MuscleGroup.FULL_BODY,
      description: 'Atividade customizada.',
      imageUrl: 'https://illustrations.popsy.co/sky/fitness.svg'
    };

    setLibrary(prev => [...prev, newEx]);
    
    const updatedSheet = { ...independentData.weeklySheet };
    updatedSheet[activeDayForModal] = [
      ...updatedSheet[activeDayForModal],
      { 
        exerciseId, 
        series: newActivityData.series, 
        reps: newActivityData.reps, 
        rest: newActivityData.rest 
      }
    ];
    
    setIndependentData({ ...independentData, weeklySheet: updatedSheet });
    setShowActivityModal(false);
    setNewActivityData({ name: '', modality: Modality.WEIGHTLIFTING, series: 3, reps: '12 reps', rest: '60s' });
  };

  const removeActivity = (day: keyof WeeklySheet, index: number) => {
    if (window.confirm('Excluir esta atividade?')) {
      const updated = { ...independentData.weeklySheet };
      updated[day] = updated[day].filter((_, i) => i !== index);
      setIndependentData({ ...independentData, weeklySheet: updated });
    }
  };

  const handleOpenWhatsApp = (whatsapp: string) => {
    const cleanNumber = whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanNumber}`, '_blank');
  };

  if (!userRole) {
    return (
      <div className="min-h-screen bg-pool flex items-center justify-center p-6 text-slate-900">
        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl max-w-2xl w-full text-center space-y-8">
           <div className="space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center shadow-md mb-4"><i className="fas fa-bolt text-cyan-600 text-3xl"></i></div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">PersonalPro</h1>
              <p className="text-cyan-700 font-black uppercase tracking-widest text-[10px]">Gestão de Alta Performance</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => setUserRole('trainer')} className="group bg-slate-900 text-white p-6 rounded-[2rem] transition-all shadow-xl flex flex-col items-center justify-center"><i className="fas fa-user-tie text-3xl mb-3"></i><h3 className="text-sm font-black">Sou Personal</h3></button>
              
              <button 
                onClick={() => setUserRole('independent')} 
                style={{ backgroundColor: '#00FF00' }} 
                className="group text-slate-900 p-6 rounded-[2rem] transition-all shadow-xl flex flex-col items-center justify-center border border-black/10"
              >
                <i className="fas fa-person-running text-3xl mb-3"></i>
                <h3 className="text-sm font-black">Praticante Livre</h3>
              </button>

              <button onClick={() => setUserRole('student')} style={{ backgroundColor: '#1E90FF' }} className="group text-white p-6 rounded-[2rem] transition-all shadow-xl flex flex-col items-center justify-center border border-white/10">
                <i className="fas fa-user-graduate text-3xl mb-3"></i>
                <h3 className="text-sm font-black">Sou Aluno</h3>
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      userRole={userRole}
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      trainerName={userRole === 'trainer' ? trainerName : (userRole === 'independent' ? independentData.name : loggedStudent.name)}
      onTrainerNameChange={setTrainerName}
      trainerStatus={trainerStatus}
      onStatusChange={setTrainerStatus}
      onOpenShare={() => setShowShareModal(true)}
      onLogout={() => setUserRole(null)}
    >
      {userRole === 'trainer' ? (
        <>
          {activeTab === 'dashboard' && (
             <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Geral</h1>
                  <p className="text-slate-900 mt-2 font-black text-lg">Controle Total PersonalPro: Monitoramento e Suporte.</p>
                </div>
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-300 overflow-hidden flex flex-col h-[500px]">
                   <div className="bg-slate-900 p-6 text-white font-black">Central PersonalPro IA</div>
                   <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                      {chatMessages.map((m, i) => <div key={i} className={`p-4 rounded-2xl mb-2 font-bold ${m.role === 'user' ? 'bg-cyan-600 text-white ml-auto' : 'bg-white text-slate-900 border border-slate-200 mr-auto'}`}>{m.text}</div>)}
                   </div>
                   <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
                      <input type="text" className="flex-1 p-4 rounded-xl border border-slate-200 font-black text-slate-900" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Dúvida técnica?" />
                      <button className="bg-slate-900 text-white px-6 rounded-xl font-black">Enviar</button>
                   </form>
                </div>
             </div>
          )}

          {activeTab === 'students' && (
            <div className="animate-in fade-in space-y-8">
              {selectedStudent ? (
                studentViewMode === 'sheet' ? (
                  <StudentDetails 
                    student={selectedStudent} 
                    library={library}
                    onBack={() => setSelectedStudent(null)} 
                    onViewProfile={() => setStudentViewMode('profile')} 
                    onUpdateWorkout={(id, sheet) => setStudents(students.map(s => s.id === id ? {...s, weeklySheet: sheet} : s))}
                  />
                ) : (
                  <StudentProfile student={selectedStudent} onBack={() => setStudentViewMode('sheet')} onViewSheet={() => setStudentViewMode('sheet')} />
                )
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Meus Alunos</h1>
                    <button 
                      onClick={() => setShowAddStudentModal(true)}
                      className="bg-cyan-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-slate-900 transition-all"
                    >
                      <i className="fas fa-plus"></i> Novo Aluno
                    </button>
                  </div>

                  {/* Modal de Cadastro de Aluno */}
                  {showAddStudentModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddStudentModal(false)}></div>
                      <form onSubmit={handleAddStudent} className="relative z-10 bg-white w-full max-w-2xl p-10 rounded-[3rem] shadow-2xl border-4 border-slate-900 space-y-6 overflow-y-auto max-h-[90vh] no-scrollbar">
                         <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-4">Cadastro de <span className="text-cyan-600">Novo Aluno</span></h2>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                               <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">Nome Completo (Mandatório)</label>
                               <input required type="text" placeholder="Ex: João Silva" className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 font-black text-slate-900 outline-none focus:border-cyan-500" value={newStudentData.name} onChange={e => setNewStudentData({...newStudentData, name: e.target.value})} />
                            </div>
                            
                            <div>
                               <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">Data de Nascimento (Mandatório)</label>
                               <input required type="date" className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 font-black text-slate-900 outline-none focus:border-cyan-500" value={newStudentData.birthDate} onChange={e => setNewStudentData({...newStudentData, birthDate: e.target.value})} />
                            </div>

                            <div>
                               <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">WhatsApp (Mandatório)</label>
                               <input required type="tel" placeholder="(00) 00000-0000" className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 font-black text-slate-900 outline-none focus:border-cyan-500" value={newStudentData.whatsapp} onChange={e => setNewStudentData({...newStudentData, whatsapp: e.target.value})} />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                               <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">E-mail (Opcional)</label>
                               <input type="email" placeholder="joao@email.com" className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 font-black text-slate-900 outline-none focus:border-cyan-500" value={newStudentData.email} onChange={e => setNewStudentData({...newStudentData, email: e.target.value})} />
                            </div>

                            <div>
                               <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">Modalidade</label>
                               <select className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 font-black text-slate-900 outline-none focus:border-cyan-500" value={newStudentData.modality} onChange={e => setNewStudentData({...newStudentData, modality: e.target.value as Modality})}>
                                  {Object.values(Modality).map(m => <option key={m} value={m}>{m}</option>)}
                               </select>
                            </div>

                            <div>
                               <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">Gênero</label>
                               <select className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 font-black text-slate-900 outline-none focus:border-cyan-500" value={newStudentData.gender} onChange={e => setNewStudentData({...newStudentData, gender: e.target.value as any})}>
                                  <option value="Masculino">Masculino</option>
                                  <option value="Feminino">Feminino</option>
                                  <option value="Outro">Outro</option>
                                </select>
                            </div>
                         </div>

                         <div className="flex gap-4 pt-6">
                            <button type="submit" className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-xl">Cadastrar Aluno</button>
                            <button type="button" onClick={() => setShowAddStudentModal(false)} className="px-8 bg-slate-100 text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200">Cancelar</button>
                         </div>
                      </form>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {students.map(student => (
                      <div key={student.id} className="aqua-card p-8 flex flex-col items-center text-center bg-white border border-slate-200 relative group overflow-hidden shadow-sm">
                        {/* WhatsApp Button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenWhatsApp(student.whatsapp);
                          }}
                          className="absolute top-4 right-4 w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                          title="Abrir WhatsApp do Aluno"
                        >
                          <i className="fab fa-whatsapp text-2xl"></i>
                        </button>

                        <img src={student.photo} className="w-24 h-24 rounded-3xl mb-4 shadow-lg object-cover" alt={student.name} />
                        <h3 className="font-black text-xl text-slate-900 mb-1 leading-tight">{student.name}</h3>
                        <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest">{student.modality}</p>
                        
                        <button 
                          onClick={() => { setSelectedStudent(student); setStudentViewMode('sheet'); }} 
                          className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-md"
                        >
                          Gerenciar Treino
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'exercises' && (
             <div className="space-y-8">
                <div className="flex justify-between items-center">
                   <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Biblioteca Global</h1>
                   <button 
                    onClick={() => setShowAddExerciseForm(true)}
                    className="bg-cyan-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-slate-900 transition-all"
                   >
                     <i className="fas fa-plus"></i> Criar Novo Exercício
                   </button>
                </div>

                {showAddExerciseForm && (
                  <form onSubmit={handleAddLibraryExercise} className="bg-white p-8 rounded-[2.5rem] border-4 border-cyan-600 shadow-2xl space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required type="text" placeholder="Nome do Exercício" className="p-4 rounded-xl border border-slate-300 font-black text-slate-900" value={newLibEx.name} onChange={e => setNewLibEx({...newLibEx, name: e.target.value})} />
                        <select className="p-4 rounded-xl border border-slate-300 font-black text-slate-900" value={newLibEx.modality} onChange={e => setNewLibEx({...newLibEx, modality: e.target.value as Modality})}>
                           {Object.values(Modality).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                     </div>
                     <textarea placeholder="Descrição técnica" className="w-full p-4 rounded-xl border border-slate-300 font-black text-slate-900" value={newLibEx.description} onChange={e => setNewLibEx({...newLibEx, description: e.target.value})} />
                     <div className="flex gap-2">
                        <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black">Salvar Exercício</button>
                        <button type="button" onClick={() => setShowAddExerciseForm(false)} className="bg-slate-200 text-slate-600 px-8 py-3 rounded-xl font-black">Cancelar</button>
                     </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {library.map(ex => (
                     <div key={ex.id} className="aqua-card p-6 border border-slate-300 flex flex-col h-full bg-white relative group shadow-sm">
                        <img src={ex.imageUrl} className="w-full h-40 object-contain mb-4" alt={ex.name} />
                        <div className="flex-1">
                           <h3 className="font-black text-xl text-slate-900 mb-1 leading-tight">{ex.name}</h3>
                           <p className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">{ex.modality}</p>
                           <p className="text-xs font-bold text-slate-900 mt-2 line-clamp-2">{ex.description}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteLibraryExercise(ex.id)}
                          className="mt-4 w-full py-4 rounded-xl bg-slate-100 text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all border border-slate-200 flex items-center justify-center gap-2"
                        >
                           <i className="fas fa-trash-alt"></i> Excluir Exercício
                        </button>
                     </div>
                   ))}
                </div>
             </div>
          )}
        </>
      ) : (
        /* INDEPENDENT PLANNER */
        <div className="space-y-8">
           {activeTab === 'my-workout' && <StudentDashboard student={independentData} library={library} activeTab={activeTab} onUpdateSheet={s => setIndependentData({...independentData, weeklySheet: s})} chatMessages={chatMessages} onSendMessage={handleSendMessage} chatInput={chatInput} setChatInput={setChatInput} isTyping={isTyping} chatEndRef={chatEndRef} />}
           
           {activeTab === 'planner' && (
              <div className="space-y-8 pb-20">
                 <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Planejador de Treinos Livres</h1>
                    <p className="text-slate-900 mt-2 font-black text-lg">Configure sua rotina semanal clicando nos botões abaixo.</p>
                 </div>

                 {/* Modal de Criação de Atividade */}
                 {showActivityModal && (
                   <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowActivityModal(false)}></div>
                      <form onSubmit={handleSaveActivity} className="relative z-10 bg-white w-full max-w-lg p-10 rounded-[3rem] shadow-2xl border-4 border-slate-900 space-y-6">
                         <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-4">Nova Atividade para <span className="text-cyan-600">{activeDayForModal && PT_BR_DAYS[activeDayForModal]}</span></h2>
                         
                         <div className="space-y-4">
                            <div>
                               <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">Nome da Atividade</label>
                               <input required type="text" placeholder="Ex: Corrida 5km, Natação Crawl..." className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 font-black text-slate-900 outline-none focus:border-cyan-500" value={newActivityData.name} onChange={e => setNewActivityData({...newActivityData, name: e.target.value})} />
                            </div>
                            
                            <div>
                               <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">Escolha a Modalidade</label>
                               <select className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 font-black text-slate-900 outline-none focus:border-cyan-500" value={newActivityData.modality} onChange={e => setNewActivityData({...newActivityData, modality: e.target.value as Modality})}>
                                  {Object.values(Modality).map(m => <option key={m} value={m}>{m}</option>)}
                               </select>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                               <div>
                                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">Séries</label>
                                  <input type="number" className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 font-black text-slate-900" value={newActivityData.series} onChange={e => setNewActivityData({...newActivityData, series: parseInt(e.target.value)})} />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">Reps/Tempo</label>
                                  <input type="text" className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 font-black text-slate-900" value={newActivityData.reps} onChange={e => setNewActivityData({...newActivityData, reps: e.target.value})} />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">Descanso</label>
                                  <input type="text" className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 font-black text-slate-900" value={newActivityData.rest} onChange={e => setNewActivityData({...newActivityData, rest: e.target.value})} />
                               </div>
                            </div>
                         </div>

                         <div className="flex gap-4 pt-4">
                            <button type="submit" className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-xl">Criar Treino</button>
                            <button type="button" onClick={() => setShowActivityModal(false)} className="px-8 bg-slate-100 text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200">Cancelar</button>
                         </div>
                      </form>
                   </div>
                 )}

                 <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                    {(Object.entries(PT_BR_DAYS) as [keyof WeeklySheet, string][]).map(([dayKey, dayLabel]) => (
                      <div key={dayKey} className="bg-white rounded-[2rem] border border-slate-300 flex flex-col shadow-sm">
                         <div className="p-4 border-b bg-slate-50 rounded-t-[2rem] flex justify-between items-center">
                            <h3 className="font-black text-xs tracking-widest uppercase text-slate-900">{dayLabel.split('-')[0]}</h3>
                         </div>
                         <div className="p-4 flex-1 space-y-3">
                            <button 
                              className="w-full p-4 border-4 border-dashed border-cyan-500 rounded-2xl flex flex-col items-center justify-center gap-2 bg-cyan-50/50 hover:bg-cyan-100 transition-all group"
                              onClick={() => openActivityForm(dayKey)}
                            >
                               <div className="w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                  <i className="fas fa-plus text-lg"></i>
                               </div>
                               <span className="text-[10px] font-black text-cyan-800 uppercase tracking-widest">Novo Treino</span>
                            </button>

                            {independentData.weeklySheet[dayKey].map((item, i) => {
                              const ex = library.find(e => e.id === item.exerciseId);
                              return (
                                <div key={i} className="p-4 bg-slate-900 text-white rounded-2xl border-2 border-slate-800 shadow-lg relative group">
                                   <h4 className="font-black text-sm uppercase tracking-tight pr-10">{ex?.name || 'Atividade'}</h4>
                                   <p className="text-[10px] text-cyan-400 font-bold mt-1 uppercase">{ex?.modality}</p>
                                   <div className="flex justify-between items-end mt-4">
                                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.series}x {item.reps}</span>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeActivity(dayKey, i);
                                        }}
                                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-rose-600 transition-colors"
                                      >
                                         <i className="fas fa-trash-alt text-[11px]"></i>
                                      </button>
                                   </div>
                                </div>
                              );
                            })}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           )}
           {activeTab === 'my-stats' && <StudentDashboard student={independentData} library={library} activeTab={activeTab} onUpdateSheet={() => {}} chatMessages={chatMessages} onSendMessage={handleSendMessage} chatInput={chatInput} setChatInput={setChatInput} isTyping={isTyping} chatEndRef={chatEndRef} />}
           {activeTab === 'feedback' && <StudentDashboard student={independentData} library={library} activeTab={activeTab} onUpdateSheet={() => {}} chatMessages={chatMessages} onSendMessage={handleSendMessage} chatInput={chatInput} setChatInput={setChatInput} isTyping={isTyping} chatEndRef={chatEndRef} />}
        </div>
      )}
    </Layout>
  );
};

export default App;
