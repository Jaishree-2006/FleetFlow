import { useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useFleetStore } from '../store/useFleetStore';

export function useRealtime() {
  const setVehicles = useFleetStore((s) => s.setVehicles);
  const setDrivers = useFleetStore((s) => s.setDrivers);
  const setTrips = useFleetStore((s) => s.setTrips);

  useEffect(() => {
    // Vehicles
    const vehicleSub = supabase
      .channel('vehicles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, (payload) => {
        supabase.from('vehicles').select('*').then(({ data }) => setVehicles(data || []));
      })
      .subscribe();
    // Drivers
    const driverSub = supabase
      .channel('drivers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drivers' }, (payload) => {
        supabase.from('drivers').select('*').then(({ data }) => setDrivers(data || []));
      })
      .subscribe();
    // Trips
    const tripSub = supabase
      .channel('trips')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, (payload) => {
        supabase.from('trips').select('*').then(({ data }) => setTrips(data || []));
      })
      .subscribe();
    // Cleanup
    return () => {
      supabase.removeChannel(vehicleSub);
      supabase.removeChannel(driverSub);
      supabase.removeChannel(tripSub);
    };
  }, [setVehicles, setDrivers, setTrips]);
}
