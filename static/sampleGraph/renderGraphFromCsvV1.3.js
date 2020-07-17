var gnodes = [[]]
var glinks = [[]]
var glabels = [];

d3.csv("uploads/test.csv", function (error,
  links) {
  if (error) throw error;

  // var w = 3840,//screen.width,
  //   h = 2160//screen.height;

  var w = screen.width,
    h = screen.height;
  glinks = links;
  var nodesByName = {};

  var zoom = d3.zoom()
  .scaleExtent([1, 100])
  .on("zoom", zoomed);

  function zoomed() {
    svg.attr("transform", d3.event.transform)
    //console.log("Current Zoom Multiplier:",d3.event.transform.k);
  }
  // Create nodes for each unique source and target.
  links.forEach(function (link) {
    link.source = nodeByName(link.source);
    link.target = nodeByName(link.target);
    link.left = false;
    link.right = true;
  });

  //Removes links with undefined nodes
  var removeLinks = links.filter(function (l) {
    if(l.source.name == "" || l.target.name == ""){
      console.log(l);
    }
    return l.source.name == "" || l.target.name == "";
  });
  removeLinks.map(function (l) {
    links.splice(links.indexOf(l), 1);
  });


  console.log(links)
  // Extract the array of nodes from the map by name.
  var nodes = d3.values(nodesByName);

  //Added this to delete nodes without names
  nodes.forEach(function(node,i){
    if (node.name == ""){
      console.log("This node does not have a name")
      nodes.splice(i,1);
      return
    }
    node.r = 1;
  })

  gnodes = nodes;

  var lastNodeId = nodes.length;
  console.log(nodes)

  positionNodes();
  var k = Math.sqrt(nodes.length / ((w * h)/2));
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", w*2)
    .attr("height", h*2)

      // define arrow markers for graph links
  svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 10)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000');
  svg.append('svg:defs') .append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 10)
    .attr('markerWidth', 3)
    .attr('markerHeight', 3)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M10,-5L0,0L10,5')
    .attr('fill', '#000');

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
        //.strength(-300)
        .strength(function(d){
          //var newChargeStrength = -10*d.r*//Math.pow(d.r,1.5)
          // console.log("Node:", d.name,"d.r=",d.r,"with Charge =",newChargeStrength);

          var newChargeStrength = (-10)/k;
          return newChargeStrength;
        })
        //.distanceMax((screen.height + screen.width) / 2)
    )
    .force(
      'center',
      d3.forceCenter(w, h))
    .force(
      "link",
      d3
        .forceLink()
        //.distance(60)
        .distance(function(d){
          //var distance = Math.pow(d.r,0.5) * 1.5;
          var distance;
          if(d.source.r > d.target.r){
            distance =d.source.r;
          }
          else{
            distance = d.target.r;
          }
          //console.log("New distance for",d.source.name,"to",d.target.name,"is...", distance);
          return distance;
        })
         //.strength(0.95)
        //.strength(0.2)
    )
    .force('collision',d3.forceCollide().radius(function(d){
      //console.log("Applying force collision! WITH d.r = ", d.r);
      // return Math.pow(d.r,0.5) * 1.5;
      return d.r*1.5;//Math.pow(d.r,0.15);
    }).strength(1))
    // .force("x", d3.forceX(w / 2).strength(0.1))
    // .force("y", d3.forceY(h / 2).strength(0.1))
    // .force("x", d3.forceX(w / 2))
    // .force("y", d3.forceY(h / 2))
    .force("x", d3.forceX(k*100))//.strength(0.1))
    .force("y", d3.forceY(k*100))//.strength(0.1))
    .on("tick", tick);

  //Create the link lines.
  var link = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link");


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
      return nodesByName[name] || (nodesByName[name] = { name: name });
  }

  force.nodes(nodes);
  force.force("link").links(links);


  var colors = d3.schemeCategory20;
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
    nodes.forEach(function (d, i) {
      d.x = d.y = (w / lastNodeId) * i;
    });
  }

  //Finds the offset to place edges at the circumfrence of a target circle node

  function getOffset(d, cord, dest){

    diffX = d.target.x - d.source.x;
    diffY = d.target.y - d.source.y;
    // Length of path from center of source node to center of target node
    pathLength = Math.sqrt((diffX * diffX) + (diffY * diffY));
    // x and y distances from center to outside edge of target node

    if (cord == "x" && dest == "target") return offsetX = (diffX * d.target.r) / pathLength;
    else if (cord == "y" && dest =="target") return offsetY = (diffY * d.target.r) / pathLength;
    else if (cord == "x" && dest =="source") return offsetX = (-diffX * d.source.r) / pathLength;
    else if (cord == "y" && dest =="source") return offsetY = (-diffY * d.source.r) / pathLength;
  }

  //update the simulation
  function tick() {
    edges
      .attr("x1", function (d) {
        return d.source.x-getOffset(d,"x","source");
      })
      .attr("y1", function (d) {
        return d.source.y-getOffset(d,"y","source");
      })
      .attr("x2", function (d) {
        // Total difference in x and y from source to target
        //console.log("-getOffset(d,x) =", getOffset(d,"x"))
        return d.target.x-getOffset(d,"x","target");
      })
      .attr("y2", function (d) {
        //console.log("-getOffset(d,x) =", getOffset(d,"y"))
        return d.target.y-getOffset(d,"y","target");
      });


    //here vertices are g.vertex elements
    vertices.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
    // vertices.attr("cx", function(d){ return d.x})
    //         .attr("cy", function(d){ return d.y});

    vertices.attr("r", function(d){
      return getNodeSize(d);
    });


    labels.attr("x", function (d) { return d.x; })
      .attr("y", function (d) { return d.y - 10; });

  }

  function addNode() {
    var e = d3.event;
    if (e.button == 0) {
      var coords = d3.mouse(e.currentTarget);
      var newNode = {
        x: coords[0],
        y: coords[1],
        name: "NewNode" + (++lastNodeId),
        index: lastNodeId,
        r: 1
      }
      nodes.push(newNode);
      restart();
    }
  }

  //d is data, i is index according to selection
  function removeNode(d, i) {
    //d => d.index
    var e = d3.event;
    //to make ctrl-drag works for mac/osx users
    if (e.ctrlKey) return;
    var linksToRemove = links.filter(function (l) {

      return l.source === d || l.target === d;
    });
    linksToRemove.map(function (l) {
      l.source.weight--;
      l.target.weight--;
      links.splice(links.indexOf(l), 1);
    });
    nodes.splice(nodes.indexOf(d), 1);

    //e.preventDefault();
    restart();
  }

  function removeEdge(d, i) {
    d.source.weight--;
    d.target.weight--;
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
      .style('marker-end', 'url(#end-arrow)')
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
    mousedownNode.weight++;
    d.weight++;
    var newLink = { source: mousedownNode, target: d, left: false,  right: true };
    links.push(newLink);
    console.log("pushed a new link!");
  }

  //one response per ctrl keydown
  var lastKeyDown = -1;

  function keydown() {
    d3.event.preventDefault();
    if (lastKeyDown !== -1) return;
    lastKeyDown = d3.event.key;
    console.log("lastKeyDown =",lastKeyDown)

    if (lastKeyDown === "Control") {
      vertices.call(
        d3
          .drag()
          .on("start", function dragstarted(d) {
            if (!d3.event.active) force.alphaTarget(1).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", function (d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          })
          .on("end", function (d) {
            if (!d3.event.active) force.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );
  }
  else if (lastKeyDown === "a"){

    svg.on("mousedown", addNode)
  }
}

  function keyup() {
    lastKeyDown = -1;
    if (d3.event.key === "Control") {
      vertices.on("mousedown.drag", null);
    }
    else if(d3.event.key === "a"){
      svg.on("mousedown", null)
    }

  }

  //Calculates new node size and return it
  function getNodeSize (d) {
    //return 5 + (d.weight * 2);
    return 5+(Math.pow(d.weight,1.3));
  }


  //updates the graph by updating links, nodes and binding them with DOM
  //interface is defined through several events
  function restart() {

    //console.log("The Restart Function has been called!");

    edges = edges.data(links, function (d) {
      return "v" + d.source.index + "-v" + d.target.index;
    });

    // update existing links
    // edges.classed('selected', (d) => d === selectedLink)
    edges
      .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '');

    edges.exit().remove();

    var ed = edges
      .enter()
      .append("line")
      .attr("class", "edge")
      // .classed('selected', (d) => d === selectedLink)
      .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '')
      .on("mousedown", function () {
        d3.event.stopPropagation();
      })
      .on("contextmenu", removeEdge);

    ed.append("title").text(function (d) {
      return "v" + d.source.index + "-v" + d.target.index;
    });

    edges = ed.merge(edges);


    vertices = vertices.data(nodes, function(d){
      //Recharge the nodes
      return d.index;
    })
    vertices.exit().remove();

    var ve = vertices
      .enter()
      .append("circle")
      .attr("r", function (d) {
        d.weight = link.filter(function (l) {
          return l.source.index == d.index || l.target.index == d.index
        }).size();
        console.log("Weight =", d.weight);
        newRadius =5+(Math.pow(d.weight,1.3));
        d.r = newRadius;
        console.log("setting weight of this", d.name,"to...", newRadius);
        return newRadius
      })
      .attr("class", "vertex")
      .attr("name", function (d) {
        return "vertex-" + d.name;
      })
      .style("fill", function (d, i) {
        // if (d.index == 0)
        //   return "#337DFF";
        // else {
        //   return colors[d.index%10];
        // }
        console.log ("d.index = ", d.index);
        console.log("setting color with num...", d.index % 20);
        return colors[d.index%20];
      })
      .on("mousedown", beginDragLine)
      .on("mouseup", endDragLine)
      .on("contextmenu", removeNode);

    ve.append("title").text(function (d) {
      return "function: '" + d.name;
    });

    vertices = ve.merge(vertices);

    labels = labels.data(nodes, function(d){
      return d.index;
    });
    labels.exit().remove();

    var la = labels
      .enter()
      .append("text")
      .text(function (d) { return d.name; })

    labels = la.merge(labels);
    force.nodes(nodes);
    force.force("link").links(links);

    d3.forceCollide().initialize(nodes);
    force.force("link").initialize(nodes);
    force.force("charge").initialize(nodes);

    force.alpha(0.8).restart();



    gnodes = nodes;
    glinks = links;
    glabels = labels;
  }

  //further interface
  svg
    .on("mousemove", updateDragLine)
    .on("mouseup", hideDragLine)
    // .on("contextmenu", function () {
    //   //d3.event.preventDefault();
    // })
    .on("mouseleave", hideDragLine)
    //.call(zoom);

  d3.select(window)
    .on("keydown", keydown)
    .on("keyup", keyup)
  restart();

});
