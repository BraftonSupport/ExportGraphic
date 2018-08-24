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
        var svg = document.getElementById('Capa_1');
        var posX = new Array();
        var posY = new Array();
        var posDrag = new Array();
        var saveColor = new Array();
        var engaged = false;
        var drawingColor = "rgba(0,200,0,1)";
        var colorChoices = document.getElementsByClassName('color');
        var img = new Image();
        img.onload = function() {
            context.drawImage(img, 100, 100,400,400);
        }
        img.src = "goat.svg";
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
        snapshot.addEventListener('click', function(){
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            var serializer = new XMLSerializer();
            console.log(image.src); 
            //var source = serializer.serializeToString(svg);
            download.setAttribute('s rc', image.src);
            
            //console.log(source);
         });
         toggleCanvas.addEventListener('click',function(){
            if(canvas.style.display=="block"){
                canvas.style.display = "none";
            } else{
                canvas.style.display = "block";
            }
        });
        clear.addEventListener('click',function(){
            clearValues();
        });
        /*canvas.addEventListener('mousedown', function(e){
            engaged = true;
            console.log(e.pageX,this.offsetLeft);
            var mouseX = e.pageX-this.offsetLeft;
            var mouseY = e.pageY-this.offsetTop;
            recordPosition(mouseX, mouseY, false);
            drawLine();
        });*/
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
                try{
                    path[a].setAttribute('style','fill: rgba(0,0,0)');
                } catch { console.log('error'); }
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