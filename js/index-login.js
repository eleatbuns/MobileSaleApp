//Define the return value information.
const VERIFICATIONSUCCESS = 0;
const ACCOUNTISNULL = 1;
const PASSWORDERROR = 2;

//Display the prompt message according to the return value.
const SUCCESSMESSAGE = "登录成功！";
const ACCOUNTNOTEXIST = "账户信息不存在";
const INCORRCETPASSWORD = "密码输入错误";

var count = 0;

var app = angular.module("sale-app", []);
app.controller("sale-app-controller", function($scope, $http) {

	angular.element(document).ready(function() {
		var storage = window.localStorage;
		if(storage.getItem("useraccount") != null &&
			storage.getItem("useraccount") != 'undefined' &&
			!angular.isUndefined(storage.getItem("useraccount")) &&
			!angular.isUndefined(storage.getItem("password")) &&
			storage.getItem("password") != null &&
			storage.getItem("password") != 'undefined') {
			window.location = 'html/Customer/homepage.html';
		}
		if(storage.getItem("adminaccount") != null &&
			storage.getItem("adminaccount") != 'undefined' &&
			!angular.isUndefined(storage.getItem("adminaccount")) &&
			!angular.isUndefined(storage.getItem("adminpassword")) &&
			storage.getItem("adminpassword") != null &&
			storage.getItem("adminpassword") != 'undefined') {
			window.location = 'html/manager/productManager.html';
		}
	});

	$scope.loginAuthentication = function() {
		$http({
			method: "GET",
			url: "http://192.168.137.1:8080/sale/login/",
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
		var hre = 'html/Customer/homepage.html?useraccount=' + msg;
		location.href = hre;
	};

});

function returnMessage($scope, returndata) {
	switch(returndata) {
		case VERIFICATIONSUCCESS:
			//验证成功
			//			$scope.returnMessage = SUCCESSMESSAGE;
			rememberUser($scope);
			$scope.jumpToUrl($scope.useraccount);
			break;
		case ACCOUNTISNULL:
			//账户为空
			alert(ACCOUNTNOTEXIST);
			$scope.account = "";
			$scope.password = "";
			//			$scope.returnMessage = ACCOUNTNOTEXIST;
			break;
		case PASSWORDERROR:
			//密码错误
			alert(INCORRCETPASSWORD);
			$scope.password = "";
			//			$scope.returnMessage = INCORRCETPASSWORD;
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

function rememberUser($scope) {
	if(!window.localStorage) {
		console.log("无法使用localstorage");
	} else {
		var storage = window.localStorage;
		storage.setItem("useraccount", $scope.useraccount);
		storage.setItem("password", $scope.password);
	}
}

function gotoManager() {
	count++;
	if(count == 5) {
		window.location.href = "html/manager/managerlogin.html"
		count = 0;
	}
}