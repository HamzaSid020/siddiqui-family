import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Button, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CustomNode from './components/CustomNode';
import Dashboard from './components/Dashboard';
import { processData } from './utils/dataProcessor';
import familyData from './data/data-siddiqui-family.json';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
    },
    primary: {
      main: '#90CAF9',
    },
    secondary: {
      main: '#F48FB1',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        },
      },
    },
  },
});

// Custom node types
const nodeTypes = {
  custom: CustomNode,
};

const flowStyles = {
  background: '#1a1a1a',
  width: '100%',
  height: '100vh',
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [view, setView] = useState('tree'); // 'tree' or 'dashboard'

  // Process data and initialize flow
  React.useEffect(() => {
    const { nodes: processedNodes, edges: processedEdges } = processData(familyData);
    setNodes(processedNodes);
    setEdges(processedEdges);
  }, []);

  // Handle node expansion/collapse
  const onNodeClick = useCallback((event, node) => {
    // Toggle expanded state of clicked node
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          // Toggle expanded state
          const newExpanded = !n.data.expanded;
          
          // Get immediate children and spouses
          const immediateConnections = [
            ...n.data.descendants.slice(0, getImmediateChildrenCount(n.id, nds)),
            ...n.data.spouses
          ];
          
          return {
            ...n,
            data: {
              ...n.data,
              expanded: newExpanded,
            },
          };
        }
        return n;
      })
    );

    // Show/hide connected nodes and edges
    setNodes((nds) =>
      nds.map((n) => {
        const isDirectChild = n.data.parentId === node.id;
        const isSpouse = node.data.spouses.includes(n.id);
        
        if (isDirectChild || isSpouse) {
          return {
            ...n,
            hidden: !n.hidden,
          };
        }
        return n;
      })
    );

    // Update edges visibility
    setEdges((eds) =>
      eds.map((e) => {
        const isConnectedToNode = e.source === node.id || e.target === node.id;
        if (isConnectedToNode) {
          return {
            ...e,
            hidden: !e.hidden,
          };
        }
        return e;
      })
    );
  }, []);

  // Helper function to get immediate children count
  const getImmediateChildrenCount = (nodeId, nodes) => {
    return nodes.filter(n => n.data.parentId === nodeId).length;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '100vw', height: '100vh', bgcolor: 'background.default' }}>
        {view === 'tree' ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            style={flowStyles}
          >
            <Background color="#333333" gap={16} />
            <Controls 
              style={{
                button: { backgroundColor: '#2d2d2d', color: '#ffffff', border: 'none' },
                path: { fill: '#ffffff' }
              }}
            />
            <MiniMap
              style={{
                backgroundColor: '#2d2d2d',
                maskColor: '#000000'
              }}
              nodeColor={(node) => {
                return node.data.gender === 'M' ? '#90CAF9' : '#F48FB1';
              }}
            />
            <Panel position="top-right">
              <IconButton 
                onClick={() => setView('dashboard')}
                sx={{ 
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper', opacity: 0.8 }
                }}
              >
                <DashboardIcon />
              </IconButton>
            </Panel>
          </ReactFlow>
        ) : (
          <Box sx={{ height: '100%', overflow: 'auto' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
              <IconButton 
                onClick={() => setView('tree')}
                sx={{ 
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper', opacity: 0.8 }
                }}
              >
                <AccountTreeIcon />
              </IconButton>
            </Box>
            <Dashboard familyData={familyData} />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App; 