// import { TextureObject } from "./TextureObject";

// export class CubeTexture extends TextureObject {

//   constructor() {
//     super({
//       texture: {
//         size: [2048, 2048, 6],
//         format: 'rgba8unorm',
//         usage:
//           GPUTextureUsage.TEXTURE_BINDING |
//           GPUTextureUsage.COPY_DST |
//           GPUTextureUsage.RENDER_ATTACHMENT
//       },
//       view: {
//         dimension: 'cube'
//       }
//     })
//   }

//   updateBuffer(device: GPUDevice, images: ) {
//     if (!this._loaded && this._images) {
//       const texture = this.getTexture(device);
//       if ((this._descriptor?.texture?.size as any)[2] === 6) {
//         device.queue.copyExternalImageToTexture(
//           { source: this._image },
//           { texture, origin: [0, 0, 0] },
//           [ this._image.width, this._image.height]
//         );
//         device.queue.copyExternalImageToTexture(
//           { source: this._image },
//           { texture, origin: [0, 0, 1] },
//           [ this._image.width, this._image.height]
//         );
//         device.queue.copyExternalImageToTexture(
//           { source: this._image },
//           { texture, origin: [0, 0, 2] },
//           [ this._image.width, this._image.height]
//         );
//         device.queue.copyExternalImageToTexture(
//           { source: this._image },
//           { texture, origin: [0, 0, 3] },
//           [ this._image.width, this._image.height]
//         );
//         device.queue.copyExternalImageToTexture(
//           { source: this._image },
//           { texture, origin: [0, 0, 4] },
//           [ this._image.width, this._image.height]
//         );
//         device.queue.copyExternalImageToTexture(
//           { source: this._image },
//           { texture, origin: [0, 0, 5] },
//           [ this._image.width, this._image.height]
//         );
//       } else {
//         device.queue.copyExternalImageToTexture(
//           { source: this._image },
//           { texture },
//           [ this._image.width, this._image.height ]
//         );
//       }
//       this._loaded = true;
//     }
//   }

// }