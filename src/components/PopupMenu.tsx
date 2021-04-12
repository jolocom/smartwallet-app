import React, { useImperativeHandle, useState } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'

import Block from './Block'
import { Colors } from '~/utils/colors'
import JoloText from './JoloText'
import ActionSheet from './ActionSheet/ActionSheet'
import { useSafeArea } from 'react-native-safe-area-context'

export interface IPopupOption {
  title: string
  onPress: () => void
}

interface Props {
  options: IPopupOption[]
}

const PopupButton: React.FC<{ onPress: () => void }> = ({
  onPress,
  children,
}) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    testID="popup-menu-button"
  >
    <JoloText>{children}</JoloText>
  </TouchableOpacity>
)

const PopupMenu = React.forwardRef<{ show: () => void }, Props>(
  ({ options }, ref) => {
    const [isVisible, setVisible] = useState(false)
    const { bottom } = useSafeArea()

    useImperativeHandle(ref, () => ({
      show: () => setVisible(true),
    }))

    const handleHide = () => setVisible(false)

    return (
      <ActionSheet
        isVisible={isVisible}
        onClose={handleHide}
        overlayColor={Colors.black85}
        animationType={'fade'}
        testID="popup-menu"
      >
        <View style={[styles.container, { paddingBottom: bottom + 24 }]}>
          <Block customStyle={styles.block}>
            {options.map(({ title, onPress }, i) => (
              <React.Fragment key={i}>
                <PopupButton
                  onPress={() => {
                    onPress()
                    handleHide()
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
            <PopupButton onPress={handleHide}>Close</PopupButton>
          </Block>
        </View>
      </ActionSheet>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
  },
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
  button: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default PopupMenu
