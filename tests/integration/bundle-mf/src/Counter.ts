export default function Counter() {
  let count = 0;

  const increment = () => {
    count++;
    return count;
  };

  return {
    getCount: () => count,
    increment,
  };
}
