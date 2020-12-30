// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as incomingData
d3.json("data/samples.json").then((incomingData) => {
    function filterIdData(otu) { //sorting to top 10 function
        otu.samples.id = "940"
    }
  
    // Use filter() to pass the function as its argument
    var filteredId = incomingData.filter(filterIdData);
  
    //  Check to make sure your are filtering your movies.
    console.log(filteredId);
  
    /*otu.samples.sample_values.sort(function(a, b) {
        return parseFloat(b.value) - parseFloat(a.value);
      });
    return otu.slice(0, 9); */

    // Use the map method with the arrow function to return all the filtered movie titles.
    var sample_values = filteredId.map(otuSamples =>  otuSamples.samples.sample_values);
  
    // Use the map method with the arrow function to return all the filtered movie metascores.
    var otu_ids = filteredId.map(otuSamples =>  otuSamples.samples.otu_ids);
  
    // Use the map method with the arrow function to return all the filtered movie metascores.
    var otu_labels = filteredId.map(otuSamples =>  otuSamples.samples.otu_labels);

    // Check your filtered metascores.
    console.log(ratings);
  
    // Create your trace.
    var trace = {
      x: sample_values,
      y: otu_ids,
      text: otu_labels,
      type: "bar",
      orientation: 'h'
    };
  
    // Create the data array for our plot
    var data = [trace];
  
    // Define the plot layout
    var layout = {
      title: "Top Ten OTUs",
      xaxis: { title: "OTU Values" },
      yaxis: { title: "OTU IDs"}
    };
  
    // Plot the chart to a div tag with id "bar-plot"
    Plotly.newPlot("bar", data, layout);
});