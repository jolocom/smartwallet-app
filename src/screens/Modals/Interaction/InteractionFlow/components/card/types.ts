import { CredentialDisplay } from '@jolocom/sdk/js/credentials'

export type IIncomingCard = Pick<CredentialDisplay, 'name'> &
  Pick<CredentialDisplay['display'], 'properties'>

export interface IIncomingRequestDocCardProps extends IIncomingCard {
  holderName?: string
  highlight?: string
  image?: string
}

export interface IIncomingRequestOtherProps extends IIncomingCard {}
export interface IIncomingOfferDocProps extends IIncomingCard {}
export interface IIncomingOfferOtherProps extends IIncomingCard {}
