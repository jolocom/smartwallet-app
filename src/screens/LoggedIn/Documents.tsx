import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'
import Btn from '~/components/Btn'
import { useCreateSelfIssuedCredential } from '~/hooks/sdk'

const Documents: React.FC = () => {
  const { addEmail, addName } = useCreateSelfIssuedCredential()
  return (
    <ScreenContainer>
      <Header>Documents</Header>
      <Btn onPress={addEmail}>Add email</Btn>
      <Btn onPress={addName}>Add name</Btn>
    </ScreenContainer>
  )
}

export default Documents
