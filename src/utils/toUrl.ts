export function toUrl(value: string) {
  const newVal = value.replace(" ", "-");

  return newVal;
}
