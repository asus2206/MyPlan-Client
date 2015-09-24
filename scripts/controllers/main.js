'use strict';

/**
 * @ngdoc function
 * @name calendarAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the calendarAngularApp
 */
app.controller('CalendarController', function ($scope,$http,$log) {



    //SHOW HIDE FORM FOR NEW USER
    $scope.isHidingForm = true;
    $scope.toggleForm = function() {
        $scope.isHidingForm = !$scope.isHidingForm;

    };

    /* ######
        CONTROLLER ATTRIBUTES
       ######*/
    
    var today = moment();
    
    $scope.today = today;
    $scope.actualMonth = today.month();
    $scope.actualYear = today.year();

    
    /*
        users / events array for data from mysql db
    */
    $scope.users = [];
    $scope.events = [];


    /*
        First start. Set calender dates and load Users/Events...
    */
    setCalenderMonthData();
    loadUsers();
    loadEvents();
    

    /* ######
        CONTROLLER FUNCTIONS
       ######*/
    
    function setCalenderMonthData(){
        $scope.month = today.month($scope.actualMonth).format("MMMM, YYYY");
        $scope.actualMonthDayCount = today.month($scope.actualMonth).daysInMonth();
        
        $scope.days = [];
        // Lädt Anzahl der Tage des aktuellen Monats und lädt weekDay + dayNumber
        for (var i = 0; i <= $scope.actualMonthDayCount; i += 1) {
            $scope.days.push({ 
                weekDay: today.month($scope.actualMonth).date(i + 1).format("dd"),
                dayNumber: i + 1
            });
        }
    };
    
    /*
        change the actual view and show data from next month
    */
    $scope.next = function() {
        $scope.actualMonth++;
        setCalenderMonthData();
        loadEvents();
    };
    
    /*
        change the actual view and show data from prev month
    */
    $scope.prev = function() {
        $scope.actualMonth--;
        setCalenderMonthData();
        loadEvents();
    };

    /*
        use sail-rest-api to get all users from mysql db
    */
    function loadUsers(){
        $http.get("http://localhost:1337/user")
         .success(function(data){
                $scope.users = data;

         });
    };





    /*
        use sail-rest-api to get all events by actual month from mysql db
    */
    function loadEvents(){
        $http.get("http://localhost:1337/event/eventsOfMonth?month=" + ($scope.actualMonth + 1) )
         .success(function(data){
            $scope.events=data;
         });
    };

    /*
        use sail-rest-api to delete or destroy an event by id
    */
    $scope.delEvent = function(id) {
        $http.get("http://localhost:1337/event/destroy?id=" + id)
         .success(function(){
            loadEvents();
         });
    };

    /*
        use sail-rest-api to create an event by data from html form
    */
    $scope.saveDate = function(){
        var args = "Titel=" + $scope.selTitel + "&Day=" + $scope.selDay + "&Month=" + ($scope.actualMonth + 1) + "&Year=" + $scope.actualYear + "&Time=" + $scope.selTime + "&User=" + $scope.selUser;
        $http.get("http://localhost:1337/event/create?" + args)
         .success(function(){
            loadEvents();
         });
    };


    $scope.saveUser = function() {
        var args = "Username=" + $scope.selNewUser;
        $http.get("http://localhost:1337/user/create?" + args)
         .success(function(){
            loadUsers();
            loadEvents();
         });
    }
});
