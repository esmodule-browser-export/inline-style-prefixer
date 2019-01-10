export function capitalizeString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function prefixProperty(prefixProperties, property, style) {
    if (prefixProperties.hasOwnProperty(property)) {
        var newStyle = {};
        var requiredPrefixes = prefixProperties[property];
        var capitalizedProperty = capitalizeString(property);
        var keys = Object.keys(style);
        for (var i = 0; i < keys.length; i++) {
            var styleProperty = keys[i];
            if (styleProperty === property) {
                for (var j = 0; j < requiredPrefixes.length; j++) {
                    newStyle[requiredPrefixes[j] + capitalizedProperty] = style[property];
                }
            }
            newStyle[styleProperty] = style[styleProperty];
        }
        return newStyle;
    }
    return style;
}

export function prefixValue(plugins, property, value, style, metaData) {
    for (var i = 0, len = plugins.length; i < len; ++i) {
        var processedValue = plugins[i](property, value, style, metaData);

        // we can stop processing if a value is returned
        // as all plugin criteria are unique
        if (processedValue) {
            return processedValue;
        }
    }
}

function addIfNew(list, value) {
    if (list.indexOf(value) === -1) {
        list.push(value);
    }
}

export function addNewValuesOnly(list, values) {
    if (Array.isArray(values)) {
        for (var i = 0, len = values.length; i < len; ++i) {
            addIfNew(list, values[i]);
        }
    } else {
        addIfNew(list, values);
    }
}

export function isObject(value) {
    return value instanceof Object && !Array.isArray(value);
}

export function createPrefixer(_ref) {
    var prefixMap = _ref.prefixMap,
        plugins = _ref.plugins;

    return function prefix(style) {
        for (var property in style) {
            var value = style[property];

            // handle nested objects
            if (isObject(value)) {
                style[property] = prefix(value);
                // handle array values
            } else if (Array.isArray(value)) {
                var combinedValue = [];

                for (var i = 0, len = value.length; i < len; ++i) {
                    var processedValue = prefixValue(plugins, property, value[i], style, prefixMap);
                    addNewValuesOnly(combinedValue, processedValue || value[i]);
                }

                // only modify the value if it was touched
                // by any plugin to prevent unnecessary mutations
                if (combinedValue.length > 0) {
                    style[property] = combinedValue;
                }
            } else {
                var _processedValue = prefixValue(plugins, property, value, style, prefixMap);

                // only modify the value if it was touched
                // by any plugin to prevent unnecessary mutations
                if (_processedValue) {
                    style[property] = _processedValue;
                }

                style = prefixProperty(prefixMap, property, style);
            }
        }

        return style;
    };
}

var w = ["Webkit"];
var m = ["Moz"];
var ms = ["ms"];
var wm = ["Webkit", "Moz"];
var wms = ["Webkit", "ms"];
var wmms = ["Webkit", "Moz", "ms"];

const data = {
    plugins: [],
    prefixMap: { "appearance": wm, "textEmphasisPosition": w, "textEmphasis": w, "textEmphasisStyle": w, "textEmphasisColor": w, "boxDecorationBreak": w, "maskImage": w, "maskMode": w, "maskRepeat": w, "maskPosition": w, "maskClip": w, "maskOrigin": w, "maskSize": w, "maskComposite": w, "mask": w, "maskBorderSource": w, "maskBorderMode": w, "maskBorderSlice": w, "maskBorderWidth": w, "maskBorderOutset": w, "maskBorderRepeat": w, "maskBorder": w, "maskType": w, "textDecorationStyle": w, "textDecorationSkip": w, "textDecorationLine": w, "textDecorationColor": w, "userSelect": wmms, "backdropFilter": w, "fontKerning": w, "scrollSnapType": wms, "scrollSnapPointsX": wms, "scrollSnapPointsY": wms, "scrollSnapDestination": wms, "scrollSnapCoordinate": wms, "clipPath": w, "shapeImageThreshold": w, "shapeImageMargin": w, "shapeImageOutside": w, "filter": w, "hyphens": wms, "flowInto": wms, "flowFrom": wms, "breakBefore": wms, "breakAfter": wms, "breakInside": wms, "regionFragment": wms, "writingMode": wms, "textOrientation": w, "tabSize": m, "fontFeatureSettings": w, "columnCount": w, "columnFill": w, "columnGap": w, "columnRule": w, "columnRuleColor": w, "columnRuleStyle": w, "columnRuleWidth": w, "columns": w, "columnSpan": w, "columnWidth": w, "wrapFlow": ms, "wrapThrough": ms, "wrapMargin": ms, "gridTemplateColumns": ms, "gridTemplateRows": ms, "gridTemplateAreas": ms, "gridTemplate": ms, "gridAutoColumns": ms, "gridAutoRows": ms, "gridAutoFlow": ms, "grid": ms, "gridRowStart": ms, "gridColumnStart": ms, "gridRowEnd": ms, "gridRow": ms, "gridColumn": ms, "gridColumnEnd": ms, "gridColumnGap": ms, "gridRowGap": ms, "gridArea": ms, "gridGap": ms, "textSizeAdjust": ["ms", "Webkit"] }
};

export function backgroundClip(property, value) {
    if (typeof value === 'string' && value === 'text') {
        return ['-webkit-text', 'text'];
    }
}

const cursorPrefixes = ['-webkit-', '-moz-', ''];

const cursorValues = {
    'zoom-in': true,
    'zoom-out': true,
    grab: true,
    grabbing: true
};

export function cursor(property, value) {
    if (property === 'cursor' && cursorValues.hasOwnProperty(value)) {
        return cursorPrefixes.map(function (prefix) {
            return prefix + value;
        });
    }
}

const isPrefixedValueRegex = /-webkit-|-moz-|-ms-/

export function isPrefixedValue(value) {
    return typeof value === 'string' && isPrefixedValueRegex.test(value)
}

// http://caniuse.com/#search=cross-fade
const crossFadePrefixes = ['-webkit-', ''];

export function crossFade(property, value) {
    if (typeof value === 'string' && !isPrefixedValue(value) && value.indexOf('cross-fade(') > -1) {
        return crossFadePrefixes.map(function (prefix) {
            return value.replace(/cross-fade\(/g, prefix + 'cross-fade(');
        });
    }
}

var filterPrefixes = ['-webkit-', ''];

export function filter(property, value) {
    if (typeof value === 'string' && !isPrefixedValue(value) && value.indexOf('filter(') > -1) {
        return filterPrefixes.map(function (prefix) {
            return value.replace(/filter\(/g, prefix + 'filter(');
        });
    }
}

var flexValues = {
    flex: ['-webkit-box', '-moz-box', '-ms-flexbox', '-webkit-flex', 'flex'],
    'inline-flex': ['-webkit-inline-box', '-moz-inline-box', '-ms-inline-flexbox', '-webkit-inline-flex', 'inline-flex']
};

export function flex(property, value) {
    if (property === 'display' && flexValues.hasOwnProperty(value)) {
        return flexValues[value];
    }
}

var alternativeValues = {
    'space-around': 'justify',
    'space-between': 'justify',
    'flex-start': 'start',
    'flex-end': 'end',
    'wrap-reverse': 'multiple',
    wrap: 'multiple'
};lib

var alternativeProps = {
    alignItems: 'WebkitBoxAlign',
    justifyContent: 'WebkitBoxPack',
    flexWrap: 'WebkitBoxLines',
    flexGrow: 'WebkitBoxFlex'
};

export function flexboxOld(property, value, style) {
    if (property === 'flexDirection' && typeof value === 'string') {
        if (value.indexOf('column') > -1) {
            style.WebkitBoxOrient = 'vertical';
        } else {
            style.WebkitBoxOrient = 'horizontal';
        }
        if (value.indexOf('reverse') > -1) {
            style.WebkitBoxDirection = 'reverse';
        } else {
            style.WebkitBoxDirection = 'normal';
        }
    }
    if (alternativeProps.hasOwnProperty(property)) {
        style[alternativeProps[property]] = alternativeValues[value] || value;
    }
}

var gradientPrefixes = ['-webkit-', '-moz-', ''];
var gradientValues = /linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient/gi;

export function gradient(property, value) {
    if (typeof value === 'string' && !isPrefixedValue(value) && gradientValues.test(value)) {
        return gradientPrefixes.map(function (prefix) {
            return value.replace(gradientValues, function (grad) {
                return prefix + grad;
            });
        });
    }
}

var imageSetPrefixes = ['-webkit-', ''];

export function imageSet(property, value) {
    if (typeof value === 'string' && !isPrefixedValue(value) && value.indexOf('image-set(') > -1) {
        return imageSetPrefixes.map(function (prefix) {
            return value.replace(/image-set\(/g, prefix + 'image-set(');
        });
    }
}

export function position(property, value) {
    if (property === 'position' && value === 'sticky') {
        return ['-webkit-sticky', 'sticky'];
    }
}

var sizingPrefixes = ['-webkit-', '-moz-', ''];

var sizingProperties = {
    maxHeight: true,
    maxWidth: true,
    width: true,
    height: true,
    columnWidth: true,
    minWidth: true,
    minHeight: true
};
var sizingValues = {
    'min-content': true,
    'max-content': true,
    'fill-available': true,
    'fit-content': true,
    'contain-floats': true
};

export function sizing(property, value) {
    if (sizingProperties.hasOwnProperty(property) && sizingValues.hasOwnProperty(value)) {
        return sizingPrefixes.map(function (prefix) {
            return prefix + value;
        });
    }
}

const uppercasePattern = /[A-Z]/g;
const msPattern = /^ms-/;
const hyphenateStyleNameCache = {};

function hyphenateProperty(string) {
    return string in hyphenateStyleNameCache
        ? hyphenateStyleNameCache[string]
        : hyphenateStyleNameCache[string] = string
            .replace(uppercasePattern, '-$&')
            .toLowerCase()
            .replace(msPattern, '-ms-');
}

var transitionProperties = {
    transition: true,
    transitionProperty: true,
    WebkitTransition: true,
    WebkitTransitionProperty: true,
    MozTransition: true,
    MozTransitionProperty: true
};

var transitionPrefixMapping = {
    Webkit: '-webkit-',
    Moz: '-moz-',
    ms: '-ms-'
};

function transitionPrefixValue(value, propertyPrefixMap) {
    if (isPrefixedValue(value)) {
        return value;
    }

    // only split multi values, not cubic beziers
    var multipleValues = value.split(/,(?![^()]*(?:\([^()]*\))?\))/g);

    for (var i = 0, len = multipleValues.length; i < len; ++i) {
        var singleValue = multipleValues[i];
        var values = [singleValue];
        for (var property in propertyPrefixMap) {
            var dashCaseProperty = hyphenateProperty(property);

            if (singleValue.indexOf(dashCaseProperty) > -1 && dashCaseProperty !== 'order') {
                var prefixes = propertyPrefixMap[property];
                for (var j = 0, pLen = prefixes.length; j < pLen; ++j) {
                    // join all prefixes and create a new value
                    values.unshift(singleValue.replace(dashCaseProperty, transitionPrefixMapping[prefixes[j]] + dashCaseProperty));
                }
            }
        }

        multipleValues[i] = values.join(',');
    }

    return multipleValues.join(',');
}

export function transition(property, value, style, propertyPrefixMap) {
    // also check for already prefixed transitions
    if (typeof value === 'string' && transitionProperties.hasOwnProperty(property)) {
        var outputValue = prefixValue(value, propertyPrefixMap);
        // if the property is already prefixed
        var webkitOutput = outputValue.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function (val) {
            return !/-moz-|-ms-/.test(val);
        }).join(',');

        if (property.indexOf('Webkit') > -1) {
            return webkitOutput;
        }

        var mozOutput = outputValue.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function (val) {
            return !/-webkit-|-ms-/.test(val);
        }).join(',');

        if (property.indexOf('Moz') > -1) {
            return mozOutput;
        }

        style['Webkit' + capitalizeString(property)] = webkitOutput;
        style['Moz' + capitalizeString(property)] = mozOutput;
        return outputValue;
    }
}

var plugins = [backgroundClip, crossFade, cursor, filter, flexboxOld, gradient, imageSet, position, sizing, transition, flex];

var prefix = createPrefixer({
    prefixMap: data.prefixMap,
    plugins: plugins
})

export { prefix }
