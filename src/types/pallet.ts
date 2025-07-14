export interface Pallet {
    id: number;
    created_at: string;
    updated_at: string;

    product: {
        display_name: string;
    } | null;

    customer: {
        person: {
            display_name: string;
        };
    } | null;

    supplier: {
        person: {
            display_name: string;
        };
    } | null;

    stock_column_slot: {
        display_name: string;
        y_position: number;
        stock_column: {
            display_name: string;
            x_position: number;
            stock: {
                display_name: string;
            };
        };
    } | null;

    stock_column_slot_level: {
        display_name: string;
        level: number;
    } | null;
}
