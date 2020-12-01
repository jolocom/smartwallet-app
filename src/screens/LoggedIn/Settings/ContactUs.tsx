import React, { useMemo, useState } from 'react'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { strings } from '~/translations/strings'
import { JoloTextSizes } from '~/utils/fonts'
import Dropdown from './components/Dropdown'
import FieldInput, { InputValidityState } from '~/components/FieldInput'
import { InputValidation, regexValidations } from '~/utils/stringUtils'
import TextArea from './components/TextArea'
import Section from './components/Section'
import { ScrollView } from 'react-native'
import { Colors } from '~/utils/colors'
import Btn, { BtnTypes } from '~/components/Btn'
import { IOption } from '~/components/Selectable'
import useSentry from '~/hooks/sentry'
import { useNavigateBack } from '~/hooks/navigation'
import { useSuccess } from '~/hooks/loader'

const INQUIRIES_LIST = [
  strings.POSSIBLE_PARTNERSHIP,
  strings.ISSUES_WITH_THE_APP,
  strings.I_LOST_MY_WALLET,
  strings.HOW_TO_BECOME_PART_OF_THE_PROJECT,
]

const ContactUs: React.FC = () => {
  const navigateBack = useNavigateBack()
  const showSuccess = useSuccess()
  const { sendReport } = useSentry()

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
    sendReport(assembledData)
    showSuccess()
    navigateBack()
  }

  const isBtnEnabled = () => {
    const fieldValues = Object.values(assembledData)
      .map((el) => !!el)
      .filter((el) => el)

    return fieldValues.length > 1
  }

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start', paddingTop: 0 }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 35,
          paddingTop: 12,
        }}
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <Section
          hasBlock={false}
          title={strings.WHAT_WE_ARE_GOING_TO_TALK_ABOUT}
        >
          <Dropdown options={options} onSelect={handleDropdownSelect} />
        </Section>
        <Section
          hasBlock={false}
          title={strings.ANYTHING_SPECIFIC_TO_MENTION}
          titleStyles={{ marginBottom: 14 }}
        >
          <JoloText
            size={JoloTextSizes.mini}
            kind={JoloTextKind.subtitle}
            customStyles={{ textAlign: 'left', marginBottom: 32 }}
          >
            {strings.DARE_TO_SUGGEST_SMTH}
          </JoloText>
          <TextArea input={detailsInput} setInput={setDetailsInput} />
        </Section>
        <Section
          hasBlock={false}
          title={strings.WHAT_WE_ARE_GOING_TO_TALK_ABOUT}
          titleStyles={{ marginBottom: 12 }}
          customStyles={{ marginBottom: 84 }}
        >
          <FieldInput
            validation={regexValidations[InputValidation.email]}
            value={contactValue}
            onChangeText={setContactValue}
            placeholder={strings.CONTACT_US_GET_IN_TOUCH}
            onValidation={handleContactValidation}
          />
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
      </ScrollView>
    </ScreenContainer>
  )
}

export default ContactUs
