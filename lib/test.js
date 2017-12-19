const transformObject = obj => {
  return Object.keys(obj).reduce((prev, next) => {
    if (typeof obj[next] === 'function') {
      prev[next] = function(client) {
        obj[next].call(obj, client);
      };
    } else {
      prev[next] = obj[next];
    }
    return prev;
  });
};

const transformClass = Fn => {
  return Object.getOwnPropertyNames(Fn.prototype)
   .filter(method => method !== 'constructor')
   .reduce((N, method) => {
     switch (Fn.prototype[method].length) {
       case 1:
         N[method] = function(one) {
           Fn.prototype[method].apply(N, arguments);
        };
        break;
       case 2:
         N[method] = function(one, two) {
           Fn.prototype[method].apply(N, arguments);
         };
         break;
       case 3:
         N[method] = function(one, two, three) {
           Fn.prototype[method].apply(N, arguments);
         };
         break;
       default:
         N[method] = function() {
           Fn.prototype[method].apply(N, arguments);
         };
         break;
     }
     return N;
   }, {})
  ;
};

/**
 * Transform testcase object|function to ES5 styled one
 *
 * @param {Funtion|Object} testcases - nightwatch testcases
 * @return {Object} inline functions
 */
module.exports = testcases => {
  switch (typeof testcases) {
    case 'function':
      return transformClass(testcases);
    case 'object':
      return transformObject(testcases);
    default:
      throw new Error('[nightwatchify] testcase must be an Object or Class');
  }
};
