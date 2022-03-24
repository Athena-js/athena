import { TextureObject } from "@/buffer/TextureObject";
import { BaseLoader } from "./BaseLoader";

export class TextureLoader extends BaseLoader {

  async loadAsync(url: string): Promise<TextureObject> {
    const img = await this.getImage(url);
    const texture = new TextureObject({
      texture: {
        size: [2048, 2048, 6],
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