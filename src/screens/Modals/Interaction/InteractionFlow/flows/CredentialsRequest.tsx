import React from 'react';

/* --- CredentialShare BAS API ---
  <Interaction.BAS>
    <Interaction.BAS.Logo />
    <Interaction.BAS.Title />
    <Interaction.BAS.Description />
    <Interaction.BAS.Body>
      <Interaction.BAS.Card type="offer" />
      <Interaction.BAS.AddCredential />
    </Interaction.BAS.Body>
    <Interaction.BAS.Footer>
      <Interaction.BAS.Submit label="Accept" />
      <Interaction.BAS.Ignore />
    </Interaction.BAS.Footer>
  </Interaction.BAS>
*/

export const CredentialShareBAS = () => {
  return null
}

/* --- CredentialShare FAS API - WIP ---
  <Interaction.BAS>
    <Interaction.BAS.Logo />
    <Interaction.BAS.Title />
    <Interaction.BAS.Description />
    <Interaction.BAS.Body>
      <Interaction.BAS.AddCredential />
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

export const CredentialShareFAS = () => {
  return null
}
