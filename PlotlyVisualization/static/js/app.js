var dropdownMenu = d3.select("#selDataset");

function init() {
    loadIDs();
    barPlot(null);
    loadDemographics(null);
    loadBubble(null);
    loadGauge(null);
}

function loadIDs() {
    // Use D3 to select the dropdown menu
    //var dropdownMenu = d3.select("#selDataset");
    d3.json("data/samples.json").then((importedData) => {
        ids = importedData.names;
        ids.forEach((id) => {
            var option = dropdownMenu.append("option");
            option.text(id);
        });
    });
}

function optionChanged(selectedValue) {
    console.log(selectedValue);
    barPlot(selectedValue);
    loadDemographics(selectedValue);
    loadBubble(selectedValue);
    loadGauge(selectedValue);
}

// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as importedData
function barPlot(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        if (selectedID == null) {
            selectedID = importedData.names[0];
        }
        var data = importedData.samples;
        
        console.log(selectedID);

        var filteredData = data.filter(row => row.id === selectedID);
        console.log(filteredData);

        /*filteredData[0].sample_values.sort((sample1, sample2) => sample1 - sample2);
        // Slice the first 10 objects for plotting
        filteredData = filteredData.slice(0, 10);

        // Reverse the array due to Plotly's defaults
        filteredData = filteredData.reverse();*/
    
        // Create your trace.
        xValues = filteredData[0].sample_values.slice(0,10).reverse();
        yValues = filteredData[0].otu_ids.slice(0,10).reverse();
        dataLabels = filteredData[0].otu_labels.slice(0,10).reverse();
        var trace = {
            x: xValues,
            y: yValues.map((d, i) => i),
            text: dataLabels,
            type: "bar",
            orientation: "h"
        };
    
        // Create the data array for our plot
        var chartData = [trace];
    
        // Define the plot layout
        var layout = {
            yaxis: {
                tickvals: yValues.map((d, i) => i),
                ticktext: yValues.map(d => "OTU "+d.toString()),
            },
            margin: {
            l: 75,
            r: 75,
            t: 75,
            b: 75
            }
        };
    
        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("bar", chartData, layout);
    });
}

function loadDemographics(selectedID) {
    var demographicsDiv = d3.select("#sample-metadata");
    demographicsDiv.html("");
    d3.json("data/samples.json").then((importedData) => {
        if (selectedID == null) {
            selectedID = importedData.names[0];
        }
        var data = importedData.metadata;
        var filteredData = data.filter(row => row.id == selectedID);
        console.log(filteredData);
        Object.entries(filteredData[0]).forEach(([key, value]) => {
            var span = demographicsDiv.append("span");
            span.text(key+": "+value);
            demographicsDiv.append("br");
        });
    });
}

function loadBubble(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        if (selectedID == null) {
            selectedID = importedData.names[0];
        }
        var data = importedData.samples;

        console.log(selectedID);

        var filteredData = data.filter(row => row.id === selectedID);
        console.log(filteredData);

        // Create your trace.
        xValues = filteredData[0].otu_ids.reverse();
        yValues = filteredData[0].sample_values.reverse();
        textValues = filteredData[0].otu_labels.reverse();
        var trace = {
            x: xValues,
            y: yValues,
            mode: 'markers',
            marker: {
                size: yValues,
                color: xValues
            },
            text: textValues
        };
    
        // Create the data array for our plot
        var chartData = [trace];
    
        // Define the plot layout
        var layout = {
            xaxis: {
                title: {
                    text: "OTU ID"
                }
            },
            showlegend: false,
            margin: {
            l: 40,
            r: 40,
            t: 40,
            b: 40
            }
        };
    
        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("bubble", chartData, layout);
    });
}

function loadGauge(selectedID){
    var gaugeValue = 0;
    d3.json("data/samples.json").then((importedData) => {
        if (selectedID == null) {
            selectedID = importedData.names[0];
        }
        var data = importedData.metadata;
        var filteredData = data.filter(row => row.id == selectedID);
        console.log(filteredData);
        Object.entries(filteredData[0]).forEach(([key, value]) => {
            if (key == "wfreq") {
                gaugeValue = value;
            }
        });
    });

    // pie chart converted to gauge chart
    var trace = {
      type: 'pie',
      showlegend: false,
      hole: 0.4,
      rotation: 90,
      values: [180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180],
      text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
      direction: 'clockwise',
      textinfo: 'text',
      textposition: 'inside',
      marker: {
        colors: ['#F8F3EC','#F4F1E5','#E9E6CA','#E2E4B1','#D5E49D','#B7CC92','#8CBF88','#8ABB8F','#85B48A','white'],
        labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9',''],
        hoverinfo: "label"
      },
      hoverinfo: "skip"
    }
  
    // the start point where the needle "originates"
    var needleStart = {
      type: 'scatter',
      x: [0],
      y: [0],
      marker: {
        size: 14,
        color:'#850000'
      },
      showlegend: false,
      hoverinfo: "skip"
    }
  
    // the needle (triangular version)
  
    // add weights to the degrees to correct needle
    var weight = 0;
    if (gaugeValue == 2 || gaugeValue == 3){
      weight = 3;
    } else if (gaugeValue == 4){
      weight = 1;
    } else if (gaugeValue == 5){
      weight = -.5;
    } else if (gaugeValue == 6){
      weight = -2;
    } else if (gaugeValue == 7){
      weight = -3;
    }
  
    var degrees = 180-(20 * gaugeValue + weight); // 20 degrees for each of the 9 gauge sections
    var radius = .5;
    var radians = degrees * Math.PI / 180;
    var aX = 0.025 * Math.cos((radians) * Math.PI / 180);
    var aY = 0.025 * Math.sin((radians) * Math.PI / 180);
    var bX = -0.025 * Math.cos((radians) * Math.PI / 180);
    var bY = -0.025 * Math.sin((radians) * Math.PI / 180);
    var cX = radius * Math.cos(radians);
    var cY = radius * Math.sin(radians);
  
    // draw the triangle
    var path = 'M ' + aX + ' ' + aY +
              ' L ' + bX + ' ' + bY +
              ' L ' + cX + ' ' + cY +
              ' Z';
  
    var gaugeLayout = {
      title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '#850000',
          line: {
            color: '#850000'
          }
        }],
      xaxis: {zeroline:false, 
              showticklabels:false,
              showgrid: false, 
              range: [-1, 1],
              fixedrange: true
            },
      yaxis: {zeroline:false, 
              showticklabels:false,
              showgrid: false, 
              range: [-1, 1],
              fixedrange: true
            }
    };
  
    Plotly.newPlot("gauge", [trace, needleStart], gaugeLayout);
  }

init();