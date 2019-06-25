import * as React from 'react'
import { Dimensions, View } from 'react-native'
import Carousel from 'react-native-snap-carousel'

import { DecoratedClaims } from 'src/reducers/account'

import { DocumentDetails } from './documentDetails'
import { DocumentCard, DOCUMENT_CARD_WIDTH } from './documentCard'

interface DocumentsCarouselProps {
  activeIndex: number
  documents: DecoratedClaims[]
  onActiveIndexChange: (index: number) => void
}

const renderItem = ({ item }: { item: DecoratedClaims }): JSX.Element => (
  <DocumentCard document={item} />
)

export const DocumentsCarousel: React.SFC<DocumentsCarouselProps> = (
  props,
): JSX.Element => {
  const viewWidth: number = Dimensions.get('window').width
  const { documents, activeIndex, onActiveIndexChange } = props

  return (
    <View style={{ paddingTop: 10 }}>
      <Carousel
        data={documents}
        renderItem={renderItem}
        lockScrollWhileSnapping
        sliderWidth={viewWidth}
        itemWidth={DOCUMENT_CARD_WIDTH}
        layout={'default'}
        onSnapToItem={onActiveIndexChange}
      />
      <DocumentDetails document={documents[activeIndex]} />
    </View>
  )
}
