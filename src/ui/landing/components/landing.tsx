import React, { ReactNode } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { Button } from 'react-native-material-ui'
import { Block, Container, CenteredText } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import I18n from 'src/locales/i18n'
import { Landing00, Landing01, Landing02, Landing03 } from 'src/resources'

const Carousel = require('react-native-snap-carousel').default
const Pagination = require('react-native-snap-carousel').Pagination

interface State {
  activeSlide: number;
}

interface Props {
  handleButtonTap: () => void;
}

interface Slide {
  svgImage: ReactNode;
  title: string;
  infoText: string;
}

const viewWidth: number = Dimensions.get('window').width
const headerFontSize =
  viewWidth < 360
    ? JolocomTheme.landingHeaderFontSizeSmall
    : JolocomTheme.landingHeaderFontSize
const labelFontSize =
  viewWidth < 360
    ? JolocomTheme.labelFontSizeSmall
    : JolocomTheme.labelFontSize

const styles = StyleSheet.create({
  mainContainerStyle: {
    paddingTop: 0,
    backgroundColor: '#05050d',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    flex: 1
  },
  carouselTextContainer: {
    paddingHorizontal: viewWidth / 18,
    flex: 0.4,
    marginTop: 'auto',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent'
  },
  activeDotStyle: {
    width: 8,
    height: 8,
    backgroundColor: JolocomTheme.dotColorActive
  },
  inactiveDotStyle: {
    width: 4,
    height: 4,
    opacity: 0.6,
    backgroundColor: JolocomTheme.dotColorInactive
  },
  header: {
    color: JolocomTheme.primaryColorSand,
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: headerFontSize,
    fontWeight: '100'
  },
  subHeader: {
    color: JolocomTheme.primaryColorSand,
    opacity: 0.8,
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: labelFontSize,
    fontWeight: '100',
    lineHeight: labelFontSize + 4,
    marginTop: 15
  },
  paginationBlock: {
    flex: 0.15,
    backgroundColor: '#05050d'
  },
  buttonBlock: {
    flex: 0.1,
    backgroundColor: '#05050d'
  },
  buttonContainer: {
    height: 48,
    minWidth: 164,
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple
  },
  buttonText: {
    paddingVertical: 15,
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: '100',
    textAlign: 'center',
    minWidth: 158
  }
})

const carouselInfo: Slide[] = [
  {
    svgImage: <Landing00 />,
    title: I18n.t('Your Jolocom Wallet'),
    infoText:
      I18n.t(
        'Take back control of your digital self and protect your private data against unfair usage'
      ) + '.'
  },
  {
    svgImage: <Landing01 height={'100%'} width={'100%'} />,
    title: I18n.t("It's easy"),
    infoText:
      I18n.t('Forget about long forms and registrations') +
      '. ' +
      I18n.t(
        'Instantly access services without using your social media profiles'
      ) +
      '.'
  },
  {
    svgImage: <Landing03 height={'100%'} width={'100%'} />,
    title: I18n.t('Enhanced privacy'),
    infoText:
      I18n.t('Share only the information a service really needs') +
      '. ' +
      I18n.t('Protect your digital self against fraud') +
      '.'
  },
  {
    svgImage: <Landing02 height={'100%'} width={'100%'} />,
    title: I18n.t('Greater control'),
    infoText:
      I18n.t(
        'Keep all your data with you in one place, available at any time'
      ) +
      '. ' +
      I18n.t('Track where you sign in to services') +
      '.'
  }
]

export class LandingComponent extends React.Component<Props, State> {
  state = {
    activeSlide: 0
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
            onPress={this.props.handleButtonTap}
            style={{
              container: styles.buttonContainer,
              text: styles.buttonText
            }}
            upperCase={false}
            text={I18n.t('Get started')}
          />
        </Block>
      </Container>
    )
  }
}
