export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  FRONT_DESK = 'Front Desk',
  HOUSEKEEPING = 'Housekeeping',
  MAINTENANCE = 'Maintenance',
  ACCOUNTANT = 'Accountant',
  RESTAURANT = 'Restaurant',
  RECEPTIONIST = 'Receptionist',
  BAR_RECEPTIONIST = 'Bar Receptionist'
}

export enum RoomStatus {
  CLEAN = 'Clean',
  DIRTY = 'Dirty',
  INSPECT = 'Inspect',
  OOO = 'Out of Order' // Out of Order
}

export enum ReservationStatus {
  CONFIRMED = 'Confirmed',
  CHECKED_IN = 'Checked In',
  CHECKED_OUT = 'Checked Out',
  CANCELLED = 'Cancelled'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Staff {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'Standard' | 'Deluxe' | 'Suite' | 'Villa';
  status: RoomStatus;
  price: number;
  assignedStaffId?: string; // ID of the housekeeper
}

export interface Reservation {
  id: string;
  guestName: string;
  roomId: string;
  checkIn: string; // ISO Date
  checkOut: string; // ISO Date
  status: ReservationStatus;
  totalAmount: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'charge' | 'payment';
  category: 'Room' | 'Restaurant' | 'Service' | 'Tax';
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Food' | 'Beverage' | 'Alcohol';
  price: number;
  image: string;
}

export interface MaintenanceTicket {
  id: string;
  location: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedTo?: string; // Staff ID
  createdAt: string; // ISO Date
}

// -- New Types for Expanded Sitemap --

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idType: string;
  idNumber: string;
  company?: string;
}

export interface Company {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  rateCode: string;
  creditLimit: number; // Added credit limit
}

export interface Invoice {
  id: string;
  number: string;
  guestName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface RestaurantTable {
  id: string;
  number: number;
  seats: number;
  status: 'Available' | 'Occupied' | 'Reserved';
  x: number; // For map positioning
  y: number;
}