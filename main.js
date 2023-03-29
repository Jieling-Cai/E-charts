var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;

const upColor = '#00da3c';
const upBorderColor = '#008F28';
const downColor = '#ec0000';
const downBorderColor = '#8A0000';

const myForm = document.getElementById("form");
const csvFile = document.getElementById("file");

function splitData(rawData) {
    let categoryData = [];
    let values = [];
    for (let i = 1; i < rawData.length; i++) {
      let new_line = rawData[i].split(',');
      categoryData.push(new_line.splice(0, 1)[0]);
      let temp = new_line[1];
      new_line[1] = new_line[3];
      new_line[3] = temp;
      values.push(new_line);
    }
    return {
      categoryData: categoryData.reverse(),
      values: values.reverse()
    };
}
  
function calculateMA(dayCount) {
    var result = [];
    for (var i = 0, len = data0.values.length; i < len; i++) {
        if (i < dayCount) {
        result.push('-');
        continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
        sum += +data0.values[i - j][1];
        }
        result.push(sum / dayCount);
    }
    return result;
}

myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = csvFile.files[0];
  const reader = new FileReader();
  // Each item: open，close，lowest，highest
  reader.onload = function (e) {
      const text = e.target.result;
      data0 = splitData(text.split('\n'));
      option = {
        title: {
          text: 'S&P 500 Index',
          left: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['S&P 500 Index', '50-day Moving Average', '200-day Moving Average']
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          data: data0.categoryData,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            top: '90%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            name: 'S&P 500 Index',
            type: 'candlestick',
            data: data0.values,
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: upBorderColor,
              borderColor0: downBorderColor
            },
            markPoint: {
              label: {
                formatter: function (param) {
                  return param != null ? Math.round(param.value) + '' : '';
                }
              },
              data: [
                {
                  name: 'highest value',
                  type: 'max',
                  valueDim: 'highest'
                },
                {
                  name: 'lowest value',
                  type: 'min',
                  valueDim: 'lowest'
                },
                {
                  name: 'average value on close',
                  type: 'average',
                  valueDim: 'close'
                }
              ],
              tooltip: {
                formatter: function (param) {
                  return param.name + '<br>' + (param.data.coord || '');
                }
              }
            },
            markLine: {
              symbol: ['none', 'none'],
              data: [
                [
                  {
                    name: 'from lowest to highest',
                    type: 'min',
                    valueDim: 'lowest',
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                      show: false
                    },
                    emphasis: {
                      label: {
                        show: false
                      }
                    }
                  },
                  {
                    type: 'max',
                    valueDim: 'highest',
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                      show: false
                    },
                    emphasis: {
                      label: {
                        show: false
                      }
                    }
                  }
                ],
                {
                  name: 'min line on close',
                  type: 'min',
                  valueDim: 'close'
                },
                {
                  name: 'max line on close',
                  type: 'max',
                  valueDim: 'close'
                }
              ]
            }
          },
          {
            name: '50-day Moving Average',
            type: 'line',
            data: calculateMA(50),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: '200-day Moving Average',
            type: 'line',
            data: calculateMA(200),
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          }
        ]
      };
      
      option && myChart.setOption(option);
  };
  reader.readAsText(input);
});
