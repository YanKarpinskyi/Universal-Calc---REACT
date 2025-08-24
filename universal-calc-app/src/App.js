import { useState, useEffect, useRef, useMemo } from 'react';
// import logo from './logo.svg';
// import './App.css';
import { images } from './img/imgImports';
import appStyles from './App.module.scss';
import Calculator from './components/calculator/Calculator';
import CurrencyConverter from './components/currencyConverter/CurrencyConverter'
import UnitConverter from './components/unitConverter/UnitConverter';
import Button from './components/button/Button'; 
import btnStyles from './components/button/Button.module.scss';

function App() {
  const [mode, setMode] = useState('calc');
  const [isAnimated, setIsAnimated] = useState(true);

  const animationTimerRef = useRef(null);

  useEffect(() => {
    setIsAnimated(true);
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);

    animationTimerRef.current = setTimeout(() => {
      setIsAnimated(false);
    }, 2000);

    return () => clearTimeout(animationTimerRef.current);
  }, [mode]);

  const signs = useMemo(() => ({
    calc: [
      { id: 'calcTopLeft', src: images.plus },
      { id: 'calcTopRight', src: images.multiple },
      { id: 'calcBottomLeft', src: images.minus },
      { id: 'calcBottomRight', src: images.divide }
    ],
    measurements: [
      { id: 'calcTopRight', src: images.celcium },
      { id: 'calcBottomLeft', src: images.cm }
    ],
    currency: [
      { id: 'calcTopLeft', src: images.usd },
      { id: 'calcBottomRight', src: images.eur }
    ]
  }), []);

  const bodyBg = useMemo(() => ({
    calc: 'linear-gradient(#DFEBED, #7D8CD5)',
    measurements: 'linear-gradient(#DBFBFF, #BEE1EA, #3EA2BE)',
    currency: 'linear-gradient(#BFD9D0, #98A77D)'
  }), []);

  const components = {
    calc: <Calculator heading='Universal Calc' />,
    currency: <CurrencyConverter heading='Currency Converter' />,
    measurements: <UnitConverter heading='Measurement Converter' />
  };

  return (
    <div style={{backgroundImage: bodyBg[mode], height: '100vh'}}>
      <div className='signs__container'>
        {signs[mode].map(sign => (
          <img
            key={sign.id + '-' + mode}
            src={sign.src}
            alt={sign.id}
            className={`${appStyles.design__signs} ${appStyles[sign.id]} ${isAnimated ? appStyles.animate : ""}`}
          />
        ))}
      </div>
      <nav className={appStyles.switch__container}>
        <Button 
          label='Calculator'
          onClick={() => setMode('calc')}
          className={`${btnStyles.switch__btn} ${mode === 'calc' ? btnStyles.switch__btnActive : ''}`}
        />
        <Button 
          label='Measurement Converter'
          onClick={() => setMode('measurements')}
          className={`${btnStyles.switch__btn} ${mode === 'measurements' ? btnStyles.switch__btnActive : ''}`}
        />
        <Button 
          label='Сurrency Converter'
          onClick={() => setMode('currency')}
          className={`${btnStyles.switch__btn} ${mode === 'currency' ? btnStyles.switch__btnActive : ''}`}
        />
      </nav>

      <div className='wrapper'>
        {components[mode]}
      </div>
    </div>
  );
}

export default App;
