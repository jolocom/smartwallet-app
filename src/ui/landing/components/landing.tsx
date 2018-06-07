import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { Button } from 'react-native-material-ui'
import { Block, Container, CenteredText } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { ReactNode } from 'react'
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
    backgroundColor: JolocomTheme.primaryColorBlack,
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1
  },
  carouselTextContainer: {
    padding: '10%',
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
    fontSize: JolocomTheme.landingHeaderFontSize,
    fontWeight: '100'
  },
  headerBlock: {
    marginBottom: 0 
    // paddingBottom: '5%'
  }, 
  subHeaderBlock: {
    marginBottom: 0,
    // paddingTop: '7%'
  },
  subHeader: {
    fontWeight: '100',
    color: JolocomTheme.primaryColorSand,
    opacity: 0.8,
    fontSize: JolocomTheme.labelFontSize,
    lineHeight: JolocomTheme.labelFontSize + 4
  },
  paginationBlock: {
    flex: 0.2,
    backgroundColor: JolocomTheme.primaryColorBlack
  },
  buttonBlock: {
    flex: 0.1,
    backgroundColor: JolocomTheme.primaryColorBlack
  },
  buttonContainer: {
    height: '100%',
    width: '50%',
    borderRadius: 4,
    backgroundColor: JolocomTheme.primaryColorPurple
  },
  buttonText: {
    color: JolocomTheme.primaryColorWhite,
    fontSize: JolocomTheme.headerFontSize,
    fontWeight: "100" 
  }
})

const carouselInfo: Slide[] = [
  {
    svgImage: <Landing00 />,
    title: 'Your Jolocom Wallet',
    infoText: 'Take back control of your digital self and protect your private data against unfair usage.'
  },
  {
    svgImage: <Landing01 height={'100%'} width={'100%'} />,
    title: "It's easy",
    infoText: 'Forget about long forms and registrations. Instantly access services without using your social media profiles.'
  },
  {
    svgImage: <Landing03 height={'100%'} width={'100%'} />,
    title: 'Enhanced privacy',
    infoText: 'Share only the information a service really needs. Protect your digital self against fraud.'
  },
  {
    svgImage: <Landing02 height={'100%'} width={'100%'} />,
    title: 'Greater control',
    infoText: 'Keep all your data with you in one place, available at any time. Track where you sign in to services.'
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
            text='Get started'
          />
        </Block>
      </Container>
    )
  }
}
