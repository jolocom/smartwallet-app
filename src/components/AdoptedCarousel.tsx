import React from 'react'
import Carousel, { CarouselProps } from 'react-native-snap-carousel'
import { SCREEN_WIDTH } from '~/utils/dimensions'
import { IWithCustomStyle } from './Card/types'

interface IAdoptedCarousel<T> extends IWithCustomStyle {
  data: CarouselProps<T>['data']
  renderItem: CarouselProps<T>['renderItem']
  alignment?: CarouselProps<T>['activeSlideAlignment']
}

const AdoptedCarousel = <T extends unknown>({
  data,
  renderItem,
  alignment,
  customStyles,
}: IAdoptedCarousel<T>) => (
  <Carousel
    contentContainerCustomStyle={customStyles}
    removeClippedSubviews={false}
    activeSlideAlignment={alignment ?? 'center'}
    data={data}
    layout="default"
    sliderWidth={SCREEN_WIDTH}
    itemWidth={SCREEN_WIDTH * 0.85}
    inactiveSlideOpacity={0.24}
    renderItem={renderItem}
  />
)

export default AdoptedCarousel
