import React from 'react'
import { ScrollView } from 'react-native'
import { SharePreviewCard } from '~/components/Cards/DocumentSectionCards/SharePreviewCard'
import ScreenContainer from '~/components/ScreenContainer'
import Section from '../components/Section'

const credentialShareProps = [
  {
    credentialName: 'Solaris Ticket',
    fields: [
      { key: 'one', label: 'One', value: 'One' },
      { key: 'two', label: 'Two', value: 'Two' },
      { key: 'three', label: 'Three', value: 'Three' },
      { key: 'four', label: 'Four', value: 'Four' },
    ],
    holderName: 'Stanislaw Lem',
    selected: false,
    photo:
      'https://www.sueddeutsche.de/image/sz.1.1197317/640x360?v=1523580533',
    issuerIcon:
      'https://images-na.ssl-images-amazon.com/images/I/71YpunDnbwL.jpg',
  },
]

export const CardTest = () => {
  return (
    <ScreenContainer hasHeaderBack>
      <ScrollView>
        <Section>
          <Section.Title>Credenital Share Cards</Section.Title>
          {credentialShareProps.map((cred, i) => (
            <SharePreviewCard key={i} {...cred} />
          ))}
        </Section>
      </ScrollView>
    </ScreenContainer>
  )
}
