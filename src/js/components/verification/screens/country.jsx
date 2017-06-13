import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/country'

@connect({
  props: ['verification.country'],
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
    children: React.PropTypes.node,
    country: React.PropTypes.object.isRequired
  }

  render() {
    const {setCountryValue, chooseCountry, cancelCountrySelection} = this.props
    const {options, value} = this.props.country
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
