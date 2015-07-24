'use strict';

(function(){
	angular
		.module('genconPreview')
		.constant('APIRoute', 'http://localhost:8100/xmlapi')
		//.constant('APIRoute', 'http://www.boardgamegeek.com/xmlapi2')
		.factory('BGGService', BGGService);

	BGGService.$inject = ['$http', '$q', 'XmlUtil', 'APIRoute'];
	function BGGService($http, $q, XmlUtil, APIRoute){

		function _loadGenconPreviewList(){
			var deferred = $q.defer();

			var now = new Date();

			$http.get(APIRoute + '/geeklist/184821')
			.success(function(xmlResult){				
				var jsonVersion = XmlUtil.convertToJson(xmlResult);				
				console.log("JSON Data", jsonVersion);
				
				deferred.resolve(jsonVersion.geeklist.item);								
			})			
			.error(function(err){
				deferred.reject(err);
			});
					
			return deferred.promise; 
		}

		function _loadGameDetails(objectId){
			var deferred = $q.defer();

			var url = APIRoute + '/boardgame/' + objectId;
			
			$http.get(url)
			.success(function(xmlData){
				deferred.resolve(XmlUtil.convertToJson(xmlData));
			})
			.error(function(err){
				deferred.resolve(err);
			});					
					

			return deferred.promise;
		}

		return {
			loadGenconPreviewList: _loadGenconPreviewList,
			loadGameDetails: _loadGameDetails
		};		
	}
})();