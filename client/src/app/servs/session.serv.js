var module = angular.module("session-serv", [])
module.factory('$session', [
	'$rootScope', '$http',
	function($rootScope, $http) {
		var name = 'angular';

		function save() {
			if (_.isUndefined($rootScope.session)) {
				$rootScope.session = {
					token: ''
				};
			}
			$http.defaults.headers.common['auth-token'] = $rootScope.session.token;
			store.set(name + $rootScope.config.AppIdentifier + "_token", $rootScope.session.token);
			store.set(name + $rootScope.config.AppIdentifier + "_session", $rootScope.session);
			session = $rootScope.session;
		}
		return {
			load: function() {
				return store.get(name + $rootScope.config.AppIdentifier + "_session") || null;
			},
			add: function(cb) {
				$rootScope.session = store.get(name + $rootScope.config.AppIdentifier + "_session") || null;
				cb($rootScope.session);
				save();
			},
			save: save
		}
	}
]);