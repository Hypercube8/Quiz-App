import Quiz, { JoinBoard, QuizGame } from "@/components/quiz"

export default function Page() {
  return (
    // <Quiz questions={[
    //   {
    //     text: "This is a question?",
    //     answers: [
    //       { text: "No", correct: false },
    //       { text: "Yes", correct: true },
    //       { text: "Maybe", correct: false },
    //       { text: "Likely", correct: false }
    //     ]
    //   },
    //   {
    //     text: "Which of the following is not a valid java primitive type?",
    //     answers: [
    //       { text: "int", correct: false },
    //       { text: "float", correct: false },
    //       { text: "bool", correct: true },
    //       { text: "char", correct: false }
    //     ]
    //   }
    // ]} />
    // <JoinBoard host players={
    //   [
    //     { name: "John Doe", email: "JDoeAtGmail.com" },
    //     { name: "John Doe", email: "JDoeAtGmail.com" },
    //     { name: "John Doe", email: "JDoeAtGmail.com" },
    //     { name: "John Doe", email: "JDoeAtGmail.com" },
    //     { name: "Zohn Doe", email: "JDoeAtGmail.com" },
    //     { name: "John Doe", email: "JDoeAtGmail.com" },
    //     { name: "John Doe", email: "JDoeAtGmail.com" },
    //     { name: "John Doe", email: "JDoeAtGmail.com" },
    //     { name: "John Doe", email: "JDoeAtGmail.com" },
    //   ]
    // } />
    <QuizGame />
  )
}
