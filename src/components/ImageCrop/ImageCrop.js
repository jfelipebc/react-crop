import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';

import Modal from 'emerald-ui/lib/Modal';
import Button from 'emerald-ui/lib/Button';

import { getBlobFromCanvas } from '../../utils';

import ProfileAvatar from './components/ProfileAvatar';
import ProfileDropzone from './components/ProfileDropzone';

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

class ImageCrop extends PureComponent {
  state = {
    fileName: '',
    isShowModal: false,
    imageUrl: '',
    ...DEFAULT_REACT_CROP
  };

  constructor(props) {
    super(props);

    this.getCroppedImg = this.getCroppedImg.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onRequestChangeImage = this.onRequestChangeImage.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onSaveImageCrop = this.onSaveImageCrop.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { imageUrl } = props;
    if (imageUrl !== '' && state.imageUrl === '') {
      return {
        ...state,
        imageUrl
      };
    }
    return state;
  }

  async getCroppedImg(image, pixelCrop, fileName) {
    const canvas = global.document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    const file = await getBlobFromCanvas(canvas)();
    file.name = fileName;
    return file;
  }

  onClose() {
    this.setState({ src: '', isShowModal: false });
  }

  onImageLoaded(image) {
    this.imageRef = image;
  }

  onCropComplete(crop, pixelCrop) {
    this.setState({ pixelCrop });
  }

  onChange(crop) {
    this.setState({ crop });
  }

  onRequestChangeImage() {
    this.setState({ ...DEFAULT_REACT_CROP });
  }

  onDrop(files) {
    const file = files[0];
    const src = window.URL.createObjectURL(file);
    const isShowModal = src !== '';
    this.setState({ src, fileName: file.name, isShowModal });
  }

  async onSaveImageCrop() {
    const { fileName, pixelCrop } = this.state;
    const { onImageCropComplete } = this.props;
    const imageFile = await this.getCroppedImg(
      this.imageRef,
      pixelCrop,
      fileName
    );
    imageFile.name = fileName;
    const imageUrl = window.URL.createObjectURL(imageFile);

    onImageCropComplete(fileName, imageUrl, imageFile);
    this.setState({ imageUrl, fileName, src: '', isShowModal: false });
  }

  render() {
    const { src, crop, isShowModal, imageUrl, fileName } = this.state;
    const { modalTitle, acceptFiles } = this.props;
    return (
      <Fragment>
        {imageUrl !== '' ? (
          <ProfileAvatar
            src={imageUrl}
            alt={fileName}
            onDrop={this.onDrop}
            accept={acceptFiles}
            onChangeImage={this.onRequestChangeImage}
            showProfileAvatarButton={imageUrl !== ''}
          />
        ) : (
          <ProfileDropzone onDrop={this.onDrop} accept={acceptFiles} />
        )}

        <Modal show={isShowModal} onClose={this.onClose}>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: 'center' }}>
            <ReactCrop
              src={src}
              crop={crop}
              maxWidth={50}
              maxHeight={50}
              onChange={this.onChange}
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              keepSelection={true}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onClose}>Cancel</Button>
            <Button color="primary" onClick={this.onSaveImageCrop}>
              Crop image
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}

ImageCrop.defaultProps = {
  imageUrl: '',
  modalTitle: 'Select zone',
  acceptFiles: '.jpg, .jpeg, .png'
};

ImageCrop.propTypes = {
  onImageCropComplete: PropTypes.func.isRequired,
  imageUrl: PropTypes.string,
  modalTitle: PropTypes.string
};

export default ImageCrop;
