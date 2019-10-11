import Vue from 'vue/dist/vue.js';
import VueMqtt from 'vue-mqtt';
var $ = require("jquery");
require('bootstrap');

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
    },
    mounted(){
	console.log("server ip address is: "+ipAddress);
	if(ipAddress == '::1')
	    ipAddress = 'localhost';
        console.log("vue mounted");
        Vue.use(VueMqtt, 'mqtt://'+ipAddress+':9001', {clientId: 'WebClient-' + parseInt(Math.random() * 100000)});
        this.$mqtt.subscribe('#');
        this.$mqtt.on("message", function(topic, message) {
            self = this;
            console.log("topic:"+topic+", message:"+message);
	    var topicArray = topic.split('/');
	    console.log(JSON.stringify(topicArray));
	    if(topicArray[0] == 'data' && topicArray[1] == 'numeric'){
		var val = parseFloat(message);
		var name = topicArray[2];
		console.log("numeric:"+topicArray[2]+" has a value of "+val);
		var found = false;
		var updatedAt = new Date();
		$.each(self.numericData, function(index,value){
		    if(name == value.name){
			found = true;
			self.numericData[index].values.push(val);
			self.numericData[index].timestamps.push(updatedAt);
			self.numericData[index].latestValue = val;
			self.numericData[index].lastUpdated = updatedAt;
		    }
		});
		if(!found){
		    var t = {name: name, values:[], timestamps:[]};
		    t.values.push(val);
		    t.timestamps.push(updatedAt);
		    t.latestValue = val;
		    t.lastUpdated = updatedAt;
		    self.numericData.push(t);
		}
	    } else if (topicArray[0] == 'processor' && topicArray[1] == 'heartbeat'){
		this.lastProcessorUpdate = new Date();
		this.secondsSinceProcessorUpdate = 0;
		var msg = JSON.parse(message); // message = {"logging":true/false}
		this.logging = msg.logging;
	    }
        }.bind(this));
	setInterval(this.updateSecondsSinceProcessor,1000);
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
	    this.$mqtt.publish("processor/logging","start");
	},
	stopLogging: function(){
	    this.$mqtt.publish("processor/logging","stop");
	},
	updateSecondsSinceProcessor: function(){
	    this.secondsSinceProcessorUpdate = (new Date().getTime() - this.lastProcessorUpdate.getTime()) / 1000;
	}
    }
});
