m.directive('entityListView', function () {
  return {
    restrict: 'E',
    templateUrl: 'entity-list-view/template.html',
    scope: {
      entity: '@',
    },
    controller: [
      '$scope',
      'db',
      function ($scope, db) {
        $scope.name = 'Library Management System';

        $scope.$watch('entity', (newValue) => {
          db.getData((data) => {
            $scope.data = data[newValue];
          });

          db.getStructure((structure) => {
            $scope.structure = structure[newValue];
          });
        });
      },
    ],
  };
});
