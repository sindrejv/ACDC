import { IInputs } from "./generated/ManifestTypes";
import * as React from "react";
export type CrmParams = {
  context: ComponentFramework.Context<IInputs>;
};

export const App: React.FC<CrmParams> = ({ context }) => {
  return <div>Hello World</div>;
};
