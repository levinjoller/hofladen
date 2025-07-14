import { supabase } from '@/supabase';
import { ref } from 'vue';
import { presentToast } from './toastService';

export interface Person {
    id: number;
    created_at: string;
    display_name: string;
}

export interface Customer {
    id: number;
    created_at: string;
    fk_person: number;
    person?: Person;
}

export const customers = ref<Customer[]>([]);
export const customersLoading = ref(false);
export const customersError = ref<string | null>(null);

/**
 * Holt Kundendaten einmalig ab.
 * @param presentToast Function to display toasts.
 * @param forceReload Wenn true, werden die Daten auch geladen, wenn customers.value.length > 0 ist.
 */
export async function loadCustomerData(forceReload: boolean = false) {
    if ((customers.value.length === 0 && !customersLoading.value) || forceReload) {
        customersLoading.value = true;
        customersError.value = null;
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('*, person:fk_person(id, created_at, display_name)');

            if (error) {
                throw new Error(error.message);
            }

            customers.value = (data as any[]).map(customer => ({
                id: customer.id,
                created_at: customer.created_at,
                fk_person: customer.fk_person,
                person: customer.person ? {
                    id: customer.person.id,
                    created_at: customer.person.created_at,
                    display_name: customer.person.display_name
                } : undefined
            })) || [];

        } catch (err: any) {
            const msg = `Fehler beim Laden der Kunden: ${err.message}`;
            customersError.value = msg;
            console.error('Error loading customers:', err);
            presentToast(msg, 'danger');
        } finally {
            customersLoading.value = false;
        }
    }
}

/**
 * Reinitializes customer data.
 */
export async function reinitializeCustomerData() {
    await loadCustomerData(true);
    console.log('Reinitialized customer data (no Realtime subscription).');
}