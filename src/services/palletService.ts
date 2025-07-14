import { supabase } from '@/supabase';
import { ref } from 'vue';
import { presentToast } from './toastService';

export interface PalletFormattedForGrid {
    id: number;
    created_at: string;
    customer_name: string | null;
    product_name: string | null;
    stock: string | null;
    stock_column: string | null;
    slot: string | null;
    slot_level: string | null;
    slot_level_number: number | null;
}

export const pallets = ref<PalletFormattedForGrid[]>([]);
export const palletsLoading = ref(false);
export const palletsError = ref<string | null>(null);

export async function loadPalletData(forceReload: boolean = false) {
    if ((pallets.value.length === 0 && !palletsLoading.value) || forceReload) {
        palletsLoading.value = true;
        palletsError.value = null;

        try {
            const { data, error } = await supabase
                .from('pallets')
                .select(`
                  id,
                  created_at,
                  customers:fk_customer (
                    person:fk_person (
                      display_name
                    )
                  ),
                  products:fk_product (
                    display_name
                  ),
                  suppliers:fk_supplier (
                    person:fk_person (
                      display_name
                    )
                  ),
                  stock_column_slot_levels:fk_stock_column_slot_level (
                    id,
                    display_name,
                    is_taken,
                    level,
                    stock_column_slots:fk_stock_column_slot (
                      id,
                      display_name,
                      stock_columns:fk_stock_column (
                        display_name,
                        stocks:fk_stock (
                          display_name
                        )
                      )
                    )
                  )
                `);
            if (error) throw error;

            pallets.value = (data || []).map((pallet: any) => {
                const slotLevel = pallet.stock_column_slot_levels;
                const slot = slotLevel?.stock_column_slots;
                const column = slot?.stock_columns;
                const stock = column?.stocks;

                return {
                    id: pallet.id,
                    created_at: pallet.created_at,
                    customer_name: pallet.customers?.person?.display_name || null,
                    product_name: pallet.products?.display_name || null,
                    supplier_name: pallet.suppliers?.person?.display_name || null,
                    stock: stock?.display_name || null,
                    stock_column: column?.display_name || null,
                    slot: slot?.display_name || null,
                    slot_level: slotLevel?.display_name || null,
                    slot_level_number: slotLevel?.level || null,
                };
            });

        } catch (err: any) {
            console.error('Fehler beim Laden der Paletten:', err.message);
            palletsError.value = err.message || 'Unbekannter Fehler';
            presentToast(`Fehler beim Laden der Paletten: ${err.message}`, 'danger');
        } finally {
            palletsLoading.value = false;
        }
    }
}
