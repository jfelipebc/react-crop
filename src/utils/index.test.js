import * as utils from './index';
import { stub } from 'sinon';

describe('getBlobFromCanvas', () => {
  it('should return a blob', () => {
    const canvas = document.createElement('canvas');
    const toBlobStub = stub(window.HTMLCanvasElement.prototype, 'toBlob');
    utils.getBlobFromCanvas(canvas)();
    expect(toBlobStub.called).to.be.eql(true);
  });
});
