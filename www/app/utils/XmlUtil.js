'use strict';

(function(){
	angular
		.module('genconPreview')
		.factory('XmlUtil', XmlUtil);

	XmlUtil.$inject = [];
	function XmlUtil(){

		function _stringToXml(xml) {
		   var dom = null;
		   if (window.DOMParser) {
		      try { 
		         dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
		      } 
		      catch (e) { dom = null; }
		   }
		   else if (window.ActiveXObject) {
		      try {
		         dom = new ActiveXObject('Microsoft.XMLDOM');
		         dom.async = false;
		         if (!dom.loadXML(xml)) // parse error ..

		            window.alert(dom.parseError.reason + dom.parseError.srcText);
		      } 
		      catch (e) { dom = null; }
		   }
		   else
		      alert("cannot parse xml string!");
		   return dom;
		}

		function _xmlToJson(xml){
			if(typeof(xml) === 'string'){
				xml = _stringToXml(xml);
			}

		    var obj = {};
		    if (xml.nodeType == 1) {                
		        if (xml.attributes.length > 0) {
		            obj["@attributes"] = {};
		            for (var j = 0; j < xml.attributes.length; j++) {
		                var attribute = xml.attributes.item(j);
		                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
		            }
		        }
		    } else if (xml.nodeType == 3) { 
		        obj = xml.nodeValue;
		    }  
		    
		    if (xml.hasChildNodes()) {
		        for (var i = 0; i < xml.childNodes.length; i++) {
		            var item = xml.childNodes.item(i);
		            var nodeName = item.nodeName;
		            if (typeof (obj[nodeName]) == "undefined") {
		                obj[nodeName] = _xmlToJson(item);
		            } else {
		                if (typeof (obj[nodeName].push) == "undefined") {
		                    var old = obj[nodeName];
		                    obj[nodeName] = [];
		                    obj[nodeName].push(old);
		                }
		                obj[nodeName].push(_xmlToJson(item));
		            }
		        }
		    }
		    return obj;
		}

		return {
			convertToJson: _xmlToJson
		};
	}
})();