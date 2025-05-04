let chart = null;

// Function to process the data into the required format
function processData(data) {
    return data.map(person => ({
        id: person.id,
        pid: person.rels.father || person.rels.mother || '',  // parent id
        name: `${person.data['first name']} ${person.data['last name']}`,
        gender: person.data.gender,
        location: person.data.location || '',
        avatar: person.data.avatar || '',
        birthYear: person.data['birth year'] || '',
        spouses: person.rels.spouses || [],
        title: person.data.location || ''  // Using location as title
    }));
}

// Initialize the chart
async function initializeChart() {
    try {
        const response = await fetch('data-siddiqui-family.json');
        const data = await response.json();
        const processedData = processData(data);

        chart = new OrgChart(document.getElementById("tree-container"), {
            template: "ula",
            enableSearch: true,
            nodeBinding: {
                field_0: "name",
                field_1: "location",
                img_0: "avatar"
            },
            nodes: processedData,
            nodeMenu: {
                details: { text: "Details" },
                edit: { text: "Edit" },
                add: { text: "Add" },
                remove: { text: "Remove" }
            },
            nodeTemplate: `
                <div class="node-card {{node.data.gender === 'M' ? 'male' : 'female'}}">
                    <div class="node-content">
                        {{if node.data.avatar}}
                        <img src="{{node.data.avatar}}" class="node-avatar"/>
                        {{/if}}
                        <div class="node-details">
                            <div class="node-name">{{node.data.name}}</div>
                            {{if node.data.location}}
                            <div class="node-location">{{node.data.location}}</div>
                            {{/if}}
                            {{if node.data.birthYear}}
                            <div class="node-location">Born: {{node.data.birthYear}}</div>
                            {{/if}}
                        </div>
                    </div>
                    {{if node.data.spouses.length > 0}}
                    <div class="node-spouses">
                        {{for spouse in node.data.spouses}}
                        <div class="spouse-info">
                            <small>Spouse: {{spouse.name}}</small>
                        </div>
                        {{/for}}
                    </div>
                    {{/if}}
                </div>
            `
        });

    } catch (error) {
        console.error('Error initializing chart:', error);
        document.getElementById('tree-container').innerHTML = 
            `<div style="color: red; padding: 20px;">Error loading family tree: ${error.message}</div>`;
    }
}

// Zoom controls
function zoomIn() {
    if (chart) {
        chart.zoom(1.2);
    }
}

function zoomOut() {
    if (chart) {
        chart.zoom(0.8);
    }
}

function centerView() {
    if (chart) {
        chart.fit();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeChart);