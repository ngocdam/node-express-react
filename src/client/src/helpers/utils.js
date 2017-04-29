/*eslint-disable*/

const uuidV4 = require('uuid/v4');

/**
 * Constructor
 */
var Utils = function () { };

Utils.range = (low, hi) => {
  function rangeRec(low, hi, vals) {
    if (low > hi) return vals;
    vals.push(low);
    return rangeRec(low + 1, hi, vals);
  }
  return rangeRec(low, hi, []);
}

/**
* Check if is a not empty object.
* @param {object} obj
* @return {object}
*/
Utils.isNotEmptyObject = function (obj) {
  return (typeof obj === 'object' && obj !== null && obj.constructor !== Array && Object.keys(obj).length > 0);
}

/**
* Check if is a not empty array.
* @param {array} arr
* @return {boolean}
*/
Utils.isNotEmptyArray = function (arr) {
  return (typeof arr !== 'undefined' && arr !== null && arr.constructor === Array && arr.length > 0);
}

/**
* Deep copy an object
* @param {object} obj
* @return {object}
*/
Utils.copy = function (obj) {
  try {
    if (Utils.isNotEmptyObject(obj)) {
      var str = JSON.stringify(obj);
      return JSON.parse(str);
    }
    return obj;
  }
  catch (ex) {
    return Utils.shallowCopy(obj);
  }
}

/**
* Shallow copy an object
* @param {object} obj
* @return {object}
*/
Utils.shallowCopy = function (obj) {
  if (Utils.isNotEmptyObject(obj)) {
    var retObj = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        retObj[key] = obj[key];
      }
    }
    return retObj;
  }
  return obj;
}

/**
* Clean up all properties of an object
* @param {object} object
* @return {object}
*/
Utils.cleanUp = function (object) {
  if (Utils.isNotEmptyObject(object)) {
    for (var el in object) {
      if (typeof (object[el]) === 'object') {
        Utils.cleanUp(object[el]);
      }
      else {
        object[el] = undefined;
        delete object[el];
        Utils.cleanUp(object);
      }
    }
  }
  return object;
}

/**
* Merge properties of objDst to objSrc
* @param {object} objSrc
* @param {object} objDst
* @return {object}
*/
var mergeTwoObjects = function (objSrc, objDst) {
  if (!Utils.isNotEmptyObject(objSrc)) {
    objSrc = {};
  }
  if (!Utils.isNotEmptyObject(objDst)) {
    objDst = {};
  }
  var src = Utils.copy(objSrc);
  var dst = Utils.copy(objDst);
  for (var key in dst) {
    if (dst.hasOwnProperty(key)) {
      src[key] = dst[key];
    }
  }
  return src;
}

/**
* Merge properties of all objects into the first one
* @return {object}
*/
Utils.merge = function () {
  var obj = {};
  var args = arguments;
  if (args.length > 0) {
    for (var i = 0; i < args.length; i++) {
      obj = mergeTwoObjects(obj, args[i]);
    }
  }
  return obj;
}

/**
* Generate random hash
* @return {string}
*/
Utils.guid = function () {
  return uuidV4();
}

/**
* Deep compare two object
* @param {object} obj1
* @param {object} obj2
* @return {boolean}
*/
Utils.compareObjects = function (obj1, obj2) {
  var result = null;
  try {
    var str1 = JSON.stringify(obj1);
    var str2 = JSON.stringify(obj2);
    return (str1 === str2);
  }
  catch (ex) {
    return deepCompare(obj1, obj2);
  }

  // START: http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
  function deepCompare() {
    var i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
      var p;
      // remember that NaN === NaN returns false
      // and isNaN(undefined) returns true
      if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
        return true;
      }
      // Compare primitives and functions.
      // Check if both arguments link to the same object.
      // Especially useful on the step where we compare prototypes
      if (x === y) {
        return true;
      }
      // Works in case when functions are created in constructor.
      // Comparing dates is a common scenario. Another built-ins?
      // We can even handle functions passed across iframes
      if ((typeof x === 'function' && typeof y === 'function') || (x instanceof Date && y instanceof Date) || (x instanceof RegExp && y instanceof RegExp) || (x instanceof String && y instanceof String) || (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
      }
      // At last checking prototypes as good as we can
      if (!(x instanceof Object && y instanceof Object)) {
        return false;
      }
      if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false;
      }
      if (x.constructor !== y.constructor) {
        return false;
      }
      if (x.prototype !== y.prototype) {
        return false;
      }
      // Check for infinitive linking loops
      if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
        return false;
      }
      // Quick checking of one object being a subset of another.
      // todo: cache the structure of arguments[0] for performance
      for (p in y) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false;
        } else if (typeof y[p] !== typeof x[p]) {
          return false;
        }
      }
      for (p in x) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false;
        } else if (typeof y[p] !== typeof x[p]) {
          return false;
        }
        switch (typeof (x[p])) {
          case 'object':
          case 'function':
            leftChain.push(x);
            rightChain.push(y);
            if (!compare2Objects(x[p], y[p])) {
              return false;
            }
            leftChain.pop();
            rightChain.pop();
            break;
          default:
            if (x[p] !== y[p]) {
              return false;
            }
            break;
        }
      }
      return true;
    }
    if (arguments.length < 1) {
      return true; //Die silently? Don't know how to handle such case, please help...
      // throw "Need two or more arguments to compare";
    }
    for (i = 1, l = arguments.length; i < l; i++) {
      leftChain = []; //Todo: this can be cached
      rightChain = [];
      if (!compare2Objects(arguments[0], arguments[i])) {
        return false;
      }
    }
    return true;
  }
  // END: http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
}

Utils.ucfirst = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

Utils.syncLoop = function (iterations, process, exit) {
  var index = 0,
    done = false,
    shouldExit = false;
  var loop = {
    next: function () {
      if (done) {
        if (shouldExit && exit) {
          return exit(); /*Exit if we're done*/
        }
      }
      /*If we're not finished*/
      if (index < iterations) {
        index++; /*Increment our index*/
        process(loop); /*Run our process, pass in the loop*/
        /*Otherwise we're done*/
      } else {
        done = true; /*Make sure we say we're done*/
        if (exit) exit(); /*Call the callback on exit*/
      }
    },
    iteration: function () {
      return index - 1; /*Return the loop number we're on*/
    },
    break: function (end) {
      done = true; /*End the loop*/
      shouldExit = end; /*Passing end as true means we still call the exit callback*/
    }
  };
  loop.next();
  return loop;
}

export default Utils;
