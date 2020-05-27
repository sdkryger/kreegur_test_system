<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Test Rig</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item" @click="nav('home')">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item" @click="nav('latestValues')">
            <a class="nav-link" href="#">Latest Values</a>
          </li>
          <li class="nav-item" @click="nav('manualInput')">
            <a class="nav-link" href="#">Manual Input</a>
          </li>
        </ul>
      </div>
    </nav>
    <span class="badge badge-pill badge-danger" v-if="secondsSinceProcessorUpdate > 2">Error - no comms</span>
		<span class="badge badge-pill badge-success" v-if="logging" @click="stopLogging">
      Logging to file (size: {{logFileSize}}) - click to stop
    </span>
		<span class="badge badge-pill badge-danger" v-if="!logging && secondsSinceProcessorUpdate <= 2" @click="startLogging">
      NOT logging to file - click to start
    </span>
    <div class="alert alert-success col-12" v-if="logFileName != ''">
			Log file created: <a :href="logFilePath" download>{{logFileName}}</a>
		</div>
    <manual-input-component v-show="view=='manualInput'"></manual-input-component>
    <latest-values-component v-if="view=='latestValues'" :numericData="numericData"></latest-values-component>
  </div>

</template>

<script>
  export default{
    data(){
      return{
        message:'home',
        view:'graph'
      }
    },
    methods:{
      nav(target){
        this.view = target;
      },
      startLogging: function(){
        this.logFileName = '';
        var msg = {};
        msg.command = 'start';
        //msg.trigger = this.trigger;
        this.$mqtt.publish("processor/logging",JSON.stringify(msg));
      },
      stopLogging: function(){
        var msg = {};
        msg.command = 'stop';
        this.$mqtt.publish("processor/logging",JSON.stringify(msg));
      },
		
    },
    props:['logging','logFileSize','logFileName','logFilePath','secondsSinceProcessorUpdate','numericData']
  }
</script>