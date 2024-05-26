import React, { ChangeEvent, DragEvent, FC } from "react";
import { nodeTypes } from "@/components/ReactFlowComponents/NodeTypes"; // Import the node types

// props that the Sidebar component will receive
interface SidebarProps {
  nodeName: string;
  setNodeName: (name: string) => void;
  selectedNode: any;
  setSelectedElements: (elements: any[]) => void;
  onSave: () => void;
}

// Sidebar functional component
const Sidebar: FC<SidebarProps> = ({
  nodeName,
  setNodeName,
  selectedNode,
  setSelectedElements,
  onSave,
}) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNodeName(event.target.value);
  };

  // // Handle the drag start event for nodes
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="border-r p-4 bg-slate-100 w-64 h-screen">
      {selectedNode ? (
        <div>
          <h3 className="text-xl mb-2 ">Update Node</h3>
          <label className="block mb-2 text-sm font-medium ">Node Name:</label>
          <input
            type="text"
            className="block w-full p-2 border rounded"
            value={nodeName}
            onChange={handleInputChange}
          />
          <button
            className="mt-4 bg-black text-white rounded p-2"
            onClick={() => setSelectedElements([])}
          >
            Go Back
          </button>
        </div>
      ) : (
        <div>
          <button
            className="mt-4 bg-black text-white py-2 px-4 rounded"
            onClick={onSave}
          >
            Save Flow
          </button>
          {/* Extensible dynamic list of draggable nodes */}
          <h3 className="text-xl mb-4 text-black pt-3">Nodes Panel</h3>
          {nodeTypes.map((node) => (
            <div
              key={node.id}
              className="p-3 border rounded cursor-move flex justify-center items-center text-white bg-black mb-2"
              onDragStart={(event) => onDragStart(event, node.type)}
              draggable
            >
              {node.name}
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export { Sidebar };
