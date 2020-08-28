var myApp = angular.module('myApp',['ui.bootstrap','ui.router']);

myApp.controller('MovieController',  function($q, $scope, $http){
    $scope.main = {
        page:1,
        total_items: 0,

    };

    $scope.$watch('search', function(val) {
        if (val) fetch();
    });

    $scope.search = " ";

    var fetch = function() {
      var a = $http.get("https://api.themoviedb.org/3/search/movie?api_key=66d60156d6cc30d33659f3d36accc815&language=en-US&query=" + $scope.search + "&page=" + ($scope.main.page) + "&include_adult=false");
      var b = $http.get("https://api.themoviedb.org/3/genre/movie/list?api_key=66d60156d6cc30d33659f3d36accc815&language=en-US&query=");


        $q.all([a,b]).then(function(response) {
            $scope.main.total_pages = response[0].data.total_pages;
            $scope.main.total_items = response[0].data.total_results;


            var movies = response[0].data.results;
            var genres = response[1].data.genres;



            movies.forEach(function(movie) {
                for (j = 0; j < movie.genre_ids.length; j++) {
                    for (k = 0; k < genres.length; k++){
                        if (movie.genre_ids[j] == genres[k].id) {
                            movie.genre_ids[j] = genres[k].name;
                        }
                    }
                }
            });

            $scope.details = movies;
            // $scope.$apply();

            // for (i = 0; i < movies.length;i++) {
            //     for (j = 0; j < movies[i].genre_ids.length;j++) {
            //         for (k = 0; k < genres.length; k++){
            //             if (movies[i].genre_ids[j] == genres[k].id) {
            //                 movies[i].genre_ids[j] = genres[k].name;
            //             }
            //         }
            //     }
            // }
        });

          // related search (not available for now)
          // $http.get("https://api.themoviedb.org/3/search/movie?api_key=66d60156d6cc30d33659f3d36accc815&language=en-US&query=" + $scope.search + "&page=1&include_adult=false")
          // .then(function(response){ $scope.related = response.data; });
    };

      if (!$scope.search) fetch();

      $scope.update = function(movie){
          $scope.search = movie.title;
      };

      $scope.select = function(){
          this.setSelectionRange(0, this.value.length);
      }

      $scope.nextPage = function() {
        if ($scope.main.page <= $scope.main.total_pages) {
            $scope.main.page++;
            fetch();
        }
      };

      $scope.previousPage = function() {
          if ($scope.main.page > 0) {
              $scope.main.page--;
              fetch();
          }
      };

      $scope.pageChanged = fetch;
});

myApp.config(function($stateProvider) {
    var helloState = {
      name: 'hello',
      url: '/hello',
      templateUrl : 'hello.html'
    }

    var searchState = {
      name: 'search',
      url: '/search',
      templateUrl : 'home.html'
    }

    var tvShow = {
        name: 'tv',
        url: '/search',
        templateUrl: ''
    }

    $stateProvider.state(helloState);
    $stateProvider.state(searchState);
  });