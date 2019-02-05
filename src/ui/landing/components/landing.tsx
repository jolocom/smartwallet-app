import React, { ReactNode } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { Button } from 'react-native-material-ui'
import { Block, Container, CenteredText } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import I18n from 'src/locales/i18n'
import { 
  Landing00,
  Landing01,
  Landing02,
  Landing03
} from 'src/resources'

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

const styles = StyleSheet.create({
  mainContainerStyle: {
    paddingTop: 0,
    backgroundColor: '#05050d', 
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1
  },
  carouselTextContainer: {
    padding: viewWidth / 15,
    flex: 0.4,
    marginTop: 'auto',
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
    fontSize: JolocomTheme.landingHeaderFontSize,
    fontWeight: '100'
  },
  headerBlock: {
    marginBottom: 0 
  }, 
  subHeaderBlock: {
    marginBottom: 0,
  },
  subHeader: {
    fontWeight: '100',
    color: JolocomTheme.primaryColorSand,
    fontFamily: JolocomTheme.contentFontFamily, 
    opacity: 0.8,
    fontSize: JolocomTheme.labelFontSize,
    lineHeight: JolocomTheme.labelFontSize + 4
  },
  paginationBlock: {
    flex: 0.2,
    backgroundColor: '#05050d' 
  },
  buttonBlock: {
    flex: 0.1,
    backgroundColor: '#05050d' 
  },
  buttonContainer: {
    height: '100%',
    width: '50%',
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple
  },
  buttonText: {
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: "100" 
  }
})

const carouselInfo: Slide[] = [
  {
    svgImage: <Landing00 />,
    title: I18n.t('Your Jolocom Wallet'),
    infoText: I18n.t('Take back control of your digital self and protect your private data against unfair usage') + '.'
  },
  {
    svgImage: <Landing01 height={'100%'} width={'100%'} />,
    title: I18n.t("It's easy"),
    infoText: I18n.t('Forget about long forms and registrations') + '. '
      + I18n.t('Instantly access services without using your social media profiles') + '.'
  },
  {
    svgImage: <Landing03 height={'100%'} width={'100%'} />,
    title: I18n.t('Enhanced privacy'),
    infoText: I18n.t('Share only the information a service really needs') + '. '
      + I18n.t('Protect your digital self against fraud') + '.'
  },
  {
    svgImage: <Landing02 height={'100%'} width={'100%'} />,
    title: I18n.t('Greater control'),
    infoText: I18n.t('Keep all your data with you in one place, available at any time') + '. '
      + I18n.t('Track where you sign in to services') + '.'
  }
]

export class LandingComponent extends React.Component<Props, State> {
  state = {
    activeSlide: 0
  }

  private renderItem = ({ item } : { item : Slide }) => {
    const { svgImage, title, infoText  } = item
    return (
      <Block>
        {svgImage}
        <Block style={ styles.carouselTextContainer }>
            <Block>   
              <CenteredText style= { styles.header } msg={ title } />
            </Block>
            <Block>
              <CenteredText style={ styles.subHeader } msg={ infoText } />
            </Block>
        </Block>
      </Block>
    )
  }

  private renderPagination () {
    const { activeSlide } = this.state
    return (
      <Pagination
        dotsLength={ carouselInfo.length }
        activeDotIndex={ activeSlide }
        dotStyle={ styles.activeDotStyle }
        inactiveDotStyle={ styles.inactiveDotStyle }
        inactiveDotOpacity={ 0.4 }
        inactiveDotScale={ 0.6 }
      />
    )
  }
 
  render() {
    return (
      <Container style= { styles.mainContainerStyle }>
        <Block>
          <Carousel
            data={ carouselInfo }
            renderItem={ this.renderItem }
            lockScrollWhileSnapping
            lockScrollTimeoutDuration={1000}
            loop
            sliderWidth={ viewWidth }
            itemWidth={ viewWidth }
            layout={ 'default' }
            onSnapToItem={(index : number) =>
              this.setState({ activeSlide: index })
            }
          />
        </Block>
        <Block style={ styles.paginationBlock}>
          { this.renderPagination() }
        </Block>
        <Block style={ styles.buttonBlock}>
          <Button
            raised
            onPress={ this.props.handleButtonTap }
            style={{ 
              container: styles.buttonContainer, 
              text: styles.buttonText 
            }}
            upperCase= { false }
            text={ I18n.t('Get started') }
          />
        </Block>
      </Container>
    )
  }
}
