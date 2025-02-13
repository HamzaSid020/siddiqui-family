async function fetchData() {
  const response = await fetch('data-siddiqui-family.json');
  return await response.json();
}

async function createFamilyTree() {
  const data = await fetchData();

  const f3Chart = f3.createChart('#FamilyChart', data)
    .setTransitionTime(1000)
    .setCardXSpacing(250)
    .setCardYSpacing(150)
    .setOrientationVertical()
    .setSingleParentEmptyCard(true, { label: 'ADD' });

  const f3Card = f3Chart.setCard(f3.CardHtml)
    .setCardDisplay([["first name", "last name"], ["birthday"]])
    .setCardDim({})
    .setMiniTree(true)
    .setStyle('imageCircle')
    .setOnHoverPathToMain();

  // Remove edit functionality
  const f3EditTree = f3Chart.editTree()
    .fixed(true)
    .setFields(["first name", "last name", "birthday", "avatar"])
    .setEditFirst(true);

  f3EditTree.setEdit();

  // Prevent opening the side menu when clicking a card
  f3Card.setOnCardClick((e, d) => {
    console.log("Card clicked: ", d);
    // Do nothing when a card is clicked
  });

  f3Chart.updateTree({ initial: true });
}

// Initialize the family tree
createFamilyTree();
