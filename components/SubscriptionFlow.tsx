
import React, { useState } from 'react';
import { UserRole } from '../types';

interface SubscriptionFlowProps {
  userRole: UserRole;
  onSuccess: (userData: any) => void;
  onCancel: () => void;
}

const SubscriptionFlow: React.FC<SubscriptionFlowProps> = ({ userRole, onSuccess, onCancel }) => {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const getPlanName = () => {
    if (userRole === 'trainer') return 'Trainer Elite';
    if (userRole === 'independent') return 'Self-Mastery';
    return 'Aluno Platinum';
  };

  const getPrice = () => {
    if (userRole === 'trainer') return '297,00';
    if (userRole === 'independent') return '197,00';
    return '149,00';
  };

  const isTrainer = userRole === 'trainer';

  return (
    <div className="max-w-4xl mx-auto py-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/50 flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side - Promo */}
        <div className="md:w-1/3 aqua-gradient p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <i className="fas fa-crown text-4xl text-amber-400 mb-6 drop-shadow-lg"></i>
            <h2 className="text-3xl font-black leading-tight mb-4">
               PersonalPro <span className="text-cyan-300">{getPlanName()}</span>
            </h2>
            <p className="text-sm font-medium opacity-80 leading-relaxed">
               {userRole === 'independent' 
                ? 'Liberdade total para treinar onde quiser com suporte de IA avançado e biblioteca de exercícios profissional.' 
                : (isTrainer 
                  ? 'Gestão ilimitada de alunos, biblioteca completa e IA de performance.' 
                  : 'Acesso total aos seus treinos, histórico de evolução e consultoria via IA.')}
            </p>
          </div>
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-3 text-xs font-bold">
                <i className="fas fa-check-circle text-emerald-400"></i> {isTrainer ? 'Alunos Ilimitados' : (userRole === 'independent' ? 'Suporte IA 24/7' : 'Treinos Diários')}
             </div>
             <div className="flex items-center gap-3 text-xs font-bold">
                <i className="fas fa-check-circle text-emerald-400"></i> {userRole === 'independent' ? 'Biblioteca Global' : 'Consultoria IA 24h'}
             </div>
             <div className="flex items-center gap-3 text-xs font-bold">
                <i className="fas fa-check-circle text-emerald-400"></i> {isTrainer ? 'Exportação PDF' : 'Gráficos de Performance'}
             </div>
          </div>
        </div>

        {/* Right Side - Action */}
        <div className="flex-1 p-8 md:p-12 bg-slate-50">
          <div className="flex justify-between items-center mb-10">
             <div className="flex gap-2">
                <div className={`w-3 h-3 rounded-full ${step === 'form' ? 'bg-cyan-600' : 'bg-emerald-500'}`}></div>
                <div className={`w-3 h-3 rounded-full ${step === 'payment' ? 'bg-cyan-600' : 'bg-slate-200'}`}></div>
             </div>
             <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Cancelar</button>
          </div>

          {step === 'form' ? (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Plano {getPlanName()}</h3>
              <p className="text-slate-500 text-sm mb-8 font-medium">Confirme seus dados para continuar.</p>
              
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <input 
                  required placeholder="Nome Completo"
                  className="w-full p-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  required type="tel" placeholder="WhatsApp"
                  className="w-full p-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium"
                  value={formData.whatsapp}
                  onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                />
                <input 
                  required type="email" placeholder="E-mail"
                  className="w-full p-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />

                <button 
                  type="submit"
                  className="w-full mt-6 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-600 shadow-xl transition-all"
                >
                  Ir para Pagamento <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Checkout</h3>

              <div className="flex gap-4 mb-8">
                 <button 
                   onClick={() => setPaymentMethod('pix')}
                   className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 ${paymentMethod === 'pix' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-100 bg-white'}`}
                 >
                    <i className="fas fa-qrcode text-xl text-cyan-600"></i>
                    <span className="text-[10px] font-black uppercase">PIX</span>
                 </button>
                 <button 
                   onClick={() => setPaymentMethod('card')}
                   className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-100 bg-white'}`}
                 >
                    <i className="fas fa-credit-card text-xl text-indigo-600"></i>
                    <span className="text-[10px] font-black uppercase">Cartão</span>
                 </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Anual</p>
                    <p className="text-2xl font-black text-slate-900">R$ {getPrice()}</p>
                 </div>
                 <button 
                  onClick={() => onSuccess(formData)}
                  className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-xl"
                 >
                    Assinar Agora
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFlow;
