import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors } from '../../../styles'
import Modal from 'react-native-modal'

interface Props {
  isVisible: boolean
  close?: () => void
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: '#444145',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 24,
  },
  title: {
    color: Colors.white,
    fontSize: 26,
    textAlign: 'center',
  },
  loaderContainer: {
    margin: 24,
  },
  waring: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
})
export const LoadingModal: React.FC<Props> = ({
  isVisible,
  close,
  children,
}) => (
  <Modal
    isVisible={isVisible}
    animationIn={'fadeIn'}
    animationOut={'fadeOut'}
    onBackdropPress={close}
  >
    <View style={styles.container}>{children}</View>
  </Modal>
)
