import React, { useState, useEffect } from 'react';
import {
  Box, Heading, Text, Button, Stack, Flex, Table, Thead, Tbody, Tr, Th, Td, useDisclosure, Collapse, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Input, FormLabel, FormControl
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css'; // Importing styles for DatePicker
import './Dashboard.css'; // Import the CSS file with the gradient background

interface Enrollment {
  courseName: string;
  completionStatus: string;
  progress?: number;
}

interface Course {
  courseId: number;
  courseName: string;
  description: string;
  maxSeats: number;
  currentSeats: number;
  startDate: string;
  endDate: string;
}

interface Student {
  studentId: number;
  fullName: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fullName, userId, userType } = location.state || {};

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentEnrollments, setSelectedStudentEnrollments] = useState<Enrollment[]>([]);
  const [selectedStudentName, setSelectedStudentName] = useState<string | null>(null);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<Course | null>(null);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/Course/ShowAllCourses');
        setAvailableCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [userType]);

  const handleLogout = () => {
    navigate('/');
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'green.300';
    if (progress < 60) return 'red.300';
    if (progress < 90) return 'yellow.300';
    return 'teal.300';
  };

  return (
    <Flex minHeight="100vh" align="center" justify="center" className="gradient-background">
      <Box p={8} maxWidth="1200px" width="100%" borderWidth={1} borderRadius={8} boxShadow="lg" bg="white">
        <Heading as="h2" size="xl" mb={6} textAlign="center" color="pink.600">
          {userType === 1 ? 'Admin Dashboard' : 'Student Dashboard'}
        </Heading>

        <Heading as="h6" size="l" mb={5} textAlign="center" color="gray.600">
          User ID: {userId}, <i><b>{fullName}</b></i>
        </Heading>

        {userType === 1 ? (
          <>
            <Heading as="h3" size="md" mb={4} color="teal.600">
              List of Students
            </Heading>
            <Flex justifyContent="space-between" alignItems="center">
              <Table variant="simple" size="md" width="100%">
                <Thead bg="gray.100">
                  <Tr>
                    <Th>Student ID</Th>
                    <Th>Full Name</Th>
                    <Th>Email</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <Tr key={student.studentId}>
                        <Td>{student.studentId}</Td>
                        <Td>{student.fullName}</Td>
                        <Td>{student.email}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={3} textAlign="center">
                        No students found.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Flex>

            <Heading as="h3" size="md" mb={4} mt={8} color="teal.600">
              List of Courses
            </Heading>
            <Collapse in={isCoursesOpen}>
              <Table variant="simple" size="md" width="100%">
                <Thead bg="gray.100">
                  <Tr>
                    <Th>Course ID</Th>
                    <Th>Course Name</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {availableCourses.length > 0 ? (
                    availableCourses.map((course) => (
                      <Tr key={course.courseId}>
                        <Td>{course.courseId}</Td>
                        <Td>{course.courseName}</Td>
                        <Td>{course.description}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={3} textAlign="center">
                        No courses found.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Collapse>
          </>
        ) : (
          <>
            <Heading as="h3" size="md" mb={4} color="teal.600">
              Active Courses
            </Heading>
            <Flex overflowX="auto" direction="row" gap={4}>
              {enrollments.length > 0 ? (
                enrollments.map((enrollment, index) => (
                  <Box key={index} minWidth="250px" p={4} borderWidth={1} borderRadius={8} bg={getProgressColor(enrollment.progress!)} textAlign="center">
                    <Heading size="sm">{enrollment.courseName}</Heading>
                    <Text mt={2}>Progress: {enrollment.progress}%</Text>
                  </Box>
                ))
              ) : (
                <Text>No active classes found.</Text>
              )}
            </Flex>
          </>
        )}

        <Flex justifyContent="flex-end" mt={6}>
          <Button colorScheme="red" size="md" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Dashboard;
