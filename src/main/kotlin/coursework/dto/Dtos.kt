package coursework.dto

import java.time.LocalDate

data class CreateGradeRequest(val value: Int, val studentId: Long, val courseId: Long)
data class GradeDto(val id: Long, val value: Int, val date: LocalDate, val studentId: Long?, val courseId: Long?)

data class CreateAssignmentRequest(val title: String, val description: String, val dueDate: LocalDate?, val courseId: Long)
data class AssignmentDto(val id: Long, val title: String, val description: String, val dueDate: LocalDate?, val courseId: Long?)

data class CreateCourseRequest(val name: String, val description: String, val teacher: String)
data class CourseDto(val id: Long, val name: String, val description: String, val teacher: String)

data class CreateStudentRequest(val firstName: String, val lastName: String, val email: String, val groupName: String)
data class StudentDto(val id: Long, val firstName: String, val lastName: String, val email: String, val groupName: String)

