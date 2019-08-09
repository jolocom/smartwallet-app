import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-native-material-ui'
import { navigationActions } from 'src/actions/'
import {
  Text,
  StyleSheet,
  View,
  Image,
  BackHandler,
  StatusBar,
} from 'react-native'
import I18n from 'src/locales/i18n'
import { errorTitleMessages } from 'src/lib/errors'
import { getRandomStringFromArray } from 'src/utils/getRandomStringFromArray'
import strings from 'src/locales/strings'
import { ThunkDispatch } from '../../store'
import { NavigationScreenProps } from 'react-navigation'
import { Colors, Spacing, Typography, Buttons } from 'src/styles'
const errorImage = require('src/resources/img/error_image.png')

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps>,
    NavigationScreenProps {
  errorTitle?: string
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blackMain,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '5%',
  },
  upperContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: Spacing['4XL'],
  },
  textBlock: {
    marginTop: Spacing.LG,
    paddingHorizontal: Spacing.MD,
    alignItems: 'center',
  },
  errorTextHeader: {
    ...Typography.mainText,
    textAlign: 'center',
    color: Colors.sandLight,
  },
  errorText: {
    ...Typography.subMainText,
    textAlign: 'center',
    color: Colors.sandLight,
    marginTop: Spacing.MD,
  },
  buttonBlock: {
    marginTop: Spacing.LG,
  },
})

export class ExceptionComponent extends React.PureComponent<Props> {
  private onBackButtonPressAndroid = (): boolean => {
    this.handlePress()
    return true
  }
  public componentDidMount(): void {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackButtonPressAndroid,
    )
  }

  public componentWillUnmount(): void {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onBackButtonPressAndroid,
    )
  }

  private handlePress = (): void => {
    const { navigation } = this.props
    if (navigation) {
      this.props.navigateBack(
        navigation.state.params && navigation.state.params.returnTo,
      )
    }
  }

  public render(): JSX.Element | null {
    const stateParams =
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params
    if (!stateParams) return null

    // TODO: display error code
    const err = stateParams.error
    const errorTitle =
      this.props.errorTitle || getRandomStringFromArray(errorTitleMessages)
    let errorText = err
      ? err.message
      : strings.THERE_WAS_AN_ERROR_WITH_YOUR_REQUEST
    errorText = I18n.t(errorText) + '.'
    console.error(err && err.origError ? err.origError : err)

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.upperContainer}>
          <Image source={errorImage} style={{ width: 160, height: 160 }} />
          <View style={styles.textBlock}>
            <Text style={styles.errorTextHeader}>
              {I18n.t(errorTitle) + '.'}
            </Text>
            <Text numberOfLines={5} style={styles.errorText}>
              {errorText}
            </Text>
          </View>
        </View>
        <View style={styles.buttonBlock}>
          <Button
            raised
            onPress={this.handlePress}
            style={{
              container: Buttons.buttonStandardContainer,
              text: Buttons.buttonStandardText,
            }}
            upperCase={false}
            text={I18n.t(strings.GO_BACK)}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (): {} => ({})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  navigateBack: (routeName: string) =>
    dispatch(navigationActions.navigate({ routeName })),
})

export const Exception = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExceptionComponent)
