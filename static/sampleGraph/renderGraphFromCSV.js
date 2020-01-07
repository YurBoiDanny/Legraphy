
var width = screen.width,
height = screen.height;

console.log(width, height);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed)

var force = d3.layout.force()
    .size([width, height])
    

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom)
    .append('svg:g');

force.drag().on("dragstart", function() {
    d3.event.sourceEvent.stopPropagation(); 
});


d3.csv("uploads/graph.csv", function(error, links) {
  if (error) throw error;

  var nodesByName = {};

  // Create nodes for each unique source and target.
  links.forEach(function(link) {
    link.source = nodeByName(link.source);
    link.target = nodeByName(link.target);
  });

  // Extract the array of nodes from the map by name.
  var nodes = d3.values(nodesByName);

  // Create the link lines.
  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("line")
      .attr("class", "link");

  // Create the node circles.
  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 4.5)
      .call(force.drag);

  // Start the force layout.
  force
      .nodes(nodes)
      .links(links)
      .on("tick", tick)
      .start();

  function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

  function nodeByName(name) {
    return nodesByName[name] || (nodesByName[name] = {name: name});
  }
});



function zoomed() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    console.log(zoom.scale());
}
  
  function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
  
    d3.select(this).classed("dragging", true);
    force.start();
  }
  
  function dragged(d) {
  
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
  
  }
  
  function dragended(d) {
  
    d3.select(this).classed("dragging", false);
  }