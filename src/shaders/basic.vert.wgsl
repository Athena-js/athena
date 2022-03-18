type m4 = mat4x4<f32>;
type f2 = vec2<f32>;
type f3 = vec3<f32>;
type f4 = vec4<f32>;

struct CameraUniform {
  ViewMatrix: m4;
  ProjectionMatrix: m4;
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

struct VertexOutput {
  @builtin(position) fragPosition: f4;
  @location(0) position: f4;
  @location(1) uv: f2;
  @location(2) normal: f3;
};

@stage(vertex)
fn main(
  @location(0) position: f3,
  @location(1) uv: f2,
  @location(2) normal: f3
) -> VertexOutput {
  var output: VertexOutput;
  output.fragPosition = camera.ProjectionMatrix * transform.ModelViewMatrix * f4(position, 1.0);
  output.position = f4(position, 1.0);
  output.uv = uv;
  output.normal = normal;
  return output;
}