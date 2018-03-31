import * as React from 'react'
import { StyleSheet, Dimensions, TextStyle } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { Button } from 'react-native-material-ui'
import { Container, Block, CenteredText } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
const Image = require('react-native-remote-svg').default

interface ComponentState {
  activeSlide: number;
}

interface Props {
  handleButtonTap: () => void;
}

interface Slide {
  svgImage: any;
  title: string;
  infoText: string;
}

const carouselInfo: Array<Slide> = [{
  svgImage: require('src/img/img_onboarding-00.svg'),
  title: '',
  infoText: ''
}, {
  svgImage: require('src/img/img_onboarding-01.svg'),
  title: 'Create an independent and secure digital identity.',
  infoText: 'Collect your data at a secure place. It’s yours, so only you own it!'
}, {
  svgImage: require('src/img/img_onboarding-02.svg'),
  title: 'Have all your data at your fingertips.',
  infoText: 'See all your data in one safe place. Pull the plug and your data is only yours.'
}, {
  svgImage: require('src/img/img_onboarding-03.svg'),
  title: 'Be aware of the information you share.',
  infoText: 'See what you shared with whom. Have total control over your data.'
}, {
  svgImage: require('src/img/img_onboarding-04.svg'),
  title: 'Your data is as safe as in your bank account.',
  infoText: 'We use the latest encryption technology and blockchain to store your sensitive data.'
}, {
  svgImage: require('src/img/img_onboarding-05.svg'),
  title: 'Security is hard to maintain, that is why the storage costs.',
  infoText: 'The storage of your data is payed in ether. But only the change of data costs.'
}]

const viewWidth: number = Dimensions.get('window').width

export class LandingComponent extends React.Component<Props, ComponentState> {
  constructor(props: Props) {
    super(props)

    this.state = {
      activeSlide: 0
    }
  }

  private _renderItem = ({ item } : { item : Slide }) => {
    const { svgImage, title, infoText  } = item
    return(
      <Container style={ this.styles.carouselContainer }>
        <Image
          style={ this.styles.carouseSlide }
          source={ svgImage }
        />

        {title ? <Container style={ this.styles.carouselTextContainer }>
          <CenteredText style= { this.styles.header } msg={ title } />
          <CenteredText style={ this.styles.subHeader } msg={ infoText } />
        </Container> : null}
      </Container>
    )
  }

  private renderPagination () {
    const { activeSlide } = this.state
    const { gray1 } = JolocomTheme.jolocom
    return (
      <Pagination
        dotsLength={ carouselInfo.length }
        activeDotIndex={ activeSlide }
        dotStyle={ this.styles.dotStyle }
        inactiveDotStyle={ [this.styles.dotStyle, [{ backgroundColor: gray1 }]] }
        inactiveDotOpacity={ 0.4 }
        inactiveDotScale={ 0.6 }
      />
    )
  }

  private get styles() {
    return StyleSheet.create({
      carouselContainer: {
        width: viewWidth
      },
      carouseSlide: {
        flex: 1,
        width: '100%'
      },
      carouselTextContainer: {
        flex: 0.4,
        justifyContent: 'space-around'
      },
      dotStyle: {
        width: 7,
        height: 7,
        backgroundColor: JolocomTheme.palette.primaryColor
      },
      header: {
        justifyContent: 'center',
        alignItems: 'center',
        color: JolocomTheme.textStyles.headline.color,
        fontSize: JolocomTheme.textStyles.headline.fontSize,
        fontWeight: JolocomTheme.textStyles.headline.fontWeight
      } as TextStyle,
      subHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        color: JolocomTheme.textStyles.subheadline.color
      },
      buttonContainer: {
        backgroundColor: JolocomTheme.palette.primaryColor
      }
    })
  }

  render() {
    return (
      <Container>
        <Block flex={ 0.8 }>
          <Carousel
            data={ carouselInfo }
            renderItem={ this._renderItem }
            lockScrollWhileSnapping
            loop
            sliderWidth={ viewWidth }
            itemWidth={ viewWidth }
            layout={ 'default' }
            onSnapToItem={(index : number) =>
              this.setState({ activeSlide: index })
            }
          />
        </Block>
        <Block flex={ 0.1 }>
          { this.renderPagination() }
        </Block>
        <Block flex={ 0.1 }>
          <Button
            onPress={ this.props.handleButtonTap }
            style={{ container: this.styles.buttonContainer }}
            raised
            primary
            text="Create Your Identity" />
        </Block>
      </Container>
    )
  }
}
