import styled from 'styled-components';
import { useRouter } from 'next/router';
import React from 'react';

import db from '../config/db.json';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GithubCorner';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import QuizLogo from '../src/components/QuizLogo';
import Button from '../src/components/Button';
import AlternativesForm from '../src/components/AlternativesForm';

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        [Desafio do Loading]
      </Widget.Content>
    </Widget>
  );
}

/**
 * 
 * @param {Array} results 
 */
function ResultWidget({results}) {

  const total = results.reduce((sumTotal, current) => {
    if (current === true) {
      return sumTotal + 1;
    } else {
      return sumTotal;
    }
  }, 0);

  return (
    <Widget>
      <Widget.Header>
        Fim do Quiz!
      </Widget.Header>

      <Widget.Content>
        {total === 0 && <p>Você fez {total} pontos. Estude mais para a próxima!</p>}
        {total > 0 && <p>Parabéns! Você fez {total} pontos!</p>}
      </Widget.Content>
    </Widget>
  );
}

function QuizQuestion({question, totalQuestions, questionIndex, onSubmit, onResult}) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false); 
  const questionId = `question__${questionIndex}`;
  
  let isCorrect = (selectedAlternative === question.answer);
  let isAlternativeSelected = (selectedAlternative !== undefined);

  return (
    <>
      <Widget>
        <Widget.Header>
          <h3>Pergunta {questionIndex + 1 } de {totalQuestions}</h3>
        </Widget.Header>
        <img alt="Descrição" src={question.image} style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover'
        }} />
        <Widget.Content>
          <h2>{question.title}</h2>

          <p></p>

          <AlternativesForm onSubmit={(evt) => {
            evt.preventDefault();
            setIsQuestionSubmited(true);
            setTimeout(() => {
              onResult(isCorrect);
              setSelectedAlternative(undefined);
              setIsQuestionSubmited(false);
              onSubmit();
            }, 3 * 1000);
          }}>
            {question.alternatives.map((alternative, i) => {
              const id = `alternative-${i}`;
              const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
              const isSelected = selectedAlternative === i;

              return (
                <Widget.Topic 
                  data-status={isQuestionSubmited && alternativeStatus} 
                  data-selected={isSelected} 
                  as="label" 
                  key={id}>
                  
                  <input 
                    checked={isSelected} 
                    name={questionId} 
                    type="radio" 
                    id={id} 
                    onChange={() => setSelectedAlternative(i)}/>
                
                  {alternative}
                
                </Widget.Topic>
              );

            })}

          <Button disabled={!isAlternativeSelected} type="submit">
            Confirmar
          </Button>

          {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você ERROU!!!</p>}

          </AlternativesForm>

        </Widget.Content>
      </Widget>
    </>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT'
};

export default function QuizPage() {
  const router = useRouter();
  const name = router.query.name;
  const totalQuestions = db.questions.length;

  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);


  function addResult(result) {
    setResults([...results, result]);
  }

  const handleSubmit = () => {
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      console.log("acaboou");
      setScreenState(screenStates.RESULT);
    }

  }

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 3000);
  }, []);

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        <Widget>
          <Widget.Header>
            <h1>{db.title}</h1>
          </Widget.Header>
          <Widget.Content>
            <p>{`Boa sorte ${name}`}</p>
          </Widget.Content>
        </Widget>

        {screenState === screenStates.LOADING && <LoadingWidget /> }

        {screenState === screenStates.QUIZ && (
          <QuizQuestion 
            questionIndex={currentQuestion} 
            totalQuestions={totalQuestions} 
            onSubmit={handleSubmit}
            onResult={addResult}
            question={db.questions[currentQuestion]} />

        )}
        
        {screenState === screenStates.RESULT && <ResultWidget results={results} /> }
      
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/jbqneto" />
    </QuizBackground>
  );
}
