<template>
  <div class="border-bottom border-top mb-2 mt-2">
    <table class="table table-sm table-striped">
      <thead>
        <th scope="col">Name</th>
        <th scope="col">Latest value</th>
        <th scope="col">Last updated</th>
      </thead>
      <tbody>
        <tr v-for="d in numericData">
          <td>{{d.name}}</td>
          <td>{{d.latestValue}}</td>
          <td>{{d.lastUpdated}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default{
    data(){
      return {
        message:'latest values'
      }
    },
    props:['numericData']
  }
</script>