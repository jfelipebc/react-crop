import React from 'react';
import { shallow } from 'enzyme';
import { assert, spy, stub } from 'sinon';

import ImageCrop from './ImageCrop';

const DEFAULT_REACT_CROP = {
  src: '',
  pixelCrop: {},
  crop: {
    aspect: 1,
    x: 10,
    y: 10,
    width: 10,
    height: 10
  }
};

describe('ImageCrop component', () => {
  const createObjectURLStub = stub(window.URL, 'createObjectURL');
  const onImageCropCompleteSpy = spy();
  const getContextStub = stub(window.HTMLCanvasElement.prototype, 'getContext');

  const makeWrapper = (newProps = {}) => {
    const defaultProps = {
      onImageCropComplete: onImageCropCompleteSpy
    };
    const props = { ...defaultProps, ...newProps };
    const wrapper = shallow(<ImageCrop {...props} />);
    return { wrapper, props };
  };

  it('render without crashing', () => {
    const { wrapper, props } = makeWrapper({
      imageUrl: 'test.png',
      modalTitle: 'Test zone'
    });

    expect(wrapper).to.be.present();
    expect(wrapper.instance().props).to.have.property(
      'onImageCropComplete',
      props.onImageCropComplete
    );
    expect(wrapper.instance().props).to.have.property(
      'imageUrl',
      props.imageUrl
    );
    expect(wrapper.instance().props).to.have.property(
      'modalTitle',
      props.modalTitle
    );
  });

  it('the ImageCrop component should be have a Modal component', () => {
    const { wrapper } = makeWrapper();
    const modal = wrapper.find('Modal');
    expect(modal).to.be.present();
  });

  it('if the imageUrl is empty, should be render a ProfileDropzone component', () => {
    const { wrapper } = makeWrapper();
    const profileDropzone = wrapper.find('ProfileDropzone');
    expect(profileDropzone).to.be.present();
  });

  it('if the imageUrl is fill, should be render a ProfileAvatar component', () => {
    const { wrapper } = makeWrapper({ imageUrl: 'test.png' });
    const profileAvatar = wrapper.find('ProfileAvatar');
    expect(profileAvatar).to.be.present();
  });

  it('When call the onClose event, (src, isShowModal) should be set ("", false) respectively', () => {
    const { wrapper } = makeWrapper();
    wrapper.instance().onClose();

    expect(wrapper.state().src).to.be.eql('');
    expect(wrapper.state().isShowModal).to.be.eql(false);
  });

  it('When call the onImageLoaded, the ImageCrop should have a imageRef property', () => {
    const { wrapper } = makeWrapper();
    const image = React.createRef();
    wrapper.instance().onImageLoaded(image);

    expect(wrapper.instance().imageRef).to.be.eql(image);
  });

  it('When call the onCropComplete event, the pixelCorp should be set values', () => {
    const { wrapper } = makeWrapper();
    const pixelCrop = { crop: { x: 20, y: 20 } };
    wrapper.instance().onCropComplete({}, pixelCrop);
    expect(wrapper.state().pixelCrop).to.be.equal(pixelCrop);
  });

  it('When call the onChange event, the corp should be set values', () => {
    const { wrapper } = makeWrapper();
    const crop = { crop: { x: 20, y: 20 } };
    wrapper.instance().onChange(crop);
    expect(wrapper.state().crop).to.be.equal(crop);
  });

  it('When call the onRequestChangeImage event, the state related with crop should be set to default values', () => {
    const { wrapper } = makeWrapper();
    wrapper.instance().onRequestChangeImage();
    const currentState = wrapper.state();
    const defaultState = { ...currentState, ...DEFAULT_REACT_CROP };
    expect(wrapper.state()).to.be.eql({ ...defaultState });
  });

  it('When call the onDrop event, the src, fileName and isShowModal should be set with ("file://test.pdf", "test.pdf", true)', () => {
    const urlReturned = 'file://test.pdf';
    const files = [{ name: 'test.pdf' }];
    const file = files[0];
    createObjectURLStub.returns(urlReturned);

    const { wrapper } = makeWrapper();
    wrapper.instance().onDrop(files);
    expect(wrapper.state().isShowModal).to.be.eql(true);
    expect(wrapper.state().src).to.be.eql(urlReturned);
    expect(wrapper.state().fileName).to.be.eql(file.name);
  });

  // fit('the getCroppedImg should be return a promise', () => {
  //   const file = { name: 'test.pdf', size: 12, type: 'application/png' };
  //   const toBlobStub = stub(window.HTMLCanvasElement.prototype, 'toBlob');

  //   const toBlobPromise = promise => toBlobStub.callsFake(() => promise);
  //   toBlobPromise(Promise.resolve(file));
  //   getContextStub.returns({ drawImage: jest.fn() });

  //   const { wrapper } = makeWrapper();
  //   const resultFile = wrapper
  //     .instance()
  //     .getCroppedImg(React.createRef(), {}, 'test.pdf');

  //   console.log(resultFile);
  //   expect(resultFile).to.eql(file);
  // });

  it('When call onSaveImageCrop event, should be call onImageCropComplete', async () => {
    const urlReturned = 'file://test.pdf';
    const file = { name: 'test.pdf', size: 12, type: 'application/png' };
    // const getCroppedImgStub = stub(ImageCrop.prototype, 'getCroppedImg');
    // const getCroppedImgPromise = promise =>
    //   getCroppedImgStub.callsFake(() => promise);
    // createObjectURLStub.returns(urlReturned);

    const toBlobStub = stub(window.HTMLCanvasElement.prototype, 'toBlob');

    const toBlobPromise = promise => toBlobStub.callsFake(() => promise);
    toBlobPromise(Promise.resolve(file));

    getContextStub.returns({ drawImage: jest.fn() });
    //getCroppedImgPromise(Promise.resolve(file));

    const image = React.createRef();
    const pixelCrop = { x: 40, y: 40, width: 300, height: 300 };
    const { wrapper } = makeWrapper();

    wrapper.setState({ pixelCrop, fileName: file.name });
    wrapper.instance().onImageLoaded(image);

    await wrapper.instance().onSaveImageCrop();

    assert.calledWithExactly(
      onImageCropCompleteSpy,
      file.name,
      urlReturned,
      file
    );

    expect(wrapper.state().isShowModal).to.be.eql(false);
    expect(wrapper.state().src).to.be.eql('');
    expect(wrapper.state().fileName).to.be.eql(file.name);
    expect(wrapper.state().imageUrl).to.be.eql(urlReturned);
  });

  describe('ProfileDropzone component', () => {
    it('the ProfileDropzone should be have correctly props.', () => {
      const { wrapper, props } = makeWrapper({
        acceptFiles: '.png'
      });
      const profileDropzone = wrapper.find('ProfileDropzone');
      expect(profileDropzone.props()).to.have.property(
        'onDrop',
        wrapper.instance().onDrop
      );
      expect(profileDropzone.props()).to.have.property(
        'accept',
        props.acceptFiles
      );
    });
  });

  describe('ProfileAvatar component', () => {
    it('the ProfileAvatar should be have correctly props.', () => {
      const { wrapper, props } = makeWrapper({
        acceptFiles: '.png',
        imageUrl: 'test.pdf'
      });

      wrapper.setState({ fileName: 'test.pdf' });
      const profileAvatar = wrapper.find('ProfileAvatar');
      console.log(profileAvatar.debug());
      expect(profileAvatar.props()).to.have.property('src', props.imageUrl);
      expect(profileAvatar.props()).to.have.property('alt', 'test.pdf');
      expect(profileAvatar.props()).to.have.property(
        'onDrop',
        wrapper.instance().onDrop
      );
      expect(profileAvatar.props()).to.have.property(
        'accept',
        props.acceptFiles
      );
      expect(profileAvatar.props()).to.have.property(
        'onChangeImage',
        wrapper.instance().onRequestChangeImage
      );
      expect(profileAvatar.props()).to.have.property(
        'showProfileAvatarButton',
        true
      );
    });
  });
  describe('Modal component', () => {
    it('The Modal component should be have correctly props', () => {
      const { wrapper } = makeWrapper();
      const modal = wrapper.find('Modal');

      expect(modal.props()).to.have.property('show', false);
      expect(modal.props()).to.have.property(
        'onClose',
        wrapper.instance().onClose
      );
    });

    it('should be have title in the Modal header', () => {
      const { wrapper } = makeWrapper();
      const modalHeader = wrapper.find('ModalHeader');

      expect(modalHeader.props()).to.have.property('closeButton', true);
      expect(
        modalHeader
          .find('ModalTitle')
          .children()
          .text()
      ).to.be.eql('Select zone');
    });

    it('should be have ReactCrop component in the Modal body', () => {
      const { wrapper } = makeWrapper();
      const modalBody = wrapper.find('ModalBody');
      const reactCrop = modalBody.find('ReactCrop');

      expect(reactCrop).to.be.present();
      expect(reactCrop.props()).to.have.property(
        'src',
        wrapper.instance().state.src
      );
      expect(reactCrop.props()).to.have.property(
        'crop',
        wrapper.instance().state.crop
      );
      expect(reactCrop.props()).to.have.property('maxWidth', 50);
      expect(reactCrop.props()).to.have.property('maxHeight', 50);
      expect(reactCrop.props()).to.have.property('keepSelection', true);

      expect(reactCrop.props()).to.have.property(
        'onChange',
        wrapper.instance().onChange
      );
      expect(reactCrop.props()).to.have.property(
        'onImageLoaded',
        wrapper.instance().onImageLoaded
      );
      expect(reactCrop.props()).to.have.property(
        'onComplete',
        wrapper.instance().onCropComplete
      );
    });

    it('the Modal Footer should be have 2 elements', () => {
      const { wrapper } = makeWrapper();
      const modalFooter = wrapper.find('ModalFooter');
      expect(modalFooter.children().length).to.be.eql(2);
    });

    it('Verify the text and props of the Cancel Button', () => {
      const { wrapper } = makeWrapper();
      const cancelButton = wrapper.find("Button[children='Cancel']");
      expect(cancelButton).to.be.present();
      expect(cancelButton.children().text()).to.eql('Cancel');
      expect(cancelButton.props()).to.have.property(
        'onClick',
        wrapper.instance().onClose
      );
    });

    it('Verify the text and props of the Crop Button', () => {
      const { wrapper } = makeWrapper();
      const cropButton = wrapper.find("Button[children='Crop image']");
      expect(cropButton).to.be.present();
      expect(cropButton.children().text()).to.eql('Crop image');
      expect(cropButton.props()).to.have.property('color', 'primary');
      expect(cropButton.props()).to.have.property(
        'onClick',
        wrapper.instance().onSaveImageCrop
      );
    });
  });
});
