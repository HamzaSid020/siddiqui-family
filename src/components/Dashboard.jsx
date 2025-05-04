import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, Grid, Typography, Box } from '@mui/material';
import FamilyMap from './FamilyMap';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = ({ familyData }) => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    maleCount: 0,
    femaleCount: 0,
    marriedCount: 0,
    locations: {},
    generations: {}
  });

  useEffect(() => {
    if (familyData) {
      const newStats = {
        totalMembers: familyData.length,
        maleCount: 0,
        femaleCount: 0,
        marriedCount: 0,
        locations: {},
        generations: {}
      };

      familyData.forEach(member => {
        // Gender count
        if (member.data.gender === 'M') newStats.maleCount++;
        if (member.data.gender === 'F') newStats.femaleCount++;

        // Marriage count
        if (member.rels.spouses.length > 0) newStats.marriedCount++;

        // Location analysis
        if (member.data.location) {
          const location = member.data.location.split(',')[0].trim();
          newStats.locations[location] = (newStats.locations[location] || 0) + 1;
        }

        // Generation analysis (based on number of ancestors)
        const generation = calculateGeneration(member, familyData);
        newStats.generations[generation] = (newStats.generations[generation] || 0) + 1;
      });

      setStats(newStats);
    }
  }, [familyData]);

  const calculateGeneration = (member, allMembers) => {
    let generation = 1;
    let currentMember = member;
    
    while (currentMember.rels.father || currentMember.rels.mother) {
      const father = allMembers.find(m => m.id === currentMember.rels.father);
      const mother = allMembers.find(m => m.id === currentMember.rels.mother);
      
      if (father) {
        currentMember = father;
        generation++;
      } else if (mother) {
        currentMember = mother;
        generation++;
      } else {
        break;
      }
    }
    
    return generation;
  };

  const genderData = [
    { name: 'Male', value: stats.maleCount },
    { name: 'Female', value: stats.femaleCount }
  ];

  const locationData = Object.entries(stats.locations)
    .map(([location, count]) => ({ name: location, value: count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const generationData = Object.entries(stats.generations)
    .map(([generation, count]) => ({ name: `Gen ${generation}`, value: count }))
    .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Family Tree Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Members</Typography>
            <Typography variant="h4">{stats.totalMembers}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Married Members</Typography>
            <Typography variant="h4">{stats.marriedCount}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Male Members</Typography>
            <Typography variant="h4">{stats.maleCount}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Female Members</Typography>
            <Typography variant="h4">{stats.femaleCount}</Typography>
          </Card>
        </Grid>

        {/* Gender Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Gender Distribution</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Location Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Top 5 Locations</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Members" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Family Map */}
        <Grid item xs={12}>
          <FamilyMap familyData={familyData} />
        </Grid>

        {/* Generation Analysis */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Generation Distribution</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={generationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Members per Generation" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 