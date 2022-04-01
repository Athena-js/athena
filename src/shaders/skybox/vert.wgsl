type m4 = mat4x4<f32>;
type m3 = mat3x3<f32>;
type f2 = vec2<f32>;
type f3 = vec3<f32>;
type f4 = vec4<f32>;

struct VertexOutput {
  @builtin(position) fragPosition: f4,
  @location(0) position: f3,
};

@stage(vertex)
fn main(
  @location(0) position: f3
) -> VertexOutput {
  var output: VertexOutput;
  output.fragPosition = f4(position.xy, 0.9999, 1.0);
  output.position = position;
  return output;
}