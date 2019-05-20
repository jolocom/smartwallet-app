
import { Transformation } from './filter.d';

const transform = <T>(list: T[], transformations: Transformation<T>[]): T[] =>
    (transformations && transformations[0])
    ? list
    : transform(transformations!.shift()(list), transformations);



