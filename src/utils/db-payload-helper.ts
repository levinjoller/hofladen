import { useDbAction } from "@/composables/use-db-action";
import { movePaloxesToDifferentLevel } from "@/services/palox-service";
import { DbSlotPaloxOrderData } from "@/types/db-slot-palox-order-data";
import { SlotContent } from "@/types/schemas/slot-content-schema";
import { SlotPaloxOrderData } from "@/types/slot-palox-order-data";
import { SlotReorderStoreInstance } from "@/types/slot-selection-strategy";
import { StepResult } from "@/types/step-result";

export function findSlotOrder(
  orderArray: SlotPaloxOrderData[],
  slotId: number,
): SlotPaloxOrderData | undefined {
  return orderArray.find((item) => item.slotId === slotId);
}

export function upsertSlotOrder(
  orderArray: SlotPaloxOrderData[],
  slotId: number,
  paloxIds: number[],
): SlotPaloxOrderData[] {
  const existing = orderArray.find((item) => item.slotId === slotId);
  if (existing) {
    existing.paloxIds = [...paloxIds];
  } else {
    orderArray.push({ slotId, paloxIds: [...paloxIds] });
  }
  return orderArray;
}

export async function executeMovePaloxesToDifferentLevel(
  store: SlotReorderStoreInstance,
): Promise<StepResult> {
  if (!store.hasChanges) {
    return {
      success: true,
      parentReloadRequired: false,
      closeModal: true,
      isCompleted: true,
    };
  }
  const { execute } = useDbAction(
    movePaloxesToDifferentLevel,
    (loading, error) => store.setStrategyActionStatus(loading, error),
  );
  const dbPayloadArray: DbSlotPaloxOrderData[] = store.newOrder.map((item) => ({
    slot_id: item.slotId,
    ordered_palox_ids: item.paloxIds,
  }));
  const payload = { p_slot_orders: dbPayloadArray };
  await execute(payload);
  const success = !store.getActionErrorMessage;
  return {
    success,
    parentReloadRequired: success,
    closeModal: success,
    isCompleted: true,
  };
}

export function createTwoSlotPayload(selected: SlotContent[]): {
  p_slot_ids: number[];
} {
  const [slotA, slotB] = selected;
  return { p_slot_ids: [slotA.slot_id, slotB.slot_id] };
}
