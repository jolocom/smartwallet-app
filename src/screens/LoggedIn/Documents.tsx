import React from 'react'
import { useSelector } from 'react-redux'
import { ScrollView, View } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { getAllCredentials } from '~/modules/credentials/selectors'
import { JoloTextSizes } from '~/utils/fonts'

const DocumentList = () => {
  const credentials = useSelector(getAllCredentials)

  return (
    <View style={{ height: 200, paddingVertical: 20, marginTop: 20 }}>
      <ScrollView>
        {credentials.map(({ metadata: { name } }) => (
          <JoloText
            kind={JoloTextKind.subtitle}
            size={JoloTextSizes.middle}
            customStyles={{ paddingVertical: 10 }}
          >
            {name}
          </JoloText>
        ))}
      </ScrollView>
    </View>
  )
}

const Documents: React.FC = () => {
  return (
    <ScreenContainer>
      <JoloText kind={JoloTextKind.title} size={JoloTextSizes.big}>
        Documents
      </JoloText>
      <DocumentList />
    </ScreenContainer>
  )
}

export default Documents
