m.directive("lmsDialog", function () {
	return {
		restrict: "E",
		templateUrl: "dialog/template.html",
		transclude: true,
		scope: {
			show: "=",
			title: "@",
			message: "@",
			buttons: "=",
		},
		controller: [
			"$scope",
			function ($scope) {
				$scope.show = false;
				$scope.choose = (action) => {
					if (action) action();
					$scope.show = false;
				};
			},
		],
	};
});
