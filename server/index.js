const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

// GraphQL Schema
const typeDefs = gql`
  type Student {
    id: ID!
    name: String!
    age: Int!
    class: String!
  }

  type Query {
    students: [Student]
    student(id: ID!): Student
  }

  type Mutation {
    addStudent(name: String!, age: Int!, class: String!): Student
    updateStudent(id: ID!, name: String, age: Int, class: String): Student
    deleteStudent(id: ID!): String
  }
`;

// In-memory Data
let students = [
  { id: '1', name: 'John Doe', age: 21, class: 'Physics' },
  { id: '2', name: 'Jane Doe', age: 22, class: 'Chemistry' },
];

// GraphQL Resolvers
const resolvers = {
  Query: {
    students: () => students,
    student: (_, { id }) => students.find(student => student.id === id),
  },
  Mutation: {
    addStudent: (_, { name, age, class: studentClass }) => {
      const newStudent = {
        id: String(students.length + 1),
        name,
        age,
        class: studentClass,
      };
      students.push(newStudent);
      return newStudent;
    },
    updateStudent: (_, { id, name, age, class: studentClass }) => {
      const student = students.find(student => student.id === id);
      if (!student) throw new Error('Student not found');
      student.name = name || student.name;
      student.age = age || student.age;
      student.class = studentClass || student.class;
      return student;
    },
    deleteStudent: (_, { id }) => {
      students = students.filter(student => student.id !== id);
      return `Student with id ${id} deleted`;
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(res => {
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
