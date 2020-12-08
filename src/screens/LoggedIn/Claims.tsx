import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'
import AttributesWidget from '~/components/AttributesWidget'
import { getAttributes } from '~/modules/attributes/selectors'
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
      <Btn onPress={redirectToDeleteDoc}>DeleteDocument</Btn>
    </ScreenContainer>
  )
}

export default Claims
