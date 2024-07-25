const gulp = require('gulp');
const replace = require('gulp-string-replace');

gulp.task('default', function () {
    return gulp
        .src('./dist/index.html')
        .pipe(replace('lang="ru"', 'lang="en"'))
        .pipe(replace('Проверка колеса мыши онлайн', 'Mouse wheel checker online'))
        .pipe(replace('Сброс', 'Reset'))
        .pipe(replace('проверка колеса мыши', 'test mouse wheel'))
        .pipe(
            replace(
                'Используйте этот онлайн-тест, чтобы быстро проверить колесо вашей мыши',
                'Use this online test to quickly check the functionality of your mouse wheel'
            )
        )
        .pipe(
            replace(
                'Добро пожаловать на сайт для проверки прокрутки колеса мыши! Этот инструмент предназначен для тестирования функциональности колеса прокрутки вашей мыши. Просто запустите проверку и прокручивайте колесо вперед и назад, чтобы убедиться, что оно работает корректно. Мы предлагаем удобный способ проверить, насколько плавно и точно работает прокрутка, чтобы вы могли наслаждаться комфортным использованием мыши.',
                'Welcome to the mouse wheel scrolling test site! This tool is designed to test the functionality of your mouse scroll wheel. Simply start the test and scroll the wheel up and down to ensure it is working correctly. We offer a convenient way to check how smoothly and accurately the scrolling works so you can enjoy comfortable mouse usage.'
            )
        )
        .pipe(gulp.dest('./dist/en/'));
});
