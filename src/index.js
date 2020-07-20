import style from './style.scss';

const { document } = global;

// Example 1
// function BucketListLS() {
//   this.name = 'BUCKETLIST_LS';
//   this.localStorage = global.localStorage;
//   this.getItem = () => this.localStorage.getItem(this.name);
//   this.setItem = (data) => this.localStorage.setItem(this.name, data);
// }

// Example 2
const bucketListLS = {
  name: 'BUCKETLIST_LS',
  localStorage: global.localStorage,
  getItem() {
    return this.localStorage.getItem(this.name);
  },
  setItem(data) {
    return this.localStorage.setItem(this.name, data);
  },
};

const updateBucketList = (bucketListData) => {
  // new BucketListLS().setItem(JSON.stringify(bucketListData));
  bucketListLS.setItem(JSON.stringify(bucketListData));
};

const getItemIdx = (childEl) => [...childEl.parentNode.children].indexOf(childEl);

const clickBtnDelItemHandler = (bucketListData, e) => {
  e.stopPropagation();
  const { tagName } = e.target;
  if (tagName !== 'BUTTON') return;
  e.preventDefault();

  const data = bucketListData;
  const btnDelItem = e.target;
  const li = btnDelItem.parentNode;
  const idx = getItemIdx(li);

  li.remove();

  data.root.splice(idx, 1);
  updateBucketList(data);
};

const changeChkboxHandler = (bucketListData, e) => {
  e.stopPropagation();
  const { tagName, type } = e.target;
  if (tagName !== 'INPUT' || type !== 'checkbox') return;
  e.preventDefault();

  const data = bucketListData;
  const chkbox = e.target;
  const li = chkbox.parentNode;
  const idx = getItemIdx(li);

  if (chkbox.checked) {
    li.classList.add(style.checked);
    data.root[idx].isCompleted = true;
  } else {
    li.classList.remove(style.checked);
    data.root[idx].isCompleted = false;
  }

  updateBucketList(data);
};

const addItemToList = (item, list, reverse = false) => {
  if (reverse) {
    list.insertBefore(item, list.childNodes[0]);
  } else {
    list.appendChild(item);
  }
};

const createListItem = (bucketItem) => {
  const { text, isCompleted } = bucketItem;
  const li = document.createElement('li');

  const chkbox = document.createElement('input');
  chkbox.setAttribute('type', 'checkbox');
  li.appendChild(chkbox);
  if (isCompleted) {
    chkbox.checked = true;
    li.classList.add(style.checked);
  }

  const p = document.createElement('p');
  p.textContent = text;
  li.appendChild(p);

  const btnDelItem = document.createElement('button');
  btnDelItem.textContent = 'Delete';
  li.appendChild(btnDelItem);

  return li;
};

const renderItem = (bucketItem, ul, reverse = false) => {
  const li = createListItem(bucketItem);
  addItemToList(li, ul, reverse);
};

const clickBtnAddItemHandler = (bucketListData, e) => {
  e.preventDefault();

  const input = document.querySelector('.js-text-input');
  const text = input.value;
  if (text === '') return;

  const bucketItem = {
    text,
    createdDate: new Date().toISOString(),
    isCompleted: false,
  };
  bucketListData.root.unshift(bucketItem);

  const ul = document.querySelector('.js-list');
  renderItem(bucketItem, ul, true);
  updateBucketList(bucketListData);
  input.value = '';
};

const keyUpInputHandler = (e) => {
  const addingBtn = document.querySelector('.js-btn--add');
  // Number 13 is the "Enter" key on the keyboard
  if (e.keyCode === 13) {
    e.preventDefault();
    addingBtn.click();
  }
};

const init = () => {
  const input = document.querySelector('.js-text-input');
  input.addEventListener('keyup', keyUpInputHandler);

  const btnAddItem = document.querySelector('.js-btn--add');
  // const bucketListData = JSON.parse(new BucketListLS().getItem()) || { root: [] };
  const bucketListData = JSON.parse(bucketListLS.getItem()) || { root: [] };

  btnAddItem.addEventListener('click', clickBtnAddItemHandler.bind(btnAddItem, bucketListData));

  const ul = document.querySelector('.js-list');
  ul.addEventListener('change', changeChkboxHandler.bind(ul, bucketListData));
  ul.addEventListener('click', clickBtnDelItemHandler.bind(ul, bucketListData));
  bucketListData.root.forEach((bucketItem) => {
    renderItem(bucketItem, ul);
  });
};

document.addEventListener('DOMContentLoaded', init);
