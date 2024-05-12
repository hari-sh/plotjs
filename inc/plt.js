function getcor(xy, rmin, rmax, tickSize, orient){
    const cor = {
        max : Math.max.apply(null,
            data.map(datum => { return Math.max.apply(null, 
                datum.val.map(o => { return o[xy]; }))})),
        
        min : Math.min.apply(null,
            data.map(datum => { return Math.min.apply(null, 
                datum.val.map(o => { return o[xy]; }))}))
    };
    cor.pad = (cor.max - cor.min)/10;

    cor.val = d3.scale.linear()
        .domain([cor.min-cor.pad, cor.max+cor.pad])
        .range([rmin, rmax]);
    
    cor.axis = d3.svg.axis()
        .scale(cor.val)
        .tickPadding(10)
        // .tickSize(tickSize)
        // .tickSubdivide(true)
        .orient(orient);
    return cor;
}

function getline(xval, yval) {
    return d3.svg.line()
        .interpolate('linear')	
        .x(function(d) { return xval(d.x); })
        .y(function(d) { return yval(d.y); });
}


function addlabel(svg, options) {
    svg.append('g')
        .attr('class', 'y axis')
        .append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -options.margin.left + 10)
        .attr('x', -options.height/2)
        .text(options.ylabel);
        
    svg.append('g')
        .attr('class', 'x axis')
        .append('text')
        .attr('class', 'axis-label')
        .attr('y', options.height+ options.margin.bottom)
        .attr('text-anchor', 'middle')
        .attr('x', options.width/2)
        .text(options.xlabel);

    svg.append('g')
        .attr('class', 'title')
        .append('text')
        .attr('y', -options.margin.top/2)
        .attr('x', options.width/2)
        .attr('text-anchor', 'middle')
        .text(options.title);
}

function addlegend(svg, keys){    
    const color = d3.scale.ordinal()
      .domain(keys)
      .range(colors);
    
      var legend = svg.selectAll(".legend")
      .data(keys)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("line")//making a line for legend
      .attr("x1", width - 40)
      .attr("x2", width - 5)
      .attr("y1", 15)
      .attr("y2", 15)
      .style("stroke", color);

      legend.append("text")
      .attr("x", width - 44)
      .attr("y", 14)
      .attr("dy", ".35em")
      .attr("class", "legend_text")
      .style("text-anchor", "end")
      .style("fill", function(d){ return color(d)})
      .text(function(d) { return d; });
}

function constructsvg(x, y, data, colors, options) {  
    const body = d3.select('body').append('svg');
        
    body.attr('width', options.width + options.margin.left + options.margin.right);
    body.attr('height', options.height + options.margin.top + options.margin.bottom);  

    const svg = d3.select('svg').append('g')
        .attr('transform', 'translate(' + options.margin.left + ',' + options.margin.top + ')')

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + options.height + ')')
        .call(xcor.axis);
    
    svg.append('g')
        .attr('class', 'y axis')
        .call(ycor.axis);
    
    /* for erasing plot outside svg */
    svg.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', options.width)
        .attr('height', options.height);

        body.call(d3.behavior.zoom()
            .x(xcor.val)
            .y(ycor.val)
            .scaleExtent([0, Infinity])
            .on('zoom', () => {
                svg.select('.x.axis').call(xcor.axis);
                svg.select('.y.axis').call(ycor.axis);   
                svg.selectAll('path.line').attr('d', line);
            
                points.selectAll('circle').attr('transform', function(d) { 
                    return 'translate(' + xcor.val(d.point.x) + ',' + ycor.val(d.point.y) + ')'; }
            );})
        );
    
    var points = svg.selectAll('.dots')
    .data(data.map(o=> {return o.val}))
    .enter()
    .append('g')
    .attr('class', 'dots')
    .attr('clip-path', 'url(#clip)');	
 
    points.selectAll('.dot')
        .data(function(d, index){ 		
            var a = [];
            d.forEach(function(point){
                a.push({'index': index, 'point': point});
            });		
            return a;
        })
        .enter()
        .append('circle')
        .attr('class','dot')
        .attr('r', 2.5)
        .attr('fill', function(d){ 	
            return colors[d.index%colors.length];
        })
        .attr('transform', function(d) { 
            return 'translate(' + x(d.point.x) + ',' + y(d.point.y) + ')'; }
    );

    svg.selectAll('.line')
        .data(data.map(o=> {return o.val}))
        .enter()
        .append('path')
        .attr('class', 'line')
        .attr('clip-path', 'url(#clip)')
        .attr('stroke', function(d,i){ 			
            return colors[i%colors.length];
        })
        .attr('d', line);

    addlabel(svg, options);
    addlegend(svg, data.map(o => o.name));
}

const colors = d3.scale.category10().range();

const xcor = getcor('x', 0, width, -height, 'bottom');
const ycor = getcor('y', height, 0, -width, 'left');
const line = getline(xcor.val, ycor.val);
console.log();
constructsvg(xcor.val, ycor.val, data, colors, opts);


