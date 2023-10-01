let font;
let textLayer;

let container;
let w;
let h;
let border;

let angle = 0;

function updateContainer() {
  container = select('#sketchContainer');
  w = parseFloat(getComputedStyle(container.elt).getPropertyValue('width'));
  h = parseFloat(getComputedStyle(container.elt).getPropertyValue('height'));
}

function windowResized() {
  updateContainer();
  resizeCanvas(w, h);
}

// return an array of random x,y within the canvas
const mapNodes = (n) => {
  const nodes = [];
  for (let i = 0; i < n; i++) {
    nodes.push([random(width), random(height)]);
  }
  return nodes;
}
// given an array of nodes, return an array of edges. Some edges should connect to the border

const mapEdges = (nodes) => {
  const edges = [];
  const borderNodes = [];
  const borderMargin = 50;

  // find nodes that are close to the border
  nodes.forEach((node) => {
    if (node[0] < borderMargin || node[0] > width - borderMargin || node[1] < borderMargin || node[1] > height - borderMargin) {
      borderNodes.push(node);
    }
  });

  // connect border nodes to each other
  for (let i = 0; i < borderNodes.length; i++) {
    for (let j = i + 1; j < borderNodes.length; j++) {
      edges.push([borderNodes[i], borderNodes[j]]);
    }
  }

  // connect non-border nodes to border nodes
  nodes.forEach((node) => {
    borderNodes.forEach((borderNode) => {
      if (dist(node[0], node[1], borderNode[0], borderNode[1]) < 100) {
        edges.push([node, borderNode]);
      }
    });
  });

  return edges;
}

function setup() {
  updateContainer();
  canvas = createCanvas(w, h, WEBGL);
  smooth();
  canvas.parent("#sketchContainer");
  nodes = mapNodes(20);
  edges = mapEdges(nodes);
  noLoop();
}



function draw() {
  // set the center of the canvas to 0,0
  translate(-width / 2, -height / 2);

  // set background to very light brown
  background('#ffffff');

  // draw the nodes as dots
  stroke('#222831');
  strokeWeight(5);
  fill('#222831');
  nodes.forEach((node) => {
    point(node[0], node[1]);
  });

  // draw the edges as lines. use a gradient for the color
  stroke('#222839');
  strokeWeight(2);
  edges.forEach((edge) => {
    const [start, end] = edge;
    line(start[0], start[1], end[0], end[1]);
  });

  // border
  stroke('#222831');
  noFill();
  strokeWeight(5);
  rectMode("corners");
  rect(0, 0, width, height);
  angle += 0.01;

  document.getElementById("fps").innerHTML = frameRate().toFixed(2);
}

function colorAlpha(aColor, alpha) {
  // allows usage of HEX colors with alpha
  const c = color(aColor);
  let a = alpha;
  if (alpha <= 0.1) {
    a = 0.1;
  }
  return color('rgba(${[red(c), green(c), blue(c), a].join(', ')})');
}
