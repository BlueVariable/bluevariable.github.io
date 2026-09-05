#!/usr/bin/env node
(function (root) {
  'use strict';

  var DEFAULTS = {
    grain: { type: 'turbulence', freq: [0.02, 0.91], octaves: 1, seed: 1 },
    grit: { on: true, type: 'turbulence', freq: [0.77, 0.1], octaves: 4, seed: 1, mix: 0.85 },
    threshold: { offset: -0.31, slope: 120 },
    mod: { on: false, freq: [0.06, 0.002], octaves: 1, seed: 1, amount: 0.8 },
    boil: { freq: [0.005, 0.1], scale: 3.5, seeds: [1, 2, 3] },
    shapes: {
      blur: 1.6,
      wave: { freq: [0.1, 0.1], octaves: 1, seed: 9, scale: 4.5 },
      line: { widths: [70, 64, 58, 52, 46, 40, 34], head: 0 },
      bracket: { stem: 32, tick: 5.5, top: 4, bottom: 96 },
      dot: { box: [20.19, 20.10], wobble: 3, path: 'M 19.19,7.08 C 19.1,7.71 19.01,8.35 18.92,9.02 C 18.83,9.68 18.7,10.31 18.52,10.92 C 18.44,11.89 18.23,12.84 17.92,13.77 C 17.61,14.69 17.11,15.5 16.42,16.21 C 16.23,16.47 16.05,16.71 15.88,16.92 C 15.71,17.14 15.53,17.34 15.35,17.52 C 15.01,17.88 14.61,18.17 14.17,18.37 C 13.72,18.59 13.15,18.8 12.44,18.98 C 11.82,18.98 11.17,19 10.46,19.04 C 9.76,19.08 8.97,19.1 8.08,19.1 C 6.58,19.1 5.35,18.53 4.4,17.4 C 4.03,16.95 3.65,16.46 3.25,15.94 C 2.86,15.41 2.44,14.89 2,14.35 C 1.92,13.83 1.78,13.3 1.6,12.77 C 1.44,12.24 1.3,11.72 1.21,11.19 C 1.04,10.14 1,9.12 1.08,8.15 C 1.17,7.18 1.52,6.25 2.15,5.38 C 2.23,5.28 2.31,5.19 2.4,5.1 C 2.49,5.02 2.58,4.93 2.67,4.83 C 3.38,4.14 4.15,3.51 4.98,2.94 C 5.81,2.35 6.76,1.93 7.83,1.67 C 8.09,1.58 8.44,1.52 8.88,1.48 C 9.32,1.43 9.71,1.35 10.06,1.27 C 10.51,1.27 10.94,1.25 11.38,1.21 C 11.82,1.17 12.31,1.1 12.85,1 C 14.34,1.79 15.63,2.64 16.73,3.52 C 17.84,4.4 18.66,5.58 19.19,7.08' }
    },
    profile: {
      bottom: [[0.7, 1], [0.78, 0.58], [0.9, 0.56], [1, 0.3]],
      top: [[0.4, 1], [0.52, 0.6], [0.92, 0.57], [1, 0.25]]
    }
  };

  var DIRS = {
    b: { grad: "x1='0' y1='0' x2='0' y2='100%'", profile: 'bottom', swap: false },
    t: { grad: "x1='0' y1='100%' x2='0' y2='0'", profile: 'top', swap: false },
    l: { grad: "x1='100%' y1='0' x2='0' y2='0'", profile: 'top', swap: true },
    r: { grad: "x1='0' y1='0' x2='100%' y2='0'", profile: 'top', swap: true }
  };
  var SHAPES = ['line', 'bl', 'br', 'dot'];

  function freq(f, swap) { return (swap ? [f[1], f[0]] : f).join(' '); }
  function turb(o, swap, seed, result) {
    return "<feTurbulence type='" + (o.type || 'fractalNoise') + "' baseFrequency='" + freq(o.freq, swap) +
      "' numOctaves='" + o.octaves + "' seed='" + seed + "' result='" + result + "'/>";
  }
  function grainFilter(p, swap, input) {
    var f = turb(p.grain, swap, p.grain.seed, 'n'), noise = 'n';
    if (p.grit && p.grit.on) {
      f += turb(p.grit, swap, p.grit.seed, 'g');
      f += "<feComposite in='n' in2='g' operator='arithmetic' k2='" + p.grit.mix + "' k3='" + +(1 - p.grit.mix).toFixed(4) + "' result='n2'/>";
      noise = 'n2';
    }
    f += "<feComposite in='" + input + "' in2='" + noise + "' operator='arithmetic' k2='1' k3='1' k4='" + p.threshold.offset + "' result='s'/>";
    return f;
  }
  function thresholdFilter(p) {
    var slope = p.threshold.slope, intercept = 0.5 - slope * 0.5;
    return "<feComponentTransfer in='s' result='m'><feFuncA type='linear' slope='" + slope + "' intercept='" + intercept + "'/></feComponentTransfer>";
  }
  function boilFilter(p, swap, frame) {
    return turb(p.boil, swap, p.boil.seeds[frame], 'w') +
      "<feDisplacementMap in='m' in2='w' scale='" + p.boil.scale + "' xChannelSelector='R' yChannelSelector='G'/>";
  }

  function edgeSvg(p, dir, frame) {
    var d = DIRS[dir], swap = d.swap;
    var stops = p.profile[d.profile].map(function (s) { return "<stop offset='" + s[0] + "' stop-color='#fff' stop-opacity='" + s[1] + "'/>"; }).join('');
    var rect = swap ? "x='-10' y='-5%' width='150%' height='110%'" : "x='-5%' y='-10' width='110%' height='150%'";
    var f = grainFilter(p, swap, 'SourceGraphic');
    if (p.mod && p.mod.on) {
      f += turb(p.mod, swap, p.mod.seed, 'b');
      f += "<feComposite in='s' in2='b' operator='arithmetic' k2='1' k3='" + p.mod.amount + "' k4='" + (-p.mod.amount / 2) + "' result='s'/>";
    }
    f += thresholdFilter(p) + boilFilter(p, swap, frame);
    return "<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>" +
      "<defs><linearGradient id='g' gradientUnits='userSpaceOnUse' " + d.grad + ">" + stops + "</linearGradient>" +
      "<filter id='f' x='0' y='0' width='100%' height='100%'>" + f + "</filter></defs>" +
      "<rect " + rect + " fill='url(#g)' filter='url(#f)'/></svg>";
  }

  function lineShape(o) {
    var n = o.widths.length, s = "<circle cx='50%' cy='" + o.head + "' r='" + o.head + "'/>";
    for (var i = 0; i < n; i++) {
      var w = o.widths[i], y0 = (100 / n) * i, h = 100 / n + (i < n - 1 ? 0.5 : 0);
      s += "<rect x='" + +(50 - w / 2).toFixed(2) + "%' y='" + +y0.toFixed(2) + "%' width='" + w + "%' height='" + +h.toFixed(2) + "%'/>";
    }
    return s;
  }
  function bracketShape(o, right) {
    return "<rect x='" + (right ? 100 - o.stem : 0) + "%' y='" + o.top + "%' width='" + o.stem + "%' height='" + (o.bottom - o.top) + "%'/>" +
      "<rect x='0' y='" + o.top + "%' width='100%' height='" + o.tick + "%'/>" +
      "<rect x='0' y='" + (o.bottom - o.tick) + "%' width='100%' height='" + o.tick + "%'/>";
  }
  function shapeSvg(p, kind, frame) {
    var o = p.shapes, shape = kind === 'line' ? lineShape(o.line) : bracketShape(o.bracket, kind === 'br');
    var f = turb(o.wave, false, o.wave.seed, 'wv') +
      "<feDisplacementMap in='SourceGraphic' in2='wv' scale='" + o.wave.scale + "' xChannelSelector='R' yChannelSelector='G'/>" +
      "<feGaussianBlur stdDeviation='" + o.blur + "' result='bl'/>" +
      grainFilter(p, false, 'bl') + thresholdFilter(p) + boilFilter(p, false, frame);
    return "<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>" +
      "<filter id='f' x='-50%' y='-10%' width='200%' height='120%'>" + f + "</filter>" +
      "<g filter='url(#f)'>" + shape + "</g></svg>";
  }

  function dotSvg(p, frame) {
    var o = p.shapes.dot;
    var f = turb({ freq: [0.13, 0.13], octaves: 2 }, false, p.boil.seeds[frame], 'w') +
      "<feDisplacementMap in='SourceGraphic' in2='w' scale='" + o.wobble + "' xChannelSelector='R' yChannelSelector='G'/>";
    return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + o.box[0] + " " + o.box[1] + "'>" +
      "<filter id='f' x='-20%' y='-20%' width='140%' height='140%'>" + f + "</filter>" +
      "<path d='" + o.path + "' fill='#fff' filter='url(#f)'/></svg>";
  }

  function uri(s) { return 'url("data:image/svg+xml,' + s.replace(/%/g, '%25').replace(/#/g, '%23') + '")'; }

  function build(p) {
    var vars = {}, css = ':root {\n';
    var add = function (kind, render) {
      vars[kind] = [];
      for (var k = 0; k < p.boil.seeds.length; k++) {
        var u = uri(render(k));
        vars[kind].push(u);
        css += '  --tear-' + kind + (k + 1) + ': ' + u + ';\n';
      }
    };
    Object.keys(DIRS).forEach(function (dir) { add(dir, function (k) { return edgeSvg(p, dir, k); }); });
    SHAPES.forEach(function (kind) { add(kind, function (k) { return kind === 'dot' ? dotSvg(p, k) : shapeSvg(p, kind, k); }); });
    return { css: css + '}\n', vars: vars };
  }

  var api = { DEFAULTS: DEFAULTS, build: build };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
    if (typeof require !== 'undefined' && require.main === module) process.stdout.write(build(DEFAULTS).css);
  } else {
    root.Tears = api;
  }
})(typeof window !== 'undefined' ? window : this);
