import { supabase } from '@/supabase';
import { ref } from 'vue';

export interface Person {
    id: number;
    created_at: string;
    display_name: string;
}

export interface Supplier {
    id: number;
    created_at: string;
    fk_person: number;
    person?: Person;
}

export const suppliers = ref<Supplier[]>([]);
export const suppliersLoading = ref(true);
export const suppliersError = ref<string | null>(null);

let isSupplierSubscribed = false;

type PresentToastFunction = (message: string, color?: 'success' | 'danger' | 'warning' | 'primary' | string, duration?: number) => void;

/**
 * Initializes supplier data and sets up Realtime subscription.
 * @param presentToast Function to display toasts.
 */
export async function initializeSupplierData(presentToast: PresentToastFunction) {
    if (suppliers.value.length === 0 && suppliersLoading.value) {
        suppliersLoading.value = true;
        suppliersError.value = null;
        try {
            const { data, error } = await supabase
                .from('suppliers')
                .select('*, person:fk_person(display_name)');

            if (error) {
                throw new Error(error.message);
            }

            suppliers.value = (data as any[]).map(supplier => ({
                id: supplier.id,
                created_at: supplier.created_at,
                fk_person: supplier.fk_person,
                person: {
                    display_name: supplier.person.display_name,
                    id: supplier.fk_person,
                    created_at: ''
                }
            })) || [];

        } catch (err: any) {
            suppliersError.value = `Fehler beim Laden der Lieferanten: ${err.message}`;
            console.error('Error loading suppliers:', err);
            presentToast(suppliersError.value, 'danger');
        } finally {
            suppliersLoading.value = false;
        }
    }

    if (!isSupplierSubscribed) {
        subscribeToSupplierChanges(presentToast);
        isSupplierSubscribed = true;
    }
}

/**
 * Sets up a Supabase Realtime Subscription for changes in the 'suppliers' table.
 * Updates the global 'suppliers' Ref on changes.
 * @param presentToast Function to display toasts.
 */
function subscribeToSupplierChanges(presentToast: PresentToastFunction) {
    supabase
        .channel('supplier_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'suppliers' },
            async (payload) => {
                console.log('Realtime change received for suppliers:', payload);
                try {
                    await fetchAllSuppliersOnce(presentToast);
                } catch (err: any) {
                    // Error is already handled in fetchAllSuppliersOnce
                }
            }
        )
        .subscribe((status, err) => {
            if (status === 'CHANNEL_ERROR') {
                const errorMessage = err ? (err.message || 'Ein unbekannter Fehler ist aufgetreten.') : 'Verbindung fehlgeschlagen, keine Fehlerdetails verfügbar.'; const msg = `Realtime-Verbindungsfehler für Lieferanten: ${errorMessage}`;
                suppliersError.value = msg;
                console.error('Realtime supplier subscription initial error:', err);
                presentToast(msg, 'danger');
            }
        });
}

/**
 * Helper function to fetch all suppliers once (for Realtime updates).
 * Updates the global 'suppliers' Ref.
 * @param presentToast Function to display toasts.
 */
async function fetchAllSuppliersOnce(presentToast: PresentToastFunction) {
    suppliersError.value = null;
    try {
        const { data, error } = await supabase
            .from('suppliers')
            .select('*, person:fk_person(display_name)');

        if (error) {
            throw new Error(error.message);
        }

        suppliers.value = (data as any[]).map(supplier => ({
            id: supplier.id,
            created_at: supplier.created_at,
            fk_person: supplier.fk_person,
            person: {
                display_name: supplier.person.display_name,
                id: supplier.fk_person,
                created_at: ''
            }
        })) || [];

    } catch (err: any) {
        const msg = `Fehler beim Realtime-Update der Lieferanten: ${err.message}`;
        suppliersError.value = msg;
        console.error('Fehler beim Realtime-Abruf der Lieferanten:', err);
        presentToast(msg, 'danger');
    }
}

/**
 * Unsubscribes from supplier Realtime changes.
 */
export function unsubscribeFromSupplierChanges() {
    if (isSupplierSubscribed) {
        const channel = supabase.channel('supplier_changes');
        supabase.removeChannel(channel);
        isSupplierSubscribed = false;
        console.log('Unsubscribed from supplier changes.');
    } else {
        console.log('No active supplier subscription to unsubscribe from.');
    }
}

/**
 * Reinitializes supplier data and subscription (useful for refresh or app resume).
 * This function is called when the app comes back into foreground.
 * It ensures data is fresh and Realtime connection is active.
 * @param presentToast Function to display toasts.
 */
export async function reinitializeSupplierData(presentToast: PresentToastFunction) {
    unsubscribeFromSupplierChanges();
    suppliers.value = [];
    suppliersLoading.value = true;
    suppliersError.value = null;
    await initializeSupplierData(presentToast);
    console.log('Reinitialized supplier data and subscription.');
}