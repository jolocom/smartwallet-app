import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'
import Btn from '~/components/Btn'
import { useCreateAttributes } from '~/hooks/attributes'
import Link from '~/components/Link'

const text =
  'The https://www.google.com/ is ready to share a scooter with you, unlock to start your ride'

const Documents: React.FC = () => {
  const { addEmail, addName } = useCreateAttributes()
  return (
    <ScreenContainer>
      <Header>Documents</Header>
      <Btn onPress={addEmail}>Add email</Btn>
      <Btn onPress={addName}>Add name</Btn>
      <Link text={text} />
    </ScreenContainer>
  )
}

export default Documents
