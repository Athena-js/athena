interface DescriptorType {
  texture?: GPUTextureDescriptor;
  view?: GPUTextureViewDescriptor;
  sampler?: GPUSamplerDescriptor;
}

export class TextureObject {

  protected _descriptor?: DescriptorType;
  protected _texture?: GPUTexture;
  protected _view?: GPUTextureView;
  protected _sampler?: GPUSampler;
  protected _images: ImageBitmap[] = [];

  protected _loaded = false;

  static cachedTextures = new Map<TextureObject, boolean>();

  constructor(descriptor?: DescriptorType) {
    this._descriptor = descriptor;
    TextureObject.cachedTextures.set(this, true);
  }

  // update descriptor but not create texture immediately
  updateDescriptor(desc: DescriptorType) {
    this.destroy();
    
    if (!this._descriptor) {
      this._descriptor = desc;
    } else {
      desc.texture &&
        (this._descriptor.texture = Object.assign(this._descriptor.texture ?? {}, desc.texture));
      desc.view &&
        (this._descriptor.view = Object.assign(this._descriptor.view ?? {}, desc.view));
      desc.sampler &&
        (this._descriptor.sampler = Object.assign(this._descriptor.sampler ?? {}, desc.sampler));
    }

    return this;
  }

  async setImageAsync(image: ImageBitmapSource | ImageBitmapSource[], options?: ImageBitmapOptions) {
    const images = Array.isArray(image) ? image : [image];
    this._images = await Promise.all(images.map(img => createImageBitmap(img, options)));
    this._loaded = false;
    return this;
  }

  updateBuffer(device: GPUDevice) {
    if (!this._loaded && this._images) {
      const texture = this.getTexture(device);
      device.queue.copyExternalImageToTexture(
        { source: this._images[0] },
        { texture },
        [ this._images[0].width, this._images[0].height ]
      );
      this._loaded = true;
    }
  }

  getTexture(
    device: GPUDevice,
    forceUpdate = false,
    desc?: GPUTextureDescriptor
  ) {
    if (!this._texture || forceUpdate) {
      this.updateDescriptor({ texture: desc });
      this._texture?.destroy();
      this._texture = device.createTexture(this._descriptor!.texture!);
      this._view = undefined;
      this.updateBuffer(device);
    }
    return this._texture!;
  }

  getView(
    device: GPUDevice,
    forceUpdate = false,
    desc?: GPUTextureViewDescriptor
  ) {
    if (!this._view || forceUpdate) {
      this.updateDescriptor({ view: desc });
      console.log(this._descriptor?.view);
      this._view = this.getTexture(device).createView(this._descriptor?.view);
    }
    return this._view;
  }

  getSampler(
    device: GPUDevice,
    forceUpdate = false,
    desc?: GPUSamplerDescriptor
  ) {
    if (!this._sampler || forceUpdate) {
      desc && this.updateDescriptor({ sampler: desc });
      this._sampler = device.createSampler(this._descriptor?.sampler);
    }
    return this._sampler;
  }

  destroy() {
    if (this._texture) {
      this._texture.destroy();
      this._texture = undefined;
      this._view = undefined;
    }
  }

}