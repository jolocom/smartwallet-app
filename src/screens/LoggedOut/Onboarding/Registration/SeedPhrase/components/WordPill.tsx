import React from 'react'
import {
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import JoloText, { JoloTextWeight } from '~/components/JoloText'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

interface IWordPill {
  customContainerStyles?: StyleProp<ViewStyle>
  customTextStyles?: TextStyle
}

interface IWordPillRepeat {
  active: boolean
}

interface IWordPillComposition {
  Write: React.FC
  Repeat: React.FC<IWordPillRepeat>
  Placeholder: React.FC
}

const WordPill: React.FC<IWordPill> & IWordPillComposition = ({
  customContainerStyles,
  customTextStyles,
  children,
}) => {
  return (
    <View style={[styles.container, customContainerStyles]}>
      <View style={styles.spacings}>
        <JoloText
          size={JoloTextSizes.big}
          weight={JoloTextWeight.medium}
          customStyles={customTextStyles}
        >
          {children}
        </JoloText>
      </View>
    </View>
  )
}

const WordPillWrite: React.FC = ({ children }) => {
  return (
    <WordPill
      customContainerStyles={{ shadowColor: Colors.bastille1 }}
      customTextStyles={{ color: Colors.activity, opacity: 0.8 }}
    >
      {children}
    </WordPill>
  )
}

const WordPillRepeat: React.FC<IWordPillRepeat> = ({ children, active }) => {
  return (
    <WordPill
      customContainerStyles={[
        {
          shadowColor: Colors.white21,
          shadowOffset: { width: -3, height: -2 },
          shadowOpacity: 0.4,
        },
        active && styles.active,
      ]}
      customTextStyles={{ color: Colors.serenade }}
    >
      {children}
    </WordPill>
  )
}

const WordPillPlaceholder: React.FC = () => (
  <View style={[styles.container, styles.placeholder]} />
)

WordPill.Write = WordPillWrite
WordPill.Repeat = WordPillRepeat
WordPill.Placeholder = WordPillPlaceholder

const styles = StyleSheet.create({
  container: {
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bastille1,
    marginHorizontal: BP({ default: 5, small: 3, xsmall: 3 }),
    marginVertical: BP({ default: 7, small: 5, xsmall: 5 }),
    shadowOffset: {
      width: 5,
      height: 4,
    },
    shadowOpacity: 0.67,
    shadowRadius: 4.65,
    elevation: 6,
    // NOTE: default border, which doesn't allow the content to overflow
    // when the @WordPill is selected
    borderWidth: 1.7,
    borderColor: Colors.bastille1,
  },
  spacings: {
    paddingHorizontal: 20,
    paddingVertical: BP({ default: 10, xsmall: 8 }),
  },
  active: {
    borderWidth: 1.7,
    borderColor: Colors.activity,
  },
  placeholder: {
    flex: 1,
    backgroundColor: Colors.mainBlack,
    borderWidth: 1,
    borderColor: Colors.black06,
  },
})

export default WordPill
