var app = angular.module("product-manager", ["ngWaterfall", "ui.router"]);
app.controller("product-manager-controller", function($scope, $window, $location, $http) {
	$scope.hasback = false;
	$scope.title = "商品管理";
	$scope.types = [{"productTypeId":1,"productTypeName":"休闲食品类"}];
	$scope.loadText ="加载更多";

    $scope.$on("waterfall:loadMore",function(){//滚动自动填充事件
        // $scope.loadMoreData();
    });

    //从数据库中获取商品种类信息
	$http({
		method: "GET",
		url: BASEURL + "product/type/"
	}).then(function successCallback(response) {
			$scope.types = response.data
		},
		function errorCallback(response) {
			console.log("error:" + response);
		});

	//获取所有商品信息
	$http({
		method:"GET",
		url: BASEURL +"product/list/"
	}).then(function successCallback(response) {
		$scope.images = response.data.list;
		console.log(response.data);
	},function errorCallback(response) {
		console.log(response);
	});

    //跳转到更新商品页面
    $scope.updateProduct=function (product) {
		//将商品信息保存在localstorge中
		var storage = window.localStorage;
        storage.setItem("productId",product.productId);
        storage.setItem("productName", product.productName);
        storage.setItem("productPrice", product.productPrice);
        storage.setItem("productCostPrice", product.productCostPrice);
        storage.setItem("productTypeId", product.productTypeId);
        storage.setItem("productQuantity", product.productQuantity);
        storage.setItem("productDescription", product.productDescription);
        storage.setItem("productImg", product.productImg);

        window.location = "updateProduct.html"
    }

});