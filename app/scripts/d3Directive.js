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

        /***** WORKING LABELS UPDATES ON THE FLY *****/
        // var svg = d3.select("body")
        //   .append("svg")
        //   .append("g")

        // svg.append("g")
        //   .attr("class", "slices");
        // svg.append("g")
        //   .attr("class", "labels");
        // svg.append("g")
        //   .attr("class", "lines");

        // var width = 960,
        //     height = 450,
        //   radius = Math.min(width, height) / 2;

        // var pie = d3.layout.pie()
        //   .sort(null)
        //   .value(function(d) {
        //     return d.value;
        //   });

        // var arc = d3.svg.arc()
        //   .outerRadius(radius * 0.8)
        //   .innerRadius(radius * 0.4);

        // var outerArc = d3.svg.arc()
        //   .innerRadius(radius * 0.9)
        //   .outerRadius(radius * 0.9);

        // svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // var key = function(d){ return d.data.label; };

        // var color = d3.scale.category20()
        //   .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
        //   //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        // var randomNumber = function(){
        //   return Math.floor(Math.random() * 20000) + 1000
        // }

        // var data = [
        //   {"name": "organic", "size": randomNumber(), "parent": "facebook"},
        //   {"name": "match", "size": randomNumber(), "parent": "facebook"},
        //   {"name": "fundsAdded", "size": randomNumber(), "parent": "facebook"}
        // ]

        // function randomData (){
        //   return data.map(function(a){
        //     return {label: a.name, value: randomNumber(), parent: a.parent}
        //   }).sort(function(a,b) {
        //     return d3.ascending(a.label, b.label);
        //   });
        // }

        // change(randomData());

        // d3.select(".randomize")
        //   .on("click", function(){
        //     change(randomData());
        //   });

        // function mergeWithFirstEqualZero(first, second){
        //   var secondSet = d3.set(); second.forEach(function(d) { secondSet.add(d.label); });

        //   var onlyFirst = first
        //     .filter(function(d){ return !secondSet.has(d.label) })
        //     .map(function(d) { return {label: d.label, value: 0}; });
        //   return d3.merge([ second, onlyFirst ])
        //     .sort(function(a,b) {
        //       return d3.ascending(a.label, b.label);
        //     });
        // }

        // function change(data) {
        //   var duration = +document.getElementById("duration").value;
        //   var data0 = svg.select(".slices").selectAll("path.slice")
        //     .data().map(function(d) { return d.data });
        //   if (data0.length == 0) data0 = data;
        //   var was = mergeWithFirstEqualZero(data, data0);
        //   var is = mergeWithFirstEqualZero(data0, data);

        //   /* ------- SLICE ARCS -------*/

        //   var slice = svg.select(".slices").selectAll("path.slice")
        //     .data(pie(was), key);

        //   slice.enter()
        //     .insert("path")
        //     .attr("class", "slice")
        //     .style("fill", function(d) { return color(d.data.label); })
        //     .each(function(d) {
        //       this._current = d;
        //     });

        //   slice = svg.select(".slices").selectAll("path.slice")
        //     .data(pie(is), key);

        //   slice   
        //     .transition().duration(duration)
        //     .attrTween("d", function(d) {
        //       var interpolate = d3.interpolate(this._current, d);
        //       var _this = this;
        //       return function(t) {
        //         _this._current = interpolate(t);
        //         return arc(_this._current);
        //       };
        //     });

        //   slice = svg.select(".slices").selectAll("path.slice")
        //     .data(function(){
        //       return pie(data);
        //     }, key);

        //   slice
        //     .exit().transition().delay(duration).duration(0)
        //     .remove();

        //   /* ------- TEXT LABELS -------*/

        //   var text = svg.select(".labels").selectAll("text")
        //     .data(pie(was), key);

        //   text.enter()
        //     .append("text")
        //     .attr("dy", ".35em")
        //     .style("opacity", 0)
        //     .text(function(d) {
        //       return d.data.label;
        //     })
        //     .each(function(d) {
        //       this._current = d;
        //     });
          
        //   function midAngle(d){
        //     return d.startAngle + (d.endAngle - d.startAngle)/2;
        //   }

        //   text = svg.select(".labels").selectAll("text")
        //     .data(pie(is), key);

        //   text.transition().duration(duration)
        //     .style("opacity", function(d) {
        //       return d.data.value == 0 ? 0 : 1;
        //     })
        //     .attrTween("transform", function(d) {
        //       var interpolate = d3.interpolate(this._current, d);
        //       var _this = this;
        //       return function(t) {
        //         var d2 = interpolate(t);
        //         _this._current = d2;
        //         var pos = outerArc.centroid(d2);
        //         pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
        //         return "translate("+ pos +")";
        //       };
        //     })
        //     .styleTween("text-anchor", function(d){
        //       var interpolate = d3.interpolate(this._current, d);
        //       return function(t) {
        //         var d2 = interpolate(t);
        //         return midAngle(d2) < Math.PI ? "start":"end";
        //       };
        //     });
          
        //   text = svg.select(".labels").selectAll("text")
        //     .data(pie(data), key);

        //   text
        //     .exit().transition().delay(duration)
        //     .remove();

        //   /* ------- SLICE TO TEXT POLYLINES -------*/

        //   var polyline = svg.select(".lines").selectAll("polyline")
        //     .data(pie(was), key);
          
        //   polyline.enter()
        //     .append("polyline")
        //     .style("opacity", 0)
        //     .each(function(d) {
        //       this._current = d;
        //     });

        //   polyline = svg.select(".lines").selectAll("polyline")
        //     .data(pie(is), key);
          
        //   polyline.transition().duration(duration)
        //     .style("opacity", function(d) {
        //       return d.data.value == 0 ? 0 : .5;
        //     })
        //     .attrTween("points", function(d){
        //       this._current = this._current;
        //       var interpolate = d3.interpolate(this._current, d);
        //       var _this = this;
        //       return function(t) {
        //         var d2 = interpolate(t);
        //         _this._current = d2;
        //         var pos = outerArc.centroid(d2);
        //         pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        //         return [arc.centroid(d2), outerArc.centroid(d2), pos];
        //       };      
        //     });
          
        //   polyline = svg.select(".lines").selectAll("polyline")
        //     .data(pie(data), key);
          
        //   polyline
        //     .exit().transition().delay(duration)
        //     .remove();
        // };



        /***** WORKING MULTI-LAYER PIE CHART (UPDATES ON THE FLY) *****/

        var margin = {top: 350, right: 480, bottom: 350, left: 480},
            radius = Math.min(margin.top, margin.right, margin.bottom, margin.left) - 10;

        var svg = d3.select("body").append("svg")
            .attr("width", margin.left + margin.right)
            .attr("height", margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        svg.append("g")
            .attr("class", "labels");

        var partition = d3.layout.partition()
            .sort(function(a, b) { return d3.ascending(a.name, b.name); })
            .size([2 * Math.PI, radius]);

        var arc = d3.svg.arc()
            .startAngle(function(d) { return d.x; })
            .endAngle(function(d) { return d.x + d.dx - .01 / (d.depth + .5); })
            .innerRadius(function(d) { 
              if(d.depth == 2){
                return radius / 2.5 * d.depth; 
              } else {
                return 0;
              }
            })
            .outerRadius(function(d) { 
              if(d.depth == 2){
                return radius / 3 * (d.depth + 1) - 1; 
              } else {
                return radius / 2.50 * (d.depth + 1) - 1; 
              }
            });

          var outerArc = d3.svg.arc()
            .startAngle(function(d) { return d.x; })
            .endAngle(function(d) { return d.x + d.dx - .01 / (d.depth + .5); })
            .innerRadius(radius / 3)
            .outerRadius(radius / 3);

          d3.json("/data.json", function(error, root) {

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
                    .on("click", zoomIn)

                    // var text = svg.select(".labels").selectAll("text")
                    //     .data(partition.nodes(root).slice(1));

                    // text.enter()
                    //   .append("text")
                    //   .attr("dy", ".35em")
                    //   .style("opacity", 0)
                    //   .text(function(d) {
                    //     return d.name;
                    //   })
                    //   .each(function(d) {
                    //     this._current = d;
                    //   });
                    
                    // function midAngle(d){
                    //   debugger;
                    //   return d.startAngle + (d.endAngle - d.startAngle)/2;
                    // }

                    // text = svg.select(".labels").selectAll("text")
                    //     .data(partition.nodes(root).slice(1));

                    // text.transition().duration(500)
                    //   .style("opacity", function(d) {
                    //     return d.size == 0 ? 0 : 1;
                    //   })

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

        function key(d) {
          var k = [], p = d;
          while (p.depth) k.push(p.name), p = p.parent;
          return k.reverse().join(".");
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



      /**** END ****/

      }
    };
  }]);

}());
