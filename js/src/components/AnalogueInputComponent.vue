<template>
  <div class="mb-2 mt-2">
    <div class="accordian" id="accordianModuleAnalogueInput">
      <div class="card" v-for="(module, index) in modules">
        <div class="card-header" data-toggle="collapse" :data-target="'#collapse'+module.id">
          Module: {{module.id}}
        </div>
        <div :id="'collapse'+module.id" class="collapse" :class="[index==0 ? 'show' : '']" data-parent="#accordianModuleAnalogueInput">
          <div class="card-body">
            <h4>Channels:</h4>
            <analogue-input-settings-component v-for="(channel, index) in module.channels" :initial-settings="channel" :key="index"
              :module-id="module.id" :index="index"></analogue-input-settings-component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props:['modules']
  }
</script>