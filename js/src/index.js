import Vue from 'vue';
import VueMqtt from 'vue-mqtt';
var $ = require("jquery");
require('bootstrap');

Vue.component('manual-input-component', require('./components/ManualInputComponent.vue').default );
Vue.component('home-component', require('./components/HomeComponent.vue').default);

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
console.log("sucess");
};



var app = new Vue({
    el: '#app',
    data: {
		showManual: false,
		showLatestValues: false,
		showLogging: false,
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
		showOutputs: false,
		outputs: [
			{
				name: 'output/0',
				description: 'Heater',
				conditions:[],
				newConditionChannel: '',
				newConditionGreaterThan: 'true',
				newThreshold: '0',
				error: false,
				newConditionOn: 'true',
				outputOn:false
			},
			{
				name: 'output/1',
				description: 'Motor',
				conditions:[],
				newConditionChannel: '',
				newConditionGreaterThan: 'true',
				newThreshold: '0',
				error: false,
				newConditionOn: 'true',
				outputOn:false
			},
		],
		control: false,
		settings: false,
		showSettings: false,
		settingsList:[]
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
				//self.graphDatasets.push(t);
				
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
			} else if (topicArray[0] == 'processor' && topicArray[1] == 'loggingStop'){
			var msg = JSON.parse(message);
			self.logFileName = msg.filename;
			self.logFilePath = msg.path;
			} else if (topicArray[0] == 'processor' && topicArray[1] == 'fileSize'){
			self.logFileSize = message;
			} else if (topicArray[0] == 'setting'){
				self.settings = true;
				var found = false;
				var receivedSetting = JSON.parse(message);
				// check if the setting is there already
				for(var i=0;i<self.settingsList.length;i++){
					if(self.settingsList[i].returnTopic == receivedSetting.returnTopic){
						found = true;
						self.settingsList[i] = receivedSetting;
					}

				}

				// message expected... {"name":"ch0_b","description":"Channel 0 y-intercept (b)","value":0,"dataType":"numeric","returnTopic":"plc/ch/0/b"}
				if(!found){
					self.settingsList.push(JSON.parse(message));
				}
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
		toggleShowOutputs: function(){
			this.showOutputs= !this.showOutputs;
		},
		toggleShowSettings: function(){
			this.showSettings= !this.showSettings;
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
		},
		addCondition: function(index){
			var self = this;
			if(self.outputs[index].newConditionChannel == ''){
				self.outputs[index].error = true;
			} else {
				self.outputs[index].error = false;
				self.outputs[index].conditions.push(
					{
						channel:self.outputs[index].newConditionChannel,
						greaterThan:self.outputs[index].newConditionGreaterThan == 'true',
						threshold:parseFloat(self.outputs[index].newThreshold),
						on: self.outputs[index].newConditionOn == 'true'
					}
					);
			}
			
		},
		removeCondition: function(outputIndex,conditionIndex){
			this.outputs[outputIndex].conditions.splice(conditionIndex,1);
		},
		setState: function(state,index){
			this.outputs[index].outputOn = state;
		},
		settingChange: function(index){
			var self = this;
			//alert("index: "+index+", the new setting value is: "+self.settingsList[index].value.toString()+" and the topic is: "+self.settingsList[index].returnTopic);
			this.$mqtt.publish(self.settingsList[index].returnTopic,self.settingsList[index].value.toString());
		}
    }
});
