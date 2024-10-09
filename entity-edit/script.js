m.directive("entityEdit", function () {
	return {
		restrict: "E",
		templateUrl: "entity-edit/template.html",
		scope: {
			show: "=",
			entity: "@",
			key: "@",
			saveAction: "=",
		},
		controller: [
			"$scope",
			"db",
			function ($scope, db) {
				$scope.$watch("entity", (newValue) => {
					if (!newValue) return;
					db.getStructure((structure) => {
						$scope.structure = structure[newValue];
						db.getKeyFieldName(newValue, (keyFieldName) => {
							$scope.keyField = keyFieldName;
						});
					});
				});

				$scope.$watch("key", (newValue) => {
					db.getData((data) => {
						$scope.data = data[$scope.entity].find((x) => x[$scope.keyField] == newValue);
					});

					setTimeout(() => {
						document.getElementsByClassName("first-field")[0].select();
					}, 0);
				});

				$scope.actionButtons = [
					{
						text: "Save",
						action: () => {
							db.saveRecord($scope.entity, $scope.key, $scope.data, () => {
								$scope.saveAction();
							});
						},
					},
					{
						text: "Cancel",
					},
				];
			},
		],
	};
});
