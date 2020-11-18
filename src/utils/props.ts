export const isPropControlled = (props: Record<string, any>, prop: string) => {
  return props[prop] !== undefined
}
