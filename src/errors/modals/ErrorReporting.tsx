import React, { useState } from 'react'
import ModalScreen from '~/modals/Modal'
import { ErrorScreens } from '../errorContext'
import ScreenContainer from '~/components/ScreenContainer'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import Btn from '~/components/Btn'
import useErrors from '~/hooks/useErrors'
import useSentry from '~/hooks/sentry'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import { debugView } from '~/utils/dev'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'
import Section from '~/screens/LoggedIn/Settings/components/Section'
import { strings } from '~/translations'
import Dropdown from '~/screens/LoggedIn/Settings/components/Dropdown'
import { IOption } from '~/components/Selectable'
import { JoloTextSizes } from '~/utils/fonts'
import Input from '~/components/Input'
import { View } from 'react-native'
import ToggleSwitch from '~/components/ToggleSwitch'
import { regexValidations, InputValidation } from '~/utils/stringUtils'
import { InputValidityState } from '~/components/Input/types'
import { Colors } from '~/utils/colors'

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
  const { errorScreen, resetError, error, showErrorDisplay } = useErrors()
  const { sendReport } = useSentry()

  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const [shouldIncludeLogs, setIncludeLogs] = useState(false)
  const [detailsInput, setDetailsInput] = useState('')

  const [contactValue, setContactValue] = useState('')
  const [contactValid, setContactValid] = useState(true)

  const handleDropdownSelect = (option: IOption<string>) => {
    setSelectedIssue(option.value)
  }

  const handleContactValidation = (state: InputValidityState) =>
    setContactValid(state !== InputValidityState.error)

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
            <Section.Title>{strings.ERROR_REPORTING_RATE}</Section.Title>
          </Section>
        </JoloKeyboardAwareScroll>
      </ScreenContainer>
    </ModalScreen>
  )
}

export default ErrorReporting
