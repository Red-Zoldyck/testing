// Node class
class Node {
    constructor(string, state) {
        this.string = string; // sigma: {0,1}
        this.state = state; // Q: {A, B, C, p}
        this.children = [];
    }
}

// Main test function
function test() {
    const input = document.getElementById('inputString').value.trim();
    
    // Input validation: only {0,1}
    if (!/^[01]*$/.test(input)) {
        document.getElementById('result').innerText = "Invalid input! Only '0' and '1' are allowed.";
        return;
    }

    const root = new Node('Start', 'A');
    computationalTree(root, input, 0);
    displayTree(root);
    acceptancecheck(root, input);
}


// Tree-building logic based on the transition table
function computationalTree(node, input, i) {
    if (i >= input.length) return;

    const sigma = input[i]; // Current symbol
    const currentState = node.state;

    if (currentState === 'A') {
        if (sigma === '0') {
            const newNode = new Node(sigma, 'B'); // Transition to B
            node.children.push(newNode);
            computationalTree(newNode, input, i + 1);
        }
        const newNode = new Node(sigma, 'A'); // Stay in A
        node.children.push(newNode);
        computationalTree(newNode, input, i + 1);
    } else if (currentState === 'B') {
        if (sigma === '0') {
            const newNode = new Node(sigma, 'p'); // Transition to p
            node.children.push(newNode);
            computationalTree(newNode, input, i + 1);
        } else if (sigma === '1') {
            const newNode = new Node(sigma, 'C'); // Transition to C
            node.children.push(newNode);
            computationalTree(newNode, input, i + 1);
        }
    } else if (currentState === 'C') {
        const newNode = new Node(sigma, 'C'); // Stay in C
        node.children.push(newNode);
        computationalTree(newNode, input, i + 1);
    }
}


// Acceptance check function
function acceptancecheck(root, input) {
    let isAccepted = false;

    function traverse(node, path) {
        if (path.length === input.length && node.state === 'C') {
            isAccepted = true; // Input is accepted if it ends in state C
        }
        for (const child of node.children) {
            traverse(child, path + child.string);
        }
    }
    traverse(root, '');

    document.getElementById('result').innerText = isAccepted ?
        `The string "${input}" is accepted.` :
        `The string "${input}" is not accepted.`;
}


// Tree visualization using D3.js
function displayTree(root) {
    document.getElementById('tree').innerHTML = ''; // Clear previous SVG
    const container = document.getElementById("tree");
    const width = container.offsetWidth || 800; // Default width if container size is not available
    const height = container.offsetHeight || 1200; // Default height

    // Create a dynamic tree layout with adjusted separation between nodes
    const treeLayout = d3.tree().size([width - 60, height - 60])
                               .separation((a, b) => {
                                   return a.parent === b.parent ? 1 : 1;
                               });

    // Create the hierarchy data and tree data
    const hierarchyData = d3.hierarchy(root, node => node.children);
    const treeData = treeLayout(hierarchyData);

    // Create SVG container
    const svg = d3.select("#tree")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", "translate(1, 1)");
    // Add arrow markers for the links
    svg.append("defs")
       .append("marker")
       .attr("id", "arrow")
       .attr("viewBox", "0 0 20 20")
       .attr("refX", 10)
       .attr("refY", 5)
       .attr("markerWidth", 6)
       .attr("markerHeight", 6)
       .attr("orient", "auto")
       .append("path")
       .attr("d", "M 0 0 L 10 5 L 0 10 z")
       .style("fill", "black");

    // Draw links (arrows with markers)
    svg.selectAll(".link")
       .data(treeData.links())
       .enter()
       .append("line")
       .attr("class", "link")
       .attr("x1", d => d.source.x)
       .attr("y1", d => d.source.y + 25)
       .attr("x2", d => d.target.x)
       .attr("y2", d => d.target.y - 3)
       .attr("stroke", "black")
       .attr("stroke-width", 2)
       .attr("marker-end", "url(#arrow)"); // Add arrow marker

    // Draw nodes
    const node = svg.selectAll(".node")
                    .data(treeData.descendants())
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .attr("transform", d => `translate(${d.x},${d.y + 25})`); // Adjust nodes position

    node.append("circle")
        .attr("r", 25)
        .style("fill", d => {
            if (d.data.state === 'A') return "lightblue";
            if (d.data.state === 'B') return "lightblue";
            if (d.data.state === 'p') return "pink";
            if (d.data.state === 'C') return "lightgreen"; // Highlight final state
            return "white"; // Default color
        }).style("stroke", "black")
        .style("stroke-width", 2);

    // Add the state (A, B, C, p) in the node
    node.append("text")
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(d => `(${d.data.state})`);

    // Add labels for the input (0 or 1) inside the line (centered and bold)
    svg.selectAll(".label")
       .data(treeData.links())
       .enter()
       .append("text")
       .attr("class", "label")
       .attr("x", d => (d.source.x + d.target.x) / 2)
       .attr("y", d => (d.source.y + d.target.y) / 2)
       .attr("dx", 5)   // make the text have some distance to the arrow
       .attr("dy", 20)  // Adjust vertical alignment to center
       .attr("text-anchor", "middle")
       .style("font-size", "14px") // Font size for better visibility
       .style("font-weight", "bold") // Make the text bold
       .text(d => {
           const label = d.target.data.string;
           return label.length > 10 ? label.slice(0, 10) + "..." : label; // Truncate long labels
       });
}
