<template>
              <chart :chart-data="datacollection"></chart>
    </template>
    <script>
    import Chart from "./../Chart.js";
    export default {
      components: {
        Chart
      },
      data() {
        return {
          datacollection2: {}
        };
      },
      props:['datacollection'],
      created(){
        //this.fillData();
      },
      mounted() {
        
        //setInterval(this.myUpdate,1000);
      },
      methods: {
        fillData() {
          this.datacollection = {
            labels: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ],
            datasets: [
              {
                label: "GitHub Commits",
                backgroundColor: "#f87979",
                data: [70, 20, 12, 39, 100, 40, 95, 80, 80, 20, 12, 101]
              },
              {
                label: "Monthly incomes",
                backgroundColor: "#A5CC82",
                data: [205, 408, 188, 190, 58, 200, 190, 400, 164, 254, 290, 201]
              }
            ]
          };
        },
        myUpdate(){
          this.datacollection.datasets[0].data.push(Math.random()*100);
          this.datacollection.datasets[1].data.push(Math.random()*400);
          this.datacollection.labels.push('1');
        }
      }
    };
    </script>
    <style>
    </style>