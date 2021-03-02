interface IProperty {
  key: string,
  label: string,
  value: string,
}

interface IIncomingCard {
  name: string,
  properties: IProperty[],
}

export interface IIncomingRequestDocCardProps extends IIncomingCard {
  holderName?: string,
  highlight?: string,
  image?: string
}

export interface IIncomingRequestOtherProps extends IIncomingCard { }
export interface IIncomingOfferDocProps extends IIncomingCard { }
export interface IIncomingOfferOtherProps extends IIncomingCard { }

export function isIncomingOfferCard(details: any): details is IIncomingOfferDocProps[] | IIncomingOfferOtherProps[] {
  return typeof details.name && details.properties
}