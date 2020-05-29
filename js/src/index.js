import Vue from 'vue';
import VueMqtt from 'vue-mqtt';
var $ = require("jquery");
require('bootstrap');

Vue.component('analogue-input-component', require('./components/AnalogueInputComponent.vue').default);
Vue.component('analogue-input-settings-component', require('./components/AnalogueInputSettingsComponent.vue').default);
Vue.component('home-component', require('./components/HomeComponent.vue').default);
Vue.component('latest-values-component', require('./components/LatestValuesComponent.vue').default);
Vue.component('manual-input-component', require('./components/ManualInputComponent.vue').default );


var mychartLabels = [];
var mychartDatasets = [];
window.onload = function(){
	var ctx2 = document.getElementById('myChart2').getContext('2d');
	window.myChart3 = new Chart(ctx2, {
    type: 'line',
    data: {
		labels: mychartLabels,
		datasets: mychartDatasets
	  },
    options: { 
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales:{
        xAxes:[{
          display:false,
          gridLines: {
            display: false,
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
  });
};



var app = new Vue({
  el: '#app',
  data: {
    numericData:[],
    logging: false,
    lastProcessorUpdate: new Date(),
    secondsSinceProcessorUpdate: 0,	
    logFileName: '',
    logFilePath: '',
    logFileSize: '',
    chartColors: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    graphCounter:0,
    modulesAnalogueInput:[]
  },
  mounted(){
		console.log("server ip address is: "+ipAddress);
		if(ipAddress == '::1' || true)
	  	ipAddress = 'localhost';
    console.log("vue mounted");
    Vue.use(VueMqtt, 'mqtt://'+ipAddress+':9001', {clientId: 'WebClient-' + parseInt(Math.random() * 100000)});
    this.$mqtt.subscribe('#');
    this.$mqtt.on("message", function(topic, message) {
      self = this;
      //console.log("topic:"+topic+", message:"+message);
			var topicArray = topic.split('/');
			//console.log(JSON.stringify(topicArray));
			if(topicArray[0] == 'data' && topicArray[1] == 'numeric'){
	  		var val = parseFloat(message);
	  		var name = topicArray[2];
		  	//console.log("numeric:"+topicArray[2]+" has a value of "+val);
			  var found = false;
			  var updatedAt = new Date();
			  $.each(self.numericData, function(index,value){
				  if(name == value.name){
					  found = true;
					  self.numericData[index].latestValue = val;
					  self.numericData[index].lastUpdated = updatedAt;
				  }
			  });
			  if(!found){
				  var t = {name: name, values:[], timestamps:[]};
          t.latestValue = val;
				  t.lastUpdated = updatedAt;
				  self.numericData.push(t);
				  t = {label:name,backgroundColor:self.chartColors[self.numericData.length % 7],borderColor:self.chartColors[self.numericData.length % 7],data:[],lineTension:0,fill:false};
          for(var i=0;i<mychartDatasets.length;i++){
					  mychartDatasets[i].data = [];
				  }
				  mychartDatasets.push(t);
				  self.graphCounter = 0;
			  }
			} else if (topicArray[0] == 'processor' && topicArray[1] == 'heartbeat'){
			  this.lastProcessorUpdate = new Date();
			  this.secondsSinceProcessorUpdate = 0;
			  var msg = JSON.parse(message); // message = {"logging":true/false}
        this.logging = msg.logging;
        if(this.logging){
          this.logFilePath='';
          this.logFileName = '';
        }
      } else if (topicArray[0] == 'processor' && topicArray[1] == 'loggingStart'){
        self.logFileName = '';
			} else if (topicArray[0] == 'processor' && topicArray[1] == 'loggingStop'){
			  var msg = JSON.parse(message);
			  self.logFileName = msg.filename;
			  self.logFilePath = msg.path;
			} else if (topicArray[0] == 'processor' && topicArray[1] == 'fileSize'){
			  self.logFileSize = new TextDecoder("utf-8").decode(message);
      } else if (topicArray[0]=='inputAnalogue'){
        /*
          {"id":0,"broker":"localhost","channels":[{"name":"torque_Nm"}]}
        */
        console.log("got an analogue input module message");
        var found = -1;
        var data = JSON.parse(message);
        for(var i=0;i<this.modulesAnalogueInput.length;i++){
          if(data.id == this.modulesAnalogueInput[i].id)
            found = i;
        }
        console.log("found: "+found);
        if(found != -1){
          this.modulesAnalogueInput[found] = data;
        }else{
          this.modulesAnalogueInput.push(data);
        }
      }
      
		
    }.bind(this));
	  setInterval(this.updateSecondsSinceProcessor,1000);
	  setInterval(this.updateGraph,1000);
	  console.log("mount success");
  },
  methods: {
		updateSecondsSinceProcessor: function(){
			this.secondsSinceProcessorUpdate = (new Date().getTime() - this.lastProcessorUpdate.getTime()) / 1000;
		},
		updateGraph: function(){
			var i = 0;
			var self = this;
			var maxLength = 3600;
			for(i = 0; i<self.numericData.length;i++){
				mychartDatasets[i].data.push(self.numericData[i].latestValue);
				if(mychartDatasets[i].data.length>maxLength)
					mychartDatasets[i].data.splice(0,1);
			}
			mychartLabels.push(self.graphCounter);
			if(mychartLabels.length>maxLength)
				mychartLabels.splice(0,1);
			self.graphCounter++;
			window.myChart3.update();
		}
  }
});
