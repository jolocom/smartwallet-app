import React from 'react'
import { Colors } from '~/utils/colors'
import { IPasscodeHeaderProps } from './types'
import { usePasscode } from './context'
import JoloText, { JoloTextKind } from '../JoloText'
import BP from '~/utils/breakpoints'

const PasscodeHeader: React.FC<IPasscodeHeaderProps> = ({
  title,
  errorTitle,
  customStyles,
}) => {
  const { pinError } = usePasscode()
  const displayedTitle = pinError ? errorTitle : title
  return (
    <JoloText
      kind={JoloTextKind.title}
      color={Colors.white90}
      customStyles={[
        { marginBottom: BP({ default: 16, large: 32 }) },
        customStyles,
      ]}
    >
      {displayedTitle}
    </JoloText>
  )
}

export default PasscodeHeader
