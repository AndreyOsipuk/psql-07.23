// Create a "close" button and append it to each list item
const myNodelist = document.getElementsByTagName("LI");

for (let i = 0; i < myNodelist.length; i++) {
  const span = document.createElement("SPAN");
  const txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
const close = document.getElementsByClassName("close");

for (let i = 0; i < close.length; i++) {
  close[i].onclick = function () {
    var div = this.parentElement;
    div.style.display = "none";
  }
}


// Create a new list item when clicking on the "Add" button
function newElement(inputValue) {
  const li = document.createElement("li");
  const t = document.createTextNode(inputValue);
  li.appendChild(t);
  document.getElementById("myUL").appendChild(li);


  document.getElementById("myInput").value = "";

  const span = document.createElement("SPAN");
  const txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}

fetch('http://localhost:8888/list')
  .then(res => res.json())
  .then(list => drawList(list))


function drawList(list) {
  const ul = document.getElementById("myUL")

  list.forEach(({ id, value, checked }) => {
    const li = document.createElement('li')
    li.setAttribute('list-id', id)
    const t = document.createTextNode(value);
    li.appendChild(t);

    li.onclick = () => changeChecked(id)

    if (checked) {
      li.classList.add('checked');
    }

    const span = document.createElement("SPAN");
    const txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    span.onclick = () => deleteItem(id)
    li.appendChild(span);
    ul.appendChild(li);
  })
}

function deleteItem(id) {
  fetch('http://localhost:8888/list', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  })
  .then(res => res.json())
  .then(({message}) => {
    if(message === 'ok') {
      document.querySelector(`li[list-id="${id}"]`).remove()
    }
  })
}

function create() {
  const inputValue = document.getElementById('myInput').value

  if (inputValue === '') {
    alert("You must write something!");
  } else {
    fetch('http://localhost:8888/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value: inputValue })
    })
      .then(res => res.json())
      .then(({ message }) => {
        if (message === 'ok') {
          newElement(inputValue)
        }
      })
  }
}

function changeChecked(id) {
  const item = document.querySelector(`li[list-id="${id}"]`)

  const checked = item.classList.contains('checked')

  console.log(item, checked)
  fetch('http://localhost:8888/list', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, checked: !checked })
    })
      .then(res => res.json())
      .then(({ message }) => {
        if (message === 'ok') {
          const item = document.querySelector(`li[list-id="${id}"]`)
          item.classList.toggle('checked')
        }
      })
}