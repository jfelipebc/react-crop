import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

chai.use(chaiEnzyme());
global.expect = expect;

global.window.URL = {
  createObjectURL() {}
};
