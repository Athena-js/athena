type m4 = mat4x4<f32>;
type f2 = vec2<f32>;
type f3 = vec3<f32>;
type f4 = vec4<f32>;

@stage(fragment)
fn main(
  @location(0) position: f4,
  @location(1) uv: f2,
  @location(2) normal: f3,
) -> @location(0) vec4<f32> {
  return vec4(normal * 0.5 + 0.5, 1.0);
}