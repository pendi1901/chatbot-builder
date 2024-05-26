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

// Initial set of nodes
const initialNodes: Node[] = [
  {
    id: "1",
    type: "textnode",
    data: { label: "test message" },
    position: { x: 0, y: 0 },
  },
];
let id = 0; // Unique ID generator for new nodes
const getId = () => `node_${id++}`; // Function to generate a new node ID

const ReactFlowProviderScreen: React.FC = () => {
  // Memoized node types
  const nodeTypes = useMemo(() => ({ textnode: TextNode }), []);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null); // Reference to the ReactFlow wrapper div
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes); // State for nodes
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]); // State for edges
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null); // ReactFlow instance state
  const [selectedElements, setSelectedElements] = useState<Node[]>([]); // State for selected nodes
  const [nodeName, setNodeName] = useState<string>(""); // State for node name
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>(
    BackgroundVariant.Dots
  ); // State for background variant
  const { toast } = useToast(); // Toast notification hook

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

  // Callback for node click event
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

  // Function to check edges and nodes for errors
  const checkEdgesAndNodes = useCallback(() => {
    let emptyTargetHandlesCount = 0;
    const connectedNodes = new Set();
    const sourceNodes = new Set();
    let hasMultipleEdges = false;

    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandlesCount++;
      }
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);

      if (sourceNodes.has(edge.source)) {
        hasMultipleEdges = true;
      } else {
        sourceNodes.add(edge.source);
      }
    });

    const isNodeUnconnected = nodes.some(
      (node) => !connectedNodes.has(node.id)
    );

    // Count the number of nodes that don't appear as a target in any edge
    let emptyTargetNodesCount = 0;
    nodes.forEach((node) => {
      const isTarget = edges.some((edge) => edge.target === node.id);
      if (!isTarget) {
        emptyTargetNodesCount++;
      }
    });

    return {
      emptyTargetHandlesCount,
      isNodeUnconnected,
      hasMultipleEdges,
      emptyTargetNodesCount,
    };
  }, [nodes, edges]);

  // Callback for saving the flow
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const { isNodeUnconnected, hasMultipleEdges, emptyTargetNodesCount } =
        checkEdgesAndNodes();
      let errorMessage = "";

      if (nodes.length > 1) {
        if (hasMultipleEdges) {
          errorMessage +=
            "More than one edge is originating from a source node. ";
        }
        console.log("emptyTargetNodesCount", emptyTargetNodesCount);
        if (emptyTargetNodesCount > 1) {
          errorMessage += "More than one target node is empty. ";
        }
        if (isNodeUnconnected) {
          errorMessage += "There is a node that is not connected. ";
        }
      }
      if (errorMessage) {
        alert(`Error: ${errorMessage}`);
        toast({
          title: "Error!",
          description: errorMessage,
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

  // Callback for connecting nodes
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Callback for handling drag over event
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Callback for handling drop event
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
        {/* Main comp */}
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
      {/* Sidebar comp */}
      <Sidebar
        nodeName={nodeName}
        setNodeName={setNodeName}
        selectedNode={selectedElements[0]}
        setSelectedElements={setSelectedElements}
        onSave={onSave}
      />
      {/* <BackgroundVariantSelector
        variant={backgroundVariant}
        setVariant={setBackgroundVariant}
      /> */}
    </div>
  );
};

export default ReactFlowProviderScreen;
