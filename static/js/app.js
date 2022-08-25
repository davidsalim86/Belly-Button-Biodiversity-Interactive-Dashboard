// Dataset list
function dropdown() {
    d3.json("../../samples.json").then((incomingData) => {
        var data = incomingData;
        console.log(data)
        var name = data.names;
        var selDataset = d3.select("#selDataset");
        name.forEach((name) => {
            selDataset.append("option").text(name).property("value", name);
        })
    })
};

// Demographic info
function demoInfo(id) {
    d3.json("../../samples.json").then((incomingData) => {
        var data = incomingData;
        var metadata = data.metadata;
        var metadataFilter = metadata.filter(x => x.id == id);
        var metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");
        metadataFilter.forEach((info) => {
            Object.entries(info).forEach(([key, value]) => {
                metadataPanel.append("p").text(`${key}:${value}`)
            })
        })
    })
};

// Barchart
function barchart(id) {
    d3.json("../../samples.json").then((incomingData) => {
        var data = incomingData;
        var sample = data.samples;
        var sampleFilter = sample.filter(x => x.id == id)[0];
        var otuIds = sampleFilter.otu_ids.slice(0, 10).reverse()
        var otuIdsString = otuIds.map(x => `OTU ${x}`)
        var otuFreq = sampleFilter.sample_values.slice(0, 10).reverse()
        var otuLabels = sampleFilter.otu_labels.slice(0, 10).reverse()
        var barData = [{
            x: otuFreq,
            y: otuIdsString,
            text: otuLabels,
            type: "bar",
            orientation: "h"
        }];
        var layout = {
            margin: { t: 50, l: 100 }
        };
        Plotly.newPlot("bar", barData, layout)
    })
}

// Bubblechart
function bubblechart(id) {
    d3.json("../../samples.json").then((incomingData) => {
        var data = incomingData;
        var sample = data.samples;
        var sampleFilter = sample.filter(x => x.id == id)[0];
        var otuIds = sampleFilter.otu_ids
        var otuFreq = sampleFilter.sample_values
        var otuLabels = sampleFilter.otu_labels
        var bubbleData = [{
            x: otuIds,
            y: otuFreq,
            text: otuLabels,
            mode: "markers",
            marker: {
                color: otuIds,
                size: otuFreq,
                sizeref: 1.5
            }
        }];
        var layout = {
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            autosize: true
        };
        Plotly.newPlot("bubble", bubbleData, layout);
    })
}

// Gauge (bonus part)
function gauge(id) {
    d3.json("../../samples.json").then((incomingData) => {
        var data = incomingData;
        var metadata = data.metadata;
        var metadataFilter = metadata.filter(x => x.id == id)[0];
        var wfreq = metadataFilter.wfreq;
        if (wfreq === null) {
            wfreq = 0
        }
        var gauge = {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            type: "indicator",
            mode: "gauge",
            gauge: {
                axis: {
                    range: [0, 9],
                    tickmode: "linear",
                    tickfont: { size: 15 }
                },
                bar: { color: "rgb(255, 0, 0)" },
                steps: [
                    { range: [0, 1], color: "rgb(140, 255, 26)" },
                    { range: [1, 2], color: "rgb(153, 255, 51)" },
                    { range: [2, 3], color: "rgb(166, 255, 77)" },
                    { range: [3, 4], color: "rgb(179, 255, 102)" },
                    { range: [4, 5], color: "rgb(191, 255, 128)" },
                    { range: [5, 6], color: "rgb(204, 255, 153)" },
                    { range: [6, 7], color: "rgb(217, 255, 179)" },
                    { range: [7, 8], color: "rgb(230, 255, 204)" },
                    { range: [8, 9], color: "rgb(243, 255, 230)" },
                ]
            }
        };
        var level = wfreq / 9 * 180;
        var degrees = 180 - level,
            radius = 0.7;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        var mainPath = "M -.0 -0.025 L .0 0.025 L ",
            pathX = String(x),
            space = " ",
            pathY = String(y),
            pathEnd = " Z";
        var path = mainPath.concat(pathX, space, pathY, pathEnd);
        var data = {
            type: 'scatter',
            x: [0],
            y: [0],
            marker: { size: 10, color: '850000' },
            showlegend: false,
            name: wfreq,
            hoverinfo: "name"
        }
        var gaugeData = [gauge, data];
        var layout = {
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
            }],
            margin: { t: 0, b: 125, r: 50, l: 50 },
            xaxis: {
                zeroline: false, showticklabels: false,
                showgrid: false, range: [-1, 1]
            },
            yaxis: {
                zeroline: false, showticklabels: false,
                showgrid: false, range: [-0.5, 1.5]
            }
        };
        Plotly.newPlot("gauge", gaugeData, layout);
    })
}

var defaultId = 940

function init() {
    dropdown();
    demoInfo(defaultId);
    barchart(defaultId);
    bubblechart(defaultId);
    gauge(defaultId);
}

init()

function optionChanged(id) {
    demoInfo(id);
    barchart(id);
    bubblechart(id);
    gauge(id);
}