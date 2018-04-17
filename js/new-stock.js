var app = angular.module("new-stock", ['ngFileUpload']);

app.controller("new-stock-controller", function($scope, $http) {
	$scope.hasback = false;
	$scope.title = "商品上新";
	$scope.imgSrc = "../../images/uploadPic.png";

	/*
	 * 获取商品种类表
	 */
	$http({
		method: "GET",
		url: "http://127.0.0.1:8080/sale/product/type/",
	}).then(function successCallback(response) {
			$scope.type = response.data
			console.log(response.data);
		},
		function errorCallback(response) {
			console.log("error:" + response);
		});

	/*
	 * 提交商品信息
	 */
	$scope.addNewProduct = function(product) {

//		var data = document.getElementById("productForm");
//		var formData = new FormData(data);
//		formData.append("productTypeId", product.productType.productTypeId);

				var data = new FormData();
				data.append("productName", product.productName);
				data.append("productPrice", product.productPrice);
				data.append("productCostPrice", product.productCostPrice);
				data.append("productTypeId", product.productType.productTypeId);
				data.append("productQuantity", product.productQuantity);
				data.append("productDescription", product.productDescription);
				data.append("productImg", product.productImg);
		console.log(data.get("productName"))
		$http({
			method: "POST",
			url: "http://127.0.0.1:8080/sale/product/new",
			data: data,
			headers: {'Content-Type': undefined},
            transformRequest: angular.identity
			//			params: ({
			//				"productName": product.productName,
			//				"productPrice": product.productPrice,
			//				"productCostPrice": product.productCostPrice,
			//				"productTypeId": product.productType.productTypeId,
			//				"productQuantity": product.productQuantity,
			//				"productDescription": product.productDescription,
			//				"productImg": product.productImg
			//			})

		}).then(function successCallback(response) {
				console.log(response.data)
			},
			function errorCallback(response) {
				console.log("error")
				console.log(response);
				//				console.log(angular.toJson(productInfo))
			});
	}
})

app.controller("form-controller", ['$scope', '$http', function($scope, $window, $http, Upload) {

	$scope.reader = new FileReader(); //创建一个FileReader接口
	$scope.form = { //用于绑定提交内容，图片或其他数据
		image: {},
	};
	$scope.thumb; //用于存放图片的base64

	$scope.uploadFiles = function(file, errorFile) { //单次提交图片的函数
		$scope.reader.readAsDataURL(file); //FileReader的方法，把图片转成base64
		$scope.reader.onload = function(ev) {
			$scope.$apply(function() {
				$scope.thumb = ev.target.result; //接收base64
			});
			$scope.imgSrc = $scope.thumb;
		};
	};

}]);