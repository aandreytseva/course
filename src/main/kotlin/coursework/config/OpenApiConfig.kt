package coursework.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Contact
import io.swagger.v3.oas.models.info.Info
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfig {

    @Bean
    fun openApi(): OpenAPI = OpenAPI()
        .info(
            Info()
                .title("Student Activity Management API")
                .description("REST API for managing students, courses, assignments and grades")
                .version("1.0.0")
                .contact(Contact().name("EduTrack").email("admin@uni.edu"))
        )
}
