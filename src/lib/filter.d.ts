export type Transformation<T> = (list: T[]) => T[]
export type Ordering<T> = (t1: T, t2: T) => number
export type Filter<T> = (t: T) => boolean
