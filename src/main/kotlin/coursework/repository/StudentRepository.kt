package coursework.repository

import coursework.entity.Student
import org.springframework.data.jpa.repository.JpaRepository

interface StudentRepository : JpaRepository<Student, Long> {
    fun findByGroupName(groupName: String): List<Student>
}

