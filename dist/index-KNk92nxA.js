var Uc = Object.defineProperty;
var Gc = (s, t, e) => t in s ? Uc(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var Gt = (s, t, e) => Gc(s, typeof t != "symbol" ? t + "" : t, e);
const G = {
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
}, j = {
  screen: {
    orientation: "landscape",
    width: 0,
    height: 0
  },
  scene: null,
  muted: localStorage.getItem("muted") === "true"
};
var D = /* @__PURE__ */ ((s) => (s.Application = "application", s.WebGLPipes = "webgl-pipes", s.WebGLPipesAdaptor = "webgl-pipes-adaptor", s.WebGLSystem = "webgl-system", s.WebGPUPipes = "webgpu-pipes", s.WebGPUPipesAdaptor = "webgpu-pipes-adaptor", s.WebGPUSystem = "webgpu-system", s.CanvasSystem = "canvas-system", s.CanvasPipesAdaptor = "canvas-pipes-adaptor", s.CanvasPipes = "canvas-pipes", s.Asset = "asset", s.LoadParser = "load-parser", s.ResolveParser = "resolve-parser", s.CacheParser = "cache-parser", s.DetectionParser = "detection-parser", s.MaskEffect = "mask-effect", s.BlendMode = "blend-mode", s.TextureSource = "texture-source", s.Environment = "environment", s.ShapeBuilder = "shape-builder", s.Batcher = "batcher", s))(D || {});
const rr = (s) => {
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
}, Ss = (s, t) => rr(s).priority ?? t, At = {
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
    return s.map(rr).forEach((t) => {
      t.type.forEach((e) => {
        var i, r;
        return (r = (i = this._removeHandlers)[e]) == null ? void 0 : r.call(i, t);
      });
    }), this;
  },
  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {extensions} For chaining.
   */
  add(...s) {
    return s.map(rr).forEach((t) => {
      t.type.forEach((e) => {
        var n, o;
        const i = this._addHandlers, r = this._queue;
        i[e] ? (o = i[e]) == null || o.call(i, t) : (r[e] = r[e] || [], (n = r[e]) == null || n.push(t));
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
    const i = this._addHandlers, r = this._removeHandlers;
    if (i[s] || r[s])
      throw new Error(`Extension type ${s} already has a handler`);
    i[s] = t, r[s] = e;
    const n = this._queue;
    return n[s] && ((o = n[s]) == null || o.forEach((a) => t(a)), delete n[s]), this;
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
        t.findIndex((n) => n.name === i.name) >= 0 || (t.push({ name: i.name, value: i.ref }), t.sort((n, o) => Ss(o.value, e) - Ss(n.value, e)));
      },
      (i) => {
        const r = t.findIndex((n) => n.name === i.name);
        r !== -1 && t.splice(r, 1);
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
        t.includes(i.ref) || (t.push(i.ref), t.sort((r, n) => Ss(n, e) - Ss(r, e)));
      },
      (i) => {
        const r = t.indexOf(i.ref);
        r !== -1 && t.splice(r, 1);
      }
    );
  }
}, Vc = {
  extension: {
    type: D.Environment,
    name: "browser",
    priority: -1
  },
  test: () => !0,
  load: async () => {
    await import("./browserAll-DDKkbAAi.js");
  }
}, Wc = {
  extension: {
    type: D.Environment,
    name: "webworker",
    priority: 0
  },
  test: () => typeof self < "u" && self.WorkerGlobalScope !== void 0,
  load: async () => {
    await import("./webworkerAll-Doq_4cWL.js");
  }
};
class mt {
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
    return new mt(t ?? this._observer, this._x, this._y);
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
var Ye = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Kr(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var tl = { exports: {} };
(function(s) {
  var t = Object.prototype.hasOwnProperty, e = "~";
  function i() {
  }
  Object.create && (i.prototype = /* @__PURE__ */ Object.create(null), new i().__proto__ || (e = !1));
  function r(l, c, h) {
    this.fn = l, this.context = c, this.once = h || !1;
  }
  function n(l, c, h, f, d) {
    if (typeof h != "function")
      throw new TypeError("The listener must be a function");
    var u = new r(h, f || l, d), m = e ? e + c : c;
    return l._events[m] ? l._events[m].fn ? l._events[m] = [l._events[m], u] : l._events[m].push(u) : (l._events[m] = u, l._eventsCount++), l;
  }
  function o(l, c) {
    --l._eventsCount === 0 ? l._events = new i() : delete l._events[c];
  }
  function a() {
    this._events = new i(), this._eventsCount = 0;
  }
  a.prototype.eventNames = function() {
    var c = [], h, f;
    if (this._eventsCount === 0) return c;
    for (f in h = this._events)
      t.call(h, f) && c.push(e ? f.slice(1) : f);
    return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(h)) : c;
  }, a.prototype.listeners = function(c) {
    var h = e ? e + c : c, f = this._events[h];
    if (!f) return [];
    if (f.fn) return [f.fn];
    for (var d = 0, u = f.length, m = new Array(u); d < u; d++)
      m[d] = f[d].fn;
    return m;
  }, a.prototype.listenerCount = function(c) {
    var h = e ? e + c : c, f = this._events[h];
    return f ? f.fn ? 1 : f.length : 0;
  }, a.prototype.emit = function(c, h, f, d, u, m) {
    var p = e ? e + c : c;
    if (!this._events[p]) return !1;
    var g = this._events[p], x = arguments.length, y, v;
    if (g.fn) {
      switch (g.once && this.removeListener(c, g.fn, void 0, !0), x) {
        case 1:
          return g.fn.call(g.context), !0;
        case 2:
          return g.fn.call(g.context, h), !0;
        case 3:
          return g.fn.call(g.context, h, f), !0;
        case 4:
          return g.fn.call(g.context, h, f, d), !0;
        case 5:
          return g.fn.call(g.context, h, f, d, u), !0;
        case 6:
          return g.fn.call(g.context, h, f, d, u, m), !0;
      }
      for (v = 1, y = new Array(x - 1); v < x; v++)
        y[v - 1] = arguments[v];
      g.fn.apply(g.context, y);
    } else {
      var w = g.length, _;
      for (v = 0; v < w; v++)
        switch (g[v].once && this.removeListener(c, g[v].fn, void 0, !0), x) {
          case 1:
            g[v].fn.call(g[v].context);
            break;
          case 2:
            g[v].fn.call(g[v].context, h);
            break;
          case 3:
            g[v].fn.call(g[v].context, h, f);
            break;
          case 4:
            g[v].fn.call(g[v].context, h, f, d);
            break;
          default:
            if (!y) for (_ = 1, y = new Array(x - 1); _ < x; _++)
              y[_ - 1] = arguments[_];
            g[v].fn.apply(g[v].context, y);
        }
    }
    return !0;
  }, a.prototype.on = function(c, h, f) {
    return n(this, c, h, f, !1);
  }, a.prototype.once = function(c, h, f) {
    return n(this, c, h, f, !0);
  }, a.prototype.removeListener = function(c, h, f, d) {
    var u = e ? e + c : c;
    if (!this._events[u]) return this;
    if (!h)
      return o(this, u), this;
    var m = this._events[u];
    if (m.fn)
      m.fn === h && (!d || m.once) && (!f || m.context === f) && o(this, u);
    else {
      for (var p = 0, g = [], x = m.length; p < x; p++)
        (m[p].fn !== h || d && !m[p].once || f && m[p].context !== f) && g.push(m[p]);
      g.length ? this._events[u] = g.length === 1 ? g[0] : g : o(this, u);
    }
    return this;
  }, a.prototype.removeAllListeners = function(c) {
    var h;
    return c ? (h = e ? e + c : c, this._events[h] && o(this, h)) : (this._events = new i(), this._eventsCount = 0), this;
  }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = e, a.EventEmitter = a, s.exports = a;
})(tl);
var Nc = tl.exports;
const Mt = /* @__PURE__ */ Kr(Nc), Hc = Math.PI * 2, $c = 180 / Math.PI, Yc = Math.PI / 180;
class St {
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
    return new St(this.x, this.y);
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
    return Sn.x = 0, Sn.y = 0, Sn;
  }
}
const Sn = new St();
class H {
  /**
   * @param a - x scale
   * @param b - y skew
   * @param c - x skew
   * @param d - y scale
   * @param tx - x translation
   * @param ty - y translation
   */
  constructor(t = 1, e = 0, i = 0, r = 1, n = 0, o = 0) {
    this.array = null, this.a = t, this.b = e, this.c = i, this.d = r, this.tx = n, this.ty = o;
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
  set(t, e, i, r, n, o) {
    return this.a = t, this.b = e, this.c = i, this.d = r, this.tx = n, this.ty = o, this;
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
    e = e || new St();
    const i = t.x, r = t.y;
    return e.x = this.a * i + this.c * r + this.tx, e.y = this.b * i + this.d * r + this.ty, e;
  }
  /**
   * Get a new position with the inverse of the current transformation applied.
   * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
   * @param pos - The origin
   * @param {Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
   * @returns {Point} The new point, inverse-transformed through this matrix
   */
  applyInverse(t, e) {
    e = e || new St();
    const i = this.a, r = this.b, n = this.c, o = this.d, a = this.tx, l = this.ty, c = 1 / (i * o + n * -r), h = t.x, f = t.y;
    return e.x = o * c * h + -n * c * f + (l * n - a * o) * c, e.y = i * c * f + -r * c * h + (-l * i + a * r) * c, e;
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
    const e = Math.cos(t), i = Math.sin(t), r = this.a, n = this.c, o = this.tx;
    return this.a = r * e - this.b * i, this.b = r * i + this.b * e, this.c = n * e - this.d * i, this.d = n * i + this.d * e, this.tx = o * e - this.ty * i, this.ty = o * i + this.ty * e, this;
  }
  /**
   * Appends the given Matrix to this Matrix.
   * @param matrix - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  append(t) {
    const e = this.a, i = this.b, r = this.c, n = this.d;
    return this.a = t.a * e + t.b * r, this.b = t.a * i + t.b * n, this.c = t.c * e + t.d * r, this.d = t.c * i + t.d * n, this.tx = t.tx * e + t.ty * r + this.tx, this.ty = t.tx * i + t.ty * n + this.ty, this;
  }
  /**
   * Appends two matrix's and sets the result to this matrix. AB = A * B
   * @param a - The matrix to append.
   * @param b - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  appendFrom(t, e) {
    const i = t.a, r = t.b, n = t.c, o = t.d, a = t.tx, l = t.ty, c = e.a, h = e.b, f = e.c, d = e.d;
    return this.a = i * c + r * f, this.b = i * h + r * d, this.c = n * c + o * f, this.d = n * h + o * d, this.tx = a * c + l * f + e.tx, this.ty = a * h + l * d + e.ty, this;
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
  setTransform(t, e, i, r, n, o, a, l, c) {
    return this.a = Math.cos(a + c) * n, this.b = Math.sin(a + c) * n, this.c = -Math.sin(a - l) * o, this.d = Math.cos(a - l) * o, this.tx = t - (i * this.a + r * this.c), this.ty = e - (i * this.b + r * this.d), this;
  }
  /**
   * Prepends the given Matrix to this Matrix.
   * @param matrix - The matrix to prepend
   * @returns This matrix. Good for chaining method calls.
   */
  prepend(t) {
    const e = this.tx;
    if (t.a !== 1 || t.b !== 0 || t.c !== 0 || t.d !== 1) {
      const i = this.a, r = this.c;
      this.a = i * t.a + this.b * t.c, this.b = i * t.b + this.b * t.d, this.c = r * t.a + this.d * t.c, this.d = r * t.b + this.d * t.d;
    }
    return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this;
  }
  /**
   * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
   * @param transform - The transform to apply the properties to.
   * @returns The transform with the newly applied properties
   */
  decompose(t) {
    const e = this.a, i = this.b, r = this.c, n = this.d, o = t.pivot, a = -Math.atan2(-r, n), l = Math.atan2(i, e), c = Math.abs(a + l);
    return c < 1e-5 || Math.abs(Hc - c) < 1e-5 ? (t.rotation = l, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = a, t.skew.y = l), t.scale.x = Math.sqrt(e * e + i * i), t.scale.y = Math.sqrt(r * r + n * n), t.position.x = this.tx + (o.x * e + o.y * r), t.position.y = this.ty + (o.x * i + o.y * n), t;
  }
  /**
   * Inverts this matrix
   * @returns This matrix. Good for chaining method calls.
   */
  invert() {
    const t = this.a, e = this.b, i = this.c, r = this.d, n = this.tx, o = t * r - e * i;
    return this.a = r / o, this.b = -e / o, this.c = -i / o, this.d = t / o, this.tx = (i * this.ty - r * n) / o, this.ty = -(t * this.ty - e * n) / o, this;
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
    const t = new H();
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
    return Xc.identity();
  }
  /**
   * A static Matrix that can be used to avoid creating new objects.
   * Will always ensure the matrix is reset to identity when requested.
   * Use this object for fast but temporary calculations, as it may be mutated later on.
   * This is a different object to the `IDENTITY` object and so can be modified without changing `IDENTITY`.
   * @readonly
   */
  static get shared() {
    return jc.identity();
  }
}
const jc = new H(), Xc = new H(), Ve = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], We = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], Ne = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], He = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], or = [], el = [], As = Math.sign;
function Kc() {
  for (let s = 0; s < 16; s++) {
    const t = [];
    or.push(t);
    for (let e = 0; e < 16; e++) {
      const i = As(Ve[s] * Ve[e] + Ne[s] * We[e]), r = As(We[s] * Ve[e] + He[s] * We[e]), n = As(Ve[s] * Ne[e] + Ne[s] * He[e]), o = As(We[s] * Ne[e] + He[s] * He[e]);
      for (let a = 0; a < 16; a++)
        if (Ve[a] === i && We[a] === r && Ne[a] === n && He[a] === o) {
          t.push(a);
          break;
        }
    }
  }
  for (let s = 0; s < 16; s++) {
    const t = new H();
    t.set(Ve[s], We[s], Ne[s], He[s], 0, 0), el.push(t);
  }
}
Kc();
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
  uX: (s) => Ve[s],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: (s) => We[s],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: (s) => Ne[s],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: (s) => He[s],
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
  add: (s, t) => or[s][t],
  /**
   * Reverse of `add`.
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation
   * @param {GD8Symmetry} rotationFirst - First operation
   * @returns {GD8Symmetry} Result
   */
  sub: (s, t) => or[s][et.inv(t)],
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
    const r = el[et.inv(t)];
    r.tx = e, r.ty = i, s.append(r);
  }
}, Cs = [new St(), new St(), new St(), new St()];
class ft {
  /**
   * @param x - The X coordinate of the upper-left corner of the rectangle
   * @param y - The Y coordinate of the upper-left corner of the rectangle
   * @param width - The overall width of the rectangle
   * @param height - The overall height of the rectangle
   */
  constructor(t = 0, e = 0, i = 0, r = 0) {
    this.type = "rectangle", this.x = Number(t), this.y = Number(e), this.width = Number(i), this.height = Number(r);
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
    return new ft(0, 0, 0, 0);
  }
  /**
   * Creates a clone of this Rectangle
   * @returns a copy of the rectangle
   */
  clone() {
    return new ft(this.x, this.y, this.width, this.height);
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
    const { width: r, height: n } = this;
    if (r <= 0 || n <= 0)
      return !1;
    const o = this.x, a = this.y, l = o - i / 2, c = o + r + i / 2, h = a - i / 2, f = a + n + i / 2, d = o + i / 2, u = o + r - i / 2, m = a + i / 2, p = a + n - i / 2;
    return t >= l && t <= c && e >= h && e <= f && !(t > d && t < u && e > m && e < p);
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
    const i = this.left, r = this.right, n = this.top, o = this.bottom;
    if (r <= i || o <= n)
      return !1;
    const a = Cs[0].set(t.left, t.top), l = Cs[1].set(t.left, t.bottom), c = Cs[2].set(t.right, t.top), h = Cs[3].set(t.right, t.bottom);
    if (c.x <= a.x || l.y <= a.y)
      return !1;
    const f = Math.sign(e.a * e.d - e.b * e.c);
    if (f === 0 || (e.apply(a, a), e.apply(l, l), e.apply(c, c), e.apply(h, h), Math.max(a.x, l.x, c.x, h.x) <= i || Math.min(a.x, l.x, c.x, h.x) >= r || Math.max(a.y, l.y, c.y, h.y) <= n || Math.min(a.y, l.y, c.y, h.y) >= o))
      return !1;
    const d = f * (l.y - a.y), u = f * (a.x - l.x), m = d * i + u * n, p = d * r + u * n, g = d * i + u * o, x = d * r + u * o;
    if (Math.max(m, p, g, x) <= d * a.x + u * a.y || Math.min(m, p, g, x) >= d * h.x + u * h.y)
      return !1;
    const y = f * (a.y - c.y), v = f * (c.x - a.x), w = y * i + v * n, _ = y * r + v * n, S = y * i + v * o, C = y * r + v * o;
    return !(Math.max(w, _, S, C) <= y * a.x + v * a.y || Math.min(w, _, S, C) >= y * h.x + v * h.y);
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
    const e = Math.max(this.x, t.x), i = Math.min(this.x + this.width, t.x + t.width), r = Math.max(this.y, t.y), n = Math.min(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = Math.max(i - e, 0), this.y = r, this.height = Math.max(n - r, 0), this;
  }
  /**
   * Enlarges rectangle that way its corners lie on grid
   * @param resolution - resolution
   * @param eps - precision
   * @returns Returns itself.
   */
  ceil(t = 1, e = 1e-3) {
    const i = Math.ceil((this.x + this.width - e) * t) / t, r = Math.ceil((this.y + this.height - e) * t) / t;
    return this.x = Math.floor((this.x + e) * t) / t, this.y = Math.floor((this.y + e) * t) / t, this.width = i - this.x, this.height = r - this.y, this;
  }
  /**
   * Enlarges this rectangle to include the passed rectangle.
   * @param rectangle - The rectangle to include.
   * @returns Returns itself.
   */
  enlarge(t) {
    const e = Math.min(this.x, t.x), i = Math.max(this.x + this.width, t.x + t.width), r = Math.min(this.y, t.y), n = Math.max(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = i - e, this.y = r, this.height = n - r, this;
  }
  /**
   * Returns the framing rectangle of the rectangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new ft(), t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
  }
}
const An = {
  default: -1
};
function gt(s = "default") {
  return An[s] === void 0 && (An[s] = -1), ++An[s];
}
const Io = {}, Y = "8.0.0", qc = "8.3.4";
function $(s, t, e = 3) {
  if (Io[t])
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
Deprecated since v${s}`), console.warn(i))), Io[t] = !0;
}
const il = () => {
};
function Bo(s) {
  return s += s === 0 ? 1 : 0, --s, s |= s >>> 1, s |= s >>> 2, s |= s >>> 4, s |= s >>> 8, s |= s >>> 16, s + 1;
}
function Ro(s) {
  return !(s & s - 1) && !!s;
}
function Zc(s) {
  const t = {};
  for (const e in s)
    s[e] !== void 0 && (t[e] = s[e]);
  return t;
}
const Fo = /* @__PURE__ */ Object.create(null);
function Qc(s) {
  const t = Fo[s];
  return t === void 0 && (Fo[s] = gt("resource")), t;
}
const sl = class nl extends Mt {
  /**
   * @param options - options for the style
   */
  constructor(t = {}) {
    super(), this._resourceType = "textureSampler", this._touched = 0, this._maxAnisotropy = 1, this.destroyed = !1, t = { ...nl.defaultOptions, ...t }, this.addressMode = t.addressMode, this.addressModeU = t.addressModeU ?? this.addressModeU, this.addressModeV = t.addressModeV ?? this.addressModeV, this.addressModeW = t.addressModeW ?? this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = t.magFilter ?? this.magFilter, this.minFilter = t.minFilter ?? this.minFilter, this.mipmapFilter = t.mipmapFilter ?? this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = t.maxAnisotropy ?? 1;
  }
  set addressMode(t) {
    this.addressModeU = t, this.addressModeV = t, this.addressModeW = t;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this.addressModeU;
  }
  set wrapMode(t) {
    $(Y, "TextureStyle.wrapMode is now TextureStyle.addressMode"), this.addressMode = t;
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
    return this._sharedResourceId = Qc(t), this._resourceId;
  }
  /** Destroys the style */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners();
  }
};
sl.defaultOptions = {
  addressMode: "clamp-to-edge",
  scaleMode: "linear"
};
let Jc = sl;
const rl = class ol extends Mt {
  /**
   * @param options - options for creating a new TextureSource
   */
  constructor(t = {}) {
    super(), this.options = t, this.uid = gt("textureSource"), this._resourceType = "textureSource", this._resourceId = gt("resource"), this.uploadMethodId = "unknown", this._resolution = 1, this.pixelWidth = 1, this.pixelHeight = 1, this.width = 1, this.height = 1, this.sampleCount = 1, this.mipLevelCount = 1, this.autoGenerateMipmaps = !1, this.format = "rgba8unorm", this.dimension = "2d", this.antialias = !1, this._touched = 0, this._batchTick = -1, this._textureBindLocation = -1, t = { ...ol.defaultOptions, ...t }, this.label = t.label ?? "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, t.width ? this.pixelWidth = t.width * this._resolution : this.pixelWidth = this.resource ? this.resourceWidth ?? 1 : 1, t.height ? this.pixelHeight = t.height * this._resolution : this.pixelHeight = this.resource ? this.resourceHeight ?? 1 : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = t.dimensions, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = t.antialias, this.alphaMode = t.alphaMode, this.style = new Jc(Zc(t)), this.destroyed = !1, this._refreshPOT();
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
    this._resourceId = gt("resource"), this.emit("change", this), this.emit("unload", this);
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
    const r = Math.round(t * i), n = Math.round(e * i);
    return this.width = r / i, this.height = n / i, this._resolution = i, this.pixelWidth === r && this.pixelHeight === n ? !1 : (this._refreshPOT(), this.pixelWidth = r, this.pixelHeight = n, this.emit("resize", this), this._resourceId = gt("resource"), this.emit("change", this), !0);
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
    this.isPowerOfTwo = Ro(this.pixelWidth) && Ro(this.pixelHeight);
  }
  static test(t) {
    throw new Error("Unimplemented");
  }
};
rl.defaultOptions = {
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
let _e = rl;
class qr extends _e {
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
qr.extension = D.TextureSource;
const Lo = new H();
class tu {
  /**
   * @param texture - observed texture
   * @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
   */
  constructor(t, e) {
    this.mapCoord = new H(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, typeof e > "u" ? this.clampMargin = t.width < 10 ? 0 : 0.5 : this.clampMargin = e, this.isSimple = !1, this.texture = t;
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
    for (let r = 0; r < t.length; r += 2) {
      const n = t[r], o = t[r + 1];
      e[r] = n * i.a + o * i.c + i.tx, e[r + 1] = n * i.b + o * i.d + i.ty;
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
    const i = t.orig, r = t.trim;
    r && (Lo.set(
      i.width / r.width,
      0,
      0,
      i.height / r.height,
      -r.x / r.width,
      -r.y / r.height
    ), this.mapCoord.append(Lo));
    const n = t.source, o = this.uClampFrame, a = this.clampMargin / n._resolution, l = this.clampOffset / n._resolution;
    return o[0] = (t.frame.x + a + l) / n.width, o[1] = (t.frame.y + a + l) / n.height, o[2] = (t.frame.x + t.frame.width - a + l) / n.width, o[3] = (t.frame.y + t.frame.height - a + l) / n.height, this.uClampOffset[0] = this.clampOffset / n.pixelWidth, this.uClampOffset[1] = this.clampOffset / n.pixelHeight, this.isSimple = t.frame.width === n.width && t.frame.height === n.height && t.rotate === 0, !0;
  }
}
class W extends Mt {
  /**
   * @param {rendering.TextureOptions} options - Options for the texture
   */
  constructor({
    source: t,
    label: e,
    frame: i,
    orig: r,
    trim: n,
    defaultAnchor: o,
    defaultBorders: a,
    rotate: l,
    dynamic: c
  } = {}) {
    if (super(), this.uid = gt("texture"), this.uvs = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 }, this.frame = new ft(), this.noFrame = !1, this.dynamic = !1, this.isTexture = !0, this.label = e, this.source = (t == null ? void 0 : t.source) ?? new _e(), this.noFrame = !i, i)
      this.frame.copyFrom(i);
    else {
      const { width: h, height: f } = this._source;
      this.frame.width = h, this.frame.height = f;
    }
    this.orig = r || this.frame, this.trim = n, this.rotate = l ?? 0, this.defaultAnchor = o, this.defaultBorders = a, this.destroyed = !1, this.dynamic = c || !1, this.updateUvs();
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
    return this._textureMatrix || (this._textureMatrix = new tu(this)), this._textureMatrix;
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
    const { uvs: t, frame: e } = this, { width: i, height: r } = this._source, n = e.x / i, o = e.y / r, a = e.width / i, l = e.height / r;
    let c = this.rotate;
    if (c) {
      const h = a / 2, f = l / 2, d = n + h, u = o + f;
      c = et.add(c, et.NW), t.x0 = d + h * et.uX(c), t.y0 = u + f * et.uY(c), c = et.add(c, 2), t.x1 = d + h * et.uX(c), t.y1 = u + f * et.uY(c), c = et.add(c, 2), t.x2 = d + h * et.uX(c), t.y2 = u + f * et.uY(c), c = et.add(c, 2), t.x3 = d + h * et.uX(c), t.y3 = u + f * et.uY(c);
    } else
      t.x0 = n, t.y0 = o, t.x1 = n + a, t.y1 = o, t.x2 = n + a, t.y2 = o + l, t.x3 = n, t.y3 = o + l;
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
    return $(Y, "Texture.baseTexture is now Texture.source"), this._source;
  }
}
W.EMPTY = new W({
  label: "EMPTY",
  source: new _e({
    label: "EMPTY"
  })
});
W.EMPTY.destroy = il;
W.WHITE = new W({
  source: new qr({
    resource: new Uint8Array([255, 255, 255, 255]),
    width: 1,
    height: 1,
    alphaMode: "premultiply-alpha-on-upload",
    label: "WHITE"
  }),
  label: "WHITE"
});
W.WHITE.destroy = il;
function eu(s, t, e, i) {
  const { width: r, height: n } = e.orig, o = e.trim;
  if (o) {
    const a = o.width, l = o.height;
    s.minX = o.x - t._x * r - i, s.maxX = s.minX + a, s.minY = o.y - t._y * n - i, s.maxY = s.minY + l;
  } else
    s.minX = -t._x * r - i, s.maxX = s.minX + r, s.minY = -t._y * n - i, s.maxY = s.minY + n;
}
const Oo = new H();
class me {
  constructor(t = 1 / 0, e = 1 / 0, i = -1 / 0, r = -1 / 0) {
    this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = Oo, this.minX = t, this.minY = e, this.maxX = i, this.maxY = r;
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
    this._rectangle || (this._rectangle = new ft());
    const t = this._rectangle;
    return this.minX > this.maxX || this.minY > this.maxY ? (t.x = 0, t.y = 0, t.width = 0, t.height = 0) : t.copyFromBounds(this), t;
  }
  /** Clears the bounds and resets. */
  clear() {
    return this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = Oo, this;
  }
  /**
   * Sets the bounds.
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   */
  set(t, e, i, r) {
    this.minX = t, this.minY = e, this.maxX = i, this.maxY = r;
  }
  /**
   * Adds sprite frame
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   * @param matrix
   */
  addFrame(t, e, i, r, n) {
    n || (n = this.matrix);
    const o = n.a, a = n.b, l = n.c, c = n.d, h = n.tx, f = n.ty;
    let d = this.minX, u = this.minY, m = this.maxX, p = this.maxY, g = o * t + l * e + h, x = a * t + c * e + f;
    g < d && (d = g), x < u && (u = x), g > m && (m = g), x > p && (p = x), g = o * i + l * e + h, x = a * i + c * e + f, g < d && (d = g), x < u && (u = x), g > m && (m = g), x > p && (p = x), g = o * t + l * r + h, x = a * t + c * r + f, g < d && (d = g), x < u && (u = x), g > m && (m = g), x > p && (p = x), g = o * i + l * r + h, x = a * i + c * r + f, g < d && (d = g), x < u && (u = x), g > m && (m = g), x > p && (p = x), this.minX = d, this.minY = u, this.maxX = m, this.maxY = p;
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
    const e = this.minX, i = this.minY, r = this.maxX, n = this.maxY, { a: o, b: a, c: l, d: c, tx: h, ty: f } = t;
    let d = o * e + l * i + h, u = a * e + c * i + f;
    this.minX = d, this.minY = u, this.maxX = d, this.maxY = u, d = o * r + l * i + h, u = a * r + c * i + f, this.minX = d < this.minX ? d : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = u > this.maxY ? u : this.maxY, d = o * e + l * n + h, u = a * e + c * n + f, this.minX = d < this.minX ? d : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = u > this.maxY ? u : this.maxY, d = o * r + l * n + h, u = a * r + c * n + f, this.minX = d < this.minX ? d : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = u > this.maxY ? u : this.maxY;
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
  fitBounds(t, e, i, r) {
    return this.minX < t && (this.minX = t), this.maxX > e && (this.maxX = e), this.minY < i && (this.minY = i), this.maxY > r && (this.maxY = r), this;
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
    return new me(this.minX, this.minY, this.maxX, this.maxY);
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
  addVertexData(t, e, i, r) {
    let n = this.minX, o = this.minY, a = this.maxX, l = this.maxY;
    r || (r = this.matrix);
    const c = r.a, h = r.b, f = r.c, d = r.d, u = r.tx, m = r.ty;
    for (let p = e; p < i; p += 2) {
      const g = t[p], x = t[p + 1], y = c * g + f * x + u, v = h * g + d * x + m;
      n = y < n ? y : n, o = v < o ? v : o, a = y > a ? y : a, l = v > l ? v : l;
    }
    this.minX = n, this.minY = o, this.maxX = a, this.maxY = l;
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
var iu = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) }, ye = function(s) {
  return typeof s == "string" ? s.length > 0 : typeof s == "number";
}, xt = function(s, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = Math.pow(10, t)), Math.round(e * s) / e + 0;
}, Kt = function(s, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = 1), s > e ? e : s > t ? s : t;
}, al = function(s) {
  return (s = isFinite(s) ? s % 360 : 0) > 0 ? s : s + 360;
}, Do = function(s) {
  return { r: Kt(s.r, 0, 255), g: Kt(s.g, 0, 255), b: Kt(s.b, 0, 255), a: Kt(s.a) };
}, Cn = function(s) {
  return { r: xt(s.r), g: xt(s.g), b: xt(s.b), a: xt(s.a, 3) };
}, su = /^#([0-9a-f]{3,8})$/i, Ps = function(s) {
  var t = s.toString(16);
  return t.length < 2 ? "0" + t : t;
}, ll = function(s) {
  var t = s.r, e = s.g, i = s.b, r = s.a, n = Math.max(t, e, i), o = n - Math.min(t, e, i), a = o ? n === t ? (e - i) / o : n === e ? 2 + (i - t) / o : 4 + (t - e) / o : 0;
  return { h: 60 * (a < 0 ? a + 6 : a), s: n ? o / n * 100 : 0, v: n / 255 * 100, a: r };
}, hl = function(s) {
  var t = s.h, e = s.s, i = s.v, r = s.a;
  t = t / 360 * 6, e /= 100, i /= 100;
  var n = Math.floor(t), o = i * (1 - e), a = i * (1 - (t - n) * e), l = i * (1 - (1 - t + n) * e), c = n % 6;
  return { r: 255 * [i, a, o, o, l, i][c], g: 255 * [l, i, i, a, o, o][c], b: 255 * [o, o, l, i, i, a][c], a: r };
}, zo = function(s) {
  return { h: al(s.h), s: Kt(s.s, 0, 100), l: Kt(s.l, 0, 100), a: Kt(s.a) };
}, Uo = function(s) {
  return { h: xt(s.h), s: xt(s.s), l: xt(s.l), a: xt(s.a, 3) };
}, Go = function(s) {
  return hl((e = (t = s).s, { h: t.h, s: (e *= ((i = t.l) < 50 ? i : 100 - i) / 100) > 0 ? 2 * e / (i + e) * 100 : 0, v: i + e, a: t.a }));
  var t, e, i;
}, Zi = function(s) {
  return { h: (t = ll(s)).h, s: (r = (200 - (e = t.s)) * (i = t.v) / 100) > 0 && r < 200 ? e * i / 100 / (r <= 100 ? r : 200 - r) * 100 : 0, l: r / 2, a: t.a };
  var t, e, i, r;
}, nu = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, ru = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, ou = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, au = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, ar = { string: [[function(s) {
  var t = su.exec(s);
  return t ? (s = t[1]).length <= 4 ? { r: parseInt(s[0] + s[0], 16), g: parseInt(s[1] + s[1], 16), b: parseInt(s[2] + s[2], 16), a: s.length === 4 ? xt(parseInt(s[3] + s[3], 16) / 255, 2) : 1 } : s.length === 6 || s.length === 8 ? { r: parseInt(s.substr(0, 2), 16), g: parseInt(s.substr(2, 2), 16), b: parseInt(s.substr(4, 2), 16), a: s.length === 8 ? xt(parseInt(s.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(s) {
  var t = ou.exec(s) || au.exec(s);
  return t ? t[2] !== t[4] || t[4] !== t[6] ? null : Do({ r: Number(t[1]) / (t[2] ? 100 / 255 : 1), g: Number(t[3]) / (t[4] ? 100 / 255 : 1), b: Number(t[5]) / (t[6] ? 100 / 255 : 1), a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1) }) : null;
}, "rgb"], [function(s) {
  var t = nu.exec(s) || ru.exec(s);
  if (!t) return null;
  var e, i, r = zo({ h: (e = t[1], i = t[2], i === void 0 && (i = "deg"), Number(e) * (iu[i] || 1)), s: Number(t[3]), l: Number(t[4]), a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1) });
  return Go(r);
}, "hsl"]], object: [[function(s) {
  var t = s.r, e = s.g, i = s.b, r = s.a, n = r === void 0 ? 1 : r;
  return ye(t) && ye(e) && ye(i) ? Do({ r: Number(t), g: Number(e), b: Number(i), a: Number(n) }) : null;
}, "rgb"], [function(s) {
  var t = s.h, e = s.s, i = s.l, r = s.a, n = r === void 0 ? 1 : r;
  if (!ye(t) || !ye(e) || !ye(i)) return null;
  var o = zo({ h: Number(t), s: Number(e), l: Number(i), a: Number(n) });
  return Go(o);
}, "hsl"], [function(s) {
  var t = s.h, e = s.s, i = s.v, r = s.a, n = r === void 0 ? 1 : r;
  if (!ye(t) || !ye(e) || !ye(i)) return null;
  var o = function(a) {
    return { h: al(a.h), s: Kt(a.s, 0, 100), v: Kt(a.v, 0, 100), a: Kt(a.a) };
  }({ h: Number(t), s: Number(e), v: Number(i), a: Number(n) });
  return hl(o);
}, "hsv"]] }, Vo = function(s, t) {
  for (var e = 0; e < t.length; e++) {
    var i = t[e][0](s);
    if (i) return [i, t[e][1]];
  }
  return [null, void 0];
}, lu = function(s) {
  return typeof s == "string" ? Vo(s.trim(), ar.string) : typeof s == "object" && s !== null ? Vo(s, ar.object) : [null, void 0];
}, Pn = function(s, t) {
  var e = Zi(s);
  return { h: e.h, s: Kt(e.s + 100 * t, 0, 100), l: e.l, a: e.a };
}, Mn = function(s) {
  return (299 * s.r + 587 * s.g + 114 * s.b) / 1e3 / 255;
}, Wo = function(s, t) {
  var e = Zi(s);
  return { h: e.h, s: e.s, l: Kt(e.l + 100 * t, 0, 100), a: e.a };
}, lr = function() {
  function s(t) {
    this.parsed = lu(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return s.prototype.isValid = function() {
    return this.parsed !== null;
  }, s.prototype.brightness = function() {
    return xt(Mn(this.rgba), 2);
  }, s.prototype.isDark = function() {
    return Mn(this.rgba) < 0.5;
  }, s.prototype.isLight = function() {
    return Mn(this.rgba) >= 0.5;
  }, s.prototype.toHex = function() {
    return t = Cn(this.rgba), e = t.r, i = t.g, r = t.b, o = (n = t.a) < 1 ? Ps(xt(255 * n)) : "", "#" + Ps(e) + Ps(i) + Ps(r) + o;
    var t, e, i, r, n, o;
  }, s.prototype.toRgb = function() {
    return Cn(this.rgba);
  }, s.prototype.toRgbString = function() {
    return t = Cn(this.rgba), e = t.r, i = t.g, r = t.b, (n = t.a) < 1 ? "rgba(" + e + ", " + i + ", " + r + ", " + n + ")" : "rgb(" + e + ", " + i + ", " + r + ")";
    var t, e, i, r, n;
  }, s.prototype.toHsl = function() {
    return Uo(Zi(this.rgba));
  }, s.prototype.toHslString = function() {
    return t = Uo(Zi(this.rgba)), e = t.h, i = t.s, r = t.l, (n = t.a) < 1 ? "hsla(" + e + ", " + i + "%, " + r + "%, " + n + ")" : "hsl(" + e + ", " + i + "%, " + r + "%)";
    var t, e, i, r, n;
  }, s.prototype.toHsv = function() {
    return t = ll(this.rgba), { h: xt(t.h), s: xt(t.s), v: xt(t.v), a: xt(t.a, 3) };
    var t;
  }, s.prototype.invert = function() {
    return le({ r: 255 - (t = this.rgba).r, g: 255 - t.g, b: 255 - t.b, a: t.a });
    var t;
  }, s.prototype.saturate = function(t) {
    return t === void 0 && (t = 0.1), le(Pn(this.rgba, t));
  }, s.prototype.desaturate = function(t) {
    return t === void 0 && (t = 0.1), le(Pn(this.rgba, -t));
  }, s.prototype.grayscale = function() {
    return le(Pn(this.rgba, -1));
  }, s.prototype.lighten = function(t) {
    return t === void 0 && (t = 0.1), le(Wo(this.rgba, t));
  }, s.prototype.darken = function(t) {
    return t === void 0 && (t = 0.1), le(Wo(this.rgba, -t));
  }, s.prototype.rotate = function(t) {
    return t === void 0 && (t = 15), this.hue(this.hue() + t);
  }, s.prototype.alpha = function(t) {
    return typeof t == "number" ? le({ r: (e = this.rgba).r, g: e.g, b: e.b, a: t }) : xt(this.rgba.a, 3);
    var e;
  }, s.prototype.hue = function(t) {
    var e = Zi(this.rgba);
    return typeof t == "number" ? le({ h: t, s: e.s, l: e.l, a: e.a }) : xt(e.h);
  }, s.prototype.isEqual = function(t) {
    return this.toHex() === le(t).toHex();
  }, s;
}(), le = function(s) {
  return s instanceof lr ? s : new lr(s);
}, No = [], hu = function(s) {
  s.forEach(function(t) {
    No.indexOf(t) < 0 && (t(lr, ar), No.push(t));
  });
};
function cu(s, t) {
  var e = { white: "#ffffff", bisque: "#ffe4c4", blue: "#0000ff", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", antiquewhite: "#faebd7", aqua: "#00ffff", azure: "#f0ffff", whitesmoke: "#f5f5f5", papayawhip: "#ffefd5", plum: "#dda0dd", blanchedalmond: "#ffebcd", black: "#000000", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", cornsilk: "#fff8dc", cornflowerblue: "#6495ed", burlywood: "#deb887", aquamarine: "#7fffd4", beige: "#f5f5dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkkhaki: "#bdb76b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", peachpuff: "#ffdab9", darkmagenta: "#8b008b", darkred: "#8b0000", darkorchid: "#9932cc", darkorange: "#ff8c00", darkslateblue: "#483d8b", gray: "#808080", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", deeppink: "#ff1493", deepskyblue: "#00bfff", wheat: "#f5deb3", firebrick: "#b22222", floralwhite: "#fffaf0", ghostwhite: "#f8f8ff", darkviolet: "#9400d3", magenta: "#ff00ff", green: "#008000", dodgerblue: "#1e90ff", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", blueviolet: "#8a2be2", forestgreen: "#228b22", lawngreen: "#7cfc00", indianred: "#cd5c5c", indigo: "#4b0082", fuchsia: "#ff00ff", brown: "#a52a2a", maroon: "#800000", mediumblue: "#0000cd", lightcoral: "#f08080", darkturquoise: "#00ced1", lightcyan: "#e0ffff", ivory: "#fffff0", lightyellow: "#ffffe0", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", linen: "#faf0e6", mediumaquamarine: "#66cdaa", lemonchiffon: "#fffacd", lime: "#00ff00", khaki: "#f0e68c", mediumseagreen: "#3cb371", limegreen: "#32cd32", mediumspringgreen: "#00fa9a", lightskyblue: "#87cefa", lightblue: "#add8e6", midnightblue: "#191970", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", mintcream: "#f5fffa", lightslategray: "#778899", lightslategrey: "#778899", navajowhite: "#ffdead", navy: "#000080", mediumvioletred: "#c71585", powderblue: "#b0e0e6", palegoldenrod: "#eee8aa", oldlace: "#fdf5e6", paleturquoise: "#afeeee", mediumturquoise: "#48d1cc", mediumorchid: "#ba55d3", rebeccapurple: "#663399", lightsteelblue: "#b0c4de", mediumslateblue: "#7b68ee", thistle: "#d8bfd8", tan: "#d2b48c", orchid: "#da70d6", mediumpurple: "#9370db", purple: "#800080", pink: "#ffc0cb", skyblue: "#87ceeb", springgreen: "#00ff7f", palegreen: "#98fb98", red: "#ff0000", yellow: "#ffff00", slateblue: "#6a5acd", lavenderblush: "#fff0f5", peru: "#cd853f", palevioletred: "#db7093", violet: "#ee82ee", teal: "#008080", slategray: "#708090", slategrey: "#708090", aliceblue: "#f0f8ff", darkseagreen: "#8fbc8f", darkolivegreen: "#556b2f", greenyellow: "#adff2f", seagreen: "#2e8b57", seashell: "#fff5ee", tomato: "#ff6347", silver: "#c0c0c0", sienna: "#a0522d", lavender: "#e6e6fa", lightgreen: "#90ee90", orange: "#ffa500", orangered: "#ff4500", steelblue: "#4682b4", royalblue: "#4169e1", turquoise: "#40e0d0", yellowgreen: "#9acd32", salmon: "#fa8072", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", darksalmon: "#e9967a", lightgoldenrodyellow: "#fafad2", snow: "#fffafa", lightgrey: "#d3d3d3", lightgray: "#d3d3d3", dimgray: "#696969", dimgrey: "#696969", olivedrab: "#6b8e23", olive: "#808000" }, i = {};
  for (var r in e) i[e[r]] = r;
  var n = {};
  s.prototype.toName = function(o) {
    if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
    var a, l, c = i[this.toHex()];
    if (c) return c;
    if (o != null && o.closest) {
      var h = this.toRgb(), f = 1 / 0, d = "black";
      if (!n.length) for (var u in e) n[u] = new s(e[u]).toRgb();
      for (var m in e) {
        var p = (a = h, l = n[m], Math.pow(a.r - l.r, 2) + Math.pow(a.g - l.g, 2) + Math.pow(a.b - l.b, 2));
        p < f && (f = p, d = m);
      }
      return d;
    }
  }, t.string.push([function(o) {
    var a = o.toLowerCase(), l = a === "transparent" ? "#0000" : e[a];
    return l ? new s(l).toRgb() : null;
  }, "name"]);
}
hu([cu]);
const wi = class Hi {
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
    if (t instanceof Hi)
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
      return t.length !== e.length ? !1 : t.every((n, o) => n === e[o]);
    if (t !== null && e !== null) {
      const n = Object.keys(t), o = Object.keys(e);
      return n.length !== o.length ? !1 : n.every((a) => t[a] === e[a]);
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
    const [t, e, i, r] = this._components;
    return { r: t, g: e, b: i, a: r };
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
    const [e, i, r] = this._components;
    return this._arrayRgb || (this._arrayRgb = []), t = t || this._arrayRgb, t[0] = Math.round(e * 255), t[1] = Math.round(i * 255), t[2] = Math.round(r * 255), t;
  }
  toArray(t) {
    this._arrayRgba || (this._arrayRgba = []), t = t || this._arrayRgba;
    const [e, i, r, n] = this._components;
    return t[0] = e, t[1] = i, t[2] = r, t[3] = n, t;
  }
  toRgbArray(t) {
    this._arrayRgb || (this._arrayRgb = []), t = t || this._arrayRgb;
    const [e, i, r] = this._components;
    return t[0] = e, t[1] = i, t[2] = r, t;
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
    const [e, i, r, n] = Hi._temp.setValue(t)._components;
    return this._components[0] *= e, this._components[1] *= i, this._components[2] *= r, this._components[3] *= n, this._refreshInt(), this._value = null, this;
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
    let i = this._int >> 16 & 255, r = this._int >> 8 & 255, n = this._int & 255;
    return e && (i = i * t + 0.5 | 0, r = r * t + 0.5 | 0, n = n * t + 0.5 | 0), (t * 255 << 24) + (i << 16) + (r << 8) + n;
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
    let e, i, r, n;
    if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
      const o = t;
      e = (o >> 16 & 255) / 255, i = (o >> 8 & 255) / 255, r = (o & 255) / 255, n = 1;
    } else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t), [e, i, r, n = 1] = t;
    else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t, 0, 255), [e, i, r, n = 255] = t, e /= 255, i /= 255, r /= 255, n /= 255;
    else if (typeof t == "string" || typeof t == "object") {
      if (typeof t == "string") {
        const a = Hi.HEX_PATTERN.exec(t);
        a && (t = `#${a[2]}`);
      }
      const o = le(t);
      o.isValid() && ({ r: e, g: i, b: r, a: n } = o.rgba, e /= 255, i /= 255, r /= 255);
    }
    if (e !== void 0)
      this._components[0] = e, this._components[1] = i, this._components[2] = r, this._components[3] = n, this._refreshInt();
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
    return typeof t == "number" ? Math.min(Math.max(t, e), i) : (t.forEach((r, n) => {
      t[n] = Math.min(Math.max(r, e), i);
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
    return typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof Hi || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0;
  }
};
wi.shared = new wi();
wi._temp = new wi();
wi.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
let dt = wi;
const uu = {
  cullArea: null,
  cullable: !1,
  cullableChildren: !0
};
class Zr {
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
class fu {
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
    return this._poolsByClass.has(t) || this._poolsByClass.set(t, new Zr(t)), this._poolsByClass.get(t);
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
const Se = new fu();
function du(s, t, e) {
  const i = s.length;
  let r;
  if (t >= i || e === 0)
    return;
  e = t + e > i ? i - t : e;
  const n = i - e;
  for (r = t; r < n; ++r)
    s[r] = s[r + e];
  s.length = n;
}
const pu = {
  allowChildren: !0,
  /**
   * Removes all children from this container that are within the begin and end indexes.
   * @param beginIndex - The beginning position.
   * @param endIndex - The ending position. Default value is size of the container.
   * @returns - List of removed children
   * @memberof scene.Container#
   */
  removeChildren(s = 0, t) {
    const e = t ?? this.children.length, i = e - s, r = [];
    if (i > 0 && i <= e) {
      for (let o = e - 1; o >= s; o--) {
        const a = this.children[o];
        a && (r.push(a), a.parent = null);
      }
      du(this.children, s, e);
      const n = this.renderGroup || this.parentRenderGroup;
      n && n.removeChildren(r);
      for (let o = 0; o < r.length; ++o)
        this.emit("childRemoved", r[o], this, o), r[o].emit("removed", this);
      return r;
    } else if (i === 0 && this.children.length === 0)
      return r;
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
    this.allowChildren || $(Y, "addChildAt: Only Containers will be allowed to add children in v8.0.0");
    const { children: e } = this;
    if (t < 0 || t > e.length)
      throw new Error(`${s}addChildAt: The index ${t} supplied is out of bounds ${e.length}`);
    if (s.parent) {
      const r = s.parent.children.indexOf(s);
      if (s.parent === this && r === t)
        return s;
      r !== -1 && s.parent.children.splice(r, 1);
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
    const r = this.renderGroup || this.parentRenderGroup;
    r && (r.structureDidChange = !0), this._didContainerChangeTick++;
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
class Ho {
  constructor() {
    this.pipe = "filter", this.priority = 1;
  }
  destroy() {
    for (let t = 0; t < this.filters.length; t++)
      this.filters[t].destroy();
    this.filters = null, this.filterArea = null;
  }
}
class mu {
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
        return Se.get(i.maskClass, t);
    }
    return t;
  }
  returnMaskEffect(t) {
    Se.return(t);
  }
}
const hr = new mu();
At.handleByList(D.MaskEffect, hr._effectClasses);
const gu = {
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
    this.effects.push(s), this.effects.sort((i, r) => i.priority - r.priority);
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
    (t == null ? void 0 : t.mask) !== s && (t && (this.removeEffect(t), hr.returnMaskEffect(t), this._maskEffect = null), s != null && (this._maskEffect = hr.getMaskEffect(s), this.addEffect(this._maskEffect)));
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
    var n;
    !Array.isArray(s) && s && (s = [s]);
    const t = this._filterEffect || (this._filterEffect = new Ho());
    s = s;
    const e = (s == null ? void 0 : s.length) > 0, i = ((n = t.filters) == null ? void 0 : n.length) > 0, r = e !== i;
    s = Array.isArray(s) ? s.slice(0) : s, t.filters = Object.freeze(s), r && (e ? this.addEffect(t) : (this.removeEffect(t), t.filters = s ?? null));
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
    this._filterEffect || (this._filterEffect = new Ho()), this._filterEffect.filterArea = s;
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
}, _u = {
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
    return $(Y, "Container.name property has been removed, use Container.label instead"), this.label;
  },
  set name(s) {
    $(Y, "Container.name property has been removed, use Container.label instead"), this.label = s;
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
      const r = e[i];
      if (r.label === s || s instanceof RegExp && s.test(r.label))
        return r;
    }
    if (t)
      for (let i = 0; i < e.length; i++) {
        const n = e[i].getChildByLabel(s, !0);
        if (n)
          return n;
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
    for (let r = 0; r < i.length; r++) {
      const n = i[r];
      (n.label === s || s instanceof RegExp && s.test(n.label)) && e.push(n);
    }
    if (t)
      for (let r = 0; r < i.length; r++)
        i[r].getChildrenByLabel(s, !0, e);
    return e;
  }
}, Ae = new Zr(H), Si = new Zr(me);
function cl(s, t, e) {
  e.clear();
  let i, r;
  return s.parent ? t ? i = s.parent.worldTransform : (r = Ae.get().identity(), i = $s(s, r)) : i = H.IDENTITY, ul(s, e, i, t), r && Ae.return(r), e.isValid || e.set(0, 0, 0, 0), e;
}
function ul(s, t, e, i) {
  var a, l;
  if (!s.visible || !s.measurable)
    return;
  let r;
  i ? r = s.worldTransform : (s.updateLocalTransform(), r = Ae.get(), r.appendFrom(s.localTransform, e));
  const n = t, o = !!s.effects.length;
  if (o && (t = Si.get().clear()), s.boundsArea)
    t.addRect(s.boundsArea, r);
  else {
    s.addBounds && (t.matrix = r, s.addBounds(t));
    for (let c = 0; c < s.children.length; c++)
      ul(s.children[c], t, r, i);
  }
  if (o) {
    for (let c = 0; c < s.effects.length; c++)
      (l = (a = s.effects[c]).addBounds) == null || l.call(a, t);
    n.addBounds(t, H.IDENTITY), Si.return(t);
  }
  i || Ae.return(r);
}
function $s(s, t) {
  const e = s.parent;
  return e && ($s(e, t), e.updateLocalTransform(), t.append(e.localTransform)), t;
}
let Tn = 0;
const $o = 500;
function ct(...s) {
  Tn !== $o && (Tn++, Tn === $o ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...s));
}
function fl(s, t, e) {
  return t.clear(), e || (e = H.IDENTITY), dl(s, t, e, s, !0), t.isValid || t.set(0, 0, 0, 0), t;
}
function dl(s, t, e, i, r) {
  var l, c;
  let n;
  if (r)
    n = Ae.get(), n = e.copyTo(n);
  else {
    if (!s.visible || !s.measurable)
      return;
    s.updateLocalTransform();
    const h = s.localTransform;
    n = Ae.get(), n.appendFrom(h, e);
  }
  const o = t, a = !!s.effects.length;
  if (a && (t = Si.get().clear()), s.boundsArea)
    t.addRect(s.boundsArea, n);
  else {
    s.renderPipeId && (t.matrix = n, s.addBounds(t));
    const h = s.children;
    for (let f = 0; f < h.length; f++)
      dl(h[f], t, n, i, !1);
  }
  if (a) {
    for (let h = 0; h < s.effects.length; h++)
      (c = (l = s.effects[h]).addLocalBounds) == null || c.call(l, t, i);
    o.addBounds(t, H.IDENTITY), Si.return(t);
  }
  Ae.return(n);
}
function pl(s, t) {
  const e = s.children;
  for (let i = 0; i < e.length; i++) {
    const r = e[i], n = r.uid, o = (r._didViewChangeTick & 65535) << 16 | r._didContainerChangeTick & 65535, a = t.index;
    (t.data[a] !== n || t.data[a + 1] !== o) && (t.data[t.index] = n, t.data[t.index + 1] = o, t.didChange = !0), t.index = a + 2, r.children.length && pl(r, t);
  }
  return t.didChange;
}
const xu = new H(), yu = {
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
      localBounds: new me()
    });
    const s = this._localBoundsCacheData;
    return s.index = 1, s.didChange = !1, s.data[0] !== this._didViewChangeTick && (s.didChange = !0, s.data[0] = this._didViewChangeTick), pl(this, s), s.didChange && fl(this, s.localBounds, xu), s.localBounds;
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
    return cl(this, s, t || new me());
  }
}, vu = {
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
}, bu = {
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
    this.sortDirty && (this.sortDirty = !1, this.children.sort(wu));
  }
};
function wu(s, t) {
  return s._zIndex - t._zIndex;
}
const Su = {
  /**
   * Returns the global position of the container.
   * @param point - The optional point to write the global value to.
   * @param skipUpdate - Should we skip the update transform.
   * @returns - The updated point.
   * @memberof scene.Container#
   */
  getGlobalPosition(s = new St(), t = !1) {
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
      const i = $s(this, new H());
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
      const r = $s(this, new H());
      return r.append(this.localTransform), r.applyInverse(s, e);
    }
    return this.worldTransform.applyInverse(s, e);
  }
};
let Au = 0;
class ml {
  constructor() {
    this.uid = gt("instructionSet"), this.instructions = [], this.instructionSize = 0, this.renderables = [], this.tick = 0;
  }
  /** reset the instruction set so it can be reused set size back to 0 */
  reset() {
    this.instructionSize = 0, this.tick = Au++;
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
class Cu {
  constructor() {
    this.renderPipeId = "renderGroup", this.root = null, this.canBundle = !1, this.renderGroupParent = null, this.renderGroupChildren = [], this.worldTransform = new H(), this.worldColorAlpha = 4294967295, this.worldColor = 16777215, this.worldAlpha = 1, this.childrenToUpdate = /* @__PURE__ */ Object.create(null), this.updateTick = 0, this.childrenRenderablesToUpdate = { list: [], index: 0 }, this.structureDidChange = !0, this.instructionSet = new ml(), this._onRenderContainers = [];
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
    for (let r = 0; r < i.length; r++)
      this._getChildren(i[r], e);
    return e;
  }
}
function Pu(s, t, e = {}) {
  for (const i in t)
    !e[i] && t[i] !== void 0 && (s[i] = t[i]);
}
const kn = new mt(null), En = new mt(null), In = new mt(null, 1, 1), Yo = 1, Mu = 2, Bn = 4;
class Et extends Mt {
  constructor(t = {}) {
    var e, i;
    super(), this.uid = gt("renderable"), this._updateFlags = 15, this.renderGroup = null, this.parentRenderGroup = null, this.parentRenderGroupIndex = 0, this.didChange = !1, this.didViewUpdate = !1, this.relativeRenderGroupDepth = 0, this.children = [], this.parent = null, this.includeInBuild = !0, this.measurable = !0, this.isSimple = !0, this.updateTick = -1, this.localTransform = new H(), this.relativeGroupTransform = new H(), this.groupTransform = this.relativeGroupTransform, this.destroyed = !1, this._position = new mt(this, 0, 0), this._scale = In, this._pivot = En, this._skew = kn, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._rotation = 0, this.localColor = 16777215, this.localAlpha = 1, this.groupAlpha = 1, this.groupColor = 16777215, this.groupColorAlpha = 4294967295, this.localBlendMode = "inherit", this.groupBlendMode = "normal", this.localDisplayStatus = 7, this.globalDisplayStatus = 7, this._didContainerChangeTick = 0, this._didViewChangeTick = 0, this._didLocalTransformChangeId = -1, this.effects = [], Pu(this, t, {
      children: !0,
      parent: !0,
      effects: !0
    }), (e = t.children) == null || e.forEach((r) => this.addChild(r)), (i = t.parent) == null || i.addChild(this);
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
    if (this.allowChildren || $(Y, "addChild: Only Containers will be allowed to add children in v8.0.0"), t.length > 1) {
      for (let r = 0; r < t.length; r++)
        this.addChild(t[r]);
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
      for (let r = 0; r < t.length; r++)
        this.removeChild(t[r]);
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
    t == null || t.removeChild(this), this.renderGroup = Se.get(Cu, this), this.groupTransform = H.IDENTITY, t == null || t.addChild(this), this._updateIsSimple();
  }
  /** This will disable the render group for this container. */
  disableRenderGroup() {
    if (!this.renderGroup)
      return;
    const t = this.parentRenderGroup;
    t == null || t.removeChild(this), Se.return(this.renderGroup), this.renderGroup = null, this.groupTransform = this.relativeGroupTransform, t == null || t.addChild(this), this._updateIsSimple();
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
    return this._worldTransform || (this._worldTransform = new H()), this.renderGroup ? this._worldTransform.copyFrom(this.renderGroup.worldTransform) : this.parentRenderGroup && this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform), this._worldTransform;
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
    return this.rotation * $c;
  }
  set angle(t) {
    this.rotation = t * Yc;
  }
  /**
   * The center of rotation, scaling, and skewing for this display object in its local space. The `position`
   * is the projection of `pivot` in the parent's local space.
   *
   * By default, the pivot is the origin (0, 0).
   * @since 4.0.0
   */
  get pivot() {
    return this._pivot === En && (this._pivot = new mt(this, 0, 0)), this._pivot;
  }
  set pivot(t) {
    this._pivot === En && (this._pivot = new mt(this, 0, 0)), typeof t == "number" ? this._pivot.set(t) : this._pivot.copyFrom(t);
  }
  /**
   * The skew factor for the object in radians.
   * @since 4.0.0
   */
  get skew() {
    return this._skew === kn && (this._skew = new mt(this, 0, 0)), this._skew;
  }
  set skew(t) {
    this._skew === kn && (this._skew = new mt(this, 0, 0)), this._skew.copyFrom(t);
  }
  /**
   * The scale factors of this object along the local coordinate axes.
   *
   * The default scale is (1, 1).
   * @since 4.0.0
   */
  get scale() {
    return this._scale === In && (this._scale = new mt(this, 1, 1)), this._scale;
  }
  set scale(t) {
    this._scale === In && (this._scale = new mt(this, 0, 0)), typeof t == "number" ? this._scale.set(t) : this._scale.copyFrom(t);
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
    const e = this.localTransform, i = this._scale, r = this._pivot, n = this._position, o = i._x, a = i._y, l = r._x, c = r._y;
    e.a = this._cx * o, e.b = this._sx * o, e.c = this._cy * a, e.d = this._sy * a, e.tx = n._x - (l * e.a + c * e.c), e.ty = n._y - (l * e.b + c * e.d);
  }
  // / ///// color related stuff
  set alpha(t) {
    t !== this.localAlpha && (this.localAlpha = t, this._updateFlags |= Yo, this._onUpdate());
  }
  /** The opacity of the object. */
  get alpha() {
    return this.localAlpha;
  }
  set tint(t) {
    const i = dt.shared.setValue(t ?? 16777215).toBgrNumber();
    i !== this.localColor && (this.localColor = i, this._updateFlags |= Yo, this._onUpdate());
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
    this.localBlendMode !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Mu, this.localBlendMode = t, this._onUpdate());
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
    (this.localDisplayStatus & 2) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Bn, this.localDisplayStatus ^= 2, this._onUpdate());
  }
  /** @ignore */
  get culled() {
    return !(this.localDisplayStatus & 4);
  }
  /** @ignore */
  set culled(t) {
    const e = t ? 0 : 4;
    (this.localDisplayStatus & 4) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Bn, this.localDisplayStatus ^= 4, this._onUpdate());
  }
  /** Can this object be rendered, if false the object will not be drawn but the transform will still be updated. */
  get renderable() {
    return !!(this.localDisplayStatus & 1);
  }
  set renderable(t) {
    const e = t ? 1 : 0;
    (this.localDisplayStatus & 1) !== e && (this._updateFlags |= Bn, this.localDisplayStatus ^= 1, this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._onUpdate());
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
    var r;
    if (this.destroyed)
      return;
    this.destroyed = !0;
    let e;
    if (this.children.length && (e = this.removeChildren(0, this.children.length)), this.removeFromParent(), this.parent = null, this._maskEffect = null, this._filterEffect = null, this.effects = null, this._position = null, this._scale = null, this._pivot = null, this._skew = null, this.emit("destroyed", this), this.removeAllListeners(), (typeof t == "boolean" ? t : t == null ? void 0 : t.children) && e)
      for (let n = 0; n < e.length; ++n)
        e[n].destroy(t);
    (r = this.renderGroup) == null || r.destroy(), this.renderGroup = null;
  }
}
Et.mixin(pu);
Et.mixin(Su);
Et.mixin(vu);
Et.mixin(yu);
Et.mixin(gu);
Et.mixin(_u);
Et.mixin(bu);
Et.mixin(uu);
class an extends Et {
  constructor() {
    super(...arguments), this.canBundle = !0, this.allowChildren = !1, this._roundPixels = 0, this._lastUsed = 0, this._lastInstructionTick = -1, this._bounds = new me(0, 1, 0, 0), this._boundsDirty = !0;
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
    const e = this.bounds, { x: i, y: r } = t;
    return i >= e.minX && i <= e.maxX && r >= e.minY && r <= e.maxY;
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
class Ai extends an {
  /**
   * @param options - The options for creating the sprite.
   */
  constructor(t = W.EMPTY) {
    t instanceof W && (t = { texture: t });
    const { texture: e = W.EMPTY, anchor: i, roundPixels: r, width: n, height: o, ...a } = t;
    super({
      label: "Sprite",
      ...a
    }), this.renderPipeId = "sprite", this.batched = !0, this._sourceBounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, this._sourceBoundsDirty = !0, this._anchor = new mt(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), i ? this.anchor = i : e.defaultAnchor && (this.anchor = e.defaultAnchor), this.texture = e, this.allowChildren = !1, this.roundPixels = r ?? !1, n !== void 0 && (this.width = n), o !== void 0 && (this.height = o);
  }
  /**
   * Helper function that creates a new sprite based on the source you provide.
   * The source can be - frame id, image, video, canvas element, video element, texture
   * @param source - Source to create texture from
   * @param [skipCache] - Whether to skip the cache or not
   * @returns The newly created sprite
   */
  static from(t, e = !1) {
    return t instanceof W ? new Ai(t) : new Ai(W.from(t, e));
  }
  set texture(t) {
    t || (t = W.EMPTY);
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
    eu(this._bounds, this._anchor, this._texture, 0);
  }
  _updateSourceBounds() {
    const t = this._anchor, e = this._texture, i = this._sourceBounds, { width: r, height: n } = e.orig;
    i.maxX = -t._x * r, i.minX = i.maxX + r, i.maxY = -t._y * n, i.minY = i.maxY + n;
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
const Tu = new me();
function gl(s, t, e) {
  const i = Tu;
  s.measurable = !0, cl(s, e, i), t.addBoundsMask(i), s.measurable = !1;
}
function _l(s, t, e) {
  const i = Si.get();
  s.measurable = !0;
  const r = Ae.get().identity(), n = xl(s, e, r);
  fl(s, i, n), s.measurable = !1, t.addBoundsMask(i), Ae.return(r), Si.return(i);
}
function xl(s, t, e) {
  return s ? (s !== t && (xl(s.parent, t, e), s.updateLocalTransform(), e.append(s.localTransform)), e) : (ct("Mask bounds, renderable is not inside the root container"), e);
}
class yl {
  constructor(t) {
    this.priority = 0, this.inverse = !1, this.pipe = "alphaMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.renderMaskToTexture = !(t instanceof Ai), this.mask.renderable = this.renderMaskToTexture, this.mask.includeInBuild = !this.renderMaskToTexture, this.mask.measurable = !1;
  }
  reset() {
    this.mask.measurable = !0, this.mask = null;
  }
  addBounds(t, e) {
    this.inverse || gl(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    _l(this.mask, t, e);
  }
  containsPoint(t, e) {
    const i = this.mask;
    return e(i, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof Ai;
  }
}
yl.extension = D.MaskEffect;
class vl {
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
vl.extension = D.MaskEffect;
class bl {
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
    gl(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    _l(this.mask, t, e);
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
bl.extension = D.MaskEffect;
const ku = {
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
let jo = ku;
const ot = {
  /**
   * Returns the current adapter.
   * @returns {environment.Adapter} The current adapter.
   */
  get() {
    return jo;
  },
  /**
   * Sets the current adapter.
   * @param adapter - The new adapter.
   */
  set(s) {
    jo = s;
  }
};
class wl extends _e {
  constructor(t) {
    t.resource || (t.resource = ot.get().createCanvas()), t.width || (t.width = t.resource.width, t.autoDensity || (t.width /= t.resolution)), t.height || (t.height = t.resource.height, t.autoDensity || (t.height /= t.resolution)), super(t), this.uploadMethodId = "image", this.autoDensity = t.autoDensity;
    const e = t.resource;
    (this.pixelWidth !== e.width || this.pixelWidth !== e.height) && this.resizeCanvas(), this.transparent = !!t.transparent;
  }
  resizeCanvas() {
    this.autoDensity && (this.resource.style.width = `${this.width}px`, this.resource.style.height = `${this.height}px`), (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) && (this.resource.width = this.pixelWidth, this.resource.height = this.pixelHeight);
  }
  resize(t = this.width, e = this.height, i = this._resolution) {
    const r = super.resize(t, e, i);
    return r && this.resizeCanvas(), r;
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
wl.extension = D.TextureSource;
class Ii extends _e {
  constructor(t) {
    if (t.resource && globalThis.HTMLImageElement && t.resource instanceof HTMLImageElement) {
      const e = ot.get().createCanvas(t.resource.width, t.resource.height);
      e.getContext("2d").drawImage(t.resource, 0, 0, t.resource.width, t.resource.height), t.resource = e, ct("ImageSource: Image element passed, converting to canvas. Use CanvasSource instead.");
    }
    super(t), this.uploadMethodId = "image", this.autoGarbageCollect = !0;
  }
  static test(t) {
    return globalThis.HTMLImageElement && t instanceof HTMLImageElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap || globalThis.VideoFrame && t instanceof VideoFrame;
  }
}
Ii.extension = D.TextureSource;
var cr = /* @__PURE__ */ ((s) => (s[s.INTERACTION = 50] = "INTERACTION", s[s.HIGH = 25] = "HIGH", s[s.NORMAL = 0] = "NORMAL", s[s.LOW = -25] = "LOW", s[s.UTILITY = -50] = "UTILITY", s))(cr || {});
class Rn {
  /**
   * Constructor
   * @private
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting
   * @param once - If the handler should fire once
   */
  constructor(t, e = null, i = 0, r = !1) {
    this.next = null, this.previous = null, this._destroyed = !1, this._fn = t, this._context = e, this.priority = i, this._once = r;
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
const Sl = class Vt {
  constructor() {
    this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new Rn(null, null, 1 / 0), this.deltaMS = 1 / Vt.targetFPMS, this.elapsedMS = 1 / Vt.targetFPMS, this._tick = (t) => {
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
  add(t, e, i = cr.NORMAL) {
    return this._addListener(new Rn(t, e, i));
  }
  /**
   * Add a handler for the tick event which is only execute once.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param {number} [priority=UPDATE_PRIORITY.NORMAL] - The priority for emitting
   * @returns This instance of a ticker
   */
  addOnce(t, e, i = cr.NORMAL) {
    return this._addListener(new Rn(t, e, i, !0));
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
        const n = t - this._lastFrame | 0;
        if (n < this._minElapsedMS)
          return;
        this._lastFrame = t - n % this._minElapsedMS;
      }
      this.deltaMS = e, this.deltaTime = this.deltaMS * Vt.targetFPMS;
      const i = this._head;
      let r = i.next;
      for (; r; )
        r = r.emit(this);
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
Sl.targetFPMS = 0.06;
let we = Sl, Fn;
async function Al() {
  return Fn ?? (Fn = (async () => {
    var o;
    const t = document.createElement("canvas").getContext("webgl");
    if (!t)
      return "premultiply-alpha-on-upload";
    const e = await new Promise((a) => {
      const l = document.createElement("video");
      l.onloadeddata = () => a(l), l.onerror = () => a(null), l.autoplay = !1, l.crossOrigin = "anonymous", l.preload = "auto", l.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", l.load();
    });
    if (!e)
      return "premultiply-alpha-on-upload";
    const i = t.createTexture();
    t.bindTexture(t.TEXTURE_2D, i);
    const r = t.createFramebuffer();
    t.bindFramebuffer(t.FRAMEBUFFER, r), t.framebufferTexture2D(
      t.FRAMEBUFFER,
      t.COLOR_ATTACHMENT0,
      t.TEXTURE_2D,
      i,
      0
    ), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e);
    const n = new Uint8Array(4);
    return t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, n), t.deleteFramebuffer(r), t.deleteTexture(i), (o = t.getExtension("WEBGL_lose_context")) == null || o.loseContext(), n[0] <= n[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
  })()), Fn;
}
const ln = class Cl extends _e {
  constructor(t) {
    super(t), this.isReady = !1, this.uploadMethodId = "video", t = {
      ...Cl.defaultOptions,
      ...t
    }, this._autoUpdate = !0, this._isConnectedToTicker = !1, this._updateFPS = t.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = t.autoPlay !== !1, this.alphaMode = t.alphaMode ?? "premultiply-alpha-on-upload", this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onCanPlayThrough = this._onCanPlayThrough.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), t.autoLoad !== !1 && this.load();
  }
  /** Update the video frame if the source is not destroyed and meets certain conditions. */
  updateFrame() {
    if (!this.destroyed) {
      if (this._updateFPS) {
        const t = we.shared.elapsedMS * this.resource.playbackRate;
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
    return (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = !0), t.addEventListener("play", this._onPlayStart), t.addEventListener("pause", this._onPlayStop), t.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (e.preload || t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlayThrough), t.addEventListener("error", this._onError, !0)), this.alphaMode = await Al(), this._load = new Promise((i, r) => {
      this.isValid ? i(this) : (this._resolve = i, this._reject = r, e.preloadTimeoutMs !== void 0 && (this._preloadTimeout = setTimeout(() => {
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
    this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.resource.requestVideoFrameCallback ? (this._isConnectedToTicker && (we.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    ))) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (we.shared.add(this.updateFrame, this), this._isConnectedToTicker = !0, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (we.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0));
  }
  static test(t) {
    return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement;
  }
};
ln.extension = D.TextureSource;
ln.defaultOptions = {
  ..._e.defaultOptions,
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
ln.MIME_TYPES = {
  ogv: "video/ogg",
  mov: "video/quicktime",
  m4v: "video/mp4"
};
let Ds = ln;
const se = (s, t, e = !1) => (Array.isArray(s) || (s = [s]), t ? s.map((i) => typeof i == "string" || e ? t(i) : i) : s);
class Eu {
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
    return e || ct(`[Assets] Asset id ${t} was not found in the Cache`), e;
  }
  /**
   * Set a value by key or keys name
   * @param key - The key or keys to set
   * @param value - The value to store in the cache or from which cacheable assets will be derived.
   */
  set(t, e) {
    const i = se(t);
    let r;
    for (let l = 0; l < this.parsers.length; l++) {
      const c = this.parsers[l];
      if (c.test(e)) {
        r = c.getCacheableAssets(i, e);
        break;
      }
    }
    const n = new Map(Object.entries(r || {}));
    r || i.forEach((l) => {
      n.set(l, e);
    });
    const o = [...n.keys()], a = {
      cacheKeys: o,
      keys: i
    };
    i.forEach((l) => {
      this._cacheMap.set(l, a);
    }), o.forEach((l) => {
      const c = r ? r[l] : e;
      this._cache.has(l) && this._cache.get(l) !== c && ct("[Cache] already has key:", l), this._cache.set(l, n.get(l));
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
      ct(`[Assets] Asset id ${t} was not found in the Cache`);
      return;
    }
    const e = this._cacheMap.get(t);
    e.cacheKeys.forEach((r) => {
      this._cache.delete(r);
    }), e.keys.forEach((r) => {
      this._cacheMap.delete(r);
    });
  }
  /** All loader parsers registered */
  get parsers() {
    return this._parsers;
  }
}
const st = new Eu(), ur = [];
At.handleByList(D.TextureSource, ur);
function Pl(s = {}) {
  const t = s && s.resource, e = t ? s.resource : s, i = t ? s : { resource: s };
  for (let r = 0; r < ur.length; r++) {
    const n = ur[r];
    if (n.test(e))
      return new n(i);
  }
  throw new Error(`Could not find a source type for resource: ${i.resource}`);
}
function Iu(s = {}, t = !1) {
  const e = s && s.resource, i = e ? s.resource : s, r = e ? s : { resource: s };
  if (!t && st.has(i))
    return st.get(i);
  const n = new W({ source: Pl(r) });
  return n.on("destroy", () => {
    st.has(i) && st.remove(i);
  }), t || st.set(i, n), n;
}
function Bu(s, t = !1) {
  return typeof s == "string" ? st.get(s) : s instanceof _e ? new W({ source: s }) : Iu(s, t);
}
W.from = Bu;
_e.from = Pl;
At.add(yl, vl, bl, Ds, Ii, wl, qr);
var Te = /* @__PURE__ */ ((s) => (s[s.Low = 0] = "Low", s[s.Normal = 1] = "Normal", s[s.High = 2] = "High", s))(Te || {});
function ie(s) {
  if (typeof s != "string")
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(s)}`);
}
function Ui(s) {
  return s.split("?")[0].split("#")[0];
}
function Ru(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Fu(s, t, e) {
  return s.replace(new RegExp(Ru(t), "g"), e);
}
function Lu(s, t) {
  let e = "", i = 0, r = -1, n = 0, o = -1;
  for (let a = 0; a <= s.length; ++a) {
    if (a < s.length)
      o = s.charCodeAt(a);
    else {
      if (o === 47)
        break;
      o = 47;
    }
    if (o === 47) {
      if (!(r === a - 1 || n === 1)) if (r !== a - 1 && n === 2) {
        if (e.length < 2 || i !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
          if (e.length > 2) {
            const l = e.lastIndexOf("/");
            if (l !== e.length - 1) {
              l === -1 ? (e = "", i = 0) : (e = e.slice(0, l), i = e.length - 1 - e.lastIndexOf("/")), r = a, n = 0;
              continue;
            }
          } else if (e.length === 2 || e.length === 1) {
            e = "", i = 0, r = a, n = 0;
            continue;
          }
        }
      } else
        e.length > 0 ? e += `/${s.slice(r + 1, a)}` : e = s.slice(r + 1, a), i = a - r - 1;
      r = a, n = 0;
    } else o === 46 && n !== -1 ? ++n : n = -1;
  }
  return e;
}
const bt = {
  /**
   * Converts a path to posix format.
   * @param path - The path to convert to posix
   */
  toPosix(s) {
    return Fu(s, "\\", "/");
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
    ie(s), s = this.toPosix(s);
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
    if (ie(s), this.isDataUrl(s) || this.isBlobUrl(s))
      return s;
    const i = Ui(this.toPosix(t ?? ot.get().getBaseUrl())), r = Ui(this.toPosix(e ?? this.rootname(i)));
    return s = this.toPosix(s), s.startsWith("/") ? bt.join(r, s.slice(1)) : this.isAbsolute(s) ? s : this.join(i, s);
  },
  /**
   * Normalizes the given path, resolving '..' and '.' segments
   * @param path - The path to normalize
   */
  normalize(s) {
    if (ie(s), s.length === 0)
      return ".";
    if (this.isDataUrl(s) || this.isBlobUrl(s))
      return s;
    s = this.toPosix(s);
    let t = "";
    const e = s.startsWith("/");
    this.hasProtocol(s) && (t = this.rootname(s), s = s.slice(t.length));
    const i = s.endsWith("/");
    return s = Lu(s), s.length > 0 && i && (s += "/"), e ? `/${s}` : t + s;
  },
  /**
   * Determines if path is an absolute path.
   * Absolute paths can be urls, data urls, or paths on disk
   * @param path - The path to test
   */
  isAbsolute(s) {
    return ie(s), s = this.toPosix(s), this.hasProtocol(s) ? !0 : s.startsWith("/");
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
      if (ie(i), i.length > 0)
        if (t === void 0)
          t = i;
        else {
          const r = s[e - 1] ?? "";
          this.joinExtensions.includes(this.extname(r).toLowerCase()) ? t += `/../${i}` : t += `/${i}`;
        }
    }
    return t === void 0 ? "." : this.normalize(t);
  },
  /**
   * Returns the directory name of a path
   * @param path - The path to parse
   */
  dirname(s) {
    if (ie(s), s.length === 0)
      return ".";
    s = this.toPosix(s);
    let t = s.charCodeAt(0);
    const e = t === 47;
    let i = -1, r = !0;
    const n = this.getProtocol(s), o = s;
    s = s.slice(n.length);
    for (let a = s.length - 1; a >= 1; --a)
      if (t = s.charCodeAt(a), t === 47) {
        if (!r) {
          i = a;
          break;
        }
      } else
        r = !1;
    return i === -1 ? e ? "/" : this.isUrl(o) ? n + s : n : e && i === 1 ? "//" : n + s.slice(0, i);
  },
  /**
   * Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
   * @param path - The path to parse
   */
  rootname(s) {
    ie(s), s = this.toPosix(s);
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
    ie(s), t && ie(t), s = Ui(this.toPosix(s));
    let e = 0, i = -1, r = !0, n;
    if (t !== void 0 && t.length > 0 && t.length <= s.length) {
      if (t.length === s.length && t === s)
        return "";
      let o = t.length - 1, a = -1;
      for (n = s.length - 1; n >= 0; --n) {
        const l = s.charCodeAt(n);
        if (l === 47) {
          if (!r) {
            e = n + 1;
            break;
          }
        } else
          a === -1 && (r = !1, a = n + 1), o >= 0 && (l === t.charCodeAt(o) ? --o === -1 && (i = n) : (o = -1, i = a));
      }
      return e === i ? i = a : i === -1 && (i = s.length), s.slice(e, i);
    }
    for (n = s.length - 1; n >= 0; --n)
      if (s.charCodeAt(n) === 47) {
        if (!r) {
          e = n + 1;
          break;
        }
      } else i === -1 && (r = !1, i = n + 1);
    return i === -1 ? "" : s.slice(e, i);
  },
  /**
   * Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
   * portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
   * the first character of the basename of path, an empty string is returned.
   * @param path - The path to parse
   */
  extname(s) {
    ie(s), s = Ui(this.toPosix(s));
    let t = -1, e = 0, i = -1, r = !0, n = 0;
    for (let o = s.length - 1; o >= 0; --o) {
      const a = s.charCodeAt(o);
      if (a === 47) {
        if (!r) {
          e = o + 1;
          break;
        }
        continue;
      }
      i === -1 && (r = !1, i = o + 1), a === 46 ? t === -1 ? t = o : n !== 1 && (n = 1) : t !== -1 && (n = -1);
    }
    return t === -1 || i === -1 || n === 0 || n === 1 && t === i - 1 && t === e + 1 ? "" : s.slice(t, i);
  },
  /**
   * Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
   * @param path - The path to parse
   */
  parse(s) {
    ie(s);
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (s.length === 0)
      return t;
    s = Ui(this.toPosix(s));
    let e = s.charCodeAt(0);
    const i = this.isAbsolute(s);
    let r;
    t.root = this.rootname(s), i || this.hasProtocol(s) ? r = 1 : r = 0;
    let n = -1, o = 0, a = -1, l = !0, c = s.length - 1, h = 0;
    for (; c >= r; --c) {
      if (e = s.charCodeAt(c), e === 47) {
        if (!l) {
          o = c + 1;
          break;
        }
        continue;
      }
      a === -1 && (l = !1, a = c + 1), e === 46 ? n === -1 ? n = c : h !== 1 && (h = 1) : n !== -1 && (h = -1);
    }
    return n === -1 || a === -1 || h === 0 || h === 1 && n === a - 1 && n === o + 1 ? a !== -1 && (o === 0 && i ? t.base = t.name = s.slice(1, a) : t.base = t.name = s.slice(o, a)) : (o === 0 && i ? (t.name = s.slice(1, n), t.base = s.slice(1, a)) : (t.name = s.slice(o, n), t.base = s.slice(o, a)), t.ext = s.slice(n, a)), t.dir = this.dirname(s), t;
  },
  sep: "/",
  delimiter: ":",
  joinExtensions: [".html"]
};
function Ml(s, t, e, i, r) {
  const n = t[e];
  for (let o = 0; o < n.length; o++) {
    const a = n[o];
    e < t.length - 1 ? Ml(s.replace(i[e], a), t, e + 1, i, r) : r.push(s.replace(i[e], a));
  }
}
function Ou(s) {
  const t = /\{(.*?)\}/g, e = s.match(t), i = [];
  if (e) {
    const r = [];
    e.forEach((n) => {
      const o = n.substring(1, n.length - 1).split(",");
      r.push(o);
    }), Ml(s, r, 0, e, i);
  } else
    i.push(s);
  return i;
}
const Ys = (s) => !Array.isArray(s);
class Bi {
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
    return se(
      e || i,
      (n) => typeof n == "string" ? n : Array.isArray(n) ? n.map((o) => (o == null ? void 0 : o.src) ?? o) : n != null && n.src ? n.src : n,
      !0
    );
  }
  /**
   * Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
   * generally a manifest would be built using a tool.
   * @param manifest - the manifest to add to the resolver
   */
  addManifest(t) {
    this._manifest && ct("[Resolver] Manifest already exists, this will be overwritten"), this._manifest = t, t.bundles.forEach((e) => {
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
    let r = e;
    Array.isArray(e) || (r = Object.entries(e).map(([n, o]) => typeof o == "string" || Array.isArray(o) ? { alias: n, src: o } : { alias: n, ...o })), r.forEach((n) => {
      const o = n.src, a = n.alias;
      let l;
      if (typeof a == "string") {
        const c = this._createBundleAssetId(t, a);
        i.push(c), l = [a, c];
      } else {
        const c = a.map((h) => this._createBundleAssetId(t, h));
        i.push(...c), l = [...a, ...c];
      }
      this.add({
        ...n,
        alias: l,
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
    i = (n) => {
      this.hasKey(n) && ct(`[Resolver] already has key: ${n} overwriting`);
    }, se(e).forEach((n) => {
      const { src: o } = n;
      let { data: a, format: l, loadParser: c } = n;
      const h = se(o).map((u) => typeof u == "string" ? Ou(u) : Array.isArray(u) ? u : [u]), f = this.getAlias(n);
      Array.isArray(f) ? f.forEach(i) : i(f);
      const d = [];
      h.forEach((u) => {
        u.forEach((m) => {
          let p = {};
          if (typeof m != "object") {
            p.src = m;
            for (let g = 0; g < this._parsers.length; g++) {
              const x = this._parsers[g];
              if (x.test(m)) {
                p = x.parse(m);
                break;
              }
            }
          } else
            a = m.data ?? a, l = m.format ?? l, c = m.loadParser ?? c, p = {
              ...p,
              ...m
            };
          if (!f)
            throw new Error(`[Resolver] alias is undefined for this asset: ${p.src}`);
          p = this._buildResolvedAsset(p, {
            aliases: f,
            data: a,
            format: l,
            loadParser: c
          }), d.push(p);
        });
      }), f.forEach((u) => {
        this._assetMap[u] = d;
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
    const e = Ys(t);
    t = se(t);
    const i = {};
    return t.forEach((r) => {
      const n = this._bundles[r];
      if (n) {
        const o = this.resolve(n), a = {};
        for (const l in o) {
          const c = o[l];
          a[this._extractAssetIdFromBundle(r, l)] = c;
        }
        i[r] = a;
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
      for (const r in e)
        i[r] = e[r].src;
      return i;
    }
    return e.src;
  }
  resolve(t) {
    const e = Ys(t);
    t = se(t);
    const i = {};
    return t.forEach((r) => {
      if (!this._resolverHash[r])
        if (this._assetMap[r]) {
          let n = this._assetMap[r];
          const o = this._getPreferredOrder(n);
          o == null || o.priority.forEach((a) => {
            o.params[a].forEach((l) => {
              const c = n.filter((h) => h[a] ? h[a] === l : !1);
              c.length && (n = c);
            });
          }), this._resolverHash[r] = n[0];
        } else
          this._resolverHash[r] = this._buildResolvedAsset({
            alias: [r],
            src: r
          }, {});
      i[r] = this._resolverHash[r];
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
      const i = t[0], r = this._preferredOrder.find((n) => n.params.format.includes(i.format));
      if (r)
        return r;
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
    const { aliases: i, data: r, loadParser: n, format: o } = e;
    return (this._basePath || this._rootPath) && (t.src = bt.toAbsolute(t.src, this._basePath, this._rootPath)), t.alias = i ?? t.alias ?? [t.src], t.src = this._appendDefaultSearchParams(t.src), t.data = { ...r || {}, ...t.data }, t.loadParser = n ?? t.loadParser, t.format = o ?? t.format ?? Du(t.src), t;
  }
}
Bi.RETINA_PREFIX = /@([0-9\.]+)x/;
function Du(s) {
  return s.split(".").pop().split("?").shift().split("#").shift();
}
const fr = (s, t) => {
  const e = t.split("?")[1];
  return e && (s += `?${e}`), s;
}, Tl = class $i {
  /**
   * @param texture - Reference to the source BaseTexture object.
   * @param {object} data - Spritesheet image data.
   */
  constructor(t, e) {
    this.linkedSheets = [], this._texture = t instanceof W ? t : null, this.textureSource = t.source, this.textures = {}, this.animations = {}, this.data = e;
    const i = parseFloat(e.meta.scale);
    i ? (this.resolution = i, t.source.resolution = this.resolution) : this.resolution = t.source._resolution, this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
  }
  /**
   * Parser spritesheet from loaded data. This is done asynchronously
   * to prevent creating too many Texture within a single process.
   */
  parse() {
    return new Promise((t) => {
      this._callback = t, this._batchIndex = 0, this._frameKeys.length <= $i.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
    });
  }
  /**
   * Process a batch of frames
   * @param initialFrameIndex - The index of frame to start.
   */
  _processFrames(t) {
    let e = t;
    const i = $i.BATCH_SIZE;
    for (; e - t < i && e < this._frameKeys.length; ) {
      const r = this._frameKeys[e], n = this._frames[r], o = n.frame;
      if (o) {
        let a = null, l = null;
        const c = n.trimmed !== !1 && n.sourceSize ? n.sourceSize : n.frame, h = new ft(
          0,
          0,
          Math.floor(c.w) / this.resolution,
          Math.floor(c.h) / this.resolution
        );
        n.rotated ? a = new ft(
          Math.floor(o.x) / this.resolution,
          Math.floor(o.y) / this.resolution,
          Math.floor(o.h) / this.resolution,
          Math.floor(o.w) / this.resolution
        ) : a = new ft(
          Math.floor(o.x) / this.resolution,
          Math.floor(o.y) / this.resolution,
          Math.floor(o.w) / this.resolution,
          Math.floor(o.h) / this.resolution
        ), n.trimmed !== !1 && n.spriteSourceSize && (l = new ft(
          Math.floor(n.spriteSourceSize.x) / this.resolution,
          Math.floor(n.spriteSourceSize.y) / this.resolution,
          Math.floor(o.w) / this.resolution,
          Math.floor(o.h) / this.resolution
        )), this.textures[r] = new W({
          source: this.textureSource,
          frame: a,
          orig: h,
          trim: l,
          rotate: n.rotated ? 2 : 0,
          defaultAnchor: n.anchor,
          defaultBorders: n.borders,
          label: r.toString()
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
        const r = t[e][i];
        this.animations[e].push(this.textures[r]);
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
    this._processFrames(this._batchIndex * $i.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
      this._batchIndex * $i.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
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
Tl.BATCH_SIZE = 1e3;
let Xo = Tl;
const zu = [
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
function kl(s, t, e) {
  const i = {};
  if (s.forEach((r) => {
    i[r] = t;
  }), Object.keys(t.textures).forEach((r) => {
    i[r] = t.textures[r];
  }), !e) {
    const r = bt.dirname(s[0]);
    t.linkedSheets.forEach((n, o) => {
      const a = kl([`${r}/${t.data.meta.related_multi_packs[o]}`], n, !0);
      Object.assign(i, a);
    });
  }
  return i;
}
const Uu = {
  extension: D.Asset,
  /** Handle the caching of the related Spritesheet Textures */
  cache: {
    test: (s) => s instanceof Xo,
    getCacheableAssets: (s, t) => kl(s, t, !1)
  },
  /** Resolve the resolution of the asset. */
  resolver: {
    extension: {
      type: D.ResolveParser,
      name: "resolveSpritesheet"
    },
    test: (s) => {
      const e = s.split("?")[0].split("."), i = e.pop(), r = e.pop();
      return i === "json" && zu.includes(r);
    },
    parse: (s) => {
      var e;
      const t = s.split(".");
      return {
        resolution: parseFloat(((e = Bi.RETINA_PREFIX.exec(s)) == null ? void 0 : e[1]) ?? "1"),
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
      priority: Te.Normal,
      name: "spritesheetLoader"
    },
    async testParse(s, t) {
      return bt.extname(t.src).toLowerCase() === ".json" && !!s.frames;
    },
    async parse(s, t, e) {
      var c, h;
      const {
        texture: i,
        // if user need to use preloaded texture
        imageFilename: r
        // if user need to use custom filename (not from jsonFile.meta.image)
      } = (t == null ? void 0 : t.data) ?? {};
      let n = bt.dirname(t.src);
      n && n.lastIndexOf("/") !== n.length - 1 && (n += "/");
      let o;
      if (i instanceof W)
        o = i;
      else {
        const f = fr(n + (r ?? s.meta.image), t.src);
        o = (await e.load([f]))[f];
      }
      const a = new Xo(
        o.source,
        s
      );
      await a.parse();
      const l = (c = s == null ? void 0 : s.meta) == null ? void 0 : c.related_multi_packs;
      if (Array.isArray(l)) {
        const f = [];
        for (const u of l) {
          if (typeof u != "string")
            continue;
          let m = n + u;
          (h = t.data) != null && h.ignoreMultiPack || (m = fr(m, t.src), f.push(e.load({
            src: m,
            data: {
              ignoreMultiPack: !0
            }
          })));
        }
        const d = await Promise.all(f);
        a.linkedSheets = d, d.forEach((u) => {
          u.linkedSheets = [a].concat(a.linkedSheets.filter((m) => m !== u));
        });
      }
      return a;
    },
    async unload(s, t, e) {
      await e.unload(s.textureSource._sourceOrigin), s.destroy(!1);
    }
  }
};
At.add(Uu);
const Ln = /* @__PURE__ */ Object.create(null), Ko = /* @__PURE__ */ Object.create(null);
function Qr(s, t) {
  let e = Ko[s];
  return e === void 0 && (Ln[t] === void 0 && (Ln[t] = 1), Ko[s] = e = Ln[t]++), e;
}
let ai;
function El() {
  return (!ai || ai != null && ai.isContextLost()) && (ai = ot.get().createCanvas().getContext("webgl", {})), ai;
}
let Ms;
function Gu() {
  if (!Ms) {
    Ms = "mediump";
    const s = El();
    s && s.getShaderPrecisionFormat && (Ms = s.getShaderPrecisionFormat(s.FRAGMENT_SHADER, s.HIGH_FLOAT).precision ? "highp" : "mediump");
  }
  return Ms;
}
function Vu(s, t, e) {
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
function Wu(s, t, e) {
  const i = e ? t.maxSupportedFragmentPrecision : t.maxSupportedVertexPrecision;
  if (s.substring(0, 9) !== "precision") {
    let r = e ? t.requestedFragmentPrecision : t.requestedVertexPrecision;
    return r === "highp" && i !== "highp" && (r = "mediump"), `precision ${r} float;
${s}`;
  } else if (i !== "highp" && s.substring(0, 15) === "precision highp")
    return s.replace("precision highp", "precision mediump");
  return s;
}
function Nu(s, t) {
  return t ? `#version 300 es
${s}` : s;
}
const Hu = {}, $u = {};
function Yu(s, { name: t = "pixi-program" }, e = !0) {
  t = t.replace(/\s+/g, "-"), t += e ? "-fragment" : "-vertex";
  const i = e ? Hu : $u;
  return i[t] ? (i[t]++, t += `-${i[t]}`) : i[t] = 1, s.indexOf("#define SHADER_NAME") !== -1 ? s : `${`#define SHADER_NAME ${t}`}
${s}`;
}
function ju(s, t) {
  return t ? s.replace("#version 300 es", "") : s;
}
const On = {
  // strips any version headers..
  stripVersion: ju,
  // adds precision string if not already present
  ensurePrecision: Wu,
  // add some defines if WebGL1 to make it more compatible with WebGL2 shaders
  addProgramDefines: Vu,
  // add the program name to the shader
  setProgramName: Yu,
  // add the version string to the shader header
  insertVersion: Nu
}, Dn = /* @__PURE__ */ Object.create(null), Il = class dr {
  /**
   * Creates a shiny new GlProgram. Used by WebGL renderer.
   * @param options - The options for the program.
   */
  constructor(t) {
    t = { ...dr.defaultOptions, ...t };
    const e = t.fragment.indexOf("#version 300 es") !== -1, i = {
      stripVersion: e,
      ensurePrecision: {
        requestedFragmentPrecision: t.preferredFragmentPrecision,
        requestedVertexPrecision: t.preferredVertexPrecision,
        maxSupportedVertexPrecision: "highp",
        maxSupportedFragmentPrecision: Gu()
      },
      setProgramName: {
        name: t.name
      },
      addProgramDefines: e,
      insertVersion: e
    };
    let r = t.fragment, n = t.vertex;
    Object.keys(On).forEach((o) => {
      const a = i[o];
      r = On[o](r, a, !0), n = On[o](n, a, !1);
    }), this.fragment = r, this.vertex = n, this._key = Qr(`${this.vertex}:${this.fragment}`, "gl-program");
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
    return Dn[e] || (Dn[e] = new dr(t)), Dn[e];
  }
};
Il.defaultOptions = {
  preferredVertexPrecision: "highp",
  preferredFragmentPrecision: "mediump"
};
let Bl = Il;
const qo = {
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
function Xu(s) {
  return qo[s] ?? qo.float32;
}
const Ku = {
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
function qu({ source: s, entryPoint: t }) {
  const e = {}, i = s.indexOf(`fn ${t}`);
  if (i !== -1) {
    const r = s.indexOf("->", i);
    if (r !== -1) {
      const n = s.substring(i, r), o = /@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;
      let a;
      for (; (a = o.exec(n)) !== null; ) {
        const l = Ku[a[3]] ?? "float32";
        e[a[2]] = {
          location: parseInt(a[1], 10),
          format: l,
          stride: Xu(l).stride,
          offset: 0,
          instance: !1,
          start: 0
        };
      }
    }
  }
  return e;
}
function zn(s) {
  var f, d;
  const t = /(^|[^/])@(group|binding)\(\d+\)[^;]+;/g, e = /@group\((\d+)\)/, i = /@binding\((\d+)\)/, r = /var(<[^>]+>)? (\w+)/, n = /:\s*(\w+)/, o = /struct\s+(\w+)\s*{([^}]+)}/g, a = /(\w+)\s*:\s*([\w\<\>]+)/g, l = /struct\s+(\w+)/, c = (f = s.match(t)) == null ? void 0 : f.map((u) => ({
    group: parseInt(u.match(e)[1], 10),
    binding: parseInt(u.match(i)[1], 10),
    name: u.match(r)[2],
    isUniform: u.match(r)[1] === "<uniform>",
    type: u.match(n)[1]
  }));
  if (!c)
    return {
      groups: [],
      structs: []
    };
  const h = ((d = s.match(o)) == null ? void 0 : d.map((u) => {
    const m = u.match(l)[1], p = u.match(a).reduce((g, x) => {
      const [y, v] = x.split(":");
      return g[y.trim()] = v.trim(), g;
    }, {});
    return p ? { name: m, members: p } : null;
  }).filter(({ name: u }) => c.some((m) => m.type === u))) ?? [];
  return {
    groups: c,
    structs: h
  };
}
var Yi = /* @__PURE__ */ ((s) => (s[s.VERTEX = 1] = "VERTEX", s[s.FRAGMENT = 2] = "FRAGMENT", s[s.COMPUTE = 4] = "COMPUTE", s))(Yi || {});
function Zu({ groups: s }) {
  const t = [];
  for (let e = 0; e < s.length; e++) {
    const i = s[e];
    t[i.group] || (t[i.group] = []), i.isUniform ? t[i.group].push({
      binding: i.binding,
      visibility: Yi.VERTEX | Yi.FRAGMENT,
      buffer: {
        type: "uniform"
      }
    }) : i.type === "sampler" ? t[i.group].push({
      binding: i.binding,
      visibility: Yi.FRAGMENT,
      sampler: {
        type: "filtering"
      }
    }) : i.type === "texture_2d" && t[i.group].push({
      binding: i.binding,
      visibility: Yi.FRAGMENT,
      texture: {
        sampleType: "float",
        viewDimension: "2d",
        multisampled: !1
      }
    });
  }
  return t;
}
function Qu({ groups: s }) {
  const t = [];
  for (let e = 0; e < s.length; e++) {
    const i = s[e];
    t[i.group] || (t[i.group] = {}), t[i.group][i.name] = i.binding;
  }
  return t;
}
function Ju(s, t) {
  const e = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [...s.structs, ...t.structs].filter((o) => e.has(o.name) ? !1 : (e.add(o.name), !0)), n = [...s.groups, ...t.groups].filter((o) => {
    const a = `${o.name}-${o.binding}`;
    return i.has(a) ? !1 : (i.add(a), !0);
  });
  return { structs: r, groups: n };
}
const Un = /* @__PURE__ */ Object.create(null);
class hn {
  /**
   * Create a new GpuProgram
   * @param options - The options for the gpu program
   */
  constructor(t) {
    var a, l;
    this._layoutKey = 0, this._attributeLocationsKey = 0;
    const { fragment: e, vertex: i, layout: r, gpuLayout: n, name: o } = t;
    if (this.name = o, this.fragment = e, this.vertex = i, e.source === i.source) {
      const c = zn(e.source);
      this.structsAndGroups = c;
    } else {
      const c = zn(i.source), h = zn(e.source);
      this.structsAndGroups = Ju(c, h);
    }
    this.layout = r ?? Qu(this.structsAndGroups), this.gpuLayout = n ?? Zu(this.structsAndGroups), this.autoAssignGlobalUniforms = ((a = this.layout[0]) == null ? void 0 : a.globalUniforms) !== void 0, this.autoAssignLocalUniforms = ((l = this.layout[1]) == null ? void 0 : l.localUniforms) !== void 0, this._generateProgramKey();
  }
  // TODO maker this pure
  _generateProgramKey() {
    const { vertex: t, fragment: e } = this, i = t.source + e.source + t.entryPoint + e.entryPoint;
    this._layoutKey = Qr(i, "program");
  }
  get attributeData() {
    return this._attributeData ?? (this._attributeData = qu(this.vertex)), this._attributeData;
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
    return Un[e] || (Un[e] = new hn(t)), Un[e];
  }
}
const Rl = [
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
], tf = Rl.reduce((s, t) => (s[t] = !0, s), {});
function ef(s, t) {
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
const Fl = class Ll {
  /**
   * Create a new Uniform group
   * @param uniformStructures - The structures of the uniform group
   * @param options - The optional parameters of this uniform group
   */
  constructor(t, e) {
    this._touched = 0, this.uid = gt("uniform"), this._resourceType = "uniformGroup", this._resourceId = gt("resource"), this.isUniformGroup = !0, this._dirtyId = 0, this.destroyed = !1, e = { ...Ll.defaultOptions, ...e }, this.uniformStructures = t;
    const i = {};
    for (const r in t) {
      const n = t[r];
      if (n.name = r, n.size = n.size ?? 1, !tf[n.type])
        throw new Error(`Uniform type ${n.type} is not supported. Supported uniform types are: ${Rl.join(", ")}`);
      n.value ?? (n.value = ef(n.type, n.size)), i[r] = n.value;
    }
    this.uniforms = i, this._dirtyId = 1, this.ubo = e.ubo, this.isStatic = e.isStatic, this._signature = Qr(Object.keys(i).map(
      (r) => `${r}-${t[r].type}`
    ).join("-"), "uniform-group");
  }
  /** Call this if you want the uniform groups data to be uploaded to the GPU only useful if `isStatic` is true. */
  update() {
    this._dirtyId++;
  }
};
Fl.defaultOptions = {
  /** if true the UniformGroup is handled as an Uniform buffer object. */
  ubo: !1,
  /** if true, then you are responsible for when the data is uploaded to the GPU by calling `update()` */
  isStatic: !1
};
let Ol = Fl;
class zs {
  /**
   * Create a new instance eof the Bind Group.
   * @param resources - The resources that are bound together for use by a shader.
   */
  constructor(t) {
    this.resources = /* @__PURE__ */ Object.create(null), this._dirty = !0;
    let e = 0;
    for (const i in t) {
      const r = t[i];
      this.setResource(r, e++);
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
    var r, n;
    const i = this.resources[e];
    t !== i && (i && ((r = t.off) == null || r.call(t, "change", this.onResourceChange, this)), (n = t.on) == null || n.call(t, "change", this.onResourceChange, this), this.resources[e] = t, this._dirty = !0);
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
      const r = t[i];
      (e = r.off) == null || e.call(r, "change", this.onResourceChange, this);
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
var pr = /* @__PURE__ */ ((s) => (s[s.WEBGL = 1] = "WEBGL", s[s.WEBGPU = 2] = "WEBGPU", s[s.BOTH = 3] = "BOTH", s))(pr || {});
class Jr extends Mt {
  constructor(t) {
    super(), this._uniformBindMap = /* @__PURE__ */ Object.create(null), this._ownedBindGroups = [];
    let {
      gpuProgram: e,
      glProgram: i,
      groups: r,
      resources: n,
      compatibleRenderers: o,
      groupMap: a
    } = t;
    this.gpuProgram = e, this.glProgram = i, o === void 0 && (o = 0, e && (o |= pr.WEBGPU), i && (o |= pr.WEBGL)), this.compatibleRenderers = o;
    const l = {};
    if (!n && !r && (n = {}), n && r)
      throw new Error("[Shader] Cannot have both resources and groups");
    if (!e && r && !a)
      throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
    if (!e && r && a)
      for (const c in a)
        for (const h in a[c]) {
          const f = a[c][h];
          l[f] = {
            group: c,
            binding: h,
            name: f
          };
        }
    else if (e && r && !a) {
      const c = e.structsAndGroups.groups;
      a = {}, c.forEach((h) => {
        a[h.group] = a[h.group] || {}, a[h.group][h.binding] = h.name, l[h.name] = h;
      });
    } else if (n) {
      r = {}, a = {}, e && e.structsAndGroups.groups.forEach((f) => {
        a[f.group] = a[f.group] || {}, a[f.group][f.binding] = f.name, l[f.name] = f;
      });
      let c = 0;
      for (const h in n)
        l[h] || (r[99] || (r[99] = new zs(), this._ownedBindGroups.push(r[99])), l[h] = { group: 99, binding: c, name: h }, a[99] = a[99] || {}, a[99][c] = h, c++);
      for (const h in n) {
        const f = h;
        let d = n[h];
        !d.source && !d._resourceType && (d = new Ol(d));
        const u = l[f];
        u && (r[u.group] || (r[u.group] = new zs(), this._ownedBindGroups.push(r[u.group])), r[u.group].setResource(d, u.binding));
      }
    }
    this.groups = r, this._uniformBindMap = a, this.resources = this._buildResourceAccessor(r, l);
  }
  /**
   * Sometimes a resource group will be provided later (for example global uniforms)
   * In such cases, this method can be used to let the shader know about the group.
   * @param name - the name of the resource group
   * @param groupIndex - the index of the group (should match the webGPU shader group location)
   * @param bindIndex - the index of the bind point (should match the webGPU shader bind point)
   */
  addResource(t, e, i) {
    var r, n;
    (r = this._uniformBindMap)[e] || (r[e] = {}), (n = this._uniformBindMap[e])[i] || (n[i] = t), this.groups[e] || (this.groups[e] = new zs(), this._ownedBindGroups.push(this.groups[e]));
  }
  _buildResourceAccessor(t, e) {
    const i = {};
    for (const r in e) {
      const n = e[r];
      Object.defineProperty(i, n.name, {
        get() {
          return t[n.group].getResource(n.binding);
        },
        set(o) {
          t[n.group].setResource(o, n.binding);
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
    this.emit("destroy", this), t && ((e = this.gpuProgram) == null || e.destroy(), (i = this.glProgram) == null || i.destroy()), this.gpuProgram = null, this.glProgram = null, this.removeAllListeners(), this._uniformBindMap = null, this._ownedBindGroups.forEach((r) => {
      r.destroy();
    }), this._ownedBindGroups = null, this.resources = null, this.groups = null;
  }
  static from(t) {
    const { gpu: e, gl: i, ...r } = t;
    let n, o;
    return e && (n = hn.from(e)), i && (o = Bl.from(i)), new Jr({
      gpuProgram: n,
      glProgram: o,
      ...r
    });
  }
}
const mr = [];
At.handleByNamedList(D.Environment, mr);
async function sf(s) {
  if (!s)
    for (let t = 0; t < mr.length; t++) {
      const e = mr[t];
      if (e.value.test()) {
        await e.value.load();
        return;
      }
    }
}
let Gi;
function nf() {
  if (typeof Gi == "boolean")
    return Gi;
  try {
    Gi = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === !0;
  } catch {
    Gi = !1;
  }
  return Gi;
}
var to = { exports: {} };
to.exports = cn;
to.exports.default = cn;
function cn(s, t, e) {
  e = e || 2;
  var i = t && t.length, r = i ? t[0] * e : s.length, n = Dl(s, 0, r, e, !0), o = [];
  if (!n || n.next === n.prev) return o;
  var a, l, c, h, f, d, u;
  if (i && (n = hf(s, t, n, e)), s.length > 80 * e) {
    a = c = s[0], l = h = s[1];
    for (var m = e; m < r; m += e)
      f = s[m], d = s[m + 1], f < a && (a = f), d < l && (l = d), f > c && (c = f), d > h && (h = d);
    u = Math.max(c - a, h - l), u = u !== 0 ? 32767 / u : 0;
  }
  return ns(n, o, e, a, l, u, 0), o;
}
function Dl(s, t, e, i, r) {
  var n, o;
  if (r === xr(s, t, e, i) > 0)
    for (n = t; n < e; n += i) o = Zo(n, s[n], s[n + 1], o);
  else
    for (n = e - i; n >= t; n -= i) o = Zo(n, s[n], s[n + 1], o);
  return o && un(o, o.next) && (os(o), o = o.next), o;
}
function ei(s, t) {
  if (!s) return s;
  t || (t = s);
  var e = s, i;
  do
    if (i = !1, !e.steiner && (un(e, e.next) || nt(e.prev, e, e.next) === 0)) {
      if (os(e), e = t = e.prev, e === e.next) break;
      i = !0;
    } else
      e = e.next;
  while (i || e !== t);
  return t;
}
function ns(s, t, e, i, r, n, o) {
  if (s) {
    !o && n && pf(s, i, r, n);
    for (var a = s, l, c; s.prev !== s.next; ) {
      if (l = s.prev, c = s.next, n ? of(s, i, r, n) : rf(s)) {
        t.push(l.i / e | 0), t.push(s.i / e | 0), t.push(c.i / e | 0), os(s), s = c.next, a = c.next;
        continue;
      }
      if (s = c, s === a) {
        o ? o === 1 ? (s = af(ei(s), t, e), ns(s, t, e, i, r, n, 2)) : o === 2 && lf(s, t, e, i, r, n) : ns(ei(s), t, e, i, r, n, 1);
        break;
      }
    }
  }
}
function rf(s) {
  var t = s.prev, e = s, i = s.next;
  if (nt(t, e, i) >= 0) return !1;
  for (var r = t.x, n = e.x, o = i.x, a = t.y, l = e.y, c = i.y, h = r < n ? r < o ? r : o : n < o ? n : o, f = a < l ? a < c ? a : c : l < c ? l : c, d = r > n ? r > o ? r : o : n > o ? n : o, u = a > l ? a > c ? a : c : l > c ? l : c, m = i.next; m !== t; ) {
    if (m.x >= h && m.x <= d && m.y >= f && m.y <= u && fi(r, a, n, l, o, c, m.x, m.y) && nt(m.prev, m, m.next) >= 0) return !1;
    m = m.next;
  }
  return !0;
}
function of(s, t, e, i) {
  var r = s.prev, n = s, o = s.next;
  if (nt(r, n, o) >= 0) return !1;
  for (var a = r.x, l = n.x, c = o.x, h = r.y, f = n.y, d = o.y, u = a < l ? a < c ? a : c : l < c ? l : c, m = h < f ? h < d ? h : d : f < d ? f : d, p = a > l ? a > c ? a : c : l > c ? l : c, g = h > f ? h > d ? h : d : f > d ? f : d, x = gr(u, m, t, e, i), y = gr(p, g, t, e, i), v = s.prevZ, w = s.nextZ; v && v.z >= x && w && w.z <= y; ) {
    if (v.x >= u && v.x <= p && v.y >= m && v.y <= g && v !== r && v !== o && fi(a, h, l, f, c, d, v.x, v.y) && nt(v.prev, v, v.next) >= 0 || (v = v.prevZ, w.x >= u && w.x <= p && w.y >= m && w.y <= g && w !== r && w !== o && fi(a, h, l, f, c, d, w.x, w.y) && nt(w.prev, w, w.next) >= 0)) return !1;
    w = w.nextZ;
  }
  for (; v && v.z >= x; ) {
    if (v.x >= u && v.x <= p && v.y >= m && v.y <= g && v !== r && v !== o && fi(a, h, l, f, c, d, v.x, v.y) && nt(v.prev, v, v.next) >= 0) return !1;
    v = v.prevZ;
  }
  for (; w && w.z <= y; ) {
    if (w.x >= u && w.x <= p && w.y >= m && w.y <= g && w !== r && w !== o && fi(a, h, l, f, c, d, w.x, w.y) && nt(w.prev, w, w.next) >= 0) return !1;
    w = w.nextZ;
  }
  return !0;
}
function af(s, t, e) {
  var i = s;
  do {
    var r = i.prev, n = i.next.next;
    !un(r, n) && zl(r, i, i.next, n) && rs(r, n) && rs(n, r) && (t.push(r.i / e | 0), t.push(i.i / e | 0), t.push(n.i / e | 0), os(i), os(i.next), i = s = n), i = i.next;
  } while (i !== s);
  return ei(i);
}
function lf(s, t, e, i, r, n) {
  var o = s;
  do {
    for (var a = o.next.next; a !== o.prev; ) {
      if (o.i !== a.i && _f(o, a)) {
        var l = Ul(o, a);
        o = ei(o, o.next), l = ei(l, l.next), ns(o, t, e, i, r, n, 0), ns(l, t, e, i, r, n, 0);
        return;
      }
      a = a.next;
    }
    o = o.next;
  } while (o !== s);
}
function hf(s, t, e, i) {
  var r = [], n, o, a, l, c;
  for (n = 0, o = t.length; n < o; n++)
    a = t[n] * i, l = n < o - 1 ? t[n + 1] * i : s.length, c = Dl(s, a, l, i, !1), c === c.next && (c.steiner = !0), r.push(gf(c));
  for (r.sort(cf), n = 0; n < r.length; n++)
    e = uf(r[n], e);
  return e;
}
function cf(s, t) {
  return s.x - t.x;
}
function uf(s, t) {
  var e = ff(s, t);
  if (!e)
    return t;
  var i = Ul(e, s);
  return ei(i, i.next), ei(e, e.next);
}
function ff(s, t) {
  var e = t, i = s.x, r = s.y, n = -1 / 0, o;
  do {
    if (r <= e.y && r >= e.next.y && e.next.y !== e.y) {
      var a = e.x + (r - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (a <= i && a > n && (n = a, o = e.x < e.next.x ? e : e.next, a === i))
        return o;
    }
    e = e.next;
  } while (e !== t);
  if (!o) return null;
  var l = o, c = o.x, h = o.y, f = 1 / 0, d;
  e = o;
  do
    i >= e.x && e.x >= c && i !== e.x && fi(r < h ? i : n, r, c, h, r < h ? n : i, r, e.x, e.y) && (d = Math.abs(r - e.y) / (i - e.x), rs(e, s) && (d < f || d === f && (e.x > o.x || e.x === o.x && df(o, e))) && (o = e, f = d)), e = e.next;
  while (e !== l);
  return o;
}
function df(s, t) {
  return nt(s.prev, s, t.prev) < 0 && nt(t.next, s, s.next) < 0;
}
function pf(s, t, e, i) {
  var r = s;
  do
    r.z === 0 && (r.z = gr(r.x, r.y, t, e, i)), r.prevZ = r.prev, r.nextZ = r.next, r = r.next;
  while (r !== s);
  r.prevZ.nextZ = null, r.prevZ = null, mf(r);
}
function mf(s) {
  var t, e, i, r, n, o, a, l, c = 1;
  do {
    for (e = s, s = null, n = null, o = 0; e; ) {
      for (o++, i = e, a = 0, t = 0; t < c && (a++, i = i.nextZ, !!i); t++)
        ;
      for (l = c; a > 0 || l > 0 && i; )
        a !== 0 && (l === 0 || !i || e.z <= i.z) ? (r = e, e = e.nextZ, a--) : (r = i, i = i.nextZ, l--), n ? n.nextZ = r : s = r, r.prevZ = n, n = r;
      e = i;
    }
    n.nextZ = null, c *= 2;
  } while (o > 1);
  return s;
}
function gr(s, t, e, i, r) {
  return s = (s - e) * r | 0, t = (t - i) * r | 0, s = (s | s << 8) & 16711935, s = (s | s << 4) & 252645135, s = (s | s << 2) & 858993459, s = (s | s << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, s | t << 1;
}
function gf(s) {
  var t = s, e = s;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== s);
  return e;
}
function fi(s, t, e, i, r, n, o, a) {
  return (r - o) * (t - a) >= (s - o) * (n - a) && (s - o) * (i - a) >= (e - o) * (t - a) && (e - o) * (n - a) >= (r - o) * (i - a);
}
function _f(s, t) {
  return s.next.i !== t.i && s.prev.i !== t.i && !xf(s, t) && // dones't intersect other edges
  (rs(s, t) && rs(t, s) && yf(s, t) && // locally visible
  (nt(s.prev, s, t.prev) || nt(s, t.prev, t)) || // does not create opposite-facing sectors
  un(s, t) && nt(s.prev, s, s.next) > 0 && nt(t.prev, t, t.next) > 0);
}
function nt(s, t, e) {
  return (t.y - s.y) * (e.x - t.x) - (t.x - s.x) * (e.y - t.y);
}
function un(s, t) {
  return s.x === t.x && s.y === t.y;
}
function zl(s, t, e, i) {
  var r = ks(nt(s, t, e)), n = ks(nt(s, t, i)), o = ks(nt(e, i, s)), a = ks(nt(e, i, t));
  return !!(r !== n && o !== a || r === 0 && Ts(s, e, t) || n === 0 && Ts(s, i, t) || o === 0 && Ts(e, s, i) || a === 0 && Ts(e, t, i));
}
function Ts(s, t, e) {
  return t.x <= Math.max(s.x, e.x) && t.x >= Math.min(s.x, e.x) && t.y <= Math.max(s.y, e.y) && t.y >= Math.min(s.y, e.y);
}
function ks(s) {
  return s > 0 ? 1 : s < 0 ? -1 : 0;
}
function xf(s, t) {
  var e = s;
  do {
    if (e.i !== s.i && e.next.i !== s.i && e.i !== t.i && e.next.i !== t.i && zl(e, e.next, s, t)) return !0;
    e = e.next;
  } while (e !== s);
  return !1;
}
function rs(s, t) {
  return nt(s.prev, s, s.next) < 0 ? nt(s, t, s.next) >= 0 && nt(s, s.prev, t) >= 0 : nt(s, t, s.prev) < 0 || nt(s, s.next, t) < 0;
}
function yf(s, t) {
  var e = s, i = !1, r = (s.x + t.x) / 2, n = (s.y + t.y) / 2;
  do
    e.y > n != e.next.y > n && e.next.y !== e.y && r < (e.next.x - e.x) * (n - e.y) / (e.next.y - e.y) + e.x && (i = !i), e = e.next;
  while (e !== s);
  return i;
}
function Ul(s, t) {
  var e = new _r(s.i, s.x, s.y), i = new _r(t.i, t.x, t.y), r = s.next, n = t.prev;
  return s.next = t, t.prev = s, e.next = r, r.prev = e, i.next = e, e.prev = i, n.next = i, i.prev = n, i;
}
function Zo(s, t, e, i) {
  var r = new _r(s, t, e);
  return i ? (r.next = i.next, r.prev = i, i.next.prev = r, i.next = r) : (r.prev = r, r.next = r), r;
}
function os(s) {
  s.next.prev = s.prev, s.prev.next = s.next, s.prevZ && (s.prevZ.nextZ = s.nextZ), s.nextZ && (s.nextZ.prevZ = s.prevZ);
}
function _r(s, t, e) {
  this.i = s, this.x = t, this.y = e, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
cn.deviation = function(s, t, e, i) {
  var r = t && t.length, n = r ? t[0] * e : s.length, o = Math.abs(xr(s, 0, n, e));
  if (r)
    for (var a = 0, l = t.length; a < l; a++) {
      var c = t[a] * e, h = a < l - 1 ? t[a + 1] * e : s.length;
      o -= Math.abs(xr(s, c, h, e));
    }
  var f = 0;
  for (a = 0; a < i.length; a += 3) {
    var d = i[a] * e, u = i[a + 1] * e, m = i[a + 2] * e;
    f += Math.abs(
      (s[d] - s[m]) * (s[u + 1] - s[d + 1]) - (s[d] - s[u]) * (s[m + 1] - s[d + 1])
    );
  }
  return o === 0 && f === 0 ? 0 : Math.abs((f - o) / o);
};
function xr(s, t, e, i) {
  for (var r = 0, n = t, o = e - i; n < e; n += i)
    r += (s[o] - s[n]) * (s[n + 1] + s[o + 1]), o = n;
  return r;
}
cn.flatten = function(s) {
  for (var t = s[0][0].length, e = { vertices: [], holes: [], dimensions: t }, i = 0, r = 0; r < s.length; r++) {
    for (var n = 0; n < s[r].length; n++)
      for (var o = 0; o < t; o++) e.vertices.push(s[r][n][o]);
    r > 0 && (i += s[r - 1].length, e.holes.push(i));
  }
  return e;
};
var vf = to.exports;
const bf = /* @__PURE__ */ Kr(vf);
var Gl = /* @__PURE__ */ ((s) => (s[s.NONE = 0] = "NONE", s[s.COLOR = 16384] = "COLOR", s[s.STENCIL = 1024] = "STENCIL", s[s.DEPTH = 256] = "DEPTH", s[s.COLOR_DEPTH = 16640] = "COLOR_DEPTH", s[s.COLOR_STENCIL = 17408] = "COLOR_STENCIL", s[s.DEPTH_STENCIL = 1280] = "DEPTH_STENCIL", s[s.ALL = 17664] = "ALL", s))(Gl || {});
class wf {
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
  emit(t, e, i, r, n, o, a, l) {
    const { name: c, items: h } = this;
    for (let f = 0, d = h.length; f < d; f++)
      h[f][c](t, e, i, r, n, o, a, l);
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
const Sf = [
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
], Vl = class Wl extends Mt {
  /**
   * Set up a system with a collection of SystemClasses and runners.
   * Systems are attached dynamically to this class when added.
   * @param config - the config for the system manager
   */
  constructor(t) {
    super(), this.runners = /* @__PURE__ */ Object.create(null), this.renderPipes = /* @__PURE__ */ Object.create(null), this._initOptions = {}, this._systemsHash = /* @__PURE__ */ Object.create(null), this.type = t.type, this.name = t.name, this.config = t;
    const e = [...Sf, ...this.config.runners ?? []];
    this._addRunners(...e), this._unsafeEvalCheck();
  }
  /**
   * Initialize the renderer.
   * @param options - The options to use to create the renderer.
   */
  async init(t = {}) {
    const e = t.skipExtensionImports === !0 ? !0 : t.manageImports === !1;
    await sf(e), this._addSystems(this.config.systems), this._addPipes(this.config.renderPipes, this.config.renderPipeAdaptors);
    for (const i in this._systemsHash)
      t = { ...this._systemsHash[i].constructor.defaultOptions, ...t };
    t = { ...Wl.defaultOptions, ...t }, this._roundPixels = t.roundPixels ? 1 : 0;
    for (let i = 0; i < this.runners.init.items.length; i++)
      await this.runners.init.items[i].init(t);
    this._initOptions = t;
  }
  render(t, e) {
    let i = t;
    if (i instanceof Et && (i = { container: i }, e && ($(Y, "passing a second argument is deprecated, please use render options instead"), i.target = e.renderTexture)), i.target || (i.target = this.view.renderTarget), i.target === this.view.renderTarget && (this._lastObjectRendered = i.container, i.clearColor = this.background.colorRgba), i.clearColor) {
      const r = Array.isArray(i.clearColor) && i.clearColor.length === 4;
      i.clearColor = r ? i.clearColor : dt.shared.setValue(i.clearColor).toArray();
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
    const r = this.view.resolution;
    this.view.resize(t, e, i), this.emit("resize", this.view.screen.width, this.view.screen.height, this.view.resolution), i !== void 0 && i !== r && this.runners.resolutionChange.emit(i);
  }
  clear(t = {}) {
    const e = this;
    t.target || (t.target = e.renderTarget.renderTarget), t.clearColor || (t.clearColor = this.background.colorRgba), t.clear ?? (t.clear = Gl.ALL);
    const { clear: i, clearColor: r, target: n } = t;
    dt.shared.setValue(r ?? this.background.colorRgba), e.renderTarget.clear(n, i, dt.shared.toArray());
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
      this.runners[e] = new wf(e);
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
    for (const r in this.runners)
      this.runners[r].add(i);
    return this;
  }
  _addPipes(t, e) {
    const i = e.reduce((r, n) => (r[n.name] = n.value, r), {});
    t.forEach((r) => {
      const n = r.value, o = r.name, a = i[o];
      this.renderPipes[o] = new n(
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
    if (!nf())
      throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
  }
};
Vl.defaultOptions = {
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
let Nl = Vl, Es;
function Af(s) {
  return Es !== void 0 || (Es = (() => {
    var e;
    const t = {
      stencil: !0,
      failIfMajorPerformanceCaveat: s ?? Nl.defaultOptions.failIfMajorPerformanceCaveat
    };
    try {
      if (!ot.get().getWebGLRenderingContext())
        return !1;
      let r = ot.get().createCanvas().getContext("webgl", t);
      const n = !!((e = r == null ? void 0 : r.getContextAttributes()) != null && e.stencil);
      if (r) {
        const o = r.getExtension("WEBGL_lose_context");
        o && o.loseContext();
      }
      return r = null, n;
    } catch {
      return !1;
    }
  })()), Es;
}
let Is;
async function Cf(s = {}) {
  return Is !== void 0 || (Is = await (async () => {
    const t = ot.get().getNavigator().gpu;
    if (!t)
      return !1;
    try {
      return await (await t.requestAdapter(s)).requestDevice(), !0;
    } catch {
      return !1;
    }
  })()), Is;
}
const Qo = ["webgl", "webgpu", "canvas"];
async function Pf(s) {
  let t = [];
  s.preference ? (t.push(s.preference), Qo.forEach((n) => {
    n !== s.preference && t.push(n);
  })) : t = Qo.slice();
  let e, i = {};
  for (let n = 0; n < t.length; n++) {
    const o = t[n];
    if (o === "webgpu" && await Cf()) {
      const { WebGPURenderer: a } = await import("./WebGPURenderer-BAyVtA1v.js");
      e = a, i = { ...s, ...s.webgpu };
      break;
    } else if (o === "webgl" && Af(
      s.failIfMajorPerformanceCaveat ?? Nl.defaultOptions.failIfMajorPerformanceCaveat
    )) {
      const { WebGLRenderer: a } = await import("./WebGLRenderer-DI9JlOnI.js");
      e = a, i = { ...s, ...s.webgl };
      break;
    } else if (o === "canvas")
      throw i = { ...s }, new Error("CanvasRenderer is not yet implemented");
  }
  if (delete i.webgpu, delete i.webgl, !e)
    throw new Error("No available renderer for the current environment");
  const r = new e();
  return await r.init(i), r;
}
const Hl = "8.5.2";
class $l {
  static init() {
    var t;
    (t = globalThis.__PIXI_APP_INIT__) == null || t.call(globalThis, this, Hl);
  }
  static destroy() {
  }
}
$l.extension = D.Application;
class Mf {
  constructor(t) {
    this._renderer = t;
  }
  init() {
    var t;
    (t = globalThis.__PIXI_RENDERER_INIT__) == null || t.call(globalThis, this._renderer, Hl);
  }
  destroy() {
    this._renderer = null;
  }
}
Mf.extension = {
  type: [
    D.WebGLSystem,
    D.WebGPUSystem
  ],
  name: "initHook",
  priority: -10
};
const Yl = class yr {
  /** @ignore */
  constructor(...t) {
    this.stage = new Et(), t[0] !== void 0 && $(Y, "Application constructor options are deprecated, please use Application.init() instead.");
  }
  /**
   * @param options - The optional application and renderer parameters.
   */
  async init(t) {
    t = { ...t }, this.renderer = await Pf(t), yr._plugins.forEach((e) => {
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
    return $(Y, "Application.view is deprecated, please use Application.canvas instead."), this.renderer.canvas;
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
    const i = yr._plugins.slice(0);
    i.reverse(), i.forEach((r) => {
      r.destroy.call(this);
    }), this.stage.destroy(e), this.stage = null, this.renderer.destroy(t), this.renderer = null;
  }
};
Yl._plugins = [];
let jl = Yl;
At.handleByList(D.Application, jl._plugins);
At.add($l);
class Xl extends Mt {
  constructor() {
    super(...arguments), this.chars = /* @__PURE__ */ Object.create(null), this.lineHeight = 0, this.fontFamily = "", this.fontMetrics = { fontSize: 0, ascent: 0, descent: 0 }, this.baseLineOffset = 0, this.distanceField = { type: "none", range: 0 }, this.pages = [], this.applyFillAsTint = !0, this.baseMeasurementFontSize = 100, this.baseRenderedFontSize = 100;
  }
  /**
   * The name of the font face.
   * @deprecated since 8.0.0 Use `fontFamily` instead.
   */
  get font() {
    return $(Y, "BitmapFont.font is deprecated, please use BitmapFont.fontFamily instead."), this.fontFamily;
  }
  /**
   * The map of base page textures (i.e., sheets of glyphs).
   * @deprecated since 8.0.0 Use `pages` instead.
   */
  get pageTextures() {
    return $(Y, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
  }
  /**
   * The size of the font face in pixels.
   * @deprecated since 8.0.0 Use `fontMetrics.fontSize` instead.
   */
  get size() {
    return $(Y, "BitmapFont.size is deprecated, please use BitmapFont.fontMetrics.fontSize instead."), this.fontMetrics.fontSize;
  }
  /**
   * The kind of distance field for this font or "none".
   * @deprecated since 8.0.0 Use `distanceField.type` instead.
   */
  get distanceFieldRange() {
    return $(Y, "BitmapFont.distanceFieldRange is deprecated, please use BitmapFont.distanceField.range instead."), this.distanceField.range;
  }
  /**
   * The range of the distance field in pixels.
   * @deprecated since 8.0.0 Use `distanceField.range` instead.
   */
  get distanceFieldType() {
    return $(Y, "BitmapFont.distanceFieldType is deprecated, please use BitmapFont.distanceField.type instead."), this.distanceField.type;
  }
  destroy(t = !1) {
    var e;
    this.emit("destroy", this), this.removeAllListeners();
    for (const i in this.chars)
      (e = this.chars[i].texture) == null || e.destroy();
    this.chars = null, t && (this.pages.forEach((i) => i.texture.destroy(!0)), this.pages = null);
  }
}
const Kl = class vr {
  constructor(t, e, i, r) {
    this.uid = gt("fillGradient"), this.type = "linear", this.gradientStops = [], this._styleKey = null, this.x0 = t, this.y0 = e, this.x1 = i, this.y1 = r;
  }
  addColorStop(t, e) {
    return this.gradientStops.push({ offset: t, color: dt.shared.setValue(e).toHexa() }), this._styleKey = null, this;
  }
  // TODO move to the system!
  buildLinearGradient() {
    const t = vr.defaultTextureSize, { gradientStops: e } = this, i = ot.get().createCanvas();
    i.width = t, i.height = t;
    const r = i.getContext("2d"), n = r.createLinearGradient(0, 0, vr.defaultTextureSize, 1);
    for (let p = 0; p < e.length; p++) {
      const g = e[p];
      n.addColorStop(g.offset, g.color);
    }
    r.fillStyle = n, r.fillRect(0, 0, t, t), this.texture = new W({
      source: new Ii({
        resource: i,
        addressModeU: "clamp-to-edge",
        addressModeV: "repeat"
      })
    });
    const { x0: o, y0: a, x1: l, y1: c } = this, h = new H(), f = l - o, d = c - a, u = Math.sqrt(f * f + d * d), m = Math.atan2(d, f);
    h.translate(-o, -a), h.scale(1 / t, 1 / t), h.rotate(-m), h.scale(256 / u, 1), this.transform = h, this._styleKey = null;
  }
  get styleKey() {
    if (this._styleKey)
      return this._styleKey;
    const t = this.gradientStops.map((r) => `${r.offset}-${r.color}`).join("-"), e = this.texture.uid, i = this.transform.toArray().join("-");
    return `fill-gradient-${this.uid}-${t}-${e}-${i}-${this.x0}-${this.y0}-${this.x1}-${this.y1}`;
  }
};
Kl.defaultTextureSize = 256;
let as = Kl;
const Jo = {
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
class fn {
  constructor(t, e) {
    this.uid = gt("fillPattern"), this.transform = new H(), this._styleKey = null, this.texture = t, this.transform.scale(
      1 / t.frame.width,
      1 / t.frame.height
    ), e && (t.source.style.addressModeU = Jo[e].addressModeU, t.source.style.addressModeV = Jo[e].addressModeV);
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
var Tf = Ef, Gn = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }, kf = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
function Ef(s) {
  var t = [];
  return s.replace(kf, function(e, i, r) {
    var n = i.toLowerCase();
    for (r = Bf(r), n == "m" && r.length > 2 && (t.push([i].concat(r.splice(0, 2))), n = "l", i = i == "m" ? "l" : "L"); ; ) {
      if (r.length == Gn[n])
        return r.unshift(i), t.push(r);
      if (r.length < Gn[n]) throw new Error("malformed path data");
      t.push([i].concat(r.splice(0, Gn[n])));
    }
  }), t;
}
var If = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
function Bf(s) {
  var t = s.match(If);
  return t ? t.map(Number) : [];
}
const Rf = /* @__PURE__ */ Kr(Tf);
function Ff(s, t) {
  const e = Rf(s), i = [];
  let r = null, n = 0, o = 0;
  for (let a = 0; a < e.length; a++) {
    const l = e[a], c = l[0], h = l;
    switch (c) {
      case "M":
        n = h[1], o = h[2], t.moveTo(n, o);
        break;
      case "m":
        n += h[1], o += h[2], t.moveTo(n, o);
        break;
      case "H":
        n = h[1], t.lineTo(n, o);
        break;
      case "h":
        n += h[1], t.lineTo(n, o);
        break;
      case "V":
        o = h[1], t.lineTo(n, o);
        break;
      case "v":
        o += h[1], t.lineTo(n, o);
        break;
      case "L":
        n = h[1], o = h[2], t.lineTo(n, o);
        break;
      case "l":
        n += h[1], o += h[2], t.lineTo(n, o);
        break;
      case "C":
        n = h[5], o = h[6], t.bezierCurveTo(
          h[1],
          h[2],
          h[3],
          h[4],
          n,
          o
        );
        break;
      case "c":
        t.bezierCurveTo(
          n + h[1],
          o + h[2],
          n + h[3],
          o + h[4],
          n + h[5],
          o + h[6]
        ), n += h[5], o += h[6];
        break;
      case "S":
        n = h[3], o = h[4], t.bezierCurveToShort(
          h[1],
          h[2],
          n,
          o
        );
        break;
      case "s":
        t.bezierCurveToShort(
          n + h[1],
          o + h[2],
          n + h[3],
          o + h[4]
        ), n += h[3], o += h[4];
        break;
      case "Q":
        n = h[3], o = h[4], t.quadraticCurveTo(
          h[1],
          h[2],
          n,
          o
        );
        break;
      case "q":
        t.quadraticCurveTo(
          n + h[1],
          o + h[2],
          n + h[3],
          o + h[4]
        ), n += h[3], o += h[4];
        break;
      case "T":
        n = h[1], o = h[2], t.quadraticCurveToShort(
          n,
          o
        );
        break;
      case "t":
        n += h[1], o += h[2], t.quadraticCurveToShort(
          n,
          o
        );
        break;
      case "A":
        n = h[6], o = h[7], t.arcToSvg(
          h[1],
          h[2],
          h[3],
          h[4],
          h[5],
          n,
          o
        );
        break;
      case "a":
        n += h[6], o += h[7], t.arcToSvg(
          h[1],
          h[2],
          h[3],
          h[4],
          h[5],
          n,
          o
        );
        break;
      case "Z":
      case "z":
        t.closePath(), i.length > 0 && (r = i.pop(), r ? (n = r.startX, o = r.startY) : (n = 0, o = 0)), r = null;
        break;
      default:
        ct(`Unknown SVG path command: ${c}`);
    }
    c !== "Z" && c !== "z" && r === null && (r = { startX: n, startY: o }, i.push(r));
  }
  return t;
}
class dn {
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
    return new dn(this.x, this.y, this.radius);
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
    let r = this.x - t, n = this.y - e;
    return r *= r, n *= n, r + n <= i;
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
    const r = this.x - t, n = this.y - e, o = this.radius, a = i / 2, l = Math.sqrt(r * r + n * n);
    return l < o + a && l > o - a;
  }
  /**
   * Returns the framing rectangle of the circle as a Rectangle object
   * @param out
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new ft(), t.x = this.x - this.radius, t.y = this.y - this.radius, t.width = this.radius * 2, t.height = this.radius * 2, t;
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
class eo {
  /**
   * @param x - The X coordinate of the center of this ellipse
   * @param y - The Y coordinate of the center of this ellipse
   * @param halfWidth - The half width of this ellipse
   * @param halfHeight - The half height of this ellipse
   */
  constructor(t = 0, e = 0, i = 0, r = 0) {
    this.type = "ellipse", this.x = t, this.y = e, this.halfWidth = i, this.halfHeight = r;
  }
  /**
   * Creates a clone of this Ellipse instance
   * @returns {Ellipse} A copy of the ellipse
   */
  clone() {
    return new eo(this.x, this.y, this.halfWidth, this.halfHeight);
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
    let i = (t - this.x) / this.halfWidth, r = (e - this.y) / this.halfHeight;
    return i *= i, r *= r, i + r <= 1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse including stroke
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param width
   * @returns Whether the x/y coords are within this ellipse
   */
  strokeContains(t, e, i) {
    const { halfWidth: r, halfHeight: n } = this;
    if (r <= 0 || n <= 0)
      return !1;
    const o = i / 2, a = r - o, l = n - o, c = r + o, h = n + o, f = t - this.x, d = e - this.y, u = f * f / (a * a) + d * d / (l * l), m = f * f / (c * c) + d * d / (h * h);
    return u > 1 && m <= 1;
  }
  /**
   * Returns the framing rectangle of the ellipse as a Rectangle object
   * @param out
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new ft(), t.x = this.x - this.halfWidth, t.y = this.y - this.halfHeight, t.width = this.halfWidth * 2, t.height = this.halfHeight * 2, t;
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
function Lf(s, t, e, i, r, n) {
  const o = s - e, a = t - i, l = r - e, c = n - i, h = o * l + a * c, f = l * l + c * c;
  let d = -1;
  f !== 0 && (d = h / f);
  let u, m;
  d < 0 ? (u = e, m = i) : d > 1 ? (u = r, m = n) : (u = e + d * l, m = i + d * c);
  const p = s - u, g = t - m;
  return p * p + g * g;
}
class gi {
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
      for (let r = 0, n = e.length; r < n; r++)
        i.push(e[r].x, e[r].y);
      e = i;
    }
    this.points = e, this.closePath = !0;
  }
  /**
   * Creates a clone of this polygon.
   * @returns - A copy of the polygon.
   */
  clone() {
    const t = this.points.slice(), e = new gi(t);
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
    const r = this.points.length / 2;
    for (let n = 0, o = r - 1; n < r; o = n++) {
      const a = this.points[n * 2], l = this.points[n * 2 + 1], c = this.points[o * 2], h = this.points[o * 2 + 1];
      l > e != h > e && t < (c - a) * ((e - l) / (h - l)) + a && (i = !i);
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
    const r = i / 2, n = r * r, { points: o } = this, a = o.length - (this.closePath ? 0 : 2);
    for (let l = 0; l < a; l += 2) {
      const c = o[l], h = o[l + 1], f = o[(l + 2) % o.length], d = o[(l + 3) % o.length];
      if (Lf(t, e, c, h, f, d) <= n)
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
    t = t || new ft();
    const e = this.points;
    let i = 1 / 0, r = -1 / 0, n = 1 / 0, o = -1 / 0;
    for (let a = 0, l = e.length; a < l; a += 2) {
      const c = e[a], h = e[a + 1];
      i = c < i ? c : i, r = c > r ? c : r, n = h < n ? h : n, o = h > o ? h : o;
    }
    return t.x = i, t.width = r - i, t.y = n, t.height = o - n, t;
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
const Bs = (s, t, e, i, r, n) => {
  const o = s - e, a = t - i, l = Math.sqrt(o * o + a * a);
  return l >= r - n && l <= r + n;
};
class pn {
  /**
   * @param x - The X coordinate of the upper-left corner of the rounded rectangle
   * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
   * @param width - The overall width of this rounded rectangle
   * @param height - The overall height of this rounded rectangle
   * @param radius - Controls the radius of the rounded corners
   */
  constructor(t = 0, e = 0, i = 0, r = 0, n = 20) {
    this.type = "roundedRectangle", this.x = t, this.y = e, this.width = i, this.height = r, this.radius = n;
  }
  /**
   * Returns the framing rectangle of the rounded rectangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new ft(), t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t;
  }
  /**
   * Creates a clone of this Rounded Rectangle.
   * @returns - A copy of the rounded rectangle.
   */
  clone() {
    return new pn(this.x, this.y, this.width, this.height, this.radius);
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
      let r = t - (this.x + i), n = e - (this.y + i);
      const o = i * i;
      if (r * r + n * n <= o || (r = t - (this.x + this.width - i), r * r + n * n <= o) || (n = e - (this.y + this.height - i), r * r + n * n <= o) || (r = t - (this.x + i), r * r + n * n <= o))
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
    const { x: r, y: n, width: o, height: a, radius: l } = this, c = i / 2, h = r + l, f = n + l, d = o - l * 2, u = a - l * 2, m = r + o, p = n + a;
    return (t >= r - c && t <= r + c || t >= m - c && t <= m + c) && e >= f && e <= f + u || (e >= n - c && e <= n + c || e >= p - c && e <= p + c) && t >= h && t <= h + d ? !0 : (
      // Top-left
      t < h && e < f && Bs(t, e, h, f, l, c) || t > m - l && e < f && Bs(t, e, m - l, f, l, c) || t > m - l && e > p - l && Bs(t, e, m - l, p - l, l, c) || t < h && e > p - l && Bs(t, e, h, p - l, l, c)
    );
  }
  toString() {
    return `[pixi.js/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
  }
}
const Of = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join(`
`);
function Df(s) {
  let t = "";
  for (let e = 0; e < s; ++e)
    e > 0 && (t += `
else `), e < s - 1 && (t += `if(test == ${e}.0){}`);
  return t;
}
function zf(s, t) {
  if (s === 0)
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  const e = t.createShader(t.FRAGMENT_SHADER);
  try {
    for (; ; ) {
      const i = Of.replace(/%forloop%/gi, Df(s));
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
let li = null;
function ql() {
  var t;
  if (li)
    return li;
  const s = El();
  return li = s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS), li = zf(
    li,
    s
  ), (t = s.getExtension("WEBGL_lose_context")) == null || t.loseContext(), li;
}
const Zl = {};
function Uf(s, t) {
  let e = 2166136261;
  for (let i = 0; i < t; i++)
    e ^= s[i].uid, e = Math.imul(e, 16777619), e >>>= 0;
  return Zl[e] || Gf(s, t, e);
}
let Vn = 0;
function Gf(s, t, e) {
  const i = {};
  let r = 0;
  Vn || (Vn = ql());
  for (let o = 0; o < Vn; o++) {
    const a = o < t ? s[o] : W.EMPTY.source;
    i[r++] = a.source, i[r++] = a.style;
  }
  const n = new zs(i);
  return Zl[e] = n, n;
}
class ta {
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
function ea(s, t) {
  const e = s.byteLength / 8 | 0, i = new Float64Array(s, 0, e);
  new Float64Array(t, 0, e).set(i);
  const n = s.byteLength - e * 8;
  if (n > 0) {
    const o = new Uint8Array(s, e * 8, n);
    new Uint8Array(t, e * 8, n).set(o);
  }
}
const Vf = {
  normal: "normal-npm",
  add: "add-npm",
  screen: "screen-npm"
};
var Wf = /* @__PURE__ */ ((s) => (s[s.DISABLED = 0] = "DISABLED", s[s.RENDERING_MASK_ADD = 1] = "RENDERING_MASK_ADD", s[s.MASK_ACTIVE = 2] = "MASK_ACTIVE", s[s.INVERSE_MASK_ACTIVE = 3] = "INVERSE_MASK_ACTIVE", s[s.RENDERING_MASK_REMOVE = 4] = "RENDERING_MASK_REMOVE", s[s.NONE = 5] = "NONE", s))(Wf || {});
function ia(s, t) {
  return t.alphaMode === "no-premultiply-alpha" && Vf[s] || s;
}
class Nf {
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
class Hf {
  constructor() {
    this.renderPipeId = "batch", this.action = "startBatch", this.start = 0, this.size = 0, this.textures = new Nf(), this.blendMode = "normal", this.canBundle = !0;
  }
  destroy() {
    this.textures = null, this.gpuBindGroup = null, this.bindGroup = null, this.batcher = null;
  }
}
const Ql = [];
let br = 0;
function sa() {
  return br > 0 ? Ql[--br] : new Hf();
}
function na(s) {
  Ql[br++] = s;
}
let Vi = 0;
const Jl = class Us {
  constructor(t = {}) {
    this.uid = gt("batcher"), this.dirty = !0, this.batchIndex = 0, this.batches = [], this._elements = [], Us.defaultOptions.maxTextures = Us.defaultOptions.maxTextures ?? ql(), t = { ...Us.defaultOptions, ...t };
    const { maxTextures: e, attributesInitialSize: i, indicesInitialSize: r } = t;
    this.attributeBuffer = new ta(i * 4), this.indexBuffer = new Uint16Array(r), this.maxTextures = e;
  }
  begin() {
    this.elementSize = 0, this.elementStart = 0, this.indexSize = 0, this.attributeSize = 0;
    for (let t = 0; t < this.batchIndex; t++)
      na(this.batches[t]);
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
    let i = sa(), r = i.textures;
    r.clear();
    const n = e[this.elementStart];
    let o = ia(n.blendMode, n.texture._source);
    this.attributeSize * 4 > this.attributeBuffer.size && this._resizeAttributeBuffer(this.attributeSize * 4), this.indexSize > this.indexBuffer.length && this._resizeIndexBuffer(this.indexSize);
    const a = this.attributeBuffer.float32View, l = this.attributeBuffer.uint32View, c = this.indexBuffer;
    let h = this._batchIndexSize, f = this._batchIndexStart, d = "startBatch";
    const u = this.maxTextures;
    for (let m = this.elementStart; m < this.elementSize; ++m) {
      const p = e[m];
      e[m] = null;
      const x = p.texture._source, y = ia(p.blendMode, x), v = o !== y;
      if (x._batchTick === Vi && !v) {
        p._textureId = x._textureBindLocation, h += p.indexSize, p.packAsQuad ? (this.packQuadAttributes(
          p,
          a,
          l,
          p._attributeStart,
          p._textureId
        ), this.packQuadIndex(
          c,
          p._indexStart,
          p._attributeStart / this.vertexSize
        )) : (this.packAttributes(
          p,
          a,
          l,
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
      x._batchTick = Vi, (r.count >= u || v) && (this._finishBatch(
        i,
        f,
        h - f,
        r,
        o,
        t,
        d
      ), d = "renderBatch", f = h, o = y, i = sa(), r = i.textures, r.clear(), ++Vi), p._textureId = x._textureBindLocation = r.count, r.ids[x.uid] = r.count, r.textures[r.count++] = x, p._batch = i, h += p.indexSize, p.packAsQuad ? (this.packQuadAttributes(
        p,
        a,
        l,
        p._attributeStart,
        p._textureId
      ), this.packQuadIndex(
        c,
        p._indexStart,
        p._attributeStart / this.vertexSize
      )) : (this.packAttributes(
        p,
        a,
        l,
        p._attributeStart,
        p._textureId
      ), this.packIndex(
        p,
        c,
        p._indexStart,
        p._attributeStart / this.vertexSize
      ));
    }
    r.count > 0 && (this._finishBatch(
      i,
      f,
      h - f,
      r,
      o,
      t,
      d
    ), f = h, ++Vi), this.elementStart = this.elementSize, this._batchIndexStart = f, this._batchIndexSize = h;
  }
  _finishBatch(t, e, i, r, n, o, a) {
    t.gpuBindGroup = null, t.bindGroup = null, t.action = a, t.batcher = this, t.textures = r, t.blendMode = n, t.start = e, t.size = i, ++Vi, this.batches[this.batchIndex++] = t, o.add(t);
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
    const e = Math.max(t, this.attributeBuffer.size * 2), i = new ta(e);
    ea(this.attributeBuffer.rawBinaryData, i.rawBinaryData), this.attributeBuffer = i;
  }
  _resizeIndexBuffer(t) {
    const e = this.indexBuffer;
    let i = Math.max(t, e.length * 1.5);
    i += i % 2;
    const r = i > 65535 ? new Uint32Array(i) : new Uint16Array(i);
    if (r.BYTES_PER_ELEMENT !== e.BYTES_PER_ELEMENT)
      for (let n = 0; n < e.length; n++)
        r[n] = e[n];
    else
      ea(e.buffer, r.buffer);
    this.indexBuffer = r;
  }
  packQuadIndex(t, e, i) {
    t[e] = i + 0, t[e + 1] = i + 1, t[e + 2] = i + 2, t[e + 3] = i + 0, t[e + 4] = i + 2, t[e + 5] = i + 3;
  }
  packIndex(t, e, i, r) {
    const n = t.indices, o = t.indexSize, a = t.indexOffset, l = t.attributeOffset;
    for (let c = 0; c < o; c++)
      e[i++] = r + n[c + a] - l;
  }
  destroy() {
    for (let t = 0; t < this.batches.length; t++)
      na(this.batches[t]);
    this.batches = null;
    for (let t = 0; t < this._elements.length; t++)
      this._elements[t]._batch = null;
    this._elements = null, this.indexBuffer = null, this.attributeBuffer.destroy(), this.attributeBuffer = null;
  }
};
Jl.defaultOptions = {
  maxTextures: null,
  attributesInitialSize: 4,
  indicesInitialSize: 6
};
let $f = Jl;
var Bt = /* @__PURE__ */ ((s) => (s[s.MAP_READ = 1] = "MAP_READ", s[s.MAP_WRITE = 2] = "MAP_WRITE", s[s.COPY_SRC = 4] = "COPY_SRC", s[s.COPY_DST = 8] = "COPY_DST", s[s.INDEX = 16] = "INDEX", s[s.VERTEX = 32] = "VERTEX", s[s.UNIFORM = 64] = "UNIFORM", s[s.STORAGE = 128] = "STORAGE", s[s.INDIRECT = 256] = "INDIRECT", s[s.QUERY_RESOLVE = 512] = "QUERY_RESOLVE", s[s.STATIC = 1024] = "STATIC", s))(Bt || {});
class ls extends Mt {
  /**
   * Creates a new Buffer with the given options
   * @param options - the options for the buffer
   */
  constructor(t) {
    let { data: e, size: i } = t;
    const { usage: r, label: n, shrinkToFit: o } = t;
    super(), this.uid = gt("buffer"), this._resourceType = "buffer", this._resourceId = gt("resource"), this._touched = 0, this._updateID = 1, this.shrinkToFit = !0, this.destroyed = !1, e instanceof Array && (e = new Float32Array(e)), this._data = e, i = i ?? (e == null ? void 0 : e.byteLength);
    const a = !!e;
    this.descriptor = {
      size: i,
      usage: r,
      mappedAtCreation: a,
      label: n
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
    return !!(this.descriptor.usage & Bt.STATIC);
  }
  set static(t) {
    t ? this.descriptor.usage |= Bt.STATIC : this.descriptor.usage &= ~Bt.STATIC;
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
    const r = this._data;
    if (this._data = t, r.length !== t.length) {
      !this.shrinkToFit && t.byteLength < r.byteLength ? i && this.emit("update", this) : (this.descriptor.size = t.byteLength, this._resourceId = gt("resource"), this.emit("change", this));
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
function th(s, t) {
  if (!(s instanceof ls)) {
    let e = t ? Bt.INDEX : Bt.VERTEX;
    s instanceof Array && (t ? (s = new Uint32Array(s), e = Bt.INDEX | Bt.COPY_DST) : (s = new Float32Array(s), e = Bt.VERTEX | Bt.COPY_DST)), s = new ls({
      data: s,
      label: t ? "index-mesh-buffer" : "vertex-mesh-buffer",
      usage: e
    });
  }
  return s;
}
function Yf(s, t, e) {
  const i = s.getAttribute(t);
  if (!i)
    return e.minX = 0, e.minY = 0, e.maxX = 0, e.maxY = 0, e;
  const r = i.buffer.data;
  let n = 1 / 0, o = 1 / 0, a = -1 / 0, l = -1 / 0;
  const c = r.BYTES_PER_ELEMENT, h = (i.offset || 0) / c, f = (i.stride || 2 * 4) / c;
  for (let d = h; d < r.length; d += f) {
    const u = r[d], m = r[d + 1];
    u > a && (a = u), m > l && (l = m), u < n && (n = u), m < o && (o = m);
  }
  return e.minX = n, e.minY = o, e.maxX = a, e.maxY = l, e;
}
function jf(s) {
  return (s instanceof ls || Array.isArray(s) || s.BYTES_PER_ELEMENT) && (s = {
    buffer: s
  }), s.buffer = th(s.buffer, !1), s;
}
class Xf extends Mt {
  /**
   * Create a new instance of a geometry
   * @param options - The options for the geometry.
   */
  constructor(t = {}) {
    super(), this.uid = gt("geometry"), this._layoutKey = 0, this.instanceCount = 1, this._bounds = new me(), this._boundsDirty = !0;
    const { attributes: e, indexBuffer: i, topology: r } = t;
    if (this.buffers = [], this.attributes = {}, e)
      for (const n in e)
        this.addAttribute(n, e[n]);
    this.instanceCount = t.instanceCount || 1, i && this.addIndex(i), this.topology = r || "triangle-list";
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
    const i = jf(e);
    this.buffers.indexOf(i.buffer) === -1 && (this.buffers.push(i.buffer), i.buffer.on("update", this.onBufferUpdate, this), i.buffer.on("change", this.onBufferUpdate, this)), this.attributes[t] = i;
  }
  /**
   * Adds an index buffer to the geometry.
   * @param indexBuffer - The index buffer to add. Can be a Buffer, TypedArray, or an array of numbers.
   */
  addIndex(t) {
    this.indexBuffer = th(t, !0), this.buffers.push(this.indexBuffer);
  }
  /** Returns the bounds of the geometry. */
  get bounds() {
    return this._boundsDirty ? (this._boundsDirty = !1, Yf(this, "aPosition", this._bounds)) : this._bounds;
  }
  /**
   * destroys the geometry.
   * @param destroyBuffers - destroy the buffers associated with this geometry
   */
  destroy(t = !1) {
    this.emit("destroy", this), this.removeAllListeners(), t && this.buffers.forEach((e) => e.destroy()), this.attributes = null, this.buffers = null, this.indexBuffer = null, this._bounds = null;
  }
}
const Kf = new Float32Array(1), qf = new Uint32Array(1);
class Zf extends Xf {
  constructor() {
    const e = new ls({
      data: Kf,
      label: "attribute-batch-buffer",
      usage: Bt.VERTEX | Bt.COPY_DST,
      shrinkToFit: !1
    }), i = new ls({
      data: qf,
      label: "index-batch-buffer",
      usage: Bt.INDEX | Bt.COPY_DST,
      // | BufferUsage.STATIC,
      shrinkToFit: !1
    }), r = 6 * 4;
    super({
      attributes: {
        aPosition: {
          buffer: e,
          format: "float32x2",
          stride: r,
          offset: 0
        },
        aUV: {
          buffer: e,
          format: "float32x2",
          stride: r,
          offset: 2 * 4
        },
        aColor: {
          buffer: e,
          format: "unorm8x4",
          stride: r,
          offset: 4 * 4
        },
        aTextureIdAndRound: {
          buffer: e,
          format: "uint16x2",
          stride: r,
          offset: 5 * 4
        }
      },
      indexBuffer: i
    });
  }
}
function ra(s, t, e) {
  if (s)
    for (const i in s) {
      const r = i.toLocaleLowerCase(), n = t[r];
      if (n) {
        let o = s[i];
        i === "header" && (o = o.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "")), e && n.push(`//----${e}----//`), n.push(o);
      } else
        ct(`${i} placement hook does not exist in shader`);
    }
}
const Qf = /\{\{(.*?)\}\}/g;
function oa(s) {
  var i;
  const t = {};
  return (((i = s.match(Qf)) == null ? void 0 : i.map((r) => r.replace(/[{()}]/g, ""))) ?? []).forEach((r) => {
    t[r] = [];
  }), t;
}
function aa(s, t) {
  let e;
  const i = /@in\s+([^;]+);/g;
  for (; (e = i.exec(s)) !== null; )
    t.push(e[1]);
}
function la(s, t, e = !1) {
  const i = [];
  aa(t, i), s.forEach((a) => {
    a.header && aa(a.header, i);
  });
  const r = i;
  e && r.sort();
  const n = r.map((a, l) => `       @location(${l}) ${a},`).join(`
`);
  let o = t.replace(/@in\s+[^;]+;\s*/g, "");
  return o = o.replace("{{in}}", `
${n}
`), o;
}
function ha(s, t) {
  let e;
  const i = /@out\s+([^;]+);/g;
  for (; (e = i.exec(s)) !== null; )
    t.push(e[1]);
}
function Jf(s) {
  const e = /\b(\w+)\s*:/g.exec(s);
  return e ? e[1] : "";
}
function td(s) {
  const t = /@.*?\s+/g;
  return s.replace(t, "");
}
function ed(s, t) {
  const e = [];
  ha(t, e), s.forEach((l) => {
    l.header && ha(l.header, e);
  });
  let i = 0;
  const r = e.sort().map((l) => l.indexOf("builtin") > -1 ? l : `@location(${i++}) ${l}`).join(`,
`), n = e.sort().map((l) => `       var ${td(l)};`).join(`
`), o = `return VSOutput(
                ${e.sort().map((l) => ` ${Jf(l)}`).join(`,
`)});`;
  let a = t.replace(/@out\s+[^;]+;\s*/g, "");
  return a = a.replace("{{struct}}", `
${r}
`), a = a.replace("{{start}}", `
${n}
`), a = a.replace("{{return}}", `
${o}
`), a;
}
function ca(s, t) {
  let e = s;
  for (const i in t) {
    const r = t[i];
    r.join(`
`).length ? e = e.replace(`{{${i}}}`, `//-----${i} START-----//
${r.join(`
`)}
//----${i} FINISH----//`) : e = e.replace(`{{${i}}}`, "");
  }
  return e;
}
const ke = /* @__PURE__ */ Object.create(null), Wn = /* @__PURE__ */ new Map();
let id = 0;
function sd({
  template: s,
  bits: t
}) {
  const e = eh(s, t);
  if (ke[e])
    return ke[e];
  const { vertex: i, fragment: r } = rd(s, t);
  return ke[e] = ih(i, r, t), ke[e];
}
function nd({
  template: s,
  bits: t
}) {
  const e = eh(s, t);
  return ke[e] || (ke[e] = ih(s.vertex, s.fragment, t)), ke[e];
}
function rd(s, t) {
  const e = t.map((o) => o.vertex).filter((o) => !!o), i = t.map((o) => o.fragment).filter((o) => !!o);
  let r = la(e, s.vertex, !0);
  r = ed(e, r);
  const n = la(i, s.fragment, !0);
  return {
    vertex: r,
    fragment: n
  };
}
function eh(s, t) {
  return t.map((e) => (Wn.has(e) || Wn.set(e, id++), Wn.get(e))).sort((e, i) => e - i).join("-") + s.vertex + s.fragment;
}
function ih(s, t, e) {
  const i = oa(s), r = oa(t);
  return e.forEach((n) => {
    ra(n.vertex, i, n.name), ra(n.fragment, r, n.name);
  }), {
    vertex: ca(s, i),
    fragment: ca(t, r)
  };
}
const od = (
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
), ad = (
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
), ld = (
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
), hd = (
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
), cd = {
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
}, ud = {
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
function fd({ bits: s, name: t }) {
  const e = sd({
    template: {
      fragment: ad,
      vertex: od
    },
    bits: [
      cd,
      ...s
    ]
  });
  return hn.from({
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
function dd({ bits: s, name: t }) {
  return new Bl({
    name: t,
    ...nd({
      template: {
        vertex: ld,
        fragment: hd
      },
      bits: [
        ud,
        ...s
      ]
    })
  });
}
const pd = {
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
}, md = {
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
}, Nn = {};
function gd(s) {
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
function _d(s) {
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
function xd(s) {
  return Nn[s] || (Nn[s] = {
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

                ${gd(s)}
            `,
      main: `
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${_d(s)}
            `
    }
  }), Nn[s];
}
const Hn = {};
function yd(s) {
  const t = [];
  for (let e = 0; e < s; e++)
    e > 0 && t.push("else"), e < s - 1 && t.push(`if(vTextureId < ${e}.5)`), t.push("{"), t.push(`	outColor = texture(uTextures[${e}], vUV);`), t.push("}");
  return t.join(`
`);
}
function vd(s) {
  return Hn[s] || (Hn[s] = {
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

                ${yd(s)}
            `
    }
  }), Hn[s];
}
const bd = {
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
}, wd = {
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
}, ua = {};
function Sd(s) {
  let t = ua[s];
  if (t)
    return t;
  const e = new Int32Array(s);
  for (let i = 0; i < s; i++)
    e[i] = i;
  return t = ua[s] = new Ol({
    uTextures: { value: e, type: "i32", size: s }
  }, { isStatic: !0 }), t;
}
class Ad extends Jr {
  constructor(t) {
    const e = dd({
      name: "batch",
      bits: [
        md,
        vd(t),
        wd
      ]
    }), i = fd({
      name: "batch",
      bits: [
        pd,
        xd(t),
        bd
      ]
    });
    super({
      glProgram: e,
      gpuProgram: i,
      resources: {
        batchSamplers: Sd(t)
      }
    });
  }
}
let fa = null;
const sh = class nh extends $f {
  constructor() {
    super(...arguments), this.geometry = new Zf(), this.shader = fa || (fa = new Ad(this.maxTextures)), this.name = nh.extension.name, this.vertexSize = 6;
  }
  /**
   * Packs the attributes of a DefaultBatchableMeshElement into the provided views.
   * @param element - The DefaultBatchableMeshElement to pack.
   * @param float32View - The Float32Array view to pack into.
   * @param uint32View - The Uint32Array view to pack into.
   * @param index - The starting index in the views.
   * @param textureId - The texture ID to use.
   */
  packAttributes(t, e, i, r, n) {
    const o = n << 16 | t.roundPixels & 65535, a = t.transform, l = a.a, c = a.b, h = a.c, f = a.d, d = a.tx, u = a.ty, { positions: m, uvs: p } = t, g = t.color, x = t.attributeOffset, y = x + t.attributeSize;
    for (let v = x; v < y; v++) {
      const w = v * 2, _ = m[w], S = m[w + 1];
      e[r++] = l * _ + h * S + d, e[r++] = f * S + c * _ + u, e[r++] = p[w], e[r++] = p[w + 1], i[r++] = g, i[r++] = o;
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
  packQuadAttributes(t, e, i, r, n) {
    const o = t.texture, a = t.transform, l = a.a, c = a.b, h = a.c, f = a.d, d = a.tx, u = a.ty, m = t.bounds, p = m.maxX, g = m.minX, x = m.maxY, y = m.minY, v = o.uvs, w = t.color, _ = n << 16 | t.roundPixels & 65535;
    e[r + 0] = l * g + h * y + d, e[r + 1] = f * y + c * g + u, e[r + 2] = v.x0, e[r + 3] = v.y0, i[r + 4] = w, i[r + 5] = _, e[r + 6] = l * p + h * y + d, e[r + 7] = f * y + c * p + u, e[r + 8] = v.x1, e[r + 9] = v.y1, i[r + 10] = w, i[r + 11] = _, e[r + 12] = l * p + h * x + d, e[r + 13] = f * x + c * p + u, e[r + 14] = v.x2, e[r + 15] = v.y2, i[r + 16] = w, i[r + 17] = _, e[r + 18] = l * g + h * x + d, e[r + 19] = f * x + c * g + u, e[r + 20] = v.x3, e[r + 21] = v.y3, i[r + 22] = w, i[r + 23] = _;
  }
};
sh.extension = {
  type: [
    D.Batcher
  ],
  name: "default"
};
let Cd = sh;
function Pd(s, t, e, i, r, n, o, a = null) {
  let l = 0;
  e *= t, r *= n;
  const c = a.a, h = a.b, f = a.c, d = a.d, u = a.tx, m = a.ty;
  for (; l < o; ) {
    const p = s[e], g = s[e + 1];
    i[r] = c * p + f * g + u, i[r + 1] = h * p + d * g + m, r += n, e += t, l++;
  }
}
function Md(s, t, e, i) {
  let r = 0;
  for (t *= e; r < i; )
    s[t] = 0, s[t + 1] = 0, t += e, r++;
}
function rh(s, t, e, i, r) {
  const n = t.a, o = t.b, a = t.c, l = t.d, c = t.tx, h = t.ty;
  e = e || 0, i = i || 2, r = r || s.length / i - e;
  let f = e * i;
  for (let d = 0; d < r; d++) {
    const u = s[f], m = s[f + 1];
    s[f] = n * u + a * m + c, s[f + 1] = o * u + l * m + h, f += i;
  }
}
function Td(s, t) {
  if (s === 16777215 || !t)
    return t;
  if (t === 16777215 || !s)
    return s;
  const e = s >> 16 & 255, i = s >> 8 & 255, r = s & 255, n = t >> 16 & 255, o = t >> 8 & 255, a = t & 255, l = e * n / 255, c = i * o / 255, h = r * a / 255;
  return (l << 16) + (c << 8) + h;
}
const kd = new H();
class oh {
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
    return i ? Td(e, i.groupColor) + (this.alpha * i.groupAlpha * 255 << 24) : e + (this.alpha * 255 << 24);
  }
  get transform() {
    var t;
    return ((t = this.renderable) == null ? void 0 : t.groupTransform) || kd;
  }
  copyTo(t) {
    t.indexOffset = this.indexOffset, t.indexSize = this.indexSize, t.attributeOffset = this.attributeOffset, t.attributeSize = this.attributeSize, t.baseColor = this.baseColor, t.alpha = this.alpha, t.texture = this.texture, t.geometryData = this.geometryData;
  }
  reset() {
    this.applyTransform = !0, this.renderable = null;
  }
}
const hs = {
  extension: {
    type: D.ShapeBuilder,
    name: "circle"
  },
  build(s, t) {
    let e, i, r, n, o, a;
    if (s.type === "circle") {
      const w = s;
      e = w.x, i = w.y, o = a = w.radius, r = n = 0;
    } else if (s.type === "ellipse") {
      const w = s;
      e = w.x, i = w.y, o = w.halfWidth, a = w.halfHeight, r = n = 0;
    } else {
      const w = s, _ = w.width / 2, S = w.height / 2;
      e = w.x + _, i = w.y + S, o = a = Math.max(0, Math.min(w.radius, Math.min(_, S))), r = _ - o, n = S - a;
    }
    if (!(o >= 0 && a >= 0 && r >= 0 && n >= 0))
      return t;
    const l = Math.ceil(2.3 * Math.sqrt(o + a)), c = l * 8 + (r ? 4 : 0) + (n ? 4 : 0);
    if (c === 0)
      return t;
    if (l === 0)
      return t[0] = t[6] = e + r, t[1] = t[3] = i + n, t[2] = t[4] = e - r, t[5] = t[7] = i - n, t;
    let h = 0, f = l * 4 + (r ? 2 : 0) + 2, d = f, u = c, m = r + o, p = n, g = e + m, x = e - m, y = i + p;
    if (t[h++] = g, t[h++] = y, t[--f] = y, t[--f] = x, n) {
      const w = i - p;
      t[d++] = x, t[d++] = w, t[--u] = w, t[--u] = g;
    }
    for (let w = 1; w < l; w++) {
      const _ = Math.PI / 2 * (w / l), S = r + Math.cos(_) * o, C = n + Math.sin(_) * a, b = e + S, A = e - S, P = i + C, M = i - C;
      t[h++] = b, t[h++] = P, t[--f] = P, t[--f] = A, t[d++] = A, t[d++] = M, t[--u] = M, t[--u] = b;
    }
    m = r, p = n + a, g = e + m, x = e - m, y = i + p;
    const v = i - p;
    return t[h++] = g, t[h++] = y, t[--u] = v, t[--u] = g, r && (t[h++] = x, t[h++] = y, t[--u] = v, t[--u] = x), t;
  },
  triangulate(s, t, e, i, r, n) {
    if (s.length === 0)
      return;
    let o = 0, a = 0;
    for (let h = 0; h < s.length; h += 2)
      o += s[h], a += s[h + 1];
    o /= s.length / 2, a /= s.length / 2;
    let l = i;
    t[l * e] = o, t[l * e + 1] = a;
    const c = l++;
    for (let h = 0; h < s.length; h += 2)
      t[l * e] = s[h], t[l * e + 1] = s[h + 1], h > 0 && (r[n++] = l, r[n++] = c, r[n++] = l - 1), l++;
    r[n++] = c + 1, r[n++] = c, r[n++] = l - 1;
  }
}, Ed = { ...hs, extension: { ...hs.extension, name: "ellipse" } }, Id = { ...hs, extension: { ...hs.extension, name: "roundedRectangle" } }, Bd = 1e-4, da = 1e-4;
function Rd(s) {
  const t = s.length;
  if (t < 6)
    return 1;
  let e = 0;
  for (let i = 0, r = s[t - 2], n = s[t - 1]; i < t; i += 2) {
    const o = s[i], a = s[i + 1];
    e += (o - r) * (a + n), r = o, n = a;
  }
  return e < 0 ? -1 : 1;
}
function pa(s, t, e, i, r, n, o, a) {
  const l = s - e * r, c = t - i * r, h = s + e * n, f = t + i * n;
  let d, u;
  o ? (d = i, u = -e) : (d = -i, u = e);
  const m = l + d, p = c + u, g = h + d, x = f + u;
  return a.push(m, p), a.push(g, x), 2;
}
function ze(s, t, e, i, r, n, o, a) {
  const l = e - s, c = i - t;
  let h = Math.atan2(l, c), f = Math.atan2(r - s, n - t);
  a && h < f ? h += Math.PI * 2 : !a && h > f && (f += Math.PI * 2);
  let d = h;
  const u = f - h, m = Math.abs(u), p = Math.sqrt(l * l + c * c), g = (15 * m * Math.sqrt(p) / Math.PI >> 0) + 1, x = u / g;
  if (d += x, a) {
    o.push(s, t), o.push(e, i);
    for (let y = 1, v = d; y < g; y++, v += x)
      o.push(s, t), o.push(
        s + Math.sin(v) * p,
        t + Math.cos(v) * p
      );
    o.push(s, t), o.push(r, n);
  } else {
    o.push(e, i), o.push(s, t);
    for (let y = 1, v = d; y < g; y++, v += x)
      o.push(
        s + Math.sin(v) * p,
        t + Math.cos(v) * p
      ), o.push(s, t);
    o.push(r, n), o.push(s, t);
  }
  return g * 2;
}
function Fd(s, t, e, i, r, n, o, a, l) {
  const c = Bd;
  if (s.length === 0)
    return;
  const h = t;
  let f = h.alignment;
  if (t.alignment !== 0.5) {
    let U = Rd(s);
    f = (f - 0.5) * U + 0.5;
  }
  const d = new St(s[0], s[1]), u = new St(s[s.length - 2], s[s.length - 1]), m = i, p = Math.abs(d.x - u.x) < c && Math.abs(d.y - u.y) < c;
  if (m) {
    s = s.slice(), p && (s.pop(), s.pop(), u.set(s[s.length - 2], s[s.length - 1]));
    const U = (d.x + u.x) * 0.5, X = (u.y + d.y) * 0.5;
    s.unshift(U, X), s.push(U, X);
  }
  const g = r, x = s.length / 2;
  let y = s.length;
  const v = g.length / 2, w = h.width / 2, _ = w * w, S = h.miterLimit * h.miterLimit;
  let C = s[0], b = s[1], A = s[2], P = s[3], M = 0, T = 0, k = -(b - P), E = C - A, I = 0, B = 0, R = Math.sqrt(k * k + E * E);
  k /= R, E /= R, k *= w, E *= w;
  const z = f, F = (1 - z) * 2, L = z * 2;
  m || (h.cap === "round" ? y += ze(
    C - k * (F - L) * 0.5,
    b - E * (F - L) * 0.5,
    C - k * F,
    b - E * F,
    C + k * L,
    b + E * L,
    g,
    !0
  ) + 2 : h.cap === "square" && (y += pa(C, b, k, E, F, L, !0, g))), g.push(
    C - k * F,
    b - E * F
  ), g.push(
    C + k * L,
    b + E * L
  );
  for (let U = 1; U < x - 1; ++U) {
    C = s[(U - 1) * 2], b = s[(U - 1) * 2 + 1], A = s[U * 2], P = s[U * 2 + 1], M = s[(U + 1) * 2], T = s[(U + 1) * 2 + 1], k = -(b - P), E = C - A, R = Math.sqrt(k * k + E * E), k /= R, E /= R, k *= w, E *= w, I = -(P - T), B = A - M, R = Math.sqrt(I * I + B * B), I /= R, B /= R, I *= w, B *= w;
    const X = A - C, J = b - P, Q = A - M, V = T - P, It = X * Q + J * V, lt = J * Q - V * X, Jt = lt < 0;
    if (Math.abs(lt) < 1e-3 * Math.abs(It)) {
      g.push(
        A - k * F,
        P - E * F
      ), g.push(
        A + k * L,
        P + E * L
      ), It >= 0 && (h.join === "round" ? y += ze(
        A,
        P,
        A - k * F,
        P - E * F,
        A - I * F,
        P - B * F,
        g,
        !1
      ) + 4 : y += 2, g.push(
        A - I * L,
        P - B * L
      ), g.push(
        A + I * F,
        P + B * F
      ));
      continue;
    }
    const zt = (-k + C) * (-E + P) - (-k + A) * (-E + b), Ut = (-I + M) * (-B + P) - (-I + A) * (-B + T), pt = (X * Ut - Q * zt) / lt, oi = (V * zt - J * Ut) / lt, Oi = (pt - A) * (pt - A) + (oi - P) * (oi - P), xe = A + (pt - A) * F, oe = P + (oi - P) * F, ae = A - (pt - A) * L, te = P - (oi - P) * L, ee = Math.min(X * X + J * J, Q * Q + V * V), Di = Jt ? F : L, zi = ee + Di * Di * _;
    Oi <= zi ? h.join === "bevel" || Oi / _ > S ? (Jt ? (g.push(xe, oe), g.push(A + k * L, P + E * L), g.push(xe, oe), g.push(A + I * L, P + B * L)) : (g.push(A - k * F, P - E * F), g.push(ae, te), g.push(A - I * F, P - B * F), g.push(ae, te)), y += 2) : h.join === "round" ? Jt ? (g.push(xe, oe), g.push(A + k * L, P + E * L), y += ze(
      A,
      P,
      A + k * L,
      P + E * L,
      A + I * L,
      P + B * L,
      g,
      !0
    ) + 4, g.push(xe, oe), g.push(A + I * L, P + B * L)) : (g.push(A - k * F, P - E * F), g.push(ae, te), y += ze(
      A,
      P,
      A - k * F,
      P - E * F,
      A - I * F,
      P - B * F,
      g,
      !1
    ) + 4, g.push(A - I * F, P - B * F), g.push(ae, te)) : (g.push(xe, oe), g.push(ae, te)) : (g.push(A - k * F, P - E * F), g.push(A + k * L, P + E * L), h.join === "round" ? Jt ? y += ze(
      A,
      P,
      A + k * L,
      P + E * L,
      A + I * L,
      P + B * L,
      g,
      !0
    ) + 2 : y += ze(
      A,
      P,
      A - k * F,
      P - E * F,
      A - I * F,
      P - B * F,
      g,
      !1
    ) + 2 : h.join === "miter" && Oi / _ <= S && (Jt ? (g.push(ae, te), g.push(ae, te)) : (g.push(xe, oe), g.push(xe, oe)), y += 2), g.push(A - I * F, P - B * F), g.push(A + I * L, P + B * L), y += 2);
  }
  C = s[(x - 2) * 2], b = s[(x - 2) * 2 + 1], A = s[(x - 1) * 2], P = s[(x - 1) * 2 + 1], k = -(b - P), E = C - A, R = Math.sqrt(k * k + E * E), k /= R, E /= R, k *= w, E *= w, g.push(A - k * F, P - E * F), g.push(A + k * L, P + E * L), m || (h.cap === "round" ? y += ze(
    A - k * (F - L) * 0.5,
    P - E * (F - L) * 0.5,
    A - k * F,
    P - E * F,
    A + k * L,
    P + E * L,
    g,
    !1
  ) + 2 : h.cap === "square" && (y += pa(A, P, k, E, F, L, !1, g)));
  const Z = da * da;
  for (let U = v; U < y + v - 2; ++U)
    C = g[U * 2], b = g[U * 2 + 1], A = g[(U + 1) * 2], P = g[(U + 1) * 2 + 1], M = g[(U + 2) * 2], T = g[(U + 2) * 2 + 1], !(Math.abs(C * (P - T) + A * (T - b) + M * (b - P)) < Z) && a.push(U, U + 1, U + 2);
}
function ah(s, t, e, i, r, n, o) {
  const a = bf(s, t, 2);
  if (!a)
    return;
  for (let c = 0; c < a.length; c += 3)
    n[o++] = a[c] + r, n[o++] = a[c + 1] + r, n[o++] = a[c + 2] + r;
  let l = r * i;
  for (let c = 0; c < s.length; c += 2)
    e[l] = s[c], e[l + 1] = s[c + 1], l += i;
}
const Ld = [], Od = {
  extension: {
    type: D.ShapeBuilder,
    name: "polygon"
  },
  build(s, t) {
    for (let e = 0; e < s.points.length; e++)
      t[e] = s.points[e];
    return t;
  },
  triangulate(s, t, e, i, r, n) {
    ah(s, Ld, t, e, i, r, n);
  }
}, Dd = {
  extension: {
    type: D.ShapeBuilder,
    name: "rectangle"
  },
  build(s, t) {
    const e = s, i = e.x, r = e.y, n = e.width, o = e.height;
    return n >= 0 && o >= 0 && (t[0] = i, t[1] = r, t[2] = i + n, t[3] = r, t[4] = i + n, t[5] = r + o, t[6] = i, t[7] = r + o), t;
  },
  triangulate(s, t, e, i, r, n) {
    let o = 0;
    i *= e, t[i + o] = s[0], t[i + o + 1] = s[1], o += e, t[i + o] = s[2], t[i + o + 1] = s[3], o += e, t[i + o] = s[6], t[i + o + 1] = s[7], o += e, t[i + o] = s[4], t[i + o + 1] = s[5], o += e;
    const a = i / e;
    r[n++] = a, r[n++] = a + 1, r[n++] = a + 2, r[n++] = a + 1, r[n++] = a + 3, r[n++] = a + 2;
  }
}, zd = {
  extension: {
    type: D.ShapeBuilder,
    name: "triangle"
  },
  build(s, t) {
    return t[0] = s.x, t[1] = s.y, t[2] = s.x2, t[3] = s.y2, t[4] = s.x3, t[5] = s.y3, t;
  },
  triangulate(s, t, e, i, r, n) {
    let o = 0;
    i *= e, t[i + o] = s[0], t[i + o + 1] = s[1], o += e, t[i + o] = s[2], t[i + o + 1] = s[3], o += e, t[i + o] = s[4], t[i + o + 1] = s[5];
    const a = i / e;
    r[n++] = a, r[n++] = a + 1, r[n++] = a + 2;
  }
}, mn = {};
At.handleByMap(D.ShapeBuilder, mn);
At.add(Dd, Od, zd, hs, Ed, Id);
const Ud = new ft();
function Gd(s, t) {
  const { geometryData: e, batches: i } = t;
  i.length = 0, e.indices.length = 0, e.vertices.length = 0, e.uvs.length = 0;
  for (let r = 0; r < s.instructions.length; r++) {
    const n = s.instructions[r];
    if (n.action === "texture")
      Vd(n.data, i, e);
    else if (n.action === "fill" || n.action === "stroke") {
      const o = n.action === "stroke", a = n.data.path.shapePath, l = n.data.style, c = n.data.hole;
      o && c && ma(c.shapePath, l, null, !0, i, e), ma(a, l, c, o, i, e);
    }
  }
}
function Vd(s, t, e) {
  const { vertices: i, uvs: r, indices: n } = e, o = n.length, a = i.length / 2, l = [], c = mn.rectangle, h = Ud, f = s.image;
  h.x = s.dx, h.y = s.dy, h.width = s.dw, h.height = s.dh;
  const d = s.transform;
  c.build(h, l), d && rh(l, d), c.triangulate(l, i, 2, a, n, o);
  const u = f.uvs;
  r.push(
    u.x0,
    u.y0,
    u.x1,
    u.y1,
    u.x3,
    u.y3,
    u.x2,
    u.y2
  );
  const m = Se.get(oh);
  m.indexOffset = o, m.indexSize = n.length - o, m.attributeOffset = a, m.attributeSize = i.length / 2 - a, m.baseColor = s.style, m.alpha = s.alpha, m.texture = f, m.geometryData = e, t.push(m);
}
function ma(s, t, e, i, r, n) {
  const { vertices: o, uvs: a, indices: l } = n, c = s.shapePrimitives.length - 1;
  s.shapePrimitives.forEach(({ shape: h, transform: f }, d) => {
    const u = l.length, m = o.length / 2, p = [], g = mn[h.type];
    if (g.build(h, p), f && rh(p, f), i) {
      const w = h.closePath ?? !0;
      Fd(p, t, !1, w, o, 2, m, l);
    } else if (e && c === d) {
      c !== 0 && console.warn("[Pixi Graphics] only the last shape have be cut out");
      const w = [], _ = p.slice();
      Wd(e.shapePath).forEach((C) => {
        w.push(_.length / 2), _.push(...C);
      }), ah(_, w, o, 2, m, l, u);
    } else
      g.triangulate(p, o, 2, m, l, u);
    const x = a.length / 2, y = t.texture;
    if (y !== W.WHITE) {
      const w = t.matrix;
      w && (f && w.append(f.clone().invert()), Pd(o, 2, m, a, x, 2, o.length / 2 - m, w));
    } else
      Md(a, x, 2, o.length / 2 - m);
    const v = Se.get(oh);
    v.indexOffset = u, v.indexSize = l.length - u, v.attributeOffset = m, v.attributeSize = o.length / 2 - m, v.baseColor = t.color, v.alpha = t.alpha, v.texture = y, v.geometryData = n, r.push(v);
  });
}
function Wd(s) {
  if (!s)
    return [];
  const t = s.shapePrimitives, e = [];
  for (let i = 0; i < t.length; i++) {
    const r = t[i].shape, n = [];
    mn[r.type].build(r, n), e.push(n);
  }
  return e;
}
class Nd {
  constructor() {
    this.batches = [], this.geometryData = {
      vertices: [],
      uvs: [],
      indices: []
    };
  }
}
class Hd {
  constructor() {
    this.batcher = new Cd(), this.instructions = new ml();
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
    return $(qc, "GraphicsContextRenderData#geometry is deprecated, please use batcher.geometry instead."), this.batcher.geometry;
  }
}
const io = class wr {
  constructor(t) {
    this._gpuContextHash = {}, this._graphicsDataContextHash = /* @__PURE__ */ Object.create(null), t.renderableGC.addManagedHash(this, "_gpuContextHash"), t.renderableGC.addManagedHash(this, "_graphicsDataContextHash");
  }
  /**
   * Runner init called, update the default options
   * @ignore
   */
  init(t) {
    wr.defaultOptions.bezierSmoothness = (t == null ? void 0 : t.bezierSmoothness) ?? wr.defaultOptions.bezierSmoothness;
  }
  getContextRenderData(t) {
    return this._graphicsDataContextHash[t.uid] || this._initContextRenderData(t);
  }
  // Context management functions
  updateGpuContext(t) {
    let e = this._gpuContextHash[t.uid] || this._initContext(t);
    if (t.dirty) {
      e ? this._cleanGraphicsContextData(t) : e = this._initContext(t), Gd(t, e);
      const i = t.batchMode;
      t.customShader || i === "no-batch" ? e.isBatchable = !1 : i === "auto" && (e.isBatchable = e.geometryData.vertices.length < 400), t.dirty = !1;
    }
    return e;
  }
  getGpuContext(t) {
    return this._gpuContextHash[t.uid] || this._initContext(t);
  }
  _initContextRenderData(t) {
    const e = Se.get(Hd), { batches: i, geometryData: r } = this._gpuContextHash[t.uid], n = r.vertices.length, o = r.indices.length;
    for (let h = 0; h < i.length; h++)
      i[h].applyTransform = !1;
    const a = e.batcher;
    a.ensureAttributeBuffer(n), a.ensureIndexBuffer(o), a.begin();
    for (let h = 0; h < i.length; h++) {
      const f = i[h];
      a.add(f);
    }
    a.finish(e.instructions);
    const l = a.geometry;
    l.indexBuffer.setDataWithSize(a.indexBuffer, a.indexSize, !0), l.buffers[0].setDataWithSize(a.attributeBuffer.float32View, a.attributeSize, !0);
    const c = a.batches;
    for (let h = 0; h < c.length; h++) {
      const f = c[h];
      f.bindGroup = Uf(f.textures.textures, f.textures.count);
    }
    return this._graphicsDataContextHash[t.uid] = e, e;
  }
  _initContext(t) {
    const e = new Nd();
    return e.context = t, this._gpuContextHash[t.uid] = e, t.on("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid];
  }
  onGraphicsContextDestroy(t) {
    this._cleanGraphicsContextData(t), t.off("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid] = null;
  }
  _cleanGraphicsContextData(t) {
    const e = this._gpuContextHash[t.uid];
    e.isBatchable || this._graphicsDataContextHash[t.uid] && (Se.return(this.getContextRenderData(t)), this._graphicsDataContextHash[t.uid] = null), e.batches && e.batches.forEach((i) => {
      Se.return(i);
    });
  }
  destroy() {
    for (const t in this._gpuContextHash)
      this._gpuContextHash[t] && this.onGraphicsContextDestroy(this._gpuContextHash[t].context);
  }
};
io.extension = {
  type: [
    D.WebGLSystem,
    D.WebGPUSystem,
    D.CanvasSystem
  ],
  name: "graphicsContext"
};
io.defaultOptions = {
  /**
   * A value from 0 to 1 that controls the smoothness of bezier curves (the higher the smoother)
   * @default 0.5
   */
  bezierSmoothness: 0.5
};
let lh = io;
const $d = 8, Rs = 11920929e-14, Yd = 1;
function hh(s, t, e, i, r, n, o, a, l, c) {
  const f = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, c ?? lh.defaultOptions.bezierSmoothness)
  );
  let d = (Yd - f) / 1;
  return d *= d, jd(t, e, i, r, n, o, a, l, s, d), s;
}
function jd(s, t, e, i, r, n, o, a, l, c) {
  Sr(s, t, e, i, r, n, o, a, l, c, 0), l.push(o, a);
}
function Sr(s, t, e, i, r, n, o, a, l, c, h) {
  if (h > $d)
    return;
  const f = (s + e) / 2, d = (t + i) / 2, u = (e + r) / 2, m = (i + n) / 2, p = (r + o) / 2, g = (n + a) / 2, x = (f + u) / 2, y = (d + m) / 2, v = (u + p) / 2, w = (m + g) / 2, _ = (x + v) / 2, S = (y + w) / 2;
  if (h > 0) {
    let C = o - s, b = a - t;
    const A = Math.abs((e - o) * b - (i - a) * C), P = Math.abs((r - o) * b - (n - a) * C);
    if (A > Rs && P > Rs) {
      if ((A + P) * (A + P) <= c * (C * C + b * b)) {
        l.push(_, S);
        return;
      }
    } else if (A > Rs) {
      if (A * A <= c * (C * C + b * b)) {
        l.push(_, S);
        return;
      }
    } else if (P > Rs) {
      if (P * P <= c * (C * C + b * b)) {
        l.push(_, S);
        return;
      }
    } else if (C = _ - (s + o) / 2, b = S - (t + a) / 2, C * C + b * b <= c) {
      l.push(_, S);
      return;
    }
  }
  Sr(s, t, f, d, x, y, _, S, l, c, h + 1), Sr(_, S, v, w, p, g, o, a, l, c, h + 1);
}
const Xd = 8, Kd = 11920929e-14, qd = 1;
function Zd(s, t, e, i, r, n, o, a) {
  const c = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, a ?? lh.defaultOptions.bezierSmoothness)
  );
  let h = (qd - c) / 1;
  return h *= h, Qd(t, e, i, r, n, o, s, h), s;
}
function Qd(s, t, e, i, r, n, o, a) {
  Ar(o, s, t, e, i, r, n, a, 0), o.push(r, n);
}
function Ar(s, t, e, i, r, n, o, a, l) {
  if (l > Xd)
    return;
  const c = (t + i) / 2, h = (e + r) / 2, f = (i + n) / 2, d = (r + o) / 2, u = (c + f) / 2, m = (h + d) / 2;
  let p = n - t, g = o - e;
  const x = Math.abs((i - n) * g - (r - o) * p);
  if (x > Kd) {
    if (x * x <= a * (p * p + g * g)) {
      s.push(u, m);
      return;
    }
  } else if (p = u - (t + n) / 2, g = m - (e + o) / 2, p * p + g * g <= a) {
    s.push(u, m);
    return;
  }
  Ar(s, t, e, c, h, u, m, a, l + 1), Ar(s, u, m, f, d, n, o, a, l + 1);
}
function ch(s, t, e, i, r, n, o, a) {
  let l = Math.abs(r - n);
  (!o && r > n || o && n > r) && (l = 2 * Math.PI - l), a = a || Math.max(6, Math.floor(6 * Math.pow(i, 1 / 3) * (l / Math.PI))), a = Math.max(a, 3);
  let c = l / a, h = r;
  c *= o ? -1 : 1;
  for (let f = 0; f < a + 1; f++) {
    const d = Math.cos(h), u = Math.sin(h), m = t + d * i, p = e + u * i;
    s.push(m, p), h += c;
  }
}
function Jd(s, t, e, i, r, n) {
  const o = s[s.length - 2], l = s[s.length - 1] - e, c = o - t, h = r - e, f = i - t, d = Math.abs(l * f - c * h);
  if (d < 1e-8 || n === 0) {
    (s[s.length - 2] !== t || s[s.length - 1] !== e) && s.push(t, e);
    return;
  }
  const u = l * l + c * c, m = h * h + f * f, p = l * h + c * f, g = n * Math.sqrt(u) / d, x = n * Math.sqrt(m) / d, y = g * p / u, v = x * p / m, w = g * f + x * c, _ = g * h + x * l, S = c * (x + y), C = l * (x + y), b = f * (g + v), A = h * (g + v), P = Math.atan2(C - _, S - w), M = Math.atan2(A - _, b - w);
  ch(
    s,
    w + t,
    _ + e,
    n,
    P,
    M,
    c * h > f * l
  );
}
const Qi = Math.PI * 2, $n = {
  centerX: 0,
  centerY: 0,
  ang1: 0,
  ang2: 0
}, Yn = ({ x: s, y: t }, e, i, r, n, o, a, l) => {
  s *= e, t *= i;
  const c = r * s - n * t, h = n * s + r * t;
  return l.x = c + o, l.y = h + a, l;
};
function tp(s, t) {
  const e = t === -1.5707963267948966 ? -0.551915024494 : 1.3333333333333333 * Math.tan(t / 4), i = t === 1.5707963267948966 ? 0.551915024494 : e, r = Math.cos(s), n = Math.sin(s), o = Math.cos(s + t), a = Math.sin(s + t);
  return [
    {
      x: r - n * i,
      y: n + r * i
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
const ga = (s, t, e, i) => {
  const r = s * i - t * e < 0 ? -1 : 1;
  let n = s * e + t * i;
  return n > 1 && (n = 1), n < -1 && (n = -1), r * Math.acos(n);
}, ep = (s, t, e, i, r, n, o, a, l, c, h, f, d) => {
  const u = Math.pow(r, 2), m = Math.pow(n, 2), p = Math.pow(h, 2), g = Math.pow(f, 2);
  let x = u * m - u * g - m * p;
  x < 0 && (x = 0), x /= u * g + m * p, x = Math.sqrt(x) * (o === a ? -1 : 1);
  const y = x * r / n * f, v = x * -n / r * h, w = c * y - l * v + (s + e) / 2, _ = l * y + c * v + (t + i) / 2, S = (h - y) / r, C = (f - v) / n, b = (-h - y) / r, A = (-f - v) / n, P = ga(1, 0, S, C);
  let M = ga(S, C, b, A);
  a === 0 && M > 0 && (M -= Qi), a === 1 && M < 0 && (M += Qi), d.centerX = w, d.centerY = _, d.ang1 = P, d.ang2 = M;
};
function ip(s, t, e, i, r, n, o, a = 0, l = 0, c = 0) {
  if (n === 0 || o === 0)
    return;
  const h = Math.sin(a * Qi / 360), f = Math.cos(a * Qi / 360), d = f * (t - i) / 2 + h * (e - r) / 2, u = -h * (t - i) / 2 + f * (e - r) / 2;
  if (d === 0 && u === 0)
    return;
  n = Math.abs(n), o = Math.abs(o);
  const m = Math.pow(d, 2) / Math.pow(n, 2) + Math.pow(u, 2) / Math.pow(o, 2);
  m > 1 && (n *= Math.sqrt(m), o *= Math.sqrt(m)), ep(
    t,
    e,
    i,
    r,
    n,
    o,
    l,
    c,
    h,
    f,
    d,
    u,
    $n
  );
  let { ang1: p, ang2: g } = $n;
  const { centerX: x, centerY: y } = $n;
  let v = Math.abs(g) / (Qi / 4);
  Math.abs(1 - v) < 1e-7 && (v = 1);
  const w = Math.max(Math.ceil(v), 1);
  g /= w;
  let _ = s[s.length - 2], S = s[s.length - 1];
  const C = { x: 0, y: 0 };
  for (let b = 0; b < w; b++) {
    const A = tp(p, g), { x: P, y: M } = Yn(A[0], n, o, f, h, x, y, C), { x: T, y: k } = Yn(A[1], n, o, f, h, x, y, C), { x: E, y: I } = Yn(A[2], n, o, f, h, x, y, C);
    hh(
      s,
      _,
      S,
      P,
      M,
      T,
      k,
      E,
      I
    ), _ = E, S = I, p += g;
  }
}
function sp(s, t, e) {
  const i = (o, a) => {
    const l = a.x - o.x, c = a.y - o.y, h = Math.sqrt(l * l + c * c), f = l / h, d = c / h;
    return { len: h, nx: f, ny: d };
  }, r = (o, a) => {
    o === 0 ? s.moveTo(a.x, a.y) : s.lineTo(a.x, a.y);
  };
  let n = t[t.length - 1];
  for (let o = 0; o < t.length; o++) {
    const a = t[o % t.length], l = a.radius ?? e;
    if (l <= 0) {
      r(o, a), n = a;
      continue;
    }
    const c = t[(o + 1) % t.length], h = i(a, n), f = i(a, c);
    if (h.len < 1e-4 || f.len < 1e-4) {
      r(o, a), n = a;
      continue;
    }
    let d = Math.asin(h.nx * f.ny - h.ny * f.nx), u = 1, m = !1;
    h.nx * f.nx - h.ny * -f.ny < 0 ? d < 0 ? d = Math.PI + d : (d = Math.PI - d, u = -1, m = !0) : d > 0 && (u = -1, m = !0);
    const p = d / 2;
    let g, x = Math.abs(
      Math.cos(p) * l / Math.sin(p)
    );
    x > Math.min(h.len / 2, f.len / 2) ? (x = Math.min(h.len / 2, f.len / 2), g = Math.abs(x * Math.sin(p) / Math.cos(p))) : g = l;
    const y = a.x + f.nx * x + -f.ny * g * u, v = a.y + f.ny * x + f.nx * g * u, w = Math.atan2(h.ny, h.nx) + Math.PI / 2 * u, _ = Math.atan2(f.ny, f.nx) - Math.PI / 2 * u;
    o === 0 && s.moveTo(
      y + Math.cos(w) * g,
      v + Math.sin(w) * g
    ), s.arc(y, v, g, w, _, m), n = a;
  }
}
function np(s, t, e, i) {
  const r = (a, l) => Math.sqrt((a.x - l.x) ** 2 + (a.y - l.y) ** 2), n = (a, l, c) => ({
    x: a.x + (l.x - a.x) * c,
    y: a.y + (l.y - a.y) * c
  }), o = t.length;
  for (let a = 0; a < o; a++) {
    const l = t[(a + 1) % o], c = l.radius ?? e;
    if (c <= 0) {
      a === 0 ? s.moveTo(l.x, l.y) : s.lineTo(l.x, l.y);
      continue;
    }
    const h = t[a], f = t[(a + 2) % o], d = r(h, l);
    let u;
    if (d < 1e-4)
      u = l;
    else {
      const g = Math.min(d / 2, c);
      u = n(
        l,
        h,
        g / d
      );
    }
    const m = r(f, l);
    let p;
    if (m < 1e-4)
      p = l;
    else {
      const g = Math.min(m / 2, c);
      p = n(
        l,
        f,
        g / m
      );
    }
    a === 0 ? s.moveTo(u.x, u.y) : s.lineTo(u.x, u.y), s.quadraticCurveTo(l.x, l.y, p.x, p.y, i);
  }
}
const rp = new ft();
class op {
  constructor(t) {
    this.shapePrimitives = [], this._currentPoly = null, this._bounds = new me(), this._graphicsPath2D = t;
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
    const i = this._currentPoly.points, r = i[i.length - 2], n = i[i.length - 1];
    return (r !== t || n !== e) && i.push(t, e), this;
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
  arc(t, e, i, r, n, o) {
    this._ensurePoly(!1);
    const a = this._currentPoly.points;
    return ch(a, t, e, i, r, n, o), this;
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
  arcTo(t, e, i, r, n) {
    this._ensurePoly();
    const o = this._currentPoly.points;
    return Jd(o, t, e, i, r, n), this;
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
  arcToSvg(t, e, i, r, n, o, a) {
    const l = this._currentPoly.points;
    return ip(
      l,
      this._currentPoly.lastX,
      this._currentPoly.lastY,
      o,
      a,
      t,
      e,
      i,
      r,
      n
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
  bezierCurveTo(t, e, i, r, n, o, a) {
    this._ensurePoly();
    const l = this._currentPoly;
    return hh(
      this._currentPoly.points,
      l.lastX,
      l.lastY,
      t,
      e,
      i,
      r,
      n,
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
  quadraticCurveTo(t, e, i, r, n) {
    this._ensurePoly();
    const o = this._currentPoly;
    return Zd(
      this._currentPoly.points,
      o.lastX,
      o.lastY,
      t,
      e,
      i,
      r,
      n
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
      const r = t.instructions[i];
      this[r.action](...r.data);
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
  rect(t, e, i, r, n) {
    return this.drawShape(new ft(t, e, i, r), n), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, i, r) {
    return this.drawShape(new dn(t, e, i), r), this;
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
    const r = new gi(t);
    return r.closePath = e, this.drawShape(r, i), this;
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
  regularPoly(t, e, i, r, n = 0, o) {
    r = Math.max(r | 0, 3);
    const a = -1 * Math.PI / 2 + n, l = Math.PI * 2 / r, c = [];
    for (let h = 0; h < r; h++) {
      const f = h * l + a;
      c.push(
        t + i * Math.cos(f),
        e + i * Math.sin(f)
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
  roundPoly(t, e, i, r, n, o = 0, a) {
    if (r = Math.max(r | 0, 3), n <= 0)
      return this.regularPoly(t, e, i, r, o);
    const l = i * Math.sin(Math.PI / r) - 1e-3;
    n = Math.min(n, l);
    const c = -1 * Math.PI / 2 + o, h = Math.PI * 2 / r, f = (r - 2) * Math.PI / r / 2;
    for (let d = 0; d < r; d++) {
      const u = d * h + c, m = t + i * Math.cos(u), p = e + i * Math.sin(u), g = u + Math.PI + f, x = u - Math.PI - f, y = m + n * Math.cos(g), v = p + n * Math.sin(g), w = m + n * Math.cos(x), _ = p + n * Math.sin(x);
      d === 0 ? this.moveTo(y, v) : this.lineTo(y, v), this.quadraticCurveTo(m, p, w, _, a);
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
  roundShape(t, e, i = !1, r) {
    return t.length < 3 ? this : (i ? np(this, t, e, r) : sp(this, t, e), this.closePath());
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
  filletRect(t, e, i, r, n) {
    if (n === 0)
      return this.rect(t, e, i, r);
    const o = Math.min(i, r) / 2, a = Math.min(o, Math.max(-o, n)), l = t + i, c = e + r, h = a < 0 ? -a : 0, f = Math.abs(a);
    return this.moveTo(t, e + f).arcTo(t + h, e + h, t + f, e, f).lineTo(l - f, e).arcTo(l - h, e + h, l, e + f, f).lineTo(l, c - f).arcTo(l - h, c - h, t + i - f, c, f).lineTo(t + f, c).arcTo(t + h, c - h, t, c - f, f).closePath();
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
  chamferRect(t, e, i, r, n, o) {
    if (n <= 0)
      return this.rect(t, e, i, r);
    const a = Math.min(n, Math.min(i, r) / 2), l = t + i, c = e + r, h = [
      t + a,
      e,
      l - a,
      e,
      l,
      e + a,
      l,
      c - a,
      l - a,
      c,
      t + a,
      c,
      t,
      c - a,
      t,
      e + a
    ];
    for (let f = h.length - 1; f >= 2; f -= 2)
      h[f] === h[f - 2] && h[f - 1] === h[f - 3] && h.splice(f - 1, 2);
    return this.poly(h, !0, o);
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
  ellipse(t, e, i, r, n) {
    return this.drawShape(new eo(t, e, i, r), n), this;
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
  roundRect(t, e, i, r, n, o) {
    return this.drawShape(new pn(t, e, i, r, n), o), this;
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
    return i && this.endPoly(), i = new gi(), i.points.push(t, e), this._currentPoly = i, this;
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
    if (!this._currentPoly && (this._currentPoly = new gi(), t)) {
      const e = this.shapePrimitives[this.shapePrimitives.length - 1];
      if (e) {
        let i = e.shape.x, r = e.shape.y;
        if (e.transform && !e.transform.isIdentity()) {
          const n = e.transform, o = i;
          i = n.a * i + n.c * r + n.tx, r = n.b * o + n.d * r + n.ty;
        }
        this._currentPoly.points.push(i, r);
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
      const r = e[i], n = r.shape.getBounds(rp);
      r.transform ? t.addRect(n, r.transform) : t.addRect(n);
    }
    return t;
  }
}
class Ci {
  /**
   * Creates a `GraphicsPath` instance optionally from an SVG path string or an array of `PathInstruction`.
   * @param instructions - An SVG path string or an array of `PathInstruction` objects.
   */
  constructor(t) {
    this.instructions = [], this.uid = gt("graphicsPath"), this._dirty = !0, typeof t == "string" ? Ff(t, this) : this.instructions = (t == null ? void 0 : t.slice()) ?? [];
  }
  /**
   * Provides access to the internal shape path, ensuring it is up-to-date with the current instructions.
   * @returns The `ShapePath` instance associated with this `GraphicsPath`.
   */
  get shapePath() {
    return this._shapePath || (this._shapePath = new op(this)), this._dirty && (this._dirty = !1, this._shapePath.buildPath()), this._shapePath;
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
  bezierCurveToShort(t, e, i, r, n) {
    const o = this.instructions[this.instructions.length - 1], a = this.getLastPoint(St.shared);
    let l = 0, c = 0;
    if (!o || o.action !== "bezierCurveTo")
      l = a.x, c = a.y;
    else {
      l = o.data[2], c = o.data[3];
      const h = a.x, f = a.y;
      l = h + (h - l), c = f + (f - c);
    }
    return this.instructions.push({ action: "bezierCurveTo", data: [l, c, t, e, i, r, n] }), this._dirty = !0, this;
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
    const r = this.instructions[this.instructions.length - 1], n = this.getLastPoint(St.shared);
    let o = 0, a = 0;
    if (!r || r.action !== "quadraticCurveTo")
      o = n.x, a = n.y;
    else {
      o = r.data[0], a = r.data[1];
      const l = n.x, c = n.y;
      o = l + (l - o), a = c + (c - a);
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
  rect(t, e, i, r, n) {
    return this.instructions.push({ action: "rect", data: [t, e, i, r, n] }), this._dirty = !0, this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, i, r) {
    return this.instructions.push({ action: "circle", data: [t, e, i, r] }), this._dirty = !0, this;
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
  star(t, e, i, r, n, o, a) {
    n = n || r / 2;
    const l = -1 * Math.PI / 2 + o, c = i * 2, h = Math.PI * 2 / c, f = [];
    for (let d = 0; d < c; d++) {
      const u = d % 2 ? n : r, m = d * h + l;
      f.push(
        t + u * Math.cos(m),
        e + u * Math.sin(m)
      );
    }
    return this.poly(f, !0, a), this;
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
    const e = new Ci();
    if (!t)
      e.instructions = this.instructions.slice();
    else
      for (let i = 0; i < this.instructions.length; i++) {
        const r = this.instructions[i];
        e.instructions.push({ action: r.action, data: r.data.slice() });
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
    const e = t.a, i = t.b, r = t.c, n = t.d, o = t.tx, a = t.ty;
    let l = 0, c = 0, h = 0, f = 0, d = 0, u = 0, m = 0, p = 0;
    for (let g = 0; g < this.instructions.length; g++) {
      const x = this.instructions[g], y = x.data;
      switch (x.action) {
        case "moveTo":
        case "lineTo":
          l = y[0], c = y[1], y[0] = e * l + r * c + o, y[1] = i * l + n * c + a;
          break;
        case "bezierCurveTo":
          h = y[0], f = y[1], d = y[2], u = y[3], l = y[4], c = y[5], y[0] = e * h + r * f + o, y[1] = i * h + n * f + a, y[2] = e * d + r * u + o, y[3] = i * d + n * u + a, y[4] = e * l + r * c + o, y[5] = i * l + n * c + a;
          break;
        case "quadraticCurveTo":
          h = y[0], f = y[1], l = y[2], c = y[3], y[0] = e * h + r * f + o, y[1] = i * h + n * f + a, y[2] = e * l + r * c + o, y[3] = i * l + n * c + a;
          break;
        case "arcToSvg":
          l = y[5], c = y[6], m = y[0], p = y[1], y[0] = e * m + r * p, y[1] = i * m + n * p, y[5] = e * l + r * c + o, y[6] = i * l + n * c + a;
          break;
        case "circle":
          y[4] = Wi(y[3], t);
          break;
        case "rect":
          y[4] = Wi(y[4], t);
          break;
        case "ellipse":
          y[8] = Wi(y[8], t);
          break;
        case "roundRect":
          y[5] = Wi(y[5], t);
          break;
        case "addPath":
          y[0].transform(t);
          break;
        case "poly":
          y[2] = Wi(y[2], t);
          break;
        default:
          ct("unknown transform action", x.action);
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
function Wi(s, t) {
  return s ? s.prepend(t) : t.clone();
}
function ap(s, t) {
  if (typeof s == "string") {
    const i = document.createElement("div");
    i.innerHTML = s.trim(), s = i.querySelector("svg");
  }
  const e = {
    context: t,
    path: new Ci()
  };
  return uh(s, e, null, null), t;
}
function uh(s, t, e, i) {
  const r = s.children, { fillStyle: n, strokeStyle: o } = lp(s);
  n && e ? e = { ...e, ...n } : n && (e = n), o && i ? i = { ...i, ...o } : o && (i = o), t.context.fillStyle = e, t.context.strokeStyle = i;
  let a, l, c, h, f, d, u, m, p, g, x, y, v, w, _, S, C;
  switch (s.nodeName.toLowerCase()) {
    case "path":
      w = s.getAttribute("d"), _ = new Ci(w), t.context.path(_), e && t.context.fill(), i && t.context.stroke();
      break;
    case "circle":
      u = _t(s, "cx", 0), m = _t(s, "cy", 0), p = _t(s, "r", 0), t.context.ellipse(u, m, p, p), e && t.context.fill(), i && t.context.stroke();
      break;
    case "rect":
      a = _t(s, "x", 0), l = _t(s, "y", 0), S = _t(s, "width", 0), C = _t(s, "height", 0), g = _t(s, "rx", 0), x = _t(s, "ry", 0), g || x ? t.context.roundRect(a, l, S, C, g || x) : t.context.rect(a, l, S, C), e && t.context.fill(), i && t.context.stroke();
      break;
    case "ellipse":
      u = _t(s, "cx", 0), m = _t(s, "cy", 0), g = _t(s, "rx", 0), x = _t(s, "ry", 0), t.context.beginPath(), t.context.ellipse(u, m, g, x), e && t.context.fill(), i && t.context.stroke();
      break;
    case "line":
      c = _t(s, "x1", 0), h = _t(s, "y1", 0), f = _t(s, "x2", 0), d = _t(s, "y2", 0), t.context.beginPath(), t.context.moveTo(c, h), t.context.lineTo(f, d), i && t.context.stroke();
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
  for (let b = 0; b < r.length; b++)
    uh(r[b], t, e, i);
}
function _t(s, t, e) {
  const i = s.getAttribute(t);
  return i ? Number(i) : e;
}
function lp(s) {
  const t = s.getAttribute("style"), e = {}, i = {};
  let r = !1, n = !1;
  if (t) {
    const o = t.split(";");
    for (let a = 0; a < o.length; a++) {
      const l = o[a], [c, h] = l.split(":");
      switch (c) {
        case "stroke":
          h !== "none" && (e.color = dt.shared.setValue(h).toNumber(), n = !0);
          break;
        case "stroke-width":
          e.width = Number(h);
          break;
        case "fill":
          h !== "none" && (r = !0, i.color = dt.shared.setValue(h).toNumber());
          break;
        case "fill-opacity":
          i.alpha = Number(h);
          break;
        case "stroke-opacity":
          e.alpha = Number(h);
          break;
        case "opacity":
          i.alpha = Number(h), e.alpha = Number(h);
          break;
      }
    }
  } else {
    const o = s.getAttribute("stroke");
    o && o !== "none" && (n = !0, e.color = dt.shared.setValue(o).toNumber(), e.width = _t(s, "stroke-width", 1));
    const a = s.getAttribute("fill");
    a && a !== "none" && (r = !0, i.color = dt.shared.setValue(a).toNumber());
  }
  return {
    strokeStyle: n ? e : null,
    fillStyle: r ? i : null
  };
}
function hp(s) {
  return dt.isColorLike(s);
}
function _a(s) {
  return s instanceof fn;
}
function xa(s) {
  return s instanceof as;
}
function cp(s, t, e) {
  const i = dt.shared.setValue(t ?? 0);
  return s.color = i.toNumber(), s.alpha = i.alpha === 1 ? e.alpha : i.alpha, s.texture = W.WHITE, { ...e, ...s };
}
function ya(s, t, e) {
  return s.fill = t, s.color = 16777215, s.texture = t.texture, s.matrix = t.transform, { ...e, ...s };
}
function va(s, t, e) {
  return t.buildLinearGradient(), s.fill = t, s.color = 16777215, s.texture = t.texture, s.matrix = t.transform, { ...e, ...s };
}
function up(s, t) {
  var r;
  const e = { ...t, ...s };
  if (e.texture) {
    if (e.texture !== W.WHITE) {
      const o = ((r = e.matrix) == null ? void 0 : r.invert()) || new H();
      o.translate(e.texture.frame.x, e.texture.frame.y), o.scale(1 / e.texture.source.width, 1 / e.texture.source.height), e.matrix = o;
    }
    const n = e.texture.source.style;
    n.addressMode === "clamp-to-edge" && (n.addressMode = "repeat", n.update());
  }
  const i = dt.shared.setValue(e.color);
  return e.alpha *= i.alpha, e.color = i.toNumber(), e.matrix = e.matrix ? e.matrix.clone() : null, e;
}
function je(s, t) {
  if (s == null)
    return null;
  const e = {}, i = s;
  return hp(s) ? cp(e, s, t) : _a(s) ? ya(e, s, t) : xa(s) ? va(e, s, t) : i.fill && _a(i.fill) ? ya(i, i.fill, t) : i.fill && xa(i.fill) ? va(i, i.fill, t) : up(i, t);
}
function js(s, t) {
  const { width: e, alignment: i, miterLimit: r, cap: n, join: o, ...a } = t, l = je(s, a);
  return l ? {
    width: e,
    alignment: i,
    miterLimit: r,
    cap: n,
    join: o,
    ...l
  } : null;
}
const fp = new St(), ba = new H(), so = class he extends Mt {
  constructor() {
    super(...arguments), this.uid = gt("graphicsContext"), this.dirty = !0, this.batchMode = "auto", this.instructions = [], this._activePath = new Ci(), this._transform = new H(), this._fillStyle = { ...he.defaultFillStyle }, this._strokeStyle = { ...he.defaultStrokeStyle }, this._stateStack = [], this._tick = 0, this._bounds = new me(), this._boundsDirty = !0;
  }
  /**
   * Creates a new GraphicsContext object that is a clone of this instance, copying all properties,
   * including the current drawing state, transformations, styles, and instructions.
   * @returns A new GraphicsContext instance with the same properties and state as this one.
   */
  clone() {
    const t = new he();
    return t.batchMode = this.batchMode, t.instructions = this.instructions.slice(), t._activePath = this._activePath.clone(), t._transform = this._transform.clone(), t._fillStyle = { ...this._fillStyle }, t._strokeStyle = { ...this._strokeStyle }, t._stateStack = this._stateStack.slice(), t._bounds = this._bounds.clone(), t._boundsDirty = !0, t;
  }
  /**
   * The current fill style of the graphics context. This can be a color, gradient, pattern, or a more complex style defined by a FillStyle object.
   */
  get fillStyle() {
    return this._fillStyle;
  }
  set fillStyle(t) {
    this._fillStyle = je(t, he.defaultFillStyle);
  }
  /**
   * The current stroke style of the graphics context. Similar to fill styles, stroke styles can encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   */
  get strokeStyle() {
    return this._strokeStyle;
  }
  set strokeStyle(t) {
    this._strokeStyle = js(t, he.defaultStrokeStyle);
  }
  /**
   * Sets the current fill style of the graphics context. The fill style can be a color, gradient,
   * pattern, or a more complex style defined by a FillStyle object.
   * @param style - The fill style to apply. This can be a simple color, a gradient or pattern object,
   *                or a FillStyle or ConvertedFillStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setFillStyle(t) {
    return this._fillStyle = je(t, he.defaultFillStyle), this;
  }
  /**
   * Sets the current stroke style of the graphics context. Similar to fill styles, stroke styles can
   * encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   * @param style - The stroke style to apply. Can be defined as a color, a gradient or pattern,
   *                or a StrokeStyle or ConvertedStrokeStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setStrokeStyle(t) {
    return this._strokeStyle = je(t, he.defaultStrokeStyle), this;
  }
  texture(t, e, i, r, n, o) {
    return this.instructions.push({
      action: "texture",
      data: {
        image: t,
        dx: i || 0,
        dy: r || 0,
        dw: n || t.frame.width,
        dh: o || t.frame.height,
        transform: this._transform.clone(),
        alpha: this._fillStyle.alpha,
        style: e ? dt.shared.setValue(e).toNumber() : 16777215
      }
    }), this.onUpdate(), this;
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  beginPath() {
    return this._activePath = new Ci(), this;
  }
  fill(t, e) {
    let i;
    const r = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && r && r.action === "stroke" ? i = r.data.path : i = this._activePath.clone(), i ? (t != null && (e !== void 0 && typeof t == "number" && ($(Y, "GraphicsContext.fill(color, alpha) is deprecated, use GraphicsContext.fill({ color, alpha }) instead"), t = { color: t, alpha: e }), this._fillStyle = je(t, he.defaultFillStyle)), this.instructions.push({
      action: "fill",
      // TODO copy fill style!
      data: { style: this.fillStyle, path: i }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  _initNextPathLocation() {
    const { x: t, y: e } = this._activePath.getLastPoint(St.shared);
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
    return this._tick === 0 && i && i.action === "fill" ? e = i.data.path : e = this._activePath.clone(), e ? (t != null && (this._strokeStyle = js(t, he.defaultStrokeStyle)), this.instructions.push({
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
  arc(t, e, i, r, n, o) {
    this._tick++;
    const a = this._transform;
    return this._activePath.arc(
      a.a * t + a.c * e + a.tx,
      a.b * t + a.d * e + a.ty,
      i,
      r,
      n,
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
  arcTo(t, e, i, r, n) {
    this._tick++;
    const o = this._transform;
    return this._activePath.arcTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * i + o.c * r + o.tx,
      o.b * i + o.d * r + o.ty,
      n
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
  arcToSvg(t, e, i, r, n, o, a) {
    this._tick++;
    const l = this._transform;
    return this._activePath.arcToSvg(
      t,
      e,
      i,
      // should we rotate this with transform??
      r,
      n,
      l.a * o + l.c * a + l.tx,
      l.b * o + l.d * a + l.ty
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
  bezierCurveTo(t, e, i, r, n, o, a) {
    this._tick++;
    const l = this._transform;
    return this._activePath.bezierCurveTo(
      l.a * t + l.c * e + l.tx,
      l.b * t + l.d * e + l.ty,
      l.a * i + l.c * r + l.tx,
      l.b * i + l.d * r + l.ty,
      l.a * n + l.c * o + l.tx,
      l.b * n + l.d * o + l.ty,
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
  ellipse(t, e, i, r) {
    return this._tick++, this._activePath.ellipse(t, e, i, r, this._transform.clone()), this;
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
    const i = this._transform, r = this._activePath.instructions, n = i.a * t + i.c * e + i.tx, o = i.b * t + i.d * e + i.ty;
    return r.length === 1 && r[0].action === "moveTo" ? (r[0].data[0] = n, r[0].data[1] = o, this) : (this._activePath.moveTo(
      n,
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
  quadraticCurveTo(t, e, i, r, n) {
    this._tick++;
    const o = this._transform;
    return this._activePath.quadraticCurveTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * i + o.c * r + o.tx,
      o.b * i + o.d * r + o.ty,
      n
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
  rect(t, e, i, r) {
    return this._tick++, this._activePath.rect(t, e, i, r, this._transform.clone()), this;
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
  roundRect(t, e, i, r, n) {
    return this._tick++, this._activePath.roundRect(t, e, i, r, n, this._transform.clone()), this;
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
  regularPoly(t, e, i, r, n = 0, o) {
    return this._tick++, this._activePath.regularPoly(t, e, i, r, n, o), this;
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
  roundPoly(t, e, i, r, n, o) {
    return this._tick++, this._activePath.roundPoly(t, e, i, r, n, o), this;
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
  roundShape(t, e, i, r) {
    return this._tick++, this._activePath.roundShape(t, e, i, r), this;
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
  filletRect(t, e, i, r, n) {
    return this._tick++, this._activePath.filletRect(t, e, i, r, n), this;
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
  chamferRect(t, e, i, r, n, o) {
    return this._tick++, this._activePath.chamferRect(t, e, i, r, n, o), this;
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
  star(t, e, i, r, n = 0, o = 0) {
    return this._tick++, this._activePath.star(t, e, i, r, n, o, this._transform.clone()), this;
  }
  /**
   * Parses and renders an SVG string into the graphics context. This allows for complex shapes and paths
   * defined in SVG format to be drawn within the graphics context.
   * @param svg - The SVG string to be parsed and rendered.
   */
  svg(t) {
    return this._tick++, ap(t, this), this;
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
  setTransform(t, e, i, r, n, o) {
    return t instanceof H ? (this._transform.set(t.a, t.b, t.c, t.d, t.tx, t.ty), this) : (this._transform.set(t, e, i, r, n, o), this);
  }
  transform(t, e, i, r, n, o) {
    return t instanceof H ? (this._transform.append(t), this) : (ba.set(t, e, i, r, n, o), this._transform.append(ba), this);
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
      const i = this.instructions[e], r = i.action;
      if (r === "fill") {
        const n = i.data;
        t.addBounds(n.path.bounds);
      } else if (r === "texture") {
        const n = i.data;
        t.addFrame(n.dx, n.dy, n.dx + n.dw, n.dy + n.dh, n.transform);
      }
      if (r === "stroke") {
        const n = i.data, o = n.style.width / 2, a = n.path.bounds;
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
    var r;
    if (!this.bounds.containsPoint(t.x, t.y))
      return !1;
    const e = this.instructions;
    let i = !1;
    for (let n = 0; n < e.length; n++) {
      const o = e[n], a = o.data, l = a.path;
      if (!o.action || !l)
        continue;
      const c = a.style, h = l.shapePath.shapePrimitives;
      for (let f = 0; f < h.length; f++) {
        const d = h[f].shape;
        if (!c || !d)
          continue;
        const u = h[f].transform, m = u ? u.applyInverse(t, fp) : t;
        o.action === "fill" ? i = d.contains(m.x, m.y) : i = d.strokeContains(m.x, m.y, c.width);
        const p = a.hole;
        if (p) {
          const g = (r = p.shapePath) == null ? void 0 : r.shapePrimitives;
          if (g)
            for (let x = 0; x < g.length; x++)
              g[x].shape.contains(m.x, m.y) && (i = !1);
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
so.defaultFillStyle = {
  /** The color to use for the fill. */
  color: 16777215,
  /** The alpha value to use for the fill. */
  alpha: 1,
  /** The texture to use for the fill. */
  texture: W.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null
};
so.defaultStrokeStyle = {
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
  texture: W.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null
};
let Xt = so;
const wa = [
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
function dp(s) {
  const t = [];
  let e = 0;
  for (let i = 0; i < wa.length; i++) {
    const r = `_${wa[i]}`;
    t[e++] = s[r];
  }
  return e = fh(s._fill, t, e), e = pp(s._stroke, t, e), e = mp(s.dropShadow, t, e), t.join("-");
}
function fh(s, t, e) {
  var i;
  return s && (t[e++] = s.color, t[e++] = s.alpha, t[e++] = (i = s.fill) == null ? void 0 : i.styleKey), e;
}
function pp(s, t, e) {
  return s && (e = fh(s, t, e), t[e++] = s.width, t[e++] = s.alignment, t[e++] = s.cap, t[e++] = s.join, t[e++] = s.miterLimit), e;
}
function mp(s, t, e) {
  return s && (t[e++] = s.alpha, t[e++] = s.angle, t[e++] = s.blur, t[e++] = s.distance, t[e++] = dt.shared.setValue(s.color).toNumber()), e;
}
const no = class ci extends Mt {
  constructor(t = {}) {
    super(), gp(t);
    const e = { ...ci.defaultTextStyle, ...t };
    for (const i in e) {
      const r = i;
      this[r] = e[i];
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
    t !== null && typeof t == "object" ? this._dropShadow = this._createProxy({ ...ci.defaultDropShadow, ...t }) : this._dropShadow = t ? this._createProxy({ ...ci.defaultDropShadow }) : null, this.update();
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
    t !== this._originalFill && (this._originalFill = t, this._isFillStyle(t) && (this._originalFill = this._createProxy({ ...Xt.defaultFillStyle, ...t }, () => {
      this._fill = je(
        { ...this._originalFill },
        Xt.defaultFillStyle
      );
    })), this._fill = je(
      t === 0 ? "black" : t,
      Xt.defaultFillStyle
    ), this.update());
  }
  /** A fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'. */
  get stroke() {
    return this._originalStroke;
  }
  set stroke(t) {
    t !== this._originalStroke && (this._originalStroke = t, this._isFillStyle(t) && (this._originalStroke = this._createProxy({ ...Xt.defaultStrokeStyle, ...t }, () => {
      this._stroke = js(
        { ...this._originalStroke },
        Xt.defaultStrokeStyle
      );
    })), this._stroke = js(t, Xt.defaultStrokeStyle), this.update());
  }
  _generateKey() {
    return this._styleKey = dp(this), this._styleKey;
  }
  update() {
    this._styleKey = null, this.emit("update", this);
  }
  /** Resets all properties to the default values */
  reset() {
    const t = ci.defaultTextStyle;
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
    return new ci({
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
    var i, r, n, o;
    if (this.removeAllListeners(), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const a = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      (i = this._fill) != null && i.texture && this._fill.texture.destroy(a), (r = this._originalFill) != null && r.texture && this._originalFill.texture.destroy(a), (n = this._stroke) != null && n.texture && this._stroke.texture.destroy(a), (o = this._originalStroke) != null && o.texture && this._originalStroke.texture.destroy(a);
    }
    this._fill = null, this._stroke = null, this.dropShadow = null, this._originalStroke = null, this._originalFill = null;
  }
  _createProxy(t, e) {
    return new Proxy(t, {
      set: (i, r, n) => (i[r] = n, e == null || e(r, n), this.update(), !0)
    });
  }
  _isFillStyle(t) {
    return (t ?? null) !== null && !(dt.isColorLike(t) || t instanceof as || t instanceof fn);
  }
};
no.defaultDropShadow = {
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
no.defaultTextStyle = {
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
let ii = no;
function gp(s) {
  const t = s;
  if (typeof t.dropShadow == "boolean" && t.dropShadow) {
    const e = ii.defaultDropShadow;
    s.dropShadow = {
      alpha: t.dropShadowAlpha ?? e.alpha,
      angle: t.dropShadowAngle ?? e.angle,
      blur: t.dropShadowBlur ?? e.blur,
      color: t.dropShadowColor ?? e.color,
      distance: t.dropShadowDistance ?? e.distance
    };
  }
  if (t.strokeThickness !== void 0) {
    $(Y, "strokeThickness is now a part of stroke");
    const e = t.stroke;
    let i = {};
    if (dt.isColorLike(e))
      i.color = e;
    else if (e instanceof as || e instanceof fn)
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
    $(Y, "gradient fill is now a fill pattern: `new FillGradient(...)`");
    let e;
    s.fontSize == null ? s.fontSize = ii.defaultTextStyle.fontSize : typeof s.fontSize == "string" ? e = parseInt(s.fontSize, 10) : e = s.fontSize;
    const i = new as(0, 0, 0, e * 1.7), r = t.fillGradientStops.map((n) => dt.shared.setValue(n).toNumber());
    r.forEach((n, o) => {
      const a = o / (r.length - 1);
      i.addColorStop(a, n);
    }), s.fill = {
      fill: i
    };
  }
}
class _p {
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
    const r = i.getContext("2d");
    return { canvas: i, context: r };
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param minWidth - The minimum width of the render texture.
   * @param minHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @returns The new render texture.
   */
  getOptimalCanvasAndContext(t, e, i = 1) {
    t = Math.ceil(t * i - 1e-6), e = Math.ceil(e * i - 1e-6), t = Bo(t), e = Bo(e);
    const r = (t << 17) + (e << 1);
    this._canvasPool[r] || (this._canvasPool[r] = []);
    let n = this._canvasPool[r].pop();
    return n || (n = this._createCanvasAndContext(t, e)), n;
  }
  /**
   * Place a render texture back into the pool.
   * @param canvasAndContext
   */
  returnCanvasAndContext(t) {
    const e = t.canvas, { width: i, height: r } = e, n = (i << 17) + (r << 1);
    t.context.clearRect(0, 0, i, r), this._canvasPool[n].push(t);
  }
  clear() {
    this._canvasPool = {};
  }
}
const Sa = new _p(), xp = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui"
];
function Cr(s) {
  const t = typeof s.fontSize == "number" ? `${s.fontSize}px` : s.fontSize;
  let e = s.fontFamily;
  Array.isArray(s.fontFamily) || (e = s.fontFamily.split(","));
  for (let i = e.length - 1; i >= 0; i--) {
    let r = e[i].trim();
    !/([\"\'])[^\'\"]+\1/.test(r) && !xp.includes(r) && (r = `"${r}"`), e[i] = r;
  }
  return `${s.fontStyle} ${s.fontVariant} ${s.fontWeight} ${t} ${e.join(",")}`;
}
const jn = {
  // TextMetrics requires getImageData readback for measuring fonts.
  willReadFrequently: !0
}, re = class O {
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
  constructor(t, e, i, r, n, o, a, l, c) {
    this.text = t, this.style = e, this.width = i, this.height = r, this.lines = n, this.lineWidths = o, this.lineHeight = a, this.maxLineWidth = l, this.fontProperties = c;
  }
  /**
   * Measures the supplied string of text and returns a Rectangle.
   * @param text - The text to measure.
   * @param style - The text style to use for measuring
   * @param canvas - optional specification of the canvas to use for measuring.
   * @param wordWrap
   * @returns Measured width and height of the text.
   */
  static measureText(t = " ", e, i = O._canvas, r = e.wordWrap) {
    var y;
    const n = `${t}:${e.styleKey}`;
    if (O._measurementCache[n])
      return O._measurementCache[n];
    const o = Cr(e), a = O.measureFont(o);
    a.fontSize === 0 && (a.fontSize = e.fontSize, a.ascent = e.fontSize);
    const l = O.__context;
    l.font = o;
    const h = (r ? O._wordWrap(t, e, i) : t).split(/(?:\r\n|\r|\n)/), f = new Array(h.length);
    let d = 0;
    for (let v = 0; v < h.length; v++) {
      const w = O._measureText(h[v], e.letterSpacing, l);
      f[v] = w, d = Math.max(d, w);
    }
    const u = ((y = e._stroke) == null ? void 0 : y.width) || 0;
    let m = d + u;
    e.dropShadow && (m += e.dropShadow.distance);
    const p = e.lineHeight || a.fontSize;
    let g = Math.max(p, a.fontSize + u) + (h.length - 1) * (p + e.leading);
    return e.dropShadow && (g += e.dropShadow.distance), new O(
      t,
      e,
      m,
      g,
      h,
      f,
      p + e.leading,
      d,
      a
    );
  }
  static _measureText(t, e, i) {
    let r = !1;
    O.experimentalLetterSpacingSupported && (O.experimentalLetterSpacing ? (i.letterSpacing = `${e}px`, i.textLetterSpacing = `${e}px`, r = !0) : (i.letterSpacing = "0px", i.textLetterSpacing = "0px"));
    const n = i.measureText(t);
    let o = n.width;
    const a = -n.actualBoundingBoxLeft;
    let c = n.actualBoundingBoxRight - a;
    if (o > 0)
      if (r)
        o -= e, c -= e;
      else {
        const h = (O.graphemeSegmenter(t).length - 1) * e;
        o += h, c += h;
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
    const r = i.getContext("2d", jn);
    let n = 0, o = "", a = "";
    const l = /* @__PURE__ */ Object.create(null), { letterSpacing: c, whiteSpace: h } = e, f = O._collapseSpaces(h), d = O._collapseNewlines(h);
    let u = !f;
    const m = e.wordWrapWidth + c, p = O._tokenize(t);
    for (let g = 0; g < p.length; g++) {
      let x = p[g];
      if (O._isNewline(x)) {
        if (!d) {
          a += O._addLine(o), u = !f, o = "", n = 0;
          continue;
        }
        x = " ";
      }
      if (f) {
        const v = O.isBreakingSpace(x), w = O.isBreakingSpace(o[o.length - 1]);
        if (v && w)
          continue;
      }
      const y = O._getFromCache(x, c, l, r);
      if (y > m)
        if (o !== "" && (a += O._addLine(o), o = "", n = 0), O.canBreakWords(x, e.breakWords)) {
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
            const b = O._getFromCache(_, c, l, r);
            b + n > m && (a += O._addLine(o), u = !1, o = "", n = 0), o += _, n += b;
          }
        } else {
          o.length > 0 && (a += O._addLine(o), o = "", n = 0);
          const v = g === p.length - 1;
          a += O._addLine(x, !v), u = !1, o = "", n = 0;
        }
      else
        y + n > m && (u = !1, a += O._addLine(o), o = "", n = 0), (o.length > 0 || !O.isBreakingSpace(x) || u) && (o += x, n += y);
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
  static _getFromCache(t, e, i, r) {
    let n = i[t];
    return typeof n != "number" && (n = O._measureText(t, e, r) + e, i[t] = n), n;
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
    for (let r = 0; r < t.length; r++) {
      const n = t[r], o = t[r + 1];
      if (O.isBreakingSpace(n, o) || O._isNewline(n)) {
        i !== "" && (e.push(i), i = ""), e.push(n);
        continue;
      }
      i += n;
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
  static canBreakChars(t, e, i, r, n) {
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
    const i = e.measureText(O.METRICS_STRING + O.BASELINE_SYMBOL), r = {
      ascent: i.actualBoundingBoxAscent,
      descent: i.actualBoundingBoxDescent,
      fontSize: i.actualBoundingBoxAscent + i.actualBoundingBoxDescent
    };
    return O._fonts[t] = r, r;
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
        const e = new OffscreenCanvas(0, 0), i = e.getContext("2d", jn);
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
    return O.__context || (O.__context = O._canvas.getContext("2d", jn)), O.__context;
  }
};
re.METRICS_STRING = "|ÉqÅ";
re.BASELINE_SYMBOL = "M";
re.BASELINE_MULTIPLIER = 1.4;
re.HEIGHT_MULTIPLIER = 2;
re.graphemeSegmenter = (() => {
  if (typeof (Intl == null ? void 0 : Intl.Segmenter) == "function") {
    const s = new Intl.Segmenter();
    return (t) => [...s.segment(t)].map((e) => e.segment);
  }
  return (s) => [...s];
})();
re.experimentalLetterSpacing = !1;
re._fonts = {};
re._newlines = [
  10,
  // line feed
  13
  // carriage return
];
re._breakingSpaces = [
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
re._measurementCache = {};
let Pr = re;
function Aa(s, t) {
  if (s.texture === W.WHITE && !s.fill)
    return dt.shared.setValue(s.color).setAlpha(s.alpha ?? 1).toHexa();
  if (s.fill) {
    if (s.fill instanceof fn) {
      const e = s.fill, i = t.createPattern(e.texture.source.resource, "repeat"), r = e.transform.copyTo(H.shared);
      return r.scale(
        e.texture.frame.width,
        e.texture.frame.height
      ), i.setTransform(r), i;
    } else if (s.fill instanceof as) {
      const e = s.fill;
      if (e.type === "linear") {
        const i = t.createLinearGradient(
          e.x0,
          e.y0,
          e.x1,
          e.y1
        );
        return e.gradientStops.forEach((r) => {
          i.addColorStop(r.offset, dt.shared.setValue(r.color).toHex());
        }), i;
      }
    }
  } else {
    const e = t.createPattern(s.texture.source.resource, "repeat"), i = s.matrix.copyTo(H.shared);
    return i.scale(s.texture.frame.width, s.texture.frame.height), e.setTransform(i), e;
  }
  return ct("FillStyle not recognised", s), "red";
}
function dh(s) {
  if (s === "")
    return [];
  typeof s == "string" && (s = [s]);
  const t = [];
  for (let e = 0, i = s.length; e < i; e++) {
    const r = s[e];
    if (Array.isArray(r)) {
      if (r.length !== 2)
        throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${r.length}.`);
      if (r[0].length === 0 || r[1].length === 0)
        throw new Error("[BitmapFont]: Invalid character delimiter.");
      const n = r[0].charCodeAt(0), o = r[1].charCodeAt(0);
      if (o < n)
        throw new Error("[BitmapFont]: Invalid character range.");
      for (let a = n, l = o; a <= l; a++)
        t.push(String.fromCharCode(a));
    } else
      t.push(...Array.from(r));
  }
  if (t.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return t;
}
const ph = class mh extends Xl {
  /**
   * @param options - The options for the dynamic bitmap font.
   */
  constructor(t) {
    super(), this.resolution = 1, this.pages = [], this._padding = 0, this._measureCache = /* @__PURE__ */ Object.create(null), this._currentChars = [], this._currentX = 0, this._currentY = 0, this._currentPageIndex = -1, this._skipKerning = !1;
    const e = { ...mh.defaultOptions, ...t };
    this._textureSize = e.textureSize, this._mipmap = e.mipmap;
    const i = e.style.clone();
    e.overrideFill && (i._fill.color = 16777215, i._fill.alpha = 1, i._fill.texture = W.WHITE, i._fill.fill = null), this.applyFillAsTint = e.overrideFill;
    const r = i.fontSize;
    i.fontSize = this.baseMeasurementFontSize;
    const n = Cr(i);
    e.overrideSize ? i._stroke && (i._stroke.width *= this.baseRenderedFontSize / r) : i.fontSize = this.baseRenderedFontSize = r, this._style = i, this._skipKerning = e.skipKerning ?? !1, this.resolution = e.resolution ?? 1, this._padding = e.padding ?? 4, this.fontMetrics = Pr.measureFont(n), this.lineHeight = i.lineHeight || this.fontMetrics.fontSize || i.fontSize;
  }
  ensureCharacters(t) {
    var m, p;
    const e = dh(t).filter((g) => !this._currentChars.includes(g)).filter((g, x, y) => y.indexOf(g) === x);
    if (!e.length)
      return;
    this._currentChars = [...this._currentChars, ...e];
    let i;
    this._currentPageIndex === -1 ? i = this._nextPage() : i = this.pages[this._currentPageIndex];
    let { canvas: r, context: n } = i.canvasAndContext, o = i.texture.source;
    const a = this._style;
    let l = this._currentX, c = this._currentY;
    const h = this.baseRenderedFontSize / this.baseMeasurementFontSize, f = this._padding * h;
    let d = 0, u = !1;
    for (let g = 0; g < e.length; g++) {
      const x = e[g], y = Pr.measureText(x, a, r, !1), v = Math.ceil((a.fontStyle === "italic" ? 2 : 1) * y.width);
      y.lineHeight = y.height;
      const w = y.width * h, _ = y.height * h, S = v + f * 2, C = _ + f * 2;
      if (u = !1, x !== `
` && x !== "\r" && x !== "	" && x !== " " && (u = !0, d = Math.ceil(Math.max(C, d))), l + S > this._textureSize && (c += d, d = C, l = 0, c + d > this._textureSize)) {
        o.update();
        const A = this._nextPage();
        r = A.canvasAndContext.canvas, n = A.canvasAndContext.context, o = A.texture.source, c = 0;
      }
      const b = w / h - (((m = a.dropShadow) == null ? void 0 : m.distance) ?? 0) - (((p = a._stroke) == null ? void 0 : p.width) ?? 0);
      if (this.chars[x] = {
        id: x.codePointAt(0),
        xOffset: -this._padding,
        yOffset: -this._padding,
        xAdvance: b,
        kerning: {}
      }, u) {
        this._drawGlyph(
          n,
          y,
          l + f,
          c + f,
          h,
          a
        );
        const A = o.width * h, P = o.height * h, M = new ft(
          l / A * o.width,
          c / P * o.height,
          S / A * o.width,
          C / P * o.height
        );
        this.chars[x].texture = new W({
          source: o,
          frame: M
        }), l += Math.ceil(S);
      }
    }
    o.update(), this._currentX = l, this._currentY = c, this._skipKerning && this._applyKerning(e, n);
  }
  /**
   * @deprecated since 8.0.0
   * The map of base page textures (i.e., sheets of glyphs).
   */
  get pageTextures() {
    return $(Y, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
  }
  _applyKerning(t, e) {
    const i = this._measureCache;
    for (let r = 0; r < t.length; r++) {
      const n = t[r];
      for (let o = 0; o < this._currentChars.length; o++) {
        const a = this._currentChars[o];
        let l = i[n];
        l || (l = i[n] = e.measureText(n).width);
        let c = i[a];
        c || (c = i[a] = e.measureText(a).width);
        let h = e.measureText(n + a).width, f = h - (l + c);
        f && (this.chars[n].kerning[a] = f), h = e.measureText(n + a).width, f = h - (l + c), f && (this.chars[a].kerning[n] = f);
      }
    }
  }
  _nextPage() {
    this._currentPageIndex++;
    const t = this.resolution, e = Sa.getOptimalCanvasAndContext(
      this._textureSize,
      this._textureSize,
      t
    );
    this._setupContext(e.context, this._style, t);
    const i = t * (this.baseRenderedFontSize / this.baseMeasurementFontSize), r = new W({
      source: new Ii({
        resource: e.canvas,
        resolution: i,
        alphaMode: "premultiply-alpha-on-upload",
        autoGenerateMipmaps: this._mipmap
      })
    }), n = {
      canvasAndContext: e,
      texture: r
    };
    return this.pages[this._currentPageIndex] = n, n;
  }
  // canvas style!
  _setupContext(t, e, i) {
    e.fontSize = this.baseRenderedFontSize, t.scale(i, i), t.font = Cr(e), e.fontSize = this.baseMeasurementFontSize, t.textBaseline = e.textBaseline;
    const r = e._stroke, n = (r == null ? void 0 : r.width) ?? 0;
    if (r && (t.lineWidth = n, t.lineJoin = r.join, t.miterLimit = r.miterLimit, t.strokeStyle = Aa(r, t)), e._fill && (t.fillStyle = Aa(e._fill, t)), e.dropShadow) {
      const o = e.dropShadow, a = dt.shared.setValue(o.color).toArray(), l = o.blur * i, c = o.distance * i;
      t.shadowColor = `rgba(${a[0] * 255},${a[1] * 255},${a[2] * 255},${o.alpha})`, t.shadowBlur = l, t.shadowOffsetX = Math.cos(o.angle) * c, t.shadowOffsetY = Math.sin(o.angle) * c;
    } else
      t.shadowColor = "black", t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0;
  }
  _drawGlyph(t, e, i, r, n, o) {
    const a = e.text, l = e.fontProperties, c = o._stroke, h = ((c == null ? void 0 : c.width) ?? 0) * n, f = i + h / 2, d = r - h / 2, u = l.descent * n, m = e.lineHeight * n;
    o.stroke && h && t.strokeText(a, f, d + m - u), o._fill && t.fillText(a, f, d + m - u);
  }
  destroy() {
    super.destroy();
    for (let t = 0; t < this.pages.length; t++) {
      const { canvasAndContext: e, texture: i } = this.pages[t];
      Sa.returnCanvasAndContext(e), i.destroy(!0);
    }
    this.pages = null;
  }
};
ph.defaultOptions = {
  textureSize: 512,
  style: new ii(),
  mipmap: !0
};
let Ca = ph;
function yp(s, t, e, i) {
  const r = {
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
  r.offsetY = e.baseLineOffset;
  let n = r.lines[0], o = null, a = !0;
  const l = {
    spaceWord: !1,
    width: 0,
    start: 0,
    index: 0,
    // use index to not modify the array as we use it a lot!
    positions: [],
    chars: []
  }, c = (m) => {
    const p = n.width;
    for (let g = 0; g < l.index; g++) {
      const x = m.positions[g];
      n.chars.push(m.chars[g]), n.charPositions.push(x + p);
    }
    n.width += m.width, a = !1, l.width = 0, l.index = 0, l.chars.length = 0;
  }, h = () => {
    let m = n.chars.length - 1;
    if (i) {
      let p = n.chars[m];
      for (; p === " "; )
        n.width -= e.chars[p].xAdvance, p = n.chars[--m];
    }
    r.width = Math.max(r.width, n.width), n = {
      width: 0,
      charPositions: [],
      chars: [],
      spaceWidth: 0,
      spacesIndex: []
    }, a = !0, r.lines.push(n), r.height += e.lineHeight;
  }, f = e.baseMeasurementFontSize / t.fontSize, d = t.letterSpacing * f, u = t.wordWrapWidth * f;
  for (let m = 0; m < s.length + 1; m++) {
    let p;
    const g = m === s.length;
    g || (p = s[m]);
    const x = e.chars[p] || e.chars[" "];
    if (/(?:\s)/.test(p) || p === "\r" || p === `
` || g) {
      if (!a && t.wordWrap && n.width + l.width - d > u ? (h(), c(l), g || n.charPositions.push(0)) : (l.start = n.width, c(l), g || n.charPositions.push(0)), p === "\r" || p === `
`)
        n.width !== 0 && h();
      else if (!g) {
        const _ = x.xAdvance + (x.kerning[o] || 0) + d;
        n.width += _, n.spaceWidth = _, n.spacesIndex.push(n.charPositions.length), n.chars.push(p);
      }
    } else {
      const w = x.kerning[o] || 0, _ = x.xAdvance + w + d;
      l.positions[l.index++] = l.width + w, l.chars.push(p), l.width += _;
    }
    o = p;
  }
  return h(), t.align === "center" ? vp(r) : t.align === "right" ? bp(r) : t.align === "justify" && wp(r), r;
}
function vp(s) {
  for (let t = 0; t < s.lines.length; t++) {
    const e = s.lines[t], i = s.width / 2 - e.width / 2;
    for (let r = 0; r < e.charPositions.length; r++)
      e.charPositions[r] += i;
  }
}
function bp(s) {
  for (let t = 0; t < s.lines.length; t++) {
    const e = s.lines[t], i = s.width - e.width;
    for (let r = 0; r < e.charPositions.length; r++)
      e.charPositions[r] += i;
  }
}
function wp(s) {
  const t = s.width;
  for (let e = 0; e < s.lines.length; e++) {
    const i = s.lines[e];
    let r = 0, n = i.spacesIndex[r++], o = 0;
    const a = i.spacesIndex.length, c = (t - i.width) / a;
    for (let h = 0; h < i.charPositions.length; h++)
      h === n && (n = i.spacesIndex[r++], o += c), i.charPositions[h] += o;
  }
}
let Fs = 0;
class Sp {
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
    let i = `${e.fontFamily}-bitmap`, r = !0;
    if (e._fill.fill && !e._stroke)
      i += e._fill.fill.styleKey, r = !1;
    else if (e._stroke || e.dropShadow) {
      let a = e.styleKey;
      a = a.substring(0, a.lastIndexOf("-")), i = `${a}-bitmap`, r = !1;
    }
    if (!st.has(i)) {
      const a = new Ca({
        style: e,
        overrideFill: r,
        overrideSize: !0,
        ...this.defaultOptions
      });
      Fs++, Fs > 50 && ct("BitmapText", `You have dynamically created ${Fs} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``), a.once("destroy", () => {
        Fs--, st.remove(i);
      }), st.set(
        i,
        a
      );
    }
    const n = st.get(i);
    return (o = n.ensureCharacters) == null || o.call(n, t), n;
  }
  /**
   * Get the layout of a text for the specified style.
   * @param text - The text to get the layout for
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  getLayout(t, e, i = !0) {
    const r = this.getFont(t, e);
    return yp([...t], e, r, i);
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
    var c, h, f, d;
    let e = t[0];
    typeof e == "string" && (e = {
      name: e,
      style: t[1],
      chars: (c = t[2]) == null ? void 0 : c.chars,
      resolution: (h = t[2]) == null ? void 0 : h.resolution,
      padding: (f = t[2]) == null ? void 0 : f.padding,
      skipKerning: (d = t[2]) == null ? void 0 : d.skipKerning
    }, $(Y, "BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})"));
    const i = e == null ? void 0 : e.name;
    if (!i)
      throw new Error("[BitmapFontManager] Property `name` is required.");
    e = { ...this.defaultOptions, ...e };
    const r = e.style, n = r instanceof ii ? r : new ii(r), o = n._fill.fill !== null && n._fill.fill !== void 0, a = new Ca({
      style: n,
      overrideFill: o,
      skipKerning: e.skipKerning,
      padding: e.padding,
      resolution: e.resolution,
      overrideSize: !1
    }), l = dh(e.chars);
    return a.ensureCharacters(l.join("")), st.set(`${i}-bitmap`, a), a.once("destroy", () => st.remove(`${i}-bitmap`)), a;
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
const Mr = new Sp();
class gh extends Xl {
  constructor(t, e) {
    super();
    const { textures: i, data: r } = t;
    Object.keys(r.pages).forEach((n) => {
      const o = r.pages[parseInt(n, 10)], a = i[o.id];
      this.pages.push({ texture: a });
    }), Object.keys(r.chars).forEach((n) => {
      const o = r.chars[n], {
        frame: a,
        source: l
      } = i[o.page], c = new ft(
        o.x + a.x,
        o.y + a.y,
        o.width,
        o.height
      ), h = new W({
        source: l,
        frame: c
      });
      this.chars[n] = {
        id: n.codePointAt(0),
        xOffset: o.xOffset,
        yOffset: o.yOffset,
        xAdvance: o.xAdvance,
        kerning: o.kerning ?? {},
        texture: h
      };
    }), this.baseRenderedFontSize = r.fontSize, this.baseMeasurementFontSize = r.fontSize, this.fontMetrics = {
      ascent: 0,
      descent: 0,
      fontSize: r.fontSize
    }, this.baseLineOffset = r.baseLineOffset, this.lineHeight = r.lineHeight, this.fontFamily = r.fontFamily, this.distanceField = r.distanceField ?? {
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
    Mr.install(t);
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * @param {string} name - The name of the bitmap font to uninstall.
   */
  static uninstall(t) {
    Mr.uninstall(t);
  }
}
const Xn = {
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
    for (const f in t) {
      const d = t[f].match(/^[a-z]+/gm)[0], u = t[f].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), m = {};
      for (const p in u) {
        const g = u[p].split("="), x = g[0], y = g[1].replace(/"/gm, ""), v = parseFloat(y), w = isNaN(v) ? y : v;
        m[x] = w;
      }
      e[d].push(m);
    }
    const i = {
      chars: {},
      pages: [],
      lineHeight: 0,
      fontSize: 0,
      fontFamily: "",
      distanceField: null,
      baseLineOffset: 0
    }, [r] = e.info, [n] = e.common, [o] = e.distanceField ?? [];
    o && (i.distanceField = {
      range: parseInt(o.distanceRange, 10),
      type: o.fieldType
    }), i.fontSize = parseInt(r.size, 10), i.fontFamily = r.face, i.lineHeight = parseInt(n.lineHeight, 10);
    const a = e.page;
    for (let f = 0; f < a.length; f++)
      i.pages.push({
        id: parseInt(a[f].id, 10) || 0,
        file: a[f].file
      });
    const l = {};
    i.baseLineOffset = i.lineHeight - parseInt(n.base, 10);
    const c = e.char;
    for (let f = 0; f < c.length; f++) {
      const d = c[f], u = parseInt(d.id, 10);
      let m = d.letter ?? d.char ?? String.fromCharCode(u);
      m === "space" && (m = " "), l[u] = m, i.chars[m] = {
        id: u,
        // texture deets..
        page: parseInt(d.page, 10) || 0,
        x: parseInt(d.x, 10),
        y: parseInt(d.y, 10),
        width: parseInt(d.width, 10),
        height: parseInt(d.height, 10),
        xOffset: parseInt(d.xoffset, 10),
        yOffset: parseInt(d.yoffset, 10),
        xAdvance: parseInt(d.xadvance, 10),
        kerning: {}
      };
    }
    const h = e.kerning || [];
    for (let f = 0; f < h.length; f++) {
      const d = parseInt(h[f].first, 10), u = parseInt(h[f].second, 10), m = parseInt(h[f].amount, 10);
      i.chars[l[u]].kerning[l[d]] = m;
    }
    return i;
  }
}, Pa = {
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
    }, e = s.getElementsByTagName("info")[0], i = s.getElementsByTagName("common")[0], r = s.getElementsByTagName("distanceField")[0];
    r && (t.distanceField = {
      type: r.getAttribute("fieldType"),
      range: parseInt(r.getAttribute("distanceRange"), 10)
    });
    const n = s.getElementsByTagName("page"), o = s.getElementsByTagName("char"), a = s.getElementsByTagName("kerning");
    t.fontSize = parseInt(e.getAttribute("size"), 10), t.fontFamily = e.getAttribute("face"), t.lineHeight = parseInt(i.getAttribute("lineHeight"), 10);
    for (let c = 0; c < n.length; c++)
      t.pages.push({
        id: parseInt(n[c].getAttribute("id"), 10) || 0,
        file: n[c].getAttribute("file")
      });
    const l = {};
    t.baseLineOffset = t.lineHeight - parseInt(i.getAttribute("base"), 10);
    for (let c = 0; c < o.length; c++) {
      const h = o[c], f = parseInt(h.getAttribute("id"), 10);
      let d = h.getAttribute("letter") ?? h.getAttribute("char") ?? String.fromCharCode(f);
      d === "space" && (d = " "), l[f] = d, t.chars[d] = {
        id: f,
        // texture deets..
        page: parseInt(h.getAttribute("page"), 10) || 0,
        x: parseInt(h.getAttribute("x"), 10),
        y: parseInt(h.getAttribute("y"), 10),
        width: parseInt(h.getAttribute("width"), 10),
        height: parseInt(h.getAttribute("height"), 10),
        // render deets..
        xOffset: parseInt(h.getAttribute("xoffset"), 10),
        yOffset: parseInt(h.getAttribute("yoffset"), 10),
        // + baseLineOffset,
        xAdvance: parseInt(h.getAttribute("xadvance"), 10),
        kerning: {}
      };
    }
    for (let c = 0; c < a.length; c++) {
      const h = parseInt(a[c].getAttribute("first"), 10), f = parseInt(a[c].getAttribute("second"), 10), d = parseInt(a[c].getAttribute("amount"), 10);
      t.chars[l[f]].kerning[l[h]] = d;
    }
    return t;
  }
}, Ma = {
  test(s) {
    return typeof s == "string" && s.includes("<font>") ? Pa.test(ot.get().parseXML(s)) : !1;
  },
  parse(s) {
    return Pa.parse(ot.get().parseXML(s));
  }
}, Ap = [".xml", ".fnt"], Cp = {
  extension: {
    type: D.CacheParser,
    name: "cacheBitmapFont"
  },
  test: (s) => s instanceof gh,
  getCacheableAssets(s, t) {
    const e = {};
    return s.forEach((i) => {
      e[i] = t, e[`${i}-bitmap`] = t;
    }), e[`${t.fontFamily}-bitmap`] = t, e;
  }
}, Pp = {
  extension: {
    type: D.LoadParser,
    priority: Te.Normal
  },
  name: "loadBitmapFont",
  test(s) {
    return Ap.includes(bt.extname(s).toLowerCase());
  },
  async testParse(s) {
    return Xn.test(s) || Ma.test(s);
  },
  async parse(s, t, e) {
    const i = Xn.test(s) ? Xn.parse(s) : Ma.parse(s), { src: r } = t, { pages: n } = i, o = [], a = i.distanceField ? {
      scaleMode: "linear",
      alphaMode: "premultiply-alpha-on-upload",
      autoGenerateMipmaps: !1,
      resolution: 1
    } : {};
    for (let f = 0; f < n.length; ++f) {
      const d = n[f].file;
      let u = bt.join(bt.dirname(r), d);
      u = fr(u, r), o.push({
        src: u,
        data: a
      });
    }
    const l = await e.load(o), c = o.map((f) => l[f.src]);
    return new gh({
      data: i,
      textures: c
    }, r);
  },
  async load(s, t) {
    return await (await ot.get().fetch(s)).text();
  },
  async unload(s, t, e) {
    await Promise.all(s.pages.map((i) => e.unload(i.texture.source._sourceOrigin))), s.destroy();
  }
};
class Mp {
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
const Tp = {
  extension: {
    type: D.CacheParser,
    name: "cacheTextureArray"
  },
  test: (s) => Array.isArray(s) && s.every((t) => t instanceof W),
  getCacheableAssets: (s, t) => {
    const e = {};
    return s.forEach((i) => {
      t.forEach((r, n) => {
        e[i + (n === 0 ? "" : n + 1)] = r;
      });
    }), e;
  }
};
async function _h(s) {
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
const kp = {
  extension: {
    type: D.DetectionParser,
    priority: 1
  },
  test: async () => _h(
    // eslint-disable-next-line max-len
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
  ),
  add: async (s) => [...s, "avif"],
  remove: async (s) => s.filter((t) => t !== "avif")
}, Ta = ["png", "jpg", "jpeg"], Ep = {
  extension: {
    type: D.DetectionParser,
    priority: -1
  },
  test: () => Promise.resolve(!0),
  add: async (s) => [...s, ...Ta],
  remove: async (s) => s.filter((t) => !Ta.includes(t))
}, Ip = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;
function ro(s) {
  return Ip ? !1 : document.createElement("video").canPlayType(s) !== "";
}
const Bp = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => ro("video/mp4"),
  add: async (s) => [...s, "mp4", "m4v"],
  remove: async (s) => s.filter((t) => t !== "mp4" && t !== "m4v")
}, Rp = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => ro("video/ogg"),
  add: async (s) => [...s, "ogv"],
  remove: async (s) => s.filter((t) => t !== "ogv")
}, Fp = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => ro("video/webm"),
  add: async (s) => [...s, "webm"],
  remove: async (s) => s.filter((t) => t !== "webm")
}, Lp = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => _h(
    "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="
  ),
  add: async (s) => [...s, "webp"],
  remove: async (s) => s.filter((t) => t !== "webp")
};
class Op {
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
      let r = null, n = null;
      if (e.loadParser && (n = this._parserHash[e.loadParser], n || ct(`[Assets] specified load parser "${e.loadParser}" not found while loading ${t}`)), !n) {
        for (let l = 0; l < this.parsers.length; l++) {
          const c = this.parsers[l];
          if (c.load && ((o = c.test) != null && o.call(c, t, e, this))) {
            n = c;
            break;
          }
        }
        if (!n)
          return ct(`[Assets] ${t} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`), null;
      }
      r = await n.load(t, e, this), i.parser = n;
      for (let l = 0; l < this.parsers.length; l++) {
        const c = this.parsers[l];
        c.parse && c.parse && await ((a = c.testParse) == null ? void 0 : a.call(c, r, e, this)) && (r = await c.parse(r, e, this) || r, i.parser = c);
      }
      return r;
    })(), i;
  }
  async load(t, e) {
    this._parsersValidated || this._validateParsers();
    let i = 0;
    const r = {}, n = Ys(t), o = se(t, (c) => ({
      alias: [c],
      src: c,
      data: {}
    })), a = o.length, l = o.map(async (c) => {
      const h = bt.toAbsolute(c.src);
      if (!r[c.src])
        try {
          this.promiseCache[h] || (this.promiseCache[h] = this._getLoadPromiseAndParser(h, c)), r[c.src] = await this.promiseCache[h].promise, e && e(++i / a);
        } catch (f) {
          throw delete this.promiseCache[h], delete r[c.src], new Error(`[Loader.load] Failed to load ${h}.
${f}`);
        }
    });
    return await Promise.all(l), n ? r[o[0].src] : r;
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
    const i = se(t, (r) => ({
      alias: [r],
      src: r
    })).map(async (r) => {
      var a, l;
      const n = bt.toAbsolute(r.src), o = this.promiseCache[n];
      if (o) {
        const c = await o.promise;
        delete this.promiseCache[n], await ((l = (a = o.parser) == null ? void 0 : a.unload) == null ? void 0 : l.call(a, c, r, this));
      }
    });
    await Promise.all(i);
  }
  /** validates our parsers, right now it only checks for name conflicts but we can add more here as required! */
  _validateParsers() {
    this._parsersValidated = !0, this._parserHash = this._parsers.filter((t) => t.name).reduce((t, e) => (e.name ? t[e.name] && ct(`[Assets] loadParser name conflict "${e.name}"`) : ct("[Assets] loadParser should have a name"), { ...t, [e.name]: e }), {});
  }
}
function Ri(s, t) {
  if (Array.isArray(t)) {
    for (const e of t)
      if (s.startsWith(`data:${e}`))
        return !0;
    return !1;
  }
  return s.startsWith(`data:${t}`);
}
function Fi(s, t) {
  const e = s.split("?")[0], i = bt.extname(e).toLowerCase();
  return Array.isArray(t) ? t.includes(i) : i === t;
}
const Dp = ".json", zp = "application/json", Up = {
  extension: {
    type: D.LoadParser,
    priority: Te.Low
  },
  name: "loadJson",
  test(s) {
    return Ri(s, zp) || Fi(s, Dp);
  },
  async load(s) {
    return await (await ot.get().fetch(s)).json();
  }
}, Gp = ".txt", Vp = "text/plain", Wp = {
  name: "loadTxt",
  extension: {
    type: D.LoadParser,
    priority: Te.Low,
    name: "loadTxt"
  },
  test(s) {
    return Ri(s, Vp) || Fi(s, Gp);
  },
  async load(s) {
    return await (await ot.get().fetch(s)).text();
  }
}, Np = [
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
], Hp = [".ttf", ".otf", ".woff", ".woff2"], $p = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2"
], Yp = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function jp(s) {
  const t = bt.extname(s), r = bt.basename(s, t).replace(/(-|_)/g, " ").toLowerCase().split(" ").map((a) => a.charAt(0).toUpperCase() + a.slice(1));
  let n = r.length > 0;
  for (const a of r)
    if (!a.match(Yp)) {
      n = !1;
      break;
    }
  let o = r.join(" ");
  return n || (o = `"${o.replace(/[\\"]/g, "\\$&")}"`), o;
}
const Xp = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;
function Kp(s) {
  return Xp.test(s) ? s : encodeURI(s);
}
const qp = {
  extension: {
    type: D.LoadParser,
    priority: Te.Low
  },
  name: "loadWebFont",
  test(s) {
    return Ri(s, $p) || Fi(s, Hp);
  },
  async load(s, t) {
    var i, r, n;
    const e = ot.get().getFontFaceSet();
    if (e) {
      const o = [], a = ((i = t.data) == null ? void 0 : i.family) ?? jp(s), l = ((n = (r = t.data) == null ? void 0 : r.weights) == null ? void 0 : n.filter((h) => Np.includes(h))) ?? ["normal"], c = t.data ?? {};
      for (let h = 0; h < l.length; h++) {
        const f = l[h], d = new FontFace(a, `url(${Kp(s)})`, {
          ...c,
          weight: f
        });
        await d.load(), e.add(d), o.push(d);
      }
      return st.set(`${a}-and-url`, {
        url: s,
        fontFaces: o
      }), o.length === 1 ? o[0] : o;
    }
    return ct("[loadWebFont] FontFace API is not supported. Skipping loading font"), null;
  },
  unload(s) {
    (Array.isArray(s) ? s : [s]).forEach((t) => {
      st.remove(t.family), ot.get().getFontFaceSet().delete(t);
    });
  }
};
function oo(s, t = 1) {
  var i;
  const e = (i = Bi.RETINA_PREFIX) == null ? void 0 : i.exec(s);
  return e ? parseFloat(e[1]) : t;
}
function ao(s, t, e) {
  s.label = e, s._sourceOrigin = e;
  const i = new W({
    source: s,
    label: e
  }), r = () => {
    delete t.promiseCache[e], st.has(e) && st.remove(e);
  };
  return i.source.once("destroy", () => {
    t.promiseCache[e] && (ct("[Assets] A TextureSource managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the TextureSource."), r());
  }), i.once("destroy", () => {
    s.destroyed || (ct("[Assets] A Texture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the Texture."), r());
  }), i;
}
const Zp = ".svg", Qp = "image/svg+xml", Jp = {
  extension: {
    type: D.LoadParser,
    priority: Te.Low,
    name: "loadSVG"
  },
  name: "loadSVG",
  config: {
    crossOrigin: "anonymous",
    parseAsGraphicsContext: !1
  },
  test(s) {
    return Ri(s, Qp) || Fi(s, Zp);
  },
  async load(s, t, e) {
    return t.data.parseAsGraphicsContext ?? this.config.parseAsGraphicsContext ? em(s) : tm(s, t, e, this.config.crossOrigin);
  },
  unload(s) {
    s.destroy(!0);
  }
};
async function tm(s, t, e, i) {
  var g, x, y;
  const n = await (await ot.get().fetch(s)).blob(), o = URL.createObjectURL(n), a = new Image();
  a.src = o, a.crossOrigin = i, await a.decode(), URL.revokeObjectURL(o);
  const l = document.createElement("canvas"), c = l.getContext("2d"), h = ((g = t.data) == null ? void 0 : g.resolution) || oo(s), f = ((x = t.data) == null ? void 0 : x.width) ?? a.width, d = ((y = t.data) == null ? void 0 : y.height) ?? a.height;
  l.width = f * h, l.height = d * h, c.drawImage(a, 0, 0, f * h, d * h);
  const { parseAsGraphicsContext: u, ...m } = t.data, p = new Ii({
    resource: l,
    alphaMode: "premultiply-alpha-on-upload",
    resolution: h,
    ...m
  });
  return ao(p, e, s);
}
async function em(s) {
  const e = await (await ot.get().fetch(s)).text(), i = new Xt();
  return i.svg(e), i;
}
const im = `(function () {
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
let _i = null, Tr = class {
  constructor() {
    _i || (_i = URL.createObjectURL(new Blob([im], { type: "application/javascript" }))), this.worker = new Worker(_i);
  }
};
Tr.revokeObjectURL = function() {
  _i && (URL.revokeObjectURL(_i), _i = null);
};
const sm = `(function () {
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
let xi = null;
class xh {
  constructor() {
    xi || (xi = URL.createObjectURL(new Blob([sm], { type: "application/javascript" }))), this.worker = new Worker(xi);
  }
}
xh.revokeObjectURL = function() {
  xi && (URL.revokeObjectURL(xi), xi = null);
};
let ka = 0, Kn;
class nm {
  constructor() {
    this._initialized = !1, this._createdWorkers = 0, this._workerPool = [], this._queue = [], this._resolveHash = {};
  }
  isImageBitmapSupported() {
    return this._isImageBitmapSupported !== void 0 ? this._isImageBitmapSupported : (this._isImageBitmapSupported = new Promise((t) => {
      const { worker: e } = new Tr();
      e.addEventListener("message", (i) => {
        e.terminate(), Tr.revokeObjectURL(), t(i.data);
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
    Kn === void 0 && (Kn = navigator.hardwareConcurrency || 4);
    let t = this._workerPool.pop();
    return !t && this._createdWorkers < Kn && (this._createdWorkers++, t = new xh().worker, t.addEventListener("message", (e) => {
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
    const i = new Promise((r, n) => {
      this._queue.push({ id: t, arguments: e, resolve: r, reject: n });
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
    this._resolveHash[ka] = { resolve: e.resolve, reject: e.reject }, t.postMessage({
      data: e.arguments,
      uuid: ka++,
      id: i
    });
  }
}
const Ea = new nm(), rm = [".jpeg", ".jpg", ".png", ".webp", ".avif"], om = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
async function am(s, t) {
  var r;
  const e = await ot.get().fetch(s);
  if (!e.ok)
    throw new Error(`[loadImageBitmap] Failed to fetch ${s}: ${e.status} ${e.statusText}`);
  const i = await e.blob();
  return ((r = t == null ? void 0 : t.data) == null ? void 0 : r.alphaMode) === "premultiplied-alpha" ? createImageBitmap(i, { premultiplyAlpha: "none" }) : createImageBitmap(i);
}
const yh = {
  name: "loadTextures",
  extension: {
    type: D.LoadParser,
    priority: Te.High,
    name: "loadTextures"
  },
  config: {
    preferWorkers: !0,
    preferCreateImageBitmap: !0,
    crossOrigin: "anonymous"
  },
  test(s) {
    return Ri(s, om) || Fi(s, rm);
  },
  async load(s, t, e) {
    var n;
    let i = null;
    globalThis.createImageBitmap && this.config.preferCreateImageBitmap ? this.config.preferWorkers && await Ea.isImageBitmapSupported() ? i = await Ea.loadImageBitmap(s, t) : i = await am(s, t) : i = await new Promise((o) => {
      i = new Image(), i.crossOrigin = this.config.crossOrigin, i.src = s, i.complete ? o(i) : i.onload = () => {
        o(i);
      };
    });
    const r = new Ii({
      resource: i,
      alphaMode: "premultiply-alpha-on-upload",
      resolution: ((n = t.data) == null ? void 0 : n.resolution) || oo(s),
      ...t.data
    });
    return ao(r, e, s);
  },
  unload(s) {
    s.destroy(!0);
  }
}, vh = [".mp4", ".m4v", ".webm", ".ogg", ".ogv", ".h264", ".avi", ".mov"], lm = vh.map((s) => `video/${s.substring(1)}`);
function hm(s, t, e) {
  e === void 0 && !t.startsWith("data:") ? s.crossOrigin = um(t) : e !== !1 && (s.crossOrigin = typeof e == "string" ? e : "anonymous");
}
function cm(s) {
  return new Promise((t, e) => {
    s.addEventListener("canplaythrough", i), s.addEventListener("error", r), s.load();
    function i() {
      n(), t();
    }
    function r(o) {
      n(), e(o);
    }
    function n() {
      s.removeEventListener("canplaythrough", i), s.removeEventListener("error", r);
    }
  });
}
function um(s, t = globalThis.location) {
  if (s.startsWith("data:"))
    return "";
  t = t || globalThis.location;
  const e = new URL(s, document.baseURI);
  return e.hostname !== t.hostname || e.port !== t.port || e.protocol !== t.protocol ? "anonymous" : "";
}
const fm = {
  name: "loadVideo",
  extension: {
    type: D.LoadParser,
    name: "loadVideo"
  },
  test(s) {
    const t = Ri(s, lm), e = Fi(s, vh);
    return t || e;
  },
  async load(s, t, e) {
    var l, c;
    const i = {
      ...Ds.defaultOptions,
      resolution: ((l = t.data) == null ? void 0 : l.resolution) || oo(s),
      alphaMode: ((c = t.data) == null ? void 0 : c.alphaMode) || await Al(),
      ...t.data
    }, r = document.createElement("video"), n = {
      preload: i.autoLoad !== !1 ? "auto" : void 0,
      "webkit-playsinline": i.playsinline !== !1 ? "" : void 0,
      playsinline: i.playsinline !== !1 ? "" : void 0,
      muted: i.muted === !0 ? "" : void 0,
      loop: i.loop === !0 ? "" : void 0,
      autoplay: i.autoPlay !== !1 ? "" : void 0
    };
    Object.keys(n).forEach((h) => {
      const f = n[h];
      f !== void 0 && r.setAttribute(h, f);
    }), i.muted === !0 && (r.muted = !0), hm(r, s, i.crossorigin);
    const o = document.createElement("source");
    let a;
    if (s.startsWith("data:"))
      a = s.slice(5, s.indexOf(";"));
    else if (!s.startsWith("blob:")) {
      const h = s.split("?")[0].slice(s.lastIndexOf(".") + 1).toLowerCase();
      a = Ds.MIME_TYPES[h] || `video/${h}`;
    }
    return o.src = s, a && (o.type = a), new Promise((h) => {
      const f = async () => {
        const d = new Ds({ ...i, resource: r });
        r.removeEventListener("canplay", f), t.data.preload && await cm(r), h(ao(d, e, s));
      };
      r.addEventListener("canplay", f), r.appendChild(o);
    });
  },
  unload(s) {
    s.destroy(!0);
  }
}, bh = {
  extension: {
    type: D.ResolveParser,
    name: "resolveTexture"
  },
  test: yh.test,
  parse: (s) => {
    var t;
    return {
      resolution: parseFloat(((t = Bi.RETINA_PREFIX.exec(s)) == null ? void 0 : t[1]) ?? "1"),
      format: s.split(".").pop(),
      src: s
    };
  }
}, dm = {
  extension: {
    type: D.ResolveParser,
    priority: -2,
    name: "resolveJson"
  },
  test: (s) => Bi.RETINA_PREFIX.test(s) && s.endsWith(".json"),
  parse: bh.parse
};
class pm {
  constructor() {
    this._detections = [], this._initialized = !1, this.resolver = new Bi(), this.loader = new Op(), this.cache = st, this._backgroundLoader = new Mp(this.loader), this._backgroundLoader.active = !0, this.reset();
  }
  /**
   * Best practice is to call this function before any loading commences
   * Initiating is the best time to add any customization to the way things are loaded.
   *
   * you do not need to call this for the Assets class to work, only if you want to set any initial properties
   * @param options - options to initialize the Assets manager with
   */
  async init(t = {}) {
    var n, o;
    if (this._initialized) {
      ct("[Assets]AssetManager already initialized, did you load before calling this Assets.init()?");
      return;
    }
    if (this._initialized = !0, t.defaultSearchParams && this.resolver.setDefaultSearchParams(t.defaultSearchParams), t.basePath && (this.resolver.basePath = t.basePath), t.bundleIdentifier && this.resolver.setBundleIdentifier(t.bundleIdentifier), t.manifest) {
      let a = t.manifest;
      typeof a == "string" && (a = await this.load(a)), this.resolver.addManifest(a);
    }
    const e = ((n = t.texturePreference) == null ? void 0 : n.resolution) ?? 1, i = typeof e == "number" ? [e] : e, r = await this._detectFormats({
      preferredFormats: (o = t.texturePreference) == null ? void 0 : o.format,
      skipDetections: t.skipDetections,
      detections: this._detections
    });
    this.resolver.prefer({
      params: {
        format: r,
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
    const i = Ys(t), r = se(t).map((a) => {
      if (typeof a != "string") {
        const l = this.resolver.getAlias(a);
        return l.some((c) => !this.resolver.hasKey(c)) && this.add(a), Array.isArray(l) ? l[0] : l;
      }
      return this.resolver.hasKey(a) || this.add({ alias: a, src: a }), a;
    }), n = this.resolver.resolve(r), o = await this._mapLoadToResolve(n, e);
    return i ? o[r[0]] : o;
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
    const r = this.resolver.resolveBundle(t), n = {}, o = Object.keys(r);
    let a = 0, l = 0;
    const c = () => {
      e == null || e(++a / l);
    }, h = o.map((f) => {
      const d = r[f];
      return l += Object.keys(d).length, this._mapLoadToResolve(d, c).then((u) => {
        n[f] = u;
      });
    });
    return await Promise.all(h), i ? n[t[0]] : n;
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
    const r = await this.loader.load(i, e);
    this._backgroundLoader.active = !0;
    const n = {};
    return i.forEach((o) => {
      const a = r[o.src], l = [o.src];
      o.alias && l.push(...o.alias), l.forEach((c) => {
        n[c] = a;
      }), st.set(l, a);
    }), n;
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
    const e = se(t).map((r) => typeof r != "string" ? r.src : r), i = this.resolver.resolve(e);
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
    this._initialized || await this.init(), t = se(t);
    const e = this.resolver.resolveBundle(t), i = Object.keys(e).map((r) => this._unloadFromResolved(e[r]));
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
    return e = e.filter((i, r) => e.indexOf(i) === r), e;
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
const fe = new pm();
At.handleByList(D.LoadParser, fe.loader.parsers).handleByList(D.ResolveParser, fe.resolver.parsers).handleByList(D.CacheParser, fe.cache.parsers).handleByList(D.DetectionParser, fe.detections);
At.add(
  Tp,
  Ep,
  kp,
  Lp,
  Bp,
  Rp,
  Fp,
  Up,
  Wp,
  qp,
  Jp,
  yh,
  fm,
  Pp,
  Cp,
  bh,
  dm
);
const Ia = {
  loader: D.LoadParser,
  resolver: D.ResolveParser,
  cache: D.CacheParser,
  detection: D.DetectionParser
};
At.handle(D.Asset, (s) => {
  const t = s.ref;
  Object.entries(Ia).filter(([e]) => !!t[e]).forEach(([e, i]) => At.add(Object.assign(
    t[e],
    // Allow the function to optionally define it's own
    // ExtensionMetadata, the use cases here is priority for LoaderParsers
    { extension: t[e].extension ?? i }
  )));
}, (s) => {
  const t = s.ref;
  Object.keys(Ia).filter((e) => !!t[e]).forEach((e) => At.remove(t[e]));
});
class Xe extends an {
  /**
   * @param options - Options for the Graphics.
   */
  constructor(t) {
    t instanceof Xt && (t = { context: t });
    const { context: e, roundPixels: i, ...r } = t || {};
    super({
      label: "Graphics",
      ...r
    }), this.renderPipeId = "graphics", e ? this._context = e : this._context = this._ownedContext = new Xt(), this._context.on("update", this.onViewUpdate, this), this.allowChildren = !1, this.roundPixels = i ?? !1;
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
    return t ? new Xe(this._context.clone()) : (this._ownedContext = null, new Xe(this._context));
  }
  // -------- v7 deprecations ---------
  /**
   * @param width
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#setStrokeStyle} instead
   */
  lineStyle(t, e, i) {
    $(Y, "Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");
    const r = {};
    return t && (r.width = t), e && (r.color = e), i && (r.alpha = i), this.context.strokeStyle = r, this;
  }
  /**
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  beginFill(t, e) {
    $(Y, "Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");
    const i = {};
    return t && (i.color = t), e && (i.alpha = e), this.context.fillStyle = i, this;
  }
  /**
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  endFill() {
    $(Y, "Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style."), this.context.fill();
    const t = this.context.strokeStyle;
    return (t.width !== Xt.defaultStrokeStyle.width || t.color !== Xt.defaultStrokeStyle.color || t.alpha !== Xt.defaultStrokeStyle.alpha) && this.context.stroke(), this;
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#circle} instead
   */
  drawCircle(...t) {
    return $(Y, "Graphics#drawCircle has been renamed to Graphics#circle"), this._callContextMethod("circle", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#ellipse} instead
   */
  drawEllipse(...t) {
    return $(Y, "Graphics#drawEllipse has been renamed to Graphics#ellipse"), this._callContextMethod("ellipse", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#poly} instead
   */
  drawPolygon(...t) {
    return $(Y, "Graphics#drawPolygon has been renamed to Graphics#poly"), this._callContextMethod("poly", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#rect} instead
   */
  drawRect(...t) {
    return $(Y, "Graphics#drawRect has been renamed to Graphics#rect"), this._callContextMethod("rect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#roundRect} instead
   */
  drawRoundedRect(...t) {
    return $(Y, "Graphics#drawRoundedRect has been renamed to Graphics#roundRect"), this._callContextMethod("roundRect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#star} instead
   */
  drawStar(...t) {
    return $(Y, "Graphics#drawStar has been renamed to Graphics#star"), this._callContextMethod("star", t);
  }
}
class mm {
  /**
   * @param options - Options for the transform.
   * @param options.matrix - The matrix to use.
   * @param options.observer - The observer to use.
   */
  constructor({ matrix: t, observer: e } = {}) {
    this.dirty = !0, this._matrix = t ?? new H(), this.observer = e, this.position = new mt(this, 0, 0), this.scale = new mt(this, 1, 1), this.pivot = new mt(this, 0, 0), this.skew = new mt(this, 0, 0), this._rotation = 0, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1;
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
const wh = class Gs extends an {
  constructor(...t) {
    let e = t[0] || {};
    e instanceof W && (e = { texture: e }), t.length > 1 && ($(Y, "use new TilingSprite({ texture, width:100, height:100 }) instead"), e.width = t[1], e.height = t[2]), e = { ...Gs.defaultOptions, ...e };
    const {
      texture: i,
      anchor: r,
      tilePosition: n,
      tileScale: o,
      tileRotation: a,
      width: l,
      height: c,
      applyAnchorToTexture: h,
      roundPixels: f,
      ...d
    } = e ?? {};
    super({
      label: "TilingSprite",
      ...d
    }), this.renderPipeId = "tilingSprite", this.batched = !0, this.allowChildren = !1, this._anchor = new mt(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), this._applyAnchorToTexture = h, this.texture = i, this._width = l ?? i.width, this._height = c ?? i.height, this._tileTransform = new mm({
      observer: {
        _onUpdate: () => this.onViewUpdate()
      }
    }), r && (this.anchor = r), this.tilePosition = n, this.tileScale = o, this.tileRotation = a, this.roundPixels = f ?? !1;
  }
  /**
   * Creates a new tiling sprite.
   * @param source - The source to create the texture from.
   * @param options - The options for creating the tiling sprite.
   * @returns A new tiling sprite.
   */
  static from(t, e = {}) {
    return typeof t == "string" ? new Gs({
      texture: st.get(t),
      ...e
    }) : new Gs({
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
    t || (t = W.EMPTY);
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
    const t = this._bounds, e = this._anchor, i = this._width, r = this._height;
    t.maxX = -e._x * i, t.minX = t.maxX + i, t.maxY = -e._y * r, t.minY = t.maxY + r;
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
    const e = this._width, i = this._height, r = -e * this._anchor._x;
    let n = 0;
    return t.x >= r && t.x <= r + e && (n = -i * this._anchor._y, t.y >= n && t.y <= n + i);
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
wh.defaultOptions = {
  /** The texture to use for the sprite. */
  texture: W.EMPTY,
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
let gm = wh;
class Sh extends an {
  constructor(t, e) {
    const { text: i, resolution: r, style: n, anchor: o, width: a, height: l, roundPixels: c, ...h } = t;
    super({
      ...h
    }), this.batched = !0, this._resolution = null, this._autoResolution = !0, this._didTextUpdate = !0, this._styleClass = e, this.text = i ?? "", this.style = n, this.resolution = r ?? null, this.allowChildren = !1, this._anchor = new mt(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), o && (this.anchor = o), this.roundPixels = c ?? !1, a !== void 0 && (this.width = a), l !== void 0 && (this.height = l);
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
    const e = this.bounds.width, i = this.bounds.height, r = -e * this.anchor.x;
    let n = 0;
    return t.x >= r && t.x <= r + e && (n = -i * this.anchor.y, t.y >= n && t.y <= n + i);
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
function Ah(s, t) {
  let e = s[0] ?? {};
  return (typeof e == "string" || s[1]) && ($(Y, `use new ${t}({ text: "hi!", style }) instead`), e = {
    text: e,
    style: s[1]
  }), e;
}
class _m extends Sh {
  constructor(...t) {
    const e = Ah(t, "Text");
    super(e, ii), this.renderPipeId = "text";
  }
  _updateBounds() {
    const t = this._bounds, e = this._anchor, i = Pr.measureText(
      this._text,
      this._style
    ), { width: r, height: n } = i;
    t.minX = -e._x * r, t.maxX = t.minX + r, t.minY = -e._y * n, t.maxY = t.minY + n;
  }
}
class xm extends Sh {
  constructor(...t) {
    var e;
    const i = Ah(t, "BitmapText");
    i.style ?? (i.style = i.style || {}), (e = i.style).fill ?? (e.fill = 16777215), super(i, ii), this.renderPipeId = "bitmapText";
  }
  _updateBounds() {
    const t = this._bounds, e = this._anchor, i = Mr.measureText(this.text, this._style), r = i.scale, n = i.offsetY * r;
    let o = i.width * r, a = i.height * r;
    const l = this._style._stroke;
    l && (o += l.width, a += l.width), t.minX = -e._x * o, t.maxX = t.minX + o, t.minY = -e._y * (a + n), t.maxY = t.minY + a;
  }
  /**
   * The resolution / device pixel ratio of the canvas.
   * @default 1
   */
  set resolution(t) {
    t !== null && ct(
      // eslint-disable-next-line max-len
      "[BitmapText] dynamically updating the resolution is not supported. Resolution should be managed by the BitmapFont."
    );
  }
  get resolution() {
    return this._resolution;
  }
}
class lo extends W {
  static create(t) {
    return new lo({
      source: new _e(t)
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
At.add(Vc, Wc);
var Ch = {}, gn = {};
Object.defineProperty(gn, "__esModule", { value: !0 });
gn.MiniSignal = void 0;
const kr = Symbol("SIGNAL");
function ym(s) {
  return typeof s == "object" && kr in s;
}
class vm {
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
    if (!ym(t))
      throw new Error("MiniSignal#detach(): First arg must be a MiniSignal listener reference.");
    if (t[kr] !== this._symbol)
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
    const e = { [kr]: this._symbol };
    return this._refMap.set(e, t), e;
  }
  _getRef(t) {
    return this._refMap.get(t);
  }
}
gn.MiniSignal = vm;
(function(s) {
  var t = Ye && Ye.__createBinding || (Object.create ? function(i, r, n, o) {
    o === void 0 && (o = n);
    var a = Object.getOwnPropertyDescriptor(r, n);
    (!a || ("get" in a ? !r.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return r[n];
    } }), Object.defineProperty(i, o, a);
  } : function(i, r, n, o) {
    o === void 0 && (o = n), i[o] = r[n];
  }), e = Ye && Ye.__exportStar || function(i, r) {
    for (var n in i) n !== "default" && !Object.prototype.hasOwnProperty.call(r, n) && t(r, i, n);
  };
  Object.defineProperty(s, "__esModule", { value: !0 }), e(gn, s);
})(Ch);
const Xs = /* @__PURE__ */ new Map(), bm = (s, t) => {
  let e = Xs.get(s);
  return e || (e = new Ch.MiniSignal(), Xs.set(s, e)), { name: s, binding: e.add(t) };
}, Ba = (s, t) => {
  const e = Xs.get(s);
  e && e.detach(t);
}, Ks = (s, ...t) => {
  const e = Xs.get(s);
  e && e.dispatch(...t);
};
function ve(s) {
  if (s === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return s;
}
function Ph(s, t) {
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
var $t = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, Pi = {
  duration: 0.5,
  overwrite: !1,
  delay: 0
}, ho, Ct, tt, qt = 1e8, q = 1 / qt, Er = Math.PI * 2, wm = Er / 4, Sm = 0, Mh = Math.sqrt, Am = Math.cos, Cm = Math.sin, vt = function(t) {
  return typeof t == "string";
}, at = function(t) {
  return typeof t == "function";
}, Pe = function(t) {
  return typeof t == "number";
}, co = function(t) {
  return typeof t > "u";
}, ge = function(t) {
  return typeof t == "object";
}, Rt = function(t) {
  return t !== !1;
}, uo = function() {
  return typeof window < "u";
}, Ls = function(t) {
  return at(t) || vt(t);
}, Th = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
}, Pt = Array.isArray, Ir = /(?:-?\.?\d|\.)+/gi, kh = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, di = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, qn = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, Eh = /[+-]=-?[.\d]+/, Ih = /[^,'"\[\]\s]+/gi, Pm = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, it, ce, Br, fo, Yt = {}, qs = {}, Bh, Rh = function(t) {
  return (qs = si(t, Yt)) && Dt;
}, po = function(t, e) {
  return console.warn("Invalid property", t, "set to", e, "Missing plugin? gsap.registerPlugin()");
}, cs = function(t, e) {
  return !e && console.warn(t);
}, Fh = function(t, e) {
  return t && (Yt[t] = e) && qs && (qs[t] = e) || Yt;
}, us = function() {
  return 0;
}, Mm = {
  suppressEvents: !0,
  isStart: !0,
  kill: !1
}, Vs = {
  suppressEvents: !0,
  kill: !1
}, Tm = {
  suppressEvents: !0
}, mo = {}, Re = [], Rr = {}, Lh, Wt = {}, Zn = {}, Ra = 30, Ws = [], go = "", _o = function(t) {
  var e = t[0], i, r;
  if (ge(e) || at(e) || (t = [t]), !(i = (e._gsap || {}).harness)) {
    for (r = Ws.length; r-- && !Ws[r].targetTest(e); )
      ;
    i = Ws[r];
  }
  for (r = t.length; r--; )
    t[r] && (t[r]._gsap || (t[r]._gsap = new rc(t[r], i))) || t.splice(r, 1);
  return t;
}, Ze = function(t) {
  return t._gsap || _o(Zt(t))[0]._gsap;
}, Oh = function(t, e, i) {
  return (i = t[e]) && at(i) ? t[e]() : co(i) && t.getAttribute && t.getAttribute(e) || i;
}, Ft = function(t, e) {
  return (t = t.split(",")).forEach(e) || t;
}, ht = function(t) {
  return Math.round(t * 1e5) / 1e5 || 0;
}, yt = function(t) {
  return Math.round(t * 1e7) / 1e7 || 0;
}, yi = function(t, e) {
  var i = e.charAt(0), r = parseFloat(e.substr(2));
  return t = parseFloat(t), i === "+" ? t + r : i === "-" ? t - r : i === "*" ? t * r : t / r;
}, km = function(t, e) {
  for (var i = e.length, r = 0; t.indexOf(e[r]) < 0 && ++r < i; )
    ;
  return r < i;
}, Zs = function() {
  var t = Re.length, e = Re.slice(0), i, r;
  for (Rr = {}, Re.length = 0, i = 0; i < t; i++)
    r = e[i], r && r._lazy && (r.render(r._lazy[0], r._lazy[1], !0)._lazy = 0);
}, Dh = function(t, e, i, r) {
  Re.length && !Ct && Zs(), t.render(e, i, Ct && e < 0 && (t._initted || t._startAt)), Re.length && !Ct && Zs();
}, zh = function(t) {
  var e = parseFloat(t);
  return (e || e === 0) && (t + "").match(Ih).length < 2 ? e : vt(t) ? t.trim() : t;
}, Uh = function(t) {
  return t;
}, Qt = function(t, e) {
  for (var i in e)
    i in t || (t[i] = e[i]);
  return t;
}, Em = function(t) {
  return function(e, i) {
    for (var r in i)
      r in e || r === "duration" && t || r === "ease" || (e[r] = i[r]);
  };
}, si = function(t, e) {
  for (var i in e)
    t[i] = e[i];
  return t;
}, Fa = function s(t, e) {
  for (var i in e)
    i !== "__proto__" && i !== "constructor" && i !== "prototype" && (t[i] = ge(e[i]) ? s(t[i] || (t[i] = {}), e[i]) : e[i]);
  return t;
}, Qs = function(t, e) {
  var i = {}, r;
  for (r in t)
    r in e || (i[r] = t[r]);
  return i;
}, Ji = function(t) {
  var e = t.parent || it, i = t.keyframes ? Em(Pt(t.keyframes)) : Qt;
  if (Rt(t.inherit))
    for (; e; )
      i(t, e.vars.defaults), e = e.parent || e._dp;
  return t;
}, Im = function(t, e) {
  for (var i = t.length, r = i === e.length; r && i-- && t[i] === e[i]; )
    ;
  return i < 0;
}, Gh = function(t, e, i, r, n) {
  var o = t[r], a;
  if (n)
    for (a = e[n]; o && o[n] > a; )
      o = o._prev;
  return o ? (e._next = o._next, o._next = e) : (e._next = t[i], t[i] = e), e._next ? e._next._prev = e : t[r] = e, e._prev = o, e.parent = e._dp = t, e;
}, _n = function(t, e, i, r) {
  i === void 0 && (i = "_first"), r === void 0 && (r = "_last");
  var n = e._prev, o = e._next;
  n ? n._next = o : t[i] === e && (t[i] = o), o ? o._prev = n : t[r] === e && (t[r] = n), e._next = e._prev = e.parent = null;
}, Le = function(t, e) {
  t.parent && (!e || t.parent.autoRemoveChildren) && t.parent.remove && t.parent.remove(t), t._act = 0;
}, Qe = function(t, e) {
  if (t && (!e || e._end > t._dur || e._start < 0))
    for (var i = t; i; )
      i._dirty = 1, i = i.parent;
  return t;
}, Bm = function(t) {
  for (var e = t.parent; e && e.parent; )
    e._dirty = 1, e.totalDuration(), e = e.parent;
  return t;
}, Fr = function(t, e, i, r) {
  return t._startAt && (Ct ? t._startAt.revert(Vs) : t.vars.immediateRender && !t.vars.autoRevert || t._startAt.render(e, !0, r));
}, Rm = function s(t) {
  return !t || t._ts && s(t.parent);
}, La = function(t) {
  return t._repeat ? Mi(t._tTime, t = t.duration() + t._rDelay) * t : 0;
}, Mi = function(t, e) {
  var i = Math.floor(t /= e);
  return t && i === t ? i - 1 : i;
}, Js = function(t, e) {
  return (t - e._start) * e._ts + (e._ts >= 0 ? 0 : e._dirty ? e.totalDuration() : e._tDur);
}, xn = function(t) {
  return t._end = yt(t._start + (t._tDur / Math.abs(t._ts || t._rts || q) || 0));
}, yn = function(t, e) {
  var i = t._dp;
  return i && i.smoothChildTiming && t._ts && (t._start = yt(i._time - (t._ts > 0 ? e / t._ts : ((t._dirty ? t.totalDuration() : t._tDur) - e) / -t._ts)), xn(t), i._dirty || Qe(i, t)), t;
}, Vh = function(t, e) {
  var i;
  if ((e._time || !e._dur && e._initted || e._start < t._time && (e._dur || !e.add)) && (i = Js(t.rawTime(), e), (!e._dur || ys(0, e.totalDuration(), i) - e._tTime > q) && e.render(i, !0)), Qe(t, e)._dp && t._initted && t._time >= t._dur && t._ts) {
    if (t._dur < t.duration())
      for (i = t; i._dp; )
        i.rawTime() >= 0 && i.totalTime(i._tTime), i = i._dp;
    t._zTime = -q;
  }
}, ue = function(t, e, i, r) {
  return e.parent && Le(e), e._start = yt((Pe(i) ? i : i || t !== it ? jt(t, i, e) : t._time) + e._delay), e._end = yt(e._start + (e.totalDuration() / Math.abs(e.timeScale()) || 0)), Gh(t, e, "_first", "_last", t._sort ? "_start" : 0), Lr(e) || (t._recent = e), r || Vh(t, e), t._ts < 0 && yn(t, t._tTime), t;
}, Wh = function(t, e) {
  return (Yt.ScrollTrigger || po("scrollTrigger", e)) && Yt.ScrollTrigger.create(e, t);
}, Nh = function(t, e, i, r, n) {
  if (yo(t, e, n), !t._initted)
    return 1;
  if (!i && t._pt && !Ct && (t._dur && t.vars.lazy !== !1 || !t._dur && t.vars.lazy) && Lh !== Nt.frame)
    return Re.push(t), t._lazy = [n, r], 1;
}, Fm = function s(t) {
  var e = t.parent;
  return e && e._ts && e._initted && !e._lock && (e.rawTime() < 0 || s(e));
}, Lr = function(t) {
  var e = t.data;
  return e === "isFromStart" || e === "isStart";
}, Lm = function(t, e, i, r) {
  var n = t.ratio, o = e < 0 || !e && (!t._start && Fm(t) && !(!t._initted && Lr(t)) || (t._ts < 0 || t._dp._ts < 0) && !Lr(t)) ? 0 : 1, a = t._rDelay, l = 0, c, h, f;
  if (a && t._repeat && (l = ys(0, t._tDur, e), h = Mi(l, a), t._yoyo && h & 1 && (o = 1 - o), h !== Mi(t._tTime, a) && (n = 1 - o, t.vars.repeatRefresh && t._initted && t.invalidate())), o !== n || Ct || r || t._zTime === q || !e && t._zTime) {
    if (!t._initted && Nh(t, e, r, i, l))
      return;
    for (f = t._zTime, t._zTime = e || (i ? q : 0), i || (i = e && !f), t.ratio = o, t._from && (o = 1 - o), t._time = 0, t._tTime = l, c = t._pt; c; )
      c.r(o, c.d), c = c._next;
    e < 0 && Fr(t, e, i, !0), t._onUpdate && !i && Ht(t, "onUpdate"), l && t._repeat && !i && t.parent && Ht(t, "onRepeat"), (e >= t._tDur || e < 0) && t.ratio === o && (o && Le(t, 1), !i && !Ct && (Ht(t, o ? "onComplete" : "onReverseComplete", !0), t._prom && t._prom()));
  } else t._zTime || (t._zTime = e);
}, Om = function(t, e, i) {
  var r;
  if (i > e)
    for (r = t._first; r && r._start <= i; ) {
      if (r.data === "isPause" && r._start > e)
        return r;
      r = r._next;
    }
  else
    for (r = t._last; r && r._start >= i; ) {
      if (r.data === "isPause" && r._start < e)
        return r;
      r = r._prev;
    }
}, Ti = function(t, e, i, r) {
  var n = t._repeat, o = yt(e) || 0, a = t._tTime / t._tDur;
  return a && !r && (t._time *= o / t._dur), t._dur = o, t._tDur = n ? n < 0 ? 1e10 : yt(o * (n + 1) + t._rDelay * n) : o, a > 0 && !r && yn(t, t._tTime = t._tDur * a), t.parent && xn(t), i || Qe(t.parent, t), t;
}, Oa = function(t) {
  return t instanceof kt ? Qe(t) : Ti(t, t._dur);
}, Dm = {
  _start: 0,
  endTime: us,
  totalDuration: us
}, jt = function s(t, e, i) {
  var r = t.labels, n = t._recent || Dm, o = t.duration() >= qt ? n.endTime(!1) : t._dur, a, l, c;
  return vt(e) && (isNaN(e) || e in r) ? (l = e.charAt(0), c = e.substr(-1) === "%", a = e.indexOf("="), l === "<" || l === ">" ? (a >= 0 && (e = e.replace(/=/, "")), (l === "<" ? n._start : n.endTime(n._repeat >= 0)) + (parseFloat(e.substr(1)) || 0) * (c ? (a < 0 ? n : i).totalDuration() / 100 : 1)) : a < 0 ? (e in r || (r[e] = o), r[e]) : (l = parseFloat(e.charAt(a - 1) + e.substr(a + 1)), c && i && (l = l / 100 * (Pt(i) ? i[0] : i).totalDuration()), a > 1 ? s(t, e.substr(0, a - 1), i) + l : o + l)) : e == null ? o : +e;
}, ts = function(t, e, i) {
  var r = Pe(e[1]), n = (r ? 2 : 1) + (t < 2 ? 0 : 1), o = e[n], a, l;
  if (r && (o.duration = e[1]), o.parent = i, t) {
    for (a = o, l = i; l && !("immediateRender" in a); )
      a = l.vars.defaults || {}, l = Rt(l.vars.inherit) && l.parent;
    o.immediateRender = Rt(a.immediateRender), t < 2 ? o.runBackwards = 1 : o.startAt = e[n - 1];
  }
  return new ut(e[0], o, e[n + 1]);
}, De = function(t, e) {
  return t || t === 0 ? e(t) : e;
}, ys = function(t, e, i) {
  return i < t ? t : i > e ? e : i;
}, wt = function(t, e) {
  return !vt(t) || !(e = Pm.exec(t)) ? "" : e[1];
}, zm = function(t, e, i) {
  return De(i, function(r) {
    return ys(t, e, r);
  });
}, Or = [].slice, Hh = function(t, e) {
  return t && ge(t) && "length" in t && (!e && !t.length || t.length - 1 in t && ge(t[0])) && !t.nodeType && t !== ce;
}, Um = function(t, e, i) {
  return i === void 0 && (i = []), t.forEach(function(r) {
    var n;
    return vt(r) && !e || Hh(r, 1) ? (n = i).push.apply(n, Zt(r)) : i.push(r);
  }) || i;
}, Zt = function(t, e, i) {
  return tt && !e && tt.selector ? tt.selector(t) : vt(t) && !i && (Br || !ki()) ? Or.call((e || fo).querySelectorAll(t), 0) : Pt(t) ? Um(t, i) : Hh(t) ? Or.call(t, 0) : t ? [t] : [];
}, Dr = function(t) {
  return t = Zt(t)[0] || cs("Invalid scope") || {}, function(e) {
    var i = t.current || t.nativeElement || t;
    return Zt(e, i.querySelectorAll ? i : i === t ? cs("Invalid scope") || fo.createElement("div") : t);
  };
}, $h = function(t) {
  return t.sort(function() {
    return 0.5 - Math.random();
  });
}, Yh = function(t) {
  if (at(t))
    return t;
  var e = ge(t) ? t : {
    each: t
  }, i = Je(e.ease), r = e.from || 0, n = parseFloat(e.base) || 0, o = {}, a = r > 0 && r < 1, l = isNaN(r) || a, c = e.axis, h = r, f = r;
  return vt(r) ? h = f = {
    center: 0.5,
    edges: 0.5,
    end: 1
  }[r] || 0 : !a && l && (h = r[0], f = r[1]), function(d, u, m) {
    var p = (m || e).length, g = o[p], x, y, v, w, _, S, C, b, A;
    if (!g) {
      if (A = e.grid === "auto" ? 0 : (e.grid || [1, qt])[1], !A) {
        for (C = -qt; C < (C = m[A++].getBoundingClientRect().left) && A < p; )
          ;
        A < p && A--;
      }
      for (g = o[p] = [], x = l ? Math.min(A, p) * h - 0.5 : r % A, y = A === qt ? 0 : l ? p * f / A - 0.5 : r / A | 0, C = 0, b = qt, S = 0; S < p; S++)
        v = S % A - x, w = y - (S / A | 0), g[S] = _ = c ? Math.abs(c === "y" ? w : v) : Mh(v * v + w * w), _ > C && (C = _), _ < b && (b = _);
      r === "random" && $h(g), g.max = C - b, g.min = b, g.v = p = (parseFloat(e.amount) || parseFloat(e.each) * (A > p ? p - 1 : c ? c === "y" ? p / A : A : Math.max(A, p / A)) || 0) * (r === "edges" ? -1 : 1), g.b = p < 0 ? n - p : n, g.u = wt(e.amount || e.each) || 0, i = i && p < 0 ? ic(i) : i;
    }
    return p = (g[d] - g.min) / g.max || 0, yt(g.b + (i ? i(p) : p) * g.v) + g.u;
  };
}, zr = function(t) {
  var e = Math.pow(10, ((t + "").split(".")[1] || "").length);
  return function(i) {
    var r = yt(Math.round(parseFloat(i) / t) * t * e);
    return (r - r % 1) / e + (Pe(i) ? 0 : wt(i));
  };
}, jh = function(t, e) {
  var i = Pt(t), r, n;
  return !i && ge(t) && (r = i = t.radius || qt, t.values ? (t = Zt(t.values), (n = !Pe(t[0])) && (r *= r)) : t = zr(t.increment)), De(e, i ? at(t) ? function(o) {
    return n = t(o), Math.abs(n - o) <= r ? n : o;
  } : function(o) {
    for (var a = parseFloat(n ? o.x : o), l = parseFloat(n ? o.y : 0), c = qt, h = 0, f = t.length, d, u; f--; )
      n ? (d = t[f].x - a, u = t[f].y - l, d = d * d + u * u) : d = Math.abs(t[f] - a), d < c && (c = d, h = f);
    return h = !r || c <= r ? t[h] : o, n || h === o || Pe(o) ? h : h + wt(o);
  } : zr(t));
}, Xh = function(t, e, i, r) {
  return De(Pt(t) ? !e : i === !0 ? !!(i = 0) : !r, function() {
    return Pt(t) ? t[~~(Math.random() * t.length)] : (i = i || 1e-5) && (r = i < 1 ? Math.pow(10, (i + "").length - 2) : 1) && Math.floor(Math.round((t - i / 2 + Math.random() * (e - t + i * 0.99)) / i) * i * r) / r;
  });
}, Gm = function() {
  for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
    e[i] = arguments[i];
  return function(r) {
    return e.reduce(function(n, o) {
      return o(n);
    }, r);
  };
}, Vm = function(t, e) {
  return function(i) {
    return t(parseFloat(i)) + (e || wt(i));
  };
}, Wm = function(t, e, i) {
  return qh(t, e, 0, 1, i);
}, Kh = function(t, e, i) {
  return De(i, function(r) {
    return t[~~e(r)];
  });
}, Nm = function s(t, e, i) {
  var r = e - t;
  return Pt(t) ? Kh(t, s(0, t.length), e) : De(i, function(n) {
    return (r + (n - t) % r) % r + t;
  });
}, Hm = function s(t, e, i) {
  var r = e - t, n = r * 2;
  return Pt(t) ? Kh(t, s(0, t.length - 1), e) : De(i, function(o) {
    return o = (n + (o - t) % n) % n || 0, t + (o > r ? n - o : o);
  });
}, fs = function(t) {
  for (var e = 0, i = "", r, n, o, a; ~(r = t.indexOf("random(", e)); )
    o = t.indexOf(")", r), a = t.charAt(r + 7) === "[", n = t.substr(r + 7, o - r - 7).match(a ? Ih : Ir), i += t.substr(e, r - e) + Xh(a ? n : +n[0], a ? 0 : +n[1], +n[2] || 1e-5), e = o + 1;
  return i + t.substr(e, t.length - e);
}, qh = function(t, e, i, r, n) {
  var o = e - t, a = r - i;
  return De(n, function(l) {
    return i + ((l - t) / o * a || 0);
  });
}, $m = function s(t, e, i, r) {
  var n = isNaN(t + e) ? 0 : function(u) {
    return (1 - u) * t + u * e;
  };
  if (!n) {
    var o = vt(t), a = {}, l, c, h, f, d;
    if (i === !0 && (r = 1) && (i = null), o)
      t = {
        p: t
      }, e = {
        p: e
      };
    else if (Pt(t) && !Pt(e)) {
      for (h = [], f = t.length, d = f - 2, c = 1; c < f; c++)
        h.push(s(t[c - 1], t[c]));
      f--, n = function(m) {
        m *= f;
        var p = Math.min(d, ~~m);
        return h[p](m - p);
      }, i = e;
    } else r || (t = si(Pt(t) ? [] : {}, t));
    if (!h) {
      for (l in e)
        xo.call(a, t, l, "get", e[l]);
      n = function(m) {
        return wo(m, a) || (o ? t.p : t);
      };
    }
  }
  return De(i, n);
}, Da = function(t, e, i) {
  var r = t.labels, n = qt, o, a, l;
  for (o in r)
    a = r[o] - e, a < 0 == !!i && a && n > (a = Math.abs(a)) && (l = o, n = a);
  return l;
}, Ht = function(t, e, i) {
  var r = t.vars, n = r[e], o = tt, a = t._ctx, l, c, h;
  if (n)
    return l = r[e + "Params"], c = r.callbackScope || t, i && Re.length && Zs(), a && (tt = a), h = l ? n.apply(c, l) : n.call(c), tt = o, h;
}, ji = function(t) {
  return Le(t), t.scrollTrigger && t.scrollTrigger.kill(!!Ct), t.progress() < 1 && Ht(t, "onInterrupt"), t;
}, pi, Zh = [], Qh = function(t) {
  if (t)
    if (t = !t.name && t.default || t, uo() || t.headless) {
      var e = t.name, i = at(t), r = e && !i && t.init ? function() {
        this._props = [];
      } : t, n = {
        init: us,
        render: wo,
        add: xo,
        kill: ag,
        modifier: og,
        rawVars: 0
      }, o = {
        targetTest: 0,
        get: 0,
        getSetter: bo,
        aliases: {},
        register: 0
      };
      if (ki(), t !== r) {
        if (Wt[e])
          return;
        Qt(r, Qt(Qs(t, n), o)), si(r.prototype, si(n, Qs(t, o))), Wt[r.prop = e] = r, t.targetTest && (Ws.push(r), mo[e] = 1), e = (e === "css" ? "CSS" : e.charAt(0).toUpperCase() + e.substr(1)) + "Plugin";
      }
      Fh(e, r), t.register && t.register(Dt, r, Lt);
    } else
      Zh.push(t);
}, K = 255, Xi = {
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
}, Qn = function(t, e, i) {
  return t += t < 0 ? 1 : t > 1 ? -1 : 0, (t * 6 < 1 ? e + (i - e) * t * 6 : t < 0.5 ? i : t * 3 < 2 ? e + (i - e) * (2 / 3 - t) * 6 : e) * K + 0.5 | 0;
}, Jh = function(t, e, i) {
  var r = t ? Pe(t) ? [t >> 16, t >> 8 & K, t & K] : 0 : Xi.black, n, o, a, l, c, h, f, d, u, m;
  if (!r) {
    if (t.substr(-1) === "," && (t = t.substr(0, t.length - 1)), Xi[t])
      r = Xi[t];
    else if (t.charAt(0) === "#") {
      if (t.length < 6 && (n = t.charAt(1), o = t.charAt(2), a = t.charAt(3), t = "#" + n + n + o + o + a + a + (t.length === 5 ? t.charAt(4) + t.charAt(4) : "")), t.length === 9)
        return r = parseInt(t.substr(1, 6), 16), [r >> 16, r >> 8 & K, r & K, parseInt(t.substr(7), 16) / 255];
      t = parseInt(t.substr(1), 16), r = [t >> 16, t >> 8 & K, t & K];
    } else if (t.substr(0, 3) === "hsl") {
      if (r = m = t.match(Ir), !e)
        l = +r[0] % 360 / 360, c = +r[1] / 100, h = +r[2] / 100, o = h <= 0.5 ? h * (c + 1) : h + c - h * c, n = h * 2 - o, r.length > 3 && (r[3] *= 1), r[0] = Qn(l + 1 / 3, n, o), r[1] = Qn(l, n, o), r[2] = Qn(l - 1 / 3, n, o);
      else if (~t.indexOf("="))
        return r = t.match(kh), i && r.length < 4 && (r[3] = 1), r;
    } else
      r = t.match(Ir) || Xi.transparent;
    r = r.map(Number);
  }
  return e && !m && (n = r[0] / K, o = r[1] / K, a = r[2] / K, f = Math.max(n, o, a), d = Math.min(n, o, a), h = (f + d) / 2, f === d ? l = c = 0 : (u = f - d, c = h > 0.5 ? u / (2 - f - d) : u / (f + d), l = f === n ? (o - a) / u + (o < a ? 6 : 0) : f === o ? (a - n) / u + 2 : (n - o) / u + 4, l *= 60), r[0] = ~~(l + 0.5), r[1] = ~~(c * 100 + 0.5), r[2] = ~~(h * 100 + 0.5)), i && r.length < 4 && (r[3] = 1), r;
}, tc = function(t) {
  var e = [], i = [], r = -1;
  return t.split(Fe).forEach(function(n) {
    var o = n.match(di) || [];
    e.push.apply(e, o), i.push(r += o.length + 1);
  }), e.c = i, e;
}, za = function(t, e, i) {
  var r = "", n = (t + r).match(Fe), o = e ? "hsla(" : "rgba(", a = 0, l, c, h, f;
  if (!n)
    return t;
  if (n = n.map(function(d) {
    return (d = Jh(d, e, 1)) && o + (e ? d[0] + "," + d[1] + "%," + d[2] + "%," + d[3] : d.join(",")) + ")";
  }), i && (h = tc(t), l = i.c, l.join(r) !== h.c.join(r)))
    for (c = t.replace(Fe, "1").split(di), f = c.length - 1; a < f; a++)
      r += c[a] + (~l.indexOf(a) ? n.shift() || o + "0,0,0,0)" : (h.length ? h : n.length ? n : i).shift());
  if (!c)
    for (c = t.split(Fe), f = c.length - 1; a < f; a++)
      r += c[a] + n[a];
  return r + c[f];
}, Fe = function() {
  var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", t;
  for (t in Xi)
    s += "|" + t + "\\b";
  return new RegExp(s + ")", "gi");
}(), Ym = /hsl[a]?\(/, ec = function(t) {
  var e = t.join(" "), i;
  if (Fe.lastIndex = 0, Fe.test(e))
    return i = Ym.test(e), t[1] = za(t[1], i), t[0] = za(t[0], i, tc(t[1])), !0;
}, ds, Nt = function() {
  var s = Date.now, t = 500, e = 33, i = s(), r = i, n = 1e3 / 240, o = n, a = [], l, c, h, f, d, u, m = function p(g) {
    var x = s() - r, y = g === !0, v, w, _, S;
    if ((x > t || x < 0) && (i += x - e), r += x, _ = r - i, v = _ - o, (v > 0 || y) && (S = ++f.frame, d = _ - f.time * 1e3, f.time = _ = _ / 1e3, o += v + (v >= n ? 4 : n - v), w = 1), y || (l = c(p)), w)
      for (u = 0; u < a.length; u++)
        a[u](_, d, S, g);
  };
  return f = {
    time: 0,
    frame: 0,
    tick: function() {
      m(!0);
    },
    deltaRatio: function(g) {
      return d / (1e3 / (g || 60));
    },
    wake: function() {
      Bh && (!Br && uo() && (ce = Br = window, fo = ce.document || {}, Yt.gsap = Dt, (ce.gsapVersions || (ce.gsapVersions = [])).push(Dt.version), Rh(qs || ce.GreenSockGlobals || !ce.gsap && ce || {}), Zh.forEach(Qh)), h = typeof requestAnimationFrame < "u" && requestAnimationFrame, l && f.sleep(), c = h || function(g) {
        return setTimeout(g, o - f.time * 1e3 + 1 | 0);
      }, ds = 1, m(2));
    },
    sleep: function() {
      (h ? cancelAnimationFrame : clearTimeout)(l), ds = 0, c = us;
    },
    lagSmoothing: function(g, x) {
      t = g || 1 / 0, e = Math.min(x || 33, t);
    },
    fps: function(g) {
      n = 1e3 / (g || 240), o = f.time * 1e3 + n;
    },
    add: function(g, x, y) {
      var v = x ? function(w, _, S, C) {
        g(w, _, S, C), f.remove(v);
      } : g;
      return f.remove(g), a[y ? "unshift" : "push"](v), ki(), v;
    },
    remove: function(g, x) {
      ~(x = a.indexOf(g)) && a.splice(x, 1) && u >= x && u--;
    },
    _listeners: a
  }, f;
}(), ki = function() {
  return !ds && Nt.wake();
}, N = {}, jm = /^[\d.\-M][\d.\-,\s]/, Xm = /["']/g, Km = function(t) {
  for (var e = {}, i = t.substr(1, t.length - 3).split(":"), r = i[0], n = 1, o = i.length, a, l, c; n < o; n++)
    l = i[n], a = n !== o - 1 ? l.lastIndexOf(",") : l.length, c = l.substr(0, a), e[r] = isNaN(c) ? c.replace(Xm, "").trim() : +c, r = l.substr(a + 1).trim();
  return e;
}, qm = function(t) {
  var e = t.indexOf("(") + 1, i = t.indexOf(")"), r = t.indexOf("(", e);
  return t.substring(e, ~r && r < i ? t.indexOf(")", i + 1) : i);
}, Zm = function(t) {
  var e = (t + "").split("("), i = N[e[0]];
  return i && e.length > 1 && i.config ? i.config.apply(null, ~t.indexOf("{") ? [Km(e[1])] : qm(t).split(",").map(zh)) : N._CE && jm.test(t) ? N._CE("", t) : i;
}, ic = function(t) {
  return function(e) {
    return 1 - t(1 - e);
  };
}, sc = function s(t, e) {
  for (var i = t._first, r; i; )
    i instanceof kt ? s(i, e) : i.vars.yoyoEase && (!i._yoyo || !i._repeat) && i._yoyo !== e && (i.timeline ? s(i.timeline, e) : (r = i._ease, i._ease = i._yEase, i._yEase = r, i._yoyo = e)), i = i._next;
}, Je = function(t, e) {
  return t && (at(t) ? t : N[t] || Zm(t)) || e;
}, ri = function(t, e, i, r) {
  i === void 0 && (i = function(l) {
    return 1 - e(1 - l);
  }), r === void 0 && (r = function(l) {
    return l < 0.5 ? e(l * 2) / 2 : 1 - e((1 - l) * 2) / 2;
  });
  var n = {
    easeIn: e,
    easeOut: i,
    easeInOut: r
  }, o;
  return Ft(t, function(a) {
    N[a] = Yt[a] = n, N[o = a.toLowerCase()] = i;
    for (var l in n)
      N[o + (l === "easeIn" ? ".in" : l === "easeOut" ? ".out" : ".inOut")] = N[a + "." + l] = n[l];
  }), n;
}, nc = function(t) {
  return function(e) {
    return e < 0.5 ? (1 - t(1 - e * 2)) / 2 : 0.5 + t((e - 0.5) * 2) / 2;
  };
}, Jn = function s(t, e, i) {
  var r = e >= 1 ? e : 1, n = (i || (t ? 0.3 : 0.45)) / (e < 1 ? e : 1), o = n / Er * (Math.asin(1 / r) || 0), a = function(h) {
    return h === 1 ? 1 : r * Math.pow(2, -10 * h) * Cm((h - o) * n) + 1;
  }, l = t === "out" ? a : t === "in" ? function(c) {
    return 1 - a(1 - c);
  } : nc(a);
  return n = Er / n, l.config = function(c, h) {
    return s(t, c, h);
  }, l;
}, tr = function s(t, e) {
  e === void 0 && (e = 1.70158);
  var i = function(o) {
    return o ? --o * o * ((e + 1) * o + e) + 1 : 0;
  }, r = t === "out" ? i : t === "in" ? function(n) {
    return 1 - i(1 - n);
  } : nc(i);
  return r.config = function(n) {
    return s(t, n);
  }, r;
};
Ft("Linear,Quad,Cubic,Quart,Quint,Strong", function(s, t) {
  var e = t < 5 ? t + 1 : t;
  ri(s + ",Power" + (e - 1), t ? function(i) {
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
ri("Elastic", Jn("in"), Jn("out"), Jn());
(function(s, t) {
  var e = 1 / t, i = 2 * e, r = 2.5 * e, n = function(a) {
    return a < e ? s * a * a : a < i ? s * Math.pow(a - 1.5 / t, 2) + 0.75 : a < r ? s * (a -= 2.25 / t) * a + 0.9375 : s * Math.pow(a - 2.625 / t, 2) + 0.984375;
  };
  ri("Bounce", function(o) {
    return 1 - n(1 - o);
  }, n);
})(7.5625, 2.75);
ri("Expo", function(s) {
  return s ? Math.pow(2, 10 * (s - 1)) : 0;
});
ri("Circ", function(s) {
  return -(Mh(1 - s * s) - 1);
});
ri("Sine", function(s) {
  return s === 1 ? 1 : -Am(s * wm) + 1;
});
ri("Back", tr("in"), tr("out"), tr());
N.SteppedEase = N.steps = Yt.SteppedEase = {
  config: function(t, e) {
    t === void 0 && (t = 1);
    var i = 1 / t, r = t + (e ? 0 : 1), n = e ? 1 : 0, o = 1 - q;
    return function(a) {
      return ((r * ys(0, o, a) | 0) + n) * i;
    };
  }
};
Pi.ease = N["quad.out"];
Ft("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(s) {
  return go += s + "," + s + "Params,";
});
var rc = function(t, e) {
  this.id = Sm++, t._gsap = this, this.target = t, this.harness = e, this.get = e ? e.get : Oh, this.set = e ? e.getSetter : bo;
}, ps = /* @__PURE__ */ function() {
  function s(e) {
    this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat === 1 / 0 ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, Ti(this, +e.duration, 1, 1), this.data = e.data, tt && (this._ctx = tt, tt.data.push(this)), ds || Nt.wake();
  }
  var t = s.prototype;
  return t.delay = function(i) {
    return i || i === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + i - this._delay), this._delay = i, this) : this._delay;
  }, t.duration = function(i) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? i + (i + this._rDelay) * this._repeat : i) : this.totalDuration() && this._dur;
  }, t.totalDuration = function(i) {
    return arguments.length ? (this._dirty = 0, Ti(this, this._repeat < 0 ? i : (i - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
  }, t.totalTime = function(i, r) {
    if (ki(), !arguments.length)
      return this._tTime;
    var n = this._dp;
    if (n && n.smoothChildTiming && this._ts) {
      for (yn(this, i), !n._dp || n.parent || Vh(n, this); n && n.parent; )
        n.parent._time !== n._start + (n._ts >= 0 ? n._tTime / n._ts : (n.totalDuration() - n._tTime) / -n._ts) && n.totalTime(n._tTime, !0), n = n.parent;
      !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && i < this._tDur || this._ts < 0 && i > 0 || !this._tDur && !i) && ue(this._dp, this, this._start - this._delay);
    }
    return (this._tTime !== i || !this._dur && !r || this._initted && Math.abs(this._zTime) === q || !i && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = i), Dh(this, i, r)), this;
  }, t.time = function(i, r) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), i + La(this)) % (this._dur + this._rDelay) || (i ? this._dur : 0), r) : this._time;
  }, t.totalProgress = function(i, r) {
    return arguments.length ? this.totalTime(this.totalDuration() * i, r) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0;
  }, t.progress = function(i, r) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - i : i) + La(this), r) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  }, t.iteration = function(i, r) {
    var n = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (i - 1) * n, r) : this._repeat ? Mi(this._tTime, n) + 1 : 1;
  }, t.timeScale = function(i, r) {
    if (!arguments.length)
      return this._rts === -q ? 0 : this._rts;
    if (this._rts === i)
      return this;
    var n = this.parent && this._ts ? Js(this.parent._time, this) : this._tTime;
    return this._rts = +i || 0, this._ts = this._ps || i === -q ? 0 : this._rts, this.totalTime(ys(-Math.abs(this._delay), this._tDur, n), r !== !1), xn(this), Bm(this);
  }, t.paused = function(i) {
    return arguments.length ? (this._ps !== i && (this._ps = i, i ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (ki(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== q && (this._tTime -= q)))), this) : this._ps;
  }, t.startTime = function(i) {
    if (arguments.length) {
      this._start = i;
      var r = this.parent || this._dp;
      return r && (r._sort || !this.parent) && ue(r, this, i - this._delay), this;
    }
    return this._start;
  }, t.endTime = function(i) {
    return this._start + (Rt(i) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  }, t.rawTime = function(i) {
    var r = this.parent || this._dp;
    return r ? i && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? Js(r.rawTime(i), this) : this._tTime : this._tTime;
  }, t.revert = function(i) {
    i === void 0 && (i = Tm);
    var r = Ct;
    return Ct = i, (this._initted || this._startAt) && (this.timeline && this.timeline.revert(i), this.totalTime(-0.01, i.suppressEvents)), this.data !== "nested" && i.kill !== !1 && this.kill(), Ct = r, this;
  }, t.globalTime = function(i) {
    for (var r = this, n = arguments.length ? i : r.rawTime(); r; )
      n = r._start + n / (Math.abs(r._ts) || 1), r = r._dp;
    return !this.parent && this._sat ? this._sat.globalTime(i) : n;
  }, t.repeat = function(i) {
    return arguments.length ? (this._repeat = i === 1 / 0 ? -2 : i, Oa(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
  }, t.repeatDelay = function(i) {
    if (arguments.length) {
      var r = this._time;
      return this._rDelay = i, Oa(this), r ? this.time(r) : this;
    }
    return this._rDelay;
  }, t.yoyo = function(i) {
    return arguments.length ? (this._yoyo = i, this) : this._yoyo;
  }, t.seek = function(i, r) {
    return this.totalTime(jt(this, i), Rt(r));
  }, t.restart = function(i, r) {
    return this.play().totalTime(i ? -this._delay : 0, Rt(r));
  }, t.play = function(i, r) {
    return i != null && this.seek(i, r), this.reversed(!1).paused(!1);
  }, t.reverse = function(i, r) {
    return i != null && this.seek(i || this.totalDuration(), r), this.reversed(!0).paused(!1);
  }, t.pause = function(i, r) {
    return i != null && this.seek(i, r), this.paused(!0);
  }, t.resume = function() {
    return this.paused(!1);
  }, t.reversed = function(i) {
    return arguments.length ? (!!i !== this.reversed() && this.timeScale(-this._rts || (i ? -q : 0)), this) : this._rts < 0;
  }, t.invalidate = function() {
    return this._initted = this._act = 0, this._zTime = -q, this;
  }, t.isActive = function() {
    var i = this.parent || this._dp, r = this._start, n;
    return !!(!i || this._ts && this._initted && i.isActive() && (n = i.rawTime(!0)) >= r && n < this.endTime(!0) - q);
  }, t.eventCallback = function(i, r, n) {
    var o = this.vars;
    return arguments.length > 1 ? (r ? (o[i] = r, n && (o[i + "Params"] = n), i === "onUpdate" && (this._onUpdate = r)) : delete o[i], this) : o[i];
  }, t.then = function(i) {
    var r = this;
    return new Promise(function(n) {
      var o = at(i) ? i : Uh, a = function() {
        var c = r.then;
        r.then = null, at(o) && (o = o(r)) && (o.then || o === r) && (r.then = c), n(o), r.then = c;
      };
      r._initted && r.totalProgress() === 1 && r._ts >= 0 || !r._tTime && r._ts < 0 ? a() : r._prom = a;
    });
  }, t.kill = function() {
    ji(this);
  }, s;
}();
Qt(ps.prototype, {
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
var kt = /* @__PURE__ */ function(s) {
  Ph(t, s);
  function t(i, r) {
    var n;
    return i === void 0 && (i = {}), n = s.call(this, i) || this, n.labels = {}, n.smoothChildTiming = !!i.smoothChildTiming, n.autoRemoveChildren = !!i.autoRemoveChildren, n._sort = Rt(i.sortChildren), it && ue(i.parent || it, ve(n), r), i.reversed && n.reverse(), i.paused && n.paused(!0), i.scrollTrigger && Wh(ve(n), i.scrollTrigger), n;
  }
  var e = t.prototype;
  return e.to = function(r, n, o) {
    return ts(0, arguments, this), this;
  }, e.from = function(r, n, o) {
    return ts(1, arguments, this), this;
  }, e.fromTo = function(r, n, o, a) {
    return ts(2, arguments, this), this;
  }, e.set = function(r, n, o) {
    return n.duration = 0, n.parent = this, Ji(n).repeatDelay || (n.repeat = 0), n.immediateRender = !!n.immediateRender, new ut(r, n, jt(this, o), 1), this;
  }, e.call = function(r, n, o) {
    return ue(this, ut.delayedCall(0, r, n), o);
  }, e.staggerTo = function(r, n, o, a, l, c, h) {
    return o.duration = n, o.stagger = o.stagger || a, o.onComplete = c, o.onCompleteParams = h, o.parent = this, new ut(r, o, jt(this, l)), this;
  }, e.staggerFrom = function(r, n, o, a, l, c, h) {
    return o.runBackwards = 1, Ji(o).immediateRender = Rt(o.immediateRender), this.staggerTo(r, n, o, a, l, c, h);
  }, e.staggerFromTo = function(r, n, o, a, l, c, h, f) {
    return a.startAt = o, Ji(a).immediateRender = Rt(a.immediateRender), this.staggerTo(r, n, a, l, c, h, f);
  }, e.render = function(r, n, o) {
    var a = this._time, l = this._dirty ? this.totalDuration() : this._tDur, c = this._dur, h = r <= 0 ? 0 : yt(r), f = this._zTime < 0 != r < 0 && (this._initted || !c), d, u, m, p, g, x, y, v, w, _, S, C;
    if (this !== it && h > l && r >= 0 && (h = l), h !== this._tTime || o || f) {
      if (a !== this._time && c && (h += this._time - a, r += this._time - a), d = h, w = this._start, v = this._ts, x = !v, f && (c || (a = this._zTime), (r || !n) && (this._zTime = r)), this._repeat) {
        if (S = this._yoyo, g = c + this._rDelay, this._repeat < -1 && r < 0)
          return this.totalTime(g * 100 + r, n, o);
        if (d = yt(h % g), h === l ? (p = this._repeat, d = c) : (p = ~~(h / g), p && p === h / g && (d = c, p--), d > c && (d = c)), _ = Mi(this._tTime, g), !a && this._tTime && _ !== p && this._tTime - _ * g - this._dur <= 0 && (_ = p), S && p & 1 && (d = c - d, C = 1), p !== _ && !this._lock) {
          var b = S && _ & 1, A = b === (S && p & 1);
          if (p < _ && (b = !b), a = b ? 0 : h % c ? c : h, this._lock = 1, this.render(a || (C ? 0 : yt(p * g)), n, !c)._lock = 0, this._tTime = h, !n && this.parent && Ht(this, "onRepeat"), this.vars.repeatRefresh && !C && (this.invalidate()._lock = 1), a && a !== this._time || x !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
            return this;
          if (c = this._dur, l = this._tDur, A && (this._lock = 2, a = b ? c : -1e-4, this.render(a, !0), this.vars.repeatRefresh && !C && this.invalidate()), this._lock = 0, !this._ts && !x)
            return this;
          sc(this, C);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2 && (y = Om(this, yt(a), yt(d)), y && (h -= d - (d = y._start))), this._tTime = h, this._time = d, this._act = !v, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = r, a = 0), !a && d && !n && !p && (Ht(this, "onStart"), this._tTime !== h))
        return this;
      if (d >= a && r >= 0)
        for (u = this._first; u; ) {
          if (m = u._next, (u._act || d >= u._start) && u._ts && y !== u) {
            if (u.parent !== this)
              return this.render(r, n, o);
            if (u.render(u._ts > 0 ? (d - u._start) * u._ts : (u._dirty ? u.totalDuration() : u._tDur) + (d - u._start) * u._ts, n, o), d !== this._time || !this._ts && !x) {
              y = 0, m && (h += this._zTime = -q);
              break;
            }
          }
          u = m;
        }
      else {
        u = this._last;
        for (var P = r < 0 ? r : d; u; ) {
          if (m = u._prev, (u._act || P <= u._end) && u._ts && y !== u) {
            if (u.parent !== this)
              return this.render(r, n, o);
            if (u.render(u._ts > 0 ? (P - u._start) * u._ts : (u._dirty ? u.totalDuration() : u._tDur) + (P - u._start) * u._ts, n, o || Ct && (u._initted || u._startAt)), d !== this._time || !this._ts && !x) {
              y = 0, m && (h += this._zTime = P ? -q : q);
              break;
            }
          }
          u = m;
        }
      }
      if (y && !n && (this.pause(), y.render(d >= a ? 0 : -q)._zTime = d >= a ? 1 : -1, this._ts))
        return this._start = w, xn(this), this.render(r, n, o);
      this._onUpdate && !n && Ht(this, "onUpdate", !0), (h === l && this._tTime >= this.totalDuration() || !h && a) && (w === this._start || Math.abs(v) !== Math.abs(this._ts)) && (this._lock || ((r || !c) && (h === l && this._ts > 0 || !h && this._ts < 0) && Le(this, 1), !n && !(r < 0 && !a) && (h || a || !l) && (Ht(this, h === l && r >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(h < l && this.timeScale() > 0) && this._prom())));
    }
    return this;
  }, e.add = function(r, n) {
    var o = this;
    if (Pe(n) || (n = jt(this, n, r)), !(r instanceof ps)) {
      if (Pt(r))
        return r.forEach(function(a) {
          return o.add(a, n);
        }), this;
      if (vt(r))
        return this.addLabel(r, n);
      if (at(r))
        r = ut.delayedCall(0, r);
      else
        return this;
    }
    return this !== r ? ue(this, r, n) : this;
  }, e.getChildren = function(r, n, o, a) {
    r === void 0 && (r = !0), n === void 0 && (n = !0), o === void 0 && (o = !0), a === void 0 && (a = -qt);
    for (var l = [], c = this._first; c; )
      c._start >= a && (c instanceof ut ? n && l.push(c) : (o && l.push(c), r && l.push.apply(l, c.getChildren(!0, n, o)))), c = c._next;
    return l;
  }, e.getById = function(r) {
    for (var n = this.getChildren(1, 1, 1), o = n.length; o--; )
      if (n[o].vars.id === r)
        return n[o];
  }, e.remove = function(r) {
    return vt(r) ? this.removeLabel(r) : at(r) ? this.killTweensOf(r) : (_n(this, r), r === this._recent && (this._recent = this._last), Qe(this));
  }, e.totalTime = function(r, n) {
    return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = yt(Nt.time - (this._ts > 0 ? r / this._ts : (this.totalDuration() - r) / -this._ts))), s.prototype.totalTime.call(this, r, n), this._forcing = 0, this) : this._tTime;
  }, e.addLabel = function(r, n) {
    return this.labels[r] = jt(this, n), this;
  }, e.removeLabel = function(r) {
    return delete this.labels[r], this;
  }, e.addPause = function(r, n, o) {
    var a = ut.delayedCall(0, n || us, o);
    return a.data = "isPause", this._hasPause = 1, ue(this, a, jt(this, r));
  }, e.removePause = function(r) {
    var n = this._first;
    for (r = jt(this, r); n; )
      n._start === r && n.data === "isPause" && Le(n), n = n._next;
  }, e.killTweensOf = function(r, n, o) {
    for (var a = this.getTweensOf(r, o), l = a.length; l--; )
      Ee !== a[l] && a[l].kill(r, n);
    return this;
  }, e.getTweensOf = function(r, n) {
    for (var o = [], a = Zt(r), l = this._first, c = Pe(n), h; l; )
      l instanceof ut ? km(l._targets, a) && (c ? (!Ee || l._initted && l._ts) && l.globalTime(0) <= n && l.globalTime(l.totalDuration()) > n : !n || l.isActive()) && o.push(l) : (h = l.getTweensOf(a, n)).length && o.push.apply(o, h), l = l._next;
    return o;
  }, e.tweenTo = function(r, n) {
    n = n || {};
    var o = this, a = jt(o, r), l = n, c = l.startAt, h = l.onStart, f = l.onStartParams, d = l.immediateRender, u, m = ut.to(o, Qt({
      ease: n.ease || "none",
      lazy: !1,
      immediateRender: !1,
      time: a,
      overwrite: "auto",
      duration: n.duration || Math.abs((a - (c && "time" in c ? c.time : o._time)) / o.timeScale()) || q,
      onStart: function() {
        if (o.pause(), !u) {
          var g = n.duration || Math.abs((a - (c && "time" in c ? c.time : o._time)) / o.timeScale());
          m._dur !== g && Ti(m, g, 0, 1).render(m._time, !0, !0), u = 1;
        }
        h && h.apply(m, f || []);
      }
    }, n));
    return d ? m.render(0) : m;
  }, e.tweenFromTo = function(r, n, o) {
    return this.tweenTo(n, Qt({
      startAt: {
        time: jt(this, r)
      }
    }, o));
  }, e.recent = function() {
    return this._recent;
  }, e.nextLabel = function(r) {
    return r === void 0 && (r = this._time), Da(this, jt(this, r));
  }, e.previousLabel = function(r) {
    return r === void 0 && (r = this._time), Da(this, jt(this, r), 1);
  }, e.currentLabel = function(r) {
    return arguments.length ? this.seek(r, !0) : this.previousLabel(this._time + q);
  }, e.shiftChildren = function(r, n, o) {
    o === void 0 && (o = 0);
    for (var a = this._first, l = this.labels, c; a; )
      a._start >= o && (a._start += r, a._end += r), a = a._next;
    if (n)
      for (c in l)
        l[c] >= o && (l[c] += r);
    return Qe(this);
  }, e.invalidate = function(r) {
    var n = this._first;
    for (this._lock = 0; n; )
      n.invalidate(r), n = n._next;
    return s.prototype.invalidate.call(this, r);
  }, e.clear = function(r) {
    r === void 0 && (r = !0);
    for (var n = this._first, o; n; )
      o = n._next, this.remove(n), n = o;
    return this._dp && (this._time = this._tTime = this._pTime = 0), r && (this.labels = {}), Qe(this);
  }, e.totalDuration = function(r) {
    var n = 0, o = this, a = o._last, l = qt, c, h, f;
    if (arguments.length)
      return o.timeScale((o._repeat < 0 ? o.duration() : o.totalDuration()) / (o.reversed() ? -r : r));
    if (o._dirty) {
      for (f = o.parent; a; )
        c = a._prev, a._dirty && a.totalDuration(), h = a._start, h > l && o._sort && a._ts && !o._lock ? (o._lock = 1, ue(o, a, h - a._delay, 1)._lock = 0) : l = h, h < 0 && a._ts && (n -= h, (!f && !o._dp || f && f.smoothChildTiming) && (o._start += h / o._ts, o._time -= h, o._tTime -= h), o.shiftChildren(-h, !1, -1 / 0), l = 0), a._end > n && a._ts && (n = a._end), a = c;
      Ti(o, o === it && o._time > n ? o._time : n, 1, 1), o._dirty = 0;
    }
    return o._tDur;
  }, t.updateRoot = function(r) {
    if (it._ts && (Dh(it, Js(r, it)), Lh = Nt.frame), Nt.frame >= Ra) {
      Ra += $t.autoSleep || 120;
      var n = it._first;
      if ((!n || !n._ts) && $t.autoSleep && Nt._listeners.length < 2) {
        for (; n && !n._ts; )
          n = n._next;
        n || Nt.sleep();
      }
    }
  }, t;
}(ps);
Qt(kt.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var Qm = function(t, e, i, r, n, o, a) {
  var l = new Lt(this._pt, t, e, 0, 1, uc, null, n), c = 0, h = 0, f, d, u, m, p, g, x, y;
  for (l.b = i, l.e = r, i += "", r += "", (x = ~r.indexOf("random(")) && (r = fs(r)), o && (y = [i, r], o(y, t, e), i = y[0], r = y[1]), d = i.match(qn) || []; f = qn.exec(r); )
    m = f[0], p = r.substring(c, f.index), u ? u = (u + 1) % 5 : p.substr(-5) === "rgba(" && (u = 1), m !== d[h++] && (g = parseFloat(d[h - 1]) || 0, l._pt = {
      _next: l._pt,
      p: p || h === 1 ? p : ",",
      //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
      s: g,
      c: m.charAt(1) === "=" ? yi(g, m) - g : parseFloat(m) - g,
      m: u && u < 4 ? Math.round : 0
    }, c = qn.lastIndex);
  return l.c = c < r.length ? r.substring(c, r.length) : "", l.fp = a, (Eh.test(r) || x) && (l.e = 0), this._pt = l, l;
}, xo = function(t, e, i, r, n, o, a, l, c, h) {
  at(r) && (r = r(n || 0, t, o));
  var f = t[e], d = i !== "get" ? i : at(f) ? c ? t[e.indexOf("set") || !at(t["get" + e.substr(3)]) ? e : "get" + e.substr(3)](c) : t[e]() : f, u = at(f) ? c ? sg : hc : vo, m;
  if (vt(r) && (~r.indexOf("random(") && (r = fs(r)), r.charAt(1) === "=" && (m = yi(d, r) + (wt(d) || 0), (m || m === 0) && (r = m))), !h || d !== r || Ur)
    return !isNaN(d * r) && r !== "" ? (m = new Lt(this._pt, t, e, +d || 0, r - (d || 0), typeof f == "boolean" ? rg : cc, 0, u), c && (m.fp = c), a && m.modifier(a, this, t), this._pt = m) : (!f && !(e in t) && po(e, r), Qm.call(this, t, e, d, r, u, l || $t.stringFilter, c));
}, Jm = function(t, e, i, r, n) {
  if (at(t) && (t = es(t, n, e, i, r)), !ge(t) || t.style && t.nodeType || Pt(t) || Th(t))
    return vt(t) ? es(t, n, e, i, r) : t;
  var o = {}, a;
  for (a in t)
    o[a] = es(t[a], n, e, i, r);
  return o;
}, oc = function(t, e, i, r, n, o) {
  var a, l, c, h;
  if (Wt[t] && (a = new Wt[t]()).init(n, a.rawVars ? e[t] : Jm(e[t], r, n, o, i), i, r, o) !== !1 && (i._pt = l = new Lt(i._pt, n, t, 0, 1, a.render, a, 0, a.priority), i !== pi))
    for (c = i._ptLookup[i._targets.indexOf(n)], h = a._props.length; h--; )
      c[a._props[h]] = l;
  return a;
}, Ee, Ur, yo = function s(t, e, i) {
  var r = t.vars, n = r.ease, o = r.startAt, a = r.immediateRender, l = r.lazy, c = r.onUpdate, h = r.runBackwards, f = r.yoyoEase, d = r.keyframes, u = r.autoRevert, m = t._dur, p = t._startAt, g = t._targets, x = t.parent, y = x && x.data === "nested" ? x.vars.targets : g, v = t._overwrite === "auto" && !ho, w = t.timeline, _, S, C, b, A, P, M, T, k, E, I, B, R;
  if (w && (!d || !n) && (n = "none"), t._ease = Je(n, Pi.ease), t._yEase = f ? ic(Je(f === !0 ? n : f, Pi.ease)) : 0, f && t._yoyo && !t._repeat && (f = t._yEase, t._yEase = t._ease, t._ease = f), t._from = !w && !!r.runBackwards, !w || d && !r.stagger) {
    if (T = g[0] ? Ze(g[0]).harness : 0, B = T && r[T.prop], _ = Qs(r, mo), p && (p._zTime < 0 && p.progress(1), e < 0 && h && a && !u ? p.render(-1, !0) : p.revert(h && m ? Vs : Mm), p._lazy = 0), o) {
      if (Le(t._startAt = ut.set(g, Qt({
        data: "isStart",
        overwrite: !1,
        parent: x,
        immediateRender: !0,
        lazy: !p && Rt(l),
        startAt: null,
        delay: 0,
        onUpdate: c && function() {
          return Ht(t, "onUpdate");
        },
        stagger: 0
      }, o))), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (Ct || !a && !u) && t._startAt.revert(Vs), a && m && e <= 0 && i <= 0) {
        e && (t._zTime = e);
        return;
      }
    } else if (h && m && !p) {
      if (e && (a = !1), C = Qt({
        overwrite: !1,
        data: "isFromStart",
        //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
        lazy: a && !p && Rt(l),
        immediateRender: a,
        //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
        stagger: 0,
        parent: x
        //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
      }, _), B && (C[T.prop] = B), Le(t._startAt = ut.set(g, C)), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (Ct ? t._startAt.revert(Vs) : t._startAt.render(-1, !0)), t._zTime = e, !a)
        s(t._startAt, q, q);
      else if (!e)
        return;
    }
    for (t._pt = t._ptCache = 0, l = m && Rt(l) || l && !m, S = 0; S < g.length; S++) {
      if (A = g[S], M = A._gsap || _o(g)[S]._gsap, t._ptLookup[S] = E = {}, Rr[M.id] && Re.length && Zs(), I = y === g ? S : y.indexOf(A), T && (k = new T()).init(A, B || _, t, I, y) !== !1 && (t._pt = b = new Lt(t._pt, A, k.name, 0, 1, k.render, k, 0, k.priority), k._props.forEach(function(z) {
        E[z] = b;
      }), k.priority && (P = 1)), !T || B)
        for (C in _)
          Wt[C] && (k = oc(C, _, t, I, A, y)) ? k.priority && (P = 1) : E[C] = b = xo.call(t, A, C, "get", _[C], I, y, 0, r.stringFilter);
      t._op && t._op[S] && t.kill(A, t._op[S]), v && t._pt && (Ee = t, it.killTweensOf(A, E, t.globalTime(e)), R = !t.parent, Ee = 0), t._pt && l && (Rr[M.id] = 1);
    }
    P && fc(t), t._onInit && t._onInit(t);
  }
  t._onUpdate = c, t._initted = (!t._op || t._pt) && !R, d && e <= 0 && w.render(qt, !0, !0);
}, tg = function(t, e, i, r, n, o, a, l) {
  var c = (t._pt && t._ptCache || (t._ptCache = {}))[e], h, f, d, u;
  if (!c)
    for (c = t._ptCache[e] = [], d = t._ptLookup, u = t._targets.length; u--; ) {
      if (h = d[u][e], h && h.d && h.d._pt)
        for (h = h.d._pt; h && h.p !== e && h.fp !== e; )
          h = h._next;
      if (!h)
        return Ur = 1, t.vars[e] = "+=0", yo(t, a), Ur = 0, l ? cs(e + " not eligible for reset") : 1;
      c.push(h);
    }
  for (u = c.length; u--; )
    f = c[u], h = f._pt || f, h.s = (r || r === 0) && !n ? r : h.s + (r || 0) + o * h.c, h.c = i - h.s, f.e && (f.e = ht(i) + wt(f.e)), f.b && (f.b = h.s + wt(f.b));
}, eg = function(t, e) {
  var i = t[0] ? Ze(t[0]).harness : 0, r = i && i.aliases, n, o, a, l;
  if (!r)
    return e;
  n = si({}, e);
  for (o in r)
    if (o in n)
      for (l = r[o].split(","), a = l.length; a--; )
        n[l[a]] = n[o];
  return n;
}, ig = function(t, e, i, r) {
  var n = e.ease || r || "power1.inOut", o, a;
  if (Pt(e))
    a = i[t] || (i[t] = []), e.forEach(function(l, c) {
      return a.push({
        t: c / (e.length - 1) * 100,
        v: l,
        e: n
      });
    });
  else
    for (o in e)
      a = i[o] || (i[o] = []), o === "ease" || a.push({
        t: parseFloat(t),
        v: e[o],
        e: n
      });
}, es = function(t, e, i, r, n) {
  return at(t) ? t.call(e, i, r, n) : vt(t) && ~t.indexOf("random(") ? fs(t) : t;
}, ac = go + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", lc = {};
Ft(ac + ",id,stagger,delay,duration,paused,scrollTrigger", function(s) {
  return lc[s] = 1;
});
var ut = /* @__PURE__ */ function(s) {
  Ph(t, s);
  function t(i, r, n, o) {
    var a;
    typeof r == "number" && (n.duration = r, r = n, n = null), a = s.call(this, o ? r : Ji(r)) || this;
    var l = a.vars, c = l.duration, h = l.delay, f = l.immediateRender, d = l.stagger, u = l.overwrite, m = l.keyframes, p = l.defaults, g = l.scrollTrigger, x = l.yoyoEase, y = r.parent || it, v = (Pt(i) || Th(i) ? Pe(i[0]) : "length" in r) ? [i] : Zt(i), w, _, S, C, b, A, P, M;
    if (a._targets = v.length ? _o(v) : cs("GSAP target " + i + " not found. https://gsap.com", !$t.nullTargetWarn) || [], a._ptLookup = [], a._overwrite = u, m || d || Ls(c) || Ls(h)) {
      if (r = a.vars, w = a.timeline = new kt({
        data: "nested",
        defaults: p || {},
        targets: y && y.data === "nested" ? y.vars.targets : v
      }), w.kill(), w.parent = w._dp = ve(a), w._start = 0, d || Ls(c) || Ls(h)) {
        if (C = v.length, P = d && Yh(d), ge(d))
          for (b in d)
            ~ac.indexOf(b) && (M || (M = {}), M[b] = d[b]);
        for (_ = 0; _ < C; _++)
          S = Qs(r, lc), S.stagger = 0, x && (S.yoyoEase = x), M && si(S, M), A = v[_], S.duration = +es(c, ve(a), _, A, v), S.delay = (+es(h, ve(a), _, A, v) || 0) - a._delay, !d && C === 1 && S.delay && (a._delay = h = S.delay, a._start += h, S.delay = 0), w.to(A, S, P ? P(_, A, v) : 0), w._ease = N.none;
        w.duration() ? c = h = 0 : a.timeline = 0;
      } else if (m) {
        Ji(Qt(w.vars.defaults, {
          ease: "none"
        })), w._ease = Je(m.ease || r.ease || "none");
        var T = 0, k, E, I;
        if (Pt(m))
          m.forEach(function(B) {
            return w.to(v, B, ">");
          }), w.duration();
        else {
          S = {};
          for (b in m)
            b === "ease" || b === "easeEach" || ig(b, m[b], S, m.easeEach);
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
    return u === !0 && !ho && (Ee = ve(a), it.killTweensOf(v), Ee = 0), ue(y, ve(a), n), r.reversed && a.reverse(), r.paused && a.paused(!0), (f || !c && !m && a._start === yt(y._time) && Rt(f) && Rm(ve(a)) && y.data !== "nested") && (a._tTime = -q, a.render(Math.max(0, -h) || 0)), g && Wh(ve(a), g), a;
  }
  var e = t.prototype;
  return e.render = function(r, n, o) {
    var a = this._time, l = this._tDur, c = this._dur, h = r < 0, f = r > l - q && !h ? l : r < q ? 0 : r, d, u, m, p, g, x, y, v, w;
    if (!c)
      Lm(this, r, n, o);
    else if (f !== this._tTime || !r || o || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== h) {
      if (d = f, v = this.timeline, this._repeat) {
        if (p = c + this._rDelay, this._repeat < -1 && h)
          return this.totalTime(p * 100 + r, n, o);
        if (d = yt(f % p), f === l ? (m = this._repeat, d = c) : (m = ~~(f / p), m && m === yt(f / p) && (d = c, m--), d > c && (d = c)), x = this._yoyo && m & 1, x && (w = this._yEase, d = c - d), g = Mi(this._tTime, p), d === a && !o && this._initted && m === g)
          return this._tTime = f, this;
        m !== g && (v && this._yEase && sc(v, x), this.vars.repeatRefresh && !x && !this._lock && this._time !== p && this._initted && (this._lock = o = 1, this.render(yt(p * m), !0).invalidate()._lock = 0));
      }
      if (!this._initted) {
        if (Nh(this, h ? r : d, o, n, f))
          return this._tTime = 0, this;
        if (a !== this._time && !(o && this.vars.repeatRefresh && m !== g))
          return this;
        if (c !== this._dur)
          return this.render(r, n, o);
      }
      if (this._tTime = f, this._time = d, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = y = (w || this._ease)(d / c), this._from && (this.ratio = y = 1 - y), d && !a && !n && !m && (Ht(this, "onStart"), this._tTime !== f))
        return this;
      for (u = this._pt; u; )
        u.r(y, u.d), u = u._next;
      v && v.render(r < 0 ? r : v._dur * v._ease(d / this._dur), n, o) || this._startAt && (this._zTime = r), this._onUpdate && !n && (h && Fr(this, r, n, o), Ht(this, "onUpdate")), this._repeat && m !== g && this.vars.onRepeat && !n && this.parent && Ht(this, "onRepeat"), (f === this._tDur || !f) && this._tTime === f && (h && !this._onUpdate && Fr(this, r, !0, !0), (r || !c) && (f === this._tDur && this._ts > 0 || !f && this._ts < 0) && Le(this, 1), !n && !(h && !a) && (f || a || x) && (Ht(this, f === l ? "onComplete" : "onReverseComplete", !0), this._prom && !(f < l && this.timeScale() > 0) && this._prom()));
    }
    return this;
  }, e.targets = function() {
    return this._targets;
  }, e.invalidate = function(r) {
    return (!r || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(r), s.prototype.invalidate.call(this, r);
  }, e.resetTo = function(r, n, o, a, l) {
    ds || Nt.wake(), this._ts || this.play();
    var c = Math.min(this._dur, (this._dp._time - this._start) * this._ts), h;
    return this._initted || yo(this, c), h = this._ease(c / this._dur), tg(this, r, n, o, a, h, c, l) ? this.resetTo(r, n, o, a, 1) : (yn(this, 0), this.parent || Gh(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
  }, e.kill = function(r, n) {
    if (n === void 0 && (n = "all"), !r && (!n || n === "all"))
      return this._lazy = this._pt = 0, this.parent ? ji(this) : this;
    if (this.timeline) {
      var o = this.timeline.totalDuration();
      return this.timeline.killTweensOf(r, n, Ee && Ee.vars.overwrite !== !0)._first || ji(this), this.parent && o !== this.timeline.totalDuration() && Ti(this, this._dur * this.timeline._tDur / o, 0, 1), this;
    }
    var a = this._targets, l = r ? Zt(r) : a, c = this._ptLookup, h = this._pt, f, d, u, m, p, g, x;
    if ((!n || n === "all") && Im(a, l))
      return n === "all" && (this._pt = 0), ji(this);
    for (f = this._op = this._op || [], n !== "all" && (vt(n) && (p = {}, Ft(n, function(y) {
      return p[y] = 1;
    }), n = p), n = eg(a, n)), x = a.length; x--; )
      if (~l.indexOf(a[x])) {
        d = c[x], n === "all" ? (f[x] = n, m = d, u = {}) : (u = f[x] = f[x] || {}, m = n);
        for (p in m)
          g = d && d[p], g && ((!("kill" in g.d) || g.d.kill(p) === !0) && _n(this, g, "_pt"), delete d[p]), u !== "all" && (u[p] = 1);
      }
    return this._initted && !this._pt && h && ji(this), this;
  }, t.to = function(r, n) {
    return new t(r, n, arguments[2]);
  }, t.from = function(r, n) {
    return ts(1, arguments);
  }, t.delayedCall = function(r, n, o, a) {
    return new t(n, 0, {
      immediateRender: !1,
      lazy: !1,
      overwrite: !1,
      delay: r,
      onComplete: n,
      onReverseComplete: n,
      onCompleteParams: o,
      onReverseCompleteParams: o,
      callbackScope: a
    });
  }, t.fromTo = function(r, n, o) {
    return ts(2, arguments);
  }, t.set = function(r, n) {
    return n.duration = 0, n.repeatDelay || (n.repeat = 0), new t(r, n);
  }, t.killTweensOf = function(r, n, o) {
    return it.killTweensOf(r, n, o);
  }, t;
}(ps);
Qt(ut.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
Ft("staggerTo,staggerFrom,staggerFromTo", function(s) {
  ut[s] = function() {
    var t = new kt(), e = Or.call(arguments, 0);
    return e.splice(s === "staggerFromTo" ? 5 : 4, 0, 0), t[s].apply(t, e);
  };
});
var vo = function(t, e, i) {
  return t[e] = i;
}, hc = function(t, e, i) {
  return t[e](i);
}, sg = function(t, e, i, r) {
  return t[e](r.fp, i);
}, ng = function(t, e, i) {
  return t.setAttribute(e, i);
}, bo = function(t, e) {
  return at(t[e]) ? hc : co(t[e]) && t.setAttribute ? ng : vo;
}, cc = function(t, e) {
  return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e6) / 1e6, e);
}, rg = function(t, e) {
  return e.set(e.t, e.p, !!(e.s + e.c * t), e);
}, uc = function(t, e) {
  var i = e._pt, r = "";
  if (!t && e.b)
    r = e.b;
  else if (t === 1 && e.e)
    r = e.e;
  else {
    for (; i; )
      r = i.p + (i.m ? i.m(i.s + i.c * t) : Math.round((i.s + i.c * t) * 1e4) / 1e4) + r, i = i._next;
    r += e.c;
  }
  e.set(e.t, e.p, r, e);
}, wo = function(t, e) {
  for (var i = e._pt; i; )
    i.r(t, i.d), i = i._next;
}, og = function(t, e, i, r) {
  for (var n = this._pt, o; n; )
    o = n._next, n.p === r && n.modifier(t, e, i), n = o;
}, ag = function(t) {
  for (var e = this._pt, i, r; e; )
    r = e._next, e.p === t && !e.op || e.op === t ? _n(this, e, "_pt") : e.dep || (i = 1), e = r;
  return !i;
}, lg = function(t, e, i, r) {
  r.mSet(t, e, r.m.call(r.tween, i, r.mt), r);
}, fc = function(t) {
  for (var e = t._pt, i, r, n, o; e; ) {
    for (i = e._next, r = n; r && r.pr > e.pr; )
      r = r._next;
    (e._prev = r ? r._prev : o) ? e._prev._next = e : n = e, (e._next = r) ? r._prev = e : o = e, e = i;
  }
  t._pt = n;
}, Lt = /* @__PURE__ */ function() {
  function s(e, i, r, n, o, a, l, c, h) {
    this.t = i, this.s = n, this.c = o, this.p = r, this.r = a || cc, this.d = l || this, this.set = c || vo, this.pr = h || 0, this._next = e, e && (e._prev = this);
  }
  var t = s.prototype;
  return t.modifier = function(i, r, n) {
    this.mSet = this.mSet || this.set, this.set = lg, this.m = i, this.mt = n, this.tween = r;
  }, s;
}();
Ft(go + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(s) {
  return mo[s] = 1;
});
Yt.TweenMax = Yt.TweenLite = ut;
Yt.TimelineLite = Yt.TimelineMax = kt;
it = new kt({
  sortChildren: !1,
  defaults: Pi,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0
});
$t.stringFilter = ec;
var ti = [], Ns = {}, hg = [], Ua = 0, cg = 0, er = function(t) {
  return (Ns[t] || hg).map(function(e) {
    return e();
  });
}, Gr = function() {
  var t = Date.now(), e = [];
  t - Ua > 2 && (er("matchMediaInit"), ti.forEach(function(i) {
    var r = i.queries, n = i.conditions, o, a, l, c;
    for (a in r)
      o = ce.matchMedia(r[a]).matches, o && (l = 1), o !== n[a] && (n[a] = o, c = 1);
    c && (i.revert(), l && e.push(i));
  }), er("matchMediaRevert"), e.forEach(function(i) {
    return i.onMatch(i, function(r) {
      return i.add(null, r);
    });
  }), Ua = t, er("matchMedia"));
}, dc = /* @__PURE__ */ function() {
  function s(e, i) {
    this.selector = i && Dr(i), this.data = [], this._r = [], this.isReverted = !1, this.id = cg++, e && this.add(e);
  }
  var t = s.prototype;
  return t.add = function(i, r, n) {
    at(i) && (n = r, r = i, i = at);
    var o = this, a = function() {
      var c = tt, h = o.selector, f;
      return c && c !== o && c.data.push(o), n && (o.selector = Dr(n)), tt = o, f = r.apply(o, arguments), at(f) && o._r.push(f), tt = c, o.selector = h, o.isReverted = !1, f;
    };
    return o.last = a, i === at ? a(o, function(l) {
      return o.add(null, l);
    }) : i ? o[i] = a : a;
  }, t.ignore = function(i) {
    var r = tt;
    tt = null, i(this), tt = r;
  }, t.getTweens = function() {
    var i = [];
    return this.data.forEach(function(r) {
      return r instanceof s ? i.push.apply(i, r.getTweens()) : r instanceof ut && !(r.parent && r.parent.data === "nested") && i.push(r);
    }), i;
  }, t.clear = function() {
    this._r.length = this.data.length = 0;
  }, t.kill = function(i, r) {
    var n = this;
    if (i ? function() {
      for (var a = n.getTweens(), l = n.data.length, c; l--; )
        c = n.data[l], c.data === "isFlip" && (c.revert(), c.getChildren(!0, !0, !1).forEach(function(h) {
          return a.splice(a.indexOf(h), 1);
        }));
      for (a.map(function(h) {
        return {
          g: h._dur || h._delay || h._sat && !h._sat.vars.immediateRender ? h.globalTime(0) : -1 / 0,
          t: h
        };
      }).sort(function(h, f) {
        return f.g - h.g || -1 / 0;
      }).forEach(function(h) {
        return h.t.revert(i);
      }), l = n.data.length; l--; )
        c = n.data[l], c instanceof kt ? c.data !== "nested" && (c.scrollTrigger && c.scrollTrigger.revert(), c.kill()) : !(c instanceof ut) && c.revert && c.revert(i);
      n._r.forEach(function(h) {
        return h(i, n);
      }), n.isReverted = !0;
    }() : this.data.forEach(function(a) {
      return a.kill && a.kill();
    }), this.clear(), r)
      for (var o = ti.length; o--; )
        ti[o].id === this.id && ti.splice(o, 1);
  }, t.revert = function(i) {
    this.kill(i || {});
  }, s;
}(), ug = /* @__PURE__ */ function() {
  function s(e) {
    this.contexts = [], this.scope = e, tt && tt.data.push(this);
  }
  var t = s.prototype;
  return t.add = function(i, r, n) {
    ge(i) || (i = {
      matches: i
    });
    var o = new dc(0, n || this.scope), a = o.conditions = {}, l, c, h;
    tt && !o.selector && (o.selector = tt.selector), this.contexts.push(o), r = o.add("onMatch", r), o.queries = i;
    for (c in i)
      c === "all" ? h = 1 : (l = ce.matchMedia(i[c]), l && (ti.indexOf(o) < 0 && ti.push(o), (a[c] = l.matches) && (h = 1), l.addListener ? l.addListener(Gr) : l.addEventListener("change", Gr)));
    return h && r(o, function(f) {
      return o.add(null, f);
    }), this;
  }, t.revert = function(i) {
    this.kill(i || {});
  }, t.kill = function(i) {
    this.contexts.forEach(function(r) {
      return r.kill(i, !0);
    });
  }, s;
}(), tn = {
  registerPlugin: function() {
    for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
      e[i] = arguments[i];
    e.forEach(function(r) {
      return Qh(r);
    });
  },
  timeline: function(t) {
    return new kt(t);
  },
  getTweensOf: function(t, e) {
    return it.getTweensOf(t, e);
  },
  getProperty: function(t, e, i, r) {
    vt(t) && (t = Zt(t)[0]);
    var n = Ze(t || {}).get, o = i ? Uh : zh;
    return i === "native" && (i = ""), t && (e ? o((Wt[e] && Wt[e].get || n)(t, e, i, r)) : function(a, l, c) {
      return o((Wt[a] && Wt[a].get || n)(t, a, l, c));
    });
  },
  quickSetter: function(t, e, i) {
    if (t = Zt(t), t.length > 1) {
      var r = t.map(function(h) {
        return Dt.quickSetter(h, e, i);
      }), n = r.length;
      return function(h) {
        for (var f = n; f--; )
          r[f](h);
      };
    }
    t = t[0] || {};
    var o = Wt[e], a = Ze(t), l = a.harness && (a.harness.aliases || {})[e] || e, c = o ? function(h) {
      var f = new o();
      pi._pt = 0, f.init(t, i ? h + i : h, pi, 0, [t]), f.render(1, f), pi._pt && wo(1, pi);
    } : a.set(t, l);
    return o ? c : function(h) {
      return c(t, l, i ? h + i : h, a, 1);
    };
  },
  quickTo: function(t, e, i) {
    var r, n = Dt.to(t, si((r = {}, r[e] = "+=0.1", r.paused = !0, r), i || {})), o = function(l, c, h) {
      return n.resetTo(e, l, c, h);
    };
    return o.tween = n, o;
  },
  isTweening: function(t) {
    return it.getTweensOf(t, !0).length > 0;
  },
  defaults: function(t) {
    return t && t.ease && (t.ease = Je(t.ease, Pi.ease)), Fa(Pi, t || {});
  },
  config: function(t) {
    return Fa($t, t || {});
  },
  registerEffect: function(t) {
    var e = t.name, i = t.effect, r = t.plugins, n = t.defaults, o = t.extendTimeline;
    (r || "").split(",").forEach(function(a) {
      return a && !Wt[a] && !Yt[a] && cs(e + " effect requires " + a + " plugin.");
    }), Zn[e] = function(a, l, c) {
      return i(Zt(a), Qt(l || {}, n), c);
    }, o && (kt.prototype[e] = function(a, l, c) {
      return this.add(Zn[e](a, ge(l) ? l : (c = l) && {}, this), c);
    });
  },
  registerEase: function(t, e) {
    N[t] = Je(e);
  },
  parseEase: function(t, e) {
    return arguments.length ? Je(t, e) : N;
  },
  getById: function(t) {
    return it.getById(t);
  },
  exportRoot: function(t, e) {
    t === void 0 && (t = {});
    var i = new kt(t), r, n;
    for (i.smoothChildTiming = Rt(t.smoothChildTiming), it.remove(i), i._dp = 0, i._time = i._tTime = it._time, r = it._first; r; )
      n = r._next, (e || !(!r._dur && r instanceof ut && r.vars.onComplete === r._targets[0])) && ue(i, r, r._start - r._delay), r = n;
    return ue(it, i, 0), i;
  },
  context: function(t, e) {
    return t ? new dc(t, e) : tt;
  },
  matchMedia: function(t) {
    return new ug(t);
  },
  matchMediaRefresh: function() {
    return ti.forEach(function(t) {
      var e = t.conditions, i, r;
      for (r in e)
        e[r] && (e[r] = !1, i = 1);
      i && t.revert();
    }) || Gr();
  },
  addEventListener: function(t, e) {
    var i = Ns[t] || (Ns[t] = []);
    ~i.indexOf(e) || i.push(e);
  },
  removeEventListener: function(t, e) {
    var i = Ns[t], r = i && i.indexOf(e);
    r >= 0 && i.splice(r, 1);
  },
  utils: {
    wrap: Nm,
    wrapYoyo: Hm,
    distribute: Yh,
    random: Xh,
    snap: jh,
    normalize: Wm,
    getUnit: wt,
    clamp: zm,
    splitColor: Jh,
    toArray: Zt,
    selector: Dr,
    mapRange: qh,
    pipe: Gm,
    unitize: Vm,
    interpolate: $m,
    shuffle: $h
  },
  install: Rh,
  effects: Zn,
  ticker: Nt,
  updateRoot: kt.updateRoot,
  plugins: Wt,
  globalTimeline: it,
  core: {
    PropTween: Lt,
    globals: Fh,
    Tween: ut,
    Timeline: kt,
    Animation: ps,
    getCache: Ze,
    _removeLinkedListItem: _n,
    reverting: function() {
      return Ct;
    },
    context: function(t) {
      return t && tt && (tt.data.push(t), t._ctx = tt), tt;
    },
    suppressOverwrites: function(t) {
      return ho = t;
    }
  }
};
Ft("to,from,fromTo,delayedCall,set,killTweensOf", function(s) {
  return tn[s] = ut[s];
});
Nt.add(kt.updateRoot);
pi = tn.to({}, {
  duration: 0
});
var fg = function(t, e) {
  for (var i = t._pt; i && i.p !== e && i.op !== e && i.fp !== e; )
    i = i._next;
  return i;
}, dg = function(t, e) {
  var i = t._targets, r, n, o;
  for (r in e)
    for (n = i.length; n--; )
      o = t._ptLookup[n][r], o && (o = o.d) && (o._pt && (o = fg(o, r)), o && o.modifier && o.modifier(e[r], t, i[n], r));
}, ir = function(t, e) {
  return {
    name: t,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function(r, n, o) {
      o._onInit = function(a) {
        var l, c;
        if (vt(n) && (l = {}, Ft(n, function(h) {
          return l[h] = 1;
        }), n = l), e) {
          l = {};
          for (c in n)
            l[c] = e(n[c]);
          n = l;
        }
        dg(a, n);
      };
    }
  };
}, Dt = tn.registerPlugin({
  name: "attr",
  init: function(t, e, i, r, n) {
    var o, a, l;
    this.tween = i;
    for (o in e)
      l = t.getAttribute(o) || "", a = this.add(t, "setAttribute", (l || 0) + "", e[o], r, n, 0, 0, o), a.op = o, a.b = l, this._props.push(o);
  },
  render: function(t, e) {
    for (var i = e._pt; i; )
      Ct ? i.set(i.t, i.p, i.b, i) : i.r(t, i.d), i = i._next;
  }
}, {
  name: "endArray",
  init: function(t, e) {
    for (var i = e.length; i--; )
      this.add(t, i, t[i] || 0, e[i], 0, 0, 0, 0, 0, 1);
  }
}, ir("roundProps", zr), ir("modifiers"), ir("snap", jh)) || tn;
ut.version = kt.version = Dt.version = "3.12.5";
Bh = 1;
uo() && ki();
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
var Ga, Ie, vi, So, Ke, Va, Ao, pg = function() {
  return typeof window < "u";
}, Me = {}, $e = 180 / Math.PI, bi = Math.PI / 180, hi = Math.atan2, Wa = 1e8, Co = /([A-Z])/g, mg = /(left|right|width|margin|padding|x)/i, gg = /[\s,\(]\S/, de = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, Vr = function(t, e) {
  return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e);
}, _g = function(t, e) {
  return e.set(e.t, e.p, t === 1 ? e.e : Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e);
}, xg = function(t, e) {
  return e.set(e.t, e.p, t ? Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u : e.b, e);
}, yg = function(t, e) {
  var i = e.s + e.c * t;
  e.set(e.t, e.p, ~~(i + (i < 0 ? -0.5 : 0.5)) + e.u, e);
}, pc = function(t, e) {
  return e.set(e.t, e.p, t ? e.e : e.b, e);
}, mc = function(t, e) {
  return e.set(e.t, e.p, t !== 1 ? e.b : e.e, e);
}, vg = function(t, e, i) {
  return t.style[e] = i;
}, bg = function(t, e, i) {
  return t.style.setProperty(e, i);
}, wg = function(t, e, i) {
  return t._gsap[e] = i;
}, Sg = function(t, e, i) {
  return t._gsap.scaleX = t._gsap.scaleY = i;
}, Ag = function(t, e, i, r, n) {
  var o = t._gsap;
  o.scaleX = o.scaleY = i, o.renderTransform(n, o);
}, Cg = function(t, e, i, r, n) {
  var o = t._gsap;
  o[e] = i, o.renderTransform(n, o);
}, rt = "transform", Ot = rt + "Origin", Pg = function s(t, e) {
  var i = this, r = this.target, n = r.style, o = r._gsap;
  if (t in Me && n) {
    if (this.tfm = this.tfm || {}, t !== "transform")
      t = de[t] || t, ~t.indexOf(",") ? t.split(",").forEach(function(a) {
        return i.tfm[a] = be(r, a);
      }) : this.tfm[t] = o.x ? o[t] : be(r, t), t === Ot && (this.tfm.zOrigin = o.zOrigin);
    else
      return de.transform.split(",").forEach(function(a) {
        return s.call(i, a, e);
      });
    if (this.props.indexOf(rt) >= 0)
      return;
    o.svg && (this.svgo = r.getAttribute("data-svg-origin"), this.props.push(Ot, e, "")), t = rt;
  }
  (n || e) && this.props.push(t, e, n[t]);
}, gc = function(t) {
  t.translate && (t.removeProperty("translate"), t.removeProperty("scale"), t.removeProperty("rotate"));
}, Mg = function() {
  var t = this.props, e = this.target, i = e.style, r = e._gsap, n, o;
  for (n = 0; n < t.length; n += 3)
    t[n + 1] ? e[t[n]] = t[n + 2] : t[n + 2] ? i[t[n]] = t[n + 2] : i.removeProperty(t[n].substr(0, 2) === "--" ? t[n] : t[n].replace(Co, "-$1").toLowerCase());
  if (this.tfm) {
    for (o in this.tfm)
      r[o] = this.tfm[o];
    r.svg && (r.renderTransform(), e.setAttribute("data-svg-origin", this.svgo || "")), n = Ao(), (!n || !n.isStart) && !i[rt] && (gc(i), r.zOrigin && i[Ot] && (i[Ot] += " " + r.zOrigin + "px", r.zOrigin = 0, r.renderTransform()), r.uncache = 1);
  }
}, _c = function(t, e) {
  var i = {
    target: t,
    props: [],
    revert: Mg,
    save: Pg
  };
  return t._gsap || Dt.core.getCache(t), e && e.split(",").forEach(function(r) {
    return i.save(r);
  }), i;
}, xc, Wr = function(t, e) {
  var i = Ie.createElementNS ? Ie.createElementNS((e || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), t) : Ie.createElement(t);
  return i && i.style ? i : Ie.createElement(t);
}, pe = function s(t, e, i) {
  var r = getComputedStyle(t);
  return r[e] || r.getPropertyValue(e.replace(Co, "-$1").toLowerCase()) || r.getPropertyValue(e) || !i && s(t, Ei(e) || e, 1) || "";
}, Na = "O,Moz,ms,Ms,Webkit".split(","), Ei = function(t, e, i) {
  var r = e || Ke, n = r.style, o = 5;
  if (t in n && !i)
    return t;
  for (t = t.charAt(0).toUpperCase() + t.substr(1); o-- && !(Na[o] + t in n); )
    ;
  return o < 0 ? null : (o === 3 ? "ms" : o >= 0 ? Na[o] : "") + t;
}, Nr = function() {
  pg() && window.document && (Ga = window, Ie = Ga.document, vi = Ie.documentElement, Ke = Wr("div") || {
    style: {}
  }, Wr("div"), rt = Ei(rt), Ot = rt + "Origin", Ke.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", xc = !!Ei("perspective"), Ao = Dt.core.reverting, So = 1);
}, sr = function s(t) {
  var e = Wr("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), i = this.parentNode, r = this.nextSibling, n = this.style.cssText, o;
  if (vi.appendChild(e), e.appendChild(this), this.style.display = "block", t)
    try {
      o = this.getBBox(), this._gsapBBox = this.getBBox, this.getBBox = s;
    } catch {
    }
  else this._gsapBBox && (o = this._gsapBBox());
  return i && (r ? i.insertBefore(this, r) : i.appendChild(this)), vi.removeChild(e), this.style.cssText = n, o;
}, Ha = function(t, e) {
  for (var i = e.length; i--; )
    if (t.hasAttribute(e[i]))
      return t.getAttribute(e[i]);
}, yc = function(t) {
  var e;
  try {
    e = t.getBBox();
  } catch {
    e = sr.call(t, !0);
  }
  return e && (e.width || e.height) || t.getBBox === sr || (e = sr.call(t, !0)), e && !e.width && !e.x && !e.y ? {
    x: +Ha(t, ["x", "cx", "x1"]) || 0,
    y: +Ha(t, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : e;
}, vc = function(t) {
  return !!(t.getCTM && (!t.parentNode || t.ownerSVGElement) && yc(t));
}, ni = function(t, e) {
  if (e) {
    var i = t.style, r;
    e in Me && e !== Ot && (e = rt), i.removeProperty ? (r = e.substr(0, 2), (r === "ms" || e.substr(0, 6) === "webkit") && (e = "-" + e), i.removeProperty(r === "--" ? e : e.replace(Co, "-$1").toLowerCase())) : i.removeAttribute(e);
  }
}, Be = function(t, e, i, r, n, o) {
  var a = new Lt(t._pt, e, i, 0, 1, o ? mc : pc);
  return t._pt = a, a.b = r, a.e = n, t._props.push(i), a;
}, $a = {
  deg: 1,
  rad: 1,
  turn: 1
}, Tg = {
  grid: 1,
  flex: 1
}, Oe = function s(t, e, i, r) {
  var n = parseFloat(i) || 0, o = (i + "").trim().substr((n + "").length) || "px", a = Ke.style, l = mg.test(e), c = t.tagName.toLowerCase() === "svg", h = (c ? "client" : "offset") + (l ? "Width" : "Height"), f = 100, d = r === "px", u = r === "%", m, p, g, x;
  if (r === o || !n || $a[r] || $a[o])
    return n;
  if (o !== "px" && !d && (n = s(t, e, i, "px")), x = t.getCTM && vc(t), (u || o === "%") && (Me[e] || ~e.indexOf("adius")))
    return m = x ? t.getBBox()[l ? "width" : "height"] : t[h], ht(u ? n / m * f : n / 100 * m);
  if (a[l ? "width" : "height"] = f + (d ? o : r), p = ~e.indexOf("adius") || r === "em" && t.appendChild && !c ? t : t.parentNode, x && (p = (t.ownerSVGElement || {}).parentNode), (!p || p === Ie || !p.appendChild) && (p = Ie.body), g = p._gsap, g && u && g.width && l && g.time === Nt.time && !g.uncache)
    return ht(n / g.width * f);
  if (u && (e === "height" || e === "width")) {
    var y = t.style[e];
    t.style[e] = f + r, m = t[h], y ? t.style[e] = y : ni(t, e);
  } else
    (u || o === "%") && !Tg[pe(p, "display")] && (a.position = pe(t, "position")), p === t && (a.position = "static"), p.appendChild(Ke), m = Ke[h], p.removeChild(Ke), a.position = "absolute";
  return l && u && (g = Ze(p), g.time = Nt.time, g.width = p[h]), ht(d ? m * n / f : m && n ? f / m * n : 0);
}, be = function(t, e, i, r) {
  var n;
  return So || Nr(), e in de && e !== "transform" && (e = de[e], ~e.indexOf(",") && (e = e.split(",")[0])), Me[e] && e !== "transform" ? (n = gs(t, r), n = e !== "transformOrigin" ? n[e] : n.svg ? n.origin : sn(pe(t, Ot)) + " " + n.zOrigin + "px") : (n = t.style[e], (!n || n === "auto" || r || ~(n + "").indexOf("calc(")) && (n = en[e] && en[e](t, e, i) || pe(t, e) || Oh(t, e) || (e === "opacity" ? 1 : 0))), i && !~(n + "").trim().indexOf(" ") ? Oe(t, e, n, i) + i : n;
}, kg = function(t, e, i, r) {
  if (!i || i === "none") {
    var n = Ei(e, t, 1), o = n && pe(t, n, 1);
    o && o !== i ? (e = n, i = o) : e === "borderColor" && (i = pe(t, "borderTopColor"));
  }
  var a = new Lt(this._pt, t.style, e, 0, 1, uc), l = 0, c = 0, h, f, d, u, m, p, g, x, y, v, w, _;
  if (a.b = i, a.e = r, i += "", r += "", r === "auto" && (p = t.style[e], t.style[e] = r, r = pe(t, e) || r, p ? t.style[e] = p : ni(t, e)), h = [i, r], ec(h), i = h[0], r = h[1], d = i.match(di) || [], _ = r.match(di) || [], _.length) {
    for (; f = di.exec(r); )
      g = f[0], y = r.substring(l, f.index), m ? m = (m + 1) % 5 : (y.substr(-5) === "rgba(" || y.substr(-5) === "hsla(") && (m = 1), g !== (p = d[c++] || "") && (u = parseFloat(p) || 0, w = p.substr((u + "").length), g.charAt(1) === "=" && (g = yi(u, g) + w), x = parseFloat(g), v = g.substr((x + "").length), l = di.lastIndex - v.length, v || (v = v || $t.units[e] || w, l === r.length && (r += v, a.e += v)), w !== v && (u = Oe(t, e, p, v) || 0), a._pt = {
        _next: a._pt,
        p: y || c === 1 ? y : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: u,
        c: x - u,
        m: m && m < 4 || e === "zIndex" ? Math.round : 0
      });
    a.c = l < r.length ? r.substring(l, r.length) : "";
  } else
    a.r = e === "display" && r === "none" ? mc : pc;
  return Eh.test(r) && (a.e = 0), this._pt = a, a;
}, Ya = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, Eg = function(t) {
  var e = t.split(" "), i = e[0], r = e[1] || "50%";
  return (i === "top" || i === "bottom" || r === "left" || r === "right") && (t = i, i = r, r = t), e[0] = Ya[i] || i, e[1] = Ya[r] || r, e.join(" ");
}, Ig = function(t, e) {
  if (e.tween && e.tween._time === e.tween._dur) {
    var i = e.t, r = i.style, n = e.u, o = i._gsap, a, l, c;
    if (n === "all" || n === !0)
      r.cssText = "", l = 1;
    else
      for (n = n.split(","), c = n.length; --c > -1; )
        a = n[c], Me[a] && (l = 1, a = a === "transformOrigin" ? Ot : rt), ni(i, a);
    l && (ni(i, rt), o && (o.svg && i.removeAttribute("transform"), gs(i, 1), o.uncache = 1, gc(r)));
  }
}, en = {
  clearProps: function(t, e, i, r, n) {
    if (n.data !== "isFromStart") {
      var o = t._pt = new Lt(t._pt, e, i, 0, 0, Ig);
      return o.u = r, o.pr = -10, o.tween = n, t._props.push(i), 1;
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
}, ms = [1, 0, 0, 1, 0, 0], bc = {}, wc = function(t) {
  return t === "matrix(1, 0, 0, 1, 0, 0)" || t === "none" || !t;
}, ja = function(t) {
  var e = pe(t, rt);
  return wc(e) ? ms : e.substr(7).match(kh).map(ht);
}, Po = function(t, e) {
  var i = t._gsap || Ze(t), r = t.style, n = ja(t), o, a, l, c;
  return i.svg && t.getAttribute("transform") ? (l = t.transform.baseVal.consolidate().matrix, n = [l.a, l.b, l.c, l.d, l.e, l.f], n.join(",") === "1,0,0,1,0,0" ? ms : n) : (n === ms && !t.offsetParent && t !== vi && !i.svg && (l = r.display, r.display = "block", o = t.parentNode, (!o || !t.offsetParent) && (c = 1, a = t.nextElementSibling, vi.appendChild(t)), n = ja(t), l ? r.display = l : ni(t, "display"), c && (a ? o.insertBefore(t, a) : o ? o.appendChild(t) : vi.removeChild(t))), e && n.length > 6 ? [n[0], n[1], n[4], n[5], n[12], n[13]] : n);
}, Hr = function(t, e, i, r, n, o) {
  var a = t._gsap, l = n || Po(t, !0), c = a.xOrigin || 0, h = a.yOrigin || 0, f = a.xOffset || 0, d = a.yOffset || 0, u = l[0], m = l[1], p = l[2], g = l[3], x = l[4], y = l[5], v = e.split(" "), w = parseFloat(v[0]) || 0, _ = parseFloat(v[1]) || 0, S, C, b, A;
  i ? l !== ms && (C = u * g - m * p) && (b = w * (g / C) + _ * (-p / C) + (p * y - g * x) / C, A = w * (-m / C) + _ * (u / C) - (u * y - m * x) / C, w = b, _ = A) : (S = yc(t), w = S.x + (~v[0].indexOf("%") ? w / 100 * S.width : w), _ = S.y + (~(v[1] || v[0]).indexOf("%") ? _ / 100 * S.height : _)), r || r !== !1 && a.smooth ? (x = w - c, y = _ - h, a.xOffset = f + (x * u + y * p) - x, a.yOffset = d + (x * m + y * g) - y) : a.xOffset = a.yOffset = 0, a.xOrigin = w, a.yOrigin = _, a.smooth = !!r, a.origin = e, a.originIsAbsolute = !!i, t.style[Ot] = "0px 0px", o && (Be(o, a, "xOrigin", c, w), Be(o, a, "yOrigin", h, _), Be(o, a, "xOffset", f, a.xOffset), Be(o, a, "yOffset", d, a.yOffset)), t.setAttribute("data-svg-origin", w + " " + _);
}, gs = function(t, e) {
  var i = t._gsap || new rc(t);
  if ("x" in i && !e && !i.uncache)
    return i;
  var r = t.style, n = i.scaleX < 0, o = "px", a = "deg", l = getComputedStyle(t), c = pe(t, Ot) || "0", h, f, d, u, m, p, g, x, y, v, w, _, S, C, b, A, P, M, T, k, E, I, B, R, z, F, L, Z, U, X, J, Q;
  return h = f = d = p = g = x = y = v = w = 0, u = m = 1, i.svg = !!(t.getCTM && vc(t)), l.translate && ((l.translate !== "none" || l.scale !== "none" || l.rotate !== "none") && (r[rt] = (l.translate !== "none" ? "translate3d(" + (l.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (l.rotate !== "none" ? "rotate(" + l.rotate + ") " : "") + (l.scale !== "none" ? "scale(" + l.scale.split(" ").join(",") + ") " : "") + (l[rt] !== "none" ? l[rt] : "")), r.scale = r.rotate = r.translate = "none"), C = Po(t, i.svg), i.svg && (i.uncache ? (z = t.getBBox(), c = i.xOrigin - z.x + "px " + (i.yOrigin - z.y) + "px", R = "") : R = !e && t.getAttribute("data-svg-origin"), Hr(t, R || c, !!R || i.originIsAbsolute, i.smooth !== !1, C)), _ = i.xOrigin || 0, S = i.yOrigin || 0, C !== ms && (M = C[0], T = C[1], k = C[2], E = C[3], h = I = C[4], f = B = C[5], C.length === 6 ? (u = Math.sqrt(M * M + T * T), m = Math.sqrt(E * E + k * k), p = M || T ? hi(T, M) * $e : 0, y = k || E ? hi(k, E) * $e + p : 0, y && (m *= Math.abs(Math.cos(y * bi))), i.svg && (h -= _ - (_ * M + S * k), f -= S - (_ * T + S * E))) : (Q = C[6], X = C[7], L = C[8], Z = C[9], U = C[10], J = C[11], h = C[12], f = C[13], d = C[14], b = hi(Q, U), g = b * $e, b && (A = Math.cos(-b), P = Math.sin(-b), R = I * A + L * P, z = B * A + Z * P, F = Q * A + U * P, L = I * -P + L * A, Z = B * -P + Z * A, U = Q * -P + U * A, J = X * -P + J * A, I = R, B = z, Q = F), b = hi(-k, U), x = b * $e, b && (A = Math.cos(-b), P = Math.sin(-b), R = M * A - L * P, z = T * A - Z * P, F = k * A - U * P, J = E * P + J * A, M = R, T = z, k = F), b = hi(T, M), p = b * $e, b && (A = Math.cos(b), P = Math.sin(b), R = M * A + T * P, z = I * A + B * P, T = T * A - M * P, B = B * A - I * P, M = R, I = z), g && Math.abs(g) + Math.abs(p) > 359.9 && (g = p = 0, x = 180 - x), u = ht(Math.sqrt(M * M + T * T + k * k)), m = ht(Math.sqrt(B * B + Q * Q)), b = hi(I, B), y = Math.abs(b) > 2e-4 ? b * $e : 0, w = J ? 1 / (J < 0 ? -J : J) : 0), i.svg && (R = t.getAttribute("transform"), i.forceCSS = t.setAttribute("transform", "") || !wc(pe(t, rt)), R && t.setAttribute("transform", R))), Math.abs(y) > 90 && Math.abs(y) < 270 && (n ? (u *= -1, y += p <= 0 ? 180 : -180, p += p <= 0 ? 180 : -180) : (m *= -1, y += y <= 0 ? 180 : -180)), e = e || i.uncache, i.x = h - ((i.xPercent = h && (!e && i.xPercent || (Math.round(t.offsetWidth / 2) === Math.round(-h) ? -50 : 0))) ? t.offsetWidth * i.xPercent / 100 : 0) + o, i.y = f - ((i.yPercent = f && (!e && i.yPercent || (Math.round(t.offsetHeight / 2) === Math.round(-f) ? -50 : 0))) ? t.offsetHeight * i.yPercent / 100 : 0) + o, i.z = d + o, i.scaleX = ht(u), i.scaleY = ht(m), i.rotation = ht(p) + a, i.rotationX = ht(g) + a, i.rotationY = ht(x) + a, i.skewX = y + a, i.skewY = v + a, i.transformPerspective = w + o, (i.zOrigin = parseFloat(c.split(" ")[2]) || !e && i.zOrigin || 0) && (r[Ot] = sn(c)), i.xOffset = i.yOffset = 0, i.force3D = $t.force3D, i.renderTransform = i.svg ? Rg : xc ? Sc : Bg, i.uncache = 0, i;
}, sn = function(t) {
  return (t = t.split(" "))[0] + " " + t[1];
}, nr = function(t, e, i) {
  var r = wt(e);
  return ht(parseFloat(e) + parseFloat(Oe(t, "x", i + "px", r))) + r;
}, Bg = function(t, e) {
  e.z = "0px", e.rotationY = e.rotationX = "0deg", e.force3D = 0, Sc(t, e);
}, Ue = "0deg", Ni = "0px", Ge = ") ", Sc = function(t, e) {
  var i = e || this, r = i.xPercent, n = i.yPercent, o = i.x, a = i.y, l = i.z, c = i.rotation, h = i.rotationY, f = i.rotationX, d = i.skewX, u = i.skewY, m = i.scaleX, p = i.scaleY, g = i.transformPerspective, x = i.force3D, y = i.target, v = i.zOrigin, w = "", _ = x === "auto" && t && t !== 1 || x === !0;
  if (v && (f !== Ue || h !== Ue)) {
    var S = parseFloat(h) * bi, C = Math.sin(S), b = Math.cos(S), A;
    S = parseFloat(f) * bi, A = Math.cos(S), o = nr(y, o, C * A * -v), a = nr(y, a, -Math.sin(S) * -v), l = nr(y, l, b * A * -v + v);
  }
  g !== Ni && (w += "perspective(" + g + Ge), (r || n) && (w += "translate(" + r + "%, " + n + "%) "), (_ || o !== Ni || a !== Ni || l !== Ni) && (w += l !== Ni || _ ? "translate3d(" + o + ", " + a + ", " + l + ") " : "translate(" + o + ", " + a + Ge), c !== Ue && (w += "rotate(" + c + Ge), h !== Ue && (w += "rotateY(" + h + Ge), f !== Ue && (w += "rotateX(" + f + Ge), (d !== Ue || u !== Ue) && (w += "skew(" + d + ", " + u + Ge), (m !== 1 || p !== 1) && (w += "scale(" + m + ", " + p + Ge), y.style[rt] = w || "translate(0, 0)";
}, Rg = function(t, e) {
  var i = e || this, r = i.xPercent, n = i.yPercent, o = i.x, a = i.y, l = i.rotation, c = i.skewX, h = i.skewY, f = i.scaleX, d = i.scaleY, u = i.target, m = i.xOrigin, p = i.yOrigin, g = i.xOffset, x = i.yOffset, y = i.forceCSS, v = parseFloat(o), w = parseFloat(a), _, S, C, b, A;
  l = parseFloat(l), c = parseFloat(c), h = parseFloat(h), h && (h = parseFloat(h), c += h, l += h), l || c ? (l *= bi, c *= bi, _ = Math.cos(l) * f, S = Math.sin(l) * f, C = Math.sin(l - c) * -d, b = Math.cos(l - c) * d, c && (h *= bi, A = Math.tan(c - h), A = Math.sqrt(1 + A * A), C *= A, b *= A, h && (A = Math.tan(h), A = Math.sqrt(1 + A * A), _ *= A, S *= A)), _ = ht(_), S = ht(S), C = ht(C), b = ht(b)) : (_ = f, b = d, S = C = 0), (v && !~(o + "").indexOf("px") || w && !~(a + "").indexOf("px")) && (v = Oe(u, "x", o, "px"), w = Oe(u, "y", a, "px")), (m || p || g || x) && (v = ht(v + m - (m * _ + p * C) + g), w = ht(w + p - (m * S + p * b) + x)), (r || n) && (A = u.getBBox(), v = ht(v + r / 100 * A.width), w = ht(w + n / 100 * A.height)), A = "matrix(" + _ + "," + S + "," + C + "," + b + "," + v + "," + w + ")", u.setAttribute("transform", A), y && (u.style[rt] = A);
}, Fg = function(t, e, i, r, n) {
  var o = 360, a = vt(n), l = parseFloat(n) * (a && ~n.indexOf("rad") ? $e : 1), c = l - r, h = r + c + "deg", f, d;
  return a && (f = n.split("_")[1], f === "short" && (c %= o, c !== c % (o / 2) && (c += c < 0 ? o : -o)), f === "cw" && c < 0 ? c = (c + o * Wa) % o - ~~(c / o) * o : f === "ccw" && c > 0 && (c = (c - o * Wa) % o - ~~(c / o) * o)), t._pt = d = new Lt(t._pt, e, i, r, c, _g), d.e = h, d.u = "deg", t._props.push(i), d;
}, Xa = function(t, e) {
  for (var i in e)
    t[i] = e[i];
  return t;
}, Lg = function(t, e, i) {
  var r = Xa({}, i._gsap), n = "perspective,force3D,transformOrigin,svgOrigin", o = i.style, a, l, c, h, f, d, u, m;
  r.svg ? (c = i.getAttribute("transform"), i.setAttribute("transform", ""), o[rt] = e, a = gs(i, 1), ni(i, rt), i.setAttribute("transform", c)) : (c = getComputedStyle(i)[rt], o[rt] = e, a = gs(i, 1), o[rt] = c);
  for (l in Me)
    c = r[l], h = a[l], c !== h && n.indexOf(l) < 0 && (u = wt(c), m = wt(h), f = u !== m ? Oe(i, l, c, m) : parseFloat(c), d = parseFloat(h), t._pt = new Lt(t._pt, a, l, f, d - f, Vr), t._pt.u = m || 0, t._props.push(l));
  Xa(a, r);
};
Ft("padding,margin,Width,Radius", function(s, t) {
  var e = "Top", i = "Right", r = "Bottom", n = "Left", o = (t < 3 ? [e, i, r, n] : [e + n, e + i, r + i, r + n]).map(function(a) {
    return t < 2 ? s + a : "border" + a + s;
  });
  en[t > 1 ? "border" + s : s] = function(a, l, c, h, f) {
    var d, u;
    if (arguments.length < 4)
      return d = o.map(function(m) {
        return be(a, m, c);
      }), u = d.join(" "), u.split(d[0]).length === 5 ? d[0] : u;
    d = (h + "").split(" "), u = {}, o.forEach(function(m, p) {
      return u[m] = d[p] = d[p] || d[(p - 1) / 2 | 0];
    }), a.init(l, u, f);
  };
});
var Ac = {
  name: "css",
  register: Nr,
  targetTest: function(t) {
    return t.style && t.nodeType;
  },
  init: function(t, e, i, r, n) {
    var o = this._props, a = t.style, l = i.vars.startAt, c, h, f, d, u, m, p, g, x, y, v, w, _, S, C, b;
    So || Nr(), this.styles = this.styles || _c(t), b = this.styles.props, this.tween = i;
    for (p in e)
      if (p !== "autoRound" && (h = e[p], !(Wt[p] && oc(p, e, i, r, t, n)))) {
        if (u = typeof h, m = en[p], u === "function" && (h = h.call(i, r, t, n), u = typeof h), u === "string" && ~h.indexOf("random(") && (h = fs(h)), m)
          m(this, t, p, h, i) && (C = 1);
        else if (p.substr(0, 2) === "--")
          c = (getComputedStyle(t).getPropertyValue(p) + "").trim(), h += "", Fe.lastIndex = 0, Fe.test(c) || (g = wt(c), x = wt(h)), x ? g !== x && (c = Oe(t, p, c, x) + x) : g && (h += g), this.add(a, "setProperty", c, h, r, n, 0, 0, p), o.push(p), b.push(p, 0, a[p]);
        else if (u !== "undefined") {
          if (l && p in l ? (c = typeof l[p] == "function" ? l[p].call(i, r, t, n) : l[p], vt(c) && ~c.indexOf("random(") && (c = fs(c)), wt(c + "") || c === "auto" || (c += $t.units[p] || wt(be(t, p)) || ""), (c + "").charAt(1) === "=" && (c = be(t, p))) : c = be(t, p), d = parseFloat(c), y = u === "string" && h.charAt(1) === "=" && h.substr(0, 2), y && (h = h.substr(2)), f = parseFloat(h), p in de && (p === "autoAlpha" && (d === 1 && be(t, "visibility") === "hidden" && f && (d = 0), b.push("visibility", 0, a.visibility), Be(this, a, "visibility", d ? "inherit" : "hidden", f ? "inherit" : "hidden", !f)), p !== "scale" && p !== "transform" && (p = de[p], ~p.indexOf(",") && (p = p.split(",")[0]))), v = p in Me, v) {
            if (this.styles.save(p), w || (_ = t._gsap, _.renderTransform && !e.parseTransform || gs(t, e.parseTransform), S = e.smoothOrigin !== !1 && _.smooth, w = this._pt = new Lt(this._pt, a, rt, 0, 1, _.renderTransform, _, 0, -1), w.dep = 1), p === "scale")
              this._pt = new Lt(this._pt, _, "scaleY", _.scaleY, (y ? yi(_.scaleY, y + f) : f) - _.scaleY || 0, Vr), this._pt.u = 0, o.push("scaleY", p), p += "X";
            else if (p === "transformOrigin") {
              b.push(Ot, 0, a[Ot]), h = Eg(h), _.svg ? Hr(t, h, 0, S, 0, this) : (x = parseFloat(h.split(" ")[2]) || 0, x !== _.zOrigin && Be(this, _, "zOrigin", _.zOrigin, x), Be(this, a, p, sn(c), sn(h)));
              continue;
            } else if (p === "svgOrigin") {
              Hr(t, h, 1, S, 0, this);
              continue;
            } else if (p in bc) {
              Fg(this, _, p, d, y ? yi(d, y + h) : h);
              continue;
            } else if (p === "smoothOrigin") {
              Be(this, _, "smooth", _.smooth, h);
              continue;
            } else if (p === "force3D") {
              _[p] = h;
              continue;
            } else if (p === "transform") {
              Lg(this, h, t);
              continue;
            }
          } else p in a || (p = Ei(p) || p);
          if (v || (f || f === 0) && (d || d === 0) && !gg.test(h) && p in a)
            g = (c + "").substr((d + "").length), f || (f = 0), x = wt(h) || (p in $t.units ? $t.units[p] : g), g !== x && (d = Oe(t, p, c, x)), this._pt = new Lt(this._pt, v ? _ : a, p, d, (y ? yi(d, y + f) : f) - d, !v && (x === "px" || p === "zIndex") && e.autoRound !== !1 ? yg : Vr), this._pt.u = x || 0, g !== x && x !== "%" && (this._pt.b = c, this._pt.r = xg);
          else if (p in a)
            kg.call(this, t, p, c, y ? y + h : h);
          else if (p in t)
            this.add(t, p, c || t[p], y ? y + h : h, r, n);
          else if (p !== "parseTransform") {
            po(p, h);
            continue;
          }
          v || (p in a ? b.push(p, 0, a[p]) : b.push(p, 1, c || t[p])), o.push(p);
        }
      }
    C && fc(this);
  },
  render: function(t, e) {
    if (e.tween._time || !Ao())
      for (var i = e._pt; i; )
        i.r(t, i.d), i = i._next;
    else
      e.styles.revert();
  },
  get: be,
  aliases: de,
  getSetter: function(t, e, i) {
    var r = de[e];
    return r && r.indexOf(",") < 0 && (e = r), e in Me && e !== Ot && (t._gsap.x || be(t, "x")) ? i && Va === i ? e === "scale" ? Sg : wg : (Va = i || {}) && (e === "scale" ? Ag : Cg) : t.style && !co(t.style[e]) ? vg : ~e.indexOf("-") ? bg : bo(t, e);
  },
  core: {
    _removeProperty: ni,
    _getMatrix: Po
  }
};
Dt.utils.checkPrefix = Ei;
Dt.core.getStyleSaver = _c;
(function(s, t, e, i) {
  var r = Ft(s + "," + t + "," + e, function(n) {
    Me[n] = 1;
  });
  Ft(t, function(n) {
    $t.units[n] = "deg", bc[n] = 1;
  }), de[r[13]] = s + "," + t, Ft(i, function(n) {
    var o = n.split(":");
    de[o[1]] = r[o[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
Ft("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(s) {
  $t.units[s] = "px";
});
Dt.registerPlugin(Ac);
var Ki = Dt.registerPlugin(Ac) || Dt;
Ki.core.Tween;
class Li {
  constructor(t) {
    Gt(this, "_options");
    Gt(this, "_tween", null);
    this._options = t;
  }
  get options() {
    return this._options;
  }
  start(t) {
    return new Promise((e) => {
      this._tween = Ki.fromTo(t, this.options.from, {
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
  static initEngine() {
    Ki.ticker.remove(Ki.updateRoot);
  }
  static updateEngine(t) {
    this._rootTimeMs += t, Ki.updateRoot(this._rootTimeMs / 1e3);
  }
}
Gt(Li, "_rootTimeMs", 0);
var Cc = { exports: {} };
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
  (function(i, r) {
    s.exports = r();
  })(Ye, function() {
    return (
      /******/
      function(e) {
        var i = {};
        function r(n) {
          if (i[n])
            return i[n].exports;
          var o = i[n] = {
            /******/
            i: n,
            /******/
            l: !1,
            /******/
            exports: {}
            /******/
          };
          return e[n].call(o.exports, o, o.exports, r), o.l = !0, o.exports;
        }
        return r.m = e, r.c = i, r.d = function(n, o, a) {
          r.o(n, o) || Object.defineProperty(n, o, { enumerable: !0, get: a });
        }, r.r = function(n) {
          typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
        }, r.t = function(n, o) {
          if (o & 1 && (n = r(n)), o & 8 || o & 4 && typeof n == "object" && n && n.__esModule) return n;
          var a = /* @__PURE__ */ Object.create(null);
          if (r.r(a), Object.defineProperty(a, "default", { enumerable: !0, value: n }), o & 2 && typeof n != "string") for (var l in n) r.d(a, l, (function(c) {
            return n[c];
          }).bind(null, l));
          return a;
        }, r.n = function(n) {
          var o = n && n.__esModule ? (
            /******/
            function() {
              return n.default;
            }
          ) : (
            /******/
            function() {
              return n;
            }
          );
          return r.d(o, "a", o), o;
        }, r.o = function(n, o) {
          return Object.prototype.hasOwnProperty.call(n, o);
        }, r.p = "", r(r.s = 20);
      }([
        /* 0 */
        /***/
        function(e, i) {
          var r = {};
          e.exports = r, function() {
            r._baseDelta = 1e3 / 60, r._nextId = 0, r._seed = 0, r._nowStartTime = +/* @__PURE__ */ new Date(), r._warnedOnce = {}, r._decomp = null, r.extend = function(o, a) {
              var l, c;
              typeof a == "boolean" ? (l = 2, c = a) : (l = 1, c = !0);
              for (var h = l; h < arguments.length; h++) {
                var f = arguments[h];
                if (f)
                  for (var d in f)
                    c && f[d] && f[d].constructor === Object && (!o[d] || o[d].constructor === Object) ? (o[d] = o[d] || {}, r.extend(o[d], c, f[d])) : o[d] = f[d];
              }
              return o;
            }, r.clone = function(o, a) {
              return r.extend({}, a, o);
            }, r.keys = function(o) {
              if (Object.keys)
                return Object.keys(o);
              var a = [];
              for (var l in o)
                a.push(l);
              return a;
            }, r.values = function(o) {
              var a = [];
              if (Object.keys) {
                for (var l = Object.keys(o), c = 0; c < l.length; c++)
                  a.push(o[l[c]]);
                return a;
              }
              for (var h in o)
                a.push(o[h]);
              return a;
            }, r.get = function(o, a, l, c) {
              a = a.split(".").slice(l, c);
              for (var h = 0; h < a.length; h += 1)
                o = o[a[h]];
              return o;
            }, r.set = function(o, a, l, c, h) {
              var f = a.split(".").slice(c, h);
              return r.get(o, a, 0, -1)[f[f.length - 1]] = l, l;
            }, r.shuffle = function(o) {
              for (var a = o.length - 1; a > 0; a--) {
                var l = Math.floor(r.random() * (a + 1)), c = o[a];
                o[a] = o[l], o[l] = c;
              }
              return o;
            }, r.choose = function(o) {
              return o[Math.floor(r.random() * o.length)];
            }, r.isElement = function(o) {
              return typeof HTMLElement < "u" ? o instanceof HTMLElement : !!(o && o.nodeType && o.nodeName);
            }, r.isArray = function(o) {
              return Object.prototype.toString.call(o) === "[object Array]";
            }, r.isFunction = function(o) {
              return typeof o == "function";
            }, r.isPlainObject = function(o) {
              return typeof o == "object" && o.constructor === Object;
            }, r.isString = function(o) {
              return toString.call(o) === "[object String]";
            }, r.clamp = function(o, a, l) {
              return o < a ? a : o > l ? l : o;
            }, r.sign = function(o) {
              return o < 0 ? -1 : 1;
            }, r.now = function() {
              if (typeof window < "u" && window.performance) {
                if (window.performance.now)
                  return window.performance.now();
                if (window.performance.webkitNow)
                  return window.performance.webkitNow();
              }
              return Date.now ? Date.now() : /* @__PURE__ */ new Date() - r._nowStartTime;
            }, r.random = function(o, a) {
              return o = typeof o < "u" ? o : 0, a = typeof a < "u" ? a : 1, o + n() * (a - o);
            };
            var n = function() {
              return r._seed = (r._seed * 9301 + 49297) % 233280, r._seed / 233280;
            };
            r.colorToNumber = function(o) {
              return o = o.replace("#", ""), o.length == 3 && (o = o.charAt(0) + o.charAt(0) + o.charAt(1) + o.charAt(1) + o.charAt(2) + o.charAt(2)), parseInt(o, 16);
            }, r.logLevel = 1, r.log = function() {
              console && r.logLevel > 0 && r.logLevel <= 3 && console.log.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, r.info = function() {
              console && r.logLevel > 0 && r.logLevel <= 2 && console.info.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, r.warn = function() {
              console && r.logLevel > 0 && r.logLevel <= 3 && console.warn.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, r.warnOnce = function() {
              var o = Array.prototype.slice.call(arguments).join(" ");
              r._warnedOnce[o] || (r.warn(o), r._warnedOnce[o] = !0);
            }, r.deprecated = function(o, a, l) {
              o[a] = r.chain(function() {
                r.warnOnce("🔅 deprecated 🔅", l);
              }, o[a]);
            }, r.nextId = function() {
              return r._nextId++;
            }, r.indexOf = function(o, a) {
              if (o.indexOf)
                return o.indexOf(a);
              for (var l = 0; l < o.length; l++)
                if (o[l] === a)
                  return l;
              return -1;
            }, r.map = function(o, a) {
              if (o.map)
                return o.map(a);
              for (var l = [], c = 0; c < o.length; c += 1)
                l.push(a(o[c]));
              return l;
            }, r.topologicalSort = function(o) {
              var a = [], l = [], c = [];
              for (var h in o)
                !l[h] && !c[h] && r._topologicalSort(h, l, c, o, a);
              return a;
            }, r._topologicalSort = function(o, a, l, c, h) {
              var f = c[o] || [];
              l[o] = !0;
              for (var d = 0; d < f.length; d += 1) {
                var u = f[d];
                l[u] || a[u] || r._topologicalSort(u, a, l, c, h);
              }
              l[o] = !1, a[o] = !0, h.push(o);
            }, r.chain = function() {
              for (var o = [], a = 0; a < arguments.length; a += 1) {
                var l = arguments[a];
                l._chained ? o.push.apply(o, l._chained) : o.push(l);
              }
              var c = function() {
                for (var h, f = new Array(arguments.length), d = 0, u = arguments.length; d < u; d++)
                  f[d] = arguments[d];
                for (d = 0; d < o.length; d += 1) {
                  var m = o[d].apply(h, f);
                  typeof m < "u" && (h = m);
                }
                return h;
              };
              return c._chained = o, c;
            }, r.chainPathBefore = function(o, a, l) {
              return r.set(o, a, r.chain(
                l,
                r.get(o, a)
              ));
            }, r.chainPathAfter = function(o, a, l) {
              return r.set(o, a, r.chain(
                r.get(o, a),
                l
              ));
            }, r.setDecomp = function(o) {
              r._decomp = o;
            }, r.getDecomp = function() {
              var o = r._decomp;
              try {
                !o && typeof window < "u" && (o = window.decomp), !o && typeof Ye < "u" && (o = Ye.decomp);
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
          var r = {};
          e.exports = r, function() {
            r.create = function(n) {
              var o = {
                min: { x: 0, y: 0 },
                max: { x: 0, y: 0 }
              };
              return n && r.update(o, n), o;
            }, r.update = function(n, o, a) {
              n.min.x = 1 / 0, n.max.x = -1 / 0, n.min.y = 1 / 0, n.max.y = -1 / 0;
              for (var l = 0; l < o.length; l++) {
                var c = o[l];
                c.x > n.max.x && (n.max.x = c.x), c.x < n.min.x && (n.min.x = c.x), c.y > n.max.y && (n.max.y = c.y), c.y < n.min.y && (n.min.y = c.y);
              }
              a && (a.x > 0 ? n.max.x += a.x : n.min.x += a.x, a.y > 0 ? n.max.y += a.y : n.min.y += a.y);
            }, r.contains = function(n, o) {
              return o.x >= n.min.x && o.x <= n.max.x && o.y >= n.min.y && o.y <= n.max.y;
            }, r.overlaps = function(n, o) {
              return n.min.x <= o.max.x && n.max.x >= o.min.x && n.max.y >= o.min.y && n.min.y <= o.max.y;
            }, r.translate = function(n, o) {
              n.min.x += o.x, n.max.x += o.x, n.min.y += o.y, n.max.y += o.y;
            }, r.shift = function(n, o) {
              var a = n.max.x - n.min.x, l = n.max.y - n.min.y;
              n.min.x = o.x, n.max.x = o.x + a, n.min.y = o.y, n.max.y = o.y + l;
            };
          }();
        },
        /* 2 */
        /***/
        function(e, i) {
          var r = {};
          e.exports = r, function() {
            r.create = function(n, o) {
              return { x: n || 0, y: o || 0 };
            }, r.clone = function(n) {
              return { x: n.x, y: n.y };
            }, r.magnitude = function(n) {
              return Math.sqrt(n.x * n.x + n.y * n.y);
            }, r.magnitudeSquared = function(n) {
              return n.x * n.x + n.y * n.y;
            }, r.rotate = function(n, o, a) {
              var l = Math.cos(o), c = Math.sin(o);
              a || (a = {});
              var h = n.x * l - n.y * c;
              return a.y = n.x * c + n.y * l, a.x = h, a;
            }, r.rotateAbout = function(n, o, a, l) {
              var c = Math.cos(o), h = Math.sin(o);
              l || (l = {});
              var f = a.x + ((n.x - a.x) * c - (n.y - a.y) * h);
              return l.y = a.y + ((n.x - a.x) * h + (n.y - a.y) * c), l.x = f, l;
            }, r.normalise = function(n) {
              var o = r.magnitude(n);
              return o === 0 ? { x: 0, y: 0 } : { x: n.x / o, y: n.y / o };
            }, r.dot = function(n, o) {
              return n.x * o.x + n.y * o.y;
            }, r.cross = function(n, o) {
              return n.x * o.y - n.y * o.x;
            }, r.cross3 = function(n, o, a) {
              return (o.x - n.x) * (a.y - n.y) - (o.y - n.y) * (a.x - n.x);
            }, r.add = function(n, o, a) {
              return a || (a = {}), a.x = n.x + o.x, a.y = n.y + o.y, a;
            }, r.sub = function(n, o, a) {
              return a || (a = {}), a.x = n.x - o.x, a.y = n.y - o.y, a;
            }, r.mult = function(n, o) {
              return { x: n.x * o, y: n.y * o };
            }, r.div = function(n, o) {
              return { x: n.x / o, y: n.y / o };
            }, r.perp = function(n, o) {
              return o = o === !0 ? -1 : 1, { x: o * -n.y, y: o * n.x };
            }, r.neg = function(n) {
              return { x: -n.x, y: -n.y };
            }, r.angle = function(n, o) {
              return Math.atan2(o.y - n.y, o.x - n.x);
            }, r._temp = [
              r.create(),
              r.create(),
              r.create(),
              r.create(),
              r.create(),
              r.create()
            ];
          }();
        },
        /* 3 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(2), a = r(0);
          (function() {
            n.create = function(l, c) {
              for (var h = [], f = 0; f < l.length; f++) {
                var d = l[f], u = {
                  x: d.x,
                  y: d.y,
                  index: f,
                  body: c,
                  isInternal: !1
                };
                h.push(u);
              }
              return h;
            }, n.fromPath = function(l, c) {
              var h = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/ig, f = [];
              return l.replace(h, function(d, u, m) {
                f.push({ x: parseFloat(u), y: parseFloat(m) });
              }), n.create(f, c);
            }, n.centre = function(l) {
              for (var c = n.area(l, !0), h = { x: 0, y: 0 }, f, d, u, m = 0; m < l.length; m++)
                u = (m + 1) % l.length, f = o.cross(l[m], l[u]), d = o.mult(o.add(l[m], l[u]), f), h = o.add(h, d);
              return o.div(h, 6 * c);
            }, n.mean = function(l) {
              for (var c = { x: 0, y: 0 }, h = 0; h < l.length; h++)
                c.x += l[h].x, c.y += l[h].y;
              return o.div(c, l.length);
            }, n.area = function(l, c) {
              for (var h = 0, f = l.length - 1, d = 0; d < l.length; d++)
                h += (l[f].x - l[d].x) * (l[f].y + l[d].y), f = d;
              return c ? h / 2 : Math.abs(h) / 2;
            }, n.inertia = function(l, c) {
              for (var h = 0, f = 0, d = l, u, m, p = 0; p < d.length; p++)
                m = (p + 1) % d.length, u = Math.abs(o.cross(d[m], d[p])), h += u * (o.dot(d[m], d[m]) + o.dot(d[m], d[p]) + o.dot(d[p], d[p])), f += u;
              return c / 6 * (h / f);
            }, n.translate = function(l, c, h) {
              h = typeof h < "u" ? h : 1;
              var f = l.length, d = c.x * h, u = c.y * h, m;
              for (m = 0; m < f; m++)
                l[m].x += d, l[m].y += u;
              return l;
            }, n.rotate = function(l, c, h) {
              if (c !== 0) {
                var f = Math.cos(c), d = Math.sin(c), u = h.x, m = h.y, p = l.length, g, x, y, v;
                for (v = 0; v < p; v++)
                  g = l[v], x = g.x - u, y = g.y - m, g.x = u + (x * f - y * d), g.y = m + (x * d + y * f);
                return l;
              }
            }, n.contains = function(l, c) {
              for (var h = c.x, f = c.y, d = l.length, u = l[d - 1], m, p = 0; p < d; p++) {
                if (m = l[p], (h - u.x) * (m.y - u.y) + (f - u.y) * (u.x - m.x) > 0)
                  return !1;
                u = m;
              }
              return !0;
            }, n.scale = function(l, c, h, f) {
              if (c === 1 && h === 1)
                return l;
              f = f || n.centre(l);
              for (var d, u, m = 0; m < l.length; m++)
                d = l[m], u = o.sub(d, f), l[m].x = f.x + u.x * c, l[m].y = f.y + u.y * h;
              return l;
            }, n.chamfer = function(l, c, h, f, d) {
              typeof c == "number" ? c = [c] : c = c || [8], h = typeof h < "u" ? h : -1, f = f || 2, d = d || 14;
              for (var u = [], m = 0; m < l.length; m++) {
                var p = l[m - 1 >= 0 ? m - 1 : l.length - 1], g = l[m], x = l[(m + 1) % l.length], y = c[m < c.length ? m : c.length - 1];
                if (y === 0) {
                  u.push(g);
                  continue;
                }
                var v = o.normalise({
                  x: g.y - p.y,
                  y: p.x - g.x
                }), w = o.normalise({
                  x: x.y - g.y,
                  y: g.x - x.x
                }), _ = Math.sqrt(2 * Math.pow(y, 2)), S = o.mult(a.clone(v), y), C = o.normalise(o.mult(o.add(v, w), 0.5)), b = o.sub(g, o.mult(C, _)), A = h;
                h === -1 && (A = Math.pow(y, 0.32) * 1.75), A = a.clamp(A, f, d), A % 2 === 1 && (A += 1);
                for (var P = Math.acos(o.dot(v, w)), M = P / A, T = 0; T < A; T++)
                  u.push(o.add(o.rotate(S, M * T), b));
              }
              return u;
            }, n.clockwiseSort = function(l) {
              var c = n.mean(l);
              return l.sort(function(h, f) {
                return o.angle(c, h) - o.angle(c, f);
              }), l;
            }, n.isConvex = function(l) {
              var c = 0, h = l.length, f, d, u, m;
              if (h < 3)
                return null;
              for (f = 0; f < h; f++)
                if (d = (f + 1) % h, u = (f + 2) % h, m = (l[d].x - l[f].x) * (l[u].y - l[d].y), m -= (l[d].y - l[f].y) * (l[u].x - l[d].x), m < 0 ? c |= 1 : m > 0 && (c |= 2), c === 3)
                  return !1;
              return c !== 0 ? !0 : null;
            }, n.hull = function(l) {
              var c = [], h = [], f, d;
              for (l = l.slice(0), l.sort(function(u, m) {
                var p = u.x - m.x;
                return p !== 0 ? p : u.y - m.y;
              }), d = 0; d < l.length; d += 1) {
                for (f = l[d]; h.length >= 2 && o.cross3(h[h.length - 2], h[h.length - 1], f) <= 0; )
                  h.pop();
                h.push(f);
              }
              for (d = l.length - 1; d >= 0; d -= 1) {
                for (f = l[d]; c.length >= 2 && o.cross3(c[c.length - 2], c[c.length - 1], f) <= 0; )
                  c.pop();
                c.push(f);
              }
              return c.pop(), h.pop(), c.concat(h);
            };
          })();
        },
        /* 4 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(3), a = r(2), l = r(7), c = r(0), h = r(1), f = r(11);
          (function() {
            n._timeCorrection = !0, n._inertiaScale = 4, n._nextCollidingGroupId = 1, n._nextNonCollidingGroupId = -1, n._nextCategory = 1, n._baseDelta = 1e3 / 60, n.create = function(u) {
              var m = {
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
              }, p = c.extend(m, u);
              return d(p, u), p;
            }, n.nextGroup = function(u) {
              return u ? n._nextNonCollidingGroupId-- : n._nextCollidingGroupId++;
            }, n.nextCategory = function() {
              return n._nextCategory = n._nextCategory << 1, n._nextCategory;
            };
            var d = function(u, m) {
              m = m || {}, n.set(u, {
                bounds: u.bounds || h.create(u.vertices),
                positionPrev: u.positionPrev || a.clone(u.position),
                anglePrev: u.anglePrev || u.angle,
                vertices: u.vertices,
                parts: u.parts || [u],
                isStatic: u.isStatic,
                isSleeping: u.isSleeping,
                parent: u.parent || u
              }), o.rotate(u.vertices, u.angle, u.position), f.rotate(u.axes, u.angle), h.update(u.bounds, u.vertices, u.velocity), n.set(u, {
                axes: m.axes || u.axes,
                area: m.area || u.area,
                mass: m.mass || u.mass,
                inertia: m.inertia || u.inertia
              });
              var p = u.isStatic ? "#14151f" : c.choose(["#f19648", "#f5d259", "#f55a3c", "#063e7b", "#ececd1"]), g = u.isStatic ? "#555" : "#ccc", x = u.isStatic && u.render.fillStyle === null ? 1 : 0;
              u.render.fillStyle = u.render.fillStyle || p, u.render.strokeStyle = u.render.strokeStyle || g, u.render.lineWidth = u.render.lineWidth || x, u.render.sprite.xOffset += -(u.bounds.min.x - u.position.x) / (u.bounds.max.x - u.bounds.min.x), u.render.sprite.yOffset += -(u.bounds.min.y - u.position.y) / (u.bounds.max.y - u.bounds.min.y);
            };
            n.set = function(u, m, p) {
              var g;
              typeof m == "string" && (g = m, m = {}, m[g] = p);
              for (g in m)
                if (Object.prototype.hasOwnProperty.call(m, g))
                  switch (p = m[g], g) {
                    case "isStatic":
                      n.setStatic(u, p);
                      break;
                    case "isSleeping":
                      l.set(u, p);
                      break;
                    case "mass":
                      n.setMass(u, p);
                      break;
                    case "density":
                      n.setDensity(u, p);
                      break;
                    case "inertia":
                      n.setInertia(u, p);
                      break;
                    case "vertices":
                      n.setVertices(u, p);
                      break;
                    case "position":
                      n.setPosition(u, p);
                      break;
                    case "angle":
                      n.setAngle(u, p);
                      break;
                    case "velocity":
                      n.setVelocity(u, p);
                      break;
                    case "angularVelocity":
                      n.setAngularVelocity(u, p);
                      break;
                    case "speed":
                      n.setSpeed(u, p);
                      break;
                    case "angularSpeed":
                      n.setAngularSpeed(u, p);
                      break;
                    case "parts":
                      n.setParts(u, p);
                      break;
                    case "centre":
                      n.setCentre(u, p);
                      break;
                    default:
                      u[g] = p;
                  }
            }, n.setStatic = function(u, m) {
              for (var p = 0; p < u.parts.length; p++) {
                var g = u.parts[p];
                m ? (g.isStatic || (g._original = {
                  restitution: g.restitution,
                  friction: g.friction,
                  mass: g.mass,
                  inertia: g.inertia,
                  density: g.density,
                  inverseMass: g.inverseMass,
                  inverseInertia: g.inverseInertia
                }), g.restitution = 0, g.friction = 1, g.mass = g.inertia = g.density = 1 / 0, g.inverseMass = g.inverseInertia = 0, g.positionPrev.x = g.position.x, g.positionPrev.y = g.position.y, g.anglePrev = g.angle, g.angularVelocity = 0, g.speed = 0, g.angularSpeed = 0, g.motion = 0) : g._original && (g.restitution = g._original.restitution, g.friction = g._original.friction, g.mass = g._original.mass, g.inertia = g._original.inertia, g.density = g._original.density, g.inverseMass = g._original.inverseMass, g.inverseInertia = g._original.inverseInertia, g._original = null), g.isStatic = m;
              }
            }, n.setMass = function(u, m) {
              var p = u.inertia / (u.mass / 6);
              u.inertia = p * (m / 6), u.inverseInertia = 1 / u.inertia, u.mass = m, u.inverseMass = 1 / u.mass, u.density = u.mass / u.area;
            }, n.setDensity = function(u, m) {
              n.setMass(u, m * u.area), u.density = m;
            }, n.setInertia = function(u, m) {
              u.inertia = m, u.inverseInertia = 1 / u.inertia;
            }, n.setVertices = function(u, m) {
              m[0].body === u ? u.vertices = m : u.vertices = o.create(m, u), u.axes = f.fromVertices(u.vertices), u.area = o.area(u.vertices), n.setMass(u, u.density * u.area);
              var p = o.centre(u.vertices);
              o.translate(u.vertices, p, -1), n.setInertia(u, n._inertiaScale * o.inertia(u.vertices, u.mass)), o.translate(u.vertices, u.position), h.update(u.bounds, u.vertices, u.velocity);
            }, n.setParts = function(u, m, p) {
              var g;
              for (m = m.slice(0), u.parts.length = 0, u.parts.push(u), u.parent = u, g = 0; g < m.length; g++) {
                var x = m[g];
                x !== u && (x.parent = u, u.parts.push(x));
              }
              if (u.parts.length !== 1) {
                if (p = typeof p < "u" ? p : !0, p) {
                  var y = [];
                  for (g = 0; g < m.length; g++)
                    y = y.concat(m[g].vertices);
                  o.clockwiseSort(y);
                  var v = o.hull(y), w = o.centre(v);
                  n.setVertices(u, v), o.translate(u.vertices, w);
                }
                var _ = n._totalProperties(u);
                u.area = _.area, u.parent = u, u.position.x = _.centre.x, u.position.y = _.centre.y, u.positionPrev.x = _.centre.x, u.positionPrev.y = _.centre.y, n.setMass(u, _.mass), n.setInertia(u, _.inertia), n.setPosition(u, _.centre);
              }
            }, n.setCentre = function(u, m, p) {
              p ? (u.positionPrev.x += m.x, u.positionPrev.y += m.y, u.position.x += m.x, u.position.y += m.y) : (u.positionPrev.x = m.x - (u.position.x - u.positionPrev.x), u.positionPrev.y = m.y - (u.position.y - u.positionPrev.y), u.position.x = m.x, u.position.y = m.y);
            }, n.setPosition = function(u, m, p) {
              var g = a.sub(m, u.position);
              p ? (u.positionPrev.x = u.position.x, u.positionPrev.y = u.position.y, u.velocity.x = g.x, u.velocity.y = g.y, u.speed = a.magnitude(g)) : (u.positionPrev.x += g.x, u.positionPrev.y += g.y);
              for (var x = 0; x < u.parts.length; x++) {
                var y = u.parts[x];
                y.position.x += g.x, y.position.y += g.y, o.translate(y.vertices, g), h.update(y.bounds, y.vertices, u.velocity);
              }
            }, n.setAngle = function(u, m, p) {
              var g = m - u.angle;
              p ? (u.anglePrev = u.angle, u.angularVelocity = g, u.angularSpeed = Math.abs(g)) : u.anglePrev += g;
              for (var x = 0; x < u.parts.length; x++) {
                var y = u.parts[x];
                y.angle += g, o.rotate(y.vertices, g, u.position), f.rotate(y.axes, g), h.update(y.bounds, y.vertices, u.velocity), x > 0 && a.rotateAbout(y.position, g, u.position, y.position);
              }
            }, n.setVelocity = function(u, m) {
              var p = u.deltaTime / n._baseDelta;
              u.positionPrev.x = u.position.x - m.x * p, u.positionPrev.y = u.position.y - m.y * p, u.velocity.x = (u.position.x - u.positionPrev.x) / p, u.velocity.y = (u.position.y - u.positionPrev.y) / p, u.speed = a.magnitude(u.velocity);
            }, n.getVelocity = function(u) {
              var m = n._baseDelta / u.deltaTime;
              return {
                x: (u.position.x - u.positionPrev.x) * m,
                y: (u.position.y - u.positionPrev.y) * m
              };
            }, n.getSpeed = function(u) {
              return a.magnitude(n.getVelocity(u));
            }, n.setSpeed = function(u, m) {
              n.setVelocity(u, a.mult(a.normalise(n.getVelocity(u)), m));
            }, n.setAngularVelocity = function(u, m) {
              var p = u.deltaTime / n._baseDelta;
              u.anglePrev = u.angle - m * p, u.angularVelocity = (u.angle - u.anglePrev) / p, u.angularSpeed = Math.abs(u.angularVelocity);
            }, n.getAngularVelocity = function(u) {
              return (u.angle - u.anglePrev) * n._baseDelta / u.deltaTime;
            }, n.getAngularSpeed = function(u) {
              return Math.abs(n.getAngularVelocity(u));
            }, n.setAngularSpeed = function(u, m) {
              n.setAngularVelocity(u, c.sign(n.getAngularVelocity(u)) * m);
            }, n.translate = function(u, m, p) {
              n.setPosition(u, a.add(u.position, m), p);
            }, n.rotate = function(u, m, p, g) {
              if (!p)
                n.setAngle(u, u.angle + m, g);
              else {
                var x = Math.cos(m), y = Math.sin(m), v = u.position.x - p.x, w = u.position.y - p.y;
                n.setPosition(u, {
                  x: p.x + (v * x - w * y),
                  y: p.y + (v * y + w * x)
                }, g), n.setAngle(u, u.angle + m, g);
              }
            }, n.scale = function(u, m, p, g) {
              var x = 0, y = 0;
              g = g || u.position;
              for (var v = 0; v < u.parts.length; v++) {
                var w = u.parts[v];
                o.scale(w.vertices, m, p, g), w.axes = f.fromVertices(w.vertices), w.area = o.area(w.vertices), n.setMass(w, u.density * w.area), o.translate(w.vertices, { x: -w.position.x, y: -w.position.y }), n.setInertia(w, n._inertiaScale * o.inertia(w.vertices, w.mass)), o.translate(w.vertices, { x: w.position.x, y: w.position.y }), v > 0 && (x += w.area, y += w.inertia), w.position.x = g.x + (w.position.x - g.x) * m, w.position.y = g.y + (w.position.y - g.y) * p, h.update(w.bounds, w.vertices, u.velocity);
              }
              u.parts.length > 1 && (u.area = x, u.isStatic || (n.setMass(u, u.density * x), n.setInertia(u, y))), u.circleRadius && (m === p ? u.circleRadius *= m : u.circleRadius = null);
            }, n.update = function(u, m) {
              m = (typeof m < "u" ? m : 1e3 / 60) * u.timeScale;
              var p = m * m, g = n._timeCorrection ? m / (u.deltaTime || m) : 1, x = 1 - u.frictionAir * (m / c._baseDelta), y = (u.position.x - u.positionPrev.x) * g, v = (u.position.y - u.positionPrev.y) * g;
              u.velocity.x = y * x + u.force.x / u.mass * p, u.velocity.y = v * x + u.force.y / u.mass * p, u.positionPrev.x = u.position.x, u.positionPrev.y = u.position.y, u.position.x += u.velocity.x, u.position.y += u.velocity.y, u.deltaTime = m, u.angularVelocity = (u.angle - u.anglePrev) * x * g + u.torque / u.inertia * p, u.anglePrev = u.angle, u.angle += u.angularVelocity;
              for (var w = 0; w < u.parts.length; w++) {
                var _ = u.parts[w];
                o.translate(_.vertices, u.velocity), w > 0 && (_.position.x += u.velocity.x, _.position.y += u.velocity.y), u.angularVelocity !== 0 && (o.rotate(_.vertices, u.angularVelocity, u.position), f.rotate(_.axes, u.angularVelocity), w > 0 && a.rotateAbout(_.position, u.angularVelocity, u.position, _.position)), h.update(_.bounds, _.vertices, u.velocity);
              }
            }, n.updateVelocities = function(u) {
              var m = n._baseDelta / u.deltaTime, p = u.velocity;
              p.x = (u.position.x - u.positionPrev.x) * m, p.y = (u.position.y - u.positionPrev.y) * m, u.speed = Math.sqrt(p.x * p.x + p.y * p.y), u.angularVelocity = (u.angle - u.anglePrev) * m, u.angularSpeed = Math.abs(u.angularVelocity);
            }, n.applyForce = function(u, m, p) {
              var g = { x: m.x - u.position.x, y: m.y - u.position.y };
              u.force.x += p.x, u.force.y += p.y, u.torque += g.x * p.y - g.y * p.x;
            }, n._totalProperties = function(u) {
              for (var m = {
                mass: 0,
                area: 0,
                inertia: 0,
                centre: { x: 0, y: 0 }
              }, p = u.parts.length === 1 ? 0 : 1; p < u.parts.length; p++) {
                var g = u.parts[p], x = g.mass !== 1 / 0 ? g.mass : 1;
                m.mass += x, m.area += g.area, m.inertia += g.inertia, m.centre = a.add(m.centre, a.mult(g.position, x));
              }
              return m.centre = a.div(m.centre, m.mass), m;
            };
          })();
        },
        /* 5 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(0);
          (function() {
            n.on = function(a, l, c) {
              for (var h = l.split(" "), f, d = 0; d < h.length; d++)
                f = h[d], a.events = a.events || {}, a.events[f] = a.events[f] || [], a.events[f].push(c);
              return c;
            }, n.off = function(a, l, c) {
              if (!l) {
                a.events = {};
                return;
              }
              typeof l == "function" && (c = l, l = o.keys(a.events).join(" "));
              for (var h = l.split(" "), f = 0; f < h.length; f++) {
                var d = a.events[h[f]], u = [];
                if (c && d)
                  for (var m = 0; m < d.length; m++)
                    d[m] !== c && u.push(d[m]);
                a.events[h[f]] = u;
              }
            }, n.trigger = function(a, l, c) {
              var h, f, d, u, m = a.events;
              if (m && o.keys(m).length > 0) {
                c || (c = {}), h = l.split(" ");
                for (var p = 0; p < h.length; p++)
                  if (f = h[p], d = m[f], d) {
                    u = o.clone(c, !1), u.name = f, u.source = a;
                    for (var g = 0; g < d.length; g++)
                      d[g].apply(a, [u]);
                  }
              }
            };
          })();
        },
        /* 6 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(5), a = r(0), l = r(1), c = r(4);
          (function() {
            n.create = function(h) {
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
              }, h);
            }, n.setModified = function(h, f, d, u) {
              if (h.isModified = f, f && h.cache && (h.cache.allBodies = null, h.cache.allConstraints = null, h.cache.allComposites = null), d && h.parent && n.setModified(h.parent, f, d, u), u)
                for (var m = 0; m < h.composites.length; m++) {
                  var p = h.composites[m];
                  n.setModified(p, f, d, u);
                }
            }, n.add = function(h, f) {
              var d = [].concat(f);
              o.trigger(h, "beforeAdd", { object: f });
              for (var u = 0; u < d.length; u++) {
                var m = d[u];
                switch (m.type) {
                  case "body":
                    if (m.parent !== m) {
                      a.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");
                      break;
                    }
                    n.addBody(h, m);
                    break;
                  case "constraint":
                    n.addConstraint(h, m);
                    break;
                  case "composite":
                    n.addComposite(h, m);
                    break;
                  case "mouseConstraint":
                    n.addConstraint(h, m.constraint);
                    break;
                }
              }
              return o.trigger(h, "afterAdd", { object: f }), h;
            }, n.remove = function(h, f, d) {
              var u = [].concat(f);
              o.trigger(h, "beforeRemove", { object: f });
              for (var m = 0; m < u.length; m++) {
                var p = u[m];
                switch (p.type) {
                  case "body":
                    n.removeBody(h, p, d);
                    break;
                  case "constraint":
                    n.removeConstraint(h, p, d);
                    break;
                  case "composite":
                    n.removeComposite(h, p, d);
                    break;
                  case "mouseConstraint":
                    n.removeConstraint(h, p.constraint);
                    break;
                }
              }
              return o.trigger(h, "afterRemove", { object: f }), h;
            }, n.addComposite = function(h, f) {
              return h.composites.push(f), f.parent = h, n.setModified(h, !0, !0, !1), h;
            }, n.removeComposite = function(h, f, d) {
              var u = a.indexOf(h.composites, f);
              if (u !== -1) {
                var m = n.allBodies(f);
                n.removeCompositeAt(h, u);
                for (var p = 0; p < m.length; p++)
                  m[p].sleepCounter = 0;
              }
              if (d)
                for (var p = 0; p < h.composites.length; p++)
                  n.removeComposite(h.composites[p], f, !0);
              return h;
            }, n.removeCompositeAt = function(h, f) {
              return h.composites.splice(f, 1), n.setModified(h, !0, !0, !1), h;
            }, n.addBody = function(h, f) {
              return h.bodies.push(f), n.setModified(h, !0, !0, !1), h;
            }, n.removeBody = function(h, f, d) {
              var u = a.indexOf(h.bodies, f);
              if (u !== -1 && (n.removeBodyAt(h, u), f.sleepCounter = 0), d)
                for (var m = 0; m < h.composites.length; m++)
                  n.removeBody(h.composites[m], f, !0);
              return h;
            }, n.removeBodyAt = function(h, f) {
              return h.bodies.splice(f, 1), n.setModified(h, !0, !0, !1), h;
            }, n.addConstraint = function(h, f) {
              return h.constraints.push(f), n.setModified(h, !0, !0, !1), h;
            }, n.removeConstraint = function(h, f, d) {
              var u = a.indexOf(h.constraints, f);
              if (u !== -1 && n.removeConstraintAt(h, u), d)
                for (var m = 0; m < h.composites.length; m++)
                  n.removeConstraint(h.composites[m], f, !0);
              return h;
            }, n.removeConstraintAt = function(h, f) {
              return h.constraints.splice(f, 1), n.setModified(h, !0, !0, !1), h;
            }, n.clear = function(h, f, d) {
              if (d)
                for (var u = 0; u < h.composites.length; u++)
                  n.clear(h.composites[u], f, !0);
              return f ? h.bodies = h.bodies.filter(function(m) {
                return m.isStatic;
              }) : h.bodies.length = 0, h.constraints.length = 0, h.composites.length = 0, n.setModified(h, !0, !0, !1), h;
            }, n.allBodies = function(h) {
              if (h.cache && h.cache.allBodies)
                return h.cache.allBodies;
              for (var f = [].concat(h.bodies), d = 0; d < h.composites.length; d++)
                f = f.concat(n.allBodies(h.composites[d]));
              return h.cache && (h.cache.allBodies = f), f;
            }, n.allConstraints = function(h) {
              if (h.cache && h.cache.allConstraints)
                return h.cache.allConstraints;
              for (var f = [].concat(h.constraints), d = 0; d < h.composites.length; d++)
                f = f.concat(n.allConstraints(h.composites[d]));
              return h.cache && (h.cache.allConstraints = f), f;
            }, n.allComposites = function(h) {
              if (h.cache && h.cache.allComposites)
                return h.cache.allComposites;
              for (var f = [].concat(h.composites), d = 0; d < h.composites.length; d++)
                f = f.concat(n.allComposites(h.composites[d]));
              return h.cache && (h.cache.allComposites = f), f;
            }, n.get = function(h, f, d) {
              var u, m;
              switch (d) {
                case "body":
                  u = n.allBodies(h);
                  break;
                case "constraint":
                  u = n.allConstraints(h);
                  break;
                case "composite":
                  u = n.allComposites(h).concat(h);
                  break;
              }
              return u ? (m = u.filter(function(p) {
                return p.id.toString() === f.toString();
              }), m.length === 0 ? null : m[0]) : null;
            }, n.move = function(h, f, d) {
              return n.remove(h, f), n.add(d, f), h;
            }, n.rebase = function(h) {
              for (var f = n.allBodies(h).concat(n.allConstraints(h)).concat(n.allComposites(h)), d = 0; d < f.length; d++)
                f[d].id = a.nextId();
              return h;
            }, n.translate = function(h, f, d) {
              for (var u = d ? n.allBodies(h) : h.bodies, m = 0; m < u.length; m++)
                c.translate(u[m], f);
              return h;
            }, n.rotate = function(h, f, d, u) {
              for (var m = Math.cos(f), p = Math.sin(f), g = u ? n.allBodies(h) : h.bodies, x = 0; x < g.length; x++) {
                var y = g[x], v = y.position.x - d.x, w = y.position.y - d.y;
                c.setPosition(y, {
                  x: d.x + (v * m - w * p),
                  y: d.y + (v * p + w * m)
                }), c.rotate(y, f);
              }
              return h;
            }, n.scale = function(h, f, d, u, m) {
              for (var p = m ? n.allBodies(h) : h.bodies, g = 0; g < p.length; g++) {
                var x = p[g], y = x.position.x - u.x, v = x.position.y - u.y;
                c.setPosition(x, {
                  x: u.x + y * f,
                  y: u.y + v * d
                }), c.scale(x, f, d);
              }
              return h;
            }, n.bounds = function(h) {
              for (var f = n.allBodies(h), d = [], u = 0; u < f.length; u += 1) {
                var m = f[u];
                d.push(m.bounds.min, m.bounds.max);
              }
              return l.create(d);
            };
          })();
        },
        /* 7 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(4), a = r(5), l = r(0);
          (function() {
            n._motionWakeThreshold = 0.18, n._motionSleepThreshold = 0.08, n._minBias = 0.9, n.update = function(c, h) {
              for (var f = h / l._baseDelta, d = n._motionSleepThreshold, u = 0; u < c.length; u++) {
                var m = c[u], p = o.getSpeed(m), g = o.getAngularSpeed(m), x = p * p + g * g;
                if (m.force.x !== 0 || m.force.y !== 0) {
                  n.set(m, !1);
                  continue;
                }
                var y = Math.min(m.motion, x), v = Math.max(m.motion, x);
                m.motion = n._minBias * y + (1 - n._minBias) * v, m.sleepThreshold > 0 && m.motion < d ? (m.sleepCounter += 1, m.sleepCounter >= m.sleepThreshold / f && n.set(m, !0)) : m.sleepCounter > 0 && (m.sleepCounter -= 1);
              }
            }, n.afterCollisions = function(c) {
              for (var h = n._motionSleepThreshold, f = 0; f < c.length; f++) {
                var d = c[f];
                if (d.isActive) {
                  var u = d.collision, m = u.bodyA.parent, p = u.bodyB.parent;
                  if (!(m.isSleeping && p.isSleeping || m.isStatic || p.isStatic) && (m.isSleeping || p.isSleeping)) {
                    var g = m.isSleeping && !m.isStatic ? m : p, x = g === m ? p : m;
                    !g.isStatic && x.motion > h && n.set(g, !1);
                  }
                }
              }
            }, n.set = function(c, h) {
              var f = c.isSleeping;
              h ? (c.isSleeping = !0, c.sleepCounter = c.sleepThreshold, c.positionImpulse.x = 0, c.positionImpulse.y = 0, c.positionPrev.x = c.position.x, c.positionPrev.y = c.position.y, c.anglePrev = c.angle, c.speed = 0, c.angularSpeed = 0, c.motion = 0, f || a.trigger(c, "sleepStart")) : (c.isSleeping = !1, c.sleepCounter = 0, f && a.trigger(c, "sleepEnd"));
            };
          })();
        },
        /* 8 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(3), a = r(9);
          (function() {
            var l = [], c = {
              overlap: 0,
              axis: null
            }, h = {
              overlap: 0,
              axis: null
            };
            n.create = function(f, d) {
              return {
                pair: null,
                collided: !1,
                bodyA: f,
                bodyB: d,
                parentA: f.parent,
                parentB: d.parent,
                depth: 0,
                normal: { x: 0, y: 0 },
                tangent: { x: 0, y: 0 },
                penetration: { x: 0, y: 0 },
                supports: [null, null],
                supportCount: 0
              };
            }, n.collides = function(f, d, u) {
              if (n._overlapAxes(c, f.vertices, d.vertices, f.axes), c.overlap <= 0 || (n._overlapAxes(h, d.vertices, f.vertices, d.axes), h.overlap <= 0))
                return null;
              var m = u && u.table[a.id(f, d)], p;
              m ? p = m.collision : (p = n.create(f, d), p.collided = !0, p.bodyA = f.id < d.id ? f : d, p.bodyB = f.id < d.id ? d : f, p.parentA = p.bodyA.parent, p.parentB = p.bodyB.parent), f = p.bodyA, d = p.bodyB;
              var g;
              c.overlap < h.overlap ? g = c : g = h;
              var x = p.normal, y = p.tangent, v = p.penetration, w = p.supports, _ = g.overlap, S = g.axis, C = S.x, b = S.y, A = d.position.x - f.position.x, P = d.position.y - f.position.y;
              C * A + b * P >= 0 && (C = -C, b = -b), x.x = C, x.y = b, y.x = -b, y.y = C, v.x = C * _, v.y = b * _, p.depth = _;
              var M = n._findSupports(f, d, x, 1), T = 0;
              if (o.contains(f.vertices, M[0]) && (w[T++] = M[0]), o.contains(f.vertices, M[1]) && (w[T++] = M[1]), T < 2) {
                var k = n._findSupports(d, f, x, -1);
                o.contains(d.vertices, k[0]) && (w[T++] = k[0]), T < 2 && o.contains(d.vertices, k[1]) && (w[T++] = k[1]);
              }
              return T === 0 && (w[T++] = M[0]), p.supportCount = T, p;
            }, n._overlapAxes = function(f, d, u, m) {
              var p = d.length, g = u.length, x = d[0].x, y = d[0].y, v = u[0].x, w = u[0].y, _ = m.length, S = Number.MAX_VALUE, C = 0, b, A, P, M, T, k;
              for (T = 0; T < _; T++) {
                var E = m[T], I = E.x, B = E.y, R = x * I + y * B, z = v * I + w * B, F = R, L = z;
                for (k = 1; k < p; k += 1)
                  M = d[k].x * I + d[k].y * B, M > F ? F = M : M < R && (R = M);
                for (k = 1; k < g; k += 1)
                  M = u[k].x * I + u[k].y * B, M > L ? L = M : M < z && (z = M);
                if (A = F - z, P = L - R, b = A < P ? A : P, b < S && (S = b, C = T, b <= 0))
                  break;
              }
              f.axis = m[C], f.overlap = S;
            }, n._findSupports = function(f, d, u, m) {
              var p = d.vertices, g = p.length, x = f.position.x, y = f.position.y, v = u.x * m, w = u.y * m, _ = p[0], S = _, C = v * (x - S.x) + w * (y - S.y), b, A, P;
              for (P = 1; P < g; P += 1)
                S = p[P], A = v * (x - S.x) + w * (y - S.y), A < C && (C = A, _ = S);
              return b = p[(g + _.index - 1) % g], C = v * (x - b.x) + w * (y - b.y), S = p[(_.index + 1) % g], v * (x - S.x) + w * (y - S.y) < C ? (l[0] = _, l[1] = S, l) : (l[0] = _, l[1] = b, l);
            };
          })();
        },
        /* 9 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(16);
          (function() {
            n.create = function(a, l) {
              var c = a.bodyA, h = a.bodyB, f = {
                id: n.id(c, h),
                bodyA: c,
                bodyB: h,
                collision: a,
                contacts: [o.create(), o.create()],
                contactCount: 0,
                separation: 0,
                isActive: !0,
                isSensor: c.isSensor || h.isSensor,
                timeCreated: l,
                timeUpdated: l,
                inverseMass: 0,
                friction: 0,
                frictionStatic: 0,
                restitution: 0,
                slop: 0
              };
              return n.update(f, a, l), f;
            }, n.update = function(a, l, c) {
              var h = l.supports, f = l.supportCount, d = a.contacts, u = l.parentA, m = l.parentB;
              a.isActive = !0, a.timeUpdated = c, a.collision = l, a.separation = l.depth, a.inverseMass = u.inverseMass + m.inverseMass, a.friction = u.friction < m.friction ? u.friction : m.friction, a.frictionStatic = u.frictionStatic > m.frictionStatic ? u.frictionStatic : m.frictionStatic, a.restitution = u.restitution > m.restitution ? u.restitution : m.restitution, a.slop = u.slop > m.slop ? u.slop : m.slop, a.contactCount = f, l.pair = a;
              var p = h[0], g = d[0], x = h[1], y = d[1];
              (y.vertex === p || g.vertex === x) && (d[1] = g, d[0] = g = y, y = d[1]), g.vertex = p, y.vertex = x;
            }, n.setActive = function(a, l, c) {
              l ? (a.isActive = !0, a.timeUpdated = c) : (a.isActive = !1, a.contactCount = 0);
            }, n.id = function(a, l) {
              return a.id < l.id ? a.id.toString(36) + ":" + l.id.toString(36) : l.id.toString(36) + ":" + a.id.toString(36);
            };
          })();
        },
        /* 10 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(3), a = r(2), l = r(7), c = r(1), h = r(11), f = r(0);
          (function() {
            n._warming = 0.4, n._torqueDampen = 1, n._minLength = 1e-6, n.create = function(d) {
              var u = d;
              u.bodyA && !u.pointA && (u.pointA = { x: 0, y: 0 }), u.bodyB && !u.pointB && (u.pointB = { x: 0, y: 0 });
              var m = u.bodyA ? a.add(u.bodyA.position, u.pointA) : u.pointA, p = u.bodyB ? a.add(u.bodyB.position, u.pointB) : u.pointB, g = a.magnitude(a.sub(m, p));
              u.length = typeof u.length < "u" ? u.length : g, u.id = u.id || f.nextId(), u.label = u.label || "Constraint", u.type = "constraint", u.stiffness = u.stiffness || (u.length > 0 ? 1 : 0.7), u.damping = u.damping || 0, u.angularStiffness = u.angularStiffness || 0, u.angleA = u.bodyA ? u.bodyA.angle : u.angleA, u.angleB = u.bodyB ? u.bodyB.angle : u.angleB, u.plugin = {};
              var x = {
                visible: !0,
                lineWidth: 2,
                strokeStyle: "#ffffff",
                type: "line",
                anchors: !0
              };
              return u.length === 0 && u.stiffness > 0.1 ? (x.type = "pin", x.anchors = !1) : u.stiffness < 0.9 && (x.type = "spring"), u.render = f.extend(x, u.render), u;
            }, n.preSolveAll = function(d) {
              for (var u = 0; u < d.length; u += 1) {
                var m = d[u], p = m.constraintImpulse;
                m.isStatic || p.x === 0 && p.y === 0 && p.angle === 0 || (m.position.x += p.x, m.position.y += p.y, m.angle += p.angle);
              }
            }, n.solveAll = function(d, u) {
              for (var m = f.clamp(u / f._baseDelta, 0, 1), p = 0; p < d.length; p += 1) {
                var g = d[p], x = !g.bodyA || g.bodyA && g.bodyA.isStatic, y = !g.bodyB || g.bodyB && g.bodyB.isStatic;
                (x || y) && n.solve(d[p], m);
              }
              for (p = 0; p < d.length; p += 1)
                g = d[p], x = !g.bodyA || g.bodyA && g.bodyA.isStatic, y = !g.bodyB || g.bodyB && g.bodyB.isStatic, !x && !y && n.solve(d[p], m);
            }, n.solve = function(d, u) {
              var m = d.bodyA, p = d.bodyB, g = d.pointA, x = d.pointB;
              if (!(!m && !p)) {
                m && !m.isStatic && (a.rotate(g, m.angle - d.angleA, g), d.angleA = m.angle), p && !p.isStatic && (a.rotate(x, p.angle - d.angleB, x), d.angleB = p.angle);
                var y = g, v = x;
                if (m && (y = a.add(m.position, g)), p && (v = a.add(p.position, x)), !(!y || !v)) {
                  var w = a.sub(y, v), _ = a.magnitude(w);
                  _ < n._minLength && (_ = n._minLength);
                  var S = (_ - d.length) / _, C = d.stiffness >= 1 || d.length === 0, b = C ? d.stiffness * u : d.stiffness * u * u, A = d.damping * u, P = a.mult(w, S * b), M = (m ? m.inverseMass : 0) + (p ? p.inverseMass : 0), T = (m ? m.inverseInertia : 0) + (p ? p.inverseInertia : 0), k = M + T, E, I, B, R, z;
                  if (A > 0) {
                    var F = a.create();
                    B = a.div(w, _), z = a.sub(
                      p && a.sub(p.position, p.positionPrev) || F,
                      m && a.sub(m.position, m.positionPrev) || F
                    ), R = a.dot(B, z);
                  }
                  m && !m.isStatic && (I = m.inverseMass / M, m.constraintImpulse.x -= P.x * I, m.constraintImpulse.y -= P.y * I, m.position.x -= P.x * I, m.position.y -= P.y * I, A > 0 && (m.positionPrev.x -= A * B.x * R * I, m.positionPrev.y -= A * B.y * R * I), E = a.cross(g, P) / k * n._torqueDampen * m.inverseInertia * (1 - d.angularStiffness), m.constraintImpulse.angle -= E, m.angle -= E), p && !p.isStatic && (I = p.inverseMass / M, p.constraintImpulse.x += P.x * I, p.constraintImpulse.y += P.y * I, p.position.x += P.x * I, p.position.y += P.y * I, A > 0 && (p.positionPrev.x += A * B.x * R * I, p.positionPrev.y += A * B.y * R * I), E = a.cross(x, P) / k * n._torqueDampen * p.inverseInertia * (1 - d.angularStiffness), p.constraintImpulse.angle += E, p.angle += E);
                }
              }
            }, n.postSolveAll = function(d) {
              for (var u = 0; u < d.length; u++) {
                var m = d[u], p = m.constraintImpulse;
                if (!(m.isStatic || p.x === 0 && p.y === 0 && p.angle === 0)) {
                  l.set(m, !1);
                  for (var g = 0; g < m.parts.length; g++) {
                    var x = m.parts[g];
                    o.translate(x.vertices, p), g > 0 && (x.position.x += p.x, x.position.y += p.y), p.angle !== 0 && (o.rotate(x.vertices, p.angle, m.position), h.rotate(x.axes, p.angle), g > 0 && a.rotateAbout(x.position, p.angle, m.position, x.position)), c.update(x.bounds, x.vertices, m.velocity);
                  }
                  p.angle *= n._warming, p.x *= n._warming, p.y *= n._warming;
                }
              }
            }, n.pointAWorld = function(d) {
              return {
                x: (d.bodyA ? d.bodyA.position.x : 0) + (d.pointA ? d.pointA.x : 0),
                y: (d.bodyA ? d.bodyA.position.y : 0) + (d.pointA ? d.pointA.y : 0)
              };
            }, n.pointBWorld = function(d) {
              return {
                x: (d.bodyB ? d.bodyB.position.x : 0) + (d.pointB ? d.pointB.x : 0),
                y: (d.bodyB ? d.bodyB.position.y : 0) + (d.pointB ? d.pointB.y : 0)
              };
            }, n.currentLength = function(d) {
              var u = (d.bodyA ? d.bodyA.position.x : 0) + (d.pointA ? d.pointA.x : 0), m = (d.bodyA ? d.bodyA.position.y : 0) + (d.pointA ? d.pointA.y : 0), p = (d.bodyB ? d.bodyB.position.x : 0) + (d.pointB ? d.pointB.x : 0), g = (d.bodyB ? d.bodyB.position.y : 0) + (d.pointB ? d.pointB.y : 0), x = u - p, y = m - g;
              return Math.sqrt(x * x + y * y);
            };
          })();
        },
        /* 11 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(2), a = r(0);
          (function() {
            n.fromVertices = function(l) {
              for (var c = {}, h = 0; h < l.length; h++) {
                var f = (h + 1) % l.length, d = o.normalise({
                  x: l[f].y - l[h].y,
                  y: l[h].x - l[f].x
                }), u = d.y === 0 ? 1 / 0 : d.x / d.y;
                u = u.toFixed(3).toString(), c[u] = d;
              }
              return a.values(c);
            }, n.rotate = function(l, c) {
              if (c !== 0)
                for (var h = Math.cos(c), f = Math.sin(c), d = 0; d < l.length; d++) {
                  var u = l[d], m;
                  m = u.x * h - u.y * f, u.y = u.x * f + u.y * h, u.x = m;
                }
            };
          })();
        },
        /* 12 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(3), a = r(0), l = r(4), c = r(1), h = r(2);
          (function() {
            n.rectangle = function(f, d, u, m, p) {
              p = p || {};
              var g = {
                label: "Rectangle Body",
                position: { x: f, y: d },
                vertices: o.fromPath("L 0 0 L " + u + " 0 L " + u + " " + m + " L 0 " + m)
              };
              if (p.chamfer) {
                var x = p.chamfer;
                g.vertices = o.chamfer(
                  g.vertices,
                  x.radius,
                  x.quality,
                  x.qualityMin,
                  x.qualityMax
                ), delete p.chamfer;
              }
              return l.create(a.extend({}, g, p));
            }, n.trapezoid = function(f, d, u, m, p, g) {
              g = g || {}, p >= 1 && a.warn("Bodies.trapezoid: slope parameter must be < 1."), p *= 0.5;
              var x = (1 - p * 2) * u, y = u * p, v = y + x, w = v + y, _;
              p < 0.5 ? _ = "L 0 0 L " + y + " " + -m + " L " + v + " " + -m + " L " + w + " 0" : _ = "L 0 0 L " + v + " " + -m + " L " + w + " 0";
              var S = {
                label: "Trapezoid Body",
                position: { x: f, y: d },
                vertices: o.fromPath(_)
              };
              if (g.chamfer) {
                var C = g.chamfer;
                S.vertices = o.chamfer(
                  S.vertices,
                  C.radius,
                  C.quality,
                  C.qualityMin,
                  C.qualityMax
                ), delete g.chamfer;
              }
              return l.create(a.extend({}, S, g));
            }, n.circle = function(f, d, u, m, p) {
              m = m || {};
              var g = {
                label: "Circle Body",
                circleRadius: u
              };
              p = p || 25;
              var x = Math.ceil(Math.max(10, Math.min(p, u)));
              return x % 2 === 1 && (x += 1), n.polygon(f, d, x, u, a.extend({}, g, m));
            }, n.polygon = function(f, d, u, m, p) {
              if (p = p || {}, u < 3)
                return n.circle(f, d, m, p);
              for (var g = 2 * Math.PI / u, x = "", y = g * 0.5, v = 0; v < u; v += 1) {
                var w = y + v * g, _ = Math.cos(w) * m, S = Math.sin(w) * m;
                x += "L " + _.toFixed(3) + " " + S.toFixed(3) + " ";
              }
              var C = {
                label: "Polygon Body",
                position: { x: f, y: d },
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
              return l.create(a.extend({}, C, p));
            }, n.fromVertices = function(f, d, u, m, p, g, x, y) {
              var v = a.getDecomp(), w, _, S, C, b, A, P, M, T, k, E;
              for (w = !!(v && v.quickDecomp), m = m || {}, S = [], p = typeof p < "u" ? p : !1, g = typeof g < "u" ? g : 0.01, x = typeof x < "u" ? x : 10, y = typeof y < "u" ? y : 0.01, a.isArray(u[0]) || (u = [u]), k = 0; k < u.length; k += 1)
                if (A = u[k], C = o.isConvex(A), b = !C, b && !w && a.warnOnce(
                  "Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."
                ), C || !w)
                  C ? A = o.clockwiseSort(A) : A = o.hull(A), S.push({
                    position: { x: f, y: d },
                    vertices: A
                  });
                else {
                  var I = A.map(function(V) {
                    return [V.x, V.y];
                  });
                  v.makeCCW(I), g !== !1 && v.removeCollinearPoints(I, g), y !== !1 && v.removeDuplicatePoints && v.removeDuplicatePoints(I, y);
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
                S[P] = l.create(a.extend(S[P], m));
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
                          var J = h.magnitudeSquared(h.sub(U[(T + 1) % U.length], X[E])), Q = h.magnitudeSquared(h.sub(U[T], X[(E + 1) % X.length]));
                          J < F && Q < F && (U[T].isInternal = !0, X[E].isInternal = !0);
                        }
                    }
                  }
                }
              }
              return S.length > 1 ? (_ = l.create(a.extend({ parts: S.slice(0) }, m)), l.setPosition(_, { x: f, y: d }), _) : S[0];
            };
          })();
        },
        /* 13 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(0), a = r(8);
          (function() {
            n.create = function(l) {
              var c = {
                bodies: [],
                collisions: [],
                pairs: null
              };
              return o.extend(c, l);
            }, n.setBodies = function(l, c) {
              l.bodies = c.slice(0);
            }, n.clear = function(l) {
              l.bodies = [], l.collisions = [];
            }, n.collisions = function(l) {
              var c = l.pairs, h = l.bodies, f = h.length, d = n.canCollide, u = a.collides, m = l.collisions, p = 0, g, x;
              for (h.sort(n._compareBoundsX), g = 0; g < f; g++) {
                var y = h[g], v = y.bounds, w = y.bounds.max.x, _ = y.bounds.max.y, S = y.bounds.min.y, C = y.isStatic || y.isSleeping, b = y.parts.length, A = b === 1;
                for (x = g + 1; x < f; x++) {
                  var P = h[x], M = P.bounds;
                  if (M.min.x > w)
                    break;
                  if (!(_ < M.min.y || S > M.max.y) && !(C && (P.isStatic || P.isSleeping)) && d(y.collisionFilter, P.collisionFilter)) {
                    var T = P.parts.length;
                    if (A && T === 1) {
                      var k = u(y, P, c);
                      k && (m[p++] = k);
                    } else
                      for (var E = b > 1 ? 1 : 0, I = T > 1 ? 1 : 0, B = E; B < b; B++)
                        for (var R = y.parts[B], v = R.bounds, z = I; z < T; z++) {
                          var F = P.parts[z], M = F.bounds;
                          if (!(v.min.x > M.max.x || v.max.x < M.min.x || v.max.y < M.min.y || v.min.y > M.max.y)) {
                            var k = u(R, F, c);
                            k && (m[p++] = k);
                          }
                        }
                  }
                }
              }
              return m.length !== p && (m.length = p), m;
            }, n.canCollide = function(l, c) {
              return l.group === c.group && l.group !== 0 ? l.group > 0 : (l.mask & c.category) !== 0 && (c.mask & l.category) !== 0;
            }, n._compareBoundsX = function(l, c) {
              return l.bounds.min.x - c.bounds.min.x;
            };
          })();
        },
        /* 14 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(0);
          (function() {
            n.create = function(a) {
              var l = {};
              return a || o.log("Mouse.create: element was undefined, defaulting to document.body", "warn"), l.element = a || document.body, l.absolute = { x: 0, y: 0 }, l.position = { x: 0, y: 0 }, l.mousedownPosition = { x: 0, y: 0 }, l.mouseupPosition = { x: 0, y: 0 }, l.offset = { x: 0, y: 0 }, l.scale = { x: 1, y: 1 }, l.wheelDelta = 0, l.button = -1, l.pixelRatio = parseInt(l.element.getAttribute("data-pixel-ratio"), 10) || 1, l.sourceEvents = {
                mousemove: null,
                mousedown: null,
                mouseup: null,
                mousewheel: null
              }, l.mousemove = function(c) {
                var h = n._getRelativeMousePosition(c, l.element, l.pixelRatio), f = c.changedTouches;
                f && (l.button = 0, c.preventDefault()), l.absolute.x = h.x, l.absolute.y = h.y, l.position.x = l.absolute.x * l.scale.x + l.offset.x, l.position.y = l.absolute.y * l.scale.y + l.offset.y, l.sourceEvents.mousemove = c;
              }, l.mousedown = function(c) {
                var h = n._getRelativeMousePosition(c, l.element, l.pixelRatio), f = c.changedTouches;
                f ? (l.button = 0, c.preventDefault()) : l.button = c.button, l.absolute.x = h.x, l.absolute.y = h.y, l.position.x = l.absolute.x * l.scale.x + l.offset.x, l.position.y = l.absolute.y * l.scale.y + l.offset.y, l.mousedownPosition.x = l.position.x, l.mousedownPosition.y = l.position.y, l.sourceEvents.mousedown = c;
              }, l.mouseup = function(c) {
                var h = n._getRelativeMousePosition(c, l.element, l.pixelRatio), f = c.changedTouches;
                f && c.preventDefault(), l.button = -1, l.absolute.x = h.x, l.absolute.y = h.y, l.position.x = l.absolute.x * l.scale.x + l.offset.x, l.position.y = l.absolute.y * l.scale.y + l.offset.y, l.mouseupPosition.x = l.position.x, l.mouseupPosition.y = l.position.y, l.sourceEvents.mouseup = c;
              }, l.mousewheel = function(c) {
                l.wheelDelta = Math.max(-1, Math.min(1, c.wheelDelta || -c.detail)), c.preventDefault(), l.sourceEvents.mousewheel = c;
              }, n.setElement(l, l.element), l;
            }, n.setElement = function(a, l) {
              a.element = l, l.addEventListener("mousemove", a.mousemove, { passive: !0 }), l.addEventListener("mousedown", a.mousedown, { passive: !0 }), l.addEventListener("mouseup", a.mouseup, { passive: !0 }), l.addEventListener("wheel", a.mousewheel, { passive: !1 }), l.addEventListener("touchmove", a.mousemove, { passive: !1 }), l.addEventListener("touchstart", a.mousedown, { passive: !1 }), l.addEventListener("touchend", a.mouseup, { passive: !1 });
            }, n.clearSourceEvents = function(a) {
              a.sourceEvents.mousemove = null, a.sourceEvents.mousedown = null, a.sourceEvents.mouseup = null, a.sourceEvents.mousewheel = null, a.wheelDelta = 0;
            }, n.setOffset = function(a, l) {
              a.offset.x = l.x, a.offset.y = l.y, a.position.x = a.absolute.x * a.scale.x + a.offset.x, a.position.y = a.absolute.y * a.scale.y + a.offset.y;
            }, n.setScale = function(a, l) {
              a.scale.x = l.x, a.scale.y = l.y, a.position.x = a.absolute.x * a.scale.x + a.offset.x, a.position.y = a.absolute.y * a.scale.y + a.offset.y;
            }, n._getRelativeMousePosition = function(a, l, c) {
              var h = l.getBoundingClientRect(), f = document.documentElement || document.body.parentNode || document.body, d = window.pageXOffset !== void 0 ? window.pageXOffset : f.scrollLeft, u = window.pageYOffset !== void 0 ? window.pageYOffset : f.scrollTop, m = a.changedTouches, p, g;
              return m ? (p = m[0].pageX - h.left - d, g = m[0].pageY - h.top - u) : (p = a.pageX - h.left - d, g = a.pageY - h.top - u), {
                x: p / (l.clientWidth / (l.width || l.clientWidth) * c),
                y: g / (l.clientHeight / (l.height || l.clientHeight) * c)
              };
            };
          })();
        },
        /* 15 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(0);
          (function() {
            n._registry = {}, n.register = function(a) {
              if (n.isPlugin(a) || o.warn("Plugin.register:", n.toString(a), "does not implement all required fields."), a.name in n._registry) {
                var l = n._registry[a.name], c = n.versionParse(a.version).number, h = n.versionParse(l.version).number;
                c > h ? (o.warn("Plugin.register:", n.toString(l), "was upgraded to", n.toString(a)), n._registry[a.name] = a) : c < h ? o.warn("Plugin.register:", n.toString(l), "can not be downgraded to", n.toString(a)) : a !== l && o.warn("Plugin.register:", n.toString(a), "is already registered to different plugin object");
              } else
                n._registry[a.name] = a;
              return a;
            }, n.resolve = function(a) {
              return n._registry[n.dependencyParse(a).name];
            }, n.toString = function(a) {
              return typeof a == "string" ? a : (a.name || "anonymous") + "@" + (a.version || a.range || "0.0.0");
            }, n.isPlugin = function(a) {
              return a && a.name && a.version && a.install;
            }, n.isUsed = function(a, l) {
              return a.used.indexOf(l) > -1;
            }, n.isFor = function(a, l) {
              var c = a.for && n.dependencyParse(a.for);
              return !a.for || l.name === c.name && n.versionSatisfies(l.version, c.range);
            }, n.use = function(a, l) {
              if (a.uses = (a.uses || []).concat(l || []), a.uses.length === 0) {
                o.warn("Plugin.use:", n.toString(a), "does not specify any dependencies to install.");
                return;
              }
              for (var c = n.dependencies(a), h = o.topologicalSort(c), f = [], d = 0; d < h.length; d += 1)
                if (h[d] !== a.name) {
                  var u = n.resolve(h[d]);
                  if (!u) {
                    f.push("❌ " + h[d]);
                    continue;
                  }
                  n.isUsed(a, u.name) || (n.isFor(u, a) || (o.warn("Plugin.use:", n.toString(u), "is for", u.for, "but installed on", n.toString(a) + "."), u._warned = !0), u.install ? u.install(a) : (o.warn("Plugin.use:", n.toString(u), "does not specify an install function."), u._warned = !0), u._warned ? (f.push("🔶 " + n.toString(u)), delete u._warned) : f.push("✅ " + n.toString(u)), a.used.push(u.name));
                }
              f.length > 0 && o.info(f.join("  "));
            }, n.dependencies = function(a, l) {
              var c = n.dependencyParse(a), h = c.name;
              if (l = l || {}, !(h in l)) {
                a = n.resolve(a) || a, l[h] = o.map(a.uses || [], function(d) {
                  n.isPlugin(d) && n.register(d);
                  var u = n.dependencyParse(d), m = n.resolve(d);
                  return m && !n.versionSatisfies(m.version, u.range) ? (o.warn(
                    "Plugin.dependencies:",
                    n.toString(m),
                    "does not satisfy",
                    n.toString(u),
                    "used by",
                    n.toString(c) + "."
                  ), m._warned = !0, a._warned = !0) : m || (o.warn(
                    "Plugin.dependencies:",
                    n.toString(d),
                    "used by",
                    n.toString(c),
                    "could not be resolved."
                  ), a._warned = !0), u.name;
                });
                for (var f = 0; f < l[h].length; f += 1)
                  n.dependencies(l[h][f], l);
                return l;
              }
            }, n.dependencyParse = function(a) {
              if (o.isString(a)) {
                var l = /^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/;
                return l.test(a) || o.warn("Plugin.dependencyParse:", a, "is not a valid dependency string."), {
                  name: a.split("@")[0],
                  range: a.split("@")[1] || "*"
                };
              }
              return {
                name: a.name,
                range: a.range || a.version
              };
            }, n.versionParse = function(a) {
              var l = /^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;
              l.test(a) || o.warn("Plugin.versionParse:", a, "is not a valid version or range.");
              var c = l.exec(a), h = Number(c[4]), f = Number(c[5]), d = Number(c[6]);
              return {
                isRange: !!(c[1] || c[2]),
                version: c[3],
                range: a,
                operator: c[1] || c[2] || "",
                major: h,
                minor: f,
                patch: d,
                parts: [h, f, d],
                prerelease: c[7],
                number: h * 1e8 + f * 1e4 + d
              };
            }, n.versionSatisfies = function(a, l) {
              l = l || "*";
              var c = n.versionParse(l), h = n.versionParse(a);
              if (c.isRange) {
                if (c.operator === "*" || a === "*")
                  return !0;
                if (c.operator === ">")
                  return h.number > c.number;
                if (c.operator === ">=")
                  return h.number >= c.number;
                if (c.operator === "~")
                  return h.major === c.major && h.minor === c.minor && h.patch >= c.patch;
                if (c.operator === "^")
                  return c.major > 0 ? h.major === c.major && h.number >= c.number : c.minor > 0 ? h.minor === c.minor && h.patch >= c.patch : h.patch === c.patch;
              }
              return a === l || a === "*";
            };
          })();
        },
        /* 16 */
        /***/
        function(e, i) {
          var r = {};
          e.exports = r, function() {
            r.create = function(n) {
              return {
                vertex: n,
                normalImpulse: 0,
                tangentImpulse: 0
              };
            };
          }();
        },
        /* 17 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(7), a = r(18), l = r(13), c = r(19), h = r(5), f = r(6), d = r(10), u = r(0), m = r(4);
          (function() {
            n._deltaMax = 1e3 / 60, n.create = function(p) {
              p = p || {};
              var g = {
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
              }, x = u.extend(g, p);
              return x.world = p.world || f.create({ label: "World" }), x.pairs = p.pairs || c.create(), x.detector = p.detector || l.create(), x.detector.pairs = x.pairs, x.grid = { buckets: [] }, x.world.gravity = x.gravity, x.broadphase = x.grid, x.metrics = {}, x;
            }, n.update = function(p, g) {
              var x = u.now(), y = p.world, v = p.detector, w = p.pairs, _ = p.timing, S = _.timestamp, C;
              g > n._deltaMax && u.warnOnce(
                "Matter.Engine.update: delta argument is recommended to be less than or equal to",
                n._deltaMax.toFixed(3),
                "ms."
              ), g = typeof g < "u" ? g : u._baseDelta, g *= _.timeScale, _.timestamp += g, _.lastDelta = g;
              var b = {
                timestamp: _.timestamp,
                delta: g
              };
              h.trigger(p, "beforeUpdate", b);
              var A = f.allBodies(y), P = f.allConstraints(y);
              for (y.isModified && (l.setBodies(v, A), f.setModified(y, !1, !1, !0)), p.enableSleeping && o.update(A, g), n._bodiesApplyGravity(A, p.gravity), g > 0 && n._bodiesUpdate(A, g), h.trigger(p, "beforeSolve", b), d.preSolveAll(A), C = 0; C < p.constraintIterations; C++)
                d.solveAll(P, g);
              d.postSolveAll(A);
              var M = l.collisions(v);
              c.update(w, M, S), p.enableSleeping && o.afterCollisions(w.list), w.collisionStart.length > 0 && h.trigger(p, "collisionStart", {
                pairs: w.collisionStart,
                timestamp: _.timestamp,
                delta: g
              });
              var T = u.clamp(20 / p.positionIterations, 0, 1);
              for (a.preSolvePosition(w.list), C = 0; C < p.positionIterations; C++)
                a.solvePosition(w.list, g, T);
              for (a.postSolvePosition(A), d.preSolveAll(A), C = 0; C < p.constraintIterations; C++)
                d.solveAll(P, g);
              for (d.postSolveAll(A), a.preSolveVelocity(w.list), C = 0; C < p.velocityIterations; C++)
                a.solveVelocity(w.list, g);
              return n._bodiesUpdateVelocities(A), w.collisionActive.length > 0 && h.trigger(p, "collisionActive", {
                pairs: w.collisionActive,
                timestamp: _.timestamp,
                delta: g
              }), w.collisionEnd.length > 0 && h.trigger(p, "collisionEnd", {
                pairs: w.collisionEnd,
                timestamp: _.timestamp,
                delta: g
              }), n._bodiesClearForces(A), h.trigger(p, "afterUpdate", b), p.timing.lastElapsed = u.now() - x, p;
            }, n.merge = function(p, g) {
              if (u.extend(p, g), g.world) {
                p.world = g.world, n.clear(p);
                for (var x = f.allBodies(p.world), y = 0; y < x.length; y++) {
                  var v = x[y];
                  o.set(v, !1), v.id = u.nextId();
                }
              }
            }, n.clear = function(p) {
              c.clear(p.pairs), l.clear(p.detector);
            }, n._bodiesClearForces = function(p) {
              for (var g = p.length, x = 0; x < g; x++) {
                var y = p[x];
                y.force.x = 0, y.force.y = 0, y.torque = 0;
              }
            }, n._bodiesApplyGravity = function(p, g) {
              var x = typeof g.scale < "u" ? g.scale : 1e-3, y = p.length;
              if (!(g.x === 0 && g.y === 0 || x === 0))
                for (var v = 0; v < y; v++) {
                  var w = p[v];
                  w.isStatic || w.isSleeping || (w.force.y += w.mass * g.y * x, w.force.x += w.mass * g.x * x);
                }
            }, n._bodiesUpdate = function(p, g) {
              for (var x = p.length, y = 0; y < x; y++) {
                var v = p[y];
                v.isStatic || v.isSleeping || m.update(v, g);
              }
            }, n._bodiesUpdateVelocities = function(p) {
              for (var g = p.length, x = 0; x < g; x++)
                m.updateVelocities(p[x]);
            };
          })();
        },
        /* 18 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(3), a = r(0), l = r(1);
          (function() {
            n._restingThresh = 2, n._restingThreshTangent = Math.sqrt(6), n._positionDampen = 0.9, n._positionWarming = 0.8, n._frictionNormalMultiplier = 5, n._frictionMaxStatic = Number.MAX_VALUE, n.preSolvePosition = function(c) {
              var h, f, d, u = c.length;
              for (h = 0; h < u; h++)
                f = c[h], f.isActive && (d = f.contactCount, f.collision.parentA.totalContacts += d, f.collision.parentB.totalContacts += d);
            }, n.solvePosition = function(c, h, f) {
              var d, u, m, p, g, x, y, v, w = n._positionDampen * (f || 1), _ = a.clamp(h / a._baseDelta, 0, 1), S = c.length;
              for (d = 0; d < S; d++)
                u = c[d], !(!u.isActive || u.isSensor) && (m = u.collision, p = m.parentA, g = m.parentB, x = m.normal, u.separation = m.depth + x.x * (g.positionImpulse.x - p.positionImpulse.x) + x.y * (g.positionImpulse.y - p.positionImpulse.y));
              for (d = 0; d < S; d++)
                u = c[d], !(!u.isActive || u.isSensor) && (m = u.collision, p = m.parentA, g = m.parentB, x = m.normal, v = u.separation - u.slop * _, (p.isStatic || g.isStatic) && (v *= 2), p.isStatic || p.isSleeping || (y = w / p.totalContacts, p.positionImpulse.x += x.x * v * y, p.positionImpulse.y += x.y * v * y), g.isStatic || g.isSleeping || (y = w / g.totalContacts, g.positionImpulse.x -= x.x * v * y, g.positionImpulse.y -= x.y * v * y));
            }, n.postSolvePosition = function(c) {
              for (var h = n._positionWarming, f = c.length, d = o.translate, u = l.update, m = 0; m < f; m++) {
                var p = c[m], g = p.positionImpulse, x = g.x, y = g.y, v = p.velocity;
                if (p.totalContacts = 0, x !== 0 || y !== 0) {
                  for (var w = 0; w < p.parts.length; w++) {
                    var _ = p.parts[w];
                    d(_.vertices, g), u(_.bounds, _.vertices, v), _.position.x += x, _.position.y += y;
                  }
                  p.positionPrev.x += x, p.positionPrev.y += y, x * v.x + y * v.y < 0 ? (g.x = 0, g.y = 0) : (g.x *= h, g.y *= h);
                }
              }
            }, n.preSolveVelocity = function(c) {
              var h = c.length, f, d;
              for (f = 0; f < h; f++) {
                var u = c[f];
                if (!(!u.isActive || u.isSensor)) {
                  var m = u.contacts, p = u.contactCount, g = u.collision, x = g.parentA, y = g.parentB, v = g.normal, w = g.tangent;
                  for (d = 0; d < p; d++) {
                    var _ = m[d], S = _.vertex, C = _.normalImpulse, b = _.tangentImpulse;
                    if (C !== 0 || b !== 0) {
                      var A = v.x * C + w.x * b, P = v.y * C + w.y * b;
                      x.isStatic || x.isSleeping || (x.positionPrev.x += A * x.inverseMass, x.positionPrev.y += P * x.inverseMass, x.anglePrev += x.inverseInertia * ((S.x - x.position.x) * P - (S.y - x.position.y) * A)), y.isStatic || y.isSleeping || (y.positionPrev.x -= A * y.inverseMass, y.positionPrev.y -= P * y.inverseMass, y.anglePrev -= y.inverseInertia * ((S.x - y.position.x) * P - (S.y - y.position.y) * A));
                    }
                  }
                }
              }
            }, n.solveVelocity = function(c, h) {
              var f = h / a._baseDelta, d = f * f, u = d * f, m = -n._restingThresh * f, p = n._restingThreshTangent, g = n._frictionNormalMultiplier * f, x = n._frictionMaxStatic, y = c.length, v, w, _, S;
              for (_ = 0; _ < y; _++) {
                var C = c[_];
                if (!(!C.isActive || C.isSensor)) {
                  var b = C.collision, A = b.parentA, P = b.parentB, M = b.normal.x, T = b.normal.y, k = b.tangent.x, E = b.tangent.y, I = C.inverseMass, B = C.friction * C.frictionStatic * g, R = C.contacts, z = C.contactCount, F = 1 / z, L = A.position.x - A.positionPrev.x, Z = A.position.y - A.positionPrev.y, U = A.angle - A.anglePrev, X = P.position.x - P.positionPrev.x, J = P.position.y - P.positionPrev.y, Q = P.angle - P.anglePrev;
                  for (S = 0; S < z; S++) {
                    var V = R[S], It = V.vertex, lt = It.x - A.position.x, Jt = It.y - A.position.y, zt = It.x - P.position.x, Ut = It.y - P.position.y, pt = L - Jt * U, oi = Z + lt * U, Oi = X - Ut * Q, xe = J + zt * Q, oe = pt - Oi, ae = oi - xe, te = M * oe + T * ae, ee = k * oe + E * ae, Di = C.separation + te, zi = Math.min(Di, 1);
                    zi = Di < 0 ? 0 : zi;
                    var wn = zi * B;
                    ee < -wn || ee > wn ? (w = ee > 0 ? ee : -ee, v = C.friction * (ee > 0 ? 1 : -1) * u, v < -w ? v = -w : v > w && (v = w)) : (v = ee, w = x);
                    var To = lt * T - Jt * M, ko = zt * T - Ut * M, Eo = F / (I + A.inverseInertia * To * To + P.inverseInertia * ko * ko), vs = (1 + C.restitution) * te * Eo;
                    if (v *= Eo, te < m)
                      V.normalImpulse = 0;
                    else {
                      var Dc = V.normalImpulse;
                      V.normalImpulse += vs, V.normalImpulse > 0 && (V.normalImpulse = 0), vs = V.normalImpulse - Dc;
                    }
                    if (ee < -p || ee > p)
                      V.tangentImpulse = 0;
                    else {
                      var zc = V.tangentImpulse;
                      V.tangentImpulse += v, V.tangentImpulse < -w && (V.tangentImpulse = -w), V.tangentImpulse > w && (V.tangentImpulse = w), v = V.tangentImpulse - zc;
                    }
                    var bs = M * vs + k * v, ws = T * vs + E * v;
                    A.isStatic || A.isSleeping || (A.positionPrev.x += bs * A.inverseMass, A.positionPrev.y += ws * A.inverseMass, A.anglePrev += (lt * ws - Jt * bs) * A.inverseInertia), P.isStatic || P.isSleeping || (P.positionPrev.x -= bs * P.inverseMass, P.positionPrev.y -= ws * P.inverseMass, P.anglePrev -= (zt * ws - Ut * bs) * P.inverseInertia);
                  }
                }
              }
            };
          })();
        },
        /* 19 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(9), a = r(0);
          (function() {
            n.create = function(l) {
              return a.extend({
                table: {},
                list: [],
                collisionStart: [],
                collisionActive: [],
                collisionEnd: []
              }, l);
            }, n.update = function(l, c, h) {
              var f = o.update, d = o.create, u = o.setActive, m = l.table, p = l.list, g = p.length, x = g, y = l.collisionStart, v = l.collisionEnd, w = l.collisionActive, _ = c.length, S = 0, C = 0, b = 0, A, P, M;
              for (M = 0; M < _; M++)
                A = c[M], P = A.pair, P ? (P.isActive && (w[b++] = P), f(P, A, h)) : (P = d(A, h), m[P.id] = P, y[S++] = P, p[x++] = P);
              for (x = 0, g = p.length, M = 0; M < g; M++)
                P = p[M], P.timeUpdated >= h ? p[x++] = P : (u(P, !1, h), P.collision.bodyA.sleepCounter > 0 && P.collision.bodyB.sleepCounter > 0 ? p[x++] = P : (v[C++] = P, delete m[P.id]));
              p.length !== x && (p.length = x), y.length !== S && (y.length = S), v.length !== C && (v.length = C), w.length !== b && (w.length = b);
            }, n.clear = function(l) {
              return l.table = {}, l.list.length = 0, l.collisionStart.length = 0, l.collisionActive.length = 0, l.collisionEnd.length = 0, l;
            };
          })();
        },
        /* 20 */
        /***/
        function(e, i, r) {
          var n = e.exports = r(21);
          n.Axes = r(11), n.Bodies = r(12), n.Body = r(4), n.Bounds = r(1), n.Collision = r(8), n.Common = r(0), n.Composite = r(6), n.Composites = r(22), n.Constraint = r(10), n.Contact = r(16), n.Detector = r(13), n.Engine = r(17), n.Events = r(5), n.Grid = r(23), n.Mouse = r(14), n.MouseConstraint = r(24), n.Pair = r(9), n.Pairs = r(19), n.Plugin = r(15), n.Query = r(25), n.Render = r(26), n.Resolver = r(18), n.Runner = r(27), n.SAT = r(28), n.Sleeping = r(7), n.Svg = r(29), n.Vector = r(2), n.Vertices = r(3), n.World = r(30), n.Engine.run = n.Runner.run, n.Common.deprecated(n.Engine, "run", "Engine.run ➤ use Matter.Runner.run(engine) instead");
        },
        /* 21 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(15), a = r(0);
          (function() {
            n.name = "matter-js", n.version = "0.20.0", n.uses = [], n.used = [], n.use = function() {
              o.use(n, Array.prototype.slice.call(arguments));
            }, n.before = function(l, c) {
              return l = l.replace(/^Matter./, ""), a.chainPathBefore(n, l, c);
            }, n.after = function(l, c) {
              return l = l.replace(/^Matter./, ""), a.chainPathAfter(n, l, c);
            };
          })();
        },
        /* 22 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(6), a = r(10), l = r(0), c = r(4), h = r(12), f = l.deprecated;
          (function() {
            n.stack = function(d, u, m, p, g, x, y) {
              for (var v = o.create({ label: "Stack" }), w = d, _ = u, S, C = 0, b = 0; b < p; b++) {
                for (var A = 0, P = 0; P < m; P++) {
                  var M = y(w, _, P, b, S, C);
                  if (M) {
                    var T = M.bounds.max.y - M.bounds.min.y, k = M.bounds.max.x - M.bounds.min.x;
                    T > A && (A = T), c.translate(M, { x: k * 0.5, y: T * 0.5 }), w = M.bounds.max.x + g, o.addBody(v, M), S = M, C += 1;
                  } else
                    w += g;
                }
                _ += A + x, w = d;
              }
              return v;
            }, n.chain = function(d, u, m, p, g, x) {
              for (var y = d.bodies, v = 1; v < y.length; v++) {
                var w = y[v - 1], _ = y[v], S = w.bounds.max.y - w.bounds.min.y, C = w.bounds.max.x - w.bounds.min.x, b = _.bounds.max.y - _.bounds.min.y, A = _.bounds.max.x - _.bounds.min.x, P = {
                  bodyA: w,
                  pointA: { x: C * u, y: S * m },
                  bodyB: _,
                  pointB: { x: A * p, y: b * g }
                }, M = l.extend(P, x);
                o.addConstraint(d, a.create(M));
              }
              return d.label += " Chain", d;
            }, n.mesh = function(d, u, m, p, g) {
              var x = d.bodies, y, v, w, _, S;
              for (y = 0; y < m; y++) {
                for (v = 1; v < u; v++)
                  w = x[v - 1 + y * u], _ = x[v + y * u], o.addConstraint(d, a.create(l.extend({ bodyA: w, bodyB: _ }, g)));
                if (y > 0)
                  for (v = 0; v < u; v++)
                    w = x[v + (y - 1) * u], _ = x[v + y * u], o.addConstraint(d, a.create(l.extend({ bodyA: w, bodyB: _ }, g))), p && v > 0 && (S = x[v - 1 + (y - 1) * u], o.addConstraint(d, a.create(l.extend({ bodyA: S, bodyB: _ }, g)))), p && v < u - 1 && (S = x[v + 1 + (y - 1) * u], o.addConstraint(d, a.create(l.extend({ bodyA: S, bodyB: _ }, g))));
              }
              return d.label += " Mesh", d;
            }, n.pyramid = function(d, u, m, p, g, x, y) {
              return n.stack(d, u, m, p, g, x, function(v, w, _, S, C, b) {
                var A = Math.min(p, Math.ceil(m / 2)), P = C ? C.bounds.max.x - C.bounds.min.x : 0;
                if (!(S > A)) {
                  S = A - S;
                  var M = S, T = m - 1 - S;
                  if (!(_ < M || _ > T)) {
                    b === 1 && c.translate(C, { x: (_ + (m % 2 === 1 ? 1 : -1)) * P, y: 0 });
                    var k = C ? _ * P : 0;
                    return y(d + k + _ * g, w, _, S, C, b);
                  }
                }
              });
            }, n.newtonsCradle = function(d, u, m, p, g) {
              for (var x = o.create({ label: "Newtons Cradle" }), y = 0; y < m; y++) {
                var v = 1.9, w = h.circle(
                  d + y * (p * v),
                  u + g,
                  p,
                  { inertia: 1 / 0, restitution: 1, friction: 0, frictionAir: 1e-4, slop: 1 }
                ), _ = a.create({ pointA: { x: d + y * (p * v), y: u }, bodyB: w });
                o.addBody(x, w), o.addConstraint(x, _);
              }
              return x;
            }, f(n, "newtonsCradle", "Composites.newtonsCradle ➤ moved to newtonsCradle example"), n.car = function(d, u, m, p, g) {
              var x = c.nextGroup(!0), y = 20, v = -m * 0.5 + y, w = m * 0.5 - y, _ = 0, S = o.create({ label: "Car" }), C = h.rectangle(d, u, m, p, {
                collisionFilter: {
                  group: x
                },
                chamfer: {
                  radius: p * 0.5
                },
                density: 2e-4
              }), b = h.circle(d + v, u + _, g, {
                collisionFilter: {
                  group: x
                },
                friction: 0.8
              }), A = h.circle(d + w, u + _, g, {
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
            }, f(n, "car", "Composites.car ➤ moved to car example"), n.softBody = function(d, u, m, p, g, x, y, v, w, _) {
              w = l.extend({ inertia: 1 / 0 }, w), _ = l.extend({ stiffness: 0.2, render: { type: "line", anchors: !1 } }, _);
              var S = n.stack(d, u, m, p, g, x, function(C, b) {
                return h.circle(C, b, v, w);
              });
              return n.mesh(S, m, p, y, _), S.label = "Soft Body", S;
            }, f(n, "softBody", "Composites.softBody ➤ moved to softBody and cloth examples");
          })();
        },
        /* 23 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(9), a = r(0), l = a.deprecated;
          (function() {
            n.create = function(c) {
              var h = {
                buckets: {},
                pairs: {},
                pairsList: [],
                bucketWidth: 48,
                bucketHeight: 48
              };
              return a.extend(h, c);
            }, n.update = function(c, h, f, d) {
              var u, m, p, g = f.world, x = c.buckets, y, v, w = !1;
              for (u = 0; u < h.length; u++) {
                var _ = h[u];
                if (!(_.isSleeping && !d) && !(g.bounds && (_.bounds.max.x < g.bounds.min.x || _.bounds.min.x > g.bounds.max.x || _.bounds.max.y < g.bounds.min.y || _.bounds.min.y > g.bounds.max.y))) {
                  var S = n._getRegion(c, _);
                  if (!_.region || S.id !== _.region.id || d) {
                    (!_.region || d) && (_.region = S);
                    var C = n._regionUnion(S, _.region);
                    for (m = C.startCol; m <= C.endCol; m++)
                      for (p = C.startRow; p <= C.endRow; p++) {
                        v = n._getBucketId(m, p), y = x[v];
                        var b = m >= S.startCol && m <= S.endCol && p >= S.startRow && p <= S.endRow, A = m >= _.region.startCol && m <= _.region.endCol && p >= _.region.startRow && p <= _.region.endRow;
                        !b && A && A && y && n._bucketRemoveBody(c, y, _), (_.region === S || b && !A || d) && (y || (y = n._createBucket(x, v)), n._bucketAddBody(c, y, _));
                      }
                    _.region = S, w = !0;
                  }
                }
              }
              w && (c.pairsList = n._createActivePairsList(c));
            }, l(n, "update", "Grid.update ➤ replaced by Matter.Detector"), n.clear = function(c) {
              c.buckets = {}, c.pairs = {}, c.pairsList = [];
            }, l(n, "clear", "Grid.clear ➤ replaced by Matter.Detector"), n._regionUnion = function(c, h) {
              var f = Math.min(c.startCol, h.startCol), d = Math.max(c.endCol, h.endCol), u = Math.min(c.startRow, h.startRow), m = Math.max(c.endRow, h.endRow);
              return n._createRegion(f, d, u, m);
            }, n._getRegion = function(c, h) {
              var f = h.bounds, d = Math.floor(f.min.x / c.bucketWidth), u = Math.floor(f.max.x / c.bucketWidth), m = Math.floor(f.min.y / c.bucketHeight), p = Math.floor(f.max.y / c.bucketHeight);
              return n._createRegion(d, u, m, p);
            }, n._createRegion = function(c, h, f, d) {
              return {
                id: c + "," + h + "," + f + "," + d,
                startCol: c,
                endCol: h,
                startRow: f,
                endRow: d
              };
            }, n._getBucketId = function(c, h) {
              return "C" + c + "R" + h;
            }, n._createBucket = function(c, h) {
              var f = c[h] = [];
              return f;
            }, n._bucketAddBody = function(c, h, f) {
              var d = c.pairs, u = o.id, m = h.length, p;
              for (p = 0; p < m; p++) {
                var g = h[p];
                if (!(f.id === g.id || f.isStatic && g.isStatic)) {
                  var x = u(f, g), y = d[x];
                  y ? y[2] += 1 : d[x] = [f, g, 1];
                }
              }
              h.push(f);
            }, n._bucketRemoveBody = function(c, h, f) {
              var d = c.pairs, u = o.id, m;
              h.splice(a.indexOf(h, f), 1);
              var p = h.length;
              for (m = 0; m < p; m++) {
                var g = d[u(f, h[m])];
                g && (g[2] -= 1);
              }
            }, n._createActivePairsList = function(c) {
              var h, f = c.pairs, d = a.keys(f), u = d.length, m = [], p;
              for (p = 0; p < u; p++)
                h = f[d[p]], h[2] > 0 ? m.push(h) : delete f[d[p]];
              return m;
            };
          })();
        },
        /* 24 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(3), a = r(7), l = r(14), c = r(5), h = r(13), f = r(10), d = r(6), u = r(0), m = r(1);
          (function() {
            n.create = function(p, g) {
              var x = (p ? p.mouse : null) || (g ? g.mouse : null);
              x || (p && p.render && p.render.canvas ? x = l.create(p.render.canvas) : g && g.element ? x = l.create(g.element) : (x = l.create(), u.warn("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected")));
              var y = f.create({
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
              }, w = u.extend(v, g);
              return c.on(p, "beforeUpdate", function() {
                var _ = d.allBodies(p.world);
                n.update(w, _), n._triggerEvents(w);
              }), w;
            }, n.update = function(p, g) {
              var x = p.mouse, y = p.constraint, v = p.body;
              if (x.button === 0) {
                if (y.bodyB)
                  a.set(y.bodyB, !1), y.pointA = x.position;
                else
                  for (var w = 0; w < g.length; w++)
                    if (v = g[w], m.contains(v.bounds, x.position) && h.canCollide(v.collisionFilter, p.collisionFilter))
                      for (var _ = v.parts.length > 1 ? 1 : 0; _ < v.parts.length; _++) {
                        var S = v.parts[_];
                        if (o.contains(S.vertices, x.position)) {
                          y.pointA = x.position, y.bodyB = p.body = v, y.pointB = { x: x.position.x - v.position.x, y: x.position.y - v.position.y }, y.angleB = v.angle, a.set(v, !1), c.trigger(p, "startdrag", { mouse: x, body: v });
                          break;
                        }
                      }
              } else
                y.bodyB = p.body = null, y.pointB = null, v && c.trigger(p, "enddrag", { mouse: x, body: v });
            }, n._triggerEvents = function(p) {
              var g = p.mouse, x = g.sourceEvents;
              x.mousemove && c.trigger(p, "mousemove", { mouse: g }), x.mousedown && c.trigger(p, "mousedown", { mouse: g }), x.mouseup && c.trigger(p, "mouseup", { mouse: g }), l.clearSourceEvents(g);
            };
          })();
        },
        /* 25 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(2), a = r(8), l = r(1), c = r(12), h = r(3);
          (function() {
            n.collides = function(f, d) {
              for (var u = [], m = d.length, p = f.bounds, g = a.collides, x = l.overlaps, y = 0; y < m; y++) {
                var v = d[y], w = v.parts.length, _ = w === 1 ? 0 : 1;
                if (x(v.bounds, p))
                  for (var S = _; S < w; S++) {
                    var C = v.parts[S];
                    if (x(C.bounds, p)) {
                      var b = g(C, f);
                      if (b) {
                        u.push(b);
                        break;
                      }
                    }
                  }
              }
              return u;
            }, n.ray = function(f, d, u, m) {
              m = m || 1e-100;
              for (var p = o.angle(d, u), g = o.magnitude(o.sub(d, u)), x = (u.x + d.x) * 0.5, y = (u.y + d.y) * 0.5, v = c.rectangle(x, y, g, m, { angle: p }), w = n.collides(v, f), _ = 0; _ < w.length; _ += 1) {
                var S = w[_];
                S.body = S.bodyB = S.bodyA;
              }
              return w;
            }, n.region = function(f, d, u) {
              for (var m = [], p = 0; p < f.length; p++) {
                var g = f[p], x = l.overlaps(g.bounds, d);
                (x && !u || !x && u) && m.push(g);
              }
              return m;
            }, n.point = function(f, d) {
              for (var u = [], m = 0; m < f.length; m++) {
                var p = f[m];
                if (l.contains(p.bounds, d))
                  for (var g = p.parts.length === 1 ? 0 : 1; g < p.parts.length; g++) {
                    var x = p.parts[g];
                    if (l.contains(x.bounds, d) && h.contains(x.vertices, d)) {
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
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(4), a = r(0), l = r(6), c = r(1), h = r(5), f = r(2), d = r(14);
          (function() {
            var u, m;
            typeof window < "u" && (u = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(_) {
              window.setTimeout(function() {
                _(a.now());
              }, 1e3 / 60);
            }, m = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame), n._goodFps = 30, n._goodDelta = 1e3 / 60, n.create = function(_) {
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
              }, C.controller = n, C.options.showBroadphase = !1, C.options.pixelRatio !== 1 && n.setPixelRatio(C, C.options.pixelRatio), a.isElement(C.element) && C.element.appendChild(C.canvas), C;
            }, n.run = function(_) {
              (function S(C) {
                _.frameRequestId = u(S), p(_, C), n.world(_, C), _.context.setTransform(_.options.pixelRatio, 0, 0, _.options.pixelRatio, 0, 0), (_.options.showStats || _.options.showDebug) && n.stats(_, _.context, C), (_.options.showPerformance || _.options.showDebug) && n.performance(_, _.context, C), _.context.setTransform(1, 0, 0, 1, 0, 0);
              })();
            }, n.stop = function(_) {
              m(_.frameRequestId);
            }, n.setPixelRatio = function(_, S) {
              var C = _.options, b = _.canvas;
              S === "auto" && (S = y(b)), C.pixelRatio = S, b.setAttribute("data-pixel-ratio", S), b.width = C.width * S, b.height = C.height * S, b.style.width = C.width + "px", b.style.height = C.height + "px";
            }, n.setSize = function(_, S, C) {
              _.options.width = S, _.options.height = C, _.bounds.max.x = _.bounds.min.x + S, _.bounds.max.y = _.bounds.min.y + C, _.options.pixelRatio !== 1 ? n.setPixelRatio(_, _.options.pixelRatio) : (_.canvas.width = S, _.canvas.height = C);
            }, n.lookAt = function(_, S, C, b) {
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
              F > z ? Z = F / z : L = z / F, _.options.hasBounds = !0, _.bounds.min.x = A.min.x, _.bounds.max.x = A.min.x + E * L, _.bounds.min.y = A.min.y, _.bounds.max.y = A.min.y + I * Z, b && (_.bounds.min.x += E * 0.5 - E * L * 0.5, _.bounds.max.x += E * 0.5 - E * L * 0.5, _.bounds.min.y += I * 0.5 - I * Z * 0.5, _.bounds.max.y += I * 0.5 - I * Z * 0.5), _.bounds.min.x -= C.x, _.bounds.max.x -= C.x, _.bounds.min.y -= C.y, _.bounds.max.y -= C.y, _.mouse && (d.setScale(_.mouse, {
                x: (_.bounds.max.x - _.bounds.min.x) / _.canvas.width,
                y: (_.bounds.max.y - _.bounds.min.y) / _.canvas.height
              }), d.setOffset(_.mouse, _.bounds.min));
            }, n.startViewTransform = function(_) {
              var S = _.bounds.max.x - _.bounds.min.x, C = _.bounds.max.y - _.bounds.min.y, b = S / _.options.width, A = C / _.options.height;
              _.context.setTransform(
                _.options.pixelRatio / b,
                0,
                0,
                _.options.pixelRatio / A,
                0,
                0
              ), _.context.translate(-_.bounds.min.x, -_.bounds.min.y);
            }, n.endViewTransform = function(_) {
              _.context.setTransform(_.options.pixelRatio, 0, 0, _.options.pixelRatio, 0, 0);
            }, n.world = function(_, S) {
              var C = a.now(), b = _.engine, A = b.world, P = _.canvas, M = _.context, T = _.options, k = _.timing, E = l.allBodies(A), I = l.allConstraints(A), B = T.wireframes ? T.wireframeBackground : T.background, R = [], z = [], F, L = {
                timestamp: b.timing.timestamp
              };
              if (h.trigger(_, "beforeRender", L), _.currentBackground !== B && w(_, B), M.globalCompositeOperation = "source-in", M.fillStyle = "transparent", M.fillRect(0, 0, P.width, P.height), M.globalCompositeOperation = "source-over", T.hasBounds) {
                for (F = 0; F < E.length; F++) {
                  var Z = E[F];
                  c.overlaps(Z.bounds, _.bounds) && R.push(Z);
                }
                for (F = 0; F < I.length; F++) {
                  var U = I[F], X = U.bodyA, J = U.bodyB, Q = U.pointA, V = U.pointB;
                  X && (Q = f.add(X.position, U.pointA)), J && (V = f.add(J.position, U.pointB)), !(!Q || !V) && (c.contains(_.bounds, Q) || c.contains(_.bounds, V)) && z.push(U);
                }
                n.startViewTransform(_), _.mouse && (d.setScale(_.mouse, {
                  x: (_.bounds.max.x - _.bounds.min.x) / _.options.width,
                  y: (_.bounds.max.y - _.bounds.min.y) / _.options.height
                }), d.setOffset(_.mouse, _.bounds.min));
              } else
                z = I, R = E, _.options.pixelRatio !== 1 && _.context.setTransform(_.options.pixelRatio, 0, 0, _.options.pixelRatio, 0, 0);
              !T.wireframes || b.enableSleeping && T.showSleeping ? n.bodies(_, R, M) : (T.showConvexHulls && n.bodyConvexHulls(_, R, M), n.bodyWireframes(_, R, M)), T.showBounds && n.bodyBounds(_, R, M), (T.showAxes || T.showAngleIndicator) && n.bodyAxes(_, R, M), T.showPositions && n.bodyPositions(_, R, M), T.showVelocity && n.bodyVelocity(_, R, M), T.showIds && n.bodyIds(_, R, M), T.showSeparations && n.separations(_, b.pairs.list, M), T.showCollisions && n.collisions(_, b.pairs.list, M), T.showVertexNumbers && n.vertexNumbers(_, R, M), T.showMousePosition && n.mousePosition(_, _.mouse, M), n.constraints(z, M), T.hasBounds && n.endViewTransform(_), h.trigger(_, "afterRender", L), k.lastElapsed = a.now() - C;
            }, n.stats = function(_, S, C) {
              for (var b = _.engine, A = b.world, P = l.allBodies(A), M = 0, T = 55, k = 44, E = 0, I = 0, B = 0; B < P.length; B += 1)
                M += P[B].parts.length;
              var R = {
                Part: M,
                Body: P.length,
                Cons: l.allConstraints(A).length,
                Comp: l.allComposites(A).length,
                Pair: b.pairs.list.length
              };
              S.fillStyle = "#0e0f19", S.fillRect(E, I, T * 5.5, k), S.font = "12px Arial", S.textBaseline = "top", S.textAlign = "right";
              for (var z in R) {
                var F = R[z];
                S.fillStyle = "#aaa", S.fillText(z, E + T, I + 8), S.fillStyle = "#eee", S.fillText(F, E + T, I + 26), E += T;
              }
            }, n.performance = function(_, S) {
              var C = _.engine, b = _.timing, A = b.deltaHistory, P = b.elapsedHistory, M = b.timestampElapsedHistory, T = b.engineDeltaHistory, k = b.engineUpdatesHistory, E = b.engineElapsedHistory, I = C.timing.lastUpdatesPerFrame, B = C.timing.lastDelta, R = g(A), z = g(P), F = g(T), L = g(k), Z = g(E), U = g(M), X = U / R || 0, J = Math.round(R / B), Q = 1e3 / R || 0, V = 4, It = 12, lt = 60, Jt = 34, zt = 10, Ut = 69;
              S.fillStyle = "#0e0f19", S.fillRect(0, 50, It * 5 + lt * 6 + 22, Jt), n.status(
                S,
                zt,
                Ut,
                lt,
                V,
                A.length,
                Math.round(Q) + " fps",
                Q / n._goodFps,
                function(pt) {
                  return A[pt] / R - 1;
                }
              ), n.status(
                S,
                zt + It + lt,
                Ut,
                lt,
                V,
                T.length,
                B.toFixed(2) + " dt",
                n._goodDelta / B,
                function(pt) {
                  return T[pt] / F - 1;
                }
              ), n.status(
                S,
                zt + (It + lt) * 2,
                Ut,
                lt,
                V,
                k.length,
                I + " upf",
                Math.pow(a.clamp(L / J || 1, 0, 1), 4),
                function(pt) {
                  return k[pt] / L - 1;
                }
              ), n.status(
                S,
                zt + (It + lt) * 3,
                Ut,
                lt,
                V,
                E.length,
                Z.toFixed(2) + " ut",
                1 - I * Z / n._goodFps,
                function(pt) {
                  return E[pt] / Z - 1;
                }
              ), n.status(
                S,
                zt + (It + lt) * 4,
                Ut,
                lt,
                V,
                P.length,
                z.toFixed(2) + " rt",
                1 - z / n._goodFps,
                function(pt) {
                  return P[pt] / z - 1;
                }
              ), n.status(
                S,
                zt + (It + lt) * 5,
                Ut,
                lt,
                V,
                M.length,
                X.toFixed(2) + " x",
                X * X * X,
                function(pt) {
                  return (M[pt] / A[pt] / X || 0) - 1;
                }
              );
            }, n.status = function(_, S, C, b, A, P, M, T, k) {
              _.strokeStyle = "#888", _.fillStyle = "#444", _.lineWidth = 1, _.fillRect(S, C + 7, b, 1), _.beginPath(), _.moveTo(S, C + 7 - A * a.clamp(0.4 * k(0), -2, 2));
              for (var E = 0; E < b; E += 1)
                _.lineTo(S + E, C + 7 - (E < P ? A * a.clamp(0.4 * k(E), -2, 2) : 0));
              _.stroke(), _.fillStyle = "hsl(" + a.clamp(25 + 95 * T, 0, 120) + ",100%,60%)", _.fillRect(S, C - 7, 4, 4), _.font = "12px Arial", _.textBaseline = "middle", _.textAlign = "right", _.fillStyle = "#eee", _.fillText(M, S + b, C - 5);
            }, n.constraints = function(_, S) {
              for (var C = S, b = 0; b < _.length; b++) {
                var A = _[b];
                if (!(!A.render.visible || !A.pointA || !A.pointB)) {
                  var P = A.bodyA, M = A.bodyB, T, k;
                  if (P ? T = f.add(P.position, A.pointA) : T = A.pointA, A.render.type === "pin")
                    C.beginPath(), C.arc(T.x, T.y, 3, 0, 2 * Math.PI), C.closePath();
                  else {
                    if (M ? k = f.add(M.position, A.pointB) : k = A.pointB, C.beginPath(), C.moveTo(T.x, T.y), A.render.type === "spring")
                      for (var E = f.sub(k, T), I = f.perp(f.normalise(E)), B = Math.ceil(a.clamp(A.length / 5, 12, 20)), R, z = 1; z < B; z += 1)
                        R = z % 2 === 0 ? 1 : -1, C.lineTo(
                          T.x + E.x * (z / B) + I.x * R * 4,
                          T.y + E.y * (z / B) + I.y * R * 4
                        );
                    C.lineTo(k.x, k.y);
                  }
                  A.render.lineWidth && (C.lineWidth = A.render.lineWidth, C.strokeStyle = A.render.strokeStyle, C.stroke()), A.render.anchors && (C.fillStyle = A.render.strokeStyle, C.beginPath(), C.arc(T.x, T.y, 3, 0, 2 * Math.PI), C.arc(k.x, k.y, 3, 0, 2 * Math.PI), C.closePath(), C.fill());
                }
              }
            }, n.bodies = function(_, S, C) {
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
            }, n.bodyWireframes = function(_, S, C) {
              var b = C, A = _.options.showInternalEdges, P, M, T, k, E;
              for (b.beginPath(), T = 0; T < S.length; T++)
                if (P = S[T], !!P.render.visible)
                  for (E = P.parts.length > 1 ? 1 : 0; E < P.parts.length; E++) {
                    for (M = P.parts[E], b.moveTo(M.vertices[0].x, M.vertices[0].y), k = 1; k < M.vertices.length; k++)
                      !M.vertices[k - 1].isInternal || A ? b.lineTo(M.vertices[k].x, M.vertices[k].y) : b.moveTo(M.vertices[k].x, M.vertices[k].y), M.vertices[k].isInternal && !A && b.moveTo(M.vertices[(k + 1) % M.vertices.length].x, M.vertices[(k + 1) % M.vertices.length].y);
                    b.lineTo(M.vertices[0].x, M.vertices[0].y);
                  }
              b.lineWidth = 1, b.strokeStyle = _.options.wireframeStrokeStyle, b.stroke();
            }, n.bodyConvexHulls = function(_, S, C) {
              var b = C, A, P, M;
              for (b.beginPath(), P = 0; P < S.length; P++)
                if (A = S[P], !(!A.render.visible || A.parts.length === 1)) {
                  for (b.moveTo(A.vertices[0].x, A.vertices[0].y), M = 1; M < A.vertices.length; M++)
                    b.lineTo(A.vertices[M].x, A.vertices[M].y);
                  b.lineTo(A.vertices[0].x, A.vertices[0].y);
                }
              b.lineWidth = 1, b.strokeStyle = "rgba(255,255,255,0.2)", b.stroke();
            }, n.vertexNumbers = function(_, S, C) {
              var b = C, A, P, M;
              for (A = 0; A < S.length; A++) {
                var T = S[A].parts;
                for (M = T.length > 1 ? 1 : 0; M < T.length; M++) {
                  var k = T[M];
                  for (P = 0; P < k.vertices.length; P++)
                    b.fillStyle = "rgba(255,255,255,0.2)", b.fillText(A + "_" + P, k.position.x + (k.vertices[P].x - k.position.x) * 0.8, k.position.y + (k.vertices[P].y - k.position.y) * 0.8);
                }
              }
            }, n.mousePosition = function(_, S, C) {
              var b = C;
              b.fillStyle = "rgba(255,255,255,0.8)", b.fillText(S.position.x + "  " + S.position.y, S.position.x + 5, S.position.y - 5);
            }, n.bodyBounds = function(_, S, C) {
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
            }, n.bodyAxes = function(_, S, C) {
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
            }, n.bodyPositions = function(_, S, C) {
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
            }, n.bodyVelocity = function(_, S, C) {
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
            }, n.bodyIds = function(_, S, C) {
              var b = C, A, P;
              for (A = 0; A < S.length; A++)
                if (S[A].render.visible) {
                  var M = S[A].parts;
                  for (P = M.length > 1 ? 1 : 0; P < M.length; P++) {
                    var T = M[P];
                    b.font = "12px Arial", b.fillStyle = "rgba(255,255,255,0.5)", b.fillText(T.id, T.position.x + 10, T.position.y - 10);
                  }
                }
            }, n.collisions = function(_, S, C) {
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
            }, n.separations = function(_, S, C) {
              var b = C, A = _.options, P, M, T, k, E;
              for (b.beginPath(), E = 0; E < S.length; E++)
                if (P = S[E], !!P.isActive) {
                  M = P.collision, T = M.bodyA, k = M.bodyB;
                  var I = 1;
                  !k.isStatic && !T.isStatic && (I = 0.5), k.isStatic && (I = 0), b.moveTo(k.position.x, k.position.y), b.lineTo(k.position.x - M.penetration.x * I, k.position.y - M.penetration.y * I), I = 1, !k.isStatic && !T.isStatic && (I = 0.5), T.isStatic && (I = 0), b.moveTo(T.position.x, T.position.y), b.lineTo(T.position.x + M.penetration.x * I, T.position.y + M.penetration.y * I);
                }
              A.wireframes ? b.strokeStyle = "rgba(255,165,0,0.5)" : b.strokeStyle = "orange", b.stroke();
            }, n.inspector = function(_, S) {
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
              b.delta = S - b.lastTime || n._goodDelta, b.lastTime = S, b.timestampElapsed = P - b.lastTimestamp || 0, b.lastTimestamp = P, b.deltaHistory.unshift(b.delta), b.deltaHistory.length = Math.min(b.deltaHistory.length, A), b.engineDeltaHistory.unshift(C.timing.lastDelta), b.engineDeltaHistory.length = Math.min(b.engineDeltaHistory.length, A), b.timestampElapsedHistory.unshift(b.timestampElapsed), b.timestampElapsedHistory.length = Math.min(b.timestampElapsedHistory.length, A), b.engineUpdatesHistory.unshift(C.timing.lastUpdatesPerFrame), b.engineUpdatesHistory.length = Math.min(b.engineUpdatesHistory.length, A), b.engineElapsedHistory.unshift(C.timing.lastElapsed), b.engineElapsedHistory.length = Math.min(b.engineElapsedHistory.length, A), b.elapsedHistory.unshift(b.lastElapsed), b.elapsedHistory.length = Math.min(b.elapsedHistory.length, A);
            }, g = function(_) {
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
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(5), a = r(17), l = r(0);
          (function() {
            n._maxFrameDelta = 1e3 / 15, n._frameDeltaFallback = 1e3 / 60, n._timeBufferMargin = 1.5, n._elapsedNextEstimate = 1, n._smoothingLowerBound = 0.1, n._smoothingUpperBound = 0.9, n.create = function(h) {
              var f = {
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
              }, d = l.extend(f, h);
              return d.fps = 0, d;
            }, n.run = function(h, f) {
              return h.timeBuffer = n._frameDeltaFallback, function d(u) {
                h.frameRequestId = n._onNextFrame(h, d), u && h.enabled && n.tick(h, f, u);
              }(), h;
            }, n.tick = function(h, f, d) {
              var u = l.now(), m = h.delta, p = 0, g = d - h.timeLastTick;
              if ((!g || !h.timeLastTick || g > Math.max(n._maxFrameDelta, h.maxFrameTime)) && (g = h.frameDelta || n._frameDeltaFallback), h.frameDeltaSmoothing) {
                h.frameDeltaHistory.push(g), h.frameDeltaHistory = h.frameDeltaHistory.slice(-h.frameDeltaHistorySize);
                var x = h.frameDeltaHistory.slice(0).sort(), y = h.frameDeltaHistory.slice(
                  x.length * n._smoothingLowerBound,
                  x.length * n._smoothingUpperBound
                ), v = c(y);
                g = v || g;
              }
              h.frameDeltaSnapping && (g = 1e3 / Math.round(1e3 / g)), h.frameDelta = g, h.timeLastTick = d, h.timeBuffer += h.frameDelta, h.timeBuffer = l.clamp(
                h.timeBuffer,
                0,
                h.frameDelta + m * n._timeBufferMargin
              ), h.lastUpdatesDeferred = 0;
              var w = h.maxUpdates || Math.ceil(h.maxFrameTime / m), _ = {
                timestamp: f.timing.timestamp
              };
              o.trigger(h, "beforeTick", _), o.trigger(h, "tick", _);
              for (var S = l.now(); m > 0 && h.timeBuffer >= m * n._timeBufferMargin; ) {
                o.trigger(h, "beforeUpdate", _), a.update(f, m), o.trigger(h, "afterUpdate", _), h.timeBuffer -= m, p += 1;
                var C = l.now() - u, b = l.now() - S, A = C + n._elapsedNextEstimate * b / p;
                if (p >= w || A > h.maxFrameTime) {
                  h.lastUpdatesDeferred = Math.round(Math.max(0, h.timeBuffer / m - n._timeBufferMargin));
                  break;
                }
              }
              f.timing.lastUpdatesPerFrame = p, o.trigger(h, "afterTick", _), h.frameDeltaHistory.length >= 100 && (h.lastUpdatesDeferred && Math.round(h.frameDelta / m) > w ? l.warnOnce("Matter.Runner: runner reached runner.maxUpdates, see docs.") : h.lastUpdatesDeferred && l.warnOnce("Matter.Runner: runner reached runner.maxFrameTime, see docs."), typeof h.isFixed < "u" && l.warnOnce("Matter.Runner: runner.isFixed is now redundant, see docs."), (h.deltaMin || h.deltaMax) && l.warnOnce("Matter.Runner: runner.deltaMin and runner.deltaMax were removed, see docs."), h.fps !== 0 && l.warnOnce("Matter.Runner: runner.fps was replaced by runner.delta, see docs."));
            }, n.stop = function(h) {
              n._cancelNextFrame(h);
            }, n._onNextFrame = function(h, f) {
              if (typeof window < "u" && window.requestAnimationFrame)
                h.frameRequestId = window.requestAnimationFrame(f);
              else
                throw new Error("Matter.Runner: missing required global window.requestAnimationFrame.");
              return h.frameRequestId;
            }, n._cancelNextFrame = function(h) {
              if (typeof window < "u" && window.cancelAnimationFrame)
                window.cancelAnimationFrame(h.frameRequestId);
              else
                throw new Error("Matter.Runner: missing required global window.cancelAnimationFrame.");
            };
            var c = function(h) {
              for (var f = 0, d = h.length, u = 0; u < d; u += 1)
                f += h[u];
              return f / d || 0;
            };
          })();
        },
        /* 28 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(8), a = r(0), l = a.deprecated;
          (function() {
            n.collides = function(c, h) {
              return o.collides(c, h);
            }, l(n, "collides", "SAT.collides ➤ replaced by Collision.collides");
          })();
        },
        /* 29 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n, r(1);
          var o = r(0);
          (function() {
            n.pathToVertices = function(a, l) {
              typeof window < "u" && !("SVGPathSeg" in window) && o.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");
              var c, h, f, d, u, m, p, g, x, y, v = [], w, _, S = 0, C = 0, b = 0;
              l = l || 15;
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
              for (n._svgPathToAbsolute(a), f = a.getTotalLength(), m = [], c = 0; c < a.pathSegList.numberOfItems; c += 1)
                m.push(a.pathSegList.getItem(c));
              for (p = m.concat(); S < f; ) {
                if (y = a.getPathSegAtLength(S), u = m[y], u != g) {
                  for (; p.length && p[0] != u; )
                    P(p.shift());
                  g = u;
                }
                switch (u.pathSegTypeAsLetter.toUpperCase()) {
                  case "C":
                  case "T":
                  case "S":
                  case "Q":
                  case "A":
                    d = a.getPointAtLength(S), A(d.x, d.y, 0);
                    break;
                }
                S += l;
              }
              for (c = 0, h = p.length; c < h; ++c)
                P(p[c]);
              return v;
            }, n._svgPathToAbsolute = function(a) {
              for (var l, c, h, f, d, u, m = a.pathSegList, p = 0, g = 0, x = m.numberOfItems, y = 0; y < x; ++y) {
                var v = m.getItem(y), w = v.pathSegTypeAsLetter;
                if (/[MLHVCSQTA]/.test(w))
                  "x" in v && (p = v.x), "y" in v && (g = v.y);
                else
                  switch ("x1" in v && (h = p + v.x1), "x2" in v && (d = p + v.x2), "y1" in v && (f = g + v.y1), "y2" in v && (u = g + v.y2), "x" in v && (p += v.x), "y" in v && (g += v.y), w) {
                    case "m":
                      m.replaceItem(a.createSVGPathSegMovetoAbs(p, g), y);
                      break;
                    case "l":
                      m.replaceItem(a.createSVGPathSegLinetoAbs(p, g), y);
                      break;
                    case "h":
                      m.replaceItem(a.createSVGPathSegLinetoHorizontalAbs(p), y);
                      break;
                    case "v":
                      m.replaceItem(a.createSVGPathSegLinetoVerticalAbs(g), y);
                      break;
                    case "c":
                      m.replaceItem(a.createSVGPathSegCurvetoCubicAbs(p, g, h, f, d, u), y);
                      break;
                    case "s":
                      m.replaceItem(a.createSVGPathSegCurvetoCubicSmoothAbs(p, g, d, u), y);
                      break;
                    case "q":
                      m.replaceItem(a.createSVGPathSegCurvetoQuadraticAbs(p, g, h, f), y);
                      break;
                    case "t":
                      m.replaceItem(a.createSVGPathSegCurvetoQuadraticSmoothAbs(p, g), y);
                      break;
                    case "a":
                      m.replaceItem(a.createSVGPathSegArcAbs(p, g, v.r1, v.r2, v.angle, v.largeArcFlag, v.sweepFlag), y);
                      break;
                    case "z":
                    case "Z":
                      p = l, g = c;
                      break;
                  }
                (w == "M" || w == "m") && (l = p, c = g);
              }
            };
          })();
        },
        /* 30 */
        /***/
        function(e, i, r) {
          var n = {};
          e.exports = n;
          var o = r(6);
          r(0), function() {
            n.create = o.create, n.add = o.add, n.remove = o.remove, n.clear = o.clear, n.addComposite = o.addComposite, n.addBody = o.addBody, n.addConstraint = o.addConstraint;
          }();
        }
        /******/
      ])
    );
  });
})(Cc);
var ne = Cc.exports;
let qe;
const mi = /* @__PURE__ */ new Map(), Hs = /* @__PURE__ */ new Map(), Mo = /* @__PURE__ */ new Map();
let Os = 0;
const Og = () => {
  qe = ne.Engine.create(), ne.Events.on(qe, "collisionStart", (s) => {
    s.pairs.forEach((t) => {
      var l, c;
      const { bodyA: e, bodyB: i } = t, r = mi.get(e.label), n = mi.get(i.label);
      if (!r || !n) return;
      const o = [r, n].find((h) => h.surface), a = [r, n].find((h) => !h.surface);
      a && (o ? Hs.set(
        a.target.matterBody.label,
        Math.floor(qa(o).y1)
      ) : ((l = r.onCollision) == null || l.call(r, n.target), (c = n.onCollision) == null || c.call(n, r.target)));
    });
  }), ne.Events.on(qe, "collisionEnd", (s) => {
    s.pairs.forEach((t) => {
      const { bodyA: e, bodyB: i } = t, r = mi.get(e.label), n = mi.get(i.label);
      if (!r || !n) return;
      const o = [r, n].find((l) => l.surface), a = [r, n].find((l) => !l.surface);
      a && o && Hs.delete(a.target.matterBody.label);
    });
  }), ne.Events.on(qe, "afterUpdate", () => {
    Mo.forEach((s) => {
      var i;
      if (!s.target.matterBody) return;
      const t = qa(s), e = (Hs.get(s.target.matterBody.label) ?? -1 / 0) >= Math.floor(t.y2);
      (i = s.onUpdatePosition) == null || i.call(s, t.x1, t.y1, e);
    });
  });
}, Dg = (s) => {
  ne.Engine.update(qe, s);
}, x_ = (s) => {
  if (s.rectangle)
    s.target.matterBody = ne.Bodies.rectangle(
      s.rectangle.x + s.rectangle.width / 2,
      s.rectangle.y + s.rectangle.height / 2,
      s.rectangle.width,
      s.rectangle.height,
      Ka(s)
    );
  else if (s.circle)
    s.target.matterBody = ne.Bodies.circle(
      s.circle.x,
      s.circle.y,
      s.circle.radius,
      Ka(s)
    );
  else
    throw new Error("No body specification provided");
  mi.set(s.target.matterBody.label, s), s.onUpdatePosition && Mo.set(s.target.matterBody.label, s), ne.Composite.add(qe.world, s.target.matterBody), s.movement && Ug(s.target, s.movement);
}, zg = (s) => {
  s.matterBody && (ne.Composite.remove(qe.world, s.matterBody), mi.delete(s.matterBody.label), Hs.delete(s.matterBody.label), Mo.delete(s.matterBody.label));
}, Ug = (s, t) => {
  s.matterBody && t.linearMovement && ne.Body.setVelocity(s.matterBody, t.linearMovement.velocity);
}, y_ = (s, t, e) => {
  s.matterBody && ne.Body.setPosition(s.matterBody, {
    x: s.matterBody.position.x + t,
    y: s.matterBody.position.y + e
  });
}, Ka = (s) => {
  var t;
  return Os++, s.surface ? {
    isStatic: !0,
    label: Os.toString(),
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
    label: Os.toString()
  } : {
    isStatic: !0,
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 0,
    isSensor: !0,
    label: Os.toString()
  };
}, qa = (s) => s.target.matterBody ? s.rectangle ? {
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
class vn {
  constructor(t, e) {
    Gt(this, "_props");
    Gt(this, "_object");
    Gt(this, "_parent", null);
    Gt(this, "_bindings", []);
    Gt(this, "_animations", []);
    this._props = e, this._object = t, this.hitArea = this.props.hitArea, (this.props.horizontalAlignment || this.props.verticalAlignment) && this._registerToSignal(G.signals.onResize, this._positionToScreen), this._onResize && this._registerToSignal(G.signals.onResize, this._onResize), this._onOrientationChange && this._registerToSignal(
      G.signals.onOrientationChange,
      this._onOrientationChange
    ), this._onTick && this._registerToSignal(G.signals.onTick, this._onTick), this._onClick && this.object.on("pointerdown", (i) => {
      i.stopImmediatePropagation(), this._onClick();
    }), this._onPointerUp && this.object.on("pointerup", (i) => {
      i.stopImmediatePropagation(), this._onPointerUp();
    }), this._onPointerEnter && this.object.on("pointerenter", () => {
      this._onPointerEnter();
    }), this._onPointerOut && this.object.on("pointerout", () => {
      this._onPointerOut();
    }), this._positionToScreen();
  }
  _registerToSignal(t, e) {
    this._bindings.push(bm(t, e.bind(this)));
  }
  _unregisterFromSignal(t) {
    for (let e = 0; e < this._bindings.length; e++)
      this._bindings[e].name === t && (Ba(t, this._bindings[e].binding), this._bindings.splice(e, 1), e--);
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
    t != null && t.circle ? this.object.hitArea = new dn(
      t.circle.x,
      t.circle.y,
      t.circle.radius
    ) : t != null && t.roundedRectangle ? this.object.hitArea = new pn(
      t.roundedRectangle.x,
      t.roundedRectangle.y,
      t.roundedRectangle.width,
      t.roundedRectangle.height,
      t.roundedRectangle.borderRadius
    ) : t != null && t.rectangle ? this.object.hitArea = new ft(
      t.rectangle.x,
      t.rectangle.y,
      t.rectangle.width,
      t.rectangle.height
    ) : t != null && t.polygon ? this.object.hitArea = new gi(t.polygon.points) : this.object.hitArea = null;
  }
  animate(t) {
    return this._createAnimation(this, t);
  }
  stopAnimations() {
    this._animations.forEach((t) => t.stop()), this._animations = [];
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
    zg(this), this._bindings.forEach(
      ({ name: t, binding: e }) => Ba(t, e)
    ), this._bindings = [], this.stopAnimations(), this.parent = null, this.object.destroy();
  }
  _positionToScreen() {
    var t, e, i, r;
    this.props.horizontalAlignment === "center" ? this.x = j.screen.width / 2 + (((t = this.props.margin) == null ? void 0 : t.x) ?? 0) : this.props.horizontalAlignment === "right" && (this.x = j.screen.width + (((e = this.props.margin) == null ? void 0 : e.x) ?? 0)), this.props.verticalAlignment === "center" ? this.y = j.screen.height / 2 + (((i = this.props.margin) == null ? void 0 : i.y) ?? 0) : this.props.verticalAlignment === "bottom" && (this.y = j.screen.height + (((r = this.props.margin) == null ? void 0 : r.y) ?? 0));
  }
  async _createAnimation(t, e) {
    const i = new Li(e);
    this._animations.push(i), await i.start(t);
    const r = this._animations.indexOf(i);
    this._animations.splice(r, 1);
  }
}
let is;
const Ce = /* @__PURE__ */ new Map(), Gg = () => {
  is = fe.get("audio/sounds.mp3");
  const s = fe.get("audio/sounds.json");
  is.muted = j.muted, is.addSprites(s);
}, Pc = async (s, t = {}) => {
  const { loop: e = !1, volume: i = 1 } = t, r = await is.play({
    sprite: s,
    loop: e,
    volume: i,
    complete: () => Ce.delete(s)
  });
  Ce.set(s, r);
}, v_ = async (s, t) => {
  const {
    fromVolume: e = 0.1,
    toVolume: i = 1,
    fadeDuration: r,
    loop: n = !1
  } = t;
  await Pc(s, { loop: n, volume: i }), await new Li({
    duration: r,
    from: { volume: e },
    to: { volume: i }
  }).start(Ce.get(s));
}, Vg = (s) => {
  var t, e;
  (t = Ce.get(s)) == null || t.stop(), (e = Ce.get(s)) == null || e.destroy(), Ce.delete(s);
}, b_ = async (s, t) => {
  const e = Ce.get(s);
  if (!e) return;
  const { fadeDuration: i } = t;
  await new Li({
    duration: i,
    from: { volume: e.volume },
    to: { volume: 0 }
  }).start(e), Vg(s);
}, Wg = (s) => {
  is.muted = s;
}, Ng = () => {
  for (const [s, t] of Ce)
    t.paused = !0;
}, Hg = () => {
  for (const [s, t] of Ce)
    t.paused = !1;
}, bn = (s) => ({
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
let Mc;
const Za = /* @__PURE__ */ new Map(), $g = (s) => {
  Mc = s;
}, Yg = (s) => {
  let t;
  if (s.rectangle)
    t = new Xe().rect(
      s.rectangle.x,
      s.rectangle.y,
      s.rectangle.width,
      s.rectangle.height
    );
  else if (s.roundedRectangle)
    t = new Xe().roundRect(
      s.roundedRectangle.x,
      s.roundedRectangle.y,
      s.roundedRectangle.width,
      s.roundedRectangle.height,
      s.roundedRectangle.borderRadius
    );
  else if (s.circle)
    t = new Xe().circle(
      s.circle.x,
      s.circle.y,
      s.circle.radius
    );
  else if (s.polygon)
    t = new Xe().poly(s.polygon.points);
  else
    throw new Error("Invalid shape type");
  return t = t.fill(s.fillColor), s.strokeColor != null && (t = t.stroke({
    color: s.strokeColor,
    width: s.strokeWidth ?? 0
  })), t;
}, $r = (s) => {
  const t = JSON.stringify(s);
  let e = Za.get(t);
  if (e) return e;
  if (typeof s == "string")
    e = W.from(s);
  else {
    const i = Yg(s);
    e = lo.create({
      width: i.width,
      height: i.height
    }), Mc.render({ container: i, target: e });
  }
  return Za.set(t, e), e;
};
class Tc extends vn {
  constructor(t) {
    super(
      new Ai({
        ...bn(t),
        texture: $r(t.resource)
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
    this.object.texture = $r(t);
  }
}
class kc extends Tc {
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
    Pc(G.sounds.click), this.texture = this.enabled ? this.props.resource : this.props.disabledResource, await this.delay(0.1), this._setCurrentTexture();
  }
  _setCurrentTexture() {
    this.enabled ? this.pointerOver ? this.texture = this.props.hoverResource : this.texture = this.props.resource : this.texture = this.props.disabledResource;
  }
}
class jg extends vn {
  constructor(e) {
    super(
      new Et({
        ...bn(e),
        sortableChildren: e.sortableChildren
      }),
      e
    );
    Gt(this, "_components", []);
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
    var e, i, r, n;
    this.props.horizontalAlignment === "center" ? this.x = (j.screen.width - (this.props.width ?? 0)) / 2 + (((e = this.props.margin) == null ? void 0 : e.x) ?? 0) : this.props.horizontalAlignment === "right" && (this.x = j.screen.width - (this.props.width ?? 0) + (((i = this.props.margin) == null ? void 0 : i.x) ?? 0)), this.props.verticalAlignment === "center" ? this.y = (j.screen.height - (this.props.height ?? 0)) / 2 + (((r = this.props.margin) == null ? void 0 : r.y) ?? 0) : this.props.verticalAlignment === "bottom" && (this.y = j.screen.height - (this.props.height ?? 0) + (((n = this.props.margin) == null ? void 0 : n.y) ?? 0));
  }
}
class w_ extends kc {
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
class Xg extends vn {
  constructor(t) {
    super(
      new gm({
        ...bn(t),
        texture: $r(t.resource)
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
}
class Kg extends Xg {
  constructor(t) {
    super(t), this._onResize();
  }
  _onResize() {
    this.width = j.screen.width, this.height = j.screen.height;
    const t = j.screen.height / this.originalHeight;
    this.tileScale = { x: t, y: t };
  }
}
class S_ extends Kg {
  _onTick() {
    this.tilePosition.x--;
  }
}
class Yr extends vn {
  constructor(t) {
    const e = {
      ...bn(t),
      text: t.text,
      style: {
        fontFamily: t.fontFamily,
        fontSize: t.fontSize,
        fill: t.textColor,
        lineHeight: t.lineHeight,
        wordWrap: t.wordWrap,
        wordWrapWidth: t.wordWrapWidth,
        align: t.align,
        stroke: t.strokeColor && {
          color: t.strokeColor,
          width: t.strokeWidth
        }
      }
    };
    super(t.bitmap ? new xm(e) : new _m(e), t);
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
  get text() {
    return this.object.text;
  }
  set text(t) {
    this.object.text = t;
  }
}
class A_ extends kc {
  constructor(e) {
    super(e);
    Gt(this, "_originalProps");
    this._originalProps = structuredClone(e), this._setResources();
  }
  get props() {
    return super.props;
  }
  async _onClick() {
    localStorage.setItem("muted", j.muted ? "false" : "true"), j.muted = !j.muted, Wg(j.muted), this._setResources(), super._onClick();
  }
  _setResources() {
    j.muted ? (this.props.resource = this._originalProps.mutedResource, this.props.hoverResource = this._originalProps.mutedHoverResource, this.props.disabledResource = this._originalProps.mutedDisabledResource) : (this.props.resource = this._originalProps.resource, this.props.hoverResource = this._originalProps.hoverResource, this.props.disabledResource = this._originalProps.disabledResource), this._setCurrentTexture();
  }
}
class Ec extends jg {
  constructor(t = "Scene") {
    super({ label: t });
  }
  async init() {
  }
}
class qg extends Ec {
  async init() {
    this.addComponent(
      new Yr({
        label: "loading-text",
        text: G.loadingScene.text,
        anchor: { x: 0.5, y: 0.5 },
        fontFamily: G.loadingScene.fontFamily,
        fontSize: G.loadingScene.fontSize,
        textColor: G.loadingScene.textColor,
        horizontalAlignment: "center",
        verticalAlignment: "center"
      })
    );
  }
}
const Zg = (s, t, e = 500, i = 1e3) => {
  let r = null, n = !1;
  return { start: () => {
    r != null && clearTimeout(r), r = setTimeout(() => {
      n = !0, r = null, s();
    }, e);
  }, cancel: () => {
    r != null && (clearTimeout(r), r = null), n ? r = setTimeout(() => {
      n = !1, r = null, t();
    }, i) : t();
  } };
}, Qg = (s, t, e, i) => {
  const r = s.clientWidth, n = s.clientHeight;
  if (r < n) {
    const d = e;
    e = i, i = d;
  }
  const o = Math.min(
    r / e,
    n / i
  ), a = Math.floor(o * e), l = Math.floor(o * i), c = (r - a) / 2, h = (n - l) / 2;
  t.style.width = `${a}px`, t.style.height = `${l}px`, t.style.left = `${c}px`, t.style.top = `${h}px`, t.width = e, t.height = i;
  const f = e < i ? "portrait" : "landscape";
  return {
    width: e,
    height: i,
    orientation: f
  };
};
let Ic;
function Jg(s) {
  return Ic = s, s;
}
function _s() {
  return Ic;
}
class jr {
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
      const i = _s().context;
      t.setValueAtTime(e, i.audioContext.currentTime);
    } else
      t.value = e;
    return e;
  }
}
class t_ extends Mt {
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
let e_ = 0;
const Xr = class extends Mt {
  /** @param parent - Parent element */
  constructor(s) {
    super(), this.id = e_++, this.init(s);
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
    const e = s.volume * (s.muted ? 0 : 1), i = t.volume * (t.muted ? 0 : 1), r = this._volume * (this._muted ? 0 : 1);
    this._source.volume = r * e * i, this._source.playbackRate = this._speed * s.speed * t.speed;
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
    const { start: t, end: e, speed: i, loop: r, volume: n, muted: o } = s;
    e && console.assert(e > t, "End time is before start time"), this._speed = i, this._volume = n, this._loop = !!r, this._muted = o, this.refresh(), this.loop && e !== null && (console.warn('Looping not support when specifying an "end" time'), this.loop = !1), this._start = t, this._end = e || this._duration, this._start = Math.max(0, this._start - Xr.PADDING), this._end = Math.min(this._end + Xr.PADDING, this._duration), this._source.onloadedmetadata = () => {
      this._source && (this._source.currentTime = t, this._source.onloadedmetadata = null, this.emit("progress", t / this._duration, this._duration), we.shared.add(this._onUpdate, this));
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
    we.shared.remove(this._onUpdate, this), this._internalStop(), this.emit("progress", 1, this._duration), this.emit("end", this);
  }
  /** Don't use after this. */
  destroy() {
    we.shared.remove(this._onUpdate, this), this.removeAllListeners();
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
let Bc = Xr;
Bc.PADDING = 0.1;
class i_ extends Mt {
  init(t) {
    this.parent = t, this._source = t.options.source || new Audio(), t.url && (this._source.src = t.url);
  }
  // Implement create
  create() {
    return new Bc(this);
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
      const l = i.autoPlayStart();
      t && setTimeout(() => {
        t(null, i, l);
      }, 0);
      return;
    }
    if (!i.url) {
      t(new Error("sound.url or sound.source must be set"));
      return;
    }
    e.src = i.url;
    const r = () => {
      a(), i.isLoaded = !0;
      const l = i.autoPlayStart();
      t && t(null, i, l);
    }, n = () => {
      a(), t && t(new Error("Sound loading has been aborted"));
    }, o = () => {
      a();
      const l = `Failed to load audio element (code: ${e.error.code})`;
      t ? t(new Error(l)) : console.error(l);
    }, a = () => {
      e.removeEventListener("canplaythrough", r), e.removeEventListener("load", r), e.removeEventListener("abort", n), e.removeEventListener("error", o);
    };
    e.addEventListener("canplaythrough", r, !1), e.addEventListener("load", r, !1), e.addEventListener("abort", n, !1), e.addEventListener("error", o, !1), e.load();
  }
}
class s_ {
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
const nn = [
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
], n_ = [
  "audio/mpeg",
  "audio/ogg"
], rn = {};
function r_(s) {
  const t = {
    m4a: "audio/mp4",
    oga: "audio/ogg",
    opus: 'audio/ogg; codecs="opus"',
    caf: 'audio/x-caf; codecs="opus"'
  }, e = document.createElement("audio"), i = {}, r = /^no$/;
  nn.forEach((n) => {
    const o = e.canPlayType(`audio/${n}`).replace(r, ""), a = t[n] ? e.canPlayType(t[n]).replace(r, "") : "";
    i[n] = !!o || !!a;
  }), Object.assign(rn, i);
}
r_();
let o_ = 0;
class a_ extends Mt {
  constructor(t) {
    super(), this.id = o_++, this._media = null, this._paused = !1, this._muted = !1, this._elapsed = 0, this.init(t);
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
    const i = t.volume * (t.muted ? 0 : 1), r = e.volume * (e.muted ? 0 : 1), n = this._volume * (this._muted ? 0 : 1);
    jr.setParamValue(this._gain.gain, n * r * i), jr.setParamValue(this._source.playbackRate, this._speed * e.speed * t.speed), this.applyFilters();
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
    const { start: e, end: i, speed: r, loop: n, volume: o, muted: a, filters: l } = t;
    i && console.assert(i > e, "End time is before start time"), this._paused = !1;
    const { source: c, gain: h } = this._media.nodes.cloneBufferSource();
    this._source = c, this._gain = h, this._speed = r, this._volume = o, this._loop = !!n, this._muted = a, this._filters = l, this.refresh();
    const f = this._source.buffer.duration;
    this._duration = f, this._end = i, this._lastUpdate = this._now(), this._elapsed = e, this._source.onended = this._onComplete.bind(this), this._loop ? (this._source.loopEnd = i, this._source.loopStart = e, this._source.start(0, e)) : i ? this._source.start(0, e, i - e) : this._source.start(0, e), this.emit("start"), this._update(!0), this.enableTicker(!0);
  }
  /** Start the update progress. */
  enableTicker(t) {
    we.shared.remove(this._updateListener, this), t && we.shared.add(this._updateListener, this);
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
        const r = this._source.playbackRate.value;
        this._elapsed += i * r, this._lastUpdate = e;
        const n = this._duration;
        let o;
        if (this._source.loopStart) {
          const a = this._source.loopEnd - this._source.loopStart;
          o = (this._source.loopStart + this._elapsed % a) / n;
        } else
          o = this._elapsed % n / n;
        this._progress = o, this.emit("progress", this._progress, n);
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
class Rc {
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
const Fc = class extends Rc {
  /**
   * @param context - The audio context.
   */
  constructor(s) {
    const t = s.audioContext, e = t.createBufferSource(), i = t.createGain(), r = t.createAnalyser();
    e.connect(r), r.connect(i), i.connect(s.destination), super(r, i), this.context = s, this.bufferSource = e, this.gain = i, this.analyser = r;
  }
  /**
   * Get the script processor node.
   * @readonly
   */
  get script() {
    return this._script || (this._script = this.context.audioContext.createScriptProcessor(Fc.BUFFER_SIZE), this._script.connect(this.context.destination)), this._script;
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
    t.buffer = s.buffer, jr.setParamValue(t.playbackRate, s.playbackRate.value), t.loop = s.loop;
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
let Lc = Fc;
Lc.BUFFER_SIZE = 0;
class l_ {
  /**
   * Re-initialize without constructing.
   * @param parent - - Instance of parent Sound container
   */
  init(t) {
    this.parent = t, this._nodes = new Lc(this.context), this._source = this._nodes.bufferSource, this.source = t.options.source;
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
    return new a_(this);
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
    const i = (r, n) => {
      if (r)
        e && e(r);
      else {
        this.parent.isLoaded = !0, this.buffer = n;
        const o = this.parent.autoPlayStart();
        e && e(null, this.parent, o);
      }
    };
    t instanceof AudioBuffer ? i(null, t) : this.parent.context.decode(t, i);
  }
}
const ui = class {
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
    const e = _s().useLegacy ? new i_() : new l_();
    return new ui(e, t);
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
    const [t] = s.map((e) => ({ url: e, ext: bt.extname(e).slice(1) })).filter(({ ext: e }) => rn[e]).sort((e, i) => nn.indexOf(e.ext) - nn.indexOf(i.ext));
    if (!t)
      throw new Error("No supported file type found");
    return t.url;
  }
  /** Instance of the media context. */
  get context() {
    return _s().context;
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
      for (const r in s)
        i[r] = this.addSprites(r, s[r]);
      return i;
    }
    console.assert(!this._sprites[s], `Alias ${s} is already taken`);
    const e = new s_(this, t);
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
      const r = e.sprite;
      console.assert(!!this._sprites[r], `Alias ${r} is not available`);
      const n = this._sprites[r];
      e.start = n.start + (e.start || 0), e.end = n.end, e.speed = n.speed || 1, e.loop = n.loop || e.loop, delete e.sprite;
    }
    if (e.offset && (e.start = e.offset), !this.isLoaded)
      return this._preloadQueue ? new Promise((r) => {
        this._preloadQueue.push(() => {
          r(this.play(e));
        });
      }) : (this._preloadQueue = [], this.autoPlay = !0, this._autoPlayOptions = e, new Promise((r, n) => {
        this._preload((o, a, l) => {
          this._preloadQueue.forEach((c) => c()), this._preloadQueue = null, o ? n(o) : (e.loaded && e.loaded(o, a, l), r(l));
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
    if (ui._pool.length > 0) {
      const s = ui._pool.pop();
      return s.init(this.media), s;
    }
    return this.media.create();
  }
  /**
   * Destroy/recycling the instance object.
   * @param instance - Instance to recycle
   */
  _poolInstance(s) {
    s.destroy(), ui._pool.indexOf(s) < 0 && ui._pool.push(s);
  }
};
let on = ui;
on._pool = [];
class xs extends Rc {
  constructor() {
    const t = window, e = new xs.AudioContext(), i = e.createDynamicsCompressor(), r = e.createAnalyser();
    r.connect(i), i.connect(e.destination), super(r, i), this.autoPause = !0, this._ctx = e, this._offlineCtx = new xs.OfflineAudioContext(
      1,
      2,
      t.OfflineAudioContext ? Math.max(8e3, Math.min(96e3, e.sampleRate)) : 44100
    ), this.compressor = i, this.analyser = r, this.events = new Mt(), this.volume = 1, this.speed = 1, this.muted = !1, this.paused = !1, this._locked = e.state === "suspended" && ("ontouchstart" in globalThis || "onclick" in globalThis), this._locked && (this._unlock(), this._unlock = this._unlock.bind(this), document.addEventListener("mousedown", this._unlock, !0), document.addEventListener("touchstart", this._unlock, !0), document.addEventListener("touchend", this._unlock, !0)), this.onFocus = this.onFocus.bind(this), this.onBlur = this.onBlur.bind(this), globalThis.addEventListener("focus", this.onFocus), globalThis.addEventListener("blur", this.onBlur);
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
    const i = (n) => {
      e(new Error((n == null ? void 0 : n.message) || "Unable to decode file"));
    }, r = this._offlineCtx.decodeAudioData(
      t,
      (n) => {
        e(null, n);
      },
      i
    );
    r && r.catch(i);
  }
}
class h_ {
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
    return this.supported && (this._webAudioContext = new xs()), this._htmlAudioContext = new t_(), this._sounds = {}, this.useLegacy = !this.supported, this;
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
    return xs.AudioContext !== null;
  }
  /**
   * @ignore
   */
  add(t, e) {
    if (typeof t == "object") {
      const n = {};
      for (const o in t) {
        const a = this._getOptions(
          t[o],
          e
        );
        n[o] = this.add(o, a);
      }
      return n;
    }
    if (console.assert(!this._sounds[t], `Sound with alias ${t} already exists.`), e instanceof on)
      return this._sounds[t] = e, e;
    const i = this._getOptions(e), r = on.from(i);
    return this._sounds[t] = r, r;
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
const Qa = (s) => {
  var i;
  const t = s.src;
  let e = (i = s == null ? void 0 : s.alias) == null ? void 0 : i[0];
  return (!e || s.src === e) && (e = bt.basename(t, bt.extname(t))), e;
}, c_ = {
  extension: D.Asset,
  detection: {
    test: async () => !0,
    add: async (s) => [...s, ...nn.filter((t) => rn[t])],
    remove: async (s) => s.filter((t) => s.includes(t))
  },
  loader: {
    name: "sound",
    extension: {
      type: [D.LoadParser],
      priority: Te.High
    },
    /** Should we attempt to load this file? */
    test(s) {
      const t = bt.extname(s).slice(1);
      return !!rn[t] || n_.some((e) => s.startsWith(`data:${e}`));
    },
    /** Load the sound file, this is mostly handled by Sound.from() */
    async load(s, t) {
      const e = await new Promise((i, r) => on.from({
        ...t.data,
        url: s,
        preload: !0,
        loaded(n, o) {
          var a, l;
          n ? r(n) : i(o), (l = (a = t.data) == null ? void 0 : a.loaded) == null || l.call(a, n, o);
        }
      }));
      return _s().add(Qa(t), e), e;
    },
    /** Remove the sound from the library */
    async unload(s, t) {
      _s().remove(Qa(t));
    }
  }
};
At.add(c_);
Jg(new h_());
class u_ extends Ec {
  constructor() {
    super("Pause"), this.visible = !1, this.zIndex = 1e3;
  }
  async init() {
    this.addComponent(
      new Tc({
        label: "overlay",
        resource: {
          fillColor: G.pauseScene.overlayColor,
          rectangle: {
            x: 0,
            y: 0,
            width: G.screen.width,
            height: G.screen.width
          }
        },
        alpha: G.pauseScene.overlayAlpha
      })
    ), this.addComponent(
      new Yr({
        label: "title",
        text: G.pauseScene.title,
        fontFamily: G.pauseScene.fontFamily,
        fontSize: G.pauseScene.titleFontSize,
        textColor: G.pauseScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: "center",
        verticalAlignment: "center",
        margin: { x: 0, y: -50 }
      })
    ), this.addComponent(
      new Yr({
        label: "subtitle",
        text: G.pauseScene.subTitle,
        fontFamily: G.pauseScene.fontFamily,
        fontSize: G.pauseScene.subTitleFontSize,
        textColor: G.pauseScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: "center",
        verticalAlignment: "center",
        margin: { x: 0, y: 50 }
      })
    );
  }
}
let Tt, qi = !1, ss;
const Oc = () => G.screen.width * 1 / G.screen.aspectRatio, Ja = () => {
  const { width: s, height: t, orientation: e } = Qg(
    G.gameContainer,
    Tt.canvas,
    G.screen.width,
    Oc()
  );
  (s !== j.screen.width || t !== j.screen.height) && (j.screen.width = s, j.screen.height = t, Tt.renderer.resize(s, t), Ks(G.signals.onResize));
  const i = j.screen.orientation !== e;
  j.screen.orientation = e, i && Ks(G.signals.onOrientationChange);
}, f_ = () => {
  const { start: s } = Zg(
    () => {
      Ja();
    },
    () => {
    },
    100
  );
  new ResizeObserver(() => {
    s();
  }).observe(G.gameContainer), Ja();
}, d_ = () => {
  let s = 0, t = 0, e = 0;
  G.debug && setInterval(() => {
    console.log(
      t === 0 ? 0 : Math.floor(e / t)
    ), t = 0, e = 0;
  }, 1e3), Tt.ticker.maxFPS = G.maxFPS, Tt.ticker.add((i) => {
    if (G.debug && (e += Math.floor(i.FPS), t++), !qi)
      for (s += i.deltaMS; s >= G.tickIntervalMillis; )
        Ks(G.signals.onTick), Li.updateEngine(G.tickIntervalMillis), Dg(G.tickIntervalMillis), s -= G.tickIntervalMillis;
  });
}, p_ = () => {
  let s = !1, t = null;
  window.addEventListener("focus", () => {
    s = !0, qi && (qi = !1, ss.visible = !1, Hg(), t != null && clearTimeout(t), t = setTimeout(() => {
      t = null, Tt.stage.eventMode = "passive";
    }, 100));
  }), window.addEventListener("blur", () => {
    qi || !s || (qi = !0, ss.visible = !0, Tt.stage.eventMode = "none", Ng(), t != null && clearTimeout(t));
  });
}, m_ = async (s) => {
  j.scene && (j.scene.destroy(), Tt.stage.removeChild(j.scene.object)), j.scene = s, Tt.stage.addChild(j.scene.object), await s.init();
}, C_ = async () => {
  G.gameContainer.style.backgroundColor = G.colors.backgroundColor, Tt = new jl(), await Tt.init({
    backgroundColor: G.colors.backgroundColor,
    width: G.screen.width,
    height: Oc()
  }), G.debug && (globalThis.__PIXI_APP__ = Tt), G.gameContainer.appendChild(Tt.canvas), Tt.canvas.style.position = "absolute", $g(Tt.renderer), ss = new u_(), await ss.init(), Tt.stage.addChild(ss.object), m_(new qg()), f_(), Og(), Li.initEngine(), d_(), p_(), await Promise.all([
    new Promise(
      (s) => setTimeout(s, G.loadingScene.keepAliveTimeMS)
    ),
    (async () => {
      await fe.init({
        basePath: G.assets.basePath,
        manifest: G.assets.manifest
      }), fe.addBundle("extra", G.assets.extra), await Promise.all([
        fe.loadBundle("default"),
        fe.loadBundle("extra")
      ]), Gg();
    })()
  ]), Ks(G.signals.destroyLoadingScene);
}, P_ = (s, t) => Math.floor(Math.random() * (t - s) + s);
export {
  Hl as $,
  Nl as A,
  Bt as B,
  Et as C,
  ot as D,
  D as E,
  cl as F,
  hn as G,
  me as H,
  Ho as I,
  Ai as J,
  Xu as K,
  nf as L,
  H as M,
  gt as N,
  ft as O,
  St as P,
  wf as Q,
  pr as R,
  Wf as S,
  _e as T,
  cr as U,
  Yo as V,
  Mu as W,
  Bn as X,
  dt as Y,
  fl as Z,
  lo as _,
  W as a,
  $ as a0,
  Y as a1,
  Mf as a2,
  Xf as a3,
  dd as a4,
  md as a5,
  vd as a6,
  wd as a7,
  Sd as a8,
  Si as a9,
  A_ as aA,
  Og as aB,
  Dg as aC,
  x_ as aD,
  zg as aE,
  Ug as aF,
  y_ as aG,
  Ec as aH,
  qg as aI,
  Li as aJ,
  m_ as aK,
  C_ as aL,
  bm as aM,
  Ba as aN,
  Ks as aO,
  Gg as aP,
  Pc as aQ,
  v_ as aR,
  Vg as aS,
  b_ as aT,
  Wg as aU,
  Ng as aV,
  Hg as aW,
  P_ as aX,
  Zg as aY,
  ii as aa,
  dp as ab,
  oh as ac,
  ia as ad,
  ta as ae,
  Jc as af,
  Mr as ag,
  yp as ah,
  Xe as ai,
  st as aj,
  eu as ak,
  Pr as al,
  Cr as am,
  Aa as an,
  lh as ao,
  G as ap,
  j as aq,
  vn as ar,
  kc as as,
  jg as at,
  w_ as au,
  S_ as av,
  Tc as aw,
  Yr as ax,
  Kg as ay,
  Xg as az,
  we as b,
  Mt as c,
  ls as d,
  At as e,
  ea as f,
  Uf as g,
  zs as h,
  Qr as i,
  Gl as j,
  wl as k,
  Ol as l,
  Sa as m,
  Bo as n,
  fd as o,
  pd as p,
  xd as q,
  du as r,
  ql as s,
  bd as t,
  Jr as u,
  Bl as v,
  ct as w,
  tu as x,
  Cd as y,
  Se as z
};
