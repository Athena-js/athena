alias m4 = mat4x4<f32>;
alias m3 = mat3x3<f32>;
alias f2 = vec2<f32>;
alias f3 = vec3<f32>;
alias f4 = vec4<f32>;

struct VertexOutput {
  @builtin(position) fragPosition: f4,
  @location(0) position: f3,
};

@vertex
fn main(
  @location(0) position: f3
) -> VertexOutput {
  var output: VertexOutput;
  output.fragPosition = f4(position.xy, 0.9999, 1.0);
  output.position = position;
  return output;
}