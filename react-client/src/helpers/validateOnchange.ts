export function validateOnchange<T>(field: keyof T, date: Date | null, prevValue: T, validators?: Partial<{
  [K in keyof T]: (val: T[K], prev: T) => Partial<T>
}>): Partial<T> {
  const validator = validators?.[field] as ((val: any, prev: T) => Partial<T>) | undefined;
  return validator?.(date, prevValue) ?? {};
}