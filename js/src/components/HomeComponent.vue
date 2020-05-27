<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Navbar</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item" @click="nav('home')">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item" @click="nav('logging')">
            <a class="nav-link" href="#">Logging</a>
          </li>
          <li class="nav-item" @click="nav('manualInput')">
            <a class="nav-link" href="#">Manual Input</a>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
          </li>
        </ul>
      </div>
    </nav>
    <manual-input-component v-if="view=='manualInput'"></manual-input-component>
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
      }
    }
  }
</script>