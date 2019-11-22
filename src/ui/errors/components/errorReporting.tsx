import React, { useState } from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
// @ts-ignore
import ModalDropdown from 'react-native-modal-dropdown'

import I18n from '../../../locales/i18n'
import { Container } from '../../structure'
import strings from '../../../locales/strings'
import { joloColor, white, white021, white050 } from '../../../styles/colors'
import { UserReport } from '../../../lib/errors'
import { EmojiButton } from './emojiButton'
import { DropdownIcon } from '../../../resources'
import LinearGradient from 'react-native-linear-gradient'
import { ToggleSwitch } from '../../generic/toggleSwitch'
import { styles } from './styles'

interface PositionStyle {
  left?: number
  right?: number
  width?: number
  top?: number
}

enum Inputs {
  None,
  Dropdown,
  Description,
  Contact,
}

enum Emoji {
  Empty = '',
  Shit = '💩',
  Kiss = '😘',
  Facepalm = '🤦‍♀',
  Devil = '👿',
}

interface Props {
  onSubmit: (userReport: UserReport) => void
}

export const ErrorReportingComponent = (props: Props) => {
  const { onSubmit } = props

  const [pickedIssue, setIssue] = useState<string>()
  const [description, setDescription] = useState<string>('')
  const [contact, setContact] = useState<string>('')
  const [currentInput, setInput] = useState<Inputs>(Inputs.None)
  const [toggleState, setToggle] = useState<boolean>(false)
  const [selectedEmoji, setEmoji] = useState<Emoji>(Emoji.Empty)

  const emojiList = [Emoji.Shit, Emoji.Kiss, Emoji.Facepalm, Emoji.Devil]
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
              <DropdownIcon
                style={{
                  zIndex: 2,
                  transform:
                    currentInput === Inputs.Dropdown
                      ? [{ rotate: '180deg' }]
                      : [{ rotate: '360deg' }],
                }}
              />
            </View>
            <ModalDropdown
              options={issueList}
              style={{
                ...styles.pickerWrapper,
                borderColor:
                  currentInput === Inputs.Dropdown ? joloColor : white021,
              }}
              textStyle={{
                ...styles.inputText,
                color: !pickedIssue ? white050 : white,
              }}
              defaultValue={I18n.t(strings.CHOOSE_RELATED)}
              renderSeparator={() => null}
              dropdownTextHighlightStyle={{ color: joloColor }}
              dropdownStyle={styles.pickerDropDown}
              dropdownTextStyle={{
                ...styles.inputText,
                backgroundColor: 'transparent',
                paddingLeft: 20,
                height: 46,
              }}
              adjustFrame={(position: PositionStyle) => ({
                left: 20,
                right: 20,
                top: position.top && position.top + 15,
                height: 'auto',
              })}
              onSelect={(_index, value) => {
                setIssue(value)
              }}
              onDropdownWillShow={() => {
                setInput(Inputs.Dropdown)
                return true
              }}
              onDropdownWillHide={() => {
                setInput(Inputs.None)
                return true
              }}
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
            style={{
              ...styles.inputBlock,
              borderColor:
                currentInput === Inputs.Description ? joloColor : white021,
            }}
            onChangeText={text => setDescription(text)}
            placeholderTextColor={white050}
            numberOfLines={3}
            textAlignVertical={'top'}
            multiline={true}
            placeholder={I18n.t(strings.TAP_TO_WRITE)}
            onFocus={() => setInput(Inputs.Description)}
            onBlur={() => setInput(Inputs.None)}
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
              <ToggleSwitch
                value={toggleState}
                onToggle={() => setToggle(!toggleState)}
                defaultState={false}
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
            placeholderTextColor={white050}
            style={{
              ...styles.inputLine,
              borderBottomColor:
                currentInput === Inputs.Contact ? joloColor : white,
            }}
            onFocus={() => setInput(Inputs.Contact)}
            onBlur={() => setInput(Inputs.None)}
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
              <EmojiButton
                onPress={() => setEmoji(emoji)}
                selected={selectedEmoji}
                emoji={emoji}
              />
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
