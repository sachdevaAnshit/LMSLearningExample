(function() {
    'use strict';
    angular.module("libraryApp").controller("copyrightController", copyrightController);
    copyrightController.$inject = ['$scope', '$rootScope', '$log', '$http', '$window', '$q', '$sce', '$location', 'apiService', 'CONSTANTS', 'URLS'];

    function copyrightController($scope, $rootScope, $log, $http, $window, $q, $sce, $location, apiService, CONSTANTS, URLS) {
        sessionStorage.routeToRedirect = "/user/copyright";
        var allPromises, routeToReRun, parsedSearchQuery, objToappendToURL = {},
            obj, str = "",
            splicedString, key;
        if (CONSTANTS.getCONSTANTS().NULLCHECK == sessionStorage.LMS_AUTH_TOKEN || CONSTANTS.getCONSTANTS().EMPTYSTRINGCHECK == sessionStorage.LMS_AUTH_TOKEN) {
            $location.path('/login')
        } else {
            $scope.CONSTANTS = CONSTANTS;
            allPromises = [
            apiService.getData($rootScope.config.url + URLS.getURLS().COPYRIGHTURL + URLS.getURLS().MATRIXURL, 
            	sessionStorage.LMS_AUTH_TOKEN), 
            apiService.getData($rootScope.config.url + URLS.getURLS().COPYRIGHTURL + 
            	URLS.getURLS().COPYRIGHTUSECASE + '/qa', sessionStorage.LMS_AUTH_TOKEN)];
            $q.all(allPromises).then(function(values) {
                $scope.copyrightMatrixData = values[0].data;
                angular.forEach(Object.keys($scope.copyrightMatrixData), function(elem, key) {
                    angular.forEach($scope.copyrightMatrixData[key], function(innerElem, innerKey) {
                        innerElem.content = $sce.trustAsHtml(innerElem.content)
                    })
                });
                $scope.copyRightUseCaseDropdowns = values[1].data
            })
        }
        $scope.assignColor = function(passedColor) {
            obj = {
                "background-color": passedColor,
                "width": "100%",
                "height": "100%"
            };
            return obj
        };
        $scope.copyRightDropDownChanged = function(keyChanged, value) {
            if ($scope.useCaseQaResult != CONSTANTS.getCONSTANTS().NULLCHECK) {
                $scope.resetDropdowns()
            } else {
                $scope.useCaseQaResult = CONSTANTS.getCONSTANTS().NULLCHECK;
                $scope.excelUploadError = CONSTANTS.getCONSTANTS().NULLCHECK;
                objToappendToURL[keyChanged] = value;
                str = "";
                for (key in objToappendToURL) {
                    if (objToappendToURL[key] != "" && objToappendToURL[key] != "undefined" && objToappendToURL[key] != undefined)
                        str += key + '=' + encodeURIComponent(objToappendToURL[key]) + '&'
                };
                splicedString = str.substring(0, str.length - 1);
                apiService.getData($rootScope.config.url + URLS.getURLS().COPYRIGHTURL + URLS.getURLS().COPYRIGHTUSECASE + '/qa?' + splicedString, sessionStorage.LMS_AUTH_TOKEN).then(function(response) {
                    if (CONSTANTS.getCONSTANTS().NULLCHECK == response.headers().lms_auth_token) {
                        $location.path("/login")
                    } else {
                        for (key in response.data) {
                            $scope.copyRightUseCaseDropdowns[key] = response.data[key]
                        }
                    }
                }, function(data) {})
            }
        };
        $scope.objToAsk = {};
        $scope.useCaseSearch = function() {
            $scope.useCaseQaResult = CONSTANTS.getCONSTANTS().NULLCHECK;
            $scope.excelUploadError = CONSTANTS.getCONSTANTS().NULLCHECK;
            objToappendToURL = {};
            $http({
                method: "POST",
                url: $rootScope.config.url + URLS.getURLS().COPYRIGHTURL + URLS.getURLS().COPYRIGHTUSECASE + '/search',
                responseType: 'JSON',
                data: $scope.objToAsk,
                headers: {
                    LMS_AUTH_TOKEN: sessionStorage.LMS_AUTH_TOKEN,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(function successCallback(response) {
                $scope.useCaseQaResult = "<span>" + response.data.legalRecommendation + "</span><br/><span>ID " + response.data.id + "</span>";
                $scope.resultToDisplay = response.data
            }, function errorCallback(errorResPonse) {
                if (errorResPonse.data.errCode == 417) {
                    $scope.excelUploadError = errorResPonse.data.message
                } else {
                    $location.path('/error')
                }
            })
        }
        $scope.resetDropdowns = function() {
            $scope.objToAsk = {};
            objToappendToURL = {};
            $scope.useCaseQaResult = CONSTANTS.getCONSTANTS().NULLCHECK;
            $scope.excelUploadError = CONSTANTS.getCONSTANTS().NULLCHECK;
            apiService.getData($rootScope.config.url + URLS.getURLS().COPYRIGHTURL + URLS.getURLS().COPYRIGHTUSECASE + '/qa', sessionStorage.LMS_AUTH_TOKEN).then(function(response) {
                if (CONSTANTS.getCONSTANTS().NULLCHECK == response.headers().lms_auth_token) {
                    $location.path("/login")
                } else {
                    $scope.copyRightUseCaseDropdowns = response.data
                }
            }, function(data) {})
        }
    }
})()