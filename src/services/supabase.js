
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
// import Constants from 'expo-constants'; (Removed to avoid install issues)

// --- MOCK DATA FOR DEMO MODE ---
const MOCK_LEADS = [
    { id: 1, name: "Sophie Martin", email: "sophie.m@gmail.com", event_type: "Wedding", message: "Looking for full photography package for June 2025.", created_at: new Date().toISOString() },
    { id: 2, name: "Jean Dupont", email: "j.dupont@corporate.lu", event_type: "Corporate", message: "Annual gala dinner coverage needed.", created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, name: "Maria Garcia", email: "maria.g@hotmail.com", event_type: "Baptism", message: "Small family gathering photos.", created_at: new Date(Date.now() - 172800000).toISOString() },
];

const MOCK_CONFIG = {
    platform: 'youtube',
    channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw' // Google Developers Channel
};

// -------------------------------

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Detect if we are using placeholder credentials
const isMockMode = supabaseUrl.includes("placeholder") || supabaseUrl.includes("TU_SUPABASE");

const realSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: null,
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
    },
});

// Proxy handler to intercept calls when in Mock Mode
export const supabase = isMockMode ? {
    from: (table) => {
        // We crate a chainable object
        const chain = {
            select: (columns) => chain,
            eq: (col, val) => chain, // Just return chain to allow chaining
            order: async (col, opts) => {
                await delay(800); // Fake network latency
                console.log(`[MOCK DB] Fetching ${table}...`);
                if (table === 'leads') return { data: MOCK_LEADS, error: null };
                if (table === 'app_settings') return { data: [{ key: 'stream_config', value: MOCK_CONFIG }], error: null };
                return { data: [], error: null };
            },
            single: async () => {
                await delay(500);
                if (table === 'app_settings') {
                    // Simulate getting Master Code or Stream Config
                    return { data: { value: 'lux_master_2026' }, error: null };
                }
                return { data: null, error: null };
            },
            upsert: async (payload) => {
                await delay(1000);
                console.log(`[MOCK DB] Upserting to ${table}:`, payload);
                return { error: null };
            }
        };
        return chain;
    }
} : realSupabase;

if (isMockMode) {
    console.warn("⚠️ WELUX ADMIN APP IS RUNNING IN MOCK/DEMO MODE. NO REAL DB CONNECTION.");
}
