(function () {
  'use strict';

  angular.module('myApp.controllers')
    .controller('BubbleCtrl', ['$scope', function($scope){
      $scope.title = "BubbleCtrl";
      $scope.d3Data = [
        {
          name: "Bubble A", 
          score:80
        },
        {
          name: "Bubble B", 
          score:75
        },
        {
          name: "Bubble C", 
          score: 28
        }
      ];
    }]);

}());
