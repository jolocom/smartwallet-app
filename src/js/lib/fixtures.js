export default {}

export let bankUri = 'http://localhost:8443'

export let contacts = [{
  username: 'haaaaa',
  webId: 'https://haaaaa.webid.jolocom.de/profile/card#me',
  name: 'haaaaa',
  email: 'haaaaa@haaaaa.haaaaa'
},{
  username: 'hbbbbb',
  webId: 'https://hbbbbb.webid.jolocom.de/profile/card#me',
  name: 'hbbbbb',
  email: 'hbbbbb@hbbbbb.hbbbbb'
},{
  username: 'eelcoacl',
  webId: 'https://eelcoacl.webid.jolocom.de/profile/card#me',
  name: 'Eelco ACL',
  email: 'hi@eelcowiersma.nl'
}, {
  username: 'joachim',
  name: 'Joachim Lohkamp',
  email: 'joachim@jolocom.com'
}, {
  username: 'justas',
  name: 'Justas Azna',
  email: 'justas@jolocom.com'
}, {
  username: 'christian',
  name: 'Christian Hildebrand',
  email: 'christian@jolocom.com'
}, {
  username: 'anna',
  name: 'Anna Blume',
  email: 'anna@jolocom.com'
}, {
  username: 'd',
  webId: 'https://d.webid.jolocom.de/profile/card#me',
  name: 'Dean Cooksey',
  email: 'dean.g.cooksey@gmail.com'
}, {
  username: 'acl100',
  webId: 'https://acl100.webid.jolocom.de/profile/card#me',
  name: 'ACL100',
  email: 'test@jolocom.com'
}, {
  username: 'axel',
  webId: 'https://axel.webid.jolocom.de/profile/card#me',
  name: 'Axel',
  email: "axel@whatever.com"
}, {
  username: 'dtest',
  webId: 'https://dtest.webid.jolocom.de/profile/card#me',
  name: 'dtest',
  email: "dtest@whatever.com"
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
