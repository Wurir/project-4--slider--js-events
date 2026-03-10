const init = function() {
    const imagesList = document.querySelectorAll('.gallery__item');
    imagesList.forEach( img => {
        img.dataset.sliderGroupName = Math.random() > 0.5 ? 'nice' : 'good';
    }); // za każdym przeładowaniem strony przydzielaj inną nazwę grupy dla zdjęcia

    runJSSlider();
}

document.addEventListener('DOMContentLoaded', init);

const runJSSlider = function() {
    const imagesSelector = '.gallery__item';
    const sliderRootSelector = '.js-slider'; 

    const imagesList = document.querySelectorAll(imagesSelector);
    const sliderRootElement = document.querySelector(sliderRootSelector);

    initEvents(imagesList, sliderRootElement);
    initCustomEvents(imagesList, sliderRootElement, imagesSelector);
}

const initEvents = function(imagesList, sliderRootElement) {
    imagesList.forEach( function(item)  {
        item.addEventListener('click', function(e) {
            fireCustomEvent(e.currentTarget, 'js-slider-img-click');
        });
        
    });

    // todo: 
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-next]
    // na elemencie [.js-slider__nav--next]
    const navNext = sliderRootElement.querySelector('.js-slider__nav--next');
    navNext.addEventListener('click', function(e){
        fireCustomEvent(e.currentTarget, 'js-slider-img-next')
    })

    // todo:
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-prev]
    // na elemencie [.js-slider__nav--prev]
    const navPrev = sliderRootElement.querySelector('.js-slider__nav--prev');
    navPrev.addEventListener('click', function(e){
        fireCustomEvent(e.currentTarget, 'js-slider-img-prev')
    })

    // todo:
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-close]
    // tylko wtedy, gdy użytkownik kliknie w [.js-slider__zoom]
    const zoom = sliderRootElement.querySelector('.js-slider__zoom');
    zoom.addEventListener('click', function(e){
        if(e.target.className.includes('js-slider__zoom')){
            fireCustomEvent(e.currentTarget, 'js-slider-close')
        }
    })    
}

const fireCustomEvent = function(element, name) {
    console.log(element.className, '=>', name);

    const event = new CustomEvent(name, {
        bubbles: true,
    });

    element.dispatchEvent( event );
}

const initCustomEvents = function(imagesList, sliderRootElement, imagesSelector) {
    imagesList.forEach(function(img) {
        img.addEventListener('js-slider-img-click', function(event) {
            onImageClick(event, sliderRootElement, imagesSelector);
        });
    });

    sliderRootElement.addEventListener('js-slider-img-next', onImageNext);
    sliderRootElement.addEventListener('js-slider-img-prev', onImagePrev);
    sliderRootElement.addEventListener('js-slider-close', onClose);
}

const onImageClick = function(event, sliderRootElement, imagesSelector) {
    // todo:  
    // 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję
    const figureEl = event.target
    const thumbSectionEl = document.querySelector('.js-slider')
    thumbSectionEl.classList.add("js-slider--active")
    // 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]
    const imgEl = figureEl.querySelector('img')
    const imgSrc = imgEl.getAttribute('src')
    const jsSliderEl = document.querySelector('.js-slider__image')
    jsSliderEl.setAttribute('src', imgSrc)
    
    // 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
    const figureElDataSet = figureEl.dataset.sliderGroupName
    
    // 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku
    const groupElements = document.querySelectorAll('[data-slider-group-name="' +figureElDataSet+ '"]')
    
    // 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
    const sliderThumbsEl = document.querySelector('.js-slider__thumbs')
    const sliderPrototypeEl = sliderThumbsEl.querySelector('.js-slider__thumbs-item--prototype')

    groupElements.forEach(element => {
        const elementImg = element.querySelector('img')
        const src = elementImg.src
        
        const clonedThumbEl = sliderPrototypeEl.cloneNode(true)
        clonedThumbEl.classList.remove('js-slider__thumbs-item--prototype')
        const clonedImgEl = clonedThumbEl.querySelector('.js-slider__thumbs-image')
        clonedImgEl.setAttribute('src', src)

        sliderThumbsEl.appendChild(clonedThumbEl)
    })
    
    // 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany
    const sliderImage = thumbSectionEl.querySelector('.js-slider__image')
    const sliderImageSrc = sliderImage.src
    
    const sliderThumbImgs = sliderThumbsEl.querySelectorAll('.js-slider__thumbs-image')

    sliderThumbImgs.forEach(element => {
        const src = element.src
        
        if(sliderImageSrc === src){
            element.classList.add('js-slider__thumbs-image--current')       
        }
    })
}

const onImageNext = function(event) {
    console.log(this, 'onImageNext');
    // [this] wskazuje na element [.js-slider]
    const sliderEl = document.querySelector('.js-slider__image')
    // todo:
    // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
    const currentEl = document.querySelector('.js-slider__thumbs-image--current')
    
    // 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
    const parentEl = currentEl.parentElement
    const nextEl = parentEl.nextElementSibling
    
    // 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
    if(nextEl !== null){
        const nextElImg = nextEl.querySelector('img')
        currentEl.classList.remove('js-slider__thumbs-image--current')
        nextElImg.classList.add('js-slider__thumbs-image--current')

        const newSrc = nextElImg.src
        sliderEl.src = newSrc
    } else {
        const firstChildEl = parentEl.parentElement.children[1]
        const firstChildImg = firstChildEl.querySelector('img')
        const firstChildImgSrc = firstChildImg.src
        sliderEl.src = firstChildImgSrc

        currentEl.classList.remove('js-slider__thumbs-image--current')
        firstChildImg.classList.add('js-slider__thumbs-image--current')
    }
    // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
    // 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]
}

const onImagePrev = function(event) {
    console.log(this, 'onImagePrev');
    // [this] wskazuje na element [.js-slider]
    
    // todo:
    // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
    // 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
    // 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
    // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
    // 5. podmienić atrybut [src] dla [.js-slider__image]
}

const onClose = function(event) {
    // todo:
    // 1. należy usunać klasę [js-slider--active] dla [.js-slider]
    // 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
}