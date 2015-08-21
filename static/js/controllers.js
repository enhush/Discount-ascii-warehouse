'use strict';
angular.module('App.controllers', [])
    .controller('mainCtrl', function ($scope,ProductService,BATCH_SIZE) {

        //update Angularjs models, views
        $scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        //addvertisement
        $scope.getAdv=function(){
            var random=Math.floor(Math.random() * 1000);

            if( random==$scope.adv_last ) random=random+1;

            $scope.adv_last=random; //advertisement need to be not same in row

            return '/ad/?r=' + random;
        };

        //triggered when scrolling
        $scope.getMore=function(scrollData){

            var scrollTop=scrollData.scrollTop;
            var scrollLimit=scrollData.scrollLimit;

            //get more products when scrolled down
            if( scrollTop+20>scrollLimit ){
                $scope.limit+=BATCH_SIZE;

                $scope.getProducts();

            }
        };

        //get data from server
        $scope.getProducts=function(){

            //notification
            $scope.loading=true;
            ProductService.getProducts(
                {
                    sort:$scope.sort,
                    limit:$scope.limit
                },
                $scope.refreshProducts
            );
        };

        //initialize everything
        $scope.init=function(){
            $scope.loading=false;
            $scope.sort='id';
            $scope.limit=BATCH_SIZE;
            $scope.products=[];

            $scope.adv_last=''; //advertisement need to be not same in row
        };

        //update products
        $scope.refreshProducts=function(products){

            $scope.products=products;

            $scope.loading=false;
            $scope.safeApply(); //cuz of using zepto
        };

        //sort by size,price,id
        $scope.sortBy=function(sort){
            $scope.sort=sort;

            ProductService.sortCache(sort);

        };

        $scope.init();
        $scope.getProducts();
    });