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
						const keyFieldName = db.getKeyFieldName($scope.entity);
						$scope.keyField = keyFieldName;
					});
				};

				const refreshData = (entity) => {
					db.getData((data) => {
						$scope.allData = data;
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

				$scope.add = () => {
					$scope.selectedKey = "";
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

				$scope.getLinkedEntity = (entityType, entityId) => {
					const keyField = db.getKeyFieldName(entityType);
					return $scope.allData[entityType].find((x) => x[keyField] == entityId);
				};

				const pattern = /(?<=~)\w*(?=~)/g;
				$scope.macroTransform = (entityType, entityId, macro) => {
					if (!macro) return;
					if (!entityType) return;
					const linked = $scope.getLinkedEntity(entityType, entityId);
					const matches = macro.match(pattern);
					for (let match of matches) {
						macro = macro.replaceAll(`~${match}~`, linked[match]);
					}
					return macro;
				};
			},
		],
	};
});
