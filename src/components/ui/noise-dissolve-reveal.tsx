"use client"

import * as React from "react"

export interface NoiseDissolveRevealProps {
  /** Content sitting under the veil, revealed as it tears away */
  children?: React.ReactNode
  /** Veil colour. The sheet that tears. Defaults to #0C0C0C */
  veilColor?: string
  /** Luminous tear fringe colour along the tear edge. Defaults to #D7E2EA */
  edgeColor?: string
  /** Title text on the veil that tears apart along with the veil */
  veilTitle?: string
  /** Subtitle text under the title */
  veilSubtitle?: string
  /** How long the tear itself takes, in ms */
  durationMs?: number
  /** Hold before the tear begins, in ms */
  delayMs?: number
  /**
   * Tear open, hold, seal back, repeat. For showcases. `onReveal` still fires
   * on the first open. Leave it off to use this as a real page gate.
   */
  loop?: boolean
  /** Hold at each end of a loop cycle, in ms */
  holdMs?: number
  /**
   * Blob size. Higher means smaller, more numerous islands; lower means
   * fewer, broader tears. Roughly 1.5 to 8. Defaults to 5.0.
   */
  noiseScale?: number
  /** Edge feather. 0 is a hard paper tear, 0.2 is an ink bleed. Defaults to 0.025. */
  softness?: number
  /**
   * How much earlier the middle opens than the corners. 0 tears everywhere at
   * once; 1 opens from the centre outward. Defaults to 0.35.
   */
  centerBias?: number
  /** Root height. A definite length - never a percentage. Defaults to 100vh. */
  height?: string
  /** Fired once, when the veil has finished tearing away */
  onReveal?: () => void
  /** Extra root class names */
  className?: string
}

// #region progress
export function tearEase(t: number): number {
  const p = Math.min(1, Math.max(0, t))
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 2.4) / 2
}

export function loopPhase(
  elapsed: number,
  duration: number,
  hold: number,
): { progress: number; stage: "opening" | "open" | "sealing" | "sealed" } {
  const cycle = duration * 2 + hold * 2
  const t = ((elapsed % cycle) + cycle) % cycle
  if (t < duration) return { progress: tearEase(t / duration), stage: "opening" }
  if (t < duration + hold) return { progress: 1, stage: "open" }
  if (t < duration * 2 + hold)
    return { progress: 1 - tearEase((t - duration - hold) / duration), stage: "sealing" }
  return { progress: 0, stage: "sealed" }
}

export function parseHex(hex: string): [number, number, number] {
  let h = hex.trim().replace("#", "")
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return [0, 0, 0]
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}
// #endregion

const VERTEX_SRC = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const FRAGMENT_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_progress;
uniform vec3 u_color;
uniform vec3 u_edgeColor;
uniform float u_scale;
uniform float u_soft;
uniform float u_bias;
uniform float u_seed;
uniform int u_hasText;
uniform sampler2D u_textTexture;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21) + u_seed);
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  float norm = 0.0;
  for (int i = 0; i < 5; i++) {
    sum += amp * noise(p);
    norm += amp;
    p *= 2.03;
    amp *= 0.5;
  }
  return sum / norm;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  // 1. ACTIVE NOISE DISTORTION WAVE
  // As dissolve begins, turbulent noise actively warps and distorts the typography
  float distStrength = smoothstep(0.0, 0.25, u_progress) * (1.0 - smoothstep(0.85, 1.0, u_progress));
  float nx = fbm(p * 5.5 + vec2(u_time * 0.45, 0.0));
  float ny = fbm(p * 5.5 + vec2(0.0, u_time * 0.45) + 31.7);
  vec2 distortion = vec2(nx - 0.5, ny - 0.5) * 0.09 * distStrength;

  vec2 distUV = clamp(uv + distortion, 0.0, 1.0);

  // 2. FRACTAL NOISE TEAR EROSION
  float n = fbm(p * u_scale + vec2(nx * 0.15, ny * 0.15));
  n = smoothstep(0.24, 0.76, n);

  // Center bias (tear opens from the middle out)
  float d = clamp(length(p) * 1.35, 0.0, 1.0);

  // Sweep threshold from -0.06 to 1.18
  float t = mix(-u_soft - 0.03, 1.0 + u_soft + 0.04, u_progress);
  float thr = t * (1.0 + u_bias) - u_bias * d;

  // Base veil alpha (1 = opaque, 0 = dissolved hole)
  float alpha = smoothstep(thr - u_soft, thr + u_soft, n);

  // 3. LUMINOUS TITANIUM-SILVER TEAR FRINGE
  float edgeDist = abs(n - thr);
  float edgeWidth = u_soft * 4.0 + 0.018;
  float edge = 1.0 - smoothstep(0.0, edgeWidth, edgeDist);
  edge = clamp(edge * 1.85, 0.0, 1.0);
  edge *= smoothstep(0.01, 0.06, u_progress) * (1.0 - smoothstep(0.95, 1.0, u_progress));

  // 4. TEXT SAMPLING WITH CHROMATIC RGB DISPERSION ALONG DISTORTION
  vec3 textSample = u_color;
  float textA = 0.0;
  if (u_hasText == 1) {
    vec2 splitR = clamp(distUV + distortion * 0.35, 0.0, 1.0);
    vec2 splitB = clamp(distUV - distortion * 0.35, 0.0, 1.0);
    float r = texture(u_textTexture, splitR).r;
    float g = texture(u_textTexture, distUV).g;
    float b = texture(u_textTexture, splitB).b;
    float a = texture(u_textTexture, distUV).a;
    textSample = vec3(r, g, b);
    textA = a;
  }

  // Base veil color: blend curtain with distorted text
  vec3 baseColor = mix(u_color, textSample, textA);

  // Blend luminous tear edge fringe (#D7E2EA / #FFFFFF)
  vec3 finalColor = mix(baseColor, u_edgeColor, edge * 0.95);
  float finalAlpha = max(alpha, edge * 0.95);

  fragColor = vec4(finalColor, clamp(finalAlpha, 0.0, 1.0));
}`

const NDR_CSS = `
.ndr-root, .ndr-root * { box-sizing: border-box; }
.ndr-root { position: relative; width: 100%; overflow: hidden; }

.ndr-content { position: absolute; inset: 0; width: 100%; height: 100%; }

.ndr-root canvas {
  position: absolute; inset: 0; width: 100%; height: 100%;
  max-width: none; display: block; pointer-events: none; z-index: 10;
}

.ndr-veil {
  position: absolute; inset: 0; z-index: 10;
  background: var(--ndr-color); pointer-events: none;
  transition: opacity 0.7s ease;
}
.ndr-veil[data-gone="true"] { opacity: 0; }
`

function getTitleMetrics(clientWidth: number) {
  // Mobile (<640): ~48px (matches text-5xl)
  // Tablet (640-1024): ~72px (matches text-7xl)
  // Desktop (>=1024): 96px (matches text-8xl)
  let titleCssSize = 96
  if (clientWidth < 640) {
    titleCssSize = Math.max(Math.min(clientWidth * 0.12, 54), 44)
  } else if (clientWidth < 1024) {
    titleCssSize = Math.max(Math.min(clientWidth * 0.085, 76), 64)
  } else {
    titleCssSize = 96
  }

  const subCssSize = clientWidth < 640 ? 12 : 14
  return { titleCssSize, subCssSize }
}

function renderTextToCanvas(
  c2d: HTMLCanvasElement,
  width: number,
  height: number,
  dpr: number,
  title: string,
  subtitle?: string,
  backgroundColor = "#0C0C0C"
) {
  c2d.width = width
  c2d.height = height
  const ctx = c2d.getContext("2d")
  if (!ctx) return

  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, width, height)

  const clientWidth = width / Math.max(dpr, 1)
  const { titleCssSize, subCssSize } = getTitleMetrics(clientWidth)

  // Scale up to physical canvas pixels for high-DPI displays
  const titlePhysSize = titleCssSize * dpr
  const subPhysSize = subCssSize * dpr

  ctx.font = `900 ${Math.round(titlePhysSize)}px Kanit, "Helvetica Neue", Arial, sans-serif`
  ctx.fillStyle = "#FFFFFF"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  const centerY = height * 0.48
  ctx.fillText(title, width / 2, centerY)

  if (subtitle) {
    ctx.font = `600 ${Math.round(subPhysSize)}px ui-monospace, SFMono-Regular, Menlo, monospace`
    ctx.fillStyle = "rgba(215, 226, 234, 0.75)"

    const spaced = subtitle.split("").join(" ")
    ctx.fillText(spaced, width / 2, centerY + titlePhysSize * 0.65)
  }
}

export default function NoiseDissolveReveal({
  children,
  veilColor = "#0C0C0C",
  edgeColor = "#D7E2EA",
  veilTitle,
  veilSubtitle,
  durationMs = 1400,
  delayMs = 700,
  loop = false,
  holdMs = 900,
  noiseScale = 5.0,
  softness = 0.025,
  centerBias = 0.35,
  height = "100svh",
  onReveal,
  className = "",
}: NoiseDissolveRevealProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const [glReady, setGlReady] = React.useState(false)

  const onRevealRef = React.useRef(onReveal)
  onRevealRef.current = onReveal
  const cfg = React.useRef({
    veilColor,
    edgeColor,
    veilTitle,
    veilSubtitle,
    durationMs,
    delayMs,
    loop,
    holdMs,
    noiseScale,
    softness,
    centerBias,
  })
  cfg.current = {
    veilColor,
    edgeColor,
    veilTitle,
    veilSubtitle,
    durationMs,
    delayMs,
    loop,
    holdMs,
    noiseScale,
    softness,
    centerBias,
  }

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    })
    if (!gl) {
      console.warn("WebGL2 not available; using CSS fallback")
      return
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)
      if (!s) return null
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(s))
        gl.deleteShader(s)
        return null
      }
      return s
    }

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SRC)
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC)
    const prog = gl.createProgram()
    if (!vs || !fs || !prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog))
      return
    }
    setGlReady(true)

    const posAttr = gl.getAttribLocation(prog, "a_position")
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const u = (n: string) => gl.getUniformLocation(prog, n)
    const loc = {
      res: u("u_resolution"),
      time: u("u_time"),
      color: u("u_color"),
      edgeColor: u("u_edgeColor"),
      progress: u("u_progress"),
      scale: u("u_scale"),
      soft: u("u_soft"),
      bias: u("u_bias"),
      seed: u("u_seed"),
      hasText: u("u_hasText"),
      textTexture: u("u_textTexture"),
    }

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const textCanvas = document.createElement("canvas")
    const textTex = gl.createTexture()

    let destroyed = false

    const updateTexture = () => {
      if (destroyed || !canvas || !cfg.current.veilTitle || !textTex) return
      const w = Math.max(1, canvas.width)
      const h = Math.max(1, canvas.height)

      renderTextToCanvas(
        textCanvas,
        w,
        h,
        dpr,
        cfg.current.veilTitle,
        cfg.current.veilSubtitle,
        cfg.current.veilColor,
      )

      gl.bindTexture(gl.TEXTURE_2D, textTex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        if (cfg.current.veilTitle) updateTexture()
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        if (!destroyed && cfg.current.veilTitle) updateTexture()
      })
    }

    const seed = Math.random() * 100
    const start = Date.now()
    let raf = 0
    let fired = false

    const render = () => {
      if (destroyed) return
      const c = cfg.current
      const now = Date.now()
      const elapsed = now - start - c.delayMs

      let progress: number
      if (elapsed <= 0) {
        progress = 0
      } else if (c.loop) {
        progress = loopPhase(elapsed, c.durationMs, c.holdMs).progress
      } else {
        progress = tearEase(elapsed / Math.max(c.durationMs, 1))
      }

      if (!fired && progress >= 1) {
        fired = true
        onRevealRef.current?.()
      }

      const [r, g, bl] = parseHex(c.veilColor)
      const [er, eg, eb] = parseHex(c.edgeColor || "#D7E2EA")

      gl.useProgram(prog)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.enableVertexAttribArray(posAttr)
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0)

      gl.uniform2f(loc.res, canvas.width, canvas.height)
      gl.uniform1f(loc.time, (now - start) * 0.001)
      gl.uniform3f(loc.color, r, g, bl)
      gl.uniform3f(loc.edgeColor, er, eg, eb)
      gl.uniform1f(loc.progress, progress)
      gl.uniform1f(loc.scale, c.noiseScale)
      gl.uniform1f(loc.soft, Math.max(c.softness, 0.001))
      gl.uniform1f(loc.bias, c.centerBias)
      gl.uniform1f(loc.seed, seed)

      if (c.veilTitle && textTex) {
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, textTex)
        gl.uniform1i(loc.hasText, 1)
        gl.uniform1i(loc.textTexture, 0)
      } else {
        gl.uniform1i(loc.hasText, 0)
      }

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      if (!c.loop && progress >= 1) return
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      destroyed = true
      setGlReady(false)
      cancelAnimationFrame(raf)
      ro.disconnect()
      if (textTex) gl.deleteTexture(textTex)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
    }
  }, [])

  // Graceful fallback for non-WebGL environments
  const [fallbackDone, setFallbackDone] = React.useState(false)
  React.useEffect(() => {
    if (glReady) return
    const c = cfg.current
    const t1 = setTimeout(() => {
      setFallbackDone(true)
    }, c.delayMs)
    const t2 = setTimeout(() => {
      onRevealRef.current?.()
    }, c.delayMs + 750)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [glReady])

  return (
    <div
      className={"ndr-root " + className}
      style={{ height, ["--ndr-color" as string]: veilColor }}
    >
      <style>{NDR_CSS}</style>

      {children && <div className="ndr-content">{children}</div>}

      <canvas ref={canvasRef} aria-hidden="true" />

      {/* Stands in before shader is ready or if WebGL2 is completely unavailable */}
      {!glReady && (
        <div
          className="ndr-veil"
          data-gone={fallbackDone}
          aria-hidden="true"
        >
          {veilTitle && (
            <div
              className="flex flex-col items-center justify-center h-full w-full px-6 text-center select-none"
              style={{ transform: "translateY(-2%)" }}
            >
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white font-kanit leading-none">
                {veilTitle}
              </h1>
              {veilSubtitle && (
                <p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.3em] text-[#D7E2EA]/75 font-mono">
                  {veilSubtitle}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
