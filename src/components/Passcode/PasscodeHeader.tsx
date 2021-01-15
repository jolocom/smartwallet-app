import React from 'react'
import { Colors } from '~/utils/colors'
import { IPasscodeHeaderProps, usePasscode } from '.'
import JoloText, { JoloTextKind } from '../JoloText'

const PasscodeHeader: React.FC<IPasscodeHeaderProps> = ({
  title,
  errorTitle,
}) => {
  const { pinError } = usePasscode()
  const displayedTitle = pinError ? errorTitle : title
  return (
    <JoloText
      kind={JoloTextKind.title}
      color={Colors.white90}
      customStyles={{ marginBottom: 16 }}
    >
      {displayedTitle}
    </JoloText>
  )
}

export default PasscodeHeader
