export const processData = (data) => {
  const nodes = [];
  const edges = [];
  const processedIds = new Set();

  // Helper function to get children
  const getChildren = (personId) => {
    return data.filter(p => 
      p.rels.father === personId || p.rels.mother === personId
    ).map(p => p.id);
  };

  // Helper function to get all descendants
  const getAllDescendants = (personId) => {
    const descendants = new Set();
    const queue = [personId];
    
    while (queue.length > 0) {
      const currentId = queue.shift();
      const children = getChildren(currentId);
      children.forEach(childId => {
        descendants.add(childId);
        queue.push(childId);
      });
    }
    
    return Array.from(descendants);
  };

  // Helper function to process a person
  const processPerson = (person, level = 0, position = { x: 0, y: 0 }, isRoot = false) => {
    if (processedIds.has(person.id)) return;
    processedIds.add(person.id);

    // Get all descendants to properly hide them
    const descendants = getAllDescendants(person.id);
    const spouses = person.rels.spouses || [];

    // Create node
    const node = {
      id: person.id,
      type: 'custom',
      position,
      hidden: !isRoot, // Only root node is visible initially
      data: {
        name: `${person.data['first name']} ${person.data['last name']}`,
        gender: person.data.gender,
        location: person.data.location || '',
        birthYear: person.data['birth year'] || '',
        avatar: person.data.avatar || '',
        expanded: false,
        hasChildren: getChildren(person.id).length > 0,
        hasSpouses: spouses.length > 0,
        parentId: person.rels.father || person.rels.mother || null,
        isRoot: isRoot,
        descendants: descendants,
        spouses: spouses
      },
    };
    nodes.push(node);

    // Add parent-child edges
    if (person.rels.father) {
      edges.push({
        id: `${person.rels.father}-${person.id}`,
        source: person.rels.father,
        target: person.id,
        type: 'smoothstep',
        hidden: !isRoot,
        animated: false,
        style: { stroke: '#90CAF9', strokeWidth: 2 }
      });
    }
    if (person.rels.mother) {
      edges.push({
        id: `${person.rels.mother}-${person.id}`,
        source: person.rels.mother,
        target: person.id,
        type: 'smoothstep',
        hidden: !isRoot,
        animated: false,
        style: { stroke: '#F48FB1', strokeWidth: 2 }
      });
    }

    // Add spouse edges
    spouses.forEach(spouseId => {
      if (person.id < spouseId) {  // Avoid duplicate edges
        edges.push({
          id: `${person.id}-${spouseId}`,
          source: person.id,
          target: spouseId,
          type: 'straight',
          hidden: !isRoot,
          animated: true,
          style: { stroke: '#666', strokeWidth: 1, strokeDasharray: '5,5' }
        });
      }
    });

    // Process children (but keep them hidden initially)
    const children = getChildren(person.id);
    children.forEach((childId, index) => {
      const childPerson = data.find(p => p.id === childId);
      if (childPerson) {
        const childPosition = {
          x: position.x + (index - children.length / 2) * 300,
          y: position.y + 200,
        };
        processPerson(childPerson, level + 1, childPosition, false);
      }
    });

    // Process spouses (but keep them hidden initially)
    spouses.forEach(spouseId => {
      const spouse = data.find(p => p.id === spouseId);
      if (spouse && !processedIds.has(spouseId)) {
        const spousePosition = {
          x: position.x + 250,
          y: position.y,
        };
        processPerson(spouse, level, spousePosition, false);
      }
    });
  };

  // Start processing from the root person (Fareed Siddiqui)
  const rootPerson = data.find(p => p.id === 'fareed-siddiqui-1');
  if (rootPerson) {
    processPerson(rootPerson, 0, { x: 0, y: 0 }, true);
  }

  return { nodes, edges };
}; 