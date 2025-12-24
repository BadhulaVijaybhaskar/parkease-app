export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone: string
          created_at: string
        }
        Insert: {
          id?: string
          phone: string
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string
          created_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          user_id: string
          vehicle_number: string
          type: 'car' | 'bike'
          nickname: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_number: string
          type: 'car' | 'bike'
          nickname?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_number?: string
          type?: 'car' | 'bike'
          nickname?: string | null
          created_at?: string
        }
      }
      parking_lots: {
        Row: {
          id: string
          name: string
          address: string
          lat: number
          lng: number
          price_per_hour: number
        }
        Insert: {
          id: string
          name: string
          address: string
          lat: number
          lng: number
          price_per_hour: number
        }
        Update: {
          id?: string
          name?: string
          address?: string
          lat?: number
          lng?: number
          price_per_hour?: number
        }
      }
      slots: {
        Row: {
          id: string
          lot_id: string
          label: string
          status: 'AVAILABLE' | 'BLOCKED'
        }
        Insert: {
          id?: string
          lot_id: string
          label: string
          status: 'AVAILABLE' | 'BLOCKED'
        }
        Update: {
          id?: string
          lot_id?: string
          label?: string
          status?: 'AVAILABLE' | 'BLOCKED'
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          lot_id: string
          slot_label: string
          vehicle_number: string
          start_time: string
          end_time: string
          amount_paid: number
          refund_amount: number | null
          refund_status: 'INITIATED' | 'COMPLETED' | null
          status: 'PAID' | 'CHECKED_IN' | 'CANCELLED' | 'COMPLETED'
          created_at: string
          cancelled_at: string | null
          checked_in_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          lot_id: string
          slot_label: string
          vehicle_number: string
          start_time: string
          end_time: string
          amount_paid: number
          refund_amount?: number | null
          refund_status?: 'INITIATED' | 'COMPLETED' | null
          status: 'PAID' | 'CHECKED_IN' | 'CANCELLED' | 'COMPLETED'
          created_at?: string
          cancelled_at?: string | null
          checked_in_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          lot_id?: string
          slot_label?: string
          vehicle_number?: string
          start_time?: string
          end_time?: string
          amount_paid?: number
          refund_amount?: number | null
          refund_status?: 'INITIATED' | 'COMPLETED' | null
          status?: 'PAID' | 'CHECKED_IN' | 'CANCELLED' | 'COMPLETED'
          created_at?: string
          cancelled_at?: string | null
          checked_in_at?: string | null
        }
      }
    }
  }
}