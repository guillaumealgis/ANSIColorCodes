#! /bin/bash

set -euo pipefail

CSS_FILE='style.css'
JS_FILE='index.js'

# brew install npm
# npm install -g yuglify
yuglify "${CSS_FILE}"
yuglify "${JS_FILE}"

replace_with_minified() {
    perl -p -i'' -e "s/\Q\"$1\"/\"${1%.*}.min.${1##*.}\"/g" index.html
}

replace_with_minified "${CSS_FILE}"
replace_with_minified "${JS_FILE}"