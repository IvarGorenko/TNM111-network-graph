var width = 800, height = 500
var clickedNode;

var nodes = [];
var links = [];

var nodes2 = [];
var links2 = [];

var Tooltip = d3.select(".container")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

var starWarsData1 = "starwars";


d3.json("/starwars-interactions/starwars-episode-2-interactions-allCharacters.json",).then(function(data){
	starWarsData1 = data;
	console.log(starWarsData1);
	nodes = starWarsData1.nodes;
	links = starWarsData1.links;
	var simulation = d3.forceSimulation(nodes)
	.force('charge', d3.forceManyBody().strength(-300))
	.force('center', d3.forceCenter(width / 2, height / 2))
	.force('link', d3.forceLink().links(links))
	.on('tick', function(d) {
		ticked('.nodes',nodes,'.links',links);
	})
});

var starWarsData2 = "starwars";

d3.json("/starwars-interactions/starwars-episode-1-interactions-allCharacters.json",).then(function(data){
	starWarsData2 = data;
	console.log(starWarsData2);
	nodes2 = starWarsData2.nodes;
	links2 = starWarsData2.links;
	var simulation = d3.forceSimulation(nodes2)
	.force('charge', d3.forceManyBody().strength(-300))
	.force('center', d3.forceCenter(width / 2, height / 2))
	.force('link', d3.forceLink().links(links2))
	.on('tick', function(d) {
		ticked('.nodes2',nodes2,'.links2',links2);
		})
});


function updateLinks(links_name,lnk) {
	u = d3.select(links_name)
		.selectAll('line')
		.data(lnk)
		.join('line')
		.style('stroke-width',function(d){
			return d.value;
		})
		.attr('stroke','#000000')
		.attr('opacity',0.5)
		.attr('x1', function(d) {
			return d.source.x
		})
		.attr('y1', function(d) {
			return d.source.y
		})
		.attr('x2', function(d) {
			return d.target.x
		})
		.attr('y2', function(d) {
			return d.target.y
		});
}

function updateNodes(nodes_name,nd,lnk) {
	var u = d3.select(nodes_name) 
		.selectAll('circle')
		.data(nd)
		.join('circle')
		.attr('r', function(d){
			return d3.max([d.value*0.7,5]);
		})
		.attr('fill',function(d){
			return d.colour
		})
		.attr('cx', function(d) {
			return d.x
		})
		.attr('cy', function(d) {
			return d.y
		})
		.attr('name', function(d) {
			return d.name
		})
		.attr('value',function(d){
			return d.value
		})
		.on("click", function() {
			if (clickedNode != d3.select(this).attr('name')) {
				clickedNode = d3.select(this).attr('name')
				
				//node opacity 
				d3.selectAll('circle')
				.attr("opacity", function(d) {
					return (d.name === clickedNode) ? 1 : 0.5;
				});
				
				console.log(d3.selectAll('circle'));
				//link opacity
				var nodeColor = d3.select(this).attr('fill');
				d3.selectAll('line').attr('stroke', function(d){
					return '#000000';//nodeColor
				})

			} else {
				clickedNode = ""

				//node opacity 
				d3.selectAll('circle')
				.attr("opacity", function() {
					return 1
				});
				
				//link opacity
				var nodeColor = d3.select(this).attr('fill');
				d3.selectAll('line').attr('stroke','#000000')


			}
		})
		.on("mouseover", function() {
			Tooltip.style('opacity', 1)
			d3.select(this)
			.style("stroke", "black")
		})
		.on("mousemove", function() {
			Tooltip.html("Name of character: " + d3.select(this).attr('name') + "<br> Scene appearances: " + d3.select(this).attr('value'))
			
		})
		.on("mouseleave", function() {
			Tooltip.style("opacity", 0)
			d3.select(this)
			.style("stroke", "none")
		});
}

function ticked(nodes_name,nd,links_name,lnk) {
	updateLinks(links_name,lnk)
	updateNodes(nodes_name,nd,lnk)
}