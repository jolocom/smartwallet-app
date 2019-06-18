import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, Animated, ScrollView } from 'react-native'

import { openDocumentDetails } from 'src/actions/documents'
import { DecoratedClaims } from 'src/reducers/account'
import { RootState } from 'src/reducers'
import { getDocumentClaims } from 'src/utils/filterDocuments'
import { ThunkDispatch } from 'src/store'
import { Container, Block, CenteredText } from 'src/ui/structure'

import { JolocomTheme } from 'src/styles/jolocom-theme'
import I18n from 'src/locales/i18n'
import { filters } from 'src/lib/filterDecoratedClaims'

import { DocumentsCarousel } from '../components/documentsCarousel'
import { DocumentsList } from '../components/documentsList'
import { DocumentViewToggle } from '../components/documentViewToggle'
import strings from '../../../locales/strings'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

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
    const { openDocumentDetails, decoratedCredentials } = this.props
    const documents = getDocumentClaims(decoratedCredentials['Other'])
    const docFilter = this.state.showingValid
      ? filters.filterByValid
      : filters.filterByExpired
    const displayedDocs = docFilter(documents)
    const isEmpty = displayedDocs.length == 0
    const otherIsEmpty = displayedDocs.length == documents.length

    return (
      <Animated.View style={styles.mainContainer}>
        {!otherIsEmpty && (
          <DocumentViewToggle
            showingValid={this.state.showingValid}
            onTouch={this.handleToggle}
          />
        )}
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
                  msg={I18n.t(strings.NO_DOCUMENTS_TO_SEE_HERE) + '.'}
                  style={styles.centeredText}
                />
              </Block>
            </Container>
          ) : this.state.showingValid ? (
            <DocumentsCarousel
              documents={displayedDocs}
              activeIndex={this.state.activeDocumentIndex}
              onActiveIndexChange={this.onActiveIndexChange.bind(this)}
            />
          ) : (
            <DocumentsList
              documents={displayedDocs}
              onDocumentPress={openDocumentDetails}
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
  openDocumentDetails: (doc: DecoratedClaims) =>
    dispatch(openDocumentDetails(doc)),
})

export const Documents = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentsContainer)
