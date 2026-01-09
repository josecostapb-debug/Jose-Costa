
import React, { useState, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import StudentDetails from './components/StudentDetails';
import StudentProfile from './components/StudentProfile';
import SubscriptionFlow from './components/SubscriptionFlow';
import { MOCK_STUDENTS, EXERCISES_LIBRARY } from './constants';
import { Student, Modality, MuscleGroup, AccountStatus, Exercise, WeeklySheet } from './types';
import { chatWithAI } from './services/geminiService';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'exercises' | 'feedback' | 'subscription'>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentViewMode, setStudentViewMode] = useState<'sheet' | 'profile'>('sheet');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [filterGroup, setFilterGroup] = useState<MuscleGroup | 'Todos'>('Todos');
  const [trainerName, setTrainerName] = useState('Coach Bruno');
  const [trainerStatus, setTrainerStatus] = useState<AccountStatus>(AccountStatus.ACTIVE);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [library, setLibrary] = useState<Exercise[]>(EXERCISES_LIBRARY);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Olá, Coach! Agora o AquaPro suporta Natação, Hidroginástica, Musculação e Pilates. Como posso ajudar?', timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // New Student Form State
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    age: '',
    gender: 'Masculino' as 'Masculino' | 'Feminino' | 'Outro',
    whatsapp: '',
    email: '',
    modality: Modality.SWIMMING,
    level: 'Iniciante' as 'Iniciante' | 'Intermediário' | 'Avançado'
  });

  // Form state for new exercise
  const [newExForm, setNewExForm] = useState({
    name: '',
    modality: Modality.SWIMMING,
    muscleGroup: MuscleGroup.FULL_BODY,
    description: '',
    imageUrl: 'https://illustrations.popsy.co/sky/workout.svg'
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const getModalityIcon = (modality: Modality) => {
    switch (modality) {
      case Modality.SWIMMING: return 'fa-person-swimming text-cyan-500';
      case Modality.WATER_AEROBICS: return 'fa-water text-teal-500';
      case Modality.WEIGHTLIFTING: return 'fa-dumbbell text-slate-700';
      case Modality.PILATES: return 'fa-spa text-emerald-500';
      default: return 'fa-dumbbell text-slate-400';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);
    const aiResponse = await chatWithAI(chatInput, students);
    setIsTyping(false);
    setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse || '...', timestamp: new Date() }]);
  };

  const handleSaveNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name || !newStudentForm.age || !newStudentForm.whatsapp || !newStudentForm.gender) {
      alert("⚠️ Campos obrigatórios: Nome, Idade, Gênero e WhatsApp.");
      return;
    }

    const newStudent: Student = {
      id: `s${Date.now()}`,
      name: newStudentForm.name,
      email: newStudentForm.email,
      whatsapp: newStudentForm.whatsapp,
      gender: newStudentForm.gender,
      age: parseInt(newStudentForm.age),
      startDate: new Date().toLocaleDateString('pt-BR'),
      level: newStudentForm.level,
      modality: newStudentForm.modality,
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newStudentForm.name}`,
      status: AccountStatus.ACTIVE,
      address: { cep: '', logradouro: '', bairro: '', cidade: '', uf: '', numero: '' },
      trainingLocation: 'A definir',
      weeklySheet: { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] }
    };

    setStudents(prev => [newStudent, ...prev]);
    setIsAddingStudent(false);
    setNewStudentForm({
      name: '', age: '', gender: 'Masculino', whatsapp: '', email: '', 
      modality: Modality.SWIMMING, level: 'Iniciante'
    });
  };

  const handleOpenWhatsApp = (whatsapp: string) => {
    const cleanNumber = whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanNumber}`, '_blank');
  };

  const handleUpdateWorkout = (studentId: string, newSheet: WeeklySheet) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, weeklySheet: newSheet } : s));
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(prev => prev ? { ...prev, weeklySheet: newSheet } : null);
    }
  };

  const triggerImageEdit = (id: string) => {
    setEditingExerciseId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingExerciseId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLibrary(prev => prev.map(ex => 
          ex.id === editingExerciseId ? { ...ex, imageUrl: base64 } : ex
        ));
        setEditingExerciseId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteExercise = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este exercício da sua biblioteca?')) {
      setLibrary(prev => prev.filter(ex => ex.id !== id));
    }
  };

  const handleSaveNewExercise = () => {
    const newEx: Exercise = {
      ...newExForm,
      id: Date.now().toString()
    };
    setLibrary(prev => [newEx, ...prev]);
    setShowAddExerciseModal(false);
    setNewExForm({
      name: '',
      modality: Modality.SWIMMING,
      muscleGroup: MuscleGroup.FULL_BODY,
      description: '',
      imageUrl: 'https://illustrations.popsy.co/sky/workout.svg'
    });
  };

  // Added handleSubscriptionSuccess to fix "Cannot find name 'handleSubscriptionSuccess'" error on line 488
  const handleSubscriptionSuccess = (userData: any) => {
    setTrainerStatus(AccountStatus.ACTIVE);
    if (userData.name) setTrainerName(userData.name);
    setActiveTab('dashboard');
    alert(`Parabéns ${userData.name || 'Coach'}! Sua assinatura Premium foi ativada com sucesso.`);
  };

  const filteredExercises = filterGroup === 'Todos' 
    ? library 
    : library.filter(e => e.muscleGroup === filterGroup);

  const shortLink = `aquapro.fit/${trainerName.toLowerCase().replace(/\s+/g, '')}`;

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setActiveTab(tab);
        setSelectedStudent(null);
        setIsAddingStudent(false);
        setStudentViewMode('sheet');
      }}
      trainerName={trainerName}
      onTrainerNameChange={setTrainerName}
      trainerStatus={trainerStatus}
      onStatusChange={setTrainerStatus}
      onOpenShare={() => setShowShareModal(true)}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />

      {/* Add Student Modal */}
      {isAddingStudent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsAddingStudent(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            <div className="bg-slate-900 p-8 text-white flex items-center gap-4">
               <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-user-plus text-xl"></i>
               </div>
               <div>
                  <h3 className="text-xl font-black text-white">Ficha Cadastral</h3>
                  <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">Preencha os dados do novo atleta</p>
               </div>
            </div>
            
            <form onSubmit={handleSaveNewStudent} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nome Completo *</label>
                    <input 
                      required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-cyan-500/20"
                      value={newStudentForm.name} onChange={e => setNewStudentForm({...newStudentForm, name: e.target.value})}
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Idade *</label>
                      <input 
                        required type="number" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium outline-none"
                        value={newStudentForm.age} onChange={e => setNewStudentForm({...newStudentForm, age: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Gênero *</label>
                      <select 
                        required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium outline-none"
                        value={newStudentForm.gender} onChange={e => setNewStudentForm({...newStudentForm, gender: e.target.value as any})}
                      >
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">WhatsApp *</label>
                    <input 
                      required type="tel" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium outline-none"
                      value={newStudentForm.whatsapp} onChange={e => setNewStudentForm({...newStudentForm, whatsapp: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
               </div>

               <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">E-mail (Opcional)</label>
                    <input 
                      type="email" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium outline-none"
                      value={newStudentForm.email} onChange={e => setNewStudentForm({...newStudentForm, email: e.target.value})}
                      placeholder="aluno@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Modalidade Inicial</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium outline-none"
                      value={newStudentForm.modality} onChange={e => setNewStudentForm({...newStudentForm, modality: e.target.value as Modality})}
                    >
                      {Object.values(Modality).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-xl"
                    >
                      Salvar Cadastro
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsAddingStudent(false)}
                      className="w-full mt-2 text-slate-400 py-2 font-bold text-[10px] uppercase tracking-widest hover:text-rose-500"
                    >
                      Cancelar
                    </button>
                  </div>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Exercise */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowAddExerciseModal(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            <div className="bg-slate-900 p-8 text-white flex items-center gap-4">
               <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-plus-circle text-xl"></i>
               </div>
               <div>
                  <h3 className="text-xl font-black">Adicionar à Biblioteca</h3>
                  <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">Crie um novo banner de exercício</p>
               </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nome do Exercício</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-cyan-500/20"
                      value={newExForm.name} onChange={e => setNewExForm({...newExForm, name: e.target.value})}
                      placeholder="Ex: Prancha Abdominal"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Modalidade</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium outline-none"
                      value={newExForm.modality} onChange={e => setNewExForm({...newExForm, modality: e.target.value as Modality})}
                    >
                      {Object.values(Modality).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Grupo Muscular</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium outline-none"
                      value={newExForm.muscleGroup} onChange={e => setNewExForm({...newExForm, muscleGroup: e.target.value as MuscleGroup})}
                    >
                      {Object.values(MuscleGroup).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
               </div>

               <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Descrição / Técnica</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium outline-none resize-none"
                      value={newExForm.description} onChange={e => setNewExForm({...newExForm, description: e.target.value})}
                      placeholder="Explique como executar o movimento..."
                    />
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={handleSaveNewExercise}
                      disabled={!newExForm.name}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-xl disabled:opacity-50"
                    >
                      Salvar Exercício
                    </button>
                    <button 
                      onClick={() => setShowAddExerciseModal(false)}
                      className="w-full mt-2 text-slate-400 py-2 font-bold text-[10px] uppercase tracking-widest hover:text-rose-500"
                    >
                      Descartar
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowShareModal(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="aqua-gradient p-10 text-white text-center">
              <i className="fas fa-rocket text-4xl mb-4 text-cyan-300"></i>
              <h3 className="text-2xl font-black">Seu App Online!</h3>
              <p className="text-cyan-100 text-sm mt-2 opacity-80">Compartilhe o acesso direto com seus alunos.</p>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Link Curto de Acesso</label>
                <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
                  <div className="flex-1 px-4 font-bold text-slate-600 truncate">{shortLink}</div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(shortLink);
                      alert('Link copiado!');
                    }}
                    className="bg-cyan-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 py-4 bg-cyan-50/50 rounded-[2rem] border border-cyan-100">
                <p className="text-[10px] font-black text-cyan-700 uppercase tracking-widest">QR Code de Treino</p>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${shortLink}`} 
                  alt="QR Code" 
                  className="w-32 h-32 rounded-xl shadow-lg border-4 border-white"
                />
                <p className="text-[10px] text-slate-400 font-medium max-w-[200px] text-center italic">Imprima este QR Code e coloque no seu local de treino.</p>
              </div>

              <div className="space-y-4">
                 <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <i className="fas fa-globe text-cyan-500"></i> Como colocar no ar?
                 </h4>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium">
                   Para que este link funcione para qualquer pessoa, basta fazer o <strong>Deploy</strong> gratuito do código em plataformas como <strong>Vercel</strong> ou <strong>Netlify</strong>. É automático e leva menos de 2 minutos!
                 </p>
              </div>

              <button 
                onClick={() => setShowShareModal(false)}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-xl"
              >
                Fechar Painel de Publicação
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard <span className="text-cyan-600">Geral</span></h1>
              <p className="text-slate-500 mt-2 font-medium">Controle Total: Natação, Hidroginástica, Musculação e Pilates.</p>
            </div>
            <div className="bg-white px-8 py-5 rounded-[2rem] shadow-sm border border-white/60 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Alunos</p>
              <p className="text-3xl font-black text-slate-800">{students.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl border border-white/50 overflow-hidden flex flex-col h-[500px]">
             <div className="bg-slate-900 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <i className="fas fa-robot text-xl"></i>
                   </div>
                   <div>
                      <h2 className="text-white font-black text-lg">Central AquaPro IA</h2>
                      <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest">Especialista em 4 Modalidades</p>
                   </div>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 no-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-white text-slate-700 shadow-sm border border-slate-100'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-1">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
             </div>
             <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-4">
                <input 
                  type="text" placeholder="Peça uma dica técnica ou consulte um aluno..." 
                  className="flex-1 bg-slate-100 border-none px-6 py-4 rounded-2xl outline-none"
                  value={chatInput} onChange={e => setChatInput(e.target.value)}
                />
                <button type="submit" className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                  <i className="fas fa-paper-plane"></i>
                </button>
             </form>
          </div>
        </div>
      )}

      {activeTab === 'subscription' && (
        <SubscriptionFlow onSuccess={handleSubscriptionSuccess} onCancel={() => setActiveTab('dashboard')} />
      )}

      {activeTab === 'students' && (
        <div className="animate-in fade-in duration-500">
          {selectedStudent ? (
            studentViewMode === 'sheet' ? (
              <StudentDetails 
                student={selectedStudent} 
                onBack={() => setSelectedStudent(null)} 
                onViewProfile={() => setStudentViewMode('profile')} 
                onUpdateWorkout={handleUpdateWorkout}
              />
            ) : (
              <StudentProfile 
                student={selectedStudent} 
                onBack={() => setStudentViewMode('sheet')} 
                onViewSheet={() => setStudentViewMode('sheet')} 
              />
            )
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900">Meus Alunos</h1>
                <button onClick={() => setIsAddingStudent(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-cyan-600 transition-all shadow-xl">
                  <i className="fas fa-plus"></i> Novo Aluno
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {students.map(student => (
                  <div key={student.id} className="aqua-card p-8 flex flex-col items-center text-center relative group">
                    {/* WhatsApp Quick Action */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenWhatsApp(student.whatsapp);
                      }}
                      className="absolute top-4 right-4 w-10 h-10 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-20"
                      title="Conversar no WhatsApp"
                    >
                      <i className="fab fa-whatsapp text-lg"></i>
                    </button>

                    <img src={student.photo} className="w-24 h-24 rounded-3xl mb-4 shadow-lg object-cover" alt={student.name} />
                    <h3 className="font-extrabold text-xl text-slate-900">{student.name}</h3>
                    <div className="flex items-center gap-2 mt-2 text-cyan-600 font-black text-[10px] uppercase tracking-widest">
                       <i className={`fas ${getModalityIcon(student.modality).split(' ')[0]}`}></i>
                       {student.modality}
                    </div>
                    <button onClick={() => {
                      setSelectedStudent(student);
                      setStudentViewMode('sheet');
                    }} className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-600 transition-colors">Gerenciar Treino</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'exercises' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
             <div>
                <h1 className="text-3xl font-black text-slate-900">Biblioteca</h1>
                <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Gerencie seus banners de treino</p>
             </div>
             <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 no-scrollbar">
                <button 
                  onClick={() => setShowAddExerciseModal(true)}
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-cyan-600 transition-all whitespace-nowrap"
                >
                  <i className="fas fa-plus-circle"></i> Novo Banner
                </button>
                <div className="h-8 w-px bg-slate-200 mx-2 hidden lg:block"></div>
                {['Todos', ...Object.values(MuscleGroup)].map(group => (
                  <button 
                    key={group} onClick={() => setFilterGroup(group as any)}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all tracking-widest ${filterGroup === group ? 'bg-cyan-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'}`}
                  >
                    {group}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
            {filteredExercises.map(exercise => (
              <div key={exercise.id} className="aqua-card border border-white overflow-hidden flex flex-col group shadow-sm bg-white relative">
                {/* Delete Button Overlay */}
                <button 
                  onClick={() => handleDeleteExercise(exercise.id)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-rose-500 text-white rounded-xl shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90"
                  title="Excluir Banner"
                >
                  <i className="fas fa-trash-can text-sm"></i>
                </button>

                <div className="aspect-[4/3] bg-white flex items-center justify-center p-8 border-b border-slate-50 relative overflow-hidden">
                   <img src={exercise.imageUrl} alt={exercise.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                   
                   {/* Edit Button Overlay */}
                   <button 
                     onClick={() => triggerImageEdit(exercise.id)}
                     className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center text-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 hover:bg-cyan-600 hover:text-white"
                     title="Alterar Foto Ilustrativa"
                   >
                     <i className="fas fa-camera text-lg"></i>
                   </button>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-black uppercase tracking-widest rounded-lg">{exercise.muscleGroup}</span>
                    <i className={`fas ${getModalityIcon(exercise.modality)} text-lg`}></i>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-xl leading-tight mb-2">{exercise.name}</h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-3 font-medium">{exercise.description}</p>
                  <div className="mt-auto flex gap-3">
                    <button 
                      onClick={() => triggerImageEdit(exercise.id)}
                      className="flex-1 py-2.5 rounded-xl border-2 border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:border-cyan-500 hover:text-cyan-600 transition-all flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-pen"></i> Mudar Foto
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* "Add New Banner" Shortcut Card */}
            <button 
              onClick={() => setShowAddExerciseModal(true)}
              className="aqua-card border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 group hover:border-cyan-500 hover:bg-white transition-all min-h-[400px] animate-in fade-in zoom-in-95 duration-500"
            >
              <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-slate-300 group-hover:text-cyan-500 group-hover:scale-110 transition-all mb-4 border border-slate-100">
                <i className="fas fa-plus text-3xl"></i>
              </div>
              <p className="font-black text-slate-400 group-hover:text-cyan-600 text-[10px] uppercase tracking-widest">Novo Banner de Treino</p>
              <p className="text-[10px] text-slate-300 mt-2 font-bold max-w-[150px] text-center">Clique para expandir sua biblioteca agora</p>
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
