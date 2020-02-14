import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { IdentitySummary } from '../../../actions/sso/types'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { navigationActions } from '../../../actions'
import { routeList } from '../../../routeList'
import { JolocomButton, Wrapper } from '../../structure'
import { Colors } from '../../../styles'
import { fontMedium } from '../../../styles/typography'
import { ActionSheet } from '../../structure/actionSheet'
import strings from '../../../locales/strings'
import I18n from 'src/locales/i18n'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreyLighter,
  },
  topSection: {
    paddingVertical: Spacing.MD,
    alignItems: 'center',
  },
  logo: {
    borderRadius: 35,
    width: 70,
    height: 70,
    margin: 10,
  },
  serviceName: {
    fontFamily: fontMedium,
    fontSize: 28,
    color: overflowBlack,
  },
  description: {
    fontFamily: fontMain,
    fontSize: 16,
    color: black065,
    marginTop: 10,
    marginBottom: 4,
    marginHorizontal: '10%',
    ...centeredText,
  },
  documentWrapper: {
    alignItems: 'center',
    padding: 10,
  },
})

export interface CredentialOfferNavigationParams {
  requesterSummary: IdentitySummary
  credentialOffering: CredentialOffering[]
}

interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<
    NavigationState,
    CredentialOfferNavigationParams
  >
}

export const CredentialsReceiveContainer = (props: Props) => {
  const [selected, setSelected] = useState<CredentialOffering[]>([])
  const { navigation, acceptSelectedCredentials, goBack } = props
  const {
    state: {
      params: { requesterSummary, credentialOffering },
    },
  } = navigation
  const publicProfile = requesterSummary && requesterSummary.publicProfile

  const handleConfirm = () => {
    acceptSelectedCredentials(selected)
  }

  const onPressDocument = (cred: CredentialOffering) => {
    if (selected.includes(cred)) {
      setSelected(selected.filter(current => current !== cred))
    } else {
      setSelected([...selected, cred])
    }
  }

  const isDocumentSelected = (offering: CredentialOffering) =>
    selected.includes(offering)

  return (
    <Wrapper style={{ backgroundColor: Colors.iBackgroundWhite }}>
      <CredentialReceiveComponent
        credentialOffering={credentialOffering}
        publicProfile={publicProfile}
        isDocumentSelected={isDocumentSelected}
        onPressDocument={onPressDocument}
      />
      <ActionSheet showSlide={true}>
        <JolocomButton
          textStyle={{ fontFamily: fontMedium }}
          disabled={selected.length === 0}
          onPress={handleConfirm}
          text={I18n.t(strings.SAVE)}
        />
        <JolocomButton
          containerStyle={{ marginTop: 10 }}
          onPress={goBack}
          text={I18n.t(strings.CANCEL)}
          transparent
        />
      </ActionSheet>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  acceptSelectedCredentials: (selected: CredentialOffering[]) =>
    dispatch(withErrorScreen(withLoading(consumeCredentialReceive(selected)))),
  goBack: () =>
    dispatch(
      navigationActions.navigate({ routeName: routeList.InteractionScreen }),
    ),
})

export const CredentialReceive = connect(
  null,
  mapDispatchToProps,
)(CredentialsReceiveContainer)
