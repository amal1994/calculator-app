import React, { useState } from "react";

import Content from "../../components/Content";
import Screen from "../../components/Display";
import ButtonGrid from "../../components/ButtonGrid";
import Button from "../../components/Button";
import { toLocaleString, isFloat, removeSpaces } from "../../helpers/utility";
import { evaluate } from "mathjs";

const btnValues = [
  ["AC", "C", "%", "/"],
  [7, 8, 9, "*"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [".", 0, "( )", "="],
];

const Calculator = () => {
  let [calc, setCalc] = useState({
    sign: "",
    num: 0,
    res: "",
    display: "",
    expression: "",
    bracket: "(",
  });

  const numClickHandler = (e) => {
    e.preventDefault();
    const { expression } = calc;
    const value = e.target.innerHTML;
    const finalNumValue =
      calc.num === 0 && value === "0"
        ? "0"
        : removeSpaces(calc.num) % 1 === 0
        ? toLocaleString(Number(removeSpaces(calc.num + value)))
        : toLocaleString(calc.num + value);
    let finalExpressionValue;
    if (calc.num === 0 && value === "0") {
      finalExpressionValue = "0";
    } else {
      finalExpressionValue = expression + value;
    }
    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num: finalNumValue,
        res: !calc.sign ? 0 : calc.res,
        expression: finalExpressionValue,
      });
    }
  };

  const comaClickHandler = (e) => {
    e.preventDefault();
    const { expression } = calc
    const value = e.target.innerHTML;
    const lastDigitOfExpression = expression[expression.length - 1];
    if(lastDigitOfExpression!=="."){
      setCalc({
        ...calc,
        expression: expression+value
      });
    }
  };

  const signClickHandler = (e) => {
    const { expression } = calc;
    const sign = e.target.innerHTML;
    setCalc({
      ...calc,
      sign,
      res: !calc.res && calc.num ? calc.num : calc.res,
      num: 0,
      expression: expression + sign,
    });
  };

  const getResult = (calc) => {
    const { expression } = calc;
    // handle invaid division
    if (calc.num === "0" && calc.sign === "/") {
      return "Can't divide with 0";
    }
    const lastDigitOfExpression = expression[expression.length - 1];
    if (!isNaN(lastDigitOfExpression) || lastDigitOfExpression===")") {
      const result = evaluate(expression);
      if (isFloat(result)) {
        return result.toFixed(4);
      } else {
        return result;
      }
    }
  };

  // final calcultion handler
  const equalsClickHandler = () => {

    const result = getResult(calc);
    setCalc({
      ...calc,
      res: result,
      display: result,
      sign: "",
      num: 0,
    });
  };

  // bracket functionality handler, close bracket will not come unless there is a number inside
  const bracketHandler = () => {
    const { expression, bracket } = calc;

    const lastDigitOfExpression = expression[expression.length - 1];

    if (bracket === "(") {
      setCalc({
        ...calc,
        expression: expression + bracket,
        bracket:")"
      });
    }
    if (bracket === ")") {
      if (!isNaN(lastDigitOfExpression)) {
        setCalc({
          ...calc,
          expression: expression + bracket,
          bracket:"("
        });
      }
    }
  };

  // full reset handler on click of AC
  const resetClickHandler = () => {
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: "",
      expression: "",
    });
  };

  // delete character one by one
  const deleteCharHandler = () => {
    const { expression } = calc;
    if (expression.length > 1) {
      setCalc({
        ...calc,
        expression: expression.substring(0, expression.length - 1),
      });
    }else{
      resetClickHandler()
    }
  };

  // specific handlers for specific cases
  const getHandler = (btn) => {
    switch (btn) {
      case "AC":
        return resetClickHandler;
      case "=":
        return equalsClickHandler;
      case "( )":
        return bracketHandler;
      case "C":
        return deleteCharHandler;
      case "/":
      case "X":
      case "-":
      case "+":
      case "%":
        return signClickHandler;
      case ".":
        return comaClickHandler;
      default:
        return numClickHandler;
    }
  };

  return (
    <>
      <h1>Calculator</h1>
      <Content>
        <Screen value={calc.expression} />
        <Screen value={calc.display} className="noBorder" />
        <ButtonGrid>
          {btnValues.flat().map((btn, i) => {
            return (
              <Button
                key={i}
                className={btn === "=" ? "result" : ""}
                value={btn}
                onClick={getHandler(btn)}
              />
            );
          })}
        </ButtonGrid>
      </Content>
    </>
  );
};

export default Calculator;
