import React, { ReactNode } from 'react'
import {
  StyleSheet,
  View,
  AccessibilityRole, AccessibilityState,
} from 'react-native'
import { BottomTabBarProps, TabScene, SafeAreaView } from 'react-navigation'
import { SVGBar } from '../components/bottomBarSvg'
import { routeList } from '../../../routeList'
import { TabButton } from '../components/tabButton'
import { InteractionButton } from '../components/interactionButton'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import { navigationActions } from '../../../actions'
import { withLoading } from '../../../actions/modifiers'

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    bottom: 67 - 110,
    //bottom: '-6%'
  },
  buttonWrapper: {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: 0,
    height: 67,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  } = props
  const { routes, index } = navigation.state

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
                focused={focused}
                route={route}
                renderIcon={(scene: TabScene) => renderIcon(scene)}
                onTabPress={() => onTabPress(scene)}
                label={label}
                accessibility={accessibility}
              />
            </React.Fragment>
          )
        })}
      </View>
      <InteractionButton navigateScanner={navigateInteraction} />
      <SVGBar />
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
