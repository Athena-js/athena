import { TextureObject } from '@/buffer/TextureObject';
import { CubeGeometry } from '@/geometry/CubeGeometry';
import { SkyboxMaterial } from '@/material/SkyboxMaterial';
import { Vector3 } from '@/math/Vector';
import { Mesh } from './Mesh';

export class Skybox extends Mesh {

  constructor(texture: TextureObject, far: number) {
    const geometry = new CubeGeometry(new Vector3(far, far, far));
    const material = new SkyboxMaterial(texture);
    super({ geometry, material });
  }

}