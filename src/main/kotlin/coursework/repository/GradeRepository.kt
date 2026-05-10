package coursework.repository

import coursework.entity.Grade
import org.springframework.data.jpa.repository.JpaRepository

interface GradeRepository : JpaRepository<Grade, Long> {
    fun findByStudentId(studentId: Long): List<Grade>
    fun findByCourseId(courseId: Long): List<Grade>
}

