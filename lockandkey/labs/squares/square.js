var window_height;
var window_width;

var paper;
var tilesholder;

//var colors = new Array("#1eb0b1", "#f3dbc7", "#f25526", "#ffc885", "#364d7f", "#862b32" , "#1c8f9e")
var colors = new Array("#4312AE","#472B83","#280671","#7446D7","#8E6DD7","#AA00A2","#7F207B","#6E0069","#D435CD","#D460CF","#1049A9","#29497F","#052C6E","#4479D4","#6A92D4","#FF9A00","#FF3500","#FF6840");

function generateTiles() {
        var rect_height = 10;
        var rect_width = 10;

        //x, y, width, height
        var clr = 0;
        var idx = 0;
        var tile_count = 0;
        for(var i=0;i<window.window_width;i+=12){
            for (var j=0;j<window.window_height;j+=12) {
                clr = Math.floor((Math.random()*17)+1);
                var tile = paper.rect(i,j,rect_width, rect_height);
                tile.attr("fill", colors[clr]);
                tile.attr("stroke-width",'0');
                tile.mouseover(function(){
                    var new_colr = Math.floor((Math.random()*17)+1);
                    this.stop().animate({fill: colors[new_colr] }, 100);
                    console.log(this)
                });
                tilesholder.push(tile);
                tile_count++;
            }
        }

};

function updateWindowSize() {
    window.window_height = $(window).height();
    window.window_width = $(window).width();

    window.paper = Raphael(0,0,window_width, window_height);
    window.tilesholder = paper.set();
}

$(window).ready(function(){
    updateWindowSize();
    generateTiles();
});

$(window).resize(function(){
    updateWindowSize();
    generateTiles();
    });

Raphael.el.update_tiles = function(){
    var new_colr = Math.floor((Math.random()*17)+1);
    this.stop().animate({fill: colors[new_colr] }, 100);
};

function updateColor() {
    var numoftiles = tilesholder.length;
    var rand_tile = Math.floor((Math.random()*(numoftiles-1)));
    tilesholder[rand_tile].update_tiles();
};

setInterval(function(){updateColor()},10);
