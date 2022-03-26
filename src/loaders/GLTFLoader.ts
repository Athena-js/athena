import * as GT from '@gltf-transform/core';
import { BufferGeometry } from '@/geometry/BufferGeometry';
import { PhysicalMaterial } from '@/material/PhysicalMaterial';
import { SceneNode } from '@/objects/SceneNode';
import { Mesh } from '@/objects/Mesh';
import { Quaternion } from '@/math/Quaternion';
import { BaseLoader } from "./BaseLoader";
import { TextureObject } from '@/buffer/TextureObject';

const io = new GT.WebIO({ credentials: 'include' });

const GPUTextureUsage = window.GPUTextureUsage ?? {};

const GLTFWrapModeMapper: { [k: number]: GPUAddressMode } = {
  33071: 'clamp-to-edge',
  33648: 'mirror-repeat',
  10497: 'repeat'
}

const DefaultTexture = new TextureObject({
  texture: {
    size: [1, 1, 1],
    format: 'rgba8unorm',
    usage:
      GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.RENDER_ATTACHMENT
  }
});

export class GLTFLoader extends BaseLoader {

  protected _cachedTextures: WeakMap<GT.Texture, TextureObject> = new Map();

  async loadAsync(url: string): Promise<SceneNode> {
    const doc = await io.read(url);
    const root = doc.getRoot();
    const scene = root.listScenes()[0];
    const rootNode = new SceneNode();

    // load textures
    await Promise.all(root.listTextures().map(_tex => {
      const size = _tex.getSize()!;
      const texture = new TextureObject({
        texture: {
          size: [size[0], size[1], 1],
          format: 'rgba8unorm',
          usage:
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.RENDER_ATTACHMENT
        }
      });
      this._cachedTextures.set(_tex, texture);
      const blob = new Blob([_tex.getImage()!]);
      return texture.setImageAsync(blob);
    }));

    // parse nodes
    scene.listChildren().forEach(child => {
      this.parseNode(child, rootNode);
    });

    return rootNode;
  }

  parseNode(_node: GT.Node, parentNode: SceneNode): SceneNode {
    let node: SceneNode;

    const _mesh = _node.getMesh();

    if (_mesh) {
      node = this.parseMesh(_mesh);
    } else {
      node = new SceneNode();
    }

    const position = _node.getTranslation();
    const quat = new Quaternion(_node.getRotation());
    const rotation = quat.getEuler();
    const scale = _node.getScale();
    node.position.set(...position);
    node.rotation.copy(rotation);
    node.scale.set(...scale);
    parentNode.add(node);

    _node.listChildren().forEach((child => {
      this.parseNode(child, node);
    }));

    return node;
  }

  parseMesh(_mesh: GT.Mesh) {
    const geometry = this.parseGeometry(_mesh);
    const material = this.parseMaterial(_mesh);

    const mesh = new Mesh({
      geometry,
      material,
    });

    return mesh;
  }

  parseGeometry(_mesh: GT.Mesh) {
    const premitive = _mesh.listPrimitives()[0];

    const vertices = premitive.getAttribute('POSITION')!;
    const indices = premitive.getIndices()!;
    const normal = premitive.getAttribute('NORMAL');
    const uv = premitive.getAttribute('TEXCOORD_0');
    const color = premitive.getAttribute('COLOR_0');
    
    const geometry = new BufferGeometry({
      position: vertices.getArray() as Float32Array,
      normal: normal?.getArray() as Float32Array ?? new Float32Array(),
      uv: uv?.getArray() as Float32Array ?? new Float32Array(),
      color: color?.getArray() as Float32Array ?? new Float32Array(),
      index: indices.getArray() as Uint16Array,
    });

    return geometry;
  }

  parseMaterial(_mesh: GT.Mesh) {
    const premitive = _mesh.listPrimitives()[0];
    const _mat = premitive.getMaterial()!;

    let baseColorTexture = DefaultTexture;
    let normalTexture = DefaultTexture;
    let metallicRoughnessTexture = DefaultTexture;
    let emissiveTexture = DefaultTexture;
    let aoTexture = DefaultTexture;

    const updateTextureInfo = (texture: TextureObject, info: GT.TextureInfo) => {
      texture?.updateDescriptor({
        sampler: {
          addressModeU: GLTFWrapModeMapper[info.getWrapS()],
          addressModeV: GLTFWrapModeMapper[info.getWrapT()],
        }
      });
    }

    if (_mat.getBaseColorTexture()) {
      baseColorTexture = this._cachedTextures.get(_mat.getBaseColorTexture()!)!;
      updateTextureInfo(baseColorTexture, _mat.getBaseColorTextureInfo()!);
    }

    if (_mat.getNormalTexture()) {
      normalTexture = this._cachedTextures.get(_mat.getNormalTexture()!)!;
      updateTextureInfo(normalTexture, _mat.getNormalTextureInfo()!);
    }

    if (_mat.getMetallicRoughnessTexture()) {
      metallicRoughnessTexture = this._cachedTextures.get(_mat.getMetallicRoughnessTexture()!)!;
      updateTextureInfo(metallicRoughnessTexture, _mat.getMetallicRoughnessTextureInfo()!);
    }

    if (_mat.getEmissiveTexture()) {
      emissiveTexture = this._cachedTextures.get(_mat.getEmissiveTexture()!)!;
      updateTextureInfo(emissiveTexture, _mat.getEmissiveTextureInfo()!);
    }

    if (_mat.getOcclusionTexture()) {
      aoTexture = this._cachedTextures.get(_mat.getOcclusionTexture()!)!;
      updateTextureInfo(aoTexture, _mat.getOcclusionTextureInfo()!);
    }

    return new PhysicalMaterial({
      baseColorTexture,
      normalTexture,
      metallicRoughnessTexture,
      emissiveTexture,
      aoTexture
    });
  }

}