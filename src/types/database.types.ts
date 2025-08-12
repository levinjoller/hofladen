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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
            foreignKeyName: "palox_histories_fk_palox_fkey"
            columns: ["fk_palox"]
            isOneToOne: false
            referencedRelation: "paloxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "palox_histories_fk_palox_fkey"
            columns: ["fk_palox"]
            isOneToOne: false
            referencedRelation: "paloxes_in_stock_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "palox_histories_fk_palox_fkey"
            columns: ["fk_palox"]
            isOneToOne: false
            referencedRelation: "paloxes_palox_types_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "palox_histories_fk_stock_column_slot_level_fkey"
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
          next_palox_number: number
        }
        Insert: {
          created_at?: string
          description?: number | null
          display_name: string
          id?: number
          label_prefix: string
          next_palox_number: number
        }
        Update: {
          created_at?: string
          description?: number | null
          display_name?: string
          id?: number
          label_prefix?: string
          next_palox_number?: number
        }
        Relationships: []
      }
      paloxes: {
        Row: {
          created_at: string
          fk_customer: number | null
          fk_palox_type: number
          fk_product: number
          fk_stock_column_slot_level: number | null
          fk_supplier: number
          id: number
          number_per_type: number
          stored_at: string | null
        }
        Insert: {
          created_at?: string
          fk_customer?: number | null
          fk_palox_type: number
          fk_product: number
          fk_stock_column_slot_level?: number | null
          fk_supplier: number
          id?: number
          number_per_type: number
          stored_at?: string | null
        }
        Update: {
          created_at?: string
          fk_customer?: number | null
          fk_palox_type?: number
          fk_product?: number
          fk_stock_column_slot_level?: number | null
          fk_supplier?: number
          id?: number
          number_per_type?: number
          stored_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paloxes_fk_customer_fkey"
            columns: ["fk_customer"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paloxes_fk_customer_fkey"
            columns: ["fk_customer"]
            isOneToOne: false
            referencedRelation: "customers_persons_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paloxes_fk_palox_type_fkey"
            columns: ["fk_palox_type"]
            isOneToOne: false
            referencedRelation: "palox_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paloxes_fk_product_fkey"
            columns: ["fk_product"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paloxes_fk_product_fkey"
            columns: ["fk_product"]
            isOneToOne: false
            referencedRelation: "products_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paloxes_fk_stock_column_slot_level_fkey"
            columns: ["fk_stock_column_slot_level"]
            isOneToOne: true
            referencedRelation: "stock_column_slot_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paloxes_fk_supplier_fkey"
            columns: ["fk_supplier"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paloxes_fk_supplier_fkey"
            columns: ["fk_supplier"]
            isOneToOne: false
            referencedRelation: "suppliers_persons_view"
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
          fk_stock_column_slot: number
          id: number
          is_taken: boolean
          level: number
        }
        Insert: {
          created_at?: string
          fk_stock_column_slot: number
          id?: number
          is_taken: boolean
          level: number
        }
        Update: {
          created_at?: string
          fk_stock_column_slot?: number
          id?: number
          is_taken?: boolean
          level?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_column_slot_levels_fk_stock_column_slot_fkey"
            columns: ["fk_stock_column_slot"]
            isOneToOne: false
            referencedRelation: "stock_column_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_column_slot_levels_fk_stock_column_slot_fkey"
            columns: ["fk_stock_column_slot"]
            isOneToOne: false
            referencedRelation: "stock_column_slots_columns_view"
            referencedColumns: ["stock_column_slot_id"]
          },
        ]
      }
      stock_column_slots: {
        Row: {
          created_at: string
          current_taken_levels: number
          fk_stock_column: number
          id: number
          max_level: number
          slot: number
        }
        Insert: {
          created_at?: string
          current_taken_levels: number
          fk_stock_column: number
          id?: number
          max_level: number
          slot: number
        }
        Update: {
          created_at?: string
          current_taken_levels?: number
          fk_stock_column?: number
          id?: number
          max_level?: number
          slot?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_column_slots_fk_stock_column_fkey"
            columns: ["fk_stock_column"]
            isOneToOne: false
            referencedRelation: "stock_column_slots_columns_view"
            referencedColumns: ["stock_column_id"]
          },
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
          column: number
          created_at: string
          display_name: string
          fk_stock: number
          id: number
        }
        Insert: {
          column: number
          created_at?: string
          display_name: string
          fk_stock: number
          id?: number
        }
        Update: {
          column?: number
          created_at?: string
          display_name?: string
          fk_stock?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_columns_fk_stock_fkey"
            columns: ["fk_stock"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_columns_fk_stock_fkey"
            columns: ["fk_stock"]
            isOneToOne: false
            referencedRelation: "stocks_view"
            referencedColumns: ["id"]
          },
        ]
      }
      stocks: {
        Row: {
          created_at: string
          id: number
          stock: number
        }
        Insert: {
          created_at?: string
          id?: number
          stock: number
        }
        Update: {
          created_at?: string
          id?: number
          stock?: number
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
      customers_persons_view: {
        Row: {
          id: number | null
          person_display_name: string | null
        }
        Relationships: []
      }
      paloxes_in_stock_view: {
        Row: {
          customer_person_display_name: string | null
          id: number | null
          palox_display_name: string | null
          product_display_name: string | null
          stock_location_display_name: string | null
          stored_at: string | null
          supplier_person_display_name: string | null
        }
        Relationships: []
      }
      paloxes_palox_types_view: {
        Row: {
          id: number | null
          number_per_type: number | null
          palox_types_label_prefix: string | null
        }
        Relationships: []
      }
      products_view: {
        Row: {
          display_name: string | null
          id: number | null
        }
        Insert: {
          display_name?: string | null
          id?: number | null
        }
        Update: {
          display_name?: string | null
          id?: number | null
        }
        Relationships: []
      }
      stock_column_slots_columns_view: {
        Row: {
          fk_stock: number | null
          free_levels: number | null
          is_full: boolean | null
          stock_column_display_name: string | null
          stock_column_id: number | null
          stock_column_number: number | null
          stock_column_slot_id: number | null
          stock_slot_number: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_columns_fk_stock_fkey"
            columns: ["fk_stock"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_columns_fk_stock_fkey"
            columns: ["fk_stock"]
            isOneToOne: false
            referencedRelation: "stocks_view"
            referencedColumns: ["id"]
          },
        ]
      }
      stocks_view: {
        Row: {
          id: number | null
          stock: number | null
        }
        Insert: {
          id?: number | null
          stock?: number | null
        }
        Update: {
          id?: number | null
          stock?: number | null
        }
        Relationships: []
      }
      suppliers_persons_view: {
        Row: {
          id: number | null
          person_display_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_palox_to_next_free_level_in_slot_fnc: {
        Args: {
          p_customer_id?: number
          p_palox_id: number
          p_product_id: number
          p_stock_column_slot_id: number
          p_supplier_id: number
        }
        Returns: undefined
      }
      update_taken_level_flags_counts_fnc: {
        Args: { p_is_taken: boolean; p_slot_level_id: number }
        Returns: undefined
      }
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

