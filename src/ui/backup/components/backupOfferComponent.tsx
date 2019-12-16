import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Container } from '../../structure'
import { Colors } from '../../../styles'
import { NavigationSection } from '../../structure/navigationSection'
import { GradientButton } from '../../structure/gradientButton'

interface Props {
  enableAutoBackup: () => void
  close: () => void
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
const BackupOfferComponent: React.FC<Props> = ({ close, enableAutoBackup }) => {
  return (
    <Container style={styles.container}>
      <NavigationSection
        onNavigation={close}
        isBackButton={false}
        isDark={true}
      />
      <Text style={styles.title}>
        Store your data by yourself or try to use Jolocom backup service!
      </Text>
      <View>{/* TODO add correct icon*/}</View>
      <Text style={styles.logoTitle}>Automatic synchronization</Text>
      <View style={styles.bottomSheet}>
        <GradientButton
          onPress={enableAutoBackup}
          text={'Turn on backup service'}
        />
        <Text style={styles.info}>
          By clicking here i agreed backing up my data on Jolocom’s central
          server and i know that it is not viewable by anyone
        </Text>
        {/*TODO add onPress*/}
        <TouchableOpacity>
          <Text style={styles.textButton}>Keep it manually</Text>
        </TouchableOpacity>
      </View>
    </Container>
  )
}

export default BackupOfferComponent
