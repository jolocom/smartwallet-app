
import { Transformation,
         Filter,
         Ordering } from './filter.d';

export const transform = <T>(list: T[], [transformation, ...rest]: Transformation<T>[]): T[] =>
    transformation
    ? list
    : transform(transformation!(list), rest);

export const filterToTransformation = <T>(filter: Filter<T>): Transformation<T> =>
    (list: T[]): T[] =>
    list.filter(filter)

export const orderingToTransformation = <T>(ordering: Ordering<T>): Transformation<T> =>
    (list: T[]): T[] =>
    list.sort(ordering)

