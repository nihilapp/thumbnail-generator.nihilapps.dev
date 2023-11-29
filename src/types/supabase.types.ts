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
          bgBlue: number | null
          bgGreen: number | null
          bgRed: number | null
          created: string | null
          id: string
          imagePosition: number | null
          imageSrc: string | null
          imageLink: string | null
          subTitle: string | null
          textBlue: number | null
          textGreen: number | null
          textRed: number | null
          title: string
          updated: string | null
          usersId: string
        }
        Insert: {
          bgBlue?: number | null
          bgGreen?: number | null
          bgRed?: number | null
          created?: string | null
          id?: string
          imagePosition?: number | null
          imageSrc?: string | null
          imageLink?: string | null
          subTitle?: string | null
          textBlue?: number | null
          textGreen?: number | null
          textRed?: number | null
          title: string
          updated?: string | null
          usersId: string
        }
        Update: {
          bgBlue?: number | null
          bgGreen?: number | null
          bgRed?: number | null
          created?: string | null
          id?: string
          imagePosition?: number | null
          imageSrc?: string | null
          imageLink?: string | null
          subTitle?: string | null
          textBlue?: number | null
          textGreen?: number | null
          textRed?: number | null
          title?: string
          updated?: string | null
          usersId?: string
        }
        Relationships: []
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
