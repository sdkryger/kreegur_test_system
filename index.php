<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<title>
			Kreegur
		</title>
	</head>
	<body>
		<div id="app" class="container-fluid mt-2">
    
      <home-component :logging="logging" :log-file-size="logFileSize" :log-file-path="logFilePath"
        :seconds-since-processor-update="secondsSinceProcessorUpdate" :log-file-name="logFileName"
        :numeric-data="numericData"></home-component>
			<div class="row justify-content-center">
				<div class="col-11">
					<canvas id="myChart2" width="400" height="400"></canvas>
				</div>
			</div>
			
	
		</div>
		<link rel="stylesheet" href="css/bootstrap.css">
		<script>
			var ipAddress = "<?php echo $_SERVER['SERVER_ADDR']; ?>";
		</script>
		<script src="js/node_modules/chart.js/dist/Chart.js"></script>
		<script src="js/dist/bundle.js">
		</script>
	</body>

</html>
