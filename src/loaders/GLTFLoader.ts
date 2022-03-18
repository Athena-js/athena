import { WebIO } from '@gltf-transform/core';
import { BufferGeometry } from '@/geometry/BufferGeometry';
import { NormalMaterial } from '@/material/NormalMaterial';
import { Mesh } from '@/objects/Mesh';
import { BaseLoader } from "./BaseLoader";
import { Quaternion } from '@/math/Quaternion';

const io = new WebIO({ credentials: 'include' });

export class GLTFLoader extends BaseLoader {

  async loadAsync(url: string): Promise<any> {
    const doc = await io.read(url);
    const root = doc.getRoot();
    const node = root.listNodes()[0];

    const quat = new Quaternion(node.getRotation());
    const angles = quat.getEuler();

    const premitive = node.getMesh()!.listPrimitives()[0];
    const vertices = premitive.getAttribute('POSITION')!;
    const normal = premitive.getAttribute('NORMAL')!;
    const uv = premitive.getAttribute('TEXCOORD_0')!;
    const indices = premitive.getIndices()!;
    
    const geometry = new BufferGeometry({
      position: vertices.getArray() as Float32Array,
      normal: normal.getArray() as Float32Array,
      uv: uv.getArray() as Float32Array,
      index: indices.getArray() as Uint16Array,
    });

    const mesh = new Mesh({
      geometry,
      material: new NormalMaterial()
    });
    mesh.rotation.copy(angles);

    return mesh;
  }

}