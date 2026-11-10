
const dropdowns=document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
   const base = fromCurr.value.toLowerCase();
    const quote = toCurr.value.toLowerCase();
    const api = "https://api.frankfurter.dev";
   try {
        const response = await fetch(`${api}/v2/rate/${base}/${quote}`);
        const data = await response.json();
        const rate = data.rate || (data.rates ? data.rates[toCurr.value.toUpperCase()] : null);
        if (!rate) {
            throw new Error("Rate not found in API response");
        }
        const finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value.toUpperCase()} = ${finalAmount} ${toCurr.value.toUpperCase()}`;
    } catch (error) {
        msg.innerText = "Exchange rate unavailable.";
        console.error("Error fetching exchange rate:", error);
    }    
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};
btn.addEventListener("click", async(evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});



