<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme

const animationDuration = 2000

export default {
  // mixins: [resize],
  props: {
    company: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    chartData: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
        this.initChart(val);
      }
    }
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {

      this.chart = echarts.init(this.$el, 'macarons')
      let trafficWay = [
        {
          name: "农药残留",
          value: 20,
        },
        {
          name: "农药残留",
          value: 10,
        },
        {
          name: "农药残留",
          value: 30,
        },
        {
          name: "农药残留",
          value: 40,
        },
        {
          name: "农药残留",
          value: 40,
        },
      ];
      let nameArray = trafficWay.map((item) => {
        return item.name+','+item.value;
      });

      let data = [];
      let color = [
        "#2ca1ff",
        "#0adbfa",
        "#febe13",
        "#65e5dd",
        "#7b2cff",
        "#fd5151",
        "#f071ff",
        "#85f67a",
      ];
      for (let i = 0; i < trafficWay.length; i++) {
        data.push(
          {
            value: trafficWay[i].value,
            name: trafficWay[i].name+','+trafficWay[i].value,
            itemStyle: {
              normal: {

              },
            },
          },
          {
            value: 2,
            name: "",
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                color: "rgba(0, 0, 0, 0)",
                borderColor: "rgba(0, 0, 0, 0)",
                borderWidth: 0,
              },
            },
          }
        );
      }

      let option = {
        color: color,

        tooltip: {
          show: false,
        },
        legend: [
          {
            icon: `path://M881.387 297.813c38.08 65.387 57.28 136.747 57.28 214.187s-19.094 148.8-57.28 214.187c-38.187 65.28-89.92 117.12-155.2 155.2S589.44 938.667 512 938.667s-148.8-19.094-214.187-57.28c-65.28-38.08-117.013-89.814-155.306-155.307C104.427 660.8 85.333 589.44 85.333 512c0-77.333 19.094-148.693 57.28-214.187 38.08-65.28 89.814-117.013 155.307-155.306C363.2 104.533 434.56 85.333 512 85.333c77.333 0 148.693 19.094 214.187 57.28 65.28 38.187 117.013 89.92 155.2 155.2z m-217.707-47.36C617.387 223.467 566.827 209.92 512 209.92s-105.387 13.547-151.68 40.533-82.987 63.68-109.973 109.974c-26.987 46.293-40.534 96.853-40.534 151.68s13.547 105.386 40.534 151.68c26.986 46.293 63.68 82.986 109.973 109.973 46.293 26.987 96.853 40.533 151.68 40.533s105.387-13.546 151.68-40.533c46.293-26.987 82.987-63.68 109.973-109.973 26.987-46.294 40.534-96.854 40.534-151.68s-13.547-105.387-40.534-151.68c-27.093-46.294-63.786-82.987-109.973-109.974z`,
            orient: "vertical",
            // x: 'left',
            data: nameArray.slice(0, 8),
            left: 0,
            top: "center",
            align: "left",
            formatter: function (param){
              let sd=param.split(",");
              return '{a|'+sd[0]+'} {b|'+sd[1]+'}'
            },
            textStyle: {
              //rich放在textStyle里面
              rich: {
                a: {
                  color: '#fff',
                  lineHeight: 10
                },
                b: {
                  color: '#fff',
                  lineHeight: 10
                },

              }
            },
            itemGap: 5,
          }
        ],
        toolbox: {
          show: false,
        },
        series: [
          {
            name: "",
            type: "pie",
            clockWise: false,
            radius: ['30%','60%'],
            center: ["80%", "50%"],
            left: "20%",
            top: "center",
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
              },
            },
            data: data,
          },
        ],
      };


      this.chart.setOption(option);

    }
  }
}
</script>
