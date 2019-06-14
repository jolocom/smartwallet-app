import React from 'react'
import { ExpiredDocumentsDetailsComponent } from 'src/ui/documents/components/expiredDocumentDetails'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { NavigationScreenProps } from 'react-navigation'

interface Props extends ReturnType<typeof mapStateToProps> {}

interface State {}

export class ExpiredDocumentsDetailsContainer extends React.Component<
  Props,
  State
> {
  public static navigationOptions = ({
    navigation,
    navigationOptions,
  }: NavigationScreenProps) => ({
    ...navigationOptions,
    headerTitle: navigation.getParam('headerTitle', 'DEFAULT'),
  })

  public render(): JSX.Element {
    const { selectedExpiredDocument } = this.props
    return (
      <ExpiredDocumentsDetailsComponent document={selectedExpiredDocument} />
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  selectedExpiredDocument: state.documents.selectedExpiredDocument,
})

export const ExpiredDocumentsDetails = connect(
  mapStateToProps,
)(ExpiredDocumentsDetailsContainer)
