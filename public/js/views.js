function Views() {
	return {
		initPage: function() {
			return '<div class="col-md-4 ">' +
	 				'<form id="general-info">' +
	                    '<div class="form-group">' +
	                        '<label for="var-num">Number of Variables</label>' +
	                        '<input type="number" class="form-control" min="0" max="6" id="var-num" name="var-num" required>' +
	                    '</div>' +
	                    '<button type="submit" class="btn btn-default">next</button>' +
	                '</form>' +
	            '</div>';
		},

		inputIndPage: function(numOfInd, varName) {
			var str = '';
			for(var i = 0; i < numOfInd; i++) {
				str += '<div class="form-group form-inline">' +
	                        '<label >Name of indice</label>' +
	                        '<input type="text" class="form-control ind-name" name="ind-name-' + i + '" required>' +
	                        '<label>Number</label>' +
	                        '<input type="number" class="form-control ind-num" name="ind-num-' + i + '" min="0" max="10" required>' +
	                    '</div>';
			}

			return '<div class="col-md-8">' +
					'<h2>' +  varName + '</h2>' +
	                '<form id="var-info">' +
	                        str + '<button type="submit" class="btn btn-default">next</button>' +
	                '</form>' +
	            '</div>';
		},

		inputDataPage: function(indArr, varName) {
			var numOfInd = indArr.length;
			var str = '';
			for(var i = 0; i < numOfInd; i++) {
				str += '<div class="form-group form-inline">' +
	                        '<label>' + indArr[i].name + '</label>' +
	                        '<input type="text" class="form-control data-val" required>' +
	                    '</div>';
			}
			return '<div class="col-md-12">' +
	                '<h2 class="var-name-displ">' + varName + '</h2>' +
	                '<div id="var-info" >' +
	                     str +
	  					//'<button  class="btn btn-default add-val">add</button>' +
	  					(numOfInd != 0 ? '<div  id="chart" style=" height: 400px; margin: 0 auto"></div>' : '') +
	  					'<button  class="btn btn-default">next</button></div></div>';
		},

		downloadPage: function() {
			return '<button class="btn">download</button>';
		}
	}

}
