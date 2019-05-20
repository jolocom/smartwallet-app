
import { Transformation,
         Filter,
         Ordering } from './filter.d';

export const transform = <T>(list: T[], transformations: Transformation<T>[]): T[] =>
    (transformations && transformations[0])
    ? list
    : transform(transformations!.pop()(list), transformations);

export const filterToTransformation = <T>(filter: Filter<T>): Transformation<T> =>
    (list: T[]): T[] =>
    list.filter(filter)

export const orderingToTransformation = <T>(ordering: Ordering<T>): Transformation<T> =>
    (list: T[]): T[] =>
    list.sort(ordering)

