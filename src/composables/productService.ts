import { supabase } from '@/supabase';
import { ref } from 'vue';

export interface Product {
    id: number;
    display_name: string;
    created_at: string;
}

export const products = ref<Product[]>([]);
export const productsLoading = ref(true);
export const productsError = ref<string | null>(null);

let isSubscribed = false;

type PresentToastFunction = (message: string, color?: 'success' | 'danger' | 'warning' | 'primary' | string, duration?: number) => void;

/**
 * Ruft alle Produkte initial aus der 'products'-Tabelle ab und initialisiert die Realtime-Subscription.
 * @param presentToast Funktion zum Anzeigen eines Toasts.
 * @throws {Error} Wenn ein Fehler beim Abrufen oder Abonnieren auftritt.
 */
export async function initializeProductData(presentToast: PresentToastFunction) {
    if (products.value.length === 0 && productsLoading.value) {
        productsLoading.value = true;
        productsError.value = null;
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }
            products.value = (data as Product[]) || [];
        } catch (err: any) {
            productsError.value = `Fehler beim Laden der Produkte: ${err.message}`;
            console.error('Fehler beim Laden der Produkte:', err);
            presentToast(productsError.value, 'danger');
        } finally {
            productsLoading.value = false;
        }
    }

    if (!isSubscribed) {
        subscribeToProductChanges(presentToast);
        isSubscribed = true;
    }
}

/**
 * Richtet eine Supabase Realtime Subscription für Änderungen in der 'products'-Tabelle ein.
 * Aktualisiert die globale 'products'-Ref bei Änderungen.
 * @param presentToast Funktion zum Anzeigen eines Toasts.
 */
function subscribeToProductChanges(presentToast: PresentToastFunction) {
    const channel = supabase
        .channel('product_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'products' },
            async (payload) => {
                console.log('Realtime change received for products:', payload);
                try {
                    await fetchAllProductsOnce(presentToast);
                } catch (err: any) {
                    // Fehler wird bereits in fetchAllProductsOnce behandelt
                }
            }
        )
        .subscribe((status, err) => {
            if (status === 'CHANNEL_ERROR') {
                const msg = `Realtime-Verbindungsfehler: ${err?.message || 'Unbekannter Fehler'}`;
                productsError.value = msg;
                console.error('Realtime subscription initial error:', err);
                presentToast(msg, 'danger');
            }
        });
}

/**
 * Hilfsfunktion zum einmaligen Abrufen aller Produkte (für Realtime-Updates).
 * Aktualisiert die globale 'products'-Ref.
 * @param presentToast Funktion zum Anzeigen eines Toasts.
 */
async function fetchAllProductsOnce(presentToast: PresentToastFunction) {
    productsError.value = null;
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            throw new Error(error.message);
        }
        products.value = (data as Product[]) || [];
    } catch (err: any) {
        const msg = `Fehler beim Realtime-Update der Produkte: ${err.message}`;
        productsError.value = msg;
        console.error('Fehler beim Realtime-Abruf:', err);
        presentToast(msg, 'danger');
    }
}

/**
 * Beendet die Realtime-Subscription für Produktänderungen.
 * Entfernt den Channel und setzt das Flag isSubscribed zurück.
 */
export function unsubscribeFromProductChanges() {
    supabase.removeChannel(supabase.channel('product_changes'));
    isSubscribed = false;
    console.log('Unsubscribed from product changes.');
}