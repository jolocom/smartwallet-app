import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { JolocomTheme } from '../../styles/jolocom-theme'
import * as React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const NAVIGATION_HEIGHT = 82
const NAVIGATION_CONTENT_HEIGHT = NAVIGATION_HEIGHT - 32

interface ActionBarProps {
  openScanner: () => void
}

const styles = StyleSheet.create({
  navigationContent: {
    height: NAVIGATION_CONTENT_HEIGHT,
    backgroundColor: '#fafafa',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  navigationContentItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  contentLeft: {
    marginRight: 36
  },
  contentRight: {
    marginLeft: 36
  },
  qrCodeButton: {
    position: 'absolute',
    bottom: 6,
    height: 72,
    width: 72,
    borderRadius: 35,
    backgroundColor: JolocomTheme.primaryColorPurple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8
  }
})

export class BottomActionBar extends React.Component<ActionBarProps, {}> {
  render() {
    return (
      <View display={'flex'} alignItems={'center'}>
        <View style={styles.navigationContent}>
          <View style={[styles.navigationContentItem, styles.contentLeft]} />
          <View style={[styles.navigationContentItem, styles.contentRight]} />
        </View>

        <TouchableOpacity
          style={styles.qrCodeButton}
          onPress={this.props.openScanner}
        >
          <Icon size={30} name="qrcode-scan" color="white" />
        </TouchableOpacity>
      </View>
    )
  }
}
