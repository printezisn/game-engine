import { u as We, G as ee, v as te, x as ze, l as re, M as g, E as u, e as E, y as se, z as b, F as Ve, R as D, H as ne, I as ae, J as je, a as m, S as f, j as B, w as ie, K as N, L as Ne, d as $, B as T, k as U, N as M, T as C, O as S, Q as $e, c as qe, C as w, V as oe, W as le, X as de, Y as ue, Z as Ke, _ as Ye, P as Je, h as Xe, b as q, D as ce, $ as K, a0 as Qe, a1 as Ze, a2 as et } from "./index-Cws8ZQ0U.js";
import { S as he, T as Y, B as tt, c as rt } from "./colorToUniform-DJNidXq_.js";
const fe = class A extends We {
  /**
   * @param options - The optional parameters of this filter.
   */
  constructor(e) {
    e = { ...A.defaultOptions, ...e }, super(e), this.enabled = !0, this._state = he.for2d(), this.blendMode = e.blendMode, this.padding = e.padding, typeof e.antialias == "boolean" ? this.antialias = e.antialias ? "on" : "off" : this.antialias = e.antialias, this.resolution = e.resolution, this.blendRequired = e.blendRequired, this.clipToViewport = e.clipToViewport, this.addResource("uTexture", 0, 1);
  }
  /**
   * Applies the filter
   * @param filterManager - The renderer to retrieve the filter from
   * @param input - The input render target.
   * @param output - The target to output to.
   * @param clearMode - Should the output be cleared before rendering to it
   */
  apply(e, t, r, n) {
    e.applyFilter(this, t, r, n);
  }
  /**
   * Get the blend mode of the filter.
   * @default "normal"
   */
  get blendMode() {
    return this._state.blendMode;
  }
  /** Sets the blend mode of the filter. */
  set blendMode(e) {
    this._state.blendMode = e;
  }
  /**
   * A short hand function to create a filter based of a vertex and fragment shader src.
   * @param options
   * @returns A shiny new PixiJS filter!
   */
  static from(e) {
    const { gpu: t, gl: r, ...n } = e;
    let a, i;
    return t && (a = ee.from(t)), r && (i = te.from(r)), new A({
      gpuProgram: a,
      glProgram: i,
      ...n
    });
  }
};
fe.defaultOptions = {
  blendMode: "normal",
  resolution: 1,
  padding: 0,
  antialias: "off",
  blendRequired: !1,
  clipToViewport: !0
};
let st = fe;
var nt = `in vec2 vMaskCoord;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uMaskTexture;

uniform float uAlpha;
uniform vec4 uMaskClamp;
uniform float uInverse;

out vec4 finalColor;

void main(void)
{
    float clip = step(3.5,
        step(uMaskClamp.x, vMaskCoord.x) +
        step(uMaskClamp.y, vMaskCoord.y) +
        step(vMaskCoord.x, uMaskClamp.z) +
        step(vMaskCoord.y, uMaskClamp.w));

    // TODO look into why this is needed
    float npmAlpha = uAlpha;
    vec4 original = texture(uTexture, vTextureCoord);
    vec4 masky = texture(uMaskTexture, vMaskCoord);
    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);

    float a = alphaMul * masky.r * npmAlpha * clip;

    if (uInverse == 1.0) {
        a = 1.0 - a;
    }

    finalColor = original * a;
}
`, at = `in vec2 aPosition;

out vec2 vTextureCoord;
out vec2 vMaskCoord;


uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
uniform mat3 uFilterMatrix;

vec4 filterVertexPosition(  vec2 aPosition )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
       
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(  vec2 aPosition )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

vec2 getFilterCoord( vec2 aPosition )
{
    return  ( uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}   

void main(void)
{
    gl_Position = filterVertexPosition(aPosition);
    vTextureCoord = filterTextureCoord(aPosition);
    vMaskCoord = getFilterCoord(aPosition);
}
`, J = `struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct MaskUniforms {
  uFilterMatrix:mat3x3<f32>,
  uMaskClamp:vec4<f32>,
  uAlpha:f32,
  uInverse:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> filterUniforms : MaskUniforms;
@group(1) @binding(1) var uMaskTexture: texture_2d<f32>;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) filterUv : vec2<f32>,
};

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);
}

fn getFilterCoord(aPosition:vec2<f32> ) -> vec2<f32>
{
  return ( filterUniforms.uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}

fn getSize() -> vec2<f32>
{
  return gfu.uGlobalFrame.zw;
}

@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition),
   getFilterCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) filterUv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

    var maskClamp = filterUniforms.uMaskClamp;
    var uAlpha = filterUniforms.uAlpha;

    var clip = step(3.5,
      step(maskClamp.x, filterUv.x) +
      step(maskClamp.y, filterUv.y) +
      step(filterUv.x, maskClamp.z) +
      step(filterUv.y, maskClamp.w));

    var mask = textureSample(uMaskTexture, uSampler, filterUv);
    var source = textureSample(uTexture, uSampler, uv);
    var alphaMul = 1.0 - uAlpha * (1.0 - mask.a);

    var a: f32 = alphaMul * mask.r * uAlpha * clip;

    if (filterUniforms.uInverse == 1.0) {
        a = 1.0 - a;
    }

    return source * a;
}
`;
class it extends st {
  constructor(e) {
    const { sprite: t, ...r } = e, n = new ze(t.texture), a = new re({
      uFilterMatrix: { value: new g(), type: "mat3x3<f32>" },
      uMaskClamp: { value: n.uClampFrame, type: "vec4<f32>" },
      uAlpha: { value: 1, type: "f32" },
      uInverse: { value: e.inverse ? 1 : 0, type: "f32" }
    }), i = ee.from({
      vertex: {
        source: J,
        entryPoint: "mainVertex"
      },
      fragment: {
        source: J,
        entryPoint: "mainFragment"
      }
    }), o = te.from({
      vertex: at,
      fragment: nt,
      name: "mask-filter"
    });
    super({
      ...r,
      gpuProgram: i,
      glProgram: o,
      resources: {
        filterUniforms: a,
        uMaskTexture: t.texture.source
      }
    }), this.sprite = t, this._textureMatrix = n;
  }
  set inverse(e) {
    this.resources.filterUniforms.uniforms.uInverse = e ? 1 : 0;
  }
  get inverse() {
    return this.resources.filterUniforms.uniforms.uInverse === 1;
  }
  apply(e, t, r, n) {
    this._textureMatrix.texture = this.sprite.texture, e.calculateSpriteMatrix(
      this.resources.filterUniforms.uniforms.uFilterMatrix,
      this.sprite
    ).prepend(this._textureMatrix.mapCoord), this.resources.uMaskTexture = this.sprite.texture.source, e.applyFilter(this, t, r, n);
  }
}
const O = class pe {
  constructor(e, t) {
    var r, n;
    this.state = he.for2d(), this._batchersByInstructionSet = /* @__PURE__ */ Object.create(null), this._activeBatches = /* @__PURE__ */ Object.create(null), this.renderer = e, this._adaptor = t, (n = (r = this._adaptor).init) == null || n.call(r, this);
  }
  static getBatcher(e) {
    return new this._availableBatchers[e]();
  }
  buildStart(e) {
    let t = this._batchersByInstructionSet[e.uid];
    t || (t = this._batchersByInstructionSet[e.uid] = /* @__PURE__ */ Object.create(null), t.default || (t.default = new se())), this._activeBatches = t, this._activeBatch = this._activeBatches.default;
    for (const r in this._activeBatches)
      this._activeBatches[r].begin();
  }
  addToBatch(e, t) {
    if (this._activeBatch.name !== e.batcherName) {
      this._activeBatch.break(t);
      let r = this._activeBatches[e.batcherName];
      r || (r = this._activeBatches[e.batcherName] = pe.getBatcher(e.batcherName), r.begin()), this._activeBatch = r;
    }
    this._activeBatch.add(e);
  }
  break(e) {
    this._activeBatch.break(e);
  }
  buildEnd(e) {
    this._activeBatch.break(e);
    const t = this._activeBatches;
    for (const r in t) {
      const n = t[r], a = n.geometry;
      a.indexBuffer.setDataWithSize(n.indexBuffer, n.indexSize, !0), a.buffers[0].setDataWithSize(n.attributeBuffer.float32View, n.attributeSize, !1);
    }
  }
  upload(e) {
    const t = this._batchersByInstructionSet[e.uid];
    for (const r in t) {
      const n = t[r], a = n.geometry;
      n.dirty && (n.dirty = !1, a.buffers[0].update(n.attributeSize * 4));
    }
  }
  execute(e) {
    if (e.action === "startBatch") {
      const t = e.batcher, r = t.geometry, n = t.shader;
      this._adaptor.start(this, r, n);
    }
    this._adaptor.execute(this, e);
  }
  destroy() {
    this.state = null, this.renderer = null, this._adaptor = null;
    for (const e in this._activeBatches)
      this._activeBatches[e].destroy();
    this._activeBatches = null;
  }
};
O.extension = {
  type: [
    u.WebGLPipes,
    u.WebGPUPipes,
    u.CanvasPipes
  ],
  name: "batch"
};
O._availableBatchers = /* @__PURE__ */ Object.create(null);
let me = O;
E.handleByMap(u.Batcher, me._availableBatchers);
E.add(se);
const Dt = {
  name: "texture-bit",
  vertex: {
    header: (
      /* wgsl */
      `

        struct TextureUniforms {
            uTextureMatrix:mat3x3<f32>,
        }

        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
        `
    ),
    main: (
      /* wgsl */
      `
            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
        `
    )
  },
  fragment: {
    header: (
      /* wgsl */
      `
            @group(2) @binding(0) var uTexture: texture_2d<f32>;
            @group(2) @binding(1) var uSampler: sampler;

         
        `
    ),
    main: (
      /* wgsl */
      `
            outColor = textureSample(uTexture, uSampler, vUV);
        `
    )
  }
}, Ot = {
  name: "texture-bit",
  vertex: {
    header: (
      /* glsl */
      `
            uniform mat3 uTextureMatrix;
        `
    ),
    main: (
      /* glsl */
      `
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `
    )
  },
  fragment: {
    header: (
      /* glsl */
      `
        uniform sampler2D uTexture;

         
        `
    ),
    main: (
      /* glsl */
      `
            outColor = texture(uTexture, vUV);
        `
    )
  }
};
function ot(s, e) {
  const t = s.root, r = s.instructionSet;
  r.reset();
  const n = e.renderPipes ? e : e.batch.renderer, a = n.renderPipes;
  a.batch.buildStart(r), a.blendMode.buildStart(), a.colorMask.buildStart(), t.sortableChildren && t.sortChildren(), ge(t, r, n, !0), a.batch.buildEnd(r), a.blendMode.buildEnd(r);
}
function P(s, e, t) {
  const r = t.renderPipes ? t : t.batch.renderer;
  s.globalDisplayStatus < 7 || !s.includeInBuild || (s.sortableChildren && s.sortChildren(), s.isSimple ? lt(s, e, r) : ge(s, e, r, !1));
}
function lt(s, e, t) {
  if (s.renderPipeId) {
    const r = s, { renderPipes: n, renderableGC: a } = t;
    n.blendMode.setBlendMode(r, s.groupBlendMode, e), n[r.renderPipeId].addRenderable(r, e), a.addRenderable(r, e), r.didViewUpdate = !1;
  }
  if (!s.renderGroup) {
    const r = s.children, n = r.length;
    for (let a = 0; a < n; a++)
      P(r[a], e, t);
  }
}
function ge(s, e, t, r) {
  const { renderPipes: n, renderableGC: a } = t;
  if (!r && s.renderGroup)
    n.renderGroup.addRenderGroup(s.renderGroup, e);
  else {
    for (let d = 0; d < s.effects.length; d++) {
      const c = s.effects[d];
      n[c.pipe].push(c, s, e);
    }
    const i = s, o = i.renderPipeId;
    o && (n.blendMode.setBlendMode(i, i.groupBlendMode, e), n[o].addRenderable(i, e), a.addRenderable(i, e), i.didViewUpdate = !1);
    const l = s.children;
    if (l.length)
      for (let d = 0; d < l.length; d++)
        P(l[d], e, t);
    for (let d = s.effects.length - 1; d >= 0; d--) {
      const c = s.effects[d];
      n[c.pipe].pop(c, s, e);
    }
  }
}
const dt = new ne();
class ut extends ae {
  constructor() {
    super(), this.filters = [new it({
      sprite: new je(m.EMPTY),
      inverse: !1,
      resolution: "inherit",
      antialias: "inherit"
    })];
  }
  get sprite() {
    return this.filters[0].sprite;
  }
  set sprite(e) {
    this.filters[0].sprite = e;
  }
  get inverse() {
    return this.filters[0].inverse;
  }
  set inverse(e) {
    this.filters[0].inverse = e;
  }
}
class ve {
  constructor(e) {
    this._activeMaskStage = [], this._renderer = e;
  }
  push(e, t, r) {
    const n = this._renderer;
    if (n.renderPipes.batch.break(r), r.add({
      renderPipeId: "alphaMask",
      action: "pushMaskBegin",
      mask: e,
      inverse: t._maskOptions.inverse,
      canBundle: !1,
      maskedContainer: t
    }), e.inverse = t._maskOptions.inverse, e.renderMaskToTexture) {
      const a = e.mask;
      a.includeInBuild = !0, P(
        a,
        r,
        n
      ), a.includeInBuild = !1;
    }
    n.renderPipes.batch.break(r), r.add({
      renderPipeId: "alphaMask",
      action: "pushMaskEnd",
      mask: e,
      maskedContainer: t,
      inverse: t._maskOptions.inverse,
      canBundle: !1
    });
  }
  pop(e, t, r) {
    this._renderer.renderPipes.batch.break(r), r.add({
      renderPipeId: "alphaMask",
      action: "popMaskEnd",
      mask: e,
      inverse: t._maskOptions.inverse,
      canBundle: !1
    });
  }
  execute(e) {
    const t = this._renderer, r = e.mask.renderMaskToTexture;
    if (e.action === "pushMaskBegin") {
      const n = b.get(ut);
      if (n.inverse = e.inverse, r) {
        e.mask.mask.measurable = !0;
        const a = Ve(e.mask.mask, !0, dt);
        e.mask.mask.measurable = !1, a.ceil();
        const i = t.renderTarget.renderTarget.colorTexture.source, o = Y.getOptimalTexture(
          a.width,
          a.height,
          i._resolution,
          i.antialias
        );
        t.renderTarget.push(o, !0), t.globalUniforms.push({
          offset: a,
          worldColor: 4294967295
        });
        const l = n.sprite;
        l.texture = o, l.worldTransform.tx = a.minX, l.worldTransform.ty = a.minY, this._activeMaskStage.push({
          filterEffect: n,
          maskedContainer: e.maskedContainer,
          filterTexture: o
        });
      } else
        n.sprite = e.mask.mask, this._activeMaskStage.push({
          filterEffect: n,
          maskedContainer: e.maskedContainer
        });
    } else if (e.action === "pushMaskEnd") {
      const n = this._activeMaskStage[this._activeMaskStage.length - 1];
      r && (t.type === D.WEBGL && t.renderTarget.finishRenderPass(), t.renderTarget.pop(), t.globalUniforms.pop()), t.filter.push({
        renderPipeId: "filter",
        action: "pushFilter",
        container: n.maskedContainer,
        filterEffect: n.filterEffect,
        canBundle: !1
      });
    } else if (e.action === "popMaskEnd") {
      t.filter.pop();
      const n = this._activeMaskStage.pop();
      r && Y.returnTexture(n.filterTexture), b.return(n.filterEffect);
    }
  }
  destroy() {
    this._renderer = null, this._activeMaskStage = null;
  }
}
ve.extension = {
  type: [
    u.WebGLPipes,
    u.WebGPUPipes,
    u.CanvasPipes
  ],
  name: "alphaMask"
};
class xe {
  constructor(e) {
    this._colorStack = [], this._colorStackIndex = 0, this._currentColor = 0, this._renderer = e;
  }
  buildStart() {
    this._colorStack[0] = 15, this._colorStackIndex = 1, this._currentColor = 15;
  }
  push(e, t, r) {
    this._renderer.renderPipes.batch.break(r);
    const a = this._colorStack;
    a[this._colorStackIndex] = a[this._colorStackIndex - 1] & e.mask;
    const i = this._colorStack[this._colorStackIndex];
    i !== this._currentColor && (this._currentColor = i, r.add({
      renderPipeId: "colorMask",
      colorMask: i,
      canBundle: !1
    })), this._colorStackIndex++;
  }
  pop(e, t, r) {
    this._renderer.renderPipes.batch.break(r);
    const a = this._colorStack;
    this._colorStackIndex--;
    const i = a[this._colorStackIndex - 1];
    i !== this._currentColor && (this._currentColor = i, r.add({
      renderPipeId: "colorMask",
      colorMask: i,
      canBundle: !1
    }));
  }
  execute(e) {
    this._renderer.colorMask.setMask(e.colorMask);
  }
  destroy() {
    this._colorStack = null;
  }
}
xe.extension = {
  type: [
    u.WebGLPipes,
    u.WebGPUPipes,
    u.CanvasPipes
  ],
  name: "colorMask"
};
class _e {
  constructor(e) {
    this._maskStackHash = {}, this._maskHash = /* @__PURE__ */ new WeakMap(), this._renderer = e;
  }
  push(e, t, r) {
    var n;
    const a = e, i = this._renderer;
    i.renderPipes.batch.break(r), i.renderPipes.blendMode.setBlendMode(a.mask, "none", r), r.add({
      renderPipeId: "stencilMask",
      action: "pushMaskBegin",
      mask: e,
      inverse: t._maskOptions.inverse,
      canBundle: !1
    });
    const o = a.mask;
    o.includeInBuild = !0, this._maskHash.has(a) || this._maskHash.set(a, {
      instructionsStart: 0,
      instructionsLength: 0
    });
    const l = this._maskHash.get(a);
    l.instructionsStart = r.instructionSize, P(
      o,
      r,
      i
    ), o.includeInBuild = !1, i.renderPipes.batch.break(r), r.add({
      renderPipeId: "stencilMask",
      action: "pushMaskEnd",
      mask: e,
      inverse: t._maskOptions.inverse,
      canBundle: !1
    });
    const d = r.instructionSize - l.instructionsStart - 1;
    l.instructionsLength = d;
    const c = i.renderTarget.renderTarget.uid;
    (n = this._maskStackHash)[c] ?? (n[c] = 0);
  }
  pop(e, t, r) {
    const n = e, a = this._renderer;
    a.renderPipes.batch.break(r), a.renderPipes.blendMode.setBlendMode(n.mask, "none", r), r.add({
      renderPipeId: "stencilMask",
      action: "popMaskBegin",
      inverse: t._maskOptions.inverse,
      canBundle: !1
    });
    const i = this._maskHash.get(e);
    for (let o = 0; o < i.instructionsLength; o++)
      r.instructions[r.instructionSize++] = r.instructions[i.instructionsStart++];
    r.add({
      renderPipeId: "stencilMask",
      action: "popMaskEnd",
      canBundle: !1
    });
  }
  execute(e) {
    var t;
    const r = this._renderer, n = r.renderTarget.renderTarget.uid;
    let a = (t = this._maskStackHash)[n] ?? (t[n] = 0);
    e.action === "pushMaskBegin" ? (r.renderTarget.ensureDepthStencil(), r.stencil.setStencilMode(f.RENDERING_MASK_ADD, a), a++, r.colorMask.setMask(0)) : e.action === "pushMaskEnd" ? (e.inverse ? r.stencil.setStencilMode(f.INVERSE_MASK_ACTIVE, a) : r.stencil.setStencilMode(f.MASK_ACTIVE, a), r.colorMask.setMask(15)) : e.action === "popMaskBegin" ? (r.colorMask.setMask(0), a !== 0 ? r.stencil.setStencilMode(f.RENDERING_MASK_REMOVE, a) : (r.renderTarget.clear(null, B.STENCIL), r.stencil.setStencilMode(f.DISABLED, a)), a--) : e.action === "popMaskEnd" && (e.inverse ? r.stencil.setStencilMode(f.INVERSE_MASK_ACTIVE, a) : r.stencil.setStencilMode(f.MASK_ACTIVE, a), r.colorMask.setMask(15)), this._maskStackHash[n] = a;
  }
  destroy() {
    this._renderer = null, this._maskStackHash = null, this._maskHash = null;
  }
}
_e.extension = {
  type: [
    u.WebGLPipes,
    u.WebGPUPipes,
    u.CanvasPipes
  ],
  name: "stencilMask"
};
function Ft(s, e) {
  for (const t in s.attributes) {
    const r = s.attributes[t], n = e[t];
    n ? (r.format ?? (r.format = n.format), r.offset ?? (r.offset = n.offset), r.instance ?? (r.instance = n.instance)) : ie(`Attribute ${t} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`);
  }
  ct(s);
}
function ct(s) {
  const { buffers: e, attributes: t } = s, r = {}, n = {};
  for (const a in e) {
    const i = e[a];
    r[i.uid] = 0, n[i.uid] = 0;
  }
  for (const a in t) {
    const i = t[a];
    r[i.buffer.uid] += N(i.format).stride;
  }
  for (const a in t) {
    const i = t[a];
    i.stride ?? (i.stride = r[i.buffer.uid]), i.start ?? (i.start = n[i.buffer.uid]), n[i.buffer.uid] += N(i.format).stride;
  }
}
const x = [];
x[f.NONE] = void 0;
x[f.DISABLED] = {
  stencilWriteMask: 0,
  stencilReadMask: 0
};
x[f.RENDERING_MASK_ADD] = {
  stencilFront: {
    compare: "equal",
    passOp: "increment-clamp"
  },
  stencilBack: {
    compare: "equal",
    passOp: "increment-clamp"
  }
};
x[f.RENDERING_MASK_REMOVE] = {
  stencilFront: {
    compare: "equal",
    passOp: "decrement-clamp"
  },
  stencilBack: {
    compare: "equal",
    passOp: "decrement-clamp"
  }
};
x[f.MASK_ACTIVE] = {
  stencilWriteMask: 0,
  stencilFront: {
    compare: "equal",
    passOp: "keep"
  },
  stencilBack: {
    compare: "equal",
    passOp: "keep"
  }
};
x[f.INVERSE_MASK_ACTIVE] = {
  stencilWriteMask: 0,
  stencilFront: {
    compare: "not-equal",
    passOp: "replace"
  },
  stencilBack: {
    compare: "not-equal",
    passOp: "replace"
  }
};
class Ht {
  constructor(e) {
    this._syncFunctionHash = /* @__PURE__ */ Object.create(null), this._adaptor = e, this._systemCheck();
  }
  /**
   * Overridable function by `pixi.js/unsafe-eval` to silence
   * throwing an error if platform doesn't support unsafe-evals.
   * @private
   */
  _systemCheck() {
    if (!Ne())
      throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
  }
  ensureUniformGroup(e) {
    const t = this.getUniformGroupData(e);
    e.buffer || (e.buffer = new $({
      data: new Float32Array(t.layout.size / 4),
      usage: T.UNIFORM | T.COPY_DST
    }));
  }
  getUniformGroupData(e) {
    return this._syncFunctionHash[e._signature] || this._initUniformGroup(e);
  }
  _initUniformGroup(e) {
    const t = e._signature;
    let r = this._syncFunctionHash[t];
    if (!r) {
      const n = Object.keys(e.uniformStructures).map((o) => e.uniformStructures[o]), a = this._adaptor.createUboElements(n), i = this._generateUboSync(a.uboElements);
      r = this._syncFunctionHash[t] = {
        layout: a,
        syncFunction: i
      };
    }
    return this._syncFunctionHash[t];
  }
  _generateUboSync(e) {
    return this._adaptor.generateUboSync(e);
  }
  syncUniformGroup(e, t, r) {
    const n = this.getUniformGroupData(e);
    return e.buffer || (e.buffer = new $({
      data: new Float32Array(n.layout.size / 4),
      usage: T.UNIFORM | T.COPY_DST
    })), t || (t = e.buffer.data), r || (r = 0), n.syncFunction(e.uniforms, t, r), !0;
  }
  updateUniformGroup(e) {
    if (e.isStatic && !e._dirtyId)
      return !1;
    e._dirtyId = 0;
    const t = this.syncUniformGroup(e);
    return e.buffer.update(), t;
  }
  destroy() {
    this._syncFunctionHash = null;
  }
}
const k = [
  // uploading pixi matrix object to mat3
  {
    type: "mat3x3<f32>",
    test: (s) => s.value.a !== void 0,
    ubo: `
            var matrix = uv[name].toArray(true);
            data[offset] = matrix[0];
            data[offset + 1] = matrix[1];
            data[offset + 2] = matrix[2];
            data[offset + 4] = matrix[3];
            data[offset + 5] = matrix[4];
            data[offset + 6] = matrix[5];
            data[offset + 8] = matrix[6];
            data[offset + 9] = matrix[7];
            data[offset + 10] = matrix[8];
        `,
    uniform: `
            gl.uniformMatrix3fv(ud[name].location, false, uv[name].toArray(true));
        `
  },
  // uploading a pixi rectangle as a vec4
  {
    type: "vec4<f32>",
    test: (s) => s.type === "vec4<f32>" && s.size === 1 && s.value.width !== void 0,
    ubo: `
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
            data[offset + 2] = v.width;
            data[offset + 3] = v.height;
        `,
    uniform: `
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {
                cv[0] = v.x;
                cv[1] = v.y;
                cv[2] = v.width;
                cv[3] = v.height;
                gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);
            }
        `
  },
  // uploading a pixi point as a vec2
  {
    type: "vec2<f32>",
    test: (s) => s.type === "vec2<f32>" && s.size === 1 && s.value.x !== void 0,
    ubo: `
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
        `,
    uniform: `
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y) {
                cv[0] = v.x;
                cv[1] = v.y;
                gl.uniform2f(ud[name].location, v.x, v.y);
            }
        `
  },
  // uploading a pixi color as a vec4
  {
    type: "vec4<f32>",
    test: (s) => s.type === "vec4<f32>" && s.size === 1 && s.value.red !== void 0,
    ubo: `
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
            data[offset + 3] = v.alpha;
        `,
    uniform: `
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                cv[3] = v.alpha;
                gl.uniform4f(ud[name].location, v.red, v.green, v.blue, v.alpha);
            }
        `
  },
  // uploading a pixi color as a vec3
  {
    type: "vec3<f32>",
    test: (s) => s.type === "vec3<f32>" && s.size === 1 && s.value.red !== void 0,
    ubo: `
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
        `,
    uniform: `
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                gl.uniform3f(ud[name].location, v.red, v.green, v.blue);
            }
        `
  }
];
function Lt(s, e, t, r) {
  const n = [`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `];
  let a = 0;
  for (let o = 0; o < s.length; o++) {
    const l = s[o], d = l.data.name;
    let c = !1, h = 0;
    for (let p = 0; p < k.length; p++)
      if (k[p].test(l.data)) {
        h = l.offset / 4, n.push(
          `name = "${d}";`,
          `offset += ${h - a};`,
          k[p][e] || k[p].ubo
        ), c = !0;
        break;
      }
    if (!c)
      if (l.data.size > 1)
        h = l.offset / 4, n.push(t(l, h - a));
      else {
        const p = r[l.data.type];
        h = l.offset / 4, n.push(
          /* wgsl */
          `
                    v = uv.${d};
                    offset += ${h - a};
                    ${p};
                `
        );
      }
    a = h;
  }
  const i = n.join(`
`);
  return new Function(
    "uv",
    "data",
    "offset",
    i
  );
}
function v(s, e) {
  return `
        for (let i = 0; i < ${s * e}; i++) {
            data[offset + (((i / ${s})|0) * 4) + (i % ${s})] = v[i];
        }
    `;
}
const ht = {
  f32: `
        data[offset] = v;`,
  i32: `
        data[offset] = v;`,
  "vec2<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];`,
  "vec3<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];`,
  "vec4<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];`,
  "mat2x2<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 4] = v[2];
        data[offset + 5] = v[3];`,
  "mat3x3<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];`,
  "mat4x4<f32>": `
        for (let i = 0; i < 16; i++) {
            data[offset + i] = v[i];
        }`,
  "mat3x2<f32>": v(3, 2),
  "mat4x2<f32>": v(4, 2),
  "mat2x3<f32>": v(2, 3),
  "mat4x3<f32>": v(4, 3),
  "mat2x4<f32>": v(2, 4),
  "mat3x4<f32>": v(3, 4)
}, Wt = {
  ...ht,
  "mat2x2<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `
};
function ft(s, e, t, r, n, a) {
  const i = a ? 1 : -1;
  return s.identity(), s.a = 1 / r * 2, s.d = i * (1 / n * 2), s.tx = -1 - e * s.a, s.ty = -i - t * s.d, s;
}
const _ = /* @__PURE__ */ new Map();
function be(s, e) {
  if (!_.has(s)) {
    const t = new m({
      source: new U({
        resource: s,
        ...e
      })
    }), r = () => {
      _.get(s) === t && _.delete(s);
    };
    t.once("destroy", r), t.source.once("destroy", r), _.set(s, t);
  }
  return _.get(s);
}
function pt(s) {
  const e = s.colorTexture.source.resource;
  return globalThis.HTMLCanvasElement && e instanceof HTMLCanvasElement && document.body.contains(e);
}
const ye = class Te {
  /**
   * @param [descriptor] - Options for creating a render target.
   */
  constructor(e = {}) {
    if (this.uid = M("renderTarget"), this.colorTextures = [], this.dirtyId = 0, this.isRoot = !1, this._size = new Float32Array(2), this._managedColorTextures = !1, e = { ...Te.defaultOptions, ...e }, this.stencil = e.stencil, this.depth = e.depth, this.isRoot = e.isRoot, typeof e.colorTextures == "number") {
      this._managedColorTextures = !0;
      for (let t = 0; t < e.colorTextures; t++)
        this.colorTextures.push(
          new C({
            width: e.width,
            height: e.height,
            resolution: e.resolution,
            antialias: e.antialias
          })
        );
    } else {
      this.colorTextures = [...e.colorTextures.map((r) => r.source)];
      const t = this.colorTexture.source;
      this.resize(t.width, t.height, t._resolution);
    }
    this.colorTexture.source.on("resize", this.onSourceResize, this), (e.depthStencilTexture || this.stencil) && (e.depthStencilTexture instanceof m || e.depthStencilTexture instanceof C ? this.depthStencilTexture = e.depthStencilTexture.source : this.ensureDepthStencilTexture());
  }
  get size() {
    const e = this._size;
    return e[0] = this.pixelWidth, e[1] = this.pixelHeight, e;
  }
  get width() {
    return this.colorTexture.source.width;
  }
  get height() {
    return this.colorTexture.source.height;
  }
  get pixelWidth() {
    return this.colorTexture.source.pixelWidth;
  }
  get pixelHeight() {
    return this.colorTexture.source.pixelHeight;
  }
  get resolution() {
    return this.colorTexture.source._resolution;
  }
  get colorTexture() {
    return this.colorTextures[0];
  }
  onSourceResize(e) {
    this.resize(e.width, e.height, e._resolution, !0);
  }
  /**
   * This will ensure a depthStencil texture is created for this render target.
   * Most likely called by the mask system to make sure we have stencil buffer added.
   * @internal
   * @ignore
   */
  ensureDepthStencilTexture() {
    this.depthStencilTexture || (this.depthStencilTexture = new C({
      width: this.width,
      height: this.height,
      resolution: this.resolution,
      format: "depth24plus-stencil8",
      autoGenerateMipmaps: !1,
      antialias: !1,
      mipLevelCount: 1
      // sampleCount: handled by the render target system..
    }));
  }
  resize(e, t, r = this.resolution, n = !1) {
    this.dirtyId++, this.colorTextures.forEach((a, i) => {
      n && i === 0 || a.source.resize(e, t, r);
    }), this.depthStencilTexture && this.depthStencilTexture.source.resize(e, t, r);
  }
  destroy() {
    this.colorTexture.source.off("resize", this.onSourceResize, this), this._managedColorTextures && this.colorTextures.forEach((e) => {
      e.destroy();
    }), this.depthStencilTexture && (this.depthStencilTexture.destroy(), delete this.depthStencilTexture);
  }
};
ye.defaultOptions = {
  /** the width of the RenderTarget */
  width: 0,
  /** the height of the RenderTarget */
  height: 0,
  /** the resolution of the RenderTarget */
  resolution: 1,
  /** an array of textures, or a number indicating how many color textures there should be */
  colorTextures: 1,
  /** should this render target have a stencil buffer? */
  stencil: !1,
  /** should this render target have a depth buffer? */
  depth: !1,
  /** should this render target be antialiased? */
  antialias: !1,
  // save on perf by default!
  /** is this a root element, true if this is gl context owners render target */
  isRoot: !1
};
let I = ye;
class zt {
  constructor(e) {
    this.rootViewPort = new S(), this.viewport = new S(), this.onRenderTargetChange = new $e("onRenderTargetChange"), this.projectionMatrix = new g(), this.defaultClearColor = [0, 0, 0, 0], this._renderSurfaceToRenderTargetHash = /* @__PURE__ */ new Map(), this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null), this._renderTargetStack = [], this._renderer = e, e.renderableGC.addManagedHash(this, "_gpuRenderTargetHash");
  }
  /** called when dev wants to finish a render pass */
  finishRenderPass() {
    this.adaptor.finishRenderPass(this.renderTarget);
  }
  /**
   * called when the renderer starts to render a scene.
   * @param options
   * @param options.target - the render target to render to
   * @param options.clear - the clear mode to use. Can be true or a CLEAR number 'COLOR | DEPTH | STENCIL' 0b111
   * @param options.clearColor - the color to clear to
   * @param options.frame - the frame to render to
   */
  renderStart({
    target: e,
    clear: t,
    clearColor: r,
    frame: n
  }) {
    this._renderTargetStack.length = 0, this.push(
      e,
      t,
      r,
      n
    ), this.rootViewPort.copyFrom(this.viewport), this.rootRenderTarget = this.renderTarget, this.renderingToScreen = pt(this.rootRenderTarget);
  }
  postrender() {
    var e, t;
    (t = (e = this.adaptor).postrender) == null || t.call(e, this.rootRenderTarget);
  }
  /**
   * Binding a render surface! This is the main function of the render target system.
   * It will take the RenderSurface (which can be a texture, canvas, or render target) and bind it to the renderer.
   * Once bound all draw calls will be rendered to the render surface.
   *
   * If a frame is not provide and the render surface is a texture, the frame of the texture will be used.
   * @param renderSurface - the render surface to bind
   * @param clear - the clear mode to use. Can be true or a CLEAR number 'COLOR | DEPTH | STENCIL' 0b111
   * @param clearColor - the color to clear to
   * @param frame - the frame to render to
   * @returns the render target that was bound
   */
  bind(e, t = !0, r, n) {
    const a = this.getRenderTarget(e), i = this.renderTarget !== a;
    this.renderTarget = a, this.renderSurface = e;
    const o = this.getGpuRenderTarget(a);
    (a.pixelWidth !== o.width || a.pixelHeight !== o.height) && (this.adaptor.resizeGpuRenderTarget(a), o.width = a.pixelWidth, o.height = a.pixelHeight);
    const l = a.colorTexture, d = this.viewport, c = l.pixelWidth, h = l.pixelHeight;
    if (!n && e instanceof m && (n = e.frame), n) {
      const p = l._resolution;
      d.x = n.x * p + 0.5 | 0, d.y = n.y * p + 0.5 | 0, d.width = n.width * p + 0.5 | 0, d.height = n.height * p + 0.5 | 0;
    } else
      d.x = 0, d.y = 0, d.width = c, d.height = h;
    return ft(
      this.projectionMatrix,
      0,
      0,
      d.width / l.resolution,
      d.height / l.resolution,
      !a.isRoot
    ), this.adaptor.startRenderPass(a, t, r, d), i && this.onRenderTargetChange.emit(a), a;
  }
  clear(e, t = B.ALL, r) {
    t && (e && (e = this.getRenderTarget(e)), this.adaptor.clear(
      e || this.renderTarget,
      t,
      r,
      this.viewport
    ));
  }
  contextChange() {
    this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null);
  }
  /**
   * Push a render surface to the renderer. This will bind the render surface to the renderer,
   * @param renderSurface - the render surface to push
   * @param clear - the clear mode to use. Can be true or a CLEAR number 'COLOR | DEPTH | STENCIL' 0b111
   * @param clearColor - the color to clear to
   * @param frame - the frame to use when rendering to the render surface
   */
  push(e, t = B.ALL, r, n) {
    const a = this.bind(e, t, r, n);
    return this._renderTargetStack.push({
      renderTarget: a,
      frame: n
    }), a;
  }
  /** Pops the current render target from the renderer and restores the previous render target. */
  pop() {
    this._renderTargetStack.pop();
    const e = this._renderTargetStack[this._renderTargetStack.length - 1];
    this.bind(e.renderTarget, !1, null, e.frame);
  }
  /**
   * Gets the render target from the provide render surface. Eg if its a texture,
   * it will return the render target for the texture.
   * If its a render target, it will return the same render target.
   * @param renderSurface - the render surface to get the render target for
   * @returns the render target for the render surface
   */
  getRenderTarget(e) {
    return e.isTexture && (e = e.source), this._renderSurfaceToRenderTargetHash.get(e) ?? this._initRenderTarget(e);
  }
  /**
   * Copies a render surface to another texture
   * @param sourceRenderSurfaceTexture - the render surface to copy from
   * @param destinationTexture - the texture to copy to
   * @param originSrc - the origin of the copy
   * @param originSrc.x - the x origin of the copy
   * @param originSrc.y - the y origin of the copy
   * @param size - the size of the copy
   * @param size.width - the width of the copy
   * @param size.height - the height of the copy
   * @param originDest - the destination origin (top left to paste from!)
   * @param originDest.x - the x origin of the paste
   * @param originDest.y - the y origin of the paste
   */
  copyToTexture(e, t, r, n, a) {
    r.x < 0 && (n.width += r.x, a.x -= r.x, r.x = 0), r.y < 0 && (n.height += r.y, a.y -= r.y, r.y = 0);
    const { pixelWidth: i, pixelHeight: o } = e;
    return n.width = Math.min(n.width, i - r.x), n.height = Math.min(n.height, o - r.y), this.adaptor.copyToTexture(
      e,
      t,
      r,
      n,
      a
    );
  }
  /**
   * ensures that we have a depth stencil buffer available to render to
   * This is used by the mask system to make sure we have a stencil buffer.
   */
  ensureDepthStencil() {
    this.renderTarget.stencil || (this.renderTarget.stencil = !0, this.adaptor.startRenderPass(this.renderTarget, !1, null, this.viewport));
  }
  /** nukes the render target system */
  destroy() {
    this._renderer = null, this._renderSurfaceToRenderTargetHash.forEach((e, t) => {
      e !== t && e.destroy();
    }), this._renderSurfaceToRenderTargetHash.clear(), this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null);
  }
  _initRenderTarget(e) {
    let t = null;
    return U.test(e) && (e = be(e).source), e instanceof I ? t = e : e instanceof C && (t = new I({
      colorTextures: [e]
    }), U.test(e.source.resource) && (t.isRoot = !0), e.once("destroy", () => {
      t.destroy(), this._renderSurfaceToRenderTargetHash.delete(e);
      const r = this._gpuRenderTargetHash[t.uid];
      r && (this._gpuRenderTargetHash[t.uid] = null, this.adaptor.destroyGpuRenderTarget(r));
    })), this._renderSurfaceToRenderTargetHash.set(e, t), t;
  }
  getGpuRenderTarget(e) {
    return this._gpuRenderTargetHash[e.uid] || (this._gpuRenderTargetHash[e.uid] = this.adaptor.initGpuRenderTarget(e));
  }
}
class Vt extends qe {
  /**
   * Create a new Buffer Resource.
   * @param options - The options for the buffer resource
   * @param options.buffer - The underlying buffer that this resource is using
   * @param options.offset - The offset of the buffer this resource is using.
   * If not provided, then it will use the offset of the buffer.
   * @param options.size - The size of the buffer this resource is using.
   * If not provided, then it will use the size of the buffer.
   */
  constructor({ buffer: e, offset: t, size: r }) {
    super(), this.uid = M("buffer"), this._resourceType = "bufferResource", this._touched = 0, this._resourceId = M("resource"), this._bufferResource = !0, this.destroyed = !1, this.buffer = e, this.offset = t | 0, this.size = r, this.buffer.on("change", this.onBufferChange, this);
  }
  onBufferChange() {
    this._resourceId = M("resource"), this.emit("change", this);
  }
  /**
   * Destroys this resource. Make sure the underlying buffer is not used anywhere else
   * if you want to destroy it as well, or code will explode
   * @param destroyBuffer - Should the underlying buffer be destroyed as well?
   */
  destroy(e = !1) {
    this.destroyed = !0, e && this.buffer.destroy(), this.emit("change", this), this.buffer = null;
  }
}
class ke {
  constructor(e) {
    this._renderer = e;
  }
  updateRenderable() {
  }
  destroyRenderable() {
  }
  validateRenderable() {
    return !1;
  }
  addRenderable(e, t) {
    this._renderer.renderPipes.batch.break(t), t.add(e);
  }
  execute(e) {
    e.isRenderable && e.render(this._renderer);
  }
  destroy() {
    this._renderer = null;
  }
}
ke.extension = {
  type: [
    u.WebGLPipes,
    u.WebGPUPipes,
    u.CanvasPipes
  ],
  name: "customRender"
};
function Me(s, e) {
  const t = s.instructionSet, r = t.instructions;
  for (let n = 0; n < t.instructionSize; n++) {
    const a = r[n];
    e[a.renderPipeId].execute(a);
  }
}
class Ce {
  constructor(e) {
    this._renderer = e;
  }
  addRenderGroup(e, t) {
    this._renderer.renderPipes.batch.break(t), t.add(e);
  }
  execute(e) {
    e.isRenderable && (this._renderer.globalUniforms.push({
      worldTransformMatrix: e.worldTransform,
      worldColor: e.worldColorAlpha
    }), Me(e, this._renderer.renderPipes), this._renderer.globalUniforms.pop());
  }
  destroy() {
    this._renderer = null;
  }
}
Ce.extension = {
  type: [
    u.WebGLPipes,
    u.WebGPUPipes,
    u.CanvasPipes
  ],
  name: "renderGroup"
};
function F(s, e) {
  e || (e = 0);
  for (let t = e; t < s.length && s[t]; t++)
    s[t] = null;
}
function Se(s, e = []) {
  e.push(s);
  for (let t = 0; t < s.renderGroupChildren.length; t++)
    Se(s.renderGroupChildren[t], e);
  return e;
}
function mt(s, e, t) {
  const r = s >> 16 & 255, n = s >> 8 & 255, a = s & 255, i = e >> 16 & 255, o = e >> 8 & 255, l = e & 255, d = r + (i - r) * t, c = n + (o - n) * t, h = a + (l - a) * t;
  return (d << 16) + (c << 8) + h;
}
const R = 16777215;
function we(s, e) {
  return s === R || e === R ? s + e - R : mt(s, e, 0.5);
}
const gt = new w(), X = de | oe | le;
function Pe(s, e = !1) {
  vt(s);
  const t = s.childrenToUpdate, r = s.updateTick++;
  for (const n in t) {
    const a = Number(n), i = t[n], o = i.list, l = i.index;
    for (let d = 0; d < l; d++) {
      const c = o[d];
      c.parentRenderGroup === s && c.relativeRenderGroupDepth === a && Re(c, r, 0);
    }
    F(o, l), i.index = 0;
  }
  if (e)
    for (let n = 0; n < s.renderGroupChildren.length; n++)
      Pe(s.renderGroupChildren[n], e);
}
function vt(s) {
  const e = s.root;
  let t;
  if (s.renderGroupParent) {
    const r = s.renderGroupParent;
    s.worldTransform.appendFrom(
      e.relativeGroupTransform,
      r.worldTransform
    ), s.worldColor = we(
      e.groupColor,
      r.worldColor
    ), t = e.groupAlpha * r.worldAlpha;
  } else
    s.worldTransform.copyFrom(e.localTransform), s.worldColor = e.localColor, t = e.localAlpha;
  t = t < 0 ? 0 : t > 1 ? 1 : t, s.worldAlpha = t, s.worldColorAlpha = s.worldColor + ((t * 255 | 0) << 24);
}
function Re(s, e, t) {
  if (e === s.updateTick)
    return;
  s.updateTick = e, s.didChange = !1;
  const r = s.localTransform;
  s.updateLocalTransform();
  const n = s.parent;
  if (n && !n.renderGroup ? (t = t | s._updateFlags, s.relativeGroupTransform.appendFrom(
    r,
    n.relativeGroupTransform
  ), t & X && Q(s, n, t)) : (t = s._updateFlags, s.relativeGroupTransform.copyFrom(r), t & X && Q(s, gt, t)), !s.renderGroup) {
    const a = s.children, i = a.length;
    for (let d = 0; d < i; d++)
      Re(a[d], e, t);
    const o = s.parentRenderGroup, l = s;
    l.renderPipeId && !o.structureDidChange && o.updateRenderable(l);
  }
}
function Q(s, e, t) {
  if (t & oe) {
    s.groupColor = we(
      s.localColor,
      e.groupColor
    );
    let r = s.localAlpha * e.groupAlpha;
    r = r < 0 ? 0 : r > 1 ? 1 : r, s.groupAlpha = r, s.groupColorAlpha = s.groupColor + ((r * 255 | 0) << 24);
  }
  t & le && (s.groupBlendMode = s.localBlendMode === "inherit" ? e.groupBlendMode : s.localBlendMode), t & de && (s.globalDisplayStatus = s.localDisplayStatus & e.globalDisplayStatus), s._updateFlags = 0;
}
function xt(s, e) {
  const { list: t, index: r } = s.childrenRenderablesToUpdate;
  let n = !1;
  for (let a = 0; a < r; a++) {
    const i = t[a];
    if (n = e[i.renderPipeId].validateRenderable(i), n)
      break;
  }
  return s.structureDidChange = n, n;
}
const _t = new g();
class Ge {
  constructor(e) {
    this._renderer = e;
  }
  render({ container: e, transform: t }) {
    e.isRenderGroup = !0;
    const r = e.parent, n = e.renderGroup.renderGroupParent;
    e.parent = null, e.renderGroup.renderGroupParent = null;
    const a = this._renderer, i = Se(e.renderGroup, []);
    let o = _t;
    t && (o = o.copyFrom(e.renderGroup.localTransform), e.renderGroup.localTransform.copyFrom(t));
    const l = a.renderPipes;
    for (let d = 0; d < i.length; d++) {
      const c = i[d];
      c.runOnRender(), c.instructionSet.renderPipes = l, c.structureDidChange ? F(c.childrenRenderablesToUpdate.list, 0) : xt(c, l), Pe(c), c.structureDidChange ? (c.structureDidChange = !1, ot(c, a)) : bt(c), c.childrenRenderablesToUpdate.index = 0, a.renderPipes.batch.upload(c.instructionSet);
    }
    a.globalUniforms.start({
      worldTransformMatrix: t ? e.renderGroup.localTransform : e.renderGroup.worldTransform,
      worldColor: e.renderGroup.worldColorAlpha
    }), Me(e.renderGroup, l), l.uniformBatch && l.uniformBatch.renderEnd(), t && e.renderGroup.localTransform.copyFrom(o), e.parent = r, e.renderGroup.renderGroupParent = n;
  }
  destroy() {
    this._renderer = null;
  }
}
Ge.extension = {
  type: [
    u.WebGLSystem,
    u.WebGPUSystem,
    u.CanvasSystem
  ],
  name: "renderGroup"
};
function bt(s) {
  const { list: e, index: t } = s.childrenRenderablesToUpdate;
  for (let r = 0; r < t; r++) {
    const n = e[r];
    n.didViewUpdate && s.updateRenderable(n);
  }
  F(e, t);
}
class Be {
  constructor(e) {
    this._gpuSpriteHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_gpuSpriteHash");
  }
  addRenderable(e, t) {
    const r = this._getGpuSprite(e);
    e.didViewUpdate && this._updateBatchableSprite(e, r), this._renderer.renderPipes.batch.addToBatch(r, t);
  }
  updateRenderable(e) {
    const t = this._gpuSpriteHash[e.uid];
    e.didViewUpdate && this._updateBatchableSprite(e, t), t._batcher.updateElement(t);
  }
  validateRenderable(e) {
    const t = e._texture, r = this._getGpuSprite(e);
    return r.texture._source !== t._source ? !r._batcher.checkAndUpdateTexture(r, t) : !1;
  }
  destroyRenderable(e) {
    const t = this._gpuSpriteHash[e.uid];
    b.return(t), this._gpuSpriteHash[e.uid] = null, e.off("destroyed", this._destroyRenderableBound);
  }
  _updateBatchableSprite(e, t) {
    t.bounds = e.bounds, t.texture = e._texture;
  }
  _getGpuSprite(e) {
    return this._gpuSpriteHash[e.uid] || this._initGPUSprite(e);
  }
  _initGPUSprite(e) {
    const t = b.get(tt);
    return t.renderable = e, t.transform = e.groupTransform, t.texture = e._texture, t.bounds = e.bounds, t.roundPixels = this._renderer._roundPixels | e._roundPixels, this._gpuSpriteHash[e.uid] = t, e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuSpriteHash)
      b.return(this._gpuSpriteHash[e]);
    this._gpuSpriteHash = null, this._renderer = null;
  }
}
Be.extension = {
  type: [
    u.WebGLPipes,
    u.WebGPUPipes,
    u.CanvasPipes
  ],
  name: "sprite"
};
const H = class Ue {
  constructor() {
    this.clearBeforeRender = !0, this._backgroundColor = new ue(0), this.color = this._backgroundColor, this.alpha = 1;
  }
  /**
   * initiates the background system
   * @param options - the options for the background colors
   */
  init(e) {
    e = { ...Ue.defaultOptions, ...e }, this.clearBeforeRender = e.clearBeforeRender, this.color = e.background || e.backgroundColor || this._backgroundColor, this.alpha = e.backgroundAlpha, this._backgroundColor.setAlpha(e.backgroundAlpha);
  }
  /** The background color to fill if not transparent */
  get color() {
    return this._backgroundColor;
  }
  set color(e) {
    this._backgroundColor.setValue(e);
  }
  /** The background color alpha. Setting this to 0 will make the canvas transparent. */
  get alpha() {
    return this._backgroundColor.alpha;
  }
  set alpha(e) {
    this._backgroundColor.setAlpha(e);
  }
  /** The background color as an [R, G, B, A] array. */
  get colorRgba() {
    return this._backgroundColor.toArray();
  }
  /**
   * destroys the background system
   * @internal
   * @ignore
   */
  destroy() {
  }
};
H.extension = {
  type: [
    u.WebGLSystem,
    u.WebGPUSystem,
    u.CanvasSystem
  ],
  name: "background",
  priority: 0
};
H.defaultOptions = {
  /**
   * {@link WebGLOptions.backgroundAlpha}
   * @default 1
   */
  backgroundAlpha: 1,
  /**
   * {@link WebGLOptions.backgroundColor}
   * @default 0x000000
   */
  backgroundColor: 0,
  /**
   * {@link WebGLOptions.clearBeforeRender}
   * @default true
   */
  clearBeforeRender: !0
};
let yt = H;
const y = {};
E.handle(u.BlendMode, (s) => {
  if (!s.name)
    throw new Error("BlendMode extension must have a name property");
  y[s.name] = s.ref;
}, (s) => {
  delete y[s.name];
});
class Ae {
  constructor(e) {
    this._isAdvanced = !1, this._filterHash = /* @__PURE__ */ Object.create(null), this._renderer = e;
  }
  /**
   * This ensures that a blendMode switch is added to the instruction set if the blend mode has changed.
   * @param renderable - The renderable we are adding to the instruction set
   * @param blendMode - The blend mode of the renderable
   * @param instructionSet - The instruction set we are adding to
   */
  setBlendMode(e, t, r) {
    if (this._activeBlendMode === t) {
      this._isAdvanced && this._renderableList.push(e);
      return;
    }
    this._activeBlendMode = t, this._isAdvanced && this._endAdvancedBlendMode(r), this._isAdvanced = !!y[t], this._isAdvanced && (this._beginAdvancedBlendMode(r), this._renderableList.push(e));
  }
  _beginAdvancedBlendMode(e) {
    this._renderer.renderPipes.batch.break(e);
    const t = this._activeBlendMode;
    if (!y[t]) {
      ie(`Unable to assign BlendMode: '${t}'. You may want to include: import 'pixi.js/advanced-blend-modes'`);
      return;
    }
    let r = this._filterHash[t];
    r || (r = this._filterHash[t] = new ae(), r.filters = [new y[t]()]);
    const n = {
      renderPipeId: "filter",
      action: "pushFilter",
      renderables: [],
      filterEffect: r,
      canBundle: !1
    };
    this._renderableList = n.renderables, e.add(n);
  }
  _endAdvancedBlendMode(e) {
    this._renderableList = null, this._renderer.renderPipes.batch.break(e), e.add({
      renderPipeId: "filter",
      action: "popFilter",
      canBundle: !1
    });
  }
  /**
   * called when the instruction build process is starting this will reset internally to the default blend mode
   * @internal
   * @ignore
   */
  buildStart() {
    this._isAdvanced = !1;
  }
  /**
   * called when the instruction build process is finished, ensuring that if there is an advanced blend mode
   * active, we add the final render instructions added to the instruction set
   * @param instructionSet - The instruction set we are adding to
   * @internal
   * @ignore
   */
  buildEnd(e) {
    this._isAdvanced && this._endAdvancedBlendMode(e);
  }
  /**
   * @internal
   * @ignore
   */
  destroy() {
    this._renderer = null, this._renderableList = null;
    for (const e in this._filterHash)
      this._filterHash[e].destroy();
    this._filterHash = null;
  }
}
Ae.extension = {
  type: [
    u.WebGLPipes,
    u.WebGPUPipes,
    u.CanvasPipes
  ],
  name: "blendMode"
};
const G = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp"
}, L = class Ie {
  /** @param renderer - The renderer this System works for. */
  constructor(e) {
    this._renderer = e;
  }
  _normalizeOptions(e, t = {}) {
    return e instanceof w || e instanceof m ? {
      target: e,
      ...t
    } : {
      ...t,
      ...e
    };
  }
  /**
   * Will return a HTML Image of the target
   * @param options - The options for creating the image, or the target to extract
   * @returns - HTML Image of the target
   */
  async image(e) {
    const t = new Image();
    return t.src = await this.base64(e), t;
  }
  /**
   * Will return a base64 encoded string of this target. It works by calling
   * `Extract.canvas` and then running toDataURL on that.
   * @param options - The options for creating the image, or the target to extract
   */
  async base64(e) {
    e = this._normalizeOptions(
      e,
      Ie.defaultImageOptions
    );
    const { format: t, quality: r } = e, n = this.canvas(e);
    if (n.toBlob !== void 0)
      return new Promise((a, i) => {
        n.toBlob((o) => {
          if (!o) {
            i(new Error("ICanvas.toBlob failed!"));
            return;
          }
          const l = new FileReader();
          l.onload = () => a(l.result), l.onerror = i, l.readAsDataURL(o);
        }, G[t], r);
      });
    if (n.toDataURL !== void 0)
      return n.toDataURL(G[t], r);
    if (n.convertToBlob !== void 0) {
      const a = await n.convertToBlob({ type: G[t], quality: r });
      return new Promise((i, o) => {
        const l = new FileReader();
        l.onload = () => i(l.result), l.onerror = o, l.readAsDataURL(a);
      });
    }
    throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented");
  }
  /**
   * Creates a Canvas element, renders this target to it and then returns it.
   * @param options - The options for creating the canvas, or the target to extract
   * @returns - A Canvas element with the texture rendered on.
   */
  canvas(e) {
    e = this._normalizeOptions(e);
    const t = e.target, r = this._renderer;
    if (t instanceof m)
      return r.texture.generateCanvas(t);
    const n = r.textureGenerator.generateTexture(e), a = r.texture.generateCanvas(n);
    return n.destroy(), a;
  }
  /**
   * Will return a one-dimensional array containing the pixel data of the entire texture in RGBA
   * order, with integer values between 0 and 255 (included).
   * @param options - The options for extracting the image, or the target to extract
   * @returns - One-dimensional array containing the pixel data of the entire texture
   */
  pixels(e) {
    e = this._normalizeOptions(e);
    const t = e.target, r = this._renderer, n = t instanceof m ? t : r.textureGenerator.generateTexture(e), a = r.texture.getPixels(n);
    return t instanceof w && n.destroy(), a;
  }
  /**
   * Will return a texture of the target
   * @param options - The options for creating the texture, or the target to extract
   * @returns - A texture of the target
   */
  texture(e) {
    return e = this._normalizeOptions(e), e.target instanceof m ? e.target : this._renderer.textureGenerator.generateTexture(e);
  }
  /**
   * Will extract a HTMLImage of the target and download it
   * @param options - The options for downloading and extracting the image, or the target to extract
   */
  download(e) {
    e = this._normalizeOptions(e);
    const t = this.canvas(e), r = document.createElement("a");
    r.download = e.filename ?? "image.png", r.href = t.toDataURL("image/png"), document.body.appendChild(r), r.click(), document.body.removeChild(r);
  }
  /**
   * Logs the target to the console as an image. This is a useful way to debug what's happening in the renderer.
   * @param options - The options for logging the image, or the target to log
   */
  log(e) {
    const t = e.width ?? 200;
    e = this._normalizeOptions(e);
    const r = this.canvas(e), n = r.toDataURL();
    console.log(`[Pixi Texture] ${r.width}px ${r.height}px`);
    const a = [
      "font-size: 1px;",
      `padding: ${t}px 300px;`,
      `background: url(${n}) no-repeat;`,
      "background-size: contain;"
    ].join(" ");
    console.log("%c ", a);
  }
  destroy() {
    this._renderer = null;
  }
};
L.extension = {
  type: [
    u.WebGLSystem,
    u.WebGPUSystem
  ],
  name: "extract"
};
L.defaultImageOptions = {
  /** The format of the image. */
  format: "png",
  /** The quality of the image. */
  quality: 1
};
let Tt = L;
const kt = new S(), Mt = new ne(), Ct = [0, 0, 0, 0];
class Ee {
  constructor(e) {
    this._renderer = e;
  }
  /**
   * A Useful function that returns a texture of the display object that can then be used to create sprites
   * This can be quite useful if your container is complicated and needs to be reused multiple times.
   * @param {GenerateTextureOptions | Container} options - Generate texture options.
   * @param {Container} [options.container] - If not given, the renderer's resolution is used.
   * @param {Rectangle} options.region - The region of the container, that shall be rendered,
   * @param {number} [options.resolution] - The resolution of the texture being generated.
   *        if no region is specified, defaults to the local bounds of the container.
   * @param {GenerateTextureSourceOptions} [options.textureSourceOptions] - Texture options for GPU.
   * @returns a shiny new texture of the container passed in
   */
  generateTexture(e) {
    var d;
    e instanceof w && (e = {
      target: e,
      frame: void 0,
      textureSourceOptions: {},
      resolution: void 0
    });
    const t = e.resolution || this._renderer.resolution, r = e.antialias || this._renderer.view.antialias, n = e.target;
    let a = e.clearColor;
    a ? a = Array.isArray(a) && a.length === 4 ? a : ue.shared.setValue(a).toArray() : a = Ct;
    const i = ((d = e.frame) == null ? void 0 : d.copyTo(kt)) || Ke(n, Mt).rectangle;
    i.width = Math.max(i.width, 1 / t) | 0, i.height = Math.max(i.height, 1 / t) | 0;
    const o = Ye.create({
      ...e.textureSourceOptions,
      width: i.width,
      height: i.height,
      resolution: t,
      antialias: r
    }), l = g.shared.translate(-i.x, -i.y);
    return this._renderer.render({
      container: n,
      transform: l,
      target: o,
      clearColor: a
    }), o.source.updateMipmaps(), o;
  }
  destroy() {
    this._renderer = null;
  }
}
Ee.extension = {
  type: [
    u.WebGLSystem,
    u.WebGPUSystem
  ],
  name: "textureGenerator"
};
class De {
  constructor(e) {
    this._stackIndex = 0, this._globalUniformDataStack = [], this._uniformsPool = [], this._activeUniforms = [], this._bindGroupPool = [], this._activeBindGroups = [], this._renderer = e;
  }
  reset() {
    this._stackIndex = 0;
    for (let e = 0; e < this._activeUniforms.length; e++)
      this._uniformsPool.push(this._activeUniforms[e]);
    for (let e = 0; e < this._activeBindGroups.length; e++)
      this._bindGroupPool.push(this._activeBindGroups[e]);
    this._activeUniforms.length = 0, this._activeBindGroups.length = 0;
  }
  start(e) {
    this.reset(), this.push(e);
  }
  bind({
    size: e,
    projectionMatrix: t,
    worldTransformMatrix: r,
    worldColor: n,
    offset: a
  }) {
    const i = this._renderer.renderTarget.renderTarget, o = this._stackIndex ? this._globalUniformDataStack[this._stackIndex - 1] : {
      projectionData: i,
      worldTransformMatrix: new g(),
      worldColor: 4294967295,
      offset: new Je()
    }, l = {
      projectionMatrix: t || this._renderer.renderTarget.projectionMatrix,
      resolution: e || i.size,
      worldTransformMatrix: r || o.worldTransformMatrix,
      worldColor: n || o.worldColor,
      offset: a || o.offset,
      bindGroup: null
    }, d = this._uniformsPool.pop() || this._createUniforms();
    this._activeUniforms.push(d);
    const c = d.uniforms;
    c.uProjectionMatrix = l.projectionMatrix, c.uResolution = l.resolution, c.uWorldTransformMatrix.copyFrom(l.worldTransformMatrix), c.uWorldTransformMatrix.tx -= l.offset.x, c.uWorldTransformMatrix.ty -= l.offset.y, rt(
      l.worldColor,
      c.uWorldColorAlpha,
      0
    ), d.update();
    let h;
    this._renderer.renderPipes.uniformBatch ? h = this._renderer.renderPipes.uniformBatch.getUniformBindGroup(d, !1) : (h = this._bindGroupPool.pop() || new Xe(), this._activeBindGroups.push(h), h.setResource(d, 0)), l.bindGroup = h, this._currentGlobalUniformData = l;
  }
  push(e) {
    this.bind(e), this._globalUniformDataStack[this._stackIndex++] = this._currentGlobalUniformData;
  }
  pop() {
    this._currentGlobalUniformData = this._globalUniformDataStack[--this._stackIndex - 1], this._renderer.type === D.WEBGL && this._currentGlobalUniformData.bindGroup.resources[0].update();
  }
  get bindGroup() {
    return this._currentGlobalUniformData.bindGroup;
  }
  get globalUniformData() {
    return this._currentGlobalUniformData;
  }
  get uniformGroup() {
    return this._currentGlobalUniformData.bindGroup.resources[0];
  }
  _createUniforms() {
    return new re({
      uProjectionMatrix: { value: new g(), type: "mat3x3<f32>" },
      uWorldTransformMatrix: { value: new g(), type: "mat3x3<f32>" },
      // TODO - someone smart - set this to be a unorm8x4 rather than a vec4<f32>
      uWorldColorAlpha: { value: new Float32Array(4), type: "vec4<f32>" },
      uResolution: { value: [0, 0], type: "vec2<f32>" }
    }, {
      isStatic: !0
    });
  }
  destroy() {
    this._renderer = null;
  }
}
De.extension = {
  type: [
    u.WebGLSystem,
    u.WebGPUSystem,
    u.CanvasSystem
  ],
  name: "globalUniforms"
};
let St = 1;
class Oe {
  constructor() {
    this._tasks = [], this._offset = 0;
  }
  /** Initializes the scheduler system and starts the ticker. */
  init() {
    q.system.add(this._update, this);
  }
  /**
   * Schedules a repeating task.
   * @param func - The function to execute.
   * @param duration - The interval duration in milliseconds.
   * @param useOffset - this will spread out tasks so that they do not all run at the same time
   * @returns The unique identifier for the scheduled task.
   */
  repeat(e, t, r = !0) {
    const n = St++;
    let a = 0;
    return r && (this._offset += 1e3, a = this._offset), this._tasks.push({
      func: e,
      duration: t,
      start: performance.now(),
      offset: a,
      last: performance.now(),
      repeat: !0,
      id: n
    }), n;
  }
  /**
   * Cancels a scheduled task.
   * @param id - The unique identifier of the task to cancel.
   */
  cancel(e) {
    for (let t = 0; t < this._tasks.length; t++)
      if (this._tasks[t].id === e) {
        this._tasks.splice(t, 1);
        return;
      }
  }
  /**
   * Updates and executes the scheduled tasks.
   * @private
   */
  _update() {
    const e = performance.now();
    for (let t = 0; t < this._tasks.length; t++) {
      const r = this._tasks[t];
      if (e - r.offset - r.last >= r.duration) {
        const n = e - r.start;
        r.func(n), r.last = e;
      }
    }
  }
  /**
   * Destroys the scheduler system and removes all tasks.
   * @internal
   * @ignore
   */
  destroy() {
    q.system.remove(this._update, this), this._tasks.length = 0;
  }
}
Oe.extension = {
  type: [
    u.WebGLSystem,
    u.WebGPUSystem,
    u.CanvasSystem
  ],
  name: "scheduler",
  priority: 0
};
let Z = !1;
function wt(s) {
  if (!Z) {
    if (ce.get().getNavigator().userAgent.toLowerCase().indexOf("chrome") > -1) {
      const e = [
        `%c  %c  %c  %c  %c PixiJS %c v${K} (${s}) http://www.pixijs.com/

`,
        "background: #E72264; padding:5px 0;",
        "background: #6CA2EA; padding:5px 0;",
        "background: #B5D33D; padding:5px 0;",
        "background: #FED23F; padding:5px 0;",
        "color: #FFFFFF; background: #E72264; padding:5px 0;",
        "color: #E72264; background: #FFFFFF; padding:5px 0;"
      ];
      globalThis.console.log(...e);
    } else globalThis.console && globalThis.console.log(`PixiJS ${K} - ${s} - http://www.pixijs.com/`);
    Z = !0;
  }
}
class W {
  constructor(e) {
    this._renderer = e;
  }
  /**
   * It all starts here! This initiates every system, passing in the options for any system by name.
   * @param options - the config for the renderer and all its systems
   */
  init(e) {
    if (e.hello) {
      let t = this._renderer.name;
      this._renderer.type === D.WEBGL && (t += ` ${this._renderer.context.webGLVersion}`), wt(t);
    }
  }
}
W.extension = {
  type: [
    u.WebGLSystem,
    u.WebGPUSystem,
    u.CanvasSystem
  ],
  name: "hello",
  priority: -2
};
W.defaultOptions = {
  /** {@link WebGLOptions.hello} */
  hello: !1
};
function Pt(s) {
  let e = !1;
  for (const r in s)
    if (s[r] == null) {
      e = !0;
      break;
    }
  if (!e)
    return s;
  const t = /* @__PURE__ */ Object.create(null);
  for (const r in s) {
    const n = s[r];
    n && (t[r] = n);
  }
  return t;
}
function Rt(s) {
  let e = 0;
  for (let t = 0; t < s.length; t++)
    s[t] == null ? e++ : s[t - e] = s[t];
  return s.length = s.length - e, s;
}
const z = class Fe {
  /** @param renderer - The renderer this System works for. */
  constructor(e) {
    this._managedRenderables = [], this._managedHashes = [], this._managedArrays = [], this._renderer = e;
  }
  init(e) {
    e = { ...Fe.defaultOptions, ...e }, this.maxUnusedTime = e.renderableGCMaxUnusedTime, this._frequency = e.renderableGCFrequency, this.enabled = e.renderableGCActive;
  }
  get enabled() {
    return !!this._handler;
  }
  set enabled(e) {
    this.enabled !== e && (e ? (this._handler = this._renderer.scheduler.repeat(
      () => this.run(),
      this._frequency,
      !1
    ), this._hashHandler = this._renderer.scheduler.repeat(
      () => {
        for (const t of this._managedHashes)
          t.context[t.hash] = Pt(t.context[t.hash]);
      },
      this._frequency
    ), this._arrayHandler = this._renderer.scheduler.repeat(
      () => {
        for (const t of this._managedArrays)
          Rt(t.context[t.hash]);
      },
      this._frequency
    )) : (this._renderer.scheduler.cancel(this._handler), this._renderer.scheduler.cancel(this._hashHandler), this._renderer.scheduler.cancel(this._arrayHandler)));
  }
  addManagedHash(e, t) {
    this._managedHashes.push({ context: e, hash: t });
  }
  addManagedArray(e, t) {
    this._managedArrays.push({ context: e, hash: t });
  }
  prerender() {
    this._now = performance.now();
  }
  addRenderable(e, t) {
    this.enabled && (e._lastUsed = this._now, e._lastInstructionTick === -1 && (this._managedRenderables.push(e), e.once("destroyed", this._removeRenderable, this)), e._lastInstructionTick = t.tick);
  }
  /** Runs the scheduled garbage collection */
  run() {
    var a;
    const e = performance.now(), t = this._managedRenderables, r = this._renderer.renderPipes;
    let n = 0;
    for (let i = 0; i < t.length; i++) {
      const o = t[i];
      if (o === null) {
        n++;
        continue;
      }
      const l = o.renderGroup ?? o.parentRenderGroup, d = ((a = l == null ? void 0 : l.instructionSet) == null ? void 0 : a.tick) ?? -1;
      o._lastInstructionTick !== d && e - o._lastUsed > this.maxUnusedTime ? (o.destroyed || r[o.renderPipeId].destroyRenderable(o), o._lastInstructionTick = -1, n++, o.off("destroyed", this._removeRenderable, this)) : t[i - n] = o;
    }
    t.length = t.length - n;
  }
  destroy() {
    this.enabled = !1, this._renderer = null, this._managedRenderables.length = 0, this._managedHashes.length = 0, this._managedArrays.length = 0;
  }
  _removeRenderable(e) {
    const t = this._managedRenderables.indexOf(e);
    t >= 0 && (e.off("destroyed", this._removeRenderable, this), this._managedRenderables[t] = null);
  }
};
z.extension = {
  type: [
    u.WebGLSystem,
    u.WebGPUSystem
  ],
  name: "renderableGC",
  priority: 0
};
z.defaultOptions = {
  /**
   * If set to true, this will enable the garbage collector on the GPU.
   * @default true
   */
  renderableGCActive: !0,
  /**
   * The maximum idle frames before a texture is destroyed by garbage collection.
   * @default 60 * 60
   */
  renderableGCMaxUnusedTime: 6e4,
  /**
   * Frames between two garbage collections.
   * @default 600
   */
  renderableGCFrequency: 3e4
};
let Gt = z;
const V = class He {
  /** @param renderer - The renderer this System works for. */
  constructor(e) {
    this._renderer = e, this.count = 0, this.checkCount = 0;
  }
  init(e) {
    e = { ...He.defaultOptions, ...e }, this.checkCountMax = e.textureGCCheckCountMax, this.maxIdle = e.textureGCAMaxIdle ?? e.textureGCMaxIdle, this.active = e.textureGCActive;
  }
  /**
   * Checks to see when the last time a texture was used.
   * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
   */
  postrender() {
    this._renderer.renderingToScreen && (this.count++, this.active && (this.checkCount++, this.checkCount > this.checkCountMax && (this.checkCount = 0, this.run())));
  }
  /**
   * Checks to see when the last time a texture was used.
   * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
   */
  run() {
    const e = this._renderer.texture.managedTextures;
    for (let t = 0; t < e.length; t++) {
      const r = e[t];
      r.autoGarbageCollect && r.resource && r._touched > -1 && this.count - r._touched > this.maxIdle && (r._touched = -1, r.unload());
    }
  }
  destroy() {
    this._renderer = null;
  }
};
V.extension = {
  type: [
    u.WebGLSystem,
    u.WebGPUSystem
  ],
  name: "textureGC"
};
V.defaultOptions = {
  /**
   * If set to true, this will enable the garbage collector on the GPU.
   * @default true
   */
  textureGCActive: !0,
  /**
   * @deprecated since 8.3.0
   * @see {@link TextureGCSystem.textureGCMaxIdle}
   */
  textureGCAMaxIdle: null,
  /**
   * The maximum idle frames before a texture is destroyed by garbage collection.
   * @default 60 * 60
   */
  textureGCMaxIdle: 60 * 60,
  /**
   * Frames between two garbage collections.
   * @default 600
   */
  textureGCCheckCountMax: 600
};
let Bt = V;
const j = class Le {
  /**
   * Whether CSS dimensions of canvas view should be resized to screen dimensions automatically.
   * @member {boolean}
   */
  get autoDensity() {
    return this.texture.source.autoDensity;
  }
  set autoDensity(e) {
    this.texture.source.autoDensity = e;
  }
  /** The resolution / device pixel ratio of the renderer. */
  get resolution() {
    return this.texture.source._resolution;
  }
  set resolution(e) {
    this.texture.source.resize(
      this.texture.source.width,
      this.texture.source.height,
      e
    );
  }
  /**
   * initiates the view system
   * @param options - the options for the view
   */
  init(e) {
    e = {
      ...Le.defaultOptions,
      ...e
    }, e.view && (Qe(Ze, "ViewSystem.view has been renamed to ViewSystem.canvas"), e.canvas = e.view), this.screen = new S(0, 0, e.width, e.height), this.canvas = e.canvas || ce.get().createCanvas(), this.antialias = !!e.antialias, this.texture = be(this.canvas, e), this.renderTarget = new I({
      colorTextures: [this.texture],
      depth: !!e.depth,
      isRoot: !0
    }), this.texture.source.transparent = e.backgroundAlpha < 1, this.resolution = e.resolution;
  }
  /**
   * Resizes the screen and canvas to the specified dimensions.
   * @param desiredScreenWidth - The new width of the screen.
   * @param desiredScreenHeight - The new height of the screen.
   * @param resolution
   */
  resize(e, t, r) {
    this.texture.source.resize(e, t, r), this.screen.width = this.texture.frame.width, this.screen.height = this.texture.frame.height;
  }
  /**
   * Destroys this System and optionally removes the canvas from the dom.
   * @param {options | false} options - The options for destroying the view, or "false".
   * @param options.removeView - Whether to remove the view element from the DOM. Defaults to `false`.
   */
  destroy(e = !1) {
    (typeof e == "boolean" ? e : !!(e != null && e.removeView)) && this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
  }
};
j.extension = {
  type: [
    u.WebGLSystem,
    u.WebGPUSystem,
    u.CanvasSystem
  ],
  name: "view",
  priority: 0
};
j.defaultOptions = {
  /**
   * {@link WebGLOptions.width}
   * @default 800
   */
  width: 800,
  /**
   * {@link WebGLOptions.height}
   * @default 600
   */
  height: 600,
  /**
   * {@link WebGLOptions.autoDensity}
   * @default false
   */
  autoDensity: !1,
  /**
   * {@link WebGLOptions.antialias}
   * @default false
   */
  antialias: !1
};
let Ut = j;
const jt = [
  yt,
  De,
  W,
  Ut,
  Ge,
  Bt,
  Ee,
  Tt,
  et,
  Gt,
  Oe
], Nt = [
  Ae,
  me,
  Be,
  Ce,
  ve,
  _e,
  xe,
  ke
];
export {
  Vt as B,
  x as G,
  zt as R,
  jt as S,
  Ht as U,
  Nt as a,
  ht as b,
  Lt as c,
  k as d,
  Ft as e,
  Ot as f,
  Dt as t,
  Wt as u
};
