import React, { FC } from "react";
import { BackgroundVariant } from "reactflow";

interface BackgroundVariantSelectorProps {
  variant: BackgroundVariant;
  setVariant: (variant: BackgroundVariant) => void;
}

const BackgroundVariantSelector: FC<BackgroundVariantSelectorProps> = ({
  variant,
  setVariant,
}) => {
  return (
    <div className="p-2">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Background Variant
      </label>
      <select
        className="block w-full p-2 border rounded"
        value={variant}
        onChange={(e) => setVariant(e.target.value as BackgroundVariant)}
      >
        <option value={BackgroundVariant.Lines}>Lines</option>
        <option value={BackgroundVariant.Dots}>Dots</option>
        <option value={BackgroundVariant.Cross}>Cross</option>
      </select>
    </div>
  );
};

export default BackgroundVariantSelector;
