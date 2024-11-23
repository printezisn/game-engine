import { T as _, a as M, n as g } from "./index-C-x2Y5Rw.js";
const P = {
  normal: 0,
  add: 1,
  multiply: 2,
  screen: 3,
  overlay: 4,
  erase: 5,
  "normal-npm": 6,
  "add-npm": 7,
  "screen-npm": 8,
  min: 9,
  max: 10
}, u = 0, h = 1, c = 2, d = 3, f = 4, p = 5, x = class b {
  constructor() {
    this.data = 0, this.blendMode = "normal", this.polygonOffset = 0, this.blend = !0, this.depthMask = !0;
  }
  /**
   * Activates blending of the computed fragment color values.
   * @default true
   */
  get blend() {
    return !!(this.data & 1 << u);
  }
  set blend(t) {
    !!(this.data & 1 << u) !== t && (this.data ^= 1 << u);
  }
  /**
   * Activates adding an offset to depth values of polygon's fragments
   * @default false
   */
  get offsets() {
    return !!(this.data & 1 << h);
  }
  set offsets(t) {
    !!(this.data & 1 << h) !== t && (this.data ^= 1 << h);
  }
  /** The culling settings for this state none - No culling back - Back face culling front - Front face culling */
  set cullMode(t) {
    if (t === "none") {
      this.culling = !1;
      return;
    }
    this.culling = !0, this.clockwiseFrontFace = t === "front";
  }
  get cullMode() {
    return this.culling ? this.clockwiseFrontFace ? "front" : "back" : "none";
  }
  /**
   * Activates culling of polygons.
   * @default false
   */
  get culling() {
    return !!(this.data & 1 << c);
  }
  set culling(t) {
    !!(this.data & 1 << c) !== t && (this.data ^= 1 << c);
  }
  /**
   * Activates depth comparisons and updates to the depth buffer.
   * @default false
   */
  get depthTest() {
    return !!(this.data & 1 << d);
  }
  set depthTest(t) {
    !!(this.data & 1 << d) !== t && (this.data ^= 1 << d);
  }
  /**
   * Enables or disables writing to the depth buffer.
   * @default true
   */
  get depthMask() {
    return !!(this.data & 1 << p);
  }
  set depthMask(t) {
    !!(this.data & 1 << p) !== t && (this.data ^= 1 << p);
  }
  /**
   * Specifies whether or not front or back-facing polygons can be culled.
   * @default false
   */
  get clockwiseFrontFace() {
    return !!(this.data & 1 << f);
  }
  set clockwiseFrontFace(t) {
    !!(this.data & 1 << f) !== t && (this.data ^= 1 << f);
  }
  /**
   * The blend mode to be applied when this state is set. Apply a value of `normal` to reset the blend mode.
   * Setting this mode to anything other than NO_BLEND will automatically switch blending on.
   * @default 'normal'
   */
  get blendMode() {
    return this._blendMode;
  }
  set blendMode(t) {
    this.blend = t !== "none", this._blendMode = t, this._blendModeId = P[t] || 0;
  }
  /**
   * The polygon offset. Setting this property to anything other than 0 will automatically enable polygon offset fill.
   * @default 0
   */
  get polygonOffset() {
    return this._polygonOffset;
  }
  set polygonOffset(t) {
    this.offsets = !!t, this._polygonOffset = t;
  }
  toString() {
    return `[pixi.js/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`;
  }
  /**
   * A quickly getting an instance of a State that is configured for 2d rendering.
   * @returns a new State with values set for 2d rendering
   */
  static for2d() {
    const t = new b();
    return t.depthTest = !1, t.blend = !0, t;
  }
};
x.default2d = x.for2d();
let w = x, T = 0;
class S {
  /**
   * @param textureOptions - options that will be passed to BaseRenderTexture constructor
   * @param {SCALE_MODE} [textureOptions.scaleMode] - See {@link SCALE_MODE} for possible values.
   */
  constructor(t) {
    this._poolKeyHash = /* @__PURE__ */ Object.create(null), this._texturePool = {}, this.textureOptions = t || {}, this.enableFullScreen = !1;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   * @param antialias
   */
  createTexture(t, o, e) {
    const r = new _({
      ...this.textureOptions,
      width: t,
      height: o,
      resolution: 1,
      antialias: e,
      autoGarbageCollect: !0
    });
    return new M({
      source: r,
      label: `texturePool_${T++}`
    });
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param frameWidth - The minimum width of the render texture.
   * @param frameHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @param antialias
   * @returns The new render texture.
   */
  getOptimalTexture(t, o, e = 1, r) {
    let n = Math.ceil(t * e - 1e-6), l = Math.ceil(o * e - 1e-6);
    n = g(n), l = g(l);
    const a = (n << 17) + (l << 1) + (r ? 1 : 0);
    this._texturePool[a] || (this._texturePool[a] = []);
    let s = this._texturePool[a].pop();
    return s || (s = this.createTexture(n, l, r)), s.source._resolution = e, s.source.width = n / e, s.source.height = l / e, s.source.pixelWidth = n, s.source.pixelHeight = l, s.frame.x = 0, s.frame.y = 0, s.frame.width = t, s.frame.height = o, s.updateUvs(), this._poolKeyHash[s.uid] = a, s;
  }
  /**
   * Gets extra texture of the same size as input renderTexture
   * @param texture - The texture to check what size it is.
   * @param antialias - Whether to use antialias.
   * @returns A texture that is a power of two
   */
  getSameSizeTexture(t, o = !1) {
    const e = t.source;
    return this.getOptimalTexture(t.width, t.height, e._resolution, o);
  }
  /**
   * Place a render texture back into the pool.
   * @param renderTexture - The renderTexture to free
   */
  returnTexture(t) {
    const o = this._poolKeyHash[t.uid];
    this._texturePool[o].push(t);
  }
  /**
   * Clears the pool.
   * @param destroyTextures - Destroy all stored textures.
   */
  clear(t) {
    if (t = t !== !1, t)
      for (const o in this._texturePool) {
        const e = this._texturePool[o];
        if (e)
          for (let r = 0; r < e.length; r++)
            e[r].destroy(!0);
      }
    this._texturePool = {};
  }
}
const k = new S(), m = {
  name: "local-uniform-bit",
  vertex: {
    header: (
      /* wgsl */
      `

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `
    ),
    main: (
      /* wgsl */
      `
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `
    ),
    end: (
      /* wgsl */
      `
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `
    )
  }
}, F = {
  ...m,
  vertex: {
    ...m.vertex,
    // replace the group!
    header: m.vertex.header.replace("group(1)", "group(2)")
  }
}, O = {
  name: "local-uniform-bit",
  vertex: {
    header: (
      /* glsl */
      `

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `
    ),
    main: (
      /* glsl */
      `
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `
    ),
    end: (
      /* glsl */
      `
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `
    )
  }
};
class U {
  constructor() {
    this.batcherName = "default", this.attributeSize = 4, this.indexSize = 6, this.packAsQuad = !0, this.roundPixels = 0, this._attributeStart = 0, this._batcher = null, this._batch = null;
  }
  get blendMode() {
    return this.renderable.groupBlendMode;
  }
  get color() {
    return this.renderable.groupColorAlpha;
  }
  reset() {
    this.renderable = null, this.texture = null, this._batcher = null, this._batch = null, this.bounds = null;
  }
}
function v(i, t, o) {
  const e = (i >> 24 & 255) / 255;
  t[o++] = (i & 255) / 255 * e, t[o++] = (i >> 8 & 255) / 255 * e, t[o++] = (i >> 16 & 255) / 255 * e, t[o++] = e;
}
export {
  U as B,
  w as S,
  k as T,
  m as a,
  O as b,
  v as c,
  F as l
};
