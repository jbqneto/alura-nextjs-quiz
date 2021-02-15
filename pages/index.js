import styled from 'styled-components';
import { useRouter } from 'next/router';

import db from '../config/db.json';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GithubCorner';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import Input from '../src/components/Input';
import Button from '../src/components/Button';

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
            <Input onChange={({target}) => setName(target.value)} value={name} placeholder="Informe seu nome" />
            <Button disabled={name.length === 0} type="submit">
              Jogar
            </Button>
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
