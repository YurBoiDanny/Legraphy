
    //node ids are in order in which nodes come in existence
   /* var nodes = [
      { id: 1},
      { id: 2},
      { id: 3},
      { id: 4},
      { id: 5},
      { id: 6},
      { id: 7},
      { id: 8},
      { id: 9},
      { id: 10 }
    ];
    
    var links = [
      { source: 0, target: 1 },
      { source: 1, target: 2 },
      { source: 2, target: 0 },
      { source: 3, target: 4 },
      { source: 5, target: 6 },
      { source: 5, target: 7 },
      { source: 5, target: 8 },
      { source: 5, target: 9 },
      { source: 6, target: 7 },
      { source: 7, target: 8 },
      { source: 8, target: 9 },
      { source: 9, target: 6 }
    ];*/

var gnodes = [[]] 
var glinks = [[]]
var glabels = [];

d3.csv("uploads/cCode.csv", function(error, links) {
  if (error) throw error;

  var w = screen.width,
  h = screen.height;
  rad = 10;
  glinks = links;
  var nodesByName = {};

  // Create nodes for each unique source and target.
  links.forEach(function(link) {
    link.source = nodeByName(link.source);
    link.target = nodeByName(link.target);
  });

  // Extract the array of nodes from the map by name.
  var nodes = d3.values(nodesByName);
  gnodes = nodes;
  var lastNodeId = nodes.length;
    
  positionNodes();
  
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  
  var dragLine = svg
    .append("path")
    .attr("class", "dragLine hidden")
    .attr("d", "M0,0L0,0");
  
  var edges = svg.append("g").selectAll(".edge");
  
  var vertices = svg.append("g").selectAll(".vertex");
  
  var force = d3
    .forceSimulation()
    .force(
      "charge",
      d3
        .forceManyBody()
        .strength(-300)
        .distanceMax((w + h) / 2)
    )
    .force(
      "link",
      d3
        .forceLink()
        .distance(60)
        .strength(0.95)
    )
    .force("x", d3.forceX(w / 2).strength(0.1))
    .force("y", d3.forceY(h / 2).strength(0.1))
    .on("tick", tick);

  

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
  
    // var label = svg.selectAll(".mytext")
    //   .data(nodes)
    //   .enter()
    //   .append("text")
    //     .text(function (d) { return d.name; })
    //     .style("text-anchor", "middle")
    //     .style("fill", "#532")
    //     .style("font-family", "Arial")
    //     .style("font-size", 12);

    var labels = svg.append('svg:g').selectAll(".labels")
    .data(nodes)
    .enter()
    .append("text")
      .text(function (d) { return d.name; })
      .style("text-anchor", "middle")
      .style("fill", "#532")
      .style("font-family", "Arial")
      .style("font-size", 12);

      function nodeByName(name) {
        return nodesByName[name] || (nodesByName[name] = {name: name});
      }
      force.nodes(nodes);
    force.force("link").links(links);


    var colors = d3.schemeCategory10;
    var mousedownNode = null;
    
    d3.select("#clear-graph").on("click", clearGraph);
    
    //empties the graph
    function clearGraph() {
      nodes.splice(0);
      links.splice(0);
      lastNodeId = 0;
      restart();
    }
    
    //set initial positions for quick convergence
    function positionNodes() {
      nodes.forEach(function(d, i) {
        d.x = d.y = (w / lastNodeId) * i;
      });
    }
 
    
    //update the simulation
    function tick() {
      edges
        .attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });
    
      //here vertices are g.vertex elements
      vertices.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      
      labels.attr("x", function(d){ return d.x; })
    			 .attr("y", function (d) {return d.y - 10; });


    }
    
    function addNode() {
      var e = d3.event;
      if (e.button == 0) {
        var coords = d3.mouse(e.currentTarget);
        var newNode = {
          x: coords[0],
          y: coords[1],
          name: "NewNode"
        }
        nodes.push(newNode);
        // labels = labels.data(nodes);

        // labels.exit().remove();
        
        // labels.enter()
        //       .append("text")
        //       .attr("x", function(d){ return d.x; })
    		// 	  .attr("y", function (d) {return d.y - 10; })
        //         .text(function (d) { return d.name; })
        //         .style("text-anchor", "middle")
        //         .style("fill", "#532")
        //         .style("font-family", "Arial")
        //         .style("font-size", 12);

        labels.remove();
        labels = svg.append('svg:g').selectAll(".labels")
        .data(nodes)
        .enter()
        .append("text")
          .text(function (d) { return d.name; })
          .style("text-anchor", "middle")
          .style("fill", "#532")
          .style("font-family", "Arial")
          .style("font-size", 12)
        .merge(labels)
        restart();
      }
    }
    
    //d is data, i is index according to selection
    function removeNode(d, i) {
      var e = d3.event;
      //to make ctrl-drag works for mac/osx users
      if (e.ctrlKey) return;
      var linksToRemove = links.filter(function(l) {
        return l.source === d || l.target === d;
      });
      linksToRemove.map(function(l) {
        links.splice(links.indexOf(l), 1);
      });
      nodes.splice(nodes.indexOf(d), 1);
      var deleteLabel = labels.data(force.nodes()).exit().remove();
      e.preventDefault();
      restart();
    }
    
    function removeEdge(d, i) {
      var e = d3.event;
      links.splice(links.indexOf(d), 1);
      e.preventDefault();
      restart();
    }
    
    function beginDragLine(d) {
      var e = d3.event;
      //stop propagation at .vertex so that addNode isn't fired
      e.stopPropagation();
      //to prevent dragging of svg in firefox
      e.preventDefault();
      if (e.ctrlKey || e.button != 0) return;
      mousedownNode = d;
      dragLine
        .classed("hidden", false)
        .attr(
          "d",
          "M" +
            mousedownNode.x +
            "," +
            mousedownNode.y +
            "L" +
            mousedownNode.x +
            "," +
            mousedownNode.y
        );
    }
    
    function updateDragLine() {
      if (!mousedownNode) return;
      var coords = d3.mouse(d3.event.currentTarget);
      dragLine.attr(
        "d",
        "M" +
          mousedownNode.x +
          "," +
          mousedownNode.y +
          "L" +
          coords[0] +
          "," +
          coords[1]
      );
    }
    
    function hideDragLine() {
      dragLine.classed("hidden", true);
      mousedownNode = null;
      restart();
    }
    
    //no need to call hideDragLine in endDragLine
    //mouseup on vertices propagates to svg which calls hideDragLine
    function endDragLine(d) {
      if (!mousedownNode || mousedownNode === d) return;
      //return if link already exists
      for (var i = 0; i < links.length; i++) {
        var l = links[i];
        if (
          (l.source === mousedownNode && l.target === d) ||
          (l.source === d && l.target === mousedownNode)
        ) {
          return;
        }
      }
      var newLink = { source: mousedownNode, target: d };
      links.push(newLink);
    }
    
    //one response per ctrl keydown
    var lastKeyDown = -1;
    
    function keydown() {
      d3.event.preventDefault();
      if (lastKeyDown !== -1) return;
      lastKeyDown = d3.event.key;
    
      if (lastKeyDown === "Control") {
        vertices.call(
          d3
            .drag()
            .on("start", function dragstarted(d) {
              if (!d3.event.active) force.alphaTarget(1).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on("drag", function(d) {
              d.fx = d3.event.x;
              d.fy = d3.event.y;
            })
            .on("end", function(d) {
              if (!d3.event.active) force.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
        );
      }
    }
    
    function keyup() {
      lastKeyDown = -1;
      if (d3.event.key === "Control") {
        vertices.on("mousedown.drag", null);
      }
    }
    
    //updates the graph by updating links, nodes and binding them with DOM
    //interface is defined through several events
    function restart() {
      edges = edges.data(links, function(d) {
        return "v" + d.source.index + "-v" + d.target.index;
      });
      edges.exit().remove();
    
      var ed = edges
        .enter()
        .append("line")
        .attr("class", "edge")
        .on("mousedown", function() {
          d3.event.stopPropagation();
        })
        .on("contextmenu", removeEdge);
    
      ed.append("title").text(function(d) {
        return "v" + d.source.index + "-v" + d.target.index;
      });
    
      edges = ed.merge(edges);
    
      vertices = vertices.data(nodes)
      vertices.exit().remove();
    
      vertices.selectAll("text").text(function(d) {
        return d.name;
      });

      var ve = vertices
        .enter()
        .append("circle")
        .attr("r", rad)
        .attr("class", "vertex")
        .attr("id", function(d) {
          return "v" + d.name;
        })
        .style("fill", function(d, i) {
          if (d.index = 0)
            return "#337DFF";
          else
          {
            return colors[d.index];
          }
        })
        .on("mousedown", beginDragLine)
        .on("mouseup", endDragLine)
        .on("contextmenu", removeNode);

      ve.append("title").text(function(d) {
        return "v" + d.name;
      });

      vertices = ve.merge(vertices);


      force.nodes(nodes);
      force.force("link").links(links);
      force.alpha(0.8).restart();


       
      gnodes = nodes;
      glinks = links;
      glabels = labels;
    }
    
    //further interface
    svg
      .on("mousedown", addNode)
      .on("mousemove", updateDragLine)
      .on("mouseup", hideDragLine)
      .on("contextmenu", function() {
        d3.event.preventDefault();
      })
      .on("mouseleave", hideDragLine);
    
    d3.select(window)
      .on("keydown", keydown)
      .on("keyup", keyup)
    restart();
    
});
