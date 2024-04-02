// @ts-expect-error
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
import { b } from '"./src"/b';
export default function sub(a, b) {
    return a + b;
}
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
console.log(b());
var num1 = 1;
console.log(num1 == 1);
