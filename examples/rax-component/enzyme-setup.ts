import * as enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-rax';

// Setup Enzyme
enzyme.configure({ adapter: new Adapter() });
