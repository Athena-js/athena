type m4 = mat4x4<f32>;
type m3 = mat3x3<f32>;
type f2 = vec2<f32>;
type f3 = vec3<f32>;
type f4 = vec4<f32>;

@fragment
fn main(
  @location(0) position: f4,
  @location(1) uv: f2,
  @location(2) normal: f3,
  @location(3) color: f3,
) -> @location(0) f4 {
  return vec4(normal * 0.5 + 0.5, 1.0);
}