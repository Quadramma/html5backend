angular.module('common.user.ctrls', [])
	.controller('common.user.ctrl', function($scope) {

		console.info('common.user.ctrl');

		$scope.items = [{
			name: 'Pedro'
		}, {
			name: 'Mario'
		}];

	});