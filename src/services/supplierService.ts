// src/services/supplierService.ts
import { supabase } from '@/supabase';
import { ref } from 'vue';

export interface Supplier {
    id: number;
    created_at: string;
    display_name: string;
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
                .select('*');

            if (error) {
                throw new Error(error.message);
            }
            suppliers.value = (data as Supplier[]) || [];
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
                const msg = `Realtime-Verbindungsfehler für Lieferanten: ${err?.message || 'Unbekannter Fehler'}`;
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
            .select('*');

        if (error) {
            throw new Error(error.message);
        }
        suppliers.value = (data as Supplier[]) || [];
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
    const channel = supabase.channel('supplier_changes');
    supabase.removeChannel(channel);
    isSupplierSubscribed = false;
    console.log('Unsubscribed from supplier changes.');
}