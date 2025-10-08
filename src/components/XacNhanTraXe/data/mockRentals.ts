import type { Rental } from '../types/Vehicle';

export const mockRentals: Rental[] = [
  {
    id: 'R001',
    vehicle: {
      id: '1',
      licensePlate: '29A-12345',
      model: 'VF7',
      brand: 'VinFast',
      status: 'returned',
      handoverInfo: {
        images: ['/Xe/download.png'],
        battery: 85, // % pin điện
        mileage: 15200,
        handoverDate: '2025-09-25T08:30:00Z',
        notes: 'Xe điện VF7 màu đen trong tình trạng tốt khi bàn giao, pin đầy 85%'
      },
      returnInfo: {
        images: ['/Xe/download (1).png'], // Ảnh khác khi trả xe
        battery: 45, // % pin điện còn lại
        mileage: 15450,
        returnDate: '2025-09-27T16:30:00Z',
        condition: {
          exterior: 'minor_damage',
          battery: 'low',
          mileage: 'normal',
          overall: 'needs_maintenance'
        },
        additionalFees: [
          {
            id: 'F001',
            type: 'damage',
            amount: 200000,
            description: 'Trầy xước nhỏ ở thân xe'
          },
          {
            id: 'F002',
            type: 'cleaning',
            amount: 50000,
            description: 'Vệ sinh xe sau khi sử dụng'
          }
        ],
        notes: 'Xe điện có trầy xước nhỏ, pin còn 45%, cần vệ sinh',
        staffId: 'STAFF_001'
      }
    },
    renterInfo: {
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      idCard: '123456789'
    },
    rentalInfo: {
      startDate: '2025-09-25T08:30:00Z',
      endDate: '2025-09-27T16:30:00Z',
      dailyRate: 150000,
      deposit: 2000000,
      totalDays: 3
    },
    status: 'pending_payment',
    costBreakdown: {
      baseCost: 450000, // 3 days * 150,000
      additionalFees: [
        {
          id: 'F001',
          type: 'damage',
          amount: 200000,
          description: 'Trầy xước nhỏ ở thân xe'
        },
        {
          id: 'F002',
          type: 'cleaning',
          amount: 50000,
          description: 'Vệ sinh xe sau khi sử dụng'
        }
      ],
      deposit: 2000000,
      totalAdditionalFees: 250000,
      finalAmount: -1300000 // 450000 + 250000 - 2000000 = -1300000 (được hoàn lại)
    }
  },
  {
    id: 'R002',
    vehicle: {
      id: '2',
      licensePlate: '29B-67890',
      model: 'VF3',
      brand: 'VinFast',
      status: 'returned',
      handoverInfo: {
        images: ['/Xe/download (2).png'],
        battery: 92, // % pin điện
        mileage: 8500,
        handoverDate: '2025-09-26T14:15:00Z',
        notes: 'Xe điện VF3 mới bảo dưỡng, pin đầy 92%'
      },
      returnInfo: {
        images: ['/Xe/download (3).png'], // Ảnh khác khi trả xe
        battery: 20, // % pin điện còn lại
        mileage: 8750,
        returnDate: '2025-09-27T18:00:00Z',
        condition: {
          exterior: 'major_damage',
          battery: 'very_low',
          mileage: 'high',
          overall: 'damaged'
        },
        additionalFees: [
          {
            id: 'F003',
            type: 'damage',
            amount: 1500000,
            description: 'Hư hỏng nặng - thay gương, sửa chữa thân xe'
          },
          {
            id: 'F004',
            type: 'other',
            amount: 80000,
            description: 'Phí sạc pin khẩn cấp (pin chỉ còn 20%)'
          }
        ],
        notes: 'Xe điện bị hư hỏng nặng, pin gần hết, cần sửa chữa lớn',
        staffId: 'STAFF_002'
      }
    },
    renterInfo: {
      name: 'Trần Thị B',
      phone: '0987654321',
      idCard: '987654321'
    },
    rentalInfo: {
      startDate: '2025-09-26T14:15:00Z',
      endDate: '2025-09-27T18:00:00Z',
      dailyRate: 150000,
      deposit: 2000000,
      totalDays: 2
    },
    status: 'pending_payment',
    costBreakdown: {
      baseCost: 300000, // 2 days * 150,000
      additionalFees: [
        {
          id: 'F003',
          type: 'damage',
          amount: 1500000,
          description: 'Hư hỏng nặng - thay gương, sửa chữa thân xe'
        },
        {
          id: 'F004',
          type: 'fuel',
          amount: 80000,
          description: 'Tiền xăng bổ sung'
        }
      ],
      deposit: 2000000,
      totalAdditionalFees: 1580000,
      finalAmount: -120000 // 300000 + 1580000 - 2000000 = -120000 (được hoàn lại ít)
    }
  }
];