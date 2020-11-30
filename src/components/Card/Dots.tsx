import React, { useRef } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import PopupMenu from '../PopupMenu'
import { useCard } from './Card'
import { IWithCustomStyle } from './types'
import CardDetails from '~/screens/LoggedIn/Documents/CardDetails'

const Dots: React.FC<IWithCustomStyle> = ({ customStyles }) => {
  const { id, image, claims, document } = useCard()
  const popupRef = useRef<{ show: () => void }>(null)
  const infoRef = useRef<{ show: () => void }>(null)

  return (
    <TouchableOpacity
      onPress={() => popupRef.current?.show()}
      style={[styles.container, customStyles]}
      testID="card-action-more"
    >
      <View style={styles.dots}>
        {[...Array(3).keys()].map((c) => (
          <View key={c} style={styles.dot} />
        ))}
      </View>
      <CardDetails
        ref={infoRef}
        fields={claims}
        image={image}
        title={document?.value}
      />
      <PopupMenu
        ref={popupRef}
        options={[
          {
            title: strings.INFO,
            onPress: () => infoRef.current?.show(),
          },
          { title: strings.DELETE, onPress: () => {} },
        ]}
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
  },
  dots: {
    flexDirection: 'row',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.black,
    marginHorizontal: 2,
  },
})

export default Dots
