/**
 * Typed schema for Supabase FreshCheck tables.
 * Keep in sync with /supabase/migrations/*.sql.
 * Regenerate via: supabase gen types typescript --local > src/lib/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Tone = 'fresh' | 'safe' | 'soon' | 'past' | 'neutral';
export type Verdict = 'fresh' | 'safe' | 'soon' | 'past';
export type FridgeCategory = 'dairy' | 'poultry' | 'meat' | 'fish' | 'produce' | 'bakery' | 'pantry';
export type FridgeLocation = 'fridge' | 'freezer' | 'pantry';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          plan: 'free' | 'plus';
          diet_preferences: string[] | null;
          member_since: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          plan?: 'free' | 'plus';
          diet_preferences?: string[] | null;
        };
        Update: {
          email?: string;
          name?: string | null;
          plan?: 'free' | 'plus';
          diet_preferences?: string[] | null;
        };
      };
      fridge_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: FridgeCategory;
          location: FridgeLocation;
          tone: Tone;
          days_left: number;
          total_days: number;
          expiry_text: string;
          warn: boolean;
          thumbnail_path: string | null;
          source_scan_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          category: FridgeCategory;
          location?: FridgeLocation;
          tone: Tone;
          days_left: number;
          total_days: number;
          expiry_text: string;
          warn?: boolean;
          thumbnail_path?: string | null;
          source_scan_id?: string | null;
        };
        Update: {
          name?: string;
          category?: FridgeCategory;
          location?: FridgeLocation;
          tone?: Tone;
          days_left?: number;
          total_days?: number;
          expiry_text?: string;
          warn?: boolean;
        };
      };
      scans: {
        Row: {
          id: string;
          user_id: string;
          product: string;
          verdict: Verdict;
          tone: Tone;
          confidence: number;
          analysis: Json;
          storage_note: string | null;
          days_left: number | null;
          total_days: number | null;
          image_path: string | null;
          scanned_at: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          product: string;
          verdict: Verdict;
          tone: Tone;
          confidence: number;
          analysis?: Json;
          storage_note?: string | null;
          days_left?: number | null;
          total_days?: number | null;
          image_path?: string | null;
        };
        Update: {
          product?: string;
          verdict?: Verdict;
          tone?: Tone;
          confidence?: number;
          analysis?: Json;
          storage_note?: string | null;
          days_left?: number | null;
          total_days?: number | null;
          image_path?: string | null;
        };
      };
      saved_recipes: {
        Row: {
          id: string;
          user_id: string;
          recipe_id: string;
          saved_at: string;
        };
        Insert: {
          user_id: string;
          recipe_id: string;
        };
        Update: Record<string, never>;
      };
    };
  };
}
