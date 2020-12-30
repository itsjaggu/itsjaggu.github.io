function init() {
    loadIDs();
    barPlot();
}

function loadIDs() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    d3.json("data/samples.json").then((importedData) => {
        ids = importedData.names;
        ids.forEach((id) => {
            if (selectedID === null) {
                selectedID = id ;
                console.log(selectedID);
            }
            var option = dropdownMenu.append("option");
            option.text(id);
        });
    });
}

function optionChanged(selectedValue) {
    console.log(selectedValue);
    barPlots(selectedValue);
}
// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as importedData
function barPlot(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        var data = importedData.samples;
        
        var filteredData = filterData(data,selectedID);

        // Sort the data array using the greekSearchResults value
        filteredData.sort(function(a, b) {
            return parseFloat(b.sample_values) - parseFloat(a.sample_values);
        });

        // Slice the first 10 objects for plotting
        filteredData = filteredData.slice(0, 10);

        // Reverse the array due to Plotly's defaults
        filteredData = filteredData.reverse();
    
        // Create your trace.
        var trace = {
            x: filteredData.map(row => row.sample_values),
            y: filteredData.map(row => row.otu_ids),
            text: filteredData.map(row => row.otu_labels),
            name: "OTU",
            type: "bar",
            orientation: "h"
        };
    
        // Create the data array for our plot
        var chartData = [trace];
    
        // Define the plot layout
        var layout = {
            title: "Top Ten OTUs",
            margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
            }
        };
    
        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("bar", chartData, layout);
    });
}

function filterData(data,selectedID) {
    return data.id = selectedID;
}

init();