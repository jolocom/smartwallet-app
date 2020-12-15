import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import { getAttributes } from '~/modules/attributes/selectors'
import TopSheet from '~/components/TopSheet'
import Btn, { BtnTypes } from '~/components/Btn'
import Widget from '~/components/Widget'
import { AttributeTypes } from '~/types/credentials'
import { attributeConfig } from '~/config/claims'

const Identity = () => {
  const attributes = useSelector(getAttributes)
  const [showTopSheet, setShowTopSheet] = useState(true)

  return (
    <ScreenContainer
      isFullscreen={showTopSheet}
      customStyles={{ paddingHorizontal: 0 }}
    >
      {showTopSheet ? (
        <TopSheet isVisible={showTopSheet}>
          <Btn onPress={() => setShowTopSheet(false)} type={BtnTypes.senary}>
            Close
          </Btn>
        </TopSheet>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          style={{ width: '100%', paddingHorizontal: '5%' }}
          showsVerticalScrollIndicator={false}
        >
          {Object.keys(attributes).map((attrType) => (
            <Widget>
              <Widget.Header.Name
                value={attributeConfig[attrType as AttributeTypes].label}
              />
              {attributes[attrType as AttributeTypes].map((field) => (
                <Widget.Field.Static
                  value={Object.values(field.value).join(' ')}
                />
              ))}
              <Widget>
                <Widget.Header.Name value="companyName" />
                <Widget.Field.Static value="Jolocom" />
              </Widget>
            </Widget>
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  )
}

export default Identity
