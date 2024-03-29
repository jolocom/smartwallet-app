import React, { useMemo, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import Dropdown from './components/Dropdown'
import { IOption } from '~/components/Selectable'
import Btn, { BtnTypes } from '~/components/Btn'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'
import { JoloTextSizes } from '~/utils/fonts'
import { InputValidation, regexValidations } from '~/utils/stringUtils'
import { Colors } from '~/utils/colors'
import useSentry from '~/hooks/sentry'
import { useGoBack } from '~/hooks/navigation'
import { useSuccess } from '~/hooks/loader'
import Section from './components/Section'
import Input from '~/components/Input'
import { InputValidityState } from '~/components/Input/types'
import { useAssertConnection } from '~/hooks/connection'
import { useAdjustResizeInputMode } from '~/hooks/generic'
import useTranslation from '~/hooks/useTranslation'
import NavigationHeader, {
  NavHeaderType,
  NavigationHeaderText,
} from '~/components/NavigationHeader'

const ContactUs: React.FC = () => {
  const { t } = useTranslation()
  const navigateBack = useGoBack()
  const showSuccess = useSuccess()
  const { sendContactReport } = useSentry()

  const [contactValue, setContactValue] = useState('')
  const [contactValid, setContactValid] = useState(true)
  const [detailsInput, setDetailsInput] = useState('')
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)

  useAdjustResizeInputMode()
  useAssertConnection()

  const INQUIRIES_LIST = [
    t('ContactUs.issueOption_1'),
    t('ContactUs.issueOption_2'),
    t('ContactUs.issueOption_3'),
    t('ContactUs.issueOption_4'),
    t('ContactUs.issueOption_5'),
  ]

  const options = useMemo(
    () =>
      INQUIRIES_LIST.map((el) => ({ id: el.split(' ').join(''), value: el })),
    [],
  )

  const handleContactValidation = (state: InputValidityState) =>
    setContactValid(state !== InputValidityState.error)

  const handleDropdownSelect = (option: IOption<string>) => {
    setSelectedIssue(option.value)
  }

  const assembledData = {
    issue: selectedIssue,
    details: detailsInput,
    email: contactValue,
  }

  const handleSubmit = () => {
    sendContactReport(assembledData)
    showSuccess(navigateBack)
  }

  const isBtnEnabled = () => {
    const fieldValues = Object.values(assembledData).filter(Boolean)

    return fieldValues.length > 1 && contactValid
  }

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        flex: 1,
        paddingHorizontal: 0,
        paddingTop: 0,
      }}
    >
      <NavigationHeader type={NavHeaderType.Back} onPress={navigateBack}>
        <NavigationHeaderText>
          {t('Settings.contactUsBlock')}
        </NavigationHeaderText>
      </NavigationHeader>
      <ScrollView>
        <ScreenContainer.Padding>
          <Section>
            <Section.Title>{t('ContactUs.issueHeader')}</Section.Title>
            <Dropdown
              placeholder={t('ContactUs.issuePlaceholder')}
              options={options}
              onSelect={handleDropdownSelect}
            />
          </Section>
          <Section>
            <Section.Title customStyles={{ marginBottom: 14 }}>
              {t('ContactUs.suggestionHeader')}
            </Section.Title>
            <JoloText
              size={JoloTextSizes.mini}
              kind={JoloTextKind.subtitle}
              customStyles={{ textAlign: 'left', marginBottom: 32 }}
            >
              {t('ContactUs.suggestionSubheader')}
            </JoloText>
            <JoloKeyboardAwareScroll.InputContainer>
              {({ focusInput }) => (
                <Input.TextArea
                  limit={500}
                  value={detailsInput}
                  updateInput={(v) => setDetailsInput(v.trimLeft())}
                  onFocus={focusInput}
                />
              )}
            </JoloKeyboardAwareScroll.InputContainer>
          </Section>
          <Section customStyles={{ marginBottom: 84 }}>
            <Section.Title customStyles={{ marginBottom: 0 }}>
              {t('ContactUs.contactHeader')}
            </Section.Title>
            <JoloKeyboardAwareScroll.InputContainer>
              {({ focusInput }) => (
                <Input.Underline
                  validation={regexValidations[InputValidation.email]}
                  value={contactValue}
                  updateInput={setContactValue}
                  placeholder={t('ContactUs.contactPlaceholder')}
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
                ? t('ContactUs.contactInputInfo')
                : t('ErrorReporting.contactInputError')}
            </JoloText>
          </Section>
          <Btn.Online
            type={BtnTypes.primary}
            onPress={handleSubmit}
            disabled={!isBtnEnabled()}
            style={{ paddingBottom: 16 }}
          >
            {t('ContactUs.submitBtn')}
          </Btn.Online>
        </ScreenContainer.Padding>
      </ScrollView>
    </ScreenContainer>
  )
}

export default ContactUs
