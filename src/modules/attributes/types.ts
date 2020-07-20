export interface AttrsStateI<T> {
  [key: string]: T[]
}

export enum AttrActions {
  setAttrs,
  updateAttrs, // after we have created a new one and we want to update the whole collection
}

export enum Attrs {
  name = 'name',
  email = 'email',
  phone = 'phone',
}
