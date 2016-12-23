var choice = "scary";

var noColor = "#BE3AF9"
var yesColor = "#21F893"

var globaldata;
var circles;
var forceStrength = 1;
var parseDate = d3.timeParse("%Y-%m-%d");

//For scrolling events

var scroll;


$(window).scroll(function (event) {
    scroll = $(window).scrollTop();
    console.log(scroll)

    if (scroll < 4100 & scroll > 3000) {
    	chartOpen();
    }
    else if (scroll > 4100 & scroll < 4500) {
    	secondChart();
    } else if (scroll > 5100 & scroll < 5400) {
    	thirdChart();
    } else if (scroll > 6400 & scroll < 6550) {
    	fourthChart();
    }
});



// Margins
//
var margin = {top: 50, right: 70, bottom: 50, left: 50},
    width = 950 - margin.left - margin.right,
    height = 5500 - margin.top - margin.bottom;

var svg = d3.select(".chart")
	.append("svg")
	.attr("height", height)
	.attr("width", width)
	.append("g")
	.attr("transform", "translate(0,0)")

var x = d3.scaleLinear()
    .rangeRound([100, width-margin.right-170])

var y = d3.scaleLinear()
    .rangeRound([2000, 50])

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var simulation = d3.forceSimulation();

d3.queue()
	.defer(d3.tsv, "data/ufotietokanta24122016.tsv")
	.await(ready)


function ready (error, data) {

	data.forEach(function(d) { 
		d.pvm = parseDate(d["Päivämäärä"]),
		d.paikka = d["Kunta tai kaupunki"],
		d.year = d.pvm.getFullYear(),
		d.month = d.pvm.getMonth(),
		d.placingX = 2016 % d.year % 5,
		d.placingY = 403 - (Math.ceil((d.year / 5) - 0.2));
		d.placingX2 = d.month % 5,
		d.placingY2 = Math.floor(d.month / 5);
	})

	globaldata = data;

	circles = svg.selectAll(".havainnot")
		.data(data)
		.enter().append("circle")
		.attr("class", "havainnot")
		.attr("r", 3)
		.attr("transform", "translate(20,0)")
		.on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .99);
            div.html( "<strong> Kunta tai kaupunki: </strong>"+ d["Kunta tai kaupunki"] + "<br /><strong>Päivämäärä:</strong> " + d["Päivämäärä"] + "<br /><strong>Havainnon kuvaus:</strong><br />" + d["kuvaus"] )	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })

	chartOpen();
}

function chartOpen (error, data) {


	data = globaldata;

	x = d3.scaleLinear()
    .rangeRound([100, width-margin.right-230])

	y = d3.scaleLinear()
    .rangeRound([2000, 50])

	y.domain([15, 0]);
	x.domain([0, 3]);

	simulation
		.force("x", d3.forceX(function(d) { return x(d.placingX)}).strength(forceStrength / 10))
		.force("y", d3.forceY(function(d) { return y(d.placingY)}).strength(forceStrength / 10))
		.force("collide", d3.forceCollide(4));

	//filter fillColor
	var fillColor = function(d) {
		if(choice === "noFilter") {
			return yesColor;
		} else if (choice === "scary") {
			if(d["Aiheuttiko kohde pelkoa"] == "ei") {
				return noColor
			} else {
				return yesColor
			}
		} else if (choice == "stop") {
			if(d["Pysähtyikö kohde"] == "ei") {
				return noColor
			} else {
				return yesColor
			}
		} else if (choice == "ilmoitus") {
			if(d["Ilmoitko havainnostasi sanomalehdille tai viranomaisille"] == "ei") {
				return noColor
			} else {
				return yesColor
			}
		} else {
			if(d["Loistiko kohde valoa"] == "ei") {
				return noColor
			} else {
				return yesColor
			}
		}
	}

	circles
		.attr("fill", fillColor)
        .on("dblclick", dblclick);

	function ticked() {
		svg.selectAll(".havainnot")
			.attr("cx", function(d) {
				return d.x;
			})
			.attr("cy", function(d) {
				return d.y;
			})
	}

	function dblclick(a){
    	window.open(a.URL, '_blank');
 	}


	simulation.nodes(data)
		.on("tick", ticked)
		.alpha(0.65)
		.restart()

	circles.on("click", function(d) {
		console.log(d);
	})


	//Toggle buttons for the visualization
	d3.selectAll(".button")
		.on("click", function() {
			if (d3.select(this).attr("dataval") == "noFilter") {
				d3.select(".noFilter").classed("current", true);
				d3.select(".scary").classed("current", false);
				d3.select(".stop").classed("current", false);
				d3.select(".ilmoitus").classed("current", false);
				d3.select(".light").classed("current", false);
				choice = "noFilter"
			} else if (d3.select(this).attr("dataval") == "scary") {
				d3.select(".noFilter").classed("current", false);
				d3.select(".scary").classed("current", true);
				d3.select(".stop").classed("current", false);
				d3.select(".ilmoitus").classed("current", false);
				d3.select(".light").classed("current", false);
				choice = "scary"
			} else if (d3.select(this).attr("dataval") == "stop") {
				d3.select(".noFilter").classed("current", false);
				d3.select(".scary").classed("current", false);
				d3.select(".stop").classed("current", true);
				d3.select(".ilmoitus").classed("current", false);
				d3.select(".light").classed("current", false);
				choice = "stop"
			} else if (d3.select(this).attr("dataval") == "ilmoitus") {
				d3.select(".noFilter").classed("current", false);
				d3.select(".scary").classed("current", false);
				d3.select(".stop").classed("current", false);
				d3.select(".ilmoitus").classed("current", true);
				d3.select(".light").classed("current", false);
				choice = "ilmoitus"
			} else {
				d3.select(".noFilter").classed("current", false);
				d3.select(".scary").classed("current", false);
				d3.select(".stop").classed("current", false);
				d3.select(".ilmoitus").classed("current", false);
				d3.select(".light").classed("current", true);
				choice = "light"
			}
					updateColors();
		}
		)

svg.append("foreignObject")
    .attr("width", 900)
    .attr("height", 400)
    .attr("y", 2500)
    .append("xhtml:body")
    .html("<h1>Tutki havaintoja kuukausitasolla</h1><p>Eniten havaintoja tehdään tammi-, elo- ja syyskuussa. Kuukaudet on numerojärjestyksessä vasemmasta ylänurkasta alkaen.</p><p style='color: #21F893;'>⚫ Kirkas päivänvalo</p><p style='color: #059451;'>⚫ Auringonlasku tai -nousu</p><p style='color: #BE3AF9;'>⚫ Hämärä</p><p style='color: #7505a8;'>⚫ Pimeä</p>");

svg.append("foreignObject")
    .attr("width", 900)
    .attr("height", 400)
    .attr("y", 3300)
    .append("xhtml:body")
    .html("<h1>Tutki havaintoja Suomessa ja naapurimaissa</h1><p>Eniten havaintoja on tehty Helsingissä. Myös muut suuret kaupungit korostuvat. Katso havainnot kartalta.</p><p style='color: #21F893;'>⚫ Kirkas päivänvalo</p><p style='color: #059451;'>⚫ Auringonlasku tai -nousu</p><p style='color: #BE3AF9;'>⚫ Hämärä</p><p style='color: #7505a8;'>⚫ Pimeä</p>");

svg.append("foreignObject")
    .attr("width", 900)
    .attr("height", 300)
    .attr("y", 4700)
    .append("xhtml:body")
    .html("<h1>Tutki havaintokuvia ja kertomuksia</h1><p>Vie osoitin havaintojen päälle tarkastellaksesi kuvia ja lisätietoja. Kaksoisklikkaamalla voit lukea koko havainnon kuvauksen.</p><p style='color: #21F893;'>⚫ Havaintokuvia</p><p style='color: #BE3AF9;'>⚫ Ei havaintokuvia</p>");


	//Update colors based on filter selection
	function updateColors() {
		circles.attr("fill", fillColor)
	}



}


function secondChart(error, data) {

	data = globaldata;

	x = d3.scaleLinear()
 	   .rangeRound([100, width-margin.right-230])

	y = d3.scaleLinear()
    	.rangeRound([3340, 2840])

	y.domain([3, 0]);
	x.domain([0, 3]);

	simulation
		.force("x", d3.forceX(function(d) { return x(d.placingX2)}).strength(forceStrength / 10))
		.force("y", d3.forceY(function(d) { return y(d.placingY2)}).strength(forceStrength / 10))
		.force("collide", d3.forceCollide(4));


	var fillColor2 = function(d) {
		if(d["Valoisuus"] == "kirkas päivänvalo") {
			return yesColor;
		} else if (d["Valoisuus"] == "auringonlasku_tai_nousu") {
			return "#059451";	
		} else if (d["Valoisuus"] == "hämärä") {
				return "#BE3AF9";
		} else {
				return "#7505a8";
			}
	}

	circles
		.attr("fill", fillColor2)
        .on("dblclick", dblclick);

	function ticked() {
		svg.selectAll(".havainnot")
			.attr("cx", function(d) {
				return d.x;
			})
			.attr("cy", function(d) {
				return d.y;
			})
	}

	simulation
		.nodes(data)
		.on("tick", ticked)
		.alpha(0.65)
		.restart()

	circles.on("click", function(d) {
		console.log(d);
	})




	function dblclick(a){
    	window.open(a.URL, '_blank');
 	}
}

function thirdChart(error, data) {

	data = globaldata;

	x = d3.scaleLinear()
 	   .rangeRound([100, width-margin.right-230])

	y = d3.scaleLinear()
    	.rangeRound([4500, 3640])

	y.domain([59.7, 70]);
	x.domain([19.5, 32]);

	latForce = function(d) {
		if (d.Lat < 59.7) {
			return -100;
		} else {
			return x(d.Lat);
		}
	}

	lonForce = function(d) {
		if (d.Lon < 19.5 | d.Lon > 32) {
			return -100;
		} else {
			return x(d.Lon);
		}
	}

	simulation
		.force("x", d3.forceX(function(d) { return x(d.Lon)}).strength(forceStrength / 10))
		.force("y", d3.forceY(function(d) { return y(d.Lat)}).strength(forceStrength / 10))
		.force("collide", d3.forceCollide(4));


	var fillColor2 = function(d) {
		if(d["Valoisuus"] == "kirkas päivänvalo") {
			return yesColor;
		} else if (d["Valoisuus"] == "auringonlasku_tai_nousu") {
			return "#059451";	
		} else if (d["Valoisuus"] == "hämärä") {
				return "#BE3AF9";
		} else {
				return "#7505a8";
			}
	}

	circles
		.attr("fill", fillColor2)
        .on("dblclick", dblclick);

	function ticked() {
		svg.selectAll(".havainnot")
			.attr("cx", function(d) {
				return d.x;
			})
			.attr("cy", function(d) {
				return d.y;
			})
	}

	simulation
		.nodes(data)
		.on("tick", ticked)
		.alpha(0.65)
		.restart()

	circles.on("click", function(d) {
		console.log(d);
	})




	function dblclick(a){
    	window.open(a.URL, '_blank');
 	}
}

function fourthChart(error, data) {

	data = globaldata;

	x = d3.scaleLinear()
 	   .rangeRound([100, width-margin.right-230])

	y = d3.scaleLinear()
    	.rangeRound([5800, 5000])

	y.domain([3, 0]);
	x.domain([0, 3]);

	forceXkuvat = function(d) {
		if (d["havaintokuvat"] == "Kyllä") {
			return width*0.23;
		} else {
			return width*0.65;
		}
	}

	simulation
		.force("x", d3.forceX(forceXkuvat).strength(forceStrength / 10))
		.force("y", d3.forceY(function(d) { return 5100 }).strength(forceStrength / 10))
		.force("collide", d3.forceCollide(4));


	var fillColor2 = function(d) {
		if(d["havaintokuvat"] == "Kyllä") {
			return yesColor;
		} else {
			return noColor;
	}}

	circles
		.attr("fill", fillColor2)
        .on("dblclick", dblclick);

	function ticked() {
		svg.selectAll(".havainnot")
			.attr("cx", function(d) {
				return d.x;
			})
			.attr("cy", function(d) {
				return d.y;
			})
	}

	simulation
		.nodes(data)
		.on("tick", ticked)
		.alpha(0.65)
		.restart()

	circles.on("click", function(d) {
		console.log(d);

		})

	//If havaintokuvia

	circles = svg.selectAll(".havainnot")
		.on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .99);

            if (d["havaintokuvat"] == "Kyllä") {
            div.html( "<strong> Kunta tai kaupunki: </strong>"+ d["Kunta tai kaupunki"] + "<br /><strong>Päivämäärä:</strong> " + d["Päivämäärä"] + "<br /><strong>Havaintokuva:</strong><br /><img src=" + d["kuva1"] +">" )	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            }

            else {
            div.html( "<strong> Kunta tai kaupunki: </strong>"+ d["Kunta tai kaupunki"] + "<br /><strong>Päivämäärä:</strong> " + d["Päivämäärä"] + "<br /><strong>Havainnon kuvaus:</strong><br />" + d["kuvaus"] )	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            }

            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })






	function dblclick(a){
    	window.open(a.URL, '_blank');
 	}
}