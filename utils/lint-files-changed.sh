#!/bin/sh

CHANGED_FILES=$(git diff develop --name-only --diff-filter=ACM | grep ".jsx\{0,1\}$")
ESLINT="$(git rev-parse --show-toplevel)/node_modules/.bin/eslint"
if [[ "$CHANGED_FILES" = "" ]]; then
  exit 0
fi

PASS=true

printf "\nValidating Javascript:\n"

if [[ ! -x "$ESLINT" ]]; then
  printf "\t\033[41mPlease install ESlint\033[0m (npm i --save --save-exact --dev eslint)"
  exit 1
fi


for FILE in $CHANGED_FILES
do
  "$ESLINT" "$FILE"

  if [[ "$?" == 0 ]]; then
    printf "\t\033[32mESLint Passed: $FILE\033[0m"
  else
    printf "\t\033[41mESLint Failed: $FILE\033[0m"
    PASS=false
  fi
done

printf "\nJavascript validation completed!\n"

if ! $PASS; then
  printf "\033[41mLINTING FAILED:\033[0m Your PR contains files that should pass ESLint but do not. Please fix the ESLint errors and try again.\n"
  exit 1
else
  printf "\033[42mLINTING SUCCEEDED\033[0m\n"
fi

exit $?