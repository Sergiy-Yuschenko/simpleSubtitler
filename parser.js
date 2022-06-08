const scatteredDataArray = []; //Масив для розпарсених данних



let dataСontainer = null; //контейнер для зберігання текстових даних введених з поля вводу
let subtitleTextContainer = null; //контейнер для проміжного зберігання тексту субтитрів
let subtitleNumberContainer = null; //контейнер для проміжного зберігання чисел
let firstTimestamp = null; //контейнер для зберігання часової мітки початку тексту субтитра
let secondTimestamp = null; //контейнер для зберігання часової мітки кінця тексту субтитра
let currentTimestamp = null; //контейнер для зберігання поточної часової мітки


let timestampType = null; //змінна яка зберігає тип часової мітки (1 - якщо формат XX:XX, 2 - якщо формат XX:XX:XX, 3 - якщо формат  X:XX:XX)

//Знаходимо елемент кнопки генерації
const buttonEl = document.querySelector('.js-button');
//Чіпляємо слухач на кнопку генерації
buttonEl.addEventListener('click', parseEnteredText);


//Знаходимо елемент текстової області для вводу тексту з часовими мітками
const textareaInputEl = document.querySelector('.js-textarea-input');
//Чіпляємо слухач на  текстову область вводу тексту з часовими мітками
textareaInputEl.addEventListener('input', copyTextFromTextarea);
//Функція для додавання данних з текстового поля для вводу в змінну dataContainer
function copyTextFromTextarea(element) { 
    dataСontainer = element.target.value;
    // console.log(dataСontainer);
}

//Функція для визначення типу часової мітки 1 - якщо формат XX:XX, 2 - якщо формат XX:XX:XX, 3 - якщо формат  X:XX:XX
function timestampTypeDetermination(i) {
    if (dataСontainer.charCodeAt(i) >= 48 && dataСontainer.charCodeAt(i) <= 57) {
        if (dataСontainer.charCodeAt(i+1) >= 48 && dataСontainer.charCodeAt(i+1) <= 57) {
            if (dataСontainer.charCodeAt(i + 2) === 58) {
                if (dataСontainer.charCodeAt(i + 3) >= 48 && dataСontainer.charCodeAt(i + 3) <= 57) {
                    if (dataСontainer.charCodeAt(i + 4) >= 48 && dataСontainer.charCodeAt(i + 4) <= 57) {
                        timestampType = 1; //якщо формат типу XX:XX
                        if (dataСontainer.charCodeAt(i + 5) === 58) {
                            if (dataСontainer.charCodeAt(i + 6) >= 48 && dataСontainer.charCodeAt(i + 6) <= 57) {
                                if (dataСontainer.charCodeAt(i + 7) >= 48 && dataСontainer.charCodeAt(i + 7) <= 57) {
                                    timestampType = 2; //якщо формат типу XX:XX:XX
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (dataСontainer.charCodeAt(i) >= 48 && dataСontainer.charCodeAt(i) <= 57) {
        if (dataСontainer.charCodeAt(i + 1) === 58) {
            if (dataСontainer.charCodeAt(i + 2) >= 48 && dataСontainer.charCodeAt(i + 2) <= 57) {
                if (dataСontainer.charCodeAt(i + 3) >= 48 && dataСontainer.charCodeAt(i + 3) <= 57) {
                    if (dataСontainer.charCodeAt(i + 4) === 58) {
                        if (dataСontainer.charCodeAt(i + 5) >= 48 && dataСontainer.charCodeAt(i + 5) <= 57) {
                            if (dataСontainer.charCodeAt(i + 6) >= 48 && dataСontainer.charCodeAt(i + 6) <= 57) {
                                timestampType = 3; //якщо формат типу X:XX:XX
                                console.log(666);
                            }
                        }
                    }
                }
            }
        }
    }
}

//Фунція для розпарсювання введеного тексту в структуровані дані, які поміщуються в масив об'єктів
function parseEnteredText() {
    if (dataСontainer === null) { //якщо форма пуста - завершити функцію без результату
        return;
    }
    const lastSymbNumb = dataСontainer.length - 1; //визначення номеру останнього символу в рядку введеного тексту
    let stepLength = 1; //довжина кроку виражена в кількості символів
    let parseOn = false; //вмикач розпарсювання
    let copyTextOn = false; //вмикач зчитування текстової інформації

    for (let i = 0; i <= lastSymbNumb; i = i + stepLength) { //цикл, в процесі якого проходить посимвольний аналіз даних та їх розпарсювання
        if (stepLength !== 1) { //повернення часової мітки до одиниці
            stepLength = 1;
        }
        
        if (dataСontainer.charCodeAt(i) >= 48 && dataСontainer.charCodeAt(i) <= 57) { //якщо символ є числом - перевірити чи це не часова мітка
            timestampTypeDetermination(i); //визначаємо тип часової мітки за допомогою відповідної функції
        }

        if (parseOn === false && timestampType !== 0) { //Якщо знайдена перша часова мітка, 
            parseOn = true; //вмикаємо процес розпарсювання
        }

        switch (timestampType) { //Визначеня довжини кроку в залежності від типу часоівої мітки
            case 1:
                stepLength = 5;
                break;
            case 2:
                stepLength = 8;
                break;
            case 3:
                stepLength = 7;
                break;
        }
        // Блок для додавання тексту у контейнер для проміжного зберігання тексту субтитрів
        if (parseOn === true && timestampType === null) { //Якщо процес розпарсювання увімкнуто та змінна яка зберігає тип часової мітки пуста
            if (copyTextOn === true) { //та Якщо вмикач зчитування текстової інформації увімкнуто,
                subtitleTextContainer = subtitleTextContainer + dataСontainer[i]; //додаваємо символи у контейнер для проміжного зберігання тексту субтитрів
            }
            if (copyTextOn === false && dataСontainer.charCodeAt(i) !== 32 && dataСontainer.charCodeAt(i) !== 160 && dataСontainer.charCodeAt(i) !== 10) { // а якщо 
                //вмикач зчитування текстової інформації вимкнуто а поточний символ введеного тексту, що перебирається не є пробілом чи переносом на інший рядок
                copyTextOn = true;  //вмикаємо вмикач зчитування текстової інформації
                subtitleTextContainer = dataСontainer[i]; //в контейнер для проміжного зберігання тексту субтитрів додаємо поточне значення символу введеного тексту, як перший символ контейнеру
            }
        }

        if (parseOn === true && timestampType !== null) { // Блок для додавання часової мітки 
            currentTimestamp = dataСontainer[i]; // в контейнер для зберігання поточної часової мітки додаємо значення поточного символу з введеного тексту,
            // як першого символу часової мітки
            for (let j = i + 1; j < i + stepLength; j = j + 1) { //Цикл який посимвольно викопійовує часову мітку в контейнер для зберігання поточної часової мітки, в залежності від її довжини
                currentTimestamp = currentTimestamp + dataСontainer[j];
            }
            timestampType = null; //Прибираємо значення типу часової мітки в контейнер для зберігання поточної часової мітки
        }
        if (secondTimestamp && copyTextOn) { //якщо немає кінцевої часової мітки, то береться з першої часової мітки наступного
            //рядка, відповідно потрібно продублювати цю вже забрану мітку як першу мітку наступного рядка, щоб не було помилки
            firstTimestamp = secondTimestamp;
        }

        if (currentTimestamp) { //Якщо контейнер для зберігання поточної часової мітки заповнений
            if (!subtitleTextContainer) { // і при цьому контейнер для проміжного зберігання тексту субтитрів пустий
                firstTimestamp = currentTimestamp; //контейнеру для зберігання часової мітки початку тексту субтитра присвоюємо значення контейнера для зберігання поточної часової мітки
                currentTimestamp = null; // очищуємо контейнера для зберігання поточної часової мітки
            }
            if (subtitleTextContainer) { // а якщо при цьому контейнер для проміжного зберігання тексту субтитрів заповнений
                secondTimestamp = currentTimestamp; //контейнеру для зберігання часової мітки  кінця тексту субтитра присвоюємо значення контейнера для зберігання поточної часової мітки
                сreatingArrayWithData(firstTimestamp, secondTimestamp, subtitleTextContainer); //Отримані часові мітки та текст субтитра додаємо в масив за допомогою функції для додавання даних по субтитрах в масив 
                currentTimestamp = null; //очищуємо контейнера для зберігання поточної часової мітки 
                firstTimestamp = null; // очищуємо контейнер для зберігання часової мітки початку тексту субтитра
                subtitleTextContainer = null; // очищуємо контейнер для проміжного зберігання тексту субтитрів
                copyTextOn = false; //вимикаємо вмикач зчитування текстової інформаці
            }
        }
    }
}

//Функція для додавання даних по субтитрах в масив
function сreatingArrayWithData(t1, t2, sub) { 
     scatteredDataArray.push({ firstTimestamp: t1, secondTimestamp: t2, subtitleText: sub,});
}

    console.log(scatteredDataArray);

//Знаходимо елемент текстової області для виводу тексту тексту структури srt файлу
const textareaOutputEl = document.querySelector('.js-textarea-output');







