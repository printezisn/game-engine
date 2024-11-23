var ku = Object.defineProperty;
var Eu = (s, t, e) => t in s ? ku(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var Gt = (s, t, e) => Eu(s, typeof t != "symbol" ? t + "" : t, e);
const W = {
  gameName: "",
  gameContainer: document.body,
  maxFPS: 60,
  debug: !1,
  assets: {
    basePath: "/assets",
    manifest: {},
    extra: []
  },
  colors: {
    backgroundColor: "#000000"
  },
  screen: {
    width: 1280,
    aspectRatio: 1.7777777777777777
  },
  tickIntervalMillis: 16,
  loadingScene: {
    fontFamily: "Arial, sans-serif",
    fontSize: 28,
    textColor: 16777215,
    keepAliveTimeMS: 2e3,
    text: "Loading..."
  },
  pauseScene: {
    overlayColor: 0,
    overlayAlpha: 0.8,
    fontFamily: "Arial, sans-serif",
    titleFontSize: 48,
    subTitleFontSize: 28,
    textColor: 16777215,
    title: "Paused",
    subTitle: "Click/tap to continue"
  },
  signals: {
    onResize: "onResize",
    onOrientationChange: "onOrientationChange",
    onTick: "onTick",
    destroyLoadingScene: "destroyLoadingScene"
  },
  sounds: {
    click: "click"
  }
}, Y = {
  screen: {
    orientation: "landscape",
    width: 0,
    height: 0
  },
  scene: null,
  muted: localStorage.getItem("muted") === "true"
};
var D = /* @__PURE__ */ ((s) => (s.Application = "application", s.WebGLPipes = "webgl-pipes", s.WebGLPipesAdaptor = "webgl-pipes-adaptor", s.WebGLSystem = "webgl-system", s.WebGPUPipes = "webgpu-pipes", s.WebGPUPipesAdaptor = "webgpu-pipes-adaptor", s.WebGPUSystem = "webgpu-system", s.CanvasSystem = "canvas-system", s.CanvasPipesAdaptor = "canvas-pipes-adaptor", s.CanvasPipes = "canvas-pipes", s.Asset = "asset", s.LoadParser = "load-parser", s.ResolveParser = "resolve-parser", s.CacheParser = "cache-parser", s.DetectionParser = "detection-parser", s.MaskEffect = "mask-effect", s.BlendMode = "blend-mode", s.TextureSource = "texture-source", s.Environment = "environment", s.ShapeBuilder = "shape-builder", s.Batcher = "batcher", s))(D || {});
const Sr = (s) => {
  if (typeof s == "function" || typeof s == "object" && s.extension) {
    if (!s.extension)
      throw new Error("Extension class must have an extension object");
    s = { ...typeof s.extension != "object" ? { type: s.extension } : s.extension, ref: s };
  }
  if (typeof s == "object")
    s = { ...s };
  else
    throw new Error("Invalid extension type");
  return typeof s.type == "string" && (s.type = [s.type]), s;
}, Rs = (s, t) => Sr(s).priority ?? t, Pt = {
  /** @ignore */
  _addHandlers: {},
  /** @ignore */
  _removeHandlers: {},
  /** @ignore */
  _queue: {},
  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed.
   * @returns {extensions} For chaining.
   */
  remove(...s) {
    return s.map(Sr).forEach((t) => {
      t.type.forEach((e) => {
        var i, n;
        return (n = (i = this._removeHandlers)[e]) == null ? void 0 : n.call(i, t);
      });
    }), this;
  },
  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {extensions} For chaining.
   */
  add(...s) {
    return s.map(Sr).forEach((t) => {
      t.type.forEach((e) => {
        var r, o;
        const i = this._addHandlers, n = this._queue;
        i[e] ? (o = i[e]) == null || o.call(i, t) : (n[e] = n[e] || [], (r = n[e]) == null || r.push(t));
      });
    }), this;
  },
  /**
   * Internal method to handle extensions by name.
   * @param type - The extension type.
   * @param onAdd  - Function handler when extensions are added/registered {@link StrictExtensionFormat}.
   * @param onRemove  - Function handler when extensions are removed/unregistered {@link StrictExtensionFormat}.
   * @returns {extensions} For chaining.
   */
  handle(s, t, e) {
    var o;
    const i = this._addHandlers, n = this._removeHandlers;
    if (i[s] || n[s])
      throw new Error(`Extension type ${s} already has a handler`);
    i[s] = t, n[s] = e;
    const r = this._queue;
    return r[s] && ((o = r[s]) == null || o.forEach((a) => t(a)), delete r[s]), this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns {extensions} For chaining.
   */
  handleByMap(s, t) {
    return this.handle(
      s,
      (e) => {
        e.name && (t[e.name] = e.ref);
      },
      (e) => {
        e.name && delete t[e.name];
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions with a `name` property.
   * @param type - Type of extension to handle.
   * @param map - The array of named extensions.
   * @param defaultPriority - Fallback priority if none is defined.
   * @returns {extensions} For chaining.
   */
  handleByNamedList(s, t, e = -1) {
    return this.handle(
      s,
      (i) => {
        t.findIndex((r) => r.name === i.name) >= 0 || (t.push({ name: i.name, value: i.ref }), t.sort((r, o) => Rs(o.value, e) - Rs(r.value, e)));
      },
      (i) => {
        const n = t.findIndex((r) => r.name === i.name);
        n !== -1 && t.splice(n, 1);
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @param defaultPriority - The default priority to use if none is specified.
   * @returns {extensions} For chaining.
   */
  handleByList(s, t, e = -1) {
    return this.handle(
      s,
      (i) => {
        t.includes(i.ref) || (t.push(i.ref), t.sort((n, r) => Rs(r, e) - Rs(n, e)));
      },
      (i) => {
        const n = t.indexOf(i.ref);
        n !== -1 && t.splice(n, 1);
      }
    );
  }
}, Iu = {
  extension: {
    type: D.Environment,
    name: "browser",
    priority: -1
  },
  test: () => !0,
  load: async () => {
    await import("./browserAll-9zfcW6hG.js");
  }
}, Bu = {
  extension: {
    type: D.Environment,
    name: "webworker",
    priority: 0
  },
  test: () => typeof self < "u" && self.WorkerGlobalScope !== void 0,
  load: async () => {
    await import("./webworkerAll-B2K7Rp4L.js");
  }
};
class _t {
  /**
   * Creates a new `ObservablePoint`
   * @param observer - Observer to pass to listen for change events.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t, e, i) {
    this._x = e || 0, this._y = i || 0, this._observer = t;
  }
  /**
   * Creates a clone of this point.
   * @param observer - Optional observer to pass to the new observable point.
   * @returns a copy of this observable point
   */
  clone(t) {
    return new _t(t ?? this._observer, this._x, this._y);
  }
  /**
   * Sets the point to a new `x` and `y` position.
   * If `y` is omitted, both `x` and `y` will be set to `x`.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=x] - position of the point on the y axis
   * @returns The observable point instance itself
   */
  set(t = 0, e = t) {
    return (this._x !== t || this._y !== e) && (this._x = t, this._y = e, this._observer._onUpdate(this)), this;
  }
  /**
   * Copies x and y from the given point (`p`)
   * @param p - The point to copy from. Can be any of type that is or extends `PointData`
   * @returns The observable point instance itself
   */
  copyFrom(t) {
    return (this._x !== t.x || this._y !== t.y) && (this._x = t.x, this._y = t.y, this._observer._onUpdate(this)), this;
  }
  /**
   * Copies this point's x and y into that of the given point (`p`)
   * @param p - The point to copy to. Can be any of type that is or extends `PointData`
   * @returns The point (`p`) with values updated
   */
  copyTo(t) {
    return t.set(this._x, this._y), t;
  }
  /**
   * Accepts another point (`p`) and returns `true` if the given point is equal to this point
   * @param p - The point to check
   * @returns Returns `true` if both `x` and `y` are equal
   */
  equals(t) {
    return t.x === this._x && t.y === this._y;
  }
  toString() {
    return `[pixi.js/math:ObservablePoint x=0 y=0 scope=${this._observer}]`;
  }
  /** Position of the observable point on the x axis. */
  get x() {
    return this._x;
  }
  set x(t) {
    this._x !== t && (this._x = t, this._observer._onUpdate(this));
  }
  /** Position of the observable point on the y axis. */
  get y() {
    return this._y;
  }
  set y(t) {
    this._y !== t && (this._y = t, this._observer._onUpdate(this));
  }
}
var Je = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function po(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var Rh = { exports: {} };
(function(s) {
  var t = Object.prototype.hasOwnProperty, e = "~";
  function i() {
  }
  Object.create && (i.prototype = /* @__PURE__ */ Object.create(null), new i().__proto__ || (e = !1));
  function n(h, c, l) {
    this.fn = h, this.context = c, this.once = l || !1;
  }
  function r(h, c, l, d, f) {
    if (typeof l != "function")
      throw new TypeError("The listener must be a function");
    var u = new n(l, d || h, f), g = e ? e + c : c;
    return h._events[g] ? h._events[g].fn ? h._events[g] = [h._events[g], u] : h._events[g].push(u) : (h._events[g] = u, h._eventsCount++), h;
  }
  function o(h, c) {
    --h._eventsCount === 0 ? h._events = new i() : delete h._events[c];
  }
  function a() {
    this._events = new i(), this._eventsCount = 0;
  }
  a.prototype.eventNames = function() {
    var c = [], l, d;
    if (this._eventsCount === 0) return c;
    for (d in l = this._events)
      t.call(l, d) && c.push(e ? d.slice(1) : d);
    return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(l)) : c;
  }, a.prototype.listeners = function(c) {
    var l = e ? e + c : c, d = this._events[l];
    if (!d) return [];
    if (d.fn) return [d.fn];
    for (var f = 0, u = d.length, g = new Array(u); f < u; f++)
      g[f] = d[f].fn;
    return g;
  }, a.prototype.listenerCount = function(c) {
    var l = e ? e + c : c, d = this._events[l];
    return d ? d.fn ? 1 : d.length : 0;
  }, a.prototype.emit = function(c, l, d, f, u, g) {
    var p = e ? e + c : c;
    if (!this._events[p]) return !1;
    var m = this._events[p], x = arguments.length, y, v;
    if (m.fn) {
      switch (m.once && this.removeListener(c, m.fn, void 0, !0), x) {
        case 1:
          return m.fn.call(m.context), !0;
        case 2:
          return m.fn.call(m.context, l), !0;
        case 3:
          return m.fn.call(m.context, l, d), !0;
        case 4:
          return m.fn.call(m.context, l, d, f), !0;
        case 5:
          return m.fn.call(m.context, l, d, f, u), !0;
        case 6:
          return m.fn.call(m.context, l, d, f, u, g), !0;
      }
      for (v = 1, y = new Array(x - 1); v < x; v++)
        y[v - 1] = arguments[v];
      m.fn.apply(m.context, y);
    } else {
      var w = m.length, _;
      for (v = 0; v < w; v++)
        switch (m[v].once && this.removeListener(c, m[v].fn, void 0, !0), x) {
          case 1:
            m[v].fn.call(m[v].context);
            break;
          case 2:
            m[v].fn.call(m[v].context, l);
            break;
          case 3:
            m[v].fn.call(m[v].context, l, d);
            break;
          case 4:
            m[v].fn.call(m[v].context, l, d, f);
            break;
          default:
            if (!y) for (_ = 1, y = new Array(x - 1); _ < x; _++)
              y[_ - 1] = arguments[_];
            m[v].fn.apply(m[v].context, y);
        }
    }
    return !0;
  }, a.prototype.on = function(c, l, d) {
    return r(this, c, l, d, !1);
  }, a.prototype.once = function(c, l, d) {
    return r(this, c, l, d, !0);
  }, a.prototype.removeListener = function(c, l, d, f) {
    var u = e ? e + c : c;
    if (!this._events[u]) return this;
    if (!l)
      return o(this, u), this;
    var g = this._events[u];
    if (g.fn)
      g.fn === l && (!f || g.once) && (!d || g.context === d) && o(this, u);
    else {
      for (var p = 0, m = [], x = g.length; p < x; p++)
        (g[p].fn !== l || f && !g[p].once || d && g[p].context !== d) && m.push(g[p]);
      m.length ? this._events[u] = m.length === 1 ? m[0] : m : o(this, u);
    }
    return this;
  }, a.prototype.removeAllListeners = function(c) {
    var l;
    return c ? (l = e ? e + c : c, this._events[l] && o(this, l)) : (this._events = new i(), this._eventsCount = 0), this;
  }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = e, a.EventEmitter = a, s.exports = a;
})(Rh);
var Ru = Rh.exports;
const kt = /* @__PURE__ */ po(Ru), Fu = Math.PI * 2, Lu = 180 / Math.PI, Ou = Math.PI / 180;
class Ct {
  /**
   * Creates a new `Point`
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t = 0, e = 0) {
    this.x = 0, this.y = 0, this.x = t, this.y = e;
  }
  /**
   * Creates a clone of this point
   * @returns A clone of this point
   */
  clone() {
    return new Ct(this.x, this.y);
  }
  /**
   * Copies `x` and `y` from the given point into this point
   * @param p - The point to copy from
   * @returns The point instance itself
   */
  copyFrom(t) {
    return this.set(t.x, t.y), this;
  }
  /**
   * Copies this point's x and y into the given point (`p`).
   * @param p - The point to copy to. Can be any of type that is or extends `PointData`
   * @returns The point (`p`) with values updated
   */
  copyTo(t) {
    return t.set(this.x, this.y), t;
  }
  /**
   * Accepts another point (`p`) and returns `true` if the given point is equal to this point
   * @param p - The point to check
   * @returns Returns `true` if both `x` and `y` are equal
   */
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  /**
   * Sets the point to a new `x` and `y` position.
   * If `y` is omitted, both `x` and `y` will be set to `x`.
   * @param {number} [x=0] - position of the point on the `x` axis
   * @param {number} [y=x] - position of the point on the `y` axis
   * @returns The point instance itself
   */
  set(t = 0, e = t) {
    return this.x = t, this.y = e, this;
  }
  toString() {
    return `[pixi.js/math:Point x=${this.x} y=${this.y}]`;
  }
  /**
   * A static Point object with `x` and `y` values of `0`. Can be used to avoid creating new objects multiple times.
   * @readonly
   */
  static get shared() {
    return Un.x = 0, Un.y = 0, Un;
  }
}
const Un = new Ct();
class j {
  /**
   * @param a - x scale
   * @param b - y skew
   * @param c - x skew
   * @param d - y scale
   * @param tx - x translation
   * @param ty - y translation
   */
  constructor(t = 1, e = 0, i = 0, n = 1, r = 0, o = 0) {
    this.array = null, this.a = t, this.b = e, this.c = i, this.d = n, this.tx = r, this.ty = o;
  }
  /**
   * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
   *
   * a = array[0]
   * b = array[1]
   * c = array[3]
   * d = array[4]
   * tx = array[2]
   * ty = array[5]
   * @param array - The array that the matrix will be populated from.
   */
  fromArray(t) {
    this.a = t[0], this.b = t[1], this.c = t[3], this.d = t[4], this.tx = t[2], this.ty = t[5];
  }
  /**
   * Sets the matrix properties.
   * @param a - Matrix component
   * @param b - Matrix component
   * @param c - Matrix component
   * @param d - Matrix component
   * @param tx - Matrix component
   * @param ty - Matrix component
   * @returns This matrix. Good for chaining method calls.
   */
  set(t, e, i, n, r, o) {
    return this.a = t, this.b = e, this.c = i, this.d = n, this.tx = r, this.ty = o, this;
  }
  /**
   * Creates an array from the current Matrix object.
   * @param transpose - Whether we need to transpose the matrix or not
   * @param [out=new Float32Array(9)] - If provided the array will be assigned to out
   * @returns The newly created array which contains the matrix
   */
  toArray(t, e) {
    this.array || (this.array = new Float32Array(9));
    const i = e || this.array;
    return t ? (i[0] = this.a, i[1] = this.b, i[2] = 0, i[3] = this.c, i[4] = this.d, i[5] = 0, i[6] = this.tx, i[7] = this.ty, i[8] = 1) : (i[0] = this.a, i[1] = this.c, i[2] = this.tx, i[3] = this.b, i[4] = this.d, i[5] = this.ty, i[6] = 0, i[7] = 0, i[8] = 1), i;
  }
  /**
   * Get a new position with the current transformation applied.
   * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
   * @param pos - The origin
   * @param {Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
   * @returns {Point} The new point, transformed through this matrix
   */
  apply(t, e) {
    e = e || new Ct();
    const i = t.x, n = t.y;
    return e.x = this.a * i + this.c * n + this.tx, e.y = this.b * i + this.d * n + this.ty, e;
  }
  /**
   * Get a new position with the inverse of the current transformation applied.
   * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
   * @param pos - The origin
   * @param {Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
   * @returns {Point} The new point, inverse-transformed through this matrix
   */
  applyInverse(t, e) {
    e = e || new Ct();
    const i = this.a, n = this.b, r = this.c, o = this.d, a = this.tx, h = this.ty, c = 1 / (i * o + r * -n), l = t.x, d = t.y;
    return e.x = o * c * l + -r * c * d + (h * r - a * o) * c, e.y = i * c * d + -n * c * l + (-h * i + a * n) * c, e;
  }
  /**
   * Translates the matrix on the x and y.
   * @param x - How much to translate x by
   * @param y - How much to translate y by
   * @returns This matrix. Good for chaining method calls.
   */
  translate(t, e) {
    return this.tx += t, this.ty += e, this;
  }
  /**
   * Applies a scale transformation to the matrix.
   * @param x - The amount to scale horizontally
   * @param y - The amount to scale vertically
   * @returns This matrix. Good for chaining method calls.
   */
  scale(t, e) {
    return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this;
  }
  /**
   * Applies a rotation transformation to the matrix.
   * @param angle - The angle in radians.
   * @returns This matrix. Good for chaining method calls.
   */
  rotate(t) {
    const e = Math.cos(t), i = Math.sin(t), n = this.a, r = this.c, o = this.tx;
    return this.a = n * e - this.b * i, this.b = n * i + this.b * e, this.c = r * e - this.d * i, this.d = r * i + this.d * e, this.tx = o * e - this.ty * i, this.ty = o * i + this.ty * e, this;
  }
  /**
   * Appends the given Matrix to this Matrix.
   * @param matrix - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  append(t) {
    const e = this.a, i = this.b, n = this.c, r = this.d;
    return this.a = t.a * e + t.b * n, this.b = t.a * i + t.b * r, this.c = t.c * e + t.d * n, this.d = t.c * i + t.d * r, this.tx = t.tx * e + t.ty * n + this.tx, this.ty = t.tx * i + t.ty * r + this.ty, this;
  }
  /**
   * Appends two matrix's and sets the result to this matrix. AB = A * B
   * @param a - The matrix to append.
   * @param b - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  appendFrom(t, e) {
    const i = t.a, n = t.b, r = t.c, o = t.d, a = t.tx, h = t.ty, c = e.a, l = e.b, d = e.c, f = e.d;
    return this.a = i * c + n * d, this.b = i * l + n * f, this.c = r * c + o * d, this.d = r * l + o * f, this.tx = a * c + h * d + e.tx, this.ty = a * l + h * f + e.ty, this;
  }
  /**
   * Sets the matrix based on all the available properties
   * @param x - Position on the x axis
   * @param y - Position on the y axis
   * @param pivotX - Pivot on the x axis
   * @param pivotY - Pivot on the y axis
   * @param scaleX - Scale on the x axis
   * @param scaleY - Scale on the y axis
   * @param rotation - Rotation in radians
   * @param skewX - Skew on the x axis
   * @param skewY - Skew on the y axis
   * @returns This matrix. Good for chaining method calls.
   */
  setTransform(t, e, i, n, r, o, a, h, c) {
    return this.a = Math.cos(a + c) * r, this.b = Math.sin(a + c) * r, this.c = -Math.sin(a - h) * o, this.d = Math.cos(a - h) * o, this.tx = t - (i * this.a + n * this.c), this.ty = e - (i * this.b + n * this.d), this;
  }
  /**
   * Prepends the given Matrix to this Matrix.
   * @param matrix - The matrix to prepend
   * @returns This matrix. Good for chaining method calls.
   */
  prepend(t) {
    const e = this.tx;
    if (t.a !== 1 || t.b !== 0 || t.c !== 0 || t.d !== 1) {
      const i = this.a, n = this.c;
      this.a = i * t.a + this.b * t.c, this.b = i * t.b + this.b * t.d, this.c = n * t.a + this.d * t.c, this.d = n * t.b + this.d * t.d;
    }
    return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this;
  }
  /**
   * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
   * @param transform - The transform to apply the properties to.
   * @returns The transform with the newly applied properties
   */
  decompose(t) {
    const e = this.a, i = this.b, n = this.c, r = this.d, o = t.pivot, a = -Math.atan2(-n, r), h = Math.atan2(i, e), c = Math.abs(a + h);
    return c < 1e-5 || Math.abs(Fu - c) < 1e-5 ? (t.rotation = h, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = a, t.skew.y = h), t.scale.x = Math.sqrt(e * e + i * i), t.scale.y = Math.sqrt(n * n + r * r), t.position.x = this.tx + (o.x * e + o.y * n), t.position.y = this.ty + (o.x * i + o.y * r), t;
  }
  /**
   * Inverts this matrix
   * @returns This matrix. Good for chaining method calls.
   */
  invert() {
    const t = this.a, e = this.b, i = this.c, n = this.d, r = this.tx, o = t * n - e * i;
    return this.a = n / o, this.b = -e / o, this.c = -i / o, this.d = t / o, this.tx = (i * this.ty - n * r) / o, this.ty = -(t * this.ty - e * r) / o, this;
  }
  /** Checks if this matrix is an identity matrix */
  isIdentity() {
    return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
  }
  /**
   * Resets this Matrix to an identity (default) matrix.
   * @returns This matrix. Good for chaining method calls.
   */
  identity() {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
  }
  /**
   * Creates a new Matrix object with the same values as this one.
   * @returns A copy of this matrix. Good for chaining method calls.
   */
  clone() {
    const t = new j();
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Changes the values of the given matrix to be the same as the ones in this matrix
   * @param matrix - The matrix to copy to.
   * @returns The matrix given in parameter with its values updated.
   */
  copyTo(t) {
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Changes the values of the matrix to be the same as the ones in given matrix
   * @param matrix - The matrix to copy from.
   * @returns this
   */
  copyFrom(t) {
    return this.a = t.a, this.b = t.b, this.c = t.c, this.d = t.d, this.tx = t.tx, this.ty = t.ty, this;
  }
  /**
   * check to see if two matrices are the same
   * @param matrix - The matrix to compare to.
   */
  equals(t) {
    return t.a === this.a && t.b === this.b && t.c === this.c && t.d === this.d && t.tx === this.tx && t.ty === this.ty;
  }
  toString() {
    return `[pixi.js:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`;
  }
  /**
   * A default (identity) matrix.
   *
   * This is a shared object, if you want to modify it consider creating a new `Matrix`
   * @readonly
   */
  static get IDENTITY() {
    return zu.identity();
  }
  /**
   * A static Matrix that can be used to avoid creating new objects.
   * Will always ensure the matrix is reset to identity when requested.
   * Use this object for fast but temporary calculations, as it may be mutated later on.
   * This is a different object to the `IDENTITY` object and so can be modified without changing `IDENTITY`.
   * @readonly
   */
  static get shared() {
    return Du.identity();
  }
}
const Du = new j(), zu = new j(), Xe = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], Ke = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], qe = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], Ze = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], Ar = [], Fh = [], Fs = Math.sign;
function Uu() {
  for (let s = 0; s < 16; s++) {
    const t = [];
    Ar.push(t);
    for (let e = 0; e < 16; e++) {
      const i = Fs(Xe[s] * Xe[e] + qe[s] * Ke[e]), n = Fs(Ke[s] * Xe[e] + Ze[s] * Ke[e]), r = Fs(Xe[s] * qe[e] + qe[s] * Ze[e]), o = Fs(Ke[s] * qe[e] + Ze[s] * Ze[e]);
      for (let a = 0; a < 16; a++)
        if (Xe[a] === i && Ke[a] === n && qe[a] === r && Ze[a] === o) {
          t.push(a);
          break;
        }
    }
  }
  for (let s = 0; s < 16; s++) {
    const t = new j();
    t.set(Xe[s], Ke[s], qe[s], Ze[s], 0, 0), Fh.push(t);
  }
}
Uu();
const et = {
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 0°       | East      |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  E: 0,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 45°↻     | Southeast |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  SE: 1,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 90°↻     | South     |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  S: 2,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 135°↻    | Southwest |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  SW: 3,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 180°     | West      |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  W: 4,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -135°/225°↻ | Northwest    |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  NW: 5,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -90°/270°↻  | North        |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  N: 6,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -45°/315°↻  | Northeast    |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  NE: 7,
  /**
   * Reflection about Y-axis.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  MIRROR_VERTICAL: 8,
  /**
   * Reflection about the main diagonal.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  MAIN_DIAGONAL: 10,
  /**
   * Reflection about X-axis.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  MIRROR_HORIZONTAL: 12,
  /**
   * Reflection about reverse diagonal.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  REVERSE_DIAGONAL: 14,
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the U-axis
   *    after rotating the axes.
   */
  uX: (s) => Xe[s],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: (s) => Ke[s],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: (s) => qe[s],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: (s) => Ze[s],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotation - symmetry whose opposite
   *   is needed. Only rotations have opposite symmetries while
   *   reflections don't.
   * @returns {GD8Symmetry} The opposite symmetry of `rotation`
   */
  inv: (s) => s & 8 ? s & 15 : -s & 7,
  /**
   * Composes the two D8 operations.
   *
   * Taking `^` as reflection:
   *
   * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
   * |-------|-----|-----|-----|-----|------|-------|-------|-------|
   * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
   * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
   * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
   * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
   * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
   * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
   * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
   * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
   *
   * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation, which
   *   is the row in the above cayley table.
   * @param {GD8Symmetry} rotationFirst - First operation, which
   *   is the column in the above cayley table.
   * @returns {GD8Symmetry} Composed operation
   */
  add: (s, t) => Ar[s][t],
  /**
   * Reverse of `add`.
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation
   * @param {GD8Symmetry} rotationFirst - First operation
   * @returns {GD8Symmetry} Result
   */
  sub: (s, t) => Ar[s][et.inv(t)],
  /**
   * Adds 180 degrees to rotation, which is a commutative
   * operation.
   * @memberof maths.groupD8
   * @param {number} rotation - The number to rotate.
   * @returns {number} Rotated number
   */
  rotate180: (s) => s ^ 4,
  /**
   * Checks if the rotation angle is vertical, i.e. south
   * or north. It doesn't work for reflections.
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotation - The number to check.
   * @returns {boolean} Whether or not the direction is vertical
   */
  isVertical: (s) => (s & 3) === 2,
  // rotation % 4 === 2
  /**
   * Approximates the vector `V(dx,dy)` into one of the
   * eight directions provided by `groupD8`.
   * @memberof maths.groupD8
   * @param {number} dx - X-component of the vector
   * @param {number} dy - Y-component of the vector
   * @returns {GD8Symmetry} Approximation of the vector into
   *  one of the eight symmetries.
   */
  byDirection: (s, t) => Math.abs(s) * 2 <= Math.abs(t) ? t >= 0 ? et.S : et.N : Math.abs(t) * 2 <= Math.abs(s) ? s > 0 ? et.E : et.W : t > 0 ? s > 0 ? et.SE : et.SW : s > 0 ? et.NE : et.NW,
  /**
   * Helps sprite to compensate texture packer rotation.
   * @memberof maths.groupD8
   * @param {Matrix} matrix - sprite world matrix
   * @param {GD8Symmetry} rotation - The rotation factor to use.
   * @param {number} tx - sprite anchoring
   * @param {number} ty - sprite anchoring
   */
  matrixAppendRotationInv: (s, t, e = 0, i = 0) => {
    const n = Fh[et.inv(t)];
    n.tx = e, n.ty = i, s.append(n);
  }
}, Ls = [new Ct(), new Ct(), new Ct(), new Ct()];
class pt {
  /**
   * @param x - The X coordinate of the upper-left corner of the rectangle
   * @param y - The Y coordinate of the upper-left corner of the rectangle
   * @param width - The overall width of the rectangle
   * @param height - The overall height of the rectangle
   */
  constructor(t = 0, e = 0, i = 0, n = 0) {
    this.type = "rectangle", this.x = Number(t), this.y = Number(e), this.width = Number(i), this.height = Number(n);
  }
  /** Returns the left edge of the rectangle. */
  get left() {
    return this.x;
  }
  /** Returns the right edge of the rectangle. */
  get right() {
    return this.x + this.width;
  }
  /** Returns the top edge of the rectangle. */
  get top() {
    return this.y;
  }
  /** Returns the bottom edge of the rectangle. */
  get bottom() {
    return this.y + this.height;
  }
  /** Determines whether the Rectangle is empty. */
  isEmpty() {
    return this.left === this.right || this.top === this.bottom;
  }
  /** A constant empty rectangle. This is a new object every time the property is accessed */
  static get EMPTY() {
    return new pt(0, 0, 0, 0);
  }
  /**
   * Creates a clone of this Rectangle
   * @returns a copy of the rectangle
   */
  clone() {
    return new pt(this.x, this.y, this.width, this.height);
  }
  /**
   * Converts a Bounds object to a Rectangle object.
   * @param bounds - The bounds to copy and convert to a rectangle.
   * @returns Returns itself.
   */
  copyFromBounds(t) {
    return this.x = t.minX, this.y = t.minY, this.width = t.maxX - t.minX, this.height = t.maxY - t.minY, this;
  }
  /**
   * Copies another rectangle to this one.
   * @param rectangle - The rectangle to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  /**
   * Copies this rectangle to another one.
   * @param rectangle - The rectangle to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rectangle
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Rectangle
   */
  contains(t, e) {
    return this.width <= 0 || this.height <= 0 ? !1 : t >= this.x && t < this.x + this.width && e >= this.y && e < this.y + this.height;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @returns Whether the x/y coordinates are within this rectangle
   */
  strokeContains(t, e, i) {
    const { width: n, height: r } = this;
    if (n <= 0 || r <= 0)
      return !1;
    const o = this.x, a = this.y, h = o - i / 2, c = o + n + i / 2, l = a - i / 2, d = a + r + i / 2, f = o + i / 2, u = o + n - i / 2, g = a + i / 2, p = a + r - i / 2;
    return t >= h && t <= c && e >= l && e <= d && !(t > f && t < u && e > g && e < p);
  }
  /**
   * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
   * Returns true only if the area of the intersection is >0, this means that Rectangles
   * sharing a side are not overlapping. Another side effect is that an arealess rectangle
   * (width or height equal to zero) can't intersect any other rectangle.
   * @param {Rectangle} other - The Rectangle to intersect with `this`.
   * @param {Matrix} transform - The transformation matrix of `other`.
   * @returns {boolean} A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.
   */
  intersects(t, e) {
    if (!e) {
      const b = this.x < t.x ? t.x : this.x;
      if ((this.right > t.right ? t.right : this.right) <= b)
        return !1;
      const P = this.y < t.y ? t.y : this.y;
      return (this.bottom > t.bottom ? t.bottom : this.bottom) > P;
    }
    const i = this.left, n = this.right, r = this.top, o = this.bottom;
    if (n <= i || o <= r)
      return !1;
    const a = Ls[0].set(t.left, t.top), h = Ls[1].set(t.left, t.bottom), c = Ls[2].set(t.right, t.top), l = Ls[3].set(t.right, t.bottom);
    if (c.x <= a.x || h.y <= a.y)
      return !1;
    const d = Math.sign(e.a * e.d - e.b * e.c);
    if (d === 0 || (e.apply(a, a), e.apply(h, h), e.apply(c, c), e.apply(l, l), Math.max(a.x, h.x, c.x, l.x) <= i || Math.min(a.x, h.x, c.x, l.x) >= n || Math.max(a.y, h.y, c.y, l.y) <= r || Math.min(a.y, h.y, c.y, l.y) >= o))
      return !1;
    const f = d * (h.y - a.y), u = d * (a.x - h.x), g = f * i + u * r, p = f * n + u * r, m = f * i + u * o, x = f * n + u * o;
    if (Math.max(g, p, m, x) <= f * a.x + u * a.y || Math.min(g, p, m, x) >= f * l.x + u * l.y)
      return !1;
    const y = d * (a.y - c.y), v = d * (c.x - a.x), w = y * i + v * r, _ = y * n + v * r, S = y * i + v * o, C = y * n + v * o;
    return !(Math.max(w, _, S, C) <= y * a.x + v * a.y || Math.min(w, _, S, C) >= y * l.x + v * l.y);
  }
  /**
   * Pads the rectangle making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @param paddingX - The horizontal padding amount.
   * @param paddingY - The vertical padding amount.
   * @returns Returns itself.
   */
  pad(t = 0, e = t) {
    return this.x -= t, this.y -= e, this.width += t * 2, this.height += e * 2, this;
  }
  /**
   * Fits this rectangle around the passed one.
   * @param rectangle - The rectangle to fit.
   * @returns Returns itself.
   */
  fit(t) {
    const e = Math.max(this.x, t.x), i = Math.min(this.x + this.width, t.x + t.width), n = Math.max(this.y, t.y), r = Math.min(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = Math.max(i - e, 0), this.y = n, this.height = Math.max(r - n, 0), this;
  }
  /**
   * Enlarges rectangle that way its corners lie on grid
   * @param resolution - resolution
   * @param eps - precision
   * @returns Returns itself.
   */
  ceil(t = 1, e = 1e-3) {
    const i = Math.ceil((this.x + this.width - e) * t) / t, n = Math.ceil((this.y + this.height - e) * t) / t;
    return this.x = Math.floor((this.x + e) * t) / t, this.y = Math.floor((this.y + e) * t) / t, this.width = i - this.x, this.height = n - this.y, this;
  }
  /**
   * Enlarges this rectangle to include the passed rectangle.
   * @param rectangle - The rectangle to include.
   * @returns Returns itself.
   */
  enlarge(t) {
    const e = Math.min(this.x, t.x), i = Math.max(this.x + this.width, t.x + t.width), n = Math.min(this.y, t.y), r = Math.max(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = i - e, this.y = n, this.height = r - n, this;
  }
  /**
   * Returns the framing rectangle of the rectangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new pt(), t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
  }
}
const Wn = {
  default: -1
};
function xt(s = "default") {
  return Wn[s] === void 0 && (Wn[s] = -1), ++Wn[s];
}
const qo = {}, $ = "8.0.0", Wu = "8.3.4";
function H(s, t, e = 3) {
  if (qo[t])
    return;
  let i = new Error().stack;
  typeof i > "u" ? console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${s}`) : (i = i.split(`
`).splice(e).join(`
`), console.groupCollapsed ? (console.groupCollapsed(
    "%cPixiJS Deprecation Warning: %c%s",
    "color:#614108;background:#fffbe6",
    "font-weight:normal;color:#614108;background:#fffbe6",
    `${t}
Deprecated since v${s}`
  ), console.warn(i), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${s}`), console.warn(i))), qo[t] = !0;
}
const Lh = () => {
};
function Zo(s) {
  return s += s === 0 ? 1 : 0, --s, s |= s >>> 1, s |= s >>> 2, s |= s >>> 4, s |= s >>> 8, s |= s >>> 16, s + 1;
}
function Qo(s) {
  return !(s & s - 1) && !!s;
}
function Gu(s) {
  const t = {};
  for (const e in s)
    s[e] !== void 0 && (t[e] = s[e]);
  return t;
}
const Jo = /* @__PURE__ */ Object.create(null);
function Vu(s) {
  const t = Jo[s];
  return t === void 0 && (Jo[s] = xt("resource")), t;
}
const Oh = class Dh extends kt {
  /**
   * @param options - options for the style
   */
  constructor(t = {}) {
    super(), this._resourceType = "textureSampler", this._touched = 0, this._maxAnisotropy = 1, this.destroyed = !1, t = { ...Dh.defaultOptions, ...t }, this.addressMode = t.addressMode, this.addressModeU = t.addressModeU ?? this.addressModeU, this.addressModeV = t.addressModeV ?? this.addressModeV, this.addressModeW = t.addressModeW ?? this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = t.magFilter ?? this.magFilter, this.minFilter = t.minFilter ?? this.minFilter, this.mipmapFilter = t.mipmapFilter ?? this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = t.maxAnisotropy ?? 1;
  }
  set addressMode(t) {
    this.addressModeU = t, this.addressModeV = t, this.addressModeW = t;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this.addressModeU;
  }
  set wrapMode(t) {
    H($, "TextureStyle.wrapMode is now TextureStyle.addressMode"), this.addressMode = t;
  }
  get wrapMode() {
    return this.addressMode;
  }
  set scaleMode(t) {
    this.magFilter = t, this.minFilter = t, this.mipmapFilter = t;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this.magFilter;
  }
  /** Specifies the maximum anisotropy value clamp used by the sampler. */
  set maxAnisotropy(t) {
    this._maxAnisotropy = Math.min(t, 16), this._maxAnisotropy > 1 && (this.scaleMode = "linear");
  }
  get maxAnisotropy() {
    return this._maxAnisotropy;
  }
  // TODO - move this to WebGL?
  get _resourceId() {
    return this._sharedResourceId || this._generateResourceId();
  }
  update() {
    this.emit("change", this), this._sharedResourceId = null;
  }
  _generateResourceId() {
    const t = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
    return this._sharedResourceId = Vu(t), this._resourceId;
  }
  /** Destroys the style */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners();
  }
};
Oh.defaultOptions = {
  addressMode: "clamp-to-edge",
  scaleMode: "linear"
};
let Nu = Oh;
const zh = class Uh extends kt {
  /**
   * @param options - options for creating a new TextureSource
   */
  constructor(t = {}) {
    super(), this.options = t, this.uid = xt("textureSource"), this._resourceType = "textureSource", this._resourceId = xt("resource"), this.uploadMethodId = "unknown", this._resolution = 1, this.pixelWidth = 1, this.pixelHeight = 1, this.width = 1, this.height = 1, this.sampleCount = 1, this.mipLevelCount = 1, this.autoGenerateMipmaps = !1, this.format = "rgba8unorm", this.dimension = "2d", this.antialias = !1, this._touched = 0, this._batchTick = -1, this._textureBindLocation = -1, t = { ...Uh.defaultOptions, ...t }, this.label = t.label ?? "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, t.width ? this.pixelWidth = t.width * this._resolution : this.pixelWidth = this.resource ? this.resourceWidth ?? 1 : 1, t.height ? this.pixelHeight = t.height * this._resolution : this.pixelHeight = this.resource ? this.resourceHeight ?? 1 : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = t.dimensions, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = t.antialias, this.alphaMode = t.alphaMode, this.style = new Nu(Gu(t)), this.destroyed = !1, this._refreshPOT();
  }
  /** returns itself */
  get source() {
    return this;
  }
  /** the style of the texture */
  get style() {
    return this._style;
  }
  set style(t) {
    var e, i;
    this.style !== t && ((e = this._style) == null || e.off("change", this._onStyleChange, this), this._style = t, (i = this._style) == null || i.on("change", this._onStyleChange, this), this._onStyleChange());
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this._style.addressMode;
  }
  set addressMode(t) {
    this._style.addressMode = t;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get repeatMode() {
    return this._style.addressMode;
  }
  set repeatMode(t) {
    this._style.addressMode = t;
  }
  /** Specifies the sampling behavior when the sample footprint is smaller than or equal to one texel. */
  get magFilter() {
    return this._style.magFilter;
  }
  set magFilter(t) {
    this._style.magFilter = t;
  }
  /** Specifies the sampling behavior when the sample footprint is larger than one texel. */
  get minFilter() {
    return this._style.minFilter;
  }
  set minFilter(t) {
    this._style.minFilter = t;
  }
  /** Specifies behavior for sampling between mipmap levels. */
  get mipmapFilter() {
    return this._style.mipmapFilter;
  }
  set mipmapFilter(t) {
    this._style.mipmapFilter = t;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMinClamp() {
    return this._style.lodMinClamp;
  }
  set lodMinClamp(t) {
    this._style.lodMinClamp = t;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMaxClamp() {
    return this._style.lodMaxClamp;
  }
  set lodMaxClamp(t) {
    this._style.lodMaxClamp = t;
  }
  _onStyleChange() {
    this.emit("styleChange", this);
  }
  /** call this if you have modified the texture outside of the constructor */
  update() {
    if (this.resource) {
      const t = this._resolution;
      if (this.resize(this.resourceWidth / t, this.resourceHeight / t))
        return;
    }
    this.emit("update", this);
  }
  /** Destroys this texture source */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this._style && (this._style.destroy(), this._style = null), this.uploadMethodId = null, this.resource = null, this.removeAllListeners();
  }
  /**
   * This will unload the Texture source from the GPU. This will free up the GPU memory
   * As soon as it is required fore rendering, it will be re-uploaded.
   */
  unload() {
    this._resourceId = xt("resource"), this.emit("change", this), this.emit("unload", this);
  }
  /** the width of the resource. This is the REAL pure number, not accounting resolution   */
  get resourceWidth() {
    const { resource: t } = this;
    return t.naturalWidth || t.videoWidth || t.displayWidth || t.width;
  }
  /** the height of the resource. This is the REAL pure number, not accounting resolution */
  get resourceHeight() {
    const { resource: t } = this;
    return t.naturalHeight || t.videoHeight || t.displayHeight || t.height;
  }
  /**
   * the resolution of the texture. Changing this number, will not change the number of pixels in the actual texture
   * but will the size of the texture when rendered.
   *
   * changing the resolution of this texture to 2 for example will make it appear twice as small when rendered (as pixel
   * density will have increased)
   */
  get resolution() {
    return this._resolution;
  }
  set resolution(t) {
    this._resolution !== t && (this._resolution = t, this.width = this.pixelWidth / t, this.height = this.pixelHeight / t);
  }
  /**
   * Resize the texture, this is handy if you want to use the texture as a render texture
   * @param width - the new width of the texture
   * @param height - the new height of the texture
   * @param resolution - the new resolution of the texture
   * @returns - if the texture was resized
   */
  resize(t, e, i) {
    i = i || this._resolution, t = t || this.width, e = e || this.height;
    const n = Math.round(t * i), r = Math.round(e * i);
    return this.width = n / i, this.height = r / i, this._resolution = i, this.pixelWidth === n && this.pixelHeight === r ? !1 : (this._refreshPOT(), this.pixelWidth = n, this.pixelHeight = r, this.emit("resize", this), this._resourceId = xt("resource"), this.emit("change", this), !0);
  }
  /**
   * Lets the renderer know that this texture has been updated and its mipmaps should be re-generated.
   * This is only important for RenderTexture instances, as standard Texture instances will have their
   * mipmaps generated on upload. You should call this method after you make any change to the texture
   *
   * The reason for this is is can be quite expensive to update mipmaps for a texture. So by default,
   * We want you, the developer to specify when this action should happen.
   *
   * Generally you don't want to have mipmaps generated on Render targets that are changed every frame,
   */
  updateMipmaps() {
    this.autoGenerateMipmaps && this.mipLevelCount > 1 && this.emit("updateMipmaps", this);
  }
  set wrapMode(t) {
    this._style.wrapMode = t;
  }
  get wrapMode() {
    return this._style.wrapMode;
  }
  set scaleMode(t) {
    this._style.scaleMode = t;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this._style.scaleMode;
  }
  /**
   * Refresh check for isPowerOfTwo texture based on size
   * @private
   */
  _refreshPOT() {
    this.isPowerOfTwo = Qo(this.pixelWidth) && Qo(this.pixelHeight);
  }
  static test(t) {
    throw new Error("Unimplemented");
  }
};
zh.defaultOptions = {
  resolution: 1,
  format: "bgra8unorm",
  alphaMode: "premultiply-alpha-on-upload",
  dimensions: "2d",
  mipLevelCount: 1,
  autoGenerateMipmaps: !1,
  sampleCount: 1,
  antialias: !1,
  autoGarbageCollect: !1
};
let ve = zh;
class go extends ve {
  constructor(t) {
    const e = t.resource || new Float32Array(t.width * t.height * 4);
    let i = t.format;
    i || (e instanceof Float32Array ? i = "rgba32float" : e instanceof Int32Array || e instanceof Uint32Array ? i = "rgba32uint" : e instanceof Int16Array || e instanceof Uint16Array ? i = "rgba16uint" : (e instanceof Int8Array, i = "bgra8unorm")), super({
      ...t,
      resource: e,
      format: i
    }), this.uploadMethodId = "buffer";
  }
  static test(t) {
    return t instanceof Int8Array || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array;
  }
}
go.extension = D.TextureSource;
const ta = new j();
class Hu {
  /**
   * @param texture - observed texture
   * @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
   */
  constructor(t, e) {
    this.mapCoord = new j(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, typeof e > "u" ? this.clampMargin = t.width < 10 ? 0 : 0.5 : this.clampMargin = e, this.isSimple = !1, this.texture = t;
  }
  /** Texture property. */
  get texture() {
    return this._texture;
  }
  set texture(t) {
    var e;
    this.texture !== t && ((e = this._texture) == null || e.removeListener("update", this.update, this), this._texture = t, this._texture.addListener("update", this.update, this), this.update());
  }
  /**
   * Multiplies uvs array to transform
   * @param uvs - mesh uvs
   * @param [out=uvs] - output
   * @returns - output
   */
  multiplyUvs(t, e) {
    e === void 0 && (e = t);
    const i = this.mapCoord;
    for (let n = 0; n < t.length; n += 2) {
      const r = t[n], o = t[n + 1];
      e[n] = r * i.a + o * i.c + i.tx, e[n + 1] = r * i.b + o * i.d + i.ty;
    }
    return e;
  }
  /**
   * Updates matrices if texture was changed
   * @returns - whether or not it was updated
   */
  update() {
    const t = this._texture;
    this._updateID++;
    const e = t.uvs;
    this.mapCoord.set(e.x1 - e.x0, e.y1 - e.y0, e.x3 - e.x0, e.y3 - e.y0, e.x0, e.y0);
    const i = t.orig, n = t.trim;
    n && (ta.set(
      i.width / n.width,
      0,
      0,
      i.height / n.height,
      -n.x / n.width,
      -n.y / n.height
    ), this.mapCoord.append(ta));
    const r = t.source, o = this.uClampFrame, a = this.clampMargin / r._resolution, h = this.clampOffset / r._resolution;
    return o[0] = (t.frame.x + a + h) / r.width, o[1] = (t.frame.y + a + h) / r.height, o[2] = (t.frame.x + t.frame.width - a + h) / r.width, o[3] = (t.frame.y + t.frame.height - a + h) / r.height, this.uClampOffset[0] = this.clampOffset / r.pixelWidth, this.uClampOffset[1] = this.clampOffset / r.pixelHeight, this.isSimple = t.frame.width === r.width && t.frame.height === r.height && t.rotate === 0, !0;
  }
}
class G extends kt {
  /**
   * @param {rendering.TextureOptions} options - Options for the texture
   */
  constructor({
    source: t,
    label: e,
    frame: i,
    orig: n,
    trim: r,
    defaultAnchor: o,
    defaultBorders: a,
    rotate: h,
    dynamic: c
  } = {}) {
    if (super(), this.uid = xt("texture"), this.uvs = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 }, this.frame = new pt(), this.noFrame = !1, this.dynamic = !1, this.isTexture = !0, this.label = e, this.source = (t == null ? void 0 : t.source) ?? new ve(), this.noFrame = !i, i)
      this.frame.copyFrom(i);
    else {
      const { width: l, height: d } = this._source;
      this.frame.width = l, this.frame.height = d;
    }
    this.orig = n || this.frame, this.trim = r, this.rotate = h ?? 0, this.defaultAnchor = o, this.defaultBorders = a, this.destroyed = !1, this.dynamic = c || !1, this.updateUvs();
  }
  set source(t) {
    this._source && this._source.off("resize", this.update, this), this._source = t, t.on("resize", this.update, this), this.emit("update", this);
  }
  /** the underlying source of the texture (equivalent of baseTexture in v7) */
  get source() {
    return this._source;
  }
  /** returns a TextureMatrix instance for this texture. By default, that object is not created because its heavy. */
  get textureMatrix() {
    return this._textureMatrix || (this._textureMatrix = new Hu(this)), this._textureMatrix;
  }
  /** The width of the Texture in pixels. */
  get width() {
    return this.orig.width;
  }
  /** The height of the Texture in pixels. */
  get height() {
    return this.orig.height;
  }
  /** Call this function when you have modified the frame of this texture. */
  updateUvs() {
    const { uvs: t, frame: e } = this, { width: i, height: n } = this._source, r = e.x / i, o = e.y / n, a = e.width / i, h = e.height / n;
    let c = this.rotate;
    if (c) {
      const l = a / 2, d = h / 2, f = r + l, u = o + d;
      c = et.add(c, et.NW), t.x0 = f + l * et.uX(c), t.y0 = u + d * et.uY(c), c = et.add(c, 2), t.x1 = f + l * et.uX(c), t.y1 = u + d * et.uY(c), c = et.add(c, 2), t.x2 = f + l * et.uX(c), t.y2 = u + d * et.uY(c), c = et.add(c, 2), t.x3 = f + l * et.uX(c), t.y3 = u + d * et.uY(c);
    } else
      t.x0 = r, t.y0 = o, t.x1 = r + a, t.y1 = o, t.x2 = r + a, t.y2 = o + h, t.x3 = r, t.y3 = o + h;
  }
  /**
   * Destroys this texture
   * @param destroySource - Destroy the source when the texture is destroyed.
   */
  destroy(t = !1) {
    this._source && t && (this._source.destroy(), this._source = null), this._textureMatrix = null, this.destroyed = !0, this.emit("destroy", this), this.removeAllListeners();
  }
  /**
   * Call this if you have modified the `texture outside` of the constructor.
   *
   * If you have modified this texture's source, you must separately call `texture.source.update()` to see those changes.
   */
  update() {
    this.noFrame && (this.frame.width = this._source.width, this.frame.height = this._source.height), this.updateUvs(), this.emit("update", this);
  }
  /** @deprecated since 8.0.0 */
  get baseTexture() {
    return H($, "Texture.baseTexture is now Texture.source"), this._source;
  }
}
G.EMPTY = new G({
  label: "EMPTY",
  source: new ve({
    label: "EMPTY"
  })
});
G.EMPTY.destroy = Lh;
G.WHITE = new G({
  source: new go({
    resource: new Uint8Array([255, 255, 255, 255]),
    width: 1,
    height: 1,
    alphaMode: "premultiply-alpha-on-upload",
    label: "WHITE"
  }),
  label: "WHITE"
});
G.WHITE.destroy = Lh;
function $u(s, t, e, i) {
  const { width: n, height: r } = e.orig, o = e.trim;
  if (o) {
    const a = o.width, h = o.height;
    s.minX = o.x - t._x * n - i, s.maxX = s.minX + a, s.minY = o.y - t._y * r - i, s.maxY = s.minY + h;
  } else
    s.minX = -t._x * n - i, s.maxX = s.minX + n, s.minY = -t._y * r - i, s.maxY = s.minY + r;
}
const ea = new j();
class xe {
  constructor(t = 1 / 0, e = 1 / 0, i = -1 / 0, n = -1 / 0) {
    this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = ea, this.minX = t, this.minY = e, this.maxX = i, this.maxY = n;
  }
  /**
   * Checks if bounds are empty.
   * @returns - True if empty.
   */
  isEmpty() {
    return this.minX > this.maxX || this.minY > this.maxY;
  }
  /** The bounding rectangle of the bounds. */
  get rectangle() {
    this._rectangle || (this._rectangle = new pt());
    const t = this._rectangle;
    return this.minX > this.maxX || this.minY > this.maxY ? (t.x = 0, t.y = 0, t.width = 0, t.height = 0) : t.copyFromBounds(this), t;
  }
  /** Clears the bounds and resets. */
  clear() {
    return this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = ea, this;
  }
  /**
   * Sets the bounds.
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   */
  set(t, e, i, n) {
    this.minX = t, this.minY = e, this.maxX = i, this.maxY = n;
  }
  /**
   * Adds sprite frame
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   * @param matrix
   */
  addFrame(t, e, i, n, r) {
    r || (r = this.matrix);
    const o = r.a, a = r.b, h = r.c, c = r.d, l = r.tx, d = r.ty;
    let f = this.minX, u = this.minY, g = this.maxX, p = this.maxY, m = o * t + h * e + l, x = a * t + c * e + d;
    m < f && (f = m), x < u && (u = x), m > g && (g = m), x > p && (p = x), m = o * i + h * e + l, x = a * i + c * e + d, m < f && (f = m), x < u && (u = x), m > g && (g = m), x > p && (p = x), m = o * t + h * n + l, x = a * t + c * n + d, m < f && (f = m), x < u && (u = x), m > g && (g = m), x > p && (p = x), m = o * i + h * n + l, x = a * i + c * n + d, m < f && (f = m), x < u && (u = x), m > g && (g = m), x > p && (p = x), this.minX = f, this.minY = u, this.maxX = g, this.maxY = p;
  }
  /**
   * Adds a rectangle to the bounds.
   * @param rect - The rectangle to be added.
   * @param matrix - The matrix to apply to the bounds.
   */
  addRect(t, e) {
    this.addFrame(t.x, t.y, t.x + t.width, t.y + t.height, e);
  }
  /**
   * Adds other {@link Bounds}.
   * @param bounds - The Bounds to be added
   * @param matrix
   */
  addBounds(t, e) {
    this.addFrame(t.minX, t.minY, t.maxX, t.maxY, e);
  }
  /**
   * Adds other Bounds, masked with Bounds.
   * @param mask - The Bounds to be added.
   */
  addBoundsMask(t) {
    this.minX = this.minX > t.minX ? this.minX : t.minX, this.minY = this.minY > t.minY ? this.minY : t.minY, this.maxX = this.maxX < t.maxX ? this.maxX : t.maxX, this.maxY = this.maxY < t.maxY ? this.maxY : t.maxY;
  }
  /**
   * Adds other Bounds, multiplied with matrix.
   * @param matrix - The matrix to apply to the bounds.
   */
  applyMatrix(t) {
    const e = this.minX, i = this.minY, n = this.maxX, r = this.maxY, { a: o, b: a, c: h, d: c, tx: l, ty: d } = t;
    let f = o * e + h * i + l, u = a * e + c * i + d;
    this.minX = f, this.minY = u, this.maxX = f, this.maxY = u, f = o * n + h * i + l, u = a * n + c * i + d, this.minX = f < this.minX ? f : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = u > this.maxY ? u : this.maxY, f = o * e + h * r + l, u = a * e + c * r + d, this.minX = f < this.minX ? f : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = u > this.maxY ? u : this.maxY, f = o * n + h * r + l, u = a * n + c * r + d, this.minX = f < this.minX ? f : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = u > this.maxY ? u : this.maxY;
  }
  /**
   * Resizes the bounds object to include the given rectangle.
   * @param rect - The rectangle to be included.
   */
  fit(t) {
    return this.minX < t.left && (this.minX = t.left), this.maxX > t.right && (this.maxX = t.right), this.minY < t.top && (this.minY = t.top), this.maxY > t.bottom && (this.maxY = t.bottom), this;
  }
  /**
   * Resizes the bounds object to include the given bounds.
   * @param left - The left value of the bounds.
   * @param right - The right value of the bounds.
   * @param top - The top value of the bounds.
   * @param bottom - The bottom value of the bounds.
   */
  fitBounds(t, e, i, n) {
    return this.minX < t && (this.minX = t), this.maxX > e && (this.maxX = e), this.minY < i && (this.minY = i), this.maxY > n && (this.maxY = n), this;
  }
  /**
   * Pads bounds object, making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @param paddingX - The horizontal padding amount.
   * @param paddingY - The vertical padding amount.
   */
  pad(t, e = t) {
    return this.minX -= t, this.maxX += t, this.minY -= e, this.maxY += e, this;
  }
  /** Ceils the bounds. */
  ceil() {
    return this.minX = Math.floor(this.minX), this.minY = Math.floor(this.minY), this.maxX = Math.ceil(this.maxX), this.maxY = Math.ceil(this.maxY), this;
  }
  /** Clones the bounds. */
  clone() {
    return new xe(this.minX, this.minY, this.maxX, this.maxY);
  }
  /**
   * Scales the bounds by the given values
   * @param x - The X value to scale by.
   * @param y - The Y value to scale by.
   */
  scale(t, e = t) {
    return this.minX *= t, this.minY *= e, this.maxX *= t, this.maxY *= e, this;
  }
  /** the x value of the bounds. */
  get x() {
    return this.minX;
  }
  set x(t) {
    const e = this.maxX - this.minX;
    this.minX = t, this.maxX = t + e;
  }
  /** the y value of the bounds. */
  get y() {
    return this.minY;
  }
  set y(t) {
    const e = this.maxY - this.minY;
    this.minY = t, this.maxY = t + e;
  }
  /** the width value of the bounds. */
  get width() {
    return this.maxX - this.minX;
  }
  set width(t) {
    this.maxX = this.minX + t;
  }
  /** the height value of the bounds. */
  get height() {
    return this.maxY - this.minY;
  }
  set height(t) {
    this.maxY = this.minY + t;
  }
  /** the left value of the bounds. */
  get left() {
    return this.minX;
  }
  /** the right value of the bounds. */
  get right() {
    return this.maxX;
  }
  /** the top value of the bounds. */
  get top() {
    return this.minY;
  }
  /** the bottom value of the bounds. */
  get bottom() {
    return this.maxY;
  }
  /** Is the bounds positive. */
  get isPositive() {
    return this.maxX - this.minX > 0 && this.maxY - this.minY > 0;
  }
  get isValid() {
    return this.minX + this.minY !== 1 / 0;
  }
  /**
   * Adds screen vertices from array
   * @param vertexData - calculated vertices
   * @param beginOffset - begin offset
   * @param endOffset - end offset, excluded
   * @param matrix
   */
  addVertexData(t, e, i, n) {
    let r = this.minX, o = this.minY, a = this.maxX, h = this.maxY;
    n || (n = this.matrix);
    const c = n.a, l = n.b, d = n.c, f = n.d, u = n.tx, g = n.ty;
    for (let p = e; p < i; p += 2) {
      const m = t[p], x = t[p + 1], y = c * m + d * x + u, v = l * m + f * x + g;
      r = y < r ? y : r, o = v < o ? v : o, a = y > a ? y : a, h = v > h ? v : h;
    }
    this.minX = r, this.minY = o, this.maxX = a, this.maxY = h;
  }
  /**
   * Checks if the point is contained within the bounds.
   * @param x - x coordinate
   * @param y - y coordinate
   */
  containsPoint(t, e) {
    return this.minX <= t && this.minY <= e && this.maxX >= t && this.maxY >= e;
  }
  toString() {
    return `[pixi.js:Bounds minX=${this.minX} minY=${this.minY} maxX=${this.maxX} maxY=${this.maxY} width=${this.width} height=${this.height}]`;
  }
}
var ju = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) }, we = function(s) {
  return typeof s == "string" ? s.length > 0 : typeof s == "number";
}, vt = function(s, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = Math.pow(10, t)), Math.round(e * s) / e + 0;
}, qt = function(s, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = 1), s > e ? e : s > t ? s : t;
}, Wh = function(s) {
  return (s = isFinite(s) ? s % 360 : 0) > 0 ? s : s + 360;
}, ia = function(s) {
  return { r: qt(s.r, 0, 255), g: qt(s.g, 0, 255), b: qt(s.b, 0, 255), a: qt(s.a) };
}, Gn = function(s) {
  return { r: vt(s.r), g: vt(s.g), b: vt(s.b), a: vt(s.a, 3) };
}, Yu = /^#([0-9a-f]{3,8})$/i, Os = function(s) {
  var t = s.toString(16);
  return t.length < 2 ? "0" + t : t;
}, Gh = function(s) {
  var t = s.r, e = s.g, i = s.b, n = s.a, r = Math.max(t, e, i), o = r - Math.min(t, e, i), a = o ? r === t ? (e - i) / o : r === e ? 2 + (i - t) / o : 4 + (t - e) / o : 0;
  return { h: 60 * (a < 0 ? a + 6 : a), s: r ? o / r * 100 : 0, v: r / 255 * 100, a: n };
}, Vh = function(s) {
  var t = s.h, e = s.s, i = s.v, n = s.a;
  t = t / 360 * 6, e /= 100, i /= 100;
  var r = Math.floor(t), o = i * (1 - e), a = i * (1 - (t - r) * e), h = i * (1 - (1 - t + r) * e), c = r % 6;
  return { r: 255 * [i, a, o, o, h, i][c], g: 255 * [h, i, i, a, o, o][c], b: 255 * [o, o, h, i, i, a][c], a: n };
}, sa = function(s) {
  return { h: Wh(s.h), s: qt(s.s, 0, 100), l: qt(s.l, 0, 100), a: qt(s.a) };
}, na = function(s) {
  return { h: vt(s.h), s: vt(s.s), l: vt(s.l), a: vt(s.a, 3) };
}, ra = function(s) {
  return Vh((e = (t = s).s, { h: t.h, s: (e *= ((i = t.l) < 50 ? i : 100 - i) / 100) > 0 ? 2 * e / (i + e) * 100 : 0, v: i + e, a: t.a }));
  var t, e, i;
}, ns = function(s) {
  return { h: (t = Gh(s)).h, s: (n = (200 - (e = t.s)) * (i = t.v) / 100) > 0 && n < 200 ? e * i / 100 / (n <= 100 ? n : 200 - n) * 100 : 0, l: n / 2, a: t.a };
  var t, e, i, n;
}, Xu = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Ku = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, qu = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Zu = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Cr = { string: [[function(s) {
  var t = Yu.exec(s);
  return t ? (s = t[1]).length <= 4 ? { r: parseInt(s[0] + s[0], 16), g: parseInt(s[1] + s[1], 16), b: parseInt(s[2] + s[2], 16), a: s.length === 4 ? vt(parseInt(s[3] + s[3], 16) / 255, 2) : 1 } : s.length === 6 || s.length === 8 ? { r: parseInt(s.substr(0, 2), 16), g: parseInt(s.substr(2, 2), 16), b: parseInt(s.substr(4, 2), 16), a: s.length === 8 ? vt(parseInt(s.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(s) {
  var t = qu.exec(s) || Zu.exec(s);
  return t ? t[2] !== t[4] || t[4] !== t[6] ? null : ia({ r: Number(t[1]) / (t[2] ? 100 / 255 : 1), g: Number(t[3]) / (t[4] ? 100 / 255 : 1), b: Number(t[5]) / (t[6] ? 100 / 255 : 1), a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1) }) : null;
}, "rgb"], [function(s) {
  var t = Xu.exec(s) || Ku.exec(s);
  if (!t) return null;
  var e, i, n = sa({ h: (e = t[1], i = t[2], i === void 0 && (i = "deg"), Number(e) * (ju[i] || 1)), s: Number(t[3]), l: Number(t[4]), a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1) });
  return ra(n);
}, "hsl"]], object: [[function(s) {
  var t = s.r, e = s.g, i = s.b, n = s.a, r = n === void 0 ? 1 : n;
  return we(t) && we(e) && we(i) ? ia({ r: Number(t), g: Number(e), b: Number(i), a: Number(r) }) : null;
}, "rgb"], [function(s) {
  var t = s.h, e = s.s, i = s.l, n = s.a, r = n === void 0 ? 1 : n;
  if (!we(t) || !we(e) || !we(i)) return null;
  var o = sa({ h: Number(t), s: Number(e), l: Number(i), a: Number(r) });
  return ra(o);
}, "hsl"], [function(s) {
  var t = s.h, e = s.s, i = s.v, n = s.a, r = n === void 0 ? 1 : n;
  if (!we(t) || !we(e) || !we(i)) return null;
  var o = function(a) {
    return { h: Wh(a.h), s: qt(a.s, 0, 100), v: qt(a.v, 0, 100), a: qt(a.a) };
  }({ h: Number(t), s: Number(e), v: Number(i), a: Number(r) });
  return Vh(o);
}, "hsv"]] }, oa = function(s, t) {
  for (var e = 0; e < t.length; e++) {
    var i = t[e][0](s);
    if (i) return [i, t[e][1]];
  }
  return [null, void 0];
}, Qu = function(s) {
  return typeof s == "string" ? oa(s.trim(), Cr.string) : typeof s == "object" && s !== null ? oa(s, Cr.object) : [null, void 0];
}, Vn = function(s, t) {
  var e = ns(s);
  return { h: e.h, s: qt(e.s + 100 * t, 0, 100), l: e.l, a: e.a };
}, Nn = function(s) {
  return (299 * s.r + 587 * s.g + 114 * s.b) / 1e3 / 255;
}, aa = function(s, t) {
  var e = ns(s);
  return { h: e.h, s: e.s, l: qt(e.l + 100 * t, 0, 100), a: e.a };
}, Pr = function() {
  function s(t) {
    this.parsed = Qu(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return s.prototype.isValid = function() {
    return this.parsed !== null;
  }, s.prototype.brightness = function() {
    return vt(Nn(this.rgba), 2);
  }, s.prototype.isDark = function() {
    return Nn(this.rgba) < 0.5;
  }, s.prototype.isLight = function() {
    return Nn(this.rgba) >= 0.5;
  }, s.prototype.toHex = function() {
    return t = Gn(this.rgba), e = t.r, i = t.g, n = t.b, o = (r = t.a) < 1 ? Os(vt(255 * r)) : "", "#" + Os(e) + Os(i) + Os(n) + o;
    var t, e, i, n, r, o;
  }, s.prototype.toRgb = function() {
    return Gn(this.rgba);
  }, s.prototype.toRgbString = function() {
    return t = Gn(this.rgba), e = t.r, i = t.g, n = t.b, (r = t.a) < 1 ? "rgba(" + e + ", " + i + ", " + n + ", " + r + ")" : "rgb(" + e + ", " + i + ", " + n + ")";
    var t, e, i, n, r;
  }, s.prototype.toHsl = function() {
    return na(ns(this.rgba));
  }, s.prototype.toHslString = function() {
    return t = na(ns(this.rgba)), e = t.h, i = t.s, n = t.l, (r = t.a) < 1 ? "hsla(" + e + ", " + i + "%, " + n + "%, " + r + ")" : "hsl(" + e + ", " + i + "%, " + n + "%)";
    var t, e, i, n, r;
  }, s.prototype.toHsv = function() {
    return t = Gh(this.rgba), { h: vt(t.h), s: vt(t.s), v: vt(t.v), a: vt(t.a, 3) };
    var t;
  }, s.prototype.invert = function() {
    return ce({ r: 255 - (t = this.rgba).r, g: 255 - t.g, b: 255 - t.b, a: t.a });
    var t;
  }, s.prototype.saturate = function(t) {
    return t === void 0 && (t = 0.1), ce(Vn(this.rgba, t));
  }, s.prototype.desaturate = function(t) {
    return t === void 0 && (t = 0.1), ce(Vn(this.rgba, -t));
  }, s.prototype.grayscale = function() {
    return ce(Vn(this.rgba, -1));
  }, s.prototype.lighten = function(t) {
    return t === void 0 && (t = 0.1), ce(aa(this.rgba, t));
  }, s.prototype.darken = function(t) {
    return t === void 0 && (t = 0.1), ce(aa(this.rgba, -t));
  }, s.prototype.rotate = function(t) {
    return t === void 0 && (t = 15), this.hue(this.hue() + t);
  }, s.prototype.alpha = function(t) {
    return typeof t == "number" ? ce({ r: (e = this.rgba).r, g: e.g, b: e.b, a: t }) : vt(this.rgba.a, 3);
    var e;
  }, s.prototype.hue = function(t) {
    var e = ns(this.rgba);
    return typeof t == "number" ? ce({ h: t, s: e.s, l: e.l, a: e.a }) : vt(e.h);
  }, s.prototype.isEqual = function(t) {
    return this.toHex() === ce(t).toHex();
  }, s;
}(), ce = function(s) {
  return s instanceof Pr ? s : new Pr(s);
}, ha = [], Ju = function(s) {
  s.forEach(function(t) {
    ha.indexOf(t) < 0 && (t(Pr, Cr), ha.push(t));
  });
};
function td(s, t) {
  var e = { white: "#ffffff", bisque: "#ffe4c4", blue: "#0000ff", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", antiquewhite: "#faebd7", aqua: "#00ffff", azure: "#f0ffff", whitesmoke: "#f5f5f5", papayawhip: "#ffefd5", plum: "#dda0dd", blanchedalmond: "#ffebcd", black: "#000000", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", cornsilk: "#fff8dc", cornflowerblue: "#6495ed", burlywood: "#deb887", aquamarine: "#7fffd4", beige: "#f5f5dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkkhaki: "#bdb76b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", peachpuff: "#ffdab9", darkmagenta: "#8b008b", darkred: "#8b0000", darkorchid: "#9932cc", darkorange: "#ff8c00", darkslateblue: "#483d8b", gray: "#808080", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", deeppink: "#ff1493", deepskyblue: "#00bfff", wheat: "#f5deb3", firebrick: "#b22222", floralwhite: "#fffaf0", ghostwhite: "#f8f8ff", darkviolet: "#9400d3", magenta: "#ff00ff", green: "#008000", dodgerblue: "#1e90ff", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", blueviolet: "#8a2be2", forestgreen: "#228b22", lawngreen: "#7cfc00", indianred: "#cd5c5c", indigo: "#4b0082", fuchsia: "#ff00ff", brown: "#a52a2a", maroon: "#800000", mediumblue: "#0000cd", lightcoral: "#f08080", darkturquoise: "#00ced1", lightcyan: "#e0ffff", ivory: "#fffff0", lightyellow: "#ffffe0", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", linen: "#faf0e6", mediumaquamarine: "#66cdaa", lemonchiffon: "#fffacd", lime: "#00ff00", khaki: "#f0e68c", mediumseagreen: "#3cb371", limegreen: "#32cd32", mediumspringgreen: "#00fa9a", lightskyblue: "#87cefa", lightblue: "#add8e6", midnightblue: "#191970", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", mintcream: "#f5fffa", lightslategray: "#778899", lightslategrey: "#778899", navajowhite: "#ffdead", navy: "#000080", mediumvioletred: "#c71585", powderblue: "#b0e0e6", palegoldenrod: "#eee8aa", oldlace: "#fdf5e6", paleturquoise: "#afeeee", mediumturquoise: "#48d1cc", mediumorchid: "#ba55d3", rebeccapurple: "#663399", lightsteelblue: "#b0c4de", mediumslateblue: "#7b68ee", thistle: "#d8bfd8", tan: "#d2b48c", orchid: "#da70d6", mediumpurple: "#9370db", purple: "#800080", pink: "#ffc0cb", skyblue: "#87ceeb", springgreen: "#00ff7f", palegreen: "#98fb98", red: "#ff0000", yellow: "#ffff00", slateblue: "#6a5acd", lavenderblush: "#fff0f5", peru: "#cd853f", palevioletred: "#db7093", violet: "#ee82ee", teal: "#008080", slategray: "#708090", slategrey: "#708090", aliceblue: "#f0f8ff", darkseagreen: "#8fbc8f", darkolivegreen: "#556b2f", greenyellow: "#adff2f", seagreen: "#2e8b57", seashell: "#fff5ee", tomato: "#ff6347", silver: "#c0c0c0", sienna: "#a0522d", lavender: "#e6e6fa", lightgreen: "#90ee90", orange: "#ffa500", orangered: "#ff4500", steelblue: "#4682b4", royalblue: "#4169e1", turquoise: "#40e0d0", yellowgreen: "#9acd32", salmon: "#fa8072", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", darksalmon: "#e9967a", lightgoldenrodyellow: "#fafad2", snow: "#fffafa", lightgrey: "#d3d3d3", lightgray: "#d3d3d3", dimgray: "#696969", dimgrey: "#696969", olivedrab: "#6b8e23", olive: "#808000" }, i = {};
  for (var n in e) i[e[n]] = n;
  var r = {};
  s.prototype.toName = function(o) {
    if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
    var a, h, c = i[this.toHex()];
    if (c) return c;
    if (o != null && o.closest) {
      var l = this.toRgb(), d = 1 / 0, f = "black";
      if (!r.length) for (var u in e) r[u] = new s(e[u]).toRgb();
      for (var g in e) {
        var p = (a = l, h = r[g], Math.pow(a.r - h.r, 2) + Math.pow(a.g - h.g, 2) + Math.pow(a.b - h.b, 2));
        p < d && (d = p, f = g);
      }
      return f;
    }
  }, t.string.push([function(o) {
    var a = o.toLowerCase(), h = a === "transparent" ? "#0000" : e[a];
    return h ? new s(h).toRgb() : null;
  }, "name"]);
}
Ju([td]);
const Ei = class Zi {
  /**
   * @param {ColorSource} value - Optional value to use, if not provided, white is used.
   */
  constructor(t = 16777215) {
    this._value = null, this._components = new Float32Array(4), this._components.fill(1), this._int = 16777215, this.value = t;
  }
  /** Get red component (0 - 1) */
  get red() {
    return this._components[0];
  }
  /** Get green component (0 - 1) */
  get green() {
    return this._components[1];
  }
  /** Get blue component (0 - 1) */
  get blue() {
    return this._components[2];
  }
  /** Get alpha component (0 - 1) */
  get alpha() {
    return this._components[3];
  }
  /**
   * Set the value, suitable for chaining
   * @param value
   * @see Color.value
   */
  setValue(t) {
    return this.value = t, this;
  }
  /**
   * The current color source.
   *
   * When setting:
   * - Setting to an instance of `Color` will copy its color source and components.
   * - Otherwise, `Color` will try to normalize the color source and set the components.
   *   If the color source is invalid, an `Error` will be thrown and the `Color` will left unchanged.
   *
   * Note: The `null` in the setter's parameter type is added to match the TypeScript rule: return type of getter
   * must be assignable to its setter's parameter type. Setting `value` to `null` will throw an `Error`.
   *
   * When getting:
   * - A return value of `null` means the previous value was overridden (e.g., {@link Color.multiply multiply},
   *   {@link Color.premultiply premultiply} or {@link Color.round round}).
   * - Otherwise, the color source used when setting is returned.
   */
  set value(t) {
    if (t instanceof Zi)
      this._value = this._cloneSource(t._value), this._int = t._int, this._components.set(t._components);
    else {
      if (t === null)
        throw new Error("Cannot set Color#value to null");
      (this._value === null || !this._isSourceEqual(this._value, t)) && (this._value = this._cloneSource(t), this._normalize(this._value));
    }
  }
  get value() {
    return this._value;
  }
  /**
   * Copy a color source internally.
   * @param value - Color source
   */
  _cloneSource(t) {
    return typeof t == "string" || typeof t == "number" || t instanceof Number || t === null ? t : Array.isArray(t) || ArrayBuffer.isView(t) ? t.slice(0) : typeof t == "object" && t !== null ? { ...t } : t;
  }
  /**
   * Equality check for color sources.
   * @param value1 - First color source
   * @param value2 - Second color source
   * @returns `true` if the color sources are equal, `false` otherwise.
   */
  _isSourceEqual(t, e) {
    const i = typeof t;
    if (i !== typeof e)
      return !1;
    if (i === "number" || i === "string" || t instanceof Number)
      return t === e;
    if (Array.isArray(t) && Array.isArray(e) || ArrayBuffer.isView(t) && ArrayBuffer.isView(e))
      return t.length !== e.length ? !1 : t.every((r, o) => r === e[o]);
    if (t !== null && e !== null) {
      const r = Object.keys(t), o = Object.keys(e);
      return r.length !== o.length ? !1 : r.every((a) => t[a] === e[a]);
    }
    return t === e;
  }
  /**
   * Convert to a RGBA color object.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toRgb(); // returns { r: 1, g: 1, b: 1, a: 1 }
   */
  toRgba() {
    const [t, e, i, n] = this._components;
    return { r: t, g: e, b: i, a: n };
  }
  /**
   * Convert to a RGB color object.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toRgb(); // returns { r: 1, g: 1, b: 1 }
   */
  toRgb() {
    const [t, e, i] = this._components;
    return { r: t, g: e, b: i };
  }
  /** Convert to a CSS-style rgba string: `rgba(255,255,255,1.0)`. */
  toRgbaString() {
    const [t, e, i] = this.toUint8RgbArray();
    return `rgba(${t},${e},${i},${this.alpha})`;
  }
  toUint8RgbArray(t) {
    const [e, i, n] = this._components;
    return this._arrayRgb || (this._arrayRgb = []), t = t || this._arrayRgb, t[0] = Math.round(e * 255), t[1] = Math.round(i * 255), t[2] = Math.round(n * 255), t;
  }
  toArray(t) {
    this._arrayRgba || (this._arrayRgba = []), t = t || this._arrayRgba;
    const [e, i, n, r] = this._components;
    return t[0] = e, t[1] = i, t[2] = n, t[3] = r, t;
  }
  toRgbArray(t) {
    this._arrayRgb || (this._arrayRgb = []), t = t || this._arrayRgb;
    const [e, i, n] = this._components;
    return t[0] = e, t[1] = i, t[2] = n, t;
  }
  /**
   * Convert to a hexadecimal number.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toNumber(); // returns 16777215
   */
  toNumber() {
    return this._int;
  }
  /**
   * Convert to a BGR number
   * @example
   * import { Color } from 'pixi.js';
   * new Color(0xffcc99).toBgrNumber(); // returns 0x99ccff
   */
  toBgrNumber() {
    const [t, e, i] = this.toUint8RgbArray();
    return (i << 16) + (e << 8) + t;
  }
  /**
   * Convert to a hexadecimal number in little endian format (e.g., BBGGRR).
   * @example
   * import { Color } from 'pixi.js';
   * new Color(0xffcc99).toLittleEndianNumber(); // returns 0x99ccff
   * @returns {number} - The color as a number in little endian format.
   */
  toLittleEndianNumber() {
    const t = this._int;
    return (t >> 16) + (t & 65280) + ((t & 255) << 16);
  }
  /**
   * Multiply with another color. This action is destructive, and will
   * override the previous `value` property to be `null`.
   * @param {ColorSource} value - The color to multiply by.
   */
  multiply(t) {
    const [e, i, n, r] = Zi._temp.setValue(t)._components;
    return this._components[0] *= e, this._components[1] *= i, this._components[2] *= n, this._components[3] *= r, this._refreshInt(), this._value = null, this;
  }
  /**
   * Converts color to a premultiplied alpha format. This action is destructive, and will
   * override the previous `value` property to be `null`.
   * @param alpha - The alpha to multiply by.
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels.
   * @returns {Color} - Itself.
   */
  premultiply(t, e = !0) {
    return e && (this._components[0] *= t, this._components[1] *= t, this._components[2] *= t), this._components[3] = t, this._refreshInt(), this._value = null, this;
  }
  /**
   * Premultiplies alpha with current color.
   * @param {number} alpha - The alpha to multiply by.
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels.
   * @returns {number} tint multiplied by alpha
   */
  toPremultiplied(t, e = !0) {
    if (t === 1)
      return (255 << 24) + this._int;
    if (t === 0)
      return e ? 0 : this._int;
    let i = this._int >> 16 & 255, n = this._int >> 8 & 255, r = this._int & 255;
    return e && (i = i * t + 0.5 | 0, n = n * t + 0.5 | 0, r = r * t + 0.5 | 0), (t * 255 << 24) + (i << 16) + (n << 8) + r;
  }
  /**
   * Convert to a hexadecimal string.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toHex(); // returns "#ffffff"
   */
  toHex() {
    const t = this._int.toString(16);
    return `#${"000000".substring(0, 6 - t.length) + t}`;
  }
  /**
   * Convert to a hexadecimal string with alpha.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toHexa(); // returns "#ffffffff"
   */
  toHexa() {
    const e = Math.round(this._components[3] * 255).toString(16);
    return this.toHex() + "00".substring(0, 2 - e.length) + e;
  }
  /**
   * Set alpha, suitable for chaining.
   * @param alpha
   */
  setAlpha(t) {
    return this._components[3] = this._clamp(t), this;
  }
  /**
   * Normalize the input value into rgba
   * @param value - Input value
   */
  _normalize(t) {
    let e, i, n, r;
    if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
      const o = t;
      e = (o >> 16 & 255) / 255, i = (o >> 8 & 255) / 255, n = (o & 255) / 255, r = 1;
    } else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t), [e, i, n, r = 1] = t;
    else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t, 0, 255), [e, i, n, r = 255] = t, e /= 255, i /= 255, n /= 255, r /= 255;
    else if (typeof t == "string" || typeof t == "object") {
      if (typeof t == "string") {
        const a = Zi.HEX_PATTERN.exec(t);
        a && (t = `#${a[2]}`);
      }
      const o = ce(t);
      o.isValid() && ({ r: e, g: i, b: n, a: r } = o.rgba, e /= 255, i /= 255, n /= 255);
    }
    if (e !== void 0)
      this._components[0] = e, this._components[1] = i, this._components[2] = n, this._components[3] = r, this._refreshInt();
    else
      throw new Error(`Unable to convert color ${t}`);
  }
  /** Refresh the internal color rgb number */
  _refreshInt() {
    this._clamp(this._components);
    const [t, e, i] = this._components;
    this._int = (t * 255 << 16) + (e * 255 << 8) + (i * 255 | 0);
  }
  /**
   * Clamps values to a range. Will override original values
   * @param value - Value(s) to clamp
   * @param min - Minimum value
   * @param max - Maximum value
   */
  _clamp(t, e = 0, i = 1) {
    return typeof t == "number" ? Math.min(Math.max(t, e), i) : (t.forEach((n, r) => {
      t[r] = Math.min(Math.max(n, e), i);
    }), t);
  }
  /**
   * Check if the value is a color-like object
   * @param value - Value to check
   * @returns True if the value is a color-like object
   * @static
   * @example
   * import { Color } from 'pixi.js';
   * Color.isColorLike('white'); // returns true
   * Color.isColorLike(0xffffff); // returns true
   * Color.isColorLike([1, 1, 1]); // returns true
   */
  static isColorLike(t) {
    return typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof Zi || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0;
  }
};
Ei.shared = new Ei();
Ei._temp = new Ei();
Ei.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
let gt = Ei;
const ed = {
  cullArea: null,
  cullable: !1,
  cullableChildren: !0
};
class mo {
  /**
   * Constructs a new Pool.
   * @param ClassType - The constructor of the items in the pool.
   * @param {number} [initialSize] - The initial size of the pool.
   */
  constructor(t, e) {
    this._pool = [], this._count = 0, this._index = 0, this._classType = t, e && this.prepopulate(e);
  }
  /**
   * Prepopulates the pool with a given number of items.
   * @param total - The number of items to add to the pool.
   */
  prepopulate(t) {
    for (let e = 0; e < t; e++)
      this._pool[this._index++] = new this._classType();
    this._count += t;
  }
  /**
   * Gets an item from the pool. Calls the item's `init` method if it exists.
   * If there are no items left in the pool, a new one will be created.
   * @param {unknown} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(t) {
    var i;
    let e;
    return this._index > 0 ? e = this._pool[--this._index] : e = new this._classType(), (i = e.init) == null || i.call(e, t), e;
  }
  /**
   * Returns an item to the pool. Calls the item's `reset` method if it exists.
   * @param {T} item - The item to return to the pool.
   */
  return(t) {
    var e;
    (e = t.reset) == null || e.call(t), this._pool[this._index++] = t;
  }
  /**
   * Gets the number of items in the pool.
   * @readonly
   * @member {number}
   */
  get totalSize() {
    return this._count;
  }
  /**
   * Gets the number of items in the pool that are free to use without needing to create more.
   * @readonly
   * @member {number}
   */
  get totalFree() {
    return this._index;
  }
  /**
   * Gets the number of items in the pool that are currently in use.
   * @readonly
   * @member {number}
   */
  get totalUsed() {
    return this._count - this._index;
  }
  /** clears the pool - mainly used for debugging! */
  clear() {
    this._pool.length = 0, this._index = 0;
  }
}
class id {
  constructor() {
    this._poolsByClass = /* @__PURE__ */ new Map();
  }
  /**
   * Prepopulates a specific pool with a given number of items.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {number} total - The number of items to add to the pool.
   */
  prepopulate(t, e) {
    this.getPool(t).prepopulate(e);
  }
  /**
   * Gets an item from a specific pool.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {unknown} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(t, e) {
    return this.getPool(t).get(e);
  }
  /**
   * Returns an item to its respective pool.
   * @param {PoolItem} item - The item to return to the pool.
   */
  return(t) {
    this.getPool(t.constructor).return(t);
  }
  /**
   * Gets a specific pool based on the class type.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} ClassType - The constructor of the items in the pool.
   * @returns {Pool<T>} The pool of the given class type.
   */
  getPool(t) {
    return this._poolsByClass.has(t) || this._poolsByClass.set(t, new mo(t)), this._poolsByClass.get(t);
  }
  /** gets the usage stats of each pool in the system */
  stats() {
    const t = {};
    return this._poolsByClass.forEach((e) => {
      const i = t[e._classType.name] ? e._classType.name + e._classType.ID : e._classType.name;
      t[i] = {
        free: e.totalFree,
        used: e.totalUsed,
        size: e.totalSize
      };
    }), t;
  }
}
const Pe = new id();
function sd(s, t, e) {
  const i = s.length;
  let n;
  if (t >= i || e === 0)
    return;
  e = t + e > i ? i - t : e;
  const r = i - e;
  for (n = t; n < r; ++n)
    s[n] = s[n + e];
  s.length = r;
}
const nd = {
  allowChildren: !0,
  /**
   * Removes all children from this container that are within the begin and end indexes.
   * @param beginIndex - The beginning position.
   * @param endIndex - The ending position. Default value is size of the container.
   * @returns - List of removed children
   * @memberof scene.Container#
   */
  removeChildren(s = 0, t) {
    const e = t ?? this.children.length, i = e - s, n = [];
    if (i > 0 && i <= e) {
      for (let o = e - 1; o >= s; o--) {
        const a = this.children[o];
        a && (n.push(a), a.parent = null);
      }
      sd(this.children, s, e);
      const r = this.renderGroup || this.parentRenderGroup;
      r && r.removeChildren(n);
      for (let o = 0; o < n.length; ++o)
        this.emit("childRemoved", n[o], this, o), n[o].emit("removed", this);
      return n;
    } else if (i === 0 && this.children.length === 0)
      return n;
    throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
  },
  /**
   * Removes a child from the specified index position.
   * @param index - The index to get the child from
   * @returns The child that was removed.
   * @memberof scene.Container#
   */
  removeChildAt(s) {
    const t = this.getChildAt(s);
    return this.removeChild(t);
  },
  /**
   * Returns the child at the specified index
   * @param index - The index to get the child at
   * @returns - The child at the given index, if any.
   * @memberof scene.Container#
   */
  getChildAt(s) {
    if (s < 0 || s >= this.children.length)
      throw new Error(`getChildAt: Index (${s}) does not exist.`);
    return this.children[s];
  },
  /**
   * Changes the position of an existing child in the container container
   * @param child - The child Container instance for which you want to change the index number
   * @param index - The resulting index number for the child container
   * @memberof scene.Container#
   */
  setChildIndex(s, t) {
    if (t < 0 || t >= this.children.length)
      throw new Error(`The index ${t} supplied is out of bounds ${this.children.length}`);
    this.getChildIndex(s), this.addChildAt(s, t);
  },
  /**
   * Returns the index position of a child Container instance
   * @param child - The Container instance to identify
   * @returns - The index position of the child container to identify
   * @memberof scene.Container#
   */
  getChildIndex(s) {
    const t = this.children.indexOf(s);
    if (t === -1)
      throw new Error("The supplied Container must be a child of the caller");
    return t;
  },
  /**
   * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown.
   * If the child is already in this container, it will be moved to the specified index.
   * @param {Container} child - The child to add.
   * @param {number} index - The absolute index where the child will be positioned at the end of the operation.
   * @returns {Container} The child that was added.
   * @memberof scene.Container#
   */
  addChildAt(s, t) {
    this.allowChildren || H($, "addChildAt: Only Containers will be allowed to add children in v8.0.0");
    const { children: e } = this;
    if (t < 0 || t > e.length)
      throw new Error(`${s}addChildAt: The index ${t} supplied is out of bounds ${e.length}`);
    if (s.parent) {
      const n = s.parent.children.indexOf(s);
      if (s.parent === this && n === t)
        return s;
      n !== -1 && s.parent.children.splice(n, 1);
    }
    t === e.length ? e.push(s) : e.splice(t, 0, s), s.parent = this, s.didChange = !0, s._updateFlags = 15;
    const i = this.renderGroup || this.parentRenderGroup;
    return i && i.addChild(s), this.sortableChildren && (this.sortDirty = !0), this.emit("childAdded", s, this, t), s.emit("added", this), s;
  },
  /**
   * Swaps the position of 2 Containers within this container.
   * @param child - First container to swap
   * @param child2 - Second container to swap
   * @memberof scene.Container#
   */
  swapChildren(s, t) {
    if (s === t)
      return;
    const e = this.getChildIndex(s), i = this.getChildIndex(t);
    this.children[e] = t, this.children[i] = s;
    const n = this.renderGroup || this.parentRenderGroup;
    n && (n.structureDidChange = !0), this._didContainerChangeTick++;
  },
  /**
   * Remove the Container from its parent Container. If the Container has no parent, do nothing.
   * @memberof scene.Container#
   */
  removeFromParent() {
    var s;
    (s = this.parent) == null || s.removeChild(this);
  },
  /**
   * Reparent the child to this container, keeping the same worldTransform.
   * @param child - The child to reparent
   * @returns The first child that was reparented.
   * @memberof scene.Container#
   */
  reparentChild(...s) {
    return s.length === 1 ? this.reparentChildAt(s[0], this.children.length) : (s.forEach((t) => this.reparentChildAt(t, this.children.length)), s[0]);
  },
  /**
   * Reparent the child to this container at the specified index, keeping the same worldTransform.
   * @param child - The child to reparent
   * @param index - The index to reparent the child to
   * @memberof scene.Container#
   */
  reparentChildAt(s, t) {
    if (s.parent === this)
      return this.setChildIndex(s, t), s;
    const e = s.worldTransform.clone();
    s.removeFromParent(), this.addChildAt(s, t);
    const i = this.worldTransform.clone();
    return i.invert(), e.prepend(i), s.setFromMatrix(e), s;
  }
};
class la {
  constructor() {
    this.pipe = "filter", this.priority = 1;
  }
  destroy() {
    for (let t = 0; t < this.filters.length; t++)
      this.filters[t].destroy();
    this.filters = null, this.filterArea = null;
  }
}
class rd {
  constructor() {
    this._effectClasses = [], this._tests = [], this._initialized = !1;
  }
  init() {
    this._initialized || (this._initialized = !0, this._effectClasses.forEach((t) => {
      this.add({
        test: t.test,
        maskClass: t
      });
    }));
  }
  add(t) {
    this._tests.push(t);
  }
  getMaskEffect(t) {
    this._initialized || this.init();
    for (let e = 0; e < this._tests.length; e++) {
      const i = this._tests[e];
      if (i.test(t))
        return Pe.get(i.maskClass, t);
    }
    return t;
  }
  returnMaskEffect(t) {
    Pe.return(t);
  }
}
const Mr = new rd();
Pt.handleByList(D.MaskEffect, Mr._effectClasses);
const od = {
  _maskEffect: null,
  _maskOptions: {
    inverse: !1
  },
  _filterEffect: null,
  /**
   * @todo Needs docs.
   * @memberof scene.Container#
   * @type {Array<Effect>}
   */
  effects: [],
  /**
   * @todo Needs docs.
   * @param effect - The effect to add.
   * @memberof scene.Container#
   * @ignore
   */
  addEffect(s) {
    if (this.effects.indexOf(s) !== -1)
      return;
    this.effects.push(s), this.effects.sort((i, n) => i.priority - n.priority);
    const e = this.renderGroup || this.parentRenderGroup;
    e && (e.structureDidChange = !0), this._updateIsSimple();
  },
  /**
   * @todo Needs docs.
   * @param effect - The effect to remove.
   * @memberof scene.Container#
   * @ignore
   */
  removeEffect(s) {
    const t = this.effects.indexOf(s);
    t !== -1 && (this.effects.splice(t, 1), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateIsSimple());
  },
  set mask(s) {
    const t = this._maskEffect;
    (t == null ? void 0 : t.mask) !== s && (t && (this.removeEffect(t), Mr.returnMaskEffect(t), this._maskEffect = null), s != null && (this._maskEffect = Mr.getMaskEffect(s), this.addEffect(this._maskEffect)));
  },
  /**
   * Used to set mask and control mask options.
   * @param options
   * @example
   * import { Graphics, Sprite } from 'pixi.js';
   *
   * const graphics = new Graphics();
   * graphics.beginFill(0xFF3300);
   * graphics.drawRect(50, 250, 100, 100);
   * graphics.endFill();
   *
   * const sprite = new Sprite(texture);
   * sprite.setMask({
   *     mask: graphics,
   *     inverse: true,
   * });
   * @memberof scene.Container#
   */
  setMask(s) {
    this._maskOptions = {
      ...this._maskOptions,
      ...s
    }, s.mask && (this.mask = s.mask);
  },
  /**
   * Sets a mask for the displayObject. A mask is an object that limits the visibility of an
   * object to the shape of the mask applied to it. In PixiJS a regular mask must be a
   * {@link Graphics} or a {@link Sprite} object. This allows for much faster masking in canvas as it
   * utilities shape clipping. Furthermore, a mask of an object must be in the subtree of its parent.
   * Otherwise, `getLocalBounds` may calculate incorrect bounds, which makes the container's width and height wrong.
   * To remove a mask, set this property to `null`.
   *
   * For sprite mask both alpha and red channel are used. Black mask is the same as transparent mask.
   * @example
   * import { Graphics, Sprite } from 'pixi.js';
   *
   * const graphics = new Graphics();
   * graphics.beginFill(0xFF3300);
   * graphics.drawRect(50, 250, 100, 100);
   * graphics.endFill();
   *
   * const sprite = new Sprite(texture);
   * sprite.mask = graphics;
   * @memberof scene.Container#
   */
  get mask() {
    var s;
    return (s = this._maskEffect) == null ? void 0 : s.mask;
  },
  set filters(s) {
    var r;
    !Array.isArray(s) && s && (s = [s]);
    const t = this._filterEffect || (this._filterEffect = new la());
    s = s;
    const e = (s == null ? void 0 : s.length) > 0, i = ((r = t.filters) == null ? void 0 : r.length) > 0, n = e !== i;
    s = Array.isArray(s) ? s.slice(0) : s, t.filters = Object.freeze(s), n && (e ? this.addEffect(t) : (this.removeEffect(t), t.filters = s ?? null));
  },
  /**
   * Sets the filters for the displayObject.
   * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
   * To remove filters simply set this property to `'null'`.
   * @memberof scene.Container#
   */
  get filters() {
    var s;
    return (s = this._filterEffect) == null ? void 0 : s.filters;
  },
  set filterArea(s) {
    this._filterEffect || (this._filterEffect = new la()), this._filterEffect.filterArea = s;
  },
  /**
   * The area the filter is applied to. This is used as more of an optimization
   * rather than figuring out the dimensions of the displayObject each frame you can set this rectangle.
   *
   * Also works as an interaction mask.
   * @memberof scene.Container#
   */
  get filterArea() {
    var s;
    return (s = this._filterEffect) == null ? void 0 : s.filterArea;
  }
}, ad = {
  /**
   * The instance label of the object.
   * @memberof scene.Container#
   * @member {string} label
   */
  label: null,
  /**
   * The instance name of the object.
   * @deprecated since 8.0.0
   * @see scene.Container#label
   * @member {string} name
   * @memberof scene.Container#
   */
  get name() {
    return H($, "Container.name property has been removed, use Container.label instead"), this.label;
  },
  set name(s) {
    H($, "Container.name property has been removed, use Container.label instead"), this.label = s;
  },
  /**
   * @method getChildByName
   * @deprecated since 8.0.0
   * @param {string} name - Instance name.
   * @param {boolean}[deep=false] - Whether to search recursively
   * @returns {Container} The child with the specified name.
   * @see scene.Container#getChildByLabel
   * @memberof scene.Container#
   */
  getChildByName(s, t = !1) {
    return this.getChildByLabel(s, t);
  },
  /**
   * Returns the first child in the container with the specified label.
   *
   * Recursive searches are done in a pre-order traversal.
   * @memberof scene.Container#
   * @param {string|RegExp} label - Instance label.
   * @param {boolean}[deep=false] - Whether to search recursively
   * @returns {Container} The child with the specified label.
   */
  getChildByLabel(s, t = !1) {
    const e = this.children;
    for (let i = 0; i < e.length; i++) {
      const n = e[i];
      if (n.label === s || s instanceof RegExp && s.test(n.label))
        return n;
    }
    if (t)
      for (let i = 0; i < e.length; i++) {
        const r = e[i].getChildByLabel(s, !0);
        if (r)
          return r;
      }
    return null;
  },
  /**
   * Returns all children in the container with the specified label.
   * @memberof scene.Container#
   * @param {string|RegExp} label - Instance label.
   * @param {boolean}[deep=false] - Whether to search recursively
   * @param {Container[]} [out=[]] - The array to store matching children in.
   * @returns {Container[]} An array of children with the specified label.
   */
  getChildrenByLabel(s, t = !1, e = []) {
    const i = this.children;
    for (let n = 0; n < i.length; n++) {
      const r = i[n];
      (r.label === s || s instanceof RegExp && s.test(r.label)) && e.push(r);
    }
    if (t)
      for (let n = 0; n < i.length; n++)
        i[n].getChildrenByLabel(s, !0, e);
    return e;
  }
}, Me = new mo(j), Ii = new mo(xe);
function Nh(s, t, e) {
  e.clear();
  let i, n;
  return s.parent ? t ? i = s.parent.worldTransform : (n = Me.get().identity(), i = sn(s, n)) : i = j.IDENTITY, Hh(s, e, i, t), n && Me.return(n), e.isValid || e.set(0, 0, 0, 0), e;
}
function Hh(s, t, e, i) {
  var a, h;
  if (!s.visible || !s.measurable)
    return;
  let n;
  i ? n = s.worldTransform : (s.updateLocalTransform(), n = Me.get(), n.appendFrom(s.localTransform, e));
  const r = t, o = !!s.effects.length;
  if (o && (t = Ii.get().clear()), s.boundsArea)
    t.addRect(s.boundsArea, n);
  else {
    s.addBounds && (t.matrix = n, s.addBounds(t));
    for (let c = 0; c < s.children.length; c++)
      Hh(s.children[c], t, n, i);
  }
  if (o) {
    for (let c = 0; c < s.effects.length; c++)
      (h = (a = s.effects[c]).addBounds) == null || h.call(a, t);
    r.addBounds(t, j.IDENTITY), Ii.return(t);
  }
  i || Me.return(n);
}
function sn(s, t) {
  const e = s.parent;
  return e && (sn(e, t), e.updateLocalTransform(), t.append(e.localTransform)), t;
}
let Hn = 0;
const ca = 500;
function ut(...s) {
  Hn !== ca && (Hn++, Hn === ca ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...s));
}
function $h(s, t, e) {
  return t.clear(), e || (e = j.IDENTITY), jh(s, t, e, s, !0), t.isValid || t.set(0, 0, 0, 0), t;
}
function jh(s, t, e, i, n) {
  var h, c;
  let r;
  if (n)
    r = Me.get(), r = e.copyTo(r);
  else {
    if (!s.visible || !s.measurable)
      return;
    s.updateLocalTransform();
    const l = s.localTransform;
    r = Me.get(), r.appendFrom(l, e);
  }
  const o = t, a = !!s.effects.length;
  if (a && (t = Ii.get().clear()), s.boundsArea)
    t.addRect(s.boundsArea, r);
  else {
    s.renderPipeId && (t.matrix = r, s.addBounds(t));
    const l = s.children;
    for (let d = 0; d < l.length; d++)
      jh(l[d], t, r, i, !1);
  }
  if (a) {
    for (let l = 0; l < s.effects.length; l++)
      (c = (h = s.effects[l]).addLocalBounds) == null || c.call(h, t, i);
    o.addBounds(t, j.IDENTITY), Ii.return(t);
  }
  Me.return(r);
}
function Yh(s, t) {
  const e = s.children;
  for (let i = 0; i < e.length; i++) {
    const n = e[i], r = n.uid, o = (n._didViewChangeTick & 65535) << 16 | n._didContainerChangeTick & 65535, a = t.index;
    (t.data[a] !== r || t.data[a + 1] !== o) && (t.data[t.index] = r, t.data[t.index + 1] = o, t.didChange = !0), t.index = a + 2, n.children.length && Yh(n, t);
  }
  return t.didChange;
}
const hd = new j(), ld = {
  _localBoundsCacheId: -1,
  _localBoundsCacheData: null,
  _setWidth(s, t) {
    const e = Math.sign(this.scale.x) || 1;
    t !== 0 ? this.scale.x = s / t * e : this.scale.x = e;
  },
  _setHeight(s, t) {
    const e = Math.sign(this.scale.y) || 1;
    t !== 0 ? this.scale.y = s / t * e : this.scale.y = e;
  },
  /**
   * Retrieves the local bounds of the container as a Bounds object.
   * @returns - The bounding area.
   * @memberof scene.Container#
   */
  getLocalBounds() {
    this._localBoundsCacheData || (this._localBoundsCacheData = {
      data: [],
      index: 1,
      didChange: !1,
      localBounds: new xe()
    });
    const s = this._localBoundsCacheData;
    return s.index = 1, s.didChange = !1, s.data[0] !== this._didViewChangeTick && (s.didChange = !0, s.data[0] = this._didViewChangeTick), Yh(this, s), s.didChange && $h(this, s.localBounds, hd), s.localBounds;
  },
  /**
   * Calculates and returns the (world) bounds of the display object as a [Rectangle]{@link Rectangle}.
   * @param skipUpdate - Setting to `true` will stop the transforms of the scene graph from
   *  being updated. This means the calculation returned MAY be out of date BUT will give you a
   *  nice performance boost.
   * @param bounds - Optional bounds to store the result of the bounds calculation.
   * @returns - The minimum axis-aligned rectangle in world space that fits around this object.
   * @memberof scene.Container#
   */
  getBounds(s, t) {
    return Nh(this, s, t || new xe());
  }
}, cd = {
  _onRender: null,
  set onRender(s) {
    const t = this.renderGroup || this.parentRenderGroup;
    if (!s) {
      this._onRender && (t == null || t.removeOnRender(this)), this._onRender = null;
      return;
    }
    this._onRender || t == null || t.addOnRender(this), this._onRender = s;
  },
  /**
   * This callback is used when the container is rendered. This is where you should add your custom
   * logic that is needed to be run every frame.
   *
   * In v7 many users used `updateTransform` for this, however the way v8 renders objects is different
   * and "updateTransform" is no longer called every frame
   * @example
   * const container = new Container();
   * container.onRender = () => {
   *    container.rotation += 0.01;
   * };
   * @memberof scene.Container#
   */
  get onRender() {
    return this._onRender;
  }
}, ud = {
  _zIndex: 0,
  /**
   * Should children be sorted by zIndex at the next render call.
   *
   * Will get automatically set to true if a new child is added, or if a child's zIndex changes.
   * @type {boolean}
   * @memberof scene.Container#
   */
  sortDirty: !1,
  /**
   * If set to true, the container will sort its children by `zIndex` value
   * when the next render is called, or manually if `sortChildren()` is called.
   *
   * This actually changes the order of elements in the array, so should be treated
   * as a basic solution that is not performant compared to other solutions,
   * such as {@link https://github.com/pixijs/layers PixiJS Layers}
   *
   * Also be aware of that this may not work nicely with the `addChildAt()` function,
   * as the `zIndex` sorting may cause the child to automatically sorted to another position.
   * @type {boolean}
   * @memberof scene.Container#
   */
  sortableChildren: !1,
  /**
   * The zIndex of the container.
   *
   * Setting this value, will automatically set the parent to be sortable. Children will be automatically
   * sorted by zIndex value; a higher value will mean it will be moved towards the end of the array,
   * and thus rendered on top of other display objects within the same container.
   * @see scene.Container#sortableChildren
   * @memberof scene.Container#
   */
  get zIndex() {
    return this._zIndex;
  },
  set zIndex(s) {
    this._zIndex !== s && (this._zIndex = s, this.depthOfChildModified());
  },
  depthOfChildModified() {
    this.parent && (this.parent.sortableChildren = !0, this.parent.sortDirty = !0), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0);
  },
  /**
   * Sorts children by zIndex.
   * @memberof scene.Container#
   */
  sortChildren() {
    this.sortDirty && (this.sortDirty = !1, this.children.sort(dd));
  }
};
function dd(s, t) {
  return s._zIndex - t._zIndex;
}
const fd = {
  /**
   * Returns the global position of the container.
   * @param point - The optional point to write the global value to.
   * @param skipUpdate - Should we skip the update transform.
   * @returns - The updated point.
   * @memberof scene.Container#
   */
  getGlobalPosition(s = new Ct(), t = !1) {
    return this.parent ? this.parent.toGlobal(this._position, s, t) : (s.x = this._position.x, s.y = this._position.y), s;
  },
  /**
   * Calculates the global position of the container.
   * @param position - The world origin to calculate from.
   * @param point - A Point object in which to store the value, optional
   *  (otherwise will create a new Point).
   * @param skipUpdate - Should we skip the update transform.
   * @returns - A point object representing the position of this object.
   * @memberof scene.Container#
   */
  toGlobal(s, t, e = !1) {
    if (!e) {
      this.updateLocalTransform();
      const i = sn(this, new j());
      return i.append(this.localTransform), i.apply(s, t);
    }
    return this.worldTransform.apply(s, t);
  },
  /**
   * Calculates the local position of the container relative to another point.
   * @param position - The world origin to calculate from.
   * @param from - The Container to calculate the global position from.
   * @param point - A Point object in which to store the value, optional
   *  (otherwise will create a new Point).
   * @param skipUpdate - Should we skip the update transform
   * @returns - A point object representing the position of this object
   * @memberof scene.Container#
   */
  toLocal(s, t, e, i) {
    if (t && (s = t.toGlobal(s, e, i)), !i) {
      this.updateLocalTransform();
      const n = sn(this, new j());
      return n.append(this.localTransform), n.applyInverse(s, e);
    }
    return this.worldTransform.applyInverse(s, e);
  }
};
let pd = 0;
class Xh {
  constructor() {
    this.uid = xt("instructionSet"), this.instructions = [], this.instructionSize = 0, this.renderables = [], this.tick = 0;
  }
  /** reset the instruction set so it can be reused set size back to 0 */
  reset() {
    this.instructionSize = 0, this.tick = pd++;
  }
  /**
   * Add an instruction to the set
   * @param instruction - add an instruction to the set
   */
  add(t) {
    this.instructions[this.instructionSize++] = t;
  }
  /**
   * Log the instructions to the console (for debugging)
   * @internal
   * @ignore
   */
  log() {
    this.instructions.length = this.instructionSize, console.table(this.instructions, ["type", "action"]);
  }
}
class gd {
  constructor() {
    this.renderPipeId = "renderGroup", this.root = null, this.canBundle = !1, this.renderGroupParent = null, this.renderGroupChildren = [], this.worldTransform = new j(), this.worldColorAlpha = 4294967295, this.worldColor = 16777215, this.worldAlpha = 1, this.childrenToUpdate = /* @__PURE__ */ Object.create(null), this.updateTick = 0, this.childrenRenderablesToUpdate = { list: [], index: 0 }, this.structureDidChange = !0, this.instructionSet = new Xh(), this._onRenderContainers = [];
  }
  init(t) {
    this.root = t, t._onRender && this.addOnRender(t), t.didChange = !0;
    const e = t.children;
    for (let i = 0; i < e.length; i++)
      this.addChild(e[i]);
  }
  reset() {
    this.renderGroupChildren.length = 0;
    for (const t in this.childrenToUpdate) {
      const e = this.childrenToUpdate[t];
      e.list.fill(null), e.index = 0;
    }
    this.childrenRenderablesToUpdate.index = 0, this.childrenRenderablesToUpdate.list.fill(null), this.root = null, this.updateTick = 0, this.structureDidChange = !0, this._onRenderContainers.length = 0, this.renderGroupParent = null;
  }
  get localTransform() {
    return this.root.localTransform;
  }
  addRenderGroupChild(t) {
    t.renderGroupParent && t.renderGroupParent._removeRenderGroupChild(t), t.renderGroupParent = this, this.renderGroupChildren.push(t);
  }
  _removeRenderGroupChild(t) {
    const e = this.renderGroupChildren.indexOf(t);
    e > -1 && this.renderGroupChildren.splice(e, 1), t.renderGroupParent = null;
  }
  addChild(t) {
    if (this.structureDidChange = !0, t.parentRenderGroup = this, t.updateTick = -1, t.parent === this.root ? t.relativeRenderGroupDepth = 1 : t.relativeRenderGroupDepth = t.parent.relativeRenderGroupDepth + 1, t.didChange = !0, this.onChildUpdate(t), t.renderGroup) {
      this.addRenderGroupChild(t.renderGroup);
      return;
    }
    t._onRender && this.addOnRender(t);
    const e = t.children;
    for (let i = 0; i < e.length; i++)
      this.addChild(e[i]);
  }
  removeChild(t) {
    if (this.structureDidChange = !0, t._onRender && (t.renderGroup || this.removeOnRender(t)), t.parentRenderGroup = null, t.renderGroup) {
      this._removeRenderGroupChild(t.renderGroup);
      return;
    }
    const e = t.children;
    for (let i = 0; i < e.length; i++)
      this.removeChild(e[i]);
  }
  removeChildren(t) {
    for (let e = 0; e < t.length; e++)
      this.removeChild(t[e]);
  }
  onChildUpdate(t) {
    let e = this.childrenToUpdate[t.relativeRenderGroupDepth];
    e || (e = this.childrenToUpdate[t.relativeRenderGroupDepth] = {
      index: 0,
      list: []
    }), e.list[e.index++] = t;
  }
  updateRenderable(t) {
    t.globalDisplayStatus < 7 || (this.instructionSet.renderPipes[t.renderPipeId].updateRenderable(t), t.didViewUpdate = !1);
  }
  onChildViewUpdate(t) {
    this.childrenRenderablesToUpdate.list[this.childrenRenderablesToUpdate.index++] = t;
  }
  get isRenderable() {
    return this.root.localDisplayStatus === 7 && this.worldAlpha > 0;
  }
  /**
   * adding a container to the onRender list will make sure the user function
   * passed in to the user defined 'onRender` callBack
   * @param container - the container to add to the onRender list
   */
  addOnRender(t) {
    this._onRenderContainers.push(t);
  }
  removeOnRender(t) {
    this._onRenderContainers.splice(this._onRenderContainers.indexOf(t), 1);
  }
  runOnRender() {
    for (let t = 0; t < this._onRenderContainers.length; t++)
      this._onRenderContainers[t]._onRender();
  }
  destroy() {
    this.renderGroupParent = null, this.root = null, this.childrenRenderablesToUpdate = null, this.childrenToUpdate = null, this.renderGroupChildren = null, this._onRenderContainers = null, this.instructionSet = null;
  }
  getChildren(t = []) {
    const e = this.root.children;
    for (let i = 0; i < e.length; i++)
      this._getChildren(e[i], t);
    return t;
  }
  _getChildren(t, e = []) {
    if (e.push(t), t.renderGroup)
      return e;
    const i = t.children;
    for (let n = 0; n < i.length; n++)
      this._getChildren(i[n], e);
    return e;
  }
}
function md(s, t, e = {}) {
  for (const i in t)
    !e[i] && t[i] !== void 0 && (s[i] = t[i]);
}
const $n = new _t(null), jn = new _t(null), Yn = new _t(null, 1, 1), ua = 1, _d = 2, Xn = 4;
class Et extends kt {
  constructor(t = {}) {
    var e, i;
    super(), this.uid = xt("renderable"), this._updateFlags = 15, this.renderGroup = null, this.parentRenderGroup = null, this.parentRenderGroupIndex = 0, this.didChange = !1, this.didViewUpdate = !1, this.relativeRenderGroupDepth = 0, this.children = [], this.parent = null, this.includeInBuild = !0, this.measurable = !0, this.isSimple = !0, this.updateTick = -1, this.localTransform = new j(), this.relativeGroupTransform = new j(), this.groupTransform = this.relativeGroupTransform, this.destroyed = !1, this._position = new _t(this, 0, 0), this._scale = Yn, this._pivot = jn, this._skew = $n, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._rotation = 0, this.localColor = 16777215, this.localAlpha = 1, this.groupAlpha = 1, this.groupColor = 16777215, this.groupColorAlpha = 4294967295, this.localBlendMode = "inherit", this.groupBlendMode = "normal", this.localDisplayStatus = 7, this.globalDisplayStatus = 7, this._didContainerChangeTick = 0, this._didViewChangeTick = 0, this._didLocalTransformChangeId = -1, this.effects = [], md(this, t, {
      children: !0,
      parent: !0,
      effects: !0
    }), (e = t.children) == null || e.forEach((n) => this.addChild(n)), (i = t.parent) == null || i.addChild(this);
  }
  /**
   * Mixes all enumerable properties and methods from a source object to Container.
   * @param source - The source of properties and methods to mix in.
   */
  static mixin(t) {
    Object.defineProperties(Et.prototype, Object.getOwnPropertyDescriptors(t));
  }
  /**
   * We now use the _didContainerChangeTick and _didViewChangeTick to track changes
   * @deprecated since 8.2.6
   * @ignore
   */
  set _didChangeId(t) {
    this._didViewChangeTick = t >> 12 & 4095, this._didContainerChangeTick = t & 4095;
  }
  get _didChangeId() {
    return this._didContainerChangeTick & 4095 | (this._didViewChangeTick & 4095) << 12;
  }
  /**
   * Adds one or more children to the container.
   *
   * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
   * @param {...Container} children - The Container(s) to add to the container
   * @returns {Container} - The first child that was added.
   */
  addChild(...t) {
    if (this.allowChildren || H($, "addChild: Only Containers will be allowed to add children in v8.0.0"), t.length > 1) {
      for (let n = 0; n < t.length; n++)
        this.addChild(t[n]);
      return t[0];
    }
    const e = t[0];
    if (e.parent === this)
      return this.children.splice(this.children.indexOf(e), 1), this.children.push(e), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), e;
    e.parent && e.parent.removeChild(e), this.children.push(e), this.sortableChildren && (this.sortDirty = !0), e.parent = this, e.didChange = !0, e._updateFlags = 15;
    const i = this.renderGroup || this.parentRenderGroup;
    return i && i.addChild(e), this.emit("childAdded", e, this, this.children.length - 1), e.emit("added", this), this._didViewChangeTick++, e._zIndex !== 0 && e.depthOfChildModified(), e;
  }
  /**
   * Removes one or more children from the container.
   * @param {...Container} children - The Container(s) to remove
   * @returns {Container} The first child that was removed.
   */
  removeChild(...t) {
    if (t.length > 1) {
      for (let n = 0; n < t.length; n++)
        this.removeChild(t[n]);
      return t[0];
    }
    const e = t[0], i = this.children.indexOf(e);
    return i > -1 && (this._didViewChangeTick++, this.children.splice(i, 1), this.renderGroup ? this.renderGroup.removeChild(e) : this.parentRenderGroup && this.parentRenderGroup.removeChild(e), e.parent = null, this.emit("childRemoved", e, this, i), e.emit("removed", this)), e;
  }
  /** @ignore */
  _onUpdate(t) {
    t && t === this._skew && this._updateSkew(), this._didContainerChangeTick++, !this.didChange && (this.didChange = !0, this.parentRenderGroup && this.parentRenderGroup.onChildUpdate(this));
  }
  set isRenderGroup(t) {
    !!this.renderGroup !== t && (t ? this.enableRenderGroup() : this.disableRenderGroup());
  }
  /**
   * Returns true if this container is a render group.
   * This means that it will be rendered as a separate pass, with its own set of instructions
   */
  get isRenderGroup() {
    return !!this.renderGroup;
  }
  /**
   * Calling this enables a render group for this container.
   * This means it will be rendered as a separate set of instructions.
   * The transform of the container will also be handled on the GPU rather than the CPU.
   */
  enableRenderGroup() {
    if (this.renderGroup)
      return;
    const t = this.parentRenderGroup;
    t == null || t.removeChild(this), this.renderGroup = Pe.get(gd, this), this.groupTransform = j.IDENTITY, t == null || t.addChild(this), this._updateIsSimple();
  }
  /** This will disable the render group for this container. */
  disableRenderGroup() {
    if (!this.renderGroup)
      return;
    const t = this.parentRenderGroup;
    t == null || t.removeChild(this), Pe.return(this.renderGroup), this.renderGroup = null, this.groupTransform = this.relativeGroupTransform, t == null || t.addChild(this), this._updateIsSimple();
  }
  /** @ignore */
  _updateIsSimple() {
    this.isSimple = !this.renderGroup && this.effects.length === 0;
  }
  /**
   * Current transform of the object based on world (parent) factors.
   * @readonly
   */
  get worldTransform() {
    return this._worldTransform || (this._worldTransform = new j()), this.renderGroup ? this._worldTransform.copyFrom(this.renderGroup.worldTransform) : this.parentRenderGroup && this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform), this._worldTransform;
  }
  // / ////// transform related stuff
  /**
   * The position of the container on the x axis relative to the local coordinates of the parent.
   * An alias to position.x
   */
  get x() {
    return this._position.x;
  }
  set x(t) {
    this._position.x = t;
  }
  /**
   * The position of the container on the y axis relative to the local coordinates of the parent.
   * An alias to position.y
   */
  get y() {
    return this._position.y;
  }
  set y(t) {
    this._position.y = t;
  }
  /**
   * The coordinate of the object relative to the local coordinates of the parent.
   * @since 4.0.0
   */
  get position() {
    return this._position;
  }
  set position(t) {
    this._position.copyFrom(t);
  }
  /**
   * The rotation of the object in radians.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(t) {
    this._rotation !== t && (this._rotation = t, this._onUpdate(this._skew));
  }
  /**
   * The angle of the object in degrees.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get angle() {
    return this.rotation * Lu;
  }
  set angle(t) {
    this.rotation = t * Ou;
  }
  /**
   * The center of rotation, scaling, and skewing for this display object in its local space. The `position`
   * is the projection of `pivot` in the parent's local space.
   *
   * By default, the pivot is the origin (0, 0).
   * @since 4.0.0
   */
  get pivot() {
    return this._pivot === jn && (this._pivot = new _t(this, 0, 0)), this._pivot;
  }
  set pivot(t) {
    this._pivot === jn && (this._pivot = new _t(this, 0, 0)), typeof t == "number" ? this._pivot.set(t) : this._pivot.copyFrom(t);
  }
  /**
   * The skew factor for the object in radians.
   * @since 4.0.0
   */
  get skew() {
    return this._skew === $n && (this._skew = new _t(this, 0, 0)), this._skew;
  }
  set skew(t) {
    this._skew === $n && (this._skew = new _t(this, 0, 0)), this._skew.copyFrom(t);
  }
  /**
   * The scale factors of this object along the local coordinate axes.
   *
   * The default scale is (1, 1).
   * @since 4.0.0
   */
  get scale() {
    return this._scale === Yn && (this._scale = new _t(this, 1, 1)), this._scale;
  }
  set scale(t) {
    this._scale === Yn && (this._scale = new _t(this, 0, 0)), typeof t == "number" ? this._scale.set(t) : this._scale.copyFrom(t);
  }
  /**
   * The width of the Container, setting this will actually modify the scale to achieve the value set.
   * @memberof scene.Container#
   */
  get width() {
    return Math.abs(this.scale.x * this.getLocalBounds().width);
  }
  set width(t) {
    const e = this.getLocalBounds().width;
    this._setWidth(t, e);
  }
  /**
   * The height of the Container, setting this will actually modify the scale to achieve the value set.
   * @memberof scene.Container#
   */
  get height() {
    return Math.abs(this.scale.y * this.getLocalBounds().height);
  }
  set height(t) {
    const e = this.getLocalBounds().height;
    this._setHeight(t, e);
  }
  /**
   * Retrieves the size of the container as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the container.
   * @memberof scene.Container#
   */
  getSize(t) {
    t || (t = {});
    const e = this.getLocalBounds();
    return t.width = Math.abs(this.scale.x * e.width), t.height = Math.abs(this.scale.y * e.height), t;
  }
  /**
   * Sets the size of the container to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   * @memberof scene.Container#
   */
  setSize(t, e) {
    const i = this.getLocalBounds();
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, i.width), e !== void 0 && this._setHeight(e, i.height);
  }
  /** Called when the skew or the rotation changes. */
  _updateSkew() {
    const t = this._rotation, e = this._skew;
    this._cx = Math.cos(t + e._y), this._sx = Math.sin(t + e._y), this._cy = -Math.sin(t - e._x), this._sy = Math.cos(t - e._x);
  }
  /**
   * Updates the transform properties of the container (accepts partial values).
   * @param {object} opts - The options for updating the transform.
   * @param {number} opts.x - The x position of the container.
   * @param {number} opts.y - The y position of the container.
   * @param {number} opts.scaleX - The scale factor on the x-axis.
   * @param {number} opts.scaleY - The scale factor on the y-axis.
   * @param {number} opts.rotation - The rotation of the container, in radians.
   * @param {number} opts.skewX - The skew factor on the x-axis.
   * @param {number} opts.skewY - The skew factor on the y-axis.
   * @param {number} opts.pivotX - The x coordinate of the pivot point.
   * @param {number} opts.pivotY - The y coordinate of the pivot point.
   */
  updateTransform(t) {
    return this.position.set(
      typeof t.x == "number" ? t.x : this.position.x,
      typeof t.y == "number" ? t.y : this.position.y
    ), this.scale.set(
      typeof t.scaleX == "number" ? t.scaleX || 1 : this.scale.x,
      typeof t.scaleY == "number" ? t.scaleY || 1 : this.scale.y
    ), this.rotation = typeof t.rotation == "number" ? t.rotation : this.rotation, this.skew.set(
      typeof t.skewX == "number" ? t.skewX : this.skew.x,
      typeof t.skewY == "number" ? t.skewY : this.skew.y
    ), this.pivot.set(
      typeof t.pivotX == "number" ? t.pivotX : this.pivot.x,
      typeof t.pivotY == "number" ? t.pivotY : this.pivot.y
    ), this;
  }
  /**
   * Updates the local transform using the given matrix.
   * @param matrix - The matrix to use for updating the transform.
   */
  setFromMatrix(t) {
    t.decompose(this);
  }
  /** Updates the local transform. */
  updateLocalTransform() {
    const t = this._didContainerChangeTick;
    if (this._didLocalTransformChangeId === t)
      return;
    this._didLocalTransformChangeId = t;
    const e = this.localTransform, i = this._scale, n = this._pivot, r = this._position, o = i._x, a = i._y, h = n._x, c = n._y;
    e.a = this._cx * o, e.b = this._sx * o, e.c = this._cy * a, e.d = this._sy * a, e.tx = r._x - (h * e.a + c * e.c), e.ty = r._y - (h * e.b + c * e.d);
  }
  // / ///// color related stuff
  set alpha(t) {
    t !== this.localAlpha && (this.localAlpha = t, this._updateFlags |= ua, this._onUpdate());
  }
  /** The opacity of the object. */
  get alpha() {
    return this.localAlpha;
  }
  set tint(t) {
    const i = gt.shared.setValue(t ?? 16777215).toBgrNumber();
    i !== this.localColor && (this.localColor = i, this._updateFlags |= ua, this._onUpdate());
  }
  /**
   * The tint applied to the sprite. This is a hex value.
   *
   * A value of 0xFFFFFF will remove any tint effect.
   * @default 0xFFFFFF
   */
  get tint() {
    const t = this.localColor;
    return ((t & 255) << 16) + (t & 65280) + (t >> 16 & 255);
  }
  // / //////////////// blend related stuff
  set blendMode(t) {
    this.localBlendMode !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= _d, this.localBlendMode = t, this._onUpdate());
  }
  /**
   * The blend mode to be applied to the sprite. Apply a value of `'normal'` to reset the blend mode.
   * @default 'normal'
   */
  get blendMode() {
    return this.localBlendMode;
  }
  // / ///////// VISIBILITY / RENDERABLE /////////////////
  /** The visibility of the object. If false the object will not be drawn, and the transform will not be updated. */
  get visible() {
    return !!(this.localDisplayStatus & 2);
  }
  set visible(t) {
    const e = t ? 2 : 0;
    (this.localDisplayStatus & 2) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Xn, this.localDisplayStatus ^= 2, this._onUpdate());
  }
  /** @ignore */
  get culled() {
    return !(this.localDisplayStatus & 4);
  }
  /** @ignore */
  set culled(t) {
    const e = t ? 0 : 4;
    (this.localDisplayStatus & 4) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Xn, this.localDisplayStatus ^= 4, this._onUpdate());
  }
  /** Can this object be rendered, if false the object will not be drawn but the transform will still be updated. */
  get renderable() {
    return !!(this.localDisplayStatus & 1);
  }
  set renderable(t) {
    const e = t ? 1 : 0;
    (this.localDisplayStatus & 1) !== e && (this._updateFlags |= Xn, this.localDisplayStatus ^= 1, this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._onUpdate());
  }
  /** Whether or not the object should be rendered. */
  get isRenderable() {
    return this.localDisplayStatus === 7 && this.groupAlpha > 0;
  }
  /**
   * Removes all internal references and listeners as well as removes children from the display list.
   * Do not use a Container after calling `destroy`.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
   *  method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for children with textures e.g. Sprites. If options.children
   * is set to true it should destroy the texture of the child sprite
   * @param {boolean} [options.textureSource=false] - Only used for children with textures e.g. Sprites.
   * If options.children is set to true it should destroy the texture source of the child sprite
   * @param {boolean} [options.context=false] - Only used for children with graphicsContexts e.g. Graphics.
   * If options.children is set to true it should destroy the context of the child graphics
   */
  destroy(t = !1) {
    var n;
    if (this.destroyed)
      return;
    this.destroyed = !0;
    let e;
    if (this.children.length && (e = this.removeChildren(0, this.children.length)), this.removeFromParent(), this.parent = null, this._maskEffect = null, this._filterEffect = null, this.effects = null, this._position = null, this._scale = null, this._pivot = null, this._skew = null, this.emit("destroyed", this), this.removeAllListeners(), (typeof t == "boolean" ? t : t == null ? void 0 : t.children) && e)
      for (let r = 0; r < e.length; ++r)
        e[r].destroy(t);
    (n = this.renderGroup) == null || n.destroy(), this.renderGroup = null;
  }
}
Et.mixin(nd);
Et.mixin(fd);
Et.mixin(cd);
Et.mixin(ld);
Et.mixin(od);
Et.mixin(ad);
Et.mixin(ud);
Et.mixin(ed);
class Ps extends Et {
  constructor() {
    super(...arguments), this.canBundle = !0, this.allowChildren = !1, this._roundPixels = 0, this._lastUsed = 0, this._lastInstructionTick = -1, this._bounds = new xe(0, 1, 0, 0), this._boundsDirty = !0;
  }
  /** @private */
  _updateBounds() {
  }
  /**
   * Whether or not to round the x/y position of the sprite.
   * @type {boolean}
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  set roundPixels(t) {
    this._roundPixels = t ? 1 : 0;
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(t) {
    const e = this.bounds, { x: i, y: n } = t;
    return i >= e.minX && i <= e.maxX && n >= e.minY && n <= e.maxY;
  }
  /** @private */
  onViewUpdate() {
    if (this._didViewChangeTick++, this.didViewUpdate)
      return;
    this.didViewUpdate = !0;
    const t = this.renderGroup || this.parentRenderGroup;
    t && t.onChildViewUpdate(this);
  }
  destroy(t) {
    super.destroy(t), this._bounds = null;
  }
}
class oe extends Ps {
  /**
   * @param options - The options for creating the sprite.
   */
  constructor(t = G.EMPTY) {
    t instanceof G && (t = { texture: t });
    const { texture: e = G.EMPTY, anchor: i, roundPixels: n, width: r, height: o, ...a } = t;
    super({
      label: "Sprite",
      ...a
    }), this.renderPipeId = "sprite", this.batched = !0, this._sourceBounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, this._sourceBoundsDirty = !0, this._anchor = new _t(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), i ? this.anchor = i : e.defaultAnchor && (this.anchor = e.defaultAnchor), this.texture = e, this.allowChildren = !1, this.roundPixels = n ?? !1, r !== void 0 && (this.width = r), o !== void 0 && (this.height = o);
  }
  /**
   * Helper function that creates a new sprite based on the source you provide.
   * The source can be - frame id, image, video, canvas element, video element, texture
   * @param source - Source to create texture from
   * @param [skipCache] - Whether to skip the cache or not
   * @returns The newly created sprite
   */
  static from(t, e = !1) {
    return t instanceof G ? new oe(t) : new oe(G.from(t, e));
  }
  set texture(t) {
    t || (t = G.EMPTY);
    const e = this._texture;
    e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this._width && this._setWidth(this._width, this._texture.orig.width), this._height && this._setHeight(this._height, this._texture.orig.height), this.onViewUpdate());
  }
  /** The texture that the sprite is using. */
  get texture() {
    return this._texture;
  }
  /**
   * The local bounds of the sprite.
   * @type {rendering.Bounds}
   */
  get bounds() {
    return this._boundsDirty && (this._updateBounds(), this._boundsDirty = !1), this._bounds;
  }
  /**
   * The bounds of the sprite, taking the texture's trim into account.
   * @type {rendering.Bounds}
   */
  get sourceBounds() {
    return this._sourceBoundsDirty && (this._updateSourceBounds(), this._sourceBoundsDirty = !1), this._sourceBounds;
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(t) {
    const e = this.sourceBounds;
    return t.x >= e.maxX && t.x <= e.minX && t.y >= e.maxY && t.y <= e.minY;
  }
  /**
   * Adds the bounds of this object to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(t) {
    const e = this._texture.trim ? this.sourceBounds : this.bounds;
    t.addFrame(e.minX, e.minY, e.maxX, e.maxY);
  }
  onViewUpdate() {
    this._sourceBoundsDirty = this._boundsDirty = !0, super.onViewUpdate();
  }
  _updateBounds() {
    $u(this._bounds, this._anchor, this._texture, 0);
  }
  _updateSourceBounds() {
    const t = this._anchor, e = this._texture, i = this._sourceBounds, { width: n, height: r } = e.orig;
    i.maxX = -t._x * n, i.minX = i.maxX + n, i.maxY = -t._y * r, i.minY = i.maxY + r;
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(t = !1) {
    if (super.destroy(t), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const i = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._texture.destroy(i);
    }
    this._texture = null, this._bounds = null, this._sourceBounds = null, this._anchor = null;
  }
  /**
   * The anchor sets the origin point of the sprite. The default value is taken from the {@link Texture}
   * and passed to the constructor.
   *
   * The default is `(0,0)`, this means the sprite's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite({texture: Texture.WHITE});
   * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(t) {
    this._setWidth(t, this._texture.orig.width), this._width = t;
  }
  /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(t) {
    this._setHeight(t, this._texture.orig.height), this._height = t;
  }
  /**
   * Retrieves the size of the Sprite as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the Sprite.
   */
  getSize(t) {
    return t || (t = {}), t.width = Math.abs(this.scale.x) * this._texture.orig.width, t.height = Math.abs(this.scale.y) * this._texture.orig.height, t;
  }
  /**
   * Sets the size of the Sprite to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(t, e) {
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, this._texture.orig.width), e !== void 0 && this._setHeight(e, this._texture.orig.height);
  }
}
const xd = new xe();
function Kh(s, t, e) {
  const i = xd;
  s.measurable = !0, Nh(s, e, i), t.addBoundsMask(i), s.measurable = !1;
}
function qh(s, t, e) {
  const i = Ii.get();
  s.measurable = !0;
  const n = Me.get().identity(), r = Zh(s, e, n);
  $h(s, i, r), s.measurable = !1, t.addBoundsMask(i), Me.return(n), Ii.return(i);
}
function Zh(s, t, e) {
  return s ? (s !== t && (Zh(s.parent, t, e), s.updateLocalTransform(), e.append(s.localTransform)), e) : (ut("Mask bounds, renderable is not inside the root container"), e);
}
class Qh {
  constructor(t) {
    this.priority = 0, this.inverse = !1, this.pipe = "alphaMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.renderMaskToTexture = !(t instanceof oe), this.mask.renderable = this.renderMaskToTexture, this.mask.includeInBuild = !this.renderMaskToTexture, this.mask.measurable = !1;
  }
  reset() {
    this.mask.measurable = !0, this.mask = null;
  }
  addBounds(t, e) {
    this.inverse || Kh(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    qh(this.mask, t, e);
  }
  containsPoint(t, e) {
    const i = this.mask;
    return e(i, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof oe;
  }
}
Qh.extension = D.MaskEffect;
class Jh {
  constructor(t) {
    this.priority = 0, this.pipe = "colorMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t;
  }
  destroy() {
  }
  static test(t) {
    return typeof t == "number";
  }
}
Jh.extension = D.MaskEffect;
class tl {
  constructor(t) {
    this.priority = 0, this.pipe = "stencilMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.mask.includeInBuild = !1, this.mask.measurable = !1;
  }
  reset() {
    this.mask.measurable = !0, this.mask.includeInBuild = !0, this.mask = null;
  }
  addBounds(t, e) {
    Kh(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    qh(this.mask, t, e);
  }
  containsPoint(t, e) {
    const i = this.mask;
    return e(i, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof Et;
  }
}
tl.extension = D.MaskEffect;
const yd = {
  createCanvas: (s, t) => {
    const e = document.createElement("canvas");
    return e.width = s, e.height = t, e;
  },
  getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
  getWebGLRenderingContext: () => WebGLRenderingContext,
  getNavigator: () => navigator,
  getBaseUrl: () => document.baseURI ?? window.location.href,
  getFontFaceSet: () => document.fonts,
  fetch: (s, t) => fetch(s, t),
  parseXML: (s) => new DOMParser().parseFromString(s, "text/xml")
};
let da = yd;
const ot = {
  /**
   * Returns the current adapter.
   * @returns {environment.Adapter} The current adapter.
   */
  get() {
    return da;
  },
  /**
   * Sets the current adapter.
   * @param adapter - The new adapter.
   */
  set(s) {
    da = s;
  }
};
class el extends ve {
  constructor(t) {
    t.resource || (t.resource = ot.get().createCanvas()), t.width || (t.width = t.resource.width, t.autoDensity || (t.width /= t.resolution)), t.height || (t.height = t.resource.height, t.autoDensity || (t.height /= t.resolution)), super(t), this.uploadMethodId = "image", this.autoDensity = t.autoDensity;
    const e = t.resource;
    (this.pixelWidth !== e.width || this.pixelWidth !== e.height) && this.resizeCanvas(), this.transparent = !!t.transparent;
  }
  resizeCanvas() {
    this.autoDensity && (this.resource.style.width = `${this.width}px`, this.resource.style.height = `${this.height}px`), (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) && (this.resource.width = this.pixelWidth, this.resource.height = this.pixelHeight);
  }
  resize(t = this.width, e = this.height, i = this._resolution) {
    const n = super.resize(t, e, i);
    return n && this.resizeCanvas(), n;
  }
  static test(t) {
    return globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement || globalThis.OffscreenCanvas && t instanceof OffscreenCanvas;
  }
  /**
   * Returns the 2D rendering context for the canvas.
   * Caches the context after creating it.
   * @returns The 2D rendering context of the canvas.
   */
  get context2D() {
    return this._context2D || (this._context2D = this.resource.getContext("2d"));
  }
}
el.extension = D.TextureSource;
class zi extends ve {
  constructor(t) {
    if (t.resource && globalThis.HTMLImageElement && t.resource instanceof HTMLImageElement) {
      const e = ot.get().createCanvas(t.resource.width, t.resource.height);
      e.getContext("2d").drawImage(t.resource, 0, 0, t.resource.width, t.resource.height), t.resource = e, ut("ImageSource: Image element passed, converting to canvas. Use CanvasSource instead.");
    }
    super(t), this.uploadMethodId = "image", this.autoGarbageCollect = !0;
  }
  static test(t) {
    return globalThis.HTMLImageElement && t instanceof HTMLImageElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap || globalThis.VideoFrame && t instanceof VideoFrame;
  }
}
zi.extension = D.TextureSource;
var Tr = /* @__PURE__ */ ((s) => (s[s.INTERACTION = 50] = "INTERACTION", s[s.HIGH = 25] = "HIGH", s[s.NORMAL = 0] = "NORMAL", s[s.LOW = -25] = "LOW", s[s.UTILITY = -50] = "UTILITY", s))(Tr || {});
class Kn {
  /**
   * Constructor
   * @private
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting
   * @param once - If the handler should fire once
   */
  constructor(t, e = null, i = 0, n = !1) {
    this.next = null, this.previous = null, this._destroyed = !1, this._fn = t, this._context = e, this.priority = i, this._once = n;
  }
  /**
   * Simple compare function to figure out if a function and context match.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @returns `true` if the listener match the arguments
   */
  match(t, e = null) {
    return this._fn === t && this._context === e;
  }
  /**
   * Emit by calling the current function.
   * @param ticker - The ticker emitting.
   * @returns Next ticker
   */
  emit(t) {
    this._fn && (this._context ? this._fn.call(this._context, t) : this._fn(t));
    const e = this.next;
    return this._once && this.destroy(!0), this._destroyed && (this.next = null), e;
  }
  /**
   * Connect to the list.
   * @param previous - Input node, previous listener
   */
  connect(t) {
    this.previous = t, t.next && (t.next.previous = this), this.next = t.next, t.next = this;
  }
  /**
   * Destroy and don't use after this.
   * @param hard - `true` to remove the `next` reference, this
   *        is considered a hard destroy. Soft destroy maintains the next reference.
   * @returns The listener to redirect while emitting or removing.
   */
  destroy(t = !1) {
    this._destroyed = !0, this._fn = null, this._context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
    const e = this.next;
    return this.next = t ? null : e, this.previous = null, e;
  }
}
const il = class Vt {
  constructor() {
    this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new Kn(null, null, 1 / 0), this.deltaMS = 1 / Vt.targetFPMS, this.elapsedMS = 1 / Vt.targetFPMS, this._tick = (t) => {
      this._requestId = null, this.started && (this.update(t), this.started && this._requestId === null && this._head.next && (this._requestId = requestAnimationFrame(this._tick)));
    };
  }
  /**
   * Conditionally requests a new animation frame.
   * If a frame has not already been requested, and if the internal
   * emitter has listeners, a new frame is requested.
   * @private
   */
  _requestIfNeeded() {
    this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
  }
  /**
   * Conditionally cancels a pending animation frame.
   * @private
   */
  _cancelIfNeeded() {
    this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
  }
  /**
   * Conditionally requests a new animation frame.
   * If the ticker has been started it checks if a frame has not already
   * been requested, and if the internal emitter has listeners. If these
   * conditions are met, a new frame is requested. If the ticker has not
   * been started, but autoStart is `true`, then the ticker starts now,
   * and continues with the previous conditions to request a new frame.
   * @private
   */
  _startIfPossible() {
    this.started ? this._requestIfNeeded() : this.autoStart && this.start();
  }
  /**
   * Register a handler for tick events. Calls continuously unless
   * it is removed or the ticker is stopped.
   * @param fn - The listener function to be added for updates
   * @param context - The listener context
   * @param {number} [priority=UPDATE_PRIORITY.NORMAL] - The priority for emitting
   * @returns This instance of a ticker
   */
  add(t, e, i = Tr.NORMAL) {
    return this._addListener(new Kn(t, e, i));
  }
  /**
   * Add a handler for the tick event which is only execute once.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param {number} [priority=UPDATE_PRIORITY.NORMAL] - The priority for emitting
   * @returns This instance of a ticker
   */
  addOnce(t, e, i = Tr.NORMAL) {
    return this._addListener(new Kn(t, e, i, !0));
  }
  /**
   * Internally adds the event handler so that it can be sorted by priority.
   * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
   * before the rendering.
   * @private
   * @param listener - Current listener being added.
   * @returns This instance of a ticker
   */
  _addListener(t) {
    let e = this._head.next, i = this._head;
    if (!e)
      t.connect(i);
    else {
      for (; e; ) {
        if (t.priority > e.priority) {
          t.connect(i);
          break;
        }
        i = e, e = e.next;
      }
      t.previous || t.connect(i);
    }
    return this._startIfPossible(), this;
  }
  /**
   * Removes any handlers matching the function and context parameters.
   * If no handlers are left after removing, then it cancels the animation frame.
   * @param fn - The listener function to be removed
   * @param context - The listener context to be removed
   * @returns This instance of a ticker
   */
  remove(t, e) {
    let i = this._head.next;
    for (; i; )
      i.match(t, e) ? i = i.destroy() : i = i.next;
    return this._head.next || this._cancelIfNeeded(), this;
  }
  /**
   * The number of listeners on this ticker, calculated by walking through linked list
   * @readonly
   * @member {number}
   */
  get count() {
    if (!this._head)
      return 0;
    let t = 0, e = this._head;
    for (; e = e.next; )
      t++;
    return t;
  }
  /** Starts the ticker. If the ticker has listeners a new animation frame is requested at this point. */
  start() {
    this.started || (this.started = !0, this._requestIfNeeded());
  }
  /** Stops the ticker. If the ticker has requested an animation frame it is canceled at this point. */
  stop() {
    this.started && (this.started = !1, this._cancelIfNeeded());
  }
  /** Destroy the ticker and don't use after this. Calling this method removes all references to internal events. */
  destroy() {
    if (!this._protected) {
      this.stop();
      let t = this._head.next;
      for (; t; )
        t = t.destroy(!0);
      this._head.destroy(), this._head = null;
    }
  }
  /**
   * Triggers an update. An update entails setting the
   * current {@link ticker.Ticker#elapsedMS|elapsedMS},
   * the current {@link ticker.Ticker#deltaTime|deltaTime},
   * invoking all listeners with current deltaTime,
   * and then finally setting {@link ticker.Ticker#lastTime|lastTime}
   * with the value of currentTime that was provided.
   * This method will be called automatically by animation
   * frame callbacks if the ticker instance has been started
   * and listeners are added.
   * @param {number} [currentTime=performance.now()] - the current time of execution
   */
  update(t = performance.now()) {
    let e;
    if (t > this.lastTime) {
      if (e = this.elapsedMS = t - this.lastTime, e > this._maxElapsedMS && (e = this._maxElapsedMS), e *= this.speed, this._minElapsedMS) {
        const r = t - this._lastFrame | 0;
        if (r < this._minElapsedMS)
          return;
        this._lastFrame = t - r % this._minElapsedMS;
      }
      this.deltaMS = e, this.deltaTime = this.deltaMS * Vt.targetFPMS;
      const i = this._head;
      let n = i.next;
      for (; n; )
        n = n.emit(this);
      i.next || this._cancelIfNeeded();
    } else
      this.deltaTime = this.deltaMS = this.elapsedMS = 0;
    this.lastTime = t;
  }
  /**
   * The frames per second at which this ticker is running.
   * The default is approximately 60 in most modern browsers.
   * **Note:** This does not factor in the value of
   * {@link ticker.Ticker#speed|speed}, which is specific
   * to scaling {@link ticker.Ticker#deltaTime|deltaTime}.
   * @member {number}
   * @readonly
   */
  get FPS() {
    return 1e3 / this.elapsedMS;
  }
  /**
   * Manages the maximum amount of milliseconds allowed to
   * elapse between invoking {@link ticker.Ticker#update|update}.
   * This value is used to cap {@link ticker.Ticker#deltaTime|deltaTime},
   * but does not effect the measured value of {@link ticker.Ticker#FPS|FPS}.
   * When setting this property it is clamped to a value between
   * `0` and `Ticker.targetFPMS * 1000`.
   * @member {number}
   * @default 10
   */
  get minFPS() {
    return 1e3 / this._maxElapsedMS;
  }
  set minFPS(t) {
    const e = Math.min(this.maxFPS, t), i = Math.min(Math.max(0, e) / 1e3, Vt.targetFPMS);
    this._maxElapsedMS = 1 / i;
  }
  /**
   * Manages the minimum amount of milliseconds required to
   * elapse between invoking {@link ticker.Ticker#update|update}.
   * This will effect the measured value of {@link ticker.Ticker#FPS|FPS}.
   * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
   * Otherwise it will be at least `minFPS`
   * @member {number}
   * @default 0
   */
  get maxFPS() {
    return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
  }
  set maxFPS(t) {
    if (t === 0)
      this._minElapsedMS = 0;
    else {
      const e = Math.max(this.minFPS, t);
      this._minElapsedMS = 1 / (e / 1e3);
    }
  }
  /**
   * The shared ticker instance used by {@link AnimatedSprite} and by
   * {@link VideoResource} to update animation frames / video textures.
   *
   * It may also be used by {@link Application} if created with the `sharedTicker` option property set to true.
   *
   * The property {@link ticker.Ticker#autoStart|autoStart} is set to `true` for this instance.
   * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
   * @example
   * import { Ticker } from 'pixi.js';
   *
   * const ticker = Ticker.shared;
   * // Set this to prevent starting this ticker when listeners are added.
   * // By default this is true only for the Ticker.shared instance.
   * ticker.autoStart = false;
   *
   * // FYI, call this to ensure the ticker is stopped. It should be stopped
   * // if you have not attempted to render anything yet.
   * ticker.stop();
   *
   * // Call this when you are ready for a running shared ticker.
   * ticker.start();
   * @example
   * import { autoDetectRenderer, Container } from 'pixi.js';
   *
   * // You may use the shared ticker to render...
   * const renderer = autoDetectRenderer();
   * const stage = new Container();
   * document.body.appendChild(renderer.view);
   * ticker.add((time) => renderer.render(stage));
   *
   * // Or you can just update it manually.
   * ticker.autoStart = false;
   * ticker.stop();
   * const animate = (time) => {
   *     ticker.update(time);
   *     renderer.render(stage);
   *     requestAnimationFrame(animate);
   * };
   * animate(performance.now());
   * @member {ticker.Ticker}
   * @readonly
   * @static
   */
  static get shared() {
    if (!Vt._shared) {
      const t = Vt._shared = new Vt();
      t.autoStart = !0, t._protected = !0;
    }
    return Vt._shared;
  }
  /**
   * The system ticker instance used by {@link BasePrepare} for core timing
   * functionality that shouldn't usually need to be paused, unlike the `shared`
   * ticker which drives visual animations and rendering which may want to be paused.
   *
   * The property {@link ticker.Ticker#autoStart|autoStart} is set to `true` for this instance.
   * @member {ticker.Ticker}
   * @readonly
   * @static
   */
  static get system() {
    if (!Vt._system) {
      const t = Vt._system = new Vt();
      t.autoStart = !0, t._protected = !0;
    }
    return Vt._system;
  }
};
il.targetFPMS = 0.06;
let pe = il, qn;
async function sl() {
  return qn ?? (qn = (async () => {
    var o;
    const t = document.createElement("canvas").getContext("webgl");
    if (!t)
      return "premultiply-alpha-on-upload";
    const e = await new Promise((a) => {
      const h = document.createElement("video");
      h.onloadeddata = () => a(h), h.onerror = () => a(null), h.autoplay = !1, h.crossOrigin = "anonymous", h.preload = "auto", h.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", h.load();
    });
    if (!e)
      return "premultiply-alpha-on-upload";
    const i = t.createTexture();
    t.bindTexture(t.TEXTURE_2D, i);
    const n = t.createFramebuffer();
    t.bindFramebuffer(t.FRAMEBUFFER, n), t.framebufferTexture2D(
      t.FRAMEBUFFER,
      t.COLOR_ATTACHMENT0,
      t.TEXTURE_2D,
      i,
      0
    ), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e);
    const r = new Uint8Array(4);
    return t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, r), t.deleteFramebuffer(n), t.deleteTexture(i), (o = t.getExtension("WEBGL_lose_context")) == null || o.loseContext(), r[0] <= r[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
  })()), qn;
}
const xn = class nl extends ve {
  constructor(t) {
    super(t), this.isReady = !1, this.uploadMethodId = "video", t = {
      ...nl.defaultOptions,
      ...t
    }, this._autoUpdate = !0, this._isConnectedToTicker = !1, this._updateFPS = t.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = t.autoPlay !== !1, this.alphaMode = t.alphaMode ?? "premultiply-alpha-on-upload", this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onCanPlayThrough = this._onCanPlayThrough.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), t.autoLoad !== !1 && this.load();
  }
  /** Update the video frame if the source is not destroyed and meets certain conditions. */
  updateFrame() {
    if (!this.destroyed) {
      if (this._updateFPS) {
        const t = pe.shared.elapsedMS * this.resource.playbackRate;
        this._msToNextUpdate = Math.floor(this._msToNextUpdate - t);
      }
      (!this._updateFPS || this._msToNextUpdate <= 0) && (this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0), this.isValid && this.update();
    }
  }
  /** Callback to update the video frame and potentially request the next frame update. */
  _videoFrameRequestCallback() {
    this.updateFrame(), this.destroyed ? this._videoFrameRequestCallbackHandle = null : this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    );
  }
  /**
   * Checks if the resource has valid dimensions.
   * @returns {boolean} True if width and height are set, otherwise false.
   */
  get isValid() {
    return !!this.resource.videoWidth && !!this.resource.videoHeight;
  }
  /**
   * Start preloading the video resource.
   * @returns {Promise<this>} Handle the validate event
   */
  async load() {
    if (this._load)
      return this._load;
    const t = this.resource, e = this.options;
    return (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = !0), t.addEventListener("play", this._onPlayStart), t.addEventListener("pause", this._onPlayStop), t.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (e.preload || t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlayThrough), t.addEventListener("error", this._onError, !0)), this.alphaMode = await sl(), this._load = new Promise((i, n) => {
      this.isValid ? i(this) : (this._resolve = i, this._reject = n, e.preloadTimeoutMs !== void 0 && (this._preloadTimeout = setTimeout(() => {
        this._onError(new ErrorEvent(`Preload exceeded timeout of ${e.preloadTimeoutMs}ms`));
      })), t.load());
    }), this._load;
  }
  /**
   * Handle video error events.
   * @param event - The error event
   */
  _onError(t) {
    this.resource.removeEventListener("error", this._onError, !0), this.emit("error", t), this._reject && (this._reject(t), this._reject = null, this._resolve = null);
  }
  /**
   * Checks if the underlying source is playing.
   * @returns True if playing.
   */
  _isSourcePlaying() {
    const t = this.resource;
    return !t.paused && !t.ended;
  }
  /**
   * Checks if the underlying source is ready for playing.
   * @returns True if ready.
   */
  _isSourceReady() {
    return this.resource.readyState > 2;
  }
  /** Runs the update loop when the video is ready to play. */
  _onPlayStart() {
    this.isValid || this._mediaReady(), this._configureAutoUpdate();
  }
  /** Stops the update loop when a pause event is triggered. */
  _onPlayStop() {
    this._configureAutoUpdate();
  }
  /** Handles behavior when the video completes seeking to the current playback position. */
  _onSeeked() {
    this._autoUpdate && !this._isSourcePlaying() && (this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0);
  }
  _onCanPlay() {
    this.resource.removeEventListener("canplay", this._onCanPlay), this._mediaReady();
  }
  _onCanPlayThrough() {
    this.resource.removeEventListener("canplaythrough", this._onCanPlay), this._preloadTimeout && (clearTimeout(this._preloadTimeout), this._preloadTimeout = void 0), this._mediaReady();
  }
  /** Fired when the video is loaded and ready to play. */
  _mediaReady() {
    const t = this.resource;
    this.isValid && (this.isReady = !0, this.resize(t.videoWidth, t.videoHeight)), this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0, this._resolve && (this._resolve(this), this._resolve = null, this._reject = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && this.resource.play();
  }
  /** Cleans up resources and event listeners associated with this texture. */
  destroy() {
    this._configureAutoUpdate();
    const t = this.resource;
    t && (t.removeEventListener("play", this._onPlayStart), t.removeEventListener("pause", this._onPlayStop), t.removeEventListener("seeked", this._onSeeked), t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlayThrough), t.removeEventListener("error", this._onError, !0), t.pause(), t.src = "", t.load()), super.destroy();
  }
  /** Should the base texture automatically update itself, set to true by default. */
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(t) {
    t !== this._autoUpdate && (this._autoUpdate = t, this._configureAutoUpdate());
  }
  /**
   * How many times a second to update the texture from the video.
   * Leave at 0 to update at every render.
   * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
   */
  get updateFPS() {
    return this._updateFPS;
  }
  set updateFPS(t) {
    t !== this._updateFPS && (this._updateFPS = t, this._configureAutoUpdate());
  }
  /**
   * Configures the updating mechanism based on the current state and settings.
   *
   * This method decides between using the browser's native video frame callback or a custom ticker
   * for updating the video frame. It ensures optimal performance and responsiveness
   * based on the video's state, playback status, and the desired frames-per-second setting.
   *
   * - If `_autoUpdate` is enabled and the video source is playing:
   *   - It will prefer the native video frame callback if available and no specific FPS is set.
   *   - Otherwise, it will use a custom ticker for manual updates.
   * - If `_autoUpdate` is disabled or the video isn't playing, any active update mechanisms are halted.
   */
  _configureAutoUpdate() {
    this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.resource.requestVideoFrameCallback ? (this._isConnectedToTicker && (pe.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    ))) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (pe.shared.add(this.updateFrame, this), this._isConnectedToTicker = !0, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (pe.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0));
  }
  static test(t) {
    return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement;
  }
};
xn.extension = D.TextureSource;
xn.defaultOptions = {
  ...ve.defaultOptions,
  /** If true, the video will start loading immediately. */
  autoLoad: !0,
  /** If true, the video will start playing as soon as it is loaded. */
  autoPlay: !0,
  /** The number of times a second to update the texture from the video. Leave at 0 to update at every render. */
  updateFPS: 0,
  /** If true, the video will be loaded with the `crossorigin` attribute. */
  crossorigin: !0,
  /** If true, the video will loop when it ends. */
  loop: !1,
  /** If true, the video will be muted. */
  muted: !0,
  /** If true, the video will play inline. */
  playsinline: !0,
  /** If true, the video will be preloaded. */
  preload: !1
};
xn.MIME_TYPES = {
  ogv: "video/ogg",
  mov: "video/quicktime",
  m4v: "video/mp4"
};
let Xs = xn;
const ne = (s, t, e = !1) => (Array.isArray(s) || (s = [s]), t ? s.map((i) => typeof i == "string" || e ? t(i) : i) : s);
class vd {
  constructor() {
    this._parsers = [], this._cache = /* @__PURE__ */ new Map(), this._cacheMap = /* @__PURE__ */ new Map();
  }
  /** Clear all entries. */
  reset() {
    this._cacheMap.clear(), this._cache.clear();
  }
  /**
   * Check if the key exists
   * @param key - The key to check
   */
  has(t) {
    return this._cache.has(t);
  }
  /**
   * Fetch entry by key
   * @param key - The key of the entry to get
   */
  get(t) {
    const e = this._cache.get(t);
    return e || ut(`[Assets] Asset id ${t} was not found in the Cache`), e;
  }
  /**
   * Set a value by key or keys name
   * @param key - The key or keys to set
   * @param value - The value to store in the cache or from which cacheable assets will be derived.
   */
  set(t, e) {
    const i = ne(t);
    let n;
    for (let h = 0; h < this.parsers.length; h++) {
      const c = this.parsers[h];
      if (c.test(e)) {
        n = c.getCacheableAssets(i, e);
        break;
      }
    }
    const r = new Map(Object.entries(n || {}));
    n || i.forEach((h) => {
      r.set(h, e);
    });
    const o = [...r.keys()], a = {
      cacheKeys: o,
      keys: i
    };
    i.forEach((h) => {
      this._cacheMap.set(h, a);
    }), o.forEach((h) => {
      const c = n ? n[h] : e;
      this._cache.has(h) && this._cache.get(h) !== c && ut("[Cache] already has key:", h), this._cache.set(h, r.get(h));
    });
  }
  /**
   * Remove entry by key
   *
   * This function will also remove any associated alias from the cache also.
   * @param key - The key of the entry to remove
   */
  remove(t) {
    if (!this._cacheMap.has(t)) {
      ut(`[Assets] Asset id ${t} was not found in the Cache`);
      return;
    }
    const e = this._cacheMap.get(t);
    e.cacheKeys.forEach((n) => {
      this._cache.delete(n);
    }), e.keys.forEach((n) => {
      this._cacheMap.delete(n);
    });
  }
  /** All loader parsers registered */
  get parsers() {
    return this._parsers;
  }
}
const st = new vd(), kr = [];
Pt.handleByList(D.TextureSource, kr);
function rl(s = {}) {
  const t = s && s.resource, e = t ? s.resource : s, i = t ? s : { resource: s };
  for (let n = 0; n < kr.length; n++) {
    const r = kr[n];
    if (r.test(e))
      return new r(i);
  }
  throw new Error(`Could not find a source type for resource: ${i.resource}`);
}
function bd(s = {}, t = !1) {
  const e = s && s.resource, i = e ? s.resource : s, n = e ? s : { resource: s };
  if (!t && st.has(i))
    return st.get(i);
  const r = new G({ source: rl(n) });
  return r.on("destroy", () => {
    st.has(i) && st.remove(i);
  }), t || st.set(i, r), r;
}
function wd(s, t = !1) {
  return typeof s == "string" ? st.get(s) : s instanceof ve ? new G({ source: s }) : bd(s, t);
}
G.from = wd;
ve.from = rl;
Pt.add(Qh, Jh, tl, Xs, zi, el, go);
var Ie = /* @__PURE__ */ ((s) => (s[s.Low = 0] = "Low", s[s.Normal = 1] = "Normal", s[s.High = 2] = "High", s))(Ie || {});
function se(s) {
  if (typeof s != "string")
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(s)}`);
}
function ji(s) {
  return s.split("?")[0].split("#")[0];
}
function Sd(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Ad(s, t, e) {
  return s.replace(new RegExp(Sd(t), "g"), e);
}
function Cd(s, t) {
  let e = "", i = 0, n = -1, r = 0, o = -1;
  for (let a = 0; a <= s.length; ++a) {
    if (a < s.length)
      o = s.charCodeAt(a);
    else {
      if (o === 47)
        break;
      o = 47;
    }
    if (o === 47) {
      if (!(n === a - 1 || r === 1)) if (n !== a - 1 && r === 2) {
        if (e.length < 2 || i !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
          if (e.length > 2) {
            const h = e.lastIndexOf("/");
            if (h !== e.length - 1) {
              h === -1 ? (e = "", i = 0) : (e = e.slice(0, h), i = e.length - 1 - e.lastIndexOf("/")), n = a, r = 0;
              continue;
            }
          } else if (e.length === 2 || e.length === 1) {
            e = "", i = 0, n = a, r = 0;
            continue;
          }
        }
      } else
        e.length > 0 ? e += `/${s.slice(n + 1, a)}` : e = s.slice(n + 1, a), i = a - n - 1;
      n = a, r = 0;
    } else o === 46 && r !== -1 ? ++r : r = -1;
  }
  return e;
}
const St = {
  /**
   * Converts a path to posix format.
   * @param path - The path to convert to posix
   */
  toPosix(s) {
    return Ad(s, "\\", "/");
  },
  /**
   * Checks if the path is a URL e.g. http://, https://
   * @param path - The path to check
   */
  isUrl(s) {
    return /^https?:/.test(this.toPosix(s));
  },
  /**
   * Checks if the path is a data URL
   * @param path - The path to check
   */
  isDataUrl(s) {
    return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(s);
  },
  /**
   * Checks if the path is a blob URL
   * @param path - The path to check
   */
  isBlobUrl(s) {
    return s.startsWith("blob:");
  },
  /**
   * Checks if the path has a protocol e.g. http://, https://, file:///, data:, blob:, C:/
   * This will return true for windows file paths
   * @param path - The path to check
   */
  hasProtocol(s) {
    return /^[^/:]+:/.test(this.toPosix(s));
  },
  /**
   * Returns the protocol of the path e.g. http://, https://, file:///, data:, blob:, C:/
   * @param path - The path to get the protocol from
   */
  getProtocol(s) {
    se(s), s = this.toPosix(s);
    const t = /^file:\/\/\//.exec(s);
    if (t)
      return t[0];
    const e = /^[^/:]+:\/{0,2}/.exec(s);
    return e ? e[0] : "";
  },
  /**
   * Converts URL to an absolute path.
   * When loading from a Web Worker, we must use absolute paths.
   * If the URL is already absolute we return it as is
   * If it's not, we convert it
   * @param url - The URL to test
   * @param customBaseUrl - The base URL to use
   * @param customRootUrl - The root URL to use
   */
  toAbsolute(s, t, e) {
    if (se(s), this.isDataUrl(s) || this.isBlobUrl(s))
      return s;
    const i = ji(this.toPosix(t ?? ot.get().getBaseUrl())), n = ji(this.toPosix(e ?? this.rootname(i)));
    return s = this.toPosix(s), s.startsWith("/") ? St.join(n, s.slice(1)) : this.isAbsolute(s) ? s : this.join(i, s);
  },
  /**
   * Normalizes the given path, resolving '..' and '.' segments
   * @param path - The path to normalize
   */
  normalize(s) {
    if (se(s), s.length === 0)
      return ".";
    if (this.isDataUrl(s) || this.isBlobUrl(s))
      return s;
    s = this.toPosix(s);
    let t = "";
    const e = s.startsWith("/");
    this.hasProtocol(s) && (t = this.rootname(s), s = s.slice(t.length));
    const i = s.endsWith("/");
    return s = Cd(s), s.length > 0 && i && (s += "/"), e ? `/${s}` : t + s;
  },
  /**
   * Determines if path is an absolute path.
   * Absolute paths can be urls, data urls, or paths on disk
   * @param path - The path to test
   */
  isAbsolute(s) {
    return se(s), s = this.toPosix(s), this.hasProtocol(s) ? !0 : s.startsWith("/");
  },
  /**
   * Joins all given path segments together using the platform-specific separator as a delimiter,
   * then normalizes the resulting path
   * @param segments - The segments of the path to join
   */
  join(...s) {
    if (s.length === 0)
      return ".";
    let t;
    for (let e = 0; e < s.length; ++e) {
      const i = s[e];
      if (se(i), i.length > 0)
        if (t === void 0)
          t = i;
        else {
          const n = s[e - 1] ?? "";
          this.joinExtensions.includes(this.extname(n).toLowerCase()) ? t += `/../${i}` : t += `/${i}`;
        }
    }
    return t === void 0 ? "." : this.normalize(t);
  },
  /**
   * Returns the directory name of a path
   * @param path - The path to parse
   */
  dirname(s) {
    if (se(s), s.length === 0)
      return ".";
    s = this.toPosix(s);
    let t = s.charCodeAt(0);
    const e = t === 47;
    let i = -1, n = !0;
    const r = this.getProtocol(s), o = s;
    s = s.slice(r.length);
    for (let a = s.length - 1; a >= 1; --a)
      if (t = s.charCodeAt(a), t === 47) {
        if (!n) {
          i = a;
          break;
        }
      } else
        n = !1;
    return i === -1 ? e ? "/" : this.isUrl(o) ? r + s : r : e && i === 1 ? "//" : r + s.slice(0, i);
  },
  /**
   * Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
   * @param path - The path to parse
   */
  rootname(s) {
    se(s), s = this.toPosix(s);
    let t = "";
    if (s.startsWith("/") ? t = "/" : t = this.getProtocol(s), this.isUrl(s)) {
      const e = s.indexOf("/", t.length);
      e !== -1 ? t = s.slice(0, e) : t = s, t.endsWith("/") || (t += "/");
    }
    return t;
  },
  /**
   * Returns the last portion of a path
   * @param path - The path to test
   * @param ext - Optional extension to remove
   */
  basename(s, t) {
    se(s), t && se(t), s = ji(this.toPosix(s));
    let e = 0, i = -1, n = !0, r;
    if (t !== void 0 && t.length > 0 && t.length <= s.length) {
      if (t.length === s.length && t === s)
        return "";
      let o = t.length - 1, a = -1;
      for (r = s.length - 1; r >= 0; --r) {
        const h = s.charCodeAt(r);
        if (h === 47) {
          if (!n) {
            e = r + 1;
            break;
          }
        } else
          a === -1 && (n = !1, a = r + 1), o >= 0 && (h === t.charCodeAt(o) ? --o === -1 && (i = r) : (o = -1, i = a));
      }
      return e === i ? i = a : i === -1 && (i = s.length), s.slice(e, i);
    }
    for (r = s.length - 1; r >= 0; --r)
      if (s.charCodeAt(r) === 47) {
        if (!n) {
          e = r + 1;
          break;
        }
      } else i === -1 && (n = !1, i = r + 1);
    return i === -1 ? "" : s.slice(e, i);
  },
  /**
   * Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
   * portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
   * the first character of the basename of path, an empty string is returned.
   * @param path - The path to parse
   */
  extname(s) {
    se(s), s = ji(this.toPosix(s));
    let t = -1, e = 0, i = -1, n = !0, r = 0;
    for (let o = s.length - 1; o >= 0; --o) {
      const a = s.charCodeAt(o);
      if (a === 47) {
        if (!n) {
          e = o + 1;
          break;
        }
        continue;
      }
      i === -1 && (n = !1, i = o + 1), a === 46 ? t === -1 ? t = o : r !== 1 && (r = 1) : t !== -1 && (r = -1);
    }
    return t === -1 || i === -1 || r === 0 || r === 1 && t === i - 1 && t === e + 1 ? "" : s.slice(t, i);
  },
  /**
   * Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
   * @param path - The path to parse
   */
  parse(s) {
    se(s);
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (s.length === 0)
      return t;
    s = ji(this.toPosix(s));
    let e = s.charCodeAt(0);
    const i = this.isAbsolute(s);
    let n;
    t.root = this.rootname(s), i || this.hasProtocol(s) ? n = 1 : n = 0;
    let r = -1, o = 0, a = -1, h = !0, c = s.length - 1, l = 0;
    for (; c >= n; --c) {
      if (e = s.charCodeAt(c), e === 47) {
        if (!h) {
          o = c + 1;
          break;
        }
        continue;
      }
      a === -1 && (h = !1, a = c + 1), e === 46 ? r === -1 ? r = c : l !== 1 && (l = 1) : r !== -1 && (l = -1);
    }
    return r === -1 || a === -1 || l === 0 || l === 1 && r === a - 1 && r === o + 1 ? a !== -1 && (o === 0 && i ? t.base = t.name = s.slice(1, a) : t.base = t.name = s.slice(o, a)) : (o === 0 && i ? (t.name = s.slice(1, r), t.base = s.slice(1, a)) : (t.name = s.slice(o, r), t.base = s.slice(o, a)), t.ext = s.slice(r, a)), t.dir = this.dirname(s), t;
  },
  sep: "/",
  delimiter: ":",
  joinExtensions: [".html"]
};
function ol(s, t, e, i, n) {
  const r = t[e];
  for (let o = 0; o < r.length; o++) {
    const a = r[o];
    e < t.length - 1 ? ol(s.replace(i[e], a), t, e + 1, i, n) : n.push(s.replace(i[e], a));
  }
}
function Pd(s) {
  const t = /\{(.*?)\}/g, e = s.match(t), i = [];
  if (e) {
    const n = [];
    e.forEach((r) => {
      const o = r.substring(1, r.length - 1).split(",");
      n.push(o);
    }), ol(s, n, 0, e, i);
  } else
    i.push(s);
  return i;
}
const nn = (s) => !Array.isArray(s);
class Ui {
  constructor() {
    this._defaultBundleIdentifierOptions = {
      connector: "-",
      createBundleAssetId: (t, e) => `${t}${this._bundleIdConnector}${e}`,
      extractAssetIdFromBundle: (t, e) => e.replace(`${t}${this._bundleIdConnector}`, "")
    }, this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector, this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId, this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle, this._assetMap = {}, this._preferredOrder = [], this._parsers = [], this._resolverHash = {}, this._bundles = {};
  }
  /**
   * Override how the resolver deals with generating bundle ids.
   * must be called before any bundles are added
   * @param bundleIdentifier - the bundle identifier options
   */
  setBundleIdentifier(t) {
    if (this._bundleIdConnector = t.connector ?? this._bundleIdConnector, this._createBundleAssetId = t.createBundleAssetId ?? this._createBundleAssetId, this._extractAssetIdFromBundle = t.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle, this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar")
      throw new Error("[Resolver] GenerateBundleAssetId are not working correctly");
  }
  /**
   * Let the resolver know which assets you prefer to use when resolving assets.
   * Multiple prefer user defined rules can be added.
   * @example
   * resolver.prefer({
   *     // first look for something with the correct format, and then then correct resolution
   *     priority: ['format', 'resolution'],
   *     params:{
   *         format:'webp', // prefer webp images
   *         resolution: 2, // prefer a resolution of 2
   *     }
   * })
   * resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
   * resolver.resolveUrl('foo') // => 'bar@2x.webp'
   * @param preferOrders - the prefer options
   */
  prefer(...t) {
    t.forEach((e) => {
      this._preferredOrder.push(e), e.priority || (e.priority = Object.keys(e.params));
    }), this._resolverHash = {};
  }
  /**
   * Set the base path to prepend to all urls when resolving
   * @example
   * resolver.basePath = 'https://home.com/';
   * resolver.add('foo', 'bar.ong');
   * resolver.resolveUrl('foo', 'bar.png'); // => 'https://home.com/bar.png'
   * @param basePath - the base path to use
   */
  set basePath(t) {
    this._basePath = t;
  }
  get basePath() {
    return this._basePath;
  }
  /**
   * Set the root path for root-relative URLs. By default the `basePath`'s root is used. If no `basePath` is set, then the
   * default value for browsers is `window.location.origin`
   * @example
   * // Application hosted on https://home.com/some-path/index.html
   * resolver.basePath = 'https://home.com/some-path/';
   * resolver.rootPath = 'https://home.com/';
   * resolver.add('foo', '/bar.png');
   * resolver.resolveUrl('foo', '/bar.png'); // => 'https://home.com/bar.png'
   * @param rootPath - the root path to use
   */
  set rootPath(t) {
    this._rootPath = t;
  }
  get rootPath() {
    return this._rootPath;
  }
  /**
   * All the active URL parsers that help the parser to extract information and create
   * an asset object-based on parsing the URL itself.
   *
   * Can be added using the extensions API
   * @example
   * resolver.add('foo', [
   *     {
   *         resolution: 2,
   *         format: 'png',
   *         src: 'image@2x.png',
   *     },
   *     {
   *         resolution:1,
   *         format:'png',
   *         src: 'image.png',
   *     },
   * ]);
   *
   * // With a url parser the information such as resolution and file format could extracted from the url itself:
   * extensions.add({
   *     extension: ExtensionType.ResolveParser,
   *     test: loadTextures.test, // test if url ends in an image
   *     parse: (value: string) =>
   *     ({
   *         resolution: parseFloat(Resolver.RETINA_PREFIX.exec(value)?.[1] ?? '1'),
   *         format: value.split('.').pop(),
   *         src: value,
   *     }),
   * });
   *
   * // Now resolution and format can be extracted from the url
   * resolver.add('foo', [
   *     'image@2x.png',
   *     'image.png',
   * ]);
   */
  get parsers() {
    return this._parsers;
  }
  /** Used for testing, this resets the resolver to its initial state */
  reset() {
    this.setBundleIdentifier(this._defaultBundleIdentifierOptions), this._assetMap = {}, this._preferredOrder = [], this._resolverHash = {}, this._rootPath = null, this._basePath = null, this._manifest = null, this._bundles = {}, this._defaultSearchParams = null;
  }
  /**
   * Sets the default URL search parameters for the URL resolver. The urls can be specified as a string or an object.
   * @param searchParams - the default url parameters to append when resolving urls
   */
  setDefaultSearchParams(t) {
    if (typeof t == "string")
      this._defaultSearchParams = t;
    else {
      const e = t;
      this._defaultSearchParams = Object.keys(e).map((i) => `${encodeURIComponent(i)}=${encodeURIComponent(e[i])}`).join("&");
    }
  }
  /**
   * Returns the aliases for a given asset
   * @param asset - the asset to get the aliases for
   */
  getAlias(t) {
    const { alias: e, src: i } = t;
    return ne(
      e || i,
      (r) => typeof r == "string" ? r : Array.isArray(r) ? r.map((o) => (o == null ? void 0 : o.src) ?? o) : r != null && r.src ? r.src : r,
      !0
    );
  }
  /**
   * Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
   * generally a manifest would be built using a tool.
   * @param manifest - the manifest to add to the resolver
   */
  addManifest(t) {
    this._manifest && ut("[Resolver] Manifest already exists, this will be overwritten"), this._manifest = t, t.bundles.forEach((e) => {
      this.addBundle(e.name, e.assets);
    });
  }
  /**
   * This adds a bundle of assets in one go so that you can resolve them as a group.
   * For example you could add a bundle for each screen in you pixi app
   * @example
   * resolver.addBundle('animals', [
   *  { alias: 'bunny', src: 'bunny.png' },
   *  { alias: 'chicken', src: 'chicken.png' },
   *  { alias: 'thumper', src: 'thumper.png' },
   * ]);
   * // or
   * resolver.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * const resolvedAssets = await resolver.resolveBundle('animals');
   * @param bundleId - The id of the bundle to add
   * @param assets - A record of the asset or assets that will be chosen from when loading via the specified key
   */
  addBundle(t, e) {
    const i = [];
    let n = e;
    Array.isArray(e) || (n = Object.entries(e).map(([r, o]) => typeof o == "string" || Array.isArray(o) ? { alias: r, src: o } : { alias: r, ...o })), n.forEach((r) => {
      const o = r.src, a = r.alias;
      let h;
      if (typeof a == "string") {
        const c = this._createBundleAssetId(t, a);
        i.push(c), h = [a, c];
      } else {
        const c = a.map((l) => this._createBundleAssetId(t, l));
        i.push(...c), h = [...a, ...c];
      }
      this.add({
        ...r,
        alias: h,
        src: o
      });
    }), this._bundles[t] = i;
  }
  /**
   * Tells the resolver what keys are associated with witch asset.
   * The most important thing the resolver does
   * @example
   * // Single key, single asset:
   * resolver.add({alias: 'foo', src: 'bar.png');
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Multiple keys, single asset:
   * resolver.add({alias: ['foo', 'boo'], src: 'bar.png'});
   * resolver.resolveUrl('foo') // => 'bar.png'
   * resolver.resolveUrl('boo') // => 'bar.png'
   *
   * // Multiple keys, multiple assets:
   * resolver.add({alias: ['foo', 'boo'], src: ['bar.png', 'bar.webp']});
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Add custom data attached to the resolver
   * Resolver.add({
   *     alias: 'bunnyBooBooSmooth',
   *     src: 'bunny{png,webp}',
   *     data: { scaleMode:SCALE_MODES.NEAREST }, // Base texture options
   * });
   *
   * resolver.resolve('bunnyBooBooSmooth') // => { src: 'bunny.png', data: { scaleMode: SCALE_MODES.NEAREST } }
   * @param aliases - the UnresolvedAsset or array of UnresolvedAssets to add to the resolver
   */
  add(t) {
    const e = [];
    Array.isArray(t) ? e.push(...t) : e.push(t);
    let i;
    i = (r) => {
      this.hasKey(r) && ut(`[Resolver] already has key: ${r} overwriting`);
    }, ne(e).forEach((r) => {
      const { src: o } = r;
      let { data: a, format: h, loadParser: c } = r;
      const l = ne(o).map((u) => typeof u == "string" ? Pd(u) : Array.isArray(u) ? u : [u]), d = this.getAlias(r);
      Array.isArray(d) ? d.forEach(i) : i(d);
      const f = [];
      l.forEach((u) => {
        u.forEach((g) => {
          let p = {};
          if (typeof g != "object") {
            p.src = g;
            for (let m = 0; m < this._parsers.length; m++) {
              const x = this._parsers[m];
              if (x.test(g)) {
                p = x.parse(g);
                break;
              }
            }
          } else
            a = g.data ?? a, h = g.format ?? h, c = g.loadParser ?? c, p = {
              ...p,
              ...g
            };
          if (!d)
            throw new Error(`[Resolver] alias is undefined for this asset: ${p.src}`);
          p = this._buildResolvedAsset(p, {
            aliases: d,
            data: a,
            format: h,
            loadParser: c
          }), f.push(p);
        });
      }), d.forEach((u) => {
        this._assetMap[u] = f;
      });
    });
  }
  // TODO: this needs an overload like load did in Assets
  /**
   * If the resolver has had a manifest set via setManifest, this will return the assets urls for
   * a given bundleId or bundleIds.
   * @example
   * // Manifest Example
   * const manifest = {
   *     bundles: [
   *         {
   *             name: 'load-screen',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'sunset.png',
   *                 },
   *                 {
   *                     alias: 'bar',
   *                     src: 'load-bar.{png,webp}',
   *                 },
   *             ],
   *         },
   *         {
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'character',
   *                     src: 'robot.png',
   *                 },
   *                 {
   *                     alias: 'enemy',
   *                     src: 'bad-guy.png',
   *                 },
   *             ],
   *         },
   *     ]
   * };
   *
   * resolver.setManifest(manifest);
   * const resolved = resolver.resolveBundle('load-screen');
   * @param bundleIds - The bundle ids to resolve
   * @returns All the bundles assets or a hash of assets for each bundle specified
   */
  resolveBundle(t) {
    const e = nn(t);
    t = ne(t);
    const i = {};
    return t.forEach((n) => {
      const r = this._bundles[n];
      if (r) {
        const o = this.resolve(r), a = {};
        for (const h in o) {
          const c = o[h];
          a[this._extractAssetIdFromBundle(n, h)] = c;
        }
        i[n] = a;
      }
    }), e ? i[t[0]] : i;
  }
  /**
   * Does exactly what resolve does, but returns just the URL rather than the whole asset object
   * @param key - The key or keys to resolve
   * @returns - The URLs associated with the key(s)
   */
  resolveUrl(t) {
    const e = this.resolve(t);
    if (typeof t != "string") {
      const i = {};
      for (const n in e)
        i[n] = e[n].src;
      return i;
    }
    return e.src;
  }
  resolve(t) {
    const e = nn(t);
    t = ne(t);
    const i = {};
    return t.forEach((n) => {
      if (!this._resolverHash[n])
        if (this._assetMap[n]) {
          let r = this._assetMap[n];
          const o = this._getPreferredOrder(r);
          o == null || o.priority.forEach((a) => {
            o.params[a].forEach((h) => {
              const c = r.filter((l) => l[a] ? l[a] === h : !1);
              c.length && (r = c);
            });
          }), this._resolverHash[n] = r[0];
        } else
          this._resolverHash[n] = this._buildResolvedAsset({
            alias: [n],
            src: n
          }, {});
      i[n] = this._resolverHash[n];
    }), e ? i[t[0]] : i;
  }
  /**
   * Checks if an asset with a given key exists in the resolver
   * @param key - The key of the asset
   */
  hasKey(t) {
    return !!this._assetMap[t];
  }
  /**
   * Checks if a bundle with the given key exists in the resolver
   * @param key - The key of the bundle
   */
  hasBundle(t) {
    return !!this._bundles[t];
  }
  /**
   * Internal function for figuring out what prefer criteria an asset should use.
   * @param assets
   */
  _getPreferredOrder(t) {
    for (let e = 0; e < t.length; e++) {
      const i = t[0], n = this._preferredOrder.find((r) => r.params.format.includes(i.format));
      if (n)
        return n;
    }
    return this._preferredOrder[0];
  }
  /**
   * Appends the default url parameters to the url
   * @param url - The url to append the default parameters to
   * @returns - The url with the default parameters appended
   */
  _appendDefaultSearchParams(t) {
    if (!this._defaultSearchParams)
      return t;
    const e = /\?/.test(t) ? "&" : "?";
    return `${t}${e}${this._defaultSearchParams}`;
  }
  _buildResolvedAsset(t, e) {
    const { aliases: i, data: n, loadParser: r, format: o } = e;
    return (this._basePath || this._rootPath) && (t.src = St.toAbsolute(t.src, this._basePath, this._rootPath)), t.alias = i ?? t.alias ?? [t.src], t.src = this._appendDefaultSearchParams(t.src), t.data = { ...n || {}, ...t.data }, t.loadParser = r ?? t.loadParser, t.format = o ?? t.format ?? Md(t.src), t;
  }
}
Ui.RETINA_PREFIX = /@([0-9\.]+)x/;
function Md(s) {
  return s.split(".").pop().split("?").shift().split("#").shift();
}
const Er = (s, t) => {
  const e = t.split("?")[1];
  return e && (s += `?${e}`), s;
}, al = class Qi {
  /**
   * @param texture - Reference to the source BaseTexture object.
   * @param {object} data - Spritesheet image data.
   */
  constructor(t, e) {
    this.linkedSheets = [], this._texture = t instanceof G ? t : null, this.textureSource = t.source, this.textures = {}, this.animations = {}, this.data = e;
    const i = parseFloat(e.meta.scale);
    i ? (this.resolution = i, t.source.resolution = this.resolution) : this.resolution = t.source._resolution, this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
  }
  /**
   * Parser spritesheet from loaded data. This is done asynchronously
   * to prevent creating too many Texture within a single process.
   */
  parse() {
    return new Promise((t) => {
      this._callback = t, this._batchIndex = 0, this._frameKeys.length <= Qi.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
    });
  }
  /**
   * Process a batch of frames
   * @param initialFrameIndex - The index of frame to start.
   */
  _processFrames(t) {
    let e = t;
    const i = Qi.BATCH_SIZE;
    for (; e - t < i && e < this._frameKeys.length; ) {
      const n = this._frameKeys[e], r = this._frames[n], o = r.frame;
      if (o) {
        let a = null, h = null;
        const c = r.trimmed !== !1 && r.sourceSize ? r.sourceSize : r.frame, l = new pt(
          0,
          0,
          Math.floor(c.w) / this.resolution,
          Math.floor(c.h) / this.resolution
        );
        r.rotated ? a = new pt(
          Math.floor(o.x) / this.resolution,
          Math.floor(o.y) / this.resolution,
          Math.floor(o.h) / this.resolution,
          Math.floor(o.w) / this.resolution
        ) : a = new pt(
          Math.floor(o.x) / this.resolution,
          Math.floor(o.y) / this.resolution,
          Math.floor(o.w) / this.resolution,
          Math.floor(o.h) / this.resolution
        ), r.trimmed !== !1 && r.spriteSourceSize && (h = new pt(
          Math.floor(r.spriteSourceSize.x) / this.resolution,
          Math.floor(r.spriteSourceSize.y) / this.resolution,
          Math.floor(o.w) / this.resolution,
          Math.floor(o.h) / this.resolution
        )), this.textures[n] = new G({
          source: this.textureSource,
          frame: a,
          orig: l,
          trim: h,
          rotate: r.rotated ? 2 : 0,
          defaultAnchor: r.anchor,
          defaultBorders: r.borders,
          label: n.toString()
        });
      }
      e++;
    }
  }
  /** Parse animations config. */
  _processAnimations() {
    const t = this.data.animations || {};
    for (const e in t) {
      this.animations[e] = [];
      for (let i = 0; i < t[e].length; i++) {
        const n = t[e][i];
        this.animations[e].push(this.textures[n]);
      }
    }
  }
  /** The parse has completed. */
  _parseComplete() {
    const t = this._callback;
    this._callback = null, this._batchIndex = 0, t.call(this, this.textures);
  }
  /** Begin the next batch of textures. */
  _nextBatch() {
    this._processFrames(this._batchIndex * Qi.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
      this._batchIndex * Qi.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
    }, 0);
  }
  /**
   * Destroy Spritesheet and don't use after this.
   * @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
   */
  destroy(t = !1) {
    var e;
    for (const i in this.textures)
      this.textures[i].destroy();
    this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, t && ((e = this._texture) == null || e.destroy(), this.textureSource.destroy()), this._texture = null, this.textureSource = null, this.linkedSheets = [];
  }
};
al.BATCH_SIZE = 1e3;
let fa = al;
const Td = [
  "jpg",
  "png",
  "jpeg",
  "avif",
  "webp",
  "basis",
  "etc2",
  "bc7",
  "bc6h",
  "bc5",
  "bc4",
  "bc3",
  "bc2",
  "bc1",
  "eac",
  "astc"
];
function hl(s, t, e) {
  const i = {};
  if (s.forEach((n) => {
    i[n] = t;
  }), Object.keys(t.textures).forEach((n) => {
    i[n] = t.textures[n];
  }), !e) {
    const n = St.dirname(s[0]);
    t.linkedSheets.forEach((r, o) => {
      const a = hl([`${n}/${t.data.meta.related_multi_packs[o]}`], r, !0);
      Object.assign(i, a);
    });
  }
  return i;
}
const kd = {
  extension: D.Asset,
  /** Handle the caching of the related Spritesheet Textures */
  cache: {
    test: (s) => s instanceof fa,
    getCacheableAssets: (s, t) => hl(s, t, !1)
  },
  /** Resolve the resolution of the asset. */
  resolver: {
    extension: {
      type: D.ResolveParser,
      name: "resolveSpritesheet"
    },
    test: (s) => {
      const e = s.split("?")[0].split("."), i = e.pop(), n = e.pop();
      return i === "json" && Td.includes(n);
    },
    parse: (s) => {
      var e;
      const t = s.split(".");
      return {
        resolution: parseFloat(((e = Ui.RETINA_PREFIX.exec(s)) == null ? void 0 : e[1]) ?? "1"),
        format: t[t.length - 2],
        src: s
      };
    }
  },
  /**
   * Loader plugin that parses sprite sheets!
   * once the JSON has been loaded this checks to see if the JSON is spritesheet data.
   * If it is, we load the spritesheets image and parse the data into Spritesheet
   * All textures in the sprite sheet are then added to the cache
   */
  loader: {
    name: "spritesheetLoader",
    extension: {
      type: D.LoadParser,
      priority: Ie.Normal,
      name: "spritesheetLoader"
    },
    async testParse(s, t) {
      return St.extname(t.src).toLowerCase() === ".json" && !!s.frames;
    },
    async parse(s, t, e) {
      var c, l;
      const {
        texture: i,
        // if user need to use preloaded texture
        imageFilename: n
        // if user need to use custom filename (not from jsonFile.meta.image)
      } = (t == null ? void 0 : t.data) ?? {};
      let r = St.dirname(t.src);
      r && r.lastIndexOf("/") !== r.length - 1 && (r += "/");
      let o;
      if (i instanceof G)
        o = i;
      else {
        const d = Er(r + (n ?? s.meta.image), t.src);
        o = (await e.load([d]))[d];
      }
      const a = new fa(
        o.source,
        s
      );
      await a.parse();
      const h = (c = s == null ? void 0 : s.meta) == null ? void 0 : c.related_multi_packs;
      if (Array.isArray(h)) {
        const d = [];
        for (const u of h) {
          if (typeof u != "string")
            continue;
          let g = r + u;
          (l = t.data) != null && l.ignoreMultiPack || (g = Er(g, t.src), d.push(e.load({
            src: g,
            data: {
              ignoreMultiPack: !0
            }
          })));
        }
        const f = await Promise.all(d);
        a.linkedSheets = f, f.forEach((u) => {
          u.linkedSheets = [a].concat(a.linkedSheets.filter((g) => g !== u));
        });
      }
      return a;
    },
    async unload(s, t, e) {
      await e.unload(s.textureSource._sourceOrigin), s.destroy(!1);
    }
  }
};
Pt.add(kd);
var Zn = /iPhone/i, pa = /iPod/i, ga = /iPad/i, ma = /\biOS-universal(?:.+)Mac\b/i, Qn = /\bAndroid(?:.+)Mobile\b/i, _a = /Android/i, fi = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, Ds = /Silk/i, Se = /Windows Phone/i, xa = /\bWindows(?:.+)ARM\b/i, ya = /BlackBerry/i, va = /BB10/i, ba = /Opera Mini/i, wa = /\b(CriOS|Chrome)(?:.+)Mobile/i, Sa = /Mobile(?:.+)Firefox\b/i, Aa = function(s) {
  return typeof s < "u" && s.platform === "MacIntel" && typeof s.maxTouchPoints == "number" && s.maxTouchPoints > 1 && typeof MSStream > "u";
};
function Ed(s) {
  return function(t) {
    return t.test(s);
  };
}
function Ca(s) {
  var t = {
    userAgent: "",
    platform: "",
    maxTouchPoints: 0
  };
  !s && typeof navigator < "u" ? t = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints || 0
  } : typeof s == "string" ? t.userAgent = s : s && s.userAgent && (t = {
    userAgent: s.userAgent,
    platform: s.platform,
    maxTouchPoints: s.maxTouchPoints || 0
  });
  var e = t.userAgent, i = e.split("[FBAN");
  typeof i[1] < "u" && (e = i[0]), i = e.split("Twitter"), typeof i[1] < "u" && (e = i[0]);
  var n = Ed(e), r = {
    apple: {
      phone: n(Zn) && !n(Se),
      ipod: n(pa),
      tablet: !n(Zn) && (n(ga) || Aa(t)) && !n(Se),
      universal: n(ma),
      device: (n(Zn) || n(pa) || n(ga) || n(ma) || Aa(t)) && !n(Se)
    },
    amazon: {
      phone: n(fi),
      tablet: !n(fi) && n(Ds),
      device: n(fi) || n(Ds)
    },
    android: {
      phone: !n(Se) && n(fi) || !n(Se) && n(Qn),
      tablet: !n(Se) && !n(fi) && !n(Qn) && (n(Ds) || n(_a)),
      device: !n(Se) && (n(fi) || n(Ds) || n(Qn) || n(_a)) || n(/\bokhttp\b/i)
    },
    windows: {
      phone: n(Se),
      tablet: n(xa),
      device: n(Se) || n(xa)
    },
    other: {
      blackberry: n(ya),
      blackberry10: n(va),
      opera: n(ba),
      firefox: n(Sa),
      chrome: n(wa),
      device: n(ya) || n(va) || n(ba) || n(Sa) || n(wa)
    },
    any: !1,
    phone: !1,
    tablet: !1
  };
  return r.any = r.apple.device || r.android.device || r.windows.device || r.other.device, r.phone = r.apple.phone || r.android.phone || r.windows.phone, r.tablet = r.apple.tablet || r.android.tablet || r.windows.tablet, r;
}
const Id = Ca.default ?? Ca, Be = Id(globalThis.navigator), Jn = /* @__PURE__ */ Object.create(null), Pa = /* @__PURE__ */ Object.create(null);
function _o(s, t) {
  let e = Pa[s];
  return e === void 0 && (Jn[t] === void 0 && (Jn[t] = 1), Pa[s] = e = Jn[t]++), e;
}
let pi;
function ll() {
  return (!pi || pi != null && pi.isContextLost()) && (pi = ot.get().createCanvas().getContext("webgl", {})), pi;
}
let zs;
function Bd() {
  if (!zs) {
    zs = "mediump";
    const s = ll();
    s && s.getShaderPrecisionFormat && (zs = s.getShaderPrecisionFormat(s.FRAGMENT_SHADER, s.HIGH_FLOAT).precision ? "highp" : "mediump");
  }
  return zs;
}
function Rd(s, t, e) {
  return t ? s : e ? (s = s.replace("out vec4 finalColor;", ""), `
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${s}
        `) : `
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${s}
        `;
}
function Fd(s, t, e) {
  const i = e ? t.maxSupportedFragmentPrecision : t.maxSupportedVertexPrecision;
  if (s.substring(0, 9) !== "precision") {
    let n = e ? t.requestedFragmentPrecision : t.requestedVertexPrecision;
    return n === "highp" && i !== "highp" && (n = "mediump"), `precision ${n} float;
${s}`;
  } else if (i !== "highp" && s.substring(0, 15) === "precision highp")
    return s.replace("precision highp", "precision mediump");
  return s;
}
function Ld(s, t) {
  return t ? `#version 300 es
${s}` : s;
}
const Od = {}, Dd = {};
function zd(s, { name: t = "pixi-program" }, e = !0) {
  t = t.replace(/\s+/g, "-"), t += e ? "-fragment" : "-vertex";
  const i = e ? Od : Dd;
  return i[t] ? (i[t]++, t += `-${i[t]}`) : i[t] = 1, s.indexOf("#define SHADER_NAME") !== -1 ? s : `${`#define SHADER_NAME ${t}`}
${s}`;
}
function Ud(s, t) {
  return t ? s.replace("#version 300 es", "") : s;
}
const tr = {
  // strips any version headers..
  stripVersion: Ud,
  // adds precision string if not already present
  ensurePrecision: Fd,
  // add some defines if WebGL1 to make it more compatible with WebGL2 shaders
  addProgramDefines: Rd,
  // add the program name to the shader
  setProgramName: zd,
  // add the version string to the shader header
  insertVersion: Ld
}, er = /* @__PURE__ */ Object.create(null), cl = class Ir {
  /**
   * Creates a shiny new GlProgram. Used by WebGL renderer.
   * @param options - The options for the program.
   */
  constructor(t) {
    t = { ...Ir.defaultOptions, ...t };
    const e = t.fragment.indexOf("#version 300 es") !== -1, i = {
      stripVersion: e,
      ensurePrecision: {
        requestedFragmentPrecision: t.preferredFragmentPrecision,
        requestedVertexPrecision: t.preferredVertexPrecision,
        maxSupportedVertexPrecision: "highp",
        maxSupportedFragmentPrecision: Bd()
      },
      setProgramName: {
        name: t.name
      },
      addProgramDefines: e,
      insertVersion: e
    };
    let n = t.fragment, r = t.vertex;
    Object.keys(tr).forEach((o) => {
      const a = i[o];
      n = tr[o](n, a, !0), r = tr[o](r, a, !1);
    }), this.fragment = n, this.vertex = r, this._key = _o(`${this.vertex}:${this.fragment}`, "gl-program");
  }
  /** destroys the program */
  destroy() {
    this.fragment = null, this.vertex = null, this._attributeData = null, this._uniformData = null, this._uniformBlockData = null, this.transformFeedbackVaryings = null;
  }
  /**
   * Helper function that creates a program for a given source.
   * It will check the program cache if the program has already been created.
   * If it has that one will be returned, if not a new one will be created and cached.
   * @param options - The options for the program.
   * @returns A program using the same source
   */
  static from(t) {
    const e = `${t.vertex}:${t.fragment}`;
    return er[e] || (er[e] = new Ir(t)), er[e];
  }
};
cl.defaultOptions = {
  preferredVertexPrecision: "highp",
  preferredFragmentPrecision: "mediump"
};
let ul = cl;
const Ma = {
  uint8x2: { size: 2, stride: 2, normalised: !1 },
  uint8x4: { size: 4, stride: 4, normalised: !1 },
  sint8x2: { size: 2, stride: 2, normalised: !1 },
  sint8x4: { size: 4, stride: 4, normalised: !1 },
  unorm8x2: { size: 2, stride: 2, normalised: !0 },
  unorm8x4: { size: 4, stride: 4, normalised: !0 },
  snorm8x2: { size: 2, stride: 2, normalised: !0 },
  snorm8x4: { size: 4, stride: 4, normalised: !0 },
  uint16x2: { size: 2, stride: 4, normalised: !1 },
  uint16x4: { size: 4, stride: 8, normalised: !1 },
  sint16x2: { size: 2, stride: 4, normalised: !1 },
  sint16x4: { size: 4, stride: 8, normalised: !1 },
  unorm16x2: { size: 2, stride: 4, normalised: !0 },
  unorm16x4: { size: 4, stride: 8, normalised: !0 },
  snorm16x2: { size: 2, stride: 4, normalised: !0 },
  snorm16x4: { size: 4, stride: 8, normalised: !0 },
  float16x2: { size: 2, stride: 4, normalised: !1 },
  float16x4: { size: 4, stride: 8, normalised: !1 },
  float32: { size: 1, stride: 4, normalised: !1 },
  float32x2: { size: 2, stride: 8, normalised: !1 },
  float32x3: { size: 3, stride: 12, normalised: !1 },
  float32x4: { size: 4, stride: 16, normalised: !1 },
  uint32: { size: 1, stride: 4, normalised: !1 },
  uint32x2: { size: 2, stride: 8, normalised: !1 },
  uint32x3: { size: 3, stride: 12, normalised: !1 },
  uint32x4: { size: 4, stride: 16, normalised: !1 },
  sint32: { size: 1, stride: 4, normalised: !1 },
  sint32x2: { size: 2, stride: 8, normalised: !1 },
  sint32x3: { size: 3, stride: 12, normalised: !1 },
  sint32x4: { size: 4, stride: 16, normalised: !1 }
};
function Wd(s) {
  return Ma[s] ?? Ma.float32;
}
const Gd = {
  f32: "float32",
  "vec2<f32>": "float32x2",
  "vec3<f32>": "float32x3",
  "vec4<f32>": "float32x4",
  vec2f: "float32x2",
  vec3f: "float32x3",
  vec4f: "float32x4",
  i32: "sint32",
  "vec2<i32>": "sint32x2",
  "vec3<i32>": "sint32x3",
  "vec4<i32>": "sint32x4",
  u32: "uint32",
  "vec2<u32>": "uint32x2",
  "vec3<u32>": "uint32x3",
  "vec4<u32>": "uint32x4",
  bool: "uint32",
  "vec2<bool>": "uint32x2",
  "vec3<bool>": "uint32x3",
  "vec4<bool>": "uint32x4"
};
function Vd({ source: s, entryPoint: t }) {
  const e = {}, i = s.indexOf(`fn ${t}`);
  if (i !== -1) {
    const n = s.indexOf("->", i);
    if (n !== -1) {
      const r = s.substring(i, n), o = /@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;
      let a;
      for (; (a = o.exec(r)) !== null; ) {
        const h = Gd[a[3]] ?? "float32";
        e[a[2]] = {
          location: parseInt(a[1], 10),
          format: h,
          stride: Wd(h).stride,
          offset: 0,
          instance: !1,
          start: 0
        };
      }
    }
  }
  return e;
}
function ir(s) {
  var d, f;
  const t = /(^|[^/])@(group|binding)\(\d+\)[^;]+;/g, e = /@group\((\d+)\)/, i = /@binding\((\d+)\)/, n = /var(<[^>]+>)? (\w+)/, r = /:\s*(\w+)/, o = /struct\s+(\w+)\s*{([^}]+)}/g, a = /(\w+)\s*:\s*([\w\<\>]+)/g, h = /struct\s+(\w+)/, c = (d = s.match(t)) == null ? void 0 : d.map((u) => ({
    group: parseInt(u.match(e)[1], 10),
    binding: parseInt(u.match(i)[1], 10),
    name: u.match(n)[2],
    isUniform: u.match(n)[1] === "<uniform>",
    type: u.match(r)[1]
  }));
  if (!c)
    return {
      groups: [],
      structs: []
    };
  const l = ((f = s.match(o)) == null ? void 0 : f.map((u) => {
    const g = u.match(h)[1], p = u.match(a).reduce((m, x) => {
      const [y, v] = x.split(":");
      return m[y.trim()] = v.trim(), m;
    }, {});
    return p ? { name: g, members: p } : null;
  }).filter(({ name: u }) => c.some((g) => g.type === u))) ?? [];
  return {
    groups: c,
    structs: l
  };
}
var Ji = /* @__PURE__ */ ((s) => (s[s.VERTEX = 1] = "VERTEX", s[s.FRAGMENT = 2] = "FRAGMENT", s[s.COMPUTE = 4] = "COMPUTE", s))(Ji || {});
function Nd({ groups: s }) {
  const t = [];
  for (let e = 0; e < s.length; e++) {
    const i = s[e];
    t[i.group] || (t[i.group] = []), i.isUniform ? t[i.group].push({
      binding: i.binding,
      visibility: Ji.VERTEX | Ji.FRAGMENT,
      buffer: {
        type: "uniform"
      }
    }) : i.type === "sampler" ? t[i.group].push({
      binding: i.binding,
      visibility: Ji.FRAGMENT,
      sampler: {
        type: "filtering"
      }
    }) : i.type === "texture_2d" && t[i.group].push({
      binding: i.binding,
      visibility: Ji.FRAGMENT,
      texture: {
        sampleType: "float",
        viewDimension: "2d",
        multisampled: !1
      }
    });
  }
  return t;
}
function Hd({ groups: s }) {
  const t = [];
  for (let e = 0; e < s.length; e++) {
    const i = s[e];
    t[i.group] || (t[i.group] = {}), t[i.group][i.name] = i.binding;
  }
  return t;
}
function $d(s, t) {
  const e = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), n = [...s.structs, ...t.structs].filter((o) => e.has(o.name) ? !1 : (e.add(o.name), !0)), r = [...s.groups, ...t.groups].filter((o) => {
    const a = `${o.name}-${o.binding}`;
    return i.has(a) ? !1 : (i.add(a), !0);
  });
  return { structs: n, groups: r };
}
const sr = /* @__PURE__ */ Object.create(null);
class yn {
  /**
   * Create a new GpuProgram
   * @param options - The options for the gpu program
   */
  constructor(t) {
    var a, h;
    this._layoutKey = 0, this._attributeLocationsKey = 0;
    const { fragment: e, vertex: i, layout: n, gpuLayout: r, name: o } = t;
    if (this.name = o, this.fragment = e, this.vertex = i, e.source === i.source) {
      const c = ir(e.source);
      this.structsAndGroups = c;
    } else {
      const c = ir(i.source), l = ir(e.source);
      this.structsAndGroups = $d(c, l);
    }
    this.layout = n ?? Hd(this.structsAndGroups), this.gpuLayout = r ?? Nd(this.structsAndGroups), this.autoAssignGlobalUniforms = ((a = this.layout[0]) == null ? void 0 : a.globalUniforms) !== void 0, this.autoAssignLocalUniforms = ((h = this.layout[1]) == null ? void 0 : h.localUniforms) !== void 0, this._generateProgramKey();
  }
  // TODO maker this pure
  _generateProgramKey() {
    const { vertex: t, fragment: e } = this, i = t.source + e.source + t.entryPoint + e.entryPoint;
    this._layoutKey = _o(i, "program");
  }
  get attributeData() {
    return this._attributeData ?? (this._attributeData = Vd(this.vertex)), this._attributeData;
  }
  /** destroys the program */
  destroy() {
    this.gpuLayout = null, this.layout = null, this.structsAndGroups = null, this.fragment = null, this.vertex = null;
  }
  /**
   * Helper function that creates a program for a given source.
   * It will check the program cache if the program has already been created.
   * If it has that one will be returned, if not a new one will be created and cached.
   * @param options - The options for the program.
   * @returns A program using the same source
   */
  static from(t) {
    const e = `${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:${t.vertex.entryPoint}`;
    return sr[e] || (sr[e] = new yn(t)), sr[e];
  }
}
const dl = [
  "f32",
  "i32",
  "vec2<f32>",
  "vec3<f32>",
  "vec4<f32>",
  "mat2x2<f32>",
  "mat3x3<f32>",
  "mat4x4<f32>",
  "mat3x2<f32>",
  "mat4x2<f32>",
  "mat2x3<f32>",
  "mat4x3<f32>",
  "mat2x4<f32>",
  "mat3x4<f32>"
], jd = dl.reduce((s, t) => (s[t] = !0, s), {});
function Yd(s, t) {
  switch (s) {
    case "f32":
      return 0;
    case "vec2<f32>":
      return new Float32Array(2 * t);
    case "vec3<f32>":
      return new Float32Array(3 * t);
    case "vec4<f32>":
      return new Float32Array(4 * t);
    case "mat2x2<f32>":
      return new Float32Array([
        1,
        0,
        0,
        1
      ]);
    case "mat3x3<f32>":
      return new Float32Array([
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ]);
    case "mat4x4<f32>":
      return new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ]);
  }
  return null;
}
const fl = class pl {
  /**
   * Create a new Uniform group
   * @param uniformStructures - The structures of the uniform group
   * @param options - The optional parameters of this uniform group
   */
  constructor(t, e) {
    this._touched = 0, this.uid = xt("uniform"), this._resourceType = "uniformGroup", this._resourceId = xt("resource"), this.isUniformGroup = !0, this._dirtyId = 0, this.destroyed = !1, e = { ...pl.defaultOptions, ...e }, this.uniformStructures = t;
    const i = {};
    for (const n in t) {
      const r = t[n];
      if (r.name = n, r.size = r.size ?? 1, !jd[r.type])
        throw new Error(`Uniform type ${r.type} is not supported. Supported uniform types are: ${dl.join(", ")}`);
      r.value ?? (r.value = Yd(r.type, r.size)), i[n] = r.value;
    }
    this.uniforms = i, this._dirtyId = 1, this.ubo = e.ubo, this.isStatic = e.isStatic, this._signature = _o(Object.keys(i).map(
      (n) => `${n}-${t[n].type}`
    ).join("-"), "uniform-group");
  }
  /** Call this if you want the uniform groups data to be uploaded to the GPU only useful if `isStatic` is true. */
  update() {
    this._dirtyId++;
  }
};
fl.defaultOptions = {
  /** if true the UniformGroup is handled as an Uniform buffer object. */
  ubo: !1,
  /** if true, then you are responsible for when the data is uploaded to the GPU by calling `update()` */
  isStatic: !1
};
let gl = fl;
class Ks {
  /**
   * Create a new instance eof the Bind Group.
   * @param resources - The resources that are bound together for use by a shader.
   */
  constructor(t) {
    this.resources = /* @__PURE__ */ Object.create(null), this._dirty = !0;
    let e = 0;
    for (const i in t) {
      const n = t[i];
      this.setResource(n, e++);
    }
    this._updateKey();
  }
  /**
   * Updates the key if its flagged as dirty. This is used internally to
   * match this bind group to a WebGPU BindGroup.
   * @internal
   * @ignore
   */
  _updateKey() {
    if (!this._dirty)
      return;
    this._dirty = !1;
    const t = [];
    let e = 0;
    for (const i in this.resources)
      t[e++] = this.resources[i]._resourceId;
    this._key = t.join("|");
  }
  /**
   * Set a resource at a given index. this function will
   * ensure that listeners will be removed from the current resource
   * and added to the new resource.
   * @param resource - The resource to set.
   * @param index - The index to set the resource at.
   */
  setResource(t, e) {
    var n, r;
    const i = this.resources[e];
    t !== i && (i && ((n = t.off) == null || n.call(t, "change", this.onResourceChange, this)), (r = t.on) == null || r.call(t, "change", this.onResourceChange, this), this.resources[e] = t, this._dirty = !0);
  }
  /**
   * Returns the resource at the current specified index.
   * @param index - The index of the resource to get.
   * @returns - The resource at the specified index.
   */
  getResource(t) {
    return this.resources[t];
  }
  /**
   * Used internally to 'touch' each resource, to ensure that the GC
   * knows that all resources in this bind group are still being used.
   * @param tick - The current tick.
   * @internal
   * @ignore
   */
  _touch(t) {
    const e = this.resources;
    for (const i in e)
      e[i]._touched = t;
  }
  /** Destroys this bind group and removes all listeners. */
  destroy() {
    var e;
    const t = this.resources;
    for (const i in t) {
      const n = t[i];
      (e = n.off) == null || e.call(n, "change", this.onResourceChange, this);
    }
    this.resources = null;
  }
  onResourceChange(t) {
    if (this._dirty = !0, t.destroyed) {
      const e = this.resources;
      for (const i in e)
        e[i] === t && (e[i] = null);
    } else
      this._updateKey();
  }
}
var Br = /* @__PURE__ */ ((s) => (s[s.WEBGL = 1] = "WEBGL", s[s.WEBGPU = 2] = "WEBGPU", s[s.BOTH = 3] = "BOTH", s))(Br || {});
class xo extends kt {
  constructor(t) {
    super(), this._uniformBindMap = /* @__PURE__ */ Object.create(null), this._ownedBindGroups = [];
    let {
      gpuProgram: e,
      glProgram: i,
      groups: n,
      resources: r,
      compatibleRenderers: o,
      groupMap: a
    } = t;
    this.gpuProgram = e, this.glProgram = i, o === void 0 && (o = 0, e && (o |= Br.WEBGPU), i && (o |= Br.WEBGL)), this.compatibleRenderers = o;
    const h = {};
    if (!r && !n && (r = {}), r && n)
      throw new Error("[Shader] Cannot have both resources and groups");
    if (!e && n && !a)
      throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
    if (!e && n && a)
      for (const c in a)
        for (const l in a[c]) {
          const d = a[c][l];
          h[d] = {
            group: c,
            binding: l,
            name: d
          };
        }
    else if (e && n && !a) {
      const c = e.structsAndGroups.groups;
      a = {}, c.forEach((l) => {
        a[l.group] = a[l.group] || {}, a[l.group][l.binding] = l.name, h[l.name] = l;
      });
    } else if (r) {
      n = {}, a = {}, e && e.structsAndGroups.groups.forEach((d) => {
        a[d.group] = a[d.group] || {}, a[d.group][d.binding] = d.name, h[d.name] = d;
      });
      let c = 0;
      for (const l in r)
        h[l] || (n[99] || (n[99] = new Ks(), this._ownedBindGroups.push(n[99])), h[l] = { group: 99, binding: c, name: l }, a[99] = a[99] || {}, a[99][c] = l, c++);
      for (const l in r) {
        const d = l;
        let f = r[l];
        !f.source && !f._resourceType && (f = new gl(f));
        const u = h[d];
        u && (n[u.group] || (n[u.group] = new Ks(), this._ownedBindGroups.push(n[u.group])), n[u.group].setResource(f, u.binding));
      }
    }
    this.groups = n, this._uniformBindMap = a, this.resources = this._buildResourceAccessor(n, h);
  }
  /**
   * Sometimes a resource group will be provided later (for example global uniforms)
   * In such cases, this method can be used to let the shader know about the group.
   * @param name - the name of the resource group
   * @param groupIndex - the index of the group (should match the webGPU shader group location)
   * @param bindIndex - the index of the bind point (should match the webGPU shader bind point)
   */
  addResource(t, e, i) {
    var n, r;
    (n = this._uniformBindMap)[e] || (n[e] = {}), (r = this._uniformBindMap[e])[i] || (r[i] = t), this.groups[e] || (this.groups[e] = new Ks(), this._ownedBindGroups.push(this.groups[e]));
  }
  _buildResourceAccessor(t, e) {
    const i = {};
    for (const n in e) {
      const r = e[n];
      Object.defineProperty(i, r.name, {
        get() {
          return t[r.group].getResource(r.binding);
        },
        set(o) {
          t[r.group].setResource(o, r.binding);
        }
      });
    }
    return i;
  }
  /**
   * Use to destroy the shader when its not longer needed.
   * It will destroy the resources and remove listeners.
   * @param destroyPrograms - if the programs should be destroyed as well.
   * Make sure its not being used by other shaders!
   */
  destroy(t = !1) {
    var e, i;
    this.emit("destroy", this), t && ((e = this.gpuProgram) == null || e.destroy(), (i = this.glProgram) == null || i.destroy()), this.gpuProgram = null, this.glProgram = null, this.removeAllListeners(), this._uniformBindMap = null, this._ownedBindGroups.forEach((n) => {
      n.destroy();
    }), this._ownedBindGroups = null, this.resources = null, this.groups = null;
  }
  static from(t) {
    const { gpu: e, gl: i, ...n } = t;
    let r, o;
    return e && (r = yn.from(e)), i && (o = ul.from(i)), new xo({
      gpuProgram: r,
      glProgram: o,
      ...n
    });
  }
}
const Rr = [];
Pt.handleByNamedList(D.Environment, Rr);
async function Xd(s) {
  if (!s)
    for (let t = 0; t < Rr.length; t++) {
      const e = Rr[t];
      if (e.value.test()) {
        await e.value.load();
        return;
      }
    }
}
let Yi;
function Kd() {
  if (typeof Yi == "boolean")
    return Yi;
  try {
    Yi = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === !0;
  } catch {
    Yi = !1;
  }
  return Yi;
}
var yo = { exports: {} };
yo.exports = vn;
yo.exports.default = vn;
function vn(s, t, e) {
  e = e || 2;
  var i = t && t.length, n = i ? t[0] * e : s.length, r = ml(s, 0, n, e, !0), o = [];
  if (!r || r.next === r.prev) return o;
  var a, h, c, l, d, f, u;
  if (i && (r = tf(s, t, r, e)), s.length > 80 * e) {
    a = c = s[0], h = l = s[1];
    for (var g = e; g < n; g += e)
      d = s[g], f = s[g + 1], d < a && (a = d), f < h && (h = f), d > c && (c = d), f > l && (l = f);
    u = Math.max(c - a, l - h), u = u !== 0 ? 32767 / u : 0;
  }
  return us(r, o, e, a, h, u, 0), o;
}
function ml(s, t, e, i, n) {
  var r, o;
  if (n === Or(s, t, e, i) > 0)
    for (r = t; r < e; r += i) o = Ta(r, s[r], s[r + 1], o);
  else
    for (r = e - i; r >= t; r -= i) o = Ta(r, s[r], s[r + 1], o);
  return o && bn(o, o.next) && (fs(o), o = o.next), o;
}
function ai(s, t) {
  if (!s) return s;
  t || (t = s);
  var e = s, i;
  do
    if (i = !1, !e.steiner && (bn(e, e.next) || nt(e.prev, e, e.next) === 0)) {
      if (fs(e), e = t = e.prev, e === e.next) break;
      i = !0;
    } else
      e = e.next;
  while (i || e !== t);
  return t;
}
function us(s, t, e, i, n, r, o) {
  if (s) {
    !o && r && of(s, i, n, r);
    for (var a = s, h, c; s.prev !== s.next; ) {
      if (h = s.prev, c = s.next, r ? Zd(s, i, n, r) : qd(s)) {
        t.push(h.i / e | 0), t.push(s.i / e | 0), t.push(c.i / e | 0), fs(s), s = c.next, a = c.next;
        continue;
      }
      if (s = c, s === a) {
        o ? o === 1 ? (s = Qd(ai(s), t, e), us(s, t, e, i, n, r, 2)) : o === 2 && Jd(s, t, e, i, n, r) : us(ai(s), t, e, i, n, r, 1);
        break;
      }
    }
  }
}
function qd(s) {
  var t = s.prev, e = s, i = s.next;
  if (nt(t, e, i) >= 0) return !1;
  for (var n = t.x, r = e.x, o = i.x, a = t.y, h = e.y, c = i.y, l = n < r ? n < o ? n : o : r < o ? r : o, d = a < h ? a < c ? a : c : h < c ? h : c, f = n > r ? n > o ? n : o : r > o ? r : o, u = a > h ? a > c ? a : c : h > c ? h : c, g = i.next; g !== t; ) {
    if (g.x >= l && g.x <= f && g.y >= d && g.y <= u && vi(n, a, r, h, o, c, g.x, g.y) && nt(g.prev, g, g.next) >= 0) return !1;
    g = g.next;
  }
  return !0;
}
function Zd(s, t, e, i) {
  var n = s.prev, r = s, o = s.next;
  if (nt(n, r, o) >= 0) return !1;
  for (var a = n.x, h = r.x, c = o.x, l = n.y, d = r.y, f = o.y, u = a < h ? a < c ? a : c : h < c ? h : c, g = l < d ? l < f ? l : f : d < f ? d : f, p = a > h ? a > c ? a : c : h > c ? h : c, m = l > d ? l > f ? l : f : d > f ? d : f, x = Fr(u, g, t, e, i), y = Fr(p, m, t, e, i), v = s.prevZ, w = s.nextZ; v && v.z >= x && w && w.z <= y; ) {
    if (v.x >= u && v.x <= p && v.y >= g && v.y <= m && v !== n && v !== o && vi(a, l, h, d, c, f, v.x, v.y) && nt(v.prev, v, v.next) >= 0 || (v = v.prevZ, w.x >= u && w.x <= p && w.y >= g && w.y <= m && w !== n && w !== o && vi(a, l, h, d, c, f, w.x, w.y) && nt(w.prev, w, w.next) >= 0)) return !1;
    w = w.nextZ;
  }
  for (; v && v.z >= x; ) {
    if (v.x >= u && v.x <= p && v.y >= g && v.y <= m && v !== n && v !== o && vi(a, l, h, d, c, f, v.x, v.y) && nt(v.prev, v, v.next) >= 0) return !1;
    v = v.prevZ;
  }
  for (; w && w.z <= y; ) {
    if (w.x >= u && w.x <= p && w.y >= g && w.y <= m && w !== n && w !== o && vi(a, l, h, d, c, f, w.x, w.y) && nt(w.prev, w, w.next) >= 0) return !1;
    w = w.nextZ;
  }
  return !0;
}
function Qd(s, t, e) {
  var i = s;
  do {
    var n = i.prev, r = i.next.next;
    !bn(n, r) && _l(n, i, i.next, r) && ds(n, r) && ds(r, n) && (t.push(n.i / e | 0), t.push(i.i / e | 0), t.push(r.i / e | 0), fs(i), fs(i.next), i = s = r), i = i.next;
  } while (i !== s);
  return ai(i);
}
function Jd(s, t, e, i, n, r) {
  var o = s;
  do {
    for (var a = o.next.next; a !== o.prev; ) {
      if (o.i !== a.i && lf(o, a)) {
        var h = xl(o, a);
        o = ai(o, o.next), h = ai(h, h.next), us(o, t, e, i, n, r, 0), us(h, t, e, i, n, r, 0);
        return;
      }
      a = a.next;
    }
    o = o.next;
  } while (o !== s);
}
function tf(s, t, e, i) {
  var n = [], r, o, a, h, c;
  for (r = 0, o = t.length; r < o; r++)
    a = t[r] * i, h = r < o - 1 ? t[r + 1] * i : s.length, c = ml(s, a, h, i, !1), c === c.next && (c.steiner = !0), n.push(hf(c));
  for (n.sort(ef), r = 0; r < n.length; r++)
    e = sf(n[r], e);
  return e;
}
function ef(s, t) {
  return s.x - t.x;
}
function sf(s, t) {
  var e = nf(s, t);
  if (!e)
    return t;
  var i = xl(e, s);
  return ai(i, i.next), ai(e, e.next);
}
function nf(s, t) {
  var e = t, i = s.x, n = s.y, r = -1 / 0, o;
  do {
    if (n <= e.y && n >= e.next.y && e.next.y !== e.y) {
      var a = e.x + (n - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (a <= i && a > r && (r = a, o = e.x < e.next.x ? e : e.next, a === i))
        return o;
    }
    e = e.next;
  } while (e !== t);
  if (!o) return null;
  var h = o, c = o.x, l = o.y, d = 1 / 0, f;
  e = o;
  do
    i >= e.x && e.x >= c && i !== e.x && vi(n < l ? i : r, n, c, l, n < l ? r : i, n, e.x, e.y) && (f = Math.abs(n - e.y) / (i - e.x), ds(e, s) && (f < d || f === d && (e.x > o.x || e.x === o.x && rf(o, e))) && (o = e, d = f)), e = e.next;
  while (e !== h);
  return o;
}
function rf(s, t) {
  return nt(s.prev, s, t.prev) < 0 && nt(t.next, s, s.next) < 0;
}
function of(s, t, e, i) {
  var n = s;
  do
    n.z === 0 && (n.z = Fr(n.x, n.y, t, e, i)), n.prevZ = n.prev, n.nextZ = n.next, n = n.next;
  while (n !== s);
  n.prevZ.nextZ = null, n.prevZ = null, af(n);
}
function af(s) {
  var t, e, i, n, r, o, a, h, c = 1;
  do {
    for (e = s, s = null, r = null, o = 0; e; ) {
      for (o++, i = e, a = 0, t = 0; t < c && (a++, i = i.nextZ, !!i); t++)
        ;
      for (h = c; a > 0 || h > 0 && i; )
        a !== 0 && (h === 0 || !i || e.z <= i.z) ? (n = e, e = e.nextZ, a--) : (n = i, i = i.nextZ, h--), r ? r.nextZ = n : s = n, n.prevZ = r, r = n;
      e = i;
    }
    r.nextZ = null, c *= 2;
  } while (o > 1);
  return s;
}
function Fr(s, t, e, i, n) {
  return s = (s - e) * n | 0, t = (t - i) * n | 0, s = (s | s << 8) & 16711935, s = (s | s << 4) & 252645135, s = (s | s << 2) & 858993459, s = (s | s << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, s | t << 1;
}
function hf(s) {
  var t = s, e = s;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== s);
  return e;
}
function vi(s, t, e, i, n, r, o, a) {
  return (n - o) * (t - a) >= (s - o) * (r - a) && (s - o) * (i - a) >= (e - o) * (t - a) && (e - o) * (r - a) >= (n - o) * (i - a);
}
function lf(s, t) {
  return s.next.i !== t.i && s.prev.i !== t.i && !cf(s, t) && // dones't intersect other edges
  (ds(s, t) && ds(t, s) && uf(s, t) && // locally visible
  (nt(s.prev, s, t.prev) || nt(s, t.prev, t)) || // does not create opposite-facing sectors
  bn(s, t) && nt(s.prev, s, s.next) > 0 && nt(t.prev, t, t.next) > 0);
}
function nt(s, t, e) {
  return (t.y - s.y) * (e.x - t.x) - (t.x - s.x) * (e.y - t.y);
}
function bn(s, t) {
  return s.x === t.x && s.y === t.y;
}
function _l(s, t, e, i) {
  var n = Ws(nt(s, t, e)), r = Ws(nt(s, t, i)), o = Ws(nt(e, i, s)), a = Ws(nt(e, i, t));
  return !!(n !== r && o !== a || n === 0 && Us(s, e, t) || r === 0 && Us(s, i, t) || o === 0 && Us(e, s, i) || a === 0 && Us(e, t, i));
}
function Us(s, t, e) {
  return t.x <= Math.max(s.x, e.x) && t.x >= Math.min(s.x, e.x) && t.y <= Math.max(s.y, e.y) && t.y >= Math.min(s.y, e.y);
}
function Ws(s) {
  return s > 0 ? 1 : s < 0 ? -1 : 0;
}
function cf(s, t) {
  var e = s;
  do {
    if (e.i !== s.i && e.next.i !== s.i && e.i !== t.i && e.next.i !== t.i && _l(e, e.next, s, t)) return !0;
    e = e.next;
  } while (e !== s);
  return !1;
}
function ds(s, t) {
  return nt(s.prev, s, s.next) < 0 ? nt(s, t, s.next) >= 0 && nt(s, s.prev, t) >= 0 : nt(s, t, s.prev) < 0 || nt(s, s.next, t) < 0;
}
function uf(s, t) {
  var e = s, i = !1, n = (s.x + t.x) / 2, r = (s.y + t.y) / 2;
  do
    e.y > r != e.next.y > r && e.next.y !== e.y && n < (e.next.x - e.x) * (r - e.y) / (e.next.y - e.y) + e.x && (i = !i), e = e.next;
  while (e !== s);
  return i;
}
function xl(s, t) {
  var e = new Lr(s.i, s.x, s.y), i = new Lr(t.i, t.x, t.y), n = s.next, r = t.prev;
  return s.next = t, t.prev = s, e.next = n, n.prev = e, i.next = e, e.prev = i, r.next = i, i.prev = r, i;
}
function Ta(s, t, e, i) {
  var n = new Lr(s, t, e);
  return i ? (n.next = i.next, n.prev = i, i.next.prev = n, i.next = n) : (n.prev = n, n.next = n), n;
}
function fs(s) {
  s.next.prev = s.prev, s.prev.next = s.next, s.prevZ && (s.prevZ.nextZ = s.nextZ), s.nextZ && (s.nextZ.prevZ = s.prevZ);
}
function Lr(s, t, e) {
  this.i = s, this.x = t, this.y = e, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
vn.deviation = function(s, t, e, i) {
  var n = t && t.length, r = n ? t[0] * e : s.length, o = Math.abs(Or(s, 0, r, e));
  if (n)
    for (var a = 0, h = t.length; a < h; a++) {
      var c = t[a] * e, l = a < h - 1 ? t[a + 1] * e : s.length;
      o -= Math.abs(Or(s, c, l, e));
    }
  var d = 0;
  for (a = 0; a < i.length; a += 3) {
    var f = i[a] * e, u = i[a + 1] * e, g = i[a + 2] * e;
    d += Math.abs(
      (s[f] - s[g]) * (s[u + 1] - s[f + 1]) - (s[f] - s[u]) * (s[g + 1] - s[f + 1])
    );
  }
  return o === 0 && d === 0 ? 0 : Math.abs((d - o) / o);
};
function Or(s, t, e, i) {
  for (var n = 0, r = t, o = e - i; r < e; r += i)
    n += (s[o] - s[r]) * (s[r + 1] + s[o + 1]), o = r;
  return n;
}
vn.flatten = function(s) {
  for (var t = s[0][0].length, e = { vertices: [], holes: [], dimensions: t }, i = 0, n = 0; n < s.length; n++) {
    for (var r = 0; r < s[n].length; r++)
      for (var o = 0; o < t; o++) e.vertices.push(s[n][r][o]);
    n > 0 && (i += s[n - 1].length, e.holes.push(i));
  }
  return e;
};
var df = yo.exports;
const ff = /* @__PURE__ */ po(df);
var yl = /* @__PURE__ */ ((s) => (s[s.NONE = 0] = "NONE", s[s.COLOR = 16384] = "COLOR", s[s.STENCIL = 1024] = "STENCIL", s[s.DEPTH = 256] = "DEPTH", s[s.COLOR_DEPTH = 16640] = "COLOR_DEPTH", s[s.COLOR_STENCIL = 17408] = "COLOR_STENCIL", s[s.DEPTH_STENCIL = 1280] = "DEPTH_STENCIL", s[s.ALL = 17664] = "ALL", s))(yl || {});
class pf {
  /**
   * @param name - The function name that will be executed on the listeners added to this Runner.
   */
  constructor(t) {
    this.items = [], this._name = t;
  }
  /* eslint-disable jsdoc/require-param, jsdoc/check-param-names */
  /**
   * Dispatch/Broadcast Runner to all listeners added to the queue.
   * @param {...any} params - (optional) parameters to pass to each listener
   */
  /*  eslint-enable jsdoc/require-param, jsdoc/check-param-names */
  emit(t, e, i, n, r, o, a, h) {
    const { name: c, items: l } = this;
    for (let d = 0, f = l.length; d < f; d++)
      l[d][c](t, e, i, n, r, o, a, h);
    return this;
  }
  /**
   * Add a listener to the Runner
   *
   * Runners do not need to have scope or functions passed to them.
   * All that is required is to pass the listening object and ensure that it has contains a function that has the same name
   * as the name provided to the Runner when it was created.
   *
   * Eg A listener passed to this Runner will require a 'complete' function.
   *
   * ```
   * import { Runner } from 'pixi.js';
   *
   * const complete = new Runner('complete');
   * ```
   *
   * The scope used will be the object itself.
   * @param {any} item - The object that will be listening.
   */
  add(t) {
    return t[this._name] && (this.remove(t), this.items.push(t)), this;
  }
  /**
   * Remove a single listener from the dispatch queue.
   * @param {any} item - The listener that you would like to remove.
   */
  remove(t) {
    const e = this.items.indexOf(t);
    return e !== -1 && this.items.splice(e, 1), this;
  }
  /**
   * Check to see if the listener is already in the Runner
   * @param {any} item - The listener that you would like to check.
   */
  contains(t) {
    return this.items.indexOf(t) !== -1;
  }
  /** Remove all listeners from the Runner */
  removeAll() {
    return this.items.length = 0, this;
  }
  /** Remove all references, don't use after this. */
  destroy() {
    this.removeAll(), this.items = null, this._name = null;
  }
  /**
   * `true` if there are no this Runner contains no listeners
   * @readonly
   */
  get empty() {
    return this.items.length === 0;
  }
  /**
   * The name of the runner.
   * @readonly
   */
  get name() {
    return this._name;
  }
}
const gf = [
  "init",
  "destroy",
  "contextChange",
  "resolutionChange",
  "reset",
  "renderEnd",
  "renderStart",
  "render",
  "update",
  "postrender",
  "prerender"
], vl = class bl extends kt {
  /**
   * Set up a system with a collection of SystemClasses and runners.
   * Systems are attached dynamically to this class when added.
   * @param config - the config for the system manager
   */
  constructor(t) {
    super(), this.runners = /* @__PURE__ */ Object.create(null), this.renderPipes = /* @__PURE__ */ Object.create(null), this._initOptions = {}, this._systemsHash = /* @__PURE__ */ Object.create(null), this.type = t.type, this.name = t.name, this.config = t;
    const e = [...gf, ...this.config.runners ?? []];
    this._addRunners(...e), this._unsafeEvalCheck();
  }
  /**
   * Initialize the renderer.
   * @param options - The options to use to create the renderer.
   */
  async init(t = {}) {
    const e = t.skipExtensionImports === !0 ? !0 : t.manageImports === !1;
    await Xd(e), this._addSystems(this.config.systems), this._addPipes(this.config.renderPipes, this.config.renderPipeAdaptors);
    for (const i in this._systemsHash)
      t = { ...this._systemsHash[i].constructor.defaultOptions, ...t };
    t = { ...bl.defaultOptions, ...t }, this._roundPixels = t.roundPixels ? 1 : 0;
    for (let i = 0; i < this.runners.init.items.length; i++)
      await this.runners.init.items[i].init(t);
    this._initOptions = t;
  }
  render(t, e) {
    let i = t;
    if (i instanceof Et && (i = { container: i }, e && (H($, "passing a second argument is deprecated, please use render options instead"), i.target = e.renderTexture)), i.target || (i.target = this.view.renderTarget), i.target === this.view.renderTarget && (this._lastObjectRendered = i.container, i.clearColor = this.background.colorRgba), i.clearColor) {
      const n = Array.isArray(i.clearColor) && i.clearColor.length === 4;
      i.clearColor = n ? i.clearColor : gt.shared.setValue(i.clearColor).toArray();
    }
    i.transform || (i.container.updateLocalTransform(), i.transform = i.container.localTransform), this.runners.prerender.emit(i), this.runners.renderStart.emit(i), this.runners.render.emit(i), this.runners.renderEnd.emit(i), this.runners.postrender.emit(i);
  }
  /**
   * Resizes the WebGL view to the specified width and height.
   * @param desiredScreenWidth - The desired width of the screen.
   * @param desiredScreenHeight - The desired height of the screen.
   * @param resolution - The resolution / device pixel ratio of the renderer.
   */
  resize(t, e, i) {
    const n = this.view.resolution;
    this.view.resize(t, e, i), this.emit("resize", this.view.screen.width, this.view.screen.height, this.view.resolution), i !== void 0 && i !== n && this.runners.resolutionChange.emit(i);
  }
  clear(t = {}) {
    const e = this;
    t.target || (t.target = e.renderTarget.renderTarget), t.clearColor || (t.clearColor = this.background.colorRgba), t.clear ?? (t.clear = yl.ALL);
    const { clear: i, clearColor: n, target: r } = t;
    gt.shared.setValue(n ?? this.background.colorRgba), e.renderTarget.clear(r, i, gt.shared.toArray());
  }
  /** The resolution / device pixel ratio of the renderer. */
  get resolution() {
    return this.view.resolution;
  }
  set resolution(t) {
    this.view.resolution = t, this.runners.resolutionChange.emit(t);
  }
  /**
   * Same as view.width, actual number of pixels in the canvas by horizontal.
   * @member {number}
   * @readonly
   * @default 800
   */
  get width() {
    return this.view.texture.frame.width;
  }
  /**
   * Same as view.height, actual number of pixels in the canvas by vertical.
   * @default 600
   */
  get height() {
    return this.view.texture.frame.height;
  }
  // NOTE: this was `view` in v7
  /**
   * The canvas element that everything is drawn to.
   * @type {environment.ICanvas}
   */
  get canvas() {
    return this.view.canvas;
  }
  /**
   * the last object rendered by the renderer. Useful for other plugins like interaction managers
   * @readonly
   */
  get lastObjectRendered() {
    return this._lastObjectRendered;
  }
  /**
   * Flag if we are rendering to the screen vs renderTexture
   * @readonly
   * @default true
   */
  get renderingToScreen() {
    return this.renderTarget.renderingToScreen;
  }
  /**
   * Measurements of the screen. (0, 0, screenWidth, screenHeight).
   *
   * Its safe to use as filterArea or hitArea for the whole stage.
   */
  get screen() {
    return this.view.screen;
  }
  /**
   * Create a bunch of runners based of a collection of ids
   * @param runnerIds - the runner ids to add
   */
  _addRunners(...t) {
    t.forEach((e) => {
      this.runners[e] = new pf(e);
    });
  }
  _addSystems(t) {
    let e;
    for (e in t) {
      const i = t[e];
      this._addSystem(i.value, i.name);
    }
  }
  /**
   * Add a new system to the renderer.
   * @param ClassRef - Class reference
   * @param name - Property name for system, if not specified
   *        will use a static `name` property on the class itself. This
   *        name will be assigned as s property on the Renderer so make
   *        sure it doesn't collide with properties on Renderer.
   * @returns Return instance of renderer
   */
  _addSystem(t, e) {
    const i = new t(this);
    if (this[e])
      throw new Error(`Whoops! The name "${e}" is already in use`);
    this[e] = i, this._systemsHash[e] = i;
    for (const n in this.runners)
      this.runners[n].add(i);
    return this;
  }
  _addPipes(t, e) {
    const i = e.reduce((n, r) => (n[r.name] = r.value, n), {});
    t.forEach((n) => {
      const r = n.value, o = n.name, a = i[o];
      this.renderPipes[o] = new r(
        this,
        a ? new a() : null
      );
    });
  }
  destroy(t = !1) {
    this.runners.destroy.items.reverse(), this.runners.destroy.emit(t), Object.values(this.runners).forEach((e) => {
      e.destroy();
    }), this._systemsHash = null, this.renderPipes = null;
  }
  /**
   * Generate a texture from a container.
   * @param options - options or container target to use when generating the texture
   * @returns a texture
   */
  generateTexture(t) {
    return this.textureGenerator.generateTexture(t);
  }
  /**
   * Whether the renderer will round coordinates to whole pixels when rendering.
   * Can be overridden on a per scene item basis.
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  /**
   * Overridable function by `pixi.js/unsafe-eval` to silence
   * throwing an error if platform doesn't support unsafe-evals.
   * @private
   * @ignore
   */
  _unsafeEvalCheck() {
    if (!Kd())
      throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
  }
};
vl.defaultOptions = {
  /**
   * Default resolution / device pixel ratio of the renderer.
   * @default 1
   */
  resolution: 1,
  /**
   * Should the `failIfMajorPerformanceCaveat` flag be enabled as a context option used in the `isWebGLSupported`
   * function. If set to true, a WebGL renderer can fail to be created if the browser thinks there could be
   * performance issues when using WebGL.
   *
   * In PixiJS v6 this has changed from true to false by default, to allow WebGL to work in as many
   * scenarios as possible. However, some users may have a poor experience, for example, if a user has a gpu or
   * driver version blacklisted by the
   * browser.
   *
   * If your application requires high performance rendering, you may wish to set this to false.
   * We recommend one of two options if you decide to set this flag to false:
   *
   * 1: Use the Canvas renderer as a fallback in case high performance WebGL is
   *    not supported.
   *
   * 2: Call `isWebGLSupported` (which if found in the utils package) in your code before attempting to create a
   *    PixiJS renderer, and show an error message to the user if the function returns false, explaining that their
   *    device & browser combination does not support high performance WebGL.
   *    This is a much better strategy than trying to create a PixiJS renderer and finding it then fails.
   * @default false
   */
  failIfMajorPerformanceCaveat: !1,
  /**
   * Should round pixels be forced when rendering?
   * @default false
   */
  roundPixels: !1
};
let wl = vl, Gs;
function mf(s) {
  return Gs !== void 0 || (Gs = (() => {
    var e;
    const t = {
      stencil: !0,
      failIfMajorPerformanceCaveat: s ?? wl.defaultOptions.failIfMajorPerformanceCaveat
    };
    try {
      if (!ot.get().getWebGLRenderingContext())
        return !1;
      let n = ot.get().createCanvas().getContext("webgl", t);
      const r = !!((e = n == null ? void 0 : n.getContextAttributes()) != null && e.stencil);
      if (n) {
        const o = n.getExtension("WEBGL_lose_context");
        o && o.loseContext();
      }
      return n = null, r;
    } catch {
      return !1;
    }
  })()), Gs;
}
let Vs;
async function _f(s = {}) {
  return Vs !== void 0 || (Vs = await (async () => {
    const t = ot.get().getNavigator().gpu;
    if (!t)
      return !1;
    try {
      return await (await t.requestAdapter(s)).requestDevice(), !0;
    } catch {
      return !1;
    }
  })()), Vs;
}
const ka = ["webgl", "webgpu", "canvas"];
async function xf(s) {
  let t = [];
  s.preference ? (t.push(s.preference), ka.forEach((r) => {
    r !== s.preference && t.push(r);
  })) : t = ka.slice();
  let e, i = {};
  for (let r = 0; r < t.length; r++) {
    const o = t[r];
    if (o === "webgpu" && await _f()) {
      const { WebGPURenderer: a } = await import("./WebGPURenderer-CiUOO_nV.js");
      e = a, i = { ...s, ...s.webgpu };
      break;
    } else if (o === "webgl" && mf(
      s.failIfMajorPerformanceCaveat ?? wl.defaultOptions.failIfMajorPerformanceCaveat
    )) {
      const { WebGLRenderer: a } = await import("./WebGLRenderer-X3HBBYf6.js");
      e = a, i = { ...s, ...s.webgl };
      break;
    } else if (o === "canvas")
      throw i = { ...s }, new Error("CanvasRenderer is not yet implemented");
  }
  if (delete i.webgpu, delete i.webgl, !e)
    throw new Error("No available renderer for the current environment");
  const n = new e();
  return await n.init(i), n;
}
const Sl = "8.5.2";
class Al {
  static init() {
    var t;
    (t = globalThis.__PIXI_APP_INIT__) == null || t.call(globalThis, this, Sl);
  }
  static destroy() {
  }
}
Al.extension = D.Application;
class yf {
  constructor(t) {
    this._renderer = t;
  }
  init() {
    var t;
    (t = globalThis.__PIXI_RENDERER_INIT__) == null || t.call(globalThis, this._renderer, Sl);
  }
  destroy() {
    this._renderer = null;
  }
}
yf.extension = {
  type: [
    D.WebGLSystem,
    D.WebGPUSystem
  ],
  name: "initHook",
  priority: -10
};
const Cl = class Dr {
  /** @ignore */
  constructor(...t) {
    this.stage = new Et(), t[0] !== void 0 && H($, "Application constructor options are deprecated, please use Application.init() instead.");
  }
  /**
   * @param options - The optional application and renderer parameters.
   */
  async init(t) {
    t = { ...t }, this.renderer = await xf(t), Dr._plugins.forEach((e) => {
      e.init.call(this, t);
    });
  }
  /** Render the current stage. */
  render() {
    this.renderer.render({ container: this.stage });
  }
  /**
   * Reference to the renderer's canvas element.
   * @readonly
   * @member {HTMLCanvasElement}
   */
  get canvas() {
    return this.renderer.canvas;
  }
  /**
   * Reference to the renderer's canvas element.
   * @member {HTMLCanvasElement}
   * @deprecated since 8.0.0
   */
  get view() {
    return H($, "Application.view is deprecated, please use Application.canvas instead."), this.renderer.canvas;
  }
  /**
   * Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
   * @readonly
   */
  get screen() {
    return this.renderer.screen;
  }
  /**
   * Destroys the application and all of its resources.
   * @param {object|boolean}[rendererDestroyOptions=false] - The options for destroying the renderer.
   * @param {boolean}[rendererDestroyOptions.removeView=false] - Removes the Canvas element from the DOM.
   * @param {object|boolean} [options=false] - The options for destroying the stage.
   * @param {boolean} [options.children=false] - If set to true, all the children will have their destroy method
   * called as well. `options` will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for children with textures e.g. Sprites.
   * If options.children is set to true,
   * it should destroy the texture of the child sprite.
   * @param {boolean} [options.textureSource=false] - Only used for children with textures e.g. Sprites.
   *  If options.children is set to true,
   * it should destroy the texture source of the child sprite.
   * @param {boolean} [options.context=false] - Only used for children with graphicsContexts e.g. Graphics.
   * If options.children is set to true,
   * it should destroy the context of the child graphics.
   */
  destroy(t = !1, e = !1) {
    const i = Dr._plugins.slice(0);
    i.reverse(), i.forEach((n) => {
      n.destroy.call(this);
    }), this.stage.destroy(e), this.stage = null, this.renderer.destroy(t), this.renderer = null;
  }
};
Cl._plugins = [];
let Pl = Cl;
Pt.handleByList(D.Application, Pl._plugins);
Pt.add(Al);
class Ml extends kt {
  constructor() {
    super(...arguments), this.chars = /* @__PURE__ */ Object.create(null), this.lineHeight = 0, this.fontFamily = "", this.fontMetrics = { fontSize: 0, ascent: 0, descent: 0 }, this.baseLineOffset = 0, this.distanceField = { type: "none", range: 0 }, this.pages = [], this.applyFillAsTint = !0, this.baseMeasurementFontSize = 100, this.baseRenderedFontSize = 100;
  }
  /**
   * The name of the font face.
   * @deprecated since 8.0.0 Use `fontFamily` instead.
   */
  get font() {
    return H($, "BitmapFont.font is deprecated, please use BitmapFont.fontFamily instead."), this.fontFamily;
  }
  /**
   * The map of base page textures (i.e., sheets of glyphs).
   * @deprecated since 8.0.0 Use `pages` instead.
   */
  get pageTextures() {
    return H($, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
  }
  /**
   * The size of the font face in pixels.
   * @deprecated since 8.0.0 Use `fontMetrics.fontSize` instead.
   */
  get size() {
    return H($, "BitmapFont.size is deprecated, please use BitmapFont.fontMetrics.fontSize instead."), this.fontMetrics.fontSize;
  }
  /**
   * The kind of distance field for this font or "none".
   * @deprecated since 8.0.0 Use `distanceField.type` instead.
   */
  get distanceFieldRange() {
    return H($, "BitmapFont.distanceFieldRange is deprecated, please use BitmapFont.distanceField.range instead."), this.distanceField.range;
  }
  /**
   * The range of the distance field in pixels.
   * @deprecated since 8.0.0 Use `distanceField.range` instead.
   */
  get distanceFieldType() {
    return H($, "BitmapFont.distanceFieldType is deprecated, please use BitmapFont.distanceField.type instead."), this.distanceField.type;
  }
  destroy(t = !1) {
    var e;
    this.emit("destroy", this), this.removeAllListeners();
    for (const i in this.chars)
      (e = this.chars[i].texture) == null || e.destroy();
    this.chars = null, t && (this.pages.forEach((i) => i.texture.destroy(!0)), this.pages = null);
  }
}
const Tl = class zr {
  constructor(t, e, i, n) {
    this.uid = xt("fillGradient"), this.type = "linear", this.gradientStops = [], this._styleKey = null, this.x0 = t, this.y0 = e, this.x1 = i, this.y1 = n;
  }
  addColorStop(t, e) {
    return this.gradientStops.push({ offset: t, color: gt.shared.setValue(e).toHexa() }), this._styleKey = null, this;
  }
  // TODO move to the system!
  buildLinearGradient() {
    const t = zr.defaultTextureSize, { gradientStops: e } = this, i = ot.get().createCanvas();
    i.width = t, i.height = t;
    const n = i.getContext("2d"), r = n.createLinearGradient(0, 0, zr.defaultTextureSize, 1);
    for (let p = 0; p < e.length; p++) {
      const m = e[p];
      r.addColorStop(m.offset, m.color);
    }
    n.fillStyle = r, n.fillRect(0, 0, t, t), this.texture = new G({
      source: new zi({
        resource: i,
        addressModeU: "clamp-to-edge",
        addressModeV: "repeat"
      })
    });
    const { x0: o, y0: a, x1: h, y1: c } = this, l = new j(), d = h - o, f = c - a, u = Math.sqrt(d * d + f * f), g = Math.atan2(f, d);
    l.translate(-o, -a), l.scale(1 / t, 1 / t), l.rotate(-g), l.scale(256 / u, 1), this.transform = l, this._styleKey = null;
  }
  get styleKey() {
    if (this._styleKey)
      return this._styleKey;
    const t = this.gradientStops.map((n) => `${n.offset}-${n.color}`).join("-"), e = this.texture.uid, i = this.transform.toArray().join("-");
    return `fill-gradient-${this.uid}-${t}-${e}-${i}-${this.x0}-${this.y0}-${this.x1}-${this.y1}`;
  }
};
Tl.defaultTextureSize = 256;
let ps = Tl;
const Ea = {
  repeat: {
    addressModeU: "repeat",
    addressModeV: "repeat"
  },
  "repeat-x": {
    addressModeU: "repeat",
    addressModeV: "clamp-to-edge"
  },
  "repeat-y": {
    addressModeU: "clamp-to-edge",
    addressModeV: "repeat"
  },
  "no-repeat": {
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge"
  }
};
class wn {
  constructor(t, e) {
    this.uid = xt("fillPattern"), this.transform = new j(), this._styleKey = null, this.texture = t, this.transform.scale(
      1 / t.frame.width,
      1 / t.frame.height
    ), e && (t.source.style.addressModeU = Ea[e].addressModeU, t.source.style.addressModeV = Ea[e].addressModeV);
  }
  setTransform(t) {
    const e = this.texture;
    this.transform.copyFrom(t), this.transform.invert(), this.transform.scale(
      1 / e.frame.width,
      1 / e.frame.height
    ), this._styleKey = null;
  }
  get styleKey() {
    return this._styleKey ? this._styleKey : (this._styleKey = `fill-pattern-${this.uid}-${this.texture.uid}-${this.transform.toArray().join("-")}`, this._styleKey);
  }
}
var vf = wf, nr = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }, bf = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
function wf(s) {
  var t = [];
  return s.replace(bf, function(e, i, n) {
    var r = i.toLowerCase();
    for (n = Af(n), r == "m" && n.length > 2 && (t.push([i].concat(n.splice(0, 2))), r = "l", i = i == "m" ? "l" : "L"); ; ) {
      if (n.length == nr[r])
        return n.unshift(i), t.push(n);
      if (n.length < nr[r]) throw new Error("malformed path data");
      t.push([i].concat(n.splice(0, nr[r])));
    }
  }), t;
}
var Sf = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
function Af(s) {
  var t = s.match(Sf);
  return t ? t.map(Number) : [];
}
const Cf = /* @__PURE__ */ po(vf);
function Pf(s, t) {
  const e = Cf(s), i = [];
  let n = null, r = 0, o = 0;
  for (let a = 0; a < e.length; a++) {
    const h = e[a], c = h[0], l = h;
    switch (c) {
      case "M":
        r = l[1], o = l[2], t.moveTo(r, o);
        break;
      case "m":
        r += l[1], o += l[2], t.moveTo(r, o);
        break;
      case "H":
        r = l[1], t.lineTo(r, o);
        break;
      case "h":
        r += l[1], t.lineTo(r, o);
        break;
      case "V":
        o = l[1], t.lineTo(r, o);
        break;
      case "v":
        o += l[1], t.lineTo(r, o);
        break;
      case "L":
        r = l[1], o = l[2], t.lineTo(r, o);
        break;
      case "l":
        r += l[1], o += l[2], t.lineTo(r, o);
        break;
      case "C":
        r = l[5], o = l[6], t.bezierCurveTo(
          l[1],
          l[2],
          l[3],
          l[4],
          r,
          o
        );
        break;
      case "c":
        t.bezierCurveTo(
          r + l[1],
          o + l[2],
          r + l[3],
          o + l[4],
          r + l[5],
          o + l[6]
        ), r += l[5], o += l[6];
        break;
      case "S":
        r = l[3], o = l[4], t.bezierCurveToShort(
          l[1],
          l[2],
          r,
          o
        );
        break;
      case "s":
        t.bezierCurveToShort(
          r + l[1],
          o + l[2],
          r + l[3],
          o + l[4]
        ), r += l[3], o += l[4];
        break;
      case "Q":
        r = l[3], o = l[4], t.quadraticCurveTo(
          l[1],
          l[2],
          r,
          o
        );
        break;
      case "q":
        t.quadraticCurveTo(
          r + l[1],
          o + l[2],
          r + l[3],
          o + l[4]
        ), r += l[3], o += l[4];
        break;
      case "T":
        r = l[1], o = l[2], t.quadraticCurveToShort(
          r,
          o
        );
        break;
      case "t":
        r += l[1], o += l[2], t.quadraticCurveToShort(
          r,
          o
        );
        break;
      case "A":
        r = l[6], o = l[7], t.arcToSvg(
          l[1],
          l[2],
          l[3],
          l[4],
          l[5],
          r,
          o
        );
        break;
      case "a":
        r += l[6], o += l[7], t.arcToSvg(
          l[1],
          l[2],
          l[3],
          l[4],
          l[5],
          r,
          o
        );
        break;
      case "Z":
      case "z":
        t.closePath(), i.length > 0 && (n = i.pop(), n ? (r = n.startX, o = n.startY) : (r = 0, o = 0)), n = null;
        break;
      default:
        ut(`Unknown SVG path command: ${c}`);
    }
    c !== "Z" && c !== "z" && n === null && (n = { startX: r, startY: o }, i.push(n));
  }
  return t;
}
class Sn {
  /**
   * @param x - The X coordinate of the center of this circle
   * @param y - The Y coordinate of the center of this circle
   * @param radius - The radius of the circle
   */
  constructor(t = 0, e = 0, i = 0) {
    this.type = "circle", this.x = t, this.y = e, this.radius = i;
  }
  /**
   * Creates a clone of this Circle instance
   * @returns A copy of the Circle
   */
  clone() {
    return new Sn(this.x, this.y, this.radius);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Circle
   */
  contains(t, e) {
    if (this.radius <= 0)
      return !1;
    const i = this.radius * this.radius;
    let n = this.x - t, r = this.y - e;
    return n *= n, r *= r, n + r <= i;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param width - The width of the line to check
   * @returns Whether the x/y coordinates are within this Circle
   */
  strokeContains(t, e, i) {
    if (this.radius === 0)
      return !1;
    const n = this.x - t, r = this.y - e, o = this.radius, a = i / 2, h = Math.sqrt(n * n + r * r);
    return h < o + a && h > o - a;
  }
  /**
   * Returns the framing rectangle of the circle as a Rectangle object
   * @param out
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new pt(), t.x = this.x - this.radius, t.y = this.y - this.radius, t.width = this.radius * 2, t.height = this.radius * 2, t;
  }
  /**
   * Copies another circle to this one.
   * @param circle - The circle to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.radius = t.radius, this;
  }
  /**
   * Copies this circle to another one.
   * @param circle - The circle to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`;
  }
}
class vo {
  /**
   * @param x - The X coordinate of the center of this ellipse
   * @param y - The Y coordinate of the center of this ellipse
   * @param halfWidth - The half width of this ellipse
   * @param halfHeight - The half height of this ellipse
   */
  constructor(t = 0, e = 0, i = 0, n = 0) {
    this.type = "ellipse", this.x = t, this.y = e, this.halfWidth = i, this.halfHeight = n;
  }
  /**
   * Creates a clone of this Ellipse instance
   * @returns {Ellipse} A copy of the ellipse
   */
  clone() {
    return new vo(this.x, this.y, this.halfWidth, this.halfHeight);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coords are within this ellipse
   */
  contains(t, e) {
    if (this.halfWidth <= 0 || this.halfHeight <= 0)
      return !1;
    let i = (t - this.x) / this.halfWidth, n = (e - this.y) / this.halfHeight;
    return i *= i, n *= n, i + n <= 1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse including stroke
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param width
   * @returns Whether the x/y coords are within this ellipse
   */
  strokeContains(t, e, i) {
    const { halfWidth: n, halfHeight: r } = this;
    if (n <= 0 || r <= 0)
      return !1;
    const o = i / 2, a = n - o, h = r - o, c = n + o, l = r + o, d = t - this.x, f = e - this.y, u = d * d / (a * a) + f * f / (h * h), g = d * d / (c * c) + f * f / (l * l);
    return u > 1 && g <= 1;
  }
  /**
   * Returns the framing rectangle of the ellipse as a Rectangle object
   * @param out
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new pt(), t.x = this.x - this.halfWidth, t.y = this.y - this.halfHeight, t.width = this.halfWidth * 2, t.height = this.halfHeight * 2, t;
  }
  /**
   * Copies another ellipse to this one.
   * @param ellipse - The ellipse to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.halfWidth = t.halfWidth, this.halfHeight = t.halfHeight, this;
  }
  /**
   * Copies this ellipse to another one.
   * @param ellipse - The ellipse to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Ellipse x=${this.x} y=${this.y} halfWidth=${this.halfWidth} halfHeight=${this.halfHeight}]`;
  }
}
function Mf(s, t, e, i, n, r) {
  const o = s - e, a = t - i, h = n - e, c = r - i, l = o * h + a * c, d = h * h + c * c;
  let f = -1;
  d !== 0 && (f = l / d);
  let u, g;
  f < 0 ? (u = e, g = i) : f > 1 ? (u = n, g = r) : (u = e + f * h, g = i + f * c);
  const p = s - u, m = t - g;
  return p * p + m * m;
}
class Ai {
  /**
   * @param points - This can be an array of Points
   *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
   *  the arguments passed can be all the points of the polygon e.g.
   *  `new Polygon(new Point(), new Point(), ...)`, or the arguments passed can be flat
   *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
   */
  constructor(...t) {
    this.type = "polygon";
    let e = Array.isArray(t[0]) ? t[0] : t;
    if (typeof e[0] != "number") {
      const i = [];
      for (let n = 0, r = e.length; n < r; n++)
        i.push(e[n].x, e[n].y);
      e = i;
    }
    this.points = e, this.closePath = !0;
  }
  /**
   * Creates a clone of this polygon.
   * @returns - A copy of the polygon.
   */
  clone() {
    const t = this.points.slice(), e = new Ai(t);
    return e.closePath = this.closePath, e;
  }
  /**
   * Checks whether the x and y coordinates passed to this function are contained within this polygon.
   * @param x - The X coordinate of the point to test.
   * @param y - The Y coordinate of the point to test.
   * @returns - Whether the x/y coordinates are within this polygon.
   */
  contains(t, e) {
    let i = !1;
    const n = this.points.length / 2;
    for (let r = 0, o = n - 1; r < n; o = r++) {
      const a = this.points[r * 2], h = this.points[r * 2 + 1], c = this.points[o * 2], l = this.points[o * 2 + 1];
      h > e != l > e && t < (c - a) * ((e - h) / (l - h)) + a && (i = !i);
    }
    return i;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this polygon including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @returns Whether the x/y coordinates are within this polygon
   */
  strokeContains(t, e, i) {
    const n = i / 2, r = n * n, { points: o } = this, a = o.length - (this.closePath ? 0 : 2);
    for (let h = 0; h < a; h += 2) {
      const c = o[h], l = o[h + 1], d = o[(h + 2) % o.length], f = o[(h + 3) % o.length];
      if (Mf(t, e, c, l, d, f) <= r)
        return !0;
    }
    return !1;
  }
  /**
   * Returns the framing rectangle of the polygon as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    t = t || new pt();
    const e = this.points;
    let i = 1 / 0, n = -1 / 0, r = 1 / 0, o = -1 / 0;
    for (let a = 0, h = e.length; a < h; a += 2) {
      const c = e[a], l = e[a + 1];
      i = c < i ? c : i, n = c > n ? c : n, r = l < r ? l : r, o = l > o ? l : o;
    }
    return t.x = i, t.width = n - i, t.y = r, t.height = o - r, t;
  }
  /**
   * Copies another polygon to this one.
   * @param polygon - The polygon to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.points = t.points.slice(), this.closePath = t.closePath, this;
  }
  /**
   * Copies this polygon to another one.
   * @param polygon - The polygon to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:PolygoncloseStroke=${this.closePath}points=${this.points.reduce((t, e) => `${t}, ${e}`, "")}]`;
  }
  /**
   * Get the last X coordinate of the polygon
   * @readonly
   */
  get lastX() {
    return this.points[this.points.length - 2];
  }
  /**
   * Get the last Y coordinate of the polygon
   * @readonly
   */
  get lastY() {
    return this.points[this.points.length - 1];
  }
  /**
   * Get the first X coordinate of the polygon
   * @readonly
   */
  get x() {
    return this.points[this.points.length - 2];
  }
  /**
   * Get the first Y coordinate of the polygon
   * @readonly
   */
  get y() {
    return this.points[this.points.length - 1];
  }
}
const Ns = (s, t, e, i, n, r) => {
  const o = s - e, a = t - i, h = Math.sqrt(o * o + a * a);
  return h >= n - r && h <= n + r;
};
class An {
  /**
   * @param x - The X coordinate of the upper-left corner of the rounded rectangle
   * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
   * @param width - The overall width of this rounded rectangle
   * @param height - The overall height of this rounded rectangle
   * @param radius - Controls the radius of the rounded corners
   */
  constructor(t = 0, e = 0, i = 0, n = 0, r = 20) {
    this.type = "roundedRectangle", this.x = t, this.y = e, this.width = i, this.height = n, this.radius = r;
  }
  /**
   * Returns the framing rectangle of the rounded rectangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new pt(), t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t;
  }
  /**
   * Creates a clone of this Rounded Rectangle.
   * @returns - A copy of the rounded rectangle.
   */
  clone() {
    return new An(this.x, this.y, this.width, this.height, this.radius);
  }
  /**
   * Copies another rectangle to this one.
   * @param rectangle - The rectangle to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  /**
   * Copies this rectangle to another one.
   * @param rectangle - The rectangle to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
   * @param x - The X coordinate of the point to test.
   * @param y - The Y coordinate of the point to test.
   * @returns - Whether the x/y coordinates are within this Rounded Rectangle.
   */
  contains(t, e) {
    if (this.width <= 0 || this.height <= 0)
      return !1;
    if (t >= this.x && t <= this.x + this.width && e >= this.y && e <= this.y + this.height) {
      const i = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
      if (e >= this.y + i && e <= this.y + this.height - i || t >= this.x + i && t <= this.x + this.width - i)
        return !0;
      let n = t - (this.x + i), r = e - (this.y + i);
      const o = i * i;
      if (n * n + r * r <= o || (n = t - (this.x + this.width - i), n * n + r * r <= o) || (r = e - (this.y + this.height - i), n * n + r * r <= o) || (n = t - (this.x + i), n * n + r * r <= o))
        return !0;
    }
    return !1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
   * @param pX - The X coordinate of the point to test
   * @param pY - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @returns Whether the x/y coordinates are within this rectangle
   */
  strokeContains(t, e, i) {
    const { x: n, y: r, width: o, height: a, radius: h } = this, c = i / 2, l = n + h, d = r + h, f = o - h * 2, u = a - h * 2, g = n + o, p = r + a;
    return (t >= n - c && t <= n + c || t >= g - c && t <= g + c) && e >= d && e <= d + u || (e >= r - c && e <= r + c || e >= p - c && e <= p + c) && t >= l && t <= l + f ? !0 : (
      // Top-left
      t < l && e < d && Ns(t, e, l, d, h, c) || t > g - h && e < d && Ns(t, e, g - h, d, h, c) || t > g - h && e > p - h && Ns(t, e, g - h, p - h, h, c) || t < l && e > p - h && Ns(t, e, l, p - h, h, c)
    );
  }
  toString() {
    return `[pixi.js/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
  }
}
const Tf = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join(`
`);
function kf(s) {
  let t = "";
  for (let e = 0; e < s; ++e)
    e > 0 && (t += `
else `), e < s - 1 && (t += `if(test == ${e}.0){}`);
  return t;
}
function Ef(s, t) {
  if (s === 0)
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  const e = t.createShader(t.FRAGMENT_SHADER);
  try {
    for (; ; ) {
      const i = Tf.replace(/%forloop%/gi, kf(s));
      if (t.shaderSource(e, i), t.compileShader(e), !t.getShaderParameter(e, t.COMPILE_STATUS))
        s = s / 2 | 0;
      else
        break;
    }
  } finally {
    t.deleteShader(e);
  }
  return s;
}
let gi = null;
function kl() {
  var t;
  if (gi)
    return gi;
  const s = ll();
  return gi = s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS), gi = Ef(
    gi,
    s
  ), (t = s.getExtension("WEBGL_lose_context")) == null || t.loseContext(), gi;
}
const El = {};
function If(s, t) {
  let e = 2166136261;
  for (let i = 0; i < t; i++)
    e ^= s[i].uid, e = Math.imul(e, 16777619), e >>>= 0;
  return El[e] || Bf(s, t, e);
}
let rr = 0;
function Bf(s, t, e) {
  const i = {};
  let n = 0;
  rr || (rr = kl());
  for (let o = 0; o < rr; o++) {
    const a = o < t ? s[o] : G.EMPTY.source;
    i[n++] = a.source, i[n++] = a.style;
  }
  const r = new Ks(i);
  return El[e] = r, r;
}
class Ia {
  constructor(t) {
    typeof t == "number" ? this.rawBinaryData = new ArrayBuffer(t) : t instanceof Uint8Array ? this.rawBinaryData = t.buffer : this.rawBinaryData = t, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData), this.size = this.rawBinaryData.byteLength;
  }
  /** View on the raw binary data as a `Int8Array`. */
  get int8View() {
    return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View;
  }
  /** View on the raw binary data as a `Uint8Array`. */
  get uint8View() {
    return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View;
  }
  /**  View on the raw binary data as a `Int16Array`. */
  get int16View() {
    return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View;
  }
  /** View on the raw binary data as a `Int32Array`. */
  get int32View() {
    return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View;
  }
  /** View on the raw binary data as a `Float64Array`. */
  get float64View() {
    return this._float64Array || (this._float64Array = new Float64Array(this.rawBinaryData)), this._float64Array;
  }
  /** View on the raw binary data as a `BigUint64Array`. */
  get bigUint64View() {
    return this._bigUint64Array || (this._bigUint64Array = new BigUint64Array(this.rawBinaryData)), this._bigUint64Array;
  }
  /**
   * Returns the view of the given type.
   * @param type - One of `int8`, `uint8`, `int16`,
   *    `uint16`, `int32`, `uint32`, and `float32`.
   * @returns - typed array of given type
   */
  view(t) {
    return this[`${t}View`];
  }
  /** Destroys all buffer references. Do not use after calling this. */
  destroy() {
    this.rawBinaryData = null, this._int8View = null, this._uint8View = null, this._int16View = null, this.uint16View = null, this._int32View = null, this.uint32View = null, this.float32View = null;
  }
  /**
   * Returns the size of the given type in bytes.
   * @param type - One of `int8`, `uint8`, `int16`,
   *   `uint16`, `int32`, `uint32`, and `float32`.
   * @returns - size of the type in bytes
   */
  static sizeOf(t) {
    switch (t) {
      case "int8":
      case "uint8":
        return 1;
      case "int16":
      case "uint16":
        return 2;
      case "int32":
      case "uint32":
      case "float32":
        return 4;
      default:
        throw new Error(`${t} isn't a valid view type`);
    }
  }
}
function Ba(s, t) {
  const e = s.byteLength / 8 | 0, i = new Float64Array(s, 0, e);
  new Float64Array(t, 0, e).set(i);
  const r = s.byteLength - e * 8;
  if (r > 0) {
    const o = new Uint8Array(s, e * 8, r);
    new Uint8Array(t, e * 8, r).set(o);
  }
}
const Rf = {
  normal: "normal-npm",
  add: "add-npm",
  screen: "screen-npm"
};
var Ff = /* @__PURE__ */ ((s) => (s[s.DISABLED = 0] = "DISABLED", s[s.RENDERING_MASK_ADD = 1] = "RENDERING_MASK_ADD", s[s.MASK_ACTIVE = 2] = "MASK_ACTIVE", s[s.INVERSE_MASK_ACTIVE = 3] = "INVERSE_MASK_ACTIVE", s[s.RENDERING_MASK_REMOVE = 4] = "RENDERING_MASK_REMOVE", s[s.NONE = 5] = "NONE", s))(Ff || {});
function Ra(s, t) {
  return t.alphaMode === "no-premultiply-alpha" && Rf[s] || s;
}
class Lf {
  constructor() {
    this.ids = /* @__PURE__ */ Object.create(null), this.textures = [], this.count = 0;
  }
  /** Clear the textures and their locations. */
  clear() {
    for (let t = 0; t < this.count; t++) {
      const e = this.textures[t];
      this.textures[t] = null, this.ids[e.uid] = null;
    }
    this.count = 0;
  }
}
class Of {
  constructor() {
    this.renderPipeId = "batch", this.action = "startBatch", this.start = 0, this.size = 0, this.textures = new Lf(), this.blendMode = "normal", this.canBundle = !0;
  }
  destroy() {
    this.textures = null, this.gpuBindGroup = null, this.bindGroup = null, this.batcher = null;
  }
}
const Il = [];
let Ur = 0;
function Fa() {
  return Ur > 0 ? Il[--Ur] : new Of();
}
function La(s) {
  Il[Ur++] = s;
}
let Xi = 0;
const Bl = class qs {
  constructor(t = {}) {
    this.uid = xt("batcher"), this.dirty = !0, this.batchIndex = 0, this.batches = [], this._elements = [], qs.defaultOptions.maxTextures = qs.defaultOptions.maxTextures ?? kl(), t = { ...qs.defaultOptions, ...t };
    const { maxTextures: e, attributesInitialSize: i, indicesInitialSize: n } = t;
    this.attributeBuffer = new Ia(i * 4), this.indexBuffer = new Uint16Array(n), this.maxTextures = e;
  }
  begin() {
    this.elementSize = 0, this.elementStart = 0, this.indexSize = 0, this.attributeSize = 0;
    for (let t = 0; t < this.batchIndex; t++)
      La(this.batches[t]);
    this.batchIndex = 0, this._batchIndexStart = 0, this._batchIndexSize = 0, this.dirty = !0;
  }
  add(t) {
    this._elements[this.elementSize++] = t, t._indexStart = this.indexSize, t._attributeStart = this.attributeSize, t._batcher = this, this.indexSize += t.indexSize, this.attributeSize += t.attributeSize * this.vertexSize;
  }
  checkAndUpdateTexture(t, e) {
    const i = t._batch.textures.ids[e._source.uid];
    return !i && i !== 0 ? !1 : (t._textureId = i, t.texture = e, !0);
  }
  updateElement(t) {
    this.dirty = !0;
    const e = this.attributeBuffer;
    t.packAsQuad ? this.packQuadAttributes(
      t,
      e.float32View,
      e.uint32View,
      t._attributeStart,
      t._textureId
    ) : this.packAttributes(
      t,
      e.float32View,
      e.uint32View,
      t._attributeStart,
      t._textureId
    );
  }
  /**
   * breaks the batcher. This happens when a batch gets too big,
   * or we need to switch to a different type of rendering (a filter for example)
   * @param instructionSet
   */
  break(t) {
    const e = this._elements;
    if (!e[this.elementStart])
      return;
    let i = Fa(), n = i.textures;
    n.clear();
    const r = e[this.elementStart];
    let o = Ra(r.blendMode, r.texture._source);
    this.attributeSize * 4 > this.attributeBuffer.size && this._resizeAttributeBuffer(this.attributeSize * 4), this.indexSize > this.indexBuffer.length && this._resizeIndexBuffer(this.indexSize);
    const a = this.attributeBuffer.float32View, h = this.attributeBuffer.uint32View, c = this.indexBuffer;
    let l = this._batchIndexSize, d = this._batchIndexStart, f = "startBatch";
    const u = this.maxTextures;
    for (let g = this.elementStart; g < this.elementSize; ++g) {
      const p = e[g];
      e[g] = null;
      const x = p.texture._source, y = Ra(p.blendMode, x), v = o !== y;
      if (x._batchTick === Xi && !v) {
        p._textureId = x._textureBindLocation, l += p.indexSize, p.packAsQuad ? (this.packQuadAttributes(
          p,
          a,
          h,
          p._attributeStart,
          p._textureId
        ), this.packQuadIndex(
          c,
          p._indexStart,
          p._attributeStart / this.vertexSize
        )) : (this.packAttributes(
          p,
          a,
          h,
          p._attributeStart,
          p._textureId
        ), this.packIndex(
          p,
          c,
          p._indexStart,
          p._attributeStart / this.vertexSize
        )), p._batch = i;
        continue;
      }
      x._batchTick = Xi, (n.count >= u || v) && (this._finishBatch(
        i,
        d,
        l - d,
        n,
        o,
        t,
        f
      ), f = "renderBatch", d = l, o = y, i = Fa(), n = i.textures, n.clear(), ++Xi), p._textureId = x._textureBindLocation = n.count, n.ids[x.uid] = n.count, n.textures[n.count++] = x, p._batch = i, l += p.indexSize, p.packAsQuad ? (this.packQuadAttributes(
        p,
        a,
        h,
        p._attributeStart,
        p._textureId
      ), this.packQuadIndex(
        c,
        p._indexStart,
        p._attributeStart / this.vertexSize
      )) : (this.packAttributes(
        p,
        a,
        h,
        p._attributeStart,
        p._textureId
      ), this.packIndex(
        p,
        c,
        p._indexStart,
        p._attributeStart / this.vertexSize
      ));
    }
    n.count > 0 && (this._finishBatch(
      i,
      d,
      l - d,
      n,
      o,
      t,
      f
    ), d = l, ++Xi), this.elementStart = this.elementSize, this._batchIndexStart = d, this._batchIndexSize = l;
  }
  _finishBatch(t, e, i, n, r, o, a) {
    t.gpuBindGroup = null, t.bindGroup = null, t.action = a, t.batcher = this, t.textures = n, t.blendMode = r, t.start = e, t.size = i, ++Xi, this.batches[this.batchIndex++] = t, o.add(t);
  }
  finish(t) {
    this.break(t);
  }
  /**
   * Resizes the attribute buffer to the given size (1 = 1 float32)
   * @param size - the size in vertices to ensure (not bytes!)
   */
  ensureAttributeBuffer(t) {
    t * 4 <= this.attributeBuffer.size || this._resizeAttributeBuffer(t * 4);
  }
  /**
   * Resizes the index buffer to the given size (1 = 1 float32)
   * @param size - the size in vertices to ensure (not bytes!)
   */
  ensureIndexBuffer(t) {
    t <= this.indexBuffer.length || this._resizeIndexBuffer(t);
  }
  _resizeAttributeBuffer(t) {
    const e = Math.max(t, this.attributeBuffer.size * 2), i = new Ia(e);
    Ba(this.attributeBuffer.rawBinaryData, i.rawBinaryData), this.attributeBuffer = i;
  }
  _resizeIndexBuffer(t) {
    const e = this.indexBuffer;
    let i = Math.max(t, e.length * 1.5);
    i += i % 2;
    const n = i > 65535 ? new Uint32Array(i) : new Uint16Array(i);
    if (n.BYTES_PER_ELEMENT !== e.BYTES_PER_ELEMENT)
      for (let r = 0; r < e.length; r++)
        n[r] = e[r];
    else
      Ba(e.buffer, n.buffer);
    this.indexBuffer = n;
  }
  packQuadIndex(t, e, i) {
    t[e] = i + 0, t[e + 1] = i + 1, t[e + 2] = i + 2, t[e + 3] = i + 0, t[e + 4] = i + 2, t[e + 5] = i + 3;
  }
  packIndex(t, e, i, n) {
    const r = t.indices, o = t.indexSize, a = t.indexOffset, h = t.attributeOffset;
    for (let c = 0; c < o; c++)
      e[i++] = n + r[c + a] - h;
  }
  destroy() {
    for (let t = 0; t < this.batches.length; t++)
      La(this.batches[t]);
    this.batches = null;
    for (let t = 0; t < this._elements.length; t++)
      this._elements[t]._batch = null;
    this._elements = null, this.indexBuffer = null, this.attributeBuffer.destroy(), this.attributeBuffer = null;
  }
};
Bl.defaultOptions = {
  maxTextures: null,
  attributesInitialSize: 4,
  indicesInitialSize: 6
};
let Df = Bl;
var ft = /* @__PURE__ */ ((s) => (s[s.MAP_READ = 1] = "MAP_READ", s[s.MAP_WRITE = 2] = "MAP_WRITE", s[s.COPY_SRC = 4] = "COPY_SRC", s[s.COPY_DST = 8] = "COPY_DST", s[s.INDEX = 16] = "INDEX", s[s.VERTEX = 32] = "VERTEX", s[s.UNIFORM = 64] = "UNIFORM", s[s.STORAGE = 128] = "STORAGE", s[s.INDIRECT = 256] = "INDIRECT", s[s.QUERY_RESOLVE = 512] = "QUERY_RESOLVE", s[s.STATIC = 1024] = "STATIC", s))(ft || {});
class ze extends kt {
  /**
   * Creates a new Buffer with the given options
   * @param options - the options for the buffer
   */
  constructor(t) {
    let { data: e, size: i } = t;
    const { usage: n, label: r, shrinkToFit: o } = t;
    super(), this.uid = xt("buffer"), this._resourceType = "buffer", this._resourceId = xt("resource"), this._touched = 0, this._updateID = 1, this.shrinkToFit = !0, this.destroyed = !1, e instanceof Array && (e = new Float32Array(e)), this._data = e, i = i ?? (e == null ? void 0 : e.byteLength);
    const a = !!e;
    this.descriptor = {
      size: i,
      usage: n,
      mappedAtCreation: a,
      label: r
    }, this.shrinkToFit = o ?? !0;
  }
  /** the data in the buffer */
  get data() {
    return this._data;
  }
  set data(t) {
    this.setDataWithSize(t, t.length, !0);
  }
  /** whether the buffer is static or not */
  get static() {
    return !!(this.descriptor.usage & ft.STATIC);
  }
  set static(t) {
    t ? this.descriptor.usage |= ft.STATIC : this.descriptor.usage &= ~ft.STATIC;
  }
  /**
   * Sets the data in the buffer to the given value. This will immediately update the buffer on the GPU.
   * If you only want to update a subset of the buffer, you can pass in the size of the data.
   * @param value - the data to set
   * @param size - the size of the data in bytes
   * @param syncGPU - should the buffer be updated on the GPU immediately?
   */
  setDataWithSize(t, e, i) {
    if (this._updateID++, this._updateSize = e * t.BYTES_PER_ELEMENT, this._data === t) {
      i && this.emit("update", this);
      return;
    }
    const n = this._data;
    if (this._data = t, n.length !== t.length) {
      !this.shrinkToFit && t.byteLength < n.byteLength ? i && this.emit("update", this) : (this.descriptor.size = t.byteLength, this._resourceId = xt("resource"), this.emit("change", this));
      return;
    }
    i && this.emit("update", this);
  }
  /**
   * updates the buffer on the GPU to reflect the data in the buffer.
   * By default it will update the entire buffer. If you only want to update a subset of the buffer,
   * you can pass in the size of the buffer to update.
   * @param sizeInBytes - the new size of the buffer in bytes
   */
  update(t) {
    this._updateSize = t ?? this._updateSize, this._updateID++, this.emit("update", this);
  }
  /** Destroys the buffer */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this._data = null, this.descriptor = null, this.removeAllListeners();
  }
}
function Rl(s, t) {
  if (!(s instanceof ze)) {
    let e = t ? ft.INDEX : ft.VERTEX;
    s instanceof Array && (t ? (s = new Uint32Array(s), e = ft.INDEX | ft.COPY_DST) : (s = new Float32Array(s), e = ft.VERTEX | ft.COPY_DST)), s = new ze({
      data: s,
      label: t ? "index-mesh-buffer" : "vertex-mesh-buffer",
      usage: e
    });
  }
  return s;
}
function zf(s, t, e) {
  const i = s.getAttribute(t);
  if (!i)
    return e.minX = 0, e.minY = 0, e.maxX = 0, e.maxY = 0, e;
  const n = i.buffer.data;
  let r = 1 / 0, o = 1 / 0, a = -1 / 0, h = -1 / 0;
  const c = n.BYTES_PER_ELEMENT, l = (i.offset || 0) / c, d = (i.stride || 2 * 4) / c;
  for (let f = l; f < n.length; f += d) {
    const u = n[f], g = n[f + 1];
    u > a && (a = u), g > h && (h = g), u < r && (r = u), g < o && (o = g);
  }
  return e.minX = r, e.minY = o, e.maxX = a, e.maxY = h, e;
}
function Uf(s) {
  return (s instanceof ze || Array.isArray(s) || s.BYTES_PER_ELEMENT) && (s = {
    buffer: s
  }), s.buffer = Rl(s.buffer, !1), s;
}
class Fl extends kt {
  /**
   * Create a new instance of a geometry
   * @param options - The options for the geometry.
   */
  constructor(t = {}) {
    super(), this.uid = xt("geometry"), this._layoutKey = 0, this.instanceCount = 1, this._bounds = new xe(), this._boundsDirty = !0;
    const { attributes: e, indexBuffer: i, topology: n } = t;
    if (this.buffers = [], this.attributes = {}, e)
      for (const r in e)
        this.addAttribute(r, e[r]);
    this.instanceCount = t.instanceCount || 1, i && this.addIndex(i), this.topology = n || "triangle-list";
  }
  onBufferUpdate() {
    this._boundsDirty = !0, this.emit("update", this);
  }
  /**
   * Returns the requested attribute.
   * @param id - The name of the attribute required
   * @returns - The attribute requested.
   */
  getAttribute(t) {
    return this.attributes[t];
  }
  /**
   * Returns the index buffer
   * @returns - The index buffer.
   */
  getIndex() {
    return this.indexBuffer;
  }
  /**
   * Returns the requested buffer.
   * @param id - The name of the buffer required.
   * @returns - The buffer requested.
   */
  getBuffer(t) {
    return this.getAttribute(t).buffer;
  }
  /**
   * Used to figure out how many vertices there are in this geometry
   * @returns the number of vertices in the geometry
   */
  getSize() {
    for (const t in this.attributes) {
      const e = this.attributes[t];
      return e.buffer.data.length / (e.stride / 4 || e.size);
    }
    return 0;
  }
  /**
   * Adds an attribute to the geometry.
   * @param name - The name of the attribute to add.
   * @param attributeOption - The attribute option to add.
   */
  addAttribute(t, e) {
    const i = Uf(e);
    this.buffers.indexOf(i.buffer) === -1 && (this.buffers.push(i.buffer), i.buffer.on("update", this.onBufferUpdate, this), i.buffer.on("change", this.onBufferUpdate, this)), this.attributes[t] = i;
  }
  /**
   * Adds an index buffer to the geometry.
   * @param indexBuffer - The index buffer to add. Can be a Buffer, TypedArray, or an array of numbers.
   */
  addIndex(t) {
    this.indexBuffer = Rl(t, !0), this.buffers.push(this.indexBuffer);
  }
  /** Returns the bounds of the geometry. */
  get bounds() {
    return this._boundsDirty ? (this._boundsDirty = !1, zf(this, "aPosition", this._bounds)) : this._bounds;
  }
  /**
   * destroys the geometry.
   * @param destroyBuffers - destroy the buffers associated with this geometry
   */
  destroy(t = !1) {
    this.emit("destroy", this), this.removeAllListeners(), t && this.buffers.forEach((e) => e.destroy()), this.attributes = null, this.buffers = null, this.indexBuffer = null, this._bounds = null;
  }
}
const Wf = new Float32Array(1), Gf = new Uint32Array(1);
class Vf extends Fl {
  constructor() {
    const e = new ze({
      data: Wf,
      label: "attribute-batch-buffer",
      usage: ft.VERTEX | ft.COPY_DST,
      shrinkToFit: !1
    }), i = new ze({
      data: Gf,
      label: "index-batch-buffer",
      usage: ft.INDEX | ft.COPY_DST,
      // | BufferUsage.STATIC,
      shrinkToFit: !1
    }), n = 6 * 4;
    super({
      attributes: {
        aPosition: {
          buffer: e,
          format: "float32x2",
          stride: n,
          offset: 0
        },
        aUV: {
          buffer: e,
          format: "float32x2",
          stride: n,
          offset: 2 * 4
        },
        aColor: {
          buffer: e,
          format: "unorm8x4",
          stride: n,
          offset: 4 * 4
        },
        aTextureIdAndRound: {
          buffer: e,
          format: "uint16x2",
          stride: n,
          offset: 5 * 4
        }
      },
      indexBuffer: i
    });
  }
}
function Oa(s, t, e) {
  if (s)
    for (const i in s) {
      const n = i.toLocaleLowerCase(), r = t[n];
      if (r) {
        let o = s[i];
        i === "header" && (o = o.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "")), e && r.push(`//----${e}----//`), r.push(o);
      } else
        ut(`${i} placement hook does not exist in shader`);
    }
}
const Nf = /\{\{(.*?)\}\}/g;
function Da(s) {
  var i;
  const t = {};
  return (((i = s.match(Nf)) == null ? void 0 : i.map((n) => n.replace(/[{()}]/g, ""))) ?? []).forEach((n) => {
    t[n] = [];
  }), t;
}
function za(s, t) {
  let e;
  const i = /@in\s+([^;]+);/g;
  for (; (e = i.exec(s)) !== null; )
    t.push(e[1]);
}
function Ua(s, t, e = !1) {
  const i = [];
  za(t, i), s.forEach((a) => {
    a.header && za(a.header, i);
  });
  const n = i;
  e && n.sort();
  const r = n.map((a, h) => `       @location(${h}) ${a},`).join(`
`);
  let o = t.replace(/@in\s+[^;]+;\s*/g, "");
  return o = o.replace("{{in}}", `
${r}
`), o;
}
function Wa(s, t) {
  let e;
  const i = /@out\s+([^;]+);/g;
  for (; (e = i.exec(s)) !== null; )
    t.push(e[1]);
}
function Hf(s) {
  const e = /\b(\w+)\s*:/g.exec(s);
  return e ? e[1] : "";
}
function $f(s) {
  const t = /@.*?\s+/g;
  return s.replace(t, "");
}
function jf(s, t) {
  const e = [];
  Wa(t, e), s.forEach((h) => {
    h.header && Wa(h.header, e);
  });
  let i = 0;
  const n = e.sort().map((h) => h.indexOf("builtin") > -1 ? h : `@location(${i++}) ${h}`).join(`,
`), r = e.sort().map((h) => `       var ${$f(h)};`).join(`
`), o = `return VSOutput(
                ${e.sort().map((h) => ` ${Hf(h)}`).join(`,
`)});`;
  let a = t.replace(/@out\s+[^;]+;\s*/g, "");
  return a = a.replace("{{struct}}", `
${n}
`), a = a.replace("{{start}}", `
${r}
`), a = a.replace("{{return}}", `
${o}
`), a;
}
function Ga(s, t) {
  let e = s;
  for (const i in t) {
    const n = t[i];
    n.join(`
`).length ? e = e.replace(`{{${i}}}`, `//-----${i} START-----//
${n.join(`
`)}
//----${i} FINISH----//`) : e = e.replace(`{{${i}}}`, "");
  }
  return e;
}
const Re = /* @__PURE__ */ Object.create(null), or = /* @__PURE__ */ new Map();
let Yf = 0;
function Xf({
  template: s,
  bits: t
}) {
  const e = Ll(s, t);
  if (Re[e])
    return Re[e];
  const { vertex: i, fragment: n } = qf(s, t);
  return Re[e] = Ol(i, n, t), Re[e];
}
function Kf({
  template: s,
  bits: t
}) {
  const e = Ll(s, t);
  return Re[e] || (Re[e] = Ol(s.vertex, s.fragment, t)), Re[e];
}
function qf(s, t) {
  const e = t.map((o) => o.vertex).filter((o) => !!o), i = t.map((o) => o.fragment).filter((o) => !!o);
  let n = Ua(e, s.vertex, !0);
  n = jf(e, n);
  const r = Ua(i, s.fragment, !0);
  return {
    vertex: n,
    fragment: r
  };
}
function Ll(s, t) {
  return t.map((e) => (or.has(e) || or.set(e, Yf++), or.get(e))).sort((e, i) => e - i).join("-") + s.vertex + s.fragment;
}
function Ol(s, t, e) {
  const i = Da(s), n = Da(t);
  return e.forEach((r) => {
    Oa(r.vertex, i, r.name), Oa(r.fragment, n, r.name);
  }), {
    vertex: Ga(s, i),
    fragment: Ga(t, n)
  };
}
const Zf = (
  /* wgsl */
  `
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}
        
        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);
       
        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`
), Qf = (
  /* wgsl */
  `
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;
   
    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {
        
        {{start}}

        var outColor:vec4<f32>;
      
        {{main}}
        
        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`
), Jf = (
  /* glsl */
  `
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;
        
        {{start}}
        
        vColor = vec4(1.);
        
        {{main}}
        
        vUV = uv;
        
        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`
), tp = (
  /* glsl */
  `
   
    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {
        
        {{start}}

        vec4 outColor;
      
        {{main}}
        
        finalColor = outColor * vColor;
        
        {{end}}
    }
`
), ep = {
  name: "global-uniforms-bit",
  vertex: {
    header: (
      /* wgsl */
      `
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `
    )
  }
}, ip = {
  name: "global-uniforms-bit",
  vertex: {
    header: (
      /* glsl */
      `
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `
    )
  }
};
function sp({ bits: s, name: t }) {
  const e = Xf({
    template: {
      fragment: Qf,
      vertex: Zf
    },
    bits: [
      ep,
      ...s
    ]
  });
  return yn.from({
    name: t,
    vertex: {
      source: e.vertex,
      entryPoint: "main"
    },
    fragment: {
      source: e.fragment,
      entryPoint: "main"
    }
  });
}
function np({ bits: s, name: t }) {
  return new ul({
    name: t,
    ...Kf({
      template: {
        vertex: Jf,
        fragment: tp
      },
      bits: [
        ip,
        ...s
      ]
    })
  });
}
const rp = {
  name: "color-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            @in aColor: vec4<f32>;
        `
    ),
    main: (
      /* wgsl */
      `
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `
    )
  }
}, op = {
  name: "color-bit",
  vertex: {
    header: (
      /* glsl */
      `
            in vec4 aColor;
        `
    ),
    main: (
      /* glsl */
      `
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `
    )
  }
}, ar = {};
function ap(s) {
  const t = [];
  if (s === 1)
    t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"), t.push("@group(1) @binding(1) var textureSampler1: sampler;");
  else {
    let e = 0;
    for (let i = 0; i < s; i++)
      t.push(`@group(1) @binding(${e++}) var textureSource${i + 1}: texture_2d<f32>;`), t.push(`@group(1) @binding(${e++}) var textureSampler${i + 1}: sampler;`);
  }
  return t.join(`
`);
}
function hp(s) {
  const t = [];
  if (s === 1)
    t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");
  else {
    t.push("switch vTextureId {");
    for (let e = 0; e < s; e++)
      e === s - 1 ? t.push("  default:{") : t.push(`  case ${e}:{`), t.push(`      outColor = textureSampleGrad(textureSource${e + 1}, textureSampler${e + 1}, vUV, uvDx, uvDy);`), t.push("      break;}");
    t.push("}");
  }
  return t.join(`
`);
}
function lp(s) {
  return ar[s] || (ar[s] = {
    name: "texture-batch-bit",
    vertex: {
      header: `
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,
      main: `
                vTextureId = aTextureIdAndRound.y;
            `,
      end: `
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `
    },
    fragment: {
      header: `
                @in @interpolate(flat) vTextureId: u32;

                ${ap(s)}
            `,
      main: `
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${hp(s)}
            `
    }
  }), ar[s];
}
const hr = {};
function cp(s) {
  const t = [];
  for (let e = 0; e < s; e++)
    e > 0 && t.push("else"), e < s - 1 && t.push(`if(vTextureId < ${e}.5)`), t.push("{"), t.push(`	outColor = texture(uTextures[${e}], vUV);`), t.push("}");
  return t.join(`
`);
}
function up(s) {
  return hr[s] || (hr[s] = {
    name: "texture-batch-bit",
    vertex: {
      header: `
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,
      main: `
                vTextureId = aTextureIdAndRound.y;
            `,
      end: `
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `
    },
    fragment: {
      header: `
                in float vTextureId;

                uniform sampler2D uTextures[${s}];

            `,
      main: `

                ${cp(s)}
            `
    }
  }), hr[s];
}
const dp = {
  name: "round-pixels-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32> 
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
    )
  }
}, fp = {
  name: "round-pixels-bit",
  vertex: {
    header: (
      /* glsl */
      `   
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {       
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
    )
  }
}, Va = {};
function pp(s) {
  let t = Va[s];
  if (t)
    return t;
  const e = new Int32Array(s);
  for (let i = 0; i < s; i++)
    e[i] = i;
  return t = Va[s] = new gl({
    uTextures: { value: e, type: "i32", size: s }
  }, { isStatic: !0 }), t;
}
class gp extends xo {
  constructor(t) {
    const e = np({
      name: "batch",
      bits: [
        op,
        up(t),
        fp
      ]
    }), i = sp({
      name: "batch",
      bits: [
        rp,
        lp(t),
        dp
      ]
    });
    super({
      glProgram: e,
      gpuProgram: i,
      resources: {
        batchSamplers: pp(t)
      }
    });
  }
}
let Na = null;
const Dl = class zl extends Df {
  constructor() {
    super(...arguments), this.geometry = new Vf(), this.shader = Na || (Na = new gp(this.maxTextures)), this.name = zl.extension.name, this.vertexSize = 6;
  }
  /**
   * Packs the attributes of a DefaultBatchableMeshElement into the provided views.
   * @param element - The DefaultBatchableMeshElement to pack.
   * @param float32View - The Float32Array view to pack into.
   * @param uint32View - The Uint32Array view to pack into.
   * @param index - The starting index in the views.
   * @param textureId - The texture ID to use.
   */
  packAttributes(t, e, i, n, r) {
    const o = r << 16 | t.roundPixels & 65535, a = t.transform, h = a.a, c = a.b, l = a.c, d = a.d, f = a.tx, u = a.ty, { positions: g, uvs: p } = t, m = t.color, x = t.attributeOffset, y = x + t.attributeSize;
    for (let v = x; v < y; v++) {
      const w = v * 2, _ = g[w], S = g[w + 1];
      e[n++] = h * _ + l * S + f, e[n++] = d * S + c * _ + u, e[n++] = p[w], e[n++] = p[w + 1], i[n++] = m, i[n++] = o;
    }
  }
  /**
   * Packs the attributes of a DefaultBatchableQuadElement into the provided views.
   * @param element - The DefaultBatchableQuadElement to pack.
   * @param float32View - The Float32Array view to pack into.
   * @param uint32View - The Uint32Array view to pack into.
   * @param index - The starting index in the views.
   * @param textureId - The texture ID to use.
   */
  packQuadAttributes(t, e, i, n, r) {
    const o = t.texture, a = t.transform, h = a.a, c = a.b, l = a.c, d = a.d, f = a.tx, u = a.ty, g = t.bounds, p = g.maxX, m = g.minX, x = g.maxY, y = g.minY, v = o.uvs, w = t.color, _ = r << 16 | t.roundPixels & 65535;
    e[n + 0] = h * m + l * y + f, e[n + 1] = d * y + c * m + u, e[n + 2] = v.x0, e[n + 3] = v.y0, i[n + 4] = w, i[n + 5] = _, e[n + 6] = h * p + l * y + f, e[n + 7] = d * y + c * p + u, e[n + 8] = v.x1, e[n + 9] = v.y1, i[n + 10] = w, i[n + 11] = _, e[n + 12] = h * p + l * x + f, e[n + 13] = d * x + c * p + u, e[n + 14] = v.x2, e[n + 15] = v.y2, i[n + 16] = w, i[n + 17] = _, e[n + 18] = h * m + l * x + f, e[n + 19] = d * x + c * m + u, e[n + 20] = v.x3, e[n + 21] = v.y3, i[n + 22] = w, i[n + 23] = _;
  }
};
Dl.extension = {
  type: [
    D.Batcher
  ],
  name: "default"
};
let mp = Dl;
function _p(s, t, e, i, n, r, o, a = null) {
  let h = 0;
  e *= t, n *= r;
  const c = a.a, l = a.b, d = a.c, f = a.d, u = a.tx, g = a.ty;
  for (; h < o; ) {
    const p = s[e], m = s[e + 1];
    i[n] = c * p + d * m + u, i[n + 1] = l * p + f * m + g, n += r, e += t, h++;
  }
}
function xp(s, t, e, i) {
  let n = 0;
  for (t *= e; n < i; )
    s[t] = 0, s[t + 1] = 0, t += e, n++;
}
function Ul(s, t, e, i, n) {
  const r = t.a, o = t.b, a = t.c, h = t.d, c = t.tx, l = t.ty;
  e = e || 0, i = i || 2, n = n || s.length / i - e;
  let d = e * i;
  for (let f = 0; f < n; f++) {
    const u = s[d], g = s[d + 1];
    s[d] = r * u + a * g + c, s[d + 1] = o * u + h * g + l, d += i;
  }
}
function yp(s, t) {
  if (s === 16777215 || !t)
    return t;
  if (t === 16777215 || !s)
    return s;
  const e = s >> 16 & 255, i = s >> 8 & 255, n = s & 255, r = t >> 16 & 255, o = t >> 8 & 255, a = t & 255, h = e * r / 255, c = i * o / 255, l = n * a / 255;
  return (h << 16) + (c << 8) + l;
}
const vp = new j();
class Wl {
  constructor() {
    this.packAsQuad = !1, this.batcherName = "default", this.applyTransform = !0, this.roundPixels = 0, this._batcher = null, this._batch = null;
  }
  get uvs() {
    return this.geometryData.uvs;
  }
  get positions() {
    return this.geometryData.vertices;
  }
  get indices() {
    return this.geometryData.indices;
  }
  get blendMode() {
    return this.applyTransform ? this.renderable.groupBlendMode : "normal";
  }
  get color() {
    const t = this.baseColor, e = t >> 16 | t & 65280 | (t & 255) << 16, i = this.renderable;
    return i ? yp(e, i.groupColor) + (this.alpha * i.groupAlpha * 255 << 24) : e + (this.alpha * 255 << 24);
  }
  get transform() {
    var t;
    return ((t = this.renderable) == null ? void 0 : t.groupTransform) || vp;
  }
  copyTo(t) {
    t.indexOffset = this.indexOffset, t.indexSize = this.indexSize, t.attributeOffset = this.attributeOffset, t.attributeSize = this.attributeSize, t.baseColor = this.baseColor, t.alpha = this.alpha, t.texture = this.texture, t.geometryData = this.geometryData;
  }
  reset() {
    this.applyTransform = !0, this.renderable = null;
  }
}
const gs = {
  extension: {
    type: D.ShapeBuilder,
    name: "circle"
  },
  build(s, t) {
    let e, i, n, r, o, a;
    if (s.type === "circle") {
      const w = s;
      e = w.x, i = w.y, o = a = w.radius, n = r = 0;
    } else if (s.type === "ellipse") {
      const w = s;
      e = w.x, i = w.y, o = w.halfWidth, a = w.halfHeight, n = r = 0;
    } else {
      const w = s, _ = w.width / 2, S = w.height / 2;
      e = w.x + _, i = w.y + S, o = a = Math.max(0, Math.min(w.radius, Math.min(_, S))), n = _ - o, r = S - a;
    }
    if (!(o >= 0 && a >= 0 && n >= 0 && r >= 0))
      return t;
    const h = Math.ceil(2.3 * Math.sqrt(o + a)), c = h * 8 + (n ? 4 : 0) + (r ? 4 : 0);
    if (c === 0)
      return t;
    if (h === 0)
      return t[0] = t[6] = e + n, t[1] = t[3] = i + r, t[2] = t[4] = e - n, t[5] = t[7] = i - r, t;
    let l = 0, d = h * 4 + (n ? 2 : 0) + 2, f = d, u = c, g = n + o, p = r, m = e + g, x = e - g, y = i + p;
    if (t[l++] = m, t[l++] = y, t[--d] = y, t[--d] = x, r) {
      const w = i - p;
      t[f++] = x, t[f++] = w, t[--u] = w, t[--u] = m;
    }
    for (let w = 1; w < h; w++) {
      const _ = Math.PI / 2 * (w / h), S = n + Math.cos(_) * o, C = r + Math.sin(_) * a, b = e + S, A = e - S, P = i + C, M = i - C;
      t[l++] = b, t[l++] = P, t[--d] = P, t[--d] = A, t[f++] = A, t[f++] = M, t[--u] = M, t[--u] = b;
    }
    g = n, p = r + a, m = e + g, x = e - g, y = i + p;
    const v = i - p;
    return t[l++] = m, t[l++] = y, t[--u] = v, t[--u] = m, n && (t[l++] = x, t[l++] = y, t[--u] = v, t[--u] = x), t;
  },
  triangulate(s, t, e, i, n, r) {
    if (s.length === 0)
      return;
    let o = 0, a = 0;
    for (let l = 0; l < s.length; l += 2)
      o += s[l], a += s[l + 1];
    o /= s.length / 2, a /= s.length / 2;
    let h = i;
    t[h * e] = o, t[h * e + 1] = a;
    const c = h++;
    for (let l = 0; l < s.length; l += 2)
      t[h * e] = s[l], t[h * e + 1] = s[l + 1], l > 0 && (n[r++] = h, n[r++] = c, n[r++] = h - 1), h++;
    n[r++] = c + 1, n[r++] = c, n[r++] = h - 1;
  }
}, bp = { ...gs, extension: { ...gs.extension, name: "ellipse" } }, wp = { ...gs, extension: { ...gs.extension, name: "roundedRectangle" } }, Sp = 1e-4, Ha = 1e-4;
function Ap(s) {
  const t = s.length;
  if (t < 6)
    return 1;
  let e = 0;
  for (let i = 0, n = s[t - 2], r = s[t - 1]; i < t; i += 2) {
    const o = s[i], a = s[i + 1];
    e += (o - n) * (a + r), n = o, r = a;
  }
  return e < 0 ? -1 : 1;
}
function $a(s, t, e, i, n, r, o, a) {
  const h = s - e * n, c = t - i * n, l = s + e * r, d = t + i * r;
  let f, u;
  o ? (f = i, u = -e) : (f = -i, u = e);
  const g = h + f, p = c + u, m = l + f, x = d + u;
  return a.push(g, p), a.push(m, x), 2;
}
function $e(s, t, e, i, n, r, o, a) {
  const h = e - s, c = i - t;
  let l = Math.atan2(h, c), d = Math.atan2(n - s, r - t);
  a && l < d ? l += Math.PI * 2 : !a && l > d && (d += Math.PI * 2);
  let f = l;
  const u = d - l, g = Math.abs(u), p = Math.sqrt(h * h + c * c), m = (15 * g * Math.sqrt(p) / Math.PI >> 0) + 1, x = u / m;
  if (f += x, a) {
    o.push(s, t), o.push(e, i);
    for (let y = 1, v = f; y < m; y++, v += x)
      o.push(s, t), o.push(
        s + Math.sin(v) * p,
        t + Math.cos(v) * p
      );
    o.push(s, t), o.push(n, r);
  } else {
    o.push(e, i), o.push(s, t);
    for (let y = 1, v = f; y < m; y++, v += x)
      o.push(
        s + Math.sin(v) * p,
        t + Math.cos(v) * p
      ), o.push(s, t);
    o.push(n, r), o.push(s, t);
  }
  return m * 2;
}
function Cp(s, t, e, i, n, r, o, a, h) {
  const c = Sp;
  if (s.length === 0)
    return;
  const l = t;
  let d = l.alignment;
  if (t.alignment !== 0.5) {
    let U = Ap(s);
    d = (d - 0.5) * U + 0.5;
  }
  const f = new Ct(s[0], s[1]), u = new Ct(s[s.length - 2], s[s.length - 1]), g = i, p = Math.abs(f.x - u.x) < c && Math.abs(f.y - u.y) < c;
  if (g) {
    s = s.slice(), p && (s.pop(), s.pop(), u.set(s[s.length - 2], s[s.length - 1]));
    const U = (f.x + u.x) * 0.5, X = (u.y + f.y) * 0.5;
    s.unshift(U, X), s.push(U, X);
  }
  const m = n, x = s.length / 2;
  let y = s.length;
  const v = m.length / 2, w = l.width / 2, _ = w * w, S = l.miterLimit * l.miterLimit;
  let C = s[0], b = s[1], A = s[2], P = s[3], M = 0, T = 0, k = -(b - P), E = C - A, I = 0, B = 0, R = Math.sqrt(k * k + E * E);
  k /= R, E /= R, k *= w, E *= w;
  const z = d, F = (1 - z) * 2, L = z * 2;
  g || (l.cap === "round" ? y += $e(
    C - k * (F - L) * 0.5,
    b - E * (F - L) * 0.5,
    C - k * F,
    b - E * F,
    C + k * L,
    b + E * L,
    m,
    !0
  ) + 2 : l.cap === "square" && (y += $a(C, b, k, E, F, L, !0, m))), m.push(
    C - k * F,
    b - E * F
  ), m.push(
    C + k * L,
    b + E * L
  );
  for (let U = 1; U < x - 1; ++U) {
    C = s[(U - 1) * 2], b = s[(U - 1) * 2 + 1], A = s[U * 2], P = s[U * 2 + 1], M = s[(U + 1) * 2], T = s[(U + 1) * 2 + 1], k = -(b - P), E = C - A, R = Math.sqrt(k * k + E * E), k /= R, E /= R, k *= w, E *= w, I = -(P - T), B = A - M, R = Math.sqrt(I * I + B * B), I /= R, B /= R, I *= w, B *= w;
    const X = A - C, J = b - P, Q = A - M, V = T - P, Rt = X * Q + J * V, ht = J * Q - V * X, te = ht < 0;
    if (Math.abs(ht) < 1e-3 * Math.abs(Rt)) {
      m.push(
        A - k * F,
        P - E * F
      ), m.push(
        A + k * L,
        P + E * L
      ), Rt >= 0 && (l.join === "round" ? y += $e(
        A,
        P,
        A - k * F,
        P - E * F,
        A - I * F,
        P - B * F,
        m,
        !1
      ) + 4 : y += 2, m.push(
        A - I * L,
        P - B * L
      ), m.push(
        A + I * F,
        P + B * F
      ));
      continue;
    }
    const Ut = (-k + C) * (-E + P) - (-k + A) * (-E + b), Wt = (-I + M) * (-B + P) - (-I + A) * (-B + T), mt = (X * Wt - Q * Ut) / ht, di = (V * Ut - J * Wt) / ht, Ni = (mt - A) * (mt - A) + (di - P) * (di - P), be = A + (mt - A) * F, he = P + (di - P) * F, le = A - (mt - A) * L, ee = P - (di - P) * L, ie = Math.min(X * X + J * J, Q * Q + V * V), Hi = te ? F : L, $i = ie + Hi * Hi * _;
    Ni <= $i ? l.join === "bevel" || Ni / _ > S ? (te ? (m.push(be, he), m.push(A + k * L, P + E * L), m.push(be, he), m.push(A + I * L, P + B * L)) : (m.push(A - k * F, P - E * F), m.push(le, ee), m.push(A - I * F, P - B * F), m.push(le, ee)), y += 2) : l.join === "round" ? te ? (m.push(be, he), m.push(A + k * L, P + E * L), y += $e(
      A,
      P,
      A + k * L,
      P + E * L,
      A + I * L,
      P + B * L,
      m,
      !0
    ) + 4, m.push(be, he), m.push(A + I * L, P + B * L)) : (m.push(A - k * F, P - E * F), m.push(le, ee), y += $e(
      A,
      P,
      A - k * F,
      P - E * F,
      A - I * F,
      P - B * F,
      m,
      !1
    ) + 4, m.push(A - I * F, P - B * F), m.push(le, ee)) : (m.push(be, he), m.push(le, ee)) : (m.push(A - k * F, P - E * F), m.push(A + k * L, P + E * L), l.join === "round" ? te ? y += $e(
      A,
      P,
      A + k * L,
      P + E * L,
      A + I * L,
      P + B * L,
      m,
      !0
    ) + 2 : y += $e(
      A,
      P,
      A - k * F,
      P - E * F,
      A - I * F,
      P - B * F,
      m,
      !1
    ) + 2 : l.join === "miter" && Ni / _ <= S && (te ? (m.push(le, ee), m.push(le, ee)) : (m.push(be, he), m.push(be, he)), y += 2), m.push(A - I * F, P - B * F), m.push(A + I * L, P + B * L), y += 2);
  }
  C = s[(x - 2) * 2], b = s[(x - 2) * 2 + 1], A = s[(x - 1) * 2], P = s[(x - 1) * 2 + 1], k = -(b - P), E = C - A, R = Math.sqrt(k * k + E * E), k /= R, E /= R, k *= w, E *= w, m.push(A - k * F, P - E * F), m.push(A + k * L, P + E * L), g || (l.cap === "round" ? y += $e(
    A - k * (F - L) * 0.5,
    P - E * (F - L) * 0.5,
    A - k * F,
    P - E * F,
    A + k * L,
    P + E * L,
    m,
    !1
  ) + 2 : l.cap === "square" && (y += $a(A, P, k, E, F, L, !1, m)));
  const Z = Ha * Ha;
  for (let U = v; U < y + v - 2; ++U)
    C = m[U * 2], b = m[U * 2 + 1], A = m[(U + 1) * 2], P = m[(U + 1) * 2 + 1], M = m[(U + 2) * 2], T = m[(U + 2) * 2 + 1], !(Math.abs(C * (P - T) + A * (T - b) + M * (b - P)) < Z) && a.push(U, U + 1, U + 2);
}
function Gl(s, t, e, i, n, r, o) {
  const a = ff(s, t, 2);
  if (!a)
    return;
  for (let c = 0; c < a.length; c += 3)
    r[o++] = a[c] + n, r[o++] = a[c + 1] + n, r[o++] = a[c + 2] + n;
  let h = n * i;
  for (let c = 0; c < s.length; c += 2)
    e[h] = s[c], e[h + 1] = s[c + 1], h += i;
}
const Pp = [], Mp = {
  extension: {
    type: D.ShapeBuilder,
    name: "polygon"
  },
  build(s, t) {
    for (let e = 0; e < s.points.length; e++)
      t[e] = s.points[e];
    return t;
  },
  triangulate(s, t, e, i, n, r) {
    Gl(s, Pp, t, e, i, n, r);
  }
}, Tp = {
  extension: {
    type: D.ShapeBuilder,
    name: "rectangle"
  },
  build(s, t) {
    const e = s, i = e.x, n = e.y, r = e.width, o = e.height;
    return r >= 0 && o >= 0 && (t[0] = i, t[1] = n, t[2] = i + r, t[3] = n, t[4] = i + r, t[5] = n + o, t[6] = i, t[7] = n + o), t;
  },
  triangulate(s, t, e, i, n, r) {
    let o = 0;
    i *= e, t[i + o] = s[0], t[i + o + 1] = s[1], o += e, t[i + o] = s[2], t[i + o + 1] = s[3], o += e, t[i + o] = s[6], t[i + o + 1] = s[7], o += e, t[i + o] = s[4], t[i + o + 1] = s[5], o += e;
    const a = i / e;
    n[r++] = a, n[r++] = a + 1, n[r++] = a + 2, n[r++] = a + 1, n[r++] = a + 3, n[r++] = a + 2;
  }
}, kp = {
  extension: {
    type: D.ShapeBuilder,
    name: "triangle"
  },
  build(s, t) {
    return t[0] = s.x, t[1] = s.y, t[2] = s.x2, t[3] = s.y2, t[4] = s.x3, t[5] = s.y3, t;
  },
  triangulate(s, t, e, i, n, r) {
    let o = 0;
    i *= e, t[i + o] = s[0], t[i + o + 1] = s[1], o += e, t[i + o] = s[2], t[i + o + 1] = s[3], o += e, t[i + o] = s[4], t[i + o + 1] = s[5];
    const a = i / e;
    n[r++] = a, n[r++] = a + 1, n[r++] = a + 2;
  }
}, Cn = {};
Pt.handleByMap(D.ShapeBuilder, Cn);
Pt.add(Tp, Mp, kp, gs, bp, wp);
const Ep = new pt();
function Ip(s, t) {
  const { geometryData: e, batches: i } = t;
  i.length = 0, e.indices.length = 0, e.vertices.length = 0, e.uvs.length = 0;
  for (let n = 0; n < s.instructions.length; n++) {
    const r = s.instructions[n];
    if (r.action === "texture")
      Bp(r.data, i, e);
    else if (r.action === "fill" || r.action === "stroke") {
      const o = r.action === "stroke", a = r.data.path.shapePath, h = r.data.style, c = r.data.hole;
      o && c && ja(c.shapePath, h, null, !0, i, e), ja(a, h, c, o, i, e);
    }
  }
}
function Bp(s, t, e) {
  const { vertices: i, uvs: n, indices: r } = e, o = r.length, a = i.length / 2, h = [], c = Cn.rectangle, l = Ep, d = s.image;
  l.x = s.dx, l.y = s.dy, l.width = s.dw, l.height = s.dh;
  const f = s.transform;
  c.build(l, h), f && Ul(h, f), c.triangulate(h, i, 2, a, r, o);
  const u = d.uvs;
  n.push(
    u.x0,
    u.y0,
    u.x1,
    u.y1,
    u.x3,
    u.y3,
    u.x2,
    u.y2
  );
  const g = Pe.get(Wl);
  g.indexOffset = o, g.indexSize = r.length - o, g.attributeOffset = a, g.attributeSize = i.length / 2 - a, g.baseColor = s.style, g.alpha = s.alpha, g.texture = d, g.geometryData = e, t.push(g);
}
function ja(s, t, e, i, n, r) {
  const { vertices: o, uvs: a, indices: h } = r, c = s.shapePrimitives.length - 1;
  s.shapePrimitives.forEach(({ shape: l, transform: d }, f) => {
    const u = h.length, g = o.length / 2, p = [], m = Cn[l.type];
    if (m.build(l, p), d && Ul(p, d), i) {
      const w = l.closePath ?? !0;
      Cp(p, t, !1, w, o, 2, g, h);
    } else if (e && c === f) {
      c !== 0 && console.warn("[Pixi Graphics] only the last shape have be cut out");
      const w = [], _ = p.slice();
      Rp(e.shapePath).forEach((C) => {
        w.push(_.length / 2), _.push(...C);
      }), Gl(_, w, o, 2, g, h, u);
    } else
      m.triangulate(p, o, 2, g, h, u);
    const x = a.length / 2, y = t.texture;
    if (y !== G.WHITE) {
      const w = t.matrix;
      w && (d && w.append(d.clone().invert()), _p(o, 2, g, a, x, 2, o.length / 2 - g, w));
    } else
      xp(a, x, 2, o.length / 2 - g);
    const v = Pe.get(Wl);
    v.indexOffset = u, v.indexSize = h.length - u, v.attributeOffset = g, v.attributeSize = o.length / 2 - g, v.baseColor = t.color, v.alpha = t.alpha, v.texture = y, v.geometryData = r, n.push(v);
  });
}
function Rp(s) {
  if (!s)
    return [];
  const t = s.shapePrimitives, e = [];
  for (let i = 0; i < t.length; i++) {
    const n = t[i].shape, r = [];
    Cn[n.type].build(n, r), e.push(r);
  }
  return e;
}
class Fp {
  constructor() {
    this.batches = [], this.geometryData = {
      vertices: [],
      uvs: [],
      indices: []
    };
  }
}
class Lp {
  constructor() {
    this.batcher = new mp(), this.instructions = new Xh();
  }
  init() {
    this.instructions.reset();
  }
  /**
   * @deprecated since version 8.0.0
   * Use `batcher.geometry` instead.
   * @see {Batcher#geometry}
   */
  get geometry() {
    return H(Wu, "GraphicsContextRenderData#geometry is deprecated, please use batcher.geometry instead."), this.batcher.geometry;
  }
}
const bo = class Wr {
  constructor(t) {
    this._gpuContextHash = {}, this._graphicsDataContextHash = /* @__PURE__ */ Object.create(null), t.renderableGC.addManagedHash(this, "_gpuContextHash"), t.renderableGC.addManagedHash(this, "_graphicsDataContextHash");
  }
  /**
   * Runner init called, update the default options
   * @ignore
   */
  init(t) {
    Wr.defaultOptions.bezierSmoothness = (t == null ? void 0 : t.bezierSmoothness) ?? Wr.defaultOptions.bezierSmoothness;
  }
  getContextRenderData(t) {
    return this._graphicsDataContextHash[t.uid] || this._initContextRenderData(t);
  }
  // Context management functions
  updateGpuContext(t) {
    let e = this._gpuContextHash[t.uid] || this._initContext(t);
    if (t.dirty) {
      e ? this._cleanGraphicsContextData(t) : e = this._initContext(t), Ip(t, e);
      const i = t.batchMode;
      t.customShader || i === "no-batch" ? e.isBatchable = !1 : i === "auto" && (e.isBatchable = e.geometryData.vertices.length < 400), t.dirty = !1;
    }
    return e;
  }
  getGpuContext(t) {
    return this._gpuContextHash[t.uid] || this._initContext(t);
  }
  _initContextRenderData(t) {
    const e = Pe.get(Lp), { batches: i, geometryData: n } = this._gpuContextHash[t.uid], r = n.vertices.length, o = n.indices.length;
    for (let l = 0; l < i.length; l++)
      i[l].applyTransform = !1;
    const a = e.batcher;
    a.ensureAttributeBuffer(r), a.ensureIndexBuffer(o), a.begin();
    for (let l = 0; l < i.length; l++) {
      const d = i[l];
      a.add(d);
    }
    a.finish(e.instructions);
    const h = a.geometry;
    h.indexBuffer.setDataWithSize(a.indexBuffer, a.indexSize, !0), h.buffers[0].setDataWithSize(a.attributeBuffer.float32View, a.attributeSize, !0);
    const c = a.batches;
    for (let l = 0; l < c.length; l++) {
      const d = c[l];
      d.bindGroup = If(d.textures.textures, d.textures.count);
    }
    return this._graphicsDataContextHash[t.uid] = e, e;
  }
  _initContext(t) {
    const e = new Fp();
    return e.context = t, this._gpuContextHash[t.uid] = e, t.on("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid];
  }
  onGraphicsContextDestroy(t) {
    this._cleanGraphicsContextData(t), t.off("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid] = null;
  }
  _cleanGraphicsContextData(t) {
    const e = this._gpuContextHash[t.uid];
    e.isBatchable || this._graphicsDataContextHash[t.uid] && (Pe.return(this.getContextRenderData(t)), this._graphicsDataContextHash[t.uid] = null), e.batches && e.batches.forEach((i) => {
      Pe.return(i);
    });
  }
  destroy() {
    for (const t in this._gpuContextHash)
      this._gpuContextHash[t] && this.onGraphicsContextDestroy(this._gpuContextHash[t].context);
  }
};
bo.extension = {
  type: [
    D.WebGLSystem,
    D.WebGPUSystem,
    D.CanvasSystem
  ],
  name: "graphicsContext"
};
bo.defaultOptions = {
  /**
   * A value from 0 to 1 that controls the smoothness of bezier curves (the higher the smoother)
   * @default 0.5
   */
  bezierSmoothness: 0.5
};
let Vl = bo;
const Op = 8, Hs = 11920929e-14, Dp = 1;
function Nl(s, t, e, i, n, r, o, a, h, c) {
  const d = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, c ?? Vl.defaultOptions.bezierSmoothness)
  );
  let f = (Dp - d) / 1;
  return f *= f, zp(t, e, i, n, r, o, a, h, s, f), s;
}
function zp(s, t, e, i, n, r, o, a, h, c) {
  Gr(s, t, e, i, n, r, o, a, h, c, 0), h.push(o, a);
}
function Gr(s, t, e, i, n, r, o, a, h, c, l) {
  if (l > Op)
    return;
  const d = (s + e) / 2, f = (t + i) / 2, u = (e + n) / 2, g = (i + r) / 2, p = (n + o) / 2, m = (r + a) / 2, x = (d + u) / 2, y = (f + g) / 2, v = (u + p) / 2, w = (g + m) / 2, _ = (x + v) / 2, S = (y + w) / 2;
  if (l > 0) {
    let C = o - s, b = a - t;
    const A = Math.abs((e - o) * b - (i - a) * C), P = Math.abs((n - o) * b - (r - a) * C);
    if (A > Hs && P > Hs) {
      if ((A + P) * (A + P) <= c * (C * C + b * b)) {
        h.push(_, S);
        return;
      }
    } else if (A > Hs) {
      if (A * A <= c * (C * C + b * b)) {
        h.push(_, S);
        return;
      }
    } else if (P > Hs) {
      if (P * P <= c * (C * C + b * b)) {
        h.push(_, S);
        return;
      }
    } else if (C = _ - (s + o) / 2, b = S - (t + a) / 2, C * C + b * b <= c) {
      h.push(_, S);
      return;
    }
  }
  Gr(s, t, d, f, x, y, _, S, h, c, l + 1), Gr(_, S, v, w, p, m, o, a, h, c, l + 1);
}
const Up = 8, Wp = 11920929e-14, Gp = 1;
function Vp(s, t, e, i, n, r, o, a) {
  const c = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, a ?? Vl.defaultOptions.bezierSmoothness)
  );
  let l = (Gp - c) / 1;
  return l *= l, Np(t, e, i, n, r, o, s, l), s;
}
function Np(s, t, e, i, n, r, o, a) {
  Vr(o, s, t, e, i, n, r, a, 0), o.push(n, r);
}
function Vr(s, t, e, i, n, r, o, a, h) {
  if (h > Up)
    return;
  const c = (t + i) / 2, l = (e + n) / 2, d = (i + r) / 2, f = (n + o) / 2, u = (c + d) / 2, g = (l + f) / 2;
  let p = r - t, m = o - e;
  const x = Math.abs((i - r) * m - (n - o) * p);
  if (x > Wp) {
    if (x * x <= a * (p * p + m * m)) {
      s.push(u, g);
      return;
    }
  } else if (p = u - (t + r) / 2, m = g - (e + o) / 2, p * p + m * m <= a) {
    s.push(u, g);
    return;
  }
  Vr(s, t, e, c, l, u, g, a, h + 1), Vr(s, u, g, d, f, r, o, a, h + 1);
}
function Hl(s, t, e, i, n, r, o, a) {
  let h = Math.abs(n - r);
  (!o && n > r || o && r > n) && (h = 2 * Math.PI - h), a = a || Math.max(6, Math.floor(6 * Math.pow(i, 1 / 3) * (h / Math.PI))), a = Math.max(a, 3);
  let c = h / a, l = n;
  c *= o ? -1 : 1;
  for (let d = 0; d < a + 1; d++) {
    const f = Math.cos(l), u = Math.sin(l), g = t + f * i, p = e + u * i;
    s.push(g, p), l += c;
  }
}
function Hp(s, t, e, i, n, r) {
  const o = s[s.length - 2], h = s[s.length - 1] - e, c = o - t, l = n - e, d = i - t, f = Math.abs(h * d - c * l);
  if (f < 1e-8 || r === 0) {
    (s[s.length - 2] !== t || s[s.length - 1] !== e) && s.push(t, e);
    return;
  }
  const u = h * h + c * c, g = l * l + d * d, p = h * l + c * d, m = r * Math.sqrt(u) / f, x = r * Math.sqrt(g) / f, y = m * p / u, v = x * p / g, w = m * d + x * c, _ = m * l + x * h, S = c * (x + y), C = h * (x + y), b = d * (m + v), A = l * (m + v), P = Math.atan2(C - _, S - w), M = Math.atan2(A - _, b - w);
  Hl(
    s,
    w + t,
    _ + e,
    r,
    P,
    M,
    c * l > d * h
  );
}
const rs = Math.PI * 2, lr = {
  centerX: 0,
  centerY: 0,
  ang1: 0,
  ang2: 0
}, cr = ({ x: s, y: t }, e, i, n, r, o, a, h) => {
  s *= e, t *= i;
  const c = n * s - r * t, l = r * s + n * t;
  return h.x = c + o, h.y = l + a, h;
};
function $p(s, t) {
  const e = t === -1.5707963267948966 ? -0.551915024494 : 1.3333333333333333 * Math.tan(t / 4), i = t === 1.5707963267948966 ? 0.551915024494 : e, n = Math.cos(s), r = Math.sin(s), o = Math.cos(s + t), a = Math.sin(s + t);
  return [
    {
      x: n - r * i,
      y: r + n * i
    },
    {
      x: o + a * i,
      y: a - o * i
    },
    {
      x: o,
      y: a
    }
  ];
}
const Ya = (s, t, e, i) => {
  const n = s * i - t * e < 0 ? -1 : 1;
  let r = s * e + t * i;
  return r > 1 && (r = 1), r < -1 && (r = -1), n * Math.acos(r);
}, jp = (s, t, e, i, n, r, o, a, h, c, l, d, f) => {
  const u = Math.pow(n, 2), g = Math.pow(r, 2), p = Math.pow(l, 2), m = Math.pow(d, 2);
  let x = u * g - u * m - g * p;
  x < 0 && (x = 0), x /= u * m + g * p, x = Math.sqrt(x) * (o === a ? -1 : 1);
  const y = x * n / r * d, v = x * -r / n * l, w = c * y - h * v + (s + e) / 2, _ = h * y + c * v + (t + i) / 2, S = (l - y) / n, C = (d - v) / r, b = (-l - y) / n, A = (-d - v) / r, P = Ya(1, 0, S, C);
  let M = Ya(S, C, b, A);
  a === 0 && M > 0 && (M -= rs), a === 1 && M < 0 && (M += rs), f.centerX = w, f.centerY = _, f.ang1 = P, f.ang2 = M;
};
function Yp(s, t, e, i, n, r, o, a = 0, h = 0, c = 0) {
  if (r === 0 || o === 0)
    return;
  const l = Math.sin(a * rs / 360), d = Math.cos(a * rs / 360), f = d * (t - i) / 2 + l * (e - n) / 2, u = -l * (t - i) / 2 + d * (e - n) / 2;
  if (f === 0 && u === 0)
    return;
  r = Math.abs(r), o = Math.abs(o);
  const g = Math.pow(f, 2) / Math.pow(r, 2) + Math.pow(u, 2) / Math.pow(o, 2);
  g > 1 && (r *= Math.sqrt(g), o *= Math.sqrt(g)), jp(
    t,
    e,
    i,
    n,
    r,
    o,
    h,
    c,
    l,
    d,
    f,
    u,
    lr
  );
  let { ang1: p, ang2: m } = lr;
  const { centerX: x, centerY: y } = lr;
  let v = Math.abs(m) / (rs / 4);
  Math.abs(1 - v) < 1e-7 && (v = 1);
  const w = Math.max(Math.ceil(v), 1);
  m /= w;
  let _ = s[s.length - 2], S = s[s.length - 1];
  const C = { x: 0, y: 0 };
  for (let b = 0; b < w; b++) {
    const A = $p(p, m), { x: P, y: M } = cr(A[0], r, o, d, l, x, y, C), { x: T, y: k } = cr(A[1], r, o, d, l, x, y, C), { x: E, y: I } = cr(A[2], r, o, d, l, x, y, C);
    Nl(
      s,
      _,
      S,
      P,
      M,
      T,
      k,
      E,
      I
    ), _ = E, S = I, p += m;
  }
}
function Xp(s, t, e) {
  const i = (o, a) => {
    const h = a.x - o.x, c = a.y - o.y, l = Math.sqrt(h * h + c * c), d = h / l, f = c / l;
    return { len: l, nx: d, ny: f };
  }, n = (o, a) => {
    o === 0 ? s.moveTo(a.x, a.y) : s.lineTo(a.x, a.y);
  };
  let r = t[t.length - 1];
  for (let o = 0; o < t.length; o++) {
    const a = t[o % t.length], h = a.radius ?? e;
    if (h <= 0) {
      n(o, a), r = a;
      continue;
    }
    const c = t[(o + 1) % t.length], l = i(a, r), d = i(a, c);
    if (l.len < 1e-4 || d.len < 1e-4) {
      n(o, a), r = a;
      continue;
    }
    let f = Math.asin(l.nx * d.ny - l.ny * d.nx), u = 1, g = !1;
    l.nx * d.nx - l.ny * -d.ny < 0 ? f < 0 ? f = Math.PI + f : (f = Math.PI - f, u = -1, g = !0) : f > 0 && (u = -1, g = !0);
    const p = f / 2;
    let m, x = Math.abs(
      Math.cos(p) * h / Math.sin(p)
    );
    x > Math.min(l.len / 2, d.len / 2) ? (x = Math.min(l.len / 2, d.len / 2), m = Math.abs(x * Math.sin(p) / Math.cos(p))) : m = h;
    const y = a.x + d.nx * x + -d.ny * m * u, v = a.y + d.ny * x + d.nx * m * u, w = Math.atan2(l.ny, l.nx) + Math.PI / 2 * u, _ = Math.atan2(d.ny, d.nx) - Math.PI / 2 * u;
    o === 0 && s.moveTo(
      y + Math.cos(w) * m,
      v + Math.sin(w) * m
    ), s.arc(y, v, m, w, _, g), r = a;
  }
}
function Kp(s, t, e, i) {
  const n = (a, h) => Math.sqrt((a.x - h.x) ** 2 + (a.y - h.y) ** 2), r = (a, h, c) => ({
    x: a.x + (h.x - a.x) * c,
    y: a.y + (h.y - a.y) * c
  }), o = t.length;
  for (let a = 0; a < o; a++) {
    const h = t[(a + 1) % o], c = h.radius ?? e;
    if (c <= 0) {
      a === 0 ? s.moveTo(h.x, h.y) : s.lineTo(h.x, h.y);
      continue;
    }
    const l = t[a], d = t[(a + 2) % o], f = n(l, h);
    let u;
    if (f < 1e-4)
      u = h;
    else {
      const m = Math.min(f / 2, c);
      u = r(
        h,
        l,
        m / f
      );
    }
    const g = n(d, h);
    let p;
    if (g < 1e-4)
      p = h;
    else {
      const m = Math.min(g / 2, c);
      p = r(
        h,
        d,
        m / g
      );
    }
    a === 0 ? s.moveTo(u.x, u.y) : s.lineTo(u.x, u.y), s.quadraticCurveTo(h.x, h.y, p.x, p.y, i);
  }
}
const qp = new pt();
class Zp {
  constructor(t) {
    this.shapePrimitives = [], this._currentPoly = null, this._bounds = new xe(), this._graphicsPath2D = t;
  }
  /**
   * Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
   * @param x - The x-coordinate for the starting point.
   * @param y - The y-coordinate for the starting point.
   * @returns The instance of the current object for chaining.
   */
  moveTo(t, e) {
    return this.startPoly(t, e), this;
  }
  /**
   * Connects the current point to a new point with a straight line. This method updates the current path.
   * @param x - The x-coordinate of the new point to connect to.
   * @param y - The y-coordinate of the new point to connect to.
   * @returns The instance of the current object for chaining.
   */
  lineTo(t, e) {
    this._ensurePoly();
    const i = this._currentPoly.points, n = i[i.length - 2], r = i[i.length - 1];
    return (n !== t || r !== e) && i.push(t, e), this;
  }
  /**
   * Adds an arc to the path. The arc is centered at (x, y)
   *  position with radius `radius` starting at `startAngle` and ending at `endAngle`.
   * @param x - The x-coordinate of the arc's center.
   * @param y - The y-coordinate of the arc's center.
   * @param radius - The radius of the arc.
   * @param startAngle - The starting angle of the arc, in radians.
   * @param endAngle - The ending angle of the arc, in radians.
   * @param counterclockwise - Specifies whether the arc should be drawn in the anticlockwise direction. False by default.
   * @returns The instance of the current object for chaining.
   */
  arc(t, e, i, n, r, o) {
    this._ensurePoly(!1);
    const a = this._currentPoly.points;
    return Hl(a, t, e, i, n, r, o), this;
  }
  /**
   * Adds an arc to the path with the arc tangent to the line joining two specified points.
   * The arc radius is specified by `radius`.
   * @param x1 - The x-coordinate of the first point.
   * @param y1 - The y-coordinate of the first point.
   * @param x2 - The x-coordinate of the second point.
   * @param y2 - The y-coordinate of the second point.
   * @param radius - The radius of the arc.
   * @returns The instance of the current object for chaining.
   */
  arcTo(t, e, i, n, r) {
    this._ensurePoly();
    const o = this._currentPoly.points;
    return Hp(o, t, e, i, n, r), this;
  }
  /**
   * Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
   * @param rx - The x-radius of the ellipse.
   * @param ry - The y-radius of the ellipse.
   * @param xAxisRotation - The rotation of the ellipse's x-axis relative
   * to the x-axis of the coordinate system, in degrees.
   * @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
   * @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
   * @param x - The x-coordinate of the arc's end point.
   * @param y - The y-coordinate of the arc's end point.
   * @returns The instance of the current object for chaining.
   */
  arcToSvg(t, e, i, n, r, o, a) {
    const h = this._currentPoly.points;
    return Yp(
      h,
      this._currentPoly.lastX,
      this._currentPoly.lastY,
      o,
      a,
      t,
      e,
      i,
      n,
      r
    ), this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires three points: the first two are control points and the third one is the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the first control point.
   * @param cp1y - The y-coordinate of the first control point.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveTo(t, e, i, n, r, o, a) {
    this._ensurePoly();
    const h = this._currentPoly;
    return Nl(
      this._currentPoly.points,
      h.lastX,
      h.lastY,
      t,
      e,
      i,
      n,
      r,
      o,
      a
    ), this;
  }
  /**
   * Adds a quadratic curve to the path. It requires two points: the control point and the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the control point.
   * @param cp1y - The y-coordinate of the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothing - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveTo(t, e, i, n, r) {
    this._ensurePoly();
    const o = this._currentPoly;
    return Vp(
      this._currentPoly.points,
      o.lastX,
      o.lastY,
      t,
      e,
      i,
      n,
      r
    ), this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this.endPoly(!0), this;
  }
  /**
   * Adds another path to the current path. This method allows for the combination of multiple paths into one.
   * @param path - The `GraphicsPath` object representing the path to add.
   * @param transform - An optional `Matrix` object to apply a transformation to the path before adding it.
   * @returns The instance of the current object for chaining.
   */
  addPath(t, e) {
    this.endPoly(), e && !e.isIdentity() && (t = t.clone(!0), t.transform(e));
    for (let i = 0; i < t.instructions.length; i++) {
      const n = t.instructions[i];
      this[n.action](...n.data);
    }
    return this;
  }
  /**
   * Finalizes the drawing of the current path. Optionally, it can close the path.
   * @param closePath - A boolean indicating whether to close the path after finishing. False by default.
   */
  finish(t = !1) {
    this.endPoly(t);
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, i, n, r) {
    return this.drawShape(new pt(t, e, i, n), r), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, i, n) {
    return this.drawShape(new Sn(t, e, i), n), this;
  }
  /**
   * Draws a polygon shape. This method allows for the creation of complex polygons by specifying a sequence of points.
   * @param points - An array of numbers, or or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
   * representing the x and y coordinates of the polygon's vertices, in sequence.
   * @param close - A boolean indicating whether to close the polygon path. True by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  poly(t, e, i) {
    const n = new Ai(t);
    return n.closePath = e, this.drawShape(n, i), this;
  }
  /**
   * Draws a regular polygon with a specified number of sides. All sides and angles are equal.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  regularPoly(t, e, i, n, r = 0, o) {
    n = Math.max(n | 0, 3);
    const a = -1 * Math.PI / 2 + r, h = Math.PI * 2 / n, c = [];
    for (let l = 0; l < n; l++) {
      const d = l * h + a;
      c.push(
        t + i * Math.cos(d),
        e + i * Math.sin(d)
      );
    }
    return this.poly(c, !0, o), this;
  }
  /**
   * Draws a polygon with rounded corners.
   * Similar to `regularPoly` but with the ability to round the corners of the polygon.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param corner - The radius of the rounding of the corners.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param smoothness - Optional parameter to adjust the smoothness of the rounding.
   * @returns The instance of the current object for chaining.
   */
  roundPoly(t, e, i, n, r, o = 0, a) {
    if (n = Math.max(n | 0, 3), r <= 0)
      return this.regularPoly(t, e, i, n, o);
    const h = i * Math.sin(Math.PI / n) - 1e-3;
    r = Math.min(r, h);
    const c = -1 * Math.PI / 2 + o, l = Math.PI * 2 / n, d = (n - 2) * Math.PI / n / 2;
    for (let f = 0; f < n; f++) {
      const u = f * l + c, g = t + i * Math.cos(u), p = e + i * Math.sin(u), m = u + Math.PI + d, x = u - Math.PI - d, y = g + r * Math.cos(m), v = p + r * Math.sin(m), w = g + r * Math.cos(x), _ = p + r * Math.sin(x);
      f === 0 ? this.moveTo(y, v) : this.lineTo(y, v), this.quadraticCurveTo(g, p, w, _, a);
    }
    return this.closePath();
  }
  /**
   * Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
   * Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
   * @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
   * A minimum of 3 points is required.
   * @param radius - The default radius for the corners.
   * This radius is applied to all corners unless overridden in `points`.
   * @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
   *  method instead of an arc method. Defaults to false.
   * @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
   * Higher values make the curve smoother.
   * @returns The instance of the current object for chaining.
   */
  roundShape(t, e, i = !1, n) {
    return t.length < 3 ? this : (i ? Kp(this, t, e, n) : Xp(this, t, e), this.closePath());
  }
  /**
   * Draw Rectangle with fillet corners. This is much like rounded rectangle
   * however it support negative numbers as well for the corner radius.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param fillet - accept negative or positive values
   */
  filletRect(t, e, i, n, r) {
    if (r === 0)
      return this.rect(t, e, i, n);
    const o = Math.min(i, n) / 2, a = Math.min(o, Math.max(-o, r)), h = t + i, c = e + n, l = a < 0 ? -a : 0, d = Math.abs(a);
    return this.moveTo(t, e + d).arcTo(t + l, e + l, t + d, e, d).lineTo(h - d, e).arcTo(h - l, e + l, h, e + d, d).lineTo(h, c - d).arcTo(h - l, c - l, t + i - d, c, d).lineTo(t + d, c).arcTo(t + l, c - l, t, c - d, d).closePath();
  }
  /**
   * Draw Rectangle with chamfer corners. These are angled corners.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param chamfer - non-zero real number, size of corner cutout
   * @param transform
   */
  chamferRect(t, e, i, n, r, o) {
    if (r <= 0)
      return this.rect(t, e, i, n);
    const a = Math.min(r, Math.min(i, n) / 2), h = t + i, c = e + n, l = [
      t + a,
      e,
      h - a,
      e,
      h,
      e + a,
      h,
      c - a,
      h - a,
      c,
      t + a,
      c,
      t,
      c - a,
      t,
      e + a
    ];
    for (let d = l.length - 1; d >= 2; d -= 2)
      l[d] === l[d - 2] && l[d - 1] === l[d - 3] && l.splice(d - 1, 2);
    return this.poly(l, !0, o);
  }
  /**
   * Draws an ellipse at the specified location and with the given x and y radii.
   * An optional transformation can be applied, allowing for rotation, scaling, and translation.
   * @param x - The x-coordinate of the center of the ellipse.
   * @param y - The y-coordinate of the center of the ellipse.
   * @param radiusX - The horizontal radius of the ellipse.
   * @param radiusY - The vertical radius of the ellipse.
   * @param transform - An optional `Matrix` object to apply a transformation to the ellipse. This can include rotations.
   * @returns The instance of the current object for chaining.
   */
  ellipse(t, e, i, n, r) {
    return this.drawShape(new vo(t, e, i, n), r), this;
  }
  /**
   * Draws a rectangle with rounded corners.
   * The corner radius can be specified to determine how rounded the corners should be.
   * An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  roundRect(t, e, i, n, r, o) {
    return this.drawShape(new An(t, e, i, n, r), o), this;
  }
  /**
   * Draws a given shape on the canvas.
   * This is a generic method that can draw any type of shape specified by the `ShapePrimitive` parameter.
   * An optional transformation matrix can be applied to the shape, allowing for complex transformations.
   * @param shape - The shape to draw, defined as a `ShapePrimitive` object.
   * @param matrix - An optional `Matrix` for transforming the shape. This can include rotations,
   * scaling, and translations.
   * @returns The instance of the current object for chaining.
   */
  drawShape(t, e) {
    return this.endPoly(), this.shapePrimitives.push({ shape: t, transform: e }), this;
  }
  /**
   * Starts a new polygon path from the specified starting point.
   * This method initializes a new polygon or ends the current one if it exists.
   * @param x - The x-coordinate of the starting point of the new polygon.
   * @param y - The y-coordinate of the starting point of the new polygon.
   * @returns The instance of the current object for chaining.
   */
  startPoly(t, e) {
    let i = this._currentPoly;
    return i && this.endPoly(), i = new Ai(), i.points.push(t, e), this._currentPoly = i, this;
  }
  /**
   * Ends the current polygon path. If `closePath` is set to true,
   * the path is closed by connecting the last point to the first one.
   * This method finalizes the current polygon and prepares it for drawing or adding to the shape primitives.
   * @param closePath - A boolean indicating whether to close the polygon by connecting the last point
   *  back to the starting point. False by default.
   * @returns The instance of the current object for chaining.
   */
  endPoly(t = !1) {
    const e = this._currentPoly;
    return e && e.points.length > 2 && (e.closePath = t, this.shapePrimitives.push({ shape: e })), this._currentPoly = null, this;
  }
  _ensurePoly(t = !0) {
    if (!this._currentPoly && (this._currentPoly = new Ai(), t)) {
      const e = this.shapePrimitives[this.shapePrimitives.length - 1];
      if (e) {
        let i = e.shape.x, n = e.shape.y;
        if (e.transform && !e.transform.isIdentity()) {
          const r = e.transform, o = i;
          i = r.a * i + r.c * n + r.tx, n = r.b * o + r.d * n + r.ty;
        }
        this._currentPoly.points.push(i, n);
      } else
        this._currentPoly.points.push(0, 0);
    }
  }
  /** Builds the path. */
  buildPath() {
    const t = this._graphicsPath2D;
    this.shapePrimitives.length = 0, this._currentPoly = null;
    for (let e = 0; e < t.instructions.length; e++) {
      const i = t.instructions[e];
      this[i.action](...i.data);
    }
    this.finish();
  }
  /** Gets the bounds of the path. */
  get bounds() {
    const t = this._bounds;
    t.clear();
    const e = this.shapePrimitives;
    for (let i = 0; i < e.length; i++) {
      const n = e[i], r = n.shape.getBounds(qp);
      n.transform ? t.addRect(r, n.transform) : t.addRect(r);
    }
    return t;
  }
}
class Bi {
  /**
   * Creates a `GraphicsPath` instance optionally from an SVG path string or an array of `PathInstruction`.
   * @param instructions - An SVG path string or an array of `PathInstruction` objects.
   */
  constructor(t) {
    this.instructions = [], this.uid = xt("graphicsPath"), this._dirty = !0, typeof t == "string" ? Pf(t, this) : this.instructions = (t == null ? void 0 : t.slice()) ?? [];
  }
  /**
   * Provides access to the internal shape path, ensuring it is up-to-date with the current instructions.
   * @returns The `ShapePath` instance associated with this `GraphicsPath`.
   */
  get shapePath() {
    return this._shapePath || (this._shapePath = new Zp(this)), this._dirty && (this._dirty = !1, this._shapePath.buildPath()), this._shapePath;
  }
  /**
   * Adds another `GraphicsPath` to this path, optionally applying a transformation.
   * @param path - The `GraphicsPath` to add.
   * @param transform - An optional transformation to apply to the added path.
   * @returns The instance of the current object for chaining.
   */
  addPath(t, e) {
    return t = t.clone(), this.instructions.push({ action: "addPath", data: [t, e] }), this._dirty = !0, this;
  }
  arc(...t) {
    return this.instructions.push({ action: "arc", data: t }), this._dirty = !0, this;
  }
  arcTo(...t) {
    return this.instructions.push({ action: "arcTo", data: t }), this._dirty = !0, this;
  }
  arcToSvg(...t) {
    return this.instructions.push({ action: "arcToSvg", data: t }), this._dirty = !0, this;
  }
  bezierCurveTo(...t) {
    return this.instructions.push({ action: "bezierCurveTo", data: t }), this._dirty = !0, this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires two points: the second control point and the end point. The first control point is assumed to be
   * The starting point is the last point in the current path.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveToShort(t, e, i, n, r) {
    const o = this.instructions[this.instructions.length - 1], a = this.getLastPoint(Ct.shared);
    let h = 0, c = 0;
    if (!o || o.action !== "bezierCurveTo")
      h = a.x, c = a.y;
    else {
      h = o.data[2], c = o.data[3];
      const l = a.x, d = a.y;
      h = l + (l - h), c = d + (d - c);
    }
    return this.instructions.push({ action: "bezierCurveTo", data: [h, c, t, e, i, n, r] }), this._dirty = !0, this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this.instructions.push({ action: "closePath", data: [] }), this._dirty = !0, this;
  }
  ellipse(...t) {
    return this.instructions.push({ action: "ellipse", data: t }), this._dirty = !0, this;
  }
  lineTo(...t) {
    return this.instructions.push({ action: "lineTo", data: t }), this._dirty = !0, this;
  }
  moveTo(...t) {
    return this.instructions.push({ action: "moveTo", data: t }), this;
  }
  quadraticCurveTo(...t) {
    return this.instructions.push({ action: "quadraticCurveTo", data: t }), this._dirty = !0, this;
  }
  /**
   * Adds a quadratic curve to the path. It uses the previous point as the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveToShort(t, e, i) {
    const n = this.instructions[this.instructions.length - 1], r = this.getLastPoint(Ct.shared);
    let o = 0, a = 0;
    if (!n || n.action !== "quadraticCurveTo")
      o = r.x, a = r.y;
    else {
      o = n.data[0], a = n.data[1];
      const h = r.x, c = r.y;
      o = h + (h - o), a = c + (c - a);
    }
    return this.instructions.push({ action: "quadraticCurveTo", data: [o, a, t, e, i] }), this._dirty = !0, this;
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, i, n, r) {
    return this.instructions.push({ action: "rect", data: [t, e, i, n, r] }), this._dirty = !0, this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, i, n) {
    return this.instructions.push({ action: "circle", data: [t, e, i, n] }), this._dirty = !0, this;
  }
  roundRect(...t) {
    return this.instructions.push({ action: "roundRect", data: t }), this._dirty = !0, this;
  }
  poly(...t) {
    return this.instructions.push({ action: "poly", data: t }), this._dirty = !0, this;
  }
  regularPoly(...t) {
    return this.instructions.push({ action: "regularPoly", data: t }), this._dirty = !0, this;
  }
  roundPoly(...t) {
    return this.instructions.push({ action: "roundPoly", data: t }), this._dirty = !0, this;
  }
  roundShape(...t) {
    return this.instructions.push({ action: "roundShape", data: t }), this._dirty = !0, this;
  }
  filletRect(...t) {
    return this.instructions.push({ action: "filletRect", data: t }), this._dirty = !0, this;
  }
  chamferRect(...t) {
    return this.instructions.push({ action: "chamferRect", data: t }), this._dirty = !0, this;
  }
  /**
   * Draws a star shape centered at a specified location. This method allows for the creation
   *  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
   * The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
   * An optional transformation can be applied to scale, rotate, or translate the star as needed.
   * @param x - The x-coordinate of the center of the star.
   * @param y - The y-coordinate of the center of the star.
   * @param points - The number of points of the star.
   * @param radius - The outer radius of the star (distance from the center to the outer points).
   * @param innerRadius - Optional. The inner radius of the star
   * (distance from the center to the inner points between the outer points).
   * If not provided, defaults to half of the `radius`.
   * @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
   * Defaults to 0, meaning one point is directly upward.
   * @param transform - An optional `Matrix` object to apply a transformation to the star.
   * This can include rotations, scaling, and translations.
   * @returns The instance of the current object for chaining further drawing commands.
   */
  // eslint-disable-next-line max-len
  star(t, e, i, n, r, o, a) {
    r = r || n / 2;
    const h = -1 * Math.PI / 2 + o, c = i * 2, l = Math.PI * 2 / c, d = [];
    for (let f = 0; f < c; f++) {
      const u = f % 2 ? r : n, g = f * l + h;
      d.push(
        t + u * Math.cos(g),
        e + u * Math.sin(g)
      );
    }
    return this.poly(d, !0, a), this;
  }
  /**
   * Creates a copy of the current `GraphicsPath` instance. This method supports both shallow and deep cloning.
   * A shallow clone copies the reference of the instructions array, while a deep clone creates a new array and
   * copies each instruction individually, ensuring that modifications to the instructions of the cloned `GraphicsPath`
   * do not affect the original `GraphicsPath` and vice versa.
   * @param deep - A boolean flag indicating whether the clone should be deep.
   * @returns A new `GraphicsPath` instance that is a clone of the current instance.
   */
  clone(t = !1) {
    const e = new Bi();
    if (!t)
      e.instructions = this.instructions.slice();
    else
      for (let i = 0; i < this.instructions.length; i++) {
        const n = this.instructions[i];
        e.instructions.push({ action: n.action, data: n.data.slice() });
      }
    return e;
  }
  clear() {
    return this.instructions.length = 0, this._dirty = !0, this;
  }
  /**
   * Applies a transformation matrix to all drawing instructions within the `GraphicsPath`.
   * This method enables the modification of the path's geometry according to the provided
   * transformation matrix, which can include translations, rotations, scaling, and skewing.
   *
   * Each drawing instruction in the path is updated to reflect the transformation,
   * ensuring the visual representation of the path is consistent with the applied matrix.
   *
   * Note: The transformation is applied directly to the coordinates and control points of the drawing instructions,
   * not to the path as a whole. This means the transformation's effects are baked into the individual instructions,
   * allowing for fine-grained control over the path's appearance.
   * @param matrix - A `Matrix` object representing the transformation to apply.
   * @returns The instance of the current object for chaining further operations.
   */
  transform(t) {
    if (t.isIdentity())
      return this;
    const e = t.a, i = t.b, n = t.c, r = t.d, o = t.tx, a = t.ty;
    let h = 0, c = 0, l = 0, d = 0, f = 0, u = 0, g = 0, p = 0;
    for (let m = 0; m < this.instructions.length; m++) {
      const x = this.instructions[m], y = x.data;
      switch (x.action) {
        case "moveTo":
        case "lineTo":
          h = y[0], c = y[1], y[0] = e * h + n * c + o, y[1] = i * h + r * c + a;
          break;
        case "bezierCurveTo":
          l = y[0], d = y[1], f = y[2], u = y[3], h = y[4], c = y[5], y[0] = e * l + n * d + o, y[1] = i * l + r * d + a, y[2] = e * f + n * u + o, y[3] = i * f + r * u + a, y[4] = e * h + n * c + o, y[5] = i * h + r * c + a;
          break;
        case "quadraticCurveTo":
          l = y[0], d = y[1], h = y[2], c = y[3], y[0] = e * l + n * d + o, y[1] = i * l + r * d + a, y[2] = e * h + n * c + o, y[3] = i * h + r * c + a;
          break;
        case "arcToSvg":
          h = y[5], c = y[6], g = y[0], p = y[1], y[0] = e * g + n * p, y[1] = i * g + r * p, y[5] = e * h + n * c + o, y[6] = i * h + r * c + a;
          break;
        case "circle":
          y[4] = Ki(y[3], t);
          break;
        case "rect":
          y[4] = Ki(y[4], t);
          break;
        case "ellipse":
          y[8] = Ki(y[8], t);
          break;
        case "roundRect":
          y[5] = Ki(y[5], t);
          break;
        case "addPath":
          y[0].transform(t);
          break;
        case "poly":
          y[2] = Ki(y[2], t);
          break;
        default:
          ut("unknown transform action", x.action);
          break;
      }
    }
    return this._dirty = !0, this;
  }
  get bounds() {
    return this.shapePath.bounds;
  }
  /**
   * Retrieves the last point from the current drawing instructions in the `GraphicsPath`.
   * This method is useful for operations that depend on the path's current endpoint,
   * such as connecting subsequent shapes or paths. It supports various drawing instructions,
   * ensuring the last point's position is accurately determined regardless of the path's complexity.
   *
   * If the last instruction is a `closePath`, the method iterates backward through the instructions
   *  until it finds an actionable instruction that defines a point (e.g., `moveTo`, `lineTo`,
   * `quadraticCurveTo`, etc.). For compound paths added via `addPath`, it recursively retrieves
   * the last point from the nested path.
   * @param out - A `Point` object where the last point's coordinates will be stored.
   * This object is modified directly to contain the result.
   * @returns The `Point` object containing the last point's coordinates.
   */
  getLastPoint(t) {
    let e = this.instructions.length - 1, i = this.instructions[e];
    if (!i)
      return t.x = 0, t.y = 0, t;
    for (; i.action === "closePath"; ) {
      if (e--, e < 0)
        return t.x = 0, t.y = 0, t;
      i = this.instructions[e];
    }
    switch (i.action) {
      case "moveTo":
      case "lineTo":
        t.x = i.data[0], t.y = i.data[1];
        break;
      case "quadraticCurveTo":
        t.x = i.data[2], t.y = i.data[3];
        break;
      case "bezierCurveTo":
        t.x = i.data[4], t.y = i.data[5];
        break;
      case "arc":
      case "arcToSvg":
        t.x = i.data[5], t.y = i.data[6];
        break;
      case "addPath":
        i.data[0].getLastPoint(t);
        break;
    }
    return t;
  }
}
function Ki(s, t) {
  return s ? s.prepend(t) : t.clone();
}
function Qp(s, t) {
  if (typeof s == "string") {
    const i = document.createElement("div");
    i.innerHTML = s.trim(), s = i.querySelector("svg");
  }
  const e = {
    context: t,
    path: new Bi()
  };
  return $l(s, e, null, null), t;
}
function $l(s, t, e, i) {
  const n = s.children, { fillStyle: r, strokeStyle: o } = Jp(s);
  r && e ? e = { ...e, ...r } : r && (e = r), o && i ? i = { ...i, ...o } : o && (i = o), t.context.fillStyle = e, t.context.strokeStyle = i;
  let a, h, c, l, d, f, u, g, p, m, x, y, v, w, _, S, C;
  switch (s.nodeName.toLowerCase()) {
    case "path":
      w = s.getAttribute("d"), _ = new Bi(w), t.context.path(_), e && t.context.fill(), i && t.context.stroke();
      break;
    case "circle":
      u = yt(s, "cx", 0), g = yt(s, "cy", 0), p = yt(s, "r", 0), t.context.ellipse(u, g, p, p), e && t.context.fill(), i && t.context.stroke();
      break;
    case "rect":
      a = yt(s, "x", 0), h = yt(s, "y", 0), S = yt(s, "width", 0), C = yt(s, "height", 0), m = yt(s, "rx", 0), x = yt(s, "ry", 0), m || x ? t.context.roundRect(a, h, S, C, m || x) : t.context.rect(a, h, S, C), e && t.context.fill(), i && t.context.stroke();
      break;
    case "ellipse":
      u = yt(s, "cx", 0), g = yt(s, "cy", 0), m = yt(s, "rx", 0), x = yt(s, "ry", 0), t.context.beginPath(), t.context.ellipse(u, g, m, x), e && t.context.fill(), i && t.context.stroke();
      break;
    case "line":
      c = yt(s, "x1", 0), l = yt(s, "y1", 0), d = yt(s, "x2", 0), f = yt(s, "y2", 0), t.context.beginPath(), t.context.moveTo(c, l), t.context.lineTo(d, f), i && t.context.stroke();
      break;
    case "polygon":
      v = s.getAttribute("points"), y = v.match(/\d+/g).map((b) => parseInt(b, 10)), t.context.poly(y, !0), e && t.context.fill(), i && t.context.stroke();
      break;
    case "polyline":
      v = s.getAttribute("points"), y = v.match(/\d+/g).map((b) => parseInt(b, 10)), t.context.poly(y, !1), i && t.context.stroke();
      break;
    case "g":
    case "svg":
      break;
    default: {
      console.info(`[SVG parser] <${s.nodeName}> elements unsupported`);
      break;
    }
  }
  for (let b = 0; b < n.length; b++)
    $l(n[b], t, e, i);
}
function yt(s, t, e) {
  const i = s.getAttribute(t);
  return i ? Number(i) : e;
}
function Jp(s) {
  const t = s.getAttribute("style"), e = {}, i = {};
  let n = !1, r = !1;
  if (t) {
    const o = t.split(";");
    for (let a = 0; a < o.length; a++) {
      const h = o[a], [c, l] = h.split(":");
      switch (c) {
        case "stroke":
          l !== "none" && (e.color = gt.shared.setValue(l).toNumber(), r = !0);
          break;
        case "stroke-width":
          e.width = Number(l);
          break;
        case "fill":
          l !== "none" && (n = !0, i.color = gt.shared.setValue(l).toNumber());
          break;
        case "fill-opacity":
          i.alpha = Number(l);
          break;
        case "stroke-opacity":
          e.alpha = Number(l);
          break;
        case "opacity":
          i.alpha = Number(l), e.alpha = Number(l);
          break;
      }
    }
  } else {
    const o = s.getAttribute("stroke");
    o && o !== "none" && (r = !0, e.color = gt.shared.setValue(o).toNumber(), e.width = yt(s, "stroke-width", 1));
    const a = s.getAttribute("fill");
    a && a !== "none" && (n = !0, i.color = gt.shared.setValue(a).toNumber());
  }
  return {
    strokeStyle: r ? e : null,
    fillStyle: n ? i : null
  };
}
function tg(s) {
  return gt.isColorLike(s);
}
function Xa(s) {
  return s instanceof wn;
}
function Ka(s) {
  return s instanceof ps;
}
function eg(s, t, e) {
  const i = gt.shared.setValue(t ?? 0);
  return s.color = i.toNumber(), s.alpha = i.alpha === 1 ? e.alpha : i.alpha, s.texture = G.WHITE, { ...e, ...s };
}
function qa(s, t, e) {
  return s.fill = t, s.color = 16777215, s.texture = t.texture, s.matrix = t.transform, { ...e, ...s };
}
function Za(s, t, e) {
  return t.buildLinearGradient(), s.fill = t, s.color = 16777215, s.texture = t.texture, s.matrix = t.transform, { ...e, ...s };
}
function ig(s, t) {
  var n;
  const e = { ...t, ...s };
  if (e.texture) {
    if (e.texture !== G.WHITE) {
      const o = ((n = e.matrix) == null ? void 0 : n.invert()) || new j();
      o.translate(e.texture.frame.x, e.texture.frame.y), o.scale(1 / e.texture.source.width, 1 / e.texture.source.height), e.matrix = o;
    }
    const r = e.texture.source.style;
    r.addressMode === "clamp-to-edge" && (r.addressMode = "repeat", r.update());
  }
  const i = gt.shared.setValue(e.color);
  return e.alpha *= i.alpha, e.color = i.toNumber(), e.matrix = e.matrix ? e.matrix.clone() : null, e;
}
function ti(s, t) {
  if (s == null)
    return null;
  const e = {}, i = s;
  return tg(s) ? eg(e, s, t) : Xa(s) ? qa(e, s, t) : Ka(s) ? Za(e, s, t) : i.fill && Xa(i.fill) ? qa(i, i.fill, t) : i.fill && Ka(i.fill) ? Za(i, i.fill, t) : ig(i, t);
}
function rn(s, t) {
  const { width: e, alignment: i, miterLimit: n, cap: r, join: o, ...a } = t, h = ti(s, a);
  return h ? {
    width: e,
    alignment: i,
    miterLimit: n,
    cap: r,
    join: o,
    ...h
  } : null;
}
const sg = new Ct(), Qa = new j(), wo = class ue extends kt {
  constructor() {
    super(...arguments), this.uid = xt("graphicsContext"), this.dirty = !0, this.batchMode = "auto", this.instructions = [], this._activePath = new Bi(), this._transform = new j(), this._fillStyle = { ...ue.defaultFillStyle }, this._strokeStyle = { ...ue.defaultStrokeStyle }, this._stateStack = [], this._tick = 0, this._bounds = new xe(), this._boundsDirty = !0;
  }
  /**
   * Creates a new GraphicsContext object that is a clone of this instance, copying all properties,
   * including the current drawing state, transformations, styles, and instructions.
   * @returns A new GraphicsContext instance with the same properties and state as this one.
   */
  clone() {
    const t = new ue();
    return t.batchMode = this.batchMode, t.instructions = this.instructions.slice(), t._activePath = this._activePath.clone(), t._transform = this._transform.clone(), t._fillStyle = { ...this._fillStyle }, t._strokeStyle = { ...this._strokeStyle }, t._stateStack = this._stateStack.slice(), t._bounds = this._bounds.clone(), t._boundsDirty = !0, t;
  }
  /**
   * The current fill style of the graphics context. This can be a color, gradient, pattern, or a more complex style defined by a FillStyle object.
   */
  get fillStyle() {
    return this._fillStyle;
  }
  set fillStyle(t) {
    this._fillStyle = ti(t, ue.defaultFillStyle);
  }
  /**
   * The current stroke style of the graphics context. Similar to fill styles, stroke styles can encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   */
  get strokeStyle() {
    return this._strokeStyle;
  }
  set strokeStyle(t) {
    this._strokeStyle = rn(t, ue.defaultStrokeStyle);
  }
  /**
   * Sets the current fill style of the graphics context. The fill style can be a color, gradient,
   * pattern, or a more complex style defined by a FillStyle object.
   * @param style - The fill style to apply. This can be a simple color, a gradient or pattern object,
   *                or a FillStyle or ConvertedFillStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setFillStyle(t) {
    return this._fillStyle = ti(t, ue.defaultFillStyle), this;
  }
  /**
   * Sets the current stroke style of the graphics context. Similar to fill styles, stroke styles can
   * encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   * @param style - The stroke style to apply. Can be defined as a color, a gradient or pattern,
   *                or a StrokeStyle or ConvertedStrokeStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setStrokeStyle(t) {
    return this._strokeStyle = ti(t, ue.defaultStrokeStyle), this;
  }
  texture(t, e, i, n, r, o) {
    return this.instructions.push({
      action: "texture",
      data: {
        image: t,
        dx: i || 0,
        dy: n || 0,
        dw: r || t.frame.width,
        dh: o || t.frame.height,
        transform: this._transform.clone(),
        alpha: this._fillStyle.alpha,
        style: e ? gt.shared.setValue(e).toNumber() : 16777215
      }
    }), this.onUpdate(), this;
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  beginPath() {
    return this._activePath = new Bi(), this;
  }
  fill(t, e) {
    let i;
    const n = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && n && n.action === "stroke" ? i = n.data.path : i = this._activePath.clone(), i ? (t != null && (e !== void 0 && typeof t == "number" && (H($, "GraphicsContext.fill(color, alpha) is deprecated, use GraphicsContext.fill({ color, alpha }) instead"), t = { color: t, alpha: e }), this._fillStyle = ti(t, ue.defaultFillStyle)), this.instructions.push({
      action: "fill",
      // TODO copy fill style!
      data: { style: this.fillStyle, path: i }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  _initNextPathLocation() {
    const { x: t, y: e } = this._activePath.getLastPoint(Ct.shared);
    this._activePath.clear(), this._activePath.moveTo(t, e);
  }
  /**
   * Strokes the current path with the current stroke style. This method can take an optional
   * FillInput parameter to define the stroke's appearance, including its color, width, and other properties.
   * @param style - (Optional) The stroke style to apply. Can be defined as a simple color or a more complex style object. If omitted, uses the current stroke style.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  stroke(t) {
    let e;
    const i = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && i && i.action === "fill" ? e = i.data.path : e = this._activePath.clone(), e ? (t != null && (this._strokeStyle = rn(t, ue.defaultStrokeStyle)), this.instructions.push({
      action: "stroke",
      // TODO copy fill style!
      data: { style: this.strokeStyle, path: e }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  /**
   * Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
   * subtracting a path from the previously drawn path. If a hole is not completely in a shape, it will
   * fail to cut correctly!
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  cut() {
    for (let t = 0; t < 2; t++) {
      const e = this.instructions[this.instructions.length - 1 - t], i = this._activePath.clone();
      if (e && (e.action === "stroke" || e.action === "fill"))
        if (e.data.hole)
          e.data.hole.addPath(i);
        else {
          e.data.hole = i;
          break;
        }
    }
    return this._initNextPathLocation(), this;
  }
  /**
   * Adds an arc to the current path, which is centered at (x, y) with the specified radius,
   * starting and ending angles, and direction.
   * @param x - The x-coordinate of the arc's center.
   * @param y - The y-coordinate of the arc's center.
   * @param radius - The arc's radius.
   * @param startAngle - The starting angle, in radians.
   * @param endAngle - The ending angle, in radians.
   * @param counterclockwise - (Optional) Specifies whether the arc is drawn counterclockwise (true) or clockwise (false). Defaults to false.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  arc(t, e, i, n, r, o) {
    this._tick++;
    const a = this._transform;
    return this._activePath.arc(
      a.a * t + a.c * e + a.tx,
      a.b * t + a.d * e + a.ty,
      i,
      n,
      r,
      o
    ), this;
  }
  /**
   * Adds an arc to the current path with the given control points and radius, connected to the previous point
   * by a straight line if necessary.
   * @param x1 - The x-coordinate of the first control point.
   * @param y1 - The y-coordinate of the first control point.
   * @param x2 - The x-coordinate of the second control point.
   * @param y2 - The y-coordinate of the second control point.
   * @param radius - The arc's radius.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  arcTo(t, e, i, n, r) {
    this._tick++;
    const o = this._transform;
    return this._activePath.arcTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * i + o.c * n + o.tx,
      o.b * i + o.d * n + o.ty,
      r
    ), this;
  }
  /**
   * Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
   * @param rx - The x-radius of the ellipse.
   * @param ry - The y-radius of the ellipse.
   * @param xAxisRotation - The rotation of the ellipse's x-axis relative
   * to the x-axis of the coordinate system, in degrees.
   * @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
   * @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
   * @param x - The x-coordinate of the arc's end point.
   * @param y - The y-coordinate of the arc's end point.
   * @returns The instance of the current object for chaining.
   */
  arcToSvg(t, e, i, n, r, o, a) {
    this._tick++;
    const h = this._transform;
    return this._activePath.arcToSvg(
      t,
      e,
      i,
      // should we rotate this with transform??
      n,
      r,
      h.a * o + h.c * a + h.tx,
      h.b * o + h.d * a + h.ty
    ), this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires three points: the first two are control points and the third one is the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the first control point.
   * @param cp1y - The y-coordinate of the first control point.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveTo(t, e, i, n, r, o, a) {
    this._tick++;
    const h = this._transform;
    return this._activePath.bezierCurveTo(
      h.a * t + h.c * e + h.tx,
      h.b * t + h.d * e + h.ty,
      h.a * i + h.c * n + h.tx,
      h.b * i + h.d * n + h.ty,
      h.a * r + h.c * o + h.tx,
      h.b * r + h.d * o + h.ty,
      a
    ), this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    var t;
    return this._tick++, (t = this._activePath) == null || t.closePath(), this;
  }
  /**
   * Draws an ellipse at the specified location and with the given x and y radii.
   * An optional transformation can be applied, allowing for rotation, scaling, and translation.
   * @param x - The x-coordinate of the center of the ellipse.
   * @param y - The y-coordinate of the center of the ellipse.
   * @param radiusX - The horizontal radius of the ellipse.
   * @param radiusY - The vertical radius of the ellipse.
   * @returns The instance of the current object for chaining.
   */
  ellipse(t, e, i, n) {
    return this._tick++, this._activePath.ellipse(t, e, i, n, this._transform.clone()), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, i) {
    return this._tick++, this._activePath.circle(t, e, i, this._transform.clone()), this;
  }
  /**
   * Adds another `GraphicsPath` to this path, optionally applying a transformation.
   * @param path - The `GraphicsPath` to add.
   * @returns The instance of the current object for chaining.
   */
  path(t) {
    return this._tick++, this._activePath.addPath(t, this._transform.clone()), this;
  }
  /**
   * Connects the current point to a new point with a straight line. This method updates the current path.
   * @param x - The x-coordinate of the new point to connect to.
   * @param y - The y-coordinate of the new point to connect to.
   * @returns The instance of the current object for chaining.
   */
  lineTo(t, e) {
    this._tick++;
    const i = this._transform;
    return this._activePath.lineTo(
      i.a * t + i.c * e + i.tx,
      i.b * t + i.d * e + i.ty
    ), this;
  }
  /**
   * Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
   * @param x - The x-coordinate for the starting point.
   * @param y - The y-coordinate for the starting point.
   * @returns The instance of the current object for chaining.
   */
  moveTo(t, e) {
    this._tick++;
    const i = this._transform, n = this._activePath.instructions, r = i.a * t + i.c * e + i.tx, o = i.b * t + i.d * e + i.ty;
    return n.length === 1 && n[0].action === "moveTo" ? (n[0].data[0] = r, n[0].data[1] = o, this) : (this._activePath.moveTo(
      r,
      o
    ), this);
  }
  /**
   * Adds a quadratic curve to the path. It requires two points: the control point and the end point.
   * The starting point is the last point in the current path.
   * @param cpx - The x-coordinate of the control point.
   * @param cpy - The y-coordinate of the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveTo(t, e, i, n, r) {
    this._tick++;
    const o = this._transform;
    return this._activePath.quadraticCurveTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * i + o.c * n + o.tx,
      o.b * i + o.d * n + o.ty,
      r
    ), this;
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, i, n) {
    return this._tick++, this._activePath.rect(t, e, i, n, this._transform.clone()), this;
  }
  /**
   * Draws a rectangle with rounded corners.
   * The corner radius can be specified to determine how rounded the corners should be.
   * An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
   * @returns The instance of the current object for chaining.
   */
  roundRect(t, e, i, n, r) {
    return this._tick++, this._activePath.roundRect(t, e, i, n, r, this._transform.clone()), this;
  }
  /**
   * Draws a polygon shape by specifying a sequence of points. This method allows for the creation of complex polygons,
   * which can be both open and closed. An optional transformation can be applied, enabling the polygon to be scaled,
   * rotated, or translated as needed.
   * @param points - An array of numbers, or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
   * representing the x and y coordinates, of the polygon's vertices, in sequence.
   * @param close - A boolean indicating whether to close the polygon path. True by default.
   */
  poly(t, e) {
    return this._tick++, this._activePath.poly(t, e, this._transform.clone()), this;
  }
  /**
   * Draws a regular polygon with a specified number of sides. All sides and angles are equal.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  regularPoly(t, e, i, n, r = 0, o) {
    return this._tick++, this._activePath.regularPoly(t, e, i, n, r, o), this;
  }
  /**
   * Draws a polygon with rounded corners.
   * Similar to `regularPoly` but with the ability to round the corners of the polygon.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param corner - The radius of the rounding of the corners.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @returns The instance of the current object for chaining.
   */
  roundPoly(t, e, i, n, r, o) {
    return this._tick++, this._activePath.roundPoly(t, e, i, n, r, o), this;
  }
  /**
   * Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
   * Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
   * @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
   * A minimum of 3 points is required.
   * @param radius - The default radius for the corners.
   * This radius is applied to all corners unless overridden in `points`.
   * @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
   *  method instead of an arc method. Defaults to false.
   * @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
   * Higher values make the curve smoother.
   * @returns The instance of the current object for chaining.
   */
  roundShape(t, e, i, n) {
    return this._tick++, this._activePath.roundShape(t, e, i, n), this;
  }
  /**
   * Draw Rectangle with fillet corners. This is much like rounded rectangle
   * however it support negative numbers as well for the corner radius.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param fillet - accept negative or positive values
   */
  filletRect(t, e, i, n, r) {
    return this._tick++, this._activePath.filletRect(t, e, i, n, r), this;
  }
  /**
   * Draw Rectangle with chamfer corners. These are angled corners.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param chamfer - non-zero real number, size of corner cutout
   * @param transform
   */
  chamferRect(t, e, i, n, r, o) {
    return this._tick++, this._activePath.chamferRect(t, e, i, n, r, o), this;
  }
  /**
   * Draws a star shape centered at a specified location. This method allows for the creation
   *  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
   * The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
   * An optional transformation can be applied to scale, rotate, or translate the star as needed.
   * @param x - The x-coordinate of the center of the star.
   * @param y - The y-coordinate of the center of the star.
   * @param points - The number of points of the star.
   * @param radius - The outer radius of the star (distance from the center to the outer points).
   * @param innerRadius - Optional. The inner radius of the star
   * (distance from the center to the inner points between the outer points).
   * If not provided, defaults to half of the `radius`.
   * @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
   * Defaults to 0, meaning one point is directly upward.
   * @returns The instance of the current object for chaining further drawing commands.
   */
  star(t, e, i, n, r = 0, o = 0) {
    return this._tick++, this._activePath.star(t, e, i, n, r, o, this._transform.clone()), this;
  }
  /**
   * Parses and renders an SVG string into the graphics context. This allows for complex shapes and paths
   * defined in SVG format to be drawn within the graphics context.
   * @param svg - The SVG string to be parsed and rendered.
   */
  svg(t) {
    return this._tick++, Qp(t, this), this;
  }
  /**
   * Restores the most recently saved graphics state by popping the top of the graphics state stack.
   * This includes transformations, fill styles, and stroke styles.
   */
  restore() {
    const t = this._stateStack.pop();
    return t && (this._transform = t.transform, this._fillStyle = t.fillStyle, this._strokeStyle = t.strokeStyle), this;
  }
  /** Saves the current graphics state, including transformations, fill styles, and stroke styles, onto a stack. */
  save() {
    return this._stateStack.push({
      transform: this._transform.clone(),
      fillStyle: { ...this._fillStyle },
      strokeStyle: { ...this._strokeStyle }
    }), this;
  }
  /**
   * Returns the current transformation matrix of the graphics context.
   * @returns The current transformation matrix.
   */
  getTransform() {
    return this._transform;
  }
  /**
   * Resets the current transformation matrix to the identity matrix, effectively removing any transformations (rotation, scaling, translation) previously applied.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  resetTransform() {
    return this._transform.identity(), this;
  }
  /**
   * Applies a rotation transformation to the graphics context around the current origin.
   * @param angle - The angle of rotation in radians.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  rotate(t) {
    return this._transform.rotate(t), this;
  }
  /**
   * Applies a scaling transformation to the graphics context, scaling drawings by x horizontally and by y vertically.
   * @param x - The scale factor in the horizontal direction.
   * @param y - (Optional) The scale factor in the vertical direction. If not specified, the x value is used for both directions.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  scale(t, e = t) {
    return this._transform.scale(t, e), this;
  }
  setTransform(t, e, i, n, r, o) {
    return t instanceof j ? (this._transform.set(t.a, t.b, t.c, t.d, t.tx, t.ty), this) : (this._transform.set(t, e, i, n, r, o), this);
  }
  transform(t, e, i, n, r, o) {
    return t instanceof j ? (this._transform.append(t), this) : (Qa.set(t, e, i, n, r, o), this._transform.append(Qa), this);
  }
  /**
   * Applies a translation transformation to the graphics context, moving the origin by the specified amounts.
   * @param x - The amount to translate in the horizontal direction.
   * @param y - (Optional) The amount to translate in the vertical direction. If not specified, the x value is used for both directions.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  translate(t, e = t) {
    return this._transform.translate(t, e), this;
  }
  /**
   * Clears all drawing commands from the graphics context, effectively resetting it. This includes clearing the path,
   * and optionally resetting transformations to the identity matrix.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  clear() {
    return this._activePath.clear(), this.instructions.length = 0, this.resetTransform(), this.onUpdate(), this;
  }
  onUpdate() {
    this.dirty || (this.emit("update", this, 16), this.dirty = !0, this._boundsDirty = !0);
  }
  /** The bounds of the graphic shape. */
  get bounds() {
    if (!this._boundsDirty)
      return this._bounds;
    const t = this._bounds;
    t.clear();
    for (let e = 0; e < this.instructions.length; e++) {
      const i = this.instructions[e], n = i.action;
      if (n === "fill") {
        const r = i.data;
        t.addBounds(r.path.bounds);
      } else if (n === "texture") {
        const r = i.data;
        t.addFrame(r.dx, r.dy, r.dx + r.dw, r.dy + r.dh, r.transform);
      }
      if (n === "stroke") {
        const r = i.data, o = r.style.width / 2, a = r.path.bounds;
        t.addFrame(
          a.minX - o,
          a.minY - o,
          a.maxX + o,
          a.maxY + o
        );
      }
    }
    return t;
  }
  /**
   * Check to see if a point is contained within this geometry.
   * @param point - Point to check if it's contained.
   * @returns {boolean} `true` if the point is contained within geometry.
   */
  containsPoint(t) {
    var n;
    if (!this.bounds.containsPoint(t.x, t.y))
      return !1;
    const e = this.instructions;
    let i = !1;
    for (let r = 0; r < e.length; r++) {
      const o = e[r], a = o.data, h = a.path;
      if (!o.action || !h)
        continue;
      const c = a.style, l = h.shapePath.shapePrimitives;
      for (let d = 0; d < l.length; d++) {
        const f = l[d].shape;
        if (!c || !f)
          continue;
        const u = l[d].transform, g = u ? u.applyInverse(t, sg) : t;
        o.action === "fill" ? i = f.contains(g.x, g.y) : i = f.strokeContains(g.x, g.y, c.width);
        const p = a.hole;
        if (p) {
          const m = (n = p.shapePath) == null ? void 0 : n.shapePrimitives;
          if (m)
            for (let x = 0; x < m.length; x++)
              m[x].shape.contains(g.x, g.y) && (i = !1);
        }
        if (i)
          return !0;
      }
    }
    return i;
  }
  /**
   * Destroys the GraphicsData object.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the fill/stroke style?
   * @param {boolean} [options.textureSource=false] - Should it destroy the texture source of the fill/stroke style?
   */
  destroy(t = !1) {
    if (this._stateStack.length = 0, this._transform = null, this.emit("destroy", this), this.removeAllListeners(), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const i = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._fillStyle.texture && this._fillStyle.texture.destroy(i), this._strokeStyle.texture && this._strokeStyle.texture.destroy(i);
    }
    this._fillStyle = null, this._strokeStyle = null, this.instructions = null, this._activePath = null, this._bounds = null, this._stateStack = null, this.customShader = null, this._transform = null;
  }
};
wo.defaultFillStyle = {
  /** The color to use for the fill. */
  color: 16777215,
  /** The alpha value to use for the fill. */
  alpha: 1,
  /** The texture to use for the fill. */
  texture: G.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null
};
wo.defaultStrokeStyle = {
  /** The width of the stroke. */
  width: 1,
  /** The color to use for the stroke. */
  color: 16777215,
  /** The alpha value to use for the stroke. */
  alpha: 1,
  /** The alignment of the stroke. */
  alignment: 0.5,
  /** The miter limit to use. */
  miterLimit: 10,
  /** The line cap style to use. */
  cap: "butt",
  /** The line join style to use. */
  join: "miter",
  /** The texture to use for the fill. */
  texture: G.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null
};
let Kt = wo;
const Ja = [
  "align",
  "breakWords",
  "cssOverrides",
  "fontVariant",
  "fontWeight",
  "leading",
  "letterSpacing",
  "lineHeight",
  "padding",
  "textBaseline",
  "trim",
  "whiteSpace",
  "wordWrap",
  "wordWrapWidth",
  "fontFamily",
  "fontStyle",
  "fontSize"
];
function ng(s) {
  const t = [];
  let e = 0;
  for (let i = 0; i < Ja.length; i++) {
    const n = `_${Ja[i]}`;
    t[e++] = s[n];
  }
  return e = jl(s._fill, t, e), e = rg(s._stroke, t, e), e = og(s.dropShadow, t, e), t.join("-");
}
function jl(s, t, e) {
  var i;
  return s && (t[e++] = s.color, t[e++] = s.alpha, t[e++] = (i = s.fill) == null ? void 0 : i.styleKey), e;
}
function rg(s, t, e) {
  return s && (e = jl(s, t, e), t[e++] = s.width, t[e++] = s.alignment, t[e++] = s.cap, t[e++] = s.join, t[e++] = s.miterLimit), e;
}
function og(s, t, e) {
  return s && (t[e++] = s.alpha, t[e++] = s.angle, t[e++] = s.blur, t[e++] = s.distance, t[e++] = gt.shared.setValue(s.color).toNumber()), e;
}
const So = class xi extends kt {
  constructor(t = {}) {
    super(), ag(t);
    const e = { ...xi.defaultTextStyle, ...t };
    for (const i in e) {
      const n = i;
      this[n] = e[i];
    }
    this.update();
  }
  /**
   * Alignment for multiline text, does not affect single line text.
   * @member {'left'|'center'|'right'|'justify'}
   */
  get align() {
    return this._align;
  }
  set align(t) {
    this._align = t, this.update();
  }
  /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
  get breakWords() {
    return this._breakWords;
  }
  set breakWords(t) {
    this._breakWords = t, this.update();
  }
  /** Set a drop shadow for the text. */
  get dropShadow() {
    return this._dropShadow;
  }
  set dropShadow(t) {
    t !== null && typeof t == "object" ? this._dropShadow = this._createProxy({ ...xi.defaultDropShadow, ...t }) : this._dropShadow = t ? this._createProxy({ ...xi.defaultDropShadow }) : null, this.update();
  }
  /** The font family, can be a single font name, or a list of names where the first is the preferred font. */
  get fontFamily() {
    return this._fontFamily;
  }
  set fontFamily(t) {
    this._fontFamily = t, this.update();
  }
  /** The font size (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em') */
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(t) {
    typeof t == "string" ? this._fontSize = parseInt(t, 10) : this._fontSize = t, this.update();
  }
  /**
   * The font style.
   * @member {'normal'|'italic'|'oblique'}
   */
  get fontStyle() {
    return this._fontStyle;
  }
  set fontStyle(t) {
    this._fontStyle = t.toLowerCase(), this.update();
  }
  /**
   * The font variant.
   * @member {'normal'|'small-caps'}
   */
  get fontVariant() {
    return this._fontVariant;
  }
  set fontVariant(t) {
    this._fontVariant = t, this.update();
  }
  /**
   * The font weight.
   * @member {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  get fontWeight() {
    return this._fontWeight;
  }
  set fontWeight(t) {
    this._fontWeight = t, this.update();
  }
  /** The space between lines. */
  get leading() {
    return this._leading;
  }
  set leading(t) {
    this._leading = t, this.update();
  }
  /** The amount of spacing between letters, default is 0. */
  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(t) {
    this._letterSpacing = t, this.update();
  }
  /** The line height, a number that represents the vertical space that a letter uses. */
  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(t) {
    this._lineHeight = t, this.update();
  }
  /**
   * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
   * by adding padding to all sides of the text.
   */
  get padding() {
    return this._padding;
  }
  set padding(t) {
    this._padding = t, this.update();
  }
  /** Trim transparent borders. This is an expensive operation so only use this if you have to! */
  get trim() {
    return this._trim;
  }
  set trim(t) {
    this._trim = t, this.update();
  }
  /**
   * The baseline of the text that is rendered.
   * @member {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  get textBaseline() {
    return this._textBaseline;
  }
  set textBaseline(t) {
    this._textBaseline = t, this.update();
  }
  /**
   * How newlines and spaces should be handled.
   * Default is 'pre' (preserve, preserve).
   *
   *  value       | New lines     |   Spaces
   *  ---         | ---           |   ---
   * 'normal'     | Collapse      |   Collapse
   * 'pre'        | Preserve      |   Preserve
   * 'pre-line'   | Preserve      |   Collapse
   * @member {'normal'|'pre'|'pre-line'}
   */
  get whiteSpace() {
    return this._whiteSpace;
  }
  set whiteSpace(t) {
    this._whiteSpace = t, this.update();
  }
  /** Indicates if word wrap should be used. */
  get wordWrap() {
    return this._wordWrap;
  }
  set wordWrap(t) {
    this._wordWrap = t, this.update();
  }
  /** The width at which text will wrap, it needs wordWrap to be set to true. */
  get wordWrapWidth() {
    return this._wordWrapWidth;
  }
  set wordWrapWidth(t) {
    this._wordWrapWidth = t, this.update();
  }
  /** A fillstyle that will be used on the text e.g., 'red', '#00FF00'. */
  get fill() {
    return this._originalFill;
  }
  set fill(t) {
    t !== this._originalFill && (this._originalFill = t, this._isFillStyle(t) && (this._originalFill = this._createProxy({ ...Kt.defaultFillStyle, ...t }, () => {
      this._fill = ti(
        { ...this._originalFill },
        Kt.defaultFillStyle
      );
    })), this._fill = ti(
      t === 0 ? "black" : t,
      Kt.defaultFillStyle
    ), this.update());
  }
  /** A fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'. */
  get stroke() {
    return this._originalStroke;
  }
  set stroke(t) {
    t !== this._originalStroke && (this._originalStroke = t, this._isFillStyle(t) && (this._originalStroke = this._createProxy({ ...Kt.defaultStrokeStyle, ...t }, () => {
      this._stroke = rn(
        { ...this._originalStroke },
        Kt.defaultStrokeStyle
      );
    })), this._stroke = rn(t, Kt.defaultStrokeStyle), this.update());
  }
  _generateKey() {
    return this._styleKey = ng(this), this._styleKey;
  }
  update() {
    this._styleKey = null, this.emit("update", this);
  }
  /** Resets all properties to the default values */
  reset() {
    const t = xi.defaultTextStyle;
    for (const e in t)
      this[e] = t[e];
  }
  get styleKey() {
    return this._styleKey || this._generateKey();
  }
  /**
   * Creates a new TextStyle object with the same values as this one.
   * @returns New cloned TextStyle object
   */
  clone() {
    return new xi({
      align: this.align,
      breakWords: this.breakWords,
      dropShadow: this._dropShadow ? { ...this._dropShadow } : null,
      fill: this._fill,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontStyle: this.fontStyle,
      fontVariant: this.fontVariant,
      fontWeight: this.fontWeight,
      leading: this.leading,
      letterSpacing: this.letterSpacing,
      lineHeight: this.lineHeight,
      padding: this.padding,
      stroke: this._stroke,
      textBaseline: this.textBaseline,
      whiteSpace: this.whiteSpace,
      wordWrap: this.wordWrap,
      wordWrapWidth: this.wordWrapWidth
    });
  }
  /**
   * Destroys this text style.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the texture of the this style
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the this style
   */
  destroy(t = !1) {
    var i, n, r, o;
    if (this.removeAllListeners(), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const a = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      (i = this._fill) != null && i.texture && this._fill.texture.destroy(a), (n = this._originalFill) != null && n.texture && this._originalFill.texture.destroy(a), (r = this._stroke) != null && r.texture && this._stroke.texture.destroy(a), (o = this._originalStroke) != null && o.texture && this._originalStroke.texture.destroy(a);
    }
    this._fill = null, this._stroke = null, this.dropShadow = null, this._originalStroke = null, this._originalFill = null;
  }
  _createProxy(t, e) {
    return new Proxy(t, {
      set: (i, n, r) => (i[n] = r, e == null || e(n, r), this.update(), !0)
    });
  }
  _isFillStyle(t) {
    return (t ?? null) !== null && !(gt.isColorLike(t) || t instanceof ps || t instanceof wn);
  }
};
So.defaultDropShadow = {
  /** Set alpha for the drop shadow */
  alpha: 1,
  /** Set a angle of the drop shadow */
  angle: Math.PI / 6,
  /** Set a shadow blur radius */
  blur: 0,
  /** A fill style to be used on the  e.g., 'red', '#00FF00' */
  color: "black",
  /** Set a distance of the drop shadow */
  distance: 5
};
So.defaultTextStyle = {
  /**
   * See {@link TextStyle.align}
   * @type {'left'|'center'|'right'|'justify'}
   */
  align: "left",
  /** See {@link TextStyle.breakWords} */
  breakWords: !1,
  /** See {@link TextStyle.dropShadow} */
  dropShadow: null,
  /**
   * See {@link TextStyle.fill}
   * @type {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
   */
  fill: "black",
  /**
   * See {@link TextStyle.fontFamily}
   * @type {string|string[]}
   */
  fontFamily: "Arial",
  /**
   * See {@link TextStyle.fontSize}
   * @type {number|string}
   */
  fontSize: 26,
  /**
   * See {@link TextStyle.fontStyle}
   * @type {'normal'|'italic'|'oblique'}
   */
  fontStyle: "normal",
  /**
   * See {@link TextStyle.fontVariant}
   * @type {'normal'|'small-caps'}
   */
  fontVariant: "normal",
  /**
   * See {@link TextStyle.fontWeight}
   * @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  fontWeight: "normal",
  /** See {@link TextStyle.leading} */
  leading: 0,
  /** See {@link TextStyle.letterSpacing} */
  letterSpacing: 0,
  /** See {@link TextStyle.lineHeight} */
  lineHeight: 0,
  /** See {@link TextStyle.padding} */
  padding: 0,
  /**
   * See {@link TextStyle.stroke}
   * @type {string|number}
   */
  stroke: null,
  /**
   * See {@link TextStyle.textBaseline}
   * @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  textBaseline: "alphabetic",
  /** See {@link TextStyle.trim} */
  trim: !1,
  /**
   * See {@link TextStyle.whiteSpace}
   * @type {'normal'|'pre'|'pre-line'}
   */
  whiteSpace: "pre",
  /** See {@link TextStyle.wordWrap} */
  wordWrap: !1,
  /** See {@link TextStyle.wordWrapWidth} */
  wordWrapWidth: 100
};
let hi = So;
function ag(s) {
  const t = s;
  if (typeof t.dropShadow == "boolean" && t.dropShadow) {
    const e = hi.defaultDropShadow;
    s.dropShadow = {
      alpha: t.dropShadowAlpha ?? e.alpha,
      angle: t.dropShadowAngle ?? e.angle,
      blur: t.dropShadowBlur ?? e.blur,
      color: t.dropShadowColor ?? e.color,
      distance: t.dropShadowDistance ?? e.distance
    };
  }
  if (t.strokeThickness !== void 0) {
    H($, "strokeThickness is now a part of stroke");
    const e = t.stroke;
    let i = {};
    if (gt.isColorLike(e))
      i.color = e;
    else if (e instanceof ps || e instanceof wn)
      i.fill = e;
    else if (Object.hasOwnProperty.call(e, "color") || Object.hasOwnProperty.call(e, "fill"))
      i = e;
    else
      throw new Error("Invalid stroke value.");
    s.stroke = {
      ...i,
      width: t.strokeThickness
    };
  }
  if (Array.isArray(t.fillGradientStops)) {
    H($, "gradient fill is now a fill pattern: `new FillGradient(...)`");
    let e;
    s.fontSize == null ? s.fontSize = hi.defaultTextStyle.fontSize : typeof s.fontSize == "string" ? e = parseInt(s.fontSize, 10) : e = s.fontSize;
    const i = new ps(0, 0, 0, e * 1.7), n = t.fillGradientStops.map((r) => gt.shared.setValue(r).toNumber());
    n.forEach((r, o) => {
      const a = o / (n.length - 1);
      i.addColorStop(a, r);
    }), s.fill = {
      fill: i
    };
  }
}
class hg {
  constructor(t) {
    this._canvasPool = /* @__PURE__ */ Object.create(null), this.canvasOptions = t || {}, this.enableFullScreen = !1;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   */
  _createCanvasAndContext(t, e) {
    const i = ot.get().createCanvas();
    i.width = t, i.height = e;
    const n = i.getContext("2d");
    return { canvas: i, context: n };
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param minWidth - The minimum width of the render texture.
   * @param minHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @returns The new render texture.
   */
  getOptimalCanvasAndContext(t, e, i = 1) {
    t = Math.ceil(t * i - 1e-6), e = Math.ceil(e * i - 1e-6), t = Zo(t), e = Zo(e);
    const n = (t << 17) + (e << 1);
    this._canvasPool[n] || (this._canvasPool[n] = []);
    let r = this._canvasPool[n].pop();
    return r || (r = this._createCanvasAndContext(t, e)), r;
  }
  /**
   * Place a render texture back into the pool.
   * @param canvasAndContext
   */
  returnCanvasAndContext(t) {
    const e = t.canvas, { width: i, height: n } = e, r = (i << 17) + (n << 1);
    t.context.clearRect(0, 0, i, n), this._canvasPool[r].push(t);
  }
  clear() {
    this._canvasPool = {};
  }
}
const th = new hg(), lg = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui"
];
function Nr(s) {
  const t = typeof s.fontSize == "number" ? `${s.fontSize}px` : s.fontSize;
  let e = s.fontFamily;
  Array.isArray(s.fontFamily) || (e = s.fontFamily.split(","));
  for (let i = e.length - 1; i >= 0; i--) {
    let n = e[i].trim();
    !/([\"\'])[^\'\"]+\1/.test(n) && !lg.includes(n) && (n = `"${n}"`), e[i] = n;
  }
  return `${s.fontStyle} ${s.fontVariant} ${s.fontWeight} ${t} ${e.join(",")}`;
}
const ur = {
  // TextMetrics requires getImageData readback for measuring fonts.
  willReadFrequently: !0
}, ae = class O {
  /**
   * Checking that we can use modern canvas 2D API.
   *
   * Note: This is an unstable API, Chrome < 94 use `textLetterSpacing`, later versions use `letterSpacing`.
   * @see TextMetrics.experimentalLetterSpacing
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ICanvasRenderingContext2D/letterSpacing
   * @see https://developer.chrome.com/origintrials/#/view_trial/3585991203293757441
   */
  static get experimentalLetterSpacingSupported() {
    let t = O._experimentalLetterSpacingSupported;
    if (t !== void 0) {
      const e = ot.get().getCanvasRenderingContext2D().prototype;
      t = O._experimentalLetterSpacingSupported = "letterSpacing" in e || "textLetterSpacing" in e;
    }
    return t;
  }
  /**
   * @param text - the text that was measured
   * @param style - the style that was measured
   * @param width - the measured width of the text
   * @param height - the measured height of the text
   * @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
   * @param lineWidths - an array of the line widths for each line matched to `lines`
   * @param lineHeight - the measured line height for this style
   * @param maxLineWidth - the maximum line width for all measured lines
   * @param {FontMetrics} fontProperties - the font properties object from TextMetrics.measureFont
   */
  constructor(t, e, i, n, r, o, a, h, c) {
    this.text = t, this.style = e, this.width = i, this.height = n, this.lines = r, this.lineWidths = o, this.lineHeight = a, this.maxLineWidth = h, this.fontProperties = c;
  }
  /**
   * Measures the supplied string of text and returns a Rectangle.
   * @param text - The text to measure.
   * @param style - The text style to use for measuring
   * @param canvas - optional specification of the canvas to use for measuring.
   * @param wordWrap
   * @returns Measured width and height of the text.
   */
  static measureText(t = " ", e, i = O._canvas, n = e.wordWrap) {
    var y;
    const r = `${t}:${e.styleKey}`;
    if (O._measurementCache[r])
      return O._measurementCache[r];
    const o = Nr(e), a = O.measureFont(o);
    a.fontSize === 0 && (a.fontSize = e.fontSize, a.ascent = e.fontSize);
    const h = O.__context;
    h.font = o;
    const l = (n ? O._wordWrap(t, e, i) : t).split(/(?:\r\n|\r|\n)/), d = new Array(l.length);
    let f = 0;
    for (let v = 0; v < l.length; v++) {
      const w = O._measureText(l[v], e.letterSpacing, h);
      d[v] = w, f = Math.max(f, w);
    }
    const u = ((y = e._stroke) == null ? void 0 : y.width) || 0;
    let g = f + u;
    e.dropShadow && (g += e.dropShadow.distance);
    const p = e.lineHeight || a.fontSize;
    let m = Math.max(p, a.fontSize + u) + (l.length - 1) * (p + e.leading);
    return e.dropShadow && (m += e.dropShadow.distance), new O(
      t,
      e,
      g,
      m,
      l,
      d,
      p + e.leading,
      f,
      a
    );
  }
  static _measureText(t, e, i) {
    let n = !1;
    O.experimentalLetterSpacingSupported && (O.experimentalLetterSpacing ? (i.letterSpacing = `${e}px`, i.textLetterSpacing = `${e}px`, n = !0) : (i.letterSpacing = "0px", i.textLetterSpacing = "0px"));
    const r = i.measureText(t);
    let o = r.width;
    const a = -r.actualBoundingBoxLeft;
    let c = r.actualBoundingBoxRight - a;
    if (o > 0)
      if (n)
        o -= e, c -= e;
      else {
        const l = (O.graphemeSegmenter(t).length - 1) * e;
        o += l, c += l;
      }
    return Math.max(o, c);
  }
  /**
   * Applies newlines to a string to have it optimally fit into the horizontal
   * bounds set by the Text object's wordWrapWidth property.
   * @param text - String to apply word wrapping to
   * @param style - the style to use when wrapping
   * @param canvas - optional specification of the canvas to use for measuring.
   * @returns New string with new lines applied where required
   */
  static _wordWrap(t, e, i = O._canvas) {
    const n = i.getContext("2d", ur);
    let r = 0, o = "", a = "";
    const h = /* @__PURE__ */ Object.create(null), { letterSpacing: c, whiteSpace: l } = e, d = O._collapseSpaces(l), f = O._collapseNewlines(l);
    let u = !d;
    const g = e.wordWrapWidth + c, p = O._tokenize(t);
    for (let m = 0; m < p.length; m++) {
      let x = p[m];
      if (O._isNewline(x)) {
        if (!f) {
          a += O._addLine(o), u = !d, o = "", r = 0;
          continue;
        }
        x = " ";
      }
      if (d) {
        const v = O.isBreakingSpace(x), w = O.isBreakingSpace(o[o.length - 1]);
        if (v && w)
          continue;
      }
      const y = O._getFromCache(x, c, h, n);
      if (y > g)
        if (o !== "" && (a += O._addLine(o), o = "", r = 0), O.canBreakWords(x, e.breakWords)) {
          const v = O.wordWrapSplit(x);
          for (let w = 0; w < v.length; w++) {
            let _ = v[w], S = _, C = 1;
            for (; v[w + C]; ) {
              const A = v[w + C];
              if (!O.canBreakChars(S, A, x, w, e.breakWords))
                _ += A;
              else
                break;
              S = A, C++;
            }
            w += C - 1;
            const b = O._getFromCache(_, c, h, n);
            b + r > g && (a += O._addLine(o), u = !1, o = "", r = 0), o += _, r += b;
          }
        } else {
          o.length > 0 && (a += O._addLine(o), o = "", r = 0);
          const v = m === p.length - 1;
          a += O._addLine(x, !v), u = !1, o = "", r = 0;
        }
      else
        y + r > g && (u = !1, a += O._addLine(o), o = "", r = 0), (o.length > 0 || !O.isBreakingSpace(x) || u) && (o += x, r += y);
    }
    return a += O._addLine(o, !1), a;
  }
  /**
   * Convenience function for logging each line added during the wordWrap method.
   * @param line    - The line of text to add
   * @param newLine - Add new line character to end
   * @returns A formatted line
   */
  static _addLine(t, e = !0) {
    return t = O._trimRight(t), t = e ? `${t}
` : t, t;
  }
  /**
   * Gets & sets the widths of calculated characters in a cache object
   * @param key            - The key
   * @param letterSpacing  - The letter spacing
   * @param cache          - The cache
   * @param context        - The canvas context
   * @returns The from cache.
   */
  static _getFromCache(t, e, i, n) {
    let r = i[t];
    return typeof r != "number" && (r = O._measureText(t, e, n) + e, i[t] = r), r;
  }
  /**
   * Determines whether we should collapse breaking spaces.
   * @param whiteSpace - The TextStyle property whiteSpace
   * @returns Should collapse
   */
  static _collapseSpaces(t) {
    return t === "normal" || t === "pre-line";
  }
  /**
   * Determines whether we should collapse newLine chars.
   * @param whiteSpace - The white space
   * @returns should collapse
   */
  static _collapseNewlines(t) {
    return t === "normal";
  }
  /**
   * Trims breaking whitespaces from string.
   * @param text - The text
   * @returns Trimmed string
   */
  static _trimRight(t) {
    if (typeof t != "string")
      return "";
    for (let e = t.length - 1; e >= 0; e--) {
      const i = t[e];
      if (!O.isBreakingSpace(i))
        break;
      t = t.slice(0, -1);
    }
    return t;
  }
  /**
   * Determines if char is a newline.
   * @param char - The character
   * @returns True if newline, False otherwise.
   */
  static _isNewline(t) {
    return typeof t != "string" ? !1 : O._newlines.includes(t.charCodeAt(0));
  }
  /**
   * Determines if char is a breaking whitespace.
   *
   * It allows one to determine whether char should be a breaking whitespace
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param char - The character
   * @param [_nextChar] - The next character
   * @returns True if whitespace, False otherwise.
   */
  static isBreakingSpace(t, e) {
    return typeof t != "string" ? !1 : O._breakingSpaces.includes(t.charCodeAt(0));
  }
  /**
   * Splits a string into words, breaking-spaces and newLine characters
   * @param text - The text
   * @returns A tokenized array
   */
  static _tokenize(t) {
    const e = [];
    let i = "";
    if (typeof t != "string")
      return e;
    for (let n = 0; n < t.length; n++) {
      const r = t[n], o = t[n + 1];
      if (O.isBreakingSpace(r, o) || O._isNewline(r)) {
        i !== "" && (e.push(i), i = ""), e.push(r);
        continue;
      }
      i += r;
    }
    return i !== "" && e.push(i), e;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to customise which words should break
   * Examples are if the token is CJK or numbers.
   * It must return a boolean.
   * @param _token - The token
   * @param breakWords - The style attr break words
   * @returns Whether to break word or not
   */
  static canBreakWords(t, e) {
    return e;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to determine whether a pair of characters
   * should be broken by newlines
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param _char - The character
   * @param _nextChar - The next character
   * @param _token - The token/word the characters are from
   * @param _index - The index in the token of the char
   * @param _breakWords - The style attr break words
   * @returns whether to break word or not
   */
  static canBreakChars(t, e, i, n, r) {
    return !0;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It is called when a token (usually a word) has to be split into separate pieces
   * in order to determine the point to break a word.
   * It must return an array of characters.
   * @param token - The token to split
   * @returns The characters of the token
   * @see CanvasTextMetrics.graphemeSegmenter
   */
  static wordWrapSplit(t) {
    return O.graphemeSegmenter(t);
  }
  /**
   * Calculates the ascent, descent and fontSize of a given font-style
   * @param font - String representing the style of the font
   * @returns Font properties object
   */
  static measureFont(t) {
    if (O._fonts[t])
      return O._fonts[t];
    const e = O._context;
    e.font = t;
    const i = e.measureText(O.METRICS_STRING + O.BASELINE_SYMBOL), n = {
      ascent: i.actualBoundingBoxAscent,
      descent: i.actualBoundingBoxDescent,
      fontSize: i.actualBoundingBoxAscent + i.actualBoundingBoxDescent
    };
    return O._fonts[t] = n, n;
  }
  /**
   * Clear font metrics in metrics cache.
   * @param {string} [font] - font name. If font name not set then clear cache for all fonts.
   */
  static clearMetrics(t = "") {
    t ? delete O._fonts[t] : O._fonts = {};
  }
  /**
   * Cached canvas element for measuring text
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _canvas() {
    if (!O.__canvas) {
      let t;
      try {
        const e = new OffscreenCanvas(0, 0), i = e.getContext("2d", ur);
        if (i != null && i.measureText)
          return O.__canvas = e, e;
        t = ot.get().createCanvas();
      } catch {
        t = ot.get().createCanvas();
      }
      t.width = t.height = 10, O.__canvas = t;
    }
    return O.__canvas;
  }
  /**
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _context() {
    return O.__context || (O.__context = O._canvas.getContext("2d", ur)), O.__context;
  }
};
ae.METRICS_STRING = "|ÉqÅ";
ae.BASELINE_SYMBOL = "M";
ae.BASELINE_MULTIPLIER = 1.4;
ae.HEIGHT_MULTIPLIER = 2;
ae.graphemeSegmenter = (() => {
  if (typeof (Intl == null ? void 0 : Intl.Segmenter) == "function") {
    const s = new Intl.Segmenter();
    return (t) => [...s.segment(t)].map((e) => e.segment);
  }
  return (s) => [...s];
})();
ae.experimentalLetterSpacing = !1;
ae._fonts = {};
ae._newlines = [
  10,
  // line feed
  13
  // carriage return
];
ae._breakingSpaces = [
  9,
  // character tabulation
  32,
  // space
  8192,
  // en quad
  8193,
  // em quad
  8194,
  // en space
  8195,
  // em space
  8196,
  // three-per-em space
  8197,
  // four-per-em space
  8198,
  // six-per-em space
  8200,
  // punctuation space
  8201,
  // thin space
  8202,
  // hair space
  8287,
  // medium mathematical space
  12288
  // ideographic space
];
ae._measurementCache = {};
let Hr = ae;
function eh(s, t) {
  if (s.texture === G.WHITE && !s.fill)
    return gt.shared.setValue(s.color).setAlpha(s.alpha ?? 1).toHexa();
  if (s.fill) {
    if (s.fill instanceof wn) {
      const e = s.fill, i = t.createPattern(e.texture.source.resource, "repeat"), n = e.transform.copyTo(j.shared);
      return n.scale(
        e.texture.frame.width,
        e.texture.frame.height
      ), i.setTransform(n), i;
    } else if (s.fill instanceof ps) {
      const e = s.fill;
      if (e.type === "linear") {
        const i = t.createLinearGradient(
          e.x0,
          e.y0,
          e.x1,
          e.y1
        );
        return e.gradientStops.forEach((n) => {
          i.addColorStop(n.offset, gt.shared.setValue(n.color).toHex());
        }), i;
      }
    }
  } else {
    const e = t.createPattern(s.texture.source.resource, "repeat"), i = s.matrix.copyTo(j.shared);
    return i.scale(s.texture.frame.width, s.texture.frame.height), e.setTransform(i), e;
  }
  return ut("FillStyle not recognised", s), "red";
}
function Yl(s) {
  if (s === "")
    return [];
  typeof s == "string" && (s = [s]);
  const t = [];
  for (let e = 0, i = s.length; e < i; e++) {
    const n = s[e];
    if (Array.isArray(n)) {
      if (n.length !== 2)
        throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${n.length}.`);
      if (n[0].length === 0 || n[1].length === 0)
        throw new Error("[BitmapFont]: Invalid character delimiter.");
      const r = n[0].charCodeAt(0), o = n[1].charCodeAt(0);
      if (o < r)
        throw new Error("[BitmapFont]: Invalid character range.");
      for (let a = r, h = o; a <= h; a++)
        t.push(String.fromCharCode(a));
    } else
      t.push(...Array.from(n));
  }
  if (t.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return t;
}
const Xl = class Kl extends Ml {
  /**
   * @param options - The options for the dynamic bitmap font.
   */
  constructor(t) {
    super(), this.resolution = 1, this.pages = [], this._padding = 0, this._measureCache = /* @__PURE__ */ Object.create(null), this._currentChars = [], this._currentX = 0, this._currentY = 0, this._currentPageIndex = -1, this._skipKerning = !1;
    const e = { ...Kl.defaultOptions, ...t };
    this._textureSize = e.textureSize, this._mipmap = e.mipmap;
    const i = e.style.clone();
    e.overrideFill && (i._fill.color = 16777215, i._fill.alpha = 1, i._fill.texture = G.WHITE, i._fill.fill = null), this.applyFillAsTint = e.overrideFill;
    const n = i.fontSize;
    i.fontSize = this.baseMeasurementFontSize;
    const r = Nr(i);
    e.overrideSize ? i._stroke && (i._stroke.width *= this.baseRenderedFontSize / n) : i.fontSize = this.baseRenderedFontSize = n, this._style = i, this._skipKerning = e.skipKerning ?? !1, this.resolution = e.resolution ?? 1, this._padding = e.padding ?? 4, this.fontMetrics = Hr.measureFont(r), this.lineHeight = i.lineHeight || this.fontMetrics.fontSize || i.fontSize;
  }
  ensureCharacters(t) {
    var g, p;
    const e = Yl(t).filter((m) => !this._currentChars.includes(m)).filter((m, x, y) => y.indexOf(m) === x);
    if (!e.length)
      return;
    this._currentChars = [...this._currentChars, ...e];
    let i;
    this._currentPageIndex === -1 ? i = this._nextPage() : i = this.pages[this._currentPageIndex];
    let { canvas: n, context: r } = i.canvasAndContext, o = i.texture.source;
    const a = this._style;
    let h = this._currentX, c = this._currentY;
    const l = this.baseRenderedFontSize / this.baseMeasurementFontSize, d = this._padding * l;
    let f = 0, u = !1;
    for (let m = 0; m < e.length; m++) {
      const x = e[m], y = Hr.measureText(x, a, n, !1), v = Math.ceil((a.fontStyle === "italic" ? 2 : 1) * y.width);
      y.lineHeight = y.height;
      const w = y.width * l, _ = y.height * l, S = v + d * 2, C = _ + d * 2;
      if (u = !1, x !== `
` && x !== "\r" && x !== "	" && x !== " " && (u = !0, f = Math.ceil(Math.max(C, f))), h + S > this._textureSize && (c += f, f = C, h = 0, c + f > this._textureSize)) {
        o.update();
        const A = this._nextPage();
        n = A.canvasAndContext.canvas, r = A.canvasAndContext.context, o = A.texture.source, c = 0;
      }
      const b = w / l - (((g = a.dropShadow) == null ? void 0 : g.distance) ?? 0) - (((p = a._stroke) == null ? void 0 : p.width) ?? 0);
      if (this.chars[x] = {
        id: x.codePointAt(0),
        xOffset: -this._padding,
        yOffset: -this._padding,
        xAdvance: b,
        kerning: {}
      }, u) {
        this._drawGlyph(
          r,
          y,
          h + d,
          c + d,
          l,
          a
        );
        const A = o.width * l, P = o.height * l, M = new pt(
          h / A * o.width,
          c / P * o.height,
          S / A * o.width,
          C / P * o.height
        );
        this.chars[x].texture = new G({
          source: o,
          frame: M
        }), h += Math.ceil(S);
      }
    }
    o.update(), this._currentX = h, this._currentY = c, this._skipKerning && this._applyKerning(e, r);
  }
  /**
   * @deprecated since 8.0.0
   * The map of base page textures (i.e., sheets of glyphs).
   */
  get pageTextures() {
    return H($, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
  }
  _applyKerning(t, e) {
    const i = this._measureCache;
    for (let n = 0; n < t.length; n++) {
      const r = t[n];
      for (let o = 0; o < this._currentChars.length; o++) {
        const a = this._currentChars[o];
        let h = i[r];
        h || (h = i[r] = e.measureText(r).width);
        let c = i[a];
        c || (c = i[a] = e.measureText(a).width);
        let l = e.measureText(r + a).width, d = l - (h + c);
        d && (this.chars[r].kerning[a] = d), l = e.measureText(r + a).width, d = l - (h + c), d && (this.chars[a].kerning[r] = d);
      }
    }
  }
  _nextPage() {
    this._currentPageIndex++;
    const t = this.resolution, e = th.getOptimalCanvasAndContext(
      this._textureSize,
      this._textureSize,
      t
    );
    this._setupContext(e.context, this._style, t);
    const i = t * (this.baseRenderedFontSize / this.baseMeasurementFontSize), n = new G({
      source: new zi({
        resource: e.canvas,
        resolution: i,
        alphaMode: "premultiply-alpha-on-upload",
        autoGenerateMipmaps: this._mipmap
      })
    }), r = {
      canvasAndContext: e,
      texture: n
    };
    return this.pages[this._currentPageIndex] = r, r;
  }
  // canvas style!
  _setupContext(t, e, i) {
    e.fontSize = this.baseRenderedFontSize, t.scale(i, i), t.font = Nr(e), e.fontSize = this.baseMeasurementFontSize, t.textBaseline = e.textBaseline;
    const n = e._stroke, r = (n == null ? void 0 : n.width) ?? 0;
    if (n && (t.lineWidth = r, t.lineJoin = n.join, t.miterLimit = n.miterLimit, t.strokeStyle = eh(n, t)), e._fill && (t.fillStyle = eh(e._fill, t)), e.dropShadow) {
      const o = e.dropShadow, a = gt.shared.setValue(o.color).toArray(), h = o.blur * i, c = o.distance * i;
      t.shadowColor = `rgba(${a[0] * 255},${a[1] * 255},${a[2] * 255},${o.alpha})`, t.shadowBlur = h, t.shadowOffsetX = Math.cos(o.angle) * c, t.shadowOffsetY = Math.sin(o.angle) * c;
    } else
      t.shadowColor = "black", t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0;
  }
  _drawGlyph(t, e, i, n, r, o) {
    const a = e.text, h = e.fontProperties, c = o._stroke, l = ((c == null ? void 0 : c.width) ?? 0) * r, d = i + l / 2, f = n - l / 2, u = h.descent * r, g = e.lineHeight * r;
    o.stroke && l && t.strokeText(a, d, f + g - u), o._fill && t.fillText(a, d, f + g - u);
  }
  destroy() {
    super.destroy();
    for (let t = 0; t < this.pages.length; t++) {
      const { canvasAndContext: e, texture: i } = this.pages[t];
      th.returnCanvasAndContext(e), i.destroy(!0);
    }
    this.pages = null;
  }
};
Xl.defaultOptions = {
  textureSize: 512,
  style: new hi(),
  mipmap: !0
};
let ih = Xl;
function cg(s, t, e, i) {
  const n = {
    width: 0,
    height: 0,
    offsetY: 0,
    scale: t.fontSize / e.baseMeasurementFontSize,
    lines: [{
      width: 0,
      charPositions: [],
      spaceWidth: 0,
      spacesIndex: [],
      chars: []
    }]
  };
  n.offsetY = e.baseLineOffset;
  let r = n.lines[0], o = null, a = !0;
  const h = {
    spaceWord: !1,
    width: 0,
    start: 0,
    index: 0,
    // use index to not modify the array as we use it a lot!
    positions: [],
    chars: []
  }, c = (g) => {
    const p = r.width;
    for (let m = 0; m < h.index; m++) {
      const x = g.positions[m];
      r.chars.push(g.chars[m]), r.charPositions.push(x + p);
    }
    r.width += g.width, a = !1, h.width = 0, h.index = 0, h.chars.length = 0;
  }, l = () => {
    let g = r.chars.length - 1;
    if (i) {
      let p = r.chars[g];
      for (; p === " "; )
        r.width -= e.chars[p].xAdvance, p = r.chars[--g];
    }
    n.width = Math.max(n.width, r.width), r = {
      width: 0,
      charPositions: [],
      chars: [],
      spaceWidth: 0,
      spacesIndex: []
    }, a = !0, n.lines.push(r), n.height += e.lineHeight;
  }, d = e.baseMeasurementFontSize / t.fontSize, f = t.letterSpacing * d, u = t.wordWrapWidth * d;
  for (let g = 0; g < s.length + 1; g++) {
    let p;
    const m = g === s.length;
    m || (p = s[g]);
    const x = e.chars[p] || e.chars[" "];
    if (/(?:\s)/.test(p) || p === "\r" || p === `
` || m) {
      if (!a && t.wordWrap && r.width + h.width - f > u ? (l(), c(h), m || r.charPositions.push(0)) : (h.start = r.width, c(h), m || r.charPositions.push(0)), p === "\r" || p === `
`)
        r.width !== 0 && l();
      else if (!m) {
        const _ = x.xAdvance + (x.kerning[o] || 0) + f;
        r.width += _, r.spaceWidth = _, r.spacesIndex.push(r.charPositions.length), r.chars.push(p);
      }
    } else {
      const w = x.kerning[o] || 0, _ = x.xAdvance + w + f;
      h.positions[h.index++] = h.width + w, h.chars.push(p), h.width += _;
    }
    o = p;
  }
  return l(), t.align === "center" ? ug(n) : t.align === "right" ? dg(n) : t.align === "justify" && fg(n), n;
}
function ug(s) {
  for (let t = 0; t < s.lines.length; t++) {
    const e = s.lines[t], i = s.width / 2 - e.width / 2;
    for (let n = 0; n < e.charPositions.length; n++)
      e.charPositions[n] += i;
  }
}
function dg(s) {
  for (let t = 0; t < s.lines.length; t++) {
    const e = s.lines[t], i = s.width - e.width;
    for (let n = 0; n < e.charPositions.length; n++)
      e.charPositions[n] += i;
  }
}
function fg(s) {
  const t = s.width;
  for (let e = 0; e < s.lines.length; e++) {
    const i = s.lines[e];
    let n = 0, r = i.spacesIndex[n++], o = 0;
    const a = i.spacesIndex.length, c = (t - i.width) / a;
    for (let l = 0; l < i.charPositions.length; l++)
      l === r && (r = i.spacesIndex[n++], o += c), i.charPositions[l] += o;
  }
}
let $s = 0;
class pg {
  constructor() {
    this.ALPHA = [["a", "z"], ["A", "Z"], " "], this.NUMERIC = [["0", "9"]], this.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "], this.ASCII = [[" ", "~"]], this.defaultOptions = {
      chars: this.ALPHANUMERIC,
      resolution: 1,
      padding: 4,
      skipKerning: !1
    };
  }
  /**
   * Get a font for the specified text and style.
   * @param text - The text to get the font for
   * @param style - The style to use
   */
  getFont(t, e) {
    var o;
    let i = `${e.fontFamily}-bitmap`, n = !0;
    if (e._fill.fill && !e._stroke)
      i += e._fill.fill.styleKey, n = !1;
    else if (e._stroke || e.dropShadow) {
      let a = e.styleKey;
      a = a.substring(0, a.lastIndexOf("-")), i = `${a}-bitmap`, n = !1;
    }
    if (!st.has(i)) {
      const a = new ih({
        style: e,
        overrideFill: n,
        overrideSize: !0,
        ...this.defaultOptions
      });
      $s++, $s > 50 && ut("BitmapText", `You have dynamically created ${$s} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``), a.once("destroy", () => {
        $s--, st.remove(i);
      }), st.set(
        i,
        a
      );
    }
    const r = st.get(i);
    return (o = r.ensureCharacters) == null || o.call(r, t), r;
  }
  /**
   * Get the layout of a text for the specified style.
   * @param text - The text to get the layout for
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  getLayout(t, e, i = !0) {
    const n = this.getFont(t, e);
    return cg([...t], e, n, i);
  }
  /**
   * Measure the text using the specified style.
   * @param text - The text to measure
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  measureText(t, e, i = !0) {
    return this.getLayout(t, e, i);
  }
  // eslint-disable-next-line max-len
  install(...t) {
    var c, l, d, f;
    let e = t[0];
    typeof e == "string" && (e = {
      name: e,
      style: t[1],
      chars: (c = t[2]) == null ? void 0 : c.chars,
      resolution: (l = t[2]) == null ? void 0 : l.resolution,
      padding: (d = t[2]) == null ? void 0 : d.padding,
      skipKerning: (f = t[2]) == null ? void 0 : f.skipKerning
    }, H($, "BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})"));
    const i = e == null ? void 0 : e.name;
    if (!i)
      throw new Error("[BitmapFontManager] Property `name` is required.");
    e = { ...this.defaultOptions, ...e };
    const n = e.style, r = n instanceof hi ? n : new hi(n), o = r._fill.fill !== null && r._fill.fill !== void 0, a = new ih({
      style: r,
      overrideFill: o,
      skipKerning: e.skipKerning,
      padding: e.padding,
      resolution: e.resolution,
      overrideSize: !1
    }), h = Yl(e.chars);
    return a.ensureCharacters(h.join("")), st.set(`${i}-bitmap`, a), a.once("destroy", () => st.remove(`${i}-bitmap`)), a;
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * @param {string} name - The name of the bitmap font to uninstall.
   */
  uninstall(t) {
    const e = `${t}-bitmap`, i = st.get(e);
    i && i.destroy();
  }
}
const $r = new pg();
class ql extends Ml {
  constructor(t, e) {
    super();
    const { textures: i, data: n } = t;
    Object.keys(n.pages).forEach((r) => {
      const o = n.pages[parseInt(r, 10)], a = i[o.id];
      this.pages.push({ texture: a });
    }), Object.keys(n.chars).forEach((r) => {
      const o = n.chars[r], {
        frame: a,
        source: h
      } = i[o.page], c = new pt(
        o.x + a.x,
        o.y + a.y,
        o.width,
        o.height
      ), l = new G({
        source: h,
        frame: c
      });
      this.chars[r] = {
        id: r.codePointAt(0),
        xOffset: o.xOffset,
        yOffset: o.yOffset,
        xAdvance: o.xAdvance,
        kerning: o.kerning ?? {},
        texture: l
      };
    }), this.baseRenderedFontSize = n.fontSize, this.baseMeasurementFontSize = n.fontSize, this.fontMetrics = {
      ascent: 0,
      descent: 0,
      fontSize: n.fontSize
    }, this.baseLineOffset = n.baseLineOffset, this.lineHeight = n.lineHeight, this.fontFamily = n.fontFamily, this.distanceField = n.distanceField ?? {
      type: "none",
      range: 0
    }, this.url = e;
  }
  /** Destroys the BitmapFont object. */
  destroy() {
    super.destroy();
    for (let t = 0; t < this.pages.length; t++) {
      const { texture: e } = this.pages[t];
      e.destroy(!0);
    }
    this.pages = null;
  }
  /**
   * Generates a bitmap-font for the given style and character set
   * @param options - Setup options for font generation.
   * @returns Font generated by style options.
   * @example
   * import { BitmapFont, BitmapText } from 'pixi.js';
   *
   * BitmapFont.install('TitleFont', {
   *     fontFamily: 'Arial',
   *     fontSize: 12,
   *     strokeThickness: 2,
   *     fill: 'purple',
   * });
   *
   * const title = new BitmapText({ text: 'This is the title', fontFamily: 'TitleFont' });
   */
  static install(t) {
    $r.install(t);
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * @param {string} name - The name of the bitmap font to uninstall.
   */
  static uninstall(t) {
    $r.uninstall(t);
  }
}
const dr = {
  test(s) {
    return typeof s == "string" && s.startsWith("info face=");
  },
  parse(s) {
    const t = s.match(/^[a-z]+\s+.+$/gm), e = {
      info: [],
      common: [],
      page: [],
      char: [],
      chars: [],
      kerning: [],
      kernings: [],
      distanceField: []
    };
    for (const d in t) {
      const f = t[d].match(/^[a-z]+/gm)[0], u = t[d].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), g = {};
      for (const p in u) {
        const m = u[p].split("="), x = m[0], y = m[1].replace(/"/gm, ""), v = parseFloat(y), w = isNaN(v) ? y : v;
        g[x] = w;
      }
      e[f].push(g);
    }
    const i = {
      chars: {},
      pages: [],
      lineHeight: 0,
      fontSize: 0,
      fontFamily: "",
      distanceField: null,
      baseLineOffset: 0
    }, [n] = e.info, [r] = e.common, [o] = e.distanceField ?? [];
    o && (i.distanceField = {
      range: parseInt(o.distanceRange, 10),
      type: o.fieldType
    }), i.fontSize = parseInt(n.size, 10), i.fontFamily = n.face, i.lineHeight = parseInt(r.lineHeight, 10);
    const a = e.page;
    for (let d = 0; d < a.length; d++)
      i.pages.push({
        id: parseInt(a[d].id, 10) || 0,
        file: a[d].file
      });
    const h = {};
    i.baseLineOffset = i.lineHeight - parseInt(r.base, 10);
    const c = e.char;
    for (let d = 0; d < c.length; d++) {
      const f = c[d], u = parseInt(f.id, 10);
      let g = f.letter ?? f.char ?? String.fromCharCode(u);
      g === "space" && (g = " "), h[u] = g, i.chars[g] = {
        id: u,
        // texture deets..
        page: parseInt(f.page, 10) || 0,
        x: parseInt(f.x, 10),
        y: parseInt(f.y, 10),
        width: parseInt(f.width, 10),
        height: parseInt(f.height, 10),
        xOffset: parseInt(f.xoffset, 10),
        yOffset: parseInt(f.yoffset, 10),
        xAdvance: parseInt(f.xadvance, 10),
        kerning: {}
      };
    }
    const l = e.kerning || [];
    for (let d = 0; d < l.length; d++) {
      const f = parseInt(l[d].first, 10), u = parseInt(l[d].second, 10), g = parseInt(l[d].amount, 10);
      i.chars[h[u]].kerning[h[f]] = g;
    }
    return i;
  }
}, sh = {
  test(s) {
    const t = s;
    return typeof t != "string" && "getElementsByTagName" in t && t.getElementsByTagName("page").length && t.getElementsByTagName("info")[0].getAttribute("face") !== null;
  },
  parse(s) {
    const t = {
      chars: {},
      pages: [],
      lineHeight: 0,
      fontSize: 0,
      fontFamily: "",
      distanceField: null,
      baseLineOffset: 0
    }, e = s.getElementsByTagName("info")[0], i = s.getElementsByTagName("common")[0], n = s.getElementsByTagName("distanceField")[0];
    n && (t.distanceField = {
      type: n.getAttribute("fieldType"),
      range: parseInt(n.getAttribute("distanceRange"), 10)
    });
    const r = s.getElementsByTagName("page"), o = s.getElementsByTagName("char"), a = s.getElementsByTagName("kerning");
    t.fontSize = parseInt(e.getAttribute("size"), 10), t.fontFamily = e.getAttribute("face"), t.lineHeight = parseInt(i.getAttribute("lineHeight"), 10);
    for (let c = 0; c < r.length; c++)
      t.pages.push({
        id: parseInt(r[c].getAttribute("id"), 10) || 0,
        file: r[c].getAttribute("file")
      });
    const h = {};
    t.baseLineOffset = t.lineHeight - parseInt(i.getAttribute("base"), 10);
    for (let c = 0; c < o.length; c++) {
      const l = o[c], d = parseInt(l.getAttribute("id"), 10);
      let f = l.getAttribute("letter") ?? l.getAttribute("char") ?? String.fromCharCode(d);
      f === "space" && (f = " "), h[d] = f, t.chars[f] = {
        id: d,
        // texture deets..
        page: parseInt(l.getAttribute("page"), 10) || 0,
        x: parseInt(l.getAttribute("x"), 10),
        y: parseInt(l.getAttribute("y"), 10),
        width: parseInt(l.getAttribute("width"), 10),
        height: parseInt(l.getAttribute("height"), 10),
        // render deets..
        xOffset: parseInt(l.getAttribute("xoffset"), 10),
        yOffset: parseInt(l.getAttribute("yoffset"), 10),
        // + baseLineOffset,
        xAdvance: parseInt(l.getAttribute("xadvance"), 10),
        kerning: {}
      };
    }
    for (let c = 0; c < a.length; c++) {
      const l = parseInt(a[c].getAttribute("first"), 10), d = parseInt(a[c].getAttribute("second"), 10), f = parseInt(a[c].getAttribute("amount"), 10);
      t.chars[h[d]].kerning[h[l]] = f;
    }
    return t;
  }
}, nh = {
  test(s) {
    return typeof s == "string" && s.includes("<font>") ? sh.test(ot.get().parseXML(s)) : !1;
  },
  parse(s) {
    return sh.parse(ot.get().parseXML(s));
  }
}, gg = [".xml", ".fnt"], mg = {
  extension: {
    type: D.CacheParser,
    name: "cacheBitmapFont"
  },
  test: (s) => s instanceof ql,
  getCacheableAssets(s, t) {
    const e = {};
    return s.forEach((i) => {
      e[i] = t, e[`${i}-bitmap`] = t;
    }), e[`${t.fontFamily}-bitmap`] = t, e;
  }
}, _g = {
  extension: {
    type: D.LoadParser,
    priority: Ie.Normal
  },
  name: "loadBitmapFont",
  test(s) {
    return gg.includes(St.extname(s).toLowerCase());
  },
  async testParse(s) {
    return dr.test(s) || nh.test(s);
  },
  async parse(s, t, e) {
    const i = dr.test(s) ? dr.parse(s) : nh.parse(s), { src: n } = t, { pages: r } = i, o = [], a = i.distanceField ? {
      scaleMode: "linear",
      alphaMode: "premultiply-alpha-on-upload",
      autoGenerateMipmaps: !1,
      resolution: 1
    } : {};
    for (let d = 0; d < r.length; ++d) {
      const f = r[d].file;
      let u = St.join(St.dirname(n), f);
      u = Er(u, n), o.push({
        src: u,
        data: a
      });
    }
    const h = await e.load(o), c = o.map((d) => h[d.src]);
    return new ql({
      data: i,
      textures: c
    }, n);
  },
  async load(s, t) {
    return await (await ot.get().fetch(s)).text();
  },
  async unload(s, t, e) {
    await Promise.all(s.pages.map((i) => e.unload(i.texture.source._sourceOrigin))), s.destroy();
  }
};
class xg {
  /**
   * @param loader
   * @param verbose - should the loader log to the console
   */
  constructor(t, e = !1) {
    this._loader = t, this._assetList = [], this._isLoading = !1, this._maxConcurrent = 1, this.verbose = e;
  }
  /**
   * Adds an array of assets to load.
   * @param assetUrls - assets to load
   */
  add(t) {
    t.forEach((e) => {
      this._assetList.push(e);
    }), this.verbose && console.log("[BackgroundLoader] assets: ", this._assetList), this._isActive && !this._isLoading && this._next();
  }
  /**
   * Loads the next set of assets. Will try to load as many assets as it can at the same time.
   *
   * The max assets it will try to load at one time will be 4.
   */
  async _next() {
    if (this._assetList.length && this._isActive) {
      this._isLoading = !0;
      const t = [], e = Math.min(this._assetList.length, this._maxConcurrent);
      for (let i = 0; i < e; i++)
        t.push(this._assetList.pop());
      await this._loader.load(t), this._isLoading = !1, this._next();
    }
  }
  /**
   * Activate/Deactivate the loading. If set to true then it will immediately continue to load the next asset.
   * @returns whether the class is active
   */
  get active() {
    return this._isActive;
  }
  set active(t) {
    this._isActive !== t && (this._isActive = t, t && !this._isLoading && this._next());
  }
}
const yg = {
  extension: {
    type: D.CacheParser,
    name: "cacheTextureArray"
  },
  test: (s) => Array.isArray(s) && s.every((t) => t instanceof G),
  getCacheableAssets: (s, t) => {
    const e = {};
    return s.forEach((i) => {
      t.forEach((n, r) => {
        e[i + (r === 0 ? "" : r + 1)] = n;
      });
    }), e;
  }
};
async function Zl(s) {
  if ("Image" in globalThis)
    return new Promise((t) => {
      const e = new Image();
      e.onload = () => {
        t(!0);
      }, e.onerror = () => {
        t(!1);
      }, e.src = s;
    });
  if ("createImageBitmap" in globalThis && "fetch" in globalThis) {
    try {
      const t = await (await fetch(s)).blob();
      await createImageBitmap(t);
    } catch {
      return !1;
    }
    return !0;
  }
  return !1;
}
const vg = {
  extension: {
    type: D.DetectionParser,
    priority: 1
  },
  test: async () => Zl(
    // eslint-disable-next-line max-len
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
  ),
  add: async (s) => [...s, "avif"],
  remove: async (s) => s.filter((t) => t !== "avif")
}, rh = ["png", "jpg", "jpeg"], bg = {
  extension: {
    type: D.DetectionParser,
    priority: -1
  },
  test: () => Promise.resolve(!0),
  add: async (s) => [...s, ...rh],
  remove: async (s) => s.filter((t) => !rh.includes(t))
}, wg = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;
function Ao(s) {
  return wg ? !1 : document.createElement("video").canPlayType(s) !== "";
}
const Sg = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => Ao("video/mp4"),
  add: async (s) => [...s, "mp4", "m4v"],
  remove: async (s) => s.filter((t) => t !== "mp4" && t !== "m4v")
}, Ag = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => Ao("video/ogg"),
  add: async (s) => [...s, "ogv"],
  remove: async (s) => s.filter((t) => t !== "ogv")
}, Cg = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => Ao("video/webm"),
  add: async (s) => [...s, "webm"],
  remove: async (s) => s.filter((t) => t !== "webm")
}, Pg = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => Zl(
    "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="
  ),
  add: async (s) => [...s, "webp"],
  remove: async (s) => s.filter((t) => t !== "webp")
};
class Mg {
  constructor() {
    this._parsers = [], this._parsersValidated = !1, this.parsers = new Proxy(this._parsers, {
      set: (t, e, i) => (this._parsersValidated = !1, t[e] = i, !0)
    }), this.promiseCache = {};
  }
  /** function used for testing */
  reset() {
    this._parsersValidated = !1, this.promiseCache = {};
  }
  /**
   * Used internally to generate a promise for the asset to be loaded.
   * @param url - The URL to be loaded
   * @param data - any custom additional information relevant to the asset being loaded
   * @returns - a promise that will resolve to an Asset for example a Texture of a JSON object
   */
  _getLoadPromiseAndParser(t, e) {
    const i = {
      promise: null,
      parser: null
    };
    return i.promise = (async () => {
      var o, a;
      let n = null, r = null;
      if (e.loadParser && (r = this._parserHash[e.loadParser], r || ut(`[Assets] specified load parser "${e.loadParser}" not found while loading ${t}`)), !r) {
        for (let h = 0; h < this.parsers.length; h++) {
          const c = this.parsers[h];
          if (c.load && ((o = c.test) != null && o.call(c, t, e, this))) {
            r = c;
            break;
          }
        }
        if (!r)
          return ut(`[Assets] ${t} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`), null;
      }
      n = await r.load(t, e, this), i.parser = r;
      for (let h = 0; h < this.parsers.length; h++) {
        const c = this.parsers[h];
        c.parse && c.parse && await ((a = c.testParse) == null ? void 0 : a.call(c, n, e, this)) && (n = await c.parse(n, e, this) || n, i.parser = c);
      }
      return n;
    })(), i;
  }
  async load(t, e) {
    this._parsersValidated || this._validateParsers();
    let i = 0;
    const n = {}, r = nn(t), o = ne(t, (c) => ({
      alias: [c],
      src: c,
      data: {}
    })), a = o.length, h = o.map(async (c) => {
      const l = St.toAbsolute(c.src);
      if (!n[c.src])
        try {
          this.promiseCache[l] || (this.promiseCache[l] = this._getLoadPromiseAndParser(l, c)), n[c.src] = await this.promiseCache[l].promise, e && e(++i / a);
        } catch (d) {
          throw delete this.promiseCache[l], delete n[c.src], new Error(`[Loader.load] Failed to load ${l}.
${d}`);
        }
    });
    return await Promise.all(h), r ? n[o[0].src] : n;
  }
  /**
   * Unloads one or more assets. Any unloaded assets will be destroyed, freeing up memory for your app.
   * The parser that created the asset, will be the one that unloads it.
   * @example
   * // Single asset:
   * const asset = await Loader.load('cool.png');
   *
   * await Loader.unload('cool.png');
   *
   * console.log(asset.destroyed); // true
   * @param assetsToUnloadIn - urls that you want to unload, or a single one!
   */
  async unload(t) {
    const i = ne(t, (n) => ({
      alias: [n],
      src: n
    })).map(async (n) => {
      var a, h;
      const r = St.toAbsolute(n.src), o = this.promiseCache[r];
      if (o) {
        const c = await o.promise;
        delete this.promiseCache[r], await ((h = (a = o.parser) == null ? void 0 : a.unload) == null ? void 0 : h.call(a, c, n, this));
      }
    });
    await Promise.all(i);
  }
  /** validates our parsers, right now it only checks for name conflicts but we can add more here as required! */
  _validateParsers() {
    this._parsersValidated = !0, this._parserHash = this._parsers.filter((t) => t.name).reduce((t, e) => (e.name ? t[e.name] && ut(`[Assets] loadParser name conflict "${e.name}"`) : ut("[Assets] loadParser should have a name"), { ...t, [e.name]: e }), {});
  }
}
function Wi(s, t) {
  if (Array.isArray(t)) {
    for (const e of t)
      if (s.startsWith(`data:${e}`))
        return !0;
    return !1;
  }
  return s.startsWith(`data:${t}`);
}
function Gi(s, t) {
  const e = s.split("?")[0], i = St.extname(e).toLowerCase();
  return Array.isArray(t) ? t.includes(i) : i === t;
}
const Tg = ".json", kg = "application/json", Eg = {
  extension: {
    type: D.LoadParser,
    priority: Ie.Low
  },
  name: "loadJson",
  test(s) {
    return Wi(s, kg) || Gi(s, Tg);
  },
  async load(s) {
    return await (await ot.get().fetch(s)).json();
  }
}, Ig = ".txt", Bg = "text/plain", Rg = {
  name: "loadTxt",
  extension: {
    type: D.LoadParser,
    priority: Ie.Low,
    name: "loadTxt"
  },
  test(s) {
    return Wi(s, Bg) || Gi(s, Ig);
  },
  async load(s) {
    return await (await ot.get().fetch(s)).text();
  }
}, Fg = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900"
], Lg = [".ttf", ".otf", ".woff", ".woff2"], Og = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2"
], Dg = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function zg(s) {
  const t = St.extname(s), n = St.basename(s, t).replace(/(-|_)/g, " ").toLowerCase().split(" ").map((a) => a.charAt(0).toUpperCase() + a.slice(1));
  let r = n.length > 0;
  for (const a of n)
    if (!a.match(Dg)) {
      r = !1;
      break;
    }
  let o = n.join(" ");
  return r || (o = `"${o.replace(/[\\"]/g, "\\$&")}"`), o;
}
const Ug = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;
function Wg(s) {
  return Ug.test(s) ? s : encodeURI(s);
}
const Gg = {
  extension: {
    type: D.LoadParser,
    priority: Ie.Low
  },
  name: "loadWebFont",
  test(s) {
    return Wi(s, Og) || Gi(s, Lg);
  },
  async load(s, t) {
    var i, n, r;
    const e = ot.get().getFontFaceSet();
    if (e) {
      const o = [], a = ((i = t.data) == null ? void 0 : i.family) ?? zg(s), h = ((r = (n = t.data) == null ? void 0 : n.weights) == null ? void 0 : r.filter((l) => Fg.includes(l))) ?? ["normal"], c = t.data ?? {};
      for (let l = 0; l < h.length; l++) {
        const d = h[l], f = new FontFace(a, `url(${Wg(s)})`, {
          ...c,
          weight: d
        });
        await f.load(), e.add(f), o.push(f);
      }
      return st.set(`${a}-and-url`, {
        url: s,
        fontFaces: o
      }), o.length === 1 ? o[0] : o;
    }
    return ut("[loadWebFont] FontFace API is not supported. Skipping loading font"), null;
  },
  unload(s) {
    (Array.isArray(s) ? s : [s]).forEach((t) => {
      st.remove(t.family), ot.get().getFontFaceSet().delete(t);
    });
  }
};
function Co(s, t = 1) {
  var i;
  const e = (i = Ui.RETINA_PREFIX) == null ? void 0 : i.exec(s);
  return e ? parseFloat(e[1]) : t;
}
function Po(s, t, e) {
  s.label = e, s._sourceOrigin = e;
  const i = new G({
    source: s,
    label: e
  }), n = () => {
    delete t.promiseCache[e], st.has(e) && st.remove(e);
  };
  return i.source.once("destroy", () => {
    t.promiseCache[e] && (ut("[Assets] A TextureSource managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the TextureSource."), n());
  }), i.once("destroy", () => {
    s.destroyed || (ut("[Assets] A Texture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the Texture."), n());
  }), i;
}
const Vg = ".svg", Ng = "image/svg+xml", Hg = {
  extension: {
    type: D.LoadParser,
    priority: Ie.Low,
    name: "loadSVG"
  },
  name: "loadSVG",
  config: {
    crossOrigin: "anonymous",
    parseAsGraphicsContext: !1
  },
  test(s) {
    return Wi(s, Ng) || Gi(s, Vg);
  },
  async load(s, t, e) {
    return t.data.parseAsGraphicsContext ?? this.config.parseAsGraphicsContext ? jg(s) : $g(s, t, e, this.config.crossOrigin);
  },
  unload(s) {
    s.destroy(!0);
  }
};
async function $g(s, t, e, i) {
  var m, x, y;
  const r = await (await ot.get().fetch(s)).blob(), o = URL.createObjectURL(r), a = new Image();
  a.src = o, a.crossOrigin = i, await a.decode(), URL.revokeObjectURL(o);
  const h = document.createElement("canvas"), c = h.getContext("2d"), l = ((m = t.data) == null ? void 0 : m.resolution) || Co(s), d = ((x = t.data) == null ? void 0 : x.width) ?? a.width, f = ((y = t.data) == null ? void 0 : y.height) ?? a.height;
  h.width = d * l, h.height = f * l, c.drawImage(a, 0, 0, d * l, f * l);
  const { parseAsGraphicsContext: u, ...g } = t.data, p = new zi({
    resource: h,
    alphaMode: "premultiply-alpha-on-upload",
    resolution: l,
    ...g
  });
  return Po(p, e, s);
}
async function jg(s) {
  const e = await (await ot.get().fetch(s)).text(), i = new Kt();
  return i.svg(e), i;
}
const Yg = `(function () {
    'use strict';

    const WHITE_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
    async function checkImageBitmap() {
      try {
        if (typeof createImageBitmap !== "function")
          return false;
        const response = await fetch(WHITE_PNG);
        const imageBlob = await response.blob();
        const imageBitmap = await createImageBitmap(imageBlob);
        return imageBitmap.width === 1 && imageBitmap.height === 1;
      } catch (e) {
        return false;
      }
    }
    void checkImageBitmap().then((result) => {
      self.postMessage(result);
    });

})();
`;
let Ci = null, jr = class {
  constructor() {
    Ci || (Ci = URL.createObjectURL(new Blob([Yg], { type: "application/javascript" }))), this.worker = new Worker(Ci);
  }
};
jr.revokeObjectURL = function() {
  Ci && (URL.revokeObjectURL(Ci), Ci = null);
};
const Xg = `(function () {
    'use strict';

    async function loadImageBitmap(url, alphaMode) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(\`[WorkerManager.loadImageBitmap] Failed to fetch \${url}: \${response.status} \${response.statusText}\`);
      }
      const imageBlob = await response.blob();
      return alphaMode === "premultiplied-alpha" ? createImageBitmap(imageBlob, { premultiplyAlpha: "none" }) : createImageBitmap(imageBlob);
    }
    self.onmessage = async (event) => {
      try {
        const imageBitmap = await loadImageBitmap(event.data.data[0], event.data.data[1]);
        self.postMessage({
          data: imageBitmap,
          uuid: event.data.uuid,
          id: event.data.id
        }, [imageBitmap]);
      } catch (e) {
        self.postMessage({
          error: e,
          uuid: event.data.uuid,
          id: event.data.id
        });
      }
    };

})();
`;
let Pi = null;
class Ql {
  constructor() {
    Pi || (Pi = URL.createObjectURL(new Blob([Xg], { type: "application/javascript" }))), this.worker = new Worker(Pi);
  }
}
Ql.revokeObjectURL = function() {
  Pi && (URL.revokeObjectURL(Pi), Pi = null);
};
let oh = 0, fr;
class Kg {
  constructor() {
    this._initialized = !1, this._createdWorkers = 0, this._workerPool = [], this._queue = [], this._resolveHash = {};
  }
  isImageBitmapSupported() {
    return this._isImageBitmapSupported !== void 0 ? this._isImageBitmapSupported : (this._isImageBitmapSupported = new Promise((t) => {
      const { worker: e } = new jr();
      e.addEventListener("message", (i) => {
        e.terminate(), jr.revokeObjectURL(), t(i.data);
      });
    }), this._isImageBitmapSupported);
  }
  loadImageBitmap(t, e) {
    var i;
    return this._run("loadImageBitmap", [t, (i = e == null ? void 0 : e.data) == null ? void 0 : i.alphaMode]);
  }
  async _initWorkers() {
    this._initialized || (this._initialized = !0);
  }
  _getWorker() {
    fr === void 0 && (fr = navigator.hardwareConcurrency || 4);
    let t = this._workerPool.pop();
    return !t && this._createdWorkers < fr && (this._createdWorkers++, t = new Ql().worker, t.addEventListener("message", (e) => {
      this._complete(e.data), this._returnWorker(e.target), this._next();
    })), t;
  }
  _returnWorker(t) {
    this._workerPool.push(t);
  }
  _complete(t) {
    t.error !== void 0 ? this._resolveHash[t.uuid].reject(t.error) : this._resolveHash[t.uuid].resolve(t.data), this._resolveHash[t.uuid] = null;
  }
  async _run(t, e) {
    await this._initWorkers();
    const i = new Promise((n, r) => {
      this._queue.push({ id: t, arguments: e, resolve: n, reject: r });
    });
    return this._next(), i;
  }
  _next() {
    if (!this._queue.length)
      return;
    const t = this._getWorker();
    if (!t)
      return;
    const e = this._queue.pop(), i = e.id;
    this._resolveHash[oh] = { resolve: e.resolve, reject: e.reject }, t.postMessage({
      data: e.arguments,
      uuid: oh++,
      id: i
    });
  }
}
const ah = new Kg(), qg = [".jpeg", ".jpg", ".png", ".webp", ".avif"], Zg = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
async function Qg(s, t) {
  var n;
  const e = await ot.get().fetch(s);
  if (!e.ok)
    throw new Error(`[loadImageBitmap] Failed to fetch ${s}: ${e.status} ${e.statusText}`);
  const i = await e.blob();
  return ((n = t == null ? void 0 : t.data) == null ? void 0 : n.alphaMode) === "premultiplied-alpha" ? createImageBitmap(i, { premultiplyAlpha: "none" }) : createImageBitmap(i);
}
const Jl = {
  name: "loadTextures",
  extension: {
    type: D.LoadParser,
    priority: Ie.High,
    name: "loadTextures"
  },
  config: {
    preferWorkers: !0,
    preferCreateImageBitmap: !0,
    crossOrigin: "anonymous"
  },
  test(s) {
    return Wi(s, Zg) || Gi(s, qg);
  },
  async load(s, t, e) {
    var r;
    let i = null;
    globalThis.createImageBitmap && this.config.preferCreateImageBitmap ? this.config.preferWorkers && await ah.isImageBitmapSupported() ? i = await ah.loadImageBitmap(s, t) : i = await Qg(s, t) : i = await new Promise((o) => {
      i = new Image(), i.crossOrigin = this.config.crossOrigin, i.src = s, i.complete ? o(i) : i.onload = () => {
        o(i);
      };
    });
    const n = new zi({
      resource: i,
      alphaMode: "premultiply-alpha-on-upload",
      resolution: ((r = t.data) == null ? void 0 : r.resolution) || Co(s),
      ...t.data
    });
    return Po(n, e, s);
  },
  unload(s) {
    s.destroy(!0);
  }
}, tc = [".mp4", ".m4v", ".webm", ".ogg", ".ogv", ".h264", ".avi", ".mov"], Jg = tc.map((s) => `video/${s.substring(1)}`);
function tm(s, t, e) {
  e === void 0 && !t.startsWith("data:") ? s.crossOrigin = im(t) : e !== !1 && (s.crossOrigin = typeof e == "string" ? e : "anonymous");
}
function em(s) {
  return new Promise((t, e) => {
    s.addEventListener("canplaythrough", i), s.addEventListener("error", n), s.load();
    function i() {
      r(), t();
    }
    function n(o) {
      r(), e(o);
    }
    function r() {
      s.removeEventListener("canplaythrough", i), s.removeEventListener("error", n);
    }
  });
}
function im(s, t = globalThis.location) {
  if (s.startsWith("data:"))
    return "";
  t = t || globalThis.location;
  const e = new URL(s, document.baseURI);
  return e.hostname !== t.hostname || e.port !== t.port || e.protocol !== t.protocol ? "anonymous" : "";
}
const sm = {
  name: "loadVideo",
  extension: {
    type: D.LoadParser,
    name: "loadVideo"
  },
  test(s) {
    const t = Wi(s, Jg), e = Gi(s, tc);
    return t || e;
  },
  async load(s, t, e) {
    var h, c;
    const i = {
      ...Xs.defaultOptions,
      resolution: ((h = t.data) == null ? void 0 : h.resolution) || Co(s),
      alphaMode: ((c = t.data) == null ? void 0 : c.alphaMode) || await sl(),
      ...t.data
    }, n = document.createElement("video"), r = {
      preload: i.autoLoad !== !1 ? "auto" : void 0,
      "webkit-playsinline": i.playsinline !== !1 ? "" : void 0,
      playsinline: i.playsinline !== !1 ? "" : void 0,
      muted: i.muted === !0 ? "" : void 0,
      loop: i.loop === !0 ? "" : void 0,
      autoplay: i.autoPlay !== !1 ? "" : void 0
    };
    Object.keys(r).forEach((l) => {
      const d = r[l];
      d !== void 0 && n.setAttribute(l, d);
    }), i.muted === !0 && (n.muted = !0), tm(n, s, i.crossorigin);
    const o = document.createElement("source");
    let a;
    if (s.startsWith("data:"))
      a = s.slice(5, s.indexOf(";"));
    else if (!s.startsWith("blob:")) {
      const l = s.split("?")[0].slice(s.lastIndexOf(".") + 1).toLowerCase();
      a = Xs.MIME_TYPES[l] || `video/${l}`;
    }
    return o.src = s, a && (o.type = a), new Promise((l) => {
      const d = async () => {
        const f = new Xs({ ...i, resource: n });
        n.removeEventListener("canplay", d), t.data.preload && await em(n), l(Po(f, e, s));
      };
      n.addEventListener("canplay", d), n.appendChild(o);
    });
  },
  unload(s) {
    s.destroy(!0);
  }
}, ec = {
  extension: {
    type: D.ResolveParser,
    name: "resolveTexture"
  },
  test: Jl.test,
  parse: (s) => {
    var t;
    return {
      resolution: parseFloat(((t = Ui.RETINA_PREFIX.exec(s)) == null ? void 0 : t[1]) ?? "1"),
      format: s.split(".").pop(),
      src: s
    };
  }
}, nm = {
  extension: {
    type: D.ResolveParser,
    priority: -2,
    name: "resolveJson"
  },
  test: (s) => Ui.RETINA_PREFIX.test(s) && s.endsWith(".json"),
  parse: ec.parse
};
class rm {
  constructor() {
    this._detections = [], this._initialized = !1, this.resolver = new Ui(), this.loader = new Mg(), this.cache = st, this._backgroundLoader = new xg(this.loader), this._backgroundLoader.active = !0, this.reset();
  }
  /**
   * Best practice is to call this function before any loading commences
   * Initiating is the best time to add any customization to the way things are loaded.
   *
   * you do not need to call this for the Assets class to work, only if you want to set any initial properties
   * @param options - options to initialize the Assets manager with
   */
  async init(t = {}) {
    var r, o;
    if (this._initialized) {
      ut("[Assets]AssetManager already initialized, did you load before calling this Assets.init()?");
      return;
    }
    if (this._initialized = !0, t.defaultSearchParams && this.resolver.setDefaultSearchParams(t.defaultSearchParams), t.basePath && (this.resolver.basePath = t.basePath), t.bundleIdentifier && this.resolver.setBundleIdentifier(t.bundleIdentifier), t.manifest) {
      let a = t.manifest;
      typeof a == "string" && (a = await this.load(a)), this.resolver.addManifest(a);
    }
    const e = ((r = t.texturePreference) == null ? void 0 : r.resolution) ?? 1, i = typeof e == "number" ? [e] : e, n = await this._detectFormats({
      preferredFormats: (o = t.texturePreference) == null ? void 0 : o.format,
      skipDetections: t.skipDetections,
      detections: this._detections
    });
    this.resolver.prefer({
      params: {
        format: n,
        resolution: i
      }
    }), t.preferences && this.setPreferences(t.preferences);
  }
  /**
   * Allows you to specify how to resolve any assets load requests.
   * There are a few ways to add things here as shown below:
   * @example
   * import { Assets } from 'pixi.js';
   *
   * // Simple
   * Assets.add({alias: 'bunnyBooBoo', src: 'bunny.png'});
   * const bunny = await Assets.load('bunnyBooBoo');
   *
   * // Multiple keys:
   * Assets.add({alias: ['burger', 'chicken'], src: 'bunny.png'});
   *
   * const bunny = await Assets.load('burger');
   * const bunny2 = await Assets.load('chicken');
   *
   * // passing options to to the object
   * Assets.add({
   *     alias: 'bunnyBooBooSmooth',
   *     src: 'bunny{png,webp}',
   *     data: { scaleMode: SCALE_MODES.NEAREST }, // Base texture options
   * });
   *
   * // Multiple assets
   *
   * // The following all do the same thing:
   *
   * Assets.add({alias: 'bunnyBooBoo', src: 'bunny{png,webp}'});
   *
   * Assets.add({
   *     alias: 'bunnyBooBoo',
   *     src: [
   *         'bunny.png',
   *         'bunny.webp',
   *    ],
   * });
   *
   * const bunny = await Assets.load('bunnyBooBoo'); // Will try to load WebP if available
   * @param assets - the unresolved assets to add to the resolver
   */
  add(t) {
    this.resolver.add(t);
  }
  async load(t, e) {
    this._initialized || await this.init();
    const i = nn(t), n = ne(t).map((a) => {
      if (typeof a != "string") {
        const h = this.resolver.getAlias(a);
        return h.some((c) => !this.resolver.hasKey(c)) && this.add(a), Array.isArray(h) ? h[0] : h;
      }
      return this.resolver.hasKey(a) || this.add({ alias: a, src: a }), a;
    }), r = this.resolver.resolve(n), o = await this._mapLoadToResolve(r, e);
    return i ? o[n[0]] : o;
  }
  /**
   * This adds a bundle of assets in one go so that you can load them as a group.
   * For example you could add a bundle for each screen in you pixi app
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.addBundle('animals', [
   *  { alias: 'bunny', src: 'bunny.png' },
   *  { alias: 'chicken', src: 'chicken.png' },
   *  { alias: 'thumper', src: 'thumper.png' },
   * ]);
   * // or
   * Assets.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * const assets = await Assets.loadBundle('animals');
   * @param bundleId - the id of the bundle to add
   * @param assets - a record of the asset or assets that will be chosen from when loading via the specified key
   */
  addBundle(t, e) {
    this.resolver.addBundle(t, e);
  }
  /**
   * Bundles are a way to load multiple assets at once.
   * If a manifest has been provided to the init function then you can load a bundle, or bundles.
   * you can also add bundles via `addBundle`
   * @example
   * import { Assets } from 'pixi.js';
   *
   * // Manifest Example
   * const manifest = {
   *     bundles: [
   *         {
   *             name: 'load-screen',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'sunset.png',
   *                 },
   *                 {
   *                     alias: 'bar',
   *                     src: 'load-bar.{png,webp}',
   *                 },
   *             ],
   *         },
   *         {
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'character',
   *                     src: 'robot.png',
   *                 },
   *                 {
   *                     alias: 'enemy',
   *                     src: 'bad-guy.png',
   *                 },
   *             ],
   *         },
   *     ]
   * };
   *
   * await Assets.init({ manifest });
   *
   * // Load a bundle...
   * loadScreenAssets = await Assets.loadBundle('load-screen');
   * // Load another bundle...
   * gameScreenAssets = await Assets.loadBundle('game-screen');
   * @param bundleIds - the bundle id or ids to load
   * @param onProgress - Optional function that is called when progress on asset loading is made.
   * The function is passed a single parameter, `progress`, which represents the percentage (0.0 - 1.0)
   * of the assets loaded. Do not use this function to detect when assets are complete and available,
   * instead use the Promise returned by this function.
   * @returns all the bundles assets or a hash of assets for each bundle specified
   */
  async loadBundle(t, e) {
    this._initialized || await this.init();
    let i = !1;
    typeof t == "string" && (i = !0, t = [t]);
    const n = this.resolver.resolveBundle(t), r = {}, o = Object.keys(n);
    let a = 0, h = 0;
    const c = () => {
      e == null || e(++a / h);
    }, l = o.map((d) => {
      const f = n[d];
      return h += Object.keys(f).length, this._mapLoadToResolve(f, c).then((u) => {
        r[d] = u;
      });
    });
    return await Promise.all(l), i ? r[t[0]] : r;
  }
  /**
   * Initiate a background load of some assets. It will passively begin to load these assets in the background.
   * So when you actually come to loading them you will get a promise that resolves to the loaded assets immediately
   *
   * An example of this might be that you would background load game assets after your initial load.
   * then when you got to actually load your game screen assets when a player goes to the game - the loading
   * would already have stared or may even be complete, saving you having to show an interim load bar.
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.backgroundLoad('bunny.png');
   *
   * // later on in your app...
   * await Assets.loadBundle('bunny.png'); // Will resolve quicker as loading may have completed!
   * @param urls - the url / urls you want to background load
   */
  async backgroundLoad(t) {
    this._initialized || await this.init(), typeof t == "string" && (t = [t]);
    const e = this.resolver.resolve(t);
    this._backgroundLoader.add(Object.values(e));
  }
  /**
   * Initiate a background of a bundle, works exactly like backgroundLoad but for bundles.
   * this can only be used if the loader has been initiated with a manifest
   * @example
   * import { Assets } from 'pixi.js';
   *
   * await Assets.init({
   *     manifest: {
   *         bundles: [
   *             {
   *                 name: 'load-screen',
   *                 assets: [...],
   *             },
   *             ...
   *         ],
   *     },
   * });
   *
   * Assets.backgroundLoadBundle('load-screen');
   *
   * // Later on in your app...
   * await Assets.loadBundle('load-screen'); // Will resolve quicker as loading may have completed!
   * @param bundleIds - the bundleId / bundleIds you want to background load
   */
  async backgroundLoadBundle(t) {
    this._initialized || await this.init(), typeof t == "string" && (t = [t]);
    const e = this.resolver.resolveBundle(t);
    Object.values(e).forEach((i) => {
      this._backgroundLoader.add(Object.values(i));
    });
  }
  /**
   * Only intended for development purposes.
   * This will wipe the resolver and caches.
   * You will need to reinitialize the Asset
   */
  reset() {
    this.resolver.reset(), this.loader.reset(), this.cache.reset(), this._initialized = !1;
  }
  get(t) {
    if (typeof t == "string")
      return st.get(t);
    const e = {};
    for (let i = 0; i < t.length; i++)
      e[i] = st.get(t[i]);
    return e;
  }
  /**
   * helper function to map resolved assets back to loaded assets
   * @param resolveResults - the resolve results from the resolver
   * @param onProgress - the progress callback
   */
  async _mapLoadToResolve(t, e) {
    const i = [...new Set(Object.values(t))];
    this._backgroundLoader.active = !1;
    const n = await this.loader.load(i, e);
    this._backgroundLoader.active = !0;
    const r = {};
    return i.forEach((o) => {
      const a = n[o.src], h = [o.src];
      o.alias && h.push(...o.alias), h.forEach((c) => {
        r[c] = a;
      }), st.set(h, a);
    }), r;
  }
  /**
   * Unload an asset or assets. As the Assets class is responsible for creating the assets via the `load` function
   * this will make sure to destroy any assets and release them from memory.
   * Once unloaded, you will need to load the asset again.
   *
   * Use this to help manage assets if you find that you have a large app and you want to free up memory.
   *
   * - it's up to you as the developer to make sure that textures are not actively being used when you unload them,
   * Pixi won't break but you will end up with missing assets. Not a good look for the user!
   * @example
   * import { Assets } from 'pixi.js';
   *
   * // Load a URL:
   * const myImageTexture = await Assets.load('http://some.url.com/image.png'); // => returns a texture
   *
   * await Assets.unload('http://some.url.com/image.png')
   *
   * // myImageTexture will be destroyed now.
   *
   * // Unload multiple assets:
   * const textures = await Assets.unload(['thumper', 'chicko']);
   * @param urls - the urls to unload
   */
  async unload(t) {
    this._initialized || await this.init();
    const e = ne(t).map((n) => typeof n != "string" ? n.src : n), i = this.resolver.resolve(e);
    await this._unloadFromResolved(i);
  }
  /**
   * Bundles are a way to manage multiple assets at once.
   * this will unload all files in a bundle.
   *
   * once a bundle has been unloaded, you need to load it again to have access to the assets.
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.addBundle({
   *     'thumper': 'http://some.url.com/thumper.png',
   * })
   *
   * const assets = await Assets.loadBundle('thumper');
   *
   * // Now to unload...
   *
   * await Assets.unloadBundle('thumper');
   *
   * // All assets in the assets object will now have been destroyed and purged from the cache
   * @param bundleIds - the bundle id or ids to unload
   */
  async unloadBundle(t) {
    this._initialized || await this.init(), t = ne(t);
    const e = this.resolver.resolveBundle(t), i = Object.keys(e).map((n) => this._unloadFromResolved(e[n]));
    await Promise.all(i);
  }
  async _unloadFromResolved(t) {
    const e = Object.values(t);
    e.forEach((i) => {
      st.remove(i.src);
    }), await this.loader.unload(e);
  }
  /**
   * Detects the supported formats for the browser, and returns an array of supported formats, respecting
   * the users preferred formats order.
   * @param options - the options to use when detecting formats
   * @param options.preferredFormats - the preferred formats to use
   * @param options.skipDetections - if we should skip the detections altogether
   * @param options.detections - the detections to use
   * @returns - the detected formats
   */
  async _detectFormats(t) {
    let e = [];
    t.preferredFormats && (e = Array.isArray(t.preferredFormats) ? t.preferredFormats : [t.preferredFormats]);
    for (const i of t.detections)
      t.skipDetections || await i.test() ? e = await i.add(e) : t.skipDetections || (e = await i.remove(e));
    return e = e.filter((i, n) => e.indexOf(i) === n), e;
  }
  /** All the detection parsers currently added to the Assets class. */
  get detections() {
    return this._detections;
  }
  /**
   * General setter for preferences. This is a helper function to set preferences on all parsers.
   * @param preferences - the preferences to set
   */
  setPreferences(t) {
    this.loader.parsers.forEach((e) => {
      e.config && Object.keys(e.config).filter((i) => i in t).forEach((i) => {
        e.config[i] = t[i];
      });
    });
  }
}
const ge = new rm();
Pt.handleByList(D.LoadParser, ge.loader.parsers).handleByList(D.ResolveParser, ge.resolver.parsers).handleByList(D.CacheParser, ge.cache.parsers).handleByList(D.DetectionParser, ge.detections);
Pt.add(
  yg,
  bg,
  vg,
  Pg,
  Sg,
  Ag,
  Cg,
  Eg,
  Rg,
  Gg,
  Hg,
  Jl,
  sm,
  _g,
  mg,
  ec,
  nm
);
const hh = {
  loader: D.LoadParser,
  resolver: D.ResolveParser,
  cache: D.CacheParser,
  detection: D.DetectionParser
};
Pt.handle(D.Asset, (s) => {
  const t = s.ref;
  Object.entries(hh).filter(([e]) => !!t[e]).forEach(([e, i]) => Pt.add(Object.assign(
    t[e],
    // Allow the function to optionally define it's own
    // ExtensionMetadata, the use cases here is priority for LoaderParsers
    { extension: t[e].extension ?? i }
  )));
}, (s) => {
  const t = s.ref;
  Object.keys(hh).filter((e) => !!t[e]).forEach((e) => Pt.remove(t[e]));
});
class Fe extends Ps {
  /**
   * @param options - Options for the Graphics.
   */
  constructor(t) {
    t instanceof Kt && (t = { context: t });
    const { context: e, roundPixels: i, ...n } = t || {};
    super({
      label: "Graphics",
      ...n
    }), this.renderPipeId = "graphics", e ? this._context = e : this._context = this._ownedContext = new Kt(), this._context.on("update", this.onViewUpdate, this), this.allowChildren = !1, this.roundPixels = i ?? !1;
  }
  set context(t) {
    t !== this._context && (this._context.off("update", this.onViewUpdate, this), this._context = t, this._context.on("update", this.onViewUpdate, this), this.onViewUpdate());
  }
  get context() {
    return this._context;
  }
  /**
   * The local bounds of the graphic.
   * @type {rendering.Bounds}
   */
  get bounds() {
    return this._context.bounds;
  }
  /**
   * Adds the bounds of this object to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(t) {
    t.addBounds(this._context.bounds);
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(t) {
    return this._context.containsPoint(t);
  }
  /**
   * Destroys this graphics renderable and optionally its context.
   * @param options - Options parameter. A boolean will act as if all options
   *
   * If the context was created by this graphics and `destroy(false)` or `destroy()` is called
   * then the context will still be destroyed.
   *
   * If you want to explicitly not destroy this context that this graphics created,
   * then you should pass destroy({ context: false })
   *
   * If the context was passed in as an argument to the constructor then it will not be destroyed
   * @param {boolean} [options.texture=false] - Should destroy the texture of the graphics context
   * @param {boolean} [options.textureSource=false] - Should destroy the texture source of the graphics context
   * @param {boolean} [options.context=false] - Should destroy the context
   */
  destroy(t) {
    this._ownedContext && !t ? this._ownedContext.destroy(t) : (t === !0 || (t == null ? void 0 : t.context) === !0) && this._context.destroy(t), this._ownedContext = null, this._context = null, super.destroy(t);
  }
  _callContextMethod(t, e) {
    return this.context[t](...e), this;
  }
  // --------------------------------------- GraphicsContext methods ---------------------------------------
  /**
   * Sets the current fill style of the graphics context. The fill style can be a color, gradient,
   * pattern, or a more complex style defined by a FillStyle object.
   * @param {FillInput} args - The fill style to apply. This can be a simple color, a gradient or
   * pattern object, or a FillStyle or ConvertedFillStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setFillStyle(...t) {
    return this._callContextMethod("setFillStyle", t);
  }
  /**
   * Sets the current stroke style of the graphics context. Similar to fill styles, stroke styles can
   * encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   * @param {StrokeInput} args - The stroke style to apply. Can be defined as a color, a gradient or pattern,
   * or a StrokeStyle or ConvertedStrokeStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setStrokeStyle(...t) {
    return this._callContextMethod("setStrokeStyle", t);
  }
  fill(...t) {
    return this._callContextMethod("fill", t);
  }
  /**
   * Strokes the current path with the current stroke style. This method can take an optional
   * FillStyle parameter to define the stroke's appearance, including its color, width, and other properties.
   * @param {FillStyle} args - (Optional) The stroke style to apply. Can be defined as a simple color or a more
   * complex style object. If omitted, uses the current stroke style.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  stroke(...t) {
    return this._callContextMethod("stroke", t);
  }
  texture(...t) {
    return this._callContextMethod("texture", t);
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  beginPath() {
    return this._callContextMethod("beginPath", []);
  }
  /**
   * Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
   * subtracting a path from the previously drawn path. If a hole is not completely in a shape, it will
   * fail to cut correctly!
   */
  cut() {
    return this._callContextMethod("cut", []);
  }
  arc(...t) {
    return this._callContextMethod("arc", t);
  }
  arcTo(...t) {
    return this._callContextMethod("arcTo", t);
  }
  arcToSvg(...t) {
    return this._callContextMethod("arcToSvg", t);
  }
  bezierCurveTo(...t) {
    return this._callContextMethod("bezierCurveTo", t);
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this._callContextMethod("closePath", []);
  }
  ellipse(...t) {
    return this._callContextMethod("ellipse", t);
  }
  circle(...t) {
    return this._callContextMethod("circle", t);
  }
  path(...t) {
    return this._callContextMethod("path", t);
  }
  lineTo(...t) {
    return this._callContextMethod("lineTo", t);
  }
  moveTo(...t) {
    return this._callContextMethod("moveTo", t);
  }
  quadraticCurveTo(...t) {
    return this._callContextMethod("quadraticCurveTo", t);
  }
  rect(...t) {
    return this._callContextMethod("rect", t);
  }
  roundRect(...t) {
    return this._callContextMethod("roundRect", t);
  }
  poly(...t) {
    return this._callContextMethod("poly", t);
  }
  regularPoly(...t) {
    return this._callContextMethod("regularPoly", t);
  }
  roundPoly(...t) {
    return this._callContextMethod("roundPoly", t);
  }
  roundShape(...t) {
    return this._callContextMethod("roundShape", t);
  }
  filletRect(...t) {
    return this._callContextMethod("filletRect", t);
  }
  chamferRect(...t) {
    return this._callContextMethod("chamferRect", t);
  }
  star(...t) {
    return this._callContextMethod("star", t);
  }
  svg(...t) {
    return this._callContextMethod("svg", t);
  }
  restore(...t) {
    return this._callContextMethod("restore", t);
  }
  /** Saves the current graphics state, including transformations, fill styles, and stroke styles, onto a stack. */
  save() {
    return this._callContextMethod("save", []);
  }
  /**
   * Returns the current transformation matrix of the graphics context.
   * @returns The current transformation matrix.
   */
  getTransform() {
    return this.context.getTransform();
  }
  /**
   * Resets the current transformation matrix to the identity matrix, effectively removing
   * any transformations (rotation, scaling, translation) previously applied.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  resetTransform() {
    return this._callContextMethod("resetTransform", []);
  }
  rotateTransform(...t) {
    return this._callContextMethod("rotate", t);
  }
  scaleTransform(...t) {
    return this._callContextMethod("scale", t);
  }
  setTransform(...t) {
    return this._callContextMethod("setTransform", t);
  }
  transform(...t) {
    return this._callContextMethod("transform", t);
  }
  translateTransform(...t) {
    return this._callContextMethod("translate", t);
  }
  /**
   * Clears all drawing commands from the graphics context, effectively resetting it. This includes clearing the path,
   * and optionally resetting transformations to the identity matrix.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  clear() {
    return this._callContextMethod("clear", []);
  }
  /**
   * The fill style to use.
   * @type {ConvertedFillStyle}
   */
  get fillStyle() {
    return this._context.fillStyle;
  }
  set fillStyle(t) {
    this._context.fillStyle = t;
  }
  /**
   * The stroke style to use.
   * @type {ConvertedStrokeStyle}
   */
  get strokeStyle() {
    return this._context.strokeStyle;
  }
  set strokeStyle(t) {
    this._context.strokeStyle = t;
  }
  /**
   * Creates a new Graphics object.
   * Note that only the context of the object is cloned, not its transform (position,scale,etc)
   * @param deep - Whether to create a deep clone of the graphics object. If false, the context
   * will be shared between the two objects (default false). If true, the context will be
   * cloned (recommended if you need to modify the context in any way).
   * @returns - A clone of the graphics object
   */
  clone(t = !1) {
    return t ? new Fe(this._context.clone()) : (this._ownedContext = null, new Fe(this._context));
  }
  // -------- v7 deprecations ---------
  /**
   * @param width
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#setStrokeStyle} instead
   */
  lineStyle(t, e, i) {
    H($, "Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");
    const n = {};
    return t && (n.width = t), e && (n.color = e), i && (n.alpha = i), this.context.strokeStyle = n, this;
  }
  /**
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  beginFill(t, e) {
    H($, "Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");
    const i = {};
    return t && (i.color = t), e && (i.alpha = e), this.context.fillStyle = i, this;
  }
  /**
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  endFill() {
    H($, "Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style."), this.context.fill();
    const t = this.context.strokeStyle;
    return (t.width !== Kt.defaultStrokeStyle.width || t.color !== Kt.defaultStrokeStyle.color || t.alpha !== Kt.defaultStrokeStyle.alpha) && this.context.stroke(), this;
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#circle} instead
   */
  drawCircle(...t) {
    return H($, "Graphics#drawCircle has been renamed to Graphics#circle"), this._callContextMethod("circle", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#ellipse} instead
   */
  drawEllipse(...t) {
    return H($, "Graphics#drawEllipse has been renamed to Graphics#ellipse"), this._callContextMethod("ellipse", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#poly} instead
   */
  drawPolygon(...t) {
    return H($, "Graphics#drawPolygon has been renamed to Graphics#poly"), this._callContextMethod("poly", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#rect} instead
   */
  drawRect(...t) {
    return H($, "Graphics#drawRect has been renamed to Graphics#rect"), this._callContextMethod("rect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#roundRect} instead
   */
  drawRoundedRect(...t) {
    return H($, "Graphics#drawRoundedRect has been renamed to Graphics#roundRect"), this._callContextMethod("roundRect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#star} instead
   */
  drawStar(...t) {
    return H($, "Graphics#drawStar has been renamed to Graphics#star"), this._callContextMethod("star", t);
  }
}
const ic = class sc extends Fl {
  constructor(...t) {
    let e = t[0] ?? {};
    e instanceof Float32Array && (H($, "use new MeshGeometry({ positions, uvs, indices }) instead"), e = {
      positions: e,
      uvs: t[1],
      indices: t[2]
    }), e = { ...sc.defaultOptions, ...e };
    const i = e.positions || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), n = e.uvs || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), r = e.indices || new Uint32Array([0, 1, 2, 0, 2, 3]), o = e.shrinkBuffersToFit, a = new ze({
      data: i,
      label: "attribute-mesh-positions",
      shrinkToFit: o,
      usage: ft.VERTEX | ft.COPY_DST
    }), h = new ze({
      data: n,
      label: "attribute-mesh-uvs",
      shrinkToFit: o,
      usage: ft.VERTEX | ft.COPY_DST
    }), c = new ze({
      data: r,
      label: "index-mesh-buffer",
      shrinkToFit: o,
      usage: ft.INDEX | ft.COPY_DST
    });
    super({
      attributes: {
        aPosition: {
          buffer: a,
          format: "float32x2",
          stride: 2 * 4,
          offset: 0
        },
        aUV: {
          buffer: h,
          format: "float32x2",
          stride: 2 * 4,
          offset: 0
        }
      },
      indexBuffer: c,
      topology: e.topology
    }), this.batchMode = "auto";
  }
  /** The positions of the mesh. */
  get positions() {
    return this.attributes.aPosition.buffer.data;
  }
  set positions(t) {
    this.attributes.aPosition.buffer.data = t;
  }
  /** The UVs of the mesh. */
  get uvs() {
    return this.attributes.aUV.buffer.data;
  }
  set uvs(t) {
    this.attributes.aUV.buffer.data = t;
  }
  /** The indices of the mesh. */
  get indices() {
    return this.indexBuffer.data;
  }
  set indices(t) {
    this.indexBuffer.data = t;
  }
};
ic.defaultOptions = {
  topology: "triangle-list",
  shrinkBuffersToFit: !1
};
let om = ic;
class am {
  /**
   * @param options - Options for the transform.
   * @param options.matrix - The matrix to use.
   * @param options.observer - The observer to use.
   */
  constructor({ matrix: t, observer: e } = {}) {
    this.dirty = !0, this._matrix = t ?? new j(), this.observer = e, this.position = new _t(this, 0, 0), this.scale = new _t(this, 1, 1), this.pivot = new _t(this, 0, 0), this.skew = new _t(this, 0, 0), this._rotation = 0, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1;
  }
  /**
   * This matrix is computed by combining this Transforms position, scale, rotation, skew, and pivot
   * properties into a single matrix.
   * @readonly
   */
  get matrix() {
    const t = this._matrix;
    return this.dirty && (t.a = this._cx * this.scale.x, t.b = this._sx * this.scale.x, t.c = this._cy * this.scale.y, t.d = this._sy * this.scale.y, t.tx = this.position.x - (this.pivot.x * t.a + this.pivot.y * t.c), t.ty = this.position.y - (this.pivot.x * t.b + this.pivot.y * t.d), this.dirty = !1), t;
  }
  /**
   * Called when a value changes.
   * @param point
   * @internal
   * @private
   */
  _onUpdate(t) {
    var e;
    this.dirty = !0, t === this.skew && this.updateSkew(), (e = this.observer) == null || e._onUpdate(this);
  }
  /** Called when the skew or the rotation changes. */
  updateSkew() {
    this._cx = Math.cos(this._rotation + this.skew.y), this._sx = Math.sin(this._rotation + this.skew.y), this._cy = -Math.sin(this._rotation - this.skew.x), this._sy = Math.cos(this._rotation - this.skew.x), this.dirty = !0;
  }
  toString() {
    return `[pixi.js/math:Transform position=(${this.position.x}, ${this.position.y}) rotation=${this.rotation} scale=(${this.scale.x}, ${this.scale.y}) skew=(${this.skew.x}, ${this.skew.y}) ]`;
  }
  /**
   * Decomposes a matrix and sets the transforms properties based on it.
   * @param matrix - The matrix to decompose
   */
  setFromMatrix(t) {
    t.decompose(this), this.dirty = !0;
  }
  /** The rotation of the object in radians. */
  get rotation() {
    return this._rotation;
  }
  set rotation(t) {
    this._rotation !== t && (this._rotation = t, this._onUpdate(this.skew));
  }
}
const nc = class Zs extends Ps {
  constructor(...t) {
    let e = t[0] || {};
    e instanceof G && (e = { texture: e }), t.length > 1 && (H($, "use new TilingSprite({ texture, width:100, height:100 }) instead"), e.width = t[1], e.height = t[2]), e = { ...Zs.defaultOptions, ...e };
    const {
      texture: i,
      anchor: n,
      tilePosition: r,
      tileScale: o,
      tileRotation: a,
      width: h,
      height: c,
      applyAnchorToTexture: l,
      roundPixels: d,
      ...f
    } = e ?? {};
    super({
      label: "TilingSprite",
      ...f
    }), this.renderPipeId = "tilingSprite", this.batched = !0, this.allowChildren = !1, this._anchor = new _t(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), this._applyAnchorToTexture = l, this.texture = i, this._width = h ?? i.width, this._height = c ?? i.height, this._tileTransform = new am({
      observer: {
        _onUpdate: () => this.onViewUpdate()
      }
    }), n && (this.anchor = n), this.tilePosition = r, this.tileScale = o, this.tileRotation = a, this.roundPixels = d ?? !1;
  }
  /**
   * Creates a new tiling sprite.
   * @param source - The source to create the texture from.
   * @param options - The options for creating the tiling sprite.
   * @returns A new tiling sprite.
   */
  static from(t, e = {}) {
    return typeof t == "string" ? new Zs({
      texture: st.get(t),
      ...e
    }) : new Zs({
      texture: t,
      ...e
    });
  }
  /**
   * Changes frame clamping in corresponding textureMatrix
   * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
   * @default 0.5
   * @member {number}
   */
  get clampMargin() {
    return this._texture.textureMatrix.clampMargin;
  }
  set clampMargin(t) {
    this._texture.textureMatrix.clampMargin = t;
  }
  /**
   * The anchor sets the origin point of the sprite. The default value is taken from the {@link Texture}
   * and passed to the constructor.
   *
   * The default is `(0,0)`, this means the sprite's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { TilingSprite } from 'pixi.js';
   *
   * const sprite = new TilingSprite({texture: Texture.WHITE});
   * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  /** The offset of the image that is being tiled. */
  get tilePosition() {
    return this._tileTransform.position;
  }
  set tilePosition(t) {
    this._tileTransform.position.copyFrom(t);
  }
  /** The scaling of the image that is being tiled. */
  get tileScale() {
    return this._tileTransform.scale;
  }
  set tileScale(t) {
    typeof t == "number" ? this._tileTransform.scale.set(t) : this._tileTransform.scale.copyFrom(t);
  }
  set tileRotation(t) {
    this._tileTransform.rotation = t;
  }
  /** The rotation of the image that is being tiled. */
  get tileRotation() {
    return this._tileTransform.rotation;
  }
  /** The transform of the image that is being tiled. */
  get tileTransform() {
    return this._tileTransform;
  }
  /**
   * The local bounds of the sprite.
   * @type {rendering.Bounds}
   */
  get bounds() {
    return this._boundsDirty && (this._updateBounds(), this._boundsDirty = !1), this._bounds;
  }
  set texture(t) {
    t || (t = G.EMPTY);
    const e = this._texture;
    e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this.onViewUpdate());
  }
  /** The texture that the sprite is using. */
  get texture() {
    return this._texture;
  }
  /** The width of the tiling area. */
  set width(t) {
    this._width = t, this.onViewUpdate();
  }
  get width() {
    return this._width;
  }
  set height(t) {
    this._height = t, this.onViewUpdate();
  }
  /** The height of the tiling area. */
  get height() {
    return this._height;
  }
  /**
   * Sets the size of the TilingSprite to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(t, e) {
    typeof t == "object" && (e = t.height ?? t.width, t = t.width), this._width = t, this._height = e ?? t, this.onViewUpdate();
  }
  /**
   * Retrieves the size of the TilingSprite as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the TilingSprite.
   */
  getSize(t) {
    return t || (t = {}), t.width = this._width, t.height = this._height, t;
  }
  _updateBounds() {
    const t = this._bounds, e = this._anchor, i = this._width, n = this._height;
    t.maxX = -e._x * i, t.minX = t.maxX + i, t.maxY = -e._y * n, t.minY = t.maxY + n;
  }
  /**
   * Adds the bounds of this object to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(t) {
    const e = this.bounds;
    t.addFrame(
      e.minX,
      e.minY,
      e.maxX,
      e.maxY
    );
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(t) {
    const e = this._width, i = this._height, n = -e * this._anchor._x;
    let r = 0;
    return t.x >= n && t.x <= n + e && (r = -i * this._anchor._y, t.y >= r && t.y <= r + i);
  }
  onViewUpdate() {
    this._boundsDirty = !0, super.onViewUpdate();
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(t = !1) {
    if (super.destroy(t), this._anchor = null, this._tileTransform = null, this._bounds = null, typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const i = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._texture.destroy(i);
    }
    this._texture = null;
  }
};
nc.defaultOptions = {
  /** The texture to use for the sprite. */
  texture: G.EMPTY,
  /** The anchor point of the sprite */
  anchor: { x: 0, y: 0 },
  /** The offset of the image that is being tiled. */
  tilePosition: { x: 0, y: 0 },
  /** Scaling of the image that is being tiled. */
  tileScale: { x: 1, y: 1 },
  /** The rotation of the image that is being tiled. */
  tileRotation: 0,
  /** TODO */
  applyAnchorToTexture: !1
};
let hm = nc;
class rc extends Ps {
  constructor(t, e) {
    const { text: i, resolution: n, style: r, anchor: o, width: a, height: h, roundPixels: c, ...l } = t;
    super({
      ...l
    }), this.batched = !0, this._resolution = null, this._autoResolution = !0, this._didTextUpdate = !0, this._styleClass = e, this.text = i ?? "", this.style = r, this.resolution = n ?? null, this.allowChildren = !1, this._anchor = new _t(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), o && (this.anchor = o), this.roundPixels = c ?? !1, a !== void 0 && (this.width = a), h !== void 0 && (this.height = h);
  }
  /**
   * The anchor sets the origin point of the text.
   * The default is `(0,0)`, this means the text's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { Text } from 'pixi.js';
   *
   * const text = new Text('hello world');
   * text.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  /** Set the copy for the text object. To split a line you can use '\n'. */
  set text(t) {
    t = t.toString(), this._text !== t && (this._text = t, this.onViewUpdate());
  }
  get text() {
    return this._text;
  }
  /**
   * The resolution / device pixel ratio of the canvas.
   * @default 1
   */
  set resolution(t) {
    this._autoResolution = t === null, this._resolution = t, this.onViewUpdate();
  }
  get resolution() {
    return this._resolution;
  }
  get style() {
    return this._style;
  }
  /**
   * Set the style of the text.
   *
   * Set up an event listener to listen for changes on the style object and mark the text as dirty.
   *
   * If setting the `style` can also be partial {@link AnyTextStyleOptions}.
   * @type {
   * text.TextStyle |
   * Partial<text.TextStyle> |
   * text.TextStyleOptions |
   * text.HTMLTextStyle |
   * Partial<text.HTMLTextStyle> |
   * text.HTMLTextStyleOptions
   * }
   */
  set style(t) {
    var e;
    t = t || {}, (e = this._style) == null || e.off("update", this.onViewUpdate, this), t instanceof this._styleClass ? this._style = t : this._style = new this._styleClass(t), this._style.on("update", this.onViewUpdate, this), this.onViewUpdate();
  }
  /**
   * The local bounds of the Text.
   * @type {rendering.Bounds}
   */
  get bounds() {
    return this._boundsDirty && (this._updateBounds(), this._boundsDirty = !1), this._bounds;
  }
  /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return Math.abs(this.scale.x) * this.bounds.width;
  }
  set width(t) {
    this._setWidth(t, this.bounds.width);
  }
  /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return Math.abs(this.scale.y) * this.bounds.height;
  }
  set height(t) {
    this._setHeight(t, this.bounds.height);
  }
  /**
   * Retrieves the size of the Text as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the Text.
   */
  getSize(t) {
    return t || (t = {}), t.width = Math.abs(this.scale.x) * this.bounds.width, t.height = Math.abs(this.scale.y) * this.bounds.height, t;
  }
  /**
   * Sets the size of the Text to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(t, e) {
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, this.bounds.width), e !== void 0 && this._setHeight(e, this.bounds.height);
  }
  /**
   * Adds the bounds of this text to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(t) {
    const e = this.bounds;
    t.addFrame(
      e.minX,
      e.minY,
      e.maxX,
      e.maxY
    );
  }
  /**
   * Checks if the text contains the given point.
   * @param point - The point to check
   */
  containsPoint(t) {
    const e = this.bounds.width, i = this.bounds.height, n = -e * this.anchor.x;
    let r = 0;
    return t.x >= n && t.x <= n + e && (r = -i * this.anchor.y, t.y >= r && t.y <= r + i);
  }
  onViewUpdate() {
    this._boundsDirty = !0, this.didViewUpdate || (this._didTextUpdate = !0), super.onViewUpdate();
  }
  _getKey() {
    return `${this.text}:${this._style.styleKey}:${this._resolution}`;
  }
  /**
   * Destroys this text renderable and optionally its style texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the texture of the text style
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the text style
   * @param {boolean} [options.style=false] - Should it destroy the style of the text
   */
  destroy(t = !1) {
    super.destroy(t), this.owner = null, this._bounds = null, this._anchor = null, (typeof t == "boolean" ? t : t != null && t.style) && this._style.destroy(t), this._style = null, this._text = null;
  }
}
function oc(s, t) {
  let e = s[0] ?? {};
  return (typeof e == "string" || s[1]) && (H($, `use new ${t}({ text: "hi!", style }) instead`), e = {
    text: e,
    style: s[1]
  }), e;
}
class ac extends rc {
  constructor(...t) {
    const e = oc(t, "Text");
    super(e, hi), this.renderPipeId = "text";
  }
  _updateBounds() {
    const t = this._bounds, e = this._anchor, i = Hr.measureText(
      this._text,
      this._style
    ), { width: n, height: r } = i;
    t.minX = -e._x * n, t.maxX = t.minX + n, t.minY = -e._y * r, t.maxY = t.minY + r;
  }
}
class lm extends rc {
  constructor(...t) {
    var e;
    const i = oc(t, "BitmapText");
    i.style ?? (i.style = i.style || {}), (e = i.style).fill ?? (e.fill = 16777215), super(i, hi), this.renderPipeId = "bitmapText";
  }
  _updateBounds() {
    const t = this._bounds, e = this._anchor, i = $r.measureText(this.text, this._style), n = i.scale, r = i.offsetY * n;
    let o = i.width * n, a = i.height * n;
    const h = this._style._stroke;
    h && (o += h.width, a += h.width), t.minX = -e._x * o, t.maxX = t.minX + o, t.minY = -e._y * (a + r), t.maxY = t.minY + a;
  }
  /**
   * The resolution / device pixel ratio of the canvas.
   * @default 1
   */
  set resolution(t) {
    t !== null && ut(
      // eslint-disable-next-line max-len
      "[BitmapText] dynamically updating the resolution is not supported. Resolution should be managed by the BitmapFont."
    );
  }
  get resolution() {
    return this._resolution;
  }
}
class Mo extends G {
  static create(t) {
    return new Mo({
      source: new ve(t)
    });
  }
  /**
   * Resizes the render texture.
   * @param width - The new width of the render texture.
   * @param height - The new height of the render texture.
   * @param resolution - The new resolution of the render texture.
   * @returns This texture.
   */
  resize(t, e, i) {
    return this.source.resize(t, e, i), this;
  }
}
const hc = class lc extends om {
  constructor(...t) {
    super({});
    let e = t[0] ?? {};
    typeof e == "number" && (H($, "PlaneGeometry constructor changed please use { width, height, verticesX, verticesY } instead"), e = {
      width: e,
      height: t[1],
      verticesX: t[2],
      verticesY: t[3]
    }), this.build(e);
  }
  /**
   * Refreshes plane coordinates
   * @param options - Options to be applied to plane geometry
   */
  build(t) {
    t = { ...lc.defaultOptions, ...t }, this.verticesX = this.verticesX ?? t.verticesX, this.verticesY = this.verticesY ?? t.verticesY, this.width = this.width ?? t.width, this.height = this.height ?? t.height;
    const e = this.verticesX * this.verticesY, i = [], n = [], r = [], o = this.verticesX - 1, a = this.verticesY - 1, h = this.width / o, c = this.height / a;
    for (let d = 0; d < e; d++) {
      const f = d % this.verticesX, u = d / this.verticesX | 0;
      i.push(f * h, u * c), n.push(f / o, u / a);
    }
    const l = o * a;
    for (let d = 0; d < l; d++) {
      const f = d % o, u = d / o | 0, g = u * this.verticesX + f, p = u * this.verticesX + f + 1, m = (u + 1) * this.verticesX + f, x = (u + 1) * this.verticesX + f + 1;
      r.push(
        g,
        p,
        m,
        p,
        x,
        m
      );
    }
    this.buffers[0].data = new Float32Array(i), this.buffers[1].data = new Float32Array(n), this.indexBuffer.data = new Uint32Array(r), this.buffers[0].update(), this.buffers[1].update(), this.indexBuffer.update();
  }
};
hc.defaultOptions = {
  width: 100,
  height: 100,
  verticesX: 10,
  verticesY: 10
};
let cm = hc;
const cc = class uc extends cm {
  constructor(t = {}) {
    t = { ...uc.defaultOptions, ...t }, super({
      width: t.width,
      height: t.height,
      verticesX: 4,
      verticesY: 4
    }), this.update(t);
  }
  /**
   * Updates the NineSliceGeometry with the options.
   * @param options - The options of the NineSliceGeometry.
   */
  update(t) {
    this.width = t.width ?? this.width, this.height = t.height ?? this.height, this._originalWidth = t.originalWidth ?? this._originalWidth, this._originalHeight = t.originalHeight ?? this._originalHeight, this._leftWidth = t.leftWidth ?? this._leftWidth, this._rightWidth = t.rightWidth ?? this._rightWidth, this._topHeight = t.topHeight ?? this._topHeight, this._bottomHeight = t.bottomHeight ?? this._bottomHeight, this.updateUvs(), this.updatePositions();
  }
  /** Updates the positions of the vertices. */
  updatePositions() {
    const t = this.positions, e = this._leftWidth + this._rightWidth, i = this.width > e ? 1 : this.width / e, n = this._topHeight + this._bottomHeight, r = this.height > n ? 1 : this.height / n, o = Math.min(i, r);
    t[9] = t[11] = t[13] = t[15] = this._topHeight * o, t[17] = t[19] = t[21] = t[23] = this.height - this._bottomHeight * o, t[25] = t[27] = t[29] = t[31] = this.height, t[2] = t[10] = t[18] = t[26] = this._leftWidth * o, t[4] = t[12] = t[20] = t[28] = this.width - this._rightWidth * o, t[6] = t[14] = t[22] = t[30] = this.width, this.getBuffer("aPosition").update();
  }
  /** Updates the UVs of the vertices. */
  updateUvs() {
    const t = this.uvs;
    t[0] = t[8] = t[16] = t[24] = 0, t[1] = t[3] = t[5] = t[7] = 0, t[6] = t[14] = t[22] = t[30] = 1, t[25] = t[27] = t[29] = t[31] = 1;
    const e = 1 / this._originalWidth, i = 1 / this._originalHeight;
    t[2] = t[10] = t[18] = t[26] = e * this._leftWidth, t[9] = t[11] = t[13] = t[15] = i * this._topHeight, t[4] = t[12] = t[20] = t[28] = 1 - e * this._rightWidth, t[17] = t[19] = t[21] = t[23] = 1 - i * this._bottomHeight, this.getBuffer("aUV").update();
  }
};
cc.defaultOptions = {
  /** The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
  width: 100,
  /** The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
  height: 100,
  /** The width of the left column. */
  leftWidth: 10,
  /** The height of the top row. */
  topHeight: 10,
  /** The width of the right column. */
  rightWidth: 10,
  /** The height of the bottom row. */
  bottomHeight: 10,
  /** The original width of the texture */
  originalWidth: 100,
  /** The original height of the texture */
  originalHeight: 100
};
let mi = cc;
const dc = class fc extends Ps {
  /**
   * @param {scene.NineSliceSpriteOptions|Texture} options - Options to use
   * @param options.texture - The texture to use on the NineSliceSprite.
   * @param options.leftWidth - Width of the left vertical bar (A)
   * @param options.topHeight - Height of the top horizontal bar (C)
   * @param options.rightWidth - Width of the right vertical bar (B)
   * @param options.bottomHeight - Height of the bottom horizontal bar (D)
   * @param options.width - Width of the NineSliceSprite,
   * setting this will actually modify the vertices and not the UV's of this plane.
   * @param options.height - Height of the NineSliceSprite,
   * setting this will actually modify the vertices and not UV's of this plane.
   */
  constructor(t) {
    var d, f, u, g;
    t instanceof G && (t = { texture: t });
    const {
      width: e,
      height: i,
      leftWidth: n,
      rightWidth: r,
      topHeight: o,
      bottomHeight: a,
      texture: h,
      roundPixels: c,
      ...l
    } = t;
    super({
      label: "NineSliceSprite",
      ...l
    }), this.renderPipeId = "nineSliceSprite", this.batched = !0, this._leftWidth = n ?? ((d = h == null ? void 0 : h.defaultBorders) == null ? void 0 : d.left) ?? mi.defaultOptions.leftWidth, this._topHeight = o ?? ((f = h == null ? void 0 : h.defaultBorders) == null ? void 0 : f.top) ?? mi.defaultOptions.topHeight, this._rightWidth = r ?? ((u = h == null ? void 0 : h.defaultBorders) == null ? void 0 : u.right) ?? mi.defaultOptions.rightWidth, this._bottomHeight = a ?? ((g = h == null ? void 0 : h.defaultBorders) == null ? void 0 : g.bottom) ?? mi.defaultOptions.bottomHeight, this.bounds.maxX = this._width = e ?? h.width ?? mi.defaultOptions.width, this.bounds.maxY = this._height = i ?? h.height ?? mi.defaultOptions.height, this.allowChildren = !1, this.texture = h ?? fc.defaultOptions.texture, this.roundPixels = c ?? !1;
  }
  /** The local bounds of the view. */
  get bounds() {
    return this._bounds;
  }
  /** The width of the NineSliceSprite, setting this will actually modify the vertices and UV's of this plane. */
  get width() {
    return this._width;
  }
  set width(t) {
    this.bounds.maxX = this._width = t, this.onViewUpdate();
  }
  /** The height of the NineSliceSprite, setting this will actually modify the vertices and UV's of this plane. */
  get height() {
    return this._height;
  }
  set height(t) {
    this.bounds.maxY = this._height = t, this.onViewUpdate();
  }
  /**
   * Sets the size of the NiceSliceSprite to the specified width and height.
   * setting this will actually modify the vertices and UV's of this plane
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(t, e) {
    typeof t == "object" && (e = t.height ?? t.width, t = t.width), this.bounds.maxX = this._width = t, this.bounds.maxY = this._height = e ?? t, this.onViewUpdate();
  }
  /**
   * Retrieves the size of the NineSliceSprite as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the NineSliceSprite.
   */
  getSize(t) {
    return t || (t = {}), t.width = this._width, t.height = this._height, t;
  }
  /** The width of the left column (a) of the NineSliceSprite. */
  get leftWidth() {
    return this._leftWidth;
  }
  set leftWidth(t) {
    this._leftWidth = t, this.onViewUpdate();
  }
  /** The width of the right column (b) of the NineSliceSprite. */
  get topHeight() {
    return this._topHeight;
  }
  set topHeight(t) {
    this._topHeight = t, this.onViewUpdate();
  }
  /** The width of the right column (b) of the NineSliceSprite. */
  get rightWidth() {
    return this._rightWidth;
  }
  set rightWidth(t) {
    this._rightWidth = t, this.onViewUpdate();
  }
  /** The width of the right column (b) of the NineSliceSprite. */
  get bottomHeight() {
    return this._bottomHeight;
  }
  set bottomHeight(t) {
    this._bottomHeight = t, this.onViewUpdate();
  }
  /** The texture that the NineSliceSprite is using. */
  get texture() {
    return this._texture;
  }
  set texture(t) {
    t || (t = G.EMPTY);
    const e = this._texture;
    e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this.onViewUpdate());
  }
  /** The original width of the texture */
  get originalWidth() {
    return this._texture.width;
  }
  /** The original height of the texture */
  get originalHeight() {
    return this._texture.height;
  }
  /**
   * Adds the bounds of this object to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(t) {
    const e = this.bounds;
    t.addFrame(e.minX, e.minY, e.maxX, e.maxY);
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(t) {
    if (super.destroy(t), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const i = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._texture.destroy(i);
    }
    this._texture = null;
  }
};
dc.defaultOptions = {
  /** @default Texture.EMPTY */
  texture: G.EMPTY
};
let lh = dc;
Pt.add(Iu, Bu);
var pc = {}, Pn = {};
Object.defineProperty(Pn, "__esModule", { value: !0 });
Pn.MiniSignal = void 0;
const Yr = Symbol("SIGNAL");
function um(s) {
  return typeof s == "object" && Yr in s;
}
class dm {
  constructor() {
    this._symbol = Symbol("MiniSignal"), this._refMap = /* @__PURE__ */ new WeakMap(), this._head = void 0, this._tail = void 0, this._dispatching = !1;
  }
  hasListeners() {
    return this._head != null;
  }
  /**
   * Dispatches a signal to all registered listeners.
   */
  dispatch(...t) {
    if (this._dispatching)
      throw new Error("MiniSignal#dispatch(): Signal already dispatching.");
    let e = this._head;
    if (e == null)
      return !1;
    for (this._dispatching = !0; e != null; )
      e.fn(...t), e = e.next;
    return this._dispatching = !1, !0;
  }
  /**
   * Register a new listener.
   */
  add(t) {
    if (typeof t != "function")
      throw new Error("MiniSignal#add(): First arg must be a Function.");
    return this._createRef(this._addNode({ fn: t }));
  }
  /**
   * Remove binding object.
   */
  detach(t) {
    if (!um(t))
      throw new Error("MiniSignal#detach(): First arg must be a MiniSignal listener reference.");
    if (t[Yr] !== this._symbol)
      throw new Error("MiniSignal#detach(): MiniSignal listener does not belong to this MiniSignal.");
    const e = this._refMap.get(t);
    return e ? (this._refMap.delete(t), this._disconnectNode(e), this._destroyNode(e), this) : this;
  }
  /**
   * Detach all listeners.
   */
  detachAll() {
    let t = this._head;
    if (t == null)
      return this;
    for (this._head = this._tail = void 0, this._refMap = /* @__PURE__ */ new WeakMap(); t != null; )
      this._destroyNode(t), t = t.next;
    return this;
  }
  _destroyNode(t) {
    t.fn = void 0, t.prev = void 0;
  }
  _disconnectNode(t) {
    t === this._head ? (this._head = t.next, t.next == null && (this._tail = void 0)) : t === this._tail && (this._tail = t.prev, this._tail != null && (this._tail.next = void 0)), t.prev != null && (t.prev.next = t.next), t.next != null && (t.next.prev = t.prev);
  }
  _addNode(t) {
    return this._head == null ? (this._head = t, this._tail = t) : (this._tail.next = t, t.prev = this._tail, this._tail = t), t;
  }
  _createRef(t) {
    const e = { [Yr]: this._symbol };
    return this._refMap.set(e, t), e;
  }
  _getRef(t) {
    return this._refMap.get(t);
  }
}
Pn.MiniSignal = dm;
(function(s) {
  var t = Je && Je.__createBinding || (Object.create ? function(i, n, r, o) {
    o === void 0 && (o = r);
    var a = Object.getOwnPropertyDescriptor(n, r);
    (!a || ("get" in a ? !n.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return n[r];
    } }), Object.defineProperty(i, o, a);
  } : function(i, n, r, o) {
    o === void 0 && (o = r), i[o] = n[r];
  }), e = Je && Je.__exportStar || function(i, n) {
    for (var r in i) r !== "default" && !Object.prototype.hasOwnProperty.call(n, r) && t(n, i, r);
  };
  Object.defineProperty(s, "__esModule", { value: !0 }), e(Pn, s);
})(pc);
const on = /* @__PURE__ */ new Map(), fm = (s, t) => {
  let e = on.get(s);
  return e || (e = new pc.MiniSignal(), on.set(s, e)), { name: s, binding: e.add(t) };
}, ch = (s, t) => {
  const e = on.get(s);
  e && e.detach(t);
}, an = (s, ...t) => {
  const e = on.get(s);
  e && e.dispatch(...t);
};
function Ae(s) {
  if (s === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return s;
}
function gc(s, t) {
  s.prototype = Object.create(t.prototype), s.prototype.constructor = s, s.__proto__ = t;
}
/*!
 * GSAP 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var jt = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, Ri = {
  duration: 0.5,
  overwrite: !1,
  delay: 0
}, To, Mt, tt, Zt = 1e8, q = 1 / Zt, Xr = Math.PI * 2, pm = Xr / 4, gm = 0, mc = Math.sqrt, mm = Math.cos, _m = Math.sin, wt = function(t) {
  return typeof t == "string";
}, at = function(t) {
  return typeof t == "function";
}, ke = function(t) {
  return typeof t == "number";
}, ko = function(t) {
  return typeof t > "u";
}, ye = function(t) {
  return typeof t == "object";
}, Ft = function(t) {
  return t !== !1;
}, Eo = function() {
  return typeof window < "u";
}, js = function(t) {
  return at(t) || wt(t);
}, _c = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
}, Tt = Array.isArray, Kr = /(?:-?\.?\d|\.)+/gi, xc = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, bi = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, pr = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, yc = /[+-]=-?[.\d]+/, vc = /[^,'"\[\]\s]+/gi, xm = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, it, de, qr, Io, Yt = {}, hn = {}, bc, wc = function(t) {
  return (hn = li(t, Yt)) && zt;
}, Bo = function(t, e) {
  return console.warn("Invalid property", t, "set to", e, "Missing plugin? gsap.registerPlugin()");
}, ms = function(t, e) {
  return !e && console.warn(t);
}, Sc = function(t, e) {
  return t && (Yt[t] = e) && hn && (hn[t] = e) || Yt;
}, _s = function() {
  return 0;
}, ym = {
  suppressEvents: !0,
  isStart: !0,
  kill: !1
}, Qs = {
  suppressEvents: !0,
  kill: !1
}, vm = {
  suppressEvents: !0
}, Ro = {}, Ue = [], Zr = {}, Ac, Nt = {}, gr = {}, uh = 30, Js = [], Fo = "", Lo = function(t) {
  var e = t[0], i, n;
  if (ye(e) || at(e) || (t = [t]), !(i = (e._gsap || {}).harness)) {
    for (n = Js.length; n-- && !Js[n].targetTest(e); )
      ;
    i = Js[n];
  }
  for (n = t.length; n--; )
    t[n] && (t[n]._gsap || (t[n]._gsap = new Xc(t[n], i))) || t.splice(n, 1);
  return t;
}, si = function(t) {
  return t._gsap || Lo(Qt(t))[0]._gsap;
}, Cc = function(t, e, i) {
  return (i = t[e]) && at(i) ? t[e]() : ko(i) && t.getAttribute && t.getAttribute(e) || i;
}, Lt = function(t, e) {
  return (t = t.split(",")).forEach(e) || t;
}, ct = function(t) {
  return Math.round(t * 1e5) / 1e5 || 0;
}, bt = function(t) {
  return Math.round(t * 1e7) / 1e7 || 0;
}, Mi = function(t, e) {
  var i = e.charAt(0), n = parseFloat(e.substr(2));
  return t = parseFloat(t), i === "+" ? t + n : i === "-" ? t - n : i === "*" ? t * n : t / n;
}, bm = function(t, e) {
  for (var i = e.length, n = 0; t.indexOf(e[n]) < 0 && ++n < i; )
    ;
  return n < i;
}, ln = function() {
  var t = Ue.length, e = Ue.slice(0), i, n;
  for (Zr = {}, Ue.length = 0, i = 0; i < t; i++)
    n = e[i], n && n._lazy && (n.render(n._lazy[0], n._lazy[1], !0)._lazy = 0);
}, Pc = function(t, e, i, n) {
  Ue.length && !Mt && ln(), t.render(e, i, Mt && e < 0 && (t._initted || t._startAt)), Ue.length && !Mt && ln();
}, Mc = function(t) {
  var e = parseFloat(t);
  return (e || e === 0) && (t + "").match(vc).length < 2 ? e : wt(t) ? t.trim() : t;
}, Tc = function(t) {
  return t;
}, Jt = function(t, e) {
  for (var i in e)
    i in t || (t[i] = e[i]);
  return t;
}, wm = function(t) {
  return function(e, i) {
    for (var n in i)
      n in e || n === "duration" && t || n === "ease" || (e[n] = i[n]);
  };
}, li = function(t, e) {
  for (var i in e)
    t[i] = e[i];
  return t;
}, dh = function s(t, e) {
  for (var i in e)
    i !== "__proto__" && i !== "constructor" && i !== "prototype" && (t[i] = ye(e[i]) ? s(t[i] || (t[i] = {}), e[i]) : e[i]);
  return t;
}, cn = function(t, e) {
  var i = {}, n;
  for (n in t)
    n in e || (i[n] = t[n]);
  return i;
}, os = function(t) {
  var e = t.parent || it, i = t.keyframes ? wm(Tt(t.keyframes)) : Jt;
  if (Ft(t.inherit))
    for (; e; )
      i(t, e.vars.defaults), e = e.parent || e._dp;
  return t;
}, Sm = function(t, e) {
  for (var i = t.length, n = i === e.length; n && i-- && t[i] === e[i]; )
    ;
  return i < 0;
}, kc = function(t, e, i, n, r) {
  var o = t[n], a;
  if (r)
    for (a = e[r]; o && o[r] > a; )
      o = o._prev;
  return o ? (e._next = o._next, o._next = e) : (e._next = t[i], t[i] = e), e._next ? e._next._prev = e : t[n] = e, e._prev = o, e.parent = e._dp = t, e;
}, Mn = function(t, e, i, n) {
  i === void 0 && (i = "_first"), n === void 0 && (n = "_last");
  var r = e._prev, o = e._next;
  r ? r._next = o : t[i] === e && (t[i] = o), o ? o._prev = r : t[n] === e && (t[n] = r), e._next = e._prev = e.parent = null;
}, Ge = function(t, e) {
  t.parent && (!e || t.parent.autoRemoveChildren) && t.parent.remove && t.parent.remove(t), t._act = 0;
}, ni = function(t, e) {
  if (t && (!e || e._end > t._dur || e._start < 0))
    for (var i = t; i; )
      i._dirty = 1, i = i.parent;
  return t;
}, Am = function(t) {
  for (var e = t.parent; e && e.parent; )
    e._dirty = 1, e.totalDuration(), e = e.parent;
  return t;
}, Qr = function(t, e, i, n) {
  return t._startAt && (Mt ? t._startAt.revert(Qs) : t.vars.immediateRender && !t.vars.autoRevert || t._startAt.render(e, !0, n));
}, Cm = function s(t) {
  return !t || t._ts && s(t.parent);
}, fh = function(t) {
  return t._repeat ? Fi(t._tTime, t = t.duration() + t._rDelay) * t : 0;
}, Fi = function(t, e) {
  var i = Math.floor(t /= e);
  return t && i === t ? i - 1 : i;
}, un = function(t, e) {
  return (t - e._start) * e._ts + (e._ts >= 0 ? 0 : e._dirty ? e.totalDuration() : e._tDur);
}, Tn = function(t) {
  return t._end = bt(t._start + (t._tDur / Math.abs(t._ts || t._rts || q) || 0));
}, kn = function(t, e) {
  var i = t._dp;
  return i && i.smoothChildTiming && t._ts && (t._start = bt(i._time - (t._ts > 0 ? e / t._ts : ((t._dirty ? t.totalDuration() : t._tDur) - e) / -t._ts)), Tn(t), i._dirty || ni(i, t)), t;
}, Ec = function(t, e) {
  var i;
  if ((e._time || !e._dur && e._initted || e._start < t._time && (e._dur || !e.add)) && (i = un(t.rawTime(), e), (!e._dur || Ms(0, e.totalDuration(), i) - e._tTime > q) && e.render(i, !0)), ni(t, e)._dp && t._initted && t._time >= t._dur && t._ts) {
    if (t._dur < t.duration())
      for (i = t; i._dp; )
        i.rawTime() >= 0 && i.totalTime(i._tTime), i = i._dp;
    t._zTime = -q;
  }
}, fe = function(t, e, i, n) {
  return e.parent && Ge(e), e._start = bt((ke(i) ? i : i || t !== it ? Xt(t, i, e) : t._time) + e._delay), e._end = bt(e._start + (e.totalDuration() / Math.abs(e.timeScale()) || 0)), kc(t, e, "_first", "_last", t._sort ? "_start" : 0), Jr(e) || (t._recent = e), n || Ec(t, e), t._ts < 0 && kn(t, t._tTime), t;
}, Ic = function(t, e) {
  return (Yt.ScrollTrigger || Bo("scrollTrigger", e)) && Yt.ScrollTrigger.create(e, t);
}, Bc = function(t, e, i, n, r) {
  if (Do(t, e, r), !t._initted)
    return 1;
  if (!i && t._pt && !Mt && (t._dur && t.vars.lazy !== !1 || !t._dur && t.vars.lazy) && Ac !== Ht.frame)
    return Ue.push(t), t._lazy = [r, n], 1;
}, Pm = function s(t) {
  var e = t.parent;
  return e && e._ts && e._initted && !e._lock && (e.rawTime() < 0 || s(e));
}, Jr = function(t) {
  var e = t.data;
  return e === "isFromStart" || e === "isStart";
}, Mm = function(t, e, i, n) {
  var r = t.ratio, o = e < 0 || !e && (!t._start && Pm(t) && !(!t._initted && Jr(t)) || (t._ts < 0 || t._dp._ts < 0) && !Jr(t)) ? 0 : 1, a = t._rDelay, h = 0, c, l, d;
  if (a && t._repeat && (h = Ms(0, t._tDur, e), l = Fi(h, a), t._yoyo && l & 1 && (o = 1 - o), l !== Fi(t._tTime, a) && (r = 1 - o, t.vars.repeatRefresh && t._initted && t.invalidate())), o !== r || Mt || n || t._zTime === q || !e && t._zTime) {
    if (!t._initted && Bc(t, e, n, i, h))
      return;
    for (d = t._zTime, t._zTime = e || (i ? q : 0), i || (i = e && !d), t.ratio = o, t._from && (o = 1 - o), t._time = 0, t._tTime = h, c = t._pt; c; )
      c.r(o, c.d), c = c._next;
    e < 0 && Qr(t, e, i, !0), t._onUpdate && !i && $t(t, "onUpdate"), h && t._repeat && !i && t.parent && $t(t, "onRepeat"), (e >= t._tDur || e < 0) && t.ratio === o && (o && Ge(t, 1), !i && !Mt && ($t(t, o ? "onComplete" : "onReverseComplete", !0), t._prom && t._prom()));
  } else t._zTime || (t._zTime = e);
}, Tm = function(t, e, i) {
  var n;
  if (i > e)
    for (n = t._first; n && n._start <= i; ) {
      if (n.data === "isPause" && n._start > e)
        return n;
      n = n._next;
    }
  else
    for (n = t._last; n && n._start >= i; ) {
      if (n.data === "isPause" && n._start < e)
        return n;
      n = n._prev;
    }
}, Li = function(t, e, i, n) {
  var r = t._repeat, o = bt(e) || 0, a = t._tTime / t._tDur;
  return a && !n && (t._time *= o / t._dur), t._dur = o, t._tDur = r ? r < 0 ? 1e10 : bt(o * (r + 1) + t._rDelay * r) : o, a > 0 && !n && kn(t, t._tTime = t._tDur * a), t.parent && Tn(t), i || ni(t.parent, t), t;
}, ph = function(t) {
  return t instanceof Bt ? ni(t) : Li(t, t._dur);
}, km = {
  _start: 0,
  endTime: _s,
  totalDuration: _s
}, Xt = function s(t, e, i) {
  var n = t.labels, r = t._recent || km, o = t.duration() >= Zt ? r.endTime(!1) : t._dur, a, h, c;
  return wt(e) && (isNaN(e) || e in n) ? (h = e.charAt(0), c = e.substr(-1) === "%", a = e.indexOf("="), h === "<" || h === ">" ? (a >= 0 && (e = e.replace(/=/, "")), (h === "<" ? r._start : r.endTime(r._repeat >= 0)) + (parseFloat(e.substr(1)) || 0) * (c ? (a < 0 ? r : i).totalDuration() / 100 : 1)) : a < 0 ? (e in n || (n[e] = o), n[e]) : (h = parseFloat(e.charAt(a - 1) + e.substr(a + 1)), c && i && (h = h / 100 * (Tt(i) ? i[0] : i).totalDuration()), a > 1 ? s(t, e.substr(0, a - 1), i) + h : o + h)) : e == null ? o : +e;
}, as = function(t, e, i) {
  var n = ke(e[1]), r = (n ? 2 : 1) + (t < 2 ? 0 : 1), o = e[r], a, h;
  if (n && (o.duration = e[1]), o.parent = i, t) {
    for (a = o, h = i; h && !("immediateRender" in a); )
      a = h.vars.defaults || {}, h = Ft(h.vars.inherit) && h.parent;
    o.immediateRender = Ft(a.immediateRender), t < 2 ? o.runBackwards = 1 : o.startAt = e[r - 1];
  }
  return new dt(e[0], o, e[r + 1]);
}, Ne = function(t, e) {
  return t || t === 0 ? e(t) : e;
}, Ms = function(t, e, i) {
  return i < t ? t : i > e ? e : i;
}, At = function(t, e) {
  return !wt(t) || !(e = xm.exec(t)) ? "" : e[1];
}, Em = function(t, e, i) {
  return Ne(i, function(n) {
    return Ms(t, e, n);
  });
}, to = [].slice, Rc = function(t, e) {
  return t && ye(t) && "length" in t && (!e && !t.length || t.length - 1 in t && ye(t[0])) && !t.nodeType && t !== de;
}, Im = function(t, e, i) {
  return i === void 0 && (i = []), t.forEach(function(n) {
    var r;
    return wt(n) && !e || Rc(n, 1) ? (r = i).push.apply(r, Qt(n)) : i.push(n);
  }) || i;
}, Qt = function(t, e, i) {
  return tt && !e && tt.selector ? tt.selector(t) : wt(t) && !i && (qr || !Oi()) ? to.call((e || Io).querySelectorAll(t), 0) : Tt(t) ? Im(t, i) : Rc(t) ? to.call(t, 0) : t ? [t] : [];
}, eo = function(t) {
  return t = Qt(t)[0] || ms("Invalid scope") || {}, function(e) {
    var i = t.current || t.nativeElement || t;
    return Qt(e, i.querySelectorAll ? i : i === t ? ms("Invalid scope") || Io.createElement("div") : t);
  };
}, Fc = function(t) {
  return t.sort(function() {
    return 0.5 - Math.random();
  });
}, Lc = function(t) {
  if (at(t))
    return t;
  var e = ye(t) ? t : {
    each: t
  }, i = ri(e.ease), n = e.from || 0, r = parseFloat(e.base) || 0, o = {}, a = n > 0 && n < 1, h = isNaN(n) || a, c = e.axis, l = n, d = n;
  return wt(n) ? l = d = {
    center: 0.5,
    edges: 0.5,
    end: 1
  }[n] || 0 : !a && h && (l = n[0], d = n[1]), function(f, u, g) {
    var p = (g || e).length, m = o[p], x, y, v, w, _, S, C, b, A;
    if (!m) {
      if (A = e.grid === "auto" ? 0 : (e.grid || [1, Zt])[1], !A) {
        for (C = -Zt; C < (C = g[A++].getBoundingClientRect().left) && A < p; )
          ;
        A < p && A--;
      }
      for (m = o[p] = [], x = h ? Math.min(A, p) * l - 0.5 : n % A, y = A === Zt ? 0 : h ? p * d / A - 0.5 : n / A | 0, C = 0, b = Zt, S = 0; S < p; S++)
        v = S % A - x, w = y - (S / A | 0), m[S] = _ = c ? Math.abs(c === "y" ? w : v) : mc(v * v + w * w), _ > C && (C = _), _ < b && (b = _);
      n === "random" && Fc(m), m.max = C - b, m.min = b, m.v = p = (parseFloat(e.amount) || parseFloat(e.each) * (A > p ? p - 1 : c ? c === "y" ? p / A : A : Math.max(A, p / A)) || 0) * (n === "edges" ? -1 : 1), m.b = p < 0 ? r - p : r, m.u = At(e.amount || e.each) || 0, i = i && p < 0 ? $c(i) : i;
    }
    return p = (m[f] - m.min) / m.max || 0, bt(m.b + (i ? i(p) : p) * m.v) + m.u;
  };
}, io = function(t) {
  var e = Math.pow(10, ((t + "").split(".")[1] || "").length);
  return function(i) {
    var n = bt(Math.round(parseFloat(i) / t) * t * e);
    return (n - n % 1) / e + (ke(i) ? 0 : At(i));
  };
}, Oc = function(t, e) {
  var i = Tt(t), n, r;
  return !i && ye(t) && (n = i = t.radius || Zt, t.values ? (t = Qt(t.values), (r = !ke(t[0])) && (n *= n)) : t = io(t.increment)), Ne(e, i ? at(t) ? function(o) {
    return r = t(o), Math.abs(r - o) <= n ? r : o;
  } : function(o) {
    for (var a = parseFloat(r ? o.x : o), h = parseFloat(r ? o.y : 0), c = Zt, l = 0, d = t.length, f, u; d--; )
      r ? (f = t[d].x - a, u = t[d].y - h, f = f * f + u * u) : f = Math.abs(t[d] - a), f < c && (c = f, l = d);
    return l = !n || c <= n ? t[l] : o, r || l === o || ke(o) ? l : l + At(o);
  } : io(t));
}, Dc = function(t, e, i, n) {
  return Ne(Tt(t) ? !e : i === !0 ? !!(i = 0) : !n, function() {
    return Tt(t) ? t[~~(Math.random() * t.length)] : (i = i || 1e-5) && (n = i < 1 ? Math.pow(10, (i + "").length - 2) : 1) && Math.floor(Math.round((t - i / 2 + Math.random() * (e - t + i * 0.99)) / i) * i * n) / n;
  });
}, Bm = function() {
  for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
    e[i] = arguments[i];
  return function(n) {
    return e.reduce(function(r, o) {
      return o(r);
    }, n);
  };
}, Rm = function(t, e) {
  return function(i) {
    return t(parseFloat(i)) + (e || At(i));
  };
}, Fm = function(t, e, i) {
  return Uc(t, e, 0, 1, i);
}, zc = function(t, e, i) {
  return Ne(i, function(n) {
    return t[~~e(n)];
  });
}, Lm = function s(t, e, i) {
  var n = e - t;
  return Tt(t) ? zc(t, s(0, t.length), e) : Ne(i, function(r) {
    return (n + (r - t) % n) % n + t;
  });
}, Om = function s(t, e, i) {
  var n = e - t, r = n * 2;
  return Tt(t) ? zc(t, s(0, t.length - 1), e) : Ne(i, function(o) {
    return o = (r + (o - t) % r) % r || 0, t + (o > n ? r - o : o);
  });
}, xs = function(t) {
  for (var e = 0, i = "", n, r, o, a; ~(n = t.indexOf("random(", e)); )
    o = t.indexOf(")", n), a = t.charAt(n + 7) === "[", r = t.substr(n + 7, o - n - 7).match(a ? vc : Kr), i += t.substr(e, n - e) + Dc(a ? r : +r[0], a ? 0 : +r[1], +r[2] || 1e-5), e = o + 1;
  return i + t.substr(e, t.length - e);
}, Uc = function(t, e, i, n, r) {
  var o = e - t, a = n - i;
  return Ne(r, function(h) {
    return i + ((h - t) / o * a || 0);
  });
}, Dm = function s(t, e, i, n) {
  var r = isNaN(t + e) ? 0 : function(u) {
    return (1 - u) * t + u * e;
  };
  if (!r) {
    var o = wt(t), a = {}, h, c, l, d, f;
    if (i === !0 && (n = 1) && (i = null), o)
      t = {
        p: t
      }, e = {
        p: e
      };
    else if (Tt(t) && !Tt(e)) {
      for (l = [], d = t.length, f = d - 2, c = 1; c < d; c++)
        l.push(s(t[c - 1], t[c]));
      d--, r = function(g) {
        g *= d;
        var p = Math.min(f, ~~g);
        return l[p](g - p);
      }, i = e;
    } else n || (t = li(Tt(t) ? [] : {}, t));
    if (!l) {
      for (h in e)
        Oo.call(a, t, h, "get", e[h]);
      r = function(g) {
        return Wo(g, a) || (o ? t.p : t);
      };
    }
  }
  return Ne(i, r);
}, gh = function(t, e, i) {
  var n = t.labels, r = Zt, o, a, h;
  for (o in n)
    a = n[o] - e, a < 0 == !!i && a && r > (a = Math.abs(a)) && (h = o, r = a);
  return h;
}, $t = function(t, e, i) {
  var n = t.vars, r = n[e], o = tt, a = t._ctx, h, c, l;
  if (r)
    return h = n[e + "Params"], c = n.callbackScope || t, i && Ue.length && ln(), a && (tt = a), l = h ? r.apply(c, h) : r.call(c), tt = o, l;
}, ts = function(t) {
  return Ge(t), t.scrollTrigger && t.scrollTrigger.kill(!!Mt), t.progress() < 1 && $t(t, "onInterrupt"), t;
}, wi, Wc = [], Gc = function(t) {
  if (t)
    if (t = !t.name && t.default || t, Eo() || t.headless) {
      var e = t.name, i = at(t), n = e && !i && t.init ? function() {
        this._props = [];
      } : t, r = {
        init: _s,
        render: Wo,
        add: Oo,
        kill: Jm,
        modifier: Qm,
        rawVars: 0
      }, o = {
        targetTest: 0,
        get: 0,
        getSetter: Uo,
        aliases: {},
        register: 0
      };
      if (Oi(), t !== n) {
        if (Nt[e])
          return;
        Jt(n, Jt(cn(t, r), o)), li(n.prototype, li(r, cn(t, o))), Nt[n.prop = e] = n, t.targetTest && (Js.push(n), Ro[e] = 1), e = (e === "css" ? "CSS" : e.charAt(0).toUpperCase() + e.substr(1)) + "Plugin";
      }
      Sc(e, n), t.register && t.register(zt, n, Ot);
    } else
      Wc.push(t);
}, K = 255, es = {
  aqua: [0, K, K],
  lime: [0, K, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, K],
  navy: [0, 0, 128],
  white: [K, K, K],
  olive: [128, 128, 0],
  yellow: [K, K, 0],
  orange: [K, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [K, 0, 0],
  pink: [K, 192, 203],
  cyan: [0, K, K],
  transparent: [K, K, K, 0]
}, mr = function(t, e, i) {
  return t += t < 0 ? 1 : t > 1 ? -1 : 0, (t * 6 < 1 ? e + (i - e) * t * 6 : t < 0.5 ? i : t * 3 < 2 ? e + (i - e) * (2 / 3 - t) * 6 : e) * K + 0.5 | 0;
}, Vc = function(t, e, i) {
  var n = t ? ke(t) ? [t >> 16, t >> 8 & K, t & K] : 0 : es.black, r, o, a, h, c, l, d, f, u, g;
  if (!n) {
    if (t.substr(-1) === "," && (t = t.substr(0, t.length - 1)), es[t])
      n = es[t];
    else if (t.charAt(0) === "#") {
      if (t.length < 6 && (r = t.charAt(1), o = t.charAt(2), a = t.charAt(3), t = "#" + r + r + o + o + a + a + (t.length === 5 ? t.charAt(4) + t.charAt(4) : "")), t.length === 9)
        return n = parseInt(t.substr(1, 6), 16), [n >> 16, n >> 8 & K, n & K, parseInt(t.substr(7), 16) / 255];
      t = parseInt(t.substr(1), 16), n = [t >> 16, t >> 8 & K, t & K];
    } else if (t.substr(0, 3) === "hsl") {
      if (n = g = t.match(Kr), !e)
        h = +n[0] % 360 / 360, c = +n[1] / 100, l = +n[2] / 100, o = l <= 0.5 ? l * (c + 1) : l + c - l * c, r = l * 2 - o, n.length > 3 && (n[3] *= 1), n[0] = mr(h + 1 / 3, r, o), n[1] = mr(h, r, o), n[2] = mr(h - 1 / 3, r, o);
      else if (~t.indexOf("="))
        return n = t.match(xc), i && n.length < 4 && (n[3] = 1), n;
    } else
      n = t.match(Kr) || es.transparent;
    n = n.map(Number);
  }
  return e && !g && (r = n[0] / K, o = n[1] / K, a = n[2] / K, d = Math.max(r, o, a), f = Math.min(r, o, a), l = (d + f) / 2, d === f ? h = c = 0 : (u = d - f, c = l > 0.5 ? u / (2 - d - f) : u / (d + f), h = d === r ? (o - a) / u + (o < a ? 6 : 0) : d === o ? (a - r) / u + 2 : (r - o) / u + 4, h *= 60), n[0] = ~~(h + 0.5), n[1] = ~~(c * 100 + 0.5), n[2] = ~~(l * 100 + 0.5)), i && n.length < 4 && (n[3] = 1), n;
}, Nc = function(t) {
  var e = [], i = [], n = -1;
  return t.split(We).forEach(function(r) {
    var o = r.match(bi) || [];
    e.push.apply(e, o), i.push(n += o.length + 1);
  }), e.c = i, e;
}, mh = function(t, e, i) {
  var n = "", r = (t + n).match(We), o = e ? "hsla(" : "rgba(", a = 0, h, c, l, d;
  if (!r)
    return t;
  if (r = r.map(function(f) {
    return (f = Vc(f, e, 1)) && o + (e ? f[0] + "," + f[1] + "%," + f[2] + "%," + f[3] : f.join(",")) + ")";
  }), i && (l = Nc(t), h = i.c, h.join(n) !== l.c.join(n)))
    for (c = t.replace(We, "1").split(bi), d = c.length - 1; a < d; a++)
      n += c[a] + (~h.indexOf(a) ? r.shift() || o + "0,0,0,0)" : (l.length ? l : r.length ? r : i).shift());
  if (!c)
    for (c = t.split(We), d = c.length - 1; a < d; a++)
      n += c[a] + r[a];
  return n + c[d];
}, We = function() {
  var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", t;
  for (t in es)
    s += "|" + t + "\\b";
  return new RegExp(s + ")", "gi");
}(), zm = /hsl[a]?\(/, Hc = function(t) {
  var e = t.join(" "), i;
  if (We.lastIndex = 0, We.test(e))
    return i = zm.test(e), t[1] = mh(t[1], i), t[0] = mh(t[0], i, Nc(t[1])), !0;
}, ys, Ht = function() {
  var s = Date.now, t = 500, e = 33, i = s(), n = i, r = 1e3 / 240, o = r, a = [], h, c, l, d, f, u, g = function p(m) {
    var x = s() - n, y = m === !0, v, w, _, S;
    if ((x > t || x < 0) && (i += x - e), n += x, _ = n - i, v = _ - o, (v > 0 || y) && (S = ++d.frame, f = _ - d.time * 1e3, d.time = _ = _ / 1e3, o += v + (v >= r ? 4 : r - v), w = 1), y || (h = c(p)), w)
      for (u = 0; u < a.length; u++)
        a[u](_, f, S, m);
  };
  return d = {
    time: 0,
    frame: 0,
    tick: function() {
      g(!0);
    },
    deltaRatio: function(m) {
      return f / (1e3 / (m || 60));
    },
    wake: function() {
      bc && (!qr && Eo() && (de = qr = window, Io = de.document || {}, Yt.gsap = zt, (de.gsapVersions || (de.gsapVersions = [])).push(zt.version), wc(hn || de.GreenSockGlobals || !de.gsap && de || {}), Wc.forEach(Gc)), l = typeof requestAnimationFrame < "u" && requestAnimationFrame, h && d.sleep(), c = l || function(m) {
        return setTimeout(m, o - d.time * 1e3 + 1 | 0);
      }, ys = 1, g(2));
    },
    sleep: function() {
      (l ? cancelAnimationFrame : clearTimeout)(h), ys = 0, c = _s;
    },
    lagSmoothing: function(m, x) {
      t = m || 1 / 0, e = Math.min(x || 33, t);
    },
    fps: function(m) {
      r = 1e3 / (m || 240), o = d.time * 1e3 + r;
    },
    add: function(m, x, y) {
      var v = x ? function(w, _, S, C) {
        m(w, _, S, C), d.remove(v);
      } : m;
      return d.remove(m), a[y ? "unshift" : "push"](v), Oi(), v;
    },
    remove: function(m, x) {
      ~(x = a.indexOf(m)) && a.splice(x, 1) && u >= x && u--;
    },
    _listeners: a
  }, d;
}(), Oi = function() {
  return !ys && Ht.wake();
}, N = {}, Um = /^[\d.\-M][\d.\-,\s]/, Wm = /["']/g, Gm = function(t) {
  for (var e = {}, i = t.substr(1, t.length - 3).split(":"), n = i[0], r = 1, o = i.length, a, h, c; r < o; r++)
    h = i[r], a = r !== o - 1 ? h.lastIndexOf(",") : h.length, c = h.substr(0, a), e[n] = isNaN(c) ? c.replace(Wm, "").trim() : +c, n = h.substr(a + 1).trim();
  return e;
}, Vm = function(t) {
  var e = t.indexOf("(") + 1, i = t.indexOf(")"), n = t.indexOf("(", e);
  return t.substring(e, ~n && n < i ? t.indexOf(")", i + 1) : i);
}, Nm = function(t) {
  var e = (t + "").split("("), i = N[e[0]];
  return i && e.length > 1 && i.config ? i.config.apply(null, ~t.indexOf("{") ? [Gm(e[1])] : Vm(t).split(",").map(Mc)) : N._CE && Um.test(t) ? N._CE("", t) : i;
}, $c = function(t) {
  return function(e) {
    return 1 - t(1 - e);
  };
}, jc = function s(t, e) {
  for (var i = t._first, n; i; )
    i instanceof Bt ? s(i, e) : i.vars.yoyoEase && (!i._yoyo || !i._repeat) && i._yoyo !== e && (i.timeline ? s(i.timeline, e) : (n = i._ease, i._ease = i._yEase, i._yEase = n, i._yoyo = e)), i = i._next;
}, ri = function(t, e) {
  return t && (at(t) ? t : N[t] || Nm(t)) || e;
}, ui = function(t, e, i, n) {
  i === void 0 && (i = function(h) {
    return 1 - e(1 - h);
  }), n === void 0 && (n = function(h) {
    return h < 0.5 ? e(h * 2) / 2 : 1 - e((1 - h) * 2) / 2;
  });
  var r = {
    easeIn: e,
    easeOut: i,
    easeInOut: n
  }, o;
  return Lt(t, function(a) {
    N[a] = Yt[a] = r, N[o = a.toLowerCase()] = i;
    for (var h in r)
      N[o + (h === "easeIn" ? ".in" : h === "easeOut" ? ".out" : ".inOut")] = N[a + "." + h] = r[h];
  }), r;
}, Yc = function(t) {
  return function(e) {
    return e < 0.5 ? (1 - t(1 - e * 2)) / 2 : 0.5 + t((e - 0.5) * 2) / 2;
  };
}, _r = function s(t, e, i) {
  var n = e >= 1 ? e : 1, r = (i || (t ? 0.3 : 0.45)) / (e < 1 ? e : 1), o = r / Xr * (Math.asin(1 / n) || 0), a = function(l) {
    return l === 1 ? 1 : n * Math.pow(2, -10 * l) * _m((l - o) * r) + 1;
  }, h = t === "out" ? a : t === "in" ? function(c) {
    return 1 - a(1 - c);
  } : Yc(a);
  return r = Xr / r, h.config = function(c, l) {
    return s(t, c, l);
  }, h;
}, xr = function s(t, e) {
  e === void 0 && (e = 1.70158);
  var i = function(o) {
    return o ? --o * o * ((e + 1) * o + e) + 1 : 0;
  }, n = t === "out" ? i : t === "in" ? function(r) {
    return 1 - i(1 - r);
  } : Yc(i);
  return n.config = function(r) {
    return s(t, r);
  }, n;
};
Lt("Linear,Quad,Cubic,Quart,Quint,Strong", function(s, t) {
  var e = t < 5 ? t + 1 : t;
  ui(s + ",Power" + (e - 1), t ? function(i) {
    return Math.pow(i, e);
  } : function(i) {
    return i;
  }, function(i) {
    return 1 - Math.pow(1 - i, e);
  }, function(i) {
    return i < 0.5 ? Math.pow(i * 2, e) / 2 : 1 - Math.pow((1 - i) * 2, e) / 2;
  });
});
N.Linear.easeNone = N.none = N.Linear.easeIn;
ui("Elastic", _r("in"), _r("out"), _r());
(function(s, t) {
  var e = 1 / t, i = 2 * e, n = 2.5 * e, r = function(a) {
    return a < e ? s * a * a : a < i ? s * Math.pow(a - 1.5 / t, 2) + 0.75 : a < n ? s * (a -= 2.25 / t) * a + 0.9375 : s * Math.pow(a - 2.625 / t, 2) + 0.984375;
  };
  ui("Bounce", function(o) {
    return 1 - r(1 - o);
  }, r);
})(7.5625, 2.75);
ui("Expo", function(s) {
  return s ? Math.pow(2, 10 * (s - 1)) : 0;
});
ui("Circ", function(s) {
  return -(mc(1 - s * s) - 1);
});
ui("Sine", function(s) {
  return s === 1 ? 1 : -mm(s * pm) + 1;
});
ui("Back", xr("in"), xr("out"), xr());
N.SteppedEase = N.steps = Yt.SteppedEase = {
  config: function(t, e) {
    t === void 0 && (t = 1);
    var i = 1 / t, n = t + (e ? 0 : 1), r = e ? 1 : 0, o = 1 - q;
    return function(a) {
      return ((n * Ms(0, o, a) | 0) + r) * i;
    };
  }
};
Ri.ease = N["quad.out"];
Lt("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(s) {
  return Fo += s + "," + s + "Params,";
});
var Xc = function(t, e) {
  this.id = gm++, t._gsap = this, this.target = t, this.harness = e, this.get = e ? e.get : Cc, this.set = e ? e.getSetter : Uo;
}, vs = /* @__PURE__ */ function() {
  function s(e) {
    this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat === 1 / 0 ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, Li(this, +e.duration, 1, 1), this.data = e.data, tt && (this._ctx = tt, tt.data.push(this)), ys || Ht.wake();
  }
  var t = s.prototype;
  return t.delay = function(i) {
    return i || i === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + i - this._delay), this._delay = i, this) : this._delay;
  }, t.duration = function(i) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? i + (i + this._rDelay) * this._repeat : i) : this.totalDuration() && this._dur;
  }, t.totalDuration = function(i) {
    return arguments.length ? (this._dirty = 0, Li(this, this._repeat < 0 ? i : (i - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
  }, t.totalTime = function(i, n) {
    if (Oi(), !arguments.length)
      return this._tTime;
    var r = this._dp;
    if (r && r.smoothChildTiming && this._ts) {
      for (kn(this, i), !r._dp || r.parent || Ec(r, this); r && r.parent; )
        r.parent._time !== r._start + (r._ts >= 0 ? r._tTime / r._ts : (r.totalDuration() - r._tTime) / -r._ts) && r.totalTime(r._tTime, !0), r = r.parent;
      !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && i < this._tDur || this._ts < 0 && i > 0 || !this._tDur && !i) && fe(this._dp, this, this._start - this._delay);
    }
    return (this._tTime !== i || !this._dur && !n || this._initted && Math.abs(this._zTime) === q || !i && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = i), Pc(this, i, n)), this;
  }, t.time = function(i, n) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), i + fh(this)) % (this._dur + this._rDelay) || (i ? this._dur : 0), n) : this._time;
  }, t.totalProgress = function(i, n) {
    return arguments.length ? this.totalTime(this.totalDuration() * i, n) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0;
  }, t.progress = function(i, n) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - i : i) + fh(this), n) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  }, t.iteration = function(i, n) {
    var r = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (i - 1) * r, n) : this._repeat ? Fi(this._tTime, r) + 1 : 1;
  }, t.timeScale = function(i, n) {
    if (!arguments.length)
      return this._rts === -q ? 0 : this._rts;
    if (this._rts === i)
      return this;
    var r = this.parent && this._ts ? un(this.parent._time, this) : this._tTime;
    return this._rts = +i || 0, this._ts = this._ps || i === -q ? 0 : this._rts, this.totalTime(Ms(-Math.abs(this._delay), this._tDur, r), n !== !1), Tn(this), Am(this);
  }, t.paused = function(i) {
    return arguments.length ? (this._ps !== i && (this._ps = i, i ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Oi(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== q && (this._tTime -= q)))), this) : this._ps;
  }, t.startTime = function(i) {
    if (arguments.length) {
      this._start = i;
      var n = this.parent || this._dp;
      return n && (n._sort || !this.parent) && fe(n, this, i - this._delay), this;
    }
    return this._start;
  }, t.endTime = function(i) {
    return this._start + (Ft(i) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  }, t.rawTime = function(i) {
    var n = this.parent || this._dp;
    return n ? i && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? un(n.rawTime(i), this) : this._tTime : this._tTime;
  }, t.revert = function(i) {
    i === void 0 && (i = vm);
    var n = Mt;
    return Mt = i, (this._initted || this._startAt) && (this.timeline && this.timeline.revert(i), this.totalTime(-0.01, i.suppressEvents)), this.data !== "nested" && i.kill !== !1 && this.kill(), Mt = n, this;
  }, t.globalTime = function(i) {
    for (var n = this, r = arguments.length ? i : n.rawTime(); n; )
      r = n._start + r / (Math.abs(n._ts) || 1), n = n._dp;
    return !this.parent && this._sat ? this._sat.globalTime(i) : r;
  }, t.repeat = function(i) {
    return arguments.length ? (this._repeat = i === 1 / 0 ? -2 : i, ph(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
  }, t.repeatDelay = function(i) {
    if (arguments.length) {
      var n = this._time;
      return this._rDelay = i, ph(this), n ? this.time(n) : this;
    }
    return this._rDelay;
  }, t.yoyo = function(i) {
    return arguments.length ? (this._yoyo = i, this) : this._yoyo;
  }, t.seek = function(i, n) {
    return this.totalTime(Xt(this, i), Ft(n));
  }, t.restart = function(i, n) {
    return this.play().totalTime(i ? -this._delay : 0, Ft(n));
  }, t.play = function(i, n) {
    return i != null && this.seek(i, n), this.reversed(!1).paused(!1);
  }, t.reverse = function(i, n) {
    return i != null && this.seek(i || this.totalDuration(), n), this.reversed(!0).paused(!1);
  }, t.pause = function(i, n) {
    return i != null && this.seek(i, n), this.paused(!0);
  }, t.resume = function() {
    return this.paused(!1);
  }, t.reversed = function(i) {
    return arguments.length ? (!!i !== this.reversed() && this.timeScale(-this._rts || (i ? -q : 0)), this) : this._rts < 0;
  }, t.invalidate = function() {
    return this._initted = this._act = 0, this._zTime = -q, this;
  }, t.isActive = function() {
    var i = this.parent || this._dp, n = this._start, r;
    return !!(!i || this._ts && this._initted && i.isActive() && (r = i.rawTime(!0)) >= n && r < this.endTime(!0) - q);
  }, t.eventCallback = function(i, n, r) {
    var o = this.vars;
    return arguments.length > 1 ? (n ? (o[i] = n, r && (o[i + "Params"] = r), i === "onUpdate" && (this._onUpdate = n)) : delete o[i], this) : o[i];
  }, t.then = function(i) {
    var n = this;
    return new Promise(function(r) {
      var o = at(i) ? i : Tc, a = function() {
        var c = n.then;
        n.then = null, at(o) && (o = o(n)) && (o.then || o === n) && (n.then = c), r(o), n.then = c;
      };
      n._initted && n.totalProgress() === 1 && n._ts >= 0 || !n._tTime && n._ts < 0 ? a() : n._prom = a;
    });
  }, t.kill = function() {
    ts(this);
  }, s;
}();
Jt(vs.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: !1,
  parent: null,
  _initted: !1,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -q,
  _prom: 0,
  _ps: !1,
  _rts: 1
});
var Bt = /* @__PURE__ */ function(s) {
  gc(t, s);
  function t(i, n) {
    var r;
    return i === void 0 && (i = {}), r = s.call(this, i) || this, r.labels = {}, r.smoothChildTiming = !!i.smoothChildTiming, r.autoRemoveChildren = !!i.autoRemoveChildren, r._sort = Ft(i.sortChildren), it && fe(i.parent || it, Ae(r), n), i.reversed && r.reverse(), i.paused && r.paused(!0), i.scrollTrigger && Ic(Ae(r), i.scrollTrigger), r;
  }
  var e = t.prototype;
  return e.to = function(n, r, o) {
    return as(0, arguments, this), this;
  }, e.from = function(n, r, o) {
    return as(1, arguments, this), this;
  }, e.fromTo = function(n, r, o, a) {
    return as(2, arguments, this), this;
  }, e.set = function(n, r, o) {
    return r.duration = 0, r.parent = this, os(r).repeatDelay || (r.repeat = 0), r.immediateRender = !!r.immediateRender, new dt(n, r, Xt(this, o), 1), this;
  }, e.call = function(n, r, o) {
    return fe(this, dt.delayedCall(0, n, r), o);
  }, e.staggerTo = function(n, r, o, a, h, c, l) {
    return o.duration = r, o.stagger = o.stagger || a, o.onComplete = c, o.onCompleteParams = l, o.parent = this, new dt(n, o, Xt(this, h)), this;
  }, e.staggerFrom = function(n, r, o, a, h, c, l) {
    return o.runBackwards = 1, os(o).immediateRender = Ft(o.immediateRender), this.staggerTo(n, r, o, a, h, c, l);
  }, e.staggerFromTo = function(n, r, o, a, h, c, l, d) {
    return a.startAt = o, os(a).immediateRender = Ft(a.immediateRender), this.staggerTo(n, r, a, h, c, l, d);
  }, e.render = function(n, r, o) {
    var a = this._time, h = this._dirty ? this.totalDuration() : this._tDur, c = this._dur, l = n <= 0 ? 0 : bt(n), d = this._zTime < 0 != n < 0 && (this._initted || !c), f, u, g, p, m, x, y, v, w, _, S, C;
    if (this !== it && l > h && n >= 0 && (l = h), l !== this._tTime || o || d) {
      if (a !== this._time && c && (l += this._time - a, n += this._time - a), f = l, w = this._start, v = this._ts, x = !v, d && (c || (a = this._zTime), (n || !r) && (this._zTime = n)), this._repeat) {
        if (S = this._yoyo, m = c + this._rDelay, this._repeat < -1 && n < 0)
          return this.totalTime(m * 100 + n, r, o);
        if (f = bt(l % m), l === h ? (p = this._repeat, f = c) : (p = ~~(l / m), p && p === l / m && (f = c, p--), f > c && (f = c)), _ = Fi(this._tTime, m), !a && this._tTime && _ !== p && this._tTime - _ * m - this._dur <= 0 && (_ = p), S && p & 1 && (f = c - f, C = 1), p !== _ && !this._lock) {
          var b = S && _ & 1, A = b === (S && p & 1);
          if (p < _ && (b = !b), a = b ? 0 : l % c ? c : l, this._lock = 1, this.render(a || (C ? 0 : bt(p * m)), r, !c)._lock = 0, this._tTime = l, !r && this.parent && $t(this, "onRepeat"), this.vars.repeatRefresh && !C && (this.invalidate()._lock = 1), a && a !== this._time || x !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
            return this;
          if (c = this._dur, h = this._tDur, A && (this._lock = 2, a = b ? c : -1e-4, this.render(a, !0), this.vars.repeatRefresh && !C && this.invalidate()), this._lock = 0, !this._ts && !x)
            return this;
          jc(this, C);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2 && (y = Tm(this, bt(a), bt(f)), y && (l -= f - (f = y._start))), this._tTime = l, this._time = f, this._act = !v, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = n, a = 0), !a && f && !r && !p && ($t(this, "onStart"), this._tTime !== l))
        return this;
      if (f >= a && n >= 0)
        for (u = this._first; u; ) {
          if (g = u._next, (u._act || f >= u._start) && u._ts && y !== u) {
            if (u.parent !== this)
              return this.render(n, r, o);
            if (u.render(u._ts > 0 ? (f - u._start) * u._ts : (u._dirty ? u.totalDuration() : u._tDur) + (f - u._start) * u._ts, r, o), f !== this._time || !this._ts && !x) {
              y = 0, g && (l += this._zTime = -q);
              break;
            }
          }
          u = g;
        }
      else {
        u = this._last;
        for (var P = n < 0 ? n : f; u; ) {
          if (g = u._prev, (u._act || P <= u._end) && u._ts && y !== u) {
            if (u.parent !== this)
              return this.render(n, r, o);
            if (u.render(u._ts > 0 ? (P - u._start) * u._ts : (u._dirty ? u.totalDuration() : u._tDur) + (P - u._start) * u._ts, r, o || Mt && (u._initted || u._startAt)), f !== this._time || !this._ts && !x) {
              y = 0, g && (l += this._zTime = P ? -q : q);
              break;
            }
          }
          u = g;
        }
      }
      if (y && !r && (this.pause(), y.render(f >= a ? 0 : -q)._zTime = f >= a ? 1 : -1, this._ts))
        return this._start = w, Tn(this), this.render(n, r, o);
      this._onUpdate && !r && $t(this, "onUpdate", !0), (l === h && this._tTime >= this.totalDuration() || !l && a) && (w === this._start || Math.abs(v) !== Math.abs(this._ts)) && (this._lock || ((n || !c) && (l === h && this._ts > 0 || !l && this._ts < 0) && Ge(this, 1), !r && !(n < 0 && !a) && (l || a || !h) && ($t(this, l === h && n >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(l < h && this.timeScale() > 0) && this._prom())));
    }
    return this;
  }, e.add = function(n, r) {
    var o = this;
    if (ke(r) || (r = Xt(this, r, n)), !(n instanceof vs)) {
      if (Tt(n))
        return n.forEach(function(a) {
          return o.add(a, r);
        }), this;
      if (wt(n))
        return this.addLabel(n, r);
      if (at(n))
        n = dt.delayedCall(0, n);
      else
        return this;
    }
    return this !== n ? fe(this, n, r) : this;
  }, e.getChildren = function(n, r, o, a) {
    n === void 0 && (n = !0), r === void 0 && (r = !0), o === void 0 && (o = !0), a === void 0 && (a = -Zt);
    for (var h = [], c = this._first; c; )
      c._start >= a && (c instanceof dt ? r && h.push(c) : (o && h.push(c), n && h.push.apply(h, c.getChildren(!0, r, o)))), c = c._next;
    return h;
  }, e.getById = function(n) {
    for (var r = this.getChildren(1, 1, 1), o = r.length; o--; )
      if (r[o].vars.id === n)
        return r[o];
  }, e.remove = function(n) {
    return wt(n) ? this.removeLabel(n) : at(n) ? this.killTweensOf(n) : (Mn(this, n), n === this._recent && (this._recent = this._last), ni(this));
  }, e.totalTime = function(n, r) {
    return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = bt(Ht.time - (this._ts > 0 ? n / this._ts : (this.totalDuration() - n) / -this._ts))), s.prototype.totalTime.call(this, n, r), this._forcing = 0, this) : this._tTime;
  }, e.addLabel = function(n, r) {
    return this.labels[n] = Xt(this, r), this;
  }, e.removeLabel = function(n) {
    return delete this.labels[n], this;
  }, e.addPause = function(n, r, o) {
    var a = dt.delayedCall(0, r || _s, o);
    return a.data = "isPause", this._hasPause = 1, fe(this, a, Xt(this, n));
  }, e.removePause = function(n) {
    var r = this._first;
    for (n = Xt(this, n); r; )
      r._start === n && r.data === "isPause" && Ge(r), r = r._next;
  }, e.killTweensOf = function(n, r, o) {
    for (var a = this.getTweensOf(n, o), h = a.length; h--; )
      Le !== a[h] && a[h].kill(n, r);
    return this;
  }, e.getTweensOf = function(n, r) {
    for (var o = [], a = Qt(n), h = this._first, c = ke(r), l; h; )
      h instanceof dt ? bm(h._targets, a) && (c ? (!Le || h._initted && h._ts) && h.globalTime(0) <= r && h.globalTime(h.totalDuration()) > r : !r || h.isActive()) && o.push(h) : (l = h.getTweensOf(a, r)).length && o.push.apply(o, l), h = h._next;
    return o;
  }, e.tweenTo = function(n, r) {
    r = r || {};
    var o = this, a = Xt(o, n), h = r, c = h.startAt, l = h.onStart, d = h.onStartParams, f = h.immediateRender, u, g = dt.to(o, Jt({
      ease: r.ease || "none",
      lazy: !1,
      immediateRender: !1,
      time: a,
      overwrite: "auto",
      duration: r.duration || Math.abs((a - (c && "time" in c ? c.time : o._time)) / o.timeScale()) || q,
      onStart: function() {
        if (o.pause(), !u) {
          var m = r.duration || Math.abs((a - (c && "time" in c ? c.time : o._time)) / o.timeScale());
          g._dur !== m && Li(g, m, 0, 1).render(g._time, !0, !0), u = 1;
        }
        l && l.apply(g, d || []);
      }
    }, r));
    return f ? g.render(0) : g;
  }, e.tweenFromTo = function(n, r, o) {
    return this.tweenTo(r, Jt({
      startAt: {
        time: Xt(this, n)
      }
    }, o));
  }, e.recent = function() {
    return this._recent;
  }, e.nextLabel = function(n) {
    return n === void 0 && (n = this._time), gh(this, Xt(this, n));
  }, e.previousLabel = function(n) {
    return n === void 0 && (n = this._time), gh(this, Xt(this, n), 1);
  }, e.currentLabel = function(n) {
    return arguments.length ? this.seek(n, !0) : this.previousLabel(this._time + q);
  }, e.shiftChildren = function(n, r, o) {
    o === void 0 && (o = 0);
    for (var a = this._first, h = this.labels, c; a; )
      a._start >= o && (a._start += n, a._end += n), a = a._next;
    if (r)
      for (c in h)
        h[c] >= o && (h[c] += n);
    return ni(this);
  }, e.invalidate = function(n) {
    var r = this._first;
    for (this._lock = 0; r; )
      r.invalidate(n), r = r._next;
    return s.prototype.invalidate.call(this, n);
  }, e.clear = function(n) {
    n === void 0 && (n = !0);
    for (var r = this._first, o; r; )
      o = r._next, this.remove(r), r = o;
    return this._dp && (this._time = this._tTime = this._pTime = 0), n && (this.labels = {}), ni(this);
  }, e.totalDuration = function(n) {
    var r = 0, o = this, a = o._last, h = Zt, c, l, d;
    if (arguments.length)
      return o.timeScale((o._repeat < 0 ? o.duration() : o.totalDuration()) / (o.reversed() ? -n : n));
    if (o._dirty) {
      for (d = o.parent; a; )
        c = a._prev, a._dirty && a.totalDuration(), l = a._start, l > h && o._sort && a._ts && !o._lock ? (o._lock = 1, fe(o, a, l - a._delay, 1)._lock = 0) : h = l, l < 0 && a._ts && (r -= l, (!d && !o._dp || d && d.smoothChildTiming) && (o._start += l / o._ts, o._time -= l, o._tTime -= l), o.shiftChildren(-l, !1, -1 / 0), h = 0), a._end > r && a._ts && (r = a._end), a = c;
      Li(o, o === it && o._time > r ? o._time : r, 1, 1), o._dirty = 0;
    }
    return o._tDur;
  }, t.updateRoot = function(n) {
    if (it._ts && (Pc(it, un(n, it)), Ac = Ht.frame), Ht.frame >= uh) {
      uh += jt.autoSleep || 120;
      var r = it._first;
      if ((!r || !r._ts) && jt.autoSleep && Ht._listeners.length < 2) {
        for (; r && !r._ts; )
          r = r._next;
        r || Ht.sleep();
      }
    }
  }, t;
}(vs);
Jt(Bt.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var Hm = function(t, e, i, n, r, o, a) {
  var h = new Ot(this._pt, t, e, 0, 1, tu, null, r), c = 0, l = 0, d, f, u, g, p, m, x, y;
  for (h.b = i, h.e = n, i += "", n += "", (x = ~n.indexOf("random(")) && (n = xs(n)), o && (y = [i, n], o(y, t, e), i = y[0], n = y[1]), f = i.match(pr) || []; d = pr.exec(n); )
    g = d[0], p = n.substring(c, d.index), u ? u = (u + 1) % 5 : p.substr(-5) === "rgba(" && (u = 1), g !== f[l++] && (m = parseFloat(f[l - 1]) || 0, h._pt = {
      _next: h._pt,
      p: p || l === 1 ? p : ",",
      //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
      s: m,
      c: g.charAt(1) === "=" ? Mi(m, g) - m : parseFloat(g) - m,
      m: u && u < 4 ? Math.round : 0
    }, c = pr.lastIndex);
  return h.c = c < n.length ? n.substring(c, n.length) : "", h.fp = a, (yc.test(n) || x) && (h.e = 0), this._pt = h, h;
}, Oo = function(t, e, i, n, r, o, a, h, c, l) {
  at(n) && (n = n(r || 0, t, o));
  var d = t[e], f = i !== "get" ? i : at(d) ? c ? t[e.indexOf("set") || !at(t["get" + e.substr(3)]) ? e : "get" + e.substr(3)](c) : t[e]() : d, u = at(d) ? c ? Km : Qc : zo, g;
  if (wt(n) && (~n.indexOf("random(") && (n = xs(n)), n.charAt(1) === "=" && (g = Mi(f, n) + (At(f) || 0), (g || g === 0) && (n = g))), !l || f !== n || so)
    return !isNaN(f * n) && n !== "" ? (g = new Ot(this._pt, t, e, +f || 0, n - (f || 0), typeof d == "boolean" ? Zm : Jc, 0, u), c && (g.fp = c), a && g.modifier(a, this, t), this._pt = g) : (!d && !(e in t) && Bo(e, n), Hm.call(this, t, e, f, n, u, h || jt.stringFilter, c));
}, $m = function(t, e, i, n, r) {
  if (at(t) && (t = hs(t, r, e, i, n)), !ye(t) || t.style && t.nodeType || Tt(t) || _c(t))
    return wt(t) ? hs(t, r, e, i, n) : t;
  var o = {}, a;
  for (a in t)
    o[a] = hs(t[a], r, e, i, n);
  return o;
}, Kc = function(t, e, i, n, r, o) {
  var a, h, c, l;
  if (Nt[t] && (a = new Nt[t]()).init(r, a.rawVars ? e[t] : $m(e[t], n, r, o, i), i, n, o) !== !1 && (i._pt = h = new Ot(i._pt, r, t, 0, 1, a.render, a, 0, a.priority), i !== wi))
    for (c = i._ptLookup[i._targets.indexOf(r)], l = a._props.length; l--; )
      c[a._props[l]] = h;
  return a;
}, Le, so, Do = function s(t, e, i) {
  var n = t.vars, r = n.ease, o = n.startAt, a = n.immediateRender, h = n.lazy, c = n.onUpdate, l = n.runBackwards, d = n.yoyoEase, f = n.keyframes, u = n.autoRevert, g = t._dur, p = t._startAt, m = t._targets, x = t.parent, y = x && x.data === "nested" ? x.vars.targets : m, v = t._overwrite === "auto" && !To, w = t.timeline, _, S, C, b, A, P, M, T, k, E, I, B, R;
  if (w && (!f || !r) && (r = "none"), t._ease = ri(r, Ri.ease), t._yEase = d ? $c(ri(d === !0 ? r : d, Ri.ease)) : 0, d && t._yoyo && !t._repeat && (d = t._yEase, t._yEase = t._ease, t._ease = d), t._from = !w && !!n.runBackwards, !w || f && !n.stagger) {
    if (T = m[0] ? si(m[0]).harness : 0, B = T && n[T.prop], _ = cn(n, Ro), p && (p._zTime < 0 && p.progress(1), e < 0 && l && a && !u ? p.render(-1, !0) : p.revert(l && g ? Qs : ym), p._lazy = 0), o) {
      if (Ge(t._startAt = dt.set(m, Jt({
        data: "isStart",
        overwrite: !1,
        parent: x,
        immediateRender: !0,
        lazy: !p && Ft(h),
        startAt: null,
        delay: 0,
        onUpdate: c && function() {
          return $t(t, "onUpdate");
        },
        stagger: 0
      }, o))), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (Mt || !a && !u) && t._startAt.revert(Qs), a && g && e <= 0 && i <= 0) {
        e && (t._zTime = e);
        return;
      }
    } else if (l && g && !p) {
      if (e && (a = !1), C = Jt({
        overwrite: !1,
        data: "isFromStart",
        //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
        lazy: a && !p && Ft(h),
        immediateRender: a,
        //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
        stagger: 0,
        parent: x
        //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
      }, _), B && (C[T.prop] = B), Ge(t._startAt = dt.set(m, C)), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (Mt ? t._startAt.revert(Qs) : t._startAt.render(-1, !0)), t._zTime = e, !a)
        s(t._startAt, q, q);
      else if (!e)
        return;
    }
    for (t._pt = t._ptCache = 0, h = g && Ft(h) || h && !g, S = 0; S < m.length; S++) {
      if (A = m[S], M = A._gsap || Lo(m)[S]._gsap, t._ptLookup[S] = E = {}, Zr[M.id] && Ue.length && ln(), I = y === m ? S : y.indexOf(A), T && (k = new T()).init(A, B || _, t, I, y) !== !1 && (t._pt = b = new Ot(t._pt, A, k.name, 0, 1, k.render, k, 0, k.priority), k._props.forEach(function(z) {
        E[z] = b;
      }), k.priority && (P = 1)), !T || B)
        for (C in _)
          Nt[C] && (k = Kc(C, _, t, I, A, y)) ? k.priority && (P = 1) : E[C] = b = Oo.call(t, A, C, "get", _[C], I, y, 0, n.stringFilter);
      t._op && t._op[S] && t.kill(A, t._op[S]), v && t._pt && (Le = t, it.killTweensOf(A, E, t.globalTime(e)), R = !t.parent, Le = 0), t._pt && h && (Zr[M.id] = 1);
    }
    P && eu(t), t._onInit && t._onInit(t);
  }
  t._onUpdate = c, t._initted = (!t._op || t._pt) && !R, f && e <= 0 && w.render(Zt, !0, !0);
}, jm = function(t, e, i, n, r, o, a, h) {
  var c = (t._pt && t._ptCache || (t._ptCache = {}))[e], l, d, f, u;
  if (!c)
    for (c = t._ptCache[e] = [], f = t._ptLookup, u = t._targets.length; u--; ) {
      if (l = f[u][e], l && l.d && l.d._pt)
        for (l = l.d._pt; l && l.p !== e && l.fp !== e; )
          l = l._next;
      if (!l)
        return so = 1, t.vars[e] = "+=0", Do(t, a), so = 0, h ? ms(e + " not eligible for reset") : 1;
      c.push(l);
    }
  for (u = c.length; u--; )
    d = c[u], l = d._pt || d, l.s = (n || n === 0) && !r ? n : l.s + (n || 0) + o * l.c, l.c = i - l.s, d.e && (d.e = ct(i) + At(d.e)), d.b && (d.b = l.s + At(d.b));
}, Ym = function(t, e) {
  var i = t[0] ? si(t[0]).harness : 0, n = i && i.aliases, r, o, a, h;
  if (!n)
    return e;
  r = li({}, e);
  for (o in n)
    if (o in r)
      for (h = n[o].split(","), a = h.length; a--; )
        r[h[a]] = r[o];
  return r;
}, Xm = function(t, e, i, n) {
  var r = e.ease || n || "power1.inOut", o, a;
  if (Tt(e))
    a = i[t] || (i[t] = []), e.forEach(function(h, c) {
      return a.push({
        t: c / (e.length - 1) * 100,
        v: h,
        e: r
      });
    });
  else
    for (o in e)
      a = i[o] || (i[o] = []), o === "ease" || a.push({
        t: parseFloat(t),
        v: e[o],
        e: r
      });
}, hs = function(t, e, i, n, r) {
  return at(t) ? t.call(e, i, n, r) : wt(t) && ~t.indexOf("random(") ? xs(t) : t;
}, qc = Fo + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", Zc = {};
Lt(qc + ",id,stagger,delay,duration,paused,scrollTrigger", function(s) {
  return Zc[s] = 1;
});
var dt = /* @__PURE__ */ function(s) {
  gc(t, s);
  function t(i, n, r, o) {
    var a;
    typeof n == "number" && (r.duration = n, n = r, r = null), a = s.call(this, o ? n : os(n)) || this;
    var h = a.vars, c = h.duration, l = h.delay, d = h.immediateRender, f = h.stagger, u = h.overwrite, g = h.keyframes, p = h.defaults, m = h.scrollTrigger, x = h.yoyoEase, y = n.parent || it, v = (Tt(i) || _c(i) ? ke(i[0]) : "length" in n) ? [i] : Qt(i), w, _, S, C, b, A, P, M;
    if (a._targets = v.length ? Lo(v) : ms("GSAP target " + i + " not found. https://gsap.com", !jt.nullTargetWarn) || [], a._ptLookup = [], a._overwrite = u, g || f || js(c) || js(l)) {
      if (n = a.vars, w = a.timeline = new Bt({
        data: "nested",
        defaults: p || {},
        targets: y && y.data === "nested" ? y.vars.targets : v
      }), w.kill(), w.parent = w._dp = Ae(a), w._start = 0, f || js(c) || js(l)) {
        if (C = v.length, P = f && Lc(f), ye(f))
          for (b in f)
            ~qc.indexOf(b) && (M || (M = {}), M[b] = f[b]);
        for (_ = 0; _ < C; _++)
          S = cn(n, Zc), S.stagger = 0, x && (S.yoyoEase = x), M && li(S, M), A = v[_], S.duration = +hs(c, Ae(a), _, A, v), S.delay = (+hs(l, Ae(a), _, A, v) || 0) - a._delay, !f && C === 1 && S.delay && (a._delay = l = S.delay, a._start += l, S.delay = 0), w.to(A, S, P ? P(_, A, v) : 0), w._ease = N.none;
        w.duration() ? c = l = 0 : a.timeline = 0;
      } else if (g) {
        os(Jt(w.vars.defaults, {
          ease: "none"
        })), w._ease = ri(g.ease || n.ease || "none");
        var T = 0, k, E, I;
        if (Tt(g))
          g.forEach(function(B) {
            return w.to(v, B, ">");
          }), w.duration();
        else {
          S = {};
          for (b in g)
            b === "ease" || b === "easeEach" || Xm(b, g[b], S, g.easeEach);
          for (b in S)
            for (k = S[b].sort(function(B, R) {
              return B.t - R.t;
            }), T = 0, _ = 0; _ < k.length; _++)
              E = k[_], I = {
                ease: E.e,
                duration: (E.t - (_ ? k[_ - 1].t : 0)) / 100 * c
              }, I[b] = E.v, w.to(v, I, T), T += I.duration;
          w.duration() < c && w.to({}, {
            duration: c - w.duration()
          });
        }
      }
      c || a.duration(c = w.duration());
    } else
      a.timeline = 0;
    return u === !0 && !To && (Le = Ae(a), it.killTweensOf(v), Le = 0), fe(y, Ae(a), r), n.reversed && a.reverse(), n.paused && a.paused(!0), (d || !c && !g && a._start === bt(y._time) && Ft(d) && Cm(Ae(a)) && y.data !== "nested") && (a._tTime = -q, a.render(Math.max(0, -l) || 0)), m && Ic(Ae(a), m), a;
  }
  var e = t.prototype;
  return e.render = function(n, r, o) {
    var a = this._time, h = this._tDur, c = this._dur, l = n < 0, d = n > h - q && !l ? h : n < q ? 0 : n, f, u, g, p, m, x, y, v, w;
    if (!c)
      Mm(this, n, r, o);
    else if (d !== this._tTime || !n || o || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== l) {
      if (f = d, v = this.timeline, this._repeat) {
        if (p = c + this._rDelay, this._repeat < -1 && l)
          return this.totalTime(p * 100 + n, r, o);
        if (f = bt(d % p), d === h ? (g = this._repeat, f = c) : (g = ~~(d / p), g && g === bt(d / p) && (f = c, g--), f > c && (f = c)), x = this._yoyo && g & 1, x && (w = this._yEase, f = c - f), m = Fi(this._tTime, p), f === a && !o && this._initted && g === m)
          return this._tTime = d, this;
        g !== m && (v && this._yEase && jc(v, x), this.vars.repeatRefresh && !x && !this._lock && this._time !== p && this._initted && (this._lock = o = 1, this.render(bt(p * g), !0).invalidate()._lock = 0));
      }
      if (!this._initted) {
        if (Bc(this, l ? n : f, o, r, d))
          return this._tTime = 0, this;
        if (a !== this._time && !(o && this.vars.repeatRefresh && g !== m))
          return this;
        if (c !== this._dur)
          return this.render(n, r, o);
      }
      if (this._tTime = d, this._time = f, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = y = (w || this._ease)(f / c), this._from && (this.ratio = y = 1 - y), f && !a && !r && !g && ($t(this, "onStart"), this._tTime !== d))
        return this;
      for (u = this._pt; u; )
        u.r(y, u.d), u = u._next;
      v && v.render(n < 0 ? n : v._dur * v._ease(f / this._dur), r, o) || this._startAt && (this._zTime = n), this._onUpdate && !r && (l && Qr(this, n, r, o), $t(this, "onUpdate")), this._repeat && g !== m && this.vars.onRepeat && !r && this.parent && $t(this, "onRepeat"), (d === this._tDur || !d) && this._tTime === d && (l && !this._onUpdate && Qr(this, n, !0, !0), (n || !c) && (d === this._tDur && this._ts > 0 || !d && this._ts < 0) && Ge(this, 1), !r && !(l && !a) && (d || a || x) && ($t(this, d === h ? "onComplete" : "onReverseComplete", !0), this._prom && !(d < h && this.timeScale() > 0) && this._prom()));
    }
    return this;
  }, e.targets = function() {
    return this._targets;
  }, e.invalidate = function(n) {
    return (!n || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(n), s.prototype.invalidate.call(this, n);
  }, e.resetTo = function(n, r, o, a, h) {
    ys || Ht.wake(), this._ts || this.play();
    var c = Math.min(this._dur, (this._dp._time - this._start) * this._ts), l;
    return this._initted || Do(this, c), l = this._ease(c / this._dur), jm(this, n, r, o, a, l, c, h) ? this.resetTo(n, r, o, a, 1) : (kn(this, 0), this.parent || kc(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
  }, e.kill = function(n, r) {
    if (r === void 0 && (r = "all"), !n && (!r || r === "all"))
      return this._lazy = this._pt = 0, this.parent ? ts(this) : this;
    if (this.timeline) {
      var o = this.timeline.totalDuration();
      return this.timeline.killTweensOf(n, r, Le && Le.vars.overwrite !== !0)._first || ts(this), this.parent && o !== this.timeline.totalDuration() && Li(this, this._dur * this.timeline._tDur / o, 0, 1), this;
    }
    var a = this._targets, h = n ? Qt(n) : a, c = this._ptLookup, l = this._pt, d, f, u, g, p, m, x;
    if ((!r || r === "all") && Sm(a, h))
      return r === "all" && (this._pt = 0), ts(this);
    for (d = this._op = this._op || [], r !== "all" && (wt(r) && (p = {}, Lt(r, function(y) {
      return p[y] = 1;
    }), r = p), r = Ym(a, r)), x = a.length; x--; )
      if (~h.indexOf(a[x])) {
        f = c[x], r === "all" ? (d[x] = r, g = f, u = {}) : (u = d[x] = d[x] || {}, g = r);
        for (p in g)
          m = f && f[p], m && ((!("kill" in m.d) || m.d.kill(p) === !0) && Mn(this, m, "_pt"), delete f[p]), u !== "all" && (u[p] = 1);
      }
    return this._initted && !this._pt && l && ts(this), this;
  }, t.to = function(n, r) {
    return new t(n, r, arguments[2]);
  }, t.from = function(n, r) {
    return as(1, arguments);
  }, t.delayedCall = function(n, r, o, a) {
    return new t(r, 0, {
      immediateRender: !1,
      lazy: !1,
      overwrite: !1,
      delay: n,
      onComplete: r,
      onReverseComplete: r,
      onCompleteParams: o,
      onReverseCompleteParams: o,
      callbackScope: a
    });
  }, t.fromTo = function(n, r, o) {
    return as(2, arguments);
  }, t.set = function(n, r) {
    return r.duration = 0, r.repeatDelay || (r.repeat = 0), new t(n, r);
  }, t.killTweensOf = function(n, r, o) {
    return it.killTweensOf(n, r, o);
  }, t;
}(vs);
Jt(dt.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
Lt("staggerTo,staggerFrom,staggerFromTo", function(s) {
  dt[s] = function() {
    var t = new Bt(), e = to.call(arguments, 0);
    return e.splice(s === "staggerFromTo" ? 5 : 4, 0, 0), t[s].apply(t, e);
  };
});
var zo = function(t, e, i) {
  return t[e] = i;
}, Qc = function(t, e, i) {
  return t[e](i);
}, Km = function(t, e, i, n) {
  return t[e](n.fp, i);
}, qm = function(t, e, i) {
  return t.setAttribute(e, i);
}, Uo = function(t, e) {
  return at(t[e]) ? Qc : ko(t[e]) && t.setAttribute ? qm : zo;
}, Jc = function(t, e) {
  return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e6) / 1e6, e);
}, Zm = function(t, e) {
  return e.set(e.t, e.p, !!(e.s + e.c * t), e);
}, tu = function(t, e) {
  var i = e._pt, n = "";
  if (!t && e.b)
    n = e.b;
  else if (t === 1 && e.e)
    n = e.e;
  else {
    for (; i; )
      n = i.p + (i.m ? i.m(i.s + i.c * t) : Math.round((i.s + i.c * t) * 1e4) / 1e4) + n, i = i._next;
    n += e.c;
  }
  e.set(e.t, e.p, n, e);
}, Wo = function(t, e) {
  for (var i = e._pt; i; )
    i.r(t, i.d), i = i._next;
}, Qm = function(t, e, i, n) {
  for (var r = this._pt, o; r; )
    o = r._next, r.p === n && r.modifier(t, e, i), r = o;
}, Jm = function(t) {
  for (var e = this._pt, i, n; e; )
    n = e._next, e.p === t && !e.op || e.op === t ? Mn(this, e, "_pt") : e.dep || (i = 1), e = n;
  return !i;
}, t_ = function(t, e, i, n) {
  n.mSet(t, e, n.m.call(n.tween, i, n.mt), n);
}, eu = function(t) {
  for (var e = t._pt, i, n, r, o; e; ) {
    for (i = e._next, n = r; n && n.pr > e.pr; )
      n = n._next;
    (e._prev = n ? n._prev : o) ? e._prev._next = e : r = e, (e._next = n) ? n._prev = e : o = e, e = i;
  }
  t._pt = r;
}, Ot = /* @__PURE__ */ function() {
  function s(e, i, n, r, o, a, h, c, l) {
    this.t = i, this.s = r, this.c = o, this.p = n, this.r = a || Jc, this.d = h || this, this.set = c || zo, this.pr = l || 0, this._next = e, e && (e._prev = this);
  }
  var t = s.prototype;
  return t.modifier = function(i, n, r) {
    this.mSet = this.mSet || this.set, this.set = t_, this.m = i, this.mt = r, this.tween = n;
  }, s;
}();
Lt(Fo + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(s) {
  return Ro[s] = 1;
});
Yt.TweenMax = Yt.TweenLite = dt;
Yt.TimelineLite = Yt.TimelineMax = Bt;
it = new Bt({
  sortChildren: !1,
  defaults: Ri,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0
});
jt.stringFilter = Hc;
var oi = [], tn = {}, e_ = [], _h = 0, i_ = 0, yr = function(t) {
  return (tn[t] || e_).map(function(e) {
    return e();
  });
}, no = function() {
  var t = Date.now(), e = [];
  t - _h > 2 && (yr("matchMediaInit"), oi.forEach(function(i) {
    var n = i.queries, r = i.conditions, o, a, h, c;
    for (a in n)
      o = de.matchMedia(n[a]).matches, o && (h = 1), o !== r[a] && (r[a] = o, c = 1);
    c && (i.revert(), h && e.push(i));
  }), yr("matchMediaRevert"), e.forEach(function(i) {
    return i.onMatch(i, function(n) {
      return i.add(null, n);
    });
  }), _h = t, yr("matchMedia"));
}, iu = /* @__PURE__ */ function() {
  function s(e, i) {
    this.selector = i && eo(i), this.data = [], this._r = [], this.isReverted = !1, this.id = i_++, e && this.add(e);
  }
  var t = s.prototype;
  return t.add = function(i, n, r) {
    at(i) && (r = n, n = i, i = at);
    var o = this, a = function() {
      var c = tt, l = o.selector, d;
      return c && c !== o && c.data.push(o), r && (o.selector = eo(r)), tt = o, d = n.apply(o, arguments), at(d) && o._r.push(d), tt = c, o.selector = l, o.isReverted = !1, d;
    };
    return o.last = a, i === at ? a(o, function(h) {
      return o.add(null, h);
    }) : i ? o[i] = a : a;
  }, t.ignore = function(i) {
    var n = tt;
    tt = null, i(this), tt = n;
  }, t.getTweens = function() {
    var i = [];
    return this.data.forEach(function(n) {
      return n instanceof s ? i.push.apply(i, n.getTweens()) : n instanceof dt && !(n.parent && n.parent.data === "nested") && i.push(n);
    }), i;
  }, t.clear = function() {
    this._r.length = this.data.length = 0;
  }, t.kill = function(i, n) {
    var r = this;
    if (i ? function() {
      for (var a = r.getTweens(), h = r.data.length, c; h--; )
        c = r.data[h], c.data === "isFlip" && (c.revert(), c.getChildren(!0, !0, !1).forEach(function(l) {
          return a.splice(a.indexOf(l), 1);
        }));
      for (a.map(function(l) {
        return {
          g: l._dur || l._delay || l._sat && !l._sat.vars.immediateRender ? l.globalTime(0) : -1 / 0,
          t: l
        };
      }).sort(function(l, d) {
        return d.g - l.g || -1 / 0;
      }).forEach(function(l) {
        return l.t.revert(i);
      }), h = r.data.length; h--; )
        c = r.data[h], c instanceof Bt ? c.data !== "nested" && (c.scrollTrigger && c.scrollTrigger.revert(), c.kill()) : !(c instanceof dt) && c.revert && c.revert(i);
      r._r.forEach(function(l) {
        return l(i, r);
      }), r.isReverted = !0;
    }() : this.data.forEach(function(a) {
      return a.kill && a.kill();
    }), this.clear(), n)
      for (var o = oi.length; o--; )
        oi[o].id === this.id && oi.splice(o, 1);
  }, t.revert = function(i) {
    this.kill(i || {});
  }, s;
}(), s_ = /* @__PURE__ */ function() {
  function s(e) {
    this.contexts = [], this.scope = e, tt && tt.data.push(this);
  }
  var t = s.prototype;
  return t.add = function(i, n, r) {
    ye(i) || (i = {
      matches: i
    });
    var o = new iu(0, r || this.scope), a = o.conditions = {}, h, c, l;
    tt && !o.selector && (o.selector = tt.selector), this.contexts.push(o), n = o.add("onMatch", n), o.queries = i;
    for (c in i)
      c === "all" ? l = 1 : (h = de.matchMedia(i[c]), h && (oi.indexOf(o) < 0 && oi.push(o), (a[c] = h.matches) && (l = 1), h.addListener ? h.addListener(no) : h.addEventListener("change", no)));
    return l && n(o, function(d) {
      return o.add(null, d);
    }), this;
  }, t.revert = function(i) {
    this.kill(i || {});
  }, t.kill = function(i) {
    this.contexts.forEach(function(n) {
      return n.kill(i, !0);
    });
  }, s;
}(), dn = {
  registerPlugin: function() {
    for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
      e[i] = arguments[i];
    e.forEach(function(n) {
      return Gc(n);
    });
  },
  timeline: function(t) {
    return new Bt(t);
  },
  getTweensOf: function(t, e) {
    return it.getTweensOf(t, e);
  },
  getProperty: function(t, e, i, n) {
    wt(t) && (t = Qt(t)[0]);
    var r = si(t || {}).get, o = i ? Tc : Mc;
    return i === "native" && (i = ""), t && (e ? o((Nt[e] && Nt[e].get || r)(t, e, i, n)) : function(a, h, c) {
      return o((Nt[a] && Nt[a].get || r)(t, a, h, c));
    });
  },
  quickSetter: function(t, e, i) {
    if (t = Qt(t), t.length > 1) {
      var n = t.map(function(l) {
        return zt.quickSetter(l, e, i);
      }), r = n.length;
      return function(l) {
        for (var d = r; d--; )
          n[d](l);
      };
    }
    t = t[0] || {};
    var o = Nt[e], a = si(t), h = a.harness && (a.harness.aliases || {})[e] || e, c = o ? function(l) {
      var d = new o();
      wi._pt = 0, d.init(t, i ? l + i : l, wi, 0, [t]), d.render(1, d), wi._pt && Wo(1, wi);
    } : a.set(t, h);
    return o ? c : function(l) {
      return c(t, h, i ? l + i : l, a, 1);
    };
  },
  quickTo: function(t, e, i) {
    var n, r = zt.to(t, li((n = {}, n[e] = "+=0.1", n.paused = !0, n), i || {})), o = function(h, c, l) {
      return r.resetTo(e, h, c, l);
    };
    return o.tween = r, o;
  },
  isTweening: function(t) {
    return it.getTweensOf(t, !0).length > 0;
  },
  defaults: function(t) {
    return t && t.ease && (t.ease = ri(t.ease, Ri.ease)), dh(Ri, t || {});
  },
  config: function(t) {
    return dh(jt, t || {});
  },
  registerEffect: function(t) {
    var e = t.name, i = t.effect, n = t.plugins, r = t.defaults, o = t.extendTimeline;
    (n || "").split(",").forEach(function(a) {
      return a && !Nt[a] && !Yt[a] && ms(e + " effect requires " + a + " plugin.");
    }), gr[e] = function(a, h, c) {
      return i(Qt(a), Jt(h || {}, r), c);
    }, o && (Bt.prototype[e] = function(a, h, c) {
      return this.add(gr[e](a, ye(h) ? h : (c = h) && {}, this), c);
    });
  },
  registerEase: function(t, e) {
    N[t] = ri(e);
  },
  parseEase: function(t, e) {
    return arguments.length ? ri(t, e) : N;
  },
  getById: function(t) {
    return it.getById(t);
  },
  exportRoot: function(t, e) {
    t === void 0 && (t = {});
    var i = new Bt(t), n, r;
    for (i.smoothChildTiming = Ft(t.smoothChildTiming), it.remove(i), i._dp = 0, i._time = i._tTime = it._time, n = it._first; n; )
      r = n._next, (e || !(!n._dur && n instanceof dt && n.vars.onComplete === n._targets[0])) && fe(i, n, n._start - n._delay), n = r;
    return fe(it, i, 0), i;
  },
  context: function(t, e) {
    return t ? new iu(t, e) : tt;
  },
  matchMedia: function(t) {
    return new s_(t);
  },
  matchMediaRefresh: function() {
    return oi.forEach(function(t) {
      var e = t.conditions, i, n;
      for (n in e)
        e[n] && (e[n] = !1, i = 1);
      i && t.revert();
    }) || no();
  },
  addEventListener: function(t, e) {
    var i = tn[t] || (tn[t] = []);
    ~i.indexOf(e) || i.push(e);
  },
  removeEventListener: function(t, e) {
    var i = tn[t], n = i && i.indexOf(e);
    n >= 0 && i.splice(n, 1);
  },
  utils: {
    wrap: Lm,
    wrapYoyo: Om,
    distribute: Lc,
    random: Dc,
    snap: Oc,
    normalize: Fm,
    getUnit: At,
    clamp: Em,
    splitColor: Vc,
    toArray: Qt,
    selector: eo,
    mapRange: Uc,
    pipe: Bm,
    unitize: Rm,
    interpolate: Dm,
    shuffle: Fc
  },
  install: wc,
  effects: gr,
  ticker: Ht,
  updateRoot: Bt.updateRoot,
  plugins: Nt,
  globalTimeline: it,
  core: {
    PropTween: Ot,
    globals: Sc,
    Tween: dt,
    Timeline: Bt,
    Animation: vs,
    getCache: si,
    _removeLinkedListItem: Mn,
    reverting: function() {
      return Mt;
    },
    context: function(t) {
      return t && tt && (tt.data.push(t), t._ctx = tt), tt;
    },
    suppressOverwrites: function(t) {
      return To = t;
    }
  }
};
Lt("to,from,fromTo,delayedCall,set,killTweensOf", function(s) {
  return dn[s] = dt[s];
});
Ht.add(Bt.updateRoot);
wi = dn.to({}, {
  duration: 0
});
var n_ = function(t, e) {
  for (var i = t._pt; i && i.p !== e && i.op !== e && i.fp !== e; )
    i = i._next;
  return i;
}, r_ = function(t, e) {
  var i = t._targets, n, r, o;
  for (n in e)
    for (r = i.length; r--; )
      o = t._ptLookup[r][n], o && (o = o.d) && (o._pt && (o = n_(o, n)), o && o.modifier && o.modifier(e[n], t, i[r], n));
}, vr = function(t, e) {
  return {
    name: t,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function(n, r, o) {
      o._onInit = function(a) {
        var h, c;
        if (wt(r) && (h = {}, Lt(r, function(l) {
          return h[l] = 1;
        }), r = h), e) {
          h = {};
          for (c in r)
            h[c] = e(r[c]);
          r = h;
        }
        r_(a, r);
      };
    }
  };
}, zt = dn.registerPlugin({
  name: "attr",
  init: function(t, e, i, n, r) {
    var o, a, h;
    this.tween = i;
    for (o in e)
      h = t.getAttribute(o) || "", a = this.add(t, "setAttribute", (h || 0) + "", e[o], n, r, 0, 0, o), a.op = o, a.b = h, this._props.push(o);
  },
  render: function(t, e) {
    for (var i = e._pt; i; )
      Mt ? i.set(i.t, i.p, i.b, i) : i.r(t, i.d), i = i._next;
  }
}, {
  name: "endArray",
  init: function(t, e) {
    for (var i = e.length; i--; )
      this.add(t, i, t[i] || 0, e[i], 0, 0, 0, 0, 0, 1);
  }
}, vr("roundProps", io), vr("modifiers"), vr("snap", Oc)) || dn;
dt.version = Bt.version = zt.version = "3.12.5";
bc = 1;
Eo() && Oi();
N.Power0;
N.Power1;
N.Power2;
N.Power3;
N.Power4;
N.Linear;
N.Quad;
N.Cubic;
N.Quart;
N.Quint;
N.Strong;
N.Elastic;
N.Back;
N.SteppedEase;
N.Bounce;
N.Sine;
N.Expo;
N.Circ;
/*!
 * CSSPlugin 3.12.5
 * https://gsap.com
 *
 * Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var xh, Oe, Ti, Go, ei, yh, Vo, o_ = function() {
  return typeof window < "u";
}, Ee = {}, Qe = 180 / Math.PI, ki = Math.PI / 180, _i = Math.atan2, vh = 1e8, No = /([A-Z])/g, a_ = /(left|right|width|margin|padding|x)/i, h_ = /[\s,\(]\S/, me = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, ro = function(t, e) {
  return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e);
}, l_ = function(t, e) {
  return e.set(e.t, e.p, t === 1 ? e.e : Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e);
}, c_ = function(t, e) {
  return e.set(e.t, e.p, t ? Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u : e.b, e);
}, u_ = function(t, e) {
  var i = e.s + e.c * t;
  e.set(e.t, e.p, ~~(i + (i < 0 ? -0.5 : 0.5)) + e.u, e);
}, su = function(t, e) {
  return e.set(e.t, e.p, t ? e.e : e.b, e);
}, nu = function(t, e) {
  return e.set(e.t, e.p, t !== 1 ? e.b : e.e, e);
}, d_ = function(t, e, i) {
  return t.style[e] = i;
}, f_ = function(t, e, i) {
  return t.style.setProperty(e, i);
}, p_ = function(t, e, i) {
  return t._gsap[e] = i;
}, g_ = function(t, e, i) {
  return t._gsap.scaleX = t._gsap.scaleY = i;
}, m_ = function(t, e, i, n, r) {
  var o = t._gsap;
  o.scaleX = o.scaleY = i, o.renderTransform(r, o);
}, __ = function(t, e, i, n, r) {
  var o = t._gsap;
  o[e] = i, o.renderTransform(r, o);
}, rt = "transform", Dt = rt + "Origin", x_ = function s(t, e) {
  var i = this, n = this.target, r = n.style, o = n._gsap;
  if (t in Ee && r) {
    if (this.tfm = this.tfm || {}, t !== "transform")
      t = me[t] || t, ~t.indexOf(",") ? t.split(",").forEach(function(a) {
        return i.tfm[a] = Ce(n, a);
      }) : this.tfm[t] = o.x ? o[t] : Ce(n, t), t === Dt && (this.tfm.zOrigin = o.zOrigin);
    else
      return me.transform.split(",").forEach(function(a) {
        return s.call(i, a, e);
      });
    if (this.props.indexOf(rt) >= 0)
      return;
    o.svg && (this.svgo = n.getAttribute("data-svg-origin"), this.props.push(Dt, e, "")), t = rt;
  }
  (r || e) && this.props.push(t, e, r[t]);
}, ru = function(t) {
  t.translate && (t.removeProperty("translate"), t.removeProperty("scale"), t.removeProperty("rotate"));
}, y_ = function() {
  var t = this.props, e = this.target, i = e.style, n = e._gsap, r, o;
  for (r = 0; r < t.length; r += 3)
    t[r + 1] ? e[t[r]] = t[r + 2] : t[r + 2] ? i[t[r]] = t[r + 2] : i.removeProperty(t[r].substr(0, 2) === "--" ? t[r] : t[r].replace(No, "-$1").toLowerCase());
  if (this.tfm) {
    for (o in this.tfm)
      n[o] = this.tfm[o];
    n.svg && (n.renderTransform(), e.setAttribute("data-svg-origin", this.svgo || "")), r = Vo(), (!r || !r.isStart) && !i[rt] && (ru(i), n.zOrigin && i[Dt] && (i[Dt] += " " + n.zOrigin + "px", n.zOrigin = 0, n.renderTransform()), n.uncache = 1);
  }
}, ou = function(t, e) {
  var i = {
    target: t,
    props: [],
    revert: y_,
    save: x_
  };
  return t._gsap || zt.core.getCache(t), e && e.split(",").forEach(function(n) {
    return i.save(n);
  }), i;
}, au, oo = function(t, e) {
  var i = Oe.createElementNS ? Oe.createElementNS((e || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), t) : Oe.createElement(t);
  return i && i.style ? i : Oe.createElement(t);
}, _e = function s(t, e, i) {
  var n = getComputedStyle(t);
  return n[e] || n.getPropertyValue(e.replace(No, "-$1").toLowerCase()) || n.getPropertyValue(e) || !i && s(t, Di(e) || e, 1) || "";
}, bh = "O,Moz,ms,Ms,Webkit".split(","), Di = function(t, e, i) {
  var n = e || ei, r = n.style, o = 5;
  if (t in r && !i)
    return t;
  for (t = t.charAt(0).toUpperCase() + t.substr(1); o-- && !(bh[o] + t in r); )
    ;
  return o < 0 ? null : (o === 3 ? "ms" : o >= 0 ? bh[o] : "") + t;
}, ao = function() {
  o_() && window.document && (xh = window, Oe = xh.document, Ti = Oe.documentElement, ei = oo("div") || {
    style: {}
  }, oo("div"), rt = Di(rt), Dt = rt + "Origin", ei.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", au = !!Di("perspective"), Vo = zt.core.reverting, Go = 1);
}, br = function s(t) {
  var e = oo("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), i = this.parentNode, n = this.nextSibling, r = this.style.cssText, o;
  if (Ti.appendChild(e), e.appendChild(this), this.style.display = "block", t)
    try {
      o = this.getBBox(), this._gsapBBox = this.getBBox, this.getBBox = s;
    } catch {
    }
  else this._gsapBBox && (o = this._gsapBBox());
  return i && (n ? i.insertBefore(this, n) : i.appendChild(this)), Ti.removeChild(e), this.style.cssText = r, o;
}, wh = function(t, e) {
  for (var i = e.length; i--; )
    if (t.hasAttribute(e[i]))
      return t.getAttribute(e[i]);
}, hu = function(t) {
  var e;
  try {
    e = t.getBBox();
  } catch {
    e = br.call(t, !0);
  }
  return e && (e.width || e.height) || t.getBBox === br || (e = br.call(t, !0)), e && !e.width && !e.x && !e.y ? {
    x: +wh(t, ["x", "cx", "x1"]) || 0,
    y: +wh(t, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : e;
}, lu = function(t) {
  return !!(t.getCTM && (!t.parentNode || t.ownerSVGElement) && hu(t));
}, ci = function(t, e) {
  if (e) {
    var i = t.style, n;
    e in Ee && e !== Dt && (e = rt), i.removeProperty ? (n = e.substr(0, 2), (n === "ms" || e.substr(0, 6) === "webkit") && (e = "-" + e), i.removeProperty(n === "--" ? e : e.replace(No, "-$1").toLowerCase())) : i.removeAttribute(e);
  }
}, De = function(t, e, i, n, r, o) {
  var a = new Ot(t._pt, e, i, 0, 1, o ? nu : su);
  return t._pt = a, a.b = n, a.e = r, t._props.push(i), a;
}, Sh = {
  deg: 1,
  rad: 1,
  turn: 1
}, v_ = {
  grid: 1,
  flex: 1
}, Ve = function s(t, e, i, n) {
  var r = parseFloat(i) || 0, o = (i + "").trim().substr((r + "").length) || "px", a = ei.style, h = a_.test(e), c = t.tagName.toLowerCase() === "svg", l = (c ? "client" : "offset") + (h ? "Width" : "Height"), d = 100, f = n === "px", u = n === "%", g, p, m, x;
  if (n === o || !r || Sh[n] || Sh[o])
    return r;
  if (o !== "px" && !f && (r = s(t, e, i, "px")), x = t.getCTM && lu(t), (u || o === "%") && (Ee[e] || ~e.indexOf("adius")))
    return g = x ? t.getBBox()[h ? "width" : "height"] : t[l], ct(u ? r / g * d : r / 100 * g);
  if (a[h ? "width" : "height"] = d + (f ? o : n), p = ~e.indexOf("adius") || n === "em" && t.appendChild && !c ? t : t.parentNode, x && (p = (t.ownerSVGElement || {}).parentNode), (!p || p === Oe || !p.appendChild) && (p = Oe.body), m = p._gsap, m && u && m.width && h && m.time === Ht.time && !m.uncache)
    return ct(r / m.width * d);
  if (u && (e === "height" || e === "width")) {
    var y = t.style[e];
    t.style[e] = d + n, g = t[l], y ? t.style[e] = y : ci(t, e);
  } else
    (u || o === "%") && !v_[_e(p, "display")] && (a.position = _e(t, "position")), p === t && (a.position = "static"), p.appendChild(ei), g = ei[l], p.removeChild(ei), a.position = "absolute";
  return h && u && (m = si(p), m.time = Ht.time, m.width = p[l]), ct(f ? g * r / d : g && r ? d / g * r : 0);
}, Ce = function(t, e, i, n) {
  var r;
  return Go || ao(), e in me && e !== "transform" && (e = me[e], ~e.indexOf(",") && (e = e.split(",")[0])), Ee[e] && e !== "transform" ? (r = ws(t, n), r = e !== "transformOrigin" ? r[e] : r.svg ? r.origin : pn(_e(t, Dt)) + " " + r.zOrigin + "px") : (r = t.style[e], (!r || r === "auto" || n || ~(r + "").indexOf("calc(")) && (r = fn[e] && fn[e](t, e, i) || _e(t, e) || Cc(t, e) || (e === "opacity" ? 1 : 0))), i && !~(r + "").trim().indexOf(" ") ? Ve(t, e, r, i) + i : r;
}, b_ = function(t, e, i, n) {
  if (!i || i === "none") {
    var r = Di(e, t, 1), o = r && _e(t, r, 1);
    o && o !== i ? (e = r, i = o) : e === "borderColor" && (i = _e(t, "borderTopColor"));
  }
  var a = new Ot(this._pt, t.style, e, 0, 1, tu), h = 0, c = 0, l, d, f, u, g, p, m, x, y, v, w, _;
  if (a.b = i, a.e = n, i += "", n += "", n === "auto" && (p = t.style[e], t.style[e] = n, n = _e(t, e) || n, p ? t.style[e] = p : ci(t, e)), l = [i, n], Hc(l), i = l[0], n = l[1], f = i.match(bi) || [], _ = n.match(bi) || [], _.length) {
    for (; d = bi.exec(n); )
      m = d[0], y = n.substring(h, d.index), g ? g = (g + 1) % 5 : (y.substr(-5) === "rgba(" || y.substr(-5) === "hsla(") && (g = 1), m !== (p = f[c++] || "") && (u = parseFloat(p) || 0, w = p.substr((u + "").length), m.charAt(1) === "=" && (m = Mi(u, m) + w), x = parseFloat(m), v = m.substr((x + "").length), h = bi.lastIndex - v.length, v || (v = v || jt.units[e] || w, h === n.length && (n += v, a.e += v)), w !== v && (u = Ve(t, e, p, v) || 0), a._pt = {
        _next: a._pt,
        p: y || c === 1 ? y : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: u,
        c: x - u,
        m: g && g < 4 || e === "zIndex" ? Math.round : 0
      });
    a.c = h < n.length ? n.substring(h, n.length) : "";
  } else
    a.r = e === "display" && n === "none" ? nu : su;
  return yc.test(n) && (a.e = 0), this._pt = a, a;
}, Ah = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, w_ = function(t) {
  var e = t.split(" "), i = e[0], n = e[1] || "50%";
  return (i === "top" || i === "bottom" || n === "left" || n === "right") && (t = i, i = n, n = t), e[0] = Ah[i] || i, e[1] = Ah[n] || n, e.join(" ");
}, S_ = function(t, e) {
  if (e.tween && e.tween._time === e.tween._dur) {
    var i = e.t, n = i.style, r = e.u, o = i._gsap, a, h, c;
    if (r === "all" || r === !0)
      n.cssText = "", h = 1;
    else
      for (r = r.split(","), c = r.length; --c > -1; )
        a = r[c], Ee[a] && (h = 1, a = a === "transformOrigin" ? Dt : rt), ci(i, a);
    h && (ci(i, rt), o && (o.svg && i.removeAttribute("transform"), ws(i, 1), o.uncache = 1, ru(n)));
  }
}, fn = {
  clearProps: function(t, e, i, n, r) {
    if (r.data !== "isFromStart") {
      var o = t._pt = new Ot(t._pt, e, i, 0, 0, S_);
      return o.u = n, o.pr = -10, o.tween = r, t._props.push(i), 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */
}, bs = [1, 0, 0, 1, 0, 0], cu = {}, uu = function(t) {
  return t === "matrix(1, 0, 0, 1, 0, 0)" || t === "none" || !t;
}, Ch = function(t) {
  var e = _e(t, rt);
  return uu(e) ? bs : e.substr(7).match(xc).map(ct);
}, Ho = function(t, e) {
  var i = t._gsap || si(t), n = t.style, r = Ch(t), o, a, h, c;
  return i.svg && t.getAttribute("transform") ? (h = t.transform.baseVal.consolidate().matrix, r = [h.a, h.b, h.c, h.d, h.e, h.f], r.join(",") === "1,0,0,1,0,0" ? bs : r) : (r === bs && !t.offsetParent && t !== Ti && !i.svg && (h = n.display, n.display = "block", o = t.parentNode, (!o || !t.offsetParent) && (c = 1, a = t.nextElementSibling, Ti.appendChild(t)), r = Ch(t), h ? n.display = h : ci(t, "display"), c && (a ? o.insertBefore(t, a) : o ? o.appendChild(t) : Ti.removeChild(t))), e && r.length > 6 ? [r[0], r[1], r[4], r[5], r[12], r[13]] : r);
}, ho = function(t, e, i, n, r, o) {
  var a = t._gsap, h = r || Ho(t, !0), c = a.xOrigin || 0, l = a.yOrigin || 0, d = a.xOffset || 0, f = a.yOffset || 0, u = h[0], g = h[1], p = h[2], m = h[3], x = h[4], y = h[5], v = e.split(" "), w = parseFloat(v[0]) || 0, _ = parseFloat(v[1]) || 0, S, C, b, A;
  i ? h !== bs && (C = u * m - g * p) && (b = w * (m / C) + _ * (-p / C) + (p * y - m * x) / C, A = w * (-g / C) + _ * (u / C) - (u * y - g * x) / C, w = b, _ = A) : (S = hu(t), w = S.x + (~v[0].indexOf("%") ? w / 100 * S.width : w), _ = S.y + (~(v[1] || v[0]).indexOf("%") ? _ / 100 * S.height : _)), n || n !== !1 && a.smooth ? (x = w - c, y = _ - l, a.xOffset = d + (x * u + y * p) - x, a.yOffset = f + (x * g + y * m) - y) : a.xOffset = a.yOffset = 0, a.xOrigin = w, a.yOrigin = _, a.smooth = !!n, a.origin = e, a.originIsAbsolute = !!i, t.style[Dt] = "0px 0px", o && (De(o, a, "xOrigin", c, w), De(o, a, "yOrigin", l, _), De(o, a, "xOffset", d, a.xOffset), De(o, a, "yOffset", f, a.yOffset)), t.setAttribute("data-svg-origin", w + " " + _);
}, ws = function(t, e) {
  var i = t._gsap || new Xc(t);
  if ("x" in i && !e && !i.uncache)
    return i;
  var n = t.style, r = i.scaleX < 0, o = "px", a = "deg", h = getComputedStyle(t), c = _e(t, Dt) || "0", l, d, f, u, g, p, m, x, y, v, w, _, S, C, b, A, P, M, T, k, E, I, B, R, z, F, L, Z, U, X, J, Q;
  return l = d = f = p = m = x = y = v = w = 0, u = g = 1, i.svg = !!(t.getCTM && lu(t)), h.translate && ((h.translate !== "none" || h.scale !== "none" || h.rotate !== "none") && (n[rt] = (h.translate !== "none" ? "translate3d(" + (h.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (h.rotate !== "none" ? "rotate(" + h.rotate + ") " : "") + (h.scale !== "none" ? "scale(" + h.scale.split(" ").join(",") + ") " : "") + (h[rt] !== "none" ? h[rt] : "")), n.scale = n.rotate = n.translate = "none"), C = Ho(t, i.svg), i.svg && (i.uncache ? (z = t.getBBox(), c = i.xOrigin - z.x + "px " + (i.yOrigin - z.y) + "px", R = "") : R = !e && t.getAttribute("data-svg-origin"), ho(t, R || c, !!R || i.originIsAbsolute, i.smooth !== !1, C)), _ = i.xOrigin || 0, S = i.yOrigin || 0, C !== bs && (M = C[0], T = C[1], k = C[2], E = C[3], l = I = C[4], d = B = C[5], C.length === 6 ? (u = Math.sqrt(M * M + T * T), g = Math.sqrt(E * E + k * k), p = M || T ? _i(T, M) * Qe : 0, y = k || E ? _i(k, E) * Qe + p : 0, y && (g *= Math.abs(Math.cos(y * ki))), i.svg && (l -= _ - (_ * M + S * k), d -= S - (_ * T + S * E))) : (Q = C[6], X = C[7], L = C[8], Z = C[9], U = C[10], J = C[11], l = C[12], d = C[13], f = C[14], b = _i(Q, U), m = b * Qe, b && (A = Math.cos(-b), P = Math.sin(-b), R = I * A + L * P, z = B * A + Z * P, F = Q * A + U * P, L = I * -P + L * A, Z = B * -P + Z * A, U = Q * -P + U * A, J = X * -P + J * A, I = R, B = z, Q = F), b = _i(-k, U), x = b * Qe, b && (A = Math.cos(-b), P = Math.sin(-b), R = M * A - L * P, z = T * A - Z * P, F = k * A - U * P, J = E * P + J * A, M = R, T = z, k = F), b = _i(T, M), p = b * Qe, b && (A = Math.cos(b), P = Math.sin(b), R = M * A + T * P, z = I * A + B * P, T = T * A - M * P, B = B * A - I * P, M = R, I = z), m && Math.abs(m) + Math.abs(p) > 359.9 && (m = p = 0, x = 180 - x), u = ct(Math.sqrt(M * M + T * T + k * k)), g = ct(Math.sqrt(B * B + Q * Q)), b = _i(I, B), y = Math.abs(b) > 2e-4 ? b * Qe : 0, w = J ? 1 / (J < 0 ? -J : J) : 0), i.svg && (R = t.getAttribute("transform"), i.forceCSS = t.setAttribute("transform", "") || !uu(_e(t, rt)), R && t.setAttribute("transform", R))), Math.abs(y) > 90 && Math.abs(y) < 270 && (r ? (u *= -1, y += p <= 0 ? 180 : -180, p += p <= 0 ? 180 : -180) : (g *= -1, y += y <= 0 ? 180 : -180)), e = e || i.uncache, i.x = l - ((i.xPercent = l && (!e && i.xPercent || (Math.round(t.offsetWidth / 2) === Math.round(-l) ? -50 : 0))) ? t.offsetWidth * i.xPercent / 100 : 0) + o, i.y = d - ((i.yPercent = d && (!e && i.yPercent || (Math.round(t.offsetHeight / 2) === Math.round(-d) ? -50 : 0))) ? t.offsetHeight * i.yPercent / 100 : 0) + o, i.z = f + o, i.scaleX = ct(u), i.scaleY = ct(g), i.rotation = ct(p) + a, i.rotationX = ct(m) + a, i.rotationY = ct(x) + a, i.skewX = y + a, i.skewY = v + a, i.transformPerspective = w + o, (i.zOrigin = parseFloat(c.split(" ")[2]) || !e && i.zOrigin || 0) && (n[Dt] = pn(c)), i.xOffset = i.yOffset = 0, i.force3D = jt.force3D, i.renderTransform = i.svg ? C_ : au ? du : A_, i.uncache = 0, i;
}, pn = function(t) {
  return (t = t.split(" "))[0] + " " + t[1];
}, wr = function(t, e, i) {
  var n = At(e);
  return ct(parseFloat(e) + parseFloat(Ve(t, "x", i + "px", n))) + n;
}, A_ = function(t, e) {
  e.z = "0px", e.rotationY = e.rotationX = "0deg", e.force3D = 0, du(t, e);
}, je = "0deg", qi = "0px", Ye = ") ", du = function(t, e) {
  var i = e || this, n = i.xPercent, r = i.yPercent, o = i.x, a = i.y, h = i.z, c = i.rotation, l = i.rotationY, d = i.rotationX, f = i.skewX, u = i.skewY, g = i.scaleX, p = i.scaleY, m = i.transformPerspective, x = i.force3D, y = i.target, v = i.zOrigin, w = "", _ = x === "auto" && t && t !== 1 || x === !0;
  if (v && (d !== je || l !== je)) {
    var S = parseFloat(l) * ki, C = Math.sin(S), b = Math.cos(S), A;
    S = parseFloat(d) * ki, A = Math.cos(S), o = wr(y, o, C * A * -v), a = wr(y, a, -Math.sin(S) * -v), h = wr(y, h, b * A * -v + v);
  }
  m !== qi && (w += "perspective(" + m + Ye), (n || r) && (w += "translate(" + n + "%, " + r + "%) "), (_ || o !== qi || a !== qi || h !== qi) && (w += h !== qi || _ ? "translate3d(" + o + ", " + a + ", " + h + ") " : "translate(" + o + ", " + a + Ye), c !== je && (w += "rotate(" + c + Ye), l !== je && (w += "rotateY(" + l + Ye), d !== je && (w += "rotateX(" + d + Ye), (f !== je || u !== je) && (w += "skew(" + f + ", " + u + Ye), (g !== 1 || p !== 1) && (w += "scale(" + g + ", " + p + Ye), y.style[rt] = w || "translate(0, 0)";
}, C_ = function(t, e) {
  var i = e || this, n = i.xPercent, r = i.yPercent, o = i.x, a = i.y, h = i.rotation, c = i.skewX, l = i.skewY, d = i.scaleX, f = i.scaleY, u = i.target, g = i.xOrigin, p = i.yOrigin, m = i.xOffset, x = i.yOffset, y = i.forceCSS, v = parseFloat(o), w = parseFloat(a), _, S, C, b, A;
  h = parseFloat(h), c = parseFloat(c), l = parseFloat(l), l && (l = parseFloat(l), c += l, h += l), h || c ? (h *= ki, c *= ki, _ = Math.cos(h) * d, S = Math.sin(h) * d, C = Math.sin(h - c) * -f, b = Math.cos(h - c) * f, c && (l *= ki, A = Math.tan(c - l), A = Math.sqrt(1 + A * A), C *= A, b *= A, l && (A = Math.tan(l), A = Math.sqrt(1 + A * A), _ *= A, S *= A)), _ = ct(_), S = ct(S), C = ct(C), b = ct(b)) : (_ = d, b = f, S = C = 0), (v && !~(o + "").indexOf("px") || w && !~(a + "").indexOf("px")) && (v = Ve(u, "x", o, "px"), w = Ve(u, "y", a, "px")), (g || p || m || x) && (v = ct(v + g - (g * _ + p * C) + m), w = ct(w + p - (g * S + p * b) + x)), (n || r) && (A = u.getBBox(), v = ct(v + n / 100 * A.width), w = ct(w + r / 100 * A.height)), A = "matrix(" + _ + "," + S + "," + C + "," + b + "," + v + "," + w + ")", u.setAttribute("transform", A), y && (u.style[rt] = A);
}, P_ = function(t, e, i, n, r) {
  var o = 360, a = wt(r), h = parseFloat(r) * (a && ~r.indexOf("rad") ? Qe : 1), c = h - n, l = n + c + "deg", d, f;
  return a && (d = r.split("_")[1], d === "short" && (c %= o, c !== c % (o / 2) && (c += c < 0 ? o : -o)), d === "cw" && c < 0 ? c = (c + o * vh) % o - ~~(c / o) * o : d === "ccw" && c > 0 && (c = (c - o * vh) % o - ~~(c / o) * o)), t._pt = f = new Ot(t._pt, e, i, n, c, l_), f.e = l, f.u = "deg", t._props.push(i), f;
}, Ph = function(t, e) {
  for (var i in e)
    t[i] = e[i];
  return t;
}, M_ = function(t, e, i) {
  var n = Ph({}, i._gsap), r = "perspective,force3D,transformOrigin,svgOrigin", o = i.style, a, h, c, l, d, f, u, g;
  n.svg ? (c = i.getAttribute("transform"), i.setAttribute("transform", ""), o[rt] = e, a = ws(i, 1), ci(i, rt), i.setAttribute("transform", c)) : (c = getComputedStyle(i)[rt], o[rt] = e, a = ws(i, 1), o[rt] = c);
  for (h in Ee)
    c = n[h], l = a[h], c !== l && r.indexOf(h) < 0 && (u = At(c), g = At(l), d = u !== g ? Ve(i, h, c, g) : parseFloat(c), f = parseFloat(l), t._pt = new Ot(t._pt, a, h, d, f - d, ro), t._pt.u = g || 0, t._props.push(h));
  Ph(a, n);
};
Lt("padding,margin,Width,Radius", function(s, t) {
  var e = "Top", i = "Right", n = "Bottom", r = "Left", o = (t < 3 ? [e, i, n, r] : [e + r, e + i, n + i, n + r]).map(function(a) {
    return t < 2 ? s + a : "border" + a + s;
  });
  fn[t > 1 ? "border" + s : s] = function(a, h, c, l, d) {
    var f, u;
    if (arguments.length < 4)
      return f = o.map(function(g) {
        return Ce(a, g, c);
      }), u = f.join(" "), u.split(f[0]).length === 5 ? f[0] : u;
    f = (l + "").split(" "), u = {}, o.forEach(function(g, p) {
      return u[g] = f[p] = f[p] || f[(p - 1) / 2 | 0];
    }), a.init(h, u, d);
  };
});
var fu = {
  name: "css",
  register: ao,
  targetTest: function(t) {
    return t.style && t.nodeType;
  },
  init: function(t, e, i, n, r) {
    var o = this._props, a = t.style, h = i.vars.startAt, c, l, d, f, u, g, p, m, x, y, v, w, _, S, C, b;
    Go || ao(), this.styles = this.styles || ou(t), b = this.styles.props, this.tween = i;
    for (p in e)
      if (p !== "autoRound" && (l = e[p], !(Nt[p] && Kc(p, e, i, n, t, r)))) {
        if (u = typeof l, g = fn[p], u === "function" && (l = l.call(i, n, t, r), u = typeof l), u === "string" && ~l.indexOf("random(") && (l = xs(l)), g)
          g(this, t, p, l, i) && (C = 1);
        else if (p.substr(0, 2) === "--")
          c = (getComputedStyle(t).getPropertyValue(p) + "").trim(), l += "", We.lastIndex = 0, We.test(c) || (m = At(c), x = At(l)), x ? m !== x && (c = Ve(t, p, c, x) + x) : m && (l += m), this.add(a, "setProperty", c, l, n, r, 0, 0, p), o.push(p), b.push(p, 0, a[p]);
        else if (u !== "undefined") {
          if (h && p in h ? (c = typeof h[p] == "function" ? h[p].call(i, n, t, r) : h[p], wt(c) && ~c.indexOf("random(") && (c = xs(c)), At(c + "") || c === "auto" || (c += jt.units[p] || At(Ce(t, p)) || ""), (c + "").charAt(1) === "=" && (c = Ce(t, p))) : c = Ce(t, p), f = parseFloat(c), y = u === "string" && l.charAt(1) === "=" && l.substr(0, 2), y && (l = l.substr(2)), d = parseFloat(l), p in me && (p === "autoAlpha" && (f === 1 && Ce(t, "visibility") === "hidden" && d && (f = 0), b.push("visibility", 0, a.visibility), De(this, a, "visibility", f ? "inherit" : "hidden", d ? "inherit" : "hidden", !d)), p !== "scale" && p !== "transform" && (p = me[p], ~p.indexOf(",") && (p = p.split(",")[0]))), v = p in Ee, v) {
            if (this.styles.save(p), w || (_ = t._gsap, _.renderTransform && !e.parseTransform || ws(t, e.parseTransform), S = e.smoothOrigin !== !1 && _.smooth, w = this._pt = new Ot(this._pt, a, rt, 0, 1, _.renderTransform, _, 0, -1), w.dep = 1), p === "scale")
              this._pt = new Ot(this._pt, _, "scaleY", _.scaleY, (y ? Mi(_.scaleY, y + d) : d) - _.scaleY || 0, ro), this._pt.u = 0, o.push("scaleY", p), p += "X";
            else if (p === "transformOrigin") {
              b.push(Dt, 0, a[Dt]), l = w_(l), _.svg ? ho(t, l, 0, S, 0, this) : (x = parseFloat(l.split(" ")[2]) || 0, x !== _.zOrigin && De(this, _, "zOrigin", _.zOrigin, x), De(this, a, p, pn(c), pn(l)));
              continue;
            } else if (p === "svgOrigin") {
              ho(t, l, 1, S, 0, this);
              continue;
            } else if (p in cu) {
              P_(this, _, p, f, y ? Mi(f, y + l) : l);
              continue;
            } else if (p === "smoothOrigin") {
              De(this, _, "smooth", _.smooth, l);
              continue;
            } else if (p === "force3D") {
              _[p] = l;
              continue;
            } else if (p === "transform") {
              M_(this, l, t);
              continue;
            }
          } else p in a || (p = Di(p) || p);
          if (v || (d || d === 0) && (f || f === 0) && !h_.test(l) && p in a)
            m = (c + "").substr((f + "").length), d || (d = 0), x = At(l) || (p in jt.units ? jt.units[p] : m), m !== x && (f = Ve(t, p, c, x)), this._pt = new Ot(this._pt, v ? _ : a, p, f, (y ? Mi(f, y + d) : d) - f, !v && (x === "px" || p === "zIndex") && e.autoRound !== !1 ? u_ : ro), this._pt.u = x || 0, m !== x && x !== "%" && (this._pt.b = c, this._pt.r = c_);
          else if (p in a)
            b_.call(this, t, p, c, y ? y + l : l);
          else if (p in t)
            this.add(t, p, c || t[p], y ? y + l : l, n, r);
          else if (p !== "parseTransform") {
            Bo(p, l);
            continue;
          }
          v || (p in a ? b.push(p, 0, a[p]) : b.push(p, 1, c || t[p])), o.push(p);
        }
      }
    C && eu(this);
  },
  render: function(t, e) {
    if (e.tween._time || !Vo())
      for (var i = e._pt; i; )
        i.r(t, i.d), i = i._next;
    else
      e.styles.revert();
  },
  get: Ce,
  aliases: me,
  getSetter: function(t, e, i) {
    var n = me[e];
    return n && n.indexOf(",") < 0 && (e = n), e in Ee && e !== Dt && (t._gsap.x || Ce(t, "x")) ? i && yh === i ? e === "scale" ? g_ : p_ : (yh = i || {}) && (e === "scale" ? m_ : __) : t.style && !ko(t.style[e]) ? d_ : ~e.indexOf("-") ? f_ : Uo(t, e);
  },
  core: {
    _removeProperty: ci,
    _getMatrix: Ho
  }
};
zt.utils.checkPrefix = Di;
zt.core.getStyleSaver = ou;
(function(s, t, e, i) {
  var n = Lt(s + "," + t + "," + e, function(r) {
    Ee[r] = 1;
  });
  Lt(t, function(r) {
    jt.units[r] = "deg", cu[r] = 1;
  }), me[n[13]] = s + "," + t, Lt(i, function(r) {
    var o = r.split(":");
    me[o[1]] = n[o[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
Lt("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(s) {
  jt.units[s] = "px";
});
zt.registerPlugin(fu);
var is = zt.registerPlugin(fu) || zt;
is.core.Tween;
class Vi {
  constructor(t) {
    Gt(this, "_options");
    Gt(this, "_tween", null);
    this._options = t;
  }
  get options() {
    return this._options;
  }
  get name() {
    return this._options.name;
  }
  start(t) {
    return new Promise((e) => {
      this._tween = is.fromTo(t, this.options.from, {
        ...this.options.to,
        onComplete: () => e(),
        duration: this.options.duration,
        repeat: this.options.repeat,
        yoyo: this.options.revert,
        ease: this.options.ease,
        delay: this.options.delay,
        repeatDelay: this.options.repeatDelay
      }), this._tween.play();
    });
  }
  stop() {
    var t;
    (t = this._tween) == null || t.kill();
  }
  pause() {
    var t;
    (t = this._tween) == null || t.pause();
  }
  resume() {
    var t;
    (t = this._tween) == null || t.resume();
  }
  finish() {
    var t;
    (t = this._tween) == null || t.progress(1);
  }
  static initEngine() {
    is.ticker.remove(is.updateRoot);
  }
  static updateEngine(t) {
    this._rootTimeMs += t, is.updateRoot(this._rootTimeMs / 1e3);
  }
}
Gt(Vi, "_rootTimeMs", 0);
var pu = { exports: {} };
/*!
 * matter-js 0.20.0 by @liabru
 * http://brm.io/matter-js/
 * License MIT
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) Liam Brummitt and contributors.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(s, t) {
  (function(i, n) {
    s.exports = n();
  })(Je, function() {
    return (
      /******/
      function(e) {
        var i = {};
        function n(r) {
          if (i[r])
            return i[r].exports;
          var o = i[r] = {
            /******/
            i: r,
            /******/
            l: !1,
            /******/
            exports: {}
            /******/
          };
          return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
        }
        return n.m = e, n.c = i, n.d = function(r, o, a) {
          n.o(r, o) || Object.defineProperty(r, o, { enumerable: !0, get: a });
        }, n.r = function(r) {
          typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(r, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(r, "__esModule", { value: !0 });
        }, n.t = function(r, o) {
          if (o & 1 && (r = n(r)), o & 8 || o & 4 && typeof r == "object" && r && r.__esModule) return r;
          var a = /* @__PURE__ */ Object.create(null);
          if (n.r(a), Object.defineProperty(a, "default", { enumerable: !0, value: r }), o & 2 && typeof r != "string") for (var h in r) n.d(a, h, (function(c) {
            return r[c];
          }).bind(null, h));
          return a;
        }, n.n = function(r) {
          var o = r && r.__esModule ? (
            /******/
            function() {
              return r.default;
            }
          ) : (
            /******/
            function() {
              return r;
            }
          );
          return n.d(o, "a", o), o;
        }, n.o = function(r, o) {
          return Object.prototype.hasOwnProperty.call(r, o);
        }, n.p = "", n(n.s = 20);
      }([
        /* 0 */
        /***/
        function(e, i) {
          var n = {};
          e.exports = n, function() {
            n._baseDelta = 1e3 / 60, n._nextId = 0, n._seed = 0, n._nowStartTime = +/* @__PURE__ */ new Date(), n._warnedOnce = {}, n._decomp = null, n.extend = function(o, a) {
              var h, c;
              typeof a == "boolean" ? (h = 2, c = a) : (h = 1, c = !0);
              for (var l = h; l < arguments.length; l++) {
                var d = arguments[l];
                if (d)
                  for (var f in d)
                    c && d[f] && d[f].constructor === Object && (!o[f] || o[f].constructor === Object) ? (o[f] = o[f] || {}, n.extend(o[f], c, d[f])) : o[f] = d[f];
              }
              return o;
            }, n.clone = function(o, a) {
              return n.extend({}, a, o);
            }, n.keys = function(o) {
              if (Object.keys)
                return Object.keys(o);
              var a = [];
              for (var h in o)
                a.push(h);
              return a;
            }, n.values = function(o) {
              var a = [];
              if (Object.keys) {
                for (var h = Object.keys(o), c = 0; c < h.length; c++)
                  a.push(o[h[c]]);
                return a;
              }
              for (var l in o)
                a.push(o[l]);
              return a;
            }, n.get = function(o, a, h, c) {
              a = a.split(".").slice(h, c);
              for (var l = 0; l < a.length; l += 1)
                o = o[a[l]];
              return o;
            }, n.set = function(o, a, h, c, l) {
              var d = a.split(".").slice(c, l);
              return n.get(o, a, 0, -1)[d[d.length - 1]] = h, h;
            }, n.shuffle = function(o) {
              for (var a = o.length - 1; a > 0; a--) {
                var h = Math.floor(n.random() * (a + 1)), c = o[a];
                o[a] = o[h], o[h] = c;
              }
              return o;
            }, n.choose = function(o) {
              return o[Math.floor(n.random() * o.length)];
            }, n.isElement = function(o) {
              return typeof HTMLElement < "u" ? o instanceof HTMLElement : !!(o && o.nodeType && o.nodeName);
            }, n.isArray = function(o) {
              return Object.prototype.toString.call(o) === "[object Array]";
            }, n.isFunction = function(o) {
              return typeof o == "function";
            }, n.isPlainObject = function(o) {
              return typeof o == "object" && o.constructor === Object;
            }, n.isString = function(o) {
              return toString.call(o) === "[object String]";
            }, n.clamp = function(o, a, h) {
              return o < a ? a : o > h ? h : o;
            }, n.sign = function(o) {
              return o < 0 ? -1 : 1;
            }, n.now = function() {
              if (typeof window < "u" && window.performance) {
                if (window.performance.now)
                  return window.performance.now();
                if (window.performance.webkitNow)
                  return window.performance.webkitNow();
              }
              return Date.now ? Date.now() : /* @__PURE__ */ new Date() - n._nowStartTime;
            }, n.random = function(o, a) {
              return o = typeof o < "u" ? o : 0, a = typeof a < "u" ? a : 1, o + r() * (a - o);
            };
            var r = function() {
              return n._seed = (n._seed * 9301 + 49297) % 233280, n._seed / 233280;
            };
            n.colorToNumber = function(o) {
              return o = o.replace("#", ""), o.length == 3 && (o = o.charAt(0) + o.charAt(0) + o.charAt(1) + o.charAt(1) + o.charAt(2) + o.charAt(2)), parseInt(o, 16);
            }, n.logLevel = 1, n.log = function() {
              console && n.logLevel > 0 && n.logLevel <= 3 && console.log.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, n.info = function() {
              console && n.logLevel > 0 && n.logLevel <= 2 && console.info.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, n.warn = function() {
              console && n.logLevel > 0 && n.logLevel <= 3 && console.warn.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, n.warnOnce = function() {
              var o = Array.prototype.slice.call(arguments).join(" ");
              n._warnedOnce[o] || (n.warn(o), n._warnedOnce[o] = !0);
            }, n.deprecated = function(o, a, h) {
              o[a] = n.chain(function() {
                n.warnOnce("🔅 deprecated 🔅", h);
              }, o[a]);
            }, n.nextId = function() {
              return n._nextId++;
            }, n.indexOf = function(o, a) {
              if (o.indexOf)
                return o.indexOf(a);
              for (var h = 0; h < o.length; h++)
                if (o[h] === a)
                  return h;
              return -1;
            }, n.map = function(o, a) {
              if (o.map)
                return o.map(a);
              for (var h = [], c = 0; c < o.length; c += 1)
                h.push(a(o[c]));
              return h;
            }, n.topologicalSort = function(o) {
              var a = [], h = [], c = [];
              for (var l in o)
                !h[l] && !c[l] && n._topologicalSort(l, h, c, o, a);
              return a;
            }, n._topologicalSort = function(o, a, h, c, l) {
              var d = c[o] || [];
              h[o] = !0;
              for (var f = 0; f < d.length; f += 1) {
                var u = d[f];
                h[u] || a[u] || n._topologicalSort(u, a, h, c, l);
              }
              h[o] = !1, a[o] = !0, l.push(o);
            }, n.chain = function() {
              for (var o = [], a = 0; a < arguments.length; a += 1) {
                var h = arguments[a];
                h._chained ? o.push.apply(o, h._chained) : o.push(h);
              }
              var c = function() {
                for (var l, d = new Array(arguments.length), f = 0, u = arguments.length; f < u; f++)
                  d[f] = arguments[f];
                for (f = 0; f < o.length; f += 1) {
                  var g = o[f].apply(l, d);
                  typeof g < "u" && (l = g);
                }
                return l;
              };
              return c._chained = o, c;
            }, n.chainPathBefore = function(o, a, h) {
              return n.set(o, a, n.chain(
                h,
                n.get(o, a)
              ));
            }, n.chainPathAfter = function(o, a, h) {
              return n.set(o, a, n.chain(
                n.get(o, a),
                h
              ));
            }, n.setDecomp = function(o) {
              n._decomp = o;
            }, n.getDecomp = function() {
              var o = n._decomp;
              try {
                !o && typeof window < "u" && (o = window.decomp), !o && typeof Je < "u" && (o = Je.decomp);
              } catch {
                o = null;
              }
              return o;
            };
          }();
        },
        /* 1 */
        /***/
        function(e, i) {
          var n = {};
          e.exports = n, function() {
            n.create = function(r) {
              var o = {
                min: { x: 0, y: 0 },
                max: { x: 0, y: 0 }
              };
              return r && n.update(o, r), o;
            }, n.update = function(r, o, a) {
              r.min.x = 1 / 0, r.max.x = -1 / 0, r.min.y = 1 / 0, r.max.y = -1 / 0;
              for (var h = 0; h < o.length; h++) {
                var c = o[h];
                c.x > r.max.x && (r.max.x = c.x), c.x < r.min.x && (r.min.x = c.x), c.y > r.max.y && (r.max.y = c.y), c.y < r.min.y && (r.min.y = c.y);
              }
              a && (a.x > 0 ? r.max.x += a.x : r.min.x += a.x, a.y > 0 ? r.max.y += a.y : r.min.y += a.y);
            }, n.contains = function(r, o) {
              return o.x >= r.min.x && o.x <= r.max.x && o.y >= r.min.y && o.y <= r.max.y;
            }, n.overlaps = function(r, o) {
              return r.min.x <= o.max.x && r.max.x >= o.min.x && r.max.y >= o.min.y && r.min.y <= o.max.y;
            }, n.translate = function(r, o) {
              r.min.x += o.x, r.max.x += o.x, r.min.y += o.y, r.max.y += o.y;
            }, n.shift = function(r, o) {
              var a = r.max.x - r.min.x, h = r.max.y - r.min.y;
              r.min.x = o.x, r.max.x = o.x + a, r.min.y = o.y, r.max.y = o.y + h;
            };
          }();
        },
        /* 2 */
        /***/
        function(e, i) {
          var n = {};
          e.exports = n, function() {
            n.create = function(r, o) {
              return { x: r || 0, y: o || 0 };
            }, n.clone = function(r) {
              return { x: r.x, y: r.y };
            }, n.magnitude = function(r) {
              return Math.sqrt(r.x * r.x + r.y * r.y);
            }, n.magnitudeSquared = function(r) {
              return r.x * r.x + r.y * r.y;
            }, n.rotate = function(r, o, a) {
              var h = Math.cos(o), c = Math.sin(o);
              a || (a = {});
              var l = r.x * h - r.y * c;
              return a.y = r.x * c + r.y * h, a.x = l, a;
            }, n.rotateAbout = function(r, o, a, h) {
              var c = Math.cos(o), l = Math.sin(o);
              h || (h = {});
              var d = a.x + ((r.x - a.x) * c - (r.y - a.y) * l);
              return h.y = a.y + ((r.x - a.x) * l + (r.y - a.y) * c), h.x = d, h;
            }, n.normalise = function(r) {
              var o = n.magnitude(r);
              return o === 0 ? { x: 0, y: 0 } : { x: r.x / o, y: r.y / o };
            }, n.dot = function(r, o) {
              return r.x * o.x + r.y * o.y;
            }, n.cross = function(r, o) {
              return r.x * o.y - r.y * o.x;
            }, n.cross3 = function(r, o, a) {
              return (o.x - r.x) * (a.y - r.y) - (o.y - r.y) * (a.x - r.x);
            }, n.add = function(r, o, a) {
              return a || (a = {}), a.x = r.x + o.x, a.y = r.y + o.y, a;
            }, n.sub = function(r, o, a) {
              return a || (a = {}), a.x = r.x - o.x, a.y = r.y - o.y, a;
            }, n.mult = function(r, o) {
              return { x: r.x * o, y: r.y * o };
            }, n.div = function(r, o) {
              return { x: r.x / o, y: r.y / o };
            }, n.perp = function(r, o) {
              return o = o === !0 ? -1 : 1, { x: o * -r.y, y: o * r.x };
            }, n.neg = function(r) {
              return { x: -r.x, y: -r.y };
            }, n.angle = function(r, o) {
              return Math.atan2(o.y - r.y, o.x - r.x);
            }, n._temp = [
              n.create(),
              n.create(),
              n.create(),
              n.create(),
              n.create(),
              n.create()
            ];
          }();
        },
        /* 3 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(2), a = n(0);
          (function() {
            r.create = function(h, c) {
              for (var l = [], d = 0; d < h.length; d++) {
                var f = h[d], u = {
                  x: f.x,
                  y: f.y,
                  index: d,
                  body: c,
                  isInternal: !1
                };
                l.push(u);
              }
              return l;
            }, r.fromPath = function(h, c) {
              var l = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/ig, d = [];
              return h.replace(l, function(f, u, g) {
                d.push({ x: parseFloat(u), y: parseFloat(g) });
              }), r.create(d, c);
            }, r.centre = function(h) {
              for (var c = r.area(h, !0), l = { x: 0, y: 0 }, d, f, u, g = 0; g < h.length; g++)
                u = (g + 1) % h.length, d = o.cross(h[g], h[u]), f = o.mult(o.add(h[g], h[u]), d), l = o.add(l, f);
              return o.div(l, 6 * c);
            }, r.mean = function(h) {
              for (var c = { x: 0, y: 0 }, l = 0; l < h.length; l++)
                c.x += h[l].x, c.y += h[l].y;
              return o.div(c, h.length);
            }, r.area = function(h, c) {
              for (var l = 0, d = h.length - 1, f = 0; f < h.length; f++)
                l += (h[d].x - h[f].x) * (h[d].y + h[f].y), d = f;
              return c ? l / 2 : Math.abs(l) / 2;
            }, r.inertia = function(h, c) {
              for (var l = 0, d = 0, f = h, u, g, p = 0; p < f.length; p++)
                g = (p + 1) % f.length, u = Math.abs(o.cross(f[g], f[p])), l += u * (o.dot(f[g], f[g]) + o.dot(f[g], f[p]) + o.dot(f[p], f[p])), d += u;
              return c / 6 * (l / d);
            }, r.translate = function(h, c, l) {
              l = typeof l < "u" ? l : 1;
              var d = h.length, f = c.x * l, u = c.y * l, g;
              for (g = 0; g < d; g++)
                h[g].x += f, h[g].y += u;
              return h;
            }, r.rotate = function(h, c, l) {
              if (c !== 0) {
                var d = Math.cos(c), f = Math.sin(c), u = l.x, g = l.y, p = h.length, m, x, y, v;
                for (v = 0; v < p; v++)
                  m = h[v], x = m.x - u, y = m.y - g, m.x = u + (x * d - y * f), m.y = g + (x * f + y * d);
                return h;
              }
            }, r.contains = function(h, c) {
              for (var l = c.x, d = c.y, f = h.length, u = h[f - 1], g, p = 0; p < f; p++) {
                if (g = h[p], (l - u.x) * (g.y - u.y) + (d - u.y) * (u.x - g.x) > 0)
                  return !1;
                u = g;
              }
              return !0;
            }, r.scale = function(h, c, l, d) {
              if (c === 1 && l === 1)
                return h;
              d = d || r.centre(h);
              for (var f, u, g = 0; g < h.length; g++)
                f = h[g], u = o.sub(f, d), h[g].x = d.x + u.x * c, h[g].y = d.y + u.y * l;
              return h;
            }, r.chamfer = function(h, c, l, d, f) {
              typeof c == "number" ? c = [c] : c = c || [8], l = typeof l < "u" ? l : -1, d = d || 2, f = f || 14;
              for (var u = [], g = 0; g < h.length; g++) {
                var p = h[g - 1 >= 0 ? g - 1 : h.length - 1], m = h[g], x = h[(g + 1) % h.length], y = c[g < c.length ? g : c.length - 1];
                if (y === 0) {
                  u.push(m);
                  continue;
                }
                var v = o.normalise({
                  x: m.y - p.y,
                  y: p.x - m.x
                }), w = o.normalise({
                  x: x.y - m.y,
                  y: m.x - x.x
                }), _ = Math.sqrt(2 * Math.pow(y, 2)), S = o.mult(a.clone(v), y), C = o.normalise(o.mult(o.add(v, w), 0.5)), b = o.sub(m, o.mult(C, _)), A = l;
                l === -1 && (A = Math.pow(y, 0.32) * 1.75), A = a.clamp(A, d, f), A % 2 === 1 && (A += 1);
                for (var P = Math.acos(o.dot(v, w)), M = P / A, T = 0; T < A; T++)
                  u.push(o.add(o.rotate(S, M * T), b));
              }
              return u;
            }, r.clockwiseSort = function(h) {
              var c = r.mean(h);
              return h.sort(function(l, d) {
                return o.angle(c, l) - o.angle(c, d);
              }), h;
            }, r.isConvex = function(h) {
              var c = 0, l = h.length, d, f, u, g;
              if (l < 3)
                return null;
              for (d = 0; d < l; d++)
                if (f = (d + 1) % l, u = (d + 2) % l, g = (h[f].x - h[d].x) * (h[u].y - h[f].y), g -= (h[f].y - h[d].y) * (h[u].x - h[f].x), g < 0 ? c |= 1 : g > 0 && (c |= 2), c === 3)
                  return !1;
              return c !== 0 ? !0 : null;
            }, r.hull = function(h) {
              var c = [], l = [], d, f;
              for (h = h.slice(0), h.sort(function(u, g) {
                var p = u.x - g.x;
                return p !== 0 ? p : u.y - g.y;
              }), f = 0; f < h.length; f += 1) {
                for (d = h[f]; l.length >= 2 && o.cross3(l[l.length - 2], l[l.length - 1], d) <= 0; )
                  l.pop();
                l.push(d);
              }
              for (f = h.length - 1; f >= 0; f -= 1) {
                for (d = h[f]; c.length >= 2 && o.cross3(c[c.length - 2], c[c.length - 1], d) <= 0; )
                  c.pop();
                c.push(d);
              }
              return c.pop(), l.pop(), c.concat(l);
            };
          })();
        },
        /* 4 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(3), a = n(2), h = n(7), c = n(0), l = n(1), d = n(11);
          (function() {
            r._timeCorrection = !0, r._inertiaScale = 4, r._nextCollidingGroupId = 1, r._nextNonCollidingGroupId = -1, r._nextCategory = 1, r._baseDelta = 1e3 / 60, r.create = function(u) {
              var g = {
                id: c.nextId(),
                type: "body",
                label: "Body",
                parts: [],
                plugin: {},
                angle: 0,
                vertices: o.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),
                position: { x: 0, y: 0 },
                force: { x: 0, y: 0 },
                torque: 0,
                positionImpulse: { x: 0, y: 0 },
                constraintImpulse: { x: 0, y: 0, angle: 0 },
                totalContacts: 0,
                speed: 0,
                angularSpeed: 0,
                velocity: { x: 0, y: 0 },
                angularVelocity: 0,
                isSensor: !1,
                isStatic: !1,
                isSleeping: !1,
                motion: 0,
                sleepThreshold: 60,
                density: 1e-3,
                restitution: 0,
                friction: 0.1,
                frictionStatic: 0.5,
                frictionAir: 0.01,
                collisionFilter: {
                  category: 1,
                  mask: 4294967295,
                  group: 0
                },
                slop: 0.05,
                timeScale: 1,
                render: {
                  visible: !0,
                  opacity: 1,
                  strokeStyle: null,
                  fillStyle: null,
                  lineWidth: null,
                  sprite: {
                    xScale: 1,
                    yScale: 1,
                    xOffset: 0,
                    yOffset: 0
                  }
                },
                events: null,
                bounds: null,
                chamfer: null,
                circleRadius: 0,
                positionPrev: null,
                anglePrev: 0,
                parent: null,
                axes: null,
                area: 0,
                mass: 0,
                inertia: 0,
                deltaTime: 16.666666666666668,
                _original: null
              }, p = c.extend(g, u);
              return f(p, u), p;
            }, r.nextGroup = function(u) {
              return u ? r._nextNonCollidingGroupId-- : r._nextCollidingGroupId++;
            }, r.nextCategory = function() {
              return r._nextCategory = r._nextCategory << 1, r._nextCategory;
            };
            var f = function(u, g) {
              g = g || {}, r.set(u, {
                bounds: u.bounds || l.create(u.vertices),
                positionPrev: u.positionPrev || a.clone(u.position),
                anglePrev: u.anglePrev || u.angle,
                vertices: u.vertices,
                parts: u.parts || [u],
                isStatic: u.isStatic,
                isSleeping: u.isSleeping,
                parent: u.parent || u
              }), o.rotate(u.vertices, u.angle, u.position), d.rotate(u.axes, u.angle), l.update(u.bounds, u.vertices, u.velocity), r.set(u, {
                axes: g.axes || u.axes,
                area: g.area || u.area,
                mass: g.mass || u.mass,
                inertia: g.inertia || u.inertia
              });
              var p = u.isStatic ? "#14151f" : c.choose(["#f19648", "#f5d259", "#f55a3c", "#063e7b", "#ececd1"]), m = u.isStatic ? "#555" : "#ccc", x = u.isStatic && u.render.fillStyle === null ? 1 : 0;
              u.render.fillStyle = u.render.fillStyle || p, u.render.strokeStyle = u.render.strokeStyle || m, u.render.lineWidth = u.render.lineWidth || x, u.render.sprite.xOffset += -(u.bounds.min.x - u.position.x) / (u.bounds.max.x - u.bounds.min.x), u.render.sprite.yOffset += -(u.bounds.min.y - u.position.y) / (u.bounds.max.y - u.bounds.min.y);
            };
            r.set = function(u, g, p) {
              var m;
              typeof g == "string" && (m = g, g = {}, g[m] = p);
              for (m in g)
                if (Object.prototype.hasOwnProperty.call(g, m))
                  switch (p = g[m], m) {
                    case "isStatic":
                      r.setStatic(u, p);
                      break;
                    case "isSleeping":
                      h.set(u, p);
                      break;
                    case "mass":
                      r.setMass(u, p);
                      break;
                    case "density":
                      r.setDensity(u, p);
                      break;
                    case "inertia":
                      r.setInertia(u, p);
                      break;
                    case "vertices":
                      r.setVertices(u, p);
                      break;
                    case "position":
                      r.setPosition(u, p);
                      break;
                    case "angle":
                      r.setAngle(u, p);
                      break;
                    case "velocity":
                      r.setVelocity(u, p);
                      break;
                    case "angularVelocity":
                      r.setAngularVelocity(u, p);
                      break;
                    case "speed":
                      r.setSpeed(u, p);
                      break;
                    case "angularSpeed":
                      r.setAngularSpeed(u, p);
                      break;
                    case "parts":
                      r.setParts(u, p);
                      break;
                    case "centre":
                      r.setCentre(u, p);
                      break;
                    default:
                      u[m] = p;
                  }
            }, r.setStatic = function(u, g) {
              for (var p = 0; p < u.parts.length; p++) {
                var m = u.parts[p];
                g ? (m.isStatic || (m._original = {
                  restitution: m.restitution,
                  friction: m.friction,
                  mass: m.mass,
                  inertia: m.inertia,
                  density: m.density,
                  inverseMass: m.inverseMass,
                  inverseInertia: m.inverseInertia
                }), m.restitution = 0, m.friction = 1, m.mass = m.inertia = m.density = 1 / 0, m.inverseMass = m.inverseInertia = 0, m.positionPrev.x = m.position.x, m.positionPrev.y = m.position.y, m.anglePrev = m.angle, m.angularVelocity = 0, m.speed = 0, m.angularSpeed = 0, m.motion = 0) : m._original && (m.restitution = m._original.restitution, m.friction = m._original.friction, m.mass = m._original.mass, m.inertia = m._original.inertia, m.density = m._original.density, m.inverseMass = m._original.inverseMass, m.inverseInertia = m._original.inverseInertia, m._original = null), m.isStatic = g;
              }
            }, r.setMass = function(u, g) {
              var p = u.inertia / (u.mass / 6);
              u.inertia = p * (g / 6), u.inverseInertia = 1 / u.inertia, u.mass = g, u.inverseMass = 1 / u.mass, u.density = u.mass / u.area;
            }, r.setDensity = function(u, g) {
              r.setMass(u, g * u.area), u.density = g;
            }, r.setInertia = function(u, g) {
              u.inertia = g, u.inverseInertia = 1 / u.inertia;
            }, r.setVertices = function(u, g) {
              g[0].body === u ? u.vertices = g : u.vertices = o.create(g, u), u.axes = d.fromVertices(u.vertices), u.area = o.area(u.vertices), r.setMass(u, u.density * u.area);
              var p = o.centre(u.vertices);
              o.translate(u.vertices, p, -1), r.setInertia(u, r._inertiaScale * o.inertia(u.vertices, u.mass)), o.translate(u.vertices, u.position), l.update(u.bounds, u.vertices, u.velocity);
            }, r.setParts = function(u, g, p) {
              var m;
              for (g = g.slice(0), u.parts.length = 0, u.parts.push(u), u.parent = u, m = 0; m < g.length; m++) {
                var x = g[m];
                x !== u && (x.parent = u, u.parts.push(x));
              }
              if (u.parts.length !== 1) {
                if (p = typeof p < "u" ? p : !0, p) {
                  var y = [];
                  for (m = 0; m < g.length; m++)
                    y = y.concat(g[m].vertices);
                  o.clockwiseSort(y);
                  var v = o.hull(y), w = o.centre(v);
                  r.setVertices(u, v), o.translate(u.vertices, w);
                }
                var _ = r._totalProperties(u);
                u.area = _.area, u.parent = u, u.position.x = _.centre.x, u.position.y = _.centre.y, u.positionPrev.x = _.centre.x, u.positionPrev.y = _.centre.y, r.setMass(u, _.mass), r.setInertia(u, _.inertia), r.setPosition(u, _.centre);
              }
            }, r.setCentre = function(u, g, p) {
              p ? (u.positionPrev.x += g.x, u.positionPrev.y += g.y, u.position.x += g.x, u.position.y += g.y) : (u.positionPrev.x = g.x - (u.position.x - u.positionPrev.x), u.positionPrev.y = g.y - (u.position.y - u.positionPrev.y), u.position.x = g.x, u.position.y = g.y);
            }, r.setPosition = function(u, g, p) {
              var m = a.sub(g, u.position);
              p ? (u.positionPrev.x = u.position.x, u.positionPrev.y = u.position.y, u.velocity.x = m.x, u.velocity.y = m.y, u.speed = a.magnitude(m)) : (u.positionPrev.x += m.x, u.positionPrev.y += m.y);
              for (var x = 0; x < u.parts.length; x++) {
                var y = u.parts[x];
                y.position.x += m.x, y.position.y += m.y, o.translate(y.vertices, m), l.update(y.bounds, y.vertices, u.velocity);
              }
            }, r.setAngle = function(u, g, p) {
              var m = g - u.angle;
              p ? (u.anglePrev = u.angle, u.angularVelocity = m, u.angularSpeed = Math.abs(m)) : u.anglePrev += m;
              for (var x = 0; x < u.parts.length; x++) {
                var y = u.parts[x];
                y.angle += m, o.rotate(y.vertices, m, u.position), d.rotate(y.axes, m), l.update(y.bounds, y.vertices, u.velocity), x > 0 && a.rotateAbout(y.position, m, u.position, y.position);
              }
            }, r.setVelocity = function(u, g) {
              var p = u.deltaTime / r._baseDelta;
              u.positionPrev.x = u.position.x - g.x * p, u.positionPrev.y = u.position.y - g.y * p, u.velocity.x = (u.position.x - u.positionPrev.x) / p, u.velocity.y = (u.position.y - u.positionPrev.y) / p, u.speed = a.magnitude(u.velocity);
            }, r.getVelocity = function(u) {
              var g = r._baseDelta / u.deltaTime;
              return {
                x: (u.position.x - u.positionPrev.x) * g,
                y: (u.position.y - u.positionPrev.y) * g
              };
            }, r.getSpeed = function(u) {
              return a.magnitude(r.getVelocity(u));
            }, r.setSpeed = function(u, g) {
              r.setVelocity(u, a.mult(a.normalise(r.getVelocity(u)), g));
            }, r.setAngularVelocity = function(u, g) {
              var p = u.deltaTime / r._baseDelta;
              u.anglePrev = u.angle - g * p, u.angularVelocity = (u.angle - u.anglePrev) / p, u.angularSpeed = Math.abs(u.angularVelocity);
            }, r.getAngularVelocity = function(u) {
              return (u.angle - u.anglePrev) * r._baseDelta / u.deltaTime;
            }, r.getAngularSpeed = function(u) {
              return Math.abs(r.getAngularVelocity(u));
            }, r.setAngularSpeed = function(u, g) {
              r.setAngularVelocity(u, c.sign(r.getAngularVelocity(u)) * g);
            }, r.translate = function(u, g, p) {
              r.setPosition(u, a.add(u.position, g), p);
            }, r.rotate = function(u, g, p, m) {
              if (!p)
                r.setAngle(u, u.angle + g, m);
              else {
                var x = Math.cos(g), y = Math.sin(g), v = u.position.x - p.x, w = u.position.y - p.y;
                r.setPosition(u, {
                  x: p.x + (v * x - w * y),
                  y: p.y + (v * y + w * x)
                }, m), r.setAngle(u, u.angle + g, m);
              }
            }, r.scale = function(u, g, p, m) {
              var x = 0, y = 0;
              m = m || u.position;
              for (var v = 0; v < u.parts.length; v++) {
                var w = u.parts[v];
                o.scale(w.vertices, g, p, m), w.axes = d.fromVertices(w.vertices), w.area = o.area(w.vertices), r.setMass(w, u.density * w.area), o.translate(w.vertices, { x: -w.position.x, y: -w.position.y }), r.setInertia(w, r._inertiaScale * o.inertia(w.vertices, w.mass)), o.translate(w.vertices, { x: w.position.x, y: w.position.y }), v > 0 && (x += w.area, y += w.inertia), w.position.x = m.x + (w.position.x - m.x) * g, w.position.y = m.y + (w.position.y - m.y) * p, l.update(w.bounds, w.vertices, u.velocity);
              }
              u.parts.length > 1 && (u.area = x, u.isStatic || (r.setMass(u, u.density * x), r.setInertia(u, y))), u.circleRadius && (g === p ? u.circleRadius *= g : u.circleRadius = null);
            }, r.update = function(u, g) {
              g = (typeof g < "u" ? g : 1e3 / 60) * u.timeScale;
              var p = g * g, m = r._timeCorrection ? g / (u.deltaTime || g) : 1, x = 1 - u.frictionAir * (g / c._baseDelta), y = (u.position.x - u.positionPrev.x) * m, v = (u.position.y - u.positionPrev.y) * m;
              u.velocity.x = y * x + u.force.x / u.mass * p, u.velocity.y = v * x + u.force.y / u.mass * p, u.positionPrev.x = u.position.x, u.positionPrev.y = u.position.y, u.position.x += u.velocity.x, u.position.y += u.velocity.y, u.deltaTime = g, u.angularVelocity = (u.angle - u.anglePrev) * x * m + u.torque / u.inertia * p, u.anglePrev = u.angle, u.angle += u.angularVelocity;
              for (var w = 0; w < u.parts.length; w++) {
                var _ = u.parts[w];
                o.translate(_.vertices, u.velocity), w > 0 && (_.position.x += u.velocity.x, _.position.y += u.velocity.y), u.angularVelocity !== 0 && (o.rotate(_.vertices, u.angularVelocity, u.position), d.rotate(_.axes, u.angularVelocity), w > 0 && a.rotateAbout(_.position, u.angularVelocity, u.position, _.position)), l.update(_.bounds, _.vertices, u.velocity);
              }
            }, r.updateVelocities = function(u) {
              var g = r._baseDelta / u.deltaTime, p = u.velocity;
              p.x = (u.position.x - u.positionPrev.x) * g, p.y = (u.position.y - u.positionPrev.y) * g, u.speed = Math.sqrt(p.x * p.x + p.y * p.y), u.angularVelocity = (u.angle - u.anglePrev) * g, u.angularSpeed = Math.abs(u.angularVelocity);
            }, r.applyForce = function(u, g, p) {
              var m = { x: g.x - u.position.x, y: g.y - u.position.y };
              u.force.x += p.x, u.force.y += p.y, u.torque += m.x * p.y - m.y * p.x;
            }, r._totalProperties = function(u) {
              for (var g = {
                mass: 0,
                area: 0,
                inertia: 0,
                centre: { x: 0, y: 0 }
              }, p = u.parts.length === 1 ? 0 : 1; p < u.parts.length; p++) {
                var m = u.parts[p], x = m.mass !== 1 / 0 ? m.mass : 1;
                g.mass += x, g.area += m.area, g.inertia += m.inertia, g.centre = a.add(g.centre, a.mult(m.position, x));
              }
              return g.centre = a.div(g.centre, g.mass), g;
            };
          })();
        },
        /* 5 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(0);
          (function() {
            r.on = function(a, h, c) {
              for (var l = h.split(" "), d, f = 0; f < l.length; f++)
                d = l[f], a.events = a.events || {}, a.events[d] = a.events[d] || [], a.events[d].push(c);
              return c;
            }, r.off = function(a, h, c) {
              if (!h) {
                a.events = {};
                return;
              }
              typeof h == "function" && (c = h, h = o.keys(a.events).join(" "));
              for (var l = h.split(" "), d = 0; d < l.length; d++) {
                var f = a.events[l[d]], u = [];
                if (c && f)
                  for (var g = 0; g < f.length; g++)
                    f[g] !== c && u.push(f[g]);
                a.events[l[d]] = u;
              }
            }, r.trigger = function(a, h, c) {
              var l, d, f, u, g = a.events;
              if (g && o.keys(g).length > 0) {
                c || (c = {}), l = h.split(" ");
                for (var p = 0; p < l.length; p++)
                  if (d = l[p], f = g[d], f) {
                    u = o.clone(c, !1), u.name = d, u.source = a;
                    for (var m = 0; m < f.length; m++)
                      f[m].apply(a, [u]);
                  }
              }
            };
          })();
        },
        /* 6 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(5), a = n(0), h = n(1), c = n(4);
          (function() {
            r.create = function(l) {
              return a.extend({
                id: a.nextId(),
                type: "composite",
                parent: null,
                isModified: !1,
                bodies: [],
                constraints: [],
                composites: [],
                label: "Composite",
                plugin: {},
                cache: {
                  allBodies: null,
                  allConstraints: null,
                  allComposites: null
                }
              }, l);
            }, r.setModified = function(l, d, f, u) {
              if (l.isModified = d, d && l.cache && (l.cache.allBodies = null, l.cache.allConstraints = null, l.cache.allComposites = null), f && l.parent && r.setModified(l.parent, d, f, u), u)
                for (var g = 0; g < l.composites.length; g++) {
                  var p = l.composites[g];
                  r.setModified(p, d, f, u);
                }
            }, r.add = function(l, d) {
              var f = [].concat(d);
              o.trigger(l, "beforeAdd", { object: d });
              for (var u = 0; u < f.length; u++) {
                var g = f[u];
                switch (g.type) {
                  case "body":
                    if (g.parent !== g) {
                      a.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");
                      break;
                    }
                    r.addBody(l, g);
                    break;
                  case "constraint":
                    r.addConstraint(l, g);
                    break;
                  case "composite":
                    r.addComposite(l, g);
                    break;
                  case "mouseConstraint":
                    r.addConstraint(l, g.constraint);
                    break;
                }
              }
              return o.trigger(l, "afterAdd", { object: d }), l;
            }, r.remove = function(l, d, f) {
              var u = [].concat(d);
              o.trigger(l, "beforeRemove", { object: d });
              for (var g = 0; g < u.length; g++) {
                var p = u[g];
                switch (p.type) {
                  case "body":
                    r.removeBody(l, p, f);
                    break;
                  case "constraint":
                    r.removeConstraint(l, p, f);
                    break;
                  case "composite":
                    r.removeComposite(l, p, f);
                    break;
                  case "mouseConstraint":
                    r.removeConstraint(l, p.constraint);
                    break;
                }
              }
              return o.trigger(l, "afterRemove", { object: d }), l;
            }, r.addComposite = function(l, d) {
              return l.composites.push(d), d.parent = l, r.setModified(l, !0, !0, !1), l;
            }, r.removeComposite = function(l, d, f) {
              var u = a.indexOf(l.composites, d);
              if (u !== -1) {
                var g = r.allBodies(d);
                r.removeCompositeAt(l, u);
                for (var p = 0; p < g.length; p++)
                  g[p].sleepCounter = 0;
              }
              if (f)
                for (var p = 0; p < l.composites.length; p++)
                  r.removeComposite(l.composites[p], d, !0);
              return l;
            }, r.removeCompositeAt = function(l, d) {
              return l.composites.splice(d, 1), r.setModified(l, !0, !0, !1), l;
            }, r.addBody = function(l, d) {
              return l.bodies.push(d), r.setModified(l, !0, !0, !1), l;
            }, r.removeBody = function(l, d, f) {
              var u = a.indexOf(l.bodies, d);
              if (u !== -1 && (r.removeBodyAt(l, u), d.sleepCounter = 0), f)
                for (var g = 0; g < l.composites.length; g++)
                  r.removeBody(l.composites[g], d, !0);
              return l;
            }, r.removeBodyAt = function(l, d) {
              return l.bodies.splice(d, 1), r.setModified(l, !0, !0, !1), l;
            }, r.addConstraint = function(l, d) {
              return l.constraints.push(d), r.setModified(l, !0, !0, !1), l;
            }, r.removeConstraint = function(l, d, f) {
              var u = a.indexOf(l.constraints, d);
              if (u !== -1 && r.removeConstraintAt(l, u), f)
                for (var g = 0; g < l.composites.length; g++)
                  r.removeConstraint(l.composites[g], d, !0);
              return l;
            }, r.removeConstraintAt = function(l, d) {
              return l.constraints.splice(d, 1), r.setModified(l, !0, !0, !1), l;
            }, r.clear = function(l, d, f) {
              if (f)
                for (var u = 0; u < l.composites.length; u++)
                  r.clear(l.composites[u], d, !0);
              return d ? l.bodies = l.bodies.filter(function(g) {
                return g.isStatic;
              }) : l.bodies.length = 0, l.constraints.length = 0, l.composites.length = 0, r.setModified(l, !0, !0, !1), l;
            }, r.allBodies = function(l) {
              if (l.cache && l.cache.allBodies)
                return l.cache.allBodies;
              for (var d = [].concat(l.bodies), f = 0; f < l.composites.length; f++)
                d = d.concat(r.allBodies(l.composites[f]));
              return l.cache && (l.cache.allBodies = d), d;
            }, r.allConstraints = function(l) {
              if (l.cache && l.cache.allConstraints)
                return l.cache.allConstraints;
              for (var d = [].concat(l.constraints), f = 0; f < l.composites.length; f++)
                d = d.concat(r.allConstraints(l.composites[f]));
              return l.cache && (l.cache.allConstraints = d), d;
            }, r.allComposites = function(l) {
              if (l.cache && l.cache.allComposites)
                return l.cache.allComposites;
              for (var d = [].concat(l.composites), f = 0; f < l.composites.length; f++)
                d = d.concat(r.allComposites(l.composites[f]));
              return l.cache && (l.cache.allComposites = d), d;
            }, r.get = function(l, d, f) {
              var u, g;
              switch (f) {
                case "body":
                  u = r.allBodies(l);
                  break;
                case "constraint":
                  u = r.allConstraints(l);
                  break;
                case "composite":
                  u = r.allComposites(l).concat(l);
                  break;
              }
              return u ? (g = u.filter(function(p) {
                return p.id.toString() === d.toString();
              }), g.length === 0 ? null : g[0]) : null;
            }, r.move = function(l, d, f) {
              return r.remove(l, d), r.add(f, d), l;
            }, r.rebase = function(l) {
              for (var d = r.allBodies(l).concat(r.allConstraints(l)).concat(r.allComposites(l)), f = 0; f < d.length; f++)
                d[f].id = a.nextId();
              return l;
            }, r.translate = function(l, d, f) {
              for (var u = f ? r.allBodies(l) : l.bodies, g = 0; g < u.length; g++)
                c.translate(u[g], d);
              return l;
            }, r.rotate = function(l, d, f, u) {
              for (var g = Math.cos(d), p = Math.sin(d), m = u ? r.allBodies(l) : l.bodies, x = 0; x < m.length; x++) {
                var y = m[x], v = y.position.x - f.x, w = y.position.y - f.y;
                c.setPosition(y, {
                  x: f.x + (v * g - w * p),
                  y: f.y + (v * p + w * g)
                }), c.rotate(y, d);
              }
              return l;
            }, r.scale = function(l, d, f, u, g) {
              for (var p = g ? r.allBodies(l) : l.bodies, m = 0; m < p.length; m++) {
                var x = p[m], y = x.position.x - u.x, v = x.position.y - u.y;
                c.setPosition(x, {
                  x: u.x + y * d,
                  y: u.y + v * f
                }), c.scale(x, d, f);
              }
              return l;
            }, r.bounds = function(l) {
              for (var d = r.allBodies(l), f = [], u = 0; u < d.length; u += 1) {
                var g = d[u];
                f.push(g.bounds.min, g.bounds.max);
              }
              return h.create(f);
            };
          })();
        },
        /* 7 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(4), a = n(5), h = n(0);
          (function() {
            r._motionWakeThreshold = 0.18, r._motionSleepThreshold = 0.08, r._minBias = 0.9, r.update = function(c, l) {
              for (var d = l / h._baseDelta, f = r._motionSleepThreshold, u = 0; u < c.length; u++) {
                var g = c[u], p = o.getSpeed(g), m = o.getAngularSpeed(g), x = p * p + m * m;
                if (g.force.x !== 0 || g.force.y !== 0) {
                  r.set(g, !1);
                  continue;
                }
                var y = Math.min(g.motion, x), v = Math.max(g.motion, x);
                g.motion = r._minBias * y + (1 - r._minBias) * v, g.sleepThreshold > 0 && g.motion < f ? (g.sleepCounter += 1, g.sleepCounter >= g.sleepThreshold / d && r.set(g, !0)) : g.sleepCounter > 0 && (g.sleepCounter -= 1);
              }
            }, r.afterCollisions = function(c) {
              for (var l = r._motionSleepThreshold, d = 0; d < c.length; d++) {
                var f = c[d];
                if (f.isActive) {
                  var u = f.collision, g = u.bodyA.parent, p = u.bodyB.parent;
                  if (!(g.isSleeping && p.isSleeping || g.isStatic || p.isStatic) && (g.isSleeping || p.isSleeping)) {
                    var m = g.isSleeping && !g.isStatic ? g : p, x = m === g ? p : g;
                    !m.isStatic && x.motion > l && r.set(m, !1);
                  }
                }
              }
            }, r.set = function(c, l) {
              var d = c.isSleeping;
              l ? (c.isSleeping = !0, c.sleepCounter = c.sleepThreshold, c.positionImpulse.x = 0, c.positionImpulse.y = 0, c.positionPrev.x = c.position.x, c.positionPrev.y = c.position.y, c.anglePrev = c.angle, c.speed = 0, c.angularSpeed = 0, c.motion = 0, d || a.trigger(c, "sleepStart")) : (c.isSleeping = !1, c.sleepCounter = 0, d && a.trigger(c, "sleepEnd"));
            };
          })();
        },
        /* 8 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(3), a = n(9);
          (function() {
            var h = [], c = {
              overlap: 0,
              axis: null
            }, l = {
              overlap: 0,
              axis: null
            };
            r.create = function(d, f) {
              return {
                pair: null,
                collided: !1,
                bodyA: d,
                bodyB: f,
                parentA: d.parent,
                parentB: f.parent,
                depth: 0,
                normal: { x: 0, y: 0 },
                tangent: { x: 0, y: 0 },
                penetration: { x: 0, y: 0 },
                supports: [null, null],
                supportCount: 0
              };
            }, r.collides = function(d, f, u) {
              if (r._overlapAxes(c, d.vertices, f.vertices, d.axes), c.overlap <= 0 || (r._overlapAxes(l, f.vertices, d.vertices, f.axes), l.overlap <= 0))
                return null;
              var g = u && u.table[a.id(d, f)], p;
              g ? p = g.collision : (p = r.create(d, f), p.collided = !0, p.bodyA = d.id < f.id ? d : f, p.bodyB = d.id < f.id ? f : d, p.parentA = p.bodyA.parent, p.parentB = p.bodyB.parent), d = p.bodyA, f = p.bodyB;
              var m;
              c.overlap < l.overlap ? m = c : m = l;
              var x = p.normal, y = p.tangent, v = p.penetration, w = p.supports, _ = m.overlap, S = m.axis, C = S.x, b = S.y, A = f.position.x - d.position.x, P = f.position.y - d.position.y;
              C * A + b * P >= 0 && (C = -C, b = -b), x.x = C, x.y = b, y.x = -b, y.y = C, v.x = C * _, v.y = b * _, p.depth = _;
              var M = r._findSupports(d, f, x, 1), T = 0;
              if (o.contains(d.vertices, M[0]) && (w[T++] = M[0]), o.contains(d.vertices, M[1]) && (w[T++] = M[1]), T < 2) {
                var k = r._findSupports(f, d, x, -1);
                o.contains(f.vertices, k[0]) && (w[T++] = k[0]), T < 2 && o.contains(f.vertices, k[1]) && (w[T++] = k[1]);
              }
              return T === 0 && (w[T++] = M[0]), p.supportCount = T, p;
            }, r._overlapAxes = function(d, f, u, g) {
              var p = f.length, m = u.length, x = f[0].x, y = f[0].y, v = u[0].x, w = u[0].y, _ = g.length, S = Number.MAX_VALUE, C = 0, b, A, P, M, T, k;
              for (T = 0; T < _; T++) {
                var E = g[T], I = E.x, B = E.y, R = x * I + y * B, z = v * I + w * B, F = R, L = z;
                for (k = 1; k < p; k += 1)
                  M = f[k].x * I + f[k].y * B, M > F ? F = M : M < R && (R = M);
                for (k = 1; k < m; k += 1)
                  M = u[k].x * I + u[k].y * B, M > L ? L = M : M < z && (z = M);
                if (A = F - z, P = L - R, b = A < P ? A : P, b < S && (S = b, C = T, b <= 0))
                  break;
              }
              d.axis = g[C], d.overlap = S;
            }, r._findSupports = function(d, f, u, g) {
              var p = f.vertices, m = p.length, x = d.position.x, y = d.position.y, v = u.x * g, w = u.y * g, _ = p[0], S = _, C = v * (x - S.x) + w * (y - S.y), b, A, P;
              for (P = 1; P < m; P += 1)
                S = p[P], A = v * (x - S.x) + w * (y - S.y), A < C && (C = A, _ = S);
              return b = p[(m + _.index - 1) % m], C = v * (x - b.x) + w * (y - b.y), S = p[(_.index + 1) % m], v * (x - S.x) + w * (y - S.y) < C ? (h[0] = _, h[1] = S, h) : (h[0] = _, h[1] = b, h);
            };
          })();
        },
        /* 9 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(16);
          (function() {
            r.create = function(a, h) {
              var c = a.bodyA, l = a.bodyB, d = {
                id: r.id(c, l),
                bodyA: c,
                bodyB: l,
                collision: a,
                contacts: [o.create(), o.create()],
                contactCount: 0,
                separation: 0,
                isActive: !0,
                isSensor: c.isSensor || l.isSensor,
                timeCreated: h,
                timeUpdated: h,
                inverseMass: 0,
                friction: 0,
                frictionStatic: 0,
                restitution: 0,
                slop: 0
              };
              return r.update(d, a, h), d;
            }, r.update = function(a, h, c) {
              var l = h.supports, d = h.supportCount, f = a.contacts, u = h.parentA, g = h.parentB;
              a.isActive = !0, a.timeUpdated = c, a.collision = h, a.separation = h.depth, a.inverseMass = u.inverseMass + g.inverseMass, a.friction = u.friction < g.friction ? u.friction : g.friction, a.frictionStatic = u.frictionStatic > g.frictionStatic ? u.frictionStatic : g.frictionStatic, a.restitution = u.restitution > g.restitution ? u.restitution : g.restitution, a.slop = u.slop > g.slop ? u.slop : g.slop, a.contactCount = d, h.pair = a;
              var p = l[0], m = f[0], x = l[1], y = f[1];
              (y.vertex === p || m.vertex === x) && (f[1] = m, f[0] = m = y, y = f[1]), m.vertex = p, y.vertex = x;
            }, r.setActive = function(a, h, c) {
              h ? (a.isActive = !0, a.timeUpdated = c) : (a.isActive = !1, a.contactCount = 0);
            }, r.id = function(a, h) {
              return a.id < h.id ? a.id.toString(36) + ":" + h.id.toString(36) : h.id.toString(36) + ":" + a.id.toString(36);
            };
          })();
        },
        /* 10 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(3), a = n(2), h = n(7), c = n(1), l = n(11), d = n(0);
          (function() {
            r._warming = 0.4, r._torqueDampen = 1, r._minLength = 1e-6, r.create = function(f) {
              var u = f;
              u.bodyA && !u.pointA && (u.pointA = { x: 0, y: 0 }), u.bodyB && !u.pointB && (u.pointB = { x: 0, y: 0 });
              var g = u.bodyA ? a.add(u.bodyA.position, u.pointA) : u.pointA, p = u.bodyB ? a.add(u.bodyB.position, u.pointB) : u.pointB, m = a.magnitude(a.sub(g, p));
              u.length = typeof u.length < "u" ? u.length : m, u.id = u.id || d.nextId(), u.label = u.label || "Constraint", u.type = "constraint", u.stiffness = u.stiffness || (u.length > 0 ? 1 : 0.7), u.damping = u.damping || 0, u.angularStiffness = u.angularStiffness || 0, u.angleA = u.bodyA ? u.bodyA.angle : u.angleA, u.angleB = u.bodyB ? u.bodyB.angle : u.angleB, u.plugin = {};
              var x = {
                visible: !0,
                lineWidth: 2,
                strokeStyle: "#ffffff",
                type: "line",
                anchors: !0
              };
              return u.length === 0 && u.stiffness > 0.1 ? (x.type = "pin", x.anchors = !1) : u.stiffness < 0.9 && (x.type = "spring"), u.render = d.extend(x, u.render), u;
            }, r.preSolveAll = function(f) {
              for (var u = 0; u < f.length; u += 1) {
                var g = f[u], p = g.constraintImpulse;
                g.isStatic || p.x === 0 && p.y === 0 && p.angle === 0 || (g.position.x += p.x, g.position.y += p.y, g.angle += p.angle);
              }
            }, r.solveAll = function(f, u) {
              for (var g = d.clamp(u / d._baseDelta, 0, 1), p = 0; p < f.length; p += 1) {
                var m = f[p], x = !m.bodyA || m.bodyA && m.bodyA.isStatic, y = !m.bodyB || m.bodyB && m.bodyB.isStatic;
                (x || y) && r.solve(f[p], g);
              }
              for (p = 0; p < f.length; p += 1)
                m = f[p], x = !m.bodyA || m.bodyA && m.bodyA.isStatic, y = !m.bodyB || m.bodyB && m.bodyB.isStatic, !x && !y && r.solve(f[p], g);
            }, r.solve = function(f, u) {
              var g = f.bodyA, p = f.bodyB, m = f.pointA, x = f.pointB;
              if (!(!g && !p)) {
                g && !g.isStatic && (a.rotate(m, g.angle - f.angleA, m), f.angleA = g.angle), p && !p.isStatic && (a.rotate(x, p.angle - f.angleB, x), f.angleB = p.angle);
                var y = m, v = x;
                if (g && (y = a.add(g.position, m)), p && (v = a.add(p.position, x)), !(!y || !v)) {
                  var w = a.sub(y, v), _ = a.magnitude(w);
                  _ < r._minLength && (_ = r._minLength);
                  var S = (_ - f.length) / _, C = f.stiffness >= 1 || f.length === 0, b = C ? f.stiffness * u : f.stiffness * u * u, A = f.damping * u, P = a.mult(w, S * b), M = (g ? g.inverseMass : 0) + (p ? p.inverseMass : 0), T = (g ? g.inverseInertia : 0) + (p ? p.inverseInertia : 0), k = M + T, E, I, B, R, z;
                  if (A > 0) {
                    var F = a.create();
                    B = a.div(w, _), z = a.sub(
                      p && a.sub(p.position, p.positionPrev) || F,
                      g && a.sub(g.position, g.positionPrev) || F
                    ), R = a.dot(B, z);
                  }
                  g && !g.isStatic && (I = g.inverseMass / M, g.constraintImpulse.x -= P.x * I, g.constraintImpulse.y -= P.y * I, g.position.x -= P.x * I, g.position.y -= P.y * I, A > 0 && (g.positionPrev.x -= A * B.x * R * I, g.positionPrev.y -= A * B.y * R * I), E = a.cross(m, P) / k * r._torqueDampen * g.inverseInertia * (1 - f.angularStiffness), g.constraintImpulse.angle -= E, g.angle -= E), p && !p.isStatic && (I = p.inverseMass / M, p.constraintImpulse.x += P.x * I, p.constraintImpulse.y += P.y * I, p.position.x += P.x * I, p.position.y += P.y * I, A > 0 && (p.positionPrev.x += A * B.x * R * I, p.positionPrev.y += A * B.y * R * I), E = a.cross(x, P) / k * r._torqueDampen * p.inverseInertia * (1 - f.angularStiffness), p.constraintImpulse.angle += E, p.angle += E);
                }
              }
            }, r.postSolveAll = function(f) {
              for (var u = 0; u < f.length; u++) {
                var g = f[u], p = g.constraintImpulse;
                if (!(g.isStatic || p.x === 0 && p.y === 0 && p.angle === 0)) {
                  h.set(g, !1);
                  for (var m = 0; m < g.parts.length; m++) {
                    var x = g.parts[m];
                    o.translate(x.vertices, p), m > 0 && (x.position.x += p.x, x.position.y += p.y), p.angle !== 0 && (o.rotate(x.vertices, p.angle, g.position), l.rotate(x.axes, p.angle), m > 0 && a.rotateAbout(x.position, p.angle, g.position, x.position)), c.update(x.bounds, x.vertices, g.velocity);
                  }
                  p.angle *= r._warming, p.x *= r._warming, p.y *= r._warming;
                }
              }
            }, r.pointAWorld = function(f) {
              return {
                x: (f.bodyA ? f.bodyA.position.x : 0) + (f.pointA ? f.pointA.x : 0),
                y: (f.bodyA ? f.bodyA.position.y : 0) + (f.pointA ? f.pointA.y : 0)
              };
            }, r.pointBWorld = function(f) {
              return {
                x: (f.bodyB ? f.bodyB.position.x : 0) + (f.pointB ? f.pointB.x : 0),
                y: (f.bodyB ? f.bodyB.position.y : 0) + (f.pointB ? f.pointB.y : 0)
              };
            }, r.currentLength = function(f) {
              var u = (f.bodyA ? f.bodyA.position.x : 0) + (f.pointA ? f.pointA.x : 0), g = (f.bodyA ? f.bodyA.position.y : 0) + (f.pointA ? f.pointA.y : 0), p = (f.bodyB ? f.bodyB.position.x : 0) + (f.pointB ? f.pointB.x : 0), m = (f.bodyB ? f.bodyB.position.y : 0) + (f.pointB ? f.pointB.y : 0), x = u - p, y = g - m;
              return Math.sqrt(x * x + y * y);
            };
          })();
        },
        /* 11 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(2), a = n(0);
          (function() {
            r.fromVertices = function(h) {
              for (var c = {}, l = 0; l < h.length; l++) {
                var d = (l + 1) % h.length, f = o.normalise({
                  x: h[d].y - h[l].y,
                  y: h[l].x - h[d].x
                }), u = f.y === 0 ? 1 / 0 : f.x / f.y;
                u = u.toFixed(3).toString(), c[u] = f;
              }
              return a.values(c);
            }, r.rotate = function(h, c) {
              if (c !== 0)
                for (var l = Math.cos(c), d = Math.sin(c), f = 0; f < h.length; f++) {
                  var u = h[f], g;
                  g = u.x * l - u.y * d, u.y = u.x * d + u.y * l, u.x = g;
                }
            };
          })();
        },
        /* 12 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(3), a = n(0), h = n(4), c = n(1), l = n(2);
          (function() {
            r.rectangle = function(d, f, u, g, p) {
              p = p || {};
              var m = {
                label: "Rectangle Body",
                position: { x: d, y: f },
                vertices: o.fromPath("L 0 0 L " + u + " 0 L " + u + " " + g + " L 0 " + g)
              };
              if (p.chamfer) {
                var x = p.chamfer;
                m.vertices = o.chamfer(
                  m.vertices,
                  x.radius,
                  x.quality,
                  x.qualityMin,
                  x.qualityMax
                ), delete p.chamfer;
              }
              return h.create(a.extend({}, m, p));
            }, r.trapezoid = function(d, f, u, g, p, m) {
              m = m || {}, p >= 1 && a.warn("Bodies.trapezoid: slope parameter must be < 1."), p *= 0.5;
              var x = (1 - p * 2) * u, y = u * p, v = y + x, w = v + y, _;
              p < 0.5 ? _ = "L 0 0 L " + y + " " + -g + " L " + v + " " + -g + " L " + w + " 0" : _ = "L 0 0 L " + v + " " + -g + " L " + w + " 0";
              var S = {
                label: "Trapezoid Body",
                position: { x: d, y: f },
                vertices: o.fromPath(_)
              };
              if (m.chamfer) {
                var C = m.chamfer;
                S.vertices = o.chamfer(
                  S.vertices,
                  C.radius,
                  C.quality,
                  C.qualityMin,
                  C.qualityMax
                ), delete m.chamfer;
              }
              return h.create(a.extend({}, S, m));
            }, r.circle = function(d, f, u, g, p) {
              g = g || {};
              var m = {
                label: "Circle Body",
                circleRadius: u
              };
              p = p || 25;
              var x = Math.ceil(Math.max(10, Math.min(p, u)));
              return x % 2 === 1 && (x += 1), r.polygon(d, f, x, u, a.extend({}, m, g));
            }, r.polygon = function(d, f, u, g, p) {
              if (p = p || {}, u < 3)
                return r.circle(d, f, g, p);
              for (var m = 2 * Math.PI / u, x = "", y = m * 0.5, v = 0; v < u; v += 1) {
                var w = y + v * m, _ = Math.cos(w) * g, S = Math.sin(w) * g;
                x += "L " + _.toFixed(3) + " " + S.toFixed(3) + " ";
              }
              var C = {
                label: "Polygon Body",
                position: { x: d, y: f },
                vertices: o.fromPath(x)
              };
              if (p.chamfer) {
                var b = p.chamfer;
                C.vertices = o.chamfer(
                  C.vertices,
                  b.radius,
                  b.quality,
                  b.qualityMin,
                  b.qualityMax
                ), delete p.chamfer;
              }
              return h.create(a.extend({}, C, p));
            }, r.fromVertices = function(d, f, u, g, p, m, x, y) {
              var v = a.getDecomp(), w, _, S, C, b, A, P, M, T, k, E;
              for (w = !!(v && v.quickDecomp), g = g || {}, S = [], p = typeof p < "u" ? p : !1, m = typeof m < "u" ? m : 0.01, x = typeof x < "u" ? x : 10, y = typeof y < "u" ? y : 0.01, a.isArray(u[0]) || (u = [u]), k = 0; k < u.length; k += 1)
                if (A = u[k], C = o.isConvex(A), b = !C, b && !w && a.warnOnce(
                  "Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."
                ), C || !w)
                  C ? A = o.clockwiseSort(A) : A = o.hull(A), S.push({
                    position: { x: d, y: f },
                    vertices: A
                  });
                else {
                  var I = A.map(function(V) {
                    return [V.x, V.y];
                  });
                  v.makeCCW(I), m !== !1 && v.removeCollinearPoints(I, m), y !== !1 && v.removeDuplicatePoints && v.removeDuplicatePoints(I, y);
                  var B = v.quickDecomp(I);
                  for (P = 0; P < B.length; P++) {
                    var R = B[P], z = R.map(function(V) {
                      return {
                        x: V[0],
                        y: V[1]
                      };
                    });
                    x > 0 && o.area(z) < x || S.push({
                      position: o.centre(z),
                      vertices: z
                    });
                  }
                }
              for (P = 0; P < S.length; P++)
                S[P] = h.create(a.extend(S[P], g));
              if (p) {
                var F = 5;
                for (P = 0; P < S.length; P++) {
                  var L = S[P];
                  for (M = P + 1; M < S.length; M++) {
                    var Z = S[M];
                    if (c.overlaps(L.bounds, Z.bounds)) {
                      var U = L.vertices, X = Z.vertices;
                      for (T = 0; T < L.vertices.length; T++)
                        for (E = 0; E < Z.vertices.length; E++) {
                          var J = l.magnitudeSquared(l.sub(U[(T + 1) % U.length], X[E])), Q = l.magnitudeSquared(l.sub(U[T], X[(E + 1) % X.length]));
                          J < F && Q < F && (U[T].isInternal = !0, X[E].isInternal = !0);
                        }
                    }
                  }
                }
              }
              return S.length > 1 ? (_ = h.create(a.extend({ parts: S.slice(0) }, g)), h.setPosition(_, { x: d, y: f }), _) : S[0];
            };
          })();
        },
        /* 13 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(0), a = n(8);
          (function() {
            r.create = function(h) {
              var c = {
                bodies: [],
                collisions: [],
                pairs: null
              };
              return o.extend(c, h);
            }, r.setBodies = function(h, c) {
              h.bodies = c.slice(0);
            }, r.clear = function(h) {
              h.bodies = [], h.collisions = [];
            }, r.collisions = function(h) {
              var c = h.pairs, l = h.bodies, d = l.length, f = r.canCollide, u = a.collides, g = h.collisions, p = 0, m, x;
              for (l.sort(r._compareBoundsX), m = 0; m < d; m++) {
                var y = l[m], v = y.bounds, w = y.bounds.max.x, _ = y.bounds.max.y, S = y.bounds.min.y, C = y.isStatic || y.isSleeping, b = y.parts.length, A = b === 1;
                for (x = m + 1; x < d; x++) {
                  var P = l[x], M = P.bounds;
                  if (M.min.x > w)
                    break;
                  if (!(_ < M.min.y || S > M.max.y) && !(C && (P.isStatic || P.isSleeping)) && f(y.collisionFilter, P.collisionFilter)) {
                    var T = P.parts.length;
                    if (A && T === 1) {
                      var k = u(y, P, c);
                      k && (g[p++] = k);
                    } else
                      for (var E = b > 1 ? 1 : 0, I = T > 1 ? 1 : 0, B = E; B < b; B++)
                        for (var R = y.parts[B], v = R.bounds, z = I; z < T; z++) {
                          var F = P.parts[z], M = F.bounds;
                          if (!(v.min.x > M.max.x || v.max.x < M.min.x || v.max.y < M.min.y || v.min.y > M.max.y)) {
                            var k = u(R, F, c);
                            k && (g[p++] = k);
                          }
                        }
                  }
                }
              }
              return g.length !== p && (g.length = p), g;
            }, r.canCollide = function(h, c) {
              return h.group === c.group && h.group !== 0 ? h.group > 0 : (h.mask & c.category) !== 0 && (c.mask & h.category) !== 0;
            }, r._compareBoundsX = function(h, c) {
              return h.bounds.min.x - c.bounds.min.x;
            };
          })();
        },
        /* 14 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(0);
          (function() {
            r.create = function(a) {
              var h = {};
              return a || o.log("Mouse.create: element was undefined, defaulting to document.body", "warn"), h.element = a || document.body, h.absolute = { x: 0, y: 0 }, h.position = { x: 0, y: 0 }, h.mousedownPosition = { x: 0, y: 0 }, h.mouseupPosition = { x: 0, y: 0 }, h.offset = { x: 0, y: 0 }, h.scale = { x: 1, y: 1 }, h.wheelDelta = 0, h.button = -1, h.pixelRatio = parseInt(h.element.getAttribute("data-pixel-ratio"), 10) || 1, h.sourceEvents = {
                mousemove: null,
                mousedown: null,
                mouseup: null,
                mousewheel: null
              }, h.mousemove = function(c) {
                var l = r._getRelativeMousePosition(c, h.element, h.pixelRatio), d = c.changedTouches;
                d && (h.button = 0, c.preventDefault()), h.absolute.x = l.x, h.absolute.y = l.y, h.position.x = h.absolute.x * h.scale.x + h.offset.x, h.position.y = h.absolute.y * h.scale.y + h.offset.y, h.sourceEvents.mousemove = c;
              }, h.mousedown = function(c) {
                var l = r._getRelativeMousePosition(c, h.element, h.pixelRatio), d = c.changedTouches;
                d ? (h.button = 0, c.preventDefault()) : h.button = c.button, h.absolute.x = l.x, h.absolute.y = l.y, h.position.x = h.absolute.x * h.scale.x + h.offset.x, h.position.y = h.absolute.y * h.scale.y + h.offset.y, h.mousedownPosition.x = h.position.x, h.mousedownPosition.y = h.position.y, h.sourceEvents.mousedown = c;
              }, h.mouseup = function(c) {
                var l = r._getRelativeMousePosition(c, h.element, h.pixelRatio), d = c.changedTouches;
                d && c.preventDefault(), h.button = -1, h.absolute.x = l.x, h.absolute.y = l.y, h.position.x = h.absolute.x * h.scale.x + h.offset.x, h.position.y = h.absolute.y * h.scale.y + h.offset.y, h.mouseupPosition.x = h.position.x, h.mouseupPosition.y = h.position.y, h.sourceEvents.mouseup = c;
              }, h.mousewheel = function(c) {
                h.wheelDelta = Math.max(-1, Math.min(1, c.wheelDelta || -c.detail)), c.preventDefault(), h.sourceEvents.mousewheel = c;
              }, r.setElement(h, h.element), h;
            }, r.setElement = function(a, h) {
              a.element = h, h.addEventListener("mousemove", a.mousemove, { passive: !0 }), h.addEventListener("mousedown", a.mousedown, { passive: !0 }), h.addEventListener("mouseup", a.mouseup, { passive: !0 }), h.addEventListener("wheel", a.mousewheel, { passive: !1 }), h.addEventListener("touchmove", a.mousemove, { passive: !1 }), h.addEventListener("touchstart", a.mousedown, { passive: !1 }), h.addEventListener("touchend", a.mouseup, { passive: !1 });
            }, r.clearSourceEvents = function(a) {
              a.sourceEvents.mousemove = null, a.sourceEvents.mousedown = null, a.sourceEvents.mouseup = null, a.sourceEvents.mousewheel = null, a.wheelDelta = 0;
            }, r.setOffset = function(a, h) {
              a.offset.x = h.x, a.offset.y = h.y, a.position.x = a.absolute.x * a.scale.x + a.offset.x, a.position.y = a.absolute.y * a.scale.y + a.offset.y;
            }, r.setScale = function(a, h) {
              a.scale.x = h.x, a.scale.y = h.y, a.position.x = a.absolute.x * a.scale.x + a.offset.x, a.position.y = a.absolute.y * a.scale.y + a.offset.y;
            }, r._getRelativeMousePosition = function(a, h, c) {
              var l = h.getBoundingClientRect(), d = document.documentElement || document.body.parentNode || document.body, f = window.pageXOffset !== void 0 ? window.pageXOffset : d.scrollLeft, u = window.pageYOffset !== void 0 ? window.pageYOffset : d.scrollTop, g = a.changedTouches, p, m;
              return g ? (p = g[0].pageX - l.left - f, m = g[0].pageY - l.top - u) : (p = a.pageX - l.left - f, m = a.pageY - l.top - u), {
                x: p / (h.clientWidth / (h.width || h.clientWidth) * c),
                y: m / (h.clientHeight / (h.height || h.clientHeight) * c)
              };
            };
          })();
        },
        /* 15 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(0);
          (function() {
            r._registry = {}, r.register = function(a) {
              if (r.isPlugin(a) || o.warn("Plugin.register:", r.toString(a), "does not implement all required fields."), a.name in r._registry) {
                var h = r._registry[a.name], c = r.versionParse(a.version).number, l = r.versionParse(h.version).number;
                c > l ? (o.warn("Plugin.register:", r.toString(h), "was upgraded to", r.toString(a)), r._registry[a.name] = a) : c < l ? o.warn("Plugin.register:", r.toString(h), "can not be downgraded to", r.toString(a)) : a !== h && o.warn("Plugin.register:", r.toString(a), "is already registered to different plugin object");
              } else
                r._registry[a.name] = a;
              return a;
            }, r.resolve = function(a) {
              return r._registry[r.dependencyParse(a).name];
            }, r.toString = function(a) {
              return typeof a == "string" ? a : (a.name || "anonymous") + "@" + (a.version || a.range || "0.0.0");
            }, r.isPlugin = function(a) {
              return a && a.name && a.version && a.install;
            }, r.isUsed = function(a, h) {
              return a.used.indexOf(h) > -1;
            }, r.isFor = function(a, h) {
              var c = a.for && r.dependencyParse(a.for);
              return !a.for || h.name === c.name && r.versionSatisfies(h.version, c.range);
            }, r.use = function(a, h) {
              if (a.uses = (a.uses || []).concat(h || []), a.uses.length === 0) {
                o.warn("Plugin.use:", r.toString(a), "does not specify any dependencies to install.");
                return;
              }
              for (var c = r.dependencies(a), l = o.topologicalSort(c), d = [], f = 0; f < l.length; f += 1)
                if (l[f] !== a.name) {
                  var u = r.resolve(l[f]);
                  if (!u) {
                    d.push("❌ " + l[f]);
                    continue;
                  }
                  r.isUsed(a, u.name) || (r.isFor(u, a) || (o.warn("Plugin.use:", r.toString(u), "is for", u.for, "but installed on", r.toString(a) + "."), u._warned = !0), u.install ? u.install(a) : (o.warn("Plugin.use:", r.toString(u), "does not specify an install function."), u._warned = !0), u._warned ? (d.push("🔶 " + r.toString(u)), delete u._warned) : d.push("✅ " + r.toString(u)), a.used.push(u.name));
                }
              d.length > 0 && o.info(d.join("  "));
            }, r.dependencies = function(a, h) {
              var c = r.dependencyParse(a), l = c.name;
              if (h = h || {}, !(l in h)) {
                a = r.resolve(a) || a, h[l] = o.map(a.uses || [], function(f) {
                  r.isPlugin(f) && r.register(f);
                  var u = r.dependencyParse(f), g = r.resolve(f);
                  return g && !r.versionSatisfies(g.version, u.range) ? (o.warn(
                    "Plugin.dependencies:",
                    r.toString(g),
                    "does not satisfy",
                    r.toString(u),
                    "used by",
                    r.toString(c) + "."
                  ), g._warned = !0, a._warned = !0) : g || (o.warn(
                    "Plugin.dependencies:",
                    r.toString(f),
                    "used by",
                    r.toString(c),
                    "could not be resolved."
                  ), a._warned = !0), u.name;
                });
                for (var d = 0; d < h[l].length; d += 1)
                  r.dependencies(h[l][d], h);
                return h;
              }
            }, r.dependencyParse = function(a) {
              if (o.isString(a)) {
                var h = /^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/;
                return h.test(a) || o.warn("Plugin.dependencyParse:", a, "is not a valid dependency string."), {
                  name: a.split("@")[0],
                  range: a.split("@")[1] || "*"
                };
              }
              return {
                name: a.name,
                range: a.range || a.version
              };
            }, r.versionParse = function(a) {
              var h = /^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;
              h.test(a) || o.warn("Plugin.versionParse:", a, "is not a valid version or range.");
              var c = h.exec(a), l = Number(c[4]), d = Number(c[5]), f = Number(c[6]);
              return {
                isRange: !!(c[1] || c[2]),
                version: c[3],
                range: a,
                operator: c[1] || c[2] || "",
                major: l,
                minor: d,
                patch: f,
                parts: [l, d, f],
                prerelease: c[7],
                number: l * 1e8 + d * 1e4 + f
              };
            }, r.versionSatisfies = function(a, h) {
              h = h || "*";
              var c = r.versionParse(h), l = r.versionParse(a);
              if (c.isRange) {
                if (c.operator === "*" || a === "*")
                  return !0;
                if (c.operator === ">")
                  return l.number > c.number;
                if (c.operator === ">=")
                  return l.number >= c.number;
                if (c.operator === "~")
                  return l.major === c.major && l.minor === c.minor && l.patch >= c.patch;
                if (c.operator === "^")
                  return c.major > 0 ? l.major === c.major && l.number >= c.number : c.minor > 0 ? l.minor === c.minor && l.patch >= c.patch : l.patch === c.patch;
              }
              return a === h || a === "*";
            };
          })();
        },
        /* 16 */
        /***/
        function(e, i) {
          var n = {};
          e.exports = n, function() {
            n.create = function(r) {
              return {
                vertex: r,
                normalImpulse: 0,
                tangentImpulse: 0
              };
            };
          }();
        },
        /* 17 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(7), a = n(18), h = n(13), c = n(19), l = n(5), d = n(6), f = n(10), u = n(0), g = n(4);
          (function() {
            r._deltaMax = 1e3 / 60, r.create = function(p) {
              p = p || {};
              var m = {
                positionIterations: 6,
                velocityIterations: 4,
                constraintIterations: 2,
                enableSleeping: !1,
                events: [],
                plugin: {},
                gravity: {
                  x: 0,
                  y: 1,
                  scale: 1e-3
                },
                timing: {
                  timestamp: 0,
                  timeScale: 1,
                  lastDelta: 0,
                  lastElapsed: 0,
                  lastUpdatesPerFrame: 0
                }
              }, x = u.extend(m, p);
              return x.world = p.world || d.create({ label: "World" }), x.pairs = p.pairs || c.create(), x.detector = p.detector || h.create(), x.detector.pairs = x.pairs, x.grid = { buckets: [] }, x.world.gravity = x.gravity, x.broadphase = x.grid, x.metrics = {}, x;
            }, r.update = function(p, m) {
              var x = u.now(), y = p.world, v = p.detector, w = p.pairs, _ = p.timing, S = _.timestamp, C;
              m > r._deltaMax && u.warnOnce(
                "Matter.Engine.update: delta argument is recommended to be less than or equal to",
                r._deltaMax.toFixed(3),
                "ms."
              ), m = typeof m < "u" ? m : u._baseDelta, m *= _.timeScale, _.timestamp += m, _.lastDelta = m;
              var b = {
                timestamp: _.timestamp,
                delta: m
              };
              l.trigger(p, "beforeUpdate", b);
              var A = d.allBodies(y), P = d.allConstraints(y);
              for (y.isModified && (h.setBodies(v, A), d.setModified(y, !1, !1, !0)), p.enableSleeping && o.update(A, m), r._bodiesApplyGravity(A, p.gravity), m > 0 && r._bodiesUpdate(A, m), l.trigger(p, "beforeSolve", b), f.preSolveAll(A), C = 0; C < p.constraintIterations; C++)
                f.solveAll(P, m);
              f.postSolveAll(A);
              var M = h.collisions(v);
              c.update(w, M, S), p.enableSleeping && o.afterCollisions(w.list), w.collisionStart.length > 0 && l.trigger(p, "collisionStart", {
                pairs: w.collisionStart,
                timestamp: _.timestamp,
                delta: m
              });
              var T = u.clamp(20 / p.positionIterations, 0, 1);
              for (a.preSolvePosition(w.list), C = 0; C < p.positionIterations; C++)
                a.solvePosition(w.list, m, T);
              for (a.postSolvePosition(A), f.preSolveAll(A), C = 0; C < p.constraintIterations; C++)
                f.solveAll(P, m);
              for (f.postSolveAll(A), a.preSolveVelocity(w.list), C = 0; C < p.velocityIterations; C++)
                a.solveVelocity(w.list, m);
              return r._bodiesUpdateVelocities(A), w.collisionActive.length > 0 && l.trigger(p, "collisionActive", {
                pairs: w.collisionActive,
                timestamp: _.timestamp,
                delta: m
              }), w.collisionEnd.length > 0 && l.trigger(p, "collisionEnd", {
                pairs: w.collisionEnd,
                timestamp: _.timestamp,
                delta: m
              }), r._bodiesClearForces(A), l.trigger(p, "afterUpdate", b), p.timing.lastElapsed = u.now() - x, p;
            }, r.merge = function(p, m) {
              if (u.extend(p, m), m.world) {
                p.world = m.world, r.clear(p);
                for (var x = d.allBodies(p.world), y = 0; y < x.length; y++) {
                  var v = x[y];
                  o.set(v, !1), v.id = u.nextId();
                }
              }
            }, r.clear = function(p) {
              c.clear(p.pairs), h.clear(p.detector);
            }, r._bodiesClearForces = function(p) {
              for (var m = p.length, x = 0; x < m; x++) {
                var y = p[x];
                y.force.x = 0, y.force.y = 0, y.torque = 0;
              }
            }, r._bodiesApplyGravity = function(p, m) {
              var x = typeof m.scale < "u" ? m.scale : 1e-3, y = p.length;
              if (!(m.x === 0 && m.y === 0 || x === 0))
                for (var v = 0; v < y; v++) {
                  var w = p[v];
                  w.isStatic || w.isSleeping || (w.force.y += w.mass * m.y * x, w.force.x += w.mass * m.x * x);
                }
            }, r._bodiesUpdate = function(p, m) {
              for (var x = p.length, y = 0; y < x; y++) {
                var v = p[y];
                v.isStatic || v.isSleeping || g.update(v, m);
              }
            }, r._bodiesUpdateVelocities = function(p) {
              for (var m = p.length, x = 0; x < m; x++)
                g.updateVelocities(p[x]);
            };
          })();
        },
        /* 18 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(3), a = n(0), h = n(1);
          (function() {
            r._restingThresh = 2, r._restingThreshTangent = Math.sqrt(6), r._positionDampen = 0.9, r._positionWarming = 0.8, r._frictionNormalMultiplier = 5, r._frictionMaxStatic = Number.MAX_VALUE, r.preSolvePosition = function(c) {
              var l, d, f, u = c.length;
              for (l = 0; l < u; l++)
                d = c[l], d.isActive && (f = d.contactCount, d.collision.parentA.totalContacts += f, d.collision.parentB.totalContacts += f);
            }, r.solvePosition = function(c, l, d) {
              var f, u, g, p, m, x, y, v, w = r._positionDampen * (d || 1), _ = a.clamp(l / a._baseDelta, 0, 1), S = c.length;
              for (f = 0; f < S; f++)
                u = c[f], !(!u.isActive || u.isSensor) && (g = u.collision, p = g.parentA, m = g.parentB, x = g.normal, u.separation = g.depth + x.x * (m.positionImpulse.x - p.positionImpulse.x) + x.y * (m.positionImpulse.y - p.positionImpulse.y));
              for (f = 0; f < S; f++)
                u = c[f], !(!u.isActive || u.isSensor) && (g = u.collision, p = g.parentA, m = g.parentB, x = g.normal, v = u.separation - u.slop * _, (p.isStatic || m.isStatic) && (v *= 2), p.isStatic || p.isSleeping || (y = w / p.totalContacts, p.positionImpulse.x += x.x * v * y, p.positionImpulse.y += x.y * v * y), m.isStatic || m.isSleeping || (y = w / m.totalContacts, m.positionImpulse.x -= x.x * v * y, m.positionImpulse.y -= x.y * v * y));
            }, r.postSolvePosition = function(c) {
              for (var l = r._positionWarming, d = c.length, f = o.translate, u = h.update, g = 0; g < d; g++) {
                var p = c[g], m = p.positionImpulse, x = m.x, y = m.y, v = p.velocity;
                if (p.totalContacts = 0, x !== 0 || y !== 0) {
                  for (var w = 0; w < p.parts.length; w++) {
                    var _ = p.parts[w];
                    f(_.vertices, m), u(_.bounds, _.vertices, v), _.position.x += x, _.position.y += y;
                  }
                  p.positionPrev.x += x, p.positionPrev.y += y, x * v.x + y * v.y < 0 ? (m.x = 0, m.y = 0) : (m.x *= l, m.y *= l);
                }
              }
            }, r.preSolveVelocity = function(c) {
              var l = c.length, d, f;
              for (d = 0; d < l; d++) {
                var u = c[d];
                if (!(!u.isActive || u.isSensor)) {
                  var g = u.contacts, p = u.contactCount, m = u.collision, x = m.parentA, y = m.parentB, v = m.normal, w = m.tangent;
                  for (f = 0; f < p; f++) {
                    var _ = g[f], S = _.vertex, C = _.normalImpulse, b = _.tangentImpulse;
                    if (C !== 0 || b !== 0) {
                      var A = v.x * C + w.x * b, P = v.y * C + w.y * b;
                      x.isStatic || x.isSleeping || (x.positionPrev.x += A * x.inverseMass, x.positionPrev.y += P * x.inverseMass, x.anglePrev += x.inverseInertia * ((S.x - x.position.x) * P - (S.y - x.position.y) * A)), y.isStatic || y.isSleeping || (y.positionPrev.x -= A * y.inverseMass, y.positionPrev.y -= P * y.inverseMass, y.anglePrev -= y.inverseInertia * ((S.x - y.position.x) * P - (S.y - y.position.y) * A));
                    }
                  }
                }
              }
            }, r.solveVelocity = function(c, l) {
              var d = l / a._baseDelta, f = d * d, u = f * d, g = -r._restingThresh * d, p = r._restingThreshTangent, m = r._frictionNormalMultiplier * d, x = r._frictionMaxStatic, y = c.length, v, w, _, S;
              for (_ = 0; _ < y; _++) {
                var C = c[_];
                if (!(!C.isActive || C.isSensor)) {
                  var b = C.collision, A = b.parentA, P = b.parentB, M = b.normal.x, T = b.normal.y, k = b.tangent.x, E = b.tangent.y, I = C.inverseMass, B = C.friction * C.frictionStatic * m, R = C.contacts, z = C.contactCount, F = 1 / z, L = A.position.x - A.positionPrev.x, Z = A.position.y - A.positionPrev.y, U = A.angle - A.anglePrev, X = P.position.x - P.positionPrev.x, J = P.position.y - P.positionPrev.y, Q = P.angle - P.anglePrev;
                  for (S = 0; S < z; S++) {
                    var V = R[S], Rt = V.vertex, ht = Rt.x - A.position.x, te = Rt.y - A.position.y, Ut = Rt.x - P.position.x, Wt = Rt.y - P.position.y, mt = L - te * U, di = Z + ht * U, Ni = X - Wt * Q, be = J + Ut * Q, he = mt - Ni, le = di - be, ee = M * he + T * le, ie = k * he + E * le, Hi = C.separation + ee, $i = Math.min(Hi, 1);
                    $i = Hi < 0 ? 0 : $i;
                    var zn = $i * B;
                    ie < -zn || ie > zn ? (w = ie > 0 ? ie : -ie, v = C.friction * (ie > 0 ? 1 : -1) * u, v < -w ? v = -w : v > w && (v = w)) : (v = ie, w = x);
                    var Yo = ht * T - te * M, Xo = Ut * T - Wt * M, Ko = F / (I + A.inverseInertia * Yo * Yo + P.inverseInertia * Xo * Xo), Es = (1 + C.restitution) * ee * Ko;
                    if (v *= Ko, ee < g)
                      V.normalImpulse = 0;
                    else {
                      var Mu = V.normalImpulse;
                      V.normalImpulse += Es, V.normalImpulse > 0 && (V.normalImpulse = 0), Es = V.normalImpulse - Mu;
                    }
                    if (ie < -p || ie > p)
                      V.tangentImpulse = 0;
                    else {
                      var Tu = V.tangentImpulse;
                      V.tangentImpulse += v, V.tangentImpulse < -w && (V.tangentImpulse = -w), V.tangentImpulse > w && (V.tangentImpulse = w), v = V.tangentImpulse - Tu;
                    }
                    var Is = M * Es + k * v, Bs = T * Es + E * v;
                    A.isStatic || A.isSleeping || (A.positionPrev.x += Is * A.inverseMass, A.positionPrev.y += Bs * A.inverseMass, A.anglePrev += (ht * Bs - te * Is) * A.inverseInertia), P.isStatic || P.isSleeping || (P.positionPrev.x -= Is * P.inverseMass, P.positionPrev.y -= Bs * P.inverseMass, P.anglePrev -= (Ut * Bs - Wt * Is) * P.inverseInertia);
                  }
                }
              }
            };
          })();
        },
        /* 19 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(9), a = n(0);
          (function() {
            r.create = function(h) {
              return a.extend({
                table: {},
                list: [],
                collisionStart: [],
                collisionActive: [],
                collisionEnd: []
              }, h);
            }, r.update = function(h, c, l) {
              var d = o.update, f = o.create, u = o.setActive, g = h.table, p = h.list, m = p.length, x = m, y = h.collisionStart, v = h.collisionEnd, w = h.collisionActive, _ = c.length, S = 0, C = 0, b = 0, A, P, M;
              for (M = 0; M < _; M++)
                A = c[M], P = A.pair, P ? (P.isActive && (w[b++] = P), d(P, A, l)) : (P = f(A, l), g[P.id] = P, y[S++] = P, p[x++] = P);
              for (x = 0, m = p.length, M = 0; M < m; M++)
                P = p[M], P.timeUpdated >= l ? p[x++] = P : (u(P, !1, l), P.collision.bodyA.sleepCounter > 0 && P.collision.bodyB.sleepCounter > 0 ? p[x++] = P : (v[C++] = P, delete g[P.id]));
              p.length !== x && (p.length = x), y.length !== S && (y.length = S), v.length !== C && (v.length = C), w.length !== b && (w.length = b);
            }, r.clear = function(h) {
              return h.table = {}, h.list.length = 0, h.collisionStart.length = 0, h.collisionActive.length = 0, h.collisionEnd.length = 0, h;
            };
          })();
        },
        /* 20 */
        /***/
        function(e, i, n) {
          var r = e.exports = n(21);
          r.Axes = n(11), r.Bodies = n(12), r.Body = n(4), r.Bounds = n(1), r.Collision = n(8), r.Common = n(0), r.Composite = n(6), r.Composites = n(22), r.Constraint = n(10), r.Contact = n(16), r.Detector = n(13), r.Engine = n(17), r.Events = n(5), r.Grid = n(23), r.Mouse = n(14), r.MouseConstraint = n(24), r.Pair = n(9), r.Pairs = n(19), r.Plugin = n(15), r.Query = n(25), r.Render = n(26), r.Resolver = n(18), r.Runner = n(27), r.SAT = n(28), r.Sleeping = n(7), r.Svg = n(29), r.Vector = n(2), r.Vertices = n(3), r.World = n(30), r.Engine.run = r.Runner.run, r.Common.deprecated(r.Engine, "run", "Engine.run ➤ use Matter.Runner.run(engine) instead");
        },
        /* 21 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(15), a = n(0);
          (function() {
            r.name = "matter-js", r.version = "0.20.0", r.uses = [], r.used = [], r.use = function() {
              o.use(r, Array.prototype.slice.call(arguments));
            }, r.before = function(h, c) {
              return h = h.replace(/^Matter./, ""), a.chainPathBefore(r, h, c);
            }, r.after = function(h, c) {
              return h = h.replace(/^Matter./, ""), a.chainPathAfter(r, h, c);
            };
          })();
        },
        /* 22 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(6), a = n(10), h = n(0), c = n(4), l = n(12), d = h.deprecated;
          (function() {
            r.stack = function(f, u, g, p, m, x, y) {
              for (var v = o.create({ label: "Stack" }), w = f, _ = u, S, C = 0, b = 0; b < p; b++) {
                for (var A = 0, P = 0; P < g; P++) {
                  var M = y(w, _, P, b, S, C);
                  if (M) {
                    var T = M.bounds.max.y - M.bounds.min.y, k = M.bounds.max.x - M.bounds.min.x;
                    T > A && (A = T), c.translate(M, { x: k * 0.5, y: T * 0.5 }), w = M.bounds.max.x + m, o.addBody(v, M), S = M, C += 1;
                  } else
                    w += m;
                }
                _ += A + x, w = f;
              }
              return v;
            }, r.chain = function(f, u, g, p, m, x) {
              for (var y = f.bodies, v = 1; v < y.length; v++) {
                var w = y[v - 1], _ = y[v], S = w.bounds.max.y - w.bounds.min.y, C = w.bounds.max.x - w.bounds.min.x, b = _.bounds.max.y - _.bounds.min.y, A = _.bounds.max.x - _.bounds.min.x, P = {
                  bodyA: w,
                  pointA: { x: C * u, y: S * g },
                  bodyB: _,
                  pointB: { x: A * p, y: b * m }
                }, M = h.extend(P, x);
                o.addConstraint(f, a.create(M));
              }
              return f.label += " Chain", f;
            }, r.mesh = function(f, u, g, p, m) {
              var x = f.bodies, y, v, w, _, S;
              for (y = 0; y < g; y++) {
                for (v = 1; v < u; v++)
                  w = x[v - 1 + y * u], _ = x[v + y * u], o.addConstraint(f, a.create(h.extend({ bodyA: w, bodyB: _ }, m)));
                if (y > 0)
                  for (v = 0; v < u; v++)
                    w = x[v + (y - 1) * u], _ = x[v + y * u], o.addConstraint(f, a.create(h.extend({ bodyA: w, bodyB: _ }, m))), p && v > 0 && (S = x[v - 1 + (y - 1) * u], o.addConstraint(f, a.create(h.extend({ bodyA: S, bodyB: _ }, m)))), p && v < u - 1 && (S = x[v + 1 + (y - 1) * u], o.addConstraint(f, a.create(h.extend({ bodyA: S, bodyB: _ }, m))));
              }
              return f.label += " Mesh", f;
            }, r.pyramid = function(f, u, g, p, m, x, y) {
              return r.stack(f, u, g, p, m, x, function(v, w, _, S, C, b) {
                var A = Math.min(p, Math.ceil(g / 2)), P = C ? C.bounds.max.x - C.bounds.min.x : 0;
                if (!(S > A)) {
                  S = A - S;
                  var M = S, T = g - 1 - S;
                  if (!(_ < M || _ > T)) {
                    b === 1 && c.translate(C, { x: (_ + (g % 2 === 1 ? 1 : -1)) * P, y: 0 });
                    var k = C ? _ * P : 0;
                    return y(f + k + _ * m, w, _, S, C, b);
                  }
                }
              });
            }, r.newtonsCradle = function(f, u, g, p, m) {
              for (var x = o.create({ label: "Newtons Cradle" }), y = 0; y < g; y++) {
                var v = 1.9, w = l.circle(
                  f + y * (p * v),
                  u + m,
                  p,
                  { inertia: 1 / 0, restitution: 1, friction: 0, frictionAir: 1e-4, slop: 1 }
                ), _ = a.create({ pointA: { x: f + y * (p * v), y: u }, bodyB: w });
                o.addBody(x, w), o.addConstraint(x, _);
              }
              return x;
            }, d(r, "newtonsCradle", "Composites.newtonsCradle ➤ moved to newtonsCradle example"), r.car = function(f, u, g, p, m) {
              var x = c.nextGroup(!0), y = 20, v = -g * 0.5 + y, w = g * 0.5 - y, _ = 0, S = o.create({ label: "Car" }), C = l.rectangle(f, u, g, p, {
                collisionFilter: {
                  group: x
                },
                chamfer: {
                  radius: p * 0.5
                },
                density: 2e-4
              }), b = l.circle(f + v, u + _, m, {
                collisionFilter: {
                  group: x
                },
                friction: 0.8
              }), A = l.circle(f + w, u + _, m, {
                collisionFilter: {
                  group: x
                },
                friction: 0.8
              }), P = a.create({
                bodyB: C,
                pointB: { x: v, y: _ },
                bodyA: b,
                stiffness: 1,
                length: 0
              }), M = a.create({
                bodyB: C,
                pointB: { x: w, y: _ },
                bodyA: A,
                stiffness: 1,
                length: 0
              });
              return o.addBody(S, C), o.addBody(S, b), o.addBody(S, A), o.addConstraint(S, P), o.addConstraint(S, M), S;
            }, d(r, "car", "Composites.car ➤ moved to car example"), r.softBody = function(f, u, g, p, m, x, y, v, w, _) {
              w = h.extend({ inertia: 1 / 0 }, w), _ = h.extend({ stiffness: 0.2, render: { type: "line", anchors: !1 } }, _);
              var S = r.stack(f, u, g, p, m, x, function(C, b) {
                return l.circle(C, b, v, w);
              });
              return r.mesh(S, g, p, y, _), S.label = "Soft Body", S;
            }, d(r, "softBody", "Composites.softBody ➤ moved to softBody and cloth examples");
          })();
        },
        /* 23 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(9), a = n(0), h = a.deprecated;
          (function() {
            r.create = function(c) {
              var l = {
                buckets: {},
                pairs: {},
                pairsList: [],
                bucketWidth: 48,
                bucketHeight: 48
              };
              return a.extend(l, c);
            }, r.update = function(c, l, d, f) {
              var u, g, p, m = d.world, x = c.buckets, y, v, w = !1;
              for (u = 0; u < l.length; u++) {
                var _ = l[u];
                if (!(_.isSleeping && !f) && !(m.bounds && (_.bounds.max.x < m.bounds.min.x || _.bounds.min.x > m.bounds.max.x || _.bounds.max.y < m.bounds.min.y || _.bounds.min.y > m.bounds.max.y))) {
                  var S = r._getRegion(c, _);
                  if (!_.region || S.id !== _.region.id || f) {
                    (!_.region || f) && (_.region = S);
                    var C = r._regionUnion(S, _.region);
                    for (g = C.startCol; g <= C.endCol; g++)
                      for (p = C.startRow; p <= C.endRow; p++) {
                        v = r._getBucketId(g, p), y = x[v];
                        var b = g >= S.startCol && g <= S.endCol && p >= S.startRow && p <= S.endRow, A = g >= _.region.startCol && g <= _.region.endCol && p >= _.region.startRow && p <= _.region.endRow;
                        !b && A && A && y && r._bucketRemoveBody(c, y, _), (_.region === S || b && !A || f) && (y || (y = r._createBucket(x, v)), r._bucketAddBody(c, y, _));
                      }
                    _.region = S, w = !0;
                  }
                }
              }
              w && (c.pairsList = r._createActivePairsList(c));
            }, h(r, "update", "Grid.update ➤ replaced by Matter.Detector"), r.clear = function(c) {
              c.buckets = {}, c.pairs = {}, c.pairsList = [];
            }, h(r, "clear", "Grid.clear ➤ replaced by Matter.Detector"), r._regionUnion = function(c, l) {
              var d = Math.min(c.startCol, l.startCol), f = Math.max(c.endCol, l.endCol), u = Math.min(c.startRow, l.startRow), g = Math.max(c.endRow, l.endRow);
              return r._createRegion(d, f, u, g);
            }, r._getRegion = function(c, l) {
              var d = l.bounds, f = Math.floor(d.min.x / c.bucketWidth), u = Math.floor(d.max.x / c.bucketWidth), g = Math.floor(d.min.y / c.bucketHeight), p = Math.floor(d.max.y / c.bucketHeight);
              return r._createRegion(f, u, g, p);
            }, r._createRegion = function(c, l, d, f) {
              return {
                id: c + "," + l + "," + d + "," + f,
                startCol: c,
                endCol: l,
                startRow: d,
                endRow: f
              };
            }, r._getBucketId = function(c, l) {
              return "C" + c + "R" + l;
            }, r._createBucket = function(c, l) {
              var d = c[l] = [];
              return d;
            }, r._bucketAddBody = function(c, l, d) {
              var f = c.pairs, u = o.id, g = l.length, p;
              for (p = 0; p < g; p++) {
                var m = l[p];
                if (!(d.id === m.id || d.isStatic && m.isStatic)) {
                  var x = u(d, m), y = f[x];
                  y ? y[2] += 1 : f[x] = [d, m, 1];
                }
              }
              l.push(d);
            }, r._bucketRemoveBody = function(c, l, d) {
              var f = c.pairs, u = o.id, g;
              l.splice(a.indexOf(l, d), 1);
              var p = l.length;
              for (g = 0; g < p; g++) {
                var m = f[u(d, l[g])];
                m && (m[2] -= 1);
              }
            }, r._createActivePairsList = function(c) {
              var l, d = c.pairs, f = a.keys(d), u = f.length, g = [], p;
              for (p = 0; p < u; p++)
                l = d[f[p]], l[2] > 0 ? g.push(l) : delete d[f[p]];
              return g;
            };
          })();
        },
        /* 24 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(3), a = n(7), h = n(14), c = n(5), l = n(13), d = n(10), f = n(6), u = n(0), g = n(1);
          (function() {
            r.create = function(p, m) {
              var x = (p ? p.mouse : null) || (m ? m.mouse : null);
              x || (p && p.render && p.render.canvas ? x = h.create(p.render.canvas) : m && m.element ? x = h.create(m.element) : (x = h.create(), u.warn("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected")));
              var y = d.create({
                label: "Mouse Constraint",
                pointA: x.position,
                pointB: { x: 0, y: 0 },
                length: 0.01,
                stiffness: 0.1,
                angularStiffness: 1,
                render: {
                  strokeStyle: "#90EE90",
                  lineWidth: 3
                }
              }), v = {
                type: "mouseConstraint",
                mouse: x,
                element: null,
                body: null,
                constraint: y,
                collisionFilter: {
                  category: 1,
                  mask: 4294967295,
                  group: 0
                }
              }, w = u.extend(v, m);
              return c.on(p, "beforeUpdate", function() {
                var _ = f.allBodies(p.world);
                r.update(w, _), r._triggerEvents(w);
              }), w;
            }, r.update = function(p, m) {
              var x = p.mouse, y = p.constraint, v = p.body;
              if (x.button === 0) {
                if (y.bodyB)
                  a.set(y.bodyB, !1), y.pointA = x.position;
                else
                  for (var w = 0; w < m.length; w++)
                    if (v = m[w], g.contains(v.bounds, x.position) && l.canCollide(v.collisionFilter, p.collisionFilter))
                      for (var _ = v.parts.length > 1 ? 1 : 0; _ < v.parts.length; _++) {
                        var S = v.parts[_];
                        if (o.contains(S.vertices, x.position)) {
                          y.pointA = x.position, y.bodyB = p.body = v, y.pointB = { x: x.position.x - v.position.x, y: x.position.y - v.position.y }, y.angleB = v.angle, a.set(v, !1), c.trigger(p, "startdrag", { mouse: x, body: v });
                          break;
                        }
                      }
              } else
                y.bodyB = p.body = null, y.pointB = null, v && c.trigger(p, "enddrag", { mouse: x, body: v });
            }, r._triggerEvents = function(p) {
              var m = p.mouse, x = m.sourceEvents;
              x.mousemove && c.trigger(p, "mousemove", { mouse: m }), x.mousedown && c.trigger(p, "mousedown", { mouse: m }), x.mouseup && c.trigger(p, "mouseup", { mouse: m }), h.clearSourceEvents(m);
            };
          })();
        },
        /* 25 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(2), a = n(8), h = n(1), c = n(12), l = n(3);
          (function() {
            r.collides = function(d, f) {
              for (var u = [], g = f.length, p = d.bounds, m = a.collides, x = h.overlaps, y = 0; y < g; y++) {
                var v = f[y], w = v.parts.length, _ = w === 1 ? 0 : 1;
                if (x(v.bounds, p))
                  for (var S = _; S < w; S++) {
                    var C = v.parts[S];
                    if (x(C.bounds, p)) {
                      var b = m(C, d);
                      if (b) {
                        u.push(b);
                        break;
                      }
                    }
                  }
              }
              return u;
            }, r.ray = function(d, f, u, g) {
              g = g || 1e-100;
              for (var p = o.angle(f, u), m = o.magnitude(o.sub(f, u)), x = (u.x + f.x) * 0.5, y = (u.y + f.y) * 0.5, v = c.rectangle(x, y, m, g, { angle: p }), w = r.collides(v, d), _ = 0; _ < w.length; _ += 1) {
                var S = w[_];
                S.body = S.bodyB = S.bodyA;
              }
              return w;
            }, r.region = function(d, f, u) {
              for (var g = [], p = 0; p < d.length; p++) {
                var m = d[p], x = h.overlaps(m.bounds, f);
                (x && !u || !x && u) && g.push(m);
              }
              return g;
            }, r.point = function(d, f) {
              for (var u = [], g = 0; g < d.length; g++) {
                var p = d[g];
                if (h.contains(p.bounds, f))
                  for (var m = p.parts.length === 1 ? 0 : 1; m < p.parts.length; m++) {
                    var x = p.parts[m];
                    if (h.contains(x.bounds, f) && l.contains(x.vertices, f)) {
                      u.push(p);
                      break;
                    }
                  }
              }
              return u;
            };
          })();
        },
        /* 26 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(4), a = n(0), h = n(6), c = n(1), l = n(5), d = n(2), f = n(14);
          (function() {
            var u, g;
            typeof window < "u" && (u = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(_) {
              window.setTimeout(function() {
                _(a.now());
              }, 1e3 / 60);
            }, g = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame), r._goodFps = 30, r._goodDelta = 1e3 / 60, r.create = function(_) {
              var S = {
                engine: null,
                element: null,
                canvas: null,
                mouse: null,
                frameRequestId: null,
                timing: {
                  historySize: 60,
                  delta: 0,
                  deltaHistory: [],
                  lastTime: 0,
                  lastTimestamp: 0,
                  lastElapsed: 0,
                  timestampElapsed: 0,
                  timestampElapsedHistory: [],
                  engineDeltaHistory: [],
                  engineElapsedHistory: [],
                  engineUpdatesHistory: [],
                  elapsedHistory: []
                },
                options: {
                  width: 800,
                  height: 600,
                  pixelRatio: 1,
                  background: "#14151f",
                  wireframeBackground: "#14151f",
                  wireframeStrokeStyle: "#bbb",
                  hasBounds: !!_.bounds,
                  enabled: !0,
                  wireframes: !0,
                  showSleeping: !0,
                  showDebug: !1,
                  showStats: !1,
                  showPerformance: !1,
                  showBounds: !1,
                  showVelocity: !1,
                  showCollisions: !1,
                  showSeparations: !1,
                  showAxes: !1,
                  showPositions: !1,
                  showAngleIndicator: !1,
                  showIds: !1,
                  showVertexNumbers: !1,
                  showConvexHulls: !1,
                  showInternalEdges: !1,
                  showMousePosition: !1
                }
              }, C = a.extend(S, _);
              return C.canvas && (C.canvas.width = C.options.width || C.canvas.width, C.canvas.height = C.options.height || C.canvas.height), C.mouse = _.mouse, C.engine = _.engine, C.canvas = C.canvas || x(C.options.width, C.options.height), C.context = C.canvas.getContext("2d"), C.textures = {}, C.bounds = C.bounds || {
                min: {
                  x: 0,
                  y: 0
                },
                max: {
                  x: C.canvas.width,
                  y: C.canvas.height
                }
              }, C.controller = r, C.options.showBroadphase = !1, C.options.pixelRatio !== 1 && r.setPixelRatio(C, C.options.pixelRatio), a.isElement(C.element) && C.element.appendChild(C.canvas), C;
            }, r.run = function(_) {
              (function S(C) {
                _.frameRequestId = u(S), p(_, C), r.world(_, C), _.context.setTransform(_.options.pixelRatio, 0, 0, _.options.pixelRatio, 0, 0), (_.options.showStats || _.options.showDebug) && r.stats(_, _.context, C), (_.options.showPerformance || _.options.showDebug) && r.performance(_, _.context, C), _.context.setTransform(1, 0, 0, 1, 0, 0);
              })();
            }, r.stop = function(_) {
              g(_.frameRequestId);
            }, r.setPixelRatio = function(_, S) {
              var C = _.options, b = _.canvas;
              S === "auto" && (S = y(b)), C.pixelRatio = S, b.setAttribute("data-pixel-ratio", S), b.width = C.width * S, b.height = C.height * S, b.style.width = C.width + "px", b.style.height = C.height + "px";
            }, r.setSize = function(_, S, C) {
              _.options.width = S, _.options.height = C, _.bounds.max.x = _.bounds.min.x + S, _.bounds.max.y = _.bounds.min.y + C, _.options.pixelRatio !== 1 ? r.setPixelRatio(_, _.options.pixelRatio) : (_.canvas.width = S, _.canvas.height = C);
            }, r.lookAt = function(_, S, C, b) {
              b = typeof b < "u" ? b : !0, S = a.isArray(S) ? S : [S], C = C || {
                x: 0,
                y: 0
              };
              for (var A = {
                min: { x: 1 / 0, y: 1 / 0 },
                max: { x: -1 / 0, y: -1 / 0 }
              }, P = 0; P < S.length; P += 1) {
                var M = S[P], T = M.bounds ? M.bounds.min : M.min || M.position || M, k = M.bounds ? M.bounds.max : M.max || M.position || M;
                T && k && (T.x < A.min.x && (A.min.x = T.x), k.x > A.max.x && (A.max.x = k.x), T.y < A.min.y && (A.min.y = T.y), k.y > A.max.y && (A.max.y = k.y));
              }
              var E = A.max.x - A.min.x + 2 * C.x, I = A.max.y - A.min.y + 2 * C.y, B = _.canvas.height, R = _.canvas.width, z = R / B, F = E / I, L = 1, Z = 1;
              F > z ? Z = F / z : L = z / F, _.options.hasBounds = !0, _.bounds.min.x = A.min.x, _.bounds.max.x = A.min.x + E * L, _.bounds.min.y = A.min.y, _.bounds.max.y = A.min.y + I * Z, b && (_.bounds.min.x += E * 0.5 - E * L * 0.5, _.bounds.max.x += E * 0.5 - E * L * 0.5, _.bounds.min.y += I * 0.5 - I * Z * 0.5, _.bounds.max.y += I * 0.5 - I * Z * 0.5), _.bounds.min.x -= C.x, _.bounds.max.x -= C.x, _.bounds.min.y -= C.y, _.bounds.max.y -= C.y, _.mouse && (f.setScale(_.mouse, {
                x: (_.bounds.max.x - _.bounds.min.x) / _.canvas.width,
                y: (_.bounds.max.y - _.bounds.min.y) / _.canvas.height
              }), f.setOffset(_.mouse, _.bounds.min));
            }, r.startViewTransform = function(_) {
              var S = _.bounds.max.x - _.bounds.min.x, C = _.bounds.max.y - _.bounds.min.y, b = S / _.options.width, A = C / _.options.height;
              _.context.setTransform(
                _.options.pixelRatio / b,
                0,
                0,
                _.options.pixelRatio / A,
                0,
                0
              ), _.context.translate(-_.bounds.min.x, -_.bounds.min.y);
            }, r.endViewTransform = function(_) {
              _.context.setTransform(_.options.pixelRatio, 0, 0, _.options.pixelRatio, 0, 0);
            }, r.world = function(_, S) {
              var C = a.now(), b = _.engine, A = b.world, P = _.canvas, M = _.context, T = _.options, k = _.timing, E = h.allBodies(A), I = h.allConstraints(A), B = T.wireframes ? T.wireframeBackground : T.background, R = [], z = [], F, L = {
                timestamp: b.timing.timestamp
              };
              if (l.trigger(_, "beforeRender", L), _.currentBackground !== B && w(_, B), M.globalCompositeOperation = "source-in", M.fillStyle = "transparent", M.fillRect(0, 0, P.width, P.height), M.globalCompositeOperation = "source-over", T.hasBounds) {
                for (F = 0; F < E.length; F++) {
                  var Z = E[F];
                  c.overlaps(Z.bounds, _.bounds) && R.push(Z);
                }
                for (F = 0; F < I.length; F++) {
                  var U = I[F], X = U.bodyA, J = U.bodyB, Q = U.pointA, V = U.pointB;
                  X && (Q = d.add(X.position, U.pointA)), J && (V = d.add(J.position, U.pointB)), !(!Q || !V) && (c.contains(_.bounds, Q) || c.contains(_.bounds, V)) && z.push(U);
                }
                r.startViewTransform(_), _.mouse && (f.setScale(_.mouse, {
                  x: (_.bounds.max.x - _.bounds.min.x) / _.options.width,
                  y: (_.bounds.max.y - _.bounds.min.y) / _.options.height
                }), f.setOffset(_.mouse, _.bounds.min));
              } else
                z = I, R = E, _.options.pixelRatio !== 1 && _.context.setTransform(_.options.pixelRatio, 0, 0, _.options.pixelRatio, 0, 0);
              !T.wireframes || b.enableSleeping && T.showSleeping ? r.bodies(_, R, M) : (T.showConvexHulls && r.bodyConvexHulls(_, R, M), r.bodyWireframes(_, R, M)), T.showBounds && r.bodyBounds(_, R, M), (T.showAxes || T.showAngleIndicator) && r.bodyAxes(_, R, M), T.showPositions && r.bodyPositions(_, R, M), T.showVelocity && r.bodyVelocity(_, R, M), T.showIds && r.bodyIds(_, R, M), T.showSeparations && r.separations(_, b.pairs.list, M), T.showCollisions && r.collisions(_, b.pairs.list, M), T.showVertexNumbers && r.vertexNumbers(_, R, M), T.showMousePosition && r.mousePosition(_, _.mouse, M), r.constraints(z, M), T.hasBounds && r.endViewTransform(_), l.trigger(_, "afterRender", L), k.lastElapsed = a.now() - C;
            }, r.stats = function(_, S, C) {
              for (var b = _.engine, A = b.world, P = h.allBodies(A), M = 0, T = 55, k = 44, E = 0, I = 0, B = 0; B < P.length; B += 1)
                M += P[B].parts.length;
              var R = {
                Part: M,
                Body: P.length,
                Cons: h.allConstraints(A).length,
                Comp: h.allComposites(A).length,
                Pair: b.pairs.list.length
              };
              S.fillStyle = "#0e0f19", S.fillRect(E, I, T * 5.5, k), S.font = "12px Arial", S.textBaseline = "top", S.textAlign = "right";
              for (var z in R) {
                var F = R[z];
                S.fillStyle = "#aaa", S.fillText(z, E + T, I + 8), S.fillStyle = "#eee", S.fillText(F, E + T, I + 26), E += T;
              }
            }, r.performance = function(_, S) {
              var C = _.engine, b = _.timing, A = b.deltaHistory, P = b.elapsedHistory, M = b.timestampElapsedHistory, T = b.engineDeltaHistory, k = b.engineUpdatesHistory, E = b.engineElapsedHistory, I = C.timing.lastUpdatesPerFrame, B = C.timing.lastDelta, R = m(A), z = m(P), F = m(T), L = m(k), Z = m(E), U = m(M), X = U / R || 0, J = Math.round(R / B), Q = 1e3 / R || 0, V = 4, Rt = 12, ht = 60, te = 34, Ut = 10, Wt = 69;
              S.fillStyle = "#0e0f19", S.fillRect(0, 50, Rt * 5 + ht * 6 + 22, te), r.status(
                S,
                Ut,
                Wt,
                ht,
                V,
                A.length,
                Math.round(Q) + " fps",
                Q / r._goodFps,
                function(mt) {
                  return A[mt] / R - 1;
                }
              ), r.status(
                S,
                Ut + Rt + ht,
                Wt,
                ht,
                V,
                T.length,
                B.toFixed(2) + " dt",
                r._goodDelta / B,
                function(mt) {
                  return T[mt] / F - 1;
                }
              ), r.status(
                S,
                Ut + (Rt + ht) * 2,
                Wt,
                ht,
                V,
                k.length,
                I + " upf",
                Math.pow(a.clamp(L / J || 1, 0, 1), 4),
                function(mt) {
                  return k[mt] / L - 1;
                }
              ), r.status(
                S,
                Ut + (Rt + ht) * 3,
                Wt,
                ht,
                V,
                E.length,
                Z.toFixed(2) + " ut",
                1 - I * Z / r._goodFps,
                function(mt) {
                  return E[mt] / Z - 1;
                }
              ), r.status(
                S,
                Ut + (Rt + ht) * 4,
                Wt,
                ht,
                V,
                P.length,
                z.toFixed(2) + " rt",
                1 - z / r._goodFps,
                function(mt) {
                  return P[mt] / z - 1;
                }
              ), r.status(
                S,
                Ut + (Rt + ht) * 5,
                Wt,
                ht,
                V,
                M.length,
                X.toFixed(2) + " x",
                X * X * X,
                function(mt) {
                  return (M[mt] / A[mt] / X || 0) - 1;
                }
              );
            }, r.status = function(_, S, C, b, A, P, M, T, k) {
              _.strokeStyle = "#888", _.fillStyle = "#444", _.lineWidth = 1, _.fillRect(S, C + 7, b, 1), _.beginPath(), _.moveTo(S, C + 7 - A * a.clamp(0.4 * k(0), -2, 2));
              for (var E = 0; E < b; E += 1)
                _.lineTo(S + E, C + 7 - (E < P ? A * a.clamp(0.4 * k(E), -2, 2) : 0));
              _.stroke(), _.fillStyle = "hsl(" + a.clamp(25 + 95 * T, 0, 120) + ",100%,60%)", _.fillRect(S, C - 7, 4, 4), _.font = "12px Arial", _.textBaseline = "middle", _.textAlign = "right", _.fillStyle = "#eee", _.fillText(M, S + b, C - 5);
            }, r.constraints = function(_, S) {
              for (var C = S, b = 0; b < _.length; b++) {
                var A = _[b];
                if (!(!A.render.visible || !A.pointA || !A.pointB)) {
                  var P = A.bodyA, M = A.bodyB, T, k;
                  if (P ? T = d.add(P.position, A.pointA) : T = A.pointA, A.render.type === "pin")
                    C.beginPath(), C.arc(T.x, T.y, 3, 0, 2 * Math.PI), C.closePath();
                  else {
                    if (M ? k = d.add(M.position, A.pointB) : k = A.pointB, C.beginPath(), C.moveTo(T.x, T.y), A.render.type === "spring")
                      for (var E = d.sub(k, T), I = d.perp(d.normalise(E)), B = Math.ceil(a.clamp(A.length / 5, 12, 20)), R, z = 1; z < B; z += 1)
                        R = z % 2 === 0 ? 1 : -1, C.lineTo(
                          T.x + E.x * (z / B) + I.x * R * 4,
                          T.y + E.y * (z / B) + I.y * R * 4
                        );
                    C.lineTo(k.x, k.y);
                  }
                  A.render.lineWidth && (C.lineWidth = A.render.lineWidth, C.strokeStyle = A.render.strokeStyle, C.stroke()), A.render.anchors && (C.fillStyle = A.render.strokeStyle, C.beginPath(), C.arc(T.x, T.y, 3, 0, 2 * Math.PI), C.arc(k.x, k.y, 3, 0, 2 * Math.PI), C.closePath(), C.fill());
                }
              }
            }, r.bodies = function(_, S, C) {
              var b = C;
              _.engine;
              var A = _.options, P = A.showInternalEdges || !A.wireframes, M, T, k, E;
              for (k = 0; k < S.length; k++)
                if (M = S[k], !!M.render.visible) {
                  for (E = M.parts.length > 1 ? 1 : 0; E < M.parts.length; E++)
                    if (T = M.parts[E], !!T.render.visible) {
                      if (A.showSleeping && M.isSleeping ? b.globalAlpha = 0.5 * T.render.opacity : T.render.opacity !== 1 && (b.globalAlpha = T.render.opacity), T.render.sprite && T.render.sprite.texture && !A.wireframes) {
                        var I = T.render.sprite, B = v(_, I.texture);
                        b.translate(T.position.x, T.position.y), b.rotate(T.angle), b.drawImage(
                          B,
                          B.width * -I.xOffset * I.xScale,
                          B.height * -I.yOffset * I.yScale,
                          B.width * I.xScale,
                          B.height * I.yScale
                        ), b.rotate(-T.angle), b.translate(-T.position.x, -T.position.y);
                      } else {
                        if (T.circleRadius)
                          b.beginPath(), b.arc(T.position.x, T.position.y, T.circleRadius, 0, 2 * Math.PI);
                        else {
                          b.beginPath(), b.moveTo(T.vertices[0].x, T.vertices[0].y);
                          for (var R = 1; R < T.vertices.length; R++)
                            !T.vertices[R - 1].isInternal || P ? b.lineTo(T.vertices[R].x, T.vertices[R].y) : b.moveTo(T.vertices[R].x, T.vertices[R].y), T.vertices[R].isInternal && !P && b.moveTo(T.vertices[(R + 1) % T.vertices.length].x, T.vertices[(R + 1) % T.vertices.length].y);
                          b.lineTo(T.vertices[0].x, T.vertices[0].y), b.closePath();
                        }
                        A.wireframes ? (b.lineWidth = 1, b.strokeStyle = _.options.wireframeStrokeStyle, b.stroke()) : (b.fillStyle = T.render.fillStyle, T.render.lineWidth && (b.lineWidth = T.render.lineWidth, b.strokeStyle = T.render.strokeStyle, b.stroke()), b.fill());
                      }
                      b.globalAlpha = 1;
                    }
                }
            }, r.bodyWireframes = function(_, S, C) {
              var b = C, A = _.options.showInternalEdges, P, M, T, k, E;
              for (b.beginPath(), T = 0; T < S.length; T++)
                if (P = S[T], !!P.render.visible)
                  for (E = P.parts.length > 1 ? 1 : 0; E < P.parts.length; E++) {
                    for (M = P.parts[E], b.moveTo(M.vertices[0].x, M.vertices[0].y), k = 1; k < M.vertices.length; k++)
                      !M.vertices[k - 1].isInternal || A ? b.lineTo(M.vertices[k].x, M.vertices[k].y) : b.moveTo(M.vertices[k].x, M.vertices[k].y), M.vertices[k].isInternal && !A && b.moveTo(M.vertices[(k + 1) % M.vertices.length].x, M.vertices[(k + 1) % M.vertices.length].y);
                    b.lineTo(M.vertices[0].x, M.vertices[0].y);
                  }
              b.lineWidth = 1, b.strokeStyle = _.options.wireframeStrokeStyle, b.stroke();
            }, r.bodyConvexHulls = function(_, S, C) {
              var b = C, A, P, M;
              for (b.beginPath(), P = 0; P < S.length; P++)
                if (A = S[P], !(!A.render.visible || A.parts.length === 1)) {
                  for (b.moveTo(A.vertices[0].x, A.vertices[0].y), M = 1; M < A.vertices.length; M++)
                    b.lineTo(A.vertices[M].x, A.vertices[M].y);
                  b.lineTo(A.vertices[0].x, A.vertices[0].y);
                }
              b.lineWidth = 1, b.strokeStyle = "rgba(255,255,255,0.2)", b.stroke();
            }, r.vertexNumbers = function(_, S, C) {
              var b = C, A, P, M;
              for (A = 0; A < S.length; A++) {
                var T = S[A].parts;
                for (M = T.length > 1 ? 1 : 0; M < T.length; M++) {
                  var k = T[M];
                  for (P = 0; P < k.vertices.length; P++)
                    b.fillStyle = "rgba(255,255,255,0.2)", b.fillText(A + "_" + P, k.position.x + (k.vertices[P].x - k.position.x) * 0.8, k.position.y + (k.vertices[P].y - k.position.y) * 0.8);
                }
              }
            }, r.mousePosition = function(_, S, C) {
              var b = C;
              b.fillStyle = "rgba(255,255,255,0.8)", b.fillText(S.position.x + "  " + S.position.y, S.position.x + 5, S.position.y - 5);
            }, r.bodyBounds = function(_, S, C) {
              var b = C;
              _.engine;
              var A = _.options;
              b.beginPath();
              for (var P = 0; P < S.length; P++) {
                var M = S[P];
                if (M.render.visible)
                  for (var T = S[P].parts, k = T.length > 1 ? 1 : 0; k < T.length; k++) {
                    var E = T[k];
                    b.rect(E.bounds.min.x, E.bounds.min.y, E.bounds.max.x - E.bounds.min.x, E.bounds.max.y - E.bounds.min.y);
                  }
              }
              A.wireframes ? b.strokeStyle = "rgba(255,255,255,0.08)" : b.strokeStyle = "rgba(0,0,0,0.1)", b.lineWidth = 1, b.stroke();
            }, r.bodyAxes = function(_, S, C) {
              var b = C;
              _.engine;
              var A = _.options, P, M, T, k;
              for (b.beginPath(), M = 0; M < S.length; M++) {
                var E = S[M], I = E.parts;
                if (E.render.visible)
                  if (A.showAxes)
                    for (T = I.length > 1 ? 1 : 0; T < I.length; T++)
                      for (P = I[T], k = 0; k < P.axes.length; k++) {
                        var B = P.axes[k];
                        b.moveTo(P.position.x, P.position.y), b.lineTo(P.position.x + B.x * 20, P.position.y + B.y * 20);
                      }
                  else
                    for (T = I.length > 1 ? 1 : 0; T < I.length; T++)
                      for (P = I[T], k = 0; k < P.axes.length; k++)
                        b.moveTo(P.position.x, P.position.y), b.lineTo(
                          (P.vertices[0].x + P.vertices[P.vertices.length - 1].x) / 2,
                          (P.vertices[0].y + P.vertices[P.vertices.length - 1].y) / 2
                        );
              }
              A.wireframes ? (b.strokeStyle = "indianred", b.lineWidth = 1) : (b.strokeStyle = "rgba(255, 255, 255, 0.4)", b.globalCompositeOperation = "overlay", b.lineWidth = 2), b.stroke(), b.globalCompositeOperation = "source-over";
            }, r.bodyPositions = function(_, S, C) {
              var b = C;
              _.engine;
              var A = _.options, P, M, T, k;
              for (b.beginPath(), T = 0; T < S.length; T++)
                if (P = S[T], !!P.render.visible)
                  for (k = 0; k < P.parts.length; k++)
                    M = P.parts[k], b.arc(M.position.x, M.position.y, 3, 0, 2 * Math.PI, !1), b.closePath();
              for (A.wireframes ? b.fillStyle = "indianred" : b.fillStyle = "rgba(0,0,0,0.5)", b.fill(), b.beginPath(), T = 0; T < S.length; T++)
                P = S[T], P.render.visible && (b.arc(P.positionPrev.x, P.positionPrev.y, 2, 0, 2 * Math.PI, !1), b.closePath());
              b.fillStyle = "rgba(255,165,0,0.8)", b.fill();
            }, r.bodyVelocity = function(_, S, C) {
              var b = C;
              b.beginPath();
              for (var A = 0; A < S.length; A++) {
                var P = S[A];
                if (P.render.visible) {
                  var M = o.getVelocity(P);
                  b.moveTo(P.position.x, P.position.y), b.lineTo(P.position.x + M.x, P.position.y + M.y);
                }
              }
              b.lineWidth = 3, b.strokeStyle = "cornflowerblue", b.stroke();
            }, r.bodyIds = function(_, S, C) {
              var b = C, A, P;
              for (A = 0; A < S.length; A++)
                if (S[A].render.visible) {
                  var M = S[A].parts;
                  for (P = M.length > 1 ? 1 : 0; P < M.length; P++) {
                    var T = M[P];
                    b.font = "12px Arial", b.fillStyle = "rgba(255,255,255,0.5)", b.fillText(T.id, T.position.x + 10, T.position.y - 10);
                  }
                }
            }, r.collisions = function(_, S, C) {
              var b = C, A = _.options, P, M, T, k;
              for (b.beginPath(), T = 0; T < S.length; T++)
                if (P = S[T], !!P.isActive)
                  for (M = P.collision, k = 0; k < P.contactCount; k++) {
                    var E = P.contacts[k], I = E.vertex;
                    b.rect(I.x - 1.5, I.y - 1.5, 3.5, 3.5);
                  }
              for (A.wireframes ? b.fillStyle = "rgba(255,255,255,0.7)" : b.fillStyle = "orange", b.fill(), b.beginPath(), T = 0; T < S.length; T++)
                if (P = S[T], !!P.isActive && (M = P.collision, P.contactCount > 0)) {
                  var B = P.contacts[0].vertex.x, R = P.contacts[0].vertex.y;
                  P.contactCount === 2 && (B = (P.contacts[0].vertex.x + P.contacts[1].vertex.x) / 2, R = (P.contacts[0].vertex.y + P.contacts[1].vertex.y) / 2), M.bodyB === M.supports[0].body || M.bodyA.isStatic === !0 ? b.moveTo(B - M.normal.x * 8, R - M.normal.y * 8) : b.moveTo(B + M.normal.x * 8, R + M.normal.y * 8), b.lineTo(B, R);
                }
              A.wireframes ? b.strokeStyle = "rgba(255,165,0,0.7)" : b.strokeStyle = "orange", b.lineWidth = 1, b.stroke();
            }, r.separations = function(_, S, C) {
              var b = C, A = _.options, P, M, T, k, E;
              for (b.beginPath(), E = 0; E < S.length; E++)
                if (P = S[E], !!P.isActive) {
                  M = P.collision, T = M.bodyA, k = M.bodyB;
                  var I = 1;
                  !k.isStatic && !T.isStatic && (I = 0.5), k.isStatic && (I = 0), b.moveTo(k.position.x, k.position.y), b.lineTo(k.position.x - M.penetration.x * I, k.position.y - M.penetration.y * I), I = 1, !k.isStatic && !T.isStatic && (I = 0.5), T.isStatic && (I = 0), b.moveTo(T.position.x, T.position.y), b.lineTo(T.position.x + M.penetration.x * I, T.position.y + M.penetration.y * I);
                }
              A.wireframes ? b.strokeStyle = "rgba(255,165,0,0.5)" : b.strokeStyle = "orange", b.stroke();
            }, r.inspector = function(_, S) {
              _.engine;
              var C = _.selected, b = _.render, A = b.options, P;
              if (A.hasBounds) {
                var M = b.bounds.max.x - b.bounds.min.x, T = b.bounds.max.y - b.bounds.min.y, k = M / b.options.width, E = T / b.options.height;
                S.scale(1 / k, 1 / E), S.translate(-b.bounds.min.x, -b.bounds.min.y);
              }
              for (var I = 0; I < C.length; I++) {
                var B = C[I].data;
                switch (S.translate(0.5, 0.5), S.lineWidth = 1, S.strokeStyle = "rgba(255,165,0,0.9)", S.setLineDash([1, 2]), B.type) {
                  case "body":
                    P = B.bounds, S.beginPath(), S.rect(
                      Math.floor(P.min.x - 3),
                      Math.floor(P.min.y - 3),
                      Math.floor(P.max.x - P.min.x + 6),
                      Math.floor(P.max.y - P.min.y + 6)
                    ), S.closePath(), S.stroke();
                    break;
                  case "constraint":
                    var R = B.pointA;
                    B.bodyA && (R = B.pointB), S.beginPath(), S.arc(R.x, R.y, 10, 0, 2 * Math.PI), S.closePath(), S.stroke();
                    break;
                }
                S.setLineDash([]), S.translate(-0.5, -0.5);
              }
              _.selectStart !== null && (S.translate(0.5, 0.5), S.lineWidth = 1, S.strokeStyle = "rgba(255,165,0,0.6)", S.fillStyle = "rgba(255,165,0,0.1)", P = _.selectBounds, S.beginPath(), S.rect(
                Math.floor(P.min.x),
                Math.floor(P.min.y),
                Math.floor(P.max.x - P.min.x),
                Math.floor(P.max.y - P.min.y)
              ), S.closePath(), S.stroke(), S.fill(), S.translate(-0.5, -0.5)), A.hasBounds && S.setTransform(1, 0, 0, 1, 0, 0);
            };
            var p = function(_, S) {
              var C = _.engine, b = _.timing, A = b.historySize, P = C.timing.timestamp;
              b.delta = S - b.lastTime || r._goodDelta, b.lastTime = S, b.timestampElapsed = P - b.lastTimestamp || 0, b.lastTimestamp = P, b.deltaHistory.unshift(b.delta), b.deltaHistory.length = Math.min(b.deltaHistory.length, A), b.engineDeltaHistory.unshift(C.timing.lastDelta), b.engineDeltaHistory.length = Math.min(b.engineDeltaHistory.length, A), b.timestampElapsedHistory.unshift(b.timestampElapsed), b.timestampElapsedHistory.length = Math.min(b.timestampElapsedHistory.length, A), b.engineUpdatesHistory.unshift(C.timing.lastUpdatesPerFrame), b.engineUpdatesHistory.length = Math.min(b.engineUpdatesHistory.length, A), b.engineElapsedHistory.unshift(C.timing.lastElapsed), b.engineElapsedHistory.length = Math.min(b.engineElapsedHistory.length, A), b.elapsedHistory.unshift(b.lastElapsed), b.elapsedHistory.length = Math.min(b.elapsedHistory.length, A);
            }, m = function(_) {
              for (var S = 0, C = 0; C < _.length; C += 1)
                S += _[C];
              return S / _.length || 0;
            }, x = function(_, S) {
              var C = document.createElement("canvas");
              return C.width = _, C.height = S, C.oncontextmenu = function() {
                return !1;
              }, C.onselectstart = function() {
                return !1;
              }, C;
            }, y = function(_) {
              var S = _.getContext("2d"), C = window.devicePixelRatio || 1, b = S.webkitBackingStorePixelRatio || S.mozBackingStorePixelRatio || S.msBackingStorePixelRatio || S.oBackingStorePixelRatio || S.backingStorePixelRatio || 1;
              return C / b;
            }, v = function(_, S) {
              var C = _.textures[S];
              return C || (C = _.textures[S] = new Image(), C.src = S, C);
            }, w = function(_, S) {
              var C = S;
              /(jpg|gif|png)$/.test(S) && (C = "url(" + S + ")"), _.canvas.style.background = C, _.canvas.style.backgroundSize = "contain", _.currentBackground = S;
            };
          })();
        },
        /* 27 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(5), a = n(17), h = n(0);
          (function() {
            r._maxFrameDelta = 1e3 / 15, r._frameDeltaFallback = 1e3 / 60, r._timeBufferMargin = 1.5, r._elapsedNextEstimate = 1, r._smoothingLowerBound = 0.1, r._smoothingUpperBound = 0.9, r.create = function(l) {
              var d = {
                delta: 16.666666666666668,
                frameDelta: null,
                frameDeltaSmoothing: !0,
                frameDeltaSnapping: !0,
                frameDeltaHistory: [],
                frameDeltaHistorySize: 100,
                frameRequestId: null,
                timeBuffer: 0,
                timeLastTick: null,
                maxUpdates: null,
                maxFrameTime: 33.333333333333336,
                lastUpdatesDeferred: 0,
                enabled: !0
              }, f = h.extend(d, l);
              return f.fps = 0, f;
            }, r.run = function(l, d) {
              return l.timeBuffer = r._frameDeltaFallback, function f(u) {
                l.frameRequestId = r._onNextFrame(l, f), u && l.enabled && r.tick(l, d, u);
              }(), l;
            }, r.tick = function(l, d, f) {
              var u = h.now(), g = l.delta, p = 0, m = f - l.timeLastTick;
              if ((!m || !l.timeLastTick || m > Math.max(r._maxFrameDelta, l.maxFrameTime)) && (m = l.frameDelta || r._frameDeltaFallback), l.frameDeltaSmoothing) {
                l.frameDeltaHistory.push(m), l.frameDeltaHistory = l.frameDeltaHistory.slice(-l.frameDeltaHistorySize);
                var x = l.frameDeltaHistory.slice(0).sort(), y = l.frameDeltaHistory.slice(
                  x.length * r._smoothingLowerBound,
                  x.length * r._smoothingUpperBound
                ), v = c(y);
                m = v || m;
              }
              l.frameDeltaSnapping && (m = 1e3 / Math.round(1e3 / m)), l.frameDelta = m, l.timeLastTick = f, l.timeBuffer += l.frameDelta, l.timeBuffer = h.clamp(
                l.timeBuffer,
                0,
                l.frameDelta + g * r._timeBufferMargin
              ), l.lastUpdatesDeferred = 0;
              var w = l.maxUpdates || Math.ceil(l.maxFrameTime / g), _ = {
                timestamp: d.timing.timestamp
              };
              o.trigger(l, "beforeTick", _), o.trigger(l, "tick", _);
              for (var S = h.now(); g > 0 && l.timeBuffer >= g * r._timeBufferMargin; ) {
                o.trigger(l, "beforeUpdate", _), a.update(d, g), o.trigger(l, "afterUpdate", _), l.timeBuffer -= g, p += 1;
                var C = h.now() - u, b = h.now() - S, A = C + r._elapsedNextEstimate * b / p;
                if (p >= w || A > l.maxFrameTime) {
                  l.lastUpdatesDeferred = Math.round(Math.max(0, l.timeBuffer / g - r._timeBufferMargin));
                  break;
                }
              }
              d.timing.lastUpdatesPerFrame = p, o.trigger(l, "afterTick", _), l.frameDeltaHistory.length >= 100 && (l.lastUpdatesDeferred && Math.round(l.frameDelta / g) > w ? h.warnOnce("Matter.Runner: runner reached runner.maxUpdates, see docs.") : l.lastUpdatesDeferred && h.warnOnce("Matter.Runner: runner reached runner.maxFrameTime, see docs."), typeof l.isFixed < "u" && h.warnOnce("Matter.Runner: runner.isFixed is now redundant, see docs."), (l.deltaMin || l.deltaMax) && h.warnOnce("Matter.Runner: runner.deltaMin and runner.deltaMax were removed, see docs."), l.fps !== 0 && h.warnOnce("Matter.Runner: runner.fps was replaced by runner.delta, see docs."));
            }, r.stop = function(l) {
              r._cancelNextFrame(l);
            }, r._onNextFrame = function(l, d) {
              if (typeof window < "u" && window.requestAnimationFrame)
                l.frameRequestId = window.requestAnimationFrame(d);
              else
                throw new Error("Matter.Runner: missing required global window.requestAnimationFrame.");
              return l.frameRequestId;
            }, r._cancelNextFrame = function(l) {
              if (typeof window < "u" && window.cancelAnimationFrame)
                window.cancelAnimationFrame(l.frameRequestId);
              else
                throw new Error("Matter.Runner: missing required global window.cancelAnimationFrame.");
            };
            var c = function(l) {
              for (var d = 0, f = l.length, u = 0; u < f; u += 1)
                d += l[u];
              return d / f || 0;
            };
          })();
        },
        /* 28 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(8), a = n(0), h = a.deprecated;
          (function() {
            r.collides = function(c, l) {
              return o.collides(c, l);
            }, h(r, "collides", "SAT.collides ➤ replaced by Collision.collides");
          })();
        },
        /* 29 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r, n(1);
          var o = n(0);
          (function() {
            r.pathToVertices = function(a, h) {
              typeof window < "u" && !("SVGPathSeg" in window) && o.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");
              var c, l, d, f, u, g, p, m, x, y, v = [], w, _, S = 0, C = 0, b = 0;
              h = h || 15;
              var A = function(M, T, k) {
                var E = k % 2 === 1 && k > 1;
                if (!x || M != x.x || T != x.y) {
                  x && E ? (w = x.x, _ = x.y) : (w = 0, _ = 0);
                  var I = {
                    x: w + M,
                    y: _ + T
                  };
                  (E || !x) && (x = I), v.push(I), C = w + M, b = _ + T;
                }
              }, P = function(M) {
                var T = M.pathSegTypeAsLetter.toUpperCase();
                if (T !== "Z") {
                  switch (T) {
                    case "M":
                    case "L":
                    case "T":
                    case "C":
                    case "S":
                    case "Q":
                      C = M.x, b = M.y;
                      break;
                    case "H":
                      C = M.x;
                      break;
                    case "V":
                      b = M.y;
                      break;
                  }
                  A(C, b, M.pathSegType);
                }
              };
              for (r._svgPathToAbsolute(a), d = a.getTotalLength(), g = [], c = 0; c < a.pathSegList.numberOfItems; c += 1)
                g.push(a.pathSegList.getItem(c));
              for (p = g.concat(); S < d; ) {
                if (y = a.getPathSegAtLength(S), u = g[y], u != m) {
                  for (; p.length && p[0] != u; )
                    P(p.shift());
                  m = u;
                }
                switch (u.pathSegTypeAsLetter.toUpperCase()) {
                  case "C":
                  case "T":
                  case "S":
                  case "Q":
                  case "A":
                    f = a.getPointAtLength(S), A(f.x, f.y, 0);
                    break;
                }
                S += h;
              }
              for (c = 0, l = p.length; c < l; ++c)
                P(p[c]);
              return v;
            }, r._svgPathToAbsolute = function(a) {
              for (var h, c, l, d, f, u, g = a.pathSegList, p = 0, m = 0, x = g.numberOfItems, y = 0; y < x; ++y) {
                var v = g.getItem(y), w = v.pathSegTypeAsLetter;
                if (/[MLHVCSQTA]/.test(w))
                  "x" in v && (p = v.x), "y" in v && (m = v.y);
                else
                  switch ("x1" in v && (l = p + v.x1), "x2" in v && (f = p + v.x2), "y1" in v && (d = m + v.y1), "y2" in v && (u = m + v.y2), "x" in v && (p += v.x), "y" in v && (m += v.y), w) {
                    case "m":
                      g.replaceItem(a.createSVGPathSegMovetoAbs(p, m), y);
                      break;
                    case "l":
                      g.replaceItem(a.createSVGPathSegLinetoAbs(p, m), y);
                      break;
                    case "h":
                      g.replaceItem(a.createSVGPathSegLinetoHorizontalAbs(p), y);
                      break;
                    case "v":
                      g.replaceItem(a.createSVGPathSegLinetoVerticalAbs(m), y);
                      break;
                    case "c":
                      g.replaceItem(a.createSVGPathSegCurvetoCubicAbs(p, m, l, d, f, u), y);
                      break;
                    case "s":
                      g.replaceItem(a.createSVGPathSegCurvetoCubicSmoothAbs(p, m, f, u), y);
                      break;
                    case "q":
                      g.replaceItem(a.createSVGPathSegCurvetoQuadraticAbs(p, m, l, d), y);
                      break;
                    case "t":
                      g.replaceItem(a.createSVGPathSegCurvetoQuadraticSmoothAbs(p, m), y);
                      break;
                    case "a":
                      g.replaceItem(a.createSVGPathSegArcAbs(p, m, v.r1, v.r2, v.angle, v.largeArcFlag, v.sweepFlag), y);
                      break;
                    case "z":
                    case "Z":
                      p = h, m = c;
                      break;
                  }
                (w == "M" || w == "m") && (h = p, c = m);
              }
            };
          })();
        },
        /* 30 */
        /***/
        function(e, i, n) {
          var r = {};
          e.exports = r;
          var o = n(6);
          n(0), function() {
            r.create = o.create, r.add = o.add, r.remove = o.remove, r.clear = o.clear, r.addComposite = o.addComposite, r.addBody = o.addBody, r.addConstraint = o.addConstraint;
          }();
        }
        /******/
      ])
    );
  });
})(pu);
var re = pu.exports;
let ii;
const Si = /* @__PURE__ */ new Map(), en = /* @__PURE__ */ new Map(), $o = /* @__PURE__ */ new Map();
let Ys = 0;
const T_ = () => {
  ii = re.Engine.create(), re.Events.on(ii, "collisionStart", (s) => {
    s.pairs.forEach((t) => {
      var h, c;
      const { bodyA: e, bodyB: i } = t, n = Si.get(e.label), r = Si.get(i.label);
      if (!n || !r) return;
      const o = [n, r].find((l) => l.surface), a = [n, r].find((l) => !l.surface);
      a && (o ? en.set(
        a.target.matterBody.label,
        Math.floor(Th(o).y1)
      ) : ((h = n.onCollision) == null || h.call(n, r.target), (c = r.onCollision) == null || c.call(r, n.target)));
    });
  }), re.Events.on(ii, "collisionEnd", (s) => {
    s.pairs.forEach((t) => {
      const { bodyA: e, bodyB: i } = t, n = Si.get(e.label), r = Si.get(i.label);
      if (!n || !r) return;
      const o = [n, r].find((h) => h.surface), a = [n, r].find((h) => !h.surface);
      a && o && en.delete(a.target.matterBody.label);
    });
  }), re.Events.on(ii, "afterUpdate", () => {
    $o.forEach((s) => {
      var i;
      if (!s.target.matterBody) return;
      const t = Th(s), e = (en.get(s.target.matterBody.label) ?? -1 / 0) >= Math.floor(t.y2);
      (i = s.onUpdatePosition) == null || i.call(s, t.x1, t.y1, e);
    });
  });
}, k_ = (s) => {
  re.Engine.update(ii, s);
}, P0 = (s) => {
  if (s.rectangle)
    s.target.matterBody = re.Bodies.rectangle(
      s.rectangle.x + s.rectangle.width / 2,
      s.rectangle.y + s.rectangle.height / 2,
      s.rectangle.width,
      s.rectangle.height,
      Mh(s)
    );
  else if (s.circle)
    s.target.matterBody = re.Bodies.circle(
      s.circle.x,
      s.circle.y,
      s.circle.radius,
      Mh(s)
    );
  else
    throw new Error("No body specification provided");
  Si.set(s.target.matterBody.label, s), s.onUpdatePosition && $o.set(s.target.matterBody.label, s), re.Composite.add(ii.world, s.target.matterBody), s.movement && I_(s.target, s.movement);
}, E_ = (s) => {
  s.matterBody && (re.Composite.remove(ii.world, s.matterBody), Si.delete(s.matterBody.label), en.delete(s.matterBody.label), $o.delete(s.matterBody.label));
}, I_ = (s, t) => {
  s.matterBody && t.linearMovement && re.Body.setVelocity(s.matterBody, t.linearMovement.velocity);
}, M0 = (s, t, e) => {
  s.matterBody && re.Body.setPosition(s.matterBody, {
    x: s.matterBody.position.x + t,
    y: s.matterBody.position.y + e
  });
}, Mh = (s) => {
  var t;
  return Ys++, s.surface ? {
    isStatic: !0,
    label: Ys.toString(),
    inertia: 1 / 0,
    inverseInertia: 0,
    restitution: 0
  } : (t = s.movement) != null && t.linearMovement ? {
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    inertia: 1 / 0,
    inverseInertia: 0,
    restitution: 0,
    label: Ys.toString()
  } : {
    isStatic: !0,
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 0,
    isSensor: !0,
    label: Ys.toString()
  };
}, Th = (s) => s.target.matterBody ? s.rectangle ? {
  x1: s.target.matterBody.position.x - s.rectangle.width / 2,
  y1: s.target.matterBody.position.y - s.rectangle.height / 2,
  x2: s.target.matterBody.position.x + s.rectangle.width / 2,
  y2: s.target.matterBody.position.y + s.rectangle.height / 2
} : s.circle ? {
  x1: s.target.matterBody.position.x - s.circle.radius,
  y1: s.target.matterBody.position.y - s.circle.radius,
  x2: s.target.matterBody.position.x + s.circle.radius,
  y2: s.target.matterBody.position.y + s.circle.radius
} : { x1: 0, y1: 0, x2: 0, y2: 0 } : { x1: 0, y1: 0, x2: 0, y2: 0 };
class Ts {
  constructor(t, e) {
    Gt(this, "_props");
    Gt(this, "_object");
    Gt(this, "_parent", null);
    Gt(this, "_bindings", []);
    Gt(this, "_animations", []);
    this._props = e, this._object = t, this.hitArea = this.props.hitArea, this._createEvents(), this._setOrientationProperties(), this._positionToScreen(), (this.props.animations ?? []).forEach((i) => this.animate(i));
  }
  _registerToSignal(t, e) {
    this._bindings.push(fm(t, e.bind(this)));
  }
  _unregisterFromSignal(t) {
    for (let e = 0; e < this._bindings.length; e++)
      this._bindings[e].name === t && (ch(t, this._bindings[e].binding), this._bindings.splice(e, 1), e--);
  }
  get props() {
    return this._props;
  }
  get object() {
    return this._object;
  }
  get x() {
    return this.object.x;
  }
  set x(t) {
    this.object.x = t;
  }
  get y() {
    return this.object.y;
  }
  set y(t) {
    this.object.y = t;
  }
  get position() {
    return this.object.position;
  }
  set position(t) {
    this.object.position = t;
  }
  get globalPosition() {
    return this.object.toGlobal(this.position);
  }
  set scale(t) {
    this.object.scale = t;
  }
  get scale() {
    return this.object.scale;
  }
  get scaleX() {
    return this.object.scale.x;
  }
  set scaleX(t) {
    this.object.scale.x = t;
  }
  get scaleY() {
    return this.object.scale.y;
  }
  set scaleY(t) {
    this.object.scale.y = t;
  }
  get width() {
    return this.object.width;
  }
  set width(t) {
    this.object.width = t;
  }
  get height() {
    return this.object.height;
  }
  set height(t) {
    this.object.height = t;
  }
  get alpha() {
    return this.object.alpha;
  }
  set alpha(t) {
    this.object.alpha = t;
  }
  get visible() {
    return this.object.visible;
  }
  set visible(t) {
    this.object.visible = t;
  }
  get label() {
    return this.object.label;
  }
  get parent() {
    return this._parent;
  }
  set parent(t) {
    this._parent = t;
  }
  get interactive() {
    return this.object.interactive ?? !1;
  }
  set interactive(t) {
    this.object.interactive = t;
  }
  get rotation() {
    return this.object.rotation;
  }
  set rotation(t) {
    this.object.rotation = t;
  }
  get tint() {
    return this.object.tint;
  }
  set tint(t) {
    this.object.tint = t;
  }
  get zIndex() {
    return this.object.zIndex;
  }
  set zIndex(t) {
    this.object.zIndex = t;
  }
  set hitArea(t) {
    t != null && t.circle ? this.object.hitArea = new Sn(
      t.circle.x,
      t.circle.y,
      t.circle.radius
    ) : t != null && t.roundedRectangle ? this.object.hitArea = new An(
      t.roundedRectangle.x,
      t.roundedRectangle.y,
      t.roundedRectangle.width,
      t.roundedRectangle.height,
      t.roundedRectangle.borderRadius
    ) : t != null && t.rectangle ? this.object.hitArea = new pt(
      t.rectangle.x,
      t.rectangle.y,
      t.rectangle.width,
      t.rectangle.height
    ) : t != null && t.polygon ? this.object.hitArea = new Ai(t.polygon.points) : this.object.hitArea = null;
  }
  animate(t) {
    return this._createAnimation(this, t);
  }
  getAnimation(t) {
    return this._animations.find((e) => e.name === t);
  }
  stopAnimations() {
    this._animations.forEach((t) => t.stop()), this._animations = [];
  }
  finishAnimations() {
    this._animations.forEach((t) => t.finish());
  }
  delay(t) {
    return this._createAnimation(
      { x: 0 },
      {
        from: { x: 0 },
        to: { x: 1 },
        duration: t
      }
    );
  }
  destroy() {
    if (this.parent) {
      this.parent.removeComponent(this);
      return;
    }
    E_(this), this._bindings.forEach(
      ({ name: t, binding: e }) => ch(t, e)
    ), this._bindings = [], this.stopAnimations(), this.parent = null, this.object.destroy();
  }
  _positionToScreen() {
    var t, e, i, n;
    this.props.horizontalAlignment === "center" ? this.x = Y.screen.width / 2 + (((t = this.props.margin) == null ? void 0 : t.x) ?? 0) : this.props.horizontalAlignment === "right" && (this.x = Y.screen.width + (((e = this.props.margin) == null ? void 0 : e.x) ?? 0)), this.props.verticalAlignment === "center" ? this.y = Y.screen.height / 2 + (((i = this.props.margin) == null ? void 0 : i.y) ?? 0) : this.props.verticalAlignment === "bottom" && (this.y = Y.screen.height + (((n = this.props.margin) == null ? void 0 : n.y) ?? 0));
  }
  _setOrientationProperties() {
    if (!this.props.landscape && !this.props.portrait) return;
    const t = this.props[Y.screen.orientation];
    for (const e in t)
      this[e] = t[e];
  }
  async _createAnimation(t, e) {
    const i = new Vi(e);
    this._animations.push(i), await i.start(t);
    const n = this._animations.indexOf(i);
    this._animations.splice(n, 1);
  }
  _createEvents() {
    var n, r, o;
    const t = [
      this.props.horizontalAlignment || this.props.verticalAlignment ? this._positionToScreen.bind(this) : null,
      this.props.onResize,
      (n = this._onResize) == null ? void 0 : n.bind(this)
    ].filter(Boolean);
    t.length > 0 && this._registerToSignal(W.signals.onResize, () => {
      t.forEach((a) => a(this));
    });
    const e = [
      this.props.landscape || this.props.portrait ? this._setOrientationProperties.bind(this) : null,
      this.props.onOrientationChange,
      (r = this._onOrientationChange) == null ? void 0 : r.bind(this)
    ].filter(Boolean);
    e.length > 0 && this._registerToSignal(W.signals.onOrientationChange, () => {
      e.forEach((a) => a(this));
    });
    const i = [
      this.props.onTick,
      (o = this._onTick) == null ? void 0 : o.bind(this)
    ].filter(Boolean);
    i.length > 0 && this._registerToSignal(W.signals.onTick, () => {
      i.forEach((a) => a(this));
    }), (this._onClick || this.props.onClick) && this.object.on("pointerdown", (a) => {
      var h, c, l;
      a.stopImmediatePropagation(), (c = (h = this.props).onClick) == null || c.call(h, this), (l = this._onClick) == null || l.call(this);
    }), (this._onPointerUp || this.props.onPointerUp) && this.object.on("pointerup", (a) => {
      var h, c, l;
      a.stopImmediatePropagation(), (c = (h = this.props).onPointerUp) == null || c.call(h, this), (l = this._onPointerUp) == null || l.call(this);
    }), (this._onPointerEnter || this.props.onPointerEnter) && this.object.on("pointerenter", (a) => {
      var h, c, l;
      a.stopImmediatePropagation(), (c = (h = this.props).onPointerEnter) == null || c.call(h, this), (l = this._onPointerEnter) == null || l.call(this);
    }), (this._onPointerOut || this.props.onPointerOut) && this.object.on("pointerout", (a) => {
      var h, c, l;
      a.stopImmediatePropagation(), (c = (h = this.props).onPointerOut) == null || c.call(h, this), (l = this._onPointerOut) == null || l.call(this);
    });
  }
}
let ls;
const Te = /* @__PURE__ */ new Map(), B_ = () => {
  ls = ge.get("audio/sounds.mp3");
  const s = ge.get("audio/sounds.json");
  ls.muted = Y.muted, ls.addSprites(s);
}, gu = async (s, t = {}) => {
  const { loop: e = !1, volume: i = 1 } = t, n = await ls.play({
    sprite: s,
    loop: e,
    volume: i,
    complete: () => Te.delete(s)
  });
  Te.set(s, n);
}, T0 = async (s, t) => {
  const {
    fromVolume: e = 0.1,
    toVolume: i = 1,
    fadeDuration: n,
    loop: r = !1
  } = t;
  await gu(s, { loop: r, volume: i }), await new Vi({
    duration: n,
    from: { volume: e },
    to: { volume: i }
  }).start(Te.get(s));
}, R_ = (s) => {
  var t, e;
  (t = Te.get(s)) == null || t.stop(), (e = Te.get(s)) == null || e.destroy(), Te.delete(s);
}, k0 = async (s, t) => {
  const e = Te.get(s);
  if (!e) return;
  const { fadeDuration: i } = t;
  await new Vi({
    duration: i,
    from: { volume: e.volume },
    to: { volume: 0 }
  }).start(e), R_(s);
}, F_ = (s) => {
  ls.muted = s;
}, L_ = () => {
  for (const [s, t] of Te)
    t.paused = !0;
}, O_ = () => {
  for (const [s, t] of Te)
    t.paused = !1;
}, ks = (s) => ({
  label: s.label,
  position: s.position,
  anchor: s.anchor,
  scale: s.scale,
  rotation: s.rotation,
  width: s.width,
  height: s.height,
  alpha: s.alpha,
  interactive: s.interactive,
  cursor: s.cursor,
  visible: s.visible,
  tint: s.tint,
  zIndex: s.zIndex
});
let mu;
const kh = /* @__PURE__ */ new Map(), D_ = (s) => {
  mu = s;
}, z_ = (s) => {
  let t;
  if (s.rectangle)
    t = new Fe().rect(
      s.rectangle.x,
      s.rectangle.y,
      s.rectangle.width,
      s.rectangle.height
    );
  else if (s.roundedRectangle)
    t = new Fe().roundRect(
      s.roundedRectangle.x,
      s.roundedRectangle.y,
      s.roundedRectangle.width,
      s.roundedRectangle.height,
      s.roundedRectangle.borderRadius
    );
  else if (s.circle)
    t = new Fe().circle(
      s.circle.x,
      s.circle.y,
      s.circle.radius
    );
  else if (s.polygon)
    t = new Fe().poly(s.polygon.points);
  else
    throw new Error("Invalid shape type");
  return t = t.fill(s.fillColor), s.strokeColor != null && (t = t.stroke({
    color: s.strokeColor,
    width: s.strokeWidth ?? 0
  })), t;
}, Ss = (s) => {
  const t = JSON.stringify(s);
  let e = kh.get(t);
  if (e) return e;
  if (typeof s == "string") return G.from(s);
  const i = z_(s);
  return e = Mo.create({
    width: i.width,
    height: i.height
  }), mu.render({ container: i, target: e }), kh.set(t, e), e;
};
class _u extends Ts {
  constructor(t) {
    super(
      new oe({
        ...ks(t),
        texture: Ss(t.resource)
      }),
      t
    );
  }
  get anchor() {
    return this.object.anchor;
  }
  set anchor(t) {
    this.object.anchor = t;
  }
  get originalWidth() {
    return this.object.texture.width;
  }
  get originalHeight() {
    return this.object.texture.height;
  }
  set texture(t) {
    this.object.texture = Ss(t);
  }
}
class xu extends _u {
  constructor(e) {
    super(e);
    Gt(this, "_pointerOver", !1);
    Gt(this, "_enabled", !0);
  }
  get props() {
    return super.props;
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(e) {
    this._enabled !== e && (this._enabled = e, this._setCurrentTexture());
  }
  get pointerOver() {
    return this._pointerOver;
  }
  _onPointerEnter() {
    this._pointerOver = !0, this._setCurrentTexture();
  }
  _onPointerOut() {
    this._pointerOver = !1, this._setCurrentTexture();
  }
  async _onClick() {
    gu(W.sounds.click), this.texture = this.enabled ? this.props.resource : this.props.disabledResource, await this.delay(0.1), this._setCurrentTexture();
  }
  _setCurrentTexture() {
    this.enabled ? this.pointerOver ? this.texture = this.props.hoverResource : this.texture = this.props.resource : this.texture = this.props.disabledResource;
  }
}
class U_ extends Ts {
  constructor(e) {
    super(
      new Et({
        ...ks(e),
        sortableChildren: e.sortableChildren
      }),
      e
    );
    Gt(this, "_components", []);
    this.addComponents(e.components ?? []);
  }
  get components() {
    return this._components;
  }
  get sortableChildren() {
    return this.object.sortableChildren;
  }
  set sortableChildren(e) {
    this.object.sortableChildren = e;
  }
  addComponent(e) {
    return this.components.push(e), this.object.addChild(e.object), e.parent = this, e;
  }
  addComponents(e) {
    e.forEach((i) => this.addComponent(i));
  }
  getComponent(e) {
    return this.components.find((i) => i.label === e);
  }
  removeComponent(e) {
    const i = this.components.indexOf(e);
    i >= 0 && (this.components[i].parent = null, this.components[i].destroy(), this.components.splice(i, 1));
  }
  removeComponents() {
    this.components.forEach((e) => {
      e.parent = null, e.destroy();
    }), this._components = [];
  }
  destroy() {
    this.removeComponents(), super.destroy();
  }
  _positionToScreen() {
    var e, i, n, r;
    this.props.horizontalAlignment === "center" ? this.x = (Y.screen.width - (this.props.width ?? 0)) / 2 + (((e = this.props.margin) == null ? void 0 : e.x) ?? 0) : this.props.horizontalAlignment === "right" && (this.x = Y.screen.width - (this.props.width ?? 0) + (((i = this.props.margin) == null ? void 0 : i.x) ?? 0)), this.props.verticalAlignment === "center" ? this.y = (Y.screen.height - (this.props.height ?? 0)) / 2 + (((n = this.props.margin) == null ? void 0 : n.y) ?? 0) : this.props.verticalAlignment === "bottom" && (this.y = Y.screen.height - (this.props.height ?? 0) + (((r = this.props.margin) == null ? void 0 : r.y) ?? 0));
  }
}
class E0 extends xu {
  constructor(t) {
    super(t);
  }
  get props() {
    return super.props;
  }
  async _onClick() {
    super._onClick(), window.location.href = this.props.url;
  }
}
class W_ extends Ts {
  constructor(t) {
    super(
      new hm({
        ...ks(t),
        texture: Ss(t.resource),
        anchor: typeof t.anchor == "number" ? { x: t.anchor, y: t.anchor } : t.anchor
      }),
      t
    );
  }
  get anchor() {
    return this.object.anchor;
  }
  set anchor(t) {
    this.object.anchor = t;
  }
  get originalWidth() {
    return this.object.texture.width;
  }
  get originalHeight() {
    return this.object.texture.height;
  }
  get tileScale() {
    return this.object.tileScale;
  }
  set tileScale(t) {
    this.object.tileScale = t;
  }
  get tilePosition() {
    return this.object.tilePosition;
  }
  set tilePosition(t) {
    this.object.tilePosition = t;
  }
  set texture(t) {
    this.object.texture = Ss(t);
  }
}
class G_ extends W_ {
  constructor(t) {
    super(t), this._onResize();
  }
  _onResize() {
    this.width = Y.screen.width, this.height = Y.screen.height;
    const t = Y.screen.height / this.originalHeight;
    this.tileScale = { x: t, y: t };
  }
}
class I0 extends G_ {
  _onTick() {
    this.tilePosition.x--;
  }
}
class lo extends Ts {
  constructor(t) {
    const e = {
      ...ks(t),
      text: t.text,
      style: {
        fontFamily: t.fontFamily,
        fontSize: t.fontSize,
        fill: t.textColor,
        lineHeight: t.lineHeight,
        wordWrap: t.wordWrap,
        wordWrapWidth: t.wordWrapWidth,
        align: t.align,
        fontWeight: t.fontWeight ?? "normal",
        fontStyle: t.fontStyle ?? "normal",
        stroke: t.strokeColor && {
          color: t.strokeColor,
          width: t.strokeWidth
        }
      }
    };
    super(t.bitmap ? new lm(e) : new ac(e), t);
  }
  get anchor() {
    return this.object.anchor;
  }
  set anchor(t) {
    this.object.anchor = t;
  }
  get fontSize() {
    return this.object.style.fontSize;
  }
  set fontSize(t) {
    this.object.style.fontSize = t;
  }
  get wordWrapWidth() {
    return this.object.style.wordWrapWidth;
  }
  set wordWrapWidth(t) {
    this.object.style.wordWrapWidth = t;
  }
  get fontWeight() {
    return this.object.style.fontWeight;
  }
  set fontWeight(t) {
    this.object.style.fontWeight = t;
  }
  get fontStyle() {
    return this.object.style.fontStyle;
  }
  set fontStyle(t) {
    this.object.style.fontStyle = t;
  }
  get align() {
    return this.object.style.align;
  }
  set align(t) {
    this.object.style.align = t;
  }
  get text() {
    return this.object.text;
  }
  set text(t) {
    this.object.text = t;
  }
}
class B0 extends xu {
  constructor(e) {
    super(e);
    Gt(this, "_originalProps");
    this._originalProps = structuredClone(e), this._setResources();
  }
  get props() {
    return super.props;
  }
  async _onClick() {
    localStorage.setItem("muted", Y.muted ? "false" : "true"), Y.muted = !Y.muted, F_(Y.muted), this._setResources(), super._onClick();
  }
  _setResources() {
    Y.muted ? (this.props.resource = this._originalProps.mutedResource, this.props.hoverResource = this._originalProps.mutedHoverResource, this.props.disabledResource = this._originalProps.mutedDisabledResource) : (this.props.resource = this._originalProps.resource, this.props.hoverResource = this._originalProps.hoverResource, this.props.disabledResource = this._originalProps.disabledResource), this._setCurrentTexture();
  }
}
var co = {}, He = {};
Object.defineProperty(He, "__esModule", { value: !0 });
He.Collector = void 0;
class V_ {
  /**
   * Create a new collector.
   *
   * @param signal The signal to emit.
   */
  constructor(t) {
    this.emit = (...e) => {
      t.emitCollecting(this, e);
    };
  }
}
He.Collector = V_;
var En = {};
Object.defineProperty(En, "__esModule", { value: !0 });
En.CollectorArray = void 0;
const N_ = He;
class H_ extends N_.Collector {
  constructor() {
    super(...arguments), this.result = [];
  }
  handleResult(t) {
    return this.result.push(t), !0;
  }
  /**
   * Get the list of results from the signal handlers.
   */
  getResult() {
    return this.result;
  }
  /**
   * Reset the result
   */
  reset() {
    this.result.length = 0;
  }
}
En.CollectorArray = H_;
var In = {};
Object.defineProperty(In, "__esModule", { value: !0 });
In.CollectorLast = void 0;
const $_ = He;
class j_ extends $_.Collector {
  handleResult(t) {
    return this.result = t, !0;
  }
  /**
   * Get the result of the last signal handler.
   */
  getResult() {
    return this.result;
  }
  /**
   * Reset the result
   */
  reset() {
    delete this.result;
  }
}
In.CollectorLast = j_;
var Bn = {};
Object.defineProperty(Bn, "__esModule", { value: !0 });
Bn.CollectorUntil0 = void 0;
const Y_ = He;
class X_ extends Y_.Collector {
  constructor() {
    super(...arguments), this.result = !1;
  }
  handleResult(t) {
    return this.result = t, this.result;
  }
  /**
   * Get the result of the last signal handler.
   */
  getResult() {
    return this.result;
  }
  /**
   * Reset the result
   */
  reset() {
    this.result = !1;
  }
}
Bn.CollectorUntil0 = X_;
var Rn = {};
Object.defineProperty(Rn, "__esModule", { value: !0 });
Rn.CollectorWhile0 = void 0;
const K_ = He;
class q_ extends K_.Collector {
  constructor() {
    super(...arguments), this.result = !1;
  }
  handleResult(t) {
    return this.result = t, !this.result;
  }
  /**
   * Get the result of the last signal handler.
   */
  getResult() {
    return this.result;
  }
  /**
   * Reset the result
   */
  reset() {
    this.result = !1;
  }
}
Rn.CollectorWhile0 = q_;
var Fn = {}, Ln = {};
Object.defineProperty(Ln, "__esModule", { value: !0 });
Ln.SignalConnectionImpl = void 0;
class Z_ {
  /**
   * @param link The actual link of the connection.
   * @param parentCleanup Callback to cleanup the parent signal when a connection is disconnected
   */
  constructor(t, e) {
    this.link = t, this.parentCleanup = e;
  }
  disconnect() {
    return this.link !== null ? (this.link.unlink(), this.link = null, this.parentCleanup(), this.parentCleanup = null, !0) : !1;
  }
  set enabled(t) {
    this.link && this.link.setEnabled(t);
  }
  get enabled() {
    return this.link !== null && this.link.isEnabled();
  }
}
Ln.SignalConnectionImpl = Z_;
var On = {};
Object.defineProperty(On, "__esModule", { value: !0 });
On.SignalLink = void 0;
class jo {
  constructor(t = null, e = null, i = 0) {
    this.enabled = !0, this.newLink = !1, this.callback = null, this.prev = t ?? this, this.next = e ?? this, this.order = i;
  }
  isEnabled() {
    return this.enabled && !this.newLink;
  }
  setEnabled(t) {
    this.enabled = t;
  }
  unlink() {
    this.callback = null, this.next.prev = this.prev, this.prev.next = this.next;
  }
  insert(t, e) {
    let i = this.prev;
    for (; i !== this && !(i.order <= e); )
      i = i.prev;
    const n = new jo(i, i.next, e);
    return n.callback = t, i.next = n, n.next.prev = n, n;
  }
}
On.SignalLink = jo;
Object.defineProperty(Fn, "__esModule", { value: !0 });
Fn.Signal = void 0;
const Q_ = Ln, J_ = On;
class t0 {
  constructor() {
    this.head = new J_.SignalLink(), this.hasNewLinks = !1, this.emitDepth = 0, this.connectionsCount = 0;
  }
  /**
   * @returns The number of connections on this signal.
   */
  getConnectionsCount() {
    return this.connectionsCount;
  }
  /**
   * @returns true if this signal has connections.
   */
  hasConnections() {
    return this.connectionsCount > 0;
  }
  /**
   * Subscribe to this signal.
   *
   * @param callback This callback will be run when emit() is called.
   * @param order Handlers with a higher order value will be called later.
   */
  connect(t, e = 0) {
    this.connectionsCount++;
    const i = this.head.insert(t, e);
    return this.emitDepth > 0 && (this.hasNewLinks = !0, i.newLink = !0), new Q_.SignalConnectionImpl(i, () => this.decrementConnectionCount());
  }
  decrementConnectionCount() {
    this.connectionsCount--;
  }
  /**
   * Unsubscribe from this signal with the original callback instance.
   * While you can use this method, the SignalConnection returned by connect() will not be updated!
   *
   * @param callback The callback you passed to connect().
   */
  disconnect(t) {
    for (let e = this.head.next; e !== this.head; e = e.next)
      if (e.callback === t)
        return this.decrementConnectionCount(), e.unlink(), !0;
    return !1;
  }
  /**
   * Disconnect all handlers from this signal event.
   */
  disconnectAll() {
    for (; this.head.next !== this.head; )
      this.head.next.unlink();
    this.connectionsCount = 0;
  }
  /**
   * Publish this signal event (call all handlers).
   */
  emit(...t) {
    this.emitDepth++;
    for (let e = this.head.next; e !== this.head; e = e.next)
      e.isEnabled() && e.callback && e.callback.apply(null, t);
    this.emitDepth--, this.unsetNewLink();
  }
  emitCollecting(t, e) {
    this.emitDepth++;
    for (let i = this.head.next; i !== this.head; i = i.next)
      if (i.isEnabled() && i.callback) {
        const n = i.callback.apply(null, e);
        if (!t.handleResult(n))
          break;
      }
    this.emitDepth--, this.unsetNewLink();
  }
  unsetNewLink() {
    if (this.hasNewLinks && this.emitDepth === 0) {
      for (let t = this.head.next; t !== this.head; t = t.next)
        t.newLink = !1;
      this.hasNewLinks = !1;
    }
  }
}
Fn.Signal = t0;
var Dn = {};
Object.defineProperty(Dn, "__esModule", { value: !0 });
Dn.SignalConnections = void 0;
class e0 {
  constructor() {
    this.list = [];
  }
  /**
   * Add a connection to the list.
   * @param connection
   */
  add(t) {
    this.list.push(t);
  }
  /**
   * Disconnect all connections in the list and empty the list.
   */
  disconnectAll() {
    for (const t of this.list)
      t.disconnect();
    this.list = [];
  }
  /**
   * @returns The number of connections in this list.
   */
  getCount() {
    return this.list.length;
  }
  /**
   * @returns true if this list is empty.
   */
  isEmpty() {
    return this.list.length === 0;
  }
}
Dn.SignalConnections = e0;
(function(s) {
  Object.defineProperty(s, "__esModule", { value: !0 }), s.SignalConnections = s.Signal = s.CollectorWhile0 = s.CollectorUntil0 = s.CollectorLast = s.CollectorArray = s.Collector = void 0;
  var t = He;
  Object.defineProperty(s, "Collector", { enumerable: !0, get: function() {
    return t.Collector;
  } });
  var e = En;
  Object.defineProperty(s, "CollectorArray", { enumerable: !0, get: function() {
    return e.CollectorArray;
  } });
  var i = In;
  Object.defineProperty(s, "CollectorLast", { enumerable: !0, get: function() {
    return i.CollectorLast;
  } });
  var n = Bn;
  Object.defineProperty(s, "CollectorUntil0", { enumerable: !0, get: function() {
    return n.CollectorUntil0;
  } });
  var r = Rn;
  Object.defineProperty(s, "CollectorWhile0", { enumerable: !0, get: function() {
    return r.CollectorWhile0;
  } });
  var o = Fn;
  Object.defineProperty(s, "Signal", { enumerable: !0, get: function() {
    return o.Signal;
  } });
  var a = Dn;
  Object.defineProperty(s, "SignalConnections", { enumerable: !0, get: function() {
    return a.SignalConnections;
  } });
})(co);
function Eh(s) {
  return typeof s == "string" ? oe.from(s) : s;
}
var i0 = Object.defineProperty, s0 = (s, t, e) => t in s ? i0(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e, lt = (s, t, e) => (s0(s, typeof t != "symbol" ? t + "" : t, e), e);
class n0 extends Et {
  /**
   * Creates an input.
   * @param { number } options - Options object to use.
   * @param { Sprite | Graphics | string } options.bg - Background of the Input.
   * @param { PixiTextStyle } options.textStyle - Text style of the Input.
   * @param { string } options.placeholder - Placeholder of the Input.
   * @param { string } options.value - Value of the Input.
   * @param { number } options.maxLength - Max length of the Input.
   * @param { 'left' | 'center' | 'right' } options.align - Align of the Input.
   * @param { Padding } options.padding - Padding of the Input.
   * @param { number } options.padding.top - Top padding of the Input.
   * @param { number } options.padding.right - Right padding of the Input.
   * @param { number } options.padding.bottom - Bottom padding of the Input.
   * @param { number } options.padding.left - Left padding of the Input.
   * @param { boolean } options.cleanOnFocus - Clean Input on focus.
   * @param { Array } options.nineSliceSprite - NineSliceSprite values for bg and fill ([number, number, number, number]).
   */
  constructor(t) {
    super(), lt(this, "_bg"), lt(this, "inputMask"), lt(this, "_cursor"), lt(this, "inputField"), lt(this, "placeholder"), lt(this, "editing", !1), lt(this, "tick", 0), lt(this, "lastInputData"), lt(this, "activation", !1), lt(this, "options"), lt(this, "input"), lt(this, "handleActivationBinding", this.handleActivation.bind(this)), lt(this, "onKeyUpBinding", this.onKeyUp.bind(this)), lt(this, "stopEditingBinding", this.stopEditing.bind(this)), lt(this, "onInputBinding", this.onInput.bind(this)), lt(this, "onEnter"), lt(this, "onChange"), lt(this, "paddingTop", 0), lt(this, "paddingRight", 0), lt(this, "paddingBottom", 0), lt(this, "paddingLeft", 0), this.options = t, this.options = t, this.padding = t.padding, this.cursor = "text", this.interactive = !0, this.on("pointertap", () => {
      this.activation = !0, Be.any && this.handleActivation();
    }), Be.any ? window.addEventListener("touchstart", this.handleActivationBinding) : Be.any || (window.addEventListener("click", this.handleActivationBinding), window.addEventListener("keyup", this.onKeyUpBinding), window.addEventListener("input", this.onInputBinding)), this.onEnter = new co.Signal(), this.onChange = new co.Signal(), pe.shared.add((e) => this.update(e.deltaTime)), t.bg ? this.bg = t.bg : console.error("Input: bg is not defined, please define it.");
  }
  onInput(t) {
    this.lastInputData = t.data;
  }
  onKeyUp(t) {
    const e = t.key;
    e === "Backspace" ? this._delete() : e === "Escape" || e === "Enter" ? this.stopEditing() : e.length === 1 ? this._add(e) : this.lastInputData && this.lastInputData.length === 1 && this._add(this.lastInputData);
  }
  init() {
    const t = this.options, e = {
      fill: 0,
      align: "center"
    };
    this.options.textStyle = t.textStyle ?? e, this.options.TextClass = t.TextClass ?? ac;
    const i = { ...e, ...t.textStyle };
    this.inputField = new this.options.TextClass({ text: "", style: i }), this._cursor = new oe(G.WHITE), this._cursor.tint = Number(t.textStyle.fill) || 0, this._cursor.anchor.set(0.5), this._cursor.width = 2, this._cursor.height = this.inputField.height * 0.8, this._cursor.alpha = 0, this.placeholder = new this.options.TextClass({ text: t.placeholder, style: i ?? e }), this.placeholder.visible = !!t.placeholder, this.addChild(this.inputField, this.placeholder, this._cursor), this.value = t.value ?? "", this.align();
  }
  set bg(t) {
    var e, i;
    this._bg && this._bg.destroy(), (e = this.options) != null && e.nineSliceSprite && (typeof t == "string" ? this._bg = new lh({
      texture: G.from(t),
      leftWidth: this.options.nineSliceSprite[0],
      topHeight: this.options.nineSliceSprite[1],
      rightWidth: this.options.nineSliceSprite[2],
      bottomHeight: this.options.nineSliceSprite[3]
    }) : console.warn("NineSliceSprite can not be used with views set as Container.")), this._bg || (this._bg = Eh(t)), this._bg.cursor = "text", this._bg.interactive = !0, this.addChildAt(this._bg, 0), this.inputField || this.init(), this.options.addMask && (this.inputMask && (this.inputField.mask = null, this._cursor.mask = null, this.inputMask.destroy()), (i = this.options) != null && i.nineSliceSprite && typeof t == "string" ? this.inputMask = new lh({
      texture: G.from(t),
      leftWidth: this.options.nineSliceSprite[0],
      topHeight: this.options.nineSliceSprite[1],
      rightWidth: this.options.nineSliceSprite[2],
      bottomHeight: this.options.nineSliceSprite[3]
    }) : t instanceof oe ? this.inputMask = new oe(t.texture) : t instanceof Fe ? this.inputMask = t.clone(!0) : this.inputMask = Eh(t), this.inputField.mask = this.inputMask, this._cursor.mask = this.inputMask, this.addChildAt(this.inputMask, 0));
  }
  get bg() {
    return this._bg;
  }
  _add(t) {
    this.editing && (this.options.maxLength && this.value.length >= this.options.maxLength || (this.value = this.value + t, this.onChange.emit(this.value)));
  }
  _delete() {
    if (!this.editing || this.value.length === 0)
      return;
    const t = this.value.split("");
    t.pop(), this.value = t.join(""), this.onChange.emit(this.value);
  }
  _startEditing() {
    this.options.cleanOnFocus && (this.value = ""), this.tick = 0, this.editing = !0, this.placeholder.visible = !1, this._cursor.alpha = 1, Be.any && this.createInputField(), this.align();
  }
  createInputField() {
    var e, i;
    this.input && (this.input.removeEventListener("blur", this.stopEditingBinding), this.input.removeEventListener("keyup", this.onKeyUpBinding), this.input.removeEventListener("input", this.onInputBinding), (e = this.input) == null || e.blur(), (i = this.input) == null || i.remove(), this.input = null);
    const t = document.createElement("input");
    document.body.appendChild(t), t.style.position = "fixed", t.style.left = `${this.getGlobalPosition().x}px`, t.style.top = `${this.getGlobalPosition().y}px`, t.style.opacity = "0.0000001", t.style.width = `${this._bg.width}px`, t.style.height = `${this._bg.height}px`, t.style.border = "none", t.style.outline = "none", t.style.background = "white", Be.android.device ? setTimeout(() => {
      t.focus(), t.click();
    }, 100) : (t.focus(), t.click()), t.addEventListener("blur", this.stopEditingBinding), t.addEventListener("keyup", this.onKeyUpBinding), t.addEventListener("input", this.onInputBinding), this.input = t, this.align();
  }
  handleActivation() {
    this.stopEditing(), this.activation && (this._startEditing(), this.activation = !1);
  }
  stopEditing() {
    var t, e;
    this.editing && (this._cursor.alpha = 0, this.editing = !1, this.inputField.text === "" && (this.placeholder.visible = !0), this.value.length === 0 && (this.placeholder.visible = !0), Be.any && ((t = this.input) == null || t.blur(), (e = this.input) == null || e.remove(), this.input = null), this.align(), this.onEnter.emit(this.value));
  }
  update(t) {
    this.editing && (this.tick += t * 0.1, this._cursor.alpha = Math.round(Math.sin(this.tick) * 0.5 + 0.5));
  }
  align() {
    if (!this._bg)
      return;
    const t = this.getAlign();
    this.inputField.anchor.set(t, 0.5), this.inputField.x = this._bg.width * t + (t === 1 ? -this.paddingRight : this.paddingLeft), this.inputField.y = this._bg.height / 2 + this.paddingTop - this.paddingBottom, this.placeholder.anchor.set(t, 0.5), this.placeholder.x = this._bg.width * t + (t === 1 ? -this.paddingRight : this.paddingLeft), this.placeholder.y = this._bg.height / 2, this._cursor.x = this.getCursorPosX(), this._cursor.y = this.inputField.y;
  }
  getAlign() {
    const t = this._bg.width * 0.95, e = this.paddingLeft + this.paddingRight - 10;
    if (this.inputField.width + e > t)
      return this.editing ? 1 : 0;
    switch (this.options.align) {
      case "left":
        return 0;
      case "center":
        return 0.5;
      case "right":
        return 1;
      default:
        return 0;
    }
  }
  getCursorPosX() {
    switch (this.getAlign()) {
      case 0:
        return this.inputField.x + this.inputField.width;
      case 0.5:
        return this.inputField.x + this.inputField.width * 0.5;
      case 1:
        return this.inputField.x;
      default:
        return 0;
    }
  }
  /** Sets the input text. */
  set value(t) {
    this.inputField.text = t, t.length !== 0 ? this.placeholder.visible = !1 : this.placeholder.visible = !this.editing, this.align();
  }
  /** Return text of the input. */
  get value() {
    return this.inputField.text;
  }
  /**
   * Set paddings
   * @param value - number, array of 4 numbers or object with keys: top, right, bottom, left
   * or: [top, right, bottom, left]
   * or: [top&bottom, right&left]
   * or: {
   *  left: 10,
   *  right: 10,
   *  top: 10,
   *  bottom: 10,
   * }
   */
  set padding(t) {
    typeof t == "number" && (this.paddingTop = t, this.paddingRight = t, this.paddingBottom = t, this.paddingLeft = t), Array.isArray(t) ? (this.paddingTop = t[0] ?? 0, this.paddingRight = t[1] ?? t[0] ?? 0, this.paddingBottom = t[2] ?? t[0] ?? 0, this.paddingLeft = t[3] ?? t[1] ?? t[0] ?? 0) : typeof t == "object" && (this.paddingTop = t.top ?? 0, this.paddingRight = t.right ?? 0, this.paddingBottom = t.bottom ?? 0, this.paddingLeft = t.left ?? 0);
  }
  // Return array of paddings [top, right, bottom, left]
  get padding() {
    return [this.paddingTop, this.paddingRight, this.paddingBottom, this.paddingLeft];
  }
  destroy(t) {
    this.off("pointertap"), Be.any ? window.removeEventListener("touchstart", this.handleActivationBinding) : Be.any || (window.removeEventListener("click", this.handleActivationBinding), window.removeEventListener("keyup", this.onKeyUpBinding), window.removeEventListener("input", this.onInputBinding)), super.destroy(t);
  }
  /**
   * Sets width of a Input.
   * If nineSliceSprite is set, then width will be set to nineSliceSprite.
   * If nineSliceSprite is not set, then width will control components width as Container.
   * @param width - Width value.
   */
  set width(t) {
    var e;
    (e = this.options) != null && e.nineSliceSprite ? (this._bg && (this._bg.width = t), this.inputMask && (this.inputMask.width = t - this.paddingLeft - this.paddingRight, this.inputMask.x = this.paddingLeft), this.align()) : super.width = t;
  }
  /** Gets width of Input. */
  get width() {
    return super.width;
  }
  /**
   * Sets height of a Input.
   * If nineSliceSprite is set, then height will be set to nineSliceSprite.
   * If nineSliceSprite is not set, then height will control components height as Container.
   * @param height - Height value.
   */
  set height(t) {
    var e;
    (e = this.options) != null && e.nineSliceSprite ? (this._bg && (this._bg.height = t), this.inputMask && (this.inputMask.height = t - this.paddingTop - this.paddingBottom, this.inputMask.y = this.paddingTop), this.align()) : super.height = t;
  }
  /** Gets height of Input. */
  get height() {
    return super.height;
  }
  setSize(t, e) {
    var i;
    (i = this.options) != null && i.nineSliceSprite ? (this._bg && this._bg.setSize(t, e), this.inputMask && (typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e = e ?? t, this.inputMask.setSize(
      t - this.paddingLeft - this.paddingRight,
      e - this.paddingTop - this.paddingBottom
    ), this.inputMask.position.set(this.paddingLeft, this.paddingTop)), this.align()) : super.setSize(t, e);
  }
}
class R0 extends Ts {
  constructor(t) {
    super(
      new n0({
        ...ks(t),
        value: t.text,
        bg: oe.from(Ss(t.background)),
        align: t.align,
        padding: t.padding,
        maxLength: t.maxLength,
        placeholder: t.placeholder,
        textStyle: {
          fontFamily: t.fontFamily,
          fontSize: t.fontSize,
          fill: t.textColor,
          fontWeight: t.fontWeight ?? "normal",
          stroke: t.strokeColor && {
            color: t.strokeColor,
            width: t.strokeWidth
          }
        }
      }),
      t
    );
  }
  get text() {
    return this.object.value;
  }
  set text(t) {
    this.object.value = t;
  }
}
class yu extends U_ {
  constructor(t = "Scene") {
    super({ label: t });
  }
  async init() {
  }
}
class r0 extends yu {
  async init() {
    this.addComponent(
      new lo({
        label: "loading-text",
        text: W.loadingScene.text,
        anchor: { x: 0.5, y: 0.5 },
        fontFamily: W.loadingScene.fontFamily,
        fontSize: W.loadingScene.fontSize,
        textColor: W.loadingScene.textColor,
        horizontalAlignment: "center",
        verticalAlignment: "center"
      })
    );
  }
}
const vu = (s, t, e = 500, i = 1e3) => {
  let n = null, r = !1;
  return { start: () => {
    n != null && clearTimeout(n), n = setTimeout(() => {
      r = !0, n = null, s();
    }, e);
  }, cancel: () => {
    n != null && (clearTimeout(n), n = null), r ? n = setTimeout(() => {
      r = !1, n = null, t();
    }, i) : t();
  } };
}, o0 = (s, t, e, i) => {
  const n = s.clientWidth, r = s.clientHeight;
  if (n < r) {
    const f = e;
    e = i, i = f;
  }
  const o = Math.min(
    n / e,
    r / i
  ), a = Math.floor(o * e), h = Math.floor(o * i), c = (n - a) / 2, l = (r - h) / 2;
  t.style.width = `${a}px`, t.style.height = `${h}px`, t.style.left = `${c}px`, t.style.top = `${l}px`, t.width = e, t.height = i;
  const d = e < i ? "portrait" : "landscape";
  return {
    width: e,
    height: i,
    orientation: d
  };
};
let bu;
function a0(s) {
  return bu = s, s;
}
function As() {
  return bu;
}
class uo {
  /**
   * Dezippering is removed in the future Web Audio API, instead
   * we use the `setValueAtTime` method, however, this is not available
   * in all environments (e.g., Android webview), so we fallback to the `value` setter.
   * @param param - AudioNode parameter object
   * @param value - Value to set
   * @return The value set
   */
  static setParamValue(t, e) {
    if (t.setValueAtTime) {
      const i = As().context;
      t.setValueAtTime(e, i.audioContext.currentTime);
    } else
      t.value = e;
    return e;
  }
}
class h0 extends kt {
  constructor() {
    super(...arguments), this.speed = 1, this.muted = !1, this.volume = 1, this.paused = !1;
  }
  /** Internal trigger when volume, mute or speed changes */
  refresh() {
    this.emit("refresh");
  }
  /** Internal trigger paused changes */
  refreshPaused() {
    this.emit("refreshPaused");
  }
  /**
   * HTML Audio does not support filters, this is non-functional API.
   */
  get filters() {
    return console.warn("HTML Audio does not support filters"), null;
  }
  set filters(t) {
    console.warn("HTML Audio does not support filters");
  }
  /**
   * HTML Audio does not support `audioContext`
   * @readonly
   * @type {AudioContext}
   */
  get audioContext() {
    return console.warn("HTML Audio does not support audioContext"), null;
  }
  /**
   * Toggles the muted state.
   * @return The current muted state.
   */
  toggleMute() {
    return this.muted = !this.muted, this.refresh(), this.muted;
  }
  /**
   * Toggles the paused state.
   * @return The current paused state.
   */
  togglePause() {
    return this.paused = !this.paused, this.refreshPaused(), this.paused;
  }
  /** Destroy and don't use after this */
  destroy() {
    this.removeAllListeners();
  }
}
let l0 = 0;
const fo = class extends kt {
  /** @param parent - Parent element */
  constructor(s) {
    super(), this.id = l0++, this.init(s);
  }
  /**
   * Set a property by name, this makes it easy to chain values
   * @param name - Name of the property to set
   * @param value - Value to set property to
   */
  set(s, t) {
    if (this[s] === void 0)
      throw new Error(`Property with name ${s} does not exist.`);
    switch (s) {
      case "speed":
        this.speed = t;
        break;
      case "volume":
        this.volume = t;
        break;
      case "paused":
        this.paused = t;
        break;
      case "loop":
        this.loop = t;
        break;
      case "muted":
        this.muted = t;
        break;
    }
    return this;
  }
  /** The current playback progress from 0 to 1. */
  get progress() {
    const { currentTime: s } = this._source;
    return s / this._duration;
  }
  /** Pauses the sound. */
  get paused() {
    return this._paused;
  }
  set paused(s) {
    this._paused = s, this.refreshPaused();
  }
  /**
   * Reference: http://stackoverflow.com/a/40370077
   * @private
   */
  _onPlay() {
    this._playing = !0;
  }
  /**
   * Reference: http://stackoverflow.com/a/40370077
   * @private
   */
  _onPause() {
    this._playing = !1;
  }
  /**
   * Initialize the instance.
   * @param {htmlaudio.HTMLAudioMedia} media - Same as constructor
   */
  init(s) {
    this._playing = !1, this._duration = s.source.duration;
    const t = this._source = s.source.cloneNode(!1);
    t.src = s.parent.url, t.onplay = this._onPlay.bind(this), t.onpause = this._onPause.bind(this), s.context.on("refresh", this.refresh, this), s.context.on("refreshPaused", this.refreshPaused, this), this._media = s;
  }
  /**
   * Stop the sound playing
   * @private
   */
  _internalStop() {
    this._source && this._playing && (this._source.onended = null, this._source.pause());
  }
  /** Stop the sound playing */
  stop() {
    this._internalStop(), this._source && this.emit("stop");
  }
  /** Set the instance speed from 0 to 1 */
  get speed() {
    return this._speed;
  }
  set speed(s) {
    this._speed = s, this.refresh();
  }
  /** Get the set the volume for this instance from 0 to 1 */
  get volume() {
    return this._volume;
  }
  set volume(s) {
    this._volume = s, this.refresh();
  }
  /** If the sound instance should loop playback */
  get loop() {
    return this._loop;
  }
  set loop(s) {
    this._loop = s, this.refresh();
  }
  /** `true` if the sound is muted */
  get muted() {
    return this._muted;
  }
  set muted(s) {
    this._muted = s, this.refresh();
  }
  /**
   * HTML Audio does not support filters, this is non-functional API.
   */
  get filters() {
    return console.warn("HTML Audio does not support filters"), null;
  }
  set filters(s) {
    console.warn("HTML Audio does not support filters");
  }
  /** Call whenever the loop, speed or volume changes */
  refresh() {
    const s = this._media.context, t = this._media.parent;
    this._source.loop = this._loop || t.loop;
    const e = s.volume * (s.muted ? 0 : 1), i = t.volume * (t.muted ? 0 : 1), n = this._volume * (this._muted ? 0 : 1);
    this._source.volume = n * e * i, this._source.playbackRate = this._speed * s.speed * t.speed;
  }
  /** Handle changes in paused state, either globally or sound or instance */
  refreshPaused() {
    const s = this._media.context, t = this._media.parent, e = this._paused || t.paused || s.paused;
    e !== this._pausedReal && (this._pausedReal = e, e ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({
      start: this._source.currentTime,
      end: this._end,
      volume: this._volume,
      speed: this._speed,
      loop: this._loop
    })), this.emit("pause", e));
  }
  /** Start playing the sound/ */
  play(s) {
    const { start: t, end: e, speed: i, loop: n, volume: r, muted: o } = s;
    e && console.assert(e > t, "End time is before start time"), this._speed = i, this._volume = r, this._loop = !!n, this._muted = o, this.refresh(), this.loop && e !== null && (console.warn('Looping not support when specifying an "end" time'), this.loop = !1), this._start = t, this._end = e || this._duration, this._start = Math.max(0, this._start - fo.PADDING), this._end = Math.min(this._end + fo.PADDING, this._duration), this._source.onloadedmetadata = () => {
      this._source && (this._source.currentTime = t, this._source.onloadedmetadata = null, this.emit("progress", t / this._duration, this._duration), pe.shared.add(this._onUpdate, this));
    }, this._source.onended = this._onComplete.bind(this), this._source.play(), this.emit("start");
  }
  /**
   * Handle time update on sound.
   * @private
   */
  _onUpdate() {
    this.emit("progress", this.progress, this._duration), this._source.currentTime >= this._end && !this._source.loop && this._onComplete();
  }
  /**
   * Callback when completed.
   * @private
   */
  _onComplete() {
    pe.shared.remove(this._onUpdate, this), this._internalStop(), this.emit("progress", 1, this._duration), this.emit("end", this);
  }
  /** Don't use after this. */
  destroy() {
    pe.shared.remove(this._onUpdate, this), this.removeAllListeners();
    const s = this._source;
    s && (s.onended = null, s.onplay = null, s.onpause = null, this._internalStop()), this._source = null, this._speed = 1, this._volume = 1, this._loop = !1, this._end = null, this._start = 0, this._duration = 0, this._playing = !1, this._pausedReal = !1, this._paused = !1, this._muted = !1, this._media && (this._media.context.off("refresh", this.refresh, this), this._media.context.off("refreshPaused", this.refreshPaused, this), this._media = null);
  }
  /**
   * To string method for instance.
   * @return The string representation of instance.
   */
  toString() {
    return `[HTMLAudioInstance id=${this.id}]`;
  }
};
let wu = fo;
wu.PADDING = 0.1;
class c0 extends kt {
  init(t) {
    this.parent = t, this._source = t.options.source || new Audio(), t.url && (this._source.src = t.url);
  }
  // Implement create
  create() {
    return new wu(this);
  }
  /**
   * If the audio media is playable (ready).
   * @readonly
   */
  get isPlayable() {
    return !!this._source && this._source.readyState === 4;
  }
  /**
   * THe duration of the media in seconds.
   * @readonly
   */
  get duration() {
    return this._source.duration;
  }
  /**
   * Reference to the context.
   * @readonly
   */
  get context() {
    return this.parent.context;
  }
  /** The collection of filters, does not apply to HTML Audio. */
  get filters() {
    return null;
  }
  set filters(t) {
    console.warn("HTML Audio does not support filters");
  }
  // Override the destroy
  destroy() {
    this.removeAllListeners(), this.parent = null, this._source && (this._source.src = "", this._source.load(), this._source = null);
  }
  /**
   * Get the audio source element.
   * @type {HTMLAudioElement}
   * @readonly
   */
  get source() {
    return this._source;
  }
  // Implement the method to being preloading
  load(t) {
    const e = this._source, i = this.parent;
    if (e.readyState === 4) {
      i.isLoaded = !0;
      const h = i.autoPlayStart();
      t && setTimeout(() => {
        t(null, i, h);
      }, 0);
      return;
    }
    if (!i.url) {
      t(new Error("sound.url or sound.source must be set"));
      return;
    }
    e.src = i.url;
    const n = () => {
      a(), i.isLoaded = !0;
      const h = i.autoPlayStart();
      t && t(null, i, h);
    }, r = () => {
      a(), t && t(new Error("Sound loading has been aborted"));
    }, o = () => {
      a();
      const h = `Failed to load audio element (code: ${e.error.code})`;
      t ? t(new Error(h)) : console.error(h);
    }, a = () => {
      e.removeEventListener("canplaythrough", n), e.removeEventListener("load", n), e.removeEventListener("abort", r), e.removeEventListener("error", o);
    };
    e.addEventListener("canplaythrough", n, !1), e.addEventListener("load", n, !1), e.addEventListener("abort", r, !1), e.addEventListener("error", o, !1), e.load();
  }
}
class u0 {
  /**
   * @param parent - The parent sound
   * @param options - Data associated with object.
   */
  constructor(t, e) {
    this.parent = t, Object.assign(this, e), this.duration = this.end - this.start, console.assert(this.duration > 0, "End time must be after start time");
  }
  /**
   * Play the sound sprite.
   * @param {Function} [complete] - Function call when complete
   * @return Sound instance being played.
   */
  play(t) {
    return this.parent.play({
      complete: t,
      speed: this.speed || this.parent.speed,
      end: this.end,
      start: this.start,
      loop: this.loop
    });
  }
  /** Destroy and don't use after this */
  destroy() {
    this.parent = null;
  }
}
const gn = [
  "ogg",
  "oga",
  "opus",
  "m4a",
  "mp3",
  "mpeg",
  "wav",
  "aiff",
  "wma",
  "mid",
  "caf"
], d0 = [
  "audio/mpeg",
  "audio/ogg"
], mn = {};
function f0(s) {
  const t = {
    m4a: "audio/mp4",
    oga: "audio/ogg",
    opus: 'audio/ogg; codecs="opus"',
    caf: 'audio/x-caf; codecs="opus"'
  }, e = document.createElement("audio"), i = {}, n = /^no$/;
  gn.forEach((r) => {
    const o = e.canPlayType(`audio/${r}`).replace(n, ""), a = t[r] ? e.canPlayType(t[r]).replace(n, "") : "";
    i[r] = !!o || !!a;
  }), Object.assign(mn, i);
}
f0();
let p0 = 0;
class g0 extends kt {
  constructor(t) {
    super(), this.id = p0++, this._media = null, this._paused = !1, this._muted = !1, this._elapsed = 0, this.init(t);
  }
  /**
   * Set a property by name, this makes it easy to chain values
   * @param name - Name of the property to set.
   * @param value - Value to set property to.
   */
  set(t, e) {
    if (this[t] === void 0)
      throw new Error(`Property with name ${t} does not exist.`);
    switch (t) {
      case "speed":
        this.speed = e;
        break;
      case "volume":
        this.volume = e;
        break;
      case "muted":
        this.muted = e;
        break;
      case "loop":
        this.loop = e;
        break;
      case "paused":
        this.paused = e;
        break;
    }
    return this;
  }
  /** Stops the instance, don't use after this. */
  stop() {
    this._source && (this._internalStop(), this.emit("stop"));
  }
  /** Set the instance speed from 0 to 1 */
  get speed() {
    return this._speed;
  }
  set speed(t) {
    this._speed = t, this.refresh(), this._update(!0);
  }
  /** Get the set the volume for this instance from 0 to 1 */
  get volume() {
    return this._volume;
  }
  set volume(t) {
    this._volume = t, this.refresh();
  }
  /** `true` if the sound is muted */
  get muted() {
    return this._muted;
  }
  set muted(t) {
    this._muted = t, this.refresh();
  }
  /** If the sound instance should loop playback */
  get loop() {
    return this._loop;
  }
  set loop(t) {
    this._loop = t, this.refresh();
  }
  /** The collection of filters. */
  get filters() {
    return this._filters;
  }
  set filters(t) {
    var e;
    this._filters && ((e = this._filters) == null || e.filter((i) => i).forEach((i) => i.disconnect()), this._filters = null, this._source.connect(this._gain)), this._filters = t != null && t.length ? t.slice(0) : null, this.refresh();
  }
  /** Refresh loop, volume and speed based on changes to parent */
  refresh() {
    if (!this._source)
      return;
    const t = this._media.context, e = this._media.parent;
    this._source.loop = this._loop || e.loop;
    const i = t.volume * (t.muted ? 0 : 1), n = e.volume * (e.muted ? 0 : 1), r = this._volume * (this._muted ? 0 : 1);
    uo.setParamValue(this._gain.gain, r * n * i), uo.setParamValue(this._source.playbackRate, this._speed * e.speed * t.speed), this.applyFilters();
  }
  /** Connect filters nodes to audio context */
  applyFilters() {
    var t;
    if ((t = this._filters) != null && t.length) {
      this._source.disconnect();
      let e = this._source;
      this._filters.forEach((i) => {
        e.connect(i.destination), e = i;
      }), e.connect(this._gain);
    }
  }
  /** Handle changes in paused state, either globally or sound or instance */
  refreshPaused() {
    const t = this._media.context, e = this._media.parent, i = this._paused || e.paused || t.paused;
    i !== this._pausedReal && (this._pausedReal = i, i ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({
      start: this._elapsed % this._duration,
      end: this._end,
      speed: this._speed,
      loop: this._loop,
      volume: this._volume
    })), this.emit("pause", i));
  }
  /**
   * Plays the sound.
   * @param options - Play options.
   */
  play(t) {
    const { start: e, end: i, speed: n, loop: r, volume: o, muted: a, filters: h } = t;
    i && console.assert(i > e, "End time is before start time"), this._paused = !1;
    const { source: c, gain: l } = this._media.nodes.cloneBufferSource();
    this._source = c, this._gain = l, this._speed = n, this._volume = o, this._loop = !!r, this._muted = a, this._filters = h, this.refresh();
    const d = this._source.buffer.duration;
    this._duration = d, this._end = i, this._lastUpdate = this._now(), this._elapsed = e, this._source.onended = this._onComplete.bind(this), this._loop ? (this._source.loopEnd = i, this._source.loopStart = e, this._source.start(0, e)) : i ? this._source.start(0, e, i - e) : this._source.start(0, e), this.emit("start"), this._update(!0), this.enableTicker(!0);
  }
  /** Start the update progress. */
  enableTicker(t) {
    pe.shared.remove(this._updateListener, this), t && pe.shared.add(this._updateListener, this);
  }
  /** The current playback progress from 0 to 1. */
  get progress() {
    return this._progress;
  }
  /** Pauses the sound. */
  get paused() {
    return this._paused;
  }
  set paused(t) {
    this._paused = t, this.refreshPaused();
  }
  /** Don't use after this. */
  destroy() {
    var t;
    this.removeAllListeners(), this._internalStop(), this._gain && (this._gain.disconnect(), this._gain = null), this._media && (this._media.context.events.off("refresh", this.refresh, this), this._media.context.events.off("refreshPaused", this.refreshPaused, this), this._media = null), (t = this._filters) == null || t.forEach((e) => e.disconnect()), this._filters = null, this._end = null, this._speed = 1, this._volume = 1, this._loop = !1, this._elapsed = 0, this._duration = 0, this._paused = !1, this._muted = !1, this._pausedReal = !1;
  }
  /**
   * To string method for instance.
   * @return The string representation of instance.
   */
  toString() {
    return `[WebAudioInstance id=${this.id}]`;
  }
  /**
   * Get the current time in seconds.
   * @return Seconds since start of context
   */
  _now() {
    return this._media.context.audioContext.currentTime;
  }
  /** Callback for update listener */
  _updateListener() {
    this._update();
  }
  /** Internal update the progress. */
  _update(t = !1) {
    if (this._source) {
      const e = this._now(), i = e - this._lastUpdate;
      if (i > 0 || t) {
        const n = this._source.playbackRate.value;
        this._elapsed += i * n, this._lastUpdate = e;
        const r = this._duration;
        let o;
        if (this._source.loopStart) {
          const a = this._source.loopEnd - this._source.loopStart;
          o = (this._source.loopStart + this._elapsed % a) / r;
        } else
          o = this._elapsed % r / r;
        this._progress = o, this.emit("progress", this._progress, r);
      }
    }
  }
  /** Initializes the instance. */
  init(t) {
    this._media = t, t.context.events.on("refresh", this.refresh, this), t.context.events.on("refreshPaused", this.refreshPaused, this);
  }
  /** Stops the instance. */
  _internalStop() {
    if (this._source) {
      this.enableTicker(!1), this._source.onended = null, this._source.stop(0), this._source.disconnect();
      try {
        this._source.buffer = null;
      } catch (t) {
        console.warn("Failed to set AudioBufferSourceNode.buffer to null:", t);
      }
      this._source = null;
    }
  }
  /** Callback when completed. */
  _onComplete() {
    if (this._source) {
      this.enableTicker(!1), this._source.onended = null, this._source.disconnect();
      try {
        this._source.buffer = null;
      } catch (t) {
        console.warn("Failed to set AudioBufferSourceNode.buffer to null:", t);
      }
    }
    this._source = null, this._progress = 1, this.emit("progress", 1, this._duration), this.emit("end", this);
  }
}
class Su {
  /**
   * @param input - The source audio node
   * @param output - The output audio node
   */
  constructor(t, e) {
    this._output = e, this._input = t;
  }
  /** The destination output audio node */
  get destination() {
    return this._input;
  }
  /** The collection of filters. */
  get filters() {
    return this._filters;
  }
  set filters(t) {
    if (this._filters && (this._filters.forEach((e) => {
      e && e.disconnect();
    }), this._filters = null, this._input.connect(this._output)), t && t.length) {
      this._filters = t.slice(0), this._input.disconnect();
      let e = null;
      t.forEach((i) => {
        e === null ? this._input.connect(i.destination) : e.connect(i.destination), e = i;
      }), e.connect(this._output);
    }
  }
  /** Cleans up. */
  destroy() {
    this.filters = null, this._input = null, this._output = null;
  }
}
const Au = class extends Su {
  /**
   * @param context - The audio context.
   */
  constructor(s) {
    const t = s.audioContext, e = t.createBufferSource(), i = t.createGain(), n = t.createAnalyser();
    e.connect(n), n.connect(i), i.connect(s.destination), super(n, i), this.context = s, this.bufferSource = e, this.gain = i, this.analyser = n;
  }
  /**
   * Get the script processor node.
   * @readonly
   */
  get script() {
    return this._script || (this._script = this.context.audioContext.createScriptProcessor(Au.BUFFER_SIZE), this._script.connect(this.context.destination)), this._script;
  }
  /** Cleans up. */
  destroy() {
    super.destroy(), this.bufferSource.disconnect(), this._script && this._script.disconnect(), this.gain.disconnect(), this.analyser.disconnect(), this.bufferSource = null, this._script = null, this.gain = null, this.analyser = null, this.context = null;
  }
  /**
   * Clones the bufferSource. Used just before playing a sound.
   * @returns {SourceClone} The clone AudioBufferSourceNode.
   */
  cloneBufferSource() {
    const s = this.bufferSource, t = this.context.audioContext.createBufferSource();
    t.buffer = s.buffer, uo.setParamValue(t.playbackRate, s.playbackRate.value), t.loop = s.loop;
    const e = this.context.audioContext.createGain();
    return t.connect(e), e.connect(this.destination), { source: t, gain: e };
  }
  /**
   * Get buffer size of `ScriptProcessorNode`.
   * @readonly
   */
  get bufferSize() {
    return this.script.bufferSize;
  }
};
let Cu = Au;
Cu.BUFFER_SIZE = 0;
class m0 {
  /**
   * Re-initialize without constructing.
   * @param parent - - Instance of parent Sound container
   */
  init(t) {
    this.parent = t, this._nodes = new Cu(this.context), this._source = this._nodes.bufferSource, this.source = t.options.source;
  }
  /** Destructor, safer to use `SoundLibrary.remove(alias)` to remove this sound. */
  destroy() {
    this.parent = null, this._nodes.destroy(), this._nodes = null;
    try {
      this._source.buffer = null;
    } catch (t) {
      console.warn("Failed to set AudioBufferSourceNode.buffer to null:", t);
    }
    this._source = null, this.source = null;
  }
  // Implement create
  create() {
    return new g0(this);
  }
  // Implement context
  get context() {
    return this.parent.context;
  }
  // Implement isPlayable
  get isPlayable() {
    return !!this._source && !!this._source.buffer;
  }
  // Implement filters
  get filters() {
    return this._nodes.filters;
  }
  set filters(t) {
    this._nodes.filters = t;
  }
  // Implements duration
  get duration() {
    return console.assert(this.isPlayable, "Sound not yet playable, no duration"), this._source.buffer.duration;
  }
  /** Gets and sets the buffer. */
  get buffer() {
    return this._source.buffer;
  }
  set buffer(t) {
    this._source.buffer = t;
  }
  /** Get the current chained nodes object */
  get nodes() {
    return this._nodes;
  }
  // Implements load
  load(t) {
    this.source ? this._decode(this.source, t) : this.parent.url ? this._loadUrl(t) : t ? t(new Error("sound.url or sound.source must be set")) : console.error("sound.url or sound.source must be set");
  }
  /** Loads a sound using XHMLHttpRequest object. */
  async _loadUrl(t) {
    const e = this.parent.url, i = await ot.get().fetch(e);
    this._decode(await i.arrayBuffer(), t);
  }
  /**
   * Decodes the array buffer.
   * @param arrayBuffer - From load.
   * @param {Function} callback - Callback optional
   */
  _decode(t, e) {
    const i = (n, r) => {
      if (n)
        e && e(n);
      else {
        this.parent.isLoaded = !0, this.buffer = r;
        const o = this.parent.autoPlayStart();
        e && e(null, this.parent, o);
      }
    };
    t instanceof AudioBuffer ? i(null, t) : this.parent.context.decode(t, i);
  }
}
const yi = class {
  /**
   * Create a new sound instance from source.
   * @param source - Either the path or url to the source file.
   *        or the object of options to use.
   * @return Created sound instance.
   */
  static from(s) {
    let t = {};
    typeof s == "string" ? t.url = s : s instanceof ArrayBuffer || s instanceof AudioBuffer || s instanceof HTMLAudioElement ? t.source = s : Array.isArray(s) ? t.url = s : t = s, t = {
      autoPlay: !1,
      singleInstance: !1,
      url: null,
      source: null,
      preload: !1,
      volume: 1,
      speed: 1,
      complete: null,
      loaded: null,
      loop: !1,
      ...t
    }, Object.freeze(t);
    const e = As().useLegacy ? new c0() : new m0();
    return new yi(e, t);
  }
  /**
   * Use `Sound.from`
   * @ignore
   */
  constructor(s, t) {
    this.media = s, this.options = t, this._instances = [], this._sprites = {}, this.media.init(this);
    const e = t.complete;
    this._autoPlayOptions = e ? { complete: e } : null, this.isLoaded = !1, this._preloadQueue = null, this.isPlaying = !1, this.autoPlay = t.autoPlay, this.singleInstance = t.singleInstance, this.preload = t.preload || this.autoPlay, this.url = Array.isArray(t.url) ? this.preferUrl(t.url) : t.url, this.speed = t.speed, this.volume = t.volume, this.loop = t.loop, t.sprites && this.addSprites(t.sprites), this.preload && this._preload(t.loaded);
  }
  /**
   * Internal help for resolving which file to use if there are multiple provide
   * this is especially helpful for working with bundlers (non Assets loading).
   */
  preferUrl(s) {
    const [t] = s.map((e) => ({ url: e, ext: St.extname(e).slice(1) })).filter(({ ext: e }) => mn[e]).sort((e, i) => gn.indexOf(e.ext) - gn.indexOf(i.ext));
    if (!t)
      throw new Error("No supported file type found");
    return t.url;
  }
  /** Instance of the media context. */
  get context() {
    return As().context;
  }
  /** Stops all the instances of this sound from playing. */
  pause() {
    return this.isPlaying = !1, this.paused = !0, this;
  }
  /** Resuming all the instances of this sound from playing */
  resume() {
    return this.isPlaying = this._instances.length > 0, this.paused = !1, this;
  }
  /** Stops all the instances of this sound from playing. */
  get paused() {
    return this._paused;
  }
  set paused(s) {
    this._paused = s, this.refreshPaused();
  }
  /** The playback rate. */
  get speed() {
    return this._speed;
  }
  set speed(s) {
    this._speed = s, this.refresh();
  }
  /** Set the filters. Only supported with WebAudio. */
  get filters() {
    return this.media.filters;
  }
  set filters(s) {
    this.media.filters = s;
  }
  /**
   * @ignore
   */
  addSprites(s, t) {
    if (typeof s == "object") {
      const i = {};
      for (const n in s)
        i[n] = this.addSprites(n, s[n]);
      return i;
    }
    console.assert(!this._sprites[s], `Alias ${s} is already taken`);
    const e = new u0(this, t);
    return this._sprites[s] = e, e;
  }
  /** Destructor, safer to use `SoundLibrary.remove(alias)` to remove this sound. */
  destroy() {
    this._removeInstances(), this.removeSprites(), this.media.destroy(), this.media = null, this._sprites = null, this._instances = null;
  }
  /**
   * Remove a sound sprite.
   * @param alias - The unique name of the sound sprite, if alias is omitted, removes all sprites.
   */
  removeSprites(s) {
    if (s) {
      const t = this._sprites[s];
      t !== void 0 && (t.destroy(), delete this._sprites[s]);
    } else
      for (const t in this._sprites)
        this.removeSprites(t);
    return this;
  }
  /** If the current sound is playable (loaded). */
  get isPlayable() {
    return this.isLoaded && this.media && this.media.isPlayable;
  }
  /** Stops all the instances of this sound from playing. */
  stop() {
    if (!this.isPlayable)
      return this.autoPlay = !1, this._autoPlayOptions = null, this;
    this.isPlaying = !1;
    for (let s = this._instances.length - 1; s >= 0; s--)
      this._instances[s].stop();
    return this;
  }
  // Overloaded function
  play(s, t) {
    let e;
    if (typeof s == "string" ? e = { sprite: s, loop: this.loop, complete: t } : typeof s == "function" ? (e = {}, e.complete = s) : e = s, e = {
      complete: null,
      loaded: null,
      sprite: null,
      end: null,
      start: 0,
      volume: 1,
      speed: 1,
      muted: !1,
      loop: !1,
      ...e || {}
    }, e.sprite) {
      const n = e.sprite;
      console.assert(!!this._sprites[n], `Alias ${n} is not available`);
      const r = this._sprites[n];
      e.start = r.start + (e.start || 0), e.end = r.end, e.speed = r.speed || 1, e.loop = r.loop || e.loop, delete e.sprite;
    }
    if (e.offset && (e.start = e.offset), !this.isLoaded)
      return this._preloadQueue ? new Promise((n) => {
        this._preloadQueue.push(() => {
          n(this.play(e));
        });
      }) : (this._preloadQueue = [], this.autoPlay = !0, this._autoPlayOptions = e, new Promise((n, r) => {
        this._preload((o, a, h) => {
          this._preloadQueue.forEach((c) => c()), this._preloadQueue = null, o ? r(o) : (e.loaded && e.loaded(o, a, h), n(h));
        });
      }));
    (this.singleInstance || e.singleInstance) && this._removeInstances();
    const i = this._createInstance();
    return this._instances.push(i), this.isPlaying = !0, i.once("end", () => {
      e.complete && e.complete(this), this._onComplete(i);
    }), i.once("stop", () => {
      this._onComplete(i);
    }), i.play(e), i;
  }
  /** Internal only, speed, loop, volume change occured. */
  refresh() {
    const s = this._instances.length;
    for (let t = 0; t < s; t++)
      this._instances[t].refresh();
  }
  /** Handle changes in paused state. Internal only. */
  refreshPaused() {
    const s = this._instances.length;
    for (let t = 0; t < s; t++)
      this._instances[t].refreshPaused();
  }
  /** Gets and sets the volume. */
  get volume() {
    return this._volume;
  }
  set volume(s) {
    this._volume = s, this.refresh();
  }
  /** Gets and sets the muted flag. */
  get muted() {
    return this._muted;
  }
  set muted(s) {
    this._muted = s, this.refresh();
  }
  /** Gets and sets the looping. */
  get loop() {
    return this._loop;
  }
  set loop(s) {
    this._loop = s, this.refresh();
  }
  /** Starts the preloading of sound. */
  _preload(s) {
    this.media.load(s);
  }
  /** Gets the list of instances that are currently being played of this sound. */
  get instances() {
    return this._instances;
  }
  /** Get the map of sprites. */
  get sprites() {
    return this._sprites;
  }
  /** Get the duration of the audio in seconds. */
  get duration() {
    return this.media.duration;
  }
  /** Auto play the first instance. */
  autoPlayStart() {
    let s;
    return this.autoPlay && (s = this.play(this._autoPlayOptions)), s;
  }
  /** Removes all instances. */
  _removeInstances() {
    for (let s = this._instances.length - 1; s >= 0; s--)
      this._poolInstance(this._instances[s]);
    this._instances.length = 0;
  }
  /**
   * Sound instance completed.
   * @param instance
   */
  _onComplete(s) {
    if (this._instances) {
      const t = this._instances.indexOf(s);
      t > -1 && this._instances.splice(t, 1), this.isPlaying = this._instances.length > 0;
    }
    this._poolInstance(s);
  }
  /** Create a new instance. */
  _createInstance() {
    if (yi._pool.length > 0) {
      const s = yi._pool.pop();
      return s.init(this.media), s;
    }
    return this.media.create();
  }
  /**
   * Destroy/recycling the instance object.
   * @param instance - Instance to recycle
   */
  _poolInstance(s) {
    s.destroy(), yi._pool.indexOf(s) < 0 && yi._pool.push(s);
  }
};
let _n = yi;
_n._pool = [];
class Cs extends Su {
  constructor() {
    const t = window, e = new Cs.AudioContext(), i = e.createDynamicsCompressor(), n = e.createAnalyser();
    n.connect(i), i.connect(e.destination), super(n, i), this.autoPause = !0, this._ctx = e, this._offlineCtx = new Cs.OfflineAudioContext(
      1,
      2,
      t.OfflineAudioContext ? Math.max(8e3, Math.min(96e3, e.sampleRate)) : 44100
    ), this.compressor = i, this.analyser = n, this.events = new kt(), this.volume = 1, this.speed = 1, this.muted = !1, this.paused = !1, this._locked = e.state === "suspended" && ("ontouchstart" in globalThis || "onclick" in globalThis), this._locked && (this._unlock(), this._unlock = this._unlock.bind(this), document.addEventListener("mousedown", this._unlock, !0), document.addEventListener("touchstart", this._unlock, !0), document.addEventListener("touchend", this._unlock, !0)), this.onFocus = this.onFocus.bind(this), this.onBlur = this.onBlur.bind(this), globalThis.addEventListener("focus", this.onFocus), globalThis.addEventListener("blur", this.onBlur);
  }
  /** Handle mobile WebAudio context resume */
  onFocus() {
    if (!this.autoPause)
      return;
    const t = this._ctx.state;
    (t === "suspended" || t === "interrupted" || !this._locked) && (this.paused = this._pausedOnBlur, this.refreshPaused());
  }
  /** Handle mobile WebAudio context suspend */
  onBlur() {
    this.autoPause && (this._locked || (this._pausedOnBlur = this._paused, this.paused = !0, this.refreshPaused()));
  }
  /**
   * Try to unlock audio on iOS. This is triggered from either WebAudio plugin setup (which will work if inside of
   * a `mousedown` or `touchend` event stack), or the first document touchend/mousedown event. If it fails (touchend
   * will fail if the user presses for too long, indicating a scroll event instead of a click event.
   *
   * Note that earlier versions of iOS supported `touchstart` for this, but iOS9 removed this functionality. Adding
   * a `touchstart` event to support older platforms may preclude a `mousedown` even from getting fired on iOS9, so we
   * stick with `mousedown` and `touchend`.
   */
  _unlock() {
    this._locked && (this.playEmptySound(), this._ctx.state === "running" && (document.removeEventListener("mousedown", this._unlock, !0), document.removeEventListener("touchend", this._unlock, !0), document.removeEventListener("touchstart", this._unlock, !0), this._locked = !1));
  }
  /**
   * Plays an empty sound in the web audio context.  This is used to enable web audio on iOS devices, as they
   * require the first sound to be played inside of a user initiated event (touch/click).
   */
  playEmptySound() {
    const t = this._ctx.createBufferSource();
    t.buffer = this._ctx.createBuffer(1, 1, 22050), t.connect(this._ctx.destination), t.start(0, 0, 0), t.context.state === "suspended" && t.context.resume();
  }
  /**
   * Get AudioContext class, if not supported returns `null`
   * @type {AudioContext}
   * @readonly
   */
  static get AudioContext() {
    const t = window;
    return t.AudioContext || t.webkitAudioContext || null;
  }
  /**
   * Get OfflineAudioContext class, if not supported returns `null`
   * @type {OfflineAudioContext}
   * @readonly
   */
  static get OfflineAudioContext() {
    const t = window;
    return t.OfflineAudioContext || t.webkitOfflineAudioContext || null;
  }
  /** Destroy this context. */
  destroy() {
    super.destroy();
    const t = this._ctx;
    typeof t.close < "u" && t.close(), globalThis.removeEventListener("focus", this.onFocus), globalThis.removeEventListener("blur", this.onBlur), this.events.removeAllListeners(), this.analyser.disconnect(), this.compressor.disconnect(), this.analyser = null, this.compressor = null, this.events = null, this._offlineCtx = null, this._ctx = null;
  }
  /**
   * The WebAudio API AudioContext object.
   * @readonly
   * @type {AudioContext}
   */
  get audioContext() {
    return this._ctx;
  }
  /**
   * The WebAudio API OfflineAudioContext object.
   * @readonly
   * @type {OfflineAudioContext}
   */
  get offlineContext() {
    return this._offlineCtx;
  }
  /**
   * Pauses all sounds, even though we handle this at the instance
   * level, we'll also pause the audioContext so that the
   * time used to compute progress isn't messed up.
   * @default false
   */
  set paused(t) {
    t && this._ctx.state === "running" ? this._ctx.suspend() : !t && this._ctx.state === "suspended" && this._ctx.resume(), this._paused = t;
  }
  get paused() {
    return this._paused;
  }
  /** Emit event when muted, volume or speed changes */
  refresh() {
    this.events.emit("refresh");
  }
  /** Emit event when muted, volume or speed changes */
  refreshPaused() {
    this.events.emit("refreshPaused");
  }
  /**
   * Toggles the muted state.
   * @return The current muted state.
   */
  toggleMute() {
    return this.muted = !this.muted, this.refresh(), this.muted;
  }
  /**
   * Toggles the paused state.
   * @return The current muted state.
   */
  togglePause() {
    return this.paused = !this.paused, this.refreshPaused(), this._paused;
  }
  /**
   * Decode the audio data
   * @param arrayBuffer - Buffer from loader
   * @param callback - When completed, error and audioBuffer are parameters.
   */
  decode(t, e) {
    const i = (r) => {
      e(new Error((r == null ? void 0 : r.message) || "Unable to decode file"));
    }, n = this._offlineCtx.decodeAudioData(
      t,
      (r) => {
        e(null, r);
      },
      i
    );
    n && n.catch(i);
  }
}
class _0 {
  constructor() {
    this.init();
  }
  /**
   * Re-initialize the sound library, this will
   * recreate the AudioContext. If there's a hardware-failure
   * call `close` and then `init`.
   * @return Sound instance
   */
  init() {
    return this.supported && (this._webAudioContext = new Cs()), this._htmlAudioContext = new h0(), this._sounds = {}, this.useLegacy = !this.supported, this;
  }
  /**
   * The global context to use.
   * @readonly
   */
  get context() {
    return this._context;
  }
  /**
   * Apply filters to all sounds. Can be useful
   * for setting global planning or global effects.
   * **Only supported with WebAudio.**
   * @example
   * import { sound, filters } from '@pixi/sound';
   * // Adds a filter to pan all output left
   * sound.filtersAll = [
   *     new filters.StereoFilter(-1)
   * ];
   */
  get filtersAll() {
    return this.useLegacy ? [] : this._context.filters;
  }
  set filtersAll(t) {
    this.useLegacy || (this._context.filters = t);
  }
  /**
   * `true` if WebAudio is supported on the current browser.
   */
  get supported() {
    return Cs.AudioContext !== null;
  }
  /**
   * @ignore
   */
  add(t, e) {
    if (typeof t == "object") {
      const r = {};
      for (const o in t) {
        const a = this._getOptions(
          t[o],
          e
        );
        r[o] = this.add(o, a);
      }
      return r;
    }
    if (console.assert(!this._sounds[t], `Sound with alias ${t} already exists.`), e instanceof _n)
      return this._sounds[t] = e, e;
    const i = this._getOptions(e), n = _n.from(i);
    return this._sounds[t] = n, n;
  }
  /**
   * Internal methods for getting the options object
   * @private
   * @param source - The source options
   * @param overrides - Override default options
   * @return The construction options
   */
  _getOptions(t, e) {
    let i;
    return typeof t == "string" ? i = { url: t } : Array.isArray(t) ? i = { url: t } : t instanceof ArrayBuffer || t instanceof AudioBuffer || t instanceof HTMLAudioElement ? i = { source: t } : i = t, i = { ...i, ...e || {} }, i;
  }
  /**
   * Do not use WebAudio, force the use of legacy. This **must** be called before loading any files.
   */
  get useLegacy() {
    return this._useLegacy;
  }
  set useLegacy(t) {
    this._useLegacy = t, this._context = !t && this.supported ? this._webAudioContext : this._htmlAudioContext;
  }
  /**
   * This disables auto-pause all playback when the window blurs (WebAudio only).
   * This is helpful to keep from playing sounds when the user switches tabs.
   * However, if you're running content within an iframe, this may be undesirable
   * and you should disable (set to `true`) this behavior.
   * @default false
   */
  get disableAutoPause() {
    return !this._webAudioContext.autoPause;
  }
  set disableAutoPause(t) {
    this._webAudioContext.autoPause = !t;
  }
  /**
   * Removes a sound by alias.
   * @param alias - The sound alias reference.
   * @return Instance for chaining.
   */
  remove(t) {
    return this.exists(t, !0), this._sounds[t].destroy(), delete this._sounds[t], this;
  }
  /**
   * Set the global volume for all sounds. To set per-sound volume see {@link SoundLibrary#volume}.
   */
  get volumeAll() {
    return this._context.volume;
  }
  set volumeAll(t) {
    this._context.volume = t, this._context.refresh();
  }
  /**
   * Set the global speed for all sounds. To set per-sound speed see {@link SoundLibrary#speed}.
   */
  get speedAll() {
    return this._context.speed;
  }
  set speedAll(t) {
    this._context.speed = t, this._context.refresh();
  }
  /**
   * Toggle paused property for all sounds.
   * @return `true` if all sounds are paused.
   */
  togglePauseAll() {
    return this._context.togglePause();
  }
  /**
   * Pauses any playing sounds.
   * @return Instance for chaining.
   */
  pauseAll() {
    return this._context.paused = !0, this._context.refreshPaused(), this;
  }
  /**
   * Resumes any sounds.
   * @return Instance for chaining.
   */
  resumeAll() {
    return this._context.paused = !1, this._context.refreshPaused(), this;
  }
  /**
   * Toggle muted property for all sounds.
   * @return `true` if all sounds are muted.
   */
  toggleMuteAll() {
    return this._context.toggleMute();
  }
  /**
   * Mutes all playing sounds.
   * @return Instance for chaining.
   */
  muteAll() {
    return this._context.muted = !0, this._context.refresh(), this;
  }
  /**
   * Unmutes all playing sounds.
   * @return Instance for chaining.
   */
  unmuteAll() {
    return this._context.muted = !1, this._context.refresh(), this;
  }
  /**
   * Stops and removes all sounds. They cannot be used after this.
   * @return Instance for chaining.
   */
  removeAll() {
    for (const t in this._sounds)
      this._sounds[t].destroy(), delete this._sounds[t];
    return this;
  }
  /**
   * Stops all sounds.
   * @return Instance for chaining.
   */
  stopAll() {
    for (const t in this._sounds)
      this._sounds[t].stop();
    return this;
  }
  /**
   * Checks if a sound by alias exists.
   * @param alias - Check for alias.
   * @param assert - Whether enable console.assert.
   * @return true if the sound exists.
   */
  exists(t, e = !1) {
    const i = !!this._sounds[t];
    return e && console.assert(i, `No sound matching alias '${t}'.`), i;
  }
  /**
   * Convenience function to check to see if any sound is playing.
   * @returns `true` if any sound is currently playing.
   */
  isPlaying() {
    for (const t in this._sounds)
      if (this._sounds[t].isPlaying)
        return !0;
    return !1;
  }
  /**
   * Find a sound by alias.
   * @param alias - The sound alias reference.
   * @return Sound object.
   */
  find(t) {
    return this.exists(t, !0), this._sounds[t];
  }
  /**
   * Plays a sound.
   * @method play
   * @instance
   * @param {string} alias - The sound alias reference.
   * @param {string} sprite - The alias of the sprite to play.
   * @return {IMediaInstance|null} The sound instance, this cannot be reused
   *         after it is done playing. Returns `null` if the sound has not yet loaded.
   */
  /**
   * Plays a sound.
   * @param alias - The sound alias reference.
   * @param {PlayOptions|Function} options - The options or callback when done.
   * @return The sound instance,
   *        this cannot be reused after it is done playing. Returns a Promise if the sound
   *        has not yet loaded.
   */
  play(t, e) {
    return this.find(t).play(e);
  }
  /**
   * Stops a sound.
   * @param alias - The sound alias reference.
   * @return Sound object.
   */
  stop(t) {
    return this.find(t).stop();
  }
  /**
   * Pauses a sound.
   * @param alias - The sound alias reference.
   * @return Sound object.
   */
  pause(t) {
    return this.find(t).pause();
  }
  /**
   * Resumes a sound.
   * @param alias - The sound alias reference.
   * @return Instance for chaining.
   */
  resume(t) {
    return this.find(t).resume();
  }
  /**
   * Get or set the volume for a sound.
   * @param alias - The sound alias reference.
   * @param volume - Optional current volume to set.
   * @return The current volume.
   */
  volume(t, e) {
    const i = this.find(t);
    return e !== void 0 && (i.volume = e), i.volume;
  }
  /**
   * Get or set the speed for a sound.
   * @param alias - The sound alias reference.
   * @param speed - Optional current speed to set.
   * @return The current speed.
   */
  speed(t, e) {
    const i = this.find(t);
    return e !== void 0 && (i.speed = e), i.speed;
  }
  /**
   * Get the length of a sound in seconds.
   * @param alias - The sound alias reference.
   * @return The current duration in seconds.
   */
  duration(t) {
    return this.find(t).duration;
  }
  /**
   * Closes the sound library. This will release/destroy
   * the AudioContext(s). Can be used safely if you want to
   * initialize the sound library later. Use `init` method.
   */
  close() {
    return this.removeAll(), this._sounds = null, this._webAudioContext && (this._webAudioContext.destroy(), this._webAudioContext = null), this._htmlAudioContext && (this._htmlAudioContext.destroy(), this._htmlAudioContext = null), this._context = null, this;
  }
}
const Ih = (s) => {
  var i;
  const t = s.src;
  let e = (i = s == null ? void 0 : s.alias) == null ? void 0 : i[0];
  return (!e || s.src === e) && (e = St.basename(t, St.extname(t))), e;
}, x0 = {
  extension: D.Asset,
  detection: {
    test: async () => !0,
    add: async (s) => [...s, ...gn.filter((t) => mn[t])],
    remove: async (s) => s.filter((t) => s.includes(t))
  },
  loader: {
    name: "sound",
    extension: {
      type: [D.LoadParser],
      priority: Ie.High
    },
    /** Should we attempt to load this file? */
    test(s) {
      const t = St.extname(s).slice(1);
      return !!mn[t] || d0.some((e) => s.startsWith(`data:${e}`));
    },
    /** Load the sound file, this is mostly handled by Sound.from() */
    async load(s, t) {
      const e = await new Promise((i, n) => _n.from({
        ...t.data,
        url: s,
        preload: !0,
        loaded(r, o) {
          var a, h;
          r ? n(r) : i(o), (h = (a = t.data) == null ? void 0 : a.loaded) == null || h.call(a, r, o);
        }
      }));
      return As().add(Ih(t), e), e;
    },
    /** Remove the sound from the library */
    async unload(s, t) {
      As().remove(Ih(t));
    }
  }
};
Pt.add(x0);
a0(new _0());
class y0 extends yu {
  constructor() {
    super("Pause"), this.visible = !1, this.zIndex = 1e3;
  }
  async init() {
    this.addComponent(
      new _u({
        label: "overlay",
        resource: {
          fillColor: W.pauseScene.overlayColor,
          rectangle: {
            x: 0,
            y: 0,
            width: W.screen.width,
            height: W.screen.width
          }
        },
        alpha: W.pauseScene.overlayAlpha
      })
    ), this.addComponent(
      new lo({
        label: "title",
        text: W.pauseScene.title,
        fontFamily: W.pauseScene.fontFamily,
        fontSize: W.pauseScene.titleFontSize,
        textColor: W.pauseScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: "center",
        verticalAlignment: "center",
        margin: { x: 0, y: -50 }
      })
    ), this.addComponent(
      new lo({
        label: "subtitle",
        text: W.pauseScene.subTitle,
        fontFamily: W.pauseScene.fontFamily,
        fontSize: W.pauseScene.subTitleFontSize,
        textColor: W.pauseScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: "center",
        verticalAlignment: "center",
        margin: { x: 0, y: 50 }
      })
    );
  }
}
let It, ss = !1, cs;
const Pu = () => W.screen.width * 1 / W.screen.aspectRatio, Bh = () => {
  const { width: s, height: t, orientation: e } = o0(
    W.gameContainer,
    It.canvas,
    W.screen.width,
    Pu()
  );
  (s !== Y.screen.width || t !== Y.screen.height) && (Y.screen.width = s, Y.screen.height = t, It.renderer.resize(s, t), an(W.signals.onResize));
  const i = Y.screen.orientation !== e;
  Y.screen.orientation = e, i && an(W.signals.onOrientationChange);
}, v0 = () => {
  const { start: s } = vu(
    () => {
      Bh();
    },
    () => {
    },
    100
  );
  new ResizeObserver(() => {
    s();
  }).observe(W.gameContainer), Bh();
}, b0 = () => {
  let s = 0, t = 0, e = 0;
  W.debug && setInterval(() => {
    console.log(
      t === 0 ? 0 : Math.floor(e / t)
    ), t = 0, e = 0;
  }, 1e3), It.ticker.maxFPS = W.maxFPS, It.ticker.add((i) => {
    if (W.debug && (e += Math.floor(i.FPS), t++), !ss)
      for (s += i.deltaMS; s >= W.tickIntervalMillis; )
        an(W.signals.onTick), Vi.updateEngine(W.tickIntervalMillis), k_(W.tickIntervalMillis), s -= W.tickIntervalMillis;
  });
}, w0 = () => {
  let s = !1;
  const { start: t, cancel: e } = vu(
    () => {
      It.stage.eventMode = "passive";
    },
    () => {
    },
    100,
    0
  ), i = () => {
    ss && (ss = !1, cs.visible = !1, O_(), t());
  }, n = () => {
    ss || !s || (ss = !0, cs.visible = !0, It.stage.eventMode = "none", L_(), e());
  };
  window.addEventListener(
    "focus",
    () => {
      s = !0;
    },
    { once: !0 }
  ), document.addEventListener("click", () => {
    s = !0, i();
  }), window.addEventListener("blur", () => {
    n();
  }), document.addEventListener("visibilitychange", () => {
    document.hidden && n();
  });
}, S0 = async (s) => {
  Y.scene && (Y.scene.destroy(), It.stage.removeChild(Y.scene.object)), Y.scene = s, It.stage.addChild(Y.scene.object), await s.init();
}, F0 = async () => {
  W.gameContainer.style.backgroundColor = W.colors.backgroundColor, It = new Pl(), await It.init({
    backgroundColor: W.colors.backgroundColor,
    width: W.screen.width,
    height: Pu()
  }), W.debug && (globalThis.__PIXI_APP__ = It), W.gameContainer.appendChild(It.canvas), It.canvas.style.position = "absolute", D_(It.renderer), cs = new y0(), await cs.init(), It.stage.addChild(cs.object), S0(new r0()), v0(), T_(), Vi.initEngine(), b0(), w0(), await Promise.all([
    new Promise(
      (s) => setTimeout(s, W.loadingScene.keepAliveTimeMS)
    ),
    (async () => {
      await ge.init({
        basePath: W.assets.basePath,
        manifest: W.assets.manifest
      }), ge.addBundle("extra", W.assets.extra), await Promise.all([
        ge.loadBundle("default"),
        ge.loadBundle("extra")
      ]), B_();
    })()
  ]), an(W.signals.destroyLoadingScene);
}, L0 = (s, t) => Math.floor(Math.random() * (t - s) + s);
export {
  Mo as $,
  wl as A,
  ft as B,
  Et as C,
  ot as D,
  D as E,
  Pe as F,
  yn as G,
  Nh as H,
  xe as I,
  la as J,
  oe as K,
  Wd as L,
  j as M,
  Kd as N,
  xt as O,
  Ct as P,
  pt as Q,
  Br as R,
  Ff as S,
  ve as T,
  Tr as U,
  pf as V,
  ua as W,
  _d as X,
  Xn as Y,
  gt as Z,
  $h as _,
  G as a,
  L0 as a$,
  Sl as a0,
  H as a1,
  $ as a2,
  yf as a3,
  Fl as a4,
  np as a5,
  op as a6,
  up as a7,
  fp as a8,
  pp as a9,
  lo as aA,
  G_ as aB,
  W_ as aC,
  B0 as aD,
  R0 as aE,
  T_ as aF,
  k_ as aG,
  P0 as aH,
  E_ as aI,
  I_ as aJ,
  M0 as aK,
  yu as aL,
  r0 as aM,
  Vi as aN,
  S0 as aO,
  F0 as aP,
  fm as aQ,
  ch as aR,
  an as aS,
  B_ as aT,
  gu as aU,
  T0 as aV,
  R_ as aW,
  k0 as aX,
  F_ as aY,
  L_ as aZ,
  O_ as a_,
  Ii as aa,
  hi as ab,
  ng as ac,
  Wl as ad,
  Ra as ae,
  Ia as af,
  Nu as ag,
  mi as ah,
  om as ai,
  $r as aj,
  cg as ak,
  Fe as al,
  st as am,
  $u as an,
  Hr as ao,
  Nr as ap,
  eh as aq,
  Vl as ar,
  W as as,
  Y as at,
  Ts as au,
  xu as av,
  U_ as aw,
  E0 as ax,
  I0 as ay,
  _u as az,
  pe as b,
  vu as b0,
  kt as c,
  ze as d,
  Pt as e,
  Ba as f,
  If as g,
  Ks as h,
  Be as i,
  _o as j,
  yl as k,
  el as l,
  gl as m,
  Zo as n,
  th as o,
  sp as p,
  rp as q,
  sd as r,
  lp as s,
  kl as t,
  dp as u,
  xo as v,
  ut as w,
  ul as x,
  Hu as y,
  mp as z
};
