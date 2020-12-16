import React from 'react'
import { Colors } from '~/utils/colors'
import { IPasscodeHeaderProps } from '.'
import JoloText, { JoloTextKind } from '../JoloText'

const PasscodeHeader: React.FC<IPasscodeHeaderProps> = ({ title }) => {
  return (
    <JoloText
      kind={JoloTextKind.title}
      color={Colors.white90}
      customStyles={{ marginBottom: 16 }}
    >
      {title}
    </JoloText>
  )
}

export default PasscodeHeader
