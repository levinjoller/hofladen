export const ModiConstants = {
  REORDER: "reorder",
  INSERT: "insert",
  MOVE: "move",
  SWAP: "swap",
} as const;

export type Modi = (typeof ModiConstants)[keyof typeof ModiConstants];

export const ModiList = Object.values(ModiConstants) as Modi[];
