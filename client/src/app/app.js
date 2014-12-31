angular.module('app', ['templates.app', 'ctrls', 'servs'])
	.config(['$httpProvider', '$sceDelegateProvider',
		function($httpProvider, $sceDelegateProvider) {
			$httpProvider.defaults.useXDomain = true;
			$sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/(cdn\.)?quadramma.com/]);
			delete $httpProvider.defaults.headers.common['X-Requested-With'];
		}
	])
	.run(function() {
		// Get the current user when the application starts
		// (in case they are still logged in from a previous session)
	})

.controller('appCtrl', function($scope, $rootScope, $templateCache, $timeout, $compile) {

	$rootScope.appName = 'html5backend';

	console.info('appCtrl');


	$rootScope.config = {
		AppIdentifier: 'AppIdentifierNAME'
	};

	$rootScope.debug = true;
	$rootScope.logged = true;

	$rootScope.logout = function() {
		$rootScope.logged = false;
	};


	$rootScope.setView = function(name) {
		for (var x in $rootScope.view) {
			if (x == name) {
				$rootScope.view[x] = true;
			} else {
				$rootScope.view[x] = false;
			}
		}
		console.info(JSON.stringify($rootScope.view));
	};


	$rootScope.$on('RLITE_VIEW_LOADED', function(obj) {});
	var r = new Rlite();
	$rootScope.link = function(url) {

		window.location.href = "/#" + url;
		window.location.reload();

	};
	$rootScope.run = function(url) {
		r.run(url);
	};
	r.addCustom = function(path, viewName) {
		if (typeof $rootScope.view == 'undefined') {
			$rootScope.view = {};
		}
		if (typeof $rootScope.view[viewName] == 'undefined') {
			$rootScope.view[viewName] = false;
		}
		r.add(path, function() {
			$rootScope.setView(viewName);
		});
	};



	r.addCustom('', 'home');
	r.addCustom('home', 'home');
	r.addCustom('users', 'users');
	r.addCustom('planes', 'planes');
	r.addCustom('planes/alta', 'planes_alta');
	r.addCustom('planes/modi', 'planes_modi');
	r.addCustom('planes/baja', 'planes_baja');

	$rootScope.$on('RLITE_VIEW_LOADED', function(event, param) {
		console.info('RLITE LOADED WAS PATH->');
		console.info(param);
	});


	var hash = location.hash || '#';
	console.info('hash -> ' + hash);
	r.run(hash.substr(1));


});