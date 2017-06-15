import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/country'

@connect({
  props: ['verification'],
  actions: [
    'verification/country:setCountryValue',
    'verification/country:cancelCountrySelection',
    'verification/country:chooseCountry'
  ]
})
export default class CountryVerificationScreen extends React.Component {
  static propTypes = {
    setCountryValue: React.PropTypes.func.isRequired,
    chooseCountry: React.PropTypes.func.isRequired,
    cancelCountrySelection: React.PropTypes.func.isRequired,
    verification: React.PropTypes.object.isRequired
  }

  render() {
    const {setCountryValue, chooseCountry, cancelCountrySelection} = this.props
    const {options, value} = this.props.verification.country
    return (<Presentation
      value={value}
      countries={options}
      change={setCountryValue}
      submit={(value) => {
        setCountryValue(value)
        chooseCountry()
      }}
      cancel={cancelCountrySelection} />)
  }
}
