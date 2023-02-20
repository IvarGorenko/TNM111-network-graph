var width = 2000, height = 1200
var clickedNode = "";
var nodeColor = "#000000";

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

let zoom1 = d3.zoom()
	.on('zoom', handleZoom)
	.scaleExtent([0.5, 1.5])
	.translateExtent([[0, 0], [width * 3, height * 3]]);
  
  let zoom2 = d3.zoom()
	  .on('zoom', handleZoom)
	  .scaleExtent([0.5, 1.5])
	  .translateExtent([[0, 0], [width * 3, height * 3]]);
  
  
  
  function handleZoom(e) {
	//console.log(e);
	  // console.log(e.sourceEvent.target.id);
	  if (e.sourceEvent.target.id === "svg1") {
		  d3.select('.nodes')
			  .attr('transform', e.transform);
		  d3.select('.links')
			  .attr('transform', e.transform);
	  } else if (e.sourceEvent.target.id === "svg2") {
			d3.select('.nodes2')
				.attr('transform', e.transform);
			d3.select('.links2')
				.attr('transform', e.transform);
	  } else {
		  return
	  }
  }
  
  function initZoom() {
	d3.selectAll('svg')
	  .call(zoom1)
	  .call(zoom1.transform, d3.zoomIdentity.scale(0.5))
	  .call(zoom2)
	  .call(zoom2.transform, d3.zoomIdentity.scale(0.5))
	  .on("dblclick.zoom", null);
  
  }
	
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

var simulation1 = d3.forceSimulation(nodes);
var simulation2 = d3.forceSimulation(nodes2);

var min_appearences_thr1 = 0;
var min_appearences_thr2 = 0;  
function loadData(){	
	d3.selectAll("g").selectChildren().remove();
	simulation1.stop();
	simulation2.stop();

	mergedData1.nodes = [];
	mergedData1.links = [];
	
	mergedData2.nodes = [];
	mergedData2.links = [];

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
				//nodes for first graph 
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

			}
			if(showEpisode[7+episode]){
				//nodes for second graph 
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
	
			}
		}

		//Filtering 1  
		var slider1 =  document.getElementById("filterslider1")
		slider1.max = Math.max.apply(Math, mergedData1.nodes.map(function(node) {return node.value}))
		//console.log(slider1);
		mergedData1.nodes = mergedData1.nodes.filter((node)=>{
			if (node.value < min_appearences_thr1){
				console.log("remove node");
			}
			return node.value >= min_appearences_thr1;
		})

		//Filtering 2
		var slider2 =  document.getElementById("filterslider2")
		slider2.max = Math.max.apply(Math, mergedData2.nodes.map(function(node) {return node.value}))
		//console.log(slider2);
		mergedData2.nodes = mergedData2.nodes.filter((node)=>{
			if (node.value < min_appearences_thr1){
				console.log("remove node");
			}
			return node.value >= min_appearences_thr2;
		})


		for(var episode = 0;episode < 7;episode++){
			if(showEpisode[episode]){

				// links for first graph 
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
					if(link_source === -1 || link_target === -1){
						//The link belongs to a filltered node
						console.log("skipped link");
						return;
					}

					if(link_found === -1){
						mergedData1.links.push({
							"source": link_source,
							"target": link_target,
							"value": link.value
						});
					} else {
						mergedData1.links[link_found].value += link.value;
					}
				})
			}
			if(showEpisode[7+episode]){

				// links for the second graph
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
					
					if(link_source === -1 || link_target === -1){
						//The link belongs to a filltered node
						console.log("skipped link");
						return;
					}

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

		//console.log(mergedData1);
		nodes = mergedData1.nodes;
		links = mergedData1.links;
		simulation1 = d3.forceSimulation(nodes)
		.force('charge', d3.forceManyBody().strength(-500))
		.force('center', d3.forceCenter(width / 2, height / 2))
		.force('link', d3.forceLink().links(links))
		.on('tick', function(d) {
			ticked('.nodes',nodes,'.links',links);
		})
		.restart()

		//console.log(mergedData2);
		nodes2 = mergedData2.nodes;
		links2 = mergedData2.links;
		simulation2 = d3.forceSimulation(nodes2)
		.force('charge', d3.forceManyBody().strength(-500))
		.force('center', d3.forceCenter(width / 2, height / 2))
		.force('link', d3.forceLink().links(links2))
		.on('tick', function(d) {
			ticked('.nodes2',nodes2,'.links2',links2);
		})
		.restart()
	})
	initZoom();
}


//display settings 
var link_min_width = 2; 
var link_scale_width = 0.1;
var node_min_r = 5;
var node_scale_r = 0.2;

function updateLinks(links_name,lnk) {
	u = d3.select(links_name)
		.selectAll('line')
		.data(lnk)
		.join('line')
		.style('stroke-width',function(d){
			return link_min_width + d.value*link_scale_width;
		})
		.attr('stroke',function(d){
			if(clickedNode === ""){
				return "#000000"
			} else{
				if(d.source.name === clickedNode || d.target.name === clickedNode){
					return nodeColor;
				}
			}
		})
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
				return (link_min_width + d.value*link_scale_width)*2;
			})
		})
		.on("mousemove", function(d) {
			Tooltip.html(d3.select(this).attr("source") + " and "+ d3.select(this).attr("target") +" appear in <br>" + d3.select(this).attr("value") + " scene(s) together")
			.style("left", d.pageX + 20 + "px")
      		.style("top", d.pageY - 100 + "px")
		})
		.on("mouseleave", function() {
			Tooltip.style("opacity", 0)
			.style("left", -100 + "px")
      		.style("top", -100 + "px")
			d3.select(this)
			.style('stroke-width',function(d){
				return link_min_width + d.value*link_scale_width;
			})
		});
		
}

function updateNodes(nodes_name,nd) {
	var u = d3.select(nodes_name) 
		.selectAll('circle')
		.data(nd)
		.join('circle')
		.attr('r', function(d){
			return node_min_r + d.value*node_scale_r;
		})
		.attr('fill',function(d){
			return d.colour
		})
		.attr('opacity', function(d){
			if(clickedNode === ""){
				return 1;
			}
			else{
				return (d.name === clickedNode) ? 1 : 0.5;
			}
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
				nodeColor = d3.select(this).attr('fill');
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
			.style("left", -100 + "px")
      		.style("top", -100 + "px")
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


function updateFilter(slider){
	console.log(slider);
	if (slider.id === "filterslider1") {
		min_appearences_thr1 = slider.value;
	} else {
		min_appearences_thr2 = slider.value;
	}
	loadData();
}

function sliderIn(slider) {
	if (slider.id === "filterslider1") {
		d3.select('#slider1text').html(slider.value)
	} else {
		d3.select('#slider2text').html(slider.value)
	}
}