//selecting dropdown control to load IDs for filtering charts
var dropdownMenu = d3.select("#selDataset");

// function to initiate loading dynamic page content on page load
function init() {
    loadIDs();
    barPlot(null);
    loadDemographics(null);
    loadBubble(null);
}

// loading IDs to dropdown
function loadIDs() {
    //importing data from json
    d3.json("data/samples.json").then((importedData) => {
        // storing IDs to variable for loading to 
        ids = importedData.names;
        console.log(ids);
        ids.forEach((id) => {
            var option = dropdownMenu.append("option");
            option.text(id);
        });
    });
}

// Reloading dynamic content on change of ID
function optionChanged(selectedValue) {
    console.log(selectedValue);
    barPlot(selectedValue);
    loadDemographics(selectedValue);
    loadBubble(selectedValue);
}

// plotting bar chart
function barPlot(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        if (selectedID == null) {
            selectedID = importedData.names[0];
        }
        console.log(selectedID);
        var data = importedData.samples;
        var filteredData = data.filter(row => row.id === selectedID);
        console.log(filteredData);

        filteredData[0].sample_values.sort((sample1, sample2) => sample1 - sample2);
    
        // Creating trace for top 10 values and Reversing the array due to Plotly's defaults
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
    
        // Creating data array for the plot
        var chartData = [trace];
    
        // Defining the plot layout
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
    
        // Ploting the chart to a div tag with id "bar"
        Plotly.newPlot("bar", chartData, layout);
    });
}

//loading demographic information
function loadDemographics(selectedID) {
    var demographicsDiv = d3.select("#sample-metadata");
    demographicsDiv.html("");
    d3.json("data/samples.json").then((importedData) => {
        if (selectedID == null) {
            selectedID = importedData.names[0];
        }
        console.log(selectedID);
        var data = importedData.metadata;
        var filteredData = data.filter(row => row.id == selectedID);
        console.log(filteredData);
        Object.entries(filteredData[0]).forEach(([key, value]) => {
            var span = demographicsDiv.append("span");
            span.text(key+": "+value);
            demographicsDiv.append("br");
        });
        // loading gauge chart by passing wfreq value from the demographic data
        loadGauge(filteredData[0].wfreq)
    });
}

//loading bubble chart
function loadBubble(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        if (selectedID == null) {
            selectedID = importedData.names[0];
        }
        console.log(selectedID);
        var data = importedData.samples;   
        var filteredData = data.filter(row => row.id === selectedID);
        console.log(filteredData);

        // Creating the trace
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
    
        // Creating the data array for the plot
        var chartData = [trace];
    
        // Defining the plot layout
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
    
        // Ploting the chart to a div tag with id "bubble"
        Plotly.newPlot("bubble", chartData, layout);
    });
}

// Initializing the function to initiate sequential load of dynamic content
init();