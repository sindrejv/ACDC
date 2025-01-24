/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    sampleProperty: ComponentFramework.PropertyTypes.StringProperty;
    entityId: ComponentFramework.PropertyTypes.StringProperty;
    stage: ComponentFramework.PropertyTypes.OptionSetProperty;
}
export interface IOutputs {
    sampleProperty?: string;
    entityId?: string;
    stage?: number;
}
