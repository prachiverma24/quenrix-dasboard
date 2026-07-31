let a = Number(prompt("Enter First Number"));
let b = Number(prompt("Enter Second Number"));
let operator = prompt("Enter Operator (+, -, *, /)");

let answer;

if (operator == "+") {
    answer = a + b;
}
else if (operator == "-") {
    answer = a - b;
}
else if (operator == "*") {
    answer = a * b;
}
else if (operator == "/") {
    answer = a / b;
}
else {
    answer = "Invalid Operator";
}

document.getElementById("result").innerHTML = answer;