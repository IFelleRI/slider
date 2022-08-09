class Slider{
    constructor(className,object) {
        this.sliderContainer = document.querySelector('.'+className).children[0];
        this.next = document.querySelector('.'+object.navigation.next);
        this.prev = document.querySelector('.'+object.navigation.prev);
        this.sliderItems = [...this.sliderContainer.children];
        this.countSlides = this.sliderItems.length;
        this.settings = object;
        this.SliderInit();
    }
    setSettingsValue(){
        this.viewCountSlide = this.settings.slide;
        if(typeof this.settings['offset'] !== "undefined"){
            this.offset = this.settings.offset;
        }else{
            this.offset = 'all';
        }

        if(typeof this.settings['margin'] !== "undefined"){
            this.marginSlider = this.settings.margin;
        }else{
            this.marginSlider = false;
        }

        if(typeof this.settings['width'] !== "undefined"){
            this.widthSlide = this.settings.width;
        }else {
            this.widthSlide = false;
        }

        if(typeof this.settings['loop'] !== "undefined"){
            this.loop = this.settings.loop;
        }else{
            this.loop = false;
        }

        if(typeof this.settings['viewOverflow'] !== "undefined"){
            this.viewOverflow = this.settings.viewOverflow;
        }else{
            this.viewOverflow = false;
        }

        if(typeof this.settings['breakPoints'] !== "undefined"){
            this.breakPoints = this.settings.breakPoints;
            this.setBreakPoints();
        }

    }
    setBreakPoints(){
        let thisObject = this;
        if(typeof this.settings['breakPoints'] !== "undefined" && Object.keys(this.breakPoints).length > 0){
            for (let item in this.breakPoints) {
                if( window.innerWidth >= item ){
                    this.viewCountSlide = thisObject.breakPoints[item].slide;
                    if(typeof thisObject.breakPoints[item]['margin'] !== "undefined"){
                        this.marginSlider = thisObject.breakPoints[item].margin;
                    }else{
                        this.marginSlider = this.settings.margin;
                    }
                }
            }
        }
    }
    loopInit(index = 0){
        let firstCloneElement = document.createElement('div');
        firstCloneElement.classList.add('slider-slide');
        firstCloneElement.innerHTML = this.sliderItems[this.sliderItems.length-1].innerHTML;
        this.sliderItems.unshift(firstCloneElement);
        this.sliderContainer.prepend(firstCloneElement);

        let lastCloneElement = document.createElement('div');
        lastCloneElement.classList.add('slider-slide');
        lastCloneElement.innerHTML = this.sliderItems[1].innerHTML;
        this.sliderItems.push(lastCloneElement);
        this.sliderContainer.append(lastCloneElement);
    }
    getSliderItemWidth(){
        if(this.viewCountSlide > 1){
            if(this.marginSlider && this.marginSlider > 0){
                if(this.viewOverflow){
                    if(this.widthSlide){
                        return this.widthSlide;
                    }else{
                        return this.sliderContainer.offsetWidth / this.viewCountSlide;
                    }
                }else{
                    return (this.sliderContainer.offsetWidth / this.viewCountSlide)-(this.marginSlider - this.marginSlider/this.viewCountSlide);
                }
            }else{
                return this.sliderContainer.offsetWidth / this.viewCountSlide;
            }
        }else{
            return this.sliderContainer.offsetWidth;
        }
    }
    getSliderPosition(){
        switch (this.offset) {
            case "all":
                if(this.marginSlider){
                    if(this.viewOverflow){
                        if(this.widthSlide){
                            return this.widthSlide + this.marginSlider;
                        }else{
                            return this.sliderContainer.offsetWidth - this.getSliderItemWidth() + (this.marginSlider * (this.viewCountSlide-1));
                        }
                    }else{
                        return this.sliderContainer.offsetWidth + this.marginSlider;
                    }
                }else{
                    return this.sliderContainer.offsetWidth;
                }
            case "one":
                if(this.marginSlider){
                    return this.getSliderItemWidth() + this.marginSlider;
                }else{
                    return this.getSliderItemWidth();
                }
        }
    }
    sliderItemsInit(){
        let thisObject = this;
        this.sliderItems.forEach(function (item,index){
            item.setAttribute('index',index);
            item.style.width = thisObject.getSliderItemWidth()+'px';
            if(thisObject.marginSlider){
                item.style.marginRight = thisObject.marginSlider+'px';
            }
        });
    }
    setActiveSlide(index=0){
        let currentSlide = this.sliderItems[index];
        this.sliderItems.forEach(function (item){
            item.classList.remove('active-slide');
            item.classList.remove('next-slide');
            item.classList.remove('prev-slide');
        })
        currentSlide.classList.add('active-slide');
        if(currentSlide.nextElementSibling){
            currentSlide.nextElementSibling.classList.add('next-slide');
        }
        if(currentSlide.previousElementSibling){
            currentSlide.previousElementSibling.classList.add('prev-slide');
        }
    }
    sliderNavigation(){
        let width = this.getSliderPosition();
        let loopPosition = this.getSliderPosition();
        let currentPosition = 0;
        let indexSlide = 0;
        const thisObject = this;
        if(this.loop){
            currentPosition = this.getSliderPosition();
            loopPosition  = this.getSliderPosition();
            this.sliderContainer.style.transform = 'translate3d(-'+ loopPosition  +'px, 0px, 0px)';
        }
        this.next.onclick = function () {
            if(indexSlide === thisObject.sliderItems.length - 2){
                currentPosition += +width;
                thisObject.sliderContainer.style.transitionDuration = '0s';
                thisObject.sliderContainer.style.transform = 'translate3d(-'+loopPosition+'px, 0px, 0px)';
                setTimeout(function (){
                    thisObject.sliderContainer.style.transitionDuration = '0.4s';
                    thisObject.sliderContainer.style.transform = 'translate3d(-'+loopPosition*2+'px, 0px, 0px)';
                },50)
                indexSlide = 1;
                currentPosition = loopPosition*2;
            }else{
                indexSlide++;
                currentPosition += +width;
                thisObject.sliderContainer.style.transitionDuration = '0.4s';
                thisObject.sliderContainer.style.transform = 'translate3d(-'+ currentPosition +'px, 0px, 0px)';
                thisObject.setActiveSlide(indexSlide)
            }
        };
        this.prev.onclick = function () {
            console.log()
            if(indexSlide === -1){
                currentPosition -= +width;
                thisObject.sliderContainer.style.transitionDuration = '0s';
                thisObject.sliderContainer.style.transform = 'translate3d(-'+loopPosition*(thisObject.sliderItems.length-2)+'px, 0px, 0px)';
                setTimeout(function (){
                    thisObject.sliderContainer.style.transitionDuration = '0.4s';
                    thisObject.sliderContainer.style.transform = 'translate3d(-'+loopPosition*(thisObject.sliderItems.length-3)+'px, 0px, 0px)';
                },50)
                indexSlide = thisObject.sliderItems.length-3;
                currentPosition = loopPosition*(thisObject.sliderItems.length-3);
            }else {
                indexSlide--;
                currentPosition -= +width;
                thisObject.sliderContainer.style.transitionDuration = '0.4s';
                thisObject.sliderContainer.style.transform = 'translate3d(-' + currentPosition + 'px, 0px, 0px)';
            }
        }
    }

    // Swipe slides start //
    setSwipeSlides() {
        let width = this.getSliderPosition();
        let loopPosition = this.getSliderPosition();
        let currentPosition = 0;
        let indexSlide = 0;
        const thisObject = this;

        let pressed = false;
        let x = 0;
        let y = 0;

        this.sliderContainer.onmousedown = function(e){
            pressed = true;
            x = e.clientX;
            y = e.clientY;
            this.style.cursor = 'grabbing';
        }
        window.onmouseleave = function(e){
            pressed = false;
        }
        this.sliderContainer.onmouseup = function(e){
            pressed = false;
            this.style.cursor = 'grab';
        }

        this.sliderContainer.onmousemove = function(e) { swipeSlides(e); };
        
        function swipeSlides(e){
            if (!pressed) {
                return;
            }
            if (!x || !y) {
                return false;
            }
            if(pressed){
                let x1 = e.clientX;
                let y1 = e.clientY;

                // let xMove = e.clientX;
                // let yMove = e.clientY;
                let xMove = x1 - x;
                let yMove = y1 - y;

                if (Math.abs(xMove) > Math.abs(yMove)) {
                    if (xMove > 0) {
                        if(indexSlide === -1){
                            currentPosition -= +width;
                            thisObject.sliderContainer.style.transitionDuration = '0s';
                            thisObject.sliderContainer.style.transform = 'translate3d(-'+loopPosition*(thisObject.sliderItems.length-2)+'px, 0px, 0px)';
                            setTimeout(function (){
                                thisObject.sliderContainer.style.transitionDuration = '0.4s';
                                thisObject.sliderContainer.style.transform = 'translate3d(-'+loopPosition*(thisObject.sliderItems.length-3)+'px, 0px, 0px)';
                            },50)
                            indexSlide = thisObject.sliderItems.length-3;
                            currentPosition = loopPosition*(thisObject.sliderItems.length-3);
                        }else {
                            indexSlide--;
                            currentPosition -= +width;
                            thisObject.sliderContainer.style.transitionDuration = '0.4s';
                            thisObject.sliderContainer.style.transform = 'translate3d(-' + currentPosition + 'px, 0px, 0px)';
                        }
                        pressed = false;
                    } else {
                        if(indexSlide === thisObject.sliderItems.length - 2){
                            currentPosition += +width;
                            thisObject.sliderContainer.style.transitionDuration = '0s';
                            thisObject.sliderContainer.style.transform = 'translate3d(-'+loopPosition+'px, 0px, 0px)';
                            setTimeout(function (){
                                thisObject.sliderContainer.style.transitionDuration = '0.4s';
                                thisObject.sliderContainer.style.transform = 'translate3d(-'+loopPosition*2+'px, 0px, 0px)';
                            },50)
                            indexSlide = 1;
                            currentPosition = loopPosition*2;
                        }else{
                            indexSlide++;
                            currentPosition += +width;
                            thisObject.sliderContainer.style.transitionDuration = '0.4s';
                            thisObject.sliderContainer.style.transform = 'translate3d(-'+ currentPosition +'px, 0px, 0px)';
                            thisObject.setActiveSlide(indexSlide)
                        }
                        pressed = false; 
                    }
                } else {
                    // координаты для Y //   
                }
            }
        };
    }
    // Swipe slides end //  

    SliderInit(){
        this.sliderContainer.classList.add('slider-init');
        this.setSettingsValue();
        this.setBreakPoints();
        if(this.loop){
            this.loopInit();
        }
        this.sliderItemsInit();
        this.setActiveSlide();
        this.setSwipeSlides();
        this.sliderNavigation();
    }
}
let slider = new Slider('main-slider-first',{
    slide:1,
    margin:20,
    loop:true,
    touch:true,
    offset:'all',
    navigation:{
        'next':'slider-btn-next',
        'prev':'slider-btn-prev'
    }
});
/*
    slide:1,
    margin:20,
    loop:true,
    touch:true,
    offset:'all',
    viewOverflow:false,
    width:250,
    breakPoints
    navigation
*/