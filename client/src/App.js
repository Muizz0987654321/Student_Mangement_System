import React from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import StudentList from './components/StudentList';
import { store } from './redux/store/store';
import { client } from './apolloClient';
import './App.css';


function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <div className="App">
          <h1>Student Management System</h1>
          <StudentList />
        </div>
      </Provider>
    </ApolloProvider>
  );
}

export default App;
