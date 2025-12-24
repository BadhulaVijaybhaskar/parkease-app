export interface ParkingSlot {
  id: string;
  label: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'BLOCKED' | 'HELD';
  row: string;
  position: number;
}

export const mockSlots: ParkingSlot[] = [
  // Row A
  { id: 'A1', label: 'A1', status: 'AVAILABLE', row: 'A', position: 1 },
  { id: 'A2', label: 'A2', status: 'OCCUPIED', row: 'A', position: 2 },
  { id: 'A3', label: 'A3', status: 'AVAILABLE', row: 'A', position: 3 },
  { id: 'A4', label: 'A4', status: 'AVAILABLE', row: 'A', position: 4 },
  { id: 'A5', label: 'A5', status: 'BLOCKED', row: 'A', position: 5 },
  { id: 'A6', label: 'A6', status: 'AVAILABLE', row: 'A', position: 6 },
  
  // Row B
  { id: 'B1', label: 'B1', status: 'AVAILABLE', row: 'B', position: 1 },
  { id: 'B2', label: 'B2', status: 'AVAILABLE', row: 'B', position: 2 },
  { id: 'B3', label: 'B3', status: 'OCCUPIED', row: 'B', position: 3 },
  { id: 'B4', label: 'B4', status: 'AVAILABLE', row: 'B', position: 4 },
  { id: 'B5', label: 'B5', status: 'AVAILABLE', row: 'B', position: 5 },
  { id: 'B6', label: 'B6', status: 'AVAILABLE', row: 'B', position: 6 },
  
  // Row C
  { id: 'C1', label: 'C1', status: 'AVAILABLE', row: 'C', position: 1 },
  { id: 'C2', label: 'C2', status: 'AVAILABLE', row: 'C', position: 2 },
  { id: 'C3', label: 'C3', status: 'AVAILABLE', row: 'C', position: 3 },
  { id: 'C4', label: 'C4', status: 'BLOCKED', row: 'C', position: 4 },
  { id: 'C5', label: 'C5', status: 'AVAILABLE', row: 'C', position: 5 },
  { id: 'C6', label: 'C6', status: 'OCCUPIED', row: 'C', position: 6 },
];

export const ENABLE_SLOT_SELECTION = true;