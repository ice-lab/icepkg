// @ts-expect-error
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return sub;
    }
});
var _b = require('"./src"/b');
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function sub(a, b) {
    return a + b;
}
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
console.log((0, _b.b)());
var num1 = 1;
console.log(num1 == 1);
