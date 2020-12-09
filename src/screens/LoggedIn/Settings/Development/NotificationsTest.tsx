import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { useToasts } from '~/hooks/toasts'
import useErrors from '~/hooks/useErrors'
import { SWErrorCodes } from '~/errors/codes'

const NotificationsTest = () => {
  const { scheduleInfo, scheduleWarning } = useToasts()
  const { showErrorReporting } = useErrors()

  const normal = () => {
    scheduleInfo({
      title: "I'm baby salvia deep v forage",
      message:
        'deep v normcore adaptogen. Direct trade PBR&B vaporware listicle',
    })
  }

  const warning = () => {
    scheduleWarning({
      title: "I'm baby salvia deep v forage aesthetic",
      message: 'deep v normcore adaptogen. Direct trade PBR&B vaporware ',
      interact: {
        label: 'Report',
        onInteract: () => {
          showErrorReporting(new Error(SWErrorCodes.SWUnknown))
        },
      },
    })
  }

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <JoloText
        kind={JoloTextKind.title}
        customStyles={{ alignSelf: 'flex-start' }}
      >
        Notifications
      </JoloText>
      <Btn onPress={normal}>Normal</Btn>
      <Btn onPress={warning}>Warning</Btn>
    </ScreenContainer>
  )
}
export default NotificationsTest
