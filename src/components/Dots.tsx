import React, { useRef } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors } from '~/utils/colors';
import { IWithCustomStyle } from './Card/types';
import PopupMenu, { IPopupOption } from './PopupMenu';

interface IDots extends IWithCustomStyle {
 color: Colors
 options: IPopupOption[]
}

const Dots: React.FC<IDots> = ({ customStyles, color, options }) => {
 const popupRef = useRef<{ show: () => void }>(null)

 return (
  <TouchableOpacity
   onPress={() => popupRef.current?.show()}
   style={[styles.container, customStyles]}
   testID="card-action-more"
  >
   <View style={styles.dots}>
    {[...Array(3).keys()].map((c) => (
     <View key={c} style={[styles.dot, { backgroundColor: color }]} />
    ))}
   </View>
   <PopupMenu
    ref={popupRef}
    options={options}
   />

  </TouchableOpacity>
 )
}

const styles = StyleSheet.create({
 container: {
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
  width: 50,
  height: 50,
  zIndex: 100
 },
 dots: {
  flexDirection: 'row',
  zIndex: 1
 },
 dot: {
  width: 4,
  height: 4,
  borderRadius: 2,
  marginHorizontal: 2,
 },
})


export default Dots;