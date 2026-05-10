package coursework.controller

import coursework.dto.*
import coursework.entity.Course
import coursework.repository.CourseRepository
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/courses")
@CrossOrigin
class CourseController(private val repo: CourseRepository) {

    @GetMapping
    fun getAll(): List<CourseDto> = repo.findAll().map { it.toDto() }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long) = findOrThrow(id).toDto()

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody req: CreateCourseRequest) =
        repo.save(Course(name = req.name, description = req.description, teacher = req.teacher)).toDto()

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody req: CreateCourseRequest): CourseDto {
        val existing = findOrThrow(id)
        return repo.save(existing.copy(name = req.name, description = req.description, teacher = req.teacher)).toDto()
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) = repo.deleteById(id)

    private fun findOrThrow(id: Long) = repo.findById(id).orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
    private fun Course.toDto() = CourseDto(id, name, description, teacher)
}

