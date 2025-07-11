import { ref } from 'vue';
import { supabase } from '@/views/supabase'; // Importieren des zentralisierten Supabase-Clients
import { useToast } from './useToast'; // Importieren des Toast-Composables

/**
 * Composable zum Abrufen und Verwalten von Produktdaten von Supabase.
 */
export function useProducts() {
    const products = ref<any[]>([]); // Reaktive Variable zum Speichern der Produkt-Daten
    const loading = ref(true); // Ladezustand
    const error = ref<string | null>(null); // Fehlermeldungen

    const { presentToast } = useToast(); // Initialisieren des Toast-Composables

    /**
     * Ruft Produktdaten von der Tabelle 'products' ab.
     */
    async function fetchProducts() {
        loading.value = true; // Setzen Sie den Ladezustand auf true
        error.value = null; // Fehlermeldung zurücksetzen
        try {
            const { data, error: fetchError } = await supabase
                .from('products') // Der Name Ihrer Produkttabelle
                .select('id, display_name, created_at') // Die Spalten, die Sie benötigen
                .order('display_name', { ascending: true }); // Sortierung

            if (fetchError) {
                throw fetchError;
            }
            products.value = data || [];
            console.log('Produkte erfolgreich geladen (aus Composable):', products.value);
        } catch (err: any) {
            console.error('Fehler beim Abrufen der Produkte (aus Composable):', err.message);
            error.value = 'Fehler beim Laden der Produkte: ' + err.message;
            presentToast('Fehler beim Laden der Produkte.', 'danger');
        } finally {
            loading.value = false; // Setzen Sie den Ladezustand auf false
        }
    }

    // Geben Sie die reaktiven Variablen und die Funktion zurück,
    // damit sie in der Komponente verwendet werden können.
    return {
        products,
        loading,
        error,
        fetchProducts
    };
}