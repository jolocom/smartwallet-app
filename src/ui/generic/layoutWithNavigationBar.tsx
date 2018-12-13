import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { LoadingSpinner } from '.'
import {BottomActionBar} from './BottomActionBar'

const NAVIGATION_CONTENT_HEIGHT = 55

interface Props {
  onScannerSuccess: (jwt: string) => void,
  openScanner: () => void,
  children: ReactNode,
  loading?: boolean,
}
interface State {}

const styles = StyleSheet.create({
  childrenContainer: {
    width: '100%',
    paddingBottom: NAVIGATION_CONTENT_HEIGHT,
  }
})

export class LayoutWithNavigationBar extends React.Component<Props, State> {
  render() {
    if (this.props.loading) {
      return <LoadingSpinner />
    }

    return (
      <View>
        <View style={styles.childrenContainer}>
          {this.props.children}
        </View>
        <BottomActionBar openScanner={this.props.openScanner}/>
      </View>
    )
  }
}
