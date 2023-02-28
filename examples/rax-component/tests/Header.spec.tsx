import { createElement } from 'rax';
import renderer from 'rax-test-renderer';
import Header from '../src/components/Header';

test('test <Button /> component', () => {
  const tree = renderer.create(<Header />);
  expect(tree.toJSON().children[0]).toBe('Header')
});
