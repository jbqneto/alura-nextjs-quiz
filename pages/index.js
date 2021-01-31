import styled from 'styled-components';
import db from '../config/db.json';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GithubCorner';
import QuizBackground from '../src/components/QuizBackground';

import { useRouter } from 'next/router';

const QuizContainer = styled.div`
  width: 100%;
  max-width: 350px;
  padding-top: 45px;
  margin: auto 10%;

  @media screen and (max-width: 500px) {
    margin: auto;
    padding: 15px;
  }

`;

export default function Home() {
  const router = useRouter();
  const [name, setName] = React.useState('');

  const submit = (evt) => {
    evt.preventDefault();
    console.log('trying to submit');
    router.push(`/quiz?name=${name}`);
  }

  return (
  <QuizBackground backgroundImage={db.bg}>
    <QuizContainer>
      <Widget>
        <Widget.Header>
          <h1>{db.title}</h1>
        </Widget.Header>
        <Widget.Content>
          <form onSubmit={ submit }>
            <input onChange={({target}) => setName(target.value)} value={name} placeholder="Informe seu nome" />
            <button disabled={name === null || name.length === 0} type="submit">
              Jogar [{name}]
            </button>
          </form>    
        </Widget.Content>
      </Widget>
      <Widget>
        <Widget.Content>
          <h1>Quiz Católico</h1>

          <p>{db.description}</p>
        </Widget.Content>
      </Widget>
      <Footer />
    </QuizContainer>
    <GitHubCorner projectUrl="https://github.com/jbqneto" />
  </QuizBackground>
  );
}
