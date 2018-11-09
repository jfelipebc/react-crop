import React from 'react';
import PropTypes from 'prop-types';
import { ProfileDropzoneStyled } from './ProfileDropzone.styled';

const ProfileDropzone = ({ onDrop, multiple, acceptFiles }) => (
  <ProfileDropzoneStyled
    onDrop={onDrop}
    multiple={multiple}
    accept={acceptFiles}
  >
    <a>
      <i className="material-icons">add</i>
    </a>
  </ProfileDropzoneStyled>
);

ProfileDropzone.defaultProps = {
  multiple: false,
  acceptFiles: '.jpg, .jpeg, .png'
};

ProfileDropzone.propTypes = {
  onDrop: PropTypes.func.isRequired,
  acceptFiles: PropTypes.string,
  multiple: PropTypes.bool
};

export default ProfileDropzone;
