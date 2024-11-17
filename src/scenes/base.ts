import { ContainerComponent } from '../components';

class BaseScene extends ContainerComponent {
  constructor(label = 'Scene') {
    super({ label });
  }

  async init() {}
}

export default BaseScene;
