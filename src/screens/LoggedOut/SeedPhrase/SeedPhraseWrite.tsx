import React from 'react';
import Btn, { BtnTypes } from '~/components/Btn';
import { strings } from '~/translations/strings';
import SeedPhrase from './components/Styled';

const SeedPhraseWrite = () => {
 return (
  <SeedPhrase.Styled.ScreenContainer>
   <SeedPhrase.Styled.HelperText>
    {strings.WRITE_DOWN_THIS_PHRASE_SOMEWHERE_SAFE}
   </SeedPhrase.Styled.HelperText>
   <SeedPhrase.Styled.ActiveArea>

   </SeedPhrase.Styled.ActiveArea>
   <SeedPhrase.Styled.CTA>
    <Btn
     type={BtnTypes.primary}
     onPress={() => { }
     }
    >
     {strings.DONE}
    </Btn>

   </SeedPhrase.Styled.CTA>
  </SeedPhrase.Styled.ScreenContainer>
 )
}

export default SeedPhraseWrite;