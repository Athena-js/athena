alias m4 = mat4x4<f32>;
alias m3 = mat3x3<f32>;
alias f2 = vec2<f32>;
alias f3 = vec3<f32>;
alias f4 = vec4<f32>;

const PI: f32 = 3.14159626;

const ambientLightColor: f3 = f3(1.0, 1.0, 1.0);
const ambientLightIndensity: f32 = 0.8;
const dictionalLightColor: f3 = f3(1.0, 1.0, 1.0);
const dictionalLightIndensity: f32 = 4.0;
const dictionalLightDir: f3 = f3(5.0, 5.0, 5.0);

struct CameraUniform {
  ViewMatrix: m4,
  ProjectionMatrix: m4,
  CameraPos: f3,
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

fn DistributionBlinnPhong(cosNH: f32, m: f32) -> f32 {
  return (m + 8.0) * pow(cosNH, m) / (8.0 * PI);
}

fn DistributionGGX(cosNH2: f32, roughness2: f32) -> f32 {
  let t: f32 = cosNH2 * (roughness2 - 1.0) + 1.0;
  return roughness2 / (PI * t * t);
}

fn GeometrySchlickGGX(cosTheta: f32, k: f32) -> f32 {
  let denom = cosTheta * (1.0 - k) + k;
  return cosTheta / denom;
}

fn GeometrySmith(cosNL: f32, cosNV: f32, roughness: f32) -> f32 {
  let r: f32 = (roughness + 1.0);
  let k: f32 = r * r / 8.0;
  return GeometrySchlickGGX(cosNL, k) * GeometrySchlickGGX(cosNV, k);
}

fn fresnelSchlick(cosTheta: f32, F0: f3) -> f3 {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

@fragment
fn main(
  @location(0) position: f3,
  @location(1) viewPosition: f3,
  @location(2) worldPosition: f3,
  @location(3) uv: f2,
  @location(4) normal: f3,
  @location(5) color: f3,
) -> @location(0) f4 {

  let texAbedo: f3 = textureSample(baseColorTexture, mySampler, uv).rgb;
  let texNormal: f3 = textureSample(normalTexture, mySampler, uv).rgb * 2.0 - 1.0;
  let texMetallicRoughness: f3 = textureSample(metallicRoughnessTexture, mySampler, uv).rgb;
  let texEmissive: f3 = textureSample(emissiveTexture, mySampler, uv).rgb;
  let texAO: f3 = textureSample(aoTexture, mySampler, uv).rgb;

  let TBN: m3 = calcTBN(normalize(normal), -normalize(viewPosition), uv);

  let N: f3 = normalize((transform.ModelMatrix * f4(normalize(TBN * texNormal), 1.0)).xyz);
  let L: f3 = normalize(dictionalLightDir - worldPosition);
  let V = normalize(camera.CameraPos - worldPosition);
  let H: f3 = normalize(L + V);

  let radiance: f3 = textureSample(envTexture, mySampler, reflect(-V, N)).rgb;
  let diffuse = dictionalLightColor * dictionalLightIndensity * texAbedo;
  
  let roughness: f32 = texMetallicRoughness.g;
  let roughness2: f32 = roughness * roughness;
  let roughness4: f32 = roughness2 * roughness2;
  let metallic: f32 = texMetallicRoughness.b;

  // calc angles
  let cosNV: f32 = max(dot(N, V), 0.0);
  let cosNL: f32 = max(dot(N, L), 0.0);
  let cosNH: f32 = max(dot(N, H), 0.0);
  let cosNH2: f32 = cosNH * cosNH;

  // calc brdf
  let D: f32 = DistributionGGX(cosNH2, roughness2);
  // let D: f32 = DistributionBlinnPhong(cosNH, 16.0);
  let F0: f3 = mix(f3(0.04), texAbedo, metallic);
  let F: f3 = fresnelSchlick(cosNL, F0);
  let G: f32 = GeometrySmith(cosNL, cosNV, roughness4);

  let kS: f3 = F;
  let kD: f3 = (1.0 - kS) * (1.0 - metallic);

  let specular: f3 = D * F * G / (4.0 * cosNL * cosNV + 0.0001);
  let brdf: f3 = diffuse * (kD / PI + kS * specular);

  // var irradiance: f3 = f3(0.0);  
  // var up: f3 = vec3(0.0, 1.0, 0.0);
  // var right: f3 = cross(up, normal);
  // up = cross(normal, right);

  // var sampleDelta: f32 = 0.1;
  // var nrSamples: f32 = 0.0; 

  // for(var phi: f32 = 0.0; phi < 2.0 * PI; phi = phi + sampleDelta) {
  //   for(var theta: f32 = 0.0; theta < 0.5 * PI; theta = theta + sampleDelta) {
  //       // spherical to cartesian (in tangent space)
  //       var tangentSample: f3 = f3(sin(theta) * cos(phi),  sin(theta) * sin(phi), cos(theta));
  //       // tangent space to world
  //       var sampleVec: f3 = tangentSample.x * right + tangentSample.y * up + tangentSample.z * N;
  //       irradiance = irradiance + textureSample(envTexture, mySampler, sampleVec).rgb * cos(theta) * sin(theta);
  //       nrSamples = nrSamples + 1.0;
  //   }
  // }
  // irradiance = PI * irradiance * (1.0 / nrSamples);

  let ambient: f3 = ambientLightColor * ambientLightIndensity *
    mix(texAbedo, texAbedo * radiance, metallic);

  var outColor: f3 = texAO * ambient + texEmissive + texAO * brdf * cosNL;

  return f4(outColor, 1.0);
  // return f4(f3(irradiance), 1.0);
}