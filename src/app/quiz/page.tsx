import { redirect } from 'next/navigation';

export default function QuizRootRedirect() {
  redirect('/quiz/welcome');
  return null;
}
