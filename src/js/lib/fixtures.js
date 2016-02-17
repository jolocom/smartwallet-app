export default {}

export let bankUri = 'https://localhost:8443'

export let contacts = [{
  username: 'eelco',
  name: 'Eelco Wiersma',
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
