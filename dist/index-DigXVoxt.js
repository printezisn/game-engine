var Ec = Object.defineProperty;
var Ic = (n, t, e) => t in n ? Ec(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var te = (n, t, e) => Ic(n, typeof t != "symbol" ? t + "" : t, e);
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
    keepAliveTimeMS: 2e3
  },
  signals: {
    onResize: "onResize",
    onOrientationChange: "onOrientationChange",
    onTick: "onTick",
    destroyLoadingScene: "destroyLoadingScene",
    showCredits: "showCredits"
  },
  sounds: {
    click: "click"
  }
}, X = {
  screen: {
    orientation: "landscape",
    width: 0,
    height: 0
  },
  scene: null,
  muted: localStorage.getItem("muted") === "true"
};
var $e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Nr(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var jo = {}, on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.MiniSignal = void 0;
const er = Symbol("SIGNAL");
function Bc(n) {
  return typeof n == "object" && er in n;
}
class Rc {
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
    if (!Bc(t))
      throw new Error("MiniSignal#detach(): First arg must be a MiniSignal listener reference.");
    if (t[er] !== this._symbol)
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
    const e = { [er]: this._symbol };
    return this._refMap.set(e, t), e;
  }
  _getRef(t) {
    return this._refMap.get(t);
  }
}
on.MiniSignal = Rc;
(function(n) {
  var t = $e && $e.__createBinding || (Object.create ? function(i, r, s, a) {
    a === void 0 && (a = s);
    var o = Object.getOwnPropertyDescriptor(r, s);
    (!o || ("get" in o ? !r.__esModule : o.writable || o.configurable)) && (o = { enumerable: !0, get: function() {
      return r[s];
    } }), Object.defineProperty(i, a, o);
  } : function(i, r, s, a) {
    a === void 0 && (a = s), i[a] = r[s];
  }), e = $e && $e.__exportStar || function(i, r) {
    for (var s in i) s !== "default" && !Object.prototype.hasOwnProperty.call(r, s) && t(r, i, s);
  };
  Object.defineProperty(n, "__esModule", { value: !0 }), e(on, n);
})(jo);
const $s = /* @__PURE__ */ new Map(), Fc = (n, t) => {
  let e = $s.get(n);
  return e || (e = new jo.MiniSignal(), $s.set(n, e)), { name: n, binding: e.add(t) };
}, Ca = (n, t) => {
  const e = $s.get(n);
  e && e.detach(t);
}, es = (n, ...t) => {
  const e = $s.get(n);
  e && e.dispatch(...t);
};
function ye(n) {
  if (n === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return n;
}
function Ko(n, t) {
  n.prototype = Object.create(t.prototype), n.prototype.constructor = n, n.__proto__ = t;
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
var Nt = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, yi = {
  duration: 0.5,
  overwrite: !1,
  delay: 0
}, Hr, At, tt, Xt = 1e8, q = 1 / Xt, ir = Math.PI * 2, Lc = ir / 4, Oc = 0, qo = Math.sqrt, Dc = Math.cos, zc = Math.sin, vt = function(t) {
  return typeof t == "string";
}, ot = function(t) {
  return typeof t == "function";
}, Ae = function(t) {
  return typeof t == "number";
}, $r = function(t) {
  return typeof t > "u";
}, me = function(t) {
  return typeof t == "object";
}, Bt = function(t) {
  return t !== !1;
}, Yr = function() {
  return typeof window < "u";
}, Ss = function(t) {
  return ot(t) || vt(t);
}, Zo = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
}, Ct = Array.isArray, sr = /(?:-?\.?\d|\.)+/gi, Qo = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, ci = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, yn = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, Jo = /[+-]=-?[.\d]+/, tl = /[^,'"\[\]\s]+/gi, Uc = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, it, ce, nr, Xr, Ht = {}, Ys = {}, el, il = function(t) {
  return (Ys = Je(t, Ht)) && Ot;
}, jr = function(t, e) {
  return console.warn("Invalid property", t, "set to", e, "Missing plugin? gsap.registerPlugin()");
}, is = function(t, e) {
  return !e && console.warn(t);
}, sl = function(t, e) {
  return t && (Ht[t] = e) && Ys && (Ys[t] = e) || Ht;
}, ss = function() {
  return 0;
}, Gc = {
  suppressEvents: !0,
  isStart: !0,
  kill: !1
}, Ds = {
  suppressEvents: !0,
  kill: !1
}, Vc = {
  suppressEvents: !0
}, Kr = {}, Be = [], rr = {}, nl, Gt = {}, vn = {}, Pa = 30, zs = [], qr = "", Zr = function(t) {
  var e = t[0], i, r;
  if (me(e) || ot(e) || (t = [t]), !(i = (e._gsap || {}).harness)) {
    for (r = zs.length; r-- && !zs[r].targetTest(e); )
      ;
    i = zs[r];
  }
  for (r = t.length; r--; )
    t[r] && (t[r]._gsap || (t[r]._gsap = new Tl(t[r], i))) || t.splice(r, 1);
  return t;
}, Ke = function(t) {
  return t._gsap || Zr(jt(t))[0]._gsap;
}, rl = function(t, e, i) {
  return (i = t[e]) && ot(i) ? t[e]() : $r(i) && t.getAttribute && t.getAttribute(e) || i;
}, Rt = function(t, e) {
  return (t = t.split(",")).forEach(e) || t;
}, ht = function(t) {
  return Math.round(t * 1e5) / 1e5 || 0;
}, yt = function(t) {
  return Math.round(t * 1e7) / 1e7 || 0;
}, pi = function(t, e) {
  var i = e.charAt(0), r = parseFloat(e.substr(2));
  return t = parseFloat(t), i === "+" ? t + r : i === "-" ? t - r : i === "*" ? t * r : t / r;
}, Wc = function(t, e) {
  for (var i = e.length, r = 0; t.indexOf(e[r]) < 0 && ++r < i; )
    ;
  return r < i;
}, Xs = function() {
  var t = Be.length, e = Be.slice(0), i, r;
  for (rr = {}, Be.length = 0, i = 0; i < t; i++)
    r = e[i], r && r._lazy && (r.render(r._lazy[0], r._lazy[1], !0)._lazy = 0);
}, al = function(t, e, i, r) {
  Be.length && !At && Xs(), t.render(e, i, At && e < 0 && (t._initted || t._startAt)), Be.length && !At && Xs();
}, ol = function(t) {
  var e = parseFloat(t);
  return (e || e === 0) && (t + "").match(tl).length < 2 ? e : vt(t) ? t.trim() : t;
}, ll = function(t) {
  return t;
}, qt = function(t, e) {
  for (var i in e)
    i in t || (t[i] = e[i]);
  return t;
}, Nc = function(t) {
  return function(e, i) {
    for (var r in i)
      r in e || r === "duration" && t || r === "ease" || (e[r] = i[r]);
  };
}, Je = function(t, e) {
  for (var i in e)
    t[i] = e[i];
  return t;
}, Ma = function n(t, e) {
  for (var i in e)
    i !== "__proto__" && i !== "constructor" && i !== "prototype" && (t[i] = me(e[i]) ? n(t[i] || (t[i] = {}), e[i]) : e[i]);
  return t;
}, js = function(t, e) {
  var i = {}, r;
  for (r in t)
    r in e || (i[r] = t[r]);
  return i;
}, ji = function(t) {
  var e = t.parent || it, i = t.keyframes ? Nc(Ct(t.keyframes)) : qt;
  if (Bt(t.inherit))
    for (; e; )
      i(t, e.vars.defaults), e = e.parent || e._dp;
  return t;
}, Hc = function(t, e) {
  for (var i = t.length, r = i === e.length; r && i-- && t[i] === e[i]; )
    ;
  return i < 0;
}, hl = function(t, e, i, r, s) {
  var a = t[r], o;
  if (s)
    for (o = e[s]; a && a[s] > o; )
      a = a._prev;
  return a ? (e._next = a._next, a._next = e) : (e._next = t[i], t[i] = e), e._next ? e._next._prev = e : t[r] = e, e._prev = a, e.parent = e._dp = t, e;
}, ln = function(t, e, i, r) {
  i === void 0 && (i = "_first"), r === void 0 && (r = "_last");
  var s = e._prev, a = e._next;
  s ? s._next = a : t[i] === e && (t[i] = a), a ? a._prev = s : t[r] === e && (t[r] = s), e._next = e._prev = e.parent = null;
}, Fe = function(t, e) {
  t.parent && (!e || t.parent.autoRemoveChildren) && t.parent.remove && t.parent.remove(t), t._act = 0;
}, qe = function(t, e) {
  if (t && (!e || e._end > t._dur || e._start < 0))
    for (var i = t; i; )
      i._dirty = 1, i = i.parent;
  return t;
}, $c = function(t) {
  for (var e = t.parent; e && e.parent; )
    e._dirty = 1, e.totalDuration(), e = e.parent;
  return t;
}, ar = function(t, e, i, r) {
  return t._startAt && (At ? t._startAt.revert(Ds) : t.vars.immediateRender && !t.vars.autoRevert || t._startAt.render(e, !0, r));
}, Yc = function n(t) {
  return !t || t._ts && n(t.parent);
}, Ta = function(t) {
  return t._repeat ? vi(t._tTime, t = t.duration() + t._rDelay) * t : 0;
}, vi = function(t, e) {
  var i = Math.floor(t /= e);
  return t && i === t ? i - 1 : i;
}, Ks = function(t, e) {
  return (t - e._start) * e._ts + (e._ts >= 0 ? 0 : e._dirty ? e.totalDuration() : e._tDur);
}, hn = function(t) {
  return t._end = yt(t._start + (t._tDur / Math.abs(t._ts || t._rts || q) || 0));
}, cn = function(t, e) {
  var i = t._dp;
  return i && i.smoothChildTiming && t._ts && (t._start = yt(i._time - (t._ts > 0 ? e / t._ts : ((t._dirty ? t.totalDuration() : t._tDur) - e) / -t._ts)), hn(t), i._dirty || qe(i, t)), t;
}, cl = function(t, e) {
  var i;
  if ((e._time || !e._dur && e._initted || e._start < t._time && (e._dur || !e.add)) && (i = Ks(t.rawTime(), e), (!e._dur || _s(0, e.totalDuration(), i) - e._tTime > q) && e.render(i, !0)), qe(t, e)._dp && t._initted && t._time >= t._dur && t._ts) {
    if (t._dur < t.duration())
      for (i = t; i._dp; )
        i.rawTime() >= 0 && i.totalTime(i._tTime), i = i._dp;
    t._zTime = -q;
  }
}, ue = function(t, e, i, r) {
  return e.parent && Fe(e), e._start = yt((Ae(i) ? i : i || t !== it ? $t(t, i, e) : t._time) + e._delay), e._end = yt(e._start + (e.totalDuration() / Math.abs(e.timeScale()) || 0)), hl(t, e, "_first", "_last", t._sort ? "_start" : 0), or(e) || (t._recent = e), r || cl(t, e), t._ts < 0 && cn(t, t._tTime), t;
}, ul = function(t, e) {
  return (Ht.ScrollTrigger || jr("scrollTrigger", e)) && Ht.ScrollTrigger.create(e, t);
}, fl = function(t, e, i, r, s) {
  if (Jr(t, e, s), !t._initted)
    return 1;
  if (!i && t._pt && !At && (t._dur && t.vars.lazy !== !1 || !t._dur && t.vars.lazy) && nl !== Vt.frame)
    return Be.push(t), t._lazy = [s, r], 1;
}, Xc = function n(t) {
  var e = t.parent;
  return e && e._ts && e._initted && !e._lock && (e.rawTime() < 0 || n(e));
}, or = function(t) {
  var e = t.data;
  return e === "isFromStart" || e === "isStart";
}, jc = function(t, e, i, r) {
  var s = t.ratio, a = e < 0 || !e && (!t._start && Xc(t) && !(!t._initted && or(t)) || (t._ts < 0 || t._dp._ts < 0) && !or(t)) ? 0 : 1, o = t._rDelay, l = 0, c, h, f;
  if (o && t._repeat && (l = _s(0, t._tDur, e), h = vi(l, o), t._yoyo && h & 1 && (a = 1 - a), h !== vi(t._tTime, o) && (s = 1 - a, t.vars.repeatRefresh && t._initted && t.invalidate())), a !== s || At || r || t._zTime === q || !e && t._zTime) {
    if (!t._initted && fl(t, e, r, i, l))
      return;
    for (f = t._zTime, t._zTime = e || (i ? q : 0), i || (i = e && !f), t.ratio = a, t._from && (a = 1 - a), t._time = 0, t._tTime = l, c = t._pt; c; )
      c.r(a, c.d), c = c._next;
    e < 0 && ar(t, e, i, !0), t._onUpdate && !i && Wt(t, "onUpdate"), l && t._repeat && !i && t.parent && Wt(t, "onRepeat"), (e >= t._tDur || e < 0) && t.ratio === a && (a && Fe(t, 1), !i && !At && (Wt(t, a ? "onComplete" : "onReverseComplete", !0), t._prom && t._prom()));
  } else t._zTime || (t._zTime = e);
}, Kc = function(t, e, i) {
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
}, wi = function(t, e, i, r) {
  var s = t._repeat, a = yt(e) || 0, o = t._tTime / t._tDur;
  return o && !r && (t._time *= a / t._dur), t._dur = a, t._tDur = s ? s < 0 ? 1e10 : yt(a * (s + 1) + t._rDelay * s) : a, o > 0 && !r && cn(t, t._tTime = t._tDur * o), t.parent && hn(t), i || qe(t.parent, t), t;
}, ka = function(t) {
  return t instanceof Tt ? qe(t) : wi(t, t._dur);
}, qc = {
  _start: 0,
  endTime: ss,
  totalDuration: ss
}, $t = function n(t, e, i) {
  var r = t.labels, s = t._recent || qc, a = t.duration() >= Xt ? s.endTime(!1) : t._dur, o, l, c;
  return vt(e) && (isNaN(e) || e in r) ? (l = e.charAt(0), c = e.substr(-1) === "%", o = e.indexOf("="), l === "<" || l === ">" ? (o >= 0 && (e = e.replace(/=/, "")), (l === "<" ? s._start : s.endTime(s._repeat >= 0)) + (parseFloat(e.substr(1)) || 0) * (c ? (o < 0 ? s : i).totalDuration() / 100 : 1)) : o < 0 ? (e in r || (r[e] = a), r[e]) : (l = parseFloat(e.charAt(o - 1) + e.substr(o + 1)), c && i && (l = l / 100 * (Ct(i) ? i[0] : i).totalDuration()), o > 1 ? n(t, e.substr(0, o - 1), i) + l : a + l)) : e == null ? a : +e;
}, Ki = function(t, e, i) {
  var r = Ae(e[1]), s = (r ? 2 : 1) + (t < 2 ? 0 : 1), a = e[s], o, l;
  if (r && (a.duration = e[1]), a.parent = i, t) {
    for (o = a, l = i; l && !("immediateRender" in o); )
      o = l.vars.defaults || {}, l = Bt(l.vars.inherit) && l.parent;
    a.immediateRender = Bt(o.immediateRender), t < 2 ? a.runBackwards = 1 : a.startAt = e[s - 1];
  }
  return new ut(e[0], a, e[s + 1]);
}, Oe = function(t, e) {
  return t || t === 0 ? e(t) : e;
}, _s = function(t, e, i) {
  return i < t ? t : i > e ? e : i;
}, bt = function(t, e) {
  return !vt(t) || !(e = Uc.exec(t)) ? "" : e[1];
}, Zc = function(t, e, i) {
  return Oe(i, function(r) {
    return _s(t, e, r);
  });
}, lr = [].slice, dl = function(t, e) {
  return t && me(t) && "length" in t && (!e && !t.length || t.length - 1 in t && me(t[0])) && !t.nodeType && t !== ce;
}, Qc = function(t, e, i) {
  return i === void 0 && (i = []), t.forEach(function(r) {
    var s;
    return vt(r) && !e || dl(r, 1) ? (s = i).push.apply(s, jt(r)) : i.push(r);
  }) || i;
}, jt = function(t, e, i) {
  return tt && !e && tt.selector ? tt.selector(t) : vt(t) && !i && (nr || !bi()) ? lr.call((e || Xr).querySelectorAll(t), 0) : Ct(t) ? Qc(t, i) : dl(t) ? lr.call(t, 0) : t ? [t] : [];
}, hr = function(t) {
  return t = jt(t)[0] || is("Invalid scope") || {}, function(e) {
    var i = t.current || t.nativeElement || t;
    return jt(e, i.querySelectorAll ? i : i === t ? is("Invalid scope") || Xr.createElement("div") : t);
  };
}, pl = function(t) {
  return t.sort(function() {
    return 0.5 - Math.random();
  });
}, ml = function(t) {
  if (ot(t))
    return t;
  var e = me(t) ? t : {
    each: t
  }, i = Ze(e.ease), r = e.from || 0, s = parseFloat(e.base) || 0, a = {}, o = r > 0 && r < 1, l = isNaN(r) || o, c = e.axis, h = r, f = r;
  return vt(r) ? h = f = {
    center: 0.5,
    edges: 0.5,
    end: 1
  }[r] || 0 : !o && l && (h = r[0], f = r[1]), function(d, u, m) {
    var p = (m || e).length, g = a[p], x, y, v, b, _, S, C, w, A;
    if (!g) {
      if (A = e.grid === "auto" ? 0 : (e.grid || [1, Xt])[1], !A) {
        for (C = -Xt; C < (C = m[A++].getBoundingClientRect().left) && A < p; )
          ;
        A < p && A--;
      }
      for (g = a[p] = [], x = l ? Math.min(A, p) * h - 0.5 : r % A, y = A === Xt ? 0 : l ? p * f / A - 0.5 : r / A | 0, C = 0, w = Xt, S = 0; S < p; S++)
        v = S % A - x, b = y - (S / A | 0), g[S] = _ = c ? Math.abs(c === "y" ? b : v) : qo(v * v + b * b), _ > C && (C = _), _ < w && (w = _);
      r === "random" && pl(g), g.max = C - w, g.min = w, g.v = p = (parseFloat(e.amount) || parseFloat(e.each) * (A > p ? p - 1 : c ? c === "y" ? p / A : A : Math.max(A, p / A)) || 0) * (r === "edges" ? -1 : 1), g.b = p < 0 ? s - p : s, g.u = bt(e.amount || e.each) || 0, i = i && p < 0 ? Cl(i) : i;
    }
    return p = (g[d] - g.min) / g.max || 0, yt(g.b + (i ? i(p) : p) * g.v) + g.u;
  };
}, cr = function(t) {
  var e = Math.pow(10, ((t + "").split(".")[1] || "").length);
  return function(i) {
    var r = yt(Math.round(parseFloat(i) / t) * t * e);
    return (r - r % 1) / e + (Ae(i) ? 0 : bt(i));
  };
}, gl = function(t, e) {
  var i = Ct(t), r, s;
  return !i && me(t) && (r = i = t.radius || Xt, t.values ? (t = jt(t.values), (s = !Ae(t[0])) && (r *= r)) : t = cr(t.increment)), Oe(e, i ? ot(t) ? function(a) {
    return s = t(a), Math.abs(s - a) <= r ? s : a;
  } : function(a) {
    for (var o = parseFloat(s ? a.x : a), l = parseFloat(s ? a.y : 0), c = Xt, h = 0, f = t.length, d, u; f--; )
      s ? (d = t[f].x - o, u = t[f].y - l, d = d * d + u * u) : d = Math.abs(t[f] - o), d < c && (c = d, h = f);
    return h = !r || c <= r ? t[h] : a, s || h === a || Ae(a) ? h : h + bt(a);
  } : cr(t));
}, _l = function(t, e, i, r) {
  return Oe(Ct(t) ? !e : i === !0 ? !!(i = 0) : !r, function() {
    return Ct(t) ? t[~~(Math.random() * t.length)] : (i = i || 1e-5) && (r = i < 1 ? Math.pow(10, (i + "").length - 2) : 1) && Math.floor(Math.round((t - i / 2 + Math.random() * (e - t + i * 0.99)) / i) * i * r) / r;
  });
}, Jc = function() {
  for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
    e[i] = arguments[i];
  return function(r) {
    return e.reduce(function(s, a) {
      return a(s);
    }, r);
  };
}, tu = function(t, e) {
  return function(i) {
    return t(parseFloat(i)) + (e || bt(i));
  };
}, eu = function(t, e, i) {
  return yl(t, e, 0, 1, i);
}, xl = function(t, e, i) {
  return Oe(i, function(r) {
    return t[~~e(r)];
  });
}, iu = function n(t, e, i) {
  var r = e - t;
  return Ct(t) ? xl(t, n(0, t.length), e) : Oe(i, function(s) {
    return (r + (s - t) % r) % r + t;
  });
}, su = function n(t, e, i) {
  var r = e - t, s = r * 2;
  return Ct(t) ? xl(t, n(0, t.length - 1), e) : Oe(i, function(a) {
    return a = (s + (a - t) % s) % s || 0, t + (a > r ? s - a : a);
  });
}, ns = function(t) {
  for (var e = 0, i = "", r, s, a, o; ~(r = t.indexOf("random(", e)); )
    a = t.indexOf(")", r), o = t.charAt(r + 7) === "[", s = t.substr(r + 7, a - r - 7).match(o ? tl : sr), i += t.substr(e, r - e) + _l(o ? s : +s[0], o ? 0 : +s[1], +s[2] || 1e-5), e = a + 1;
  return i + t.substr(e, t.length - e);
}, yl = function(t, e, i, r, s) {
  var a = e - t, o = r - i;
  return Oe(s, function(l) {
    return i + ((l - t) / a * o || 0);
  });
}, nu = function n(t, e, i, r) {
  var s = isNaN(t + e) ? 0 : function(u) {
    return (1 - u) * t + u * e;
  };
  if (!s) {
    var a = vt(t), o = {}, l, c, h, f, d;
    if (i === !0 && (r = 1) && (i = null), a)
      t = {
        p: t
      }, e = {
        p: e
      };
    else if (Ct(t) && !Ct(e)) {
      for (h = [], f = t.length, d = f - 2, c = 1; c < f; c++)
        h.push(n(t[c - 1], t[c]));
      f--, s = function(m) {
        m *= f;
        var p = Math.min(d, ~~m);
        return h[p](m - p);
      }, i = e;
    } else r || (t = Je(Ct(t) ? [] : {}, t));
    if (!h) {
      for (l in e)
        Qr.call(o, t, l, "get", e[l]);
      s = function(m) {
        return ia(m, o) || (a ? t.p : t);
      };
    }
  }
  return Oe(i, s);
}, Ea = function(t, e, i) {
  var r = t.labels, s = Xt, a, o, l;
  for (a in r)
    o = r[a] - e, o < 0 == !!i && o && s > (o = Math.abs(o)) && (l = a, s = o);
  return l;
}, Wt = function(t, e, i) {
  var r = t.vars, s = r[e], a = tt, o = t._ctx, l, c, h;
  if (s)
    return l = r[e + "Params"], c = r.callbackScope || t, i && Be.length && Xs(), o && (tt = o), h = l ? s.apply(c, l) : s.call(c), tt = a, h;
}, Wi = function(t) {
  return Fe(t), t.scrollTrigger && t.scrollTrigger.kill(!!At), t.progress() < 1 && Wt(t, "onInterrupt"), t;
}, ui, vl = [], wl = function(t) {
  if (t)
    if (t = !t.name && t.default || t, Yr() || t.headless) {
      var e = t.name, i = ot(t), r = e && !i && t.init ? function() {
        this._props = [];
      } : t, s = {
        init: ss,
        render: ia,
        add: Qr,
        kill: vu,
        modifier: yu,
        rawVars: 0
      }, a = {
        targetTest: 0,
        get: 0,
        getSetter: ea,
        aliases: {},
        register: 0
      };
      if (bi(), t !== r) {
        if (Gt[e])
          return;
        qt(r, qt(js(t, s), a)), Je(r.prototype, Je(s, js(t, a))), Gt[r.prop = e] = r, t.targetTest && (zs.push(r), Kr[e] = 1), e = (e === "css" ? "CSS" : e.charAt(0).toUpperCase() + e.substr(1)) + "Plugin";
      }
      sl(e, r), t.register && t.register(Ot, r, Ft);
    } else
      vl.push(t);
}, K = 255, Ni = {
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
}, wn = function(t, e, i) {
  return t += t < 0 ? 1 : t > 1 ? -1 : 0, (t * 6 < 1 ? e + (i - e) * t * 6 : t < 0.5 ? i : t * 3 < 2 ? e + (i - e) * (2 / 3 - t) * 6 : e) * K + 0.5 | 0;
}, bl = function(t, e, i) {
  var r = t ? Ae(t) ? [t >> 16, t >> 8 & K, t & K] : 0 : Ni.black, s, a, o, l, c, h, f, d, u, m;
  if (!r) {
    if (t.substr(-1) === "," && (t = t.substr(0, t.length - 1)), Ni[t])
      r = Ni[t];
    else if (t.charAt(0) === "#") {
      if (t.length < 6 && (s = t.charAt(1), a = t.charAt(2), o = t.charAt(3), t = "#" + s + s + a + a + o + o + (t.length === 5 ? t.charAt(4) + t.charAt(4) : "")), t.length === 9)
        return r = parseInt(t.substr(1, 6), 16), [r >> 16, r >> 8 & K, r & K, parseInt(t.substr(7), 16) / 255];
      t = parseInt(t.substr(1), 16), r = [t >> 16, t >> 8 & K, t & K];
    } else if (t.substr(0, 3) === "hsl") {
      if (r = m = t.match(sr), !e)
        l = +r[0] % 360 / 360, c = +r[1] / 100, h = +r[2] / 100, a = h <= 0.5 ? h * (c + 1) : h + c - h * c, s = h * 2 - a, r.length > 3 && (r[3] *= 1), r[0] = wn(l + 1 / 3, s, a), r[1] = wn(l, s, a), r[2] = wn(l - 1 / 3, s, a);
      else if (~t.indexOf("="))
        return r = t.match(Qo), i && r.length < 4 && (r[3] = 1), r;
    } else
      r = t.match(sr) || Ni.transparent;
    r = r.map(Number);
  }
  return e && !m && (s = r[0] / K, a = r[1] / K, o = r[2] / K, f = Math.max(s, a, o), d = Math.min(s, a, o), h = (f + d) / 2, f === d ? l = c = 0 : (u = f - d, c = h > 0.5 ? u / (2 - f - d) : u / (f + d), l = f === s ? (a - o) / u + (a < o ? 6 : 0) : f === a ? (o - s) / u + 2 : (s - a) / u + 4, l *= 60), r[0] = ~~(l + 0.5), r[1] = ~~(c * 100 + 0.5), r[2] = ~~(h * 100 + 0.5)), i && r.length < 4 && (r[3] = 1), r;
}, Sl = function(t) {
  var e = [], i = [], r = -1;
  return t.split(Re).forEach(function(s) {
    var a = s.match(ci) || [];
    e.push.apply(e, a), i.push(r += a.length + 1);
  }), e.c = i, e;
}, Ia = function(t, e, i) {
  var r = "", s = (t + r).match(Re), a = e ? "hsla(" : "rgba(", o = 0, l, c, h, f;
  if (!s)
    return t;
  if (s = s.map(function(d) {
    return (d = bl(d, e, 1)) && a + (e ? d[0] + "," + d[1] + "%," + d[2] + "%," + d[3] : d.join(",")) + ")";
  }), i && (h = Sl(t), l = i.c, l.join(r) !== h.c.join(r)))
    for (c = t.replace(Re, "1").split(ci), f = c.length - 1; o < f; o++)
      r += c[o] + (~l.indexOf(o) ? s.shift() || a + "0,0,0,0)" : (h.length ? h : s.length ? s : i).shift());
  if (!c)
    for (c = t.split(Re), f = c.length - 1; o < f; o++)
      r += c[o] + s[o];
  return r + c[f];
}, Re = function() {
  var n = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", t;
  for (t in Ni)
    n += "|" + t + "\\b";
  return new RegExp(n + ")", "gi");
}(), ru = /hsl[a]?\(/, Al = function(t) {
  var e = t.join(" "), i;
  if (Re.lastIndex = 0, Re.test(e))
    return i = ru.test(e), t[1] = Ia(t[1], i), t[0] = Ia(t[0], i, Sl(t[1])), !0;
}, rs, Vt = function() {
  var n = Date.now, t = 500, e = 33, i = n(), r = i, s = 1e3 / 240, a = s, o = [], l, c, h, f, d, u, m = function p(g) {
    var x = n() - r, y = g === !0, v, b, _, S;
    if ((x > t || x < 0) && (i += x - e), r += x, _ = r - i, v = _ - a, (v > 0 || y) && (S = ++f.frame, d = _ - f.time * 1e3, f.time = _ = _ / 1e3, a += v + (v >= s ? 4 : s - v), b = 1), y || (l = c(p)), b)
      for (u = 0; u < o.length; u++)
        o[u](_, d, S, g);
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
      el && (!nr && Yr() && (ce = nr = window, Xr = ce.document || {}, Ht.gsap = Ot, (ce.gsapVersions || (ce.gsapVersions = [])).push(Ot.version), il(Ys || ce.GreenSockGlobals || !ce.gsap && ce || {}), vl.forEach(wl)), h = typeof requestAnimationFrame < "u" && requestAnimationFrame, l && f.sleep(), c = h || function(g) {
        return setTimeout(g, a - f.time * 1e3 + 1 | 0);
      }, rs = 1, m(2));
    },
    sleep: function() {
      (h ? cancelAnimationFrame : clearTimeout)(l), rs = 0, c = ss;
    },
    lagSmoothing: function(g, x) {
      t = g || 1 / 0, e = Math.min(x || 33, t);
    },
    fps: function(g) {
      s = 1e3 / (g || 240), a = f.time * 1e3 + s;
    },
    add: function(g, x, y) {
      var v = x ? function(b, _, S, C) {
        g(b, _, S, C), f.remove(v);
      } : g;
      return f.remove(g), o[y ? "unshift" : "push"](v), bi(), v;
    },
    remove: function(g, x) {
      ~(x = o.indexOf(g)) && o.splice(x, 1) && u >= x && u--;
    },
    _listeners: o
  }, f;
}(), bi = function() {
  return !rs && Vt.wake();
}, N = {}, au = /^[\d.\-M][\d.\-,\s]/, ou = /["']/g, lu = function(t) {
  for (var e = {}, i = t.substr(1, t.length - 3).split(":"), r = i[0], s = 1, a = i.length, o, l, c; s < a; s++)
    l = i[s], o = s !== a - 1 ? l.lastIndexOf(",") : l.length, c = l.substr(0, o), e[r] = isNaN(c) ? c.replace(ou, "").trim() : +c, r = l.substr(o + 1).trim();
  return e;
}, hu = function(t) {
  var e = t.indexOf("(") + 1, i = t.indexOf(")"), r = t.indexOf("(", e);
  return t.substring(e, ~r && r < i ? t.indexOf(")", i + 1) : i);
}, cu = function(t) {
  var e = (t + "").split("("), i = N[e[0]];
  return i && e.length > 1 && i.config ? i.config.apply(null, ~t.indexOf("{") ? [lu(e[1])] : hu(t).split(",").map(ol)) : N._CE && au.test(t) ? N._CE("", t) : i;
}, Cl = function(t) {
  return function(e) {
    return 1 - t(1 - e);
  };
}, Pl = function n(t, e) {
  for (var i = t._first, r; i; )
    i instanceof Tt ? n(i, e) : i.vars.yoyoEase && (!i._yoyo || !i._repeat) && i._yoyo !== e && (i.timeline ? n(i.timeline, e) : (r = i._ease, i._ease = i._yEase, i._yEase = r, i._yoyo = e)), i = i._next;
}, Ze = function(t, e) {
  return t && (ot(t) ? t : N[t] || cu(t)) || e;
}, si = function(t, e, i, r) {
  i === void 0 && (i = function(l) {
    return 1 - e(1 - l);
  }), r === void 0 && (r = function(l) {
    return l < 0.5 ? e(l * 2) / 2 : 1 - e((1 - l) * 2) / 2;
  });
  var s = {
    easeIn: e,
    easeOut: i,
    easeInOut: r
  }, a;
  return Rt(t, function(o) {
    N[o] = Ht[o] = s, N[a = o.toLowerCase()] = i;
    for (var l in s)
      N[a + (l === "easeIn" ? ".in" : l === "easeOut" ? ".out" : ".inOut")] = N[o + "." + l] = s[l];
  }), s;
}, Ml = function(t) {
  return function(e) {
    return e < 0.5 ? (1 - t(1 - e * 2)) / 2 : 0.5 + t((e - 0.5) * 2) / 2;
  };
}, bn = function n(t, e, i) {
  var r = e >= 1 ? e : 1, s = (i || (t ? 0.3 : 0.45)) / (e < 1 ? e : 1), a = s / ir * (Math.asin(1 / r) || 0), o = function(h) {
    return h === 1 ? 1 : r * Math.pow(2, -10 * h) * zc((h - a) * s) + 1;
  }, l = t === "out" ? o : t === "in" ? function(c) {
    return 1 - o(1 - c);
  } : Ml(o);
  return s = ir / s, l.config = function(c, h) {
    return n(t, c, h);
  }, l;
}, Sn = function n(t, e) {
  e === void 0 && (e = 1.70158);
  var i = function(a) {
    return a ? --a * a * ((e + 1) * a + e) + 1 : 0;
  }, r = t === "out" ? i : t === "in" ? function(s) {
    return 1 - i(1 - s);
  } : Ml(i);
  return r.config = function(s) {
    return n(t, s);
  }, r;
};
Rt("Linear,Quad,Cubic,Quart,Quint,Strong", function(n, t) {
  var e = t < 5 ? t + 1 : t;
  si(n + ",Power" + (e - 1), t ? function(i) {
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
si("Elastic", bn("in"), bn("out"), bn());
(function(n, t) {
  var e = 1 / t, i = 2 * e, r = 2.5 * e, s = function(o) {
    return o < e ? n * o * o : o < i ? n * Math.pow(o - 1.5 / t, 2) + 0.75 : o < r ? n * (o -= 2.25 / t) * o + 0.9375 : n * Math.pow(o - 2.625 / t, 2) + 0.984375;
  };
  si("Bounce", function(a) {
    return 1 - s(1 - a);
  }, s);
})(7.5625, 2.75);
si("Expo", function(n) {
  return n ? Math.pow(2, 10 * (n - 1)) : 0;
});
si("Circ", function(n) {
  return -(qo(1 - n * n) - 1);
});
si("Sine", function(n) {
  return n === 1 ? 1 : -Dc(n * Lc) + 1;
});
si("Back", Sn("in"), Sn("out"), Sn());
N.SteppedEase = N.steps = Ht.SteppedEase = {
  config: function(t, e) {
    t === void 0 && (t = 1);
    var i = 1 / t, r = t + (e ? 0 : 1), s = e ? 1 : 0, a = 1 - q;
    return function(o) {
      return ((r * _s(0, a, o) | 0) + s) * i;
    };
  }
};
yi.ease = N["quad.out"];
Rt("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(n) {
  return qr += n + "," + n + "Params,";
});
var Tl = function(t, e) {
  this.id = Oc++, t._gsap = this, this.target = t, this.harness = e, this.get = e ? e.get : rl, this.set = e ? e.getSetter : ea;
}, as = /* @__PURE__ */ function() {
  function n(e) {
    this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat === 1 / 0 ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, wi(this, +e.duration, 1, 1), this.data = e.data, tt && (this._ctx = tt, tt.data.push(this)), rs || Vt.wake();
  }
  var t = n.prototype;
  return t.delay = function(i) {
    return i || i === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + i - this._delay), this._delay = i, this) : this._delay;
  }, t.duration = function(i) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? i + (i + this._rDelay) * this._repeat : i) : this.totalDuration() && this._dur;
  }, t.totalDuration = function(i) {
    return arguments.length ? (this._dirty = 0, wi(this, this._repeat < 0 ? i : (i - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
  }, t.totalTime = function(i, r) {
    if (bi(), !arguments.length)
      return this._tTime;
    var s = this._dp;
    if (s && s.smoothChildTiming && this._ts) {
      for (cn(this, i), !s._dp || s.parent || cl(s, this); s && s.parent; )
        s.parent._time !== s._start + (s._ts >= 0 ? s._tTime / s._ts : (s.totalDuration() - s._tTime) / -s._ts) && s.totalTime(s._tTime, !0), s = s.parent;
      !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && i < this._tDur || this._ts < 0 && i > 0 || !this._tDur && !i) && ue(this._dp, this, this._start - this._delay);
    }
    return (this._tTime !== i || !this._dur && !r || this._initted && Math.abs(this._zTime) === q || !i && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = i), al(this, i, r)), this;
  }, t.time = function(i, r) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), i + Ta(this)) % (this._dur + this._rDelay) || (i ? this._dur : 0), r) : this._time;
  }, t.totalProgress = function(i, r) {
    return arguments.length ? this.totalTime(this.totalDuration() * i, r) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0;
  }, t.progress = function(i, r) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - i : i) + Ta(this), r) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  }, t.iteration = function(i, r) {
    var s = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (i - 1) * s, r) : this._repeat ? vi(this._tTime, s) + 1 : 1;
  }, t.timeScale = function(i, r) {
    if (!arguments.length)
      return this._rts === -q ? 0 : this._rts;
    if (this._rts === i)
      return this;
    var s = this.parent && this._ts ? Ks(this.parent._time, this) : this._tTime;
    return this._rts = +i || 0, this._ts = this._ps || i === -q ? 0 : this._rts, this.totalTime(_s(-Math.abs(this._delay), this._tDur, s), r !== !1), hn(this), $c(this);
  }, t.paused = function(i) {
    return arguments.length ? (this._ps !== i && (this._ps = i, i ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (bi(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== q && (this._tTime -= q)))), this) : this._ps;
  }, t.startTime = function(i) {
    if (arguments.length) {
      this._start = i;
      var r = this.parent || this._dp;
      return r && (r._sort || !this.parent) && ue(r, this, i - this._delay), this;
    }
    return this._start;
  }, t.endTime = function(i) {
    return this._start + (Bt(i) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  }, t.rawTime = function(i) {
    var r = this.parent || this._dp;
    return r ? i && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? Ks(r.rawTime(i), this) : this._tTime : this._tTime;
  }, t.revert = function(i) {
    i === void 0 && (i = Vc);
    var r = At;
    return At = i, (this._initted || this._startAt) && (this.timeline && this.timeline.revert(i), this.totalTime(-0.01, i.suppressEvents)), this.data !== "nested" && i.kill !== !1 && this.kill(), At = r, this;
  }, t.globalTime = function(i) {
    for (var r = this, s = arguments.length ? i : r.rawTime(); r; )
      s = r._start + s / (Math.abs(r._ts) || 1), r = r._dp;
    return !this.parent && this._sat ? this._sat.globalTime(i) : s;
  }, t.repeat = function(i) {
    return arguments.length ? (this._repeat = i === 1 / 0 ? -2 : i, ka(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
  }, t.repeatDelay = function(i) {
    if (arguments.length) {
      var r = this._time;
      return this._rDelay = i, ka(this), r ? this.time(r) : this;
    }
    return this._rDelay;
  }, t.yoyo = function(i) {
    return arguments.length ? (this._yoyo = i, this) : this._yoyo;
  }, t.seek = function(i, r) {
    return this.totalTime($t(this, i), Bt(r));
  }, t.restart = function(i, r) {
    return this.play().totalTime(i ? -this._delay : 0, Bt(r));
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
    var i = this.parent || this._dp, r = this._start, s;
    return !!(!i || this._ts && this._initted && i.isActive() && (s = i.rawTime(!0)) >= r && s < this.endTime(!0) - q);
  }, t.eventCallback = function(i, r, s) {
    var a = this.vars;
    return arguments.length > 1 ? (r ? (a[i] = r, s && (a[i + "Params"] = s), i === "onUpdate" && (this._onUpdate = r)) : delete a[i], this) : a[i];
  }, t.then = function(i) {
    var r = this;
    return new Promise(function(s) {
      var a = ot(i) ? i : ll, o = function() {
        var c = r.then;
        r.then = null, ot(a) && (a = a(r)) && (a.then || a === r) && (r.then = c), s(a), r.then = c;
      };
      r._initted && r.totalProgress() === 1 && r._ts >= 0 || !r._tTime && r._ts < 0 ? o() : r._prom = o;
    });
  }, t.kill = function() {
    Wi(this);
  }, n;
}();
qt(as.prototype, {
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
var Tt = /* @__PURE__ */ function(n) {
  Ko(t, n);
  function t(i, r) {
    var s;
    return i === void 0 && (i = {}), s = n.call(this, i) || this, s.labels = {}, s.smoothChildTiming = !!i.smoothChildTiming, s.autoRemoveChildren = !!i.autoRemoveChildren, s._sort = Bt(i.sortChildren), it && ue(i.parent || it, ye(s), r), i.reversed && s.reverse(), i.paused && s.paused(!0), i.scrollTrigger && ul(ye(s), i.scrollTrigger), s;
  }
  var e = t.prototype;
  return e.to = function(r, s, a) {
    return Ki(0, arguments, this), this;
  }, e.from = function(r, s, a) {
    return Ki(1, arguments, this), this;
  }, e.fromTo = function(r, s, a, o) {
    return Ki(2, arguments, this), this;
  }, e.set = function(r, s, a) {
    return s.duration = 0, s.parent = this, ji(s).repeatDelay || (s.repeat = 0), s.immediateRender = !!s.immediateRender, new ut(r, s, $t(this, a), 1), this;
  }, e.call = function(r, s, a) {
    return ue(this, ut.delayedCall(0, r, s), a);
  }, e.staggerTo = function(r, s, a, o, l, c, h) {
    return a.duration = s, a.stagger = a.stagger || o, a.onComplete = c, a.onCompleteParams = h, a.parent = this, new ut(r, a, $t(this, l)), this;
  }, e.staggerFrom = function(r, s, a, o, l, c, h) {
    return a.runBackwards = 1, ji(a).immediateRender = Bt(a.immediateRender), this.staggerTo(r, s, a, o, l, c, h);
  }, e.staggerFromTo = function(r, s, a, o, l, c, h, f) {
    return o.startAt = a, ji(o).immediateRender = Bt(o.immediateRender), this.staggerTo(r, s, o, l, c, h, f);
  }, e.render = function(r, s, a) {
    var o = this._time, l = this._dirty ? this.totalDuration() : this._tDur, c = this._dur, h = r <= 0 ? 0 : yt(r), f = this._zTime < 0 != r < 0 && (this._initted || !c), d, u, m, p, g, x, y, v, b, _, S, C;
    if (this !== it && h > l && r >= 0 && (h = l), h !== this._tTime || a || f) {
      if (o !== this._time && c && (h += this._time - o, r += this._time - o), d = h, b = this._start, v = this._ts, x = !v, f && (c || (o = this._zTime), (r || !s) && (this._zTime = r)), this._repeat) {
        if (S = this._yoyo, g = c + this._rDelay, this._repeat < -1 && r < 0)
          return this.totalTime(g * 100 + r, s, a);
        if (d = yt(h % g), h === l ? (p = this._repeat, d = c) : (p = ~~(h / g), p && p === h / g && (d = c, p--), d > c && (d = c)), _ = vi(this._tTime, g), !o && this._tTime && _ !== p && this._tTime - _ * g - this._dur <= 0 && (_ = p), S && p & 1 && (d = c - d, C = 1), p !== _ && !this._lock) {
          var w = S && _ & 1, A = w === (S && p & 1);
          if (p < _ && (w = !w), o = w ? 0 : h % c ? c : h, this._lock = 1, this.render(o || (C ? 0 : yt(p * g)), s, !c)._lock = 0, this._tTime = h, !s && this.parent && Wt(this, "onRepeat"), this.vars.repeatRefresh && !C && (this.invalidate()._lock = 1), o && o !== this._time || x !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
            return this;
          if (c = this._dur, l = this._tDur, A && (this._lock = 2, o = w ? c : -1e-4, this.render(o, !0), this.vars.repeatRefresh && !C && this.invalidate()), this._lock = 0, !this._ts && !x)
            return this;
          Pl(this, C);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2 && (y = Kc(this, yt(o), yt(d)), y && (h -= d - (d = y._start))), this._tTime = h, this._time = d, this._act = !v, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = r, o = 0), !o && d && !s && !p && (Wt(this, "onStart"), this._tTime !== h))
        return this;
      if (d >= o && r >= 0)
        for (u = this._first; u; ) {
          if (m = u._next, (u._act || d >= u._start) && u._ts && y !== u) {
            if (u.parent !== this)
              return this.render(r, s, a);
            if (u.render(u._ts > 0 ? (d - u._start) * u._ts : (u._dirty ? u.totalDuration() : u._tDur) + (d - u._start) * u._ts, s, a), d !== this._time || !this._ts && !x) {
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
              return this.render(r, s, a);
            if (u.render(u._ts > 0 ? (P - u._start) * u._ts : (u._dirty ? u.totalDuration() : u._tDur) + (P - u._start) * u._ts, s, a || At && (u._initted || u._startAt)), d !== this._time || !this._ts && !x) {
              y = 0, m && (h += this._zTime = P ? -q : q);
              break;
            }
          }
          u = m;
        }
      }
      if (y && !s && (this.pause(), y.render(d >= o ? 0 : -q)._zTime = d >= o ? 1 : -1, this._ts))
        return this._start = b, hn(this), this.render(r, s, a);
      this._onUpdate && !s && Wt(this, "onUpdate", !0), (h === l && this._tTime >= this.totalDuration() || !h && o) && (b === this._start || Math.abs(v) !== Math.abs(this._ts)) && (this._lock || ((r || !c) && (h === l && this._ts > 0 || !h && this._ts < 0) && Fe(this, 1), !s && !(r < 0 && !o) && (h || o || !l) && (Wt(this, h === l && r >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(h < l && this.timeScale() > 0) && this._prom())));
    }
    return this;
  }, e.add = function(r, s) {
    var a = this;
    if (Ae(s) || (s = $t(this, s, r)), !(r instanceof as)) {
      if (Ct(r))
        return r.forEach(function(o) {
          return a.add(o, s);
        }), this;
      if (vt(r))
        return this.addLabel(r, s);
      if (ot(r))
        r = ut.delayedCall(0, r);
      else
        return this;
    }
    return this !== r ? ue(this, r, s) : this;
  }, e.getChildren = function(r, s, a, o) {
    r === void 0 && (r = !0), s === void 0 && (s = !0), a === void 0 && (a = !0), o === void 0 && (o = -Xt);
    for (var l = [], c = this._first; c; )
      c._start >= o && (c instanceof ut ? s && l.push(c) : (a && l.push(c), r && l.push.apply(l, c.getChildren(!0, s, a)))), c = c._next;
    return l;
  }, e.getById = function(r) {
    for (var s = this.getChildren(1, 1, 1), a = s.length; a--; )
      if (s[a].vars.id === r)
        return s[a];
  }, e.remove = function(r) {
    return vt(r) ? this.removeLabel(r) : ot(r) ? this.killTweensOf(r) : (ln(this, r), r === this._recent && (this._recent = this._last), qe(this));
  }, e.totalTime = function(r, s) {
    return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = yt(Vt.time - (this._ts > 0 ? r / this._ts : (this.totalDuration() - r) / -this._ts))), n.prototype.totalTime.call(this, r, s), this._forcing = 0, this) : this._tTime;
  }, e.addLabel = function(r, s) {
    return this.labels[r] = $t(this, s), this;
  }, e.removeLabel = function(r) {
    return delete this.labels[r], this;
  }, e.addPause = function(r, s, a) {
    var o = ut.delayedCall(0, s || ss, a);
    return o.data = "isPause", this._hasPause = 1, ue(this, o, $t(this, r));
  }, e.removePause = function(r) {
    var s = this._first;
    for (r = $t(this, r); s; )
      s._start === r && s.data === "isPause" && Fe(s), s = s._next;
  }, e.killTweensOf = function(r, s, a) {
    for (var o = this.getTweensOf(r, a), l = o.length; l--; )
      Te !== o[l] && o[l].kill(r, s);
    return this;
  }, e.getTweensOf = function(r, s) {
    for (var a = [], o = jt(r), l = this._first, c = Ae(s), h; l; )
      l instanceof ut ? Wc(l._targets, o) && (c ? (!Te || l._initted && l._ts) && l.globalTime(0) <= s && l.globalTime(l.totalDuration()) > s : !s || l.isActive()) && a.push(l) : (h = l.getTweensOf(o, s)).length && a.push.apply(a, h), l = l._next;
    return a;
  }, e.tweenTo = function(r, s) {
    s = s || {};
    var a = this, o = $t(a, r), l = s, c = l.startAt, h = l.onStart, f = l.onStartParams, d = l.immediateRender, u, m = ut.to(a, qt({
      ease: s.ease || "none",
      lazy: !1,
      immediateRender: !1,
      time: o,
      overwrite: "auto",
      duration: s.duration || Math.abs((o - (c && "time" in c ? c.time : a._time)) / a.timeScale()) || q,
      onStart: function() {
        if (a.pause(), !u) {
          var g = s.duration || Math.abs((o - (c && "time" in c ? c.time : a._time)) / a.timeScale());
          m._dur !== g && wi(m, g, 0, 1).render(m._time, !0, !0), u = 1;
        }
        h && h.apply(m, f || []);
      }
    }, s));
    return d ? m.render(0) : m;
  }, e.tweenFromTo = function(r, s, a) {
    return this.tweenTo(s, qt({
      startAt: {
        time: $t(this, r)
      }
    }, a));
  }, e.recent = function() {
    return this._recent;
  }, e.nextLabel = function(r) {
    return r === void 0 && (r = this._time), Ea(this, $t(this, r));
  }, e.previousLabel = function(r) {
    return r === void 0 && (r = this._time), Ea(this, $t(this, r), 1);
  }, e.currentLabel = function(r) {
    return arguments.length ? this.seek(r, !0) : this.previousLabel(this._time + q);
  }, e.shiftChildren = function(r, s, a) {
    a === void 0 && (a = 0);
    for (var o = this._first, l = this.labels, c; o; )
      o._start >= a && (o._start += r, o._end += r), o = o._next;
    if (s)
      for (c in l)
        l[c] >= a && (l[c] += r);
    return qe(this);
  }, e.invalidate = function(r) {
    var s = this._first;
    for (this._lock = 0; s; )
      s.invalidate(r), s = s._next;
    return n.prototype.invalidate.call(this, r);
  }, e.clear = function(r) {
    r === void 0 && (r = !0);
    for (var s = this._first, a; s; )
      a = s._next, this.remove(s), s = a;
    return this._dp && (this._time = this._tTime = this._pTime = 0), r && (this.labels = {}), qe(this);
  }, e.totalDuration = function(r) {
    var s = 0, a = this, o = a._last, l = Xt, c, h, f;
    if (arguments.length)
      return a.timeScale((a._repeat < 0 ? a.duration() : a.totalDuration()) / (a.reversed() ? -r : r));
    if (a._dirty) {
      for (f = a.parent; o; )
        c = o._prev, o._dirty && o.totalDuration(), h = o._start, h > l && a._sort && o._ts && !a._lock ? (a._lock = 1, ue(a, o, h - o._delay, 1)._lock = 0) : l = h, h < 0 && o._ts && (s -= h, (!f && !a._dp || f && f.smoothChildTiming) && (a._start += h / a._ts, a._time -= h, a._tTime -= h), a.shiftChildren(-h, !1, -1 / 0), l = 0), o._end > s && o._ts && (s = o._end), o = c;
      wi(a, a === it && a._time > s ? a._time : s, 1, 1), a._dirty = 0;
    }
    return a._tDur;
  }, t.updateRoot = function(r) {
    if (it._ts && (al(it, Ks(r, it)), nl = Vt.frame), Vt.frame >= Pa) {
      Pa += Nt.autoSleep || 120;
      var s = it._first;
      if ((!s || !s._ts) && Nt.autoSleep && Vt._listeners.length < 2) {
        for (; s && !s._ts; )
          s = s._next;
        s || Vt.sleep();
      }
    }
  }, t;
}(as);
qt(Tt.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var uu = function(t, e, i, r, s, a, o) {
  var l = new Ft(this._pt, t, e, 0, 1, Fl, null, s), c = 0, h = 0, f, d, u, m, p, g, x, y;
  for (l.b = i, l.e = r, i += "", r += "", (x = ~r.indexOf("random(")) && (r = ns(r)), a && (y = [i, r], a(y, t, e), i = y[0], r = y[1]), d = i.match(yn) || []; f = yn.exec(r); )
    m = f[0], p = r.substring(c, f.index), u ? u = (u + 1) % 5 : p.substr(-5) === "rgba(" && (u = 1), m !== d[h++] && (g = parseFloat(d[h - 1]) || 0, l._pt = {
      _next: l._pt,
      p: p || h === 1 ? p : ",",
      //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
      s: g,
      c: m.charAt(1) === "=" ? pi(g, m) - g : parseFloat(m) - g,
      m: u && u < 4 ? Math.round : 0
    }, c = yn.lastIndex);
  return l.c = c < r.length ? r.substring(c, r.length) : "", l.fp = o, (Jo.test(r) || x) && (l.e = 0), this._pt = l, l;
}, Qr = function(t, e, i, r, s, a, o, l, c, h) {
  ot(r) && (r = r(s || 0, t, a));
  var f = t[e], d = i !== "get" ? i : ot(f) ? c ? t[e.indexOf("set") || !ot(t["get" + e.substr(3)]) ? e : "get" + e.substr(3)](c) : t[e]() : f, u = ot(f) ? c ? gu : Bl : ta, m;
  if (vt(r) && (~r.indexOf("random(") && (r = ns(r)), r.charAt(1) === "=" && (m = pi(d, r) + (bt(d) || 0), (m || m === 0) && (r = m))), !h || d !== r || ur)
    return !isNaN(d * r) && r !== "" ? (m = new Ft(this._pt, t, e, +d || 0, r - (d || 0), typeof f == "boolean" ? xu : Rl, 0, u), c && (m.fp = c), o && m.modifier(o, this, t), this._pt = m) : (!f && !(e in t) && jr(e, r), uu.call(this, t, e, d, r, u, l || Nt.stringFilter, c));
}, fu = function(t, e, i, r, s) {
  if (ot(t) && (t = qi(t, s, e, i, r)), !me(t) || t.style && t.nodeType || Ct(t) || Zo(t))
    return vt(t) ? qi(t, s, e, i, r) : t;
  var a = {}, o;
  for (o in t)
    a[o] = qi(t[o], s, e, i, r);
  return a;
}, kl = function(t, e, i, r, s, a) {
  var o, l, c, h;
  if (Gt[t] && (o = new Gt[t]()).init(s, o.rawVars ? e[t] : fu(e[t], r, s, a, i), i, r, a) !== !1 && (i._pt = l = new Ft(i._pt, s, t, 0, 1, o.render, o, 0, o.priority), i !== ui))
    for (c = i._ptLookup[i._targets.indexOf(s)], h = o._props.length; h--; )
      c[o._props[h]] = l;
  return o;
}, Te, ur, Jr = function n(t, e, i) {
  var r = t.vars, s = r.ease, a = r.startAt, o = r.immediateRender, l = r.lazy, c = r.onUpdate, h = r.runBackwards, f = r.yoyoEase, d = r.keyframes, u = r.autoRevert, m = t._dur, p = t._startAt, g = t._targets, x = t.parent, y = x && x.data === "nested" ? x.vars.targets : g, v = t._overwrite === "auto" && !Hr, b = t.timeline, _, S, C, w, A, P, M, T, k, E, I, B, R;
  if (b && (!d || !s) && (s = "none"), t._ease = Ze(s, yi.ease), t._yEase = f ? Cl(Ze(f === !0 ? s : f, yi.ease)) : 0, f && t._yoyo && !t._repeat && (f = t._yEase, t._yEase = t._ease, t._ease = f), t._from = !b && !!r.runBackwards, !b || d && !r.stagger) {
    if (T = g[0] ? Ke(g[0]).harness : 0, B = T && r[T.prop], _ = js(r, Kr), p && (p._zTime < 0 && p.progress(1), e < 0 && h && o && !u ? p.render(-1, !0) : p.revert(h && m ? Ds : Gc), p._lazy = 0), a) {
      if (Fe(t._startAt = ut.set(g, qt({
        data: "isStart",
        overwrite: !1,
        parent: x,
        immediateRender: !0,
        lazy: !p && Bt(l),
        startAt: null,
        delay: 0,
        onUpdate: c && function() {
          return Wt(t, "onUpdate");
        },
        stagger: 0
      }, a))), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (At || !o && !u) && t._startAt.revert(Ds), o && m && e <= 0 && i <= 0) {
        e && (t._zTime = e);
        return;
      }
    } else if (h && m && !p) {
      if (e && (o = !1), C = qt({
        overwrite: !1,
        data: "isFromStart",
        //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
        lazy: o && !p && Bt(l),
        immediateRender: o,
        //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
        stagger: 0,
        parent: x
        //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
      }, _), B && (C[T.prop] = B), Fe(t._startAt = ut.set(g, C)), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (At ? t._startAt.revert(Ds) : t._startAt.render(-1, !0)), t._zTime = e, !o)
        n(t._startAt, q, q);
      else if (!e)
        return;
    }
    for (t._pt = t._ptCache = 0, l = m && Bt(l) || l && !m, S = 0; S < g.length; S++) {
      if (A = g[S], M = A._gsap || Zr(g)[S]._gsap, t._ptLookup[S] = E = {}, rr[M.id] && Be.length && Xs(), I = y === g ? S : y.indexOf(A), T && (k = new T()).init(A, B || _, t, I, y) !== !1 && (t._pt = w = new Ft(t._pt, A, k.name, 0, 1, k.render, k, 0, k.priority), k._props.forEach(function(z) {
        E[z] = w;
      }), k.priority && (P = 1)), !T || B)
        for (C in _)
          Gt[C] && (k = kl(C, _, t, I, A, y)) ? k.priority && (P = 1) : E[C] = w = Qr.call(t, A, C, "get", _[C], I, y, 0, r.stringFilter);
      t._op && t._op[S] && t.kill(A, t._op[S]), v && t._pt && (Te = t, it.killTweensOf(A, E, t.globalTime(e)), R = !t.parent, Te = 0), t._pt && l && (rr[M.id] = 1);
    }
    P && Ll(t), t._onInit && t._onInit(t);
  }
  t._onUpdate = c, t._initted = (!t._op || t._pt) && !R, d && e <= 0 && b.render(Xt, !0, !0);
}, du = function(t, e, i, r, s, a, o, l) {
  var c = (t._pt && t._ptCache || (t._ptCache = {}))[e], h, f, d, u;
  if (!c)
    for (c = t._ptCache[e] = [], d = t._ptLookup, u = t._targets.length; u--; ) {
      if (h = d[u][e], h && h.d && h.d._pt)
        for (h = h.d._pt; h && h.p !== e && h.fp !== e; )
          h = h._next;
      if (!h)
        return ur = 1, t.vars[e] = "+=0", Jr(t, o), ur = 0, l ? is(e + " not eligible for reset") : 1;
      c.push(h);
    }
  for (u = c.length; u--; )
    f = c[u], h = f._pt || f, h.s = (r || r === 0) && !s ? r : h.s + (r || 0) + a * h.c, h.c = i - h.s, f.e && (f.e = ht(i) + bt(f.e)), f.b && (f.b = h.s + bt(f.b));
}, pu = function(t, e) {
  var i = t[0] ? Ke(t[0]).harness : 0, r = i && i.aliases, s, a, o, l;
  if (!r)
    return e;
  s = Je({}, e);
  for (a in r)
    if (a in s)
      for (l = r[a].split(","), o = l.length; o--; )
        s[l[o]] = s[a];
  return s;
}, mu = function(t, e, i, r) {
  var s = e.ease || r || "power1.inOut", a, o;
  if (Ct(e))
    o = i[t] || (i[t] = []), e.forEach(function(l, c) {
      return o.push({
        t: c / (e.length - 1) * 100,
        v: l,
        e: s
      });
    });
  else
    for (a in e)
      o = i[a] || (i[a] = []), a === "ease" || o.push({
        t: parseFloat(t),
        v: e[a],
        e: s
      });
}, qi = function(t, e, i, r, s) {
  return ot(t) ? t.call(e, i, r, s) : vt(t) && ~t.indexOf("random(") ? ns(t) : t;
}, El = qr + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", Il = {};
Rt(El + ",id,stagger,delay,duration,paused,scrollTrigger", function(n) {
  return Il[n] = 1;
});
var ut = /* @__PURE__ */ function(n) {
  Ko(t, n);
  function t(i, r, s, a) {
    var o;
    typeof r == "number" && (s.duration = r, r = s, s = null), o = n.call(this, a ? r : ji(r)) || this;
    var l = o.vars, c = l.duration, h = l.delay, f = l.immediateRender, d = l.stagger, u = l.overwrite, m = l.keyframes, p = l.defaults, g = l.scrollTrigger, x = l.yoyoEase, y = r.parent || it, v = (Ct(i) || Zo(i) ? Ae(i[0]) : "length" in r) ? [i] : jt(i), b, _, S, C, w, A, P, M;
    if (o._targets = v.length ? Zr(v) : is("GSAP target " + i + " not found. https://gsap.com", !Nt.nullTargetWarn) || [], o._ptLookup = [], o._overwrite = u, m || d || Ss(c) || Ss(h)) {
      if (r = o.vars, b = o.timeline = new Tt({
        data: "nested",
        defaults: p || {},
        targets: y && y.data === "nested" ? y.vars.targets : v
      }), b.kill(), b.parent = b._dp = ye(o), b._start = 0, d || Ss(c) || Ss(h)) {
        if (C = v.length, P = d && ml(d), me(d))
          for (w in d)
            ~El.indexOf(w) && (M || (M = {}), M[w] = d[w]);
        for (_ = 0; _ < C; _++)
          S = js(r, Il), S.stagger = 0, x && (S.yoyoEase = x), M && Je(S, M), A = v[_], S.duration = +qi(c, ye(o), _, A, v), S.delay = (+qi(h, ye(o), _, A, v) || 0) - o._delay, !d && C === 1 && S.delay && (o._delay = h = S.delay, o._start += h, S.delay = 0), b.to(A, S, P ? P(_, A, v) : 0), b._ease = N.none;
        b.duration() ? c = h = 0 : o.timeline = 0;
      } else if (m) {
        ji(qt(b.vars.defaults, {
          ease: "none"
        })), b._ease = Ze(m.ease || r.ease || "none");
        var T = 0, k, E, I;
        if (Ct(m))
          m.forEach(function(B) {
            return b.to(v, B, ">");
          }), b.duration();
        else {
          S = {};
          for (w in m)
            w === "ease" || w === "easeEach" || mu(w, m[w], S, m.easeEach);
          for (w in S)
            for (k = S[w].sort(function(B, R) {
              return B.t - R.t;
            }), T = 0, _ = 0; _ < k.length; _++)
              E = k[_], I = {
                ease: E.e,
                duration: (E.t - (_ ? k[_ - 1].t : 0)) / 100 * c
              }, I[w] = E.v, b.to(v, I, T), T += I.duration;
          b.duration() < c && b.to({}, {
            duration: c - b.duration()
          });
        }
      }
      c || o.duration(c = b.duration());
    } else
      o.timeline = 0;
    return u === !0 && !Hr && (Te = ye(o), it.killTweensOf(v), Te = 0), ue(y, ye(o), s), r.reversed && o.reverse(), r.paused && o.paused(!0), (f || !c && !m && o._start === yt(y._time) && Bt(f) && Yc(ye(o)) && y.data !== "nested") && (o._tTime = -q, o.render(Math.max(0, -h) || 0)), g && ul(ye(o), g), o;
  }
  var e = t.prototype;
  return e.render = function(r, s, a) {
    var o = this._time, l = this._tDur, c = this._dur, h = r < 0, f = r > l - q && !h ? l : r < q ? 0 : r, d, u, m, p, g, x, y, v, b;
    if (!c)
      jc(this, r, s, a);
    else if (f !== this._tTime || !r || a || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== h) {
      if (d = f, v = this.timeline, this._repeat) {
        if (p = c + this._rDelay, this._repeat < -1 && h)
          return this.totalTime(p * 100 + r, s, a);
        if (d = yt(f % p), f === l ? (m = this._repeat, d = c) : (m = ~~(f / p), m && m === yt(f / p) && (d = c, m--), d > c && (d = c)), x = this._yoyo && m & 1, x && (b = this._yEase, d = c - d), g = vi(this._tTime, p), d === o && !a && this._initted && m === g)
          return this._tTime = f, this;
        m !== g && (v && this._yEase && Pl(v, x), this.vars.repeatRefresh && !x && !this._lock && this._time !== p && this._initted && (this._lock = a = 1, this.render(yt(p * m), !0).invalidate()._lock = 0));
      }
      if (!this._initted) {
        if (fl(this, h ? r : d, a, s, f))
          return this._tTime = 0, this;
        if (o !== this._time && !(a && this.vars.repeatRefresh && m !== g))
          return this;
        if (c !== this._dur)
          return this.render(r, s, a);
      }
      if (this._tTime = f, this._time = d, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = y = (b || this._ease)(d / c), this._from && (this.ratio = y = 1 - y), d && !o && !s && !m && (Wt(this, "onStart"), this._tTime !== f))
        return this;
      for (u = this._pt; u; )
        u.r(y, u.d), u = u._next;
      v && v.render(r < 0 ? r : v._dur * v._ease(d / this._dur), s, a) || this._startAt && (this._zTime = r), this._onUpdate && !s && (h && ar(this, r, s, a), Wt(this, "onUpdate")), this._repeat && m !== g && this.vars.onRepeat && !s && this.parent && Wt(this, "onRepeat"), (f === this._tDur || !f) && this._tTime === f && (h && !this._onUpdate && ar(this, r, !0, !0), (r || !c) && (f === this._tDur && this._ts > 0 || !f && this._ts < 0) && Fe(this, 1), !s && !(h && !o) && (f || o || x) && (Wt(this, f === l ? "onComplete" : "onReverseComplete", !0), this._prom && !(f < l && this.timeScale() > 0) && this._prom()));
    }
    return this;
  }, e.targets = function() {
    return this._targets;
  }, e.invalidate = function(r) {
    return (!r || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(r), n.prototype.invalidate.call(this, r);
  }, e.resetTo = function(r, s, a, o, l) {
    rs || Vt.wake(), this._ts || this.play();
    var c = Math.min(this._dur, (this._dp._time - this._start) * this._ts), h;
    return this._initted || Jr(this, c), h = this._ease(c / this._dur), du(this, r, s, a, o, h, c, l) ? this.resetTo(r, s, a, o, 1) : (cn(this, 0), this.parent || hl(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
  }, e.kill = function(r, s) {
    if (s === void 0 && (s = "all"), !r && (!s || s === "all"))
      return this._lazy = this._pt = 0, this.parent ? Wi(this) : this;
    if (this.timeline) {
      var a = this.timeline.totalDuration();
      return this.timeline.killTweensOf(r, s, Te && Te.vars.overwrite !== !0)._first || Wi(this), this.parent && a !== this.timeline.totalDuration() && wi(this, this._dur * this.timeline._tDur / a, 0, 1), this;
    }
    var o = this._targets, l = r ? jt(r) : o, c = this._ptLookup, h = this._pt, f, d, u, m, p, g, x;
    if ((!s || s === "all") && Hc(o, l))
      return s === "all" && (this._pt = 0), Wi(this);
    for (f = this._op = this._op || [], s !== "all" && (vt(s) && (p = {}, Rt(s, function(y) {
      return p[y] = 1;
    }), s = p), s = pu(o, s)), x = o.length; x--; )
      if (~l.indexOf(o[x])) {
        d = c[x], s === "all" ? (f[x] = s, m = d, u = {}) : (u = f[x] = f[x] || {}, m = s);
        for (p in m)
          g = d && d[p], g && ((!("kill" in g.d) || g.d.kill(p) === !0) && ln(this, g, "_pt"), delete d[p]), u !== "all" && (u[p] = 1);
      }
    return this._initted && !this._pt && h && Wi(this), this;
  }, t.to = function(r, s) {
    return new t(r, s, arguments[2]);
  }, t.from = function(r, s) {
    return Ki(1, arguments);
  }, t.delayedCall = function(r, s, a, o) {
    return new t(s, 0, {
      immediateRender: !1,
      lazy: !1,
      overwrite: !1,
      delay: r,
      onComplete: s,
      onReverseComplete: s,
      onCompleteParams: a,
      onReverseCompleteParams: a,
      callbackScope: o
    });
  }, t.fromTo = function(r, s, a) {
    return Ki(2, arguments);
  }, t.set = function(r, s) {
    return s.duration = 0, s.repeatDelay || (s.repeat = 0), new t(r, s);
  }, t.killTweensOf = function(r, s, a) {
    return it.killTweensOf(r, s, a);
  }, t;
}(as);
qt(ut.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
Rt("staggerTo,staggerFrom,staggerFromTo", function(n) {
  ut[n] = function() {
    var t = new Tt(), e = lr.call(arguments, 0);
    return e.splice(n === "staggerFromTo" ? 5 : 4, 0, 0), t[n].apply(t, e);
  };
});
var ta = function(t, e, i) {
  return t[e] = i;
}, Bl = function(t, e, i) {
  return t[e](i);
}, gu = function(t, e, i, r) {
  return t[e](r.fp, i);
}, _u = function(t, e, i) {
  return t.setAttribute(e, i);
}, ea = function(t, e) {
  return ot(t[e]) ? Bl : $r(t[e]) && t.setAttribute ? _u : ta;
}, Rl = function(t, e) {
  return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e6) / 1e6, e);
}, xu = function(t, e) {
  return e.set(e.t, e.p, !!(e.s + e.c * t), e);
}, Fl = function(t, e) {
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
}, ia = function(t, e) {
  for (var i = e._pt; i; )
    i.r(t, i.d), i = i._next;
}, yu = function(t, e, i, r) {
  for (var s = this._pt, a; s; )
    a = s._next, s.p === r && s.modifier(t, e, i), s = a;
}, vu = function(t) {
  for (var e = this._pt, i, r; e; )
    r = e._next, e.p === t && !e.op || e.op === t ? ln(this, e, "_pt") : e.dep || (i = 1), e = r;
  return !i;
}, wu = function(t, e, i, r) {
  r.mSet(t, e, r.m.call(r.tween, i, r.mt), r);
}, Ll = function(t) {
  for (var e = t._pt, i, r, s, a; e; ) {
    for (i = e._next, r = s; r && r.pr > e.pr; )
      r = r._next;
    (e._prev = r ? r._prev : a) ? e._prev._next = e : s = e, (e._next = r) ? r._prev = e : a = e, e = i;
  }
  t._pt = s;
}, Ft = /* @__PURE__ */ function() {
  function n(e, i, r, s, a, o, l, c, h) {
    this.t = i, this.s = s, this.c = a, this.p = r, this.r = o || Rl, this.d = l || this, this.set = c || ta, this.pr = h || 0, this._next = e, e && (e._prev = this);
  }
  var t = n.prototype;
  return t.modifier = function(i, r, s) {
    this.mSet = this.mSet || this.set, this.set = wu, this.m = i, this.mt = s, this.tween = r;
  }, n;
}();
Rt(qr + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(n) {
  return Kr[n] = 1;
});
Ht.TweenMax = Ht.TweenLite = ut;
Ht.TimelineLite = Ht.TimelineMax = Tt;
it = new Tt({
  sortChildren: !1,
  defaults: yi,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0
});
Nt.stringFilter = Al;
var Qe = [], Us = {}, bu = [], Ba = 0, Su = 0, An = function(t) {
  return (Us[t] || bu).map(function(e) {
    return e();
  });
}, fr = function() {
  var t = Date.now(), e = [];
  t - Ba > 2 && (An("matchMediaInit"), Qe.forEach(function(i) {
    var r = i.queries, s = i.conditions, a, o, l, c;
    for (o in r)
      a = ce.matchMedia(r[o]).matches, a && (l = 1), a !== s[o] && (s[o] = a, c = 1);
    c && (i.revert(), l && e.push(i));
  }), An("matchMediaRevert"), e.forEach(function(i) {
    return i.onMatch(i, function(r) {
      return i.add(null, r);
    });
  }), Ba = t, An("matchMedia"));
}, Ol = /* @__PURE__ */ function() {
  function n(e, i) {
    this.selector = i && hr(i), this.data = [], this._r = [], this.isReverted = !1, this.id = Su++, e && this.add(e);
  }
  var t = n.prototype;
  return t.add = function(i, r, s) {
    ot(i) && (s = r, r = i, i = ot);
    var a = this, o = function() {
      var c = tt, h = a.selector, f;
      return c && c !== a && c.data.push(a), s && (a.selector = hr(s)), tt = a, f = r.apply(a, arguments), ot(f) && a._r.push(f), tt = c, a.selector = h, a.isReverted = !1, f;
    };
    return a.last = o, i === ot ? o(a, function(l) {
      return a.add(null, l);
    }) : i ? a[i] = o : o;
  }, t.ignore = function(i) {
    var r = tt;
    tt = null, i(this), tt = r;
  }, t.getTweens = function() {
    var i = [];
    return this.data.forEach(function(r) {
      return r instanceof n ? i.push.apply(i, r.getTweens()) : r instanceof ut && !(r.parent && r.parent.data === "nested") && i.push(r);
    }), i;
  }, t.clear = function() {
    this._r.length = this.data.length = 0;
  }, t.kill = function(i, r) {
    var s = this;
    if (i ? function() {
      for (var o = s.getTweens(), l = s.data.length, c; l--; )
        c = s.data[l], c.data === "isFlip" && (c.revert(), c.getChildren(!0, !0, !1).forEach(function(h) {
          return o.splice(o.indexOf(h), 1);
        }));
      for (o.map(function(h) {
        return {
          g: h._dur || h._delay || h._sat && !h._sat.vars.immediateRender ? h.globalTime(0) : -1 / 0,
          t: h
        };
      }).sort(function(h, f) {
        return f.g - h.g || -1 / 0;
      }).forEach(function(h) {
        return h.t.revert(i);
      }), l = s.data.length; l--; )
        c = s.data[l], c instanceof Tt ? c.data !== "nested" && (c.scrollTrigger && c.scrollTrigger.revert(), c.kill()) : !(c instanceof ut) && c.revert && c.revert(i);
      s._r.forEach(function(h) {
        return h(i, s);
      }), s.isReverted = !0;
    }() : this.data.forEach(function(o) {
      return o.kill && o.kill();
    }), this.clear(), r)
      for (var a = Qe.length; a--; )
        Qe[a].id === this.id && Qe.splice(a, 1);
  }, t.revert = function(i) {
    this.kill(i || {});
  }, n;
}(), Au = /* @__PURE__ */ function() {
  function n(e) {
    this.contexts = [], this.scope = e, tt && tt.data.push(this);
  }
  var t = n.prototype;
  return t.add = function(i, r, s) {
    me(i) || (i = {
      matches: i
    });
    var a = new Ol(0, s || this.scope), o = a.conditions = {}, l, c, h;
    tt && !a.selector && (a.selector = tt.selector), this.contexts.push(a), r = a.add("onMatch", r), a.queries = i;
    for (c in i)
      c === "all" ? h = 1 : (l = ce.matchMedia(i[c]), l && (Qe.indexOf(a) < 0 && Qe.push(a), (o[c] = l.matches) && (h = 1), l.addListener ? l.addListener(fr) : l.addEventListener("change", fr)));
    return h && r(a, function(f) {
      return a.add(null, f);
    }), this;
  }, t.revert = function(i) {
    this.kill(i || {});
  }, t.kill = function(i) {
    this.contexts.forEach(function(r) {
      return r.kill(i, !0);
    });
  }, n;
}(), qs = {
  registerPlugin: function() {
    for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
      e[i] = arguments[i];
    e.forEach(function(r) {
      return wl(r);
    });
  },
  timeline: function(t) {
    return new Tt(t);
  },
  getTweensOf: function(t, e) {
    return it.getTweensOf(t, e);
  },
  getProperty: function(t, e, i, r) {
    vt(t) && (t = jt(t)[0]);
    var s = Ke(t || {}).get, a = i ? ll : ol;
    return i === "native" && (i = ""), t && (e ? a((Gt[e] && Gt[e].get || s)(t, e, i, r)) : function(o, l, c) {
      return a((Gt[o] && Gt[o].get || s)(t, o, l, c));
    });
  },
  quickSetter: function(t, e, i) {
    if (t = jt(t), t.length > 1) {
      var r = t.map(function(h) {
        return Ot.quickSetter(h, e, i);
      }), s = r.length;
      return function(h) {
        for (var f = s; f--; )
          r[f](h);
      };
    }
    t = t[0] || {};
    var a = Gt[e], o = Ke(t), l = o.harness && (o.harness.aliases || {})[e] || e, c = a ? function(h) {
      var f = new a();
      ui._pt = 0, f.init(t, i ? h + i : h, ui, 0, [t]), f.render(1, f), ui._pt && ia(1, ui);
    } : o.set(t, l);
    return a ? c : function(h) {
      return c(t, l, i ? h + i : h, o, 1);
    };
  },
  quickTo: function(t, e, i) {
    var r, s = Ot.to(t, Je((r = {}, r[e] = "+=0.1", r.paused = !0, r), i || {})), a = function(l, c, h) {
      return s.resetTo(e, l, c, h);
    };
    return a.tween = s, a;
  },
  isTweening: function(t) {
    return it.getTweensOf(t, !0).length > 0;
  },
  defaults: function(t) {
    return t && t.ease && (t.ease = Ze(t.ease, yi.ease)), Ma(yi, t || {});
  },
  config: function(t) {
    return Ma(Nt, t || {});
  },
  registerEffect: function(t) {
    var e = t.name, i = t.effect, r = t.plugins, s = t.defaults, a = t.extendTimeline;
    (r || "").split(",").forEach(function(o) {
      return o && !Gt[o] && !Ht[o] && is(e + " effect requires " + o + " plugin.");
    }), vn[e] = function(o, l, c) {
      return i(jt(o), qt(l || {}, s), c);
    }, a && (Tt.prototype[e] = function(o, l, c) {
      return this.add(vn[e](o, me(l) ? l : (c = l) && {}, this), c);
    });
  },
  registerEase: function(t, e) {
    N[t] = Ze(e);
  },
  parseEase: function(t, e) {
    return arguments.length ? Ze(t, e) : N;
  },
  getById: function(t) {
    return it.getById(t);
  },
  exportRoot: function(t, e) {
    t === void 0 && (t = {});
    var i = new Tt(t), r, s;
    for (i.smoothChildTiming = Bt(t.smoothChildTiming), it.remove(i), i._dp = 0, i._time = i._tTime = it._time, r = it._first; r; )
      s = r._next, (e || !(!r._dur && r instanceof ut && r.vars.onComplete === r._targets[0])) && ue(i, r, r._start - r._delay), r = s;
    return ue(it, i, 0), i;
  },
  context: function(t, e) {
    return t ? new Ol(t, e) : tt;
  },
  matchMedia: function(t) {
    return new Au(t);
  },
  matchMediaRefresh: function() {
    return Qe.forEach(function(t) {
      var e = t.conditions, i, r;
      for (r in e)
        e[r] && (e[r] = !1, i = 1);
      i && t.revert();
    }) || fr();
  },
  addEventListener: function(t, e) {
    var i = Us[t] || (Us[t] = []);
    ~i.indexOf(e) || i.push(e);
  },
  removeEventListener: function(t, e) {
    var i = Us[t], r = i && i.indexOf(e);
    r >= 0 && i.splice(r, 1);
  },
  utils: {
    wrap: iu,
    wrapYoyo: su,
    distribute: ml,
    random: _l,
    snap: gl,
    normalize: eu,
    getUnit: bt,
    clamp: Zc,
    splitColor: bl,
    toArray: jt,
    selector: hr,
    mapRange: yl,
    pipe: Jc,
    unitize: tu,
    interpolate: nu,
    shuffle: pl
  },
  install: il,
  effects: vn,
  ticker: Vt,
  updateRoot: Tt.updateRoot,
  plugins: Gt,
  globalTimeline: it,
  core: {
    PropTween: Ft,
    globals: sl,
    Tween: ut,
    Timeline: Tt,
    Animation: as,
    getCache: Ke,
    _removeLinkedListItem: ln,
    reverting: function() {
      return At;
    },
    context: function(t) {
      return t && tt && (tt.data.push(t), t._ctx = tt), tt;
    },
    suppressOverwrites: function(t) {
      return Hr = t;
    }
  }
};
Rt("to,from,fromTo,delayedCall,set,killTweensOf", function(n) {
  return qs[n] = ut[n];
});
Vt.add(Tt.updateRoot);
ui = qs.to({}, {
  duration: 0
});
var Cu = function(t, e) {
  for (var i = t._pt; i && i.p !== e && i.op !== e && i.fp !== e; )
    i = i._next;
  return i;
}, Pu = function(t, e) {
  var i = t._targets, r, s, a;
  for (r in e)
    for (s = i.length; s--; )
      a = t._ptLookup[s][r], a && (a = a.d) && (a._pt && (a = Cu(a, r)), a && a.modifier && a.modifier(e[r], t, i[s], r));
}, Cn = function(t, e) {
  return {
    name: t,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function(r, s, a) {
      a._onInit = function(o) {
        var l, c;
        if (vt(s) && (l = {}, Rt(s, function(h) {
          return l[h] = 1;
        }), s = l), e) {
          l = {};
          for (c in s)
            l[c] = e(s[c]);
          s = l;
        }
        Pu(o, s);
      };
    }
  };
}, Ot = qs.registerPlugin({
  name: "attr",
  init: function(t, e, i, r, s) {
    var a, o, l;
    this.tween = i;
    for (a in e)
      l = t.getAttribute(a) || "", o = this.add(t, "setAttribute", (l || 0) + "", e[a], r, s, 0, 0, a), o.op = a, o.b = l, this._props.push(a);
  },
  render: function(t, e) {
    for (var i = e._pt; i; )
      At ? i.set(i.t, i.p, i.b, i) : i.r(t, i.d), i = i._next;
  }
}, {
  name: "endArray",
  init: function(t, e) {
    for (var i = e.length; i--; )
      this.add(t, i, t[i] || 0, e[i], 0, 0, 0, 0, 0, 1);
  }
}, Cn("roundProps", cr), Cn("modifiers"), Cn("snap", gl)) || qs;
ut.version = Tt.version = Ot.version = "3.12.5";
el = 1;
Yr() && bi();
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
var Ra, ke, mi, sa, Ye, Fa, na, Mu = function() {
  return typeof window < "u";
}, Ce = {}, Ge = 180 / Math.PI, gi = Math.PI / 180, ri = Math.atan2, La = 1e8, ra = /([A-Z])/g, Tu = /(left|right|width|margin|padding|x)/i, ku = /[\s,\(]\S/, fe = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, dr = function(t, e) {
  return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e);
}, Eu = function(t, e) {
  return e.set(e.t, e.p, t === 1 ? e.e : Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e);
}, Iu = function(t, e) {
  return e.set(e.t, e.p, t ? Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u : e.b, e);
}, Bu = function(t, e) {
  var i = e.s + e.c * t;
  e.set(e.t, e.p, ~~(i + (i < 0 ? -0.5 : 0.5)) + e.u, e);
}, Dl = function(t, e) {
  return e.set(e.t, e.p, t ? e.e : e.b, e);
}, zl = function(t, e) {
  return e.set(e.t, e.p, t !== 1 ? e.b : e.e, e);
}, Ru = function(t, e, i) {
  return t.style[e] = i;
}, Fu = function(t, e, i) {
  return t.style.setProperty(e, i);
}, Lu = function(t, e, i) {
  return t._gsap[e] = i;
}, Ou = function(t, e, i) {
  return t._gsap.scaleX = t._gsap.scaleY = i;
}, Du = function(t, e, i, r, s) {
  var a = t._gsap;
  a.scaleX = a.scaleY = i, a.renderTransform(s, a);
}, zu = function(t, e, i, r, s) {
  var a = t._gsap;
  a[e] = i, a.renderTransform(s, a);
}, nt = "transform", Lt = nt + "Origin", Uu = function n(t, e) {
  var i = this, r = this.target, s = r.style, a = r._gsap;
  if (t in Ce && s) {
    if (this.tfm = this.tfm || {}, t !== "transform")
      t = fe[t] || t, ~t.indexOf(",") ? t.split(",").forEach(function(o) {
        return i.tfm[o] = ve(r, o);
      }) : this.tfm[t] = a.x ? a[t] : ve(r, t), t === Lt && (this.tfm.zOrigin = a.zOrigin);
    else
      return fe.transform.split(",").forEach(function(o) {
        return n.call(i, o, e);
      });
    if (this.props.indexOf(nt) >= 0)
      return;
    a.svg && (this.svgo = r.getAttribute("data-svg-origin"), this.props.push(Lt, e, "")), t = nt;
  }
  (s || e) && this.props.push(t, e, s[t]);
}, Ul = function(t) {
  t.translate && (t.removeProperty("translate"), t.removeProperty("scale"), t.removeProperty("rotate"));
}, Gu = function() {
  var t = this.props, e = this.target, i = e.style, r = e._gsap, s, a;
  for (s = 0; s < t.length; s += 3)
    t[s + 1] ? e[t[s]] = t[s + 2] : t[s + 2] ? i[t[s]] = t[s + 2] : i.removeProperty(t[s].substr(0, 2) === "--" ? t[s] : t[s].replace(ra, "-$1").toLowerCase());
  if (this.tfm) {
    for (a in this.tfm)
      r[a] = this.tfm[a];
    r.svg && (r.renderTransform(), e.setAttribute("data-svg-origin", this.svgo || "")), s = na(), (!s || !s.isStart) && !i[nt] && (Ul(i), r.zOrigin && i[Lt] && (i[Lt] += " " + r.zOrigin + "px", r.zOrigin = 0, r.renderTransform()), r.uncache = 1);
  }
}, Gl = function(t, e) {
  var i = {
    target: t,
    props: [],
    revert: Gu,
    save: Uu
  };
  return t._gsap || Ot.core.getCache(t), e && e.split(",").forEach(function(r) {
    return i.save(r);
  }), i;
}, Vl, pr = function(t, e) {
  var i = ke.createElementNS ? ke.createElementNS((e || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), t) : ke.createElement(t);
  return i && i.style ? i : ke.createElement(t);
}, pe = function n(t, e, i) {
  var r = getComputedStyle(t);
  return r[e] || r.getPropertyValue(e.replace(ra, "-$1").toLowerCase()) || r.getPropertyValue(e) || !i && n(t, Si(e) || e, 1) || "";
}, Oa = "O,Moz,ms,Ms,Webkit".split(","), Si = function(t, e, i) {
  var r = e || Ye, s = r.style, a = 5;
  if (t in s && !i)
    return t;
  for (t = t.charAt(0).toUpperCase() + t.substr(1); a-- && !(Oa[a] + t in s); )
    ;
  return a < 0 ? null : (a === 3 ? "ms" : a >= 0 ? Oa[a] : "") + t;
}, mr = function() {
  Mu() && window.document && (Ra = window, ke = Ra.document, mi = ke.documentElement, Ye = pr("div") || {
    style: {}
  }, pr("div"), nt = Si(nt), Lt = nt + "Origin", Ye.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", Vl = !!Si("perspective"), na = Ot.core.reverting, sa = 1);
}, Pn = function n(t) {
  var e = pr("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), i = this.parentNode, r = this.nextSibling, s = this.style.cssText, a;
  if (mi.appendChild(e), e.appendChild(this), this.style.display = "block", t)
    try {
      a = this.getBBox(), this._gsapBBox = this.getBBox, this.getBBox = n;
    } catch {
    }
  else this._gsapBBox && (a = this._gsapBBox());
  return i && (r ? i.insertBefore(this, r) : i.appendChild(this)), mi.removeChild(e), this.style.cssText = s, a;
}, Da = function(t, e) {
  for (var i = e.length; i--; )
    if (t.hasAttribute(e[i]))
      return t.getAttribute(e[i]);
}, Wl = function(t) {
  var e;
  try {
    e = t.getBBox();
  } catch {
    e = Pn.call(t, !0);
  }
  return e && (e.width || e.height) || t.getBBox === Pn || (e = Pn.call(t, !0)), e && !e.width && !e.x && !e.y ? {
    x: +Da(t, ["x", "cx", "x1"]) || 0,
    y: +Da(t, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : e;
}, Nl = function(t) {
  return !!(t.getCTM && (!t.parentNode || t.ownerSVGElement) && Wl(t));
}, ti = function(t, e) {
  if (e) {
    var i = t.style, r;
    e in Ce && e !== Lt && (e = nt), i.removeProperty ? (r = e.substr(0, 2), (r === "ms" || e.substr(0, 6) === "webkit") && (e = "-" + e), i.removeProperty(r === "--" ? e : e.replace(ra, "-$1").toLowerCase())) : i.removeAttribute(e);
  }
}, Ee = function(t, e, i, r, s, a) {
  var o = new Ft(t._pt, e, i, 0, 1, a ? zl : Dl);
  return t._pt = o, o.b = r, o.e = s, t._props.push(i), o;
}, za = {
  deg: 1,
  rad: 1,
  turn: 1
}, Vu = {
  grid: 1,
  flex: 1
}, Le = function n(t, e, i, r) {
  var s = parseFloat(i) || 0, a = (i + "").trim().substr((s + "").length) || "px", o = Ye.style, l = Tu.test(e), c = t.tagName.toLowerCase() === "svg", h = (c ? "client" : "offset") + (l ? "Width" : "Height"), f = 100, d = r === "px", u = r === "%", m, p, g, x;
  if (r === a || !s || za[r] || za[a])
    return s;
  if (a !== "px" && !d && (s = n(t, e, i, "px")), x = t.getCTM && Nl(t), (u || a === "%") && (Ce[e] || ~e.indexOf("adius")))
    return m = x ? t.getBBox()[l ? "width" : "height"] : t[h], ht(u ? s / m * f : s / 100 * m);
  if (o[l ? "width" : "height"] = f + (d ? a : r), p = ~e.indexOf("adius") || r === "em" && t.appendChild && !c ? t : t.parentNode, x && (p = (t.ownerSVGElement || {}).parentNode), (!p || p === ke || !p.appendChild) && (p = ke.body), g = p._gsap, g && u && g.width && l && g.time === Vt.time && !g.uncache)
    return ht(s / g.width * f);
  if (u && (e === "height" || e === "width")) {
    var y = t.style[e];
    t.style[e] = f + r, m = t[h], y ? t.style[e] = y : ti(t, e);
  } else
    (u || a === "%") && !Vu[pe(p, "display")] && (o.position = pe(t, "position")), p === t && (o.position = "static"), p.appendChild(Ye), m = Ye[h], p.removeChild(Ye), o.position = "absolute";
  return l && u && (g = Ke(p), g.time = Vt.time, g.width = p[h]), ht(d ? m * s / f : m && s ? f / m * s : 0);
}, ve = function(t, e, i, r) {
  var s;
  return sa || mr(), e in fe && e !== "transform" && (e = fe[e], ~e.indexOf(",") && (e = e.split(",")[0])), Ce[e] && e !== "transform" ? (s = ls(t, r), s = e !== "transformOrigin" ? s[e] : s.svg ? s.origin : Qs(pe(t, Lt)) + " " + s.zOrigin + "px") : (s = t.style[e], (!s || s === "auto" || r || ~(s + "").indexOf("calc(")) && (s = Zs[e] && Zs[e](t, e, i) || pe(t, e) || rl(t, e) || (e === "opacity" ? 1 : 0))), i && !~(s + "").trim().indexOf(" ") ? Le(t, e, s, i) + i : s;
}, Wu = function(t, e, i, r) {
  if (!i || i === "none") {
    var s = Si(e, t, 1), a = s && pe(t, s, 1);
    a && a !== i ? (e = s, i = a) : e === "borderColor" && (i = pe(t, "borderTopColor"));
  }
  var o = new Ft(this._pt, t.style, e, 0, 1, Fl), l = 0, c = 0, h, f, d, u, m, p, g, x, y, v, b, _;
  if (o.b = i, o.e = r, i += "", r += "", r === "auto" && (p = t.style[e], t.style[e] = r, r = pe(t, e) || r, p ? t.style[e] = p : ti(t, e)), h = [i, r], Al(h), i = h[0], r = h[1], d = i.match(ci) || [], _ = r.match(ci) || [], _.length) {
    for (; f = ci.exec(r); )
      g = f[0], y = r.substring(l, f.index), m ? m = (m + 1) % 5 : (y.substr(-5) === "rgba(" || y.substr(-5) === "hsla(") && (m = 1), g !== (p = d[c++] || "") && (u = parseFloat(p) || 0, b = p.substr((u + "").length), g.charAt(1) === "=" && (g = pi(u, g) + b), x = parseFloat(g), v = g.substr((x + "").length), l = ci.lastIndex - v.length, v || (v = v || Nt.units[e] || b, l === r.length && (r += v, o.e += v)), b !== v && (u = Le(t, e, p, v) || 0), o._pt = {
        _next: o._pt,
        p: y || c === 1 ? y : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: u,
        c: x - u,
        m: m && m < 4 || e === "zIndex" ? Math.round : 0
      });
    o.c = l < r.length ? r.substring(l, r.length) : "";
  } else
    o.r = e === "display" && r === "none" ? zl : Dl;
  return Jo.test(r) && (o.e = 0), this._pt = o, o;
}, Ua = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, Nu = function(t) {
  var e = t.split(" "), i = e[0], r = e[1] || "50%";
  return (i === "top" || i === "bottom" || r === "left" || r === "right") && (t = i, i = r, r = t), e[0] = Ua[i] || i, e[1] = Ua[r] || r, e.join(" ");
}, Hu = function(t, e) {
  if (e.tween && e.tween._time === e.tween._dur) {
    var i = e.t, r = i.style, s = e.u, a = i._gsap, o, l, c;
    if (s === "all" || s === !0)
      r.cssText = "", l = 1;
    else
      for (s = s.split(","), c = s.length; --c > -1; )
        o = s[c], Ce[o] && (l = 1, o = o === "transformOrigin" ? Lt : nt), ti(i, o);
    l && (ti(i, nt), a && (a.svg && i.removeAttribute("transform"), ls(i, 1), a.uncache = 1, Ul(r)));
  }
}, Zs = {
  clearProps: function(t, e, i, r, s) {
    if (s.data !== "isFromStart") {
      var a = t._pt = new Ft(t._pt, e, i, 0, 0, Hu);
      return a.u = r, a.pr = -10, a.tween = s, t._props.push(i), 1;
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
}, os = [1, 0, 0, 1, 0, 0], Hl = {}, $l = function(t) {
  return t === "matrix(1, 0, 0, 1, 0, 0)" || t === "none" || !t;
}, Ga = function(t) {
  var e = pe(t, nt);
  return $l(e) ? os : e.substr(7).match(Qo).map(ht);
}, aa = function(t, e) {
  var i = t._gsap || Ke(t), r = t.style, s = Ga(t), a, o, l, c;
  return i.svg && t.getAttribute("transform") ? (l = t.transform.baseVal.consolidate().matrix, s = [l.a, l.b, l.c, l.d, l.e, l.f], s.join(",") === "1,0,0,1,0,0" ? os : s) : (s === os && !t.offsetParent && t !== mi && !i.svg && (l = r.display, r.display = "block", a = t.parentNode, (!a || !t.offsetParent) && (c = 1, o = t.nextElementSibling, mi.appendChild(t)), s = Ga(t), l ? r.display = l : ti(t, "display"), c && (o ? a.insertBefore(t, o) : a ? a.appendChild(t) : mi.removeChild(t))), e && s.length > 6 ? [s[0], s[1], s[4], s[5], s[12], s[13]] : s);
}, gr = function(t, e, i, r, s, a) {
  var o = t._gsap, l = s || aa(t, !0), c = o.xOrigin || 0, h = o.yOrigin || 0, f = o.xOffset || 0, d = o.yOffset || 0, u = l[0], m = l[1], p = l[2], g = l[3], x = l[4], y = l[5], v = e.split(" "), b = parseFloat(v[0]) || 0, _ = parseFloat(v[1]) || 0, S, C, w, A;
  i ? l !== os && (C = u * g - m * p) && (w = b * (g / C) + _ * (-p / C) + (p * y - g * x) / C, A = b * (-m / C) + _ * (u / C) - (u * y - m * x) / C, b = w, _ = A) : (S = Wl(t), b = S.x + (~v[0].indexOf("%") ? b / 100 * S.width : b), _ = S.y + (~(v[1] || v[0]).indexOf("%") ? _ / 100 * S.height : _)), r || r !== !1 && o.smooth ? (x = b - c, y = _ - h, o.xOffset = f + (x * u + y * p) - x, o.yOffset = d + (x * m + y * g) - y) : o.xOffset = o.yOffset = 0, o.xOrigin = b, o.yOrigin = _, o.smooth = !!r, o.origin = e, o.originIsAbsolute = !!i, t.style[Lt] = "0px 0px", a && (Ee(a, o, "xOrigin", c, b), Ee(a, o, "yOrigin", h, _), Ee(a, o, "xOffset", f, o.xOffset), Ee(a, o, "yOffset", d, o.yOffset)), t.setAttribute("data-svg-origin", b + " " + _);
}, ls = function(t, e) {
  var i = t._gsap || new Tl(t);
  if ("x" in i && !e && !i.uncache)
    return i;
  var r = t.style, s = i.scaleX < 0, a = "px", o = "deg", l = getComputedStyle(t), c = pe(t, Lt) || "0", h, f, d, u, m, p, g, x, y, v, b, _, S, C, w, A, P, M, T, k, E, I, B, R, z, F, L, Z, U, j, J, Q;
  return h = f = d = p = g = x = y = v = b = 0, u = m = 1, i.svg = !!(t.getCTM && Nl(t)), l.translate && ((l.translate !== "none" || l.scale !== "none" || l.rotate !== "none") && (r[nt] = (l.translate !== "none" ? "translate3d(" + (l.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (l.rotate !== "none" ? "rotate(" + l.rotate + ") " : "") + (l.scale !== "none" ? "scale(" + l.scale.split(" ").join(",") + ") " : "") + (l[nt] !== "none" ? l[nt] : "")), r.scale = r.rotate = r.translate = "none"), C = aa(t, i.svg), i.svg && (i.uncache ? (z = t.getBBox(), c = i.xOrigin - z.x + "px " + (i.yOrigin - z.y) + "px", R = "") : R = !e && t.getAttribute("data-svg-origin"), gr(t, R || c, !!R || i.originIsAbsolute, i.smooth !== !1, C)), _ = i.xOrigin || 0, S = i.yOrigin || 0, C !== os && (M = C[0], T = C[1], k = C[2], E = C[3], h = I = C[4], f = B = C[5], C.length === 6 ? (u = Math.sqrt(M * M + T * T), m = Math.sqrt(E * E + k * k), p = M || T ? ri(T, M) * Ge : 0, y = k || E ? ri(k, E) * Ge + p : 0, y && (m *= Math.abs(Math.cos(y * gi))), i.svg && (h -= _ - (_ * M + S * k), f -= S - (_ * T + S * E))) : (Q = C[6], j = C[7], L = C[8], Z = C[9], U = C[10], J = C[11], h = C[12], f = C[13], d = C[14], w = ri(Q, U), g = w * Ge, w && (A = Math.cos(-w), P = Math.sin(-w), R = I * A + L * P, z = B * A + Z * P, F = Q * A + U * P, L = I * -P + L * A, Z = B * -P + Z * A, U = Q * -P + U * A, J = j * -P + J * A, I = R, B = z, Q = F), w = ri(-k, U), x = w * Ge, w && (A = Math.cos(-w), P = Math.sin(-w), R = M * A - L * P, z = T * A - Z * P, F = k * A - U * P, J = E * P + J * A, M = R, T = z, k = F), w = ri(T, M), p = w * Ge, w && (A = Math.cos(w), P = Math.sin(w), R = M * A + T * P, z = I * A + B * P, T = T * A - M * P, B = B * A - I * P, M = R, I = z), g && Math.abs(g) + Math.abs(p) > 359.9 && (g = p = 0, x = 180 - x), u = ht(Math.sqrt(M * M + T * T + k * k)), m = ht(Math.sqrt(B * B + Q * Q)), w = ri(I, B), y = Math.abs(w) > 2e-4 ? w * Ge : 0, b = J ? 1 / (J < 0 ? -J : J) : 0), i.svg && (R = t.getAttribute("transform"), i.forceCSS = t.setAttribute("transform", "") || !$l(pe(t, nt)), R && t.setAttribute("transform", R))), Math.abs(y) > 90 && Math.abs(y) < 270 && (s ? (u *= -1, y += p <= 0 ? 180 : -180, p += p <= 0 ? 180 : -180) : (m *= -1, y += y <= 0 ? 180 : -180)), e = e || i.uncache, i.x = h - ((i.xPercent = h && (!e && i.xPercent || (Math.round(t.offsetWidth / 2) === Math.round(-h) ? -50 : 0))) ? t.offsetWidth * i.xPercent / 100 : 0) + a, i.y = f - ((i.yPercent = f && (!e && i.yPercent || (Math.round(t.offsetHeight / 2) === Math.round(-f) ? -50 : 0))) ? t.offsetHeight * i.yPercent / 100 : 0) + a, i.z = d + a, i.scaleX = ht(u), i.scaleY = ht(m), i.rotation = ht(p) + o, i.rotationX = ht(g) + o, i.rotationY = ht(x) + o, i.skewX = y + o, i.skewY = v + o, i.transformPerspective = b + a, (i.zOrigin = parseFloat(c.split(" ")[2]) || !e && i.zOrigin || 0) && (r[Lt] = Qs(c)), i.xOffset = i.yOffset = 0, i.force3D = Nt.force3D, i.renderTransform = i.svg ? Yu : Vl ? Yl : $u, i.uncache = 0, i;
}, Qs = function(t) {
  return (t = t.split(" "))[0] + " " + t[1];
}, Mn = function(t, e, i) {
  var r = bt(e);
  return ht(parseFloat(e) + parseFloat(Le(t, "x", i + "px", r))) + r;
}, $u = function(t, e) {
  e.z = "0px", e.rotationY = e.rotationX = "0deg", e.force3D = 0, Yl(t, e);
}, De = "0deg", Di = "0px", ze = ") ", Yl = function(t, e) {
  var i = e || this, r = i.xPercent, s = i.yPercent, a = i.x, o = i.y, l = i.z, c = i.rotation, h = i.rotationY, f = i.rotationX, d = i.skewX, u = i.skewY, m = i.scaleX, p = i.scaleY, g = i.transformPerspective, x = i.force3D, y = i.target, v = i.zOrigin, b = "", _ = x === "auto" && t && t !== 1 || x === !0;
  if (v && (f !== De || h !== De)) {
    var S = parseFloat(h) * gi, C = Math.sin(S), w = Math.cos(S), A;
    S = parseFloat(f) * gi, A = Math.cos(S), a = Mn(y, a, C * A * -v), o = Mn(y, o, -Math.sin(S) * -v), l = Mn(y, l, w * A * -v + v);
  }
  g !== Di && (b += "perspective(" + g + ze), (r || s) && (b += "translate(" + r + "%, " + s + "%) "), (_ || a !== Di || o !== Di || l !== Di) && (b += l !== Di || _ ? "translate3d(" + a + ", " + o + ", " + l + ") " : "translate(" + a + ", " + o + ze), c !== De && (b += "rotate(" + c + ze), h !== De && (b += "rotateY(" + h + ze), f !== De && (b += "rotateX(" + f + ze), (d !== De || u !== De) && (b += "skew(" + d + ", " + u + ze), (m !== 1 || p !== 1) && (b += "scale(" + m + ", " + p + ze), y.style[nt] = b || "translate(0, 0)";
}, Yu = function(t, e) {
  var i = e || this, r = i.xPercent, s = i.yPercent, a = i.x, o = i.y, l = i.rotation, c = i.skewX, h = i.skewY, f = i.scaleX, d = i.scaleY, u = i.target, m = i.xOrigin, p = i.yOrigin, g = i.xOffset, x = i.yOffset, y = i.forceCSS, v = parseFloat(a), b = parseFloat(o), _, S, C, w, A;
  l = parseFloat(l), c = parseFloat(c), h = parseFloat(h), h && (h = parseFloat(h), c += h, l += h), l || c ? (l *= gi, c *= gi, _ = Math.cos(l) * f, S = Math.sin(l) * f, C = Math.sin(l - c) * -d, w = Math.cos(l - c) * d, c && (h *= gi, A = Math.tan(c - h), A = Math.sqrt(1 + A * A), C *= A, w *= A, h && (A = Math.tan(h), A = Math.sqrt(1 + A * A), _ *= A, S *= A)), _ = ht(_), S = ht(S), C = ht(C), w = ht(w)) : (_ = f, w = d, S = C = 0), (v && !~(a + "").indexOf("px") || b && !~(o + "").indexOf("px")) && (v = Le(u, "x", a, "px"), b = Le(u, "y", o, "px")), (m || p || g || x) && (v = ht(v + m - (m * _ + p * C) + g), b = ht(b + p - (m * S + p * w) + x)), (r || s) && (A = u.getBBox(), v = ht(v + r / 100 * A.width), b = ht(b + s / 100 * A.height)), A = "matrix(" + _ + "," + S + "," + C + "," + w + "," + v + "," + b + ")", u.setAttribute("transform", A), y && (u.style[nt] = A);
}, Xu = function(t, e, i, r, s) {
  var a = 360, o = vt(s), l = parseFloat(s) * (o && ~s.indexOf("rad") ? Ge : 1), c = l - r, h = r + c + "deg", f, d;
  return o && (f = s.split("_")[1], f === "short" && (c %= a, c !== c % (a / 2) && (c += c < 0 ? a : -a)), f === "cw" && c < 0 ? c = (c + a * La) % a - ~~(c / a) * a : f === "ccw" && c > 0 && (c = (c - a * La) % a - ~~(c / a) * a)), t._pt = d = new Ft(t._pt, e, i, r, c, Eu), d.e = h, d.u = "deg", t._props.push(i), d;
}, Va = function(t, e) {
  for (var i in e)
    t[i] = e[i];
  return t;
}, ju = function(t, e, i) {
  var r = Va({}, i._gsap), s = "perspective,force3D,transformOrigin,svgOrigin", a = i.style, o, l, c, h, f, d, u, m;
  r.svg ? (c = i.getAttribute("transform"), i.setAttribute("transform", ""), a[nt] = e, o = ls(i, 1), ti(i, nt), i.setAttribute("transform", c)) : (c = getComputedStyle(i)[nt], a[nt] = e, o = ls(i, 1), a[nt] = c);
  for (l in Ce)
    c = r[l], h = o[l], c !== h && s.indexOf(l) < 0 && (u = bt(c), m = bt(h), f = u !== m ? Le(i, l, c, m) : parseFloat(c), d = parseFloat(h), t._pt = new Ft(t._pt, o, l, f, d - f, dr), t._pt.u = m || 0, t._props.push(l));
  Va(o, r);
};
Rt("padding,margin,Width,Radius", function(n, t) {
  var e = "Top", i = "Right", r = "Bottom", s = "Left", a = (t < 3 ? [e, i, r, s] : [e + s, e + i, r + i, r + s]).map(function(o) {
    return t < 2 ? n + o : "border" + o + n;
  });
  Zs[t > 1 ? "border" + n : n] = function(o, l, c, h, f) {
    var d, u;
    if (arguments.length < 4)
      return d = a.map(function(m) {
        return ve(o, m, c);
      }), u = d.join(" "), u.split(d[0]).length === 5 ? d[0] : u;
    d = (h + "").split(" "), u = {}, a.forEach(function(m, p) {
      return u[m] = d[p] = d[p] || d[(p - 1) / 2 | 0];
    }), o.init(l, u, f);
  };
});
var Xl = {
  name: "css",
  register: mr,
  targetTest: function(t) {
    return t.style && t.nodeType;
  },
  init: function(t, e, i, r, s) {
    var a = this._props, o = t.style, l = i.vars.startAt, c, h, f, d, u, m, p, g, x, y, v, b, _, S, C, w;
    sa || mr(), this.styles = this.styles || Gl(t), w = this.styles.props, this.tween = i;
    for (p in e)
      if (p !== "autoRound" && (h = e[p], !(Gt[p] && kl(p, e, i, r, t, s)))) {
        if (u = typeof h, m = Zs[p], u === "function" && (h = h.call(i, r, t, s), u = typeof h), u === "string" && ~h.indexOf("random(") && (h = ns(h)), m)
          m(this, t, p, h, i) && (C = 1);
        else if (p.substr(0, 2) === "--")
          c = (getComputedStyle(t).getPropertyValue(p) + "").trim(), h += "", Re.lastIndex = 0, Re.test(c) || (g = bt(c), x = bt(h)), x ? g !== x && (c = Le(t, p, c, x) + x) : g && (h += g), this.add(o, "setProperty", c, h, r, s, 0, 0, p), a.push(p), w.push(p, 0, o[p]);
        else if (u !== "undefined") {
          if (l && p in l ? (c = typeof l[p] == "function" ? l[p].call(i, r, t, s) : l[p], vt(c) && ~c.indexOf("random(") && (c = ns(c)), bt(c + "") || c === "auto" || (c += Nt.units[p] || bt(ve(t, p)) || ""), (c + "").charAt(1) === "=" && (c = ve(t, p))) : c = ve(t, p), d = parseFloat(c), y = u === "string" && h.charAt(1) === "=" && h.substr(0, 2), y && (h = h.substr(2)), f = parseFloat(h), p in fe && (p === "autoAlpha" && (d === 1 && ve(t, "visibility") === "hidden" && f && (d = 0), w.push("visibility", 0, o.visibility), Ee(this, o, "visibility", d ? "inherit" : "hidden", f ? "inherit" : "hidden", !f)), p !== "scale" && p !== "transform" && (p = fe[p], ~p.indexOf(",") && (p = p.split(",")[0]))), v = p in Ce, v) {
            if (this.styles.save(p), b || (_ = t._gsap, _.renderTransform && !e.parseTransform || ls(t, e.parseTransform), S = e.smoothOrigin !== !1 && _.smooth, b = this._pt = new Ft(this._pt, o, nt, 0, 1, _.renderTransform, _, 0, -1), b.dep = 1), p === "scale")
              this._pt = new Ft(this._pt, _, "scaleY", _.scaleY, (y ? pi(_.scaleY, y + f) : f) - _.scaleY || 0, dr), this._pt.u = 0, a.push("scaleY", p), p += "X";
            else if (p === "transformOrigin") {
              w.push(Lt, 0, o[Lt]), h = Nu(h), _.svg ? gr(t, h, 0, S, 0, this) : (x = parseFloat(h.split(" ")[2]) || 0, x !== _.zOrigin && Ee(this, _, "zOrigin", _.zOrigin, x), Ee(this, o, p, Qs(c), Qs(h)));
              continue;
            } else if (p === "svgOrigin") {
              gr(t, h, 1, S, 0, this);
              continue;
            } else if (p in Hl) {
              Xu(this, _, p, d, y ? pi(d, y + h) : h);
              continue;
            } else if (p === "smoothOrigin") {
              Ee(this, _, "smooth", _.smooth, h);
              continue;
            } else if (p === "force3D") {
              _[p] = h;
              continue;
            } else if (p === "transform") {
              ju(this, h, t);
              continue;
            }
          } else p in o || (p = Si(p) || p);
          if (v || (f || f === 0) && (d || d === 0) && !ku.test(h) && p in o)
            g = (c + "").substr((d + "").length), f || (f = 0), x = bt(h) || (p in Nt.units ? Nt.units[p] : g), g !== x && (d = Le(t, p, c, x)), this._pt = new Ft(this._pt, v ? _ : o, p, d, (y ? pi(d, y + f) : f) - d, !v && (x === "px" || p === "zIndex") && e.autoRound !== !1 ? Bu : dr), this._pt.u = x || 0, g !== x && x !== "%" && (this._pt.b = c, this._pt.r = Iu);
          else if (p in o)
            Wu.call(this, t, p, c, y ? y + h : h);
          else if (p in t)
            this.add(t, p, c || t[p], y ? y + h : h, r, s);
          else if (p !== "parseTransform") {
            jr(p, h);
            continue;
          }
          v || (p in o ? w.push(p, 0, o[p]) : w.push(p, 1, c || t[p])), a.push(p);
        }
      }
    C && Ll(this);
  },
  render: function(t, e) {
    if (e.tween._time || !na())
      for (var i = e._pt; i; )
        i.r(t, i.d), i = i._next;
    else
      e.styles.revert();
  },
  get: ve,
  aliases: fe,
  getSetter: function(t, e, i) {
    var r = fe[e];
    return r && r.indexOf(",") < 0 && (e = r), e in Ce && e !== Lt && (t._gsap.x || ve(t, "x")) ? i && Fa === i ? e === "scale" ? Ou : Lu : (Fa = i || {}) && (e === "scale" ? Du : zu) : t.style && !$r(t.style[e]) ? Ru : ~e.indexOf("-") ? Fu : ea(t, e);
  },
  core: {
    _removeProperty: ti,
    _getMatrix: aa
  }
};
Ot.utils.checkPrefix = Si;
Ot.core.getStyleSaver = Gl;
(function(n, t, e, i) {
  var r = Rt(n + "," + t + "," + e, function(s) {
    Ce[s] = 1;
  });
  Rt(t, function(s) {
    Nt.units[s] = "deg", Hl[s] = 1;
  }), fe[r[13]] = n + "," + t, Rt(i, function(s) {
    var a = s.split(":");
    fe[a[1]] = r[a[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
Rt("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(n) {
  Nt.units[n] = "px";
});
Ot.registerPlugin(Xl);
var Hi = Ot.registerPlugin(Xl) || Ot;
Hi.core.Tween;
class ki {
  constructor(t) {
    te(this, "_options");
    te(this, "_tween", null);
    this._options = t;
  }
  get options() {
    return this._options;
  }
  start(t) {
    return new Promise((e) => {
      this._tween = Hi.fromTo(t, this.options.from, {
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
    Hi.ticker.remove(Hi.updateRoot);
  }
  static updateEngine(t) {
    this.rootTimeMs += t, Hi.updateRoot(this.rootTimeMs / 1e3);
  }
}
te(ki, "rootTimeMs", 0);
var jl = { exports: {} };
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
(function(n, t) {
  (function(i, r) {
    n.exports = r();
  })($e, function() {
    return (
      /******/
      function(e) {
        var i = {};
        function r(s) {
          if (i[s])
            return i[s].exports;
          var a = i[s] = {
            /******/
            i: s,
            /******/
            l: !1,
            /******/
            exports: {}
            /******/
          };
          return e[s].call(a.exports, a, a.exports, r), a.l = !0, a.exports;
        }
        return r.m = e, r.c = i, r.d = function(s, a, o) {
          r.o(s, a) || Object.defineProperty(s, a, { enumerable: !0, get: o });
        }, r.r = function(s) {
          typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(s, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(s, "__esModule", { value: !0 });
        }, r.t = function(s, a) {
          if (a & 1 && (s = r(s)), a & 8 || a & 4 && typeof s == "object" && s && s.__esModule) return s;
          var o = /* @__PURE__ */ Object.create(null);
          if (r.r(o), Object.defineProperty(o, "default", { enumerable: !0, value: s }), a & 2 && typeof s != "string") for (var l in s) r.d(o, l, (function(c) {
            return s[c];
          }).bind(null, l));
          return o;
        }, r.n = function(s) {
          var a = s && s.__esModule ? (
            /******/
            function() {
              return s.default;
            }
          ) : (
            /******/
            function() {
              return s;
            }
          );
          return r.d(a, "a", a), a;
        }, r.o = function(s, a) {
          return Object.prototype.hasOwnProperty.call(s, a);
        }, r.p = "", r(r.s = 20);
      }([
        /* 0 */
        /***/
        function(e, i) {
          var r = {};
          e.exports = r, function() {
            r._baseDelta = 1e3 / 60, r._nextId = 0, r._seed = 0, r._nowStartTime = +/* @__PURE__ */ new Date(), r._warnedOnce = {}, r._decomp = null, r.extend = function(a, o) {
              var l, c;
              typeof o == "boolean" ? (l = 2, c = o) : (l = 1, c = !0);
              for (var h = l; h < arguments.length; h++) {
                var f = arguments[h];
                if (f)
                  for (var d in f)
                    c && f[d] && f[d].constructor === Object && (!a[d] || a[d].constructor === Object) ? (a[d] = a[d] || {}, r.extend(a[d], c, f[d])) : a[d] = f[d];
              }
              return a;
            }, r.clone = function(a, o) {
              return r.extend({}, o, a);
            }, r.keys = function(a) {
              if (Object.keys)
                return Object.keys(a);
              var o = [];
              for (var l in a)
                o.push(l);
              return o;
            }, r.values = function(a) {
              var o = [];
              if (Object.keys) {
                for (var l = Object.keys(a), c = 0; c < l.length; c++)
                  o.push(a[l[c]]);
                return o;
              }
              for (var h in a)
                o.push(a[h]);
              return o;
            }, r.get = function(a, o, l, c) {
              o = o.split(".").slice(l, c);
              for (var h = 0; h < o.length; h += 1)
                a = a[o[h]];
              return a;
            }, r.set = function(a, o, l, c, h) {
              var f = o.split(".").slice(c, h);
              return r.get(a, o, 0, -1)[f[f.length - 1]] = l, l;
            }, r.shuffle = function(a) {
              for (var o = a.length - 1; o > 0; o--) {
                var l = Math.floor(r.random() * (o + 1)), c = a[o];
                a[o] = a[l], a[l] = c;
              }
              return a;
            }, r.choose = function(a) {
              return a[Math.floor(r.random() * a.length)];
            }, r.isElement = function(a) {
              return typeof HTMLElement < "u" ? a instanceof HTMLElement : !!(a && a.nodeType && a.nodeName);
            }, r.isArray = function(a) {
              return Object.prototype.toString.call(a) === "[object Array]";
            }, r.isFunction = function(a) {
              return typeof a == "function";
            }, r.isPlainObject = function(a) {
              return typeof a == "object" && a.constructor === Object;
            }, r.isString = function(a) {
              return toString.call(a) === "[object String]";
            }, r.clamp = function(a, o, l) {
              return a < o ? o : a > l ? l : a;
            }, r.sign = function(a) {
              return a < 0 ? -1 : 1;
            }, r.now = function() {
              if (typeof window < "u" && window.performance) {
                if (window.performance.now)
                  return window.performance.now();
                if (window.performance.webkitNow)
                  return window.performance.webkitNow();
              }
              return Date.now ? Date.now() : /* @__PURE__ */ new Date() - r._nowStartTime;
            }, r.random = function(a, o) {
              return a = typeof a < "u" ? a : 0, o = typeof o < "u" ? o : 1, a + s() * (o - a);
            };
            var s = function() {
              return r._seed = (r._seed * 9301 + 49297) % 233280, r._seed / 233280;
            };
            r.colorToNumber = function(a) {
              return a = a.replace("#", ""), a.length == 3 && (a = a.charAt(0) + a.charAt(0) + a.charAt(1) + a.charAt(1) + a.charAt(2) + a.charAt(2)), parseInt(a, 16);
            }, r.logLevel = 1, r.log = function() {
              console && r.logLevel > 0 && r.logLevel <= 3 && console.log.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, r.info = function() {
              console && r.logLevel > 0 && r.logLevel <= 2 && console.info.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, r.warn = function() {
              console && r.logLevel > 0 && r.logLevel <= 3 && console.warn.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, r.warnOnce = function() {
              var a = Array.prototype.slice.call(arguments).join(" ");
              r._warnedOnce[a] || (r.warn(a), r._warnedOnce[a] = !0);
            }, r.deprecated = function(a, o, l) {
              a[o] = r.chain(function() {
                r.warnOnce("🔅 deprecated 🔅", l);
              }, a[o]);
            }, r.nextId = function() {
              return r._nextId++;
            }, r.indexOf = function(a, o) {
              if (a.indexOf)
                return a.indexOf(o);
              for (var l = 0; l < a.length; l++)
                if (a[l] === o)
                  return l;
              return -1;
            }, r.map = function(a, o) {
              if (a.map)
                return a.map(o);
              for (var l = [], c = 0; c < a.length; c += 1)
                l.push(o(a[c]));
              return l;
            }, r.topologicalSort = function(a) {
              var o = [], l = [], c = [];
              for (var h in a)
                !l[h] && !c[h] && r._topologicalSort(h, l, c, a, o);
              return o;
            }, r._topologicalSort = function(a, o, l, c, h) {
              var f = c[a] || [];
              l[a] = !0;
              for (var d = 0; d < f.length; d += 1) {
                var u = f[d];
                l[u] || o[u] || r._topologicalSort(u, o, l, c, h);
              }
              l[a] = !1, o[a] = !0, h.push(a);
            }, r.chain = function() {
              for (var a = [], o = 0; o < arguments.length; o += 1) {
                var l = arguments[o];
                l._chained ? a.push.apply(a, l._chained) : a.push(l);
              }
              var c = function() {
                for (var h, f = new Array(arguments.length), d = 0, u = arguments.length; d < u; d++)
                  f[d] = arguments[d];
                for (d = 0; d < a.length; d += 1) {
                  var m = a[d].apply(h, f);
                  typeof m < "u" && (h = m);
                }
                return h;
              };
              return c._chained = a, c;
            }, r.chainPathBefore = function(a, o, l) {
              return r.set(a, o, r.chain(
                l,
                r.get(a, o)
              ));
            }, r.chainPathAfter = function(a, o, l) {
              return r.set(a, o, r.chain(
                r.get(a, o),
                l
              ));
            }, r.setDecomp = function(a) {
              r._decomp = a;
            }, r.getDecomp = function() {
              var a = r._decomp;
              try {
                !a && typeof window < "u" && (a = window.decomp), !a && typeof $e < "u" && (a = $e.decomp);
              } catch {
                a = null;
              }
              return a;
            };
          }();
        },
        /* 1 */
        /***/
        function(e, i) {
          var r = {};
          e.exports = r, function() {
            r.create = function(s) {
              var a = {
                min: { x: 0, y: 0 },
                max: { x: 0, y: 0 }
              };
              return s && r.update(a, s), a;
            }, r.update = function(s, a, o) {
              s.min.x = 1 / 0, s.max.x = -1 / 0, s.min.y = 1 / 0, s.max.y = -1 / 0;
              for (var l = 0; l < a.length; l++) {
                var c = a[l];
                c.x > s.max.x && (s.max.x = c.x), c.x < s.min.x && (s.min.x = c.x), c.y > s.max.y && (s.max.y = c.y), c.y < s.min.y && (s.min.y = c.y);
              }
              o && (o.x > 0 ? s.max.x += o.x : s.min.x += o.x, o.y > 0 ? s.max.y += o.y : s.min.y += o.y);
            }, r.contains = function(s, a) {
              return a.x >= s.min.x && a.x <= s.max.x && a.y >= s.min.y && a.y <= s.max.y;
            }, r.overlaps = function(s, a) {
              return s.min.x <= a.max.x && s.max.x >= a.min.x && s.max.y >= a.min.y && s.min.y <= a.max.y;
            }, r.translate = function(s, a) {
              s.min.x += a.x, s.max.x += a.x, s.min.y += a.y, s.max.y += a.y;
            }, r.shift = function(s, a) {
              var o = s.max.x - s.min.x, l = s.max.y - s.min.y;
              s.min.x = a.x, s.max.x = a.x + o, s.min.y = a.y, s.max.y = a.y + l;
            };
          }();
        },
        /* 2 */
        /***/
        function(e, i) {
          var r = {};
          e.exports = r, function() {
            r.create = function(s, a) {
              return { x: s || 0, y: a || 0 };
            }, r.clone = function(s) {
              return { x: s.x, y: s.y };
            }, r.magnitude = function(s) {
              return Math.sqrt(s.x * s.x + s.y * s.y);
            }, r.magnitudeSquared = function(s) {
              return s.x * s.x + s.y * s.y;
            }, r.rotate = function(s, a, o) {
              var l = Math.cos(a), c = Math.sin(a);
              o || (o = {});
              var h = s.x * l - s.y * c;
              return o.y = s.x * c + s.y * l, o.x = h, o;
            }, r.rotateAbout = function(s, a, o, l) {
              var c = Math.cos(a), h = Math.sin(a);
              l || (l = {});
              var f = o.x + ((s.x - o.x) * c - (s.y - o.y) * h);
              return l.y = o.y + ((s.x - o.x) * h + (s.y - o.y) * c), l.x = f, l;
            }, r.normalise = function(s) {
              var a = r.magnitude(s);
              return a === 0 ? { x: 0, y: 0 } : { x: s.x / a, y: s.y / a };
            }, r.dot = function(s, a) {
              return s.x * a.x + s.y * a.y;
            }, r.cross = function(s, a) {
              return s.x * a.y - s.y * a.x;
            }, r.cross3 = function(s, a, o) {
              return (a.x - s.x) * (o.y - s.y) - (a.y - s.y) * (o.x - s.x);
            }, r.add = function(s, a, o) {
              return o || (o = {}), o.x = s.x + a.x, o.y = s.y + a.y, o;
            }, r.sub = function(s, a, o) {
              return o || (o = {}), o.x = s.x - a.x, o.y = s.y - a.y, o;
            }, r.mult = function(s, a) {
              return { x: s.x * a, y: s.y * a };
            }, r.div = function(s, a) {
              return { x: s.x / a, y: s.y / a };
            }, r.perp = function(s, a) {
              return a = a === !0 ? -1 : 1, { x: a * -s.y, y: a * s.x };
            }, r.neg = function(s) {
              return { x: -s.x, y: -s.y };
            }, r.angle = function(s, a) {
              return Math.atan2(a.y - s.y, a.x - s.x);
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
          var s = {};
          e.exports = s;
          var a = r(2), o = r(0);
          (function() {
            s.create = function(l, c) {
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
            }, s.fromPath = function(l, c) {
              var h = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/ig, f = [];
              return l.replace(h, function(d, u, m) {
                f.push({ x: parseFloat(u), y: parseFloat(m) });
              }), s.create(f, c);
            }, s.centre = function(l) {
              for (var c = s.area(l, !0), h = { x: 0, y: 0 }, f, d, u, m = 0; m < l.length; m++)
                u = (m + 1) % l.length, f = a.cross(l[m], l[u]), d = a.mult(a.add(l[m], l[u]), f), h = a.add(h, d);
              return a.div(h, 6 * c);
            }, s.mean = function(l) {
              for (var c = { x: 0, y: 0 }, h = 0; h < l.length; h++)
                c.x += l[h].x, c.y += l[h].y;
              return a.div(c, l.length);
            }, s.area = function(l, c) {
              for (var h = 0, f = l.length - 1, d = 0; d < l.length; d++)
                h += (l[f].x - l[d].x) * (l[f].y + l[d].y), f = d;
              return c ? h / 2 : Math.abs(h) / 2;
            }, s.inertia = function(l, c) {
              for (var h = 0, f = 0, d = l, u, m, p = 0; p < d.length; p++)
                m = (p + 1) % d.length, u = Math.abs(a.cross(d[m], d[p])), h += u * (a.dot(d[m], d[m]) + a.dot(d[m], d[p]) + a.dot(d[p], d[p])), f += u;
              return c / 6 * (h / f);
            }, s.translate = function(l, c, h) {
              h = typeof h < "u" ? h : 1;
              var f = l.length, d = c.x * h, u = c.y * h, m;
              for (m = 0; m < f; m++)
                l[m].x += d, l[m].y += u;
              return l;
            }, s.rotate = function(l, c, h) {
              if (c !== 0) {
                var f = Math.cos(c), d = Math.sin(c), u = h.x, m = h.y, p = l.length, g, x, y, v;
                for (v = 0; v < p; v++)
                  g = l[v], x = g.x - u, y = g.y - m, g.x = u + (x * f - y * d), g.y = m + (x * d + y * f);
                return l;
              }
            }, s.contains = function(l, c) {
              for (var h = c.x, f = c.y, d = l.length, u = l[d - 1], m, p = 0; p < d; p++) {
                if (m = l[p], (h - u.x) * (m.y - u.y) + (f - u.y) * (u.x - m.x) > 0)
                  return !1;
                u = m;
              }
              return !0;
            }, s.scale = function(l, c, h, f) {
              if (c === 1 && h === 1)
                return l;
              f = f || s.centre(l);
              for (var d, u, m = 0; m < l.length; m++)
                d = l[m], u = a.sub(d, f), l[m].x = f.x + u.x * c, l[m].y = f.y + u.y * h;
              return l;
            }, s.chamfer = function(l, c, h, f, d) {
              typeof c == "number" ? c = [c] : c = c || [8], h = typeof h < "u" ? h : -1, f = f || 2, d = d || 14;
              for (var u = [], m = 0; m < l.length; m++) {
                var p = l[m - 1 >= 0 ? m - 1 : l.length - 1], g = l[m], x = l[(m + 1) % l.length], y = c[m < c.length ? m : c.length - 1];
                if (y === 0) {
                  u.push(g);
                  continue;
                }
                var v = a.normalise({
                  x: g.y - p.y,
                  y: p.x - g.x
                }), b = a.normalise({
                  x: x.y - g.y,
                  y: g.x - x.x
                }), _ = Math.sqrt(2 * Math.pow(y, 2)), S = a.mult(o.clone(v), y), C = a.normalise(a.mult(a.add(v, b), 0.5)), w = a.sub(g, a.mult(C, _)), A = h;
                h === -1 && (A = Math.pow(y, 0.32) * 1.75), A = o.clamp(A, f, d), A % 2 === 1 && (A += 1);
                for (var P = Math.acos(a.dot(v, b)), M = P / A, T = 0; T < A; T++)
                  u.push(a.add(a.rotate(S, M * T), w));
              }
              return u;
            }, s.clockwiseSort = function(l) {
              var c = s.mean(l);
              return l.sort(function(h, f) {
                return a.angle(c, h) - a.angle(c, f);
              }), l;
            }, s.isConvex = function(l) {
              var c = 0, h = l.length, f, d, u, m;
              if (h < 3)
                return null;
              for (f = 0; f < h; f++)
                if (d = (f + 1) % h, u = (f + 2) % h, m = (l[d].x - l[f].x) * (l[u].y - l[d].y), m -= (l[d].y - l[f].y) * (l[u].x - l[d].x), m < 0 ? c |= 1 : m > 0 && (c |= 2), c === 3)
                  return !1;
              return c !== 0 ? !0 : null;
            }, s.hull = function(l) {
              var c = [], h = [], f, d;
              for (l = l.slice(0), l.sort(function(u, m) {
                var p = u.x - m.x;
                return p !== 0 ? p : u.y - m.y;
              }), d = 0; d < l.length; d += 1) {
                for (f = l[d]; h.length >= 2 && a.cross3(h[h.length - 2], h[h.length - 1], f) <= 0; )
                  h.pop();
                h.push(f);
              }
              for (d = l.length - 1; d >= 0; d -= 1) {
                for (f = l[d]; c.length >= 2 && a.cross3(c[c.length - 2], c[c.length - 1], f) <= 0; )
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
          var s = {};
          e.exports = s;
          var a = r(3), o = r(2), l = r(7), c = r(0), h = r(1), f = r(11);
          (function() {
            s._timeCorrection = !0, s._inertiaScale = 4, s._nextCollidingGroupId = 1, s._nextNonCollidingGroupId = -1, s._nextCategory = 1, s._baseDelta = 1e3 / 60, s.create = function(u) {
              var m = {
                id: c.nextId(),
                type: "body",
                label: "Body",
                parts: [],
                plugin: {},
                angle: 0,
                vertices: a.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),
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
            }, s.nextGroup = function(u) {
              return u ? s._nextNonCollidingGroupId-- : s._nextCollidingGroupId++;
            }, s.nextCategory = function() {
              return s._nextCategory = s._nextCategory << 1, s._nextCategory;
            };
            var d = function(u, m) {
              m = m || {}, s.set(u, {
                bounds: u.bounds || h.create(u.vertices),
                positionPrev: u.positionPrev || o.clone(u.position),
                anglePrev: u.anglePrev || u.angle,
                vertices: u.vertices,
                parts: u.parts || [u],
                isStatic: u.isStatic,
                isSleeping: u.isSleeping,
                parent: u.parent || u
              }), a.rotate(u.vertices, u.angle, u.position), f.rotate(u.axes, u.angle), h.update(u.bounds, u.vertices, u.velocity), s.set(u, {
                axes: m.axes || u.axes,
                area: m.area || u.area,
                mass: m.mass || u.mass,
                inertia: m.inertia || u.inertia
              });
              var p = u.isStatic ? "#14151f" : c.choose(["#f19648", "#f5d259", "#f55a3c", "#063e7b", "#ececd1"]), g = u.isStatic ? "#555" : "#ccc", x = u.isStatic && u.render.fillStyle === null ? 1 : 0;
              u.render.fillStyle = u.render.fillStyle || p, u.render.strokeStyle = u.render.strokeStyle || g, u.render.lineWidth = u.render.lineWidth || x, u.render.sprite.xOffset += -(u.bounds.min.x - u.position.x) / (u.bounds.max.x - u.bounds.min.x), u.render.sprite.yOffset += -(u.bounds.min.y - u.position.y) / (u.bounds.max.y - u.bounds.min.y);
            };
            s.set = function(u, m, p) {
              var g;
              typeof m == "string" && (g = m, m = {}, m[g] = p);
              for (g in m)
                if (Object.prototype.hasOwnProperty.call(m, g))
                  switch (p = m[g], g) {
                    case "isStatic":
                      s.setStatic(u, p);
                      break;
                    case "isSleeping":
                      l.set(u, p);
                      break;
                    case "mass":
                      s.setMass(u, p);
                      break;
                    case "density":
                      s.setDensity(u, p);
                      break;
                    case "inertia":
                      s.setInertia(u, p);
                      break;
                    case "vertices":
                      s.setVertices(u, p);
                      break;
                    case "position":
                      s.setPosition(u, p);
                      break;
                    case "angle":
                      s.setAngle(u, p);
                      break;
                    case "velocity":
                      s.setVelocity(u, p);
                      break;
                    case "angularVelocity":
                      s.setAngularVelocity(u, p);
                      break;
                    case "speed":
                      s.setSpeed(u, p);
                      break;
                    case "angularSpeed":
                      s.setAngularSpeed(u, p);
                      break;
                    case "parts":
                      s.setParts(u, p);
                      break;
                    case "centre":
                      s.setCentre(u, p);
                      break;
                    default:
                      u[g] = p;
                  }
            }, s.setStatic = function(u, m) {
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
            }, s.setMass = function(u, m) {
              var p = u.inertia / (u.mass / 6);
              u.inertia = p * (m / 6), u.inverseInertia = 1 / u.inertia, u.mass = m, u.inverseMass = 1 / u.mass, u.density = u.mass / u.area;
            }, s.setDensity = function(u, m) {
              s.setMass(u, m * u.area), u.density = m;
            }, s.setInertia = function(u, m) {
              u.inertia = m, u.inverseInertia = 1 / u.inertia;
            }, s.setVertices = function(u, m) {
              m[0].body === u ? u.vertices = m : u.vertices = a.create(m, u), u.axes = f.fromVertices(u.vertices), u.area = a.area(u.vertices), s.setMass(u, u.density * u.area);
              var p = a.centre(u.vertices);
              a.translate(u.vertices, p, -1), s.setInertia(u, s._inertiaScale * a.inertia(u.vertices, u.mass)), a.translate(u.vertices, u.position), h.update(u.bounds, u.vertices, u.velocity);
            }, s.setParts = function(u, m, p) {
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
                  a.clockwiseSort(y);
                  var v = a.hull(y), b = a.centre(v);
                  s.setVertices(u, v), a.translate(u.vertices, b);
                }
                var _ = s._totalProperties(u);
                u.area = _.area, u.parent = u, u.position.x = _.centre.x, u.position.y = _.centre.y, u.positionPrev.x = _.centre.x, u.positionPrev.y = _.centre.y, s.setMass(u, _.mass), s.setInertia(u, _.inertia), s.setPosition(u, _.centre);
              }
            }, s.setCentre = function(u, m, p) {
              p ? (u.positionPrev.x += m.x, u.positionPrev.y += m.y, u.position.x += m.x, u.position.y += m.y) : (u.positionPrev.x = m.x - (u.position.x - u.positionPrev.x), u.positionPrev.y = m.y - (u.position.y - u.positionPrev.y), u.position.x = m.x, u.position.y = m.y);
            }, s.setPosition = function(u, m, p) {
              var g = o.sub(m, u.position);
              p ? (u.positionPrev.x = u.position.x, u.positionPrev.y = u.position.y, u.velocity.x = g.x, u.velocity.y = g.y, u.speed = o.magnitude(g)) : (u.positionPrev.x += g.x, u.positionPrev.y += g.y);
              for (var x = 0; x < u.parts.length; x++) {
                var y = u.parts[x];
                y.position.x += g.x, y.position.y += g.y, a.translate(y.vertices, g), h.update(y.bounds, y.vertices, u.velocity);
              }
            }, s.setAngle = function(u, m, p) {
              var g = m - u.angle;
              p ? (u.anglePrev = u.angle, u.angularVelocity = g, u.angularSpeed = Math.abs(g)) : u.anglePrev += g;
              for (var x = 0; x < u.parts.length; x++) {
                var y = u.parts[x];
                y.angle += g, a.rotate(y.vertices, g, u.position), f.rotate(y.axes, g), h.update(y.bounds, y.vertices, u.velocity), x > 0 && o.rotateAbout(y.position, g, u.position, y.position);
              }
            }, s.setVelocity = function(u, m) {
              var p = u.deltaTime / s._baseDelta;
              u.positionPrev.x = u.position.x - m.x * p, u.positionPrev.y = u.position.y - m.y * p, u.velocity.x = (u.position.x - u.positionPrev.x) / p, u.velocity.y = (u.position.y - u.positionPrev.y) / p, u.speed = o.magnitude(u.velocity);
            }, s.getVelocity = function(u) {
              var m = s._baseDelta / u.deltaTime;
              return {
                x: (u.position.x - u.positionPrev.x) * m,
                y: (u.position.y - u.positionPrev.y) * m
              };
            }, s.getSpeed = function(u) {
              return o.magnitude(s.getVelocity(u));
            }, s.setSpeed = function(u, m) {
              s.setVelocity(u, o.mult(o.normalise(s.getVelocity(u)), m));
            }, s.setAngularVelocity = function(u, m) {
              var p = u.deltaTime / s._baseDelta;
              u.anglePrev = u.angle - m * p, u.angularVelocity = (u.angle - u.anglePrev) / p, u.angularSpeed = Math.abs(u.angularVelocity);
            }, s.getAngularVelocity = function(u) {
              return (u.angle - u.anglePrev) * s._baseDelta / u.deltaTime;
            }, s.getAngularSpeed = function(u) {
              return Math.abs(s.getAngularVelocity(u));
            }, s.setAngularSpeed = function(u, m) {
              s.setAngularVelocity(u, c.sign(s.getAngularVelocity(u)) * m);
            }, s.translate = function(u, m, p) {
              s.setPosition(u, o.add(u.position, m), p);
            }, s.rotate = function(u, m, p, g) {
              if (!p)
                s.setAngle(u, u.angle + m, g);
              else {
                var x = Math.cos(m), y = Math.sin(m), v = u.position.x - p.x, b = u.position.y - p.y;
                s.setPosition(u, {
                  x: p.x + (v * x - b * y),
                  y: p.y + (v * y + b * x)
                }, g), s.setAngle(u, u.angle + m, g);
              }
            }, s.scale = function(u, m, p, g) {
              var x = 0, y = 0;
              g = g || u.position;
              for (var v = 0; v < u.parts.length; v++) {
                var b = u.parts[v];
                a.scale(b.vertices, m, p, g), b.axes = f.fromVertices(b.vertices), b.area = a.area(b.vertices), s.setMass(b, u.density * b.area), a.translate(b.vertices, { x: -b.position.x, y: -b.position.y }), s.setInertia(b, s._inertiaScale * a.inertia(b.vertices, b.mass)), a.translate(b.vertices, { x: b.position.x, y: b.position.y }), v > 0 && (x += b.area, y += b.inertia), b.position.x = g.x + (b.position.x - g.x) * m, b.position.y = g.y + (b.position.y - g.y) * p, h.update(b.bounds, b.vertices, u.velocity);
              }
              u.parts.length > 1 && (u.area = x, u.isStatic || (s.setMass(u, u.density * x), s.setInertia(u, y))), u.circleRadius && (m === p ? u.circleRadius *= m : u.circleRadius = null);
            }, s.update = function(u, m) {
              m = (typeof m < "u" ? m : 1e3 / 60) * u.timeScale;
              var p = m * m, g = s._timeCorrection ? m / (u.deltaTime || m) : 1, x = 1 - u.frictionAir * (m / c._baseDelta), y = (u.position.x - u.positionPrev.x) * g, v = (u.position.y - u.positionPrev.y) * g;
              u.velocity.x = y * x + u.force.x / u.mass * p, u.velocity.y = v * x + u.force.y / u.mass * p, u.positionPrev.x = u.position.x, u.positionPrev.y = u.position.y, u.position.x += u.velocity.x, u.position.y += u.velocity.y, u.deltaTime = m, u.angularVelocity = (u.angle - u.anglePrev) * x * g + u.torque / u.inertia * p, u.anglePrev = u.angle, u.angle += u.angularVelocity;
              for (var b = 0; b < u.parts.length; b++) {
                var _ = u.parts[b];
                a.translate(_.vertices, u.velocity), b > 0 && (_.position.x += u.velocity.x, _.position.y += u.velocity.y), u.angularVelocity !== 0 && (a.rotate(_.vertices, u.angularVelocity, u.position), f.rotate(_.axes, u.angularVelocity), b > 0 && o.rotateAbout(_.position, u.angularVelocity, u.position, _.position)), h.update(_.bounds, _.vertices, u.velocity);
              }
            }, s.updateVelocities = function(u) {
              var m = s._baseDelta / u.deltaTime, p = u.velocity;
              p.x = (u.position.x - u.positionPrev.x) * m, p.y = (u.position.y - u.positionPrev.y) * m, u.speed = Math.sqrt(p.x * p.x + p.y * p.y), u.angularVelocity = (u.angle - u.anglePrev) * m, u.angularSpeed = Math.abs(u.angularVelocity);
            }, s.applyForce = function(u, m, p) {
              var g = { x: m.x - u.position.x, y: m.y - u.position.y };
              u.force.x += p.x, u.force.y += p.y, u.torque += g.x * p.y - g.y * p.x;
            }, s._totalProperties = function(u) {
              for (var m = {
                mass: 0,
                area: 0,
                inertia: 0,
                centre: { x: 0, y: 0 }
              }, p = u.parts.length === 1 ? 0 : 1; p < u.parts.length; p++) {
                var g = u.parts[p], x = g.mass !== 1 / 0 ? g.mass : 1;
                m.mass += x, m.area += g.area, m.inertia += g.inertia, m.centre = o.add(m.centre, o.mult(g.position, x));
              }
              return m.centre = o.div(m.centre, m.mass), m;
            };
          })();
        },
        /* 5 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(0);
          (function() {
            s.on = function(o, l, c) {
              for (var h = l.split(" "), f, d = 0; d < h.length; d++)
                f = h[d], o.events = o.events || {}, o.events[f] = o.events[f] || [], o.events[f].push(c);
              return c;
            }, s.off = function(o, l, c) {
              if (!l) {
                o.events = {};
                return;
              }
              typeof l == "function" && (c = l, l = a.keys(o.events).join(" "));
              for (var h = l.split(" "), f = 0; f < h.length; f++) {
                var d = o.events[h[f]], u = [];
                if (c && d)
                  for (var m = 0; m < d.length; m++)
                    d[m] !== c && u.push(d[m]);
                o.events[h[f]] = u;
              }
            }, s.trigger = function(o, l, c) {
              var h, f, d, u, m = o.events;
              if (m && a.keys(m).length > 0) {
                c || (c = {}), h = l.split(" ");
                for (var p = 0; p < h.length; p++)
                  if (f = h[p], d = m[f], d) {
                    u = a.clone(c, !1), u.name = f, u.source = o;
                    for (var g = 0; g < d.length; g++)
                      d[g].apply(o, [u]);
                  }
              }
            };
          })();
        },
        /* 6 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(5), o = r(0), l = r(1), c = r(4);
          (function() {
            s.create = function(h) {
              return o.extend({
                id: o.nextId(),
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
            }, s.setModified = function(h, f, d, u) {
              if (h.isModified = f, f && h.cache && (h.cache.allBodies = null, h.cache.allConstraints = null, h.cache.allComposites = null), d && h.parent && s.setModified(h.parent, f, d, u), u)
                for (var m = 0; m < h.composites.length; m++) {
                  var p = h.composites[m];
                  s.setModified(p, f, d, u);
                }
            }, s.add = function(h, f) {
              var d = [].concat(f);
              a.trigger(h, "beforeAdd", { object: f });
              for (var u = 0; u < d.length; u++) {
                var m = d[u];
                switch (m.type) {
                  case "body":
                    if (m.parent !== m) {
                      o.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");
                      break;
                    }
                    s.addBody(h, m);
                    break;
                  case "constraint":
                    s.addConstraint(h, m);
                    break;
                  case "composite":
                    s.addComposite(h, m);
                    break;
                  case "mouseConstraint":
                    s.addConstraint(h, m.constraint);
                    break;
                }
              }
              return a.trigger(h, "afterAdd", { object: f }), h;
            }, s.remove = function(h, f, d) {
              var u = [].concat(f);
              a.trigger(h, "beforeRemove", { object: f });
              for (var m = 0; m < u.length; m++) {
                var p = u[m];
                switch (p.type) {
                  case "body":
                    s.removeBody(h, p, d);
                    break;
                  case "constraint":
                    s.removeConstraint(h, p, d);
                    break;
                  case "composite":
                    s.removeComposite(h, p, d);
                    break;
                  case "mouseConstraint":
                    s.removeConstraint(h, p.constraint);
                    break;
                }
              }
              return a.trigger(h, "afterRemove", { object: f }), h;
            }, s.addComposite = function(h, f) {
              return h.composites.push(f), f.parent = h, s.setModified(h, !0, !0, !1), h;
            }, s.removeComposite = function(h, f, d) {
              var u = o.indexOf(h.composites, f);
              if (u !== -1) {
                var m = s.allBodies(f);
                s.removeCompositeAt(h, u);
                for (var p = 0; p < m.length; p++)
                  m[p].sleepCounter = 0;
              }
              if (d)
                for (var p = 0; p < h.composites.length; p++)
                  s.removeComposite(h.composites[p], f, !0);
              return h;
            }, s.removeCompositeAt = function(h, f) {
              return h.composites.splice(f, 1), s.setModified(h, !0, !0, !1), h;
            }, s.addBody = function(h, f) {
              return h.bodies.push(f), s.setModified(h, !0, !0, !1), h;
            }, s.removeBody = function(h, f, d) {
              var u = o.indexOf(h.bodies, f);
              if (u !== -1 && (s.removeBodyAt(h, u), f.sleepCounter = 0), d)
                for (var m = 0; m < h.composites.length; m++)
                  s.removeBody(h.composites[m], f, !0);
              return h;
            }, s.removeBodyAt = function(h, f) {
              return h.bodies.splice(f, 1), s.setModified(h, !0, !0, !1), h;
            }, s.addConstraint = function(h, f) {
              return h.constraints.push(f), s.setModified(h, !0, !0, !1), h;
            }, s.removeConstraint = function(h, f, d) {
              var u = o.indexOf(h.constraints, f);
              if (u !== -1 && s.removeConstraintAt(h, u), d)
                for (var m = 0; m < h.composites.length; m++)
                  s.removeConstraint(h.composites[m], f, !0);
              return h;
            }, s.removeConstraintAt = function(h, f) {
              return h.constraints.splice(f, 1), s.setModified(h, !0, !0, !1), h;
            }, s.clear = function(h, f, d) {
              if (d)
                for (var u = 0; u < h.composites.length; u++)
                  s.clear(h.composites[u], f, !0);
              return f ? h.bodies = h.bodies.filter(function(m) {
                return m.isStatic;
              }) : h.bodies.length = 0, h.constraints.length = 0, h.composites.length = 0, s.setModified(h, !0, !0, !1), h;
            }, s.allBodies = function(h) {
              if (h.cache && h.cache.allBodies)
                return h.cache.allBodies;
              for (var f = [].concat(h.bodies), d = 0; d < h.composites.length; d++)
                f = f.concat(s.allBodies(h.composites[d]));
              return h.cache && (h.cache.allBodies = f), f;
            }, s.allConstraints = function(h) {
              if (h.cache && h.cache.allConstraints)
                return h.cache.allConstraints;
              for (var f = [].concat(h.constraints), d = 0; d < h.composites.length; d++)
                f = f.concat(s.allConstraints(h.composites[d]));
              return h.cache && (h.cache.allConstraints = f), f;
            }, s.allComposites = function(h) {
              if (h.cache && h.cache.allComposites)
                return h.cache.allComposites;
              for (var f = [].concat(h.composites), d = 0; d < h.composites.length; d++)
                f = f.concat(s.allComposites(h.composites[d]));
              return h.cache && (h.cache.allComposites = f), f;
            }, s.get = function(h, f, d) {
              var u, m;
              switch (d) {
                case "body":
                  u = s.allBodies(h);
                  break;
                case "constraint":
                  u = s.allConstraints(h);
                  break;
                case "composite":
                  u = s.allComposites(h).concat(h);
                  break;
              }
              return u ? (m = u.filter(function(p) {
                return p.id.toString() === f.toString();
              }), m.length === 0 ? null : m[0]) : null;
            }, s.move = function(h, f, d) {
              return s.remove(h, f), s.add(d, f), h;
            }, s.rebase = function(h) {
              for (var f = s.allBodies(h).concat(s.allConstraints(h)).concat(s.allComposites(h)), d = 0; d < f.length; d++)
                f[d].id = o.nextId();
              return h;
            }, s.translate = function(h, f, d) {
              for (var u = d ? s.allBodies(h) : h.bodies, m = 0; m < u.length; m++)
                c.translate(u[m], f);
              return h;
            }, s.rotate = function(h, f, d, u) {
              for (var m = Math.cos(f), p = Math.sin(f), g = u ? s.allBodies(h) : h.bodies, x = 0; x < g.length; x++) {
                var y = g[x], v = y.position.x - d.x, b = y.position.y - d.y;
                c.setPosition(y, {
                  x: d.x + (v * m - b * p),
                  y: d.y + (v * p + b * m)
                }), c.rotate(y, f);
              }
              return h;
            }, s.scale = function(h, f, d, u, m) {
              for (var p = m ? s.allBodies(h) : h.bodies, g = 0; g < p.length; g++) {
                var x = p[g], y = x.position.x - u.x, v = x.position.y - u.y;
                c.setPosition(x, {
                  x: u.x + y * f,
                  y: u.y + v * d
                }), c.scale(x, f, d);
              }
              return h;
            }, s.bounds = function(h) {
              for (var f = s.allBodies(h), d = [], u = 0; u < f.length; u += 1) {
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
          var s = {};
          e.exports = s;
          var a = r(4), o = r(5), l = r(0);
          (function() {
            s._motionWakeThreshold = 0.18, s._motionSleepThreshold = 0.08, s._minBias = 0.9, s.update = function(c, h) {
              for (var f = h / l._baseDelta, d = s._motionSleepThreshold, u = 0; u < c.length; u++) {
                var m = c[u], p = a.getSpeed(m), g = a.getAngularSpeed(m), x = p * p + g * g;
                if (m.force.x !== 0 || m.force.y !== 0) {
                  s.set(m, !1);
                  continue;
                }
                var y = Math.min(m.motion, x), v = Math.max(m.motion, x);
                m.motion = s._minBias * y + (1 - s._minBias) * v, m.sleepThreshold > 0 && m.motion < d ? (m.sleepCounter += 1, m.sleepCounter >= m.sleepThreshold / f && s.set(m, !0)) : m.sleepCounter > 0 && (m.sleepCounter -= 1);
              }
            }, s.afterCollisions = function(c) {
              for (var h = s._motionSleepThreshold, f = 0; f < c.length; f++) {
                var d = c[f];
                if (d.isActive) {
                  var u = d.collision, m = u.bodyA.parent, p = u.bodyB.parent;
                  if (!(m.isSleeping && p.isSleeping || m.isStatic || p.isStatic) && (m.isSleeping || p.isSleeping)) {
                    var g = m.isSleeping && !m.isStatic ? m : p, x = g === m ? p : m;
                    !g.isStatic && x.motion > h && s.set(g, !1);
                  }
                }
              }
            }, s.set = function(c, h) {
              var f = c.isSleeping;
              h ? (c.isSleeping = !0, c.sleepCounter = c.sleepThreshold, c.positionImpulse.x = 0, c.positionImpulse.y = 0, c.positionPrev.x = c.position.x, c.positionPrev.y = c.position.y, c.anglePrev = c.angle, c.speed = 0, c.angularSpeed = 0, c.motion = 0, f || o.trigger(c, "sleepStart")) : (c.isSleeping = !1, c.sleepCounter = 0, f && o.trigger(c, "sleepEnd"));
            };
          })();
        },
        /* 8 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(3), o = r(9);
          (function() {
            var l = [], c = {
              overlap: 0,
              axis: null
            }, h = {
              overlap: 0,
              axis: null
            };
            s.create = function(f, d) {
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
            }, s.collides = function(f, d, u) {
              if (s._overlapAxes(c, f.vertices, d.vertices, f.axes), c.overlap <= 0 || (s._overlapAxes(h, d.vertices, f.vertices, d.axes), h.overlap <= 0))
                return null;
              var m = u && u.table[o.id(f, d)], p;
              m ? p = m.collision : (p = s.create(f, d), p.collided = !0, p.bodyA = f.id < d.id ? f : d, p.bodyB = f.id < d.id ? d : f, p.parentA = p.bodyA.parent, p.parentB = p.bodyB.parent), f = p.bodyA, d = p.bodyB;
              var g;
              c.overlap < h.overlap ? g = c : g = h;
              var x = p.normal, y = p.tangent, v = p.penetration, b = p.supports, _ = g.overlap, S = g.axis, C = S.x, w = S.y, A = d.position.x - f.position.x, P = d.position.y - f.position.y;
              C * A + w * P >= 0 && (C = -C, w = -w), x.x = C, x.y = w, y.x = -w, y.y = C, v.x = C * _, v.y = w * _, p.depth = _;
              var M = s._findSupports(f, d, x, 1), T = 0;
              if (a.contains(f.vertices, M[0]) && (b[T++] = M[0]), a.contains(f.vertices, M[1]) && (b[T++] = M[1]), T < 2) {
                var k = s._findSupports(d, f, x, -1);
                a.contains(d.vertices, k[0]) && (b[T++] = k[0]), T < 2 && a.contains(d.vertices, k[1]) && (b[T++] = k[1]);
              }
              return T === 0 && (b[T++] = M[0]), p.supportCount = T, p;
            }, s._overlapAxes = function(f, d, u, m) {
              var p = d.length, g = u.length, x = d[0].x, y = d[0].y, v = u[0].x, b = u[0].y, _ = m.length, S = Number.MAX_VALUE, C = 0, w, A, P, M, T, k;
              for (T = 0; T < _; T++) {
                var E = m[T], I = E.x, B = E.y, R = x * I + y * B, z = v * I + b * B, F = R, L = z;
                for (k = 1; k < p; k += 1)
                  M = d[k].x * I + d[k].y * B, M > F ? F = M : M < R && (R = M);
                for (k = 1; k < g; k += 1)
                  M = u[k].x * I + u[k].y * B, M > L ? L = M : M < z && (z = M);
                if (A = F - z, P = L - R, w = A < P ? A : P, w < S && (S = w, C = T, w <= 0))
                  break;
              }
              f.axis = m[C], f.overlap = S;
            }, s._findSupports = function(f, d, u, m) {
              var p = d.vertices, g = p.length, x = f.position.x, y = f.position.y, v = u.x * m, b = u.y * m, _ = p[0], S = _, C = v * (x - S.x) + b * (y - S.y), w, A, P;
              for (P = 1; P < g; P += 1)
                S = p[P], A = v * (x - S.x) + b * (y - S.y), A < C && (C = A, _ = S);
              return w = p[(g + _.index - 1) % g], C = v * (x - w.x) + b * (y - w.y), S = p[(_.index + 1) % g], v * (x - S.x) + b * (y - S.y) < C ? (l[0] = _, l[1] = S, l) : (l[0] = _, l[1] = w, l);
            };
          })();
        },
        /* 9 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(16);
          (function() {
            s.create = function(o, l) {
              var c = o.bodyA, h = o.bodyB, f = {
                id: s.id(c, h),
                bodyA: c,
                bodyB: h,
                collision: o,
                contacts: [a.create(), a.create()],
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
              return s.update(f, o, l), f;
            }, s.update = function(o, l, c) {
              var h = l.supports, f = l.supportCount, d = o.contacts, u = l.parentA, m = l.parentB;
              o.isActive = !0, o.timeUpdated = c, o.collision = l, o.separation = l.depth, o.inverseMass = u.inverseMass + m.inverseMass, o.friction = u.friction < m.friction ? u.friction : m.friction, o.frictionStatic = u.frictionStatic > m.frictionStatic ? u.frictionStatic : m.frictionStatic, o.restitution = u.restitution > m.restitution ? u.restitution : m.restitution, o.slop = u.slop > m.slop ? u.slop : m.slop, o.contactCount = f, l.pair = o;
              var p = h[0], g = d[0], x = h[1], y = d[1];
              (y.vertex === p || g.vertex === x) && (d[1] = g, d[0] = g = y, y = d[1]), g.vertex = p, y.vertex = x;
            }, s.setActive = function(o, l, c) {
              l ? (o.isActive = !0, o.timeUpdated = c) : (o.isActive = !1, o.contactCount = 0);
            }, s.id = function(o, l) {
              return o.id < l.id ? o.id.toString(36) + ":" + l.id.toString(36) : l.id.toString(36) + ":" + o.id.toString(36);
            };
          })();
        },
        /* 10 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(3), o = r(2), l = r(7), c = r(1), h = r(11), f = r(0);
          (function() {
            s._warming = 0.4, s._torqueDampen = 1, s._minLength = 1e-6, s.create = function(d) {
              var u = d;
              u.bodyA && !u.pointA && (u.pointA = { x: 0, y: 0 }), u.bodyB && !u.pointB && (u.pointB = { x: 0, y: 0 });
              var m = u.bodyA ? o.add(u.bodyA.position, u.pointA) : u.pointA, p = u.bodyB ? o.add(u.bodyB.position, u.pointB) : u.pointB, g = o.magnitude(o.sub(m, p));
              u.length = typeof u.length < "u" ? u.length : g, u.id = u.id || f.nextId(), u.label = u.label || "Constraint", u.type = "constraint", u.stiffness = u.stiffness || (u.length > 0 ? 1 : 0.7), u.damping = u.damping || 0, u.angularStiffness = u.angularStiffness || 0, u.angleA = u.bodyA ? u.bodyA.angle : u.angleA, u.angleB = u.bodyB ? u.bodyB.angle : u.angleB, u.plugin = {};
              var x = {
                visible: !0,
                lineWidth: 2,
                strokeStyle: "#ffffff",
                type: "line",
                anchors: !0
              };
              return u.length === 0 && u.stiffness > 0.1 ? (x.type = "pin", x.anchors = !1) : u.stiffness < 0.9 && (x.type = "spring"), u.render = f.extend(x, u.render), u;
            }, s.preSolveAll = function(d) {
              for (var u = 0; u < d.length; u += 1) {
                var m = d[u], p = m.constraintImpulse;
                m.isStatic || p.x === 0 && p.y === 0 && p.angle === 0 || (m.position.x += p.x, m.position.y += p.y, m.angle += p.angle);
              }
            }, s.solveAll = function(d, u) {
              for (var m = f.clamp(u / f._baseDelta, 0, 1), p = 0; p < d.length; p += 1) {
                var g = d[p], x = !g.bodyA || g.bodyA && g.bodyA.isStatic, y = !g.bodyB || g.bodyB && g.bodyB.isStatic;
                (x || y) && s.solve(d[p], m);
              }
              for (p = 0; p < d.length; p += 1)
                g = d[p], x = !g.bodyA || g.bodyA && g.bodyA.isStatic, y = !g.bodyB || g.bodyB && g.bodyB.isStatic, !x && !y && s.solve(d[p], m);
            }, s.solve = function(d, u) {
              var m = d.bodyA, p = d.bodyB, g = d.pointA, x = d.pointB;
              if (!(!m && !p)) {
                m && !m.isStatic && (o.rotate(g, m.angle - d.angleA, g), d.angleA = m.angle), p && !p.isStatic && (o.rotate(x, p.angle - d.angleB, x), d.angleB = p.angle);
                var y = g, v = x;
                if (m && (y = o.add(m.position, g)), p && (v = o.add(p.position, x)), !(!y || !v)) {
                  var b = o.sub(y, v), _ = o.magnitude(b);
                  _ < s._minLength && (_ = s._minLength);
                  var S = (_ - d.length) / _, C = d.stiffness >= 1 || d.length === 0, w = C ? d.stiffness * u : d.stiffness * u * u, A = d.damping * u, P = o.mult(b, S * w), M = (m ? m.inverseMass : 0) + (p ? p.inverseMass : 0), T = (m ? m.inverseInertia : 0) + (p ? p.inverseInertia : 0), k = M + T, E, I, B, R, z;
                  if (A > 0) {
                    var F = o.create();
                    B = o.div(b, _), z = o.sub(
                      p && o.sub(p.position, p.positionPrev) || F,
                      m && o.sub(m.position, m.positionPrev) || F
                    ), R = o.dot(B, z);
                  }
                  m && !m.isStatic && (I = m.inverseMass / M, m.constraintImpulse.x -= P.x * I, m.constraintImpulse.y -= P.y * I, m.position.x -= P.x * I, m.position.y -= P.y * I, A > 0 && (m.positionPrev.x -= A * B.x * R * I, m.positionPrev.y -= A * B.y * R * I), E = o.cross(g, P) / k * s._torqueDampen * m.inverseInertia * (1 - d.angularStiffness), m.constraintImpulse.angle -= E, m.angle -= E), p && !p.isStatic && (I = p.inverseMass / M, p.constraintImpulse.x += P.x * I, p.constraintImpulse.y += P.y * I, p.position.x += P.x * I, p.position.y += P.y * I, A > 0 && (p.positionPrev.x += A * B.x * R * I, p.positionPrev.y += A * B.y * R * I), E = o.cross(x, P) / k * s._torqueDampen * p.inverseInertia * (1 - d.angularStiffness), p.constraintImpulse.angle += E, p.angle += E);
                }
              }
            }, s.postSolveAll = function(d) {
              for (var u = 0; u < d.length; u++) {
                var m = d[u], p = m.constraintImpulse;
                if (!(m.isStatic || p.x === 0 && p.y === 0 && p.angle === 0)) {
                  l.set(m, !1);
                  for (var g = 0; g < m.parts.length; g++) {
                    var x = m.parts[g];
                    a.translate(x.vertices, p), g > 0 && (x.position.x += p.x, x.position.y += p.y), p.angle !== 0 && (a.rotate(x.vertices, p.angle, m.position), h.rotate(x.axes, p.angle), g > 0 && o.rotateAbout(x.position, p.angle, m.position, x.position)), c.update(x.bounds, x.vertices, m.velocity);
                  }
                  p.angle *= s._warming, p.x *= s._warming, p.y *= s._warming;
                }
              }
            }, s.pointAWorld = function(d) {
              return {
                x: (d.bodyA ? d.bodyA.position.x : 0) + (d.pointA ? d.pointA.x : 0),
                y: (d.bodyA ? d.bodyA.position.y : 0) + (d.pointA ? d.pointA.y : 0)
              };
            }, s.pointBWorld = function(d) {
              return {
                x: (d.bodyB ? d.bodyB.position.x : 0) + (d.pointB ? d.pointB.x : 0),
                y: (d.bodyB ? d.bodyB.position.y : 0) + (d.pointB ? d.pointB.y : 0)
              };
            }, s.currentLength = function(d) {
              var u = (d.bodyA ? d.bodyA.position.x : 0) + (d.pointA ? d.pointA.x : 0), m = (d.bodyA ? d.bodyA.position.y : 0) + (d.pointA ? d.pointA.y : 0), p = (d.bodyB ? d.bodyB.position.x : 0) + (d.pointB ? d.pointB.x : 0), g = (d.bodyB ? d.bodyB.position.y : 0) + (d.pointB ? d.pointB.y : 0), x = u - p, y = m - g;
              return Math.sqrt(x * x + y * y);
            };
          })();
        },
        /* 11 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(2), o = r(0);
          (function() {
            s.fromVertices = function(l) {
              for (var c = {}, h = 0; h < l.length; h++) {
                var f = (h + 1) % l.length, d = a.normalise({
                  x: l[f].y - l[h].y,
                  y: l[h].x - l[f].x
                }), u = d.y === 0 ? 1 / 0 : d.x / d.y;
                u = u.toFixed(3).toString(), c[u] = d;
              }
              return o.values(c);
            }, s.rotate = function(l, c) {
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
          var s = {};
          e.exports = s;
          var a = r(3), o = r(0), l = r(4), c = r(1), h = r(2);
          (function() {
            s.rectangle = function(f, d, u, m, p) {
              p = p || {};
              var g = {
                label: "Rectangle Body",
                position: { x: f, y: d },
                vertices: a.fromPath("L 0 0 L " + u + " 0 L " + u + " " + m + " L 0 " + m)
              };
              if (p.chamfer) {
                var x = p.chamfer;
                g.vertices = a.chamfer(
                  g.vertices,
                  x.radius,
                  x.quality,
                  x.qualityMin,
                  x.qualityMax
                ), delete p.chamfer;
              }
              return l.create(o.extend({}, g, p));
            }, s.trapezoid = function(f, d, u, m, p, g) {
              g = g || {}, p >= 1 && o.warn("Bodies.trapezoid: slope parameter must be < 1."), p *= 0.5;
              var x = (1 - p * 2) * u, y = u * p, v = y + x, b = v + y, _;
              p < 0.5 ? _ = "L 0 0 L " + y + " " + -m + " L " + v + " " + -m + " L " + b + " 0" : _ = "L 0 0 L " + v + " " + -m + " L " + b + " 0";
              var S = {
                label: "Trapezoid Body",
                position: { x: f, y: d },
                vertices: a.fromPath(_)
              };
              if (g.chamfer) {
                var C = g.chamfer;
                S.vertices = a.chamfer(
                  S.vertices,
                  C.radius,
                  C.quality,
                  C.qualityMin,
                  C.qualityMax
                ), delete g.chamfer;
              }
              return l.create(o.extend({}, S, g));
            }, s.circle = function(f, d, u, m, p) {
              m = m || {};
              var g = {
                label: "Circle Body",
                circleRadius: u
              };
              p = p || 25;
              var x = Math.ceil(Math.max(10, Math.min(p, u)));
              return x % 2 === 1 && (x += 1), s.polygon(f, d, x, u, o.extend({}, g, m));
            }, s.polygon = function(f, d, u, m, p) {
              if (p = p || {}, u < 3)
                return s.circle(f, d, m, p);
              for (var g = 2 * Math.PI / u, x = "", y = g * 0.5, v = 0; v < u; v += 1) {
                var b = y + v * g, _ = Math.cos(b) * m, S = Math.sin(b) * m;
                x += "L " + _.toFixed(3) + " " + S.toFixed(3) + " ";
              }
              var C = {
                label: "Polygon Body",
                position: { x: f, y: d },
                vertices: a.fromPath(x)
              };
              if (p.chamfer) {
                var w = p.chamfer;
                C.vertices = a.chamfer(
                  C.vertices,
                  w.radius,
                  w.quality,
                  w.qualityMin,
                  w.qualityMax
                ), delete p.chamfer;
              }
              return l.create(o.extend({}, C, p));
            }, s.fromVertices = function(f, d, u, m, p, g, x, y) {
              var v = o.getDecomp(), b, _, S, C, w, A, P, M, T, k, E;
              for (b = !!(v && v.quickDecomp), m = m || {}, S = [], p = typeof p < "u" ? p : !1, g = typeof g < "u" ? g : 0.01, x = typeof x < "u" ? x : 10, y = typeof y < "u" ? y : 0.01, o.isArray(u[0]) || (u = [u]), k = 0; k < u.length; k += 1)
                if (A = u[k], C = a.isConvex(A), w = !C, w && !b && o.warnOnce(
                  "Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."
                ), C || !b)
                  C ? A = a.clockwiseSort(A) : A = a.hull(A), S.push({
                    position: { x: f, y: d },
                    vertices: A
                  });
                else {
                  var I = A.map(function(G) {
                    return [G.x, G.y];
                  });
                  v.makeCCW(I), g !== !1 && v.removeCollinearPoints(I, g), y !== !1 && v.removeDuplicatePoints && v.removeDuplicatePoints(I, y);
                  var B = v.quickDecomp(I);
                  for (P = 0; P < B.length; P++) {
                    var R = B[P], z = R.map(function(G) {
                      return {
                        x: G[0],
                        y: G[1]
                      };
                    });
                    x > 0 && a.area(z) < x || S.push({
                      position: a.centre(z),
                      vertices: z
                    });
                  }
                }
              for (P = 0; P < S.length; P++)
                S[P] = l.create(o.extend(S[P], m));
              if (p) {
                var F = 5;
                for (P = 0; P < S.length; P++) {
                  var L = S[P];
                  for (M = P + 1; M < S.length; M++) {
                    var Z = S[M];
                    if (c.overlaps(L.bounds, Z.bounds)) {
                      var U = L.vertices, j = Z.vertices;
                      for (T = 0; T < L.vertices.length; T++)
                        for (E = 0; E < Z.vertices.length; E++) {
                          var J = h.magnitudeSquared(h.sub(U[(T + 1) % U.length], j[E])), Q = h.magnitudeSquared(h.sub(U[T], j[(E + 1) % j.length]));
                          J < F && Q < F && (U[T].isInternal = !0, j[E].isInternal = !0);
                        }
                    }
                  }
                }
              }
              return S.length > 1 ? (_ = l.create(o.extend({ parts: S.slice(0) }, m)), l.setPosition(_, { x: f, y: d }), _) : S[0];
            };
          })();
        },
        /* 13 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(0), o = r(8);
          (function() {
            s.create = function(l) {
              var c = {
                bodies: [],
                collisions: [],
                pairs: null
              };
              return a.extend(c, l);
            }, s.setBodies = function(l, c) {
              l.bodies = c.slice(0);
            }, s.clear = function(l) {
              l.bodies = [], l.collisions = [];
            }, s.collisions = function(l) {
              var c = l.pairs, h = l.bodies, f = h.length, d = s.canCollide, u = o.collides, m = l.collisions, p = 0, g, x;
              for (h.sort(s._compareBoundsX), g = 0; g < f; g++) {
                var y = h[g], v = y.bounds, b = y.bounds.max.x, _ = y.bounds.max.y, S = y.bounds.min.y, C = y.isStatic || y.isSleeping, w = y.parts.length, A = w === 1;
                for (x = g + 1; x < f; x++) {
                  var P = h[x], M = P.bounds;
                  if (M.min.x > b)
                    break;
                  if (!(_ < M.min.y || S > M.max.y) && !(C && (P.isStatic || P.isSleeping)) && d(y.collisionFilter, P.collisionFilter)) {
                    var T = P.parts.length;
                    if (A && T === 1) {
                      var k = u(y, P, c);
                      k && (m[p++] = k);
                    } else
                      for (var E = w > 1 ? 1 : 0, I = T > 1 ? 1 : 0, B = E; B < w; B++)
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
            }, s.canCollide = function(l, c) {
              return l.group === c.group && l.group !== 0 ? l.group > 0 : (l.mask & c.category) !== 0 && (c.mask & l.category) !== 0;
            }, s._compareBoundsX = function(l, c) {
              return l.bounds.min.x - c.bounds.min.x;
            };
          })();
        },
        /* 14 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(0);
          (function() {
            s.create = function(o) {
              var l = {};
              return o || a.log("Mouse.create: element was undefined, defaulting to document.body", "warn"), l.element = o || document.body, l.absolute = { x: 0, y: 0 }, l.position = { x: 0, y: 0 }, l.mousedownPosition = { x: 0, y: 0 }, l.mouseupPosition = { x: 0, y: 0 }, l.offset = { x: 0, y: 0 }, l.scale = { x: 1, y: 1 }, l.wheelDelta = 0, l.button = -1, l.pixelRatio = parseInt(l.element.getAttribute("data-pixel-ratio"), 10) || 1, l.sourceEvents = {
                mousemove: null,
                mousedown: null,
                mouseup: null,
                mousewheel: null
              }, l.mousemove = function(c) {
                var h = s._getRelativeMousePosition(c, l.element, l.pixelRatio), f = c.changedTouches;
                f && (l.button = 0, c.preventDefault()), l.absolute.x = h.x, l.absolute.y = h.y, l.position.x = l.absolute.x * l.scale.x + l.offset.x, l.position.y = l.absolute.y * l.scale.y + l.offset.y, l.sourceEvents.mousemove = c;
              }, l.mousedown = function(c) {
                var h = s._getRelativeMousePosition(c, l.element, l.pixelRatio), f = c.changedTouches;
                f ? (l.button = 0, c.preventDefault()) : l.button = c.button, l.absolute.x = h.x, l.absolute.y = h.y, l.position.x = l.absolute.x * l.scale.x + l.offset.x, l.position.y = l.absolute.y * l.scale.y + l.offset.y, l.mousedownPosition.x = l.position.x, l.mousedownPosition.y = l.position.y, l.sourceEvents.mousedown = c;
              }, l.mouseup = function(c) {
                var h = s._getRelativeMousePosition(c, l.element, l.pixelRatio), f = c.changedTouches;
                f && c.preventDefault(), l.button = -1, l.absolute.x = h.x, l.absolute.y = h.y, l.position.x = l.absolute.x * l.scale.x + l.offset.x, l.position.y = l.absolute.y * l.scale.y + l.offset.y, l.mouseupPosition.x = l.position.x, l.mouseupPosition.y = l.position.y, l.sourceEvents.mouseup = c;
              }, l.mousewheel = function(c) {
                l.wheelDelta = Math.max(-1, Math.min(1, c.wheelDelta || -c.detail)), c.preventDefault(), l.sourceEvents.mousewheel = c;
              }, s.setElement(l, l.element), l;
            }, s.setElement = function(o, l) {
              o.element = l, l.addEventListener("mousemove", o.mousemove, { passive: !0 }), l.addEventListener("mousedown", o.mousedown, { passive: !0 }), l.addEventListener("mouseup", o.mouseup, { passive: !0 }), l.addEventListener("wheel", o.mousewheel, { passive: !1 }), l.addEventListener("touchmove", o.mousemove, { passive: !1 }), l.addEventListener("touchstart", o.mousedown, { passive: !1 }), l.addEventListener("touchend", o.mouseup, { passive: !1 });
            }, s.clearSourceEvents = function(o) {
              o.sourceEvents.mousemove = null, o.sourceEvents.mousedown = null, o.sourceEvents.mouseup = null, o.sourceEvents.mousewheel = null, o.wheelDelta = 0;
            }, s.setOffset = function(o, l) {
              o.offset.x = l.x, o.offset.y = l.y, o.position.x = o.absolute.x * o.scale.x + o.offset.x, o.position.y = o.absolute.y * o.scale.y + o.offset.y;
            }, s.setScale = function(o, l) {
              o.scale.x = l.x, o.scale.y = l.y, o.position.x = o.absolute.x * o.scale.x + o.offset.x, o.position.y = o.absolute.y * o.scale.y + o.offset.y;
            }, s._getRelativeMousePosition = function(o, l, c) {
              var h = l.getBoundingClientRect(), f = document.documentElement || document.body.parentNode || document.body, d = window.pageXOffset !== void 0 ? window.pageXOffset : f.scrollLeft, u = window.pageYOffset !== void 0 ? window.pageYOffset : f.scrollTop, m = o.changedTouches, p, g;
              return m ? (p = m[0].pageX - h.left - d, g = m[0].pageY - h.top - u) : (p = o.pageX - h.left - d, g = o.pageY - h.top - u), {
                x: p / (l.clientWidth / (l.width || l.clientWidth) * c),
                y: g / (l.clientHeight / (l.height || l.clientHeight) * c)
              };
            };
          })();
        },
        /* 15 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(0);
          (function() {
            s._registry = {}, s.register = function(o) {
              if (s.isPlugin(o) || a.warn("Plugin.register:", s.toString(o), "does not implement all required fields."), o.name in s._registry) {
                var l = s._registry[o.name], c = s.versionParse(o.version).number, h = s.versionParse(l.version).number;
                c > h ? (a.warn("Plugin.register:", s.toString(l), "was upgraded to", s.toString(o)), s._registry[o.name] = o) : c < h ? a.warn("Plugin.register:", s.toString(l), "can not be downgraded to", s.toString(o)) : o !== l && a.warn("Plugin.register:", s.toString(o), "is already registered to different plugin object");
              } else
                s._registry[o.name] = o;
              return o;
            }, s.resolve = function(o) {
              return s._registry[s.dependencyParse(o).name];
            }, s.toString = function(o) {
              return typeof o == "string" ? o : (o.name || "anonymous") + "@" + (o.version || o.range || "0.0.0");
            }, s.isPlugin = function(o) {
              return o && o.name && o.version && o.install;
            }, s.isUsed = function(o, l) {
              return o.used.indexOf(l) > -1;
            }, s.isFor = function(o, l) {
              var c = o.for && s.dependencyParse(o.for);
              return !o.for || l.name === c.name && s.versionSatisfies(l.version, c.range);
            }, s.use = function(o, l) {
              if (o.uses = (o.uses || []).concat(l || []), o.uses.length === 0) {
                a.warn("Plugin.use:", s.toString(o), "does not specify any dependencies to install.");
                return;
              }
              for (var c = s.dependencies(o), h = a.topologicalSort(c), f = [], d = 0; d < h.length; d += 1)
                if (h[d] !== o.name) {
                  var u = s.resolve(h[d]);
                  if (!u) {
                    f.push("❌ " + h[d]);
                    continue;
                  }
                  s.isUsed(o, u.name) || (s.isFor(u, o) || (a.warn("Plugin.use:", s.toString(u), "is for", u.for, "but installed on", s.toString(o) + "."), u._warned = !0), u.install ? u.install(o) : (a.warn("Plugin.use:", s.toString(u), "does not specify an install function."), u._warned = !0), u._warned ? (f.push("🔶 " + s.toString(u)), delete u._warned) : f.push("✅ " + s.toString(u)), o.used.push(u.name));
                }
              f.length > 0 && a.info(f.join("  "));
            }, s.dependencies = function(o, l) {
              var c = s.dependencyParse(o), h = c.name;
              if (l = l || {}, !(h in l)) {
                o = s.resolve(o) || o, l[h] = a.map(o.uses || [], function(d) {
                  s.isPlugin(d) && s.register(d);
                  var u = s.dependencyParse(d), m = s.resolve(d);
                  return m && !s.versionSatisfies(m.version, u.range) ? (a.warn(
                    "Plugin.dependencies:",
                    s.toString(m),
                    "does not satisfy",
                    s.toString(u),
                    "used by",
                    s.toString(c) + "."
                  ), m._warned = !0, o._warned = !0) : m || (a.warn(
                    "Plugin.dependencies:",
                    s.toString(d),
                    "used by",
                    s.toString(c),
                    "could not be resolved."
                  ), o._warned = !0), u.name;
                });
                for (var f = 0; f < l[h].length; f += 1)
                  s.dependencies(l[h][f], l);
                return l;
              }
            }, s.dependencyParse = function(o) {
              if (a.isString(o)) {
                var l = /^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/;
                return l.test(o) || a.warn("Plugin.dependencyParse:", o, "is not a valid dependency string."), {
                  name: o.split("@")[0],
                  range: o.split("@")[1] || "*"
                };
              }
              return {
                name: o.name,
                range: o.range || o.version
              };
            }, s.versionParse = function(o) {
              var l = /^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;
              l.test(o) || a.warn("Plugin.versionParse:", o, "is not a valid version or range.");
              var c = l.exec(o), h = Number(c[4]), f = Number(c[5]), d = Number(c[6]);
              return {
                isRange: !!(c[1] || c[2]),
                version: c[3],
                range: o,
                operator: c[1] || c[2] || "",
                major: h,
                minor: f,
                patch: d,
                parts: [h, f, d],
                prerelease: c[7],
                number: h * 1e8 + f * 1e4 + d
              };
            }, s.versionSatisfies = function(o, l) {
              l = l || "*";
              var c = s.versionParse(l), h = s.versionParse(o);
              if (c.isRange) {
                if (c.operator === "*" || o === "*")
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
              return o === l || o === "*";
            };
          })();
        },
        /* 16 */
        /***/
        function(e, i) {
          var r = {};
          e.exports = r, function() {
            r.create = function(s) {
              return {
                vertex: s,
                normalImpulse: 0,
                tangentImpulse: 0
              };
            };
          }();
        },
        /* 17 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(7), o = r(18), l = r(13), c = r(19), h = r(5), f = r(6), d = r(10), u = r(0), m = r(4);
          (function() {
            s._deltaMax = 1e3 / 60, s.create = function(p) {
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
            }, s.update = function(p, g) {
              var x = u.now(), y = p.world, v = p.detector, b = p.pairs, _ = p.timing, S = _.timestamp, C;
              g > s._deltaMax && u.warnOnce(
                "Matter.Engine.update: delta argument is recommended to be less than or equal to",
                s._deltaMax.toFixed(3),
                "ms."
              ), g = typeof g < "u" ? g : u._baseDelta, g *= _.timeScale, _.timestamp += g, _.lastDelta = g;
              var w = {
                timestamp: _.timestamp,
                delta: g
              };
              h.trigger(p, "beforeUpdate", w);
              var A = f.allBodies(y), P = f.allConstraints(y);
              for (y.isModified && (l.setBodies(v, A), f.setModified(y, !1, !1, !0)), p.enableSleeping && a.update(A, g), s._bodiesApplyGravity(A, p.gravity), g > 0 && s._bodiesUpdate(A, g), h.trigger(p, "beforeSolve", w), d.preSolveAll(A), C = 0; C < p.constraintIterations; C++)
                d.solveAll(P, g);
              d.postSolveAll(A);
              var M = l.collisions(v);
              c.update(b, M, S), p.enableSleeping && a.afterCollisions(b.list), b.collisionStart.length > 0 && h.trigger(p, "collisionStart", {
                pairs: b.collisionStart,
                timestamp: _.timestamp,
                delta: g
              });
              var T = u.clamp(20 / p.positionIterations, 0, 1);
              for (o.preSolvePosition(b.list), C = 0; C < p.positionIterations; C++)
                o.solvePosition(b.list, g, T);
              for (o.postSolvePosition(A), d.preSolveAll(A), C = 0; C < p.constraintIterations; C++)
                d.solveAll(P, g);
              for (d.postSolveAll(A), o.preSolveVelocity(b.list), C = 0; C < p.velocityIterations; C++)
                o.solveVelocity(b.list, g);
              return s._bodiesUpdateVelocities(A), b.collisionActive.length > 0 && h.trigger(p, "collisionActive", {
                pairs: b.collisionActive,
                timestamp: _.timestamp,
                delta: g
              }), b.collisionEnd.length > 0 && h.trigger(p, "collisionEnd", {
                pairs: b.collisionEnd,
                timestamp: _.timestamp,
                delta: g
              }), s._bodiesClearForces(A), h.trigger(p, "afterUpdate", w), p.timing.lastElapsed = u.now() - x, p;
            }, s.merge = function(p, g) {
              if (u.extend(p, g), g.world) {
                p.world = g.world, s.clear(p);
                for (var x = f.allBodies(p.world), y = 0; y < x.length; y++) {
                  var v = x[y];
                  a.set(v, !1), v.id = u.nextId();
                }
              }
            }, s.clear = function(p) {
              c.clear(p.pairs), l.clear(p.detector);
            }, s._bodiesClearForces = function(p) {
              for (var g = p.length, x = 0; x < g; x++) {
                var y = p[x];
                y.force.x = 0, y.force.y = 0, y.torque = 0;
              }
            }, s._bodiesApplyGravity = function(p, g) {
              var x = typeof g.scale < "u" ? g.scale : 1e-3, y = p.length;
              if (!(g.x === 0 && g.y === 0 || x === 0))
                for (var v = 0; v < y; v++) {
                  var b = p[v];
                  b.isStatic || b.isSleeping || (b.force.y += b.mass * g.y * x, b.force.x += b.mass * g.x * x);
                }
            }, s._bodiesUpdate = function(p, g) {
              for (var x = p.length, y = 0; y < x; y++) {
                var v = p[y];
                v.isStatic || v.isSleeping || m.update(v, g);
              }
            }, s._bodiesUpdateVelocities = function(p) {
              for (var g = p.length, x = 0; x < g; x++)
                m.updateVelocities(p[x]);
            };
          })();
        },
        /* 18 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(3), o = r(0), l = r(1);
          (function() {
            s._restingThresh = 2, s._restingThreshTangent = Math.sqrt(6), s._positionDampen = 0.9, s._positionWarming = 0.8, s._frictionNormalMultiplier = 5, s._frictionMaxStatic = Number.MAX_VALUE, s.preSolvePosition = function(c) {
              var h, f, d, u = c.length;
              for (h = 0; h < u; h++)
                f = c[h], f.isActive && (d = f.contactCount, f.collision.parentA.totalContacts += d, f.collision.parentB.totalContacts += d);
            }, s.solvePosition = function(c, h, f) {
              var d, u, m, p, g, x, y, v, b = s._positionDampen * (f || 1), _ = o.clamp(h / o._baseDelta, 0, 1), S = c.length;
              for (d = 0; d < S; d++)
                u = c[d], !(!u.isActive || u.isSensor) && (m = u.collision, p = m.parentA, g = m.parentB, x = m.normal, u.separation = m.depth + x.x * (g.positionImpulse.x - p.positionImpulse.x) + x.y * (g.positionImpulse.y - p.positionImpulse.y));
              for (d = 0; d < S; d++)
                u = c[d], !(!u.isActive || u.isSensor) && (m = u.collision, p = m.parentA, g = m.parentB, x = m.normal, v = u.separation - u.slop * _, (p.isStatic || g.isStatic) && (v *= 2), p.isStatic || p.isSleeping || (y = b / p.totalContacts, p.positionImpulse.x += x.x * v * y, p.positionImpulse.y += x.y * v * y), g.isStatic || g.isSleeping || (y = b / g.totalContacts, g.positionImpulse.x -= x.x * v * y, g.positionImpulse.y -= x.y * v * y));
            }, s.postSolvePosition = function(c) {
              for (var h = s._positionWarming, f = c.length, d = a.translate, u = l.update, m = 0; m < f; m++) {
                var p = c[m], g = p.positionImpulse, x = g.x, y = g.y, v = p.velocity;
                if (p.totalContacts = 0, x !== 0 || y !== 0) {
                  for (var b = 0; b < p.parts.length; b++) {
                    var _ = p.parts[b];
                    d(_.vertices, g), u(_.bounds, _.vertices, v), _.position.x += x, _.position.y += y;
                  }
                  p.positionPrev.x += x, p.positionPrev.y += y, x * v.x + y * v.y < 0 ? (g.x = 0, g.y = 0) : (g.x *= h, g.y *= h);
                }
              }
            }, s.preSolveVelocity = function(c) {
              var h = c.length, f, d;
              for (f = 0; f < h; f++) {
                var u = c[f];
                if (!(!u.isActive || u.isSensor)) {
                  var m = u.contacts, p = u.contactCount, g = u.collision, x = g.parentA, y = g.parentB, v = g.normal, b = g.tangent;
                  for (d = 0; d < p; d++) {
                    var _ = m[d], S = _.vertex, C = _.normalImpulse, w = _.tangentImpulse;
                    if (C !== 0 || w !== 0) {
                      var A = v.x * C + b.x * w, P = v.y * C + b.y * w;
                      x.isStatic || x.isSleeping || (x.positionPrev.x += A * x.inverseMass, x.positionPrev.y += P * x.inverseMass, x.anglePrev += x.inverseInertia * ((S.x - x.position.x) * P - (S.y - x.position.y) * A)), y.isStatic || y.isSleeping || (y.positionPrev.x -= A * y.inverseMass, y.positionPrev.y -= P * y.inverseMass, y.anglePrev -= y.inverseInertia * ((S.x - y.position.x) * P - (S.y - y.position.y) * A));
                    }
                  }
                }
              }
            }, s.solveVelocity = function(c, h) {
              var f = h / o._baseDelta, d = f * f, u = d * f, m = -s._restingThresh * f, p = s._restingThreshTangent, g = s._frictionNormalMultiplier * f, x = s._frictionMaxStatic, y = c.length, v, b, _, S;
              for (_ = 0; _ < y; _++) {
                var C = c[_];
                if (!(!C.isActive || C.isSensor)) {
                  var w = C.collision, A = w.parentA, P = w.parentB, M = w.normal.x, T = w.normal.y, k = w.tangent.x, E = w.tangent.y, I = C.inverseMass, B = C.friction * C.frictionStatic * g, R = C.contacts, z = C.contactCount, F = 1 / z, L = A.position.x - A.positionPrev.x, Z = A.position.y - A.positionPrev.y, U = A.angle - A.anglePrev, j = P.position.x - P.positionPrev.x, J = P.position.y - P.positionPrev.y, Q = P.angle - P.anglePrev;
                  for (S = 0; S < z; S++) {
                    var G = R[S], Et = G.vertex, lt = Et.x - A.position.x, Zt = Et.y - A.position.y, Dt = Et.x - P.position.x, zt = Et.y - P.position.y, dt = L - Zt * U, ni = Z + lt * U, Fi = j - zt * Q, _e = J + Dt * Q, ae = dt - Fi, oe = ni - _e, Qt = M * ae + T * oe, Jt = k * ae + E * oe, Li = C.separation + Qt, Oi = Math.min(Li, 1);
                    Oi = Li < 0 ? 0 : Oi;
                    var xn = Oi * B;
                    Jt < -xn || Jt > xn ? (b = Jt > 0 ? Jt : -Jt, v = C.friction * (Jt > 0 ? 1 : -1) * u, v < -b ? v = -b : v > b && (v = b)) : (v = Jt, b = x);
                    var ba = lt * T - Zt * M, Sa = Dt * T - zt * M, Aa = F / (I + A.inverseInertia * ba * ba + P.inverseInertia * Sa * Sa), vs = (1 + C.restitution) * Qt * Aa;
                    if (v *= Aa, Qt < m)
                      G.normalImpulse = 0;
                    else {
                      var Tc = G.normalImpulse;
                      G.normalImpulse += vs, G.normalImpulse > 0 && (G.normalImpulse = 0), vs = G.normalImpulse - Tc;
                    }
                    if (Jt < -p || Jt > p)
                      G.tangentImpulse = 0;
                    else {
                      var kc = G.tangentImpulse;
                      G.tangentImpulse += v, G.tangentImpulse < -b && (G.tangentImpulse = -b), G.tangentImpulse > b && (G.tangentImpulse = b), v = G.tangentImpulse - kc;
                    }
                    var ws = M * vs + k * v, bs = T * vs + E * v;
                    A.isStatic || A.isSleeping || (A.positionPrev.x += ws * A.inverseMass, A.positionPrev.y += bs * A.inverseMass, A.anglePrev += (lt * bs - Zt * ws) * A.inverseInertia), P.isStatic || P.isSleeping || (P.positionPrev.x -= ws * P.inverseMass, P.positionPrev.y -= bs * P.inverseMass, P.anglePrev -= (Dt * bs - zt * ws) * P.inverseInertia);
                  }
                }
              }
            };
          })();
        },
        /* 19 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(9), o = r(0);
          (function() {
            s.create = function(l) {
              return o.extend({
                table: {},
                list: [],
                collisionStart: [],
                collisionActive: [],
                collisionEnd: []
              }, l);
            }, s.update = function(l, c, h) {
              var f = a.update, d = a.create, u = a.setActive, m = l.table, p = l.list, g = p.length, x = g, y = l.collisionStart, v = l.collisionEnd, b = l.collisionActive, _ = c.length, S = 0, C = 0, w = 0, A, P, M;
              for (M = 0; M < _; M++)
                A = c[M], P = A.pair, P ? (P.isActive && (b[w++] = P), f(P, A, h)) : (P = d(A, h), m[P.id] = P, y[S++] = P, p[x++] = P);
              for (x = 0, g = p.length, M = 0; M < g; M++)
                P = p[M], P.timeUpdated >= h ? p[x++] = P : (u(P, !1, h), P.collision.bodyA.sleepCounter > 0 && P.collision.bodyB.sleepCounter > 0 ? p[x++] = P : (v[C++] = P, delete m[P.id]));
              p.length !== x && (p.length = x), y.length !== S && (y.length = S), v.length !== C && (v.length = C), b.length !== w && (b.length = w);
            }, s.clear = function(l) {
              return l.table = {}, l.list.length = 0, l.collisionStart.length = 0, l.collisionActive.length = 0, l.collisionEnd.length = 0, l;
            };
          })();
        },
        /* 20 */
        /***/
        function(e, i, r) {
          var s = e.exports = r(21);
          s.Axes = r(11), s.Bodies = r(12), s.Body = r(4), s.Bounds = r(1), s.Collision = r(8), s.Common = r(0), s.Composite = r(6), s.Composites = r(22), s.Constraint = r(10), s.Contact = r(16), s.Detector = r(13), s.Engine = r(17), s.Events = r(5), s.Grid = r(23), s.Mouse = r(14), s.MouseConstraint = r(24), s.Pair = r(9), s.Pairs = r(19), s.Plugin = r(15), s.Query = r(25), s.Render = r(26), s.Resolver = r(18), s.Runner = r(27), s.SAT = r(28), s.Sleeping = r(7), s.Svg = r(29), s.Vector = r(2), s.Vertices = r(3), s.World = r(30), s.Engine.run = s.Runner.run, s.Common.deprecated(s.Engine, "run", "Engine.run ➤ use Matter.Runner.run(engine) instead");
        },
        /* 21 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(15), o = r(0);
          (function() {
            s.name = "matter-js", s.version = "0.20.0", s.uses = [], s.used = [], s.use = function() {
              a.use(s, Array.prototype.slice.call(arguments));
            }, s.before = function(l, c) {
              return l = l.replace(/^Matter./, ""), o.chainPathBefore(s, l, c);
            }, s.after = function(l, c) {
              return l = l.replace(/^Matter./, ""), o.chainPathAfter(s, l, c);
            };
          })();
        },
        /* 22 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(6), o = r(10), l = r(0), c = r(4), h = r(12), f = l.deprecated;
          (function() {
            s.stack = function(d, u, m, p, g, x, y) {
              for (var v = a.create({ label: "Stack" }), b = d, _ = u, S, C = 0, w = 0; w < p; w++) {
                for (var A = 0, P = 0; P < m; P++) {
                  var M = y(b, _, P, w, S, C);
                  if (M) {
                    var T = M.bounds.max.y - M.bounds.min.y, k = M.bounds.max.x - M.bounds.min.x;
                    T > A && (A = T), c.translate(M, { x: k * 0.5, y: T * 0.5 }), b = M.bounds.max.x + g, a.addBody(v, M), S = M, C += 1;
                  } else
                    b += g;
                }
                _ += A + x, b = d;
              }
              return v;
            }, s.chain = function(d, u, m, p, g, x) {
              for (var y = d.bodies, v = 1; v < y.length; v++) {
                var b = y[v - 1], _ = y[v], S = b.bounds.max.y - b.bounds.min.y, C = b.bounds.max.x - b.bounds.min.x, w = _.bounds.max.y - _.bounds.min.y, A = _.bounds.max.x - _.bounds.min.x, P = {
                  bodyA: b,
                  pointA: { x: C * u, y: S * m },
                  bodyB: _,
                  pointB: { x: A * p, y: w * g }
                }, M = l.extend(P, x);
                a.addConstraint(d, o.create(M));
              }
              return d.label += " Chain", d;
            }, s.mesh = function(d, u, m, p, g) {
              var x = d.bodies, y, v, b, _, S;
              for (y = 0; y < m; y++) {
                for (v = 1; v < u; v++)
                  b = x[v - 1 + y * u], _ = x[v + y * u], a.addConstraint(d, o.create(l.extend({ bodyA: b, bodyB: _ }, g)));
                if (y > 0)
                  for (v = 0; v < u; v++)
                    b = x[v + (y - 1) * u], _ = x[v + y * u], a.addConstraint(d, o.create(l.extend({ bodyA: b, bodyB: _ }, g))), p && v > 0 && (S = x[v - 1 + (y - 1) * u], a.addConstraint(d, o.create(l.extend({ bodyA: S, bodyB: _ }, g)))), p && v < u - 1 && (S = x[v + 1 + (y - 1) * u], a.addConstraint(d, o.create(l.extend({ bodyA: S, bodyB: _ }, g))));
              }
              return d.label += " Mesh", d;
            }, s.pyramid = function(d, u, m, p, g, x, y) {
              return s.stack(d, u, m, p, g, x, function(v, b, _, S, C, w) {
                var A = Math.min(p, Math.ceil(m / 2)), P = C ? C.bounds.max.x - C.bounds.min.x : 0;
                if (!(S > A)) {
                  S = A - S;
                  var M = S, T = m - 1 - S;
                  if (!(_ < M || _ > T)) {
                    w === 1 && c.translate(C, { x: (_ + (m % 2 === 1 ? 1 : -1)) * P, y: 0 });
                    var k = C ? _ * P : 0;
                    return y(d + k + _ * g, b, _, S, C, w);
                  }
                }
              });
            }, s.newtonsCradle = function(d, u, m, p, g) {
              for (var x = a.create({ label: "Newtons Cradle" }), y = 0; y < m; y++) {
                var v = 1.9, b = h.circle(
                  d + y * (p * v),
                  u + g,
                  p,
                  { inertia: 1 / 0, restitution: 1, friction: 0, frictionAir: 1e-4, slop: 1 }
                ), _ = o.create({ pointA: { x: d + y * (p * v), y: u }, bodyB: b });
                a.addBody(x, b), a.addConstraint(x, _);
              }
              return x;
            }, f(s, "newtonsCradle", "Composites.newtonsCradle ➤ moved to newtonsCradle example"), s.car = function(d, u, m, p, g) {
              var x = c.nextGroup(!0), y = 20, v = -m * 0.5 + y, b = m * 0.5 - y, _ = 0, S = a.create({ label: "Car" }), C = h.rectangle(d, u, m, p, {
                collisionFilter: {
                  group: x
                },
                chamfer: {
                  radius: p * 0.5
                },
                density: 2e-4
              }), w = h.circle(d + v, u + _, g, {
                collisionFilter: {
                  group: x
                },
                friction: 0.8
              }), A = h.circle(d + b, u + _, g, {
                collisionFilter: {
                  group: x
                },
                friction: 0.8
              }), P = o.create({
                bodyB: C,
                pointB: { x: v, y: _ },
                bodyA: w,
                stiffness: 1,
                length: 0
              }), M = o.create({
                bodyB: C,
                pointB: { x: b, y: _ },
                bodyA: A,
                stiffness: 1,
                length: 0
              });
              return a.addBody(S, C), a.addBody(S, w), a.addBody(S, A), a.addConstraint(S, P), a.addConstraint(S, M), S;
            }, f(s, "car", "Composites.car ➤ moved to car example"), s.softBody = function(d, u, m, p, g, x, y, v, b, _) {
              b = l.extend({ inertia: 1 / 0 }, b), _ = l.extend({ stiffness: 0.2, render: { type: "line", anchors: !1 } }, _);
              var S = s.stack(d, u, m, p, g, x, function(C, w) {
                return h.circle(C, w, v, b);
              });
              return s.mesh(S, m, p, y, _), S.label = "Soft Body", S;
            }, f(s, "softBody", "Composites.softBody ➤ moved to softBody and cloth examples");
          })();
        },
        /* 23 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(9), o = r(0), l = o.deprecated;
          (function() {
            s.create = function(c) {
              var h = {
                buckets: {},
                pairs: {},
                pairsList: [],
                bucketWidth: 48,
                bucketHeight: 48
              };
              return o.extend(h, c);
            }, s.update = function(c, h, f, d) {
              var u, m, p, g = f.world, x = c.buckets, y, v, b = !1;
              for (u = 0; u < h.length; u++) {
                var _ = h[u];
                if (!(_.isSleeping && !d) && !(g.bounds && (_.bounds.max.x < g.bounds.min.x || _.bounds.min.x > g.bounds.max.x || _.bounds.max.y < g.bounds.min.y || _.bounds.min.y > g.bounds.max.y))) {
                  var S = s._getRegion(c, _);
                  if (!_.region || S.id !== _.region.id || d) {
                    (!_.region || d) && (_.region = S);
                    var C = s._regionUnion(S, _.region);
                    for (m = C.startCol; m <= C.endCol; m++)
                      for (p = C.startRow; p <= C.endRow; p++) {
                        v = s._getBucketId(m, p), y = x[v];
                        var w = m >= S.startCol && m <= S.endCol && p >= S.startRow && p <= S.endRow, A = m >= _.region.startCol && m <= _.region.endCol && p >= _.region.startRow && p <= _.region.endRow;
                        !w && A && A && y && s._bucketRemoveBody(c, y, _), (_.region === S || w && !A || d) && (y || (y = s._createBucket(x, v)), s._bucketAddBody(c, y, _));
                      }
                    _.region = S, b = !0;
                  }
                }
              }
              b && (c.pairsList = s._createActivePairsList(c));
            }, l(s, "update", "Grid.update ➤ replaced by Matter.Detector"), s.clear = function(c) {
              c.buckets = {}, c.pairs = {}, c.pairsList = [];
            }, l(s, "clear", "Grid.clear ➤ replaced by Matter.Detector"), s._regionUnion = function(c, h) {
              var f = Math.min(c.startCol, h.startCol), d = Math.max(c.endCol, h.endCol), u = Math.min(c.startRow, h.startRow), m = Math.max(c.endRow, h.endRow);
              return s._createRegion(f, d, u, m);
            }, s._getRegion = function(c, h) {
              var f = h.bounds, d = Math.floor(f.min.x / c.bucketWidth), u = Math.floor(f.max.x / c.bucketWidth), m = Math.floor(f.min.y / c.bucketHeight), p = Math.floor(f.max.y / c.bucketHeight);
              return s._createRegion(d, u, m, p);
            }, s._createRegion = function(c, h, f, d) {
              return {
                id: c + "," + h + "," + f + "," + d,
                startCol: c,
                endCol: h,
                startRow: f,
                endRow: d
              };
            }, s._getBucketId = function(c, h) {
              return "C" + c + "R" + h;
            }, s._createBucket = function(c, h) {
              var f = c[h] = [];
              return f;
            }, s._bucketAddBody = function(c, h, f) {
              var d = c.pairs, u = a.id, m = h.length, p;
              for (p = 0; p < m; p++) {
                var g = h[p];
                if (!(f.id === g.id || f.isStatic && g.isStatic)) {
                  var x = u(f, g), y = d[x];
                  y ? y[2] += 1 : d[x] = [f, g, 1];
                }
              }
              h.push(f);
            }, s._bucketRemoveBody = function(c, h, f) {
              var d = c.pairs, u = a.id, m;
              h.splice(o.indexOf(h, f), 1);
              var p = h.length;
              for (m = 0; m < p; m++) {
                var g = d[u(f, h[m])];
                g && (g[2] -= 1);
              }
            }, s._createActivePairsList = function(c) {
              var h, f = c.pairs, d = o.keys(f), u = d.length, m = [], p;
              for (p = 0; p < u; p++)
                h = f[d[p]], h[2] > 0 ? m.push(h) : delete f[d[p]];
              return m;
            };
          })();
        },
        /* 24 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(3), o = r(7), l = r(14), c = r(5), h = r(13), f = r(10), d = r(6), u = r(0), m = r(1);
          (function() {
            s.create = function(p, g) {
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
              }, b = u.extend(v, g);
              return c.on(p, "beforeUpdate", function() {
                var _ = d.allBodies(p.world);
                s.update(b, _), s._triggerEvents(b);
              }), b;
            }, s.update = function(p, g) {
              var x = p.mouse, y = p.constraint, v = p.body;
              if (x.button === 0) {
                if (y.bodyB)
                  o.set(y.bodyB, !1), y.pointA = x.position;
                else
                  for (var b = 0; b < g.length; b++)
                    if (v = g[b], m.contains(v.bounds, x.position) && h.canCollide(v.collisionFilter, p.collisionFilter))
                      for (var _ = v.parts.length > 1 ? 1 : 0; _ < v.parts.length; _++) {
                        var S = v.parts[_];
                        if (a.contains(S.vertices, x.position)) {
                          y.pointA = x.position, y.bodyB = p.body = v, y.pointB = { x: x.position.x - v.position.x, y: x.position.y - v.position.y }, y.angleB = v.angle, o.set(v, !1), c.trigger(p, "startdrag", { mouse: x, body: v });
                          break;
                        }
                      }
              } else
                y.bodyB = p.body = null, y.pointB = null, v && c.trigger(p, "enddrag", { mouse: x, body: v });
            }, s._triggerEvents = function(p) {
              var g = p.mouse, x = g.sourceEvents;
              x.mousemove && c.trigger(p, "mousemove", { mouse: g }), x.mousedown && c.trigger(p, "mousedown", { mouse: g }), x.mouseup && c.trigger(p, "mouseup", { mouse: g }), l.clearSourceEvents(g);
            };
          })();
        },
        /* 25 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(2), o = r(8), l = r(1), c = r(12), h = r(3);
          (function() {
            s.collides = function(f, d) {
              for (var u = [], m = d.length, p = f.bounds, g = o.collides, x = l.overlaps, y = 0; y < m; y++) {
                var v = d[y], b = v.parts.length, _ = b === 1 ? 0 : 1;
                if (x(v.bounds, p))
                  for (var S = _; S < b; S++) {
                    var C = v.parts[S];
                    if (x(C.bounds, p)) {
                      var w = g(C, f);
                      if (w) {
                        u.push(w);
                        break;
                      }
                    }
                  }
              }
              return u;
            }, s.ray = function(f, d, u, m) {
              m = m || 1e-100;
              for (var p = a.angle(d, u), g = a.magnitude(a.sub(d, u)), x = (u.x + d.x) * 0.5, y = (u.y + d.y) * 0.5, v = c.rectangle(x, y, g, m, { angle: p }), b = s.collides(v, f), _ = 0; _ < b.length; _ += 1) {
                var S = b[_];
                S.body = S.bodyB = S.bodyA;
              }
              return b;
            }, s.region = function(f, d, u) {
              for (var m = [], p = 0; p < f.length; p++) {
                var g = f[p], x = l.overlaps(g.bounds, d);
                (x && !u || !x && u) && m.push(g);
              }
              return m;
            }, s.point = function(f, d) {
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
          var s = {};
          e.exports = s;
          var a = r(4), o = r(0), l = r(6), c = r(1), h = r(5), f = r(2), d = r(14);
          (function() {
            var u, m;
            typeof window < "u" && (u = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(_) {
              window.setTimeout(function() {
                _(o.now());
              }, 1e3 / 60);
            }, m = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame), s._goodFps = 30, s._goodDelta = 1e3 / 60, s.create = function(_) {
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
              }, C = o.extend(S, _);
              return C.canvas && (C.canvas.width = C.options.width || C.canvas.width, C.canvas.height = C.options.height || C.canvas.height), C.mouse = _.mouse, C.engine = _.engine, C.canvas = C.canvas || x(C.options.width, C.options.height), C.context = C.canvas.getContext("2d"), C.textures = {}, C.bounds = C.bounds || {
                min: {
                  x: 0,
                  y: 0
                },
                max: {
                  x: C.canvas.width,
                  y: C.canvas.height
                }
              }, C.controller = s, C.options.showBroadphase = !1, C.options.pixelRatio !== 1 && s.setPixelRatio(C, C.options.pixelRatio), o.isElement(C.element) && C.element.appendChild(C.canvas), C;
            }, s.run = function(_) {
              (function S(C) {
                _.frameRequestId = u(S), p(_, C), s.world(_, C), _.context.setTransform(_.options.pixelRatio, 0, 0, _.options.pixelRatio, 0, 0), (_.options.showStats || _.options.showDebug) && s.stats(_, _.context, C), (_.options.showPerformance || _.options.showDebug) && s.performance(_, _.context, C), _.context.setTransform(1, 0, 0, 1, 0, 0);
              })();
            }, s.stop = function(_) {
              m(_.frameRequestId);
            }, s.setPixelRatio = function(_, S) {
              var C = _.options, w = _.canvas;
              S === "auto" && (S = y(w)), C.pixelRatio = S, w.setAttribute("data-pixel-ratio", S), w.width = C.width * S, w.height = C.height * S, w.style.width = C.width + "px", w.style.height = C.height + "px";
            }, s.setSize = function(_, S, C) {
              _.options.width = S, _.options.height = C, _.bounds.max.x = _.bounds.min.x + S, _.bounds.max.y = _.bounds.min.y + C, _.options.pixelRatio !== 1 ? s.setPixelRatio(_, _.options.pixelRatio) : (_.canvas.width = S, _.canvas.height = C);
            }, s.lookAt = function(_, S, C, w) {
              w = typeof w < "u" ? w : !0, S = o.isArray(S) ? S : [S], C = C || {
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
              F > z ? Z = F / z : L = z / F, _.options.hasBounds = !0, _.bounds.min.x = A.min.x, _.bounds.max.x = A.min.x + E * L, _.bounds.min.y = A.min.y, _.bounds.max.y = A.min.y + I * Z, w && (_.bounds.min.x += E * 0.5 - E * L * 0.5, _.bounds.max.x += E * 0.5 - E * L * 0.5, _.bounds.min.y += I * 0.5 - I * Z * 0.5, _.bounds.max.y += I * 0.5 - I * Z * 0.5), _.bounds.min.x -= C.x, _.bounds.max.x -= C.x, _.bounds.min.y -= C.y, _.bounds.max.y -= C.y, _.mouse && (d.setScale(_.mouse, {
                x: (_.bounds.max.x - _.bounds.min.x) / _.canvas.width,
                y: (_.bounds.max.y - _.bounds.min.y) / _.canvas.height
              }), d.setOffset(_.mouse, _.bounds.min));
            }, s.startViewTransform = function(_) {
              var S = _.bounds.max.x - _.bounds.min.x, C = _.bounds.max.y - _.bounds.min.y, w = S / _.options.width, A = C / _.options.height;
              _.context.setTransform(
                _.options.pixelRatio / w,
                0,
                0,
                _.options.pixelRatio / A,
                0,
                0
              ), _.context.translate(-_.bounds.min.x, -_.bounds.min.y);
            }, s.endViewTransform = function(_) {
              _.context.setTransform(_.options.pixelRatio, 0, 0, _.options.pixelRatio, 0, 0);
            }, s.world = function(_, S) {
              var C = o.now(), w = _.engine, A = w.world, P = _.canvas, M = _.context, T = _.options, k = _.timing, E = l.allBodies(A), I = l.allConstraints(A), B = T.wireframes ? T.wireframeBackground : T.background, R = [], z = [], F, L = {
                timestamp: w.timing.timestamp
              };
              if (h.trigger(_, "beforeRender", L), _.currentBackground !== B && b(_, B), M.globalCompositeOperation = "source-in", M.fillStyle = "transparent", M.fillRect(0, 0, P.width, P.height), M.globalCompositeOperation = "source-over", T.hasBounds) {
                for (F = 0; F < E.length; F++) {
                  var Z = E[F];
                  c.overlaps(Z.bounds, _.bounds) && R.push(Z);
                }
                for (F = 0; F < I.length; F++) {
                  var U = I[F], j = U.bodyA, J = U.bodyB, Q = U.pointA, G = U.pointB;
                  j && (Q = f.add(j.position, U.pointA)), J && (G = f.add(J.position, U.pointB)), !(!Q || !G) && (c.contains(_.bounds, Q) || c.contains(_.bounds, G)) && z.push(U);
                }
                s.startViewTransform(_), _.mouse && (d.setScale(_.mouse, {
                  x: (_.bounds.max.x - _.bounds.min.x) / _.options.width,
                  y: (_.bounds.max.y - _.bounds.min.y) / _.options.height
                }), d.setOffset(_.mouse, _.bounds.min));
              } else
                z = I, R = E, _.options.pixelRatio !== 1 && _.context.setTransform(_.options.pixelRatio, 0, 0, _.options.pixelRatio, 0, 0);
              !T.wireframes || w.enableSleeping && T.showSleeping ? s.bodies(_, R, M) : (T.showConvexHulls && s.bodyConvexHulls(_, R, M), s.bodyWireframes(_, R, M)), T.showBounds && s.bodyBounds(_, R, M), (T.showAxes || T.showAngleIndicator) && s.bodyAxes(_, R, M), T.showPositions && s.bodyPositions(_, R, M), T.showVelocity && s.bodyVelocity(_, R, M), T.showIds && s.bodyIds(_, R, M), T.showSeparations && s.separations(_, w.pairs.list, M), T.showCollisions && s.collisions(_, w.pairs.list, M), T.showVertexNumbers && s.vertexNumbers(_, R, M), T.showMousePosition && s.mousePosition(_, _.mouse, M), s.constraints(z, M), T.hasBounds && s.endViewTransform(_), h.trigger(_, "afterRender", L), k.lastElapsed = o.now() - C;
            }, s.stats = function(_, S, C) {
              for (var w = _.engine, A = w.world, P = l.allBodies(A), M = 0, T = 55, k = 44, E = 0, I = 0, B = 0; B < P.length; B += 1)
                M += P[B].parts.length;
              var R = {
                Part: M,
                Body: P.length,
                Cons: l.allConstraints(A).length,
                Comp: l.allComposites(A).length,
                Pair: w.pairs.list.length
              };
              S.fillStyle = "#0e0f19", S.fillRect(E, I, T * 5.5, k), S.font = "12px Arial", S.textBaseline = "top", S.textAlign = "right";
              for (var z in R) {
                var F = R[z];
                S.fillStyle = "#aaa", S.fillText(z, E + T, I + 8), S.fillStyle = "#eee", S.fillText(F, E + T, I + 26), E += T;
              }
            }, s.performance = function(_, S) {
              var C = _.engine, w = _.timing, A = w.deltaHistory, P = w.elapsedHistory, M = w.timestampElapsedHistory, T = w.engineDeltaHistory, k = w.engineUpdatesHistory, E = w.engineElapsedHistory, I = C.timing.lastUpdatesPerFrame, B = C.timing.lastDelta, R = g(A), z = g(P), F = g(T), L = g(k), Z = g(E), U = g(M), j = U / R || 0, J = Math.round(R / B), Q = 1e3 / R || 0, G = 4, Et = 12, lt = 60, Zt = 34, Dt = 10, zt = 69;
              S.fillStyle = "#0e0f19", S.fillRect(0, 50, Et * 5 + lt * 6 + 22, Zt), s.status(
                S,
                Dt,
                zt,
                lt,
                G,
                A.length,
                Math.round(Q) + " fps",
                Q / s._goodFps,
                function(dt) {
                  return A[dt] / R - 1;
                }
              ), s.status(
                S,
                Dt + Et + lt,
                zt,
                lt,
                G,
                T.length,
                B.toFixed(2) + " dt",
                s._goodDelta / B,
                function(dt) {
                  return T[dt] / F - 1;
                }
              ), s.status(
                S,
                Dt + (Et + lt) * 2,
                zt,
                lt,
                G,
                k.length,
                I + " upf",
                Math.pow(o.clamp(L / J || 1, 0, 1), 4),
                function(dt) {
                  return k[dt] / L - 1;
                }
              ), s.status(
                S,
                Dt + (Et + lt) * 3,
                zt,
                lt,
                G,
                E.length,
                Z.toFixed(2) + " ut",
                1 - I * Z / s._goodFps,
                function(dt) {
                  return E[dt] / Z - 1;
                }
              ), s.status(
                S,
                Dt + (Et + lt) * 4,
                zt,
                lt,
                G,
                P.length,
                z.toFixed(2) + " rt",
                1 - z / s._goodFps,
                function(dt) {
                  return P[dt] / z - 1;
                }
              ), s.status(
                S,
                Dt + (Et + lt) * 5,
                zt,
                lt,
                G,
                M.length,
                j.toFixed(2) + " x",
                j * j * j,
                function(dt) {
                  return (M[dt] / A[dt] / j || 0) - 1;
                }
              );
            }, s.status = function(_, S, C, w, A, P, M, T, k) {
              _.strokeStyle = "#888", _.fillStyle = "#444", _.lineWidth = 1, _.fillRect(S, C + 7, w, 1), _.beginPath(), _.moveTo(S, C + 7 - A * o.clamp(0.4 * k(0), -2, 2));
              for (var E = 0; E < w; E += 1)
                _.lineTo(S + E, C + 7 - (E < P ? A * o.clamp(0.4 * k(E), -2, 2) : 0));
              _.stroke(), _.fillStyle = "hsl(" + o.clamp(25 + 95 * T, 0, 120) + ",100%,60%)", _.fillRect(S, C - 7, 4, 4), _.font = "12px Arial", _.textBaseline = "middle", _.textAlign = "right", _.fillStyle = "#eee", _.fillText(M, S + w, C - 5);
            }, s.constraints = function(_, S) {
              for (var C = S, w = 0; w < _.length; w++) {
                var A = _[w];
                if (!(!A.render.visible || !A.pointA || !A.pointB)) {
                  var P = A.bodyA, M = A.bodyB, T, k;
                  if (P ? T = f.add(P.position, A.pointA) : T = A.pointA, A.render.type === "pin")
                    C.beginPath(), C.arc(T.x, T.y, 3, 0, 2 * Math.PI), C.closePath();
                  else {
                    if (M ? k = f.add(M.position, A.pointB) : k = A.pointB, C.beginPath(), C.moveTo(T.x, T.y), A.render.type === "spring")
                      for (var E = f.sub(k, T), I = f.perp(f.normalise(E)), B = Math.ceil(o.clamp(A.length / 5, 12, 20)), R, z = 1; z < B; z += 1)
                        R = z % 2 === 0 ? 1 : -1, C.lineTo(
                          T.x + E.x * (z / B) + I.x * R * 4,
                          T.y + E.y * (z / B) + I.y * R * 4
                        );
                    C.lineTo(k.x, k.y);
                  }
                  A.render.lineWidth && (C.lineWidth = A.render.lineWidth, C.strokeStyle = A.render.strokeStyle, C.stroke()), A.render.anchors && (C.fillStyle = A.render.strokeStyle, C.beginPath(), C.arc(T.x, T.y, 3, 0, 2 * Math.PI), C.arc(k.x, k.y, 3, 0, 2 * Math.PI), C.closePath(), C.fill());
                }
              }
            }, s.bodies = function(_, S, C) {
              var w = C;
              _.engine;
              var A = _.options, P = A.showInternalEdges || !A.wireframes, M, T, k, E;
              for (k = 0; k < S.length; k++)
                if (M = S[k], !!M.render.visible) {
                  for (E = M.parts.length > 1 ? 1 : 0; E < M.parts.length; E++)
                    if (T = M.parts[E], !!T.render.visible) {
                      if (A.showSleeping && M.isSleeping ? w.globalAlpha = 0.5 * T.render.opacity : T.render.opacity !== 1 && (w.globalAlpha = T.render.opacity), T.render.sprite && T.render.sprite.texture && !A.wireframes) {
                        var I = T.render.sprite, B = v(_, I.texture);
                        w.translate(T.position.x, T.position.y), w.rotate(T.angle), w.drawImage(
                          B,
                          B.width * -I.xOffset * I.xScale,
                          B.height * -I.yOffset * I.yScale,
                          B.width * I.xScale,
                          B.height * I.yScale
                        ), w.rotate(-T.angle), w.translate(-T.position.x, -T.position.y);
                      } else {
                        if (T.circleRadius)
                          w.beginPath(), w.arc(T.position.x, T.position.y, T.circleRadius, 0, 2 * Math.PI);
                        else {
                          w.beginPath(), w.moveTo(T.vertices[0].x, T.vertices[0].y);
                          for (var R = 1; R < T.vertices.length; R++)
                            !T.vertices[R - 1].isInternal || P ? w.lineTo(T.vertices[R].x, T.vertices[R].y) : w.moveTo(T.vertices[R].x, T.vertices[R].y), T.vertices[R].isInternal && !P && w.moveTo(T.vertices[(R + 1) % T.vertices.length].x, T.vertices[(R + 1) % T.vertices.length].y);
                          w.lineTo(T.vertices[0].x, T.vertices[0].y), w.closePath();
                        }
                        A.wireframes ? (w.lineWidth = 1, w.strokeStyle = _.options.wireframeStrokeStyle, w.stroke()) : (w.fillStyle = T.render.fillStyle, T.render.lineWidth && (w.lineWidth = T.render.lineWidth, w.strokeStyle = T.render.strokeStyle, w.stroke()), w.fill());
                      }
                      w.globalAlpha = 1;
                    }
                }
            }, s.bodyWireframes = function(_, S, C) {
              var w = C, A = _.options.showInternalEdges, P, M, T, k, E;
              for (w.beginPath(), T = 0; T < S.length; T++)
                if (P = S[T], !!P.render.visible)
                  for (E = P.parts.length > 1 ? 1 : 0; E < P.parts.length; E++) {
                    for (M = P.parts[E], w.moveTo(M.vertices[0].x, M.vertices[0].y), k = 1; k < M.vertices.length; k++)
                      !M.vertices[k - 1].isInternal || A ? w.lineTo(M.vertices[k].x, M.vertices[k].y) : w.moveTo(M.vertices[k].x, M.vertices[k].y), M.vertices[k].isInternal && !A && w.moveTo(M.vertices[(k + 1) % M.vertices.length].x, M.vertices[(k + 1) % M.vertices.length].y);
                    w.lineTo(M.vertices[0].x, M.vertices[0].y);
                  }
              w.lineWidth = 1, w.strokeStyle = _.options.wireframeStrokeStyle, w.stroke();
            }, s.bodyConvexHulls = function(_, S, C) {
              var w = C, A, P, M;
              for (w.beginPath(), P = 0; P < S.length; P++)
                if (A = S[P], !(!A.render.visible || A.parts.length === 1)) {
                  for (w.moveTo(A.vertices[0].x, A.vertices[0].y), M = 1; M < A.vertices.length; M++)
                    w.lineTo(A.vertices[M].x, A.vertices[M].y);
                  w.lineTo(A.vertices[0].x, A.vertices[0].y);
                }
              w.lineWidth = 1, w.strokeStyle = "rgba(255,255,255,0.2)", w.stroke();
            }, s.vertexNumbers = function(_, S, C) {
              var w = C, A, P, M;
              for (A = 0; A < S.length; A++) {
                var T = S[A].parts;
                for (M = T.length > 1 ? 1 : 0; M < T.length; M++) {
                  var k = T[M];
                  for (P = 0; P < k.vertices.length; P++)
                    w.fillStyle = "rgba(255,255,255,0.2)", w.fillText(A + "_" + P, k.position.x + (k.vertices[P].x - k.position.x) * 0.8, k.position.y + (k.vertices[P].y - k.position.y) * 0.8);
                }
              }
            }, s.mousePosition = function(_, S, C) {
              var w = C;
              w.fillStyle = "rgba(255,255,255,0.8)", w.fillText(S.position.x + "  " + S.position.y, S.position.x + 5, S.position.y - 5);
            }, s.bodyBounds = function(_, S, C) {
              var w = C;
              _.engine;
              var A = _.options;
              w.beginPath();
              for (var P = 0; P < S.length; P++) {
                var M = S[P];
                if (M.render.visible)
                  for (var T = S[P].parts, k = T.length > 1 ? 1 : 0; k < T.length; k++) {
                    var E = T[k];
                    w.rect(E.bounds.min.x, E.bounds.min.y, E.bounds.max.x - E.bounds.min.x, E.bounds.max.y - E.bounds.min.y);
                  }
              }
              A.wireframes ? w.strokeStyle = "rgba(255,255,255,0.08)" : w.strokeStyle = "rgba(0,0,0,0.1)", w.lineWidth = 1, w.stroke();
            }, s.bodyAxes = function(_, S, C) {
              var w = C;
              _.engine;
              var A = _.options, P, M, T, k;
              for (w.beginPath(), M = 0; M < S.length; M++) {
                var E = S[M], I = E.parts;
                if (E.render.visible)
                  if (A.showAxes)
                    for (T = I.length > 1 ? 1 : 0; T < I.length; T++)
                      for (P = I[T], k = 0; k < P.axes.length; k++) {
                        var B = P.axes[k];
                        w.moveTo(P.position.x, P.position.y), w.lineTo(P.position.x + B.x * 20, P.position.y + B.y * 20);
                      }
                  else
                    for (T = I.length > 1 ? 1 : 0; T < I.length; T++)
                      for (P = I[T], k = 0; k < P.axes.length; k++)
                        w.moveTo(P.position.x, P.position.y), w.lineTo(
                          (P.vertices[0].x + P.vertices[P.vertices.length - 1].x) / 2,
                          (P.vertices[0].y + P.vertices[P.vertices.length - 1].y) / 2
                        );
              }
              A.wireframes ? (w.strokeStyle = "indianred", w.lineWidth = 1) : (w.strokeStyle = "rgba(255, 255, 255, 0.4)", w.globalCompositeOperation = "overlay", w.lineWidth = 2), w.stroke(), w.globalCompositeOperation = "source-over";
            }, s.bodyPositions = function(_, S, C) {
              var w = C;
              _.engine;
              var A = _.options, P, M, T, k;
              for (w.beginPath(), T = 0; T < S.length; T++)
                if (P = S[T], !!P.render.visible)
                  for (k = 0; k < P.parts.length; k++)
                    M = P.parts[k], w.arc(M.position.x, M.position.y, 3, 0, 2 * Math.PI, !1), w.closePath();
              for (A.wireframes ? w.fillStyle = "indianred" : w.fillStyle = "rgba(0,0,0,0.5)", w.fill(), w.beginPath(), T = 0; T < S.length; T++)
                P = S[T], P.render.visible && (w.arc(P.positionPrev.x, P.positionPrev.y, 2, 0, 2 * Math.PI, !1), w.closePath());
              w.fillStyle = "rgba(255,165,0,0.8)", w.fill();
            }, s.bodyVelocity = function(_, S, C) {
              var w = C;
              w.beginPath();
              for (var A = 0; A < S.length; A++) {
                var P = S[A];
                if (P.render.visible) {
                  var M = a.getVelocity(P);
                  w.moveTo(P.position.x, P.position.y), w.lineTo(P.position.x + M.x, P.position.y + M.y);
                }
              }
              w.lineWidth = 3, w.strokeStyle = "cornflowerblue", w.stroke();
            }, s.bodyIds = function(_, S, C) {
              var w = C, A, P;
              for (A = 0; A < S.length; A++)
                if (S[A].render.visible) {
                  var M = S[A].parts;
                  for (P = M.length > 1 ? 1 : 0; P < M.length; P++) {
                    var T = M[P];
                    w.font = "12px Arial", w.fillStyle = "rgba(255,255,255,0.5)", w.fillText(T.id, T.position.x + 10, T.position.y - 10);
                  }
                }
            }, s.collisions = function(_, S, C) {
              var w = C, A = _.options, P, M, T, k;
              for (w.beginPath(), T = 0; T < S.length; T++)
                if (P = S[T], !!P.isActive)
                  for (M = P.collision, k = 0; k < P.contactCount; k++) {
                    var E = P.contacts[k], I = E.vertex;
                    w.rect(I.x - 1.5, I.y - 1.5, 3.5, 3.5);
                  }
              for (A.wireframes ? w.fillStyle = "rgba(255,255,255,0.7)" : w.fillStyle = "orange", w.fill(), w.beginPath(), T = 0; T < S.length; T++)
                if (P = S[T], !!P.isActive && (M = P.collision, P.contactCount > 0)) {
                  var B = P.contacts[0].vertex.x, R = P.contacts[0].vertex.y;
                  P.contactCount === 2 && (B = (P.contacts[0].vertex.x + P.contacts[1].vertex.x) / 2, R = (P.contacts[0].vertex.y + P.contacts[1].vertex.y) / 2), M.bodyB === M.supports[0].body || M.bodyA.isStatic === !0 ? w.moveTo(B - M.normal.x * 8, R - M.normal.y * 8) : w.moveTo(B + M.normal.x * 8, R + M.normal.y * 8), w.lineTo(B, R);
                }
              A.wireframes ? w.strokeStyle = "rgba(255,165,0,0.7)" : w.strokeStyle = "orange", w.lineWidth = 1, w.stroke();
            }, s.separations = function(_, S, C) {
              var w = C, A = _.options, P, M, T, k, E;
              for (w.beginPath(), E = 0; E < S.length; E++)
                if (P = S[E], !!P.isActive) {
                  M = P.collision, T = M.bodyA, k = M.bodyB;
                  var I = 1;
                  !k.isStatic && !T.isStatic && (I = 0.5), k.isStatic && (I = 0), w.moveTo(k.position.x, k.position.y), w.lineTo(k.position.x - M.penetration.x * I, k.position.y - M.penetration.y * I), I = 1, !k.isStatic && !T.isStatic && (I = 0.5), T.isStatic && (I = 0), w.moveTo(T.position.x, T.position.y), w.lineTo(T.position.x + M.penetration.x * I, T.position.y + M.penetration.y * I);
                }
              A.wireframes ? w.strokeStyle = "rgba(255,165,0,0.5)" : w.strokeStyle = "orange", w.stroke();
            }, s.inspector = function(_, S) {
              _.engine;
              var C = _.selected, w = _.render, A = w.options, P;
              if (A.hasBounds) {
                var M = w.bounds.max.x - w.bounds.min.x, T = w.bounds.max.y - w.bounds.min.y, k = M / w.options.width, E = T / w.options.height;
                S.scale(1 / k, 1 / E), S.translate(-w.bounds.min.x, -w.bounds.min.y);
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
              var C = _.engine, w = _.timing, A = w.historySize, P = C.timing.timestamp;
              w.delta = S - w.lastTime || s._goodDelta, w.lastTime = S, w.timestampElapsed = P - w.lastTimestamp || 0, w.lastTimestamp = P, w.deltaHistory.unshift(w.delta), w.deltaHistory.length = Math.min(w.deltaHistory.length, A), w.engineDeltaHistory.unshift(C.timing.lastDelta), w.engineDeltaHistory.length = Math.min(w.engineDeltaHistory.length, A), w.timestampElapsedHistory.unshift(w.timestampElapsed), w.timestampElapsedHistory.length = Math.min(w.timestampElapsedHistory.length, A), w.engineUpdatesHistory.unshift(C.timing.lastUpdatesPerFrame), w.engineUpdatesHistory.length = Math.min(w.engineUpdatesHistory.length, A), w.engineElapsedHistory.unshift(C.timing.lastElapsed), w.engineElapsedHistory.length = Math.min(w.engineElapsedHistory.length, A), w.elapsedHistory.unshift(w.lastElapsed), w.elapsedHistory.length = Math.min(w.elapsedHistory.length, A);
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
              var S = _.getContext("2d"), C = window.devicePixelRatio || 1, w = S.webkitBackingStorePixelRatio || S.mozBackingStorePixelRatio || S.msBackingStorePixelRatio || S.oBackingStorePixelRatio || S.backingStorePixelRatio || 1;
              return C / w;
            }, v = function(_, S) {
              var C = _.textures[S];
              return C || (C = _.textures[S] = new Image(), C.src = S, C);
            }, b = function(_, S) {
              var C = S;
              /(jpg|gif|png)$/.test(S) && (C = "url(" + S + ")"), _.canvas.style.background = C, _.canvas.style.backgroundSize = "contain", _.currentBackground = S;
            };
          })();
        },
        /* 27 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(5), o = r(17), l = r(0);
          (function() {
            s._maxFrameDelta = 1e3 / 15, s._frameDeltaFallback = 1e3 / 60, s._timeBufferMargin = 1.5, s._elapsedNextEstimate = 1, s._smoothingLowerBound = 0.1, s._smoothingUpperBound = 0.9, s.create = function(h) {
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
            }, s.run = function(h, f) {
              return h.timeBuffer = s._frameDeltaFallback, function d(u) {
                h.frameRequestId = s._onNextFrame(h, d), u && h.enabled && s.tick(h, f, u);
              }(), h;
            }, s.tick = function(h, f, d) {
              var u = l.now(), m = h.delta, p = 0, g = d - h.timeLastTick;
              if ((!g || !h.timeLastTick || g > Math.max(s._maxFrameDelta, h.maxFrameTime)) && (g = h.frameDelta || s._frameDeltaFallback), h.frameDeltaSmoothing) {
                h.frameDeltaHistory.push(g), h.frameDeltaHistory = h.frameDeltaHistory.slice(-h.frameDeltaHistorySize);
                var x = h.frameDeltaHistory.slice(0).sort(), y = h.frameDeltaHistory.slice(
                  x.length * s._smoothingLowerBound,
                  x.length * s._smoothingUpperBound
                ), v = c(y);
                g = v || g;
              }
              h.frameDeltaSnapping && (g = 1e3 / Math.round(1e3 / g)), h.frameDelta = g, h.timeLastTick = d, h.timeBuffer += h.frameDelta, h.timeBuffer = l.clamp(
                h.timeBuffer,
                0,
                h.frameDelta + m * s._timeBufferMargin
              ), h.lastUpdatesDeferred = 0;
              var b = h.maxUpdates || Math.ceil(h.maxFrameTime / m), _ = {
                timestamp: f.timing.timestamp
              };
              a.trigger(h, "beforeTick", _), a.trigger(h, "tick", _);
              for (var S = l.now(); m > 0 && h.timeBuffer >= m * s._timeBufferMargin; ) {
                a.trigger(h, "beforeUpdate", _), o.update(f, m), a.trigger(h, "afterUpdate", _), h.timeBuffer -= m, p += 1;
                var C = l.now() - u, w = l.now() - S, A = C + s._elapsedNextEstimate * w / p;
                if (p >= b || A > h.maxFrameTime) {
                  h.lastUpdatesDeferred = Math.round(Math.max(0, h.timeBuffer / m - s._timeBufferMargin));
                  break;
                }
              }
              f.timing.lastUpdatesPerFrame = p, a.trigger(h, "afterTick", _), h.frameDeltaHistory.length >= 100 && (h.lastUpdatesDeferred && Math.round(h.frameDelta / m) > b ? l.warnOnce("Matter.Runner: runner reached runner.maxUpdates, see docs.") : h.lastUpdatesDeferred && l.warnOnce("Matter.Runner: runner reached runner.maxFrameTime, see docs."), typeof h.isFixed < "u" && l.warnOnce("Matter.Runner: runner.isFixed is now redundant, see docs."), (h.deltaMin || h.deltaMax) && l.warnOnce("Matter.Runner: runner.deltaMin and runner.deltaMax were removed, see docs."), h.fps !== 0 && l.warnOnce("Matter.Runner: runner.fps was replaced by runner.delta, see docs."));
            }, s.stop = function(h) {
              s._cancelNextFrame(h);
            }, s._onNextFrame = function(h, f) {
              if (typeof window < "u" && window.requestAnimationFrame)
                h.frameRequestId = window.requestAnimationFrame(f);
              else
                throw new Error("Matter.Runner: missing required global window.requestAnimationFrame.");
              return h.frameRequestId;
            }, s._cancelNextFrame = function(h) {
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
          var s = {};
          e.exports = s;
          var a = r(8), o = r(0), l = o.deprecated;
          (function() {
            s.collides = function(c, h) {
              return a.collides(c, h);
            }, l(s, "collides", "SAT.collides ➤ replaced by Collision.collides");
          })();
        },
        /* 29 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s, r(1);
          var a = r(0);
          (function() {
            s.pathToVertices = function(o, l) {
              typeof window < "u" && !("SVGPathSeg" in window) && a.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");
              var c, h, f, d, u, m, p, g, x, y, v = [], b, _, S = 0, C = 0, w = 0;
              l = l || 15;
              var A = function(M, T, k) {
                var E = k % 2 === 1 && k > 1;
                if (!x || M != x.x || T != x.y) {
                  x && E ? (b = x.x, _ = x.y) : (b = 0, _ = 0);
                  var I = {
                    x: b + M,
                    y: _ + T
                  };
                  (E || !x) && (x = I), v.push(I), C = b + M, w = _ + T;
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
                      C = M.x, w = M.y;
                      break;
                    case "H":
                      C = M.x;
                      break;
                    case "V":
                      w = M.y;
                      break;
                  }
                  A(C, w, M.pathSegType);
                }
              };
              for (s._svgPathToAbsolute(o), f = o.getTotalLength(), m = [], c = 0; c < o.pathSegList.numberOfItems; c += 1)
                m.push(o.pathSegList.getItem(c));
              for (p = m.concat(); S < f; ) {
                if (y = o.getPathSegAtLength(S), u = m[y], u != g) {
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
                    d = o.getPointAtLength(S), A(d.x, d.y, 0);
                    break;
                }
                S += l;
              }
              for (c = 0, h = p.length; c < h; ++c)
                P(p[c]);
              return v;
            }, s._svgPathToAbsolute = function(o) {
              for (var l, c, h, f, d, u, m = o.pathSegList, p = 0, g = 0, x = m.numberOfItems, y = 0; y < x; ++y) {
                var v = m.getItem(y), b = v.pathSegTypeAsLetter;
                if (/[MLHVCSQTA]/.test(b))
                  "x" in v && (p = v.x), "y" in v && (g = v.y);
                else
                  switch ("x1" in v && (h = p + v.x1), "x2" in v && (d = p + v.x2), "y1" in v && (f = g + v.y1), "y2" in v && (u = g + v.y2), "x" in v && (p += v.x), "y" in v && (g += v.y), b) {
                    case "m":
                      m.replaceItem(o.createSVGPathSegMovetoAbs(p, g), y);
                      break;
                    case "l":
                      m.replaceItem(o.createSVGPathSegLinetoAbs(p, g), y);
                      break;
                    case "h":
                      m.replaceItem(o.createSVGPathSegLinetoHorizontalAbs(p), y);
                      break;
                    case "v":
                      m.replaceItem(o.createSVGPathSegLinetoVerticalAbs(g), y);
                      break;
                    case "c":
                      m.replaceItem(o.createSVGPathSegCurvetoCubicAbs(p, g, h, f, d, u), y);
                      break;
                    case "s":
                      m.replaceItem(o.createSVGPathSegCurvetoCubicSmoothAbs(p, g, d, u), y);
                      break;
                    case "q":
                      m.replaceItem(o.createSVGPathSegCurvetoQuadraticAbs(p, g, h, f), y);
                      break;
                    case "t":
                      m.replaceItem(o.createSVGPathSegCurvetoQuadraticSmoothAbs(p, g), y);
                      break;
                    case "a":
                      m.replaceItem(o.createSVGPathSegArcAbs(p, g, v.r1, v.r2, v.angle, v.largeArcFlag, v.sweepFlag), y);
                      break;
                    case "z":
                    case "Z":
                      p = l, g = c;
                      break;
                  }
                (b == "M" || b == "m") && (l = p, c = g);
              }
            };
          })();
        },
        /* 30 */
        /***/
        function(e, i, r) {
          var s = {};
          e.exports = s;
          var a = r(6);
          r(0), function() {
            s.create = a.create, s.add = a.add, s.remove = a.remove, s.clear = a.clear, s.addComposite = a.addComposite, s.addBody = a.addBody, s.addConstraint = a.addConstraint;
          }();
        }
        /******/
      ])
    );
  });
})(jl);
var ne = jl.exports;
let Xe;
const fi = /* @__PURE__ */ new Map(), Gs = /* @__PURE__ */ new Map(), oa = /* @__PURE__ */ new Map();
let As = 0;
const Ku = () => {
  Xe = ne.Engine.create(), ne.Events.on(Xe, "collisionStart", (n) => {
    n.pairs.forEach((t) => {
      var l, c;
      const { bodyA: e, bodyB: i } = t, r = fi.get(e.label), s = fi.get(i.label);
      if (!r || !s) return;
      const a = [r, s].find((h) => h.surface), o = [r, s].find((h) => !h.surface);
      o && (a ? Gs.set(
        o.target.matterBody.label,
        Math.floor(Na(a).y1)
      ) : ((l = r.onCollision) == null || l.call(r, s.target), (c = s.onCollision) == null || c.call(s, r.target)));
    });
  }), ne.Events.on(Xe, "collisionEnd", (n) => {
    n.pairs.forEach((t) => {
      const { bodyA: e, bodyB: i } = t, r = fi.get(e.label), s = fi.get(i.label);
      if (!r || !s) return;
      const a = [r, s].find((l) => l.surface), o = [r, s].find((l) => !l.surface);
      o && a && Gs.delete(o.target.matterBody.label);
    });
  }), ne.Events.on(Xe, "afterUpdate", () => {
    oa.forEach((n) => {
      var i;
      if (!n.target.matterBody) return;
      const t = Na(n), e = (Gs.get(n.target.matterBody.label) ?? -1 / 0) >= Math.floor(t.y2);
      (i = n.onUpdatePosition) == null || i.call(n, t.x1, t.y1, e);
    });
  });
}, qu = (n) => {
  ne.Engine.update(Xe, n);
}, r_ = (n) => {
  if (n.rectangle)
    n.target.matterBody = ne.Bodies.rectangle(
      n.rectangle.x + n.rectangle.width / 2,
      n.rectangle.y + n.rectangle.height / 2,
      n.rectangle.width,
      n.rectangle.height,
      Wa(n)
    );
  else if (n.circle)
    n.target.matterBody = ne.Bodies.circle(
      n.circle.x,
      n.circle.y,
      n.circle.radius,
      Wa(n)
    );
  else
    throw new Error("No body specification provided");
  fi.set(n.target.matterBody.label, n), n.onUpdatePosition && oa.set(n.target.matterBody.label, n), ne.Composite.add(Xe.world, n.target.matterBody), n.movement && Qu(n.target, n.movement);
}, Zu = (n) => {
  n.matterBody && (ne.Composite.remove(Xe.world, n.matterBody), fi.delete(n.matterBody.label), Gs.delete(n.matterBody.label), oa.delete(n.matterBody.label));
}, Qu = (n, t) => {
  n.matterBody && t.linearMovement && ne.Body.setVelocity(n.matterBody, t.linearMovement.velocity);
}, a_ = (n, t, e) => {
  n.matterBody && ne.Body.setPosition(n.matterBody, {
    x: n.matterBody.position.x + t,
    y: n.matterBody.position.y + e
  });
}, Wa = (n) => {
  var t;
  return As++, n.surface ? {
    isStatic: !0,
    label: As.toString(),
    inertia: 1 / 0,
    inverseInertia: 0,
    restitution: 0
  } : (t = n.movement) != null && t.linearMovement ? {
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    inertia: 1 / 0,
    inverseInertia: 0,
    restitution: 0,
    label: As.toString()
  } : {
    isStatic: !0,
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 0,
    isSensor: !0,
    label: As.toString()
  };
}, Na = (n) => n.target.matterBody ? n.rectangle ? {
  x1: n.target.matterBody.position.x - n.rectangle.width / 2,
  y1: n.target.matterBody.position.y - n.rectangle.height / 2,
  x2: n.target.matterBody.position.x + n.rectangle.width / 2,
  y2: n.target.matterBody.position.y + n.rectangle.height / 2
} : n.circle ? {
  x1: n.target.matterBody.position.x - n.circle.radius,
  y1: n.target.matterBody.position.y - n.circle.radius,
  x2: n.target.matterBody.position.x + n.circle.radius,
  y2: n.target.matterBody.position.y + n.circle.radius
} : { x1: 0, y1: 0, x2: 0, y2: 0 } : { x1: 0, y1: 0, x2: 0, y2: 0 };
class xs {
  constructor(t, e) {
    te(this, "_props");
    te(this, "_object");
    te(this, "_parent", null);
    te(this, "_bindings", []);
    te(this, "_animations", []);
    this._props = e, this._object = t, (this.props.horizontalAlignment || this.props.verticalAlignment) && this.registerToSignal(W.signals.onResize, this.positionToScreen), this.onResize && this.registerToSignal(W.signals.onResize, this.onResize), this.onOrientationChange && this.registerToSignal(
      W.signals.onOrientationChange,
      this.onOrientationChange
    ), this.onTick && this.registerToSignal(W.signals.onTick, this.onTick), this.onClick && this.object.on("pointerdown", (i) => {
      i.stopImmediatePropagation(), this.onClick();
    }), this.onPointerUp && this.object.on("pointerup", (i) => {
      i.stopImmediatePropagation(), this.onPointerUp();
    }), this.onPointerEnter && this.object.on("pointerenter", () => {
      this.onPointerEnter();
    }), this.onPointerOut && this.object.on("pointerout", () => {
      this.onPointerOut();
    }), this.positionToScreen();
  }
  registerToSignal(t, e) {
    this._bindings.push(Fc(t, e.bind(this)));
  }
  unregisterFromSignal(t) {
    for (let e = 0; e < this._bindings.length; e++)
      this._bindings[e].name === t && (Ca(t, this._bindings[e].binding), this._bindings.splice(e, 1), e--);
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
    Zu(this), this._bindings.forEach(
      ({ name: t, binding: e }) => Ca(t, e)
    ), this._bindings = [], this.stopAnimations(), this.parent = null, this.object.destroy();
  }
  positionToScreen() {
    var t, e, i, r;
    this.props.horizontalAlignment === "center" ? this.x = X.screen.width / 2 + (((t = this.props.margin) == null ? void 0 : t.x) ?? 0) : this.props.horizontalAlignment === "right" && (this.x = X.screen.width + (((e = this.props.margin) == null ? void 0 : e.x) ?? 0)), this.props.verticalAlignment === "center" ? this.y = X.screen.height / 2 + (((i = this.props.margin) == null ? void 0 : i.y) ?? 0) : this.props.verticalAlignment === "bottom" && (this.y = X.screen.height + (((r = this.props.margin) == null ? void 0 : r.y) ?? 0));
  }
  async _createAnimation(t, e) {
    const i = new ki(e);
    this._animations.push(i), await i.start(t);
    const r = this._animations.indexOf(i);
    this._animations.splice(r, 1);
  }
}
var D = /* @__PURE__ */ ((n) => (n.Application = "application", n.WebGLPipes = "webgl-pipes", n.WebGLPipesAdaptor = "webgl-pipes-adaptor", n.WebGLSystem = "webgl-system", n.WebGPUPipes = "webgpu-pipes", n.WebGPUPipesAdaptor = "webgpu-pipes-adaptor", n.WebGPUSystem = "webgpu-system", n.CanvasSystem = "canvas-system", n.CanvasPipesAdaptor = "canvas-pipes-adaptor", n.CanvasPipes = "canvas-pipes", n.Asset = "asset", n.LoadParser = "load-parser", n.ResolveParser = "resolve-parser", n.CacheParser = "cache-parser", n.DetectionParser = "detection-parser", n.MaskEffect = "mask-effect", n.BlendMode = "blend-mode", n.TextureSource = "texture-source", n.Environment = "environment", n.ShapeBuilder = "shape-builder", n.Batcher = "batcher", n))(D || {});
const _r = (n) => {
  if (typeof n == "function" || typeof n == "object" && n.extension) {
    if (!n.extension)
      throw new Error("Extension class must have an extension object");
    n = { ...typeof n.extension != "object" ? { type: n.extension } : n.extension, ref: n };
  }
  if (typeof n == "object")
    n = { ...n };
  else
    throw new Error("Invalid extension type");
  return typeof n.type == "string" && (n.type = [n.type]), n;
}, Cs = (n, t) => _r(n).priority ?? t, Pt = {
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
  remove(...n) {
    return n.map(_r).forEach((t) => {
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
  add(...n) {
    return n.map(_r).forEach((t) => {
      t.type.forEach((e) => {
        var s, a;
        const i = this._addHandlers, r = this._queue;
        i[e] ? (a = i[e]) == null || a.call(i, t) : (r[e] = r[e] || [], (s = r[e]) == null || s.push(t));
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
  handle(n, t, e) {
    var a;
    const i = this._addHandlers, r = this._removeHandlers;
    if (i[n] || r[n])
      throw new Error(`Extension type ${n} already has a handler`);
    i[n] = t, r[n] = e;
    const s = this._queue;
    return s[n] && ((a = s[n]) == null || a.forEach((o) => t(o)), delete s[n]), this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns {extensions} For chaining.
   */
  handleByMap(n, t) {
    return this.handle(
      n,
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
  handleByNamedList(n, t, e = -1) {
    return this.handle(
      n,
      (i) => {
        t.findIndex((s) => s.name === i.name) >= 0 || (t.push({ name: i.name, value: i.ref }), t.sort((s, a) => Cs(a.value, e) - Cs(s.value, e)));
      },
      (i) => {
        const r = t.findIndex((s) => s.name === i.name);
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
  handleByList(n, t, e = -1) {
    return this.handle(
      n,
      (i) => {
        t.includes(i.ref) || (t.push(i.ref), t.sort((r, s) => Cs(s, e) - Cs(r, e)));
      },
      (i) => {
        const r = t.indexOf(i.ref);
        r !== -1 && t.splice(r, 1);
      }
    );
  }
}, Ju = {
  extension: {
    type: D.Environment,
    name: "browser",
    priority: -1
  },
  test: () => !0,
  load: async () => {
    await import("./browserAll-VLSZTgZD.js");
  }
}, tf = {
  extension: {
    type: D.Environment,
    name: "webworker",
    priority: 0
  },
  test: () => typeof self < "u" && self.WorkerGlobalScope !== void 0,
  load: async () => {
    await import("./webworkerAll-RkqKgEa5.js");
  }
};
class pt {
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
    return new pt(t ?? this._observer, this._x, this._y);
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
var Kl = { exports: {} };
(function(n) {
  var t = Object.prototype.hasOwnProperty, e = "~";
  function i() {
  }
  Object.create && (i.prototype = /* @__PURE__ */ Object.create(null), new i().__proto__ || (e = !1));
  function r(l, c, h) {
    this.fn = l, this.context = c, this.once = h || !1;
  }
  function s(l, c, h, f, d) {
    if (typeof h != "function")
      throw new TypeError("The listener must be a function");
    var u = new r(h, f || l, d), m = e ? e + c : c;
    return l._events[m] ? l._events[m].fn ? l._events[m] = [l._events[m], u] : l._events[m].push(u) : (l._events[m] = u, l._eventsCount++), l;
  }
  function a(l, c) {
    --l._eventsCount === 0 ? l._events = new i() : delete l._events[c];
  }
  function o() {
    this._events = new i(), this._eventsCount = 0;
  }
  o.prototype.eventNames = function() {
    var c = [], h, f;
    if (this._eventsCount === 0) return c;
    for (f in h = this._events)
      t.call(h, f) && c.push(e ? f.slice(1) : f);
    return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(h)) : c;
  }, o.prototype.listeners = function(c) {
    var h = e ? e + c : c, f = this._events[h];
    if (!f) return [];
    if (f.fn) return [f.fn];
    for (var d = 0, u = f.length, m = new Array(u); d < u; d++)
      m[d] = f[d].fn;
    return m;
  }, o.prototype.listenerCount = function(c) {
    var h = e ? e + c : c, f = this._events[h];
    return f ? f.fn ? 1 : f.length : 0;
  }, o.prototype.emit = function(c, h, f, d, u, m) {
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
      var b = g.length, _;
      for (v = 0; v < b; v++)
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
  }, o.prototype.on = function(c, h, f) {
    return s(this, c, h, f, !1);
  }, o.prototype.once = function(c, h, f) {
    return s(this, c, h, f, !0);
  }, o.prototype.removeListener = function(c, h, f, d) {
    var u = e ? e + c : c;
    if (!this._events[u]) return this;
    if (!h)
      return a(this, u), this;
    var m = this._events[u];
    if (m.fn)
      m.fn === h && (!d || m.once) && (!f || m.context === f) && a(this, u);
    else {
      for (var p = 0, g = [], x = m.length; p < x; p++)
        (m[p].fn !== h || d && !m[p].once || f && m[p].context !== f) && g.push(m[p]);
      g.length ? this._events[u] = g.length === 1 ? g[0] : g : a(this, u);
    }
    return this;
  }, o.prototype.removeAllListeners = function(c) {
    var h;
    return c ? (h = e ? e + c : c, this._events[h] && a(this, h)) : (this._events = new i(), this._eventsCount = 0), this;
  }, o.prototype.off = o.prototype.removeListener, o.prototype.addListener = o.prototype.on, o.prefixed = e, o.EventEmitter = o, n.exports = o;
})(Kl);
var ef = Kl.exports;
const Mt = /* @__PURE__ */ Nr(ef), sf = Math.PI * 2, nf = 180 / Math.PI, rf = Math.PI / 180;
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
    return Tn.x = 0, Tn.y = 0, Tn;
  }
}
const Tn = new St();
class H {
  /**
   * @param a - x scale
   * @param b - y skew
   * @param c - x skew
   * @param d - y scale
   * @param tx - x translation
   * @param ty - y translation
   */
  constructor(t = 1, e = 0, i = 0, r = 1, s = 0, a = 0) {
    this.array = null, this.a = t, this.b = e, this.c = i, this.d = r, this.tx = s, this.ty = a;
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
  set(t, e, i, r, s, a) {
    return this.a = t, this.b = e, this.c = i, this.d = r, this.tx = s, this.ty = a, this;
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
    const i = this.a, r = this.b, s = this.c, a = this.d, o = this.tx, l = this.ty, c = 1 / (i * a + s * -r), h = t.x, f = t.y;
    return e.x = a * c * h + -s * c * f + (l * s - o * a) * c, e.y = i * c * f + -r * c * h + (-l * i + o * r) * c, e;
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
    const e = Math.cos(t), i = Math.sin(t), r = this.a, s = this.c, a = this.tx;
    return this.a = r * e - this.b * i, this.b = r * i + this.b * e, this.c = s * e - this.d * i, this.d = s * i + this.d * e, this.tx = a * e - this.ty * i, this.ty = a * i + this.ty * e, this;
  }
  /**
   * Appends the given Matrix to this Matrix.
   * @param matrix - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  append(t) {
    const e = this.a, i = this.b, r = this.c, s = this.d;
    return this.a = t.a * e + t.b * r, this.b = t.a * i + t.b * s, this.c = t.c * e + t.d * r, this.d = t.c * i + t.d * s, this.tx = t.tx * e + t.ty * r + this.tx, this.ty = t.tx * i + t.ty * s + this.ty, this;
  }
  /**
   * Appends two matrix's and sets the result to this matrix. AB = A * B
   * @param a - The matrix to append.
   * @param b - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  appendFrom(t, e) {
    const i = t.a, r = t.b, s = t.c, a = t.d, o = t.tx, l = t.ty, c = e.a, h = e.b, f = e.c, d = e.d;
    return this.a = i * c + r * f, this.b = i * h + r * d, this.c = s * c + a * f, this.d = s * h + a * d, this.tx = o * c + l * f + e.tx, this.ty = o * h + l * d + e.ty, this;
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
  setTransform(t, e, i, r, s, a, o, l, c) {
    return this.a = Math.cos(o + c) * s, this.b = Math.sin(o + c) * s, this.c = -Math.sin(o - l) * a, this.d = Math.cos(o - l) * a, this.tx = t - (i * this.a + r * this.c), this.ty = e - (i * this.b + r * this.d), this;
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
    const e = this.a, i = this.b, r = this.c, s = this.d, a = t.pivot, o = -Math.atan2(-r, s), l = Math.atan2(i, e), c = Math.abs(o + l);
    return c < 1e-5 || Math.abs(sf - c) < 1e-5 ? (t.rotation = l, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = o, t.skew.y = l), t.scale.x = Math.sqrt(e * e + i * i), t.scale.y = Math.sqrt(r * r + s * s), t.position.x = this.tx + (a.x * e + a.y * r), t.position.y = this.ty + (a.x * i + a.y * s), t;
  }
  /**
   * Inverts this matrix
   * @returns This matrix. Good for chaining method calls.
   */
  invert() {
    const t = this.a, e = this.b, i = this.c, r = this.d, s = this.tx, a = t * r - e * i;
    return this.a = r / a, this.b = -e / a, this.c = -i / a, this.d = t / a, this.tx = (i * this.ty - r * s) / a, this.ty = -(t * this.ty - e * s) / a, this;
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
    return of.identity();
  }
  /**
   * A static Matrix that can be used to avoid creating new objects.
   * Will always ensure the matrix is reset to identity when requested.
   * Use this object for fast but temporary calculations, as it may be mutated later on.
   * This is a different object to the `IDENTITY` object and so can be modified without changing `IDENTITY`.
   * @readonly
   */
  static get shared() {
    return af.identity();
  }
}
const af = new H(), of = new H(), Ve = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], We = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], Ne = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], He = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], xr = [], ql = [], Ps = Math.sign;
function lf() {
  for (let n = 0; n < 16; n++) {
    const t = [];
    xr.push(t);
    for (let e = 0; e < 16; e++) {
      const i = Ps(Ve[n] * Ve[e] + Ne[n] * We[e]), r = Ps(We[n] * Ve[e] + He[n] * We[e]), s = Ps(Ve[n] * Ne[e] + Ne[n] * He[e]), a = Ps(We[n] * Ne[e] + He[n] * He[e]);
      for (let o = 0; o < 16; o++)
        if (Ve[o] === i && We[o] === r && Ne[o] === s && He[o] === a) {
          t.push(o);
          break;
        }
    }
  }
  for (let n = 0; n < 16; n++) {
    const t = new H();
    t.set(Ve[n], We[n], Ne[n], He[n], 0, 0), ql.push(t);
  }
}
lf();
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
  uX: (n) => Ve[n],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: (n) => We[n],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: (n) => Ne[n],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: (n) => He[n],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotation - symmetry whose opposite
   *   is needed. Only rotations have opposite symmetries while
   *   reflections don't.
   * @returns {GD8Symmetry} The opposite symmetry of `rotation`
   */
  inv: (n) => n & 8 ? n & 15 : -n & 7,
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
  add: (n, t) => xr[n][t],
  /**
   * Reverse of `add`.
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation
   * @param {GD8Symmetry} rotationFirst - First operation
   * @returns {GD8Symmetry} Result
   */
  sub: (n, t) => xr[n][et.inv(t)],
  /**
   * Adds 180 degrees to rotation, which is a commutative
   * operation.
   * @memberof maths.groupD8
   * @param {number} rotation - The number to rotate.
   * @returns {number} Rotated number
   */
  rotate180: (n) => n ^ 4,
  /**
   * Checks if the rotation angle is vertical, i.e. south
   * or north. It doesn't work for reflections.
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotation - The number to check.
   * @returns {boolean} Whether or not the direction is vertical
   */
  isVertical: (n) => (n & 3) === 2,
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
  byDirection: (n, t) => Math.abs(n) * 2 <= Math.abs(t) ? t >= 0 ? et.S : et.N : Math.abs(t) * 2 <= Math.abs(n) ? n > 0 ? et.E : et.W : t > 0 ? n > 0 ? et.SE : et.SW : n > 0 ? et.NE : et.NW,
  /**
   * Helps sprite to compensate texture packer rotation.
   * @memberof maths.groupD8
   * @param {Matrix} matrix - sprite world matrix
   * @param {GD8Symmetry} rotation - The rotation factor to use.
   * @param {number} tx - sprite anchoring
   * @param {number} ty - sprite anchoring
   */
  matrixAppendRotationInv: (n, t, e = 0, i = 0) => {
    const r = ql[et.inv(t)];
    r.tx = e, r.ty = i, n.append(r);
  }
}, Ms = [new St(), new St(), new St(), new St()];
class mt {
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
    return new mt(0, 0, 0, 0);
  }
  /**
   * Creates a clone of this Rectangle
   * @returns a copy of the rectangle
   */
  clone() {
    return new mt(this.x, this.y, this.width, this.height);
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
    const { width: r, height: s } = this;
    if (r <= 0 || s <= 0)
      return !1;
    const a = this.x, o = this.y, l = a - i / 2, c = a + r + i / 2, h = o - i / 2, f = o + s + i / 2, d = a + i / 2, u = a + r - i / 2, m = o + i / 2, p = o + s - i / 2;
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
      const w = this.x < t.x ? t.x : this.x;
      if ((this.right > t.right ? t.right : this.right) <= w)
        return !1;
      const P = this.y < t.y ? t.y : this.y;
      return (this.bottom > t.bottom ? t.bottom : this.bottom) > P;
    }
    const i = this.left, r = this.right, s = this.top, a = this.bottom;
    if (r <= i || a <= s)
      return !1;
    const o = Ms[0].set(t.left, t.top), l = Ms[1].set(t.left, t.bottom), c = Ms[2].set(t.right, t.top), h = Ms[3].set(t.right, t.bottom);
    if (c.x <= o.x || l.y <= o.y)
      return !1;
    const f = Math.sign(e.a * e.d - e.b * e.c);
    if (f === 0 || (e.apply(o, o), e.apply(l, l), e.apply(c, c), e.apply(h, h), Math.max(o.x, l.x, c.x, h.x) <= i || Math.min(o.x, l.x, c.x, h.x) >= r || Math.max(o.y, l.y, c.y, h.y) <= s || Math.min(o.y, l.y, c.y, h.y) >= a))
      return !1;
    const d = f * (l.y - o.y), u = f * (o.x - l.x), m = d * i + u * s, p = d * r + u * s, g = d * i + u * a, x = d * r + u * a;
    if (Math.max(m, p, g, x) <= d * o.x + u * o.y || Math.min(m, p, g, x) >= d * h.x + u * h.y)
      return !1;
    const y = f * (o.y - c.y), v = f * (c.x - o.x), b = y * i + v * s, _ = y * r + v * s, S = y * i + v * a, C = y * r + v * a;
    return !(Math.max(b, _, S, C) <= y * o.x + v * o.y || Math.min(b, _, S, C) >= y * h.x + v * h.y);
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
    const e = Math.max(this.x, t.x), i = Math.min(this.x + this.width, t.x + t.width), r = Math.max(this.y, t.y), s = Math.min(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = Math.max(i - e, 0), this.y = r, this.height = Math.max(s - r, 0), this;
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
    const e = Math.min(this.x, t.x), i = Math.max(this.x + this.width, t.x + t.width), r = Math.min(this.y, t.y), s = Math.max(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = i - e, this.y = r, this.height = s - r, this;
  }
  /**
   * Returns the framing rectangle of the rectangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new mt(), t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
  }
}
const kn = {
  default: -1
};
function gt(n = "default") {
  return kn[n] === void 0 && (kn[n] = -1), ++kn[n];
}
const Ha = {}, Y = "8.0.0", hf = "8.3.4";
function $(n, t, e = 3) {
  if (Ha[t])
    return;
  let i = new Error().stack;
  typeof i > "u" ? console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${n}`) : (i = i.split(`
`).splice(e).join(`
`), console.groupCollapsed ? (console.groupCollapsed(
    "%cPixiJS Deprecation Warning: %c%s",
    "color:#614108;background:#fffbe6",
    "font-weight:normal;color:#614108;background:#fffbe6",
    `${t}
Deprecated since v${n}`
  ), console.warn(i), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${n}`), console.warn(i))), Ha[t] = !0;
}
const Zl = () => {
};
function $a(n) {
  return n += n === 0 ? 1 : 0, --n, n |= n >>> 1, n |= n >>> 2, n |= n >>> 4, n |= n >>> 8, n |= n >>> 16, n + 1;
}
function Ya(n) {
  return !(n & n - 1) && !!n;
}
function cf(n) {
  const t = {};
  for (const e in n)
    n[e] !== void 0 && (t[e] = n[e]);
  return t;
}
const Xa = /* @__PURE__ */ Object.create(null);
function uf(n) {
  const t = Xa[n];
  return t === void 0 && (Xa[n] = gt("resource")), t;
}
const Ql = class Jl extends Mt {
  /**
   * @param options - options for the style
   */
  constructor(t = {}) {
    super(), this._resourceType = "textureSampler", this._touched = 0, this._maxAnisotropy = 1, this.destroyed = !1, t = { ...Jl.defaultOptions, ...t }, this.addressMode = t.addressMode, this.addressModeU = t.addressModeU ?? this.addressModeU, this.addressModeV = t.addressModeV ?? this.addressModeV, this.addressModeW = t.addressModeW ?? this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = t.magFilter ?? this.magFilter, this.minFilter = t.minFilter ?? this.minFilter, this.mipmapFilter = t.mipmapFilter ?? this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = t.maxAnisotropy ?? 1;
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
    return this._sharedResourceId = uf(t), this._resourceId;
  }
  /** Destroys the style */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners();
  }
};
Ql.defaultOptions = {
  addressMode: "clamp-to-edge",
  scaleMode: "linear"
};
let ff = Ql;
const th = class eh extends Mt {
  /**
   * @param options - options for creating a new TextureSource
   */
  constructor(t = {}) {
    super(), this.options = t, this.uid = gt("textureSource"), this._resourceType = "textureSource", this._resourceId = gt("resource"), this.uploadMethodId = "unknown", this._resolution = 1, this.pixelWidth = 1, this.pixelHeight = 1, this.width = 1, this.height = 1, this.sampleCount = 1, this.mipLevelCount = 1, this.autoGenerateMipmaps = !1, this.format = "rgba8unorm", this.dimension = "2d", this.antialias = !1, this._touched = 0, this._batchTick = -1, this._textureBindLocation = -1, t = { ...eh.defaultOptions, ...t }, this.label = t.label ?? "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, t.width ? this.pixelWidth = t.width * this._resolution : this.pixelWidth = this.resource ? this.resourceWidth ?? 1 : 1, t.height ? this.pixelHeight = t.height * this._resolution : this.pixelHeight = this.resource ? this.resourceHeight ?? 1 : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = t.dimensions, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = t.antialias, this.alphaMode = t.alphaMode, this.style = new ff(cf(t)), this.destroyed = !1, this._refreshPOT();
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
    const r = Math.round(t * i), s = Math.round(e * i);
    return this.width = r / i, this.height = s / i, this._resolution = i, this.pixelWidth === r && this.pixelHeight === s ? !1 : (this._refreshPOT(), this.pixelWidth = r, this.pixelHeight = s, this.emit("resize", this), this._resourceId = gt("resource"), this.emit("change", this), !0);
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
    this.isPowerOfTwo = Ya(this.pixelWidth) && Ya(this.pixelHeight);
  }
  static test(t) {
    throw new Error("Unimplemented");
  }
};
th.defaultOptions = {
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
let Pe = th;
class la extends Pe {
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
la.extension = D.TextureSource;
const ja = new H();
class df {
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
      const s = t[r], a = t[r + 1];
      e[r] = s * i.a + a * i.c + i.tx, e[r + 1] = s * i.b + a * i.d + i.ty;
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
    r && (ja.set(
      i.width / r.width,
      0,
      0,
      i.height / r.height,
      -r.x / r.width,
      -r.y / r.height
    ), this.mapCoord.append(ja));
    const s = t.source, a = this.uClampFrame, o = this.clampMargin / s._resolution, l = this.clampOffset / s._resolution;
    return a[0] = (t.frame.x + o + l) / s.width, a[1] = (t.frame.y + o + l) / s.height, a[2] = (t.frame.x + t.frame.width - o + l) / s.width, a[3] = (t.frame.y + t.frame.height - o + l) / s.height, this.uClampOffset[0] = this.clampOffset / s.pixelWidth, this.uClampOffset[1] = this.clampOffset / s.pixelHeight, this.isSimple = t.frame.width === s.width && t.frame.height === s.height && t.rotate === 0, !0;
  }
}
class V extends Mt {
  /**
   * @param {rendering.TextureOptions} options - Options for the texture
   */
  constructor({
    source: t,
    label: e,
    frame: i,
    orig: r,
    trim: s,
    defaultAnchor: a,
    defaultBorders: o,
    rotate: l,
    dynamic: c
  } = {}) {
    if (super(), this.uid = gt("texture"), this.uvs = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 }, this.frame = new mt(), this.noFrame = !1, this.dynamic = !1, this.isTexture = !0, this.label = e, this.source = (t == null ? void 0 : t.source) ?? new Pe(), this.noFrame = !i, i)
      this.frame.copyFrom(i);
    else {
      const { width: h, height: f } = this._source;
      this.frame.width = h, this.frame.height = f;
    }
    this.orig = r || this.frame, this.trim = s, this.rotate = l ?? 0, this.defaultAnchor = a, this.defaultBorders = o, this.destroyed = !1, this.dynamic = c || !1, this.updateUvs();
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
    return this._textureMatrix || (this._textureMatrix = new df(this)), this._textureMatrix;
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
    const { uvs: t, frame: e } = this, { width: i, height: r } = this._source, s = e.x / i, a = e.y / r, o = e.width / i, l = e.height / r;
    let c = this.rotate;
    if (c) {
      const h = o / 2, f = l / 2, d = s + h, u = a + f;
      c = et.add(c, et.NW), t.x0 = d + h * et.uX(c), t.y0 = u + f * et.uY(c), c = et.add(c, 2), t.x1 = d + h * et.uX(c), t.y1 = u + f * et.uY(c), c = et.add(c, 2), t.x2 = d + h * et.uX(c), t.y2 = u + f * et.uY(c), c = et.add(c, 2), t.x3 = d + h * et.uX(c), t.y3 = u + f * et.uY(c);
    } else
      t.x0 = s, t.y0 = a, t.x1 = s + o, t.y1 = a, t.x2 = s + o, t.y2 = a + l, t.x3 = s, t.y3 = a + l;
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
V.EMPTY = new V({
  label: "EMPTY",
  source: new Pe({
    label: "EMPTY"
  })
});
V.EMPTY.destroy = Zl;
V.WHITE = new V({
  source: new la({
    resource: new Uint8Array([255, 255, 255, 255]),
    width: 1,
    height: 1,
    alphaMode: "premultiply-alpha-on-upload",
    label: "WHITE"
  }),
  label: "WHITE"
});
V.WHITE.destroy = Zl;
function pf(n, t, e, i) {
  const { width: r, height: s } = e.orig, a = e.trim;
  if (a) {
    const o = a.width, l = a.height;
    n.minX = a.x - t._x * r - i, n.maxX = n.minX + o, n.minY = a.y - t._y * s - i, n.maxY = n.minY + l;
  } else
    n.minX = -t._x * r - i, n.maxX = n.minX + r, n.minY = -t._y * s - i, n.maxY = n.minY + s;
}
const Ka = new H();
class ge {
  constructor(t = 1 / 0, e = 1 / 0, i = -1 / 0, r = -1 / 0) {
    this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = Ka, this.minX = t, this.minY = e, this.maxX = i, this.maxY = r;
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
    this._rectangle || (this._rectangle = new mt());
    const t = this._rectangle;
    return this.minX > this.maxX || this.minY > this.maxY ? (t.x = 0, t.y = 0, t.width = 0, t.height = 0) : t.copyFromBounds(this), t;
  }
  /** Clears the bounds and resets. */
  clear() {
    return this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = Ka, this;
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
  addFrame(t, e, i, r, s) {
    s || (s = this.matrix);
    const a = s.a, o = s.b, l = s.c, c = s.d, h = s.tx, f = s.ty;
    let d = this.minX, u = this.minY, m = this.maxX, p = this.maxY, g = a * t + l * e + h, x = o * t + c * e + f;
    g < d && (d = g), x < u && (u = x), g > m && (m = g), x > p && (p = x), g = a * i + l * e + h, x = o * i + c * e + f, g < d && (d = g), x < u && (u = x), g > m && (m = g), x > p && (p = x), g = a * t + l * r + h, x = o * t + c * r + f, g < d && (d = g), x < u && (u = x), g > m && (m = g), x > p && (p = x), g = a * i + l * r + h, x = o * i + c * r + f, g < d && (d = g), x < u && (u = x), g > m && (m = g), x > p && (p = x), this.minX = d, this.minY = u, this.maxX = m, this.maxY = p;
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
    const e = this.minX, i = this.minY, r = this.maxX, s = this.maxY, { a, b: o, c: l, d: c, tx: h, ty: f } = t;
    let d = a * e + l * i + h, u = o * e + c * i + f;
    this.minX = d, this.minY = u, this.maxX = d, this.maxY = u, d = a * r + l * i + h, u = o * r + c * i + f, this.minX = d < this.minX ? d : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = u > this.maxY ? u : this.maxY, d = a * e + l * s + h, u = o * e + c * s + f, this.minX = d < this.minX ? d : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = u > this.maxY ? u : this.maxY, d = a * r + l * s + h, u = o * r + c * s + f, this.minX = d < this.minX ? d : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = d > this.maxX ? d : this.maxX, this.maxY = u > this.maxY ? u : this.maxY;
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
    return new ge(this.minX, this.minY, this.maxX, this.maxY);
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
    let s = this.minX, a = this.minY, o = this.maxX, l = this.maxY;
    r || (r = this.matrix);
    const c = r.a, h = r.b, f = r.c, d = r.d, u = r.tx, m = r.ty;
    for (let p = e; p < i; p += 2) {
      const g = t[p], x = t[p + 1], y = c * g + f * x + u, v = h * g + d * x + m;
      s = y < s ? y : s, a = v < a ? v : a, o = y > o ? y : o, l = v > l ? v : l;
    }
    this.minX = s, this.minY = a, this.maxX = o, this.maxY = l;
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
var mf = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) }, xe = function(n) {
  return typeof n == "string" ? n.length > 0 : typeof n == "number";
}, xt = function(n, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = Math.pow(10, t)), Math.round(e * n) / e + 0;
}, Kt = function(n, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = 1), n > e ? e : n > t ? n : t;
}, ih = function(n) {
  return (n = isFinite(n) ? n % 360 : 0) > 0 ? n : n + 360;
}, qa = function(n) {
  return { r: Kt(n.r, 0, 255), g: Kt(n.g, 0, 255), b: Kt(n.b, 0, 255), a: Kt(n.a) };
}, En = function(n) {
  return { r: xt(n.r), g: xt(n.g), b: xt(n.b), a: xt(n.a, 3) };
}, gf = /^#([0-9a-f]{3,8})$/i, Ts = function(n) {
  var t = n.toString(16);
  return t.length < 2 ? "0" + t : t;
}, sh = function(n) {
  var t = n.r, e = n.g, i = n.b, r = n.a, s = Math.max(t, e, i), a = s - Math.min(t, e, i), o = a ? s === t ? (e - i) / a : s === e ? 2 + (i - t) / a : 4 + (t - e) / a : 0;
  return { h: 60 * (o < 0 ? o + 6 : o), s: s ? a / s * 100 : 0, v: s / 255 * 100, a: r };
}, nh = function(n) {
  var t = n.h, e = n.s, i = n.v, r = n.a;
  t = t / 360 * 6, e /= 100, i /= 100;
  var s = Math.floor(t), a = i * (1 - e), o = i * (1 - (t - s) * e), l = i * (1 - (1 - t + s) * e), c = s % 6;
  return { r: 255 * [i, o, a, a, l, i][c], g: 255 * [l, i, i, o, a, a][c], b: 255 * [a, a, l, i, i, o][c], a: r };
}, Za = function(n) {
  return { h: ih(n.h), s: Kt(n.s, 0, 100), l: Kt(n.l, 0, 100), a: Kt(n.a) };
}, Qa = function(n) {
  return { h: xt(n.h), s: xt(n.s), l: xt(n.l), a: xt(n.a, 3) };
}, Ja = function(n) {
  return nh((e = (t = n).s, { h: t.h, s: (e *= ((i = t.l) < 50 ? i : 100 - i) / 100) > 0 ? 2 * e / (i + e) * 100 : 0, v: i + e, a: t.a }));
  var t, e, i;
}, Zi = function(n) {
  return { h: (t = sh(n)).h, s: (r = (200 - (e = t.s)) * (i = t.v) / 100) > 0 && r < 200 ? e * i / 100 / (r <= 100 ? r : 200 - r) * 100 : 0, l: r / 2, a: t.a };
  var t, e, i, r;
}, _f = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, xf = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, yf = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, vf = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, yr = { string: [[function(n) {
  var t = gf.exec(n);
  return t ? (n = t[1]).length <= 4 ? { r: parseInt(n[0] + n[0], 16), g: parseInt(n[1] + n[1], 16), b: parseInt(n[2] + n[2], 16), a: n.length === 4 ? xt(parseInt(n[3] + n[3], 16) / 255, 2) : 1 } : n.length === 6 || n.length === 8 ? { r: parseInt(n.substr(0, 2), 16), g: parseInt(n.substr(2, 2), 16), b: parseInt(n.substr(4, 2), 16), a: n.length === 8 ? xt(parseInt(n.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(n) {
  var t = yf.exec(n) || vf.exec(n);
  return t ? t[2] !== t[4] || t[4] !== t[6] ? null : qa({ r: Number(t[1]) / (t[2] ? 100 / 255 : 1), g: Number(t[3]) / (t[4] ? 100 / 255 : 1), b: Number(t[5]) / (t[6] ? 100 / 255 : 1), a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1) }) : null;
}, "rgb"], [function(n) {
  var t = _f.exec(n) || xf.exec(n);
  if (!t) return null;
  var e, i, r = Za({ h: (e = t[1], i = t[2], i === void 0 && (i = "deg"), Number(e) * (mf[i] || 1)), s: Number(t[3]), l: Number(t[4]), a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1) });
  return Ja(r);
}, "hsl"]], object: [[function(n) {
  var t = n.r, e = n.g, i = n.b, r = n.a, s = r === void 0 ? 1 : r;
  return xe(t) && xe(e) && xe(i) ? qa({ r: Number(t), g: Number(e), b: Number(i), a: Number(s) }) : null;
}, "rgb"], [function(n) {
  var t = n.h, e = n.s, i = n.l, r = n.a, s = r === void 0 ? 1 : r;
  if (!xe(t) || !xe(e) || !xe(i)) return null;
  var a = Za({ h: Number(t), s: Number(e), l: Number(i), a: Number(s) });
  return Ja(a);
}, "hsl"], [function(n) {
  var t = n.h, e = n.s, i = n.v, r = n.a, s = r === void 0 ? 1 : r;
  if (!xe(t) || !xe(e) || !xe(i)) return null;
  var a = function(o) {
    return { h: ih(o.h), s: Kt(o.s, 0, 100), v: Kt(o.v, 0, 100), a: Kt(o.a) };
  }({ h: Number(t), s: Number(e), v: Number(i), a: Number(s) });
  return nh(a);
}, "hsv"]] }, to = function(n, t) {
  for (var e = 0; e < t.length; e++) {
    var i = t[e][0](n);
    if (i) return [i, t[e][1]];
  }
  return [null, void 0];
}, wf = function(n) {
  return typeof n == "string" ? to(n.trim(), yr.string) : typeof n == "object" && n !== null ? to(n, yr.object) : [null, void 0];
}, In = function(n, t) {
  var e = Zi(n);
  return { h: e.h, s: Kt(e.s + 100 * t, 0, 100), l: e.l, a: e.a };
}, Bn = function(n) {
  return (299 * n.r + 587 * n.g + 114 * n.b) / 1e3 / 255;
}, eo = function(n, t) {
  var e = Zi(n);
  return { h: e.h, s: e.s, l: Kt(e.l + 100 * t, 0, 100), a: e.a };
}, vr = function() {
  function n(t) {
    this.parsed = wf(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return n.prototype.isValid = function() {
    return this.parsed !== null;
  }, n.prototype.brightness = function() {
    return xt(Bn(this.rgba), 2);
  }, n.prototype.isDark = function() {
    return Bn(this.rgba) < 0.5;
  }, n.prototype.isLight = function() {
    return Bn(this.rgba) >= 0.5;
  }, n.prototype.toHex = function() {
    return t = En(this.rgba), e = t.r, i = t.g, r = t.b, a = (s = t.a) < 1 ? Ts(xt(255 * s)) : "", "#" + Ts(e) + Ts(i) + Ts(r) + a;
    var t, e, i, r, s, a;
  }, n.prototype.toRgb = function() {
    return En(this.rgba);
  }, n.prototype.toRgbString = function() {
    return t = En(this.rgba), e = t.r, i = t.g, r = t.b, (s = t.a) < 1 ? "rgba(" + e + ", " + i + ", " + r + ", " + s + ")" : "rgb(" + e + ", " + i + ", " + r + ")";
    var t, e, i, r, s;
  }, n.prototype.toHsl = function() {
    return Qa(Zi(this.rgba));
  }, n.prototype.toHslString = function() {
    return t = Qa(Zi(this.rgba)), e = t.h, i = t.s, r = t.l, (s = t.a) < 1 ? "hsla(" + e + ", " + i + "%, " + r + "%, " + s + ")" : "hsl(" + e + ", " + i + "%, " + r + "%)";
    var t, e, i, r, s;
  }, n.prototype.toHsv = function() {
    return t = sh(this.rgba), { h: xt(t.h), s: xt(t.s), v: xt(t.v), a: xt(t.a, 3) };
    var t;
  }, n.prototype.invert = function() {
    return le({ r: 255 - (t = this.rgba).r, g: 255 - t.g, b: 255 - t.b, a: t.a });
    var t;
  }, n.prototype.saturate = function(t) {
    return t === void 0 && (t = 0.1), le(In(this.rgba, t));
  }, n.prototype.desaturate = function(t) {
    return t === void 0 && (t = 0.1), le(In(this.rgba, -t));
  }, n.prototype.grayscale = function() {
    return le(In(this.rgba, -1));
  }, n.prototype.lighten = function(t) {
    return t === void 0 && (t = 0.1), le(eo(this.rgba, t));
  }, n.prototype.darken = function(t) {
    return t === void 0 && (t = 0.1), le(eo(this.rgba, -t));
  }, n.prototype.rotate = function(t) {
    return t === void 0 && (t = 15), this.hue(this.hue() + t);
  }, n.prototype.alpha = function(t) {
    return typeof t == "number" ? le({ r: (e = this.rgba).r, g: e.g, b: e.b, a: t }) : xt(this.rgba.a, 3);
    var e;
  }, n.prototype.hue = function(t) {
    var e = Zi(this.rgba);
    return typeof t == "number" ? le({ h: t, s: e.s, l: e.l, a: e.a }) : xt(e.h);
  }, n.prototype.isEqual = function(t) {
    return this.toHex() === le(t).toHex();
  }, n;
}(), le = function(n) {
  return n instanceof vr ? n : new vr(n);
}, io = [], bf = function(n) {
  n.forEach(function(t) {
    io.indexOf(t) < 0 && (t(vr, yr), io.push(t));
  });
};
function Sf(n, t) {
  var e = { white: "#ffffff", bisque: "#ffe4c4", blue: "#0000ff", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", antiquewhite: "#faebd7", aqua: "#00ffff", azure: "#f0ffff", whitesmoke: "#f5f5f5", papayawhip: "#ffefd5", plum: "#dda0dd", blanchedalmond: "#ffebcd", black: "#000000", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", cornsilk: "#fff8dc", cornflowerblue: "#6495ed", burlywood: "#deb887", aquamarine: "#7fffd4", beige: "#f5f5dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkkhaki: "#bdb76b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", peachpuff: "#ffdab9", darkmagenta: "#8b008b", darkred: "#8b0000", darkorchid: "#9932cc", darkorange: "#ff8c00", darkslateblue: "#483d8b", gray: "#808080", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", deeppink: "#ff1493", deepskyblue: "#00bfff", wheat: "#f5deb3", firebrick: "#b22222", floralwhite: "#fffaf0", ghostwhite: "#f8f8ff", darkviolet: "#9400d3", magenta: "#ff00ff", green: "#008000", dodgerblue: "#1e90ff", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", blueviolet: "#8a2be2", forestgreen: "#228b22", lawngreen: "#7cfc00", indianred: "#cd5c5c", indigo: "#4b0082", fuchsia: "#ff00ff", brown: "#a52a2a", maroon: "#800000", mediumblue: "#0000cd", lightcoral: "#f08080", darkturquoise: "#00ced1", lightcyan: "#e0ffff", ivory: "#fffff0", lightyellow: "#ffffe0", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", linen: "#faf0e6", mediumaquamarine: "#66cdaa", lemonchiffon: "#fffacd", lime: "#00ff00", khaki: "#f0e68c", mediumseagreen: "#3cb371", limegreen: "#32cd32", mediumspringgreen: "#00fa9a", lightskyblue: "#87cefa", lightblue: "#add8e6", midnightblue: "#191970", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", mintcream: "#f5fffa", lightslategray: "#778899", lightslategrey: "#778899", navajowhite: "#ffdead", navy: "#000080", mediumvioletred: "#c71585", powderblue: "#b0e0e6", palegoldenrod: "#eee8aa", oldlace: "#fdf5e6", paleturquoise: "#afeeee", mediumturquoise: "#48d1cc", mediumorchid: "#ba55d3", rebeccapurple: "#663399", lightsteelblue: "#b0c4de", mediumslateblue: "#7b68ee", thistle: "#d8bfd8", tan: "#d2b48c", orchid: "#da70d6", mediumpurple: "#9370db", purple: "#800080", pink: "#ffc0cb", skyblue: "#87ceeb", springgreen: "#00ff7f", palegreen: "#98fb98", red: "#ff0000", yellow: "#ffff00", slateblue: "#6a5acd", lavenderblush: "#fff0f5", peru: "#cd853f", palevioletred: "#db7093", violet: "#ee82ee", teal: "#008080", slategray: "#708090", slategrey: "#708090", aliceblue: "#f0f8ff", darkseagreen: "#8fbc8f", darkolivegreen: "#556b2f", greenyellow: "#adff2f", seagreen: "#2e8b57", seashell: "#fff5ee", tomato: "#ff6347", silver: "#c0c0c0", sienna: "#a0522d", lavender: "#e6e6fa", lightgreen: "#90ee90", orange: "#ffa500", orangered: "#ff4500", steelblue: "#4682b4", royalblue: "#4169e1", turquoise: "#40e0d0", yellowgreen: "#9acd32", salmon: "#fa8072", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", darksalmon: "#e9967a", lightgoldenrodyellow: "#fafad2", snow: "#fffafa", lightgrey: "#d3d3d3", lightgray: "#d3d3d3", dimgray: "#696969", dimgrey: "#696969", olivedrab: "#6b8e23", olive: "#808000" }, i = {};
  for (var r in e) i[e[r]] = r;
  var s = {};
  n.prototype.toName = function(a) {
    if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
    var o, l, c = i[this.toHex()];
    if (c) return c;
    if (a != null && a.closest) {
      var h = this.toRgb(), f = 1 / 0, d = "black";
      if (!s.length) for (var u in e) s[u] = new n(e[u]).toRgb();
      for (var m in e) {
        var p = (o = h, l = s[m], Math.pow(o.r - l.r, 2) + Math.pow(o.g - l.g, 2) + Math.pow(o.b - l.b, 2));
        p < f && (f = p, d = m);
      }
      return d;
    }
  }, t.string.push([function(a) {
    var o = a.toLowerCase(), l = o === "transparent" ? "#0000" : e[o];
    return l ? new n(l).toRgb() : null;
  }, "name"]);
}
bf([Sf]);
const Ai = class $i {
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
    if (t instanceof $i)
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
      return t.length !== e.length ? !1 : t.every((s, a) => s === e[a]);
    if (t !== null && e !== null) {
      const s = Object.keys(t), a = Object.keys(e);
      return s.length !== a.length ? !1 : s.every((o) => t[o] === e[o]);
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
    const [e, i, r, s] = this._components;
    return t[0] = e, t[1] = i, t[2] = r, t[3] = s, t;
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
    const [e, i, r, s] = $i._temp.setValue(t)._components;
    return this._components[0] *= e, this._components[1] *= i, this._components[2] *= r, this._components[3] *= s, this._refreshInt(), this._value = null, this;
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
    let i = this._int >> 16 & 255, r = this._int >> 8 & 255, s = this._int & 255;
    return e && (i = i * t + 0.5 | 0, r = r * t + 0.5 | 0, s = s * t + 0.5 | 0), (t * 255 << 24) + (i << 16) + (r << 8) + s;
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
    let e, i, r, s;
    if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
      const a = t;
      e = (a >> 16 & 255) / 255, i = (a >> 8 & 255) / 255, r = (a & 255) / 255, s = 1;
    } else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t), [e, i, r, s = 1] = t;
    else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t, 0, 255), [e, i, r, s = 255] = t, e /= 255, i /= 255, r /= 255, s /= 255;
    else if (typeof t == "string" || typeof t == "object") {
      if (typeof t == "string") {
        const o = $i.HEX_PATTERN.exec(t);
        o && (t = `#${o[2]}`);
      }
      const a = le(t);
      a.isValid() && ({ r: e, g: i, b: r, a: s } = a.rgba, e /= 255, i /= 255, r /= 255);
    }
    if (e !== void 0)
      this._components[0] = e, this._components[1] = i, this._components[2] = r, this._components[3] = s, this._refreshInt();
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
    return typeof t == "number" ? Math.min(Math.max(t, e), i) : (t.forEach((r, s) => {
      t[s] = Math.min(Math.max(r, e), i);
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
    return typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof $i || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0;
  }
};
Ai.shared = new Ai();
Ai._temp = new Ai();
Ai.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
let ft = Ai;
const Af = {
  cullArea: null,
  cullable: !1,
  cullableChildren: !0
};
class ha {
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
class Cf {
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
    return this._poolsByClass.has(t) || this._poolsByClass.set(t, new ha(t)), this._poolsByClass.get(t);
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
const be = new Cf();
function Pf(n, t, e) {
  const i = n.length;
  let r;
  if (t >= i || e === 0)
    return;
  e = t + e > i ? i - t : e;
  const s = i - e;
  for (r = t; r < s; ++r)
    n[r] = n[r + e];
  n.length = s;
}
const Mf = {
  allowChildren: !0,
  /**
   * Removes all children from this container that are within the begin and end indexes.
   * @param beginIndex - The beginning position.
   * @param endIndex - The ending position. Default value is size of the container.
   * @returns - List of removed children
   * @memberof scene.Container#
   */
  removeChildren(n = 0, t) {
    const e = t ?? this.children.length, i = e - n, r = [];
    if (i > 0 && i <= e) {
      for (let a = e - 1; a >= n; a--) {
        const o = this.children[a];
        o && (r.push(o), o.parent = null);
      }
      Pf(this.children, n, e);
      const s = this.renderGroup || this.parentRenderGroup;
      s && s.removeChildren(r);
      for (let a = 0; a < r.length; ++a)
        this.emit("childRemoved", r[a], this, a), r[a].emit("removed", this);
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
  removeChildAt(n) {
    const t = this.getChildAt(n);
    return this.removeChild(t);
  },
  /**
   * Returns the child at the specified index
   * @param index - The index to get the child at
   * @returns - The child at the given index, if any.
   * @memberof scene.Container#
   */
  getChildAt(n) {
    if (n < 0 || n >= this.children.length)
      throw new Error(`getChildAt: Index (${n}) does not exist.`);
    return this.children[n];
  },
  /**
   * Changes the position of an existing child in the container container
   * @param child - The child Container instance for which you want to change the index number
   * @param index - The resulting index number for the child container
   * @memberof scene.Container#
   */
  setChildIndex(n, t) {
    if (t < 0 || t >= this.children.length)
      throw new Error(`The index ${t} supplied is out of bounds ${this.children.length}`);
    this.getChildIndex(n), this.addChildAt(n, t);
  },
  /**
   * Returns the index position of a child Container instance
   * @param child - The Container instance to identify
   * @returns - The index position of the child container to identify
   * @memberof scene.Container#
   */
  getChildIndex(n) {
    const t = this.children.indexOf(n);
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
  addChildAt(n, t) {
    this.allowChildren || $(Y, "addChildAt: Only Containers will be allowed to add children in v8.0.0");
    const { children: e } = this;
    if (t < 0 || t > e.length)
      throw new Error(`${n}addChildAt: The index ${t} supplied is out of bounds ${e.length}`);
    if (n.parent) {
      const r = n.parent.children.indexOf(n);
      if (n.parent === this && r === t)
        return n;
      r !== -1 && n.parent.children.splice(r, 1);
    }
    t === e.length ? e.push(n) : e.splice(t, 0, n), n.parent = this, n.didChange = !0, n._updateFlags = 15;
    const i = this.renderGroup || this.parentRenderGroup;
    return i && i.addChild(n), this.sortableChildren && (this.sortDirty = !0), this.emit("childAdded", n, this, t), n.emit("added", this), n;
  },
  /**
   * Swaps the position of 2 Containers within this container.
   * @param child - First container to swap
   * @param child2 - Second container to swap
   * @memberof scene.Container#
   */
  swapChildren(n, t) {
    if (n === t)
      return;
    const e = this.getChildIndex(n), i = this.getChildIndex(t);
    this.children[e] = t, this.children[i] = n;
    const r = this.renderGroup || this.parentRenderGroup;
    r && (r.structureDidChange = !0), this._didContainerChangeTick++;
  },
  /**
   * Remove the Container from its parent Container. If the Container has no parent, do nothing.
   * @memberof scene.Container#
   */
  removeFromParent() {
    var n;
    (n = this.parent) == null || n.removeChild(this);
  },
  /**
   * Reparent the child to this container, keeping the same worldTransform.
   * @param child - The child to reparent
   * @returns The first child that was reparented.
   * @memberof scene.Container#
   */
  reparentChild(...n) {
    return n.length === 1 ? this.reparentChildAt(n[0], this.children.length) : (n.forEach((t) => this.reparentChildAt(t, this.children.length)), n[0]);
  },
  /**
   * Reparent the child to this container at the specified index, keeping the same worldTransform.
   * @param child - The child to reparent
   * @param index - The index to reparent the child to
   * @memberof scene.Container#
   */
  reparentChildAt(n, t) {
    if (n.parent === this)
      return this.setChildIndex(n, t), n;
    const e = n.worldTransform.clone();
    n.removeFromParent(), this.addChildAt(n, t);
    const i = this.worldTransform.clone();
    return i.invert(), e.prepend(i), n.setFromMatrix(e), n;
  }
};
class so {
  constructor() {
    this.pipe = "filter", this.priority = 1;
  }
  destroy() {
    for (let t = 0; t < this.filters.length; t++)
      this.filters[t].destroy();
    this.filters = null, this.filterArea = null;
  }
}
class Tf {
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
        return be.get(i.maskClass, t);
    }
    return t;
  }
  returnMaskEffect(t) {
    be.return(t);
  }
}
const wr = new Tf();
Pt.handleByList(D.MaskEffect, wr._effectClasses);
const kf = {
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
  addEffect(n) {
    if (this.effects.indexOf(n) !== -1)
      return;
    this.effects.push(n), this.effects.sort((i, r) => i.priority - r.priority);
    const e = this.renderGroup || this.parentRenderGroup;
    e && (e.structureDidChange = !0), this._updateIsSimple();
  },
  /**
   * @todo Needs docs.
   * @param effect - The effect to remove.
   * @memberof scene.Container#
   * @ignore
   */
  removeEffect(n) {
    const t = this.effects.indexOf(n);
    t !== -1 && (this.effects.splice(t, 1), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateIsSimple());
  },
  set mask(n) {
    const t = this._maskEffect;
    (t == null ? void 0 : t.mask) !== n && (t && (this.removeEffect(t), wr.returnMaskEffect(t), this._maskEffect = null), n != null && (this._maskEffect = wr.getMaskEffect(n), this.addEffect(this._maskEffect)));
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
  setMask(n) {
    this._maskOptions = {
      ...this._maskOptions,
      ...n
    }, n.mask && (this.mask = n.mask);
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
    var n;
    return (n = this._maskEffect) == null ? void 0 : n.mask;
  },
  set filters(n) {
    var s;
    !Array.isArray(n) && n && (n = [n]);
    const t = this._filterEffect || (this._filterEffect = new so());
    n = n;
    const e = (n == null ? void 0 : n.length) > 0, i = ((s = t.filters) == null ? void 0 : s.length) > 0, r = e !== i;
    n = Array.isArray(n) ? n.slice(0) : n, t.filters = Object.freeze(n), r && (e ? this.addEffect(t) : (this.removeEffect(t), t.filters = n ?? null));
  },
  /**
   * Sets the filters for the displayObject.
   * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
   * To remove filters simply set this property to `'null'`.
   * @memberof scene.Container#
   */
  get filters() {
    var n;
    return (n = this._filterEffect) == null ? void 0 : n.filters;
  },
  set filterArea(n) {
    this._filterEffect || (this._filterEffect = new so()), this._filterEffect.filterArea = n;
  },
  /**
   * The area the filter is applied to. This is used as more of an optimization
   * rather than figuring out the dimensions of the displayObject each frame you can set this rectangle.
   *
   * Also works as an interaction mask.
   * @memberof scene.Container#
   */
  get filterArea() {
    var n;
    return (n = this._filterEffect) == null ? void 0 : n.filterArea;
  }
}, Ef = {
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
  set name(n) {
    $(Y, "Container.name property has been removed, use Container.label instead"), this.label = n;
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
  getChildByName(n, t = !1) {
    return this.getChildByLabel(n, t);
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
  getChildByLabel(n, t = !1) {
    const e = this.children;
    for (let i = 0; i < e.length; i++) {
      const r = e[i];
      if (r.label === n || n instanceof RegExp && n.test(r.label))
        return r;
    }
    if (t)
      for (let i = 0; i < e.length; i++) {
        const s = e[i].getChildByLabel(n, !0);
        if (s)
          return s;
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
  getChildrenByLabel(n, t = !1, e = []) {
    const i = this.children;
    for (let r = 0; r < i.length; r++) {
      const s = i[r];
      (s.label === n || n instanceof RegExp && n.test(s.label)) && e.push(s);
    }
    if (t)
      for (let r = 0; r < i.length; r++)
        i[r].getChildrenByLabel(n, !0, e);
    return e;
  }
}, Se = new ha(H), Ci = new ha(ge);
function rh(n, t, e) {
  e.clear();
  let i, r;
  return n.parent ? t ? i = n.parent.worldTransform : (r = Se.get().identity(), i = Js(n, r)) : i = H.IDENTITY, ah(n, e, i, t), r && Se.return(r), e.isValid || e.set(0, 0, 0, 0), e;
}
function ah(n, t, e, i) {
  var o, l;
  if (!n.visible || !n.measurable)
    return;
  let r;
  i ? r = n.worldTransform : (n.updateLocalTransform(), r = Se.get(), r.appendFrom(n.localTransform, e));
  const s = t, a = !!n.effects.length;
  if (a && (t = Ci.get().clear()), n.boundsArea)
    t.addRect(n.boundsArea, r);
  else {
    n.addBounds && (t.matrix = r, n.addBounds(t));
    for (let c = 0; c < n.children.length; c++)
      ah(n.children[c], t, r, i);
  }
  if (a) {
    for (let c = 0; c < n.effects.length; c++)
      (l = (o = n.effects[c]).addBounds) == null || l.call(o, t);
    s.addBounds(t, H.IDENTITY), Ci.return(t);
  }
  i || Se.return(r);
}
function Js(n, t) {
  const e = n.parent;
  return e && (Js(e, t), e.updateLocalTransform(), t.append(e.localTransform)), t;
}
let Rn = 0;
const no = 500;
function ct(...n) {
  Rn !== no && (Rn++, Rn === no ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...n));
}
function oh(n, t, e) {
  return t.clear(), e || (e = H.IDENTITY), lh(n, t, e, n, !0), t.isValid || t.set(0, 0, 0, 0), t;
}
function lh(n, t, e, i, r) {
  var l, c;
  let s;
  if (r)
    s = Se.get(), s = e.copyTo(s);
  else {
    if (!n.visible || !n.measurable)
      return;
    n.updateLocalTransform();
    const h = n.localTransform;
    s = Se.get(), s.appendFrom(h, e);
  }
  const a = t, o = !!n.effects.length;
  if (o && (t = Ci.get().clear()), n.boundsArea)
    t.addRect(n.boundsArea, s);
  else {
    n.renderPipeId && (t.matrix = s, n.addBounds(t));
    const h = n.children;
    for (let f = 0; f < h.length; f++)
      lh(h[f], t, s, i, !1);
  }
  if (o) {
    for (let h = 0; h < n.effects.length; h++)
      (c = (l = n.effects[h]).addLocalBounds) == null || c.call(l, t, i);
    a.addBounds(t, H.IDENTITY), Ci.return(t);
  }
  Se.return(s);
}
function hh(n, t) {
  const e = n.children;
  for (let i = 0; i < e.length; i++) {
    const r = e[i], s = r.uid, a = (r._didViewChangeTick & 65535) << 16 | r._didContainerChangeTick & 65535, o = t.index;
    (t.data[o] !== s || t.data[o + 1] !== a) && (t.data[t.index] = s, t.data[t.index + 1] = a, t.didChange = !0), t.index = o + 2, r.children.length && hh(r, t);
  }
  return t.didChange;
}
const If = new H(), Bf = {
  _localBoundsCacheId: -1,
  _localBoundsCacheData: null,
  _setWidth(n, t) {
    const e = Math.sign(this.scale.x) || 1;
    t !== 0 ? this.scale.x = n / t * e : this.scale.x = e;
  },
  _setHeight(n, t) {
    const e = Math.sign(this.scale.y) || 1;
    t !== 0 ? this.scale.y = n / t * e : this.scale.y = e;
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
      localBounds: new ge()
    });
    const n = this._localBoundsCacheData;
    return n.index = 1, n.didChange = !1, n.data[0] !== this._didViewChangeTick && (n.didChange = !0, n.data[0] = this._didViewChangeTick), hh(this, n), n.didChange && oh(this, n.localBounds, If), n.localBounds;
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
  getBounds(n, t) {
    return rh(this, n, t || new ge());
  }
}, Rf = {
  _onRender: null,
  set onRender(n) {
    const t = this.renderGroup || this.parentRenderGroup;
    if (!n) {
      this._onRender && (t == null || t.removeOnRender(this)), this._onRender = null;
      return;
    }
    this._onRender || t == null || t.addOnRender(this), this._onRender = n;
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
}, Ff = {
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
  set zIndex(n) {
    this._zIndex !== n && (this._zIndex = n, this.depthOfChildModified());
  },
  depthOfChildModified() {
    this.parent && (this.parent.sortableChildren = !0, this.parent.sortDirty = !0), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0);
  },
  /**
   * Sorts children by zIndex.
   * @memberof scene.Container#
   */
  sortChildren() {
    this.sortDirty && (this.sortDirty = !1, this.children.sort(Lf));
  }
};
function Lf(n, t) {
  return n._zIndex - t._zIndex;
}
const Of = {
  /**
   * Returns the global position of the container.
   * @param point - The optional point to write the global value to.
   * @param skipUpdate - Should we skip the update transform.
   * @returns - The updated point.
   * @memberof scene.Container#
   */
  getGlobalPosition(n = new St(), t = !1) {
    return this.parent ? this.parent.toGlobal(this._position, n, t) : (n.x = this._position.x, n.y = this._position.y), n;
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
  toGlobal(n, t, e = !1) {
    if (!e) {
      this.updateLocalTransform();
      const i = Js(this, new H());
      return i.append(this.localTransform), i.apply(n, t);
    }
    return this.worldTransform.apply(n, t);
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
  toLocal(n, t, e, i) {
    if (t && (n = t.toGlobal(n, e, i)), !i) {
      this.updateLocalTransform();
      const r = Js(this, new H());
      return r.append(this.localTransform), r.applyInverse(n, e);
    }
    return this.worldTransform.applyInverse(n, e);
  }
};
let Df = 0;
class ch {
  constructor() {
    this.uid = gt("instructionSet"), this.instructions = [], this.instructionSize = 0, this.renderables = [], this.tick = 0;
  }
  /** reset the instruction set so it can be reused set size back to 0 */
  reset() {
    this.instructionSize = 0, this.tick = Df++;
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
class zf {
  constructor() {
    this.renderPipeId = "renderGroup", this.root = null, this.canBundle = !1, this.renderGroupParent = null, this.renderGroupChildren = [], this.worldTransform = new H(), this.worldColorAlpha = 4294967295, this.worldColor = 16777215, this.worldAlpha = 1, this.childrenToUpdate = /* @__PURE__ */ Object.create(null), this.updateTick = 0, this.childrenRenderablesToUpdate = { list: [], index: 0 }, this.structureDidChange = !0, this.instructionSet = new ch(), this._onRenderContainers = [];
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
function Uf(n, t, e = {}) {
  for (const i in t)
    !e[i] && t[i] !== void 0 && (n[i] = t[i]);
}
const Fn = new pt(null), Ln = new pt(null), On = new pt(null, 1, 1), ro = 1, Gf = 2, Dn = 4;
class kt extends Mt {
  constructor(t = {}) {
    var e, i;
    super(), this.uid = gt("renderable"), this._updateFlags = 15, this.renderGroup = null, this.parentRenderGroup = null, this.parentRenderGroupIndex = 0, this.didChange = !1, this.didViewUpdate = !1, this.relativeRenderGroupDepth = 0, this.children = [], this.parent = null, this.includeInBuild = !0, this.measurable = !0, this.isSimple = !0, this.updateTick = -1, this.localTransform = new H(), this.relativeGroupTransform = new H(), this.groupTransform = this.relativeGroupTransform, this.destroyed = !1, this._position = new pt(this, 0, 0), this._scale = On, this._pivot = Ln, this._skew = Fn, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._rotation = 0, this.localColor = 16777215, this.localAlpha = 1, this.groupAlpha = 1, this.groupColor = 16777215, this.groupColorAlpha = 4294967295, this.localBlendMode = "inherit", this.groupBlendMode = "normal", this.localDisplayStatus = 7, this.globalDisplayStatus = 7, this._didContainerChangeTick = 0, this._didViewChangeTick = 0, this._didLocalTransformChangeId = -1, this.effects = [], Uf(this, t, {
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
    Object.defineProperties(kt.prototype, Object.getOwnPropertyDescriptors(t));
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
    t == null || t.removeChild(this), this.renderGroup = be.get(zf, this), this.groupTransform = H.IDENTITY, t == null || t.addChild(this), this._updateIsSimple();
  }
  /** This will disable the render group for this container. */
  disableRenderGroup() {
    if (!this.renderGroup)
      return;
    const t = this.parentRenderGroup;
    t == null || t.removeChild(this), be.return(this.renderGroup), this.renderGroup = null, this.groupTransform = this.relativeGroupTransform, t == null || t.addChild(this), this._updateIsSimple();
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
    return this.rotation * nf;
  }
  set angle(t) {
    this.rotation = t * rf;
  }
  /**
   * The center of rotation, scaling, and skewing for this display object in its local space. The `position`
   * is the projection of `pivot` in the parent's local space.
   *
   * By default, the pivot is the origin (0, 0).
   * @since 4.0.0
   */
  get pivot() {
    return this._pivot === Ln && (this._pivot = new pt(this, 0, 0)), this._pivot;
  }
  set pivot(t) {
    this._pivot === Ln && (this._pivot = new pt(this, 0, 0)), typeof t == "number" ? this._pivot.set(t) : this._pivot.copyFrom(t);
  }
  /**
   * The skew factor for the object in radians.
   * @since 4.0.0
   */
  get skew() {
    return this._skew === Fn && (this._skew = new pt(this, 0, 0)), this._skew;
  }
  set skew(t) {
    this._skew === Fn && (this._skew = new pt(this, 0, 0)), this._skew.copyFrom(t);
  }
  /**
   * The scale factors of this object along the local coordinate axes.
   *
   * The default scale is (1, 1).
   * @since 4.0.0
   */
  get scale() {
    return this._scale === On && (this._scale = new pt(this, 1, 1)), this._scale;
  }
  set scale(t) {
    this._scale === On && (this._scale = new pt(this, 0, 0)), typeof t == "number" ? this._scale.set(t) : this._scale.copyFrom(t);
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
    const e = this.localTransform, i = this._scale, r = this._pivot, s = this._position, a = i._x, o = i._y, l = r._x, c = r._y;
    e.a = this._cx * a, e.b = this._sx * a, e.c = this._cy * o, e.d = this._sy * o, e.tx = s._x - (l * e.a + c * e.c), e.ty = s._y - (l * e.b + c * e.d);
  }
  // / ///// color related stuff
  set alpha(t) {
    t !== this.localAlpha && (this.localAlpha = t, this._updateFlags |= ro, this._onUpdate());
  }
  /** The opacity of the object. */
  get alpha() {
    return this.localAlpha;
  }
  set tint(t) {
    const i = ft.shared.setValue(t ?? 16777215).toBgrNumber();
    i !== this.localColor && (this.localColor = i, this._updateFlags |= ro, this._onUpdate());
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
    this.localBlendMode !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Gf, this.localBlendMode = t, this._onUpdate());
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
    (this.localDisplayStatus & 2) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Dn, this.localDisplayStatus ^= 2, this._onUpdate());
  }
  /** @ignore */
  get culled() {
    return !(this.localDisplayStatus & 4);
  }
  /** @ignore */
  set culled(t) {
    const e = t ? 0 : 4;
    (this.localDisplayStatus & 4) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Dn, this.localDisplayStatus ^= 4, this._onUpdate());
  }
  /** Can this object be rendered, if false the object will not be drawn but the transform will still be updated. */
  get renderable() {
    return !!(this.localDisplayStatus & 1);
  }
  set renderable(t) {
    const e = t ? 1 : 0;
    (this.localDisplayStatus & 1) !== e && (this._updateFlags |= Dn, this.localDisplayStatus ^= 1, this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._onUpdate());
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
      for (let s = 0; s < e.length; ++s)
        e[s].destroy(t);
    (r = this.renderGroup) == null || r.destroy(), this.renderGroup = null;
  }
}
kt.mixin(Mf);
kt.mixin(Of);
kt.mixin(Rf);
kt.mixin(Bf);
kt.mixin(kf);
kt.mixin(Ef);
kt.mixin(Ff);
kt.mixin(Af);
class un extends kt {
  constructor() {
    super(...arguments), this.canBundle = !0, this.allowChildren = !1, this._roundPixels = 0, this._lastUsed = 0, this._lastInstructionTick = -1, this._bounds = new ge(0, 1, 0, 0), this._boundsDirty = !0;
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
class Pi extends un {
  /**
   * @param options - The options for creating the sprite.
   */
  constructor(t = V.EMPTY) {
    t instanceof V && (t = { texture: t });
    const { texture: e = V.EMPTY, anchor: i, roundPixels: r, width: s, height: a, ...o } = t;
    super({
      label: "Sprite",
      ...o
    }), this.renderPipeId = "sprite", this.batched = !0, this._sourceBounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, this._sourceBoundsDirty = !0, this._anchor = new pt(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), i ? this.anchor = i : e.defaultAnchor && (this.anchor = e.defaultAnchor), this.texture = e, this.allowChildren = !1, this.roundPixels = r ?? !1, s !== void 0 && (this.width = s), a !== void 0 && (this.height = a);
  }
  /**
   * Helper function that creates a new sprite based on the source you provide.
   * The source can be - frame id, image, video, canvas element, video element, texture
   * @param source - Source to create texture from
   * @param [skipCache] - Whether to skip the cache or not
   * @returns The newly created sprite
   */
  static from(t, e = !1) {
    return t instanceof V ? new Pi(t) : new Pi(V.from(t, e));
  }
  set texture(t) {
    t || (t = V.EMPTY);
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
    pf(this._bounds, this._anchor, this._texture, 0);
  }
  _updateSourceBounds() {
    const t = this._anchor, e = this._texture, i = this._sourceBounds, { width: r, height: s } = e.orig;
    i.maxX = -t._x * r, i.minX = i.maxX + r, i.maxY = -t._y * s, i.minY = i.maxY + s;
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
const Vf = new ge();
function uh(n, t, e) {
  const i = Vf;
  n.measurable = !0, rh(n, e, i), t.addBoundsMask(i), n.measurable = !1;
}
function fh(n, t, e) {
  const i = Ci.get();
  n.measurable = !0;
  const r = Se.get().identity(), s = dh(n, e, r);
  oh(n, i, s), n.measurable = !1, t.addBoundsMask(i), Se.return(r), Ci.return(i);
}
function dh(n, t, e) {
  return n ? (n !== t && (dh(n.parent, t, e), n.updateLocalTransform(), e.append(n.localTransform)), e) : (ct("Mask bounds, renderable is not inside the root container"), e);
}
class ph {
  constructor(t) {
    this.priority = 0, this.inverse = !1, this.pipe = "alphaMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.renderMaskToTexture = !(t instanceof Pi), this.mask.renderable = this.renderMaskToTexture, this.mask.includeInBuild = !this.renderMaskToTexture, this.mask.measurable = !1;
  }
  reset() {
    this.mask.measurable = !0, this.mask = null;
  }
  addBounds(t, e) {
    this.inverse || uh(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    fh(this.mask, t, e);
  }
  containsPoint(t, e) {
    const i = this.mask;
    return e(i, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof Pi;
  }
}
ph.extension = D.MaskEffect;
class mh {
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
mh.extension = D.MaskEffect;
class gh {
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
    uh(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    fh(this.mask, t, e);
  }
  containsPoint(t, e) {
    const i = this.mask;
    return e(i, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof kt;
  }
}
gh.extension = D.MaskEffect;
const Wf = {
  createCanvas: (n, t) => {
    const e = document.createElement("canvas");
    return e.width = n, e.height = t, e;
  },
  getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
  getWebGLRenderingContext: () => WebGLRenderingContext,
  getNavigator: () => navigator,
  getBaseUrl: () => document.baseURI ?? window.location.href,
  getFontFaceSet: () => document.fonts,
  fetch: (n, t) => fetch(n, t),
  parseXML: (n) => new DOMParser().parseFromString(n, "text/xml")
};
let ao = Wf;
const at = {
  /**
   * Returns the current adapter.
   * @returns {environment.Adapter} The current adapter.
   */
  get() {
    return ao;
  },
  /**
   * Sets the current adapter.
   * @param adapter - The new adapter.
   */
  set(n) {
    ao = n;
  }
};
class _h extends Pe {
  constructor(t) {
    t.resource || (t.resource = at.get().createCanvas()), t.width || (t.width = t.resource.width, t.autoDensity || (t.width /= t.resolution)), t.height || (t.height = t.resource.height, t.autoDensity || (t.height /= t.resolution)), super(t), this.uploadMethodId = "image", this.autoDensity = t.autoDensity;
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
_h.extension = D.TextureSource;
class Ei extends Pe {
  constructor(t) {
    if (t.resource && globalThis.HTMLImageElement && t.resource instanceof HTMLImageElement) {
      const e = at.get().createCanvas(t.resource.width, t.resource.height);
      e.getContext("2d").drawImage(t.resource, 0, 0, t.resource.width, t.resource.height), t.resource = e, ct("ImageSource: Image element passed, converting to canvas. Use CanvasSource instead.");
    }
    super(t), this.uploadMethodId = "image", this.autoGarbageCollect = !0;
  }
  static test(t) {
    return globalThis.HTMLImageElement && t instanceof HTMLImageElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap || globalThis.VideoFrame && t instanceof VideoFrame;
  }
}
Ei.extension = D.TextureSource;
var br = /* @__PURE__ */ ((n) => (n[n.INTERACTION = 50] = "INTERACTION", n[n.HIGH = 25] = "HIGH", n[n.NORMAL = 0] = "NORMAL", n[n.LOW = -25] = "LOW", n[n.UTILITY = -50] = "UTILITY", n))(br || {});
class zn {
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
const xh = class Ut {
  constructor() {
    this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new zn(null, null, 1 / 0), this.deltaMS = 1 / Ut.targetFPMS, this.elapsedMS = 1 / Ut.targetFPMS, this._tick = (t) => {
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
  add(t, e, i = br.NORMAL) {
    return this._addListener(new zn(t, e, i));
  }
  /**
   * Add a handler for the tick event which is only execute once.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param {number} [priority=UPDATE_PRIORITY.NORMAL] - The priority for emitting
   * @returns This instance of a ticker
   */
  addOnce(t, e, i = br.NORMAL) {
    return this._addListener(new zn(t, e, i, !0));
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
        const s = t - this._lastFrame | 0;
        if (s < this._minElapsedMS)
          return;
        this._lastFrame = t - s % this._minElapsedMS;
      }
      this.deltaMS = e, this.deltaTime = this.deltaMS * Ut.targetFPMS;
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
    const e = Math.min(this.maxFPS, t), i = Math.min(Math.max(0, e) / 1e3, Ut.targetFPMS);
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
    if (!Ut._shared) {
      const t = Ut._shared = new Ut();
      t.autoStart = !0, t._protected = !0;
    }
    return Ut._shared;
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
    if (!Ut._system) {
      const t = Ut._system = new Ut();
      t.autoStart = !0, t._protected = !0;
    }
    return Ut._system;
  }
};
xh.targetFPMS = 0.06;
let we = xh, Un;
async function yh() {
  return Un ?? (Un = (async () => {
    var a;
    const t = document.createElement("canvas").getContext("webgl");
    if (!t)
      return "premultiply-alpha-on-upload";
    const e = await new Promise((o) => {
      const l = document.createElement("video");
      l.onloadeddata = () => o(l), l.onerror = () => o(null), l.autoplay = !1, l.crossOrigin = "anonymous", l.preload = "auto", l.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", l.load();
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
    const s = new Uint8Array(4);
    return t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, s), t.deleteFramebuffer(r), t.deleteTexture(i), (a = t.getExtension("WEBGL_lose_context")) == null || a.loseContext(), s[0] <= s[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
  })()), Un;
}
const fn = class vh extends Pe {
  constructor(t) {
    super(t), this.isReady = !1, this.uploadMethodId = "video", t = {
      ...vh.defaultOptions,
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
    return (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = !0), t.addEventListener("play", this._onPlayStart), t.addEventListener("pause", this._onPlayStop), t.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (e.preload || t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlayThrough), t.addEventListener("error", this._onError, !0)), this.alphaMode = await yh(), this._load = new Promise((i, r) => {
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
fn.extension = D.TextureSource;
fn.defaultOptions = {
  ...Pe.defaultOptions,
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
fn.MIME_TYPES = {
  ogv: "video/ogg",
  mov: "video/quicktime",
  m4v: "video/mp4"
};
let Vs = fn;
const ie = (n, t, e = !1) => (Array.isArray(n) || (n = [n]), t ? n.map((i) => typeof i == "string" || e ? t(i) : i) : n);
class Nf {
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
    const i = ie(t);
    let r;
    for (let l = 0; l < this.parsers.length; l++) {
      const c = this.parsers[l];
      if (c.test(e)) {
        r = c.getCacheableAssets(i, e);
        break;
      }
    }
    const s = new Map(Object.entries(r || {}));
    r || i.forEach((l) => {
      s.set(l, e);
    });
    const a = [...s.keys()], o = {
      cacheKeys: a,
      keys: i
    };
    i.forEach((l) => {
      this._cacheMap.set(l, o);
    }), a.forEach((l) => {
      const c = r ? r[l] : e;
      this._cache.has(l) && this._cache.get(l) !== c && ct("[Cache] already has key:", l), this._cache.set(l, s.get(l));
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
const st = new Nf(), Sr = [];
Pt.handleByList(D.TextureSource, Sr);
function wh(n = {}) {
  const t = n && n.resource, e = t ? n.resource : n, i = t ? n : { resource: n };
  for (let r = 0; r < Sr.length; r++) {
    const s = Sr[r];
    if (s.test(e))
      return new s(i);
  }
  throw new Error(`Could not find a source type for resource: ${i.resource}`);
}
function Hf(n = {}, t = !1) {
  const e = n && n.resource, i = e ? n.resource : n, r = e ? n : { resource: n };
  if (!t && st.has(i))
    return st.get(i);
  const s = new V({ source: wh(r) });
  return s.on("destroy", () => {
    st.has(i) && st.remove(i);
  }), t || st.set(i, s), s;
}
function $f(n, t = !1) {
  return typeof n == "string" ? st.get(n) : n instanceof Pe ? new V({ source: n }) : Hf(n, t);
}
V.from = $f;
Pe.from = wh;
Pt.add(ph, mh, gh, Vs, Ei, _h, la);
var Me = /* @__PURE__ */ ((n) => (n[n.Low = 0] = "Low", n[n.Normal = 1] = "Normal", n[n.High = 2] = "High", n))(Me || {});
function ee(n) {
  if (typeof n != "string")
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(n)}`);
}
function zi(n) {
  return n.split("?")[0].split("#")[0];
}
function Yf(n) {
  return n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Xf(n, t, e) {
  return n.replace(new RegExp(Yf(t), "g"), e);
}
function jf(n, t) {
  let e = "", i = 0, r = -1, s = 0, a = -1;
  for (let o = 0; o <= n.length; ++o) {
    if (o < n.length)
      a = n.charCodeAt(o);
    else {
      if (a === 47)
        break;
      a = 47;
    }
    if (a === 47) {
      if (!(r === o - 1 || s === 1)) if (r !== o - 1 && s === 2) {
        if (e.length < 2 || i !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
          if (e.length > 2) {
            const l = e.lastIndexOf("/");
            if (l !== e.length - 1) {
              l === -1 ? (e = "", i = 0) : (e = e.slice(0, l), i = e.length - 1 - e.lastIndexOf("/")), r = o, s = 0;
              continue;
            }
          } else if (e.length === 2 || e.length === 1) {
            e = "", i = 0, r = o, s = 0;
            continue;
          }
        }
      } else
        e.length > 0 ? e += `/${n.slice(r + 1, o)}` : e = n.slice(r + 1, o), i = o - r - 1;
      r = o, s = 0;
    } else a === 46 && s !== -1 ? ++s : s = -1;
  }
  return e;
}
const wt = {
  /**
   * Converts a path to posix format.
   * @param path - The path to convert to posix
   */
  toPosix(n) {
    return Xf(n, "\\", "/");
  },
  /**
   * Checks if the path is a URL e.g. http://, https://
   * @param path - The path to check
   */
  isUrl(n) {
    return /^https?:/.test(this.toPosix(n));
  },
  /**
   * Checks if the path is a data URL
   * @param path - The path to check
   */
  isDataUrl(n) {
    return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(n);
  },
  /**
   * Checks if the path is a blob URL
   * @param path - The path to check
   */
  isBlobUrl(n) {
    return n.startsWith("blob:");
  },
  /**
   * Checks if the path has a protocol e.g. http://, https://, file:///, data:, blob:, C:/
   * This will return true for windows file paths
   * @param path - The path to check
   */
  hasProtocol(n) {
    return /^[^/:]+:/.test(this.toPosix(n));
  },
  /**
   * Returns the protocol of the path e.g. http://, https://, file:///, data:, blob:, C:/
   * @param path - The path to get the protocol from
   */
  getProtocol(n) {
    ee(n), n = this.toPosix(n);
    const t = /^file:\/\/\//.exec(n);
    if (t)
      return t[0];
    const e = /^[^/:]+:\/{0,2}/.exec(n);
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
  toAbsolute(n, t, e) {
    if (ee(n), this.isDataUrl(n) || this.isBlobUrl(n))
      return n;
    const i = zi(this.toPosix(t ?? at.get().getBaseUrl())), r = zi(this.toPosix(e ?? this.rootname(i)));
    return n = this.toPosix(n), n.startsWith("/") ? wt.join(r, n.slice(1)) : this.isAbsolute(n) ? n : this.join(i, n);
  },
  /**
   * Normalizes the given path, resolving '..' and '.' segments
   * @param path - The path to normalize
   */
  normalize(n) {
    if (ee(n), n.length === 0)
      return ".";
    if (this.isDataUrl(n) || this.isBlobUrl(n))
      return n;
    n = this.toPosix(n);
    let t = "";
    const e = n.startsWith("/");
    this.hasProtocol(n) && (t = this.rootname(n), n = n.slice(t.length));
    const i = n.endsWith("/");
    return n = jf(n), n.length > 0 && i && (n += "/"), e ? `/${n}` : t + n;
  },
  /**
   * Determines if path is an absolute path.
   * Absolute paths can be urls, data urls, or paths on disk
   * @param path - The path to test
   */
  isAbsolute(n) {
    return ee(n), n = this.toPosix(n), this.hasProtocol(n) ? !0 : n.startsWith("/");
  },
  /**
   * Joins all given path segments together using the platform-specific separator as a delimiter,
   * then normalizes the resulting path
   * @param segments - The segments of the path to join
   */
  join(...n) {
    if (n.length === 0)
      return ".";
    let t;
    for (let e = 0; e < n.length; ++e) {
      const i = n[e];
      if (ee(i), i.length > 0)
        if (t === void 0)
          t = i;
        else {
          const r = n[e - 1] ?? "";
          this.joinExtensions.includes(this.extname(r).toLowerCase()) ? t += `/../${i}` : t += `/${i}`;
        }
    }
    return t === void 0 ? "." : this.normalize(t);
  },
  /**
   * Returns the directory name of a path
   * @param path - The path to parse
   */
  dirname(n) {
    if (ee(n), n.length === 0)
      return ".";
    n = this.toPosix(n);
    let t = n.charCodeAt(0);
    const e = t === 47;
    let i = -1, r = !0;
    const s = this.getProtocol(n), a = n;
    n = n.slice(s.length);
    for (let o = n.length - 1; o >= 1; --o)
      if (t = n.charCodeAt(o), t === 47) {
        if (!r) {
          i = o;
          break;
        }
      } else
        r = !1;
    return i === -1 ? e ? "/" : this.isUrl(a) ? s + n : s : e && i === 1 ? "//" : s + n.slice(0, i);
  },
  /**
   * Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
   * @param path - The path to parse
   */
  rootname(n) {
    ee(n), n = this.toPosix(n);
    let t = "";
    if (n.startsWith("/") ? t = "/" : t = this.getProtocol(n), this.isUrl(n)) {
      const e = n.indexOf("/", t.length);
      e !== -1 ? t = n.slice(0, e) : t = n, t.endsWith("/") || (t += "/");
    }
    return t;
  },
  /**
   * Returns the last portion of a path
   * @param path - The path to test
   * @param ext - Optional extension to remove
   */
  basename(n, t) {
    ee(n), t && ee(t), n = zi(this.toPosix(n));
    let e = 0, i = -1, r = !0, s;
    if (t !== void 0 && t.length > 0 && t.length <= n.length) {
      if (t.length === n.length && t === n)
        return "";
      let a = t.length - 1, o = -1;
      for (s = n.length - 1; s >= 0; --s) {
        const l = n.charCodeAt(s);
        if (l === 47) {
          if (!r) {
            e = s + 1;
            break;
          }
        } else
          o === -1 && (r = !1, o = s + 1), a >= 0 && (l === t.charCodeAt(a) ? --a === -1 && (i = s) : (a = -1, i = o));
      }
      return e === i ? i = o : i === -1 && (i = n.length), n.slice(e, i);
    }
    for (s = n.length - 1; s >= 0; --s)
      if (n.charCodeAt(s) === 47) {
        if (!r) {
          e = s + 1;
          break;
        }
      } else i === -1 && (r = !1, i = s + 1);
    return i === -1 ? "" : n.slice(e, i);
  },
  /**
   * Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
   * portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
   * the first character of the basename of path, an empty string is returned.
   * @param path - The path to parse
   */
  extname(n) {
    ee(n), n = zi(this.toPosix(n));
    let t = -1, e = 0, i = -1, r = !0, s = 0;
    for (let a = n.length - 1; a >= 0; --a) {
      const o = n.charCodeAt(a);
      if (o === 47) {
        if (!r) {
          e = a + 1;
          break;
        }
        continue;
      }
      i === -1 && (r = !1, i = a + 1), o === 46 ? t === -1 ? t = a : s !== 1 && (s = 1) : t !== -1 && (s = -1);
    }
    return t === -1 || i === -1 || s === 0 || s === 1 && t === i - 1 && t === e + 1 ? "" : n.slice(t, i);
  },
  /**
   * Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
   * @param path - The path to parse
   */
  parse(n) {
    ee(n);
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (n.length === 0)
      return t;
    n = zi(this.toPosix(n));
    let e = n.charCodeAt(0);
    const i = this.isAbsolute(n);
    let r;
    t.root = this.rootname(n), i || this.hasProtocol(n) ? r = 1 : r = 0;
    let s = -1, a = 0, o = -1, l = !0, c = n.length - 1, h = 0;
    for (; c >= r; --c) {
      if (e = n.charCodeAt(c), e === 47) {
        if (!l) {
          a = c + 1;
          break;
        }
        continue;
      }
      o === -1 && (l = !1, o = c + 1), e === 46 ? s === -1 ? s = c : h !== 1 && (h = 1) : s !== -1 && (h = -1);
    }
    return s === -1 || o === -1 || h === 0 || h === 1 && s === o - 1 && s === a + 1 ? o !== -1 && (a === 0 && i ? t.base = t.name = n.slice(1, o) : t.base = t.name = n.slice(a, o)) : (a === 0 && i ? (t.name = n.slice(1, s), t.base = n.slice(1, o)) : (t.name = n.slice(a, s), t.base = n.slice(a, o)), t.ext = n.slice(s, o)), t.dir = this.dirname(n), t;
  },
  sep: "/",
  delimiter: ":",
  joinExtensions: [".html"]
};
function bh(n, t, e, i, r) {
  const s = t[e];
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    e < t.length - 1 ? bh(n.replace(i[e], o), t, e + 1, i, r) : r.push(n.replace(i[e], o));
  }
}
function Kf(n) {
  const t = /\{(.*?)\}/g, e = n.match(t), i = [];
  if (e) {
    const r = [];
    e.forEach((s) => {
      const a = s.substring(1, s.length - 1).split(",");
      r.push(a);
    }), bh(n, r, 0, e, i);
  } else
    i.push(n);
  return i;
}
const tn = (n) => !Array.isArray(n);
class Ii {
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
    return ie(
      e || i,
      (s) => typeof s == "string" ? s : Array.isArray(s) ? s.map((a) => (a == null ? void 0 : a.src) ?? a) : s != null && s.src ? s.src : s,
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
    Array.isArray(e) || (r = Object.entries(e).map(([s, a]) => typeof a == "string" || Array.isArray(a) ? { alias: s, src: a } : { alias: s, ...a })), r.forEach((s) => {
      const a = s.src, o = s.alias;
      let l;
      if (typeof o == "string") {
        const c = this._createBundleAssetId(t, o);
        i.push(c), l = [o, c];
      } else {
        const c = o.map((h) => this._createBundleAssetId(t, h));
        i.push(...c), l = [...o, ...c];
      }
      this.add({
        ...s,
        alias: l,
        src: a
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
    i = (s) => {
      this.hasKey(s) && ct(`[Resolver] already has key: ${s} overwriting`);
    }, ie(e).forEach((s) => {
      const { src: a } = s;
      let { data: o, format: l, loadParser: c } = s;
      const h = ie(a).map((u) => typeof u == "string" ? Kf(u) : Array.isArray(u) ? u : [u]), f = this.getAlias(s);
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
            o = m.data ?? o, l = m.format ?? l, c = m.loadParser ?? c, p = {
              ...p,
              ...m
            };
          if (!f)
            throw new Error(`[Resolver] alias is undefined for this asset: ${p.src}`);
          p = this._buildResolvedAsset(p, {
            aliases: f,
            data: o,
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
    const e = tn(t);
    t = ie(t);
    const i = {};
    return t.forEach((r) => {
      const s = this._bundles[r];
      if (s) {
        const a = this.resolve(s), o = {};
        for (const l in a) {
          const c = a[l];
          o[this._extractAssetIdFromBundle(r, l)] = c;
        }
        i[r] = o;
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
    const e = tn(t);
    t = ie(t);
    const i = {};
    return t.forEach((r) => {
      if (!this._resolverHash[r])
        if (this._assetMap[r]) {
          let s = this._assetMap[r];
          const a = this._getPreferredOrder(s);
          a == null || a.priority.forEach((o) => {
            a.params[o].forEach((l) => {
              const c = s.filter((h) => h[o] ? h[o] === l : !1);
              c.length && (s = c);
            });
          }), this._resolverHash[r] = s[0];
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
      const i = t[0], r = this._preferredOrder.find((s) => s.params.format.includes(i.format));
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
    const { aliases: i, data: r, loadParser: s, format: a } = e;
    return (this._basePath || this._rootPath) && (t.src = wt.toAbsolute(t.src, this._basePath, this._rootPath)), t.alias = i ?? t.alias ?? [t.src], t.src = this._appendDefaultSearchParams(t.src), t.data = { ...r || {}, ...t.data }, t.loadParser = s ?? t.loadParser, t.format = a ?? t.format ?? qf(t.src), t;
  }
}
Ii.RETINA_PREFIX = /@([0-9\.]+)x/;
function qf(n) {
  return n.split(".").pop().split("?").shift().split("#").shift();
}
const Ar = (n, t) => {
  const e = t.split("?")[1];
  return e && (n += `?${e}`), n;
}, Sh = class Yi {
  /**
   * @param texture - Reference to the source BaseTexture object.
   * @param {object} data - Spritesheet image data.
   */
  constructor(t, e) {
    this.linkedSheets = [], this._texture = t instanceof V ? t : null, this.textureSource = t.source, this.textures = {}, this.animations = {}, this.data = e;
    const i = parseFloat(e.meta.scale);
    i ? (this.resolution = i, t.source.resolution = this.resolution) : this.resolution = t.source._resolution, this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
  }
  /**
   * Parser spritesheet from loaded data. This is done asynchronously
   * to prevent creating too many Texture within a single process.
   */
  parse() {
    return new Promise((t) => {
      this._callback = t, this._batchIndex = 0, this._frameKeys.length <= Yi.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
    });
  }
  /**
   * Process a batch of frames
   * @param initialFrameIndex - The index of frame to start.
   */
  _processFrames(t) {
    let e = t;
    const i = Yi.BATCH_SIZE;
    for (; e - t < i && e < this._frameKeys.length; ) {
      const r = this._frameKeys[e], s = this._frames[r], a = s.frame;
      if (a) {
        let o = null, l = null;
        const c = s.trimmed !== !1 && s.sourceSize ? s.sourceSize : s.frame, h = new mt(
          0,
          0,
          Math.floor(c.w) / this.resolution,
          Math.floor(c.h) / this.resolution
        );
        s.rotated ? o = new mt(
          Math.floor(a.x) / this.resolution,
          Math.floor(a.y) / this.resolution,
          Math.floor(a.h) / this.resolution,
          Math.floor(a.w) / this.resolution
        ) : o = new mt(
          Math.floor(a.x) / this.resolution,
          Math.floor(a.y) / this.resolution,
          Math.floor(a.w) / this.resolution,
          Math.floor(a.h) / this.resolution
        ), s.trimmed !== !1 && s.spriteSourceSize && (l = new mt(
          Math.floor(s.spriteSourceSize.x) / this.resolution,
          Math.floor(s.spriteSourceSize.y) / this.resolution,
          Math.floor(a.w) / this.resolution,
          Math.floor(a.h) / this.resolution
        )), this.textures[r] = new V({
          source: this.textureSource,
          frame: o,
          orig: h,
          trim: l,
          rotate: s.rotated ? 2 : 0,
          defaultAnchor: s.anchor,
          defaultBorders: s.borders,
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
    this._processFrames(this._batchIndex * Yi.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
      this._batchIndex * Yi.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
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
Sh.BATCH_SIZE = 1e3;
let oo = Sh;
const Zf = [
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
function Ah(n, t, e) {
  const i = {};
  if (n.forEach((r) => {
    i[r] = t;
  }), Object.keys(t.textures).forEach((r) => {
    i[r] = t.textures[r];
  }), !e) {
    const r = wt.dirname(n[0]);
    t.linkedSheets.forEach((s, a) => {
      const o = Ah([`${r}/${t.data.meta.related_multi_packs[a]}`], s, !0);
      Object.assign(i, o);
    });
  }
  return i;
}
const Qf = {
  extension: D.Asset,
  /** Handle the caching of the related Spritesheet Textures */
  cache: {
    test: (n) => n instanceof oo,
    getCacheableAssets: (n, t) => Ah(n, t, !1)
  },
  /** Resolve the resolution of the asset. */
  resolver: {
    extension: {
      type: D.ResolveParser,
      name: "resolveSpritesheet"
    },
    test: (n) => {
      const e = n.split("?")[0].split("."), i = e.pop(), r = e.pop();
      return i === "json" && Zf.includes(r);
    },
    parse: (n) => {
      var e;
      const t = n.split(".");
      return {
        resolution: parseFloat(((e = Ii.RETINA_PREFIX.exec(n)) == null ? void 0 : e[1]) ?? "1"),
        format: t[t.length - 2],
        src: n
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
      priority: Me.Normal,
      name: "spritesheetLoader"
    },
    async testParse(n, t) {
      return wt.extname(t.src).toLowerCase() === ".json" && !!n.frames;
    },
    async parse(n, t, e) {
      var c, h;
      const {
        texture: i,
        // if user need to use preloaded texture
        imageFilename: r
        // if user need to use custom filename (not from jsonFile.meta.image)
      } = (t == null ? void 0 : t.data) ?? {};
      let s = wt.dirname(t.src);
      s && s.lastIndexOf("/") !== s.length - 1 && (s += "/");
      let a;
      if (i instanceof V)
        a = i;
      else {
        const f = Ar(s + (r ?? n.meta.image), t.src);
        a = (await e.load([f]))[f];
      }
      const o = new oo(
        a.source,
        n
      );
      await o.parse();
      const l = (c = n == null ? void 0 : n.meta) == null ? void 0 : c.related_multi_packs;
      if (Array.isArray(l)) {
        const f = [];
        for (const u of l) {
          if (typeof u != "string")
            continue;
          let m = s + u;
          (h = t.data) != null && h.ignoreMultiPack || (m = Ar(m, t.src), f.push(e.load({
            src: m,
            data: {
              ignoreMultiPack: !0
            }
          })));
        }
        const d = await Promise.all(f);
        o.linkedSheets = d, d.forEach((u) => {
          u.linkedSheets = [o].concat(o.linkedSheets.filter((m) => m !== u));
        });
      }
      return o;
    },
    async unload(n, t, e) {
      await e.unload(n.textureSource._sourceOrigin), n.destroy(!1);
    }
  }
};
Pt.add(Qf);
const Gn = /* @__PURE__ */ Object.create(null), lo = /* @__PURE__ */ Object.create(null);
function ca(n, t) {
  let e = lo[n];
  return e === void 0 && (Gn[t] === void 0 && (Gn[t] = 1), lo[n] = e = Gn[t]++), e;
}
let ai;
function Ch() {
  return (!ai || ai != null && ai.isContextLost()) && (ai = at.get().createCanvas().getContext("webgl", {})), ai;
}
let ks;
function Jf() {
  if (!ks) {
    ks = "mediump";
    const n = Ch();
    n && n.getShaderPrecisionFormat && (ks = n.getShaderPrecisionFormat(n.FRAGMENT_SHADER, n.HIGH_FLOAT).precision ? "highp" : "mediump");
  }
  return ks;
}
function td(n, t, e) {
  return t ? n : e ? (n = n.replace("out vec4 finalColor;", ""), `
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${n}
        `) : `
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${n}
        `;
}
function ed(n, t, e) {
  const i = e ? t.maxSupportedFragmentPrecision : t.maxSupportedVertexPrecision;
  if (n.substring(0, 9) !== "precision") {
    let r = e ? t.requestedFragmentPrecision : t.requestedVertexPrecision;
    return r === "highp" && i !== "highp" && (r = "mediump"), `precision ${r} float;
${n}`;
  } else if (i !== "highp" && n.substring(0, 15) === "precision highp")
    return n.replace("precision highp", "precision mediump");
  return n;
}
function id(n, t) {
  return t ? `#version 300 es
${n}` : n;
}
const sd = {}, nd = {};
function rd(n, { name: t = "pixi-program" }, e = !0) {
  t = t.replace(/\s+/g, "-"), t += e ? "-fragment" : "-vertex";
  const i = e ? sd : nd;
  return i[t] ? (i[t]++, t += `-${i[t]}`) : i[t] = 1, n.indexOf("#define SHADER_NAME") !== -1 ? n : `${`#define SHADER_NAME ${t}`}
${n}`;
}
function ad(n, t) {
  return t ? n.replace("#version 300 es", "") : n;
}
const Vn = {
  // strips any version headers..
  stripVersion: ad,
  // adds precision string if not already present
  ensurePrecision: ed,
  // add some defines if WebGL1 to make it more compatible with WebGL2 shaders
  addProgramDefines: td,
  // add the program name to the shader
  setProgramName: rd,
  // add the version string to the shader header
  insertVersion: id
}, Wn = /* @__PURE__ */ Object.create(null), Ph = class Cr {
  /**
   * Creates a shiny new GlProgram. Used by WebGL renderer.
   * @param options - The options for the program.
   */
  constructor(t) {
    t = { ...Cr.defaultOptions, ...t };
    const e = t.fragment.indexOf("#version 300 es") !== -1, i = {
      stripVersion: e,
      ensurePrecision: {
        requestedFragmentPrecision: t.preferredFragmentPrecision,
        requestedVertexPrecision: t.preferredVertexPrecision,
        maxSupportedVertexPrecision: "highp",
        maxSupportedFragmentPrecision: Jf()
      },
      setProgramName: {
        name: t.name
      },
      addProgramDefines: e,
      insertVersion: e
    };
    let r = t.fragment, s = t.vertex;
    Object.keys(Vn).forEach((a) => {
      const o = i[a];
      r = Vn[a](r, o, !0), s = Vn[a](s, o, !1);
    }), this.fragment = r, this.vertex = s, this._key = ca(`${this.vertex}:${this.fragment}`, "gl-program");
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
    return Wn[e] || (Wn[e] = new Cr(t)), Wn[e];
  }
};
Ph.defaultOptions = {
  preferredVertexPrecision: "highp",
  preferredFragmentPrecision: "mediump"
};
let Mh = Ph;
const ho = {
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
function od(n) {
  return ho[n] ?? ho.float32;
}
const ld = {
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
function hd({ source: n, entryPoint: t }) {
  const e = {}, i = n.indexOf(`fn ${t}`);
  if (i !== -1) {
    const r = n.indexOf("->", i);
    if (r !== -1) {
      const s = n.substring(i, r), a = /@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;
      let o;
      for (; (o = a.exec(s)) !== null; ) {
        const l = ld[o[3]] ?? "float32";
        e[o[2]] = {
          location: parseInt(o[1], 10),
          format: l,
          stride: od(l).stride,
          offset: 0,
          instance: !1,
          start: 0
        };
      }
    }
  }
  return e;
}
function Nn(n) {
  var f, d;
  const t = /(^|[^/])@(group|binding)\(\d+\)[^;]+;/g, e = /@group\((\d+)\)/, i = /@binding\((\d+)\)/, r = /var(<[^>]+>)? (\w+)/, s = /:\s*(\w+)/, a = /struct\s+(\w+)\s*{([^}]+)}/g, o = /(\w+)\s*:\s*([\w\<\>]+)/g, l = /struct\s+(\w+)/, c = (f = n.match(t)) == null ? void 0 : f.map((u) => ({
    group: parseInt(u.match(e)[1], 10),
    binding: parseInt(u.match(i)[1], 10),
    name: u.match(r)[2],
    isUniform: u.match(r)[1] === "<uniform>",
    type: u.match(s)[1]
  }));
  if (!c)
    return {
      groups: [],
      structs: []
    };
  const h = ((d = n.match(a)) == null ? void 0 : d.map((u) => {
    const m = u.match(l)[1], p = u.match(o).reduce((g, x) => {
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
var Xi = /* @__PURE__ */ ((n) => (n[n.VERTEX = 1] = "VERTEX", n[n.FRAGMENT = 2] = "FRAGMENT", n[n.COMPUTE = 4] = "COMPUTE", n))(Xi || {});
function cd({ groups: n }) {
  const t = [];
  for (let e = 0; e < n.length; e++) {
    const i = n[e];
    t[i.group] || (t[i.group] = []), i.isUniform ? t[i.group].push({
      binding: i.binding,
      visibility: Xi.VERTEX | Xi.FRAGMENT,
      buffer: {
        type: "uniform"
      }
    }) : i.type === "sampler" ? t[i.group].push({
      binding: i.binding,
      visibility: Xi.FRAGMENT,
      sampler: {
        type: "filtering"
      }
    }) : i.type === "texture_2d" && t[i.group].push({
      binding: i.binding,
      visibility: Xi.FRAGMENT,
      texture: {
        sampleType: "float",
        viewDimension: "2d",
        multisampled: !1
      }
    });
  }
  return t;
}
function ud({ groups: n }) {
  const t = [];
  for (let e = 0; e < n.length; e++) {
    const i = n[e];
    t[i.group] || (t[i.group] = {}), t[i.group][i.name] = i.binding;
  }
  return t;
}
function fd(n, t) {
  const e = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [...n.structs, ...t.structs].filter((a) => e.has(a.name) ? !1 : (e.add(a.name), !0)), s = [...n.groups, ...t.groups].filter((a) => {
    const o = `${a.name}-${a.binding}`;
    return i.has(o) ? !1 : (i.add(o), !0);
  });
  return { structs: r, groups: s };
}
const Hn = /* @__PURE__ */ Object.create(null);
class dn {
  /**
   * Create a new GpuProgram
   * @param options - The options for the gpu program
   */
  constructor(t) {
    var o, l;
    this._layoutKey = 0, this._attributeLocationsKey = 0;
    const { fragment: e, vertex: i, layout: r, gpuLayout: s, name: a } = t;
    if (this.name = a, this.fragment = e, this.vertex = i, e.source === i.source) {
      const c = Nn(e.source);
      this.structsAndGroups = c;
    } else {
      const c = Nn(i.source), h = Nn(e.source);
      this.structsAndGroups = fd(c, h);
    }
    this.layout = r ?? ud(this.structsAndGroups), this.gpuLayout = s ?? cd(this.structsAndGroups), this.autoAssignGlobalUniforms = ((o = this.layout[0]) == null ? void 0 : o.globalUniforms) !== void 0, this.autoAssignLocalUniforms = ((l = this.layout[1]) == null ? void 0 : l.localUniforms) !== void 0, this._generateProgramKey();
  }
  // TODO maker this pure
  _generateProgramKey() {
    const { vertex: t, fragment: e } = this, i = t.source + e.source + t.entryPoint + e.entryPoint;
    this._layoutKey = ca(i, "program");
  }
  get attributeData() {
    return this._attributeData ?? (this._attributeData = hd(this.vertex)), this._attributeData;
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
    return Hn[e] || (Hn[e] = new dn(t)), Hn[e];
  }
}
const Th = [
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
], dd = Th.reduce((n, t) => (n[t] = !0, n), {});
function pd(n, t) {
  switch (n) {
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
const kh = class Eh {
  /**
   * Create a new Uniform group
   * @param uniformStructures - The structures of the uniform group
   * @param options - The optional parameters of this uniform group
   */
  constructor(t, e) {
    this._touched = 0, this.uid = gt("uniform"), this._resourceType = "uniformGroup", this._resourceId = gt("resource"), this.isUniformGroup = !0, this._dirtyId = 0, this.destroyed = !1, e = { ...Eh.defaultOptions, ...e }, this.uniformStructures = t;
    const i = {};
    for (const r in t) {
      const s = t[r];
      if (s.name = r, s.size = s.size ?? 1, !dd[s.type])
        throw new Error(`Uniform type ${s.type} is not supported. Supported uniform types are: ${Th.join(", ")}`);
      s.value ?? (s.value = pd(s.type, s.size)), i[r] = s.value;
    }
    this.uniforms = i, this._dirtyId = 1, this.ubo = e.ubo, this.isStatic = e.isStatic, this._signature = ca(Object.keys(i).map(
      (r) => `${r}-${t[r].type}`
    ).join("-"), "uniform-group");
  }
  /** Call this if you want the uniform groups data to be uploaded to the GPU only useful if `isStatic` is true. */
  update() {
    this._dirtyId++;
  }
};
kh.defaultOptions = {
  /** if true the UniformGroup is handled as an Uniform buffer object. */
  ubo: !1,
  /** if true, then you are responsible for when the data is uploaded to the GPU by calling `update()` */
  isStatic: !1
};
let Ih = kh;
class Ws {
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
    var r, s;
    const i = this.resources[e];
    t !== i && (i && ((r = t.off) == null || r.call(t, "change", this.onResourceChange, this)), (s = t.on) == null || s.call(t, "change", this.onResourceChange, this), this.resources[e] = t, this._dirty = !0);
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
var Pr = /* @__PURE__ */ ((n) => (n[n.WEBGL = 1] = "WEBGL", n[n.WEBGPU = 2] = "WEBGPU", n[n.BOTH = 3] = "BOTH", n))(Pr || {});
class ua extends Mt {
  constructor(t) {
    super(), this._uniformBindMap = /* @__PURE__ */ Object.create(null), this._ownedBindGroups = [];
    let {
      gpuProgram: e,
      glProgram: i,
      groups: r,
      resources: s,
      compatibleRenderers: a,
      groupMap: o
    } = t;
    this.gpuProgram = e, this.glProgram = i, a === void 0 && (a = 0, e && (a |= Pr.WEBGPU), i && (a |= Pr.WEBGL)), this.compatibleRenderers = a;
    const l = {};
    if (!s && !r && (s = {}), s && r)
      throw new Error("[Shader] Cannot have both resources and groups");
    if (!e && r && !o)
      throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
    if (!e && r && o)
      for (const c in o)
        for (const h in o[c]) {
          const f = o[c][h];
          l[f] = {
            group: c,
            binding: h,
            name: f
          };
        }
    else if (e && r && !o) {
      const c = e.structsAndGroups.groups;
      o = {}, c.forEach((h) => {
        o[h.group] = o[h.group] || {}, o[h.group][h.binding] = h.name, l[h.name] = h;
      });
    } else if (s) {
      r = {}, o = {}, e && e.structsAndGroups.groups.forEach((f) => {
        o[f.group] = o[f.group] || {}, o[f.group][f.binding] = f.name, l[f.name] = f;
      });
      let c = 0;
      for (const h in s)
        l[h] || (r[99] || (r[99] = new Ws(), this._ownedBindGroups.push(r[99])), l[h] = { group: 99, binding: c, name: h }, o[99] = o[99] || {}, o[99][c] = h, c++);
      for (const h in s) {
        const f = h;
        let d = s[h];
        !d.source && !d._resourceType && (d = new Ih(d));
        const u = l[f];
        u && (r[u.group] || (r[u.group] = new Ws(), this._ownedBindGroups.push(r[u.group])), r[u.group].setResource(d, u.binding));
      }
    }
    this.groups = r, this._uniformBindMap = o, this.resources = this._buildResourceAccessor(r, l);
  }
  /**
   * Sometimes a resource group will be provided later (for example global uniforms)
   * In such cases, this method can be used to let the shader know about the group.
   * @param name - the name of the resource group
   * @param groupIndex - the index of the group (should match the webGPU shader group location)
   * @param bindIndex - the index of the bind point (should match the webGPU shader bind point)
   */
  addResource(t, e, i) {
    var r, s;
    (r = this._uniformBindMap)[e] || (r[e] = {}), (s = this._uniformBindMap[e])[i] || (s[i] = t), this.groups[e] || (this.groups[e] = new Ws(), this._ownedBindGroups.push(this.groups[e]));
  }
  _buildResourceAccessor(t, e) {
    const i = {};
    for (const r in e) {
      const s = e[r];
      Object.defineProperty(i, s.name, {
        get() {
          return t[s.group].getResource(s.binding);
        },
        set(a) {
          t[s.group].setResource(a, s.binding);
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
    let s, a;
    return e && (s = dn.from(e)), i && (a = Mh.from(i)), new ua({
      gpuProgram: s,
      glProgram: a,
      ...r
    });
  }
}
const Mr = [];
Pt.handleByNamedList(D.Environment, Mr);
async function md(n) {
  if (!n)
    for (let t = 0; t < Mr.length; t++) {
      const e = Mr[t];
      if (e.value.test()) {
        await e.value.load();
        return;
      }
    }
}
let Ui;
function gd() {
  if (typeof Ui == "boolean")
    return Ui;
  try {
    Ui = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === !0;
  } catch {
    Ui = !1;
  }
  return Ui;
}
var fa = { exports: {} };
fa.exports = pn;
fa.exports.default = pn;
function pn(n, t, e) {
  e = e || 2;
  var i = t && t.length, r = i ? t[0] * e : n.length, s = Bh(n, 0, r, e, !0), a = [];
  if (!s || s.next === s.prev) return a;
  var o, l, c, h, f, d, u;
  if (i && (s = wd(n, t, s, e)), n.length > 80 * e) {
    o = c = n[0], l = h = n[1];
    for (var m = e; m < r; m += e)
      f = n[m], d = n[m + 1], f < o && (o = f), d < l && (l = d), f > c && (c = f), d > h && (h = d);
    u = Math.max(c - o, h - l), u = u !== 0 ? 32767 / u : 0;
  }
  return hs(s, a, e, o, l, u, 0), a;
}
function Bh(n, t, e, i, r) {
  var s, a;
  if (r === Er(n, t, e, i) > 0)
    for (s = t; s < e; s += i) a = co(s, n[s], n[s + 1], a);
  else
    for (s = e - i; s >= t; s -= i) a = co(s, n[s], n[s + 1], a);
  return a && mn(a, a.next) && (us(a), a = a.next), a;
}
function ei(n, t) {
  if (!n) return n;
  t || (t = n);
  var e = n, i;
  do
    if (i = !1, !e.steiner && (mn(e, e.next) || rt(e.prev, e, e.next) === 0)) {
      if (us(e), e = t = e.prev, e === e.next) break;
      i = !0;
    } else
      e = e.next;
  while (i || e !== t);
  return t;
}
function hs(n, t, e, i, r, s, a) {
  if (n) {
    !a && s && Pd(n, i, r, s);
    for (var o = n, l, c; n.prev !== n.next; ) {
      if (l = n.prev, c = n.next, s ? xd(n, i, r, s) : _d(n)) {
        t.push(l.i / e | 0), t.push(n.i / e | 0), t.push(c.i / e | 0), us(n), n = c.next, o = c.next;
        continue;
      }
      if (n = c, n === o) {
        a ? a === 1 ? (n = yd(ei(n), t, e), hs(n, t, e, i, r, s, 2)) : a === 2 && vd(n, t, e, i, r, s) : hs(ei(n), t, e, i, r, s, 1);
        break;
      }
    }
  }
}
function _d(n) {
  var t = n.prev, e = n, i = n.next;
  if (rt(t, e, i) >= 0) return !1;
  for (var r = t.x, s = e.x, a = i.x, o = t.y, l = e.y, c = i.y, h = r < s ? r < a ? r : a : s < a ? s : a, f = o < l ? o < c ? o : c : l < c ? l : c, d = r > s ? r > a ? r : a : s > a ? s : a, u = o > l ? o > c ? o : c : l > c ? l : c, m = i.next; m !== t; ) {
    if (m.x >= h && m.x <= d && m.y >= f && m.y <= u && di(r, o, s, l, a, c, m.x, m.y) && rt(m.prev, m, m.next) >= 0) return !1;
    m = m.next;
  }
  return !0;
}
function xd(n, t, e, i) {
  var r = n.prev, s = n, a = n.next;
  if (rt(r, s, a) >= 0) return !1;
  for (var o = r.x, l = s.x, c = a.x, h = r.y, f = s.y, d = a.y, u = o < l ? o < c ? o : c : l < c ? l : c, m = h < f ? h < d ? h : d : f < d ? f : d, p = o > l ? o > c ? o : c : l > c ? l : c, g = h > f ? h > d ? h : d : f > d ? f : d, x = Tr(u, m, t, e, i), y = Tr(p, g, t, e, i), v = n.prevZ, b = n.nextZ; v && v.z >= x && b && b.z <= y; ) {
    if (v.x >= u && v.x <= p && v.y >= m && v.y <= g && v !== r && v !== a && di(o, h, l, f, c, d, v.x, v.y) && rt(v.prev, v, v.next) >= 0 || (v = v.prevZ, b.x >= u && b.x <= p && b.y >= m && b.y <= g && b !== r && b !== a && di(o, h, l, f, c, d, b.x, b.y) && rt(b.prev, b, b.next) >= 0)) return !1;
    b = b.nextZ;
  }
  for (; v && v.z >= x; ) {
    if (v.x >= u && v.x <= p && v.y >= m && v.y <= g && v !== r && v !== a && di(o, h, l, f, c, d, v.x, v.y) && rt(v.prev, v, v.next) >= 0) return !1;
    v = v.prevZ;
  }
  for (; b && b.z <= y; ) {
    if (b.x >= u && b.x <= p && b.y >= m && b.y <= g && b !== r && b !== a && di(o, h, l, f, c, d, b.x, b.y) && rt(b.prev, b, b.next) >= 0) return !1;
    b = b.nextZ;
  }
  return !0;
}
function yd(n, t, e) {
  var i = n;
  do {
    var r = i.prev, s = i.next.next;
    !mn(r, s) && Rh(r, i, i.next, s) && cs(r, s) && cs(s, r) && (t.push(r.i / e | 0), t.push(i.i / e | 0), t.push(s.i / e | 0), us(i), us(i.next), i = n = s), i = i.next;
  } while (i !== n);
  return ei(i);
}
function vd(n, t, e, i, r, s) {
  var a = n;
  do {
    for (var o = a.next.next; o !== a.prev; ) {
      if (a.i !== o.i && kd(a, o)) {
        var l = Fh(a, o);
        a = ei(a, a.next), l = ei(l, l.next), hs(a, t, e, i, r, s, 0), hs(l, t, e, i, r, s, 0);
        return;
      }
      o = o.next;
    }
    a = a.next;
  } while (a !== n);
}
function wd(n, t, e, i) {
  var r = [], s, a, o, l, c;
  for (s = 0, a = t.length; s < a; s++)
    o = t[s] * i, l = s < a - 1 ? t[s + 1] * i : n.length, c = Bh(n, o, l, i, !1), c === c.next && (c.steiner = !0), r.push(Td(c));
  for (r.sort(bd), s = 0; s < r.length; s++)
    e = Sd(r[s], e);
  return e;
}
function bd(n, t) {
  return n.x - t.x;
}
function Sd(n, t) {
  var e = Ad(n, t);
  if (!e)
    return t;
  var i = Fh(e, n);
  return ei(i, i.next), ei(e, e.next);
}
function Ad(n, t) {
  var e = t, i = n.x, r = n.y, s = -1 / 0, a;
  do {
    if (r <= e.y && r >= e.next.y && e.next.y !== e.y) {
      var o = e.x + (r - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (o <= i && o > s && (s = o, a = e.x < e.next.x ? e : e.next, o === i))
        return a;
    }
    e = e.next;
  } while (e !== t);
  if (!a) return null;
  var l = a, c = a.x, h = a.y, f = 1 / 0, d;
  e = a;
  do
    i >= e.x && e.x >= c && i !== e.x && di(r < h ? i : s, r, c, h, r < h ? s : i, r, e.x, e.y) && (d = Math.abs(r - e.y) / (i - e.x), cs(e, n) && (d < f || d === f && (e.x > a.x || e.x === a.x && Cd(a, e))) && (a = e, f = d)), e = e.next;
  while (e !== l);
  return a;
}
function Cd(n, t) {
  return rt(n.prev, n, t.prev) < 0 && rt(t.next, n, n.next) < 0;
}
function Pd(n, t, e, i) {
  var r = n;
  do
    r.z === 0 && (r.z = Tr(r.x, r.y, t, e, i)), r.prevZ = r.prev, r.nextZ = r.next, r = r.next;
  while (r !== n);
  r.prevZ.nextZ = null, r.prevZ = null, Md(r);
}
function Md(n) {
  var t, e, i, r, s, a, o, l, c = 1;
  do {
    for (e = n, n = null, s = null, a = 0; e; ) {
      for (a++, i = e, o = 0, t = 0; t < c && (o++, i = i.nextZ, !!i); t++)
        ;
      for (l = c; o > 0 || l > 0 && i; )
        o !== 0 && (l === 0 || !i || e.z <= i.z) ? (r = e, e = e.nextZ, o--) : (r = i, i = i.nextZ, l--), s ? s.nextZ = r : n = r, r.prevZ = s, s = r;
      e = i;
    }
    s.nextZ = null, c *= 2;
  } while (a > 1);
  return n;
}
function Tr(n, t, e, i, r) {
  return n = (n - e) * r | 0, t = (t - i) * r | 0, n = (n | n << 8) & 16711935, n = (n | n << 4) & 252645135, n = (n | n << 2) & 858993459, n = (n | n << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, n | t << 1;
}
function Td(n) {
  var t = n, e = n;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== n);
  return e;
}
function di(n, t, e, i, r, s, a, o) {
  return (r - a) * (t - o) >= (n - a) * (s - o) && (n - a) * (i - o) >= (e - a) * (t - o) && (e - a) * (s - o) >= (r - a) * (i - o);
}
function kd(n, t) {
  return n.next.i !== t.i && n.prev.i !== t.i && !Ed(n, t) && // dones't intersect other edges
  (cs(n, t) && cs(t, n) && Id(n, t) && // locally visible
  (rt(n.prev, n, t.prev) || rt(n, t.prev, t)) || // does not create opposite-facing sectors
  mn(n, t) && rt(n.prev, n, n.next) > 0 && rt(t.prev, t, t.next) > 0);
}
function rt(n, t, e) {
  return (t.y - n.y) * (e.x - t.x) - (t.x - n.x) * (e.y - t.y);
}
function mn(n, t) {
  return n.x === t.x && n.y === t.y;
}
function Rh(n, t, e, i) {
  var r = Is(rt(n, t, e)), s = Is(rt(n, t, i)), a = Is(rt(e, i, n)), o = Is(rt(e, i, t));
  return !!(r !== s && a !== o || r === 0 && Es(n, e, t) || s === 0 && Es(n, i, t) || a === 0 && Es(e, n, i) || o === 0 && Es(e, t, i));
}
function Es(n, t, e) {
  return t.x <= Math.max(n.x, e.x) && t.x >= Math.min(n.x, e.x) && t.y <= Math.max(n.y, e.y) && t.y >= Math.min(n.y, e.y);
}
function Is(n) {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}
function Ed(n, t) {
  var e = n;
  do {
    if (e.i !== n.i && e.next.i !== n.i && e.i !== t.i && e.next.i !== t.i && Rh(e, e.next, n, t)) return !0;
    e = e.next;
  } while (e !== n);
  return !1;
}
function cs(n, t) {
  return rt(n.prev, n, n.next) < 0 ? rt(n, t, n.next) >= 0 && rt(n, n.prev, t) >= 0 : rt(n, t, n.prev) < 0 || rt(n, n.next, t) < 0;
}
function Id(n, t) {
  var e = n, i = !1, r = (n.x + t.x) / 2, s = (n.y + t.y) / 2;
  do
    e.y > s != e.next.y > s && e.next.y !== e.y && r < (e.next.x - e.x) * (s - e.y) / (e.next.y - e.y) + e.x && (i = !i), e = e.next;
  while (e !== n);
  return i;
}
function Fh(n, t) {
  var e = new kr(n.i, n.x, n.y), i = new kr(t.i, t.x, t.y), r = n.next, s = t.prev;
  return n.next = t, t.prev = n, e.next = r, r.prev = e, i.next = e, e.prev = i, s.next = i, i.prev = s, i;
}
function co(n, t, e, i) {
  var r = new kr(n, t, e);
  return i ? (r.next = i.next, r.prev = i, i.next.prev = r, i.next = r) : (r.prev = r, r.next = r), r;
}
function us(n) {
  n.next.prev = n.prev, n.prev.next = n.next, n.prevZ && (n.prevZ.nextZ = n.nextZ), n.nextZ && (n.nextZ.prevZ = n.prevZ);
}
function kr(n, t, e) {
  this.i = n, this.x = t, this.y = e, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
pn.deviation = function(n, t, e, i) {
  var r = t && t.length, s = r ? t[0] * e : n.length, a = Math.abs(Er(n, 0, s, e));
  if (r)
    for (var o = 0, l = t.length; o < l; o++) {
      var c = t[o] * e, h = o < l - 1 ? t[o + 1] * e : n.length;
      a -= Math.abs(Er(n, c, h, e));
    }
  var f = 0;
  for (o = 0; o < i.length; o += 3) {
    var d = i[o] * e, u = i[o + 1] * e, m = i[o + 2] * e;
    f += Math.abs(
      (n[d] - n[m]) * (n[u + 1] - n[d + 1]) - (n[d] - n[u]) * (n[m + 1] - n[d + 1])
    );
  }
  return a === 0 && f === 0 ? 0 : Math.abs((f - a) / a);
};
function Er(n, t, e, i) {
  for (var r = 0, s = t, a = e - i; s < e; s += i)
    r += (n[a] - n[s]) * (n[s + 1] + n[a + 1]), a = s;
  return r;
}
pn.flatten = function(n) {
  for (var t = n[0][0].length, e = { vertices: [], holes: [], dimensions: t }, i = 0, r = 0; r < n.length; r++) {
    for (var s = 0; s < n[r].length; s++)
      for (var a = 0; a < t; a++) e.vertices.push(n[r][s][a]);
    r > 0 && (i += n[r - 1].length, e.holes.push(i));
  }
  return e;
};
var Bd = fa.exports;
const Rd = /* @__PURE__ */ Nr(Bd);
var Lh = /* @__PURE__ */ ((n) => (n[n.NONE = 0] = "NONE", n[n.COLOR = 16384] = "COLOR", n[n.STENCIL = 1024] = "STENCIL", n[n.DEPTH = 256] = "DEPTH", n[n.COLOR_DEPTH = 16640] = "COLOR_DEPTH", n[n.COLOR_STENCIL = 17408] = "COLOR_STENCIL", n[n.DEPTH_STENCIL = 1280] = "DEPTH_STENCIL", n[n.ALL = 17664] = "ALL", n))(Lh || {});
class Fd {
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
  emit(t, e, i, r, s, a, o, l) {
    const { name: c, items: h } = this;
    for (let f = 0, d = h.length; f < d; f++)
      h[f][c](t, e, i, r, s, a, o, l);
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
const Ld = [
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
], Oh = class Dh extends Mt {
  /**
   * Set up a system with a collection of SystemClasses and runners.
   * Systems are attached dynamically to this class when added.
   * @param config - the config for the system manager
   */
  constructor(t) {
    super(), this.runners = /* @__PURE__ */ Object.create(null), this.renderPipes = /* @__PURE__ */ Object.create(null), this._initOptions = {}, this._systemsHash = /* @__PURE__ */ Object.create(null), this.type = t.type, this.name = t.name, this.config = t;
    const e = [...Ld, ...this.config.runners ?? []];
    this._addRunners(...e), this._unsafeEvalCheck();
  }
  /**
   * Initialize the renderer.
   * @param options - The options to use to create the renderer.
   */
  async init(t = {}) {
    const e = t.skipExtensionImports === !0 ? !0 : t.manageImports === !1;
    await md(e), this._addSystems(this.config.systems), this._addPipes(this.config.renderPipes, this.config.renderPipeAdaptors);
    for (const i in this._systemsHash)
      t = { ...this._systemsHash[i].constructor.defaultOptions, ...t };
    t = { ...Dh.defaultOptions, ...t }, this._roundPixels = t.roundPixels ? 1 : 0;
    for (let i = 0; i < this.runners.init.items.length; i++)
      await this.runners.init.items[i].init(t);
    this._initOptions = t;
  }
  render(t, e) {
    let i = t;
    if (i instanceof kt && (i = { container: i }, e && ($(Y, "passing a second argument is deprecated, please use render options instead"), i.target = e.renderTexture)), i.target || (i.target = this.view.renderTarget), i.target === this.view.renderTarget && (this._lastObjectRendered = i.container, i.clearColor = this.background.colorRgba), i.clearColor) {
      const r = Array.isArray(i.clearColor) && i.clearColor.length === 4;
      i.clearColor = r ? i.clearColor : ft.shared.setValue(i.clearColor).toArray();
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
    t.target || (t.target = e.renderTarget.renderTarget), t.clearColor || (t.clearColor = this.background.colorRgba), t.clear ?? (t.clear = Lh.ALL);
    const { clear: i, clearColor: r, target: s } = t;
    ft.shared.setValue(r ?? this.background.colorRgba), e.renderTarget.clear(s, i, ft.shared.toArray());
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
      this.runners[e] = new Fd(e);
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
    const i = e.reduce((r, s) => (r[s.name] = s.value, r), {});
    t.forEach((r) => {
      const s = r.value, a = r.name, o = i[a];
      this.renderPipes[a] = new s(
        this,
        o ? new o() : null
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
    if (!gd())
      throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
  }
};
Oh.defaultOptions = {
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
let zh = Oh, Bs;
function Od(n) {
  return Bs !== void 0 || (Bs = (() => {
    var e;
    const t = {
      stencil: !0,
      failIfMajorPerformanceCaveat: n ?? zh.defaultOptions.failIfMajorPerformanceCaveat
    };
    try {
      if (!at.get().getWebGLRenderingContext())
        return !1;
      let r = at.get().createCanvas().getContext("webgl", t);
      const s = !!((e = r == null ? void 0 : r.getContextAttributes()) != null && e.stencil);
      if (r) {
        const a = r.getExtension("WEBGL_lose_context");
        a && a.loseContext();
      }
      return r = null, s;
    } catch {
      return !1;
    }
  })()), Bs;
}
let Rs;
async function Dd(n = {}) {
  return Rs !== void 0 || (Rs = await (async () => {
    const t = at.get().getNavigator().gpu;
    if (!t)
      return !1;
    try {
      return await (await t.requestAdapter(n)).requestDevice(), !0;
    } catch {
      return !1;
    }
  })()), Rs;
}
const uo = ["webgl", "webgpu", "canvas"];
async function zd(n) {
  let t = [];
  n.preference ? (t.push(n.preference), uo.forEach((s) => {
    s !== n.preference && t.push(s);
  })) : t = uo.slice();
  let e, i = {};
  for (let s = 0; s < t.length; s++) {
    const a = t[s];
    if (a === "webgpu" && await Dd()) {
      const { WebGPURenderer: o } = await import("./WebGPURenderer-DAsg-VJu.js");
      e = o, i = { ...n, ...n.webgpu };
      break;
    } else if (a === "webgl" && Od(
      n.failIfMajorPerformanceCaveat ?? zh.defaultOptions.failIfMajorPerformanceCaveat
    )) {
      const { WebGLRenderer: o } = await import("./WebGLRenderer-Btb-saB4.js");
      e = o, i = { ...n, ...n.webgl };
      break;
    } else if (a === "canvas")
      throw i = { ...n }, new Error("CanvasRenderer is not yet implemented");
  }
  if (delete i.webgpu, delete i.webgl, !e)
    throw new Error("No available renderer for the current environment");
  const r = new e();
  return await r.init(i), r;
}
const Uh = "8.5.2";
class Gh {
  static init() {
    var t;
    (t = globalThis.__PIXI_APP_INIT__) == null || t.call(globalThis, this, Uh);
  }
  static destroy() {
  }
}
Gh.extension = D.Application;
class Ud {
  constructor(t) {
    this._renderer = t;
  }
  init() {
    var t;
    (t = globalThis.__PIXI_RENDERER_INIT__) == null || t.call(globalThis, this._renderer, Uh);
  }
  destroy() {
    this._renderer = null;
  }
}
Ud.extension = {
  type: [
    D.WebGLSystem,
    D.WebGPUSystem
  ],
  name: "initHook",
  priority: -10
};
const Vh = class Ir {
  /** @ignore */
  constructor(...t) {
    this.stage = new kt(), t[0] !== void 0 && $(Y, "Application constructor options are deprecated, please use Application.init() instead.");
  }
  /**
   * @param options - The optional application and renderer parameters.
   */
  async init(t) {
    t = { ...t }, this.renderer = await zd(t), Ir._plugins.forEach((e) => {
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
    const i = Ir._plugins.slice(0);
    i.reverse(), i.forEach((r) => {
      r.destroy.call(this);
    }), this.stage.destroy(e), this.stage = null, this.renderer.destroy(t), this.renderer = null;
  }
};
Vh._plugins = [];
let Wh = Vh;
Pt.handleByList(D.Application, Wh._plugins);
Pt.add(Gh);
class Nh extends Mt {
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
const Hh = class Br {
  constructor(t, e, i, r) {
    this.uid = gt("fillGradient"), this.type = "linear", this.gradientStops = [], this._styleKey = null, this.x0 = t, this.y0 = e, this.x1 = i, this.y1 = r;
  }
  addColorStop(t, e) {
    return this.gradientStops.push({ offset: t, color: ft.shared.setValue(e).toHexa() }), this._styleKey = null, this;
  }
  // TODO move to the system!
  buildLinearGradient() {
    const t = Br.defaultTextureSize, { gradientStops: e } = this, i = at.get().createCanvas();
    i.width = t, i.height = t;
    const r = i.getContext("2d"), s = r.createLinearGradient(0, 0, Br.defaultTextureSize, 1);
    for (let p = 0; p < e.length; p++) {
      const g = e[p];
      s.addColorStop(g.offset, g.color);
    }
    r.fillStyle = s, r.fillRect(0, 0, t, t), this.texture = new V({
      source: new Ei({
        resource: i,
        addressModeU: "clamp-to-edge",
        addressModeV: "repeat"
      })
    });
    const { x0: a, y0: o, x1: l, y1: c } = this, h = new H(), f = l - a, d = c - o, u = Math.sqrt(f * f + d * d), m = Math.atan2(d, f);
    h.translate(-a, -o), h.scale(1 / t, 1 / t), h.rotate(-m), h.scale(256 / u, 1), this.transform = h, this._styleKey = null;
  }
  get styleKey() {
    if (this._styleKey)
      return this._styleKey;
    const t = this.gradientStops.map((r) => `${r.offset}-${r.color}`).join("-"), e = this.texture.uid, i = this.transform.toArray().join("-");
    return `fill-gradient-${this.uid}-${t}-${e}-${i}-${this.x0}-${this.y0}-${this.x1}-${this.y1}`;
  }
};
Hh.defaultTextureSize = 256;
let fs = Hh;
const fo = {
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
class gn {
  constructor(t, e) {
    this.uid = gt("fillPattern"), this.transform = new H(), this._styleKey = null, this.texture = t, this.transform.scale(
      1 / t.frame.width,
      1 / t.frame.height
    ), e && (t.source.style.addressModeU = fo[e].addressModeU, t.source.style.addressModeV = fo[e].addressModeV);
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
var Gd = Wd, $n = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }, Vd = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
function Wd(n) {
  var t = [];
  return n.replace(Vd, function(e, i, r) {
    var s = i.toLowerCase();
    for (r = Hd(r), s == "m" && r.length > 2 && (t.push([i].concat(r.splice(0, 2))), s = "l", i = i == "m" ? "l" : "L"); ; ) {
      if (r.length == $n[s])
        return r.unshift(i), t.push(r);
      if (r.length < $n[s]) throw new Error("malformed path data");
      t.push([i].concat(r.splice(0, $n[s])));
    }
  }), t;
}
var Nd = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
function Hd(n) {
  var t = n.match(Nd);
  return t ? t.map(Number) : [];
}
const $d = /* @__PURE__ */ Nr(Gd);
function Yd(n, t) {
  const e = $d(n), i = [];
  let r = null, s = 0, a = 0;
  for (let o = 0; o < e.length; o++) {
    const l = e[o], c = l[0], h = l;
    switch (c) {
      case "M":
        s = h[1], a = h[2], t.moveTo(s, a);
        break;
      case "m":
        s += h[1], a += h[2], t.moveTo(s, a);
        break;
      case "H":
        s = h[1], t.lineTo(s, a);
        break;
      case "h":
        s += h[1], t.lineTo(s, a);
        break;
      case "V":
        a = h[1], t.lineTo(s, a);
        break;
      case "v":
        a += h[1], t.lineTo(s, a);
        break;
      case "L":
        s = h[1], a = h[2], t.lineTo(s, a);
        break;
      case "l":
        s += h[1], a += h[2], t.lineTo(s, a);
        break;
      case "C":
        s = h[5], a = h[6], t.bezierCurveTo(
          h[1],
          h[2],
          h[3],
          h[4],
          s,
          a
        );
        break;
      case "c":
        t.bezierCurveTo(
          s + h[1],
          a + h[2],
          s + h[3],
          a + h[4],
          s + h[5],
          a + h[6]
        ), s += h[5], a += h[6];
        break;
      case "S":
        s = h[3], a = h[4], t.bezierCurveToShort(
          h[1],
          h[2],
          s,
          a
        );
        break;
      case "s":
        t.bezierCurveToShort(
          s + h[1],
          a + h[2],
          s + h[3],
          a + h[4]
        ), s += h[3], a += h[4];
        break;
      case "Q":
        s = h[3], a = h[4], t.quadraticCurveTo(
          h[1],
          h[2],
          s,
          a
        );
        break;
      case "q":
        t.quadraticCurveTo(
          s + h[1],
          a + h[2],
          s + h[3],
          a + h[4]
        ), s += h[3], a += h[4];
        break;
      case "T":
        s = h[1], a = h[2], t.quadraticCurveToShort(
          s,
          a
        );
        break;
      case "t":
        s += h[1], a += h[2], t.quadraticCurveToShort(
          s,
          a
        );
        break;
      case "A":
        s = h[6], a = h[7], t.arcToSvg(
          h[1],
          h[2],
          h[3],
          h[4],
          h[5],
          s,
          a
        );
        break;
      case "a":
        s += h[6], a += h[7], t.arcToSvg(
          h[1],
          h[2],
          h[3],
          h[4],
          h[5],
          s,
          a
        );
        break;
      case "Z":
      case "z":
        t.closePath(), i.length > 0 && (r = i.pop(), r ? (s = r.startX, a = r.startY) : (s = 0, a = 0)), r = null;
        break;
      default:
        ct(`Unknown SVG path command: ${c}`);
    }
    c !== "Z" && c !== "z" && r === null && (r = { startX: s, startY: a }, i.push(r));
  }
  return t;
}
class da {
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
    return new da(this.x, this.y, this.radius);
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
    let r = this.x - t, s = this.y - e;
    return r *= r, s *= s, r + s <= i;
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
    const r = this.x - t, s = this.y - e, a = this.radius, o = i / 2, l = Math.sqrt(r * r + s * s);
    return l < a + o && l > a - o;
  }
  /**
   * Returns the framing rectangle of the circle as a Rectangle object
   * @param out
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new mt(), t.x = this.x - this.radius, t.y = this.y - this.radius, t.width = this.radius * 2, t.height = this.radius * 2, t;
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
class pa {
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
    return new pa(this.x, this.y, this.halfWidth, this.halfHeight);
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
    const { halfWidth: r, halfHeight: s } = this;
    if (r <= 0 || s <= 0)
      return !1;
    const a = i / 2, o = r - a, l = s - a, c = r + a, h = s + a, f = t - this.x, d = e - this.y, u = f * f / (o * o) + d * d / (l * l), m = f * f / (c * c) + d * d / (h * h);
    return u > 1 && m <= 1;
  }
  /**
   * Returns the framing rectangle of the ellipse as a Rectangle object
   * @param out
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new mt(), t.x = this.x - this.halfWidth, t.y = this.y - this.halfHeight, t.width = this.halfWidth * 2, t.height = this.halfHeight * 2, t;
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
function Xd(n, t, e, i, r, s) {
  const a = n - e, o = t - i, l = r - e, c = s - i, h = a * l + o * c, f = l * l + c * c;
  let d = -1;
  f !== 0 && (d = h / f);
  let u, m;
  d < 0 ? (u = e, m = i) : d > 1 ? (u = r, m = s) : (u = e + d * l, m = i + d * c);
  const p = n - u, g = t - m;
  return p * p + g * g;
}
class Qi {
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
      for (let r = 0, s = e.length; r < s; r++)
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
    const t = this.points.slice(), e = new Qi(t);
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
    for (let s = 0, a = r - 1; s < r; a = s++) {
      const o = this.points[s * 2], l = this.points[s * 2 + 1], c = this.points[a * 2], h = this.points[a * 2 + 1];
      l > e != h > e && t < (c - o) * ((e - l) / (h - l)) + o && (i = !i);
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
    const r = i / 2, s = r * r, { points: a } = this, o = a.length - (this.closePath ? 0 : 2);
    for (let l = 0; l < o; l += 2) {
      const c = a[l], h = a[l + 1], f = a[(l + 2) % a.length], d = a[(l + 3) % a.length];
      if (Xd(t, e, c, h, f, d) <= s)
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
    t = t || new mt();
    const e = this.points;
    let i = 1 / 0, r = -1 / 0, s = 1 / 0, a = -1 / 0;
    for (let o = 0, l = e.length; o < l; o += 2) {
      const c = e[o], h = e[o + 1];
      i = c < i ? c : i, r = c > r ? c : r, s = h < s ? h : s, a = h > a ? h : a;
    }
    return t.x = i, t.width = r - i, t.y = s, t.height = a - s, t;
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
const Fs = (n, t, e, i, r, s) => {
  const a = n - e, o = t - i, l = Math.sqrt(a * a + o * o);
  return l >= r - s && l <= r + s;
};
class ma {
  /**
   * @param x - The X coordinate of the upper-left corner of the rounded rectangle
   * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
   * @param width - The overall width of this rounded rectangle
   * @param height - The overall height of this rounded rectangle
   * @param radius - Controls the radius of the rounded corners
   */
  constructor(t = 0, e = 0, i = 0, r = 0, s = 20) {
    this.type = "roundedRectangle", this.x = t, this.y = e, this.width = i, this.height = r, this.radius = s;
  }
  /**
   * Returns the framing rectangle of the rounded rectangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new mt(), t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t;
  }
  /**
   * Creates a clone of this Rounded Rectangle.
   * @returns - A copy of the rounded rectangle.
   */
  clone() {
    return new ma(this.x, this.y, this.width, this.height, this.radius);
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
      let r = t - (this.x + i), s = e - (this.y + i);
      const a = i * i;
      if (r * r + s * s <= a || (r = t - (this.x + this.width - i), r * r + s * s <= a) || (s = e - (this.y + this.height - i), r * r + s * s <= a) || (r = t - (this.x + i), r * r + s * s <= a))
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
    const { x: r, y: s, width: a, height: o, radius: l } = this, c = i / 2, h = r + l, f = s + l, d = a - l * 2, u = o - l * 2, m = r + a, p = s + o;
    return (t >= r - c && t <= r + c || t >= m - c && t <= m + c) && e >= f && e <= f + u || (e >= s - c && e <= s + c || e >= p - c && e <= p + c) && t >= h && t <= h + d ? !0 : (
      // Top-left
      t < h && e < f && Fs(t, e, h, f, l, c) || t > m - l && e < f && Fs(t, e, m - l, f, l, c) || t > m - l && e > p - l && Fs(t, e, m - l, p - l, l, c) || t < h && e > p - l && Fs(t, e, h, p - l, l, c)
    );
  }
  toString() {
    return `[pixi.js/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
  }
}
const jd = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join(`
`);
function Kd(n) {
  let t = "";
  for (let e = 0; e < n; ++e)
    e > 0 && (t += `
else `), e < n - 1 && (t += `if(test == ${e}.0){}`);
  return t;
}
function qd(n, t) {
  if (n === 0)
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  const e = t.createShader(t.FRAGMENT_SHADER);
  try {
    for (; ; ) {
      const i = jd.replace(/%forloop%/gi, Kd(n));
      if (t.shaderSource(e, i), t.compileShader(e), !t.getShaderParameter(e, t.COMPILE_STATUS))
        n = n / 2 | 0;
      else
        break;
    }
  } finally {
    t.deleteShader(e);
  }
  return n;
}
let oi = null;
function $h() {
  var t;
  if (oi)
    return oi;
  const n = Ch();
  return oi = n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS), oi = qd(
    oi,
    n
  ), (t = n.getExtension("WEBGL_lose_context")) == null || t.loseContext(), oi;
}
const Yh = {};
function Zd(n, t) {
  let e = 2166136261;
  for (let i = 0; i < t; i++)
    e ^= n[i].uid, e = Math.imul(e, 16777619), e >>>= 0;
  return Yh[e] || Qd(n, t, e);
}
let Yn = 0;
function Qd(n, t, e) {
  const i = {};
  let r = 0;
  Yn || (Yn = $h());
  for (let a = 0; a < Yn; a++) {
    const o = a < t ? n[a] : V.EMPTY.source;
    i[r++] = o.source, i[r++] = o.style;
  }
  const s = new Ws(i);
  return Yh[e] = s, s;
}
class po {
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
function mo(n, t) {
  const e = n.byteLength / 8 | 0, i = new Float64Array(n, 0, e);
  new Float64Array(t, 0, e).set(i);
  const s = n.byteLength - e * 8;
  if (s > 0) {
    const a = new Uint8Array(n, e * 8, s);
    new Uint8Array(t, e * 8, s).set(a);
  }
}
const Jd = {
  normal: "normal-npm",
  add: "add-npm",
  screen: "screen-npm"
};
var tp = /* @__PURE__ */ ((n) => (n[n.DISABLED = 0] = "DISABLED", n[n.RENDERING_MASK_ADD = 1] = "RENDERING_MASK_ADD", n[n.MASK_ACTIVE = 2] = "MASK_ACTIVE", n[n.INVERSE_MASK_ACTIVE = 3] = "INVERSE_MASK_ACTIVE", n[n.RENDERING_MASK_REMOVE = 4] = "RENDERING_MASK_REMOVE", n[n.NONE = 5] = "NONE", n))(tp || {});
function go(n, t) {
  return t.alphaMode === "no-premultiply-alpha" && Jd[n] || n;
}
class ep {
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
class ip {
  constructor() {
    this.renderPipeId = "batch", this.action = "startBatch", this.start = 0, this.size = 0, this.textures = new ep(), this.blendMode = "normal", this.canBundle = !0;
  }
  destroy() {
    this.textures = null, this.gpuBindGroup = null, this.bindGroup = null, this.batcher = null;
  }
}
const Xh = [];
let Rr = 0;
function _o() {
  return Rr > 0 ? Xh[--Rr] : new ip();
}
function xo(n) {
  Xh[Rr++] = n;
}
let Gi = 0;
const jh = class Ns {
  constructor(t = {}) {
    this.uid = gt("batcher"), this.dirty = !0, this.batchIndex = 0, this.batches = [], this._elements = [], Ns.defaultOptions.maxTextures = Ns.defaultOptions.maxTextures ?? $h(), t = { ...Ns.defaultOptions, ...t };
    const { maxTextures: e, attributesInitialSize: i, indicesInitialSize: r } = t;
    this.attributeBuffer = new po(i * 4), this.indexBuffer = new Uint16Array(r), this.maxTextures = e;
  }
  begin() {
    this.elementSize = 0, this.elementStart = 0, this.indexSize = 0, this.attributeSize = 0;
    for (let t = 0; t < this.batchIndex; t++)
      xo(this.batches[t]);
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
    let i = _o(), r = i.textures;
    r.clear();
    const s = e[this.elementStart];
    let a = go(s.blendMode, s.texture._source);
    this.attributeSize * 4 > this.attributeBuffer.size && this._resizeAttributeBuffer(this.attributeSize * 4), this.indexSize > this.indexBuffer.length && this._resizeIndexBuffer(this.indexSize);
    const o = this.attributeBuffer.float32View, l = this.attributeBuffer.uint32View, c = this.indexBuffer;
    let h = this._batchIndexSize, f = this._batchIndexStart, d = "startBatch";
    const u = this.maxTextures;
    for (let m = this.elementStart; m < this.elementSize; ++m) {
      const p = e[m];
      e[m] = null;
      const x = p.texture._source, y = go(p.blendMode, x), v = a !== y;
      if (x._batchTick === Gi && !v) {
        p._textureId = x._textureBindLocation, h += p.indexSize, p.packAsQuad ? (this.packQuadAttributes(
          p,
          o,
          l,
          p._attributeStart,
          p._textureId
        ), this.packQuadIndex(
          c,
          p._indexStart,
          p._attributeStart / this.vertexSize
        )) : (this.packAttributes(
          p,
          o,
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
      x._batchTick = Gi, (r.count >= u || v) && (this._finishBatch(
        i,
        f,
        h - f,
        r,
        a,
        t,
        d
      ), d = "renderBatch", f = h, a = y, i = _o(), r = i.textures, r.clear(), ++Gi), p._textureId = x._textureBindLocation = r.count, r.ids[x.uid] = r.count, r.textures[r.count++] = x, p._batch = i, h += p.indexSize, p.packAsQuad ? (this.packQuadAttributes(
        p,
        o,
        l,
        p._attributeStart,
        p._textureId
      ), this.packQuadIndex(
        c,
        p._indexStart,
        p._attributeStart / this.vertexSize
      )) : (this.packAttributes(
        p,
        o,
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
      a,
      t,
      d
    ), f = h, ++Gi), this.elementStart = this.elementSize, this._batchIndexStart = f, this._batchIndexSize = h;
  }
  _finishBatch(t, e, i, r, s, a, o) {
    t.gpuBindGroup = null, t.bindGroup = null, t.action = o, t.batcher = this, t.textures = r, t.blendMode = s, t.start = e, t.size = i, ++Gi, this.batches[this.batchIndex++] = t, a.add(t);
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
    const e = Math.max(t, this.attributeBuffer.size * 2), i = new po(e);
    mo(this.attributeBuffer.rawBinaryData, i.rawBinaryData), this.attributeBuffer = i;
  }
  _resizeIndexBuffer(t) {
    const e = this.indexBuffer;
    let i = Math.max(t, e.length * 1.5);
    i += i % 2;
    const r = i > 65535 ? new Uint32Array(i) : new Uint16Array(i);
    if (r.BYTES_PER_ELEMENT !== e.BYTES_PER_ELEMENT)
      for (let s = 0; s < e.length; s++)
        r[s] = e[s];
    else
      mo(e.buffer, r.buffer);
    this.indexBuffer = r;
  }
  packQuadIndex(t, e, i) {
    t[e] = i + 0, t[e + 1] = i + 1, t[e + 2] = i + 2, t[e + 3] = i + 0, t[e + 4] = i + 2, t[e + 5] = i + 3;
  }
  packIndex(t, e, i, r) {
    const s = t.indices, a = t.indexSize, o = t.indexOffset, l = t.attributeOffset;
    for (let c = 0; c < a; c++)
      e[i++] = r + s[c + o] - l;
  }
  destroy() {
    for (let t = 0; t < this.batches.length; t++)
      xo(this.batches[t]);
    this.batches = null;
    for (let t = 0; t < this._elements.length; t++)
      this._elements[t]._batch = null;
    this._elements = null, this.indexBuffer = null, this.attributeBuffer.destroy(), this.attributeBuffer = null;
  }
};
jh.defaultOptions = {
  maxTextures: null,
  attributesInitialSize: 4,
  indicesInitialSize: 6
};
let sp = jh;
var It = /* @__PURE__ */ ((n) => (n[n.MAP_READ = 1] = "MAP_READ", n[n.MAP_WRITE = 2] = "MAP_WRITE", n[n.COPY_SRC = 4] = "COPY_SRC", n[n.COPY_DST = 8] = "COPY_DST", n[n.INDEX = 16] = "INDEX", n[n.VERTEX = 32] = "VERTEX", n[n.UNIFORM = 64] = "UNIFORM", n[n.STORAGE = 128] = "STORAGE", n[n.INDIRECT = 256] = "INDIRECT", n[n.QUERY_RESOLVE = 512] = "QUERY_RESOLVE", n[n.STATIC = 1024] = "STATIC", n))(It || {});
class ds extends Mt {
  /**
   * Creates a new Buffer with the given options
   * @param options - the options for the buffer
   */
  constructor(t) {
    let { data: e, size: i } = t;
    const { usage: r, label: s, shrinkToFit: a } = t;
    super(), this.uid = gt("buffer"), this._resourceType = "buffer", this._resourceId = gt("resource"), this._touched = 0, this._updateID = 1, this.shrinkToFit = !0, this.destroyed = !1, e instanceof Array && (e = new Float32Array(e)), this._data = e, i = i ?? (e == null ? void 0 : e.byteLength);
    const o = !!e;
    this.descriptor = {
      size: i,
      usage: r,
      mappedAtCreation: o,
      label: s
    }, this.shrinkToFit = a ?? !0;
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
    return !!(this.descriptor.usage & It.STATIC);
  }
  set static(t) {
    t ? this.descriptor.usage |= It.STATIC : this.descriptor.usage &= ~It.STATIC;
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
function Kh(n, t) {
  if (!(n instanceof ds)) {
    let e = t ? It.INDEX : It.VERTEX;
    n instanceof Array && (t ? (n = new Uint32Array(n), e = It.INDEX | It.COPY_DST) : (n = new Float32Array(n), e = It.VERTEX | It.COPY_DST)), n = new ds({
      data: n,
      label: t ? "index-mesh-buffer" : "vertex-mesh-buffer",
      usage: e
    });
  }
  return n;
}
function np(n, t, e) {
  const i = n.getAttribute(t);
  if (!i)
    return e.minX = 0, e.minY = 0, e.maxX = 0, e.maxY = 0, e;
  const r = i.buffer.data;
  let s = 1 / 0, a = 1 / 0, o = -1 / 0, l = -1 / 0;
  const c = r.BYTES_PER_ELEMENT, h = (i.offset || 0) / c, f = (i.stride || 2 * 4) / c;
  for (let d = h; d < r.length; d += f) {
    const u = r[d], m = r[d + 1];
    u > o && (o = u), m > l && (l = m), u < s && (s = u), m < a && (a = m);
  }
  return e.minX = s, e.minY = a, e.maxX = o, e.maxY = l, e;
}
function rp(n) {
  return (n instanceof ds || Array.isArray(n) || n.BYTES_PER_ELEMENT) && (n = {
    buffer: n
  }), n.buffer = Kh(n.buffer, !1), n;
}
class ap extends Mt {
  /**
   * Create a new instance of a geometry
   * @param options - The options for the geometry.
   */
  constructor(t = {}) {
    super(), this.uid = gt("geometry"), this._layoutKey = 0, this.instanceCount = 1, this._bounds = new ge(), this._boundsDirty = !0;
    const { attributes: e, indexBuffer: i, topology: r } = t;
    if (this.buffers = [], this.attributes = {}, e)
      for (const s in e)
        this.addAttribute(s, e[s]);
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
    const i = rp(e);
    this.buffers.indexOf(i.buffer) === -1 && (this.buffers.push(i.buffer), i.buffer.on("update", this.onBufferUpdate, this), i.buffer.on("change", this.onBufferUpdate, this)), this.attributes[t] = i;
  }
  /**
   * Adds an index buffer to the geometry.
   * @param indexBuffer - The index buffer to add. Can be a Buffer, TypedArray, or an array of numbers.
   */
  addIndex(t) {
    this.indexBuffer = Kh(t, !0), this.buffers.push(this.indexBuffer);
  }
  /** Returns the bounds of the geometry. */
  get bounds() {
    return this._boundsDirty ? (this._boundsDirty = !1, np(this, "aPosition", this._bounds)) : this._bounds;
  }
  /**
   * destroys the geometry.
   * @param destroyBuffers - destroy the buffers associated with this geometry
   */
  destroy(t = !1) {
    this.emit("destroy", this), this.removeAllListeners(), t && this.buffers.forEach((e) => e.destroy()), this.attributes = null, this.buffers = null, this.indexBuffer = null, this._bounds = null;
  }
}
const op = new Float32Array(1), lp = new Uint32Array(1);
class hp extends ap {
  constructor() {
    const e = new ds({
      data: op,
      label: "attribute-batch-buffer",
      usage: It.VERTEX | It.COPY_DST,
      shrinkToFit: !1
    }), i = new ds({
      data: lp,
      label: "index-batch-buffer",
      usage: It.INDEX | It.COPY_DST,
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
function yo(n, t, e) {
  if (n)
    for (const i in n) {
      const r = i.toLocaleLowerCase(), s = t[r];
      if (s) {
        let a = n[i];
        i === "header" && (a = a.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "")), e && s.push(`//----${e}----//`), s.push(a);
      } else
        ct(`${i} placement hook does not exist in shader`);
    }
}
const cp = /\{\{(.*?)\}\}/g;
function vo(n) {
  var i;
  const t = {};
  return (((i = n.match(cp)) == null ? void 0 : i.map((r) => r.replace(/[{()}]/g, ""))) ?? []).forEach((r) => {
    t[r] = [];
  }), t;
}
function wo(n, t) {
  let e;
  const i = /@in\s+([^;]+);/g;
  for (; (e = i.exec(n)) !== null; )
    t.push(e[1]);
}
function bo(n, t, e = !1) {
  const i = [];
  wo(t, i), n.forEach((o) => {
    o.header && wo(o.header, i);
  });
  const r = i;
  e && r.sort();
  const s = r.map((o, l) => `       @location(${l}) ${o},`).join(`
`);
  let a = t.replace(/@in\s+[^;]+;\s*/g, "");
  return a = a.replace("{{in}}", `
${s}
`), a;
}
function So(n, t) {
  let e;
  const i = /@out\s+([^;]+);/g;
  for (; (e = i.exec(n)) !== null; )
    t.push(e[1]);
}
function up(n) {
  const e = /\b(\w+)\s*:/g.exec(n);
  return e ? e[1] : "";
}
function fp(n) {
  const t = /@.*?\s+/g;
  return n.replace(t, "");
}
function dp(n, t) {
  const e = [];
  So(t, e), n.forEach((l) => {
    l.header && So(l.header, e);
  });
  let i = 0;
  const r = e.sort().map((l) => l.indexOf("builtin") > -1 ? l : `@location(${i++}) ${l}`).join(`,
`), s = e.sort().map((l) => `       var ${fp(l)};`).join(`
`), a = `return VSOutput(
                ${e.sort().map((l) => ` ${up(l)}`).join(`,
`)});`;
  let o = t.replace(/@out\s+[^;]+;\s*/g, "");
  return o = o.replace("{{struct}}", `
${r}
`), o = o.replace("{{start}}", `
${s}
`), o = o.replace("{{return}}", `
${a}
`), o;
}
function Ao(n, t) {
  let e = n;
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
const Ie = /* @__PURE__ */ Object.create(null), Xn = /* @__PURE__ */ new Map();
let pp = 0;
function mp({
  template: n,
  bits: t
}) {
  const e = qh(n, t);
  if (Ie[e])
    return Ie[e];
  const { vertex: i, fragment: r } = _p(n, t);
  return Ie[e] = Zh(i, r, t), Ie[e];
}
function gp({
  template: n,
  bits: t
}) {
  const e = qh(n, t);
  return Ie[e] || (Ie[e] = Zh(n.vertex, n.fragment, t)), Ie[e];
}
function _p(n, t) {
  const e = t.map((a) => a.vertex).filter((a) => !!a), i = t.map((a) => a.fragment).filter((a) => !!a);
  let r = bo(e, n.vertex, !0);
  r = dp(e, r);
  const s = bo(i, n.fragment, !0);
  return {
    vertex: r,
    fragment: s
  };
}
function qh(n, t) {
  return t.map((e) => (Xn.has(e) || Xn.set(e, pp++), Xn.get(e))).sort((e, i) => e - i).join("-") + n.vertex + n.fragment;
}
function Zh(n, t, e) {
  const i = vo(n), r = vo(t);
  return e.forEach((s) => {
    yo(s.vertex, i, s.name), yo(s.fragment, r, s.name);
  }), {
    vertex: Ao(n, i),
    fragment: Ao(t, r)
  };
}
const xp = (
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
), yp = (
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
), vp = (
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
), wp = (
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
), bp = {
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
}, Sp = {
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
function Ap({ bits: n, name: t }) {
  const e = mp({
    template: {
      fragment: yp,
      vertex: xp
    },
    bits: [
      bp,
      ...n
    ]
  });
  return dn.from({
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
function Cp({ bits: n, name: t }) {
  return new Mh({
    name: t,
    ...gp({
      template: {
        vertex: vp,
        fragment: wp
      },
      bits: [
        Sp,
        ...n
      ]
    })
  });
}
const Pp = {
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
}, Mp = {
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
}, jn = {};
function Tp(n) {
  const t = [];
  if (n === 1)
    t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"), t.push("@group(1) @binding(1) var textureSampler1: sampler;");
  else {
    let e = 0;
    for (let i = 0; i < n; i++)
      t.push(`@group(1) @binding(${e++}) var textureSource${i + 1}: texture_2d<f32>;`), t.push(`@group(1) @binding(${e++}) var textureSampler${i + 1}: sampler;`);
  }
  return t.join(`
`);
}
function kp(n) {
  const t = [];
  if (n === 1)
    t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");
  else {
    t.push("switch vTextureId {");
    for (let e = 0; e < n; e++)
      e === n - 1 ? t.push("  default:{") : t.push(`  case ${e}:{`), t.push(`      outColor = textureSampleGrad(textureSource${e + 1}, textureSampler${e + 1}, vUV, uvDx, uvDy);`), t.push("      break;}");
    t.push("}");
  }
  return t.join(`
`);
}
function Ep(n) {
  return jn[n] || (jn[n] = {
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

                ${Tp(n)}
            `,
      main: `
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${kp(n)}
            `
    }
  }), jn[n];
}
const Kn = {};
function Ip(n) {
  const t = [];
  for (let e = 0; e < n; e++)
    e > 0 && t.push("else"), e < n - 1 && t.push(`if(vTextureId < ${e}.5)`), t.push("{"), t.push(`	outColor = texture(uTextures[${e}], vUV);`), t.push("}");
  return t.join(`
`);
}
function Bp(n) {
  return Kn[n] || (Kn[n] = {
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

                uniform sampler2D uTextures[${n}];

            `,
      main: `

                ${Ip(n)}
            `
    }
  }), Kn[n];
}
const Rp = {
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
}, Fp = {
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
}, Co = {};
function Lp(n) {
  let t = Co[n];
  if (t)
    return t;
  const e = new Int32Array(n);
  for (let i = 0; i < n; i++)
    e[i] = i;
  return t = Co[n] = new Ih({
    uTextures: { value: e, type: "i32", size: n }
  }, { isStatic: !0 }), t;
}
class Op extends ua {
  constructor(t) {
    const e = Cp({
      name: "batch",
      bits: [
        Mp,
        Bp(t),
        Fp
      ]
    }), i = Ap({
      name: "batch",
      bits: [
        Pp,
        Ep(t),
        Rp
      ]
    });
    super({
      glProgram: e,
      gpuProgram: i,
      resources: {
        batchSamplers: Lp(t)
      }
    });
  }
}
let Po = null;
const Qh = class Jh extends sp {
  constructor() {
    super(...arguments), this.geometry = new hp(), this.shader = Po || (Po = new Op(this.maxTextures)), this.name = Jh.extension.name, this.vertexSize = 6;
  }
  /**
   * Packs the attributes of a DefaultBatchableMeshElement into the provided views.
   * @param element - The DefaultBatchableMeshElement to pack.
   * @param float32View - The Float32Array view to pack into.
   * @param uint32View - The Uint32Array view to pack into.
   * @param index - The starting index in the views.
   * @param textureId - The texture ID to use.
   */
  packAttributes(t, e, i, r, s) {
    const a = s << 16 | t.roundPixels & 65535, o = t.transform, l = o.a, c = o.b, h = o.c, f = o.d, d = o.tx, u = o.ty, { positions: m, uvs: p } = t, g = t.color, x = t.attributeOffset, y = x + t.attributeSize;
    for (let v = x; v < y; v++) {
      const b = v * 2, _ = m[b], S = m[b + 1];
      e[r++] = l * _ + h * S + d, e[r++] = f * S + c * _ + u, e[r++] = p[b], e[r++] = p[b + 1], i[r++] = g, i[r++] = a;
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
  packQuadAttributes(t, e, i, r, s) {
    const a = t.texture, o = t.transform, l = o.a, c = o.b, h = o.c, f = o.d, d = o.tx, u = o.ty, m = t.bounds, p = m.maxX, g = m.minX, x = m.maxY, y = m.minY, v = a.uvs, b = t.color, _ = s << 16 | t.roundPixels & 65535;
    e[r + 0] = l * g + h * y + d, e[r + 1] = f * y + c * g + u, e[r + 2] = v.x0, e[r + 3] = v.y0, i[r + 4] = b, i[r + 5] = _, e[r + 6] = l * p + h * y + d, e[r + 7] = f * y + c * p + u, e[r + 8] = v.x1, e[r + 9] = v.y1, i[r + 10] = b, i[r + 11] = _, e[r + 12] = l * p + h * x + d, e[r + 13] = f * x + c * p + u, e[r + 14] = v.x2, e[r + 15] = v.y2, i[r + 16] = b, i[r + 17] = _, e[r + 18] = l * g + h * x + d, e[r + 19] = f * x + c * g + u, e[r + 20] = v.x3, e[r + 21] = v.y3, i[r + 22] = b, i[r + 23] = _;
  }
};
Qh.extension = {
  type: [
    D.Batcher
  ],
  name: "default"
};
let Dp = Qh;
function zp(n, t, e, i, r, s, a, o = null) {
  let l = 0;
  e *= t, r *= s;
  const c = o.a, h = o.b, f = o.c, d = o.d, u = o.tx, m = o.ty;
  for (; l < a; ) {
    const p = n[e], g = n[e + 1];
    i[r] = c * p + f * g + u, i[r + 1] = h * p + d * g + m, r += s, e += t, l++;
  }
}
function Up(n, t, e, i) {
  let r = 0;
  for (t *= e; r < i; )
    n[t] = 0, n[t + 1] = 0, t += e, r++;
}
function tc(n, t, e, i, r) {
  const s = t.a, a = t.b, o = t.c, l = t.d, c = t.tx, h = t.ty;
  e = e || 0, i = i || 2, r = r || n.length / i - e;
  let f = e * i;
  for (let d = 0; d < r; d++) {
    const u = n[f], m = n[f + 1];
    n[f] = s * u + o * m + c, n[f + 1] = a * u + l * m + h, f += i;
  }
}
function Gp(n, t) {
  if (n === 16777215 || !t)
    return t;
  if (t === 16777215 || !n)
    return n;
  const e = n >> 16 & 255, i = n >> 8 & 255, r = n & 255, s = t >> 16 & 255, a = t >> 8 & 255, o = t & 255, l = e * s / 255, c = i * a / 255, h = r * o / 255;
  return (l << 16) + (c << 8) + h;
}
const Vp = new H();
class ec {
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
    return i ? Gp(e, i.groupColor) + (this.alpha * i.groupAlpha * 255 << 24) : e + (this.alpha * 255 << 24);
  }
  get transform() {
    var t;
    return ((t = this.renderable) == null ? void 0 : t.groupTransform) || Vp;
  }
  copyTo(t) {
    t.indexOffset = this.indexOffset, t.indexSize = this.indexSize, t.attributeOffset = this.attributeOffset, t.attributeSize = this.attributeSize, t.baseColor = this.baseColor, t.alpha = this.alpha, t.texture = this.texture, t.geometryData = this.geometryData;
  }
  reset() {
    this.applyTransform = !0, this.renderable = null;
  }
}
const ps = {
  extension: {
    type: D.ShapeBuilder,
    name: "circle"
  },
  build(n, t) {
    let e, i, r, s, a, o;
    if (n.type === "circle") {
      const b = n;
      e = b.x, i = b.y, a = o = b.radius, r = s = 0;
    } else if (n.type === "ellipse") {
      const b = n;
      e = b.x, i = b.y, a = b.halfWidth, o = b.halfHeight, r = s = 0;
    } else {
      const b = n, _ = b.width / 2, S = b.height / 2;
      e = b.x + _, i = b.y + S, a = o = Math.max(0, Math.min(b.radius, Math.min(_, S))), r = _ - a, s = S - o;
    }
    if (!(a >= 0 && o >= 0 && r >= 0 && s >= 0))
      return t;
    const l = Math.ceil(2.3 * Math.sqrt(a + o)), c = l * 8 + (r ? 4 : 0) + (s ? 4 : 0);
    if (c === 0)
      return t;
    if (l === 0)
      return t[0] = t[6] = e + r, t[1] = t[3] = i + s, t[2] = t[4] = e - r, t[5] = t[7] = i - s, t;
    let h = 0, f = l * 4 + (r ? 2 : 0) + 2, d = f, u = c, m = r + a, p = s, g = e + m, x = e - m, y = i + p;
    if (t[h++] = g, t[h++] = y, t[--f] = y, t[--f] = x, s) {
      const b = i - p;
      t[d++] = x, t[d++] = b, t[--u] = b, t[--u] = g;
    }
    for (let b = 1; b < l; b++) {
      const _ = Math.PI / 2 * (b / l), S = r + Math.cos(_) * a, C = s + Math.sin(_) * o, w = e + S, A = e - S, P = i + C, M = i - C;
      t[h++] = w, t[h++] = P, t[--f] = P, t[--f] = A, t[d++] = A, t[d++] = M, t[--u] = M, t[--u] = w;
    }
    m = r, p = s + o, g = e + m, x = e - m, y = i + p;
    const v = i - p;
    return t[h++] = g, t[h++] = y, t[--u] = v, t[--u] = g, r && (t[h++] = x, t[h++] = y, t[--u] = v, t[--u] = x), t;
  },
  triangulate(n, t, e, i, r, s) {
    if (n.length === 0)
      return;
    let a = 0, o = 0;
    for (let h = 0; h < n.length; h += 2)
      a += n[h], o += n[h + 1];
    a /= n.length / 2, o /= n.length / 2;
    let l = i;
    t[l * e] = a, t[l * e + 1] = o;
    const c = l++;
    for (let h = 0; h < n.length; h += 2)
      t[l * e] = n[h], t[l * e + 1] = n[h + 1], h > 0 && (r[s++] = l, r[s++] = c, r[s++] = l - 1), l++;
    r[s++] = c + 1, r[s++] = c, r[s++] = l - 1;
  }
}, Wp = { ...ps, extension: { ...ps.extension, name: "ellipse" } }, Np = { ...ps, extension: { ...ps.extension, name: "roundedRectangle" } }, Hp = 1e-4, Mo = 1e-4;
function $p(n) {
  const t = n.length;
  if (t < 6)
    return 1;
  let e = 0;
  for (let i = 0, r = n[t - 2], s = n[t - 1]; i < t; i += 2) {
    const a = n[i], o = n[i + 1];
    e += (a - r) * (o + s), r = a, s = o;
  }
  return e < 0 ? -1 : 1;
}
function To(n, t, e, i, r, s, a, o) {
  const l = n - e * r, c = t - i * r, h = n + e * s, f = t + i * s;
  let d, u;
  a ? (d = i, u = -e) : (d = -i, u = e);
  const m = l + d, p = c + u, g = h + d, x = f + u;
  return o.push(m, p), o.push(g, x), 2;
}
function Ue(n, t, e, i, r, s, a, o) {
  const l = e - n, c = i - t;
  let h = Math.atan2(l, c), f = Math.atan2(r - n, s - t);
  o && h < f ? h += Math.PI * 2 : !o && h > f && (f += Math.PI * 2);
  let d = h;
  const u = f - h, m = Math.abs(u), p = Math.sqrt(l * l + c * c), g = (15 * m * Math.sqrt(p) / Math.PI >> 0) + 1, x = u / g;
  if (d += x, o) {
    a.push(n, t), a.push(e, i);
    for (let y = 1, v = d; y < g; y++, v += x)
      a.push(n, t), a.push(
        n + Math.sin(v) * p,
        t + Math.cos(v) * p
      );
    a.push(n, t), a.push(r, s);
  } else {
    a.push(e, i), a.push(n, t);
    for (let y = 1, v = d; y < g; y++, v += x)
      a.push(
        n + Math.sin(v) * p,
        t + Math.cos(v) * p
      ), a.push(n, t);
    a.push(r, s), a.push(n, t);
  }
  return g * 2;
}
function Yp(n, t, e, i, r, s, a, o, l) {
  const c = Hp;
  if (n.length === 0)
    return;
  const h = t;
  let f = h.alignment;
  if (t.alignment !== 0.5) {
    let U = $p(n);
    f = (f - 0.5) * U + 0.5;
  }
  const d = new St(n[0], n[1]), u = new St(n[n.length - 2], n[n.length - 1]), m = i, p = Math.abs(d.x - u.x) < c && Math.abs(d.y - u.y) < c;
  if (m) {
    n = n.slice(), p && (n.pop(), n.pop(), u.set(n[n.length - 2], n[n.length - 1]));
    const U = (d.x + u.x) * 0.5, j = (u.y + d.y) * 0.5;
    n.unshift(U, j), n.push(U, j);
  }
  const g = r, x = n.length / 2;
  let y = n.length;
  const v = g.length / 2, b = h.width / 2, _ = b * b, S = h.miterLimit * h.miterLimit;
  let C = n[0], w = n[1], A = n[2], P = n[3], M = 0, T = 0, k = -(w - P), E = C - A, I = 0, B = 0, R = Math.sqrt(k * k + E * E);
  k /= R, E /= R, k *= b, E *= b;
  const z = f, F = (1 - z) * 2, L = z * 2;
  m || (h.cap === "round" ? y += Ue(
    C - k * (F - L) * 0.5,
    w - E * (F - L) * 0.5,
    C - k * F,
    w - E * F,
    C + k * L,
    w + E * L,
    g,
    !0
  ) + 2 : h.cap === "square" && (y += To(C, w, k, E, F, L, !0, g))), g.push(
    C - k * F,
    w - E * F
  ), g.push(
    C + k * L,
    w + E * L
  );
  for (let U = 1; U < x - 1; ++U) {
    C = n[(U - 1) * 2], w = n[(U - 1) * 2 + 1], A = n[U * 2], P = n[U * 2 + 1], M = n[(U + 1) * 2], T = n[(U + 1) * 2 + 1], k = -(w - P), E = C - A, R = Math.sqrt(k * k + E * E), k /= R, E /= R, k *= b, E *= b, I = -(P - T), B = A - M, R = Math.sqrt(I * I + B * B), I /= R, B /= R, I *= b, B *= b;
    const j = A - C, J = w - P, Q = A - M, G = T - P, Et = j * Q + J * G, lt = J * Q - G * j, Zt = lt < 0;
    if (Math.abs(lt) < 1e-3 * Math.abs(Et)) {
      g.push(
        A - k * F,
        P - E * F
      ), g.push(
        A + k * L,
        P + E * L
      ), Et >= 0 && (h.join === "round" ? y += Ue(
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
    const Dt = (-k + C) * (-E + P) - (-k + A) * (-E + w), zt = (-I + M) * (-B + P) - (-I + A) * (-B + T), dt = (j * zt - Q * Dt) / lt, ni = (G * Dt - J * zt) / lt, Fi = (dt - A) * (dt - A) + (ni - P) * (ni - P), _e = A + (dt - A) * F, ae = P + (ni - P) * F, oe = A - (dt - A) * L, Qt = P - (ni - P) * L, Jt = Math.min(j * j + J * J, Q * Q + G * G), Li = Zt ? F : L, Oi = Jt + Li * Li * _;
    Fi <= Oi ? h.join === "bevel" || Fi / _ > S ? (Zt ? (g.push(_e, ae), g.push(A + k * L, P + E * L), g.push(_e, ae), g.push(A + I * L, P + B * L)) : (g.push(A - k * F, P - E * F), g.push(oe, Qt), g.push(A - I * F, P - B * F), g.push(oe, Qt)), y += 2) : h.join === "round" ? Zt ? (g.push(_e, ae), g.push(A + k * L, P + E * L), y += Ue(
      A,
      P,
      A + k * L,
      P + E * L,
      A + I * L,
      P + B * L,
      g,
      !0
    ) + 4, g.push(_e, ae), g.push(A + I * L, P + B * L)) : (g.push(A - k * F, P - E * F), g.push(oe, Qt), y += Ue(
      A,
      P,
      A - k * F,
      P - E * F,
      A - I * F,
      P - B * F,
      g,
      !1
    ) + 4, g.push(A - I * F, P - B * F), g.push(oe, Qt)) : (g.push(_e, ae), g.push(oe, Qt)) : (g.push(A - k * F, P - E * F), g.push(A + k * L, P + E * L), h.join === "round" ? Zt ? y += Ue(
      A,
      P,
      A + k * L,
      P + E * L,
      A + I * L,
      P + B * L,
      g,
      !0
    ) + 2 : y += Ue(
      A,
      P,
      A - k * F,
      P - E * F,
      A - I * F,
      P - B * F,
      g,
      !1
    ) + 2 : h.join === "miter" && Fi / _ <= S && (Zt ? (g.push(oe, Qt), g.push(oe, Qt)) : (g.push(_e, ae), g.push(_e, ae)), y += 2), g.push(A - I * F, P - B * F), g.push(A + I * L, P + B * L), y += 2);
  }
  C = n[(x - 2) * 2], w = n[(x - 2) * 2 + 1], A = n[(x - 1) * 2], P = n[(x - 1) * 2 + 1], k = -(w - P), E = C - A, R = Math.sqrt(k * k + E * E), k /= R, E /= R, k *= b, E *= b, g.push(A - k * F, P - E * F), g.push(A + k * L, P + E * L), m || (h.cap === "round" ? y += Ue(
    A - k * (F - L) * 0.5,
    P - E * (F - L) * 0.5,
    A - k * F,
    P - E * F,
    A + k * L,
    P + E * L,
    g,
    !1
  ) + 2 : h.cap === "square" && (y += To(A, P, k, E, F, L, !1, g)));
  const Z = Mo * Mo;
  for (let U = v; U < y + v - 2; ++U)
    C = g[U * 2], w = g[U * 2 + 1], A = g[(U + 1) * 2], P = g[(U + 1) * 2 + 1], M = g[(U + 2) * 2], T = g[(U + 2) * 2 + 1], !(Math.abs(C * (P - T) + A * (T - w) + M * (w - P)) < Z) && o.push(U, U + 1, U + 2);
}
function ic(n, t, e, i, r, s, a) {
  const o = Rd(n, t, 2);
  if (!o)
    return;
  for (let c = 0; c < o.length; c += 3)
    s[a++] = o[c] + r, s[a++] = o[c + 1] + r, s[a++] = o[c + 2] + r;
  let l = r * i;
  for (let c = 0; c < n.length; c += 2)
    e[l] = n[c], e[l + 1] = n[c + 1], l += i;
}
const Xp = [], jp = {
  extension: {
    type: D.ShapeBuilder,
    name: "polygon"
  },
  build(n, t) {
    for (let e = 0; e < n.points.length; e++)
      t[e] = n.points[e];
    return t;
  },
  triangulate(n, t, e, i, r, s) {
    ic(n, Xp, t, e, i, r, s);
  }
}, Kp = {
  extension: {
    type: D.ShapeBuilder,
    name: "rectangle"
  },
  build(n, t) {
    const e = n, i = e.x, r = e.y, s = e.width, a = e.height;
    return s >= 0 && a >= 0 && (t[0] = i, t[1] = r, t[2] = i + s, t[3] = r, t[4] = i + s, t[5] = r + a, t[6] = i, t[7] = r + a), t;
  },
  triangulate(n, t, e, i, r, s) {
    let a = 0;
    i *= e, t[i + a] = n[0], t[i + a + 1] = n[1], a += e, t[i + a] = n[2], t[i + a + 1] = n[3], a += e, t[i + a] = n[6], t[i + a + 1] = n[7], a += e, t[i + a] = n[4], t[i + a + 1] = n[5], a += e;
    const o = i / e;
    r[s++] = o, r[s++] = o + 1, r[s++] = o + 2, r[s++] = o + 1, r[s++] = o + 3, r[s++] = o + 2;
  }
}, qp = {
  extension: {
    type: D.ShapeBuilder,
    name: "triangle"
  },
  build(n, t) {
    return t[0] = n.x, t[1] = n.y, t[2] = n.x2, t[3] = n.y2, t[4] = n.x3, t[5] = n.y3, t;
  },
  triangulate(n, t, e, i, r, s) {
    let a = 0;
    i *= e, t[i + a] = n[0], t[i + a + 1] = n[1], a += e, t[i + a] = n[2], t[i + a + 1] = n[3], a += e, t[i + a] = n[4], t[i + a + 1] = n[5];
    const o = i / e;
    r[s++] = o, r[s++] = o + 1, r[s++] = o + 2;
  }
}, _n = {};
Pt.handleByMap(D.ShapeBuilder, _n);
Pt.add(Kp, jp, qp, ps, Wp, Np);
const Zp = new mt();
function Qp(n, t) {
  const { geometryData: e, batches: i } = t;
  i.length = 0, e.indices.length = 0, e.vertices.length = 0, e.uvs.length = 0;
  for (let r = 0; r < n.instructions.length; r++) {
    const s = n.instructions[r];
    if (s.action === "texture")
      Jp(s.data, i, e);
    else if (s.action === "fill" || s.action === "stroke") {
      const a = s.action === "stroke", o = s.data.path.shapePath, l = s.data.style, c = s.data.hole;
      a && c && ko(c.shapePath, l, null, !0, i, e), ko(o, l, c, a, i, e);
    }
  }
}
function Jp(n, t, e) {
  const { vertices: i, uvs: r, indices: s } = e, a = s.length, o = i.length / 2, l = [], c = _n.rectangle, h = Zp, f = n.image;
  h.x = n.dx, h.y = n.dy, h.width = n.dw, h.height = n.dh;
  const d = n.transform;
  c.build(h, l), d && tc(l, d), c.triangulate(l, i, 2, o, s, a);
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
  const m = be.get(ec);
  m.indexOffset = a, m.indexSize = s.length - a, m.attributeOffset = o, m.attributeSize = i.length / 2 - o, m.baseColor = n.style, m.alpha = n.alpha, m.texture = f, m.geometryData = e, t.push(m);
}
function ko(n, t, e, i, r, s) {
  const { vertices: a, uvs: o, indices: l } = s, c = n.shapePrimitives.length - 1;
  n.shapePrimitives.forEach(({ shape: h, transform: f }, d) => {
    const u = l.length, m = a.length / 2, p = [], g = _n[h.type];
    if (g.build(h, p), f && tc(p, f), i) {
      const b = h.closePath ?? !0;
      Yp(p, t, !1, b, a, 2, m, l);
    } else if (e && c === d) {
      c !== 0 && console.warn("[Pixi Graphics] only the last shape have be cut out");
      const b = [], _ = p.slice();
      tm(e.shapePath).forEach((C) => {
        b.push(_.length / 2), _.push(...C);
      }), ic(_, b, a, 2, m, l, u);
    } else
      g.triangulate(p, a, 2, m, l, u);
    const x = o.length / 2, y = t.texture;
    if (y !== V.WHITE) {
      const b = t.matrix;
      b && (f && b.append(f.clone().invert()), zp(a, 2, m, o, x, 2, a.length / 2 - m, b));
    } else
      Up(o, x, 2, a.length / 2 - m);
    const v = be.get(ec);
    v.indexOffset = u, v.indexSize = l.length - u, v.attributeOffset = m, v.attributeSize = a.length / 2 - m, v.baseColor = t.color, v.alpha = t.alpha, v.texture = y, v.geometryData = s, r.push(v);
  });
}
function tm(n) {
  if (!n)
    return [];
  const t = n.shapePrimitives, e = [];
  for (let i = 0; i < t.length; i++) {
    const r = t[i].shape, s = [];
    _n[r.type].build(r, s), e.push(s);
  }
  return e;
}
class em {
  constructor() {
    this.batches = [], this.geometryData = {
      vertices: [],
      uvs: [],
      indices: []
    };
  }
}
class im {
  constructor() {
    this.batcher = new Dp(), this.instructions = new ch();
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
    return $(hf, "GraphicsContextRenderData#geometry is deprecated, please use batcher.geometry instead."), this.batcher.geometry;
  }
}
const ga = class Fr {
  constructor(t) {
    this._gpuContextHash = {}, this._graphicsDataContextHash = /* @__PURE__ */ Object.create(null), t.renderableGC.addManagedHash(this, "_gpuContextHash"), t.renderableGC.addManagedHash(this, "_graphicsDataContextHash");
  }
  /**
   * Runner init called, update the default options
   * @ignore
   */
  init(t) {
    Fr.defaultOptions.bezierSmoothness = (t == null ? void 0 : t.bezierSmoothness) ?? Fr.defaultOptions.bezierSmoothness;
  }
  getContextRenderData(t) {
    return this._graphicsDataContextHash[t.uid] || this._initContextRenderData(t);
  }
  // Context management functions
  updateGpuContext(t) {
    let e = this._gpuContextHash[t.uid] || this._initContext(t);
    if (t.dirty) {
      e ? this._cleanGraphicsContextData(t) : e = this._initContext(t), Qp(t, e);
      const i = t.batchMode;
      t.customShader || i === "no-batch" ? e.isBatchable = !1 : i === "auto" && (e.isBatchable = e.geometryData.vertices.length < 400), t.dirty = !1;
    }
    return e;
  }
  getGpuContext(t) {
    return this._gpuContextHash[t.uid] || this._initContext(t);
  }
  _initContextRenderData(t) {
    const e = be.get(im), { batches: i, geometryData: r } = this._gpuContextHash[t.uid], s = r.vertices.length, a = r.indices.length;
    for (let h = 0; h < i.length; h++)
      i[h].applyTransform = !1;
    const o = e.batcher;
    o.ensureAttributeBuffer(s), o.ensureIndexBuffer(a), o.begin();
    for (let h = 0; h < i.length; h++) {
      const f = i[h];
      o.add(f);
    }
    o.finish(e.instructions);
    const l = o.geometry;
    l.indexBuffer.setDataWithSize(o.indexBuffer, o.indexSize, !0), l.buffers[0].setDataWithSize(o.attributeBuffer.float32View, o.attributeSize, !0);
    const c = o.batches;
    for (let h = 0; h < c.length; h++) {
      const f = c[h];
      f.bindGroup = Zd(f.textures.textures, f.textures.count);
    }
    return this._graphicsDataContextHash[t.uid] = e, e;
  }
  _initContext(t) {
    const e = new em();
    return e.context = t, this._gpuContextHash[t.uid] = e, t.on("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid];
  }
  onGraphicsContextDestroy(t) {
    this._cleanGraphicsContextData(t), t.off("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid] = null;
  }
  _cleanGraphicsContextData(t) {
    const e = this._gpuContextHash[t.uid];
    e.isBatchable || this._graphicsDataContextHash[t.uid] && (be.return(this.getContextRenderData(t)), this._graphicsDataContextHash[t.uid] = null), e.batches && e.batches.forEach((i) => {
      be.return(i);
    });
  }
  destroy() {
    for (const t in this._gpuContextHash)
      this._gpuContextHash[t] && this.onGraphicsContextDestroy(this._gpuContextHash[t].context);
  }
};
ga.extension = {
  type: [
    D.WebGLSystem,
    D.WebGPUSystem,
    D.CanvasSystem
  ],
  name: "graphicsContext"
};
ga.defaultOptions = {
  /**
   * A value from 0 to 1 that controls the smoothness of bezier curves (the higher the smoother)
   * @default 0.5
   */
  bezierSmoothness: 0.5
};
let sc = ga;
const sm = 8, Ls = 11920929e-14, nm = 1;
function nc(n, t, e, i, r, s, a, o, l, c) {
  const f = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, c ?? sc.defaultOptions.bezierSmoothness)
  );
  let d = (nm - f) / 1;
  return d *= d, rm(t, e, i, r, s, a, o, l, n, d), n;
}
function rm(n, t, e, i, r, s, a, o, l, c) {
  Lr(n, t, e, i, r, s, a, o, l, c, 0), l.push(a, o);
}
function Lr(n, t, e, i, r, s, a, o, l, c, h) {
  if (h > sm)
    return;
  const f = (n + e) / 2, d = (t + i) / 2, u = (e + r) / 2, m = (i + s) / 2, p = (r + a) / 2, g = (s + o) / 2, x = (f + u) / 2, y = (d + m) / 2, v = (u + p) / 2, b = (m + g) / 2, _ = (x + v) / 2, S = (y + b) / 2;
  if (h > 0) {
    let C = a - n, w = o - t;
    const A = Math.abs((e - a) * w - (i - o) * C), P = Math.abs((r - a) * w - (s - o) * C);
    if (A > Ls && P > Ls) {
      if ((A + P) * (A + P) <= c * (C * C + w * w)) {
        l.push(_, S);
        return;
      }
    } else if (A > Ls) {
      if (A * A <= c * (C * C + w * w)) {
        l.push(_, S);
        return;
      }
    } else if (P > Ls) {
      if (P * P <= c * (C * C + w * w)) {
        l.push(_, S);
        return;
      }
    } else if (C = _ - (n + a) / 2, w = S - (t + o) / 2, C * C + w * w <= c) {
      l.push(_, S);
      return;
    }
  }
  Lr(n, t, f, d, x, y, _, S, l, c, h + 1), Lr(_, S, v, b, p, g, a, o, l, c, h + 1);
}
const am = 8, om = 11920929e-14, lm = 1;
function hm(n, t, e, i, r, s, a, o) {
  const c = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, o ?? sc.defaultOptions.bezierSmoothness)
  );
  let h = (lm - c) / 1;
  return h *= h, cm(t, e, i, r, s, a, n, h), n;
}
function cm(n, t, e, i, r, s, a, o) {
  Or(a, n, t, e, i, r, s, o, 0), a.push(r, s);
}
function Or(n, t, e, i, r, s, a, o, l) {
  if (l > am)
    return;
  const c = (t + i) / 2, h = (e + r) / 2, f = (i + s) / 2, d = (r + a) / 2, u = (c + f) / 2, m = (h + d) / 2;
  let p = s - t, g = a - e;
  const x = Math.abs((i - s) * g - (r - a) * p);
  if (x > om) {
    if (x * x <= o * (p * p + g * g)) {
      n.push(u, m);
      return;
    }
  } else if (p = u - (t + s) / 2, g = m - (e + a) / 2, p * p + g * g <= o) {
    n.push(u, m);
    return;
  }
  Or(n, t, e, c, h, u, m, o, l + 1), Or(n, u, m, f, d, s, a, o, l + 1);
}
function rc(n, t, e, i, r, s, a, o) {
  let l = Math.abs(r - s);
  (!a && r > s || a && s > r) && (l = 2 * Math.PI - l), o = o || Math.max(6, Math.floor(6 * Math.pow(i, 1 / 3) * (l / Math.PI))), o = Math.max(o, 3);
  let c = l / o, h = r;
  c *= a ? -1 : 1;
  for (let f = 0; f < o + 1; f++) {
    const d = Math.cos(h), u = Math.sin(h), m = t + d * i, p = e + u * i;
    n.push(m, p), h += c;
  }
}
function um(n, t, e, i, r, s) {
  const a = n[n.length - 2], l = n[n.length - 1] - e, c = a - t, h = r - e, f = i - t, d = Math.abs(l * f - c * h);
  if (d < 1e-8 || s === 0) {
    (n[n.length - 2] !== t || n[n.length - 1] !== e) && n.push(t, e);
    return;
  }
  const u = l * l + c * c, m = h * h + f * f, p = l * h + c * f, g = s * Math.sqrt(u) / d, x = s * Math.sqrt(m) / d, y = g * p / u, v = x * p / m, b = g * f + x * c, _ = g * h + x * l, S = c * (x + y), C = l * (x + y), w = f * (g + v), A = h * (g + v), P = Math.atan2(C - _, S - b), M = Math.atan2(A - _, w - b);
  rc(
    n,
    b + t,
    _ + e,
    s,
    P,
    M,
    c * h > f * l
  );
}
const Ji = Math.PI * 2, qn = {
  centerX: 0,
  centerY: 0,
  ang1: 0,
  ang2: 0
}, Zn = ({ x: n, y: t }, e, i, r, s, a, o, l) => {
  n *= e, t *= i;
  const c = r * n - s * t, h = s * n + r * t;
  return l.x = c + a, l.y = h + o, l;
};
function fm(n, t) {
  const e = t === -1.5707963267948966 ? -0.551915024494 : 1.3333333333333333 * Math.tan(t / 4), i = t === 1.5707963267948966 ? 0.551915024494 : e, r = Math.cos(n), s = Math.sin(n), a = Math.cos(n + t), o = Math.sin(n + t);
  return [
    {
      x: r - s * i,
      y: s + r * i
    },
    {
      x: a + o * i,
      y: o - a * i
    },
    {
      x: a,
      y: o
    }
  ];
}
const Eo = (n, t, e, i) => {
  const r = n * i - t * e < 0 ? -1 : 1;
  let s = n * e + t * i;
  return s > 1 && (s = 1), s < -1 && (s = -1), r * Math.acos(s);
}, dm = (n, t, e, i, r, s, a, o, l, c, h, f, d) => {
  const u = Math.pow(r, 2), m = Math.pow(s, 2), p = Math.pow(h, 2), g = Math.pow(f, 2);
  let x = u * m - u * g - m * p;
  x < 0 && (x = 0), x /= u * g + m * p, x = Math.sqrt(x) * (a === o ? -1 : 1);
  const y = x * r / s * f, v = x * -s / r * h, b = c * y - l * v + (n + e) / 2, _ = l * y + c * v + (t + i) / 2, S = (h - y) / r, C = (f - v) / s, w = (-h - y) / r, A = (-f - v) / s, P = Eo(1, 0, S, C);
  let M = Eo(S, C, w, A);
  o === 0 && M > 0 && (M -= Ji), o === 1 && M < 0 && (M += Ji), d.centerX = b, d.centerY = _, d.ang1 = P, d.ang2 = M;
};
function pm(n, t, e, i, r, s, a, o = 0, l = 0, c = 0) {
  if (s === 0 || a === 0)
    return;
  const h = Math.sin(o * Ji / 360), f = Math.cos(o * Ji / 360), d = f * (t - i) / 2 + h * (e - r) / 2, u = -h * (t - i) / 2 + f * (e - r) / 2;
  if (d === 0 && u === 0)
    return;
  s = Math.abs(s), a = Math.abs(a);
  const m = Math.pow(d, 2) / Math.pow(s, 2) + Math.pow(u, 2) / Math.pow(a, 2);
  m > 1 && (s *= Math.sqrt(m), a *= Math.sqrt(m)), dm(
    t,
    e,
    i,
    r,
    s,
    a,
    l,
    c,
    h,
    f,
    d,
    u,
    qn
  );
  let { ang1: p, ang2: g } = qn;
  const { centerX: x, centerY: y } = qn;
  let v = Math.abs(g) / (Ji / 4);
  Math.abs(1 - v) < 1e-7 && (v = 1);
  const b = Math.max(Math.ceil(v), 1);
  g /= b;
  let _ = n[n.length - 2], S = n[n.length - 1];
  const C = { x: 0, y: 0 };
  for (let w = 0; w < b; w++) {
    const A = fm(p, g), { x: P, y: M } = Zn(A[0], s, a, f, h, x, y, C), { x: T, y: k } = Zn(A[1], s, a, f, h, x, y, C), { x: E, y: I } = Zn(A[2], s, a, f, h, x, y, C);
    nc(
      n,
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
function mm(n, t, e) {
  const i = (a, o) => {
    const l = o.x - a.x, c = o.y - a.y, h = Math.sqrt(l * l + c * c), f = l / h, d = c / h;
    return { len: h, nx: f, ny: d };
  }, r = (a, o) => {
    a === 0 ? n.moveTo(o.x, o.y) : n.lineTo(o.x, o.y);
  };
  let s = t[t.length - 1];
  for (let a = 0; a < t.length; a++) {
    const o = t[a % t.length], l = o.radius ?? e;
    if (l <= 0) {
      r(a, o), s = o;
      continue;
    }
    const c = t[(a + 1) % t.length], h = i(o, s), f = i(o, c);
    if (h.len < 1e-4 || f.len < 1e-4) {
      r(a, o), s = o;
      continue;
    }
    let d = Math.asin(h.nx * f.ny - h.ny * f.nx), u = 1, m = !1;
    h.nx * f.nx - h.ny * -f.ny < 0 ? d < 0 ? d = Math.PI + d : (d = Math.PI - d, u = -1, m = !0) : d > 0 && (u = -1, m = !0);
    const p = d / 2;
    let g, x = Math.abs(
      Math.cos(p) * l / Math.sin(p)
    );
    x > Math.min(h.len / 2, f.len / 2) ? (x = Math.min(h.len / 2, f.len / 2), g = Math.abs(x * Math.sin(p) / Math.cos(p))) : g = l;
    const y = o.x + f.nx * x + -f.ny * g * u, v = o.y + f.ny * x + f.nx * g * u, b = Math.atan2(h.ny, h.nx) + Math.PI / 2 * u, _ = Math.atan2(f.ny, f.nx) - Math.PI / 2 * u;
    a === 0 && n.moveTo(
      y + Math.cos(b) * g,
      v + Math.sin(b) * g
    ), n.arc(y, v, g, b, _, m), s = o;
  }
}
function gm(n, t, e, i) {
  const r = (o, l) => Math.sqrt((o.x - l.x) ** 2 + (o.y - l.y) ** 2), s = (o, l, c) => ({
    x: o.x + (l.x - o.x) * c,
    y: o.y + (l.y - o.y) * c
  }), a = t.length;
  for (let o = 0; o < a; o++) {
    const l = t[(o + 1) % a], c = l.radius ?? e;
    if (c <= 0) {
      o === 0 ? n.moveTo(l.x, l.y) : n.lineTo(l.x, l.y);
      continue;
    }
    const h = t[o], f = t[(o + 2) % a], d = r(h, l);
    let u;
    if (d < 1e-4)
      u = l;
    else {
      const g = Math.min(d / 2, c);
      u = s(
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
      p = s(
        l,
        f,
        g / m
      );
    }
    o === 0 ? n.moveTo(u.x, u.y) : n.lineTo(u.x, u.y), n.quadraticCurveTo(l.x, l.y, p.x, p.y, i);
  }
}
const _m = new mt();
class xm {
  constructor(t) {
    this.shapePrimitives = [], this._currentPoly = null, this._bounds = new ge(), this._graphicsPath2D = t;
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
    const i = this._currentPoly.points, r = i[i.length - 2], s = i[i.length - 1];
    return (r !== t || s !== e) && i.push(t, e), this;
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
  arc(t, e, i, r, s, a) {
    this._ensurePoly(!1);
    const o = this._currentPoly.points;
    return rc(o, t, e, i, r, s, a), this;
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
  arcTo(t, e, i, r, s) {
    this._ensurePoly();
    const a = this._currentPoly.points;
    return um(a, t, e, i, r, s), this;
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
  arcToSvg(t, e, i, r, s, a, o) {
    const l = this._currentPoly.points;
    return pm(
      l,
      this._currentPoly.lastX,
      this._currentPoly.lastY,
      a,
      o,
      t,
      e,
      i,
      r,
      s
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
  bezierCurveTo(t, e, i, r, s, a, o) {
    this._ensurePoly();
    const l = this._currentPoly;
    return nc(
      this._currentPoly.points,
      l.lastX,
      l.lastY,
      t,
      e,
      i,
      r,
      s,
      a,
      o
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
  quadraticCurveTo(t, e, i, r, s) {
    this._ensurePoly();
    const a = this._currentPoly;
    return hm(
      this._currentPoly.points,
      a.lastX,
      a.lastY,
      t,
      e,
      i,
      r,
      s
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
  rect(t, e, i, r, s) {
    return this.drawShape(new mt(t, e, i, r), s), this;
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
    return this.drawShape(new da(t, e, i), r), this;
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
    const r = new Qi(t);
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
  regularPoly(t, e, i, r, s = 0, a) {
    r = Math.max(r | 0, 3);
    const o = -1 * Math.PI / 2 + s, l = Math.PI * 2 / r, c = [];
    for (let h = 0; h < r; h++) {
      const f = h * l + o;
      c.push(
        t + i * Math.cos(f),
        e + i * Math.sin(f)
      );
    }
    return this.poly(c, !0, a), this;
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
  roundPoly(t, e, i, r, s, a = 0, o) {
    if (r = Math.max(r | 0, 3), s <= 0)
      return this.regularPoly(t, e, i, r, a);
    const l = i * Math.sin(Math.PI / r) - 1e-3;
    s = Math.min(s, l);
    const c = -1 * Math.PI / 2 + a, h = Math.PI * 2 / r, f = (r - 2) * Math.PI / r / 2;
    for (let d = 0; d < r; d++) {
      const u = d * h + c, m = t + i * Math.cos(u), p = e + i * Math.sin(u), g = u + Math.PI + f, x = u - Math.PI - f, y = m + s * Math.cos(g), v = p + s * Math.sin(g), b = m + s * Math.cos(x), _ = p + s * Math.sin(x);
      d === 0 ? this.moveTo(y, v) : this.lineTo(y, v), this.quadraticCurveTo(m, p, b, _, o);
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
    return t.length < 3 ? this : (i ? gm(this, t, e, r) : mm(this, t, e), this.closePath());
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
  filletRect(t, e, i, r, s) {
    if (s === 0)
      return this.rect(t, e, i, r);
    const a = Math.min(i, r) / 2, o = Math.min(a, Math.max(-a, s)), l = t + i, c = e + r, h = o < 0 ? -o : 0, f = Math.abs(o);
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
  chamferRect(t, e, i, r, s, a) {
    if (s <= 0)
      return this.rect(t, e, i, r);
    const o = Math.min(s, Math.min(i, r) / 2), l = t + i, c = e + r, h = [
      t + o,
      e,
      l - o,
      e,
      l,
      e + o,
      l,
      c - o,
      l - o,
      c,
      t + o,
      c,
      t,
      c - o,
      t,
      e + o
    ];
    for (let f = h.length - 1; f >= 2; f -= 2)
      h[f] === h[f - 2] && h[f - 1] === h[f - 3] && h.splice(f - 1, 2);
    return this.poly(h, !0, a);
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
  ellipse(t, e, i, r, s) {
    return this.drawShape(new pa(t, e, i, r), s), this;
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
  roundRect(t, e, i, r, s, a) {
    return this.drawShape(new ma(t, e, i, r, s), a), this;
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
    return i && this.endPoly(), i = new Qi(), i.points.push(t, e), this._currentPoly = i, this;
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
    if (!this._currentPoly && (this._currentPoly = new Qi(), t)) {
      const e = this.shapePrimitives[this.shapePrimitives.length - 1];
      if (e) {
        let i = e.shape.x, r = e.shape.y;
        if (e.transform && !e.transform.isIdentity()) {
          const s = e.transform, a = i;
          i = s.a * i + s.c * r + s.tx, r = s.b * a + s.d * r + s.ty;
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
      const r = e[i], s = r.shape.getBounds(_m);
      r.transform ? t.addRect(s, r.transform) : t.addRect(s);
    }
    return t;
  }
}
class Mi {
  /**
   * Creates a `GraphicsPath` instance optionally from an SVG path string or an array of `PathInstruction`.
   * @param instructions - An SVG path string or an array of `PathInstruction` objects.
   */
  constructor(t) {
    this.instructions = [], this.uid = gt("graphicsPath"), this._dirty = !0, typeof t == "string" ? Yd(t, this) : this.instructions = (t == null ? void 0 : t.slice()) ?? [];
  }
  /**
   * Provides access to the internal shape path, ensuring it is up-to-date with the current instructions.
   * @returns The `ShapePath` instance associated with this `GraphicsPath`.
   */
  get shapePath() {
    return this._shapePath || (this._shapePath = new xm(this)), this._dirty && (this._dirty = !1, this._shapePath.buildPath()), this._shapePath;
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
  bezierCurveToShort(t, e, i, r, s) {
    const a = this.instructions[this.instructions.length - 1], o = this.getLastPoint(St.shared);
    let l = 0, c = 0;
    if (!a || a.action !== "bezierCurveTo")
      l = o.x, c = o.y;
    else {
      l = a.data[2], c = a.data[3];
      const h = o.x, f = o.y;
      l = h + (h - l), c = f + (f - c);
    }
    return this.instructions.push({ action: "bezierCurveTo", data: [l, c, t, e, i, r, s] }), this._dirty = !0, this;
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
    const r = this.instructions[this.instructions.length - 1], s = this.getLastPoint(St.shared);
    let a = 0, o = 0;
    if (!r || r.action !== "quadraticCurveTo")
      a = s.x, o = s.y;
    else {
      a = r.data[0], o = r.data[1];
      const l = s.x, c = s.y;
      a = l + (l - a), o = c + (c - o);
    }
    return this.instructions.push({ action: "quadraticCurveTo", data: [a, o, t, e, i] }), this._dirty = !0, this;
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
  rect(t, e, i, r, s) {
    return this.instructions.push({ action: "rect", data: [t, e, i, r, s] }), this._dirty = !0, this;
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
  star(t, e, i, r, s, a, o) {
    s = s || r / 2;
    const l = -1 * Math.PI / 2 + a, c = i * 2, h = Math.PI * 2 / c, f = [];
    for (let d = 0; d < c; d++) {
      const u = d % 2 ? s : r, m = d * h + l;
      f.push(
        t + u * Math.cos(m),
        e + u * Math.sin(m)
      );
    }
    return this.poly(f, !0, o), this;
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
    const e = new Mi();
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
    const e = t.a, i = t.b, r = t.c, s = t.d, a = t.tx, o = t.ty;
    let l = 0, c = 0, h = 0, f = 0, d = 0, u = 0, m = 0, p = 0;
    for (let g = 0; g < this.instructions.length; g++) {
      const x = this.instructions[g], y = x.data;
      switch (x.action) {
        case "moveTo":
        case "lineTo":
          l = y[0], c = y[1], y[0] = e * l + r * c + a, y[1] = i * l + s * c + o;
          break;
        case "bezierCurveTo":
          h = y[0], f = y[1], d = y[2], u = y[3], l = y[4], c = y[5], y[0] = e * h + r * f + a, y[1] = i * h + s * f + o, y[2] = e * d + r * u + a, y[3] = i * d + s * u + o, y[4] = e * l + r * c + a, y[5] = i * l + s * c + o;
          break;
        case "quadraticCurveTo":
          h = y[0], f = y[1], l = y[2], c = y[3], y[0] = e * h + r * f + a, y[1] = i * h + s * f + o, y[2] = e * l + r * c + a, y[3] = i * l + s * c + o;
          break;
        case "arcToSvg":
          l = y[5], c = y[6], m = y[0], p = y[1], y[0] = e * m + r * p, y[1] = i * m + s * p, y[5] = e * l + r * c + a, y[6] = i * l + s * c + o;
          break;
        case "circle":
          y[4] = Vi(y[3], t);
          break;
        case "rect":
          y[4] = Vi(y[4], t);
          break;
        case "ellipse":
          y[8] = Vi(y[8], t);
          break;
        case "roundRect":
          y[5] = Vi(y[5], t);
          break;
        case "addPath":
          y[0].transform(t);
          break;
        case "poly":
          y[2] = Vi(y[2], t);
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
function Vi(n, t) {
  return n ? n.prepend(t) : t.clone();
}
function ym(n, t) {
  if (typeof n == "string") {
    const i = document.createElement("div");
    i.innerHTML = n.trim(), n = i.querySelector("svg");
  }
  const e = {
    context: t,
    path: new Mi()
  };
  return ac(n, e, null, null), t;
}
function ac(n, t, e, i) {
  const r = n.children, { fillStyle: s, strokeStyle: a } = vm(n);
  s && e ? e = { ...e, ...s } : s && (e = s), a && i ? i = { ...i, ...a } : a && (i = a), t.context.fillStyle = e, t.context.strokeStyle = i;
  let o, l, c, h, f, d, u, m, p, g, x, y, v, b, _, S, C;
  switch (n.nodeName.toLowerCase()) {
    case "path":
      b = n.getAttribute("d"), _ = new Mi(b), t.context.path(_), e && t.context.fill(), i && t.context.stroke();
      break;
    case "circle":
      u = _t(n, "cx", 0), m = _t(n, "cy", 0), p = _t(n, "r", 0), t.context.ellipse(u, m, p, p), e && t.context.fill(), i && t.context.stroke();
      break;
    case "rect":
      o = _t(n, "x", 0), l = _t(n, "y", 0), S = _t(n, "width", 0), C = _t(n, "height", 0), g = _t(n, "rx", 0), x = _t(n, "ry", 0), g || x ? t.context.roundRect(o, l, S, C, g || x) : t.context.rect(o, l, S, C), e && t.context.fill(), i && t.context.stroke();
      break;
    case "ellipse":
      u = _t(n, "cx", 0), m = _t(n, "cy", 0), g = _t(n, "rx", 0), x = _t(n, "ry", 0), t.context.beginPath(), t.context.ellipse(u, m, g, x), e && t.context.fill(), i && t.context.stroke();
      break;
    case "line":
      c = _t(n, "x1", 0), h = _t(n, "y1", 0), f = _t(n, "x2", 0), d = _t(n, "y2", 0), t.context.beginPath(), t.context.moveTo(c, h), t.context.lineTo(f, d), i && t.context.stroke();
      break;
    case "polygon":
      v = n.getAttribute("points"), y = v.match(/\d+/g).map((w) => parseInt(w, 10)), t.context.poly(y, !0), e && t.context.fill(), i && t.context.stroke();
      break;
    case "polyline":
      v = n.getAttribute("points"), y = v.match(/\d+/g).map((w) => parseInt(w, 10)), t.context.poly(y, !1), i && t.context.stroke();
      break;
    case "g":
    case "svg":
      break;
    default: {
      console.info(`[SVG parser] <${n.nodeName}> elements unsupported`);
      break;
    }
  }
  for (let w = 0; w < r.length; w++)
    ac(r[w], t, e, i);
}
function _t(n, t, e) {
  const i = n.getAttribute(t);
  return i ? Number(i) : e;
}
function vm(n) {
  const t = n.getAttribute("style"), e = {}, i = {};
  let r = !1, s = !1;
  if (t) {
    const a = t.split(";");
    for (let o = 0; o < a.length; o++) {
      const l = a[o], [c, h] = l.split(":");
      switch (c) {
        case "stroke":
          h !== "none" && (e.color = ft.shared.setValue(h).toNumber(), s = !0);
          break;
        case "stroke-width":
          e.width = Number(h);
          break;
        case "fill":
          h !== "none" && (r = !0, i.color = ft.shared.setValue(h).toNumber());
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
    const a = n.getAttribute("stroke");
    a && a !== "none" && (s = !0, e.color = ft.shared.setValue(a).toNumber(), e.width = _t(n, "stroke-width", 1));
    const o = n.getAttribute("fill");
    o && o !== "none" && (r = !0, i.color = ft.shared.setValue(o).toNumber());
  }
  return {
    strokeStyle: s ? e : null,
    fillStyle: r ? i : null
  };
}
function wm(n) {
  return ft.isColorLike(n);
}
function Io(n) {
  return n instanceof gn;
}
function Bo(n) {
  return n instanceof fs;
}
function bm(n, t, e) {
  const i = ft.shared.setValue(t ?? 0);
  return n.color = i.toNumber(), n.alpha = i.alpha === 1 ? e.alpha : i.alpha, n.texture = V.WHITE, { ...e, ...n };
}
function Ro(n, t, e) {
  return n.fill = t, n.color = 16777215, n.texture = t.texture, n.matrix = t.transform, { ...e, ...n };
}
function Fo(n, t, e) {
  return t.buildLinearGradient(), n.fill = t, n.color = 16777215, n.texture = t.texture, n.matrix = t.transform, { ...e, ...n };
}
function Sm(n, t) {
  var r;
  const e = { ...t, ...n };
  if (e.texture) {
    if (e.texture !== V.WHITE) {
      const a = ((r = e.matrix) == null ? void 0 : r.invert()) || new H();
      a.translate(e.texture.frame.x, e.texture.frame.y), a.scale(1 / e.texture.source.width, 1 / e.texture.source.height), e.matrix = a;
    }
    const s = e.texture.source.style;
    s.addressMode === "clamp-to-edge" && (s.addressMode = "repeat", s.update());
  }
  const i = ft.shared.setValue(e.color);
  return e.alpha *= i.alpha, e.color = i.toNumber(), e.matrix = e.matrix ? e.matrix.clone() : null, e;
}
function je(n, t) {
  if (n == null)
    return null;
  const e = {}, i = n;
  return wm(n) ? bm(e, n, t) : Io(n) ? Ro(e, n, t) : Bo(n) ? Fo(e, n, t) : i.fill && Io(i.fill) ? Ro(i, i.fill, t) : i.fill && Bo(i.fill) ? Fo(i, i.fill, t) : Sm(i, t);
}
function en(n, t) {
  const { width: e, alignment: i, miterLimit: r, cap: s, join: a, ...o } = t, l = je(n, o);
  return l ? {
    width: e,
    alignment: i,
    miterLimit: r,
    cap: s,
    join: a,
    ...l
  } : null;
}
const Am = new St(), Lo = new H(), _a = class he extends Mt {
  constructor() {
    super(...arguments), this.uid = gt("graphicsContext"), this.dirty = !0, this.batchMode = "auto", this.instructions = [], this._activePath = new Mi(), this._transform = new H(), this._fillStyle = { ...he.defaultFillStyle }, this._strokeStyle = { ...he.defaultStrokeStyle }, this._stateStack = [], this._tick = 0, this._bounds = new ge(), this._boundsDirty = !0;
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
    this._strokeStyle = en(t, he.defaultStrokeStyle);
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
  texture(t, e, i, r, s, a) {
    return this.instructions.push({
      action: "texture",
      data: {
        image: t,
        dx: i || 0,
        dy: r || 0,
        dw: s || t.frame.width,
        dh: a || t.frame.height,
        transform: this._transform.clone(),
        alpha: this._fillStyle.alpha,
        style: e ? ft.shared.setValue(e).toNumber() : 16777215
      }
    }), this.onUpdate(), this;
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  beginPath() {
    return this._activePath = new Mi(), this;
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
    return this._tick === 0 && i && i.action === "fill" ? e = i.data.path : e = this._activePath.clone(), e ? (t != null && (this._strokeStyle = en(t, he.defaultStrokeStyle)), this.instructions.push({
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
  arc(t, e, i, r, s, a) {
    this._tick++;
    const o = this._transform;
    return this._activePath.arc(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      i,
      r,
      s,
      a
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
  arcTo(t, e, i, r, s) {
    this._tick++;
    const a = this._transform;
    return this._activePath.arcTo(
      a.a * t + a.c * e + a.tx,
      a.b * t + a.d * e + a.ty,
      a.a * i + a.c * r + a.tx,
      a.b * i + a.d * r + a.ty,
      s
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
  arcToSvg(t, e, i, r, s, a, o) {
    this._tick++;
    const l = this._transform;
    return this._activePath.arcToSvg(
      t,
      e,
      i,
      // should we rotate this with transform??
      r,
      s,
      l.a * a + l.c * o + l.tx,
      l.b * a + l.d * o + l.ty
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
  bezierCurveTo(t, e, i, r, s, a, o) {
    this._tick++;
    const l = this._transform;
    return this._activePath.bezierCurveTo(
      l.a * t + l.c * e + l.tx,
      l.b * t + l.d * e + l.ty,
      l.a * i + l.c * r + l.tx,
      l.b * i + l.d * r + l.ty,
      l.a * s + l.c * a + l.tx,
      l.b * s + l.d * a + l.ty,
      o
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
    const i = this._transform, r = this._activePath.instructions, s = i.a * t + i.c * e + i.tx, a = i.b * t + i.d * e + i.ty;
    return r.length === 1 && r[0].action === "moveTo" ? (r[0].data[0] = s, r[0].data[1] = a, this) : (this._activePath.moveTo(
      s,
      a
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
  quadraticCurveTo(t, e, i, r, s) {
    this._tick++;
    const a = this._transform;
    return this._activePath.quadraticCurveTo(
      a.a * t + a.c * e + a.tx,
      a.b * t + a.d * e + a.ty,
      a.a * i + a.c * r + a.tx,
      a.b * i + a.d * r + a.ty,
      s
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
  roundRect(t, e, i, r, s) {
    return this._tick++, this._activePath.roundRect(t, e, i, r, s, this._transform.clone()), this;
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
  regularPoly(t, e, i, r, s = 0, a) {
    return this._tick++, this._activePath.regularPoly(t, e, i, r, s, a), this;
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
  roundPoly(t, e, i, r, s, a) {
    return this._tick++, this._activePath.roundPoly(t, e, i, r, s, a), this;
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
  filletRect(t, e, i, r, s) {
    return this._tick++, this._activePath.filletRect(t, e, i, r, s), this;
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
  chamferRect(t, e, i, r, s, a) {
    return this._tick++, this._activePath.chamferRect(t, e, i, r, s, a), this;
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
  star(t, e, i, r, s = 0, a = 0) {
    return this._tick++, this._activePath.star(t, e, i, r, s, a, this._transform.clone()), this;
  }
  /**
   * Parses and renders an SVG string into the graphics context. This allows for complex shapes and paths
   * defined in SVG format to be drawn within the graphics context.
   * @param svg - The SVG string to be parsed and rendered.
   */
  svg(t) {
    return this._tick++, ym(t, this), this;
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
  setTransform(t, e, i, r, s, a) {
    return t instanceof H ? (this._transform.set(t.a, t.b, t.c, t.d, t.tx, t.ty), this) : (this._transform.set(t, e, i, r, s, a), this);
  }
  transform(t, e, i, r, s, a) {
    return t instanceof H ? (this._transform.append(t), this) : (Lo.set(t, e, i, r, s, a), this._transform.append(Lo), this);
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
        const s = i.data;
        t.addBounds(s.path.bounds);
      } else if (r === "texture") {
        const s = i.data;
        t.addFrame(s.dx, s.dy, s.dx + s.dw, s.dy + s.dh, s.transform);
      }
      if (r === "stroke") {
        const s = i.data, a = s.style.width / 2, o = s.path.bounds;
        t.addFrame(
          o.minX - a,
          o.minY - a,
          o.maxX + a,
          o.maxY + a
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
    for (let s = 0; s < e.length; s++) {
      const a = e[s], o = a.data, l = o.path;
      if (!a.action || !l)
        continue;
      const c = o.style, h = l.shapePath.shapePrimitives;
      for (let f = 0; f < h.length; f++) {
        const d = h[f].shape;
        if (!c || !d)
          continue;
        const u = h[f].transform, m = u ? u.applyInverse(t, Am) : t;
        a.action === "fill" ? i = d.contains(m.x, m.y) : i = d.strokeContains(m.x, m.y, c.width);
        const p = o.hole;
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
_a.defaultFillStyle = {
  /** The color to use for the fill. */
  color: 16777215,
  /** The alpha value to use for the fill. */
  alpha: 1,
  /** The texture to use for the fill. */
  texture: V.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null
};
_a.defaultStrokeStyle = {
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
  texture: V.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null
};
let Yt = _a;
const Oo = [
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
function Cm(n) {
  const t = [];
  let e = 0;
  for (let i = 0; i < Oo.length; i++) {
    const r = `_${Oo[i]}`;
    t[e++] = n[r];
  }
  return e = oc(n._fill, t, e), e = Pm(n._stroke, t, e), e = Mm(n.dropShadow, t, e), t.join("-");
}
function oc(n, t, e) {
  var i;
  return n && (t[e++] = n.color, t[e++] = n.alpha, t[e++] = (i = n.fill) == null ? void 0 : i.styleKey), e;
}
function Pm(n, t, e) {
  return n && (e = oc(n, t, e), t[e++] = n.width, t[e++] = n.alignment, t[e++] = n.cap, t[e++] = n.join, t[e++] = n.miterLimit), e;
}
function Mm(n, t, e) {
  return n && (t[e++] = n.alpha, t[e++] = n.angle, t[e++] = n.blur, t[e++] = n.distance, t[e++] = ft.shared.setValue(n.color).toNumber()), e;
}
const xa = class li extends Mt {
  constructor(t = {}) {
    super(), Tm(t);
    const e = { ...li.defaultTextStyle, ...t };
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
    t !== null && typeof t == "object" ? this._dropShadow = this._createProxy({ ...li.defaultDropShadow, ...t }) : this._dropShadow = t ? this._createProxy({ ...li.defaultDropShadow }) : null, this.update();
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
    t !== this._originalFill && (this._originalFill = t, this._isFillStyle(t) && (this._originalFill = this._createProxy({ ...Yt.defaultFillStyle, ...t }, () => {
      this._fill = je(
        { ...this._originalFill },
        Yt.defaultFillStyle
      );
    })), this._fill = je(
      t === 0 ? "black" : t,
      Yt.defaultFillStyle
    ), this.update());
  }
  /** A fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'. */
  get stroke() {
    return this._originalStroke;
  }
  set stroke(t) {
    t !== this._originalStroke && (this._originalStroke = t, this._isFillStyle(t) && (this._originalStroke = this._createProxy({ ...Yt.defaultStrokeStyle, ...t }, () => {
      this._stroke = en(
        { ...this._originalStroke },
        Yt.defaultStrokeStyle
      );
    })), this._stroke = en(t, Yt.defaultStrokeStyle), this.update());
  }
  _generateKey() {
    return this._styleKey = Cm(this), this._styleKey;
  }
  update() {
    this._styleKey = null, this.emit("update", this);
  }
  /** Resets all properties to the default values */
  reset() {
    const t = li.defaultTextStyle;
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
    return new li({
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
    var i, r, s, a;
    if (this.removeAllListeners(), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const o = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      (i = this._fill) != null && i.texture && this._fill.texture.destroy(o), (r = this._originalFill) != null && r.texture && this._originalFill.texture.destroy(o), (s = this._stroke) != null && s.texture && this._stroke.texture.destroy(o), (a = this._originalStroke) != null && a.texture && this._originalStroke.texture.destroy(o);
    }
    this._fill = null, this._stroke = null, this.dropShadow = null, this._originalStroke = null, this._originalFill = null;
  }
  _createProxy(t, e) {
    return new Proxy(t, {
      set: (i, r, s) => (i[r] = s, e == null || e(r, s), this.update(), !0)
    });
  }
  _isFillStyle(t) {
    return (t ?? null) !== null && !(ft.isColorLike(t) || t instanceof fs || t instanceof gn);
  }
};
xa.defaultDropShadow = {
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
xa.defaultTextStyle = {
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
let ii = xa;
function Tm(n) {
  const t = n;
  if (typeof t.dropShadow == "boolean" && t.dropShadow) {
    const e = ii.defaultDropShadow;
    n.dropShadow = {
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
    if (ft.isColorLike(e))
      i.color = e;
    else if (e instanceof fs || e instanceof gn)
      i.fill = e;
    else if (Object.hasOwnProperty.call(e, "color") || Object.hasOwnProperty.call(e, "fill"))
      i = e;
    else
      throw new Error("Invalid stroke value.");
    n.stroke = {
      ...i,
      width: t.strokeThickness
    };
  }
  if (Array.isArray(t.fillGradientStops)) {
    $(Y, "gradient fill is now a fill pattern: `new FillGradient(...)`");
    let e;
    n.fontSize == null ? n.fontSize = ii.defaultTextStyle.fontSize : typeof n.fontSize == "string" ? e = parseInt(n.fontSize, 10) : e = n.fontSize;
    const i = new fs(0, 0, 0, e * 1.7), r = t.fillGradientStops.map((s) => ft.shared.setValue(s).toNumber());
    r.forEach((s, a) => {
      const o = a / (r.length - 1);
      i.addColorStop(o, s);
    }), n.fill = {
      fill: i
    };
  }
}
class km {
  constructor(t) {
    this._canvasPool = /* @__PURE__ */ Object.create(null), this.canvasOptions = t || {}, this.enableFullScreen = !1;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   */
  _createCanvasAndContext(t, e) {
    const i = at.get().createCanvas();
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
    t = Math.ceil(t * i - 1e-6), e = Math.ceil(e * i - 1e-6), t = $a(t), e = $a(e);
    const r = (t << 17) + (e << 1);
    this._canvasPool[r] || (this._canvasPool[r] = []);
    let s = this._canvasPool[r].pop();
    return s || (s = this._createCanvasAndContext(t, e)), s;
  }
  /**
   * Place a render texture back into the pool.
   * @param canvasAndContext
   */
  returnCanvasAndContext(t) {
    const e = t.canvas, { width: i, height: r } = e, s = (i << 17) + (r << 1);
    t.context.clearRect(0, 0, i, r), this._canvasPool[s].push(t);
  }
  clear() {
    this._canvasPool = {};
  }
}
const Do = new km(), Em = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui"
];
function Dr(n) {
  const t = typeof n.fontSize == "number" ? `${n.fontSize}px` : n.fontSize;
  let e = n.fontFamily;
  Array.isArray(n.fontFamily) || (e = n.fontFamily.split(","));
  for (let i = e.length - 1; i >= 0; i--) {
    let r = e[i].trim();
    !/([\"\'])[^\'\"]+\1/.test(r) && !Em.includes(r) && (r = `"${r}"`), e[i] = r;
  }
  return `${n.fontStyle} ${n.fontVariant} ${n.fontWeight} ${t} ${e.join(",")}`;
}
const Qn = {
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
      const e = at.get().getCanvasRenderingContext2D().prototype;
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
  constructor(t, e, i, r, s, a, o, l, c) {
    this.text = t, this.style = e, this.width = i, this.height = r, this.lines = s, this.lineWidths = a, this.lineHeight = o, this.maxLineWidth = l, this.fontProperties = c;
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
    const s = `${t}:${e.styleKey}`;
    if (O._measurementCache[s])
      return O._measurementCache[s];
    const a = Dr(e), o = O.measureFont(a);
    o.fontSize === 0 && (o.fontSize = e.fontSize, o.ascent = e.fontSize);
    const l = O.__context;
    l.font = a;
    const h = (r ? O._wordWrap(t, e, i) : t).split(/(?:\r\n|\r|\n)/), f = new Array(h.length);
    let d = 0;
    for (let v = 0; v < h.length; v++) {
      const b = O._measureText(h[v], e.letterSpacing, l);
      f[v] = b, d = Math.max(d, b);
    }
    const u = ((y = e._stroke) == null ? void 0 : y.width) || 0;
    let m = d + u;
    e.dropShadow && (m += e.dropShadow.distance);
    const p = e.lineHeight || o.fontSize;
    let g = Math.max(p, o.fontSize + u) + (h.length - 1) * (p + e.leading);
    return e.dropShadow && (g += e.dropShadow.distance), new O(
      t,
      e,
      m,
      g,
      h,
      f,
      p + e.leading,
      d,
      o
    );
  }
  static _measureText(t, e, i) {
    let r = !1;
    O.experimentalLetterSpacingSupported && (O.experimentalLetterSpacing ? (i.letterSpacing = `${e}px`, i.textLetterSpacing = `${e}px`, r = !0) : (i.letterSpacing = "0px", i.textLetterSpacing = "0px"));
    const s = i.measureText(t);
    let a = s.width;
    const o = -s.actualBoundingBoxLeft;
    let c = s.actualBoundingBoxRight - o;
    if (a > 0)
      if (r)
        a -= e, c -= e;
      else {
        const h = (O.graphemeSegmenter(t).length - 1) * e;
        a += h, c += h;
      }
    return Math.max(a, c);
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
    const r = i.getContext("2d", Qn);
    let s = 0, a = "", o = "";
    const l = /* @__PURE__ */ Object.create(null), { letterSpacing: c, whiteSpace: h } = e, f = O._collapseSpaces(h), d = O._collapseNewlines(h);
    let u = !f;
    const m = e.wordWrapWidth + c, p = O._tokenize(t);
    for (let g = 0; g < p.length; g++) {
      let x = p[g];
      if (O._isNewline(x)) {
        if (!d) {
          o += O._addLine(a), u = !f, a = "", s = 0;
          continue;
        }
        x = " ";
      }
      if (f) {
        const v = O.isBreakingSpace(x), b = O.isBreakingSpace(a[a.length - 1]);
        if (v && b)
          continue;
      }
      const y = O._getFromCache(x, c, l, r);
      if (y > m)
        if (a !== "" && (o += O._addLine(a), a = "", s = 0), O.canBreakWords(x, e.breakWords)) {
          const v = O.wordWrapSplit(x);
          for (let b = 0; b < v.length; b++) {
            let _ = v[b], S = _, C = 1;
            for (; v[b + C]; ) {
              const A = v[b + C];
              if (!O.canBreakChars(S, A, x, b, e.breakWords))
                _ += A;
              else
                break;
              S = A, C++;
            }
            b += C - 1;
            const w = O._getFromCache(_, c, l, r);
            w + s > m && (o += O._addLine(a), u = !1, a = "", s = 0), a += _, s += w;
          }
        } else {
          a.length > 0 && (o += O._addLine(a), a = "", s = 0);
          const v = g === p.length - 1;
          o += O._addLine(x, !v), u = !1, a = "", s = 0;
        }
      else
        y + s > m && (u = !1, o += O._addLine(a), a = "", s = 0), (a.length > 0 || !O.isBreakingSpace(x) || u) && (a += x, s += y);
    }
    return o += O._addLine(a, !1), o;
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
    let s = i[t];
    return typeof s != "number" && (s = O._measureText(t, e, r) + e, i[t] = s), s;
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
      const s = t[r], a = t[r + 1];
      if (O.isBreakingSpace(s, a) || O._isNewline(s)) {
        i !== "" && (e.push(i), i = ""), e.push(s);
        continue;
      }
      i += s;
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
  static canBreakChars(t, e, i, r, s) {
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
        const e = new OffscreenCanvas(0, 0), i = e.getContext("2d", Qn);
        if (i != null && i.measureText)
          return O.__canvas = e, e;
        t = at.get().createCanvas();
      } catch {
        t = at.get().createCanvas();
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
    return O.__context || (O.__context = O._canvas.getContext("2d", Qn)), O.__context;
  }
};
re.METRICS_STRING = "|ÉqÅ";
re.BASELINE_SYMBOL = "M";
re.BASELINE_MULTIPLIER = 1.4;
re.HEIGHT_MULTIPLIER = 2;
re.graphemeSegmenter = (() => {
  if (typeof (Intl == null ? void 0 : Intl.Segmenter) == "function") {
    const n = new Intl.Segmenter();
    return (t) => [...n.segment(t)].map((e) => e.segment);
  }
  return (n) => [...n];
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
let zr = re;
function zo(n, t) {
  if (n.texture === V.WHITE && !n.fill)
    return ft.shared.setValue(n.color).setAlpha(n.alpha ?? 1).toHexa();
  if (n.fill) {
    if (n.fill instanceof gn) {
      const e = n.fill, i = t.createPattern(e.texture.source.resource, "repeat"), r = e.transform.copyTo(H.shared);
      return r.scale(
        e.texture.frame.width,
        e.texture.frame.height
      ), i.setTransform(r), i;
    } else if (n.fill instanceof fs) {
      const e = n.fill;
      if (e.type === "linear") {
        const i = t.createLinearGradient(
          e.x0,
          e.y0,
          e.x1,
          e.y1
        );
        return e.gradientStops.forEach((r) => {
          i.addColorStop(r.offset, ft.shared.setValue(r.color).toHex());
        }), i;
      }
    }
  } else {
    const e = t.createPattern(n.texture.source.resource, "repeat"), i = n.matrix.copyTo(H.shared);
    return i.scale(n.texture.frame.width, n.texture.frame.height), e.setTransform(i), e;
  }
  return ct("FillStyle not recognised", n), "red";
}
function lc(n) {
  if (n === "")
    return [];
  typeof n == "string" && (n = [n]);
  const t = [];
  for (let e = 0, i = n.length; e < i; e++) {
    const r = n[e];
    if (Array.isArray(r)) {
      if (r.length !== 2)
        throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${r.length}.`);
      if (r[0].length === 0 || r[1].length === 0)
        throw new Error("[BitmapFont]: Invalid character delimiter.");
      const s = r[0].charCodeAt(0), a = r[1].charCodeAt(0);
      if (a < s)
        throw new Error("[BitmapFont]: Invalid character range.");
      for (let o = s, l = a; o <= l; o++)
        t.push(String.fromCharCode(o));
    } else
      t.push(...Array.from(r));
  }
  if (t.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return t;
}
const hc = class cc extends Nh {
  /**
   * @param options - The options for the dynamic bitmap font.
   */
  constructor(t) {
    super(), this.resolution = 1, this.pages = [], this._padding = 0, this._measureCache = /* @__PURE__ */ Object.create(null), this._currentChars = [], this._currentX = 0, this._currentY = 0, this._currentPageIndex = -1, this._skipKerning = !1;
    const e = { ...cc.defaultOptions, ...t };
    this._textureSize = e.textureSize, this._mipmap = e.mipmap;
    const i = e.style.clone();
    e.overrideFill && (i._fill.color = 16777215, i._fill.alpha = 1, i._fill.texture = V.WHITE, i._fill.fill = null), this.applyFillAsTint = e.overrideFill;
    const r = i.fontSize;
    i.fontSize = this.baseMeasurementFontSize;
    const s = Dr(i);
    e.overrideSize ? i._stroke && (i._stroke.width *= this.baseRenderedFontSize / r) : i.fontSize = this.baseRenderedFontSize = r, this._style = i, this._skipKerning = e.skipKerning ?? !1, this.resolution = e.resolution ?? 1, this._padding = e.padding ?? 4, this.fontMetrics = zr.measureFont(s), this.lineHeight = i.lineHeight || this.fontMetrics.fontSize || i.fontSize;
  }
  ensureCharacters(t) {
    var m, p;
    const e = lc(t).filter((g) => !this._currentChars.includes(g)).filter((g, x, y) => y.indexOf(g) === x);
    if (!e.length)
      return;
    this._currentChars = [...this._currentChars, ...e];
    let i;
    this._currentPageIndex === -1 ? i = this._nextPage() : i = this.pages[this._currentPageIndex];
    let { canvas: r, context: s } = i.canvasAndContext, a = i.texture.source;
    const o = this._style;
    let l = this._currentX, c = this._currentY;
    const h = this.baseRenderedFontSize / this.baseMeasurementFontSize, f = this._padding * h;
    let d = 0, u = !1;
    for (let g = 0; g < e.length; g++) {
      const x = e[g], y = zr.measureText(x, o, r, !1), v = Math.ceil((o.fontStyle === "italic" ? 2 : 1) * y.width);
      y.lineHeight = y.height;
      const b = y.width * h, _ = y.height * h, S = v + f * 2, C = _ + f * 2;
      if (u = !1, x !== `
` && x !== "\r" && x !== "	" && x !== " " && (u = !0, d = Math.ceil(Math.max(C, d))), l + S > this._textureSize && (c += d, d = C, l = 0, c + d > this._textureSize)) {
        a.update();
        const A = this._nextPage();
        r = A.canvasAndContext.canvas, s = A.canvasAndContext.context, a = A.texture.source, c = 0;
      }
      const w = b / h - (((m = o.dropShadow) == null ? void 0 : m.distance) ?? 0) - (((p = o._stroke) == null ? void 0 : p.width) ?? 0);
      if (this.chars[x] = {
        id: x.codePointAt(0),
        xOffset: -this._padding,
        yOffset: -this._padding,
        xAdvance: w,
        kerning: {}
      }, u) {
        this._drawGlyph(
          s,
          y,
          l + f,
          c + f,
          h,
          o
        );
        const A = a.width * h, P = a.height * h, M = new mt(
          l / A * a.width,
          c / P * a.height,
          S / A * a.width,
          C / P * a.height
        );
        this.chars[x].texture = new V({
          source: a,
          frame: M
        }), l += Math.ceil(S);
      }
    }
    a.update(), this._currentX = l, this._currentY = c, this._skipKerning && this._applyKerning(e, s);
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
      const s = t[r];
      for (let a = 0; a < this._currentChars.length; a++) {
        const o = this._currentChars[a];
        let l = i[s];
        l || (l = i[s] = e.measureText(s).width);
        let c = i[o];
        c || (c = i[o] = e.measureText(o).width);
        let h = e.measureText(s + o).width, f = h - (l + c);
        f && (this.chars[s].kerning[o] = f), h = e.measureText(s + o).width, f = h - (l + c), f && (this.chars[o].kerning[s] = f);
      }
    }
  }
  _nextPage() {
    this._currentPageIndex++;
    const t = this.resolution, e = Do.getOptimalCanvasAndContext(
      this._textureSize,
      this._textureSize,
      t
    );
    this._setupContext(e.context, this._style, t);
    const i = t * (this.baseRenderedFontSize / this.baseMeasurementFontSize), r = new V({
      source: new Ei({
        resource: e.canvas,
        resolution: i,
        alphaMode: "premultiply-alpha-on-upload",
        autoGenerateMipmaps: this._mipmap
      })
    }), s = {
      canvasAndContext: e,
      texture: r
    };
    return this.pages[this._currentPageIndex] = s, s;
  }
  // canvas style!
  _setupContext(t, e, i) {
    e.fontSize = this.baseRenderedFontSize, t.scale(i, i), t.font = Dr(e), e.fontSize = this.baseMeasurementFontSize, t.textBaseline = e.textBaseline;
    const r = e._stroke, s = (r == null ? void 0 : r.width) ?? 0;
    if (r && (t.lineWidth = s, t.lineJoin = r.join, t.miterLimit = r.miterLimit, t.strokeStyle = zo(r, t)), e._fill && (t.fillStyle = zo(e._fill, t)), e.dropShadow) {
      const a = e.dropShadow, o = ft.shared.setValue(a.color).toArray(), l = a.blur * i, c = a.distance * i;
      t.shadowColor = `rgba(${o[0] * 255},${o[1] * 255},${o[2] * 255},${a.alpha})`, t.shadowBlur = l, t.shadowOffsetX = Math.cos(a.angle) * c, t.shadowOffsetY = Math.sin(a.angle) * c;
    } else
      t.shadowColor = "black", t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0;
  }
  _drawGlyph(t, e, i, r, s, a) {
    const o = e.text, l = e.fontProperties, c = a._stroke, h = ((c == null ? void 0 : c.width) ?? 0) * s, f = i + h / 2, d = r - h / 2, u = l.descent * s, m = e.lineHeight * s;
    a.stroke && h && t.strokeText(o, f, d + m - u), a._fill && t.fillText(o, f, d + m - u);
  }
  destroy() {
    super.destroy();
    for (let t = 0; t < this.pages.length; t++) {
      const { canvasAndContext: e, texture: i } = this.pages[t];
      Do.returnCanvasAndContext(e), i.destroy(!0);
    }
    this.pages = null;
  }
};
hc.defaultOptions = {
  textureSize: 512,
  style: new ii(),
  mipmap: !0
};
let Uo = hc;
function Im(n, t, e, i) {
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
  let s = r.lines[0], a = null, o = !0;
  const l = {
    spaceWord: !1,
    width: 0,
    start: 0,
    index: 0,
    // use index to not modify the array as we use it a lot!
    positions: [],
    chars: []
  }, c = (m) => {
    const p = s.width;
    for (let g = 0; g < l.index; g++) {
      const x = m.positions[g];
      s.chars.push(m.chars[g]), s.charPositions.push(x + p);
    }
    s.width += m.width, o = !1, l.width = 0, l.index = 0, l.chars.length = 0;
  }, h = () => {
    let m = s.chars.length - 1;
    if (i) {
      let p = s.chars[m];
      for (; p === " "; )
        s.width -= e.chars[p].xAdvance, p = s.chars[--m];
    }
    r.width = Math.max(r.width, s.width), s = {
      width: 0,
      charPositions: [],
      chars: [],
      spaceWidth: 0,
      spacesIndex: []
    }, o = !0, r.lines.push(s), r.height += e.lineHeight;
  }, f = e.baseMeasurementFontSize / t.fontSize, d = t.letterSpacing * f, u = t.wordWrapWidth * f;
  for (let m = 0; m < n.length + 1; m++) {
    let p;
    const g = m === n.length;
    g || (p = n[m]);
    const x = e.chars[p] || e.chars[" "];
    if (/(?:\s)/.test(p) || p === "\r" || p === `
` || g) {
      if (!o && t.wordWrap && s.width + l.width - d > u ? (h(), c(l), g || s.charPositions.push(0)) : (l.start = s.width, c(l), g || s.charPositions.push(0)), p === "\r" || p === `
`)
        s.width !== 0 && h();
      else if (!g) {
        const _ = x.xAdvance + (x.kerning[a] || 0) + d;
        s.width += _, s.spaceWidth = _, s.spacesIndex.push(s.charPositions.length), s.chars.push(p);
      }
    } else {
      const b = x.kerning[a] || 0, _ = x.xAdvance + b + d;
      l.positions[l.index++] = l.width + b, l.chars.push(p), l.width += _;
    }
    a = p;
  }
  return h(), t.align === "center" ? Bm(r) : t.align === "right" ? Rm(r) : t.align === "justify" && Fm(r), r;
}
function Bm(n) {
  for (let t = 0; t < n.lines.length; t++) {
    const e = n.lines[t], i = n.width / 2 - e.width / 2;
    for (let r = 0; r < e.charPositions.length; r++)
      e.charPositions[r] += i;
  }
}
function Rm(n) {
  for (let t = 0; t < n.lines.length; t++) {
    const e = n.lines[t], i = n.width - e.width;
    for (let r = 0; r < e.charPositions.length; r++)
      e.charPositions[r] += i;
  }
}
function Fm(n) {
  const t = n.width;
  for (let e = 0; e < n.lines.length; e++) {
    const i = n.lines[e];
    let r = 0, s = i.spacesIndex[r++], a = 0;
    const o = i.spacesIndex.length, c = (t - i.width) / o;
    for (let h = 0; h < i.charPositions.length; h++)
      h === s && (s = i.spacesIndex[r++], a += c), i.charPositions[h] += a;
  }
}
let Os = 0;
class Lm {
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
    var a;
    let i = `${e.fontFamily}-bitmap`, r = !0;
    if (e._fill.fill && !e._stroke)
      i += e._fill.fill.styleKey, r = !1;
    else if (e._stroke || e.dropShadow) {
      let o = e.styleKey;
      o = o.substring(0, o.lastIndexOf("-")), i = `${o}-bitmap`, r = !1;
    }
    if (!st.has(i)) {
      const o = new Uo({
        style: e,
        overrideFill: r,
        overrideSize: !0,
        ...this.defaultOptions
      });
      Os++, Os > 50 && ct("BitmapText", `You have dynamically created ${Os} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``), o.once("destroy", () => {
        Os--, st.remove(i);
      }), st.set(
        i,
        o
      );
    }
    const s = st.get(i);
    return (a = s.ensureCharacters) == null || a.call(s, t), s;
  }
  /**
   * Get the layout of a text for the specified style.
   * @param text - The text to get the layout for
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  getLayout(t, e, i = !0) {
    const r = this.getFont(t, e);
    return Im([...t], e, r, i);
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
    const r = e.style, s = r instanceof ii ? r : new ii(r), a = s._fill.fill !== null && s._fill.fill !== void 0, o = new Uo({
      style: s,
      overrideFill: a,
      skipKerning: e.skipKerning,
      padding: e.padding,
      resolution: e.resolution,
      overrideSize: !1
    }), l = lc(e.chars);
    return o.ensureCharacters(l.join("")), st.set(`${i}-bitmap`, o), o.once("destroy", () => st.remove(`${i}-bitmap`)), o;
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
const Ur = new Lm();
class uc extends Nh {
  constructor(t, e) {
    super();
    const { textures: i, data: r } = t;
    Object.keys(r.pages).forEach((s) => {
      const a = r.pages[parseInt(s, 10)], o = i[a.id];
      this.pages.push({ texture: o });
    }), Object.keys(r.chars).forEach((s) => {
      const a = r.chars[s], {
        frame: o,
        source: l
      } = i[a.page], c = new mt(
        a.x + o.x,
        a.y + o.y,
        a.width,
        a.height
      ), h = new V({
        source: l,
        frame: c
      });
      this.chars[s] = {
        id: s.codePointAt(0),
        xOffset: a.xOffset,
        yOffset: a.yOffset,
        xAdvance: a.xAdvance,
        kerning: a.kerning ?? {},
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
    Ur.install(t);
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * @param {string} name - The name of the bitmap font to uninstall.
   */
  static uninstall(t) {
    Ur.uninstall(t);
  }
}
const Jn = {
  test(n) {
    return typeof n == "string" && n.startsWith("info face=");
  },
  parse(n) {
    const t = n.match(/^[a-z]+\s+.+$/gm), e = {
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
        const g = u[p].split("="), x = g[0], y = g[1].replace(/"/gm, ""), v = parseFloat(y), b = isNaN(v) ? y : v;
        m[x] = b;
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
    }, [r] = e.info, [s] = e.common, [a] = e.distanceField ?? [];
    a && (i.distanceField = {
      range: parseInt(a.distanceRange, 10),
      type: a.fieldType
    }), i.fontSize = parseInt(r.size, 10), i.fontFamily = r.face, i.lineHeight = parseInt(s.lineHeight, 10);
    const o = e.page;
    for (let f = 0; f < o.length; f++)
      i.pages.push({
        id: parseInt(o[f].id, 10) || 0,
        file: o[f].file
      });
    const l = {};
    i.baseLineOffset = i.lineHeight - parseInt(s.base, 10);
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
}, Go = {
  test(n) {
    const t = n;
    return typeof t != "string" && "getElementsByTagName" in t && t.getElementsByTagName("page").length && t.getElementsByTagName("info")[0].getAttribute("face") !== null;
  },
  parse(n) {
    const t = {
      chars: {},
      pages: [],
      lineHeight: 0,
      fontSize: 0,
      fontFamily: "",
      distanceField: null,
      baseLineOffset: 0
    }, e = n.getElementsByTagName("info")[0], i = n.getElementsByTagName("common")[0], r = n.getElementsByTagName("distanceField")[0];
    r && (t.distanceField = {
      type: r.getAttribute("fieldType"),
      range: parseInt(r.getAttribute("distanceRange"), 10)
    });
    const s = n.getElementsByTagName("page"), a = n.getElementsByTagName("char"), o = n.getElementsByTagName("kerning");
    t.fontSize = parseInt(e.getAttribute("size"), 10), t.fontFamily = e.getAttribute("face"), t.lineHeight = parseInt(i.getAttribute("lineHeight"), 10);
    for (let c = 0; c < s.length; c++)
      t.pages.push({
        id: parseInt(s[c].getAttribute("id"), 10) || 0,
        file: s[c].getAttribute("file")
      });
    const l = {};
    t.baseLineOffset = t.lineHeight - parseInt(i.getAttribute("base"), 10);
    for (let c = 0; c < a.length; c++) {
      const h = a[c], f = parseInt(h.getAttribute("id"), 10);
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
    for (let c = 0; c < o.length; c++) {
      const h = parseInt(o[c].getAttribute("first"), 10), f = parseInt(o[c].getAttribute("second"), 10), d = parseInt(o[c].getAttribute("amount"), 10);
      t.chars[l[f]].kerning[l[h]] = d;
    }
    return t;
  }
}, Vo = {
  test(n) {
    return typeof n == "string" && n.includes("<font>") ? Go.test(at.get().parseXML(n)) : !1;
  },
  parse(n) {
    return Go.parse(at.get().parseXML(n));
  }
}, Om = [".xml", ".fnt"], Dm = {
  extension: {
    type: D.CacheParser,
    name: "cacheBitmapFont"
  },
  test: (n) => n instanceof uc,
  getCacheableAssets(n, t) {
    const e = {};
    return n.forEach((i) => {
      e[i] = t, e[`${i}-bitmap`] = t;
    }), e[`${t.fontFamily}-bitmap`] = t, e;
  }
}, zm = {
  extension: {
    type: D.LoadParser,
    priority: Me.Normal
  },
  name: "loadBitmapFont",
  test(n) {
    return Om.includes(wt.extname(n).toLowerCase());
  },
  async testParse(n) {
    return Jn.test(n) || Vo.test(n);
  },
  async parse(n, t, e) {
    const i = Jn.test(n) ? Jn.parse(n) : Vo.parse(n), { src: r } = t, { pages: s } = i, a = [], o = i.distanceField ? {
      scaleMode: "linear",
      alphaMode: "premultiply-alpha-on-upload",
      autoGenerateMipmaps: !1,
      resolution: 1
    } : {};
    for (let f = 0; f < s.length; ++f) {
      const d = s[f].file;
      let u = wt.join(wt.dirname(r), d);
      u = Ar(u, r), a.push({
        src: u,
        data: o
      });
    }
    const l = await e.load(a), c = a.map((f) => l[f.src]);
    return new uc({
      data: i,
      textures: c
    }, r);
  },
  async load(n, t) {
    return await (await at.get().fetch(n)).text();
  },
  async unload(n, t, e) {
    await Promise.all(n.pages.map((i) => e.unload(i.texture.source._sourceOrigin))), n.destroy();
  }
};
class Um {
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
const Gm = {
  extension: {
    type: D.CacheParser,
    name: "cacheTextureArray"
  },
  test: (n) => Array.isArray(n) && n.every((t) => t instanceof V),
  getCacheableAssets: (n, t) => {
    const e = {};
    return n.forEach((i) => {
      t.forEach((r, s) => {
        e[i + (s === 0 ? "" : s + 1)] = r;
      });
    }), e;
  }
};
async function fc(n) {
  if ("Image" in globalThis)
    return new Promise((t) => {
      const e = new Image();
      e.onload = () => {
        t(!0);
      }, e.onerror = () => {
        t(!1);
      }, e.src = n;
    });
  if ("createImageBitmap" in globalThis && "fetch" in globalThis) {
    try {
      const t = await (await fetch(n)).blob();
      await createImageBitmap(t);
    } catch {
      return !1;
    }
    return !0;
  }
  return !1;
}
const Vm = {
  extension: {
    type: D.DetectionParser,
    priority: 1
  },
  test: async () => fc(
    // eslint-disable-next-line max-len
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
  ),
  add: async (n) => [...n, "avif"],
  remove: async (n) => n.filter((t) => t !== "avif")
}, Wo = ["png", "jpg", "jpeg"], Wm = {
  extension: {
    type: D.DetectionParser,
    priority: -1
  },
  test: () => Promise.resolve(!0),
  add: async (n) => [...n, ...Wo],
  remove: async (n) => n.filter((t) => !Wo.includes(t))
}, Nm = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;
function ya(n) {
  return Nm ? !1 : document.createElement("video").canPlayType(n) !== "";
}
const Hm = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => ya("video/mp4"),
  add: async (n) => [...n, "mp4", "m4v"],
  remove: async (n) => n.filter((t) => t !== "mp4" && t !== "m4v")
}, $m = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => ya("video/ogg"),
  add: async (n) => [...n, "ogv"],
  remove: async (n) => n.filter((t) => t !== "ogv")
}, Ym = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => ya("video/webm"),
  add: async (n) => [...n, "webm"],
  remove: async (n) => n.filter((t) => t !== "webm")
}, Xm = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => fc(
    "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="
  ),
  add: async (n) => [...n, "webp"],
  remove: async (n) => n.filter((t) => t !== "webp")
};
class jm {
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
      var a, o;
      let r = null, s = null;
      if (e.loadParser && (s = this._parserHash[e.loadParser], s || ct(`[Assets] specified load parser "${e.loadParser}" not found while loading ${t}`)), !s) {
        for (let l = 0; l < this.parsers.length; l++) {
          const c = this.parsers[l];
          if (c.load && ((a = c.test) != null && a.call(c, t, e, this))) {
            s = c;
            break;
          }
        }
        if (!s)
          return ct(`[Assets] ${t} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`), null;
      }
      r = await s.load(t, e, this), i.parser = s;
      for (let l = 0; l < this.parsers.length; l++) {
        const c = this.parsers[l];
        c.parse && c.parse && await ((o = c.testParse) == null ? void 0 : o.call(c, r, e, this)) && (r = await c.parse(r, e, this) || r, i.parser = c);
      }
      return r;
    })(), i;
  }
  async load(t, e) {
    this._parsersValidated || this._validateParsers();
    let i = 0;
    const r = {}, s = tn(t), a = ie(t, (c) => ({
      alias: [c],
      src: c,
      data: {}
    })), o = a.length, l = a.map(async (c) => {
      const h = wt.toAbsolute(c.src);
      if (!r[c.src])
        try {
          this.promiseCache[h] || (this.promiseCache[h] = this._getLoadPromiseAndParser(h, c)), r[c.src] = await this.promiseCache[h].promise, e && e(++i / o);
        } catch (f) {
          throw delete this.promiseCache[h], delete r[c.src], new Error(`[Loader.load] Failed to load ${h}.
${f}`);
        }
    });
    return await Promise.all(l), s ? r[a[0].src] : r;
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
    const i = ie(t, (r) => ({
      alias: [r],
      src: r
    })).map(async (r) => {
      var o, l;
      const s = wt.toAbsolute(r.src), a = this.promiseCache[s];
      if (a) {
        const c = await a.promise;
        delete this.promiseCache[s], await ((l = (o = a.parser) == null ? void 0 : o.unload) == null ? void 0 : l.call(o, c, r, this));
      }
    });
    await Promise.all(i);
  }
  /** validates our parsers, right now it only checks for name conflicts but we can add more here as required! */
  _validateParsers() {
    this._parsersValidated = !0, this._parserHash = this._parsers.filter((t) => t.name).reduce((t, e) => (e.name ? t[e.name] && ct(`[Assets] loadParser name conflict "${e.name}"`) : ct("[Assets] loadParser should have a name"), { ...t, [e.name]: e }), {});
  }
}
function Bi(n, t) {
  if (Array.isArray(t)) {
    for (const e of t)
      if (n.startsWith(`data:${e}`))
        return !0;
    return !1;
  }
  return n.startsWith(`data:${t}`);
}
function Ri(n, t) {
  const e = n.split("?")[0], i = wt.extname(e).toLowerCase();
  return Array.isArray(t) ? t.includes(i) : i === t;
}
const Km = ".json", qm = "application/json", Zm = {
  extension: {
    type: D.LoadParser,
    priority: Me.Low
  },
  name: "loadJson",
  test(n) {
    return Bi(n, qm) || Ri(n, Km);
  },
  async load(n) {
    return await (await at.get().fetch(n)).json();
  }
}, Qm = ".txt", Jm = "text/plain", tg = {
  name: "loadTxt",
  extension: {
    type: D.LoadParser,
    priority: Me.Low,
    name: "loadTxt"
  },
  test(n) {
    return Bi(n, Jm) || Ri(n, Qm);
  },
  async load(n) {
    return await (await at.get().fetch(n)).text();
  }
}, eg = [
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
], ig = [".ttf", ".otf", ".woff", ".woff2"], sg = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2"
], ng = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function rg(n) {
  const t = wt.extname(n), r = wt.basename(n, t).replace(/(-|_)/g, " ").toLowerCase().split(" ").map((o) => o.charAt(0).toUpperCase() + o.slice(1));
  let s = r.length > 0;
  for (const o of r)
    if (!o.match(ng)) {
      s = !1;
      break;
    }
  let a = r.join(" ");
  return s || (a = `"${a.replace(/[\\"]/g, "\\$&")}"`), a;
}
const ag = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;
function og(n) {
  return ag.test(n) ? n : encodeURI(n);
}
const lg = {
  extension: {
    type: D.LoadParser,
    priority: Me.Low
  },
  name: "loadWebFont",
  test(n) {
    return Bi(n, sg) || Ri(n, ig);
  },
  async load(n, t) {
    var i, r, s;
    const e = at.get().getFontFaceSet();
    if (e) {
      const a = [], o = ((i = t.data) == null ? void 0 : i.family) ?? rg(n), l = ((s = (r = t.data) == null ? void 0 : r.weights) == null ? void 0 : s.filter((h) => eg.includes(h))) ?? ["normal"], c = t.data ?? {};
      for (let h = 0; h < l.length; h++) {
        const f = l[h], d = new FontFace(o, `url(${og(n)})`, {
          ...c,
          weight: f
        });
        await d.load(), e.add(d), a.push(d);
      }
      return st.set(`${o}-and-url`, {
        url: n,
        fontFaces: a
      }), a.length === 1 ? a[0] : a;
    }
    return ct("[loadWebFont] FontFace API is not supported. Skipping loading font"), null;
  },
  unload(n) {
    (Array.isArray(n) ? n : [n]).forEach((t) => {
      st.remove(t.family), at.get().getFontFaceSet().delete(t);
    });
  }
};
function va(n, t = 1) {
  var i;
  const e = (i = Ii.RETINA_PREFIX) == null ? void 0 : i.exec(n);
  return e ? parseFloat(e[1]) : t;
}
function wa(n, t, e) {
  n.label = e, n._sourceOrigin = e;
  const i = new V({
    source: n,
    label: e
  }), r = () => {
    delete t.promiseCache[e], st.has(e) && st.remove(e);
  };
  return i.source.once("destroy", () => {
    t.promiseCache[e] && (ct("[Assets] A TextureSource managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the TextureSource."), r());
  }), i.once("destroy", () => {
    n.destroyed || (ct("[Assets] A Texture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the Texture."), r());
  }), i;
}
const hg = ".svg", cg = "image/svg+xml", ug = {
  extension: {
    type: D.LoadParser,
    priority: Me.Low,
    name: "loadSVG"
  },
  name: "loadSVG",
  config: {
    crossOrigin: "anonymous",
    parseAsGraphicsContext: !1
  },
  test(n) {
    return Bi(n, cg) || Ri(n, hg);
  },
  async load(n, t, e) {
    return t.data.parseAsGraphicsContext ?? this.config.parseAsGraphicsContext ? dg(n) : fg(n, t, e, this.config.crossOrigin);
  },
  unload(n) {
    n.destroy(!0);
  }
};
async function fg(n, t, e, i) {
  var g, x, y;
  const s = await (await at.get().fetch(n)).blob(), a = URL.createObjectURL(s), o = new Image();
  o.src = a, o.crossOrigin = i, await o.decode(), URL.revokeObjectURL(a);
  const l = document.createElement("canvas"), c = l.getContext("2d"), h = ((g = t.data) == null ? void 0 : g.resolution) || va(n), f = ((x = t.data) == null ? void 0 : x.width) ?? o.width, d = ((y = t.data) == null ? void 0 : y.height) ?? o.height;
  l.width = f * h, l.height = d * h, c.drawImage(o, 0, 0, f * h, d * h);
  const { parseAsGraphicsContext: u, ...m } = t.data, p = new Ei({
    resource: l,
    alphaMode: "premultiply-alpha-on-upload",
    resolution: h,
    ...m
  });
  return wa(p, e, n);
}
async function dg(n) {
  const e = await (await at.get().fetch(n)).text(), i = new Yt();
  return i.svg(e), i;
}
const pg = `(function () {
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
let _i = null, Gr = class {
  constructor() {
    _i || (_i = URL.createObjectURL(new Blob([pg], { type: "application/javascript" }))), this.worker = new Worker(_i);
  }
};
Gr.revokeObjectURL = function() {
  _i && (URL.revokeObjectURL(_i), _i = null);
};
const mg = `(function () {
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
class dc {
  constructor() {
    xi || (xi = URL.createObjectURL(new Blob([mg], { type: "application/javascript" }))), this.worker = new Worker(xi);
  }
}
dc.revokeObjectURL = function() {
  xi && (URL.revokeObjectURL(xi), xi = null);
};
let No = 0, tr;
class gg {
  constructor() {
    this._initialized = !1, this._createdWorkers = 0, this._workerPool = [], this._queue = [], this._resolveHash = {};
  }
  isImageBitmapSupported() {
    return this._isImageBitmapSupported !== void 0 ? this._isImageBitmapSupported : (this._isImageBitmapSupported = new Promise((t) => {
      const { worker: e } = new Gr();
      e.addEventListener("message", (i) => {
        e.terminate(), Gr.revokeObjectURL(), t(i.data);
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
    tr === void 0 && (tr = navigator.hardwareConcurrency || 4);
    let t = this._workerPool.pop();
    return !t && this._createdWorkers < tr && (this._createdWorkers++, t = new dc().worker, t.addEventListener("message", (e) => {
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
    const i = new Promise((r, s) => {
      this._queue.push({ id: t, arguments: e, resolve: r, reject: s });
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
    this._resolveHash[No] = { resolve: e.resolve, reject: e.reject }, t.postMessage({
      data: e.arguments,
      uuid: No++,
      id: i
    });
  }
}
const Ho = new gg(), _g = [".jpeg", ".jpg", ".png", ".webp", ".avif"], xg = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
async function yg(n, t) {
  var r;
  const e = await at.get().fetch(n);
  if (!e.ok)
    throw new Error(`[loadImageBitmap] Failed to fetch ${n}: ${e.status} ${e.statusText}`);
  const i = await e.blob();
  return ((r = t == null ? void 0 : t.data) == null ? void 0 : r.alphaMode) === "premultiplied-alpha" ? createImageBitmap(i, { premultiplyAlpha: "none" }) : createImageBitmap(i);
}
const pc = {
  name: "loadTextures",
  extension: {
    type: D.LoadParser,
    priority: Me.High,
    name: "loadTextures"
  },
  config: {
    preferWorkers: !0,
    preferCreateImageBitmap: !0,
    crossOrigin: "anonymous"
  },
  test(n) {
    return Bi(n, xg) || Ri(n, _g);
  },
  async load(n, t, e) {
    var s;
    let i = null;
    globalThis.createImageBitmap && this.config.preferCreateImageBitmap ? this.config.preferWorkers && await Ho.isImageBitmapSupported() ? i = await Ho.loadImageBitmap(n, t) : i = await yg(n, t) : i = await new Promise((a) => {
      i = new Image(), i.crossOrigin = this.config.crossOrigin, i.src = n, i.complete ? a(i) : i.onload = () => {
        a(i);
      };
    });
    const r = new Ei({
      resource: i,
      alphaMode: "premultiply-alpha-on-upload",
      resolution: ((s = t.data) == null ? void 0 : s.resolution) || va(n),
      ...t.data
    });
    return wa(r, e, n);
  },
  unload(n) {
    n.destroy(!0);
  }
}, mc = [".mp4", ".m4v", ".webm", ".ogg", ".ogv", ".h264", ".avi", ".mov"], vg = mc.map((n) => `video/${n.substring(1)}`);
function wg(n, t, e) {
  e === void 0 && !t.startsWith("data:") ? n.crossOrigin = Sg(t) : e !== !1 && (n.crossOrigin = typeof e == "string" ? e : "anonymous");
}
function bg(n) {
  return new Promise((t, e) => {
    n.addEventListener("canplaythrough", i), n.addEventListener("error", r), n.load();
    function i() {
      s(), t();
    }
    function r(a) {
      s(), e(a);
    }
    function s() {
      n.removeEventListener("canplaythrough", i), n.removeEventListener("error", r);
    }
  });
}
function Sg(n, t = globalThis.location) {
  if (n.startsWith("data:"))
    return "";
  t = t || globalThis.location;
  const e = new URL(n, document.baseURI);
  return e.hostname !== t.hostname || e.port !== t.port || e.protocol !== t.protocol ? "anonymous" : "";
}
const Ag = {
  name: "loadVideo",
  extension: {
    type: D.LoadParser,
    name: "loadVideo"
  },
  test(n) {
    const t = Bi(n, vg), e = Ri(n, mc);
    return t || e;
  },
  async load(n, t, e) {
    var l, c;
    const i = {
      ...Vs.defaultOptions,
      resolution: ((l = t.data) == null ? void 0 : l.resolution) || va(n),
      alphaMode: ((c = t.data) == null ? void 0 : c.alphaMode) || await yh(),
      ...t.data
    }, r = document.createElement("video"), s = {
      preload: i.autoLoad !== !1 ? "auto" : void 0,
      "webkit-playsinline": i.playsinline !== !1 ? "" : void 0,
      playsinline: i.playsinline !== !1 ? "" : void 0,
      muted: i.muted === !0 ? "" : void 0,
      loop: i.loop === !0 ? "" : void 0,
      autoplay: i.autoPlay !== !1 ? "" : void 0
    };
    Object.keys(s).forEach((h) => {
      const f = s[h];
      f !== void 0 && r.setAttribute(h, f);
    }), i.muted === !0 && (r.muted = !0), wg(r, n, i.crossorigin);
    const a = document.createElement("source");
    let o;
    if (n.startsWith("data:"))
      o = n.slice(5, n.indexOf(";"));
    else if (!n.startsWith("blob:")) {
      const h = n.split("?")[0].slice(n.lastIndexOf(".") + 1).toLowerCase();
      o = Vs.MIME_TYPES[h] || `video/${h}`;
    }
    return a.src = n, o && (a.type = o), new Promise((h) => {
      const f = async () => {
        const d = new Vs({ ...i, resource: r });
        r.removeEventListener("canplay", f), t.data.preload && await bg(r), h(wa(d, e, n));
      };
      r.addEventListener("canplay", f), r.appendChild(a);
    });
  },
  unload(n) {
    n.destroy(!0);
  }
}, gc = {
  extension: {
    type: D.ResolveParser,
    name: "resolveTexture"
  },
  test: pc.test,
  parse: (n) => {
    var t;
    return {
      resolution: parseFloat(((t = Ii.RETINA_PREFIX.exec(n)) == null ? void 0 : t[1]) ?? "1"),
      format: n.split(".").pop(),
      src: n
    };
  }
}, Cg = {
  extension: {
    type: D.ResolveParser,
    priority: -2,
    name: "resolveJson"
  },
  test: (n) => Ii.RETINA_PREFIX.test(n) && n.endsWith(".json"),
  parse: gc.parse
};
class Pg {
  constructor() {
    this._detections = [], this._initialized = !1, this.resolver = new Ii(), this.loader = new jm(), this.cache = st, this._backgroundLoader = new Um(this.loader), this._backgroundLoader.active = !0, this.reset();
  }
  /**
   * Best practice is to call this function before any loading commences
   * Initiating is the best time to add any customization to the way things are loaded.
   *
   * you do not need to call this for the Assets class to work, only if you want to set any initial properties
   * @param options - options to initialize the Assets manager with
   */
  async init(t = {}) {
    var s, a;
    if (this._initialized) {
      ct("[Assets]AssetManager already initialized, did you load before calling this Assets.init()?");
      return;
    }
    if (this._initialized = !0, t.defaultSearchParams && this.resolver.setDefaultSearchParams(t.defaultSearchParams), t.basePath && (this.resolver.basePath = t.basePath), t.bundleIdentifier && this.resolver.setBundleIdentifier(t.bundleIdentifier), t.manifest) {
      let o = t.manifest;
      typeof o == "string" && (o = await this.load(o)), this.resolver.addManifest(o);
    }
    const e = ((s = t.texturePreference) == null ? void 0 : s.resolution) ?? 1, i = typeof e == "number" ? [e] : e, r = await this._detectFormats({
      preferredFormats: (a = t.texturePreference) == null ? void 0 : a.format,
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
    const i = tn(t), r = ie(t).map((o) => {
      if (typeof o != "string") {
        const l = this.resolver.getAlias(o);
        return l.some((c) => !this.resolver.hasKey(c)) && this.add(o), Array.isArray(l) ? l[0] : l;
      }
      return this.resolver.hasKey(o) || this.add({ alias: o, src: o }), o;
    }), s = this.resolver.resolve(r), a = await this._mapLoadToResolve(s, e);
    return i ? a[r[0]] : a;
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
    const r = this.resolver.resolveBundle(t), s = {}, a = Object.keys(r);
    let o = 0, l = 0;
    const c = () => {
      e == null || e(++o / l);
    }, h = a.map((f) => {
      const d = r[f];
      return l += Object.keys(d).length, this._mapLoadToResolve(d, c).then((u) => {
        s[f] = u;
      });
    });
    return await Promise.all(h), i ? s[t[0]] : s;
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
    const s = {};
    return i.forEach((a) => {
      const o = r[a.src], l = [a.src];
      a.alias && l.push(...a.alias), l.forEach((c) => {
        s[c] = o;
      }), st.set(l, o);
    }), s;
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
    const e = ie(t).map((r) => typeof r != "string" ? r.src : r), i = this.resolver.resolve(e);
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
    this._initialized || await this.init(), t = ie(t);
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
const de = new Pg();
Pt.handleByList(D.LoadParser, de.loader.parsers).handleByList(D.ResolveParser, de.resolver.parsers).handleByList(D.CacheParser, de.cache.parsers).handleByList(D.DetectionParser, de.detections);
Pt.add(
  Gm,
  Wm,
  Vm,
  Xm,
  Hm,
  $m,
  Ym,
  Zm,
  tg,
  lg,
  ug,
  pc,
  Ag,
  zm,
  Dm,
  gc,
  Cg
);
const $o = {
  loader: D.LoadParser,
  resolver: D.ResolveParser,
  cache: D.CacheParser,
  detection: D.DetectionParser
};
Pt.handle(D.Asset, (n) => {
  const t = n.ref;
  Object.entries($o).filter(([e]) => !!t[e]).forEach(([e, i]) => Pt.add(Object.assign(
    t[e],
    // Allow the function to optionally define it's own
    // ExtensionMetadata, the use cases here is priority for LoaderParsers
    { extension: t[e].extension ?? i }
  )));
}, (n) => {
  const t = n.ref;
  Object.keys($o).filter((e) => !!t[e]).forEach((e) => Pt.remove(t[e]));
});
class sn extends un {
  /**
   * @param options - Options for the Graphics.
   */
  constructor(t) {
    t instanceof Yt && (t = { context: t });
    const { context: e, roundPixels: i, ...r } = t || {};
    super({
      label: "Graphics",
      ...r
    }), this.renderPipeId = "graphics", e ? this._context = e : this._context = this._ownedContext = new Yt(), this._context.on("update", this.onViewUpdate, this), this.allowChildren = !1, this.roundPixels = i ?? !1;
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
    return t ? new sn(this._context.clone()) : (this._ownedContext = null, new sn(this._context));
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
    return (t.width !== Yt.defaultStrokeStyle.width || t.color !== Yt.defaultStrokeStyle.color || t.alpha !== Yt.defaultStrokeStyle.alpha) && this.context.stroke(), this;
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
class Mg {
  /**
   * @param options - Options for the transform.
   * @param options.matrix - The matrix to use.
   * @param options.observer - The observer to use.
   */
  constructor({ matrix: t, observer: e } = {}) {
    this.dirty = !0, this._matrix = t ?? new H(), this.observer = e, this.position = new pt(this, 0, 0), this.scale = new pt(this, 1, 1), this.pivot = new pt(this, 0, 0), this.skew = new pt(this, 0, 0), this._rotation = 0, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1;
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
const _c = class Hs extends un {
  constructor(...t) {
    let e = t[0] || {};
    e instanceof V && (e = { texture: e }), t.length > 1 && ($(Y, "use new TilingSprite({ texture, width:100, height:100 }) instead"), e.width = t[1], e.height = t[2]), e = { ...Hs.defaultOptions, ...e };
    const {
      texture: i,
      anchor: r,
      tilePosition: s,
      tileScale: a,
      tileRotation: o,
      width: l,
      height: c,
      applyAnchorToTexture: h,
      roundPixels: f,
      ...d
    } = e ?? {};
    super({
      label: "TilingSprite",
      ...d
    }), this.renderPipeId = "tilingSprite", this.batched = !0, this.allowChildren = !1, this._anchor = new pt(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), this._applyAnchorToTexture = h, this.texture = i, this._width = l ?? i.width, this._height = c ?? i.height, this._tileTransform = new Mg({
      observer: {
        _onUpdate: () => this.onViewUpdate()
      }
    }), r && (this.anchor = r), this.tilePosition = s, this.tileScale = a, this.tileRotation = o, this.roundPixels = f ?? !1;
  }
  /**
   * Creates a new tiling sprite.
   * @param source - The source to create the texture from.
   * @param options - The options for creating the tiling sprite.
   * @returns A new tiling sprite.
   */
  static from(t, e = {}) {
    return typeof t == "string" ? new Hs({
      texture: st.get(t),
      ...e
    }) : new Hs({
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
    t || (t = V.EMPTY);
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
    let s = 0;
    return t.x >= r && t.x <= r + e && (s = -i * this._anchor._y, t.y >= s && t.y <= s + i);
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
_c.defaultOptions = {
  /** The texture to use for the sprite. */
  texture: V.EMPTY,
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
let Tg = _c;
class xc extends un {
  constructor(t, e) {
    const { text: i, resolution: r, style: s, anchor: a, width: o, height: l, roundPixels: c, ...h } = t;
    super({
      ...h
    }), this.batched = !0, this._resolution = null, this._autoResolution = !0, this._didTextUpdate = !0, this._styleClass = e, this.text = i ?? "", this.style = s, this.resolution = r ?? null, this.allowChildren = !1, this._anchor = new pt(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), a && (this.anchor = a), this.roundPixels = c ?? !1, o !== void 0 && (this.width = o), l !== void 0 && (this.height = l);
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
    let s = 0;
    return t.x >= r && t.x <= r + e && (s = -i * this.anchor.y, t.y >= s && t.y <= s + i);
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
function yc(n, t) {
  let e = n[0] ?? {};
  return (typeof e == "string" || n[1]) && ($(Y, `use new ${t}({ text: "hi!", style }) instead`), e = {
    text: e,
    style: n[1]
  }), e;
}
class kg extends xc {
  constructor(...t) {
    const e = yc(t, "Text");
    super(e, ii), this.renderPipeId = "text";
  }
  _updateBounds() {
    const t = this._bounds, e = this._anchor, i = zr.measureText(
      this._text,
      this._style
    ), { width: r, height: s } = i;
    t.minX = -e._x * r, t.maxX = t.minX + r, t.minY = -e._y * s, t.maxY = t.minY + s;
  }
}
class Eg extends xc {
  constructor(...t) {
    var e;
    const i = yc(t, "BitmapText");
    i.style ?? (i.style = i.style || {}), (e = i.style).fill ?? (e.fill = 16777215), super(i, ii), this.renderPipeId = "bitmapText";
  }
  _updateBounds() {
    const t = this._bounds, e = this._anchor, i = Ur.measureText(this.text, this._style), r = i.scale, s = i.offsetY * r;
    let a = i.width * r, o = i.height * r;
    const l = this._style._stroke;
    l && (a += l.width, o += l.width), t.minX = -e._x * a, t.maxX = t.minX + a, t.minY = -e._y * (o + s), t.maxY = t.minY + o;
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
Pt.add(Ju, tf);
let ts;
const Ti = /* @__PURE__ */ new Map(), Ig = () => {
  ts = de.get("audio/sounds.mp3");
  const n = de.get("audio/sounds.json");
  ts.muted = X.muted, ts.addSprites(n);
}, vc = async (n, t = {}) => {
  const { loop: e = !1, volume: i = 1 } = t, r = await ts.play({
    sprite: n,
    loop: e,
    volume: i,
    complete: () => Ti.delete(n)
  });
  Ti.set(n, r);
}, l_ = async (n, t) => {
  const {
    fromVolume: e = 0.1,
    toVolume: i = 1,
    fadeDuration: r,
    loop: s = !1
  } = t;
  await vc(n, { loop: s, volume: i }), await new ki({
    duration: r,
    from: { volume: e },
    to: { volume: i }
  }).start(Ti.get(n));
}, Bg = (n) => {
  var t;
  (t = Ti.get(n)) == null || t.stop(), Ti.delete(n);
}, h_ = async (n, t) => {
  const e = Ti.get(n);
  if (!e) return;
  const { fadeDuration: i } = t;
  await new ki({
    duration: i,
    from: { volume: e.volume },
    to: { volume: 0 }
  }).start(e), Bg(n);
}, Rg = (n) => {
  ts.muted = n;
}, ys = (n) => ({
  label: n.label,
  position: n.position,
  anchor: n.anchor,
  scale: n.scale,
  rotation: n.rotation,
  width: n.width,
  height: n.height,
  alpha: n.alpha,
  interactive: n.interactive,
  cursor: n.cursor,
  visible: n.visible,
  tint: n.tint
});
class Fg extends xs {
  constructor(t) {
    super(
      new Pi({
        ...ys(t),
        texture: V.from(t.resource)
      }),
      t
    );
  }
  get originalWidth() {
    return this.object.texture.width;
  }
  get originalHeight() {
    return this.object.texture.height;
  }
  set texture(t) {
    this.object.texture = V.from(t);
  }
}
class wc extends Fg {
  constructor(e) {
    super(e);
    te(this, "_pointerOver", !1);
  }
  get props() {
    return super.props;
  }
  get defaultResource() {
    return this.props.resource;
  }
  get hoverResource() {
    return this.props.hoverResource;
  }
  onPointerEnter() {
    this.texture = this.hoverResource, this._pointerOver = !0;
  }
  onPointerOut() {
    this.texture = this.defaultResource, this._pointerOver = !1;
  }
  async onClick() {
    vc(W.sounds.click), this.texture = this.defaultResource, await this.delay(0.1), this._pointerOver && (this.texture = this.hoverResource);
  }
}
class Lg extends xs {
  constructor(e) {
    super(new kt(ys(e)), e);
    te(this, "_components", []);
  }
  set components(e) {
    this._components = e;
  }
  get components() {
    return this._components;
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
    }), this.components = [];
  }
  destroy() {
    this.removeComponents(), super.destroy();
  }
  positionToScreen() {
    var e, i, r, s;
    this.props.horizontalAlignment === "center" ? this.x = (X.screen.width - (this.props.width ?? 0)) / 2 + (((e = this.props.margin) == null ? void 0 : e.x) ?? 0) : this.props.horizontalAlignment === "right" && (this.x = X.screen.width - (this.props.width ?? 0) + (((i = this.props.margin) == null ? void 0 : i.x) ?? 0)), this.props.verticalAlignment === "center" ? this.y = (X.screen.height - (this.props.height ?? 0)) / 2 + (((r = this.props.margin) == null ? void 0 : r.y) ?? 0) : this.props.verticalAlignment === "bottom" && (this.y = X.screen.height - (this.props.height ?? 0) + (((s = this.props.margin) == null ? void 0 : s.y) ?? 0));
  }
}
class c_ extends wc {
  async onClick() {
    super.onClick(), es(W.signals.showCredits);
  }
}
class Og extends xs {
  constructor(t) {
    super(
      new Tg({
        ...ys(t),
        texture: V.from(t.resource)
      }),
      t
    );
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
class Dg extends Og {
  constructor(t) {
    super(t), this.onResize();
  }
  onResize() {
    this.width = X.screen.width, this.height = X.screen.height;
    const t = X.screen.height / this.originalHeight;
    this.tileScale = { x: t, y: t };
  }
}
class u_ extends Dg {
  constructor(t) {
    super(t);
  }
  onTick() {
    this.tilePosition.x--;
  }
}
class f_ extends xs {
  constructor(t) {
    var r, s;
    const e = ys(t);
    delete e.position;
    let i = new sn(e).rect(
      ((r = t.position) == null ? void 0 : r.x) ?? 0,
      ((s = t.position) == null ? void 0 : s.y) ?? 0,
      t.width ?? 0,
      t.height ?? 0
    ).fill(t.fillColor);
    t.strokeColor != null && (i = i.stroke({
      color: t.strokeColor,
      width: t.strokeWidth ?? 1
    })), super(i, t);
  }
}
class zg extends xs {
  constructor(t) {
    const e = {
      ...ys(t),
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
    super(t.bitmap ? new Eg(e) : new kg(e), t);
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
class d_ extends wc {
  constructor(t) {
    super(t), X.muted && (this.texture = this.props.mutedResource);
  }
  get props() {
    return super.props;
  }
  get defaultResource() {
    return X.muted ? this.props.mutedResource : super.defaultResource;
  }
  get hoverResource() {
    return X.muted ? this.props.mutedHoverResource : super.hoverResource;
  }
  async onClick() {
    super.onClick(), localStorage.setItem("muted", X.muted ? "false" : "true"), X.muted = !X.muted, Rg(X.muted);
  }
}
class Ug extends Lg {
  constructor() {
    super({ label: "Scene" });
  }
  async init() {
  }
}
class Gg extends Ug {
  async init() {
    this.addComponent(
      new zg({
        label: "loading-text",
        text: "Loading...",
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
const Vg = (n, t, e = 500, i = 1e3) => {
  let r = null, s = !1;
  return { start: () => {
    r != null && clearTimeout(r), r = setTimeout(() => {
      s = !0, r = null, n();
    }, e);
  }, cancel: () => {
    r != null && (clearTimeout(r), r = null), s ? r = setTimeout(() => {
      s = !1, r = null, t();
    }, i) : t();
  } };
}, Wg = (n, t, e, i) => {
  const r = n.clientWidth, s = n.clientHeight;
  if (r < s) {
    const d = e;
    e = i, i = d;
  }
  const a = Math.min(
    r / e,
    s / i
  ), o = Math.floor(a * e), l = Math.floor(a * i), c = (r - o) / 2, h = (s - l) / 2;
  t.style.width = `${o}px`, t.style.height = `${l}px`, t.style.left = `${c}px`, t.style.top = `${h}px`, t.width = e, t.height = i;
  const f = e < i ? "portrait" : "landscape";
  return {
    width: e,
    height: i,
    orientation: f
  };
};
let bc;
function Ng(n) {
  return bc = n, n;
}
function ms() {
  return bc;
}
class Vr {
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
      const i = ms().context;
      t.setValueAtTime(e, i.audioContext.currentTime);
    } else
      t.value = e;
    return e;
  }
}
class Hg extends Mt {
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
let $g = 0;
const Wr = class extends Mt {
  /** @param parent - Parent element */
  constructor(n) {
    super(), this.id = $g++, this.init(n);
  }
  /**
   * Set a property by name, this makes it easy to chain values
   * @param name - Name of the property to set
   * @param value - Value to set property to
   */
  set(n, t) {
    if (this[n] === void 0)
      throw new Error(`Property with name ${n} does not exist.`);
    switch (n) {
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
    const { currentTime: n } = this._source;
    return n / this._duration;
  }
  /** Pauses the sound. */
  get paused() {
    return this._paused;
  }
  set paused(n) {
    this._paused = n, this.refreshPaused();
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
  init(n) {
    this._playing = !1, this._duration = n.source.duration;
    const t = this._source = n.source.cloneNode(!1);
    t.src = n.parent.url, t.onplay = this._onPlay.bind(this), t.onpause = this._onPause.bind(this), n.context.on("refresh", this.refresh, this), n.context.on("refreshPaused", this.refreshPaused, this), this._media = n;
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
  set speed(n) {
    this._speed = n, this.refresh();
  }
  /** Get the set the volume for this instance from 0 to 1 */
  get volume() {
    return this._volume;
  }
  set volume(n) {
    this._volume = n, this.refresh();
  }
  /** If the sound instance should loop playback */
  get loop() {
    return this._loop;
  }
  set loop(n) {
    this._loop = n, this.refresh();
  }
  /** `true` if the sound is muted */
  get muted() {
    return this._muted;
  }
  set muted(n) {
    this._muted = n, this.refresh();
  }
  /**
   * HTML Audio does not support filters, this is non-functional API.
   */
  get filters() {
    return console.warn("HTML Audio does not support filters"), null;
  }
  set filters(n) {
    console.warn("HTML Audio does not support filters");
  }
  /** Call whenever the loop, speed or volume changes */
  refresh() {
    const n = this._media.context, t = this._media.parent;
    this._source.loop = this._loop || t.loop;
    const e = n.volume * (n.muted ? 0 : 1), i = t.volume * (t.muted ? 0 : 1), r = this._volume * (this._muted ? 0 : 1);
    this._source.volume = r * e * i, this._source.playbackRate = this._speed * n.speed * t.speed;
  }
  /** Handle changes in paused state, either globally or sound or instance */
  refreshPaused() {
    const n = this._media.context, t = this._media.parent, e = this._paused || t.paused || n.paused;
    e !== this._pausedReal && (this._pausedReal = e, e ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({
      start: this._source.currentTime,
      end: this._end,
      volume: this._volume,
      speed: this._speed,
      loop: this._loop
    })), this.emit("pause", e));
  }
  /** Start playing the sound/ */
  play(n) {
    const { start: t, end: e, speed: i, loop: r, volume: s, muted: a } = n;
    e && console.assert(e > t, "End time is before start time"), this._speed = i, this._volume = s, this._loop = !!r, this._muted = a, this.refresh(), this.loop && e !== null && (console.warn('Looping not support when specifying an "end" time'), this.loop = !1), this._start = t, this._end = e || this._duration, this._start = Math.max(0, this._start - Wr.PADDING), this._end = Math.min(this._end + Wr.PADDING, this._duration), this._source.onloadedmetadata = () => {
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
    const n = this._source;
    n && (n.onended = null, n.onplay = null, n.onpause = null, this._internalStop()), this._source = null, this._speed = 1, this._volume = 1, this._loop = !1, this._end = null, this._start = 0, this._duration = 0, this._playing = !1, this._pausedReal = !1, this._paused = !1, this._muted = !1, this._media && (this._media.context.off("refresh", this.refresh, this), this._media.context.off("refreshPaused", this.refreshPaused, this), this._media = null);
  }
  /**
   * To string method for instance.
   * @return The string representation of instance.
   */
  toString() {
    return `[HTMLAudioInstance id=${this.id}]`;
  }
};
let Sc = Wr;
Sc.PADDING = 0.1;
class Yg extends Mt {
  init(t) {
    this.parent = t, this._source = t.options.source || new Audio(), t.url && (this._source.src = t.url);
  }
  // Implement create
  create() {
    return new Sc(this);
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
      o(), i.isLoaded = !0;
      const l = i.autoPlayStart();
      t && t(null, i, l);
    }, s = () => {
      o(), t && t(new Error("Sound loading has been aborted"));
    }, a = () => {
      o();
      const l = `Failed to load audio element (code: ${e.error.code})`;
      t ? t(new Error(l)) : console.error(l);
    }, o = () => {
      e.removeEventListener("canplaythrough", r), e.removeEventListener("load", r), e.removeEventListener("abort", s), e.removeEventListener("error", a);
    };
    e.addEventListener("canplaythrough", r, !1), e.addEventListener("load", r, !1), e.addEventListener("abort", s, !1), e.addEventListener("error", a, !1), e.load();
  }
}
class Xg {
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
], jg = [
  "audio/mpeg",
  "audio/ogg"
], rn = {};
function Kg(n) {
  const t = {
    m4a: "audio/mp4",
    oga: "audio/ogg",
    opus: 'audio/ogg; codecs="opus"',
    caf: 'audio/x-caf; codecs="opus"'
  }, e = document.createElement("audio"), i = {}, r = /^no$/;
  nn.forEach((s) => {
    const a = e.canPlayType(`audio/${s}`).replace(r, ""), o = t[s] ? e.canPlayType(t[s]).replace(r, "") : "";
    i[s] = !!a || !!o;
  }), Object.assign(rn, i);
}
Kg();
let qg = 0;
class Zg extends Mt {
  constructor(t) {
    super(), this.id = qg++, this._media = null, this._paused = !1, this._muted = !1, this._elapsed = 0, this.init(t);
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
    const i = t.volume * (t.muted ? 0 : 1), r = e.volume * (e.muted ? 0 : 1), s = this._volume * (this._muted ? 0 : 1);
    Vr.setParamValue(this._gain.gain, s * r * i), Vr.setParamValue(this._source.playbackRate, this._speed * e.speed * t.speed), this.applyFilters();
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
    const { start: e, end: i, speed: r, loop: s, volume: a, muted: o, filters: l } = t;
    i && console.assert(i > e, "End time is before start time"), this._paused = !1;
    const { source: c, gain: h } = this._media.nodes.cloneBufferSource();
    this._source = c, this._gain = h, this._speed = r, this._volume = a, this._loop = !!s, this._muted = o, this._filters = l, this.refresh();
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
        const s = this._duration;
        let a;
        if (this._source.loopStart) {
          const o = this._source.loopEnd - this._source.loopStart;
          a = (this._source.loopStart + this._elapsed % o) / s;
        } else
          a = this._elapsed % s / s;
        this._progress = a, this.emit("progress", this._progress, s);
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
class Ac {
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
const Cc = class extends Ac {
  /**
   * @param context - The audio context.
   */
  constructor(n) {
    const t = n.audioContext, e = t.createBufferSource(), i = t.createGain(), r = t.createAnalyser();
    e.connect(r), r.connect(i), i.connect(n.destination), super(r, i), this.context = n, this.bufferSource = e, this.gain = i, this.analyser = r;
  }
  /**
   * Get the script processor node.
   * @readonly
   */
  get script() {
    return this._script || (this._script = this.context.audioContext.createScriptProcessor(Cc.BUFFER_SIZE), this._script.connect(this.context.destination)), this._script;
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
    const n = this.bufferSource, t = this.context.audioContext.createBufferSource();
    t.buffer = n.buffer, Vr.setParamValue(t.playbackRate, n.playbackRate.value), t.loop = n.loop;
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
let Pc = Cc;
Pc.BUFFER_SIZE = 0;
class Qg {
  /**
   * Re-initialize without constructing.
   * @param parent - - Instance of parent Sound container
   */
  init(t) {
    this.parent = t, this._nodes = new Pc(this.context), this._source = this._nodes.bufferSource, this.source = t.options.source;
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
    return new Zg(this);
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
    const e = this.parent.url, i = await at.get().fetch(e);
    this._decode(await i.arrayBuffer(), t);
  }
  /**
   * Decodes the array buffer.
   * @param arrayBuffer - From load.
   * @param {Function} callback - Callback optional
   */
  _decode(t, e) {
    const i = (r, s) => {
      if (r)
        e && e(r);
      else {
        this.parent.isLoaded = !0, this.buffer = s;
        const a = this.parent.autoPlayStart();
        e && e(null, this.parent, a);
      }
    };
    t instanceof AudioBuffer ? i(null, t) : this.parent.context.decode(t, i);
  }
}
const hi = class {
  /**
   * Create a new sound instance from source.
   * @param source - Either the path or url to the source file.
   *        or the object of options to use.
   * @return Created sound instance.
   */
  static from(n) {
    let t = {};
    typeof n == "string" ? t.url = n : n instanceof ArrayBuffer || n instanceof AudioBuffer || n instanceof HTMLAudioElement ? t.source = n : Array.isArray(n) ? t.url = n : t = n, t = {
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
    const e = ms().useLegacy ? new Yg() : new Qg();
    return new hi(e, t);
  }
  /**
   * Use `Sound.from`
   * @ignore
   */
  constructor(n, t) {
    this.media = n, this.options = t, this._instances = [], this._sprites = {}, this.media.init(this);
    const e = t.complete;
    this._autoPlayOptions = e ? { complete: e } : null, this.isLoaded = !1, this._preloadQueue = null, this.isPlaying = !1, this.autoPlay = t.autoPlay, this.singleInstance = t.singleInstance, this.preload = t.preload || this.autoPlay, this.url = Array.isArray(t.url) ? this.preferUrl(t.url) : t.url, this.speed = t.speed, this.volume = t.volume, this.loop = t.loop, t.sprites && this.addSprites(t.sprites), this.preload && this._preload(t.loaded);
  }
  /**
   * Internal help for resolving which file to use if there are multiple provide
   * this is especially helpful for working with bundlers (non Assets loading).
   */
  preferUrl(n) {
    const [t] = n.map((e) => ({ url: e, ext: wt.extname(e).slice(1) })).filter(({ ext: e }) => rn[e]).sort((e, i) => nn.indexOf(e.ext) - nn.indexOf(i.ext));
    if (!t)
      throw new Error("No supported file type found");
    return t.url;
  }
  /** Instance of the media context. */
  get context() {
    return ms().context;
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
  set paused(n) {
    this._paused = n, this.refreshPaused();
  }
  /** The playback rate. */
  get speed() {
    return this._speed;
  }
  set speed(n) {
    this._speed = n, this.refresh();
  }
  /** Set the filters. Only supported with WebAudio. */
  get filters() {
    return this.media.filters;
  }
  set filters(n) {
    this.media.filters = n;
  }
  /**
   * @ignore
   */
  addSprites(n, t) {
    if (typeof n == "object") {
      const i = {};
      for (const r in n)
        i[r] = this.addSprites(r, n[r]);
      return i;
    }
    console.assert(!this._sprites[n], `Alias ${n} is already taken`);
    const e = new Xg(this, t);
    return this._sprites[n] = e, e;
  }
  /** Destructor, safer to use `SoundLibrary.remove(alias)` to remove this sound. */
  destroy() {
    this._removeInstances(), this.removeSprites(), this.media.destroy(), this.media = null, this._sprites = null, this._instances = null;
  }
  /**
   * Remove a sound sprite.
   * @param alias - The unique name of the sound sprite, if alias is omitted, removes all sprites.
   */
  removeSprites(n) {
    if (n) {
      const t = this._sprites[n];
      t !== void 0 && (t.destroy(), delete this._sprites[n]);
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
    for (let n = this._instances.length - 1; n >= 0; n--)
      this._instances[n].stop();
    return this;
  }
  // Overloaded function
  play(n, t) {
    let e;
    if (typeof n == "string" ? e = { sprite: n, loop: this.loop, complete: t } : typeof n == "function" ? (e = {}, e.complete = n) : e = n, e = {
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
      const s = this._sprites[r];
      e.start = s.start + (e.start || 0), e.end = s.end, e.speed = s.speed || 1, e.loop = s.loop || e.loop, delete e.sprite;
    }
    if (e.offset && (e.start = e.offset), !this.isLoaded)
      return this._preloadQueue ? new Promise((r) => {
        this._preloadQueue.push(() => {
          r(this.play(e));
        });
      }) : (this._preloadQueue = [], this.autoPlay = !0, this._autoPlayOptions = e, new Promise((r, s) => {
        this._preload((a, o, l) => {
          this._preloadQueue.forEach((c) => c()), this._preloadQueue = null, a ? s(a) : (e.loaded && e.loaded(a, o, l), r(l));
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
    const n = this._instances.length;
    for (let t = 0; t < n; t++)
      this._instances[t].refresh();
  }
  /** Handle changes in paused state. Internal only. */
  refreshPaused() {
    const n = this._instances.length;
    for (let t = 0; t < n; t++)
      this._instances[t].refreshPaused();
  }
  /** Gets and sets the volume. */
  get volume() {
    return this._volume;
  }
  set volume(n) {
    this._volume = n, this.refresh();
  }
  /** Gets and sets the muted flag. */
  get muted() {
    return this._muted;
  }
  set muted(n) {
    this._muted = n, this.refresh();
  }
  /** Gets and sets the looping. */
  get loop() {
    return this._loop;
  }
  set loop(n) {
    this._loop = n, this.refresh();
  }
  /** Starts the preloading of sound. */
  _preload(n) {
    this.media.load(n);
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
    let n;
    return this.autoPlay && (n = this.play(this._autoPlayOptions)), n;
  }
  /** Removes all instances. */
  _removeInstances() {
    for (let n = this._instances.length - 1; n >= 0; n--)
      this._poolInstance(this._instances[n]);
    this._instances.length = 0;
  }
  /**
   * Sound instance completed.
   * @param instance
   */
  _onComplete(n) {
    if (this._instances) {
      const t = this._instances.indexOf(n);
      t > -1 && this._instances.splice(t, 1), this.isPlaying = this._instances.length > 0;
    }
    this._poolInstance(n);
  }
  /** Create a new instance. */
  _createInstance() {
    if (hi._pool.length > 0) {
      const n = hi._pool.pop();
      return n.init(this.media), n;
    }
    return this.media.create();
  }
  /**
   * Destroy/recycling the instance object.
   * @param instance - Instance to recycle
   */
  _poolInstance(n) {
    n.destroy(), hi._pool.indexOf(n) < 0 && hi._pool.push(n);
  }
};
let an = hi;
an._pool = [];
class gs extends Ac {
  constructor() {
    const t = window, e = new gs.AudioContext(), i = e.createDynamicsCompressor(), r = e.createAnalyser();
    r.connect(i), i.connect(e.destination), super(r, i), this.autoPause = !0, this._ctx = e, this._offlineCtx = new gs.OfflineAudioContext(
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
    const i = (s) => {
      e(new Error((s == null ? void 0 : s.message) || "Unable to decode file"));
    }, r = this._offlineCtx.decodeAudioData(
      t,
      (s) => {
        e(null, s);
      },
      i
    );
    r && r.catch(i);
  }
}
class Jg {
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
    return this.supported && (this._webAudioContext = new gs()), this._htmlAudioContext = new Hg(), this._sounds = {}, this.useLegacy = !this.supported, this;
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
    return gs.AudioContext !== null;
  }
  /**
   * @ignore
   */
  add(t, e) {
    if (typeof t == "object") {
      const s = {};
      for (const a in t) {
        const o = this._getOptions(
          t[a],
          e
        );
        s[a] = this.add(a, o);
      }
      return s;
    }
    if (console.assert(!this._sounds[t], `Sound with alias ${t} already exists.`), e instanceof an)
      return this._sounds[t] = e, e;
    const i = this._getOptions(e), r = an.from(i);
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
const Yo = (n) => {
  var i;
  const t = n.src;
  let e = (i = n == null ? void 0 : n.alias) == null ? void 0 : i[0];
  return (!e || n.src === e) && (e = wt.basename(t, wt.extname(t))), e;
}, t_ = {
  extension: D.Asset,
  detection: {
    test: async () => !0,
    add: async (n) => [...n, ...nn.filter((t) => rn[t])],
    remove: async (n) => n.filter((t) => n.includes(t))
  },
  loader: {
    name: "sound",
    extension: {
      type: [D.LoadParser],
      priority: Me.High
    },
    /** Should we attempt to load this file? */
    test(n) {
      const t = wt.extname(n).slice(1);
      return !!rn[t] || jg.some((e) => n.startsWith(`data:${e}`));
    },
    /** Load the sound file, this is mostly handled by Sound.from() */
    async load(n, t) {
      const e = await new Promise((i, r) => an.from({
        ...t.data,
        url: n,
        preload: !0,
        loaded(s, a) {
          var o, l;
          s ? r(s) : i(a), (l = (o = t.data) == null ? void 0 : o.loaded) == null || l.call(o, s, a);
        }
      }));
      return ms().add(Yo(t), e), e;
    },
    /** Remove the sound from the library */
    async unload(n, t) {
      ms().remove(Yo(t));
    }
  }
};
Pt.add(t_);
Ng(new Jg());
let se;
const Mc = () => W.screen.width * 1 / W.screen.aspectRatio, Xo = () => {
  const { width: n, height: t, orientation: e } = Wg(
    W.gameContainer,
    se.canvas,
    W.screen.width,
    Mc()
  );
  (n !== X.screen.width || t !== X.screen.height) && (X.screen.width = n, X.screen.height = t, se.renderer.resize(n, t), es(W.signals.onResize));
  const i = X.screen.orientation !== e;
  X.screen.orientation = e, i && es(W.signals.onOrientationChange);
}, e_ = () => {
  const { start: n } = Vg(
    () => {
      Xo();
    },
    () => {
    },
    100
  );
  new ResizeObserver(() => {
    n();
  }).observe(W.gameContainer), Xo();
}, i_ = () => {
  let n = 0, t = 0, e = 0;
  W.debug && setInterval(() => {
    console.log(
      t === 0 ? 0 : Math.floor(e / t)
    ), t = 0, e = 0;
  }, 1e3), se.ticker.maxFPS = W.maxFPS, se.ticker.add((i) => {
    for (W.debug && (e += Math.floor(i.FPS), t++), n += i.deltaMS; n >= W.tickIntervalMillis; )
      es(W.signals.onTick), ki.updateEngine(W.tickIntervalMillis), qu(W.tickIntervalMillis), n -= W.tickIntervalMillis;
  });
}, s_ = async (n) => {
  X.scene && (X.scene.destroy(), se.stage.removeChild(X.scene.object)), X.scene = n, se.stage.addChild(X.scene.object), await n.init();
}, p_ = async () => {
  W.gameContainer.style.backgroundColor = W.colors.backgroundColor, se = new Wh(), await se.init({
    backgroundColor: W.colors.backgroundColor,
    width: W.screen.width,
    height: Mc()
  }), W.debug && (globalThis.__PIXI_APP__ = se), W.gameContainer.appendChild(se.canvas), se.canvas.style.position = "absolute", s_(new Gg()), e_(), Ku(), ki.initEngine(), i_(), await Promise.all([
    new Promise(
      (n) => setTimeout(n, W.loadingScene.keepAliveTimeMS)
    ),
    (async () => {
      await de.init({
        basePath: W.assets.basePath,
        manifest: W.assets.manifest
      }), de.addBundle("extra", W.assets.extra), await Promise.all([
        de.loadBundle("default"),
        de.loadBundle("extra")
      ]), Ig();
    })()
  ]), es(W.signals.destroyLoadingScene);
}, m_ = (n, t) => Math.floor(Math.random() * (t - n) + n);
export {
  $,
  zh as A,
  It as B,
  kt as C,
  at as D,
  D as E,
  rh as F,
  dn as G,
  ge as H,
  so as I,
  Pi as J,
  od as K,
  gd as L,
  H as M,
  gt as N,
  mt as O,
  St as P,
  Fd as Q,
  Pr as R,
  tp as S,
  Pe as T,
  br as U,
  ro as V,
  Gf as W,
  Dn as X,
  ft as Y,
  oh as Z,
  Uh as _,
  V as a,
  Y as a0,
  Ud as a1,
  ap as a2,
  Cp as a3,
  Mp as a4,
  Bp as a5,
  Fp as a6,
  Lp as a7,
  Ci as a8,
  ii as a9,
  d_ as aA,
  Ku as aB,
  qu as aC,
  r_ as aD,
  Zu as aE,
  Qu as aF,
  a_ as aG,
  Ug as aH,
  Gg as aI,
  ki as aJ,
  s_ as aK,
  p_ as aL,
  Fc as aM,
  Ca as aN,
  es as aO,
  Ig as aP,
  vc as aQ,
  l_ as aR,
  Bg as aS,
  h_ as aT,
  Rg as aU,
  m_ as aV,
  Vg as aW,
  Cm as aa,
  ec as ab,
  go as ac,
  po as ad,
  ff as ae,
  Ur as af,
  Im as ag,
  sn as ah,
  st as ai,
  pf as aj,
  zr as ak,
  Dr as al,
  zo as am,
  sc as an,
  W as ao,
  X as ap,
  xs as aq,
  wc as ar,
  Lg as as,
  c_ as at,
  u_ as au,
  f_ as av,
  Fg as aw,
  zg as ax,
  Dg as ay,
  Og as az,
  we as b,
  Mt as c,
  ds as d,
  Pt as e,
  mo as f,
  Zd as g,
  Ws as h,
  ca as i,
  Lh as j,
  _h as k,
  Ih as l,
  Do as m,
  $a as n,
  Ap as o,
  Pp as p,
  Ep as q,
  Pf as r,
  $h as s,
  Rp as t,
  ua as u,
  Mh as v,
  ct as w,
  df as x,
  Dp as y,
  be as z
};
