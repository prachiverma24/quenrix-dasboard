export const mockNotes = [
  {
    id: 'html-basics',
    title: 'HTML - HyperText Markup Language',
    tech: 'HTML',
    definition: 'HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages.',
    explanation: 'HTML provides the structure of a webpage. It consists of a series of elements (tags) that tell the browser how to display the content. Imagine HTML as the skeleton of a human body, providing the frame upon which CSS (muscles/skin) and JavaScript (brain/actions) are added.',
    syntax: '<tagname>Content goes here...</tagname>',
    process: 'Browser reads HTML -> Creates DOM (Document Object Model) -> Renders on Screen.',
    realWorldExample: 'Think of a newspaper. The main headline is an <h1>, subheadings are <h2>, paragraphs are <p>, and images are <img>. HTML organizes content just like a newspaper layout.',
    codeExample: `<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Welcome to Quenrix</h1>
    <p>This is a paragraph of text.</p>
</body>
</html>`,
    outputExample: 'A webpage with a large bold heading saying "Welcome to Quenrix" and a normal text paragraph below it.',
    useCases: [
      'Building the skeleton of web pages',
      'Structuring content for SEO',
      'Creating forms for user input'
    ],
    advantages: [
      'Easy to learn and use',
      'Supported by all browsers',
      'Lightweight and fast'
    ],
    disadvantages: [
      'Cannot create dynamic functionality alone',
      'Security features are limited',
      'Requires a lot of code for complex layouts'
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between HTML and XHTML?',
        answer: 'XHTML is more strict than HTML and requires tags to be closed, lowercase, and properly nested.'
      },
      {
        question: 'What are semantic elements?',
        answer: 'Elements that clearly describe their meaning to both the browser and the developer (e.g., <form>, <table>, <article>).'
      }
    ],
    commonMistakes: [
      'Forgetting to close tags',
      'Using block elements inside inline elements improperly',
      'Not using alt attributes for images'
    ],
    bestPractices: [
      'Always use semantic tags',
      'Keep your code indented and clean',
      'Always include the <!DOCTYPE html> declaration'
    ],
    summary: 'HTML is the foundation of web development. Master semantic tags and document structure first.'
  },
  {
    id: 'react-basics',
    title: 'React - A JavaScript Library for Building User Interfaces',
    tech: 'React',
    definition: 'React is a free and open-source front-end JavaScript library for building user interfaces based on components.',
    explanation: 'React allows developers to create large web applications that can change data, without reloading the page. The main goal of React is to be extensive, fast, and simple. It uses a Virtual DOM to optimize rendering.',
    syntax: 'function MyComponent() { return <h1>Hello World</h1>; }',
    process: 'State Change -> Virtual DOM updates -> Diffing Algorithm -> Real DOM updates efficiently.',
    realWorldExample: 'Think of a Facebook feed. When you like a post, only the like count updates, not the whole page. This is React updating a specific component.',
    codeExample: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
    outputExample: 'A text saying "You clicked 0 times" and a button. Clicking the button increments the number.',
    useCases: [
      'Single Page Applications (SPAs)',
      'Complex, data-driven user interfaces',
      'Reusable UI components'
    ],
    advantages: [
      'Virtual DOM for fast rendering',
      'Component-based architecture',
      'Strong community and ecosystem'
    ],
    disadvantages: [
      'High pace of development (things change fast)',
      'JSX can be confusing for beginners',
      'Only covers the view layer (need other libraries for routing, state management, etc.)'
    ],
    interviewQuestions: [
      {
        question: 'What are hooks in React?',
        answer: 'Hooks are functions that let you "hook into" React state and lifecycle features from function components.'
      },
      {
        question: 'What is the Virtual DOM?',
        answer: 'The virtual DOM (VDOM) is a programming concept where an ideal, or "virtual", representation of a UI is kept in memory and synced with the "real" DOM by a library such as ReactDOM.'
      }
    ],
    commonMistakes: [
      'Mutating state directly instead of using setState',
      'Forgetting the dependency array in useEffect',
      'Not using keys in lists'
    ],
    bestPractices: [
      'Keep components small and focused',
      'Use functional components and hooks',
      'Lift state up when necessary'
    ],
    summary: 'React is component-based and uses Virtual DOM for efficiency. Master hooks and state management.'
  }
];
