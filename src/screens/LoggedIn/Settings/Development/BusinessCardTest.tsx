import React from 'react';

import JoloText, { JoloTextKind } from '~/components/JoloText';
import ScreenContainer from '~/components/ScreenContainer';
import IdentityBusinessCard from '../../Identity/IdentityBusinessCard';

const BusinessCardTest = () => {
 return (
  <ScreenContainer
   hasHeaderBack
   customStyles={{ justifyContent: 'flex-start' }}
  >
   <JoloText
    kind={JoloTextKind.title}
    customStyles={{ alignSelf: 'flex-start', marginBottom: 30 }}
   >
    Business Card
    </JoloText>
   <IdentityBusinessCard />
  </ScreenContainer>
 )
}

export default BusinessCardTest;