import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type BookingRow = Database['public']['Tables']['bookings']['Row']
type BookingInsert = Database['public']['Tables']['bookings']['Insert']
type VehicleRow = Database['public']['Tables']['vehicles']['Row']

export class SupabaseService {
  static async signInWithGoogle() {
    try {
      console.log('Starting Google OAuth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      console.log('OAuth response:', { data, error });
      return { data, error };
    } catch (err) {
      console.error('OAuth error:', err);
      return { data: null, error: err };
    }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  static async updateUserPhone(userId: string, phone: string) {
    // Update user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: { phone: phone }
    });
    
    // Also update custom users table if it exists
    try {
      await supabase
        .from('users')
        .upsert({
          id: userId,
          phone: phone
        });
    } catch (dbError) {
      console.warn('Custom users table not found or error updating:', dbError);
    }
    
    return { data, error };
  }

  // Vehicles
  static async getUserVehicles(userId: string): Promise<VehicleRow[]> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async addVehicle(userId: string, vehicleNumber: string, type: 'car' | 'bike', nickname?: string) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert({
        user_id: userId,
        vehicle_number: vehicleNumber,
        type,
        nickname: nickname || null
      })
      .select()
      .single()

    return { data, error }
  }

  // Bookings
  static async createBooking(booking: BookingInsert) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single()

    return { data, error }
  }

  static async getUserBookings(userId: string): Promise<BookingRow[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getBookingById(id: string): Promise<BookingRow | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async updateBookingStatus(
    id: string, 
    status: BookingRow['status'],
    updates: Partial<BookingRow> = {}
  ) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status, 
        ...updates 
      })
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  static async cancelBooking(id: string, refundAmount: number) {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'CANCELLED',
        refund_amount: refundAmount,
        refund_status: 'INITIATED',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    // Simulate refund completion after 3 seconds
    setTimeout(async () => {
      await supabase
        .from('bookings')
        .update({ refund_status: 'COMPLETED' })
        .eq('id', id)
    }, 3000)

    return { data, error }
  }

  // Slots
  static async getAvailableSlots(lotId: string, startTime: string, endTime: string) {
    // Get all slots for the lot
    const { data: allSlots, error: slotsError } = await supabase
      .from('slots')
      .select('*')
      .eq('lot_id', lotId)

    if (slotsError) throw slotsError

    // Get overlapping bookings
    const { data: overlappingBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('slot_label')
      .eq('lot_id', lotId)
      .lt('start_time', endTime)
      .gt('end_time', startTime)
      .neq('status', 'CANCELLED')

    if (bookingsError) throw bookingsError

    const occupiedSlots = new Set(overlappingBookings?.map(b => b.slot_label) || [])

    // Mark slots as occupied if they have overlapping bookings
    return allSlots?.map(slot => ({
      ...slot,
      status: occupiedSlots.has(slot.label) ? 'OCCUPIED' : slot.status
    })) || []
  }
}