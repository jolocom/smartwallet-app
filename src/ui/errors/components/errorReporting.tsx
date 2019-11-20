import React, { useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
// @ts-ignore
import ModalDropdown from 'react-native-modal-dropdown'

import I18n from '../../../locales/i18n'
import { Container } from '../../structure'
import strings from '../../../locales/strings'
import {
  baseBlack,
  black040,
  darkGrey,
  overflowBlack,
  purpleMain,
  sandLight080,
  white,
  white021,
  white040,
  white050,
} from '../../../styles/colors'
import { fontMain } from '../../../styles/typography'
import { UserReport } from '../../../lib/errors'
import { EmojiButton } from './emojiButton'
import { DropdownIcon } from '../../../resources'
import LinearGradient from 'react-native-linear-gradient'

const greyBorderStyle = {
  //backgroundColor: sandLight006,
  backgroundColor: black040,
  borderColor: white021,
  borderWidth: 1,
  borderRadius: 8,
}

const defaultText = {
  fontFamily: fontMain,
  fontSize: 20,
  color: white,
}

const styles = StyleSheet.create({
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
    backgroundColor: overflowBlack,
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

interface PositionStyle {
  left?: number
  right?: number
  width?: number
  top?: number
}

interface Props {
  onSubmit: (userReport: UserReport) => void
}

export const ErrorReportingComponent = (props: Props) => {
  const { onSubmit } = props

  const [pickedIssue, setIssue] = useState<string>()
  const [description, setDescription] = useState<string>('')
  const [contact, setContact] = useState<string>('')
  const [logToggle, setToggle] = useState<boolean>(false)

  const emojiList = ['💩', '😘', '🤦‍♀', '👿']
  const issueList = [
    'No internet connection',
    'A random crash',
    'It behaves in a weird way',
    'Please help!!1!',
    'It behaves in a weird way',
    'Please help!!1!',
  ]

  const userReport = {
    userError: pickedIssue,
    userDescription: description,
    userContact: contact,
  }

  return (
    <Container style={styles.wrapper}>
      <ScrollView>
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>
            {I18n.t(strings.CHOOSE_THE_ISSUE)}
          </Text>
          <View style={{ marginTop: 20 }}>
            <View style={styles.pickerIconWrapper}>
              <DropdownIcon />
            </View>
            <ModalDropdown
              options={issueList}
              style={styles.pickerWrapper}
              textStyle={styles.inputText}
              defaultValue={I18n.t(strings.CHOOSE_RELATED)}
              renderSeparator={() => null}
              dropdownTextHighlightStyle={{ color: purpleMain }}
              animated={true}
              dropdownStyle={styles.pickerDropDown}
              dropdownTextStyle={{
                ...styles.inputText,
                backgroundColor: 'transparent',
                paddingLeft: 20,
                height: 50,
              }}
              adjustFrame={(position: PositionStyle) => ({
                left: 20,
                right: 20,
                top: position.top && position.top + 20,
                height: 'auto',
              })}
              onSelect={(_index, value) => setIssue(value)}
            />
          </View>
        </View>
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>
            {I18n.t(strings.CAN_YOU_BE_MORE_SPECIFIC)}
          </Text>
          <Text style={{ ...styles.sectionDescription, marginTop: 16 }}>
            {I18n.t(
              strings.IF_THE_PROBLEM_IS_NOT_LISTED_THIS_IS_THE_BEST_PLACE_TO_DESCRIBE_IT,
            )}
          </Text>
          <TextInput
            style={styles.inputBlock}
            onChangeText={text => setDescription(text)}
            placeholderTextColor={white021}
            numberOfLines={3}
            textAlignVertical={'top'}
            multiline={true}
            placeholder={I18n.t(strings.TAP_TO_WRITE)}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
            }}
          >
            <View
              style={{
                width: 70,
                height: 'auto',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              <Switch
                value={logToggle}
                trackColor={{
                  false: darkGrey,
                  true: darkGrey,
                }}
                thumbTintColor={logToggle ? purpleMain : 'rgb(12, 12, 12)'}
                onValueChange={value => setToggle(value)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionDescription}>Include your logs</Text>
              <Text
                style={{
                  ...styles.sectionDescription,
                  color: white050,
                  marginTop: 4,
                }}
              >
                This includes some private metadata info (file sizes, but not
                names or contents) but it will help developers fix bugs more
                quickly.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>
            {I18n.t(strings.NEED_TO_TALK_TO_US)}
          </Text>
          <TextInput
            onChangeText={text => setContact(text)}
            placeholder={I18n.t(strings.LEAVE_US_YOUR_EMAIL_AND_NUMBER)}
            placeholderTextColor={white040}
            style={styles.inputLine}
          />
          <Text style={{ ...styles.sectionDescription, marginTop: 12 }}>
            {I18n.t(
              strings.WE_DO_NOT_STORE_ANY_DATA_AND_DO_NOT_SPAM_ANY_USER_INFORMATION_WILL_BE_DELETED_IMMEDIATELY_AFTER_SOLVING_THE_PROBLEM,
            )}
          </Text>
        </View>
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>
            {I18n.t(strings.SOMETHING_ELSE)}
          </Text>
          <View style={styles.emojiWrapper}>
            {emojiList.map(emoji => (
              <EmojiButton emoji={emoji} />
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          activeOpacity={0.8}
          onPress={() => onSubmit(userReport)}
        >
          <LinearGradient
            colors={['rgb(145, 25, 66)', 'rgb(210, 45, 105)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 8,
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.buttonText}>
              {I18n.t(strings.SUBMIT_REPORT)}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  )
}
