// Initialize query url
queryUrl = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Function to display charts
function getCharts(sample) {
    d3.json(queryUrl).then(
        function (data) {
            console.log(data);

            // Initialize variables to hold sample parameters
            let samples = data.samples;
            // Stores sample keys and their values in an array
            let sampleArray = samples.filter(sampleItem => sampleItem.id == sample)[0] 
            console.log(sampleArray);
            // console.log(samples);
            let otuIDs = sampleArray.otu_ids;
            let otuLabels = sampleArray.otu_labels;
            let sampleValues = sampleArray.sample_values;
            
            let yValues = otuIDs.slice(0,10).reverse();
            let yLabels = yValues.map(item => `OTU ${item}`)
            let xValues = sampleValues.slice(0,10).reverse();
            let hover_text = otuLabels.slice(0,10).reverse();
            
            // Build data and layout for bar chart
            let barData = [{
                y: yLabels,
                x: xValues,
                text: hover_text,
                type: "bar",
                orientation: "h"
            }];
    
            let barLayout = {
                title: "Top 10 OTUs Found",
                margin: {t: 30, l: 150}            
            };
            
            // Plot bar chart
            Plotly.newPlot("bar",barData,barLayout);

            // Build data and layout for bubble chart
            let bubbleData = [{
                x: otuIDs,
                y: sampleValues,
                mode: "markers",
                marker: {
                    size: sampleValues,
                    color: otuIDs
                }
            }];

            let bubbleLayout = {
                title: "OTUs in Sample",
                margin: {t: 0},
                hovermode: "closest",
                xaxis: {title: "OTU ID"},
                margin: {t: 30}
            };

            // Plot bubble chart
            Plotly.newPlot("bubble",bubbleData,bubbleLayout);
        }
    );
};

// Function to get subjects meta data to display in panel
function getMetaData(sample) {
    d3.json(queryUrl).then(
        function (data) {
            let metadata = data.metadata;
            // Stores metadata keys and their values in an array
            let metadataArray = metadata.filter(dataItem => dataItem.id == sample)[0];

            // Loops through metadataArry and appends h5 object to panel with metadata text
            let panel = d3.select("#sample-metadata").html("");
            for (item in metadataArray){
                panel.append("h5").text(`${item}: ${metadataArray[item]}`)
            }
        }
    );
};

// Function to initialize the first charts and panel
function init() {
    d3.json(queryUrl).then(
        function (data) {
            let sampleNames = data.names;
            console.log(sampleNames);
            let dropdownMenu = d3.select("#selDataset");

            // Loops through sampleNames object to append dropdown menu with opens that have sample names as their values
            for (item in sampleNames) {
                // console.log(item);
                dropdownMenu.append("option").text(sampleNames[item]).property("value",sampleNames[item])
            };

            // Initializes the page to display the first person's charts and panel
            getCharts(sampleNames[0]);
            getMetaData(sampleNames[0]);
        }
    );
};

// Function that displays charts and panel of the value the dropdown menu is changed to
function optionChanged(value) {
    getCharts(value);
    getMetaData(value);
};

init();


