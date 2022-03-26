import { TextureObject } from "@/buffer/TextureObject";
import { BaseLoader } from "./BaseLoader";

const GPUTextureUsage = window.GPUTextureUsage ?? {};

export class TextureLoader extends BaseLoader {

  async loadAsync(url: string) {
    const img = await this.getImage(url);
    const texture = new TextureObject({
      texture: {
        size: [img.width, img.height, 1],
        format: 'rgba8unorm',
        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.RENDER_ATTACHMENT
      }
    });
    await texture.setImageAsync(img);
    return texture;
  }

  async loadCubemapAsync(urls: string[]) {
    const imgs = await Promise.all(urls.map(this.getImage));
    const texture = new TextureObject({
      texture: {
        size: [imgs[0].width, imgs[0].height, 6],
        format: 'rgba8unorm',
        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.RENDER_ATTACHMENT
      },
      view: {
        dimension: 'cube'
      }
    });
    await texture.setImagesAsync(imgs);
    return texture;
  }


  protected getImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve(img);
      };
    })
  }

}