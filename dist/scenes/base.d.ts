import { ContainerComponent } from '../components';
declare class BaseScene extends ContainerComponent {
    constructor();
    init(): Promise<void>;
}
export default BaseScene;
