import config from '../config';
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

    const link = document.createElement('a') as HTMLAnchorElement;
    link.href = this.props.url;
    link.target = '_blank';
    link.rel = 'noreferrer';

    config.gameContainer.appendChild(link);
    link.click();
    setTimeout(() => link.remove(), 0);
  }
}

export default LinkButtonComponent;
