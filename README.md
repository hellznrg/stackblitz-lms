# stackblitz-lms

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/hellznrg/stackblitz-lms)

- Directive names can't contain dashes. Instead, name the directive using camel case, and then you can use dashes in the template html. Eg. use lmsDialog as the directive name, and use it as "lms-dialog" in the template html.

- There are 2 kinds of dialog boxes:

  - dialog-show: Will always be present in the DOM, and it will be hidden/shown using the CSS "display" property. When show is true, "display: block". When show is false, "display: none".

  - dialog-repeat: Will be created and inserted into the DOM when show is true. When show is false, it will be removed from the DOM. This is implemented using ng-repeat. When show is false, the dialog will be "repeated 0 times", effectively removing it from the DOM. Doing it this way has certain pros and cons:

    - No need to reset values in the dialog box. Each time it is shown, it is a new clean instance.
    - It is harder and more problematic for transcluded content to access the current scope. For example,

      ```
      <div ng-init="localVar=5">
        {{ localVar }}

        <dialog-repeat show="show" transclude>
          <div>{{ localVar }}</div>
        </dialog-repeat>
      </div>
      ```

      The second {{ localVar }} will not print anything. In order to overcome this, the parent has to inject scope variables into the transcluded content:

            ```

      <div ng-init="localVar=5">
        {{ localVar }}

        <dialog-repeat show="show" transclude transcluded-scope-0="localVar">
          <div>{{ localVar }}</div>
        </dialog-repeat>
      </div>
      ```

    - Sometimes (often?) data in the dialog won't update unless you manually trigger a $digest cycle in a $timeout:

      ```
      // change a variable in the scope.
      $scope.localVar = 6;
      $timeout(() => {
          $scope.$digest();
      })
      ```
