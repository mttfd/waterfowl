function Views() {
	return {
		initPage: function() {
			return '<div id="var-input-field" class="container-fluid ">' +
	 				'<form id="general-info">' +
	                    '<div class="form-group">' +
	                        '<label for="var-num">Number of Variables</label>' +
	                        '<input type="number" class="form-control" min="0" max="20" id="var-num" name="var-num" required>' +
	                    '</div>' +
	                    '<button type="submit" class="btn btn-default" style="display: block;">next</button>' +
	                '</form>' +
	            '</div>';
		},

		initVarPage: function() {
			return '<div id="var-input-field" class="container-fluid ">' +
	 				'<form id="general-info">' +
	                    '<div class="form-group">' +
	                        '<label for="var-num">Number of Variables</label>' +
	                        '<input type="number" class="form-control" min="0" max="20" id="var-num" name="var-num" required>' +
	                    '</div>' +
	                    '<button type="submit" class="btn btn-default" style="display: block;">next</button>' +
	                '</form>' +
	            '</div>';
		},

		inputIndPage: function(numOfInd, varName) {
			var str = '';
			for(var i = 0; i < numOfInd; i++) {
				str += '<div class="form-group form-inline">' +
	                        '<label >Name of subscript</label>' +
	                        '<input type="text" class="form-control ind-name" name="ind-name-' + i + '" required>' +
	                        '<label>Number</label>' +
	                        '<input type="number" class="form-control ind-num" name="ind-num-' + i + '" min="0" max="10" required>' +
	                    '</div>';
			}

			return '<div class="col-md-8">' +
					'<h2>' +  varName + '</h2>' +
	                '<form id="var-info">' +
	                        str + '<button type="submit" class="btn btn-default">go</button>' +
	                '</form>' +
	            '</div>';
		},

		inputDataPage: function(indArr, varName, cnt) {
			var numOfInd = indArr.length;
			var varArr = ['t', 'v(t)'];
			var str = '', subs = '';

			var singleSuffix = !Array.isArray(cnt);

			for(var i = 0; i < varArr.length; i++) {
				str += '<div class="form-group form-inline">' +
	                        '<label>' + varArr[i] + '</label>' +
	                        '<input type="text" class="form-control data-val" required>' +
	                    '</div>';
			}
			for(var i = 0; i < numOfInd; i++) {
				subs += '<span>' + indArr[i].name + (singleSuffix ? cnt : cnt[i]) + ' </span>';
			}
			return '<div class="col-md-12">' +
	                '<h2 class="var-name-displ">' + varName + '</h2>' +
	                '<div><span>for </span>' + subs + '</div>' +
	                '<div id="var-info" >' +
	                     str +
	  					//'<button  class="btn btn-default add-val">add</button>' +
	  					'<div  id="chart" style=" height: 400px; margin: 0 auto"></div>'+
	  					((singleSuffix && cnt === 0) || (!singleSuffix && cnt[0] === 0 && cnt[1] === 0) ? '' : '<button  class="btn btn-default prev-chart">prev chart</button>') +
	  					'<button class="btn btn-default next-chart">next chart</button></div></div>';
		},

		downloadPage: function() {
			return '<button class="btn">download</button>';
		},

		sideBar: function() {
			return ''
		}
	}

}
