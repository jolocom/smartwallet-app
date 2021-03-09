export interface IProperty {
  key: string
  label: string
  value: string
}

export interface IIncomingCard {
  name: string
  properties: IProperty[]
}

export interface IIncomingRequestDocCardProps extends IIncomingCard {
  holderName?: string
  highlight?: string
  image?: string
}

export interface IIncomingRequestOtherProps extends IIncomingCard {}
export interface IIncomingOfferDocProps extends IIncomingCard {}
export interface IIncomingOfferOtherProps extends IIncomingCard {}
