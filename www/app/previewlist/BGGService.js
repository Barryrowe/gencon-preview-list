'use strict';

(function(){
	angular
		.module('genconPreview')
		.constant('APIRoute', 'http://localhost:8100/xmlapi')
		//.constant('APIRoute', 'http://www.boardgamegeek.com/xmlapi')
		.factory('BGGService', BGGService);

	BGGService.$inject = ['$http', '$q', 'Storage', 'XmlUtil', 'APIRoute'];
	function BGGService($http, $q, Storage, XmlUtil, APIRoute){

        var GEEK_LIST_ID = 184821,
        	PREVIEW_LIST_STORAGE_KEY = "BGGPreviewList",       
        	_currentPreviewList = [];

        /**
         *Internal Functions
         **/
        function __isEmpty(list){
        	console.log("Setting up");
        	return list === undefined || list.length < 1;
        }

        function __translateGamesList(rawGames){
            var out = [];
            rawGames.forEach(function(game, index, arr){
                var attrs = game["@attributes"];
                out.push({
                   objectId: attrs.objectid,
                   title: attrs.objectname,
                   score: parseFloat(attrs.thumbs),
                   subtype: attrs.subtype
               });
            });

            return out;
        }

        function __extractPropertyIfExists(obj, propertyName){
        	var result;
        	if(obj && obj.hasOwnProperty(propertyName)){
        		result = obj[propertyName];
        	}
        	return result;
        }
        function __translateGameDetails(boardgameDetails){
        	console.log("Raw Details", boardgameDetails);


        	var deets = {
				yearPublished: __extractPropertyIfExists(boardgameDetails.yearpublished, "#text"),
				description: __extractPropertyIfExists(boardgameDetails.description, "#text"),
				thumbnailUrl: __extractPropertyIfExists(boardgameDetails.thumbnail, "#text"),
				imageUrl: __extractPropertyIfExists(boardgameDetails.image, "#text"),
				publisher: __extractPropertyIfExists(boardgameDetails.boardgamepublisher, "#text"),
				category: __extractPropertyIfExists(boardgameDetails.boardgamecategory, "#text"),
				version: __extractPropertyIfExists(boardgameDetails.boardgameversion, "#text"),
				comments: []
			};

			if(deets.thumbnailUrl && deets.thumbnailUrl.indexOf("//") === 0){
				deets.thumbnailUrl = "http:" + deets.thumbnailUrl;
			}
			if(deets.imageUrl && deets.imageUrl.indexOf("//") === 0){
				deets.imageUrl = "http:" + deets.imageUrl;
			}
			console.log("detail: ", boardgameDetails);
			if(boardgameDetails.comment){
				if(boardgameDetails.comment instanceof Array){
					boardgameDetails.comment.forEach(function(comment, i, arr){
						deets.comments.push({
							user: comment["@attributes"].username,
							message: comment["#text"]
						});
					});
				}else{					
					deets.comments.push({
						user: boardgameDetails.comment["@attributes"].username,
						message: boardgameDetails.comment["#text"]
					});
				}
			}
			return deets;        	
        }

        function __loadPreviewList(){
        	var deferred = $q.defer();
    		
			$http.get(APIRoute + '/geeklist/' + GEEK_LIST_ID)
			.success(function(xmlResult){							
				var jsonVersion = XmlUtil.convertToJson(xmlResult);				
                if(_currentPreviewList === undefined || _currentPreviewList.length < 1){
                    _currentPreviewList = __translateGamesList(jsonVersion.geeklist.item);
                }			                
                deferred.resolve(_currentPreviewList);
			})					
			.error(function(err){				
				deferred.reject(err);
			});	
				
			return deferred.promise; 
        }

        function __loadGameDetails(games){
        	var deferred = $q.defer();
			var gameIds = [];
            games.forEach(function(game, index, array){
            	gameIds.push(game.objectId);
            });
            gameIds = gameIds.join(',');                
            console.log(APIRoute + "/boardgame/" + gameIds);            		
				
			$http.get(APIRoute + '/boardgame/' + gameIds + "?comments=1")
			.success(function(xmlDetails){
				var detailsJson = XmlUtil.convertToJson(xmlDetails);
				detailsJson.boardgames.boardgame.forEach(function(detail, index, array){
					var deets = __translateGameDetails(detail);					
					var game = _.find(_currentPreviewList, function(g) { 
						return g.objectId == detail["@attributes"].objectid;
					});
					if(game !== undefined){
						game.details = deets;
					}
				});
				deferred.resolve(_currentPreviewList);
			})
			.error(function(err){
				deferred.reject(err);
			});

			return deferred.promise;
				
        }

        /**
         *Implementations
         **/
		function _loadGenconPreviewList(){
			var deferred = $q.defer();

			if(!__isEmpty(_currentPreviewList)){
            	console.log("Not Empty", _currentPreviewList);
                deferred.resolve(_currentPreviewList);
            }else{
            	//Check Local Storage
            	var storedVersion = Storage.get(PREVIEW_LIST_STORAGE_KEY, true);
            	if(!__isEmpty(storedVersion)){
            		console.log("FOUND IN STORAGE");
            		_currentPreviewList = storedVersion;
            		deferred.resolve(_currentPreviewList);            	
            	}else{
					__loadPreviewList()
					.then(__loadGameDetails)
					.then(function(gameData){
						_saveGenconPreviewList();
						deferred.resolve(gameData);
					})
					.catch(function(err){
						deferred.reject(err);
					});			
				}
			}
            				             
			return deferred.promise; 
		}


		function _getGameById(objectId){			

			var targetGame = _.find(_currentPreviewList, function(game){
				return game.objectId == objectId;
			});

			return targetGame;			
		}

		function _saveGenconPreviewList(){
			Storage.save(PREVIEW_LIST_STORAGE_KEY, _currentPreviewList);
		}

		/**
		 *Public API
		 **/
		return {
			loadGenconPreviewList: _loadGenconPreviewList,
			getGameById: _getGameById,
			savePreviewList: _saveGenconPreviewList
		};		
	}
})();
