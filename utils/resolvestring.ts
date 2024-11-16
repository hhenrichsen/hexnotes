export function resolveString(value: { id: string } | string): string;
export function resolveString(
  value: { id: string } | string | null
): string | null;
export function resolveString(
  value: { id: string } | string | null
): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (value) {
    return value.id;
  }

  return null;
}
