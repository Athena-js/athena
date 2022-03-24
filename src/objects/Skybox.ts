import { TextureObject } from '@/buffer/TextureObject';
import { CubeGeometry } from '@/geometry/CubeGeometry';
import { SkyboxMaterial } from '@/material/SkyboxMaterial';
import { Mesh } from './Mesh';

export class Skybox extends Mesh {

  constructor(texture: TextureObject) {
    const geometry = new CubeGeometry();
    const material = new SkyboxMaterial(texture);
    super({ geometry, material });
  }

}