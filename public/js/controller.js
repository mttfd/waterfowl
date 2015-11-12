function Controller() {

}

Controller.prototype = {
    constructor: Controller,
    init: function(model) {
        //creat view
        this.views = Views();
        //create model
        this.model = Model();

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
    render: function(page, afterRender) {
        switch (page) {
            case 'initPage':
                $("#app").html(this.views[page]());
                break;
            case 'inputIndPage':
                $("#app").html(this.views[page](this.curVal));
                break;
            case 'inputDataPage':
                $("#app").html(this.views[page](this.curVal));
                this.curVal.setChart();
                break;
            case 'downloadPage':
                $("#app").html(this.views[page]());
                break;
            default:
                console.error("wrong page name! " + page);
                break;
        }

        if(afterRender && (typeof afterRender === 'function')) afterRender();

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

            //到时候需要改成self.curVal.equals(新的var)
            if(self.curVal.inds.length === 0) {
                var inds = [];
                for (var i = 0; i < formData.length; i += 2) {
                    inds.push({
                        name: formData[i].value,
                        num: formData[i + 1].value
                    });
                }
                self.curVal.setIndInfo(inds);
            }

            console.dir(self.vars);
            self.render("inputDataPage", function() {
                self.curVal.drawPoints(self.curVal.getData());
            });
        });


        $("#app").on("keydown", ".data-val:last-child", function(evt) {

        	if(evt.which == 13) {
        		//alert("ASd");
        		var data = [];
        		$(".data-val").each(function() {
        			var val = $(this).val().trim();
        			if (val) data.push(parseFloat(val));
        		});

        		//if(data.length != self.curVal.numOfInd) return;
        		$(".data-val").each(function() {
        			$(this).val("");
        		});

                $(".value-input:first-child input").focus();
        		//console.log(data);
                self.curVal.drawPoint(data);

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
                console.dir(self.vars);
                return;
            }

            self.render("inputDataPage", function() {
                self.curVal.drawPoints(self.curVal.getData());
            });

        });

        $("#app").on("click", ".prev-chart", function(evt) {

            var prev = self.curVal.prev();
            if(!prev) {

                // self.cnt++;
                // self.curVal = self.vars[self.cnt];
                // self.render("inputIndPage");

                return;
            }

            self.render("inputDataPage", function() {
                self.curVal.drawPoints(self.curVal.getData());
            });

        });

        $("#side-nav ul").on("click", ".var-link", function(evt) {

            for(var i = 0; i < self.vars.length; i++) {
                if(self.vars[i].name == $(this).html()) {
                    self.curVal = self.vars[i];
                    self.cnt = i;
                    break;
                }
            }

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
        this.inds = [];
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
            this.cnt = 0;
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
        console.log(this.seq);
        var curDataList = Array.isArray(cur) ? "e"+cur[0]+"-"+cur[1] : "e"+cur;
        this.data[curDataList].push(data);
    },



    removePoint: function(data) {
        var cur = this.seq[this.cnt];
        var curDataList = Array.isArray(cur) ? "e"+cur[0]+"-"+cur[1] : "e"+cur;

        for(var i = 0; i < this.chart.series[0].data.length; i++) {
            console.log(data.x + " " + this.chart.series[0].data[i].x + " | " +  data.y + " " + this.chart.series[0].data[i].y);
            if(data.x === this.chart.series[0].data[i].x && data.y === this.chart.series[0].data[i].y) {
                this.chart.series[0].data[i].remove();
                this.data[curDataList].splice(i, 1);
            }
        }
    },

    drawPoint: function(data) {
        this.chart.series[0].addPoint(data);
    },

    drawPoints: function(data) {
        for(var i = 0; i < data.length; i++) {
            this.drawPoint(data[i]);
        }
    },

    getData: function() {
        var indArr = this.inds;
        var varName = this.name;
        var cnt = this.seq[this.cnt];
        var singleSuffix = !Array.isArray(cnt);
        return  singleSuffix ? this.data["e"+cnt] : this.data["e"+cnt[0]+"-"+cnt[1]];
    },


    setChart: function() {
        var self = this;
        $('#chart').highcharts({
            title: {
                text: 'Waterfowl Food Energy',
                x: -20 //center
            },
            xAxis: {
                title: {
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
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (e) {
                                $(".value-input:first-child input").val(this.x);
                                $(".value-input:nth-child(2) input").val(this.y);

                                self.removePoint(this);
                                $(".value-input:first-child input").focus();
                            }
                        }
                    },
                    marker: {
                        lineWidth: 1
                    }
                }
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
