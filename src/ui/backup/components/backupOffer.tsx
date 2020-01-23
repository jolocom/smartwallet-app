import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Container } from '../../structure'
import { Colors } from '../../../styles'
import { GradientButton } from '../../structure/gradientButton'
import { ActionSheet } from '../../structure/actionSheet'

interface Props {
  enableAutoBackup: () => void
  manualBackup: () => void
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.baseBlack,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  title: {
    color: Colors.white080,
    fontSize: 22,
    textAlign: 'center',
    marginHorizontal: 40,
  },
  logoTitle: {
    color: Colors.white080,
    fontSize: 22,
    textAlign: 'center',
    marginHorizontal: 108,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.black,
    height: 230,
    width: '100%',
    borderRadius: 22,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 28,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 28,
    marginHorizontal: 20,
  },
  info: {
    color: Colors.white050,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  textButton: {
    color: Colors.white,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
})
export const BackupOfferComponent: React.FC<Props> = ({
  enableAutoBackup,
  manualBackup,
}) => {
  return (
    <Container style={styles.container}>
      <Text style={styles.title}>
        Store your data by yourself or try to use Jolocom backup service!
      </Text>
      <View>{/* TODO add correct icon*/}</View>
      <Text style={styles.logoTitle}>Automatic synchronization</Text>
      <ActionSheet showSlide={true}>
        <GradientButton
          onPress={enableAutoBackup}
          text={'Turn on backup service'}
        />
        <Text style={styles.info}>
          By clicking here i agreed backing up my data on Jolocom’s central
          server server and i know that it is not viewable by anyone
        </Text>
        <TouchableOpacity onPress={manualBackup}>
          <Text style={styles.textButton}>Keep it manually</Text>
        </TouchableOpacity>
      </ActionSheet>
    </Container>
  )
}
