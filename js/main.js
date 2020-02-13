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

    var advertisementAvatar = 'img/avatars/user' + '0' + (i + 1) + '.png';
    var advertisementTitle = ADV_TITLE + ' № ' + (i + 1);
    var advertisementPrice = getRandomNumber(MIN_PRICE, MAX_PRICE);
    var advertisementType = getRandomArrayItem(ADV_TYPE);
    var advertisementRooms = getRandomNumber(MIN_ROOMS, MAX_ROOMS);
    var advertisementGuests = getRandomNumber(MIN_GUESTS, MAX_GUESTS);
    var advertisementCheckin = getRandomArrayItem(ADV_CHECKIN);
    var advertisementCheckout = getRandomArrayItem(ADV_CHECKOUT);
    var advertisementFeatures = getRandomArrayItem(ADV_FEAUTURES);
    var advertisementDescription = ADV_DESCRIPTION + ' № ' + (i + 1);
    var advertisementPhotos = getRandomArrayItem(ADV_PHOTOS);
    var randomLocationX = getRandomNumber(MIN_AXIS_X, maxAxisX);
    var randomLocationY = getRandomNumber(MIN_AXIS_Y, MAX_AXIS_Y);
    var advertisementAddress = randomLocationX + ', ' + randomLocationY;

    advertisements.push({
      author: {
        avatar: advertisementAvatar,
      },
      offer: {
        title: advertisementTitle,
        address: advertisementAddress,
        price: advertisementPrice,
        type: advertisementType,
        rooms: advertisementRooms,
        guests: advertisementGuests,
        checkin: advertisementCheckin,
        checkout: advertisementCheckout,
        features: advertisementFeatures,
        description: advertisementDescription,
        photos: advertisementPhotos,
      },
      location: {
        x: randomLocationX,
        y: randomLocationY,
      }

    });
  }
  return advertisements;
}

// Функция создания DOM-элемента на основе JS-объекта: DOM-элементы, соответствующие меткам на карте PIN
var mapPins = document.querySelector('.map__pins');
var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');

var renderPin = function (arr) {
  var pinElement = templatePin.cloneNode(true);

  pinElement.style.left = (arr.location.x - PIN_WIDTH / 2) + 'px';
  pinElement.style.top = (arr.location.y - PIN_HEIGHT) + 'px';
  pinElement.querySelector('img').src = arr.author.avatar;
  pinElement.querySelector('img').alt = arr.offer.title;

  return pinElement;
};

// Функция заполнения блока DOM-элементами на основе массива JS-объектов
var renderDomPins = function () {
  var advertisements = generateAdvertisement();
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ADV_NUMBER; i++) {
    fragment.appendChild(renderPin(advertisements[i]));
  }
  mapPins.appendChild(fragment);
};

renderDomPins();
