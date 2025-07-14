import { supabase } from '@/supabase';
import { ref } from 'vue';
import { presentToast } from '@/services/toastService';

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
export const suppliersLoading = ref(false);
export const suppliersError = ref<string | null>(null);

/**
 * Fetches supplier data once.
 * @param forceReload If true, data will be reloaded even if suppliers.value.length > 0.
 */
export async function loadSupplierData(forceReload: boolean = false) {
    if ((suppliers.value.length === 0 && !suppliersLoading.value) || forceReload) {
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
                created_at: supplier.created,
                fk_person: supplier.fk_person,
                person: supplier.person ? {
                    display_name: supplier.person.display_name,
                    id: supplier.fk_person,
                    created_at: ''
                } : undefined
            })) || [];

        } catch (err: any) {
            suppliersError.value = `Fehler beim Laden der Lieferanten: ${err.message}`;
            console.error('Error loading suppliers:', err);
            presentToast(suppliersError.value, 'danger');
        } finally {
            suppliersLoading.value = false;
        }
    }
}

/**
 * Reinitializes supplier data (useful for app resume or forced refresh).
 * This function is called when the app comes back into foreground or on a pull-to-refresh.
 * It ensures data is fresh.
 */
export async function reinitializeSupplierData() {
    suppliers.value = [];
    suppliersLoading.value = true;
    suppliersError.value = null;
    await loadSupplierData(true);
    console.log('Reinitialized supplier data (no Realtime subscription).');
}