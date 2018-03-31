import * as React from 'react'
import { View, StyleSheet, Dimensions,  } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
const Image = require('react-native-remote-svg').default
import { Button } from 'react-native-material-ui'
import { Container, Header, Block, CenteredText } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'

const { width: viewWidth , height: viewHeight } = Dimensions.get('window')
export const sliderWidth = viewWidth
export const itemWidth = viewWidth

const carouselInfo = [{
  svgImage: require('src/img/img_onboarding-00.svg')
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

export interface ComponentState {
  activeSlide: number;
}

export interface Props {
  handleButtonTap: () => void;
}

export class LandingComponent extends React.Component<Props, ComponentState> {

  constructor(props: Props) {
    super(props)
    this.state = {activeSlide: 0};
  }

  // TODO INTERFACE FOR ITEM
  _renderItem({item} : {item : any}) {
    const { svgImage, title, infoText  } = item
    return(
      <Container style={styles.carouselContainer}>
        <Image
          style={{ 
            width: '100%',
            flex: 1
          }}
          source={svgImage}
        />

        {title ? <Block flex={0.5}>
          <Header title={title} />
          <CenteredText style={styles.subHeader} msg={infoText} />
        </Block> : null}
      </Container>
    )
  }

  get pagination () {
    const { activeSlide } = this.state
    return (
      <Pagination
        dotsLength={carouselInfo.length}
        activeDotIndex={activeSlide}
        dotStyle={{
          width: 7,
          height: 7,
          borderRadius: 5,
          marginHorizontal: 1,
          backgroundColor: '#942f51'
        }}
        inactiveDotStyle={{
          width: 7,
          height: 7,
          borderRadius: 5,
          marginHorizontal: 1,
          backgroundColor: 'grey'
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  render() {
    return (
      <Container>
        <Block flex={ 0.8 }>
          <Carousel
            ref={'carousel'}
            data={carouselInfo}
            renderItem={this._renderItem}
            lockScrollWhileSnapping
            loop
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            layout={'default'}
            onSnapToItem={(index : number) => this.setState({ activeSlide: index })}
          />
        </Block>
        <Block flex={ 0.1 }>
          { this.pagination }
        </Block>
        <Block flex={0.1}>
          <Button
            onPress={this.props.handleButtonTap}
            raised
            primary
            text="Create Your Identity" />
        </Block>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  carouselContainer: {
    width: viewWidth
  },
  subHeader: {
    width: viewWidth * 0.85,
    fontSize: 16,
    color: JolocomTheme.textStyles.subheadline.color,
    textAlign: 'center',
    justifyContent: 'center',
    margin: '5%'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: viewWidth
  }
})
