let app = angular.module("new-stock", ['ngFileUpload']);

app.controller("new-stock-controller", function ($scope, $http, $window) {
    $scope.hasback = false;
    $scope.title = "商品上新";
    $scope.imgSrc = "../../images/uploadPic.png";

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
        },
        function errorCallback(response) {
            console.log("error:" + response);
        });

    /*
     * 提交商品信息
     */
    $scope.addNewProduct = function (product) {

        let image = new Image();
        image.src = "../../images/uploadPic.png";

        if (product.productImg === "../../images/uploadPic.png") {
            if (confirm("您确定要使用默认图片吗？")) {
                product.productImg = getBase64Image(image);
            } else {
                return false;
            }

        }
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
        data.append("productName", product.productName);
        data.append("productPrice", product.productPrice);
        data.append("productCostPrice", product.productCostPrice);
        data.append("productTypeId", product.productType.productTypeId);
        data.append("productQuantity", product.productQuantity);
        data.append("productDescription", product.productDescription);
        data.append("productImg", product.productImg);

        $http({
            method: "POST",
            url: BASEURL + "product/new",
            data: data,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity

        }).then(function successCallback(response) {
                if (response.data > 0) {
                    if (confirm("创建商品成功，还要继续创建吗")) {
                        $window.location.reload();
                    } else {
                        $window.location = "productManager.html"
                    }
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
})

app.controller("form-controller", function ($scope, $window, $http, Upload) {

    $scope.reader = new FileReader(); //创建一个FileReader接口
    $scope.form = { //用于绑定提交内容，图片或其他数据
        image: {},
    };
    $scope.thumb = ""; //用于存放图片的base64

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

function getBase64Image(img) {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    return canvas.toDataURL("data:image/" + ext);
}