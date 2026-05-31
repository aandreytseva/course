package coursework.controller

import coursework.dto.*
import coursework.entity.Course
import coursework.repository.CourseRepository
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/courses")
@CrossOrigin
@Tag(name = "Courses", description = "CRUD operations for courses")
class CourseController(private val repo: CourseRepository) {

    @GetMapping
    @Operation(summary = "Get all courses")
    fun getAll(): List<CourseDto> = repo.findAll().map { it.toDto() }

    @GetMapping("/{id}")
    @Operation(summary = "Get course by ID")
    @ApiResponse(responseCode = "404", description = "Course not found")
    fun getById(@PathVariable id: Long) = findOrThrow(id).toDto()

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new course")
    fun create(@RequestBody req: CreateCourseRequest) =
        repo.save(Course(name = req.name, description = req.description, teacher = req.teacher)).toDto()

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing course")
    fun update(@PathVariable id: Long, @RequestBody req: CreateCourseRequest): CourseDto {
        val existing = findOrThrow(id)
        return repo.save(existing.copy(name = req.name, description = req.description, teacher = req.teacher)).toDto()
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a course")
    fun delete(@PathVariable id: Long) = repo.deleteById(id)

    private fun findOrThrow(id: Long) = repo.findById(id).orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
    private fun Course.toDto() = CourseDto(id, name, description, teacher)
}
