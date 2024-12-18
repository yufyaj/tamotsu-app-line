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
      chat_participants: {
        Row: {
          chat_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          canceled_at: string | null
          created_at: string
          id: string
        }
        Insert: {
          canceled_at?: string | null
          created_at?: string
          id: string
        }
        Update: {
          canceled_at?: string | null
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      client_profiles: {
        Row: {
          age: number | null
          created_at: string
          gender: string | null
          goal: string | null
          height: number | null
          name: string
          profile_image_url: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          gender?: string | null
          goal?: string | null
          height?: number | null
          name?: string
          profile_image_url?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string
          gender?: string | null
          goal?: string | null
          height?: number | null
          name?: string
          profile_image_url?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string
          content: string | null
          id: string
          image_url: string | null
          sended_at: string
          sender_id: string
        }
        Insert: {
          chat_id: string
          content?: string | null
          id: string
          image_url?: string | null
          sended_at?: string
          sender_id: string
        }
        Update: {
          chat_id?: string
          content?: string | null
          id?: string
          image_url?: string | null
          sended_at?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      nutritionist_profiles: {
        Row: {
          bio: string | null
          created_at: string
          license: string
          name: string
          profile_image_url: string | null
          specialty: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          license: string
          name?: string
          profile_image_url?: string | null
          specialty?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          license?: string
          name?: string
          profile_image_url?: string | null
          specialty?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          billing_status: string | null
          created_at: string
          id: string
          role: string | null
          status: string | null
          sub: string
        }
        Insert: {
          billing_status?: string | null
          created_at?: string
          id: string
          role?: string | null
          status?: string | null
          sub: string
        }
        Update: {
          billing_status?: string | null
          created_at?: string
          id?: string
          role?: string | null
          status?: string | null
          sub?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
