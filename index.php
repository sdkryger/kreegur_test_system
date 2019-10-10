<html>
	<head>
		<title>
			Kreegur
		</title>
	</head>
	<body>
		<div id="app" class="container">
			<div class="row">
				<div class="col-12 col-lg-4 col-md-6">
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
		<link rel="stylesheet" href="css/bootstrap.css">
		<script src="js/bundle.js">
		</script>
	</body>

</html>
