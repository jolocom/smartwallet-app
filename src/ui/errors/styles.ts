import { fontMain } from '../../styles/typography'
import { StyleSheet } from 'react-native'
import { isFinalStyle } from '../../styles/config'
import { Colors } from '../../styles'

const borderStyle = {
  borderWidth: 1,
  borderRadius: 8,
}

const defaultText = {
  fontFamily: fontMain,
  fontSize: 20,
}

const finalStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.baseBlack,
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
    color: Colors.sandLight080,
    fontSize: 28,
  },
  sectionDescription: {
    ...defaultText,
    color: Colors.white,
    fontSize: 16,
    letterSpacing: 0.11,
    lineHeight: 20,
  },
  pickerWrapper: {
    ...borderStyle,
    backgroundColor: Colors.mediumBlack,
    borderColor: Colors.white021,
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
    borderColor: Colors.white021,
    backgroundColor: Colors.black,
    paddingVertical: 10,
  },
  pickerDropdownText: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
    height: 46,
  },
  inputText: {
    ...defaultText,
    color: Colors.white,
    padding: 10,
  },
  inputBlock: {
    ...borderStyle,
    ...defaultText,
    color: Colors.white,
    height: 90,
    maxWidth: '100%',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingTop: 13,
    flexWrap: 'wrap',
    backgroundColor: Colors.mediumBlack,
    borderColor: Colors.white021,
  },
  inputLine: {
    ...defaultText,
    color: Colors.white,
    width: '100%',
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    marginTop: 16,
    paddingVertical: 12,
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
    borderColor: Colors.borderGrey,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black050,
  },
  selectedEmoji: {
    borderColor: Colors.joloColor,
    backgroundColor: Colors.black050,
  },
  unselectedEmoji: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 23,
    color: Colors.black,
  },

  // NOTE inline colors for switching between the intermediate and final versions
  highlightBorder: {
    borderColor: Colors.joloColor,
    borderBottomColor: Colors.joloColor,
  },
  defaultBorder: {
    borderColor: Colors.white021,
    borderBottomColor: Colors.white021,
  },
  selectedText: {
    color: Colors.joloColor,
  },
  defaultText: {
    color: Colors.white,
  },
  unselectedText: {
    color: Colors.white050,
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
  trackColor: {
    color: Colors.darkGrey,
  },
})

const intermediateStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.iBackgroundWhite,
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
    color: Colors.baseBlack,
    fontSize: 30,
    lineHeight: 34,
  },
  sectionDescription: {
    ...defaultText,
    color: Colors.iTextBlack,
    fontSize: 16,
    letterSpacing: 0.11,
    lineHeight: 20,
  },
  pickerWrapper: {
    ...borderStyle,
    backgroundColor: Colors.white,
    borderColor: Colors.iGrey,
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
    borderColor: Colors.iGrey,
    backgroundColor: Colors.white,
    paddingVertical: 10,
  },
  pickerDropdownText: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
    height: 46,
  },
  inputText: {
    ...defaultText,
    color: Colors.black,
    padding: 10,
  },
  inputBlock: {
    ...borderStyle,
    ...defaultText,
    color: Colors.black,
    height: 90,
    maxWidth: '100%',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingTop: 13,
    flexWrap: 'wrap',
    backgroundColor: Colors.white,
    borderColor: Colors.iGrey,
  },
  inputLine: {
    ...defaultText,
    color: Colors.black,
    width: '100%',
    borderBottomColor: Colors.darkGrey,
    borderBottomWidth: 1,
    marginTop: 16,
    paddingVertical: 12,
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
    borderColor: Colors.iLightGrey,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  selectedEmoji: {
    borderColor: Colors.iJoloColor,
    backgroundColor: Colors.white,
  },
  unselectedEmoji: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 23,
    color: Colors.black,
  },

  // NOTE inline colors for switching between the intermediate and final versions
  highlightBorder: {
    borderColor: Colors.iJoloColor,
    borderBottomColor: Colors.iJoloColor,
  },
  defaultBorder: {
    borderColor: Colors.iGrey,
    borderBottomColor: Colors.iInputBlack,
  },
  selectedText: {
    color: Colors.iJoloColor,
  },
  defaultText: {
    color: Colors.black,
  },
  unselectedText: {
    color: Colors.black050,
  },
  gradientOff: {
    color: Colors.iLightGrey,
  },
  gradientOnStart: {
    color: 'rgb(145, 25, 66)',
  },
  gradientOnEnd: {
    color: 'rgb(210, 45, 105)',
  },
  trackColor: {
    color: Colors.white,
  },
})

export const styles = isFinalStyle ? finalStyles : intermediateStyles
