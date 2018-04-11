var app = angular.module("customer-detail", []);
app.controller("customer-detail-controller", function($scope, $window, $location, $http) {

	//解析客户数据信息
	$scope.customerName = window.localStorage.getItem("customerName")
	$scope.customerPhone = window.localStorage.getItem("customerPhone")
	$scope.customerAddress = window.localStorage.getItem("customerAddress")
});
app.run(function($rootScope) {

	$rootScope['goback'] = function() { // 当按钮被点击之后，调用，设置当前的按钮

		window.history.back();
	}
	$rootScope['mapNavigation'] = function() { // 当按钮被点击之后，调用，设置当前的按钮

		window.location.href="mapNavigation.html";
	}
})