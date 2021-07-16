import minimist from 'minimist';
import inquirer from 'inquirer';

import { Languages, sendPostRequest } from './utils';

var questions = [
  {
    type: 'input',
    name: 'ctx',
    message: "What's a term context?"
  },
  {
    type: 'input',
    name: 'term',
    message: "What's a term label?"
  },
  {
    type: 'input',
    name: 'content',
    message: "What's a term value?"
  }
]

const args = minimist(process.argv.slice(2), {
  string: ["ctx", "term", "content", "lang"],
  boolean: ["help"]
})

let ctx = args.ctx,
    term = args.term,
    content = args.content,
    lang = args.lang || Languages.en

const printHelp = () => {
  console.log("");
  console.log('\x1b[4;95m%s\x1b[0m', 'Script usage:')
  console.log('\x1b[0;95m%s\x1b[0m', 'yarn term:add --ctx=Term --term=testTerm --content=testing --lang=de');
  console.log("");
  console.log("--help          prints help");
  console.log("--ctx           (required) term context, i.e. Walkthrough");  
  console.log("--term          (required) term label");  
  console.log("--content       (required) term value");  
  console.log("--lang          (optional) 'en' | 'de' - term translation language, defaults to 'en'");  
}

const addTerm = async () => {
  const params = {
    data: JSON.stringify([
      {
        term,
        context: ctx,
        comment: `Translations missing`
      }
    ])
  }
  const data = await sendPostRequest('/terms/add', params);
  if(data && data.response.code === "200" && data.result.terms.added === 1) {
    return data;
  } else if(data && data.response.code === "200" && data.result.terms.added === 0) {
    // term already exists
    return data;
  } else {
    throw `Term "${term}" could not added`
  }
}

const addTranslation = async () => {
  if(lang !== Languages) {
    console.log('\x1b[0;93m%s\x1b[0m', `Provided lang argument "${lang}" is not supported.`);
    console.log('\x1b[0;93m%s\x1b[0m', `Falling back to "${Languages.en}".`);
    lang = Languages.en;
  }
  const params = {
    language: lang,
    data: JSON.stringify([
      {
        term,
        context: ctx,
        translation: {
          content
        }
      }
    ])
  }
  const data = await sendPostRequest('/translations/add', params);
  if(data && data.response.code === "200" && data.result.translations.added === 1) {
    return data;
  } else if(data && data.response.code === "200" && data.result.translations.added === 0) {
    // term already exists
    return data;
  } else {
    throw `Translation "${content}" could not added`
  }
}

const main = async () => {
  try {
    await addTerm();
    await addTranslation();
  } catch(err) {
    console.log('\x1b[4;91m%s\x1b[0m', err)
  }
}

if(args.help) {
  printHelp();
  process.exit(0);
}

if(!ctx || !term || !content) {
  console.log('\x1b[4;91m%s\x1b[0m', 'Missing required params')
  printHelp();  
  console.log("");
  console.log('\x1b[4;92m%s\x1b[0m', 'Let\'s fill in missing arguments');
  const updatedQuestions = questions.filter(q => !Boolean(args[q.name]));
  (async() => {
    const answers = await inquirer.prompt(updatedQuestions); 
    ctx = args.ctx || answers.ctx;
    term = args.term || answers.term;
    content = args.content || answers.content;
    await main()
  })();
} else {
  (async () => {
    await main()
  })()
}

