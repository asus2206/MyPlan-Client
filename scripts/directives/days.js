app.directive('days', function() {
    return {
        restrict: 'E',
        scope: {
            display: '='
        },
        templateUrl: 'scripts/directives/days.html'
    };
});