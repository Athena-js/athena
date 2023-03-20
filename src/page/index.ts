import './style.less';

import { mat4, vec3 } from 'gl-matrix';
import { GrGPU } from '@/graphics/GrGPU';
import { GrVertexBuffer } from '@/graphics/GrVertexBuffer';

export const cubeVertexSize = 4 * 10; // Byte size of one cube vertex.
export const cubePositionOffset = 0;
export const cubeColorOffset = 4 * 4; // Byte offset of cube vertex color attribute.
export const cubeUVOffset = 4 * 8;
export const cubeVertexCount = 36;

// prettier-ignore
export const cubeVertexArray = [
  // float4 position, float4 color, float2 uv,
  1, -1, 1, 1,   1, 0, 1, 1,  1, 1,
  -1, -1, 1, 1,  0, 0, 1, 1,  0, 1,
  -1, -1, -1, 1, 0, 0, 0, 1,  0, 0,
  1, -1, -1, 1,  1, 0, 0, 1,  1, 0,
  1, -1, 1, 1,   1, 0, 1, 1,  1, 1,
  -1, -1, -1, 1, 0, 0, 0, 1,  0, 0,

  1, 1, 1, 1,    1, 1, 1, 1,  1, 1,
  1, -1, 1, 1,   1, 0, 1, 1,  0, 1,
  1, -1, -1, 1,  1, 0, 0, 1,  0, 0,
  1, 1, -1, 1,   1, 1, 0, 1,  1, 0,
  1, 1, 1, 1,    1, 1, 1, 1,  1, 1,
  1, -1, -1, 1,  1, 0, 0, 1,  0, 0,

  -1, 1, 1, 1,   0, 1, 1, 1,  1, 1,
  1, 1, 1, 1,    1, 1, 1, 1,  0, 1,
  1, 1, -1, 1,   1, 1, 0, 1,  0, 0,
  -1, 1, -1, 1,  0, 1, 0, 1,  1, 0,
  -1, 1, 1, 1,   0, 1, 1, 1,  1, 1,
  1, 1, -1, 1,   1, 1, 0, 1,  0, 0,

  -1, -1, 1, 1,  0, 0, 1, 1,  1, 1,
  -1, 1, 1, 1,   0, 1, 1, 1,  0, 1,
  -1, 1, -1, 1,  0, 1, 0, 1,  0, 0,
  -1, -1, -1, 1, 0, 0, 0, 1,  1, 0,
  -1, -1, 1, 1,  0, 0, 1, 1,  1, 1,
  -1, 1, -1, 1,  0, 1, 0, 1,  0, 0,

  1, 1, 1, 1,    1, 1, 1, 1,  1, 1,
  -1, 1, 1, 1,   0, 1, 1, 1,  0, 1,
  -1, -1, 1, 1,  0, 0, 1, 1,  0, 0,
  -1, -1, 1, 1,  0, 0, 1, 1,  0, 0,
  1, -1, 1, 1,   1, 0, 1, 1,  1, 0,
  1, 1, 1, 1,    1, 1, 1, 1,  1, 1,

  1, -1, -1, 1,  1, 0, 0, 1,  1, 1,
  -1, -1, -1, 1, 0, 0, 0, 1,  0, 1,
  -1, 1, -1, 1,  0, 1, 0, 1,  0, 0,
  1, 1, -1, 1,   1, 1, 0, 1,  1, 0,
  1, -1, -1, 1,  1, 0, 0, 1,  1, 1,
  -1, 1, -1, 1,  0, 1, 0, 1,  0, 0,
];

export const run = async (canvas: HTMLCanvasElement) => {

  const gpu = await new GrGPU().initAsync(canvas);
  const device = gpu.device;
  const context = canvas.getContext('webgpu')!;

  const presentationSize = [canvas.width, canvas.height];
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format: presentationFormat,
    alphaMode: 'opaque',
  });

  // Create a vertex buffer from the cube data.
  const vbo = gpu.createVertexBuffer({
    data: cubeVertexArray,
    strideLength: 10,
    attributes: [
      { name: 'position', format: 'float32x4' },
      { name: 'color', format: 'float32x4' },
      { name: 'uv', format: 'float32x2' },
    ]
  });
  const verticesBuffer = vbo.gpuBuffer;

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: `
          struct Uniforms {
            modelViewProjectionMatrix : mat4x4<f32>,
          }
          @binding(0) @group(0) var<uniform> uniforms : Uniforms;
          
          struct VertexOutput {
            @builtin(position) Position : vec4<f32>,
            @location(0) fragUV : vec2<f32>,
            @location(1) fragColor: vec4<f32>,
            @location(2) fragPosition: vec4<f32>,
          }
          
          @vertex
          fn main(
            @location(0) position : vec4<f32>,
            @location(1) color : vec4<f32>,
            @location(2) uv : vec2<f32>,
          ) -> VertexOutput {
            var output : VertexOutput;
            output.Position = uniforms.modelViewProjectionMatrix * position;
            output.fragUV = uv;
            output.fragColor = color;
            output.fragPosition = 0.5 * (position + vec4<f32>(1.0, 1.0, 1.0, 1.0));
            return output;
          }`
      }),
      entryPoint: 'main',
      buffers: GrVertexBuffer.GetVertexLayouts([vbo]),
    },
    fragment: {
      module: device.createShaderModule({
        code: `
          @fragment
          fn main(
            @location(0) fragUV : vec2<f32>,
            @location(1) fragColor: vec4<f32>,
            @location(2) fragPosition: vec4<f32>,
          ) -> @location(0) vec4<f32> {
            return fragColor;
          }`
      }),
      entryPoint: 'main',
      targets: [
        {
          format: presentationFormat,
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',

      // Backface culling since the cube is solid piece of geometry.
      // Faces pointing away from the camera will be occluded by faces
      // pointing toward the camera.
      cullMode: 'back',
    },

    // Enable depth testing so that the fragment closest to the camera
    // is rendered in front.
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    },
  });

  let depthTexture = device.createTexture({
    size: presentationSize,
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const uniformBufferSize = 4 * 16; // 4x4 matrix
  const uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
    ],
  });

  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: undefined as any as GPUTextureView, // Assigned later
        clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  };

  const aspect = canvas.width / canvas.height;
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);

  function getTransformationMatrix() {
    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, 0, -4));
    const now = Date.now() / 1000;
    mat4.rotate(
      viewMatrix,
      viewMatrix,
      1,
      vec3.fromValues(Math.sin(now), Math.cos(now), 0)
    );

    const modelViewProjectionMatrix = mat4.create();
    mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix);

    return modelViewProjectionMatrix as Float32Array;
  }

  let resize = false;

  function frame() {
    gpu.onResize((width, height) => {
      presentationSize[0] = width;
      presentationSize[1] = height;
      resize = true;
    });

    if (resize) {
      mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, canvas.width / canvas.height, 1, 100.0);

      depthTexture?.destroy();
      depthTexture = device.createTexture({
        size: presentationSize,
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });
      
      renderPassDescriptor.depthStencilAttachment!.view = depthTexture.createView();
      resize = false;
    }

    const transformationMatrix = getTransformationMatrix();
    device.queue.writeBuffer(
      uniformBuffer,
      0,
      transformationMatrix.buffer,
      transformationMatrix.byteOffset,
      transformationMatrix.byteLength
    );
  
    (renderPassDescriptor.colorAttachments as any)[0].view = context
      .getCurrentTexture()
      .createView();

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniformBindGroup);
    passEncoder.setVertexBuffer(0, verticesBuffer);
    passEncoder.draw(cubeVertexCount, 1, 0, 0);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

run(document.getElementById('renderCanvas') as HTMLCanvasElement);