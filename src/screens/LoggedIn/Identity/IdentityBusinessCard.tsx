import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Block from '~/components/Block';
import JoloText from '~/components/JoloText';
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
  <View style={{ width: '100%' }}>
   {[...Array(3).keys()].map(el => (
    <>
     <Placeholder.Mini />
     <Placeholder.Big />
    </>
   ))}
  </View>
 )
}

const BusinessCardCredential = () => {
 return (
  <JoloText>In progress...</JoloText>
 )
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
   {strings.BUSINESS_CARD_CTA_CREATE.split(',').map(t => (
    <JoloText size={JoloTextSizes.mini} color={Colors.white40} customStyles={{ lineHeight: 10 }}>{t}</JoloText>
   ))}
   <TouchableOpacity onPress={handlePlaceholderToggle}>
    <Block customStyle={{ padding: 26, alignItems: 'center', marginTop: 30 }}>
     {isPlaceholder ? <BusinessCard.Placeholder /> : <BusinessCard.Credential />}
    </Block>

   </TouchableOpacity>
  </View>
 )
}

export default IdentityBusinessCard;