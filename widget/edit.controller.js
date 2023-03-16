'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('editTimeSeriesCharts100Ctrl', editTimeSeriesCharts100Ctrl).controller('dataSetCtrl', dataSetCtrl);

    editTimeSeriesCharts100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'appModulesService', 'Entity', '$resource', 'SORT_ORDER', 'CommonUtils'];
    dataSetCtrl.$inject = ['$scope','Entity'];

    function editTimeSeriesCharts100Ctrl($scope, $uibModalInstance, config, appModulesService, Entity, $resource, SORT_ORDER, CommonUtils) {
      if (!config.dataSets) {
        config.dataSets = [];
      }
      $scope.config = config;

      appModulesService.load().then(function(modules) {
            $scope.modules = modules;

            $scope.moduleFields = {};
            $scope.moduleFieldsArrays = {};
            initializeFieldLists($scope.config.dataSets, []);
            
        });
        $scope.cancel = cancel;
        $scope.save = save;
        $scope.removeDataSet = removeDataSet;
        $scope.SORT_ORDER = SORT_ORDER;
        
        $scope.selectChartType = selectChartType;
        $scope.addDataSet = addDataSet;
        $scope.addSubDataSet = addSubDataSet;
        $scope.plotTypes = [
          'Bar',
          'Line',
          'Spline',
          'Step',
          'Area',
          'Scatter'
        ];
        $scope.timePeriods = ["Hourly", "Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];
        $scope.dateField = {
          'name': 'dateRange',
          'title': 'Date Range',
          'type': 'datetime.quick',
          'editable': true
        };
        $scope.status = {"open": true};

        function initializeFieldLists(dataSets, resources) {
          angular.forEach(dataSets, function(dataSet) {
            if (dataSet.resource && !resources.includes(dataSet.resource)) {
              populateFieldLists(dataSet.resource);
              resources.push(dataSet.resource);
            }
            else if (dataSet.dataSets) {
              resources = initializeFieldLists(dataSet.dataSets, resources);
            }
          })
          return resources;
        }
      
      	function selectChartType(chartType) {
            if ($scope.config.selectedChartType != chartType) {
                $scope.config.selectedChartType = chartType;
                $scope.config.dataSets = [];
            }
        }

        function populateFieldLists(resource) {
          let crEntity = new Entity(resource);
              crEntity.loadFields().then(function() {
                for (var key in crEntity.fields) {
                  if (crEntity.fields[key].type === 'datetime') {
                    crEntity.fields[key].type = 'datetime.quick';
                  }
                }
                $scope.moduleFields[resource] = crEntity.fields;
                $scope.moduleFieldsArrays[resource] = crEntity.getFormFieldsArray()
              })
        }
      
        function addDataSet(group) {
          let newDataSet = {
            "isOpen": false,
            "title": "",
            "group": group,
            "resource": null,
            "mappingField": null
          };
          if(group) {
            newDataSet.dataSets = [];
          }
          else {
            newDataSet.query = [];
            newDataSet.groupingField = null;
            newDataSet.plotType = "Bar";
          }
          $scope.config.dataSets.push(newDataSet)
        }

        function addSubDataSet(dataSet) {
            let newDataSet = {
                "title": "",
                "resource": null,
                "query": [],
                "subset": true
            };
            dataSet.dataSets.push(newDataSet);
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            if ($scope.editWidgetForm.$invalid) {
                $scope.editWidgetForm.$setTouched();
                $scope.editWidgetForm.$focusOnFirstError();
                return;
            }
            $scope.processing=true;

            if (! $scope.config.correlationValue) {
              var uniqueValue = CommonUtils.generateUUID();
              $scope.config['correlationValue'] = uniqueValue;
            }

            $scope.config.dataSets.forEach(dataSet => {adjustDataSetQuery(dataSet)});

            // The following commented code block is for the "Generate stats record on save" workflow. 
            let record_body = {
                "chartName": $scope.config.title,
                "chartConfig": $scope.config,
                "correlationValue": $scope.config.correlationValue,
                "queryModified": true
            };
            var stats_record = $resource('api/3/upsert/time_series_charts/');
            stats_record.save(record_body).$promise.then(function(stats) {
                // Update the config with the new uuid of the record associated with this chart
                $scope.config.record_uuid = stats.uuid;
                $uibModalInstance.close($scope.config);
            });
        }

        function removeDataSet(dataSets, index) {
          dataSets = dataSets.splice(index, 1);
        }

        function adjustDataSetQuery(dataSet) {
            if(dataSet.group) {
                dataSet.dataSets.forEach(subDataSet => adjustDataSetQuery(subDataSet));
            } else {
                dataSet.query.aggregates = [{
                  operator: 'countdistinct',
                  field: '*',
                  alias: 'total'
                }];
                if (dataSet.groupingField) {
                  dataSet.query.aggregates.push({
                    "operator": "groupby",
                    "field": $scope.moduleFields[dataSet.resource][dataSet.groupingField].type=='picklist' ? dataSet.groupingField + '.itemValue': dataSet.groupingField,
                    "alias": dataSet.groupingField
                  });
                  if ($scope.moduleFields[dataSet.resource][dataSet.groupingField].type=='picklist') {
                    dataSet.groupingFieldOptions = $scope.moduleFields[dataSet.resource][dataSet.groupingField].options.map(option => option.itemValue);
                  }
                }
                dataSet.query.sort = [];
            }
        }

    }

    function dataSetCtrl($scope, Entity) {
        let ds = $scope.dataSet;
        var dsc = this;
        if (!ds.group) {
            $scope.$watch('dataSet.resource', function(newValue, oldValue) {
                if (oldValue == newValue) {
                    return;
                }
                delete ds.query.filters;
                loadAttributes(ds);
            })
        }
        else {
            let sds = $scope.subDataSet;
            $scope.$watch('subDataSet.resource', function(newValue, oldValue) {
                if (oldValue == newValue) {
                    return;
                }
                delete sds.query.filters;
                loadAttributes(sds);
            })
        }
        

        function loadAttributes(dataSet) {
          if (!$scope.moduleFields[dataSet.resource]) {            
            dsc.entity = new Entity(dataSet.resource);
            dsc.entity.loadFields().then(function() {
              for (var key in dsc.entity.fields) {
                if (dsc.entity.fields[key].type === 'datetime') {
                  dsc.entity.fields[key].type = 'datetime.quick';
                }
              }
              $scope.moduleFields[dataSet.resource] = dsc.entity.fields;
              $scope.moduleFieldsArrays[dataSet.resource] = dsc.entity.getFormFieldsArray()
            })
          }
          }
    }
})();
