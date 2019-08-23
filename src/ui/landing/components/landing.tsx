import React from 'react'
import { StyleSheet, Dimensions, View, Text } from 'react-native'
import { Container, JolocomButton } from 'src/ui/structure'
import I18n from 'src/locales/i18n'
import strings from 'src/locales/strings'
import { landingSlides, Slide } from './landingSlides'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { Typography, Colors, Spacing } from 'src/styles'

interface State {
  activeSlide: number
}

interface Props {
  handleButtonTap: () => void
}

const viewWidth: number = Dimensions.get('window').width

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.blackMain,
    paddingBottom: '5%',
  },
  carouselSlide: {
    flex: 1,
  },
  carouselTextContainer: {
    marginTop: 'auto',
    paddingHorizontal: '5%',
  },
  header: {
    ...Typography.mainText,
    textAlign: 'center',
    color: Colors.sandLight,
  },
  message: {
    ...Typography.subMainText,
    textAlign: 'center',
    color: Colors.sandLight080,
    lineHeight: Typography.subMainText.fontSize + 4,
    marginTop: Spacing.MD,
  },
  activeDotStyle: {
    width: 8,
    height: 8,
    backgroundColor: Colors.dotColorActive,
  },
  inactiveDotStyle: {
    width: 8,
    height: 8,
    backgroundColor: Colors.dotColorInactive,
  },
  buttonArea: {
    flex: 0.1,
  },
})

export class LandingComponent extends React.Component<Props, State> {
  public state = {
    activeSlide: 0,
  }

  private renderItem = ({ item }: { item: Slide }) => {
    const { svgImage, title, infoText } = item
    return (
      <View style={styles.carouselSlide}>
        {svgImage}
        <View style={styles.carouselTextContainer}>
          <Text style={styles.header}>{title}</Text>
          <Text style={styles.message}>{infoText}</Text>
        </View>
      </View>
    )
  }

  public render() {
    const { activeSlide } = this.state
    return (
      <Container style={styles.mainContainer}>
        <Carousel
          data={landingSlides}
          renderItem={this.renderItem}
          lockScrollWhileSnapping
          lockScrollTimeoutDuration={1000}
          loop
          autoplay={true}
          autoplayDelay={5000}
          autoplayInterval={5000}
          sliderWidth={viewWidth}
          itemWidth={viewWidth}
          layout={'default'}
          onSnapToItem={(index: number) =>
            this.setState({ activeSlide: index })
          }
        />
        <Pagination
          dotsLength={landingSlides.length}
          activeDotIndex={activeSlide}
          dotStyle={styles.activeDotStyle}
          inactiveDotStyle={styles.inactiveDotStyle}
          inactiveDotScale={0.5}
        />
        <View style={styles.buttonArea}>
          <JolocomButton
            raised
            onPress={this.props.handleButtonTap}
            upperCase={false}
            text={I18n.t(strings.GET_STARTED)}
          />
        </View>
      </Container>
    )
  }
}
