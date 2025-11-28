import { Room, RoomStatus, UserRole, User, Reservation, ReservationStatus, MenuItem, MaintenanceTicket, Staff, Transaction, Guest, Company, Invoice, Notification, ActivityLog, RestaurantTable } from './types';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Admin', email: 'alice@ife.com', role: UserRole.SUPER_ADMIN, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { id: '2', name: 'Bob Desk', email: 'bob@ife.com', role: UserRole.FRONT_DESK, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80' },
  { id: '3', name: 'Charlie Clean', email: 'charlie@ife.com', role: UserRole.HOUSEKEEPING, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
  { id: '4', name: 'David Fix', email: 'david@ife.com', role: UserRole.MAINTENANCE, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: '5', name: 'Eva Count', email: 'eva@ife.com', role: UserRole.ACCOUNTANT, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
  { id: '6', name: 'Rachel Reception', email: 'rachel@ife.com', role: UserRole.RECEPTIONIST, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
  { id: '7', name: 'Barry Barman', email: 'barry@ife.com', role: UserRole.BAR_RECEPTIONIST, avatar: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?auto=format&fit=crop&w=150&q=80' },
];

export const MOCK_STAFF: Staff[] = [
  { id: 's1', name: 'Maria Garcia', role: 'Housekeeping', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
  { id: 's2', name: 'David Chen', role: 'Maintenance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 's3', name: 'Sarah Jones', role: 'Housekeeping', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
  { id: 's4', name: 'Mike Ross', role: 'Maintenance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { id: 's5', name: 'Jessica Pearson', role: 'Housekeeping', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
];

export const MOCK_ROOMS: Room[] = [
  { id: '101', number: '101', type: 'Standard', status: RoomStatus.CLEAN, price: 150, assignedStaffId: 's1' },
  { id: '102', number: '102', type: 'Standard', status: RoomStatus.DIRTY, price: 150, assignedStaffId: 's1' },
  { id: '103', number: '103', type: 'Deluxe', status: RoomStatus.CLEAN, price: 250, assignedStaffId: 's3' },
  { id: '104', number: '104', type: 'Deluxe', status: RoomStatus.INSPECT, price: 250, assignedStaffId: 's3' },
  { id: '201', number: '201', type: 'Suite', status: RoomStatus.CLEAN, price: 400, assignedStaffId: 's5' },
  { id: '202', number: '202', type: 'Suite', status: RoomStatus.OOO, price: 400 },
  { id: '301', number: '301', type: 'Villa', status: RoomStatus.CLEAN, price: 800, assignedStaffId: 's5' },
  { id: '302', number: '302', type: 'Villa', status: RoomStatus.DIRTY, price: 800, assignedStaffId: 's1' },
];

export const MOCK_RESERVATIONS: Reservation[] = [
  { id: 'r1', guestName: 'John Doe', roomId: '101', checkIn: '2024-05-10', checkOut: '2024-05-15', status: ReservationStatus.CHECKED_IN, totalAmount: 750 },
  { id: 'r2', guestName: 'Jane Smith', roomId: '201', checkIn: '2024-05-12', checkOut: '2024-05-14', status: ReservationStatus.CONFIRMED, totalAmount: 800 },
  { id: 'r3', guestName: 'Sam Wilson', roomId: '103', checkIn: '2024-05-09', checkOut: '2024-05-11', status: ReservationStatus.CHECKED_OUT, totalAmount: 500 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2024-05-10', description: 'Room Charge - Night 1', amount: 150.00, type: 'charge', category: 'Room' },
  { id: 't2', date: '2024-05-10', description: 'Room Service - Dinner', amount: 45.50, type: 'charge', category: 'Service' },
  { id: 't3', date: '2024-05-11', description: 'Pool Bar', amount: 22.00, type: 'charge', category: 'Restaurant' },
  { id: 't4', date: '2024-05-11', description: 'Payment - Deposit', amount: -200.00, type: 'payment', category: 'Room' },
  { id: 't5', date: '2024-05-11', description: 'Room Charge - Night 2', amount: 150.00, type: 'charge', category: 'Room' },
];

export const POS_MENU: MenuItem[] = [
  { id: 'm1', name: 'Jollof Rice & Chicken', category: 'Food', price: 25, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f1a?auto=format&fit=crop&w=200&q=80' },
  { id: 'm2', name: 'Club Sandwich', category: 'Food', price: 18, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=200&q=80' },
  { id: 'm3', name: 'Fresh Juice', category: 'Beverage', price: 8, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=200&q=80' },
  { id: 'm4', name: 'Signature Cocktail', category: 'Alcohol', price: 15, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=200&q=80' },
  { id: 'm5', name: 'Grilled Fish', category: 'Food', price: 35, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=200&q=80' },
];

export const MOCK_TICKETS: MaintenanceTicket[] = [
  { id: 't1', location: 'Room 202', description: 'AC unit leaking water onto the carpet', priority: 'High', status: 'Open', assignedTo: 's2', createdAt: '2024-05-12T09:00:00' },
  { id: 't2', location: 'Pool Bar', description: 'Light bulb flickering above the counter', priority: 'Low', status: 'Resolved', assignedTo: 's4', createdAt: '2024-05-10T14:30:00' },
  { id: 't3', location: 'Lobby', description: 'Automatic door stuck halfway', priority: 'Critical', status: 'In Progress', assignedTo: 's4', createdAt: '2024-05-12T08:15:00' },
  { id: 't4', location: 'Room 305', description: 'Shower drain clogged', priority: 'Medium', status: 'Open', createdAt: '2024-05-12T10:45:00' },
  { id: 't5', location: 'Kitchen', description: 'Oven temperature sensor error', priority: 'High', status: 'In Progress', assignedTo: 's2', createdAt: '2024-05-11T16:20:00' },
];

export const MOCK_GUESTS: Guest[] = [
  { id: 'g1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+1234567890', idType: 'Passport', idNumber: 'A1234567' },
  { id: 'g2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '+0987654321', idType: 'Driver License', idNumber: 'B7654321', company: 'Acme Corp' },
];

export const MOCK_COMPANIES: Company[] = [
  { id: 'c1', name: 'Acme Corp', contactPerson: 'Wile E. Coyote', email: 'contact@acme.com', rateCode: 'CORP_A', creditLimit: 5000 },
  { id: 'c2', name: 'Wayne Enterprises', contactPerson: 'Lucius Fox', email: 'l.fox@wayne.com', rateCode: 'VIP_W', creditLimit: 10000 },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv1', number: 'INV-2024-001', guestName: 'John Doe', date: '2024-05-15', amount: 750.00, status: 'Paid' },
  { id: 'inv2', number: 'INV-2024-002', guestName: 'Sam Wilson', date: '2024-05-11', amount: 500.00, status: 'Paid' },
  { id: 'inv3', number: 'INV-2024-003', guestName: 'Jane Smith', date: '2024-05-16', amount: 800.00, status: 'Unpaid' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New Reservation', message: 'Booking received for Room 301', time: '5 mins ago', read: false, type: 'success' },
  { id: 'n2', title: 'Maintenance Alert', message: 'Critical issue in Lobby AC', time: '1 hour ago', read: false, type: 'alert' },
  { id: 'n3', title: 'Shift Change', message: 'Housekeeping shift handover pending', time: '2 hours ago', read: true, type: 'info' },
];

export const MOCK_LOGS: ActivityLog[] = [
  { id: 'l1', user: 'Alice Admin', action: 'Created User', target: 'Bob Desk', timestamp: '2024-05-12 10:00 AM' },
  { id: 'l2', user: 'Bob Desk', action: 'Checked In', target: 'John Doe', timestamp: '2024-05-12 12:30 PM' },
  { id: 'l3', user: 'David Fix', action: 'Resolved Ticket', target: 'T-102', timestamp: '2024-05-12 02:15 PM' },
];

export const POS_TABLES: RestaurantTable[] = [
  { id: 't1', number: 1, seats: 2, status: 'Occupied', x: 20, y: 20 },
  { id: 't2', number: 2, seats: 4, status: 'Available', x: 120, y: 20 },
  { id: 't3', number: 3, seats: 4, status: 'Reserved', x: 20, y: 120 },
  { id: 't4', number: 4, seats: 6, status: 'Available', x: 120, y: 120 },
  { id: 't5', number: 5, seats: 8, status: 'Available', x: 220, y: 70 },
];