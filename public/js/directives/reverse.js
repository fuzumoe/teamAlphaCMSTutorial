(function() {
    //reverse filter  reverses data by datew
    angular.module('reverseDirective', [])
        .filter('reverse', function() {
            return function(items) {
                return items.slice().reverse();
            };
        });
})();