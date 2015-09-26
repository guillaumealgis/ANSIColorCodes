(function(){
    'use strict';

    function updateTerm() {
        var exampleString = 'the quick brown fox jumps over the lazy dog';
        var highlightedSubstring = 'quick brown fox jumps';

        var markupAndClasses = currentSelectedMarkup();
        var stylingMarkup = markupAndClasses[0];
        var classes = markupAndClasses[1];

        var resetTag = '</span>';

        var highlightMarkupTag = '<span class="ansi-markup">';
        var resetMarkup = stylingMarkup.length > 0 ? '\\e[0m' : '';
        var stringWithMarkup = exampleString.replace(highlightedSubstring,  highlightMarkupTag + stylingMarkup + resetTag + highlightedSubstring + highlightMarkupTag + resetMarkup + resetTag);
        $('#str-with-markup').html(stringWithMarkup);

        var stylingTag = '<span class="' + classes + '">';
        var stringWithCSS = exampleString.replace(highlightedSubstring, stylingTag + highlightedSubstring + resetTag);
        $('#str-result').html(stringWithCSS);
    }

    function updateColorsPicker() {
        if ($('#weight-toggler .selected').text() == 'bright / bold' &&
            $('#background-toggler .selected').text() == 'foreground') {
            $('.colors li').addClass('bright');
        }
        else {
            $('.colors li').removeClass('bright');
        }

        $('.colors li a').each(function (idx, elt) {
            var $elt = $(elt);
            var colorCode = '';
            if ($('#background-toggler .selected').text() == 'foreground') {
                colorCode = '3';
            }
            else {
                colorCode = '4';
            }
            colorCode += $elt.data('color-code');

            if (colorCode.length < 2) {
                colorCode = '∅';
            }

            $elt.text(colorCode);
        });
    }

    function currentSelectedMarkup() {
        var markupArgs = [];
        var classes = [];

        if ($('#weight-toggler .selected').text() == 'bright / bold') {
            markupArgs.push('1');
            classes.push('bright');
        }

        if ($('#style-toggler .selected').text() == 'underlined') {
            markupArgs.push('4');
            classes.push('underlined');
        }

        var color = currentSelectedColor();
        if (color != null) {
            if ($('#background-toggler .selected').text() == 'foreground') {
                markupArgs.push('3' + color[0]);
                classes.push('foreground-' + color[1]);
            }
            else {
                markupArgs.push('4' + color[0]);
                classes.push('background-' + color[1]);
            }
        }

        if (markupArgs.length <= 0) {
            return ['', '']
        }

        var markup = '\\e[';
        markup += markupArgs.join(';');
        markup += 'm';

        var classesStr = classes.join(' ');

        return [markup, classesStr];
    }

    function currentSelectedColor() {
        var $selectedColor = $('.colors a.selected');
        var selectedColorName = $selectedColor.data('color-name');
        var selectedColorCode = $selectedColor.data('color-code');

        if (selectedColorName == 'none') {
            return null;
        }

        return [selectedColorCode, selectedColorName]
    }

    $('.colors a').on('click', function () {
        $('.colors a').removeClass('selected');
        $(this).addClass('selected');

        updateTerm();
    });

    $('.toggler a').on('click', function () {
        var $this = $(this);
        $this.parent().siblings().children('a').removeClass('selected');
        $(this).addClass('selected');

        updateTerm();
        updateColorsPicker();
    });

    updateTerm();
})();