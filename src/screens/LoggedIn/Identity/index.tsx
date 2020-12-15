import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import ScreenContainer from '~/components/ScreenContainer'
import Widget from '~/components/Widget'
import { getAttributes } from '~/modules/attributes/selectors'
import TopSheet from '~/components/TopSheet'
import Btn, { BtnTypes } from '~/components/Btn'

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
          {Object.keys(attributes).map((attrKey) => (
            <Widget>
              <Widget.Header.Name value={attrKey} />
              {attributes[attrKey].map((field) => (
                <Widget.Field.Static value={field.value} />
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
