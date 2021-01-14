import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Block from '~/components/Block';
import Btn, { BtnTypes } from '~/components/Btn';
import Dots from '~/components/Dots';
import JoloText from '~/components/JoloText';
import { getBusinessCardAttributeWithValuesUI } from '~/modules/attributes/selectors';
import { strings } from '~/translations';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';

const getPlaceholderStyles = (height: number, width: string | number, bg: Colors, br: number, mb: number) => ({
 height, width, backgroundColor: bg, borderRadius: br, marginBottom: mb
})

const PlaceholderMini = () => <Block customStyle={getPlaceholderStyles(16, '33.1%', Colors.portGore, 5, 10)} />
const PlaceholderBig = () => <Block customStyle={getPlaceholderStyles(33, '100%', Colors.portGore, 5, 15)} />

const Placeholder = {
 Mini: PlaceholderMini,
 Big: PlaceholderBig
}

const BusinessCardPlaceholder = () => {
 return (
  <>
   {[...Array(3).keys()].map(el => (
    <View key={el}>
     <Placeholder.Mini />
     <Placeholder.Big />
    </View>
   ))}
  </>
 )
}

enum Modes {
 none = 'none',
 edit = 'edit'
}

const BusinessCardCredential = () => {
 const businessCardAttribute = useSelector(getBusinessCardAttributeWithValuesUI);

 const [mode, setMode] = useState(Modes.none);

 const setEditMode = () => setMode(Modes.edit)
 const resetMode = () => setMode(Modes.none);

 const popupOptions = useMemo(() => ([
  {
   title: strings.EDIT,
   onPress: setEditMode
  },
 ]), [])

 // NOTO: this is only for testing purposes
 if (!businessCardAttribute.length && __DEV__) {
  return <JoloText>Create business card to see its content</JoloText>
 } else if (mode === Modes.edit) {
  return (
   <>
    <JoloText>Business Card Form...</JoloText>
    <Btn type={BtnTypes.senary} onPress={resetMode}>Cancel</Btn>
   </>
  )
 } else {
  return (
   <>
    <Dots color={Colors.white} customStyles={{ right: -10, top: -12 }} options={popupOptions} />
    {businessCardAttribute.length ? businessCardAttribute.map(field => (
     <View key={field.key}>
      <JoloText size={JoloTextSizes.mini} color={Colors.white40} customStyles={{ textAlign: 'left', marginBottom: 3 }}>{field.label}</JoloText>
      {businessCardAttribute.length && (
       <JoloText size={JoloTextSizes.big} color={Colors.white80} customStyles={{ textAlign: 'left', marginBottom: 13 }}>{field.value}</JoloText>
      )}
     </View>
    )
    ) : null}
   </>
  )
 }


}

const BusinessCard = {
 Placeholder: BusinessCardPlaceholder,
 Credential: BusinessCardCredential
}

const IdentityBusinessCard = () => {
 const [isPlaceholder, setIsPlaceholder] = useState(true);
 const handlePlaceholderToggle = () => setIsPlaceholder(prevState => !prevState);
 return (
  <View style={{ width: '100%' }}>
   {/* TODO: below should be moved inside of IdentityTabs component */}
   {isPlaceholder && strings.BUSINESS_CARD_CTA_CREATE.split(',').map(t => (
    <JoloText size={JoloTextSizes.mini} color={Colors.white40} customStyles={{ lineHeight: 10 }}>{t}</JoloText>
   ))}
   <TouchableOpacity onPress={handlePlaceholderToggle}>
    <Block customStyle={{ padding: 26, alignItems: 'center', marginTop: 30 }}>
     <View style={{ width: '100%' }}>
      {isPlaceholder ? <BusinessCard.Placeholder /> : <BusinessCard.Credential />}
     </View>
    </Block>
   </TouchableOpacity>
  </View>
 )
}

export default IdentityBusinessCard;