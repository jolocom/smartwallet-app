export const questionsAddingTerm = [
  {
    type: 'input',
    name: 'term',
    message: "What's the name of the term?",
  },
  {
    type: 'input',
    name: 'ctx',
    message: "What's the term's context?",
  },
  {
    type: 'input',
    name: 'content',
    message: "What's the term's copy?",
  },
]

export const questionUpdateTranslation = [
  {
    type: 'confirm',
    name: 'update',
    message:
      'Seems like a translation for the provided term is already present. Would you like to overwrite it?',
  },
]
