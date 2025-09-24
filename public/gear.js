/**
 * Easy Ajax 
 */
function ajax(url, callback){
    var xhr;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200){
            callback(xhr.responseText);
        }
    }
    xhr.open("GET", url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
}

/**
 * Dinamyc Scripts 
 */
function script(src,callback){
    return scripts([src]);
}
function scripts(sources,callback){
    var loader = function(src,handler){
        var script = document.createElement("script");
        script.src = src;
        script.onload = script.onreadystatechange = function(){
            script.onreadystatechange = script.onload = null;
            handler();
        }
        var head = document.getElementsByTagName("head")[0];
        (head || document.body).appendChild( script );
    };
    (function run(){
        if(sources.length!=0){
            loader(sources.shift(), run);
        }else{
            callback && callback();
        }
    })();
}

window.addEventListener('load', function(event) {

});

document.addEventListener('DOMContentLoaded', function(event) {
    
});

document.addEventListener('readystatechange', function(event) {

});

/*
 ** @root-variables: return BootStrap breakpoints variables
 *  [JS] => alert(media.md);   ···   [CSS] => var(--primary);
 */
var media = {
    xs: getComputedStyle(document.body).getPropertyValue('--breakpoint-xs'),
    sm: getComputedStyle(document.body).getPropertyValue('--breakpoint-sm'),
    md: getComputedStyle(document.body).getPropertyValue('--breakpoint-md'),
    lg: getComputedStyle(document.body).getPropertyValue('--breakpoint-lg'),
    xl: getComputedStyle(document.body).getPropertyValue('--breakpoint-xl'),
   xxl: getComputedStyle(document.body).getPropertyValue('--breakpoint-xxl')
};

var queries = {
    xs: '(max-width: ' + parseInt(media.sm.replace('px', '') - 1) + 'px' + ')',
    sm: '(min-width: ' + media.sm + ') and (max-width: ' + parseInt(media.md.replace('px', '') - 1) + 'px' + ')',
    md: '(min-width: ' + media.md + ') and (max-width: ' + parseInt(media.lg.replace('px', '') - 1) + 'px' + ')',
    lg: '(min-width: ' + media.lg + ') and (max-width: ' + parseInt(media.xl.replace('px', '') - 1) + 'px' + ')',
    xl: '(min-width: ' + media.xl + ') and (max-width: ' + parseInt(media.xxl.replace('px', '') - 1) + 'px' + ')',
   xxl: '(min-width: ' + media.xxl + ')'
};

/* media queries via JS
 * <div class="py-5 medias" data-css="{'xs': 'text-bg-primary', 'lg': 'text-bg-secondary', 'xl': 'text-bg-light text-danger', 'xxl': 'text-bg-light'}">
 */
var cssMedias = function () {
    let medias = document.querySelectorAll('.medias');
    
    if( medias.length === 0 ) { return false; }
    
    medias.forEach((media) => {

        if ( !("css" in media.dataset)) { return false; } 

        var css = media.dataset.css;
        css = JSON.stringify(css.replace(/'/g, '"')).replace(/\\/g, '');
        css = css.substring(1, css.length - 1);
        var css = JSON.parse(css);
        let classes;
        for (var bp in queries)
        {
            if (css[bp] !== undefined && window.matchMedia(queries[bp]).matches)
            {
                classes = css[bp].split(' ');
                classes.forEach( el => {
                    media.classList.add(el);
                });
                return true; // Return INTERVAL Changed
            } else if (css[bp] !== undefined)
            {
//                media.setAttribute('style', ''); // Hard Reset Styles
                classes = css[bp].split(' ');
                classes.forEach( el => {
                    media.classList.remove(el);
                });
            }
        }
    });
};

/*
 ** Helper: Get true if breakpoint applies
 * if (minMedias('md')) //...
 */
var minMedias = function (breakpoint) {
    if (document.body.clientWidth >= parseInt(media[breakpoint].replace('px', '')))
        return true;
    return false;
};

/*
 ** Helper: Get true if breakpoint applies
 * if (maxMedias('md')) //...
 */
var maxMedias = function (breakpoint) {
    if (document.body.clientWidth < parseInt(media[breakpoint].replace('px', '')))
        return true;
    return false;
};

/*
 * Make an ajax call
 * USE:
 * - var ajax = ajax('someurl', 'get',  function(obj) { alert(obj.responseText); })
 */
 var makeAjax = function(url, method, callback, params = null) {
    var obj;
    try {   
        obj = new XMLHttpRequest();  
    } catch(e){   
        console.log("Your browser does not support Ajax.");       
        return false;       
    }
    obj.onreadystatechange = function() {
        if(obj.readyState == 4 && obj.status == 200) {
           callback(obj);
        } 
    }
    obj.open(method, url, true);
    obj.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    obj.send(params);
    return obj; 
 };

/*
 * Wait untill an elemet is append and exist in DOM
 * https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
 * USE:
 * - waitForElm('.some-class').then((elm) => { console.log(elm.textContent); });
 * - const elm = await waitForElm('.some-class');
 */
var waitForElm = function(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
};



/*
 ** Progress Bar on scroll window contents
 * <div id="progress" class="progress">
 *      <div class="progress-bar bg-custom" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="Barra de progreso de lectura"></div>
 * </div>
 */
var progress = function () {

    var getPercent = function () {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;  
        return ((winScroll / height) * 100) + '%';
    };

    // Browser supports progress element
//    var progress = $('#progress.progress > div, #progress.scroller[data-scrolled=progress] > div');
    var progress = document.querySelector('#progress.progress > div, #progress.scroller[data-scrolled=progress] > div');
    
    if(progress == null) { return; }
    
    document.addEventListener('scroll', () => {
        progress.style.width =  getPercent();
    });

    window.addEventListener('resize', () => {
        progress.style.width =  getPercent();
    });

    if (getPercent() == '0%') { 
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" }); 
    }
};

/*
 ** Counter: animation that increments numbers with Intersection Observer
 *  <span class="counter" data-count="500,5" data-step="43" data-timer="2500">500</span><sub>%</sub>
 * - innerHTML  => number end counter
 * - data-count => Text o Number showed at end of counter
 * - data-step  =>  Number sum in each loop. Default 27.
 * - data-timer =>  Time of the whole animation. Default 1500
 */
var counter = function () {
    let counters = document.querySelectorAll('.counter');
    
    var counter_js = function(el, number, end, delay, step){
        el.innerHTML = number.toString();
        number = number + parseInt(end/step);
        if ( number < end ) {
            setTimeout(function(){
                counter_js(el, number, end, delay, step);
            }, delay);    
       } else {
           el.innerHTML = el.dataset.count;
       }
    };
    
    counters.forEach( (el) => {
        
        let options = { rootMargin: '0px', threshold: '0' };
        
        let observerReach = new IntersectionObserver((items, observer) => {
            items.forEach(item => {
                let timer = 1500;
                let end = parseInt(el.innerHTML) + 1;
                let delay;
                let step = 27;
                
                if ("timer" in el.dataset){
                    timer = el.dataset.timer;
                } else {
                    el.setAttribute('data-timer', timer);
                }
                if ("step" in el.dataset){
                    step = el.dataset.step;
                }
                
                delay = parseInt(timer/step);
                
                if ( item.isIntersecting ){
                    counter_js(item.target, 1, end, delay, step);
                    //Liberamos memoria
                    observer.unobserve(item.target);
                }
            });
        }, options);
        observerReach.observe(el);
        el.classList.remove('counter'); //Due to reach callback function
        
    });
    
};


/*
 ** Writter: animation for type writter effect on text words
 * <p class="writter text-info" data-timer="1200">
 *    <span class="type">TIC</span><span class="type">SEO</span><span class="type">SEM</span>
 * </p>
 */
var TypeWritter = function (object, type, times) // callback effect
{
    this.dom = object;
    this.word = type;
    this.loops = 0;
    this.timer = parseInt((times / type.length), 10) || 1000;
    this.times = parseInt(times, 10) || 1000;
    this.display = '';
    this.untick = false;
    this.tick();
};
TypeWritter.prototype.tick = function () {
    var i = this.loops % this.word.length;
    var phrase = this.word[i];

    if (this.untick)
        this.display = phrase.substring(0, this.display.length - 1);
    else
        this.display = phrase.substring(0, this.display.length + 1);

    var delta = this.times - Math.random(10) * 100;

    this.dom.textContent = this.display;
    var that = this;

    if (this.untick)
    {
        delta /= 3;
    }

    if (!this.untick && this.display === phrase)
    {
        delta = this.timer*10;
        this.untick = true;
    } else if (this.untick && this.display === '')
    {
        this.display = ' '; // fix empty
        this.untick = false;
        this.loops++;
        delta = this.times / 2;
    }

    var tw = setTimeout(function () {
        that.tick();
    }, delta);
};
// Init writter effect
var writter = function () {
    let writters = document.querySelectorAll('.writter');

    writters.forEach( (el, i) => {
        let timer = 300;
        let n = 0;
        let children = el.querySelectorAll('.type');
        let words;
        
        if ("timer" in el.dataset){
            timer = el.dataset.timer;
        } else {
            el.setAttribute('data-timer', timer);
        }
        
        el.setAttribute('words', '');
        el.innerHTML ='<span class="writting"></span>';
        
        children.forEach( (it) => {
            it.classList.add('d-none');
            el.setAttribute('words', el.getAttribute('words') + '|' + it.innerHTML);
        });
        
        words = el.getAttribute('words').split("|");
        
        var writting = el.querySelector('.writting');
        el.classList.remove('writter'); //Due to reach callback function
        
        return new TypeWritter(writting, words, timer); // type-writter
        
    });
    
};

/*
 ** Ganchor links: on click 'ganchor' link, go to anchor with scroll animation
 * <a class="ganchor"data-scroll="50" title="Contactar por Email" href="/#form">···</a>
 * - data-scroll="50" el margen superior que deja al hacer el scroll como por ejemplo el header fijo
 */
function ganchor() {
    let ganchors = document.querySelectorAll('.ganchor');
    var header = document.getElementById('header');
    
    ganchors.forEach( (el) => {
        el.addEventListener('click', (e) => {
            
            e.preventDefault();
            
            if (el.parentNode.getAttribute('id') === 'goto') 
            { 
                return window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }

            var scroll = 0;
            var offset = 0;
            var anchor = el.getAttribute('href');
            var ganchor = document.querySelector(anchor.replace('/', ''));

            if (ganchor === null)
            {
                return  window.location = anchor; 
            }
            
            var position = ganchor.getBoundingClientRect();
            
            if (el.dataset.scroll !== undefined)
            {
                scroll = parseInt(el.dataset.scroll);
            }

            if (header !== null)
            {
                if (header.classList.contains('sticky-top')) 
                {
                    offset = header.clientHeight + 1;
                }
                else if (header.classList.contains('fixed-top')) 
                {
                    offset = header.clientHeight + 1;
                }
            }
            
            let delay = 0;
            
            if (el.dataset.delay  !== undefined) // ms
            {
                delay = parseInt(el.dataset.delay);
            }
            
            setTimeout(() => {  
                
                return window.scrollTo({ behavior: "smooth", top: position.top + window.scrollY - offset - scroll, left: 0 });
            
            }, delay);
            
        });
    });
};

/*
 ** Scroller Detection Effect: Set class to element or call a function at user window.scroll event
 * data-scroll: 100 => Launch the event at 100px user scroll
 * <header class="scroller sticky-top | fixed-top" data-scrolled="active" data-scroll="200">···</header>
 * <div id="goto" class="position-fixed scroller" data-scroll="500" data-call="bienvenida">
 * ###todo: remove event listener. Pero necesitamos que no sea una funcion anónima en el Event Listener
 */
var scroll = window.scrollY;
var scrolled = true;
var scrolling = 'DOWN';
var scrollToggler = function (item, offset, style, change, status){
    
    if ( change && status == 'DOWN' && window.scrollY >= (item.offsetHeight + offset))
    {   
        item.classList.add(style);
        
        return true;
    }
    else if ( change && status == 'UP' && window.scrollY < (item.offsetHeight + offset))
    {
        item.classList.remove(style);
        
        return false;
    }
    
    return null;
};
var scroller = function (e) {
    
    let items = document.querySelectorAll('.scroller');
    
    if (items.length == 0 ) { return; }
    
    items.forEach(item => {
        
        var style  = 'active';
        var offset = 0;
        
        if ("scrolled" in item.dataset) style  = item.dataset.scrolled.toString();
        
        if ("scroll" in item.dataset)   offset = parseInt(item.dataset.scroll);
        
        let cb = scrollToggler(item, offset, style, scrolled, scrolling);

        document.addEventListener("scroll", function(e) {
            
            scrolled = true;
            
            if ( window.scrollY >= scroll)
            {
                if (scrolling == '' || scrolling == 'UP') scrolled  = true;
                
                scrolling = 'DOWN';
            }
            else if (window.scrollY < scroll)
            {                
                if (scrolling == '' || scrolling == 'DOWN')  scrolled  = true;
                
                scrolling = 'UP';
            }
            
            scroll = window.scrollY;
            
            cb = scrollToggler(item, offset, style, scrolled, scrolling);
            
            if ("call" in item.dataset)
            {
                if (item.getAttribute('data-callback'))
                {
                    window[item.dataset.call](cb); // callback to specific function
                }
                else
                {
                    item.setAttribute('data-callback', cb);
                }
            }
        
        }.bind(null, item, offset, style, scrolled, scrolling)); 
    });
};

/*
 ** Links Extension (overlay location) -- Requires CSS .link-out > .link-in
 * <div class="card card-body link-out">
 *   <img class="img-fluid" src="/media/portada/cubiertas.png" alt="INSIDE IMAGE LINK"/>
 *   <a class="link-in" href="/catalogo/tejados-cubiertas/" title="INVISIBLE LINK">NO VISIBLE LINK</a>
 * </div>
 */
var linkInOut = function () {
    let outs = document.querySelectorAll('.link-out');
    
    outs.forEach( (out) => {
        let ins = out.querySelector('.link-in');
        let target = '_blank';
        
        if (ins == null) { return; }
        if (ins.getAttribute('target') !== null) { target = ins.getAttribute('target'); }
        
        out.setAttribute('title', ins.getAttribute('title'));
        out.setAttribute('data-link', ins.getAttribute('href'));
        out.setAttribute('data-target', target );
        
        out.addEventListener('click', (el) => {
            window.open(out.getAttribute('data-link'), target);
        });
        
    });
};


/*
 ** Picture Parent All AutoHeight -- blur flip swap
 *  #FIX slots.css CSS
 */
var picAutoHeight = function (resize) {
    document.querySelectorAll('.pic-blur > .blur>*, .pic-flip > .flip>*').forEach( el => {
        
        var auto = el.clientHeight;
        var pic = el.parentElement.parentElement;
        if (auto > el.parentElement.parentElement.clientHeight)
        {
            var borders = el.style.borderWidth.replace('px', '') * 2;
            
            pic.style.height = (auto + borders) + 'px';
        }
    });
};

/*
 ** Picture Swap -- AutoTransform
 *  #FIX slots.css CSS
 */
var picSwap = function () {
    document.querySelectorAll('.pic-swap > .swap > *:first-child').forEach( el => {

        var auto = el.clientHeight;
        var pic = el.parentElement.parentElement;
        
        pic.style.height = auto + 'px';
        
        
    });
};

/*
 ** Picture Reflection -- effect
 *  #FIX slots.css CSS
 */
var picReflection = function () {
    document.querySelectorAll('.pic-reflection').forEach(el => {
        var s = 1.25;
        var auto = el.querySelector('[src]').clientHeight;
        var source = el.querySelector('[src]').getAttribute('src');
        var reflex = el.querySelector('[class^=reflection]');
        el.style.height = (auto * s) + 'px';
        el.style.marginBottom = (auto * 0.3) + 'px';
        reflex.style.height = (auto * s) + 'px';
        reflex.style.backgroundImage = "url(" + source + ")";
    });
};

/*
 ** Background HTML Images (requires CSS)
 * <div class="bg-image-top bg-image-alt" style="height: 30vh">
 *      <img class="d-none" src="/image/photo-alt.svg" title="BACKGROUND IMAGE" />
 * </div>
 */
var imgBackground = function () {

    document.querySelectorAll('.bg-image-bgs > img, .bg-image-fix > img, .bg-image-alt > img, .bg-image > img, .bg-image-top > img, .bg-image-center > img, .bg-image-bottom > img').forEach( el => {

        var img = el;
        var box = el.parentElement;
        
        img.style.display = 'none !important';
        
        box.style.backgroundImage = 'url(' + img.getAttribute('src') + ')';
        
    });
};


/*
 ** Extend Bootstrap modal: generate "Modal Box" layer view with auto content
 *  References: https://getbootstrap.com/docs/4.0/components/modal/
 *  <div type="button" class="modal-box" 
 *      data-title="Intro con Youtube VIDEO"
 *      data-content="https://www.youtube-nocookie.com/embed/OT9HsNszYCI?controls=0&amp;start=2" 
 *      data-legend="Bienvenidos a este nuevo video del canal de Youtube" 
 *      data-ratio="16x9" 
 *      data-size="modal-lg"
 *      data-class="youtube">
 *    <img class="vh-15" src="/image/default/icon.svg" alt="Logo Video" />
 *  </div>
 */
var bsModalBox = function () {
    
    document.querySelectorAll('.modal-box').forEach( (el) => {

        var only    = el.dataset.only;
        
        var title   = el.dataset.title;
        var content = el.dataset.content;
        var legend  = el.dataset.legend;
        
        var ratio   = el.dataset.ratio;
        var size    = el.dataset.size;
        var style   = el.dataset.style;
        
        var target  = el.dataset.target;
        var ajax    = el.dataset.ajax;
        
        
        var sid = '#box' + Math.random().toString(16).substr(2, 3);
        
        const newDiv = document.createElement('div');
        newDiv.classList.add('dynamic');

        if (typeof only === typeof undefined || only === false) {
            only = false;
        }
        if (typeof size === typeof undefined || size === false) {
            size = '';
        }
        if (typeof ajax === typeof undefined || ajax === false) {
            ajax = false;
        }
        if (typeof ratio === typeof undefined || ratio === false) {
            ratio = '16x9';
        }
        if (typeof target === typeof undefined || target === false) {
            target = sid;
        }
        if (typeof title === typeof undefined || title === false) {
            title = '';
        }
        if (typeof legend === typeof undefined || legend === false) {
            legend = '';
        }
        if (typeof style === typeof undefined || style === false) {
            style = '';
        }
        
        sid = target;

        if (typeof content === typeof undefined || content === false)
        {
            content = el.getAttribute('href'); // data-content is href link
        }

        if (typeof content === typeof undefined || content === false)
        {
            console.log('Undefined href/data-content of modal data-bs-target attribute!');
            return false;
        }
        
        var ext = content.split('.').pop();
        if (content.indexOf('youtube') > -1)
        {
            ext = 'youtube';
        }

        target = target.replace('#', '');
        
        if (typeof el.dataset.bsToggle === typeof undefined || el.dataset.bsToggle === false)
        {
            el.setAttribute('data-bs-toggle', 'modal');
            el.setAttribute('data-bs-target', sid);
        }

        var html = '';
        
        switch (ext) {
            case 'svg':
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                html = '<img src="' + content + '" class="img-fluid ' + style + ' d-block mx-auto" />';
                style = '';
                break;
            case 'pdf':
                html = '<iframe src="' + content + '" class="w-100 ' + style + '" style="min-height: 75vh;"></iframe>';
                style = '';
                break;
            case 'youtube':
                html = '<div class="ratio ratio-' + ratio + '">' +
                        '<iframe class="' + style + '" src="' + content + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
                       '</div>';
                style = '';
                
                // Add / Remove src of iframe due to video still play if modal is closed 
                document.addEventListener('hidden.bs.modal', (e) => {
                    if(e.target.getAttribute('id') == target) {
                        e.target.querySelector('iframe').removeAttribute("src");
                    }
                }, false);
                document.addEventListener('show.bs.modal', (e) => {
                    if(e.target.getAttribute('id') == target) {
                        e.target.querySelector('iframe').setAttribute("src", content);
                    }
                }, false);
                break;
            default:
            {
                if (content === ext)
                {
                    ajax = true;
                }
                else
                {
                    console.log('ModalBox -- Check extension of data-content attribute!');
                    
                    return false;
                }
            }
        }

        
        if (!size.length)
            size = 'modal-lg';

        if (legend.length)
            legend = '<div class="modal-footer d-block text-center pt-2 pb-3">' + legend + '</div>';

        
        if (only)
        {
          var modal =
            '<div class="modal fade" id="' + target + '" tabindex="-1" role="dialog" aria-labelledby="' + target + 'Title" aria-hidden="true">' +
              '<div class="modal-dialog modal-dialog-centered ' + size + '" role="document"><!-- modal-sm modal-xl modal-lg /--> ' +
                '<div class="modal-content '+style+'">' + html + '</div>' +
              '</div>' +
            '</div>';
        }
        else
        {
          var modal =
            '<div class="modal fade" id="' + target + '" tabindex="-1" role="dialog" aria-labelledby="' + target + 'Title" aria-hidden="true">' +
            '<div class="modal-dialog modal-dialog-centered ' + size + '" role="document"><!-- modal-sm modal-xl modal-lg /--> ' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<div class="modal-title" id="' + target + 'Title">' + title + '</div>' +
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
            '</div>' +
            '<div class="modal-body '+style+'">' + html + '</div>' +
            legend +
            '</div>' +
            '</div>' +
            '</div>';
        }
        newDiv.innerHTML = modal;
        document.body.append(newDiv);
        
        if (ajax)
        {
            html = '';
            el.addEventListener('click', (e) => {
                
                makeAjax(content, 'get',  function(obj) { 
                    var data = obj.responseText;
                    if (only)
                    {
                        data = '<div class="modal-header border-0 position-absolute top-0 end-0 z-index-1 rounded p-1 m-1">' + 
                                '<button type="button" class="btn-close btn-lg m-0 p-0" data-bs-dismiss="modal" aria-label="Close"></button>' +
                           '</div>' + obj.responseText;
                    }
                    waitForElm(sid).then( (elm) => { 
                        if (document.querySelector(sid + ' .modal-dialog').classList.contains('modal-size'))
                        {
                            if (data.length > 1200)
                                document.querySelector(sid + ' .modal-dialog').classList.add('modal-xl');
                            else if (data.length > 900)
                                document.querySelector(sid + ' .modal-dialog').classList.add('modal-lg');
                            else if (data.length < 400)
                                document.querySelector(sid + ' .modal-dialog').classList.add('modal-sm');

                            document.querySelector(sid + ' .modal-dialog').classList.remove('modal-size');
                        }
                        document.querySelector(sid).querySelector('.modal-body').innerHTML = data;
                    });
                });
                
            });
        }
        
        return true;
    });
};

/*
 ** Active Boostrap Toggle Popover -- Requires BS data-bs-toggle="popover"
 */
var bsTogglePopover = function () {
    var popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    popovers.forEach(function(popover){
        if (popover.hasAttribute('data-bs-target') && !popover.hasAttribute('data-bs-content'))
        {
            var target = popover.getAttribute('data-bs-target');
            var content = document.querySelectorAll(target)[0].innerHTML;
            
            if (content.length)
            {
                popover.setAttribute('data-bs-html', 'true');
                popover.setAttribute('data-bs-content', content);
            }
        }
    });
    
    var popoverTriggerList = [].slice.call(popovers);
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
};

/*
 ** Active Boostrap Toggle Tooltip -- Requires BS data-bs-toggle="tooltip"
 */
var bsToggleTooltip = function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
};

/*
 ** Sidetab slot on mobile is a select-option this script simulates the select-option
 *  click with the tabs normal behabiour 
 */
var sideTabs = function () {

    document.querySelectorAll('.sidetab').forEach(function (el) {
        
        var select = el.querySelector('.change-nav');
        var element = el.querySelector('.tab-content .active');
        var sidetabActive = [].indexOf.call(element.parentElement.children, element);
        
        select[sidetabActive].selected = true;
        
        el.querySelector('.change-nav').addEventListener('change', (e) => {
            var changeIndex = e.target.selectedIndex + 1;
            e.target.closest('.sidetab').querySelector('.change-tab .nav-item:nth-child(' + changeIndex + ') .nav-link').click();
        });
    });

};

/*
 ** Sidebar slot is a list-group but on mobile is a select-option. 
 *  Make click navigation on select-option change 
 */
var sideBars = function () {

    document.querySelectorAll('.nav-sidebar').forEach((el) => {
        el.querySelector('.change-nav').addEventListener('change', (e) => {
            window.open(e.target.value, '_self');
        });
    });

};


/*
 ** Scroll spy BS standar behaviour. Supossed only one scrollspy
 * <div data-bs-target="#simple-list-example" data-bs-spy="scroll" class="scrollspy vh-50 overflow-auto" tabindex="0" >
 */
var scrollspy = function () {
    var items = document.querySelectorAll('.scrollspy');
    items.forEach(el => {
        if(! ("bsSpy" in el.dataset)) { 
            el.dataset.bsSpy = 'scroll'; 
        }
        var scrollSpy =  new bootstrap.ScrollSpy(document.body, {
           target: el.getAttribute('data-bs-target')
        });
    });
};

/*
 ** On click hide element that has been clicked and a target id if set
 */
var closeClick = function () {
    
    document.querySelectorAll('.close-click').forEach( (el) => {
        el.addEventListener('click', (e) => {
            if (("target" in e.target.dataset)){
                var element = e.target.closest('#'+e.target.dataset.target);
                element.classList.add("d-none");
            }
            e.target.classList.add("d-none");
        });

    });

};


/*
 * Envio de formulario de tipo whatsapp. Recoge todos los campos del form
 */
var whatssappForm = function(){
    let forms = document.getElementsByClassName("form-whatsapp");
    
    //Recorremos todos los posibles formularios
    for(let i = 0; i < forms.length; i++) 
    {
        let form = forms[i].getElementsByTagName("form");
        if (form.length > 0)
        {
            form[0].querySelector('[type="submit"]').addEventListener('click', function(e){
                e.preventDefault();
                let resetForm = this.closest('form');
                let url = this.getAttribute('href');
                let inputs = resetForm.elements;
                let message = '';
                for (let z = 0; z < inputs.length; z++)
                {
                    let prefix = ''; let suffix = '';
                    // console.log(inputs[z].nodeName + ' / ' + inputs[z].type + ' / '+ inputs[z].value);
                    // [INPUT / number / 3] - [TEXTAREA / textarea / hola me gustaria....] - [SELECT / select-one / 2]
                    if (inputs[z].type !== 'submit')
                    {
                        if (("prefix" in inputs[z].dataset)) { message += inputs[z].dataset.prefix + ' '; }
                        if (inputs[z].type !== 'date')
                        {
                            message += inputs[z].value + ' ';
                        } else {  // Las fechas del input type="date" las recoge como 2022-12-25 las cambiamos a 25/12/2022
                            message += inputs[z].value.split('-').reverse().join('/') + ' ';
                        }
                        
                        if (("suffix" in inputs[z].dataset)) { message += inputs[z].dataset.suffix + ' '; }
                    }
                }
                window.open(url+encodeURI(message), '_blank').focus();
                resetForm.reset();
            });
        }
    }
    
};



/*
** WEAR -- Shiny Hover Effect --> .wear { color, background-color }
** https://codepen.io/Shackles/pen/zYKXGez
*/
var wear = function () {
    var wears = document.querySelectorAll('.wear');

    wears.forEach(function (wear, i) {
        var fx = document.createElement('div');
        
        fx.classList.add('wear-flash-ligth');
        wear.appendChild(fx);
        wear = fx;

        wear.addEventListener("mousemove", (e) => {
            const rect = wear.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / wear.clientWidth) * 100;
            const y = ((e.clientY - rect.top) / wear.clientHeight) * 100;
            
            wear.style.background = 'radial-gradient( circle closest-corner at '+x+'% '+y+'%, '+window.getComputedStyle(wear.parentNode).color+', '+window.getComputedStyle(wear.parentNode).backgroundColor+')';
        });
        wear.addEventListener("mouseleave", (event) => {
            wear.style.removeProperty("background");
        });
        
    });
};


document.addEventListener('DOMContentLoaded', function () {
    
    document.querySelector('meta[name=theme-color]').setAttribute('content', getComputedStyle(document.body).getPropertyValue('--bs-primary')); // custom mobile color

    imgBackground();

    bsModalBox();
    bsTogglePopover();
    bsToggleTooltip();

    linkInOut();

    sideTabs();
    sideBars();
    scrollspy();
    

    progress();
    ganchor();
    scroller();
    counter();
    writter();

    closeClick();
    
    whatssappForm();
    
    wear();
    
    Promise.resolve(cssMedias()).then(function(x) {
        
        picAutoHeight();
        picReflection();
        
    });
    
});

window.addEventListener("load", (event) => {
    picSwap();
});

window.addEventListener('resize', (event) => {

    picAutoHeight();
    picSwap();

    imgBackground();

    scroller();
    
    wear();
    
});
