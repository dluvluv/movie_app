var myHome = angular.module('myApp');

myHome.controller('HomeController',  function($q, $scope, $http){
    //variables
    $scope.main = {
        page:1,
        total_items: 0
    };
    $scope.year = 0;
    $scope.genre = 0;
    $scope.isNavCollapsed = true;
    $scope.isCollapsed = false;
    $scope.isCollapsedHorizontal = false;
    $scope.link = "https://api.themoviedb.org/3/discover/movie?api_key=66d60156d6cc30d33659f3d36accc815&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=";
    $scope.query = "https://api.themoviedb.org/3/genre/movie/list?api_key=66d60156d6cc30d33659f3d36accc815&language=en-US&query=";
    //functions
    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1,
        minMode: 'year'
    };

    $scope.formats = ['yyyy'];
    $scope.format = $scope.formats[0];

    $scope.status = {
        opened: false
    };

    var fetch = function() {
        var a = $http.get($scope.link + $scope.main.page);
        var b = $http.get($scope.query);


          $q.all([a,b]).then(function(response) {
              $scope.main.total_pages = response[0].data.total_pages;
              $scope.main.total_items = response[0].data.total_results;
              console.log(response);


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
              $scope.genres = genres;
        });
    };
    fetch();

    $scope.update = function(movie){
        $scope.search = movie.title;
    };

    $scope.select = function(){
        this.setSelectionRange(0, this.value.length);
    };

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

     // select genre and year function
    $scope.testFunction = function(){

        if($scope.dt > 0){
            $scope.year = $scope.dt.getFullYear() ;
        }

        var da = $http.get($scope.link + $scope.main.page + "&primary_release_year=" + $scope.year);
        var ba = $http.get($scope.query);

        // console.log($scope.link,$scope.main.page,"&primary_release_year=",$scope.year,"&with_genres=",$scope.genre);

            if($scope.genre > 0 ){
                da = $http.get($scope.link + $scope.main.page + "&primary_release_year=" + $scope.year + "&with_genres=" + $scope.genre);
            }$q.all([da,ba]).then(function(response) {
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

            // console.log($scope.genre);
            // console.log($scope.year);
         });
     };
});
