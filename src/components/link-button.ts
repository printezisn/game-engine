import ButtonComponent from './button';
import type { LinkButtonProps } from './types';

class LinkButtonComponent extends ButtonComponent {
  constructor(props: LinkButtonProps) {
    super(props);
  }

  get props() {
    return super.props as LinkButtonProps;
  }

  protected async _onClick() {
    super._onClick();

    window.location.href = this.props.url;
  }
}

export default LinkButtonComponent;
