export type Cleanup = () => void;

export interface DrawOptions {
  /** Seconds between each stroke starting. Default 0.08. */
  stagger?: number;
  /** Seconds each stroke takes to draw. Default 1.8. */
  duration?: number;
}

export interface RevealOptions {
  /** Split into words (default) or individual characters. */
  split?: 'words' | 'chars';
  /** Seconds between pieces. Default 0.06 for words, 0.025 for chars. */
  stagger?: number;
}

export interface TiltOptions {
  /** Maximum rotation in degrees. Default 6. */
  tilt?: number;
  /** Magnetic drift toward the pointer in px. Default 8. */
  pull?: number;
  /** Smoothing, 0..1 (lower is smoother). Default 0.12. */
  ease?: number;
}

export interface CurtainOptions {
  /** Which way the panel leaves. Default 'up'. */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Open when scrolled into view (default) or on page load. */
  trigger?: 'view' | 'load';
}

export interface EffectOptions {
  glass: void;
  draw: DrawOptions;
  reveal: RevealOptions;
  foil: void;
  spotlight: void;
  tilt: TiltOptions;
  curtain: CurtainOptions;
}

export type EffectName = keyof EffectOptions;

export function glass(el: HTMLElement): Cleanup;
export function draw(el: Element, opts?: DrawOptions): Cleanup;
export function reveal(el: HTMLElement, opts?: RevealOptions): Cleanup;
export function foil(el: HTMLElement): Cleanup;
export function spotlight(el: HTMLElement): Cleanup;
export function tilt(el: HTMLElement, opts?: TiltOptions): Cleanup;
export function curtain(el: HTMLElement, opts?: CurtainOptions): Cleanup;

export const effects: { [K in EffectName]: (el: HTMLElement, opts?: EffectOptions[K]) => Cleanup };

/** Apply one effect to one element. Applying the same effect twice is a no-op. */
export function apply<K extends EffectName>(el: HTMLElement, name: K, opts?: EffectOptions[K]): Cleanup;

/** Apply every effect listed in [data-fx] attributes under `root` (default: document). */
export function init(root?: ParentNode): Cleanup;

/** Remove every effect from an element and, by default, its descendants. */
export function destroy(el: Element, options?: { deep?: boolean }): void;

declare const AtelierFX: { init: typeof init; apply: typeof apply; destroy: typeof destroy; effects: typeof effects };
export default AtelierFX;
