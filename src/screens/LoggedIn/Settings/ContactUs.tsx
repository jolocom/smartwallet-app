import React, { useMemo, useState } from 'react'

import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { strings } from '~/translations/strings'
import { JoloTextSizes } from '~/utils/fonts'
import Dropdown from './components/Dropdown'
import FieldInput from '~/components/FieldInput'
import { InputValidation, regexValidations } from '~/utils/stringUtils'

const INQUIRIES_LIST = [
  strings.POSSIBLE_PARTNERSHIP,
  strings.ISSUES_WITH_THE_APP,
  strings.I_LOST_MY_WALLET,
  strings.HOW_TO_BECOME_PART_OF_THE_PROJECT,
]

const ContactUs: React.FC = () => {
  const [value, setValue] = useState('')

  const options = useMemo(
    () =>
      INQUIRIES_LIST.map((el) => ({ id: el.split(' ').join(''), value: el })),
    [],
  )

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
        Contact us
      </JoloText>
      <Dropdown options={options} />

      <FieldInput
        validation={regexValidations[InputValidation.email]}
        value={value}
        onChangeText={setValue}
        placeholder={strings.CONTACT_US_GET_IN_TOUCH}
        onValidation={console.log}
      />
    </ScreenContainer>
  )
}

export default ContactUs
