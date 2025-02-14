async function fetchData() {
    const response = await fetch('data-siddiqui-family.json');
    return await response.json();
}

async function createFamilyTree() {
    const data = await fetchData();

 const f3Chart = f3.createChart('#FamilyChart', data)
        .setTransitionTime(702)
        .setCardXSpacing(250)
        .setCardYSpacing(110)
        .setOrientationHorizontal()
        .setSingleParentEmptyCard(true, {label: 'ADD'})
    
      const f3Card = f3Chart.setCard(f3.CardHtml)
        .setCardDisplay([["first name","last name"],["birthday"]])
        .setCardDim({"width":195})
        .setMiniTree(true)
        .setStyle('imageRect')
        .setOnHoverPathToMain()

      f3Chart.updateTree({initial: true})
}

// Initialize the family tree
createFamilyTree();
