import config from '../config';
import { fireSignal } from '../signals';
import ButtonComponent from './button';

class CreditsButtonComponent extends ButtonComponent {
  protected async _onClick() {
    super._onClick();

    fireSignal(config.signals.showCredits);
  }
}

export default CreditsButtonComponent;
