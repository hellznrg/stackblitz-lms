m.directive('dialog', function () {
  return {
    restrict: 'E',
    templateUrl: 'dialog/template.html',
    transclude: true,
  };
});
