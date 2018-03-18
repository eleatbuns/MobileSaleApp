var app = angular.module("sale-app", []);
app.controller("sale-app-controller", function($scope, $http) {
	$scope.loginAuthentication = function() {
		$http({
			method: "POST",
			url: "http://211.87.233.73:8080/sale/login/",
			params: ({
				"userAccount": $scope.useraccount,
				"password": $scope.password
			})
		}).then(function successCallback(response) {
			console.log("success:" + response.status)
		}, function errorCallback(response) {
			console.log("error:" + response)
		});
	}
});

$(document).ready(function() {
	$("#account").focus(function() {
		$("#account-hr").css("width", "0");
		$("#account-hr").css("width", "16.5em");
	});
	$("#account").blur(function() {
		$("#account-hr").css("width", "0");
	});
	$("#password").focus(function() {
		$("#password-hr").css("width", "0");
		$("#password-hr").css("width", "16.5em");
	});
	$("#password").blur(function() {
		$("#password-hr").css("width", "0");
	});
});