var leftside = true;

function addPost(){
    //Create parent div on the left or right side of the timeline
    var newDiv = document.createElement("div");
    if(leftside){
        newDiv.setAttribute("class", "container left");
    } else {
        newDiv.setAttribute("class", "container right");
    }
    leftside = !leftside;
    //Create sub parent div
    var newDiv2 = document.createElement("div");
    newDiv2.setAttribute("class", "content");
    //Create post header
    var h2 = document.createElement("h2");
    h2.innerHTML = (new Date()).toLocaleDateString("fi-FI");
    //Create post text
    var txt = document.createElement("P");
    txt.innerHTML = "Lorem ipsum dolor sit amet, quo ei simul congue exerci";

    newDiv2.appendChild(h2);
    newDiv2.appendChild(txt);
    newDiv.appendChild(newDiv2);
    mytimeline.appendChild(newDiv);
}