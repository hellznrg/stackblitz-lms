m.directive("entityEdit", function () {
	return {
		restrict: "E",
		templateUrl: "entity-edit/template.html",
		scope: {
			show: "=",
			entity: "@",
			key: "@",
			saveAction: "=",
			structure: "=",
		},
		controller: [
			"$scope",
			"db",
			function ($scope, db) {
				$scope.data = {};

				$scope.$watch("show", (newValue) => {
					if (!newValue) return;

					const keyField = db.getKeyFieldName($scope.entity);

					if ($scope.key == "") {
						const data = {};
						for (const s of $scope.structure.fields) {
							if (s.type == "link" && s.multiplicity == "many") data[s.name] = [];
							else data[s.name] = null;
						}
						$scope.data = data;
					} else {
						db.getData().then((data) => {
							$scope.data = data[$scope.entity].find((x) => x[keyField] == $scope.key);
							$scope.$digest();
						});
					}

					setTimeout(() => {
						const e = document.getElementsByClassName("first-field")[0];
						e.select();
					});
				});

				$scope.actionButtons = [
					{
						text: "Save",
						action: () => {
							db.saveRecord($scope.entity, $scope.key, $scope.data).then(() => {
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
