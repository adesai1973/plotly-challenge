// Plan

// init function 
// 1) Fill out dropdown with all of the ids
// 2) Calls a buildPage function that draws the chart and the panel for the first one

// buildPage function 
// 1) That takes one parameter, which is the subject ID
// 2) Draws our plotly charts and fills the panel

// Need an event listener for the dropdown
// optionChanged function
// - That takes as a parameter the user selection


function buildPage(subject){

  d3.json("samples.json").then((data) => {

    console.log(subject);
    console.log(data);
    // Filter data.samples based on subject
    // The array that you get back you are interested in [0]
    // Use dot notation to get at .otu_ids, .otu_labels, .otu_sample_values
    // Use slice for the horizontal bar chart
    function filterBySubject(testData) {
      return testData.id == subject;
    }
    var samples = data.samples;
    console.log(samples);
    var filteredSample = samples.filter(filterBySubject);
    console.log(filteredSample);

    var otuSamplesList = filteredSample.map(sample => sample.sample_values);
    var otuIdList = filteredSample.map(sample => sample.otu_ids);
    var otuIdLabelsList = filteredSample.map(sample => sample.otu_ids);
    var otuSamples = otuSamplesList[0].slice(0,10).reverse();
    var otuIds = otuIdList[0].slice(0,10).reverse();
    var otuTextIds = otuIds.map(id => `OTU ${id}`);
    console.log(filteredSample);
    console.log(otuSamples);   
    console.log(otuIds); 
    console.log(otuTextIds); 
    // Plotly charts
    // Horizonatal bar chart- orientation: "h"

    // Create the Trace
    var trace1 = {
      x: otuSamples,
      y: otuTextIds,
      type: "bar",
      orientation: "h"
    };

    // Create the data array for the plot
    var data1 = [trace1];

    // Define the plot layout
    var layout1 = {
      title: `OTUs for Subject ${subject}`,
      xaxis: { title: "Count" },
      yaxis: { title: "OTU IDs" }
    };

    // Plot the chart to a div tag with id "bar"
    Plotly.newPlot("bar", data1, layout1);

    // Panel
    // Filter data.metadata based on subject
    // The array that you get back you are interested in [0]
    
    var panel = d3.select("#sample-metadata");

    panel.html("");

    var panelData = data.metadata;
    console.log(panelData);
    var filteredPanel = panelData.filter(filterBySubject);
    console.log(filteredPanel[0]);
    var table = panel.append("table");
    Object.entries(filteredPanel[0]).forEach(([key, value]) => {
      // One idea is to append header elements (h5 or h6) of the key: value
      console.log(key);
      console.log(value);
      
      var row = table.append("tr");
      var cell1 = row.append("td");
      //cell1 = row.append("b");
      cell1.text(key);
      var cell2 = row.append("td");
      cell2.text(value);
    })

    //Plot Bubble Chart

    var otuIds2 = otuIdList[0].reverse();
    var otuSamples2 = otuSamplesList[0].reverse();
    var otuIdLabelsList2 = filteredSample.map(sample => sample.otu_labels);

    var trace2 = {
      x: otuIds2,
      y: otuSamples2,
      mode: 'markers',
      marker: {
        color: otuIds2,
        //opacity: [1, 0.8, 0.6, 0.4],
        size: otuSamples2
      }
    };
    
    var data2 = [trace2];
    
    var layout2 = {
      title: 'Sample Bubble Chart',
      xaxis: { title: "OTU IDs" },
      showlegend: false,
      height: 600,
      width: 1200
    };
    
    Plotly.newPlot('bubble', data2, layout2);

  })
}


function init() {

  // Fill dropdown with IDs
  // Get firstOne id and call buildPage with that id

  d3.json("samples.json").then((data) => {

    var selector = d3.select("#selDataset");

    //console.log(data);

    data.names.forEach((ids) => {
      selector
        .append("option")
        .text(ids)
        .property("value", ids)
    })

    firstOne = data.names[0];

    buildPage(firstOne);

  })
}

function optionChanged(selection) {

  buildPage(selection);
}


init()


