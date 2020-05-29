<template>
  <form class="border rounded mb-2 p-2">
    <div class="form-group mb-1">
      <label class='mb-0'>Name <span v-if="name != initialSettings.name" class="badge badge-pill badge-warning">Unsaved changes</span></label>
       <input type="text" class="form-control form-control-sm" v-model="name">
    </div>
    <div class="form-row">
      <div class="form-group mb-1 col-md-6">
        <label class='mb-0'>Raw low <span v-if="rawLow != initialSettings.rawLow" class="badge badge-pill badge-warning">Unsaved changes</span></label>
        <input type="text" class="form-control form-control-sm" v-model="rawLow">
      </div>
      <div class="form-group mb-1 col-md-6">
        <label class='mb-0'>Eng low <span v-if="engLow != initialSettings.engLow" class="badge badge-pill badge-warning">Unsaved changes</span></label>
        <input type="text" class="form-control form-control-sm" v-model="engLow">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group mb-1 col-md-6">
        <label class='mb-0'>Raw high <span v-if="rawHigh != initialSettings.rawHigh" class="badge badge-pill badge-warning">Unsaved changes</span></label>
        <input type="text" class="form-control form-control-sm" v-model="rawHigh">
      </div>
      <div class="form-group mb-1 col-md-6">
        <label class='mb-0'>Eng high <span v-if="engHigh != initialSettings.engHigh" class="badge badge-pill badge-warning">Unsaved changes</span></label>
        <input type="text" class="form-control form-control-sm" v-model="engHigh">
      </div>
    </div>
    <div class="form-group form-check mb-1">
      <input type="checkbox" class="form-check-input" v-model="enable">
      <label>Enable <span v-if="enable != initialSettings.enable" class="badge badge-pill badge-warning">Unsaved changes</span></label>
    </div>
    <div class="btn btn-primary" @click="init" v-if="changes">Cancel</div>
    <div class="btn btn-primary" @click="save" v-if="changes">Save</div>
  </form>
</template>

<script>
  export default{
    props:['initialSettings','moduleId','index'],
    data(){
      return{
        enable:this.initialSettings.enable,
        name:this.initialSettings.name,
        rawLow:this.initialSettings.rawLow,
        rawHigh:this.initialSettings.rawHigh,
        engLow:this.initialSettings.engLow,
        engHigh:this.initialSettings.engHigh
      }
    },
    methods:{
      init(){
        this.enable=this.initialSettings.enable;
        this.name=this.initialSettings.name;
        this.rawLow=this.initialSettings.rawLow;
        this.rawHigh = this.initialSettings.rawHigh;
        this.engLow = this.initialSettings.engLow;
        this.engHigh = this.initialSettings.engHigh;
      },
      save(){
        var setting = {
          name: this.name,
          enable: this.enable,
          rawLow: this.rawLow,
          rawHigh: this.rawHigh,
          engLow: this.engLow,
          engHigh: this.engHigh
        };
        var payload = JSON.stringify(setting);
        var topic = 'analogueModule/'+this.moduleId+'/channelSetting/'+this.index;
        this.$root.$mqtt.publish(topic,payload);
        console.log("topic: "+topic+", payload: "+payload);
      }
    },
    computed:{
      changes(){
        var changes = false;
        if(this.name != this.initialSettings.name)
          changes = true;
        if(this.enable != this.initialSettings.enable)
          changes = true;
        if(this.rawLow != this.initialSettings.rawLow)
          changes = true;
        if(this.rawHigh != this.initialSettings.rawHigh)
          changes = true;
        if(this.engLow != this.initialSettings.engLow)
          changes = true;
        if(this.engHigh != this.initialSettings.engHigh)
          changes = true;
        return changes;
      }
    }
  }
</script>