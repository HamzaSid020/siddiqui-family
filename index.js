async function fetchData() {
    try {
        const response = await fetch('data-siddiqui-family.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Data:", data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function createFamilyTree() {
    try {
        const data = await fetchData();
        
        const f3Chart = f3.createChart('#FamilyChart', data)
            .setTransitionTime(2000)
            .setCardXSpacing(300)
            .setCardYSpacing(125)
            .setOrientationVertical()
            .setSingleParentEmptyCard(true, { label: 'ADD' });

        f3Chart.setCard(f3.CardHtml)
            .setCardDisplay([["first name","last name"],["birth year","death year"],["occupation"]])
            .setCardDim({ "width": 250, "height": 75, "img_x": 5 })
            .setMiniTree(true)
            .setStyle('imageRect')
            .setOnHoverPathToMain();

        f3Chart.updateTree({ initial: true });
    } catch (error) {
        console.error('Error creating family tree:', error);
    }
}

// Initialize the family tree
createFamilyTree();