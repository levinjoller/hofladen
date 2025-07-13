// src/services/customerService.ts
import { supabase } from '@/supabase';
import { ref } from 'vue';

// Definiere das Interface für die Person, falls noch nicht global definiert
export interface Person {
    id: number;
    created_at: string;
    display_name: string;
}

// Definiere das Customer-Interface - 'person' ist jetzt nicht mehr optional/nullable
export interface Customer {
    id: number;
    created_at: string;
    fk_person: number; // Nicht mehr nullable
    person: Person; // Nicht mehr optional/nullable
}

export const customers = ref<Customer[]>([]);
export const customersLoading = ref(true);
export const customersError = ref<string | null>(null);

let isCustomerSubscribed = false;

type PresentToastFunction = (message: string, color?: 'success' | 'danger' | 'warning' | 'primary' | string, duration?: number) => void;

/**
 * Initializes customer data and sets up Realtime subscription.
 * @param presentToast Function to display toasts.
 */
export async function initializeCustomerData(presentToast: PresentToastFunction) {
    if (customers.value.length === 0 && customersLoading.value) {
        customersLoading.value = true;
        customersError.value = null;
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('*, person:fk_person(id, created_at, display_name)');

            if (error) {
                throw new Error(error.message);
            }

            // ANPASSUNG: Keine Null-Prüfung für 'customer.person'
            customers.value = (data as any[]).map(customer => ({
                id: customer.id,
                created_at: customer.created_at,
                fk_person: customer.fk_person,
                person: { // Direktes Zuweisen, da 'person' zwingend ist
                    id: customer.person.id,
                    created_at: customer.person.created_at,
                    display_name: customer.person.display_name
                }
            })) || [];

        } catch (err: any) {
            customersError.value = `Fehler beim Laden der Kunden: ${err.message}`;
            console.error('Error loading customers:', err);
            presentToast(customersError.value, 'danger');
        } finally {
            customersLoading.value = false;
        }
    }

    if (!isCustomerSubscribed) {
        subscribeToCustomerChanges(presentToast);
        isCustomerSubscribed = true;
    }
}

/**
 * Reinitializes customer data and subscription (useful for refresh or app resume).
 * @param presentToast Function to display toasts.
 */
export async function reinitializeCustomerData(presentToast: PresentToastFunction) {
    unsubscribeFromCustomerChanges();
    customers.value = [];
    customersLoading.value = true;
    await initializeCustomerData(presentToast);
    console.log('Reinitialized customer data and subscription.');
}

/**
 * Sets up a Supabase Realtime Subscription for changes in the 'customers' table.
 * Updates the global 'customers' Ref on changes.
 * @param presentToast Function to display toasts.
 */
function subscribeToCustomerChanges(presentToast: PresentToastFunction) {
    supabase
        .channel('customer_changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'customers' },
            async (payload) => {
                console.log('Realtime change received for customers:', payload);
                try {
                    await fetchAllCustomersOnce(presentToast);
                } catch (err: any) {
                    // Fehler wird bereits in fetchAllCustomersOnce behandelt
                }
            }
        )
        .subscribe((status, err) => {
            if (status === 'CHANNEL_ERROR') {
                const errorMessage = err ? (err.message || 'Ein unbekannter Fehler ist aufgetreten.') : 'Verbindung fehlgeschlagen, keine Fehlerdetails verfügbar.';
                const msg = `Realtime-Verbindungsfehler für Kunden: ${errorMessage}`;
                customersError.value = msg;
                console.error('Realtime customer subscription initial error:', err, 'Status:', status);
                presentToast(msg, 'danger');
            }
        });
}

/**
 * Helper function to fetch all customers once (for Realtime updates).
 * Updates the global 'customers' Ref.
 * @param presentToast Function to display toasts.
 */
async function fetchAllCustomersOnce(presentToast: PresentToastFunction) {
    customersError.value = null;
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('*, person:fk_person(id, created_at, display_name)');

        if (error) {
            throw new Error(error.message);
        }

        // ANPASSUNG: Keine Null-Prüfung für 'customer.person'
        customers.value = (data as any[]).map(customer => ({
            id: customer.id,
            created_at: customer.created_at,
            fk_person: customer.fk_person,
            person: { // Direktes Zuweisen, da 'person' zwingend ist
                id: customer.person.id,
                created_at: customer.person.created_at,
                display_name: customer.person.display_name
            }
        })) || [];

    } catch (err: any) {
        const msg = `Fehler beim Realtime-Update der Kunden: ${err.message}`;
        customersError.value = msg;
        console.error('Fehler beim Realtime-Abruf der Kunden:', err);
        presentToast(msg, 'danger');
    }
}

/**
 * Unsubscribes from customer Realtime changes.
 */
export function unsubscribeFromCustomerChanges() {
    const channel = supabase.channel('customer_changes');
    supabase.removeChannel(channel);
    isCustomerSubscribed = false;
    console.log('Unsubscribed from customer changes.');
}