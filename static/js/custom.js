var leftside = true;
var counter = 0;

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
    //var txt = document.createElement("P");
    //txt.innerHTML = "Lorem ipsum dolor sit amet, quo ei simul congue exerci";
    var txtDiv = document.createElement("div");
    txtDiv.innerHTML = '<textarea type="text" placeholder="Write here!" style="border: none;font-size: 16px;width: 100%;padding: 0px;"></textarea>';
    var newDiv3 = document.createElement("div");
    newDiv3.innerHTML = '<form method="post" enctype="multipart/form-data"> \
          <div> \
            <label for="image_upload_'+counter+'">Lisää kuva...</label> \
            <input type="file" id="image_upload_'+counter+'" name="image_upload" accept="image/*" capture="camera"> \
          </div> \
          <div class="preview"> \
            <p>Ei kuvaa lisätty.</p> \
          </div> \
          <div> \
            <button>Lisää</button>\
          </div> \
        </form>';

    newDiv2.appendChild(h2);
    newDiv2.appendChild(txtDiv.firstChild);
    newDiv2.appendChild(newDiv3.firstChild);
    newDiv.appendChild(newDiv2);
    
    var addPostButton = mytimeline.querySelector("#addPostButton");
    mytimeline.removeChild(addPostButton);
    
    mytimeline.appendChild(newDiv);
    mytimeline.appendChild(addPostButton);
    updatePosts();
    counter++;
}

function updatePosts() {
    var posts = document.querySelectorAll('.content');

    posts.forEach( function (post) {

      var input = post.querySelector('input');
      if (input === null) {
        return;
      }
      input.preview = post.querySelector('.preview');
      
      //input.style.opacity = 0;

      input.addEventListener('change', function (e) {
          e.preventDefault();
          
          preview = input.preview;
          
          while (preview.firstChild) {
              preview.removeChild(preview.firstChild);
          }
          
          var curFiles = input.files;
          
          if (curFiles.length === 0) {
              var para = document.createElement('p');
              para.textContent = "Ei tiedostoa valittu.";
              preview.appendChild(para);
          } else {
              if (validFileType(curFiles[0])) {
                  var image = document.createElement('img');
                  image.src = window.URL.createObjectURL(curFiles[0]);
                  preview.appendChild(image);
              }
          }
      });
      
      function validFileType(file) {
          return true;
      }
    });
}

window.addEventListener('DOMContentLoaded', (event) => {
    updatePosts();
});

// LIKE BUTTON
function like(){
    $("span").html(function (i, val) {
        return val * 1 + 1;
    });
}