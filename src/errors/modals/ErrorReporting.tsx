import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import Btn, { BtnTypes } from '~/components/Btn'

import EmojiSelectable from '~/components/EmojiSelectable'
import Input from '~/components/Input'
import { InputValidityState } from '~/components/Input/types'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import ScreenContainer from '~/components/ScreenContainer'
import { IOption } from '~/components/Selectable'
import Toasts from '~/components/Toasts'
import ToggleSwitch from '~/components/ToggleSwitch'
import useConnection from '~/hooks/connection'
import { useSuccess } from '~/hooks/loader'
import useSentry from '~/hooks/sentry'
import useErrors from '~/hooks/useErrors'
import useTranslation from '~/hooks/useTranslation'
import ModalScreen from '~/modals/Modal'
import { getIsAppLocked } from '~/modules/account/selectors'
import Dropdown from '~/screens/LoggedIn/Settings/components/Dropdown'
import Section from '~/screens/LoggedIn/Settings/components/Section'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { SCREEN_HEADER_HEIGHT } from '~/utils/screenSettings'
import { InputValidation, regexValidations } from '~/utils/stringUtils'
import { ErrorScreens } from '../errorContext'

const ErrorReporting = () => {
  const { t } = useTranslation()
  const isAppLocked = useSelector(getIsAppLocked)
  const { errorScreen, resetError } = useErrors()
  const { sendErrorReport } = useSentry()
  const showSuccess = useSuccess()

  // NOTE: cannot use the @useAssertConnection hook b/c it's adapted for screens,
  // but not modals. Should replace the effect hook below when the @ErrorReporting modal
  // becomes a navigation screen
  const { connected, showDisconnectedToast } = useConnection()

  useEffect(() => {
    if (connected === false && errorScreen === ErrorScreens.errorReporting) {
      showDisconnectedToast()
    }
  }, [connected, errorScreen])

  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const [shouldIncludeLogs, setIncludeLogs] = useState(false)
  const [detailsInput, setDetailsInput] = useState('')

  const [contactValue, setContactValue] = useState('')
  const [contactValid, setContactValid] = useState(true)

  const INQUIRIES_LIST = [
    t('ErrorReporting.issueOption_1'),
    t('ErrorReporting.issueOption_2'),
    t('ErrorReporting.issueOption_3'),
    t('ErrorReporting.issueOption_4'),
    t('ErrorReporting.issueOption_5'),
    t('ErrorReporting.issueOption_6'),
    t('ErrorReporting.issueOption_7'),
  ]

  const DROPDOWN_OPTIONS = INQUIRIES_LIST.map((el) => ({
    id: el.split(' ').join(''),
    value: el,
  }))

  const assembledData = {
    issue: selectedIssue,
    details: detailsInput,
    email: contactValue,
  }

  const isSubmitEnabled = () => {
    const fieldValues = Object.values(assembledData).filter(Boolean)

    return fieldValues.length > 1 && contactValid
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
      isVisible={errorScreen === ErrorScreens.errorReporting && !isAppLocked}
      onRequestClose={resetError}
      animationType={'slide'}
    >
      {/* Since the screen is a modal, need to include the @Toasts component for it
      to be visible*/}
      <Toasts />
      <ScreenContainer
        customStyles={{
          justifyContent: 'flex-start',
          paddingTop: 0,
          paddingHorizontal: 0,
        }}
      >
        <NavigationHeader
          type={NavHeaderType.Close}
          onPress={resetError}
          customStyles={{
            position: 'absolute',
            zIndex: 100,
            backgroundColor: Colors.mainBlack,
          }}
        />
        <ScreenContainer.Padding>
          <JoloKeyboardAwareScroll
            style={{
              width: '100%',
              flexGrow: 1,
              paddingTop: SCREEN_HEADER_HEIGHT,
            }}
            contentContainerStyle={{ paddingBottom: 56 + SCREEN_HEADER_HEIGHT }}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
          >
            <Section>
              <Section.Title>{t('ErrorReporting.issueHeader')}</Section.Title>
              <Dropdown
                placeholder={t('ErrorReporting.issuePlaceholder')}
                options={DROPDOWN_OPTIONS}
                onSelect={handleDropdownSelect}
              />
            </Section>

            <Section>
              <Section.Title customStyle={{ marginBottom: 14 }}>
                {t('ErrorReporting.detailsHeader')}
              </Section.Title>
              <JoloText
                size={JoloTextSizes.mini}
                kind={JoloTextKind.subtitle}
                customStyles={{ textAlign: 'left', marginBottom: 32 }}
              >
                {t('ErrorReporting.detailsSubheader')}
              </JoloText>
              <JoloKeyboardAwareScroll.InputContainer>
                {({ focusInput }) => (
                  <Input.TextArea
                    value={detailsInput}
                    limit={500}
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
                    {t('ErrorReporting.logsHeader')}
                  </JoloText>
                  <JoloText
                    size={JoloTextSizes.mini}
                    customStyles={{ textAlign: 'left' }}
                  >
                    {t('ErrorReporting.logsSubheader')}
                  </JoloText>
                </View>
              </View>
            </Section>

            <Section customStyles={{ marginBottom: 64 }}>
              <Section.Title customStyle={{ marginBottom: 0 }}>
                {t('ErrorReporting.contactHeader')}
              </Section.Title>
              <JoloKeyboardAwareScroll.InputContainer>
                {({ focusInput }) => (
                  <Input.Underline
                    validation={regexValidations[InputValidation.email]}
                    value={contactValue}
                    updateInput={setContactValue}
                    placeholder={t('ErrorReporting.contactPlaceholder')}
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
                  ? t('ErrorReporting.contactInputInfo')
                  : t('ErrorReporting.contactInputError')}
              </JoloText>
            </Section>
            <Section>
              <Section.Title customStyle={{ marginBottom: 24 }}>
                {t('ErrorReporting.rateHeader')}
              </Section.Title>
              <EmojiSelectable />
            </Section>

            <Btn.Online
              type={BtnTypes.primary}
              onPress={handleSubmit}
              disabled={!isSubmitEnabled()}
            >
              {t('ErrorReporting.submitBtn')}
            </Btn.Online>
          </JoloKeyboardAwareScroll>
        </ScreenContainer.Padding>
      </ScreenContainer>
    </ModalScreen>
  )
}

export default ErrorReporting
