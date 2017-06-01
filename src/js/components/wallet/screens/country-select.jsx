import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/country-select'

@connect({
  props: ['wallet.country'],
  actions: [
    'wallet/passport:changePassportField',
    'wallet/passport:changePhysicalAddressField',
    'wallet/country-select:setValue',
    'wallet/country-select:cancel',
    'wallet/country-select:submit'
  ]
})
export default class CountrySelectScreen extends React.Component {
  static propTypes = {
    setValue: React.PropTypes.func.isRequired,
    submit: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired,
    children: React.PropTypes.node,
    country: React.PropTypes.object.isRequired
  }

  render() {
    const {setValue, submit, cancel} = this.props
    const {options, value, showErrors} = this.props.country
    return (<Presentation
      value={value}
      showErrors={showErrors}
      countries={options}
      change={setValue}
      submit={(value) => {
        setValue(value)
        submit()
      }}
      cancel={() => {
        cancel()
      }} />)
  }
}
