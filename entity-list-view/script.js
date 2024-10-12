m.directive("entityListView", function () {
	return {
		restrict: "E",
		templateUrl: "entity-list-view/template.html",
		scope: {
			entity: "@",
		},
		controller: [
			"$scope",
			"$timeout",
			"db",
			function ($scope, $timeout, db) {
				const refreshStructure = async (entity) => {
					const structure = await db.getStructure()
					$scope.structure = structure[entity];
					const keyFieldName = db.getKeyFieldName($scope.entity);
					$scope.keyField = keyFieldName;
				};

				const refreshData = (entity) => {
					db.getData().then((data) => {
						$scope.allData = data;
						$scope.data = data[entity];
					});
				};

				$scope.name = "Library Management System";

				$scope.$watch("entity", (newValue) => {
					refreshData(newValue);
					refreshStructure(newValue);
					$timeout(() => {
						$scope.$digest();
					});
				});

				$scope.showEditDialog = 0;
				$scope.showDeleteDialog = false;

				$scope.delete = (keyValue) => {
					$scope.selectedKey = keyValue;
					$scope.showDeleteDialog = true;
				};

				$scope.edit = (keyValue) => {
					$scope.selectedKey = keyValue;
					$scope.showEditDialog = 1;
				};

				$scope.add = () => {
					$scope.selectedKey = "";
					$scope.showEditDialog = 1;
				};

				$scope.deleteConfirmButtons = [
					{
						text: "Yes",
						action: () => {
							db.deleteRecord($scope.entity, $scope.selectedKey).then(() => {
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
