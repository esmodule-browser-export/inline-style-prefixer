var caniuse = require('caniuse-api')
var searchMap = require('./searchMap')
var fs = require('fs')

var browsers = ['chrome', 'safari', 'firefox', 'opera', 'ie', 'ios_saf', 'android', 'and_chr', 'and_uc', 'op_mini', 'ie_mob']

function gatherInformation() {
  var prefixProperties = {}
  browsers.forEach(browser => {
    prefixProperties[browser] = {}
  })

  var search
  for (search in searchMap) {
    var properties = searchMap[search]
    var versions = caniuse.getSupport(search, true);
    if (properties instanceof Array !== true) {
      properties = [properties]
    }
    properties.forEach(prop => {
      var prefix
      for (prefix in prefixProperties) {
        prefixProperties[prefix][prop] = versions[prefix].x
      }
    })
  }
  return 'var caniuseData = ' + JSON.stringify(prefixProperties) + '; module.exports = caniuseData';
}

fs.writeFile('./caniuseData.js', gatherInformation(), function (err){
  if (err) throw err
  console.log("Successfully generated CSS property vendor-prefix data using latest caniuse.com data.")
  console.log("Support following browser: ", browsers.join(', '))
})