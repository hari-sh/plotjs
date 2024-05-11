   // Add one dot in the legend for each name.
   svg.selectAll("mydots")
   .data(keys)
   .enter()
   .append("circle")
     .attr("cx", 100)
     .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
     .attr("r", 7)
     .style("fill", function(d){ return color(d)})
 
 // Add one dot in the legend for each name.
 svg.selectAll("mylabels")
   .data(keys)
   .enter()
   .append("text")
     .attr("x", 120)
     .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
     .style("fill", function(d){ return color(d)})
     .text(function(d){ return d})
     .attr("text-anchor", "left")
     .style("alignment-baseline", "middle")
