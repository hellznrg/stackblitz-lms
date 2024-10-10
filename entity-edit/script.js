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
				$scope.data = {};

				$scope.$watch("entity", (newValue) => {
					if (!newValue) return;
					db.getStructure((structure) => {
						$scope.structure = structure[newValue];
						const keyFieldName = db.getKeyFieldName(newValue);
						$scope.keyField = keyFieldName;
					});
				});

				$scope.$watch("show", (newValue) => {
					if (newValue) {
						if ($scope.key == "") {
							$scope.data = {};
							for (const s of $scope.structure.fields) {
								if (s.type == "link" && s.multiplicity == "many") $scope.data[s.name] = [];
								else $scope.data[s.name] = null;
							}
						} else {
							db.getData((data) => {
								$scope.data = data[$scope.entity].find((x) => x[$scope.keyField] == $scope.key);
							});
						}

						setTimeout(() => {
							const e = document.getElementsByClassName("first-field")[0];
							e.select();
						}, 0);
					}
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
