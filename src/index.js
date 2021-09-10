let addToy = false;

const clearToys = () => {

  for (const div of document.getElementsByClassName("card")) {
    div.remove();
  }
}
const handleToyForm = (form) => {
  form.addEventListener("submit", e => {
    event.preventDefault();
    const toy = {
      name: e.target[0].value,
      image: e.target[1].value,
      likes: 1
    }
    const configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(toy)
    }
    fetch("http://localhost:3000/toys", configObj).
    then(resp => resp.json()).
    then(json => {
      console.log(json);
      alert(`${json.name} was created succesfully!`);
      clearToys();
      getExistingToys();
      }).catch(error => alert(error.message))
  })
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = toyFormContainer.children[0];
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  
  handleToyForm(toyForm);
  getExistingToys();

});

const likeButtonClicked = () => {
  const div = event.currentTarget.parentElement;
  const p = div.children[2]
  const currentLikes = parseInt(p.innerText.split(" ")[0], 10);
  const configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ likes: currentLikes + 1
    })
  }
  fetch(
  `http://localhost:3000/toys/${div.getAttribute('data-id')}`,
  configObj)
  .then(resp => resp.json())
  .then(json => {
    p.innerText = `${json.likes} likes.`;
    alert(`${json.name} has ${json.likes} likes now`);
  })


}

const createToyCards = (toys) => {
  for (const toy of toys) {
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    const img = document.createElement('img');
    const p = document.createElement('p'); 
    const likeBtn = document.createElement("button");
    div.classList.add("card");
    div.setAttribute('data-id', `${toy.id}`);
    div.style.border = "thin solid #00000F";
    img.src = toy.image;
    img.classList.add("toy-avatar");
    h2.innerText = `${toy.name}`;
    p.innerText = `${toy.likes} likes.`;
    likeBtn.innerText = "Like <3";
    likeBtn.classList.add("like-btn");
    likeBtn.addEventListener("click", likeButtonClicked)
    div.appendChild(img);
    div.appendChild(h2);
    div.appendChild(p);
    div.appendChild(likeBtn);
    document.getElementById("toy-collection").appendChild(div);
  }
}

const getExistingToys = () => {
  fetch("http://localhost:3000/toys").
  then(resp => resp.json()).
  then(json => createToyCards(json)).
  catch(error => console.log(error.message));
}