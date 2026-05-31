package coursework.controller

import coursework.dto.*
import coursework.entity.Grade
import coursework.repository.CourseRepository
import coursework.repository.GradeRepository
import coursework.repository.StudentRepository
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/grades")
@CrossOrigin
@Tag(name = "Grades", description = "CRUD operations for grades")
class GradeController(
    private val repo: GradeRepository,
    private val studentRepo: StudentRepository,
    private val courseRepo: CourseRepository
) {

    @GetMapping
    @Operation(summary = "Get all grades", description = "Optionally filter by student ID or course ID")
    fun getAll(
        @Parameter(description = "Filter by student ID") @RequestParam(required = false) studentId: Long?,
        @Parameter(description = "Filter by course ID")  @RequestParam(required = false) courseId: Long?
    ): List<GradeDto> = when {
        studentId != null -> repo.findByStudentId(studentId)
        courseId  != null -> repo.findByCourseId(courseId)
        else              -> repo.findAll()
    }.map { it.toDto() }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new grade")
    fun create(@RequestBody req: CreateGradeRequest): GradeDto {
        val student = studentRepo.findById(req.studentId).orElseThrow { ResponseStatusException(HttpStatus.BAD_REQUEST, "Student not found") }
        val course  = courseRepo.findById(req.courseId).orElseThrow  { ResponseStatusException(HttpStatus.BAD_REQUEST, "Course not found") }
        return repo.save(Grade(value = req.value, student = student, course = course)).toDto()
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing grade")
    fun update(@PathVariable id: Long, @RequestBody req: CreateGradeRequest): GradeDto {
        val existing = repo.findById(id).orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
        val student  = studentRepo.findById(req.studentId).orElseThrow { ResponseStatusException(HttpStatus.BAD_REQUEST, "Student not found") }
        val course   = courseRepo.findById(req.courseId).orElseThrow  { ResponseStatusException(HttpStatus.BAD_REQUEST, "Course not found") }
        return repo.save(existing.copy(value = req.value, student = student, course = course)).toDto()
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a grade")
    fun delete(@PathVariable id: Long) = repo.deleteById(id)

    private fun Grade.toDto() = GradeDto(id, value, date, student?.id, course?.id)
}
