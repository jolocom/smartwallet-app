import React from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  AccessibilityRole,
  AccessibilityState,
} from 'react-native'
import { BottomTabBarProps, TabScene, SafeAreaView } from 'react-navigation'
import { BottomBarSVG } from '../components/bottomBarSvg'
import { routeList } from '../../../routeList'
import { TabButton } from '../components/tabButton'
import { InteractionButton } from '../components/interactionButton'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import { navigationActions } from '../../../actions'
import { withLoading } from '../../../actions/modifiers'

const { width } = Dimensions.get('window')

const SCREEN_PROPORTION = width / 414
const BAR_HEIGHT = SCREEN_PROPORTION * 80
const SVG_BAR_HEIGHT = SCREEN_PROPORTION * 110
const BAR_EXTRA_SAFE_HEIGHT = 30

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    bottom: BAR_HEIGHT - SVG_BAR_HEIGHT - BAR_EXTRA_SAFE_HEIGHT,
    height: SVG_BAR_HEIGHT + BAR_EXTRA_SAFE_HEIGHT,
  },
  buttonWrapper: {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: 0,
    height: BAR_HEIGHT,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safeView: {
    width: '100%',
    height: BAR_EXTRA_SAFE_HEIGHT,
    backgroundColor: '#0B030D',
    marginTop: -4,
  },
})

interface Props
  extends BottomTabBarProps,
    ReturnType<typeof mapDispatchToProps> {
  onTabPress: (scene: TabScene) => null
  onTabLongPress: (scene: TabScene) => null
  getTestID: (scene: TabScene) => string
  getAccessibilityLabel: (scene: TabScene) => string
  getAccessibilityRole: (scene: TabScene) => string
  getAccessibilityStates: (scene: TabScene) => string[]
}

const BottomBarContainer = (props: Props) => {
  const {
    navigation,
    renderIcon,
    onTabPress,
    getLabelText,
    getTestID,
    getAccessibilityLabel,
    getAccessibilityRole,
    getAccessibilityStates,
    navigateInteraction,
    safeAreaInset,
    activeTintColor,
    inactiveTintColor,
  } = props
  const { routes, index } = navigation.state
  const colors = { activeTintColor, inactiveTintColor }

  return (
    <SafeAreaView style={styles.wrapper} forceInset={safeAreaInset}>
      <View style={[styles.buttonWrapper]}>
        {routes.map((route, i) => {
          const focused = i === index
          const scene = { route, index, focused }
          const label = getLabelText(scene) as string
          const testID = getTestID(scene)
          const accessibility = {
            label: getAccessibilityLabel(scene),
            role: getAccessibilityRole(scene) as AccessibilityRole,
            states: getAccessibilityStates(scene) as AccessibilityState[],
          }

          return (
            <React.Fragment key={route.key}>
              {i === 2 && <View style={{ flex: 1 }} />}
              <TabButton
                testID={testID}
                scene={scene}
                renderIcon={renderIcon}
                onTabPress={() => onTabPress(scene)}
                label={label}
                accessibility={accessibility}
                colors={colors}
              />
            </React.Fragment>
          )
        })}
      </View>
      <InteractionButton navigateScanner={navigateInteraction} />
      {/* NOTE: the *1.01 is removing the white space between the bar and screen edges */}
      <BottomBarSVG scaledHeight={SVG_BAR_HEIGHT * 1.01} />
      <View style={styles.safeView} />
    </SafeAreaView>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  navigateInteraction: () =>
    dispatch(
      withLoading(
        navigationActions.navigate({ routeName: routeList.InteractionScreen }),
      ),
    ),
})

export const BottomBar = connect(
  null,
  mapDispatchToProps,
)(BottomBarContainer)
