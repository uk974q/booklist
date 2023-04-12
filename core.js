const URL = "https://s3.amazonaws.com/api-fun/books.json"

const bookListTemplate = document.querySelector("[book-list-template]")
const bookContainer = document.querySelector("[book-list-container]")
let users = []
let edit = {}
let sortValue = 'date'

// Fetching the data from the api endpoint
fetch(URL)
    .then(res => res.json())
    .then(res =>{
        document.querySelector(".name").textContent = res.data.author
        document.querySelector(".bday").textContent = res.data.birthday
        document.querySelector(".place").textContent = res.data.birthPlace
        createTemplates(res.data.books, sortValue)
})

// Sort Utility function based on date or title
function sort(data, key){
    if(key === 'title'){
        return data.sort((a,b) => a[key].toUpperCase().localeCompare(b[key].toUpperCase()))
    }else{
        return data.sort((a,b) => +a["PublishDate"] - (+b["PublishDate"]))
    }
}

//Sort data and create template
function createTemplates(data){
    users = sort(data, sortValue)
    bookContainer.innerHTML = '';
    users.forEach((el,i) => {
        const book = bookListTemplate.content.cloneNode(true).children[0]
        book.setAttribute("data-value", i);
        const image =book.querySelector("[data-image]")
        const title =book.querySelector("[data-title]")
        const pdate =book.querySelector("[data-date]")
        const modifyButton = book.querySelector("[data-modify]")
        const deleteButton = book.querySelector("[data-delete]")
        image.setAttribute("src", el.imageUrl);
        title.setAttribute("href", el.purchaseLink);
        title.textContent = el.title
        pdate.textContent = el.PublishDate
        modifyButton.setAttribute("data-value", i);
        deleteButton.setAttribute("data-value", i);
        bookContainer.append(book)
    })
}

// Action to add or edit item
function acitonItem(){
    let action = document.querySelector(".modal-action").dataset.action
    let bookName = document.querySelector(".modal-book").value
    let bookYr = document.querySelector(".modal-year").value
    let bookURL = "https://m.media-amazon.com/images/I/91I2ywLs1YL.jpg"
    if(action === 'add'){
        let book = bookListTemplate.content.cloneNode(true).children[0]
        const image = book.querySelector("[data-image]")
        const title = book.querySelector("[data-title]")
        const pdate = book.querySelector("[data-date]")
        image.textContent = bookURL
        title.textContent = bookName
        pdate.textContent = bookYr
        bookContainer.append(book)
        users.push(
            {
                "imageUrl": bookURL,
                "title": bookName,
                "purchaseLink": "https://www.amazon.com/BFG-Roald-Dahl/dp/0142410381/",
                "PublishDate": bookYr
            }
        )
    }
    if(action === 'edit'){
        document.querySelector(`.details[data-value="${edit.id}"] .title`).textContent = bookName
        document.querySelector(`.details[data-value="${edit.id}"] .publish-date`).textContent = bookYr
        users = users.map((el,i) =>{
            if(i === (+edit.id)){
                el.title = bookName
                el.PublishDate = bookYr
            }
            return el
        })
        
    }
    createTemplates(users, sortValue)

}

//Fill the modal with data
function editBook(event){
    edit = {}
    let id = event.target.closest('.add-action').dataset.value
    edit["id"] = id
    edit["title"] = document.querySelector(`.details[data-value="${id}"] .title`).textContent
    edit["yr"] = document.querySelector(`.details[data-value="${id}"] .publish-date`).textContent    
}

// Delete book
function deleteBook(event){
    let id = event.target.closest('.add-action').dataset.value
    document.querySelector(`.details[data-value="${id}"]`).remove()
    users = users.filter((el,i) => i !== (+id))
}

// Listener when the modal shows
document.querySelector('#exampleModal').addEventListener('shown.bs.modal',function(event){
    let action = event.relatedTarget.dataset.action
    document.querySelector(".modal-action").textContent = action.toUpperCase()
    document.querySelector(".modal-action").setAttribute("data-action",action)
    if(action === 'edit'){
        document.querySelector(".modal-book").value = edit["title"]
        document.querySelector(".modal-year").value = edit["yr"]
    }else{
        document.querySelector(".modal-book").value = ""
        document.querySelector(".modal-year").value = ''
    }
})

// Listener for toggle change in sort
document.querySelectorAll('input[name="flexRadioDefault"]').forEach(radioButton => {
    radioButton.addEventListener('change', event => {
      sortValue = event.target.value
      createTemplates(users, sortValue)
    });
  });