import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';

import ProfileDropzone from './ProfileDropzone';

describe('ProfileDropzone', () => {
  const onDrop = spy();

  const makeWrapper = (newProps = {}) => {
    const defaultProps = {
      onDrop
    };
    const props = { ...defaultProps, ...newProps };
    const wrapper = mount(<ProfileDropzone {...props} />);
    return { wrapper, props };
  };

  it('render without crashing', () => {
    const { wrapper } = makeWrapper();
    expect(wrapper).to.be.present();
    expect(wrapper.props()).to.have.property('onDrop', onDrop);
    expect(wrapper.props()).to.have.property('multiple', false);
    expect(wrapper.props()).to.have.property(
      'acceptFiles',
      '.jpg, .jpeg, .png'
    );
  });

  it('The icon should have the "add" text', () => {
    const { wrapper } = makeWrapper();
    expect(wrapper.find("i[children='add']").text()).to.eql('add');
  });
});
