import * as React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Container } from '../../structure'
import { Colors } from '../../../styles'
import { fontMain } from '../../../styles/typography'
import { GradientButton } from '../../structure/gradientButton'
import { NavigationSection } from '../../structure/navigationSection'

interface Props {
  isLoading: boolean
  isAutoBackupEnabled: boolean
  enableAutoBackup: () => void
  onDisableAutoBackup: () => void
  goBack: () => void
  lastBackup?: string
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.baseBlack,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  scrollView: {
    padding: 18,
  },
  section: {
    backgroundColor: Colors.black,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 32,
    borderRadius: 8,
    padding: 24,
    paddingBottom: 28,
  },
  title: {
    fontFamily: fontMain,
    color: Colors.white,
    fontSize: 28,
  },
  subtitle: {
    fontFamily: fontMain,
    color: Colors.white,
    fontSize: 22,
    textAlign: 'center',
  },
  description: {
    color: Colors.white050,
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  warning: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 28,
  },
  info: {
    textAlign: 'center',
    color: Colors.purpleMain,
    marginTop: 28,
  },
  buttonContainer: {
    marginTop: 22,
    width: '100%',
    paddingVertical: 9,
    margin: 0,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
  },
})
const BackupComponent: React.FC<Props> = ({
  isLoading,
  enableAutoBackup,
  onDisableAutoBackup,
  isAutoBackupEnabled,
  goBack,
  lastBackup,
}) => {
  return (
    <Container style={styles.container}>
      <NavigationSection
        onNavigation={goBack}
        isBackButton={true}
        isDark={true}
      />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Backup options</Text>

        {/*<View style={styles.section}>*/}
        {/*  <Text style={styles.subtitle}>Backup data on your own</Text>*/}
        {/*  <Text style={styles.description}>*/}
        {/*    Download an encrypted copy of the data in your SmartWallet to your*/}
        {/*    device. Make sure to keep your backups up-to-date and stored*/}
        {/*    somewhere safe*/}
        {/*  </Text>*/}
        {/*  <GradientButton containerStyle={styles.buttonContainer} textStyle={styles.buttonText} onPress={() => {}} text={'Export file'} disabled={true} />*/}
        {/*</View>*/}

        <View style={styles.section}>
          <Text style={styles.subtitle}>Jolocom backup service</Text>
          <Text style={styles.description}>
            Store your information using Jolocom’s backup service. With this
            option, the Jolocom team cannot view your data and your info stays
            automatically up-to-date.
          </Text>
          {isAutoBackupEnabled ? (
            <React.Fragment>
              <GradientButton
                containerStyle={styles.buttonContainer}
                textStyle={styles.buttonText}
                text={isLoading ? 'Deleting backup...' : 'Disable auto-backup'}
                onPress={onDisableAutoBackup}
                disabled={isLoading}
              />
              <Text style={styles.info}>
                {lastBackup &&
                  `Last backup ${new Date(lastBackup).toLocaleDateString()}`}
              </Text>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <GradientButton
                containerStyle={styles.buttonContainer}
                textStyle={styles.buttonText}
                onPress={enableAutoBackup}
                text={
                  isLoading ? 'Synchronization started…' : 'Use backup service'
                }
                disabled={isLoading}
              />
              <Text style={styles.warning}>
                By clicking here i agreed backing up my data on Jolocom’s
                central server and i know that it is not viewable by anyone
              </Text>
            </React.Fragment>
          )}
        </View>
      </ScrollView>
    </Container>
  )
}

export default BackupComponent
