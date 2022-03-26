type m4 = mat4x4<f32>;
type m3 = mat3x3<f32>;
type f2 = vec2<f32>;
type f3 = vec3<f32>;
type f4 = vec4<f32>;

struct CameraUniform {
  ViewMatrix: m4;
  ProjectionMatrix: m4;
  ViewDir: f3;
  ViewProjectionInverseMatrix: m4;
};

struct TransformUniform {
  ModelMatrix: m4;
  ModelViewMatrix: m4;
  NormalMatrix: m4;
};

@group(0)
@binding(0)
var<uniform> camera: CameraUniform;

@group(0)
@binding(1)
var<uniform> transform: TransformUniform;

@group(1) @binding(0) var baseColorTexture: texture_cube<f32>;
@group(1) @binding(1) var mySampler: sampler;

@stage(fragment)
fn main(
  @location(0) position: f3
) -> @location(0) f4 {
  let t: f4 = camera.ViewProjectionInverseMatrix * f4(position, 1.0);
  let tex: f4 = textureSample(baseColorTexture, mySampler, normalize(t.xyz / t.w));
  return tex;
}