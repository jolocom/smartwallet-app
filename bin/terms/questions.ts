export const questionsAddingTerm = [
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
];

export const questionUpdateTranslation = [
  {
    type: 'confirm',
    name: 'update',
    message: 'Seems like translation for provided term is already present. Would you like to overwrite it?'
  }
]