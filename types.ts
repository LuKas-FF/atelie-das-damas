
export enum AppointmentStatus {
  PENDING = 'PENDENTE',
  CONFIRMED = 'CONFIRMADO',
  CANCELLED = 'CANCELADO',
  COMPLETED = 'CONCLUÍDO'
}

export interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
  durationMinutes: number;
  description?: string;
}

export interface Availability {
  daysOfWeek: number[]; // 0 (Dom) a 6 (Sab)
  startTime: string; // "09:00"
  endTime: string; // "19:00"
  slotDuration: number; // minutos entre horários
}

export interface ProfessionalSettings {
  id: string;
  name: string;
  whatsapp: string;
  instagram: string;
  availability: Availability;
  serviceIds: string[]; // IDs dos serviços que a profissional realiza
}

export interface IntegrationConfig {
  whatsappApiKey: string;
  whatsappInstanceId: string;
  autoReminders: boolean;
  googleSheetId: string;
  googleScriptUrl: string; // URL do Google Apps Script (Banco de Dados)
  address: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientWhatsApp: string;
  professionalId: string;
  serviceId: string;
  date: string; // ISO String
  status: AppointmentStatus;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  quantity: number;
  minQuantity: number;
  expiryDate: string; // ISO String
}
