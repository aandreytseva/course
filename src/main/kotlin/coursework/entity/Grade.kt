package coursework.entity

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "grades")
data class Grade(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val value: Int = 0,

    val date: LocalDate = LocalDate.now(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    val student: Student? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    val course: Course? = null
)

