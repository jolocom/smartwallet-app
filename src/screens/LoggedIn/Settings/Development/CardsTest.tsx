import React from 'react'
import { ScrollView, View } from 'react-native'
import { SharePreviewCard } from '~/components/Cards/DocumentSectionCards/SharePreviewCard'
import ScreenContainer from '~/components/ScreenContainer'
import Section from '../components/Section'

const credentialShareProps = [
  {
    credentialName: 'Solaris Ticket',
    fields: [
      { key: 'one', label: 'Birth Date', value: '12.11.1943' },
      { key: 'two', label: 'Books', value: '44' },
      { key: 'three', label: 'Editor', value: 'Books & Noble' },
      { key: 'four', label: 'Four', value: 'Four' },
    ],
    holderName: 'Stanislaw Lem',
    selected: false,
    photo:
      'https://www.sueddeutsche.de/image/sz.1.1197317/640x360?v=1523580533',
    issuerIcon:
      'https://images-na.ssl-images-amazon.com/images/I/71YpunDnbwL.jpg',
  },
  {
    credentialName: 'Solaris Ticket',
    fields: [
      { key: 'one', label: 'Birth Date', value: '12.11.1943' },
      { key: 'two', label: 'Books', value: '44' },
      { key: 'three', label: 'Editor', value: 'Books & Noble' },
      { key: 'four', label: 'Four', value: 'Four' },
    ],
    holderName: 'Stanislaw Lem and a longer name',
    selected: false,
    photo:
      'https://www.sueddeutsche.de/image/sz.1.1197317/640x360?v=1523580533',
    issuerIcon:
      'https://images-na.ssl-images-amazon.com/images/I/71YpunDnbwL.jpg',
  },
  {
    credentialName: 'Solaris Ticket',
    fields: [
      { key: 'one', label: 'Birth Date', value: '12.11.1943' },
      { key: 'two', label: 'Books', value: '44' },
      { key: 'four', label: 'Four', value: 'Four' },
      { key: 'five', label: 'Birth Date', value: '12.11.1943' },
      { key: 'six', label: 'Books', value: '44' },
      { key: 'seven', label: 'Editor', value: 'Books & Noble' },
      { key: 'eight', label: 'Four', value: 'Four' },
    ],
    selected: true,
    photo:
      'https://www.sueddeutsche.de/image/sz.1.1197317/640x360?v=1523580533',
    issuerIcon:
      'https://images-na.ssl-images-amazon.com/images/I/71YpunDnbwL.jpg',
  },
  {
    credentialName: 'Solaris Ticket',
    fields: [
      { key: 'one', label: 'Birth Date', value: '12.11.1943' },
      { key: 'two', label: 'Books', value: '44' },
      { key: 'four', label: 'Four', value: 'Four' },
      { key: 'five', label: 'Birth Date', value: '12.11.1943' },
      { key: 'six', label: 'Books', value: '44' },
      { key: 'seven', label: 'Editor', value: 'Books & Noble' },
      { key: 'eight', label: 'Four', value: 'Four' },
    ],
    selected: true,
    issuerIcon:
      'https://images-na.ssl-images-amazon.com/images/I/71YpunDnbwL.jpg',
  },
]

export const CardTest = () => {
  return (
    <ScreenContainer hasHeaderBack>
      <ScrollView style={{ width: '100%' }}>
        <Section>
          <Section.Title>Credenital Share Cards</Section.Title>
          <View style={{ flex: 1, width: '100%' }}>
            {credentialShareProps.map((cred, i) => (
              <SharePreviewCard key={i} {...cred} style={{ marginTop: 12 }} />
            ))}
          </View>
        </Section>
      </ScrollView>
    </ScreenContainer>
  )
}
