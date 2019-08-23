import React from 'react'
import { StyleSheet } from 'react-native'
import { Block, CenteredText, Container } from 'src/ui/structure'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { BackupWarning } from '../../recovery/components/backupWarning'
import { textXXL } from '../../../styles/typography'
import { JolocomTheme } from '../../../styles/jolocom-theme'
import { Colors } from '../../../styles'

interface Props {}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  text: {
    ...Typography.mainText,
    textAlign: 'center',
    color: Colors.greyLight,
    paddingHorizontal: '5%',
  },
})

export class RecordsComponent extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <Container style={styles.container}>
        <BackupWarning />
        <Block>
          <CenteredText
            msg={I18n.t(strings.YOU_HAVENT_LOGGED_IN_TO_ANY_SERVICES_YET) + '.'}
            style={styles.text}
          />
        </Block>
      </Container>
    )
  }
}
