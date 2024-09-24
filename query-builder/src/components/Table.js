import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';

Highcharts3D(Highcharts);

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function Chart({ chartData, selectedChartType, colorsArray, show3D }) {
  const chartOptions = React.useMemo(() => {
    const commonOptions = {
      chart: {
        backgroundColor: '#f3f3fe',
        options3d: {
          enabled: show3D,
          alpha: 15,
          beta: 15,
          depth: 50,
          viewDistance: 25
        },
      },
      title: {
        text: `${chartData.xAxis} - ${chartData.yAxis} Chart`,
        style: {
          color: '#545f6f',
        },
      },
      credits: {
        enabled: false,
      },
      colors: colorsArray,
    };

    if (selectedChartType === 'pie') {
      return {
        ...commonOptions,
        chart: {
          ...commonOptions.chart,
          options3d: {
            ...commonOptions.chart.options3d,
            alpha: 45,
            beta: 0,
          },
          type: 'pie',
        },
        series: [
          {
            name: chartData.yAxis,
            data:
              chartData.data.length > 25
                ? [
                    ...chartData.data.slice(0, 25).map((item) => ({
                      name: Object.values(item)[0] || 'Unknown',
                      y: parseInt(Object.values(item)[1]),
                    })),
                    {
                      name: 'Others',
                      y: chartData.data
                        .slice(25)
                        .reduce(
                          (acc, item) =>
                            acc + parseInt(Object.values(item)[1]),
                          0
                        ),
                      color: colorsArray[colorsArray.length - 1],
                    },
                  ]
                : chartData.data.map((item) => ({
                    name: Object.values(item)[0] || 'Unknown',
                    y: parseInt(Object.values(item)[1]),
                  })),
          },
        ],
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
          },
        },
      };
    }

    const xAxisCategories = chartData.data.map(
      (item) => Object.values(item)[0] || 'Unknown'
    );
    const yAxisData = chartData.data.map((item) =>
      parseInt(Object.values(item)[1])
    );

    if (selectedChartType === 'line') {
      return {
        ...commonOptions,
        chart: {
          ...commonOptions.chart,
          type: 'line',
        },
        xAxis: {
          categories: xAxisCategories,
          title: {
            text: chartData.xAxis,
          },
        },
        yAxis: {
          title: {
            text: chartData.yAxis,
          },
        },
        series: [
          {
            name: chartData.yAxis,
            data: yAxisData,
          },
        ],
      };
    }

    return {
      ...commonOptions,
      chart: {
        ...commonOptions.chart,
        type: 'bar',
      },
      xAxis: {
        categories: xAxisCategories,
        title: {
          text: chartData.xAxis,
        },
      },
      yAxis: {
        title: {
          text: chartData.yAxis,
        },
      },
      series: [
        {
          name: chartData.yAxis,
          data: yAxisData,
        },
      ],
    };
  }, [chartData, selectedChartType, colorsArray, show3D]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      containerProps={{ style: { height: '40%', minHeight: '40%', overflow: 'auto', borderRadius: '.375rem', border: '1px solid rgba(200,206,237,1)' } }}
      options={chartOptions}
    />
  );
}

function DataTable({ data }) {
  return (
    <div className="overflow-auto w-full radius-md shadow-md max-h-2/5 min-h-2/5">
      <table className="w-full border border-navy-100 overflow-auto whitespace-nowrap radius-md">
        <thead className="sticky top-0">
          <tr>
            {Object.keys(data[0]).map((key, index) => (
              <th key={key + index} className="border border-navy-100 bg-navy-100 text-white p-2">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={Object.values(item).join('') + index}>
              {Object.values(item).map((value, i) => (
                <td key={value + i} className="border border-navy-100 p-2">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Table({ data, chartData }) {
  const colorsArray = React.useMemo(() => Array.from({ length: 26 }, getRandomColor), [chartData]);
  const [selectedChartType, setSelectedChartType] = React.useState('pie');
  const [show3D, setShow3D] = React.useState(false);

  const handle3DChange = (e) => {
    setShow3D(e.target.checked);
  }

  return (
    <>
      <h2>Chart:</h2>
      <div className="flex items-center space-x-4">
        <select
          className="border border-navy-100 p-2 radius-md bg-white shadow-md cursor-pointer hover:bg-gray-25 transition-colors duration-200 ease-in-out w-full"
          value={selectedChartType}
          onChange={(e) => setSelectedChartType(e.target.value)}
        >
          <option value="pie">Pie</option>
          <option value="bar">Bar</option>
          <option value="line">Line</option>
        </select>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="3d" name="3d" className="cursor-pointer" onChange={handle3DChange} />
          <label htmlFor="3d" className="cursor-pointer">3D</label>
        </div>
      </div>
      <Chart chartData={chartData} selectedChartType={selectedChartType} colorsArray={colorsArray} show3D={show3D} />
      <h2>Table:</h2>
      <DataTable data={data} />
    </>
  );
}
