
import React, { useState } from 'react';

interface SubscriptionFlowProps {
  onSuccess: (userData: any) => void;
  onCancel: () => void;
}

const SubscriptionFlow: React.FC<SubscriptionFlowProps> = ({ onSuccess, onCancel }) => {
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

  const handleFinish = () => {
    onSuccess(formData);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/50 flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side - Promo */}
        <div className="md:w-1/3 aqua-gradient p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10">
            <i className="fas fa-crown text-4xl text-amber-400 mb-6 drop-shadow-lg"></i>
            <h2 className="text-3xl font-black leading-tight mb-4">AquaPro <span className="text-cyan-300">Premium</span></h2>
            <p className="text-sm font-medium opacity-80 leading-relaxed">Libere gestão ilimitada de alunos, relatórios de IA avançados e customização total da biblioteca.</p>
          </div>
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-3 text-xs font-bold">
                <i className="fas fa-check-circle text-emerald-400"></i> Alunos Ilimitados
             </div>
             <div className="flex items-center gap-3 text-xs font-bold">
                <i className="fas fa-check-circle text-emerald-400"></i> Consultoria IA 24h
             </div>
             <div className="flex items-center gap-3 text-xs font-bold">
                <i className="fas fa-check-circle text-emerald-400"></i> Exportação em PDF
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
              <h3 className="text-2xl font-black text-slate-900 mb-2">Ficha de Assinatura</h3>
              <p className="text-slate-500 text-sm mb-8 font-medium">Preencha seus dados para começar a evolução.</p>
              
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    required type="text" placeholder="Seu nome"
                    className="w-full p-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
                  <input 
                    required type="tel" placeholder="(00) 00000-0000"
                    className="w-full p-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                    value={formData.whatsapp}
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Profissional</label>
                  <input 
                    required type="email" placeholder="seu@email.com"
                    className="w-full p-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full mt-6 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-600 shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  Pagar Agora <i className="fas fa-arrow-right"></i>
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Checkout de Pagamento</h3>
              <p className="text-slate-500 text-sm mb-8 font-medium">Escolha como prefere investir no seu negócio.</p>

              <div className="flex gap-4 mb-8">
                 <button 
                   onClick={() => setPaymentMethod('pix')}
                   className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'pix' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-100 bg-white opacity-60'}`}
                 >
                    <i className="fas fa-qrcode text-xl text-cyan-600"></i>
                    <span className="text-[10px] font-black uppercase">PIX</span>
                 </button>
                 <button 
                   onClick={() => setPaymentMethod('card')}
                   className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-100 bg-white opacity-60'}`}
                 >
                    <i className="fas fa-credit-card text-xl text-indigo-600"></i>
                    <span className="text-[10px] font-black uppercase">Cartão</span>
                 </button>
              </div>

              {paymentMethod === 'pix' ? (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center space-y-4">
                   <div className="p-4 bg-slate-50 rounded-2xl">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AquaProPremiumPayment" alt="PIX QR" className="w-32 h-32" />
                   </div>
                   <div className="w-full">
                      <p className="text-xs font-bold text-slate-500 mb-2">Escaneie o código acima ou copie o link</p>
                      <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between gap-3 overflow-hidden">
                         <span className="text-[10px] font-medium text-slate-400 truncate">00020101021226850014br.gov.bcb.pix</span>
                         <button className="bg-cyan-100 text-cyan-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase">Copiar</button>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <input placeholder="Número do Cartão" className="w-full p-4 rounded-2xl bg-white border border-slate-200 outline-none text-sm font-medium" />
                  <div className="flex gap-4">
                    <input placeholder="MM/AA" className="flex-1 p-4 rounded-2xl bg-white border border-slate-200 outline-none text-sm font-medium" />
                    <input placeholder="CVV" className="flex-1 p-4 rounded-2xl bg-white border border-slate-200 outline-none text-sm font-medium" />
                  </div>
                  <input placeholder="Nome no Cartão" className="w-full p-4 rounded-2xl bg-white border border-slate-200 outline-none text-sm font-medium" />
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Anual</p>
                    <p className="text-2xl font-black text-slate-900">R$ 297,00</p>
                 </div>
                 <button 
                  onClick={handleFinish}
                  className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-xl transition-all"
                 >
                    Confirmar Pagamento
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
