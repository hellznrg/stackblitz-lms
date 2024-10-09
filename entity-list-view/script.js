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
            $scope.keyField = Object.values($scope.structure.fields).find(x => x.key).name;
          });
        });

        $scope.showEditDialog = false;
        $scope.showDeleteDialog = false;

        $scope.delete = (keyValue) => {
          console.log(keyValue);
          $scope.showDeleteDialog = true;
          $scope.selectedKey = keyValue;
        }

        $scope.deleteConfirmButtons = [
          {
            text: "Yes", action: () => {
              console.log("Deleting " + $scope.selectedKey);
            }
          },
          {
            text: "No", action: () => {
              $scope.showDeleteDialog = false;
            }
          }
        ]
      },
    ],
  };
});
