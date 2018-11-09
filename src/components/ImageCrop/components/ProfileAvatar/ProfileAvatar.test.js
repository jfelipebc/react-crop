import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';

import ProfileAvatar from './ProfileAvatar';

describe('ProfileAvatar', () => {
  const onDrop = spy();
  const onChangeImage = spy();
  const makeWrapper = (newProps = {}) => {
    const defaultProps = {
      src: 'test.png',
      alt: 'Test',
      onDrop,
      onChangeImage
    };
    const props = { ...defaultProps, ...newProps };
    const wrapper = mount(<ProfileAvatar {...props} />);
    return { wrapper, props };
  };

  it('render without crashing', () => {
    const { wrapper, props } = makeWrapper();
    expect(wrapper).to.be.present();
    expect(wrapper.props()).to.have.property('src', props.src);
    expect(wrapper.props()).to.have.property('alt', props.alt);
    expect(wrapper.props()).to.have.property(
      'onChangeImage',
      props.onChangeImage
    );
    expect(wrapper.props()).to.have.property('onDrop', props.onDrop);
    expect(wrapper.props()).to.have.property('text', 'Change');
    expect(wrapper.props()).to.have.property('showProfileAvatarButton', false);
  });

  it('should have correctly props in the ProfileAvatarStyled', () => {
    const { wrapper } = makeWrapper();
    const fileDropzone = wrapper.find('FileDropzone');
    expect(fileDropzone.props()).to.have.property('onDrop', onDrop);
  });

  it('should have correctly props in the ProfileImage', () => {
    const { wrapper, props } = makeWrapper();

    expect(wrapper.find('img').props()).to.have.property('src', props.src);
    expect(wrapper.find('img').props()).to.have.property('alt', props.alt);
  });

  it('if showProfileAvatarButton is true, should render ProviderAvatarButton', () => {
    const { wrapper, props } = makeWrapper({ showProfileAvatarButton: true });

    expect(wrapper.find('button').props()).to.have.property(
      'onClick',
      props.onChangeImage
    );

    expect(wrapper.find('button').text()).to.eql('Change');
  });
});
