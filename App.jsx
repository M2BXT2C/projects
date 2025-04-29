import { useState } from 'react';
import * as math from 'mathjs';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('0');
  const [isScientificMode, setIsScientificMode] = useState(false);
  const [isDegreeMode, setIsDegreeMode] = useState(true); 

  const handleClick = (value) => {
    if (value === '=') {
      try {
        let expression = input
          .replace(/sin\(/g, 'sin(')
          .replace(/cos\(/g, 'cos(')
          .replace(/tan\(/g, 'tan(')
          .replace(/log\(/g, 'log(')
          .replace(/ln\(/g, 'log(')
          .replace(/√\(/g, 'sqrt(')
          .replace(/\^/g, '^')
          .replace(/π/g, 'pi')
          .replace(/e/g, 'e')
          // Convert trigonometric functions based on degree/radian mode
          .replace(/(sin|cos|tan)\(([^)]+)\)/g, (match, func, angle) => {
            return isDegreeMode 
              ? `${func}(${angle} * pi / 180)` // Convert degrees to radians
              : `${func}(${angle})`; // Keep as radians
          });
        
        const calculationResult = math.evaluate(expression);
        setResult(math.format(calculationResult, { precision: 14 }));
      } catch (error) {
        setResult('Error');
      }
      setInput('');
    } else if (value === 'C') {
      setInput('');
      setResult('0');
    } else if (value === '⌫') {
      setInput(input.slice(0, -1));
    } else if (value === '±') {
      setInput(input.startsWith('-') ? input.slice(1) : `-${input}`);
    } else if (value === 'SCI') {
      setIsScientificMode(!isScientificMode);
    } else if (value === 'DEG') {
      setIsDegreeMode(!isDegreeMode);
    } else {
      if (value === '.') {
        const parts = input.split(/[\+\-\*\/]/);
        if (parts[parts.length - 1].includes('.')) {
          return;
        }
      }
      
      if (['sin', 'cos', 'tan', 'log', 'ln', '√'].includes(value)) {
        setInput(input + value + '(');
      } else {
        setInput(input + value);
      }
    }
  };

  const basicButtons = [
    'C', '⌫', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '±', '0', '.', '='
  ];

  const scientificButtons = [
    'sin', 'cos', 'tan', '(',
    'log', 'ln', '√', ')',
    'π', 'e', '^', 'x²',
    'x³', 'x^y', '1/x', '10^x'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        {/* Display */}
        <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 text-right border-b border-gray-800">
          <div className="flex justify-between items-center mb-1">
            <div className="text-gray-400 text-sm">
              {isScientificMode ? 'SCIENTIFIC' : 'STANDARD'} | {isDegreeMode ? 'DEG' : 'RAD'}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsDegreeMode(!isDegreeMode)}
                className='px-3 py-1 rounded-full text-xs font-medium transition-colors bg-amber-600 text-white'
              >
                {isDegreeMode ? 'RAD' : 'DEG'}
              </button>
              <button 
                onClick={() => setIsScientificMode(!isScientificMode)}
                className='px-3 py-1 rounded-full text-xs font-medium transition-colors bg-purple-600 text-white'
              >
                {isScientificMode ? 'BASIC' : 'SCI'}
              </button>
            </div>
          </div>
          <div className="text-gray-400 text-lg h-6 mb-2">{input || '0'}</div>
          <div className="text-white text-5xl font-light truncate">{result}</div>
        </div>
        
        {/* Basic Keypad */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-900">
          {basicButtons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className={`
                h-16 rounded-lg flex items-center justify-center 
                text-2xl font-medium transition-all duration-200
                active:translate-y-1 active:opacity-90 focus:outline-none
                ${btn === '=' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' : 
                  ['+', '-', '*', '/', '%'].includes(btn) ? 'bg-gray-700 hover:bg-gray-600 text-blue-400 shadow-md shadow-gray-800/50' :
                  ['C', '⌫'].includes(btn) ? 'bg-red-500/90 hover:bg-red-600 text-white shadow-md shadow-red-500/20' :
                  'bg-gray-800 hover:bg-gray-700 text-gray-200 shadow-inner'}
              `}
            >
              {btn}
            </button>
          ))}
        </div>
        
        {/* Scientific Keypad - Only shown in scientific mode */}
        {isScientificMode && (
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-800 border-t border-gray-700">
            {scientificButtons.map((btn) => (
              <button
                key={btn}
                onClick={() => handleClick(btn)}
                className={`
                  h-16 rounded-lg flex items-center justify-center 
                  text-xl font-medium transition-all duration-200
                  active:translate-y-1 active:opacity-90 focus:outline-none
                  ${['sin', 'cos', 'tan', 'log', 'ln', '√', '^', '(', ')', 'π', 'e'].includes(btn) ? 
                    'bg-gray-700 hover:bg-gray-600 text-green-400 shadow-md shadow-gray-800/50' :
                    'bg-gray-700 hover:bg-gray-600 text-purple-300 shadow-md shadow-gray-800/50'}
                `}
              >
                {btn}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;