const mailRe =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const cards = document.querySelectorAll(".card");
const progressSegments = document.querySelectorAll(".progress");

const data = {
  q1: [],
  q2: [],
  q3: [],
  name: "",
  surname: "",
  email: "",
};

main();

function main() {
  stepActive(1);
  progressUpdate();
}

function stepActive(number) {
  const card = document.querySelector(`.card[data-step='${number}']`);

  if (!card) {
    return;
  }

  for (const crd of cards) {
    crd.classList.remove("card--active");
  }

  card.classList.add("card--active");

  if (card.dataset.inited) {
    return;
  }

  card.dataset.inited = true;

  if (number === 1) {
    initStep_01();
  } else if (number === 2) {
    initStep_02();
  } else if (number === 3) {
    initStep_03();
  } else if (number === 4) {
    initStep_04();
  } else if (number === 5) {
    initStep_05();
  } else {
    initStep_06();
  }
}

function initStep_01() {
  const card = document.querySelector('.card[data-step="1"]');
  const startButton = card.querySelector(".button[data-action='start']");

  startButton.addEventListener("click", () => stepActive(2));
}

function initStep_02() {
  const card = document.querySelector('.card[data-step="2"]');
  const prevButton = card.querySelector('button[data-action="toPrev"]');
  const nextButton = card.querySelector('button[data-action="toNext"]');
  const variants = card.querySelectorAll("[data-value]");

  nextButton.disabled = true;

  prevButton.addEventListener("click", () => stepActive(1));
  nextButton.addEventListener("click", () => stepActive(3));

  for (const variant of variants) {
    variant.addEventListener("click", variantClickHandler);
  }

  function variantClickHandler() {
    data.q1 = this.dataset.value;

    for (const variant of variants) {
      const radioButton = variant.querySelector('input[type="radio"]');

      radioButton.checked = false;
    }

    const radioButton = this.querySelector('input[type="radio"]');

    radioButton.checked = true;
    nextButton.disabled = false;

    progressUpdate();
  }
}

function initStep_03() {
  const card = document.querySelector('.card[data-step="3"]');
  const prevButton = card.querySelector('button[data-action="prev"]');
  const nextButton = card.querySelector('button[data-action="next"]');
  const variants = card.querySelectorAll("[data-value]");

  prevButton.addEventListener("click", () => stepActive(2));
  nextButton.addEventListener("click", () => stepActive(4));

  nextButton.disabled = true;

  for (const variant of variants) {
    const checkbox = variant.querySelector('input[type="checkbox"]');

    checkbox.checked = false;

    variant.addEventListener("click", variantClickHandler);
  }

  function variantClickHandler() {
    const checkbox = this.querySelector('input[type="checkbox"]');

    if (checkbox.checked) {
      toggleItem(data.q2, this.dataset.value);

      checkbox.checked = false;
    } else {
      toggleItem(data.q2, this.dataset.value);

      checkbox.checked = true;
    }

    nextButton.disabled = !Boolean(data.q2.length);
    progressUpdate();
  }
}

function initStep_04() {
  const card = document.querySelector('.card[data-step="4"]');
  const prevButton = card.querySelector('button[data-action="prev"]');
  const nextButton = card.querySelector('button[data-action="next"]');
  const variants = card.querySelectorAll("[data-value]");

  prevButton.addEventListener("click", () => stepActive(3));
  nextButton.addEventListener("click", () => stepActive(5));

  nextButton.disabled = true;

  for (const variant of variants) {
    variant.classList.remove("variant-square--active");

    variant.addEventListener("click", variantClickHandler);
  }

  function variantClickHandler() {
    toggleItem(data.q3, this.dataset.value);

    if (this.classList.contains("variant-square--active")) {
      this.classList.remove("variant-square--active");
    } else {
      this.classList.add("variant-square--active");
    }

    nextButton.disabled = !Boolean(data.q3.length);
    progressUpdate();
  }
}

function initStep_05() {
  const card = document.querySelector('.card[data-step="5"]');
  const prevButton = card.querySelector('button[data-action="prev"]');
  const nextButton = card.querySelector('button[data-action="next"]');
  const inputs = card.querySelectorAll("input");

  nextButton.disabled = true;

  prevButton.addEventListener("click", () => stepActive(4));
  nextButton.addEventListener("click", () => stepActive(6));

  for (let input of inputs) {
    input.addEventListener("keyup", changeInputHandler);
  }

  function changeInputHandler() {
    const type = this.dataset.field;

    if (type === "name") {
      data.name = this.value;
    } else if (type === "surname") {
      data.surname = this.value;
    } else if (type === "email") {
      data.email = this.value;
    }

    if (
      data.name.length &&
      data.surname.length &&
      data.email.length &&
      mailRe.test(data.email)
    ) {
      nextButton.disabled = false;
    } else {
      nextButton.disabled = true;
    }

    progressUpdate();
  }
}

function initStep_06() {
  const card = document.querySelector('.card[data-step="6"]');
  const text = card.querySelector('span[data-field="email"]');

  text.textContent = data.email;
}

function toggleItem(array, item) {
  const index = array.findIndex((el) => el === item);

  if (index === -1) {
    array.push(item);
  } else {
    array.splice(index, 1);
  }
}

function progressUpdate() {
  let progressValue = 0;

  if (data.q1.length) {
    progressValue += 1;
  }

  if (data.q2.length) {
    progressValue += 1;
  }

  if (data.q3.length) {
    progressValue += 1;
  }

  if (data.name) {
    progressValue += 1;
  }

  if (data.surname) {
    progressValue += 1;
  }

  if (data.email.length && mailRe.test(data.email)) {
    progressValue += 1;
  }

  const progressPercent = (progressValue / 6) * 100;

  for (const progressSegment of progressSegments) {
    const progressElement = progressSegment.querySelector("progress");
    const progressTitle = progressSegment.querySelector(".progress-title");

    progressElement.value = progressPercent;
    progressTitle.textContent = `${Math.ceil(progressPercent)}%`;
    progressTitle.style.width = `${Math.ceil(progressPercent)}%`;

    if (progressPercent) {
      progressTitle.style.display = "";
    } else {
      progressTitle.style.display = "none";
    }
  }
}
