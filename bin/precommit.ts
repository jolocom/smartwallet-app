#!/usr/bin/env node

import child_process from 'child_process';

type TMsgs = [string, string];

const promisify = (fn: () => boolean): (...args: TMsgs) => Promise<string> => {
  return (successMsg: TMsgs[0], failureMsg: TMsgs[1]) => new Promise((res, rej) => {
    const result = fn();
    if(result) res(successMsg);
    else rej(failureMsg);
  })
}


const checkStagedGradleProp = promisify(() => {
  // check that changes to android/gradle.properties have not been staged
  const gradlePropertiesDiff = child_process.execSync(
    'git diff --cached --raw ./android/gradle.properties',
  );
  if (gradlePropertiesDiff.toString() != '') {
    return false;
  } 
  return true;
})



const main = async () => {
  try {
    await checkStagedGradleProp('No staged changes to gradle.properties file', 'Staged changes to gradle properties found');
  } catch(e) {
    console.log('\x1b[0;33m%s\x1b[0m', e)
    console.log('\x1b[0;31m%s\x1b[0m', 'Aborting')
    
    // TODO: suggest skipping the file and continue with the rest of script;
    process.exit(1);
  }
}

(async () => main())();
