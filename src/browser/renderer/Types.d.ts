/**
 * Copyright (c) 2019 The xterm.js authors. All rights reserved.
 * @license MIT
 */

import { IDisposable } from 'common/Types';
import { IColorSet } from 'browser/Types';
import { IEvent } from 'common/EventEmitter';

export type CharacterJoinerHandler = (text: string) => [number, number][];

export interface IRenderDimensions {
  scaledCharWidth: number;
  scaledCharHeight: number;
  scaledCellWidth: number;
  scaledCellHeight: number;
  scaledCharLeft: number;
  scaledCharTop: number;
  scaledCanvasWidth: number;
  scaledCanvasHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  actualCellWidth: number;
  actualCellHeight: number;
}

export interface IRequestRedrawEvent {
  start: number;
  end: number;
}

/**
 * Note that IRenderer implementations should emit the refresh event after
 * rendering rows to the screen.
 */
export interface IRenderer extends IDisposable {
  readonly dimensions: IRenderDimensions;

  /**
   * Fires when the renderer is requesting to be redrawn on the next animation
   * frame but is _not_ a result of content changing (eg. selection changes).
   */
  readonly onRequestRedraw: IEvent<IRequestRedrawEvent>;

  dispose(): void;
  setColors(colors: IColorSet): void;
  onDevicePixelRatioChange(): void;
  onResize(cols: number, rows: number): void;
  onCharSizeChanged(): void;
  onBlur(): void;
  onFocus(): void;
  onSelectionChanged(start: [number, number], end: [number, number], columnSelectMode: boolean): void;
  onCursorMove(): void;
  onOptionsChanged(): void;
  clear(): void;
  renderRows(start: number, end: number): void;
  registerCharacterJoiner(handler: CharacterJoinerHandler): number;
  deregisterCharacterJoiner(joinerId: number): boolean;
}

export interface ICharacterJoiner {
  id: number;
  handler: CharacterJoinerHandler;
}

export interface ICharacterJoinerRegistry {
  registerCharacterJoiner(handler: (text: string) => [number, number][]): number;
  deregisterCharacterJoiner(joinerId: number): boolean;
  getJoinedCharacters(row: number): [number, number][];
}

export interface IRenderLayer extends IDisposable {
  /**
   * Called when the terminal loses focus.
   */
  onBlur(): void;

  /**
   * * Called when the terminal gets focus.
   */
  onFocus(): void;

  /**
   * Called when the cursor is moved.
   */
  onCursorMove(): void;

  /**
   * Called when options change.
   */
  onOptionsChanged(): void;

  /**
   * Called when the theme changes.
   */
  setColors(colorSet: IColorSet): void;

  /**
   * Called when the data in the grid has changed (or needs to be rendered
   * again).
   */
  onGridChanged(startRow: number, endRow: number): void;

  /**
   * Calls when the selection changes.
   */
  onSelectionChanged(start: [number, number], end: [number, number], columnSelectMode: boolean): void;

  /**
   * Registers a handler to join characters to render as a group
   */
  registerCharacterJoiner?(joiner: ICharacterJoiner): void;

  /**
   * Deregisters the specified character joiner handler
   */
  deregisterCharacterJoiner?(joinerId: number): void;

  /**
   * Resize the render layer.
   */
  resize(dim: IRenderDimensions): void;

  /**
   * Clear the state of the render layer.
   */
  reset(): void;
}
