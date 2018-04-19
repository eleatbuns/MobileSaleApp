var app = angular.module("Customer-homepage", ['infinite-scroll']); //'infinite-scroll'

app.config(['$locationProvider', function ($locationProvider) {
    // $locationProvider.html5Mode(true);
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller("homepage-controller", function ($scope, $window, $location, $http) {

    angular.element(document).ready(function () {
        var storage = window.localStorage;
        if (storage.getItem("useraccount") == null ||
            storage.getItem("useraccount") === 'undefined' ||
            angular.isUndefined(storage.getItem("useraccount"))) {
            window.location = '../../index.html';
        }
    });

    //set map size
    $('#divcontainer').height(($window.innerHeight) - ($('#div-footer').height()))
    //get useraccount from localstage
    $scope.account = window.localStorage.getItem("useraccount");
    $scope.list = [];
    $scope.busy = false;

    /**
     * 获取销售代表信息
     */
    let storge = JSON.parse(window.localStorage.getItem("sellerMessage"))
    $scope.area = storge.areas.area;
    $scope.area_img_visible = true;
    $scope.area_id = storge.areas.areaId;
    $scope.succResult = true;

    /**
     * 加载更多
     * @param area_id
     */
    $scope.loadMore = function (area_id) {
        if ($scope.busy) return;
        $scope.busy = true;

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
            url: BASEURL+"customer/list",
            params: ({
                "pageNum": next_page,
                "areaId": $scope.area_id
            })
        }).then(
            function successCallback(response) {
                let items = response.data.list;
                for (let i = 0; i < items.length; i++) {
                    let index = $scope.list.findIndex(function (v) {
                        return items[i].customerId === v.customerId;
                    });
                    if (index < 0) {
                        $scope.list.push(items[i]);
                    }
                }
                $scope.currentPage = response.data.pageNum;
                $scope.totalPage = response.data.pages;
                $scope.nextPage = response.data.nextPage;

            }, function errorCallback(response) {
                console.log("Hello,发生了一些错误,有些参数可能出现了一些问题")
                console.log(response);
            });
        $scope.busy = false;
    };
});

app.run(function ($rootScope) {

    $rootScope['gotoDetail'] = function (item) { // 当按钮被点击之后，调用，设置当前的按钮

        let storage = window.localStorage;
        storage.setItem("customerId", item.customerId);
        storage.setItem("customerName", item.customerName);
        storage.setItem("customerPhone", item.customerPhone);
        storage.setItem("customerAddress", item.customerAddress);

        window.location = 'customerDetail.html';
    }
})