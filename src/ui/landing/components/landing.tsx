import React, { ReactNode } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { Button } from 'react-native-material-ui'
import { Block, Container, CenteredText } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import I18n from 'src/locales/i18n'
import { Landing00, Landing01, Landing02, Landing03 } from 'src/resources'
import strings from 'src/locales/strings'

const Carousel = require('react-native-snap-carousel').default
const Pagination = require('react-native-snap-carousel').Pagination

interface State {
  activeSlide: number
}

interface Props {
  handleGetStarted: () => void
  handleRecover: () => void
}

interface Slide {
  svgImage: ReactNode
  title: string
  infoText: string
}

const viewWidth: number = Dimensions.get('window').width
const headerFontSize =
  viewWidth < 360
    ? JolocomTheme.landingHeaderFontSizeSmall
    : JolocomTheme.landingHeaderFontSize
const labelFontSize =
  viewWidth < 360 ? JolocomTheme.labelFontSizeSmall : JolocomTheme.labelFontSize

const styles = StyleSheet.create({
  mainContainerStyle: {
    paddingTop: 0,
    backgroundColor: '#05050d',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    flex: 1,
  },
  carouselTextContainer: {
    paddingHorizontal: viewWidth / 18,
    flex: 0.4,
    marginTop: 'auto',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  activeDotStyle: {
    width: 8,
    height: 8,
    backgroundColor: JolocomTheme.dotColorActive,
  },
  inactiveDotStyle: {
    width: 4,
    height: 4,
    opacity: 0.6,
    backgroundColor: JolocomTheme.dotColorInactive,
  },
  header: {
    color: JolocomTheme.primaryColorSand,
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: headerFontSize,
    fontWeight: '100',
  },
  subHeader: {
    color: JolocomTheme.primaryColorSand,
    opacity: 0.8,
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: labelFontSize,
    fontWeight: '100',
    lineHeight: labelFontSize + 4,
    marginTop: 15,
  },
  paginationBlock: {
    flex: 0.15,
    backgroundColor: '#05050d',
  },
  buttonBlock: {
    flex: 0.3,
    backgroundColor: '#05050d',
  },
  buttonContainer: {
    marginTop: 5,
    height: 48,
    minWidth: 164,
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple,
  },
  buttonText: {
    paddingVertical: 15,
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: '100',
    textAlign: 'center',
    minWidth: 158,
  },
})

const carouselInfo: Slide[] = [
  {
    svgImage: <Landing00 />,
    title: I18n.t(strings.YOUR_JOLOCOM_WALLET),
    infoText:
      I18n.t(
        strings.TAKE_BACK_CONTROL_OF_YOUR_DIGITAL_SELF_AND_PROTECT_YOUR_PRIVATE_DATA_AGAINST_UNFAIR_USAGE,
      ) + '.',
  },
  {
    svgImage: <Landing01 height={'100%'} width={'100%'} />,
    title: I18n.t(strings.ITS_EASY),
    infoText:
      I18n.t(strings.FORGET_ABOUT_LONG_FORMS_AND_REGISTRATIONS) +
      '. ' +
      I18n.t(
        strings.INSTANTLY_ACCESS_SERVICES_WITHOUT_USING_YOUR_SOCIAL_MEDIA_PROFILES,
      ) +
      '.',
  },
  {
    svgImage: <Landing03 height={'100%'} width={'100%'} />,
    title: I18n.t(strings.ENHANCED_PRIVACY),
    infoText:
      I18n.t(strings.SHARE_ONLY_THE_INFORMATION_A_SERVICE_REALLY_NEEDS) +
      '. ' +
      I18n.t(strings.PROTECT_YOUR_DIGITAL_SELF_AGAINST_FRAUD) +
      '.',
  },
  {
    svgImage: <Landing02 height={'100%'} width={'100%'} />,
    title: I18n.t(strings.GREATER_CONTROL),
    infoText:
      I18n.t(
        strings.KEEP_ALL_YOUR_DATA_WITH_YOU_IN_ONE_PLACE_AVAILABLE_AT_ANY_TIME,
      ) +
      '. ' +
      I18n.t(strings.TRACK_WHERE_YOU_SIGN_IN_TO_SERVICES) +
      '.',
  },
]

export class LandingComponent extends React.Component<Props, State> {
  state = {
    activeSlide: 0,
  }

  private renderItem = ({ item }: { item: Slide }) => {
    const { svgImage, title, infoText } = item
    return (
      <Block>
        {svgImage}
        <Block style={styles.carouselTextContainer}>
          <CenteredText style={styles.header} msg={title} />
          <CenteredText style={styles.subHeader} msg={infoText} />
        </Block>
      </Block>
    )
  }

  private renderPagination() {
    const { activeSlide } = this.state
    return (
      <Pagination
        dotsLength={carouselInfo.length}
        activeDotIndex={activeSlide}
        dotStyle={styles.activeDotStyle}
        inactiveDotStyle={styles.inactiveDotStyle}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }

  render() {
    return (
      <Container style={styles.mainContainerStyle}>
        <Block>
          <Carousel
            data={carouselInfo}
            renderItem={this.renderItem}
            lockScrollWhileSnapping
            lockScrollTimeoutDuration={1000}
            loop
            sliderWidth={viewWidth}
            itemWidth={viewWidth}
            layout={'default'}
            onSnapToItem={(index: number) =>
              this.setState({ activeSlide: index })
            }
          />
        </Block>
        <Block style={styles.paginationBlock}>{this.renderPagination()}</Block>
        <Block style={styles.buttonBlock}>
          <Button
            raised
            onPress={this.props.handleGetStarted}
            style={{
              container: styles.buttonContainer,
              text: styles.buttonText,
            }}
            upperCase={false}
            text={I18n.t(strings.GET_STARTED)}
          />
          <Button
            raised
            onPress={this.props.handleRecover}
            style={{
              container: styles.buttonContainer,
              text: styles.buttonText,
            }}
            upperCase={false}
            text={'Recover Identity'}
          />
        </Block>
      </Container>
    )
  }
}
