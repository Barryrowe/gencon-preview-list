'use strict';

(function(){
	angular
		.module('genconPreview.utils', [])
		.factory('Storage', Storage);

	Storage.$inject = [];
	function Storage(){
		
		function _get(key, asObject){			
			var result = window.localStorage.getItem(key);

			if(result !== undefined && asObject){
				result = JSON.parse(result);
			}
			if(result === null){
				result = undefined;
			}
			return result;
		}	

		function _save(key, data){
			var saveData;

			if(typeof(data) === 'string'){
				saveData = data;
			}else if(typeof(data) === 'object'){
				saveData = JSON.stringify(data);
			}

			window.localStorage.setItem(key, saveData);			
		}

		var _service = {
			get: _get,
			save: _save
		};

		return _service;
	}
})();