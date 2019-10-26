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
			<div class="row justify-content-center">
				<div class="col-11">
					<canvas id="myChart2" width="400" height="400"></canvas>
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
					<div class="card" v-if="control">
						<div class="card-header" @click="toggleShowOutputs">
							<span v-if="showOutputs" class="mr-3">-</span><span v-if="!showOutputs" class="mr-3">+</span> Control
						</div>
						<div class="card-body" v-if="showOutputs">
							<div class="alert alert-warning">Outputs not yet implemented</div>
							<div class="row border rounded m-2 border-secondary" v-for="(out, index) in outputs">
								<div class="col-12 mb-2 bg-secondary text-white">
									<h3>{{out.description}} </h3>
								</div>
								<div class="col-12 mb-2">
									<button v-if="out.outputOn" class="btn btn-success" @click="setState(false,index)">ON (click to turn OFF)</button>
									<button v-else class="btn btn-danger" @click="setState(true,index)">OFF (click to turn ON)</button>
								</div>
								<div class="col-md-5 col-11 border rounded alert alert-secondary ml-2">
									<h5>Conditions (latching):</h5>
									<div v-for="(condition,conditionIndex) in out.conditions" class="row mb-1">
										<div class="col-8">
											{{out.description}} <span v-if="condition.on">ON</span><span v-else>OFF</span> if {{condition.channel}} 
											<span v-if="condition.greaterThan">rises above</span><span v-else>drops below</span> {{condition.threshold}}
										</div>
										<div class="col-4">
											<button class="btn btn-primary btn-sm btn-block" @click="removeCondition(index,conditionIndex)">Delete</button>
										</div>
									</div>

								</div>
								<div class="col-md-5 col-11 border rounded alert alert-secondary ml-2">
									<h5>Add new latch condition</h5>
									<div class="form-group">
										<label for="select">Output</label>
										<select class="form-control" v-model="outputs[index].newConditionOn" id="select">
											<option value="true">On</option>
											<option value="false">Off</option>
										</select>
									</div>
									<div class="form-group">
										<label for="select">if:</label>
										<select class="form-control" v-model="outputs[index].newConditionChannel" id="select">
											<option v-for="num in numericData" :value="num.name">{{num.name}}</option>
										</select>
										<div v-if="outputs[index].newConditionChannel==''" class="alert alert-danger">Must select a channel</div>
									</div>
									<div class="form-group">
										<label for="select">is</label>
										<select class="form-control" v-model="outputs[index].newConditionGreaterThan" id="select">
											<option value="true">rises above</option>
											<option value="false">drops below</option>
										</select>
									</div>
									<div class="form-group">
										<label for="select"></label>
										<input type="text" class="form-control" v-model="outputs[index].newThreshold" id="value">
									</div>
									<button class="btn btn-primary" @click='addCondition(index)'>Add new condition</button>
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
			<div class="row justify-content-center mt-2" v-if="settings">
				<div class="col-11">
					<div class="card">
						<div class="card-header" @click="toggleShowSettings()">
							<span v-if="showSettings" class="mr-3">-</span><span v-if="!showSettings" class="mr-3">+</span> Settings
						</div>
						<div class="card-body" v-if="showSettings">
							<div class="row" v-for="(set, index) in settingsList">
								<div class="col-6">
									{{set.description}}
								</div> 
								<div class="col-6" v-if="settingsList[index].dataType=='numeric' || settingsList[index].dataType=='string'" >
									<input type="text" v-model="settingsList[index].value" @change="settingChange(index)">
								</div>
								<div class="custom-control custom-switch col-6" v-if="settingsList[index].dataType=='boolean'" >
									<input type="checkbox" class="custom-control-input" v-model="settingsList[index].value" id="switch" @change="settingChange(index)">
									<label class="custom-control-label" for="switch">On/off</label>
								</div>
							</div>
						</div>
						
					</div>
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
