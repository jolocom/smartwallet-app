import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import Widget from '~/components/Widget'
import Field from '~/components/Widget/Field'
import { attributeConfig } from '~/config/claims'
import { getAttributes } from '~/modules/attributes/selectors'
import { AttributeTypes } from '~/types/credentials'

const IdentityCredentials = () => {
  const attributes = useSelector(getAttributes)

  const handleOnCreate = (type: AttributeTypes) => {
    console.log('Creating for an attribute type:', type)
  }

  return (
    <View testID="identity-credentials-present" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.entries(attributeConfig).map(([aKey, aVal]) => (
          <Widget onCreate={() => handleOnCreate(aKey)}>
            <Widget.Header>
              <Widget.Header.Name value={aVal.label} />
              <Widget.Header.Action.CreateNew />
            </Widget.Header>
            <Field.Static value="pencil" />
          </Widget>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
})

export default IdentityCredentials
