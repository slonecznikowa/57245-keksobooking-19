'use strict';

var ADV_NUMBER = 8;
var ADV_TITLE = 'Заголовок объявления';
var MIN_PRICE = 10000;
var MAX_PRICE = 50000;
var ADV_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var MIN_ROOMS = 1;
var MAX_ROOMS = 100;
var MIN_GUESTS = 1;
var MAX_GUESTS = 3;
var ADV_CHECKIN = ['12:00', '13:00', '14:00'];
var ADV_CHECKOUT = ['12:00', '13:00', '14:00'];
var ADV_FEAUTURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ADV_DESCRIPTION = 'Описание объявления';
var ADV_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_AXIS_X = 0;
var MIN_AXIS_Y = 130;
var MAX_AXIS_Y = 630;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var map = document.querySelector('.map');
map.classList.remove('map--faded');

// Вычисление ширины блока, в котором перетаскивается метка (1200px)
var maxAxisX = map.querySelector('.map__pins').clientWidth;

// Функция получения случайного целого числа в диапазоне min и max, включая их
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция получения рандомного элемента в массиве
function getRandomArrayItem(array) {
  var randomIndex = getRandomNumber(array.length);
  return array[randomIndex];
}

// Функция создания массива из 8 сгенерированных JS объектов.
function generateAdvertisement() {
  var advertisements = [];

  for (var i = 0; i < ADV_NUMBER; i++) {

    advertisements.push({
      author: {
        avatar: 'img/avatars/user' + '0' + (i + 1) + '.png',
      },
      offer: {
        title: ADV_TITLE + ' № ' + (i + 1),
        address: getRandomNumber(MIN_AXIS_X, maxAxisX) + ', ' + getRandomNumber(MIN_AXIS_Y, MAX_AXIS_Y),
        price: getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: getRandomArrayItem(ADV_TYPE),
        rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: getRandomArrayItem(ADV_CHECKIN),
        checkout: getRandomArrayItem(ADV_CHECKOUT),
        features: getRandomArrayItem(ADV_FEAUTURES),
        description: ADV_DESCRIPTION + ' № ' + (i + 1),
        photos: getRandomArrayItem(ADV_PHOTOS),
      },
      location: {
        x: getRandomNumber(MIN_AXIS_X, maxAxisX),
        y: getRandomNumber(MIN_AXIS_Y, MAX_AXIS_Y),
      }

    });
  }
  return advertisements;
}

// Функция создания DOM-элемента на основе JS-объекта: DOM-элементы, соответствующие меткам на карте PIN
var mapPins = document.querySelector('.map__pins');
var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');

var renderPin = function (array) {
  var pinElement = templatePin.cloneNode(true);

  pinElement.style.left = (array.location.x - PIN_WIDTH / 2) + 'px';
  pinElement.style.top = (array.location.y - PIN_HEIGHT) + 'px';
  pinElement.querySelector('img').src = array.author.avatar;
  pinElement.querySelector('img').alt = array.offer.title;

  return pinElement;
};

// Функция заполнения блока DOM-элементами на основе массива JS-объектов
var renderDomPins = function () {
  var advertisements = generateAdvertisement();
  var fragment = document.createDocumentFragment();
  advertisements.forEach(function (advertisement) {
    fragment.appendChild(renderPin(advertisement));
  });
  mapPins.appendChild(fragment);
};
renderDomPins();

