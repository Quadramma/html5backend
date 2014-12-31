angular.module('syngenta.planes.index.ctrls', [])



.controller('syngentaPlanesIndexCtrl', function($scope, $api, $rootScope) {

	console.info('syngentaPlanesIndexCtrl');

	$rootScope.apiUrl = "http://www.quadramma.com/sites/cbotanico";
	var $db = $api.getController('api', true);
	
	$db.get({
		action: "planes"
			//,ignorecache: true
	}, function(res) {
		console.log(res);
		$scope.items = res.data;
	});



});