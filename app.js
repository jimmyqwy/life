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

// [] dependency ui.router
MyApp = angular.module('betterLife',['ui.router','ui.bootstrap']) ;

// config -> html template
MyApp
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
        $stateProvider
            .state('topics', {
              url: '/topics/{id}',
              templateUrl: '/topics.html',
              controller: 'TopicsCtrl'
            });
        $urlRouterProvider.otherwise('home');
    }
]);

// topics factory
MyApp.factory('topicsFactory',
        function() {
            var service = {};

            // Data structure
            // {ID: { title / desc / dates / members } }
            // members: memberID / attendance / comments
            var _topics = {};

            var isValidID = function(id) {
                 if ( id in _topics ) {
                    return true;
                }
                return false;
            };

            service.getTopicVolume = function () {
                return Object.keys(_topics).length;
            };

             // get attributes from a specific topicID
            service.getTopic = function(topicID) {
                if ( isValidID(topicID) ) {
                    return _topics[topicID];
                }
            };

            service.addTopic = function(id, title, description, candidateDates) {
                var newTopic = {
                    title : title,
                    desc: description,
                    dates: candidateDates,
                    members: []
                };
                _topics[id] = newTopic;
                return newTopic;
            };

            service.deleteTopic = function(topicID) {
                if ( isValidID(topicID) ) {
                    //_topics.splice(id, 1) ;      //  remove the element
                    delete _topics[topicID];
                }
            };

            // add members for a specific topic
            service.addMembers = function ( topicID, members ) {
                if ( isValidID(topicID) ) {
                    _topics[topicID].members = members;
                }
            };
            return service;
        }
);

// MainCtrl with home url , and pattern
MyApp.controller('MainCtrl', [
    '$scope',
    '$state',
    'topicsFactory',
    function($scope, $state, topicsFactory) {
        
        $scope.topicTitle = "";
        $scope.topicDescription = "";
        $scope.candidateDates= [];
        $scope.members = [];

        $scope.load = function() {
            // all jquery could be avaiable after angular scope loaded
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
            //d3.select("body").append("p").text("aaaabbbbetste");
        };

        $scope.addTopic = function () {
            if ( !$scope.topicTitle )  {  return ;    }
            $scope.topicID = topicsFactory.getTopicVolume() + 1;
            
            topicsFactory.addTopic($scope.topicID.toString(), $scope.topicTitle,
                $scope.topicDescription, $scope.candidateDates);

            // go to 'topics' template view  -> members
            $state.go('topics', {'id' : $scope.topicID});
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

        // load 
        $scope.load();
    }
]);

// PostCtrl with url: '/topics/{id}', adn topics.html template
MyApp.controller('TopicsCtrl', [
    '$scope',
    '$stateParams',
    '$modal',
    'topicsFactory',
    function($scope, $stateParams, $modal, topicsFactory) {
        $scope.topicID = $stateParams.id;
        $scope.topic = topicsFactory.getTopic($scope.topicID);
        $scope.selectedResults=[];

        $scope.load = function() {
            $(function() {
                function endEdit(e) {
                    var input = $(e.target),
                        label = input && input.prev();

                    label.text(input.val() === '' ? defaultText : input.val());
                    input.hide();
                    label.show();
                }

                $('#clickedit').hide()
                .focusout(endEdit)
                .keyup(function (e) {
                    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                        endEdit(e);
                        return false;
                    } else {
                        return true;
                    }
                })
                .prev().click(function () {
                    $(this).hide();
                    $(this).next().show().focus();
                });
            });
        };

        $scope.getFullDate = function (date) {
            //console.log(date);
            var weekday = WEEKDAY[new Date(date).getDay()];
            return date + " (" + weekday + ")";
        };

        $scope.hasComment = function(member) {
            if (member.comments === "" ||!member ) {
                return false;
            }
            return true;
        };

        $scope.initialAttendance = function () {
            var attendances = [];
            for ( var dateIdx  in $scope.topic.dates) {
                var att = Math.floor((Math.random() * 3) -1);
                attendances.push(att);
                console.log(att);
            }
            return attendances;
        };

        $scope.addMember = function( MemberName ) {
            // Change to model call
            var memberID = $scope.topic.members.length;
            var newMember = {
                memID: memberID + 1,
                name : MemberName,
                attendance : $scope.initialAttendance(),
                comments: "Thank you "
            };

            var found = false;
            for ( var memberIdx in $scope.topic.members) {
                if (newMember.memID == $scope.topic.members[memberIdx].memID)  {
                    console.log("Member Found!");
                    found = true;
                }
            }
            if (!found) {
                $scope.topic.members.push(newMember);
            }
            return newMember;
        };

        $scope.addJoinMember = function (size) {
            var modalInstance = $modal.open({
              templateUrl: 'memberModel.html',
              controller: 'MemberModalInstanceCtrl',
              size: size,
              resolve: {
                candidateDates: function () {
                    return $scope.topic.dates;
                }
              }
            });

            modalInstance.result.then(function (selectedResults) {
              $scope.selectedResults = selectedResults;
              console.log($scope.selectedResults);
            }, function () {
              console.info('Modal dismissed at: ' + new Date());
            });
        };

        // Add adminstrator
        // topicsFactory.topic have referece to current $scope.topic
        // add members will also add to topicFactory
        $scope.adminMember = $scope.addMember("Admin");
        $scope.load();
    }
]);


MyApp.controller('MemberModalInstanceCtrl',
    function ($scope, $modalInstance, candidateDates) {
        $scope.candidateDates = candidateDates;
        $scope.selections = [];
        for (var date in candidateDates) {
            $scope.selections.push({
                date : date,
                selected: 0
            });
        }
       /*
        $scope.candidateDates = candidateDates;
        $scope.selected = {
        item: $scope.items[0]
        };
        */
         $scope.getFullDate = function (date) {
            //console.log(date);
            var weekday = WEEKDAY[new Date(date).getDay()];
            return date + " (" + weekday + ")";
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selections);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
});