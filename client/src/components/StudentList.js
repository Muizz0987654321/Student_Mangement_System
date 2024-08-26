import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, gql, useMutation } from '@apollo/client';
import { setStudents, deleteStudent } from '../redux/slices/studentSlice';
import StudentForm from './StudentForm';

const GET_STUDENTS_QUERY = gql`
  query GetStudents {
    students {
      id
      name
      age
      class
    }
  }
`;

const DELETE_STUDENT_MUTATION = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id)
  }
`;

const StudentList = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students.students);
  const [selectedStudent, setSelectedStudent] = React.useState(null);

  const { loading, error } = useQuery(GET_STUDENTS_QUERY, {
    onCompleted: (data) => {
      dispatch(setStudents(data.students));
    },
  });

  const [deleteStudentMutation] = useMutation(DELETE_STUDENT_MUTATION);

  const handleDelete = async (id) => {
    await deleteStudentMutation({ variables: { id } });
    dispatch(deleteStudent(id));
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
  };

  const handleSave = () => {
    setSelectedStudent(null); // Reset after saving
  };

  const handleCreateNewStudent = () => {
    setSelectedStudent(null); // Clear form for creating a new student
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading students.</p>;

  return (
    <div>
      <button onClick={handleCreateNewStudent} className="create-new-button">
        Create New Student
      </button>
      <StudentForm student={selectedStudent} onSave={handleSave} />
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <div>
              {student.name} ({student.age}, {student.class})
            </div>
            <div className="button-container">
              <button onClick={() => handleEdit(student)}>Edit</button>
              <button onClick={() => handleDelete(student.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
