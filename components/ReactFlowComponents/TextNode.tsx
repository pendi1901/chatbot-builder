import React, { FC } from "react";
import { Handle, Position } from "reactflow";
// interface for the props that the TextNode component will receive
interface TextNodeProps {
  data: {
    label?: string;
  };
  selected: boolean;
}
//  TextNode functional component
const TextNode: FC<TextNodeProps> = ({ data: { label }, selected }) => {
  return (
    <div
      className={`w-40 shadow rounded bg-white ${
        selected ? "border-2 border-orange-600" : ""
      }`}
    >
      <div className="flex flex-col">
        <div className="px-2 py-1 text-xs font-bold bg-pink-400 rounded-t">
          Send Message
        </div>
        <div className="px-3 py-2">
          <div className="text-xs">{label ?? "Text Node"}</div>
        </div>
      </div>
      {/* Handle for connecting edges to the node as a target */}
      <Handle
        id="a"
        type="target"
        position={Position.Left}
        className="w-1 bg-gray"
      />
      {/* Handle for connecting edges from the node as a source */}
      <Handle
        id="b"
        type="source"
        position={Position.Right}
        className="w-1 bg-gray"
      />
    </div>
  );
};

export { TextNode };
