import styled from 'styled-components';
import FileDropzone from 'emerald-ui/lib/FileDropzone';

export const ProfileDropzoneStyled = styled(FileDropzone)`
  vertical-align: middle;
  width: 100px !important;
  height: 100px !important;
  border: 6px solid #e8e8e8;
  border-radius: 50%;
  cursor: hand;
  i {
    text-align: center;
    color: #e8e8e8;
    font-weight: 800;
    font-size: 4em;
  }
`;
