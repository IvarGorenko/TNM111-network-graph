var width = 800, height = 500
var clickState = 0;

var nodes = [];
var links = [];

var nodes1 = [
	{name: 'A'},
	{name: 'B'},
	{name: 'C'},
	{name: 'D'},
	{name: 'E'},
	{name: 'F'},
	{name: 'G'},
	{name: 'Hdsadf'},
]

var links1 = [
	{source: 0, target: 1},
	{source: 0, target: 2},
	{source: 0, target: 3},
	{source: 1, target: 6},
	{source: 3, target: 4},
	{source: 3, target: 7},
	{source: 4, target: 5},
	{source: 4, target: 7}
]

var starWarsData = "starwars";

d3.json("/starwars-interactions/starwars-episode-1-interactions-allCharacters.json",).then(function(data){
	starWarsData = data;
	console.log(starWarsData);
	nodes = starWarsData.nodes;
	links = starWarsData.links;
	var simulation = d3.forceSimulation(nodes)
	.force('charge', d3.forceManyBody().strength(-300))
	.force('center', d3.forceCenter(width / 2, height / 2))
	.force('link', d3.forceLink().links(links))
	.on('tick', ticked);
});


var simulation1 = d3.forceSimulation(nodes1)
.force('charge', d3.forceManyBody().strength(-100))
.force('center', d3.forceCenter(width / 2, height / 2))
.force('link', d3.forceLink().links(links1))
.on('tick', ticked);

function updateLinks() {
	var u = d3.select('.links')
		.selectAll('line')
		.data(links)
		.join('line')
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

    var v = d3.select('.links1')
		.selectAll('line')
		.data(links1)
		.join('line')
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

function updateNodes() {
	u = d3.select('.nodes')
		.selectAll('circle')
		.data(nodes)
		.join('circle')
		.attr('r', function(d){
			return d.value*0.5;
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

		u.on("click", function() {
			var clickedNode = d3.select(this).attr("name")
			console.log("Clicked: " + clickedNode);
			console.log(clickState)
			u.attr("opacity", function(d) {
				if (clickState == 0) { // TODO: states funkar inte...
					clickState = 1;
					return (d.name == clickedNode) ? 1 : 0.3;
				} 
				else {
					clickState = 0;
					return 1;
				}
					
			});
		});

    v = d3.select('.nodes1')
		.selectAll('text')
		.data(nodes1)
		.join('text')
		.text(function(d) {
			return d.name
		})
		.attr('x', function(d) {
			return d.x
		})
		.attr('y', function(d) {
			return d.y
		})
		.attr('dy', function(d) {
			return 5
		});
}

function ticked() {
	updateLinks()
	updateNodes()
}