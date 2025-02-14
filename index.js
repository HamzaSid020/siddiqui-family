async function fetchData() {
    const response = await fetch('data-siddiqui-family.json');
    return await response.json();
}

async function createFamilyTree() {
    const data = await fetchData();

   function create(data) {
      const f3Chart = f3.createChart('#FamilyChart', data)
        .setTransitionTime(702)
        .setCardXSpacing(250)
        .setCardYSpacing(110)
        .setOrientationHorizontal()
        .setSingleParentEmptyCard(true, {label: 'N/A'})
    
      const f3Card = f3Chart.setCard(f3.CardHtml)
        .setCardDisplay([["first name","last name"],["birthday"]])
        .setCardDim({"width":195,"img_width":65,"img_height":65})
        .setMiniTree(true)
        .setStyle('imageRect')
        .setOnHoverPathToMain()

      f3Chart.updateTree({initial: true})
}

// Initialize the family tree
createFamilyTree();
