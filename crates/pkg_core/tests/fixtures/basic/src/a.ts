// @ts-expect-error
import { b } from '@/b';

export default function add(a: number, b: number) { return a + b; }

class A { }

console.log(b())


const num1 = 1;

console.log(num1 === 1)
