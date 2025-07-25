export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      customers: {
        Row: {
          created_at: string
          fk_person: number
          id: number
        }
        Insert: {
          created_at?: string
          fk_person: number
          id?: number
        }
        Update: {
          created_at?: string
          fk_person?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "customers_fk_person_fkey"
            columns: ["fk_person"]
            isOneToOne: true
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
        ]
      }
      palox_histories: {
        Row: {
          created_at: string
          fk_palox: number
          fk_stock_column_slot_level: number
          id: number
        }
        Insert: {
          created_at?: string
          fk_palox: number
          fk_stock_column_slot_level: number
          id?: number
        }
        Update: {
          created_at?: string
          fk_palox?: number
          fk_stock_column_slot_level?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "pallet_histories_fk_pallet_fkey"
            columns: ["fk_palox"]
            isOneToOne: false
            referencedRelation: "paloxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pallet_histories_fk_stock_column_slot_level_fkey"
            columns: ["fk_stock_column_slot_level"]
            isOneToOne: false
            referencedRelation: "stock_column_slot_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      palox_types: {
        Row: {
          created_at: string
          description: number | null
          display_name: string
          id: number
          label_prefix: string
        }
        Insert: {
          created_at?: string
          description?: number | null
          display_name: string
          id?: number
          label_prefix: string
        }
        Update: {
          created_at?: string
          description?: number | null
          display_name?: string
          id?: number
          label_prefix?: string
        }
        Relationships: []
      }
      paloxes: {
        Row: {
          created_at: string
          fk_customer: number | null
          fk_palox_types: number
          fk_product: number
          fk_stock_column_slot_level: number
          fk_supplier: number | null
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          fk_customer?: number | null
          fk_palox_types: number
          fk_product: number
          fk_stock_column_slot_level: number
          fk_supplier?: number | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          fk_customer?: number | null
          fk_palox_types?: number
          fk_product?: number
          fk_stock_column_slot_level?: number
          fk_supplier?: number | null
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pallets_fk_customer_fkey"
            columns: ["fk_customer"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pallets_fk_product_fkey"
            columns: ["fk_product"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pallets_fk_stock_column_slot_level_fkey"
            columns: ["fk_stock_column_slot_level"]
            isOneToOne: true
            referencedRelation: "stock_column_slot_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pallets_fk_supplier_fkey"
            columns: ["fk_supplier"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paloxes_fk_palox_types_fkey"
            columns: ["fk_palox_types"]
            isOneToOne: false
            referencedRelation: "palox_types"
            referencedColumns: ["id"]
          },
        ]
      }
      persons: {
        Row: {
          created_at: string
          display_name: string
          id: number
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: number
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          display_name: string
          id: number
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: number
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: number
        }
        Relationships: []
      }
      stock_column_slot_levels: {
        Row: {
          created_at: string
          display_name: string
          fk_stock_column_slot: number
          id: number
          is_taken: boolean
          level: number
          max_level: number
        }
        Insert: {
          created_at?: string
          display_name: string
          fk_stock_column_slot: number
          id?: number
          is_taken: boolean
          level: number
          max_level?: number
        }
        Update: {
          created_at?: string
          display_name?: string
          fk_stock_column_slot?: number
          id?: number
          is_taken?: boolean
          level?: number
          max_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_column_slot_levels_fk_stock_column_slot_fkey"
            columns: ["fk_stock_column_slot"]
            isOneToOne: false
            referencedRelation: "stock_column_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_column_slots: {
        Row: {
          created_at: string
          display_name: string
          fk_stock_column: number
          id: number
          y_position: number
        }
        Insert: {
          created_at?: string
          display_name: string
          fk_stock_column: number
          id?: number
          y_position: number
        }
        Update: {
          created_at?: string
          display_name?: string
          fk_stock_column?: number
          id?: number
          y_position?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_column_slots_fk_stock_column_fkey"
            columns: ["fk_stock_column"]
            isOneToOne: false
            referencedRelation: "stock_columns"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_columns: {
        Row: {
          created_at: string
          display_name: string
          fk_stock: number
          id: number
          x_position: number
        }
        Insert: {
          created_at?: string
          display_name: string
          fk_stock: number
          id?: number
          x_position: number
        }
        Update: {
          created_at?: string
          display_name?: string
          fk_stock?: number
          id?: number
          x_position?: number
        }
        Relationships: [
          {
            foreignKeyName: "rows_fk_warehouse_fkey"
            columns: ["fk_stock"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      stocks: {
        Row: {
          created_at: string
          display_name: string
          id: number
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: number
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: number
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          created_at: string
          fk_person: number
          id: number
        }
        Insert: {
          created_at?: string
          fk_person: number
          id?: number
        }
        Update: {
          created_at?: string
          fk_person?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_fk_person_fkey"
            columns: ["fk_person"]
            isOneToOne: true
            referencedRelation: "persons"
            referencedColumns: ["id"]
          },
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

