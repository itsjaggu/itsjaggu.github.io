var dropdownMenu = d3.select("#selDataset");
var selectedID = 0;

function init() {
    loadIDs();
    // Assign the value of the dropdown menu option to a variable
    //var selectedValue = d3.select("#selDataset option:checked").property("value");
    barPlot(selectedID);
    loadDemographics(selectedID);
    loadBubble(selectedID);
    loadGauge(selectedID);
}

function loadIDs() {
    // Use D3 to select the dropdown menu
    //var dropdownMenu = d3.select("#selDataset");
    d3.json("data/samples.json").then((importedData) => {
        ids = importedData.names;
        if (selectedID == 0) {
            selectedID = ids[0].value;
        }
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
    // if (selectedID == null) {
    //     selectedID = d3.select("#selDataset option:checked").property("value");
    // }
    d3.json("data/samples.json").then((importedData) => {
        
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
    // if (selectedID == null) {
    //     selectedID = d3.select("#selDataset option:checked").property("value");
    // }
    var demographicsDiv = d3.select("#sample-metadata");
    demographicsDiv.html("");
    d3.json("data/samples.json").then((importedData) => {
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
    // if (selectedID == null) {
    //     selectedID = d3.select("#selDataset option:checked").property("value");
    // }
    d3.json("data/samples.json").then((importedData) => {
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

function loadGauge(selectedID) {
    // if (selectedID == null) {
    //     selectedID = d3.select("#selDataset option:checked").property("value");
    // }
    var gaugeValue = 0;
    d3.json("data/samples.json").then((importedData) => {
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
            title: { text: "Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: { 
                axis: { 
                        range: [null, 9],
                        ticks: "",
                        tickvals: [1,2,3,4,5,6,7,8,9],
                        ticktext: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"]
                    } ,
                
                steps: [
                    { range: [0, 1], color: "rgba(255,255,0,0.4)" },
                    { range: [1, 2], color: "rgba(245,245,0,0.6)" },
                    { range: [2, 3], color: "rgba(235,235,0,0.8)" },
                    { range: [3, 4], color: "rgba(230,230,0,1.0)" },
                    { range: [4, 5], color: "rgba(220,220,0,1.0)" },
                    { range: [5, 6], color: "rgba(200,200,0,0.8)" },
                    { range: [6, 7], color: "rgba(0,128,0,0.6)" },
                    { range: [7, 8], color: "rgba(0,128,0,0.8)" },
                    { range: [8, 9], color: "rgba(0,128,0,1.0)" },
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
    
}

init();