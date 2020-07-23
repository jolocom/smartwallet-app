import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'
import Link from '~/components/Link'

const text =
  'The https://www.google.com/ is ready to share a scooter with you, unlock to start your ride'

const Documents: React.FC = () => {
  return (
    <ScreenContainer>
      <Link text={text} />
    </ScreenContainer>
  )
}

export default Documents
