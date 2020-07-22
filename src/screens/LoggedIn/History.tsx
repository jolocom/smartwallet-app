import React from 'react'
import { View } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Paragraph from '~/components/Paragraph'
import AttributesWidget from '~/components/AttributesWidget'
import { useSelector } from 'react-redux'
import { getInteractionAttributes } from '~/modules/interaction/selectors'

const History: React.FC = () => {
  const attributes = useSelector(getInteractionAttributes)

  return (
    <ScreenContainer>
      <View style={{ width: '100%' }}>
        <Paragraph customStyles={{ marginBottom: 20 }}>
          Below is the widget from the interaction
        </Paragraph>
        <AttributesWidget
          attributes={attributes}
          onCreateNewAttr={(sectionKey) =>
            console.log('Creating new attr for', sectionKey)
          }
          isSelectable={true}
        />
      </View>
    </ScreenContainer>
  )
}

export default History
