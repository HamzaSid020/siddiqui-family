
async function fetchData() {
    const response = await fetch('data-siddiqui-family.json');
    const data = await response.json();
    console.log("Fetched Data:", data);
    return data;
}

async function createFamilyTree() {
    const data = await fetchData();
    async function fetchData() {
        const response = await fetch('data-siddiqui-family.json');
        return await response.json();
    }

    async function createFamilyTree() {
        const data = await fetchData();

        const f3Chart = f3.createChart('#FamilyChart', data)
            .setTransitionTime(2000)
            .setCardXSpacing(250)
            .setCardYSpacing(125)
            .setOrientationVertical()
            .setSingleParentEmptyCard(true, { label: 'ADD' })

        const f3Card = f3Chart.setCard(f3.CardHtml)
            .setCardDisplay([["first name", "last name"], ["birthday"]])
            .setCardDim({ "width": 215, "height": 75, "img_x": 7 })
            .setMiniTree(true)
            .setStyle('imageRect')
            .setOnHoverPathToMain()

        f3Chart.updateTree({ initial: true })
    }

    // Initialize the family tree
    createFamilyTree();
}

// Initialize the family tree
createFamilyTree();
