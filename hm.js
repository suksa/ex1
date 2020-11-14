
history.pushState = ( f => function pushState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushState'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.pushState);

history.replaceState = ( f => function replaceState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replaceState'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.replaceState);

window.addEventListener('popstate',()=>{
    window.dispatchEvent(new Event('locationchange'))
});






function burger() {  
  // URL will change to /plate/burger
  history.pushState( { 
    plate_id: 1, 
    plate: "Burger" 
  }, null, "/plate/burger");

  showPlate("Burger");
}

function sandwich() {  
  // URL will change to /plate/sandwich
  history.pushState( { 
    plate_id: 2, 
    plate: "Sandwich" 
  }, null, "/plate/sandwich");

  showPlate("Sandwich");
}

function fries() {  
  // URL will change to /plate/fries
  history.pushState( { 
    plate_id: 3, 
    plate: "Fries" 
  }, null, "/plate/fries");

  showPlate("Fries");
}

function showPlate(name) {  
  document.getElementById("chosen_plate").innerHTML = name;
}

window.onpopstate = function (event) {  
    console.log(event.state);

  var content = "";
  if(event.state) {
    content = event.state.plate;
  }
  showPlate(content);
}



window.addEventListener('hashchange', function(){
    console.log('hash changed!');
})



window.addEventListener('locationchange', function(){
    console.log('location changed!');
})
