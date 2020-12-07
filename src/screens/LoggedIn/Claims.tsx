import React from 'react'
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'
import { useLoader } from '~/hooks/loader'
import { getAttributes } from '~/modules/attributes/selectors'
import { useToasts } from '~/hooks/toasts'
import useErrors from '~/hooks/useErrors'
import { SWErrorCodes } from '~/errors/codes'
import { useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import { strings } from '~/translations'
import Widget from '~/components/Widget'

const Claims: React.FC = () => {
  const redirectToDeleteDoc = useRedirectTo(ScreenNames.DragToConfirm, {
    title: `${strings.DO_YOU_WANT_TO_DELETE} Driving License?`,
    cancelText: strings.CANCEL,
    onComplete: () => console.log('Deleted the doc'),
  })
  const loader = useLoader()
  const { scheduleInfo, scheduleWarning } = useToasts()
  const { showErrorReporting } = useErrors()

  const longFn = () => {
    return new Promise((res, rej) => {
      setTimeout(() => res('done'), 6000)
      // setTimeout(() => rej('oops'), 5000)
    })
  }

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

  const attributes = useSelector(getAttributes)
  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(attributes).map((attrKey) => (
          <Widget>
            <Widget.Header.Name value={attrKey} />
            {attributes[attrKey].map((field) => (
              <Widget.Field.Static value={field.value} />
            ))}
          </Widget>
        ))}
        <Btn onPress={normal}>Normal</Btn>
        <Btn onPress={warning}>Warning</Btn>
        <Btn onPress={redirectToDeleteDoc}>DeleteDocument</Btn>
      </ScrollView>
    </ScreenContainer>
  )
}

export default Claims
