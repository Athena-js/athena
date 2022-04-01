type m4 = mat4x4<f32>;
type m3 = mat3x3<f32>;
type f2 = vec2<f32>;
type f3 = vec3<f32>;
type f4 = vec4<f32>;

struct CameraUniform {
  ViewMatrix: m4,
  ProjectionMatrix: m4,
};

struct TransformUniform {
  ModelMatrix: m4,
  ModelViewMatrix: m4,
  NormalMatrix: m4,
};

@group(0)
@binding(0)
var<uniform> camera: CameraUniform;

@group(0)
@binding(1)
var<uniform> transform: TransformUniform;

struct VertexOutput {
  @builtin(position) fragPosition: f4,
  @location(0) position: f3,
  @location(1) worldPosition: f3,
  @location(2) viewPosition: f3,
  @location(3) uv: f2,
  @location(4) normal: f3,
  @location(5) color: f3,
};

@stage(vertex)
fn main(
  @location(0) position: f3,
  @location(1) uv: f2,
  @location(2) normal: f3,
  @location(3) color: f3
) -> VertexOutput {
  var output: VertexOutput;
  var worldPosition: f4 = transform.ModelMatrix * f4(position, 1.0);
  var viewPosition: f4 = camera.ViewMatrix * worldPosition;

  output.position = position;
  output.worldPosition = worldPosition.xyz;
  output.viewPosition = viewPosition.xyz;
  output.uv = uv;
  output.normal = normal;
  output.color = color;
  output.fragPosition = camera.ProjectionMatrix * viewPosition;
  return output;
}