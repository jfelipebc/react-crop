export const getBlobFromCanvas = canvas => () =>
  new Promise(resolve => canvas.toBlob(resolve));
