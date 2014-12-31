var serv = angular.module("time-serv", [])
	.factory("$time",
		function($rootScope) {
			return {
				getTimestampDuration: function(timestamp) {
					var duration = {
						hours: Math.round(Math.floor(timestamp / 1000 / 60 / 60) % 24),
						minutes: Math.round(Math.floor(timestamp / 1000 / 60) % 60),
						seconds: Math.round(Math.floor(timestamp / 1000) % 60)
					};
					var str = "";
					str += duration.hours + ":";
					str += duration.minutes + ":";
					str += duration.seconds + "";
					return str;
				}
			}
		});