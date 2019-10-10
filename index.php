<html>
	<head>
		<title>
			Kreegur
		</title>
	</head>
	<body>
		<div id="app" class="container-fluid mt-2">
			<div class="row justify-content-center mt-2">
				<div class="col-11">
					<div class="card">
						<div class="card-header" @click="toggleShowLatestValues">
							<span v-if="showLatestValues" class="mr-3">-</span><span v-if="!showLatestValues" class="mr-3">+</span> Latest Values
						</div>
						<div class="card-body" v-if="showLatestValues">
							<div class="row" v-for="num in numericData">
								<div class="col">
									{{num.name}}
								</div>
								<div class="col">
									{{num.latestValue}}
								</div>
								<div class="col">
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
