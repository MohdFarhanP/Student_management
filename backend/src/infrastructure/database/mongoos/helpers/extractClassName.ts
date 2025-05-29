export function getClassName(cls: any): string | null {
  return cls && typeof cls === 'object' && 'name' in cls ? cls.name : null;
}
