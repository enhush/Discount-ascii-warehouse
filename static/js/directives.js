'use strict';
angular.module('App.directives', [])
    .directive('gridheader', function ($parse) {
        return {
            restrict: 'A',
            templateUrl:'/js/templates/gridheader.html'
        }
    })
    .directive('gridbody', function () {
        return {
            restrict: 'A',
            templateUrl:'/js/templates/gridbody.html'
        }
    })
    .directive('scroll', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                element.bind('scroll', function() {
                    var scrollLimit = this.scrollHeight - this.clientHeight ;
                    var scrollTop=this.scrollTop;

                    var scrollData={
                        scrollLimit:scrollLimit,
                        scrollTop:scrollTop
                    };

                    //parsing and invoke parent ctrl's func
                    var invoker = $parse(attrs.scroll);

                    invoker(scope, {scrollData: scrollData});

                });

            }
        }
    })
    .directive('gridbottom', function () {
        return {
            restrict: 'A',
            template:'<div ng-if="products.length<=0" class="end">~ End of Catalogue ~</div>'
        }
    })


