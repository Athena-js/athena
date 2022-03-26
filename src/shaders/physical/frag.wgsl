type m4 = mat4x4<f32>;
type m3 = mat3x3<f32>;
type f2 = vec2<f32>;
type f3 = vec3<f32>;
type f4 = vec4<f32>;

let PI: f32 = 3.14159626;

let ambientLightColor: f3 = f3(1.0, 1.0, 1.0);
let ambientLightIndensity: f32 = 0.5;
let dictionalLightColor: f3 = f3(1.0, 1.0, 1.0);
let dictionalLightIndensity: f32 = 4.0;
let dictionalLightDir: f3 = f3(10.0, 1.0, 10.0);

struct CameraUniform {
  ViewMatrix: m4;
  ProjectionMatrix: m4;
  ViewDir: f3;
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

@group(1) @binding(0) var mySampler: sampler;
@group(1) @binding(1) var envTexture: texture_cube<f32>;
@group(1) @binding(2) var baseColorTexture: texture_2d<f32>;
@group(1) @binding(3) var normalTexture: texture_2d<f32>;
@group(1) @binding(4) var metallicRoughnessTexture: texture_2d<f32>;
@group(1) @binding(5) var emissiveTexture: texture_2d<f32>;
@group(1) @binding(6) var aoTexture: texture_2d<f32>;

fn calcTBN(N: f3, p: f3, uv: f2) -> m3 {
  let dp1: f3 = dpdx(p);
  let dp2: f3 = dpdy(p);
  let duv1: f2 = dpdx(uv);
  let duv2: f2 = dpdy(uv);
  let dp2perp: f3 = cross(dp2, N);
  let dp1perp: f3 = cross(N, dp1);
  let T: f3 = dp2perp * duv1.x + dp1perp * duv2.x;
  let B: f3 = dp2perp * duv1.y + dp1perp * duv2.y;
  return m3(normalize(T), normalize(B), N);
}

fn DistributionGGX(cosNH2: f32, roughness4: f32) -> f32 {
  let denom: f32 = cosNH2 * (roughness4 - 1.0) + 1.0;
  return roughness4 / (PI * denom * denom);
}

fn SchlickGGX(cosTheta: f32, k: f32) -> f32 {
  let denom = cosTheta * (1.0 - k) + k;
  return cosTheta / denom;
}

fn GeometrySmith(cosNL: f32, cosNV: f32, roughness: f32) -> f32 {
  let r: f32 = (roughness + 1.0);
  let k: f32 = r * r / 8.0;
  return SchlickGGX(cosNL, k) * SchlickGGX(cosNV, k);
}

fn fresnelSchlick(cosTheta: f32, F0: f3) -> f3 {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

@stage(fragment)
fn main(
  @location(0) position: f3,
  @location(1) viewPosition: f3,
  @location(2) uv: f2,
  @location(3) normal: f3,
  @location(4) color: f3,
) -> @location(0) f4 {

  let texAbedo: f3 = textureSample(baseColorTexture, mySampler, uv).rgb;
  let texNormal: f3 = textureSample(normalTexture, mySampler, uv).rgb * 2.0 - 1.0;
  let texMetallicRoughness: f3 = textureSample(metallicRoughnessTexture, mySampler, uv).rgb;
  let texEmissive: f3 = textureSample(emissiveTexture, mySampler, uv).rgb;
  let texAO: f3 = textureSample(aoTexture, mySampler, uv).rgb;

  let TBN: m3 = calcTBN(normalize(normal), -normalize(viewPosition), uv);
  let ViewDir = normalize(camera.ViewDir);
  
  let N: f3 = normalize((transform.ModelMatrix * f4(normalize(TBN * texNormal), 1.0)).xyz);
  let L: f3 = normalize(dictionalLightDir);
  let H: f3 = normalize((L + ViewDir) / 2.0);

  let irradiance: f3 = textureSample(envTexture, mySampler, reflect(camera.ViewDir, N)).rgb;
  let diffuse = dictionalLightColor * dictionalLightIndensity * texAbedo;
  
  let roughness: f32 = texMetallicRoughness.g;
  let roughness2: f32 = roughness * roughness;
  let roughness4: f32 = roughness2 * roughness2;
  let metallic: f32 = texMetallicRoughness.b;

  // calc angles
  let cosNV: f32 = max(dot(N, ViewDir), 0.0);
  let cosNL: f32 = max(dot(N, L), 0.0);
  let cosNH: f32 = max(dot(N, H), 0.0);
  let cosNH2: f32 = cosNH * cosNH;

  // calc brdf
  let V: f32 = GeometrySmith(cosNL, cosNV, roughness4);
  let D: f32 = DistributionGGX(cosNH2, roughness2);
  let F0: f3 = mix(f3(0.04), texAbedo, metallic);
  let F: f3 = fresnelSchlick(cosNL, F0);

  let kS: f3 = F0;
  let kD: f3 = (1.0 - F0) * (1.0 - metallic);

  let specular: f3 = kS * V * D * F;
  let brdf: f3 = kD * diffuse / PI + specular;

  let ambient: f3 = ambientLightColor * ambientLightIndensity *
    mix(texAbedo, texAbedo * irradiance, metallic);
  
  let outColor: f3 = texAO * ambient + texEmissive + brdf * cosNL;

  return f4(outColor, 1.0);
}