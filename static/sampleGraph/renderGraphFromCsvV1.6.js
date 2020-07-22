var glinks = [[]]

d3.csv("uploads/currentGraph.csv", function (error, links) {
    if (error) throw error;

    // var w = 3840,//screen.width,
    //   h = 2160//screen.height;

    var w = screen.width,
        h = screen.height;
    glinks = links;
    var nodesByName = {};

    var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

    function zoomed() {
        const currentTransform = d3.event.transform;
        svg.attr("transform", currentTransform);
        slider.property("value", currentTransform.k);
    }

    var slider = d3.select("#botNavBarZoomSlider").append("p").append("input")
    .datum({})
    .attr("type", "range")
    .attr("value", zoom.scaleExtent()[0])
    .attr("min", zoom.scaleExtent()[0])
    .attr("max", zoom.scaleExtent()[1])
    .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 100)
    .on("input", slided);

    function slided(d) {
        zoom.scaleTo(svg, d3.select(this).property("value"));
    }

    var drag = d3.drag()
        .subject(function(d){return d;})
        .on("start",function startdrag(d){
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("dragging",true);
        })
        .on("drag", function dragged(d){
            d3.select(this).attr("cx",d.x = d3.event.x).attr("cy", d.y = d3.event.y);
        })
        .on("end", function endOfDrag(d){
            d3.select(this).classed("dragging", false);
        });


    // Create nodes for each unique source and target.
    links.forEach(function (link) {
        link.source = nodeByName(link.source);
        link.target = nodeByName(link.target);
        link.left = false;
        link.right = true;
    });

    //Removes links with undefined nodes
    var removeLinks = links.filter(function (l) {
        if (l.source.name == "" || l.target.name == "") {
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
    nodes.forEach(function (node, i) {
        if (node.name == "") {
            //console.log("This node does not have a name")
            nodes.splice(i, 1);
            return
        }
        node.r = 1;
    })

    var lastNodeId = nodes.length;
    console.log(nodes)

    positionNodes();
    var k = Math.sqrt(nodes.length / ((w * h) / 2));
    var svg = d3
        .select("body")
        .append("svg")
        .attr("width", w * 2)
        .attr("height", h * 2)
        .call(zoom)
        

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
    svg.append('svg:defs').append('svg:marker')
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
    var edgeLabels = svg.append("g").selectAll(".edgeLabel");
    var labels = svg.append('svg:g').selectAll(".labels");

    var force = d3
        .forceSimulation()
        .force(
            "charge",
            d3
                .forceManyBody()
                //.strength(-300)
                .strength(function (d) {
                    //var newChargeStrength = -10*d.r*//Math.pow(d.r,1.5)
                    // console.log("Node:", d.name,"d.r=",d.r,"with Charge =",newChargeStrength);
                    var newChargeStrength = (-10) / k;
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
                .distance(function (d) {
                    //var distance = Math.pow(d.r,0.5) * 1.5;
                    var distance;
                    if (d.source.r > d.target.r) {
                        distance = d.source.r;
                    }
                    else {
                        distance = d.target.r;
                    }
                    //console.log("New distance for",d.source.name,"to",d.target.name,"is...", distance);
                    return distance;
                })
            //.strength(0.95)
            //.strength(0.2)
        )
        .force('collision', d3.forceCollide().radius(function (d) {
            //console.log("Applying force collision! WITH d.r = ", d.r);
            // return Math.pow(d.r,0.5) * 1.5;
            return d.r * 1.5;//Math.pow(d.r,0.15);
        }).strength(1))
        // .force("x", d3.forceX(w / 2).strength(0.1))
        // .force("y", d3.forceY(h / 2).strength(0.1))
        // .force("x", d3.forceX(w / 2))
        // .force("y", d3.forceY(h / 2))
        .force("x", d3.forceX(k * 100))//.strength(0.1))
        .force("y", d3.forceY(k * 100))//.strength(0.1))
        .on("tick", tick);

    //Create the link lines.
      var link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link");

    function nodeByName(name) {
        return nodesByName[name] || (nodesByName[name] = { name: name });
    }

    force.nodes(nodes);
    force.force("link").links(links);


    var colors = d3.schemeCategory20;
    var mousedownNode = null;

    //set initial positions for quick convergence
    function positionNodes() {
        nodes.forEach(function (d, i) {
            d.x = d.y = (w / lastNodeId) * i;
        });
    }

//-----------------------------Graph Interface & Update Functions-----------------------------

    //Finds the offset to place edges at the circumfrence of a target circle node
    function getOffset(d, cord, dest) {

        diffX = d.target.x - d.source.x;
        diffY = d.target.y - d.source.y;
        // Length of path from center of source node to center of target node
        pathLength = Math.sqrt((diffX * diffX) + (diffY * diffY));
        // x and y distances from center to outside edge of target node

        if (cord == "x" && dest == "target") return offsetX = (diffX * d.target.r) / pathLength;
        else if (cord == "y" && dest == "target") return offsetY = (diffY * d.target.r) / pathLength;
        else if (cord == "x" && dest == "source") return offsetX = (-diffX * d.source.r) / pathLength;
        else if (cord == "y" && dest == "source") return offsetY = (-diffY * d.source.r) / pathLength;
    }

    //update the simulation
    function tick() {
        var ex1,ey1,ex2,ey2;

        edges.attr("x1", function (d) {
            ex1 = d.source.x - getOffset(d, "x", "source")
            return ex1;
        })
            .attr("y1", function (d) {
                ey1 =  d.source.y - getOffset(d, "y", "source")
                return ey1;
            })
            .attr("x2", function (d) {
                // Total difference in x and y from source to target
                //console.log("-getOffset(d,x) =", getOffset(d,"x"))
                ex2 = d.target.x - getOffset(d, "x", "target")
                return ex2;
            })
            .attr("y2", function (d) {
                //console.log("-getOffset(d,x) =", getOffset(d,"y"))
                ey2 =  d.target.y - getOffset(d, "y", "target");
                return ey2;
            });

        //here vertices are g.vertex elements
        vertices.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
        // vertices.attr("cx", function(d){ return d.x})
        //         .attr("cy", function(d){ return d.y});


        vertices.attr("r", function (d) {
            d.r = getNodeSize(d)
            return d.r;
        });


        labels.attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; });

        edgeLabels.attr("x", function (d) {
            if(d.source.x<d.target.x)
                return (d.target.x+(d.source.x-d.target.x)/2);
            else
                return (d.source.x +(d.target.x - d.source.x)/2);
        })
        .attr("y", function (d) {
            if(d.source.y<d.target.y)
                return (d.target.y+(d.source.y-d.target.y)/2);
            else
                return (d.source.y + (d.target.y - d.source.y)/2);

            })

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
        var newLink = { source: mousedownNode, target: d, left: false, right: true };
        links.push(newLink);
        console.log("pushed a new link!");
    }

    //one response per ctrl keydown
    var lastKeyDown = -1;

    function keydown() {
        d3.event.preventDefault();
        if (lastKeyDown !== -1) return;
        lastKeyDown = d3.event.key;
        console.log("lastKeyDown =", lastKeyDown)

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
        else if (lastKeyDown === "a") {
            svg.on("mousedown", addNode)
        }
    }

    function keyup() {
        lastKeyDown = -1;
        if (d3.event.key === "Control") {
            vertices.on("mousedown.drag", null);
        }
        else if (d3.event.key === "a") {
            svg.on("mousedown", null)
        }

    }

    //Calculates new node size and return it
    function getNodeSize(d) {
        //return 5 + (d.weight * 2);
        return 10 + (Math.pow(d.weight, 1.3));
    }

//updates the graph by updating links, nodes and binding them with DOM
    function restart() {
        //console.log("The Restart Function has been called!");

        edges = edges.data(links, function (d) {
            return "v" + d.source.index + "-v" + d.target.index;
        });

        edges.exit().remove();

        var ed = edges
            .enter()
            .append("line")
            .attr("class", "edge")
            .attr('id', function(d,i){return "edge"+d.index})
            .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
            .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '');

        if(d3.select("#contextEditNodeEdgeOption").text() == "Edit Nodes/Edges")
        {
            ed.call(make_edge_editable,"#edges");
        }


        ed.append("title").text(function (d) {
            return "v" + d.source.index + "-v" + d.target.index;
        });

        edges = ed.merge(edges);


        vertices = vertices.data(nodes, function (d) {
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
                //console.log("Weight =", d.weight);
                //newRadius =5+(Math.pow(d.weight,1.3));
                d.r = getNodeSize(d);
                //console.log("setting weight of this", d.name, "to...", d.r);
                return d.r
            })
            .attr("class", "vertex")
            .attr("name", function (d) {
                return "vertex-" + d.name;
            })
            .style("fill", function (d, i) {
                return colors[d.index % 20];
            })
        if(d3.select("#contextEditNodeEdgeOption").text() != "Edit Nodes/Edges")
        {
            ve.call(make_node_editable,"#vertex");
        }


        ve.append("title").text(function (d) {
            return "function:" + d.name;
        });

        vertices = ve.merge(vertices);

        labels = labels.data(nodes, function (d) {
            return d.index;
        });
        labels.exit().remove();

        var la = labels
            .enter()
            .append("text")
            .text(function (d,i) { return d.name; })
            .style("text-anchor", "middle")
            .style("fill", "black")
            .style("font-weight", "bold")
            .style("font-size", function(d,i) { return Math.min(2*d.r, (2*d.r - 10) / this.getComputedTextLength() * 10) + "px"; })
            .attr("dy", ".35em")
            //.call(make_editable, "labels");
        labels = la.merge(labels);

        edgeLabels = edgeLabels.data(links, function (d) {
            return d.index;
        })
        edgeLabels.exit().remove();
        
        var el = edgeLabels
            .enter()
            .append("text")
            .attr("class", "edgeLabel")
            .style("font-family", "Arial")
            .style("font-size", 10)
            .style( 'fill', '#aaa')
            .attr("startOffset", "50%")
            .text(function (d) {
                txt = ""
                if(!d.edge)
                {
                    d.edge = "newEdgeLabel"
                }
                txt = d.edge
                return txt;
            })

        edgeLabels = el.merge(edgeLabels);

        force.nodes(nodes);
        force.force("link").links(links);
        force.alpha(0.8).restart();

        glinks = links;

        console.log(glinks);
    }
//-----------------------------END of Graph Interface & Update Functions-----------------------------


//---------------------------DOM Property modifcation functions---------------------------
    function make_labels_editable(d, field){
        //console.log("make_editable", arguments);
        
        d
          .on("mouseover", function() {
            d3.select(this).style("fill", "red");
          })
          .on("mouseout", function() {
            d3.select(this).style("fill", null);
          })
          .on("click", function(d) {
            var p = this.parentNode;
    
            //console.log(this, arguments);
            //console.log(this);
            

            var el = d3.select(this);
            var p_el = d3.select(p);
    
            var frm = p_el.append("foreignObject");
    
            var inp = frm
                // .attr("x", d.source.x +(d.target.x - d.source.x)/2)
                // .attr("y", d.source.y +(d.target.y - d.source.y)/2)
                .attr("x", el.attr("x"))
                .attr("y", el.attr("y"))
                .attr("width", 300)
                .attr("height", 30)
                .style("font", "12px times")
                .append("xhtml:form")
                        .append("input")
                            .attr("value", function() {
                                // nasty spot to place this call, but here we are sure that the <input> tag is available
                                // and is handily pointed at by 'this':
                                this.focus();
    
                                return el.text();
                            })
                            .attr("style", "width: auto;")
                            // make the form go away when you jump out (form looses focus) or hit ENTER:
                            .on("blur", function() {
                                //console.log("blur", this, arguments);
    
                                var txt = inp.node().value;
    
                                d[field] = txt;
                                el
                                    .text(function(d) { return d[field]; });
    
                                p_el.select("foreignObject").remove();
                            })
                            .on("keypress", function() {
                                console.log("keypress", this, arguments);
    
                                // IE fix
                                if (!d3.event)
                                    d3.event = window.event;
    
                                var e = d3.event;
                                if (e.keyCode == 13)//Enter Key
                                {
                                    if (typeof(e.cancelBubble) !== 'undefined') // IE
                                      e.cancelBubble = true;
                                    if (e.stopPropagation)
                                      e.stopPropagation();
                                    e.preventDefault();
    
                                    var txt = inp.node().value;
    
                                    d[field] = txt;
                                    el.text(function(d) { return d[field]; });
                                    
                                    if (el.attr("class") === "edgeLabel")
                                    {
                                        d.edge = txt;
                                    }
                                    else
                                    {
                                        d.name = txt;
                                    }
                                    
                                    //console.log(d.name)
                                    restart();
                                    p_el.select("foreignObject").remove();
                                    
                                }
                            });
          });
    }
    
    function make_labels_uneditable(d,field)
    {
        d
            .on("mouseover",null)
            .on("mouseout", null)
            .on("click",null);
    }

    function make_node_editable(d,field){
        d
            .on("mousedown", beginDragLine)
            .on("mouseup", endDragLine)
            .on("contextmenu", removeNode);
    }

    function make_node_uneditable(d,field){
        d
            .on("mousedown", null)
            .on("mouseup", null)
            .on("contextmenu", null);
    }

    function make_edge_editable(d,field){
        d
            .on("mousedown", function () {
                d3.event.stopPropagation();
            })
            .on("contextmenu", removeEdge);
    }

    function make_edge_uneditable(d,field){
        d
            .on("mousedown", null)
            .on("contextmenu", null);
    }
//---------------------------DOM Property modifcation functions END---------------------------


//---------------------------further interface------------------------------------------------
    svg
        //.call(drag)
        //.call(zoom);

        // .on("mousemove", updateDragLine)
        // .on("mouseup", hideDragLine)
    // .on("contextmenu", function () {
    //   d3.event.preventDefault();
    // //   var cm = d3.select("#custom-cm");
    // //   const show = cm.style('display') ==='none';
    // //   if(show)
    // //     cm.style('display','block');
    // //   else
    // //     cm.style('display','none');
    // })
    //.on("mouseleave", hideDragLine)
    //.call(zoom);
    

    //Interface with Context Menu
    d3.select("#contextEditOption")
        .on("click", function(){
            var option = d3.select("#contextEditOption");
            if(option.text() == "Edit Labels")
            {
                option.text("Stop Editing Labels");
                //console.log(d3.select("#contextEditOption").text());
                edgeLabels.call(make_labels_editable, "edgeLabel");
                labels.call(make_labels_editable, "labels");
            }
            else
            {
                option.text("Edit Labels");
                //console.log(d3.select("#contextEditOption").text());
                edgeLabels.call(make_labels_uneditable, "edgeLabel");
                labels.call(make_labels_uneditable, "labels");
            }
        })
    d3.select("#contextEditNodeEdgeOption")
        .on("click", function(){
            var option = d3.select("#contextEditNodeEdgeOption");
            if(option.text() == "Edit Nodes/Edges")
            {
                option.text("Stop Editing Nodes/Edges");
                svg
                    .on('.zoom', null)
                    .on("mousemove", updateDragLine)
                    .on("mouseup", hideDragLine)
                    .on("mousedown", addNode);
                    
                vertices.call(make_node_editable,"#vertex");
                edges.call(make_edge_editable,"#edges");

            }
            else
            {
                option.text("Edit Nodes/Edges");
                svg
                    .call(zoom)
                    .on("mousemove", null)
                    .on("mouseup", null)
                    .on("mousedown", null);
                vertices.call(make_node_uneditable,"#vertex");
                edges.call(make_edge_uneditable,"#edges");
            }
        })
    
    //Interface with Bot-Nav Bar
    d3.select("#navLinkFullscreen")
        .on("click",function(){
            console.log("Fullscreen button pressed!");
        })


    d3.select(window)
        // .on("keydown", keydown)
        // .on("keyup", keyup)
    restart();
//---------------------------END of further interface-----------------------------------------
});
