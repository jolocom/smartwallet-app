import React from 'react'
import { connect } from 'react-redux'
import { registrationActions } from 'src/actions/'
import { ThunkDispatch } from '../../../store'
import InitActionComponent from '../components/initAction'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

interface State {
  selectedItem: string
}

export class InitActionContainer extends React.Component<Props, State> {
  public state = {
    selectedItem: '',
  }
  private selectOption = (key: string): void => {
    this.setState({ selectedItem: key })
    console.log(key)
  }
  render() {
    const { selectedItem } = this.state
    return (
      <InitActionComponent
        selectedItem={selectedItem}
        selectOption={this.selectOption}
        handleButtonTap={() => this.props.selectInitAction(selectedItem)}
      />
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  selectInitAction: (action: string) =>
    dispatch(registrationActions.selectInitAction(action)),
})

export const InitAction = connect(
  mapStateToProps,
  mapDispatchToProps,
)(InitActionContainer)
