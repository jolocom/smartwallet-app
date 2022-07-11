import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Platform,
} from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { Walkthrough1, Walkthrough2, Walkthrough3 } from '~/assets/images'
import useTranslation from '~/hooks/useTranslation'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'

const SLIDER_WIDTH = Dimensions.get('window').width + 80
const ITEM_WIDTH = Dimensions.get('window').width

const CustomCarousel = () => {
  const { t } = useTranslation()
  const isCarousel = React.useRef(null)

  const [index, setIndex] = useState(0)

  const walkthroughData = [
    {
      background: Walkthrough1,
      header: t('Walkthrough.titleOne'),
      paragraph: t('Walkthrough.descriptionOne'),
    },
    {
      background: Walkthrough2,
      header: t('Walkthrough.titleTwo'),
      paragraph: t('Walkthrough.descriptionTwo'),
    },
    {
      background: Walkthrough3,
      header: t('Walkthrough.titleThree'),
      paragraph: t('Walkthrough.descriptionThree'),
    },
  ]

  const CarouselCardItem = ({ item, index }) => {
    return (
      <React.Fragment>
        <ImageBackground
          key={index}
          style={styles.background}
          source={item.background}
        />
        <AbsoluteBottom
          customStyles={{
            ...styles.consistentContainer,
            bottom: Platform.select({
              ios: BP({ default: 240, small: 210, large: 280 }),
              android: BP({ default: 240, small: 210 }),
            }),
          }}
        >
          <JoloText
            kind={JoloTextKind.title}
            size={JoloTextSizes.big}
            weight={JoloTextWeight.regular}
            color={Colors.white90}
          >
            {item.header}
          </JoloText>
          <JoloText
            kind={JoloTextKind.subtitle}
            size={JoloTextSizes.big}
            color={Colors.white80}
            customStyles={{ marginTop: 12 }}
          >
            {item.paragraph}
          </JoloText>
        </AbsoluteBottom>
      </React.Fragment>
    )
  }

  return (
    <View>
      <Carousel
        ref={isCarousel}
        data={walkthroughData}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        autoplay={true}
        autoplayDelay={1000}
        autoplayInterval={8000}
        enableMomentum={false}
        lockScrollWhileSnapping={true}
        loop={true}
        onSnapToItem={(index) => setIndex(index)}
        useScrollView={true}
      />
      <View style={styles.dotsContainer}>
        <Pagination
          dotsLength={walkthroughData.length}
          activeDotIndex={index}
          carouselRef={isCarousel}
          dotStyle={styles.activeDotStyle}
          inactiveDotStyle={styles.inactiveDotStyle}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          tappableDots={true}
          animatedDuration={0}
        />
      </View>
    </View>
  )
}

export default CustomCarousel

const styles = StyleSheet.create({
  background: Platform.select({
    ios: BP({
      default: { ...StyleSheet.absoluteFillObject, top: -20 },
      medium: { ...StyleSheet.absoluteFillObject, top: -8 },
      small: {
        flex: 1,
        resizeMode: 'contain',
      },
    }),
    android: BP({
      default: { ...StyleSheet.absoluteFillObject, top: -20 },
      medium: { ...StyleSheet.absoluteFillObject, top: -8 },
      small: {
        flex: 1,
        resizeMode: 'contain',
      },
    }),
  }),
  consistentContainer: {
    paddingHorizontal: '5%',
  },
  dotsContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: Platform.select({
      ios: BP({ default: 160, medium: 210, large: 210 }),
      android: 165,
    }),
  },
  activeDotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 0,
    backgroundColor: Colors.floralWhite,
  },
  inactiveDotStyle: { backgroundColor: Colors.peach },
})
