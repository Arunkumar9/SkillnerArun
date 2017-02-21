
//special thanks...for the graphics and orginal idea from Ext 1x control (Ext.ux.carousel)..http://www.devclarity.com/blog
//however...completely reengineered by Jerry Brown


Ext.namespace('Ext.ux');

Ext.ux.Carousel = function(config){
    Ext.ux.Carousel.superclass.constructor.call(this, config);
    
    Ext.apply(this, config);
        
};

Ext.extend(Ext.ux.Carousel, Ext.Component, {

	baseCls : 'x-carousel',

    setSize : Ext.emptyFn,
    setWidth : Ext.emptyFn,
    setHeight : Ext.emptyFn,
    setPosition : Ext.emptyFn,
    setPagePosition : Ext.emptyFn,

    initComponent : function(){
        Ext.ux.Carousel.superclass.initComponent.call(this);

	    this.addEvents({'selected' : true});
        if (typeof(this.imageGap)=='undefined') { this.imageGap = 5 }
        if (!this.noPreload) {
        	this.preload.defer(1,this);
        }
        
    },
            
    preload: function(){
        var preload = Ext.get(document.body).createChild({tag:"div", style:"display:none"});
        
        Ext.each(this.images, function(image){
            if (typeof(image)=='string'){
            	image={src:image}
            }

            if (image.src){
                preload.createChild({tag:"img", src:image.src});
            }
            if (image.fullSrc){
                preload.createChild({tag:"img", src:image.fullSrc});
            }
        }, this);
    },

    onRender : function(ct, position){


        var tpl = new Ext.Template(
            '<div class="{cls}-wrap">',
                '<div class="{cls}-inner">',
	                '<div class="{cls}-images-wrap">',
	                    '<div class="{cls}-images"></div>',
	                '</div>',
	            '</div>',
            '</div>'
        );

        if(position){
            this.el = tpl.insertBefore(position, {cls: this.baseCls}, true);
        }else{
            this.el = tpl.append(ct, {cls: this.baseCls}, true);
        }
        if(this.id){
            this.el.dom.id = this.id;
        }
        
        var inner= Ext.get(this.el.dom.firstChild);
        var imagesWrap = Ext.get(inner.dom.firstChild);
        this.divImages = Ext.get(imagesWrap.dom.firstChild);

		inner.setStyle({
			height:(this.imageHeight + (2*this.wrapMarginY)) + 'px',
			width:this.width+'px'
		});
		
		var totalImageWidth=this.imageWidth+this.imageGap;
		var usableWidth=this.width-(this.wrapMarginX*2);
		var maxPicsOnce=Math.floor(usableWidth/totalImageWidth);
		var usedWidth=maxPicsOnce*totalImageWidth-this.imageGap;
		var offsetLeft=Math.floor((usableWidth-usedWidth)/2);
		this.pageSize=usedWidth+this.imageGap;
		this.maxPages=Math.round(this.images.length/maxPicsOnce+.04999);
		this.curPage=0;

		if (!Ext.isIE){
			offsetLeft+=this.wrapMarginX;
		}
		
		imagesWrap.setStyle({
			position: 'absolute',
			clip:'rect(0,'+(usedWidth*1)+','+(this.imageHeight)+',0)',
			'margin-top':this.wrapMarginY+'px',
			width:this.width+'px',
			height:this.imageHeight+'px',
			'margin-left':offsetLeft+'px'
		});

		this.divImages.setStyle({
			position: 'absolute'
		});		

        Ext.each(this.images, function(image){            

            if (typeof(image)=='string'){
            	image={src:image}
            }

            thisImage = this.divImages.createChild({tag:"img", src:image.src, style:{
            	'margin-right': this.imageGap+'px',
            	width:  this.imageWidth+'px',
            	height: this.imageHeight+'px'            	
            }});
            
            thisImage.on("click", function(e, ele){
            	if (!image.onSelected || !(image.onSelected.call(this, image, e, ele )===false)){
	                this.fireEvent('selected', this, image, e, ele);                
	            }
            },this);
        },this);

        
        var styleArrows={};
		if (!this.dontResizeArrows){
			styleArrows.height=(this.imageHeight+(2*this.wrapMarginY)) + 'px';	
		}

		
        var divLeftButton   = inner.createChild({tag:"div", cls:this.baseCls + '-handle-right', style:styleArrows});
        divLeftButton.on("mousedown", function(){
			this.shiftImages('right');			
        },this);

    	var divRightButton  = inner.createChild({tag:"div", cls:this.baseCls + '-handle-left', style:styleArrows});
        divRightButton.on("mousedown", function(){
			this.shiftImages('left');
        },this);
	        
        
     },

    shiftImages: function(direction){

		if (!this.curPage){
			this.offsetLeft=this.divImages.getLeft();
		}
		var newPage=(direction=='right' ? this.curPage+1 : this.curPage-1 );
		if (newPage<0 || newPage >= this.maxPages){
			return;
		}
		this.curPage=newPage;
		var newLocation=(this.pageSize*this.curPage)*-1+this.offsetLeft;
		this.divImages.shift({ x:newLocation, duration: this.duration || .7 });

    }
});

Ext.reg('carousel', Ext.ux.Carousel);
