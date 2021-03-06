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

		inputIndPage: function(curVal) {
			var str = '';
			var initiated = (curVal.inds.length !== 0);

			for(var i = 0; i < curVal.numOfInd; i++) {
				str += '<div class="form-group form-inline">' +
	                        '<label >Name of subscript</label>' +
	                        '<input type="text" class="form-control ind-name" value="' + (initiated ? curVal.inds[i].name : "") +
	                        '" name="ind-name-' + i + '" required >' +
	                        '<label>Number</label>' +
	                        '<input type="number" class="form-control ind-num" value="' + (initiated ? curVal.inds[i].num : "") +
	                        '" name="ind-num-' + i + '" min="0" max="10" required>' +
	                    '</div>';
			}

			return '<div class="col-md-8">' +
					'<h2>' +  curVal.name + '</h2>' +
	                '<form id="var-info">' +
	                        str + '<button type="submit" class="btn btn-default">go</button>' +
	                '</form>' +
	            '</div>';
		},

		inputDataPage: function(curVal) {
			var indArr = curVal.inds;
			var varName = curVal.name;
			var cnt = curVal.seq[curVal.cnt];
			var numOfInd = indArr.length;
			var varArr = ['t', 'v(t)'];
			var str = '', subs = '';



			var singleSuffix = !Array.isArray(cnt);

			//var graphDataList =  singleSuffix ? curVal.data["e"+cnt] : curVal.data["e"+cur[0]+"-"+cur[1]];

			for(var i = 0; i < varArr.length; i++) {
				str += '<div class="form-group form-inline value-input">' +
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
