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
						db.getKeyFieldName($scope.entity, (keyFieldName) => {
							$scope.keyField = keyFieldName;
						});
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

				$scope.edit = (keyValue) => {
					$scope.selectedKey = keyValue;
					$scope.showEditDialog = true;
				};

				$scope.deleteConfirmButtons = [
					{
						text: "Yes",
						action: () => {
							db.deleteRecord($scope.entity, $scope.selectedKey, () => {
								refreshData($scope.entity);
							});
						},
					},
					{
						text: "No",
					},
				];

				$scope.saveAction = () => {
					refreshData($scope.entity);
				};
			},
		],
	};
});
