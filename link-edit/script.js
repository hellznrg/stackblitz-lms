m.directive("linkEdit", function () {
	return {
		restrict: "E",
		templateUrl: "link-edit/template.html",
		scope: {
			linkFromField: "=",
			value: "=",
		},
		controller: [
			"$scope",
			"db",
			function ($scope, db) {
				$scope.selections = {};

				if ($scope.linkFromField.type == "link") {
					db.getData().then((data) => {
						const keyFieldName = db.getKeyFieldName($scope.linkFromField.link);
						$scope.data = data[$scope.linkFromField.link];
						$scope.keys = $scope.data.map((x) => x[keyFieldName]);

						const _selections = {};
						for (let key of $scope.keys) {
							_selections[key] =
								$scope.linkFromField.name in $scope.value
									? $scope.value[$scope.linkFromField.name].includes(key)
									: false;
						}
						$scope.selections = _selections;
					});
				}
			},
		],
	};
});
