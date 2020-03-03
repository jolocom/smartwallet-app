import { Interaction } from './interaction'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'

export abstract class Flow {
  protected ctx: Interaction
  protected tokens: Array<JSONWebToken<JWTEncodable>> = []

  constructor(ctx: Interaction) {
    this.ctx = ctx
  }

  // Can this abstract anything?
  abstract async handleInteractionToken(
    token: JSONWebToken<JWTEncodable>,
  ): Promise<any>

  // @TODO Make sure this is only used for rendering
  abstract getState(): any

  public getMessages() {
    return this.tokens
  }
}
