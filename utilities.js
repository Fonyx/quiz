let primaries = ['#FF7F60','#8DA4CF','#F22738','#2E4159','#D93662']
let secondaries = ['#FFB26D','#9EA9CE','#A63247','#51718C','#3A3873']
let tertiaries = ['#FDD272', '#B7B3CC', '#3E3740', '#698FB6', '#04BFAD']
let quaternaries = ['#3EB2A2', '#E2C3CC', '#F2DDD0', '#91B7D9', '#F2AF5C']
let quinaries = ['#385663', '#F8CACC', '#F2F2F2', '#E4E4E4', '#F2695C']

// get the change color button as element
let changeC = document.getElementById('change_color_button');

// add event listener to color change button
changeC.addEventListener('click', shuffleColorScheme);


// change colors in :root dom element
function shuffleColorScheme(){
    // get the style variables in root
    let r = document.querySelector(':root');
    // get the computed style of that element
    let rs = getComputedStyle(r);
    // get the index in the primaries array from the current style value
    let currentIndex = getCurrentPrimaryScheme(rs.getPropertyValue('--primary'));
    // increment
    let newIndex = currentIndex + 1;

    // make sure no overload
    if (newIndex === primaries.length){
        newIndex=0;
    }

    // set all the properties to the new index
    r.style.setProperty('--primary', primaries[newIndex]);
    r.style.setProperty('--secondary', secondaries[newIndex]);
    r.style.setProperty('--tertiary', tertiaries[newIndex]);
    r.style.setProperty('--quaternary', quaternaries[newIndex]);
    r.style.setProperty('--quinary', quinaries[newIndex]);

}

// get current primary value index from color schemes - figure out where the current scheme is in the arrays
function getCurrentPrimaryScheme(colorCode) {
    return primaries.findIndex(x => x === colorCode);
}