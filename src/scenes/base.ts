import { ContainerComponent } from '../components';

class BaseScene extends ContainerComponent {
  constructor() {
    super({ label: 'Scene' });
  }

  async init() {}
}

export default BaseScene;
