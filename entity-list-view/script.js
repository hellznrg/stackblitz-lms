m.directive("entityListView", function () {
	return {
		restrict: "E",
		templateUrl: "entity-list-view/template.html",
		scope: {
			entity: "@",
		},
		controller: [
			"$scope",
			"db",
			function ($scope, db) {
				const refreshStructure = (entity) => {
					db.getStructure((structure) => {
						$scope.structure = structure[entity];
						$scope.keyField = Object.values($scope.structure.fields).find((x) => x.key).name;
					});
				};

				const refreshData = (entity) => {
					db.getData((data) => {
						$scope.data = data[entity];
					});
				};

				$scope.name = "Library Management System";

				$scope.$watch("entity", (newValue) => {
					refreshData(newValue);
					refreshStructure(newValue);
				});

				$scope.showEditDialog = false;
				$scope.showDeleteDialog = false;

				$scope.delete = (keyValue) => {
					$scope.selectedKey = keyValue;
					$scope.showDeleteDialog = true;
				};

				$scope.deleteConfirmButtons = [
					{
						text: "Yes",
						action: () => {
							console.log("Deleting " + $scope.selectedKey);
							db.deleteRecord($scope.entity, $scope.selectedKey, () => {
								refreshData($scope.entity);
							});
						},
					},
					{
						text: "No",
					},
				];
			},
		],
	};
});
