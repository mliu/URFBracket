(function() {
  'use strict';

  var storage = angular.module('StorageService', []);
  storage.factory('storageService', function() {

    storage = {

      isAvailable: function () {
        
        var supported =  Modernizr.localstorage;
        if(!supported) {
          console.log('WARNING: localStorage not available');
        }
        return supported;
      },

      set: function(key, value) {
        if(storage.isAvailable()) {
          localStorage.setItem(key, value);
        }
      },

      get: function(key) {
        if(storage.isAvailable()) {
          return localStorage.getItem(key);
        }
        return null;
      },

      clear: function(key) {
        if(storage.isAvailable()) {
          localStorage.removeItem(key);
        }
      }

    };
    return storage;

  });

})();
