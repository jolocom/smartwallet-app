import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, Animated, ScrollView } from 'react-native'

import { openExpiredDetails } from 'src/actions/documents'
import { DecoratedClaims } from 'src/reducers/account'
import { RootState } from 'src/reducers'
import { getDocumentClaims } from 'src/utils/filterDocuments'
import { ThunkDispatch } from 'src/store'
import { Container, Block, CenteredText } from 'src/ui/structure'

import { JolocomTheme } from 'src/styles/jolocom-theme'
import I18n from 'src/locales/i18n'

import { DocumentsCarousel } from '../components/documentsCarousel'
import { DocumentsList } from '../components/documentsList'
import { DocumentViewToggle } from '../components/documentViewToggle'

interface Props extends ReturnType<typeof mapDispatchToProps>, ReturnType<typeof mapStateToProps> {}

interface State {
  activeDocumentIndex: number
  showingValid: boolean
}

/*
const APPBAR_HEIGHT = Platform.select({
  ios: 44,
  android: 56,
  default: 64,
})
*/

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: JolocomTheme.primaryColorGrey,
  },
  topContainer: {
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: {
    fontFamily: JolocomTheme.contentFontFamily,
    fontSize: 30, // FIXME
    color: '#959595', // FIXME
  },
})

export class DocumentsContainer extends React.Component<Props, State> {
  public ScrollViewRef: ScrollView | null = null

  public state = {
    activeDocumentIndex: 0,
    showingValid: true,
  }

  private getValidDocuments = (claims: DecoratedClaims[]) =>
    claims.filter(claim =>
      claim.expires ? claim.expires.valueOf() >= new Date().valueOf() : true,
    )

  private getExpiredDocuments = (claims: DecoratedClaims[]) =>
    claims.filter(
      document => document.expires && document.expires.valueOf() < new Date().valueOf(),
    )

  private scrollToTop() {
    if (this.ScrollViewRef) {
      this.ScrollViewRef.scrollTo({ x: 0, y: 0, animated: true })
    }
  }

  private onActiveIndexChange(index: number) {
    this.setState({ activeDocumentIndex: index })
    this.scrollToTop()
  }

  private handleToggle = () => {
    this.setState((prevState: State) => ({
      showingValid: !prevState.showingValid,
      activeDocumentIndex: 0,
    }))
    this.scrollToTop()
  }

  public render() {
    const { openExpiredDetails, decoratedCredentials } = this.props
    const documents = getDocumentClaims(decoratedCredentials['Other'])
    const expiredDocuments = this.getExpiredDocuments(documents)
    const validDocuments = this.getValidDocuments(documents)
    const isEmpty =
      (this.state.showingValid ? validDocuments : expiredDocuments).length == 0

    return (
      <Animated.View style={styles.mainContainer}>
        <DocumentViewToggle
          showingValid={this.state.showingValid}
          onTouch={this.handleToggle}
        />
        <ScrollView
          // scrollEventThrottle={16}
          // onScroll={Animated.event([
          //   {
          //     nativeEvent: {
          //       contentOffset: { y: this.state.headerHeight },
          //     },
          //   },
          // ])}
          // to scroll to top upon changing card
          ref={ref => (this.ScrollViewRef = ref)}
        >
          {isEmpty ? (
            <Container>
              <Block>
                <CenteredText
                  msg={I18n.t('No documents to see here') + '.'}
                  style={styles.centeredText}
                />
              </Block>
            </Container>
          ) : this.state.showingValid ? (
            <DocumentsCarousel
              documents={validDocuments}
              activeIndex={this.state.activeDocumentIndex}
              onActiveIndexChange={this.onActiveIndexChange.bind(this)}
            />
          ) : (
            <DocumentsList
              documents={expiredDocuments}
              onDocumentPress={openExpiredDetails}
            />
          )}
        </ScrollView>
      </Animated.View>
    )
  }
}

const mapStateToProps = ({
  account: {
    claims: { decoratedCredentials },
  },
}: RootState) => ({
  decoratedCredentials,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  openExpiredDetails: (doc: DecoratedClaims) =>
    dispatch(openExpiredDetails(doc)),
})

export const Documents = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentsContainer)
