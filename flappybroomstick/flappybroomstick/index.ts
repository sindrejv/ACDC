import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import App, { CrmParams } from "./App";
import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import { Explosion } from "./components/Explosion";

export class flappybroomstick
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  /**
   * Empty constructor.
   */
  constructor() {}
  private _context: ComponentFramework.Context<IInputs>;
  private _container: HTMLDivElement;
  private _notifyOutputChanged: () => void;
  private _root: Root;
  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    // Add control initialization code
    this._notifyOutputChanged = notifyOutputChanged;
    this._container = container;
    this._context = context;
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    const crmProps: CrmParams = { context };
    const element = createElement(App, crmProps);
    if (!this._root) {
      this._root = createRoot(this._container);
    }
    this._root.render(element);
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
   */
  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}

// Add styles to the document head
const style = document.createElement("style");
style.textContent = `
  @keyframes magicParticle {
    0% {
      transform: scale(0.3) translate(0, 0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: scale(var(--scale)) translate(var(--x), var(--y)) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes magicFade {
    0% {
      transform: scale(0.2);
      opacity: 1;
    }
    100% {
      transform: scale(3);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
