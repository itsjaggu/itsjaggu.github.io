// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as importedData
d3.json("data/samples.json").then((importedData) => {
    var data = importedData.samples;
  
    // Sort the data array using the greekSearchResults value
    data.sort(function(a, b) {
        return parseFloat(b.sample_values) - parseFloat(a.sample_values);
    });

    // Slice the first 10 objects for plotting
    data = data.slice(0, 10);

    // Reverse the array due to Plotly's defaults
    data = data.reverse();
  
    // Create your trace.
    var trace = {
        x: data.map(row => row.sample_values),
        y: data.map(row => row.otu_ids),
        text: data.map(row => row.otu_labels),
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