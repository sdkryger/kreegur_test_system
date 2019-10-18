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
			<div class="row justify-content-center mt-2">
				<div class="col-11">
					<div class="card">
						<div class="card-header" @click="toggleLogging">
							<span v-if="showLogging" class="mr-3">-</span><span v-if="!showLogging" class="mr-3">+</span> Logging 
							<span class="badge badge-pill badge-danger" v-if="secondsSinceProcessorUpdate > 2">Error - no comms</span>
							<span class="badge badge-pill badge-success" v-if="logging">Logging to file (size: {{logFileSize}})</span>
							<span class="badge badge-pill badge-danger" v-if="!logging">NOT logging to file</span>
						</div>
						<div class="card-body" v-if="showLogging">
							<div class="form-group">
								<label for="selectTrigger">Logging triggered by:</label>
								<select class="form-control" v-model="trigger" id="selectTrigger">
									<option v-for="num in numericData" :value="num.name">{{num.name}}</option>
								</select>
							</div>
							<div class="row">
								<div class="alert alert-warning col-12" v-if="triggerError">
									Must select a logging trigger to start logging. (If trigger select has no options, there is no current data. 
									Data can be manually input in the 'Manual Input' section.
								</div>
								<div class="alert alert-success col-12" v-if="logFileName != ''">
									Log file created: <a :href="logFilePath" download>{{logFileName}}</a>
								</div>
								<button class="btn btn-primary" v-if="!logging" @click="startLogging">Start</button>
								<button class="btn btn-primary" v-if="logging" @click="stopLogging">Stop</button>
							</div>
						</div>
					</div>
				</div>
				
			</div>
			
			<div class="row justify-content-center mt-2">
				<div class="col-11">
					<div class="card">
						<div class="card-header" @click="toggleShowLatestValues">
							<span v-if="showLatestValues" class="mr-3">-</span><span v-if="!showLatestValues" class="mr-3">+</span> Latest Values
						</div>
						<div class="card-body" v-if="showLatestValues">
							<div class="row border rounded mb-1" v-for="num in numericData">
								<div class="col-12 col-sm-4">
									{{num.name}}
								</div>
								<div class="col-12 col-sm-4">
									{{num.latestValue}}
								</div>
								<div class="col-12 col-sm-4">
									{{num.lastUpdated }}
								</div>
							</div>
						</div>
					</div>
				</div>
				
			</div>
			<div class="row justify-content-center mt-2">
				<div class="col-11">
					<div class="card">
						<div class="card-header" @click="toggleShowManual()">
							<span v-if="showManual" class="mr-3">-</span><span v-if="!showManual" class="mr-3">+</span> Manual Input
						</div>
						<div class="card-body" v-if="showManual">
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
						
					</div>
				</div>
				
				
			</div>
			
		</div>
		<link rel="stylesheet" href="css/bootstrap.css">
		<script>
			var ipAddress = "<?php echo $_SERVER['SERVER_ADDR']; ?>";
		</script>
		<script src="js/bundle.js">
		</script>
	</body>

</html>
