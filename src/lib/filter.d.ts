

export interface Transformation<T> {
    (list: T[]): T[]
}

export interface Ordering<T> {
    (t1: T, t2: T): boolean
}

export interface Filter<T> {
    (t: T): boolean
}
