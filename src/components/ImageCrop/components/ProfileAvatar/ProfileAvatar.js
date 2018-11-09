import React from 'react';
import PropTypes from 'prop-types';
import {
  ProfileAvatarStyled,
  ProfileImage,
  ProviderAvatarButton
} from './ProfileAvatar.styled';

const ProfileAvatar = ({
  src,
  alt,
  text,
  showProfileAvatarButton,
  onChangeImage,
  onDrop
}) => (
  <ProfileAvatarStyled onDrop={onDrop}>
    <ProfileImage src={src} alt={alt} />
    {showProfileAvatarButton && (
      <ProviderAvatarButton onClick={onChangeImage}>
        <span>{text}</span>
      </ProviderAvatarButton>
    )}
  </ProfileAvatarStyled>
);

ProfileAvatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onChangeImage: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  showProfileAvatarButton: PropTypes.bool,
  text: PropTypes.string
};

ProfileAvatar.defaultProps = {
  text: 'Change',
  showProfileAvatarButton: false
};

export default ProfileAvatar;
