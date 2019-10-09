<html>
	<head>
		<title>
			Kreegur
		</title>
	</head>
	<body>
		<div id="app">
			
			<input type="text" v-model="pubTopic">
			<input type="text" v-model="pubPayload">
			<button @click="publishMsg">Publish</button>
		</div>
		<script src="js/bundle.js">
		</script>
	</body>

</html>
