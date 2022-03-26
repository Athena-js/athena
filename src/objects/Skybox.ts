import { TextureObject } from '@/buffer/TextureObject';
import { SkyboxMaterial } from '@/material/SkyboxMaterial';
import { BufferGeometry } from '@/geometry/BufferGeometry';
import { Mesh } from './Mesh';

export class Skybox extends Mesh {

  constructor(texture: TextureObject) {
    const geometry = new BufferGeometry({
      position: new Float32Array([
        -1, -1, 1,
         1, -1, 1,
        -1,  1, 1,
        -1,  1, 1,
         1, -1, 1,
         1,  1, 1,
      ]),
      index: new Uint16Array([
        0, 1, 2,
        3, 4, 5
      ])
    });
    const material = new SkyboxMaterial(texture);
    super({ geometry, material });
  }

}