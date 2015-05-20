var app = angular.module('navApp', ['ionic', 'swipe', 'wu.masonry', 'ab-base64', 'base64', 'ui.router'])

/*app.run(function($cordovaStatusbar) {

  // Change Statusbar color //
  $cordovaStatusbar.overlaysWebView(true);

  $cordovaStatusbar.styleHex('#b73e2a');

})*/

// RUTAS
app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$compileProvider) {

  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.tabs.style("standard");
  $ionicConfigProvider.navBar.alignTitle("center");

  $urlRouterProvider.otherwise('/tabs/gallery');

  $stateProvider.state('tabs', {
    url: '/tabs',
    abstract: true,
    templateUrl: 'tabs.html'
  })

  $stateProvider.state('tabs.gallery', {
    url: '/gallery',
    views: {
      'gallery-tab': {
        templateUrl: 'gallery.html',
        controller: 'GalleryCtrl'
      }
    }
  })
  
  $stateProvider.state('tabs.today', {
    url: '/today',
    views: {
      'today-tab': {
        templateUrl: 'today.html',
        controller: 'TodayCtrl'
      }
    }
  })
  
  $stateProvider.state('tabs.profile', {
      url: '/profile',
      views: {
        'profile-tab': {
          templateUrl: 'profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })

  $stateProvider.state('tabs.article', {
      url: '/article',
      views: {
        'gallery-tab': {
          templateUrl: 'article.html',
          controller: 'ArticleCtrl'
        }
      }

    })
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});

app.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}]);
// CONTROLADORES

app.controller('GalleryCtrl', function($scope, $http, $ionicModal, $ionicActionSheet,Camera){
    $scope.title = "Galeria";

    getPosts();

    function getPosts(){
    	  var url = "http://localhost/slimrest/posts/";

    	  $http.get(url, {
    	    headers: {
    	      'Content-type': 'application/json'
    	    }
    	    }).
    	     success(function(posts) {
                console.log("Recogiendo posts...");
                console.log(posts);

                //$scope.allId = i;
             }).
    	    error(function(data_todo) {
    	        console.log("error");
    	  })
    };

    $ionicModal.fromTemplateUrl('new-post.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });

        $scope.openModal = function() {
          $scope.modal.show();
        };

        $scope.closeModal = function() {
          $scope.modal.hide();
        };

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hide', function() {
          // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
          // Execute action
        });
        $scope.$on('modal.shown', function() {
          console.log('Modal is shown!');
        });

        $scope.openOptions = function($img) {
             $ionicActionSheet.show({
                 buttons: [
                   { text: 'Camara' },
                   { text: 'Imagen desde galeria' }
                 ],
                 titleText: 'Nueva fotografia',
                 cancelText: 'Cancelar',
                 buttonClicked: function(index) {
			if(index === 0){ // Manual Button
				alert('Camara'+$img);
			 Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
    }, function(err) {
      console.err(err);
    });
		 	}
		       	else if(index === 1){
				alert('Galeria');
		       }
                   return true;
                 }
               });
            }
  
});

app.controller('TodayCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate, $ionicActionSheet, $http, $timeout) {
    $scope.title = "Today";

    // Insert new image from camera or gallery //

    $scope.openOptions = function() {
        $ionicActionSheet.show({
         buttons: [
           { text: 'Camara' },
           { text: 'Imagen desde galeria' }
         ],
         titleText: 'Nueva fotografia',
         cancelText: 'Cancelar',
         buttonClicked: function(index) {
		if(index === 0){ // Manual Button
		 alert('Camara');
	       }
	       else if(index === 1){
		alert('Galeria');
	       }
	       return true;
         }
       });
    }

    function getID() {

        var url = "http://localhost/slimrest/id/lastImg";

        $http.get(url, {
            headers: {
                'Content-type': 'application/json'
            }
        }).
        success(function(id) {
            console.log(id.id);
            $scope.index = id.id;
        }).
        error(function() {
            console.log("error");
        });

    };

    function getAllImages(){
    	  var url = "http://localhost/slimrest/images/" + $scope.index;

    	  $http.get(url, {
    	    headers: {
    	      'Content-type': 'image/jpeg'
    	    }
    	    }).
    	     success(function(image) {
                console.log("Recogiendo imagenes...");
                $scope.allImg = image;
                $scope.id = $scope.index;
             }).
    	    error(function(data_todo) {
    	        console.log("error");
    	  })
    }

    // Get images from DDBB //

    getID();

    // Timeout for async task //


            $timeout(function(){
                getAllImages();
                // TODO: CREAR MENSAJE CARGA //
            }, 1000);

    /*function genBrick(i) {
        var height = ~~(Math.random() * 500) + 100;
        var id = ~~(Math.random() * 10000);
        return {
            src: 'http://lorempixel.com/g/280/' + height + '/?' + id,
            index: i
        };
    };


    $scope.bricks = [
        genBrick(0),
        genBrick(1),
        genBrick(2),
        genBrick(3),
        genBrick(4),
        genBrick(5),
        genBrick(6),
        genBrick(7),
        genBrick(8),
        genBrick(9),
        genBrick(10),
        genBrick(11)
    ];*/

    $ionicModal.fromTemplateUrl('gallery-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function(index) {
      $ionicSlideBoxDelegate.slide(index);
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });

    // Call this functions if you need to manually control the slides
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };

    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

  	$scope.goToSlide = function(index) {
      $scope.modal.show();
      $ionicSlideBoxDelegate.slide(index);
    }

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };

});

app.controller('ArticleCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate) {
    $scope.title = "Today"

    function genBrick(i) {
        var height = 300;
        var id = ~~(Math.random() * 10000);
        return {
            src: 'http://lorempixel.com/g/280/' + height + '/?' + id,
            index: i
            };
        };

    $scope.bricks = [
        genBrick(0),
        genBrick(1),
        genBrick(2)

        ];

    $ionicModal.fromTemplateUrl('gallery-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function(index) {
      $scope.modal.show();
      $ionicSlideBoxDelegate.slide(index);
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });

    // Call this functions if you need to manually control the slides
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };

    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

  	$scope.goToSlide = function(index) {
      $scope.modal.show();
      $ionicSlideBoxDelegate.slide(index);
    }

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };

});

app.controller('ProfileCtrl', function($scope, $ionicModal) {
    $scope.title = "Info";

    $ionicModal.fromTemplateUrl('login.html', {
              scope: $scope,
              animation: 'slide-in-up'
            }).then(function(modal) {
              $scope.modal = modal;
            });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });

});
