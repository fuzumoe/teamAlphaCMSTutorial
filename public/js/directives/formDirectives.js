(function() {
    //form Directives module

    /**************************************************************************** */

    angular.module('formDirectives', [])
        .service('upload', function($http) {
            this.post = function(file) {
                $http.post('/pdf', file);
            }
        })
        //password field directive
        .directive("passwordDirective", function() {
            return {

                require: "ngModel",
                scope: true,
                replace: true,
                templateUrl: "../../views/pages/froms/password.html",

                link: function(scope, element, attrs, ngModel) {
                    if (!ngModel) return;

                    element.on('blur', function() {
                        ngModel.$dirty = true;
                        scope.$apply();
                    });

                    scope.onChange = function() {
                        ngModel.$setViewValue(scope.value);
                    };

                    ngModel.$render = function() {
                        scope.value = ngModel.$modelValue;
                    };
                }
            };
        })
        //email  field directive
        .directive("emailDirective", function() {
            return {
                require: "ngModel",
                scope: true,
                replace: true,
                templateUrl: "../../views/pages/froms/email.html ",
                link: function(scope, element, attrs, ngModel) {
                    if (!ngModel) return;
                    element.on('blur', function() {
                        ngModel.$dirty = true;
                        scope.$apply();
                    });
                    scope.onChange = function() {
                        ngModel.$setViewValue(scope.value);
                    };

                    ngModel.$render = function() {
                        scope.value = ngModel.$modelValue;
                    };
                }
            };
        })
        //name  field directive
        .directive("nameDirective", function() {
            return {
                require: "ngModel",
                scope: true,
                replace: true,
                templateUrl: "../../views/pages/froms/name.html ",
                link: function(scope, element, attrs, ngModel) {
                    if (!ngModel) return;
                    element.on('blur', function() {
                        ngModel.$dirty = true;
                        scope.$apply();
                    });
                    scope.onChange = function() {
                        ngModel.$setViewValue(scope.value);
                    };

                    ngModel.$render = function() {
                        scope.value = ngModel.$modelValue;
                    };
                }
            };
        })
        //date  field directive
        .directive("dateDirective", function() {
            return {
                require: "ngModel",
                scope: true,
                replace: true,
                templateUrl: "../../views/pages/froms/date.html ",
                link: function(scope, element, attrs, ngModel) {
                    if (!ngModel) return;
                    element.on('blur', function() {
                        ngModel.$dirty = true;
                        scope.$apply();
                    });
                    scope.onChange = function() {
                        ngModel.$setViewValue(scope.value);
                    };

                    ngModel.$render = function() {
                        scope.value = ngModel.$modelValue;
                    };
                }
            };
        })
        //file  field directive
        .directive("fileDirective", function() {
            return {
                require: "ngModel",
                scope: true,
                replace: true,
                templateUrl: "../../views/pages/froms/file.html ",
                link: function(scope, element, attrs, ngModel) {
                    if (!ngModel) return;
                    element.on('blur', function() {
                        ngModel.$dirty = true;
                        scope.$apply();
                    });
                    scope.onChange = function() {
                        ngModel.$setViewValue(scope.value);
                    };

                    ngModel.$render = function() {
                        scope.value = ngModel.$modelValue;
                    };
                }
            };
        })
        //date time  field directive
        .directive("dateTimeDirective", function() {
            return {
                require: "ngModel",
                scope: true,
                replace: true,
                templateUrl: "../../views/pages/froms/dateTime.html ",

                link: function(scope, element, attrs, ngModel) {

                    element.on('blur', function() {
                        ngModel.$dirty = true;
                        scope.$apply();
                    });
                    scope.onChange = function() {
                        ngModel.$setViewValue(scope.value);
                    };

                    ngModel.$render = function() {
                        scope.value = ngModel.$modelValue;
                    };
                }
            };
        })
        //text area  field directive
        .directive("textAreaDirective", function() {
            return {
                require: "ngModel",
                scope: true,
                replace: true,
                templateUrl: "../../views/pages/froms/textarea.html",
                link: function(scope, element, attrs, ngModel) {
                    if (!ngModel) return;
                    element.on('blur', function() {
                        ngModel.$dirty = true;
                        scope.$apply();
                    });
                    scope.onChange = function() {
                        ngModel.$setViewValue(scope.value);
                    };

                    ngModel.$render = function() {
                        scope.value = ngModel.$modelValue;
                    };
                }
            };
        })
        //invalid  field directive
        .directive("invalidDirective", function() {
            return {

                scope: true,
                replace: true,
                templateUrl: "../../views/pages/froms/invalid.html",


            };
        })
        //pdf file  field directive
        .directive('pdfs', ['upload', function(upload) {
            return {
                replace: true,
                scope: function() {
                    files = null;
                },
                template: '<input id="files" type="file">',
                link: function(scope, element) {
                    element.bind('change', function(evt) {
                        scope.$apply(function() {
                            scope.files = evt.target.files;
                        });
                    });
                },
                controller: function($scope, $attrs) {
                    $scope.$watch('files', function(files) {
                        //upload.put(files)
                        if (typeof files !== 'undefined' && files.length > 0) {
                            for (var i = 0; i < files.length; i++) {
                                readFile(files[i])
                            }
                        }
                    }, true);

                    function readFile(file) {
                        var reader = new FileReader();
                        reader.addEventListener("loadend", function(evt) {
                            upload.post({ name: file.name, data: reader.result })
                        })
                        if (reader.type = 'application/pdf') {
                            reader.readAsDataURL(file);
                        }
                    }
                }
            }
        }]);
})();