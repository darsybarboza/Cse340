const form = document.querySelector("#updateForm")
form.addEventListener("change", function () {
    const updatBtn = document.querySelector("button")
    updatBtn.removeAttribute("disabled")
})