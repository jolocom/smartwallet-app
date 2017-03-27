export const passwordsMatchErrorMessage = (password, repeatedPassword) => {
  if (!isPasswordValid(password, repeatedPassword) && repeatedPassword) {
    return 'Invalid password, The two passwords differs \nPlease try again'
  }
  return ''
}
export const passwordStrengthErrorMessage = (password) => {
  if (isPasswordStrongEnough(password.value) || !password.value) {
    return ''
  }
  const number = password.value.length > 7 ? '' : '8 characters '
  const digit = password.hasDigit ? '' : 'one digit '
  const lowerCase = password.hasLowerCase ? '' : 'one lower case character'
  const upperCase = password.hasUpperCase ? '' : 'one upper case character'

  return 'Invalid Password, Please use ' + number +
    digit + lowerCase + upperCase + ' !'
}
export const checkPassStrength = (pass) => {
  let score = scorePassword(pass)
  if (pass.length > 7) {
    if (score > 70) {
      return 'strong'
    }
    if (score > 40) {
      return 'good'
    }
  }
  return 'weak'
}

export const scorePassword = (pass) => {
  if (isPasswordStrongEnough(pass)) {
    var score = 0
    if (!pass) {
      return score
    }
    // award every unique letter until 5 repetitions
    let letters = {}
    for (let i = 0; i < pass.length; i++) {
      letters[pass[i]] = (letters[pass[i]] || 0) + 1
      score += 5.0 / letters[pass[i]]
    }

    // bonus points for mixing it up
    let variations = {
      digits: /\d/.test(pass),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      nonWords: /\W/.test(pass)
    }

    let variationCount = 0
    for (let check in variations) {
      variationCount += (variations[check] === true) ? 1 : 0
    }
    score += (variationCount - 1) * 10

    return parseInt(score)
  }
  return 0
}

export const passwordCharacters = (password) => {
  let lowerCaseExist = false
  let upperCaseExist = false
  let digitExist = false
  if (/[a-z]/.test(password)) {
    lowerCaseExist = true
  }
  if (/[A-Z]/.test(password)) {
    upperCaseExist = true
  }
  if (/[0-9]/.test(password)) {
    digitExist = true
  }
  const checkResult = {
    lowerCase: lowerCaseExist,
    upperCase: upperCaseExist,
    digit: digitExist
  }
  return checkResult
}

export const isPasswordValid = (passwordValue, repeatedValue) => {
  return repeatedValue === passwordValue &&
    isPasswordStrongEnough(passwordValue)
}

export const isPasswordStrongEnough = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\S\s]{8,}$/.test(password)
}
