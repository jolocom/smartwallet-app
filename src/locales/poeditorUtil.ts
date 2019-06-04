const en = require('./en').default
const axios = require('axios')

const apiToken = 'bee6fd86ac58e76a27536d875330ce99'
const projectId = 266095

const data: object[] = []
Object.keys(en).map(key => data.push({ term: en[key] }))
axios
  .post(
    'https://api.poeditor.com/v2/terms/add',
    `api_token=${apiToken}&id=${projectId}&data=${JSON.stringify(data)}`,
  )
  .then(res => console.log(res.data))
  .catch(err => console.error(err))
