import React, { FC } from "react";
import { Handle, Position } from "reactflow";

interface TextNodeProps {
  data: {
    label?: string;
  };
  selected: boolean;
}

const TextNode: FC<TextNodeProps> = ({ data: { label }, selected }) => {
  return (
    <div
      className={`w-40 shadow rounded bg-white ${
        selected ? "border-2 border-orange-500" : ""
      }`}
    >
      <div className="flex flex-col">
        <div className="px-2 py-1 text-xs font-bold bg-pink-500 rounded-t">
          Send Message
        </div>
        <div className="px-3 py-2">
          <div className="text-xs">{label ?? "Text Node"}</div>
        </div>
      </div>
      <Handle
        id="a"
        type="target"
        position={Position.Left}
        className="w-1 bg-gray-500 rounded-full"
      />
      <Handle
        id="b"
        type="source"
        position={Position.Right}
        className="w-1 bg-gray-500 rounded-full"
      />
    </div>
  );
};

export { TextNode };
