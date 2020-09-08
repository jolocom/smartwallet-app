import React, { useState, Dispatch, SetStateAction } from 'react'
import { useSelector } from 'react-redux'
import { TextInput, ScrollView, View } from 'react-native'
import { Picker } from '@react-native-community/picker'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'
import { useCreateAttributes } from '~/hooks/attributes'
import Link from '~/components/Link'
import { AttrKeys } from '~/types/credentials'
import { Colors } from '~/utils/colors'
import { fieldNames } from '~/utils/dataMapping'
import Paragraph from '~/components/Paragraph'
import Header from '~/components/Header'
import { getAllCredentials } from '~/modules/credentials/selectors'

const text =
  'The https://www.google.com/ is ready to share a scooter with you, unlock to start your ride'

interface AddAttributeI {
  attribute: string
  setAttribute: Dispatch<SetStateAction<string>>
  selectedKey: AttrKeys
  setSelectedKey: Dispatch<SetStateAction<AttrKeys>>
}

const AddAttribute: React.FC<AddAttributeI> = ({
  attribute,
  setAttribute,
  selectedKey,
  setSelectedKey,
}) => {
  return (
    <>
      <TextInput
        style={{
          borderColor: Colors.white45,
          borderWidth: 1,
          width: '100%',
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: 30,
          color: Colors.white,
          borderRadius: 10,
        }}
        value={attribute}
        onChangeText={setAttribute}
      />
      <Picker
        selectedValue={selectedKey}
        style={{
          width: '100%',
          backgroundColor: Colors.white,
          marginVertical: 10,
        }}
        onValueChange={(itemValue, itemIndex) => setSelectedKey(itemValue)}
      >
        <Picker.Item
          label={fieldNames.emailAddress}
          value={AttrKeys.emailAddress}
        />
        <Picker.Item label={fieldNames.name} value={AttrKeys.name} />
        <Picker.Item
          label={fieldNames.mobilePhoneNumber}
          value={AttrKeys.mobilePhoneNumber}
        />
        {/* TODO: add support for AttrKeys.postalAddress */}
      </Picker>
    </>
  )
}

const DocumentList = () => {
  const credentials = useSelector(getAllCredentials)

  return (
    <View style={{ height: 200, paddingVertical: 20 }}>
      <Header>All Credentials</Header>
      <ScrollView>
        {credentials.map(({ metadata: { name } }) => (
          <Paragraph customStyles={{ paddingVertical: 10 }}>{name}</Paragraph>
        ))}
      </ScrollView>
    </View>
  )
}

const Documents: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState(AttrKeys.name)
  const [attribute, setAttribute] = useState('')

  const createSelfIssuedCredential = useCreateAttributes()

  const handleAttributeCreate = () => {
    createSelfIssuedCredential(selectedKey, attribute)
    setAttribute('')
  }

  return (
    <ScreenContainer>
      <DocumentList />
      <AddAttribute
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        attribute={attribute}
        setAttribute={setAttribute}
      />
      <Btn onPress={handleAttributeCreate}>Create attribute</Btn>
      <Link text={text} />
    </ScreenContainer>
  )
}

export default Documents
