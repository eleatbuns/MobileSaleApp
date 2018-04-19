//Define the return value information.
const VERIFICATIONSUCCESS = "0";
const ACCOUNTISNULL = "1";
const PASSWORDERROR = "2";

//Display the prompt message according to the return value.
const SUCCESSMESSAGE = "登录成功！";
const ACCOUNTNOTEXIST = "账户信息不存在";
const INCORRCETPASSWORD = "密码输入错误";

let count = 0;

let app = angular.module("sale-app", []);
app.controller("sale-app-controller", function($scope, $http) {

	angular.element(document).ready(function() {
		let storage = window.localStorage;
		if(storage.getItem("useraccount") != null &&
			storage.getItem("useraccount") !== 'undefined' &&
			!angular.isUndefined(storage.getItem("useraccount")) ) {

			storage.removeItem("adminaccount");
			storage.removeItem("adminpassword");
			window.location = 'html/Customer/homepage.html';
		}
		if(storage.getItem("adminaccount") != null &&
			storage.getItem("adminaccount") !== 'undefined' &&
			!angular.isUndefined(storage.getItem("adminaccount")) &&
			!angular.isUndefined(storage.getItem("adminpassword")) &&
			storage.getItem("adminpassword") != null &&
			storage.getItem("adminpassword") !== 'undefined') {
				
			storage.removeItem("useraccount");
			window.location = 'html/manager/productManager.html';
		}
	});

	$scope.loginAuthentication = function() {
		$http({
			method: "GET",
			url: BASEURL+"login/",
			params: ({
				"useraccount": $scope.useraccount,
				"password": $scope.password
			})
		}).then(function successCallback(response) {
			console.log(response.data);
				returnMessage($scope, response.data);
			},
			function errorCallback(response) {
				console.log("error:" + response);
			});
	};
	$scope.jumpToUrl = function() {
		location.href = 'html/Customer/homepage.html';
	};

});

function returnMessage($scope, returndata) {
	console.log(returndata.result);
	if (returndata.result === VERIFICATIONSUCCESS) {
        //验证成功
        rememberUser($scope,returndata);
        $scope.jumpToUrl();
	}else if (returndata.result === ACCOUNTISNULL) {
        //账户为空
        alert(ACCOUNTNOTEXIST);
        $scope.account = "";
        $scope.password = "";
	}else if (returndata.result === PASSWORDERROR) {
        //密码错误
        alert(INCORRCETPASSWORD);
        $scope.password = "";
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

function rememberUser($scope,returndata) {
	if(!window.localStorage) {
		console.log("无法使用localstorage");
	} else {
		let storage = window.localStorage;
		storage.setItem("useraccount", $scope.useraccount);
		storage.setItem("sellerMessage",JSON.stringify(returndata.sellerMessage));
		// storage.setItem("areaId",returndata.areaId);
	}
}

function gotoManager() {
	count++;
	if(count === 5) {
		window.location.href = "html/manager/managerlogin.html";
		count = 0;
	}
}