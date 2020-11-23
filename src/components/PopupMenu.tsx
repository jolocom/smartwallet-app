import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'

import Block from './Block'
import { Colors } from '~/utils/colors'
import JoloText from './JoloText'
import ActionSheet from './ActionSheet/ActionSheet'

interface PopupOption {
  title: string
  onPress: () => void
}

interface Props {
  options: PopupOption[]
  isVisible: boolean
  onClose: () => void
}

const PopupButton: React.FC<{ onPress: () => void }> = ({
  onPress,
  children,
}) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <JoloText>{children}</JoloText>
  </TouchableOpacity>
)

const PopupMenu: React.FC<Props> = ({ options, isVisible, onClose }) => {
  return (
    <ActionSheet
      isVisible={isVisible}
      onClose={onClose}
      overlayColor={Colors.black65}
      animationType={'fade'}
    >
      <View style={styles.container}>
        <Block customStyle={styles.block}>
          {options.map(({ title, onPress }, i) => (
            <React.Fragment key={i}>
              <PopupButton
                onPress={() => {
                  onPress()
                  onClose()
                }}
              >
                {title}
              </PopupButton>
              {i !== options.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </Block>
        <Block
          customStyle={{
            ...styles.block,
            marginTop: 16,
          }}
        >
          <PopupButton onPress={onClose}>Close</PopupButton>
        </Block>
      </View>
    </ActionSheet>
  )
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: Colors.dark,
    borderRadius: 10,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.darkGray,
    opacity: 0.08,
  },
  container: {
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 36,
  },
  button: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default PopupMenu
