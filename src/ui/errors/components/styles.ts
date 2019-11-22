import {
  baseBlack,
  black,
  black050,
  borderGrey,
  joloColor,
  mediumBlack,
  sandLight080,
  white,
  white021,
  white050,
} from '../../../styles/colors'
import { fontMain } from '../../../styles/typography'
import { StyleSheet } from 'react-native'

const borderStyle = {
  borderWidth: 1,
  borderRadius: 8,
}

const defaultText = {
  fontFamily: fontMain,
  fontSize: 20,
}

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: baseBlack,
    justifyContent: 'flex-start',
  },
  sectionWrapper: {
    width: '100%',
    height: 'auto',
    paddingHorizontal: 20,
    marginTop: 50,
  },
  sectionTitle: {
    fontFamily: fontMain,
    color: sandLight080,
    fontSize: 28,
  },
  sectionDescription: {
    ...defaultText,
    color: white,
    fontSize: 16,
    letterSpacing: 0.11,
    lineHeight: 20,
  },
  pickerWrapper: {
    ...borderStyle,
    backgroundColor: mediumBlack,
    borderColor: white021,
    paddingLeft: 10,
    height: 50,
    width: '100%',
    justifyContent: 'center',
  },
  pickerIconWrapper: {
    position: 'absolute',
    width: 50,
    height: 50,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerDropDown: {
    ...borderStyle,
    borderColor: white021,
    backgroundColor: black,
    paddingVertical: 10,
  },
  pickerDropdownText: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
    height: 46,
  },
  inputText: {
    ...defaultText,
    color: white,
    padding: 10,
  },
  inputBlock: {
    ...borderStyle,
    ...defaultText,
    color: white,
    height: 90,
    maxWidth: '100%',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingTop: 13,
    flexWrap: 'wrap',
    backgroundColor: mediumBlack,
    borderColor: white021,
  },
  inputLine: {
    ...defaultText,
    color: white,
    width: '100%',
    borderBottomColor: white,
    borderBottomWidth: 1,
    marginTop: 28,
  },
  switchSection: {
    flexDirection: 'row',
    marginTop: 20,
  },
  switchWrapper: {
    width: 70,
    height: 'auto',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  emojiWrapper: {
    maxWidth: '100%',
    height: 'auto',
    marginTop: 27,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emojiButton: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: borderGrey,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: black050,
  },
  selectedEmoji: {
    borderColor: joloColor,
    backgroundColor: black050,
  },
  unselectedEmoji: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 23,
    color: black,
  },

  // NOTE inline colors for switching between the intermediate and final versions
  highlightBorder: {
    borderColor: joloColor,
    borderBottomColor: joloColor,
  },
  defaultBorder: {
    borderColor: white021,
    borderBottomColor: white021,
  },
  selectedText: {
    color: joloColor,
  },
  defaultText: {
    color: white,
  },
  unselectedText: {
    color: white050,
  },
  gradientOff: {
    color: 'rgb(12, 12, 12)',
  },
  gradientOnStart: {
    color: 'rgb(145, 25, 66)',
  },
  gradientOnEnd: {
    color: 'rgb(210, 45, 105)',
  },
})
