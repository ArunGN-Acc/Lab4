// src/accounting/index.js
// Node.js implementation of the COBOL Student Account Management System

const readline = require('readline');
const fs = require('fs');
const BALANCE_FILE = './balance.json';

function loadBalance() {
    if (!fs.existsSync(BALANCE_FILE)) {
        fs.writeFileSync(BALANCE_FILE, JSON.stringify({ balance: 1000.00 }));
    }
    const data = fs.readFileSync(BALANCE_FILE);
    return JSON.parse(data).balance;
}

function saveBalance(balance) {
    fs.writeFileSync(BALANCE_FILE, JSON.stringify({ balance }));
}

function displayMenu() {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
}

function promptUser(rl, question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let continueFlag = true;
    while (continueFlag) {
        displayMenu();
        const choice = await promptUser(rl, 'Enter your choice (1-4): ');
        let balance = loadBalance();
        switch (choice.trim()) {
            case '1':
                console.log(`Current balance: ${balance.toFixed(2)}`);
                break;
            case '2':
                const credit = parseFloat(await promptUser(rl, 'Enter credit amount: '));
                if (!isNaN(credit) && credit >= 0) {
                    balance += credit;
                    saveBalance(balance);
                    console.log(`Amount credited. New balance: ${balance.toFixed(2)}`);
                } else {
                    console.log('Invalid amount.');
                }
                break;
            case '3':
                const debit = parseFloat(await promptUser(rl, 'Enter debit amount: '));
                if (!isNaN(debit) && debit >= 0) {
                    if (balance >= debit) {
                        balance -= debit;
                        saveBalance(balance);
                        console.log(`Amount debited. New balance: ${balance.toFixed(2)}`);
                    } else {
                        console.log('Insufficient funds for this debit.');
                    }
                } else {
                    console.log('Invalid amount.');
                }
                break;
            case '4':
                continueFlag = false;
                console.log('Exiting the program. Goodbye!');
                break;
            default:
                console.log('Invalid choice, please select 1-4.');
        }
    }
    rl.close();
}

main();
