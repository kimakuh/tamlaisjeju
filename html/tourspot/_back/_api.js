//
//  ktour-api-js
//	version: 1.1.0
//
//  Created by Steve Kim on 5/30/16.
//  Copyright © 2016 Steve Kim. All rights reserved.
//

( function(global) {

    // ================================================================================================
    //  Class: KTourApiAppCenter
    // ================================================================================================
    
	var KTourApiAppCenter = function() {};

	KTourApiAppCenter.basePath = "http://api.visitkorea.or.kr/openapi/service/rest";

	KTourApiAppCenter.languageType = {
	    Chs: "ChsService",
	    Cht: "ChtService",
	    Eng: "EngService",
	    Ger: "GerService",
	    Fre: "FreService",
	    Jpn: "JpnService",
	    Rus: "RusService",
	    Spn: "SpnService"
	};

	KTourApiAppCenter.defaultCenter = function() {
		if (!KTourApiAppCenter.uniqueInstance) {
			KTourApiAppCenter.uniqueInstance = new KTourApiAppCenter();
		}
		return KTourApiAppCenter.uniqueInstance;
	};

	KTourApiAppCenter.prototype = {
		appName: null,
		serviceKey: null,
		lang: KTourApiAppCenter.languageType.Chs,

		call: function(options) {
			if (this.serviceKey == undefined || this.serviceKey == null || this.serviceKey.length < 1) {
				options.completion(null, new Error(-1, "SERVICE KEY IS UNDEFINED."));
				return;
			}

			var data = options.param.raw();
			data.MobileApp = this.appName;
			data.MobileOS = "ETC";
			data.serviceKey = this.serviceKey;
			data._type = "json";

			$.get({
				url: KTourApiAppCenter.basePath + "/" + this.lang + "/" + options.path,
				data: data,
				success: function(rs){
					var result = options.param instanceof KTourApiListParam ? new KTourApiListResult(rs) : new KTourApiResult(rs);
					if (result.resultCode == 0) {
						options.completion(result, null);
					} else {
						options.completion(result, new Error(result.resultCode, result.resultMsg));
					}
				},
				error: function(err) {
					options.completion(null, err);
				}
			});
		},

		setUp: function(appName, serviceKey, lang) {
			this.appName = appName;
			this.serviceKey = decodeURIComponent(serviceKey);
			this.lang = lang;
		}
	};

    // ================================================================================================
    //  Class: KTourApiParam
    // ================================================================================================
    
	var KTourApiParam = function(param) {
		for (var pName in param) {
			this[pName] = param[pName];
		}
	};

	KTourApiParam.prototype = {
		raw: function() {
			var object = {};
			for (var key in this) {
				var value = this[key];

				if (!(value instanceof Function)) {
					object[key] = key.match(/^(.*?)YN$/g) ? (value ? "Y" : "N") : value;
				}
			}
			return object;
		}
	};
    
    // ================================================================================================
    //  Class: KTourApiListParam
    // ================================================================================================

	var KTourApiListParam = function(numOfRows, pageNo, param) {
		this.numOfRows = numOfRows;
		this.pageNo = pageNo;

		KTourApiParam.call(this, param);
	};

	KTourApiListParam.prototype = new KTourApiParam();
	KTourApiListParam.prototype.numOfRows = 10;
	KTourApiListParam.prototype.pageNo = 1;

    // ================================================================================================
    //  Class: KTourApiResult
    // ================================================================================================
    
	var KTourApiResult = function(raw) {
		if (raw) {
			var header = raw.response.header;
			var body = raw.response.body;
			this.resultCode = header.resultCode ? parseInt(header.resultCode) : this.resultCode;
			this.resultMsg = header.resultMsg;

			if (this.resultCode == 0) {
				this.items = body.items.item ? (body.items.item instanceof Array ? body.items.item : [body.items.item]) : [];
			}
		}
	};

	KTourApiResult.prototype = {
		numOfRows: 0,
		pageNo: 0,
		totalCount: 0,
		resultCode: -1,
		resultMsg: null,
		items: []
	};

    // ================================================================================================
    //  Class: KTourApiListResult
    // ================================================================================================
    
	var KTourApiListResult = function(raw) {
		if (raw) {
			KTourApiResult.call(this, raw);

			if (this.resultCode == 0) {
				var header = raw.response.header;
				var body = raw.response.body;
				this.numOfRows = body.numOfRows ? body.numOfRows : this.numOfRows;
				this.pageNo = body.pageNo ? body.pageNo : this.pageNo;
				this.totalCount = body.totalCount ? body.totalCount : this.totalCount;
			}
		}
	};

	KTourApiListResult.prototype = new KTourApiResult();
	KTourApiListResult.prototype.numOfRows = 0;
	KTourApiListResult.prototype.totalCount = 0;

	window.KTourApiAppCenter = KTourApiAppCenter;
	window.KTourApiParam = KTourApiParam;
	window.KTourApiListParam = KTourApiListParam;
	window.KTourApiResult = KTourApiResult;
	window.KTourApiListResult = KTourApiListResult;

}() );