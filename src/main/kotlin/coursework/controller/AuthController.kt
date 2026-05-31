package coursework.controller

import coursework.dto.AuthResponse
import coursework.dto.LoginRequest
import coursework.dto.RegisterRequest
import coursework.entity.User
import coursework.repository.UserRepository
import coursework.security.JwtUtils
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Registration and login")
class AuthController(
    private val userRepo: UserRepository,
    private val encoder: PasswordEncoder,
    private val jwtUtils: JwtUtils
) {

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register a new user")
    fun register(@RequestBody req: RegisterRequest): AuthResponse {
        if (userRepo.existsByUsername(req.username))
            throw ResponseStatusException(HttpStatus.CONFLICT, "Username already taken")

        val role = if (req.role.uppercase() == "TEACHER") "TEACHER" else "STUDENT"
        val user = userRepo.save(
            User(username = req.username, password = encoder.encode(req.password)!!, role = role)
        )
        val token = jwtUtils.generateToken(user.username, user.role)
        return AuthResponse(token, user.username, user.role)
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive JWT token")
    fun login(@RequestBody req: LoginRequest): AuthResponse {
        val user = userRepo.findByUsername(req.username)
            .orElseThrow { ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password") }

        if (!encoder.matches(req.password, user.password))
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password")

        val token = jwtUtils.generateToken(user.username, user.role)
        return AuthResponse(token, user.username, user.role)
    }
}
