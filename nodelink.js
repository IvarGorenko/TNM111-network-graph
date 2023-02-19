var width = 1000, height = 1000
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
	.style("position", "absolute")
    .style("padding", "5px");

var zoom1 = d3.select("#svg1").style("transform", "scale(1)")
var zoom2 = d3.select("#svg2").style("transform", "scale(1)")
	
var filepath1 = "/starwars-interactions/starwars-full-interactions-allCharacters.json";

var showEpisode = [true,false,false,false,false,false,false,false,true,false,false,false,false,false];
//var showEpisode = [true,true,true,true,true,true,true,true,true,true,true,true,true,true];

var mergedData1 = {
	nodes: [],
	links: []
};
var mergedData2 = {
	nodes: [],
	links: []
};

function loadData(){	
	d3.selectAll("circle").remove();
	d3.selectAll("line").remove();
	Promise.all([
		d3.json("/starwars-interactions/starwars-episode-1-interactions-allCharacters.json"),
		d3.json("/starwars-interactions/starwars-episode-2-interactions-allCharacters.json"),
		d3.json("/starwars-interactions/starwars-episode-3-interactions-allCharacters.json"),
		d3.json("/starwars-interactions/starwars-episode-4-interactions-allCharacters.json"),
		d3.json("/starwars-interactions/starwars-episode-5-interactions-allCharacters.json"),
		d3.json("/starwars-interactions/starwars-episode-6-interactions-allCharacters.json"),
		d3.json("/starwars-interactions/starwars-episode-7-interactions-allCharacters.json")
	]).then(function(data){
		for(var episode = 0;episode < 7;episode++){
			if(showEpisode[episode]){
				//nodes 
				data[episode].nodes.forEach(node => {
					node_found = mergedData1.nodes.findIndex((elem) =>{
						return elem.name === node.name;
					})
					if(node_found === -1){
						mergedData1.nodes.push(node);
					}else{
						mergedData1.nodes[node_found].value += node.value;
					}
				});
				// links 
				data[episode].links.forEach(link =>{

					link_source = mergedData1.nodes.findIndex((elem) =>{ 
						return elem.name === data[episode].nodes[link.source].name;
					})
					link_target = mergedData1.nodes.findIndex((elem) =>{ 
						return elem.name === data[episode].nodes[link.target].name;
					})
					link_found = mergedData1.links.findIndex((elem) =>{
						return (elem.source === link_source && elem.target === link_target) || (elem.source === link_target && elem.target === link_source);
					})
					//console.log(link_source);
					//console.log(link_target);
					if(link_found === -1){
						mergedData1.links.push({
							"source": link_source,
							"target": link_target,
							"value": link.value
						});
					}else{
						mergedData1.links[link_found].value += link.value;
					}
				})
			}
			if(showEpisode[7+episode]){
				//nodes 
				data[episode].nodes.forEach(node => {
					node_found = mergedData2.nodes.findIndex((elem) =>{
						return elem.name === node.name;
					})
					if(node_found === -1){
						mergedData2.nodes.push(node);
					}else{
						mergedData2.nodes[node_found].value += node.value;
					}
				});
				// links 
				data[episode].links.forEach(link =>{

					link_source = mergedData2.nodes.findIndex((elem) =>{ 
						return elem.name === data[episode].nodes[link.source].name;
					})
					link_target = mergedData2.nodes.findIndex((elem) =>{ 
						return elem.name === data[episode].nodes[link.target].name;
					})
					link_found = mergedData2.links.findIndex((elem) =>{
						return (elem.source === link_source && elem.target === link_target) || (elem.source === link_target && elem.target === link_source);
					})
					//console.log(link_source);
					//console.log(link_target);
					if(link_found === -1){
						mergedData2.links.push({
							"source": link_source,
							"target": link_target,
							"value": link.value
						});
					}else{
						mergedData2.links[link_found].value += link.value;
					}
				})
			}
		}
		console.log(mergedData1);
		nodes = mergedData1.nodes;
		links = mergedData1.links;
		var simulation = d3.forceSimulation(nodes)
		.force('charge', d3.forceManyBody().strength(-300))
		.force('center', d3.forceCenter(width / 2, height / 2))
		.force('link', d3.forceLink().links(links))
		.on('tick', function(d) {
			ticked('.nodes',nodes,'.links',links);
		})

		console.log(mergedData2);
		nodes2 = mergedData2.nodes;
		links2 = mergedData2.links;
		var simulation = d3.forceSimulation(nodes2)
		.force('charge', d3.forceManyBody().strength(-100))
		.force('center', d3.forceCenter(width / 2, height / 2))
		.force('link', d3.forceLink().links(links2))
		.on('tick', function(d) {
			ticked('.nodes2',nodes2,'.links2',links2);
		})
	})
}
/*
var starWarsData1 = "starwars";
d3.json("/starwars-interactions/starwars-episode-1-interactions-allCharacters.json",).then(function(data){
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
var filepath2 = "/starwars-interactions/starwars-full-interactions-allCharacters.json";
d3.json(filepath2,).then(function(data){
	starWarsData2 = data;
	console.log(starWarsData2);
	nodes2 = starWarsData2.nodes;
	links2 = starWarsData2.links;
	//console.log(links2)
	var simulation = d3.forceSimulation(nodes2)
	.force('charge', d3.forceManyBody().strength(-100))
	.force('center', d3.forceCenter(width / 2, height / 2))
	.force('link', d3.forceLink().links(links2))
	.on('tick', function(d) {
		ticked('.nodes2',nodes2,'.links2',links2);
		})
});
*/

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
		})
		.attr('value', function(d) {
			return d.value
		})
		.attr('source', function(d) {
			return d.source.name
		})
		.attr('target', function(d) {
			return d.target.name
		})
		.on("mouseover", function() {
			Tooltip.style('opacity', 1)
			d3.select(this)
			.style("stroke-width", function(d) {
				return d3.max([d.value*3,10]);
			})
		})
		.on("mousemove", function(d) {
			Tooltip.html(d3.select(this).attr("source") + " and "+ d3.select(this).attr("target") +" appear in <br>" + d3.select(this).attr("value") + " scene(s) together")
			.style("left", d.pageX + 20 + "px")
      		.style("top", d.pageY - 100 + "px")
		})
		.on("mouseleave", function() {
			Tooltip.style("opacity", 0)
			d3.select(this)
			.style('stroke-width',function(d){
				return d.value;
			})
		});
		
}

function updateNodes(nodes_name,nd) {
	var u = d3.select(nodes_name) 
		.selectAll('circle')
		.data(nd)
		.join('circle')
		.attr('r', function(d){
			return d3.max([d.value*0.1,5]);
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
				
				//link Color
				var nodeColor = d3.select(this).attr('fill');
				d3.selectAll('line').attr('stroke', function(d){
					if(d.source.name === clickedNode || d.target.name === clickedNode){
						return nodeColor;
					}
				})

			} else {
				clickedNode = ""

				//node opacity 
				d3.selectAll('circle')
				.attr("opacity", function() {
					return 1
				});
				
				//link color
				d3.selectAll('line').attr('stroke','#000000');
			}
		})
		.on("mouseover", function() {
			Tooltip.style('opacity', 1)
			d3.select(this)
			.style("stroke", "black")
		})
		.on("mousemove", function(d) {
			Tooltip.html(d3.select(this).attr('name') + " has " + d3.select(this).attr('value') + " scene apperaences")
			.style("left", d.pageX + 20 + "px")
      		.style("top", d.pageY - 100 + "px")
		})
		.on("mouseleave", function() {
			Tooltip.style("opacity", 0)
			d3.select(this)
			.style("stroke", "none")
		});
}

function ticked(nodes_name,nd,links_name,lnk) {
	updateLinks(links_name,lnk)
	updateNodes(nodes_name,nd)
}

function checkbox(checkbox) {
	index = Number(checkbox.id);
	showEpisode[index] = !showEpisode[index]
	loadData();
}

function zoom(slider) {
	if (slider.id === "slider1") {
		zoom1.style("transform", "scale(" + slider.value + ")")
	} else {
		zoom2.style("transform", "scale(" + slider.value + ")")
	}
}