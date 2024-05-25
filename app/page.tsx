"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  DragEvent,
} from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  Connection,
  ReactFlowInstance,
  BackgroundVariant,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/base.css";
import { Sidebar } from "@/components/ReactFlowComponents/sidebar";
import { TextNode } from "@/components/ReactFlowComponents/TextNode";
import BackgroundVariantSelector from "@/components/ReactFlowComponents/BackgroundVariant";
import { useToast } from "@/components/ui/use-toast";

const flowKey = "flow-key";
const initialNodes: Node[] = [
  {
    id: "1",
    type: "textnode",
    data: { label: "test message" },
    position: { x: 0, y: 0 },
  },
];
let id = 0;
const getId = () => `node_${id++}`;

const ReactFlowProviderScreen: React.FC = () => {
  const nodeTypes = useMemo(() => ({ textnode: TextNode }), []);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [selectedElements, setSelectedElements] = useState<Node[]>([]);
  const [nodeName, setNodeName] = useState<string>("");
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>(
    BackgroundVariant.Dots
  );
  const { toast } = useToast();

  useEffect(() => {
    if (selectedElements.length > 0) {
      setNodes((els) =>
        els.map((node) => {
          if (node.id === selectedElements[0]?.id) {
            node.data = { ...node.data, label: nodeName };
          }
          return node;
        })
      );
    } else {
      setNodeName("");
    }
  }, [nodeName, selectedElements, setNodes]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedElements([node]);
      setNodeName(node.data.label as string);
      setNodes((els) =>
        els.map((n) => ({
          ...n,
          selected: n.id === node.id,
        }))
      );
    },
    [setNodes]
  );

  const checkEdgesAndNodes = useCallback(() => {
    let emptyTargetHandlesCount = 0;
    const connectedNodes = new Set();

    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandlesCount++;
      }
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });

    const isNodeUnconnected = nodes.some(
      (node) => !connectedNodes.has(node.id)
    );

    return { emptyTargetHandlesCount, isNodeUnconnected };
  }, [nodes, edges]);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const { emptyTargetHandlesCount, isNodeUnconnected } =
        checkEdgesAndNodes();
      if (
        nodes.length > 1 &&
        (emptyTargetHandlesCount > 1 || isNodeUnconnected)
      ) {
        alert(
          "Error: One Node and more than one Node has empty target handles "
        );
        toast({
          title: "Error!",
          description:
            "One Node and more than one Node has empty target handles",
        });
      } else {
        const flow = reactFlowInstance.toObject();
        localStorage.setItem(flowKey, JSON.stringify(flow));
        alert("Save successful!");
        toast({
          title: "Success!",
          description: "Save successful!",
        });
      }
    }
  }, [reactFlowInstance, nodes, checkEdgesAndNodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !reactFlowBounds) return;

      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }) as { x: number; y: number };

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };
      setNodes((els) => els.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div className="flex min-h-screen">
      <div className="flex-grow h-screen" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={() => {
            setSelectedElements([]);
            setNodes((els) => els.map((n) => ({ ...n, selected: false })));
          }}
          style={{ backgroundColor: "#ffffff" }}
          fitView
        >
          <Background variant={backgroundVariant} gap={12} size={1} />
          <Controls />
          <MiniMap zoomable pannable />
        </ReactFlow>
      </div>
      <Sidebar
        nodeName={nodeName}
        setNodeName={setNodeName}
        selectedNode={selectedElements[0]}
        setSelectedElements={setSelectedElements}
        onSave={onSave}
      />
      <BackgroundVariantSelector
        variant={backgroundVariant}
        setVariant={setBackgroundVariant}
      />
    </div>
  );
};

// export default ReactFlowProviderScreen;
const FlowWithProvider: React.FC = () => (
  <ReactFlowProvider>
    <ReactFlowProviderScreen />
  </ReactFlowProvider>
);

export default FlowWithProvider;
