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
  const { scheduleWarning, scheduleSticky } = useToasts()

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
    // scheduleWarning({
    //   title: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
    //   message:
    //     'consectetur adipisicing elit. Tempora nam quisquam blanditiis dolorum reiciendis. consectetur adipisicing ',
    //   interact: {
    //     label: 'Show',
    //     onInteract: () => {
    //       console.log('Interracted with toast')
    //     },
    //   },
    // })
    // scheduleWarning({
    //   title: 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
    //   message:
    //     'consectetur adipisicing elit. Tempora nam quisquam blanditiis dolorum reiciendis. consectetur adipisicing ',
    // })
    scheduleSticky({
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
    </ScreenContainer>
  )
}

export default Claims
