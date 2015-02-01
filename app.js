// constant 
var WEEKDAY = new Array(7);
WEEKDAY[0]=  "Sun.";
WEEKDAY[1] = "Mon.";
WEEKDAY[2] = "Tue.";
WEEKDAY[3] = "Wed.";
WEEKDAY[4] = "Thur.";
WEEKDAY[5] = "Fri.";
WEEKDAY[6] = "Sat.";

// memo , topic/ member data structure
/*
        $scope.members = [
            {id: 'post 5', attendance:  [-1, 0, 1], comments: 'test'},
            {id: 'post 2', attendance:  [1, 1, 1], comments: 'test'},
            {id: 'post 1', attendance:  [-1, 1, 1], comments: 'test'},
            {id: 'post 3', attendance:  [1, 1, 1], comments: 'test'},
            {id: 'post 4', attendance:  [0, 1, -1], comments: ''}
        ];
*/

angular.module('betterLife',['ui.router'])   // [] dependency ui.router
.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
              url: '/home',
              templateUrl: '/home.html',
              controller: 'MainCtrl'
            });
        $urlRouterProvider.otherwise('home');
}])
.factory('topic', [function(){
    var o = {
        title: "",
        topicDescription : "",
        candidateDates : [],
        members: []
    };
    return o;
}])
.controller('MainCtrl', [
    '$scope',
    'topic',
    function($scope, topic) {
        $scope.topicTitle = topic.title; //"";
        $scope.topicDescription = topic.topicDescription; //"";
        $scope.candidateDates= topic.candidateDates; //[];
        $scope.members = topic.members; //[];

        $scope.load = function() {
            // all jquery should do after angular scope loaded
            $(function() {
                $('#inlineDatepicker').datepick(
                    {
                        multiSelect:999,
                        monthsToShow:2,
                        //showTrigger: '#calImg',
                        //onSelect: angular.element('#angularBody').scope().selectDate
                        onSelect: $scope.selectDate
                    });
            });
        };

        $scope.hasComment = function(member) {
            if (member.comments === "" ||!member ) {
                return false;
            }
            return true;
        };

        $scope.addTopic = function () {
            if (!$scope.topicTitle || $scope.title === '' )  {  return ;    }
            $scope.addTitle($scope.topicTitle);
            $scope.addDesciption($scope.topicDescription);
            $scope.addMember();
        };

        $scope.selectDate = function(dates) {
            if (! dates || dates === '') {
                return ;
            }
            $scope.candidateDates = [];
            for (var i = 0; i < dates.length; i++) {
                 $scope.candidateDates.push($.datepick.formatDate(dates[i]));
            }
            $scope.candidateDates.sort();
            //console.log($scope.candidateDates);
        };

        $scope.getFullDate = function (date) {
            //console.log(date);
            var weekday = WEEKDAY[new Date(date).getDay()];
            return date + " (" + weekday + ")";
        };

        $scope.addTitle = function (title) {
            $scope.title = title;
        };

        $scope.addDesciption = function (desc) {
            $scope.desc = desc;
        };

        $scope.initialAttendance = function () {
            var attendances = [];
            for ( var dateIdx  in $scope.candidateDates) {
                attendances.push(-1);
            }
            return attendances;
        };

        $scope.addMember = function() {
            // Change to model call
            var memberID = $scope.members.length;
            var newMember = {
                id: memberID + 1,
                attendance : $scope.initialAttendance(),
                comments: "Thank you "
            };

            var found = false;
            for ( var memberIdx in $scope.members) {
                if (newMember.id == $scope.members[memberIdx].id)  {
                    console.log("Member Found!");
                    found = true;
                }
            }
            if (!found) {
                $scope.members.push(newMember);
            }
        };

        // load 
        $scope.load();
    }
]);



