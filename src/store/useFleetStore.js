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
    const { data } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    set({ vehicles: data || [] });
  },

  fetchDrivers: async () => {
    const { data } = await supabase.from('drivers').select('*').order('created_at', { ascending: false });
    set({ drivers: data || [] });
  },

  fetchTrips: async () => {
    const { data } = await supabase.from('trips').select('*, vehicles(*), drivers(*)').order('created_at', { ascending: false });
    set({ trips: data || [] });
  },

  fetchExpenses: async () => {
    const { data } = await supabase.from('expenses').select('*, vehicles(*)').order('created_at', { ascending: false });
    set({ expenses: data || [] });
  },

  // Real-time Subscriptions
  subscribeToAll: () => {
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
  }
}));
