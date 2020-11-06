import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'
import { useLoader } from '~/hooks/loader'
import AttributesWidget from '~/components/AttributesWidget'
import { getAttributes } from '~/modules/attributes/selectors'
import { useToasts } from '~/hooks/toasts'

const ContainerComponent: React.FC = ({ children }) => {
  return <View style={{ width: '100%' }}>{children}</View>
}

const Claims: React.FC = () => {
  const loader = useLoader()
  const { scheduleWarning, scheduleSticky, scheduleInfo } = useToasts()

  const openLoader = async () => {
    await loader(
      async () => {
        // throw new Error('test')
      },
      {
        success: 'Good loader',
        loading:
          'Loader with a very long description to test container height and width',
        failed: 'Bad loader',
      },
    )
  }

  const scheduleInfoNotification = () => {
    scheduleInfo({
      title: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
      message:
        'consectetur adipisicing elit. Tempora nam quisquam blanditiis dolorum reiciendis. consectetur adipisicing ',
      interact: {
        label: 'Show',
        onInteract: () => {
          console.log('Interracted with toast')
        },
      },
    })
  }

  const scheduleWarningNotification = () => {
    scheduleWarning({
      title: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
      message:
        'consectetur adipisicing elit. Tempora nam quisquam blanditiis dolorum reiciendis. consectetur adipisicing ',
      interact: {
        label: 'Show',
        onInteract: () => {
          console.log('Interracted with toast')
        },
      },
    })
  }

  const scheduleStickyNotification = () => {
    scheduleSticky({
      title: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
      message: 'consectetur adipisicing elit. ',
    })
  }

  const scheduleStickyInteractNotification = () => {
    scheduleSticky({
      title: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
      message: 'consectetur adipisicing elit. ',
      interact: {
        label: 'Show',
        onInteract: () => {
          console.log('Interracted with toast')
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
      <Btn onPress={scheduleInfoNotification}>Schedule Info</Btn>
      <Btn onPress={scheduleWarningNotification}>Schedule Warning</Btn>
      <Btn onPress={scheduleStickyNotification}>Schedule Sticky</Btn>
      <Btn onPress={scheduleStickyInteractNotification}>
        Schedule Sticky Interact
      </Btn>
    </ScreenContainer>
  )
}

export default Claims
