import "./styles.css";
import { pokemons, stagetwo, stagethree } from "./Pokemons.js";
import React, { children } from "react";

import pokeball from "../public/pokeball.png";
import { useState, useRef, useEffect } from "react";

export default function App() {
  const [name, setName] = useState("your name");

  const [selectedPokemon, setSelectedPokemon] = useState(pokemons[0]);

  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(false);

  const [stage, setStage] = useState(1);

  const [response, setResponse] = useState(false);

  const [difficulty, setDifficulty] = useState(1);

  const [randomInt, setRandomInt] = useState(null);
  const [randomIntTwo, setRandomIntTwo] = useState(null);

  const [problemAnswer, setProblemAnswer] = useState(null);

  useEffect(() => {
    const randomInt = Math.floor(Math.random() * 12 + 1);
    const randomIntTwo = Math.floor(Math.random() * 12 + 1);
    setRandomInt(randomInt);
    setRandomIntTwo(randomIntTwo);

    if (difficulty === 1) {
      setProblemAnswer(randomInt + randomIntTwo);
    } else if (difficulty === 2) {
      setProblemAnswer(randomInt - randomIntTwo);
    } else if (difficulty === 3) {
      setProblemAnswer(randomInt * randomIntTwo);
    }

    console.log(randomInt, randomIntTwo);
  }, [difficulty, selectedPokemon]);

  //the math problem is one math problem behind the actual problem. The problem answer is the math problem one step behind. Rendering order??

  //this is the most annoying problem ever.

  function handleSelection(pokemon) {
    setSelectedPokemon(pokemon);
    setStage(1);
    setAnswer("");
  }

  function handleSubmitAnswer(e) {
    e.preventDefault();

    console.log(randomInt, randomIntTwo);

    setAnswer(e.target.value);
    //console.log(problemAnswer);
    //console.log(answer);

    if (answer === problemAnswer) {
      setCorrect(true);
    }

    setResponse(true);

    setTimeout(() => {
      setResponse(false);
    }, 3500);
    setAnswer("");

    if (stage === 1 && answer === problemAnswer) {
      setSelectedPokemon(stagetwo[selectedPokemon.id - 1]);
      setAnswer("");
      setStage(2);
    } else if (stage === 2 && answer === problemAnswer) {
      setStage(3);
      setSelectedPokemon(stagethree[selectedPokemon.id - 1]);
      setAnswer("");
    }
  }

  let level;

  if (difficulty === 1) {
    level = "Easy";
  } else if (difficulty === 2) {
    level = "Medium";
  } else if (difficulty === 3) {
    level = "Hard";
  }

  return (
    <div className="container">
      <PopUp
        name={name}
        onChange={setName}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
      <SideBar name={name} onSelection={handleSelection} pokemons={pokemons} />
      <Main>
        <Level difficulty={difficulty} setDifficulty={setDifficulty}>
          Level: {level}
        </Level>
        <MainPokemon selectedPokemon={selectedPokemon} stage={stage} />
        <MathProblem
          selectedPokemon={selectedPokemon}
          setSelectedPokemon={setSelectedPokemon}
          answer={answer}
          setAnswer={setAnswer}
          handleSubmitAnswer={handleSubmitAnswer}
          stage={stage}
          setStage={setStage}
          difficulty={difficulty}
          problemAnswer={problemAnswer}
          randomInt={randomInt}
          randomIntTwo={randomIntTwo}
        />
      </Main>
    </div>
  );
}

function PopUp({ name, onChange, difficulty, setDifficulty }) {
  const [isOpen, setIsOpen] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    setIsOpen(false);
  }

  if (isOpen) {
    return (
      <>
        <div className="pop-up" />

        <div className="pop-up-window">
          <label>Type in your name to start playing!</label>
          <form onSubmit={name === "your name" ? null : handleSubmit}>
            <input
              type="text"
              placeholder="What's your Name?"
              onChange={(e) => onChange(e.target.value)}
            />
            <div className="difficulty">
              <div
                onClick={() => setDifficulty(1)}
                className={difficulty === 1 ? "selected" : ""}
              >
                easy
              </div>
              <div
                onClick={() => setDifficulty(2)}
                className={difficulty === 2 ? "selected" : ""}
              >
                medium
              </div>
              <div
                onClick={() => setDifficulty(3)}
                className={difficulty === 3 ? "selected" : ""}
              >
                hard
              </div>
            </div>

            <button
              className="close-button"
              type="submit"
              value="Send"
              disabled={name === "your name" ? true : false}
            >
              {/* why is this reloading the page instead of just disabling the button? */}
              Sumbit
            </button>
          </form>
        </div>
      </>
    );
  } else return null;
}

function SideBar({ name, onSelection, pokemons, selectedPokemon }) {
  const bottom = useRef(null);
  const top = useRef(null);

  const [isBottom, setIsBottom] = useState(false);

  function goToBottom() {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
    setIsBottom(true);
  }

  function goToTop() {
    top.current?.scrollIntoView({ behavior: "smooth" });
    setIsBottom(false);
  }

  return (
    <div className="side-bar">
      <div ref={top} />
      <div className="user">
        <img src={pokeball} style={{ width: "60px" }} />
        <div> {name} </div>
      </div>
      <div className="tabs">
        {pokemons.map((pokemon) => (
          <Littlemons
            pokemons={pokemon}
            key={pokemon.name}
            image={pokemon.littleimg}
            onSelection={onSelection}
            selectedPokemon={selectedPokemon}
          />
        ))}
      </div>
      <Arrow goToBottom={isBottom ? goToTop : goToBottom}>
        {isBottom ? "<" : ">"}
      </Arrow>
      <div ref={bottom}></div>
    </div>
  );
}

function Arrow({ children, goToBottom }) {
  return (
    <div className="arrow">
      <div className="arrow-turned" onClick={goToBottom}>
        {children}
      </div>
    </div>
  );
}

function Level({ children, setDifficulty, difficulty }) {
  return (
    <div
      className="level"
      onClick={() => setDifficulty(difficulty > 2 ? 1 : difficulty + 1)}
    >
      {children}
    </div>
  );
}

function Littlemons({ image, onSelection, pokemons }) {
  return (
    <button onClick={() => onSelection(pokemons)}>
      <img src={image} style={{ width: "160px" }} />
    </button>
  );
}

function Main({ children }) {
  return <div className="main">{children}</div>;
}

function MainPokemon({ selectedPokemon, stage }) {
  return (
    <>
      <img src={selectedPokemon?.image} style={{ width: "300px" }} />
      <div className="solve">
        {stage === 3
          ? `${selectedPokemon.name} is evolved`
          : `Solve the Math Problem to evolve ${selectedPokemon?.name}`}
      </div>
    </>
  );
}

function MathProblem({
  selectedPokemon,
  setSelectedPokemon,
  answer,
  setAnswer,
  handleSubmitAnswer,
  stage,
  setStage,
  difficulty,
  problemAnswer,
  randomInt,
  randomIntTwo,
}) {
  let answered;

  if (answer === problemAnswer) {
    answered = "Good Job!";
  } else if (answer === "") {
    answered = "Submit";
  } else {
    answered = "Nope.";
  }

  function handleReset(e) {
    e.preventDefault();
    setAnswer("");
    setStage(1);
    setSelectedPokemon(pokemons[selectedPokemon.id - 1]);
  }

  return (
    <form onSubmit={handleSubmitAnswer}>
      <div className="math">
        {stage > 2
          ? "You evolved your pokemon!"
          : difficulty === 1
          ? `${randomInt} + ${randomIntTwo} =`
          : difficulty === 2
          ? `${randomInt} - ${randomIntTwo} =`
          : `${randomInt} * ${randomIntTwo} =`}{" "}
        {stage === 3 ? (
          " "
        ) : (
          <input
            key={selectedPokemon.id}
            type="number"
            placeholder="?"
            value={answer}
            onChange={(e) => setAnswer(Number(e.target.value))}
          />
        )}
      </div>
      {stage === 3 ? (
        <button type="submit" value="Send" onClick={handleReset}>
          Reset
        </button>
      ) : (
        <button
          type="submit"
          value="Send"
          {...(!answer ? { disabled: true } : {})}
        >
          {answered}
        </button>
      )}
    </form>
  );
}
