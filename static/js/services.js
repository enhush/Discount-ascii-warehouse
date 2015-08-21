'use strict';
angular.module('App.services', []).
    factory('ProductService',function(BATCH_SIZE,$timeout){
        return{
            cache_ing:false,
            cache : {
                id:[],
                size:[],
                price:[]
            },

            //when to get products from cache it must be ordered.!!
            sortCache:function(sort){
                this.cache[sort].sort(function (a, b) {
                    return (a[sort] > b[sort] ? 1 : -1);
                });
            },
            waitForCache:function(next){
                var self=this;
                function wait(){
                    $timeout(function(){
                        if( self.cache_ing ) wait();
                        else{
                            //calling request has finished
                            next();
                        }
                    },5);
                };
                wait();
            },
            saveCache : function(sort,next){

                //freeze, synchronize
                this.cache_ing=true;

                var self=this;
                $.get('/api/products',
                    {
                        sort: sort || 'id',
                        skip: this.cache[sort].length,
                        limit: 4*BATCH_SIZE     // at least 4 times scroll down => no request to server
                    },
                    function(data) {

                        //parse from newline delimited json format
                        data=data
                            .split("\n")
                            .filter(function(value){
                                return value!=="" ;
                            });
                        $.each(data,function(index,value){
                            data[index]=JSON.parse(value);
                        });

                        //save to cache
                        self.cache[sort]=self.cache[sort].concat(data || []);

                        //unreeze, finishing
                        self.cache_ing=false;

                        //call callback
                        if( next ) next();

                    });
            },
            isCacheEnough:function(sort, limit){
                return this.cache[sort] && this.cache[sort].length >= limit;
            },
            fromCache:function(sort,limit,next){

                //send cached data
                next( this.cache[sort].slice(0,limit) );

                //needed to cache?
                if( this.cache[sort].length-BATCH_SIZE<limit ) {

                    var self=this;

                    //wait until a.request finished
                    this.waitForCache(function(){

                        //then cache
                        if( self.cache[sort].length-BATCH_SIZE<limit )
                            self.saveCache(sort);
                    });

                }
            },
            fromServer:function(sort,limit,next){

                var self=this;

                //wait until a.request finished
                this.waitForCache(function(){

                    //did prev a.request cached enough?
                    if( self.isCacheEnough(sort,limit) ){
                        //then get it from cache
                        self.fromCache(sort,limit,next);
                    }
                    //if no
                    else{
                        //fetch data from server
                        self.saveCache(sort, function(){
                            next(self.cache[sort].slice(0,limit));
                        });
                    };
                });

            },
            getProducts : function(prms,next){
                var sort=prms.sort || 'id';
                var limit=prms.limit;

                //enough data in cache
                if( this.isCacheEnough(sort,limit) ){
                    this.fromCache(sort,limit,next);
                }
                //not enough, then fetch data
                else {
                    this.fromServer(sort,limit,next);
                }

            }
        };
    });
