import type { BaseProps } from './types';

export const basePropsToConfig = (props: BaseProps) => ({
  label: props.label,
  position: props.position,
  anchor: props.anchor,
  scale: props.scale,
  rotation: props.rotation,
  width: props.width,
  height: props.height,
  alpha: props.alpha,
  interactive: props.interactive,
  cursor: props.cursor,
  visible: props.visible,
  tint: props.tint,
  zIndex: props.zIndex,
});
