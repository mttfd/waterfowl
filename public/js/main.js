$(function() {
    var metadata = localStorage.getItem('');

    if(!metadata) {
        var controller = new Controller();
        controller.init(metadata);

    }
});
