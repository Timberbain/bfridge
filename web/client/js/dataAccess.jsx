window.jQuery = require("jquery");
window.$ = require("jquery");

export default class DataAccess {

	constructor( serverurl = "" ){
		this.serverurl = serverurl;
	}

	AjaxCall(action, data, success, failure){
		if(success == null){
			success = (e) => { console.log(e); }
		}
		if(failure == null){
			failure = (e) => { console.log(e['responseText']); }
		}
        // console.log({'action': action, 'data': data}, this.serverurl);
		$.ajax({
			url: this.serverurl,
			type: 'POST',
			data: {'action': action, 'data': data},
			dataType: 'JSON',
			success: success,
			error: failure
		});
	}

	AjaxCallSync(action, data){
		return $.ajax({
			url: this.serverurl,
			type: 'POST',
			async: true,
			data: {'action': action, 'data': data},
			dataType: 'JSON'
		}).responseText;
	}
}
