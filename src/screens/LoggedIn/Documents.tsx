import React from 'react'
import { useSelector } from 'react-redux'
// import Face from '~/assets/images/face.jpg'

import ScreenContainer from '~/components/ScreenContainer'
import { getAllCredentials } from '~/modules/credentials/selectors'
import DocumentCard from '~/components/Card/DocumentCard.index'
import { Colors } from '~/utils/colors'

const Documents: React.FC = () => {
  const credentials = useSelector(getAllCredentials)
  const mandatoryFields = [
    {
      name: 'Document Type',
      value: 'Nederlandse identitekaart Nederlandse identitekaart',
    },
    { name: 'Document Name', value: 'Nederlandse identitekaart' },
    { name: 'Given Name', value: 'De Bruijn Willeke Liselotte' },
  ]

  const preferredFields = [
    { name: 'Date of birth', value: Date.now() },
    {
      name:
        'Some more info that can fit in here and if it is not going over two lines agreed previou',
      value:
        'Some more info that can fit in here and if it is not going over two lines agreed previou over two lines agreed previou',
    },
    { name: 'Date of expiry', value: Date.now() },
  ]
  return (
    <ScreenContainer>
      <DocumentCard
        mandatoryFields={mandatoryFields}
        preferredFields={preferredFields}
        highlight="SPECI2014"
        // photo={Face}
      />
    </ScreenContainer>
  )
}

export default Documents
