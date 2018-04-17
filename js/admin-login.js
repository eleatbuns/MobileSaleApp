//Define the return value information.
const VERIFICATIONSUCCESS = 0;
const ACCOUNTISNULL = 1;
const PASSWORDERROR = 2;

//Display the prompt message according to the return value.
const SUCCESSMESSAGE = "登录成功！";
const ACCOUNTNOTEXIST = "账户信息不存在";
const INCORRCETPASSWORD = "密码输入错误";

var count = 0;

var app = angular.module("admin", []);
app.controller("admin-controller", function($scope, $http) {

	$scope.loginAuthentication = function() {
		$http({
			method: "GET",
			url: "http://192.168.137.1:8080/sale/admin/login/",
			params: ({
				"account": $scope.account,
				"password": $scope.password
			})
		}).then(function successCallback(response) {
				returnMessage($scope, response.data);
			},
			function errorCallback(response) {
				console.log("error:" + response);
			});
	}
	$scope.jumpToUrl = function() {
		location.href = 'newStock.html';
	};

});

function returnMessage($scope, returndata) {
	switch(returndata) {
		case VERIFICATIONSUCCESS:
			//验证成功
			rememberUser($scope);
			$scope.jumpToUrl();
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


function rememberUser($scope) {
	if(!window.localStorage) {
		console.log("无法使用localstorage");
	} else {
		var storage = window.localStorage;
		storage.setItem("adminaccount", $scope.account);
		storage.setItem("adminpassword", $scope.password);
	}
}
