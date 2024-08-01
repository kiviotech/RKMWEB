import React from 'react';
import Chart from 'react-apexcharts';
import './Graph.scss'; // Import the CSS file for styling

const Graph = ({ series, colors, width, height }) => {
    const options = {
        chart: {
            type: 'donut',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '80%',
                    background: 'transparent',
                },
            }
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: false, // Disable tooltips
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: colors,
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
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
