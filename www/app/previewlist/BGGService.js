'use strict';

(function(){
	angular
		.module('genconPreview')
		.constant('APIRoute', 'http://localhost:8100/xmlapi2')
		//.constant('APIRoute', 'http://www.boardgamegeek.com/xmlapi2')
		.factory('BGGService', BGGService);

	BGGService.$inject = ['$http', '$q', 'XmlUtil', 'APIRoute'];
	function BGGService($http, $q, XmlUtil, APIRoute){

		function _loadGenconPreviewList(){
			var deferred = $q.defer();

			$http.get(APIRoute + '/geeklist/184821')
			.success(function(xmlResult){
				console.log("XML DATA", xmlResult);

				var jsonVersion = XmlUtil.convertToJson(xmlResult);
				deferred.resolve(jsonVersion);
			})
			.error(function(err){
				deferred.reject(err);
			});

			return deferred.promise; 
		}
		return {
			loadGenconPreviewList: _loadGenconPreviewList
		};		
	}
})();