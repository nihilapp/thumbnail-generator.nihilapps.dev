export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      thumbnails: {
        Row: {
          bg_blue: number | null
          bg_green: number | null
          bg_image: string | null
          bg_position: number | null
          bg_red: number | null
          color_blue: number | null
          color_green: number | null
          color_red: number | null
          created_at: string
          id: number
          sub_title: string | null
          title: string
          user_id: string
        }
        Insert: {
          bg_blue?: number | null
          bg_green?: number | null
          bg_image?: string | null
          bg_position?: number | null
          bg_red?: number | null
          color_blue?: number | null
          color_green?: number | null
          color_red?: number | null
          created_at?: string
          id?: number
          sub_title?: string | null
          title: string
          user_id: string
        }
        Update: {
          bg_blue?: number | null
          bg_green?: number | null
          bg_image?: string | null
          bg_position?: number | null
          bg_red?: number | null
          color_blue?: number | null
          color_green?: number | null
          color_red?: number | null
          created_at?: string
          id?: number
          sub_title?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'thumbnails_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
