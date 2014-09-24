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
        var svg = d3.select(iElement[0])
            .append("svg")
            .attr("width", "100%")
            .attr('height', 450)

        // on window resize, re-render d3 canvas
        window.onresize = function() {
          return scope.$apply();
        };
        scope.$watch(function(){
            return angular.element(window)[0].innerWidth;
          }, function(){
            return scope.render(scope.data);
          }
        );

        // watch for data changes and re-render
        scope.$watch('data', function(newVals, oldVals) {
          return scope.render(newVals);
        }, true);

        // define render function
        scope.render = function(data){
          // remove all previous items before render
          svg.selectAll("*").remove();
          // setup variables

          var width = 600,
              height = 400,
              padding = 1.5, // separation between same-color nodes
              clusterPadding = 6, // separation between different-color nodes
              maxRadius = 12;

          var m = 5; // number of distinct clusters

          var color = d3.scale.category10()
              .domain(d3.range(m));

          // The largest node for each cluster.
          var clusters = new Array(m);
          console.log(data);
          var nodes = data.map(function(data) {
            var i = Math.floor(Math.random() * m),
              r = data.score * 1, 
              d = {
                cluster: i,
                radius: r,
                x: (function(){
                  return Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random()
                })(),
                y: (function(){
                  return Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
                })(),
                name: data.name,
                score: (function(){
                  return data.score;
                })(),
                theaters: (function(){
                  return data.theaters
                })()
              }
            if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
            return d;
          })

          var force = d3.layout.force()
              .nodes(nodes)
              .size([width, height])
              .gravity(.02)
              .charge(0)
              .on("tick", tick)
              .start();

          var node = svg.selectAll("circle")
              .data(nodes)
            .enter().append("circle")
              .style("fill", function(d) { return color(d.cluster); })
              .call(force.drag)
              .on("mouseover", function(d, i){
                // console.log(d.name);
              })
              .on("mouseover", mouseover)
              .on("mousemove", function(d){
                mousemove(d);
              })
              .on("mouseout", mouseout)

          var div = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("opacity", 1);

          function mouseover() {
            div.transition()
                .duration(500)
                .style("opacity", 1);
          }

          function mousemove(d) {
            div
                .text(d.name)
                .style("left", (d3.event.pageX - 50) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
          }

          function mouseout() {
            div.transition()
                .duration(500)
                .style("opacity", 0);
          }

          node.transition()
              .duration(750)
              .delay(function(d, i) { return i * 5; })
              .attrTween("r", function(d) {
                var i = d3.interpolate(0, d.radius);
                return function(t) { return d.radius = i(t); };
              });

          function tick(e) {
            node
                .each(cluster(10 * e.alpha * e.alpha))
                .each(collide(.5))
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
          }

          // Move d to be adjacent to the cluster node.
          function cluster(alpha) {
            return function(d) {
              var cluster = clusters[d.cluster];
              if (cluster === d) return;
              var x = d.x - cluster.x,
                  y = d.y - cluster.y,
                  l = Math.sqrt(x * x + y * y),
                  r = d.radius + cluster.radius;
              if (l != r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                cluster.x += x;
                cluster.y += y;
              }
            };
          }

          // Resolves collisions between d and all other circles.
          function collide(alpha) {
            var quadtree = d3.geom.quadtree(nodes);
            return function(d) {
              var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                  nx1 = d.x - r,
                  nx2 = d.x + r,
                  ny1 = d.y - r,
                  ny2 = d.y + r;
              quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                  var x = d.x - quad.point.x,
                      y = d.y - quad.point.y,
                      l = Math.sqrt(x * x + y * y),
                      r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                  if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                  }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
              });
            };
          }
        };
      }
    };
  }]);

}());
