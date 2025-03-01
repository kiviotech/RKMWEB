import React from 'react';
import Chart from 'react-apexcharts';
import './Graph.scss'; // Import the CSS file for styling

const Graph = ({ series, colors, width, height, labels }) => {
    // Calculate total for percentage
    const total = series.reduce((sum, value) => sum + value, 0);

    const options = {
        chart: {
            type: 'donut',
            events: {
                dataPointSelection: function (event, chartContext, config) {
                    // Handle slice selection if needed
                }
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '80%',
                    background: 'transparent',
                },
                expandOnClick: false
            }
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                }
            },
            active: {
                filter: {
                    type: 'none',
                }
            }
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: true,
            custom: function ({ series, seriesIndex, dataPointIndex }) {
                const value = series[seriesIndex];
                const percentage = ((value / total) * 100).toFixed(1);
                const label = labels ? labels[seriesIndex] : `Series ${seriesIndex + 1}`;
                return `<div class="custom-tooltip">
                    <span>${label}: ${value}</span><br/>
                    <span>${percentage}%</span>
                </div>`;
            },
            style: {
                fontSize: '12px',
                fontFamily: 'inherit'
            },
            theme: 'light',
            fillSeriesColor: false
        },
        colors: colors,
        legend: {
            show: false, // Disable legend
        },
    };

    return (
        <div className="chart-container">
            <Chart options={options} series={series} type="donut" width={width} height={height} />
        </div>
    );
}

export default Graph;
