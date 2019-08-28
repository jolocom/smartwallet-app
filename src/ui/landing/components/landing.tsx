import React from 'react'
import { StyleSheet, Dimensions, View, Text } from 'react-native'
import { Container } from 'src/ui/structure'
import I18n from 'src/locales/i18n'
import strings from 'src/locales/strings'
import { landingSlides, Slide } from './landingSlides'
import Carousel from 'react-native-snap-carousel'
import { Typography, Colors, Spacing, Buttons } from 'src/styles'
import { Button } from 'react-native-material-ui'

interface Props {
  handleButtonTap: () => void
}

const viewWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.blackMain,
  },
  carouselSlide: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  carouselTextContainer: {
    marginTop: viewWidth > 360 ? Spacing['4XL'] : Spacing.XXL,
    position: 'absolute',
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
    marginTop: Spacing.SM,
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
  bottomSection: {
    position: 'absolute',
    width: '85%',
    bottom: '5%',
    alignItems: 'center',
  },
  mainButtonContainer: {
    ...Buttons.buttonStandardContainer,
    alignSelf: 'stretch',
  },
  mainButtonText: {
    ...Buttons.buttonStandardText,
  },
  recoverButtonContainer: {
    ...Buttons.buttonStandardContainer,
    backgroundColor: 'transparent',
    marginTop: Spacing.XS,
    alignSelf: 'stretch',
  },
  recoverButtonText: {
    ...Buttons.buttonStandardText,
    fontSize: Typography.textSM,
  },
})

export class LandingComponent extends React.Component<Props> {
  private renderItem = ({ item }: { item: Slide }) => {
    const { bgImage, title, infoText } = item
    return (
      <View style={styles.carouselSlide}>
        {bgImage}
        <View style={styles.carouselTextContainer}>
          <Text style={styles.header}>{title}</Text>
          <Text style={styles.message}>{infoText}</Text>
        </View>
      </View>
    )
  }

  public render() {
    return (
      <Container style={styles.mainContainer}>
        <Carousel
          data={landingSlides}
          renderItem={this.renderItem}
          lockScrollWhileSnapping
          lockScrollTimeoutDuration={1000}
          loop
          autoplay
          autoplayDelay={5000}
          autoplayInterval={5000}
          sliderWidth={viewWidth}
          itemWidth={viewWidth}
          layout={'default'}
        />
        <View style={styles.bottomSection}>
          <Button
            onPress={this.props.handleButtonTap}
            style={{
              container: styles.mainButtonContainer,
              text: styles.mainButtonText,
            }}
            text={I18n.t(strings.GET_STARTED)}
            upperCase={false}
          />
          <Button
            style={{
              container: styles.recoverButtonContainer,
              text: styles.recoverButtonText,
            }}
            text={'Recover identity'}
            upperCase={false}
          />
        </View>
      </Container>
    )
  }
}
