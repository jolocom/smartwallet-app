/**
 * NOTE: this is copied from react-navigation/src/views/TabView/TabBarBottom.js
 *       and modified to add the QRButton at QR_CODE_BUTTON_INDEX
 *
 *       The class in react-navigation/src/views/TabView/TabBarBottom is not
 *       exported, but instead it is wrapped using withOrientation (as below)
 *       so the original class is captured in a closure and is inaccessible, so
 *       had to be copied here.
 *
 *       Alterations to the original are marked with // <ALTERED></ALTERED>
 */

// <ALTERED>
const QR_CODE_BUTTON_INDEX = 2
const QR_CODE_BUTTON_RADIUS = 36
import { routeList } from 'src/routeList'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// </ALTERED>

import React from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Keyboard,
  Platform,
} from 'react-native';

import { SafeAreaView } from '@react-navigation/native';

// <ALTERED> to use absolute imports
import CrossFadeIcon from 'react-navigation-tabs/src/views/CrossFadeIcon';
import withDimensions from 'react-navigation-tabs/src/utils/withDimensions';
import { Colors } from 'src/styles';
// </ALTERED>

export type TabBarOptions = {
  keyboardHidesTabBar: boolean,
  activeTintColor?: string,
  inactiveTintColor?: string,
  activeBackgroundColor?: string,
  inactiveBackgroundColor?: string,
  allowFontScaling: boolean,
  showLabel: boolean,
  showIcon: boolean,
  labelStyle: any,
  tabStyle: any,
  adaptive?: boolean,
  style: any,
};

type Props = TabBarOptions & {
  navigation: any,
  descriptors: any,
  jumpTo: any,
  onTabPress: any,
  onTabLongPress: any,
  getAccessibilityLabel: (props: { route: any }) => string,
  getAccessibilityRole: (props: { route: any }) => string,
  getAccessibilityStates: (props: { route: any }) => string[],
  getButtonComponent: (props: { route: any }) => any,
  getLabelText: (props: { route: any }) => any,
  getTestID: (props: { route: any }) => string,
  renderIcon: any,
  dimensions: { width: number, height: number },
  isLandscape: boolean,
  safeAreaInset: { top: string, right: string, bottom: string, left: string },
};

type State = {
  layout: { height: number, width: number },
  keyboard: boolean,
  visible: Animated.Value,
};

const majorVersion = parseInt(Platform.Version, 10);
const isIos = Platform.OS === 'ios';
const isIOS11 = majorVersion >= 11 && isIos;

const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;

class TouchableWithoutFeedbackWrapper extends React.Component<*> {
  render() {
    const {
      onPress,
      onLongPress,
      testID,
      accessibilityLabel,
      accessibilityRole,
      accessibilityStates,
      ...props
    } = this.props;

    return (
      <TouchableWithoutFeedback
        onPress={onPress}
        onLongPress={onLongPress}
        testID={testID}
        hitSlop={{ left: 15, right: 15, top: 0, bottom: 5 }}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        accessibilityStates={accessibilityStates}
      >
        <View {...props} />
      </TouchableWithoutFeedback>
    );
  }
}

class TabBarBottom extends React.Component<Props, State> {
  static defaultProps = {
    keyboardHidesTabBar: false,
    activeTintColor: '#007AFF',
    activeBackgroundColor: 'transparent',
    inactiveTintColor: '#8E8E93',
    inactiveBackgroundColor: 'transparent',
    showLabel: true,
    showIcon: true,
    allowFontScaling: true,
    adaptive: isIOS11,
    safeAreaInset: { bottom: 'always', top: 'never' },
  };

  state = {
    layout: { height: 0, width: 0 },
    keyboard: false,
    visible: new Animated.Value(1),
  };

  componentDidMount() {
    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', this._handleKeyboardShow);
      Keyboard.addListener('keyboardWillHide', this._handleKeyboardHide);
    } else {
      Keyboard.addListener('keyboardDidShow', this._handleKeyboardShow);
      Keyboard.addListener('keyboardDidHide', this._handleKeyboardHide);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      Keyboard.removeListener('keyboardWillShow', this._handleKeyboardShow);
      Keyboard.removeListener('keyboardWillHide', this._handleKeyboardHide);
    } else {
      Keyboard.removeListener('keyboardDidShow', this._handleKeyboardShow);
      Keyboard.removeListener('keyboardDidHide', this._handleKeyboardHide);
    }
  }

  _handleKeyboardShow = () =>
    this.setState({ keyboard: true }, () =>
      Animated.timing(this.state.visible, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start()
    );

  _handleKeyboardHide = () =>
    Animated.timing(this.state.visible, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ keyboard: false });
    });

  _handleLayout = e => {
    const { layout } = this.state;
    const { height, width } = e.nativeEvent.layout;

    if (height === layout.height && width === layout.width) {
      return;
    }

    this.setState({
      layout: {
        height,
        width,
      },
    });
  };

  _renderLabel = ({ route, focused }) => {
    const {
      activeTintColor,
      inactiveTintColor,
      labelStyle,
      showLabel,
      showIcon,
      allowFontScaling,
    } = this.props;

    if (showLabel === false) {
      return null;
    }

    const label = this.props.getLabelText({ route });
    const tintColor = focused ? activeTintColor : inactiveTintColor;

    if (typeof label === 'string') {
      return (
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            { color: tintColor },
            showIcon && this._shouldUseHorizontalLabels()
              ? styles.labelBeside
              : styles.labelBeneath,
            labelStyle,
          ]}
          allowFontScaling={allowFontScaling}
        >
          {label}
        </Animated.Text>
      );
    }

    if (typeof label === 'function') {
      return label({ route, focused, tintColor });
    }

    return label;
  };

  _renderIcon = ({ route, focused }) => {
    const {
      navigation,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      showIcon,
      showLabel,
    } = this.props;
    if (showIcon === false) {
      return null;
    }

    const horizontal = this._shouldUseHorizontalLabels();

    const activeOpacity = focused ? 1 : 0;
    const inactiveOpacity = focused ? 0 : 1;

    return (
      <CrossFadeIcon
        route={route}
        horizontal={horizontal}
        navigation={navigation}
        activeOpacity={activeOpacity}
        inactiveOpacity={inactiveOpacity}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        style={[
          styles.iconWithExplicitHeight,
          showLabel === false && !horizontal && styles.iconWithoutLabel,
          showLabel !== false && !horizontal && styles.iconWithLabel,
        ]}
      />
    );
  };

  _shouldUseHorizontalLabels = () => {
    const { routes } = this.props.navigation.state;
    const { isLandscape, dimensions, adaptive, tabStyle } = this.props;

    if (!adaptive) {
      return false;
    }

    if (Platform.isPad) {
      let maxTabItemWidth = DEFAULT_MAX_TAB_ITEM_WIDTH;

      const flattenedStyle = StyleSheet.flatten(tabStyle);

      if (flattenedStyle) {
        if (typeof flattenedStyle.width === 'number') {
          maxTabItemWidth = flattenedStyle.width;
        } else if (typeof flattenedStyle.maxWidth === 'number') {
          maxTabItemWidth = flattenedStyle.maxWidth;
        }
      }

      return routes.length * maxTabItemWidth <= dimensions.width;
    } else {
      return isLandscape;
    }
  };

  render() {
    const {
      navigation,
      keyboardHidesTabBar,
      activeBackgroundColor,
      inactiveBackgroundColor,
      onTabPress,
      onTabLongPress,
      safeAreaInset,
      style,
      tabStyle,
    } = this.props;

    const { routes } = navigation.state;

    const tabBarStyle = [
      styles.tabBar,
      this._shouldUseHorizontalLabels() && !Platform.isPad
        ? styles.tabBarCompact
        : styles.tabBarRegular,
      style,
    ];

    // <ALTERED>
    const openScanner = () =>
      this.props.navigation.navigate(routeList.InteractionScreen)
    const QRCodeButtonPlaceholder = (
      <View
        style={[
          styles.tab,
          this._shouldUseHorizontalLabels()
            ? styles.tabLandscape
            : styles.tabPortrait,
          tabStyle,
        ]}
        key="QRCodeButtonPlaceholder"
        testID="QRCodeButtonPlaceholder"
      />
    )
    const QRCodeButton = (
      <TouchableOpacity style={styles.qrCodeButton} onPress={openScanner}>
        <Icon size={30} name="qrcode-scan" color="white" />
      </TouchableOpacity>
    )
    // </ALTERED>

    return (
      <View style={{ position: 'relative' }}>
        {/*<ALTERED>*/ QRCodeButton /*</ALTERED>*/}
        <Animated.View
          style={[
            styles.container,
            keyboardHidesTabBar
              ? {
                  // When the keyboard is shown, slide down the tab bar
                  transform: [
                    {
                      translateY: this.state.visible.interpolate({
                        inputRange: [0, 1],
                        outputRange: [this.state.layout.height, 0],
                      }),
                    },
                  ],
                  // Absolutely position the tab bar so that the content is below it
                  // This is needed to avoid gap at bottom when the tab bar is hidden
                  position: this.state.keyboard ? 'absolute' : null,
                }
              : null,
          ]}
          pointerEvents={
            keyboardHidesTabBar && this.state.keyboard ? 'none' : 'auto'
          }
          onLayout={this._handleLayout}
        >
          <SafeAreaView style={tabBarStyle} forceInset={safeAreaInset}>
            {routes.map((route, index) => {
              const focused = index === navigation.state.index;
              const scene = { route, focused };
              const accessibilityLabel = this.props.getAccessibilityLabel({
                route,
              });

              const accessibilityRole = this.props.getAccessibilityRole({
                route,
              });

              const accessibilityStates = this.props.getAccessibilityStates(
                scene
              );

              const testID = this.props.getTestID({ route });

              const backgroundColor = focused
                ? activeBackgroundColor
                : inactiveBackgroundColor;

              const ButtonComponent =
                this.props.getButtonComponent({ route }) ||
                TouchableWithoutFeedbackWrapper;

              // <ALTERED>
              // added React.Fragment and QRCodeButtonPlaceholder
              // </ALTERED>
              return (
                <React.Fragment key={route.key}>
                  {QR_CODE_BUTTON_INDEX == index && QRCodeButtonPlaceholder}
                  <ButtonComponent
                    onPress={() => onTabPress({ route })}
                    onLongPress={() => onTabLongPress({ route })}
                    testID={testID}
                    accessibilityLabel={accessibilityLabel}
                    accessibilityRole={accessibilityRole}
                    accessibilityStates={accessibilityStates}
                    style={[
                      styles.tab,
                      { backgroundColor },
                      this._shouldUseHorizontalLabels()
                        ? styles.tabLandscape
                        : styles.tabPortrait,
                      tabStyle,
                    ]}
                  >
                    {this._renderIcon(scene)}
                    {this._renderLabel(scene)}
                  </ButtonComponent>
                </React.Fragment>
              );
            })}
          </SafeAreaView>
        </Animated.View>
      </View>
    );
  }
}

const DEFAULT_HEIGHT = 49;
const COMPACT_HEIGHT = 29;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    flexDirection: 'row',
  },
  container: {
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 8,
  },
  tabBarCompact: {
    height: COMPACT_HEIGHT,
  },
  tabBarRegular: {
    height: DEFAULT_HEIGHT,
  },
  tab: {
    flex: 1,
    alignItems: isIos ? 'center' : 'stretch',
  },
  tabPortrait: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  tabLandscape: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconWithoutLabel: {
    flex: 1,
  },
  iconWithLabel: {
    flex: 1,
  },
  iconWithExplicitHeight: {
    height: Platform.isPad ? DEFAULT_HEIGHT : COMPACT_HEIGHT,
  },
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  labelBeneath: {
    fontSize: 11,
    marginBottom: 1.5,
  },
  labelBeside: {
    fontSize: 12,
    marginLeft: 15,
  },
  // <ALTERED>
  qrCodeButton: {
    position: 'absolute',
    top: -COMPACT_HEIGHT,
    height: QR_CODE_BUTTON_RADIUS * 2,
    width: QR_CODE_BUTTON_RADIUS * 2,
    borderRadius: QR_CODE_BUTTON_RADIUS,
    backgroundColor: Colors.purpleMain,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8,
    zIndex: 10,
  },
  // </ALTERED>
});

export default withDimensions(TabBarBottom);
