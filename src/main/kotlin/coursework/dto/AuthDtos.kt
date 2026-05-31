package coursework.dto

data class LoginRequest(val username: String, val password: String)
data class RegisterRequest(val username: String, val password: String, val role: String = "STUDENT")
data class AuthResponse(val token: String, val username: String, val role: String)
