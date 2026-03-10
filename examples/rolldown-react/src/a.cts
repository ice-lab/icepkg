export interface Person {
  age: number;
  name: string;
}

export const p: Person = { age: 3, name: 'ice' };

const { ...rest } = p;

console.log(rest);
