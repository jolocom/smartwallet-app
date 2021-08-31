import React, { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import Carousel, { CarouselProps } from 'react-native-snap-carousel'
import { usePrevious, useRevertToInitialState } from '~/hooks/generic'
import { IWithCustomStyle } from '~/types/props'
import { SCREEN_WIDTH } from '~/utils/dimensions'

interface IAdoptedCarousel<T> extends CarouselProps<T>, IWithCustomStyle {}

const AdoptedCarousel = <T extends unknown>({
  data,
  renderItem,
  activeSlideAlignment,
  customStyles,
  ...rest
}: IAdoptedCarousel<T>) => {
  const prevLength = usePrevious(data.length)
  const carouselRef = useRef<Carousel<T> | null>(null)

  const [isHidden, setIsHidden] = useState(false)

  useRevertToInitialState(isHidden, setIsHidden, 10)

  useEffect(() => {
    /**
     * NOTE: this is a workaround for: last slide is not being snapped to the prev value on Android
     * this only applicable when we remove credentials
     */
    if (Platform.OS === 'android' && prevLength && prevLength > data.length) {
      if (data.length === 1) {
        setIsHidden(true)
      }
      // eslint-disable-next-line no-unused-expressions
      carouselRef.current?.snapToPrev()
    }
  }, [data.length])

  if (isHidden) return null
  return (
    <Carousel
      ref={(c) => {
        carouselRef.current = c
      }}
      contentContainerCustomStyle={customStyles}
      removeClippedSubviews={false}
      activeSlideAlignment={activeSlideAlignment}
      data={data}
      layout="default"
      sliderWidth={SCREEN_WIDTH}
      itemWidth={SCREEN_WIDTH * 0.85}
      inactiveSlideOpacity={0.24}
      renderItem={renderItem}
      {...rest}
    />
  )
}

export default AdoptedCarousel
