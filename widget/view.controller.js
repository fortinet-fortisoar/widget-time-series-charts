'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('timeSeriesCharts100Ctrl', timeSeriesCharts100Ctrl);

        timeSeriesCharts100Ctrl.$inject = ['$scope', '$timeout', '$resource', 'config'];

    function timeSeriesCharts100Ctrl($scope, $timeout, $resource, config) {
        $scope.processing=true;
        $scope.config = config;
        $scope.init = init;
        $scope.errMsg = "No results for this chart yet. Data generation playbook has been triggred and results will populate shortly.";

        function init() {
            var dataFormat = {
                bindto: "#c3Chart-"+config.correlationValue
            };

            $resource('api/3/time_series_charts/:uuid').get({uuid:$scope.config.record_uuid}).$promise.then(function(data) {  
                if (!data.queryResults) {
                    $scope.noData=true;
                    $scope.processing=false;
                }
                else {
                    angular.forEach(data.queryResults, function(value, key) {
                        dataFormat[key] = value;
                    })

                    $timeout(function() {
                        c3.generate(dataFormat);
                        $scope.noData=false;
                        $scope.processing=false;
                        },
                    0,
                    false)
                }
            })
        }
        
        init();
    }
})();
