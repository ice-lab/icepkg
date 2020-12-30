import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import './index.less';

const MyComponent = (props) => {
  return (
    <View className="container">
      <Text>Hello World!</Text>
    </View>
  );
};

export default MyComponent;
