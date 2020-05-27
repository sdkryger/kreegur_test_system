<template> 
  <div>
    <div class="form-group">
			<label for="pubTopic">Topic</label>
			<input id="pubTopic" class="form-control" type="text" v-model="pubTopic">
		</div>
		<div class="form-group">
			<label for="pubPayload">Payload</label>
			<input id="pubPayload" class="form-control" type="text" v-model="pubPayload">
		</div>
		<button class="btn btn-primary" @click="publishMsg">Publish</button>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        message:'hi',
        pubTopic:'data/numeric/pressure_kPa',
        pubPayload:'4.56'
      }
    },
    methods:{
      publishMsg(){
        console.log("Trying to publish manual message");
        this.$root.$mqtt.publish(this.pubTopic,this.pubPayload);
        console.log("Success?");
      }
    }
  }
</script>