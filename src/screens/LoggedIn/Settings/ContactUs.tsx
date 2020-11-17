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

const INQUIRIES_LIST = [
  strings.POSSIBLE_PARTNERSHIP,
  strings.ISSUES_WITH_THE_APP,
  strings.I_LOST_MY_WALLET,
  strings.HOW_TO_BECOME_PART_OF_THE_PROJECT,
]

const ContactUs: React.FC = () => {
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

  const handleSubmit = () => {
    const assembledData = {
      issue: selectedIssue,
      details: detailsInput,
      email: contactValue,
    }

    console.log('Submitting ', assembledData)
  }

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 150,
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
        <Btn type={BtnTypes.primary} onPress={handleSubmit}>
          {strings.SEND}
        </Btn>
      </ScrollView>
    </ScreenContainer>
  )
}

export default ContactUs
