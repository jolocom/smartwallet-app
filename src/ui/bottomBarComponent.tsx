import React from 'react'
import { StyleSheet, View, Dimensions, Platform, TouchableOpacity } from 'react-native'
import Svg, {
  Circle,
  Defs,
  G,
  Mask,
  Path,
  Polygon,
  Use,
} from 'react-native-svg'
import { Colors } from '../styles'
import LinearGradient from 'react-native-linear-gradient'
import { BottomTabBarProps } from 'react-navigation'
import { debug } from '../styles/presets'

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    bottom: -50,
  },
  circle: {
    backgroundColor: Colors.joloColor,
    borderRadius: 35,
    position: 'absolute',
  },
  buttonWrapper: {
    position: 'absolute',
    width: '100%',
    top: 0,
    height: 60,
    zIndex: 2,
    flexDirection: 'row',
    ...debug,
  },
})

// ramda?
const parsePath = () => {
  const origPath =
    'M414,38.2468806 L414,109.427911 L414,109.427911 L0,110.544855 L0,38.2468806 C-2.53876144e-15,17.5163202 16.8054396,0.710880602 37.536,0.710880602 L163.503362,0.710880602 L163.503362,0.710880602 C161.782566,5.63732363 160.846285,10.9383896 160.846285,16.4607145 C160.846285,42.5558923 181.753319,63.710216 207.543594,63.710216 C233.333869,63.710216 254.240903,42.5558923 254.240903,16.4607145 C254.240903,10.9383896 253.304622,5.63732363 251.583826,0.710880602 L376.423017,0.710880602 C397.153577,0.710880602 414,17.5163202 414,38.2468806 Z'
  const origWidth = 414
  const { width } = Dimensions.get('window')

  const coordArray = origPath.split(' ')
  coordArray.pop()
  const coordinates = coordArray.map(vals => {
    const coordinates = vals.split(',')
    const paths = coordinates.map(val => {
      let newVal = val
      let pathType
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (isNaN(val[0] as any)) {
        pathType = val[0]
        newVal = val.substr(1)
      } else {
        pathType = ''
      }
      const numVal = parseFloat(newVal)
      const scaledVal = numVal * (width / origWidth)
      return `${pathType}${scaledVal}`
    })
    return paths.join(',')
  })
  coordinates.push('Z')
  return coordinates.join(' ')
}

const SVGBar = () => {
  const { width } = Dimensions.get('window')

  return (
    <Svg width={width} height={110} viewBox={`0 0 ${width} 110`}>
      <Defs>
        <Path
          //d="M414,38.2468806 L414,109.427911 L414,109.427911 L0,110.544855 L0,38.2468806 C-2.53876144e-15,17.5163202 16.8054396,0.710880602 37.536,0.710880602 L163.503362,0.710880602 L163.503362,0.710880602 C161.782566,5.63732363 160.846285,10.9383896 160.846285,16.4607145 C160.846285,42.5558923 181.753319,63.710216 207.543594,63.710216 C233.333869,63.710216 254.240903,42.5558923 254.240903,16.4607145 C254.240903,10.9383896 253.304622,5.63732363 251.583826,0.710880602 L376.423017,0.710880602 C397.153577,0.710880602 414,17.5163202 414,38.2468806 Z"
          d={parsePath()}
          id="path-1"
        />
      </Defs>
      <G id="Symbols" fill="none" fillRule="evenodd">
        <G id="balck_bckg">
          <Mask id="mask-2" fill="white">
            <Use xlinkHref="#path-1" />
          </Mask>
          <G id="Clip-86" />
          <Polygon
            id="Fill-85"
            fill="#0B030D"
            mask="url(#mask-2)"
            points="0 -5.77549882 416.208 -5.77549882 416.208 109.272 6.16191739e-14 109.272"
          />
        </G>
      </G>
    </Svg>
  )
}

interface Props extends BottomTabBarProps {}

export const BottomBarComponent = (props: Props) => {
  console.log(props)
  const { width } = Dimensions.get('window')
  const buttonMarginModif = 16 / 414
  const buttonSizeModif = 0.175
  const circleSize = width * buttonSizeModif

  const buttonVerticalPosition = -Math.floor(
    circleSize / 2 - width * buttonMarginModif,
  )
  const buttonHorizPosition = Math.ceil((width - circleSize) / 2)

  return (
    <View style={styles.wrapper}>
      <View style={styles.buttonWrapper}>
        <View
          style={{ flex: 1, marginLeft: '6%', marginRight: '12%', ...debug }}
        />
        <View
          style={{ flex: 1, marginLeft: '12%', marginRight: '6%', ...debug }}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.4}
        style={{
          ...styles.circle,
          width: circleSize,
          height: circleSize,
          left: buttonHorizPosition,
          top: buttonVerticalPosition,
        }}
      >
        <LinearGradient
          style={{ flex: 1, borderRadius: 35 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['rgb(145, 25, 66)', 'rgb(210, 45, 105)']}
        />
      </TouchableOpacity>
      <SVGBar />
    </View>
  )
}
