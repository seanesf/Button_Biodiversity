function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var bio= '/metadata/${sample}';
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(bio).then(function(sample) {
      var sample_metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function([key, value]) {
      var row = sample_metadata.append("p");
    });
  }
)};

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var bio = '/samples/${samples}';
    d3.json(bio).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    var x_values = data.otu_ids;
    var y_values = data.sample_values;
    var bsize = data.sample_values;
    var bcolors = data.otu_ids;
    var bvalues = data.otu_labels;

    var trace1 = {
      x: x_values,
      y: y_values,
      text: bvalues,
      mode: 'markers',
      marker: {
        color:bcolors
        size: bsize
      }
    };

    var data = [trace1];
    var layout = {
      xaxis:{title: "OTU ID"},
    };

    Plotly.newPlot('bubble',data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(bio).then(function(data) {
      var pie_values = data.sample_values.slice(0,10);
      var pie_labels = data.otu_ids.slice(0,10);
      var pie_hover = data.otu_labels.slice(0,10);

      var data = [{
        value: pie_values,
        labels: pie_labels,
        type: 'pie'   
      }];
        Plotly.newPlot('pie', data);
      });
    });
  }

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
