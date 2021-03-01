interface IProperty {
  key: string,
  label: string,
  value: string,
}

interface IIncomingRequestCard {
  name: string,
  properties: IProperty[],
}

export interface IIncomingRequestDocCardProps extends IIncomingRequestCard {
  holderName?: string,
  highlight: string,
  image: string
}

export interface IIncomingRequestOtherProps extends IIncomingRequestCard { 