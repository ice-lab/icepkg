// ES2015: class, arrow function
// ES2017: async/await
// ES2022: class private fields, static class blocks
export class Counter {
  #count = 0;

  static #defaultStep = 1;

  static {
    Counter.#defaultStep = 2;
  }

  increment(): number {
    this.#count += Counter.#defaultStep;
    return this.#count;
  }

  async fetchValue(): Promise<number> {
    return this.#count;
  }
}

export const double = (n: number) => n * 2;

export async function fetchDouble(n: number): Promise<number> {
  const result = await Promise.resolve(n);
  return double(result);
}
