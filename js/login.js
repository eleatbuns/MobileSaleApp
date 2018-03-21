//Define the return value information.
const VERIFICATIONSUCCESS = 0;
const ACCOUNTISNULL = 1;
const PASSWORDERROR = 2;

//Display the prompt message according to the return value.
const SUCCESSMESSAGE = "登录成功！";
const ACCOUNTNOTEXIST = "账户信息不存在";
const INCORRCETPASSWORD = "密码输入错误";

var app = angular.module("sale-app", []);
app.controller("sale-app-controller", function($scope, $http) {

	$scope.loginAuthentication = function() {
		$http({
			method: "POST",
			url: "http://211.87.233.74:8080/sale/login/",
			params: ({
				"useraccount": $scope.useraccount,
				"password": $scope.password
			})
		}).then(function successCallback(response) {
				returnMessage($scope, response.data.result);
			},
			function errorCallback(response) {
				console.log("error:" + response);
			});
	}
	$scope.jumpToUrl = function(msg) {
		var hre = 'html/CustomerManagement/homepage.html?msg=' + angular.toJson(msg);
		//传递对象：先将对象转成字符串（序列化）
		location.href = hre;
	};
});

function returnMessage($scope, returndata) {
	switch(returndata) {
		case VERIFICATIONSUCCESS:
			$scope.returnMessage = SUCCESSMESSAGE;
			$scope.jumpToUrl($scope.useraccount);
			break;
		case ACCOUNTISNULL:
			$scope.returnMessage = ACCOUNTNOTEXIST;
			break;
		case PASSWORDERROR:
			$scope.returnMessage = INCORRCETPASSWORD;
			break;
		default:
			break;
	}
}

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