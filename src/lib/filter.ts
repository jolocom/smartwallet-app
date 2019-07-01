export type Ordering<T> = (t1: T, t2: T) => number
export type Filter<T> = (t: T) => boolean
type Transformation<T> = (list: T[]) => T[]

/**
 * @description - Builds one {@link Transformation} from an array {@link Ordering} or {@link Filter} functions
 * @param ts - List of functions used to order or filter the credential list
 * @returns - Function combining all order / filter operations passed in
 */

export const buildTransform = <T>(ts: Array<Filter<T> | Ordering<T>>) =>
  ts
    .map<Transformation<T>>(t =>
      isFilter(t) ? filterToTransformation(t) : orderingToTransformation(t),
    )
    .reduce<Transformation<T>>(
      (acc, curr) => (list: T[]) => curr(acc(list)),
      identityTransformation,
    )
/**
 * @dev func.length checks for the number of arguments in function signature
 * @param func - The function to test
 */

const isFilter = <T>(func: Filter<T> | Ordering<T>): func is Filter<T> =>
  func.length === 1

// left commented as a converse example of isFilter
// const isOrdering = <T>(func: Filter<T> | Ordering<T>): func is Ordering<T> =>
//     func.length === 2

const filterToTransformation = <T>(filter: Filter<T>): Transformation<T> => (
  list: T[],
): T[] => list.filter(filter)

const orderingToTransformation = <T>(
  ordering: Ordering<T>,
): Transformation<T> => (list: T[]): T[] => list.sort(ordering)

const identityTransformation = <T>(list: T[]) => list
