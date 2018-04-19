var app = angular.module("product-manager", ["ngWaterfall", "ui.router"]);
app.controller("product-manager-controller", function($scope, $window, $location, $http) {
	$scope.hasback = false;
	$scope.title = "商品管理";
	$scope.loadText ="加载更多";

    // $scope.$on("waterfall:loadMore",function(){//滚动自动填充事件
    //     $scope.loadMoreData();
    // });

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
		$scope.currentPage = response.data.pageNum;
		$scope.totalPage = response.data.pages;
		$scope.nextPage = response.data.nextPage;
		console.log(response.data);
	},function errorCallback(response) {
		console.log(response);
	});

    //跳转到更新商品页面
    $scope.updateProduct=function (product) {
		//将商品信息保存在localstorge中
		let storage = window.localStorage;
        storage.setItem("productId",product.productId);
        storage.setItem("productName", product.productName);
        storage.setItem("productPrice", product.productPrice);
        storage.setItem("productCostPrice", product.productCostPrice);
        storage.setItem("productTypeId", product.productTypeId);
        storage.setItem("productQuantity", product.productQuantity);
        storage.setItem("productDescription", product.productDescription);
        storage.setItem("productImg", product.productImg);

        window.location = "updateProduct.html"
    };

    /**
	 *商品下架
     */
    $scope.saleOFF = function (product) {

        $http({
            method:"PUT",
            url: BASEURL +"product/saleoff/"+product.productId
        }).then(function successCallback(response) {
            if (response.data === 1) {
                alert("商品下架成功。。。。");
                product.sellingState = false;
            } else {
                alert("下架失败，可能商品已经被下架")
            }
        },function errorCallback(response) {
        	alert("系统出现了错误，请稍后重试")
            console.log(response);
        });
    };

    /**
     *商品删除
     */
    $scope.deleteProduct = function (product) {
        if (!confirm("商品删除后不可恢复，确定要删除该商品吗？")) {
            return false;
        }
        $http({
            method:"DELETE",
            url: BASEURL +"product/delProduct/"+product.productId
        }).then(function successCallback(response) {
            if (response.data === 1) {
                alert("商品删除成功。。。。")
				$scope.images.remove(product);
            } else {
                alert("删除失败，可能商品已经被删除")
            }
        },function errorCallback(response) {
            alert("系统出现了错误，请稍后重试")
            console.log(response);
        });
    };

    /**
	 * 商品上架
     * @param product
     * @returns {number}
     */
    $scope.saleOn = function (product) {
        $http({
            method:"PUT",
            url: BASEURL +"product/saleon/"+product.productId
        }).then(function successCallback(response) {
            if (response.data === 1) {
                alert("商品上架成功。。。。")
                product.sellingState = true;
            } else {
                alert("商家失败，可能商品已经被上架")
            }
        },function errorCallback(response) {
            alert("系统出现了错误，请稍后重试")
            console.log(response);
        });
    };

    //删除数组元素
    Array.prototype.indexOf = function(val) {
        for (let i = 0; i < this.length; i++) {
            if (this[i] === val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        let index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    /**
     * 加载更多
     * @param area_id
     */
    $scope.loadMoreData = function (page) {
        // if ($scope.busy) return;
        // $scope.busy = true;

        let next_page;
        if (angular.isUndefined($scope.nextPage)) {
            next_page = 1
        } else {
            next_page = $scope.nextPage
        }
        //当下一页不存在时，返回
        if (next_page === 0) {
            return;
        }
        $http({
            method: "GET",
            url: BASEURL+"product/list",
            params: ({
                "pageNum": next_page
                // "type": null
            })
        }).then(
            function successCallback(response) {
                let items = response.data.list;
                $scope.images = response.data.list;
                console.log(response.data);
					// for (let i = 0; i < items.length; i++) {
					//     let index = $scope.list.findIndex(function (v) {
					//         return items[i].customerId === v.customerId;
					//     });
					//     if (index < 0) {
					//         $scope.list.push(items[i]);
					//     }
					// }
					// $scope.currentPage = response.data.pageNum;
					// $scope.totalPage = response.data.pages;
					// $scope.nextPage = response.data.nextPage;

            }, function errorCallback(response) {
                console.log("Hello,发生了一些错误,有些参数可能出现了一些问题")
                console.log(response);
            });
        $scope.busy = false;
    };

});

// /**
//  * 删除本地保存的信息
//  */
// function removeLocalStage() {
//     let storage = window.localStorage;
//     storage.removeItem("productId");
//     storage.removeItem("productName");
//     storage.removeItem("productPrice");
//     storage.removeItem("productCostPrice");
//     storage.removeItem("productTypeId");
//     storage.removeItem("productQuantity");
//     storage.removeItem("productDescription");
//     storage.removeItem("productImg");
// }