
import { Service, Product, ProfessionalSettings } from './types';

export const ATELIE_ADDRESS = "Rua das Rosas, 450 - Jardim das Damas, São Paulo - SP";
export const MAPS_URL = "https://goo.gl/maps/placeholder";

export const SERVICES: Service[] = [
  { id: '1', category: 'ALONGAMENTO', name: 'Gel no molde F1', price: 151.00, durationMinutes: 150 },
  { id: '2', category: 'ALONGAMENTO', name: 'Soft gel', price: 107.00, durationMinutes: 120 },
  { id: '3', category: 'ALONGAMENTO', name: 'Banho de Gel', price: 77.00, durationMinutes: 90 },
  { id: '4', category: 'ALONGAMENTO', name: 'Esmaltação em gel', price: 70.00, durationMinutes: 60 },
  { id: '5', category: 'ALONGAMENTO', name: 'Encapsulada (casal)', price: 6.00, durationMinutes: 20 },
  { id: '6', category: 'ALONGAMENTO', name: 'Francesinha', price: 6.00, durationMinutes: 20 },
  { id: '7', category: 'MANUTENÇÃO', name: 'Gel no molde F1', price: 90.00, durationMinutes: 120 },
  { id: '8', category: 'MANUTENÇÃO', name: 'Softgel', price: 77.00, durationMinutes: 90 },
  { id: '9', category: 'REMOÇÃO', name: 'Remoção Completa', price: 30.00, durationMinutes: 40 },
  { id: '10', category: 'PÉ E MÃO', name: 'Pé e Mão (Combo)', price: 52.00, durationMinutes: 90 },
  { id: '11', category: 'PÉ E MÃO', name: 'Mão', price: 25.00, durationMinutes: 45 },
  { id: '12', category: 'PÉ E MÃO', name: 'Pé', price: 34.00, durationMinutes: 45 },
  { id: '13', category: 'PÉ E MÃO', name: 'Esmaltação', price: 17.00, durationMinutes: 30 },
  { id: '14', category: 'SOBRANCELHAS', name: 'Argiloterapia', price: 7.00, durationMinutes: 15 },
  { id: '15', category: 'SOBRANCELHAS', name: 'Design Simples', price: 25.00, durationMinutes: 30 },
  { id: '16', category: 'SOBRANCELHAS', name: 'Design com Henna', price: 34.00, durationMinutes: 45 },
];

export const PROFESSIONALS: ProfessionalSettings[] = [
  {
    id: 'viviane',
    name: 'Viviane',
    whatsapp: '5511999999999',
    instagram: 'viviane_nails',
    serviceIds: SERVICES.map(s => s.id),
    availability: {
      daysOfWeek: [1, 2, 3, 4, 5, 6],
      startTime: '08:00',
      endTime: '18:00',
      slotDuration: 60
    }
  },
  {
    id: 'pamela',
    name: 'Pâmela',
    whatsapp: '5511888888888',
    instagram: 'pamela_designer',
    serviceIds: SERVICES.map(s => s.id),
    availability: {
      daysOfWeek: [2, 3, 4, 5, 6],
      startTime: '09:00',
      endTime: '19:00',
      slotDuration: 60
    }
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Gel F1 Clear', type: 'Gel', quantity: 5, minQuantity: 2, expiryDate: '2025-12-31' },
  { id: 'p2', name: 'Henna Castanho Médio', type: 'Henna', quantity: 3, minQuantity: 1, expiryDate: '2025-06-15' },
];
