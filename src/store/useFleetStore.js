import { create } from 'zustand';
import { supabase } from '../utils/supabaseClient';

export const useFleetStore = create((set, get) => ({
  vehicles: [],
  drivers: [],
  trips: [],
  expenses: [],
  loading: false,
  searchQuery: '',
  userRole: null,
  notifications: [
    { id: 1, text: 'Vehicle #1024 reported high fuel consumption.', type: 'alert', time: '2h ago' },
    { id: 2, text: 'New trip assigned to Driver John Doe.', type: 'info', time: '4h ago' },
  ],

  setSearchQuery: (query) => set({ searchQuery: query }),
  setUserRole: (role) => set({ userRole: role }),
  addNotification: (n) => set((state) => ({ notifications: [n, ...state.notifications] })),
  clearNotifications: () => set({ notifications: [] }),

  fetchVehicles: async () => {
    try {
      const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      set({ vehicles: data || [] });
    } catch (err) {
      console.warn('Supabase unreachable, using mock vehicles:', err);
      set({
        vehicles: [
          { id: 'm1', name: 'Tesla Semi EV', plate: 'EV-9901', max_load: 35000, odometer: 1200, status: 'Available', type: 'Electric' },
          { id: 'm2', name: 'Ford E-Transit', plate: 'EV-4421', max_load: 5000, odometer: 8500, status: 'Available', type: 'Electric' },
          { id: 'm3', name: 'Rivian EDV', plate: 'EV-7723', max_load: 8000, odometer: 2100, status: 'On Trip', type: 'Electric' },
          { id: 'm4', name: 'Volvo FH Electric', plate: 'EV-1102', max_load: 44000, odometer: 500, status: 'Available', type: 'Electric' },
          { id: 'm5', name: 'Mercedes eActros', plate: 'EV-5567', max_load: 26000, odometer: 4300, status: 'In Shop', type: 'Electric' }
        ]
      });
    }
  },

  fetchDrivers: async () => {
    try {
      const { data, error } = await supabase.from('drivers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      set({ drivers: data || [] });
    } catch (err) {
      set({
        drivers: [
          { id: 'd1', name: 'Alex Johnson', status: 'Active' },
          { id: 'd2', name: 'Sarah Miller', status: 'On Trip' }
        ]
      });
    }
  },

  fetchTrips: async () => {
    try {
      const { data, error } = await supabase.from('trips').select('*, vehicles(*), drivers(*)').order('created_at', { ascending: false });
      if (error) throw error;
      set({ trips: data || [] });
    } catch (err) {
      set({ trips: [] });
    }
  },

  fetchExpenses: async () => {
    const { data } = await supabase.from('expenses').select('*, vehicles(*)').order('created_at', { ascending: false });
    set({ expenses: data || [] });
  },

  // Real-time Subscriptions
  subscribeToAll: () => {
    // Skip real-time if in demo mode or Supabase is likely down
    if (localStorage.getItem('role_demo-user') === 'Fleet Manager') {
      console.log('Skipping real-time subscriptions in Demo Mode');
      return () => { };
    }

    try {
      const vehiclesSub = supabase.channel('vehicles_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, payload => {
          get().fetchVehicles();
        })
        .subscribe();

      const driversSub = supabase.channel('drivers_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'drivers' }, payload => {
          get().fetchDrivers();
        })
        .subscribe();

      const tripsSub = supabase.channel('trips_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, payload => {
          get().fetchTrips();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(vehiclesSub);
        supabase.removeChannel(driversSub);
        supabase.removeChannel(tripsSub);
      };
    } catch (err) {
      console.error('Real-time subscription failed:', err);
      return () => { };
    }
  }
}));
