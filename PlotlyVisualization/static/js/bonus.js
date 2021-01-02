// Default gauge chart from https://plot.ly/javascript/gauge-charts/
/* function loadGauge(selectedID) {
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

        var trace = {
            domain: { x: [0, 1], y: [0, 1] },
            value: gaugeValue,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: { 
                axis: { 
                        range: [null, 9],
                        ticks: "",
                        tickvals: [0,1,2,3,4,5,6,7,8,9],
                        ticktext: [0,1,2,3,4,5,6,7,8,9]
                    } ,
                
                steps: [
                    { range: [0, 1], color: "#ecebbd" },
                    { range: [1, 2], color: "#dde26a" },
                    { range: [2, 3], color: "#d9e650" },
                    { range: [3, 4], color: "#c9dc87" },
                    { range: [4, 5], color: "#bdda57" },
                    { range: [5, 6], color: "#9acd32" },
                    { range: [6, 7], color: "#8bbe1b" },
                    { range: [7, 8], color: "#568203" },
                    { range: [8, 9], color: "#2a8000" }
                  ]
            },
            
        };
    
        // Create the data array for our plot
        var chartData = [trace];
    
        // Define the plot layout
        var layout = {
            margin: {
            l: 25,
            r: 25,
            t: 25,
            b: 25
            }
        };
    
        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("gauge", chartData, layout);
    });
    
} */

// Gauge chart prepared from D3 pie chart
function loadGauge(wfreq){
    var gaugeValue = wfreq;
    
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
        colors: ['#ecebbd'
                  ,'#dde26a'
                  ,'#d9e650'
                  ,'#c9dc87'
                  ,'#bdda57'
                  ,'#9acd32'
                  ,'#8bbe1b'
                  ,'#568203'
                  ,'#2a8000'
                  ,'white'],
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
  
    // adding weights to the degrees to correct needle
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
    
    // Defining variables to compute path of gauge chart needle based on wfreq value
    var degrees = 180-(20 * gaugeValue + weight); // 20 degrees for each of the 9 gauge sections
    var radius = .5;
    var radians = degrees * Math.PI / 180;
    var aX = 0.025 * Math.cos((radians) * Math.PI / 180);
    var aY = 0.025 * Math.sin((radians) * Math.PI / 180);
    var bX = -0.025 * Math.cos((radians) * Math.PI / 180);
    var bY = -0.025 * Math.sin((radians) * Math.PI / 180);
    var cX = radius * Math.cos(radians);
    var cY = radius * Math.sin(radians);
  
    // drawing the triangle for needle
    var path = 'M ' + aX + ' ' + aY +
              ' L ' + bX + ' ' + bY +
              ' L ' + cX + ' ' + cY +
              ' Z';
  
    // Defining Gauge chart layout
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
    //Ploting Gauge chart
    Plotly.newPlot("gauge", [trace, needleStart], gaugeLayout);
  }