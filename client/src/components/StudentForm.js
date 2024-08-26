import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation, gql } from '@apollo/client';
import { addStudent, updateStudent } from '../redux/slices/studentSlice';

const ADD_STUDENT_MUTATION = gql`
  mutation AddStudent($name: String!, $age: Int!, $class: String!) {
    addStudent(name: $name, age: $age, class: $class) {
      id
      name
      age
      class
    }
  }
`;

const UPDATE_STUDENT_MUTATION = gql`
  mutation UpdateStudent($id: ID!, $name: String, $age: Int, $class: String) {
    updateStudent(id: $id, name: $name, age: $age, class: $class) {
      id
      name
      age
      class
    }
  }
`;

const StudentForm = ({ student, onSave }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const dispatch = useDispatch();

  const [addStudentMutation] = useMutation(ADD_STUDENT_MUTATION);
  const [updateStudentMutation] = useMutation(UPDATE_STUDENT_MUTATION);

  // Effect to set form values when a student is passed in for editing
  useEffect(() => {
    if (student) {
      setName(student.name);
      setAge(student.age.toString());
      setStudentClass(student.class);
    } else {
      // Clear form when no student is selected (for adding new student)
      setName('');
      setAge('');
      setStudentClass('');
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (student) {
      const { data } = await updateStudentMutation({
        variables: { id: student.id, name, age: parseInt(age), class: studentClass },
      });
      dispatch(updateStudent(data.updateStudent));
    } else {
      const { data } = await addStudentMutation({
        variables: { name, age: parseInt(age), class: studentClass },
      });
      dispatch(addStudent(data.addStudent));
    }

    if (onSave) {
      onSave();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Class"
        value={studentClass}
        onChange={(e) => setStudentClass(e.target.value)}
        required
      />
      <button type="submit">{student ? 'Update' : 'Add'} Student</button>
    </form>
  );
};

export default StudentForm;
