<template> 
  <div class="border-bottom border-top mb-2 mt-2">
    <div class="form-group">
			<label for="pubTopic">Topic</label>
			<input id="pubTopic" class="form-control" type="text" v-model="pubTopic">
		</div>
		<div class="form-group">
			<label for="pubPayload">Payload</label>
			<input id="pubPayload" class="form-control" type="text" v-model="pubPayload">
		</div>
		<button class="btn btn-primary mb-1" @click="publishMsg">Publish</button>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        message:'hi',
        pubTopic:'inputAnalogue',//'data/numeric/pressure_kPa',
        pubPayload:`{"id":0,"broker":"localhost","channels":[
          {"name":"torque_Nm","enable":true,"rawLow":0,"rawHigh":1,"engLow":0,"engHigh":1},
          {"name":"speed_rpm","enable":true,"rawLow":0,"rawHigh":1,"engLow":0,"engHigh":1}
          ]}` //'4.56'
      }
    },
    methods:{
      publishMsg(){
        this.$root.$mqtt.publish(this.pubTopic,this.pubPayload);
      }
    }
  }
</script>