import type { Vehicle } from '../types/Vehicle';

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    licensePlate: '29A-12345',
    model: 'VF7',
    brand: 'VinFast',
    status: 'waiting_return',
    handoverInfo: {
      images: ['/Xe/download.png'],
      battery: 85, // % pin điện
      mileage: 15200, // Km đã đi
      handoverDate: '2025-09-25T08:30:00Z',
      notes: 'Xe điện VF7 màu đen trong tình trạng tốt khi bàn giao, pin đầy 85%'
    }
  },
  {
    id: '2',
    licensePlate: '29B-67890',
    model: 'VF3',
    brand: 'VinFast',
    status: 'waiting_return',
    handoverInfo: {
      images: ['/Xe/download (2).png'],
      battery: 92, // % pin điện
      mileage: 8500,
      handoverDate: '2025-09-26T14:15:00Z',
      notes: 'Xe điện VF3 mới bảo dưỡng, pin đầy 92%'
    }
  },
  {
    id: '3',
    licensePlate: '29C-11111',
    model: 'VF3',
    brand: 'VinFast',
    status: 'waiting_return',
    handoverInfo: {
      images: ['/Xe/download (4).png'],
      battery: 78, // % pin điện
      mileage: 22300,
      handoverDate: '2025-09-24T16:45:00Z',
      notes: 'Xe điện VF3, pin còn 78%'
    }
  }
];