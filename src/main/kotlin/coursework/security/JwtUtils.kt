package coursework.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Date
import javax.crypto.SecretKey

@Component
class JwtUtils {

    @Value("\${app.jwt.secret}")
    private lateinit var secret: String

    @Value("\${app.jwt.expiration-ms}")
    private var expirationMs: Long = 86400000

    private val key: SecretKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray())
    }

    fun generateToken(username: String, role: String): String =
        Jwts.builder()
            .subject(username)
            .claim("role", role)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + expirationMs))
            .signWith(key)
            .compact()

    fun extractUsername(token: String): String = claims(token).subject

    fun extractRole(token: String): String = claims(token).get("role", String::class.java)

    fun isValid(token: String): Boolean = runCatching {
        claims(token).expiration.after(Date())
    }.getOrDefault(false)

    private fun claims(token: String): Claims =
        Jwts.parser().verifyWith(key).build().parseSignedClaims(token).payload
}
