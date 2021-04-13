import React, { useMemo, useState } from 'react'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import Dropdown from './components/Dropdown'
import { IOption } from '~/components/Selectable'
import Btn, { BtnTypes } from '~/components/Btn'
import JoloKeyboardAwareScroll from '~/components/JoloKeyboardAwareScroll'

import { strings } from '~/translations/strings'
import { JoloTextSizes } from '~/utils/fonts'
import { InputValidation, regexValidations } from '~/utils/stringUtils'
import { Colors } from '~/utils/colors'
import useSentry from '~/hooks/sentry'
import { useGoBack } from '~/hooks/navigation'
import { useSuccess } from '~/hooks/loader'

import Section from './components/Section'
import Input from '~/components/Input'
import { InputValidityState } from '~/components/Input/types'

const INQUIRIES_LIST = [
  strings.POSSIBLE_PARTNERSHIP,
  strings.ISSUES_WITH_THE_APP,
  strings.I_LOST_MY_WALLET,
  strings.HOW_TO_BECOME_PART_OF_THE_PROJECT,
]

const ContactUs: React.FC = () => {
  const navigateBack = useGoBack()
  const showSuccess = useSuccess()
  const { sendContactReport } = useSentry()

  const [contactValue, setContactValue] = useState('')
  const [contactValid, setContactValid] = useState(true)
  const [detailsInput, setDetailsInput] = useState('')
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)

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

    return fieldValues.length > 1
  }

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-end', flex: 1, paddingTop: 0 }}
    >
      <JoloKeyboardAwareScroll
        style={{ width: '100%', flexGrow: 1 }}
        contentContainerStyle={{ paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        enableOnAndroid
      >
        <Section>
          <Section.Title>
            {strings.WHAT_WE_ARE_GOING_TO_TALK_ABOUT}
          </Section.Title>
          <Dropdown options={options} onSelect={handleDropdownSelect} />
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
            {strings.DARE_TO_SUGGEST_SMTH}
          </JoloText>
          <JoloKeyboardAwareScroll.InputContainer>
            {({ focusInput }) => (
              <Input.TextArea
                value={detailsInput}
                updateInput={setDetailsInput}
                onFocus={focusInput}
              />
            )}
          </JoloKeyboardAwareScroll.InputContainer>
        </Section>

        <Section customStyles={{ marginBottom: 84 }}>
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
        <Btn
          type={BtnTypes.primary}
          onPress={handleSubmit}
          disabled={!contactValid || !isBtnEnabled()}
        >
          {strings.SEND}
        </Btn>
      </JoloKeyboardAwareScroll>
    </ScreenContainer>
  )
}

export default ContactUs
