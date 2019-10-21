import Vue from 'vue';
import VueMqtt from 'vue-mqtt';
var $ = require("jquery");
require('bootstrap');
import Visualisation from './components/Visualisation.vue';

var app = new Vue({
    el: '#app',
    data: {
		showManual: false,
		showLatestValues: true,
		showLogging: true,
		pubTopic:'data/numeric/temperatureOuter',
		pubPayload:'1.23',
		numericData:[],
		logging: false,
		lastProcessorUpdate: new Date(),
		secondsSinceProcessorUpdate: 0,	
		trigger:'',	
		triggerError: false,
		logFileName: '',
		logFilePath: '',
		logFileSize: '',
		datacollection: {},
		graphLabels:[],
		graphDatasets:[],
		graphData:{},
		chartColors: [
			'rgb(255, 99, 132)',
			'rgb(255, 159, 64)',
			'rgb(255, 205, 86)',
			'rgb(75, 192, 192)',
			'rgb(54, 162, 235)',
			'rgb(153, 102, 255)',
			'rgb(201, 203, 207)'
		],
		graphCounter:0
	},
	components: {
        Visualisation
    },
    mounted(){
		this.graphData.labels = this.graphLabels;
		this.graphData.datasets = this.graphDatasets;
		this.datacollection = {
			labels: [0,1,2,3,4,5,6,7,8,9,10,11],
            datasets: [
				{
					label: "GitHub Commits",
					backgroundColor: "#f87979",
					data: [70, 20, 12, 39, 100, 40, 95, 80, 80, 20, 12, 101],
					lineTension: 0
				  },
				  {
					label: "Monthly incomes",
					backgroundColor: "#A5CC82",
					data: [205, 408, 188, 190, 58, 200, 190, 400, 164, 254, 290, 201],
					lineTension: 0
				  }
            ]
          };
	console.log("server ip address is: "+ipAddress);
	if(ipAddress == '::1')
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
				//self.numericData[index].values.push(val); // data for graph
				//self.numericData[index].timestamps.push(updatedAt); //data for graph
				self.numericData[index].latestValue = val;
				self.numericData[index].lastUpdated = updatedAt;
		    }
		});
		if(!found){
		    var t = {name: name, values:[], timestamps:[]};
		    //t.values.push(val); //data for graph
		    //t.timestamps.push(updatedAt); //data for graph
		    t.latestValue = val;
		    t.lastUpdated = updatedAt;
			self.numericData.push(t);
			t = {label:name,backgroundColor:self.chartColors[self.numericData.length % 7],borderColor:self.chartColors[self.numericData.length % 7],data:[],lineTension:0,fill:false};
			self.graphDatasets.push(t);
		}
	    } else if (topicArray[0] == 'processor' && topicArray[1] == 'heartbeat'){
		this.lastProcessorUpdate = new Date();
		this.secondsSinceProcessorUpdate = 0;
		var msg = JSON.parse(message); // message = {"logging":true/false}
		this.logging = msg.logging;
	    } else if (topicArray[0] == 'processor' && topicArray[1] == 'loggingStop'){
		var msg = JSON.parse(message);
		self.logFileName = msg.filename;
		self.logFilePath = msg.path;
	    } else if (topicArray[0] == 'processor' && topicArray[1] == 'fileSize'){
		self.logFileSize = message;
	    }
		
        }.bind(this));
	setInterval(this.updateSecondsSinceProcessor,1000);
	setInterval(this.updateGraph,1000);
	console.log("mount success");
    },
    methods: {
		publishMsg: function(){
			this.$mqtt.publish(this.pubTopic,this.pubPayload);
		},
		toggleShowManual: function(){
			this.showManual = !this.showManual;
		},
		toggleShowLatestValues: function(){
			this.showLatestValues = !this.showLatestValues;
		},
		toggleLogging: function(){
			this.showLogging= !this.showLogging;
		},
		startLogging: function(){
			if(this.trigger == ''){
			this.triggerError = true;
			}else{
			this.triggerError = false;
			this.logFileName = '';
			var msg = {};
			msg.command = 'start';
			msg.trigger = this.trigger;
			this.$mqtt.publish("processor/logging",JSON.stringify(msg));
			}
		},
		stopLogging: function(){
			var msg = {};
			msg.command = 'stop';
			this.$mqtt.publish("processor/logging",JSON.stringify(msg));
		},
		updateSecondsSinceProcessor: function(){
			this.secondsSinceProcessorUpdate = (new Date().getTime() - this.lastProcessorUpdate.getTime()) / 1000;
		},
		updateGraph: function(){
			var i = 0;
			var self = this;
			var maxLength = 3600;
			//self.graphLabels.push(self.graphLabels.length);
			for(i = 0; i<self.numericData.length;i++){
				self.graphDatasets[i].data.push(self.numericData[i].latestValue);
				if(self.graphDatasets[i].data.length>maxLength)
					self.graphDatasets[i].data.splice(0,1);
			}
			Vue.set(self.graphLabels,self.graphLabels.length,self.graphCounter);
			self.graphCounter++;
			if(self.graphLabels.length>100){
				self.graphLabels.splice(0,1);
			}
		}
    }
});
