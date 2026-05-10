package coursework.controller

import coursework.dto.*
import coursework.entity.Student
import coursework.repository.StudentRepository
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/students")
@CrossOrigin
class StudentController(private val repo: StudentRepository) {

    @GetMapping
    fun getAll(@RequestParam(required = false) group: String?): List<StudentDto> =
        (if (group != null) repo.findByGroupName(group) else repo.findAll())
            .map { it.toDto() }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long) = findOrThrow(id).toDto()

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody req: CreateStudentRequest) =
        repo.save(Student(firstName = req.firstName, lastName = req.lastName, email = req.email, groupName = req.groupName)).toDto()

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody req: CreateStudentRequest): StudentDto {
        val existing = findOrThrow(id)
        return repo.save(existing.copy(firstName = req.firstName, lastName = req.lastName, email = req.email, groupName = req.groupName)).toDto()
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) = repo.deleteById(id)

    private fun findOrThrow(id: Long) = repo.findById(id).orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
    private fun Student.toDto() = StudentDto(id, firstName, lastName, email, groupName)
}

