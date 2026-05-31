package coursework.controller

import coursework.dto.*
import coursework.entity.Student
import coursework.repository.StudentRepository
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/students")
@CrossOrigin
@Tag(name = "Students", description = "CRUD operations for students")
class StudentController(private val repo: StudentRepository) {

    @GetMapping
    @Operation(summary = "Get all students", description = "Returns all students, optionally filtered by group")
    fun getAll(
        @Parameter(description = "Filter by group name, e.g. CS-101")
        @RequestParam(required = false) group: String?
    ): List<StudentDto> =
        (group?.let { repo.findByGroupName(it) } ?: repo.findAll()).map { it.toDto() }

    @GetMapping("/{id}")
    @Operation(summary = "Get student by ID")
    @ApiResponse(responseCode = "404", description = "Student not found")
    fun getById(@PathVariable id: Long) = findOrThrow(id).toDto()

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new student")
    @ApiResponse(responseCode = "201", description = "Student created")
    fun create(@RequestBody req: CreateStudentRequest) =
        repo.save(Student(firstName = req.firstName, lastName = req.lastName, email = req.email, groupName = req.groupName)).toDto()

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing student")
    @ApiResponse(responseCode = "404", description = "Student not found")
    fun update(@PathVariable id: Long, @RequestBody req: CreateStudentRequest): StudentDto {
        val existing = findOrThrow(id)
        return repo.save(existing.copy(firstName = req.firstName, lastName = req.lastName, email = req.email, groupName = req.groupName)).toDto()
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a student")
    fun delete(@PathVariable id: Long) = repo.deleteById(id)

    private fun findOrThrow(id: Long) = repo.findById(id).orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
    private fun Student.toDto() = StudentDto(id, firstName, lastName, email, groupName)
}
