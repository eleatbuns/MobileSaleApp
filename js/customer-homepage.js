var app = angular.module("Customer-homepage", ['infinite-scroll']); //'infinite-scroll'

app.config(['$locationProvider', function($locationProvider) {
	// $locationProvider.html5Mode(true);  
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
}]);

app.controller("homepage-controller", function($scope, $window, $location, $http) {

	angular.element(document).ready(function() {
		var storage = window.localStorage;
		if(storage.getItem("useraccount") == null ||
			storage.getItem("useraccount") == 'undefined' ||
			angular.isUndefined(storage.getItem("useraccount")) ||
			angular.isUndefined(storage.getItem("password")) ||
			storage.getItem("password") == null ||
			storage.getItem("password") == 'undefined') {
			window.location = '../../index.html';
		}
	});

	//set map size
	$('#divcontainer').height(($window.innerHeight) - ($('#div-footer').height()))
	//get useraccount from localstage
	$scope.account = window.localStorage.getItem("useraccount");
	$scope.list = []
	$scope.busy = false;
	$http({
		method: "GET",
		url: BASEURL+"seller/Message/",
		params: ({
			"useraccount": $scope.account,
		})
	}).then(function successCallback(response) {
			$scope.area = response.data.areas.area;
			$scope.area_img_visible = true;
			$scope.area_id = response.data.areas.areaId
			$scope.succResult = true
		},
		function errorCallback(response) {
			$scope.area_img_unvisible = true;
		});

	$scope.loadMore = function(area_id) {
		if($scope.busy) return;
		$scope.busy = true;

		var next_page;
		if(angular.isUndefined($scope.nextPage)) {
			next_page = 1
		} else {
			next_page = $scope.nextPage
		}
		//当下一页不存在时，返回
		if(next_page === 0) {
			return;
		}
		console.log(next_page)
		$http({
			method: "GET",
			url: "http://192.168.137.1:8080/sale/customer/list",
			params: ({
				"pageNum": next_page,
				"areaId": $scope.area_id
			})
		}).then(
			function successCallback(response) {
				var items = response.data.list
				console.log(response.data)
				for(var i = 0; i < items.length; i++) {
					var index = $scope.list.findIndex(function(v) {
						return items[i].customerId === v.customerId;
					});
					if(index < 0) {
						$scope.list.push(items[i]);
					}
				}
				$scope.currentPage = response.data.pageNum;
				$scope.totalPage = response.data.pages;
				$scope.nextPage = response.data.nextPage;

			},
			function errorCallback(response) {
				console.log("Hello,发生了一些错误,有些参数可能出现了一些问题")
			});
		$scope.busy = false;
	};
});

app.run(function($rootScope) {

	$rootScope['gotoDetail'] = function(item) { // 当按钮被点击之后，调用，设置当前的按钮

		var storge = window.localStorage;
		storge.setItem("customerId", item.customerId);
		storge.setItem("customerName", item.customerName);
		storge.setItem("customerPhone", item.customerPhone);
		storge.setItem("customerAddress", item.customerAddress)

		var hre = 'customerDetail.html';
		window.location = hre;
	}
})