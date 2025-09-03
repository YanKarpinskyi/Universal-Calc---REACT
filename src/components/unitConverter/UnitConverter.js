import { useState } from 'react';
import PropTypes from 'prop-types';
import reverseImg from '../../img/reverse.png';
import Button from '../button/Button'; 
import unitConvStyles from './UnitConverter.module.scss';

function UnitConverter({ heading }) {
  const [activeInput, setActiveInput] = useState('from');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [isMoreVisible, setIsMoreVisible] = useState(false);

  function convertTemperature(value, from, to) {
    if (from === to) return value;
    let tempInC;
    if (from === "°C") tempInC = value;
    else if (from === "°F") tempInC = (value - 32) * 5 / 9;
    else if (from === "K") tempInC = value - 273.15;
    else return NaN;

    if (to === "°C") return tempInC;
    if (to === "°F") return tempInC * 9 / 5 + 32;
    if (to === "K") return tempInC + 273.15;
    return NaN;
  }

  const lengthFactors = { mm: 0.1, cm: 1, m: 100, km: 100000, in: 2.54, ft: 30.48, yd: 91.44, mi: 160934.4 };
  const volumeFactors = { ml: 1, cl: 10, l: 1000, "cm³": 1, "m³": 1e6, tsp: 4.929, tbsp: 14.787, cup: 240, pt: 473.176, "fl-oz": 29.5735, qt: 946.353, gal: 3785.41 };
  const weightFactors = { mg: 0.001, g: 1, kg: 1000, t: 1e6, oz: 28.3495, lb: 453.592 };
  const areaFactors = { mm2: 0.01, cm2: 1, m2: 10000, km2: 1e10, a: 1e6, ha: 1e8, in2: 6.4516, ft2: 929.0304, yd2: 8361.27, Acre: 40468564.224 };

  function convert(value, from, to) {
    const allFactors = { ...lengthFactors, ...volumeFactors, ...weightFactors, ...areaFactors };
    const baseValue = value * allFactors[from];
    return baseValue / allFactors[to];
  }

  const handleUnitClick = (unit) => {
    if (activeInput === 'from') setFromUnit(unit);
    else setToUnit(unit);
  };

  const handleConvert = () => {
    if (!fromValue || !fromUnit || !toUnit) return;
    const val = Number(fromValue.replace(',', '.'));
    if (isNaN(val)) return;

    let converted;
    if (["°C", "°F", "K"].includes(fromUnit) && ["°C", "°F", "K"].includes(toUnit)) {
      converted = convertTemperature(val, fromUnit, toUnit);
    } else {
      converted = convert(val, fromUnit, toUnit);
    }
    setToValue(converted.toString());
  };

  const handleReverse = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const handleCancel = () => {
    setFromValue('');
    setToValue('');
    setFromUnit('');
    setToUnit('');
  };

  const lengthUnits = ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"];
  const volumeUnits = ["ml", "l", "cm³", "m³", "tsp", "tbsp", "cup", "pt", "fl-oz", "gal", "qt", "cl"];
  const weightUnits = ["mg", "g", "kg", "t", "oz", "lb"];
  const areaUnits = ["mm2", "cm2", "m2", "km2", "a", "ha", "in2", "ft2", "yd2", "Acre"];
  const temperUnits = ["°C", "°F", "K"];

  const formatUnit = (u) => {
    if (u.endsWith('2')) return <>{u.slice(0, -1)}<sup>2</sup></>;
    if (u.endsWith('3')) return <>{u.slice(0, -1)}<sup>3</sup></>;
    return u;
  };

  return (
    <>
      <h1 className={unitConvStyles.heading}>{heading}</h1>
      <div className={unitConvStyles.unit_conv__container}>
        <div className={unitConvStyles.unit_inputs__container}>
          <div className={unitConvStyles.input__container}>
            <input
              type="text"
              value={fromValue}
              onFocus={() => setActiveInput('from')}
              onChange={(e) => setFromValue(e.target.value)}
              className={`${unitConvStyles.unit__input} ${unitConvStyles.first__unit}`}
            />
            <label className={unitConvStyles.unit__label}>{fromUnit}</label>
          </div>
          <p>=</p>
          <div className={unitConvStyles.input__container}>
            <input
              type="text"
              value={toValue}
              readOnly
              onFocus={() => setActiveInput('to')}
              className={`${unitConvStyles.unit__input} ${unitConvStyles.second__unit}`}
            />
            <label className={unitConvStyles.unit__label}>{toUnit}</label>
          </div>
        </div>

        <div className={unitConvStyles.unit_conv__values}>
          <div className={`${unitConvStyles.unit__section} ${unitConvStyles.length__section}`}>
            <h2 className={unitConvStyles.unit__heading}>Length</h2>
            {lengthUnits.map(u => <Button key={u} label={formatUnit(u)} onClick={() => handleUnitClick(u)} className={unitConvStyles.btn} />)}
          </div>

          <div className={`${unitConvStyles.unit__section} ${unitConvStyles.volume__section}`}>
            <h2 className={unitConvStyles.unit__heading}>Volume</h2>
            {volumeUnits.map(u => <Button key={u} label={formatUnit(u)} onClick={() => handleUnitClick(u)} className={unitConvStyles.btn} />)}
          </div>

          <div className={`${unitConvStyles.unit__section} ${unitConvStyles.weight__section}`}>
            <h2 className={unitConvStyles.unit__heading}>Weight</h2>
            {weightUnits.map(u => <Button key={u} label={formatUnit(u)} onClick={() => handleUnitClick(u)} className={unitConvStyles.btn} />)}
            <Button label="C" onClick={handleCancel} className={`${unitConvStyles.btn} ${unitConvStyles.btn__cancel}`} />
            <Button label="Convert" onClick={handleConvert} className={`${unitConvStyles.btn} ${unitConvStyles.btn__convert}`} />
            <Button label={<img src={reverseImg} alt="reverse" width="30px" />} onClick={handleReverse} className={`${unitConvStyles.btn} ${unitConvStyles.btn__reverse}`} />
          </div>

          <div className={unitConvStyles.more__container}>
            <Button
              label="More"
              onClick={() => setIsMoreVisible(!isMoreVisible)}
              className={`${unitConvStyles.btn} ${unitConvStyles.btn__more} ${isMoreVisible ? unitConvStyles.active : ''}`}
            />
            {isMoreVisible && (
              <div className={`${unitConvStyles.more__measurements} ${isMoreVisible ? unitConvStyles.active : ''}`}>
                <div className={`${unitConvStyles.unit__section} ${unitConvStyles.area__section}`}>
                  <h2 className={unitConvStyles.unit__heading}>Area</h2>
                  {areaUnits.map(u => <Button key={u} label={formatUnit(u)} onClick={() => handleUnitClick(u)} className={unitConvStyles.btn} />)}
                </div>
                <div className={`${unitConvStyles.unit__section} ${unitConvStyles.temper__section}`}>
                  <h2 className={`${unitConvStyles.unit__heading} ${unitConvStyles.temper__heading}`}>Temperature</h2>
                  {temperUnits.map(u => <Button key={u} label={u} onClick={() => handleUnitClick(u)} className={unitConvStyles.btn} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

UnitConverter.propTypes = {
  heading: PropTypes.string.isRequired
};

export default UnitConverter;
