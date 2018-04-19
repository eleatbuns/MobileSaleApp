var app = angular.module("update-product", ['ngFileUpload']);

app.controller("update-product-controller", function ($scope, $http, $window) {
    $scope.hasback = true;
    $scope.title = "更新商品";

    //直接访问本界面时拦截
    angular.element(document).ready(function() {
        let storage = window.localStorage;
        if (storage.getItem("productId") == null ||
            storage.getItem("productId") === 'undefined'||
            angular.isUndefined(storage.getItem("productId"))){
            window.location = 'productManager.html';
        }
    });

    /*
     * 获取商品种类表
     */
    $http({
        method: "GET",
        url: BASEURL + "product/type/"
    }).then(function successCallback(response) {
            $scope.type = response.data;
            angular.element(document).ready(function () {
                $('#selectpicker').selectpicker('refresh');
                $('#selectpicker').selectpicker('render');
            });

            $scope.loadMessage();
        },
        function errorCallback(response) {
            console.log("error:" + response);
        });

    /*
     *将商品信息显示在页面上
     */
    $scope.loadMessage = function () {
        let storge = window.localStorage;
        $scope.imgSrc = storge.getItem("productImg");
        $scope.productId = parseFloat(storge.getItem("productId"));
        $scope.productName = storge.getItem("productName");
        $scope.productDescription = storge.getItem("productDescription");
        $scope.productCostPrice = parseFloat(storge.getItem("productCostPrice"));
        $scope.productQuantity = parseFloat(storge.getItem("productQuantity"));
        $scope.productPrice = parseFloat(storge.getItem("productPrice"));

        for (let i = 0; i < $scope.type.length; i++) {
            if ($scope.type[i].productTypeId === parseFloat(storge.getItem("productTypeId"))) {
                $scope.productType = $scope.type[i];
            }
        }
    };

    /*
     * 提交商品信息
     */
    $scope.updateProduct = function (product) {

        if (product.productPrice <= product.productCostPrice) {
            if (!confirm("当前定价比成本价要低，您确定要继续吗？")) {
                return false;
            }
        }
        if (product.productQuantity < 2) {
            if (!confirm("当前库存量过少，确定继续吗？")) {
                return false;
            }
        }
        let data = new FormData();
        data.append("productId",product.productId);
        data.append("productName", product.productName);
        data.append("productPrice", product.productPrice);
        data.append("productCostPrice", product.productCostPrice);
        data.append("productTypeId", product.productType.productTypeId);
        data.append("productQuantity", product.productQuantity);
        data.append("productDescription", product.productDescription);
        data.append("productImg", product.productImg);
        console.log(data.get("productId"));
        console.log(data.get("productImg"));
        $http({
            method: "POST",
            url: BASEURL + "product/update",
            data: data,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity

        }).then(function successCallback(response) {
                if (response.data > 0) {
                    alert("商品信息更新成功。。。。")
                    removeLocalStage();
                    window.history.back();
                } else {
                    alert("增加失败，请检查数据是否正确")
                }
            },
            function errorCallback(response) {
                alert("系统出现了一些问题，增加失败，重试");
                console.log("error");
                console.log(response);
            });
    }
});

app.controller("form-controller", function ($scope, $window, $http, Upload) {

    $scope.reader = new FileReader(); //创建一个FileReader接口
    $scope.form = { //用于绑定提交内容，图片或其他数据
        image: {},
    };
    $scope.thumb=''; //用于存放图片的base64

    $scope.uploadFiles = function (file, errorFile) { //单次提交图片的函数
        $scope.reader.readAsDataURL(file); //FileReader的方法，把图片转成base64
        $scope.reader.onload = function (ev) {
            $scope.$apply(function () {
                $scope.thumb = ev.target.result; //接收base64
            });
            $scope.imgSrc = $scope.thumb;
        };
    };

});

/**
 * 删除掉本地保存的商品信息
 */
function removeLocalStage() {
    let storage = window.localStorage;
    storage.removeItem("productId");
    storage.removeItem("productName");
    storage.removeItem("productPrice");
    storage.removeItem("productCostPrice");
    storage.removeItem("productTypeId");
    storage.removeItem("productQuantity");
    storage.removeItem("productDescription");
    storage.removeItem("productImg");
}
