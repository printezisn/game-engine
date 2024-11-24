import { E as h, U as st, b as oe, aa as L, M as B, a4 as we, m as k, h as Be, w as E, a as U, P as nt, R as J, I as Ce, Z as G, ab as N, ac as it, F as b, ad as ot, ae as Z, L as q, af as z, d as de, B as H, v as ee, x as dt, G as ut, ag as lt, ah as ct, p as Re, a5 as Pe, u as Me, a8 as Ue, ai as Ge, t as ht, q as ft, s as pt, a6 as gt, a7 as mt, a9 as xt, aj as _t, ak as bt, al as yt, am as X, an as Q, D as Fe, o as D, Q as ue, ao as F, a1 as Tt, ap as vt, aq as le, n as ce, e as y, ar as St } from "./index-DO_s8Fw1.js";
import { T as w, S as I, c as W, a as wt, b as Bt, B as ke } from "./colorToUniform-CoBYoR1j.js";
class Ae {
  /**
   * Initialize the plugin with scope of application instance
   * @static
   * @private
   * @param {object} [options] - See application options
   */
  static init(e) {
    Object.defineProperty(
      this,
      "resizeTo",
      /**
       * The HTML element or window to automatically resize the
       * renderer's view element to match width and height.
       * @member {Window|HTMLElement}
       * @name resizeTo
       * @memberof app.Application#
       */
      {
        set(t) {
          globalThis.removeEventListener("resize", this.queueResize), this._resizeTo = t, t && (globalThis.addEventListener("resize", this.queueResize), this.resize());
        },
        get() {
          return this._resizeTo;
        }
      }
    ), this.queueResize = () => {
      this._resizeTo && (this._cancelResize(), this._resizeId = requestAnimationFrame(() => this.resize()));
    }, this._cancelResize = () => {
      this._resizeId && (cancelAnimationFrame(this._resizeId), this._resizeId = null);
    }, this.resize = () => {
      if (!this._resizeTo)
        return;
      this._cancelResize();
      let t, r;
      if (this._resizeTo === globalThis.window)
        t = globalThis.innerWidth, r = globalThis.innerHeight;
      else {
        const { clientWidth: a, clientHeight: n } = this._resizeTo;
        t = a, r = n;
      }
      this.renderer.resize(t, r), this.render();
    }, this._resizeId = null, this._resizeTo = null, this.resizeTo = e.resizeTo || null;
  }
  /**
   * Clean up the ticker, scoped to application
   * @static
   * @private
   */
  static destroy() {
    globalThis.removeEventListener("resize", this.queueResize), this._cancelResize(), this._cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
  }
}
Ae.extension = h.Application;
class De {
  /**
   * Initialize the plugin with scope of application instance
   * @static
   * @private
   * @param {object} [options] - See application options
   */
  static init(e) {
    e = Object.assign({
      autoStart: !0,
      sharedTicker: !1
    }, e), Object.defineProperty(
      this,
      "ticker",
      {
        set(t) {
          this._ticker && this._ticker.remove(this.render, this), this._ticker = t, t && t.add(this.render, this, st.LOW);
        },
        get() {
          return this._ticker;
        }
      }
    ), this.stop = () => {
      this._ticker.stop();
    }, this.start = () => {
      this._ticker.start();
    }, this._ticker = null, this.ticker = e.sharedTicker ? oe.shared : new oe(), e.autoStart && this.start();
  }
  /**
   * Clean up the ticker, scoped to application.
   * @static
   * @private
   */
  static destroy() {
    if (this._ticker) {
      const e = this._ticker;
      this.ticker = null, e.destroy();
    }
  }
}
De.extension = h.Application;
class ze {
  constructor(e) {
    this._renderer = e;
  }
  push(e, t, r) {
    this._renderer.renderPipes.batch.break(r), r.add({
      renderPipeId: "filter",
      canBundle: !1,
      action: "pushFilter",
      container: t,
      filterEffect: e
    });
  }
  pop(e, t, r) {
    this._renderer.renderPipes.batch.break(r), r.add({
      renderPipeId: "filter",
      action: "popFilter",
      canBundle: !1
    });
  }
  execute(e) {
    e.action === "pushFilter" ? this._renderer.filter.push(e) : e.action === "popFilter" && this._renderer.filter.pop();
  }
  destroy() {
    this._renderer = null;
  }
}
ze.extension = {
  type: [
    h.WebGLPipes,
    h.WebGPUPipes,
    h.CanvasPipes
  ],
  name: "filter"
};
const Ct = new B();
function Rt(s, e) {
  return e.clear(), He(s, e), e.isValid || e.set(0, 0, 0, 0), s.renderGroup ? e.applyMatrix(s.renderGroup.localTransform) : e.applyMatrix(s.parentRenderGroup.worldTransform), e;
}
function He(s, e) {
  if (s.localDisplayStatus !== 7 || !s.measurable)
    return;
  const t = !!s.effects.length;
  let r = e;
  if ((s.renderGroup || t) && (r = L.get().clear()), s.boundsArea)
    e.addRect(s.boundsArea, s.worldTransform);
  else {
    if (s.renderPipeId) {
      const n = s.bounds;
      r.addFrame(
        n.minX,
        n.minY,
        n.maxX,
        n.maxY,
        s.groupTransform
      );
    }
    const a = s.children;
    for (let n = 0; n < a.length; n++)
      He(a[n], r);
  }
  if (t) {
    let a = !1;
    for (let n = 0; n < s.effects.length; n++)
      s.effects[n].addBounds && (a || (a = !0, r.applyMatrix(s.parentRenderGroup.worldTransform)), s.effects[n].addBounds(r, !0));
    a && (r.applyMatrix(s.parentRenderGroup.worldTransform.copyTo(Ct).invert()), e.addBounds(r, s.relativeGroupTransform)), e.addBounds(r), L.return(r);
  } else s.renderGroup && (e.addBounds(r, s.relativeGroupTransform), L.return(r));
}
function Pt(s, e) {
  e.clear();
  const t = e.matrix;
  for (let r = 0; r < s.length; r++) {
    const a = s[r];
    a.globalDisplayStatus < 7 || (e.matrix = a.worldTransform, a.addBounds(e));
  }
  return e.matrix = t, e;
}
const Mt = new we({
  attributes: {
    aPosition: {
      buffer: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      format: "float32x2",
      stride: 2 * 4,
      offset: 0
    }
  },
  indexBuffer: new Uint32Array([0, 1, 2, 0, 2, 3])
});
class Oe {
  constructor(e) {
    this._filterStackIndex = 0, this._filterStack = [], this._filterGlobalUniforms = new k({
      uInputSize: { value: new Float32Array(4), type: "vec4<f32>" },
      uInputPixel: { value: new Float32Array(4), type: "vec4<f32>" },
      uInputClamp: { value: new Float32Array(4), type: "vec4<f32>" },
      uOutputFrame: { value: new Float32Array(4), type: "vec4<f32>" },
      uGlobalFrame: { value: new Float32Array(4), type: "vec4<f32>" },
      uOutputTexture: { value: new Float32Array(4), type: "vec4<f32>" }
    }), this._globalFilterBindGroup = new Be({}), this.renderer = e;
  }
  /**
   * The back texture of the currently active filter. Requires the filter to have `blendRequired` set to true.
   * @readonly
   */
  get activeBackTexture() {
    var e;
    return (e = this._activeFilterData) == null ? void 0 : e.backTexture;
  }
  push(e) {
    var m;
    const t = this.renderer, r = e.filterEffect.filters;
    this._filterStack[this._filterStackIndex] || (this._filterStack[this._filterStackIndex] = this._getFilterData());
    const a = this._filterStack[this._filterStackIndex];
    if (this._filterStackIndex++, r.length === 0) {
      a.skip = !0;
      return;
    }
    const n = a.bounds;
    e.renderables ? Pt(e.renderables, n) : e.filterEffect.filterArea ? (n.clear(), n.addRect(e.filterEffect.filterArea), n.applyMatrix(e.container.worldTransform)) : Rt(e.container, n);
    const i = t.renderTarget.renderTarget.colorTexture.source;
    let o = 1 / 0, d = 0, l = !0, c = !1, u = !1, p = !0;
    for (let g = 0; g < r.length; g++) {
      const f = r[g];
      if (o = Math.min(o, f.resolution === "inherit" ? i._resolution : f.resolution), d += f.padding, f.antialias === "off" ? l = !1 : f.antialias === "inherit" && l && (l = i.antialias), f.clipToViewport || (p = !1), !!!(f.compatibleRenderers & t.type)) {
        u = !1;
        break;
      }
      if (f.blendRequired && !(((m = t.backBuffer) == null ? void 0 : m.useBackBuffer) ?? !0)) {
        E("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."), u = !1;
        break;
      }
      u = f.enabled || u, c = c || f.blendRequired;
    }
    if (!u) {
      a.skip = !0;
      return;
    }
    if (n.scale(o), p) {
      const g = t.renderTarget.rootViewPort;
      n.fitBounds(0, g.width, 0, g.height);
    }
    if (n.ceil().scale(1 / o).pad(d | 0), !n.isPositive) {
      a.skip = !0;
      return;
    }
    a.skip = !1, a.bounds = n, a.blendRequired = c, a.container = e.container, a.filterEffect = e.filterEffect, a.previousRenderSurface = t.renderTarget.renderSurface, a.inputTexture = w.getOptimalTexture(
      n.width,
      n.height,
      o,
      l
    ), t.renderTarget.bind(a.inputTexture, !0), t.globalUniforms.push({
      offset: n
    });
  }
  pop() {
    const e = this.renderer;
    this._filterStackIndex--;
    const t = this._filterStack[this._filterStackIndex];
    if (t.skip)
      return;
    this._activeFilterData = t;
    const r = t.inputTexture, a = t.bounds;
    let n = U.EMPTY;
    if (e.renderTarget.finishRenderPass(), t.blendRequired) {
      const o = this._filterStackIndex > 0 ? this._filterStack[this._filterStackIndex - 1].bounds : null, d = e.renderTarget.getRenderTarget(t.previousRenderSurface);
      n = this.getBackTexture(d, a, o);
    }
    t.backTexture = n;
    const i = t.filterEffect.filters;
    if (this._globalFilterBindGroup.setResource(r.source.style, 2), this._globalFilterBindGroup.setResource(n.source, 3), e.globalUniforms.pop(), i.length === 1)
      i[0].apply(this, r, t.previousRenderSurface, !1), w.returnTexture(r);
    else {
      let o = t.inputTexture, d = w.getOptimalTexture(
        a.width,
        a.height,
        o.source._resolution,
        !1
      ), l = 0;
      for (l = 0; l < i.length - 1; ++l) {
        i[l].apply(this, o, d, !0);
        const u = o;
        o = d, d = u;
      }
      i[l].apply(this, o, t.previousRenderSurface, !1), w.returnTexture(o), w.returnTexture(d);
    }
    t.blendRequired && w.returnTexture(n);
  }
  getBackTexture(e, t, r) {
    const a = e.colorTexture.source._resolution, n = w.getOptimalTexture(
      t.width,
      t.height,
      a,
      !1
    );
    let i = t.minX, o = t.minY;
    r && (i -= r.minX, o -= r.minY), i = Math.floor(i * a), o = Math.floor(o * a);
    const d = Math.ceil(t.width * a), l = Math.ceil(t.height * a);
    return this.renderer.renderTarget.copyToTexture(
      e,
      n,
      { x: i, y: o },
      { width: d, height: l },
      { x: 0, y: 0 }
    ), n;
  }
  applyFilter(e, t, r, a) {
    const n = this.renderer, i = this._filterStack[this._filterStackIndex], o = i.bounds, d = nt.shared, c = i.previousRenderSurface === r;
    let u = this.renderer.renderTarget.rootRenderTarget.colorTexture.source._resolution, p = this._filterStackIndex - 1;
    for (; p > 0 && this._filterStack[p].skip; )
      --p;
    p > 0 && (u = this._filterStack[p].inputTexture.source._resolution);
    const m = this._filterGlobalUniforms, g = m.uniforms, f = g.uOutputFrame, _ = g.uInputSize, x = g.uInputPixel, C = g.uInputClamp, T = g.uGlobalFrame, R = g.uOutputTexture;
    if (c) {
      let P = this._filterStackIndex;
      for (; P > 0; ) {
        P--;
        const M = this._filterStack[this._filterStackIndex - 1];
        if (!M.skip) {
          d.x = M.bounds.minX, d.y = M.bounds.minY;
          break;
        }
      }
      f[0] = o.minX - d.x, f[1] = o.minY - d.y;
    } else
      f[0] = 0, f[1] = 0;
    f[2] = t.frame.width, f[3] = t.frame.height, _[0] = t.source.width, _[1] = t.source.height, _[2] = 1 / _[0], _[3] = 1 / _[1], x[0] = t.source.pixelWidth, x[1] = t.source.pixelHeight, x[2] = 1 / x[0], x[3] = 1 / x[1], C[0] = 0.5 * x[2], C[1] = 0.5 * x[3], C[2] = t.frame.width * _[2] - 0.5 * x[2], C[3] = t.frame.height * _[3] - 0.5 * x[3];
    const A = this.renderer.renderTarget.rootRenderTarget.colorTexture;
    T[0] = d.x * u, T[1] = d.y * u, T[2] = A.source.width * u, T[3] = A.source.height * u;
    const S = this.renderer.renderTarget.getRenderTarget(r);
    if (n.renderTarget.bind(r, !!a), r instanceof U ? (R[0] = r.frame.width, R[1] = r.frame.height) : (R[0] = S.width, R[1] = S.height), R[2] = S.isRoot ? -1 : 1, m.update(), n.renderPipes.uniformBatch) {
      const P = n.renderPipes.uniformBatch.getUboResource(m);
      this._globalFilterBindGroup.setResource(P, 0);
    } else
      this._globalFilterBindGroup.setResource(m, 0);
    this._globalFilterBindGroup.setResource(t.source, 1), this._globalFilterBindGroup.setResource(t.source.style, 2), e.groups[0] = this._globalFilterBindGroup, n.encoder.draw({
      geometry: Mt,
      shader: e,
      state: e._state,
      topology: "triangle-list"
    }), n.type === J.WEBGL && n.renderTarget.finishRenderPass();
  }
  _getFilterData() {
    return {
      skip: !1,
      inputTexture: null,
      bounds: new Ce(),
      container: null,
      filterEffect: null,
      blendRequired: !1,
      previousRenderSurface: null
    };
  }
  /**
   * Multiply _input normalized coordinates_ to this matrix to get _sprite texture normalized coordinates_.
   *
   * Use `outputMatrix * vTextureCoord` in the shader.
   * @param outputMatrix - The matrix to output to.
   * @param {Sprite} sprite - The sprite to map to.
   * @returns The mapped matrix.
   */
  calculateSpriteMatrix(e, t) {
    const r = this._activeFilterData, a = e.set(
      r.inputTexture._source.width,
      0,
      0,
      r.inputTexture._source.height,
      r.bounds.minX,
      r.bounds.minY
    ), n = t.worldTransform.copyTo(B.shared);
    return n.invert(), a.prepend(n), a.scale(
      1 / t.texture.frame.width,
      1 / t.texture.frame.height
    ), a.translate(t.anchor.x, t.anchor.y), a;
  }
}
Oe.extension = {
  type: [
    h.WebGLSystem,
    h.WebGPUSystem
  ],
  name: "filter"
};
function Ut(s) {
  const e = s._stroke, t = s._fill, a = [`div { ${[
    `color: ${G.shared.setValue(t.color).toHex()}`,
    `font-size: ${s.fontSize}px`,
    `font-family: ${s.fontFamily}`,
    `font-weight: ${s.fontWeight}`,
    `font-style: ${s.fontStyle}`,
    `font-variant: ${s.fontVariant}`,
    `letter-spacing: ${s.letterSpacing}px`,
    `text-align: ${s.align}`,
    `padding: ${s.padding}px`,
    `white-space: ${s.whiteSpace === "pre" && s.wordWrap ? "pre-wrap" : s.whiteSpace}`,
    ...s.lineHeight ? [`line-height: ${s.lineHeight}px`] : [],
    ...s.wordWrap ? [
      `word-wrap: ${s.breakWords ? "break-all" : "break-word"}`,
      `max-width: ${s.wordWrapWidth}px`
    ] : [],
    ...e ? [Ee(e)] : [],
    ...s.dropShadow ? [Ve(s.dropShadow)] : [],
    ...s.cssOverrides
  ].join(";")} }`];
  return Gt(s.tagStyles, a), a.join(" ");
}
function Ve(s) {
  const e = G.shared.setValue(s.color).setAlpha(s.alpha).toHexa(), t = Math.round(Math.cos(s.angle) * s.distance), r = Math.round(Math.sin(s.angle) * s.distance), a = `${t}px ${r}px`;
  return s.blur > 0 ? `text-shadow: ${a} ${s.blur}px ${e}` : `text-shadow: ${a} ${e}`;
}
function Ee(s) {
  return [
    `-webkit-text-stroke-width: ${s.width}px`,
    `-webkit-text-stroke-color: ${G.shared.setValue(s.color).toHex()}`,
    `text-stroke-width: ${s.width}px`,
    `text-stroke-color: ${G.shared.setValue(s.color).toHex()}`,
    "paint-order: stroke"
  ].join(";");
}
const he = {
  fontSize: "font-size: {{VALUE}}px",
  fontFamily: "font-family: {{VALUE}}",
  fontWeight: "font-weight: {{VALUE}}",
  fontStyle: "font-style: {{VALUE}}",
  fontVariant: "font-variant: {{VALUE}}",
  letterSpacing: "letter-spacing: {{VALUE}}px",
  align: "text-align: {{VALUE}}",
  padding: "padding: {{VALUE}}px",
  whiteSpace: "white-space: {{VALUE}}",
  lineHeight: "line-height: {{VALUE}}px",
  wordWrapWidth: "max-width: {{VALUE}}px"
}, fe = {
  fill: (s) => `color: ${G.shared.setValue(s).toHex()}`,
  breakWords: (s) => `word-wrap: ${s ? "break-all" : "break-word"}`,
  stroke: Ee,
  dropShadow: Ve
};
function Gt(s, e) {
  for (const t in s) {
    const r = s[t], a = [];
    for (const n in r)
      fe[n] ? a.push(fe[n](r[n])) : he[n] && a.push(he[n].replace("{{VALUE}}", r[n]));
    e.push(`${t} { ${a.join(";")} }`);
  }
}
class te extends N {
  constructor(e = {}) {
    super(e), this._cssOverrides = [], this.cssOverrides ?? (this.cssOverrides = e.cssOverrides), this.tagStyles = e.tagStyles ?? {};
  }
  /** List of style overrides that will be applied to the HTML text. */
  set cssOverrides(e) {
    this._cssOverrides = e instanceof Array ? e : [e], this.update();
  }
  get cssOverrides() {
    return this._cssOverrides;
  }
  _generateKey() {
    return this._styleKey = it(this) + this._cssOverrides.join("-"), this._styleKey;
  }
  update() {
    this._cssStyle = null, super.update();
  }
  /**
   * Creates a new HTMLTextStyle object with the same values as this one.
   * @returns New cloned HTMLTextStyle object
   */
  clone() {
    return new te({
      align: this.align,
      breakWords: this.breakWords,
      dropShadow: this.dropShadow ? { ...this.dropShadow } : null,
      fill: this._fill,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontStyle: this.fontStyle,
      fontVariant: this.fontVariant,
      fontWeight: this.fontWeight,
      letterSpacing: this.letterSpacing,
      lineHeight: this.lineHeight,
      padding: this.padding,
      stroke: this._stroke,
      whiteSpace: this.whiteSpace,
      wordWrap: this.wordWrap,
      wordWrapWidth: this.wordWrapWidth,
      cssOverrides: this.cssOverrides
    });
  }
  get cssStyle() {
    return this._cssStyle || (this._cssStyle = Ut(this)), this._cssStyle;
  }
  /**
   * Add a style override, this can be any CSS property
   * it will override any built-in style. This is the
   * property and the value as a string (e.g., `color: red`).
   * This will override any other internal style.
   * @param {string} value - CSS style(s) to add.
   * @example
   * style.addOverride('background-color: red');
   */
  addOverride(...e) {
    const t = e.filter((r) => !this.cssOverrides.includes(r));
    t.length > 0 && (this.cssOverrides.push(...t), this.update());
  }
  /**
   * Remove any overrides that match the value.
   * @param {string} value - CSS style to remove.
   * @example
   * style.removeOverride('background-color: red');
   */
  removeOverride(...e) {
    const t = e.filter((r) => this.cssOverrides.includes(r));
    t.length > 0 && (this.cssOverrides = this.cssOverrides.filter((r) => !t.includes(r)), this.update());
  }
  set fill(e) {
    typeof e != "string" && typeof e != "number" && E("[HTMLTextStyle] only color fill is not supported by HTMLText"), super.fill = e;
  }
  set stroke(e) {
    e && typeof e != "string" && typeof e != "number" && E("[HTMLTextStyle] only color stroke is not supported by HTMLText"), super.stroke = e;
  }
}
const pe = "http://www.w3.org/2000/svg", ge = "http://www.w3.org/1999/xhtml";
class Ie {
  constructor() {
    this.svgRoot = document.createElementNS(pe, "svg"), this.foreignObject = document.createElementNS(pe, "foreignObject"), this.domElement = document.createElementNS(ge, "div"), this.styleElement = document.createElementNS(ge, "style"), this.image = new Image();
    const { foreignObject: e, svgRoot: t, styleElement: r, domElement: a } = this;
    e.setAttribute("width", "10000"), e.setAttribute("height", "10000"), e.style.overflow = "hidden", t.appendChild(e), e.appendChild(r), e.appendChild(a);
  }
}
let me;
function Ft(s, e, t, r) {
  r = r || me || (me = new Ie());
  const { domElement: a, styleElement: n, svgRoot: i } = r;
  a.innerHTML = `<style>${e.cssStyle};</style><div style='padding:0'>${s}</div>`, a.setAttribute("style", "transform-origin: top left; display: inline-block"), t && (n.textContent = t), document.body.appendChild(i);
  const o = a.getBoundingClientRect();
  i.remove();
  const d = e.padding * 2;
  return {
    width: o.width - d,
    height: o.height - d
  };
}
class We {
  constructor(e, t) {
    this.state = I.for2d(), this._graphicsBatchesHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this.renderer = e, this._adaptor = t, this._adaptor.init(), this.renderer.renderableGC.addManagedHash(this, "_graphicsBatchesHash");
  }
  validateRenderable(e) {
    const t = e.context, r = !!this._graphicsBatchesHash[e.uid], a = this.renderer.graphicsContext.updateGpuContext(t);
    return !!(a.isBatchable || r !== a.isBatchable);
  }
  addRenderable(e, t) {
    const r = this.renderer.graphicsContext.updateGpuContext(e.context);
    e.didViewUpdate && this._rebuild(e), r.isBatchable ? this._addToBatcher(e, t) : (this.renderer.renderPipes.batch.break(t), t.add(e));
  }
  updateRenderable(e) {
    const t = this._graphicsBatchesHash[e.uid];
    if (t)
      for (let r = 0; r < t.length; r++) {
        const a = t[r];
        a._batcher.updateElement(a);
      }
  }
  destroyRenderable(e) {
    this._graphicsBatchesHash[e.uid] && this._removeBatchForRenderable(e.uid), e.off("destroyed", this._destroyRenderableBound);
  }
  execute(e) {
    if (!e.isRenderable)
      return;
    const t = this.renderer, r = e.context;
    if (!t.graphicsContext.getGpuContext(r).batches.length)
      return;
    const n = r.customShader || this._adaptor.shader;
    this.state.blendMode = e.groupBlendMode;
    const i = n.resources.localUniforms.uniforms;
    i.uTransformMatrix = e.groupTransform, i.uRound = t._roundPixels | e._roundPixels, W(
      e.groupColorAlpha,
      i.uColor,
      0
    ), this._adaptor.execute(this, e);
  }
  _rebuild(e) {
    const t = !!this._graphicsBatchesHash[e.uid], r = this.renderer.graphicsContext.updateGpuContext(e.context);
    t && this._removeBatchForRenderable(e.uid), r.isBatchable && this._initBatchesForRenderable(e), e.batched = r.isBatchable;
  }
  _addToBatcher(e, t) {
    const r = this.renderer.renderPipes.batch, a = this._getBatchesForRenderable(e);
    for (let n = 0; n < a.length; n++) {
      const i = a[n];
      r.addToBatch(i, t);
    }
  }
  _getBatchesForRenderable(e) {
    return this._graphicsBatchesHash[e.uid] || this._initBatchesForRenderable(e);
  }
  _initBatchesForRenderable(e) {
    const t = e.context, r = this.renderer.graphicsContext.getGpuContext(t), a = this.renderer._roundPixels | e._roundPixels, n = r.batches.map((i) => {
      const o = b.get(ot);
      return i.copyTo(o), o.renderable = e, o.roundPixels = a, o;
    });
    return this._graphicsBatchesHash[e.uid] === void 0 && e.on("destroyed", this._destroyRenderableBound), this._graphicsBatchesHash[e.uid] = n, n;
  }
  _removeBatchForRenderable(e) {
    this._graphicsBatchesHash[e].forEach((t) => {
      b.return(t);
    }), this._graphicsBatchesHash[e] = null;
  }
  destroy() {
    this.renderer = null, this._adaptor.destroy(), this._adaptor = null, this.state = null;
    for (const e in this._graphicsBatchesHash)
      this._removeBatchForRenderable(e);
    this._graphicsBatchesHash = null;
  }
}
We.extension = {
  type: [
    h.WebGLPipes,
    h.WebGPUPipes,
    h.CanvasPipes
  ],
  name: "graphics"
};
class re {
  constructor() {
    this.batcherName = "default", this.packAsQuad = !1, this.indexOffset = 0, this.attributeOffset = 0, this.roundPixels = 0, this._batcher = null, this._batch = null, this._uvUpdateId = -1, this._textureMatrixUpdateId = -1;
  }
  get blendMode() {
    return this.renderable.groupBlendMode;
  }
  reset() {
    this.renderable = null, this.texture = null, this._batcher = null, this._batch = null, this.geometry = null, this._uvUpdateId = -1, this._textureMatrixUpdateId = -1;
  }
  get uvs() {
    const t = this.geometry.getBuffer("aUV"), r = t.data;
    let a = r;
    const n = this.texture.textureMatrix;
    return n.isSimple || (a = this._transformedUvs, (this._textureMatrixUpdateId !== n._updateID || this._uvUpdateId !== t._updateID) && ((!a || a.length < r.length) && (a = this._transformedUvs = new Float32Array(r.length)), this._textureMatrixUpdateId = n._updateID, this._uvUpdateId = t._updateID, n.multiplyUvs(r, a))), a;
  }
  get positions() {
    return this.geometry.positions;
  }
  get indices() {
    return this.geometry.indices;
  }
  get color() {
    return this.renderable.groupColorAlpha;
  }
  get groupTransform() {
    return this.renderable.groupTransform;
  }
  get attributeSize() {
    return this.geometry.positions.length / 2;
  }
  get indexSize() {
    return this.geometry.indices.length;
  }
}
class Le {
  constructor(e, t) {
    this.localUniforms = new k({
      uTransformMatrix: { value: new B(), type: "mat3x3<f32>" },
      uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      uRound: { value: 0, type: "f32" }
    }), this.localUniformsBindGroup = new Be({
      0: this.localUniforms
    }), this._meshDataHash = /* @__PURE__ */ Object.create(null), this._gpuBatchableMeshHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this.renderer = e, this._adaptor = t, this._adaptor.init(), e.renderableGC.addManagedHash(this, "_gpuBatchableMeshHash"), e.renderableGC.addManagedHash(this, "_meshDataHash");
  }
  validateRenderable(e) {
    const t = this._getMeshData(e), r = t.batched, a = e.batched;
    if (t.batched = a, r !== a)
      return !0;
    if (a) {
      const n = e._geometry;
      if (n.indices.length !== t.indexSize || n.positions.length !== t.vertexSize)
        return t.indexSize = n.indices.length, t.vertexSize = n.positions.length, !0;
      const i = this._getBatchableMesh(e), o = e.texture;
      if (i.texture._source !== o._source && i.texture._source !== o._source)
        return !i._batcher.checkAndUpdateTexture(i, o);
    }
    return !1;
  }
  addRenderable(e, t) {
    const r = this.renderer.renderPipes.batch, { batched: a } = this._getMeshData(e);
    if (a) {
      const n = this._getBatchableMesh(e);
      n.texture = e._texture, n.geometry = e._geometry, r.addToBatch(n, t);
    } else
      r.break(t), t.add(e);
  }
  updateRenderable(e) {
    if (e.batched) {
      const t = this._gpuBatchableMeshHash[e.uid];
      t.texture = e._texture, t.geometry = e._geometry, t._batcher.updateElement(t);
    }
  }
  destroyRenderable(e) {
    this._meshDataHash[e.uid] = null;
    const t = this._gpuBatchableMeshHash[e.uid];
    t && (b.return(t), this._gpuBatchableMeshHash[e.uid] = null), e.off("destroyed", this._destroyRenderableBound);
  }
  execute(e) {
    if (!e.isRenderable)
      return;
    e.state.blendMode = Z(e.groupBlendMode, e.texture._source);
    const t = this.localUniforms;
    t.uniforms.uTransformMatrix = e.groupTransform, t.uniforms.uRound = this.renderer._roundPixels | e._roundPixels, t.update(), W(
      e.groupColorAlpha,
      t.uniforms.uColor,
      0
    ), this._adaptor.execute(this, e);
  }
  _getMeshData(e) {
    return this._meshDataHash[e.uid] || this._initMeshData(e);
  }
  _initMeshData(e) {
    var t, r;
    return this._meshDataHash[e.uid] = {
      batched: e.batched,
      indexSize: (t = e._geometry.indices) == null ? void 0 : t.length,
      vertexSize: (r = e._geometry.positions) == null ? void 0 : r.length
    }, e.on("destroyed", this._destroyRenderableBound), this._meshDataHash[e.uid];
  }
  _getBatchableMesh(e) {
    return this._gpuBatchableMeshHash[e.uid] || this._initBatchableMesh(e);
  }
  _initBatchableMesh(e) {
    const t = b.get(re);
    return t.renderable = e, t.texture = e._texture, t.transform = e.groupTransform, t.roundPixels = this.renderer._roundPixels | e._roundPixels, this._gpuBatchableMeshHash[e.uid] = t, t;
  }
  destroy() {
    for (const e in this._gpuBatchableMeshHash)
      this._gpuBatchableMeshHash[e] && b.return(this._gpuBatchableMeshHash[e]);
    this._gpuBatchableMeshHash = null, this._meshDataHash = null, this.localUniforms = null, this.localUniformsBindGroup = null, this._adaptor.destroy(), this._adaptor = null, this.renderer = null;
  }
}
Le.extension = {
  type: [
    h.WebGLPipes,
    h.WebGPUPipes,
    h.CanvasPipes
  ],
  name: "mesh"
};
class kt {
  execute(e, t) {
    const r = e.state, a = e.renderer, n = t.shader || e.defaultShader;
    n.resources.uTexture = t.texture._source, n.resources.uniforms = e.localUniforms;
    const i = a.gl, o = e.getBuffers(t);
    a.shader.bind(n), a.state.set(r), a.geometry.bind(o.geometry, n.glProgram);
    const l = o.geometry.indexBuffer.data.BYTES_PER_ELEMENT === 2 ? i.UNSIGNED_SHORT : i.UNSIGNED_INT;
    i.drawElements(i.TRIANGLES, t.particleChildren.length * 6, l, 0);
  }
}
class At {
  execute(e, t) {
    const r = e.renderer, a = t.shader || e.defaultShader;
    a.groups[0] = r.renderPipes.uniformBatch.getUniformBindGroup(e.localUniforms, !0), a.groups[1] = r.texture.getTextureBindGroup(t.texture);
    const n = e.state, i = e.getBuffers(t);
    r.encoder.draw({
      geometry: i.geometry,
      shader: t.shader || e.defaultShader,
      state: n,
      size: t.particleChildren.length * 6
    });
  }
}
function xe(s, e = null) {
  const t = s * 6;
  if (t > 65535 ? e = e || new Uint32Array(t) : e = e || new Uint16Array(t), e.length !== t)
    throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);
  for (let r = 0, a = 0; r < t; r += 6, a += 4)
    e[r + 0] = a + 0, e[r + 1] = a + 1, e[r + 2] = a + 2, e[r + 3] = a + 0, e[r + 4] = a + 2, e[r + 5] = a + 3;
  return e;
}
function Dt(s) {
  return {
    dynamicUpdate: _e(s, !0),
    staticUpdate: _e(s, !1)
  };
}
function _e(s, e) {
  const t = [];
  t.push(`
      
        var index = 0;

        for (let i = 0; i < ps.length; ++i)
        {
            const p = ps[i];

            `);
  let r = 0;
  for (const n in s) {
    const i = s[n];
    if (e !== i.dynamic)
      continue;
    t.push(`offset = index + ${r}`), t.push(i.code);
    const o = q(i.format);
    r += o.stride / 4;
  }
  t.push(`
            index += stride * 4;
        }
    `), t.unshift(`
        var stride = ${r};
    `);
  const a = t.join(`
`);
  return new Function("ps", "f32v", "u32v", a);
}
class zt {
  constructor(e) {
    this._size = 0, this._generateParticleUpdateCache = {};
    const t = this._size = e.size ?? 1e3, r = e.properties;
    let a = 0, n = 0;
    for (const c in r) {
      const u = r[c], p = q(u.format);
      u.dynamic ? n += p.stride : a += p.stride;
    }
    this._dynamicStride = n / 4, this._staticStride = a / 4, this.staticAttributeBuffer = new z(t * 4 * a), this.dynamicAttributeBuffer = new z(t * 4 * n), this.indexBuffer = xe(t);
    const i = new we();
    let o = 0, d = 0;
    this._staticBuffer = new de({
      data: new Float32Array(1),
      label: "static-particle-buffer",
      shrinkToFit: !1,
      usage: H.VERTEX | H.COPY_DST
    }), this._dynamicBuffer = new de({
      data: new Float32Array(1),
      label: "dynamic-particle-buffer",
      shrinkToFit: !1,
      usage: H.VERTEX | H.COPY_DST
    });
    for (const c in r) {
      const u = r[c], p = q(u.format);
      u.dynamic ? (i.addAttribute(u.attributeName, {
        buffer: this._dynamicBuffer,
        stride: this._dynamicStride * 4,
        offset: o * 4,
        format: u.format
      }), o += p.size) : (i.addAttribute(u.attributeName, {
        buffer: this._staticBuffer,
        stride: this._staticStride * 4,
        offset: d * 4,
        format: u.format
      }), d += p.size);
    }
    i.addIndex(this.indexBuffer);
    const l = this.getParticleUpdate(r);
    this._dynamicUpload = l.dynamicUpdate, this._staticUpload = l.staticUpdate, this.geometry = i;
  }
  getParticleUpdate(e) {
    const t = Ht(e);
    return this._generateParticleUpdateCache[t] ? this._generateParticleUpdateCache[t] : (this._generateParticleUpdateCache[t] = this.generateParticleUpdate(e), this._generateParticleUpdateCache[t]);
  }
  generateParticleUpdate(e) {
    return Dt(e);
  }
  update(e, t) {
    e.length > this._size && (t = !0, this._size = Math.max(e.length, this._size * 1.5 | 0), this.staticAttributeBuffer = new z(this._size * this._staticStride * 4 * 4), this.dynamicAttributeBuffer = new z(this._size * this._dynamicStride * 4 * 4), this.indexBuffer = xe(this._size), this.geometry.indexBuffer.setDataWithSize(
      this.indexBuffer,
      this.indexBuffer.byteLength,
      !0
    ));
    const r = this.dynamicAttributeBuffer;
    if (this._dynamicUpload(e, r.float32View, r.uint32View), this._dynamicBuffer.setDataWithSize(
      this.dynamicAttributeBuffer.float32View,
      e.length * this._dynamicStride * 4,
      !0
    ), t) {
      const a = this.staticAttributeBuffer;
      this._staticUpload(e, a.float32View, a.uint32View), this._staticBuffer.setDataWithSize(
        a.float32View,
        e.length * this._staticStride * 4,
        !0
      );
    }
  }
  destroy() {
    this._staticBuffer.destroy(), this._dynamicBuffer.destroy(), this.geometry.destroy();
  }
}
function Ht(s) {
  const e = [];
  for (const t in s) {
    const r = s[t];
    e.push(t, r.code, r.dynamic ? "d" : "s");
  }
  return e.join("_");
}
var Ot = `varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`, Vt = `attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
    return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
    float cosRotation = cos(aRotation);
    float sinRotation = sin(aRotation);
    float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
    float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

    vec2 v = vec2(x, y);
    v = v + aPosition;

    gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    if(uRound == 1.0)
    {
        gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
    }

    vUV = aUV;
    vColor = aColor * uColor;
}
`, be = `
struct ParticleUniforms {
  uProjectionMatrix:mat3x3<f32>,
  uResolution:vec2<f32>,
  uRoundPixels:f32,
};

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
  };
@vertex
fn mainVertex(
  @location(0) aVertex: vec2<f32>,
  @location(1) aPosition: vec2<f32>,
  @location(2) aUV: vec2<f32>,
  @location(3) aColor: vec4<f32>,
  @location(4) aRotation: f32,
) -> VSOutput {
  
   let v = vec2(
       aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
       aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
   ) + aPosition;

   let position = vec4((uniforms.uProjectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

  return VSOutput(
   position,
   aUV,
   aColor,
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

    var sample = textureSample(uTexture, uSampler, uv) * color;
   
    return sample;
}`;
class Et extends ee {
  constructor() {
    const e = dt.from({
      vertex: Vt,
      fragment: Ot
    }), t = ut.from({
      fragment: {
        source: be,
        entryPoint: "mainFragment"
      },
      vertex: {
        source: be,
        entryPoint: "mainVertex"
      }
    });
    super({
      glProgram: e,
      gpuProgram: t,
      resources: {
        // this will be replaced with the texture from the particle container
        uTexture: U.WHITE.source,
        // this will be replaced with the texture style from the particle container
        uSampler: new lt({}),
        // this will be replaced with the local uniforms from the particle container
        uniforms: {
          uTranslationMatrix: { value: new B(), type: "mat3x3<f32>" },
          uColor: { value: new G(16777215), type: "vec4<f32>" },
          uRound: { value: 1, type: "f32" },
          uResolution: { value: [0, 0], type: "vec2<f32>" }
        }
      }
    });
  }
}
class $e {
  /**
   * @param renderer - The renderer this sprite batch works for.
   * @param adaptor
   */
  constructor(e, t) {
    this.state = I.for2d(), this._gpuBufferHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this.localUniforms = new k({
      uTranslationMatrix: { value: new B(), type: "mat3x3<f32>" },
      uColor: { value: new Float32Array(4), type: "vec4<f32>" },
      uRound: { value: 1, type: "f32" },
      uResolution: { value: [0, 0], type: "vec2<f32>" }
    }), this.renderer = e, this.adaptor = t, this.defaultShader = new Et(), this.state = I.for2d();
  }
  validateRenderable(e) {
    return !1;
  }
  addRenderable(e, t) {
    this.renderer.renderPipes.batch.break(t), t.add(e);
  }
  getBuffers(e) {
    return this._gpuBufferHash[e.uid] || this._initBuffer(e);
  }
  _initBuffer(e) {
    return this._gpuBufferHash[e.uid] = new zt({
      size: e.particleChildren.length,
      properties: e._properties
    }), e.on("destroyed", this._destroyRenderableBound), this._gpuBufferHash[e.uid];
  }
  updateRenderable(e) {
  }
  destroyRenderable(e) {
    this._gpuBufferHash[e.uid].destroy(), this._gpuBufferHash[e.uid] = null, e.off("destroyed", this._destroyRenderableBound);
  }
  execute(e) {
    const t = e.particleChildren;
    if (t.length === 0)
      return;
    const r = this.renderer, a = this.getBuffers(e);
    e.texture || (e.texture = t[0].texture);
    const n = this.state;
    a.update(t, e._childrenDirty), e._childrenDirty = !1, n.blendMode = Z(e.blendMode, e.texture._source);
    const i = this.localUniforms.uniforms, o = i.uTranslationMatrix;
    e.worldTransform.copyTo(o), o.prepend(r.globalUniforms.globalUniformData.projectionMatrix), i.uResolution = r.globalUniforms.globalUniformData.resolution, i.uRound = r._roundPixels | e._roundPixels, W(
      e.groupColorAlpha,
      i.uColor,
      0
    ), this.adaptor.execute(this, e);
  }
  /** Destroys the ParticleRenderer. */
  destroy() {
    this.defaultShader && (this.defaultShader.destroy(), this.defaultShader = null);
  }
}
class je extends $e {
  constructor(e) {
    super(e, new kt());
  }
}
je.extension = {
  type: [
    h.WebGLPipes
  ],
  name: "particle"
};
class Ye extends $e {
  constructor(e) {
    super(e, new At());
  }
}
Ye.extension = {
  type: [
    h.WebGPUPipes
  ],
  name: "particle"
};
class Ke {
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
    b.return(t.geometry), b.return(t), this._gpuSpriteHash[e.uid] = null, e.off("destroyed", this._destroyRenderableBound);
  }
  _updateBatchableSprite(e, t) {
    t.geometry.update(e), t.texture = e._texture;
  }
  _getGpuSprite(e) {
    return this._gpuSpriteHash[e.uid] || this._initGPUSprite(e);
  }
  _initGPUSprite(e) {
    const t = b.get(re);
    return t.geometry = b.get(ct), t.renderable = e, t.transform = e.groupTransform, t.texture = e._texture, t.roundPixels = this._renderer._roundPixels | e._roundPixels, this._gpuSpriteHash[e.uid] = t, e.didViewUpdate || this._updateBatchableSprite(e, t), e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuSpriteHash)
      this._gpuSpriteHash[e].geometry.destroy();
    this._gpuSpriteHash = null, this._renderer = null;
  }
}
Ke.extension = {
  type: [
    h.WebGLPipes,
    h.WebGPUPipes,
    h.CanvasPipes
  ],
  name: "nineSliceSprite"
};
const It = {
  name: "tiling-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `
    ),
    main: (
      /* wgsl */
      `
            uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

            position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
        `
    )
  },
  fragment: {
    header: (
      /* wgsl */
      `
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `
    ),
    main: (
      /* wgsl */
      `

            var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
            coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
            var unclamped = coord;
            coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

            var bias = 0.;

            if(unclamped.x == coord.x && unclamped.y == coord.y)
            {
                bias = -32.;
            } 

            outColor = textureSampleBias(uTexture, uSampler, coord, bias);
        `
    )
  }
}, Wt = {
  name: "tiling-bit",
  vertex: {
    header: (
      /* glsl */
      `
            uniform mat3 uTextureTransform;
            uniform vec4 uSizeAnchor;
        
        `
    ),
    main: (
      /* glsl */
      `
            uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

            position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
        `
    )
  },
  fragment: {
    header: (
      /* glsl */
      `
            uniform sampler2D uTexture;
            uniform mat3 uMapCoord;
            uniform vec4 uClampFrame;
            uniform vec2 uClampOffset;
        `
    ),
    main: (
      /* glsl */
      `

        vec2 coord = vUV + ceil(uClampOffset - vUV);
        coord = (uMapCoord * vec3(coord, 1.0)).xy;
        vec2 unclamped = coord;
        coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);
        
        outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0
    
        `
    )
  }
};
let $, j;
class Lt extends ee {
  constructor() {
    $ ?? ($ = Re({
      name: "tiling-sprite-shader",
      bits: [
        wt,
        It,
        Me
      ]
    })), j ?? (j = Pe({
      name: "tiling-sprite-shader",
      bits: [
        Bt,
        Wt,
        Ue
      ]
    }));
    const e = new k({
      uMapCoord: { value: new B(), type: "mat3x3<f32>" },
      uClampFrame: { value: new Float32Array([0, 0, 1, 1]), type: "vec4<f32>" },
      uClampOffset: { value: new Float32Array([0, 0]), type: "vec2<f32>" },
      uTextureTransform: { value: new B(), type: "mat3x3<f32>" },
      uSizeAnchor: { value: new Float32Array([100, 100, 0.5, 0.5]), type: "vec4<f32>" }
    });
    super({
      glProgram: j,
      gpuProgram: $,
      resources: {
        localUniforms: new k({
          uTransformMatrix: { value: new B(), type: "mat3x3<f32>" },
          uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
          uRound: { value: 0, type: "f32" }
        }),
        tilingUniforms: e,
        uTexture: U.EMPTY.source,
        uSampler: U.EMPTY.source.style
      }
    });
  }
  updateUniforms(e, t, r, a, n, i) {
    const o = this.resources.tilingUniforms, d = i.width, l = i.height, c = i.textureMatrix, u = o.uniforms.uTextureTransform;
    u.set(
      r.a * d / e,
      r.b * d / t,
      r.c * l / e,
      r.d * l / t,
      r.tx / e,
      r.ty / t
    ), u.invert(), o.uniforms.uMapCoord = c.mapCoord, o.uniforms.uClampFrame = c.uClampFrame, o.uniforms.uClampOffset = c.uClampOffset, o.uniforms.uTextureTransform = u, o.uniforms.uSizeAnchor[0] = e, o.uniforms.uSizeAnchor[1] = t, o.uniforms.uSizeAnchor[2] = a, o.uniforms.uSizeAnchor[3] = n, i && (this.resources.uTexture = i.source, this.resources.uSampler = i.source.style);
  }
}
class $t extends Ge {
  constructor() {
    super({
      positions: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      indices: new Uint32Array([0, 1, 2, 0, 2, 3])
    });
  }
}
function jt(s, e) {
  const t = s.anchor.x, r = s.anchor.y;
  e[0] = -t * s.width, e[1] = -r * s.height, e[2] = (1 - t) * s.width, e[3] = -r * s.height, e[4] = (1 - t) * s.width, e[5] = (1 - r) * s.height, e[6] = -t * s.width, e[7] = (1 - r) * s.height;
}
function Yt(s, e, t, r) {
  let a = 0;
  const n = s.length / e, i = r.a, o = r.b, d = r.c, l = r.d, c = r.tx, u = r.ty;
  for (t *= e; a < n; ) {
    const p = s[t], m = s[t + 1];
    s[t] = i * p + d * m + c, s[t + 1] = o * p + l * m + u, t += e, a++;
  }
}
function Kt(s, e) {
  const t = s.texture, r = t.frame.width, a = t.frame.height;
  let n = 0, i = 0;
  s._applyAnchorToTexture && (n = s.anchor.x, i = s.anchor.y), e[0] = e[6] = -n, e[2] = e[4] = 1 - n, e[1] = e[3] = -i, e[5] = e[7] = 1 - i;
  const o = B.shared;
  o.copyFrom(s._tileTransform.matrix), o.tx /= s.width, o.ty /= s.height, o.invert(), o.scale(s.width / r, s.height / a), Yt(e, 2, 0, o);
}
const O = new $t();
class Ne {
  constructor(e) {
    this._state = I.default2d, this._tilingSpriteDataHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_tilingSpriteDataHash");
  }
  validateRenderable(e) {
    const t = this._getTilingSpriteData(e), r = t.canBatch;
    this._updateCanBatch(e);
    const a = t.canBatch;
    if (a && a === r) {
      const { batchableMesh: n } = t;
      if (n && n.texture._source !== e.texture._source)
        return !n._batcher.checkAndUpdateTexture(n, e.texture);
    }
    return r !== a;
  }
  addRenderable(e, t) {
    const r = this._renderer.renderPipes.batch;
    this._updateCanBatch(e);
    const a = this._getTilingSpriteData(e), { geometry: n, canBatch: i } = a;
    if (i) {
      a.batchableMesh || (a.batchableMesh = new re());
      const o = a.batchableMesh;
      e.didViewUpdate && (this._updateBatchableMesh(e), o.geometry = n, o.renderable = e, o.transform = e.groupTransform, o.texture = e._texture), o.roundPixels = this._renderer._roundPixels | e._roundPixels, r.addToBatch(o, t);
    } else
      r.break(t), a.shader || (a.shader = new Lt()), this.updateRenderable(e), t.add(e);
  }
  execute(e) {
    const { shader: t } = this._tilingSpriteDataHash[e.uid];
    t.groups[0] = this._renderer.globalUniforms.bindGroup;
    const r = t.resources.localUniforms.uniforms;
    r.uTransformMatrix = e.groupTransform, r.uRound = this._renderer._roundPixels | e._roundPixels, W(
      e.groupColorAlpha,
      r.uColor,
      0
    ), this._state.blendMode = Z(e.groupBlendMode, e.texture._source), this._renderer.encoder.draw({
      geometry: O,
      shader: t,
      state: this._state
    });
  }
  updateRenderable(e) {
    const t = this._getTilingSpriteData(e), { canBatch: r } = t;
    if (r) {
      const { batchableMesh: a } = t;
      e.didViewUpdate && this._updateBatchableMesh(e), a._batcher.updateElement(a);
    } else if (e.didViewUpdate) {
      const { shader: a } = t;
      a.updateUniforms(
        e.width,
        e.height,
        e._tileTransform.matrix,
        e.anchor.x,
        e.anchor.y,
        e.texture
      );
    }
  }
  destroyRenderable(e) {
    var r;
    const t = this._getTilingSpriteData(e);
    t.batchableMesh = null, (r = t.shader) == null || r.destroy(), this._tilingSpriteDataHash[e.uid] = null, e.off("destroyed", this._destroyRenderableBound);
  }
  _getTilingSpriteData(e) {
    return this._tilingSpriteDataHash[e.uid] || this._initTilingSpriteData(e);
  }
  _initTilingSpriteData(e) {
    const t = new Ge({
      indices: O.indices,
      positions: O.positions.slice(),
      uvs: O.uvs.slice()
    });
    return this._tilingSpriteDataHash[e.uid] = {
      canBatch: !0,
      renderable: e,
      geometry: t
    }, e.on("destroyed", this._destroyRenderableBound), this._tilingSpriteDataHash[e.uid];
  }
  _updateBatchableMesh(e) {
    const t = this._getTilingSpriteData(e), { geometry: r } = t, a = e.texture.source.style;
    a.addressMode !== "repeat" && (a.addressMode = "repeat", a.update()), Kt(e, r.uvs), jt(e, r.positions);
  }
  destroy() {
    for (const e in this._tilingSpriteDataHash)
      this.destroyRenderable(this._tilingSpriteDataHash[e].renderable);
    this._tilingSpriteDataHash = null, this._renderer = null;
  }
  _updateCanBatch(e) {
    const t = this._getTilingSpriteData(e), r = e.texture;
    let a = !0;
    return this._renderer.type === J.WEBGL && (a = this._renderer.context.supports.nonPowOf2wrapping), t.canBatch = r.textureMatrix.isSimple && (a || r.source.isPowerOfTwo), t.canBatch;
  }
}
Ne.extension = {
  type: [
    h.WebGLPipes,
    h.WebGPUPipes,
    h.CanvasPipes
  ],
  name: "tilingSprite"
};
const Nt = {
  name: "local-uniform-msdf-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32,
                uRound:f32,
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
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
  },
  fragment: {
    header: (
      /* wgsl */
      `
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
         `
    ),
    main: (
      /* wgsl */
      ` 
            outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
        `
    )
  }
}, qt = {
  name: "local-uniform-msdf-bit",
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
            modelMatrix *= uTransformMatrix;
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
  },
  fragment: {
    header: (
      /* glsl */
      `
            uniform float uDistance;
         `
    ),
    main: (
      /* glsl */
      ` 
            outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
        `
    )
  }
}, Xt = {
  name: "msdf-bit",
  fragment: {
    header: (
      /* wgsl */
      `
            fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {
                
                // MSDF
                var median = msdfColor.r + msdfColor.g + msdfColor.b -
                    min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                    max(msdfColor.r, max(msdfColor.g, msdfColor.b));
            
                // SDF
                median = min(median, msdfColor.a);

                var screenPxDistance = distance * (median - 0.5);
                var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
                var coverage: f32 = pow(shapeColor.a * alpha, gamma);

                return coverage;
             
            }
        `
    )
  }
}, Qt = {
  name: "msdf-bit",
  fragment: {
    header: (
      /* glsl */
      `
            float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {
                
                // MSDF
                float median = msdfColor.r + msdfColor.g + msdfColor.b -
                                min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                                max(msdfColor.r, max(msdfColor.g, msdfColor.b));
               
                // SDF
                median = min(median, msdfColor.a);
            
                float screenPxDistance = distance * (median - 0.5);
                float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
           
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
                float gamma = mix(1.0, 1.0 / 2.2, luma);
                float coverage = pow(shapeColor.a * alpha, gamma);  
              
                return coverage;
            }
        `
    )
  }
};
let Y, K;
class Jt extends ee {
  constructor() {
    const e = new k({
      uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      uTransformMatrix: { value: new B(), type: "mat3x3<f32>" },
      uDistance: { value: 4, type: "f32" },
      uRound: { value: 0, type: "f32" }
    }), t = ht();
    Y ?? (Y = Re({
      name: "sdf-shader",
      bits: [
        ft,
        pt(t),
        Nt,
        Xt,
        Me
      ]
    })), K ?? (K = Pe({
      name: "sdf-shader",
      bits: [
        gt,
        mt(t),
        qt,
        Qt,
        Ue
      ]
    })), super({
      glProgram: K,
      gpuProgram: Y,
      resources: {
        localUniforms: e,
        batchSamplers: xt(t)
      }
    });
  }
}
class qe {
  constructor(e) {
    this._gpuBitmapText = {}, this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_gpuBitmapText");
  }
  validateRenderable(e) {
    const t = this._getGpuBitmapText(e);
    return e._didTextUpdate && (e._didTextUpdate = !1, this._updateContext(e, t)), this._renderer.renderPipes.graphics.validateRenderable(t);
  }
  addRenderable(e, t) {
    const r = this._getGpuBitmapText(e);
    ye(e, r), e._didTextUpdate && (e._didTextUpdate = !1, this._updateContext(e, r)), this._renderer.renderPipes.graphics.addRenderable(r, t), r.context.customShader && this._updateDistanceField(e);
  }
  destroyRenderable(e) {
    e.off("destroyed", this._destroyRenderableBound), this._destroyRenderableByUid(e.uid);
  }
  _destroyRenderableByUid(e) {
    const t = this._gpuBitmapText[e].context;
    t.customShader && (b.return(t.customShader), t.customShader = null), b.return(this._gpuBitmapText[e]), this._gpuBitmapText[e] = null;
  }
  updateRenderable(e) {
    const t = this._getGpuBitmapText(e);
    ye(e, t), this._renderer.renderPipes.graphics.updateRenderable(t), t.context.customShader && this._updateDistanceField(e);
  }
  _updateContext(e, t) {
    const { context: r } = t, a = _t.getFont(e.text, e._style);
    r.clear(), a.distanceField.type !== "none" && (r.customShader || (r.customShader = b.get(Jt)));
    const n = Array.from(e.text), i = e._style;
    let o = a.baseLineOffset;
    const d = bt(n, i, a, !0);
    let l = 0;
    const c = i.padding, u = d.scale;
    let p = d.width, m = d.height + d.offsetY;
    i._stroke && (p += i._stroke.width / u, m += i._stroke.width / u), r.translate(-e._anchor._x * p - c, -e._anchor._y * m - c).scale(u, u);
    const g = a.applyFillAsTint ? i._fill.color : 16777215;
    for (let f = 0; f < d.lines.length; f++) {
      const _ = d.lines[f];
      for (let x = 0; x < _.charPositions.length; x++) {
        const C = n[l++], T = a.chars[C];
        T != null && T.texture && r.texture(
          T.texture,
          g || "black",
          Math.round(_.charPositions[x] + T.xOffset),
          Math.round(o + T.yOffset)
        );
      }
      o += a.lineHeight;
    }
  }
  _getGpuBitmapText(e) {
    return this._gpuBitmapText[e.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = b.get(yt);
    return this._gpuBitmapText[e.uid] = t, this._updateContext(e, t), e.on("destroyed", this._destroyRenderableBound), this._gpuBitmapText[e.uid];
  }
  _updateDistanceField(e) {
    const t = this._getGpuBitmapText(e).context, r = e._style.fontFamily, a = X.get(`${r}-bitmap`), { a: n, b: i, c: o, d } = e.groupTransform, l = Math.sqrt(n * n + i * i), c = Math.sqrt(o * o + d * d), u = (Math.abs(l) + Math.abs(c)) / 2, p = a.baseRenderedFontSize / e._style.fontSize, m = u * a.distanceField.range * (1 / p);
    t.customShader.resources.localUniforms.uniforms.uDistance = m;
  }
  destroy() {
    for (const e in this._gpuBitmapText)
      this._destroyRenderableByUid(e);
    this._gpuBitmapText = null, this._renderer = null;
  }
}
qe.extension = {
  type: [
    h.WebGLPipes,
    h.WebGPUPipes,
    h.CanvasPipes
  ],
  name: "bitmapText"
};
function ye(s, e) {
  e.groupTransform = s.groupTransform, e.groupColorAlpha = s.groupColorAlpha, e.groupColor = s.groupColor, e.groupBlendMode = s.groupBlendMode, e.globalDisplayStatus = s.globalDisplayStatus, e.groupTransform = s.groupTransform, e.localDisplayStatus = s.localDisplayStatus, e.groupAlpha = s.groupAlpha, e._roundPixels = s._roundPixels;
}
class Xe {
  constructor(e) {
    this._gpuText = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.runners.resolutionChange.add(this), this._renderer.renderableGC.addManagedHash(this, "_gpuText");
  }
  resolutionChange() {
    for (const e in this._gpuText) {
      const t = this._gpuText[e];
      if (!t)
        continue;
      const r = t.batchableSprite.renderable;
      r._autoResolution && (r._resolution = this._renderer.resolution, r.onViewUpdate());
    }
  }
  validateRenderable(e) {
    const t = this._getGpuText(e), r = e._getKey();
    return t.textureNeedsUploading ? (t.textureNeedsUploading = !1, !0) : t.currentKey !== r;
  }
  addRenderable(e, t) {
    const a = this._getGpuText(e).batchableSprite;
    e._didTextUpdate && this._updateText(e), this._renderer.renderPipes.batch.addToBatch(a, t);
  }
  updateRenderable(e) {
    const r = this._getGpuText(e).batchableSprite;
    e._didTextUpdate && this._updateText(e), r._batcher.updateElement(r);
  }
  destroyRenderable(e) {
    e.off("destroyed", this._destroyRenderableBound), this._destroyRenderableById(e.uid);
  }
  _destroyRenderableById(e) {
    const t = this._gpuText[e];
    this._renderer.htmlText.decreaseReferenceCount(t.currentKey), b.return(t.batchableSprite), this._gpuText[e] = null;
  }
  _updateText(e) {
    const t = e._getKey(), r = this._getGpuText(e), a = r.batchableSprite;
    r.currentKey !== t && this._updateGpuText(e).catch((i) => {
      console.error(i);
    }), e._didTextUpdate = !1;
    const n = e._style.padding;
    Q(a.bounds, e._anchor, a.texture, n);
  }
  async _updateGpuText(e) {
    e._didTextUpdate = !1;
    const t = this._getGpuText(e);
    if (t.generatingTexture)
      return;
    const r = e._getKey();
    this._renderer.htmlText.decreaseReferenceCount(t.currentKey), t.generatingTexture = !0, t.currentKey = r;
    const a = e.resolution ?? this._renderer.resolution, n = await this._renderer.htmlText.getManagedTexture(
      e.text,
      a,
      e._style,
      e._getKey()
    ), i = t.batchableSprite;
    i.texture = t.texture = n, t.generatingTexture = !1, t.textureNeedsUploading = !0, e.onViewUpdate();
    const o = e._style.padding;
    Q(i.bounds, e._anchor, i.texture, o);
  }
  _getGpuText(e) {
    return this._gpuText[e.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = {
      texture: U.EMPTY,
      currentKey: "--",
      batchableSprite: b.get(ke),
      textureNeedsUploading: !1,
      generatingTexture: !1
    }, r = t.batchableSprite;
    return r.renderable = e, r.transform = e.groupTransform, r.texture = U.EMPTY, r.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, r.roundPixels = this._renderer._roundPixels | e._roundPixels, e._resolution = e._autoResolution ? this._renderer.resolution : e.resolution, this._gpuText[e.uid] = t, e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuText)
      this._destroyRenderableById(e);
    this._gpuText = null, this._renderer = null;
  }
}
Xe.extension = {
  type: [
    h.WebGLPipes,
    h.WebGPUPipes,
    h.CanvasPipes
  ],
  name: "htmlText"
};
function Zt() {
  const { userAgent: s } = Fe.get().getNavigator();
  return /^((?!chrome|android).)*safari/i.test(s);
}
const er = new Ce();
function Qe(s, e, t, r) {
  const a = er;
  a.minX = 0, a.minY = 0, a.maxX = s.width / r | 0, a.maxY = s.height / r | 0;
  const n = w.getOptimalTexture(
    a.width,
    a.height,
    r,
    !1
  );
  return n.source.uploadMethodId = "image", n.source.resource = s, n.source.alphaMode = "premultiply-alpha-on-upload", n.frame.width = e / r, n.frame.height = t / r, n.source.emit("update", n.source), n.updateUvs(), n;
}
function tr(s, e) {
  const t = e.fontFamily, r = [], a = {}, n = /font-family:([^;"\s]+)/g, i = s.match(n);
  function o(d) {
    a[d] || (r.push(d), a[d] = !0);
  }
  if (Array.isArray(t))
    for (let d = 0; d < t.length; d++)
      o(t[d]);
  else
    o(t);
  i && i.forEach((d) => {
    const l = d.split(":")[1].trim();
    o(l);
  });
  for (const d in e.tagStyles) {
    const l = e.tagStyles[d].fontFamily;
    o(l);
  }
  return r;
}
async function rr(s) {
  const t = await (await Fe.get().fetch(s)).blob(), r = new FileReader();
  return await new Promise((n, i) => {
    r.onloadend = () => n(r.result), r.onerror = i, r.readAsDataURL(t);
  });
}
async function Te(s, e) {
  const t = await rr(e);
  return `@font-face {
        font-family: "${s.fontFamily}";
        src: url('${t}');
        font-weight: ${s.fontWeight};
        font-style: ${s.fontStyle};
    }`;
}
const V = /* @__PURE__ */ new Map();
async function ar(s, e, t) {
  const r = s.filter((a) => X.has(`${a}-and-url`)).map((a, n) => {
    if (!V.has(a)) {
      const { url: i } = X.get(`${a}-and-url`);
      n === 0 ? V.set(a, Te({
        fontWeight: e.fontWeight,
        fontStyle: e.fontStyle,
        fontFamily: a
      }, i)) : V.set(a, Te({
        fontWeight: t.fontWeight,
        fontStyle: t.fontStyle,
        fontFamily: a
      }, i));
    }
    return V.get(a);
  });
  return (await Promise.all(r)).join(`
`);
}
function sr(s, e, t, r, a) {
  const { domElement: n, styleElement: i, svgRoot: o } = a;
  n.innerHTML = `<style>${e.cssStyle}</style><div style='padding:0;'>${s}</div>`, n.setAttribute("style", `transform: scale(${t});transform-origin: top left; display: inline-block`), i.textContent = r;
  const { width: d, height: l } = a.image;
  return o.setAttribute("width", d.toString()), o.setAttribute("height", l.toString()), new XMLSerializer().serializeToString(o);
}
function nr(s, e) {
  const t = D.getOptimalCanvasAndContext(
    s.width,
    s.height,
    e
  ), { context: r } = t;
  return r.clearRect(0, 0, s.width, s.height), r.drawImage(s, 0, 0), t;
}
function ir(s, e, t) {
  return new Promise(async (r) => {
    t && await new Promise((a) => setTimeout(a, 100)), s.onload = () => {
      r();
    }, s.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`, s.crossOrigin = "anonymous";
  });
}
class ae {
  constructor(e) {
    this._activeTextures = {}, this._renderer = e, this._createCanvas = e.type === J.WEBGPU;
  }
  getTexture(e) {
    return this._buildTexturePromise(
      e.text,
      e.resolution,
      e.style
    );
  }
  getManagedTexture(e, t, r, a) {
    if (this._activeTextures[a])
      return this._increaseReferenceCount(a), this._activeTextures[a].promise;
    const n = this._buildTexturePromise(e, t, r).then((i) => (this._activeTextures[a].texture = i, i));
    return this._activeTextures[a] = {
      texture: null,
      promise: n,
      usageCount: 1
    }, n;
  }
  async _buildTexturePromise(e, t, r) {
    const a = b.get(Ie), n = tr(e, r), i = await ar(
      n,
      r,
      te.defaultTextStyle
    ), o = Ft(e, r, i, a), d = Math.ceil(Math.ceil(Math.max(1, o.width) + r.padding * 2) * t), l = Math.ceil(Math.ceil(Math.max(1, o.height) + r.padding * 2) * t), c = a.image, u = 2;
    c.width = (d | 0) + u, c.height = (l | 0) + u;
    const p = sr(e, r, t, i, a);
    await ir(c, p, Zt() && n.length > 0);
    const m = c;
    let g;
    this._createCanvas && (g = nr(c, t));
    const f = Qe(
      g ? g.canvas : m,
      c.width - u,
      c.height - u,
      t
    );
    return this._createCanvas && (this._renderer.texture.initSource(f.source), D.returnCanvasAndContext(g)), b.return(a), f;
  }
  _increaseReferenceCount(e) {
    this._activeTextures[e].usageCount++;
  }
  decreaseReferenceCount(e) {
    const t = this._activeTextures[e];
    t && (t.usageCount--, t.usageCount === 0 && (t.texture ? this._cleanUp(t) : t.promise.then((r) => {
      t.texture = r, this._cleanUp(t);
    }).catch(() => {
      E("HTMLTextSystem: Failed to clean texture");
    }), this._activeTextures[e] = null));
  }
  _cleanUp(e) {
    w.returnTexture(e.texture), e.texture.source.resource = null, e.texture.source.uploadMethodId = "unknown";
  }
  getReferenceCount(e) {
    return this._activeTextures[e].usageCount;
  }
  destroy() {
    this._activeTextures = null;
  }
}
ae.extension = {
  type: [
    h.WebGLSystem,
    h.WebGPUSystem,
    h.CanvasSystem
  ],
  name: "htmlText"
};
ae.defaultFontOptions = {
  fontFamily: "Arial",
  fontStyle: "normal",
  fontWeight: "normal"
};
class Je {
  constructor(e) {
    this._gpuText = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.runners.resolutionChange.add(this), this._renderer.renderableGC.addManagedHash(this, "_gpuText");
  }
  resolutionChange() {
    for (const e in this._gpuText) {
      const t = this._gpuText[e];
      if (!t)
        continue;
      const r = t.batchableSprite.renderable;
      r._autoResolution && (r._resolution = this._renderer.resolution, r.onViewUpdate());
    }
  }
  validateRenderable(e) {
    const t = this._getGpuText(e), r = e._getKey();
    return t.currentKey !== r;
  }
  addRenderable(e, t) {
    const a = this._getGpuText(e).batchableSprite;
    e._didTextUpdate && this._updateText(e), this._renderer.renderPipes.batch.addToBatch(a, t);
  }
  updateRenderable(e) {
    const r = this._getGpuText(e).batchableSprite;
    e._didTextUpdate && this._updateText(e), r._batcher.updateElement(r);
  }
  destroyRenderable(e) {
    e.off("destroyed", this._destroyRenderableBound), this._destroyRenderableById(e.uid);
  }
  _destroyRenderableById(e) {
    const t = this._gpuText[e];
    this._renderer.canvasText.decreaseReferenceCount(t.currentKey), b.return(t.batchableSprite), this._gpuText[e] = null;
  }
  _updateText(e) {
    const t = e._getKey(), r = this._getGpuText(e), a = r.batchableSprite;
    r.currentKey !== t && this._updateGpuText(e), e._didTextUpdate = !1;
    const n = e._style.padding;
    Q(a.bounds, e._anchor, a.texture, n);
  }
  _updateGpuText(e) {
    const t = this._getGpuText(e), r = t.batchableSprite;
    t.texture && this._renderer.canvasText.decreaseReferenceCount(t.currentKey), t.texture = r.texture = this._renderer.canvasText.getManagedTexture(e), t.currentKey = e._getKey(), r.texture = t.texture;
  }
  _getGpuText(e) {
    return this._gpuText[e.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = {
      texture: null,
      currentKey: "--",
      batchableSprite: b.get(ke)
    };
    return t.batchableSprite.renderable = e, t.batchableSprite.transform = e.groupTransform, t.batchableSprite.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, t.batchableSprite.roundPixels = this._renderer._roundPixels | e._roundPixels, this._gpuText[e.uid] = t, e._resolution = e._autoResolution ? this._renderer.resolution : e.resolution, this._updateText(e), e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuText)
      this._destroyRenderableById(e);
    this._gpuText = null, this._renderer = null;
  }
}
Je.extension = {
  type: [
    h.WebGLPipes,
    h.WebGPUPipes,
    h.CanvasPipes
  ],
  name: "text"
};
function ve(s, e, t) {
  for (let r = 0, a = 4 * t * e; r < e; ++r, a += 4)
    if (s[a + 3] !== 0)
      return !1;
  return !0;
}
function Se(s, e, t, r, a) {
  const n = 4 * e;
  for (let i = r, o = r * n + 4 * t; i <= a; ++i, o += n)
    if (s[o + 3] !== 0)
      return !1;
  return !0;
}
function or(s, e = 1) {
  const { width: t, height: r } = s, a = s.getContext("2d", {
    willReadFrequently: !0
  });
  if (a === null)
    throw new TypeError("Failed to get canvas 2D context");
  const i = a.getImageData(0, 0, t, r).data;
  let o = 0, d = 0, l = t - 1, c = r - 1;
  for (; d < r && ve(i, t, d); )
    ++d;
  if (d === r)
    return ue.EMPTY;
  for (; ve(i, t, c); )
    --c;
  for (; Se(i, t, o, d, c); )
    ++o;
  for (; Se(i, t, l, d, c); )
    --l;
  return ++l, ++c, new ue(o / e, d / e, (l - o) / e, (c - d) / e);
}
class Ze {
  constructor(e) {
    this._activeTextures = {}, this._renderer = e;
  }
  getTextureSize(e, t, r) {
    const a = F.measureText(e || " ", r);
    let n = Math.ceil(Math.ceil(Math.max(1, a.width) + r.padding * 2) * t), i = Math.ceil(Math.ceil(Math.max(1, a.height) + r.padding * 2) * t);
    return n = Math.ceil(n - 1e-6), i = Math.ceil(i - 1e-6), n = ce(n), i = ce(i), { width: n, height: i };
  }
  getTexture(e, t, r, a) {
    typeof e == "string" && (Tt("8.0.0", "CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"), e = {
      text: e,
      style: r,
      resolution: t
    }), e.style instanceof N || (e.style = new N(e.style));
    const { texture: n, canvasAndContext: i } = this.createTextureAndCanvas(
      e
    );
    return this._renderer.texture.initSource(n._source), D.returnCanvasAndContext(i), n;
  }
  createTextureAndCanvas(e) {
    const { text: t, style: r } = e, a = e.resolution ?? this._renderer.resolution, n = F.measureText(t || " ", r), i = Math.ceil(Math.ceil(Math.max(1, n.width) + r.padding * 2) * a), o = Math.ceil(Math.ceil(Math.max(1, n.height) + r.padding * 2) * a), d = D.getOptimalCanvasAndContext(i, o), { canvas: l } = d;
    this.renderTextToCanvas(t, r, a, d);
    const c = Qe(l, i, o, a);
    if (r.trim) {
      const u = or(l, a);
      c.frame.copyFrom(u), c.updateUvs();
    }
    return { texture: c, canvasAndContext: d };
  }
  getManagedTexture(e) {
    e._resolution = e._autoResolution ? this._renderer.resolution : e.resolution;
    const t = e._getKey();
    if (this._activeTextures[t])
      return this._increaseReferenceCount(t), this._activeTextures[t].texture;
    const { texture: r, canvasAndContext: a } = this.createTextureAndCanvas(e);
    return this._activeTextures[t] = {
      canvasAndContext: a,
      texture: r,
      usageCount: 1
    }, r;
  }
  _increaseReferenceCount(e) {
    this._activeTextures[e].usageCount++;
  }
  decreaseReferenceCount(e) {
    const t = this._activeTextures[e];
    if (t.usageCount--, t.usageCount === 0) {
      D.returnCanvasAndContext(t.canvasAndContext), w.returnTexture(t.texture);
      const r = t.texture.source;
      r.resource = null, r.uploadMethodId = "unknown", r.alphaMode = "no-premultiply-alpha", this._activeTextures[e] = null;
    }
  }
  getReferenceCount(e) {
    return this._activeTextures[e].usageCount;
  }
  /**
   * Renders text to its canvas, and updates its texture.
   *
   * By default this is used internally to ensure the texture is correct before rendering,
   * but it can be used called externally, for example from this class to 'pre-generate' the texture from a piece of text,
   * and then shared across multiple Sprites.
   * @param text
   * @param style
   * @param resolution
   * @param canvasAndContext
   */
  renderTextToCanvas(e, t, r, a) {
    var C, T, R, A;
    const { canvas: n, context: i } = a, o = vt(t), d = F.measureText(e || " ", t), l = d.lines, c = d.lineHeight, u = d.lineWidths, p = d.maxLineWidth, m = d.fontProperties, g = n.height;
    if (i.resetTransform(), i.scale(r, r), i.textBaseline = t.textBaseline, (C = t._stroke) != null && C.width) {
      const S = t._stroke;
      i.lineWidth = S.width, i.miterLimit = S.miterLimit, i.lineJoin = S.join, i.lineCap = S.cap;
    }
    i.font = o;
    let f, _;
    const x = t.dropShadow ? 2 : 1;
    for (let S = 0; S < x; ++S) {
      const P = t.dropShadow && S === 0, M = P ? Math.ceil(Math.max(1, g) + t.padding * 2) : 0, et = M * r;
      if (P) {
        i.fillStyle = "black", i.strokeStyle = "black";
        const v = t.dropShadow, tt = v.color, rt = v.alpha;
        i.shadowColor = G.shared.setValue(tt).setAlpha(rt).toRgbaString();
        const at = v.blur * r, ie = v.distance * r;
        i.shadowBlur = at, i.shadowOffsetX = Math.cos(v.angle) * ie, i.shadowOffsetY = Math.sin(v.angle) * ie + et;
      } else
        i.fillStyle = t._fill ? le(t._fill, i) : null, (T = t._stroke) != null && T.width && (i.strokeStyle = le(t._stroke, i)), i.shadowColor = "black";
      let se = (c - m.fontSize) / 2;
      c - m.fontSize < 0 && (se = 0);
      const ne = ((R = t._stroke) == null ? void 0 : R.width) ?? 0;
      for (let v = 0; v < l.length; v++)
        f = ne / 2, _ = ne / 2 + v * c + m.ascent + se, t.align === "right" ? f += p - u[v] : t.align === "center" && (f += (p - u[v]) / 2), (A = t._stroke) != null && A.width && this._drawLetterSpacing(
          l[v],
          t,
          a,
          f + t.padding,
          _ + t.padding - M,
          !0
        ), t._fill !== void 0 && this._drawLetterSpacing(
          l[v],
          t,
          a,
          f + t.padding,
          _ + t.padding - M
        );
    }
  }
  /**
   * Render the text with letter-spacing.
   * @param text - The text to draw
   * @param style
   * @param canvasAndContext
   * @param x - Horizontal position to draw the text
   * @param y - Vertical position to draw the text
   * @param isStroke - Is this drawing for the outside stroke of the
   *  text? If not, it's for the inside fill
   */
  _drawLetterSpacing(e, t, r, a, n, i = !1) {
    const { context: o } = r, d = t.letterSpacing;
    let l = !1;
    if (F.experimentalLetterSpacingSupported && (F.experimentalLetterSpacing ? (o.letterSpacing = `${d}px`, o.textLetterSpacing = `${d}px`, l = !0) : (o.letterSpacing = "0px", o.textLetterSpacing = "0px")), d === 0 || l) {
      i ? o.strokeText(e, a, n) : o.fillText(e, a, n);
      return;
    }
    let c = a;
    const u = F.graphemeSegmenter(e);
    let p = o.measureText(e).width, m = 0;
    for (let g = 0; g < u.length; ++g) {
      const f = u[g];
      i ? o.strokeText(f, c, n) : o.fillText(f, c, n);
      let _ = "";
      for (let x = g + 1; x < u.length; ++x)
        _ += u[x];
      m = o.measureText(_).width, c += p - m + d, p = m;
    }
  }
  destroy() {
    this._activeTextures = null;
  }
}
Ze.extension = {
  type: [
    h.WebGLSystem,
    h.WebGPUSystem,
    h.CanvasSystem
  ],
  name: "canvasText"
};
y.add(Ae);
y.add(De);
y.add(We);
y.add(St);
y.add(Le);
y.add(je);
y.add(Ye);
y.add(Ze);
y.add(Je);
y.add(qe);
y.add(ae);
y.add(Xe);
y.add(Ne);
y.add(Ke);
y.add(Oe);
y.add(ze);
