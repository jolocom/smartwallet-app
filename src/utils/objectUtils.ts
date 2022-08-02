export const getObjectFirstValue = <T>(obj: Record<string, T>) =>
  obj[Object.keys(obj)[0]]
