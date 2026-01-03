flatpickr('.flatpickr', {
    inline: true,
    minDate: '2021-12-01',
    dafaultDate: '2021-12-25',
    showMonths: 1,
});

var selectStateInputEl = d.querySelector('#state');
if (selectStateInputEl) {
    const choices = new Choices(selectStateInputEl);
}

document.addEventListener('DOMContentLoaded', function () {
    var genericExamples = document.querySelectorAll('[data-trigger]');
    for (i = 0; i < genericExamples.length; ++i) {
        var element = genericExamples[i];
        new Choices(element, {
            allowHTML: true,
            placeholderValue: 'This is a placeholder set in the config',
            searchPlaceholderValue: 'This is a search placeholder',
        });
    }
});
