import * as React from "react";
import collection from "easter-egg-collection";

export const App: React.FC = () => {
  React.useEffect(() => {
    // Initialize all easter eggs
    collection.konami();

    collection.nyancat();
    collection.mario();
    collection.github();
    collection.reddit();
    collection.google();
    collection.greenknight();
    collection.easteregg();

    // Cleanup function to remove listeners when component unmounts
    return () => {
      collection.destroy();
    };
  }, []); // Empty dependency array means this runs once on mount

  return <></>;
};
