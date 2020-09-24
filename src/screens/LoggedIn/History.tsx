import React, { useState } from 'react'
import { View } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import AttributesWidget from '~/components/AttributesWidget'
import Btn, { BtnTypes } from '~/components/Btn'
import { useSelector, useDispatch } from 'react-redux'
import { resetInteraction } from '~/modules/interaction/actions'
import { useSetInteractionAttributes } from '~/hooks/attributes'
import { getAvailablaAttributesToShare } from '~/modules/interaction/selectors'

const History: React.FC = () => {
  const attributes = useSelector(getAvailablaAttributesToShare)
  const [isWidgetShown, setIsWidgetShown] = useState(false)

  const dispatch = useDispatch()
  const setInteractionAttributes = useSetInteractionAttributes()

  const handleShareCredentials = () => {
    setIsWidgetShown(true)
    setInteractionAttributes()
  }

  const handleResetInteraction = () => {
    setIsWidgetShown(false)
    dispatch(resetInteraction())
  }

  return (
    <ScreenContainer>
      <View style={{ width: '100%' }}>
        {!isWidgetShown && (
          <Btn onPress={handleShareCredentials}>Share attributes</Btn>
        )}
        {isWidgetShown && (
          <>
            <AttributesWidget
              attributes={attributes}
              onCreateNewAttr={(sectionKey) =>
                console.log('Creating new attr for', sectionKey)
              }
              isSelectable={true}
            />
            <Btn type={BtnTypes.secondary} onPress={handleResetInteraction}>
              Reset Interaction
            </Btn>
          </>
        )}
      </View>
    </ScreenContainer>
  )
}

export default History
