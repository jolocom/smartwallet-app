import { BaseSchema } from 'yup'
import { AssertsShape, ObjectShape, TypeOfShape } from 'yup/lib/object'
import { AnyObject, Maybe, Optionals } from 'yup/lib/types'

declare module 'yup' {
  interface ObjectSchema<
    TShape extends ObjectShape,
    TContext extends AnyObject = AnyObject,
    TIn extends Maybe<TypeOfShape<TShape>> = TypeOfShape<TShape>,
    TOut extends Maybe<AssertsShape<TShape>> =
      | AssertsShape<TShape>
      | Optionals<TIn>
  > extends BaseSchema<TIn, TContext, TOut> {
    atLeastOneOf(list: string[], message: string): ObjectSchema<TShape>
  }
}
