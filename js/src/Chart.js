import { Line, mixins } from 'vue-chartjs'
//import { Scatter } from 'vue-chartjs'
const {reactiveProp} = mixins

export default {
  extends: Line,
  //extends: Scatter,
  //props: ['chartData','message'],
  mixins: [reactiveProp],
  data() {
      return {
          options: { 
              responsive: true,
              maintainAspectRatio: false,
              animation: false,
              scales:{
                  xAxes:[{
                    gridLines: {
                        display: true,
                        drawBorder: true,
                        drawOnChartArea: false,
                      }
                  }],
                  yAxes:[{
                    gridLines: {
                        display: true,
                        drawBorder: true,
                        drawOnChartArea: false,
                      }
                  }]
              },
              elements:{
                  point:{
                      radius:0
                  }
              }
          }
      }
  },
  mounted() {
      setInterval(this.update,1000);
      this.renderChart(this.chartData,this.options)
  },
  methods: {
      update(){
          //console.log("Will update...");
          //this.renderChart(this.chartData, this.options);
            this.$data._chart.update();
      }
  }



}