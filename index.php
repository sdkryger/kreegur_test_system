<html>
	<head>
		<title>
			Kreegur
		</title>
	</head>
	<body>
		<div id="app">
			{{message}}
		</div>
		<script src="js/vue.js"></script>
		<script>
			var app = new Vue({
				el: '#app',
				data: {
					message: 'Hello there!'
				}
			});
		</script>
	</body>

</html>
