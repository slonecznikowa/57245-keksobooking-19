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
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Функция получения суб массива - нового массива из массива
function getRandomSubArray(array) {
  var arraySize = getRandomNumber(1, array.length);
  var subArray = [];
  for (var i = 0; i < arraySize; i++) {
    subArray.push(getRandomArrayItem(array));
  }
  return subArray;
}

// Функция создания массива из 8 сгенерированных JS объектов
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
        features: getRandomSubArray(ADV_FEAUTURES),
        description: ADV_DESCRIPTION + ' № ' + (i + 1),
        photos: getRandomSubArray(ADV_PHOTOS),
      },
      location: {
        x: getRandomNumber(MIN_AXIS_X, maxAxisX),
        y: getRandomNumber(MIN_AXIS_Y, MAX_AXIS_Y),
      }

    });
  }
  return advertisements;

}

// Функция создания DOM-элемента на основе JS-объекта: PIN
var mapPins = document.querySelector('.map__pins');

var renderPin = function (array) {
  var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinElement = templatePin.cloneNode(true);

  pinElement.style.left = (array.location.x - PIN_WIDTH / 2) + 'px';
  pinElement.style.top = (array.location.y - PIN_HEIGHT) + 'px';
  pinElement.querySelector('img').src = array.author.avatar;
  pinElement.querySelector('img').alt = array.offer.title;

  return pinElement;
};

// Функция создания DOM-элемента на основе JS-объекта: PHOTO
var renderPhoto = function (photo) {
  var templatePhoto = document.querySelector('#card').content.querySelector('.popup__photo');
  var photoElement = templatePhoto.cloneNode(true);
  photoElement.src = photo;
  return photoElement;
};

// Функция создания DOM-элемента на основе JS-объекта: FEATURE
var renderFeature = function (feature) {
  var templateFeature = document.querySelector('#card').content.querySelector('.popup__feature--' + feature);
  var featureElement = templateFeature.cloneNode(true);
  return featureElement;
};

// Функция перевода значений типа жилья
var typeOfAccomodation = function translateType(type) {
  var typeOffer = 'нет данных';
  if (type === 'flat') {
    typeOffer = 'Квартира';
  } else if (type === 'bungalo') {
    typeOffer = 'Бунгало';
  } else if (type === 'house') {
    typeOffer = 'Дом';
  } else if (type === 'palace') {
    typeOffer = 'Дворец';
  }
  return typeOffer;
};

// Функция удаления всех дочерних элементов, которые были в шаблоне
var removeAllChildElement = function (parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

// Функция создания фрагмента, принимает массив данных и функцию отрисовки элемента
var getFragment = function (items, renderFunction) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < items.length; i++) {
    fragment.appendChild(renderFunction(items[i]));
  }
  return fragment;
};

var templateCard = document.querySelector('#card').content;

var renderCard = function (adv) {
  var cardElement = templateCard.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = adv.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = adv.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = adv.offer.price + ' ₽/ночь';
  cardElement.querySelector('.popup__type').textContent = typeOfAccomodation(adv.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = adv.offer.rooms + ' комнаты для ' + adv.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + adv.offer.checkin + ', выезд до ' + adv.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = adv.offer.description;
  cardElement.querySelector('.popup__avatar').src = adv.author.avatar;

  var features = cardElement.querySelector('.popup__features');
  removeAllChildElement(features);
  var fragmentOfferFeatures = getFragment(adv.offer.features, renderFeature);
  features.appendChild(fragmentOfferFeatures);

  var cardPhoto = cardElement.querySelector('.popup__photos');
  removeAllChildElement(cardPhoto);
  var fragmentOfferPhotos = getFragment(adv.offer.photos, renderPhoto);
  cardPhoto.appendChild(fragmentOfferPhotos);

  // Вставка карточки объявления в блок .map перед блоком .map__filters-container
  var referenceElement = map.querySelector('.map__filters-container');
  map.insertBefore(cardElement, referenceElement);

  return cardElement;
};

// Функция заполнения блока DOM-элементами на основе массива JS-объектов
var renderDomPins = function () {
  var advertisements = generateAdvertisement();
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ADV_NUMBER; i++) {
    fragment.appendChild(renderPin(advertisements[i]));
    fragment.appendChild(renderCard(advertisements[0]));
  }

  mapPins.appendChild(fragment);
};
renderDomPins();

