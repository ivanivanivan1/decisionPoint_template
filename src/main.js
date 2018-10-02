import './scripts/jquery-global'
import Foundation from './scripts/vendor-foundation'
import 'leaflet/dist/leaflet'
import 'slick-carousel'
import Inputmask from "inputmask/dist/inputmask/inputmask.numeric.extensions";
const $ = window.$ = jQuery
const env = '__ENV'
const rootEl = document.querySelector('html')
console.log(`frontend scripts bundled using ${env} environment`)
console.log('jQuery works', {
	body: $('body')
})
rootEl.classList.add('js')
window.getFoundationBreakpointInPixels = getFoundationBreakpointInPixels
$(document)
	.ready(() => {
        $(document).foundation()
		$('html').addClass('jquery-ready')
		// initSlick(rootEl)
        // mfpInit(document)
        initYandexMaps(document)
        initSlick(document)
        maskInputs(document)
        initHomePageScripts()
        $(window).resize(function() {
            if (Foundation.MediaQuery.atLeast('large')) {
                $('#home-slider').css('margin-top', 0)
            } else {
                $('#home-slider').css('margin-top', $('#siteHeader').outerHeight())
            }
        }).resize()
	})
const foundationMediaQueriesInPixels = createFoundationMediaQueriesInPixels()
function createFoundationMediaQueriesInPixels() {
	function convertToPixels(name) {
		const string = Foundation.MediaQuery.get(name)
		const regex = /\b(\d+)em\b/
		const parse = string.match(regex)
		return Number(parse[1]) * 16
	}
	const queries = Foundation.MediaQuery.queries.map(value => ({
		name: value.name,
		value: convertToPixels(value.name),
	}))
	console.log({queries})
	return queries
}
function getFoundationBreakpointInPixels(name) {
	return foundationMediaQueriesInPixels.find(value => value.name === name).value
}

function initYandexMaps(where) {
    var zoom = 17,
        coords = [59.985485, 30.307600]
    // Функция ymaps.ready() будет вызвана, когда
        // загрузятся все компоненты API, а также когда будет готово DOM-дерево.
    ymaps.ready(init);
    function init() {
        // Создание карты.
        var myMap = new ymaps.Map("yandex-map", {
            center: coords,
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: zoom,
            controls: ['fullscreenControl'],
        });

        var MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        )

        var myPlacemark = new ymaps.Placemark(coords, {
            // Хинт показывается при наведении мышкой на иконку метки.
            hintContent: 'Нажмите, чтобы посмотреть контакты',
            // Балун откроется при клике по метке.
            balloonContent: '+7 (911) 123-45-67',
            //iconContent: '12'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'assets/img/logo.png',
            // Размеры метки.
            iconImageSize: [40, 50],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            // iconImageOffset: [-24, -24],
            // Смещение слоя с содержимым относительно слоя с картинкой.
            // iconContentOffset: [15, 15],
            // Макет содержимого.
            iconContentLayout: MyIconContentLayout,
            hideIconOnBalloonOpen: false,
        });
        
        // После того как метка была создана, ее
        // можно добавить на карту.
        myMap.geoObjects.add(myPlacemark)

        $(where).find('[data-get-location-map]').each((index, element) => {
            element.addEventListener('click', function() {

                myMap.setCenter(coords, zoom, {
                    duration: 200,
                })
            })
        })
    }
}

function initSlick(where) {
	$(where).find('[data-slick]').each((index, element) => {
		let options = {
            // autoplay: true,
            appendDots: $('#sliderDots'),
            // customPaging: function(slider, i) {
            //     return '<div class="slider-dotsWrapper" data-anim="base wrapper"> \
            //                 <button type="button" tabindex="' + i + '" role="tab" id="slick-slide-control' + i + '" aria-controls="slick-slide' + i + '" aria-label="' + i + ' of ' + slider.sliderCount + '">' + (i + 1) + '</button> \
            //                 <div class="slider-dotsCircle" data-anim="base under"></div> \
            //                 <div class="slider-dotsCircle" data-anim="base right"></div> \
            //                 <div class="slider-dotsCircle" data-anim="base left"></div> \
            //             </div>';
            // },
            customPaging: function(slider, i) {
                return '<button type="button" tabindex="' + i + '" role="tab" id="slick-slide-control' + i + '" aria-controls="slick-slide' + i + '" aria-label="' + i + ' of ' + slider.sliderCount + '">' + (i + 1) + '</button>\
                        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" class="slider-dotsWrapper">\
                            <g>\
                                <circle class="slider-dotsCircle slider-dotsCircle_static" stroke-dasharray="60px" stroke-width="2" stroke="hsl(207, 4%, 44%)" stroke-miterlimit="10" cx="10" cy="10" r="9"/>\
                            </g>\
                            <g>\
                                <circle class="slider-dotsCircle slider-dotsCircle_animated" stroke-width="2" stroke-miterlimit="10" cx="10" cy="10" r="9"/>\
                            </g>\
                        </svg>';
            },
            dots: true,
            dotsClass: 'slider-dots',
            infinite: true,
            // speed: 600,
            waitForAnimate: false,
        }
		// if ($(element).attr('data-slick-options')) {
		// 	options = window[$(element).attr('data-slick-options')]
		// }
		$(element)
			.on('init', function(e, slick, currentSlide) {
				// element.addClass('slick-initialized')
				// const $video = $(where).find('video').get(0)
				// if ($video) {
				// 	$video.play()
                // }
                animateDots(element)
            })
            .on('afterChange', function(e, slick, currentSlide) {
                if (window.currentSlide != currentSlide) {
                    $('.slider-dots .slider-dotsCircle_animated').each(function(index, element) {
                        element.setAttribute("stroke-dashoffset", 0)
                    })

                    animateDots(element)
                }
            })
            .on('beforeChange', function(e, slick, currentSlide) {
                window.currentSlide = currentSlide
                // var nextSlide = (currentSlide + 1) % slick.$slides.length
                // if (nextSlide == currentSlide) {
                //     e.preventDefault()
                //     return false
                // }
            })
            .slick(options)
    })
    function animateDots(element) {
        window.clearInterval(window.timerNextSlide)
        var currentDot = $('.slider-dots li.slick-active .slider-dotsCircle_animated').get(0)
        var interval = 50
        var offset_increment = 0.2
        var stroke_dashoffset = 2 * offset_increment
        currentDot.setAttribute('stroke-dashoffset', offset_increment + 'px')
        
        window.timerNextSlide = window.setInterval(function() {
            if (!window.isSliderPaused) {
                if (stroke_dashoffset > 57) {
                    // stroke_dashoffset = 0
                    currentDot.setAttribute("stroke-dashoffset", 0 + 'px')
                    window.clearInterval(window.timerNextSlide)
                    $(element).slick('slickNext')
                } else {
                    currentDot.setAttribute('stroke-dashoffset', stroke_dashoffset + 'px')
                }
                stroke_dashoffset += offset_increment
            }
        }.bind(this), interval)
    }
}

function initHomePageScripts() {
    $('#search-button').click(function() {
        $('#sb-search').toggleClass('navSearch_open')
        $('#search-button-wrapper').fadeOut(100)
        $('#search').focus()
    })
    
    $('#menuTogglerHamburger').on('click', function() {
        $(this).toggleClass('menuToggler_open')
    })

    $('#search').focusout(function() {
        if (Foundation.MediaQuery.atLeast('large')) {
            $('#sb-search').toggleClass('navSearch_open')
            $('#search-button-wrapper').fadeIn(100)
        }
    })
    $('.contactForm-main .buttonPhone').focus(function() {
        window.isSliderPaused = true
    })

    $('.contactForm-main .buttonPhone').focusout(function() {
        window.isSliderPaused = false
    })
}
function maskInputs(where) {
    $(where).find('[data-masked-input-phone]').each((index, element) => {
        Inputmask({
                'mask': '+7(999) 999-99-99',
                'clearmaskonlostfocus': false,
            }).mask(element);
    })
	// $(where).find('[data-masked-input-phone]').mask('+7(999) 999-99-99')
}