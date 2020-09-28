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

    //Gage Chart
    var washFreq = filteredPanel[0].wfreq;
    console.log(washFreq);

    // var data3 = [
    //   {
    //     name: "Scrubs/Week",
    //     type: "indicator",
    //     mode: "gauge+number",
    //     value: washFreq,
    //     textposition: "inside",
    //     title: { text: "Belly Button Washing Frequency", font: { size: 20 } },
    //     gauge: {
    //       axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
    //       bar: { color: "gray" },
    //       bgcolor: "white",
    //       borderwidth: 0,
          
    //       bordercolor: "gray",
    //       steps: [
    //         { range: [0, 1], color: 'rgb(0, 255, 0)'},
    //         { range: [1, 2], color: 'rgb(0, 225, 0)'},
    //         { range: [2, 3], color: 'rgb(0, 200, 0)'},
    //         { range: [3, 4], color: 'rgb(0, 175, 0)'},
    //         { range: [4, 5], color: 'rgb(0, 150, 0)'},
    //         { range: [5, 6], color: 'rgb(0, 125, 0)'},
    //         { range: [6, 7], color: 'rgb(0, 100, 0)'},
    //         { range: [7, 8], color: 'rgb(0, 50, 0)'},
    //         { range: [8, 9], color: 'rgb(0, 0, 0)'}
    //       ],
    //       threshold: {
    //         line: { color: "red", width: 4 },
    //         thickness: 0.75,
    //         value: 9
    //       }
    //     }
    //   }
    // ];

    // Second approach
    var trace3 = {
      type: 'pie',
      showlegend: false,
      hole: 0.4,
      rotation: 90,
      values: [ 10, 10, 10, 10, 10, 10, 10, 10, 10, 90],
      text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
      direction: 'clockwise',
      textinfo: 'text',
      textposition: 'inside',
      marker: {
        colors: ['','','','','','','','','','white'],
        labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        hoverinfo: 'label'
      }
    }
    var data3 = [trace3];
    // needle
    var degrees = 20 * washFreq 
    var radius = 0.25
    var radians = degrees * Math.PI / 180
    var x = 0.5 - (radius * Math.cos(radians))
    var y = 0.5 + (radius * Math.sin(radians))

    var layout3 = {
      width: 450,
      height: 450,
      shapes: [{
        type: 'line',
        x0: 0.5,
        y0: 0.5,
        x1: x,
        y1: y,
        line: {
          color: 'black',
          width: 3
        }}],
      annotations: [{
          font: {
            size: 20
          },
          showarrow: false,
          text: washFreq,
          x: 0.5,
          y: 0.4
        }],
      title: { text: "Belly Button Washing Frequency", font: { size: 20 }},
      xaxis: {visible: false, range: [-1, 1]},
      yaxis: {visible: false, range: [-1, 1]}
    }
    
    // var layout3 = {
    //   width: 350,
    //   height: 300,
    //   margin: { t: 25, r: 25, l: 25, b: 25 },
    //   paper_bgcolor: "white",
    //   font: { color: "gray", family: "Arial" }
    // };
    
    Plotly.newPlot('gauge', data3, layout3);
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


