var app = angular.module("new-stock", ['ngFileUpload']);
app.controller("new-stock-controller",['$scope', '$http',function($scope, $window, $http, Upload) {
	$scope.hasback = false;
	$scope.title = "商品上新"
	$scope.imgSrc = "../../images/uploadPic.png"
	
	$scope.reader = new FileReader(); //创建一个FileReader接口
	$scope.form = { //用于绑定提交内容，图片或其他数据
		image: {},
	};
	$scope.thumb; //用于存放图片的base64

	$scope.uploadFiles = function(file,errorFile) { //单次提交图片的函数
		$scope.reader.readAsDataURL(file); //FileReader的方法，把图片转成base64
		$scope.reader.onload = function(ev) {
			$scope.$apply(function() {
				$scope.thumb = ev.target.result; //接收base64
			});
			$scope.imgSrc = $scope.thumb;
		};
	};
	
}]);