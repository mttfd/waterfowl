function Controller() {

}

Controller.prototype = {
    constructor: Controller,
    init: function(model) {
        //creat view
        this.views = Views();
        //create model
        this.model = model;

        //varibles
        this.vars = [];

        //if first time come
        if (!this.model) {
            //
            this.numOfVar = 0;

            //render view
            this.render("initPage");
            this.curVar = null;
        }

        //register events
        this.registerEvt();
    },
    render: function(page) {
        switch (page) {
            case 'initPage':
                $("#app").html(this.views[page]());
                break;
            case 'inputIndPage':
                $("#app").html(this.views[page](this.curVal.numOfInd, this.curVal.name));
                break;
            case 'inputDataPage':
                $("#app").html(this.views[page](this.curVal.inds, this.curVal.name));
                this.curVal.setChart();
                break;
            case 'DownloadPage':
                $("#app").html(this.views[page]());
                break;
            default:
                console.error("wrong page name!");
                break;
        }

    },

    registerEvt: function() {
        var self = this;
        $("#app").on("submit", "#general-info", function(evt) {
            evt.preventDefault();
            var formData = $('#general-info').serializeArray();
            this.numOfVar = parseFloat(formData[0].value);

            for (var i = 1; i < formData.length; i += 2) {
                var v = new Variable();
                v.init(formData[i].value, formData[i + 1].value);
                self.vars.push(v);
            }

            self.curVal = self.vars.shift();

            self.render("inputIndPage");
        });

        $("#app").on("change", "#general-info #var-num", function(evt) {
            // alert("Asd");
            var len = $("#var-num").val();
            $(".var-info").remove();
            for (var i = 0; i < len; i++) {
                $('<div class="form-group form-inline var-info" id="var-info-' + i + '" style="border: 1px solid black; padding: 10px;">' +
                    '<label>Variable Name</label>' +
                    '<input type="text" class="form-control"  name="var-name-' + i + '" required>' +
                    '<label>Number of Indices</label>' +
                    '<input type="number" class="form-control" max="2" min="0" name="num-ind-' + i + '" required>' +
                    '</div>').insertBefore($("#general-info button"));
            }

        });


        $("#app").on("submit", "#var-info", function(evt) {
            evt.preventDefault();
            var formData = $('#var-info').serializeArray();

            var inds = [];
            for (var i = 0; i < formData.length; i += 2) {
                inds.push({
                    name: formData[i].value,
                    num: formData[i + 1].value
                });
            }
            self.curVal.setIndInfo(inds);
            console.log(self.curVal.inds);
            self.render("inputDataPage");
        });


        $("#app").on("keydown", ".data-val:last-child", function(evt) {

        	if(evt.which == 13) {
        		//alert("ASd");
        		var data = [];
        		$(".data-val").each(function() {
        			var val = $(this).val().trim();
        			if (val) data.push(parseInt(val));
        		});

        		if(data.length != self.curVal.numOfInd) return;
        		$(".data-val").each(function() {
        			$(this).val("");
        		});
        		console.log(data);
        		self.curVal.chart.series[0].addPoint(data);
        	}
        });




    }
}

function Variable() {

}

Variable.prototype = {
    constructor: Variable,



    init: function(name, numOfInd) {
        this.name = name;
        this.numOfInd = numOfInd;
        this.cnt = 0;
    },

    //indArr [{name: ind1, num: 10}, ...]
    setIndInfo: function(indArr) {
        if (indArr.length == 0) return;
        this.inds = indArr;
        this.total = indArr.reduce(function(accum, ind) {
            return accum * ind.num;
        }, 1);

        if (indArr.length == 2) {
            this.seq = [];
            for (var i = 0; i < indArr[0].num; i++) {
                for (var j = 0; j < indArr[1].num; j++) {
                    this.seq.push([i, j]);
                }
            }
        }
    },

    next: function() {
        if (this.cnt == total) {

        }

        this.cnt++;
    },

    inputIndices: function() {

    },

    render: function() {

    },

    setChart: function() {
        $('#chart').highcharts({
            title: {
                text: 'Waterfowl Food Energy',
                x: -20 //center
            },
            xAxis: {
                title: {
                    text: this.inds[0].name+'()'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            yAxis: {
                title: {
                    text: this.inds[1] ? this.inds[1].name+'()' : 'y()'
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
                name: this.name,
                //data: [[2, 0.0], [3, 7.0], [5, 6.9]]
            }]
        });

		var index = $("#chart").data('highchartsChart');
    	this.chart = Highcharts.charts[index];

    }

}
