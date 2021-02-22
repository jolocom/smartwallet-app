import React from 'react';

/* --- CredentialOffer BAS API ---
  <Interaction.BAS>
    <Interaction.BAS.Logo />
    <Interaction.BAS.Title />
    <Interaction.BAS.Description />
    <Interaction.BAS.Body>
      <Interaction.BAS.Card type="offer" />
    </Interaction.BAS.Body>
    <Interaction.BAS.Footer>
      <Interaction.BAS.Submit label="Accept" />
      <Interaction.BAS.Ignore />
    </Interaction.BAS.Footer>
  </Interaction.BAS>
*/

export const CredentialOfferBAS = () => {
  return null
}

/* --- CredentialOffer FAS API - WIP ---
  <Interaction.BAS>
    <Interaction.BAS.Logo />
    <Interaction.BAS.Title />
    <Interaction.BAS.Description />
    <Interaction.BAS.Body>
      {sections.map(s => (
        <Interaction.BAS.Section label={s.label}>
          {s.offers.map(o => (
            <Interaction.BAS.Card {...o} type="offer" />
          ))}
        </Interaction.BAS.Section>      
      ))}
    </Interaction.BAS.Body>
    <Interaction.BAS.Footer>
      <Interaction.BAS.Submit label="Accept" />
      <Interaction.BAS.Ignore />
    </Interaction.BAS.Footer>
  </Interaction.BAS>
*/

export const CredentialOfferFAS = () => {
  return null
}
