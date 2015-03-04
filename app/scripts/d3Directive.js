(function () {
  'use strict';

  angular.module('myApp.directives')
    .directive('d3Bubbles', ['d3', function(d3) {
    return {
      restrict: 'EA',
      scope: {
        data: "=",
        label: "@",
        onClick: "&"
      },
      link: function(scope, iElement, iAttrs) {
        var margin = {top: 350, right: 480, bottom: 350, left: 480},
            radius = Math.min(margin.top, margin.right, margin.bottom, margin.left) - 10;

        var hue = d3.scale.category10();

        var luminance = d3.scale.sqrt()
            .domain([0, 1e6])
            .clamp(true)
            .range([90, 20]);

        var svg = d3.select("body").append("svg")
            .attr("width", margin.left + margin.right)
            .attr("height", margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var partition = d3.layout.partition()
            .sort(function(a, b) { return d3.ascending(a.name, b.name); })
            .size([2 * Math.PI, radius]);

        var arc = d3.svg.arc()
            .startAngle(function(d) { return d.x; })
            .endAngle(function(d) { return d.x + d.dx - .01 / (d.depth + .5); })
            .innerRadius(function(d) { 
              if(d.depth > 1){
                return radius / 2.5 * d.depth; 
              } else {
                return 0;
              }
            })
            .outerRadius(function(d) { 
              if(d.depth > 1){
                return radius / 3 * (d.depth + 1) - 1; 
              } else {
                return radius / 2.50 * (d.depth + 1) - 1; 
              }
            });



        var jsonGetter = function(file){
          d3.json(file, function(error, root) {

            // Compute the initial layout on the entire tree to sum sizes.
            // Also compute the full name and fill color for each node,
            // and stash the children so they can be restored as we descend.
            partition
                .value(function(d) { return d.size; })
                .nodes(root)
                .forEach(function(d) {
                  d._children = d.children;
                  d.sum = d.value;
                  d.key = key(d);
                  d.fill = fill(d);
                });

            partition
                .children(function(d, depth) { return depth < 2 ? d._children : null; })
                .value(function(d) { return d.sum; });

            var center = svg.append("circle")
                .attr("r", 0)

            var path = svg.selectAll("path")
                    .data(partition.nodes(root).slice(1))
                  .enter().append("path")
                    .attr("d", arc)
                    .style("fill", function(d) { 
                      if(d.name === "email"){
                        return '#aad450'; 
                      } else if(d.name === "google"){
                        return '#dd4b39'; 
                      } else if(d.name === "youtube"){
                        return '#d86d25'; 
                      } else if(d.name === "twitter"){
                        return '#00aced'; 
                      } else if(d.name === "facebook"){
                        return '#3b5998'; 
                      } else if(d.parent.name === "google"){
                        return '#e46f61'; 
                      } else if(d.parent.name === "youtube"){
                        return '#e08a51'; 
                      } else if(d.parent.name === "twitter"){
                        return '#33bdf1'; 
                      } else if(d.parent.name === "facebook"){
                        return '#627aad'; 
                      } else if(d.parent.name === "email"){
                        return '#bbdd73'; 
                      }
                    })
                    .each(function(d) { this._current = updateArc(d); })
                    .on("click", zoomIn);
            // Now redefine the value function to use the previously-computed sum.
            function zoomIn(p) {
              while(p.parent){
                p = p.parent;
              }
              // if (p.depth > 1) p = p.parent;
              // if (!p.children) return;
              zoom(p, p);
            }

            function zoom(root, p) {
                if (document.documentElement.__transition__) return;

                center.datum(root);

                partition
                    .value(function(d) { 
                      if(d.parent.name === "email"){
                        d.size += 2000;
                        return d.size; 
                      } else if(d.parent.name === "google"){
                        if(d.size - 500 > 0){
                          d.size -= 500;
                        }
                        return d.size;
                      } else if(d.parent.name === "youtube"){
                        if(d.size - 500 > 0){
                          d.size -= 500;
                        }
                        return d.size;
                      } else if(d.parent.name === "twitter"){
                        d.size += 1350;
                        return d.size;
                      } else if(d.parent.name === "facebook"){
                        if(d.size - 500 > 0){
                          d.size -= 500;
                        }
                        return d.size;
                      }
                    })
                    .nodes(root)
                    .forEach(function(d) {
                      d._children = d.children;
                      d.sum = d.value;
                      d.key = key(d);
                      d.fill = fill(d);
                    });

                path = path.data(partition.nodes(root).slice(1), function(d) { return d.key; });

                d3.transition().duration(d3.event.altKey ? 7500 : 750).each(function() {

                  path.enter().append("path")
                      .style("fill-opacity", function(d) { return d.depth === 2 - (root === p) ? 1 : 0; })
                      .style("fill", function(d) { return d.fill; })
                      .on("click", zoomIn)
                      .each(function(d) { this._current = enterArc(d); });

                  path.transition()
                      .style("fill-opacity", 1)
                      .attrTween("d", function(d) { return arcTween.call(this, updateArc(d)); });
                });
              }

          });
        }

        jsonGetter("/data.json");
 
        function change(p){
          while(p.parent){
            p = p.parent;
          }

          jsonGetter("/data2.json");  
        }

        function key(d) {
          var k = [], p = d;
          while (p.depth) k.push(p.name), p = p.parent;
          return k.reverse().join(".");
        }

        function fill(d) {
          var p = d;
          while (p.depth > 1) p = p.parent;
          var c = d3.lab(hue(p.name));
          c.l = luminance(d.sum);
          return c;
        }

        function arcTween(b) {
          var i = d3.interpolate(this._current, b);
          this._current = i(0);
          return function(t) {
            return arc(i(t));
          };
        }

        function updateArc(d) {
          return {depth: d.depth, x: d.x, dx: d.dx};
        }

        d3.select(self.frameElement).style("height", margin.top + margin.bottom + "px");
























        // var dataset = {
        //   final: [],
        //   inner: [10000, 7000, 3000, 3000],
        //   outer: [3000, 4000, 4000, 4000, 1000, 7000, 1000]
        // };

        // var width = 1600,
        //     height = 800,
        //     cwidth = 100;

        // var color = d3.scale.category20();

        // var pie = d3.layout.pie()
        //     .sort(null);

        // var arc = d3.svg.arc();

        // var svg = d3.select("body").append("svg")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .append("g")
        //     .attr("class","wrapper")
        //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

        // var gs = svg.selectAll("g.wrapper").data(d3.values(dataset)).enter()
        //         .append("g")
        //         .attr("id",function(d,i){
        //             return Object.keys(dataset)[i];
        //         });

        // var gsLabels = svg.selectAll("g.wrapper").data(d3.values(dataset)).enter()
        //         .append("g")
        //         .attr("id",function(d,i){
        //             return "label_" + Object.keys(dataset)[i];
        //         });

        // var count = 0;
        // var path = gs.selectAll("path")
        //   .data(function(d) { return pie(d); })
        //   .enter().append("path")
        //   .attr("fill", function(d, i) { 
        //     console.log(i);
        //     console.log(d);
        //     console.log(color)
        //     return color(i); 
        //   })
        //   .attr("d", function(d, i, j) { 
        //     console.log("before: ")
        //     console.log(d);
        //       d._tmp = d.endAngle;
        //       d.endAngle = d.startAngle;

        //     console.log("after: ")
        //       console.log(d);
        //       if(Object.keys(dataset)[j] === "inner"){
        //           d.arc = d3.svg.arc().innerRadius(0).outerRadius(cwidth*(j+1.05)); 
        //       }
        //       else{
        //           d.arc = d3.svg.arc().innerRadius(10+cwidth*j).outerRadius(cwidth*(j+1.1)); 
        //       }
        //       return d.arc(d);
        //       })
        //   .transition().delay(function(d, i, j) {
        //           return i * 500; 
        //   }).duration(500)
        //   .attrTween('d', function(d,x,y) {
        //      var i = d3.interpolate(d.startAngle, d._tmp);
        //      return function(t) {
        //          d.endAngle = i(t);
        //        return d.arc(d);
        //      }
        //   });







          // var data = [
          //     {name: "A", val: 11975},  
          //     {name: "B", val: 5871}, 
          //     {name: "C", val: 8916}
          // ];

          // var w = 400,
          //     h = 400,
          //     r = Math.min(w, h) / 2,
          //     labelr = r + 30, // radius for label anchor
          //     color = d3.scale.category20(),
          //     donut = d3.layout.pie(),
          //     arc = d3.svg.arc().innerRadius(r * .6).outerRadius(r);

          // var vis = d3.select("body")
          //   .append("svg:svg")
          //     .data([data])
          //     .attr("width", w + 150)
          //     .attr("height", h);

          // var arcs = vis.selectAll("g.arc")
          //     .data(donut.value(function(d) { return d.val }))
          //   .enter().append("svg:g")
          //     .attr("class", "arc")
          //     .attr("transform", "translate(" + (r + 30) + "," + r + ")");

          // arcs.append("svg:path")
          //     .attr("fill", function(d, i) { return color(i); })
          //     .attr("d", arc);

          // arcs.append("svg:text")
          //     .attr("transform", function(d) {
          //         var c = arc.centroid(d),
          //             x = c[0],
          //             y = c[1],
          //             // pythagorean theorem for hypotenuse
          //             h = Math.sqrt(x*x + y*y);
          //         return "translate(" + (x/h * labelr) +  ',' +
          //            (y/h * labelr) +  ")"; 
          //     })
          //     .attr("dy", ".35em")
          //     .attr("text-anchor", function(d) {
          //         // are we past the center?
          //         return (d.endAngle + d.startAngle)/2 > Math.PI ?
          //             "end" : "start";
          //     })
          //     .text(function(d, i) { return d.value.toFixed(2); });
          // // http://stackoverflow.com/questions/8053424/label-outside-arc-pie-chart-d3-js
          // // https://github.com/mbostock/d3/issues/1124
















        // var data = [
        //   [11975,  5871, 8916, 2868],
        //   [ 1951, 10048, 2060, 6171]
        // ];

        // var number = 0;

        // // Define the margin, radius, and color scale. The color scale will be
        // // assigned by index, but if you define your data using objects, you could pass
        // // in a named field from the data object instead, such as `d.name`. Colors
        // // are assigned lazily, so if you want deterministic behavior, define a domain
        // // for the color scale.
        // var m = 0,
        //     r = 300,
        //     z = d3.scale.category20c();

        // // Insert an svg:svg element (with margin) for each row in our dataset. A
        // // child svg:g element translates the origin to the pie center.
        // var svg = d3.select("body").selectAll("svg")
        //     .data(data)
        //   .enter().append("svg:svg")
        //     .attr("width", (r + m) * 2)
        //     .attr("height", (r + m) * 2)
        //     .attr("class", function(){
        //       number++;
        //       return "class" + number;
        //     })
        //   .append("svg:g")
        //     .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

        // // The data for each svg:svg element is a row of numbers (an array). We pass
        // // that to d3.layout.pie to compute the angles for each arc. These start and end
        // // angles are passed to d3.svg.arc to draw arcs! Note that the arc radius is
        // // specified on the arc, not the layout.
        // svg.selectAll("path")
        //     .data(d3.layout.pie())
        //   .enter().append("svg:path")
        //     .attr("d", d3.svg.arc()
        //     .innerRadius(r / 2)
        //     .outerRadius(r))
        //     .style("fill", function(d, i) { return z(i); });















        // var dataset = {
        //   apples: [53245, 28479, 19697, 24037, 40245],
        //   oranges: [200, 200, 200, 200] // previously 5 values, now only 4
        // };

        // var width = 1600,
        //   height = 1000,
        //   radius = Math.min(width, height) / 2;

        // var enterAntiClockwise = {
        //   startAngle: Math.PI * 2,
        //   endAngle: Math.PI * 2
        // };

        // var color = d3.scale.category20();

        // var pie = d3.layout.pie()
        //   .sort(null);

        // var arc = d3.svg.arc()
        //   .innerRadius(radius - 500)
        //   .outerRadius(radius - 20);

        // var svg = d3.select("body").append("svg")
        //   .attr("width", width)
        //   .attr("height", height)
        //   .append("g")
        //   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // var path = svg.selectAll("path")
        //   .data(pie(dataset.apples))
        //   .enter().append("path")
        //   .attr("fill", function(d, i) { return color(i); })
        //   .attr("d", arc)
        //   .each(function(d) { this._current = d; }); // store the initial values

        // d3.selectAll("input").on("change", change);

        // var timeout = setTimeout(function() {
        //   d3.select("input[value=\"oranges\"]").property("checked", true).each(change);
        // }, 2000);

        // function change() {
        //   clearTimeout(timeout);
        //   path = path.data(pie(dataset[this.value])); // update the data
        //   // set the start and end angles to Math.PI * 2 so we can transition
        //   // anticlockwise to the actual values later
        //   path.enter().append("path")
        //       .attr("fill", function (d, i) {
        //         return color(i);
        //       })
        //       .attr("d", arc(enterAntiClockwise))
        //       .each(function (d) {
        //         this._current = {
        //           data: d.data,
        //           value: d.value,
        //           startAngle: enterAntiClockwise.startAngle,
        //           endAngle: enterAntiClockwise.endAngle
        //         };
        //       }); // store the initial values

        //   path.exit()
        //       .transition()
        //       .duration(750)
        //       .attrTween('d', arcTweenOut)
        //       .remove() // now remove the exiting arcs

        //   path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
        // }

        // // Store the displayed angles in _current.
        // // Then, interpolate from _current to the new angles.
        // // During the transition, _current is updated in-place by d3.interpolate.
        // function arcTween(a) {
        //   var i = d3.interpolate(this._current, a);
        //   this._current = i(0);
        //   return function(t) {
        //   return arc(i(t));
        //   };
        // }
        // // Interpolate exiting arcs start and end angles to Math.PI * 2
        // // so that they 'exit' at the end of the data
        // function arcTweenOut(a) {
        //   var i = d3.interpolate(this._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0});
        //   this._current = i(0);
        //   return function (t) {
        //     return arc(i(t));
        //   };
        // }

      }
    };
  }]);

}());
