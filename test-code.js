// Тестовый файл для ветки 'тест'
// Создан для демонстрации работы с GitHub

function greet(name) {
    return `Привет, ${name}! Это тестовая ветка.`;
}

function main() {
    console.log(greet('Мир'));
    console.log('Ветка создана: ' + new Date().toISOString());
}

main();

module.exports = { greet };