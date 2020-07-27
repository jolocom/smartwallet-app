import React from 'react'
import Header, { HeaderSizes } from '~/components/Header'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'

interface PropsI {
  title: string
  description?: string
}

const InteractionHeader: React.FC<PropsI> = ({ title, description }) => {
  return (
    <>
      <Header size={HeaderSizes.medium} color={Colors.white90}>
        {title}
      </Header>
      {description && (
        <Paragraph size={ParagraphSizes.small} color={Colors.white90}>
          {description}
        </Paragraph>
      )}
    </>
  )
}

export default InteractionHeader
