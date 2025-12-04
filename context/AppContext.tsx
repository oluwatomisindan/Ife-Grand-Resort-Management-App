import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../src/api/axios';
import { 
    Room, MaintenanceTicket, Invoice, Guest, Company, Reservation, Staff
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

    generateReport: (type: string, dateRange: {start: string, end: string}) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);

    // Fetch Initial Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Note: Some endpoints might fail if user is not authorized (e.g. admin/users).
                // We should handle this gracefully or only fetch if authorized.
                // For now, we attempt to fetch all.
                const [roomsRes, guestsRes, reservationsRes, staffRes, companiesRes, ticketsRes, invoicesRes] = await Promise.all([
                    api.get('/rooms/status'), // Changed from /rooms
                    api.get('/guests'),
                    api.get('/reservations'),
                    api.get('/admin/users'), // Changed from /staff
                    api.get('/companies'),
                    api.get('/tickets/manager'), // Changed from /tickets
                    api.get('/invoices') // Note: Invoices endpoint might need to be added to server.js if not present
                ]);
                setRooms(roomsRes.data);
                setGuests(guestsRes.data);
                setReservations(reservationsRes.data);
                setStaff(staffRes.data);
                setCompanies(companiesRes.data);
                setTickets(ticketsRes.data);
                setInvoices(invoicesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // -- Room Actions --
    const addRoom = async (room: Room) => {
        try {
            const response = await api.post('/rooms', room);
            setRooms(prev => [...prev, response.data]);
        } catch (error) {
            console.error('Error adding room:', error);
        }
    };
    const updateRoom = async (room: Room) => {
        try {
            // PRD specifies PUT /api/rooms/:id/status for status updates.
            // If this is a general update, we might need a different endpoint.
            // For now, assuming general update.
            const response = await api.put(`/rooms/${room.id}`, room);
            setRooms(prev => prev.map(r => r.id === room.id ? response.data : r));
        } catch (error) {
            console.error('Error updating room:', error);
        }
    };
    const deleteRoom = async (id: string) => {
        try {
            await api.delete(`/rooms/${id}`);
            setRooms(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    // -- Ticket Actions --
    const addTicket = async (ticket: MaintenanceTicket) => {
        try {
            const response = await api.post('/tickets', ticket);
            setTickets(prev => [response.data, ...prev]);
        } catch (error) {
            console.error('Error adding ticket:', error);
        }
    };
    const updateTicket = async (ticket: MaintenanceTicket) => {
        try {
            const response = await api.put(`/tickets/${ticket.id}`, ticket);
            setTickets(prev => prev.map(t => t.id === ticket.id ? response.data : t));
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
    };

    // -- Invoice Actions --
    const addInvoice = async (invoice: Invoice) => {
        try {
            const response = await api.post('/invoices', invoice);
            setInvoices(prev => [response.data, ...prev]);
        } catch (error) {
            console.error('Error adding invoice:', error);
        }
    };

    // -- Guest Actions --
    const addGuest = async (guest: Guest) => {
        try {
            const response = await api.post('/guests', guest);
            setGuests(prev => [...prev, response.data]);
        } catch (error) {
            console.error('Error adding guest:', error);
        }
    };
    const updateGuest = async (guest: Guest) => {
        try {
            const response = await api.put(`/guests/${guest.id}`, guest);
            setGuests(prev => prev.map(g => g.id === guest.id ? response.data : g));
        } catch (error) {
            console.error('Error updating guest:', error);
        }
    };

    // -- Company Actions --
    const addCompany = async (company: Company) => {
        try {
            const response = await api.post('/companies', company);
            setCompanies(prev => [...prev, response.data]);
        } catch (error) {
            console.error('Error adding company:', error);
        }
    };
    const updateCompany = async (company: Company) => {
        try {
            const response = await api.put(`/companies/${company.id}`, company);
            setCompanies(prev => prev.map(c => c.id === company.id ? response.data : c));
        } catch (error) {
            console.error('Error updating company:', error);
        }
    };
    const deleteCompany = async (id: string) => {
        try {
            await api.delete(`/companies/${id}`);
            setCompanies(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    // -- Reservation Actions --
    const addReservation = async (res: Reservation) => {
        try {
            const response = await api.post('/reservations', res);
            setReservations(prev => [...prev, response.data]);
        } catch (error) {
            console.error('Error adding reservation:', error);
        }
    };
    const updateReservation = async (res: Reservation) => {
        try {
            const response = await api.put(`/reservations/${res.id}`, res);
            setReservations(prev => prev.map(r => r.id === res.id ? response.data : r));
        } catch (error) {
            console.error('Error updating reservation:', error);
        }
    };

    // -- Staff Actions --
    const addStaff = async (s: Staff) => {
        try {
            // PRD: POST /api/admin/users
            const response = await api.post('/admin/users', s);
            // Backend returns { message, user }, so we need to use response.data.user
            setStaff(prev => [...prev, response.data.user]);
        } catch (error) {
            console.error('Error adding staff:', error);
            throw error; // Re-throw to allow UI to handle error
        }
    };
    const updateStaff = async (s: Staff) => {
        try {
            // PRD: PUT /api/admin/users/:id
            const response = await api.put(`/admin/users/${s.id}`, s);
            setStaff(prev => prev.map(st => st.id === s.id ? response.data : st));
        } catch (error) {
            console.error('Error updating staff:', error);
        }
    };
    const deleteStaff = async (id: string) => {
        // PRD doesn't list DELETE /api/admin/users/:id. 
        // Assuming it might be added or we just disable it.
        try {
            await api.delete(`/admin/users/${id}`);
            setStaff(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting staff:', error);
        }
    };

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