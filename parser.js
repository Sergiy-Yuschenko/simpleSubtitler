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

    for (let i = 0; i <= lastSymbNumb; i += stepLength) { //цикл, в процесі якого проходить посимвольний аналіз даних та їх розпарсювання
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
                subtitleTextContainer = normalizeСurrentTextContainerData(subtitleTextContainer); //Видаляємо зайві пробіли та переноси з тексу субтитрів за рахунок функції для нормалізації вмісту контейнеру для проміжного зберігання тексту субтитрів
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

//Функція для нормалізації вмісту контейнеру для проміжного зберігання тексту субтитрів (видалення зайвих символів пробілу та переносу на новий рядок)
function normalizeСurrentTextContainerData(textсontainer) {
    // const timestampLength = timestamp.length;
    let copyTextOn = false; //вмикач зчитування текстової інформації
    let invertedTextContainer = []; //Контейнер для додавання очищеного тексту в інфертованому вигляді
    for (let i = textсontainer.length - 1; i >= 0; i -= 1) { //Цикл для перебору вмісту контейнеру для проміжного зберігання
        // тексту субтитрів в інвертованому(перевернутому) вигляді. Цикл перебирає рядок символів зі зворотнього боку
        //увімкнення процесу зчитування коли починаються символи відмінні від пробілів та переносів на інший рядок
        if (!copyTextOn) { //Якщо вмикач зчитування текстової інформації вимкнено
            if (textсontainer.charCodeAt(i) !== 32 && textсontainer.charCodeAt(i) !== 160 && textсontainer.charCodeAt(i) !== 10) { //і при цьому поточний символ відмінний від пробілу чи переносу на інший рядок
                copyTextOn = true; // вмикаємо вмикач зчитування текстової інформації
            }
        }
        // вимкнення процесу зчитування символів якщо якщо підряд йде декілька таких символів
        if (copyTextOn && textсontainer.charCodeAt(i) === 32 || copyTextOn && textсontainer.charCodeAt(i) === 160 || copyTextOn && textсontainer.charCodeAt(i) === 10) { //Якщо процес зчитування ввімкнено та поточний символ це пробіл або перенос на інший рядок
            if (textсontainer.charCodeAt(i - 1) === 32 || textсontainer.charCodeAt(i - 1) === 160 || textсontainer.charCodeAt(i - 1) === 10) { // і наступний символ це теж пробіл або перенос на інший рядок
                copyTextOn = false; //вимикаємо вмикач зчитування текстової інформації
                invertedTextContainer.push(' '); //в контейнер для додавання очищеного тексту в інфертованому вигляді пушимо один символ пробілу
            }
        }
        //зчитування символів
        if (copyTextOn) { //якщо вмикач зчитування текстової інформації увімкнено
            invertedTextContainer.push(textсontainer[i]); //пушимо поточний символ з контейнеру для проміжного зберігання тексту субтитрів (внутрішній контейнер цієї функції) в Контейнер для додавання очищеного тексту в інфертованому вигляді
        }
    }

    textсontainer = null; //обнуляємо контейнер для проміжного зберігання тексту субтитрів
    textсontainer = invertedTextContainer[invertedTextContainer.length - 1]; //в контейнер для проміжного зберігання тексту субтитрів додаємо останнє значення масиву контейнеру для додавання очищеного тексту в інфертованому вигляді

    for (let i = invertedTextContainer.length - 2; i >= 0; i -= 1) { //Цикл для перебору вмісту контейнеру для додавання очищеного тексту в інфертованому вигляді,
        // та покроковому додавання елементів масиву в контейнер для проміжного зберігання тексту, починаючи з передостаннього елементу масиву і закінчуючи першим (в результаті очищений від зайвих пробілів та переносів інвертований
        // текст повторно інвертується та приводиться до нормального вигляду)
        textсontainer = textсontainer + invertedTextContainer[i] //до контейнеру для проміжного зберігання тексту додаємо поточний символ з контейнеру для додавання очищеного тексту в інфертованому вигляді
    }
    return textсontainer; //функція повертає вміст контейнер для проміжного зберігання тексту
}



//  console.log(normalizeСurrentTextContainerData(timestamp));
    console.log(scatteredDataArray);

//Знаходимо елемент текстової області для виводу тексту тексту структури srt файлу
const textareaOutputEl = document.querySelector('.js-textarea-output');







