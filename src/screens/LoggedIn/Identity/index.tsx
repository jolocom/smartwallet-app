import React from 'react'
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import ScreenContainer from '~/components/ScreenContainer'
import { getAttributes } from '~/modules/attributes/selectors'

const Identity = () => {
  const attributes = useSelector(getAttributes)
  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
      >
        {/* {Object.keys(attributes).map((attrKey) => (
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
        ))} */}
      </ScrollView>
    </ScreenContainer>
  )
}

export default Identity
