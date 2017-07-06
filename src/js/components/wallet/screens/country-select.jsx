import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/country-select'

@connect({
  props: ['wallet.country'],
  actions: [
    'wallet/country-select:setCountryValue',
    'wallet/country-select:cancel',
    'wallet/country-select:submit'
  ]
})
export default class CountrySelectScreen extends React.Component {
  static propTypes = {
    setCountryValue: React.PropTypes.func.isRequired,
    submit: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func.isRequired,
    country: React.PropTypes.object.isRequired
  }

  render() {
    const {setCountryValue, submit, cancel} = this.props
    const {options, value} = this.props.country
    return (<Presentation
      value={value}
      countries={options}
      change={setCountryValue}
      submit={(value) => {
        setCountryValue(value)
        submit()
      }}
      cancel={cancel} />)
  }
}
