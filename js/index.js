import Vue from 'vue/dist/vue.js';
import VueMqtt from 'vue-mqtt';
var $ = require("jquery");

var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello there!',
		mqtt:[],
		pubTopic:'test/topic/1',
		pubPayload:'something',
		
	},
	mounted(){
        console.log("vue mounted");
        Vue.use(VueMqtt, 'mqtt://'+'localhost'+':9001', {clientId: 'WebClient-' + parseInt(Math.random() * 100000)});
        this.$mqtt.subscribe('#');
        this.$mqtt.on("message", function(topic, message) {
            self = this;
            console.log("topic:"+topic+", message:"+message);
            var found = false;
            $.each(self.mqtt,function(index,value){
                //console.log("index:"+index+", topic: "+value.topic+", payload:"+value.payload);
                if(value.topic == topic){
                    console.log("found the topic: "+topic+" and will update it");
                    found = true;
                    self.mqtt[index].payload = message;
                }
            });
            if(!found){
                self.mqtt.push({topic:topic,payload:JSON.parse(message)});
            }
        }.bind(this));
	console.log("mount success");
    },
    methods: {
		publishMsg: function(){
			alert("will publish");
			this.$mqtt.publish(this.pubTopic,this.pubPayload);
		}
	}
});
