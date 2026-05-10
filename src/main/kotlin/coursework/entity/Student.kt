package coursework.entity

import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

@Entity
@Table(name = "students")
data class Student(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @field:NotBlank
    val firstName: String = "",

    @field:NotBlank
    val lastName: String = "",

    @field:Email @field:NotBlank
    @Column(unique = true)
    val email: String = "",

    val groupName: String = "",

    @OneToMany(mappedBy = "student", cascade = [CascadeType.ALL], orphanRemoval = true)
    val grades: MutableList<Grade> = mutableListOf()
)
