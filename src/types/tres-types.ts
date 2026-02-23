import { Vector3 } from "three";

export type Vector3Tuple = [x: number, y: number, z: number];

export type BoxArgsTuple = [
  width: number,
  height: number,
  depth: number,
  widthSegments?: number,
  heightSegments?: number,
  depthSegments?: number,
];

export type TresVector3Like = Vector3Tuple | Vector3;
