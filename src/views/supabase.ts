import { createClient } from '@supabase/supabase-js';

// Lesen der Supabase-Informationen aus den .env-Dateien
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Überprüfen, ob die Variablen geladen wurden (optional, aber gut für Debugging)
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('FEHLER: Supabase URL oder Anon Key nicht in .env-Datei gefunden. Bitte prüfen Sie Ihre .env-Konfiguration.');
    // Hier könnten Sie auch einen globalen Toast oder eine Fehlerseite anzeigen
}

// Initialisieren und Exportieren des Supabase-Clients
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);