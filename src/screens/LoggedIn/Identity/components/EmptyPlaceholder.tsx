import React from 'react';
import JoloText from '~/components/JoloText';
import { strings } from '~/translations';
import { Colors } from '~/utils/colors';

export enum IdentityPlaceholderTypes {
 primitive = 'primitive',
 businessCard = 'businessCard'
}

const EmptyPlaceholder: React.FC<{ type: IdentityPlaceholderTypes }> = ({ type }) => {
 const placeholderText = type === IdentityPlaceholderTypes.businessCard ? strings.SO_FAR_IT_IS_EMPTY : strings.YOUR_INFO_IS_QUITE_EMPTY
 console.log(placeholderText.split('. '));

 return (
  <>
   {placeholderText.split('. ').map((t, idx) => {
    return (
     <JoloText key={t} color={Colors.white40} customStyles={{ ...(idx === 0 && { marginBottom: -6 }) }}>
      {t}
     </JoloText>
    )
   })
   }
  </>
 )
}

export default EmptyPlaceholder;