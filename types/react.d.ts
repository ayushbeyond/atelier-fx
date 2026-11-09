import type { ElementType, ComponentPropsWithRef, ReactElement, RefObject } from 'react';
import type { EffectName, EffectOptions } from './index';

type FxList = EffectName | `${EffectName} ${string}` | EffectName[];

/** Attach one or more effects to the element the returned ref points at. */
export function useFX<T extends HTMLElement = HTMLElement>(
  fx: FxList,
  options?: EffectOptions[EffectName]
): RefObject<T>;

export type FXProps<C extends ElementType = 'div'> = {
  as?: C;
  fx: FxList;
  options?: EffectOptions[EffectName];
} & Omit<ComponentPropsWithRef<C>, 'as' | 'fx' | 'options'>;

export function FX<C extends ElementType = 'div'>(props: FXProps<C>): ReactElement | null;
