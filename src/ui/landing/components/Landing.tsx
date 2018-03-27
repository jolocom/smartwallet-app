import * as React from 'react'
import { View, Text, Animated, StyleSheet, Dimensions, ScrollView  } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Image from 'react-native-remote-svg'
import { Button } from 'react-native-material-ui'

const { width: viewWidth , height: viewHeight } = Dimensions.get('window')
export const sliderWidth = viewWidth
export const itemWidth = viewHeight

const carouselInfo = [{
  imageUrl: require('../../../img/logo_start.svg'),
  title: '',
  infoText: ''
}, {
  imageUrl: require('../../../img/img_onboarding-01.svg'),
  title: 'Create an independent and secure digital identity.',
  infoText: 'Collect your data at a secure place. It’s yours, so only you own it!'
}, {
  imageUrl: require('../../../img/img_onboarding-02.svg'),
  title: 'Have all your data at your fingertips.',
  infoText: 'See all your data in one safe place. Pull the plug and your data is only yours.'
}, {
  imageUrl: require('../../../img/img_onboarding-03.svg'),
  title: 'Be aware of the information you share.',
  infoText: 'See what you shared with whom. Have total control over your data.'
}, {
  imageUrl: require('../../../img/img_onboarding-04.svg'),
  title: 'Our Wallet keeps your data as safe as your bank account.',
  infoText: 'We use the latest encryption technology and blockchain to store your sensitive data.'
}, {
  imageUrl: require('../../../img/img_onboarding-05.svg'),
  title: 'Security is hard to maintain, that is why the storage costs.',
  infoText: 'The storage of your data is payed in ether, a webbased currency. But only the change of data costs.'
}]

export interface ComponentState {
  activeSlide: number;
}

export interface Props {
  clickNext: () => void;
}


export interface LandingState {}

export class LandingComponent extends React.Component<Props, ComponentState> {

  constructor(props: Props) {
    super(props)
    this.state = {activeSlide: 0};
  }

  _renderItem({item, index} : {item : any, index: number}) {
    const { imageUrl, title, infoText  } = item
    return(
      <View style={styles.slide}>
        <View style={styles.container}>
          <Image
            style={{width: viewWidth, height: viewHeight * 0.5}}
            source={imageUrl}
          />
          <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={styles.header}>{ title }</Text>
            <Text>{ title }</Text>
          </View>
        </View>
      </View>
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
      <View>
        <Text>Testing My Super Landing Screen</Text>
        <Carousel
          ref={(c : any) => { this._carousel = c }}
          data={carouselInfo}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          layout={'default'}
          onSnapToItem={(index : number) => this.setState({ activeSlide: index })}
        />
        { this.pagination }
        <View style={styles.buttonContainer}>
          <Button
            onPress={this.props.clickNext}
            raised
            primary
            text="Create Your Identity" />
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    height: viewHeight * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: 'green',
    width: viewWidth * 0.6,
    fontSize: 20,
    margin: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: viewWidth
  },
  slide: {
	  flexDirection: 'row',
	  width: itemWidth
	}
})
