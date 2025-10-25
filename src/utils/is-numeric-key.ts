export function isNumericKey(event: KeyboardEvent): boolean {
  const key = event.key;
  const allowedKeys = [
    "Backspace",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Enter",
    "Delete",
  ];
  return (
    key !== "Dead" &&
    key !== "Unidentified" &&
    (/^[0-9]$/.test(key) || allowedKeys.includes(key))
  );
}
