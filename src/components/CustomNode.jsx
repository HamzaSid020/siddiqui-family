import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const NodeCard = styled(Card)(({ theme, gender }) => ({
  minWidth: 200,
  backgroundColor: gender === 'M' ? 'rgba(144, 202, 249, 0.15)' : 'rgba(244, 143, 177, 0.15)',
  borderColor: gender === 'M' ? '#90CAF9' : '#F48FB1',
  borderWidth: 2,
  borderStyle: 'solid',
  backdropFilter: 'blur(8px)',
  '&:hover': {
    boxShadow: `0 0 15px ${gender === 'M' ? '#90CAF9' : '#F48FB1'}`,
    transform: 'translateY(-2px)',
    transition: 'all 0.2s ease-in-out',
  },
}));

const CustomNode = ({ data }) => {
  const {
    name,
    gender,
    location,
    birthYear,
    avatar,
    expanded,
    hasChildren,
    hasSpouses
  } = data;

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Top}
        style={{ background: gender === 'M' ? '#90CAF9' : '#F48FB1' }}
      />
      <NodeCard gender={gender}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            {avatar && (
              <Avatar
                src={avatar}
                alt={name}
                sx={{
                  width: 40,
                  height: 40,
                  border: 2,
                  borderColor: gender === 'M' ? 'primary.main' : 'secondary.main',
                  boxShadow: theme => `0 0 10px ${gender === 'M' ? theme.palette.primary.main : theme.palette.secondary.main}`,
                }}
              />
            )}
            <Box>
              <Typography 
                variant="subtitle1" 
                component="div" 
                fontWeight="bold"
                color="text.primary"
              >
                {name} {(hasChildren || hasSpouses) && (expanded ? ' ⊖' : ' ⊕')}
              </Typography>
              {location && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ opacity: 0.8 }}
                >
                  {location}
                </Typography>
              )}
              {birthYear && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ opacity: 0.8 }}
                >
                  Born: {birthYear}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </NodeCard>
      <Handle 
        type="source" 
        position={Position.Bottom}
        style={{ background: gender === 'M' ? '#90CAF9' : '#F48FB1' }}
      />
    </>
  );
};

export default memo(CustomNode); 