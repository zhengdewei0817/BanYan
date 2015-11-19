if (typeof Object.create != 'function') {
    // Production steps of ECMA-262, Edition 5, 15.2.3.5
    // Reference: http://es5.github.io/#x15.2.3.5
    Object.create = (function () {
        // To save on memory, use a shared constructor
        function Temp() {
        }

        // make a safe reference to Object.prototype.hasOwnProperty
        var hasOwn = Object.prototype.hasOwnProperty;

        return function (O) {
            // 1. If Type(O) is not Object or Null throw a TypeError exception.
            if (typeof O != 'object') {
                throw TypeError('Object prototype may only be an Object or null');
            }

            // 2. Let obj be the result of creating a new object as if by the
            //    expression new Object() where Object is the standard built-in
            //    constructor with that name
            // 3. Set the [[Prototype]] internal property of obj to O.
            Temp.prototype = O;
            var obj = new Temp();
            Temp.prototype = null; // Let's not keep a stray reference to O...

            // 4. If the argument Properties is present and not undefined, add
            //    own properties to obj as if by calling the standard built-in
            //    function Object.defineProperties with arguments obj and
            //    Properties.
            if (arguments.length > 1) {
                // Object.defineProperties does ToObject on its first argument.
                var Properties = Object(arguments[1]);
                for (var prop in Properties) {
                    if (hasOwn.call(Properties, prop)) {
                        obj[prop] = Properties[prop];
                    }
                }
            }

            // 5. Return obj
            return obj;
        };
    })();
}

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fun) {
        var len = this.length;
        var thisp = arguments[1];
        for (var i = 0; i < len; ++i) {
            if (i in this) {
                fun.call(thisp, this[i], i, this);
            }
        }
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (item) {
        var len = this.length;

        for (var i = 0; i < len; ++i) {
            if (this[i] === item) {
                return i;
            }
        }
        return -1;
    };
}

if (typeof Array.prototype.filter !== 'function') {
    Array.prototype.filter = function (fn, context) {
        var arr = [];
        if (typeof fn === 'function') {
            for (var k = 0, length = this.length; k < length; k++) {
                fn.call(context, this[k], k, this) && arr.push(this[k]);
            }
        }
        return arr;
    };
}