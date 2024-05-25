import React, { ChangeEvent, DragEvent, FC } from "react";

interface SidebarProps {
  nodeName: string;
  setNodeName: (name: string) => void;
  selectedNode: any;
  setSelectedElements: (elements: any[]) => void;
  onSave: () => void;
}

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
          <h3 className="text-xl mb-4 text-black pt-3">Nodes Panel</h3>
          <div
            className="p-3 border rounded cursor-move flex justify-center items-center text-white bg-black"
            onDragStart={(event) => onDragStart(event, "textnode")}
            draggable
          >
            Message Node
          </div>
        </div>
      )}
    </aside>
  );
};

export { Sidebar };
