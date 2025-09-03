import { useState, useEffect, useRef, useMemo,useCallback } from 'react';
import Button from '../button/Button';
import MoreMenu from '../moreMenu/MoreMenu';
import calcStyles from './Calculator.module.scss';

function Calculator({ heading }) {
  const [firstNumber, setFirstNumber] = useState(null);
  const [operator, setOperator] = useState(null);
  const [rawInput, setRawInput] = useState('');
  const [shouldClear, setShouldClear] = useState(false);
  const [isMoreVisible, setIsMoreVisible] = useState(false);

  const inputRef = useRef();
  const stateRef = useRef({ rawInput, firstNumber, operator });

  useEffect(()=> {
    stateRef.current = { rawInput, firstNumber, operator };
  }, [rawInput, firstNumber, operator])

  const formatResult = useCallback((num, decimals = 2) => {
    const fixedNum = num.toFixed(decimals);
    let [intPart, decimalPart] = fixedNum.split('.');
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return decimalPart ? `${intPart}.${decimalPart}` : intPart;
  }, []);

  const formatInput = (input) => {
    let [intPart, decimalPart] = input.split('.');
    intPart = intPart.replace(/\s+/g, '');
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return decimalPart !== undefined ? `${intPart}.${decimalPart}` : intPart;
  };

  const handleDigit = useCallback((digit) => {
    if (shouldClear) {
      setRawInput('');
      setShouldClear(false);
    }
    if (digit === '0' && rawInput === '0') return;
    setRawInput(rawInput + digit);
  }, [rawInput, shouldClear]);

  const handleOperator = useCallback((op) => {
    if (rawInput !== '') {
      setFirstNumber(parseFloat(rawInput.replace(/\s/g, '')));
      setOperator(op);
      setRawInput('');
    }
  }, [rawInput]);

  const handleResult = useCallback(() => {
    if (rawInput !== '' && firstNumber !== null && operator !== null) {
      const second = parseFloat(rawInput.replace(/\s/g, ''));
      let result = 0;
      switch (operator) {
        case '+':
          result = firstNumber + second;
          break;
        case '-':
          result = firstNumber - second;
          break;
        case '*':
          result = firstNumber * second;
          break;
        case '/':
          result = second !== 0 ? firstNumber / second : NaN; break;
        case '^':
          result = Math.pow(firstNumber, second);
          break;
        case 'mod':
          result = second !== 0 ? firstNumber % second : NaN; break;
        default:
          return;
      }

      setRawInput(isNaN(result) ? 'Error' : formatResult(result));
      setFirstNumber(null);
      setOperator(null);
      setShouldClear(true);
      inputRef.current?.focus();
    }
  }, [rawInput, firstNumber, operator, formatResult]);

  const handleClear = useCallback(() => {
    setRawInput('');
    setFirstNumber(null);
    setOperator(null);
    setShouldClear(false);
    inputRef.current?.focus();
  }, []);

  const handleUnary = useCallback((fn, validate = () => true) => () => {
    const val = parseFloat(rawInput.replace(/\s/g, ''));
    if (rawInput === '' || rawInput === 'Error' || isNaN(val) || !validate(val)) {
      setRawInput('Error');
    } else {
      setRawInput(formatResult(fn(val)));
    }
    setFirstNumber(null);
    setOperator(null);
    setShouldClear(true);
  }, [rawInput, formatResult]);

  const factorial = (n) => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  useEffect(() => {
    const handleKeydown = (e) => {
      const key = e.key;
      const { rawInput, shouldClear  } = stateRef.current;
      if (/\d/.test(key)) handleDigit(key);
      else if (['+', '-', '*', '/', '^', 'mod'].includes(key)) handleOperator(key);
      else if (key === 'Enter') handleResult();
      else if (key === 'Backspace') setRawInput(rawInput.slice(0, -1));
      else if (key === 'Delete') handleClear();
      else if (key === '.' || key === ',') {
        if (shouldClear) {
          setRawInput('0.');
          setShouldClear(false);
        } else if (!rawInput.includes('.')) {
          setRawInput(rawInput + '.');
        }
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [rawInput, firstNumber, operator, shouldClear, handleDigit, handleOperator, handleResult, handleClear]);

  const buttons = useMemo(() => [
    { label: '1', onClick: () => handleDigit('1'), className: calcStyles.btn__num },
    { label: '2', onClick: () => handleDigit('2'), className: calcStyles.btn__num },
    { label: '3', onClick: () => handleDigit('3'), className: calcStyles.btn__num },
    { label: '+', onClick: () => handleOperator('+'), className: calcStyles.btn__oper },
    { label: '4', onClick: () => handleDigit('4'), className: calcStyles.btn__num },
    { label: '5', onClick: () => handleDigit('5'), className: calcStyles.btn__num },
    { label: '6', onClick: () => handleDigit('6'), className: calcStyles.btn__num },
    { label: '-', onClick: () => handleOperator('-'), className: calcStyles.btn__oper },
    { label: '7', onClick: () => handleDigit('7'), className: calcStyles.btn__num },
    { label: '8', onClick: () => handleDigit('8'), className: calcStyles.btn__num },
    { label: '9', onClick: () => handleDigit('9'), className: calcStyles.btn__num },
    { label: '*', onClick: () => handleOperator('*'), className: calcStyles.btn__oper },
    { label: '.', onClick: () => {
        if (shouldClear) {
          setRawInput('0.');
          setShouldClear(false);
        } else if (!rawInput.includes('.')) {
          setRawInput(rawInput + '.');
        }
      }, className: calcStyles.btn__dot },
    { label: '0', onClick: () => handleDigit('0'), className: calcStyles.btn__num },
    { label: 'C', onClick: () => handleClear(), className: calcStyles.btn__cancel },
    { label: '/', onClick: () => handleOperator('/'), className: calcStyles.btn__oper },
  ], [rawInput, shouldClear, handleDigit, handleOperator, handleClear]);

  const moreOperations = useMemo(() => [
    { label: '%', onClick: handleUnary((x) => x /100)},
    { label: '√', onClick: handleUnary((x) => Math.sqrt(x), (x) => x >= 0) },
    { label: '∛', onClick: handleUnary((x) => Math.cbrt(x))},
    { label: '^', onClick: () => handleOperator('^'), className: calcStyles.btn__oper },
    { label: 'x²', onClick: handleUnary((x) => Math.pow(x, 2)) },
    { label: 'x³', onClick: handleUnary((x) => Math.pow(x, 3)) },
    { label: 'mod', onClick: () => handleOperator('mod'), className: calcStyles.btn__oper },
    { label: 'exp', onClick: handleUnary((x) => Math.exp(x)) },
    { label: 'abs', onClick: handleUnary((x) => Math.abs(x)) },
    { label: '±', onClick: handleUnary((x) => -x) },
    { label: 'log', onClick: handleUnary((x) => Math.log10(x), (x) => x > 0) },
    { label: 'ln', onClick: handleUnary((x) => Math.log(x), (x) => x > 0) },
    { label: '!', onClick: handleUnary(factorial, (x) => x >= 0 && Number.isInteger(x))},
    { label: 'sin', onClick: handleUnary((x) => Math.sin(x)) },
    { label: 'cos', onClick: handleUnary((x) => Math.cos(x)) },
    { label: 'tan', onClick: handleUnary((x) => Math.tan(x)) },
    { label: 'asin', onClick: handleUnary((x) => Math.asin(x)) },
    { label: 'acos', onClick: handleUnary((x) => Math.acos(x)) },
    { label: 'atan', onClick: handleUnary((x) => Math.atan(x)) },
  ], [handleUnary]);

  return (
    <>
      <h1 className={calcStyles.heading}>{heading}</h1>
      <div className={calcStyles.main_calc__container}>
        <div className={calcStyles.main__container}>
          <input
            type="text"
            value={formatInput(rawInput)}
            readOnly
            className={calcStyles.result}
            ref={inputRef}
          />
          {buttons.map((btn) => (
            <Button
              key={btn.label}
              label={btn.label}
              onClick={btn.onClick}
              className={`${calcStyles.btn} ${btn.className || ''}`}
            />
          ))}
          <Button label="=" onClick={handleResult} className={`${calcStyles.btn} ${calcStyles.btn__result}`} />
        </div>
        <div className={calcStyles.more__container}>
          <Button
            label="More"
            onClick={() => setIsMoreVisible(!isMoreVisible)}
            className={`${calcStyles.btn} ${calcStyles.btn__more} ${isMoreVisible ? calcStyles.active : ''}`}
          />
          <MoreMenu items={moreOperations} isVisible={isMoreVisible} className="more__operations" />
        </div>
      </div>
    </>
  );
}

export default Calculator;