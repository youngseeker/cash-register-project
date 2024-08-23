const price = 3.26;
const cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

document.getElementById("purchase-btn").addEventListener("click", () => {
    const cash = parseFloat(document.getElementById("cash").value);
    
    if (cash < price) {
        alert("Customer does not have enough money to purchase the item");
        return;
    }

    if (cash === price) {
        document.getElementById("change-due").innerText = "No change due - customer paid with exact cash";
        return;
    }

    const result = checkCashRegister(price, cash, cid);
    document.getElementById("change-due").innerText = `Status: ${result.status} ${result.change ? result.change.map(item => `${item[0]}: $${item[1]}`).join(' ') : ''}`;
});

function checkCashRegister(price, cash, cid) {
    const currencyUnit = [
        ["PENNY", 0.01],
        ["NICKEL", 0.05],
        ["DIME", 0.1],
        ["QUARTER", 0.25],
        ["ONE", 1],
        ["FIVE", 5],
        ["TEN", 10],
        ["TWENTY", 20],
        ["ONE HUNDRED", 100]
    ];
    
    let changeDue = cash - price;
    let totalCid = cid.reduce((acc, curr) => acc + curr[1], 0);
    totalCid = parseFloat(totalCid.toFixed(2));

    if (changeDue > totalCid) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    } else if (changeDue.toFixed(2) === totalCid.toFixed(2)) {
        return { status: "CLOSED", change: cid };
    } else {
        const changeArray = [];
        for (let i = currencyUnit.length - 1; i >= 0; i--) {
            const coinName = currencyUnit[i][0];
            const coinValue = currencyUnit[i][1];
            let coinAmount = cid[i][1];
            let coinToReturn = 0;

            while (changeDue >= coinValue && coinAmount > 0) {
                changeDue -= coinValue;
                changeDue = parseFloat(changeDue.toFixed(2));
                coinAmount -= coinValue;
                coinToReturn += coinValue;
            }

            if (coinToReturn > 0) {
                changeArray.push([coinName, parseFloat(coinToReturn.toFixed(2))]);
            }
        }

        if (changeDue > 0) {
            return { status: "INSUFFICIENT_FUNDS", change: [] };
        } else {
            return { status: "OPEN", change: changeArray };
        }
    }
}
