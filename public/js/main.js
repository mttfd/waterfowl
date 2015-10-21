$(function() {
    checkAvaiable();

    var file = $("#upload");
    file.on("change", fileInputHandler);
    setChart();
    var index = $("#chart").data('highchartsChart');
    var chart = Highcharts.charts[index];
    console.dir(chart);
    $("td input").on("change", function(e) {
    	var value = [];
    	//console.log($(e.target.parentNode.parentNode).index($(e.target.parentNode)));
    	console.log(e.target.parentNode)
    	if($(".input-row").eq(0).find($(e.target.parent))) {
    		console.log($(this));
    		var index = $(".input-row:first-child td").index($(this).parent());
    		// if($(".input-row:nth-child(2) td").chindex).val().length > 0) {
    			chart.series[0].addPoint([e.target.value, $(".input-row:first-child td").get(index).val()]);
    		}

    	} else {
    		//chart.series[0].addPoint([0, e.target.value]);
    	}
    	//

    	console.log(e.target.value);

    });
});

function checkAvaiable() {
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        alert("File APIs are not fully supported in this browser.");
    }
}

function fileInputHandler(fileInput) {
    var reader = new FileReader();
    var file = fileInput.target.files[0];
    reader.onload = function(evt) {
        var content = evt.target.result;
        var rows = content.split("\n");

        rows.forEach(function(row) {
            $("#filecontent").append("<p>" + row + "</p>");
        });

        var jarr = csvToJson(rows);
        jarr.forEach(function(j) {
            console.log(j.toString());
            $("#jsoncontent").append("<p>" + j.toString() + '</p>');
        });
    };



    if (file != null) reader.readAsText(file);
}

function csvToJson(rows) {
    var jsonArr = [];
    var len = rows.length;
    var keys = rows[0].split(",");


    for (var i = 1; i < len; i++) {
        var vals = rows[i].split(',');
        var item = _.object(keys, vals);
        item.toString = function() {
            var self = this;
            var str = keys.reduce(function(accum, k) {
                return accum += ("" + k + ": " + self[k] + ", ");
            }, "{ ");
            return str.substring(0, str.length - 2) + " }";
        };
        jsonArr.push(item);
    }

    return jsonArr;
}

function setChart() {

    $('#chart').highcharts({
        title: {
            text: 'Waterfowl Food Energy',
            x: -20 //center
        },
        xAxis: {
            title: {
                text: 'x()'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        yAxis: {
            title: {
                text: 'y()'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: 'kg'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'somename',
            //data: [0.0, 7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }]
    });

}
