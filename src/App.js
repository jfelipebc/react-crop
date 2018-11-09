import React, { Component } from 'react';
import 'emerald-ui/lib/styles.css';
import 'react-image-crop/dist/ReactCrop.css';
import './App.css';

import ImageCrop from './components/ImageCrop';

class App extends Component {
  handleImageCropComplete = (name, imageUrl, imageFile) => {
    console.log({ name, imageFile, imageUrl });
  };
  render() {
    return (
      <div>
        <ImageCrop onImageCropComplete={this.handleImageCropComplete} />
      </div>
    );
  }
}

export default App;
