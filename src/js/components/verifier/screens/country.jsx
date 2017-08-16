import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/country'

@connect({
  props: ['verifier'],
  actions: [
    'verifier/country:setCountryValue',
    'verifier/country:cancelCountrySelection',
    'verifier/country:chooseCountry'
  ]
})
export default class CountryVerificationScreen extends React.Component {
  static propTypes = {
    setCountryValue: React.PropTypes.func.isRequired,
    chooseCountry: React.PropTypes.func.isRequired,
    cancelCountrySelection: React.PropTypes.func.isRequired,
    verifier: React.PropTypes.object.isRequired
  }

  render() {
    const {setCountryValue, chooseCountry, cancelCountrySelection} = this.props
    const {options, value} = this.props.verifier.country
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
