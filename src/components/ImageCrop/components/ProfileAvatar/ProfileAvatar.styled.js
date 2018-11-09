import styled from 'styled-components';
import FileDropzone from 'emerald-ui/lib/FileDropzone';

export const ProfileAvatarStyled = styled(FileDropzone)`
  position: relative;
  width: 100px;
  height: 100px;
  border: none;
  border-radius: 50%;
  overflow: hidden;
  background: lightblue;
`;

export const ProfileImage = styled.img`
  border: none;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-position: center;
  background-size: 100% auto;
  background-repeat: no-repeat;
  position: absolute;
  z-index: 0;
`;

export const ProviderAvatarButton = styled.button`
  background: rgba(0, 0, 0, 0.15);
  height: 30px;
  width: 100px;
  border: none;
  bottom: 0;
  cursor: pointer;
  position: absolute;
  padding: 8px;
  transition: background-color 300ms linear;
  > span {
    vertical-align: top;
    text-align: center;
    color: white;
    font-size: 0.6em;
    font-weight: 600;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.6);
    transition: background-color 300ms linear;
  }

  &:active {
    border: none;
    outline: none;
  }

  &:focus {
    outline: 0;
  }
`;
