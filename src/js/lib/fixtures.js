export default {}

export let bankUri = 'http://localhost:8443'

export let contacts = [{
  username: 'joachim',
  webId: 'https://joachim.webid.jolocom.de/profile/card#me',
  name: 'Joachim',
  email: 'joachim'
}, {
  username: 'christian',
  webId: 'https://christian.webid.jolocom.de/profile/card#me',
  name: 'Christian',
  email: 'christian@jolocom.com'
}, {
  username: 'anna',
  webId: 'https://anna.webid.jolocom.de/profile/card#me',
  name: 'Anna',
  email: 'anna@jolocom.com'
}, {
  username: 'axel',
  webId: 'https://axel.webid.jolocom.de/profile/card#me',
  name: 'Axel',
  email: 'axel@notsure.??'
}, {
  username: 'dean',
  webId: 'https://dean.webid.jolocom.de/profile/card#me',
  name: 'Dean',
  email: 'dean@notsure.??'
}, {
  username: 'eugeniu',
  webId: 'https://eugeniu.webid.jolocom.de/profile/card#me',
  name: 'Eugeniu',
  email: 'eugeniu@notsure.??'
}, {
  username: 'ericismyname',
  webId: 'https://ericismyname.webid.jolocom.de/profile/card#me',
  name: 'Eric',
  email: 'eric@notsure.??'
}, {
  username: 'markus',
  webId: 'https://markus.webid.jolocom.de/profile/card#me',
  name: 'Markus',
  email: 'markus@notsure.??'
}, {
  username: 'isabel',
  webId: 'https://isabel.webid.jolocom.de/profile/card#me',
  name: 'Isabel',
  email: 'isabel@notsure.??'
}]

export let conversations = [{
  type: 'user',
  username: 'justas',
  items: [{
    author: {
      username: 'justas',
      name: 'Justas Azna'
    },
    content: 'This is completely fucked up!',
    date: new Date()
  }]
}, {
  type: 'user',
  username: 'joachim',
  items: [{
    author: {
      username: 'joachim',
      name: 'Joachim Lohkamp'
    },
    content: 'How are you?',
    date: new Date()
  }]
}]
