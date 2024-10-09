const m = angular.module('lms', []);

m.service('db', function ($http) {
  const errorHandler = (error) => {
    console.error('Error fetching structure data:', error);
    throw error;
  };

  this.getData = (successFn) =>
    $http.get('/api/data.json').then((response) => {
      successFn(response.data);
    }, errorHandler);

  this.getStructure = (successFn) => {
    $http.get('/api/structure.json').then((response) => {
      const structure = response.data;
      Object.values(structure).forEach((value) => {
        value.fields.sort((x, y) => x.order - y.order);
      });
      successFn(structure);
    }, errorHandler);
  };
});

m.controller('mainCtrl', function ($scope, db) {
  db.getStructure((structure) => {
    $scope.entities = structure;
  });
  $scope.shared = { selectedEntity: 'book' };
  $scope.dialog = false;
});

m.directive('virtual', function () {
  return {
    restrict: 'E',
    template: '<div ng-transclude></div>',
    transclude: true,
    replace: true,
    scope: {},
    controller: function ($scope, $element, $transclude) {
      $transclude(function (clone) {
        $element.after(clone);
        $element.css('display', 'none');
      });
    },
  };
});
