import { useState, useCallback  } from "react";
import reverseImg from '../../img/reverse.png';
import Button from "../button/Button";
import currConvStyles from "./CurrencyConverter.module.scss";

function CurrencyConverter({ heading }) {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  
  const fetchExchangeRate = useCallback(async (from, to) => {
    const url = `https://v6.exchangerate-api.com/v6/68a0330a5fd59241f60d3d6b/pair/${from}/${to}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch exchange rate");
    const data = await response.json();
    return data.conversion_rate;
  }, []);

  const handleConvert = async () => {
    if (!fromValue || !fromCurrency || !toCurrency) return;

    try {
      const rate = await fetchExchangeRate(
        fromCurrency.toUpperCase(),
        toCurrency.toUpperCase()
      );
      setToValue((Number(fromValue) * rate).toFixed(2));
    } catch (error) {
      console.error("Conversion error:", error);
      setToValue("Error");
    }
  };

  const handleReverse = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const handleCancel = () => {
    setFromCurrency("");
    setToCurrency("");
    setFromValue("");
    setToValue("");
  };

  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "PLN", symbol: "zł" },
    { code: "UAH", symbol: "₴" },
  ];

  return (
    <>
      <h1 className={currConvStyles.heading}>{heading}</h1>

      <section className={currConvStyles.curr_conv__container}>
        <div className={currConvStyles.unit_inputs__container}>
          <div className={currConvStyles.input__container}>
            <input
              type="text"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              className={currConvStyles.unit__input}
            />
            <label>{fromCurrency}</label>
          </div>

          <p>=</p>

          <div className={currConvStyles.input__container}>
            <input
              type="text"
              value={toValue}
              readOnly
              className={currConvStyles.unit__input}
            />
            <label>{toCurrency}</label>
          </div>
        </div>

        <div className={currConvStyles.curr_conv__values}>
          {currencies.map((c) => (
            <div key={c.code} className={currConvStyles.curr__section}>
              <h2 className={currConvStyles.curr__heading}>{c.code}</h2>
              <Button
                label={c.symbol}
                className={currConvStyles.btn}
                onClick={() => {
                  if (!fromCurrency) setFromCurrency(c.code);
                  else setToCurrency(c.code);
                }}
              />
            </div>
          ))}
        </div>

        <div className={currConvStyles.curr_conv__manage}>
          <Button
            label="C"
            className={`${currConvStyles.btn} ${currConvStyles.btn__cancel}`}
            onClick={handleCancel}
          />

          <Button
            label="Convert"
            className={`${currConvStyles.btn} ${currConvStyles.btn__convert}`}
            onClick={handleConvert}
          />

          <Button
            label={<img src={reverseImg} alt="reverse" width="30px" />}
            className={`${currConvStyles.btn} ${currConvStyles.btn__reverse}`}
            onClick={handleReverse}
          />
        </div>
      </section>
    </>
  );
}

export default CurrencyConverter;