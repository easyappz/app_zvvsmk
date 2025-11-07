import React, { useEffect, useState } from 'react';

const MAX_LEN = 16;

function formatForDisplay(value) {
  // Keep as plain string, no thousand separators for easier editing
  const s = String(value);
  if (s.length > MAX_LEN) return s.slice(0, MAX_LEN);
  return s;
}

export default function Calculator() {
  const [current, setCurrent] = useState('0'); // current input as string
  const [prev, setPrev] = useState(null);      // previous value (number | null)
  const [op, setOp] = useState(null);          // operator ('+', '-', '*', '/') | null
  const [overwrite, setOverwrite] = useState(true); // if true, next digit overwrites current

  const isError = current === 'Error';

  const clearAll = () => {
    setCurrent('0');
    setPrev(null);
    setOp(null);
    setOverwrite(true);
  };

  const deleteLast = () => {
    if (isError) return; // require AC after error
    if (overwrite) return; // after result DEL does nothing until new input starts
    if (current.length <= 1 || (current.length === 2 && current.startsWith('-'))) {
      setCurrent('0');
      setOverwrite(true);
    } else {
      setCurrent(current.slice(0, -1));
    }
  };

  const toggleSign = () => {
    if (isError) return; // require AC after error
    if (current === '0') return;
    setCurrent(current.startsWith('-') ? current.slice(1) : '-' + current);
  };

  const appendDigit = (d) => {
    if (isError) return; // require AC after error
    if (!/^[0-9]$/.test(d)) return;
    if (overwrite) {
      setCurrent(d === '0' ? '0' : d);
      setOverwrite(false);
      return;
    }
    if (current.length >= MAX_LEN) return;
    if (current === '0') {
      setCurrent(d); // replace leading 0
    } else {
      setCurrent(current + d);
    }
  };

  const appendDot = () => {
    if (isError) return; // require AC after error
    if (overwrite) {
      setCurrent('0.');
      setOverwrite(false);
      return;
    }
    if (current.includes('.')) return;
    if (current.length >= MAX_LEN) return;
    setCurrent(current + '.');
  };

  const chooseOperator = (nextOp) => {
    if (isError) return; // require AC after error
    // Normalize pretty symbols to internal ones
    const normalized = nextOp === '×' || nextOp === '*' ? '*' : nextOp === '÷' || nextOp === '/' ? '/' : nextOp;

    if (prev === null) {
      setPrev(parseFloat(current));
    } else if (!overwrite && op) {
      const value = compute(prev, parseFloat(current), op);
      if (value === 'Error') {
        setCurrent('Error');
        setPrev(null);
        setOp(null);
        setOverwrite(true);
        return;
      }
      setPrev(value);
      setCurrent(formatForDisplay(value));
    }
    setOp(normalized);
    setOverwrite(true);
  };

  const evaluate = () => {
    if (isError) return; // require AC after error
    if (op === null || prev === null) return;
    const value = compute(prev, parseFloat(current), op);
    if (value === 'Error') {
      setCurrent('Error');
      setPrev(null);
      setOp(null);
      setOverwrite(true);
      return;
    }
    setCurrent(formatForDisplay(value));
    setPrev(null);
    setOp(null);
    setOverwrite(true);
  };

  const compute = (a, b, operator) => {
    if (operator === '+') return a + b;
    if (operator === '-') return a - b;
    if (operator === '*') return a * b;
    if (operator === '/') return b === 0 ? 'Error' : a / b;
    return b;
  };

  // Keyboard shortcuts support
  useEffect(() => {
    const onKeyDown = (e) => {
      const k = e.key;
      if (/^[0-9]$/.test(k)) {
        e.preventDefault();
        appendDigit(k);
      } else if (k === '.') {
        e.preventDefault();
        appendDot();
      } else if (k === '+' || k === '-') {
        e.preventDefault();
        chooseOperator(k);
      } else if (k === '*' || k === 'x' || k === 'X') {
        e.preventDefault();
        chooseOperator('*');
      } else if (k === '/' || k === '÷') {
        e.preventDefault();
        chooseOperator('/');
      } else if (k === 'Enter' || k === '=') {
        e.preventDefault();
        evaluate();
      } else if (k === 'Backspace') {
        e.preventDefault();
        deleteLast();
      } else if (k === 'Escape') {
        e.preventDefault();
        clearAll();
      } else if (k.toLowerCase() === 'n') {
        e.preventDefault();
        toggleSign();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [current, prev, op]);

  const prettyOp = op === '*' ? '×' : op === '/' ? '÷' : op;

  return (
    <div className="calc" role="region" aria-label="Калькулятор" data-easytag="id1-src/components/Calculator.jsx">
      <div className="display" aria-live="polite" aria-atomic="true" data-easytag="id2-src/components/Calculator.jsx">
        <div className="display-prev" data-easytag="id3-src/components/Calculator.jsx">{prev !== null && op ? `${formatForDisplay(prev)} ${prettyOp}` : '\u00A0'}</div>
        <div className="display-current" data-easytag="id4-src/components/Calculator.jsx">{current}</div>
      </div>
      <div className="keys" role="group" aria-label="Клавиши калькулятора" data-easytag="id5-src/components/Calculator.jsx">
        <button className="key key-func" onClick={clearAll} aria-label="Очистить всё" data-easytag="id6-src/components/Calculator.jsx">AC</button>
        <button className="key key-func" onClick={toggleSign} aria-label="Сменить знак" data-easytag="id7-src/components/Calculator.jsx">±</button>
        <button className="key key-func" onClick={deleteLast} aria-label="Удалить символ" data-easytag="id8-src/components/Calculator.jsx">DEL</button>
        <button className="key key-op" onClick={() => chooseOperator('/')} aria-label="Деление" data-easytag="id9-src/components/Calculator.jsx">÷</button>

        <button className="key" onClick={() => appendDigit('7')} aria-label="7" data-easytag="id10-src/components/Calculator.jsx">7</button>
        <button className="key" onClick={() => appendDigit('8')} aria-label="8" data-easytag="id11-src/components/Calculator.jsx">8</button>
        <button className="key" onClick={() => appendDigit('9')} aria-label="9" data-easytag="id12-src/components/Calculator.jsx">9</button>
        <button className="key key-op" onClick={() => chooseOperator('*')} aria-label="Умножение" data-easytag="id13-src/components/Calculator.jsx">×</button>

        <button className="key" onClick={() => appendDigit('4')} aria-label="4" data-easytag="id14-src/components/Calculator.jsx">4</button>
        <button className="key" onClick={() => appendDigit('5')} aria-label="5" data-easytag="id15-src/components/Calculator.jsx">5</button>
        <button className="key" onClick={() => appendDigit('6')} aria-label="6" data-easytag="id16-src/components/Calculator.jsx">6</button>
        <button className="key key-op" onClick={() => chooseOperator('-')} aria-label="Вычитание" data-easytag="id17-src/components/Calculator.jsx">−</button>

        <button className="key" onClick={() => appendDigit('1')} aria-label="1" data-easytag="id18-src/components/Calculator.jsx">1</button>
        <button className="key" onClick={() => appendDigit('2')} aria-label="2" data-easytag="id19-src/components/Calculator.jsx">2</button>
        <button className="key" onClick={() => appendDigit('3')} aria-label="3" data-easytag="id20-src/components/Calculator.jsx">3</button>
        <button className="key key-op" onClick={() => chooseOperator('+')} aria-label="Сложение" data-easytag="id21-src/components/Calculator.jsx">+</button>

        <button className="key key-zero" onClick={() => appendDigit('0')} aria-label="0" data-easytag="id22-src/components/Calculator.jsx">0</button>
        <button className="key" onClick={appendDot} aria-label="Десятичная точка" data-easytag="id23-src/components/Calculator.jsx">.</button>
        <button className="key key-eq" onClick={evaluate} aria-label="Равно" data-easytag="id24-src/components/Calculator.jsx">=</button>
      </div>
    </div>
  );
}
