type m4 = mat4x4<f32>;
type f2 = vec2<f32>;
type f3 = vec3<f32>;
type f4 = vec4<f32>;

@group(1) @binding(0) var baseColorTexture: texture_2d<f32>;
@group(1) @binding(1) var mySampler: sampler;

@stage(fragment)
fn main(
  @location(0) uv: f2,
) -> @location(0) vec4<f32> {
  var tex: f4 = textureSample(baseColorTexture, mySampler, uv);
  return tex;
}