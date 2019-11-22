import {
  baseBlack,
  black,
  mediumBlack,
  sandLight080,
  white,
  white021,
} from '../../../styles/colors'
import { fontMain } from '../../../styles/typography'
import { StyleSheet } from 'react-native'

const greyBorderStyle = {
  backgroundColor: mediumBlack,
  borderColor: white021,
  borderWidth: 1,
  borderRadius: 8,
}

const defaultText = {
  fontFamily: fontMain,
  fontSize: 20,
  color: white,
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
    fontSize: 16,
    letterSpacing: 0.11,
    lineHeight: 20,
  },
  pickerWrapper: {
    ...greyBorderStyle,
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
    ...greyBorderStyle,
    backgroundColor: black,
    paddingVertical: 10,
  },
  inputText: {
    ...defaultText,
    padding: 10,
  },
  inputBlock: {
    ...greyBorderStyle,
    ...defaultText,
    height: 90,
    maxWidth: '100%',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingTop: 13,
    flexWrap: 'wrap',
  },
  inputLine: {
    ...defaultText,
    width: '100%',
    borderBottomColor: white,
    borderBottomWidth: 1,
    marginTop: 28,
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
    borderColor: white,
    borderRadius: 50,
  },
  buttonContainer: {
    borderRadius: 8,
    marginTop: 45,
    marginBottom: 36,
    marginHorizontal: 20,
    maxWidth: '100%',
    height: 56,
  },
  buttonText: {
    ...defaultText,
    fontWeight: 'normal',
  },
})

