package coursework.controller

import coursework.dto.*
import coursework.entity.Assignment
import coursework.repository.AssignmentRepository
import coursework.repository.CourseRepository
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin
@Tag(name = "Assignments", description = "CRUD operations for assignments")
class AssignmentController(
    private val repo: AssignmentRepository,
    private val courseRepo: CourseRepository
) {

    @GetMapping
    @Operation(summary = "Get all assignments", description = "Optionally filter by course ID")
    fun getAll(
        @Parameter(description = "Filter by course ID")
        @RequestParam(required = false) courseId: Long?
    ): List<AssignmentDto> =
        (if (courseId != null) repo.findByCourseId(courseId) else repo.findAll()).map { it.toDto() }

    @GetMapping("/{id}")
    @Operation(summary = "Get assignment by ID")
    fun getById(@PathVariable id: Long) = findOrThrow(id).toDto()

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new assignment")
    fun create(@RequestBody req: CreateAssignmentRequest): AssignmentDto {
        val course = courseRepo.findById(req.courseId).orElseThrow { ResponseStatusException(HttpStatus.BAD_REQUEST, "Course not found") }
        return repo.save(Assignment(title = req.title, description = req.description, dueDate = req.dueDate, course = course)).toDto()
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing assignment")
    fun update(@PathVariable id: Long, @RequestBody req: CreateAssignmentRequest): AssignmentDto {
        val existing = findOrThrow(id)
        val course = courseRepo.findById(req.courseId).orElseThrow { ResponseStatusException(HttpStatus.BAD_REQUEST, "Course not found") }
        return repo.save(existing.copy(title = req.title, description = req.description, dueDate = req.dueDate, course = course)).toDto()
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an assignment")
    fun delete(@PathVariable id: Long) = repo.deleteById(id)

    private fun findOrThrow(id: Long) = repo.findById(id).orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
    private fun Assignment.toDto() = AssignmentDto(id, title, description, dueDate, course?.id)
}
