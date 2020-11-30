import React from 'react'
import { Alert, View } from 'react-native'
import { useSelector } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'
import { useLoader } from '~/hooks/loader'
import AttributesWidget from '~/components/AttributesWidget'
import { getAttributes } from '~/modules/attributes/selectors'
import { useToasts } from '~/hooks/toasts'
import { useRedirectTo } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import { strings } from '~/translations'

const ContainerComponent: React.FC = ({ children }) => {
  return <View style={{ width: '100%' }}>{children}</View>
}

const Claims: React.FC = () => {
  const redirectToDeleteDoc = useRedirectTo(ScreenNames.DragToConfirm, {
    title: `${strings.DO_YOU_WANT_TO_DELETE} Driving License?`,
    cancelText: strings.CANCEL,
    onComplete: () => console.log('Deleted the doc'),
  })
  const loader = useLoader()
  const { scheduleInfo, scheduleWarning } = useToasts()

  const longFn = () => {
    return new Promise((res, rej) => {
      setTimeout(() => res('done'), 6000)
      // setTimeout(() => rej('oops'), 5000)
    })
  }

  const openLoader = async () => {
    await loader(
      async () => {
        const res = await longFn()
        console.log({ res })
      },
      {
        success: 'Good loader',
        loading:
          'Loader with a very long description to test container height and width',
        failed: 'Bad loader',
      },
    )
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
        label: 'Show',
        onInteract: () => {
          Alert.alert('Hey', 'amsburg activ')
        },
      },
    })
  }

  const attributes = useSelector(getAttributes)

  return (
    <ScreenContainer>
      <ContainerComponent>
        <AttributesWidget
          attributes={attributes}
          onCreateNewAttr={(sectionKey) =>
            console.log('Creating new attr for', sectionKey)
          }
          isSelectable={false}
        />
      </ContainerComponent>
      <Btn onPress={openLoader}>Open loader</Btn>
      <Btn onPress={normal}>Normal</Btn>
      <Btn onPress={warning}>Warning</Btn>
      <Btn onPress={redirectToDeleteDoc}>DeleteDocument</Btn>
    </ScreenContainer>
  )
}

export default Claims
