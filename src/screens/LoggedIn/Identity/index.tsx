import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import Input from '~/components/Input'
import ScreenContainer from '~/components/ScreenContainer'
import Widget from '~/components/Widget'
import { getAttributes } from '~/modules/attributes/selectors'

const Identity = () => {
  const attributes = useSelector(getAttributes)
  const [val, setVal] = useState('')
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
            <Widget>
              <Widget.Header.Name value="companyName" />
              <Widget.Field.Static value="Jolocom" />
            </Widget>
          </Widget>
        ))}
        <Input.Block
          value={val}
          updateInput={setVal}
          placeholder="Jot down a random string"
        />
      </ScrollView>
    </ScreenContainer>
  )
}

export default Identity
