
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Appointment, AppointmentStatus, Product, Service, ProfessionalSettings, IntegrationConfig } from './types';
import { SERVICES as INITIAL_SERVICES, INITIAL_PRODUCTS, PROFESSIONALS, ATELIE_ADDRESS } from './constants';
import { 
  Plus, 
  CheckCircle, 
  LogOut, 
  Trash2, 
  Settings, 
  Edit, 
  Save, 
  X, 
  CloudUpload, 
  RefreshCw, 
  Copy, 
  Info,
  Check,
  Link as LinkIcon,
  AlertTriangle,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

// --- COMPONENTE DE AGENDAMENTO DO CLIENTE ---
const ClientBooking: React.FC<{ 
  onBook: (a: Appointment) => void,
  appointments: Appointment[],
  professionalSettings: ProfessionalSettings[],
  currentAddress: string,
  services: Service[]
}> = ({ onBook, appointments, professionalSettings, currentAddress, services }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    professionalId: '',
    category: '',
    serviceId: '',
    date: '',
    time: ''
  });

  const selectedProfessional = professionalSettings.find(p => p.id === formData.professionalId);
  
  const categories = useMemo(() => {
    if (!selectedProfessional) return [];
    const proServices = services.filter(s => selectedProfessional.serviceIds.includes(s.id));
    return Array.from(new Set(proServices.map(s => s.category)));
  }, [selectedProfessional, services]);

  const filteredServices = useMemo(() => {
    if (!selectedProfessional || !formData.category) return [];
    return services.filter(s => s.category === formData.category && selectedProfessional.serviceIds.includes(s.id));
  }, [selectedProfessional, formData.category, services]);

  const availableTimes = useMemo(() => {
    if (!selectedProfessional || !formData.date) return [];
    const selectedDate = new Date(formData.date + 'T00:00:00');
    if (!selectedProfessional.availability.daysOfWeek.includes(selectedDate.getDay())) return [];

    const times: string[] = [];
    const [startH, startM] = selectedProfessional.availability.startTime.split(':').map(Number);
    const [endH, endM] = selectedProfessional.availability.endTime.split(':').map(Number);
    let current = new Date();
    current.setHours(startH, startM, 0, 0);
    const end = new Date();
    end.setHours(endH, endM, 0, 0);

    while (current < end) {
      const timeStr = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const isOccupied = appointments.some(app => {
        const appDate = new Date(app.date);
        return app.professionalId === formData.professionalId && 
               appDate.toISOString().split('T')[0] === formData.date &&
               appDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) === timeStr &&
               app.status !== AppointmentStatus.CANCELLED;
      });
      if (!isOccupied) times.push(timeStr);
      current.setMinutes(current.getMinutes() + selectedProfessional.availability.slotDuration);
    }
    return times;
  }, [selectedProfessional, formData.date, formData.professionalId, appointments]);

  const confirmBooking = async () => {
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: formData.name,
      clientWhatsApp: formData.whatsapp,
      professionalId: formData.professionalId,
      serviceId: formData.serviceId,
      date: new Date(`${formData.date}T${formData.time}`).toISOString(),
      status: AppointmentStatus.PENDING
    };
    onBook(newAppointment);
    setStep(6);
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-rose-50 transition-all max-w-md mx-auto">
      {step < 6 && (
        <div className="mb-8">
           <h2 className="text-2xl font-serif italic text-rose-800 text-center">Agende seu horário</h2>
           <div className="flex justify-center gap-1 mt-2">
             {[1,2,3,4,5].map(i => (
               <div key={i} className={`h-1 rounded-full transition-all ${step >= i ? 'w-4 bg-rose-400' : 'w-2 bg-rose-100'}`}></div>
             ))}
           </div>
        </div>
      )}
      
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in zoom-in">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-rose-300 uppercase ml-1">Seu Nome Completo</label>
            <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 ring-rose-100" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-rose-300 uppercase ml-1">WhatsApp com DDD</label>
            <input type="tel" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 ring-rose-100" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
          </div>
          <button disabled={!formData.name || !formData.whatsapp} onClick={() => setStep(2)} className="w-full py-5 bg-rose-500 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-600 disabled:opacity-30 shadow-lg mt-4">Continuar</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in slide-in-from-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center font-bold">Com quem deseja agendar?</p>
          <div className="grid grid-cols-1 gap-3">
            {professionalSettings.map(pro => (
              <button key={pro.id} onClick={() => { setFormData({...formData, professionalId: pro.id}); setStep(3); }} className="p-5 rounded-2xl border-2 bg-white border-gray-100 hover:border-rose-400 hover:bg-rose-50 transition-all flex items-center justify-between group">
                <span className="font-serif font-bold text-rose-800 text-lg">{pro.name}</span>
                <Check className="text-rose-200 group-hover:text-rose-500" size={20}/>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="w-full text-[10px] text-gray-300 uppercase font-bold py-4">Voltar</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3 animate-in slide-in-from-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center font-bold">O que vamos fazer hoje?</p>
          {categories.map(cat => (
            <button key={cat} onClick={() => { setFormData({...formData, category: cat}); setStep(4); }} className="w-full p-5 bg-rose-50 text-rose-800 rounded-2xl font-bold text-left flex justify-between items-center group active:scale-95 transition-all">
              <span>{cat}</span>
              <Plus size={18} className="text-rose-300" />
            </button>
          ))}
          <button onClick={() => setStep(2)} className="w-full text-[10px] text-gray-300 uppercase font-bold py-4">Voltar</button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3 animate-in slide-in-from-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center font-bold">Selecione o procedimento:</p>
          <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {filteredServices.map(s => (
              <button key={s.id} onClick={() => { setFormData({...formData, serviceId: s.id}); setStep(5); }} className="w-full p-5 rounded-2xl border border-gray-100 bg-white flex justify-between items-center hover:bg-rose-50 hover:border-rose-200 transition-all">
                <div className="text-left"><p className="font-bold text-gray-700">{s.name}</p><p className="text-[10px] text-gray-400">{s.durationMinutes} min</p></div>
                <div className="font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-sm">R$ {s.price.toFixed(2)}</div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(3)} className="w-full text-[10px] text-gray-300 uppercase font-bold py-4">Voltar</button>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4 animate-in slide-in-from-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center font-bold">Escolha o melhor dia e hora:</p>
          <input type="date" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 ring-rose-100 font-bold text-rose-800" min={new Date().toISOString().split('T')[0]} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.length > 0 ? availableTimes.map(h => (
              <button key={h} onClick={() => setFormData({...formData, time: h})} className={`py-3 rounded-xl text-[11px] font-bold border transition-all ${formData.time === h ? 'bg-rose-500 text-white border-rose-500 shadow-md' : 'bg-white text-gray-400 border-gray-100'}`}>{h}</button>
            )) : (
              <div className="col-span-3 py-4 text-center text-[10px] text-gray-400 uppercase italic">Nenhum horário disponível neste dia</div>
            )}
          </div>
          
          <button disabled={!formData.date || !formData.time} onClick={confirmBooking} className="w-full py-5 bg-rose-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl mt-4 active:scale-95 transition-all">Confirmar Agendamento</button>
          <button onClick={() => setStep(4)} className="w-full text-[10px] text-gray-300 uppercase font-bold py-4">Voltar</button>
        </div>
      )}

      {step === 6 && (
        <div className="text-center space-y-6 py-8 animate-in zoom-in">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle size={48} /></div>
          <div>
            <h3 className="text-3xl font-serif italic text-rose-900">Reservado!</h3>
            <p className="text-gray-500 text-sm mt-3 px-4">Seu agendamento foi salvo com sucesso. Esperamos por você!</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl text-[11px] text-gray-400 text-left space-y-2 border border-gray-100">
             <p>📍 <b>Local:</b> {currentAddress}</p>
             <p>📅 <b>Data:</b> {new Date(formData.date + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
             <p>⏰ <b>Hora:</b> {formData.time}</p>
          </div>
          <button onClick={() => window.location.reload()} className="w-full py-5 bg-rose-500 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg">Entendi</button>
        </div>
      )}
    </div>
  );
};

// --- PAINEL ADMINISTRATIVO ---
const AdminView: React.FC<{ 
  appointments: Appointment[], 
  onUpdateStatus: (id: string, s: AppointmentStatus) => void,
  onLogout: () => void,
  loggedProfessionalId: string,
  professionalSettings: ProfessionalSettings[],
  onUpdateSettings: (s: ProfessionalSettings[]) => void,
  config: IntegrationConfig,
  onUpdateConfig: (c: IntegrationConfig) => void,
  services: Service[],
  onUpdateServices: (s: Service[]) => void,
  isSyncing: boolean,
  onSync: () => void
}> = ({ appointments, onUpdateStatus, onLogout, loggedProfessionalId, professionalSettings, config, onUpdateConfig, services, onUpdateServices, isSyncing, onSync }) => {
  const [activeTab, setActiveTab] = useState<'ti' | 'agenda' | 'servicos'>('ti');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({ category: 'UNHAS', name: '', price: 0, durationMinutes: 60 });

  const upcoming = appointments.filter(a => a.status === AppointmentStatus.PENDING);

  const handleAddService = () => {
    if (!newService.name) return;
    const s: Service = {
      id: Math.random().toString(36).substr(2, 9),
      name: newService.name!,
      category: newService.category || 'GERAL',
      price: Number(newService.price) || 0,
      durationMinutes: Number(newService.durationMinutes) || 60
    };
    onUpdateServices([...services, s]);
    setIsAddingService(false);
    setNewService({ category: 'UNHAS', name: '', price: 0, durationMinutes: 60 });
  };

  const handleSaveEdit = () => {
    if (!editingService) return;
    onUpdateServices(services.map(s => s.id === editingService.id ? editingService : s));
    setEditingService(null);
  };

  const copyScript = () => {
    const code = `
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Pega a primeira aba ou cria uma
    var sheet = ss.getSheets()[0] || ss.insertSheet("Agendamentos");
    
    if (data.action === "sync") {
      sheet.clear();
      sheet.appendRow(["DATA E HORA", "NOME DA CLIENTE", "WHATSAPP", "PROCEDIMENTO", "STATUS"]);
      sheet.getRange(1, 1, 1, 5).setBackground("#f43f5e").setFontColor("white").setFontWeight("bold");
      
      data.appointments.forEach(function(app) {
        var srvName = "Serviço";
        data.services.forEach(function(s) { if(s.id === app.serviceId) srvName = s.name; });
        var dateFormatted = new Date(app.date).toLocaleString('pt-BR');
        sheet.appendRow([dateFormatted, app.clientName, app.clientWhatsApp, srvName, app.status]);
      });
      sheet.setColumnWidth(1, 180);
      sheet.setColumnWidth(2, 200);
      sheet.setColumnWidth(4, 180);
    }
    return ContentService.createTextOutput("Sucesso").setMimeType(ContentService.MimeType.TEXT);
  } catch(err) {
    return ContentService.createTextOutput("Erro: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}
    `.trim();
    navigator.clipboard.writeText(code);
    alert("Código copiado! Certifique-se de salvar e implantar como 'Qualquer pessoa'.");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif italic text-rose-800">Painel de Controle</h2>
        <button onClick={onLogout} className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm flex items-center gap-2 px-6 uppercase text-[10px] font-bold hover:bg-rose-50 transition-all border border-rose-100">Sair <LogOut size={14}/></button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {['ti', 'agenda', 'servicos'].map((t: any) => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-8 py-4 rounded-2xl text-[11px] font-bold uppercase transition-all flex-shrink-0 border-2 ${activeTab === t ? 'bg-rose-600 text-white border-rose-600 shadow-xl' : 'bg-white text-rose-300 border-rose-50'}`}>
            {t === 'ti' ? 'Sincronizar Planilha' : t === 'agenda' ? 'Lista de Horários' : 'Meus Preços'}
          </button>
        ))}
      </div>

      {activeTab === 'ti' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-emerald-900 text-white p-8 rounded-[3rem] shadow-2xl border-4 border-emerald-800 space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-4 bg-emerald-800 rounded-3xl text-emerald-400"><CloudUpload size={40}/></div>
               <div>
                 <h3 className="font-serif italic text-3xl">Conexão Google Sheets</h3>
                 <p className="text-emerald-300 text-xs opacity-70">Use a URL que termina em <b>/exec</b></p>
               </div>
            </div>
            
            <div className="space-y-4">
               <div className="bg-emerald-950/50 p-6 rounded-3xl border border-emerald-800 space-y-3">
                  <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2"><LinkIcon size={16}/> Link Correto (o que termina em /exec):</label>
                  <input 
                    type="text" 
                    className="w-full p-5 bg-white text-emerald-950 rounded-2xl text-xs outline-none font-bold shadow-inner" 
                    placeholder="Cole aqui: https://script.google.com/macros/s/.../exec" 
                    value={config.googleScriptUrl} 
                    onChange={e => onUpdateConfig({...config, googleScriptUrl: e.target.value})} 
                  />
                  
                  <div className="bg-emerald-900/50 p-4 rounded-xl border border-emerald-700 space-y-2 mt-4">
                    <p className="text-emerald-400 font-bold text-[10px] uppercase flex items-center gap-2"><ArrowRight size={14}/> Checklist de Sucesso:</p>
                    <div className="text-[10px] text-emerald-200/70 space-y-1">
                      <p>1. Use o link: <b>.../exec</b></p>
                      <p>2. No Google: Implantar > Gerenciar Implantações > Lápis > Versão: <b>Nova Versão</b></p>
                      <p>3. Acesso: <b>Qualquer pessoa (Anyone)</b></p>
                    </div>
                  </div>
               </div>

               <button 
                 onClick={onSync} 
                 disabled={isSyncing || !config.googleScriptUrl} 
                 className={`w-full py-7 rounded-[2rem] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all text-sm border-b-4 ${config.googleScriptUrl ? 'bg-white text-emerald-900 border-emerald-200' : 'bg-emerald-900 text-emerald-800 border-emerald-950 opacity-50'}`}
               >
                 {isSyncing ? <RefreshCw className="animate-spin" size={24}/> : <Check size={24}/>}
                 {isSyncing ? 'Conectando ao Google...' : 'Enviar Dados agora'}
               </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'agenda' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex justify-between items-end">
            <h3 className="font-serif italic text-rose-800 text-xl">Agenda de Hoje</h3>
            <span className="text-[10px] bg-rose-100 text-rose-600 px-3 py-1 rounded-full font-bold uppercase">{upcoming.length} Pendentes</span>
          </div>
          {upcoming.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] text-center text-rose-200 uppercase text-[10px] border-2 border-dashed border-rose-100 flex flex-col items-center gap-4"><CheckCircle size={40} className="opacity-20"/> Nenhum cliente agendado por enquanto</div>
          ) : (
            upcoming.map(app => (
              <div key={app.id} className="bg-white p-6 rounded-3xl shadow-sm border border-rose-50 flex justify-between items-center group hover:shadow-md transition-all">
                <div className="space-y-1">
                  <p className="font-bold text-gray-800 text-xl">{app.clientName}</p>
                  <p className="text-[11px] text-rose-500 font-bold uppercase tracking-wider">{services.find(s => s.id === app.serviceId)?.name}</p>
                  <div className="flex gap-4 mt-2">
                    <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 uppercase tracking-tighter">📅 {new Date(app.date).toLocaleDateString('pt-BR')}</p>
                    <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 uppercase tracking-tighter">⏰ {new Date(app.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <button onClick={() => onUpdateStatus(app.id, AppointmentStatus.COMPLETED)} className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-90"><Check size={24}/></button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'servicos' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <h3 className="font-serif italic text-rose-800 text-xl">Procedimentos e Preços</h3>
            <button onClick={() => setIsAddingService(true)} className="flex items-center gap-2 px-8 py-4 bg-rose-600 text-white rounded-2xl text-[11px] font-bold uppercase shadow-xl hover:bg-rose-700 active:scale-95 transition-all"><Plus size={18}/> Novo Serviço</button>
          </div>

          {(isAddingService || editingService) && (
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-rose-100 space-y-6 animate-in zoom-in max-w-lg mx-auto">
              <div className="flex justify-between items-center border-b pb-4"><h4 className="font-bold text-rose-900 uppercase text-xs tracking-widest">Informações do Procedimento</h4><button onClick={() => { setIsAddingService(false); setEditingService(null); }} className="text-rose-300 hover:text-rose-500 transition-colors"><X size={24}/></button></div>
              <div className="space-y-4">
                <input type="text" placeholder="Nome do Procedimento" className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-gray-100 font-bold outline-none focus:border-rose-400 transition-all shadow-inner" value={editingService ? editingService.name : newService.name} onChange={e => editingService ? setEditingService({...editingService, name: e.target.value}) : setNewService({...newService, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-[9px] font-bold text-gray-400 uppercase ml-2">Preço (R$)</label>
                     <input type="number" placeholder="0.00" className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-gray-100 outline-none focus:border-rose-400" value={editingService ? editingService.price : newService.price} onChange={e => editingService ? setEditingService({...editingService, price: Number(e.target.value)}) : setNewService({...newService, price: Number(e.target.value)})} />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[9px] font-bold text-gray-400 uppercase ml-2">Duração (Minutos)</label>
                     <input type="number" placeholder="60" className="w-full p-5 bg-gray-50 rounded-2xl border-2 border-gray-100 outline-none focus:border-rose-400" value={editingService ? editingService.durationMinutes : newService.durationMinutes} onChange={e => editingService ? setEditingService({...editingService, durationMinutes: Number(e.target.value)}) : setNewService({...newService, durationMinutes: Number(e.target.value)})} />
                   </div>
                </div>
                <button onClick={editingService ? handleSaveEdit : handleAddService} className="w-full py-6 bg-rose-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"><Save size={20}/> Salvar Alterações</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(s => (
              <div key={s.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-rose-300 transition-all">
                <div>
                  <p className="font-bold text-rose-900 text-lg">{s.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">R$ {s.price.toFixed(2)} • {s.durationMinutes} min</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingService(s)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Edit size={18}/></button>
                  <button onClick={() => { if(confirm("Deseja mesmo remover este serviço?")) onUpdateServices(services.filter(srv => srv.id !== s.id)); }} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'client' | 'admin' | 'login'>('client');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionalSettings, setProfessionalSettings] = useState<ProfessionalSettings[]>(PROFESSIONALS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [config, setConfig] = useState<IntegrationConfig>({ googleScriptUrl: '', address: ATELIE_ADDRESS, whatsappApiKey: '', whatsappInstanceId: '', autoReminders: true, googleSheetId: '' });
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loggedProId, setLoggedProId] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const dataKeys = ['ad_apps_v17', 'ad_config_v17', 'ad_pro_settings_v17', 'ad_services_v17'];
    const setters = [setAppointments, setConfig, setProfessionalSettings, setServices];
    dataKeys.forEach((key, i) => {
      const val = localStorage.getItem(key);
      if (val) setters[i](JSON.parse(val));
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('ad_apps_v17', JSON.stringify(appointments));
    localStorage.setItem('ad_config_v17', JSON.stringify(config));
    localStorage.setItem('ad_pro_settings_v17', JSON.stringify(professionalSettings));
    localStorage.setItem('ad_services_v17', JSON.stringify(services));
  }, [appointments, config, professionalSettings, services]);

  const handleSync = async (currentAppointments = appointments, currentServices = services) => {
    if (!config.googleScriptUrl) return;
    setIsSyncing(true);
    try {
      await fetch(config.googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', appointments: currentAppointments, services: currentServices })
      });
      setTimeout(() => alert("Os dados estão sendo enviados! Verifique sua planilha."), 1000);
    } catch (e) {
      console.error("Sync Error:", e);
      alert("Erro na conexão. Verifique o link /exec");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.user === 'damas' && loginForm.pass === 'premium') { setLoggedProId('admin'); setView('admin'); }
    else alert('Acesso Negado.');
  };

  const onBook = (a: Appointment) => {
    const newApps = [a, ...appointments];
    setAppointments(newApps);
    if (config.googleScriptUrl) {
      handleSync(newApps, services);
    }
  };

  return (
    <Layout title={view === 'admin' ? 'Painel Administrativo' : 'Agendamento Online'} isAdmin={view === 'admin'}>
      {view === 'client' && (
        <div className="space-y-12 py-12 animate-in fade-in duration-1000">
          <div className="text-center space-y-6">
            <h2 className="text-5xl font-serif italic text-rose-900 drop-shadow-sm">Ateliê das Damas</h2>
            <div className="flex justify-center items-center gap-4">
              <div className="h-px w-8 bg-rose-200"></div>
              <p className="text-[11px] text-rose-400 uppercase tracking-[0.6em] font-bold">O seu momento de brilhar</p>
              <div className="h-px w-8 bg-rose-200"></div>
            </div>
          </div>
          <ClientBooking appointments={appointments} professionalSettings={professionalSettings} onBook={onBook} currentAddress={config.address} services={services} />
          <button onClick={() => setView('login')} className="w-full text-[10px] text-rose-200 uppercase font-bold tracking-[0.4em] flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-all py-16 group"><Settings size={14} className="group-hover:rotate-90 transition-all duration-700"/> Acesso Administrativo</button>
        </div>
      )}

      {view === 'login' && (
        <div className="max-w-xs mx-auto py-32 animate-in zoom-in duration-500">
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-4 border-rose-50 text-center space-y-10">
             <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600 font-serif italic font-bold text-3xl shadow-inner">AD</div>
             <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <input type="text" className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl outline-none focus:border-rose-400 transition-all font-bold" placeholder="Usuário" value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})}/>
                  <input type="password" className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-3xl outline-none focus:border-rose-400 transition-all font-bold" placeholder="Senha" value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass: e.target.value})}/>
                </div>
                <button className="w-full py-6 bg-rose-600 text-white rounded-3xl font-bold uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Acessar Painel</button>
                <button type="button" onClick={() => setView('client')} className="text-[10px] text-rose-300 uppercase font-bold py-2 hover:text-rose-500 transition-all">Voltar para Início</button>
             </form>
          </div>
        </div>
      )}

      {view === 'admin' && (
        <AdminView 
          appointments={appointments} 
          onUpdateStatus={(id, s) => { 
            const updated = appointments.map(a => a.id === id ? {...a, status: s} : a);
            setAppointments(updated); 
            if(config.googleScriptUrl) handleSync(updated, services); 
          }}
          onLogout={() => setView('client')}
          loggedProfessionalId={loggedProId}
          professionalSettings={professionalSettings}
          onUpdateSettings={setProfessionalSettings}
          config={config}
          onUpdateConfig={setConfig}
          services={services}
          onUpdateServices={setServices}
          isSyncing={isSyncing}
          onSync={() => handleSync(appointments, services)}
        />
      )}
    </Layout>
  );
}
