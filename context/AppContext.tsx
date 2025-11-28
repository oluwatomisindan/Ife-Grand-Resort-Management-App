import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
    MOCK_ROOMS, MOCK_TICKETS, MOCK_INVOICES, MOCK_GUESTS, MOCK_COMPANIES, MOCK_RESERVATIONS, MOCK_STAFF
} from '../constants';
import { 
    Room, MaintenanceTicket, Invoice, Guest, Company, RoomStatus, Reservation, Staff, UserRole
} from '../types';

interface AppContextType {
    rooms: Room[];
    addRoom: (room: Room) => void;
    updateRoom: (room: Room) => void;
    deleteRoom: (id: string) => void;

    tickets: MaintenanceTicket[];
    addTicket: (ticket: MaintenanceTicket) => void;
    updateTicket: (ticket: MaintenanceTicket) => void;

    invoices: Invoice[];
    addInvoice: (invoice: Invoice) => void;

    guests: Guest[];
    addGuest: (guest: Guest) => void;
    updateGuest: (guest: Guest) => void;

    companies: Company[];
    addCompany: (company: Company) => void;
    updateCompany: (company: Company) => void;
    deleteCompany: (id: string) => void;

    reservations: Reservation[];
    addReservation: (reservation: Reservation) => void;
    updateReservation: (reservation: Reservation) => void;

    staff: Staff[];
    addStaff: (staff: Staff) => void;
    updateStaff: (staff: Staff) => void;
    deleteStaff: (id: string) => void;

    // Reporting
    generateReport: (type: string, dateRange: {start: string, end: string}) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
    const [tickets, setTickets] = useState<MaintenanceTicket[]>(MOCK_TICKETS);
    const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
    const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
    const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
    const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
    const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);

    // -- Room Actions --
    const addRoom = (room: Room) => setRooms(prev => [...prev, room]);
    const updateRoom = (room: Room) => setRooms(prev => prev.map(r => r.id === room.id ? room : r));
    const deleteRoom = (id: string) => setRooms(prev => prev.filter(r => r.id !== id));

    // -- Ticket Actions --
    const addTicket = (ticket: MaintenanceTicket) => setTickets(prev => [ticket, ...prev]);
    const updateTicket = (ticket: MaintenanceTicket) => setTickets(prev => prev.map(t => t.id === ticket.id ? ticket : t));

    // -- Invoice Actions --
    const addInvoice = (invoice: Invoice) => setInvoices(prev => [invoice, ...prev]);

    // -- Guest Actions --
    const addGuest = (guest: Guest) => setGuests(prev => [...prev, guest]);
    const updateGuest = (guest: Guest) => setGuests(prev => prev.map(g => g.id === guest.id ? guest : g));

    // -- Company Actions --
    const addCompany = (company: Company) => setCompanies(prev => [...prev, company]);
    const updateCompany = (company: Company) => setCompanies(prev => prev.map(c => c.id === company.id ? company : c));
    const deleteCompany = (id: string) => setCompanies(prev => prev.filter(c => c.id !== id));

    // -- Reservation Actions --
    const addReservation = (res: Reservation) => setReservations(prev => [...prev, res]);
    const updateReservation = (res: Reservation) => setReservations(prev => prev.map(r => r.id === res.id ? res : r));

    // -- Staff Actions --
    const addStaff = (s: Staff) => setStaff(prev => [...prev, s]);
    const updateStaff = (s: Staff) => setStaff(prev => prev.map(st => st.id === s.id ? s : st));
    const deleteStaff = (id: string) => setStaff(prev => prev.filter(s => s.id !== id));

    // -- Report Actions --
    const generateReport = (type: string, dateRange: {start: string, end: string}) => {
        // Mock report generation
        console.log(`Generating ${type} report from ${dateRange.start} to ${dateRange.end}`);
        alert(`${type} Report generated successfully! Download started.`);
    };

    return (
        <AppContext.Provider value={{
            rooms, addRoom, updateRoom, deleteRoom,
            tickets, addTicket, updateTicket,
            invoices, addInvoice,
            guests, addGuest, updateGuest,
            companies, addCompany, updateCompany, deleteCompany,
            reservations, addReservation, updateReservation,
            staff, addStaff, updateStaff, deleteStaff,
            generateReport
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};