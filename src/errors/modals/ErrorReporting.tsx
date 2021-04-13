import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import Btn, { BtnTypes } from '~/components/Btn'

import EmojiSelectable from '~/components/EmojiSelectable'
import Input from '~/components/Input'
import { InputValidityState } from '~/components/Input/types'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import ScreenContainer from '~/components/ScreenContainer'
import { IOption } from '~/components/Selectable'
import ToggleSwitch from '~/components/ToggleSwitch'
import { useSuccess } from '~/hooks/loader'
import useSentry from '~/hooks/sentry'
import useErrors from '~/hooks/useErrors'
import ModalScreen from '~/modals/Modal'
import Dropdown from '~/screens/LoggedIn/Settings/components/Dropdown'
import Section from '~/screens/LoggedIn/Settings/components/Section'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { InputValidation, regexValidations } from '~/utils/stringUtils'
import { ErrorScreens } from '../errorContext'

//FIXME: add the real strings
const INQUIRIES_LIST = [
  strings.POSSIBLE_PARTNERSHIP,
  strings.ISSUES_WITH_THE_APP,
  strings.I_LOST_MY_WALLET,
  strings.HOW_TO_BECOME_PART_OF_THE_PROJECT,
]

const DROPDOWN_OPTIONS = INQUIRIES_LIST.map((el) => ({
  id: el.split(' ').join(''),
  value: el,
}))

const ErrorReporting = () => {
  const { errorScreen, resetError } = useErrors()
  const { sendErrorReport } = useSentry()
  const showSuccess = useSuccess()

  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const [shouldIncludeLogs, setIncludeLogs] = useState(false)
  const [detailsInput, setDetailsInput] = useState('')

  const [contactValue, setContactValue] = useState('')
  const [contactValid, setContactValid] = useState(true)

  const assembledData = {
    issue: selectedIssue,
    details: detailsInput,
    email: contactValue,
  }

  const isSubmitEnabled = () => {
    const fieldValues = Object.values(assembledData).filter(Boolean)

    return fieldValues.length > 1
  }

  const handleResetState = () => {
    setSelectedIssue(null)
    setIncludeLogs(false)
    setDetailsInput('')
    setContactValue('')
  }

  const handleSubmit = () => {
    sendErrorReport(assembledData, shouldIncludeLogs)
    showSuccess(resetError)
  }

  const handleDropdownSelect = (option: IOption<string>) => {
    setSelectedIssue(option.value)
  }

  const handleContactValidation = (state: InputValidityState) =>
    setContactValid(state !== InputValidityState.error)

  useEffect(() => {
    if (errorScreen !== ErrorScreens.errorReporting) {
      handleResetState()
    }
  }, [errorScreen])
  return (
    <ModalScreen
      isVisible={errorScreen === ErrorScreens.errorReporting}
      animationType={'slide'}
    >
      <ScreenContainer
        customStyles={{
          justifyContent: 'flex-start',
          paddingTop: 0,
        }}
      >
        <NavigationHeader
          type={NavHeaderType.Close}
          onPress={resetError}
          customStyles={{ paddingHorizontal: 0 }}
        />
        <JoloKeyboardAwareScroll
          style={{ width: '100%', flexGrow: 1 }}
          contentContainerStyle={{ paddingBottom: 36 }}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          enableOnAndroid
        >
          <Section>
            <Section.Title>
              {/* FIXME: string */}
              {strings.WHAT_WE_ARE_GOING_TO_TALK_ABOUT}
            </Section.Title>
            <Dropdown
              options={DROPDOWN_OPTIONS}
              onSelect={handleDropdownSelect}
            />
          </Section>

          <Section>
            <Section.Title customStyle={{ marginBottom: 14 }}>
              {strings.ANYTHING_SPECIFIC_TO_MENTION}
            </Section.Title>
            <JoloText
              size={JoloTextSizes.mini}
              kind={JoloTextKind.subtitle}
              customStyles={{ textAlign: 'left', marginBottom: 32 }}
            >
              {/* FIXME: strings */}
              {strings.DARE_TO_SUGGEST_SMTH}
            </JoloText>
            <JoloKeyboardAwareScroll.InputContainer>
              {({ focusInput }) => (
                <Input.TextArea
                  value={detailsInput}
                  updateInput={setDetailsInput}
                  onFocus={focusInput}
                  customStyles={{ height: 80 }}
                />
              )}
            </JoloKeyboardAwareScroll.InputContainer>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginTop: 24,
              }}
            >
              <View style={{ width: 70, justifyContent: 'center' }}>
                <ToggleSwitch
                  on={shouldIncludeLogs}
                  onToggle={() => setIncludeLogs((prev) => !prev)}
                />
              </View>
              <View style={{ flex: 1, width: '100%' }}>
                <JoloText
                  size={JoloTextSizes.mini}
                  customStyles={{ textAlign: 'left', marginBottom: 4 }}
                >
                  {strings.INCLUDE_LOGS}
                </JoloText>
                <JoloText
                  size={JoloTextSizes.mini}
                  customStyles={{ textAlign: 'left' }}
                >
                  {strings.ERROR_REPORTING_LOGS_WARNING}
                </JoloText>
              </View>
            </View>
          </Section>

          <Section customStyles={{ marginBottom: 64 }}>
            <Section.Title customStyle={{ marginBottom: 0 }}>
              {strings.WANT_TO_GET_IN_TOUCH}
            </Section.Title>
            <JoloKeyboardAwareScroll.InputContainer>
              {({ focusInput }) => (
                <Input.Underline
                  validation={regexValidations[InputValidation.email]}
                  value={contactValue}
                  updateInput={setContactValue}
                  placeholder={strings.CONTACT_US_GET_IN_TOUCH}
                  onValidation={handleContactValidation}
                  onFocus={focusInput}
                />
              )}
            </JoloKeyboardAwareScroll.InputContainer>
            <JoloText
              size={JoloTextSizes.mini}
              kind={JoloTextKind.subtitle}
              color={contactValid ? Colors.white30 : Colors.error}
              customStyles={{ textAlign: 'left', marginTop: 12 }}
            >
              {contactValid
                ? strings.WE_DO_NOT_STORE_DATA
                : strings.PLEASE_ENTER_A_VALID_EMAIL}
            </JoloText>
          </Section>
          <Section>
            <Section.Title customStyle={{ marginBottom: 24 }}>
              {strings.ERROR_REPORTING_RATE}
            </Section.Title>
            <EmojiSelectable />
          </Section>

          <Btn
            type={BtnTypes.primary}
            onPress={handleSubmit}
            disabled={!contactValid || !isSubmitEnabled()}
          >
            {strings.SEND}
          </Btn>
        </JoloKeyboardAwareScroll>
      </ScreenContainer>
    </ModalScreen>
  )
}

export default ErrorReporting
