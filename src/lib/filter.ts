
import {
    Transformation,
    Filter,
    Ordering
} from './filter.d';


export const buildTransform: <T>(ts: [Filter<T> | Ordering<T>]) => Transformation<T>
    = <T>(ts: [Filter<T> | Ordering<T>]): Transformation<T> => (list: T[]): T[] =>
        ts.map((t: Filter<T> | Ordering<T>): Transformation<T> =>
            isFilter(t)
                ? filterToTransformation(t)
                : orderingToTransformation(t))
            .reduce((acc: Transformation<T>, curr: Transformation<T>) =>
                (list: T[]) => curr(acc(list)),
                identityTransformation)(list)

const isFilter = <T>(func: Filter<T> | Ordering<T>): func is Filter<T> =>
    func.length === 1

// left commented as a converse example of isFilter
// const isOrdering = <T>(func: Filter<T> | Ordering<T>): func is Ordering<T> =>
//     func.length === 2

const filterToTransformation = <T>(filter: Filter<T>): Transformation<T> =>
    (list: T[]): T[] =>
        list.filter(filter)

const orderingToTransformation = <T>(ordering: Ordering<T>): Transformation<T> =>
    (list: T[]): T[] =>
        list.sort(ordering)

const identityTransformation = <T>(list: T[]) => list
