const scatteredDataArray = []; //Масив для розпарсених данних
let subtitleContainer = null; //контейнер для зберігання субтитрів



let dataСontainer = null; //контейнер для зберігання текстових даних введених з поля вводу
let subtitleTextContainer; //контейнер для проміжного зберігання тексту субтитрів
//let subtitleNumberContainer = null; //контейнер для проміжного зберігання чисел
let firstTimestamp; //контейнер для зберігання часової мітки початку тексту субтитра
let secondTimestamp; //контейнер для зберігання часової мітки кінця тексту субтитра
let currentTimestamp; //контейнер для зберігання поточної часової мітки
let firstTimeRemainder = '000'; //контейнер для зберігання залишку першої часової мітки початку тексту субтитра
let secondTimeRemainder = '000'; //контейнер для зберігання залишку другої часової мітки початку тексту субтитра
let currentTimeRemainder = '000'; //контейнер для зберігання поточного залишку часової мітки 
let textTimestamp; //контейнер для зберігання часової мітки яку треба додати до субтитрів як текст


let timestampType = null; //змінна яка зберігає тип часової мітки (1 - якщо формат XX:XX, 2 - якщо формат XX:XX:XX, 3 - якщо формат  X:XX:XX)

let MethodSwitch = 'sbv'; //Перемикач методів, по замовчуванні стоїть метод генерації SBV файлів


//Знаходимо елемент кнопки генерації
const buttonEl = document.querySelector('.js-button-start');
//Чіпляємо слухач на кнопку генерації
buttonEl.addEventListener('click', generateSub);//parseEnteredText

const buttonCopyEl = document.querySelector('.js-button-copy'); //Знаходимо елемент кнопки копіювання
buttonCopyEl.disabled = 'true';//Додаємо атрибут "disabled" до кнопки копіювання

//Знаходимо елемент текстової області для вводу тексту з часовими мітками
const textareaInputEl = document.querySelector('.js-textarea-input');

//Знаходимо елемент для виводу тексту з внутрішньою структурою субтитрів
const textareaOutputEl = document.querySelector('.js-textarea-output');

//Чіпляємо слухач на  текстову область вводу тексту з часовими мітками
textareaInputEl.addEventListener('input', copyTextFromTextarea);
//Функція для додавання данних з текстового поля для вводу в змінну dataContainer
function copyTextFromTextarea(element) { 
    dataСontainer = element.target.value;
}

//Функція для визначення типу часової мітки 1 - якщо формат XX:XX, 2 - якщо формат XX:XX:XX, 3 - якщо формат  X:XX, 4 - якщо формат  X:XX:XX
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
                        timestampType = 3; //якщо формат типу X:XX
                    if (dataСontainer.charCodeAt(i + 4) === 58) {
                        if (dataСontainer.charCodeAt(i + 5) >= 48 && dataСontainer.charCodeAt(i + 5) <= 57) {
                            if (dataСontainer.charCodeAt(i + 6) >= 48 && dataСontainer.charCodeAt(i + 6) <= 57) {
                                timestampType = 4; //якщо формат типу X:XX:XX
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
    firstTimestamp = null; //обнулюємо контейнер для зберігання часової мітки початку тексту субтитра
    secondTimestamp = null; //обнулюємо контейнер для зберігання часової мітки кінця тексту субтитра
    currentTimestamp = null; // обнулюємо контейнер для зберігання поточної часової мітки
    subtitleTextContainer = null; //контейнер для проміжного зберігання тексту субтитрів
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
        if (textTimestamp !== null) { //Якщо контейнер для зберігання часової мітки яку треба додати до субтитрів як текст заповнеybq
            textTimestamp = null; //Обнуляємо його значення
        }

        //Блок який викопійовує часову мітку, та додає її до тексту субтитрів якщо перед нею стоїть комбінація символів &$
        if (parseOn === true && dataСontainer.charCodeAt(i) === 38 && dataСontainer.charCodeAt(i + 1) === 36) { //Якщо копіювання тексту увімнуто, поточний символ "&" а наступний символ "$"
            if (dataСontainer.charCodeAt(i + 2) >= 48 && dataСontainer.charCodeAt(i + 2) <= 57) { //перевіряємо: Якщо другий символ після поточного - число
                timestampTypeDetermination(i + 2); //визначаємо тип часової мітки за допомогою відповідної функції (якщо це не часова мітка, то тип лишається "null")
                switch (timestampType) { //Визначеня довжини кроку в залежності від типу часоівої мітки, яка йде за символами &$
                    case 1:
                        stepLength = 7;
                        break;
                    case 2:
                        stepLength = 10;
                        break;
                    case 3:
                        stepLength = 6;
                        break;
                    case 4:
                        stepLength = 9;
                        break;
                }
                if (timestampType !== null) { //Якщо значення типу часової мітки не null
                    textTimestamp = dataСontainer[i + 2]; //в контейнер для зберігання часової мітки додаємо друге значення символу з dataСontainer після поточного
                    for (let j = i + 3; j < i + stepLength; j = j + 1) { //Цикл який посимвольно викопійовує часову мітку в контейнер для зберігання поточної часової мітки, в залежності від її довжини починаючи з третього символу після поточного
                        textTimestamp = textTimestamp + dataСontainer[j]; //в контейнер для зберігання часової мітки яку треба додати до тексту субтитрів додаємо другий символ
                    }
                    subtitleTextContainer = subtitleTextContainer + textTimestamp;
                    timestampType = null; //Прибираємо значення типу часової мітки в змінній яка зберігає тип часової мітки
                }
            }
        }

        switch (timestampType) { //Визначеня довжини кроку в залежності від типу часоівої мітки
            case 1:
                stepLength = 5;
                break;
            case 2:
                stepLength = 8;
                break;
            case 3:
                stepLength = 4;
                break;
            case 4:
                stepLength = 7;
                break;
        }
        // Блок для додавання тексту у контейнер для проміжного зберігання тексту субтитрів
        if (parseOn === true && timestampType === null && textTimestamp === null) { //Якщо процес розпарсювання увімкнуто та змінна яка зберігає тип часової мітки пуста
            if (copyTextOn === true) { //та Якщо вмикач зчитування текстової інформації увімкнуто,
                subtitleTextContainer = subtitleTextContainer + dataСontainer[i]; //додаваємо символи у контейнер для проміжного зберігання тексту субтитрів
            }
            if (copyTextOn === false && dataСontainer.charCodeAt(i) !== 32 && dataСontainer.charCodeAt(i) !== 160 && dataСontainer.charCodeAt(i) !== 10) { // а якщо 
                //вмикач зчитування текстової інформації вимкнуто а поточний символ введеного тексту, що перебирається не є пробілом чи переносом на інший рядок
                copyTextOn = true;  //вмикаємо вмикач зчитування текстової інформації
                subtitleTextContainer = dataСontainer[i]; //в контейнер для проміжного зберігання тексту субтитрів додаємо поточне значення символу введеного тексту, як перший символ контейнеру
            }
        }
         // Блок для додавання часової мітки 
        if (parseOn === true && timestampType !== null) {
            currentTimestamp = dataСontainer[i]; // в контейнер для зберігання поточної часової мітки додаємо значення поточного символу з введеного тексту,
            // як першого символу часової мітки
            for (let j = i + 1; j < i + stepLength; j = j + 1) { //Цикл який посимвольно викопійовує часову мітку в контейнер для зберігання поточної часової мітки, в залежності від її довжини
                currentTimestamp = currentTimestamp + dataСontainer[j];
            }
             // Підблок для додавання залишку часової мітки 
            if (dataСontainer.charCodeAt(i + stepLength) === 46) {//Перевірка наявності залишку: якщо перший символ після часової мітки "."
                if (dataСontainer.charCodeAt(i + stepLength + 1) >= 48 && dataСontainer.charCodeAt(i + stepLength + 1) <= 57) {//якщо другий символ після часової мітки - число
                    if (dataСontainer.charCodeAt(i + stepLength + 2) >= 48 && dataСontainer.charCodeAt(i + stepLength + 2) <= 57) { //якщо третій символ після часової мітки - число
                        if (dataСontainer.charCodeAt(i + stepLength + 3) >= 48 && dataСontainer.charCodeAt(i + stepLength + 3) <= 57) { //якщо четвертий символ після часової мітки - число
                            currentTimeRemainder = `${dataСontainer[i + stepLength + 1]}${dataСontainer[i + stepLength + 2]}${dataСontainer[i + stepLength + 3]}`; // в контейнер для зберігання поточного залишку часової мітки додаємо значення другого, третього та четвертого символа після часової мітки
                        }
                        stepLength = stepLength + 4; //Збільшуємо довжину кроку циклу на чотири одиниці
                    }
                }
            }
            timestampType = null; ////Прибираємо значення типу часової мітки в змінній яка зберігає тип часової мітки
        }
        if (secondTimestamp && !firstTimestamp && copyTextOn) { //Якщо змінна другої часової мітки заповнена, а першої - пуста і при цьому ввімкнутий перемикач зчитування символів, то береться з першої часової мітки наступного

            //рядка, відповідно потрібно продублювати цю вже забрану мітку як першу мітку наступного рядка, щоб не було помилки
            firstTimestamp = secondTimestamp;
            firstTimeRemainder = secondTimeRemainder; // Те саме робимо і з залишками часових міток
        }

        if (currentTimestamp) { //Якщо контейнер для зберігання поточної часової мітки заповнений
            if (!subtitleTextContainer) { // і при цьому контейнер для проміжного зберігання тексту субтитрів пустий
                firstTimestamp = currentTimestamp; //контейнеру для зберігання часової мітки початку тексту субтитра присвоюємо значення контейнера для зберігання поточної часової мітки
                firstTimeRemainder = currentTimeRemainder;//В контейнер для зберігання залишку першої часової мітки початку тексту субтитра додаємо значення з контейнера для зберігання поточного залишку часової мітки 
                currentTimestamp = null; // очищуємо контейнера для зберігання поточної часової мітки
                currentTimeRemainder = '000'; //Обнуляємо контейнер для зберігання поточного залишку часової мітки 
            }
            if (subtitleTextContainer) { // а якщо при цьому контейнер для проміжного зберігання тексту субтитрів заповнений
                secondTimestamp = currentTimestamp; //контейнеру для зберігання часової мітки  кінця тексту субтитра присвоюємо значення контейнера для зберігання поточної часової мітки
                secondTimeRemainder = currentTimeRemainder;//В контейнер для зберігання залишку другої часової мітки початку тексту субтитра додаємо значення з контейнера для зберігання поточного залишку часової мітки 
                subtitleTextContainer = normalizeСurrentTextContainerData(subtitleTextContainer); //Видаляємо зайві пробіли та переноси з тексу субтитрів за рахунок функції для нормалізації вмісту контейнеру для проміжного зберігання тексту субтитрів
                сreatingArrayWithData(firstTimestamp, secondTimestamp, firstTimeRemainder, secondTimeRemainder, subtitleTextContainer); //Отримані часові мітки, залишки часових міток та текст субтитра додаємо в масив за допомогою функції для додавання даних по субтитрах в масив
                currentTimestamp = null; //очищуємо контейнера для зберігання поточної часової мітки
                currentTimeRemainder = '000';
                firstTimestamp = null; // очищуємо контейнер для зберігання часової мітки початку тексту субтитра
                firstTimeRemainder = '000';
                subtitleTextContainer = null; // очищуємо контейнер для проміжного зберігання тексту субтитрів
                copyTextOn = false; //вимикаємо вмикач зчитування текстової інформаці
            }
        }
    }
}

//Функція для додавання даних по субтитрах в масив
function сreatingArrayWithData(t1, t2, tr1, tr2, sub) { 
     scatteredDataArray.push({ firstTimestamp: t1, secondTimestamp: t2, firstTimeRemainder: tr1, secondTimeRemainder: tr2, subtitleText: sub,});
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
        textсontainer = textсontainer + invertedTextContainer[i]; //до контейнеру для проміжного зберігання тексту додаємо поточний символ з контейнеру для додавання очищеного тексту в інфертованому вигляді
    }
    return textсontainer; //функція повертає вміст контейнера для проміжного зберігання тексту
}



//  console.log(normalizeСurrentTextContainerData(timestamp));
    

// //Знаходимо елемент текстової області для виводу тексту тексту структури srt файлу
// const textareaOutputEl = document.querySelector('.js-textarea-output');

/*---------------ГЕНЕРАЦІЯ СТРУКТУРИ ФАЙЛУ СУБТИТРІВ----------------------*/
//Функція для генерації структури SRT - файлу
function generateSRT() {
    scatteredDataArray.forEach(({ firstTimestamp, secondTimestamp, firstTimeRemainder, secondTimeRemainder, subtitleText }, index) => { //Цикл перебору масиву для розпарсених данних, та генерації текстової структури субтитрів в форматі SRT
        //Блок для нормалізації типу першої часової мітки з формату X:XX до формату XX:XX
        if (firstTimestamp.length === 4) {
            firstTimestamp = `0${firstTimestamp}`;  //додаємо на початку "0:"
        }
        //Блок для приведення часових міток до формату xx:xx:xx
        switch (firstTimestamp.length) { //першої часової мітки
            case 5: firstTimestamp = `00:${firstTimestamp}`; //якщо довжина часової мітки 5 символів, додаємо на початку "00:"
                break;
            case 7: firstTimestamp = `0${firstTimestamp}`; //якщо довжина часової мітки 7 символів, додаємо на початку "0"
                break;
             //всі інші варіани (8 символів) лишаємо як є
        }
        //Блок для нормалізації типу другої часової мітки з формату X:XX до формату XX:XX
        if (secondTimestamp.length === 4) {
            secondTimestamp = `0${secondTimestamp}`;  //додаємо на початку "0:"
        }
        switch (secondTimestamp.length) { //другої часової мітки
            case 5: secondTimestamp = `00:${secondTimestamp}`; //якщо довжина часової мітки 5 символів, додаємо на початку "00:"
                break;
            case 7: secondTimestamp = `0${secondTimestamp}`; //якщо довжина часової мітки 7 символів, додаємо на початку "0"
                break;
           //всі інші варіани (8 символів) лишаємо як є
        }
        //блок для покрокового конструювання фрагментів структури SRT файлу з даних масиву для розпарсених данних та об'єднання їх в єдиний рядок символів
        if (index === 0) { //конструюємо перший фрагмент субтитрів та додаємо в контейнер для зберігання субтитрів
            subtitleContainer = `${index + 1}${String.fromCharCode(10)}${firstTimestamp},${firstTimeRemainder} --> ${secondTimestamp},${secondTimeRemainder}${String.fromCharCode(10)}${subtitleText}${String.fromCharCode(10, 10)}`;
        } else {//конструюємо наступний фрагмент субтитрів та додаємо до наступних в контейнері для зберігання субтитрів
            subtitleContainer = subtitleContainer + `${index + 1}${String.fromCharCode(10)}${firstTimestamp},${firstTimeRemainder} --> ${secondTimestamp},${secondTimeRemainder}${String.fromCharCode(10)}${subtitleText}${String.fromCharCode(10,10)}`;
        }
    });
}

//Функція для генерації структури SBV - файлу
function generateSBV() {
    scatteredDataArray.forEach(({ firstTimestamp, secondTimestamp, firstTimeRemainder, secondTimeRemainder, subtitleText }, index) => { //Цикл перебору масиву для розпарсених данних, та генерації текстової структури субтитрів в форматі SRT
        //Блок для нормалізації типу першої часової мітки з формату X:XX до формату XX:XX
        if (firstTimestamp.length === 4) {
            firstTimestamp = `0${firstTimestamp}`;  //додаємо на початку "0:"
        }
        //Блок для приведення першої часової мітки до формату x:xx:xx
        if (firstTimestamp.length === 5) { //якщо довжина часової мітки 5 символів,
            firstTimestamp = `0:${firstTimestamp}`;  //додаємо на початку "0:"
        } else if (firstTimestamp.length === 8) { //якщо часова мітка має 8 символів, перевіряємо перший символ, і якщо це нуль - відкидаємо його
            if (firstTimestamp.charCodeAt(0) ===  48) { //якщо першим символом є нуль
                for (let i = 1; i < firstTimestamp.length; i += 1) { //перебираємо циклом символи часової мітки від другого до останнього і викопійовуємо їх
                    if (i === 1) { //якщо це другий символ, 
                        currentTimestamp = firstTimestamp[i]; //копіюємо його до контейнеру для зберігання поточної часової мітки
                    } else { //в інших варіантах
                        currentTimestamp = currentTimestamp + firstTimestamp[i]; //в інших випадках приплюсоваємо його до вже доданих символах в контейнерах зберігання поточної часової мітки
                    }
                }
                firstTimestamp = currentTimestamp; ////замінюємо значення першої часової мітки на варіант згенерований методом перебору
            }
        }  //всі інші варіани (7 символів) лишаємо як є
        //Блок для нормалізації типу другої часової мітки з формату X:XX до формату XX:XX
        if (secondTimestamp.length === 4) {
            secondTimestamp = `0${secondTimestamp}`;  //додаємо на початку "0:"
        }
        //Блок для приведення другої часової мітки до формату x:xx:xx        
        if (secondTimestamp.length === 5) { //якщо довжина часової мітки 5 символів,
            secondTimestamp = `0:${secondTimestamp}`; // додаємо на початку "0:"
        } else if (secondTimestamp.length === 8) { //якщо часова мітка має 8 символів, перевіряємо перший символ, і якщо це нуль - відкидаємо його
            if (secondTimestamp.charCodeAt(0) === 48) { //якщо першим символом є нуль
                for (let i = 1; i < secondTimestamp.length; i += 1) { //перебираємо циклом символи часової мітки від другого до останнього і викопійовуємо їх
                    if (i === 1) { //якщо це другий символ, 
                        currentTimestamp = secondTimestamp[i]; //копіюємо його до контейнеру для зберігання поточної часової мітки
                    } else {
                        currentTimestamp = currentTimestamp + secondTimestamp[i];//в інших випадках приплюсоваємо його до вже доданих символах в контейнерах зберігання поточної часової мітки
                    }
                }
                secondTimestamp = currentTimestamp; //замінюємо значення другої часової мітки на варіант згенерований методом перебору
            }
        }  //всі інші варіани (7 символів) лишаємо як є
        //блок для покрокового конструювання фрагментів структури SRT файлу з даних масиву для розпарсених данних та об'єднання їх в єдиний рядок символів
        if (index === 0) { //конструюємо перший фрагмент субтитрів та додаємо в контейнер для зберігання субтитрів
            subtitleContainer = `${firstTimestamp}.${firstTimeRemainder},${secondTimestamp}.${secondTimeRemainder}${String.fromCharCode(10)}${subtitleText}${String.fromCharCode(10, 10)}`;
        } else {//конструюємо наступний фрагмент субтитрів та додаємо до наступних в контейнері для зберігання субтитрів
            subtitleContainer = subtitleContainer + `${firstTimestamp}.${firstTimeRemainder},${secondTimestamp}.${secondTimeRemainder}${String.fromCharCode(10)}${subtitleText}${String.fromCharCode(10, 10)}`;
        }
    });
}

//Функція для виконання генерації субтитрів
function generateSub() {
    parseEnteredText(); // виконуємо фунцію для розпарсювання введеного тексту
    // console.log(scatteredDataArray);
    if (MethodSwitch === 'sbv') { //Якщо значення перемикача методів "sbv"
        generateSBV(); //виконуємо функцію для генерації структури SBV - файлу
    } else if (MethodSwitch === 'srt') { //Якщо значення перемикача методів "srt"
        generateSRT(); //виконуємо функцію для генерації структури SRT - файлу
    }
     // виконуємо функцію для генерації структури SRT - файлу
    textareaOutputEl.textContent = subtitleContainer; //отриманий текст структури субтитрів з контейнера для зберігання субтитрів додаємо як контент в елемент для виводу тексту з внутрішньою структурою субтитрів для відображення на сторінці
    // console.log(dataСontainer.charCodeAt(0));
    buttonCopyEl.textContent = 'копіювати'; //міняємо текстовий контент кнопки копіювання на "копіювати" 
}
    if (buttonCopyEl.disabled) { //якщо в елемента кнопки копіювання додано атрибут "disabled"
        buttonCopyEl.removeAttribute('disabled'); //видаляємо його
    }


const choseSbvEl = document.querySelector('.js-choose-sbv-format');  //Знаходимо радіокнопку для вибору методу генерації sbv формату
const addSbvMark = () => { //Функція яка додає значення "sbv"  в перемикач методів
    MethodSwitch = 'sbv';
}
choseSbvEl.addEventListener('change', addSbvMark); //чіпляємо слухач на радіокнопку для вибору методу генерації sbv формату, який при виборі цієї кнопки виконує функцію по додаванню значення "sbv"  в перемикача методів 
// console.log(choseSbvEl);
const choseSrtEl = document.querySelector('.js-choose-srt-format');  //Знаходимо радіокнопку для вибору методу генерації srt формату
const addSrtMark = () => { ////Функція яка додає значення "srt"  в перемикач методів 
    MethodSwitch = 'srt';
}
choseSrtEl.addEventListener('change', addSrtMark); //чіпляємо слухач на радіокнопку для вибору методу генерації sbv формату, який при виборі цієї кнопки виконує функцію по додаванню значення "srt"  в перемикача методів

/*-------Додавання в буфер обміну----------*/

buttonCopyEl.addEventListener('click', () => {navigator.clipboard.writeText(subtitleContainer) //Чіпляємо слухач на кнопку копіювання, який виконує функцію копіювання тексту згенерованих субтитрів в буфер обміну
  .then(() => {
      buttonCopyEl.textContent = 'готово'; //Якщо операція успішна то міняємо текстовий контент кнопки копіювання з "копіювати" на "готово"
  })
  .catch(err => {
    console.log('copy error', err); //якщо копіювання не вдалося то виводимо текст повідомлення про помилку в консоль
  });
});
  





