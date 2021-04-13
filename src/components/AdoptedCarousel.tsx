import React from 'react'
import Carousel, { CarouselProps } from 'react-native-snap-carousel'
import { SCREEN_WIDTH } from '~/utils/dimensions'
import { IWithCustomStyle } from './Card/types'

interface IAdoptedCarousel<T> extends CarouselProps<T>, IWithCustomStyle {}

const AdoptedCarousel = <T extends unknown>({
  data,
  renderItem,
  activeSlideAlignment,
  customStyles,
}: IAdoptedCarousel<T>) => (
  <Carousel
    contentContainerCustomStyle={customStyles}
    removeClippedSubviews={false}
    activeSlideAlignment={activeSlideAlignment}
    data={data}
    layout="default"
    sliderWidth={SCREEN_WIDTH}
    itemWidth={SCREEN_WIDTH * 0.85}
    inactiveSlideOpacity={0.24}
    renderItem={renderItem}
  />
)

export default AdoptedCarousel
