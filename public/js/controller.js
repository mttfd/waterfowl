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

        this.cnt = 0;

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
                $("#app").html(this.views[page](this.curVal.inds, this.curVal.name, this.curVal.seq[this.curVal.cnt]));
                this.curVal.setChart();
                break;
            case 'downloadPage':
                $("#app").html(this.views[page]());
                break;
            default:
                console.error("wrong page name! " + page);
                break;
        }

    },

    renderPartial: function() {

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
                $("#side-nav .list-group").append("<li class='list-group-item'><span class='var-link'>"+formData[i].value+"</span><span class='var-del'>×</span></li>");
            }

            self.curVal = self.vars[self.cnt];

            self.render("inputIndPage");
        });

        $("#app").on("change", "#general-info #var-num", function(evt) {
            // alert("Asd");
            var len = $("#var-num").val();
            $(".var-info").remove();
            if(len > 20 || len < 0) {
                $('<p class="err-msg">The number of variable should be in the range of 0 - 20.</p>').insertBefore($("#general-info button"));
                // setTimeout(function() {
                //     $(".err-msg").remove();
                // }, 2000);
                return false;
            }
            for (var i = 0; i < len; i++) {
                $('<div class="form-group  var-info" id="var-info-' + i + '" >' +
                    '<label>Variable Name</label>' +
                    '<input type="text" class="form-control"  name="var-name-' + i + '" required>' +
                    '<label>Number of Subscripts</label>' +
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

        		//if(data.length != self.curVal.numOfInd) return;
        		$(".data-val").each(function() {
        			$(this).val("");
        		});
        		//console.log(data);
        		self.curVal.chart.series[0].addPoint(data);
                self.curVal.addData(data);
                console.log(data);
        	}
        });

        $("#app").on("click", ".next-chart", function(evt) {

            var next = self.curVal.next();
            if(!next) {
                if(self.cnt == self.vars.length-1) {
                    self.render("downloadPage");
                    return;
                }
                self.cnt++;
                self.curVal = self.vars[self.cnt];
                self.render("inputIndPage");

                return;
            }

            self.render("inputDataPage");

        });

        $("#app").on("click", ".prev-chart", function(evt) {

            var prev = self.curVal.prev();
            if(!prev) {

                // self.cnt++;
                // self.curVal = self.vars[self.cnt];
                // self.render("inputIndPage");

                return;
            }

            self.render("inputDataPage");

        });

        $("#side-nav ul").on("click", ".var-link", function(evt) {
            // for(var i = 0; i < 10)
            self.curVal = self.vars[self.cnt];
            self.render("inputIndPage");
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
        this.data = {};
    },

    //indArr [{name: ind1, num: 10}, ...]
    setIndInfo: function(indArr) {
        if (indArr.length == 0 || indArr.length >= 3) return;
        this.inds = indArr;
        // this.total = indArr.reduce(function(accum, ind) {
        //     return accum * ind.num;
        // }, 1);
        this.seq = [];
        if (indArr.length == 2) {

            for (var i = 0; i < indArr[0].num; i++) {
                for (var j = 0; j < indArr[1].num; j++) {
                    this.seq.push([i, j]);
                    this.data["e"+i+"-"+j] = [];
                }
            }
        } else {
            for(var i = 0; i < indArr[0].num; i++) {
                this.seq.push(i);
                this.data["e"+i] = [];
            }
        }
    },

    next: function() {
        if (this.cnt == this.seq.length-1) {
            return false;
        }
        console.log(this.cnt);

        this.cnt++;
        return true;
    },

    prev: function() {
        if(this.cnt === 0) {
            return false;
        }

        this.cnt--;
        return true;
    },

    addData: function(data) {
        var cur = this.seq[this.cnt];
        //console.log(this.seq);
        this.data["e"+cur[0]+"-"+cur[1]].push(data);
    },


    setChart: function() {
        $('#chart').highcharts({
            title: {
                text: 'Waterfowl Food Energy',
                x: -20 //center
            },
            xAxis: {
                title: {
                    //text: this.inds[0].name+'()'
                    text: "t"
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            yAxis: {
                title: {
                    //text: this.inds[1] ? this.inds[1].name+'()' : 'y()'
                    text: "v(t)"
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
