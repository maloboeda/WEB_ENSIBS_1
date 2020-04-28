var rennesData = angular.module("rennesData", []);

rennesData.controller("controler", ['$scope',
    function($scope) {

      $scope.taskList = [
        { done: true, task: 'Add a task'},
        { done: false, task: 'Walk the dog'}
      ];

      $scope.addTask = function(task) {
        $scope.taskList.push({ done: false, task: task });
        $scope.taskNotComplete();
      };

      $scope.deleteTask = function(task) {
        $scope.taskList.splice($scope.taskList.indexOf(task), 1);
        $scope.taskNotComplete();
      };

      $scope.clearCompleted = function () {
        var oldList = $scope.taskList;
        $scope.taskList = [];
        angular.forEach(oldList, function(task) {
            if (!task.done) $scope.taskList.push(task);
        });
      };
    }
]);
