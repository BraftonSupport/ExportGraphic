(function () {
    document.addEventListener("DOMContentLoaded", function(){
        var canvas = document.getElementById('goat-canvas');
        var clear = document.getElementById('clear');
        var toggleCanvas = document.getElementById('toggle-canvas');
        var resetCan = document.getElementById('reset');
        var path = document.getElementsByTagName('path');
        var snapshot = document.getElementById('snapshot');
        var download = document.getElementById('download');
        var background = document.getElementById('background');
        var context = canvas.getContext('2d');
        var svg = document.getElementById('bkgrnd');
        var finish = document.getElementById('drawing');
        var posX = new Array();
        var posY = new Array();
        var posDrag = new Array();
        var saveColor = new Array();
        var engaged = false;
        var drawingColor = "rgba(0,200,0,1)";
        var colorChoices = document.getElementsByClassName('color');
        for(var c = 0; c < colorChoices.length; c++){
            colorChoices[c].addEventListener('click',function(){
                drawingColor = this.getAttribute('data-color');
            });
        }
        
        for (var i = 0; i < path.length; i++){
            path[i].addEventListener('click',function(){
                this.setAttribute('style', 'fill:' + drawingColor);
            });
        }
        resetCan.addEventListener('click', function(){
            resetCanvas();
        });
        // snapshot.addEventListener('click', function(){
        //     var s = new XMLSerializer().serializeToString(document.getElementById("bkgrnd"));
        //     var encodedData = window.btoa(s);
        //     var newSrc = 'data:image/jpg;base64,'+encodedData;
        //     var image = new Image();
        //     image.src = newSrc;
        //     var background = document.getElementById("bkgrnd");
        //     context.globalCompositeOperation='destination-over';
        //     context.drawImage(image,0,0);
        // });
        finish.addEventListener('click',function(){
            var finished = new Image();
	        finished.src = canvas.toDataURL("image/png");
            var serializer = new XMLSerializer();
            var source = serializer.serializeToString(svg);
            download.setAttribute('href', finished.src);
        });
        toggleCanvas.addEventListener('click',function(){
            console.log(window.navigator.userAgent);
            var s = new XMLSerializer().serializeToString(svg);
            var encodedData = window.btoa(s);
            var newSrc = 'data:image/svg+xml,'+encodedData;
            var img = new Image();
            img.onload = function() {
                context.drawImage(img, 100, 100,600,600);
            }
            img.src = "data:image/svg+xml;base64,"+encodedData;
            svg.style.display = 'none';
            // canvas.style.position = 'absolute';
            // canvas.style.left = '0px';
            canvas.addEventListener('mousedown', function(e){
                engaged = true;
                var mouseX = e.pageX-this.offsetLeft;
                var mouseY = e.pageY-this.offsetTop;
                recordPosition(mouseX, mouseY, false);
                drawLine();
            });
            // if(canvas.style.display=="block"){
            //     canvas.style.display = "none";
            // } else{
            //     canvas.style.display = "block";
            // }
        });
        clear.addEventListener('click',function(){
            clearValues();
        });
        
        canvas.addEventListener('mousemove',function(e){
            if(engaged){
                recordPosition(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
                drawLine();
            }
        });
        canvas.addEventListener('mouseup',function(){
            engaged = false;
        });
        canvas.addEventListener('mouseleave',function(){
            engaged = false;
        });
        function recordPosition(_x, _y, drag){
            posX.push(_x);
            posY.push(_y);
            posDrag.push(drag);
            saveColor.push(drawingColor);
        }
        function resetCanvas() {                    
            console.log('attempting reset');
            clearValues();
            for(var a = 0; a < path.length; a++){
                path[a].setAttribute('style','fill: rgba(0,0,0)');
            }
        }
        function clearValues(){
            posX = new Array();
            posY = new Array();
            posDrag = new Array();
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }
        function drawLine() {
            //context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context.lineJoin = "round";
            context.lineWidth = 6;
            for(var i=0; i < posX.length; i++) {
                context.beginPath();
                if(posDrag[i] && i){
                    context.moveTo(posX[i-1], posY[i-1]);
                }else{
                    context.moveTo(posX[i]-1, posY[i]);
                }
                context.lineTo(posX[i], posY[i]);
                context.closePath();
                context.strokeStyle = saveColor[i];
                context.stroke();   
            }
        }
    });
}());