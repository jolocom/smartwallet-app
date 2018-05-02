import React from 'react'
import { StyleSheet, Dimensions, TextStyle } from 'react-native'
const Carousel = require('react-native-snap-carousel').default
const Pagination = require('react-native-snap-carousel').Pagination
import { Button } from 'react-native-material-ui'
import { Container, Block, CenteredText } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { ReactNode } from 'react'
import {
  Onboarding00,
  Onboarding01,
  Onboarding02,
  Onboarding03,
  Onboarding04,
  Onboarding05
} from 'src/resources'

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

const carouselInfo: Slide[] = [
  {
    svgImage: <Onboarding00 height={'100%'} width={'100%'} />,
    title: '',
    infoText: ''
  },
  {
    svgImage: <Onboarding01 height={'70%'} width={'100%'} />,
    title: 'Create an independent and secure digital identity.',
    infoText: 'Collect your data at a secure place. It’s yours, so only you own it!'
  },
  {
    svgImage: <Onboarding02 height={'70%'} width={'100%'} />,
    title: 'Have all your data at your fingertips.',
    infoText: 'See all your data in one safe place. Pull the plug and your data is only yours.'
  },
  {
    svgImage: <Onboarding03 height={'70%'} width={'100%'} />,
    title: 'Be aware of the information you share.',
    infoText: 'See what you shared with whom. Have total control over your data.'
  },
  {
    svgImage: <Onboarding04 height={'70%'} width={'100%'} />,
    title: 'Your data is as safe as in your bank account.',
    infoText: 'We use the latest encryption technology and blockchain to store your sensitive data.'
  },
  {
    svgImage: <Onboarding05 height={'70%'} width={'100%'} />,
    title: 'Security is hard to maintain, that is why the storage costs.',
    infoText: 'The storage of your data is payed in ether. But only the change of data costs.'
  }
]


const viewWidth: number = Dimensions.get('window').width

export class LandingComponent extends React.Component<Props, State> {
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
        {svgImage}
        {title ? <Container style={ this.styles.carouselTextContainer }>
          <CenteredText style= { this.styles.header } msg={ title } />
          <CenteredText style={ this.styles.subHeader } msg={ infoText } />
        </Container> : null}
      </Container>
    )
  }

  private renderPagination () {
    const { activeSlide } = this.state
    return (
      <Pagination
        dotsLength={ carouselInfo.length }
        activeDotIndex={ activeSlide }
        dotStyle={ this.styles.dotStyle }
        inactiveDotStyle={ [this.styles.dotStyle, [{ backgroundColor: JolocomTheme.palette.backgroundDot }]] }
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
        flex: 1,
        justifyContent: 'space-around',
        padding: '1%'
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
        <Block flex={ 0.13 }>
          { this.renderPagination() }
        </Block>
        <Block flex={ 0.07 }>
          <Button
            onPress={ this.props.handleButtonTap }
            raised
            primary
            text="Create Your Identity" />
        </Block>
      </Container>
    )
  }
}
