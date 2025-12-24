// Mock data for parking lots
export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  distance: string;
  pricePerHour: number;
  availability: boolean;
  totalSlots: number;
  availableSlots: number;
  vehicleTypes: ('car' | 'bike')[];
  amenities: string[];
  images: string[];
  rating: number;
  reviews: number;
  openTime: string;
  closeTime: string;
}

export interface Vehicle {
  id: string;
  type: 'car' | 'bike';
  number: string;
  nickname?: string;
}

export interface Booking {
  id: string;
  lotId: string;
  lot: ParkingLot;
  vehicleId: string;
  vehicle: Vehicle;
  startTime: Date;
  endTime: Date;
  status: 'CREATED' | 'PAID' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
  amount: number;
  qrToken: string;
  checkedInAt?: Date;
  checkedOutAt?: Date;
  cancelledAt?: Date;
  overstayAmount?: number;
  refundStatus?: 'INITIATED' | 'COMPLETED';
  refundAmount?: number;
}

export interface User {
  mobile: string;
  vehicles: Vehicle[];
  bookings: Booking[];
}

export const mockParkingLots: ParkingLot[] = [
  {
    id: 'LOT1',
    name: 'City Center Parking',
    address: '123 MG Road, Central Business District',
    distance: '300m',
    pricePerHour: 40,
    availability: true,
    totalSlots: 100,
    availableSlots: 23,
    vehicleTypes: ['car', 'bike'],
    amenities: ['CCTV', 'Covered', '24/7 Security', 'EV Charging'],
    images: [],
    rating: 4.5,
    reviews: 234,
    openTime: '06:00',
    closeTime: '23:00',
  },
  {
    id: 'LOT2',
    name: 'Mall Parking Complex',
    address: '456 Brigade Road, Shopping District',
    distance: '600m',
    pricePerHour: 50,
    availability: true,
    totalSlots: 200,
    availableSlots: 87,
    vehicleTypes: ['car', 'bike'],
    amenities: ['CCTV', 'Covered', 'Valet', 'EV Charging', 'Car Wash'],
    images: [],
    rating: 4.8,
    reviews: 567,
    openTime: '08:00',
    closeTime: '22:00',
  },
  {
    id: 'LOT3',
    name: 'Metro Station Parking',
    address: '789 Station Road, Near Metro Exit 2',
    distance: '150m',
    pricePerHour: 25,
    availability: true,
    totalSlots: 50,
    availableSlots: 12,
    vehicleTypes: ['bike'],
    amenities: ['CCTV', 'Covered'],
    images: [],
    rating: 4.2,
    reviews: 189,
    openTime: '05:00',
    closeTime: '00:00',
  },
  {
    id: 'LOT4',
    name: 'Tech Park Parking',
    address: '321 IT Corridor, Whitefield',
    distance: '1.2km',
    pricePerHour: 35,
    availability: true,
    totalSlots: 500,
    availableSlots: 156,
    vehicleTypes: ['car', 'bike'],
    amenities: ['CCTV', 'Covered', '24/7 Security', 'EV Charging', 'Restrooms'],
    images: [],
    rating: 4.6,
    reviews: 892,
    openTime: '00:00',
    closeTime: '23:59',
  },
  {
    id: 'LOT5',
    name: 'Hospital Parking Zone',
    address: '555 Health Avenue, Medical District',
    distance: '400m',
    pricePerHour: 30,
    availability: false,
    totalSlots: 80,
    availableSlots: 0,
    vehicleTypes: ['car', 'bike'],
    amenities: ['CCTV', 'Covered', 'Wheelchair Access'],
    images: [],
    rating: 4.0,
    reviews: 156,
    openTime: '00:00',
    closeTime: '23:59',
  },
];

export const generateBookingId = (): string => {
  const prefix = 'PB';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export const generateQRToken = (): string => {
  return `QR${Date.now().toString(36)}${Math.random().toString(36).substring(2, 10)}`.toUpperCase();
};

export const calculateParkingAmount = (lot: ParkingLot, startTime: Date, endTime: Date): number => {
  const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
  return hours * lot.pricePerHour;
};
