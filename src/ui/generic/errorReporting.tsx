import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Picker,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { Container, JolocomButton } from '../structure'
import { connect } from 'react-redux'
import {
  NavigationScreenProp,
  NavigationState,
  ScrollView,
} from 'react-navigation'
import { AppError } from '../../lib/errors'
import {
  black030,
  golden,
  overflowBlack,
  purpleMain,
  sandLight006,
  sandLight080,
  white,
  white021,
  white040,
} from '../../styles/colors'
import { fontMain } from '../../styles/typography'
import ModalDropdown from 'react-native-modal-dropdown'
import { debug } from '../../styles/presets'
import { TextInputField } from '../home/components/textInputField'
import { Button } from 'react-native-material-ui'

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: overflowBlack,
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
    marginTop: 20,
    fontFamily: fontMain,
    color: white,
    fontSize: 16,
  },
  pickerWrapper: {
    paddingLeft: 20,
    backgroundColor: sandLight006,
    height: 50,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: white021,
    color: white,
    fontFamily: fontMain,
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
    backgroundColor: overflowBlack,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: white021,
  },
  inputText: {
    fontFamily: fontMain,
    fontSize: 20,
    color: white,
    padding: 10,
  },
  inputBlock: {
    height: 90,
    maxWidth: '100%',
    backgroundColor: sandLight006,
    marginTop: 16,
    borderColor: white021,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    color: white,
    fontSize: 20,
    fontFamily: fontMain,
    paddingTop: 13,
    flexWrap: 'wrap',
  },
  inputLine: {
    width: '100%',
    borderBottomColor: white,
    borderBottomWidth: 1,
    color: white,
    fontFamily: fontMain,
    fontSize: 20,
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
})

interface PaymentNavigationParams {
  error: AppError | Error | undefined
}

interface Props {
  navigation: NavigationScreenProp<NavigationState, PaymentNavigationParams>
}

const ErrorReportingContainer = (props: Props) => {
  //console.log(props.navigation.state.params.error)
  const [pickedIssue, setIssue] = useState<string>()
  const [contact, setContact] = useState<string>('')

  const issueList = [
    'No internet connection',
    'A random crash',
    'It behaves in a weird way',
    'Please help!!1!',
  ]

  return (
    <Container style={styles.wrapper}>
      <ScrollView>
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Choose the issue</Text>
          <View style={{ marginTop: 20 }}>
            <View style={styles.pickerIconWrapper}>
              <View style={{ width: 15, height: 15, ...debug }} />
            </View>
            <ModalDropdown
              options={issueList}
              style={styles.pickerWrapper}
              textStyle={styles.inputText}
              defaultValue={'Choose related'}
              renderSeparator={() => null}
              dropdownTextHighlightStyle={{ color: golden }}
              animated={true}
              dropdownStyle={styles.pickerDropDown}
              dropdownTextStyle={{
                ...styles.inputText,
                backgroundColor: 'transparent',
                paddingLeft: 20,
                height: 50,
                borderRadius: 8,
              }}
              // NOTE the type of position doesn't include the top property for some reason
              adjustFrame={position => ({
                left: 20,
                right: 20,
                top: position.top + 20,
                height: 'auto',
              })}
              onSelect={(_index, value) => setIssue(value)}
            />
          </View>
        </View>
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Can you be more specific?</Text>
          <Text style={styles.sectionDescription}>
            If the problem is not listed, this is the best place to describe it.
          </Text>
          <TextInput
            style={styles.inputBlock}
            placeholderTextColor={white021}
            numberOfLines={3}
            textAlignVertical={'top'}
            multiline={true}
            placeholder={'Tap to write...'}
          />
        </View>
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Need to talk to us?</Text>
          <TextInput
            placeholder={'Leave us your email or number...'}
            placeholderTextColor={white040}
            style={{
              width: '100%',
              borderBottomColor: white,
              borderBottomWidth: 1,
              color: white,
              fontFamily: fontMain,
              fontSize: 20,
              marginTop: 28,
            }}
          />
          <Text style={styles.sectionDescription}>
            We do not store data and do not spam, any user information will be
            deleted immediately after solving the problem
          </Text>
        </View>
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>Something else?</Text>
          <View style={styles.emojiWrapper}>
            <TouchableOpacity style={styles.emojiButton}></TouchableOpacity>
            <TouchableOpacity style={styles.emojiButton}></TouchableOpacity>
            <TouchableOpacity style={styles.emojiButton}></TouchableOpacity>
            <TouchableOpacity style={styles.emojiButton}></TouchableOpacity>
          </View>
        </View>
        <Button
          text={'Submit report'}
          upperCase={false}
          style={{
            container: {
              borderRadius: 8,
              marginTop: 45,
              marginBottom: 36,
              marginHorizontal: 20,
              maxWidth: '100%',
              height: 56,
              backgroundColor: purpleMain,
            },
            text: {
              fontFamily: fontMain,
              color: white,
              fontSize: 20,
              fontWeight: 'normal',
            },
          }}
        />
      </ScrollView>
    </Container>
  )
}

export const ErrorReporting = connect(
  null,
  null,
)(ErrorReportingContainer)
