import type { Movement, PhysicalEntity, Target } from './types';
export declare const initPhysicsEngine: () => void;
export declare const updatePhysics: (interval: number) => void;
export declare const addPhysicalEntity: (entity: PhysicalEntity) => void;
export declare const removePhysicalEntity: (target: Target) => void;
export declare const setMovement: (target: Target, movement: Movement) => void;
export declare const movePhysicalEntity: (target: Target, x: number, y: number) => void;
