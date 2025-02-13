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
        .setSingleParentEmptyCard(true, { label: 'ADD' })

    const f3Card = f3Chart.setCard(f3.CardHtml)
        .setCardDisplay([["first name", "last name"], ["birthday"]])
        .setCardDim({})
        .setMiniTree(true)
        .setStyle('imageCircle')
        .setOnHoverPathToMain()


    const f3EditTree = f3Chart.editTree()
        .fixed(true)
        .setFields(["first name", "last name", "birthday", "avatar"])
        .setEditFirst(false)

    f3EditTree.setEdit()

    f3Card.setOnCardClick((e, d) => {
        f3EditTree.open(d)
        if (f3EditTree.isAddingRelative()) return
        f3Card.onCardClickDefault(e, d)
    });

    f3Chart.updateTree({ initial: true })
    f3EditTree.open(f3Chart.getMainDatum())

    f3Chart.updateTree({ initial: true })
}

// Initialize the family tree
createFamilyTree();
