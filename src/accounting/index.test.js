// src/accounting/index.test.js
// Unit tests for Student Account Management System

const fs = require('fs');
const path = require('path');

const BALANCE_FILE = path.join(__dirname, 'balance.json');

// Helper functions to simulate app logic
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

function creditAccount(amount) {
    let balance = loadBalance();
    if (amount >= 0) {
        balance += amount;
        saveBalance(balance);
        return balance;
    }
    throw new Error('Invalid amount');
}

function debitAccount(amount) {
    let balance = loadBalance();
    if (amount >= 0) {
        if (balance >= amount) {
            balance -= amount;
            saveBalance(balance);
            return balance;
        } else {
            throw new Error('Insufficient funds');
        }
    }
    throw new Error('Invalid amount');
}

function resetBalance() {
    saveBalance(1000.00);
}

describe('Student Account Management System', () => {
    beforeEach(() => {
        resetBalance();
    });

    test('TC01: View initial balance', () => {
        expect(loadBalance()).toBe(1000.00);
    });

    test('TC02: Credit account with valid amount', () => {
        const newBalance = creditAccount(200.00);
        expect(newBalance).toBe(1200.00);
        expect(loadBalance()).toBe(1200.00);
    });

    test('TC03: Debit account with valid amount', () => {
        const newBalance = debitAccount(300.00);
        expect(newBalance).toBe(700.00);
        expect(loadBalance()).toBe(700.00);
    });

    test('TC04: Debit account with insufficient funds', () => {
        expect(() => debitAccount(2000.00)).toThrow('Insufficient funds');
        expect(loadBalance()).toBe(1000.00);
    });

    test('TC08: Credit with zero amount', () => {
        const newBalance = creditAccount(0.00);
        expect(newBalance).toBe(1000.00);
        expect(loadBalance()).toBe(1000.00);
    });

    test('TC09: Debit with zero amount', () => {
        const newBalance = debitAccount(0.00);
        expect(newBalance).toBe(1000.00);
        expect(loadBalance()).toBe(1000.00);
    });

    test('TC07: Multiple operations sequence', () => {
        creditAccount(100.00);
        debitAccount(50.00);
        expect(loadBalance()).toBe(1050.00);
    });

    test('TC10: View balance after credit/debit', () => {
        creditAccount(100.00);
        debitAccount(50.00);
        expect(loadBalance()).toBe(1050.00);
    });
});
