import * as yup from 'yup';

(function extend() {
  yup.addMethod(yup.string, 'atLeastOne', function (list: string[], message) {
    return this.test({
      message,
      test: function (value) {
        const atLeastOneIsPopulated = list.reduce((acc, f) => {
          if (acc === true) {
            acc = !!this.parent[f];
          }
          return acc;
        }, true);
        console.log();
        if (value || (!value && atLeastOneIsPopulated)) return true;
        else if (!value && !atLeastOneIsPopulated) return false
        else return true;
      }
    })
  })
})()
