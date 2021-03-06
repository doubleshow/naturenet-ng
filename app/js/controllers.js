'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
//   .controller('MyCtrl1', ['$scope','$http', function($scope,$http) {

//   	$scope.map = {
//     center: {
//         latitude: 39.1984815,
//         longitude: -106.8367246
//     },
//     zoom: 14
// 	};
// 	$scope.map.markers = [
// 		{latitude: 39.1984515, longitude: -106.8367246},
// 		{latitude: 39.1984520, longitude: -106.8378426},
// 		{latitude: 39.1984520, longitude: -106.8388426},
// 		{latitude: 39.1984520, longitude: -106.8398426}
// 	];

// 	$scope.map.notes = [];

// 	$scope.note = null;

// 	$http.get('http://naturenet.herokuapp.com/api/account/jenny/notes').success(function(data) {  	
//     	$scope.map.notes = data.data;

// 		 _.each($scope.map.notes, function (marker) {
//         	marker.closeClick = function () {
//             	marker.showWindow = false;
//             	$scope.$apply();
//         	};
//         	marker.icon = "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png";
//         	marker.onClicked = function () {
//             	//onMarkerClicked(marker);
//             	//alert('Hello ' + (marker.content || 'world') + '!');
//             	marker.showWindow = true;
//             	if ($scope.note){
//             		$scope.note.icon = "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png";
//         		}
//             	marker.icon = "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png";
//             	$scope.note = marker;
//             	//{latitude: marker.latitude, longitude: marker.longitude};
//             	//$scope.note.icon = "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png";
//             	$scope.$apply();
//         	};
//     	});

//   	});

//   	$scope.onClick = function(marker) {
//        alert('Hello ' + (marker || 'world') + '!');
//     };

//     $scope.setMarker = function(marker){
//     	if ($scope.note){
//             $scope.note.icon = "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png";
//         }
//     	marker.icon = "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png";
//     	$scope.note = marker;
//     };


//     $scope.button = {
//   "toggle": true,
//   "checkbox": {
//     "left": true,
//     "middle": false,
//     "right": true
//   },
//   "radio": 0
// };

//   }])

  .controller('NavController', ['$scope','$location', function($scope, $location) {

    $scope.test = "hello";

    $scope.getClass = function(path) {
        $scope.path = $location.path;            
        if ($location.path().substr(0, path.length) == path) {
            return "active"
        } else {
            return ""
        }
    }

  }])

  .controller('SiteController', ['$scope','$routeParams','$http', '$cookieStore', function($scope,$routeParams,$http,$cookieStore) {


  	$scope.radioModel = 'Map';
  	$scope.isLogin = false;
  	$scope.notes = {};

  	$scope.map = {};
  	$scope.map.zoom = 16;
	$scope.map.centers = {
    	aces: {
        	latitude: 39.1971844,
        	longitude: -106.8218008
    	},
    	cu: {
			latitude: 40.007581,
			longitude: -105.265942
    	},
    	uncc: {
			latitude: 35.30757,
			longitude: -80.728552
    	},
    	umd: {
			latitude: 38.986937,
			longitude: -76.942868
    	}    	    	
	};

    $scope.cookies = $cookieStore.get("user");

	$scope.map.center = $scope.map.centers['aces'];

	$http.get('http://naturenet.herokuapp.com/api/site/' + $routeParams.name)
		.success(function(data) {  	
    		$scope.site = data.data;
    		$scope.map.center = $scope.map.centers[$routeParams.name]
    	});	
  	
	$scope.map.markers = [];

	var site = $routeParams.name;

	$scope.showNotesEveryone = function() {
		$scope.doLogin = false;
		$http.get('http://naturenet.herokuapp.com/api/site/' + site + '/notes').success(function(data) {  	
    		$scope.notes = data.data.reverse().slice(0,50);
    		$scope.map.markers = _.map($scope.notes, 
    			function(x){
    				var marker = {latitude: x.latitude, longitude: x.longitude, icon: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png"};
    				marker.onClicked = function () {
                    	$scope.map.note = x;
                    	$scope.$apply();
        			};            		
        			return marker;
	        	});
    		});
    };

  	$scope.onClick = function(marker) {
       alert('Hello ' + (marker || 'world') + '!');
    };

    $scope.setMarker = function(marker){
    	if ($scope.note){
            $scope.note.icon = "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png";
        }
    	marker.icon = "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png";
    	$scope.note = marker;
    };	

    $scope.reset = function(){

    };

    $scope.showNotesUser = function(user){
    	if (user){
    		$http.get('http://naturenet.herokuapp.com/api/site/' + site + '/notes/' + user.username).success(function(data) {  	
    			$scope.notes = data.data.reverse();
    		});
    	}else{
    		$scope.doLogin = true;
    	}
    };

    $scope.showMap = function(){
    	$scope.radioModel = 'Map';
    	$scope.doLogin = false;    	
    };

    $scope.isShowMap = function(){
    	return !$scope.doLogin && $scope.radioModel == 'Map';
    };

    $scope.logout = function(){
    	$scope.doLogin = false;
    	$scope.isLogin = false; 	
    	$scope.user = null;    	
    	$scope.account = {};
    	$scope.radioModel = 'Everyone';
    	$scope.showNotesEveryone();

        $cookieStore.remove("user");
    };    

    $scope.login = function(account){
    	 if (account){
    		$http.get('http://naturenet.herokuapp.com/api/account/' + account.username).success(function(data) {
    			$scope.user = data.data;    			
                $cookieStore.put("user", $scope.user);
		    	$scope.doLogin = false;
    			$scope.isLogin = true;
    			$scope.showNotesUser($scope.user);
    		});
	    };
	};

	$scope.isShowGrid = function(){
		return !$scope.doLogin && $scope.radioModel != 'Map';
	};

  	$scope.onClick = function(marker) {
       alert('Hello ' + (marker || 'world') + '!');
    };	

    var user = $cookieStore.get("user")
    if (user){
       $scope.login(user);
    }else{
       $scope.showNotesEveryone(); 
    };

  }]);
