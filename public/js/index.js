const $addBtn = document.querySelector('.add-btn')
const $list = document.querySelector('.list')

$addBtn.addEventListener('click', function (e) {
  const val = document.querySelector('.input').value
  if (!val) return
  fetch('/add', {
    method: 'POST',
    body: JSON.stringify({ content: val }),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(function (res) {
    return res.json()
  }).then(function (res) {
    const { id, content } = res
    const item = `
      <li>${content}
        <button class="btn del-btn" data-id="${id}" type="button">删除</button>
      </li>
    `
    $list.innerHTML = item + $list.innerHTML
  }).catch(function (err) {
    console.error('Error: ', err)
  })
})

$list.addEventListener('click', function (e) {
  if (e.target.nodeName.toLowerCase() === 'button') {
    const id = e.target.getAttribute('data-id')
    fetch('/delete/' + id, {
      method:'DELETE'
    }).then(function (res) {
      $list.removeChild(e.target.parentNode)
    }).catch(function (err) {
      console.error('Error: ', err)
    })
  }
})