m.directive('lmsDialog', function () {
  return {
    restrict: 'E',
    templateUrl: 'dialog/template.html',
    transclude: true,
    scope: {
      show: "=",
      title: "@",
    },
    controller: ["$scope", function($scope) {
      $scope.show = false;
      $scope.title = "(dialog title goes here)";
    }]
  };
});
